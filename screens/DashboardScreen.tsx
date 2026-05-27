import { Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#111827',
        padding: 24,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 32,
          fontWeight: 'bold',
        }}
      >
        System Dashboard
      </Text>

      <Text
        style={{
          color: '#9CA3AF',
          marginTop: 12,
          fontSize: 18,
        }}
      >
        No one fronting yet.
      </Text>
    </View>
  );
}