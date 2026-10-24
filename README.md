# MedAssist

Offline-first symptom checker and triage advisor. You describe symptoms in your own words (typed or spoken); MedAssist sorts them into **Emergency (Level 3)**, **See a doctor (Level 2)** or **Self-care (Level 1)** and says what to do, how soon, and who to see.

AKTU Mini Project, BCC351, Lloyd Institute of Engineering & Technology (Dept. of CSE).
Live: https://medassist-wine.vercel.app/

> **Educational prototype. Not a diagnosis.** The rules are simplified first-aid and triage guidance and have not been clinically validated. In an emergency call 112.

## Features

- Rule-based triage engine with 25 rules and about 300 keyword phrases, running entirely in the browser
- Understands everyday phrasing: punctuation, contractions, plurals, and simple negation ("no fever")
- Severity, duration and body-region answers change the result (escalation rules below)
- Voice input (Web Speech API) and read-aloud of the result (SpeechSynthesis)
- Installable PWA; the service worker precaches the app so it works with no network
- Light and dark theme, keyboard accessible, respects reduced-motion

## Run it

```bash
npm install
npm run dev        # development server
npm test           # 64 unit tests for the triage engine (Node's built-in runner)
npm run build      # production build (also generates the service worker)
npm run preview    # serve the production build; test offline mode here
```

Offline mode and the install prompt only exist in the production build (`build` then `preview`), not in `dev`.

## Project structure

```
src/
  symptomData.js        knowledge base: 25 rules (id, level, title, keywords, advice)
  triageEngine.js       pure functions: normalise, match, negate, rank, escalate
  constants.js          levels, form options, emergency numbers
  App.jsx               page layout and state
  components/           Header, SymptomForm, ContextPicker, TriageTag, LevelGuide, LogoMark
  hooks/                voice input, read-aloud, theme, online status, install prompt, offline-ready
  index.css             design tokens and component styles (Tailwind v4)
tests/
  triageEngine.test.js  unit, regression and property tests
vite.config.js          Vite, React and PWA (manifest + Workbox service worker)
```

## How a result is produced

1. Split the text into clauses (punctuation, "but", "however").
2. Normalise: lower-case, expand contractions ("can't" to "cannot"), strip punctuation.
3. Match every keyword. All words must match in order; the last word may continue ("fever" matches "feverish"). Words of three letters or fewer match exactly.
4. Drop negated matches ("no", "not", "without" within three words). Negation stops at "and", "with", "but", so "no fever and chest pain" still flags chest pain.
5. Rank matched rules: higher level, then more keywords, then longer match, then dataset order. **Rule order in the file does not decide priority.**
6. Apply context modifiers.

Complexity is O(R x K x T): rules, keywords per rule, tokens in the input. With 25 rules it is effectively linear in the length of the input.

### Context modifiers

| Condition | Effect |
|---|---|
| Severe (dropdown, or "severe", "unbearable" etc. in the text) and matched level is Consultation | Stays Level 2, marked **Urgent**, "Today, within 6 hours" |
| Severe or 3+ days and matched level is Self-care or unclassified | Raised to Level 2 (doctor visit) |
| 3+ days and Consultation | Stays Level 2, adds a "do not wait it out" note |
| Severe and region is "Chest or breathing" and matched level is below Emergency | **Safety net SN-01**: treated as Emergency |
| No rule matches | Unclassified result with a region-specific hint; never shown as "safe" |

## Rule format

```js
{
  id: 'EMG-CV-01',                 // stable id shown in the UI and quoted in the report
  level: 'Emergency',              // 'Emergency' | 'Medical Consultation' | 'General Guidance'
  title: 'Chest pain with heart attack warning signs',
  keywords: ['chest pain', 'chest tightness', /* ... */],
  possibleConditions: [/* ... */],
  summary: '...',
  recommendedAction: '...',
  specialist: '...',
  timeframe: '...',
  contacts: [{ label: 'Call 112', tel: '112' }],   // optional override
}
```

## Known limitations

- Keyword matching cannot understand meaning, spelling mistakes or other languages. Only English is supported.
- Negation is simple: it looks back three words. Missed negations raise urgency rather than lower it, by design.
- Voice input uses the browser's speech service. Chrome sends audio to a server, so voice needs internet; typing never does.
- Clinical content is educational and has not been reviewed by a medical professional.
