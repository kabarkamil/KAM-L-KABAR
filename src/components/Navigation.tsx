import React from 'react';
import {
  FileCheck2,
  BookOpen,
  SpellCheck,
  Headphones,
  Mic,
  PenTool,
  BarChart3,
  BookMarked,
} from 'lucide-react';

export type ActiveTab =
  | 'exam'
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'progress';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  examCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  examCount,
}) => {
  const tabs = [
    {
      id: 'exam' as ActiveTab,
      label: '5 Soruluk Sınav',
      sublabel: 'Prüfungsmodus',
      icon: FileCheck2,
      badge: 'Ana Mod',
      highlight: true,
    },
    {
      id: 'speaking' as ActiveTab,
      label: 'Konuşma',
      sublabel: 'Sprechen',
      icon: Mic,
      badge: 'Akıllı Analiz',
    },
    {
      id: 'vocabulary' as ActiveTab,
      label: 'Kelime',
      sublabel: 'Wortschatz',
      icon: BookMarked,
    },
    {
      id: 'grammar' as ActiveTab,
      label: 'Dil Bilgisi',
      sublabel: 'Grammatik',
      icon: SpellCheck,
    },
    {
      id: 'reading' as ActiveTab,
      label: 'Okuma',
      sublabel: 'Lesen',
      icon: BookOpen,
    },
    {
      id: 'listening' as ActiveTab,
      label: 'Dinleme',
      sublabel: 'Hören',
      icon: Headphones,
    },
    {
      id: 'writing' as ActiveTab,
      label: 'Yazma',
      sublabel: 'Schreiben',
      icon: PenTool,
    },
    {
      id: 'progress' as ActiveTab,
      label: 'İlerlemem',
      sublabel: 'Fortschritt & Profil',
      icon: BarChart3,
      badge: examCount > 0 ? `${examCount} Sınav` : undefined,
    },
  ];

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'text-stone-700 hover:text-[#800020] hover:bg-red-50/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-stone-500'
                  }`}
                />
                <span className="flex flex-col items-start leading-none text-left">
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      isActive ? 'text-red-200' : 'text-stone-400'
                    }`}
                  >
                    {tab.sublabel}
                  </span>
                </span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-red-100 text-[#800020]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
