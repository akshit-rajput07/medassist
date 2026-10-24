// The MedAssist mark: a triage tag (punched hole at the top) carrying a medical cross.
// Colours come from CSS variables so it follows light and dark mode.
export default function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <rect width="512" height="512" rx="112" fill="var(--c-brand)" />
      <rect x="156" y="96" width="200" height="320" rx="36" fill="var(--c-on-brand)" />
      <circle cx="256" cy="150" r="22" fill="var(--c-brand)" />
      <rect x="234" y="236" width="44" height="128" rx="10" fill="var(--c-brand)" />
      <rect x="192" y="278" width="128" height="44" rx="10" fill="var(--c-brand)" />
    </svg>
  );
}
