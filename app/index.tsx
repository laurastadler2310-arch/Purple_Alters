import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import AlterCard from "../components/AlterCard";
import SidebarLayout from "../components/SidebarLayout";
import { useAppData } from "./AppDataContext";

export default function HomeScreen() {
  const { alters } = useAppData();

  return (
    <SidebarLayout title="System Dashboard">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
          System Dashboard
        </Text>

        <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 16, lineHeight: 24 }}>
          Tap the menu to jump between Friends, Manage Alters, Custom Fields, and Chats.
        </Text>

        <View style={{ marginTop: 24, gap: 16 }}>
          {alters.map((alter) => (
            <AlterCard
              key={alter.id}
              name={alter.name}
              pronouns={alter.pronouns}
              color={alter.color}
              avatarUrl={alter.avatarUrl}
              onPress={() => router.push({ pathname: "/alter", params: { id: alter.id } })}
            />
          ))}
        </View>
      </ScrollView>
    </SidebarLayout>
  );
}
