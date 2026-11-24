// Built-in verified mock data engine for instant zero-lag rendering on Vercel and offline mode

const categories = [
  { _id: 'cat_1', name: 'Engineering', slug: 'engineering', icon: 'Cpu', description: 'B.Tech, M.Tech, and specialized technical diplomas', order: 1, isActive: true },
  { _id: 'cat_2', name: 'Computer Applications', slug: 'computer-applications', icon: 'Terminal', description: 'BCA, MCA, Software and IT technology courses', order: 2, isActive: true },
  { _id: 'cat_3', name: 'Management', slug: 'management', icon: 'Briefcase', description: 'BBA, MBA, PGDM, and Executive Business leadership programs', order: 3, isActive: true },
  { _id: 'cat_4', name: 'Medical', slug: 'medical', icon: 'Stethoscope', description: 'MBBS, BDS, and clinical healthcare specialties', order: 4, isActive: true },
  { _id: 'cat_5', name: 'Science', slug: 'science', icon: 'Atom', description: 'B.Sc, M.Sc, Biotechnology, and fundamental sciences', order: 5, isActive: true },
  { _id: 'cat_6', name: 'Commerce', slug: 'commerce', icon: 'BadgePercent', description: 'B.Com, M.Com, CA, Banking and Accounting qualifications', order: 6, isActive: true },
  { _id: 'cat_7', name: 'Law', slug: 'law', icon: 'Scale', description: 'BA LLB, BBA LLB, LLM, and Corporate legal practice', order: 7, isActive: true },
  { _id: 'cat_8', name: 'Pharmacy', slug: 'pharmacy', icon: 'Pill', description: 'B.Pharm, M.Pharm, and Pharmaceutical research', order: 8, isActive: true },
  { _id: 'cat_9', name: 'Nursing', slug: 'nursing', icon: 'HeartPulse', description: 'B.Sc Nursing, GNM, and critical clinical healthcare training', order: 9, isActive: true },
  { _id: 'cat_10', name: 'Design', slug: 'design', icon: 'Palette', description: 'B.Des, M.Des, Fashion, UI/UX, and Visual Communication', order: 10, isActive: true },
  { _id: 'cat_11', name: 'Arts and Humanities', slug: 'arts-humanities', icon: 'BookOpen', description: 'BA, MA, Journalism, Psychology, and Social Sciences', order: 11, isActive: true },
  { _id: 'cat_12', name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'B.Ed, M.Ed, and Teacher Training certifications', order: 12, isActive: true },
  { _id: 'cat_13', name: 'Agriculture', slug: 'agriculture', icon: 'Sprout', description: 'B.Sc Agriculture, Agronomy, and Agribusiness', order: 13, isActive: true },
  { _id: 'cat_14', name: 'Hotel Management', slug: 'hotel-management', icon: 'Utensils', description: 'BHM, Culinary Arts, and Global Hospitality Management', order: 14, isActive: true },
];

