import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  FolderLock,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Filter,
} from 'lucide-react';
import {
  DocumentationUpdateItem,
  DocumentationSummary,
  Language,
  UploadedDoc,
  UserProfile,
} from '../types';
import { initialDocUpdates, defaultDocSummary } from '../data/projectStatusData';
import { getDocUpdatesForUserType } from '../data/personaData';

interface DocUpdatesPageProps {
  language: Language;
  userProfile: UserProfile;
  onNavigate: (tab: string) => void;
  onOpenVaultDoc?: (docId: string) => void;
  userDocuments?: UploadedDoc[];
}

export const DocUpdatesPage: React.FC<DocUpdatesPageProps> = ({
  language,
  userProfile,
  onNavigate,
  onOpenVaultDoc,
  userDocuments = [],
}) => {
  const [docUpdates, setDocUpdates] = useState<DocumentationUpdateItem[]>(() =>
    getDocUpdatesForUserType(userProfile.userType)
  );
  const [summary, setSummary] = useState<DocumentationSummary>(defaultDocSummary);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gazette' | 'expiry' | 'sync'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // When user profile changes, re-tailor updates
  useEffect(() => {
    setDocUpdates(getDocUpdatesForUserType(userProfile.userType));
  }, [userProfile.userType]);

  // Fetch documentation updates from backend
  useEffect(() => {
    fetch('/api/documentation/updates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.docUpdates)) {
          const relevant = data.docUpdates.filter((u: DocumentationUpdateItem) => {
            if (u.userTypes && u.userTypes.length > 0) {
              return u.userTypes.includes(userProfile.userType);
            }
            return false;
          });
          if (relevant.length > 0) {
            setDocUpdates(relevant);
          } else {
            setDocUpdates(getDocUpdatesForUserType(userProfile.userType));
          }
        }
      })
      .catch((err) => console.warn('Could not load doc updates from API, using local memory:', err));
  }, [userProfile.userType]);

  // Request AI Summary from server (Gemini 3.8 Flash)
  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/gemini/summarize-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          customDocUpdates: docUpdates,
        }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.warn('Gemini doc summary error, using local fallback:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Voice Readout (TTS)
  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      window.speechSynthesis?.cancel();
      setIsPlayingVoice(false);
      return;
    }

    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const textToSpeak =
      language === 'kn' && summary.summaryTextKn ? summary.summaryTextKn : summary.summaryText;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    setIsPlayingVoice(true);
    window.speechSynthesis.speak(utterance);
  };

  // Copy Summary text
  const handleCopySummary = () => {
    const text = `📑 NIRVAHA AI Documentation Digest (${new Date().toLocaleDateString()}):\n\n${summary.summaryText}\n\nCritical Actions:\n${summary.criticalActionItems.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nGazette Highlights:\n${summary.gazetteHighlights.map((g) => `• ${g}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  // Live Portal Sync Simulation
  const handleTriggerPortalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast('State Portals & Nadakacheri synced successfully! 6 records up to date.');
      setTimeout(() => setSyncToast(null), 4000);
    }, 1400);
  };

  // Filter doc updates
  const filteredUpdates = docUpdates.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'gazette') return item.category === 'Gazette / Rule';
    if (selectedFilter === 'expiry') return item.category === 'Certificate Expiry';
    if (selectedFilter === 'sync') return item.category === 'Direct Portal Sync' || item.category === 'Verification Status';
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 pb-24">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#38104E] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-purple-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Mobile-Friendly Header with Title and Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#1E1B4B] via-[#38104E] to-[#581C87] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 text-purple-100 flex items-center gap-1">
              <FileText className="w-3 h-3 text-purple-300" />
              Gazette &amp; Vault Intelligence
            </span>
            <span className="text-[11px] text-purple-200">
              {docUpdates.length} Verified Rule &amp; Cert Updates
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
            {language === 'kn' ? 'ದಾಖಲೆಗಳು ಮತ್ತು ಗೆಜೆಟ್ ಅಪ್‌ಡೇಟ್‌ಗಳು' : 'Documentation Updates & Circulars'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            {language === 'kn'
              ? 'ಸರ್ಕಾರಿ ಆದೇಶಗಳು, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರಗಳ ಅವಧಿ ಮತ್ತು ಪರಿಶೀಲನೆಗಳ AI ಸಾರಾಂಶ'
              : 'AI-grounded summary of official gazette changes, certificate expirations, and vault sync.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleTriggerPortalSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-purple-400/30 hover:bg-purple-400/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/20 active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Digilocker / Nadakacheri'}</span>
          </button>
        </div>
      </div>

      {/* Persona Context Card */}
      <div className="bg-white rounded-2xl border border-purple-200/80 p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E1B4B] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {userProfile.preferredName ? userProfile.preferredName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#38104E]">{userProfile.preferredName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9333EA] text-white">
                {userProfile.userType}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'kn'
                ? `${userProfile.userType} ಪಾತ್ರಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಗೆಜೆಟ್ ಆದೇಶಗಳು ಮತ್ತು ದಾಖಲೆ ನವೀಕರಣಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.`
                : `Showing official gazettes, orders, and certificates relevant to your ${userProfile.userType} profile.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-[#38104E] border border-purple-200 shrink-0"
        >
          {language === 'kn' ? 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ' : 'Switch Role'}
        </button>
      </div>

      {/* Top Mobile KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#9333EA] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">Compliance Score</div>
            <div className="text-lg font-bold text-slate-900">{summary.complianceScore}%</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">Expiring Soon</div>
            <div className="text-lg font-bold text-amber-700">1 in 45 days</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">Verified in Vault</div>
            <div className="text-lg font-bold text-emerald-700">4 / 6 Docs</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">New Circulars</div>
            <div className="text-lg font-bold text-blue-700">3 Notifications</div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE GEMINI AI DOCUMENTATION SUMMARY CARD */}
      <div className="bg-gradient-to-br from-white via-[#FAF5FF] to-purple-50/60 rounded-2xl sm:rounded-3xl border-2 border-purple-200/90 shadow-md p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38104E] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#38104E] uppercase tracking-wide">
                  Executive Documentation Digest
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {summary.complianceScore}% High Compliance
                </span>
              </div>
              <span className="text-[11px] text-slate-700">
                Official Gazette &amp; Citizen Vault Synthesis • Real-time Grounding
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-center">
            <button
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                isPlayingVoice
                  ? 'bg-purple-600 text-white border-purple-700 animate-pulse'
                  : 'bg-white hover:bg-purple-50 text-slate-700 border-purple-200'
              }`}
              title="Listen to summary (Text-to-Speech)"
              aria-label="Listen to documentation digest"
            >
              {isPlayingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-xs hidden sm:inline">{isPlayingVoice ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="p-2 rounded-xl bg-white hover:bg-purple-50 text-slate-700 border border-purple-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy Summary"
              aria-label="Copy Summary"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-xs hidden sm:inline">{copiedSummary ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleGenerateSummary}
              disabled={isSummarizing}
              className="px-3 py-2 rounded-xl bg-[#38104E] hover:bg-[#581C87] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-300 ${isSummarizing ? 'animate-spin' : ''}`} />
              <span>{isSummarizing ? 'Synthesizing...' : 'Refresh AI'}</span>
            </button>
          </div>
        </div>

        {/* Executive Text */}
        <div className="mt-3 sm:mt-4 text-sm text-slate-800 leading-relaxed font-normal bg-white/70 backdrop-blur-xs p-3.5 rounded-xl border border-purple-100">
          {language === 'kn' && summary.summaryTextKn ? summary.summaryTextKn : summary.summaryText}
        </div>

        {/* Action Items & Gazette Highlights Split */}
        <div className="mt-3.5 pt-3 border-t border-purple-100/70 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Critical Documentation Action Items
            </div>
            <div className="space-y-1.5">
              {summary.criticalActionItems.map((action, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 text-amber-950"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              New Government Circular Highlights
            </div>
            <div className="space-y-1.5">
              {summary.gazetteHighlights.map((gh, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-purple-100 text-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] mt-1.5 shrink-0" />
                  <span className="leading-snug">{gh}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expiring Documents Banner */}
        {summary.expiringDocuments && summary.expiringDocuments.length > 0 && (
          <div className="mt-3.5 bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900">
                  Upcoming Expiration Warning:
                </span>
                <p className="text-xs text-amber-800 mt-0.5">
                  <strong>{summary.expiringDocuments[0].name}</strong> ({summary.expiringDocuments[0].daysLeft} days remaining).
                  Renewal Portal: {summary.expiringDocuments[0].renewalPortal}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('vault')}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
            >
              Open Document Vault &rarr;
            </button>
          </div>
        )}
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              selectedFilter === 'all'
                ? 'bg-[#38104E] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            All Updates ({docUpdates.length})
          </button>
          <button
            onClick={() => setSelectedFilter('gazette')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1 ${
              selectedFilter === 'gazette'
                ? 'bg-[#9333EA] text-white shadow-xs'
                : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Gazette Rules ({docUpdates.filter((d) => d.category === 'Gazette / Rule').length})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('expiry')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1 ${
              selectedFilter === 'expiry'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Expiry Alerts ({docUpdates.filter((d) => d.category === 'Certificate Expiry').length})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('sync')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              selectedFilter === 'sync'
                ? 'bg-[#38104E] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            Portal Sync &amp; Stamped
          </button>
        </div>
      </div>

      {/* DOCUMENTATION UPDATE CARDS */}
      <div className="space-y-4">
        {filteredUpdates.map((item) => {
          const isHighImpact = item.impactLevel === 'High';
          const isExpiry = item.category === 'Certificate Expiry';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-150 overflow-hidden shadow-xs hover:shadow-md ${
                isExpiry
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : isHighImpact
                  ? 'border-purple-200'
                  : 'border-purple-100'
              }`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.category === 'Gazette / Rule'
                          ? 'bg-purple-100 text-[#38104E] border border-purple-200'
                          : item.category === 'Certificate Expiry'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : item.category === 'Direct Portal Sync'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {item.category}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.impactLevel === 'High'
                          ? 'bg-purple-50 text-[#9333EA] border border-purple-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.impactLevel} Impact
                    </span>
                  </div>

                  <span className="text-xs text-slate-700 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-700" />
                    <span>Updated {item.dateUpdated}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#38104E] leading-snug">
                  {language === 'kn' && item.titleKn ? item.titleKn : item.title}
                </h3>

                {/* Issuer & Domain */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 mt-1">
                  <span>{item.sourceOrIssuer}</span>
                  <span>•</span>
                  <a
                    href={`https://${item.officialDomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#9333EA] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>{item.officialDomain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Summary text */}
                <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF7FD] p-3 rounded-xl border border-purple-100">
                  {language === 'kn' && item.summaryTextKn ? item.summaryTextKn : item.summaryText}
                </p>

                {/* Affected projects badges */}
                {item.affectedProjects && item.affectedProjects.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-700">Affects Case:</span>
                    {item.affectedProjects.map((pName, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate('status')}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-purple-50 text-[#38104E] hover:bg-purple-100 transition-colors border border-purple-200/80 inline-flex items-center gap-1"
                      >
                        <span>{pName}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Prompt */}
                {item.actionPrompt && (
                  <div className="mt-3 bg-purple-50/70 p-3 rounded-xl border border-purple-100 flex items-start justify-between gap-3">
                    <div className="text-xs text-slate-800 leading-snug">
                      <strong className="text-[#38104E] font-semibold">Recommended Action: </strong>
                      {language === 'kn' && item.actionPromptKn ? item.actionPromptKn : item.actionPrompt}
                    </div>

                    {item.actionType === 'renew' && (
                      <button
                        onClick={() => onNavigate('vault')}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-2xs"
                      >
                        Renew in Vault
                      </button>
                    )}

                    {item.actionType === 'upload' && (
                      <button
                        onClick={() => onNavigate('vault')}
                        className="px-3 py-1.5 rounded-xl bg-[#38104E] hover:bg-[#581C87] text-white text-xs font-bold shrink-0 shadow-2xs"
                      >
                        Upload Photos
                      </button>
                    )}

                    {item.actionType === 'read_gazette' && (
                      <a
                        href={`https://${item.officialDomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#38104E] hover:bg-[#581C87] text-white text-xs font-bold shrink-0 inline-flex items-center gap-1"
                      >
                        <span>Official Gazette</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="bg-[#FAF7FD] border-t border-purple-100 px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <FolderLock className="w-3.5 h-3.5 text-purple-700" />
                  <span>
                    {item.rdNumber ? `Ref: ${item.rdNumber}` : item.documentRef ? `File: ${item.documentRef}` : 'Verified Regulatory Record'}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('vault')}
                  className="text-xs font-semibold text-[#38104E] hover:underline"
                >
                  View in Citizen Vault &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
