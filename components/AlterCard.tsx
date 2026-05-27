import { useRef } from "react";
import { Animated, Image, Pressable, Text, View, type ViewStyle } from "react-native";

type AlterCardProps = {
  name: string;
  pronouns: string;
  color: string;
  avatarUrl?: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function AlterCard({ name, pronouns, color, avatarUrl, onPress, style }: AlterCardProps) {
  const initial = name?.charAt(0).toUpperCase() || "A";
  const scale = useRef(new Animated.Value(1)).current;

  const animatePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={animatePressIn}
      onPressOut={animatePressOut}
      android_ripple={{ color: "rgba(255,255,255,0.12)" }}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.95 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
        }}
      >
        <View
          style={{
            backgroundColor: color,
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.12)" }}
              />
            ) : (
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>{initial}</Text>
              </View>
            )}
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {name}
              </Text>
              <Text
                style={{
                  color: "#E5E7EB",
                  marginTop: 6,
                  fontSize: 16,
                }}
              >
                {pronouns}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
