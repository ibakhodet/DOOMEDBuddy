export type Faction = 'inheritor' | 'martyr';

export type UnitStatus = 'ok' | 'wounded' | 'lost' | 'dead' | 'critical' | 'mia' | 'injured' | 'scarred';

export type WeaponRarity = 'standard' | 'superior' | 'epic';

export interface Weapon {
  name: string;
  notation: string;
  mods?: string[];
  custom?: string;
  rarity: WeaponRarity;
  note?: string;
}

export interface LogEntry {
  text: string;
  kind: 'good' | 'bad' | 'epic';
}

export interface Unit {
  id: string;
  name: string;
  role: string;
  ql: string;
  leader?: boolean;
  status: UnitStatus;
  inBattle: boolean;
  inWarband?: boolean;
  trained: boolean;
  kills: number;
  scenarios: number;
  cost: number;
  img?: string;
  weapons: Weapon[];
  skills: string[];
  mods: string[];
  leaderMod?: string;
  upgrades?: string[];
  log?: LogEntry[];
}

export interface Warband {
  player: string;
  name: string;
  sub: string;
  faction: Faction;
  renown: number;
  won: number;
  units: Unit[];
}

export interface GlossaryEntry {
  t: string;
  c: string;
  b: string;
}

export interface AfterActionState {
  outcomes: Record<string, string>;
  win: boolean;
  award: number;
}

export interface MoveGearState {
  owner: string;
  widx: number;
}

export interface GearToast {
  name: string;
  from: string;
  to: string;
}

export type TabView = 'roster' | 'combat' | 'campaign' | 'codex';
