import type { Warband } from '../data/types';
import type { MoveGearState } from '../data/types';
import { sortUnits } from '../data/logic';
import { glossary } from '../data/glossary';

interface MoveGearSheetProps {
  wb: Warband;
  moveGear: MoveGearState;
  onClose: () => void;
  onMoveTo: (targetId: string) => void;
}

function initials(name: string): string {
  const alpha = name.replace(/[^a-zA-Z]/g, '');
  return alpha.substring(0, 2).toUpperCase();
}

export default function MoveGearSheet({ wb, moveGear, onClose, onMoveTo }: MoveGearSheetProps) {
  const srcUnit = wb.units.find(u => u.id === moveGear.owner);
  const weapon = srcUnit?.weapons[moveGear.widx];
  if (!srcUnit || !weapon) return null;

  const targets = sortUnits(wb.units).filter(u => u.id !== moveGear.owner && u.inWarband !== false);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 34,
        background: 'rgba(4,6,7,.7)',
        animation: 'fadeIn .15s ease',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '88%',
          overflowY: 'auto',
          background: 'linear-gradient(#1b1f21, #121517)',
          borderTop: '2px solid #9b6cff',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -10px 30px rgba(0,0,0,.6)',
          animation: 'sheetUp .24s cubic-bezier(.2,.8,.2,1)',
          padding: '16px 16px 26px',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: '#d2b6ff',
          }}
        >
          Move gear to...
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            color: '#9fb2a6',
            marginTop: 6,
          }}
        >
          Move{' '}
          <span style={{ fontWeight: 700, color: '#d2b6ff' }}>{weapon.name}</span>
          {' '}{weapon.notation} from{' '}
          <span style={{ fontWeight: 700, color: '#eafff0' }}>{srcUnit.name}</span>.
          {' '}Renown updates automatically.
        </div>

        {/* Target list */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginTop: 16,
          }}
        >
          {targets.map((unit) => (
            <div
              key={unit.id}
              onClick={() => onMoveTo(unit.id)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
                borderRadius: 8,
                padding: '10px 13px',
                cursor: 'pointer',
                background: '#0d1115',
                border: '1px solid #2a3133',
              }}
            >
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
                  {glossary[unit.role]?.t || unit.role} &middot; QL{unit.ql}
                </div>
              </div>

              {/* Arrow */}
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: 22,
                  color: '#9b6cff',
                  flexShrink: 0,
                }}
              >
                &rarr;
              </span>
            </div>
          ))}
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
