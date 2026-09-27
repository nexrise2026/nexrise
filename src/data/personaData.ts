import {
  UserType,
  UploadedDoc,
  ProjectStatusItem,
  DocumentationUpdateItem,
  UserProfile,
} from '../types';

export interface PersonaOption {
  type: UserType;
  title: string;
  titleKn: string;
  tagline: string;
  taglineKn: string;
  iconName: string;
  color: string;
  badge: string;
  badgeKn: string;
  description: string;
  descriptionKn: string;
  keySchemes: string[];
  keyDocuments: string[];
}

export const PERSONA_OPTIONS: PersonaOption[] = [
  {
    type: 'Farmer',
    title: 'Farmer / Agriculturist',
    titleKn: 'ರೈತರು / ಕೃಷಿಕರು',
    tagline: 'Crops, Land records, Insurance & PM-Kisan',
    taglineKn: 'ಬೆಳೆ ಪರಿಹಾರ, ಜಮೀನು ಪಹಣಿ, ಫಸಲ್ ಬಿಮಾ ಮತ್ತು ಕಿಸಾನ್ ನೆರವು',
    iconName: 'Tractor',
    color: 'emerald',
    badge: 'Agriculture & Land',
    badgeKn: 'ಕೃಷಿ ಮತ್ತು ಭೂಮಿ',
    description: 'For landowning or tenant farmers needing crop loss compensation, Bhoomi RTC records, drought input subsidy, or PM-Kisan.',
    descriptionKn: 'ಅತಿವೃಷ್ಟಿ ಬೆಳೆ ನಷ್ಟ, ೭೨ ಗಂಟೆಗಳ ಫಸಲ್ ಬಿಮಾ, ಭೂಮಿ ಆರ್‌ಟಿಸಿ ಮತ್ತು ಪಿಎಂ-ಕಿಸಾನ್ ಸಹಾಯಧನ ಪಡೆಯುವ ಕೃಷಿಕರಿಗೆ.',
    keySchemes: ['PM Fasal Bima (PMFBY)', 'PM-Kisan & Raitha Siri', 'Kharif Input Subsidy'],
    keyDocuments: ['Pahani / RTC Record', 'Submerged Crop Photos', 'Income Certificate', 'Bank Passbook'],
  },
  {
    type: 'Student',
    title: 'Student / College Learner',
    titleKn: 'ವಿದ್ಯಾರ್ಥಿ / ಕಲಿಯುವವರು',
    tagline: 'Scholarships, Fee concessions & Bonafide',
    taglineKn: 'ವಿದ್ಯಾರ್ಥಿವೇತನ, ಕಾಲೇಜು ಶುಲ್ಕ ರಿಯಾಯಿತಿ ಮತ್ತು ಬೋನಫೈಡ್',
    iconName: 'GraduationCap',
    color: 'purple',
    badge: 'Education & Grants',
    badgeKn: 'ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ',
    description: 'For students in PU, Degree, Engineering, Medical, or Diploma seeking SSP post-matric grants, tuition waivers, and hostel admissions.',
    descriptionKn: 'ಕಾಲೇಜು ಶುಲ್ಕ ಪಾವತಿಸಲು ತೊಂದರೆ, ಎಸ್.ಎಸ್.ಪಿ ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ, ಹಾಸ್ಟೆಲ್ ಪ್ರವೇಶಕ್ಕೆ.',
    keySchemes: ['Karnataka SSP Post-Matric', 'College Emergency Tuition Relief', 'AICTE Saksham Grant'],
    keyDocuments: ['College Bonafide', 'Previous Marks Card', 'College ID', 'Income & Caste RD'],
  },
  {
    type: 'Worker',
    title: 'Worker / Daily Wage Earner',
    titleKn: 'ಶ್ರಮಿಕರು / ದಿನಗೂಲಿ ಕಾರ್ಮಿಕರು',
    tagline: 'e-Shram, BOCW welfare & Worker insurance',
    taglineKn: 'ಇ-ಶ್ರಮ್, ಕಟ್ಟಡ ಕಾರ್ಮಿಕ ಮಂಡಳಿ ಮತ್ತು ಅಪಘಾತ ವಿಮೆ',
    iconName: 'Hammer',
    color: 'amber',
    badge: 'Labour & Welfare',
    badgeKn: 'ಕಾರ್ಮಿಕ ಕಲ್ಯಾಣ',
    description: 'For construction workers, unorganized labourers, drivers, artisans, and gig workers seeking social security and education grants for children.',
    descriptionKn: 'ಕಟ್ಟಡ ಕಾರ್ಮಿಕರು, ಅಸಂಘಟಿತ ವಲಯದ ದುಡಿಮೆಗಾರರು, ಇ-ಶ್ರಮ್ ಕಾರ್ಡ್ ಮತ್ತು ಮಕ್ಕಳ ವಿದ್ಯಾಭ್ಯಾಸ ಧನಸಹಾಯಕ್ಕೆ.',
    keySchemes: ['BOCW Education Stipend for Wards', 'e-Shram Accidental Cover', 'PMSYM Pension'],
    keyDocuments: ['e-Shram UAN Card', 'BOCW Registration', 'Bank Passbook', 'Ration Card'],
  },
  {
    type: 'Senior Citizen',
    title: 'Senior Citizen / Pensioner',
    titleKn: 'ಹಿರಿಯ ನಾಗರಿಕರು / ಪಿಂಚಣಿದಾರರು',
    tagline: 'Sandhya Suraksha, Old age pension & Healthcare',
    taglineKn: 'ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ, ವೃದ್ಧಾಪ್ಯ ವೇತನ ಮತ್ತು ಉಚಿತ ಆರೋಗ್ಯ ಸೇವೆ',
    iconName: 'HeartHandshake',
    color: 'rose',
    badge: 'Pensions & Healthcare',
    badgeKn: 'ಪಿಂಚಣಿ ಮತ್ತು ಆರೋಗ್ಯ',
    description: 'For citizens aged 60+ seeking monthly social security pensions, healthcare assistance, and public transport concessions.',
    descriptionKn: '೬೦ ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಹಿರಿಯರಿಗೆ ಮಾಸಿಕ ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ವೇತನ, ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಮತ್ತು ಬಸ್ ಪಾಸ್ ರಿಯಾಯಿತಿ.',
    keySchemes: ['Sandhya Suraksha Pension', 'Indira Gandhi National Old Age Pension', 'Ayushman Arogya'],
    keyDocuments: ['Senior Identity / Age Proof', 'Income Certificate', 'Pension Bank Passbook'],
  },
  {
    type: 'Person with Disability',
    title: 'Person with Disability (Divyangjan)',
    titleKn: 'ವಿಕಲಚೇತನರು (ವಿಶೇಷ ಚೇತನರು)',
    tagline: 'UDID card, Disability pension & Assistive devices',
    taglineKn: 'ಯುಡಿಐಡಿ ಕಾರ್ಡ್, ಮಾಸಾಶನ ಮತ್ತು ಸಹಾಯಕ ಉಪಕರಣಗಳು',
    iconName: 'Accessibility',
    color: 'blue',
    badge: 'Accessibility & Inclusion',
    badgeKn: 'ಸೌಲಭ್ಯ ಮತ್ತು ಸಹಾಯಧನ',
    description: 'For individuals with temporary or benchmark disabilities seeking UDID cards, educational concessions, monthly stipends, and mobility aids.',
    descriptionKn: 'ದೈಹಿಕ ಅಥವಾ ತಾತ್ಕಾಲಿಕ ಅಂಗವಿಕಲತೆ ಹೊಂದಿರುವವರಿಗೆ ಯುಡಿಐಡಿ ಕಾರ್ಡ್, ಪರೀಕ್ಷಾ ರಿಯಾಯಿತಿ ಮತ್ತು ಮಾಸಿಕ ಭತ್ಯೆ.',
    keySchemes: ['UDID Concessions', 'Disability Monthly Pension', 'ADIP Assistive Equipment'],
    keyDocuments: ['UDID / Disability Certificate', 'Hospital Medical Assessment', 'Bank Passbook'],
  },
  {
    type: 'Citizen',
    title: 'General Citizen / Family Head',
    titleKn: 'ಸಾಮಾನ್ಯ ನಾಗರಿಕರು / ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರು',
    tagline: 'Gruha Lakshmi, Family benefit & Ration card',
    taglineKn: 'ಗೃಹ ಲಕ್ಷ್ಮಿ, ಕುಟುಂಬ ನೆರವು ಮತ್ತು ಪಡಿತರ ಚೀಟಿ ಸೇವೆ',
    iconName: 'Home',
    color: 'teal',
    badge: 'Civic & Family Welfare',
    badgeKn: 'ನಾಗರಿಕ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ',
    description: 'For family heads, homemakers, and citizens navigating survivor support, ration card porting, Gruha Lakshmi, and civic records.',
    descriptionKn: 'ಕುಟುಂಬದ ಆಧಾರ ಕಳೆದುಕೊಂಡಾಗ ಪರಿಹಾರ, ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆ, ಪಡಿತರ ಚೀಟಿ ವಿಳಾಸ ಬದಲಾವಣೆಗೆ.',
    keySchemes: ['National Family Benefit Scheme (NFBS)', 'Gruha Lakshmi DBT', 'Seva Sindhu Services'],
    keyDocuments: ['Aadhaar Card', 'Ration Card (BPL/APL)', 'Income Certificate', 'Bank Passbook'],
  },
];

