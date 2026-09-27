import React, { useState } from 'react';
import { Lock, X, Check, AlertCircle, LogOut, MapPin } from 'lucide-react';
import { UserProfile, UserType, Language, SUPPORTED_LANGUAGES } from '../types';
import { getTranslation } from '../locales/translations';
import { NirvahaLogo } from './NirvahaLogo';
import { INDIAN_STATES, getDistrictsForState } from '../data/indiaLocations';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  language: Language;
  onLogout?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  language,
  onLogout,
}) => {
  const t = getTranslation(language);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [hasConsented, setHasConsented] = useState<boolean>(profile.termsAccepted);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const availableDistricts = formData.state ? getDistrictsForState(formData.state) : [];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConsented) {
      setErrorMsg(
        language === 'kn'
          ? 'ದಯವಿಟ್ಟು ಮುಂದುವರಿಯುವ ಮೊದಲು ಮಾರ್ಗದರ್ಶನ ನಿರಾಕರಣಾ ಪೆಟ್ಟಿಗೆಯನ್ನು ಗುರುತಿಸಿ.'
          : 'Please acknowledge the disclaimer checkbox before continuing.'
      );
      return;
    }
    onSaveProfile({
      ...formData,
      termsAccepted: true,
      onboardingCompleted: true,
    });
    onClose();
  };

  const userTypes: UserType[] = [
    'Farmer',
    'Student',
    'Worker',
    'Senior Citizen',
    'Person with Disability',
    'Parent/Guardian',
    'Citizen',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <NirvahaLogo size="sm" />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#38104E]">
              {t.onboarding.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.onboarding.subhead}
            </p>
          </div>
        </div>

        {/* Privacy Highlight Banner */}
        <div className="bg-[#FAF5FF] border border-[#9333EA]/20 rounded-2xl p-3.5 my-4 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#9333EA] shrink-0 mt-0.5" />
          <p className="text-xs text-[#38104E] leading-relaxed">
            <span className="font-bold">
              {language === 'kn' ? 'ಗೌಪ್ಯತೆಯ ಭರವಸೆ: ' : 'Privacy Promise: '}
            </span>
            {t.onboarding.privacyNote}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.onboarding.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={formData.preferredName}
                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                placeholder="e.g. Rahul Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.onboarding.userTypeLabel}
              </label>
              <select
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value as UserType })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA] bg-white"
              >
                {userTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.onboarding.stateLabel} *
              </label>
              <select
                required
                value={formData.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  const districts = getDistrictsForState(newState);
                  setFormData({
                    ...formData,
                    state: newState,
                    district: districts.includes(formData.district) ? formData.district : (districts[0] || ''),
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA] bg-white cursor-pointer"
              >
                <option value="">
                  {language === 'kn' ? '-- ನಿಮ್ಮ ರಾಜ್ಯ / ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Your State / UT --'}
                </option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.onboarding.districtLabel} *
              </label>
              <select
                required
                disabled={!formData.state}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA] bg-white cursor-pointer ${
                  !formData.state ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300'
                }`}
              >
                <option value="">
                  {!formData.state
                    ? (language === 'kn' ? '-- ಮೊದಲು ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Please Select State First --')
                    : (language === 'kn' ? '-- ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Your District --')}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.onboarding.languageLabel}
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as Language })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA] bg-white"
              >
                {SUPPORTED_LANGUAGES.map((langItem) => (
                  <option key={langItem.code} value={langItem.code}>
                    {langItem.nativeName} ({langItem.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Specific Fields */}
          {formData.userType === 'Student' && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-[#9333EA] uppercase tracking-wider">
                {t.onboarding.studentSection}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.onboarding.collegeLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName || ''}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    placeholder="e.g. RVCE Bengaluru"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#9333EA] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.onboarding.courseLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.course || ''}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g. B.E. Computer Science"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#9333EA] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.onboarding.yearLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.yearOfStudy || ''}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    placeholder="e.g. 3rd Year"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#9333EA] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.onboarding.incomeLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.householdIncomeRange || ''}
                    onChange={(e) => setFormData({ ...formData, householdIncomeRange: e.target.value })}
                    placeholder="e.g. ₹1.5L - ₹2.5L"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#9333EA] bg-white"
                  />
                </div>
              </div>

              {/* Certificate check radios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    {t.onboarding.incomeCertLabel}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    {(['yes', 'no', 'not_sure'] as const).map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="incomeCert"
                          checked={formData.hasIncomeCertificate === opt}
                          onChange={() => setFormData({ ...formData, hasIncomeCertificate: opt })}
                          className="text-[#9333EA] focus:ring-[#9333EA]"
                        />
                        <span className="capitalize">{t.onboarding[opt === 'not_sure' ? 'notSure' : opt]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    {t.onboarding.bonafideCertLabel}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    {(['yes', 'no', 'not_sure'] as const).map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="bonafideCert"
                          checked={formData.hasBonafideCertificate === opt}
                          onChange={() => setFormData({ ...formData, hasBonafideCertificate: opt })}
                          className="text-[#9333EA] focus:ring-[#9333EA]"
                        />
                        <span className="capitalize">{t.onboarding[opt === 'not_sure' ? 'notSure' : opt]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Farmer Specific Fields */}
          {formData.userType === 'Farmer' && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Farmer Land &amp; Agricultural Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Landholding in Acres
                  </label>
                  <input
                    type="text"
                    value={formData.landholdingAcres || ''}
                    onChange={(e) => setFormData({ ...formData, landholdingAcres: e.target.value })}
                    placeholder="e.g. 3.5 Acres"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pahani / RTC Survey Number
                  </label>
                  <input
                    type="text"
                    value={formData.surveyRtcNumber || ''}
                    onChange={(e) => setFormData({ ...formData, surveyRtcNumber: e.target.value })}
                    placeholder="e.g. Plot 142/2A"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Crops Grown
                  </label>
                  <input
                    type="text"
                    value={formData.primaryCrops || ''}
                    onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
                    placeholder="e.g. Paddy (Kharif), Ragi, Cotton"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Worker Specific Fields */}
          {formData.userType === 'Worker' && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Worker Trade &amp; Labour Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Occupation / Trade
                  </label>
                  <input
                    type="text"
                    value={formData.occupationTrade || ''}
                    onChange={(e) => setFormData({ ...formData, occupationTrade: e.target.value })}
                    placeholder="e.g. Mason / Driver / Carpentry"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    e-Shram UAN / BOCW Card
                  </label>
                  <input
                    type="text"
                    value={formData.eShramUan || ''}
                    onChange={(e) => setFormData({ ...formData, eShramUan: e.target.value })}
                    placeholder="e.g. 1009-8821-3321"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Senior Citizen Specific */}
          {formData.userType === 'Senior Citizen' && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Senior Citizen Details
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 64"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Person with Disability Specific */}
          {formData.userType === 'Person with Disability' && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Disability / UDID Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UDID Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.udidNumber || ''}
                    onChange={(e) => setFormData({ ...formData, udidNumber: e.target.value })}
                    placeholder="e.g. KA291048192019"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Disability Percentage
                  </label>
                  <input
                    type="text"
                    value={formData.disabilityPercent || ''}
                    onChange={(e) => setFormData({ ...formData, disabilityPercent: e.target.value })}
                    placeholder="e.g. 45%"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Required Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => {
                  setHasConsented(e.target.checked);
                  if (e.target.checked) setErrorMsg('');
                }}
                className="w-4 h-4 mt-0.5 rounded text-[#9333EA] focus:ring-[#9333EA]"
              />
              <span className="text-xs text-slate-700 leading-snug">
                {t.onboarding.consentCheckbox}
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#38104E] hover:bg-[#9333EA] text-white text-sm font-semibold transition-all shadow-md shadow-[#38104E]/20 active:scale-[0.98]"
            >
              {t.onboarding.continueBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
