const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

dotenv.config();

const seedData = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appointment_booking'
    );
    console.log(`Connected to MongoDB for seeding: ${conn.connection.name}`);

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Provider.deleteMany(),
      Service.deleteMany(),
      Booking.deleteMany()
    ]);
    console.log('Cleared existing collections.');

    // 1. Create Default Admin & User
    const adminUser = await User.create({
      name: 'Muhammad Huzaifa (Admin)',
      email: 'admin@appointment.com',
      phone: '+1 (555) 019-2834',
      password: 'admin123',
      role: 'admin'
    });

    const studentUser = await User.create({
      name: 'Michael Green',
      email: 'user@appointment.com',
      phone: '+1 (555) 748-9210',
      password: 'user123',
      role: 'user'
    });

    console.log('✅ Created Default Users (admin@appointment.com / user@appointment.com)');

    // 2. Create Providers
    const providers = await Provider.insertMany([
      // BARBERS
      {
        name: 'Ahmed Barber',
        email: 'ahmed.barber@appointment.com',
        phone: '+1 (555) 234-5671',
        category: 'Barber',
        specialty: 'Master Barber & Beard Styling Expert',
        description:
          'Over 10 years of experience in classic scissor cuts, precision fades, royal hot towel shaves, and modern beard detailing.',
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
        name: 'Ali Hair Studio',
        email: 'ali.studio@appointment.com',
        phone: '+1 (555) 234-5672',
        category: 'Barber',
        specialty: 'Contemporary Styling & Keratin Treatment',
        description:
          'Specialist in trendy hair transformations, creative skin fades, keratin blowouts, and scalp conditioning treatments.',
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
        name: 'John Barber',
        email: 'john.barber@appointment.com',
        phone: '+1 (555) 234-5673',
        category: 'Barber',
        specialty: 'Vintage Hot Towel Shave & Scissor Craft',
        description:
          'Traditional barbering heritage offering gentlemans grooming packages, razor edge line-ups, and rejuvenating scalp massages.',
        location: 'Heritage District, 88 Old Mill Way',
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviewsCount: 175,
        experience: '12+ years experience',
        workingHours: {
          start: '09:00 AM',
          end: '06:00 PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        appointmentTypes: ['In Person']
      },

      // CLINIC / DOCTORS
      {
        name: 'Dr. Ahmed',
        email: 'dr.ahmed@appointment.com',
        phone: '+1 (555) 345-6781',
        category: 'Clinic',
        specialty: 'Senior Family Physician & Preventive Medicine',
        description:
          'Board-certified physician with extensive clinical expertise in comprehensive health screenings, cardiovascular risk management, and chronic disease care.',
        location: 'Apex Medical Center, Tower 1, Floor 3',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        rating: 5.0,
        reviewsCount: 220,
        experience: '14+ years experience',
        workingHours: {
          start: '08:30 AM',
          end: '04:30 PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        appointmentTypes: ['In Person', 'Video Call']
      },
      {
        name: 'Dr. Sarah',
        email: 'dr.sarah@appointment.com',
        phone: '+1 (555) 345-6782',
        category: 'Clinic',
        specialty: 'Dermatologist & Skin Health Specialist',
        description:
          'Expert dermatologist treating adolescent and adult acne, eczema, cosmetic skincare consultations, and advanced allergy evaluations.',
        location: 'Lotus Wellness & Skin Clinic, 204 Pine St',
        image: 'https://images.unsplash.com/photo-1594824813587-f27357640fa8?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviewsCount: 185,
        experience: '9 years experience',
        workingHours: {
          start: '09:00 AM',
          end: '05:00 PM',
          days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']
        },
        appointmentTypes: ['In Person', 'Video Call', 'Audio Call']
      },
      {
        name: 'Dr. John',
        email: 'dr.john@appointment.com',
        phone: '+1 (555) 345-6783',
        category: 'Clinic',
        specialty: 'Internal Medicine & Diagnostic Consultant',
        description:
          'Dedicated consultant providing in-depth physical examinations, routine lab test evaluations, and holistic health guidance for all age groups.',
        location: 'City General Health Complex, Wing B',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        reviewsCount: 160,
        experience: '11 years experience',
        workingHours: {
          start: '09:00 AM',
          end: '05:00 PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        appointmentTypes: ['In Person', 'Video Call']
      },

      // TUTORS
      {
        name: 'Muhammad',
        email: 'muhammad.tutor@appointment.com',
        phone: '+1 (555) 456-7891',
        category: 'Private Tutor',
        specialty: 'Calculus, Linear Algebra & High School Math',
        description:
          'Passionate mathematics educator with a proven track record of boosting student grades in GCSE, A-Levels, SAT Math, and University Calculus.',
        location: 'City Library Study Rooms & Online via Zoom',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        rating: 5.0,
        reviewsCount: 130,
        experience: '8+ years teaching',
        workingHours: {
          start: '10:00 AM',
          end: '08:00 PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        appointmentTypes: ['Video Call', 'In Person']
      },
      {
        name: 'Sarah',
        email: 'sarah.english@appointment.com',
        phone: '+1 (555) 456-7892',
        category: 'Private Tutor',
        specialty: 'English Literature, Academic Writing & IELTS Prep',
        description:
          'Certified linguistics instructor coaching IELTS candidates to Band 8+, essay writing excellence, and advanced conversational English proficiency.',
        location: 'Online Studio & Academic Hub Room 4',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviewsCount: 115,
        experience: '6 years teaching',
        workingHours: {
          start: '09:00 AM',
          end: '06:00 PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        appointmentTypes: ['Video Call', 'In Person', 'Audio Call']
      },
      {
        name: 'Ali',
        email: 'ali.programming@appointment.com',
        phone: '+1 (555) 456-7893',
        category: 'Private Tutor',
        specialty: 'Web Development, Python, JavaScript & DSA',
        description:
          'Senior software engineer and mentor guiding university students in Full-Stack MERN, Python fundamentals, Object-Oriented Programming, and Data Structures.',
        location: 'Innovation Campus Lab 2 & Remote Screen Share',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        rating: 5.0,
        reviewsCount: 195,
        experience: '7 years engineering & tutoring',
        workingHours: {
          start: '11:00 AM',
          end: '09:00 PM',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        appointmentTypes: ['Video Call', 'In Person']
      }
    ]);

    console.log(`✅ Created ${providers.length} Providers across 3 Categories`);

    // Helper map of providers
    const pMap = {};
    providers.forEach((p) => {
      pMap[p.name] = p._id;
    });

    // 3. Create Services
    const services = await Service.insertMany([
      // BARBER SERVICES
      {
        name: 'Signature Haircut & Wash',
        category: 'Barber',
        description: 'Complete consultation, precision haircut, refreshing shampoo wash, and finished with styling pomade.',
        price: 25,
        duration: 35,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Ahmed Barber']
      },
      {
        name: 'Royal Hot Towel Shave',
        category: 'Barber',
        description: 'Luxurious straight-razor shave with warm herbal towels, pre-shave essential oils, and soothing aloe balm.',
        price: 20,
        duration: 25,
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Ahmed Barber']
      },
      {
        name: 'Beard Trim & Precision Edge',
        category: 'Barber',
        description: 'Detailed beard sculpting, line-up with straight edge, organic beard oil treatment, and hot towel finish.',
        price: 18,
        duration: 20,
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Ali Hair Studio']
      },
      {
        name: 'Premium Haircut & Styling',
        category: 'Barber',
        description: 'Custom modern fade or scissor cut tailored to facial structure, blow-dry finish, and texture clay styling.',
        price: 30,
        duration: 40,
        image: 'https://images.unsplash.com/photo-1517832606589-7629c339590a?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Ali Hair Studio']
      },
      {
        name: 'Gentleman Grooming Combo (Cut + Shave)',
        category: 'Barber',
        description: 'Our all-inclusive package: signature haircut, hot towel straight shave, eyebrow trim, and scalp massage.',
        price: 40,
        duration: 55,
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['John Barber']
      },

      // CLINIC SERVICES
      {
        name: 'Doctor Consultation & Health Check',
        category: 'Clinic',
        description: 'Comprehensive general health review, vital signs check, symptom diagnosis, and customized medical advice.',
        price: 35,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Dr. Ahmed']
      },
      {
        name: 'Comprehensive Routine Checkup',
        category: 'Clinic',
        description: 'Full-body wellness assessment, blood pressure & glucose screening, BMI evaluation, and lifestyle counseling.',
        price: 50,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Dr. Ahmed']
      },
      {
        name: 'Dermatology & Skin Consultation',
        category: 'Clinic',
        description: 'Specialist examination of skin conditions, acne management, rash diagnosis, and targeted prescription regimens.',
        price: 45,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1594824813587-f27357640fa8?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Dr. Sarah']
      },
      {
        name: 'General Medical Appointment & Lab Review',
        category: 'Clinic',
        description: 'Evaluation of medical reports, follow-up consultations, and prescription renewals.',
        price: 30,
        duration: 25,
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Dr. John']
      },

      // TUTOR SERVICES
      {
        name: 'Mathematics Mastery (Calculus & Algebra)',
        category: 'Private Tutor',
        description: 'One-on-one tailored coaching in university calculus, linear algebra, exam problem-solving techniques, and homework reviews.',
        price: 25,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Muhammad']
      },
      {
        name: 'Physics & Advanced Science Tutoring',
        category: 'Private Tutor',
        description: 'Conceptual breakdown of classical mechanics, thermodynamics, and laboratory assignment assistance.',
        price: 28,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Muhammad']
      },
      {
        name: 'English Literature & Academic Essay Writing',
        category: 'Private Tutor',
        description: 'Structuring thesis papers, MLA/APA citations, critical literary analysis, and vocabulary enrichment.',
        price: 22,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Sarah']
      },
      {
        name: 'IELTS / TOEFL Intensive Preparation',
        category: 'Private Tutor',
        description: 'Speaking mock tests, listening tactics, writing task 1 & 2 reviews, and reading speed strategies.',
        price: 30,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Sarah']
      },
      {
        name: 'Full-Stack Web Development & JavaScript',
        category: 'Private Tutor',
        description: 'Hands-on coding session in React, Node.js, Express, MongoDB, RESTful APIs, Git, and responsive CSS.',
        price: 35,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Ali']
      },
      {
        name: 'Python & Data Structures Coaching',
        category: 'Private Tutor',
        description: 'Master core algorithms, arrays, linked lists, trees, recursion, and LeetCode problem solving.',
        price: 30,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80',
        providerId: pMap['Ali']
      }
    ]);

    console.log(`✅ Created ${services.length} Services`);

    // 4. Create Initial Bookings to showcase the dashboard & slot blocking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    const pastDateStr = pastDate.toISOString().split('T')[0];

    await Booking.insertMany([
      {
        userId: studentUser._id,
        providerId: pMap['Ahmed Barber'],
        serviceId: services[0]._id, // Signature Haircut & Wash ($25)
        date: tomorrowStr,
        time: '11:00 AM',
        price: 25,
        appointmentType: 'In Person',
        notes: 'Classic side part haircut, clean fade',
        status: 'Confirmed',
        bookingCode: 'BK-1001'
      },
      {
        userId: studentUser._id,
        providerId: pMap['Dr. Ahmed'],
        serviceId: services[5]._id, // Doctor Consultation ($35)
        date: tomorrowStr,
        time: '02:00 PM',
        price: 35,
        appointmentType: 'Video Call',
        notes: 'Routine seasonal checkup and blood pressure review',
        status: 'Confirmed',
        bookingCode: 'BK-1002'
      },
      {
        userId: studentUser._id,
        providerId: pMap['Ali'],
        serviceId: services[13]._id, // Full-Stack Web Development ($35)
        date: dayAfterStr,
        time: '10:00 AM',
        price: 35,
        appointmentType: 'Video Call',
        notes: 'Review university project architecture and API integration',
        status: 'Confirmed',
        bookingCode: 'BK-1003'
      },
      {
        userId: studentUser._id,
        providerId: pMap['Dr. Sarah'],
        serviceId: services[7]._id, // Dermatology Consultation ($45)
        date: pastDateStr,
        time: '03:30 PM',
        price: 45,
        appointmentType: 'In Person',
        notes: 'Dry skin treatment consultation',
        status: 'Completed',
        bookingCode: 'BK-1004'
      }
    ]);

    console.log('✅ Created 4 Sample Appointments (Confirmed & Completed)');
    console.log('🎉 Seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
