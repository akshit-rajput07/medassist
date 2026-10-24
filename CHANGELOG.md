# Changelog

## 1.0.0 (final submission build)

### Triage engine
- Moved the logic out of `App.jsx` into a pure, testable `triageEngine.js`
- Input normalisation: case, punctuation, repeated spaces, contractions
- Word-boundary matching with plural and suffix support (no more accidental substring hits)
- Simple negation handling ("no fever", "without chills", "not suicidal")
- Priority now comes from the **level** of the matched rule, not from where it sits in the array
- Severity, duration and body region now **affect the result** (they were display-only before)
- Safety net SN-01 for severe chest or breathing symptoms
- Unmatched input is shown as "Not classified", no longer as a reassuring "General Guidance"
- Fixed: the old fallback suggested "headache", which did not match any rule
- Fixed: "difficulty breathing", "short of breath" and "my chest hurts" were missed
- Fixed: "severe stomach pain" was only treated as routine

### Knowledge base
- All 20 original rule ids and texts kept; synonyms added to each
- 5 new rules: severe allergic reaction, snake or animal bite, self-harm support (Tele-MANAS 14416), eye problems, dental pain
- Rules now have a short `title`; colours moved out of the data and into the UI

### Interface
- New design: triage-tag result card, live "recognised symptoms" chips, quick-add phrases, segmented controls
- Light and dark theme, mobile-first layout, keyboard and screen-reader support
- Online/offline indicator, "ready for offline use" indicator, install button
- Voice input shows live words and clear errors (replaces `alert()`); stop button now actually stops
- Read aloud with stop, copy summary for handing to a doctor, Ctrl+Enter shortcut
- Emergency results show a one-tap "Call 112" button

### PWA
- Real icons (192, 512, maskable, Apple touch) replace the Vite logo declared as an SVG "192x192"
- Manifest: theme colour, categories, start URL and scope; page title, description and theme-color meta tags

### Quality
- 64 automated tests (`npm test`), including property tests that guard against a rule being shadowed
- Removed unused files: `App.css`, `src/assets/`, `public/icons.svg`, `tailwind.config.js` (ignored by Tailwind v4), `avg.py`
