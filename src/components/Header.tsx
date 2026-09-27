import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Users } from 'lucide-react';
import { Language, UserProfile, SUPPORTED_LANGUAGES } from '../types';
import { getTranslation } from '../locales/translations';
import { NirvahaLogo } from './NirvahaLogo';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onLogout?: () => void;
  onSwitchPersona?: () => void;
  onOpenWhoWeAre?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  language,
  onLanguageChange,
  userProfile,
  onOpenProfile,
  onLogout,
  onSwitchPersona,
  onOpenWhoWeAre,
}) => {
  const t = getTranslation(language);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Zone with Uploaded Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9333EA] rounded-xl transition-transform active:scale-[0.99]"
          >
            <NirvahaLogo size="md" showText={true} tagline={t.tagline} />
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop/Tablet) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('status')}
            className={`transition-colors hover:text-[#38104E] flex items-center gap-1.5 ${
              currentTab === 'status' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'kn' ? 'ಯೋಜನೆಗಳ ಸ್ಥಿತಿ' : 'Project Status'}</span>
          </button>
          <button
            onClick={() => onNavigate('doc-updates')}
            className={`transition-colors hover:text-[#38104E] ${
              currentTab === 'doc-updates' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            {language === 'kn' ? 'ದಾಖಲೆಗಳ ಅಪ್‌ಡೇಟ್' : 'Doc Updates'}
          </button>
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-[#38104E] ${
              currentTab === 'home' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => onNavigate('agent')}
            className={`transition-colors hover:text-[#38104E] ${
              currentTab === 'agent' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            {t.nav.agent}
          </button>
          <button
            onClick={() => onNavigate('assist-fill')}
            className={`transition-colors hover:text-[#38104E] ${
              currentTab === 'assist-fill' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            {t.nav.assistFill}
          </button>
          <button
            onClick={() => onNavigate('vault')}
            className={`transition-colors hover:text-[#38104E] flex items-center gap-1.5 ${
              currentTab === 'vault' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            <span>{language === 'kn' ? 'ದಾಖಲೆಗಳ ವಾಲ್ಟ್' : 'Document Vault'}</span>
          </button>
          <button
            onClick={() => onNavigate('consent')}
            className={`transition-colors hover:text-[#38104E] ${
              currentTab === 'consent' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            {t.nav.consent}
          </button>
          <button
            onClick={() => onNavigate('support')}
            className={`transition-colors hover:text-[#38104E] ${
              currentTab === 'support' ? 'text-[#38104E] font-semibold border-b-2 border-[#9333EA] pb-0.5' : ''
            }`}
          >
            {t.nav.support}
          </button>
          {onOpenWhoWeAre && (
            <button
              onClick={onOpenWhoWeAre}
              className="transition-colors hover:text-white flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg bg-[#FAF5FF] text-[#38104E] border border-purple-200 shadow-2xs hover:bg-[#9333EA]"
              title="Who We Are & Explore other citizen groups"
            >
              <Users className="w-3.5 h-3.5 text-[#9333EA]" />
              <span>{language === 'kn' ? 'ನಾವ್ಯಾರು' : 'Who We Are'}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Language Dropdown, Profile) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onOpenWhoWeAre && (
            <button
              onClick={onOpenWhoWeAre}
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-[#9333EA] text-[#38104E] hover:text-white text-xs font-bold border border-purple-200 transition-colors"
              title="Who We Are / Explore other citizens"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="text-[11px]">{language === 'kn' ? 'ನಾವ್ಯಾರು' : 'Who We Are'}</span>
            </button>
          )}
          {/* Regional Languages Dropdown Selector */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/70 hover:bg-purple-100/80 text-[#38104E] transition-colors text-xs font-semibold border border-purple-200/80 shadow-2xs"
              title="Select Language"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#9333EA] shrink-0" />
              <span className={`${activeLang.fontClass} tracking-normal text-xs`}>
                {activeLang.nativeName}
              </span>
              <ChevronDown className={`w-3 h-3 text-purple-700 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-purple-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-purple-50 mb-1">
                  Indian Regional Languages ({SUPPORTED_LANGUAGES.length})
                </div>

                <div className="max-h-72 overflow-y-auto py-1">
                  {SUPPORTED_LANGUAGES.map((langItem) => {
                    const isSelected = language === langItem.code;
                    return (
                      <button
                        key={langItem.code}
                        onClick={() => {
                          onLanguageChange(langItem.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors text-xs ${
                          isSelected
                            ? 'bg-[#FAF5FF] text-[#38104E] font-bold'
                            : 'hover:bg-purple-50/50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`text-sm ${langItem.fontClass}`}>
                            {langItem.nativeName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            ({langItem.name})
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#9333EA] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile / Persona Status */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#38104E] transition-colors text-xs font-medium border border-purple-200/70"
              title="User Profile & Settings"
            >
              <div className="w-6 h-6 rounded-full bg-[#38104E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {userProfile.preferredName ? userProfile.preferredName[0].toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="truncate max-w-[100px] font-bold text-[#38104E] leading-tight">
                  {userProfile.preferredName || 'Citizen'}
                </span>
                <span className="text-[10px] text-[#9333EA] font-semibold leading-tight">
                  {userProfile.userType}
                </span>
              </div>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                title="Log out of this device"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">&times;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