// Helper to get tailored initial documents for a given user type
export function getDocumentsForUserType(userType: UserType): UploadedDoc[] {
  const commonDocs: UploadedDoc[] = [
    {
      id: 'doc-aadhaar',
      name: 'Aadhaar Card / National ID',
      nameKn: 'ಆಧಾರ್ ಕಾರ್ಡ್ / ರಾಷ್ಟ್ರೀಯ ಗುರುತಿನ ಚೀಟಿ',
      required: true,
      status: 'verified',
      fileName: 'Aadhaar_National_ID_Masked.pdf',
      fileSize: '412 KB',
      lastUpdated: '1 week ago',
      fileType: 'PDF Document',
      category: 'Identity',
      docNumber: 'XXXX-XXXX-9182',
      extractedDetails: 'UIDAI Verified • Active demographic match with Government database.',
      isApplicableToAll: true,
    },
    {
      id: 'doc-income',
      name: 'State Revenue Income Certificate (RD Number)',
      nameKn: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (ಕಂದಾಯ ಆರ್.ಡಿ ಸಂಖ್ಯೆ)',
      required: true,
      status: 'verified',
      fileName: 'Karnataka_Income_Certificate_2026.pdf',
      fileSize: '360 KB',
      lastUpdated: '2 weeks ago',
      fileType: 'PDF Document',
      category: 'Income & Caste',
      docNumber: 'RD0038291024',
      extractedDetails: 'Nadakacheri Atalji Janasnehi Kendra • Household bracket verified.',
      isApplicableToAll: true,
    },
    {
      id: 'doc-bank',
      name: 'Bank Passbook / Cancelled Cheque (DBT-Seeded)',
      nameKn: 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ / ರದ್ದಾದ ಚೆಕ್ (ಡಿಬಿಟಿ ಸಕ್ರಿಯ)',
      required: true,
      status: 'verified',
      fileName: 'Bank_Passbook_Aadhaar_Linked.pdf',
      fileSize: '315 KB',
      lastUpdated: '4 days ago',
      fileType: 'PDF Document',
      category: 'Identity',
      docNumber: 'A/C: *******9812 (Canara Bank)',
      extractedDetails: 'NPCI Aadhaar Mapping Active • Direct Benefit Transfer eligible.',
      isApplicableToAll: true,
    },
    {
      id: 'doc-ration',
      name: 'Ration Card (BPL / Priority Household / AAY)',
      nameKn: 'ಪಡಿತರ ಚೀಟಿ (ಬಿ.ಪಿ.ಎಲ್ / ಅಂತ್ಯೋದಯ)',
      required: false,
      status: 'verified',
      fileName: 'Ration_Card_Family_PHH.jpg',
      fileSize: '480 KB',
      lastUpdated: '5 days ago',
      fileType: 'Image',
      category: 'Income & Caste',
      docNumber: 'BPL-KA-560059-8812',
      extractedDetails: 'Food & Civil Supplies Dept • Category: BPL (Priority Household).',
      isApplicableToAll: true,
    },
  ];

  if (userType === 'Farmer') {
    return [
      ...commonDocs,
      {
        id: 'doc-rtc',
        name: 'Pahani / RTC Land Record Certificate (Bhoomi)',
        nameKn: 'ಪಹಣಿ / ಆರ್‌ಟಿಸಿ ಭೂದಾಖಲೆ (ಭೂಮಿ ಪೋರ್ಟಲ್)',
        required: true,
        status: 'verified',
        fileName: 'Bhoomi_RTC_142_2A_Kharif2026.pdf',
        fileSize: '540 KB',
        lastUpdated: 'Yesterday',
        fileType: 'PDF Document',
        category: 'Land & Agriculture',
        docNumber: 'Survey Plot 142/2A (Hobli: Kengeri)',
        extractedDetails: 'Bhoomi Karnataka Verified • Paddy Kharif 2026 Crop entry digitally signed.',
        userTypes: ['Farmer'],
      },
      {
        id: 'doc-crop-photos',
        name: 'Geotagged Submerged Crop Damage Photos (3 Angles)',
        nameKn: 'ಜಲಾವೃತ ಜಮೀನಿನ ಜಿಯೋಟ್ಯಾಗ್ ಫೋಟೋಗಳು (೩ ಕೋನಗಳು)',
        required: true,
        status: 'verified',
        fileName: 'Paddy_Flood_Damage_Survey_142.jpg',
        fileSize: '1.2 MB',
        lastUpdated: '2 days ago',
        fileType: 'Image',
        category: 'Land & Agriculture',
        docNumber: 'GPS-GEO: 12.9142 N, 77.4921 E',
        extractedDetails: 'Geotagged & Timestamped • Inundation loss ratio assessment ready for PMFBY.',
        userTypes: ['Farmer'],
      },
      {
        id: 'doc-pmkisan',
        name: 'PM-Kisan Beneficiary e-KYC Passbook',
        nameKn: 'ಪಿಎಂ-ಕಿಸಾನ್ ಫಲಾನುಭವಿ ಇ-ಕೆವೈಸಿ ದಾಖಲೆ',
        required: false,
        status: 'verified',
        fileName: 'PM_Kisan_Passbook_eKYC.pdf',
        fileSize: '290 KB',
        lastUpdated: '1 month ago',
        fileType: 'PDF Document',
        category: 'Land & Agriculture',
        docNumber: 'PMK-KA-2022-99120',
        extractedDetails: 'Aadhaar Biometric e-KYC Complete • Linked with Samrakshane portal.',
        userTypes: ['Farmer'],
      },
    ];
  }

  if (userType === 'Student') {
    return [
      ...commonDocs,
      {
        id: 'doc-bonafide',
        name: 'College Bonafide / Study Enrolment Certificate',
        nameKn: 'ಕಾಲೇಜು ಬೋನಫೈಡ್ / ವ್ಯಾಸಂಗ ಪ್ರಮಾಣಪತ್ರ',
        required: true,
        status: 'verified',
        fileName: 'College_Bonafide_Enrolment_2026.pdf',
        fileSize: '420 KB',
        lastUpdated: 'Yesterday',
        fileType: 'PDF Document',
        category: 'Academic',
        docNumber: 'COL/EST/2026/CS-104',
        extractedDetails: 'Semester 3 Regular Full-time • Principal Official Seal & 86.4% Attendance Certified.',
        userTypes: ['Student'],
      },
      {
        id: 'doc-marks',
        name: 'Previous Semester Marks Card / Transcript',
        nameKn: 'ಹಿಂದಿನ ಸೆಮಿಸ್ಟರ್ ಅಂಕಪಟ್ಟಿ',
        required: true,
        status: 'verified',
        fileName: 'Semester_Transcript_Attested.pdf',
        fileSize: '890 KB',
        lastUpdated: '3 days ago',
        fileType: 'PDF Document',
        category: 'Academic',
        docNumber: 'Roll / USN: 2024-ENGG-089',
        extractedDetails: 'SGPA: 8.42 • Zero active backlogs • Passed in 1st class with distinction.',
        userTypes: ['Student'],
      },
      {
        id: 'doc-idproof',
        name: 'Student College ID Proof',
        nameKn: 'ವಿದ್ಯಾರ್ಥಿ ಕಾಲೇಜು ಗುರುತಿನ ಚೀಟಿ',
        required: false,
        status: 'verified',
        fileName: 'College_Student_ID_Card.jpg',
        fileSize: '310 KB',
        lastUpdated: '4 days ago',
        fileType: 'Image',
        category: 'Academic',
        docNumber: 'STUDENT-ID-2026-99',
        extractedDetails: 'Valid through Academic Year 2026-27 • Student Welfare Office.',
        userTypes: ['Student'],
      },
      {
        id: 'doc-caste',
        name: 'Caste & Category Certificate (OBC / SC / ST / EWS)',
        nameKn: 'ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ (ಹಿಂದುಳಿದ ವರ್ಗ / ಪ.ಜಾ / ಪ.ಪಂ)',
        required: false,
        status: 'verified',
        fileName: 'Karnataka_Caste_Certificate_2025.pdf',
        fileSize: '360 KB',
        lastUpdated: '2 weeks ago',
        fileType: 'PDF Document',
        category: 'Income & Caste',
        docNumber: 'RD992104821',
        extractedDetails: 'Category 2A (OBC) • Valid till 2030 • Tahsildar Bengaluru Office.',
        userTypes: ['Student'],
      },
    ];
  }

  if (userType === 'Worker') {
    return [
      ...commonDocs,
      {
        id: 'doc-eshram',
        name: 'e-Shram / Labour Welfare Board Registration Card',
        nameKn: 'ಇ-ಶ್ರಮ್ / ಕಾರ್ಮಿಕ ಕಲ್ಯಾಣ ಮಂಡಳಿ ಕಾರ್ಡ್',
        required: true,
        status: 'verified',
        fileName: 'eShram_UAN_National_Card.pdf',
        fileSize: '390 KB',
        lastUpdated: '3 weeks ago',
        fileType: 'PDF Document',
        category: 'Labour & Work',
        docNumber: 'UAN: 1009-8821-3321',
        extractedDetails: 'Ministry of Labour & Employment • Occupation: Construction & Carpentry • Active PMSYM insurance.',
        userTypes: ['Worker'],
      },
      {
        id: 'doc-bocw',
        name: 'Building & Other Construction Workers (BOCW) Passbook',
        nameKn: 'ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕ ಕಲ್ಯಾಣ ಮಂಡಳಿ ಪಾಸ್‌ಬುಕ್',
        required: false,
        status: 'verified',
        fileName: 'Karnataka_BOCW_Passbook.pdf',
        fileSize: '450 KB',
        lastUpdated: '2 weeks ago',
        fileType: 'PDF Document',
        category: 'Labour & Work',
        docNumber: 'BOCW-KA-BLR-88190',
        extractedDetails: 'Karnataka Labour Welfare Board • Registered member • Entitled to toolkits & education grants for wards.',
        userTypes: ['Worker'],
      },
    ];
  }

  if (userType === 'Senior Citizen') {
    return [
      ...commonDocs,
      {
        id: 'doc-senior-card',
        name: 'Senior Citizen Identity Card / Age Attestation',
        nameKn: 'ಹಿರಿಯ ನಾಗರಿಕರ ಗುರುತಿನ ಚೀಟಿ / ವಯಸ್ಸಿನ ಪುರಾವೆ',
        required: true,
        status: 'verified',
        fileName: 'Senior_Citizen_Id_Card.pdf',
        fileSize: '320 KB',
        lastUpdated: '1 month ago',
        fileType: 'PDF Document',
        category: 'Pension & Senior',
        docNumber: 'SR-KA-2024-11029',
        extractedDetails: 'Dept of Empowerment of Differently Abled and Senior Citizens • Age: 64 years • Sandhya Suraksha eligible.',
        userTypes: ['Senior Citizen'],
      },
      {
        id: 'doc-pension-paper',
        name: 'Treasury Pension Sanction Order & Passbook',
        nameKn: 'ಖಜಾನೆ ಪಿಂಚಣಿ ಮಂಜೂರಾತಿ ಆದೇಶ ಮತ್ತು ಪಾಸ್‌ಬುಕ್',
        required: false,
        status: 'verified',
        fileName: 'Social_Security_Pension_Sanction.pdf',
        fileSize: '410 KB',
        lastUpdated: '2 weeks ago',
        fileType: 'PDF Document',
        category: 'Pension & Senior',
        docNumber: 'DIR-SSP-2026-981',
        extractedDetails: 'Directorate of Social Security • Monthly DBT ₹1,200 deposited via DBT.',
        userTypes: ['Senior Citizen'],
      },
    ];
  }

  if (userType === 'Person with Disability') {
    return [
      ...commonDocs,
      {
        id: 'doc-udid',
        name: 'Unique Disability ID (UDID) / National Card',
        nameKn: 'ವಿಶಿಷ್ಟ ಅಂಗವೈಕಲ್ಯ ಗುರುತಿನ ಚೀಟಿ (UDID)',
        required: true,
        status: 'verified',
        fileName: 'UDID_National_Disability_Card.pdf',
        fileSize: '450 KB',
        lastUpdated: '2 weeks ago',
        fileType: 'PDF Document',
        category: 'Disability',
        docNumber: 'UDID: KA291048192019',
        extractedDetails: 'Government Hospital Civil Surgeon Assessment • Benchmark 45% Locomotor Disability • Valid Pan-India.',
        userTypes: ['Person with Disability'],
      },
      {
        id: 'doc-medical-board',
        name: 'District Medical Board Disability Assessment Report',
        nameKn: 'ಜಿಲ್ಲಾ ವೈದ್ಯಕೀಯ ಮಂಡಳಿಯ ತಪಾಸಣಾ ವರದಿ',
        required: false,
        status: 'verified',
        fileName: 'District_Hospital_Assessment.pdf',
        fileSize: '510 KB',
        lastUpdated: '1 month ago',
        fileType: 'PDF Document',
        category: 'Disability',
        docNumber: 'DMB-BLR-2025-081',
        extractedDetails: 'Assessed under RPwD Act 2016 • Entitled to assistive equipment, exam scribes & travel concession.',
        userTypes: ['Person with Disability'],
      },
    ];
  }

  // General Citizen / Homemaker default
  return [
    ...commonDocs,
    {
      id: 'doc-domicile',
      name: 'Domicile / Resident Certificate',
      nameKn: 'ಸ್ಥಳೀಯ ವಾಸಸ್ಥಳ ಪ್ರಮಾಣಪತ್ರ',
      required: false,
      status: 'verified',
      fileName: 'Karnataka_Residence_Proof.pdf',
      fileSize: '290 KB',
      lastUpdated: '3 weeks ago',
      fileType: 'PDF Document',
      category: 'Identity',
      docNumber: 'DOM-KA-2024-819',
      extractedDetails: 'Resident of Karnataka for 10+ years • Bangalore District Office.',
      isApplicableToAll: true,
    },
  ];
}

