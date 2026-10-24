import { Download, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import LogoMark from './LogoMark.jsx';

export default function Header({ theme, onToggleTheme, online, offlineReady, canInstall, onInstall }) {
  const dark = theme === 'dark';

  let statusText = 'Online';
  if (!online) statusText = 'Offline: everything still works';
  else if (offlineReady) statusText = 'Ready for offline use';

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 pb-5 pt-5 sm:px-6">
      <div className="flex items-center gap-3">
        <LogoMark size={44} />
        <div>
          <h1 className="serif m-0 text-2xl font-bold leading-none">MedAssist</h1>
          <p className="muted m-0 mt-1 text-sm">Offline symptom checker and triage advisor</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="status" data-state={online ? 'online' : 'offline'} role="status">
          <span className="status-dot" aria-hidden="true" />
          {online ? <Wifi size={15} aria-hidden="true" /> : <WifiOff size={15} aria-hidden="true" />}
          <span className="hidden sm:inline">{statusText}</span>
          <span className="sm:hidden">{online ? (offlineReady ? 'Offline ready' : 'Online') : 'Offline'}</span>
        </span>

        {canInstall && (
          <button type="button" className="btn btn-quiet" style={{ minHeight: 42, padding: '0.4rem 0.9rem' }} onClick={onInstall}>
            <Download size={16} aria-hidden="true" />
            Install app
          </button>
        )}

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
