import type { Warband } from '../data/types';
import { sortUnits, unitCost, statusColors } from '../data/logic';
import { glossary } from '../data/glossary';

interface MusterOverlayProps {
  wb: Warband;
  onClose: () => void;
  onToggleDeploy: (id: string) => void;
}

function initials(name: string): string {
  const alpha = name.replace(/[^a-zA-Z]/g, '');
  return alpha.substring(0, 2).toUpperCase();
}

export default function MusterOverlay({ wb, onClose, onToggleDeploy }: MusterOverlayProps) {
  const sorted = sortUnits(wb.units).filter(u => u.inWarband !== false);
  const deployed = sorted.filter(u => u.inBattle).length;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        background: 'rgba(4,6,7,.9)',
        animation: 'fadeIn .18s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          flexShrink: 0,
          flexGrow: 0,
          padding: '14px 16px',
          background: 'linear-gradient(#2a2f31, #1d2123)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12,
              color: '#46ff77',
            }}
          >
            &#9700; MUSTER
          </div>
          <div
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              color: '#6a786e',
            }}
          >
            Tap to deploy &middot; {deployed} on the table
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: '#aefcc0',
            border: '1px solid #2c6e3f',
            borderRadius: 5,
            padding: '5px 14px',
            background: '#0c1f13',
            cursor: 'pointer',
          }}
        >
          DONE
        </button>
      </div>

      {/* Body */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {sorted.map((unit) => {
          const isDeployed = unit.inBattle;
          const cost = unitCost(unit);

          return (
            <div
              key={unit.id}
              onClick={() => onToggleDeploy(unit.id)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                borderRadius: 8,
                padding: '10px 13px',
                cursor: 'pointer',
                background: isDeployed ? '#07140b' : '#0d1115',
                border: isDeployed
                  ? '1px solid #2c6e3f'
                  : '1px solid #2a3133',
                alignItems: 'center',
              }}
            >
              {/* Portrait */}
              <div
                style={{
                  width: 44,
                  height: 44,
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
                      fontSize: 18,
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

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
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
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    color: '#7fb98f',
                    textTransform: 'uppercase',
                  }}
                >
                  {glossary[unit.role]?.t || unit.role} &middot; QL{unit.ql} &middot; {cost}pts
                </div>
              </div>

              {/* Deploy badge */}
              <div
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '.04em',
                  borderRadius: 5,
                  padding: '5px 10px',
                  color: isDeployed ? '#57ff82' : '#5a6660',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {isDeployed ? '\u2713 DEPLOYED' : 'ON BENCH'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
