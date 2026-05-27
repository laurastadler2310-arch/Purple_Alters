import { router, useSegments } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

const MENU_WIDTH = 260;
const MENU_ITEMS = [
  { label: "Home", route: "/" },
  { label: "Manage Alters", route: "/manage" },
  { label: "Friends", route: "/friends" },
  { label: "Custom Fields", route: "/custom-fields" },
  { label: "Chats", route: "/chats" },
];

type SidebarLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function SidebarLayout({ title, children }: SidebarLayoutProps) {
  const [open, setOpen] = useState(false);
  const slide = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const segments = useSegments();

  const activeRoute = useMemo(() => {
    const lastSegment = segments[segments.length - 1];
    if (!lastSegment || lastSegment === "index") return "/";
    return `/${lastSegment}`;
  }, [segments]);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: open ? 0 : -MENU_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [open, slide]);

  const handleNavigate = (route: string) => {
    setOpen(false);
    router.push(route);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => setOpen((value) => !value)} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>{open ? "Close" : "Menu"}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.content}>{children}</View>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slide }] }]}>
        <Text style={styles.sidebarTitle}>Navigation</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12 }}>
          {MENU_ITEMS.map((item) => {
            const active = item.route === activeRoute;
            return (
              <Pressable
                key={item.route}
                onPress={() => handleNavigate(item.route)}
                style={[styles.sidebarItem, active && styles.sidebarItemActive]}
              >
                <Text style={[styles.sidebarItemText, active && styles.sidebarItemTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {open && <Pressable onPress={() => setOpen(false)} style={styles.overlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111827",
  },
  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  menuButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#2563EB",
    borderRadius: 14,
  },
  menuButtonText: {
    color: "white",
    fontWeight: "700",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: "#0F172A",
    borderRightWidth: 1,
    borderRightColor: "#1F2937",
    padding: 20,
    zIndex: 20,
  },
  sidebarTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  sidebarItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: "#111827",
  },
  sidebarItemActive: {
    backgroundColor: "#2563EB",
  },
  sidebarItemText: {
    color: "#E2E8F0",
    fontSize: 16,
  },
  sidebarItemTextActive: {
    color: "white",
    fontWeight: "700",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 10,
  },
});
