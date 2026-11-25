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
  // Top Accredited International / Study Abroad Universities
  {
    _id: 'uni_int_1',
    name: 'Massachusetts Institute of Technology (MIT)',
    slug: 'massachusetts-institute-of-technology-mit',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
    location: { address: '77 Massachusetts Ave', city: 'Cambridge', state: 'Massachusetts', country: 'United States', pinCode: '02139' },
    universityType: 'Private',
    establishedYear: 1861,
    accreditation: ['QS World Rank #1', 'NECHE Accredited', 'ABET Certified'],
    website: 'https://www.mit.edu',
    contactInfo: { email: 'admissions@mit.edu', phone: '+1 617-253-1000', helpline: '+1-617-253-1000' },
    about: 'World-renowned private research university focusing on science, technology, algorithmic computation, and advanced engineering leadership.',
    facilities: ['MIT Media Lab', 'Barker Engineering Library', 'Hayden Memorial'],
    placementOverview: { averagePackage: '$125,000 USD / yr', highestPackage: '$280,000 USD', placementRate: '98%', topRecruiters: ['Google', 'Apple', 'NVIDIA', 'McKinsey'] },
    rating: 5.0,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_int_2',
    name: 'University of Oxford',
    slug: 'university-of-oxford',
    logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
    location: { address: 'Wellington Square', city: 'Oxford', state: 'Oxfordshire', country: 'United Kingdom', pinCode: 'OX1 2JD' },
    universityType: 'Government',
    establishedYear: 1096,
    accreditation: ['THE World Rank #1', 'Russell Group', 'Royal Charter'],
    website: 'https://www.ox.ac.uk',
    contactInfo: { email: 'undergraduate.admissions@ox.ac.uk', phone: '+44 1865 270000', helpline: '+44-1865-270000' },
    about: 'The oldest university in the English-speaking world, offering collegiate tutorial education and unmatched international academic prestige.',
    facilities: ['Bodleian Library', 'Radcliffe Camera', 'Oxford Union'],
    placementOverview: { averagePackage: '£ 65,000 GBP / yr', highestPackage: '£ 140,000 GBP', placementRate: '97%', topRecruiters: ['Goldman Sachs', 'UN', 'Rolls-Royce', 'AstraZeneca'] },
    rating: 5.0,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_int_3',
    name: 'University of Toronto',
    slug: 'university-of-toronto',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
    location: { address: '27 King\'s College Cir', city: 'Toronto', state: 'Ontario', country: 'Canada', pinCode: 'M5S' },
    universityType: 'Government',
    establishedYear: 1827,
    accreditation: ['Ranked #1 in Canada', 'U15 Member', 'AAU Member'],
    website: 'https://www.utoronto.ca',
    contactInfo: { email: 'admissions@utoronto.ca', phone: '+1 416-978-2011', helpline: '+1-416-978-2011' },
    about: 'Canada\'s leading public research institution celebrated for groundbreaking AI innovations, medical discoveries, and multicultural student life.',
    facilities: ['Robarts Research Library', 'Hart House', 'MaRS Discovery District'],
    placementOverview: { averagePackage: '$92,000 CAD / yr', highestPackage: '$180,000 CAD', placementRate: '96%', topRecruiters: ['RBC', 'Amazon Canada', 'Shopify', 'Deloitte'] },
    rating: 4.9,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_int_4',
    name: 'University of Melbourne',
    slug: 'university-of-melbourne',
    logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=400&fit=crop',
    location: { address: 'Parkville', city: 'Melbourne', state: 'Victoria', country: 'Australia', pinCode: '3010' },
    universityType: 'Government',
    establishedYear: 1853,
    accreditation: ['Ranked #1 in Australia', 'Group of Eight (Go8)', 'Universitas 21'],
    website: 'https://www.unimelb.edu.au',
    contactInfo: { email: 'study@unimelb.edu.au', phone: '+61 3 9035 5511', helpline: '+61-3-9035-5511' },
    about: 'Australia\'s premier university providing distinctive Melbourne Model degrees with world-class faculty and stellar employment outcomes.',
    facilities: ['Baillieu Library', 'Bio21 Institute', 'Melbourne Connect Hub'],
    placementOverview: { averagePackage: '$88,000 AUD / yr', highestPackage: '$170,000 AUD', placementRate: '95%', topRecruiters: ['BHP', 'Atlassian', 'ANZ', 'PwC Australia'] },
    rating: 4.8,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_int_5',
    name: 'Technical University of Munich (TUM)',
    slug: 'technical-university-of-munich-tum',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
    location: { address: 'Arcisstraße 21', city: 'Munich', state: 'Bavaria', country: 'Germany', pinCode: '80333' },
    universityType: 'Government',
    establishedYear: 1868,
    accreditation: ['TU9 Excellence University', 'Top Technical University in Germany'],
    website: 'https://www.tum.de',
    contactInfo: { email: 'studium@tum.de', phone: '+49 89 289 01', helpline: '+49-89-289-01' },
    about: 'Germany\'s highest-ranked technical university with tuition-free European higher education, world-leading robotics and engineering labs.',
    facilities: ['Garching Research Campus', 'TUM Venture Labs', 'Max Planck Centers'],
    placementOverview: { averagePackage: '€ 68,000 EUR / yr', highestPackage: '€ 130,000 EUR', placementRate: '97%', topRecruiters: ['BMW Group', 'Siemens', 'SAP', 'Airbus'] },
    rating: 4.9,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_int_6',
    name: 'National University of Singapore (NUS)',
    slug: 'national-university-of-singapore-nus',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
    location: { address: '21 Lower Kent Ridge Rd', city: 'Singapore', state: 'Central Singapore', country: 'Singapore', pinCode: '119077' },
    universityType: 'Government',
    establishedYear: 1905,
    accreditation: ['QS Asia Rank #1', 'Global Top 10', 'AACSB Accredited'],
    website: 'https://www.nus.edu.sg',
    contactInfo: { email: 'admissions@nus.edu.sg', phone: '+65 6516 6666', helpline: '+65-6516-6666' },
    about: 'Asia\'s flagship university providing rigorous global Asian education, cutting-edge biomedical and fintech research in Singapore.',
    facilities: ['University Town (UTown)', 'NUS Enterprise', 'Central Library'],
    placementOverview: { averagePackage: '$78,000 SGD / yr', highestPackage: '$160,000 SGD', placementRate: '98%', topRecruiters: ['DBS Bank', 'GIC', 'Temasek', 'Grab', 'Shopee'] },
    rating: 4.9,
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'uni_int_7',
    name: 'Khalifa University (UAE)',
    slug: 'khalifa-university-uae',
    logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=400&fit=crop',
    location: { address: 'Zone 1', city: 'Abu Dhabi', state: 'Abu Dhabi', country: 'United Arab Emirates', pinCode: '127788' },
    universityType: 'Government',
    establishedYear: 2007,
    accreditation: ['Ranked #1 in UAE', 'ABET Accredited', 'Ministry of Education UAE'],
    website: 'https://www.ku.ac.ae',
    contactInfo: { email: 'admissions@ku.ac.ae', phone: '+971 2 312 3333', helpline: '+971-2-312-3333' },
    about: 'Leading research university in the Middle East with 100% scholarships, premier aerospace, clean energy, and AI engineering degrees.',
    facilities: ['Robotics Research Lab', 'Aerospace Testing Tunnel', 'High Performance Computing'],
    placementOverview: { averagePackage: 'AED 180,000 / yr', highestPackage: 'AED 360,000', placementRate: '96%', topRecruiters: ['ADNOC', 'Mubadala', 'EDGE Group', 'Etihad'] },
    rating: 4.8,
    isFeatured: true,
    isPublished: true,
  },
];

