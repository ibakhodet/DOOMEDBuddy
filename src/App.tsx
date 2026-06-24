import { useState, useCallback, useRef } from 'react';
import { Warband, Unit, TabView, AfterActionState, MoveGearState, GearToast, UnitStatus } from './data/types';
import { glossary } from './data/glossary';
import { getSeedWarbands } from './data/seed';
import {
  unitCost, committed, sortUnits, recruitOptions, renownMeter, weaponCost,
} from './data/logic';
import { isFirebaseConfigured } from './firebase';
import { useAuth } from './hooks/useAuth';
import { useWarband } from './hooks/useWarband';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Roster from './components/Roster';
import Combat from './components/Combat';
import Campaign from './components/Campaign';
import Codex from './components/Codex';
import UnitCombatCard from './components/UnitCombatCard';
import GlossarySheet from './components/GlossarySheet';
import MusterOverlay from './components/MusterOverlay';
import RecruitSheet from './components/RecruitSheet';
import AfterAction from './components/AfterAction';
import QuickStatus from './components/QuickStatus';
import MoveGearSheet from './components/MoveGearSheet';
import UndoToast from './components/UndoToast';
import LoginScreen from './components/LoginScreen';
import AddWeaponSheet from './components/AddWeaponSheet';

function App() {
  const { user, playerName, loading: authLoading, error: authError, sendLink, logout } = useAuth();
  const { warband, loading: wbLoading, update } = useWarband(user?.uid || null, playerName);

  // Fallback: use seed data locally when Firebase is not configured
  const [localWb, setLocalWb] = useState<Warband | null>(() =>
    isFirebaseConfigured ? null : getSeedWarbands()[0]
  );
  const firebaseConfigured = isFirebaseConfigured;

  const wb = firebaseConfigured ? warband : localWb;

  const updateWb = useCallback((fn: (w: Warband) => void) => {
    if (firebaseConfigured) {
      update(fn);
    } else {
      setLocalWb(prev => {
        if (!prev) return prev;
        const clone = JSON.parse(JSON.stringify(prev)) as Warband;
        fn(clone);
        return clone;
      });
    }
  }, [firebaseConfigured, update]);

  // UI state
  const [view, setView] = useState<TabView>('roster');
  const [unitId, setUnitId] = useState<string | null>(null);
  const [sheetKey, setSheetKey] = useState<string | null>(null);
  const [codexQuery, setCodexQuery] = useState('');
  const [muster, setMuster] = useState(false);
  const [quickId, setQuickId] = useState<string | null>(null);
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [afterOpen, setAfterOpen] = useState(false);
  const [aa, setAa] = useState<AfterActionState | null>(null);
  const [moveGear, setMoveGear] = useState<MoveGearState | null>(null);
  const [gearToast, setGearToast] = useState<GearToast | null>(null);
  const [addWeaponFor, setAddWeaponFor] = useState<string | null>(null);
  const [editWeapon, setEditWeapon] = useState<{ unitId: string; widx: number } | null>(null);

  // Swipe + long-press state
  const [swipeDir, setSwipeDir] = useState<'l' | 'r' | null>(null);
  const swipeRef = useRef({ x: 0, y: 0, t: 0 });
  const lpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFiredRef = useRef(false);
  const wlpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wlpFiredRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portraitTargetId, setPortraitTargetId] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gearUndoRef = useRef<{ srcId: string; tgtId: string; widx: number; wpn: any } | null>(null);

  if (!firebaseConfigured && !wb) return null;
  if (firebaseConfigured && authLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07090a', color: '#4fb568', fontFamily: "'Chakra Petch', sans-serif", fontSize: 16 }}>Loading...</div>;
  }
  if (firebaseConfigured && !user) {
    return <LoginScreen error={authError} onSendLink={sendLink} />;
  }
  if (firebaseConfigured && wbLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07090a', color: '#4fb568', fontFamily: "'Chakra Petch', sans-serif", fontSize: 16 }}>Loading warband...</div>;
  }
  if (!wb) return null;

  const meter = renownMeter(wb);
  const sorted = sortUnits(wb.units);
  const orderedIds = sorted.map(u => u.id);

  // Navigation
  const onNav = (v: TabView) => { setView(v); setUnitId(null); };

  // Open unit combat card
  const onOpenUnit = (id: string) => {
    if (lpFiredRef.current) { lpFiredRef.current = false; return; }
    setSwipeDir(null);
    setUnitId(id);
  };

  // Chip tap -> glossary
  const onChip = (key: string) => {
    if (wlpFiredRef.current) { wlpFiredRef.current = false; return; }
    setSheetKey(key);
  };

  // Long-press card -> quick status
  const onCardDown = (id: string) => {
    lpFiredRef.current = false;
    if (lpTimerRef.current) clearTimeout(lpTimerRef.current);
    lpTimerRef.current = setTimeout(() => { lpFiredRef.current = true; setQuickId(id); }, 450);
  };
  const onCardUp = () => { if (lpTimerRef.current) clearTimeout(lpTimerRef.current); };

  // Long-press weapon -> move gear
  const onWeaponDown = (owner: string, widx: number) => {
    wlpFiredRef.current = false;
    if (wlpTimerRef.current) clearTimeout(wlpTimerRef.current);
    wlpTimerRef.current = setTimeout(() => { wlpFiredRef.current = true; setMoveGear({ owner, widx }); }, 500);
  };
  const onWeaponUp = () => { if (wlpTimerRef.current) clearTimeout(wlpTimerRef.current); };

  // Swipe on combat card
  const onSwipeStart = (x: number, y: number) => {
    swipeRef.current = { x, y, t: Date.now() };
  };
  const onSwipeEnd = (x: number, y: number) => {
    const dx = x - swipeRef.current.x;
    const dy = y - swipeRef.current.y;
    const dt = Date.now() - swipeRef.current.t;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 700) {
      const i = orderedIds.indexOf(unitId || '');
      if (dx < 0 && i < orderedIds.length - 1) { setSwipeDir('l'); setUnitId(orderedIds[i + 1]); }
      else if (dx > 0 && i > 0) { setSwipeDir('r'); setUnitId(orderedIds[i - 1]); }
    }
  };

  // Prev/next unit
  const onPrevUnit = () => {
    const i = orderedIds.indexOf(unitId || '');
    if (i > 0) { setSwipeDir('r'); setUnitId(orderedIds[i - 1]); }
  };
  const onNextUnit = () => {
    const i = orderedIds.indexOf(unitId || '');
    if (i >= 0 && i < orderedIds.length - 1) { setSwipeDir('l'); setUnitId(orderedIds[i + 1]); }
  };

  // Set status
  const onSetStatus = (id: string, status: UnitStatus) => {
    updateWb(w => { const u = w.units.find(x => x.id === id); if (u) u.status = status; });
  };

  // Toggle warband (in/out)
  const onToggleWarband = (id: string) => {
    updateWb(w => { const u = w.units.find(x => x.id === id); if (u) u.inWarband = u.inWarband === false ? true : false; });
  };

  // Toggle deploy
  const onToggleDeploy = (id: string) => {
    updateWb(w => { const u = w.units.find(x => x.id === id); if (u) u.inBattle = !u.inBattle; });
  };

  // Recruit
  const onAddRecruit = (role: string) => {
    const opt = recruitOptions(wb.faction).find(o => o.role === role);
    if (!opt) return;
    const comm = committed(wb);
    if (comm + opt.cost > wb.renown) return;
    const baseName = glossary[role]?.t || role;
    const existing = wb.units.filter(u => (u.name || '').indexOf(baseName) === 0).length;
    const baseWeapon = opt.weapon || (wb.faction === 'martyr' ? ['Piercer', 'R1x2'] as [string, string] : ['Blaster', 'R2x1'] as [string, string]);
    const newUnit: Unit = {
      id: 'u' + Date.now().toString(36),
      name: existing ? baseName + ' ' + (existing + 1) : baseName,
      role, ql: opt.ql, status: 'ok', inBattle: false, trained: false,
      kills: 0, scenarios: 0, cost: opt.cost,
      weapons: [{ name: baseWeapon[0], notation: baseWeapon[1], mods: [], custom: '', rarity: 'standard', note: 'Standard gear' }],
      skills: opt.skills.slice(), mods: opt.mods.slice(),
    };
    updateWb(w => { w.units.push(newUnit); });
    setRecruitOpen(false);
    setView('roster');
    setUnitId(newUnit.id);
  };

  // After-action
  const onOpenAfter = () => { setAfterOpen(true); setAa({ outcomes: {}, win: false, award: 3 }); };
  const onApplyAfter = () => {
    if (!aa) return;
    updateWb(w => {
      const sNo = w.won + (aa.win ? 1 : 0);
      w.units.filter(u => u.inBattle).forEach(u => {
        const out = (aa.outcomes[u.id]) || 'ok';
        u.status = out as UnitStatus;
        if (out !== 'dead') { u.scenarios = (u.scenarios || 0) + (aa.win ? 1 : 0); u.trained = true; }
        const kind = (out === 'dead' || out === 'lost' || out === 'critical') ? 'bad' : (out === 'ok' || out === 'scarred') ? 'good' : 'bad';
        const label = glossary[out]?.t || out;
        const txt = '\u203a Scenario ' + sNo + ': ' + (aa.win ? 'won' : 'fought') + ' \u2014 ' + (out === 'ok' ? 'unhurt' : label) + '.';
        u.log = (u.log || []).concat([{ text: txt, kind: kind as 'good' | 'bad' }]);
      });
      w.won = sNo;
      w.renown = w.renown + (aa.award || 0);
    });
    setAfterOpen(false);
    setAa(null);
    setView('campaign');
  };

  // Move gear
  const onMoveGearTo = (targetId: string) => {
    if (!moveGear) return;
    const src = wb.units.find(u => u.id === moveGear.owner);
    const tgt = wb.units.find(u => u.id === targetId);
    if (!src || !tgt) return;
    const wpn = src.weapons[moveGear.widx];
    if (!wpn) return;
    gearUndoRef.current = { srcId: src.id, tgtId: tgt.id, widx: moveGear.widx, wpn: JSON.parse(JSON.stringify(wpn)) };
    updateWb(w => {
      const s = w.units.find(u => u.id === moveGear.owner)!;
      const t = w.units.find(u => u.id === targetId)!;
      const wp = s.weapons[moveGear.widx];
      s.weapons.splice(moveGear.widx, 1);
      t.weapons.push(wp);
    });
    setMoveGear(null);
    setGearToast({ name: wpn.name, from: src.name, to: tgt.name });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setGearToast(null), 4000);
  };

  const onUndoGear = () => {
    const g = gearUndoRef.current;
    if (!g) { setGearToast(null); return; }
    updateWb(w => {
      const src = w.units.find(u => u.id === g.srcId);
      const tgt = w.units.find(u => u.id === g.tgtId);
      if (src && tgt) {
        const i = tgt.weapons.findIndex(x => x.name === g.wpn.name);
        if (i > -1) tgt.weapons.splice(i, 1);
        src.weapons.splice(g.widx, 0, g.wpn);
      }
    });
    gearUndoRef.current = null;
    setGearToast(null);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  };

  // QL upgrade
  const onUpgradeQL = (id: string) => {
    updateWb(w => {
      const u = w.units.find(x => x.id === id);
      if (!u || !u.trained) return;
      const qlNum = parseInt(u.ql);
      if (qlNum <= 4) return; // already at max
      const newCommitted = committed(w) + 1;
      if (newCommitted > w.renown) return; // can't afford
      u.ql = (qlNum - 1) + '+';
      u.upgrades = [...(u.upgrades || []), 'increase'];
    });
  };

  // Add weapon
  const onAddWeapon = (id: string, weapon: { name: string; notation: string; mods: string[]; custom: string; rarity: 'standard' | 'superior' | 'epic'; note: string }) => {
    updateWb(w => {
      const u = w.units.find(x => x.id === id);
      if (u) u.weapons.push(weapon);
    });
    setAddWeaponFor(null);
  };

  // Edit weapon
  const onSaveWeapon = (uid: string, widx: number, weapon: { name: string; notation: string; mods: string[]; custom: string; rarity: 'standard' | 'superior' | 'epic'; note: string }) => {
    updateWb(w => {
      const u = w.units.find(x => x.id === uid);
      if (u && u.weapons[widx]) {
        u.weapons[widx] = weapon;
      }
    });
    setEditWeapon(null);
  };

  // Delete weapon
  const onDeleteWeapon = (uid: string, widx: number) => {
    updateWb(w => {
      const u = w.units.find(x => x.id === uid);
      if (u) u.weapons.splice(widx, 1);
    });
    setEditWeapon(null);
  };

  // Portrait upload
  const onChangePortrait = (id: string) => {
    setPortraitTargetId(id);
    fileInputRef.current?.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !portraitTargetId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Resize to max 200x200 to keep Firestore doc small
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        updateWb(wb => {
          const u = wb.units.find(x => x.id === portraitTargetId);
          if (u) u.img = compressed;
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onDeletePortrait = (id: string) => {
    updateWb(w => {
      const u = w.units.find(x => x.id === id);
      if (u) u.img = undefined;
    });
  };

  const activeUnit = unitId ? wb.units.find(u => u.id === unitId) : null;
  const activeIdx = unitId ? orderedIds.indexOf(unitId) : -1;

  return (
    <div style={{ height: '100vh', maxWidth: 540, margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#0b0d0e', fontFamily: "'Chakra Petch', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <Header wb={wb} playerName={playerName || wb.player} onLogout={firebaseConfigured ? logout : undefined} />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {view === 'roster' && (
          <Roster
            wb={wb} meter={meter} onOpenUnit={onOpenUnit} onChip={onChip}
            onCardDown={onCardDown} onCardUp={onCardUp}
            onRecruit={() => setRecruitOpen(true)}
          />
        )}
        {view === 'combat' && (
          <Combat
            wb={wb} meter={meter} onOpenUnit={onOpenUnit}
            onMuster={() => setMuster(true)}
          />
        )}
        {view === 'campaign' && (
          <Campaign wb={wb} onChip={onChip} onOpenAfter={onOpenAfter} />
        )}
        {view === 'codex' && (
          <Codex query={codexQuery} onSearch={setCodexQuery} onChip={onChip} />
        )}
      </div>

      <BottomNav active={view} onNav={onNav} />

      {/* Overlays */}
      {activeUnit && (
        <UnitCombatCard
          unit={activeUnit} wb={wb} meter={meter}
          navIndex={activeIdx + 1} navCount={orderedIds.length}
          hasPrev={activeIdx > 0} hasNext={activeIdx < orderedIds.length - 1}
          swipeAnim={swipeDir}
          onClose={() => { setSwipeDir(null); setUnitId(null); }}
          onPrev={onPrevUnit} onNext={onNextUnit}
          onChip={onChip} onSetStatus={(s) => onSetStatus(activeUnit.id, s)}
          onToggleWarband={() => onToggleWarband(activeUnit.id)}
          onSwipeStart={onSwipeStart} onSwipeEnd={onSwipeEnd}
          onWeaponDown={onWeaponDown} onWeaponUp={onWeaponUp}
          onUpgradeQL={() => onUpgradeQL(activeUnit.id)}
          onAddWeapon={() => setAddWeaponFor(activeUnit.id)}
          onEditWeapon={(widx) => setEditWeapon({ unitId: activeUnit.id, widx })}
          onChangePortrait={() => onChangePortrait(activeUnit.id)}
          onDeletePortrait={() => onDeletePortrait(activeUnit.id)}
        />
      )}

      {sheetKey && (
        <GlossarySheet sheetKey={sheetKey} onClose={() => setSheetKey(null)} onChip={onChip} />
      )}

      {muster && (
        <MusterOverlay
          wb={wb} onClose={() => setMuster(false)}
          onToggleDeploy={onToggleDeploy}
        />
      )}

      {recruitOpen && (
        <RecruitSheet
          wb={wb} meter={meter}
          onClose={() => setRecruitOpen(false)}
          onAdd={onAddRecruit}
        />
      )}

      {afterOpen && aa && (
        <AfterAction
          wb={wb} aa={aa} onClose={() => { setAfterOpen(false); setAa(null); }}
          onToggleWin={() => setAa(prev => prev ? { ...prev, win: !prev.win } : prev)}
          onAward={(d) => setAa(prev => prev ? { ...prev, award: Math.max(0, prev.award + d) } : prev)}
          onOutcome={(uid, key) => setAa(prev => prev ? { ...prev, outcomes: { ...prev.outcomes, [uid]: key } } : prev)}
          onApply={onApplyAfter}
        />
      )}

      {quickId && (
        <QuickStatus
          unit={wb.units.find(u => u.id === quickId)!}
          onClose={() => setQuickId(null)}
          onSetStatus={(s) => { onSetStatus(quickId, s); setQuickId(null); }}
        />
      )}

      {moveGear && (
        <MoveGearSheet
          wb={wb} moveGear={moveGear}
          onClose={() => setMoveGear(null)}
          onMoveTo={onMoveGearTo}
        />
      )}

      {gearToast && (
        <UndoToast toast={gearToast} onUndo={onUndoGear} onClose={() => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); setGearToast(null); }} />
      )}

      {addWeaponFor && (
        <AddWeaponSheet
          onClose={() => setAddWeaponFor(null)}
          onSave={(weapon) => onAddWeapon(addWeaponFor, weapon)}
        />
      )}

      {editWeapon && (
        <AddWeaponSheet
          weapon={wb.units.find(u => u.id === editWeapon.unitId)?.weapons[editWeapon.widx]}
          onClose={() => setEditWeapon(null)}
          onSave={(weapon) => onSaveWeapon(editWeapon.unitId, editWeapon.widx, weapon)}
          onDelete={() => onDeleteWeapon(editWeapon.unitId, editWeapon.widx)}
        />
      )}

      {/* Hidden file input for portrait upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onFileSelected}
      />
    </div>
  );
}

export default App;
