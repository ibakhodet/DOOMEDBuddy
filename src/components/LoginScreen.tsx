import { useState } from 'react';

interface LoginScreenProps {
  error: string | null;
  onSendLink: (email: string) => Promise<boolean>;
}

export default function LoginScreen({ error, onSendLink }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email || sending) return;
    setSending(true);
    const ok = await onSendLink(email);
    setSending(false);
    if (ok) setSent(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0e1112',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Chakra Petch', sans-serif",
      }}
    >
      <div style={{ width: '100%', maxWidth: 340, padding: '0 20px' }}>
        {/* hazard stripe */}
        <div
          style={{
            height: 7,
            background:
              'repeating-linear-gradient(45deg, #cdae2e 0 11px, #16140d 11px 22px)',
            opacity: 0.85,
            borderRadius: '4px 4px 0 0',
            marginBottom: 28,
          }}
        />

        {/* title */}
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 16,
            color: '#46ff77',
            letterSpacing: '.18em',
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          &#9700; DOOMED // WB
        </div>

        {/* subtitle */}
        <div
          style={{
            fontSize: 14,
            color: '#8a9a90',
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          Enter your email to receive a magic sign-in link
        </div>

        {/* email input */}
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#041007',
            border: '1px solid #14361d',
            borderRadius: 6,
            padding: 12,
            color: '#8effa8',
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: 15,
            outline: 'none',
            marginBottom: 14,
          }}
        />

        {/* send button */}
        <button
          onClick={handleSubmit}
          disabled={sending || !email}
          style={{
            width: '100%',
            background: 'linear-gradient(#57ff82, #2fbf5a)',
            color: '#07140b',
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 8,
            padding: 13,
            border: 'none',
            cursor: sending || !email ? 'default' : 'pointer',
            opacity: sending || !email ? 0.6 : 1,
            marginBottom: 16,
          }}
        >
          {sending ? 'Sending...' : 'Send Sign-In Link'}
        </button>

        {/* success message */}
        {sent && (
          <div
            style={{
              color: '#8effa8',
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            Check your email for the sign-in link
          </div>
        )}

        {/* error message */}
        {error && (
          <div
            style={{
              color: '#ff6a5a',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
