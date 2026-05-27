import { useState } from 'react'
import { Button, TextInput, View } from 'react-native'
import { supabase } from '../lib/supabase'

export default function HomeScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email!')
    }
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    }
  }

  return (
    <View style={{ padding: 20, gap: 10, marginTop: 100 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}
      />

      <Button title="Sign Up" onPress={signUp} />
      <Button title="Login" onPress={signIn} />
    </View>
  )
}