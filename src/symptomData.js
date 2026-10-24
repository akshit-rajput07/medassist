// Clinical knowledge base for MedAssist (AKTU Mini Project BCC351).
//
// Each rule maps a set of keyword phrases to one triage outcome.
//   id                – stable identifier, quoted in the report and shown in the UI
//   level             – 'Emergency' | 'Medical Consultation' | 'General Guidance'
//   title             – short headline shown on the result tag
//   keywords          – phrases matched against the user's (normalised) text
//   contacts          – optional; overrides the default emergency call buttons
//
// Rule order does NOT decide priority. The engine ranks matched rules by level,
// then by how many keywords matched (see triageEngine.js).
//
// Educational prototype: content is a simplified summary of common first-aid and
// triage guidance and has not been clinically validated.

export const SYMPTOM_DATASET = [
  // ==========================================
  // 1. CARDIOVASCULAR & RESPIRATORY EMERGENCY
  // ==========================================
  {
    id: 'EMG-CV-01',
    level: 'Emergency',
    title: 'Chest pain with heart attack warning signs',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'chest pain', 'chest hurt', 'chest discomfort', 'pain in chest', 'pain in my chest',
      'tightness in chest', 'chest tightness', 'tight chest', 'chest pressure', 'pressure in chest',
      'heaviness in chest', 'chest heaviness', 'left arm pain', 'pain in left arm', 'jaw pain',
      'angina', 'crushing chest', 'heart attack',
    ],
    possibleConditions: ['Acute Coronary Syndrome', 'Myocardial Infarction (Heart Attack)'],
    summary: 'Acute chest pain with radiating discomfort strongly points to myocardial ischemia.',
    recommendedAction: 'Call emergency medical services immediately. Avoid physical exertion and chew an aspirin if recommended by paramedics.',
    specialist: 'Cardiologist / Emergency Medicine',
    timeframe: 'Immediate (0–15 mins)',
  },
  {
    id: 'EMG-RESP-02',
    level: 'Emergency',
    title: 'Severe difficulty breathing',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'shortness of breath', 'short of breath', 'cannot breathe', 'not able to breathe',
      'difficulty breathing', 'difficulty in breathing', 'trouble breathing', 'struggling to breathe',
      'breathless', 'gasping', 'blue lips', 'cyanosis', 'stridor', 'choking',
      'coughing up blood', 'coughing blood', 'cough with blood',
    ],
    possibleConditions: ['Severe Asthma Attack', 'Pulmonary Embolism', 'Acute Respiratory Distress Syndrome (ARDS)'],
    summary: 'Critical compromise of upper or lower airway ventilation detected.',
    recommendedAction: 'Seek immediate emergency resuscitation. Sit upright and use rescue inhalers if prescribed.',
    specialist: 'Pulmonologist / ER Resuscitation',
    timeframe: 'Immediate (0–15 mins)',
  },

  // ==========================================
  // 2. NEUROLOGICAL EMERGENCY
  // ==========================================
  {
    id: 'EMG-NEURO-03',
    level: 'Emergency',
    title: 'Stroke warning signs',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'slurred', 'slurring', 'facial droop', 'face droop', 'drooping face', 'arm weakness',
      'weakness on one side', 'one sided weakness', 'numbness on one side', 'numbness in one side',
      'sudden paralysis', 'paralysis', 'sudden weakness', 'sudden numbness', 'sudden confusion',
      'loss of speech', 'cannot speak', 'trouble speaking', 'difficulty speaking',
    ],
    possibleConditions: ['Acute Ischemic Stroke', 'Hemorrhagic Stroke', 'Transient Ischemic Attack (TIA)'],
    summary: 'Focal neurological deficits indicate potential acute cerebrovascular infarction (FAST criteria matched).',
    recommendedAction: 'Initiate emergency stroke response immediately. Note the exact onset timestamp.',
    specialist: 'Neurologist / Stroke Unit',
    timeframe: 'Immediate (Gold Hour: < 60 mins)',
  },
  {
    id: 'EMG-NEURO-04',
    level: 'Emergency',
    title: 'Seizure or loss of consciousness',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'seizure', 'convulsion', 'fainting', 'fainted', 'feel faint', 'feeling faint', 'unconscious',
      'unresponsive', 'passed out', 'passing out', 'collapse', 'blackout', 'epilepsy fit',
    ],
    possibleConditions: ['Status Epilepticus', 'Syncope / Cardiac Arrhythmia', 'Severe Hypoglycemia'],
    summary: 'Transient or prolonged loss of consciousness paired with involuntary neuromuscular activity.',
    recommendedAction: 'Place patient in recovery position, protect head, do not insert anything in mouth, call emergency care.',
    specialist: 'Neurologist / Emergency Care',
    timeframe: 'Immediate',
  },
  {
    id: 'EMG-NEURO-05',
    level: 'Emergency',
    title: 'Severe headache with danger signs',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'worst headache', 'thunderclap', 'stiff neck with fever', 'neck stiffness with fever',
      'head trauma bleeding',
    ],
    possibleConditions: ['Subarachnoid Hemorrhage', 'Acute Bacterial Meningitis'],
    summary: 'Sudden high-intensity cephalic pain or meningeal irritation signs present.',
    recommendedAction: 'Immediate neurological triage required to rule out intracranial hemorrhage or infection.',
    specialist: 'Neurosurgeon / ER Specialist',
    timeframe: 'Immediate',
  },

  // ==========================================
  // 3. ABDOMINAL, TRAUMA & OTHER EMERGENCY
  // ==========================================
  {
    id: 'EMG-ABD-06',
    level: 'Emergency',
    title: 'Severe abdominal pain or internal bleeding',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'severe lower right abdominal pain', 'lower right abdominal pain', 'rebound tenderness',
      'vomiting blood', 'vomited blood', 'blood in vomit', 'coffee ground',
      'black tarry stool', 'black stool',
    ],
    possibleConditions: ['Acute Appendicitis with Perforation', 'Upper Gastrointestinal Bleed', 'Ectopic Pregnancy Rupture'],
    summary: 'Acute abdomen or gastrointestinal vascular compromise.',
    recommendedAction: 'Do not eat or drink anything. Proceed directly to surgical emergency for acute abdomen assessment.',
    specialist: 'General Surgeon / Gastroenterologist',
    timeframe: 'Immediate (< 2 Hours)',
  },
  {
    id: 'EMG-TRAUMA-07',
    level: 'Emergency',
    title: 'Serious bleeding or injury',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'severe bleeding', 'uncontrolled bleeding', 'heavy bleeding', 'bleeding heavily',
      'bleeding will not stop', 'compound fracture', 'open fracture', 'bone sticking out',
      'deep stab wound', 'stab wound',
    ],
    possibleConditions: ['Hemorrhagic Shock', 'Open Fracture Traumatic Injury'],
    summary: 'Traumatic tissue disruption with arterial/venous compromise.',
    recommendedAction: 'Apply direct pressure using clean cloth to stop bleeding. Elevate affected limb and seek trauma unit care.',
    specialist: 'Trauma Surgeon / Orthopedics',
    timeframe: 'Immediate',
  },
  {
    id: 'EMG-ALLERGY-08',
    level: 'Emergency',
    title: 'Severe allergic reaction',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'severe allergic reaction', 'anaphylaxis', 'throat closing', 'throat is closing',
      'throat swelling', 'throat is swelling', 'throat swollen', 'tongue swelling', 'swollen tongue',
      'tongue swollen', 'tongue is swollen', 'swollen lips', 'lips swelling', 'lips swollen',
      'lips are swollen', 'swollen face', 'face swelling', 'face swollen', 'face is swollen',
    ],
    possibleConditions: ['Anaphylaxis', 'Angioedema'],
    summary: 'Swelling of the face, lips, tongue or throat can block the airway within minutes.',
    recommendedAction: 'Call emergency services immediately. Use an adrenaline auto-injector if one has been prescribed. Do not eat or drink anything.',
    specialist: 'Emergency Medicine',
    timeframe: 'Immediate (0–15 mins)',
  },
  {
    id: 'EMG-BITE-09',
    level: 'Emergency',
    title: 'Snake or animal bite',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'snake bite', 'snakebite', 'bitten by a snake', 'bitten by snake', 'dog bite',
      'bitten by a dog', 'bitten by dog', 'monkey bite', 'bitten by a monkey',
      'cat bite', 'animal bite', 'rabid',
    ],
    possibleConditions: ['Venomous snakebite', 'Rabies exposure risk', 'Wound infection'],
    summary: 'Snake and animal bites can need antivenom or rabies vaccination within hours.',
    recommendedAction: 'Go to the nearest hospital now. Keep the person calm and the bitten limb still; do not cut, suck or tie the wound. For animal bites, wash the wound with soap and running water for 15 minutes on the way or first.',
    specialist: 'Emergency Medicine',
    timeframe: 'Immediate (within the hour)',
  },
  {
    id: 'EMG-MH-10',
    level: 'Emergency',
    title: 'You do not have to face this alone',
    badge: 'High Risk / Emergency Level 3',
    keywords: [
      'suicidal', 'suicide', 'kill myself', 'want to die', 'end my life', 'self harm',
      'hurt myself', 'harm myself', 'do not want to live',
    ],
    possibleConditions: ['Acute emotional distress'],
    summary: 'You mentioned thoughts of ending your life or hurting yourself. Support is available right now.',
    recommendedAction: 'Call Tele-MANAS on 14416 (free, 24×7) or 112 now. If you are in immediate danger, call 112 or go to the nearest hospital, and stay near someone you trust.',
    specialist: 'Psychiatrist / Counsellor',
    timeframe: 'Right now',
    contacts: [
      { label: 'Call Tele-MANAS 14416', tel: '14416' },
      { label: 'Call 112', tel: '112' },
    ],
  },

  // ==========================================
  // 4. FEBRILE & INFECTIOUS DISEASES (CONSULTATION)
  // ==========================================
  {
    id: 'CON-INF-01',
    level: 'Medical Consultation',
    title: 'Fever or infection',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'high fever', 'fever', 'high temperature', 'chills', 'shivering', 'rigors',
      'sweating fever', 'fever with body ache', 'dengue', 'malaria', 'typhoid',
    ],
    possibleConditions: ['Typhoid Fever', 'Dengue Fever', 'Malaria', 'Viral Fever'],
    summary: 'Febrile reaction indicating systemic viral, bacterial, or protozoal pyrogen activity.',
    recommendedAction: 'Hydrate well, apply cool compresses for temp > 101°F. Consult a physician for Complete Blood Count (CBC) and Dengue/NS1 screening.',
    specialist: 'General Physician / Infectious Disease',
    timeframe: 'Within 12–24 Hours',
  },
  {
    id: 'CON-RESP-02',
    level: 'Medical Consultation',
    title: 'Persistent cough or chest congestion',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'persistent cough', 'cough with phlegm', 'cough with mucus', 'yellow sputum', 'green phlegm',
      'phlegm', 'sputum', 'chest congestion', 'chest congestion cough', 'bronchitis', 'wheez',
    ],
    possibleConditions: ['Acute Bronchitis', 'Pneumonia', 'Tubercular Screen Indicated'],
    summary: 'Productive lower respiratory inflammation with hyper-secretion.',
    recommendedAction: 'Schedule clinical auscultation and chest X-ray evaluation. Avoid suppressants for productive coughs.',
    specialist: 'Pulmonologist / Physician',
    timeframe: 'Within 24 Hours',
  },
  {
    id: 'CON-ENT-03',
    level: 'Medical Consultation',
    title: 'Sore throat',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'sore throat', 'throat pain', 'swallowing pain', 'painful swallowing', 'pain while swallowing',
      'tonsil', 'pus spots throat', 'throat infection',
    ],
    possibleConditions: ['Streptococcal Pharyngitis', 'Acute Tonsillitis'],
    summary: 'Exudative or bacterial infection of pharyngeal mucosa.',
    recommendedAction: 'Perform warm salt-water gargles. Physician assessment needed to check for streptococcal infection before taking antibiotics.',
    specialist: 'ENT Specialist',
    timeframe: 'Within 24–48 Hours',
  },
  {
    id: 'CON-ENT-04',
    level: 'Medical Consultation',
    title: 'Ear problem',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'ear pain', 'earache', 'ear ache', 'pain in ear', 'ear fluid discharge', 'ear discharge',
      'ear infection', 'muffled hearing', 'ear ringing', 'tinnitus',
    ],
    possibleConditions: ['Otitis Media (Middle Ear Infection)', 'Otitis Externa', 'Eardrum Perforation'],
    summary: 'Inflammatory otic effusion or tympanic membrane pathology.',
    recommendedAction: 'Keep ear clean and dry. Avoid putting oil or cotton swabs inside ear; seek ENT otoscopic exam.',
    specialist: 'ENT Specialist',
    timeframe: 'Within 24 Hours',
  },

  // ==========================================
  // 5. GASTROINTESTINAL & URINARY (CONSULTATION)
  // ==========================================
  {
    id: 'CON-GI-05',
    level: 'Medical Consultation',
    title: 'Stomach upset',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'stomach cramps', 'stomach pain', 'stomach ache', 'stomachache', 'abdominal pain', 'belly pain',
      'tummy pain', 'loose motions', 'loose stools', 'diarrhea', 'diarrhoea', 'watery stool',
      'vomit', 'nausea', 'nauseous', 'food poisoning', 'acidity', 'indigestion', 'upset stomach',
      'constipation',
    ],
    possibleConditions: ['Acute Gastroenteritis', 'Food Poisoning', 'Amoebic Dysentery'],
    summary: 'Gastrointestinal mucosal inflammation causing electrolyte shift.',
    recommendedAction: 'Start Oral Rehydration Solution (ORS) immediately. Eat soft BRAT diet (Banana, Rice, Applesauce, Toast). Consult doctor if stools contain mucus or blood.',
    specialist: 'Gastroenterologist',
    timeframe: 'Within 24 Hours',
  },
  {
    id: 'CON-RENAL-06',
    level: 'Medical Consultation',
    title: 'Urinary symptoms',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'burning urination', 'burning while urinating', 'urine burning', 'painful urination',
      'pain while urinating', 'frequent urination', 'frequent urge to pee', 'cloudy urine',
      'smelly urine', 'lower belly urine pain', 'urine infection', 'uti',
    ],
    possibleConditions: ['Urinary Tract Infection (UTI)', 'Cystitis'],
    summary: 'Lower urinary tract bacterial colonization.',
    recommendedAction: 'Increase fluid intake significantly. Consult physician for Urine Routine & Culture test to prescribe targeted antibiotics.',
    specialist: 'Urologist / General Physician',
    timeframe: 'Within 24 Hours',
  },
  {
    id: 'CON-RENAL-07',
    level: 'Medical Consultation',
    title: 'Flank pain or blood in urine',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'sharp flank pain', 'flank pain', 'side back pain', 'kidney stone', 'kidney pain',
      'blood in urine', 'red urine', 'hematuria', 'haematuria',
    ],
    possibleConditions: ['Nephrolithiasis (Kidney Stones)', 'Renal Colic'],
    summary: 'Ureteral obstruction causing severe visceral renal colic.',
    recommendedAction: 'Seek outpatient renal USG ultrasound scan. Hydrate under medical guidance and use antispasmodics as prescribed.',
    specialist: 'Urologist',
    timeframe: 'Within 12–24 Hours',
  },

  // ==========================================
  // 6. SKIN, MUSCULOSKELETAL, EYE & DENTAL
  // ==========================================
  {
    id: 'CON-DERM-08',
    level: 'Medical Consultation',
    title: 'Skin rash or infection',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'skin rash', 'rash', 'itchy red bumps', 'itch', 'hives', 'skin peeling', 'fungal rash',
      'fungal infection', 'ringworm', 'boil with pus', 'boil', 'skin infection',
    ],
    possibleConditions: ['Urticaria (Allergic Hives)', 'Contact Dermatitis', 'Cellulitis / Fungal Infection'],
    summary: 'Dermal hypersensitivity or localized cutaneous infection.',
    recommendedAction: 'Avoid scratching or applying unprescribed steroids. Consult a dermatologist for antihistamine/antifungal evaluation.',
    specialist: 'Dermatologist',
    timeframe: 'Within 24–48 Hours',
  },
  {
    id: 'CON-MSK-09',
    level: 'Medical Consultation',
    title: 'Joint or muscle pain',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'joint pain', 'joint swelling', 'swollen knee', 'knee pain', 'ankle sprain', 'sprain',
      'twisted ankle', 'swollen ankle', 'back spasm', 'back pain', 'neck pain', 'shoulder pain',
      'muscle pain', 'cannot move joint', 'arthritis', 'gout', 'fracture', 'broken bone',
      'broken arm', 'broken leg',
    ],
    possibleConditions: ['Acute Ligamentous Sprain', 'Septic Arthritis / Gout Flare', 'Lumbar Muscle Strain'],
    summary: 'Articular inflammation or peri-articular soft tissue damage.',
    recommendedAction: 'Apply R.I.C.E protocol (Rest, Ice, Compression, Elevation). Seek X-ray/Orthopedic review if weight-bearing is impossible.',
    specialist: 'Orthopedic Surgeon / Physiotherapist',
    timeframe: 'Within 24–48 Hours',
  },
  {
    id: 'CON-EYE-10',
    level: 'Medical Consultation',
    title: 'Eye problem',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'red eye', 'eye pain', 'eye redness', 'eye discharge', 'watery eyes', 'itchy eyes',
      'blurred vision', 'blurry vision', 'eye injury', 'eye infection', 'conjunctivitis', 'pink eye',
    ],
    possibleConditions: ['Conjunctivitis', 'Corneal irritation or injury', 'Refractive error / eye strain'],
    summary: 'Eye redness, pain or discharge can come from infection, allergy or injury.',
    recommendedAction: 'Do not rub the eye or use unprescribed drops. Wash hands often and see an eye specialist, especially if vision is blurred or there is pain.',
    specialist: 'Ophthalmologist',
    timeframe: 'Within 24 Hours',
  },
  {
    id: 'CON-DENT-11',
    level: 'Medical Consultation',
    title: 'Tooth or gum pain',
    badge: 'Moderate Risk / Consultation Level 2',
    keywords: [
      'toothache', 'tooth pain', 'tooth ache', 'dental pain', 'gum swelling', 'swollen gums',
      'gum pain', 'bleeding gums', 'broken tooth', 'tooth sensitivity',
    ],
    possibleConditions: ['Dental caries (cavity)', 'Dental abscess', 'Gum disease (gingivitis)'],
    summary: 'Tooth or gum pain usually points to decay, infection or gum inflammation.',
    recommendedAction: 'Rinse with warm salt water and avoid very hot or cold food. See a dentist; a swollen face or fever with tooth pain needs urgent care.',
    specialist: 'Dentist',
    timeframe: 'Within 24–48 Hours',
  },

  // ==========================================
  // 7. GENERAL GUIDANCE & SELF-CARE (LEVEL 1)
  // ==========================================
  {
    id: 'GEN-COLD-01',
    level: 'General Guidance',
    title: 'Common cold symptoms',
    badge: 'Low Risk / Self-Care Level 1',
    keywords: [
      'runny nose', 'sneezing', 'mild cold', 'common cold', 'cold symptoms', 'cold and cough',
      'nasal congestion', 'blocked nose', 'stuffy nose', 'scratchy throat', 'head cold',
      'dry cough', 'cough',
    ],
    possibleConditions: ['Common Cold (Rhinovirus)', 'Mild Allergic Rhinitis'],
    summary: 'Self-limiting viral upper respiratory mucosa inflammation.',
    recommendedAction: 'Steam inhalation twice daily, warm fluids, adequate rest, and vitamin C intake. Symptoms usually settle within 5 days.',
    specialist: 'Self-Care / Pharmacist',
    timeframe: 'Self-Monitored (3–5 Days)',
  },
  {
    id: 'GEN-FATIGUE-02',
    level: 'General Guidance',
    title: 'Tiredness or low energy',
    badge: 'Low Risk / Self-Care Level 1',
    keywords: [
      'mild fatigue', 'fatigue', 'tiredness', 'tired', 'slight weakness', 'feeling weak', 'feel weak',
      'low energy', 'drowsiness', 'exhaustion from work', 'body ache', 'body pain',
      'dizzy', 'dizziness', 'lightheaded', 'cannot sleep', 'insomnia',
    ],
    possibleConditions: ['General Overexertion', 'Mild Dehydration', 'Sleep Deprivation'],
    summary: 'Physiological tiredness without focal organic red flags.',
    recommendedAction: 'Ensure 7-8 hours of sound sleep, increase electrolyte intake, and balance work activity.',
    specialist: 'Lifestyle & Wellness',
    timeframe: 'Routine',
  },
  {
    id: 'GEN-CUT-03',
    level: 'General Guidance',
    title: 'Minor cut or bruise',
    badge: 'Low Risk / Self-Care Level 1',
    keywords: [
      'minor cut', 'small cut', 'small paper cut', 'paper cut', 'minor scrape', 'scrape',
      'minor wound', 'slight bruise', 'bruise', 'superficial scratch', 'scratch',
      'insect bite', 'mosquito bite',
    ],
    possibleConditions: ['Superficial Epidermal Abrasion'],
    summary: 'Minor epidermal loss without vascular deep tissue compromise.',
    recommendedAction: 'Wash cut thoroughly under clean running water, apply antiseptic ointment, and cover with a bandage.',
    specialist: 'First-Aid Self-Care',
    timeframe: 'Immediate First-Aid',
  },
  {
    id: 'GEN-HEAD-04',
    level: 'General Guidance',
    title: 'Mild headache',
    badge: 'Low Risk / Self-Care Level 1',
    keywords: [
      'mild headache', 'headache', 'head ache', 'head pain', 'stress headache', 'tension headache',
      'forehead pressure mild', 'screen time headache',
    ],
    possibleConditions: ['Tension Headache', 'Eye Strain Headache'],
    summary: 'Mild pericranial muscle contraction related to stress or screen glare.',
    recommendedAction: 'Take a break from screen devices, rest in a dim room, stay hydrated, and practice neck stretches.',
    specialist: 'Self-Care',
    timeframe: 'Self-Monitored',
  },
];
