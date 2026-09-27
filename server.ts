import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side Gemini initialization
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini client initialization warning:', err);
  }
}

// In-memory mock database for Hackathon demonstration
interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'CONSENT' | 'APPLICATION' | 'REVOCATION' | 'ESCALATION' | 'ADMIN';
  details: string;
  serviceId?: string;
  dataCategoriesShared?: string[];
  status: 'SUCCESS' | 'REVOKED' | 'PENDING';
}

interface SupportTicket {
  id: string;
  category: string;
  description: string;
  contactMethod: string;
  sharedPlanSummary: boolean;
  timestamp: string;
  status: 'PENDING' | 'ASSIGNED' | 'RESOLVED';
  assignedTo: string;
}

const auditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    action: 'SERVICE_SOURCE_VERIFICATION',
    category: 'ADMIN',
    details: 'Verified Karnataka Student Fee Support Grant official portal and rules.',
    serviceId: 'srv-karnataka-fee',
    status: 'SUCCESS',
  },
  {
    id: 'AUD-002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'ONBOARDING_CONSENT_ACKNOWLEDGED',
    category: 'CONSENT',
    details: 'User acknowledged guidance disclaimer without data storage.',
    status: 'SUCCESS',
  }
];

const supportTickets: SupportTicket[] = [
  {
    id: 'NIR-2026-00089',
    category: 'Fee Support & Bonafide Issuance',
    description: 'Student requested clarification on fee concession deadline.',
    contactMethod: 'Phone / WhatsApp',
    sharedPlanSummary: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'ASSIGNED',
    assignedTo: 'College Student Welfare Desk',
  }
];

// API: Audit logs
app.get('/api/audit-logs', (_req, res) => {
  res.json({ success: true, logs: auditLogs });
});

// API: Human support escalation ticket
app.post('/api/support/ticket', (req, res) => {
  const { category, description, contactMethod, sharedPlanSummary } = req.body;
  const ticketId = `NIR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const newTicket: SupportTicket = {
    id: ticketId,
    category: category || 'General Guidance',
    description: description || 'Assistance requested with public service action plan',
    contactMethod: contactMethod || 'Phone',
    sharedPlanSummary: Boolean(sharedPlanSummary),
    timestamp: new Date().toISOString(),
    status: 'PENDING',
    assignedTo: 'Government & College Welfare Cell',
  };

  supportTickets.unshift(newTicket);
  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    action: 'HUMAN_SUPPORT_ESCALATED',
    category: 'ESCALATION',
    details: `Created escalation ticket ${ticketId} via ${contactMethod}. Plan shared: ${sharedPlanSummary}`,
    status: 'SUCCESS',
  });

  res.json({
    success: true,
    ticket: newTicket,
    message: 'Your human support request has been logged successfully.',
  });
});

// API: AssistFill Application Submission
app.post('/api/assist-fill/submit', (req, res) => {
  const {
    serviceId,
    serviceName,
    draftCreationConsent,
    reviewConfirmed,
    submissionConsent,
    requiredDocumentsComplete,
    requiredFieldsComplete,
    applicationDeadlineOpen,
    applicantData,
    documentList,
  } = req.body;

  // Strict Evaluation of Boolean Conditions as specified in hackathon brief
  const isEligibleToSubmit =
    draftCreationConsent === true &&
    reviewConfirmed === true &&
    submissionConsent === true &&
    requiredDocumentsComplete === true &&
    requiredFieldsComplete === true &&
    applicationDeadlineOpen === true;

  if (!isEligibleToSubmit) {
    return res.status(400).json({
      success: false,
      error: 'Complete all required fields, documents, and consent steps before submitting.',
      validationErrors: {
        draftCreationConsent,
        reviewConfirmed,
        submissionConsent,
        requiredDocumentsComplete,
        requiredFieldsComplete,
        applicationDeadlineOpen,
      },
    });
  }

  const applicationId = `NIR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const consentRecordId = `CSR-${Date.now().toString().slice(-6)}`;

  // Log in consent audit trail (zero sensitive data saved)
  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    action: 'APPLICATION_SUBMITTED_WITH_CONSENT',
    category: 'APPLICATION',
    details: `Application ${applicationId} submitted to ${serviceName} with consent receipt ${consentRecordId}.`,
    serviceId,
    dataCategoriesShared: [
      'Enrolment status & institution',
      'Course & year of study',
      'Income eligibility bracket',
      'Compulsory bonafide and marks verification',
    ],
    status: 'SUCCESS',
  });

  return res.json({
    success: true,
    applicationId,
    consentRecordId,
    serviceName,
    status: 'SUBMITTED',
    timestamp: new Date().toISOString(),
    documentsAttachedCount: Array.isArray(documentList) ? documentList.length : 3,
    nextExpectedUpdate: 'Within 7–10 working days by the issuing authority',
    authorityDisclaimer: 'Application status after submission is controlled by the official authority. NIRVAHA AI cannot guarantee approval.',
  });
});

// In-memory Projects and Documentation Updates Database
import { initialProjects, initialDocUpdates, defaultStatusSummary, defaultDocSummary } from './src/data/projectStatusData.ts';

let liveProjects = [...initialProjects];
let liveDocUpdates = [...initialDocUpdates];

// API: Get all tracked projects / welfare applications
app.get('/api/projects', (_req, res) => {
  res.json({ success: true, projects: liveProjects });
});

