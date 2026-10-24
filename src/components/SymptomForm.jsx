import { Mic, MicOff } from 'lucide-react';
import { useCallback } from 'react';
import { MAX_INPUT_LENGTH, QUICK_PHRASES } from '../constants.js';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';

const joinText = (previous, addition) => (previous.trim() ? `${previous.trim()} ${addition}` : addition);

export default function SymptomForm({ text, onTextChange, detected, onSubmit, textareaRef, online }) {
  const handleFinal = useCallback((spoken) => onTextChange((prev) => joinText(prev, spoken)), [onTextChange]);
  const voice = useSpeechRecognition({ onFinal: handleFinal });

  const addPhrase = (phrase) =>
    onTextChange((prev) => (prev.toLowerCase().includes(phrase) ? prev : prev.trim() ? `${prev.trim()}, ${phrase}` : phrase));

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onSubmit();
    }
  };

  const remaining = MAX_INPUT_LENGTH - text.length;

  let voiceHint = '';
  if (!voice.supported) voiceHint = 'Voice input is not available in this browser. Type your symptoms instead.';
  else if (!online) voiceHint = 'Voice input usually needs an internet connection. Typing always works offline.';

  return (
    <div>
      <label htmlFor="symptoms" className="serif block text-[1.65rem] font-bold leading-tight">
        What are you feeling?
      </label>
      <p className="muted m-0 mb-4 mt-1 text-[0.95rem]">Describe it in your own words, or tap the microphone and speak.</p>

      <div className="field-wrap">
        <textarea
          id="symptoms"
          ref={textareaRef}
          className="field"
          value={text}
          maxLength={MAX_INPUT_LENGTH}
          onChange={(event) => onTextChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="For example: high fever and headache since yesterday, no cough"
          aria-describedby="symptoms-help"
        />
        <button
          type="button"
          className="mic"
          data-on={voice.listening}
          onClick={voice.toggle}
          disabled={!voice.supported}
          aria-pressed={voice.listening}
          aria-label={voice.listening ? 'Stop voice input' : 'Start voice input'}
          title={voice.supported ? (voice.listening ? 'Stop listening' : 'Speak your symptoms') : 'Voice input is not supported here'}
        >
          {voice.listening ? <MicOff size={20} aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
        </button>
      </div>

      <div id="symptoms-help" className="mt-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-sm" aria-live="polite">
        <span className={voice.error ? 'font-medium' : 'muted'} style={voice.error ? { color: 'var(--c-emergency)' } : undefined}>
          {voice.listening
            ? voice.interim
              ? `Hearing: “${voice.interim}”`
              : 'Listening… speak now.'
            : voice.error || voiceHint || 'Press Ctrl + Enter to check.'}
        </span>
        <span className="muted tabular-nums" style={remaining < 40 ? { color: 'var(--c-emergency)' } : undefined}>
          {text.length}/{MAX_INPUT_LENGTH}
        </span>
      </div>

      {/* Live preview of what MedAssist has recognised so far */}
      <div className="mt-4 min-h-[2.25rem]" aria-label="Recognised symptoms">
        {detected.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="label">Recognised</span>
            {detected.slice(0, 8).map((item) => (
              <span key={`${item.keyword}-${item.negated}`} className="chip" data-level={item.level} data-negated={item.negated}>
                <span className="chip-dot" aria-hidden="true" />
                <span className="chip-text">{item.keyword}</span>
                {item.negated && <span className="sr-only">(ruled out)</span>}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="label">Quick add</span>
            {QUICK_PHRASES.map((phrase) => (
              <button key={phrase} type="button" className="chip" onClick={() => addPhrase(phrase)}>
                {phrase}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
