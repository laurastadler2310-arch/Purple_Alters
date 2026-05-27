import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";
import { getOtherAlters } from "../constants/alters";
import { useAppData } from "../contexts";

export default function AlterScreen() {
  const params = useLocalSearchParams();
  const alterId = typeof params.id === "string" ? params.id : "";
  const { alters, people, updateAlter } = useAppData();

  const alter = useMemo(
    () => alters.find((item) => item.id === alterId),
    [alterId, alters]
  );

  const otherAlters = useMemo(() => (alter ? getOtherAlters(alter.id, alters) : []), [alter, alters]);

  const friends = useMemo(
    () => (alter ? people.filter((person) => alter.friendIds.includes(person.id)) : []),
    [alter, people]
  );

  

  if (!alter) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#111827",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
          Select an alter from the dashboard to view their profile.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#111827" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            {alter.avatarUrl ? (
              <Image
                source={{ uri: alter.avatarUrl }}
                style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#374151" }}
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: alter.color,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 28, fontWeight: "700" }}>
                  {alter.name.charAt(0)}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>{alter.name}</Text>
              <Text style={{ color: "#D1D5DB", marginTop: 8, fontSize: 18 }}>{alter.pronouns}</Text>
              <Text style={{ color: "#9CA3AF", marginTop: 6, fontSize: 15 }}>{alter.role}</Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 24,
              backgroundColor: "#1F2937",
              padding: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: alter.color,
            }}
          >
            <Text style={{ color: "#D1D5DB", fontSize: 16, lineHeight: 22 }}>{alter.bio}</Text>
          </View>

          <View
            style={{
              marginTop: 24,
              backgroundColor: "#111827",
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#374151",
              padding: 20,
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>Custom fields</Text>
            {alter.fields.length === 0 ? (
              <Text style={{ color: "#9CA3AF", marginTop: 12 }}>No custom fields yet. Add them in Manage Alters.</Text>
            ) : (
              alter.fields.map((field) => (
                <View
                  key={field.id}
                  style={{
                    backgroundColor: "#111827",
                    borderRadius: 18,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "#374151",
                    marginTop: 14,
                  }}
                >
                  <Text style={{ color: "#9CA3AF", fontSize: 14 }}>{field.label}</Text>
                  <Text style={{ color: "white", marginTop: 6, fontSize: 16 }}>{field.value}</Text>
                </View>
              ))
            )}
          </View>

          {friends.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>Friends</Text>
              <View style={{ marginTop: 12, gap: 10 }}>
                {friends.map((person) => (
                  <View
                    key={person.id}
                    style={{
                      backgroundColor: "#1F2937",
                      borderRadius: 18,
                      padding: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>{person.name}</Text>
                      <Text style={{ color: "#9CA3AF", marginTop: 4 }}>{person.bio}</Text>
                    </View>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: person.online ? "#34D399" : "#9CA3AF",
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ marginTop: 30 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>Chat</Text>
            <Text style={{ color: "#9CA3AF", marginTop: 8 }}>
              Chat functionality is available in the Chats tab. Open the Chats tab to message alters.
            </Text>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}
