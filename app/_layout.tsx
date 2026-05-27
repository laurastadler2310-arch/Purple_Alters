import { Stack } from "expo-router";
import { AppDataProvider } from "./AppDataContext";

export default function Layout() {
  return (
    <AppDataProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#111827",
          },
          headerTintColor: "white",
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />

        <Stack.Screen
          name="alter"
          options={{
            title: "Alter",
            headerBackVisible: true,
            headerLeft: undefined,
          }}
        />

        <Stack.Screen
          name="manage"
          options={{
            title: "Manage Alters",
          }}
        />

        <Stack.Screen
          name="friends"
          options={{
            title: "Friends",
          }}
        />

        <Stack.Screen
          name="custom-fields"
          options={{
            title: "Custom Fields",
          }}
        />

        <Stack.Screen
          name="chats"
          options={{
            title: "Chats",
          }}
        />
      </Stack>
    </AppDataProvider>
  );
}