// API: Toggle milestone for a project
app.post('/api/projects/milestone/toggle', (req, res) => {
  const { projectId, milestoneId } = req.body;
  const project = liveProjects.find((p) => p.id === projectId);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  const milestone = project.milestones.find((m) => m.id === milestoneId);
  if (milestone) {
    milestone.completed = !milestone.completed;
    if (milestone.completed && !milestone.date) {
      milestone.date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }

  // Recalculate progress percent
  const total = project.milestones.length;
  const completed = project.milestones.filter((m) => m.completed).length;
  project.progressPercent = Math.round((completed / total) * 100);
  project.lastUpdate = new Date().toISOString();

  if (project.progressPercent === 100) {
    project.status = 'disbursed';
    project.statusLabel = 'Completed & Disbursed';
  } else if (project.progressPercent > 50) {
    project.status = 'under_review';
    project.statusLabel = `In Progress (${completed}/${total} steps)`;
  }

  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    action: 'PROJECT_MILESTONE_UPDATED',
    category: 'APPLICATION',
    details: `Updated milestone "${milestone?.label}" for ${project.title} (${project.code}). Progress now ${project.progressPercent}%.`,
    serviceId: project.serviceId,
    status: 'SUCCESS',
  });

  return res.json({ success: true, project });
});

// API: Add new tracked project
app.post('/api/projects', (req, res) => {
  const newProject = req.body;
  if (!newProject.id) {
    newProject.id = `proj-${Date.now()}`;
  }
  liveProjects.unshift(newProject);
  return res.json({ success: true, project: newProject });
});

// API: Get documentation updates and gazettes
app.get('/api/documentation/updates', (_req, res) => {
  res.json({ success: true, docUpdates: liveDocUpdates });
});

// API: Gemini Summarizer for Project Status
app.post('/api/gemini/summarize-status', async (req, res) => {
  const { language = 'en', customProjects } = req.body;
  const projectsToSummarize = customProjects && customProjects.length > 0 ? customProjects : liveProjects;

  const langNames: Record<string, string> = {
    kn: 'Kannada (ಕನ್ನಡ)',
    hi: 'Hindi (हिन्दी)',
    en: 'English',
  };
  const targetLanguage = langNames[language] || 'English';

  if (ai) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    const prompt = `
You are the NIRVAHA AI Mobile Project Status Summarizer for Indian citizens and welfare beneficiaries.
Analyze the following active public-service welfare cases and projects:
${JSON.stringify(projectsToSummarize, null, 2)}

Provide an executive, concise status summary strictly in ${targetLanguage}.
Respond ONLY with a valid JSON object matching this schema:
{
  "healthScore": <integer between 50 and 95 based on urgency, deadlines and blockers>,
  "healthStatus": "<'On Track' | 'Attention Needed' | 'Critical Risk'>",
  "summaryText": "<empowering, clear, 2-3 sentence executive synthesis of all projects, total benefit value, and status in ${targetLanguage}>",
  "keyHighlights": [
    "<3-5 bullet points highlighting progress, upcoming milestones, and key relief values>"
  ],
  "criticalDeadlines": [
    { "title": "<Project or step title>", "daysLeft": <number>, "actionNeeded": "<Specific action required>" }
  ],
  "recommendedActions": [
    "<Top 3 concrete citizen actions in priority order>"
  ]
}
`;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        if (response.text && response.text.trim()) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({
            success: true,
            summary: {
              ...parsed,
              generatedAt: new Date().toISOString(),
              sourceModel: model,
            },
          });
        }
      } catch (err: any) {
        console.info(`Gemini status summary on model ${model} failed, checking next model.`, err?.message);
      }
    }
  }

  // Deterministic Fallback if Gemini is unavailable
  const urgentCount = projectsToSummarize.filter((p: any) => p.urgency === 'critical' || p.daysRemaining <= 4).length;
  const healthScore = urgentCount > 0 ? 82 : 94;
  const healthStatus = urgentCount > 0 ? 'Attention Needed' : 'On Track';

  return res.json({
    success: true,
    summary: {
      ...defaultStatusSummary,
      healthScore,
      healthStatus,
      generatedAt: new Date().toISOString(),
      sourceModel: 'nirvaha-deterministic-engine',
    },
  });
});

// API: Gemini Summarizer for Documentation Updates
app.post('/api/gemini/summarize-docs', async (req, res) => {
  const { language = 'en', customDocUpdates } = req.body;
  const docUpdatesToSummarize = customDocUpdates && customDocUpdates.length > 0 ? customDocUpdates : liveDocUpdates;

  const langNames: Record<string, string> = {
    kn: 'Kannada (ಕನ್ನಡ)',
    hi: 'Hindi (हिन्दी)',
    en: 'English',
  };
  const targetLanguage = langNames[language] || 'English';

  if (ai) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
    const prompt = `
You are the NIRVAHA AI Mobile Documentation Intelligence Agent.
Analyze the following official gazette updates, circulars, and citizen certificate validity records:
${JSON.stringify(docUpdatesToSummarize, null, 2)}

Provide an executive documentation update digest strictly in ${targetLanguage}.
Respond ONLY with a valid JSON object matching this schema:
{
  "complianceScore": <integer 75 to 98>,
  "summaryText": "<clear, actionable 2-3 sentence summary of new gazette rules and certificate expiration risks in ${targetLanguage}>",
  "criticalActionItems": [
    "<3 high-priority documentation actions for the citizen>"
  ],
  "gazetteHighlights": [
    "<2-4 official government rule amendments and relaxations>"
  ],
  "expiringDocuments": [
    { "name": "<Document Name>", "daysLeft": <number of days remaining>, "renewalPortal": "<Authority or Portal Name>" }
  ]
}
`;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        if (response.text && response.text.trim()) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({
            success: true,
            summary: {
              ...parsed,
              generatedAt: new Date().toISOString(),
              sourceModel: model,
            },
          });
        }
      } catch (err: any) {
        console.info(`Gemini doc summary on model ${model} failed, checking next model.`, err?.message);
      }
    }
  }

  // Deterministic Fallback
  return res.json({
    success: true,
    summary: {
      ...defaultDocSummary,
      generatedAt: new Date().toISOString(),
      sourceModel: 'nirvaha-deterministic-engine',
    },
  });
});

