import { useState, useMemo } from 'react';
import type { Weapon } from '../data/types';
import { weaponCatalog, WeaponTemplate } from '../data/weapons';

interface AddWeaponSheetProps {
  onClose: () => void;
  onSave: (weapon: {
    name: string;
    notation: string;
    mods: string[];
    custom: string;
    rarity: 'standard' | 'superior' | 'epic';
    note: string;
  }) => void;
  weapon?: Weapon;
  onDelete?: () => void;
}

function parseNotation(notation: string): { type: 'M' | 'R'; dice: number; damage: number } {
  const m = notation.match(/^([MR])(\d+)x(\d+)$/i);
  if (m) {
    return {
      type: m[1].toUpperCase() as 'M' | 'R',
      dice: parseInt(m[2], 10),
      damage: parseInt(m[3], 10),
    };
  }
  return { type: 'M', dice: 1, damage: 1 };
}

// Deduplicate catalog by name (keep first occurrence)
const uniqueCatalog: WeaponTemplate[] = [];
const seenNames = new Set<string>();
for (const w of weaponCatalog) {
  const key = w.name.toLowerCase();
  if (!seenNames.has(key)) {
    seenNames.add(key);
    uniqueCatalog.push(w);
  }
}

export default function AddWeaponSheet({ onClose, onSave, weapon, onDelete }: AddWeaponSheetProps) {
  const isEdit = !!weapon;
  const parsed = weapon ? parseNotation(weapon.notation) : null;

  const [name, setName] = useState(weapon?.name || '');
  const [type, setType] = useState<'M' | 'R'>(parsed?.type || 'M');
  const [dice, setDice] = useState(parsed?.dice || 1);
  const [damage, setDamage] = useState(parsed?.damage || 1);
  const [rarity, setRarity] = useState<'standard' | 'superior' | 'epic'>(weapon?.rarity || 'standard');
  const [note, setNote] = useState(weapon?.note || '');
  const [custom, setCustom] = useState(weapon?.custom || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const notation = `${type}${dice}x${damage}`;
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  // Filter suggestions based on name input
  const suggestions = useMemo(() => {
    if (!name.trim() || isEdit) return [];
    const q = name.toLowerCase();
    return uniqueCatalog
      .filter(w => w.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [name, isEdit]);

  const applySuggestion = (tpl: WeaponTemplate) => {
    setName(tpl.name);
    if (tpl.notation) {
      const p = parseNotation(tpl.notation);
      setType(p.type);
      setDice(p.dice);
      setDamage(p.damage);
    }
    setRarity(tpl.rarity);
    setNote(tpl.source + ' \u00b7 ' + tpl.cost + 'pt' + (tpl.cost !== 1 ? 's' : ''));
    setCustom(tpl.custom || '');
    if (tpl.mods.length) {
      // Put mods in the note for visibility
      setNote(tpl.source + ' \u00b7 ' + tpl.cost + 'pt' + (tpl.cost !== 1 ? 's' : '') + ' \u00b7 ' + tpl.mods.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', '));
    }
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      notation,
      mods: [],
      custom: custom.trim(),
      rarity,
      note: note.trim(),
    });
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Chakra Petch', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    color: '#8effa8',
    background: '#041007',
    border: '1px solid #14361d',
    borderRadius: 6,
    padding: '10px 12px',
    width: '100%',
    outline: 'none',
  };

  const stepperBtnStyle: React.CSSProperties = {
    fontFamily: "'Chakra Petch', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: '#8a9a90',
    background: 'transparent',
    border: '1px solid #2a3133',
    borderRadius: 6,
    width: 34,
    height: 34,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11,
    color: '#6a786e',
    letterSpacing: '.08em',
    marginBottom: 5,
    display: 'block',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 35,
        background: 'rgba(4,6,7,.6)', animation: 'fadeIn .15s ease',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxHeight: '90%', overflowY: 'auto',
          background: 'linear-gradient(#1b1f21, #121517)',
          borderTop: '2px solid #46ff77', borderRadius: '16px 16px 0 0',
          boxShadow: '0 -10px 30px rgba(0,0,0,.6)',
          animation: 'sheetUp .24s cubic-bezier(.2,.8,.2,1)',
          padding: '16px 16px 26px',
        }}
      >
        <div style={{ width: 44, height: 4, borderRadius: 3, background: '#3a4143', margin: '0 auto 14px' }} />

        <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 23, color: '#8effa8', marginBottom: 16 }}>
          {isEdit ? 'Edit Weapon' : 'Add Weapon'}
        </div>

        {/* Name with autocomplete */}
        <label style={labelStyle}>NAME</label>
        <div style={{ position: 'relative', marginBottom: showSuggestions && suggestions.length ? 0 : 14 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Start typing... e.g. Acid"
            style={inputStyle}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              background: '#0d1115', border: '1px solid #2c6e3f', borderTop: 'none',
              borderRadius: '0 0 6px 6px', overflow: 'hidden', marginBottom: 14,
            }}>
              {suggestions.map((s) => {
                const modsStr = s.mods.length ? ' ' + s.mods.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ') : '';
                const rarityColor = s.rarity === 'epic' ? '#c89bff' : s.rarity === 'superior' ? '#8effa8' : '#d6e0da';
                return (
                  <div
                    key={s.name + s.source}
                    onClick={() => applySuggestion(s)}
                    style={{
                      padding: '9px 12px', cursor: 'pointer',
                      borderBottom: '1px solid #1a2122',
                      display: 'flex', alignItems: 'baseline', gap: 8,
                    }}
                  >
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 14, color: rarityColor }}>
                      {s.name}
                    </span>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#46ff77' }}>
                      {s.notation}
                    </span>
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 11, color: '#d8b62e' }}>
                      {s.cost}pt{s.cost !== 1 ? 's' : ''}{modsStr}
                    </span>
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 10, color: '#6a786e', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                      {s.source}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Type toggle */}
        <label style={labelStyle}>TYPE</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {(['M', 'R'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1, fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 14,
                color: type === t ? '#8effa8' : '#7a847e',
                background: type === t ? '#0c1f13' : '#0d1115',
                border: type === t ? '1px solid #2c6e3f' : '1px solid #2a3133',
                borderRadius: 6, padding: '9px 0', cursor: 'pointer', textAlign: 'center',
              }}
            >
              {t === 'M' ? 'M (Melee)' : 'R (Ranged)'}
            </button>
          ))}
        </div>

        {/* Dice + Damage */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>DICE</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setDice(clamp(dice - 1, 1, 6))} style={stepperBtnStyle}>&minus;</button>
              <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 22, color: '#eafff0', minWidth: 24, textAlign: 'center' }}>{dice}</span>
              <button onClick={() => setDice(clamp(dice + 1, 1, 6))} style={stepperBtnStyle}>+</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>DAMAGE</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setDamage(clamp(damage - 1, 1, 6))} style={stepperBtnStyle}>&minus;</button>
              <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 22, color: '#eafff0', minWidth: 24, textAlign: 'center' }}>{damage}</span>
              <button onClick={() => setDamage(clamp(damage + 1, 1, 6))} style={stepperBtnStyle}>+</button>
            </div>
          </div>
        </div>

        {/* Notation preview */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#46ff77',
          background: '#041007', border: '1px solid #14361d', borderRadius: 6,
          padding: '8px 12px', textAlign: 'center', marginBottom: 14,
        }}>
          {notation}
        </div>

        {/* Rarity */}
        <label style={labelStyle}>RARITY</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {(['standard', 'superior', 'epic'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRarity(r)}
              style={{
                flex: 1, fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 12,
                color: rarity === r ? (r === 'epic' ? '#c89bff' : '#8effa8') : '#7a847e',
                background: rarity === r ? (r === 'epic' ? '#1a1426' : '#0c1f13') : '#0d1115',
                border: rarity === r ? (r === 'epic' ? '1px solid #7a4fc0' : '1px solid #2c6e3f') : '1px solid #2a3133',
                borderRadius: 6, padding: '9px 0', cursor: 'pointer', textAlign: 'center', textTransform: 'capitalize',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Note */}
        <label style={labelStyle}>NOTE</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Devourer reward &middot; 3pts" style={{ ...inputStyle, marginBottom: 14 }} />

        {/* Special Effect */}
        <label style={labelStyle}>SPECIAL EFFECT</label>
        <textarea value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom weapon ability..." rows={3} style={{ ...inputStyle, resize: 'vertical', marginBottom: 18 }} />

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleSave} style={{
            fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 16,
            color: '#07140b', background: 'linear-gradient(#57ff82, #2fbf5a)',
            border: 'none', borderRadius: 8, padding: 13, cursor: 'pointer', width: '100%', textAlign: 'center',
          }}>
            {isEdit ? 'SAVE CHANGES' : 'ADD WEAPON'}
          </button>

          {isEdit && onDelete && (
            <button onClick={onDelete} style={{
              fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 15,
              color: '#ff6a5a', border: '1px solid #7a2a22', borderRadius: 7, padding: 11,
              background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'center',
            }}>
              DELETE WEAPON
            </button>
          )}

          <button onClick={onClose} style={{
            fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: 15,
            color: '#8a9a90', border: '1px solid #3a4143', borderRadius: 7, padding: 11,
            background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'center',
          }}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
