import type { TabView } from '../data/types';

interface BottomNavProps {
  active: TabView;
  onNav: (v: TabView) => void;
}

const tabs: { id: TabView; icon: string; label: string }[] = [
  { id: 'combat', icon: '\u2694', label: 'COMBAT' },
  { id: 'roster', icon: '\u25A4', label: 'ROSTER' },
  { id: 'campaign', icon: '\u2657', label: 'CAMPAIGN' },
  { id: 'codex', icon: '\u2761', label: 'CODEX' },
];

export default function BottomNav({ active, onNav }: BottomNavProps) {
  return (
    <nav
      style={{
        flexShrink: 0,
        flexGrow: 0,
        padding: '9px 11px 15px',
        background: 'linear-gradient(#23282a, #14181a)',
        boxShadow: '0 -3px 8px rgba(0,0,0,.5)',
        display: 'flex',
        gap: 8,
        zIndex: 6,
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNav(tab.id)}
            style={{
              flex: 1,
              textAlign: 'center',
              borderRadius: 5,
              padding: '8px 0',
              cursor: 'pointer',
              background: isActive ? '#07140b' : '#0a0d0e',
              border: isActive
                ? '1px solid #2c6e3f'
                : '1px solid #2a3133',
              color: isActive ? '#57ff82' : '#4a5a50',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 17 }}>{tab.icon}</span>
            <span
              style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                marginTop: 2,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
