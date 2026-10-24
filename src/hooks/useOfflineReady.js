import { useEffect, useState } from 'react';

/**
 * True once a service worker is active. The worker only activates after every
 * app file has been precached, so "ready" really means "works with no network".
 * (In `npm run dev` no worker is registered, so this stays false.)
 */
export function useOfflineReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;
    let cancelled = false;
    navigator.serviceWorker.ready.then(() => !cancelled && setReady(true)).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
