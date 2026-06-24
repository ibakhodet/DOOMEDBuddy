import { Weapon, Unit, Warband, Faction } from './types';
import { glossary } from './glossary';

/* ------------------------------------------------------------------ */
/*  1. weaponCost                                                     */
/* ------------------------------------------------------------------ */

const WC: Record<string, number> = {
  'Ancestral Blade': 3, 'Incinerator': 3,
  'Righteous Fist': 2, 'Relic Blade': 2, 'Flail': 2, 'Polearm': 2, 'Siege Hammer': 2, 'Thundergun': 2, 'Slugger': 2, 'Repeater': 2,
  'Blade': 1, 'Maul': 1, 'Blaster': 1, 'Piercer': 1,
  'Autostave': 3, 'Repulsor': 3, 'Thermal Lance': 3, 'Railgun': 3,
  'Electro-Sword': 2, 'Electro Sword': 2, 'Alloy Staff': 2, 'Oxidiser': 2, 'Scorcher': 2, 'Atomiser': 2,
  'Spear': 1, 'Sword': 1, 'Shock Rod': 1, 'Rusted Pick': 1,
  'Reaper Blade': 2, 'Acid Gun': 3,
};

export function weaponCost(w: Weapon): number {
  if (WC[w.name] !== undefined) return WC[w.name];

  if (w.note) {
    const ptMatch = w.note.match(/(\d+)\s*pts?/i);
    if (ptMatch) return parseInt(ptMatch[1], 10);
  }

  const diceMatch = w.notation.match(/(\d+)x(\d+)/);
  if (diceMatch) {
    const dice = parseInt(diceMatch[1], 10);
    const damage = parseInt(diceMatch[2], 10);
    return dice >= 3 || damage >= 3 ? 2 : 1;
  }

  return 0;
}

/* ------------------------------------------------------------------ */
/*  2. roleBaseCost                                                   */
/* ------------------------------------------------------------------ */

const roleCosts: Record<string, number> = {
  judge: 0, sheriff: 0, marshall: 0, sage: 0, curator: 0, steward: 0,
  paragon: 4, pathfinder: 4, champion: 3, freelance: 3, chronicle: 2, legionnaire: 2, zealot: 2, herald: 2,
  besieger: 4, harrier: 4, errant: 4, technolyte: 3, automata: 3, falcon: 3, seeker: 2, squire: 2,
};

export function roleBaseCost(role: string): number {
  return roleCosts[role] || 0;
}

/* ------------------------------------------------------------------ */
/*  3. unitCost                                                       */
/* ------------------------------------------------------------------ */

export function unitCost(u: Unit): number {
  const weaponTotal = u.weapons.reduce((sum, w) => sum + weaponCost(w), 0);
  return roleBaseCost(u.role) + weaponTotal + (u.upgrades?.length || 0);
}

/* ------------------------------------------------------------------ */
/*  4. committed                                                      */
/* ------------------------------------------------------------------ */

export function committed(wb: Warband): number {
  return wb.units
    .filter(u => u.inWarband !== false)
    .reduce((sum, u) => sum + unitCost(u), 0);
}

/* ------------------------------------------------------------------ */
/*  5. decode                                                         */
/* ------------------------------------------------------------------ */

export function decode(notation: string): string {
  const m = notation.match(/^([MR])(\d+)x(\d+)$/i);
  if (!m) return notation + ' \u2014 a custom weapon.';

  const type = m[1].toUpperCase() === 'M'
    ? 'Melee \u2014 only hits targets you Touch'
    : 'Ranged \u2014 hits any target in sight';
  const dice = m[2];
  const damage = m[3];
  return `${type}. Roll ${dice} die(s); each hit deals ${damage} damage.`;
}

/* ------------------------------------------------------------------ */
/*  6. linkify                                                        */
/* ------------------------------------------------------------------ */

