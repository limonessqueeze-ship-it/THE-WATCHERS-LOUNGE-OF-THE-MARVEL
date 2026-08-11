import React, { useState } from 'react';
import { X, Shield, Zap, Mail, Lock, UserCheck, AlertCircle, Upload, Image, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured, saveProfileToSupabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAsGuest, calculateRank } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop';
    const finalAvatar = avatarDataUrl || defaultAvatar;
    const finalName = username.trim() || email.split('@')[0] || 'Usuario';
    const finalHandle = `@${finalName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    try {
      if (isSupabaseConfigured) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: finalName,
                avatar_url: finalAvatar,
                agent_handle: finalHandle
              }
            }
          });
          if (error) throw error;

          if (data.user) {
            // Save to Supabase 'profiles' table
            await saveProfileToSupabase({
              id: data.user.id,
              username: finalName,
              agent_handle: finalHandle,
              avatar_url: finalAvatar,
              nexus_points: 500,
              rank: calculateRank(500),
              favorite_character: 'Loki',
              favorite_phase: 'Fase 4',
              bookmarks: []
            });
          }
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
        }
        onClose();
      } else {
        loginAsGuest();
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al autenticar con el servidor');
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
              ? 'Crea tu cuenta con tu correo, usuario y foto de perfil.'
              : 'Ingresa con tus credenciales para acceder a tus puntos y perfil.'}
          </p>
        </div>

        {/* GUEST ACCESS BUTTON */}
        <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-br from-amber-950/60 to-red-950/40 border border-amber-500/40 text-center">
          <span className="text-xs text-amber-300 font-medium block mb-2">
            ¿Deseas probar la app sin crear cuenta?
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
          <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase tracking-widest font-mono">O con Correo</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de Usuario</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Ej. TonyStark_616"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Profile Photo from Gallery/Library */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Foto de Perfil (desde tu Biblioteca)</label>
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
                      {avatarDataUrl ? '✓ Foto seleccionada de tu galería' : 'JPG o PNG desde tu dispositivo'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
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
            {loading ? 'Conectando con Servidor...' : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isSignUp ? '¿Ya tienes una cuenta?' : '¿Aún no te has registrado?'}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-amber-400 hover:underline font-semibold"
          >
            {isSignUp ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
        </div>

      </div>
    </div>
  );
};

