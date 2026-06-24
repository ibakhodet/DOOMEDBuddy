import { glossary } from '../data/glossary';
import { codexCategories } from '../data/logic';

interface CodexProps {
  query: string;
  onSearch: (q: string) => void;
  onChip: (key: string) => void;
}

const GROUP_ORDER = [
  'Leader Mods',
  'Unit Types',
  'Unit Mods',
  'Skills',
  'Weapon Mods',
  'Gear',
  'Rewards & Upgrades',
  'Casualties & Status',
];

export default function Codex({ query, onSearch, onChip }: CodexProps) {
  const lowerQuery = query.toLowerCase();

  const groups: { label: string; items: { key: string; title: string }[] }[] =
    [];

  for (const [label, keys] of codexCategories) {
    const filtered = (keys as readonly string[])
      .filter((key) => {
        const entry = glossary[key];
        if (!entry) return false;
        if (!lowerQuery) return true;
        return (
          entry.t.toLowerCase().includes(lowerQuery) ||
          entry.b.toLowerCase().includes(lowerQuery)
        );
      })
      .map((key) => ({ key, title: glossary[key].t }))
      .sort((a, b) => a.title.localeCompare(b.title));

    if (filtered.length > 0) {
      groups.push({ label: label as string, items: filtered });
    }
  }

  groups.sort(
    (a, b) => GROUP_ORDER.indexOf(a.label) - GROUP_ORDER.indexOf(b.label),
  );

  return (
    <div style={{ padding: '13px 12px 22px' }}>
      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search keywords..."
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: '#041007',
          border: '1px solid #14361d',
          borderRadius: 6,
          padding: '11px 13px',
          color: '#8effa8',
          fontFamily: "'Chakra Petch', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          outline: 'none',
        }}
      />

      {/* Groups */}
      <div
        style={{
          marginTop: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {groups.map((group) => (
          <div key={group.label}>
            {/* Group label */}
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                letterSpacing: '.14em',
                color: '#d8b62e',
                marginBottom: 8,
              }}
            >
              {group.label.toUpperCase()}
            </div>

            {/* Chips */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 7,
              }}
            >
              {group.items.map((item) => (
                <span
                  key={item.key}
                  onClick={() => onChip(item.key)}
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: '#aebfff',
                    border: '1px solid #3a4a7a',
                    borderRadius: 5,
                    padding: '4px 11px',
                    cursor: 'pointer',
                  }}
                >
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