export function linkify(
  text: string,
  currentKey?: string,
): Array<{ text: string; key?: string }> {
  const titleToKey = new Map<string, string>();
  for (const [key, entry] of Object.entries(glossary)) {
    const cat = entry.c;
    if (
      cat === 'Skill' ||
      cat === 'Unit Mod' ||
      cat === 'Weapon Mod' ||
      cat.startsWith('Leader Mod')
    ) {
      titleToKey.set(entry.t.toLowerCase(), key);
    }
  }

  const result: Array<{ text: string; key?: string }> = [];
  const parts = text.split(/\b/);

  for (const part of parts) {
    const lower = part.toLowerCase();
    const matchedKey = titleToKey.get(lower);
    if (matchedKey && matchedKey !== currentKey) {
      result.push({ text: part, key: matchedKey });
    } else {
      result.push({ text: part });
    }
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  7. recruitOptions                                                 */
/* ------------------------------------------------------------------ */

export interface RecruitDef {
  role: string;
  ql: string;
  cost: number;
  skills: string[];
  mods: string[];
  weapon?: [string, string];
}

export function recruitOptions(faction: Faction): RecruitDef[] {
  if (faction === 'inheritor') {
    return [
      { role: 'champion', ql: '4+', cost: 3, skills: ['fierce'], mods: [] },
      { role: 'paragon', ql: '4+', cost: 4, skills: ['tough'], mods: ['guardian'] },
      { role: 'pathfinder', ql: '4+', cost: 4, skills: ['precise'], mods: ['shortcut'] },
      { role: 'freelance', ql: '5+', cost: 3, skills: ['tough'], mods: ['versatile'] },
      { role: 'chronicle', ql: '5+', cost: 2, skills: [], mods: ['aide'] },
      { role: 'legionnaire', ql: '5+', cost: 2, skills: [], mods: ['loyal'] },
      { role: 'zealot', ql: '5+', cost: 2, skills: [], mods: ['fanatic'] },
      { role: 'herald', ql: '5+', cost: 2, skills: [], mods: ['inspire'] },
    ];
  }

  return [
    { role: 'besieger', ql: '4+', cost: 4, skills: ['tough'], mods: ['vengeful'] },
    { role: 'harrier', ql: '4+', cost: 4, skills: ['nimble'], mods: ['dash'] },
    { role: 'errant', ql: '4+', cost: 4, skills: [], mods: [], weapon: ['Electro Sword', 'M1x3'] },
    { role: 'technolyte', ql: '5+', cost: 3, skills: ['tough'], mods: ['aim'] },
    { role: 'automata', ql: '5+', cost: 3, skills: ['tough'], mods: ['bionics'] },
    { role: 'falcon', ql: '5+', cost: 3, skills: ['nimble'], mods: ['jump'] },
    { role: 'seeker', ql: '5+', cost: 2, skills: [], mods: ['seize'] },
    { role: 'squire', ql: '5+', cost: 2, skills: ['nimble'], mods: [] },
  ];
}

/* ------------------------------------------------------------------ */
/*  8. sortUnits                                                      */
/* ------------------------------------------------------------------ */

export function sortUnits(units: Unit[]): Unit[] {
  return [...units].sort((a, b) => {
    const rankOf = (u: Unit): number => {
      if (u.inWarband === false) return 2;
      if (u.status === 'lost' || u.status === 'dead') return 1;
      return 0;
    };

    const ra = rankOf(a);
    const rb = rankOf(b);
    if (ra !== rb) return ra - rb;

    if (a.leader && !b.leader) return -1;
    if (!a.leader && b.leader) return 1;

    return a.name.localeCompare(b.name);
  });
}

/* ------------------------------------------------------------------ */
/*  9. shockTableData & casualtyTableData                             */
/* ------------------------------------------------------------------ */

export interface TableRow {
  roll: number;
  title: string;
  effect: string;
  color: string;
  bg: string;
  border: string;
}

const colors = {
  k: { color: '#ff6a5a', bg: '#150a0a' },
  n: { color: '#ffba6a', bg: '#140f08' },
  d: { color: '#cdd6cf', bg: '#0d1115' },
  g: { color: '#8effa8', bg: '#0a1410' },
} as const;

type Tone = keyof typeof colors;

function buildRows(
  rows: [number, string, string, Tone][],
  lastTransparent: boolean,
): TableRow[] {
  return rows.map((r, i) => ({
    roll: r[0],
    title: r[1],
    effect: r[2],
    color: colors[r[3]].color,
    bg: colors[r[3]].bg,
    border: lastTransparent && i === rows.length - 1 ? 'transparent' : '#1a2122',
  }));
}

export const shockTableData: TableRow[] = buildRows(
  [
    [2, 'Killshot', 'Taken Out (messy)', 'k'],
    [3, 'Bleeding', 'Roll or be Taken Out', 'k'],
    [4, 'Opportunity', 'Attacker gets a Free Move or Attack', 'n'],
    [5, 'Thrown', 'Move directly away from the attacker', 'n'],
    [6, 'Panic', 'Attack the nearest target \u2014 friend or foe', 'n'],
    [7, 'Downed', 'No further effect', 'd'],
    [8, 'Fight Back', 'Free Attack against your attacker', 'g'],
    [9, 'Crawl', 'Free Move', 'g'],
    [10, 'Last Gasp', 'Free Action', 'g'],
    [11, 'Saviour', 'An ally you see gets a Free Move', 'g'],
    [12, 'Vengeance', 'One ally gets a Free Attack against your attacker', 'g'],
  ],
  true,
);

export const casualtyTableData: TableRow[] = buildRows(
  [
    [1, 'Dead', 'Nothing left. Out for next battle (may return renamed)', 'k'],
    [2, 'Critical', 'Roll or Die before the next battle', 'k'],
    [3, 'MIA', 'In the next battle but enemy deploys them out of sight', 'n'],
    [4, 'Injured', 'If Taken Out next battle \u2192 dead', 'n'],
    [5, 'Lost', 'If used next battle deploy from a random edge in round 2', 'n'],
    [6, 'Scarred', 'An ugly scar to show off. No penalty', 'g'],
  ],
  true,
);

/* ------------------------------------------------------------------ */
/*  10. codexCategories                                               */
/* ------------------------------------------------------------------ */

export const codexCategories = [
  ['Skills', ['tough', 'fierce', 'nimble', 'precise']],
  ['Unit Mods', ['guardian', 'loyal', 'fanatic', 'defender', 'aide', 'inspire', 'link', 'revive', 'phalanx', 'frenzy', 'overrun', 'dash', 'jump', 'impact', 'seize', 'shortcut', 'sensor', 'signal', 'versatile', 'vengeful', 'opportunist', 'adrenaline', 'aim', 'bionics', 'decoy', 'manipulate', 'smite']],
  ['Weapon Mods', ['blaze', 'brutal', 'rend', 'reach', 'heavy', 'storm', 'agony', 'bane', 'concuss', 'force', 'lethal', 'sidearm', 'suppress', 'surge']],
  ['Leader Mods', ['condemn', 'execute', 'advance', 'infiltrate', 'guide', 'arise']],
  ['Unit Types', ['judge', 'sheriff', 'marshall', 'paragon', 'pathfinder', 'champion', 'freelance', 'chronicle', 'legionnaire', 'zealot', 'herald', 'sage', 'curator', 'steward', 'besieger', 'harrier', 'errant', 'technolyte', 'automata', 'falcon', 'seeker', 'squire']],
  ['Gear', ['shield', 'cloak']],
  ['Rewards & Upgrades', ['increase']],
  ['Casualties & Status', ['ok', 'wounded', 'scarred', 'injured', 'mia', 'lost', 'critical', 'dead', 'trained']],
] as const;

/* ------------------------------------------------------------------ */
/*  Status colors                                                     */
/* ------------------------------------------------------------------ */

export function statusColors(status: string): [string, string, string] {
  const map: Record<string, [string, string, string]> = {
    ok: ['#7effb0', '#1f4a3a', '#0c1a12'],
    wounded: ['#ff9a4a', '#7a4a1e', '#1c1208'],
    lost: ['#ff6a5a', '#7a2a22', '#1c0c0a'],
    dead: ['#ff6a5a', '#7a2a22', '#1c0c0a'],
    critical: ['#ff6a5a', '#7a2a22', '#1c0c0a'],
    mia: ['#e0903a', '#5a3f1e', '#16120a'],
    injured: ['#ff9a4a', '#7a4a1e', '#1c1208'],
    scarred: ['#aab0b8', '#3a4143', '#14181a'],
  };
  return map[status] || ['#7effb0', '#1f4a3a', '#0c1a12'];
}

/* ------------------------------------------------------------------ */
/*  Renown meter                                                      */
/* ------------------------------------------------------------------ */

export function renownMeter(wb: Warband) {
  const comm = committed(wb);
  const free = wb.renown - comm;
  const over = free < 0;
  return {
    committed: comm,
    free,
    cap: wb.renown,
    over,
    freeText: over ? 'OVER BY ' + Math.abs(free) : free + ' free',
    pct: Math.max(0, Math.min(100, Math.round(comm / Math.max(1, wb.renown) * 100))),
    freeColor: over ? '#ff6a5a' : free === 0 ? '#d8b62e' : '#8effa8',
    barColor: over
      ? 'linear-gradient(90deg,#b8392c,#ff6a5a)'
      : free === 0
        ? 'linear-gradient(90deg,#3a4143,#6a766e)'
        : 'linear-gradient(90deg,#1f6e3f,#57ff82)',
    boxBorder: over ? '#a23a2e' : '#1f2a2c',
    boxBg: over ? '#1a0f0d' : '#0d1115',
    labelColor: over ? '#ff8a7a' : '#4fb568',
  };
}
