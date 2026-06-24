import type { Warband } from '../data/types';
import { recruitOptions, committed } from '../data/logic';
import { glossary } from '../data/glossary';

interface RecruitSheetProps {
  wb: Warband;
  meter: any;
  onClose: () => void;
  onAdd: (role: string) => void;
}

export default function RecruitSheet({ wb, meter, onClose, onAdd }: RecruitSheetProps) {
  const options = recruitOptions(wb.faction);
  const free = wb.renown - committed(wb);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        background: 'rgba(4,6,7,.6)',
        animation: 'fadeIn .15s ease',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '86%',
          overflowY: 'auto',
          background: 'linear-gradient(#1b1f21, #121517)',
          borderTop: '2px solid #46ff77',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -10px 30px rgba(0,0,0,.6)',
          animation: 'sheetUp .24s cubic-bezier(.2,.8,.2,1)',
          padding: '16px 16px 26px',
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

        {/* Title */}
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
              fontSize: 23,
              color: '#8effa8',
            }}
          >
            Recruit a Follower
          </span>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12,
              color: '#4fb568',
            }}
          >
            {free} free pts
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: '#8a9a90',
            marginTop: 6,
            marginBottom: 14,
          }}
        >
          Each follower costs Renown to recruit and maintain.
        </div>

        {/* Recruit options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map((opt) => {
            const canAfford = free >= opt.cost;
            const traits = [
              ...opt.skills.map((s) => glossary[s]?.t || s),
              ...opt.mods.map((m) => glossary[m]?.t || m),
              ...(opt.weapon ? [opt.weapon[0]] : []),
            ];

            return (
              <div
                key={opt.role}
                onClick={() => canAfford && onAdd(opt.role)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  background: canAfford ? '#0c1610' : '#120e0e',
                  borderRadius: 8,
                  padding: '11px 13px',
                  cursor: canAfford ? 'pointer' : 'default',
                  opacity: canAfford ? 1 : 0.6,
                  border: '1px solid #1a2122',
                }}
              >
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Chakra Petch', sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: '#eafff0',
                      textTransform: 'capitalize',
                    }}
                  >
                    {glossary[opt.role]?.t || opt.role}
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
                    QL{opt.ql}
                  </div>
                  {traits.length > 0 && (
                    <div
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 500,
                        fontSize: 13,
                        color: '#9fb2a6',
                        marginTop: 2,
                      }}
                    >
                      {traits.join(', ')}
                    </div>
                  )}
                </div>

                {/* Cost */}
                <span
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: canAfford ? '#8effa8' : '#ff8a7a',
                    flexShrink: 0,
                  }}
                >
                  {opt.cost}
                </span>

                {/* + icon */}
                <span
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: canAfford ? '#4fb568' : '#5a3a36',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </div>
            );
          })}
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
