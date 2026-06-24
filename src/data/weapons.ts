// Complete weapon catalog from the rulebook + all Horror rewards
// Each entry: name, notation, cost (pts), mods, source

export interface WeaponTemplate {
  name: string;
  notation: string;
  cost: number;
  mods: string[];
  source: string;
  custom?: string;
  rarity: 'standard' | 'superior' | 'epic';
}

export const weaponCatalog: WeaponTemplate[] = [
  // ──── INHERITOR GEAR ────
  { name: 'Ancestral Blade', notation: 'M3x1', cost: 3, mods: ['rend'], source: 'Inheritor 3pt', rarity: 'superior' },
  { name: 'Incinerator', notation: 'R3x1', cost: 3, mods: ['blaze'], source: 'Inheritor 3pt', rarity: 'superior' },
  { name: 'Righteous Fist', notation: 'M1x2', cost: 2, mods: ['brutal'], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Relic Blade', notation: 'M3x1', cost: 2, mods: [], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Flail', notation: 'M2x1', cost: 2, mods: ['surge'], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Polearm', notation: 'M1x2', cost: 2, mods: ['reach'], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Siege Hammer', notation: 'M1x2', cost: 2, mods: ['heavy'], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Thundergun', notation: 'R1x3', cost: 2, mods: [], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Slugger', notation: 'R1x2', cost: 2, mods: ['sidearm'], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Repeater', notation: 'R1x2', cost: 2, mods: ['storm'], source: 'Inheritor 2pt', rarity: 'superior' },
  { name: 'Blade', notation: 'M2x1', cost: 1, mods: [], source: 'Inheritor 1pt', rarity: 'standard' },
  { name: 'Maul', notation: 'M1x2', cost: 1, mods: [], source: 'Inheritor 1pt', rarity: 'standard' },
  { name: 'Blaster', notation: 'R2x1', cost: 1, mods: [], source: 'Inheritor 1pt', rarity: 'standard' },
  { name: 'Piercer', notation: 'R1x2', cost: 1, mods: [], source: 'Inheritor 1pt', rarity: 'standard' },

  // ──── MARTYR GEAR ────
  { name: 'Autostave', notation: 'M3x1', cost: 3, mods: ['reach'], source: 'Martyr 3pt', rarity: 'superior' },
  { name: 'Repulsor', notation: 'M1x3', cost: 3, mods: ['force'], source: 'Martyr 3pt', rarity: 'superior' },
  { name: 'Thermal Lance', notation: 'R1x3', cost: 3, mods: ['rend'], source: 'Martyr 3pt', rarity: 'superior' },
  { name: 'Railgun', notation: 'R1x3', cost: 3, mods: ['heavy'], source: 'Martyr 3pt', rarity: 'superior' },
  { name: 'Electro-Sword', notation: 'M1x3', cost: 2, mods: [], source: 'Martyr 2pt', rarity: 'superior' },
  { name: 'Electro Sword', notation: 'M1x3', cost: 2, mods: [], source: 'Martyr 2pt', rarity: 'superior' },
  { name: 'Alloy Staff', notation: 'M3x1', cost: 2, mods: [], source: 'Martyr 2pt', rarity: 'superior' },
  { name: 'Oxidiser', notation: 'R1x2', cost: 2, mods: ['lethal'], source: 'Martyr 2pt', rarity: 'superior' },
  { name: 'Scorcher', notation: 'R2x1', cost: 2, mods: ['agony'], source: 'Martyr 2pt', rarity: 'superior' },
  { name: 'Atomiser', notation: 'R1x2', cost: 2, mods: ['heavy'], source: 'Martyr 2pt', rarity: 'superior' },
  { name: 'Spear', notation: 'M1x2', cost: 1, mods: [], source: 'Martyr 1pt', rarity: 'standard' },
  { name: 'Sword', notation: 'M2x1', cost: 1, mods: [], source: 'Martyr 1pt', rarity: 'standard' },
  { name: 'Shock Rod', notation: 'M1x1', cost: 1, mods: ['suppress'], source: 'Martyr 1pt', rarity: 'standard' },
  { name: 'Rusted Pick', notation: 'M1x2', cost: 1, mods: [], source: 'Martyr 1pt', rarity: 'standard' },

  // ──── REBORN GEAR ────
  { name: 'Huge Claws', notation: 'M3x1', cost: 3, mods: ['storm'], source: 'Reborn 3pt', rarity: 'superior' },
  { name: 'Lethal Probe', notation: 'M1x3', cost: 3, mods: ['agony'], source: 'Reborn 3pt', rarity: 'superior' },
  { name: 'Storm Cannon', notation: 'R3x1', cost: 3, mods: ['storm'], source: 'Reborn 3pt', rarity: 'superior' },
  { name: 'Grav Warper', notation: 'R1x3', cost: 3, mods: ['force'], source: 'Reborn 3pt', rarity: 'superior' },
  { name: 'Novagun', notation: 'R3x1', cost: 3, mods: ['surge'], source: 'Reborn 3pt', rarity: 'superior' },
  { name: 'Toxic Blade', notation: 'M1x3', cost: 2, mods: [], source: 'Reborn 2pt', rarity: 'superior' },
  { name: 'Savage Claws', notation: 'M3x1', cost: 2, mods: [], source: 'Reborn 2pt', rarity: 'superior' },
  { name: 'Ripper Staff', notation: 'M2x1', cost: 2, mods: ['heavy'], source: 'Reborn 2pt', rarity: 'superior' },
  { name: 'Scatterblaster', notation: 'R3x1', cost: 2, mods: [], source: 'Reborn 2pt', rarity: 'superior' },
  { name: 'Charger', notation: 'R2x1', cost: 2, mods: ['surge'], source: 'Reborn 2pt', rarity: 'superior' },
  { name: 'Rumbler', notation: 'R2x1', cost: 2, mods: ['concuss'], source: 'Reborn 2pt', rarity: 'superior' },
  { name: 'Claws', notation: 'M2x1', cost: 1, mods: [], source: 'Reborn 1pt', rarity: 'standard' },
  { name: 'Pistol', notation: 'R1x1', cost: 1, mods: ['sidearm'], source: 'Reborn 1pt', rarity: 'standard' },
  { name: 'Toxic Dagger', notation: 'M1x1', cost: 1, mods: ['lethal'], source: 'Reborn 1pt', rarity: 'standard' },

  // ──── EXILE GEAR ────
  { name: 'Death Claws', notation: 'M3x1', cost: 3, mods: ['agony'], source: 'Exile 3pt', rarity: 'superior' },
  { name: 'Dread Glaive', notation: 'M1x3', cost: 3, mods: ['reach'], source: 'Exile 3pt', rarity: 'superior' },
  { name: 'Cluster Launcher', notation: 'R3x1', cost: 3, mods: ['concuss'], source: 'Exile 3pt', rarity: 'superior' },
  { name: 'Shardreaper', notation: 'R3x1', cost: 3, mods: ['heavy'], source: 'Exile 3pt', rarity: 'superior' },
  { name: 'Seeker Cannon', notation: 'R1x3', cost: 3, mods: ['storm'], source: 'Exile 3pt', rarity: 'superior' },
  { name: 'Fusion Gun', notation: 'R3x1', cost: 3, mods: ['bane'], source: 'Exile 3pt', rarity: 'superior' },
  { name: 'Hunting Spear', notation: 'M1x2', cost: 2, mods: ['lethal'], source: 'Exile 2pt', rarity: 'superior' },
  { name: 'Bane Talon', notation: 'M1x2', cost: 2, mods: ['bane'], source: 'Exile 2pt', rarity: 'superior' },
  { name: 'Impaler', notation: 'R1x2', cost: 2, mods: ['suppress'], source: 'Exile 2pt', rarity: 'superior' },
  { name: 'Shardcaster', notation: 'R3x1', cost: 2, mods: [], source: 'Exile 2pt', rarity: 'superior' },
  { name: 'Spike', notation: 'M1x2', cost: 1, mods: [], source: 'Exile 1pt', rarity: 'standard' },
  { name: 'Kinetic Driver', notation: 'M1x1', cost: 1, mods: ['force'], source: 'Exile 1pt', rarity: 'standard' },

  // ──── HORROR REWARDS ────
  // Devourer
  { name: 'Reaper Blade', notation: 'M1x2', cost: 2, mods: [], source: 'Devourer reward', rarity: 'epic', custom: 'Make a Free Action when you Take Out an Enemy with this Weapon.' },
  { name: 'Acid Gun', notation: 'R1x3', cost: 3, mods: [], source: 'Devourer reward', rarity: 'epic', custom: 'Ignores Shields and Cloaks.' },
  // Warped Hunters
  { name: 'Hunter Rifle', notation: 'R1x4', cost: 3, mods: [], source: 'Warped Hunters reward', rarity: 'epic' },
  // Abyssal Colossus
  { name: 'Abyssal Shield', notation: '', cost: 1, mods: [], source: 'Abyssal Colossus reward', rarity: 'epic', custom: 'When Readied, +1 to Saves and counts as Tough.' },
  // Eliminator Drone
  { name: 'Reaper Blaster', notation: 'R2x1', cost: 3, mods: [], source: 'Eliminator Drone reward', rarity: 'epic', custom: 'Can Shoot twice per Turn.' },
  { name: 'Dismemberment Claw', notation: 'M1x2', cost: 2, mods: [], source: 'Eliminator Drone reward', rarity: 'epic', custom: 'Targets that roll a 1 on any Save are Taken Out.' },
  // Crusade Machine
  { name: 'Impacter', notation: 'M1x6', cost: 3, mods: [], source: 'Crusade Machine reward', rarity: 'epic', custom: 'Cannot be used on the last Action of your Turn or as a Free Action.' },
  // Doom Hand
  { name: 'Catching Pole', notation: 'M1x3', cost: 2, mods: [], source: 'Doom Hand reward', rarity: 'epic', custom: 'Downed Enemies touching this unit Recover at QL6+.' },
  // Burning Brute
  { name: 'Thermal Maul', notation: 'M1x5', cost: 3, mods: [], source: 'Burning Brute reward', rarity: 'epic', custom: 'Only once per Turn.' },
  // Exterminators
  { name: 'Blitz Gun', notation: 'R1x1', cost: 2, mods: [], source: 'Exterminators reward', rarity: 'epic', custom: 'Ignore the once-per-Turn Shooting limit.' },
  { name: 'Chaos Gun', notation: 'R1x3', cost: 2, mods: [], source: 'Exterminators reward', rarity: 'epic', custom: 'Treat Shock Rolls of 7 as Panic if it benefits you.' },
  { name: 'Portable Chaingun', notation: 'Rd6x1', cost: 2, mods: [], source: 'Exterminators reward', rarity: 'epic', custom: 'Roll d6 for number of shots, each doing 1 Damage.' },
  // Pit Serpent
  { name: 'Fang Blade', notation: 'M2x2', cost: 3, mods: [], source: 'Pit Serpent reward', rarity: 'epic', custom: 'The wielder gains Nimble.' },
  // Traitor's Tomb
  { name: 'Purgatorial Flamethrower', notation: 'R2x1', cost: 2, mods: [], source: "Traitor's Tomb reward", rarity: 'epic', custom: 'If a target is Wounded, all units that can see them (other than the shooter) suffer 1 Damage.' },
  // Winter Harvester
  { name: 'Cold Scythe', notation: 'M2x3', cost: 4, mods: [], source: 'Winter Harvester reward', rarity: 'epic' },
  // Grafted Aberration
  { name: 'Rage Blaster', notation: 'R2x1', cost: 2, mods: [], source: 'Grafted Aberration reward', rarity: 'epic', custom: 'Targets that are Downed Attack the nearest target, friend or foe, instead of rolling Shock.' },
  { name: 'Viscera Blades', notation: 'M2x2', cost: 2, mods: [], source: 'Grafted Aberration reward', rarity: 'epic', custom: 'This unit cannot carry any other Weapons.' },
  // Battle Strider
  { name: 'Link Gun', notation: 'R1x3', cost: 3, mods: [], source: 'Battle Strider reward', rarity: 'epic', custom: 'Use 3 Actions to fire this as R3x3.' },
  // Quake Engine
  { name: 'Quake Hammer', notation: 'M1x3', cost: 2, mods: [], source: 'Quake Engine reward', rarity: 'epic', custom: 'When this unit Takes Out a target, the nearest other unit takes 1 Damage.' },
  // Oozing Bull
  { name: "Charger's Lance", notation: 'M1x2', cost: 2, mods: [], source: 'Oozing Bull reward', rarity: 'epic', custom: 'x2 Damage if the unit Moved immediately before this Attack.' },
  // Chameleoid
  { name: 'Bio-Spike Launcher', notation: 'R1x3', cost: 3, mods: [], source: 'Chameleoid reward', rarity: 'epic', custom: 'If the unit hits a target, it may make a Free Move.' },
  { name: 'Tearing Knife', notation: 'M1x3', cost: 3, mods: ['rend'], source: 'Chameleoid reward', rarity: 'epic' },
  // Steel Tyrant
  { name: 'Lightning Gun', notation: 'R1x3', cost: 3, mods: [], source: 'Steel Tyrant reward', rarity: 'epic', custom: 'If the target is Wounded, Shoot again at the nearest visible Enemy; cannot strike the same target twice.' },
  { name: 'Flash Gun', notation: 'R3x1', cost: 2, mods: [], source: 'Steel Tyrant reward', rarity: 'epic', custom: 'If a Standing target rolls a 1 for any Save, the unit is Downed without rolling Shock.' },
  // Rot Herald
  { name: 'Impaler Horn', notation: 'M3x1', cost: 3, mods: [], source: 'Rot Herald reward', rarity: 'epic', custom: 'x2 Damage if all dice hit.' },
  { name: 'Spore Gun', notation: 'R1x3', cost: 2, mods: [], source: 'Rot Herald reward', rarity: 'epic', custom: 'Designate one enemy as the target before the battle; x2 Attack dice against that unit.' },
  // Grey Circle
  { name: 'Fanatic Flail', notation: 'M2x1', cost: 2, mods: [], source: 'Grey Circle reward', rarity: 'epic', custom: 'If any of your Allies have been Taken Out, this Round the unit has Fierce and Nimble.' },
  { name: 'Cinder Bone', notation: 'M1x1', cost: 2, mods: [], source: 'Grey Circle reward', rarity: 'epic', custom: 'No Save permitted. One use per battle.' },
  // Living Blizzard
  { name: 'Icepiercer', notation: 'R1x2', cost: 2, mods: [], source: 'Living Blizzard reward', rarity: 'epic', custom: 'If this unit Wounds a target they become Exhausted.' },
  // Sin Echo
  { name: 'Echo Blade', notation: 'M3x1', cost: 2, mods: [], source: 'Sin Echo reward', rarity: 'epic', custom: "When Attacking, use the target's QL instead of your own." },
  // Red Witch
  { name: 'Red Beam', notation: 'R1x3', cost: 3, mods: [], source: 'Red Witch reward', rarity: 'epic', custom: 'When this unit Wounds a target with this weapon, make a Free Attack.' },
  // Shadow Cutter
  { name: 'Dark Knife', notation: 'M2x1', cost: 2, mods: [], source: 'Shadow Cutter reward', rarity: 'epic', custom: 'x2 Damage if no Enemies other than the target can see this unit.' },
  // Rook Wyvern
  { name: 'Nerve Gun', notation: 'R3x1', cost: 3, mods: [], source: 'Rook Wyvern reward', rarity: 'epic', custom: 'May make a Free Attack as R2x1 against a second viable target.' },
  // Flesh Titan
  { name: 'Grapple Tendon', notation: 'R1x1', cost: 1, mods: [], source: 'Flesh Titan reward', rarity: 'epic', custom: 'If this unit hits the target it Moves into touch with them.' },
  // Rage Angel
  { name: 'Roaring Blade', notation: 'M3x2', cost: 3, mods: [], source: 'Rage Angel reward', rarity: 'epic' },
  // Catafractal
  { name: 'Infinity Blade', notation: 'M1x5', cost: 3, mods: [], source: 'Catafractal reward', rarity: 'epic', custom: 'If the Attack fails to cause a Wound, the Attacker takes 5 Damage.' },
  { name: 'Psych-Ray', notation: 'R1x4', cost: 3, mods: [], source: 'Catafractal reward', rarity: 'epic', custom: 'Wounded targets Roll on the Shock Table using D6+2 rather than 2D6.' },
  // Dust Leviathan
  { name: 'Erosion Cannon', notation: 'R6x1', cost: 3, mods: [], source: 'Dust Leviathan reward', rarity: 'epic', custom: 'This unit can only target units in its board quarter.' },
  // Mantevora
  { name: 'Beast Claw', notation: 'M2x1', cost: 1, mods: [], source: 'Mantevora reward', rarity: 'epic', custom: 'When this unit Takes Out an Enemy, add 1 to the number of dice it rolls for the rest of the battle.' },
  { name: 'Bile Launcher', notation: 'R2x1', cost: 2, mods: [], source: 'Mantevora reward', rarity: 'epic', custom: 'If the target is Wounded that unit loses all Skills for the rest of the battle.' },
  // Technobasilisk
  { name: 'Shatter Rifle', notation: 'R1x2', cost: 2, mods: [], source: 'Technobasilisk reward', rarity: 'epic', custom: 'x2 Damage vs Exhausted targets.' },
  // Broken Behemoth
  { name: 'Wrecking Hammer', notation: 'M1x4', cost: 3, mods: [], source: 'Broken Behemoth reward', rarity: 'epic' },
];

// Build a search-friendly label for each weapon
export function weaponLabel(w: WeaponTemplate): string {
  const modsStr = w.mods.length ? ' ' + w.mods.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ') : '';
  return `${w.name} ${w.notation} ${w.cost}pt${w.cost !== 1 ? 's' : ''}${modsStr} [${w.source}]`;
}
