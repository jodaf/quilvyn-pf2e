/*
Copyright 2021, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/*jshint esversion: 6 */
"use strict";

var PATHFINDER2E_VERSION = '2.1.1.0';

/*
 * This module loads the rules from the Pathfinder Reference Document v2. The
 * Pathfinder2E function contains methods that load rules for particular parts
 * of the PRD: ancestryRules for character ancestries, magicRules for spells,
 * etc. These member methods can be called independently in order to use a
 * subset of the SRD v2 rules. Similarly, the constant fields of Pathfinder2E
 * (ALIGNMENTS, FEATS, etc.) can be manipulated to modify the choices.
 */
function Pathfinder2E() {

  var rules = new QuilvynRules('Pathfinder 2E', PATHFINDER2E_VERSION);
  Pathfinder2E.rules = rules;

  rules.defineChoice('choices', Pathfinder2E.CHOICES);
  rules.choiceEditorElements = Pathfinder2E.choiceEditorElements;
  rules.choiceRules = Pathfinder2E.choiceRules;
  rules.editorElements = Pathfinder2E.initialEditorElements();
  rules.getFormats = Pathfinder2E.getFormats;
  rules.makeValid = Pathfinder2E.makeValid;
  rules.randomizeOneAttribute = Pathfinder2E.randomizeOneAttribute;
  rules.defineChoice('random', Pathfinder2E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Pathfinder2E.ruleNotes;

  Pathfinder2E.createViewers(rules, Pathfinder2E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset', 'ancestry', 'background', 'level', 'levels');

  Pathfinder2E.abilityRules(rules, Pathfinder2E.ABILITIES);
  Pathfinder2E.combatRules
    (rules, Pathfinder2E.ARMORS, Pathfinder2E.SHIELDS, Pathfinder2E.WEAPONS);
  Pathfinder2E.magicRules(rules, Pathfinder2E.SCHOOLS, Pathfinder2E.SPELLS);
  Pathfinder2E.identityRules(
    rules, Pathfinder2E.ALIGNMENTS, Pathfinder2E.ANCESTRIES,
    Pathfinder2E.BACKGROUNDS, Pathfinder2E.CLASSES, Pathfinder2E.DEITIES,
    Pathfinder2E.PATHS
  );
  Pathfinder2E.talentRules(
    rules, Pathfinder2E.FEATS, Pathfinder2E.FEATURES, Pathfinder2E.GOODIES,
    Pathfinder2E.LANGUAGES, Pathfinder2E.SKILLS
  );

  Quilvyn.addRuleSet(rules);

}

/* List of items handled by choiceRules method. */
Pathfinder2E.CHOICES = [
  'Alignment', 'Ancestry', 'Armor', 'Background', 'Class', 'Deity', 'Feat',
  'Feature', 'Goody', 'Language', 'Path', 'School', 'Shield', 'Skill', 'Spell',
  'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
Pathfinder2E.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'ancestry', 'gender', 'name', 'alignment', 'background', 'deity', 'levels',
  'features', 'feats', 'skills', 'languages', 'hitPoints', 'armor', 'weapons',
  'shield', 'spells', 'boosts'
];
Pathfinder2E.VIEWERS = ['Collected Notes', 'Compact', 'Standard'];

Pathfinder2E.ABILITIES = {
  'Charisma':'',
  'Constitution':'',
  'Dexterity':'',
  'Intelligence':'',
  'Strength':'',
  'Wisdom':''
};
Pathfinder2E.ALIGNMENTS = {
  'Chaotic Evil':'',
  'Chaotic Good':'',
  'Chaotic Neutral':'',
  'Neutral Evil':'',
  'Neutral Good':'',
  'Neutral':'',
  'Lawful Evil':'',
  'Lawful Good':'',
  'Lawful Neutral':''
};
Pathfinder2E.ANCESTRIES = {
  // TODO
  'Dwarf':
    'Features=Darkvision,Slow ' +
    'Selectables=' +
      '"1:Ancient-Blooded Dwarf","1:Death Warden Dwarf","1:Forge Dwarf",' +
      '"1:Rock Dwarf","1:Strong-Blooded Dwarf" ' +
    'Boost=Constitution,Wisdom,any ' +
    'Flaw=Charisma ' +
    'HitPoints=10 ' +
    'Languages=Common,Dwarven',
  'Elf':
    'Features=Fast,"Low-Light Vision" ' +
    'Selectables=' +
      '"1:Arctic Elf","1:Cavern Elf","1:Seer Elf","1:Whisper Elf",' +
      '"1:Woodland Elf" ' +
    'Boost=Dexterity,Intelligence,any ' +
    'Flaw=Constitution ' +
    'HitPoints=6 ' +
    'Languages=Common,Elven',
  'Gnome':
    'Features="Low-Light Vision",Small ' +
    'Selectables=' +
      '"1:Chameleon Gnome","1:Fey-Touched Gnome","1:Sensate Gnome",' +
      '"1:Umbral Gnome","1:Wellspring Gnome" ' +
    'Boost=Constitution,Charisma,any ' +
    'Flaw=Strength ' +
    'HitPoints=8 ' +
    'Languages=Common,Gnomish,Sylvan',
  'Goblin':
    'Features="Darkvision",Small ' +
    'Selectables=' +
      '"1:Charhide Goblin","1:Irongut Goblin","1:Razortooth Goblin",' +
      '"1:Snow Goblin","1:Unbreakable Goblin" ' +
    'Boost=Dexterity,Charisma,any ' +
    'Flaw=Wisdom ' +
    'HitPoints=6 ' +
    'Languages=Common,Goblin',
  'Halfling':
    'Features="Keen Eyes",Small ' +
    'Selectables=' +
      '"1:Gutsy Halfling","1:Hillock Halfling","1:Nomadic Halfling",' +
      '"1:Twilight Halfling","1:Wildwood Halfling" ' +
    'Boost=Dexterity,Wisdom,any ' +
    'Flaw=Strength ' +
    'HitPoints=6 ' +
    'Languages=Common,Halfling',
  'Human':
    'Features="Keen Eyes",Small ' +
    'Selectables=' +
      '1:Half-Elf,1:Half-Orc,"1:Skilled Heritage","1:Versatile Heritage" ' +
    'Boost=any,any ' +
    'HitPoints=8 ' +
    'Languages=Common'
};
Pathfinder2E.ARMORS = {
  'None':'Weight=0 AC=0 Dex=10 Skill=0 Speed=0 Str=0 Bulk=0',
  "Explorer's Clothing":'Weight=0 AC=0 Dex=5 Skill=0 Speed=0 Str=0 Bulk=.1',
  'Padded':'Weight=1 AC=1 Dex=3 Skill=0 Speed=0 Str=10 Bulk=.1',
  'Leather':'Weight=1 AC=1 Dex=4 Skill=1 Speed=0 Str=10 Bulk=1',
  'Studded Leather':'Weight=1 AC=2 Dex=3 Skill=1 Speed=0 Str=12 Bulk=1',
  'Chain Shirt':'Weight=1 AC=2 Dex=3 Skill=1 Speed=0 Str=12 Bulk=1',
  'Hide':'Weight=2 AC=3 Dex=2 Skill=2 Speed=5 Str=14 Bulk=2',
  'Scale Mail':'Weight=2 AC=3 Dex=2 Skill=2 Speed=5 Str=14 Bulk=2',
  'Chain Mail':'Weight=2 AC=4 Dex=1 Skill=2 Speed=5 Str=16 Bulk=2',
  'Breastplate':'Weight=2 AC=4 Dex=1 Skill=2 Speed=5 Str=16 Bulk=2',
  'Splint Mail':'Weight=3 AC=5 Dex=1 Skill=3 Speed=10 Str=16 Bulk=3',
  'Half Plate':'Weight=3 AC=5 Dex=1 Skill=3 Speed=10 Str=16 Bulk=3',
  'Full Plate':'Weight=3 AC=6 Dex=0 Skill=3 Speed=10 Str=18 Bulk=4'
};
Pathfinder2E.BACKGROUNDS = {
  // TODO
  'Acolyte':
    'Ability=intelligence,wisdom ' +
    'Skill=Religion,"Scribing Lore" ' +
    'Feat="Student Of The Cannon"',
  'Acrobat':
    'Ability=dexterity,strength ' +
    'Skill=Acrobatics,"Circus Lore" ' +
    'Feat="Steady Balance"',
  'Animal Whisperer':
    'Ability=charisma,wisdom ' +
    'Skill=Nature,"Terrain Lore" ' + // TODO
    'Feat="Train Animal"',
  'Artisan':
    'Ability=intelligence,strength ' +
    'Skill=Crafting,"Guild Lore" ' +
    'Feat="Specialty Crafting"',
  'Artist':
    'Ability=charisma,dexterity ' +
    'Skill=Crafting,"Art Lore" ' +
    'Feat="Specialty Crafting"',
  'Barkeep':
    'Ability=charisma,constitution ' +
    'Skill=Diplomacy,"Alcohol Lore" ' +
    'Feat=Hobnobber',
  'Barrister':
    'Ability=charisma,intelligence ' +
    'Skill=Diplomacy,"Legal Lore" ' +
    'Feat="Group Impression"',
  'Bounty Hunter':
    'Ability=strength,wisdom ' +
    'Skill=Survival,"Legal Lore" ' +
    'Feat="Experienced Tracker"',
  'Charlatan':
    'Ability=charisma,intelligence ' +
    'Skill=Deception,"Underworld Lore" ' +
    'Feat="Charming Liar"',
  'Criminal':
    'Ability=dexterity,intelligence ' +
    'Skill=Stealth,"Underworld Lore" ' +
    'Feat="Experienced Smuggler"',
  'Detective':
    'Ability=intelligence,wisdom ' +
    'Skill=Society,"Underworld Lore" ' +
    'Feat=Streetwise',
  'Emissary':
    'Ability=charisma,intelligence ' +
    'Skill=Society,"City Lore" ' + // TODO
    'Feat=Multilingual',
  'Entertainer':
    'Ability=charisma,dexterity ' +
    'Skill=Performance,"Theater Lore" ' +
    'Feat="Fascinating Performance"',
  'Farmhand':
    'Ability=constitution,wisdom ' +
    'Skill=Athletics,"Farming Lore" ' +
    'Feat="Assurance (Athletics)"',
  'Field Medic':
    'Ability=constitution,wisdom ' +
    'Skill=Medicine,"Warfare Lore" ' +
    'Feat="Battle Medic"',
  'Fortune Teller':
    'Ability=charisma,intelligence ' +
    'Skill=Occultism,"Fortune-Telling Lore" ' +
    'Feat="Oddity Identification"',
  'Gambler':
    'Ability=charisma,dexterity ' +
    'Skill=Deception,"Games Lore" ' +
    'Feat="Lie To Me"',
  'Gladiator':
    'Ability=charisma,strength ' +
    'Skill=Performance,"Gladitorial Lore" ' +
    'Feat="Impressive Performance"',
  'Guard':
    'Ability=charisma,strength ' +
    'Skill=Intimidation,"Legal Lore" ' +
    'Feat="Quick Coercion"',
  'Herbalist':
    'Ability=constitution,wisdom ' +
    'Skill=Nature,"Herbalism Lore" ' +
    'Feat="Natural Medicine"',
  'Hermit':
    'Ability=constitution,intelligence ' +
    'Skill=Nature,"Terrain Lore" ' + // TODO
    'Feat="Dubious Knowledge"',
  'Hunter':
    'Ability=dexterity,wisdom ' +
    'Skill=Survival,"Tanning Lore" ' +
    'Feat="Survey Wildlife"',
  'Laborer':
    'Ability=constitution,strength ' +
    'Skill=Atheletics,"Labor Lore" ' +
    'Feat="Hefty Hauler"',
  'Martial Disciple':
    'Ability=dexterity,strength ' +
    'Skill=Acrobatics,"Warfare Lore" ' + // TODO
    'Feat="Cat Fall"', // TODO
  'Merchant':
    'Ability=charisma,intelligence ' +
    'Skill=Diplomacy,"Mercantile Lore" ' +
    'Feat="Bargain Hunter"',
  'Miner':
    'Ability=strength,wisdom ' +
    'Skill=Survival,"Mining Lore" ' +
    'Feat="Terrain Expertise (Underground)"',
  'Noble':
    'Ability=charisma,intelligence' +
    'Skill=Society,"Heraldry Lore" ' +
    'Feat="Courtly Graces"',
  'Nomad':
    'Ability=constitution,wisdom ' +
    'Skill=Survival,"Terrain Lore" ' + // TODO
    'Feat="Assurance (Survival)"',
  'Prisoner':
    'Ability=constitution,strength ' +
    'Skill=Stealth,"Underworld Lore" ' +
    'Feat="Experienced Smuggler"',
  'Sailor':
    'Ability=dexterity,strength ' +
    'Skill=Athletics,"Sailing Lore" ' +
    'Feat="Underwater Marauder"',
  'Scholar':
    'Ability=intelligence,wisdom ' +
    'Skill=Arcana,"Academia Lore" ' + // TODO
    'Feat="Assurance (Arcana)"', // TODO
  'Scout':
    'Ability=dexterity,wisdom ' +
    'Skill=Survival,"Terrain Lore" ' + // TODO
    'Feat="Forager"',
  'Street Urchin':
    'Ability=constitution,dexterity ' +
    'Skill=Thieving,"City Lore" ' + // TODO
    'Feat=Pickpocket',
  'Tinker':
    'Ability=dexterity,intelligence ' +
    'Skill=Crafting,"Engineering Lore" ' +
    'Feat="Specialty Crafting"',
  'Warrior':
    'Ability=constitution,strength ' +
    'Skill=Intimidation,"Warfare Lore" ' +
    'Feat="Intimidating Glare"'
};
Pathfinder2E.CLASSES = {
  // TODO
  'Alchemist':
    'Ability=intelligence HitPoints=8',
  'Barbarian':
    'Ability=strength HitPoints=12',
  'Bard':
    'Ability=charisma HitPoints=8',
  'Champion':
    'Ability=strength,dexterity HitPoints=10',
  'Cleric':
    'Ability=wisdom HitPoints=8',
  'Druid':
    'Ability=wisdom HitPoints=8',
  'Fighter':
    'Ability=strength,dexterity HitPoints=10',
  'Monk':
    'Ability=strength,dexterity HitPoints=10',
  'Ranger':
    'Ability=strength,dexterity HitPoints=10',
  'Rogue':
    'Ability=dexterity HitPoints=8',
  'Sorcerer':
    'Ability=charisma HitPoints=6',
  'Wizard':
    'Ability=intelligence HitPoints=6'
};
Pathfinder2E.DEITIES = {
  'None':'',
  'Abadar':
    'Alignment=LN Font=Harm,Heal Skill=Society Weapon=Crossbow ' +
    'Domain=Cities,Earth,Travel,Wealth ' +
    'Spells="1:Illusory Object",4:Creation,"7:agnificent Mansion"',
  'Asmodeus':
    'Alignment=LE Font=Harm Skill=Deception Weapon=Mace ' +
    'Domain=Confidence,Fire,Trickery,Tyranny ' +
    'Spells=1:Charm,4:Suggestion,6:Mislead',
  'Calistra':
    'Alignment=CN Font=Harm,Heal Skill=Deception Weapon=Whip ' +
    'Domain=Pain,Passion,Secrecy,Trickery ' +
    'Spells=1:Charm,3:Entrall,6:Mislead',
  'Cayden Cailean':
    'Alignment=CG Font=Heal Skill=Athletics Weapon=Rapier ' +
    'Domain=Cities,Freedom,Indulgence,Might ' +
    'Spells="1:Fleet Step","2:Touch Of Idiocy",5:Hallucination',
  'Desna':
    'Alignment=CG Font=Heal Skill=Acrobatics Weapon=Starknife ' +
    'Domain=Dreams,Luck,Moon,Travel ' +
    'Spells=1:Sleep,"3:Dream Message","6:Dreaming Potential"',
  'Erastil':
    'Alignment=LG Font=Heal Skill=Survival Weapon=Longbow ' +
    'Domain=Earth,Family,Nature,Wealth ' +
    'Spells="1:True Strike","3:Wall Of Thorns","5:Tree Stride"',
  'Gorum':
    'Alignment=CN Font=Harm,Heal Skill=Athletics Weapon=Greatsword ' +
    'Domain=Confidence,Destruction,Might,Zeal ' +
    'Spells="1:True Strike",2:Enlarge,"4:Weapon Storm"',
  'Gozreh':
    'Alignment=N Font=Heal Skill=Survival Weapon=trident ' +
    'Domain=Air,Nature,Travel,Water ' +
    'Spells="1:Gust Of Wind","3:Lightning Bolt","5:Control Water"',
  'Iomedae':
    'Alignment=LG Font=Heal Skill=Intimidation Weapon=Longsword ' +
    'Domain=Confidence,Might,Truth,Zeal ' +
    'Spells="1:True Strike","2:See Invisibility","5:Fire Shield"',
  'Irori':
    'Alignment=LN Font=Harm,Heal Skill=Athletics Weapon=Fist ' +
    'Domain=Knowledge,Might,Perfection,Truth ' +
    'Spells=1:Jump,3:Haste,4:Stoneskin',
  'Lamashtu':
    'Alignment=CE Font=Harm,Heal Skill=Survival Weapon=Falchion ' +
    'Domain=Family,Might,Nightmares,Trickery ' +
    'Spells="1:Magic Fang","2:Animal Form",4:Nightmare',
  'Nethys':
    'Alignment=N Font=Harm,Heal Skill=Arcana Weapon=Staff ' +
    'Domain=Destruction,Knowledge,Magic,Protection ' +
    'Spells=' +
      '"1:Magic Missile","2:Magic Mouth",3:Levitate,4:Blink,' +
      '"5:Prying Eye","6:Wall Of Force","7:Warp Mind",8:Maze,9:Destruction',
  'Norgorber':
    'Alignment=NE Font=Harm Skill=Stealth Weapon=Shortsword ' +
    'Domain=Death,Secrecy,Trickery,Wealth ' +
    'Spells="1:Illusory Disguise",2:Invisibility,"4:Phantasmal Killer"',
  'Pharasma':
    'Alignment=N Font=Heal Skill=Medicine Weapon=Dagger ' +
    'Domain=Death,Fate,Healing,Knowledge ' +
    'Spells=1:Mindlink,"3:Ghostly Weapon","4:Phantasmal Killer"',
  'Rovagug':
    'Alignment=CE Font=Harm Skill=Athletics Weapon=Greataxe ' +
    'Domain=Air,Destruction,Earth,Zeal ' +
    'Spells="1:Burning Hands",2:Enlarge,6:Disintegrate',
  'Sarenrae':
    'Alignment=NG Font=Heal Skill=Medicine Weapon=Scimitar ' +
    'Domain=Fire,Healing,Sun,Truth ' +
    'Spells="1:Burning Hands",3:Fireball,"4:Wall Of Fire"',
  'Shelyn':
    'Alignment=NG Font=Heal Skill=Crafting,Performance Weapon=Glaive ' +
    'Domain=Creation,Family,Passion,Protection ' +
    'Spells="1:Color Spray",3:Enthrall,4:Creation',
  'Torag':
    'Alignment=LG Font=Heal Skill=Crafting Weapon=Warhammer ' +
    'Domain=Creation,Earth,Family,Protection ' +
    'Spells=1:Mindlink,3:Earthbind,4:Creation',
  'Urgathoa':
    'Alignment=NE Font=Harm Skill=Intimidation Weapon=Scythe ' +
    'Domain=Indulgence,Magic,Might,Undeath ' +
    'Spells="1:Goblin Pox","2:False Life","7:Mask Of Terror"',
  'Zon-Kuthon':
    'Alignment=LE Font=Harm Skill=Intimidation Weapon="Spiked Chain" ' +
    'Domain=Ambition,Darkness,Destruction,Pain ' +
    'Spells="1:Phantom Pain","3:Wall Of Thorns","5:Shadow Walk"',
};
Pathfinder2E.FEATS = {
  // TODO
  // Ancestry
  'Dwarven Lore':'Type=Dwarf Require="dwarfLevel >= 1"',
  'Dwarven Weapon Familiarity':'Type=Dwarf Require="dwarfLevel >= 1"',
  'Rock Runner':'Type=Dwarf Require="dwarfLevel >= 1"',
  'Stonecunning':'Type=Dwarf Require="dwarfLevel >= 1"',
  'Unburdened Iron':'Type=Dwarf Require="dwarfLevel >= 1"',
  'Vengeful Hatred':'Type=Dwarf Require="dwarfLevel >= 1"',
  'Boulder Roll':'Type=Dwarf Require="dwarfLevel >= 5","features.Rock Runner"',
  'Dwarven Weapon Cunning':'Type=Dwarf Require="dwarfLevel >= 5","features.Dwarven Weapon Familiarity"',
  "Mountain's Stoutness":'Type=Dwarf Require="dwarfLevel >= 9"',
  'Stonewalker':'Type=Dwarf Require="dwarfLevel >= 9"',
  'Dwarven Weapon Expertise':'Type=Dwarf Require="dwarfLevel >= 13","features.Dwarven Weapon Familiarity"',
  'Ancestral Longevity':'Type=Elf Require="elfLevel >= 1","age >= 100"',
  'Elven Lore':'Type=Elf Require="elfLevel >= 1"',
  'Elven Weapon Familiarity':'Type=Elf Require="elfLevel >= 1"',
  'Forlorn':'Type=Elf Require="elfLevel >= 1"',
  'Nimble Elf':'Type=Elf Require="elfLevel >= 1"',
  'Otherworldly Magic':'Type=Elf Require="elfLevel >= 1"',
  'Unwavering Mien':'Type=Elf Require="elfLevel >= 1"',
  'Ageless Patience':'Type=Elf Require="elfLevel >= 5"',
  'Elven Weapon Elegance':'Type=Elf Require="elfLevel >= 5","features.Elven Weapon Familiarity"',
  'Elf Step':'Type=Elf Require="elfLevel >= 9"',
  'Expert Longevity':'Type=Elf Require="elfLevel >= 9","features.Ancestral Longevity"',
  'Universal Longevity':'Type=Elf Require="elfLevel >= 13","features.Expert Longevity"',
  'Elven Weapon Expertise':'Type=Elf Require="elfLevel >= 13","features.Elven Weapon Familiarity"',
  'Animal Accomplice':'Type=Gnome Require="gnomeLevel >= 1"',
  'Burrow Elocutionist':'Type=Gnome Require="gnomeLevel >= 1"',
  'Fey Fellowship':'Type=Gnome Require="gnomeLevel >= 1"',
  'First World Magic':'Type=Gnome Require="gnomeLevel >= 1"',
  'Gnome Obsession':'Type=Gnome Require="gnomeLevel >= 1"',
  'Gnome Weapon Familiarity':'Type=Gnome Require="gnomeLevel >= 1"',
  'Illusion Sense':'Type=Gnome Require="gnomeLevel >= 1"',
  'Animal Elocutionist':'Type=Gnome Require="gnomeLevel >= 5","features.Burrow Elocutionist"',
  // TODO require "at least one innate spell from a snome heritage or ancestry feat that shares a tradition with at least on of your focus spells"
  'Energized Font':'Type=Gnome Require="gnomeLevel >= 5","features.Focus Pool"',
  'Gnome Weapon Innovator':'Type=Gnome Require="gnomeLevel >= 5","features.Gnome Weapon Familiarity"',
  // TODO require "at least one primal innate spell"
  'First World Adept':'Type=Gnome Require="gnomeLevel >= 9"',
  'Vivacious Conduit':'Type=Gnome Require="gnomeLevel >= 9"',
  'Gnome Weapon Expertise':'Type=Gnome Require="gnomeLevel >= 13","features.Gnome Weapon Familiarity"',
  'Burn It!':'Type=Goblin Require="goblinLevel >= 1"',
  'City Scavenger':'Type=Goblin Require="goblinLevel >= 1"',
  'Goblin Lore':'Type=Goblin Require="goblinLevel >= 1"',
  'Goblin Scuttle':'Type=Goblin Require="goblinLevel >= 1"',
  'Goblin Song':'Type=Goblin Require="goblinLevel >= 1"',
  'Goblin Weapon Familiarity':'Type=Goblin Require="goblinLevel >= 1"',
  'Junk Tinker':'Type=Goblin Require="goblinLevel >= 1"',
  'Rough Rider':'Type=Goblin Require="goblinLevel >= 1"',
  'Very Sneaky':'Type=Goblin Require="goblinLevel >= 1"',
  'Goblin Weapon Frenzy':'Type=Goblin Require="goblinLevel >= 5","features.Goblin Weapon Familiarity"',
  'Cave Climber':'Type=Goblin Require="goblinLevel >= 9"',
  'Skittering Scuttle':'Type=Goblin Require="goblinLevel >= 9","features.Goblin Scuttle"',
  'Goblin Weapon Expertise':'Type=Goblin Require="goblinLevel >= 13","features.Goblin Weapon Familiarity"',
  'Very, Very Sneaky':'Type=Goblin Require="goblinLevel >= 13","features.Very Sneaky"',
  'Distracting Shadows':'Type=Halfling Require="halflingLevel >= 1"',
  'Halfling Lore':'Type=Halfling Require="halflingLevel >= 1"',
  'Halfling Luck':'Type=Halfling Require="halflingLevel >= 1"',
  'Halfling Weapon Familiarity':'Type=Halfling Require="halflingLevel >= 1"',
  'Sure Feet':'Type=Halfling Require="halflingLevel >= 1"',
  'Titan Slinger':'Type=Halfling Require="halflingLevel >= 1"',
  'Unfettered Halfling':'Type=Halfling Require="halflingLevel >= 1"',
  'Watchful Halfling':'Type=Halfling Require="halflingLevel >= 1"',
  'Cultural Adaptability':'Type=Halfling Require="halflingLevel >= 5"',
  'Halfling Weapon Trickster':'Type=Halfling Require="halflingLevel >= 5","features.Halfling Weapon Familiarity"',
  'Guiding Luck':'Type=Halfling Require="halflingLevel >= 9","features.Halfling Luck"',
  'Irrepressible':'Type=Halfling Require="halflingLevel >= 9"',
  'Ceaseless Shadows':'Type=Halfling Require="halflingLevel >= 13","features.Distracting Shadows"',
  'Halfling Weapon Expertise':'Type=Halfling Require="halflingLevel >= 13","features.Halfling Weapon Familiarity"',
  // TODO require "spellcasting class feature"
  'Adapted Cantrip':'Type=Human Require="humanLevel >= 1"',
  'Cooperative Nature':'Type=Human Require="humanLevel >= 1"',
  'General Training':'Type=Human Require="humanLevel >= 1"',
  'Haughty Obstinacy':'Type=Human Require="humanLevel >= 1"',
  'Natural Ambition':'Type=Human Require="humanLevel >= 1"',
  'Natural Skill':'Type=Human Require="humanLevel >= 1"',
  'Unconventional Weaponry':'Type=Human Require="humanLevel >= 1"',
  // TODO require "can cast 3rd level spells"
  'Adaptive Adept':'Type=Human Require="humanLevel >= 5","features.Adapted Cantrip"',
  'Clever Improvisation':'Type=Human Require="humanLevel >= 5"',
  'Cooperative Soul':'Type=Human Require="humanLevel >= 9","features.Cooperative Nature"',
  'Incredible Improvisation':'Type=Human Require="humanLevel >= 9","features.Clever Improvisation"',
  'Multitalented':'Type=Human Require="humanLevel >= 9"',
  // TODO require "trained in the weapon you chose for Unconventional Weaponry"
  'Unconventional Expertise':'Type=Human Require="humanLevel >= 13","features.Unconventional Weaponry"',
  'Elf Atavism':'Type=Human Require="humanLevel >= 1",features.Half-Elf',
  'Inspire Imitation':'Type=Human Require="humanLevel >= 5",features.Half-Elf',
  'Supernatural Charm':'Type=Human Require="humanLevel >= 5",features.Half-Elf',
  'Monstrous Peacemaker':'Type=Human Require="humanLevel >= 1",features.Half-Orc',
  'Orc Ferocity':'Type=Human Require="humanLevel >= 1",features.Half-Orc',
  'Orc Sight':'Type=Human Require="humanLevel >= 1",features.Half-Orc,"features.Low-Light Vision"',
  'Orc Superstition':'Type=Human Require="humanLevel >= 1",features.Half-Orc',
  'Orc Weapon Familiarity':'Type=Human Require="humanLevel >= 1",features.Half-Orc',
  'Orc Weapon Carnage':'Type=Human Require="humanLevel >= 5",features.Half-Orc,"features.Orc Weapon Familiarity"',
  'Victorious Vigor':'Type=Human Require="humanLevel >= 5",features.Half-Orc',
  'Pervasive Superstition':'Type=Human Require="humanLevel >= 9",features.Half-Orc,"features.Orc Superstition"',
  'Incredible Ferocity':'Type=Human Require="humanLevel >= 13",features.Half-Orc,"features.Orc Ferocity"',
  'Orc Weapon Expertise':'Type=Human Require="humanLevel >= 13",features.Half-Orc,"features.Orc Weapon Familiarity"'
};
Pathfinder2E.FEATURES = {
  // TODO
};
SRD35.GOODIES = {
  'Armor':
    'Pattern="([-+]\\d).*(?:armor(?:\\s+class)?|AC)|(?:armor(?:\\s+class)?|AC)\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Charisma':
    'Pattern="([-+]\\d)\\s+charisma|charisma\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=charisma ' +
    'Section=ability Note="%V Charisma"',
  'Constitution':
    'Pattern="([-+]\\d)\\s+constitution|constitution\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=constitution ' +
    'Section=ability Note="%V Constitution"',
  'Dexterity':
    'Pattern="([-+]\\d)\\s+dexterity|dexterity\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=dexterity ' +
    'Section=ability Note="%V Dexterity"',
  'Fighter Feat Count':
    'Pattern="([-+]\\d)\\s+fighter\\s+feat|fighter\\s+feat\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=featCount.Fighter ' +
    'Section=feature Note="%V Fighter Feat"',
  'Fortitude':
    'Pattern="([-+]\\d)\\s+fortitude\\s+save|fortitude\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=save.Fortitude ' +
    'Section=save Note="%V Fortitude"',
  'General Feat Count':
    'Pattern="([-+]\\d)\\s+general\\s+feat|general\\s+feat\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=featCount.General ' +
    'Section=feature Note="%V General Feat"',
  'Initiative':
    'Pattern="([-+]\\d)\\s+initiative|initiative\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=initiative ' +
    'Section=combat Note="%V Initiative"',
  'Intelligence':
    'Pattern="([-+]\\d)\\s+intelligence|intelligence\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=intelligence ' +
    'Section=ability Note="%V Intelligence"',
  'Protection':
    'Pattern="([-+]\\d).*protection|protection\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Reflex':
    'Pattern="([-+]\\d)\\s+reflex\\s+save|reflex\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=save.Reflex ' +
    'Section=save Note="%V Reflex"',
  'Shield':
    'Pattern="([-+]\\d).*\\s+shield|shield\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Speed':
    'Pattern="([-+]\\d).*\\s+speed|speed\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=speed ' +
    'Section=ability Note="%V Speed"',
  'Strength':
    'Pattern="([-+]\\d)\\s+strength|strength\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=strength ' +
    'Section=ability Note="%V Strength"',
  'Will':
    'Pattern="([-+]\\d)\\s+will\\s+save|will\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=save.Will ' +
    'Section=save Note="%V Will"',
  'Wisdom':
    'Pattern="([-+]\\d)\\s+wisdom|wisdom\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=wisdom ' +
    'Section=ability Note="%V Wisdom"',
  'Wizard Feat Count':
    'Pattern="([-+]\\d)\\s+wizard\\s+feat|wizard\\s+feat\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=featCount.Wizard ' +
    'Section=feature Note="%V Wizard Feat"'
};
Pathfinder2E.LANGUAGES = {
  'Common':'',
  'Draconic':'',
  'Dwarven':'',
  'Elven':'',
  'Gnomish':'',
  'Goblin':'',
  'Halfling':'',
  'Jotun':'',
  'Orcish':'',
  'Sylvan':'',
  'Undercommon':'',
  'Abyssal':'',
  'Aklo':'',
  'Aquan':'',
  'Auran':'',
  'Celestial':'',
  'Gnoll':'',
  'Ignan':'',
  'Infernal':'',
  'Necril':'',
  'Shadowtounge':'',
  'Terran':''
};
Pathfinder2E.PATHS = {
  // TODO
};
Pathfinder2E.SCHOOLS = {
  'Abjuration':'',
  'Conjuration':'',
  'Divination':'',
  'Enchantment':'',
  'Evocation':'',
  'Illusion':'',
  'Necromancy':'',
  'Transmutation':''
};
Pathfinder2E.SHIELDS = {
  'None':'AC=0 Speed=0 Bulk=0',
  'Buckler':'AC=1 Speed=0 Bulk=1',
  'Wooden':'AC=2 Speed=0 Bulk=1',
  'Steel':'AC=2 Speed=0 Bulk=1',
  'Tower':'AC=2 Speed=5 Bulk=4'
};
Pathfinder2E.SKILLS = {
  'Acrobatics':'Ability=dexterity',
  'Animal Handling':'Ability=wisdom',
  'Arcana':'Ability=intelligence',
  'Athletics':'Ability=strength',
  'Deception':'Ability=charisma',
  'History':'Ability=intelligence',
  'Insight':'Ability=wisdom',
  'Intimidation':'Ability=charisma',
  'Investigation':'Ability=intelligence',
  'Medicine':'Ability=wisdom',
  'Nature':'Ability=intelligence',
  'Perception':'Ability=wisdom',
  'Performance':'Ability=charisma',
  'Persuasion':'Ability=charisma',
  'Religion':'Ability=intelligence',
  'Sleight Of Hand':'Ability=dexterity',
  'Stealth':'Ability=dexterity',
  'Survival':'Ability=wisdom'
};
Pathfinder2E.SPELLS = {
  // TODO
};
Pathfinder2E.WEAPONS = {
  'Fist':'Category=0 Damage=d4 Bulk=0',
  'Club':'Category=1 Damage=d6 Bulk=1 Range=10',
  'Dagger':'Category=1 Damage=d4 Bulk=.1 Range=10',
  'Gauntlet':'Category=1 Damage=d4 Bulk=.1',
  'Light Mace':'Category=1 Damage=d4 Bulk=.1',
  'Longspear':'Category=1 Damage=d8 Bulk=2',
  'Mace':'Category=1 Damage=d6 Bulk=1',
  'Morningstar':'Category=1 Damage=d6 Bulk=1',
  'Sickle':'Category=1 Damage=d4 Bulk=.1',
  'Spear':'Category=1 Damage=d6 Bulk=1 Range=20',
  'Spiked Gauntlet':'Category=1 Damage=d4 Bulk=.1',
  'Staff':'Category=1 Damage=d4 Bulk=1',
  'Clan Dagger':'Category=1 Damage=d4 Bulk=.1',
  'Katar':'Category=1 Damage=d4 Bulk=.1 Crit=+d6',
  'Bastard Sword':'Category=2 Damage=d8 Bulk=1',
  'Battle Axe':'Category=2 Damage=d8 Bulk=1',
  'Bo Staff':'Category=2 Damage=d8 Bulk=2',
  'Falchion':'Category=2 Damage=d10 Bulk=2',
  'Flail':'Category=2 Damage=d6 Bulk=1',
  'Glaive':'Category=2 Damage=d8 Bulk=2 Crit=+d8',
  'Greataxe':'Category=2 Damage=d12 Bulk=2',
  'Greatclub':'Category=2 Damage=d10 Bulk=2',
  'Greatpick':'Category=2 Damage=d10 Bulk=2 Crit=d12',
  'Greatsword':'Category=2 Damage=d12 Bulk=2',
  'Guisarme':'Category=2 Damage=d10 Bulk=2',
  'Halberd':'Category=2 Damage=d10 Bulk=2',
  'Hatchet':'Category=2 Damage=d6 Bulk=.1 Range=10',
  'Lance':'Category=2 Damage=d8 Bulk=2 Crit=+d8',
  'Light Hammer':'Category=2 Damage=d6 Bulk=.1 Range=20',
  'Light Pick':'Category=2 Damage=d4 Bulk=.1 Crit=d8',
  'Longsword':'Category=2 Damage=d8 Bulk=1',
  'Main-gauche':'Category=2 Damage=d4 Bulk=.1',
  'Maul':'Category=2 Damage=d12 Bulk=2',
  'Pick':'Category=2 Damage=d6 Bulk=1 Crit=d10',
  'Ranseur':'Category=2 Damage=d10 Bulk=2',
  'Rapier':'Category=2 Damage=d6 Bulk=1 Crit=+d8',
  'Sap':'Category=2 Damage=d6 Bulk=.1',
  'Scimitar':'Category=2 Damage=d6 Bulk=1',
  'Scythe':'Category=2 Damage=d10 Bulk=2 Crit=+d10',
  'Shortsword':'Category=2 Damage=d6 Bulk=.1',
  'Starknife':'Category=2 Damage=d4 Bulk=.1 Range=20 Crit=+d6',
  'Trident':'Category=2 Damage=d8 Bulk=1 Range=20',
  'War Flail':'Category=2 Damage=d10 Bulk=2',
  'Warhammer':'Category=2 Damage=d8 Bulk=1',
  'Whip':'Category=2 Damage=d4 Bulk=1',
  'Dogslicer':'Category=2 Damage=d6 Bulk=.1',
  'Elven Curve Blade':'Category=2 Damage=d8 Bulk=2',
  "Filcher's Fork":'Category=2 Damage=d4 Bulk=.1 Range=20 Crit=+d6',
  'Gnome Hooked Hammer':'Category=2 Damage=d6 Bulk=1',
  'Horsechopper':'Category=2 Damage=d8 Bulk=2',
  'Kama':'Category=2 Damage=d6 Bulk=.1',
  'Katana':'Category=2 Damage=d6 Bulk=1 Crit=+d8',
  'Kukri':'Category=2 Damage=d6 Bulk=.1',
  'Nunchaku':'Category=2 Damage=d6 Bulk=.1',
  'Orc Knuckle Dragger':'Category=2 Damage=d6 Bulk=.1',
  'Sai':'Category=2 Damage=d4 Bulk=.1',
  'Spiked Chain':'Category=2 Damage=d8 Bulk=1',
  'Temple Sword':'Category=2 Damage=d8 Bulk=1',
  'Dwarven Waraxe':'Category=2 Damage=d8 Bulk=2',
  'Gnome Flickmace':'Category=2 Damage=d8 Bulk=2',
  'Orc Necksplitter':'Category=2 Damage=d8 Bulk=1',
  'Sawtooth Saber':'Category=0 Damage=d6 Bulk=.1',
  'Blowgun':'Category=1 Damage=d1 Bulk=.1 Range=20',
  'Crossbow':'Category=1 Damage=d8 Bulk=1 Range=120',
  'Dart':'Category=1 Damage=d4 Bulk=.1 Range=20',
  'Hand Crossbow':'Category=1 Damage=d6 Bulk=.1 Range=60',
  'Heavy Crossbow':'Category=1 Damage=d10 Bulk=2 Range=120',
  'Javelin':'Category=1 Damage=d6 Bulk=.1 Range=30',
  'Sling':'Category=1 Damage=d6 Bulk=.1 Range=50',
  'Composite Longbow':'Category=2 Damage=d8 Bulk=2 Range=100 Crit=+d10',
  'Composite Shortbow':'Category=2 Damage=d6 Bulk=1 Range=60 Crit=+d10',
  'Longbow':'Category=2 Damage=d8 Bulk=2 Range=100 Crit=+d10',
  'Shortbow':'Category=2 Damage=d6 Bulk=1 Range=60 Crit=+d10',
  'Halfling Sling Staff':'Category=2 Damage=d10 Bulk=1 Range=80',
  'Shuriken':'Category=2 Damage=d4 Bulk=0 Range=20'
};

/* Defines the rules related to character abilities. */
Pathfinder2E.abilityRules = function(rules, abilities) {

  for(var ability in abilities) {
    ability = ability.toLowerCase();
    rules.defineChoice('notes', ability + ':%V (%1)');
    rules.defineRule(ability, ability + 'Adjust', '+', null);
    rules.defineRule
      (ability + 'Modifier', ability, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule(ability + '.1', ability + 'Modifier', '=', null);
    rules.defineRule(ability, '', 'v', '20');
  }
  rules.defineRule('speed',
    '', '=', '25'
  );

};

/* Defines the rules related to combat. */
Pathfinder2E.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable
    (armors, ['Weight', 'AC', 'Dex', 'Skill', 'Speed', 'Str', 'Bulk']);
  QuilvynUtils.checkAttrTable(shields, ['AC', 'Speed', 'Bulk']);
  QuilvynUtils.checkAttrTable(weapons, ['Category', 'Damage', 'Bulk', 'Range', 'Crit']);

  for(var armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(var shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(var weapon in weapons) {
    var pattern = weapon.replace(/  */g, '\\s+');
    var prefix =
      weapon.charAt(0).toLowerCase() + weapon.substring(1).replaceAll(' ', '');
    rules.choiceRules(rules, 'Goody', weapon,
      // To avoid triggering additional weapons with a common suffix (e.g.,
      // "* punching dagger +2" also makes regular dagger +2), require that
      // weapon goodies with a trailing value have no preceding word or be
      // enclosed in parentheses.
      'Pattern="([-+]\\d)\\s+' + pattern + '|(?:^\\W*|\\()' + pattern + '\\s+([-+]\\d)" ' +
      'Effect=add ' +
      'Attribute=' + prefix + 'AttackModifier,' + prefix + 'DamageModifier ' +
      'Value="$1 || $2" ' +
      'Section=combat Note="%V Attack and damage"'
    );
    rules.choiceRules(rules, 'Weapon', weapon, weapons[weapon]);
  }

};

/* Defines rules related to basic character identity. */
Pathfinder2E.identityRules = function(
  rules, alignments, ancestries, backgrounds, classes, deities, paths
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable(ancestries, ['Require', 'Features', 'Selectables', 'Boost', 'Flaw', 'HitPoints', 'Languages']);
  QuilvynUtils.checkAttrTable(backgrounds, ['Ability', 'Skill', 'Feat']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitPoints', 'Ability', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Font', 'Skill', 'Spells', 'Weapon']);
  QuilvynUtils.checkAttrTable
    (paths, ['Group', 'Level', 'Features', 'Selectables', 'SpellAbility', 'SpellSlots']);

  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(var ancestry in ancestries) {
    rules.choiceRules(rules, 'Ancestry', ancestry, ancestries[ancestry]);
  }
  for(var background in backgrounds) {
    rules.choiceRules(rules, 'Background', background, backgrounds[background]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(var path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
  }

};

/* Defines rules related to magic use. */
Pathfinder2E.magicRules = function(rules, schools, spells) {

  QuilvynUtils.checkAttrTable(schools, ['Features']);
  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Group', 'Level', 'Description']);

  for(var school in schools) {
    rules.choiceRules(rules, 'School', school, schools[school]);
  }
  for(var spell in spells) {
    rules.choiceRules(rules, 'Spell', spell, spells[spell]);
  }

};

/* Defines rules related to character aptitudes. */
Pathfinder2E.talentRules = function(
  rules, feats, features, goodies, languages, skills)
{

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Class']);

  for(var feat in feats) {
    rules.choiceRules(rules, 'Feat', feat, feats[feat]);
  }
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var goody in goodies) {
    rules.choiceRules(rules, 'Goody', goody, goodies[goody]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var skill in skills) {
    rules.choiceRules(rules, 'Skill', skill, skills[skill]);
    rules.choiceRules(rules, 'Goody', skill,
      'Pattern="([-+]\\d).*\\s+' + skill + '\\s+Skill|' + skill + '\\s+skill\\s+([-+]\\d)"' +
      'Effect=add ' +
      'Value="$1 || $2" ' +
      'Attribute="skills.' + skill + '" ' +
      'Section=skill Note="%V ' + skill + '"'
    );
    rules.choiceRules(rules, 'Goody', skill + ' Proficiency',
      'Pattern="' + skill + '\\s+proficiency" ' +
      'Effect=set ' +
      'Attribute="skillProficiency.' + skill + '" ' +
      'Section=skill Note="Proficiency in ' + skill + '"'
    );
  }

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Pathfinder2E.choiceRules = function(rules, type, name, attrs) {
  // TODO
  if(type == 'Alignment')
    Pathfinder2E.alignmentRules(rules, name);
  else if(type == 'Ancestry')
    Pathfinder2E.ancestryRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Boost'),
      QuilvynUtils.getAttrValueArray(attrs, 'Flaw'),
      QuilvynUtils.getAttrValueArray(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
  else if(type == 'Background')
    Pathfinder2E.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Feat'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skill')
    );
  else if(type == 'Armor')
    Pathfinder2E.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Bulk'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Class') {
    Pathfinder2E.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Pathfinder2E.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Pathfinder2E.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValue(attrs, 'Sphere')
    );
  else if(type == 'Feat') {
    Pathfinder2E.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    Pathfinder2E.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    Pathfinder2E.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    SRD35.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    Pathfinder2E.languageRules(rules, name);
  else if(type == 'Path')
    Pathfinder2E.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder2E.SPELLS
    );
  else if(type == 'School')
    Pathfinder2E.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Shield')
    Pathfinder2E.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC')
    );
  else if(type == 'Skill')
    Pathfinder2E.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
  else if(type == 'Spell')
    Pathfinder2E.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Weapon')
    Pathfinder2E.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValueArray(attrs, 'Property'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature' && type != 'Path' && type != 'Spell') {
    type = type == 'Ancestry' ? 'ancestries' :
           type == 'Class' ? 'levels' :
           type == 'Deity' ? 'deities' :
           (type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
Pathfinder2E.alignmentRules = function(rules, name) {
  if(!name) {
    console.log('Empty alignment name');
    return;
  }
  // No rules pertain to alignment
};

/*
 * TODO
 */
Pathfinder2E.ancestryRules = function(
  rules, name, requires, features, selectables, boosts, flaws, languages,
  hitPoints,
) {

  if(!name) {
    console.log('Empty ancestry name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(boosts)) {
    console.log('Bad boosts list "' + selectables + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(flaws)) {
    console.log('Bad flaws list "' + selectables + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for ancestry ' + name);
    return;
  }

  var matchInfo;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var ancestryLevel = prefix + 'Level';

  rules.defineRule(ancestryLevel,
    'ancestry', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Ancestry', ancestryLevel, requires);

  Pathfinder2E.featureListRules(rules, features, name, ancestryLevel, false);
  Pathfinder2E.featureListRules(rules, selectables, name, ancestryLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule('languageCount', ancestryLevel, '=', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], ancestryLevel, '=', '1');
    }
  }

};

/*
 * TODO
 */
Pathfinder2E.armorRules = function(
  rules, name, ac, bulk, maxDex, skillPenalty, speedPenalty, minStr, weight
) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for armor ' + name);
    return;
  }
  if(bulk == '.1')
    bulk = .1;
  if(typeof bulk != 'number') {
    console.log('Bad bulk "' + bulk + '" for armor ' + name);
  }
  if(typeof maxDex != 'number') {
    console.log('Bad max dex "' + maxDex + '" for armor ' + name);
    return;
  }
  if(typeof speedPenalty != 'number') {
    console.log('Bad speed penalty "' + speedPenalty + '" for armor ' + name);
    return;
  }
  if(minStr != null && typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(weight == null ||
     !(weight + '').match(/^([0-3]|none|light|medium|heavy)$/i)) {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }

  if((weight + '').match(/^[0-3]$/))
    ; // empty
  else if(weight.match(/^none$/i))
    weight = 0;
  else if(weight.match(/^light$/i))
    weight = 1;
  else if(weight.match(/^medium$/i))
    weight = 2;
  else if(weight.match(/^heavy$/i))
    weight = 3;

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      bulk:{},
      dex:{},
      skill:{},
      speed:{},
      str:{},
      weight:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.bulk[name] = bulk;
  rules.armorStats.dex[name] = maxDex;
  rules.armorStats.skill[name] = skillPenalty;
  rules.armorStats.speed[name] = speedPenalty;
  rules.armorStats.str[name] = minStr;
  rules.armorStats.weight[name] = weight;

  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', QuilvynUtils.dictLit(rules.armorStats.ac) + '[source]'
  );
  rules.defineRule('armorStrRequirement',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.minStr) + '[source]'
  );
  rules.defineRule('armorWeight',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.weight) + '[source]'
  );
  rules.defineRule('bulk',
    'armor', '+=', QuilvynUtils.dictLit(rules.armorStats.bulk) + '[source]'
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', QuilvynUtils.dictLit(rules.armorStats.dex) + '[source]'
  );

};

/* TODO
 */
Pathfinder2E.backgroundRules = function(rules, name, ability, feat, skill) {

  var prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var backgroundLevel = prefix + 'Level';

  rules.defineRule(backgroundLevel,
    'background', '?', 'source == "' + name + '"',
    'level', '=', null
  );

};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points with each level advance. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. #spellAbility#, if specified, names the
 * ability for computing spell difficulty class. #spellSlots# lists the
 * number of spells per level per day that the class can cast, and #spells#
 * lists spells defined by the class. #spellDict# is the dictionary of all
 * spells used to look up individual spell attributes.
 */
Pathfinder2E.classRules = function(
  rules, name, requires, abilities, hitPoints, features, selectables,
  languages, casterLevelArcane, casterLevelDivine, spellSlots
) {

  if(!name) {
    console.log('Empty class name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for class ' + name);
    return;
  }
  if(!Array.isArray(abilities)) {
    console.log('Bad abilities list "' + requires + '" for class ' + name);
    return;
  }
  if(typeof hitPoints != 'number') {
    console.log('Bad hitPoints "' + hitPoints + '" for class ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for class ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for class ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for class ' + name);
    return;
  }
  if(!Array.isArray(spellSlots)) {
    console.log('Bad spellSlots list "' + spellSlots + '" for class ' + name);
    return;
  }

  var classLevel = 'levels.' + name;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Class', classLevel, requires);

  Pathfinder2E.featureListRules(rules, features, name, classLevel, false);
  Pathfinder2E.featureListRules(rules, selectables, name, classLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0) {
    rules.defineRule('languageCount', classLevel, '+', languages.length);
    for(var i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], classLevel, '=', '1');
    }
  }

  rules.defineRule('featCount.General',
    'levels.' + name, '+=', 'source >= 19 ? 5 : Math.floor(source / 4)'
  );
  rules.defineRule('proficiencyBonus',
    'levels.' + name, '=', 'Math.floor((source + 7) / 4)'
  );

  if(spellSlots.length > 0) {
    var casterLevelExpr = casterLevelArcane || casterLevelDivine || classLevel;
    if(casterLevelExpr.match(new RegExp('\\b' + classLevel + '\\b', 'i'))) {
      rules.defineRule('casterLevels.' + name,
        classLevel, '=', casterLevelExpr.replace(new RegExp('\\b' + classLevel + '\\b', 'gi'), 'source')
      );
    } else {
      rules.defineRule('casterLevels.' + name,
        classLevel, '?', null,
        'level', '=', casterLevelExpr.replace(new RegExp('\\blevel\\b', 'gi'), 'source')
      );
    }
    if(casterLevelArcane)
      rules.defineRule('casterLevelArcane', 'casterLevels.' + name, '+=', null);
    if(casterLevelDivine)
      rules.defineRule('casterLevelDivine', 'casterLevels.' + name, '+=', null);
    QuilvynRules.spellSlotRules(rules, 'casterLevels.' + name, spellSlots);
    for(var j = 0; j < spellSlots.length; j++) {
      var spellTypeAndLevel = spellSlots[j].replace(/:.*/, '');
      var spellType = spellTypeAndLevel.replace(/\d+/, '');
      var spellLevel = spellTypeAndLevel.replace(spellType, '');
      var spellModifier = spellAbility + 'Modifier';
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellAttackModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellModifier, '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellModifier, '=', '8 + source',
        'proficiencyBonus', '+', null
      );
    }
  }

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Pathfinder2E.classRulesExtra = function(rules, name) {

  if(name == 'Barbarian') {

    rules.defineRule('abilityNotes.rage',
      'levels.Barbarian', '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
    );
    rules.defineRule('armorClass',
      'combatNotes.barbarianUnarmoredDefense.2', '+', null
    );
    rules.defineRule('combatNotes.brutalCritical',
      'levels.Barbarian', '=', 'Math.floor((source - 5) / 4)'
    );
    // Show Unarmored Defense note even if armor != None or conMod == 0
    rules.defineRule('combatNotes.barbarianUnarmoredDefense.1',
      'combatNotes.barbarianUnarmoredDefense', '?', null,
      'constitutionModifier', '=', null
    );
    rules.defineRule('combatNotes.barbarianUnarmoredDefense.2',
      'combatNotes.barbarianUnarmoredDefense', '?', null,
      'armor', '?', 'source == "None"',
      'combatNotes.barbarianUnarmoredDefense.1', '=', null
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Barbarian', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule('combatNotes.rage',
      'levels.Barbarian', '+=', 'source<3 ? 2 : source<6 ? 3 : source<12 ? 4 : source<17 ? 5 : source<20 ? 6 : "unlimited"'
    );
    rules.defineRule('combatNotes.rage.1',
      'levels.Barbarian', '+=', 'source<9 ? 2 : source<16 ? 3 : 4'
    );
    rules.defineRule('featureNotes.intimidatingPresence',
      'charismaModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('selectableFeatureCount.Barbarian',
      'levels.Barbarian', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('speed', 'abilityNotes.fastMovement', '+', '10');

  } else if(name == 'Bard') {

    rules.defineRule('abilityNotes.jackOfAllTrades',
      'proficiencyBonus', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.bardicInspiration',
      'levels.Bard', '=', '6 + Math.floor(source / 5) * 2'
    );
    rules.defineRule('magicNotes.bardicInspiration.1',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.magicalSecrets',
      'levels.Bard', '=', '2 * Math.floor((source - 6) / 4)'
    );
    rules.defineRule('magicNotes.songOfRest',
      'levels.Bard', '=', '6 + (source>=9 ? 2 * Math.floor((source-5)/4) : 0)'
    );
    rules.defineRule('selectableFeatureCount.Bard',
      'levels.Bard', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('skillNotes.bardExpertise',
      'levels.Bard', '=', 'source < 10 ? 2 : 4'
    );

  } else if(name == 'Cleric') {

    rules.defineRule('combatNotes.destroyUndead',
      'levels.Cleric', '=', 'source < 8 ? 0.5 : Math.floor((source - 5) / 3)'
    );
    rules.defineRule('combatNotes.divineStrike',
      'levels.Cleric', '=', 'source < 14 ? 1 : 2'
    );
    rules.defineRule('combatNotes.turnUndead',
      'wisdomModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('featureNotes.channelDivinity',
      'levels.Cleric', '=', 'source < 6 ? 1: source < 18 ? 2 : 3'
    );
    rules.defineRule('magicNotes.divineIntervention',
      'levels.Cleric', '=', 'source < 20 ? source : 100'
    );
    rules.defineRule
      ('magicNotes.preserveLife', 'levels.Cleric', '=', '5 * source');
    rules.defineRule
      ('selectableFeatureCount.Cleric', 'levels.Cleric', '=', '1');

  } else if(name == 'Druid') {

    rules.defineRule('magicNotes.wildShape.1',
      'levels.Druid', '=', 'source < 4 ? "1/4" : source < 8 ? "1/2" : "1"'
    );
    rules.defineRule('magicNotes.wildShape.2',
      'levels.Druid', '=', 'source < 4 ? " (land only)" : source < 8 ? " (non-flying)" : ""'
    );
    rules.defineRule('magicNotes.wildShape.3',
      'levels.Druid', '=', 'Math.floor(source /2)'
    );
    rules.defineRule('selectableFeatureCount.Druid',
      'levels.Druid', '=', 'source < 2 ? null : 1'
    );

    rules.defineRule("combatNotes.nature'sSanctuary",
      'wisdomModifier', '=', 'source + 8',
      'proficiencyBonus', '+', null
    );
    rules.defineRule('magicNotes.naturalRecovery',
      'levels.Druid', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('spellSlots.D0', 'magicNotes.bonusCantrip', '+=', '1');

  } else if(name == 'Fighter') {

    rules.defineRule('abilityNotes.remarkableAthlete',
      'proficiencyBonus', '=', 'Math.ceil(source / 2)'
    );
    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.archeryStyle', '+=', '2');
    rules.defineRule('combatNotes.actionSurge',
      'levels.Fighter', '=', 'source < 17 ? 1 : 2'
    );
    // Show Defense Style note even if armor == None
    rules.defineRule('combatNotes.defenseStyle.1',
      'combatNotes.defenseStyle', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Fighter', '+=', 'source < 5 ? null : source < 11 ? 1 : source < 20 ? 2 : 3'
    );
    rules.defineRule('combatNotes.secondWind', 'levels.Fighter', '=', null);
    rules.defineRule
      ('combatNotes.survivor', 'constitutionModifier', '=', '5 + source');
    rules.defineRule
      ('combatNotes.survivor.1', 'hitPoints', '=', 'Math.floor(source / 2)');
    rules.defineRule('featCount.General', 'fighterFeatBonus', '+', null);
    rules.defineRule('fighterFeatBonus',
      'levels.Fighter', '=', 'source < 6 ? null : source < 14 ? 1 : 2'
    );
    rules.defineRule('saveNotes.indomitable',
      'levels.Fighter', '=', 'source < 13 ? 1 : source < 17 ? 2 : 3'
    );
    rules.defineRule('selectableFeatureCount.Fighter',
      'levels.Fighter', '=', 'source < 3 ? 1 : 2',
      'combatNotes.additionalFightingStyle', '+', '1'
    );
    rules.defineRule
      ('skillNotes.remarkableAthlete', 'strengthModifier', '=', null);

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.improvedUnarmoredMovement',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"'
    );
    rules.defineRule('abilityNotes.slowFall', 'levels.Monk', '=', 'source * 5');
    // Show Unarmored Movement note properly even if armor != "None"
    rules.defineRule('abilityNotes.unarmoredMovement',
      'levels.Monk', '=', 'Math.floor((source + 6) / 4) * 5'
    );
    rules.defineRule('abilityNotes.unarmoredMovement.1',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      'abilityNotes.unarmoredMovement', '=', null
    );
    rules.defineRule
      ('armorClass', 'combatNotes.monkUnarmoredDefense.2', '+', null);
    rules.defineRule('combatNotes.deflectMissiles',
      'levels.Monk', '=', null,
      'dexterityModifier', '+', null
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Monk', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule('combatNotes.martialArts',
      'levels.Monk', '=', '4 + Math.floor(source / 5) * 2'
    );
    rules.defineRule('combatNotes.martialArts.1',
      'monkFeatures.Martial Arts', '?', null,
      'dexterityModifier', '=', 'source',
      'strengthModifier', '+', '-source',
      '', '^', '0'
    );
    // Show Unarmored Defense note even if armor != None or wisMod = 0
    rules.defineRule('combatNotes.monkUnarmoredDefense.1',
      'combatNotes.monkUnarmoredDefense', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('combatNotes.monkUnarmoredDefense.2',
      'combatNotes.monkUnarmoredDefense', '?', null,
      'armor', '?', 'source == "None"',
      'combatNotes.monkUnarmoredDefense.1', '=', null
    );
    rules.defineRule('combatNotes.openHandTechnique', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.quiveringPalm', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.stunningStrike', 'kiSaveDC', '=', null);
    rules.defineRule('featureNotes.ki', 'levels.Monk', '=', null);
    rules.defineRule
      ('featureNotes.wholenessOfBody', 'levels.Monk', '=', 'source*3');
    rules.defineRule('kiSaveDC',
      'monkFeatures.Ki', '?', null,
      'proficiencyBonus', '=', '8 + source',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.tranquility', 'kiSaveDC', '=', null);
    rules.defineRule('monkMeleeAttackBonus',
      'armor', '?', 'source == "None"',
      'combatNotes.martialArts.1', '=', null
    );
    rules.defineRule('monkMeleeDamageBonus',
      'armor', '?', 'source == "None"',
      'combatNotes.martialArts.1', '=', null
    );
    rules.defineRule('monkMeleeDieBonus',
      'armor', '?', 'source == "None"',
      'combatNotes.martialArts', '=', '"1d" + source'
    );
    for(var ability in Pathfinder2E.ABILITIES) {
      rules.defineRule
        ('saveProficiency.' + ability, 'saveNotes.diamondSoul', '=', '1');
    }
    rules.defineRule('selectableFeatureCount.Monk',
      'levels.Monk', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('speed', 'abilityNotes.unarmoredMovement.1', '+', null);


  } else if(name == 'Paladin') {

    rules.defineRule('armorClass', 'combatNotes.defenseStyle.1', '+', null);
    // Show Defense Style note even if armor == None
    rules.defineRule('combatNotes.defenseStyle.1',
      'combatNotes.defenseStyle', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Paladin', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule('combatNotes.sacredWeapon',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('featureNotes.channelDivinity', 'levels.Paladin', '=', '1');
    rules.defineRule('magicNotes.cleansingTouch',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.divineSense', 'charismaModifier', '=', 'source+1');
    rules.defineRule
      ('magicNotes.layOnHands', 'levels.Paladin', '=', 'source*5');
    rules.defineRule('saveNotes.auraOfCourage',
      'levels.Paladin', '=', 'source < 18 ? 10 : 30'
    );
    rules.defineRule('saveNotes.auraOfDevotion',
      'levels.Paladin', '=', 'source < 18 ? 10 : 30'
    );
    rules.defineRule('saveNotes.auraOfProtection',
      'levels.Paladin', '=', 'source < 18 ? 10 : 30'
    );
    rules.defineRule('saveNotes.auraOfProtection.1',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('selectableFeatureCount.Paladin',
      'levels.Paladin', '=', 'source < 2 ? null : source < 3 ? 1 : 2'
    );

  } else if(name == 'Ranger') {

    rules.defineRule('armorClass', 'combatNotes.defenseStyle.1', '+', null);
    // Show Defense Style note even if armor == None
    rules.defineRule('combatNotes.defenseStyle.1',
      'combatNotes.defenseStyle', '?', null,
      'armor', '=', 'source == "None" ? null : 1'
    );
    rules.defineRule('combatNotes.extraAttack',
      'levels.Ranger', '+=', 'source < 5 ? null : 1'
    );
    rules.defineRule
      ('attackBonus.Ranged', 'combatNotes.archeryStyle', '+=', '2');
    rules.defineRule('skillNotes.favoredEnemy',
      'levels.Ranger', '=', 'source < 6 ? 1 : source < 14 ? 2 : 3'
    );
    rules.defineRule('combatNotes.foeSlayer', 'wisdomModifier', '=', null);
    rules.defineRule('hunterSelectableFeatureCount',
      'rangerFeatures.Hunter Archetype', '?', null,
      'levels.Ranger', '=', 'source<3 ? 0 : source<7 ? 1 : source<11 ? 2 : source<15 ? 3 : 4'
    );
    rules.defineRule('selectableFeatureCount.Ranger',
      'levels.Ranger', '=', 'source < 2 ? 0 : source < 3 ? 1 : 2',
      'hunterSelectableFeatureCount', '+', null
    );
    rules.defineRule('skillNotes.naturalExplorer',
      'levels.Ranger', '=', 'source < 6 ? 1 : source < 10 ? 2 : 3'
    );

  } else if(name == 'Rogue') {

    rules.defineRule('combatNotes.sneakAttack',
      'levels.Rogue', '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('featCount.General', 'rogueFeatBonus', '+', null);
    rules.defineRule
      ('rogueFeatBonus', 'levels.Rogue', '=', 'source < 10 ? null : 1');
    rules.defineRule('selectableFeatureCount.Rogue',
      'levels.Rogue', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('skillNotes.rogueExpertise',
      'levels.Rogue', '=', 'source < 6 ? 2 : 4'
    );
    rules.defineRule
      ('skillNotes.second-StoryWork', 'dexterityModifier', '=', null);

  } else if(name == 'Sorcerer') {

    rules.defineRule('magicNotes.carefulSpell',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.empoweredSpell',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('magicNotes.fontOfMagic', 'levels.Sorcerer', '=', null);
    rules.defineRule('selectableFeatureCount.Sorcerer',
      'levels.Sorcerer', '=', 'source<3?1 : source<10?3 : source<17?4 : 5'
    );

    rules.defineRule
      ('armorClass', 'combatNotes.draconicResilience.2', '^', null);
    rules.defineRule
      ('combatNotes.draconicResilience', 'levels.Sorcerer', '=', null);
    rules.defineRule('combatNotes.draconicResilience.1',
      'combatNotes.draconicResilience', '?', null,
      'dexterityModifier', '=', 'source + 13'
    );
    rules.defineRule('combatNotes.draconicResilience.2',
      'armor', '?', 'source == "None"',
      'combatNotes.draconicResilience.1', '=', null
    );
    rules.defineRule
      ('magicNotes.elementalAffinity', 'charismaModifier', '=', null);

  } else if(name == 'Warlock') {

    rules.defineRule("combatNotes.darkOne'sBlessing.1",
      "warlockFeatures.Dark One's Blessing", '?', null,
      'charismaModifier', '=', null,
      'levels.Warlock', '+', null,
      '', '^', '1'
    );
    rules.defineRule('combatNotes.lifedrinker',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule
      ('magicNotes.agonizingBlast', 'charismaModifier', '=', null);
    rules.defineRule('magicNotes.eldritchInvocations',
      'levels.Warlock', '=', 'source == 2 ? 2 : source < 9 ? Math.floor((source + 1) / 2) : Math.floor((source + 6) / 3)'
    );
    rules.defineRule('magicNotes.mysticArcanum',
      'levels.Warlock', '=', 'source<13 ? "K6" : source<15 ? "K6, K7" : source<17 ? "K6, K7, K8" : "K6, K7, K8, K9"'
    );
    rules.defineRule('selectableFeatureCount.Warlock',
      'levels.Warlock', '=', 'source < 3 ? 1 : 2',
      'magicNotes.eldritchInvocations', '+', null
    );

  } else if(name == 'Wizard') {

    rules.defineRule('magicNotes.arcaneRecovery',
      'levels.Wizard', '=', 'Math.ceil(source / 2)'
    );
    rules.defineRule('magicNotes.empoweredEvocation',
      'intelligenceModifier', '=', null
    );
    rules.defineRule('selectableFeatureCount.Wizard',
      'levels.Wizard', '=', 'source < 2 ? null : 1'
    );

  }

};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, #domains# the associated domains, and #sphere# any
 * sphere of influence.
 */
Pathfinder2E.deityRules = function(rules, name, alignment, domains, sphere) {

  if(!name) {
    console.log('Empty deity name');
    return;
  }
  if(name != 'None' && !(alignment+'').match(/^(N|[LNC]G|[LNC]E|[LC]N)$/i)) {
    console.log('Bad alignment "' + alignment + '" for deity ' + name);
    return;
  }
  if(!Array.isArray(domains)) {
    console.log('Bad domains list "' + domains + '" for deity ' + name);
    return;
  }

  if(rules.deityStats == null) {
    rules.deityStats = {
      alignment:{},
      domains:{},
      sphere:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.domains[name] = domains.join('/');
  rules.deityStats.sphere[name] = sphere;

  rules.defineRule('deityAlignment',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.alignment) + '[source]'
  );
  rules.defineRule('deityDomains',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.domains) + '[source]'
  );
  rules.defineRule('deitySphere',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.sphere) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
Pathfinder2E.featRules = function(rules, name, requires, implies, types) {

  if(!name) {
    console.log('Empty feat name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for feat ' + name);
    return;
  }
  if(!Array.isArray(implies)) {
    console.log('Bad implies list "' + implies + '" for feat ' + name);
    return;
  }
  if(!Array.isArray(types)) {
    console.log('Bad types list "' + types + '" for feat ' + name);
    return;
  }

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Feat', 'feats.' + name, requires);
  if(implies.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', prefix + 'Feat', 'feats.' + name, implies);
  rules.defineRule('features.' + name, 'feats.' + name, '=', null);
  for(var i = 0; i < types.length; i++) {
    if(types[i] != 'General')
      rules.defineRule('sum' + types[i] + 'Feats', 'feats.' + name, '+=', null);
  }

};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Pathfinder2E.featRulesExtra = function(rules, name) {
  if(name.startsWith('Ability Boost')) {
    rules.defineChoice('notes', 'abilityNotes.abilityBoost:%V to distribute');
    rules.defineRule('abilityNotes.abilityBoost', 'abilityBoost', '=', null);
    rules.defineRule('abilityBoost', 'features.' + name, '+=', '2');
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Pathfinder2E.featureRules = function(rules, name, sections, notes) {
  // TBD Move out of SRD35
  SRD35.featureRules(rules, name, sections, notes);
  for(var i = 0; i < notes.length; i++) {
    var matchInfo = notes[i].match(/^([A-Z]\w*)\sProficiency\s\((.*)\)$/);
    if(!matchInfo)
      continue;
    var group = matchInfo[1].toLowerCase();
    var note = sections[i] + 'Notes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
    var affected = matchInfo[2].split('/');
    for(var j = 0; j < affected.length; j++) {
      matchInfo = affected[j].match(/^Choose\s(\d+)/);
      if(matchInfo)
        rules.defineRule(group + 'ChoiceCount', note, '+=', matchInfo[1]);
      else
        rules.defineRule(group + 'Proficiency.' + affected[j], note, '=', '1');
    }
  }
};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
Pathfinder2E.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  QuilvynRules.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
};

/* Defines in #rules# the rules associated with language #name#. */
Pathfinder2E.languageRules = function(rules, name) {
  if(!name) {
    console.log('Empty language name');
    return;
  }
  // No rules pertain to language
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features and spells listed in #features#
 * and #spells#. #spellAbility#, if specified, names the ability for computing
 * spell difficulty class. #spellSlots# lists the number of spells per level
 * per day granted by the path, and #spells# lists spells defined by the path.
 * #spellDict# is the dictionary of all spells, used to look up individual
 * spell attributes.
 */
Pathfinder2E.pathRules = function(
  rules, name, group, levelAttr, features, selectables, spellAbility,
  spellSlots, spells, spellDict
) {

  if(!name) {
    console.log('Empty path name');
    return;
  }
  if(!group) {
    console.log('Bad group "' + group + '" for path ' + name);
    return;
  }
  if(!(levelAttr + '').startsWith('level')) {
    console.log('Bad level "' + levelAttr + '" for path ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for path ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for path ' + name);
    return;
  }
  if(spellAbility) {
    spellAbility = spellAbility.toLowerCase();
    if(!(spellAbility.charAt(0).toUpperCase() + spellAbility.substring(1) in Pathfinder2E.ABILITIES)) {
      console.log('Bad spell ability "' + spellAbility + '" for class ' + name);
      return;
    }
  }

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  rules.defineRule(pathLevel,
    'features.' + name, '?', null,
    levelAttr, '=', null
  );

  Pathfinder2E.featureListRules(rules, features, group, pathLevel, false);
  Pathfinder2E.featureListRules(rules, selectables, group, pathLevel, true);

  if(spellSlots.length > 0) {
    rules.defineRule('casterLevels.' + name, pathLevel, '=', null);
    QuilvynRules.spellSlotRules(rules, 'casterLevels.' + name, spellSlots);
    for(var j = 0; j < spellSlots.length; j++) {
      var spellType = spellSlots[j].replace(/\d.*/, '');
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellAttackModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', null,
        'proficiencyBonus', '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellAbility + 'Modifier', '=', '8 + source',
        'proficiencyBonus', '+', null
      );
    }
  }

};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
Pathfinder2E.schoolRules = function(rules, name) {
  if(!name) {
    console.log('Empty school name');
    return;
  }
  // No rules pertain to schools
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class.
 */
Pathfinder2E.shieldRules = function(rules, name, ac) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      ac:{},
    };
  }
  rules.shieldStats.ac[name] = ac;

  rules.defineRule
    ('armorClass', 'shield', '+', QuilvynUtils.dictLit(rules.shieldStats.ac) + '[source]');

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.).
 * #classes# lists any classes that are proficient in this skill.
 */
Pathfinder2E.skillRules = function(rules, name, ability, classes) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(ability) {
    ability = ability.toLowerCase();
    if(!(ability.charAt(0).toUpperCase() + ability.substring(1) in Pathfinder2E.ABILITIES)) {
      console.log('Bad ability "' + ability + '" for skill ' + name);
      return;
    }
  }
  if(!Array.isArray(classes)) {
    console.log('Bad classes list "' + classes + '" for skill ' + name);
    return;
  }

  for(var i = 0; i < classes.length; i++) {
    rules.defineRule
      ('skillProficiency.' + name, 'levels.' + classes[i], '=', '1');
  }
  rules.defineRule('skillProficiency.' + name,
    'skillsChosen.' + name, '=', 'source ? 1 : null'
  );
  rules.defineRule('skillBonus.' + name,
    'skillProficiency.' + name, '?', null,
    'proficiencyBonus', '=', null
  );
  rules.defineChoice
      ('notes', 'skills.' + name + ':(' + ability.substring(0, 3) + ') %V');
  rules.defineRule('skills.' + name,
    ability + 'Modifier', '=', null,
    'skillBonus.' + name, '+', null,
    'skillNotes.goodies' + name + 'Adjustment', '+', null
  );

};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
Pathfinder2E.spellRules = function(
  rules, name, school, casterGroup, level, description
) {
  // TBD Move out of SRD35
  SRD35.spellRules(rules, name, school, casterGroup, level, description);
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #category# proficiency level to use effectively and has weapon properties
 * #properties#. The weapon does #damage# HP on a successful attack. If
 * specified, the weapon can be used as a ranged weapon with a range increment
 * of #range# feet.
 */
Pathfinder2E.weaponRules = function(rules, name, category, properties, damage, range) {

  if(!name) {
    console.log('Bad name for weapon  "' + name + '"');
    return;
  }
  if(category == null ||
     !(category + '').match(/^([0-2]|unarmed|simple|martial)$/i)) {
    console.log('Bad category "' + category + '" for weapon ' + name);
    return;
  }
  if(!Array.isArray(properties)) {
    console.log('Bad properties list "' + properties + '" for weapon ' + name);
    return;
  }
  var matchInfo = (damage + '').match(/^(((\d*d)?\d+)([\-+]\d+)?)$/);
  if(!matchInfo) {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(range && typeof range != 'number') {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }

  if((category + '').match(/^[0-2]$/))
    ; // empty
  else if(category.match(/^unarmed$/i))
    category = 0;
  else if(category.match(/^simple$/i))
    category = 1;
  else if(category.match(/^martial$/i))
    category = 2;

  var isFinessed = properties.includes('finesse') || properties.includes('Fi');
  var isRanged = properties.includes('ranged') || properties.includes('R');
  var is2h = properties.includes('two-handed') || properties.includes('2h');

  var damage = matchInfo[1];
  var weaponName = 'weapons.' + name;
  var format = '%V (%1 %2%3' + (range ? " R%4'" : '') + ')';

  if(damage.startsWith('d'))
    damage = '1' + damage;

  rules.defineChoice('notes',
    weaponName + ':' + format,
    'sanityNotes.nonproficientWeaponPenalty.' + name + ':%V attack'
  );

  if(category > 0) {
    rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
      weaponName, '?', null,
      'proficiencyBonus', '=', '-source',
      'weaponProficiency.Martial', '^', '0',
      'weaponProficiency.' + name, '^', '0'
    );
    if(category == 1) {
      rules.defineRule('sanityNotes.nonproficientWeaponPenalty.' + name,
        'weaponProficiency.Simple', '^', '0'
      );
    }
  }
  rules.defineRule('weaponProficiencyBonus.' + name,
    weaponName, '?', null,
    'proficiencyBonus', '=', null,
    'sanityNotes.nonproficientWeaponPenalty.' + name, 'v', 'source == 0 ? null : 0'
  );
  rules.defineRule('attackBonus.' + name,
    weaponName, '=', '0',
    isFinessed ? 'betterAttackAdjustment' :
      isRanged ? 'combatNotes.dexterityAttackAdjustment' :
                 'combatNotes.strengthAttackAdjustment', '+', null,
    'weaponProficiencyBonus.' + name, '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    isFinessed ? 'betterDamageAdjustment' :
      isRanged ? 'combatNotes.dexterityDamageAdjustment' :
                 'combatNotes.strengthDamageAdjustment', '+', null,
    'weaponDamageAdjustment.' + name, '+', null
  );
  if(!range) {
    rules.defineRule('attackBonus.' + name, 'monkMeleeAttackBonus', '+', null);
    rules.defineRule('damageBonus.' + name, 'monkMeleeDamageBonus', '+', null);
  }

  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'source >= 0 ? "+" + source : source'
  );
  rules.defineRule(weaponName + '.2', weaponName, '=', '"' + damage + '"');
  if(properties.includes('Ve') || properties.includes('versatile'))
    rules.defineRule(weaponName + '.2',
      'shield', '=', 'source == "None" ? Pathfinder2E.VERSATILE_WEAPON_DAMAGE["' + damage + '"] : null'
    );
  rules.defineRule(weaponName + '.3',
    'damageBonus.' + name, '=', 'source > 0 ? "+" + source : source == 0 ? "" : source'
  );
  if(range) {
    rules.defineRule('range.' + name,
      weaponName, '=', range,
      'weaponRangeAdjustment.' + name, '+', null
    );
    rules.defineRule(weaponName + '.4', 'range.' + name, '=', null);
  } else {
    rules.defineRule(weaponName + '.2', 'monkMeleeDieBonus', '^', null);
  }

  if(is2h)
    rules.defineRule
      ('features.Two-Handed Weapon With Shield', weaponName, '=', '1');

  rules.defineRule('weaponProficiency.' + name,
    'weaponsChosen.' + name, '=', 'source ? 1 : null'
  );

};

/*
 * Defines in #rules# the rules associated with with the list #features#. Rules
 * add each feature to #setName# if the value of #levelAttr# is at least equal
 * to the value required for the feature. If #selectable# is true, the user is
 * allowed to select these features for the character, rather than having them
 * assigned automatically.
 */
Pathfinder2E.featureListRules = function(
  rules, features, setName, levelAttr, selectable
) {
  QuilvynRules.featureListRules
    (rules, features, setName, levelAttr, selectable);
  setName = setName.charAt(0).toLowerCase() + setName.substring(1).replaceAll(' ', '') + 'Features';
  for(var i = 0; i < features.length; i++) {
    var feature = features[i].replace(/^(.*\?\s*)?\d+:/, '');
    var matchInfo = feature.match(/([A-Z]\w*)\sProficiency\s\((.*)\)$/);
    if(!matchInfo)
      continue;
    var group = matchInfo[1].toLowerCase();
    var elements = matchInfo[2].split('/');
    for(var j = 0; j < elements.length; j++) {
      matchInfo = elements[j].match(/^Choose\s+(\d+)\s+from/i);
      if(matchInfo) {
        rules.defineRule
          (group + 'ChoiceCount', setName + '.' + feature, '+=', matchInfo[1]);
      } else {
        rules.defineRule(group + 'Proficiency.' + elements[j],
          setName + '.' + feature, '=', '1'
        );
      }
    }
  }
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
Pathfinder2E.getFormats = function(rules, viewer) {
  var format;
  var formats = rules.getChoices('notes');
  var result = {};
  var matchInfo;
  if(viewer == 'Collected Notes') {
    for(format in formats) {
      result[format] = formats[format];
      if((matchInfo = format.match(/Notes\.(.*)$/)) != null) {
        var feature = matchInfo[1];
        feature = feature.charAt(0).toUpperCase() + feature.substring(1).replace(/([A-Z(])/g, ' $1');
        formats['features.' + feature] = formats[format];
      }
    }
  } else if(viewer == 'Compact') {
    for(format in formats) {
      if(!format.startsWith('spells.'))
        result[format] = formats[format];
    }
  } else {
    result = formats;
  }
  return result;
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Pathfinder2E.createViewers = function(rules, viewers) {
  for(var i = 0; i < viewers.length; i++) {
    var name = viewers[i];
    var viewer = new ObjectViewer();
    if(name == 'Compact') {
      viewer.addElements(
        {name: '_top', separator: '\n'},
          {name: 'Section 1', within: '_top', separator: '; '},
            {name: 'Identity', within: 'Section 1', format: '%V',
             separator: ''},
              {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
              {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
              {name: 'Ancestry', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Background', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Levels', within: 'Identity', format: ' <b>%V</b>',
               separator: '/'},
            {name: 'Hit Points', within: 'Section 1', format: '<b>HP</b> %V'},
            {name: 'Initiative', within: 'Section 1', format: '<b>Init</b> %V'},
            {name: 'Speed', within: 'Section 1', format: '<b>Speed</b> %V'},
            {name: 'Armor Class', within: 'Section 1', format: '<b>AC</b> %V'},
            {name: 'Weapons', within: 'Section 1', format: '<b>%N</b> %V',
             separator: '/'},
            {name: 'Alignment', within: 'Section 1', format: '<b>Ali</b> %V'},
            {name: 'Save', within: 'Section 1', separator: '/'},
            {name: 'Resistance', within: 'Section 1', separator: '/'},
            {name: 'Abilities', within: 'Section 1',
             format: '<b>Str/Int/Wis/Dex/Con/Cha</b> %V', separator: '/'},
              {name: 'Strength', within: 'Abilities', format: '%V'},
              {name: 'Dexterity', within: 'Abilities', format: '%V'},
              {name: 'Constitution', within: 'Abilities', format: '%V'},
              {name: 'Intelligence', within: 'Abilities', format: '%V'},
              {name: 'Wisdom', within: 'Abilities', format: '%V'},
              {name: 'Charisma', within: 'Abilities', format: '%V'},
          {name: 'Section 2', within: '_top', separator: '; '},
            {name: 'Skill Modifier', within: 'Section 2', separator: '/'},
            {name: 'Feats', within: 'Section 2', separator: '/'},
            {name: 'Languages', within: 'Section 2', separator: '/'},
            {name: 'Spells', within: 'Section 2', separator: '/'},
            {name: 'Spell Difficulty Class', within: 'Section 2',
             separator: '/'},
            {name: 'Domains', within: 'Section 2', separator: '/'},
            {name: 'Notes', within: 'Section 2'},
            {name: 'Hidden Notes', within: 'Section 2', format: '%V'}
      );
    } else if(name == 'Collected Notes' || name == 'Standard') {
      var innerSep = null;
      var listSep = '; ';
      var noteSep = listSep;
      noteSep = '\n';
      var outerSep = name == '\n';
      viewer.addElements(
        {name: '_top', borders: 1, separator: '\n'},
        {name: 'Header', within: '_top'},
          {name: 'Identity', within: 'Header', separator: ''},
            {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
            {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
            {name: 'Ancestry', within: 'Identity', format: ' <b>%V</b>'},
            {name: 'Background', within: 'Identity', format: ' <b>%V</b>'},
            {name: 'Levels', within: 'Identity', format: ' <b>%V</b>',
             separator: '/'},
          {name: 'Image Url', within: 'Header', format: '<img src="%V"/>'},
        {name: 'Attributes', within: '_top', separator: outerSep},
          {name: 'Abilities', within: 'Attributes', separator: innerSep},
            {name: 'Strength', within: 'Abilities'},
            {name: 'Dexterity', within: 'Abilities'},
            {name: 'Constitution', within: 'Abilities'},
            {name: 'Intelligence', within: 'Abilities'},
            {name: 'Wisdom', within: 'Abilities'},
            {name: 'Charisma', within: 'Abilities'},
          {name: 'Description', within: 'Attributes', separator: innerSep},
            {name: 'Background', within: 'Description'},
            {name: 'Alignment', within: 'Description'},
            {name: 'DeityInfo', within: 'Description', separator: ''},
              {name: 'Deity', within: 'DeityInfo'},
              {name: 'Deity Alignment', within: 'DeityInfo', format:' (%V)'},
            {name: 'Origin', within: 'Description'},
            {name: 'Player', within: 'Description'},
          {name: 'AbilityStats', within: 'Attributes', separator: innerSep},
            {name: 'ExperienceInfo', within: 'AbilityStats', separator: ''},
              {name: 'Experience', within: 'ExperienceInfo'},
              {name: 'Experience Needed', within: 'ExperienceInfo',
               format: '/%V'},
            {name: 'Level', within: 'AbilityStats'},
            {name: 'Speed', within: 'AbilityStats'},
            {name: 'LoadInfo', within: 'AbilityStats', separator: ''},
              {name: 'Carry', within: 'LoadInfo',
               format: '<b>Carry/Lift:</b> %V'},
              {name: 'Lift', within: 'LoadInfo', format: '/%V'},
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Ability Notes', within: 'Attributes', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'FeaturesAndSkills', within: '_top', separator: outerSep,
         format: '<b>Features/Skills</b><br/>%V'},
          {name: 'Proficiency Bonus', within: 'FeaturesAndSkills'},
          {name: 'FeaturePart', within: 'FeaturesAndSkills', separator: '\n'},
            {name: 'FeatStats', within: 'FeaturePart', separator: innerSep},
              {name: 'Feat Count', within: 'FeatStats', separator: listSep},
              {name: 'Selectable Feature Count', within: 'FeatStats',
               separator: listSep},
            {name: 'FeatLists', within: 'FeaturePart', separator: innerSep},
              {name: 'FeatList', within: 'FeatLists', separator: ''},
                {name: 'Feats', within: 'FeatLists', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Feature Notes', within: 'FeaturePart', separator: noteSep}
        );
      } else {
        viewer.addElements(
          {name: 'AllNotes', within: 'FeaturePart', separator: '\n', columns: "1L"},
            {name: 'Ability Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Feature Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Skill Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Combat Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Save Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"},
            {name: 'Magic Notes', within: 'AllNotes', separator: null, columns: "1L", format: "%V"}
        );
      }
      viewer.addElements(
          {name: 'Skill Proficiency', within: 'FeaturesAndSkills', separator: listSep},
          {name: 'Skills', within: 'FeaturesAndSkills', columns: '3LE', separator: null},
          {name: 'Languages', within: 'FeaturesAndSkills', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Skill Notes', within: 'FeaturesAndSkills', separator:noteSep}
        );
      }
      viewer.addElements(
        {name: 'Combat', within: '_top', separator: outerSep,
         format: '<b>Combat</b><br/>%V'},
          {name: 'CombatPart', within: 'Combat', separator: '\n'},
            {name: 'CombatStats', within: 'CombatPart', separator: innerSep},
              {name: 'Hit Points', within: 'CombatStats'},
              {name: 'Initiative', within: 'CombatStats'},
              {name: 'Armor Class', within: 'CombatStats'},
              {name: 'Attacks Per Round', within: 'CombatStats'},
            {name: 'CombatProfs', within: 'CombatPart', separator: innerSep},
              {name: 'Armor Proficiency', within: 'CombatProfs', separator: listSep},
              {name: 'Weapon Proficiency', within: 'CombatProfs', separator: listSep},
            {name: 'Gear', within: 'CombatPart', separator: innerSep},
              {name: 'Armor', within: 'Gear'},
              {name: 'Shield', within: 'Gear'},
              {name: 'Weapons', within: 'Gear', separator: listSep},
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Combat Notes', within: 'CombatPart', separator: noteSep}
        );
      }
      viewer.addElements(
          {name: 'SavePart', within: 'Combat', separator: '\n'},
            {name: 'Save Proficiency', within: 'SavePart', separator: listSep},
            {name: 'Save', within: 'SavePart', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Save Notes', within: 'SavePart', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Magic', within: '_top', separator: outerSep,
         format: '<b>Magic</b><br/>%V'},
          {name: 'SpellPart', within: 'Magic', separator: '\n'},
            {name: 'SpellStats', within: 'SpellPart', separator: innerSep},
              {name: 'Spells Known', within: 'SpellStats', separator: listSep},
              {name: 'Spell Slots', within: 'SpellStats', separator:listSep},
              {name: 'Spell Attack Modifier', within: 'SpellStats',
               format: '<b>Attack</b>: %V', separator: listSep},
              {name: 'Spell Difficulty Class', within: 'SpellStats',
               format: '<b>Spell DC</b>: %V', separator: listSep},
          {name: 'Spells', within: 'Magic', columns: '1L', separator: null}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Magic Notes', within: 'Magic', separator: noteSep}
        );
      }
      viewer.addElements(
        {name: 'Notes Area', within: '_top', separator: outerSep,
         format: '<b>Notes</b><br/>%V'},
          {name: 'NotesPart', within: 'Notes Area', separator: '\n'},
            {name: 'Notes', within: 'NotesPart', format: '%V'},
            {name: 'Hidden Notes', within: 'NotesPart', format: '%V'},
          {name: 'ValidationPart', within: 'Notes Area', separator: '\n'},
            {name: 'Sanity Notes', within: 'ValidationPart', separator:noteSep},
            {name: 'Validation Notes', within: 'ValidationPart',
             separator: noteSep}
      );
    } else
      continue;
    rules.defineViewer(name, viewer);
  }
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
Pathfinder2E.choiceEditorElements = function(rules, type) {
  var result = [];
  var zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Alignment')
    result.push(
      // empty
    );
  else if(type == 'Armor') {
    var zeroToFifty = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    var minusTenToZero = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0];
    var tenToEighteen = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    result.push(
      ['AC', 'AC Bonus', 'select-one', [0, 1, 2, 3, 4, 5]],
      ['Bulky', 'Bulky', 'checkbox', ['']],
      ['Dex', 'Max Dex', 'select-one', zeroToTen],
      ['Str', 'Min Str', 'select-one', tenToEighteen],
      ['Weight', 'Weight', 'select-one', ['None', 'Light', 'Medium', 'Heavy']]
    );
  } else if(type == 'Background') {
    result.push(
      ['Equipment', 'Equipment', 'text', [40]],
      ['Features', 'Features', 'text', [40]],
      ['Languages', 'Languages', 'text', [40]]
    );
  } else if(type == 'Class') {
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['HitPoints', 'Hit Points', 'select-one', ['4', '6', '8', '10', '12']],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Selectable Features', 'text', [40]],
      ['Languages', 'Languages', 'text', [30]],
      ['CasterLevelArcane', 'Arcane Level', 'text', [10]],
      ['CasterLevelDivine', 'Divine Level', 'text', [10]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  } else if(type == 'Deity')
    result.push(
      ['Alignment', 'Alignment', 'select-one', QuilvynUtils.getKeys(rules.getChoices('alignments'))],
      ['Domain', 'Domains', 'text', [30]],
      ['Sphere', 'Sphere', 'text', [15]]
    );
  else if(type == 'Feat')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Imply', 'Implies', 'text', [40]],
      ['Type', 'Types', 'text', [20]]
    );
  else if(type == 'Feature') {
    var sections =
      ['ability', 'combat', 'companion', 'feature', 'magic', 'skill'];
    result.push(
      ['Section', 'Section', 'select-one', sections],
      ['Note', 'Note', 'text', [60]]
    );
  } else if(type == 'Language')
    result.push(
      // empty
    );
  else if(type == 'Path')
    result.push(
      ['Group', 'Group', 'text', [15]],
      ['Level', 'Level', 'text', [15]],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Features', 'text', [40]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  else if(type == 'Ancestry')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Features', 'Features', 'text', [60]],
      ['Selectables', 'Selectables', 'text', [60]],
      ['Languages', 'Languages', 'text', [30]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spells Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [80]]
    );
  else if(type == 'Background')
    result.push(
      ['Ability', 'Ability', 'text', [40]],
      ['Skill', 'Skill', 'text', [40]],
      ['Feat', 'Feat', 'text', [40]]
    );
  else if(type == 'School')
    result.push(
      ['Features', 'Features', 'text', [40]]
    );
  else if(type == 'Shield')
    result.push(
      ['AC', 'Armor Class', 'select-one', [1, 2, 3, 4, 5]]
    );
  else if(type == 'Skill')
    result.push(
      ['Ability', 'Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['Class', 'Class Skill', 'text', [30]]
    );
  else if(type == 'Spell') {
    var zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    result.push(
      ['School', 'School', 'select-one', QuilvynUtils.getKeys(rules.getChoices('schools'))],
      ['Group', 'Caster Group', 'text', [15]],
      ['Level', 'Level', 'select-one', zeroToNine],
      ['Description', 'Description', 'text', [60]]
    );
  } else if(type == 'Weapon') {
    var oneToFive = [1, 2, 3, 4, 5];
    var sixteenToTwenty = [16, 17, 18, 19, 20];
    var zeroToOneFifty =
     [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    result.push(
      ['Category', 'Category', 'select-one', ['Simple', 'Martial']],
      ['Property', 'Property', 'select-one', ['Unarmed', 'Light', 'One-Handed', 'Two-Handed', 'Ranged']],
      ['Damage', 'Damage', 'select-one', QuilvynUtils.getKeys(Pathfinder2E.VERSATILE_WEAPON_DAMAGE)],
      ['Range', 'Range in Feet', 'select-one', zeroToOneFifty]
    );
  }
  return result;
};

/* Returns the elements in a basic 5E character editor. */
Pathfinder2E.initialEditorElements = function() {
  var abilityChoices = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
  ];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['ancestry', 'Ancestry', 'select-one', 'ancestries'],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['experience', 'Experience', 'text', [8]],
    ['levels', 'Levels', 'bag', 'levels'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['strength', 'Str/Boost', 'select-one', abilityChoices],
    ['strengthAdjust', '', 'text', [3]],
    ['dexterity', 'Dex/Boost', 'select-one', abilityChoices],
    ['dexterityAdjust', '', 'text', [3]],
    ['constitution', 'Con/Boost', 'select-one', abilityChoices],
    ['constitutionAdjust', '', 'text', [3]],
    ['intelligence', 'Int/Boost', 'select-one', abilityChoices],
    ['intelligenceAdjust', '', 'text', [3]],
    ['wisdom', 'Wis/Boost', 'select-one', abilityChoices],
    ['wisdomAdjust', '', 'text', [3]],
    ['charisma', 'Cha/Boost', 'select-one', abilityChoices],
    ['charismaAdjust', '', 'text', [3]],
    ['player', 'Player', 'text', [20]],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['gender', 'Gender', 'text', [10]],
    ['deity', 'Deity', 'select-one', 'deities'],
    ['origin', 'Origin', 'text', [20]],
    ['feats', 'Feats', 'set', 'feats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skillsChosen', 'Skills', 'set', 'skills'],
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4]],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'bag', 'weapons'],
    ['weaponsChosen', 'Proficiency', 'set', 'weapons'],
    ['spells', 'Spells', 'fset', 'spells'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  ];
  return editorElements;
};

/* Returns a random name for a character of ancestry #ancestry#. */
Pathfinder2E.randomName = function(ancestry) {

  /* Return a random character from #string#. */
  function randomChar(string) {
    return string.charAt(QuilvynUtils.random(0, string.length - 1));
  }

  if(ancestry == null)
    ancestry = 'Human';
  else if(ancestry.match(/Dwarf/))
    ancestry = 'Dwarf';
  else if(ancestry.match(/Elf/))
    ancestry = 'Elf';
  else if(ancestry.match(/Gnome/))
    ancestry = 'Gnome';
  else if(ancestry.match(/Goblin/))
    ancestry = 'Goblin';
  else if(ancestry.match(/Halfling/))
    ancestry = 'Halfling';
  else
    ancestry = 'Human';

  var clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  var consonants = {
    'Dwarf':'dgkmnprst', 'Elf':'fhlmnpqswy', 'Gnome':'bdghjlmnprstw',
    'Goblin':'bdfghklmnprtwyz', 'Halfling':'bdfghlmnprst', 
    'Human': 'bcdfghjklmnprstvwz'
  }[ancestry];
  var endConsonant = '';
  var leading = 'ghjqvwy';
  var vowels = {
    'Dwarf':'aeiou', 'Elf':'aeioy', 'Gnome':'aeiou', 'Goblin':'aeiou',
    'Halfling':'aeiou', 'Human':'aeiou'
  }[ancestry];
  var diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  var syllables = QuilvynUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  var result = '';
  var vowel;

  for(var i = 0; i < syllables; i++) {
    if(QuilvynUtils.random(0, 99) <= 80) {
      endConsonant = randomChar(consonants).toUpperCase();
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
      if(endConsonant == 'Q')
        result += 'u';
    }
    else if(endConsonant.length == 1 && QuilvynUtils.random(0, 99) < 10) {
      result += endConsonant;
      endConsonant += endConsonant;
    }
    vowel = randomChar(vowels);
    if(endConsonant.length > 0 && diphthongs[vowel] != null &&
       QuilvynUtils.random(0, 99) < 15)
      vowel += randomChar(diphthongs[vowel]);
    result += vowel;
    endConsonant = '';
    if(QuilvynUtils.random(0, 99) <= 60) {
      while(leading.indexOf((endConsonant = randomChar(consonants))) >= 0)
        ; /* empty */
      if(clusters[endConsonant] != null && QuilvynUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
    }
  }
  return result.substring(0, 1).toUpperCase() +
         result.substring(1).toLowerCase();

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Pathfinder2E.randomizeOneAttribute = function(attributes, attribute) {

  /*
   * Randomly selects #howMany# elements of the array #choices#, prepends
   * #prefix# to each, and sets those attributes in #attributes# to #value#.
   */
  function pickAttrs(attributes, prefix, choices, howMany, value) {
    var remaining = [].concat(choices);
    for(var i = 0; i < howMany && remaining.length > 0; i++) {
      var which = QuilvynUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  var attr;
  var attrs;
  var choices;
  var howMany;
  var i;
  var matchInfo;

  if(attribute == 'armor') {
    var armors = this.getChoices('armors');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in armors) {
      var weight = QuilvynUtils.getAttrValue(armors[attr], 'Weight');
      if(weight == null)
        weight = 0;
      else if((weight + '').match(/light/i))
        weight = 1;
      else if((weight + '').match(/medium/i))
        weight = 2;
      else if((weight + '').match(/heavy/i))
        weight = 3;
      if(weight == 0 ||
         attrs['armorProficiency.Heavy'] ||
         weight <= 2 && attrs['armorProficiency.Medium'] ||
         weight == 1 && attrs['armorProficiency.Light'] ||
         attrs['armorProficiency.' + attr])
        choices.push(attr);
    }
    attributes['armor'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'boosts') {
    var attrs = this.applyRules(attributes);
    howMany = (attrs.abilityBoost || 0) - QuilvynUtils.sumMatching(attributes, /Adjust$/);
    while(howMany > 0) {
      attr = QuilvynUtils.randomKey(Pathfinder2E.ABILITIES).toLowerCase();
      if(attributes[attr + 'Adjust'] == null)
        attributes[attr + 'Adjust'] = 1;
      else
        attributes[attr + 'Adjust'] += 1;
      howMany--;
    }
  } else if(attribute == 'deity') {
    /* Pick a deity that's no more than one alignment position removed. */
    var aliInfo = attributes.alignment.match(/^([CLN]).*\s([GEN])/);
    var aliPat;
    if(aliInfo == null) /* Neutral character */
      aliPat = 'N[EG]?|[CL]N';
    else if(aliInfo[1] == 'N') /* NG or NE */
      aliPat = 'N|[CLN]' + aliInfo[2];
    else if(aliInfo[2] == 'N') /* CN or LN */
      aliPat = 'N|' + aliInfo[1] + '[GNE]';
    else /* [LC]G or [LC]E */
      aliPat = aliInfo[1] + '[N' + aliInfo[2] + ']|N' + aliInfo[2];
    choices = [];
    var deities = this.getChoices('deities');
    for(attr in deities) {
      if(deities[attr].match('=' + aliPat + '\\b'))
        choices.push(attr);
    }
    if(choices.length > 0)
      attributes.deity = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'feats' || attribute == 'features') {
    var debug = [];
    attribute = attribute == 'feats' ? 'feat' : 'selectableFeature';
    var countPrefix = attribute + 'Count.';
    var prefix = attribute + 's';
    var suffix = attribute.charAt(0).toUpperCase() + attribute.substring(1);
    var toAllocateByType = {};
    attrs = this.applyRules(attributes);
    for(attr in attrs) {
      if(attr.startsWith(countPrefix)) {
        toAllocateByType[attr.replace(countPrefix, '')] = attrs[attr];
      }
    }
    var availableChoices = {};
    var allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      var types = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Type');
      if(types.indexOf('General') < 0)
        types.push('General');
      if(attrs[prefix + '.' + attr] != null) {
        for(i = 0; i < types.length; i++) {
          var t = types[i];
          if(toAllocateByType[t] != null && toAllocateByType[t] > 0) {
            debug.push(prefix + '.' + attr + ' reduces ' + t + ' feats from ' + toAllocateByType[t]);
            toAllocateByType[t]--;
            break;
          }
        }
      } else if(attrs['features.' + attr] == null) {
        availableChoices[attr] = types;
      }
    }
    for(attr in toAllocateByType) {
      var availableChoicesInType = {};
      for(var a in availableChoices) {
        if(attr == 'General' || availableChoices[a].includes(attr))
          availableChoicesInType[a] = '';
      }
      howMany = toAllocateByType[attr];
      debug.push('Choose ' + howMany + ' ' + attr + ' ' + prefix);
      while(howMany > 0 &&
            (choices=QuilvynUtils.getKeys(availableChoicesInType)).length > 0) {
        debug.push(
          'Pick ' + howMany + ' from ' +
          QuilvynUtils.getKeys(availableChoicesInType).length
        );
        var pick;
        var picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug.push('From ' + QuilvynUtils.getKeys(picks).join(", ") + ' reject');
        for(pick in picks) {
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInType[pick];
        }
        var validate = this.applyRules(attributes);
        for(pick in picks) {
          var name = pick.charAt(0).toLowerCase() +
                     pick.substring(1).replaceAll(' ', '').
                     replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          if(QuilvynUtils.sumMatching
               (validate,
                new RegExp('^(sanity|validation)Notes.'+name+suffix)) != 0) {
            delete attributes[prefix + '.' + pick];
            debug[debug.length - 1] += ' ' + name;
          } else {
            howMany--;
            delete availableChoices[pick];
          }
        }
      }
      debug.push('xxxxxxx');
    }
    if(window.DEBUG) {
      var notes = attributes.notes;
      attributes.notes =
        (notes != null ? attributes.notes + '\n' : '') + debug.join('\n');
    }
  } else if(attribute == 'gender') {
    attributes['gender'] = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'hitPoints') {
    attributes.hitPoints = 0;
    for(var clas in this.getChoices('levels')) {
      if((attr = attributes['levels.' + clas]) == null)
        continue;
      matchInfo = this.getChoices('levels')[clas].match(/^((\d+)?d)?(\d+)$/);
      var number = matchInfo == null || matchInfo[2] == null ||
                   matchInfo[2] == '' ? 1 : matchInfo[2];
      var sides = matchInfo == null || matchInfo[3] == null ||
                  matchInfo[3] == '' ? 6 : matchInfo[3];
      attributes.hitPoints += number * sides;
      while(--attr > 0)
        attributes.hitPoints += QuilvynUtils.random(number, number * sides);
    }
  } else if(attribute == 'languages') {
    attrs = this.applyRules(attributes);
    howMany = attrs.languageCount;
    choices = [];
    for(attr in this.getChoices('languages')) {
      if(attrs['languages.' + attr])
        howMany--;
      else
        choices.push(attr);
    }
    pickAttrs(attributes, 'languages.', choices, howMany, 1);
  } else if(attribute == 'levels') {
    var assignedLevels = QuilvynUtils.sumMatching(attributes, /^levels\./);
    if(!attributes.level) {
      if(assignedLevels > 0)
        attributes.level = assignedLevels
      else if(attributes.experience)
        attributes.level =
          Math.floor((1 + Math.sqrt(1 + attributes.experience/125)) / 2);
      else
        // Random 1..8 with each value half as likely as the previous one.
        attributes.level =
          9 - Math.floor(Math.log(QuilvynUtils.random(2, 511)) / Math.log(2));
    }
    var max = Pathfinder2E.LEVELS_EXPERIENCE[attributes.level] * 1000 - 1;
    var min = Pathfinder2E.LEVELS_EXPERIENCE[attributes.level - 1] * 1000;
    if(!attributes.experience || attributes.experience < min)
      attributes.experience = QuilvynUtils.random(min, max);
    choices = QuilvynUtils.getKeys(this.getChoices('levels'));
    if(assignedLevels == 0) {
      var classesToChoose =
        attributes.level == 1 || QuilvynUtils.random(1,10) < 9 ? 1 : 2;
      // Find choices that are valid or can be made so
      while(classesToChoose > 0) {
        var which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
        attributes[which] = 1;
        if(QuilvynUtils.sumMatching(this.applyRules(attributes),
             /^validationNotes.*(BaseAttack|CasterLevel|Spells)/) == 0) {
          assignedLevels++;
          classesToChoose--;
        } else {
          delete attributes[which];
        }
      }
    }
    while(assignedLevels < attributes.level) {
      var which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      while(!attributes[which]) {
        which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      }
      attributes[which]++;
      assignedLevels++;
    }
    delete attributes.level;
  } else if(attribute == 'name') {
    attributes['name'] = Pathfinder2E.randomName(attributes['ancestry']);
  } else if(attribute == 'shield') {
    attrs = this.applyRules(attributes);
    choices = [''];
    for(attr in this.getChoices('shields')) {
      if(attr == 'None' ||
         attrs['armorProficiency.Shield'] ||
         attrs['armorProficiency.' + attr]) {
        choices.push(attr);
      }
    }
    attributes['shield'] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'skills') {
    attrs = this.applyRules(attributes);
    var group = this.getChoices(attribute);
    for(attr in attrs) {
    var pat = new RegExp('^features.' + attribute.replace(/s$/, '') + ' Proficiency \\((.*)\\)$', 'i');
      if((matchInfo = attr.match(pat)) == null ||
         !matchInfo[1].match(/\bChoose\b/i))
        continue;
      var pieces = matchInfo[1].split('/');
      for(i = 0; i < pieces.length; i++) {
        matchInfo = pieces[i].match(/^Choose\s+(\d+)\s+from\s+(.*)$/i)
        if(!matchInfo)
          continue;
        var count = matchInfo[1] * 1;
        if(matchInfo[2].match(/^any$/i)) {
          choices = QuilvynUtils.getKeys(group);
        } else {
          choices = matchInfo[2].split(/\s*,\s*/);
          for(var j = choices.length - 1; j >= 0; j--) {
            if(choices[j].match(/^any\s+/i)) {
              var type = choices[j].replace(/^any\s+/, '');
              for(var item in group) {
                if(group[item].includes(type))
                  choices.push(item);
              }
              choices.splice(j, 1);
            }
          }
        }
        for(var k = choices.length - 1; k >= 0; k--) {
          if(!attrs[attribute + 'Chosen.' + choices[k]])
            continue;
          count--;
          choices.splice(k, 1);
        }
      }
      pickAttrs(attributes, attribute + 'Chosen.', choices, count, 1);
    }
    pickAttrs(
      attributes, attribute + 'Chosen.', QuilvynUtils.getKeys(group),
      attrs[attribute.replace(/s$/, '') + 'ChoiceCount'] -
      QuilvynUtils.sumMatching(attributes, '^' + attribute + 'Chosen'), 1
    );
  } else if(attribute == 'spells') {
    var availableSpellsByGroupAndLevel = {};
    var groupAndLevel;
    attrs = this.applyRules(attributes);
    for(attr in this.getChoices('spells')) {
      groupAndLevel = attr.split('(')[1].split(' ')[0];
      if(availableSpellsByGroupAndLevel[groupAndLevel] == null)
        availableSpellsByGroupAndLevel[groupAndLevel] = [];
      availableSpellsByGroupAndLevel[groupAndLevel].push(attr);
    }
    for(attr in attrs) {
      if((matchInfo = attr.match(/^spellSlots\.(.*)/)) == null)
        continue;
      groupAndLevel = matchInfo[1];
      howMany = attrs[attr];
      choices = availableSpellsByGroupAndLevel[groupAndLevel];
      if(choices != null) {
        var slots = attrs['spellSlots.' + groupAndLevel];
        if(slots != null && slots < howMany) {
          howMany = slots;
        }
        pickAttrs
          (attributes, 'spells.', choices, howMany -
           QuilvynUtils.sumMatching(attributes, '^spells\\..*[(]' + groupAndLevel + '[^0]'), 1);
      }
    }
  } else if(attribute == 'weapons') {
    var weapons = this.getChoices('weapons');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in weapons) {
      var category = QuilvynUtils.getAttrValue(weapons[attr], 'Category');
      if(category == null)
        category = 0;
      else if((category + '').match(/simple/i))
        category = 1;
      else if((category + '').match(/martial/i))
        category = 2;
      if(category == 0 ||
         attrs['weaponProficiency.Martial'] ||
         category == 1 && attrs['weaponProficiency.Simple'] ||
         attrs['weaponProficiency.' + attr]) {
        choices.push(attr);
      }
    }
    pickAttrs(attributes, 'weapons.', choices,
              3 - QuilvynUtils.sumMatching(attributes, /^weapons\./), 1);
  } else if(attribute == 'charisma' || attribute == 'constitution' ||
     attribute == 'dexterity' || attribute == 'intelligence' ||
     attribute == 'strength' || attribute == 'wisdom') {
    var rolls = [];
    for(i = 0; i < 4; i++)
      rolls[i] = QuilvynUtils.random(1, 6);
    rolls.sort();
    attributes[attribute] = rolls[1] + rolls[2] + rolls[3];
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
  }

};

/* Fixes as many validation errors in #attributes# as possible. */
Pathfinder2E.makeValid = function(attributes) {

  var attributesChanged = {};
  var debug = [];
  var notes = this.getChoices('notes');

  // If 8 passes don't get rid of all repairable problems, give up
  for(var pass = 0; pass < 8; pass++) {

    var applied = this.applyRules(attributes);
    var fixedThisPass = 0;

    // Try to fix each sanity/validation note w/a non-zero value
    for(var attr in applied) {

      var matchInfo =
        attr.match(/^(sanity|validation)Notes\.(.*)([A-Z][a-z]+)/);
      var attrValue = applied[attr];

      if(matchInfo == null || !attrValue || notes[attr] == null) {
        continue;
      }

      var problemSource = matchInfo[2];
      var problemCategory = matchInfo[3].substring(0, 1).toLowerCase() +
                            matchInfo[3].substring(1).replaceAll(' ', '');
      if(problemCategory == 'features') {
        problemCategory = 'selectableFeatures';
      }
      var requirements =
        notes[attr].replace(/^(Implies|Requires)\s/, '').split(/\s*\/\s*/);

      for(var i = 0; i < requirements.length; i++) {

        // Find a random requirement choice w/the format "name [op value]"
        var choices = requirements[i].split(/\s*\|\|\s*/);
        while(choices.length > 0) {
          var index = QuilvynUtils.random(0, choices.length - 1);
          matchInfo = choices[index].match(/^([^<>!=]+)(([<>!=~]+)(.*))?/);
          if(matchInfo != null) {
            break;
          }
          choices = choices.slice(0, index).concat(choice.slice(index + 1));
        }
        if(matchInfo == null) {
          continue;
        }

        var toFixCombiner = null;
        var toFixName = matchInfo[1].replace(/\s+$/, '');
        var toFixOp = matchInfo[3] == null ? '>=' : matchInfo[3];
        var toFixValue =
          matchInfo[4] == null ? 1 : matchInfo[4].replace(/^\s+/, '');;
        if(toFixName.match(/^(Max|Sum)/)) {
          toFixCombiner = toFixName.substring(0, 3);
          toFixName = toFixName.substring(4).replace(/^\s+/, '');
        }
        var toFixAttr = toFixName.substring(0, 1).toLowerCase() +
                        toFixName.substring(1).replaceAll(' ', '');

        // See if this attr has a set of choices (e.g., ancestry) or a category
        // attribute (e.g., a feat)
        choices = this.getChoices(toFixAttr + 's');
        if(choices == null) {
           choices = this.getChoices(problemCategory);
        }
        if(choices != null) {
          // Find the set of choices that satisfy the requirement
          var target =
            this.getChoices(problemCategory) == null ? toFixValue : toFixName;
          var possibilities = [];
          for(var choice in choices) {
            if((toFixOp.match(/[^!]=/) && choice == target) ||
               (toFixOp == '!=' && choice != target) ||
               (toFixCombiner != null && choice.indexOf(target) == 0) ||
               (toFixOp == '=~' && choice.match(new RegExp(target))) ||
               (toFixOp == '!~' && !choice.match(new RegExp(target)))) {
              possibilities.push(choice);
            }
          }
          if(possibilities.length == 0) {
            continue; // No fix possible
          }
          if(target == toFixName) {
            toFixAttr =
              problemCategory + '.' +
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          } else {
            toFixValue =
              possibilities[QuilvynUtils.random(0, possibilities.length - 1)];
          }
        }
        if((choices != null || attributes[toFixAttr] != null) &&
           attributesChanged[toFixAttr] == null) {
          // Directly-fixable problem
          debug.push(
            attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
            "' => '" + toFixValue + "'"
          );
          if(toFixValue == 0) {
            delete attributes[toFixAttr];
          } else {
            attributes[toFixAttr] = toFixValue;
          }
          attributesChanged[toFixAttr] = toFixValue;
          fixedThisPass++;
        } else if(problemCategory == 'total' && attrValue > 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too many items allocated in a category
          var possibilities = [];
          for(var k in attributes) {
            if(k.match('^' + problemSource + '\\.') &&
               attributesChanged[k] == null) {
               possibilities.push(k);
            }
          }
          while(possibilities.length > 0 && attrValue > 0) {
            var index = QuilvynUtils.random(0, possibilities.length - 1);
            toFixAttr = possibilities[index];
            possibilities =
              possibilities.slice(0,index).concat(possibilities.slice(index+1));
            var current = attributes[toFixAttr];
            toFixValue = current > attrValue ? current - attrValue : 0;
            debug.push(
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'"
            );
            if(toFixValue == 0) {
              delete attributes[toFixAttr];
            } else {
              attributes[toFixAttr] = toFixValue;
            }
            attrValue -= current - toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          }
        } else if(problemCategory == 'total' && attrValue < 0 &&
                  (choices = this.getChoices(problemSource)) != null) {
          // Too few items allocated in a category
          this.randomizeOneAttribute(attributes,
            problemSource == 'selectableFeatures' ? 'features' : problemSource
          );
          debug.push(attr + ' Allocate additional ' + problemSource);
          fixedThisPass++;
        } else if(attr.match(/validationNotes.abilityModifier(Sum|Minimum)/)) {
          // Special cases
          var abilities = {
            'charisma':'', 'constitution':'', 'dexterity':'',
            'intelligence':'', 'strength':'', 'wisdom':''
          };
          if(attr == 'validationNotes.abilityModifierMinimum') {
            toFixAttr = QuilvynUtils.randomKey(abilities);
            toFixValue = 14;
            debug.push(
              attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
              "' => '" + toFixValue + "'"
            );
            attributes[toFixAttr] = toFixValue;
            // Don't do this: attributesChanged[toFixAttr] = toFixValue;
            fixedThisPass++;
          } else {
            for(toFixAttr in abilities) {
              if(applied[toFixAttr + 'Modifier'] <= 0) {
                toFixValue = attributes[toFixAttr] + 2;
                debug.push(
                  attr + " '" + toFixAttr + "': '" + attributes[toFixAttr] +
                  "' => '" + toFixValue + "'"
                );
                attributes[toFixAttr] = toFixValue;
                // Don't do this: attributesChanged[toFixAttr] = toFixValue;
                fixedThisPass++;
              }
            }
          }
        }

      }

    }

    debug.push('-----');
    if(fixedThisPass == 0) {
      break;
    }

  }

  if(window.DEBUG)
    attributes.notes =
      (attributes.notes ? attributes.notes + '\n' : '') + debug.join('\n');

};

/* Returns HTML body content for user notes associated with this rule set. */
Pathfinder2E.ruleNotes = function() {
  return '' +
    '<h2>Pathfinder2E Quilvyn Module Notes</h2>\n' +
    'Pathfinder2E Quilvyn Module Version ' + Pathfinder2E_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '</p>\n';
};
