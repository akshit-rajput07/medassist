import { Activity, RotateCcw, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ContextPicker from './components/ContextPicker.jsx';
import Header from './components/Header.jsx';
import LevelGuide from './components/LevelGuide.jsx';
import SymptomForm from './components/SymptomForm.jsx';
import TriageTag from './components/TriageTag.jsx';
import { DEFAULT_CONTEXT } from './constants.js';
import { useInstallPrompt } from './hooks/useInstallPrompt.js';
import { useOfflineReady } from './hooks/useOfflineReady.js';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { useTheme } from './hooks/useTheme.js';
import { SYMPTOM_DATASET } from './symptomData.js';
import { assess, detect } from './triageEngine.js';

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const online = useOnlineStatus();
  const offlineReady = useOfflineReady();
  const { canInstall, install } = useInstallPrompt();

  const [text, setText] = useState('');
  const [context, setContext] = useState(DEFAULT_CONTEXT);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState('');

  const textareaRef = useRef(null);
  const resultRef = useRef(null);
  const toastTimer = useRef(0);

  const detected = useMemo(() => detect(text), [text]);
  const inputKey = `${text.trim().toLowerCase()}|${context.severity}|${context.duration}|${context.bodyRegion}`;
  const stale = result !== null && result.inputKey !== inputKey;
  const canSubmit = text.trim().length > 0;

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const runAssessment = () => {
    const next = assess(text, context);
    if (next) setResult({ ...next, inputKey });
  };

  // Move focus to a new result so screen-reader users hear it, and scroll to it on small screens.
  useEffect(() => {
    if (!result || !resultRef.current) return;
    resultRef.current.focus({ preventScroll: true });
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!wide) resultRef.current.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
  }, [result?.generatedAt]);

  const reset = () => {
    setText('');
    setContext(DEFAULT_CONTEXT);
    setResult(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen pb-10">
      <a className="skip-link" href="#symptoms">
        Skip to symptom input
      </a>

      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        online={online}
        offlineReady={offlineReady}
        canInstall={canInstall}
        onInstall={install}
      />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <p className="m-0 mb-5 flex items-start gap-2.5 text-sm" role="note">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--c-emergency)' }} aria-hidden="true" />
          <span>
            <strong>MedAssist is not a diagnosis.</strong> It gives first-step guidance for learning and screening. In an emergency, call{' '}
            <a href="tel:112" className="font-bold underline">
              112
            </a>
            .
          </span>
        </p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
          <section className="panel grid gap-6 p-5 sm:p-7" aria-label="Describe your symptoms">
            <SymptomForm
              text={text}
              onTextChange={setText}
              detected={detected}
              onSubmit={runAssessment}
              textareaRef={textareaRef}
              online={online}
            />

            <hr className="divider" />

            <ContextPicker context={context} onChange={setContext} />

            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary grow sm:grow-0" style={{ minWidth: 200 }} onClick={runAssessment} disabled={!canSubmit}>
                <Activity size={18} aria-hidden="true" />
                {result && stale ? 'Check again' : 'Check symptoms'}
              </button>
              <button type="button" className="btn btn-quiet" onClick={reset}>
                <RotateCcw size={16} aria-hidden="true" />
                Start over
              </button>
            </div>
          </section>

          <div className="lg:sticky lg:top-6">
            <div ref={resultRef} tabIndex={-1} style={{ outline: 'none' }}>
              {result ? (
                <TriageTag key={result.generatedAt} result={result} stale={stale} onNotify={notify} />
              ) : (
                <LevelGuide ruleCount={SYMPTOM_DATASET.length} />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6">
        <p className="muted m-0 flex items-start gap-2 text-sm">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Typed symptoms are matched on this device and are never uploaded. Voice input uses your browser’s speech service, which
            may send audio over the internet. MedAssist is an AKTU mini project (BCC351), Lloyd Institute of Engineering &amp; Technology.
          </span>
        </p>
      </footer>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
