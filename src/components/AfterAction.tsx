import type { Warband, AfterActionState } from '../data/types';
import { sortUnits, statusColors } from '../data/logic';
import { glossary } from '../data/glossary';

interface AfterActionProps {
  wb: Warband;
  aa: AfterActionState;
  onClose: () => void;
  onToggleWin: () => void;
  onAward: (delta: number) => void;
  onOutcome: (uid: string, key: string) => void;
  onApply: () => void;
}

const outcomePalette: Record<string, [string, string]> = {
  ok: ['#7effb0', '#1f4a3a'],
  scarred: ['#aab0b8', '#3a4143'],
  wounded: ['#ff9a4a', '#7a4a1e'],
  injured: ['#ff9a4a', '#7a4a1e'],
  mia: ['#e0903a', '#5a3f1e'],
  lost: ['#ff6a5a', '#7a2a22'],
  critical: ['#ff6a5a', '#7a2a22'],
  dead: ['#ff6a5a', '#7a2a22'],
};

const outcomeKeys = ['ok', 'scarred', 'wounded', 'injured', 'mia', 'lost', 'critical', 'dead'];

export default function AfterAction({
  wb,
  aa,
  onClose,
  onToggleWin,
  onAward,
  onOutcome,
  onApply,
}: AfterActionProps) {
  const battleUnits = sortUnits(wb.units).filter((u) => u.inBattle);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        background: 'rgba(4,6,7,.72)',
        animation: 'fadeIn .15s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '14px 16px',
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
              color: '#d8b62e',
            }}
          >
            &#9700; AFTER-ACTION
          </div>
          <div
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              color: '#6a786e',
            }}
          >
            Roll Casualties for each unit Taken Out
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: '#8a9a90',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          &#10005;
        </button>
      </div>

      {/* Body */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 14,
        }}
      >
        {/* Win/Loss toggle + Renown award stepper */}
        <div
          style={{
            display: 'flex',
            gap: 9,
            marginBottom: 14,
          }}
        >
          {/* Win toggle */}
          <button
            onClick={onToggleWin}
            style={{
              flex: 1,
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: aa.win ? '#8effa8' : '#9aa8a0',
              background: aa.win ? '#0c1f13' : '#0d1115',
              border: aa.win ? '1px solid #2c6e3f' : '1px solid #2a3133',
              borderRadius: 8,
              padding: '11px 10px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div>{aa.win ? '\u2713 SCENARIO WON' : 'SCENARIO LOST'}</div>
            <div
              style={{
                fontWeight: 500,
                fontSize: 10,
                color: '#6a786e',
                marginTop: 2,
              }}
            >
              TAP TO TOGGLE
            </div>
          </button>

          {/* Award stepper */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0d1115',
              border: '1px solid #2a3133',
              borderRadius: 8,
              padding: '8px 10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <button
                onClick={() => onAward(-1)}
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#8a9a90',
                  background: 'transparent',
                  border: '1px solid #2a3133',
                  borderRadius: 6,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                &minus;
              </button>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#8effa8',
                }}
              >
                +{aa.award}
              </span>
              <button
                onClick={() => onAward(1)}
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#8a9a90',
                  background: 'transparent',
                  border: '1px solid #2a3133',
                  borderRadius: 6,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10,
                color: '#6a786e',
                marginTop: 3,
                letterSpacing: '.08em',
              }}
            >
              RENOWN
            </div>
          </div>
        </div>

        {/* Unit outcome rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {battleUnits.map((unit) => {
            const selected = aa.outcomes[unit.id] || '';

            return (
              <div
                key={unit.id}
                style={{
                  background: 'linear-gradient(#171c1e, #10141a)',
                  borderRadius: 8,
                  padding: '11px 12px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#eafff0',
                  }}
                >
                  {unit.name}
                </div>

                {/* Outcome chips */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  {outcomeKeys.map((key) => {
                    const isActive = selected === key;
                    const palette = outcomePalette[key];

                    return (
                      <button
                        key={key}
                        onClick={() => onOutcome(unit.id, key)}
                        style={{
                          fontFamily: "'Chakra Petch', sans-serif",
                          fontWeight: isActive ? 700 : 600,
                          fontSize: 11,
                          color: isActive ? palette[0] : '#7a847e',
                          background: isActive ? '#13251a' : '#0d1115',
                          border: `1px solid ${isActive ? palette[1] : '#222a2a'}`,
                          borderRadius: 5,
                          padding: '5px 9px',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '.03em',
                        }}
                      >
                        {glossary[key]?.t || key}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* APPLY button */}
        <button
          onClick={onApply}
          style={{
            marginTop: 16,
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: '#07140b',
            background: 'linear-gradient(#57ff82, #2fbf5a)',
            border: 'none',
            borderRadius: 8,
            padding: 13,
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
          }}
        >
          &#10003; APPLY &mdash; LOG &amp; AWARD RENOWN
        </button>
      </div>
    </div>
  );
}
