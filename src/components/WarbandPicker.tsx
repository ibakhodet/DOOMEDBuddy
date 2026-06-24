import { ALL_PLAYER_NAMES } from '../firebase';

const WARBAND_INFO: Record<string, { name: string; sub: string }> = {
  MARTIN: { name: 'THE CURSED', sub: 'Inheritor Courts' },
  SIGVE: { name: 'ASHEN WRIT', sub: 'Inheritor Courts' },
  TORD: { name: 'THE RUSTED ORDER', sub: 'Knights of the Motherboard' },
};

interface Props {
  onPick: (playerName: string) => void;
  onLogout: () => void;
}

export default function WarbandPicker({ onPick, onLogout }: Props) {
  return (
    <div style={{
      height: '100vh', maxWidth: 540, margin: '0 auto', display: 'flex', flexDirection: 'column',
      background: '#0b0d0e', fontFamily: "'Chakra Petch', sans-serif",
    }}>
      {/* Hazard stripe */}
      <div style={{ height: 7, background: 'repeating-linear-gradient(45deg, #cdae2e 0 11px, #16140d 11px 22px)', opacity: .85 }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 14, letterSpacing: '.14em',
          color: '#46ff77', marginBottom: 8,
        }}>
          &#9700; DOOMED // WB
        </div>
        <div style={{
          fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 22,
          color: '#d6e0da', marginBottom: 28,
        }}>
          Hvilket warband?
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
          {ALL_PLAYER_NAMES.map((name) => {
            const info = WARBAND_INFO[name];
            return (
              <div
                key={name}
                onClick={() => onPick(name)}
                style={{
                  background: 'linear-gradient(#3a4042 0%, #2a2f31 10%, #1d2123 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), inset 0 -3px 6px rgba(0,0,0,.55)',
                  borderRadius: 8, padding: '14px 16px', cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{
                      fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 20,
                      color: '#57ff82', lineHeight: 1.1,
                    }}>
                      {info.name}
                    </div>
                    <div style={{
                      fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 12,
                      color: '#5fbf77', marginTop: 2,
                    }}>
                      {info.sub}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: '.06em',
                    color: '#8a9a90', border: '1px solid #3a4143', borderRadius: 4, padding: '3px 8px',
                  }}>
                    {name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          onClick={onLogout}
          style={{
            marginTop: 24, fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600,
            fontSize: 13, color: '#6a786e', cursor: 'pointer',
          }}
        >
          Logg ut
        </div>
      </div>
    </div>
  );
}
