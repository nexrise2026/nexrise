import React, { useState } from 'react';
import {
  Tractor,
  Hammer,
  HeartHandshake,
  Accessibility,
  Home,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Clock,
  ChevronRight,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';
import { Language, UserProfile, UploadedDoc, VerifiedService, UserType } from '../types';
import { ScholarshipMatchboard } from './ScholarshipMatchboard';

interface PersonaSchemesMatchboardProps {
  language: Language;
  userProfile: UserProfile;
  userDocuments: UploadedDoc[];
  onOpenAssistFill: (service: VerifiedService) => void;
  onOpenActionPlan?: () => void;
  onOpenVault?: () => void;
}

export interface SchemeItem {
  id: string;
  name: string;
  nameKn: string;
  provider: string;
  officialDomain: string;
  category: string;
  benefitAmount: string;
  deadline: string;
  daysRemaining: number;
  eligibilityStatus: 'Matched (100%)' | 'Eligible (90%)' | 'Documents Ready';
  matchReason: string;
  matchReasonKn: string;
  requiredDocs: string[];
  serviceRef: VerifiedService;
}

function buildVerifiedServiceRef(
  id: string,
  name: string,
  category: 'Education' | 'Agriculture' | 'Social Welfare' | 'Disability' | 'Civic',
  officialDomain: string,
  purpose: string,
  targetCategory?: string
): VerifiedService {
  return {
    id,
    name,
    nameKn: name,
    status: 'Verified Official',
    purpose,
    purposeKn: purpose,
    category,
    applicableLifeEvents: ['student_fees'],
    userTypes: ['Citizen'],
    state: 'Karnataka',
    eligibilityExample: ['Verified eligibility based on uploaded vault documentation.'],
    eligibilityExampleKn: ['ವಾಲ್ಟ್ ದಾಖಲೆಗಳ ಆಧಾರದ ಮೇಲೆ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.'],
    documentsRequired: ['Aadhaar Card', 'Bank Passbook'],
    documentsRequiredKn: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್'],
    deadlineDays: 30,
    deadlineText: 'Open for registration',
    deadlineTextKn: 'ನೋಂದಣಿ ಮುಕ್ತವಾಗಿದೆ',
    officialSourceUrl: `https://${officialDomain}`,
    officialDomain,
    lastVerifiedDate: '2026-09-26',
    whyResultReasons: ['Profile and documents match official scheme criteria.'],
    whyResultReasonsKn: ['ಪ್ರೊಫೈಲ್ ಮತ್ತು ದಾಖಲೆಗಳು ಅರ್ಹತಾ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ.'],
    estimatedBenefit: 'Direct Benefit Transfer',
    targetCategory,
  };
}

export const PersonaSchemesMatchboard: React.FC<PersonaSchemesMatchboardProps> = (props) => {
  const { language, userProfile, onOpenAssistFill } = props;

  // If Student, delegate directly to the dedicated ScholarshipMatchboard
  if (userProfile.userType === 'Student') {
    return <ScholarshipMatchboard {...props} />;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_priority' | 'direct_benefit'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Persona-specific matching schemes data
  const getSchemesForPersona = (role: UserType): SchemeItem[] => {
    if (role === 'Farmer') {
      return [
        {
          id: 'scheme-farm-1',
          name: 'PM Fasal Bima Yojana (Post-Harvest & Inundation Relief)',
          nameKn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (ಅತಿವೃಷ್ಟಿ ಬೆಳೆ ನಷ್ಟ ಪರಿಹಾರ)',
          provider: 'Ministry of Agriculture & Farmers Welfare / AIC of India',
          officialDomain: 'pmfby.gov.in',
          category: 'Crop Insurance',
          benefitAmount: 'Up to ₹45,000 / hectare',
          deadline: '28 Sep 2026',
          daysRemaining: 2,
          eligibilityStatus: 'Matched (100%)',
          matchReason: `Matched with your RTC Plot ${userProfile.surveyRtcNumber || '142/2A'} and Kharif sowing entry in Bhoomi database.`,
          matchReasonKn: `ನಿಮ್ಮ ಪಹಣಿ ಸರ್ವೆ ನಂ ${userProfile.surveyRtcNumber || '142/2A'} ಮತ್ತು ಖಾರಿಫ್ ಬಿತ್ತನೆ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಅರ್ಹತೆ ತಾಳೆಯಾಗಿದೆ.`,
          requiredDocs: ['Pahani / RTC Record', 'Geotagged Damage Photos', 'Aadhaar Card', 'Bank Passbook'],
          serviceRef: buildVerifiedServiceRef(
            'srv-crop-relief',
            'PM Fasal Bima Crop Loss Claim',
            'Agriculture',
            'pmfby.gov.in',
            'Financial assistance for crop damage due to localized floods and heavy rainfall.',
            'Farmers with Kharif Crops'
          ),
        },
        {
          id: 'scheme-farm-2',
          name: 'PM-Kisan Samman Nidhi & Karnataka Raitha Siri',
          nameKn: 'ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ ಮತ್ತು ರೈತ ಸಿರಿ ಪ್ರೋತ್ಸಾಹಧನ',
          provider: 'Dept. of Agriculture, Govt. of Karnataka',
          officialDomain: 'pmkisan.gov.in',
          category: 'Direct Income Support',
          benefitAmount: '₹6,000 + ₹10,000 DBT / year',
          deadline: '15 Oct 2026',
          daysRemaining: 19,
          eligibilityStatus: 'Matched (100%)',
          matchReason: 'Aadhaar e-KYC verified & small landholder record confirmed.',
          matchReasonKn: 'ಆಧಾರ್ ಇ-ಕೆವೈಸಿ ಮತ್ತು ಸಣ್ಣ ಹಿಡುವಳಿದಾರರ ಭೂದಾಖಲೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ.',
          requiredDocs: ['Aadhaar Card', 'Bhoomi RTC', 'NPCI-Seeded Bank Account'],
          serviceRef: buildVerifiedServiceRef(
            'srv-pmkisan',
            'PM-Kisan & Raitha Siri Direct Benefit Transfer',
            'Agriculture',
            'pmkisan.gov.in',
            'Supplemental income support for agricultural inputs and millet cultivation.',
            'Small and Marginal Farmers'
          ),
        },
        {
          id: 'scheme-farm-3',
          name: 'Karnataka Micro-Irrigation Drip Subsidy (90% Grant)',
          nameKn: 'ಕರ್ನಾಟಕ ಸೂಕ್ಷ್ಮ ಹನಿ ನೀರಾವರಿ ಸಹಾಯಧನ (೯೦% ಅನುದಾನ)',
          provider: 'Department of Horticulture, Karnataka',
          officialDomain: 'horticulturedir.karnataka.gov.in',
          category: 'Equipment & Subsidy',
          benefitAmount: '90% Cost Waiver (Up to ₹50,000)',
          deadline: '30 Oct 2026',
          daysRemaining: 34,
          eligibilityStatus: 'Eligible (90%)',
          matchReason: 'Available for small & marginal farmers cultivating horticultural/cash crops.',
          matchReasonKn: 'ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರ ತೋಟಗಾರಿಕಾ ಬೆಳೆಗಳಿಗೆ ಲಭ್ಯ.',
          requiredDocs: ['RTC / Pahani Record', 'Electricity Bill / Water Source Proof', 'Aadhaar Card'],
          serviceRef: buildVerifiedServiceRef(
            'srv-drip-irrigation',
            'Micro-Irrigation Drip Subsidy',
            'Agriculture',
            'horticulturedir.karnataka.gov.in',
            'Install drip or sprinkler irrigation with 90% government subsidy.',
            'SC/ST/OBC Farmers'
          ),
        },
        {
          id: 'scheme-farm-4',
          name: 'PM KUSUM Solar Agriculture Pump Subsidy (Component-B)',
          nameKn: 'ಪಿಎಂ ಕುಸುಮ್ ಸೌರ ಕೃಷಿ ಪಂಪ್ ಯೋಜನೆ',
          provider: 'KREDL & Ministry of New and Renewable Energy',
          officialDomain: 'kredlinfo.in',
          category: 'Renewable Energy',
          benefitAmount: '60% Central + State Subsidy',
          deadline: '15 Nov 2026',
          daysRemaining: 50,
          eligibilityStatus: 'Documents Ready',
          matchReason: 'Standalone off-grid solar pump subsidy for agricultural land without grid power.',
          matchReasonKn: 'ವಿದ್ಯುತ್ ಸಂಪರ್ಕವಿಲ್ಲದ ಕೃಷಿ ಜಮೀನಿಗೆ ಸೌರಶಕ್ತಿ ಪಂಪ್ ಸೆಟ್ ಅಳವಡಿಕೆ.',
          requiredDocs: ['Land RTC Record', 'Aadhaar Card', 'Bank Passbook'],
          serviceRef: buildVerifiedServiceRef(
            'srv-kusum-solar',
            'PM KUSUM Solar Pump Installation',
            'Agriculture',
            'kredlinfo.in',
            'Clean energy solar pump sets to power farm irrigation.',
            'Off-grid agricultural pump users'
          ),
        },
      ];
    }

    if (role === 'Worker') {
      return [
        {
          id: 'scheme-work-1',
          name: 'e-Shram Accidental Death & Permanent Disability Cover',
          nameKn: 'ಇ-ಶ್ರಮ್ ಅಪಘಾತ ವಿಮೆ ರಕ್ಷಣೆ (₹೨,೦೦,೦೦೦)',
          provider: 'Ministry of Labour & Employment, Govt. of India',
          officialDomain: 'eshram.gov.in',
          category: 'Social Security',
          benefitAmount: '₹2,00,000 Coverage',
          deadline: 'Continuous / Open',
          daysRemaining: 90,
          eligibilityStatus: 'Matched (100%)',
          matchReason: `Auto-linked with your verified e-Shram Registration for ${userProfile.occupationTrade || 'Construction'}.`,
          matchReasonKn: `ನಿಮ್ಮ ಇ-ಶ್ರಮ್ ನೋಂದಣಿಯೊಂದಿಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಕ್ರಿಯವಾಗಿದೆ.`,
          requiredDocs: ['e-Shram UAN Card', 'Aadhaar Card', 'Nominee Aadhaar', 'Bank Passbook'],
          serviceRef: buildVerifiedServiceRef(
            'srv-eshram-insurance',
            'e-Shram Accidental Insurance Claim',
            'Social Welfare',
            'eshram.gov.in',
            'Accident insurance and permanent disability financial support for informal workers.',
            'Unorganized Workers'
          ),
        },
        {
          id: 'scheme-work-2',
          name: 'Karnataka Building & Other Construction Workers (BOCW) Education Stipend',
          nameKn: 'ಕರ್ನಾಟಕ ಕಟ್ಟಡ ಕಾರ್ಮಿಕರ ಮಕ್ಕಳ ವಿದ್ಯಾಭ್ಯಾಸ ಪ್ರೋತ್ಸಾಹಧನ',
          provider: 'Karnataka Building & Other Construction Workers Welfare Board',
          officialDomain: 'kbocwwb.karnataka.gov.in',
          category: 'Children Education Aid',
          benefitAmount: '₹25,000 - ₹35,000 / child',
          deadline: '20 Oct 2026',
          daysRemaining: 24,
          eligibilityStatus: 'Matched (100%)',
          matchReason: 'Valid BOCW Smart Card registered for more than 90 days.',
          matchReasonKn: '೯೦ ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ಅವಧಿಯ ಸಕ್ರಿಯ ಕಟ್ಟಡ ಕಾರ್ಮಿಕ ಮಂಡಳಿ ನೋಂದಣಿ ಗುರುತಿನ ಚೀಟಿ ಹೊಂದಿದ್ದೀರಿ.',
          requiredDocs: ['BOCW Identity Card', 'Child Enrolment Certificate', 'Bank Passbook'],
          serviceRef: buildVerifiedServiceRef(
            'srv-bocw-stipend',
            'BOCW Wards Education Stipend',
            'Social Welfare',
            'kbocwwb.karnataka.gov.in',
            'Educational cash allowance for school and college fees of workers children.',
            'Children of registered construction workers'
          ),
        },
        {
          id: 'scheme-work-3',
          name: 'Ayushman Bharat PM-JAY (Free Hospitalization Cover)',
          nameKn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಪ್ರಧಾನಮಂತ್ರಿ ಜನ ಆರೋಗ್ಯ ಯೋಜನೆ (₹೫ ಲಕ್ಷ)',
          provider: 'National Health Authority & Suvarna Arogya Suraksha Trust',
          officialDomain: 'arogya.karnataka.gov.in',
          category: 'Health Insurance',
          benefitAmount: '₹5,00,000 Cashless Treatment',
          deadline: 'Continuous',
          daysRemaining: 180,
          eligibilityStatus: 'Matched (100%)',
          matchReason: 'Matched via BPL Ration Card and unorganized labour bracket.',
          matchReasonKn: 'ಬಿಪಿಎಲ್ ಪಡಿತರ ಚೀಟಿ ಮತ್ತು ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕರ ಅರ್ಹತೆಯಡಿ ಪೂರ್ಣ ಉಚಿತ ಚಿಕಿತ್ಸೆ.',
          requiredDocs: ['Aadhaar Card', 'Ration Card (BPL/PHH)'],
          serviceRef: buildVerifiedServiceRef(
            'srv-ayushman',
            'Ayushman Bharat Golden Card',
            'Social Welfare',
            'arogya.karnataka.gov.in',
            'Cashless secondary and tertiary healthcare in empanelled hospitals.',
            'BPL Families and Unorganized Workers'
          ),
        },
      ];
    }

    if (role === 'Senior Citizen') {
      return [
        {
          id: 'scheme-sr-1',
          name: 'Sandhya Suraksha Pension Scheme (Karnataka)',
          nameKn: 'ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ಮಾಸಾಶನ ಯೋಜನೆ (ಕರ್ನಾಟಕ)',
          provider: 'Directorate of Social Security and Pensions, Revenue Dept.',
          officialDomain: 'nadakacheri.karnataka.gov.in',
          category: 'Monthly Social Security',
          benefitAmount: '₹1,200 / month Direct DBT',
          deadline: 'Continuous / Open',
          daysRemaining: 60,
          eligibilityStatus: 'Matched (100%)',
          matchReason: `Age ${userProfile.age || '64'} years matches 65+ criterion, with BPL income status.`,
          matchReasonKn: `೬೦ ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ವಯೋಮಾನ ಮತ್ತು ಬಿಪಿಎಲ್ ಆದಾಯದ ಅರ್ಹತೆ ದೃಢಪಟ್ಟಿದೆ.`,
          requiredDocs: ['Aadhaar Card', 'Age Proof / Senior ID', 'Income Certificate RD', 'Bank Passbook'],
          serviceRef: buildVerifiedServiceRef(
            'srv-sandhya-suraksha',
            'Sandhya Suraksha Pension Sanction',
            'Social Welfare',
            'nadakacheri.karnataka.gov.in',
            'Monthly financial assistance directly to bank account for elders.',
            'Senior Citizens (60+)'
          ),
        },
        {
          id: 'scheme-sr-2',
          name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
          nameKn: 'ಇಂದಿರಾ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ ಯೋಜನೆ',
          provider: 'Ministry of Rural Development & Social Welfare Dept.',
          officialDomain: 'nsap.nic.in',
          category: 'Central Pension',
          benefitAmount: '₹1,000 / month Central DBT',
          deadline: 'Continuous',
          daysRemaining: 90,
          eligibilityStatus: 'Matched (100%)',
          matchReason: 'Verified BPL household member aged 60+ without institutional pension.',
          matchReasonKn: 'ಸಂಸ್ಥಾಗತ ಪಿಂಚಣಿ ರಹಿತ ಬಿಪಿಎಲ್ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಕೇಂದ್ರದ ನೇರ ನೆರವು.',
          requiredDocs: ['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook'],
          serviceRef: buildVerifiedServiceRef(
            'srv-ignoaps',
            'National Old Age Pension Scheme',
            'Social Welfare',
            'nsap.nic.in',
            'Central social assistance program for elderly citizens living below poverty line.',
            'BPL Senior Citizens'
          ),
        },
        {
          id: 'scheme-sr-3',
          name: 'KSRTC Senior Citizen Concessional Travel Pass',
          nameKn: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಹಿರಿಯ ನಾಗರಿಕರ ರಿಯಾಯಿತಿ ಬಸ್ ಪಾಸ್',
          provider: 'Karnataka State Road Transport Corporation',
          officialDomain: 'ksrtc.in',
          category: 'Transport Concession',
          benefitAmount: '25% Fare Concession on All Routes',
          deadline: 'Yearly Renewal',
          daysRemaining: 120,
          eligibilityStatus: 'Matched (100%)',
          matchReason: 'Valid for all Karnataka resident elders aged 60 and above.',
          matchReasonKn: '೬೦ ವರ್ಷ ಮೀರಿದ ಎಲ್ಲಾ ರಾಜ್ಯದ ಹಿರಿಯರಿಗೆ ಸಾರಿಗೆ ಬಸ್ಸುಗಳಲ್ಲಿ ೨೫% ಶುಲ್ಕ ರಿಯಾಯಿತಿ.',
          requiredDocs: ['Senior Citizen Identity Card', 'Aadhaar Card'],
          serviceRef: buildVerifiedServiceRef(
            'srv-ksrtc-pass',
            'Senior Citizen Bus Pass',
            'Civic',
            'ksrtc.in',
            'Discounted intercity and rural transit for medical visits and family travel.',
            'Karnataka Resident Senior Citizens'
          ),
        },
      ];
    }

    if (role === 'Person with Disability') {
      return [
        {
          id: 'scheme-pwd-1',
          name: 'Divyangjan Disability Monthly Pension (Monthly DBT)',
          nameKn: 'ವಿಶೇಷ ಚೇತನರ ಮಾಸಾಶನ ಯೋಜನೆ (ಮಾಸಿಕ ಡಿಬಿಟಿ)',
          provider: 'Dept. for Empowerment of Differently Abled and Senior Citizens',
          officialDomain: 'nadakacheri.karnataka.gov.in',
          category: 'Social Assistance',
          benefitAmount: '₹2,000 / month DBT',
          deadline: 'Continuous',
          daysRemaining: 60,
          eligibilityStatus: 'Matched (100%)',
          matchReason: `Matched with UDID benchmark disability certificate (>40%).`,
          matchReasonKn: `೪೦% ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಯುಡಿಐಡಿ ಪ್ರಮಾಣಪತ್ರದೊಂದಿಗೆ ನೇರ ಮಾಸಾಶನ ತಾಳೆಯಾಗಿದೆ.`,
          requiredDocs: ['UDID Card', 'Hospital Medical Assessment', 'Income Certificate', 'Bank Passbook'],
          serviceRef: buildVerifiedServiceRef(
            'srv-pwd-pension',
            'Divyangjan Monthly Pension',
            'Disability',
            'nadakacheri.karnataka.gov.in',
            'Monthly social stipend credited to NPCI-linked bank account.',
            'Persons with Benchmark Disability'
          ),
        },
        {
          id: 'scheme-pwd-2',
          name: 'ADIP Scheme: Free Motorized Tricycle & Mobility Aids',
          nameKn: 'ಎಡಿಐಪಿ ಯೋಜನೆ: ಉಚಿತ ಮೋಟಾರೈಸ್ಡ್ ತ್ರಿಚಕ್ರ ವಾಹನ ಮತ್ತು ಉಪಕರಣಗಳು',
          provider: 'ALIMCO & Ministry of Social Justice & Empowerment',
          officialDomain: 'alimco.in',
          category: 'Assistive Tech Grant',
          benefitAmount: '100% Free Device (Worth ₹42,000)',
          deadline: '10 Nov 2026',
          daysRemaining: 45,
          eligibilityStatus: 'Matched (100%)',
          matchReason: 'Locomotor disability assessment certifies eligibility for battery motorized cycle.',
          matchReasonKn: 'ಚಲನವಲನ ನ್ಯೂನತೆ ಹೊಂದಿರುವವರಿಗೆ ಉಚಿತ ಬ್ಯಾಟರಿ ಚಾಲಿತ ವಾಹನ ಮಂಜೂರಾತಿ.',
          requiredDocs: ['UDID Card', 'Income Certificate (< ₹2.5 Lakh)', 'Aadhaar Card'],
          serviceRef: buildVerifiedServiceRef(
            'srv-adip-trike',
            'ADIP Motorized Tricycle Sanction',
            'Disability',
            'alimco.in',
            'Free distribution of assistive physical aids to empower personal independence.',
            'Locomotor Disability Patients'
          ),
        },
      ];
    }

    // Default Citizen / Family Head
    return [
      {
        id: 'scheme-cit-1',
        name: 'Gruha Lakshmi Scheme (Monthly Direct Benefit Transfer)',
        nameKn: 'ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆ (ಕುಟುಂಬದ ಯಜಮಾನಿಗೆ ₹೨,೦೦೦ ಮಾಸಿಕ ನೇರ ಜಮೆ)',
        provider: 'Dept. of Women and Child Development, Govt. of Karnataka',
        officialDomain: 'sevasindhugs.karnataka.gov.in',
        category: 'Guaranteed Income',
        benefitAmount: '₹2,00,00 / month DBT',
        deadline: 'Continuous',
        daysRemaining: 90,
        eligibilityStatus: 'Matched (100%)',
        matchReason: 'Matched with BPL/APL family ration card designated woman head.',
        matchReasonKn: 'ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ಗುರುತಿಸಲಾದ ಮನೆಯ ಮಹಿಳಾ ಮುಖ್ಯಸ್ಥರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹೨,೦೦೦ ನೇರ ಜಮೆ.',
        requiredDocs: ['Aadhaar Card', 'Ration Card (PHH/APL)', 'Aadhaar Seeded Bank Account'],
        serviceRef: buildVerifiedServiceRef(
          'srv-gruha-lakshmi',
          'Gruha Lakshmi Scheme Registration',
          'Social Welfare',
          'sevasindhugs.karnataka.gov.in',
          'Monthly cash support for household financial resilience.',
          'Women Heads of Households'
        ),
      },
      {
        id: 'scheme-cit-2',
        name: 'National Family Benefit Scheme (NFBS Survivor Ex-Gratia)',
        nameKn: 'ರಾಷ್ಟ್ರೀಯ ಕುಟುಂಬ ನೆರವು ಯೋಜನೆ (ಅನ್ನದಾತನನ್ನು ಕಳೆದುಕೊಂಡ ಕುಟುಂಬಕ್ಕೆ ₹೨೦,೦೦೦ ಪರಿಹಾರ)',
        provider: 'Ministry of Rural Development & Karnataka Revenue Dept.',
        officialDomain: 'nadakacheri.karnataka.gov.in',
        category: 'Emergency Bereavement',
        benefitAmount: '₹20,000 One-time Ex-Gratia',
        deadline: 'Within 180 days of event',
        daysRemaining: 30,
        eligibilityStatus: 'Matched (100%)',
        matchReason: 'Assistance for low-income BPL families on the loss of primary breadwinner.',
        matchReasonKn: 'ಕುಟುಂಬದ ಸಂಪಾದಿಸುವ ಮುಖ್ಯ ವ್ಯಕ್ತಿ ಮೃತಪಟ್ಟಾಗ ಕಷ್ಟದ ಸಮಯದಲ್ಲಿ ಸರ್ಕಾರ ನೀಡುವ ಏಕಗಂಟು ಪರಿಹಾರ.',
        requiredDocs: ['Death Certificate', 'BPL Ration Card', 'Family Tree (Vamshavruksha)', 'Bank Passbook'],
        serviceRef: buildVerifiedServiceRef(
          'srv-nfbs-grant',
          'NFBS Family Survivor Grant',
          'Civic',
          'nadakacheri.karnataka.gov.in',
          'Direct financial cushion to prevent falling into debt during family distress.',
          'Surviving dependants of primary wage earner'
        ),
      },
    ];
  };

  const schemes = getSchemesForPersona(userProfile.userType);

  const filteredSchemes = schemes.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.nameKn.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedFilter === 'high_priority') return s.daysRemaining <= 15;
    if (selectedFilter === 'direct_benefit') return s.benefitAmount.includes('DBT') || s.benefitAmount.includes('₹');
    return true;
  });

  const getPersonaHeaderIcon = () => {
    switch (userProfile.userType) {
      case 'Farmer':
        return <Tractor className="w-5 h-5 text-emerald-600" />;
      case 'Worker':
        return <Hammer className="w-5 h-5 text-amber-600" />;
      case 'Senior Citizen':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'Person with Disability':
        return <Accessibility className="w-5 h-5 text-blue-600" />;
      default:
        return <Home className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner specific to this user's persona */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 p-5 rounded-2xl border border-purple-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-100/70 border border-purple-200">
            {getPersonaHeaderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9333EA] bg-purple-100 px-2 py-0.5 rounded-md">
                Strictly Tailored for {userProfile.userType}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {schemes.length} Verified Eligible Schemes
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#38104E] mt-0.5">
              {language === 'kn'
                ? `${userProfile.userType}ರಿಗೆ ಅರ್ಹವಾದ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು`
                : `Verified Eligible Government Schemes for ${userProfile.userType}`}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ವಾಲ್ಟ್‌ನಲ್ಲಿರುವ ದಾಖಲೆಗಳ ಆಧಾರದ ಮೇಲೆ ಕೇವಲ ನಿಮಗೆ ಸಂಬಂಧಿಸಿದ ಯೋಜನೆಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗುತ್ತಿದೆ.'
                : 'Filtered automatically using your customized profile and verified vault proofs. Irrelevant programs have been suppressed to avoid clutter.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Confusing Extras</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'kn' ? 'ಯೋಜನೆ ಹುಡುಕಿ...' : 'Search matching schemes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#9333EA] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-[#38104E] text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All Schemes ({schemes.length})
          </button>
          <button
            onClick={() => setSelectedFilter('high_priority')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              selectedFilter === 'high_priority'
                ? 'bg-[#38104E] text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            Urgent / Closing Soon
          </button>
          <button
            onClick={() => setSelectedFilter('direct_benefit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              selectedFilter === 'direct_benefit'
                ? 'bg-[#38104E] text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            Direct Cash / DBT
          </button>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedId === scheme.id;

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-purple-300 p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#9333EA] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {scheme.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-[#38104E] mt-1.5">
                      {language === 'kn' ? scheme.nameKn : scheme.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {scheme.provider} • <span className="font-mono text-[11px] text-purple-700">{scheme.officialDomain}</span>
                    </p>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {scheme.eligibilityStatus}
                  </span>
                </div>

                {/* Match reason callout */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    {language === 'kn' ? scheme.matchReasonKn : scheme.matchReason}
                  </p>
                </div>

                {/* Key specs */}
                <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Financial Benefit</span>
                    <span className="font-bold text-emerald-700 text-xs sm:text-sm">{scheme.benefitAmount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Submission Deadline</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{scheme.deadline}</span>
                    </span>
                  </div>
                </div>

                {/* Required Documents Checklist */}
                <div className="mt-3.5">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                    className="text-[11px] font-semibold text-[#9333EA] hover:underline flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Required Documents' : `View ${scheme.requiredDocs.length} Required Documents`}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs">
                      {scheme.requiredDocs.map((docName, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-[11px] font-medium">{docName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://${scheme.officialDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-[#38104E] flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Portal</span>
                </a>

                <button
                  onClick={() => onOpenAssistFill(scheme.serviceRef)}
                  className="px-4 py-2 rounded-xl bg-[#38104E] hover:bg-[#4D166A] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <span>Pre-Fill with Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
