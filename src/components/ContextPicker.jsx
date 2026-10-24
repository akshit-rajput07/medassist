import { DURATION_OPTIONS, REGION_OPTIONS, SEVERITY_OPTIONS } from '../constants.js';

function Segmented({ legend, name, value, options, onChange }) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="label mb-2 p-0">{legend}</legend>
      <div className="seg">
        {options.map((option) => (
          <label key={option.value}>
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ContextPicker({ context, onChange }) {
  const set = (key) => (value) => onChange((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Segmented legend="How bad is it?" name="severity" value={context.severity} options={SEVERITY_OPTIONS} onChange={set('severity')} />
        <Segmented legend="How long has it lasted?" name="duration" value={context.duration} options={DURATION_OPTIONS} onChange={set('duration')} />
      </div>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="label mb-2 p-0">Where do you feel it most?</legend>
        <div className="seg-wrap">
          {REGION_OPTIONS.map((option) => (
            <label key={option.value} className="pick">
              <input
                type="radio"
                name="region"
                value={option.value}
                checked={context.bodyRegion === option.value}
                onChange={() => set('bodyRegion')(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