// API: Revoke consent
app.post('/api/consent/revoke', (req, res) => {
  const { consentRecordId, serviceName } = req.body;
  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    action: 'CONSENT_REVOKED_BY_USER',
    category: 'REVOCATION',
    details: `User explicitly revoked authorization for ${serviceName || 'service'} (ID: ${consentRecordId}).`,
    status: 'REVOKED',
  });
  res.json({ success: true, message: 'Authorization revoked successfully.' });
});

// API: Gemini-Powered Agent Consultation
app.post('/api/gemini/chat', async (req, res) => {
  const { message, language = 'en', lifeEvent, context } = req.body;

  const langNames: Record<string, string> = {
    kn: 'Kannada (ಕನ್ನಡ)',
    hi: 'Hindi (हिन्दी)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    ml: 'Malayalam (മലയാളം)',
    mr: 'Marathi (मराठी)',
    bn: 'Bengali (বাংলা)',
    en: 'English',
  };
  const targetLanguagePrompt = langNames[language] || 'English';

  const systemInstruction = `
You are NIRVAHA AI, a trusted, calm, empathetic, and consent-first public-service navigation agent for India.
Core Tagline: "From life event to the right action."
Language: Respond strictly in ${targetLanguagePrompt} with clean, simple, natural, empathetic phrasing.

CRITICAL INSTRUCTIONS FOR CITIZEN SEARCH QUERIES:
The user can be a Farmer, Student, Worker, Senior Citizen, Person with Disability, or general citizen searching for ANY government scheme, subsidy, certificate, or benefit.
Always give exact, factual, grounded information:
1. State the official scheme/service name and administering department.
2. Provide the official government portal URL.
3. State the financial benefit amount or entitlement.
4. List the exact eligibility criteria and income ceilings.
5. Provide a clear checklist of required documents (e.g., Aadhaar, RTC/Pahani, Bonafide, e-Shram, UDID).
6. Give the time window, deadline, or helpline numbers (e.g., 72 hours for PMFBY crop loss, 1902 Seva Sindhu helpline, 14447 PMFBY helpline).

Key Grounded Indian & Karnataka Portals to cite:
- Farmers & Agriculture:
  * PM-Kisan Samman Nidhi (pmkisan.gov.in): ₹6,000/year in 3 instalments of ₹2,000 via DBT. Requires Aadhaar e-KYC and land seeding.
  * PM Fasal Bima Yojana (pmfby.gov.in / Samrakshane): Critical 72-hour crop loss intimation for localized floods/rain. Requires RTC/Pahani, crop survey number, and geotagged field photos. Helpline: 14447.
  * Bhoomi Karnataka Land Records (bhoomi.karnataka.gov.in): View RTC / Pahani, Mutation register, and Khata extract.
  * Raitha Siri: ₹10,000/hectare direct assistance for millet cultivation in Karnataka.
- Students & Education:
  * Karnataka SSP Post-Matric (ssp.postmatric.karnataka.gov.in): Up to ₹45,000/yr tuition fee reimbursement and maintenance allowance for SC/ST/OBC/EWS students.
  * National Scholarship Portal PM-USP (scholarships.gov.in): ₹12,000/yr for graduation, ₹20,000/yr for post-graduation (merit above 80th percentile).
  * AICTE Pragati & Saksham (aicte-india.org): ₹50,000/year for meritorious girl students and differently-abled students in technical courses.
  * Karnataka Labour Welfare Board Educational Assistance (klwbapps.karnataka.gov.in): ₹15,000 - ₹25,000/yr for children of registered workers.
- Workers & Labour:
  * e-Shram National Database of Unorganised Workers (eshram.gov.in): 12-digit UAN, ₹2 Lakh accidental death cover, social security integration.
  * Karnataka Building and Other Construction Workers Welfare Board (karunadu.karnataka.gov.in/bocw): Marriage aid (₹50,000), toolkits, transit hostels, and pension.
  * PM Shram Yogi Maan-dhan (PM-SYM): Monthly pension of ₹3,000 after age 60 for unorganized workers with income ≤ ₹15,000.
- Senior Citizens & Elders:
  * Sandhya Suraksha Scheme (nadakacheri.karnataka.gov.in): ₹1,200/month DBT pension for Karnataka residents aged 65+ with household income ≤ ₹20,000/yr.
  * Indira Gandhi National Old Age Pension Scheme (IGNOAPS / nsap.nic.in): Monthly pension for BPL senior citizens aged 60+.
  * KSRTC Senior Citizen Bus Concession Pass (ksrtc.in): 25% to 50% bus fare concession on producing senior ID or Aadhaar.
- Persons with Disabilities (Divyangjan):
  * Unique Disability ID (UDID: swavlambancard.gov.in): Digital identity card for disability ≥ 40%, enables free public bus travel, exam scribe concessions, and railway discounts.
  * Monthly Disability Pension Scheme: ₹1,400 to ₹2,000/month DBT for citizens with benchmark disability.
  * ADIP Scheme: Free distribution of assistive aids (motorized tricycles, hearing aids, wheelchairs).
- Civic, Certificates & Food:
  * Karnataka Nadakacheri Atalji Janasnehi Kendra (nadakacheri.karnataka.gov.in): Online application for Caste & Income Certificates with RD Number valid for 5 years.
  * Ahara Karnataka (ahara.kar.nic.in): BPL/APL/Anthyodaya Ration Card issuance and monthly Anna Bhagya food grain entitlements.
  * Seva Sindhu (sevasindhu.karnataka.gov.in): Single window for 800+ government services.

Safety Rules:
- Never ask for passwords, bank PINs, OTPs, or CVVs.
- Distinguish clearly between "Verified Information" and "Needs Official Verification".
`;

  // 1. Try Gemini models in priority order
  if (ai) {
    const candidateModels = ['gemini-3.8-flash'];

    // Construct conversation history for Gemini multi-turn dialogue
    const rawContents: any[] = [];
    if (Array.isArray(req.body.history) && req.body.history.length > 0) {
      for (const item of req.body.history.slice(-6)) {
        rawContents.push({
          role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.content || item.text || '' }],
        });
      }
    }

    // Must start with user role and drop leading model turns
    while (rawContents.length > 0 && rawContents[0].role !== 'user') {
      rawContents.shift();
    }

    const userPrompt = `Citizen Query: "${message}". Context: Life Event="${lifeEvent || 'Public service support'}". User Profile: ${JSON.stringify(context?.userProfile || {})}.`;
    rawContents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    // Merge consecutive identical roles to guarantee strict alternating turn structure
    const contents: any[] = [];
    for (const item of rawContents) {
      const prev = contents[contents.length - 1];
      if (prev && prev.role === item.role) {
        prev.parts[0].text += `\n${item.parts[0].text}`;
      } else {
        contents.push(item);
      }
    }

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.35,
          },
        });

        if (response.text && response.text.trim()) {
          return res.json({
            success: true,
            reply: response.text.trim(),
            source: model,
          });
        }
      } catch (err: any) {
        console.info(`Gemini model ${model} temporarily unavailable, continuing to next model candidate.`);
      }
    }
  }

  // 2. Try OpenAI Chat Bot if OPENAI_API_KEY is configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const openAiMessages: any[] = [
        { role: 'system', content: systemInstruction },
      ];

      if (Array.isArray(req.body.history) && req.body.history.length > 0) {
        for (const item of req.body.history.slice(-6)) {
          openAiMessages.push({
            role: item.role === 'model' ? 'assistant' : (item.role || 'user'),
            content: item.content || item.text || '',
          });
        }
      }

      openAiMessages.push({
        role: 'user',
        content: `Citizen Query: "${message}". Context: Life Event="${lifeEvent || 'Public service support'}". User Profile: ${JSON.stringify(context?.userProfile || {})}.`,
      });

      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: openAiMessages,
          temperature: 0.35,
        }),
      });

      if (openAiRes.ok) {
        const openAiData = await openAiRes.json();
        const reply = openAiData.choices?.[0]?.message?.content;
        if (reply && reply.trim()) {
          return res.json({
            success: true,
            reply: reply.trim(),
            source: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          });
        }
      }
    } catch (openAiErr: any) {
      console.warn('OpenAI request error:', openAiErr?.message);
    }
  }

  // 3. Grounded Multi-Category Semantic Search Deterministic Engine
  const q = (message || '').toLowerCase();
  const isKn = language === 'kn';
  let groundedReply = '';

  // FARMER / AGRICULTURE SEARCH
  if (/crop|rain|pmfby|fasal|kisan|bhoomi|rtc|pahani|farm|agri|ಬೆಳೆ|ಮಳೆ|ರೈತ|ಕೃಷಿ|ಪಹಣಿ/i.test(q)) {
    if (isKn) {
      groundedReply = `🌾 **ರೈತ ಕಲ್ಯಾಣ ಹಾಗೂ ಬೆಳೆ ರಕ್ಷಣೆ ಮಾಹಿತಿ (Verified Information)**:

1. **ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY / ಸಂರಕ್ಷಣೆ ಪೋರ್ಟಲ್ - pmfby.gov.in)**:
   - ಅತಿವೃಷ್ಟಿ ಅಥವಾ ಮಳೆ ಹಾನಿಯಾದಾಗ **೭೨ ಗಂಟೆಗಳ ಒಳಗೆ (72 Hours)** ಬೆಳೆ ಹಾನಿಯನ್ನು ವರದಿ ಮಾಡುವುದು ಕಡ್ಡಾಯ.
   - ಅಗತ್ಯ ದಾಖಲೆಗಳು: ಆರ್‌ಟಿಸಿ (RTC / ಪಹಣಿ), ಜಮೀನಿನ ಸರ್ವೆ ನಂಬರ್, ವಿಮಾ ಪಾಲಿಸಿ ರಶೀದಿ ಮತ್ತು ನೀರು ನಿಂತ ಜಮೀನಿನ ಫೋಟೋ. ಸಹಾಯವಾಣಿ: **14447**.

2. **ಪಿಎಂ-ಕಿಸಾನ್ & ರೈತ ಸಿರಿ (pmkisan.gov.in)**:
   - ವಾರ್ಷಿಕ ₹೬,೦೦೦ (ಮೂರು ಕಂತುಗಳಲ್ಲಿ ₹೨,೦೦೦) ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT).
   - ಅಗತ್ಯವಿರುವ ಕ್ರಮ: ಆಧಾರ್ ಇ-ಕೆವೈಸಿ (e-KYC) ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೀನು ದಾಖಲೆ ಜೋಡಣೆ.

3. **ಭೂಮಿ ಆರ್‌ಟಿಸಿ / ಪಹಣಿ (bhoomi.karnataka.gov.in)**:
   - ನಿಮ್ಮ ತಾಲ್ಲೂಕು, ಹೋಬಳಿ, ಗ್ರಾಮ ಮತ್ತು ಸರ್ವೆ ನಂಬರ್ ನಮೂದಿಸಿ ಅಧಿಕೃತ ಆರ್‌ಟಿಸಿಯನ್ನು ತಕ್ಷಣ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು.`;
    } else {
      groundedReply = `🌾 **Farmer Welfare & Crop Relief Information (Verified Information)**:

1. **PM Fasal Bima Yojana (PMFBY - pmfby.gov.in / Samrakshane)**:
   - In case of localized crop damage or heavy rain flooding, it is mandatory to lodge intimation **within 72 hours**.
   - Required Documents: Land Survey RTC / Pahani, crop insurance policy acknowledgment, and geotagged submergence photographs. Helpline: **14447**.

2. **PM-Kisan Samman Nidhi & Raitha Siri (pmkisan.gov.in)**:
   - ₹6,000/year credited directly in three equal instalments of ₹2,000 via DBT.
   - Requirements: Aadhaar e-KYC verification and landholding survey number seeding.

3. **Bhoomi RTC / Pahani Portal (bhoomi.karnataka.gov.in)**:
   - Instant access to official digital RTC extracts, mutation records, and survey maps required for all agricultural compensation claims.`;
    }
  }

  // SCHOLARSHIPS / STUDENTS SEARCH
  else if (/scholarship|college|fee|student|ssp|nsp|pragati|saksham|bonafide|ವಿದ್ಯಾರ್ಥಿವೇತನ|ಶುಲ್ಕ|ಕಾಲೇಜು|ಬೋನಫೈಡ್/i.test(q)) {
    if (isKn) {
      groundedReply = `🎓 **ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಕಾಲೇಜು ಶುಲ್ಕ ಬೆಂಬಲ (Verified Information)**:

1. **ಕರ್ನಾಟಕ ಎಸ್.ಎಸ್.ಪಿ ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ (ssp.postmatric.karnataka.gov.in)**:
   - ಡಿಪ್ಲೊಮಾ, ಪದವಿ, ಎಂಜಿನಿಯರಿಂಗ್ ಹಾಗೂ ಸ್ನಾತಕೋತ್ತರ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ₹೪೫,೦೦೦ ವರೆಗೆ ಪೂರ್ಣ ಬೋಧನಾ ಶುಲ್ಕ ಮರುಪಾವತಿ ಹಾಗೂ ಮಾಸಿಕ ನಿರ್ವಹಣಾ ಭತ್ಯೆ.
   - ಅರ್ಹತೆ: ಮಾನ್ಯತೆ ಪಡೆದ ಕಾಲೇಜಿನಲ್ಲಿ ದಾಖಲಾತಿ, ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಬೋನಫೈಡ್ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (SC/ST ≤ ₹೨.೫ ಲಕ್ಷ, OBC/EWS ≤ ₹೧.೫ ಲಕ್ಷ).

2. **ರಾಷ್ಟ್ರೀಯ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಪೋರ್ಟಲ್ PM-USP (scholarships.gov.in)**:
   - 12ನೇ ತರಗತಿಯಲ್ಲಿ ಶೇಕಡಾ 80 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಅಂಕ ಗಳಿಸಿದ ಪದವಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಾರ್ಷಿಕ ₹೧೨,೦೦೦ ನೇರ ನೆರವು.

3. **ಕಾಲೇಜು ತುರ್ತು ಪರಿಹಾರ ನಿಧಿ (Institutional Relief)**:
   - ಸರ್ಕಾರಿ ವಿದ್ಯಾರ್ಥಿವೇತನ ಬರುವವರೆಗೆ ಶುಲ್ಕ ಮುಂದೂಡಿಕೆ (Fee Deferral) ಅಥವಾ ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿ ಕಲ್ಯಾಣ ವಿಭಾಗದಿಂದ ತಾತ್ಕಾಲಿಕ ಪರಿಹಾರ ಪಡೆಯಬಹುದು.`;
    } else {
      groundedReply = `🎓 **Scholarships & College Fee Assistance (Verified Information)**:

1. **Karnataka SSP Post-Matric Scholarship (ssp.postmatric.karnataka.gov.in)**:
   - Up to ₹45,000/year complete tuition reimbursement and maintenance allowances for technical and degree students.
   - Requirements: Valid College Bonafide Certificate for 2026-27, Revenue Dept Income RD Number (SC/ST ≤ ₹2.5 Lakh, OBC/EWS ≤ ₹1.5 Lakh), and previous marks card.

2. **Central Sector PM-USP Scheme (scholarships.gov.in)**:
   - ₹12,000/year for undergraduate degrees for students above 80th percentile in Class 12 board exams with family income ≤ ₹4.5 Lakh.

3. **AICTE Pragati & Saksham Schemes (aicte-india.org)**:
   - ₹50,000/year for meritorious girl students and differently-abled students pursuing AICTE technical diplomas and degrees.`;
    }
  }

  // SENIOR CITIZENS / PENSIONS SEARCH
  else if (/pension|senior|old age|elder|sandhya|agnoaps|ಪಿಂಚಣಿ|ಹಿರಿಯ|ವೃದ್ಧಾಪ್ಯ|ಸಂಧ್ಯಾ/i.test(q)) {
    if (isKn) {
      groundedReply = `🧓 **ಹಿರಿಯ ನಾಗರಿಕರ ಪಿಂಚಣಿ ಮತ್ತು ಕ್ಷೇಮಾಭಿವೃದ್ಧಿ ಯೋಜನೆಗಳು (Verified Information)**:

1. **ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ಯೋಜನೆ (Sandhya Suraksha - nadakacheri.karnataka.gov.in)**:
   - ೬೫ ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಕರ್ನಾಟಕದ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಮಾಸಿಕ **₹೧,೨೦೦ ನೇರ ಡಿಬಿಟಿ ಪಿಂಚಣಿ**.
   - ಅರ್ಹತೆ: ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ ₹೨೦,೦೦೦ ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು. ಯಾವುದೇ ವಾಣಿಜ್ಯ ಅಥವಾ ದೊಡ್ಡ ಪಿಂಚಣಿ ಪಡೆಯುತ್ತಿರಬಾರದು.
   - ಅರ್ಜಿ ಸಲ್ಲಿಕೆ: ನಾಡಕಚೇರಿ (Nadakacheri / ಅಟಲ್ ಜೀ ಜನಸ್ನೇಹಿ ಕೇಂದ್ರ) ಅಥವಾ ಸೇವಾ ಸಿಂಧು ಮೂಲಕ.

2. **ಇಂದಿರಾ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ (IGNOAPS - nsap.nic.in)**:
   - ಬಿಪಿಎಲ್ (BPL) ಕುಟುಂಬದ ೬೦ ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಹಿರಿಯರಿಗೆ ಮಾಸಿಕ ಕೇಂದ್ರ ನೆರವು.

3. **ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಉಚಿತ/ರಿಯಾಯಿತಿ ಹಿರಿಯ ನಾಗರಿಕ ಬಸ್ ಪಾಸ್ (ksrtc.in)**:
   - ವಯಸ್ಸಿನ ಪುರಾವೆ (ಆಧಾರ್ ಅಥವಾ ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ) ಹಾಜರುಪಡಿಸಿ ರಿಯಾಯಿತಿ ದರದಲ್ಲಿ ಪ್ರಯಾಣಿಸಬಹುದು.`;
    } else {
      groundedReply = `🧓 **Senior Citizen Welfare & Monthly Pension Schemes (Verified Information)**:

1. **Sandhya Suraksha Scheme (nadakacheri.karnataka.gov.in)**:
   - **₹1,200/month Direct Benefit Transfer (DBT)** pension for senior citizens of Karnataka aged 65 and above.
   - Eligibility: Annual household income must be ≤ ₹20,000 per annum, not receiving formal corporate pensions.
   - Application: Submit via Nadakacheri (Atalji Janasnehi Kendra) or Seva Sindhu with age proof, income proof, and bank passbook.

2. **Indira Gandhi National Old Age Pension Scheme (IGNOAPS - nsap.nic.in)**:
   - Monthly social security pension for citizens aged 60+ belonging to Below Poverty Line (BPL) families.

3. **KSRTC Senior Citizen Bus Travel Concessions (ksrtc.in)**:
   - Subsidized public transport concessions across Karnataka on presenting valid Senior Citizen ID or Aadhaar Card.`;
    }
  }

  // WORKERS / LABOUR SEARCH
  else if (/worker|labour|e-shram|bocw|construction|wage|unorganized|ಕಾರ್ಮಿಕ|ಶ್ರಮಿಕ|ಇ-ಶ್ರಮ್|ಕಟ್ಟಡ/i.test(q)) {
    if (isKn) {
      groundedReply = `🔨 **ಕಾರ್ಮಿಕ ಕಲ್ಯಾಣ ಹಾಗೂ ಸಾಮಾಜಿಕ ಭದ್ರತಾ ಯೋಜನೆಗಳು (Verified Information)**:

1. **ಇ-ಶ್ರಮ್ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್ (e-Shram - eshram.gov.in)**:
   - ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕರಿಗೆ ೧೨ ಅಂಕಿಯ ಯುಎಎನ್ (UAN) ಗುರುತಿನ ಚೀಟಿ ಹಾಗೂ ₹೨ ಲಕ್ಷ ಅಪಘಾತ ವಿಮಾ ರಕ್ಷಣೆ.

2. **ಕರ್ನಾಟಕ ಕಟ್ಟಡ ಮತ್ತು ಇತರೆ ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕ ಕಲ್ಯಾಣ ಮಂಡಳಿ (BOCW Board)**:
   - ನೋಂದಾಯಿತ ಕಾರ್ಮಿಕರ ಮಕ್ಕಳಿಗೆ ವಾರ್ಷಿಕ **₹೧೫,೦೦೦ ದಿಂದ ₹೨೫,೦೦೦ ಶೈಕ್ಷಣಿಕ ಧನಸಹಾಯ**.
   - ಹೆಣ್ಣು ಮಕ್ಕಳ ಮದುವೆಗೆ ₹೫೦,೦೦೦ ಆರ್ಥಿಕ ನೆರವು, ಹೆರಿಗೆ ಭತ್ಯೆ ಹಾಗೂ ಉಚಿತ ಟೂಲ್‌ಕಿಟ್ ವಿತರಣೆ.

3. **ಪ್ರಧಾನಮಂತ್ರಿ ಶ್ರಮ ಯೋಗಿ ಮಾನ-ಧನ (PM-SYM)**:
   - ೬೦ ವರ್ಷದ ನಂತರ ಪ್ರತಿ ತಿಂಗಳು **₹೩,೦೦೦ ಖಚಿತ ಪಿಂಚಣಿ** ನೀಡುವ ಯೋಜನೆ.`;
    } else {
      groundedReply = `🔨 **Labour & Unorganized Worker Welfare Schemes (Verified Information)**:

1. **e-Shram National Portal (eshram.gov.in)**:
   - Free registration providing a 12-digit Universal Account Number (UAN) and ₹2 Lakh accidental death/disability insurance cover under PMSBY.

2. **Karnataka BOCW Workers Welfare Board (karunadu.karnataka.gov.in/bocw)**:
   - **Educational assistance of ₹15,000 to ₹25,000/year** for children of registered construction workers.
   - Marriage assistance grant of ₹50,000, maternity benefits, toolkits, and pension after age 60.

3. **Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)**:
   - Assured monthly pension of ₹3,000 for unorganized workers earning ≤ ₹15,000/month upon reaching age 60.`;
    }
  }

  // DISABILITY / UDID SEARCH
  else if (/disability|udid|divyang|handicap|wheelchair|ವಿಕಲಚೇತನ|ವಿಶೇಷ ಚೇತನ|ಯುಡಿಐಡಿ/i.test(q)) {
    if (isKn) {
      groundedReply = `♿ **ವಿಶೇಷ ಚೇತನರ (ದಿವ್ಯಾಂಗಜನ್) ಸೌಲಭ್ಯಗಳು (Verified Information)**:

1. **ಯುಡಿಐಡಿ ಕಾರ್ಡ್ (Unique Disability ID - swavlambancard.gov.in)**:
   - ಕನಿಷ್ಠ ೪೦% ವಿಕಲತೆ ಹೊಂದಿರುವವರಿಗೆ ಏಕೈಕ ಡಿಜಿಟಲ್ ಗುರುತಿನ ಚೀಟಿ.
   - ಸೌಲಭ್ಯಗಳು: ಉಚಿತ ಸರ್ಕಾರಿ ಬಸ್ ಪಾಸ್, ರೈಲ್ವೆ ರಿಯಾಯಿತಿ, ಕಾಲೇಜು ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಸ್ಕ್ರೈಬ್ (Scribe) ಹಾಗೂ ಹೆಚ್ಚುವರಿ ಸಮಯ.

2. **ಮಾಸಿಕ ದಿವ್ಯಾಂಗ ಪಿಂಚಣಿ (Disability Pension)**:
   - ತೀವ್ರ ವಿಕಲತೆ ಹೊಂದಿರುವವರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹೧,೪೦೦ ರಿಂದ ₹೨,೦೦೦ ವರೆಗೆ ನೇರ ಡಿಬಿಟಿ ನೆರವು.

3. **ಎಐಸಿಟಿಇ ಸಕ್ಷಮ ವಿದ್ಯಾರ್ಥಿವೇತನ (AICTE Saksham - aicte-india.org)**:
   - ತಾಂತ್ರಿಕ ಕಾಲೇಜುಗಳಲ್ಲಿ ವ್ಯಾಸಂಗ ಮಾಡುವ ವಿಕಲಚೇತನ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಾರ್ಷಿಕ ₹೫೦,೦೦೦ ಅನುದಾನ.`;
    } else {
      groundedReply = `♿ **Persons with Disabilities (Divyangjan) Welfare (Verified Information)**:

1. **Unique Disability ID (UDID - swavlambancard.gov.in)**:
   - Nationwide single digital card for individuals with benchmark disability (≥ 40%).
   - Entitlements: Free KSRTC bus travel, railway concession certificates, academic exam scribe accommodations, and 5% reservation in higher education.

2. **Monthly Disability Pension Scheme**:
   - Monthly DBT assistance of ₹1,400 to ₹2,000 for verified benchmark disability holders.

3. **ADIP Scheme & Assistive Equipment**:
   - Free distribution of motorized tricycles, braille kits, digital hearing aids, and orthotic prosthetics at district civil hospitals.`;
    }
  }

  // RATION CARD / FOOD SUPPLIES SEARCH
  else if (/ration|bpl|apl|food|ahara|ಪಡಿತರ|ರೇಷನ್|ಬಿಪಿಎಲ್/i.test(q)) {
    if (isKn) {
      groundedReply = `🍚 **ಪಡಿತರ ಚೀಟಿ ಮತ್ತು ಆಹಾರ ನಾಗರಿಕ ಸರಬರಾಜು (Verified Information)**:

1. **ಕರ್ನಾಟಕ ಆಹಾರ ಇಲಾಖೆ (Ahara Portal - ahara.kar.nic.in)**:
   - ಬಿಪಿಎಲ್ (BPL), ಎಪಿಎಲ್ (APL) ಮತ್ತು ಅಂತ್ಯೋದಯ ಪಡಿತರ ಚೀಟಿಗಳ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಹಾಗೂ ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ.
   - ಪಡಿತರ ಅಂಗಡಿ (Fair Price Shop) ವರ್ಗಾವಣೆ ಹಾಗೂ ಕುಟುಂಬದ ಸದಸ್ಯರ ಹೆಸರು ಸೇರ್ಪಡೆ/ತೆಗೆದುಹಾಕುವಿಕೆ.

2. **ಅನ್ನಭಾಗ್ಯ ಮತ್ತು ಡಿಬಿಟಿ (Anna Bhagya DBT)**:
   - ಬಿಪಿಎಲ್ ಕಾರ್ಡ್‌ದಾರರಿಗೆ ಉಚಿತ ಅಕ್ಕಿ ಹಾಗೂ ಹೆಚ್ಚುವರಿ ಧಾನ್ಯದ ಬದಲಿಗೆ ನೇರ ನಗದು ವರ್ಗಾವಣೆ (Aadhaar DBT).`;
    } else {
      groundedReply = `🍚 **Ration Card & Food Civil Supplies (Verified Information)**:

1. **Ahara Karnataka Portal (ahara.kar.nic.in)**:
   - Official portal for BPL, APL, and Anthyodaya Anna Yojana (AAY) ration card applications, e-KYC status, and family member demographic updates.
   - Fair price shop allocation and portability under One Nation One Ration Card (ONORC).

2. **Anna Bhagya DBT Entitlements**:
   - Subsidized food grains and Direct Benefit Transfer for entitled family members linked with active Aadhaar-seeded bank accounts.`;
    }
  }

  // CASTE & INCOME CERTIFICATES SEARCH
  else if (/certificate|income|caste|rd number|nadakacheri|revenue|ಆದಾಯ|ಜಾತಿ|ಪ್ರಮಾಣಪತ್ರ|ನಾಡಕಚೇರಿ/i.test(q)) {
    if (isKn) {
      groundedReply = `📄 **ಆದಾಯ ಹಾಗೂ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರಗಳು (Verified Information)**:

1. **ನಾಡಕಚೇರಿ ಅಟಲ್ ಜೀ ಜನಸ್ನೇಹಿ ಕೇಂದ್ರ (nadakacheri.karnataka.gov.in)**:
   - ಕಂದಾಯ ಇಲಾಖೆಯಿಂದ ಅಧಿಕೃತ **ಆರ್.ಡಿ (RD) ಸಂಖ್ಯೆ** ಹೊಂದಿರುವ ಆದಾಯ ಮತ್ತು ಜಾತಿ ಪ್ರಮಾಣಪತ್ರಗಳ ವಿತರಣೆ.
   - ಸಿಂಧುತ್ವ: ಒಮ್ಮೆ ಪಡೆದ ಪ್ರಮಾಣಪತ್ರವು ನಿಯಮಾನುಸಾರ ೫ ವರ್ಷಗಳವರೆಗೆ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ.
   - ಸಕಾಲ (Sakala) ಕಾಯ್ದೆಯಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ ೭ ರಿಂದ ೧೪ ದಿನಗಳಲ್ಲಿ ಪ್ರಮಾಣಪತ್ರ ವಿತರಣೆ ಕಡ್ಡಾಯ.`;
    } else {
      groundedReply = `📄 **Caste & Income Certificates Verification (Verified Information)**:

1. **Nadakacheri Atalji Janasnehi Kendra (nadakacheri.karnataka.gov.in)**:
   - Official Karnataka Revenue Department portal issuing digitally signed Caste & Income Certificates with verifiable **RD Numbers**.
   - Validity: Once issued, the certificate is legally valid for up to 5 years for educational admissions and scholarships.
   - Timelines: Guaranteed delivery within 7 to 14 days under the Karnataka Sakala Services Act.`;
    }
  }

  // PROJECT STATUS / TRACKING SEARCH
  else if (/status|track|case|application|project|milestone|ಸ್ಥಿತಿ|ಟ್ರ್ಯಾಕ್|ಅರ್ಜಿ/i.test(q)) {
    if (isKn) {
      groundedReply = `📊 **ಯೋಜನೆಗಳ ಸ್ಥಿತಿ ಮತ್ತು ಅರ್ಜಿ ಪರಿಶೀಲನೆ (Verified Information)**:

- ನಿಮ್ಮ ಅರ್ಜಿಗಳ ಹಂತ, ಪರಿಶೀಲನೆ ಹಾಗೂ ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಪ್ರಗತಿಯನ್ನು **ಯೋಜನೆಗಳ ಸ್ಥಿತಿ (Project Status)** ಟ್ಯಾಬ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಬಹುದು.
- ನೀವು ಹೊಸ ಅರ್ಜಿಯ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು (Reference Code) ದಾಖಲಿಸಿ ಅದರ ೪ ಹಂತಗಳ ಪರಿಶೀಲನೆಯನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು.`;
    } else {
      groundedReply = `📊 **Live Project Status & Application Tracking (Verified Information)**:

- Track all your submitted welfare cases, department milestones, and Direct Benefit Transfer credits directly on the **Project Status** tab.
- Each case provides real-time progress indicators (Draft Lodged → Attestation → Department Scrutiny → DBT Disbursal) with critical deadline alerts.`;
    }
  }

  // GENERAL SEARCH FALLBACK
  else {
    if (isKn) {
      groundedReply = `ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. 
ನೀವು ಬೆಳೆ ಪರಿಹಾರ (PMFBY), ರೈತ ಸಹಾಯಧನ (PM-Kisan), ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP), ಕಾರ್ಮಿಕ ಕಾರ್ಡ್ (e-Shram / BOCW), ಹಿರಿಯ ನಾಗರಿಕರ ಪಿಂಚಣಿ (ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ), ದಿವ್ಯಾಂಗ ಸೌಲಭ್ಯ (UDID) ಅಥವಾ ಪಡಿತರ ಚೀಟಿ ಕುರಿತು ಹುಡುಕಬಹುದು. 
ನಿಮಗೆ ಯಾವ ಯೋಜನೆ ಅಥವಾ ದಾಖಲೆಯ ವಿವರ ಬೇಕು ಎಂದು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ.`;
    } else {
      groundedReply = `Hello. I am here to guide you with verified public service information.
You can search for crop loss compensation (PMFBY), farmer income support (PM-Kisan), scholarships (Karnataka SSP / NSP), labour welfare (e-Shram / BOCW), senior citizen pensions (Sandhya Suraksha), disability ID (UDID), or ration cards (Ahara).
Please tell me the specific scheme, certificate, or situation you would like information on.`;
    }
  }

  return res.json({
    success: true,
    reply: groundedReply,
    source: 'nirvaha-deterministic-grounded-engine',
  });
});

// Start dev or production server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NIRVAHA AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
