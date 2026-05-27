import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://upacfrnbpuclkbsumkgj.supabase.co/rest/v1/';

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYWNmcm5icHVjbGtic3Vta2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTU4MzgsImV4cCI6MjA5NTQ3MTgzOH0.bBlNMNiGm-J3zPeXs908vZPiw2AFflxALYK_FaOHh6c';

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