import { useState } from 'react';
import type { Warband } from '../data/types';

interface HeaderProps {
  wb: Warband;
  playerName: string;
  onLogout?: () => void;
  onSetRenown?: (value: number) => void;
  onSwitchWarband?: () => void;
}

export default function Header({ wb, playerName, onLogout, onSetRenown, onSwitchWarband }: HeaderProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(wb.renown));

  const startEdit = () => {
    if (!onSetRenown) return;
    setDraft(String(wb.renown));
    setEditing(true);
  };

  const commitEdit = () => {
    const val = parseInt(draft, 10);
    if (!isNaN(val) && val >= 0 && onSetRenown) {
      onSetRenown(val);
    }
    setEditing(false);
  };

  return (
    <header
      style={{
        flexShrink: 0,
        flexGrow: 0,
        background: 'linear-gradient(#3a4042 0%, #2a2f31 7%, #1d2123 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,.10), inset 0 -3px 6px rgba(0,0,0,.55), 0 3px 6px rgba(0,0,0,.4)',
        zIndex: 6,
      }}
    >
      {/* hazard stripe */}
      <div
        style={{
          height: 7,
          background:
            'repeating-linear-gradient(45deg, #cdae2e 0 11px, #16140d 11px 22px)',
          opacity: 0.85,
        }}
      />

      {/* top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 13px 6px',
        }}
      >
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            letterSpacing: '.18em',
            color: '#46ff77',
          }}
        >
          &#9700; DOOMED // WB
        </span>

        <span
          onClick={onSwitchWarband || onLogout}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            color: '#9aa8a0',
            border: '1px solid #3a4143',
            borderRadius: 4,
            padding: '3px 9px',
            cursor: (onSwitchWarband || onLogout) ? 'pointer' : 'default',
          }}
        >
          {onSwitchWarband ? '\u21C4 ' : ''}{playerName}
        </span>
      </div>

      {/* green readout panel */}
      <div
        style={{
          margin: '0 10px 10px',
          background: '#041007',
          border: '1px solid #14361d',
          borderRadius: 4,
          boxShadow: 'inset 0 0 16px rgba(0,0,0,.7)',
          padding: '10px 13px',
        }}
      >
        <div
          style={{
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: '#57ff82',
            letterSpacing: '.02em',
          }}
        >
          {wb.name}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            marginTop: 4,
          }}
        >
          {/* subtitle */}
          <span
            style={{
              flex: 1,
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: '#5fbf77',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {wb.sub}
          </span>

          {/* stats */}
          <div style={{ display: 'flex', gap: 16, marginLeft: 12 }}>
            {/* RENOWN - tappable to edit */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 10,
                letterSpacing: '.08em', color: '#3f9e58',
              }}>RENOWN</div>
              {editing ? (
                <input
                  autoFocus
                  type="number"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); }}
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 14,
                    color: '#57ff82', background: '#041007', border: '1px solid #2c6e3f',
                    borderRadius: 3, width: 40, textAlign: 'center', outline: 'none', padding: 0,
                  }}
                />
              ) : (
                <div
                  onClick={startEdit}
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 14,
                    color: '#57ff82', cursor: onSetRenown ? 'pointer' : 'default',
                    borderBottom: onSetRenown ? '1px dashed #2c6e3f' : 'none',
                  }}
                >
                  {wb.renown}
                </div>
              )}
            </div>

            {/* UNITS */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 10,
                letterSpacing: '.08em', color: '#3f9e58',
              }}>UNITS</div>
              <div style={{
                fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 14, color: '#57ff82',
              }}>{wb.units.length}</div>
            </div>

            {/* WON */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 10,
                letterSpacing: '.08em', color: '#3f9e58',
              }}>WON</div>
              <div style={{
                fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 14, color: '#57ff82',
              }}>{wb.won}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
