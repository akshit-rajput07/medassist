import { LEVELS } from '../constants.js';

const ORDER = ['Emergency', 'Medical Consultation', 'General Guidance'];

// Shown before the first result. It teaches the three outcomes the person is about to see.
export default function LevelGuide({ ruleCount }) {
  return (
    <section className="panel p-6" aria-labelledby="guide-title">
      <h2 id="guide-title" className="serif m-0 text-[1.5rem] font-bold leading-tight">
        Your result will appear here
      </h2>
      <p className="muted m-0 mb-5 mt-1 text-[0.95rem]">
        MedAssist sorts symptoms into three levels, the same way a hospital triage nurse tags patients.
      </p>

      <div className="grid gap-4">
        {ORDER.map((level) => {
          const meta = LEVELS[level];
          return (
            <div key={level} className="lv-row" data-level={level}>
              <p className="m-0 font-bold">
                {meta.short}: {meta.label}
              </p>
              <p className="m-0 text-[0.95rem]">{meta.guide}</p>
              <p className="muted m-0 text-sm">{meta.examples}</p>
            </div>
          );
        })}
      </div>

      <hr className="divider my-5" />
      <p className="muted m-0 text-sm">
        {ruleCount} rules run on your device. What you type is never sent anywhere.
      </p>
    </section>
  );
}
