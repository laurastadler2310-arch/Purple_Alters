import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import SidebarLayout from "../components/SidebarLayout";
import { useAuth } from "../contexts";

export default function FriendCodeScreen() {
  const { friendCode } = useAuth();

  return (
    <SidebarLayout title="Friend Code">
      <View style={{ padding: 24, flex: 1 }}>
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
          Your friend code
        </Text>

        <View style={{ marginTop: 20, backgroundColor: "#1F2937", padding: 20, borderRadius: 20 }}>
          <Text style={{ color: "#9CA3AF", fontSize: 16, marginBottom: 8 }}>
            Share this code with someone else so they can add you as a friend.
          </Text>
          <Text style={{ color: "#F8FAFC", fontSize: 24, fontWeight: "700" }}>
            {friendCode ?? "Generating your code..."}
          </Text>
        </View>

        <Text style={{ color: "#9CA3AF", marginTop: 24, fontSize: 16, lineHeight: 24 }}>
          To add someone else, open the Friends tab and enter their friend code.
        </Text>

        <Pressable
          onPress={() => router.push("/friends")}
          style={{
            marginTop: 24,
            backgroundColor: "#2563EB",
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Go to Friends</Text>
        </Pressable>
      </View>
    </SidebarLayout>
  );
}
