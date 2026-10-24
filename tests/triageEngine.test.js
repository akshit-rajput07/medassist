// Run with:  npm test      (uses Node's built-in test runner, no extra packages)
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { SYMPTOM_DATASET } from '../src/symptomData.js';
import { LEVELS } from '../src/constants.js';
import { assess, detect, normalize, summaryText, speechText } from '../src/triageEngine.js';

const E = 'Emergency';
const C = 'Medical Consultation';
const G = 'General Guidance';
const U = 'Unclassified';

const ctx = (severity = 'Moderate', duration = '1-2 Days', bodyRegion = 'General / Systemic') => ({ severity, duration, bodyRegion });
const level = (text, context) => assess(text, context)?.level;
const id = (text, context) => assess(text, context)?.id;

describe('knowledge base integrity', () => {
  test('rule ids are unique', () => {
    const ids = SYMPTOM_DATASET.map((r) => r.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test('every rule has the fields the UI needs', () => {
    for (const r of SYMPTOM_DATASET) {
      for (const f of ['id', 'level', 'title', 'summary', 'recommendedAction', 'specialist', 'timeframe']) {
        assert.ok(r[f], `${r.id} is missing ${f}`);
      }
      assert.ok(LEVELS[r.level], `${r.id} has unknown level ${r.level}`);
      assert.ok(r.keywords.length > 0, `${r.id} has no keywords`);
    }
  });

  test('no keyword appears in two rules (would make results ambiguous)', () => {
    const owner = new Map();
    for (const r of SYMPTOM_DATASET) {
      for (const k of r.keywords) {
        assert.ok(!owner.has(k), `"${k}" is in both ${owner.get(k)} and ${r.id}`);
        owner.set(k, r.id);
      }
    }
  });

  test('every keyword typed alone classifies at least at its own rule level (no shadowing)', () => {
    for (const r of SYMPTOM_DATASET) {
      for (const k of r.keywords) {
        const got = assess(k, ctx())?.level;
        assert.ok(LEVELS[got].rank >= LEVELS[r.level].rank, `"${k}" (${r.id}, ${r.level}) resolved to ${got}`);
      }
    }
  });

  test('every emergency keyword typed alone is an emergency', () => {
    for (const r of SYMPTOM_DATASET.filter((x) => x.level === E)) {
      for (const k of r.keywords) assert.equal(level(k), E, `"${k}"`);
    }
  });
});

describe('normalisation', () => {
  test('lower-cases, strips punctuation and collapses spaces', () => {
    assert.equal(normalize('  CHEST   pain!!  '), 'chest pain');
    assert.equal(normalize('left-arm pain'), 'left arm pain');
  });
  test('expands contractions', () => {
    assert.equal(normalize("I don't have a fever"), 'i do not have a fever');
    assert.equal(normalize('I cant breathe'), 'i cannot breathe');
    assert.equal(normalize('I can’t breathe'), 'i cannot breathe');
  });
});

describe('emergency detection', () => {
  const cases = [
    ['I have severe chest pain and left arm pain', 'EMG-CV-01'],
    ['shortness of breath and blue lips', 'EMG-RESP-02'],
    ['slurred speech and facial drooping', 'EMG-NEURO-03'],
    ['my father had a seizure', 'EMG-NEURO-04'],
    ['worst headache of my life', 'EMG-NEURO-05'],
    ['vomiting blood', 'EMG-ABD-06'],
    ['uncontrolled bleeding from the leg', 'EMG-TRAUMA-07'],
    ['my face is swollen and my throat is closing', 'EMG-ALLERGY-08'],
    ['bitten by a snake', 'EMG-BITE-09'],
    ['I want to die', 'EMG-MH-10'],
  ];
  for (const [text, expected] of cases) {
    test(`"${text}" -> ${expected}`, () => assert.equal(id(text), expected));
  }
});

describe('previously missed phrases (regression for Review-01 gaps)', () => {
  for (const text of ['difficulty breathing', 'short of breath', 'my chest hurts badly', 'trouble breathing', 'chest  pain', 'CHEST PAIN']) {
    test(`"${text}" is an emergency`, () => assert.equal(level(text), E));
  }
  test('plain "headache" is now recognised as self-care', () => assert.equal(id('headache'), 'GEN-HEAD-04'));
  test('the suggested fallback words all match a rule', () => {
    for (const w of ['fever', 'chest pain', 'stomach pain', 'headache']) assert.notEqual(level(w), U, w);
  });
});

describe('priority is by level, not by dataset order', () => {
  test('emergency beats consultation', () => assert.equal(level('fever and chest pain'), E));
  test('consultation beats self-care', () => assert.equal(level('runny nose and fever'), C));
  test('emergency wins even when listed last in the text', () => assert.equal(level('mild headache, sore throat, and I fainted'), E));
  test('ties are broken by specificity, not array order', () => {
    const r = assess('burning urination and lower belly pain');
    assert.equal(r.id, 'CON-RENAL-06');
    assert.ok(r.alsoMatched.some((m) => m.id === 'CON-GI-05'));
  });
});

describe('negation', () => {
  test('"no fever" is not a fever', () => assert.equal(level('I do not have a fever'), U));
  test('"without chills" is negated', () => assert.equal(level('cough without chills'), G));
  test('"no fever or chills" negates both', () => assert.equal(level('no fever or chills'), U));
  test('negated terms are reported back to the user', () => assert.deepEqual(assess('no fever').negatedKeywords, ['fever']));
  test('negation does not hide a different, present red flag', () => {
    assert.equal(level('no fever and chest pain'), E);
    assert.equal(level('no fever but chest pain'), E);
    assert.equal(level("I don't have a cough with chest pain"), E);
  });
  test('"not sure" is uncertainty, not negation', () => assert.equal(level('I am not sure if it is chest pain'), E));
  test('"not suicidal" is not treated as a crisis', () => assert.notEqual(level('I am not suicidal'), E));
  test('affirmed beats negated for the same word', () => assert.equal(level('no fever in the morning, fever at night'), C));
});

describe('input robustness', () => {
  test('empty and whitespace-only input return null', () => {
    assert.equal(assess(''), null);
    assert.equal(assess('   \n '), null);
    assert.equal(assess(undefined), null);
  });
  test('gibberish falls back to Unclassified, never to a green card', () => {
    const r = assess('asdfgh');
    assert.equal(r.level, U);
    assert.equal(r.isFallback, true);
    assert.equal(r.id, 'GEN-DEFAULT');
  });
  test('word boundaries stop false positives', () => {
    assert.equal(level('utility bill'), U);
    assert.equal(level('a bear pain'), U);
  });
  test('prefix match on the last word handles plurals and variants', () => {
    assert.equal(level('feverish since morning'), C);
    assert.equal(level('chest pains'), E);
  });
  test('very long input is handled', () => {
    const t = `${'blah '.repeat(900)} chest pain`;
    assert.ok(assess(t));
  });
  test('punctuation around a phrase does not break matching', () => assert.equal(level('Help!!! (chest pain), please'), E));
});

describe('context modifiers', () => {
  test('severity "Severe" makes a consultation urgent (same day)', () => {
    const r = assess('sore throat', ctx('Severe'));
    assert.equal(r.level, C);
    assert.equal(r.urgent, true);
    assert.match(r.timeframe, /6 hours/);
  });
  test('severity "Severe" lifts self-care to a doctor visit', () => {
    const r = assess('headache', ctx('Severe'));
    assert.equal(r.level, C);
    assert.equal(r.baseLevel, G);
    assert.equal(r.escalated, true);
  });
  test('3+ days lifts self-care to a doctor visit', () => {
    const r = assess('runny nose', ctx('Moderate', '3+ Days'));
    assert.equal(r.level, C);
    assert.match(r.reasons.join(' '), /3 days/);
  });
  test('3+ days on a consultation adds a note but keeps the level', () => {
    const r = assess('ear pain', ctx('Moderate', '3+ Days'));
    assert.equal(r.level, C);
    assert.equal(r.notes.length, 1);
  });
  test('"severe" typed in the text counts like the dropdown', () => {
    const r = assess('severe stomach pain');
    assert.equal(r.urgent, true);
    assert.match(r.timeframe, /6 hours/);
  });
  test('"not severe" does not count as severe', () => assert.equal(assess('stomach pain, not severe').urgent, false));
  test('safety net: severe chest/breathing region is always an emergency', () => {
    const r = assess('mild cold', ctx('Severe', '1-2 Days', 'Chest / Breathing'));
    assert.equal(r.level, E);
    assert.equal(r.id, 'SAFETY-NET-01');
  });
  test('safety net does not fire for a moderate chest complaint', () => {
    assert.notEqual(level('mild cold', ctx('Moderate', '1-2 Days', 'Chest / Breathing')), E);
  });
  test('unclassified + severe becomes a same-day doctor visit', () => {
    const r = assess('asdfgh', ctx('Severe'));
    assert.equal(r.level, C);
    assert.match(r.timeframe, /6 hours/);
  });
  test('unclassified stays unclassified when mild', () => assert.equal(level('asdfgh', ctx('Mild')), U));
  test('region hint is used in the fallback advice', () => {
    assert.match(assess('asdfgh', ctx('Moderate', '1-2 Days', 'Chest / Breathing')).recommendedAction, /112/);
  });
  test('emergencies are never downgraded by "Mild"', () => assert.equal(level('chest pain', ctx('Mild', '< 24 Hours')), E));
});

describe('crisis and contacts', () => {
  test('self-harm rule offers Tele-MANAS and 112', () => {
    const r = assess('I want to end my life');
    assert.deepEqual(r.contacts.map((c) => c.tel), ['14416', '112']);
  });
  test('ordinary emergencies offer 112', () => assert.deepEqual(assess('chest pain').contacts.map((c) => c.tel), ['112']));
  test('non-emergencies offer no call buttons', () => assert.deepEqual(assess('sore throat').contacts, []));
});

describe('live detection preview', () => {
  test('returns nothing for empty text', () => assert.deepEqual(detect(''), []));
  test('lists matched phrases highest level first', () => {
    const d = detect('headache and chest pain');
    assert.equal(d[0].keyword, 'chest pain');
    assert.equal(d[0].level, E);
  });
  test('prunes "fever" when "high fever" is present', () => {
    assert.deepEqual(detect('high fever').map((x) => x.keyword), ['high fever']);
  });
  test('marks negated phrases', () => assert.equal(detect('no fever')[0].negated, true));
});

describe('output helpers', () => {
  test('summary and speech text mention the key facts', () => {
    const r = assess('high fever and headache', ctx('Severe'));
    const s = summaryText(r);
    assert.match(s, /not a diagnosis/);
    assert.match(s, /CON-INF-01/);
    assert.match(speechText(r), /See a doctor/);
  });
});

describe('performance', () => {
  test('1,000 assessments finish well under a second', () => {
    const t0 = performance.now();
    for (let i = 0; i < 1000; i += 1) assess('I have a high fever and headache with a sore throat and body ache since two days', ctx());
    assert.ok(performance.now() - t0 < 1000);
  });
});
