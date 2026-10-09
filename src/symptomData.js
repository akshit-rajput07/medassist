// Extended Clinical Knowledge Base for MedAssist (AKTU Mini Project BCC351)
export const SYMPTOM_DATASET = [
  // ==========================================
  // 1. CARDIOVASCULAR & RESPIRATORY EMERGENCY
  // ==========================================
  {
    id: 'EMG-CV-01',
    level: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    cardStyle: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl',
    keywords: ['chest pain', 'tightness in chest', 'chest pressure', 'left arm pain', 'jaw pain', 'angina', 'crushing chest'],
    possibleConditions: ['Acute Coronary Syndrome', 'Myocardial Infarction (Heart Attack)'],
    summary: 'Acute chest pain with radiating discomfort strongly points to myocardial ischemia.',
    recommendedAction: 'Call emergency medical services immediately. Avoid physical exertion and chew an aspirin if recommended by paramedics.',
    specialist: 'Cardiologist / Emergency Medicine',
    timeframe: 'Immediate (0–15 mins)'
  },
  {
    id: 'EMG-RESP-02',
    level: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    cardStyle: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl',
    keywords: ['shortness of breath', 'cannot breathe', 'gasping for air', 'blue lips', 'cyanosis', 'stridor', 'choking'],
    possibleConditions: ['Severe Asthma Attack', 'Pulmonary Embolism', 'Acute Respiratory Distress Syndrome (ARDS)'],
    summary: 'Critical compromise of upper or lower airway ventilation detected.',
    recommendedAction: 'Seek immediate emergency resuscitation. Sit upright and use rescue inhalers if prescribed.',
    specialist: 'Pulmonologist / ER Resuscitation',
    timeframe: 'Immediate (0–15 mins)'
  },

  // ==========================================
  // 2. NEUROLOGICAL EMERGENCY
  // ==========================================
  {
    id: 'EMG-NEURO-03',
    level: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    cardStyle: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl',
    keywords: ['slurred speech', 'facial drooping', 'arm weakness', 'numbness on one side', 'sudden paralysis', 'loss of speech'],
    possibleConditions: ['Acute Ischemic Stroke', 'Hemorrhagic Stroke', 'Transient Ischemic Attack (TIA)'],
    summary: 'Focal neurological deficits indicate potential acute cerebrovascular infarction (FAST criteria matched).',
    recommendedAction: 'Initiate emergency stroke response immediately. Note the exact onset timestamp.',
    specialist: 'Neurologist / Stroke Unit',
    timeframe: 'Immediate (Gold Hour: < 60 mins)'
  },
  {
    id: 'EMG-NEURO-04',
    level: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    cardStyle: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl',
    keywords: ['seizure', 'convulsions', 'fainting', 'unconscious', 'passed out', 'blackout', 'epilepsy fit'],
    possibleConditions: ['Status Epilepticus', 'Syncope / Cardiac Arrhythmia', 'Severe Hypoglycemia'],
    summary: 'Transient or prolonged loss of consciousness paired with involuntary neuromuscular activity.',
    recommendedAction: 'Place patient in recovery position, protect head, do not insert anything in mouth, call emergency care.',
    specialist: 'Neurologist / Emergency Care',
    timeframe: 'Immediate'
  },
  {
    id: 'EMG-NEURO-05',
    level: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    cardStyle: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl',
    keywords: ['worst headache of my life', 'thunderclap headache', 'stiff neck with fever', 'head trauma bleeding'],
    possibleConditions: ['Subarachnoid Hemorrhage', 'Acute Bacterial Meningitis'],
    summary: 'Sudden high-intensity cephalic pain or meningeal irritation signs present.',
    recommendedAction: 'Immediate neurological triage required to rule out intracranial hemorrhage or infection.',
    specialist: 'Neurosurgeon / ER Specialist',
    timeframe: 'Immediate'
  },

  // ==========================================
  // 3. ABDOMINAL & TRAUMA EMERGENCY
  // ==========================================
  {
    id: 'EMG-ABD-06',
    level: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    cardStyle: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl',
    keywords: ['severe lower right abdominal pain', 'rebound tenderness', 'vomiting blood', 'black tarry stool', 'blood in vomit'],
    possibleConditions: ['Acute Appendicitis with Perforation', 'Upper Gastrointestinal Bleed', 'Ectopic Pregnancy Rupture'],
    summary: 'Acute abdomen or gastrointestinal vascular compromise.',
    recommendedAction: 'Do not eat or drink anything. Proceed directly to surgical emergency for acute abdomen assessment.',
    specialist: 'General Surgeon / Gastroenterologist',
    timeframe: 'Immediate (< 2 Hours)'
  },
  {
    id: 'EMG-TRAUMA-07',
    level: 'Emergency',
    badge: 'High Risk / Emergency Level 3',
    cardStyle: 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl',
    keywords: ['severe bleeding', 'uncontrolled bleeding', 'compound fracture', 'bone sticking out', 'deep stab wound'],
    possibleConditions: ['Hemorrhagic Shock', 'Open Fracture Traumatic Injury'],
    summary: 'Traumatic tissue disruption with arterial/venous compromise.',
    recommendedAction: 'Apply direct pressure using clean cloth to stop bleeding. Elevate affected limb and seek trauma unit care.',
    specialist: 'Trauma Surgeon / Orthopedics',
    timeframe: 'Immediate'
  },

  // ==========================================
  // 4. FEBRILE & INFECTIOUS DISEASES (CONSULTATION)
  // ==========================================
  {
    id: 'CON-INF-01',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['high fever', 'chills', 'shivering', 'rigors', 'sweating fever', 'fever with body ache', 'fever'],
    possibleConditions: ['Typhoid Fever', 'Dengue Fever', 'Malaria', 'Viral Fever'],
    summary: 'Febrile reaction indicating systemic viral, bacterial, or protozoal pyrogen activity.',
    recommendedAction: 'Hydrate well, apply cool compresses for temp > 101°F. Consult a physician for Complete Blood Count (CBC) and Dengue/NS1 screening.',
    specialist: 'General Physician / Infectious Disease',
    timeframe: 'Within 12–24 Hours'
  },
  {
    id: 'CON-RESP-02',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['persistent cough', 'cough with phlegm', 'yellow sputum', 'green phlegm', 'chest congestion cough', 'bronchitis'],
    possibleConditions: ['Acute Bronchitis', 'Pneumonia', 'Tubercular Screen Indicated'],
    summary: 'Productive lower respiratory inflammation with hyper-secretion.',
    recommendedAction: 'Schedule clinical auscultation and chest X-ray evaluation. Avoid suppressants for productive coughs.',
    specialist: 'Pulmonologist / Physician',
    timeframe: 'Within 24 Hours'
  },
  {
    id: 'CON-ENT-03',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['sore throat', 'swallowing pain', 'tonsil swelling', 'pus spots throat', 'throat infection'],
    possibleConditions: ['Streptococcal Pharyngitis', 'Acute Tonsillitis'],
    summary: 'Exudative or bacterial infection of pharyngeal mucosa.',
    recommendedAction: 'Perform warm salt-water gargles. Physician assessment needed to check for streptococcal infection before taking antibiotics.',
    specialist: 'ENT Specialist',
    timeframe: 'Within 24–48 Hours'
  },
  {
    id: 'CON-ENT-04',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['ear pain', 'ear fluid discharge', 'ear ache', 'muffled hearing', 'ear ringing', 'tinnitus'],
    possibleConditions: ['Otitis Media (Middle Ear Infection)', 'Otitis Externa', 'Eardrum Perforation'],
    summary: 'Inflammatory otic effusion or tympanic membrane pathology.',
    recommendedAction: 'Keep ear clean and dry. Avoid putting oil or cotton swabs inside ear; seek ENT otoscopic exam.',
    specialist: 'ENT Specialist',
    timeframe: 'Within 24 Hours'
  },

  // ==========================================
  // 5. GASTROINTESTINAL & URINARY (CONSULTATION)
  // ==========================================
  {
    id: 'CON-GI-05',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['stomach cramps', 'loose motions', 'diarrhea', 'watery stool', 'vomiting food', 'food poisoning', 'acidity pain', 'stomach pain'],
    possibleConditions: ['Acute Gastroenteritis', 'Food Poisoning', 'Amoebic Dysentery'],
    summary: 'Gastrointestinal mucosal inflammation causing electrolyte shift.',
    recommendedAction: 'Start Oral Rehydration Solution (ORS) immediately. Eat soft BRAT diet (Banana, Rice, Applesauce, Toast). Consult doctor if stools contain mucus or blood.',
    specialist: 'Gastroenterologist',
    timeframe: 'Within 24 Hours'
  },
  {
    id: 'CON-RENAL-06',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['burning urination', 'painful urination', 'frequent urge to pee', 'cloudy urine', 'smelly urine', 'lower belly urine pain'],
    possibleConditions: ['Urinary Tract Infection (UTI)', 'Cystitis'],
    summary: 'Lower urinary tract bacterial colonization.',
    recommendedAction: 'Increase fluid intake significantly. Consult physician for Urine Routine & Culture test to prescribe targeted antibiotics.',
    specialist: 'Urologist / General Physician',
    timeframe: 'Within 24 Hours'
  },
  {
    id: 'CON-RENAL-07',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['sharp flank pain', 'side back pain', 'kidney stone pain', 'blood in urine', 'hematuria'],
    possibleConditions: ['Nephrolithiasis (Kidney Stones)', 'Renal Colic'],
    summary: 'Ureteral obstruction causing severe visceral renal colic.',
    recommendedAction: 'Seek outpatient renal USG ultrasound scan. Hydrate under medical guidance and use antispasmodics as prescribed.',
    specialist: 'Urologist',
    timeframe: 'Within 12–24 Hours'
  },

  // ==========================================
  // 6. DERMATOLOGICAL & MUSCULOSKELETAL
  // ==========================================
  {
    id: 'CON-DERM-08',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['skin rash', 'itchy red bumps', 'hives', 'skin peeling', 'fungal rash', 'boil with pus'],
    possibleConditions: ['Urticaria (Allergic Hives)', 'Contact Dermatitis', 'Cellulitis / Fungal Infection'],
    summary: 'Dermal hypersensitivity or localized cutaneous infection.',
    recommendedAction: 'Avoid scratching or applying unprescribed steroids. Consult a dermatologist for antihistamine/antifungal evaluation.',
    specialist: 'Dermatologist',
    timeframe: 'Within 24–48 Hours'
  },
  {
    id: 'CON-MSK-09',
    level: 'Medical Consultation',
    badge: 'Moderate Risk / Consultation Level 2',
    cardStyle: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl',
    keywords: ['joint pain', 'swollen knee', 'ankle sprain', 'back spasm', 'cannot move joint', 'arthritis flare'],
    possibleConditions: ['Acute Ligamentous Sprain', 'Septic Arthritis / Gout Flare', 'Lumbar Muscle Strain'],
    summary: 'Articular inflammation or peri-articular soft tissue damage.',
    recommendedAction: 'Apply R.I.C.E protocol (Rest, Ice, Compression, Elevation). Seek X-ray/Orthopedic review if weight-bearing is impossible.',
    specialist: 'Orthopedic Surgeon / Physiotherapist',
    timeframe: 'Within 24–48 Hours'
  },

  // ==========================================
  // 7. GENERAL GUIDANCE & SELF-CARE (LEVEL 1)
  // ==========================================
  {
    id: 'GEN-COLD-01',
    level: 'General Guidance',
    badge: 'Low Risk / Self-Care Level 1',
    cardStyle: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl',
    keywords: ['runny nose', 'sneezing', 'mild cold', 'nasal congestion', 'scratchy throat', 'head cold'],
    possibleConditions: ['Common Cold (Rhinovirus)', 'Mild Allergic Rhinitis'],
    summary: 'Self-limiting viral upper respiratory mucosa inflammation.',
    recommendedAction: 'Steam inhalation twice daily, warm fluids, adequate rest, and vitamin C intake. Symptoms usually settle within 5 days.',
    specialist: 'Self-Care / Pharmacist',
    timeframe: 'Self-Monitored (3–5 Days)'
  },
  {
    id: 'GEN-FATIGUE-02',
    level: 'General Guidance',
    badge: 'Low Risk / Self-Care Level 1',
    cardStyle: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl',
    keywords: ['mild fatigue', 'tiredness', 'slight weakness', 'low energy', 'drowsiness', 'exhaustion from work'],
    possibleConditions: ['General Overexertion', 'Mild Dehydration', 'Sleep Deprivation'],
    summary: 'Physiological tiredness without focal organic red flags.',
    recommendedAction: 'Ensure 7-8 hours of sound sleep, increase electrolyte intake, and balance work activity.',
    specialist: 'Lifestyle & Wellness',
    timeframe: 'Routine'
  },
  {
    id: 'GEN-CUT-03',
    level: 'General Guidance',
    badge: 'Low Risk / Self-Care Level 1',
    cardStyle: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl',
    keywords: ['minor cut', 'small paper cut', 'minor scrape', 'slight bruise', 'superficial scratch'],
    possibleConditions: ['Superficial Epidermal Abrasion'],
    summary: 'Minor epidermal loss without vascular deep tissue compromise.',
    recommendedAction: 'Wash cut thoroughly under clean running water, apply antiseptic ointment, and cover with a bandage.',
    specialist: 'First-Aid Self-Care',
    timeframe: 'Immediate First-Aid'
  },
  {
    id: 'GEN-HEAD-04',
    level: 'General Guidance',
    badge: 'Low Risk / Self-Care Level 1',
    cardStyle: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl',
    keywords: ['mild headache', 'stress headache', 'forehead pressure mild', 'screen time headache'],
    possibleConditions: ['Tension Headache', 'Eye Strain Headache'],
    summary: 'Mild pericranial muscle contraction related to stress or screen glare.',
    recommendedAction: 'Take a break from screen devices, rest in a dim room, stay hydrated, and practice neck stretches.',
    specialist: 'Self-Care',
    timeframe: 'Self-Monitored'
  }
];