import { useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
    const ref = doc(db, 'presence', sessionId.current);

    const beat = () => {
      setDoc(ref, { lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
    };
    beat();
    const interval = setInterval(beat, HEARTBEAT_MS);

    const remove = () => {
      deleteDoc(ref).catch(() => {});
    };
    window.addEventListener('beforeunload', remove);

    // Realtime listener: recounts instantly on every join/leave
    const q = query(collection(db, 'presence'), orderBy('lastSeen', 'desc'), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      let fresh = 0;
      snap.forEach((d) => {
        const ts = d.data()?.lastSeen;
        // Docs without a resolved timestamp yet count as fresh (just joined)
        if (!ts || now - ts.toMillis() < FRESH_MS) fresh += 1;
      });
      setCount(Math.max(fresh, 1));
    }, () => {});

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', remove);
      unsub();
      remove();
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
