import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, FanRank, MCUPhase } from '../types';
import { supabase, isSupabaseConfigured, fetchProfileFromSupabase, saveProfileToSupabase } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateNexusPoints: (pointsToAdd: number) => void;
  toggleBookmark: (theoryId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  calculateRank: (points: number) => FanRank;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'watcher_lounge_user_v2';

export function calculateRank(points: number): FanRank {
  if (points >= 1000) return 'El Observador';
  if (points >= 601) return 'Vengador Élite';
  if (points >= 301) return 'Hechicero Supremo';
  if (points >= 101) return 'Fan del Multiverso';
  return 'Variante de Loki';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
    return null; // Start null so user can authenticate or choose guest
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  // Load session from Supabase on start
  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const profile = await syncSessionWithSupabase(session.user);
            if (isMounted) setUser(profile);
          }
        }
      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && isMounted) {
        const profile = await syncSessionWithSupabase(session.user);
        if (isMounted) setUser(profile);
      } else if (!session && isMounted) {
        // If user logged out of Supabase
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function syncSessionWithSupabase(sessionUser: any): Promise<UserProfile> {
    const userId = sessionUser.id;
    const emailName = sessionUser.email?.split('@')[0] || 'Usuario';
    const metadata = sessionUser.user_metadata || {};

    // 1. Try fetching existing row from Supabase 'profiles' table
    const dbProfile = await fetchProfileFromSupabase(userId);

    if (dbProfile) {
      return {
        id: userId,
        username: dbProfile.username || metadata.full_name || emailName,
        agentHandle: dbProfile.agent_handle || `@${emailName}`,
        email: sessionUser.email || '',
        avatarUrl: dbProfile.avatar_url || metadata.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        nexusPoints: dbProfile.nexus_points ?? 500,
        rank: calculateRank(dbProfile.nexus_points ?? 500),
        favoriteCharacter: dbProfile.favorite_character || 'Loki',
        favoritePhase: (dbProfile.favorite_phase as MCUPhase) || 'Fase 4',
        bookmarks: dbProfile.bookmarks || [],
        likedTheories: {},
        isGuest: false,
        createdAt: dbProfile.created_at || sessionUser.created_at || new Date().toISOString()
      };
    }

    // 2. If no row exists, create it in Supabase
    const newProfile: UserProfile = {
      id: userId,
      username: metadata.full_name || emailName,
      agentHandle: metadata.agent_handle || `@${emailName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      email: sessionUser.email || '',
      avatarUrl: metadata.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      nexusPoints: 500,
      rank: calculateRank(500),
      favoriteCharacter: 'Loki',
      favoritePhase: 'Fase 4',
      bookmarks: [],
      likedTheories: {},
      isGuest: false,
      createdAt: sessionUser.created_at || new Date().toISOString()
    };

    saveProfileToSupabase({
      id: userId,
      username: newProfile.username,
      agent_handle: newProfile.agentHandle,
      avatar_url: newProfile.avatarUrl,
      nexus_points: newProfile.nexusPoints,
      rank: newProfile.rank,
      favorite_character: newProfile.favoriteCharacter,
      favorite_phase: newProfile.favoritePhase,
      bookmarks: newProfile.bookmarks
    });

    return newProfile;
  }

  const loginAsGuest = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const guestUser: UserProfile = {
      id: `guest-${randomId}`,
      username: `Invitado #${randomId}`,
      agentHandle: `@usuario_${randomId}`,
      email: `invitado_${randomId}@multiverse.org`,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      nexusPoints: 500,
      rank: calculateRank(500),
      favoriteCharacter: 'Loki',
      favoritePhase: 'Fase 4',
      bookmarks: [],
      likedTheories: {},
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    setUser(guestUser);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const updateNexusPoints = (pointsToAdd: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const newPoints = Math.max(0, prev.nexusPoints + pointsToAdd);
      const newRank = calculateRank(newPoints);
      const updated = {
        ...prev,
        nexusPoints: newPoints,
        rank: newRank
      };

      if (!prev.isGuest) {
        saveProfileToSupabase({
          id: prev.id,
          nexus_points: newPoints,
          rank: newRank
        });
      }

      return updated;
    });
  };

  const toggleBookmark = (theoryId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const exists = prev.bookmarks.includes(theoryId);
      const newBookmarks = exists
        ? prev.bookmarks.filter(id => id !== theoryId)
        : [...prev.bookmarks, theoryId];
      
      const updated = { ...prev, bookmarks: newBookmarks };

      if (!prev.isGuest) {
        saveProfileToSupabase({
          id: prev.id,
          bookmarks: newBookmarks
        });
      }

      return updated;
    });
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      if (data.nexusPoints !== undefined) {
        updated.rank = calculateRank(data.nexusPoints);
      }

      if (!prev.isGuest) {
        saveProfileToSupabase({
          id: prev.id,
          username: updated.username,
          agent_handle: updated.agentHandle,
          avatar_url: updated.avatarUrl,
          nexus_points: updated.nexusPoints,
          rank: updated.rank,
          favorite_character: updated.favoriteCharacter,
          favorite_phase: updated.favoritePhase
        });
      }

      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAsGuest,
        logout,
        updateNexusPoints,
        toggleBookmark,
        updateProfile,
        calculateRank
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

