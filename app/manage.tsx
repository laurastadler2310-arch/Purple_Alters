import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import SidebarLayout from "../components/SidebarLayout";
import { useAppData } from "./AppDataContext";

function createEmptyAlter() {
  return {
    id: "",
    name: "",
    pronouns: "",
    role: "",
    bio: "",
    color: "#8B5CF6",
    avatarUrl: "",
    fields: [],
    friendIds: [],
  };
}

function hexToRgb(hex: string | undefined | null) {
  if (!hex) return null;
  let h = hex.replace(/^#/, "");
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export default function ManageScreen() {
  const { alters, updateAlter, addAlter } = useAppData();
  const [selectedAlterId, setSelectedAlterId] = useState<string>(alters[0]?.id ?? "");
  const [draft, setDraft] = useState(createEmptyAlter());
  const wheelColors = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#0EA5E9",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  const selectedAlter = useMemo(
    () => alters.find((alter) => alter.id === selectedAlterId) ?? null,
    [alters, selectedAlterId]
  );

  useEffect(() => {
    if (selectedAlter) {
      setDraft(selectedAlter);
    } else {
      setDraft(createEmptyAlter());
    }
  }, [selectedAlter]);

  const setField = (key: string, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateField = (index: number, fieldKey: "label" | "value", value: string) => {
    setDraft((current) => {
      const fields = [...current.fields];
      fields[index] = { ...fields[index], [fieldKey]: value };
      return { ...current, fields };
    });
  };

  const addField = () => {
    setDraft((current) => ({
      ...current,
      fields: [...current.fields, { id: `${Date.now()}-${Math.random()}`, label: "", value: "" }],
    }));
  };

  const removeField = (index: number) => {
    setDraft((current) => ({
      ...current,
      fields: current.fields.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  };

  const saveAlter = () => {
    const normalizedAlter = {
      ...draft,
      id: draft.id || `alter-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fields: draft.fields.map((field) => ({
        ...field,
        id: field.id || `${Date.now()}-${Math.random()}`,
      })),
    };

    if (selectedAlter) {
      updateAlter(normalizedAlter);
      router.replace({ pathname: "/", params: { hideActions: "1" } });
    } else {
      addAlter(normalizedAlter);
      setSelectedAlterId(normalizedAlter.id);
      router.replace({ pathname: "/", params: { hideActions: "1" } });
    }
  };

  const selectNewAlter = () => {
    setSelectedAlterId("");
    setDraft(createEmptyAlter());
  };

  return (
    <SidebarLayout title="Customize Alters">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
      <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
        Customize Alters
      </Text>

      <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 16, lineHeight: 24 }}>
        Create alters, edit names and roles, add avatars, and define custom fields.
      </Text>

      <View style={{ flexDirection: "row", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
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

      <Pressable
        onPress={selectNewAlter}
        style={{
          backgroundColor: "#2563EB",
          padding: 14,
          borderRadius: 16,
          marginTop: 10,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>New Alter</Text>
      </Pressable>

      <View style={{ marginTop: 30, backgroundColor: "#1F2937", borderRadius: 20, padding: 20 }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
          {selectedAlter ? "Edit alter" : "Create a new alter"}
        </Text>

        <TextInput
          value={draft.name}
          onChangeText={(value) => setField("name", value)}
          placeholder="Name"
          placeholderTextColor="#9CA3AF"
          style={{
            marginTop: 16,
            backgroundColor: "#111827",
            borderRadius: 16,
            paddingHorizontal: 16,
            color: "white",
            height: 48,
          }}
        />

        <TextInput
          value={draft.pronouns}
          onChangeText={(value) => setField("pronouns", value)}
          placeholder="Pronouns"
          placeholderTextColor="#9CA3AF"
          style={{
            marginTop: 12,
            backgroundColor: "#111827",
            borderRadius: 16,
            paddingHorizontal: 16,
            color: "white",
            height: 48,
          }}
        />

        <TextInput
          value={draft.role}
          onChangeText={(value) => setField("role", value)}
          placeholder="Role"
          placeholderTextColor="#9CA3AF"
          style={{
            marginTop: 12,
            backgroundColor: "#111827",
            borderRadius: 16,
            paddingHorizontal: 16,
            color: "white",
            height: 48,
          }}
        />

        <TextInput
          value={draft.bio}
          onChangeText={(value) => setField("bio", value)}
          placeholder="Bio"
          placeholderTextColor="#9CA3AF"
          multiline
          style={{
            marginTop: 12,
            backgroundColor: "#111827",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: "white",
            minHeight: 96,
            textAlignVertical: "top",
          }}
        />

        <TextInput
          value={draft.avatarUrl}
          onChangeText={(value) => setField("avatarUrl", value)}
          placeholder="Avatar URL"
          placeholderTextColor="#9CA3AF"
          style={{
            marginTop: 12,
            backgroundColor: "#111827",
            borderRadius: 16,
            paddingHorizontal: 16,
            color: "white",
            height: 48,
          }}
        />

        <View style={{ marginTop: 20, padding: 18, borderRadius: 20, backgroundColor: "#111827", borderWidth: 1, borderColor: "#374151" }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Pick a colour</Text>
          <Text style={{ color: "#9CA3AF", marginTop: 8, fontSize: 14 }}>
            Choose the alter card colour here.
          </Text>
          <View style={{ marginTop: 18, alignItems: "center" }}>
            <View style={{ width: 220, height: 220, borderRadius: 110, backgroundColor: "#111827", justifyContent: "center", alignItems: "center" }}>
              <View style={{ position: "absolute", top: 14, left: 88 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[0])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[0],
                    borderWidth: draft.color === wheelColors[0] ? 3 : 1,
                    borderColor: draft.color === wheelColors[0] ? "white" : "#475569",
                  }}
                />
              </View>
              <View style={{ position: "absolute", top: 47, left: 154 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[1])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[1],
                    borderWidth: draft.color === wheelColors[1] ? 3 : 1,
                    borderColor: draft.color === wheelColors[1] ? "white" : "#475569",
                  }}
                />
              </View>
              <View style={{ position: "absolute", top: 120, left: 186 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[2])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[2],
                    borderWidth: draft.color === wheelColors[2] ? 3 : 1,
                    borderColor: draft.color === wheelColors[2] ? "white" : "#475569",
                  }}
                />
              </View>
              <View style={{ position: "absolute", top: 192, left: 154 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[3])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[3],
                    borderWidth: draft.color === wheelColors[3] ? 3 : 1,
                    borderColor: draft.color === wheelColors[3] ? "white" : "#475569",
                  }}
                />
              </View>
              <View style={{ position: "absolute", top: 224, left: 88 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[4])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[4],
                    borderWidth: draft.color === wheelColors[4] ? 3 : 1,
                    borderColor: draft.color === wheelColors[4] ? "white" : "#475569",
                  }}
                />
              </View>
              <View style={{ position: "absolute", top: 192, left: 20 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[5])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[5],
                    borderWidth: draft.color === wheelColors[5] ? 3 : 1,
                    borderColor: draft.color === wheelColors[5] ? "white" : "#475569",
                  }}
                />
              </View>
              <View style={{ position: "absolute", top: 120, left: 0 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[6])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[6],
                    borderWidth: draft.color === wheelColors[6] ? 3 : 1,
                    borderColor: draft.color === wheelColors[6] ? "white" : "#475569",
                  }}
                />
              </View>
              <View style={{ position: "absolute", top: 47, left: 20 }}>
                <Pressable
                  onPress={() => setField("color", wheelColors[7])}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: wheelColors[7],
                    borderWidth: draft.color === wheelColors[7] ? 3 : 1,
                    borderColor: draft.color === wheelColors[7] ? "white" : "#475569",
                  }}
                />
              </View>
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: draft.color,
                  borderWidth: 3,
                  borderColor: "rgba(255,255,255,0.18)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Current</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          <Text style={{ color: "#9CA3AF", marginBottom: 8 }}>Or pick an exact colour</Text>
          <TextInput
            value={draft.color}
            onChangeText={(value) => setField("color", value)}
            placeholder="#rrggbb"
            placeholderTextColor="#6B7280"
            style={{
              marginBottom: 10,
              backgroundColor: "#0F172A",
              borderRadius: 12,
              paddingHorizontal: 12,
              color: "white",
              height: 44,
            }}
          />

          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#9CA3AF", marginBottom: 6 }}>R</Text>
              <TextInput
                value={String((hexToRgb(draft.color) || { r: 0 }).r)}
                onChangeText={(val) => {
                  const n = Math.max(0, Math.min(255, Number(val) || 0));
                  const prev = hexToRgb(draft.color) || { r: 0, g: 0, b: 0 };
                  const next = { ...prev, r: n };
                  setField("color", rgbToHex(next));
                }}
                keyboardType="numeric"
                placeholder="0-255"
                placeholderTextColor="#6B7280"
                style={{ backgroundColor: "#0F172A", borderRadius: 12, paddingHorizontal: 10, color: "white", height: 44 }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#9CA3AF", marginBottom: 6 }}>G</Text>
              <TextInput
                value={String((hexToRgb(draft.color) || { g: 0 }).g)}
                onChangeText={(val) => {
                  const n = Math.max(0, Math.min(255, Number(val) || 0));
                  const prev = hexToRgb(draft.color) || { r: 0, g: 0, b: 0 };
                  const next = { ...prev, g: n };
                  setField("color", rgbToHex(next));
                }}
                keyboardType="numeric"
                placeholder="0-255"
                placeholderTextColor="#6B7280"
                style={{ backgroundColor: "#0F172A", borderRadius: 12, paddingHorizontal: 10, color: "white", height: 44 }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#9CA3AF", marginBottom: 6 }}>B</Text>
              <TextInput
                value={String((hexToRgb(draft.color) || { b: 0 }).b)}
                onChangeText={(val) => {
                  const n = Math.max(0, Math.min(255, Number(val) || 0));
                  const prev = hexToRgb(draft.color) || { r: 0, g: 0, b: 0 };
                  const next = { ...prev, b: n };
                  setField("color", rgbToHex(next));
                }}
                keyboardType="numeric"
                placeholder="0-255"
                placeholderTextColor="#6B7280"
                style={{ backgroundColor: "#0F172A", borderRadius: 12, paddingHorizontal: 10, color: "white", height: 44 }}
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
            Custom fields
          </Text>
          <Text style={{ color: "#9CA3AF", marginBottom: 12 }}>
            Custom fields are managed in the dedicated Custom Fields tab.
          </Text>
          <Pressable
            onPress={() => router.push("/custom-fields")}
            style={{ backgroundColor: "#2563EB", padding: 12, borderRadius: 12, alignSelf: "flex-start" }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>Open Custom Fields</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={saveAlter}
          style={{
            marginTop: 24,
            backgroundColor: "#10B981",
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {selectedAlter ? "Save changes" : "Create alter"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  </SidebarLayout>
  );
}
