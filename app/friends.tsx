import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import SidebarLayout from "../components/SidebarLayout";
import { useAppData } from "./AppDataContext";

export default function FriendsScreen() {
  const { alters, people, toggleFriend, addPerson } = useAppData();
  const [selectedAlterId, setSelectedAlterId] = useState<string>(alters[0]?.id ?? "");
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonAvatar, setNewPersonAvatar] = useState("");

  const selectedAlter = useMemo(
    () => alters.find((alter) => alter.id === selectedAlterId) ?? null,
    [alters, selectedAlterId]
  );

  const friends = useMemo(
    () =>
      selectedAlter
        ? people.filter((person) => selectedAlter.friendIds.includes(person.id))
        : [],
    [selectedAlter, people]
  );

  const saveNewPerson = () => {
    if (!newPersonName.trim()) return;
    addPerson({
      id: `person-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: newPersonName.trim(),
      avatarUrl: newPersonAvatar.trim(),
      online: true,
      bio: "New online friend",
    });
    setNewPersonName("");
    setNewPersonAvatar("");
  };

  return (
    <SidebarLayout title="Friend Network">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
      <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
        Friend network
      </Text>

      <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 16, lineHeight: 24 }}>
        Select an alter and add friends from the online people list.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
        {alters.map((alter) => {
          const active = alter.id === selectedAlterId;
          return (
            <Pressable
              key={alter.id}
              onPress={() => setSelectedAlterId(alter.id)}
              style={{
                backgroundColor: active ? alter.color : "#1F2937",
                borderWidth: 1,
                borderColor: active ? "transparent" : "#374151",
                borderRadius: 16,
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: active ? "white" : "#D1D5DB", fontWeight: active ? "700" : "500" }}>
                {alter.name || "Unnamed"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedAlter ? (
        <>
          <Text style={{ color: "white", marginTop: 24, fontSize: 18, fontWeight: "700" }}>
            Friends for {selectedAlter.name}
          </Text>

          <View style={{ marginTop: 16, gap: 12 }}>
            {people.map((person) => {
              const isFriend = selectedAlter.friendIds.includes(person.id);
              return (
                <View
                  key={person.id}
                  style={{
                    backgroundColor: "#1F2937",
                    borderRadius: 20,
                    padding: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
                      {person.name}
                    </Text>
                    <Text style={{ color: "#9CA3AF", marginTop: 4 }}>{person.bio}</Text>
                  </View>

                  <Pressable
                    onPress={() => toggleFriend(selectedAlter.id, person.id)}
                    style={{
                      backgroundColor: isFriend ? "#EF4444" : "#2563EB",
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      {isFriend ? "Unfriend" : "Add friend"}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Text style={{ color: "white", marginTop: 24, fontSize: 18, fontWeight: "700" }}>
            Add an online person
          </Text>

          <View style={{ marginTop: 16, backgroundColor: "#1F2937", borderRadius: 20, padding: 16 }}>
            <Text style={{ color: "#D1D5DB", marginBottom: 12 }}>Enter a display name and optional avatar URL.</Text>
            <TextInput
              value={newPersonName}
              onChangeText={setNewPersonName}
              placeholder="Friend name"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#111827",
                borderRadius: 16,
                paddingHorizontal: 16,
                color: "white",
                height: 48,
                marginBottom: 12,
              }}
            />
            <TextInput
              value={newPersonAvatar}
              onChangeText={setNewPersonAvatar}
              placeholder="Avatar URL"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#111827",
                borderRadius: 16,
                paddingHorizontal: 16,
                color: "white",
                height: 48,
                marginBottom: 16,
              }}
            />
            <Pressable
              onPress={saveNewPerson}
              style={{
                backgroundColor: "#10B981",
                padding: 14,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Create online person</Text>
            </Pressable>
          </View>

          <Text style={{ color: "#9CA3AF", marginTop: 20, fontSize: 14 }}>
            New online people can be friended by alters and become part of your network.
          </Text>
        </>
      ) : (
        <Text style={{ color: "#D1D5DB", marginTop: 24 }}>Select an alter to manage its friends.</Text>
      )}
    </ScrollView>
  </SidebarLayout>
  );
}
