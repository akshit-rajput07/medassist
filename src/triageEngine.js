// MedAssist triage engine.
//
// Pure functions only: no React, no DOM, no network. That keeps the engine fast,
// easy to unit-test (see tests/triageEngine.test.js) and usable fully offline.
//
// Pipeline for assess(text, context):
//   1. Split the text into clauses (punctuation, "but", "however", ...).
//   2. Normalise each clause: lower-case, expand contractions, strip punctuation.
//   3. Match every rule keyword against the clause tokens.
//   4. Drop matches that the user negated ("no fever", "without chills").
//   5. Rank matched rules: higher level > more keywords matched > longer match > dataset order.
//   6. Apply the context modifiers (severity, duration, body region) and the chest safety net.

import { SYMPTOM_DATASET } from './symptomData.js';
import { LEVELS, DEFAULT_CONTEXT, EMERGENCY_CONTACTS } from './constants.js';

const MAX_ANALYSED_CHARS = 2000;

/* ------------------------------------------------------------------ */
/* 1–2. Clause splitting and normalisation                             */
/* ------------------------------------------------------------------ */

const CLAUSE_SPLIT = /[.,;:!?\n\r()/]+|\s+(?:but|however|although|though|except|yet)\s+/;

const CONTRACTIONS = [
  [/\bcan\s?not\b/g, 'cannot'],
  [/\bcan'?t\b/g, 'cannot'],
  [/\bwon'?t\b/g, 'will not'],
  [/\b(do|does|did|is|are|was|were|has|have|had|should|would|could)n'?t\b/g, '$1 not'],
];

/** Lower-case, expand contractions, replace punctuation with spaces, collapse whitespace. */
export function normalize(text) {
  let t = String(text ?? '').toLowerCase().replace(/[’‘`]/g, "'");
  for (const [pattern, replacement] of CONTRACTIONS) t = t.replace(pattern, replacement);
  return t.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

const tokenize = (text) => normalize(text).split(' ').filter(Boolean);

/* ------------------------------------------------------------------ */
/* 3. Keyword matching                                                 */
/* ------------------------------------------------------------------ */

// A keyword matches when its tokens appear consecutively in the clause. Every token
// must match exactly, except the last one, which may continue ("fever" matches
// "feverish", "chest hurt" matches "chest hurts"). Tokens of 3 letters or fewer
// always match exactly, so "uti" can never match "utility".
function tokenFits(token, keywordToken, isLast) {
  if (isLast && keywordToken.length > 3) return token.startsWith(keywordToken);
  return token === keywordToken;
}

function matchesAt(tokens, keywordTokens, start) {
  if (start + keywordTokens.length > tokens.length) return false;
  for (let k = 0; k < keywordTokens.length; k += 1) {
    if (!tokenFits(tokens[start + k], keywordTokens[k], k === keywordTokens.length - 1)) return false;
  }
  return true;
}

const indexCache = new WeakMap();

/** Flattens the dataset into one searchable list of {ruleId, order, keyword, tokens}. */
function getIndex(dataset) {
  let index = indexCache.get(dataset);
  if (!index) {
    index = [];
    dataset.forEach((rule, order) => {
      for (const keyword of rule.keywords) {
        index.push({ ruleId: rule.id, order, keyword, tokens: tokenize(keyword) });
      }
    });
    indexCache.set(dataset, index);
  }
  return index;
}

/* ------------------------------------------------------------------ */
/* 4. Negation and severity cues                                       */
/* ------------------------------------------------------------------ */

const NEGATION_CUES = new Set(['no', 'not', 'without', 'never', 'denies', 'deny', 'denied', 'absent', 'negative', 'free']);

// A negation does not carry across these words: "no fever and chest pain" still
// treats chest pain as present. Missing a negation only ever raises urgency.
const NEGATION_STOPS = new Set(['and', 'but', 'also', 'plus', 'then', 'with', 'along', 'while']);

const NEGATION_WINDOW = 3;

function isNegated(tokens, start) {
  for (let j = start - 1; j >= Math.max(0, start - NEGATION_WINDOW); j -= 1) {
    const token = tokens[j];
    if (NEGATION_STOPS.has(token)) return false;
    if (NEGATION_CUES.has(token)) {
      if (token === 'not' && (tokens[j + 1] === 'sure' || tokens[j + 1] === 'certain')) return false;
      return true;
    }
  }
  return false;
}

const SEVERE_CUES = ['severe', 'unbearable', 'excruciating', 'intense', 'extreme', 'agoniz', 'terrible', 'worst'];

function hasSevereCue(tokens) {
  return tokens.some((token, i) => {
    if (!SEVERE_CUES.some((cue) => token.startsWith(cue))) return false;
    return !NEGATION_CUES.has(tokens[i - 1]) && !NEGATION_CUES.has(tokens[i - 2]);
  });
}

/* ------------------------------------------------------------------ */
/* Core analysis                                                       */
/* ------------------------------------------------------------------ */

/**
 * Finds every keyword hit in the text.
 * @returns {{hits: Array, textSevere: boolean}}
 */
export function analyze(text, dataset = SYMPTOM_DATASET) {
  const index = getIndex(dataset);
  const clauses = String(text ?? '').slice(0, MAX_ANALYSED_CHARS).toLowerCase().split(CLAUSE_SPLIT);
  const hits = [];
  const seen = new Set();
  let textSevere = false;

  clauses.forEach((clause, clauseIndex) => {
    const tokens = tokenize(clause);
    if (tokens.length === 0) return;
    let clauseHasSymptom = false;

    for (const entry of index) {
      for (let i = 0; i + entry.tokens.length <= tokens.length; i += 1) {
        if (!matchesAt(tokens, entry.tokens, i)) continue;
        const negated = isNegated(tokens, i);
        if (!negated) clauseHasSymptom = true;
        const id = `${entry.ruleId}|${entry.keyword}|${negated}`;
        if (!seen.has(id)) {
          seen.add(id);
          hits.push({ ruleId: entry.ruleId, order: entry.order, keyword: entry.keyword, negated, clause: clauseIndex });
        }
        break; // one position is enough for this keyword in this clause
      }
    }
    if (clauseHasSymptom && hasSevereCue(tokens)) textSevere = true;
  });

  return { hits, textSevere };
}

/** Removes keywords that are contained in a longer matched keyword ("fever" inside "high fever"). */
function pruneSubsumed(keywords) {
  return keywords.filter((k) => !keywords.some((other) => other !== k && other.length > k.length && other.includes(k)));
}

/**
 * Lightweight live preview used under the text box.
 * @returns {Array<{keyword:string, level:string, negated:boolean}>}
 */
export function detect(text, dataset = SYMPTOM_DATASET) {
  if (!String(text ?? '').trim()) return [];
  const { hits } = analyze(text, dataset);
  const levelOf = new Map(dataset.map((rule) => [rule.id, rule.level]));
  const best = new Map();
  for (const hit of hits) {
    const key = `${hit.keyword}|${hit.negated}`;
    const level = levelOf.get(hit.ruleId);
    const current = best.get(key);
    if (!current || LEVELS[level].rank > LEVELS[current.level].rank) best.set(key, { keyword: hit.keyword, negated: hit.negated, level });
  }
  const all = [...best.values()];
  const affirmed = new Set(all.filter((x) => !x.negated).map((x) => x.keyword));
  const visible = all.filter((x) => !x.negated || !affirmed.has(x.keyword));
  const keep = (flag) => new Set(pruneSubsumed(visible.filter((x) => x.negated === flag).map((x) => x.keyword)));
  const keepAffirmed = keep(false);
  const keepNegated = keep(true);
  return visible
    .filter((x) => (x.negated ? keepNegated : keepAffirmed).has(x.keyword))
    .sort((a, b) => LEVELS[b.level].rank - LEVELS[a.level].rank);
}

/* ------------------------------------------------------------------ */
/* 5–6. Ranking and context modifiers                                  */
/* ------------------------------------------------------------------ */

const REGION_HINTS = {
  'Chest / Breathing':
    'Chest and breathing problems can be serious. If you have pain, pressure, breathlessness or sweating, call 112 now.',
  'Head, Throat & Neck':
    'For head, throat or neck complaints, urgent care is needed if there is fever with a stiff neck, vision change, weakness or confusion.',
  'Abdomen & Digestive':
    'For belly complaints, urgent care is needed if there is vomiting blood, black stools, or severe or worsening pain.',
  'General / Systemic':
    'Note any fever, weakness, weight change or tiredness and share it with your doctor.',
};

const lowerFirst = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

function fromRule(rule) {
  return {
    id: rule.id,
    title: rule.title ?? rule.id,
    level: rule.level,
    badge: LEVELS[rule.level].badge,
    summary: rule.summary,
    recommendedAction: rule.recommendedAction,
    possibleConditions: rule.possibleConditions ?? [],
    specialist: rule.specialist,
    timeframe: rule.timeframe,
    contacts: rule.contacts ?? (rule.level === 'Emergency' ? EMERGENCY_CONTACTS : []),
  };
}

function fallbackResult(region) {
  return {
    id: 'GEN-DEFAULT',
    title: 'We could not match these symptoms',
    level: 'Unclassified',
    badge: LEVELS.Unclassified.badge,
    summary: 'None of the symptoms you described matched a rule in MedAssist. That does not mean nothing is wrong.',
    recommendedAction:
      `${REGION_HINTS[region] ?? REGION_HINTS['General / Systemic']} ` +
      'If symptoms get worse, last more than 2 days, or you are worried, see a doctor. ' +
      'You can also try specific words such as "fever", "chest pain" or "sore throat".',
    possibleConditions: [],
    specialist: 'General Physician',
    timeframe: 'If unsure, within 24–48 hours',
    contacts: [],
  };
}

function safetyNetResult() {
  return {
    id: 'SAFETY-NET-01',
    title: 'Severe chest or breathing symptoms',
    level: 'Emergency',
    badge: LEVELS.Emergency.badge,
    summary:
      'You marked chest or breathing symptoms as severe. These can signal a heart or lung emergency even when no specific warning phrase was found.',
    recommendedAction:
      'Call 112 now or go to the nearest emergency department. Sit upright, stay calm and avoid exertion until help arrives.',
    possibleConditions: ['Acute Coronary Syndrome', 'Pulmonary Embolism', 'Severe Asthma Attack'],
    specialist: 'Emergency Medicine',
    timeframe: 'Immediate (0–15 mins)',
    contacts: EMERGENCY_CONTACTS,
  };
}

/** Orders candidate rules: level, then keyword count, then matched characters, then dataset order. */
function rankCandidates(hits, dataset) {
  const ruleById = new Map(dataset.map((rule, order) => [rule.id, { rule, order }]));
  const grouped = new Map();
  for (const hit of hits) {
    if (hit.negated) continue;
    const entry = grouped.get(hit.ruleId) ?? { ...ruleById.get(hit.ruleId), keywords: [], chars: 0 };
    entry.keywords.push(hit.keyword);
    entry.chars += hit.keyword.length;
    grouped.set(hit.ruleId, entry);
  }
  return [...grouped.values()].sort(
    (a, b) =>
      LEVELS[b.rule.level].rank - LEVELS[a.rule.level].rank ||
      b.keywords.length - a.keywords.length ||
      b.chars - a.chars ||
      a.order - b.order,
  );
}

/**
 * Runs a full triage assessment.
 * @param {string} text     what the user typed or said
 * @param {object} context  {severity, duration, bodyRegion}
 * @returns {object|null}   result object, or null for empty input
 */
export function assess(text, context = {}, dataset = SYMPTOM_DATASET) {
  const input = String(text ?? '').trim();
  if (!input) return null;

  const ctx = { ...DEFAULT_CONTEXT, ...context };
  const { hits, textSevere } = analyze(input, dataset);
  const candidates = rankCandidates(hits, dataset);
  const primary = candidates[0];

  const severeByUser = ctx.severity === 'Severe';
  const severe = severeByUser || (Boolean(primary) && textSevere);
  const severeReason = severeByUser ? 'You rated these symptoms as severe.' : 'You described the symptoms as severe.';
  const longLasting = ctx.duration === '3+ Days';

  let result = primary ? fromRule(primary.rule) : fallbackResult(ctx.bodyRegion);
  const baseLevel = result.level;
  const baseRank = LEVELS[baseLevel].rank;
  const reasons = [];
  const notes = [];
  let urgent = false;
  let escalated = false;

  if (severe && ctx.bodyRegion === 'Chest / Breathing' && baseRank < LEVELS.Emergency.rank) {
    // Safety net SN-01: severe chest or breathing symptoms are always treated as an emergency.
    result = safetyNetResult();
    reasons.push(severeReason);
    escalated = true;
  } else if (baseRank === LEVELS['Medical Consultation'].rank) {
    if (severe) {
      urgent = true;
      escalated = true;
      result.timeframe = 'Today, within 6 hours';
      reasons.push(severeReason);
    }
    if (longLasting) notes.push('Symptoms lasting 3 days or more need a doctor’s examination; do not wait it out.');
  } else if (baseRank <= LEVELS['General Guidance'].rank && (severe || longLasting)) {
    // Self-care or unclassified symptoms become a doctor visit when severe or long-lasting.
    const original = result.recommendedAction;
    if (severe) reasons.push(severeReason);
    if (longLasting) reasons.push('Symptoms have lasted 3 days or more.');
    const wasFallback = baseLevel === 'Unclassified';
    result.level = 'Medical Consultation';
    result.badge = LEVELS['Medical Consultation'].badge;
    result.timeframe = severe ? 'Today, within 6 hours' : 'Within 24–48 hours';
    result.recommendedAction = wasFallback
      ? `Have a doctor check this rather than waiting it out. ${original}`
      : `See a doctor ${severe ? 'today' : 'within 24–48 hours'} rather than waiting it out. Until then: ${lowerFirst(original)}`;
    if (wasFallback) result.title = 'Symptoms that need a doctor’s review';
    urgent = severe;
    escalated = true;
  }

  const affirmed = hits.filter((h) => !h.negated).map((h) => h.keyword);
  const negatedOnly = [...new Set(hits.filter((h) => h.negated).map((h) => h.keyword))].filter((k) => !affirmed.includes(k));

  return {
    ...result,
    matchedKeywords: primary ? pruneSubsumed(primary.keywords) : [],
    negatedKeywords: pruneSubsumed(negatedOnly),
    alsoMatched: candidates.slice(1, 4).map(({ rule }) => ({ id: rule.id, title: rule.title ?? rule.id, level: rule.level })),
    isFallback: !primary,
    baseLevel,
    escalated,
    urgent,
    reasons,
    notes,
    context: { ...ctx, severityEffective: severe ? 'Severe' : ctx.severity },
    input,
    generatedAt: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Output helpers                                                      */
/* ------------------------------------------------------------------ */

/** Text read aloud by the speech synthesiser. */
export function speechText(result) {
  const meta = LEVELS[result.level];
  const parts = [`${meta.label}. ${result.title}.`, ...result.reasons, result.recommendedAction];
  if (result.timeframe) parts.push(`When to act: ${result.timeframe}.`);
  return parts.join(' ');
}

/** Plain-text summary for the "Copy summary" button, handy to show a doctor. */
export function summaryText(result) {
  const meta = LEVELS[result.level];
  const when = new Date(result.generatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  const lines = [
    'MedAssist triage summary (educational prototype, not a diagnosis)',
    `Generated: ${when}`,
    '',
    `Result: ${meta.label} (${meta.short}), ${result.title}`,
    `Rule: ${result.id}`,
    `What to do: ${result.recommendedAction}`,
    `When: ${result.timeframe}`,
    `Who to see: ${result.specialist}`,
  ];
  if (result.reasons.length) lines.push(`Why this was raised: ${result.reasons.join(' ')}`);
  if (result.possibleConditions.length) lines.push(`Possible conditions to discuss: ${result.possibleConditions.join(', ')}`);
  lines.push(
    '',
    `Your description: "${result.input}"`,
    `Severity: ${result.context.severity}. Duration: ${result.context.duration}. Region: ${result.context.bodyRegion}.`,
  );
  if (result.matchedKeywords.length) lines.push(`Matched: ${result.matchedKeywords.join(', ')}`);
  if (result.negatedKeywords.length) lines.push(`Ruled out by you: ${result.negatedKeywords.join(', ')}`);
  return lines.join('\n');
}
