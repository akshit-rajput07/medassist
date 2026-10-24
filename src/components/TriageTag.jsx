import { Activity, CircleCheck, Clock, Copy, Phone, ShieldAlert, Square, TriangleAlert, UserRound, Volume2 } from 'lucide-react';
import { LEVELS } from '../constants.js';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js';
import { speechText, summaryText } from '../triageEngine.js';

const LEVEL_ICONS = {
  Emergency: ShieldAlert,
  'Medical Consultation': TriangleAlert,
  'General Guidance': CircleCheck,
  Unclassified: Activity,
};

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }
}

function Chips({ label, items, negated = false }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label">{label}</span>
      {items.map((item) => (
        <span key={item} className="chip" data-negated={negated}>
          <span className="chip-text">{item}</span>
        </span>
      ))}
    </div>
  );
}

export default function TriageTag({ result, stale, onNotify }) {
  const meta = LEVELS[result.level];
  const Icon = LEVEL_ICONS[result.level];
  const isEmergency = result.level === 'Emergency';
  const voice = useSpeechSynthesis();

  const handleCopy = async () => {
    const ok = await copyToClipboard(summaryText(result));
    onNotify(ok ? 'Summary copied' : 'Could not copy. Select the text and copy it manually.');
  };

  return (
    <section
      className="tag"
      data-level={result.level}
      data-stale={stale}
      role={isEmergency ? 'alert' : 'region'}
      aria-labelledby="tag-title"
    >
      <div className="tag-band">
        <div className="flex flex-wrap items-center gap-2 text-[0.95rem] font-bold">
          <Icon size={20} aria-hidden="true" />
          <span>{meta.label}</span>
          <span className="pill">{meta.short}</span>
          {result.urgent && <span className="pill">Urgent</span>}
        </div>
        <h2 id="tag-title" className="serif m-0 mt-3 text-[1.85rem] font-bold leading-[1.15]">
          {result.title}
        </h2>
      </div>

      <div className="tag-tear" aria-hidden="true" />

      <div className="tag-body grid gap-5">
        {stale && (
          <p className="notice m-0 font-medium" role="status">
            You changed your answers. Check symptoms again to update this result.
          </p>
        )}

        {result.reasons.length > 0 && (
          <p className="notice m-0">
            <strong>Raised because: </strong>
            {result.reasons.join(' ')}
          </p>
        )}

        <div>
          <p className="label m-0 mb-1">What to do</p>
          <p className="m-0 text-[1.1rem] font-medium leading-snug">{result.recommendedAction}</p>
          {result.notes.map((note) => (
            <p key={note} className="muted m-0 mt-2 text-[0.95rem]">
              {note}
            </p>
          ))}
        </div>

        {result.contacts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.contacts.map((contact) => (
              <a key={contact.tel} className="btn btn-call" href={`tel:${contact.tel}`}>
                <Phone size={18} aria-hidden="true" />
                {contact.label}
              </a>
            ))}
          </div>
        )}
        {isEmergency && result.id !== 'EMG-MH-10' && (
          <p className="muted m-0 -mt-2 text-sm">Ambulance numbers vary by state (102 or 108). 112 works across India.</p>
        )}

        <dl className="m-0 grid grid-cols-2 gap-4">
          <div>
            <dt className="label flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              When
            </dt>
            <dd className="m-0 mt-0.5 font-semibold">{result.timeframe}</dd>
          </div>
          <div>
            <dt className="label flex items-center gap-1.5">
              <UserRound size={14} aria-hidden="true" />
              Who to see
            </dt>
            <dd className="m-0 mt-0.5 font-semibold">{result.specialist}</dd>
          </div>
        </dl>

        <hr className="divider" />

        <div className="grid gap-3">
          <p className="m-0 text-[0.95rem]">{result.summary}</p>

          {result.possibleConditions.length > 0 && (
            <div>
              <p className="label m-0 mb-1.5">Possible causes to discuss with a doctor</p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {result.possibleConditions.map((condition) => (
                  <li key={condition} className="chip">
                    {condition}
                  </li>
                ))}
              </ul>
              <p className="muted m-0 mt-2 text-sm">These are possibilities, not a diagnosis.</p>
            </div>
          )}

          <Chips label="Matched" items={result.matchedKeywords} />
          <Chips label="You ruled out" items={result.negatedKeywords} negated />
          {result.alsoMatched.length > 0 && (
            <p className="muted m-0 text-sm">Also noticed: {result.alsoMatched.map((m) => m.title.toLowerCase()).join(', ')}.</p>
          )}
        </div>

        <hr className="divider" />

        <div className="flex flex-wrap items-center gap-2">
          {voice.supported && (
            <button type="button" className="btn btn-quiet" onClick={() => (voice.speaking ? voice.cancel() : voice.speak(speechText(result)))}>
              {voice.speaking ? <Square size={16} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
              {voice.speaking ? 'Stop reading' : 'Read aloud'}
            </button>
          )}
          <button type="button" className="btn btn-quiet" onClick={handleCopy}>
            <Copy size={17} aria-hidden="true" />
            Copy summary
          </button>
          <span className="muted ml-auto text-xs">Rule {result.id}</span>
        </div>
      </div>
    </section>
  );
}
