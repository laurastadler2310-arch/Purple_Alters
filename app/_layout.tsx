import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AppDataProvider } from "../contexts/AppDataContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function AuthGate() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const activeSegment = segments[segments.length - 1] ?? "index";
  const isLoginRoute = activeSegment === "login";

  useEffect(() => {
    if (loading) return;

    if (!session && !isLoginRoute) {
      router.replace("/login");
    }

    if (session && isLoginRoute) {
      router.replace("/");
    }
  }, [loading, session, isLoginRoute, router]);

  return null;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AuthGate />
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
            name="login"
            options={{
              headerShown: false,
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
            name="friend-code"
            options={{
              title: "Friend Code",
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
    </AuthProvider>
  );
}
