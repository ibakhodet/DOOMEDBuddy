import { useState } from 'react';
import type { Weapon } from '../data/types';

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

  const notation = `${type}${dice}x${damage}`;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

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

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 35,
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
          maxHeight: '90%',
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
            fontFamily: "'Chakra Petch', sans-serif",
            fontWeight: 700,
            fontSize: 23,
            color: '#8effa8',
            marginBottom: 16,
          }}
        >
          {isEdit ? 'Edit Weapon' : 'Add Weapon'}
        </div>

        {/* Name */}
        <label
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#6a786e',
            letterSpacing: '.08em',
            marginBottom: 5,
            display: 'block',
          }}
        >
          NAME
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acid Gun"
          style={{ ...inputStyle, marginBottom: 14 }}
        />

        {/* Type toggle */}
        <label
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#6a786e',
            letterSpacing: '.08em',
            marginBottom: 5,
            display: 'block',
          }}
        >
          TYPE
        </label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {(['M', 'R'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1,
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: type === t ? '#8effa8' : '#7a847e',
                background: type === t ? '#0c1f13' : '#0d1115',
                border: type === t ? '1px solid #2c6e3f' : '1px solid #2a3133',
                borderRadius: 6,
                padding: '9px 0',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {t === 'M' ? 'M (Melee)' : 'R (Ranged)'}
            </button>
          ))}
        </div>

        {/* Dice + Damage steppers row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          {/* Dice */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                color: '#6a786e',
                letterSpacing: '.08em',
                marginBottom: 5,
                display: 'block',
              }}
            >
              DICE
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setDice(clamp(dice - 1, 1, 6))}
                style={stepperBtnStyle}
              >
                &minus;
              </button>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#eafff0',
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                {dice}
              </span>
              <button
                onClick={() => setDice(clamp(dice + 1, 1, 6))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>

          {/* Damage */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 11,
                color: '#6a786e',
                letterSpacing: '.08em',
                marginBottom: 5,
                display: 'block',
              }}
            >
              DAMAGE
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setDamage(clamp(damage - 1, 1, 6))}
                style={stepperBtnStyle}
              >
                &minus;
              </button>
              <span
                style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#eafff0',
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                {damage}
              </span>
              <button
                onClick={() => setDamage(clamp(damage + 1, 1, 6))}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Notation preview */}
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 16,
            color: '#46ff77',
            background: '#041007',
            border: '1px solid #14361d',
            borderRadius: 6,
            padding: '8px 12px',
            textAlign: 'center',
            marginBottom: 14,
          }}
        >
          {notation}
        </div>

        {/* Rarity toggle */}
        <label
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#6a786e',
            letterSpacing: '.08em',
            marginBottom: 5,
            display: 'block',
          }}
        >
          RARITY
        </label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {(['standard', 'superior', 'epic'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRarity(r)}
              style={{
                flex: 1,
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: rarity === r ? '#8effa8' : '#7a847e',
                background: rarity === r ? '#0c1f13' : '#0d1115',
                border: rarity === r ? '1px solid #2c6e3f' : '1px solid #2a3133',
                borderRadius: 6,
                padding: '9px 0',
                cursor: 'pointer',
                textAlign: 'center',
                textTransform: 'capitalize',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Note */}
        <label
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#6a786e',
            letterSpacing: '.08em',
            marginBottom: 5,
            display: 'block',
          }}
        >
          NOTE
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Devourer reward &middot; 3pts"
          style={{ ...inputStyle, marginBottom: 14 }}
        />

        {/* Special Effect */}
        <label
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#6a786e',
            letterSpacing: '.08em',
            marginBottom: 5,
            display: 'block',
          }}
        >
          SPECIAL EFFECT
        </label>
        <textarea
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom weapon ability..."
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical',
            marginBottom: 18,
          }}
        />

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Save */}
          <button
            onClick={handleSave}
            style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#07140b',
              background: 'linear-gradient(#57ff82, #2fbf5a)',
              border: 'none',
              borderRadius: 8,
              padding: 13,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {isEdit ? 'SAVE CHANGES' : 'ADD WEAPON'}
          </button>

          {/* Delete (edit mode only) */}
          {isEdit && onDelete && (
            <button
              onClick={onDelete}
              style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: '#ff6a5a',
                border: '1px solid #7a2a22',
                borderRadius: 7,
                padding: 11,
                background: 'transparent',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
              }}
            >
              DELETE WEAPON
            </button>
          )}

          {/* Cancel */}
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
              textAlign: 'center',
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
