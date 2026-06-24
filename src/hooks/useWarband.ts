import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { Warband } from '../data/types';
import { getSeedWarbands } from '../data/seed';

// Now keyed by player name (MARTIN, SIGVE, TORD) instead of uid
export function useWarband(playerName: string | null) {
  const [warband, setWarband] = useState<Warband | null>(null);
  const [loading, setLoading] = useState(true);
  const wbRef = useRef<Warband | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !playerName) {
      setWarband(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'warbands', playerName);

    // Check if doc exists, seed if not
    getDoc(docRef).then((snap) => {
      if (!snap.exists()) {
        const seed = getSeedWarbands().find((w) => w.player === playerName);
        if (seed) {
          setDoc(docRef, seed).catch(console.error);
        }
      }
    });

    // Subscribe to live updates
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Warband;
        wbRef.current = data;
        setWarband(data);
      }
      setLoading(false);
    });

    return unsub;
  }, [playerName]);

  const save = useCallback(
    (updatedWb: Warband) => {
      if (!playerName || !db) return;
      wbRef.current = updatedWb;
      setWarband({ ...updatedWb });

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const docRef = doc(db!, 'warbands', playerName);
        setDoc(docRef, updatedWb).catch(console.error);
      }, 400);
    },
    [playerName]
  );

  const update = useCallback(
    (fn: (wb: Warband) => void) => {
      if (!wbRef.current) return;
      const clone = JSON.parse(JSON.stringify(wbRef.current)) as Warband;
      fn(clone);
      save(clone);
    },
    [save]
  );

  return { warband, loading, save, update };
}
