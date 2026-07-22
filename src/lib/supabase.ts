import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Garantit qu'un utilisateur (même anonyme) est connecté avant d'utiliser Supabase.
// Lève une erreur explicite plutôt que de renvoyer null, pour éviter les soucis de type ailleurs dans le code.
export async function ensureUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    return session.user;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    throw error;
  }
  if (!data.user) {
    throw new Error("Impossible de créer un utilisateur anonyme.");
  }
  return data.user;
}