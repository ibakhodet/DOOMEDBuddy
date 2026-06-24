import { useState } from 'react';
import type { Unit, UnitStatus, Warband } from '../data/types';
import { statusColors, unitCost, weaponCost, decode, sortUnits } from '../data/logic';
import type { renownMeter } from '../data/logic';
import { glossary } from '../data/glossary';

interface UnitCombatCardProps {
  unit: Unit;
  wb: Warband;
  meter: ReturnType<typeof renownMeter>;
  navIndex: number;
  navCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  swipeAnim: 'l' | 'r' | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onChip: (key: string) => void;
  onSetStatus: (status: UnitStatus) => void;
  onToggleWarband: () => void;
  onSwipeStart: (x: number, y: number) => void;
  onSwipeEnd: (x: number, y: number) => void;
  onWeaponDown: (owner: string, widx: number) => void;
  onWeaponUp: () => void;
  onMoveWeapon: (owner: string, widx: number) => void;
  onUpgradeQL: () => void;
  onAddWeapon: () => void;
  onEditWeapon: (widx: number) => void;
  onChangePortrait: () => void;
  onDeletePortrait: () => void;
}

const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(18px) scale(.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes swipeL {
  0% { opacity: 0; transform: translateX(60px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes swipeR {
  0% { opacity: 0; transform: translateX(-60px); }
  100% { opacity: 1; transform: translateX(0); }
}
`;

const FONT = "'Chakra Petch', sans-serif";
const MONO = "'Share Tech Mono', monospace";

function initials(name: string): string {
  const alpha = name.replace(/[^a-zA-Z]/g, '');
  return alpha.substring(0, 2).toUpperCase();
}

const allStatuses: UnitStatus[] = ['ok', 'wounded', 'lost', 'mia', 'injured', 'scarred', 'dead'];

export default function UnitCombatCard({
  unit, wb, meter,
  navIndex, navCount, hasPrev, hasNext,
  swipeAnim,
  onClose, onPrev, onNext,
  onChip, onSetStatus, onToggleWarband,
  onSwipeStart, onSwipeEnd,
  onWeaponDown, onWeaponUp, onMoveWeapon,
  onUpgradeQL,
  onAddWeapon, onEditWeapon,
  onChangePortrait, onDeletePortrait,
}: UnitCombatCardProps) {
  const [showPortraitMenu, setShowPortraitMenu] = useState(false);
  const out = (unit.status === 'lost' || unit.status === 'dead') && unit.inWarband !== false;
  const [scColor, scBorder, scBg] = statusColors(unit.status);
  const cost = unitCost(unit);
  const sorted = sortUnits(wb.units);
  const benched = unit.inWarband === false;

  const cardGradient = out
    ? 'linear-gradient(#2e3133 0%,#23272a 10%,#181b1d 100%)'
    : 'linear-gradient(#3a4042 0%,#2a2f31 10%,#1d2123 100%)';

  const cardAnimation = swipeAnim === 'l'
    ? 'swipeL .26s cubic-bezier(.2,.8,.2,1)'
    : swipeAnim === 'r'
      ? 'swipeR .26s cubic-bezier(.2,.8,.2,1)'
      : 'cardIn .2s ease';

  // QL upgrade logic
  const qlNum = parseInt(unit.ql, 10);
  const canShowUpgrade = unit.trained && qlNum > 4;
  const canAffordUpgrade = meter.committed + 1 <= meter.cap;

  // Nav button style
  const navBtn = (enabled: boolean): React.CSSProperties => ({
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: 22,
    width: 40,
    height: 34,
    border: '1px solid #3a4143',
    borderRadius: 6,
    background: 'transparent',
    color: enabled ? '#9aa8a0' : '#39413e',
    cursor: enabled ? 'pointer' : 'default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
  });

  // Section header
  const sectionHeader = (label: string) => (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: '.14em',
        color: '#d8b62e',
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        background: 'rgba(4,6,7,.9)',
        animation: 'fadeIn .18s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{keyframes}</style>

      {/* ===== HEADER BAR ===== */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 'none',
          padding: '13px 14px',
          background: 'linear-gradient(#2a2f31, #1d2123)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Prev button */}
        <button
          onClick={hasPrev ? onPrev : undefined}
          style={navBtn(hasPrev)}
        >
          &#8249;
        </button>

        {/* Center labels */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: '#46ff77',
            }}
          >
            &#9700; COMBAT CARD
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 11,
              color: '#6a786e',
            }}
          >
            {navIndex + 1} / {navCount} &middot; swipe to flip
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={hasNext ? onNext : undefined}
          style={navBtn(hasNext)}
        >
          &#8250;
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            ...navBtn(true),
            color: '#9aa8a0',
          }}
        >
          &#10005;
        </button>
      </div>

      {/* ===== BODY ===== */}
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => onSwipeStart(e.clientX, e.clientY)}
        onPointerUp={(e) => onSwipeEnd(e.clientX, e.clientY)}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 14,
          touchAction: 'pan-y',
        }}
      >
        {/* ===== CARD ===== */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            borderRadius: 10,
            background: cardGradient,
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,.08), inset 0 -3px 10px rgba(0,0,0,.6)',
            padding: 18,
            animation: cardAnimation,
          }}
        >
          {/* ===== 1. IDENTITY ROW ===== */}
          <div style={{ display: 'flex', gap: 15 }}>
            {/* Portrait (tappable) */}
            <div
              onClick={(e) => { e.stopPropagation(); setShowPortraitMenu(true); }}
              style={{
                width: 104,
                height: 104,
                borderRadius: 5,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                background: '#14181a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
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
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 44,
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
              {/* Camera icon hint */}
              <div style={{
                position: 'absolute', bottom: 4, right: 4, width: 22, height: 22,
                borderRadius: 4, background: 'rgba(0,0,0,.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#8effa8', pointerEvents: 'none',
              }}>&#9998;</div>
            </div>

            {/* Portrait menu popup */}
            {showPortraitMenu && (
              <div
                onClick={() => setShowPortraitMenu(false)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 40,
                  background: 'rgba(4,6,7,.5)', animation: 'fadeIn .12s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div onClick={(e) => e.stopPropagation()} style={{
                  background: 'linear-gradient(#1b1f21, #121517)',
                  border: '1px solid #2c6e3f', borderRadius: 14, padding: 16,
                  boxShadow: '0 12px 40px rgba(0,0,0,.7)', animation: 'cardIn .2s ease',
                  width: '80%', maxWidth: 280,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#8effa8', marginBottom: 4 }}>
                    Portrait
                  </div>
                  <div
                    onClick={() => { setShowPortraitMenu(false); onChangePortrait(); }}
                    style={{
                      fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#d6e0da',
                      background: '#0c1f13', border: '1px solid #2c6e3f', borderRadius: 7,
                      padding: '11px 14px', cursor: 'pointer', textAlign: 'center',
                    }}
                  >
                    {unit.img ? 'Endre bilde' : 'Last opp bilde'}
                  </div>
                  {unit.img && (
                    <div
                      onClick={() => { setShowPortraitMenu(false); onDeletePortrait(); }}
                      style={{
                        fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#ff6a5a',
                        background: '#1c0c0a', border: '1px solid #7a2a22', borderRadius: 7,
                        padding: '11px 14px', cursor: 'pointer', textAlign: 'center',
                      }}
                    >
                      Slett bilde
                    </div>
                  )}
                  <div
                    onClick={() => setShowPortraitMenu(false)}
                    style={{
                      fontFamily: FONT, fontWeight: 700, fontSize: 13, color: '#8a9a90',
                      border: '1px solid #3a4143', borderRadius: 7,
                      padding: '9px 14px', cursor: 'pointer', textAlign: 'center',
                    }}
                  >
                    Avbryt
                  </div>
                </div>
              </div>
            )}

            {/* Middle: labels, name, chips */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Leader label */}
              {unit.leader && (
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 12,
                    color: '#d8b62e',
                  }}
                >
                  &#9733; LEADER
                </span>
              )}

              {/* Role - tappable */}
              <span
                onClick={(e) => { e.stopPropagation(); onChip(unit.role); }}
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  borderBottom: '1px dotted',
                  cursor: 'pointer',
                  color: unit.leader ? '#d8b62e' : out ? '#8a8580' : '#7fb98f',
                  alignSelf: 'flex-start',
                }}
              >
                {glossary[unit.role]?.t || unit.role}
              </span>

              {/* Name */}
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 34,
                  lineHeight: 1.05,
                  color: out ? '#c9bfb6' : '#eafff0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {unit.name}
              </span>

              {/* Status + veteran chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                {unit.status !== 'ok' && (
                  <span
                    style={{
                      fontFamily: FONT,
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
                <span
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 10,
                    color: '#d8b62e',
                    border: '1px solid #6e5a1e',
                    background: '#16130a',
                    borderRadius: 4,
                    padding: '1px 6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {unit.trained ? '\u25C8 VETERAN' : '\u25C8 GREEN'}
                </span>
              </div>
            </div>

            {/* Right: QL big display */}
            <div
              style={{
                flexShrink: 0,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 64,
                  lineHeight: 1,
                  color: out ? '#9aa29a' : '#57ff82',
                }}
              >
                {unit.ql}
              </span>
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '.14em',
                  color: '#4fb568',
                }}
              >
                QUALITY
              </span>
            </div>
          </div>

          {/* ===== 2. TOGGLE + COST ROW ===== */}
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            {/* Toggle button */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWarband(); }}
              style={{
                flex: 1,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 13,
                border: `1px solid ${benched ? '#3a4143' : '#2c6e3f'}`,
                borderRadius: 6,
                background: benched ? '#14181a' : '#0c1f13',
                color: benched ? '#9aa8a0' : '#8effa8',
                padding: '10px 12px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {benched
                ? '\u2717 RESERVE \u2014 TAP TO ADD'
                : '\u2713 IN SCENARIO \u2014 TAP TO BENCH'}
            </button>

            {/* Cost box */}
            <div
              style={{
                minWidth: 80,
                background: '#0d1115',
                border: '1px solid #1f2a2c',
                borderRadius: 6,
                padding: '6px 12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#8effa8',
                  lineHeight: 1,
                }}
              >
                {cost}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: '.1em',
                  color: '#4fb568',
                }}
              >
                RENOWN COST
              </span>
            </div>
          </div>

          {/* Renown meter */}
          <div
            style={{
              marginTop: 10,
              background: meter.boxBg,
              border: `1px solid ${meter.boxBorder}`,
              borderRadius: 7,
              padding: '10px 12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: '.12em',
                  color: meter.labelColor,
                }}
              >
                WARBAND RENOWN
              </span>
              <span
                style={{
                  fontFamily: FONT,
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

          {/* ===== 3. QL UPGRADE ===== */}
          {canShowUpgrade && (
            <div style={{ marginTop: 12 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canAffordUpgrade) onUpgradeQL();
                }}
                style={{
                  width: '100%',
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 13,
                  border: `1px solid ${canAffordUpgrade ? '#2c6e3f' : '#2a3133'}`,
                  borderRadius: 6,
                  background: canAffordUpgrade ? '#0c1f13' : '#14181a',
                  color: canAffordUpgrade ? '#8effa8' : '#6a786e',
                  padding: '10px 14px',
                  cursor: canAffordUpgrade ? 'pointer' : 'default',
                  textAlign: 'center',
                }}
              >
                &#11014; UPGRADE QL ({unit.ql} &#8594; {qlNum - 1}+) &#8212; 1 RENOWN
              </button>
            </div>
          )}

          {/* ===== 4. LOADOUT ===== */}
          <div style={{ marginTop: 18 }}>
            {sectionHeader('\u25B8 LOADOUT')}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {unit.weapons.map((w, widx) => {
                const isEpic = w.rarity === 'epic';
                const pts = weaponCost(w);

                return (
                  <div
                    key={`w-${widx}-${w.name}`}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onWeaponDown(unit.id, widx);
                    }}
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      onWeaponUp();
                    }}
                    onPointerLeave={onWeaponUp}
                    onPointerCancel={onWeaponUp}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      borderRadius: 6,
                      padding: '11px 13px',
                      background: isEpic ? 'rgba(120,70,200,.10)' : '#0c1610',
                      border: `1px solid ${isEpic ? '#7a4fc0' : '#2c6e3f'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {/* Left: weapon name + tags */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onChip(w.name.toLowerCase().replace(/\s+/g, '_'));
                          }}
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: 18,
                            color: isEpic ? '#c89bff' : '#8effa8',
                            cursor: 'pointer',
                          }}
                        >
                          {w.name}
                        </span>
                        {/* Edit button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditWeapon(widx);
                          }}
                          style={{
                            fontFamily: FONT,
                            fontWeight: 600,
                            fontSize: 11,
                            color: '#6a786e',
                            background: 'transparent',
                            border: '1px solid #3a4143',
                            borderRadius: 3,
                            cursor: 'pointer',
                            padding: '2px 7px',
                            flexShrink: 0,
                          }}
                        >
                          Edit
                        </button>
                        {/* Move button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveWeapon(unit.id, widx);
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          style={{
                            fontFamily: FONT,
                            fontWeight: 600,
                            fontSize: 11,
                            color: '#9b6cff',
                            background: 'transparent',
                            border: '1px solid #5a3a8a',
                            borderRadius: 3,
                            cursor: 'pointer',
                            padding: '2px 7px',
                            flexShrink: 0,
                          }}
                        >
                          Move
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 3 }}>
                        {/* Weapon mods as tappable chips */}
                        {(w.mods || []).map((wm) => (
                          <span
                            key={`wm-${widx}-${wm}`}
                            onClick={(e) => { e.stopPropagation(); onChip(wm); }}
                            style={{
                              fontFamily: FONT,
                              fontWeight: 600,
                              fontSize: 12,
                              color: isEpic ? '#b78cff' : '#5a8a68',
                              cursor: 'pointer',
                              borderBottom: '1px dotted',
                            }}
                          >
                            {glossary[wm]?.t || wm}
                          </span>
                        ))}
                        {w.note && (
                          <span
                            style={{
                              fontFamily: FONT,
                              fontWeight: 600,
                              fontSize: 12,
                              color: isEpic ? '#b78cff' : '#5a8a68',
                            }}
                          >
                            {w.note}
                          </span>
                        )}
                        {w.custom && (
                          <span
                            style={{
                              fontFamily: FONT,
                              fontWeight: 600,
                              fontSize: 12,
                              color: isEpic ? '#b78cff' : '#5a8a68',
                            }}
                          >
                            {w.custom}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: pts badge + notation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span
                        style={{
                          fontFamily: FONT,
                          fontWeight: 700,
                          fontSize: 13,
                          color: '#d8b62e',
                          background: '#16130a',
                          border: '1px solid #6e5a1e',
                          borderRadius: 4,
                          padding: '2px 7px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {pts}pt{pts !== 1 ? 's' : ''}
                      </span>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 18,
                          color: out ? '#8a9a8e' : '#cdd6cf',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {w.notation}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* + ADD WEAPON button */}
              <div
                onClick={(e) => { e.stopPropagation(); onAddWeapon(); }}
                style={{
                  border: '1px dashed #2c6e3f',
                  borderRadius: 6,
                  padding: '10px 14px',
                  textAlign: 'center',
                  color: '#4fb568',
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 13,
                  background: '#0c130d',
                  cursor: 'pointer',
                }}
              >
                + ADD WEAPON
              </div>
            </div>
          </div>

          {/* ===== 5. TRAITS & SKILLS ===== */}
          {(unit.skills.length > 0 || unit.mods.length > 0 || unit.leaderMod) && (
            <div style={{ marginTop: 18 }}>
              {sectionHeader('\u25B8 TRAITS & SKILLS')}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {unit.skills.map((sk) => (
                  <span
                    key={`sk-${sk}`}
                    onClick={(e) => { e.stopPropagation(); onChip(sk); }}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#aebfff',
                      border: '1px solid #3a4a7a',
                      borderRadius: 5,
                      padding: '5px 13px',
                      cursor: 'pointer',
                    }}
                  >
                    {glossary[sk]?.t || sk}
                  </span>
                ))}
                {unit.mods.map((mod) => (
                  <span
                    key={`mod-${mod}`}
                    onClick={(e) => { e.stopPropagation(); onChip(mod); }}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#aebfff',
                      border: '1px solid #3a4a7a',
                      borderRadius: 5,
                      padding: '5px 13px',
                      cursor: 'pointer',
                    }}
                  >
                    {glossary[mod]?.t || mod}
                  </span>
                ))}
                {unit.leaderMod && (
                  <span
                    onClick={(e) => { e.stopPropagation(); onChip(unit.leaderMod!); }}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#aebfff',
                      border: '1px solid #3a4a7a',
                      borderRadius: 5,
                      padding: '5px 13px',
                      cursor: 'pointer',
                    }}
                  >
                    {glossary[unit.leaderMod]?.t || unit.leaderMod}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ===== 6. BATTLE LOG ===== */}
          {unit.log && unit.log.length > 0 && (
            <div style={{ marginTop: 18 }}>
              {sectionHeader('\u25B8 BATTLE LOG')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {unit.log.map((entry, i) => {
                  const logColor =
                    entry.kind === 'epic' ? '#c89bff' :
                    entry.kind === 'bad' ? '#ff9a8a' :
                    '#8effa8';
                  return (
                    <div
                      key={`log-${i}`}
                      style={{
                        fontFamily: FONT,
                        fontWeight: 500,
                        fontSize: 14,
                        color: logColor,
                      }}
                    >
                      {entry.text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== 7. SET STATUS ===== */}
          <div style={{ marginTop: 18 }}>
            {sectionHeader('\u25B8 SET STATUS \u2014 tap after a Taken-Out roll')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {allStatuses.map((st) => {
                const active = unit.status === st;
                const [sColor, sBorder, sBg] = statusColors(st);
                return (
                  <button
                    key={st}
                    onClick={(e) => { e.stopPropagation(); onSetStatus(st); }}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: 14,
                      borderRadius: 5,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      border: `1px solid ${active ? sBorder : '#2a3133'}`,
                      background: active ? sBg : '#14181a',
                      color: active ? sColor : '#8a9a90',
                    }}
                  >
                    {glossary[st]?.t || st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===== 8. DOT INDICATORS ===== */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 5,
              padding: '4px 0 8px',
              marginTop: 14,
            }}
          >
            {sorted.map((u, i) => {
              const isActive = u.id === unit.id;
              return (
                <div
                  key={u.id}
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: isActive ? 18 : 6,
                    background: isActive ? '#57ff82' : '#2e3a34',
                    transition: 'width .2s ease',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
