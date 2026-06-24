import { glossary } from '../data/glossary';
import { linkify, decode, weaponCost } from '../data/logic';

interface GlossarySheetProps {
  sheetKey: string;
  onClose: () => void;
  onChip: (key: string) => void;
}

export default function GlossarySheet({ sheetKey, onClose, onChip }: GlossarySheetProps) {
  const entry = glossary[sheetKey];
  if (!entry) return null;

  const isTrained = sheetKey === 'trained';
  const isEpic = entry.c.includes('Epic') || entry.c === 'Reward · Upgrade';
  const accentColor = isTrained ? '#d8b62e' : '#46ff77';
  const titleColor = isEpic ? '#d2b6ff' : '#8effa8';
  const linked = linkify(entry.b, sheetKey);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        background: 'rgba(4,6,7,.55)',
        animation: 'fadeIn .15s ease',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'linear-gradient(#1b1f21, #121517)',
          borderTop: `2px solid ${accentColor}`,
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -10px 30px rgba(0,0,0,.6)',
          animation: 'sheetUp .24s cubic-bezier(.2,.8,.2,1)',
          padding: '16px 18px 26px',
        }}
      >
        {/* Grab handle */}
        <div
          style={{
            width: 44,
            height: 4,
            borderRadius: 3,
            background: '#3a4143',
            margin: '0 auto 14px',
          }}
        />

        {/* Title row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: titleColor,
            }}
          >
            {entry.t}
          </span>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12,
              letterSpacing: '.1em',
              color: accentColor,
            }}
          >
            {entry.c}
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 500,
            fontSize: 17,
            lineHeight: 1.5,
            color: '#d6e0da',
            marginTop: 12,
          }}
        >
          {linked.map((seg, i) =>
            seg.key ? (
              <span
                key={i}
                onClick={() => onChip(seg.key!)}
                style={{
                  color: '#9fc0ff',
                  borderBottom: '1px dotted #6a7fc0',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </div>

        {/* Close button */}
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: '#8a9a90',
              border: '1px solid #3a4143',
              borderRadius: 7,
              padding: 11,
              background: 'transparent',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
