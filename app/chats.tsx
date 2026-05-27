import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import SidebarLayout from "../components/SidebarLayout";
import { getThreadKey, type Message } from "../constants/alters";
import { useAppData } from "../contexts";

export default function ChatsScreen() {
  const { alters, chatThreads, addMessage } = useAppData();
  const [activeThreadKey, setActiveThreadKey] = useState<string>("");
  const [messageText, setMessageText] = useState("");

  const threadKeys = useMemo(() => Object.keys(chatThreads).sort(), [chatThreads]);

  useEffect(() => {
    if (!activeThreadKey && threadKeys.length > 0) {
      setActiveThreadKey(threadKeys[0]);
    }
  }, [activeThreadKey, threadKeys]);

  const threadParticipants = useMemo(() => {
    if (!activeThreadKey) return [];
    return activeThreadKey.split("-").map((id) => alters.find((alter) => alter.id === id));
  }, [activeThreadKey, alters]);

  const activeMessages = activeThreadKey ? chatThreads[activeThreadKey] ?? [] : [];
  const activeThreadName = threadParticipants
    .filter(Boolean)
    .map((alter) => alter?.name ?? "Unknown")
    .join(" & ");

  const allThreadKeys = useMemo(() => {
    const keys = new Set(threadKeys);
    const pairs: string[] = [];

    for (let i = 0; i < alters.length; i += 1) {
      for (let j = i + 1; j < alters.length; j += 1) {
        pairs.push(getThreadKey(alters[i].id, alters[j].id));
      }
    }

    return pairs;
  }, [alters, threadKeys]);

  const availableThreads = useMemo(
    () => allThreadKeys.map((key) => ({
      key,
      label: key
        .split("-")
        .map((id) => alters.find((alter) => alter.id === id)?.name ?? id)
        .join(" & "),
      hasMessages: Boolean(chatThreads[key]?.length),
    })),
    [allThreadKeys, alters, chatThreads]
  );

  const sendMessage = () => {
    if (!activeThreadKey || !messageText.trim()) return;
    const message: Message = {
      id: `${Date.now()}`,
      sender: threadParticipants[0]?.id ?? "system",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    addMessage(activeThreadKey, message);
    setMessageText("");
  };

  return (
    <SidebarLayout title="Chats">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>Chat hub</Text>
        <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 16, lineHeight: 24 }}>
          Browse existing conversations or start a new thread between alters.
        </Text>

        <View style={{ marginTop: 24 }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>All threads</Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            {availableThreads.map((thread) => {
              const active = thread.key === activeThreadKey;
              return (
                <Pressable
                  key={thread.key}
                  onPress={() => setActiveThreadKey(thread.key)}
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    backgroundColor: active ? "#1D4ED8" : "#111827",
                    borderWidth: 1,
                    borderColor: active ? "#2563EB" : "#374151",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: active ? "700" : "600" }}>
                    {thread.label}
                  </Text>
                  <Text style={{ color: "#9CA3AF", marginTop: 6 }}>
                    {thread.hasMessages ? `${chatThreads[thread.key].length} messages` : "New chat"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {!activeThreadKey ? (
          <Text style={{ color: "#9CA3AF", marginTop: 20 }}>
            Select a thread to view the conversation.
          </Text>
        ) : (
          <View style={{ marginTop: 24 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>{activeThreadName}</Text>
            <View style={{ marginTop: 16, gap: 12 }}>
              {activeMessages.map((message) => {
                const isOwn = message.sender === threadParticipants[0]?.id;
                return (
                  <View
                    key={message.id}
                    style={{
                      alignSelf: isOwn ? "flex-end" : "flex-start",
                      backgroundColor: isOwn ? "#2563EB" : "#1F2937",
                      borderRadius: 18,
                      padding: 14,
                      maxWidth: "80%",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>{message.text}</Text>
                    <Text style={{ color: "#94A3B8", marginTop: 8, fontSize: 12, textAlign: "right" }}>
                      {message.timestamp}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center" }}>
              <TextInput
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message..."
                placeholderTextColor="#6B7280"
                style={{
                  flex: 1,
                  minHeight: 48,
                  backgroundColor: "#111827",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  color: "white",
                }}
              />
              <Pressable
                onPress={sendMessage}
                style={{
                  marginLeft: 12,
                  backgroundColor: "#10B981",
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Send</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SidebarLayout>
  );
}
