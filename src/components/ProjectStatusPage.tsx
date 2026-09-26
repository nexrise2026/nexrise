import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  RefreshCw,
  PhoneCall,
  FileText,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  ProjectStatusItem,
  ProjectStatusSummary,
  Language,
  UserProfile,
} from '../types';
import { initialProjects, defaultStatusSummary } from '../data/projectStatusData';
import { getProjectsForUserType } from '../data/personaData';

interface ProjectStatusPageProps {
  language: Language;
  userProfile: UserProfile;
  onNavigate: (tab: string) => void;
  onOpenAssistFill?: (serviceId: string) => void;
  onOpenHumanSupport?: (category: string) => void;
}

export const ProjectStatusPage: React.FC<ProjectStatusPageProps> = ({
  language,
  userProfile,
  onNavigate,
  onOpenAssistFill,
  onOpenHumanSupport,
}) => {
  // Initialize with projects tailored strictly to user's persona
  const [projects, setProjects] = useState<ProjectStatusItem[]>(() =>
    getProjectsForUserType(userProfile.userType)
  );
  const [summary, setSummary] = useState<ProjectStatusSummary>(defaultStatusSummary);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'action_required' | 'under_review' | 'submitted'>('all');
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // When user profile changes, re-tailor projects
  useEffect(() => {
    setProjects(getProjectsForUserType(userProfile.userType));
  }, [userProfile.userType]);

  // Track New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  // Fetch live projects from backend and filter by userType
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects)) {
          const relevantFromApi = data.projects.filter((p: ProjectStatusItem) => {
            if (p.userTypes && p.userTypes.length > 0) {
              return p.userTypes.includes(userProfile.userType);
            }
            return false;
          });
          if (relevantFromApi.length > 0) {
            setProjects(relevantFromApi);
          } else {
            setProjects(getProjectsForUserType(userProfile.userType));
          }
        }
      })
      .catch((err) => console.warn('Could not load projects from API, using local memory:', err));
  }, [userProfile.userType]);

  // Request AI Summary from server (Gemini 3.8 Flash)
  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/gemini/summarize-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          customProjects: projects,
        }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.warn('Gemini summary error, using local fallback:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Toggle milestone completion
  const handleToggleMilestone = async (projectId: string, milestoneId: string) => {
    // Optimistic UI update
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedMilestones = proj.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed, date: !m.completed ? 'Just now' : undefined } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...proj,
          milestones: updatedMilestones,
          progressPercent,
          status: progressPercent === 100 ? 'disbursed' : progressPercent > 50 ? 'under_review' : proj.status,
        };
      })
    );

    // Backend sync
    try {
      await fetch('/api/projects/milestone/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, milestoneId }),
      });
    } catch (err) {
      console.warn('Failed to sync milestone toggle with server:', err);
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
    const text = `📊 NIRVAHA AI Status Summary (${new Date().toLocaleDateString()}):\n\n${summary.summaryText}\n\nCritical Deadlines:\n${summary.criticalDeadlines.map((d) => `• ${d.title}: ${d.daysLeft}d left - ${d.actionNeeded}`).join('\n')}\n\nTop Actions:\n${summary.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  // Copy Case Code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Toggle card expansion
  const toggleCard = (id: string) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Add new case
  const handleAddNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: ProjectStatusItem = {
      id: `proj-${Date.now()}`,
      code: newCode.trim() || `NIR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      title: newTitle.trim(),
      titleKn: newTitle.trim(),
      department: newDepartment.trim() || 'Government Welfare Desk',
      officialDomain: 'karnataka.gov.in',
      serviceId: 'srv-custom',
      status: 'submitted',
      statusLabel: 'Draft Initialized (1/4 steps)',
      statusLabelKn: 'ಆರಂಭಿಕ ಹಂತದಲ್ಲಿದೆ',
      progressPercent: 25,
      benefitAmount: newBenefit.trim() || 'Financial Support',
      daysRemaining: 30,
      deadlineDate: 'In 30 days',
      urgency: 'normal',
      assignedAuthority: 'Welfare Cell Officer',
      nextAction: 'Complete initial document upload and verification in Citizen Vault.',
      nextActionKn: 'ಸಿಟಿಜನ್ ವಾಲ್ಟ್‌ನಲ್ಲಿ ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ.',
      milestones: [
        { id: `m-${Date.now()}-1`, label: 'Initial Registration Lodged', completed: true, date: 'Today' },
        { id: `m-${Date.now()}-2`, label: 'Citizen Vault Proof Attestation', completed: false },
        { id: `m-${Date.now()}-3`, label: 'Department Nodal Officer Scrutiny', completed: false },
        { id: `m-${Date.now()}-4`, label: 'Direct Benefit Credit (DBT)', completed: false },
      ],
      lastUpdate: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);
    setIsNewProjectModalOpen(false);
    setNewTitle('');
    setNewCode('');
    setNewDepartment('');
    setNewBenefit('');

    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj),
    }).catch((err) => console.warn('Sync new project error:', err));
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'action_required') return p.status === 'action_required' || p.urgency === 'critical';
    if (selectedFilter === 'under_review') return p.status === 'under_review';
    if (selectedFilter === 'submitted') return p.status === 'submitted' || p.status === 'disbursed';
    return true;
  });

  // Calculate high-level stats
  const totalCases = projects.length;
  const criticalCases = projects.filter((p) => p.urgency === 'critical' || p.daysRemaining <= 4).length;
  const avgProgress = Math.round(projects.reduce((acc, curr) => acc + curr.progressPercent, 0) / (totalCases || 1));

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 pb-24">
      {/* Mobile-Friendly Header with Title and Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#38104E] to-[#581C87] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 text-purple-100 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-300" />
              Live Case Tracker
            </span>
            <span className="text-[11px] text-purple-200">
              {totalCases} Active Public Projects
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
            {language === 'kn' ? 'ಯೋಜನೆಗಳ ಸ್ಥಿತಿ ಮತ್ತು ಪ್ರಗತಿ' : 'Project Status & Executive Tracker'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            {language === 'kn'
              ? 'ಸರ್ಕಾರಿ ಅನುದಾನಗಳು, ಪರಿಹಾರ ಅರ್ಜಿಗಳು ಮತ್ತು ಗಡುವುಗಳ ನೈಜ-ಸಮಯದ AI ಸಾರಾಂಶ'
              : 'Real-time tracking of welfare grants, relief intimations, and AI-powered executive status briefing.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-400/30 hover:bg-purple-400/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'kn' ? 'ಹೊಸ ಕೇಸ್ ಸೇರಿಸಿ' : 'Track New Case'}</span>
          </button>
        </div>
      </div>

      {/* Persona Context Card */}
      <div className="bg-white rounded-2xl border border-purple-200/80 p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#38104E] text-white flex items-center justify-center font-bold text-sm shrink-0">
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
                ? `${userProfile.userType} ಪ್ರೊಫೈಲ್‌ಗೆ ಸಂಬಂಧಿಸಿದ ${projects.length} ಸಕ್ರಿಯ ಯೋಜನೆಗಳನ್ನು ಮಾತ್ರ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ.`
                : `Tracking ${projects.length} active public service cases strictly tailored for your ${userProfile.userType} profile.`}
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
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">Avg. Progress</div>
            <div className="text-lg font-bold text-slate-900">{avgProgress}%</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">Critical Deadlines</div>
            <div className="text-lg font-bold text-amber-700">{criticalCases} within 4d</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">Total Aid Tracked</div>
            <div className="text-lg font-bold text-emerald-700">₹1,62,000</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#38104E] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-700 font-medium">Verified Portals</div>
            <div className="text-lg font-bold text-slate-900">5 .gov.in</div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE GEMINI AI STATUS SUMMARY CARD */}
      <div className="bg-gradient-to-br from-white via-[#FAF5FF] to-purple-50/60 rounded-2xl sm:rounded-3xl border-2 border-purple-200/90 shadow-md p-4 sm:p-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38104E] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#38104E] uppercase tracking-wide">
                  Gemini 3.8 AI Executive Summary
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {summary.healthStatus}
                </span>
              </div>
              <span className="text-[11px] text-slate-700">
                Health Score: <strong className="text-[#38104E]">{summary.healthScore}/100</strong> • Live Synthesis
              </span>
            </div>
          </div>

          {/* Action buttons on summary card */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-center">
            <button
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                isPlayingVoice
                  ? 'bg-purple-600 text-white border-purple-700 animate-pulse'
                  : 'bg-white hover:bg-purple-50 text-slate-700 border-purple-200'
              }`}
              title="Listen to summary (Text-to-Speech)"
              aria-label="Listen to summary"
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
              <span>{isSummarizing ? 'Analyzing...' : 'Refresh AI'}</span>
            </button>
          </div>
        </div>

        {/* Executive Text */}
        <div className="mt-3 sm:mt-4 text-sm text-slate-800 leading-relaxed font-normal bg-white/70 backdrop-blur-xs p-3.5 rounded-xl border border-purple-100">
          {language === 'kn' && summary.summaryTextKn ? summary.summaryTextKn : summary.summaryText}
        </div>

        {/* Key Highlights Grid */}
        <div className="mt-3.5 pt-3 border-t border-purple-100/70">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9333EA]" />
            Key Project Milestones &amp; Urgencies
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {summary.keyHighlights.map((hl, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-purple-100/80 text-slate-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] mt-1.5 shrink-0" />
                <span className="leading-snug">{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Deadlines Callout Banner */}
        {summary.criticalDeadlines && summary.criticalDeadlines.length > 0 && (
          <div className="mt-3 bg-amber-50/90 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900">
                  Immediate Deadline Attention:
                </span>
                <p className="text-xs text-amber-800 mt-0.5">
                  <strong>{summary.criticalDeadlines[0].title}</strong> ({summary.criticalDeadlines[0].daysLeft}d left):{' '}
                  {summary.criticalDeadlines[0].actionNeeded}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('action-plan')}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
            >
              Open Full Checklist &rarr;
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
            All Cases ({projects.length})
          </button>
          <button
            onClick={() => setSelectedFilter('action_required')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1 ${
              selectedFilter === 'action_required'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Action Required ({projects.filter((p) => p.urgency === 'critical' || p.status === 'action_required').length})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('under_review')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              selectedFilter === 'under_review'
                ? 'bg-[#38104E] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            In Review ({projects.filter((p) => p.status === 'under_review').length})
          </button>
          <button
            onClick={() => setSelectedFilter('submitted')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              selectedFilter === 'submitted'
                ? 'bg-[#38104E] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            Submitted ({projects.filter((p) => p.status === 'submitted').length})
          </button>
        </div>
      </div>

      {/* PROJECT STATUS CARDS LIST */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const isExpanded = expandedProjects[project.id];
          const isCritical = project.urgency === 'critical';

          return (
            <div
              key={project.id}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-150 overflow-hidden shadow-xs hover:shadow-md ${
                isCritical ? 'border-amber-300 ring-1 ring-amber-200' : 'border-purple-100'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(project.code)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-purple-50 text-[#38104E] hover:bg-purple-100 transition-colors border border-purple-200/80"
                      title="Click to copy Application Reference Code"
                    >
                      <span>{project.code}</span>
                      {copiedCode === project.code ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        project.status === 'action_required'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : project.status === 'under_review'
                          ? 'bg-purple-100 text-[#38104E] border border-purple-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {language === 'kn' && project.statusLabelKn ? project.statusLabelKn : project.statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Days countdown badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        project.daysRemaining <= 2
                          ? 'bg-red-100 text-red-900 border border-red-200 animate-pulse'
                          : project.daysRemaining <= 5
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {project.daysRemaining <= 1 ? '18 hrs left' : `${project.daysRemaining} days left`}
                    </span>

                    {/* Benefit amount */}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-[#38104E] border border-purple-200">
                      {project.benefitAmount}
                    </span>
                  </div>
                </div>

                {/* Title & Department */}
                <h3 className="text-base sm:text-lg font-bold text-[#38104E] leading-snug">
                  {language === 'kn' && project.titleKn ? project.titleKn : project.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 mt-1">
                  <span>{project.department}</span>
                  <span>•</span>
                  <a
                    href={`https://${project.officialDomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#9333EA] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>{project.officialDomain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-700">Application Milestones</span>
                    <span className="font-bold text-[#38104E]">{project.progressPercent}% Complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-purple-100/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        project.progressPercent === 100
                          ? 'bg-emerald-500'
                          : project.progressPercent > 50
                          ? 'bg-gradient-to-r from-[#9333EA] to-[#38104E]'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Immediate Next Action Box */}
                <div className="mt-3 bg-purple-50/70 p-3 rounded-xl border border-purple-100 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#38104E] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    &gt;
                  </div>
                  <div className="text-xs text-slate-800 leading-snug">
                    <strong className="text-[#38104E] font-semibold">Immediate Next Step: </strong>
                    {language === 'kn' && project.nextActionKn ? project.nextActionKn : project.nextAction}
                  </div>
                </div>

                {/* Blockers alert if present */}
                {project.blockers && project.blockers.length > 0 && (
                  <div className="mt-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{project.blockers[0]}</span>
                  </div>
                )}
              </div>

              {/* Expandable Milestones Accordion */}
              {isExpanded && (
                <div className="bg-[#FAF7FD] border-t border-purple-100 px-4 sm:px-6 py-4 space-y-3">
                  <div className="text-xs font-bold text-[#38104E] uppercase tracking-wider flex items-center justify-between">
                    <span>Verified Milestone Progression ({project.milestones.filter((m) => m.completed).length}/{project.milestones.length})</span>
                    <span className="text-[11px] text-slate-700 font-normal">Tap checkbox to update step</span>
                  </div>

                  <div className="space-y-2">
                    {project.milestones.map((m, idx) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(project.id, m.id)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                          m.completed
                            ? 'bg-white border-purple-100 text-slate-700'
                            : 'bg-white/60 hover:bg-white border-dashed border-slate-300 text-slate-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                            m.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {m.completed && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 leading-snug">
                          <div className="flex items-center justify-between gap-2">
                            <span className={m.completed ? 'font-medium text-slate-800' : 'text-slate-600'}>
                              {idx + 1}. {language === 'kn' && m.labelKn ? m.labelKn : m.label}
                            </span>
                            {m.date && (
                              <span className="text-[10px] text-slate-700 font-medium shrink-0">
                                {m.date}
                              </span>
                            )}
                          </div>
                          {m.note && (
                            <p className="text-[11px] text-[#9333EA] mt-0.5 font-medium">
                              Note: {m.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Office & Authority footer info */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700 border-t border-purple-100/70">
                    <div>
                      <strong>Assigned Desk: </strong> {project.assignedAuthority}
                    </div>
                    {project.contactHelpline && (
                      <div className="flex items-center gap-1.5 text-purple-700 font-medium">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Helpline: {project.contactHelpline}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="bg-white border-t border-purple-100 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleCard(project.id)}
                  className="text-xs font-semibold text-[#38104E] hover:text-[#9333EA] flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <span>Hide Milestones</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>View Milestones ({project.milestones.length})</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onOpenHumanSupport) {
                        onOpenHumanSupport(`${project.title} (${project.code})`);
                      } else {
                        onNavigate('support');
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-purple-50 transition-colors flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Human Help</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenAssistFill) {
                        onOpenAssistFill(project.serviceId);
                      } else {
                        onNavigate('assist-fill');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#38104E] hover:bg-[#581C87] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>AssistFill</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TRACK NEW CASE MODAL */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-100 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-lg font-bold text-[#38104E]">
                {language === 'kn' ? 'ಹೊಸ ಯೋಜನೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track New Public Service Project'}
              </h3>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddNewCase} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheme / Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka Post-Matric Hostel Admission"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application / Acknowledgement Reference Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. NIR-2026-98124 or ACK-KA-8812"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Social Welfare Dept"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Benefit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 / year"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#38104E] text-white text-xs font-bold hover:bg-[#581C87] shadow-xs"
                >
                  Save &amp; Track Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
