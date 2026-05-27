import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import SidebarLayout from "../components/SidebarLayout";
import { useAppData } from "../contexts";

export default function FriendsScreen() {
  const { alters, people, toggleFriend, addPerson, addFriendByCode } = useAppData();
  const [selectedAlterId, setSelectedAlterId] = useState<string>(alters[0]?.id ?? "");
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonAvatar, setNewPersonAvatar] = useState("");
  const [friendCodeInput, setFriendCodeInput] = useState("");

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

  const myFriendIds = useMemo(() => new Set(alters.flatMap((alter) => alter.friendIds)), [alters]);
  const myFriends = useMemo(
    () => people.filter((person) => myFriendIds.has(person.id)),
    [people, myFriendIds]
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

  const addPersonByCode = () => {
    if (!friendCodeInput.trim()) return;

    const person = addFriendByCode(friendCodeInput.trim());
    if (!person) {
      Alert.alert("Friend code invalid", "Please enter a valid friend code.");
      return;
    }

    if (selectedAlter && !selectedAlter.friendIds.includes(person.id)) {
      toggleFriend(selectedAlter.id, person.id);
    }

    setFriendCodeInput("");
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

      <View style={{ marginTop: 24, backgroundColor: "#111827", borderRadius: 20, padding: 16 }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>Friends I have</Text>
        {myFriends.length === 0 ? (
          <Text style={{ color: "#9CA3AF", marginTop: 12 }}>
            You don't have any friends yet. Add someone by code or from the person list.
          </Text>
        ) : (
          <View style={{ marginTop: 12, gap: 12 }}>
            {myFriends.map((person) => (
              <View key={person.id} style={{ backgroundColor: "#1F2937", borderRadius: 16, padding: 12 }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>{person.name}</Text>
                <Text style={{ color: "#9CA3AF", marginTop: 4 }}>{person.bio}</Text>
              </View>
            ))}
          </View>
        )}
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
            Add a friend by code
          </Text>

          <View style={{ marginTop: 16, backgroundColor: "#1F2937", borderRadius: 20, padding: 16 }}>
            <Text style={{ color: "#D1D5DB", marginBottom: 12 }}>
              Enter another user's friend code to add them to your network.
            </Text>
            <TextInput
              value={friendCodeInput}
              onChangeText={setFriendCodeInput}
              placeholder="Friend code"
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
            <Pressable
              onPress={addPersonByCode}
              style={{
                backgroundColor: "#2563EB",
                padding: 14,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Add friend by code</Text>
            </Pressable>
          </View>

          <Text style={{ color: "#D1D5DB", marginTop: 24, fontSize: 18, fontWeight: "700" }}>
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