// Helper to get tailored initial projects for a given user type
export function getProjectsForUserType(userType: UserType): ProjectStatusItem[] {
  if (userType === 'Farmer') {
    return [
      {
        id: 'proj-crop-relief',
        code: 'NIR-2026-FARM-01',
        title: 'PM Fasal Bima Yojana (72-Hour Rain Crop Loss Relief)',
        titleKn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (೭೨ ಗಂಟೆಗಳ ಬೆಳೆ ನಷ್ಟ ಪರಿಹಾರ)',
        department: 'Dept. of Agriculture, Govt of Karnataka & AIC of India',
        officialDomain: 'pmfby.gov.in',
        serviceId: 'srv-crop-relief',
        status: 'action_required',
        statusLabel: 'Urgent: Physical Spot Survey Scheduled',
        statusLabelKn: 'ತುರ್ತು: ಸ್ಥಳ ತಪಾಸಣೆ ನಿಗದಿಯಾಗಿದೆ',
        progressPercent: 50,
        benefitAmount: '₹32,000 (Estimated Inundation Loss)',
        daysRemaining: 1,
        deadlineDate: '27 Sep 2026 (18 hrs left)',
        urgency: 'critical',
        assignedAuthority: 'Taluk Agricultural Officer & Insurance Claim Assessor',
        contactHelpline: '1800-180-1551 (Kisan Call Centre)',
        nextAction: 'Be present at survey plot 142/2A for joint physical inspection today at 4:30 PM.',
        nextActionKn: 'ಇಂದು ಸಂಜೆ ೪:೩೦ ಕ್ಕೆ ಸರ್ವೆ ನಂ ೧೪೨/೨ಎ ಜಮೀನಿನಲ್ಲಿ ಸ್ಥಳ ತಪಾಸಣೆಗೆ ಹಾಜರಿರಿ.',
        blockers: ['Keep physical RTC and insurance policy receipt ready for inspector signature.'],
        userTypes: ['Farmer'],
        milestones: [
          { id: 'm-f1', label: '72-Hour Statutory Intimation Sent via Samrakshane Portal', labelKn: '೭೨ ಗಂಟೆಯೊಳಗೆ ಬೆಳೆ ಹಾನಿ ಮಾಹಿತಿ ರವಾನೆ', completed: true, date: '25 Sep 2026' },
          { id: 'm-f2', label: 'Geotagged Submerged Crop Photos Uploaded from Vault', labelKn: 'ಜಮೀನಿನ ಜಲಾವೃತ ಫೋಟೋ ಅಪ್ಲೋಡ್', completed: true, date: '25 Sep 2026' },
          { id: 'm-f3', label: 'Joint Spot Survey by Village Accountant & Insurance Agent', labelKn: 'ಜಂಟಿ ಸ್ಥಳ ತಪಾಸಣೆ', completed: false, note: 'Scheduled for today 4:30 PM' },
          { id: 'm-f4', label: 'Damage Assessment Loss Ratio Signed and Uploaded', labelKn: 'ನಷ್ಟದ ಪ್ರಮಾಣಪತ್ರ ಸಲ್ಲಿಕೆ', completed: false },
          { id: 'm-f5', label: 'Direct Benefit Compensation to Samrakshane Bank Account', labelKn: 'ಬೆಳೆ ಪರಿಹಾರ ಜಮೆ', completed: false },
        ],
        lastUpdate: '2026-09-26T08:30:00Z',
      },
      {
        id: 'proj-kisan',
        code: 'NIR-2026-FARM-02',
        title: 'PM-Kisan Samman Nidhi & Raitha Siri Grant',
        titleKn: 'ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ ಮತ್ತು ರೈತ ಸಿರಿ ಅನುದಾನ',
        department: 'Ministry of Agriculture & Farmers Welfare, Karnataka Desk',
        officialDomain: 'pmkisan.gov.in',
        serviceId: 'srv-pmkisan',
        status: 'under_review',
        statusLabel: 'Land Record Cross-Check in Progress',
        statusLabelKn: 'ಭೂದಾಖಲೆ ಪರಿಶೀಲನೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ',
        progressPercent: 75,
        benefitAmount: '₹6,000 + ₹10,000 / year',
        daysRemaining: 15,
        deadlineDate: '10 Oct 2026',
        urgency: 'high',
        assignedAuthority: 'Taluk Nodal Officer, Bhoomi Seva Kendra',
        contactHelpline: '155261 / 011-24300606',
        nextAction: 'e-KYC biometric synchronization completed; awaiting State tranche approval.',
        nextActionKn: 'ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಂಡಿದ್ದು, ರಾಜ್ಯ ಸರ್ಕಾರದ ಕಂತಿನ ಅನುಮೋದನೆ ಬಾಕಿಯಿದೆ.',
        userTypes: ['Farmer'],
        milestones: [
          { id: 'm-k1', label: 'Beneficiary Registration & Aadhaar Seeded Account', labelKn: 'ಫಲಾನುಭವಿ ನೋಂದಣಿ', completed: true, date: '10 Sep 2026' },
          { id: 'm-k2', label: 'Bhoomi RTC Land Survey Plot Cross-Match', labelKn: 'ಭೂಮಿ ಪೋರ್ಟಲ್ ತಾಳೆ', completed: true, date: '15 Sep 2026' },
          { id: 'm-k3', label: 'Aadhaar Biometric e-KYC Verification', labelKn: 'ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ದೃಢೀಕರಣ', completed: true, date: '20 Sep 2026' },
          { id: 'm-k4', label: 'State Tranche Direct Benefit Transfer (DBT)', labelKn: 'ನೇರ ನಗದು ವರ್ಗಾವಣೆ', completed: false },
        ],
        lastUpdate: '2026-09-24T12:00:00Z',
      },
    ];
  }

  if (userType === 'Student') {
    return [
      {
        id: 'proj-ssp-fee',
        code: 'NIR-2026-STU-01',
        title: 'Karnataka Student Fee Support Grant (SSP Post-Matric)',
        titleKn: 'ಕರ್ನಾಟಕ ವಿದ್ಯಾರ್ಥಿ ಶುಲ್ಕ ಬೆಂಬಲ ಅನುದಾನ (ಎಸ್.ಎಸ್.ಪಿ ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್)',
        department: 'Dept. of Backward Classes & Social Welfare, Govt of Karnataka',
        officialDomain: 'ssp.postmatric.karnataka.gov.in',
        serviceId: 'srv-karnataka-fee',
        status: 'under_review',
        statusLabel: 'Verification in Progress (Step 3/5)',
        statusLabelKn: 'ಪರಿಶೀಲನೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ (ಹಂತ ೩/೫)',
        progressPercent: 65,
        benefitAmount: '₹45,000 / year',
        daysRemaining: 12,
        deadlineDate: '15 Oct 2026',
        urgency: 'high',
        assignedAuthority: 'District Social Welfare Officer, Bangalore Urban',
        contactHelpline: '1902 / 080-22238473',
        nextAction: 'Tahsildar RD Income certificate verification in progress at Nadakacheri desk.',
        nextActionKn: 'ನಾಡಕಚೇರಿ ತಹಶೀಲ್ದಾರ್ ಆದಾಯ ದೃಢೀಕರಣ ಪರಿಶೀಲನೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ.',
        userTypes: ['Student'],
        milestones: [
          { id: 'm-s1', label: 'Online Application Draft & Form Submission', labelKn: 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ', completed: true, date: '18 Sep 2026' },
          { id: 'm-s2', label: 'Digilocker e-KYC & Aadhaar Demographic Match', labelKn: 'ಡಿಜಿಲಾಕರ್ ಇ-ಕೆವೈಸಿ', completed: true, date: '19 Sep 2026' },
          { id: 'm-s3', label: 'College Bonafide & Enrolment Verification by Principal', labelKn: 'ಕಾಲೇಜು ಪ್ರಾಂಶುಪಾಲರ ದೃಢೀಕರಣ', completed: true, date: '22 Sep 2026', note: 'Attendance 86.4% certified' },
          { id: 'm-s4', label: 'Tahsildar Income RD Number Digital Cross-Check', labelKn: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಆನ್‌ಲೈನ್ ತಾಳೆ', completed: false, note: 'RD0038291024 queued at taluk desk' },
          { id: 'm-s5', label: 'Sanction Order & Direct Benefit Transfer (DBT)', labelKn: 'ಮಂಜೂರಾತಿ ಮತ್ತು ನೇರ ಹಣ ವರ್ಗಾವಣೆ', completed: false },
        ],
        lastUpdate: '2026-09-24T14:30:00Z',
      },
      {
        id: 'proj-emergency-aid',
        code: 'NIR-2026-STU-02',
        title: 'Emergency College Tuition Hardship Relief Fund',
        titleKn: 'ಕಾಲೇಜು ಆಡಳಿತ ಮಂಡಳಿಯ ತುರ್ತು ಶುಲ್ಕ ಕಂತು ನೆರವು',
        department: 'College Student Welfare Committee & Dean Office',
        officialDomain: 'college.edu.in',
        serviceId: 'srv-emergency-aid',
        status: 'action_required',
        statusLabel: 'Action Required: Interview Scheduled',
        statusLabelKn: 'ಕ್ರಮ ಅಗತ್ಯ: ಸಂದರ್ಶನ ನಿಗದಿಯಾಗಿದೆ',
        progressPercent: 80,
        benefitAmount: '₹15,000 (Tuition Stop-gap)',
        daysRemaining: 4,
        deadlineDate: '30 Sep 2026',
        urgency: 'critical',
        assignedAuthority: 'Prof. R. Sundaram (Dean of Student Welfare)',
        contactHelpline: '080-26998100 (Ext. 204)',
        nextAction: 'Attend Welfare Committee brief interview on Oct 2 at 11:00 AM in Room 108.',
        nextActionKn: 'ಅಕ್ಟೋಬರ್ ೨ ರಂದು ಬೆಳಿಗ್ಗೆ ೧೧:೦೦ ಗಂಟೆಗೆ ಕೊಠಡಿ ೧೦೮ ರಲ್ಲಿ ಸಂದರ್ಶನಕ್ಕೆ ಹಾಜರಾಗಿ.',
        blockers: ['Parent income reduction affidavit must be carried in physical original.'],
        userTypes: ['Student'],
        milestones: [
          { id: 'm-e1', label: 'Student Hardship Petition Lodged', labelKn: 'ಮನವಿ ಸಲ್ಲಿಕೆ', completed: true, date: '20 Sep 2026' },
          { id: 'm-e2', label: 'Academic Standing & Semester Marks Verification', labelKn: 'ಅಂಕಪಟ್ಟಿ ಪರಿಶೀಲನೆ', completed: true, date: '21 Sep 2026' },
          { id: 'm-e3', label: 'HOD Recommendation Endorsement', labelKn: 'ವಿಭಾಗ ಮುಖ್ಯಸ್ಥರ ಶಿಫಾರಸು', completed: true, date: '23 Sep 2026' },
          { id: 'm-e4', label: 'Student Welfare Committee Hardship Interview', labelKn: 'ಸಮಿತಿಯ ಸಂದರ್ಶನ', completed: false, note: 'Scheduled for 02 Oct 2026, 11:00 AM' },
          { id: 'm-e5', label: 'Fee Concession Credit in College Fee Ledger', labelKn: 'ಶುಲ್ಕ ಖಾತೆಗೆ ವಿನಾಯಿತಿ ಜಮೆ', completed: false },
        ],
        lastUpdate: '2026-09-25T11:15:00Z',
      },
    ];
  }

  if (userType === 'Worker') {
    return [
      {
        id: 'proj-bocw-stipend',
        code: 'NIR-2026-WRK-01',
        title: 'Karnataka Building Workers (BOCW) Education Stipend for Wards',
        titleKn: 'ಕಟ್ಟಡ ಕಾರ್ಮಿಕರ ಮಕ್ಕಳ ಶೈಕ್ಷಣಿಕ ಧನಸಹಾಯ ಯೋಜನೆ',
        department: 'Karnataka Building and Other Construction Workers Welfare Board',
        officialDomain: 'kbocwwb.karnataka.gov.in',
        serviceId: 'srv-bocw',
        status: 'under_review',
        statusLabel: 'Under Board Scrutiny',
        statusLabelKn: 'ಮಂಡಳಿಯ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
        progressPercent: 70,
        benefitAmount: '₹20,000 / year',
        daysRemaining: 18,
        deadlineDate: '20 Oct 2026',
        urgency: 'high',
        assignedAuthority: 'District Labour Officer, Bannerghatta Road',
        contactHelpline: '155214 / 080-22277020',
        nextAction: 'Labour Welfare inspector verified active 90-day subscription; awaiting DBT release.',
        nextActionKn: 'ಕಾರ್ಮಿಕ ನಿರೀಕ್ಷಕರ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ; ಧನಸಹಾಯ ಬಿಡುಗಡೆ ಬಾಕಿಯಿದೆ.',
        userTypes: ['Worker'],
        milestones: [
          { id: 'm-w1', label: 'BOCW Online Application Submitted with Child School Bonafide', labelKn: 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ', completed: true, date: '10 Sep 2026' },
          { id: 'm-w2', label: 'e-Shram & BOCW Card Active 90-day Working Verification', labelKn: 'ಕಾರ್ಮಿಕ ಕಾರ್ಡ್ ತಾಳೆ', completed: true, date: '18 Sep 2026' },
          { id: 'm-w3', label: 'District Labour Board Sanction Order', labelKn: 'ಮಂಡಳಿ ಮಂಜೂರಾತಿ', completed: false },
          { id: 'm-w4', label: 'Direct Benefit Credit into Aadhaar-Linked Bank Account', labelKn: 'ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ', completed: false },
        ],
        lastUpdate: '2026-09-23T10:00:00Z',
      },
    ];
  }

  if (userType === 'Senior Citizen') {
    return [
      {
        id: 'proj-sandhya-suraksha',
        code: 'NIR-2026-SNR-01',
        title: 'Sandhya Suraksha / Karnataka Social Security Pension',
        titleKn: 'ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ / ಕರ್ನಾಟಕ ಸಾಮಾಜಿಕ ಭದ್ರತಾ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ',
        department: 'Directorate of Social Security and Pensions, Revenue Dept.',
        officialDomain: 'sevasindhu.karnataka.gov.in',
        serviceId: 'srv-sandhya-suraksha',
        status: 'under_review',
        statusLabel: 'Tahsildar Sanction Underway',
        statusLabelKn: 'ತಹಶೀಲ್ದಾರ್ ಮಂಜೂರಾತಿ ಹಂತದಲ್ಲಿದೆ',
        progressPercent: 60,
        benefitAmount: '₹1,200 / month (Life-long DBT)',
        daysRemaining: 14,
        deadlineDate: '12 Oct 2026',
        urgency: 'normal',
        assignedAuthority: 'Tahsildar Office, Janasnehi Kendra Desk',
        contactHelpline: '080-22214555',
        nextAction: 'Age and income certificate cross-verified; awaiting monthly treasury cycle release.',
        nextActionKn: 'ವಯಸ್ಸು ಮತ್ತು ಆದಾಯ ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಂಡಿದ್ದು, ಖಜಾನೆ ಪಾವತಿ ಬಾಕಿಯಿದೆ.',
        userTypes: ['Senior Citizen'],
        milestones: [
          { id: 'm-sn1', label: 'Seva Sindhu Pension Application Lodged', labelKn: 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ', completed: true, date: '05 Sep 2026' },
          { id: 'm-sn2', label: 'Village Accountant Ground Mahajar & Age Verification', labelKn: 'ಸ್ಥಳ ಮಹಜರು', completed: true, date: '14 Sep 2026' },
          { id: 'm-sn3', label: 'Revenue Inspector Approval', labelKn: 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರ ಅನುಮೋದನೆ', completed: true, date: '21 Sep 2026' },
          { id: 'm-sn4', label: 'Treasury PPO (Pension Payment Order) Generation', labelKn: 'ಪಿಂಚಣಿ ಪಾವತಿ ಆದೇಶ', completed: false },
        ],
        lastUpdate: '2026-09-22T15:00:00Z',
      },
    ];
  }

  if (userType === 'Person with Disability') {
    return [
      {
        id: 'proj-udid-pension',
        code: 'NIR-2026-PWD-01',
        title: 'UDID Portal Disability Maintenance Allowance & Free Bus Concession',
        titleKn: 'ಯುಡಿಐಡಿ ವಿಕಲಚೇತನ ಮಾಸಾಶನ ಮತ್ತು ಉಚಿತ ಸಾರಿಗೆ ಸೌಲಭ್ಯ',
        department: 'Dept. of Empowerment of Persons with Disabilities, Govt of Karnataka',
        officialDomain: 'swavlambancard.gov.in',
        serviceId: 'srv-disability-udid',
        status: 'action_required',
        statusLabel: 'Medical Assessment Card Attested',
        statusLabelKn: 'ವೈದ್ಯಕೀಯ ಮಂಡಳಿಯ ವರದಿ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ',
        progressPercent: 75,
        benefitAmount: '₹1,400 / month + Free Transport Pass',
        daysRemaining: 7,
        deadlineDate: '03 Oct 2026',
        urgency: 'high',
        assignedAuthority: 'District Disability Rehabilitation Officer (DDRO)',
        contactHelpline: '080-22252111',
        nextAction: 'Collect physical plastic smart card from Taluk Health Office or download e-UDID.',
        nextActionKn: 'ತಾಲೂಕು ಆರೋಗ್ಯಾಧಿಕಾರಿ ಕಚೇರಿಯಿಂದ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ ಅಥವಾ ಇ-ಯುಡಿಐಡಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
        userTypes: ['Person with Disability'],
        milestones: [
          { id: 'm-p1', label: 'Online UDID Enrolment & Medical History Form', labelKn: 'ಪೋರ್ಟಲ್ ನೋಂದಣಿ', completed: true, date: '10 Sep 2026' },
          { id: 'm-p2', label: 'District Hospital Civil Surgeon Physical Assessment (45% Disability)', labelKn: 'ವೈದ್ಯಕೀಯ ಪರೀಕ್ಷೆ', completed: true, date: '16 Sep 2026' },
          { id: 'm-p3', label: 'Directorate of Disabled Welfare Sanction', labelKn: 'ಮಂಜೂರಾತಿ ಆದೇಶ', completed: true, date: '23 Sep 2026' },
          { id: 'm-p4', label: 'KSRTC / BMTC Free Pass Smart Chip Card Activation', labelKn: 'ಉಚಿತ ಬಸ್ ಪಾಸ್ ಸಕ್ರಿಯ', completed: false },
        ],
        lastUpdate: '2026-09-25T14:00:00Z',
      },
    ];
  }

  // General Citizen / Family Head default
  return [
    {
      id: 'proj-nfbs-survivor',
      code: 'NIR-2026-CIT-01',
      title: 'National Family Benefit Scheme (NFBS Survivor Grant)',
      titleKn: 'ರಾಷ್ಟ್ರೀಯ ಕುಟುಂಬ ನೆರವು ಯೋಜನೆ (ಅಗಲಿದ ಆದಾಯದಾರರ ನೆರವು)',
      department: 'Revenue Dept. & Directorate of Social Security, Karnataka',
      officialDomain: 'sevasindhu.karnataka.gov.in',
      serviceId: 'srv-nfbs',
      status: 'under_review',
      statusLabel: 'Under Revenue Inspector Review',
      statusLabelKn: 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
      progressPercent: 55,
      benefitAmount: '₹20,000 (One-time lump sum)',
      daysRemaining: 35,
      deadlineDate: '05 Nov 2026',
      urgency: 'normal',
      assignedAuthority: 'Tahsildar Office, Bangalore North Taluk',
      contactHelpline: '080-22214555',
      nextAction: 'Field inquiry report submitted by Village Accountant; awaiting Tahsildar sanction.',
      nextActionKn: 'ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿಗಳ ವರದಿ ಸಲ್ಲಿಕೆಯಾಗಿದ್ದು, ತಹಶೀಲ್ದಾರ್ ಆದೇಶ ಬಾಕಿಯಿದೆ.',
      userTypes: ['Citizen'],
      milestones: [
        { id: 'm-c1', label: 'Demise Certificate & Legal Heir Declaration Attached', labelKn: 'ಮರಣ ಪ್ರಮಾಣಪತ್ರ ಸಲ್ಲಿಕೆ', completed: true, date: '10 Sep 2026' },
        { id: 'm-c2', label: 'BPL Ration Card & Household Income Proof Verified', labelKn: 'ಬಿಪಿಎಲ್ ಪಡಿತರ ಚೀಟಿ ಪರಿಶೀಲನೆ', completed: true, date: '12 Sep 2026' },
        { id: 'm-c3', label: 'Village Accountant Mahajar & Ground Verification', labelKn: 'ಗ್ರಾಮ ಲೆಕ್ಕಿಗರ ಸ್ಥಳ ಮಹಜರು', completed: true, date: '19 Sep 2026' },
        { id: 'm-c4', label: 'Revenue Inspector Endorsement & Tahsildar Sanction', labelKn: 'ಕಂದಾಯ ನಿರೀಕ್ಷಕರ ಅನುಮೋದನೆ', completed: false, note: 'Under file movement' },
        { id: 'm-c5', label: 'Treasury e-Payment into Surviving Spouse Bank Account', labelKn: 'ಖಜಾನೆ ಇ-ಪಾವತಿ ಜಮೆ', completed: false },
      ],
      lastUpdate: '2026-09-23T16:00:00Z',
    },
  ];
}

// Helper to get tailored documentation updates for a given user type
export function getDocUpdatesForUserType(userType: UserType): DocumentationUpdateItem[] {
  if (userType === 'Farmer') {
    return [
      {
        id: 'doc-up-farmer-1',
        title: 'PMFBY Drone Survey Exemption for Waterlogged Taluks',
        titleKn: 'ಜಲಾವೃತ ಪ್ರದೇಶಗಳಲ್ಲಿ ಬೆಳೆ ಹಾನಿಗೆ ಡ್ರೋನ್ ಸಮೀಕ್ಷೆ ವಿನಾಯಿತಿ ಆದೇಶ',
        sourceOrIssuer: 'Ministry of Agriculture & Farmers Welfare, New Delhi',
        officialDomain: 'pmfby.gov.in',
        category: 'Gazette / Rule',
        dateUpdated: '2026-09-24',
        summaryText: 'Statutory circular eases loss assessment: In waterlogged taluks, geotagged photos uploaded by insured farmers via app are accepted as prima facie evidence.',
        summaryTextKn: 'ಅತಿವೃಷ್ಟಿ ಪೀಡಿತ ತಾಲೂಕುಗಳಲ್ಲಿ ರೈತರು ಅಪ್ಲೋಡ್ ಮಾಡಿದ ಜಿಯೋಟ್ಯಾಗ್ ಫೋಟೋಗಳನ್ನು ನೇರ ಸಾಕ್ಷಿಯಾಗಿ ಪರಿಗಣಿಸಲು ಸರ್ಕಾರ ಆದೇಶಿಸಿದೆ.',
        impactLevel: 'High',
        affectedProjects: ['PM Fasal Bima Yojana (72-Hour Rain Crop Loss Relief)'],
        actionPrompt: 'Ensure 3 high-resolution submerged crop photos from different angles are saved in Vault.',
        actionPromptKn: 'ಜಮೀನಿನ ೩ ಸ್ಪಷ್ಟ ಫೋಟೋಗಳು ನಿಮ್ಮ ವಾಲ್ಟ್‌ನಲ್ಲಿವೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        actionType: 'upload',
        userTypes: ['Farmer'],
      },
      {
        id: 'doc-up-farmer-2',
        title: 'Bhoomi RTC Land Records (Survey 142/2A) Synchronized',
        titleKn: 'ಭೂಮಿ ಪೋರ್ಟಲ್ ಆರ್‌ಟಿಸಿ (ಸರ್ವೆ ೧೪೨/೨ಎ) ದಾಖಲೆ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ',
        sourceOrIssuer: 'Bhoomi Online Land Records System, Govt of Karnataka',
        officialDomain: 'bhoomi.karnataka.gov.in',
        category: 'Direct Portal Sync',
        dateUpdated: '2026-09-25',
        summaryText: 'Digital signature on Pahani/RTC 142/2A updated with Kharif 2026 crop entry (Paddy). Automatically synchronized with NIRVAHA Citizen Vault.',
        summaryTextKn: '೨೦೨೬ ರ ಮುಂಗಾರು ಬೆಳೆ ನಮೂದಿನೊಂದಿಗೆ ನಿಮ್ಮ ಪಹಣಿ/ಆರ್‌ಟಿಸಿ ದಾಖಲೆಯು ಡಿಜಿಟಲ್ ಸಹಿಯೊಂದಿಗೆ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ.',
        impactLevel: 'Informational',
        affectedProjects: ['PM Fasal Bima Yojana (72-Hour Rain Crop Loss Relief)', 'PM-Kisan & Raitha Siri'],
        documentRef: 'Bhoomi_RTC_142_2A_Kharif2026.pdf',
        actionPrompt: 'RTC is current and verified. No re-upload required.',
        actionPromptKn: 'ಆರ್‌ಟಿಸಿ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದ್ದು, ಯಾವುದೇ ಹೊಸ ಕ್ರಮದ ಅಗತ್ಯವಿಲ್ಲ.',
        actionType: 'none',
        userTypes: ['Farmer'],
      },
      {
        id: 'doc-up-farmer-3',
        title: 'Kharif Minimum Support Price (MSP) & Input Relief Notification',
        titleKn: 'ಮುಂಗಾರು ಬೆಂಬಲ ಬೆಲೆ (ಎಂ.ಎಸ್.ಪಿ) ಮತ್ತು ಬೆಳೆ ನಷ್ಟ ಇನ್‌ಪುಟ್ ಸಬ್ಸಿಡಿ ಆದೇಶ',
        sourceOrIssuer: 'Karnataka State Disaster Management Authority & Agriculture Dept',
        officialDomain: 'raitamitra.karnataka.gov.in',
        category: 'Gazette / Rule',
        dateUpdated: '2026-09-20',
        summaryText: 'State cabinet approves ₹13,500/hectare immediate input subsidy for rain-affected paddy and ragi fields directly to bank accounts.',
        summaryTextKn: 'ಮಳೆಯಿಂದ ಹಾನಿಗೊಳಗಾದ ಭತ್ತ ಹಾಗೂ ರಾಗಿ ಬೆಳೆಗಳಿಗೆ ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ₹೧೩,೫೦೦ ತಕ್ಷಣದ ಇನ್‌ಪುಟ್ ಸಬ್ಸಿಡಿ ಮಂಜೂರು ಮಾಡಲಾಗಿದೆ.',
        impactLevel: 'High',
        affectedProjects: ['PM Fasal Bima Yojana (72-Hour Rain Crop Loss Relief)'],
        actionPrompt: 'Confirm bank DBT linking on Samrakshane portal.',
        actionPromptKn: 'ಸಂರಕ್ಷಣೆ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಕ್ರಿಯವಾಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        actionType: 're_verify',
        userTypes: ['Farmer'],
      },
    ];
  }

  if (userType === 'Student') {
    return [
      {
        id: 'doc-up-student-1',
        title: 'Karnataka SSP Post-Matric: Income Threshold Revised to ₹2.5 Lakh',
        titleKn: 'ಕರ್ನಾಟಕ ಎಸ್.ಎಸ್.ಪಿ: ಆದಾಯ ಮಿತಿ ₹೨.೫ ಲಕ್ಷಕ್ಕೆ ಹೆಚ್ಚಳ',
        sourceOrIssuer: 'Government of Karnataka Social Welfare Department Gazette',
        officialDomain: 'ssp.postmatric.karnataka.gov.in',
        category: 'Gazette / Rule',
        dateUpdated: '2026-09-24',
        summaryText: 'Official Gazette Notification #SWD-2026-44 raises the household income ceiling for Backward Classes (Cat-2A, 3A, 3B) from ₹1.5L to ₹2.5L for 2026-27 tuition reimbursement.',
        summaryTextKn: 'ಹಿಂದುಳಿದ ವರ್ಗಗಳ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಾಲೇಜು ಶುಲ್ಕ ಮರುಪಾವತಿಗೆ ಆದಾಯ ಮಿತಿಯನ್ನು ₹೨.೫ ಲಕ್ಷಕ್ಕೆ ಹೆಚ್ಚಿಸಿ ಸರ್ಕಾರ ಅಧಿಕೃತ ಗೆಜೆಟ್ ಆದೇಶ ಹೊರಡಿಸಿದೆ.',
        impactLevel: 'High',
        affectedProjects: ['Karnataka Student Fee Support Grant (SSP Post-Matric)'],
        actionPrompt: 'Check your RD Income Certificate bracket to confirm entitlement to 100% tuition refund.',
        actionPromptKn: 'ಶೇ ೧೦೦ ರಷ್ಟು ಶುಲ್ಕ ಮರುಪಾವತಿಗೆ ಅರ್ಹತೆ ಪಡೆಯಲು ನಿಮ್ಮ ಆದಾಯ ಪತ್ರದ ಮಿತಿ ಪರಿಶೀಲಿಸಿ.',
        actionType: 'read_gazette',
        userTypes: ['Student'],
      },
      {
        id: 'doc-up-student-2',
        title: 'College Bonafide & Attendance Certificate Officially Stamped',
        titleKn: 'ಕಾಲೇಜು ಬೋನಫೈಡ್ ಮತ್ತು ಹಾಜರಾತಿ ಪ್ರಮಾಣಪತ್ರ ಅಧಿಕೃತವಾಗಿ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ',
        sourceOrIssuer: 'College Registrar & Student Welfare Office',
        officialDomain: 'college.edu.in',
        category: 'Verification Status',
        dateUpdated: '2026-09-22',
        summaryText: 'College nodal officer stamped your Bonafide for Semester 3 with 86.4% verified attendance. Successfully linked with SSP Student ID 2026-0921.',
        summaryTextKn: 'ಕಾಲೇಜು ನೋಡಲ್ ಅಧಿಕಾರಿಯು ೩ನೇ ಸೆಮಿಸ್ಟರ್ ಬೋನಫೈಡ್ ಮತ್ತು ಶೇ ೮೬.೪ ಹಾಜರಾತಿಯನ್ನು ಅಧಿಕೃತವಾಗಿ ದೃಢೀಕರಿಸಿದ್ದಾರೆ.',
        impactLevel: 'Informational',
        affectedProjects: ['Karnataka Student Fee Support Grant (SSP Post-Matric)', 'Emergency College Tuition Hardship Relief Fund'],
        documentRef: 'College_Bonafide_Enrolment_2026.pdf',
        actionPrompt: 'Bonafide is active and locked in Citizen Vault. Valid for academic year 2026-27.',
        actionPromptKn: 'ಬೋನಫೈಡ್ ದಾಖಲೆ ಸುರಕ್ಷಿತವಾಗಿದ್ದು, ಮುಂದಿನ ಹಂತಕ್ಕೆ ಲಭ್ಯವಿದೆ.',
        actionType: 'none',
        userTypes: ['Student'],
      },
      {
        id: 'doc-up-student-3',
        title: 'Income & Caste Certificate (RD0038291024) Expiring in 45 Days',
        titleKn: 'ಆದಾಯ ಹಾಗೂ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ೪೫ ದಿನಗಳಲ್ಲಿ ಅವಧಿ ಮುಗಿಯಲಿದೆ',
        sourceOrIssuer: 'Nadakacheri Atalji Janasnehi Kendra Portal',
        officialDomain: 'nadakacheri.karnataka.gov.in',
        category: 'Certificate Expiry',
        dateUpdated: '2026-09-25',
        summaryText: 'Your current Nadakacheri Income Certificate expires on 15 Nov 2026. Ongoing and upcoming scholarship disbursements require a valid RD certificate for the financial year.',
        summaryTextKn: 'ನಿಮ್ಮ ಚಾಲ್ತಿ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರವು ೧೫ ನವೆಂಬರ್ ೨೦೨೬ ರಂದು ಮುಕ್ತಾಯಗೊಳ್ಳಲಿದೆ. ಮುಂಬರುವ ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ನವೀಕರಣ ಅತ್ಯಗತ್ಯ.',
        impactLevel: 'High',
        affectedProjects: ['Karnataka Student Fee Support Grant (SSP Post-Matric)'],
        rdNumber: 'RD0038291024',
        validUntil: '2026-11-15',
        actionPrompt: 'Trigger 1-click renewal draft on Seva Sindhu / Nadakacheri portal before expiry.',
        actionPromptKn: 'ಅವಧಿ ಮುಗಿಯುವ ಮುನ್ನ ಸೇವಾ ಸಿಂಧು ಮೂಲಕ ಹೊಸ ಆದಾಯ ಪತ್ರಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
        actionType: 'renew',
        userTypes: ['Student'],
      },
    ];
  }

  if (userType === 'Worker') {
    return [
      {
        id: 'doc-up-worker-1',
        title: 'e-Shram Portal: Aadhaar Re-validation Window Open',
        titleKn: 'ಇ-ಶ್ರಮ್ ಪೋರ್ಟಲ್: ಆಧಾರ್ ಮರುದೃಢೀಕರಣ ಅವಧಿ ಪ್ರಾರಂಭ',
        sourceOrIssuer: 'Ministry of Labour & Employment, Govt of India',
        officialDomain: 'eshram.gov.in',
        category: 'Gazette / Rule',
        dateUpdated: '2026-09-22',
        summaryText: 'Unorganized workers registered on e-Shram must verify active bank account seeding to receive automated ₹2 Lakh accidental insurance claims.',
        summaryTextKn: 'ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕರು ₹೨ ಲಕ್ಷ ಅಪಘಾತ ವಿಮೆ ರಕ್ಷಣೆ ಪಡೆಯಲು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿರುವುದನ್ನು ಪರಿಶೀಲಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ.',
        impactLevel: 'High',
        affectedProjects: ['Karnataka Building Workers (BOCW) Education Stipend for Wards'],
        actionPrompt: 'Check bank seeding in Citizen Vault to confirm active coverage.',
        actionPromptKn: 'ಸಿಟಿಜನ್ ವಾಲ್ಟ್‌ನಲ್ಲಿ ಬ್ಯಾಂಕ್ ಸೀಡಿಂಗ್ ಪರಿಶೀಲಿಸಿ.',
        actionType: 're_verify',
        userTypes: ['Worker'],
      },
    ];
  }

  // Senior Citizen / Other Default
  return [
    {
      id: 'doc-up-citizen-1',
      title: 'Seva Sindhu Family ID & BPL Ration Porting Order',
      titleKn: 'ಸೇವಾ ಸಿಂಧು ಕುಟುಂಬ ಐಡಿ ಮತ್ತು ಪಡಿತರ ಚೀಟಿ ಪೋರ್ಟಿಂಗ್ ಆದೇಶ',
      sourceOrIssuer: 'Department of Food, Civil Supplies & Consumer Affairs',
      officialDomain: 'sevasindhu.karnataka.gov.in',
      category: 'Gazette / Rule',
      dateUpdated: '2026-09-23',
      summaryText: 'All beneficiary families can now port their Fair Price Shop (FPS) allocation online without visiting the taluk food office in person.',
      summaryTextKn: 'ಪಡಿತರ ಚೀಟಿದಾರರು ತಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಯನ್ನು ಆನ್‌ಲೈನ್ ಮೂಲಕವೇ ಸುಲಭವಾಗಿ ಬದಲಾಯಿಸಿಕೊಳ್ಳಬಹುದು.',
      impactLevel: 'Informational',
      affectedProjects: ['National Family Benefit Scheme (NFBS Survivor Grant)'],
      actionPrompt: 'Use Seva Sindhu 1-click token to update fair price shop.',
      actionPromptKn: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಬದಲಾವಣೆಗೆ ಸೇವಾ ಸಿಂಧು ಬಳಸಿ.',
      actionType: 'none',
      userTypes: ['Citizen', 'Senior Citizen'],
    },
  ];
}

// Generate an empty clean profile based on chosen persona and user contact
export function createPersonaProfile(
  persona: UserType,
  name: string,
  email: string,
  phone: string,
  extraDetails: Record<string, any> = {}
): UserProfile {
  const baseProfile: UserProfile = {
    preferredName: name.trim() || (persona === 'Farmer' ? 'Ramesh Patil' : persona === 'Student' ? 'Priya Gowda' : 'Suresh K'),
    state: extraDetails.state || 'Karnataka',
    district: extraDetails.district || 'Bengaluru Rural',
    preferredLanguage: extraDetails.preferredLanguage || 'en',
    userType: persona,
    phone: phone || '+91 98450 12345',
    email: email || 'user@example.com',
    socialCategory: extraDetails.socialCategory || 'OBC',
    householdIncomeRange: extraDetails.householdIncomeRange || '₹1.5 Lakh - ₹2.5 Lakh per annum',
    rationCardType: extraDetails.rationCardType || 'BPL / PHH',
    bankAccountLinked: true,
    hasIncomeCertificate: 'yes',
    onboardingCompleted: true,
    termsAccepted: true,
  };

  if (persona === 'Farmer') {
    return {
      ...baseProfile,
      landholdingAcres: extraDetails.landholdingAcres || '3.5 Acres',
      surveyRtcNumber: extraDetails.surveyRtcNumber || 'Plot 142/2A',
      primaryCrops: extraDetails.primaryCrops || 'Paddy (Kharif) & Ragi',
      pmKisanId: extraDetails.pmKisanId || 'KA-2022-99120',
    };
  }

  if (persona === 'Student') {
    return {
      ...baseProfile,
      collegeName: extraDetails.collegeName || 'Government Science & Engineering College',
      course: extraDetails.course || 'B.E. / B.Sc Computer Science',
      yearOfStudy: extraDetails.yearOfStudy || '3rd Year (5th Semester)',
      cgpaOrPercentage: extraDetails.cgpaOrPercentage || '8.2 CGPA',
      studentRollNo: extraDetails.studentRollNo || '2024-ENGG-089',
      hasBonafideCertificate: 'yes',
      hasMarksCard: 'yes',
    };
  }

  if (persona === 'Worker') {
    return {
      ...baseProfile,
      occupationTrade: extraDetails.occupationTrade || 'Construction & Electrical Trades',
      eShramUan: extraDetails.eShramUan || '1009-8821-3321',
      bocwCardNo: extraDetails.bocwCardNo || 'BOCW-KA-88190',
      monthlyWages: extraDetails.monthlyWages || '₹14,000 / month',
    };
  }

  if (persona === 'Senior Citizen') {
    return {
      ...baseProfile,
      age: extraDetails.age || '64',
    };
  }

  if (persona === 'Person with Disability') {
    return {
      ...baseProfile,
      udidNumber: extraDetails.udidNumber || 'KA291048192019',
      disabilityType: extraDetails.disabilityType || 'Locomotor Impairment',
      disabilityPercent: extraDetails.disabilityPercent || '45%',
    };
  }

  return baseProfile;
}

export function buildProfileForPersona(
  persona: UserType,
  userDetails: { preferredName?: string; email?: string; phone?: string; [key: string]: any } = {}
): UserProfile {
  return createPersonaProfile(
    persona,
    userDetails.preferredName || '',
    userDetails.email || '',
    userDetails.phone || '',
    userDetails
  );
}

