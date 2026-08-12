import React, { useState } from 'react';
import { X, Shield, Zap, Lock, UserCheck, AlertCircle, Upload, Image, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured, saveProfileToSupabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_ACCOUNTS_KEY = 'mcu_registered_accounts_v1';

interface LocalAccount {
  username: string;
  passwordHash: string;
  avatarUrl: string;
  agentHandle: string;
  id: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAsGuest, calculateRank } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getLocalAccounts = (): LocalAccount[] => {
    try {
      const saved = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const saveLocalAccount = (acc: LocalAccount) => {
    try {
      const accounts = getLocalAccounts();
      const updated = [...accounts.filter(a => a.username.toLowerCase() !== acc.username.toLowerCase()), acc];
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving local account', e);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('La imagen no debe superar los 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to generate internal email from username
  const getInternalEmail = (rawUsername: string) => {
    const clean = rawUsername.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    const safePrefix = clean || 'user_' + Date.now();
    return `${safePrefix}@mcu.local`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setErrorMessage('Ingresa un nombre de usuario válido.');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      setLoading(false);
      return;
    }

    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop';
    const finalAvatar = avatarDataUrl || defaultAvatar;
    const finalHandle = `@${trimmedUsername.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const internalEmail = getInternalEmail(trimmedUsername);

    try {
      if (isSignUp) {
        // 1. Check if username already exists locally
        const localAccs = getLocalAccounts();
        const existsLocally = localAccs.some(
          a => a.username.toLowerCase() === trimmedUsername.toLowerCase()
        );

        if (existsLocally) {
          setErrorMessage(`El usuario "${trimmedUsername}" ya está registrado. Elige otro nombre.`);
          setLoading(false);
          return;
        }

        // 2. Check in Supabase DB if username already exists
        if (isSupabaseConfigured) {
          try {
            const { data: existingUser } = await supabase
              .from('profiles')
              .select('id, username')
              .ilike('username', trimmedUsername)
              .maybeSingle();

            if (existingUser) {
              setErrorMessage(`El nombre de usuario "${trimmedUsername}" ya existe. Elige un usuario diferente.`);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.warn('Check existing username error notice:', err);
          }

          // 3. Register user with internal email in Supabase
          const { data, error } = await supabase.auth.signUp({
            email: internalEmail,
            password,
            options: {
              data: {
                full_name: trimmedUsername,
                avatar_url: finalAvatar,
                agent_handle: finalHandle
              }
            }
          });

          if (error) {
            if (error.message.includes('already registered') || error.message.includes('User already registered')) {
              throw new Error(`El nombre de usuario "${trimmedUsername}" ya está registrado.`);
            }
            throw error;
          }

          if (data.user) {
            await saveProfileToSupabase({
              id: data.user.id,
              username: trimmedUsername,
              agent_handle: finalHandle,
              avatar_url: finalAvatar,
              nexus_points: 500,
              rank: calculateRank(500),
              favorite_character: 'Loki',
              favorite_phase: 'Fase 4',
              bookmarks: []
            });
          }
        }

        // Store account locally as well
        saveLocalAccount({
          id: `usr-${Date.now()}`,
          username: trimmedUsername,
          passwordHash: password,
          avatarUrl: finalAvatar,
          agentHandle: finalHandle
        });

        onClose();
      } else {
        // LOGIN logic
        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.signInWithPassword({
            email: internalEmail,
            password
          });

          if (error) {
            // Check local account fallback if supabase user wasn't found or error
            const localAccs = getLocalAccounts();
            const matched = localAccs.find(
              a => a.username.toLowerCase() === trimmedUsername.toLowerCase() && a.passwordHash === password
            );

            if (!matched) {
              throw new Error('Usuario o contraseña incorrectos.');
            }
          }
        } else {
          // Local storage authentication
          const localAccs = getLocalAccounts();
          const matched = localAccs.find(
            a => a.username.toLowerCase() === trimmedUsername.toLowerCase() && a.passwordHash === password
          );

          if (!matched) {
            throw new Error('Usuario o contraseña incorrectos.');
          }
        }

        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestClick = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#120808] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
        
        {/* Glow Header Background */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-amber-300" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center mb-3 text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-amber-200">
            {isSignUp ? 'Registro de Usuario' : 'Iniciar Sesión'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp
              ? 'Elige tu nombre de usuario, contraseña y foto de perfil.'
              : 'Ingresa tu nombre de usuario y contraseña para acceder.'}
          </p>
        </div>

        {/* GUEST ACCESS BUTTON */}
        <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-br from-amber-950/60 to-red-950/40 border border-amber-500/40 text-center">
          <span className="text-xs text-amber-300 font-medium block mb-2">
            ¿Deseas probar la app sin registrarte?
          </span>
          <button
            onClick={handleGuestClick}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>⚡ Entrar como Invitado</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase tracking-widest font-mono">
            {isSignUp ? 'Crear Cuenta' : 'Acceso Directo'}
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre de Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Ej. TonyStark_616"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {isSignUp && (
            /* Profile Photo from Gallery/Library */
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Foto de Perfil (desde tu Biblioteca)
              </label>
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-3 rounded-xl">
                {avatarDataUrl ? (
                  <img
                    src={avatarDataUrl}
                    alt="Avatar Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <Image className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950 border border-red-600/60 hover:bg-red-900 text-red-200 text-xs font-bold transition-all">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{avatarDataUrl ? 'Cambiar Foto' : 'Subir Foto de Galería'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {avatarDataUrl ? '✓ Foto seleccionada de tu galería' : 'Opcional (JPG o PNG desde tu dispositivo)'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Verificando Credenciales...' : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isSignUp ? '¿Ya tienes una cuenta?' : '¿Aún no te has registrado?'}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
            }}
            className="ml-1 text-amber-400 hover:underline font-semibold"
          >
            {isSignUp ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
        </div>

      </div>
    </div>
  );
};


