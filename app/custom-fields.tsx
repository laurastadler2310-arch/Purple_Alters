import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import SidebarLayout from "../components/SidebarLayout";
import { useAppData } from "../contexts";

export default function CustomFieldsScreen() {
  const { alters, updateAlter } = useAppData();
  const [selectedAlterId, setSelectedAlterId] = useState<string>(alters[0]?.id ?? "");

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const selectedAlter = useMemo(
    () => alters.find((alter) => alter.id === selectedAlterId) ?? alters[0] ?? null,
    [alters, selectedAlterId]
  );

  const handleFieldChange = (index: number, key: "label" | "value", value: string) => {
    if (!selectedAlter) return;
    const fields = selectedAlter.fields.map((field, fieldIndex) =>
      fieldIndex === index ? { ...field, [key]: value } : field
    );
    updateAlter({ ...selectedAlter, fields });
  };

  const addField = () => {
    if (!selectedAlter) return;
    updateAlter({
      ...selectedAlter,
      fields: [
        ...selectedAlter.fields,
        { id: `field-${Date.now()}-${Math.random().toString(36).slice(2)}`, label: "", value: "" },
      ],
    });
  };

  const removeField = (index: number) => {
    if (!selectedAlter) return;
    updateAlter({
      ...selectedAlter,
      fields: selectedAlter.fields.filter((_, fieldIndex) => fieldIndex !== index),
    });
  };

  return (
    <SidebarLayout title="Custom Fields">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
          Custom fields
        </Text>
        <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 16, lineHeight: 24 }}>
          Manage field names and values for each alter separately.
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
          {alters.map((alter) => {
            const active = alter.id === selectedAlter?.id;
            return (
              <Pressable
                key={alter.id}
                onPress={() => setSelectedAlterId(alter.id)}
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.06)" : "#111827",
                  borderWidth: 1,
                  borderColor: active ? alter.color : "#374151",
                  borderRadius: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 18,
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

        {!selectedAlter ? (
          <View style={{ marginTop: 24, padding: 20, borderRadius: 24, backgroundColor: "#111827", borderWidth: 1, borderColor: "#374151" }}>
            <Text style={{ color: "#9CA3AF", fontSize: 16 }}>
              Add or select an alter in Manage Alters to create custom fields.
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 24, gap: 18 }}>
            <View
              style={{
                backgroundColor: "#111827",
                borderRadius: 24,
                padding: 22,
                borderWidth: 1,
                borderColor: "#374151",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 20,
                elevation: 3,
              }}
            >
              <Text style={{ color: "#E2E8F0", fontSize: 18, fontWeight: "700" }}>
                {selectedAlter.name}'s fields
              </Text>
              <Text style={{ color: "#9CA3AF", marginTop: 8 }}>
                {selectedAlter.fields.length} field{selectedAlter.fields.length === 1 ? "" : "s"} configured.
              </Text>
            </View>

            {selectedAlter.fields.length === 0 ? (
              <View style={{ padding: 20, borderRadius: 24, backgroundColor: "#111827", borderWidth: 1, borderColor: "#374151" }}>
                <Text style={{ color: "#9CA3AF", fontSize: 16 }}>
                  This alter has no custom fields yet. Add one to keep profile details organized.
                </Text>
              </View>
            ) : (
              selectedAlter.fields.map((field, index) => {
                const isSelected = selectedFieldId === field.id;
                return (
                  <View
                    key={field.id}
                    style={{
                      backgroundColor: isSelected ? "rgba(37, 99, 235, 0.08)" : "#111827",
                      borderRadius: 24,
                      padding: 18,
                      borderWidth: 1,
                      borderColor: isSelected ? "#2563EB" : "#374151",
                      marginBottom: 12,
                      transform: [{ scale: isSelected ? 1.01 : 1 }],
                      shadowColor: isSelected ? "#2563EB" : "#000",
                      shadowOffset: { width: 0, height: isSelected ? 8 : 4 },
                      shadowOpacity: isSelected ? 0.18 : 0.08,
                      shadowRadius: isSelected ? 18 : 12,
                      elevation: isSelected ? 8 : 2,
                    }}
                  >
                    <Pressable
                      onPress={() => setSelectedFieldId(isSelected ? null : field.id)}
                      style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 }}
                    >
                      <View>
                        <Text style={{ color: "#E2E8F0", fontSize: 16, fontWeight: "700" }}>
                          {field.label || `Field ${index + 1}`}
                        </Text>
                        <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>
                          {field.label ? "Tap to rename or edit" : "Tap to name this field"}
                        </Text>
                      </View>
                      {isSelected && (
                        <Pressable onPress={() => removeField(index)} style={{ padding: 8 }}>
                          <Text style={{ color: "#F87171", fontWeight: "700" }}>Delete</Text>
                        </Pressable>
                      )}
                    </Pressable>

                    <View style={{ marginTop: 14, gap: 8 }}>
                      <View>
                        <Text style={{ color: "#9CA3AF", marginBottom: 6, fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase" }}>
                          Field name
                        </Text>
                        <TextInput
                          value={field.label}
                          onChangeText={(value) => handleFieldChange(index, "label", value)}
                          placeholder="Enter field name"
                          placeholderTextColor="#6B7280"
                          style={{
                            backgroundColor: "#0F172A",
                            borderRadius: 16,
                            paddingHorizontal: 16,
                            color: "white",
                            height: 52,
                          }}
                        />
                      </View>

                      <View>
                        <Text style={{ color: "#9CA3AF", marginBottom: 6, fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase" }}>
                          Field value
                        </Text>
                        <TextInput
                          value={field.value}
                          onChangeText={(value) => handleFieldChange(index, "value", value)}
                          placeholder="Enter field value"
                          placeholderTextColor="#6B7280"
                          style={{
                            backgroundColor: "#0F172A",
                            borderRadius: 16,
                            paddingHorizontal: 16,
                            color: "white",
                            height: 52,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })
            )}

            <Pressable
              onPress={addField}
              style={{
                backgroundColor: "#2563EB",
                padding: 16,
                borderRadius: 18,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Add new field</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SidebarLayout>
  );
}