const courses = [
  {
    _id: 'course_1',
    name: 'B.Tech in Computer Science & Engineering',
    slug: 'btech-computer-science-engineering',
    category: { _id: 'cat_1', name: 'Engineering', slug: 'engineering' },
    level: 'Undergraduate',
    duration: '4 Years',
    eligibility: '10+2 with Physics, Mathematics & Chemistry (Min 60%)',
    admissionRequirements: 'JEE Main or University Entrance Examination score',
    specializations: ['Artificial Intelligence', 'Data Science', 'Cybersecurity', 'Cloud Computing'],
    overview: 'Comprehensive four-year degree program providing rigorous foundations in computer architecture, algorithmic engineering, software development, and artificial intelligence.',
    careerOpportunities: ['Software Engineer', 'AI Specialist', 'Cloud Architect', 'Cybersecurity Analyst'],
    averageFeeRange: { min: 120000, max: 350000, currency: 'INR' },
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_2',
    name: 'B.Tech in Artificial Intelligence & Machine Learning',
    slug: 'btech-ai-machine-learning',
    category: { _id: 'cat_1', name: 'Engineering', slug: 'engineering' },
    level: 'Undergraduate',
    duration: '4 Years',
    eligibility: '10+2 with PCM (Min 60% aggregate)',
    specializations: ['Deep Learning', 'Computer Vision', 'Natural Language Processing'],
    overview: 'Specialized engineering curriculum tailored specifically for intelligent systems, neural networks, predictive modelling, and autonomous automation.',
    careerOpportunities: ['Machine Learning Engineer', 'Data Scientist', 'AI Researcher'],
    averageFeeRange: { min: 140000, max: 380000, currency: 'INR' },
    entranceExams: ['JEE Main', 'VITEEE'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_3',
    name: 'Bachelor of Computer Applications (BCA)',
    slug: 'bachelor-of-computer-applications-bca',
    category: { _id: 'cat_2', name: 'Computer Applications', slug: 'computer-applications' },
    level: 'Undergraduate',
    duration: '3 Years',
    eligibility: '10+2 in any stream (Mathematics preferred) with min 50%',
    specializations: ['Full Stack Web Development', 'Mobile App Development', 'Cloud Computing'],
    overview: 'Popular undergraduate program providing direct practical skills in modern programming languages, database architecture, and web systems.',
    careerOpportunities: ['Frontend Developer', 'Backend Developer', 'System Administrator', 'Software Tester'],
    averageFeeRange: { min: 60000, max: 180000, currency: 'INR' },
    entranceExams: ['CUET', 'IPU CET'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_4',
    name: 'Master of Computer Applications (MCA)',
    slug: 'master-of-computer-applications-mca',
    category: { _id: 'cat_2', name: 'Computer Applications', slug: 'computer-applications' },
    level: 'Postgraduate',
    duration: '2 Years',
    eligibility: 'Graduation in BCA/B.Sc IT or graduation with Math at 10+2',
    specializations: ['Enterprise Applications', 'AI & Machine Learning', 'DevOps & Cloud'],
    overview: 'Two-year professional master program bridging core computer science concepts with industrial software engineering practices.',
    averageFeeRange: { min: 80000, max: 220000, currency: 'INR' },
    entranceExams: ['NIMCET', 'MAH MCA CET'],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: 'course_5',
    name: 'Bachelor of Business Administration (BBA)',
    slug: 'bachelor-of-business-administration-bba',
    category: { _id: 'cat_3', name: 'Management', slug: 'management' },
    level: 'Undergraduate',
    duration: '3 Years',
    eligibility: '10+2 in any discipline with min 50%',
    specializations: ['Marketing', 'Finance', 'Human Resources', 'International Business'],
    overview: 'Premier undergraduate business program imparting essential principles of organizational leadership, marketing strategy, accounting, and entrepreneurship.',
    careerOpportunities: ['Business Analyst', 'Marketing Associate', 'HR Executive', 'Management Trainee'],
    averageFeeRange: { min: 80000, max: 250000, currency: 'INR' },
    entranceExams: ['IPU CET', 'SET', 'CUET'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_6',
    name: 'Master of Business Administration (MBA)',
    slug: 'master-of-business-administration-mba',
    category: { _id: 'cat_3', name: 'Management', slug: 'management' },
    level: 'Postgraduate',
    duration: '2 Years',
    eligibility: 'Graduation in any stream with min 50%',
    specializations: ['Finance', 'Marketing', 'Operations', 'Business Analytics', 'Digital Marketing'],
    overview: 'Globally recognized flagship management degree equipping future corporate leaders with strategic acumen, financial literacy, and organizational mastery.',
    careerOpportunities: ['Investment Banker', 'Product Manager', 'Management Consultant', 'Brand Manager'],
    averageFeeRange: { min: 250000, max: 1200000, currency: 'INR' },
    entranceExams: ['CAT', 'XAT', 'MAT', 'CMAT', 'SNAP'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_7',
    name: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
    slug: 'mbbs-medicine-surgery',
    category: { _id: 'cat_4', name: 'Medical', slug: 'medical' },
    level: 'Undergraduate',
    duration: '5.5 Years',
    eligibility: '10+2 with Physics, Chemistry, Biology (Min 50%) & NEET qualified',
    admissionRequirements: 'NEET UG merit counseling rank',
    specializations: ['Clinical Medicine', 'General Surgery', 'Pediatrics'],
    overview: 'The primary medical degree in India that trains future physicians and surgeons with extensive clinical rotations, anatomy dissections, and hospital residency.',
    careerOpportunities: ['Medical Officer', 'General Physician', 'Resident Surgeon', 'Medical Specialist'],
    averageFeeRange: { min: 80000, max: 1500000, currency: 'INR' },
    entranceExams: ['NEET UG'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_8',
    name: 'B.Sc Nursing',
    slug: 'bsc-nursing',
    category: { _id: 'cat_9', name: 'Nursing', slug: 'nursing' },
    level: 'Undergraduate',
    duration: '4 Years',
    eligibility: '10+2 with PCB (Min 45%)',
    specializations: ['Critical Care', 'Pediatric Nursing', 'Operation Theatre Care'],
    overview: 'Healthcare bachelor degree emphasizing clinical patient care, bedside therapeutics, pharmacotherapy, and emergency triage.',
    averageFeeRange: { min: 70000, max: 180000, currency: 'INR' },
    entranceExams: ['NEET UG', 'State Nursing CET'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_9',
    name: 'BA LLB (Integrated Law)',
    slug: 'ba-llb-integrated',
    category: { _id: 'cat_7', name: 'Law', slug: 'law' },
    level: 'Undergraduate',
    duration: '5 Years',
    eligibility: '10+2 in any stream (Min 45%)',
    specializations: ['Corporate Law', 'Criminal Law', 'Constitutional Law', 'Cyber Law'],
    overview: 'Five-year integrated dual degree merging arts disciplines with comprehensive legal jurisprudence, moot courts, and legal drafting.',
    careerOpportunities: ['Corporate Advocate', 'Legal Counsel', 'Judicial Magistrate', 'Civil Rights Attorney'],
    averageFeeRange: { min: 90000, max: 320000, currency: 'INR' },
    entranceExams: ['CLAT', 'AILET', 'LSAT India'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'course_10',
    name: 'Bachelor of Pharmacy (B.Pharm)',
    slug: 'bachelor-of-pharmacy-bpharm',
    category: { _id: 'cat_8', name: 'Pharmacy', slug: 'pharmacy' },
    level: 'Undergraduate',
    duration: '4 Years',
    eligibility: '10+2 with Physics, Chemistry, Biology/Math',
    specializations: ['Pharmacology', 'Pharmaceutical Chemistry', 'Clinical Trials'],
    overview: 'Rigorous degree covering drug synthesis, medicinal chemistry, pharmaceutical formulation, and drug dispensing regulations.',
    averageFeeRange: { min: 80000, max: 220000, currency: 'INR' },
    entranceExams: ['State CET', 'GPAT'],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: 'course_11',
    name: 'Bachelor of Design (B.Des)',
    slug: 'bachelor-of-design-bdes',
    category: { _id: 'cat_10', name: 'Design', slug: 'design' },
    level: 'Undergraduate',
    duration: '4 Years',
    eligibility: '10+2 in any stream',
    specializations: ['UI/UX Interaction Design', 'Product Design', 'Fashion Design'],
    overview: 'Creative design degree nurturing aesthetic sensitivity, human-centered ergonomics, 3D prototyping, and digital interface architecture.',
    averageFeeRange: { min: 120000, max: 400000, currency: 'INR' },
    entranceExams: ['NID DAT', 'UCEED', 'NIFT'],
    isFeatured: true,
    isPublished: true,
  },
];

const universities = [
  {
    _id: 'uni_1',
    name: 'Delhi Technological University (DTU)',
    slug: 'delhi-technological-university',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
    location: { address: 'Shahbad Daulatpur, Main Bawana Road', city: 'New Delhi', state: 'Delhi', country: 'India', pinCode: '110042' },
    universityType: 'Government',
    establishedYear: 1941,
    accreditation: ['NAAC A++', 'NIRF Ranked #29', 'AICTE Approved', 'UGC Recognized'],
    website: 'http://www.dtu.ac.in',
    contactInfo: { email: 'academic@dtu.ac.in', phone: '+91 11 27871018', helpline: '1800-11-2026' },
    about: 'Delhi Technological University is an iconic public technical university in Delhi, celebrated for superior engineering education, cutting-edge research laboratories, and sterling campus placements.',
    facilities: ['Central Library', 'Hostels', 'High-Speed Wi-Fi', 'Sports Complex', 'Incubation Center'],
    placementOverview: { averagePackage: '₹ 15.6 LPA', highestPackage: '₹ 1.2 CPA', placementRate: '95%', topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'Amazon'] },
    rating: 4.8,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_2',
    name: 'Vellore Institute of Technology (VIT)',
    slug: 'vellore-institute-of-technology',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
    location: { address: 'Vellore Campus, Tiruvalam Road', city: 'Vellore', state: 'Tamil Nadu', country: 'India', pinCode: '632014' },
    universityType: 'Private',
    establishedYear: 1984,
    accreditation: ['NAAC A++', 'IoE Status', 'ABET Accredited', 'NIRF Ranked #11'],
    website: 'https://vit.ac.in',
    contactInfo: { email: 'admission@vit.ac.in', phone: '+91 416 2243091', helpline: '0416-2202020' },
    about: 'VIT is recognized as an Institution of Eminence (IoE) by the Government of India. It provides world-class technical education, flexible credit systems, and global exposure.',
    facilities: ['Smart Classrooms', 'Olympic Size Pool', 'Food Courts', '24x7 Medical Hospital'],
    placementOverview: { averagePackage: '₹ 9.2 LPA', highestPackage: '₹ 1.02 CPA', placementRate: '92%', topRecruiters: ['Microsoft', 'Cognizant', 'Deloitte', 'PayPal'] },
    rating: 4.7,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_3',
    name: 'BITS Pilani',
    slug: 'bits-pilani',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=400&fit=crop',
    location: { address: 'Vidya Vihar Campus', city: 'Pilani', state: 'Rajasthan', country: 'India', pinCode: '333031' },
    universityType: 'Deemed',
    establishedYear: 1964,
    accreditation: ['NAAC A', 'Institution of Eminence', 'NIRF Ranked #20'],
    website: 'https://www.bits-pilani.ac.in',
    contactInfo: { email: 'admissions@pilani.bits-pilani.ac.in', phone: '+91 1596 242205', helpline: '01596-242205' },
    about: 'BITS Pilani is an iconic private institute celebrated for zero-attendance policy, Practice School internship model, and strong startup culture.',
    facilities: ['Practice School Stations', 'Hardware Labs', 'Open Air Theatre', 'Sports Complexes'],
    placementOverview: { averagePackage: '₹ 19.8 LPA', highestPackage: '₹ 1.33 CPA', placementRate: '98%', topRecruiters: ['Google', 'DE Shaw', 'Uber', 'Nvidia'] },
    rating: 4.9,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_4',
    name: 'Symbiosis International University (SIU)',
    slug: 'symbiosis-international-university',
    logo: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop',
    location: { address: 'Gram Lavale, Taluka Mulshi', city: 'Pune', state: 'Maharashtra', country: 'India', pinCode: '412115' },
    universityType: 'Deemed',
    establishedYear: 1971,
    accreditation: ['NAAC A++', 'NIRF Ranked #32', 'UGC Approved'],
    website: 'https://siu.edu.in',
    contactInfo: { email: 'info@siu.edu.in', phone: '+91 20 28116200', helpline: '1800-123-456' },
    about: 'Symbiosis International is renowned for benchmark education in Management (SIBM), Law (SLS), Computer Studies (SICSR), and Media.',
    facilities: ['Auditoriums', 'Hillside Campus', 'Gymnasium & Yoga Hall', 'Digital Media Studios'],
    placementOverview: { averagePackage: '₹ 18.2 LPA', highestPackage: '₹ 45.5 LPA', placementRate: '96%', topRecruiters: ['McKinsey', 'PwC', 'ITC', 'Barclays'] },
    rating: 4.8,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_5',
    name: 'Amity University, Noida',
    slug: 'amity-university-noida',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&h=400&fit=crop',
    location: { address: 'Sector 125, Expressway', city: 'Noida', state: 'Uttar Pradesh', country: 'India', pinCode: '201313' },
    universityType: 'Private',
    establishedYear: 2005,
    accreditation: ['NAAC A+', 'NIRF Ranked #35', 'WASC USA Accredited'],
    website: 'https://www.amity.edu',
    contactInfo: { email: 'admissions@amity.edu', phone: '+91 120 2445252', helpline: '0120-2445252' },
    about: 'Amity University is a prominent private research university featuring state-of-the-art infrastructure, over 300 academic programs, and extensive industry tie-ups.',
    facilities: ['Central Research Facility', 'Moot Court', 'On-Campus Hostels', 'Studio Floors'],
    placementOverview: { averagePackage: '₹ 6.2 LPA', highestPackage: '₹ 38 LPA', placementRate: '88%', topRecruiters: ['HCL', 'Wipro', 'Capgemini', 'IBM'] },
    rating: 4.4,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_6',
    name: 'National Law School of India University (NLSIU)',
    slug: 'nlsiu-bangalore',
    logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=400&fit=crop',
    location: { address: 'Gnana Bharathi Main Road, Nagarbhavi', city: 'Bangalore', state: 'Karnataka', country: 'India', pinCode: '560072' },
    universityType: 'Government',
    establishedYear: 1987,
    accreditation: ['NIRF Ranked #1 (Law)', 'BCI Approved', 'National Law University'],
    website: 'https://www.nls.ac.in',
    contactInfo: { email: 'registrar@nls.ac.in', phone: '+91 80 23213160', helpline: '080-23213160' },
    about: 'The premier National Law University in India and pioneer of integrated five-year legal education, producing leading advocates, judges, and corporate law partners.',
    facilities: ['Memorial Law Library', 'Moot Court Complex', 'Residential Halls'],
    placementOverview: { averagePackage: '₹ 16.5 LPA', highestPackage: '₹ 24 LPA', placementRate: '100%', topRecruiters: ['Shardul Amarchand Mangaldas', 'Trilegal', 'Khaitan & Co'] },
    rating: 4.9,
    isFeatured: true,
    isPublished: true,
  },
];

const services = [
  {
    _id: 'serv_1',
    title: 'Career Counselling',
    slug: 'career-counselling',
    icon: 'Compass',
    shortDescription: 'Scientific psychometric assessment and 1-on-1 career mapping to discover your authentic professional calling.',
    fullDescription: 'Our certified career counsellors evaluate your academic strengths, personality drivers, and long-term career aspirations to identify the optimal career pathway.',
    benefits: ['Clarity on strengths and aptitude', 'Objective psychometric insights', 'Personalized roadmap for 5-10 years'],
    isPublished: true,
    order: 1,
  },
  {
    _id: 'serv_2',
    title: 'Course Selection Guidance',
    slug: 'course-selection-guidance',
    icon: 'BookOpen',
    shortDescription: 'Comprehensive curriculum analysis comparing emerging vs evergreen degrees to secure peak career placements.',
    fullDescription: 'Make data-backed decisions between traditional streams and high-growth specializations like AI, FinTech, and Corporate Law.',
    benefits: ['Curriculum breakdown', '5-year industry hiring trends', 'ROI comparison'],
    isPublished: true,
    order: 2,
  },
  {
    _id: 'serv_3',
    title: 'University Shortlisting',
    slug: 'university-shortlisting',
    icon: 'Building2',
    shortDescription: 'Curated Dream, Reach, and Safe college matrices matched to your cutoff scores, budget, and location preferences.',
    fullDescription: 'Avoid unverified promises with objective benchmarking across NIRF ranks, NAAC accreditations, and verified placement packages.',
    benefits: ['Balanced portfolio of universities', 'Cutoff match guarantees', 'Elimination of hidden charges'],
    isPublished: true,
    order: 3,
  },
  {
    _id: 'serv_4',
    title: 'Application Assistance',
    slug: 'application-assistance',
    icon: 'FileText',
    shortDescription: 'Flawless form filing, document verification, and SOP assistance to eliminate university rejection risks.',
    fullDescription: 'End-to-end management of complex multi-university application portals and institutional counseling windows.',
    benefits: ['Zero-error application guarantee', 'Statement of Purpose (SOP) editing', 'Deadline monitoring'],
    isPublished: true,
    order: 4,
  },
  {
    _id: 'serv_5',
    title: 'Entrance Exam Guidance',
    slug: 'entrance-exam-guidance',
    icon: 'GraduationCap',
    shortDescription: 'Test alerts, syllabus breakdowns, mock analysis, and scoring strategies for JEE, NEET, CAT, CUET, and CLAT.',
    fullDescription: 'Strategic preparation roadmaps, cutoffs analysis, and guidance on optimal attempts across national entrance examinations.',
    benefits: ['Exam date alerts', 'Subject-wise weightage analysis', 'Rank vs percentile projections'],
    isPublished: true,
    order: 5,
  },
  {
    _id: 'serv_6',
    title: 'Scholarship Assistance',
    slug: 'scholarship-assistance',
    icon: 'Award',
    shortDescription: 'Unlock institutional merit scholarships, defense wards concessions, and state government education grants.',
    fullDescription: 'Access over 50+ crore worth of verified scholarship schemes to minimize your family financial burden.',
    benefits: ['Direct fee concession up to 100%', 'Corporate CSR scholarship grants', 'Merit-cum-means assistance'],
    isPublished: true,
    order: 6,
  },
];

const exams = [
  {
    _id: 'exam_1',
    name: 'JEE Main (Joint Entrance Examination)',
    slug: 'jee-main',
    conductingBody: 'National Testing Agency (NTA)',
    examLevel: 'National',
    stream: 'Engineering',
    overview: 'National flagship computer-based examination for admissions to NITs, IIITs, CFTIs, and qualification benchmark for JEE Advanced.',
    eligibility: 'Passed 10+2 with Physics, Chemistry, and Mathematics.',
    examPattern: { mode: 'Computer Based Test (CBT)', duration: '3 Hours', totalQuestions: '90 Questions (75 to attempt)' },
    participatingUniversities: ['Delhi Technological University', 'NIT Trichy', 'BITS Pilani', 'Thapar Institute'],
    isPublished: true,
  },
  {
    _id: 'exam_2',
    name: 'NEET UG (National Eligibility cum Entrance Test)',
    slug: 'neet-ug',
    conductingBody: 'National Testing Agency (NTA)',
    examLevel: 'National',
    stream: 'Medical',
    overview: 'Single nationwide uniform entrance examination for admissions to MBBS, BDS, BAMS, BHMS, and allied healthcare courses throughout India.',
    eligibility: '10+2 with Physics, Chemistry, Biology with min 50% for general category.',
    examPattern: { mode: 'Pen and Paper (OMR)', duration: '3 Hours 20 Minutes', totalQuestions: '200 Questions (180 to attempt)' },
    participatingUniversities: ['AIIMS New Delhi', 'CMC Vellore', 'MAHE Manipal'],
    isPublished: true,
  },
  {
    _id: 'exam_3',
    name: 'CAT (Common Admission Test)',
    slug: 'cat-exam',
    conductingBody: 'Rotational Indian Institutes of Management (IIMs)',
    examLevel: 'National',
    stream: 'Management',
    overview: 'India’s most competitive computer-based MBA admission test evaluating quantitative capability, data interpretation, and verbal aptitude.',
    eligibility: 'Bachelor degree in any discipline with at least 50% marks.',
    examPattern: { mode: 'Computer Based Test (CBT)', duration: '2 Hours', totalQuestions: '66 Questions' },
    participatingUniversities: ['IIM Ahmedabad', 'IIM Bangalore', 'Symbiosis SIU'],
    isPublished: true,
  },
  {
    _id: 'exam_4',
    name: 'CLAT (Common Law Admission Test)',
    slug: 'clat-exam',
    conductingBody: 'Consortium of National Law Universities',
    examLevel: 'National',
    stream: 'Law',
    overview: 'Centralized national test for admission to 24 prestigious National Law Universities for 5-year integrated BA LLB and LLM degrees.',
    eligibility: '10+2 with minimum 45% marks for undergraduate law.',
    examPattern: { mode: 'Offline OMR Format', duration: '2 Hours', totalQuestions: '120 Reading-Comprehension Questions' },
    participatingUniversities: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'WBNUJS Kolkata'],
    isPublished: true,
  },
  {
    _id: 'exam_5',
    name: 'CUET UG (Common University Entrance Test)',
    slug: 'cuet-ug',
    conductingBody: 'National Testing Agency (NTA)',
    examLevel: 'National',
    stream: 'All Streams',
    overview: 'Standardized national examination for admission into undergraduate degrees across all Central and premier Private universities.',
    eligibility: 'Passed Class 12 or appearing.',
    examPattern: { mode: 'Hybrid / Computer Based Test', duration: '45-60 min per subject', totalQuestions: '50 questions per domain' },
    participatingUniversities: ['University of Delhi', 'BHU', 'Jamia Millia Islamia'],
    isPublished: true,
  },
  {
    _id: 'exam_6',
    name: 'BITSAT',
    slug: 'bitsat',
    conductingBody: 'BITS Pilani',
    examLevel: 'National',
    stream: 'Engineering',
    overview: 'Online entrance examination for integrated first-degree programs of BITS Pilani across Pilani, Goa, and Hyderabad campuses.',
    eligibility: '10+2 with 75% aggregate in PCM and 60% individually in each subject.',
    examPattern: { mode: 'Computer Based Test', duration: '3 Hours', totalQuestions: '130 Questions' },
    participatingUniversities: ['BITS Pilani', 'BITS Goa', 'BITS Hyderabad'],
    isPublished: true,
  },
];

const testimonials = [
  {
    _id: 'test_1',
    studentName: 'Rohan Deshmukh',
    course: 'B.Tech Computer Science',
    university: 'Delhi Technological University (DTU)',
    quote: 'CaptonAdmission made finding the right university effortless. The platform allowed me to compare DTU and VIT side-by-side with genuine fee breakdowns. Today I am studying my dream course!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    isFeatured: true,
  },
  {
    _id: 'test_2',
    studentName: 'Ananya Singhania',
    course: 'MBA in Finance',
    university: 'Symbiosis International University',
    quote: 'The personalized counselling team was with me throughout my SNAP exam and interview preparation. Their guidance on choice filling saved me from settling for an average college.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    isFeatured: true,
  },
  {
    _id: 'test_3',
    studentName: 'Karthik Raman',
    course: 'BA LLB (Hons)',
    university: 'NLSIU Bangalore',
    quote: 'Accurate cutoff information and transparent documentation support helped me navigate CLAT counseling seamlessly. CaptonAdmission is truly the most trustworthy student portal in India.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    isFeatured: true,
  },
];

const blogs = [
  {
    _id: 'blog_1',
    title: 'Top 10 High-Demand Engineering Specializations in India (2026)',
    slug: 'top-10-high-demand-engineering-specializations-2026',
    category: 'Engineering',
    excerpt: 'Detailed analysis of why AI, Cybersecurity, VLSI, and Robotics engineering offer the highest starting placement packages in 2026.',
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    author: 'Editorial Desk',
    createdAt: new Date(),
    isPublished: true,
  },
  {
    _id: 'blog_2',
    title: 'Step-by-Step Guide: How to Select the Perfect B-School for MBA',
    slug: 'how-to-select-the-perfect-b-school-for-mba',
    category: 'Management',
    excerpt: 'Crucial checklist comparing ROI, median CTC packages, faculty mentorship, and international exchange programs.',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
    author: 'Senior Counsellor',
    createdAt: new Date(),
    isPublished: true,
  },
  {
    _id: 'blog_3',
    title: 'Common Mistakes Students Make During University Choice Filling',
    slug: 'common-mistakes-students-make-during-counseling',
    category: 'Admissions',
    excerpt: 'Avoid choice filling blunders, missed document verification windows, and falling for unverified seat agents.',
    featuredImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop',
    author: 'Dr. Rajesh Sharma',
    createdAt: new Date(),
    isPublished: true,
  },
];

const cms = {
  heroHeading: 'Find Your Dream Course & Discover Your Perfect University',
  heroVideoUrl: '/hero_video.mp4',
  heroDescription: 'One platform to apply to 10,000+ esteemed colleges/universities in India & Abroad.',
  contactDetails: {
    phone: '+91 98765 43210',
    email: 'admissions@captonadmission.com',
    address: 'CaptonAdmission Tower, Knowledge Park, New Delhi, India - 110001',
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  },
};

// Course-University mappings for 3-Panel system
const mappings = [
  {
    _id: 'map_1',
    course: courses[0],
    university: universities[0],
    specialization: 'Artificial Intelligence',
    duration: '4 Years',
    eligibility: '10+2 with PCM (Min 60%) + JEE Main',
    totalFees: 780000,
    applicationFees: 1500,
    admissionStatus: 'Open',
    placementInfo: { averagePackage: '₹ 16.5 LPA', highestPackage: '₹ 1.2 CPA', placementPercent: '96%' },
  },
  {
    _id: 'map_2',
    course: courses[0],
    university: universities[1],
    specialization: 'Cloud Computing',
    duration: '4 Years',
    eligibility: '10+2 with PCM (Min 60%) + VITEEE',
    totalFees: 792000,
    applicationFees: 1350,
    admissionStatus: 'Open',
    placementInfo: { averagePackage: '₹ 9.5 LPA', highestPackage: '₹ 1.02 CPA', placementPercent: '93%' },
  },
  {
    _id: 'map_3',
    course: courses[0],
    university: universities[2],
    specialization: 'Software Architecture',
    duration: '4 Years',
    eligibility: '10+2 with PCM (Min 75%) + BITSAT',
    totalFees: 1980000,
    applicationFees: 3400,
    admissionStatus: 'Open',
    placementInfo: { averagePackage: '₹ 20.5 LPA', highestPackage: '₹ 1.33 CPA', placementPercent: '99%' },
  },
  {
    _id: 'map_4',
    course: courses[4], // BBA
    university: universities[3], // SIU
    specialization: 'Finance & Marketing',
    duration: '3 Years',
    eligibility: '10+2 with min 50% + SET Exam',
    totalFees: 920000,
    applicationFees: 1950,
    admissionStatus: 'Open',
    placementInfo: { averagePackage: '₹ 7.8 LPA', highestPackage: '₹ 18.2 LPA', placementPercent: '95%' },
  },
  {
    _id: 'map_5',
    course: courses[5], // MBA
    university: universities[3], // SIU
    specialization: 'Marketing & Strategy',
    duration: '2 Years',
    eligibility: 'Graduation (Min 50%) + SNAP',
    totalFees: 1980000,
    applicationFees: 2200,
    admissionStatus: 'Open',
    placementInfo: { averagePackage: '₹ 26.7 LPA', highestPackage: '₹ 45.5 LPA', placementPercent: '100%' },
  },
  {
    _id: 'map_6',
    course: courses[8], // BA LLB
    university: universities[5], // NLSIU
    specialization: 'Constitutional & Corporate Law',
    duration: '5 Years',
    eligibility: '10+2 + Top Rank in CLAT',
    totalFees: 1550000,
    applicationFees: 4000,
    admissionStatus: 'Open',
    placementInfo: { averagePackage: '₹ 16.5 LPA', highestPackage: '₹ 24 LPA', placementPercent: '100%' },
  },
];

module.exports = {
  categories,
  courses,
  universities,
  services,
  exams,
  testimonials,
  blogs,
  cms,
  mappings,
  getCategories: () => categories,
  getCourses: (query = {}) => {
    let result = [...courses];
    if (query.featured === 'true') {
      result = result.filter((c) => c.isFeatured);
    }
    if (query.category) {
      result = result.filter(
        (c) => c.category?.slug === query.category || c.category?._id === query.category
      );
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.overview?.toLowerCase().includes(q)
      );
    }
    if (query.limit) {
      result = result.slice(0, Number(query.limit));
    }
    return result;
  },
  getCourseBySlug: (slug) => courses.find((c) => c.slug === slug) || null,
  getUniversities: (query = {}) => {
    let result = [...universities];
    if (query.featured === 'true') {
      result = result.filter((u) => u.isFeatured);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.location?.city?.toLowerCase().includes(q) ||
          u.location?.state?.toLowerCase().includes(q)
      );
    }
    if (query.state) {
      result = result.filter((u) => u.location?.state?.toLowerCase() === query.state.toLowerCase());
    }
    if (query.universityType) {
      result = result.filter((u) => u.universityType === query.universityType);
    }
    if (query.limit) {
      result = result.slice(0, Number(query.limit));
    }
    return result;
  },
  getUniversityBySlug: (slug) => universities.find((u) => u.slug === slug) || null,
  getServices: () => services,
  getServiceBySlug: (slug) => services.find((s) => s.slug === slug) || null,
  getExams: (query = {}) => {
    let result = [...exams];
    if (query.stream && query.stream !== 'All') {
      result = result.filter((e) => e.stream === query.stream);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q));
    }
    return result;
  },
  getExamBySlug: (slug) => exams.find((e) => e.slug === slug) || null,
  getBlogs: (limit) => (limit ? blogs.slice(0, Number(limit)) : blogs),
  getBlogBySlug: (slug) => blogs.find((b) => b.slug === slug) || null,
  getTestimonials: () => testimonials,
  getCMS: () => cms,
  getMappings: (courseId) => {
    if (courseId) {
      return mappings.filter(
        (m) => m.course._id === courseId || m.course.slug === courseId
      );
    }
    return mappings;
  },
  getCourseById: (id) => courses.find((c) => c._id === id || c.slug === id) || null,
  updateCourse: (id, data) => {
    const idx = courses.findIndex((c) => c._id === id || c.slug === id);
    if (idx !== -1) {
      courses[idx] = { ...courses[idx], ...data };
      return courses[idx];
    }
    const newCourse = { _id: id || `course_${Date.now()}`, ...data };
    courses.unshift(newCourse);
    return newCourse;
  },
  deleteCourse: (id) => {
    const idx = courses.findIndex((c) => c._id === id || c.slug === id);
    if (idx !== -1) courses.splice(idx, 1);
  },
  getUniversityById: (id) => universities.find((u) => u._id === id || u.slug === id) || null,
  updateUniversity: (id, data) => {
    const idx = universities.findIndex((u) => u._id === id || u.slug === id);
    if (idx !== -1) {
      universities[idx] = { ...universities[idx], ...data };
      return universities[idx];
    }
    const newUni = { _id: id || `uni_${Date.now()}`, ...data };
    universities.unshift(newUni);
    return newUni;
  },
  deleteUniversity: (id) => {
    const idx = universities.findIndex((u) => u._id === id || u.slug === id);
    if (idx !== -1) universities.splice(idx, 1);
  },
  updateMapping: (id, data) => {
    const idx = mappings.findIndex((m) => m._id === id);
    if (idx !== -1) {
      mappings[idx] = { ...mappings[idx], ...data };
      return mappings[idx];
    }
    const newMapping = { _id: id || `map_${Date.now()}`, ...data };
    mappings.unshift(newMapping);
    return newMapping;
  },
  deleteMapping: (id) => {
    const idx = mappings.findIndex((m) => m._id === id);
    if (idx !== -1) mappings.splice(idx, 1);
  },
};
