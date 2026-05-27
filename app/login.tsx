import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

const redirectUrl = Linking.createURL('login');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp() {
    if (!email.trim() || !password.trim()) {
      alert('Please enter an email and password.');
      return;
    }

    const friendCode = `F-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          friendCode,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else if (data.user) {
      alert(`Account created! Your friend code is: ${friendCode}. Check your email to confirm.`);
      setEmail('');
      setPassword('');
    }
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.replace('/');
    }
  }

  async function sendMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Magic link sent. Check your email.');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#111827', padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: 'white', fontSize: 28, fontWeight: '700', marginBottom: 20 }}>
        Login with Supabase
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: '#374151',
          backgroundColor: '#1F2937',
          color: 'white',
          padding: 14,
          borderRadius: 14,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: '#374151',
          backgroundColor: '#1F2937',
          color: 'white',
          padding: 14,
          borderRadius: 14,
          marginBottom: 12,
        }}
      />

      <View style={{ gap: 12 }}>
        <Button title="Login with email/password" onPress={signIn} />
        <Button title="Sign Up with email/password" onPress={signUp} />
        <Button title="Send magic link" onPress={sendMagicLink} />
      </View>
    </View>
  );
}