import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Activity, AlertTriangle, ShieldAlert, 
  CheckCircle2, Stethoscope, RefreshCw, Volume2, Clock, 
  MapPin, HeartPulse, UserCheck2, ShieldCheck
} from 'lucide-react';
import { SYMPTOM_DATASET } from './symptomData';

export default function App() {
  const [symptomText, setSymptomText] = useState('');
  const [severity, setSeverity] = useState('Moderate');
  const [duration, setDuration] = useState('1-2 Days');
  const [bodyRegion, setBodyRegion] = useState('General / Systemic');
  
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported on this browser. Please type your symptoms.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptomText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const processTriage = () => {
    if (!symptomText.trim()) return;

    const lowerInput = symptomText.toLowerCase();
    let matchedEntry = null;
    let matchedKeywords = [];

    // Scan through dataset
    for (const entry of SYMPTOM_DATASET) {
      const matches = entry.keywords.filter((kw) => lowerInput.includes(kw));
      if (matches.length > 0) {
        matchedEntry = entry;
        matchedKeywords = matches;
        break; // Priority matched by dataset order (Emergency first)
      }
    }

    // Default fallback if no keyword matches
    if (!matchedEntry) {
      matchedEntry = {
        id: 'GEN-DEFAULT',
        level: 'General Guidance',
        badge: 'Uncertain / Standard Evaluation',
        cardStyle: 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-xl',
        summary: 'No critical emergency keyword patterns detected in current input.',
        recommendedAction: 'Try rephrasing your description (e.g., "fever", "chest pain", "stomach pain", "headache") or consult a general physician.',
        possibleConditions: ['Unspecified Symptom Presentation'],
        specialist: 'General Practitioner',
        timeframe: 'Routine'
      };
      matchedKeywords = ['Broad Query'];
    }

    const IconComponent = matchedEntry.level === 'Emergency' 
      ? ShieldAlert 
      : matchedEntry.level === 'Medical Consultation' 
      ? AlertTriangle 
      : CheckCircle2;

    setResult({
      ...matchedEntry,
      IconComponent,
      matchedKeywords,
      userMetaData: {
        severity,
        duration,
        bodyRegion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    });
  };

  const speakAudioOutput = () => {
    if (!result || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(
      `Triage result: ${result.badge}. Recommended Action: ${result.recommendedAction}. Timeframe: ${result.timeframe}`
    );
    window.speechSynthesis.speak(utterance);
  };

  const resetAll = () => {
    setSymptomText('');
    setResult(null);
    setSeverity('Moderate');
    setDuration('1-2 Days');
    setBodyRegion('General / Systemic');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-8">
      {/* Header Banner */}
      <header className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-md">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">MedAssist</h1>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
                AKTU Mini Project (BCC351)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">AI-Powered Symptom Checker & Triage Advisor | LIET Dept. of CSE</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Client-Side Processing
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto space-y-6">
        
        {/* Medical Disclaimer */}
        <div className="bg-amber-50/80 border border-amber-200 text-amber-900 text-xs p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical Safety Disclaimer:</strong> MedAssist is an educational prototype developed for preliminary triage guidance. It does not replace professional clinical judgment, diagnosis, or emergency medical services.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-blue-600" /> Natural Language Symptom Input
            </label>
            <span className="text-xs text-slate-400">Speech or Text Entry</span>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="Describe your symptoms (e.g., 'I have a high fever and headache' or 'burning urination and lower belly pain')..."
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition resize-none leading-relaxed"
            />
            
            <button
              onClick={toggleVoiceInput}
              className={`absolute right-3 bottom-3 p-2.5 rounded-lg border transition-all ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Voice Input (Web Speech API)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Context Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 focus:outline-none"
              >
                <option value="Mild">Mild / Tolerable</option>
                <option value="Moderate">Moderate Distress</option>
                <option value="Severe">Severe / Unbearable</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 focus:outline-none"
              >
                <option value="< 24 Hours">Less than 24 Hours</option>
                <option value="1-2 Days">1 to 2 Days</option>
                <option value="3+ Days">3 Days or More</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Body Region</label>
              <select
                value={bodyRegion}
                onChange={(e) => setBodyRegion(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-700 focus:outline-none"
              >
                <option value="General / Systemic">General / Systemic</option>
                <option value="Chest / Breathing">Chest / Breathing</option>
                <option value="Head, Throat & Neck">Head, Throat & Neck</option>
                <option value="Abdomen & Digestive">Abdomen & Digestive</option>
              </select>
            </div>
          </div>

          {/* Evaluate Button */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={processTriage}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" /> Run Dataset Triage Rules
            </button>
            
            <button
              onClick={resetAll}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-xl transition"
              title="Reset Form"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Block */}
        {result && (
          <div className="space-y-4 transition-all duration-300">
            <div className={`p-6 rounded-2xl ${result.cardStyle} space-y-4`}>
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-3">
                  <result.IconComponent className="w-7 h-7" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Matched Rule [{result.id}]</span>
                    <h2 className="text-lg font-bold">{result.badge}</h2>
                  </div>
                </div>

                <button
                  onClick={speakAudioOutput}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg transition"
                >
                  <Volume2 className="w-4 h-4" /> Speak Feedback
                </button>
              </div>

              <p className="text-sm font-medium leading-relaxed opacity-95">{result.summary}</p>

              <div className="bg-black/15 backdrop-blur-sm p-4 rounded-xl border border-white/10 space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-[10px] opacity-80">Recommended Triage Action</span>
                <p className="font-semibold text-sm">{result.recommendedAction}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 opacity-90">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Action Window: <strong>{result.timeframe}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck2 className="w-3.5 h-3.5" /> Specialist Routing: <strong>{result.specialist}</strong>
                </div>
              </div>
            </div>

            {/* Structured Features Output */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Extracted Clinical Features
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Matched Indicators</span>
                  <strong className="text-slate-800">{result.matchedKeywords.join(', ')}</strong>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Possible Conditions</span>
                  <strong className="text-slate-800">{result.possibleConditions?.join(', ') || 'N/A'}</strong>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Body Region</span>
                  <strong className="text-slate-800">{result.userMetaData.bodyRegion}</strong>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Duration & Severity</span>
                  <strong className="text-slate-800">{result.userMetaData.duration} ({result.userMetaData.severity})</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}