const services = [
  {
    _id: 'serv_1',
    title: 'Career Counselling',
    slug: 'career-counselling',
    category: 'Career Planning',
    icon: 'Compass',
    shortDescription: 'Scientific psychometric assessment and 1-on-1 career mapping to discover your authentic professional calling.',
    fullDescription: 'Our certified career counsellors evaluate your academic strengths, personality drivers, and long-term career aspirations to identify the optimal career pathway. We use international psychometric assessment matrices mapped to future employment horizons.',
    benefits: [
      'Clarity on strengths, aptitude, and emotional quotient',
      'Objective psychometric insights with detailed 12-page report',
      'Personalized career roadmap spanning 5 to 10 years',
      'Direct parent-counsellor advisory session'
    ],
    stats: { rating: '4.9/5', studentsAssisted: '18,500+', satisfactionRate: '99%' },
    deliverables: [
      'Standardized Psychometric Aptitude Report',
      'Personalized Career Matrix with 3 alternative tracks',
      '1-on-1 60-Minute Video Consultation with Senior Psychologist',
      'Lifelong Access to CaptonAdmission Career Webinars'
    ],
    process: [
      { step: '01', title: 'Student Diagnostic Intake', desc: 'Online assessment assessing cognitive strengths, verbal, mathematical, and spatial acumen.' },
      { step: '02', title: 'Psychometric Report Generation', desc: 'Deep analytics pinpointing ideal vocational clusters with lowest burn-out risk.' },
      { step: '03', title: '1-on-1 Senior Counsellor Session', desc: 'Live video consultation with student and parents to explore career prospects and ROI.' },
      { step: '04', title: 'Actionable Career Roadmap', desc: 'Milestone timeline detailing exams to prepare for and target degrees to pursue.' }
    ],
    whoIsThisFor: [
      'Class 10th students deciding between Science, Commerce, and Humanities',
      'Class 12th students confused between Engineering, Design, Law, or Medical',
      'College undergraduates planning Master degrees (MBA, M.Tech, MS Abroad)'
    ],
    faqs: [
      { q: 'How long does the counselling session take?', a: 'The psychometric evaluation takes approximately 30 minutes online, followed by a 60-minute 1-on-1 deep-dive session with our principal career counsellor.' },
      { q: 'Can parents join the session?', a: 'Yes! We actively encourage parents to attend so family budget, location preferences, and expectations are seamlessly aligned.' },
      { q: 'Is this service free of charge?', a: 'Initial diagnostic evaluation and institutional partner counselling is 100% free with zero brokerage fees.' }
    ],
    isPublished: true,
    order: 1,
  },
  {
    _id: 'serv_2',
    title: 'Course Selection Guidance',
    slug: 'course-selection-guidance',
    category: 'Career Planning',
    icon: 'BookOpen',
    shortDescription: 'Comprehensive curriculum analysis comparing emerging vs evergreen degrees to secure peak career placements.',
    fullDescription: 'Make data-backed decisions between traditional streams and high-growth specializations like AI & ML, FinTech, Corporate Law, and Biotech. We break down the real syllabi, industry placement stats, and recruiter preferences.',
    benefits: [
      'Deep curriculum comparison across 50+ degree programs',
      'Insights into 5-year industry hiring trends and salary trajectories',
      'Specialization viability analysis (Core vs Interdisciplinary)',
      'Accreditation verification (UGC, AICTE, NAAC, NBA)'
    ],
    stats: { rating: '4.8/5', studentsAssisted: '24,000+', satisfactionRate: '98%' },
    deliverables: [
      'Syllabus & Course Curriculum Comparison Dossier',
      'Industry Placement Trajectory & Average CTC Projections',
      'Specialization Electives Recommendation Guide'
    ],
    process: [
      { step: '01', title: 'Aptitude & Stream Review', desc: 'Assess qualifying exam marks, entrance rank, and natural subject affinity.' },
      { step: '02', title: 'Curriculum Benchmarking', desc: 'Side-by-side comparison of emerging degrees with market demand and placement data.' },
      { step: '03', title: 'Industry Hiring Insights', desc: 'Examine recruiter preferences and 5-year starting packages across core industries.' },
      { step: '04', title: 'Final Degree Recommendation', desc: 'Lock in primary and backup degree choices with proven career stability.' }
    ],
    whoIsThisFor: [
      'Students deciding between CSE core vs CSE specializations (AI/ML, Data Science)',
      'Students evaluating BBA vs B.Com vs Integrated Management degrees',
      'Aspirants curious about interdisciplinary tech and design opportunities'
    ],
    faqs: [
      { q: 'Should I choose core CSE or specialized AI/ML?', a: 'Our counsellors evaluate university curriculum strength: if the institution provides robust math and fundamentals, specialized tracks offer higher initial campus packages.' },
      { q: 'What is the ROI difference across streams?', a: 'We provide real verified placement statistics from NIRF and institutional audits.' }
    ],
    isPublished: true,
    order: 2,
  },
  {
    _id: 'serv_3',
    title: 'University Shortlisting',
    slug: 'university-shortlisting',
    category: 'Admissions',
    icon: 'Building2',
    shortDescription: 'Curated Dream, Reach, and Safe college matrices matched to your cutoff scores, budget, and location preferences.',
    fullDescription: 'Avoid misleading marketing and fake promises. Our proprietary college benchmarking algorithm screens institutions across NAAC accreditations, NIRF rankings, actual median placement reports, faculty ratios, and campus infrastructure.',
    benefits: [
      'Balanced portfolio of universities (Dream, Target & Safety buckets)',
      'Cutoff match guarantee based on previous 5-year institutional ranks',
      'Elimination of hidden charges, fake affiliations, and agent traps',
      'Campus infrastructure, safety, and hostel vetting'
    ],
    stats: { rating: '4.9/5', studentsAssisted: '31,000+', satisfactionRate: '99.4%' },
    deliverables: [
      'Tailored Shortlist of 10-15 Accredited Universities',
      'Fee Structure & Hostel Cost Breakdown Matrix',
      'Cutoff Probability Percentile Scorecards'
    ],
    process: [
      { step: '01', title: 'Scorecard & Budget Evaluation', desc: 'Capture entrance percentiles, 12th board marks, geographic constraints, and maximum budget.' },
      { step: '02', title: 'Matrix Segmentation', desc: 'Categorize institutions into 3 tiers: Dream (aspirational), Target (high probability), and Safe (guaranteed).' },
      { step: '03', title: 'Faculty & Placement Vetting', desc: 'Verify audited placement reports, highest CTCs, and campus recruitment partnerships.' },
      { step: '04', title: 'Application Readiness Checklist', desc: 'Compile individual university deadlines, registration fees, and document requirements.' }
    ],
    whoIsThisFor: [
      'Candidates navigating central or state counselling rounds (JoSAA, CSAB, JAC, NEET, CET)',
      'Parents looking for trustworthy, accredited private universities within a clear budget',
      'Students looking for top institutions with zero hidden charges'
    ],
    faqs: [
      { q: 'How do you ensure universities are accredited?', a: 'We strictly recommend UGC-recognized, AICTE-approved, and NAAC/NIRF accredited institutions.' },
      { q: 'Can you help with private university direct admissions?', a: 'Yes, we assist with merit-based applications to certified partner universities with zero brokerage.' }
    ],
    isPublished: true,
    order: 3,
  },
  {
    _id: 'serv_4',
    title: 'Application Form Assistance',
    slug: 'application-assistance',
    category: 'Admissions',
    icon: 'FileText',
    shortDescription: 'Flawless form filing, document verification, and SOP assistance to eliminate university rejection risks.',
    fullDescription: 'Navigating dozens of conflicting portal interfaces, file size constraints, and strict eligibility documentation can lead to disqualification. Our dedicated admissions officers supervise your form submissions with zero errors.',
    benefits: [
      'Zero-error application guarantee across all university portals',
      'Professional Statement of Purpose (SOP) and essay editing',
      'Real-time deadline tracking and admission notification alerts',
      'Quota certificate verification (Defense, EWS, Sports, Kashmiri Migrant)'
    ],
    stats: { rating: '4.9/5', studentsAssisted: '22,000+', satisfactionRate: '99.8%' },
    deliverables: [
      'Document Audit and Format Correction',
      'Tailored SOP and Statement of Intent Review',
      'Application Submission Acknowledgements Dossier'
    ],
    process: [
      { step: '01', title: 'Document Vault Creation', desc: 'Collect and standardize marksheets, certificates, IDs, and photographs into required specs.' },
      { step: '02', title: 'SOP & Personal Essay Drafting', desc: 'Polish your personal statement to highlight academic leadership and extracurricular achievements.' },
      { step: '03', title: 'Supervised Portal Submission', desc: 'Complete registration, choice filling, and fee payment before the cut-off deadline.' },
      { step: '04', title: 'Receipt & Admit Card Archive', desc: 'Track application reference numbers and schedule admit card download reminders.' }
    ],
    whoIsThisFor: [
      'Students applying to multiple universities simultaneously',
      'Aspirants worried about making critical mistakes on official application forms',
      'Candidates requiring polished SOPs for premier private universities'
    ],
    faqs: [
      { q: 'What happens if a form has a typo?', a: 'Our double-verification process ensures details match your Class 10/12 certificate exactly before final submission.' },
      { q: 'Do you help with SOP drafting?', a: 'Yes! Our editorial team reviews, corrects, and enhances your SOPs.' }
    ],
    isPublished: true,
    order: 4,
  },
  {
    _id: 'serv_5',
    title: 'Entrance Exam Guidance',
    slug: 'entrance-exam-guidance',
    category: 'Exam Prep',
    icon: 'GraduationCap',
    shortDescription: 'Test alerts, syllabus breakdowns, mock analysis, and scoring strategies for JEE, NEET, CAT, CUET, and CLAT.',
    fullDescription: 'Strategic preparation roadmaps, high-yield subject weightage analysis, and guidance on optimal attempts across national and state level entrance examinations.',
    benefits: [
      'Instant notifications on registration, admit cards, and correction windows',
      'Subject-wise weightage and high-yield chapters prioritization',
      'Rank vs percentile projections based on previous years trends',
      'Tie-breaker rule insights and negative marking strategies'
    ],
    stats: { rating: '4.8/5', studentsAssisted: '40,000+', satisfactionRate: '98.5%' },
    deliverables: [
      'Official Exam Pattern & Blueprint Handbook',
      'Milestone Dates & Important Deadlines Calendar',
      'Cutoff Benchmarks for Top 50 Institutions'
    ],
    process: [
      { step: '01', title: 'Exam Readiness Diagnostic', desc: 'Evaluate your target stream and list all eligible national and state exams.' },
      { step: '02', title: 'Syllabus & Weightage Breakdown', desc: 'Filter high-weightage chapters to maximize your score in the remaining preparation window.' },
      { step: '03', title: 'Attempt Strategy & Mock Feedback', desc: 'Optimize time management, question selection, and minimize negative marking penalties.' },
      { step: '04', title: 'Post-Exam Counselling Strategy', desc: 'Translate raw percentiles into realistic college choices across multiple counselling rounds.' }
    ],
    whoIsThisFor: [
      'Aspirants preparing for JEE Main, NEET UG, CAT, CUET, or CLAT',
      'Students looking for backup entrance examinations with similar syllabi',
      'Candidates seeking cutoff analysis for premier universities'
    ],
    faqs: [
      { q: 'Do you provide mock tests?', a: 'We provide question patterns, high-scoring topic breakdowns, and strategic test-taking frameworks.' },
      { q: 'Can you help if my percentile is average?', a: 'Absolutely! Thousands of accredited colleges admit students based on moderate percentiles and direct institutional exams.' }
    ],
    isPublished: true,
    order: 5,
  },
  {
    _id: 'serv_6',
    title: 'Scholarship Assistance',
    slug: 'scholarship-assistance',
    category: 'Financial Support',
    icon: 'Award',
    shortDescription: 'Unlock institutional merit scholarships, defense wards concessions, and state government education grants.',
    fullDescription: 'Access over ₹ 50+ Crore worth of verified scholarship schemes to minimize your family financial burden. We help you identify, apply for, and secure fee concessions ranging from 25% up to 100%.',
    benefits: [
      'Direct fee concession up to 100% on tuition fees',
      'Corporate CSR scholarship grant identification',
      'Merit-cum-means assistance and single girl child concessions',
      'Sports and defense wards quota fee reductions'
    ],
    stats: { rating: '4.9/5', studentsAssisted: '12,000+', satisfactionRate: '99%' },
    deliverables: [
      'Personalized Scholarship Match Matrix',
      'Application Dossier with Supporting Documents Checklist',
      'Direct Institutional Scholarship Liaison Support'
    ],
    process: [
      { step: '01', title: 'Eligibility Screening', desc: 'Match your 12th board marks, entrance percentile, family income, and category criteria.' },
      { step: '02', title: 'Grant & Scholarship Discovery', desc: 'Identify active government, corporate CSR, and university internal scholarship pools.' },
      { step: '03', title: 'Documentation & Verification', desc: 'Assemble income certificates, affidavit declarations, and merit credentials.' },
      { step: '04', title: 'Institutional Fee Adjustment', desc: 'Ensure awarded scholarship discounts reflect directly on university tuition invoices.' }
    ],
    whoIsThisFor: [
      'High-performing students with 85%+ in 10+2 seeking merit waivers',
      'Students from economically weaker sections (EWS) seeking financial aid',
      'Wards of defense personnel, teachers, and single girl children'
    ],
    faqs: [
      { q: 'Is scholarship assistance free?', a: 'Yes! CaptonAdmission does not charge any commission or deduction from your scholarship amount.' },
      { q: 'Are scholarships renewed every year?', a: 'Most institutional merit scholarships require maintaining a minimum CGPA (usually 7.5 or 8.0) each semester.' }
    ],
    isPublished: true,
    order: 6,
  },
  {
    _id: 'serv_7',
    title: 'Education Loan Support',
    slug: 'education-loan-support',
    category: 'Financial Support',
    icon: 'ShieldCheck',
    shortDescription: 'Hassle-free student loan sanctioning through leading nationalized banks and NBFCs with low interest rates.',
    fullDescription: 'We partner with premier nationalized banks and specialized education NBFCs to secure swift, collateral-free education loans up to ₹ 7.5 Lakhs and secured loans up to ₹ 1.5 Crores with simplified documentation.',
    benefits: [
      'Collateral-free loans up to ₹ 7.5 Lakhs under government credit guarantee',
      'Lowest interest rates with Vidya Lakshmi portal integration',
      '100% financing covering tuition, hostel, laptop, and travel expenses',
      'Moratorium period benefit (repayment starts after course completion)'
    ],
    stats: { rating: '4.8/5', studentsAssisted: '9,500+', satisfactionRate: '97.8%' },
    deliverables: [
      'Bank Interest Rate Comparison Grid',
      'Loan Eligibility & EMI Calculator Dossier',
      'Direct Banking Desk Priority Sanction Follow-up'
    ],
    process: [
      { step: '01', title: 'Financial Assessment', desc: 'Determine total course outlay, co-applicant CIBIL score, and loan requirement.' },
      { step: '02', title: 'Bank Selection', desc: 'Select the optimal bank or NBFC offering lowest rates and longest moratorium.' },
      { step: '03', title: 'Paperwork Expediting', desc: 'Submit bonafide admission letter, fee structure, and KYC documents.' },
      { step: '04', title: 'Sanction Letter Issuance', desc: 'Expedite sanction letter so university admission deposit deadlines are met.' }
    ],
    whoIsThisFor: [
      'Students needing financial financing for professional degrees',
      'Families seeking collateral-free educational loans under government schemes',
      'Aspirants needing fast sanction letters for seat reservations'
    ],
    faqs: [
      { q: 'Can I get a loan without property collateral?', a: 'Yes! Under the government CGFSEL scheme, education loans up to ₹ 7.5 Lakhs require zero property collateral or third-party guarantee.' },
      { q: 'When does repayment begin?', a: 'Repayment begins after course completion plus a 6-month or 1-year grace (moratorium) period.' }
    ],
    isPublished: true,
    order: 7,
  },
  {
    _id: 'serv_8',
    title: 'Documentation & Seat Confirmation',
    slug: 'documentation-seat-confirmation',
    category: 'Admissions',
    icon: 'CheckCircle2',
    shortDescription: 'Full verification, apostille/attestation guidance, and institutional seat freeze support for peaceful admissions.',
    fullDescription: 'From migration certificates and gap-year affidavits to medical fitness certificates and physical verification counters, our counsellors ensure you never risk losing a confirmed seat due to technical document discrepancies.',
    benefits: [
      'Complete checklist for physical and online document verification',
      'Standardized gap-year affidavit and anti-ragging undertaking templates',
      'Seat acceptance fee verification and formal admission letter tracking',
      'Hostel allotment and orientation day onboarding support'
    ],
    stats: { rating: '4.9/5', studentsAssisted: '19,000+', satisfactionRate: '99.6%' },
    deliverables: [
      'Master Document Verification Checklist',
      'Legal Undertaking & Affidavit Formats',
      'Campus Reporting Guide'
    ],
    process: [
      { step: '01', title: 'Document Audit', desc: 'Check Class 10/12 original marksheets, transfer certificates, and category proofs.' },
      { step: '02', title: 'Affidavit Preparation', desc: 'Provide verified drafts for gap year, character certificate, and domicile claims.' },
      { step: '03', title: 'Seat Freeze Confirmation', desc: 'Coordinate fee payment and obtain the official institutional enrolment number.' },
      { step: '04', title: 'Campus Check-In', desc: 'Guidance on hostel room reservation, mess registration, and academic calendar start.' }
    ],
    whoIsThisFor: [
      'Students with gap years needing valid legal affidavits',
      'Outstation students transitioning to campus hostels',
      'Parents wanting complete peace of mind during final seat confirmation'
    ],
    faqs: [
      { q: 'What if my original marksheet is not released yet by the board?', a: 'We help you obtain a provisional passing certificate or internet copy attested by your school principal which is accepted conditionally.' },
      { q: 'Is a gap-year affidavit difficult to obtain?', a: 'Not at all. We provide a ready-to-print notary template stating the reasons for the drop year.' }
    ],
    isPublished: true,
    order: 8,
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
    overview: 'National flagship computer-based examination for admissions to NITs, IIITs, CFTIs, and premier engineering universities, serving also as the preliminary qualification benchmark for JEE Advanced.',
    eligibility: 'Passed Class 12 (10+2) with Physics, Mathematics, and Chemistry/Technical Vocational subject. Top 20 percentile or 75% marks in board examinations.',
    applicationFee: '₹ 1,000 (Male) / ₹ 800 (Female) / ₹ 500 (Reserved)',
    website: 'https://jeemain.nta.nic.in',
    registrationStatus: 'Registration Open',
    examPattern: {
      mode: 'Computer Based Test (CBT)',
      duration: '3 Hours (180 Minutes)',
      totalQuestions: '90 Questions (75 to attempt)',
      totalMarks: '300 Marks',
      markingScheme: '+4 for correct, -1 for incorrect, 0 for unattempted',
    },
    importantDates: [
      { title: 'Information Notification', date: 'November 2026', description: 'Official NTA announcement' },
      { title: 'Online Application Window', date: 'Nov - Dec 2026', description: 'Session 1 online registration' },
      { title: 'Admit Card Release', date: '3 Days before Exam', description: 'Downloadable hall ticket' },
      { title: 'Session 1 Examination', date: 'Jan 24 - Feb 01, 2027', description: 'Multiple shifts nationwide' },
      { title: 'Session 1 Results', date: 'February 12, 2027', description: 'NTA percentile score card' },
    ],
    syllabusTopics: [
      'Physics: Kinematics, Thermodynamics, Electrostatics, Optics, Modern Physics',
      'Chemistry: Physical Chemistry, Organic Reaction Mechanisms, Inorganic Periodic Trends',
      'Mathematics: Calculus, Coordinate Geometry, Vectors & 3D, Matrices, Algebra',
    ],
    participatingUniversities: [
      'Delhi Technological University (DTU)',
      'National Institute of Technology (NIT Trichy)',
      'BITS Pilani',
      'Vellore Institute of Technology (VIT)',
      'Thapar Institute of Engineering',
    ],
    isPublished: true,
  },
  {
    _id: 'exam_2',
    name: 'NEET UG (National Eligibility cum Entrance Test)',
    slug: 'neet-ug',
    conductingBody: 'National Testing Agency (NTA)',
    examLevel: 'National',
    stream: 'Medical',
    overview: 'Single nationwide uniform entrance examination for admissions to MBBS, BDS, BAMS, BHMS, and allied healthcare degree courses across all medical institutions including AIIMS and JIPMER throughout India.',
    eligibility: 'Passed 10+2 with Physics, Chemistry, Biology/Biotechnology and English with minimum 50% marks (40% for SC/ST/OBC). Minimum 17 years of age.',
    applicationFee: '₹ 1,700 (General) / ₹ 1,600 (EWS/OBC) / ₹ 1,000 (SC/ST)',
    website: 'https://exams.nta.ac.in/NEET',
    registrationStatus: 'Upcoming (Feb 2027)',
    examPattern: {
      mode: 'Pen and Paper (Offline OMR)',
      duration: '3 Hours 20 Minutes (200 Minutes)',
      totalQuestions: '200 Questions (180 to attempt)',
      totalMarks: '720 Marks',
      markingScheme: '+4 for correct, -1 for incorrect',
    },
    importantDates: [
      { title: 'NEET Notification', date: 'February 2027', description: 'Brochure and portal live' },
      { title: 'Application Deadline', date: 'March 2027', description: 'Final date for document upload' },
      { title: 'City Intimation Slip', date: 'April 2027', description: 'Advance examination city allotment' },
      { title: 'Examination Date', date: 'May 05, 2027 (Sunday)', description: 'Single shift 2:00 PM - 5:20 PM' },
      { title: 'Scorecard & All-India Rank', date: 'June 2027', description: 'Percentile and category ranks' },
    ],
    syllabusTopics: [
      'Biology: Human Physiology, Genetics & Evolution, Ecology, Plant Diversity, Biotechnology',
      'Chemistry: Chemical Bonding, Thermodynamics, Organic Functional Groups, Biomolecules',
      'Physics: Mechanics, Work Energy Power, Electrodynamics, Modern Physics, Waves',
    ],
    participatingUniversities: [
      'All India Institute of Medical Sciences (AIIMS New Delhi)',
      'Christian Medical College (CMC Vellore)',
      'Maulana Azad Medical College',
      'King George Medical University',
      'Kasturba Medical College (Manipal)',
    ],
    isPublished: true,
  },
  {
    _id: 'exam_3',
    name: 'CAT (Common Admission Test)',
    slug: 'cat-exam',
    conductingBody: 'Rotational Indian Institutes of Management (IIMs)',
    examLevel: 'National',
    stream: 'Management',
    overview: 'India’s premier computer-based MBA/PGDM entrance test evaluated for admissions to 21 prestigious Indian Institutes of Management (IIMs), FMS Delhi, SPJIMR, and over 1,200 leading B-Schools nationwide.',
    eligibility: 'Bachelor’s degree with at least 50% marks or equivalent CGPA (45% for SC/ST/PwD). Final year graduating students are eligible to apply.',
    applicationFee: '₹ 2,400 (General/NC-OBC) / ₹ 1,200 (SC/ST/PwD)',
    website: 'https://iimcat.ac.in',
    registrationStatus: 'Annual Cycle (Aug - Nov)',
    examPattern: {
      mode: 'Computer Based Test (CBT)',
      duration: '2 Hours (120 Minutes, 40 min per section)',
      totalQuestions: '66 Questions (MCQ & Non-MCQ TITA)',
      totalMarks: '198 Marks',
      markingScheme: '+3 for correct, -1 for wrong MCQ, 0 for TITA errors',
    },
    importantDates: [
      { title: 'Official CAT Notification', date: 'Last Sunday of July 2026', description: 'Syllabus and participating IIMs' },
      { title: 'Registration Start', date: 'August 02, 2026', description: 'Portal opens for candidate profiles' },
      { title: 'Registration Closes', date: 'September 20, 2026', description: 'Deadline for test city selection' },
      { title: 'Admit Card Available', date: 'October 25, 2026', description: 'Session time & venue details' },
      { title: 'CAT Examination Date', date: 'Last Sunday of Nov 2026', description: '3 slots across 155 test cities' },
      { title: 'IIM Interview Shortlists', date: 'January 2027', description: 'WAT-PI rounds commencement' },
    ],
    syllabusTopics: [
      'VARC: Reading Comprehension passages, Para Jumbles, Summary, Para Completion',
      'DILR: Arrangement, Matrix, Graphs, Venn Diagrams, Network diagrams, Games & Tournaments',
      'QA: Arithmetic, Algebra, Geometry, Mensuration, Number Systems, Modern Math',
    ],
    participatingUniversities: [
      'Indian Institute of Management Ahmedabad (IIM A)',
      'Indian Institute of Management Bangalore (IIM B)',
      'Faculty of Management Studies (FMS Delhi)',
      'Symbiosis International University (SIU)',
      'Delhi Technological University - DSM',
    ],
    isPublished: true,
  },
  {
    _id: 'exam_4',
    name: 'CLAT (Common Law Admission Test)',
    slug: 'clat-exam',
    conductingBody: 'Consortium of National Law Universities (NLUs)',
    examLevel: 'National',
    stream: 'Law',
    overview: 'Centralized national entrance test conducted for admissions to 24 prestigious National Law Universities (NLUs) in India for five-year integrated BA LLB, BBA LLB, B.Com LLB and one-year LL.M programs.',
    eligibility: 'Passed 10+2 or equivalent with minimum 45% marks (40% for SC/ST candidates). No upper age limit.',
    applicationFee: '₹ 4,000 (General) / ₹ 3,500 (SC/ST/BPL)',
    website: 'https://consortiumofnlus.ac.in',
    registrationStatus: 'Registration Open',
    examPattern: {
      mode: 'Offline Pen & Paper OMR Format',
      duration: '2 Hours (120 Minutes)',
      totalQuestions: '120 Comprehension-Based MCQs',
      totalMarks: '120 Marks',
      markingScheme: '+1 for correct, -0.25 for incorrect',
    },
    importantDates: [
      { title: 'CLAT Application Begins', date: 'July 2026', description: 'Candidate portal open' },
      { title: 'Final Submission Date', date: 'October 2026', description: 'Last date to submit preference list' },
      { title: 'Hall Ticket Download', date: 'November 2026', description: 'Roll number and center allotment' },
      { title: 'CLAT Examination Day', date: 'First Sunday of Dec 2026', description: '2:00 PM to 4:00 PM nationwide' },
      { title: 'NLU Allotment Rounds', date: 'Dec 2026 - Jan 2027', description: '5 rounds of seat allocation' },
    ],
    syllabusTopics: [
      'English Language: Comprehension passages, vocabulary in context, inferential reasoning',
      'Current Affairs & General Knowledge: National and international news, legal developments',
      'Legal Reasoning: Application of legal principles and facts to contemporary scenarios',
      'Logical Reasoning: Arguments, premises, conclusions, syllogisms, analogies',
      'Quantitative Techniques: Grade 10 arithmetic, ratio & proportion, percentage, data sets',
    ],
    participatingUniversities: [
      'National Law School of India University (NLSIU Bangalore)',
      'NALSAR University of Law (Hyderabad)',
      'The West Bengal National University of Juridical Sciences (WBNUJS Kolkata)',
      'National Law University Jodhpur (NLUJ)',
      'Amity Law School (Noida)',
    ],
    isPublished: true,
  },
  {
    _id: 'exam_5',
    name: 'CUET UG (Common University Entrance Test)',
    slug: 'cuet-ug',
    conductingBody: 'National Testing Agency (NTA)',
    examLevel: 'National',
    stream: 'Science / Arts / Commerce',
    overview: 'Standardized single-window entrance examination administered by NTA for admission into undergraduate degrees across all Central, State, Deemed, and leading private universities throughout India.',
    eligibility: 'Passed Class 12 (10+2) or equivalent from a recognized board. No maximum age restriction.',
    applicationFee: '₹ 1,000 for up to 3 subjects (General) + ₹ 400 per extra domain',
    website: 'https://exams.nta.ac.in/CUET-UG',
    registrationStatus: 'Upcoming (Feb 2027)',
    examPattern: {
      mode: 'Hybrid (OMR + Computer Based Test)',
      duration: '45 Minutes per domain (60 Minutes for Math, Accountancy, Physics, Chem)',
      totalQuestions: '50 Questions per subject (40 to be answered)',
      totalMarks: '200 Marks per subject',
      markingScheme: '+5 for correct, -1 for incorrect',
    },
    importantDates: [
      { title: 'CUET UG Notification', date: 'February 2027', description: 'Subject domain guidelines release' },
      { title: 'Application Window', date: 'Feb - March 2027', description: 'Subject selection & university choices' },
      { title: 'City Intimation', date: 'First week of May 2027', description: 'Exam city slips' },
      { title: 'CUET Examination Week', date: 'May 15 - May 31, 2027', description: 'Staggered subject shifts' },
      { title: 'NTA Scorecards', date: 'June 30, 2027', description: 'University admission portal launches' },
    ],
    syllabusTopics: [
      'Section IA & IB: Language reading comprehension, literary aptitude, vocabulary',
      'Section II: Domain-specific subjects mapped directly to NCERT Class 12 curriculum',
      'Section III: General Test covering General Knowledge, Current Affairs, Mental Ability, Quantitative Reasoning',
    ],
    participatingUniversities: [
      'University of Delhi (DU - St. Stephens, SRCC, Hindu)',
      'Banaras Hindu University (BHU)',
      'Jawaharlal Nehru University (JNU)',
      'Jamia Millia Islamia',
      'Bennett University / Amity University',
    ],
    isPublished: true,
  },
  {
    _id: 'exam_6',
    name: 'BITSAT (BITS Admission Test)',
    slug: 'bitsat',
    conductingBody: 'Birla Institute of Technology and Science (BITS Pilani)',
    examLevel: 'University',
    stream: 'Engineering',
    overview: 'Highly prestigious university-level online entrance examination for integrated first-degree BE, B.Pharm, and M.Sc programs at BITS Pilani, BITS Goa, and BITS Hyderabad campuses.',
    eligibility: 'Passed 10+2 with Physics, Chemistry, and Mathematics with minimum 75% aggregate in PCM and minimum 60% marks in each subject individually.',
    applicationFee: '₹ 3,400 (Single Session) / ₹ 5,400 (Both Sessions)',
    website: 'https://bitsadmission.com',
    registrationStatus: 'Registration Open',
    examPattern: {
      mode: 'Computer Based Test (CBT)',
      duration: '3 Hours (180 Minutes, no break)',
      totalQuestions: '130 Questions + 12 Bonus Questions',
      totalMarks: '390 Marks',
      markingScheme: '+3 for correct, -1 for incorrect',
    },
    importantDates: [
      { title: 'BITSAT Notification', date: 'January 2027', description: 'Brochure and test format details' },
      { title: 'Session 1 Registration Deadline', date: 'March 2027', description: 'Slot booking option' },
      { title: 'Session 1 Exam Window', date: 'May 20 - May 24, 2027', description: 'Instant score generation' },
      { title: 'Session 2 Exam Window', date: 'June 22 - June 26, 2027', description: 'Higher of two scores considered' },
      { title: 'Campus Iteration Cutoffs', date: 'July 2027', description: 'Branch allotment rounds' },
    ],
    syllabusTopics: [
      'Part I: Physics (30 Questions - Mechanics, Optics, Electromagnetism)',
      'Part II: Chemistry (30 Questions - Physical, Organic, Inorganic Chemistry)',
      'Part III: (a) English Proficiency (10 Qs), (b) Logical Reasoning (20 Qs)',
      'Part IV: Mathematics (40 Questions - Calculus, Vectors, Probability) or Biology for B.Pharm',
    ],
    participatingUniversities: [
      'BITS Pilani (Main Campus, Rajasthan)',
      'BITS Pilani - K.K. Birla Goa Campus',
      'BITS Pilani - Hyderabad Campus',
    ],
    isPublished: true,
  },
  {
    _id: 'exam_7',
    name: 'GATE (Graduate Aptitude Test in Engineering)',
    slug: 'gate-exam',
    conductingBody: 'IISc Bangalore & Joint IITs',
    examLevel: 'National',
    stream: 'Engineering',
    overview: 'Prestigious national test assessing mastery of engineering, technology, architecture, science, and humanities, leading to M.Tech/Ph.D. admissions at IITs, IISc, and premier PSU recruitments.',
    eligibility: 'Graduates in Engineering, Technology, Architecture, Science, Commerce, or Arts, or candidates currently in their 3rd or higher year of undergraduate study.',
    applicationFee: '₹ 1,800 (General) / ₹ 900 (Female/SC/ST)',
    website: 'https://gate2026.iisc.ac.in',
    registrationStatus: 'Annual Cycle (Sep - Feb)',
    examPattern: {
      mode: 'Computer Based Test (CBT)',
      duration: '3 Hours (180 Minutes)',
      totalQuestions: '65 Questions (MCQ, MSQ, and NAT)',
      totalMarks: '100 Marks',
      markingScheme: 'Negative marking for MCQs (1/3rd or 2/3rd); No negative marking for MSQs and NATs',
    },
    importantDates: [
      { title: 'GATE Portal Opens', date: 'August 2026', description: 'GOAPS portal registration' },
      { title: 'Registration Deadline', date: 'September 2026', description: 'Normal fee application' },
      { title: 'Admit Card Release', date: 'January 2027', description: 'Hall ticket download' },
      { title: 'GATE Examination', date: 'February 06 - 14, 2027', description: 'Conducted across 2 weekends' },
      { title: 'GATE Scorecard Validity', date: 'March 2027', description: 'Score valid for 3 full years' },
    ],
    syllabusTopics: [
      'General Aptitude: Verbal ability, numerical reasoning, spatial reasoning',
      'Engineering Mathematics: Linear algebra, calculus, differential equations, probability',
      'Subject Core: Selected paper core specialization concepts and applications',
    ],
    participatingUniversities: [
      'Indian Institute of Science (IISc Bangalore)',
      'IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur',
      'Delhi Technological University (DTU M.Tech)',
      'Top Navratna & Maharatna PSUs (ONGC, IOCL, BHEL, NTPC)',
    ],
    isPublished: true,
  },
  {
    _id: 'exam_8',
    name: 'NID DAT (Design Aptitude Test)',
    slug: 'nid-dat',
    conductingBody: 'National Institute of Design',
    examLevel: 'National',
    stream: 'Design',
    overview: 'National entrance evaluation assessing design thinking, visualization, observation, and creative problem solving for B.Des and M.Des degrees at all NID campuses across India.',
    eligibility: 'Passed or appearing in 10+2 in any stream (Science, Commerce, Arts). Age criteria as per NID admission prospectus.',
    applicationFee: '₹ 3,000 (General/OBC) / ₹ 1,500 (SC/ST/PwD)',
    website: 'https://admissions.nid.edu',
    registrationStatus: 'Registration Open',
    examPattern: {
      mode: 'Pen and Paper (DAT Prelims) + Studio Test & Personal Interview (DAT Mains)',
      duration: '3 Hours (DAT Prelims)',
      totalQuestions: 'Objective Questions + Subjective Drawing Questions',
      totalMarks: '100 Marks',
      markingScheme: 'No negative marking in subjective drawing assessment',
    },
    importantDates: [
      { title: 'Application Opens', date: 'September 2026', description: 'Portfolio and form upload' },
      { title: 'Application Closes', date: 'November 2026', description: 'Late fee period' },
      { title: 'DAT Prelims Exam', date: 'January 2027', description: 'Written & sketch assessment' },
      { title: 'DAT Mains (Studio Test)', date: 'April - May 2027', description: 'Material handling & interview' },
      { title: 'Final Merit List', date: 'June 2027', description: 'Weighted score allotment' },
    ],
    syllabusTopics: [
      'Design Theory: Visual perception, colour psychology, composition, perspective drawing',
      'Creativity: Ideation, innovative product conceptualization, storyboarding',
      'General Awareness: Design history, environmental craft, contemporary arts',
    ],
    participatingUniversities: [
      'National Institute of Design (NID Ahmedabad)',
      'NID Bangalore, NID Gandhinagar',
      'NID Haryana, NID Madhya Pradesh, NID Andhra Pradesh',
    ],
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
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&h=500&fit=crop',
    author: 'Er. Rajesh Sharma',
    authorRole: 'Senior Admissions Strategist',
    readTime: '6 min read',
    createdAt: new Date('2026-02-10T10:00:00.000Z'),
    tags: ['Engineering', 'Artificial Intelligence', 'Campus Placements', 'B.Tech Trends'],
    keyTakeaways: [
      'Artificial Intelligence & Machine Learning degrees command a 35% higher median starting CTC than traditional IT.',
      'Hardware renaissance: VLSI and Semiconductor Engineering are witnessing exponential hiring due to India Semiconductor Mission.',
      'Accredited universities with Tier-1 industry labs (NVIDIA, Intel, AWS) outperform general colleges in core placements.'
    ],
    content: `Engineering in India is experiencing a monumental transformation in 2026. While traditional Computer Science remains the evergreen foundation, recruiter demand has definitively pivoted toward specialized sub-disciplines.

### 1. Artificial Intelligence and Autonomous Systems
AI engineering programs that integrate deep learning, mathematical optimization, and large-scale model inference now command the highest campus packages in India. Tier-1 institutes and accredited private universities with dedicated GPU infrastructure report average starter offers between ₹ 14 LPA and ₹ 28 LPA.

### 2. Semiconductor Design & VLSI Engineering
Spurred by national investments under the India Semiconductor Mission, semiconductor giants and fabless design firms are aggressively hiring B.Tech graduates proficient in Verilog, SystemVerilog, and FPGA architecture.

### 3. Cyber Defense and Cloud Architecture
As financial infrastructure and health networks migrate to multi-cloud architectures, cybersecurity engineers specialized in zero-trust architectures and ethical exploitation rank among the most non-cyclical tech professions.

### What Aspirants Should Look For in 2026
When shortlisting engineering colleges, students must examine faculty research output, active corporate sponsored labs, and internship release percentages rather than relying on legacy branding alone.`,
    isPublished: true,
  },
  {
    _id: 'blog_2',
    title: 'Step-by-Step Guide: How to Select the Perfect B-School for MBA',
    slug: 'how-to-select-the-perfect-b-school-for-mba',
    category: 'Management',
    excerpt: 'Crucial checklist comparing ROI, median CTC packages, faculty mentorship, and international exchange programs.',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&h=500&fit=crop',
    author: 'Priya Iyer',
    authorRole: 'Executive MBA Consultant',
    readTime: '5 min read',
    createdAt: new Date('2026-02-05T09:30:00.000Z'),
    tags: ['MBA Admissions', 'CAT Exam', 'B-School ROI', 'Placement Analysis'],
    keyTakeaways: [
      'Never evaluate B-schools purely on highest domestic package; median CTC provides the truest measure of batch placement depth.',
      'Check course fees versus expected 2-year post-tax salary to calculate your real break-even ROI timeline.',
      'Alumni network density in your target industry (Consulting, BFSI, FMCG) is your biggest career asset.'
    ],
    content: `Choosing the right business school is arguably the most capital-intensive academic decision of your career. An MBA program involves significant tuition outlay coupled with opportunity costs.

### The Realistic Metric: Median CTC vs Batch Size
Many institutions highlight eye-catching international packages of ₹ 1 Crore+ secured by one or two candidates. The true operational health of a B-school is revealed by its median salary across the entire graduating cohort. A median salary of ₹ 18 LPA across 400 students is significantly more reliable than a top package outlier across 60 students.

### Industry Domain Specializations
- **Consulting & Strategy**: Premier IIMs, XLRI, and ISB dominate recruitment from McKinsey, BCG, Bain, and Big 4 advisory arms.
- **FinTech & Investment Banking**: Mumbai and Delhi-NCR based schools hold a strong locational advantage for treasury, PE/VC, and risk modeling roles.
- **Brand Management & E-Commerce**: Look for B-schools with strong live-project integration and summer internship conversion ratios.

### Evaluating Global Accreditations
Ensure your shortlisted MBA or PGDM program holds international Triple Crown accreditations (AACSB, AMBA, EQUIS) or at minimum NBA and AIU equivalence.`,
    isPublished: true,
  },
  {
    _id: 'blog_3',
    title: '5 Costly Mistakes Students Make During College Admission Counseling',
    slug: 'common-mistakes-students-make-during-counseling',
    category: 'Admissions',
    excerpt: 'Avoid choice filling blunders, missed document verification windows, and falling for unverified seat agents.',
    featuredImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1000&h=500&fit=crop',
    author: 'Dr. Sunita Varma',
    authorRole: 'Central Admissions Advisor',
    readTime: '7 min read',
    createdAt: new Date('2026-01-28T14:15:00.000Z'),
    tags: ['Counseling Guide', 'Seat Allocation', 'JoSAA', 'NEET Counseling'],
    keyTakeaways: [
      'Order of choice filling dictates seat allotment algorithms; never list a less-preferred institution above your dream choice.',
      'Keep standardized PDF document scans below 200KB ready ahead of the counselling portal launch.',
      'Beware of unverified third-party consultants demanding cash advances for "guaranteed" management quota seats.'
    ],
    content: `Every admission season, thousands of deserving candidates lose their rightful college seats not due to low percentiles, but because of administrative blunders during the multi-round counselling process.

### Mistake 1: Sub-Optimal Choice Filling Priority
Central counselling algorithms (such as JoSAA, CSAB, and MCC) evaluate choices sequentially from Option 1 downwards. If you place a lower-preference college at Rank 3, the algorithm will lock you into that seat immediately if your rank qualifies, completely bypassing superior institutions listed below it.

### Mistake 2: Missing the "Float", "Slide", or "Freeze" Deadlines
Students often assume their initial allotment is permanent and forget to exercise active willingness options. Failing to pay the seat acceptance fee within the designated 72-hour window results in immediate disqualification from all subsequent rounds.

### Mistake 3: Faulty Category & Domicile Documentation
OBC-NCL and EWS certificates must strictly adhere to the financial year guidelines (issued on or after April 1st of the current academic year). State format certificates are frequently rejected during Central counselling rounds.

### Mistake 4: Falling for Unverified "Direct Seat" Brokers
Always ensure application fees and seat reservation deposits are made exclusively via official university payment gateways. CaptonAdmission provides transparent guidance with zero middlemen.`,
    isPublished: true,
  },
  {
    _id: 'blog_4',
    title: 'Medical Education in India: NEET Cutoffs, Govt vs Private Colleges and Fee Structures',
    slug: 'medical-education-in-india-neet-cutoffs-fee-structures',
    category: 'Medical',
    excerpt: 'Navigating MBBS counseling, All India Quota versus State counseling, and realistic private college budget expectations.',
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&h=500&fit=crop',
    author: 'Dr. Sunita Varma',
    authorRole: 'Medical Admissions Director',
    readTime: '8 min read',
    createdAt: new Date('2026-01-20T11:45:00.000Z'),
    tags: ['NEET UG', 'MBBS Cutoffs', 'Medical Counseling', 'Govt Medical Colleges'],
    keyTakeaways: [
      '15% All India Quota (AIQ) requires top-tier marks (640+ in general category), while state domiciles offer higher probability.',
      'Deemed universities offer transparent centralized counseling but require budget planning of ₹ 60L to ₹ 1.1 Crore for full course.',
      'Alternative medical degrees like BDS, BAMS (Ayurveda), and B.Sc Nursing provide rewarding healthcare careers with high ROI.'
    ],
    content: `With over 24 Lakh students competing for approximately 1.05 Lakh MBBS seats in India, NEET UG represents one of the world's most competitive entrance examinations.

### Understanding the Seat Matrix
- **AIQ (All India Quota - 15%)**: Open to all Indian nationals across all government medical colleges, administered by the Medical Counselling Committee (MCC).
- **State Quota (85%)**: Reserved exclusively for state domicile holders. Cutoffs here are generally 20 to 50 marks lower than AIQ, making state counselling your primary focus.
- **Deemed Universities**: Centrally counselled by MCC without state domicile restrictions, offering world-class tertiary care teaching hospitals.

### Budgeting for Private Medical Colleges
Tuition fees at premier private medical institutions range between ₹ 14 Lakhs and ₹ 25 Lakhs per annum. Adding hostel, mess, and clinical exam charges requires families to plan a total financial horizon of approximately ₹ 75 to 90 Lakhs.

### Exploring Allied Healthcare: The Rising Prominence of Nursing & Biotechnology
For students with percentiles in the 70-85 range, B.Sc Nursing and Biomedical Engineering offer immediate global employment opportunities across premier private hospitals in India, the UK, Australia, and the Middle East.`,
    isPublished: true,
  },
  {
    _id: 'blog_5',
    title: 'Step-by-Step Guide to Securing Education Loans for Higher Studies in India',
    slug: 'step-by-step-guide-to-securing-education-loans-india',
    category: 'Financial Aid',
    excerpt: 'Learn about Vidya Lakshmi portal, collateral-free thresholds up to 7.5 Lakhs, and interest subsidy schemes.',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&h=500&fit=crop',
    author: 'Financial Advisory Desk',
    authorRole: 'Student Finance Expert',
    readTime: '6 min read',
    createdAt: new Date('2026-01-15T08:00:00.000Z'),
    tags: ['Education Loan', 'Vidya Lakshmi', 'Collateral-free Loan', 'Subsidies'],
    keyTakeaways: [
      'Under the government CGFSEL scheme, education loans up to ₹ 7.5 Lakhs require zero property collateral or third-party guarantee.',
      'The Vidya Lakshmi portal allows students to submit a single loan application to multiple nationalized banks simultaneously.',
      'Central Sector Interest Subsidy (CSIS) covers 100% of interest charges during the study moratorium for eligible families.'
    ],
    content: `Financial limitations should never stand between a meritorious student and their higher education aspirations. The government and banking sector provide robust financial frameworks designed to empower students.

### Key Government Loan Schemes
1. **Collateral-Free Bracket (Up to ₹ 7.5 Lakhs)**: Banks cannot demand real estate or fixed deposits as collateral. A parent acts as co-borrower.
2. **Vidya Lakshmi Portal**: The single-window portal developed by the Department of Financial Services (DFS) enables application tracking across public sector banks like SBI, PNB, and Bank of Baroda.
3. **Interest Subsidy (CSIS)**: Available for economically disadvantaged students (annual family income up to ₹ 4.5 Lakhs) pursuing technical or professional degrees.

### Necessary Documents for Expedited Sanction
- Confirmed University Admission Letter with full fee structure breakdown
- Class 10th and 12th original marksheets and passing certificates
- KYC documents (Aadhaar, PAN) of student and co-applicant
- Income proof of co-applicant (ITR of last 2 years / Form 16 / Salary Slips)
- Six-month audited bank statement of salary account`,
    isPublished: true,
  },
  {
    _id: 'blog_6',
    title: 'CUET UG 2026: Complete Strategy, Subject Mapping & Normalization Explained',
    slug: 'cuet-ug-2026-complete-strategy-subject-mapping',
    category: 'Entrance Exams',
    excerpt: 'Demystifying domain subject choices, general test strategies, and university eligibility matrices for Delhi University, BHU, and JNU.',
    featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&h=500&fit=crop',
    author: 'Er. Rajesh Sharma',
    authorRole: 'National Exam Strategist',
    readTime: '7 min read',
    createdAt: new Date('2026-01-08T12:00:00.000Z'),
    tags: ['CUET UG', 'Delhi University', 'Subject Mapping', 'NTA Exams'],
    keyTakeaways: [
      'Delhi University strictly mandates selecting only those domain subjects in CUET that you studied and passed in Class 12.',
      'General Test (Section III) is compulsory for high-demand programs like BMS, BBA-FIA, and BBE.',
      'Hybrid exam format combines Computer-Based Testing (CBT) and Pen-Paper OMR sheets for high-volume subjects.'
    ],
    content: `The Common University Entrance Test (CUET UG) has democratized admissions to more than 250 Central, State, Deemed, and Private universities across India.

### Section Breakdown & Strategy
- **Section I (Languages)**: Focus on vocabulary in context, reading comprehension, and literary aptitude. English and Hindi remain the most widely chosen mediums.
- **Section II (Domain Subjects)**: Direct NCERT Class 12 syllabus mapping. Thorough mastery of NCERT textbook exemplars and back-of-chapter problems is sufficient to score 100 percentiles.
- **Section III (General Test)**: Tests numerical ability, general mental ability, logical and analytical reasoning, and current affairs.

### University Eligibility Rules (Crucial Caveat)
Each participating university maintains autonomous eligibility criteria. For instance, Delhi University (DU) requires candidates to appear only in the subjects they passed in their Class 12 board exams, while other institutions permit attempting alternate domain subjects. Always cross-verify university eligibility matrices on CaptonAdmission before finalizing your test subjects.`,
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

let users = [
  {
    _id: 'usr_admin',
    name: 'Super Administrator',
    email: 'admin@captonadmission.com',
    password: 'Admin@12345',
    phone: '07895726762',
    role: 'superadmin',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    _id: 'usr_admin_2',
    name: 'Admissions Officer (Admin)',
    email: 'admissions@captonadmission.com',
    password: 'Admin@12345',
    phone: '+91 9811122334',
    role: 'admin',
    isActive: true,
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    _id: 'usr_counsellor',
    name: 'Dr. Rajesh Sharma',
    email: 'counsellor@captonadmission.com',
    password: 'Counsellor@12345',
    phone: '+91 9876543211',
    role: 'counsellor',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'usr_student',
    name: 'Aarav Patel',
    email: 'student@captonadmission.com',
    password: 'Student@12345',
    phone: '+91 9876543212',
    role: 'student',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

let enquiries = [
  {
    _id: 'enq_1',
    enquiryNumber: 'ENQ-2026-10482',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98765 43210',
    courseName: 'B.Tech in Computer Science & Engineering',
    universityName: 'Delhi Technological University (DTU)',
    city: 'New Delhi',
    state: 'Delhi',
    interestedInAbroad: false,
    interestedInOnline: false,
    status: 'New',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    _id: 'enq_2',
    enquiryNumber: 'ENQ-2026-92147',
    name: 'Ananya Verma',
    email: 'ananya.v@yahoo.com',
    phone: '+91 98111 22334',
    courseName: 'MBBS / Medical Degrees',
    universityName: 'Vellore Institute of Technology (VIT)',
    city: 'Mumbai',
    state: 'Maharashtra',
    interestedInAbroad: true,
    interestedInOnline: false,
    status: 'New',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
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
          u.location?.state?.toLowerCase().includes(q) ||
          u.location?.country?.toLowerCase().includes(q)
      );
    }
    if (query.country && query.country !== 'All' && query.country !== 'All Countries') {
      result = result.filter((u) => (u.location?.country || 'India').toLowerCase() === query.country.toLowerCase());
    }
    if (query.state && query.state !== 'All' && query.state !== 'All States' && query.state !== 'All States / Regions') {
      result = result.filter((u) => u.location?.state?.toLowerCase() === query.state.toLowerCase());
    }
    if (query.universityType && query.universityType !== 'All' && query.universityType !== 'All Types') {
      result = result.filter((u) => u.universityType === query.universityType);
    }
    if (query.limit) {
      result = result.slice(0, Number(query.limit));
    }
    return result;
  },
  getUniversityBySlug: (slug) => universities.find((u) => u.slug === slug) || null,
  getServices: (query = {}) => {
    let result = [...services];
    if (query.category && query.category !== 'All') {
      result = result.filter((s) => s.category?.toLowerCase() === query.category.toLowerCase());
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          (s.category && s.category.toLowerCase().includes(q))
      );
    }
    return result;
  },
  getServiceBySlug: (slug) => services.find((s) => s.slug === slug) || null,
  getExams: (query = {}) => {
    let result = [...exams];
    if (query.stream && query.stream !== 'All') {
      result = result.filter((e) => e.stream.toLowerCase().includes(query.stream.toLowerCase()) || e.stream === 'All Streams');
    }
    if (query.examLevel && query.examLevel !== 'All') {
      result = result.filter((e) => e.examLevel === query.examLevel);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        (e.conductingBody && e.conductingBody.toLowerCase().includes(q)) ||
        e.stream.toLowerCase().includes(q)
      );
    }
    return result;
  },
  getExamBySlug: (slug) => exams.find((e) => e.slug === slug) || null,
  getBlogs: (query = {}) => {
    let result = [...blogs];
    const limit = typeof query === 'object' ? query.limit : query;
    const category = typeof query === 'object' ? query.category : null;
    const search = typeof query === 'object' ? query.search : null;

    if (category && category !== 'All') {
      result = result.filter((b) => b.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          (b.category && b.category.toLowerCase().includes(q))
      );
    }
    if (limit) {
      result = result.slice(0, Number(limit));
    }
    return result;
  },
  getBlogBySlug: (slug) => blogs.find((b) => b.slug === slug) || null,
  getTestimonials: () => testimonials,
  getCMS: () => cms,
  getMappings: (courseId) => {
    let matched = [];
    if (courseId) {
      matched = mappings.filter(
        (m) => (m.course?._id === courseId || m.course?.slug === courseId || m.course === courseId)
      );
    } else {
      matched = mappings;
    }
    if (matched.length > 0) return matched;

    // Dynamic fallback: If no explicit mapping exists yet for this course (e.g. course_2 AI/ML),
    // generate mappings with top accredited universities so students always see verified colleges offering this degree!
    const targetCourse = courses.find((c) => c._id === courseId || c.slug === courseId) || courses[0];
    return universities.slice(0, 6).map((uni, idx) => ({
      _id: `map_dyn_${targetCourse._id}_${uni._id}`,
      course: targetCourse,
      university: uni,
      specialization: (targetCourse.specializations && targetCourse.specializations[0]) || 'General',
      duration: targetCourse.duration || '4 Years',
      eligibility: targetCourse.eligibility || '10+2 with PCM (Min 60%)',
      totalFees: (targetCourse.averageFeeRange?.min || 150000) * 4 + idx * 25000,
      applicationFees: 1200 + idx * 100,
      admissionStatus: 'Open',
      placementInfo: {
        averagePackage: uni.placementOverview?.averagePackage || '₹ 10.5 LPA',
        highestPackage: uni.placementOverview?.highestPackage || '₹ 48 LPA',
        placementPercent: '95%',
      },
      isPublished: true,
    }));
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
  getEnquiries: (query = {}) => {
    let result = [...enquiries];
    if (query.status && query.status !== 'All') {
      result = result.filter((e) => e.status === query.status);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.phone?.includes(q) ||
          e.enquiryNumber?.toLowerCase().includes(q)
      );
    }
    return result;
  },
  addEnquiry: (data) => {
    const item = {
      _id: `enq_${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
      ...data,
    };
    enquiries.unshift(item);
    return item;
  },
  updateEnquiryStatus: (id, status, note) => {
    const item = enquiries.find((e) => e._id === id || e.enquiryNumber === id);
    if (item) {
      item.status = status;
      if (note) {
        if (!item.followUpNotes) item.followUpNotes = [];
        item.followUpNotes.push({ note, date: new Date().toISOString() });
      }
      return item;
    }
    return null;
  },
  // Admin & User access store
  getUsers: () => users,
  getUserById: (id) => users.find((u) => u._id === id),
  getUserByEmail: (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  addUser: (userData) => {
    const newUser = {
      _id: `usr_${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      ...userData,
    };
    users.unshift(newUser);
    return newUser;
  },
  updateUser: (id, updates) => {
    const idx = users.findIndex((u) => u._id === id || u.email.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
      return users[idx];
    }
    return null;
  },
  deleteUser: (id) => {
    const idx = users.findIndex((u) => u._id === id || u.email.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      const removed = users.splice(idx, 1);
      return removed[0];
    }
    return null;
  },
};
