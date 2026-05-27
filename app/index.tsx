import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import SidebarLayout from '../components/SidebarLayout';
import { useAppData, useAuth } from '../contexts';

export default function HomeScreen() {
  const { alters } = useAppData();
  const { friendCode } = useAuth();

  return (
    <SidebarLayout title="Welcome">
      <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
        Welcome back!
      </Text>

      <Text style={{ color: '#9CA3AF', marginTop: 12, fontSize: 16, lineHeight: 24 }}>
        Access your alters, friends, custom fields, and chats from the menu.
      </Text>

      <Pressable
        onPress={() => router.push('/manage')}
        style={{
          marginTop: 24,
          backgroundColor: '#2563EB',
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Manage Alters</Text>
      </Pressable>

      <View style={{ marginTop: 24, backgroundColor: '#1F2937', padding: 16, borderRadius: 16 }}>
        <Text style={{ color: '#E5E7EB', fontSize: 14, fontWeight: '700' }}>
          Your friend code
        </Text>
        <Text style={{ color: '#A5B4FC', marginTop: 6, fontSize: 16, fontWeight: '600' }}>
          {friendCode ?? 'Generating your code...'}
        </Text>
      </View>

      <View style={{ marginTop: 32 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 14 }}>
          Your alters
        </Text>

        {alters.length === 0 ? (
          <Text style={{ color: '#9CA3AF' }}>
            No alters yet. Create one using the Manage Alters screen.
          </Text>
        ) : (
          alters.map((alter) => (
            <View
              key={alter.id}
              style={{
                backgroundColor: '#1F2937',
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{alter.name}</Text>
              <Text style={{ color: '#9CA3AF', marginTop: 6 }}>{alter.role}</Text>
            </View>
          ))
        )}
      </View>
    </SidebarLayout>
  )
}