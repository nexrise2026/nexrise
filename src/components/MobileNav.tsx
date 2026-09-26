import React from 'react';
import { Bot, CheckSquare, FileText, FolderLock, Activity, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../locales/translations';

interface MobileNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  language: Language;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onNavigate, language }) => {
  const t = getTranslation(language);

  const tabs = [
    {
      id: 'status',
      label: language === 'kn' ? 'ಸ್ಥಿತಿ' : 'Status',
      sublabel: 'Projects',
      icon: Activity,
    },
    {
      id: 'doc-updates',
      label: language === 'kn' ? 'ಅಪ್‌ಡೇಟ್' : 'Doc Updates',
      sublabel: 'Gazettes',
      icon: FileText,
    },
    {
      id: 'agent',
      label: 'NIRVAHA',
      sublabel: 'AI Guide',
      icon: Bot,
      highlight: true,
    },
    {
      id: 'assist-fill',
      label: language === 'kn' ? 'ಫಾರ್ಮ್' : 'AssistFill',
      sublabel: 'Pre-fill',
      icon: CheckSquare,
    },
    {
      id: 'vault',
      label: language === 'kn' ? 'ವಾಲ್ಟ್' : 'Vault',
      sublabel: 'Documents',
      icon: FolderLock,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive ? 'text-[#38104E]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all relative ${
                  isActive
                    ? 'bg-[#FAF5FF] text-[#9333EA] scale-105'
                    : tab.highlight
                    ? 'text-[#9333EA]'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.highlight && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[68px] ${
                  isActive ? 'font-bold text-[#38104E]' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

