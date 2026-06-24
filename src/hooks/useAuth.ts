import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  User,
} from 'firebase/auth';
import { auth, PLAYERS } from '../firebase';

const EMAIL_KEY = 'doomed_emailForSignIn';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if returning from email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem(EMAIL_KEY);
      if (!email) {
        email = window.prompt('Please enter your email for confirmation') || '';
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem(EMAIL_KEY);
          // Clean URL
          window.history.replaceState(null, '', window.location.pathname);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email) {
        const name = PLAYERS[u.email.toLowerCase()];
        if (name) {
          setUser(u);
          setPlayerName(name);
          setError(null);
        } else {
          // Not on the roster
          signOut(auth);
          setUser(null);
          setPlayerName(null);
          setError('Not on the roster. This app is for Martin, Sigve, and Tord only.');
        }
      } else {
        setUser(null);
        setPlayerName(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const sendLink = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin + window.location.pathname,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem(EMAIL_KEY, email);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send link');
      return false;
    }
  };

  const logout = () => signOut(auth);

  return { user, playerName, loading, error, sendLink, logout };
}
