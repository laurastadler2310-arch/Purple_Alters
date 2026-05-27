import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://upacfrnbpuclkbsumkgj.supabase.co';

const supabaseAnonKey =
  'YOUR_ANON_KEY';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: Platform.OS === 'web'
        ? undefined
        : AsyncStorage,

      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);