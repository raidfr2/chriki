export interface AdminDocument {
  id: string;
  title: string;
  titleArabic?: string;
  titleFrench?: string;
  category: 'passport' | 'identity' | 'civil' | 'education' | 'health' | 'business' | 'other';
  requirements: string[];
  steps: string[];
  documents: string[];
  fees?: string;
  duration?: string;
  location?: string;
  notes?: string;
  keywords: string[]; // For search matching
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminDocumentCategory {
  id: string;
  name: string;
  nameArabic?: string;
  nameFrench?: string;
  description: string;
  icon: string;
}

export const DEFAULT_CATEGORIES: AdminDocumentCategory[] = [
  {
    id: 'passport',
    name: 'Passport & Travel',
    nameArabic: 'جواز السفر والسفر',
    nameFrench: 'Passeport et Voyage',
    description: 'Passport applications, renewals, and travel documents',
    icon: '🛂'
  },
  {
    id: 'identity',
    name: 'Identity Documents',
    nameArabic: 'وثائق الهوية',
    nameFrench: 'Documents d\'identité',
    description: 'National ID, birth certificates, family records',
    icon: '🆔'
  },
  {
    id: 'civil',
    name: 'Civil Status',
    nameArabic: 'الحالة المدنية',
    nameFrench: 'État Civil',
    description: 'Marriage, divorce, death certificates',
    icon: '📋'
  },
  {
    id: 'education',
    name: 'Education',
    nameArabic: 'التعليم',
    nameFrench: 'Éducation',
    description: 'School certificates, diplomas, transcripts',
    icon: '🎓'
  },
  {
    id: 'health',
    name: 'Health Services',
    nameArabic: 'الخدمات الصحية',
    nameFrench: 'Services de Santé',
    description: 'Medical certificates, health insurance',
    icon: '🏥'
  },
  {
    id: 'business',
    name: 'Business & Commerce',
    nameArabic: 'الأعمال والتجارة',
    nameFrench: 'Affaires et Commerce',
    description: 'Business licenses, commercial registration',
    icon: '🏢'
  },
  {
    id: 'other',
    name: 'Other Services',
    nameArabic: 'خدمات أخرى',
    nameFrench: 'Autres Services',
    description: 'Other government services and documents',
    icon: '📄'
  }
];

export const DEFAULT_DOCUMENTS: AdminDocument[] = [
  {
    id: 'passport-new',
    title: 'New Passport Application',
    titleArabic: 'طلب جواز سفر جديد',
    titleFrench: 'Demande de nouveau passeport',
    category: 'passport',
    requirements: [
      'Algerian nationality',
      'Valid national ID card (CIN)',
      'Birth certificate (less than 3 months old)',
      '2 recent passport photos (4.5x3.5cm)',
      'Proof of residence'
    ],
    steps: [
      'Fill out passport application form',
      'Gather required documents',
      'Visit passport office',
      'Submit application and pay fees',
      'Provide biometric data',
      'Wait for processing (10-15 days)',
      'Collect passport'
    ],
    documents: [
      'National ID Card (CIN)',
      'Birth Certificate',
      '2 Passport Photos',
      'Proof of Residence',
      'Application Form'
    ],
    fees: '6,000 DA',
    duration: '10-15 working days',
    location: 'Passport Office - Wilaya',
    notes: 'Minors need parental consent and presence',
    keywords: [
      'passport', 'جواز سفر', 'passeport',
      'new passport', 'جواز سفر جديد', 'nouveau passeport',
      'travel document', 'وثيقة سفر', 'document de voyage'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cin-new',
    title: 'National ID Card (CIN)',
    titleArabic: 'بطاقة التعريف الوطنية',
    titleFrench: 'Carte d\'identité nationale',
    category: 'identity',
    requirements: [
      'Algerian nationality',
      'Birth certificate',
      '2 recent photos',
      'Proof of residence'
    ],
    steps: [
      'Fill application form',
      'Prepare required documents',
      'Visit commune office',
      'Submit application',
      'Pay fees',
      'Wait for processing',
      'Collect CIN'
    ],
    documents: [
      'Birth Certificate',
      '2 Recent Photos',
      'Proof of Residence',
      'Application Form'
    ],
    fees: '200 DA',
    duration: '7-10 working days',
    location: 'Commune Office',
    notes: 'First CIN is free for citizens under 18',
    keywords: [
      'cin', 'بطاقة التعريف', 'carte identité',
      'national id', 'هوية وطنية', 'identité nationale',
      'identity card', 'بطاقة هوية', 'carte d\'identité'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate',
    titleArabic: 'شهادة الميلاد',
    titleFrench: 'Acte de naissance',
    category: 'civil',
    requirements: [
      'Valid ID of applicant or parent/guardian',
      'Proof of relationship (if applying for someone else)'
    ],
    steps: [
      'Visit civil status office',
      'Request birth certificate',
      'Provide identification',
      'Pay fees',
      'Receive certificate'
    ],
    documents: [
      'Valid ID Card',
      'Proof of Relationship (if applicable)'
    ],
    fees: '100 DA',
    duration: 'Same day',
    location: 'Civil Status Office - Commune',
    notes: 'Can be requested by parents, spouse, or legal guardian',
    keywords: [
      'birth certificate', 'شهادة الميلاد', 'acte de naissance',
      'birth record', 'سجل الميلاد', 'registre de naissance',
      'certificate', 'شهادة', 'certificat'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
