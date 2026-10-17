// In-memory demo data fallback for cloud serverless (e.g. Vercel) when MongoDB Atlas is not yet connected
const defaultAdmin = {
  _id: '671234567890abcdef100001',
  name: 'Muhammad Huzaifa (Admin)',
  email: 'admin@appointment.com',
  phone: '+1 (555) 019-2834',
  role: 'admin',
  createdAt: new Date().toISOString()
};

const defaultUser = {
  _id: '671234567890abcdef100002',
  name: 'Michael Green',
  email: 'user@appointment.com',
  phone: '+1 (555) 748-9210',
  role: 'user',
  createdAt: new Date().toISOString()
};

let users = [defaultAdmin, defaultUser];

let providers = [
  {
    _id: '671234567890abcdef200001',
    name: 'Ahmed Barber',
    email: 'ahmed.barber@appointment.com',
    phone: '+1 (555) 234-5671',
    category: 'Barber',
    specialty: 'Master Barber & Beard Styling Expert',
    description: 'Over 10 years of experience in classic scissor cuts, precision fades, royal hot towel shaves, and modern beard detailing.',
    location: 'Downtown Center, Studio 4A, City Plaza',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 142,
    experience: '10+ years experience',
    workingHours: {
      start: '09:00 AM',
      end: '07:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    appointmentTypes: ['In Person']
  },
  {
    _id: '671234567890abcdef200002',
    name: 'Ali Hair Studio',
    email: 'ali.studio@appointment.com',
    phone: '+1 (555) 234-5672',
    category: 'Barber',
    specialty: 'Contemporary Styling & Keratin Treatment',
    description: 'Specialist in trendy hair transformations, creative skin fades, keratin blowouts, and scalp conditioning treatments.',
    location: 'West End Boulevard, Suite 12B',
    image: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 98,
    experience: '7 years experience',
    workingHours: {
      start: '10:00 AM',
      end: '08:00 PM',
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    appointmentTypes: ['In Person']
  },
  {
    _id: '671234567890abcdef200003',
    name: 'John Barber',
    email: 'john.barber@appointment.com',
    phone: '+1 (555) 234-5673',
    category: 'Barber',
    specialty: 'Vintage Hot Towel Shave & Scissor Craft',
    description: 'Traditional barbering heritage offering gentlemans grooming packages, razor edge line-ups, and rejuvenating scalp massages.',
    location: 'Heritage District, 88 Old Mill Way',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 175,
    experience: '12+ years experience',
    workingHours: {
      start: '08:30 AM',
      end: '06:30 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    appointmentTypes: ['In Person']
  },
  {
    _id: '671234567890abcdef200004',
    name: 'Dr. Ahmed',
    email: 'dr.ahmed@appointment.com',
    phone: '+1 (555) 345-6781',
    category: 'Clinic',
    specialty: 'Senior General Practitioner & Family Medicine',
    description: 'Board-certified medical doctor focusing on family wellness, preventive medicine, biometric diagnostic reviews, and chronic illness care.',
    location: 'City Health Medical Center, Block C, Room 204',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 210,
    experience: '15+ years experience',
    workingHours: {
      start: '09:00 AM',
      end: '05:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    appointmentTypes: ['In Person', 'Video Call']
  },
  {
    _id: '671234567890abcdef200005',
    name: 'Dr. Sarah',
    email: 'dr.sarah@appointment.com',
    phone: '+1 (555) 345-6782',
    category: 'Clinic',
    specialty: 'Dermatologist & Skin Health Specialist',
    description: 'Clinical dermatologist providing comprehensive treatments for acne, eczema, aesthetic skin therapies, and routine mole screenings.',
    location: 'Aesthetic & Skin Wellness Clinic, 42 Sunrise Ave',
    image: 'https://images.unsplash.com/photo-1594824813583-057088b90161?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 188,
    experience: '11 years experience',
    workingHours: {
      start: '10:00 AM',
      end: '06:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday']
    },
    appointmentTypes: ['In Person', 'Video Call']
  },
  {
    _id: '671234567890abcdef200006',
    name: 'Dr. John',
    email: 'dr.john@appointment.com',
    phone: '+1 (555) 345-6783',
    category: 'Clinic',
    specialty: 'Consultant Cardiologist & Heart Wellness',
    description: 'Cardiovascular physician with expertise in hypertension control, preventive cardiology, ECG stress testing, and lifestyle heart management.',
    location: 'Metropolitan Heart Pavilion, Wing 3B',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 165,
    experience: '18+ years experience',
    workingHours: {
      start: '08:00 AM',
      end: '04:00 PM',
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    appointmentTypes: ['In Person', 'Audio Call']
  },
  {
    _id: '671234567890abcdef200007',
    name: 'Muhammad',
    email: 'muhammad.tutor@appointment.com',
    phone: '+1 (555) 456-7891',
    category: 'Private Tutor',
    specialty: 'Advanced Mathematics & Calculus Tutor',
    description: 'Master in Pure Mathematics with over 8 years of proven experience helping high school and university students master Calculus, Linear Algebra, and Statistics.',
    location: 'University Academic Annex / Online Portal',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 134,
    experience: '8+ years experience',
    workingHours: {
      start: '02:00 PM',
      end: '09:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    appointmentTypes: ['In Person', 'Video Call']
  },
  {
    _id: '671234567890abcdef200008',
    name: 'Sarah',
    email: 'sarah.tutor@appointment.com',
    phone: '+1 (555) 456-7892',
    category: 'Private Tutor',
    specialty: 'English Literature & IELTS/TOEFL Coach',
    description: 'Certified Cambridge English language instructor helping university candidates excel in IELTS (Band 8+), academic research essay composition, and business communication.',
    location: 'Central Library Learning Hub / Online Portal',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 112,
    experience: '6 years experience',
    workingHours: {
      start: '11:00 AM',
      end: '07:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday']
    },
    appointmentTypes: ['In Person', 'Video Call']
  },
  {
    _id: '671234567890abcdef200009',
    name: 'Ali',
    email: 'ali.tutor@appointment.com',
    phone: '+1 (555) 456-7893',
    category: 'Private Tutor',
    specialty: 'Full-Stack Web Development & Data Structures',
    description: 'Senior software engineer and computer science instructor teaching JavaScript, React, Node.js, Python, and Object-Oriented Programming for university coursework.',
    location: 'Innovation Tech Hub, Lab 5 / Online Portal',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 156,
    experience: '9+ years experience',
    workingHours: {
      start: '01:00 PM',
      end: '09:00 PM',
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday']
    },
    appointmentTypes: ['Video Call', 'In Person']
  }
];

let services = [
  // Barber services
  {
    _id: '671234567890abcdef300001',
    name: 'Executive Scissor Haircut & Styling',
    category: 'Barber',
    description: 'Personalized scissor cut tailored to head shape, followed by warm lather neck shave and premium matte styling.',
    price: 30,
    duration: 35,
    providerId: '671234567890abcdef200001',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300002',
    name: 'Royal Hot Towel Straight Razor Shave',
    category: 'Barber',
    description: 'Multi-step pre-shave essential oils, steaming hot towels, close straight razor glide, and soothing aloe splash.',
    price: 25,
    duration: 30,
    providerId: '671234567890abcdef200001',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300003',
    name: 'Precision Fade & Beard Sculpting',
    category: 'Barber',
    description: 'Skin fade with clipper detailing, beard shaping with razor crisp perimeter, and organic beard oil treatment.',
    price: 45,
    duration: 50,
    providerId: '671234567890abcdef200002',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300004',
    name: 'Scalp Detox & Deep Conditioning',
    category: 'Barber',
    description: 'Exfoliating scalp treatment removing product buildup and revitalizing hair roots with scalp massage.',
    price: 35,
    duration: 30,
    providerId: '671234567890abcdef200003',
    image: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=600&q=80'
  },
  // Clinic services
  {
    _id: '671234567890abcdef300005',
    name: 'Comprehensive Doctor Consultation',
    category: 'Clinic',
    description: 'In-depth general physical examination, symptom evaluation, prescription renewal, and lab test orders.',
    price: 60,
    duration: 30,
    providerId: '671234567890abcdef200004',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300006',
    name: 'Annual Preventive Health Checkup',
    category: 'Clinic',
    description: 'Comprehensive biometric vital testing, cardiovascular risk screening, blood pressure, and BMI analysis.',
    price: 90,
    duration: 45,
    providerId: '671234567890abcdef200004',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300007',
    name: 'Dermatological Skin & Mole Review',
    category: 'Clinic',
    description: 'Dermoscopic evaluation of skin blemishes, rashes, eczema, acne consultation, and lesion monitoring.',
    price: 75,
    duration: 30,
    providerId: '671234567890abcdef200005',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300008',
    name: 'Cardiac Consultation & ECG Review',
    category: 'Clinic',
    description: 'Cardiovascular assessment, 12-lead ECG interpretation, hypertension management, and lifestyle counseling.',
    price: 110,
    duration: 40,
    providerId: '671234567890abcdef200006',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80'
  },
  // Tutor services
  {
    _id: '671234567890abcdef300009',
    name: 'Calculus I & II Masterclass Session',
    category: 'Private Tutor',
    description: 'Step-by-step problem-solving covering limits, derivatives, integrals, and exam preparation with custom practice sets.',
    price: 40,
    duration: 60,
    providerId: '671234567890abcdef200007',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300010',
    name: 'Linear Algebra & Discrete Math Coaching',
    category: 'Private Tutor',
    description: 'Matrices, vectors, eigenvalues, Boolean logic, proofs, and graph theory simplified for computer science students.',
    price: 45,
    duration: 60,
    providerId: '671234567890abcdef200007',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300011',
    name: 'IELTS Academic Writing & Speaking Prep',
    category: 'Private Tutor',
    description: 'Focused Task 1 & 2 essay review, live fluency simulation, vocabulary enrichment, and Band 7.5+ strategies.',
    price: 35,
    duration: 50,
    providerId: '671234567890abcdef200008',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: '671234567890abcdef300012',
    name: 'Full-Stack JavaScript & React Mentorship',
    category: 'Private Tutor',
    description: '1-on-1 practical code mentoring on React components, Node.js REST APIs, asynchronous programming, and university project debugging.',
    price: 50,
    duration: 60,
    providerId: '671234567890abcdef200009',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80'
  }
];

let bookings = [
  {
    _id: '671234567890abcdef400001',
    userId: defaultUser,
    providerId: providers[3], // Dr. Ahmed
    serviceId: services[4], // Consultation
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00 AM',
    price: 60,
    appointmentType: 'In Person',
    notes: 'Annual routine medical checkup',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  },
  {
    _id: '671234567890abcdef400002',
    userId: defaultUser,
    providerId: providers[0], // Ahmed Barber
    serviceId: services[0], // Scissor haircut
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '02:30 PM',
    price: 30,
    appointmentType: 'In Person',
    notes: 'Scissor fade on sides',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  users,
  providers,
  services,
  bookings
};
