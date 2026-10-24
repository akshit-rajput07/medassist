import { useCallback, useEffect, useRef, useState } from 'react';

const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access is blocked. Allow it in your browser settings, or type your symptoms.',
  'service-not-allowed': 'Microphone access is blocked. Allow it in your browser settings, or type your symptoms.',
  network: 'Voice input needs an internet connection in most browsers. Type your symptoms instead.',
  'no-speech': 'No speech heard. Tap the microphone and try again.',
  'audio-capture': 'No microphone found. Connect one, or type your symptoms.',
};

const getRecognitionClass = () =>
  typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null;

/**
 * Voice input through the browser's Web Speech API.
 * Final phrases are passed to `onFinal`; partial words are exposed as `interim`.
 */
export function useSpeechRecognition({ onFinal, lang = 'en-IN' }) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const onFinalRef = useRef(onFinal);
  const supported = getRecognitionClass() !== null;

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Recognition = getRecognitionClass();
    if (!Recognition) return;
    setError('');
    setInterim('');

    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      let partial = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += piece;
        else partial += piece;
      }
      setInterim(partial);
      if (final.trim()) onFinalRef.current?.(final.trim());
    };
    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        setError(ERROR_MESSAGES[event.error] ?? 'Voice input stopped unexpectedly. Type your symptoms instead.');
      }
    };
    recognition.onend = () => {
      setListening(false);
      setInterim('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError('Voice input could not start. Try again, or type your symptoms.');
    }
  }, [lang]);

  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { supported, listening, interim, error, toggle };
}
