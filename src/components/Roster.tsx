import type { Warband, Unit } from '../data/types';
import { sortUnits, unitCost, statusColors, weaponCost } from '../data/logic';
import { glossary } from '../data/glossary';
import type { renownMeter } from '../data/logic';

interface RosterProps {
  wb: Warband;
  meter: ReturnType<typeof renownMeter>;
  onOpenUnit: (id: string) => void;
  onChip: (key: string) => void;
  onCardDown: (id: string) => void;
  onCardUp: () => void;
  onRecruit: () => void;
}

const keyframes = `
@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function isOut(u: Unit): boolean {
  return (u.status === 'lost' || u.status === 'dead') && u.inWarband !== false;
}

function initials(name: string): string {
  const alpha = name.replace(/[^a-zA-Z]/g, '');
  return alpha.substring(0, 2).toUpperCase();
}

export default function Roster({
  wb, meter, onOpenUnit, onChip, onCardDown, onCardUp, onRecruit,
}: RosterProps) {
  const sorted = sortUnits(wb.units);

  return (
    <div
      style={{
        padding: '13px 12px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <style>{keyframes}</style>

      {/* Renown Budget Meter */}
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

      {/* Unit Cards */}
      {sorted.map((unit) => {
        const out = isOut(unit);
        const reserve = unit.inWarband === false;
        const [scColor, scBorder, scBg] = statusColors(unit.status);
        const cost = unitCost(unit);

        return (
          <div
            key={unit.id}
            onClick={() => onOpenUnit(unit.id)}
            onPointerDown={() => onCardDown(unit.id)}
            onPointerUp={onCardUp}
            onPointerLeave={onCardUp}
            onPointerCancel={onCardUp}
            style={{
              position: 'relative',
              borderRadius: 7,
              padding: 11,
              paddingLeft: unit.leader ? 14 : 11,
              cursor: 'pointer',
              animation: 'cardIn .25s ease both',
              touchAction: 'pan-y',
              background: out
                ? 'linear-gradient(#2e3133 0%,#23272a 10%,#181b1d 100%)'
                : 'linear-gradient(#3a4042 0%,#2a2f31 10%,#1d2123 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), inset 0 -3px 6px rgba(0,0,0,.55)',
              filter: reserve ? 'grayscale(0.45)' : undefined,
              opacity: reserve ? 0.62 : undefined,
            }}
          >
            {/* Left accent bar */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 9,
                bottom: 9,
                width: 5,
                borderRadius: 4,
                background: unit.leader
                  ? 'repeating-linear-gradient(0deg,#cdae2e 0 6px,#16140d 6px 12px)'
                  : 'transparent',
              }}
            />

            <div style={{ display: 'flex', gap: 11 }}>
              {/* Portrait */}
              <div
                style={{
                  width: 58,
                  height: 58,
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
                      fontSize: 24,
                      color: '#3a4a42',
                      zIndex: 1,
                    }}
                  >
                    {initials(unit.name)}
                  </span>
                )}
                {/* Scanline overlay */}
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

              {/* Middle column */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Row 1: star + role + status + reserve */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {unit.leader && (
                    <span
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#d8b62e',
                      }}
                    >
                      &#9733;
                    </span>
                  )}
                  <span
                    onClick={(e) => { e.stopPropagation(); onChip(unit.role); }}
                    style={{
                      fontFamily: "'Chakra Petch', sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      borderBottom: '1px dotted',
                      cursor: 'pointer',
                      color: unit.leader ? '#d8b62e' : out ? '#8a8580' : '#7fb98f',
                    }}
                  >
                    {glossary[unit.role]?.t || unit.role}
                  </span>
                  {unit.status !== 'ok' && (
                    <span
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        color: scColor,
                        border: `1px solid ${scBorder}`,
                        background: scBg,
                        borderRadius: 4,
                        padding: '1px 6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {glossary[unit.status]?.t || unit.status}
                    </span>
                  )}
                  {reserve && (
                    <span
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        color: '#aab0b8',
                        border: '1px solid #3a4143',
                        background: '#14181a',
                        borderRadius: 4,
                        padding: '1px 6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      RESERVE
                    </span>
                  )}
                </div>

                {/* Row 2: name + veteran chip */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span
                    style={{
                      fontFamily: "'Chakra Petch', sans-serif",
                      fontWeight: 700,
                      fontSize: 23,
                      color: out ? '#c9bfb6' : '#eafff0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {unit.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Chakra Petch', sans-serif",
                      fontWeight: 700,
                      fontSize: 10,
                      color: '#d8b62e',
                      border: '1px solid #6e5a1e',
                      background: '#16130a',
                      borderRadius: 4,
                      padding: '1px 6px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {unit.trained ? '\u25C8 VETERAN' : '\u25C8 GREEN'}
                  </span>
                </div>

                {/* Row 3: skills/mods/weapons chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
                  {/* Skills */}
                  {unit.skills.map((sk) => (
                    <span
                      key={`sk-${sk}`}
                      onClick={(e) => { e.stopPropagation(); onChip(sk); }}
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: '#aebfff',
                        border: '1px solid #3a4a7a',
                        borderRadius: 4,
                        padding: '2px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      {glossary[sk]?.t || sk}
                    </span>
                  ))}
                  {/* Mods */}
                  {unit.mods.map((mod) => (
                    <span
                      key={`mod-${mod}`}
                      onClick={(e) => { e.stopPropagation(); onChip(mod); }}
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: '#aebfff',
                        border: '1px solid #3a4a7a',
                        borderRadius: 4,
                        padding: '2px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      {glossary[mod]?.t || mod}
                    </span>
                  ))}
                  {/* Leader mod */}
                  {unit.leaderMod && (
                    <span
                      onClick={(e) => { e.stopPropagation(); onChip(unit.leaderMod!); }}
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        color: '#aebfff',
                        border: '1px solid #3a4a7a',
                        borderRadius: 4,
                        padding: '2px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      {glossary[unit.leaderMod]?.t || unit.leaderMod}
                    </span>
                  )}
                  {/* Weapons */}
                  {unit.weapons.map((w, wi) => {
                    const isEpic = w.rarity === 'epic';
                    return (
                      <span
                        key={`w-${wi}-${w.name}`}
                        onClick={(e) => { e.stopPropagation(); onChip(w.name.toLowerCase().replace(/\s+/g, '_')); }}
                        style={{
                          fontFamily: "'Chakra Petch', sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: isEpic ? '#c89bff' : '#8effa8',
                          border: `1px solid ${isEpic ? '#7a4fc0' : '#2c6e3f'}`,
                          background: isEpic ? 'rgba(120,70,200,.12)' : undefined,
                          borderRadius: 4,
                          padding: '2px 8px',
                          cursor: 'pointer',
                        }}
                      >
                        {w.name}
                      </span>
                    );
                  })}
                  {/* Weapon mods */}
                  {unit.weapons.flatMap((w, wi) =>
                    (w.mods || []).map((wm) => (
                      <span
                        key={`wm-${wi}-${wm}`}
                        onClick={(e) => { e.stopPropagation(); onChip(wm); }}
                        style={{
                          fontFamily: "'Chakra Petch', sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#aebfff',
                          border: '1px solid #3a4a7a',
                          borderRadius: 4,
                          padding: '2px 8px',
                          cursor: 'pointer',
                        }}
                      >
                        {glossary[wm]?.t || wm}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* QL display */}
              <div
                style={{
                  flexShrink: 0,
                  width: 46,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: 38,
                    lineHeight: 1,
                    color: out ? '#9aa29a' : '#57ff82',
                  }}
                >
                  {unit.ql}
                </span>
                <span
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '.12em',
                    color: '#4fb568',
                  }}
                >
                  QL
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Recruit button */}
      <div
        onClick={onRecruit}
        style={{
          border: '1px dashed #2c6e3f',
          borderRadius: 7,
          padding: 14,
          textAlign: 'center',
          color: '#4fb568',
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          background: '#0c130d',
          cursor: 'pointer',
        }}
      >
        + RECRUIT UNIT
      </div>
    </div>
  );
}
