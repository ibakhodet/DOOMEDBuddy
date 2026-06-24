import type { Warband } from '../data/types';
import { sortUnits, statusColors } from '../data/logic';
import { glossary } from '../data/glossary';

interface CampaignProps {
  wb: Warband;
  onChip: (key: string) => void;
  onOpenAfter: () => void;
}

export default function Campaign({ wb, onChip, onOpenAfter }: CampaignProps) {
  const sorted = sortUnits(wb.units);

  return (
    <div style={{ padding: '13px 12px 22px' }}>
      {/* Header */}
      <div
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 12,
          letterSpacing: '.12em',
          color: '#4fb568',
          marginBottom: 11,
        }}
      >
        &#9654; CAMPAIGN LOG &mdash; {wb.name}
      </div>

      {/* Unit cards */}
      {sorted.map((unit) => {
        const out = unit.status === 'lost' || unit.status === 'dead';
        const [chipColor, chipBorder, chipBg] = statusColors(unit.status);

        return (
          <div
            key={unit.id}
            style={{
              borderRadius: 7,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08)',
              padding: '11px 13px',
              marginBottom: 8,
              background: out
                ? 'linear-gradient(135deg, #1a1210 0%, #12100e 100%)'
                : 'linear-gradient(135deg, #141a16 0%, #0e1412 100%)',
              opacity: out ? 0.62 : 1,
            }}
          >
            {/* Name row + status chip */}
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
                  fontSize: 19,
                  color: out ? '#c9bfb6' : '#eafff0',
                }}
              >
                {unit.name}
              </span>

              {unit.status !== 'ok' && (
                <span
                  onClick={() => onChip(unit.status)}
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    color: chipColor,
                    border: `1px solid ${chipBorder}`,
                    background: chipBg,
                    borderRadius: 4,
                    padding: '2px 8px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {unit.status}
                </span>
              )}
            </div>

            {/* Veteran chip */}
            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#d8b62e',
                  border: '1px solid #6e5a1e',
                  background: '#16130a',
                  borderRadius: 3,
                  padding: '1px 7px',
                }}
              >
                {unit.trained ? '\u25C8 VETERAN' : '\u25C8 GREEN'}
              </span>
            </div>

            {/* Log lines */}
            {unit.log && unit.log.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {unit.log.map((entry, i) => {
                  const kindColor =
                    entry.kind === 'epic'
                      ? '#c89bff'
                      : entry.kind === 'bad'
                        ? '#ff9a8a'
                        : '#8effa8';

                  return (
                    <div
                      key={i}
                      style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontWeight: 500,
                        fontSize: 13,
                        color: kindColor,
                        marginTop: i > 0 ? 3 : 0,
                      }}
                    >
                      {entry.text}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* After-action button */}
      <div
        onClick={onOpenAfter}
        style={{
          marginTop: 14,
          border: '1px solid #2c6e3f',
          borderRadius: 8,
          padding: '13px 14px',
          background: 'linear-gradient(#11331d, #0c2014)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#aeffc7',
            }}
          >
            &#9879; Record an after-action
          </div>
          <div
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: '#8fbfa0',
              marginTop: 2,
            }}
          >
            Mark casualties for deployed units, log the result &amp; award
            Renown.
          </div>
        </div>

        <span
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: 22,
            color: '#57ff82',
          }}
        >
          &#8250;
        </span>
      </div>
    </div>
  );
}
