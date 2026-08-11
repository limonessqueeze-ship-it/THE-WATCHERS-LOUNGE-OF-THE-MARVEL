import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables safely
const metaEnv = (import.meta as any).env || {};

export const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://uzutrjpkeolwabfaasgu.supabase.co';
export const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dXRyanBrZW9sd2FiZmFhc2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NzcyMzAsImV4cCI6MjEwMjA1MzIzMH0.RsF0HeuukKp6eXf2xwAvZINb7HufMrSXFgrQzI4H6EI';

export const isSupabaseConfigured = true;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export interface DbProfile {
  id: string;
  username: string;
  agent_handle: string;
  avatar_url: string;
  nexus_points: number;
  rank: string;
  favorite_character: string;
  favorite_phase: string;
  bookmarks: string[];
  created_at?: string;
}

export async function fetchProfileFromSupabase(userId: string): Promise<DbProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch profile notice:', error.message);
      return null;
    }
    return data as DbProfile | null;
  } catch (err) {
    console.error('Error in fetchProfileFromSupabase:', err);
    return null;
  }
}

export async function saveProfileToSupabase(profile: Partial<DbProfile> & { id: string }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase save profile notice:', error.message);
    }
    return { data, error };
  } catch (err) {
    console.error('Error in saveProfileToSupabase:', err);
    return { data: null, error: err };
  }
}


