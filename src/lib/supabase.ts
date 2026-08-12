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

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function ensureUUID(idString: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(idString)) {
    return idString;
  }
  let hex = '';
  for (let i = 0; i < idString.length; i++) {
    hex += idString.charCodeAt(i).toString(16);
  }
  while (hex.length < 32) {
    hex += '0123456789abcdef'[Math.floor(Math.random() * 16)];
  }
  hex = hex.substring(0, 32);
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-4${hex.substring(13, 16)}-a${hex.substring(17, 20)}-${hex.substring(20, 32)}`;
}

export async function fetchProfileFromSupabase(userId: string): Promise<DbProfile | null> {
  try {
    const validId = ensureUUID(userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', validId)
      .maybeSingle();

    if (error) {
      console.debug('Supabase fetch profile notice:', error.message);
      return null;
    }
    return data as DbProfile | null;
  } catch (err) {
    console.debug('Error in fetchProfileFromSupabase:', err);
    return null;
  }
}

export async function saveProfileToSupabase(profile: Partial<DbProfile> & { id: string }) {
  try {
    const validId = ensureUUID(profile.id);

    const fullPayload: any = {
      id: validId,
      username: profile.username || 'Usuario',
      agent_handle: profile.agent_handle || `@${(profile.username || 'user').toLowerCase()}`,
      avatar_url: profile.avatar_url || ''
    };

    if (profile.nexus_points !== undefined) fullPayload.nexus_points = profile.nexus_points;
    if (profile.rank !== undefined) fullPayload.rank = profile.rank;
    if (profile.favorite_character !== undefined) fullPayload.favorite_character = profile.favorite_character;
    if (profile.favorite_phase !== undefined) fullPayload.favorite_phase = profile.favorite_phase;
    if (profile.bookmarks !== undefined) fullPayload.bookmarks = profile.bookmarks;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(fullPayload, { onConflict: 'id' });

    if (error) {
      console.debug('Supabase save profile notice (expected for local accounts without auth.users entry):', error.message);
    } else {
      console.log('Saved profile to Supabase successfully:', validId);
    }

    return { data, error };
  } catch (err) {
    console.debug('Error in saveProfileToSupabase:', err);
    return { data: null, error: err };
  }
}


