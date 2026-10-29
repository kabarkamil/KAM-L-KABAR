import React from 'react';
import { User, Volume2, ShieldCheck, GraduationCap } from 'lucide-react';
import { UserAccount } from '../utils/storage.js';
import { isSpeechSynthesisSupported, isSpeechRecognitionSupported } from '../utils/speech.js';
import { Logo } from './Logo.js';

interface HeaderProps {
  activeUser: UserAccount;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeUser, onOpenAuthModal }) => {
  const hasTTS = isSpeechSynthesisSupported();
  const hasSTT = isSpeechRecognitionSupported();

  return (
    <header className="bg-[#800020] text-white shadow-md border-b-4 border-[#580512]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand and Official Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md border border-red-200 shrink-0">
            <Logo className="w-full h-full" variant="burgundy" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Turk <span className="text-red-200 font-light">|</span> Persönlicher Deutschtrainer
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-white/20 text-white backdrop-blur-xs border border-white/20">
                Goethe A1
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-100 flex items-center gap-1.5 mt-0.5">
              <span>Goethe-Zertifikat A1 Referanslı Almanca Hazırlık Sistemi</span>
              <span className="inline-block w-1 h-1 rounded-full bg-red-300"></span>
              <span className="text-red-200 text-xs">Türkçe Açıklamalı</span>
            </p>
          </div>
        </div>

        {/* Right side: User Profile & System Status */}
        <div className="flex items-center justify-between md:justify-end gap-2.5">
          {/* Audio Engine Local Indicator */}
          <div
            className="hidden lg:flex items-center gap-1.5 text-xs bg-black/20 text-white/90 px-2.5 py-1.5 rounded-lg border border-white/10"
            title={
              hasTTS
                ? 'Tarayıcınızın yerel Almanca ses motoru devrede (Ücretsiz / Çevrimdışı)'
                : 'Ses sentezi bu tarayıcıda kısıtlı'
            }
          >
            <Volume2 className="w-3.5 h-3.5 text-green-300" />
            <span className="text-[11px]">
              {hasTTS ? 'Almanca Ses: Aktif (Yerel)' : 'Almanca Ses: Kısıtlı'}
            </span>
          </div>

          {/* User Account / Switch Button */}
          <button
            onClick={onOpenAuthModal}
            aria-label="Kullanıcı profili ve hesap ayarları"
            className="flex items-center gap-2 bg-white text-[#800020] hover:bg-red-50 px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-xs transition duration-150 active:scale-95 border border-white"
          >
            <div className="w-6 h-6 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left max-w-[120px] sm:max-w-[160px] truncate">
              <span className="block text-xs leading-none text-stone-500 font-normal">
                Kayıtlı Öğrenci
              </span>
              <span className="block text-xs sm:text-sm leading-tight font-bold text-[#800020] truncate">
                {activeUser.name}
              </span>
            </div>
            <User className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
