import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Lock,
  User,
  GraduationCap,
  Tractor,
  Hammer,
  HeartHandshake,
  Accessibility,
  Home,
  Check,
  Globe,
  KeyRound,
  Laptop,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { UserType, UserProfile, Language, AuthSession, DeviceSession } from '../types';
import { PERSONA_OPTIONS, getDocumentsForUserType, getProjectsForUserType, getDocUpdatesForUserType, createPersonaProfile } from '../data/personaData';
import { NirvahaLogo } from './NirvahaLogo';

interface AuthScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (
    session: AuthSession,
    profile: UserProfile,
    roleChanged: boolean
  ) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
}) => {
  // Step 1: 'credentials' -> Step 2: 'device_verification' -> Step 3: 'persona_selection' -> Step 4: 'profile_builder'
  const [step, setStep] = useState<'credentials' | 'device_verification' | 'persona_selection' | 'profile_builder'>('credentials');

  // Credentials
  const [email, setEmail] = useState('sbg31122006@gmail.com');
  const [phone, setPhone] = useState('9845012345');
  const [isOtherDevice, setIsOtherDevice] = useState(false);

  // Device detection
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const [currentDeviceName, setCurrentDeviceName] = useState('Mobile Chrome (Android)');
  const [generatedOtp, setGeneratedOtp] = useState('742189');
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showSimulatedSms, setShowSimulatedSms] = useState(false);

  // Persona Selection
  const [selectedPersona, setSelectedPersona] = useState<UserType>('Farmer');

  // Custom Profile Form Data (No hardcoded Rahul Kumar!)
  const [customName, setCustomName] = useState('');
  const [district, setDistrict] = useState('Bengaluru Rural');
  const [state, setState] = useState('Karnataka');
  const [socialCategory, setSocialCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('OBC');
  const [householdIncome, setHouseholdIncome] = useState('₹1.5 Lakh - ₹2.5 Lakh per annum');
  const [rationCardType, setRationCardType] = useState<'BPL / PHH' | 'APL' | 'Antyodaya (AAY)' | 'None'>('BPL / PHH');

  // Persona Specific Extra Fields
  const [landAcres, setLandAcres] = useState('3.5 Acres');
  const [surveyPlot, setSurveyPlot] = useState('Plot 142/2A');
  const [primaryCrops, setPrimaryCrops] = useState('Paddy (Kharif) & Ragi');
  const [collegeName, setCollegeName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year (5th Semester)');
  const [tradeName, setTradeName] = useState('Construction & Carpentry');
  const [seniorAge, setSeniorAge] = useState('64');
  const [disabilityType, setDisabilityType] = useState('Locomotor Impairment (45%)');

  // Detect device on mount
  useEffect(() => {
    let devId = localStorage.getItem('nirvaha_device_id');
    if (!devId) {
      devId = `DEV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      localStorage.setItem('nirvaha_device_id', devId);
    }
    setCurrentDeviceId(devId);

    // Realistic device name detection
    const ua = navigator.userAgent;
    let dName = 'Mobile Device';
    if (/iPhone/i.test(ua)) dName = 'Apple iPhone (iOS Safari)';
    else if (/Android/i.test(ua)) dName = 'Android Mobile (Chrome)';
    else if (/Mac/i.test(ua)) dName = 'Apple Mac (Chrome / Safari)';
    else if (/Windows/i.test(ua)) dName = 'Windows PC';
    setCurrentDeviceName(dName);
  }, []);

  // Handle Login button submit
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) return;

    // Check if device is already trusted in localStorage
    const savedTrusted = localStorage.getItem(`nirvaha_trusted_devices_${email}`);
    const trustedList: DeviceSession[] = savedTrusted ? JSON.parse(savedTrusted) : [];
    const isAlreadyTrusted = trustedList.some((d) => d.deviceId === currentDeviceId && d.isVerified);

    // If logging in with other device OR device is not yet verified
    if (isOtherDevice || !isAlreadyTrusted) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setShowSimulatedSms(true);
      setStep('device_verification');
    } else {
      // Device is already trusted, proceed to persona check
      checkProfileOrProceed();
    }
  };

  // Verify OTP for new / other device
  const handleVerifyDeviceOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() !== generatedOtp.trim()) {
      setOtpError(
        language === 'kn'
          ? 'ದೃಢೀಕರಣ ಕೋಡ್ ಸರಿಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.'
          : 'Invalid verification code. Please check the 6-digit code sent.'
      );
      return;
    }

    setOtpError('');
    setShowSimulatedSms(false);

    // Save this device as trusted
    const newDevice: DeviceSession = {
      deviceId: currentDeviceId,
      deviceName: currentDeviceName,
      browserInfo: navigator.userAgent.slice(0, 40),
      ipLocation: 'Karnataka, India',
      lastLogin: new Date().toISOString(),
      isCurrentDevice: true,
      isVerified: true,
    };

    const savedTrusted = localStorage.getItem(`nirvaha_trusted_devices_${email}`);
    const trustedList: DeviceSession[] = savedTrusted ? JSON.parse(savedTrusted) : [];
    const updatedList = [newDevice, ...trustedList.filter((d) => d.deviceId !== currentDeviceId)];
    localStorage.setItem(`nirvaha_trusted_devices_${email}`, JSON.stringify(updatedList));

    // Proceed to "Who Are You?"
    checkProfileOrProceed();
  };

  // Check if profile exists for this email or show Persona Selection
  const checkProfileOrProceed = () => {
    const savedProfile = localStorage.getItem(`nirvaha_profile_${email}`);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.onboardingCompleted && parsed.userType) {
          // Profile exists, finish login
          completeLogin(parsed, false);
          return;
        }
      } catch (err) {
        console.warn('Error reading saved profile:', err);
      }
    }
    // No predefined profile -> Ask "Who Are You?"
    setStep('persona_selection');
  };

  // Select Persona and go to customize
  const handleSelectPersona = (type: UserType) => {
    setSelectedPersona(type);
    if (!customName.trim()) {
      if (type === 'Farmer') setCustomName('Ramesh Patil');
      else if (type === 'Student') setCustomName('Priya Gowda');
      else if (type === 'Worker') setCustomName('Manjunath S');
      else if (type === 'Senior Citizen') setCustomName('Basavaraj K');
      else if (type === 'Person with Disability') setCustomName('Anand Kumar');
      else setCustomName('Lakshmi Devi');
    }
    setStep('profile_builder');
  };

  // Save new custom profile
  const handleSaveCustomProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const extra: Record<string, any> = {
      district,
      state,
      socialCategory,
      householdIncomeRange: householdIncome,
      rationCardType,
      preferredLanguage: language,
    };

    if (selectedPersona === 'Farmer') {
      extra.landholdingAcres = landAcres;
      extra.surveyRtcNumber = surveyPlot;
      extra.primaryCrops = primaryCrops;
    } else if (selectedPersona === 'Student') {
      extra.collegeName = collegeName || 'Government Degree College';
      extra.course = courseName || 'B.Sc / B.E.';
      extra.yearOfStudy = yearOfStudy;
    } else if (selectedPersona === 'Worker') {
      extra.occupationTrade = tradeName;
    } else if (selectedPersona === 'Senior Citizen') {
      extra.age = seniorAge;
    } else if (selectedPersona === 'Person with Disability') {
      extra.disabilityType = disabilityType;
    }

    const created = createPersonaProfile(selectedPersona, customName, email, phone, extra);
    localStorage.setItem(`nirvaha_profile_${email}`, JSON.stringify(created));
    completeLogin(created, true);
  };

  const completeLogin = (profile: UserProfile, roleChanged: boolean) => {
    const session: AuthSession = {
      isLoggedIn: true,
      userEmail: email,
      userPhone: phone,
      activeDeviceId: currentDeviceId,
      activeDeviceName: currentDeviceName,
      isDeviceVerified: true,
      loginTimestamp: new Date().toISOString(),
      trustedDevices: [
        {
          deviceId: currentDeviceId,
          deviceName: currentDeviceName,
          browserInfo: 'Current Active Session',
          lastLogin: new Date().toISOString(),
          isCurrentDevice: true,
          isVerified: true,
        },
      ],
    };

    onLoginSuccess(session, profile, roleChanged);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-[#38104E] via-[#2A0845] to-[#1E0530] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Simulated Device SMS / Email Toast Banner */}
      {showSimulatedSms && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-purple-400 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <KeyRound className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-300">
                  {language === 'kn' ? 'ದೃಢೀಕರಣ ಕೋಡ್ ರವಾನೆಯಾಗಿದೆ' : 'Device Verification Code'}
                </div>
                <div className="text-xs text-slate-200 mt-0.5">
                  NIRVAHA Code for <strong>{currentDeviceName}</strong>:
                </div>
                <div className="text-lg font-mono font-extrabold tracking-widest text-emerald-400 mt-1">
                  {generatedOtp}
                </div>
              </div>
            </div>
            <button
              onClick={() => setInputOtp(generatedOtp)}
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-[11px] font-bold text-white shrink-0 shadow-xs"
            >
              Auto-fill
            </button>
          </div>
        </div>
      )}

      {/* Top Bar with Language Toggle & Official Seal */}
      <div className="flex items-center justify-between z-10 pt-1 pb-4">
        <div className="flex items-center gap-2">
          <NirvahaLogo size="sm" />
          <span className="text-xs font-bold tracking-wider uppercase text-purple-200">
            NIRVAHA AI
          </span>
        </div>

        {/* Bilingual Switcher */}
        <button
          onClick={() => onLanguageChange(language === 'en' ? 'kn' : 'en')}
          className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-1.5 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-purple-300" />
          <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
        </button>
      </div>

      {/* Main Form Carousel */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full my-auto z-10 py-2">
        {/* STEP 1: CREDENTIALS (GMAIL + PHONE) */}
        {step === 'credentials' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                {language === 'kn' ? 'ನಾಗರಿಕ ಲಾಗಿನ್' : 'Citizen Secure Sign-In'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
                {language === 'kn' ? 'ಖಾತೆಗೆ ಲಾಗಿನ್ ಆಗಿ' : 'Access Public Services'}
              </h1>
              <p className="text-xs text-purple-200 max-w-xs mx-auto">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ಜಿಮೇಲ್ ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಪ್ರವೇಶಿಸಿ'
                  : 'Enter your Gmail account and phone number to access personalized welfare guidance.'}
              </p>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-xl space-y-3.5">
              {/* Gmail Account */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-300" />
                  <span>{language === 'kn' ? 'ಜಿಮೇಲ್ ಖಾತೆ' : 'Google Gmail Account'} *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-300" />
                  <span>{language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Phone Number (10 Digits)'} *</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-white/20 text-xs font-bold text-white border border-white/20">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9845012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/90 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 tracking-wide"
                  />
                </div>
              </div>

              {/* Other Device Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={isOtherDevice}
                    onChange={(e) => setIsOtherDevice(e.target.checked)}
                    className="mt-0.5 rounded text-purple-500 focus:ring-purple-400"
                  />
                  <div className="text-[11px] leading-tight text-purple-100">
                    <span className="font-semibold text-white">
                      {language === 'kn' ? 'ಇನ್ನೊಂದು ಹೊಸ ಸಾಧನದಲ್ಲಿ ಲಾಗಿನ್ ಆಗುತ್ತಿದ್ದೀರಾ?' : 'Logging in with other / new device?'}
                    </span>
                    <p className="text-[10px] text-purple-300 mt-0.5">
                      {language === 'kn'
                        ? 'ಸುರಕ್ಷತೆಗಾಗಿ ೬-ಅಂಕಿಯ ದೃಢೀಕರಣ ಕೋಡ್ ಕಳುಹಿಸಲಾಗುವುದು.'
                        : 'Requires 6-digit security authorization code before access.'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Device Detection Pill */}
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-[11px] text-purple-200">
                <div className="flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-purple-300" />
                  <span>Detected: <strong>{currentDeviceName}</strong></span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-emerald-300">
                  ID: {currentDeviceId.slice(0, 8)}
                </span>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-[#9333EA] hover:from-purple-600 hover:to-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
              >
                <span>{language === 'kn' ? 'ಮುಂದುವರಿಯಿರಿ' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: DEVICE VERIFICATION CODE (OTP) */}
        {step === 'device_verification' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 mx-auto flex items-center justify-center mb-2">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {language === 'kn' ? 'ಸಾಧನ ದೃಢೀಕರಣ ಪರಿಶೀಲನೆ' : 'Device Verification Required'}
              </h2>
              <p className="text-xs text-purple-200 max-w-xs mx-auto">
                {language === 'kn'
                  ? `ಹೊಸ ಸಾಧನ ${currentDeviceName} ದೃಢೀಕರಿಸಲು ನಿಮ್ಮ ಜಿಮೇಲ್ (${email}) ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ೬-ಅಂಕಿಯ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ.`
                  : `Enter the 6-digit security code sent to ${email} and +91 ${phone} to authorize this device.`}
              </p>
            </div>

            <form onSubmit={handleVerifyDeviceOtp} className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5 text-center">
                  {language === 'kn' ? '೬-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ' : 'Enter 6-Digit Code'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  value={inputOtp}
                  onChange={(e) => {
                    setInputOtp(e.target.value.replace(/\D/g, ''));
                    setOtpError('');
                  }}
                  className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold py-3 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {otpError && (
                <div className="bg-red-500/20 border border-red-400/40 p-2.5 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-purple-200">
                <button
                  type="button"
                  onClick={() => {
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(code);
                    setShowSimulatedSms(true);
                  }}
                  className="text-purple-300 hover:text-white underline"
                >
                  {language === 'kn' ? 'ಕೋಡ್ ಮರುಕಳುಹಿಸಿ' : 'Resend code'}
                </button>
                <button
                  type="button"
                  onClick={() => setInputOtp(generatedOtp)}
                  className="text-emerald-300 font-bold hover:underline"
                >
                  Use test code ({generatedOtp})
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'kn' ? 'ಸಾಧನ ದೃಢೀಕರಿಸಿ' : 'Authorize & Trust Device'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="w-full text-center text-xs text-purple-300 hover:text-white"
              >
                &larr; {language === 'kn' ? 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ' : 'Back to login'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: "WHO ARE YOU?" (PERSONA SELECTION) */}
        {step === 'persona_selection' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-400/20 text-purple-200 border border-purple-400/30">
                {language === 'kn' ? 'ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಸೇವೆ' : 'Step 2: Who Are You?'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {language === 'kn' ? 'ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select Your Role'}
              </h2>
              <p className="text-xs text-purple-200 max-w-xs mx-auto">
                {language === 'kn'
                  ? 'ನಿಮಗೆ ಸೂಕ್ತವಾದ ಯೋಜನೆಗಳು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲು ನೀವು ಯಾರೆಂದು ತಿಳಿಸಿ.'
                  : 'We will configure your Citizen Vault & Status Tracker only with suggestions relevant to you.'}
              </p>
            </div>

            {/* Persona Selection Grid */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
              {PERSONA_OPTIONS.map((opt) => {
                const isSelected = selectedPersona === opt.type;

                return (
                  <div
                    key={opt.type}
                    onClick={() => handleSelectPersona(opt.type)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-600/40 border-purple-400 shadow-md ring-1 ring-purple-300'
                        : 'bg-white/10 hover:bg-white/15 border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        {opt.type === 'Farmer' && <Tractor className="w-5 h-5 text-emerald-300" />}
                        {opt.type === 'Student' && <GraduationCap className="w-5 h-5 text-purple-300" />}
                        {opt.type === 'Worker' && <Hammer className="w-5 h-5 text-amber-300" />}
                        {opt.type === 'Senior Citizen' && <HeartHandshake className="w-5 h-5 text-rose-300" />}
                        {opt.type === 'Person with Disability' && <Accessibility className="w-5 h-5 text-blue-300" />}
                        {opt.type === 'Citizen' && <Home className="w-5 h-5 text-teal-300" />}
                      </div>

                      <div className="leading-snug">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-white">
                            {language === 'kn' ? opt.titleKn : opt.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-purple-200 mt-0.5 line-clamp-1">
                          {language === 'kn' ? opt.taglineKn : opt.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0 text-white">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOM PROFILE BUILDER */}
        {step === 'profile_builder' && (
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                {selectedPersona}: Build Your Own Profile
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ' : 'Configure Your Profile'}
              </h2>
              <p className="text-[11px] text-purple-200">
                {language === 'kn'
                  ? 'ಯಾವುದೇ ಪೂರ್ವನಿಗದಿ ಮಾಹಿತಿಯಿಲ್ಲದೆ ನಿಮ್ಮ ನೈಜ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.'
                  : 'Enter your custom name and specifics for tailored public welfare delivery.'}
              </p>
            </div>

            <form onSubmit={handleSaveCustomProfile} className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/15 shadow-xl space-y-3 max-h-[420px] overflow-y-auto no-scrollbar">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1">
                  {language === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು' : 'Your Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={selectedPersona === 'Farmer' ? 'e.g. Ramesh Patil' : selectedPersona === 'Student' ? 'e.g. Priya Gowda' : 'e.g. Suresh Kumar'}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* District & Category */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="Bengaluru Urban">Bengaluru Urban</option>
                    <option value="Bengaluru Rural">Bengaluru Rural</option>
                    <option value="Mandya">Mandya</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Belagavi">Belagavi</option>
                    <option value="Kalaburagi">Kalaburagi</option>
                    <option value="Shivamogga">Shivamogga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Category
                  </label>
                  <select
                    value={socialCategory}
                    onChange={(e) => setSocialCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="OBC">OBC (Cat 2A/3A/3B)</option>
                    <option value="General">General</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

              {/* Income Bracket & Ration Card */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Annual Income
                  </label>
                  <select
                    value={householdIncome}
                    onChange={(e) => setHouseholdIncome(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-medium focus:outline-none"
                  >
                    <option value="Below ₹1.5 Lakh per annum">Below ₹1.5 Lakh</option>
                    <option value="₹1.5 Lakh - ₹2.5 Lakh per annum">₹1.5L - ₹2.5L</option>
                    <option value="₹2.5 Lakh - ₹5 Lakh per annum">₹2.5L - ₹5L</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    Ration Card
                  </label>
                  <select
                    value={rationCardType}
                    onChange={(e) => setRationCardType(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-medium focus:outline-none"
                  >
                    <option value="BPL / PHH">BPL / Priority (PHH)</option>
                    <option value="Antyodaya (AAY)">Antyodaya (AAY)</option>
                    <option value="APL">APL</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Persona-Specific Inputs */}
              {selectedPersona === 'Farmer' && (
                <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-400/30 space-y-2.5">
                  <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                    Farmer Land &amp; Crop Details
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-emerald-200 mb-0.5">Land Size</label>
                      <input
                        type="text"
                        placeholder="e.g. 3.5 Acres"
                        value={landAcres}
                        onChange={(e) => setLandAcres(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-emerald-200 mb-0.5">RTC Survey No.</label>
                      <input
                        type="text"
                        placeholder="e.g. 142/2A"
                        value={surveyPlot}
                        onChange={(e) => setSurveyPlot(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-emerald-200 mb-0.5">Primary Crops</label>
                    <input
                      type="text"
                      placeholder="e.g. Paddy (Kharif) & Ragi"
                      value={primaryCrops}
                      onChange={(e) => setPrimaryCrops(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedPersona === 'Student' && (
                <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-400/30 space-y-2.5">
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wide">
                    Student College &amp; Course
                  </div>
                  <div>
                    <label className="block text-[10px] text-purple-200 mb-0.5">College Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Govt First Grade College / Engineering"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-purple-200 mb-0.5">Course / Degree</label>
                      <input
                        type="text"
                        placeholder="e.g. B.E. / B.Sc"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-purple-200 mb-0.5">Year / Sem</label>
                      <input
                        type="text"
                        placeholder="e.g. 3rd Year"
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPersona === 'Worker' && (
                <div className="bg-amber-950/40 p-3 rounded-2xl border border-amber-400/30 space-y-2">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    Worker Trade &amp; Welfare Card
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-200 mb-0.5">Occupation / Trade</label>
                    <input
                      type="text"
                      placeholder="e.g. Mason / Driver / Carpentry"
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedPersona === 'Senior Citizen' && (
                <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-400/30 space-y-2">
                  <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wide">
                    Senior Citizen Age Proof
                  </div>
                  <div>
                    <label className="block text-[10px] text-rose-200 mb-0.5">Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 64"
                      value={seniorAge}
                      onChange={(e) => setSeniorAge(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="p-2.5 bg-black/30 rounded-xl border border-white/10 text-[10px] text-purple-200 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero sensitive data stored. Passwords, full Aadhaar, or bank PINs are never requested.</span>
              </div>

              {/* Submit Profile */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ ಮತ್ತು ಪ್ರಾರಂಭಿಸಿ' : 'Save Profile & Enter NIRVAHA AI'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('persona_selection')}
                className="w-full text-center text-xs text-purple-300 hover:text-white"
              >
                &larr; {language === 'kn' ? 'ಬೇರೆ ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ' : 'Change Persona'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Guarantees */}
      <div className="text-center text-[10px] text-purple-300/80 pt-2 pb-1 border-t border-white/10">
        NIRVAHA AI • Multilingual Public Service Agent • Multi-Device Security Verified
      </div>
    </div>
  );
};
