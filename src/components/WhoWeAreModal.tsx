import React, { useState } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tractor,
  GraduationCap,
  Hammer,
  HeartHandshake,
  Accessibility,
  Building2,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react';
import { UserType, Language, UserProfile } from '../types';
import { PERSONA_OPTIONS, PersonaOption, buildProfileForPersona } from '../data/personaData';
import { NirvahaLogo } from './NirvahaLogo';

interface WhoWeAreModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentProfile: UserProfile;
  onSwitchPersona: (newRole: UserType, updatedProfile?: UserProfile) => void;
  onNavigateTab?: (tab: string) => void;
}

export const WhoWeAreModal: React.FC<WhoWeAreModalProps> = ({
  isOpen,
  onClose,
  language,
  currentProfile,
  onSwitchPersona,
  onNavigateTab,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<UserType | null>(currentProfile.userType);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const getPersonaIcon = (type: UserType) => {
    switch (type) {
      case 'Farmer': return Tractor;
      case 'Student': return GraduationCap;
      case 'Worker': return Hammer;
      case 'Senior Citizen': return HeartHandshake;
      case 'Person with Disability': return Accessibility;
      case 'Citizen':
      default: return Building2;
    }
  };

  const handleSelectAndSwitch = (persona: PersonaOption) => {
    const updated = buildProfileForPersona(persona.type, {
      preferredName: currentProfile.preferredName || (persona.type === 'Farmer' ? 'Ramesh Kumar' : persona.type === 'Student' ? 'Rahul S' : 'Citizen'),
      email: currentProfile.email,
      phone: currentProfile.phone,
    });

    onSwitchPersona(persona.type, updated);
    setSelectedPersona(persona.type);

    const msg = language === 'kn'
      ? `${persona.titleKn} ಪ್ರೊಫೈಲ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ವಾಲ್ಟ್ ಮತ್ತು ಯೋಜನೆಗಳು ನವೀಕರಣಗೊಂಡಿವೆ.`
      : `Switched successfully to ${persona.title}! Your Vault, Project Status, and Schemes are now tailored.`;
    
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-purple-100 relative my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 sm:gap-4 shrink-0 pb-3 border-b border-purple-100">
          <NirvahaLogo size="sm" />
          <div className="pr-8">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#38104E] tracking-tight">
                {language === 'kn' ? 'ನಾವ್ಯಾರು ಮತ್ತು ನಮ್ಮ ಸೇವೆಗಳು' : 'Who We Are & What We Do'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#9333EA] uppercase tracking-wide">
                All Citizens
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {language === 'kn'
                ? 'ನಿರ್ವಾಹ (NIRVAHA) AI — ಭಾರತದ ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕರಿಗೂ (ರೈತರು, ವಿದ್ಯಾರ್ಥಿಗಳು, ಕಾರ್ಮಿಕರು, ಹಿರಿಯರು, ವಿಶೇಷ ಚೇತನರು) ನೇರ, ದಲ್ಲಾಳಿ ರಹಿತ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ ಒದಗಿಸುವ ಸಮ್ಮತಿ-ಮೊದಲು ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿ.'
                : 'NIRVAHA AI is India\'s consent-first citizen welfare platform — empowering every user (Farmers, Students, Workers, Senior Citizens, and Persons with Disabilities) with verified schemes, zero middlemen, and live tracking.'}
            </p>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Active User Indicator */}
        <div className="bg-[#FAF5FF] border border-[#9333EA]/20 rounded-2xl p-3 my-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#38104E] text-white flex items-center justify-center font-bold text-xs">
              {currentProfile.preferredName ? currentProfile.preferredName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="text-xs text-slate-500">
                {language === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ಪ್ರೊಫೈಲ್:' : 'Currently Active User:'}
              </div>
              <div className="text-xs font-bold text-[#38104E]">
                {currentProfile.preferredName} — <span className="text-[#9333EA]">{currentProfile.userType}</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-purple-200 font-medium">
            {language === 'kn'
              ? 'ಒಂದು ಪ್ರೊಫೈಲ್ ಪರೀಕ್ಷಿಸಿದ ನಂತರ, ಇತರ ಬಳಕೆದಾರರ ಸೌಲಭ್ಯಗಳನ್ನು ಇಲ್ಲಿ ನೋಡಬಹುದು'
              : 'Checked this profile? Explore or switch to any other user below anytime'}
          </div>
        </div>

        {/* Persona Options Grid */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3.5 my-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === 'kn' ? 'ಬಳಕೆದಾರರ ಪಾತ್ರವನ್ನು ಆರಿಸಿ ಅಥವಾ ಪರಿಶೀಲಿಸಿ:' : 'Explore & Switch For Other Users:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PERSONA_OPTIONS.map((opt) => {
              const Icon = getPersonaIcon(opt.type);
              const isCurrent = currentProfile.userType === opt.type;

              return (
                <div
                  key={opt.type}
                  className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'border-[#9333EA] bg-purple-50/40 ring-2 ring-[#9333EA]/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                            opt.type === 'Farmer'
                              ? 'bg-emerald-600'
                              : opt.type === 'Student'
                              ? 'bg-purple-600'
                              : opt.type === 'Worker'
                              ? 'bg-amber-600'
                              : opt.type === 'Senior Citizen'
                              ? 'bg-rose-600'
                              : opt.type === 'Person with Disability'
                              ? 'bg-blue-600'
                              : 'bg-slate-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#38104E] leading-tight">
                            {language === 'kn' ? opt.titleKn : opt.title}
                          </h3>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {language === 'kn' ? opt.badgeKn : opt.badge}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white shrink-0">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                      {language === 'kn' ? opt.descriptionKn : opt.description}
                    </p>

                    {/* Key Schemes Pill Tags */}
                    <div className="mb-3">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                        {language === 'kn' ? 'ಪ್ರಮುಖ ಯೋಜನೆಗಳು:' : 'Eligible Schemes:'}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {opt.keySchemes.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Switch / View Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleSelectAndSwitch(opt)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        isCurrent
                          ? 'bg-[#38104E] text-white'
                          : 'bg-purple-100 hover:bg-[#9333EA] text-[#38104E] hover:text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'kn' ? 'ಪ್ರಸ್ತುತ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ' : 'Currently Selected'}</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>{language === 'kn' ? 'ಈ ಪಾತ್ರಕ್ಕೆ ಬದಲಾಯಿಸಿ' : `Switch to ${opt.type}`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="shrink-0 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero personal data sold or retained without consent</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
