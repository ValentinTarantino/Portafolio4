import { useEffect, useRef, useState } from 'react';
import './OnlineCounter.css';

const HEARTBEAT_MS = 20000;
const FRESH_MS = 60000;

const OnlineCounter = ({ t }) => {
  const [count, setCount] = useState(1);
  const sessionId = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  useEffect(() => {
    let cancelled = false;
    let idleId;
    let timeoutId;
    let cleanupPresence = () => {};

    const initializePresence = async () => {
      try {
        const [firestore, firebase] = await Promise.all([
          import('firebase/firestore'),
          import('../lib/firebase'),
        ]);
        if (cancelled) return;

        const { db } = firebase;
        const {
          collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc,
        } = firestore;
        const ref = doc(db, 'presence', sessionId.current);
        const presenceQuery = query(collection(db, 'presence'), orderBy('lastSeen', 'desc'), limit(100));
        let heartbeatId;
        let unsubscribe = () => {};

        const beat = () => {
          if (!document.hidden) {
            setDoc(ref, { lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
          }
        };

        const subscribe = () => {
          unsubscribe();
          if (document.hidden) return;
          unsubscribe = onSnapshot(presenceQuery, (snap) => {
            const now = Date.now();
            let fresh = 0;
            snap.forEach((presenceDoc) => {
              const timestamp = presenceDoc.data()?.lastSeen;
              if (!timestamp || now - timestamp.toMillis() < FRESH_MS) fresh += 1;
            });
            setCount(Math.max(fresh, 1));
          }, () => {});
        };

        const onVisibilityChange = () => {
          clearInterval(heartbeatId);
          unsubscribe();
          if (!document.hidden) {
            beat();
            heartbeatId = window.setInterval(beat, HEARTBEAT_MS);
            subscribe();
          }
        };

        const remove = () => {
          deleteDoc(ref).catch(() => {});
        };

        if (!document.hidden) {
          beat();
          heartbeatId = window.setInterval(beat, HEARTBEAT_MS);
          subscribe();
        }
        window.addEventListener('beforeunload', remove);
        document.addEventListener('visibilitychange', onVisibilityChange);

        cleanupPresence = () => {
          clearInterval(heartbeatId);
          unsubscribe();
          window.removeEventListener('beforeunload', remove);
          document.removeEventListener('visibilitychange', onVisibilityChange);
          remove();
        };
      } catch {
        // Presence is optional; the rest of the portfolio remains available offline.
      }
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(initializePresence, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(initializePresence, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      window.clearTimeout(timeoutId);
      cleanupPresence();
    };
  }, []);

  return (
    <div className="online-counter" title={t.onlineNow} aria-live="polite">
      <span className="online-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </span>
      <span key={count} className="online-count pop">{count}</span>
    </div>
  );
};

export default OnlineCounter;
