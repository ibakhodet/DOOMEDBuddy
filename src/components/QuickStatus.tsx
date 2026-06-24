import type { Unit, UnitStatus } from '../data/types';
import { glossary } from '../data/glossary';

interface QuickStatusProps {
  unit: Unit;
  onClose: () => void;
  onSetStatus: (status: UnitStatus) => void;
}

const statusOptions: { key: UnitStatus; color: string }[] = [
  { key: 'ok', color: '#7effb0' },
  { key: 'wounded', color: '#ff9a4a' },
  { key: 'lost', color: '#ff6a5a' },
  { key: 'mia', color: '#e0903a' },
  { key: 'injured', color: '#ff9a4a' },
  { key: 'scarred', color: '#aab0b8' },
  { key: 'dead', color: '#ff6a5a' },
];

function initials(name: string): string {
  const alpha = name.replace(/[^a-zA-Z]/g, '');
  return alpha.substring(0, 2).toUpperCase();
}

export default function QuickStatus({ unit, onClose, onSetStatus }: QuickStatusProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 32,
        background: 'rgba(4,6,7,.6)',
        animation: 'fadeIn .12s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'linear-gradient(#1b1f21, #121517)',
          border: '1px solid #2c6e3f',
          borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,.7)',
          animation: 'cardIn .2s ease',
          padding: 16,
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Portrait */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 5,
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
              background: '#14181a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unit.img ? (
              <img
                src={unit.img}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#3a4a42',
                  zIndex: 1,
                }}
              >
                {initials(unit.name)}
              </span>
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'repeating-linear-gradient(0deg, rgba(70,255,120,.06) 0 2px, transparent 2px 4px)',
                pointerEvents: 'none',
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: '#eafff0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {unit.name}
            </div>
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                color: '#6a8a76',
              }}
            >
              SET STATUS
            </div>
          </div>
        </div>

        {/* Status chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 7,
            marginTop: 14,
          }}
        >
          {statusOptions.map((opt) => {
            const isActive = unit.status === opt.key;
            const label = glossary[opt.key]?.t || opt.key;

            return (
              <button
                key={opt.key}
                onClick={() => onSetStatus(opt.key)}
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 6,
                  padding: '7px 13px',
                  cursor: 'pointer',
                  border: isActive
                    ? `1px solid ${opt.color}`
                    : '1px solid #3a4143',
                  color: isActive ? opt.color : '#8a9a90',
                  background: isActive ? 'rgba(255,255,255,.06)' : '#14181a',
                }}
              >
                {label.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
