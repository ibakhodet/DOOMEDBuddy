import type { Warband, Unit } from '../data/types';
import { sortUnits, shockTableData, casualtyTableData } from '../data/logic';
import { glossary } from '../data/glossary';
import type { renownMeter } from '../data/logic';

interface CombatProps {
  wb: Warband;
  meter: ReturnType<typeof renownMeter>;
  onOpenUnit: (id: string) => void;
  onMuster: () => void;
}

function initials(name: string): string {
  const alpha = name.replace(/[^a-zA-Z]/g, '');
  return alpha.substring(0, 2).toUpperCase();
}

const actionCardStyle: React.CSSProperties = {
  background: '#0d1115',
  border: '1px solid #2a3133',
  borderRadius: 7,
  padding: '10px 12px',
};

interface ActionDef {
  title: string;
  note: string;
  noteColor: string;
  body: React.ReactNode;
}

export default function Combat({ wb, meter, onOpenUnit, onMuster }: CombatProps) {
  const deployed = sortUnits(wb.units).filter((u) => u.inBattle);

  const actions: ActionDef[] = [
    {
      title: 'MOVE',
      note: 'roll after 1st move',
      noteColor: '#9fb2a6',
      body: (
        <>
          Straight line, a climb, or across a gap.{' '}
          <span style={{ color: '#8effa8' }}>+1 if you can see your Leader.</span>{' '}
          Fail: opponent places you short. Failed dangerous climb/leap:{' '}
          <span style={{ color: '#ff9a4a' }}>d6 Damage.</span>
        </>
      ),
    },
    {
      title: 'FIGHT',
      note: '2\u00d7 / turn',
      noteColor: '#ffba6a',
      body: (
        <>
          Weapon dice, split between targets you Touch.{' '}
          <span style={{ color: '#8effa8' }}>+1 vs a Down target.</span>{' '}
          Each hit = Weapon Damage.
        </>
      ),
    },
    {
      title: 'SHOOT',
      note: '1\u00d7 / turn',
      noteColor: '#ffba6a',
      body: (
        <>
          Not while you Touch a standing enemy. Dice split between un-touched targets.{' '}
          <span style={{ color: '#8effa8' }}>{'\u2212'}1 vs partial Cover.</span>{' '}
          Touching an ally:{' '}
          <span style={{ color: '#ff9a4a' }}>1s hit the ally.</span>
        </>
      ),
    },
    {
      title: 'RECOVER',
      note: '1\u00d7 / turn',
      noteColor: '#ffba6a',
      body: (
        <>
          You, or a Downed ally you Touch, rolls.{' '}
          <span style={{ color: '#8effa8' }}>+1 if an ally Touches the Downed unit.</span>{' '}
          Pass: stand up. Fail:{' '}
          <span style={{ color: '#ff9a4a' }}>Down.</span>
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: '13px 12px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* ---- Renown Budget Meter ---- */}
      <div
        style={{
          background: meter.boxBg,
          border: `1px solid ${meter.boxBorder}`,
          borderRadius: 7,
          padding: '10px 12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 11,
              letterSpacing: '.12em',
              color: meter.labelColor,
            }}
          >
            RENOWN BUDGET
          </span>
          <span
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: '#8a9a90',
            }}
          >
            <span style={{ fontWeight: 700, color: '#fff' }}>{meter.committed}</span>
            {' / '}{meter.cap}{' committed \u00b7 '}
            <span style={{ fontWeight: 700, color: meter.freeColor }}>{meter.freeText}</span>
          </span>
        </div>
        <div
          style={{
            marginTop: 8,
            height: 8,
            borderRadius: 5,
            background: '#061008',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,.6)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${meter.pct}%`,
              background: meter.barColor,
              borderRadius: 5,
            }}
          />
        </div>
      </div>

      {/* ---- ON THE TABLE ---- */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12,
              color: '#4fb568',
            }}
          >
            &#9656; ON THE TABLE &middot; {deployed.length}
          </span>
          <button
            onClick={onMuster}
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              color: '#aefcc0',
              border: '1px solid #2c6e3f',
              borderRadius: 5,
              padding: '4px 11px',
              background: '#0c1f13',
              cursor: 'pointer',
            }}
          >
            &#9998; DEPLOYMENT
          </button>
        </div>

        {deployed.length === 0 ? (
          <div
            style={{
              border: '1px dashed #2a3133',
              borderRadius: 7,
              padding: '18px 14px',
              textAlign: 'center',
              color: '#5a6a62',
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            No units deployed. Tap Deployment to muster your warband.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {deployed.map((unit) => {
              const weaponLine = unit.weapons
                .map((w) => {
                  const parts = [w.name];
                  if (w.notation) parts.push(w.notation);
                  if (w.mods && w.mods.length > 0)
                    parts.push(w.mods.map((m) => glossary[m]?.t || m).join(', '));
                  return parts.join(' ');
                })
                .join(' \u00b7 ');

              return (
                <div
                  key={unit.id}
                  onClick={() => onOpenUnit(unit.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'linear-gradient(#3a4042 0%,#2a2f31 10%,#1d2123 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), inset 0 -3px 6px rgba(0,0,0,.55)',
                    borderRadius: 7,
                    padding: '8px 10px',
                    cursor: 'pointer',
                  }}
                >
                  {/* Portrait */}
                  <div
                    style={{
                      width: 46,
                      height: 46,
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
                        fontSize: 17,
                        color: '#eafff0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {unit.name}
                    </div>
                    {weaponLine && (
                      <div
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: 11,
                          color: '#6a8a76',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: 2,
                        }}
                      >
                        {weaponLine}
                      </div>
                    )}
                  </div>

                  {/* QL */}
                  <div style={{ flexShrink: 0, textAlign: 'center', width: 36 }}>
                    <span
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 700,
                        fontSize: 26,
                        color: '#57ff82',
                        lineHeight: 1,
                      }}
                    >
                      {unit.ql}
                    </span>
                  </div>

                  {/* Chevron */}
                  <span
                    style={{
                      color: '#4a5a50',
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    &#8250;
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- THE TURN ---- */}
      <div
        style={{
          border: '1px solid #2c6e3f',
          borderRadius: 7,
          padding: '12px 14px',
          background: '#0a1410',
        }}
      >
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 17,
            color: '#8effa8',
          }}
        >
          3 Actions &#8594; mark Exhausted
        </div>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#6a8a76',
            marginTop: 4,
          }}
        >
          Each unit activates, takes 3 Actions, then flips to Exhausted.
        </div>
      </div>

      {/* ---- ACTIONS ---- */}
      <div>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            color: '#4fb568',
            marginBottom: 8,
          }}
        >
          &#9656; ACTIONS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {actions.map((a) => (
            <div key={a.title} style={actionCardStyle}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#eafff0',
                  }}
                >
                  {a.title}
                </span>
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 11,
                    color: a.noteColor,
                  }}
                >
                  {a.note}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: '#9fb2a6',
                  marginTop: 6,
                  lineHeight: 1.45,
                }}
              >
                {a.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- TAKING DAMAGE ---- */}
      <div style={actionCardStyle}>
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 17,
            color: '#eafff0',
            marginBottom: 6,
          }}
        >
          TAKING DAMAGE
        </div>
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: '#9fb2a6',
            lineHeight: 1.5,
          }}
        >
          Each hit deals <span style={{ color: '#8effa8' }}>Weapon Damage</span>.
          Target rolls <span style={{ color: '#8effa8' }}>Save (QL)</span> per point of damage.
          Each failed save = 1 Wound. Standing target that takes any Wounds is{' '}
          <span style={{ color: '#ff9a4a' }}>Downed</span> and rolls on the{' '}
          <span style={{ color: '#ff9a4a' }}>Shock Table (2d6)</span>.
          Downed target wounded again is{' '}
          <span style={{ color: '#ff9a4a' }}>Taken Out</span>.
        </div>
      </div>

      {/* ---- SHOCK TABLE ---- */}
      <div>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            color: '#d8b62e',
            marginBottom: 8,
          }}
        >
          &#9656; SHOCK TABLE &middot; 2d6
        </div>
        <div
          style={{
            background: '#0d1115',
            border: '1px solid #2a3133',
            borderRadius: 7,
            overflow: 'hidden',
          }}
        >
          {shockTableData.map((row) => (
            <div
              key={row.roll}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                padding: '7px 12px',
                borderBottom: `1px solid ${row.border}`,
                background: row.bg,
              }}
            >
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 14,
                  color: row.color,
                  flexShrink: 0,
                  width: 26,
                  textAlign: 'right',
                }}
              >
                {row.roll}
              </span>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: row.color,
                  flexShrink: 0,
                  width: 85,
                }}
              >
                {row.title}
              </span>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 500,
                  fontSize: 12.5,
                  color: '#97a89d',
                  flex: 1,
                }}
              >
                {row.effect}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- CASUALTY TABLE ---- */}
      <div>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            color: '#d8b62e',
            marginBottom: 8,
          }}
        >
          &#9656; CASUALTY TABLE &middot; d6 &middot; after battle
        </div>
        <div
          style={{
            background: '#0d1115',
            border: '1px solid #2a3133',
            borderRadius: 7,
            overflow: 'hidden',
          }}
        >
          {casualtyTableData.map((row) => (
            <div
              key={row.roll}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                padding: '7px 12px',
                borderBottom: `1px solid ${row.border}`,
                background: row.bg,
              }}
            >
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 14,
                  color: row.color,
                  flexShrink: 0,
                  width: 26,
                  textAlign: 'right',
                }}
              >
                {row.roll}
              </span>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: row.color,
                  flexShrink: 0,
                  width: 85,
                }}
              >
                {row.title}
              </span>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 500,
                  fontSize: 12.5,
                  color: '#97a89d',
                  flex: 1,
                }}
              >
                {row.effect}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#6a8a76',
            marginTop: 6,
            padding: '0 4px',
          }}
        >
          If a Leader is Taken Out, roll twice and pick the better result.
        </div>
      </div>
    </div>
  );
}
