export interface Chapter {
  id: string;
  num: number;
  title: string;
  titlePunjabi: string;
  keyTopics: string[];
}

export interface SubjectSyllabus {
  subject: string;
  classNum: number;
  chapters: Chapter[];
}

export const PSEB_SYLLABUS: SubjectSyllabus[] = [
  {
    subject: 'Science', classNum: 10,
    chapters: [
      { id: 's10-c1', num: 1, title: 'Chemical Reactions and Equations', titlePunjabi: 'ਰਸਾਇਣਿਕ ਕਿਰਿਆਵਾਂ ਅਤੇ ਸਮੀਕਰਣ', keyTopics: ['Chemical equations', 'Balancing equations', 'Types of reactions'] },
      { id: 's10-c2', num: 2, title: 'Acids, Bases and Salts', titlePunjabi: 'ਐਸਿਡ, ਬੇਸ ਅਤੇ ਲੂਣ', keyTopics: ['pH scale', 'Indicators', 'Salt formation'] },
      { id: 's10-c3', num: 3, title: 'Metals and Non-metals', titlePunjabi: 'ਧਾਤਾਂ ਅਤੇ ਅਧਾਤਾਂ', keyTopics: ['Properties', 'Reactivity series', 'Corrosion'] },
      { id: 's10-c4', num: 4, title: 'Carbon and its Compounds', titlePunjabi: 'ਕਾਰਬਨ ਅਤੇ ਇਸ ਦੇ ਯੌਗਿਕ', keyTopics: ['Organic chemistry', 'Hydrocarbons', 'Functional groups'] },
      { id: 's10-c5', num: 5, title: 'Life Processes', titlePunjabi: 'ਜੀਵਨ ਪ੍ਰਕਿਰਿਆਵਾਂ', keyTopics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion'] },
      { id: 's10-c6', num: 6, title: 'Control and Coordination', titlePunjabi: 'ਨਿਯੰਤਰਣ ਅਤੇ ਤਾਲਮੇਲ', keyTopics: ['Nervous system', 'Hormones', 'Reflex action'] },
      { id: 's10-c7', num: 7, title: 'How do Organisms Reproduce?', titlePunjabi: 'ਜੀਵ ਕਿਵੇਂ ਪ੍ਰਜਨਨ ਕਰਦੇ ਹਨ?', keyTopics: ['Asexual reproduction', 'Sexual reproduction', 'DNA'] },
      { id: 's10-c8', num: 8, title: 'Heredity and Evolution', titlePunjabi: 'ਵੰਸ਼ਾਨੁਗਤੀ ਅਤੇ ਵਿਕਾਸ', keyTopics: ['Mendel laws', 'Natural selection', 'Evolution'] },
      { id: 's10-c9', num: 9, title: 'Light — Reflection and Refraction', titlePunjabi: 'ਪ੍ਰਕਾਸ਼ — ਪਰਾਵਰਤਨ ਅਤੇ ਅਪਵਰਤਨ', keyTopics: ['Mirror formula', 'Lens formula', 'Refraction'] },
      { id: 's10-c10', num: 10, title: 'Human Eye and Colourful World', titlePunjabi: 'ਮਨੁੱਖੀ ਅੱਖ ਅਤੇ ਰੰਗੀਨ ਸੰਸਾਰ', keyTopics: ['Eye structure', 'Defects', 'Dispersion'] },
      { id: 's10-c11', num: 11, title: 'Electricity', titlePunjabi: 'ਬਿਜਲੀ', keyTopics: ["Ohm's law", 'Circuits', 'Resistance'] },
      { id: 's10-c12', num: 12, title: 'Magnetic Effects of Electric Current', titlePunjabi: 'ਬਿਜਲੀ ਧਾਰਾ ਦੇ ਚੁੰਬਕੀ ਪ੍ਰਭਾਵ', keyTopics: ['Electromagnet', 'Motor', 'Generator'] },
      { id: 's10-c13', num: 13, title: 'Our Environment', titlePunjabi: 'ਸਾਡਾ ਵਾਤਾਵਰਣ', keyTopics: ['Ecosystem', 'Food chain', 'Ozone'] },
      { id: 's10-c14', num: 14, title: 'Management of Natural Resources', titlePunjabi: 'ਕੁਦਰਤੀ ਸਾਧਨਾਂ ਦਾ ਪ੍ਰਬੰਧਨ', keyTopics: ['Conservation', 'Sustainable development'] },
    ]
  },
  {
    subject: 'Mathematics', classNum: 10,
    chapters: [
      { id: 'm10-c1', num: 1, title: 'Real Numbers', titlePunjabi: 'ਅਸਲ ਸੰਖਿਆਵਾਂ', keyTopics: ['Euclid algorithm', 'Irrational numbers', 'Fundamental theorem'] },
      { id: 'm10-c2', num: 2, title: 'Polynomials', titlePunjabi: 'ਬਹੁਪਦ', keyTopics: ['Zeroes', 'Division algorithm', 'Quadratic polynomials'] },
      { id: 'm10-c3', num: 3, title: 'Linear Equations', titlePunjabi: 'ਰੇਖਿਕ ਸਮੀਕਰਣ', keyTopics: ['Substitution', 'Elimination', 'Cross multiplication'] },
      { id: 'm10-c4', num: 4, title: 'Quadratic Equations', titlePunjabi: 'ਦੋਪਦੀ ਸਮੀਕਰਣ', keyTopics: ['Factoring', 'Quadratic formula', 'Discriminant'] },
      { id: 'm10-c5', num: 5, title: 'Arithmetic Progressions', titlePunjabi: 'ਅੰਕਗਣਿਤ ਲੜੀ', keyTopics: ['AP formula', 'Sum of AP', 'nth term'] },
      { id: 'm10-c6', num: 6, title: 'Triangles', titlePunjabi: 'ਤਿਕੋਣ', keyTopics: ['Similarity', 'BPT theorem', 'Pythagoras'] },
      { id: 'm10-c7', num: 7, title: 'Coordinate Geometry', titlePunjabi: 'ਕੋਆਰਡੀਨੇਟ ਜਿਓਮੈਟਰੀ', keyTopics: ['Distance formula', 'Section formula', 'Area'] },
      { id: 'm10-c8', num: 8, title: 'Introduction to Trigonometry', titlePunjabi: 'ਤਿਕੋਣਮਿਤੀ ਦੀ ਜਾਣਪਛਾਣ', keyTopics: ['Ratios', 'Identities', 'Complementary angles'] },
      { id: 'm10-c9', num: 9, title: 'Applications of Trigonometry', titlePunjabi: 'ਤਿਕੋਣਮਿਤੀ ਦੇ ਉਪਯੋਗ', keyTopics: ['Heights and distances', 'Angle of elevation'] },
      { id: 'm10-c10', num: 10, title: 'Circles', titlePunjabi: 'ਚੱਕਰ', keyTopics: ['Tangents', 'Chord', 'Angle in semicircle'] },
      { id: 'm10-c11', num: 11, title: 'Areas Related to Circles', titlePunjabi: 'ਚੱਕਰਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ', keyTopics: ['Sector area', 'Segment area'] },
      { id: 'm10-c12', num: 12, title: 'Surface Areas and Volumes', titlePunjabi: 'ਸਤ੍ਹਾ ਖੇਤਰਫਲ ਅਤੇ ਆਇਤਨ', keyTopics: ['Combination of solids', 'Frustum'] },
      { id: 'm10-c13', num: 13, title: 'Statistics', titlePunjabi: 'ਅੰਕੜਾ ਵਿਗਿਆਨ', keyTopics: ['Mean', 'Median', 'Mode'] },
      { id: 'm10-c14', num: 14, title: 'Probability', titlePunjabi: 'ਸੰਭਾਵਨਾ', keyTopics: ['Classical probability', 'Events', 'Complementary events'] },
    ]
  },
  {
    subject: 'Social Science', classNum: 10,
    chapters: [
      { id: 'sst10-c1', num: 1, title: 'Resources and Development', titlePunjabi: 'ਸਾਧਨ ਅਤੇ ਵਿਕਾਸ', keyTopics: ['Types of resources', 'Land use', 'Soil conservation'] },
      { id: 'sst10-c2', num: 2, title: 'Nationalism in India', titlePunjabi: 'ਭਾਰਤ ਵਿੱਚ ਰਾਸ਼ਟਰਵਾਦ', keyTopics: ['Non-cooperation', 'Civil disobedience', 'Salt march'] },
      { id: 'sst10-c3', num: 3, title: 'Power Sharing', titlePunjabi: 'ਸ਼ਕਤੀ ਦੀ ਵੰਡ', keyTopics: ['Federalism', 'Belgium & Sri Lanka', 'Forms of power sharing'] },
      { id: 'sst10-c4', num: 4, title: 'Development', titlePunjabi: 'ਵਿਕਾਸ', keyTopics: ['Income', 'HDI', 'Sustainability'] },
      { id: 'sst10-c5', num: 5, title: 'The Making of a Global World', titlePunjabi: 'ਵਿਸ਼ਵੀ ਸੰਸਾਰ ਦਾ ਨਿਰਮਾਣ', keyTopics: ['Trade', 'Globalisation', 'Great Depression'] },
      { id: 'sst10-c6', num: 6, title: 'Water Resources', titlePunjabi: 'ਜਲ ਸਾਧਨ', keyTopics: ['Dams', 'Rainwater harvesting', 'Scarcity'] },
    ]
  },
  {
    subject: 'English', classNum: 10,
    chapters: [
      { id: 'en10-c1', num: 1, title: 'Reading Comprehension', titlePunjabi: 'ਪੜ੍ਹਨ ਸਮਝ', keyTopics: ['Unseen passages', 'Inference', 'Vocabulary'] },
      { id: 'en10-c2', num: 2, title: 'Grammar', titlePunjabi: 'ਵਿਆਕਰਣ', keyTopics: ['Tenses', 'Modals', 'Voice', 'Narration'] },
      { id: 'en10-c3', num: 3, title: 'Writing Skills', titlePunjabi: 'ਲਿਖਣ ਹੁਨਰ', keyTopics: ['Letter writing', 'Paragraph', 'Notice', 'Story'] },
      { id: 'en10-c4', num: 4, title: 'Literature — Prose', titlePunjabi: 'ਸਾਹਿਤ — ਵਾਰਤਕ', keyTopics: ['Themes', 'Characters', 'Summary'] },
      { id: 'en10-c5', num: 5, title: 'Literature — Poetry', titlePunjabi: 'ਸਾਹਿਤ — ਕਵਿਤਾ', keyTopics: ['Figures of speech', 'Theme', 'Central idea'] },
    ]
  },
  {
    subject: 'Science', classNum: 9,
    chapters: [
      { id: 's9-c1', num: 1, title: 'Matter in Our Surroundings', titlePunjabi: 'ਸਾਡੇ ਆਲੇ-ਦੁਆਲੇ ਪਦਾਰਥ', keyTopics: ['States of matter', 'Evaporation', 'Latent heat'] },
      { id: 's9-c2', num: 2, title: 'Is Matter Around Us Pure', titlePunjabi: 'ਕੀ ਪਦਾਰਥ ਸ਼ੁੱਧ ਹੈ', keyTopics: ['Mixtures', 'Solutions', 'Separation techniques'] },
      { id: 's9-c3', num: 3, title: 'Atoms and Molecules', titlePunjabi: 'ਪਰਮਾਣੂ ਅਤੇ ਅਣੂ', keyTopics: ['Mole concept', 'Atomic mass', 'Chemical formulae'] },
      { id: 's9-c4', num: 4, title: 'Structure of the Atom', titlePunjabi: 'ਪਰਮਾਣੂ ਦੀ ਬਣਤਰ', keyTopics: ['Models', 'Valency', 'Isotopes'] },
      { id: 's9-c5', num: 5, title: 'The Fundamental Unit of Life', titlePunjabi: 'ਜੀਵਨ ਦੀ ਮੂਲ ਇਕਾਈ', keyTopics: ['Cell', 'Organelles', 'Diffusion & osmosis'] },
      { id: 's9-c6', num: 6, title: 'Motion', titlePunjabi: 'ਗਤੀ', keyTopics: ['Equations of motion', 'Velocity', 'Acceleration'] },
      { id: 's9-c7', num: 7, title: 'Force and Laws of Motion', titlePunjabi: 'ਬਲ ਅਤੇ ਗਤੀ ਦੇ ਨਿਯਮ', keyTopics: ["Newton's laws", 'Momentum', 'Inertia'] },
      { id: 's9-c8', num: 8, title: 'Gravitation', titlePunjabi: 'ਗੁਰੂਤਾ', keyTopics: ['Universal law', 'Free fall', 'Buoyancy'] },
    ]
  },
  {
    subject: 'Mathematics', classNum: 9,
    chapters: [
      { id: 'm9-c1', num: 1, title: 'Number Systems', titlePunjabi: 'ਸੰਖਿਆ ਪ੍ਰਣਾਲੀ', keyTopics: ['Rational & irrational', 'Real numbers', 'Laws of exponents'] },
      { id: 'm9-c2', num: 2, title: 'Polynomials', titlePunjabi: 'ਬਹੁਪਦ', keyTopics: ['Degree', 'Remainder theorem', 'Factorisation'] },
      { id: 'm9-c3', num: 3, title: 'Coordinate Geometry', titlePunjabi: 'ਕੋਆਰਡੀਨੇਟ ਜਿਓਮੈਟਰੀ', keyTopics: ['Cartesian plane', 'Plotting points'] },
      { id: 'm9-c4', num: 4, title: 'Linear Equations in Two Variables', titlePunjabi: 'ਦੋ ਚਲਾਂ ਵਾਲੇ ਰੇਖਿਕ ਸਮੀਕਰਣ', keyTopics: ['Solutions', 'Graph', 'Standard form'] },
      { id: 'm9-c5', num: 5, title: 'Triangles', titlePunjabi: 'ਤਿਕੋਣ', keyTopics: ['Congruence', 'Criteria', 'Properties'] },
      { id: 'm9-c6', num: 6, title: 'Heron\u2019s Formula', titlePunjabi: 'ਹੀਰੋਨ ਦਾ ਸੂਤਰ', keyTopics: ['Area of triangle', 'Quadrilaterals'] },
      { id: 'm9-c7', num: 7, title: 'Surface Areas and Volumes', titlePunjabi: 'ਸਤ੍ਹਾ ਖੇਤਰਫਲ ਅਤੇ ਆਇਤਨ', keyTopics: ['Cylinder', 'Cone', 'Sphere'] },
      { id: 'm9-c8', num: 8, title: 'Statistics', titlePunjabi: 'ਅੰਕੜਾ ਵਿਗਿਆਨ', keyTopics: ['Bar graphs', 'Histograms', 'Mean & median'] },
    ]
  },
  {
    subject: 'Science', classNum: 8,
    chapters: [
      { id: 's8-c1', num: 1, title: 'Crop Production and Management', titlePunjabi: 'ਫ਼ਸਲ ਉਤਪਾਦਨ ਅਤੇ ਪ੍ਰਬੰਧਨ', keyTopics: ['Agricultural practices', 'Irrigation', 'Crop protection'] },
      { id: 's8-c2', num: 2, title: 'Microorganisms', titlePunjabi: 'ਸੂਖਮ ਜੀਵ', keyTopics: ['Friendly microbes', 'Diseases', 'Food preservation'] },
      { id: 's8-c3', num: 3, title: 'Coal and Petroleum', titlePunjabi: 'ਕੋਲਾ ਅਤੇ ਪੈਟਰੋਲੀਅਮ', keyTopics: ['Fossil fuels', 'Natural resources', 'Conservation'] },
      { id: 's8-c4', num: 4, title: 'Combustion and Flame', titlePunjabi: 'ਜਲਣ ਅਤੇ ਲਾਟ', keyTopics: ['Types of combustion', 'Fuel efficiency', 'Flame zones'] },
      { id: 's8-c5', num: 5, title: 'Force and Pressure', titlePunjabi: 'ਬਲ ਅਤੇ ਦਬਾਅ', keyTopics: ['Types of forces', 'Pressure', 'Atmospheric pressure'] },
      { id: 's8-c6', num: 6, title: 'Light', titlePunjabi: 'ਪ੍ਰਕਾਸ਼', keyTopics: ['Reflection', 'Human eye', 'Dispersion'] },
    ]
  },
];

export function getSyllabus(subject: string, classNum: number): SubjectSyllabus | undefined {
  return PSEB_SYLLABUS.find(s => s.subject === subject && s.classNum === classNum);
}
