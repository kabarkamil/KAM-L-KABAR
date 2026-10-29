import React, { useState } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  User,
  Calendar,
  Mail,
  Lock,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { UserAccount } from '../utils/storage.js';
import { Logo } from './Logo.js';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  activeUser: UserAccount;
  onSelectUser: (userId: string) => void;
  onRegisterUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  users,
  activeUser,
  onSelectUser,
  onRegisterUser,
}) => {
  const [tab, setTab] = useState<'register' | 'switch'>('switch');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetExamDate, setTargetExamDate] = useState('2026-12-15');
  const [avatarColor, setAvatarColor] = useState('#800020');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onRegisterUser({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@student.de`,
      targetExamDate,
      avatarColor,
    });

    setName('');
    setEmail('');
    onClose();
  };

  const colors = ['#800020', '#1e3a8a', '#065f46', '#7c2d12', '#4c1d95'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#800020] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <Logo className="w-full h-full" variant="burgundy" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Öğrenci Hesabı & Profil</h3>
              <p className="text-xs text-red-100">İlerlemeleriniz bu profile kaydedilir</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Kapat"
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => setTab('switch')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
              tab === 'switch'
                ? 'bg-white text-[#800020] border-b-2 border-[#800020]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Kayıtlı Profiller ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
              tab === 'register'
                ? 'bg-white text-[#800020] border-b-2 border-[#800020]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Yeni Öğrenci Kaydı</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4">
          {tab === 'switch' ? (
            <div className="space-y-3">
              <p className="text-xs text-stone-500">
                Aşağıdaki profillerden birini seçerek ilgili öğrencinin 6 beceri ilerlemesine ve sınav geçmişine geçiş yapabilirsiniz:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {users.map((u) => {
                  const isActive = u.id === activeUser.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSelectUser(u.id);
                        onClose();
                      }}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition ${
                        isActive
                          ? 'bg-red-50/70 border-[#800020] ring-1 ring-[#800020]'
                          : 'bg-white border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs"
                          style={{ backgroundColor: u.avatarColor || '#800020' }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                            <span>{u.name}</span>
                            {isActive && (
                              <span className="text-[10px] bg-[#800020] text-white px-2 py-0.2 rounded-full font-semibold">
                                Aktif Profil
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-500">{u.email}</div>
                          {u.targetExamDate && (
                            <div className="text-[11px] text-stone-400 mt-0.5">
                              Hedef Sınav: {u.targetExamDate}
                            </div>
                          )}
                        </div>
                      </div>

                      {isActive && (
                        <CheckCircle2 className="w-5 h-5 text-[#800020] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="w-full py-2.5 rounded-xl border border-dashed border-[#800020] text-[#800020] hover:bg-red-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Farklı Bir Öğrenci Adına Yeni Kayıt Aç</span>
                </button>
              </div>
            </div>
          ) : (
            /* Register New User Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  Adınız ve Soyadınız *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Kamil Kabar"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-[#800020] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  E-Posta Adresi (İsteğe bağlı)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@ogrenci.de"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-[#800020] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  Hedef Goethe A1 Sınav Tarihi
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-[#800020] outline-none"
                  />
                </div>
              </div>

              {/* Avatar color picker */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-stone-700">
                  Profil Rengi:
                </label>
                <div className="flex items-center gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        avatarColor === c
                          ? 'border-stone-900 scale-110 shadow-xs'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#800020] hover:bg-[#68001a] text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Öğrenciyi Kaydet ve Başla</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                🔒 Bilgileriniz tarayıcınızın yerel hafızasında saklanır. Ücretsiz ve çevrimdışıdır.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
