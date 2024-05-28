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
/* jshint forin: false */
/* globals ObjectViewer, Quilvyn, QuilvynRules, QuilvynUtils, SRD35 */
"use strict";

/*
 * This module loads the rules from the Pathfinder Reference Document v2. The
 * Pathfinder2E function contains methods that load rules for particular parts
 * of the PRD: ancestryRules for character ancestries, magicRules for spells,
 * etc. These member methods can be called independently in order to use a
 * subset of the PRD v2 rules. Similarly, the constant fields of Pathfinder2E
 * (ALIGNMENTS, FEATS, etc.) can be manipulated to modify the choices.
 */
function Pathfinder2E() {

  let rules = new QuilvynRules('Pathfinder 2E', Pathfinder2E.VERSION);
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
  rules.defineChoice('preset',
    'ancestry:Ancestry,select-one,ancestrys',
    'background:Background,select-one,backgrounds',
    'levels:Class Levels,bag,levels'
  );

  Pathfinder2E.abilityRules(rules, Pathfinder2E.ABILITIES);
  Pathfinder2E.combatRules
    (rules, Pathfinder2E.ARMORS, Pathfinder2E.SHIELDS, Pathfinder2E.WEAPONS);
  Pathfinder2E.magicRules(rules, Pathfinder2E.SCHOOLS, Pathfinder2E.SPELLS);
  Pathfinder2E.identityRules(
    rules, Pathfinder2E.ALIGNMENTS, Pathfinder2E.ANCESTRIES,
    Pathfinder2E.BACKGROUNDS, Pathfinder2E.CLASSES, Pathfinder2E.DEITIES
  );
  Pathfinder2E.talentRules(
    rules, Pathfinder2E.FEATS, Pathfinder2E.FEATURES, Pathfinder2E.GOODIES,
    Pathfinder2E.LANGUAGES, Pathfinder2E.SKILLS
  );

  Quilvyn.addRuleSet(rules);

}

Pathfinder2E.VERSION = '2.2.1.0';

/* List of items handled by choiceRules method. */
Pathfinder2E.CHOICES = [
  'Alignment', 'Ancestry', 'Armor', 'Background', 'Class', 'Deity', 'Feat',
  'Feature', 'Goody', 'Language', 'School', 'Shield', 'Skill', 'Spell',
  'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
Pathfinder2E.RANDOMIZABLE_ATTRIBUTES = [
  'abilities',
  'strength', 'constitution', 'dexterity', 'intelligence', 'wisdom', 'charisma',
  'ancestry', 'gender', 'name', 'alignment', 'background', 'deity',
  'levels', 'boosts', 'features', 'feats', 'skills', 'languages',
  'hitPoints', 'armor', 'weapons', 'shield', 'spells', 'boosts'
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
  'Dwarf':
    'HitPoints=10 ' +
    'Features=' +
      '1:Slow,' +
      '"1:Ability Boost (Constitution; Wisdom; Choose 1 from Charisma, Dexterity, Intelligence, Strength)",' +
      '"1:Ability Flaw (Charisma)",' +
      '1:Darkvision,"1:Clan Dagger" ' +
    'Selectables=' +
      '"1:Ancient-Blooded Dwarf","1:Death Warden Dwarf","1:Forge Dwarf",' +
      '"1:Rock Dwarf","1:Strong-Blooded Dwarf" ' +
    'Traits=Dwarf,Humanoid ' +
    'Languages=Common,Dwarven',
  'Elf':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boost (Dexterity; Intelligence; Choose 1 from Charisma, Constitution, Strength, Wisdom)",' +
      '"1:Ability Flaw (Constitution)",' +
      '"1:Low-Light Vision" ' +
    'Selectables=' +
      '"1:Arctic Elf","1:Cavern Elf","1:Seer Elf","1:Whisper Elf",' +
      '"1:Woodland Elf" ' +
    'Traits=Elf,Humanoid ' +
    'Languages=Common,Elven',
  'Gnome':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boost (Charisma; Constitution; Choose 1 from Dexterity, Intelligence, Strength, Wisdom)",' +
      '"1:Ability Flaw (Strength)",' +
      '"1:Low-Light Vision",1:Small ' +
    'Selectables=' +
      '"1:Chameleon Gnome","1:Fey-Touched Gnome","1:Sensate Gnome",' +
      '"1:Umbral Gnome","1:Wellspring Gnome" ' +
    'Traits=Gnome,Humanoid ' +
    'Languages=Common,Gnomish,Sylvan',
  'Goblin':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boost (Charisma; Dexterity; Choose 1 from Constitution, Intelligence, Strength, Wisdom)",' +
      '"1:Ability Flaw (Wisdom)",' +
      '1:Darkvision,1:Small ' +
    'Selectables=' +
      '"1:Charhide Goblin","1:Irongut Goblin","1:Razortooth Goblin",' +
      '"1:Snow Goblin","1:Unbreakable Goblin" ' +
    'Languages=Common,Goblin',
  'Halfling':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boost (Dexterity; Wisdom; Choose 1 from Charisma, Constitution, Intelligence, Strength)",' +
      '"1:Ability Flaw (Strength)",' +
      '"1:Keen Eyes",1:Small ' +
    'Selectables=' +
      '"1:Gutsy Halfling","1:Hillock Halfling","1:Nomadic Halfling",' +
      '"1:Twilight Halfling","1:Wildwood Halfling" ' +
    'Traits=Humanoid,Halfling ' +
    'Languages=Common,Halfling',
  'Human':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boost (Choose 2 from any)" ' +
    'Selectables=' +
      '1:Half-Elf,1:Half-Orc,"1:Skilled Heritage","1:Versatile Heritage" ' +
    'Traits=Humanoid,Human ' +
    'Languages=Common,any'
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
  'Acolyte':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from Charisma, Constitution, Dexterity, Strength)",'+
      '"1:Skill Trained (Religion; Scribing Lore)","1:Student Of The Canon"',
  'Acrobat':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from Charisma, Constitution, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Acrobatics; Circus Lore)","1:Steady Balance"',
  'Animal Whisperer':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Wisdom; Choose 1 from Constitution, Dexterity, Intelligence, Strength)",' +
      '"1:Skill Trained (Nature; Choose 1 from Plains Lore, Swamp Lore)",' +
      '"1:Train Animal"',
  'Artisan':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Strength; Choose 1 from Charisma, Constitution, Dexterity, Wisdom)",' +
      '"1:Skill Trained (Crafting; Guild Lore)","1:Specialty Crafting"',
  'Artist':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from Constitution, Intelligence, Strength, Wisdom)",' +
      '"1:Skill Trained (Crafting; Art Lore)","1:Specialty Crafting"',
  'Barkeep':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Constitution; Choose 1 from Dexterity, Intelligence, Strength, Wisdom)",' +
      '"1:Skill Trained (Diplomacy; Alcohol Lore)",1:Hobnobber',
  'Barrister':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from Constitution, Dexterity, Strength, Wisdom)",' +
      '"1:Skill Trained (Diplomacy; Legal Lore)","1:Group Impression"',
  'Bounty Hunter':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Strength, Wisdom; Choose 1 from Charisma, Constitution, Dexterity, Intelligence)",' +
      '"1:Skill Trained (Survival; Legal Lore)","1:Experienced Tracker"',
  'Charlatan':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from Constitution, Dexterity, Strength, Wisdom)",' +
      '"1:Skill Trained (Deception; Underworld Lore)","1:Charming Liar"',
  'Criminal':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Intelligence; Choose 1 from Charisma, Constitution, Strength, Wisdom)",' +
      '"1:Skill Trained (Stealth; Underworld Lore)","1:Experienced Smuggler"',
  'Detective':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from Charisma, Constitution, Dexterity, Strength)",' +
      '"1:Skill Trained (Society; Underworld Lore)",1:Streetwise',
  'Emissary':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from Constitution, Dexterity, Strength, Wisdom)",' +
      '"1:Skill Trained; Society; City Lore",1:Multilingual',
  'Entertainer':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from Constitution, Intelligence, Strength, Wisdom)",' +
      '"1:Skill Trained (Performance; Theater Lore)",' +
      '"1:Fascinating Performance"',
  'Farmhand':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from Charisma, Dexterity, Intelligence, Strength)",' +
      '"1:Skill Trained (Athletics; Farming Lore)","1:Assurance (Athletics)"',
  'Field Medic':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from Charisma, Dexterity, Intelligence, Strength)",' +
      '"1:Skill Trained (Medicine; Warfare Lore)","1:Battle Medicine"',
  'Fortune Teller':
    'Features=' +
      '"1:Ability Boost; Choose 1 from Charisma, Intelligence; Choose 1 from Constitution, Dexterity, Strength, Wisdom)",' +
      '"1:Skill Trained (Occultism; Fortune-Telling Lore)",' +
      '"1:Oddity Identification"',
  'Gambler':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from Constitution, Intelligence, Strength, Wisdom)",' +
      '"1:Skill Trained (Deception; Games Lore)","1:Lie To Me"',
  'Gladiator':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Strength; Choose 1 from Constitution, Dexterity, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Performance; Gladitorial Lore)",' +
      '"1:Impressive Performance"',
  'Guard':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Strength; Choose 1 from Constitution, Dexterity, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Intimidation; Legal Lore)","1:Quick Coercion"',
  'Herbalist':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from Charisma, Dexterity, Intelligence, Strength)",' +
      '"1:Skill Trained (Nature; Herbalism Lore)","1:Natural Medicine"',
  'Hermit':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Intelligence; Choose 1 from Charisma, Dexterity, Strength, Wisdom)",' +
      '"1:Skill Trained (Nature; Choose 1 from Cave Lore, Desert)",' +
      '"1:Dubious Knowledge"',
  'Hunter':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from Charisma, Constitution, Intelligence, Strength)",' +
      '"1:Skill Trained (Survival; Tanning Lore)","1:Survey Wildlife"',
  'Laborer':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from Charisma, Dexterity, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Athletics; Labor Lore)","1:Hefty Hauler"',
  'Martial Disciple':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from Charisma, Constitution, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Choose 1 from Acrobatics, Athletics; Warfare Lore)",' +
      // TODO: Cat Fall if Acrobatics chosen; Quick Jump if Athletics chosen
      '"1:Cat Fall",' +
      '"1:Quick Jump"',
  'Merchant':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from Constitution, Dexterity, Strength, Wisdom)",' +
      '"1:Skill Trained (Diplomacy, Mercantile Lore)","1:Bargain Hunter"',
  'Miner':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Strength, Wisdom; Choose 1 from Charisma, Constitution, Dexterity, Intelligence)",' +
      '"1:Skill Trained (Survival; Mining Lore)",' +
      '"1:Terrain Expertise (Underground)"',
  'Noble':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from Constitution, Dexterity, Strength, Wisdom)",' +
      '"1:Skill Trained (Society; Heraldry Lore)","1:Courtly Graces"',
  'Nomad':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from Charisma, Dexterity, Intelligence, Strength)",' +
      '"1:Skill Trained (Survival; Choose 1 from Desert Lore, Swamp Lore)",' +
      '"1:Assurance (Survival)"',
  'Prisoner':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from Charisma, Dexterity, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Stealth; Underworld Lore)","1:Experienced Smuggler"',
  'Sailor':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from Charisma, Constitution, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Athletics; Sailing Lore)","1:Underwater Marauder"',
  'Scholar':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from Charisma, Constitution, Dexterity, Strength)",' +
      '"1:Skill Trained (Choose 1 from Arcana, Nature, Occultism, Religion; Academia Lore)",' +
      '"1:Assurance (chosen skill)"',
  'Scout':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from Charisma, Constitution, Intelligence, Strength)",' +
      '"1:Skill Trained (Survival; Choose 1 from Cavern Lore, Forest Lore)",' +
      '1:Forager',
  'Street Urchin':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Dexterity; Choose 1 from Charisma, Intelligence, Strength, Wisdom)",' +
      '"1:Skill Trained (Thieving; City Lore)",1:Pickpocket',
  'Tinker':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Intelligence; Choose 1 from Charisma, Constitution, Strength, Wisdom)",' +
      '"1:Skill Trained (Crafting; Engineering Lore)","1:Specialty Crafting"',
  'Warrior':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from Charisma, Dexterity, Intelligence, Wisdom)",' +
      '"1:Skill Trained (Intimidation; Warfare Lore)","1:Intimidating Glare"'
};
Pathfinder2E.CLASSES = {
  'Alchemist':
    'Ability=intelligence HitPoints=8 ' +
    'Features=' +
      '"1:Perception Trained",' +
      '"1:Skill Trained (Crafting; Choose 3 from any)",' +
      '"1:Attack Trained (Simple; Alchemical Bombs; Unarmed)",' +
      '"1:Defense Trained (Light Armor; Unarmored)"',
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
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Skill Trained (Choose 1 from Acrobatics, Athletics; Choose 3 from any)",' +
      '"1:Attack Expert (Simple; Martial; Unarmed)","1:Attack Trained (Advanced)",' +
      '"1:Defense Trained (Armor; Unarmored)",' +
      '"1:Attack Of Opportunity","1:Fighter Feats","1:Shield Block",' +
      '"2:Skill Feats",3:Bravery,"3:General Feats","3:Skill Increases",' +
      '"5:Ability Boosts","5:Fighter Weapon Mastery","7:Battlefield Surveyor",'+
      '"7:Weapon Specialization","9:Combat Flexibility",9:Juggernaut,' +
      '"11:Armor Expertise","11:Fighter Expertise","13:Weapon Legend",' +
      '15:Evasion,"15:Greater Weapon Specialization",' +
      '"15:Improved Flexibility","17:Armor Mastery","19:Versatile Legend"',
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
    'Spells="1:Illusory Object",4:Creation,"7:Magnificent Mansion"',
  'Asmodeus':
    'Alignment=LE Font=Harm Skill=Deception Weapon=Mace ' +
    'Domain=Confidence,Fire,Trickery,Tyranny ' +
    'Spells=1:Charm,4:Suggestion,6:Mislead',
  'Calistra':
    'Alignment=CN Font=Harm,Heal Skill=Deception Weapon=Whip ' +
    'Domain=Pain,Passion,Secrecy,Trickery ' +
    'Spells=1:Charm,3:Enthrall,6:Mislead',
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
  // Ancestries
  'Dwarven Lore':'Type=Ancestry,Dwarf',
  'Dwarven Weapon Familiarity':'Type=Ancestry,Dwarf',
  'Rock Runner':'Type=Ancestry,Dwarf',
  'Stonecunning':'Type=Ancestry,Dwarf',
  'Unburdened Iron':'Type=Ancestry,Dwarf',
  'Vengeful Hatred':'Type=Ancestry,Dwarf',
  'Boulder Roll':
    'Type=Ancestry,Dwarf Require="level>=5","features.Rock Runner"',
  'Dwarven Weapon Cunning':
    'Type=Ancestry,Dwarf ' +
    'Require="level>=5","features.Dwarven Weapon Familiarity"',
  "Mountain's Stoutness":'Type=Ancestry,Dwarf Require="level>=9"',
  'Stonewalker':'Type=Ancestry,Dwarf Require="level>=9"',
  'Dwarven Weapon Expertise':
    'Type=Ancestry,Dwarf ' +
    'Require="level>=13","features.Dwarven Weapon Familiarity"',

  // NOTE requires age >= 100
  'Ancestral Longevity':'Type=Ancestry,Elf',
  'Elven Lore':'Type=Ancestry,Elf',
  'Elven Weapon Familiarity':'Type=Ancestry,Elf',
  'Forlorn':'Type=Ancestry,Elf',
  'Nimble Elf':'Type=Ancestry,Elf',
  'Otherworldly Magic':'Type=Ancestry,Elf',
  'Unwavering Mien':'Type=Ancestry,Elf',
  'Ageless Patience':'Type=Ancestry,Elf Require="level>=5"',
  'Elven Weapon Elegance':
    'Type=Ancestry,Elf Require="level>=5","features.Elven Weapon Familiarity"',
  'Elf Step':'Type=Ancestry,Elf Require="level>=9"',
  'Expert Longevity':
    'Type=Ancestry,Elf Require="level>=9","features.Ancestral Longevity"',
  'Universal Longevity':
    'Type=Ancestry,Elf Require="level>=13","features.Expert Longevity"',
  'Elven Weapon Expertise':
    'Type=Ancestry,Elf ' +
    'Require="level>=13","features.Elven Weapon Familiarity"',

  'Animal Accomplice':'Type=Ancestry,Gnome',
  'Burrow Elocutionist':'Type=Ancestry,Gnome',
  'Fey Fellowship':'Type=Ancestry,Gnome',
  'First World Magic':'Type=Ancestry,Gnome',
  'Gnome Obsession':'Type=Ancestry,Gnome',
  'Gnome Weapon Familiarity':'Type=Ancestry,Gnome',
  'Illusion Sense':'Type=Ancestry,Gnome',
  'Animal Elocutionist':
    'Type=Ancestry,Gnome Require="level>=5","features.Burrow Elocutionist"',
  // TODO requires "at least one innate spell from a gnome heritage or ancestry feat that shares a tradition with at least on of your focus spells"
  'Energized Font':
    'Type=Ancestry,Gnome Require="level>=5","features.Focus Pool"',
  'Gnome Weapon Innovator':
    'Type=Ancestry,Gnome ' +
    'Require="level >= 5","features.Gnome Weapon Familiarity"',
  // TODO requires "at least one primal innate spell"
  'First World Adept':'Type=Ancestry,Gnome Require="level >= 9"',
  'Vivacious Conduit':'Type=Ancestry,Gnome Require="level >= 9"',
  'Gnome Weapon Expertise':
    'Type=Ancestry,Gnome ' +
    'Require="gnomeLevel >= 13","features.Gnome Weapon Familiarity"',

  'Burn It!':'Type=Ancestry,Goblin',
  'City Scavenger':'Type=Ancestry,Goblin',
  'Goblin Lore':'Type=Ancestry,Goblin',
  'Goblin Scuttle':'Type=Ancestry,Goblin',
  'Goblin Song':'Type=Ancestry,Goblin',
  'Goblin Weapon Familiarity':'Type=Ancestry,Goblin',
  'Junk Tinker':'Type=Ancestry,Goblin',
  'Rough Rider':'Type=Ancestry,Goblin',
  'Very Sneaky':'Type=Ancestry,Goblin',
  'Goblin Weapon Frenzy':
    'Type=Ancestry,Goblin ' +
    'Require="level >= 5","features.Goblin Weapon Familiarity"',
  'Cave Climber':'Type=Ancestry,Goblin Require="level >= 9"',
  'Skittering Scuttle':
    'Type=Ancestry,Goblin Require="level >= 9","features.Goblin Scuttle"',
  'Goblin Weapon Expertise':
    'Type=Ancestry,Goblin ' +
    'Require="level >= 13","features.Goblin Weapon Familiarity"',
  'Very, Very Sneaky':
    'Type=Ancestry,Goblin Require="level >= 13","features.Very Sneaky"',
  'Distracting Shadows':'Type=Ancestry,Halfling',
  'Halfling Lore':'Type=Ancestry,Halfling',
  'Halfling Luck':'Type=Ancestry,Halfling',
  'Halfling Weapon Familiarity':'Type=Ancestry,Halfling',
  'Sure Feet':'Type=Ancestry,Halfling',
  'Titan Slinger':'Type=Ancestry,Halfling',
  'Unfettered Halfling':'Type=Ancestry,Halfling',
  'Watchful Halfling':'Type=Ancestry,Halfling',
  'Cultural Adaptability':'Type=Ancestry,Halfling Require="level >= 5"',
  'Halfling Weapon Trickster':
    'Type=Ancestry,Halfling ' +
    'Require="level >= 5","features.Halfling Weapon Familiarity"',
  'Guiding Luck':
    'Type=Ancestry,Halfling Require="level >= 9","features.Halfling Luck"',
  'Irrepressible':'Type=Ancestry,Halfling Require="level >= 9"',
  'Ceaseless Shadows':
    'Type=Ancestry,Halfling ' +
    'Require="level >= 13","features.Distracting Shadows"',
  'Halfling Weapon Expertise':
    'Type=Ancestry,Halfling ' +
    'Require="level >= 13","features.Halfling Weapon Familiarity"',
  'Adapted Cantrip':'Type=Ancestry,Human Require=features.Spellcasting',
  'Cooperative Nature':'Type=Ancestry,Human',
  'General Training':'Type=Ancestry,Human',
  'Haughty Obstinacy':'Type=Ancestry,Human',
  'Natural Ambition':'Type=Ancestry,Human',
  'Natural Skill':'Type=Ancestry,Human',
  'Unconventional Weaponry':'Type=Ancestry,Human',
  // TODO requires "can cast 3rd level spells"
  'Adaptive Adept':
    'Type=Ancestry,Human Require="level >= 5","features.Adapted Cantrip"',
  'Clever Improviser':'Type=Ancestry,Human Require="level >= 5"',
  'Cooperative Soul':
    'Type=Ancestry,Human Require="level >= 9","features.Cooperative Nature"',
  'Incredible Improvisation':
    'Type=Ancestry,Human Require="level >= 9","features.Clever Improviser"',
  'Multitalented':'Type=Ancestry,Human Require="level >= 9"',
  // TODO requires "trained in the weapon you chose for Unconventional Weaponry"
  'Unconventional Expertise':
    'Type=Ancestry,Human ' +
    'Require="level >= 13","features.Unconventional Weaponry"',
  'Elf Atavism':'Type=Ancestry,Half-Elf',
  'Inspire Imitation':'Type=Ancestry,Half-Elf Require="level >= 5"',
  'Supernatural Charm':'Type=Ancestry,Half-Elf Require="level >= 5"',
  'Monstrous Peacemaker':'Type=Ancestry,Half-Orc',
  'Orc Ferocity':'Type=Ancestry,Orc',
  'Orc Sight':'Type=Ancestry,Half-Orc Require="features.Low-Light Vision"',
  'Orc Superstition':'Type=Ancestry,Orc',
  'Orc Weapon Familiarity':'Type=Ancestry,Orc',
  'Orc Weapon Carnage':
    'Type=Ancestry,Orc Require="level >= 5","features.Orc Weapon Familiarity"',
  'Victorious Vigor':'Type=Ancestry,Orc Require="level >= 5"',
  'Pervasive Superstition':
    'Type=Ancestry,Orc Require="level >= 9","features.Orc Superstition"',
  'Incredible Ferocity':
    'Type=Ancestry,Orc Require="level >= 13","features.Orc Ferocity"',
  'Orc Weapon Expertise':
    'Type=Ancestry,Half-Orc ' +
    'Require="level >= 13","features.Orc Weapon Familiarity"',

  // Class
  'Quick Alchemy':'Type=Class,Alchemist',
  'Alchemical Familiar':'Type=Class,Alchemist',
  'Alchemical Alchemical Savant':
    'Type=Class,Alchemist Require=skillStep.Crafting>=1',
  'Far Lobber':'Type=Class,Alchemist',
  'Quick Bomber':'Type=Class,Alchemist',
  'Poison Resistance':'Type=Class,Alchemist Require=level>=2',
  'Revivifying Mutagen':'Type=Class,Alchemist Require=level>=2',
  'Smoke Bomb':'Type=Class,Alchemist Require=level>=2',
  'Calculated Splash':'Type=Class,Alchemist Require=level>=4',
  'Efficient Alchemy':'Type=Class,Alchemist Require=level>=4',
  'Enduring Alchemy':'Type=Class,Alchemist Require=level>=4',
  'Combine Elixirs':'Type=Class,Alchemist Require=level>=6',
  'Debilitating Bomb':'Type=Class,Alchemist Require=level>=6',
  'Directional Bomb':'Type=Class,Alchemist Require=level>=6',
  'Feral Mutagen':'Type=Class,Alchemist Require=level>=8',
  'Powerful Alchemy':'Type=Class,Alchemist Require=level>=8',
  'Sticky Bomb':'Type=Class,Alchemist Require=level>=8',
  'Elastic Mutagen':'Type=Class,Alchemist Require=level>=10',
  'Extended Splash':
    'Type=Class,Alchemist Require=level>=10,"features.Calculated Spash"',
  'Greater Debilitating Bomb':
    'Type=Class,Alchemist Require=level>=10,"features.Debilitating Bomb"',
  'Merciful Elixir':'Type=Class,Alchemist Require=level>=10',
  'Potent Poisoner':
    'Type=Class,Alchemist Require=level>=10,"features.Powerful Alchemy"',
  'Extend Elixir':'Type=Class,Alchemist Require=level>=12',
  'Invincible Mutagen':'Type=Class,Alchemist Require=level>=12',
  'Uncanny Bombs':
    'Type=Class,Alchemist Require=level>=12,"features.Far Lobber"',
  'Glib Mutagen':'Type=Class,Alchemist Require=level>=14',
  'Greater Merciful Elixir':
    'Type=Class,Alchemist Require=level>=14,"features.Merciful Elixir"',
  'True Debilitating Bomb':
    'Type=Class,Alchemist ' +
    'Require=level>=14,"features.Greater Debilitating Bomb"',
  'Eternal Elixir':
    'Type=Class,Alchemist Require=level>=16,"features.Extend Elixir"',
  'Exploitive Bomb':'Type=Class,Alchemist Require=level>=16',
  'Genius Mutagen':'Type=Class,Alchemist Require=level>=16',
  'Persistent Mutagen':
    'Type=Class,Alchemist Require=level>=16,"features.Extend Elixir"',
  'Improbable Elixirs':'Type=Class,Alchemist Require=level>=18',
  'Mindblank Mutagen':'Type=Class,Alchemist Require=level>=18',
  'Miracle Worker':'Type=Class,Alchemist Require=level>=18',
  'Perfect Debilitation':'Type=Class,Alchemist Require=level>=18',
  "Craft Philosopher's Stone":'Type=Class,Alchemist Require=level>=20',
  'Mega Bomb':
    'Type=Class,Alchemist Require=level>=20,"features.Expanded Splash"',
  'Perfect Mutagen':'Type=Class,Alchemist Require=level>=20',

  'Double Slice':'Type=Class,Fighter',
  'Exacting Strike':'Type=Class,Fighter',
  'Point-Blank Shot':'Type=Class,Fighter',
  'Power Attack':'Type=Class,Fighter',
  'Reactive Shield':'Type=Class,Fighter',
  'Snagging Strike':'Type=Class,Fighter',
  'Sudden Charge':'Type=Class,Fighter',
  'Aggressive Block':'Type=Class,Fighter Require="level >= 2"',
  'Assisting Shot':'Type=Class,Fighter Require="level >= 2"',
  'Brutish Shove':'Type=Class,Fighter Require="level >= 2"',
  'Combat Grab':'Type=Class,Fighter Require="level >= 2"',
  'Dueling Parry':'Type=Class,Fighter Require="level >= 2"',
  'Intimidating Strike':'Type=Class,Fighter Require="level >= 2"',
  'Lunge':'Type=Class,Fighter Require="level >= 2"',
  'Double Shot':'Type=Class,Fighter Require="level >= 4"',
  'Dual-Handed Assault':'Type=Class,Fighter Require="level >= 4"',
  'Knockdown':'Type=Class,Fighter Require="level >= 4"',
  'Powerful Shove':
    'Type=Class,Fighter ' +
    'Require="level >= 4","features.Aggressive Block||features.Brutish Shove"',
  'Quick Reversal':'Type=Class,Fighter Require="level >= 4"',
  'Shielded Stride':'Type=Class,Fighter Require="level >= 4"',
  'Swipe':'Type=Class,Fighter Require="level >= 4"',
  'Twin Parry':'Type=Class,Fighter Require="level >= 4"',
  'Advanced Weapon Training':'Type=Class,Fighter Require="level >= 6"',
  'Advantageous Assault':'Type=Class,Fighter Require="level >= 6"',
  // TODO requires trained in Athletics
  'Disarming Stance':'Type=Class,Fighter Require="level >= 6"',
  'Furious Focus':
    'Type=Class,Fighter Require="level >= 6","features.Power Attack"',
  "Guardian's Deflection":'Type=Class,Fighter Require="level >= 6"',
  'Reflexive Shield':'Type=Class,Fighter Require="level >= 6"',
  'Revealing Stab':'Type=Class,Fighter Require="level >= 6"',
  'Shatter Defenses':'Type=Class,Fighter Require="level >= 6"',
  'Shield Warden':
    'Type=Class,Fighter Require="level >= 6","features.Shield Block"',
  'Triple Shot':
    'Type=Class,Fighter Require="level >= 6","features.Double Shot"',
  // TODO requires master in Perception
  'Blind Fight':'Type=Class,Fighter Require="level >= 8"',
  'Dueling Riposte':
    'Type=Class,Fighter Require="level >= 8","features.Dueling Parry"',
  'Felling Strike':'Type=Class,Fighter Require="level >= 8"',
  'Incredible Aim':'Type=Class,Fighter Require="level >= 8"',
  'Mobile Shot Stance':'Type=Class,Fighter Require="level >= 8"',
  'Positioning Assault':'Type=Class,Fighter Require="level >= 8"',
  'Quick Shield Block':
    'Type=Class,Fighter ' +
    'Require="level >= 8","features.Shield Block","features.Reactive Shield"',
  'Sudden Leap':'Type=Class,Fighter Require="level >= 8"',
  'Agile Grace':'Type=Class,Fighter Require="level >= 10"',
  'Certain Strike':'Type=Class,Fighter Require="level >= 10"',
  'Combat Reflexes':'Type=Class,Fighter Require="level >= 10"',
  'Debilitating Shot':'Type=Class,Fighter Require="level >= 10"',
  // TODO requires trained in Athletics
  'Disarming Twist':'Type=Class,Fighter Require="level >= 10"',
  'Disruptive Stance':'Type=Class,Fighter Require="level >= 10"',
  'Fearsome Brute':'Type=Class,Fighter Require="level >= 10"',
  'Improved Knockdown':
    'Type=Class,Fighter Require="level >= 10",features.Knockdown',
  'Mirror Shield':'Type=Class,Fighter Require="level >= 10"',
  'Twin Riposte':
    'Type=Class,Fighter Require="level >= 10","features.Twin Parry"',
  'Brutal Finish':'Type=Class,Fighter Require="level >= 12"',
  'Dueling Dance':
    'Type=Class,Fighter Require="level >= 12","features.Dueling Parry"',
  'Flinging Shove':
    'Type=Class,Fighter ' +
    'Require="level >= 12","features.Aggressive Block||features.Brutish Shove"',
  'Improved Dueling Riposte':
    'Type=Class,Fighter Require="level >= 12","features.Dueling Riposte"',
  'Incredible Ricochet':
    'Type=Class,Fighter Require="level >= 12","features.Incredible Aim"',
  'Lunging Stance':
    'Type=Class,Fighter ' +
    'Require="level >= 12","features.Attack Of Opportunity","features.Lunge"',
  "Paragon's Guard":'Type=Class,Fighter Require="level >= 12"',
  'Spring Attack':'Type=Class,Fighter Require="level >= 12"',
  // TODO requires ability to use press action
  'Desperate Finisher':'Type=Class,Fighter Require="level >= 14"',
  'Determination':'Type=Class,Fighter Require="level >= 14"',
  'Guiding Finish':'Type=Class,Fighter Require="level >= 14"',
  'Guiding Riposte':
    'Type=Class,Fighter Require="level >= 14","features.Dueling Riposte"',
  'Improved Twin Riposte':
    'Type=Class,Fighter Require="level >= 14","features.Twin Riposte"',
  'Stance Savant':'Type=Class,Fighter Require="level >= 14"',
  'Two-Weapon Flurry':'Type=Class,Fighter Require="level >= 14"',
  'Whirlwind Strike':'Type=Class,Fighter Require="level >= 14"',
  'Graceful Poise':
    'Type=Class,Fighter Require="level >= 16","features.Double Slice"',
  'Improved Reflexive Shield':
    'Type=Class,Fighter Require="level >= 16","features.Reflexive Shield"',
  'Multishot Stance':
    'Type=Class,Fighter Require="level >= 16","features.Triple Shot"',
  'Twinned Defense':
    'Type=Class,Fighter Require="level >= 16","features.Twin Parry"',
  'Impossible Volley':'Type=Class,Fighter Require="level >= 18"',
  'Savage Critical':'Type=Class,Fighter Require="level >= 18"',
  'Boundless Reprisals':'Type=Class,Fighter Require="level >= 20"',
  'Weapon Supremacy':'Type=Class,Fighter Require="level >= 20"',

  // General
  'Adopted Ancestry':'Type=General',
  'Armor Proficiency':'Type=General',
  'Breath Control':'Type=General',
  'Canny Acumen':'Type=General',
  'Diehard':'Type=General',
  'Fast Recovery':'Type=General Require="constitution >= 14"',
  'Feather Step':'Type=General Require="dexterity >= 14"',
  'Fleet':'Type=General',
  'Incredible Initiative':'Type=General',
  'Ride':'Type=General',
  'Shield Block':'Type=General',
  'Toughness':'Type=General',
  'Weapon Proficiency':'Type=General',
  'Ancestral Paragon':'Type=General Require="level >= 3"',
  'Untrained Improvisation':'Type=General Require="level >= 3"',
  'Expeditious Search':
    'Type=General Require="level >= 7","perception >= 2"',
  'Incredible Investiture':
    'Type=General Require="level >= 11","charisma >= 16"',
  'Assurance (%skill)':'Type=Skill',
  'Dubious Knowledge':'Type=Skill Require="skills.Recall Knowledge >= 1"',
  'Quick Identification':
    'Type=Skill ' +
    'Require="skills.Arcana >= 1 || skills.Nature >= 1 || skills.Occultism >= 1 || skills.Religion >= 1"',
  'Recognize Spell':
    'Type=Skill ' +
    'Require="skills.Arcana >= 1 || skills.Nature >= 1 || skills.Occultism >= 1 || skills.Religion >= 1"',
  'Skill Training':'Type=Skill',
  'Trick Magic Item':
    'Type=Skill ' +
    'Require="skills.Arcana >= 1 || skills.Nature >= 1 || skills.Occultism >= 1 || skills.Religion >= 1"',
  'Automatic Knowledge':
    'Type=Skill Require="level >= 2","skills.Recall Knowledge >= 2"',
  'Magical Shorthand':
    'Type=Skill ' +
    'Require="level >= 2","skills.Arcana >= 2 || skills.Nature >= 2 || skills.Occultism >= 2 || skills.Religion >= 2"',
  'Quick Recognition':
    'Type=Skill ' +
    'Require="level >= 7","skills.Arcana >= 3 || skills.Nature >= 3 || skills.Occultism >= 3 || skills.Religion >= 3","features.Recognize Spell"',
  'Cat Fall':'Type=Skill Require="skills.Acrobatics >= 1"',
  'Quick Squeeze':'Type=Skill Require="skills.Acrobatics >= 1"',
  'Steady Balance':'Type=Skill Require="skills.Acrobatics >= 1"',
  'Nimble Crawl':'Type=Skill Require="level >= 2","skills.Acrobatics >= 2"',
  'Kip Up':'Type=Skill Require="level >= 7","skills.Acrobatics >= 3"',
  'Arcane Sense':'Type=Skill Require="skills.Arcana >= 1"',
  'Unified Theory':'Type=Skill Require="level >= 15","skills.Acrobatics >= 4"',
  'Combat Climber':'Type=Skill Require="skills.Athletics >= 1"',
  'Hefty Hauler':'Type=Skill Require="skills.Athletics >= 1"',
  'Quick Jump':'Type=Skill Require="skills.Athletics >= 1"',
  'Titan Wrestler':'Type=Skill Require="skills.Athletics >= 1"',
  'Underwater Marauder':'Type=Skill Require="skills.Athletics >= 1"',
  'Powerful Leap':'Type=Skill Require="level >= 2","skills.Athletics >= 2"',
  'Rapid Mantel':'Type=Skill Require="level >= 2","skills.Athletics >= 2"',
  'Quick Climb':'Type=Skill Require="level >= 7","skills.Athletics >= 3"',
  'Quick Swim':'Type=Skill Require="level >= 7","skills.Athletics >= 3"',
  'Wall Jump':'Type=Skill Require="level >= 7","skills.Athletics >= 3"',
  'Cloud Jump':'Type=Skill Require="level >= 15","skills.Athletics >= 4"',
  'Alchemical Crafting':'Type=Skill Require="skills.Crafting >= 1"',
  'Quick Repair':'Type=Skill Require="skills.Crafting >= 1"',
  'Snare Crafting':'Type=Skill Require="skills.Crafting >= 1"',
  'Specialty Crafting':'Type=Skill Require="skills.Crafting >= 1"',
  'Magical Crafting':'Type=Skill Require="level >= 2","skills.Crafting >= 2"',
  'Impeccable Crafting':
    'Type=Skill ' +
    'Require="level >= 7","skills.Crafting >= 3","features.Specialty Crafting"',
  'Inventor':'Type=Skill Require="level >= 7","skills.Crafting >= 3"',
  'Craft Anything':'Type=Skill Require="level >= 15","skills.Crafting >= 4"',
  'Charming Liar':'Type=Skill Require="skills.Deception >= 1"',
  'Lengthy Diversion':'Type=Skill Require="skills.Deception >= 1"',
  'Lie To Me':'Type=Skill Require="skills.Deception >= 1"',
  'Confabulator':'Type=Skill Require="level >= 2","skills.Deception >= 2"',
  'Quick Disguise':'Type=Skill Require="level >= 2","skills.Deception >= 2"',
  'Slippery Secrets':'Type=Skill Require="level >= 7","skills.Deception >= 3"',
  'Bargain Hunter':'Type=Skill Require="skills.Diplomacy >= 1"',
  'Group Impression':'Type=Skill Require="skills.Diplomacy >= 1"',
  'Hobnobber':'Type=Skill Require="skills.Diplomacy >= 1"',
  'Glad-Hand':'Type=Skill Require="level >= 2","skills.Diplomacy >= 2"',
  'Shameless Request':'Type=Skill Require="level >= 7","skills.Diplomacy >= 3"',
  'Legendary Negotiation':
    'Type=Skill Require="level >= 15","skills.Diplomacy >= 4"',
  'Group Coercion':'Type=Skill Require="skills.Intimidation >= 1"',
  'Intimidating Glare':'Type=Skill Require="skills.Intimidation >= 1"',
  'Quick Coercion':'Type=Skill Require="skills.Intimidation >= 1"',
  'Intimidating Prowess':
    'Type=Skill ' +
    'Require="level >= 2","strength >= 16","skills.Intimidation >= 2"',
  'Lasting Coercion':
    'Type=Skill Require="level >= 2","skills.Intimidation >= 2"',
  'Battle Cry':'Type=Skill Require="level >= 7","skills.Intimidation >= 3"',
  'Terrified Retreat':
    'Type=Skill Require="level >= 7","skills.Intimidation >= 3"',
  'Scare To Death':
    'Type=Skill Require="level >= 15","skills.Intimidation >= 4"',
  'Additional Lore':'Type=Skill Require="skills.Lore >= 1"',
  'Experience Professional':'Type=Skill Require="skills.Lore >= 1"',
  'Unmistakable Lore':'Type=Skill Require="level >= 2","skills.Lore >= 2"',
  'Legendary Professional':
    'Type=Skill Require="level >= 15","skills.Lore >= 4"',
  'Battle Medicine':'Type=Skill Require="skills.Medicine >= 1"',
  'Continual Recovery':'Type=Skill Require="level >= 2","skills.Medicine >= 2"',
  'Robust Recovery':'Type=Skill Require="level >= 2","skills.Medicine >= 2"',
  'Ward Medic':'Type=Skill Require="level >= 2","skills.Medicine >= 2"',
  'Legendary Medic':'Type=Skill Require="level >= 15","skills.Medicine >= 4"',
  'Natural Medicine':'Type=Skill Require="skills.Nature >= 1"',
  'Train Animal':'Type=Skill Require="skills.Nature >= 1"',
  'Bonded Animal':'Type=Skill Require="level >= 2","skills.Nature >= 2"',
  'Oddity Identification':'Type=Skill Require="skills.Occultism >= 1"',
  'Bizarre Magic':'Type=Skill Require="level >= 7","skills.Occultism >= 3"',
  'Fascinating Performance':'Type=Skill Require="skills.Performance >= 1"',
  'Impressive Performance':'Type=Skill Require="skills.Performance >= 1"',
  'Virtuosic Performer':'Type=Skill Require="skills.Performance >= 1"',
  'Legendary Performer':
    'Type=Skill ' +
    'Require="level >= 15",' +
            '"skills.Performance >= 4",' +
            '"features.Virtuosic Performer"',
  'Student Of The Canon':'Type=Skill Require="skills.Religion >= 1"',
  'Divine Guidance':'Type=Skill Require="level >= 15","skills.Religion >= 4"',
  'Courtly Graces':'Type=Skill Require="skills.Society >= 1"',
  'Multilingual':'Type=Skill Require="skills.Society >= 1"',
  'Read Lips':'Type=Skill Require="skills.Society >= 1"',
  'Sign Language':'Type=Skill Require="skills.Society >= 1"',
  'Streetwise':'Type=Skill Require="skills.Society >= 1"',
  'Connections':
    'Type=Skill ' +
    'Require="level >= 2","skills.Society >= 2","features.Courtly Graces"',
  'Legendary Codebreaker':
    'Type=Skill Require="level >= 15","skills.Society >= 4"',
  'Legendary Linguist':
    'Type=Skill ' +
    'Require="level >= 15","skills.Society >= 4","features.Multilingual"',
  'Experienced Smuggler':'Type=Skill Require="skills.Stealth >= 1"',
  'Terrain Stalker':'Type=Skill Require="skills.Stealth >= 1"',
  'Quiet Aliases':'Type=Skill Require="level >= 2","skills.Stealth >= 2"',
  'Foil Senses':'Type=Skill Require="level >= 7","skills.Stealth >= 3"',
  'Swift Sneak':'Type=Skill Require="level >= 7","skills.Stealth >= 3"',
  'Legendary Sneak':'Type=Skill Require="level >= 15","skills.Stealth >= 4"',
  'Experienced Tracker':'Type=Skill Require="skills.Survival >= 1"',
  'Forager':'Type=Skill Require="skills.Survival >= 1"',
  'Survey Wildlife':'Type=Skill Require="skills.Survival >= 1"',
  'Terrain Expertise':'Type=Skill Require="skills.Survival >= 1"',
  'Planar Survival':'Type=Skill Require="level >= 7","skills.Survival >= 3"',
  'Legendary Survivalist':
    'Type=Skill Require="level >= 15","skills.Survival >= 4"',
  'Pickpocket':'Type=Skill Require="skills.Thievery >= 1"',
  'Subtle Theft':'Type=Skill Require="skills.Thievery >= 1"',
  'Wary Disarmament':'Type=Skill Require="level >= 2","skills.Thievery >= 2"',
  'Quick Unlock':'Type=Skill Require="level >= 7","skills.Thievery >= 3"',
  'Legendary Thief':
    'Type=Skill ' +
    'Require="level >= 15","skills.Thievery >= 4","features.Pickpocket"'
};
Pathfinder2E.FEATURES = {

  // Ancestry
  'Ancient-Blooded Dwarf':
    'Section=save ' +
    'Note="May use Reaction upon save vs. magic for +1 vs. magic for 1 rd"',
  'Arctic Elf':
    'Section=save ' +
    'Note="Cold resistance %{level//2>?1}/Treats environmental cold as 1 step lower"',
  'Cavern Elf':'Section=feature Note="Has Darkvision feature"',
  'Chameleon Gnome':
    'Section=feature,skill ' +
    'Note=' +
      '"May change skin and hair colors",' +
      '"May use an action to change coloration and gain +2 Stealth"',
  'Charhide Goblin':
    'Section=save ' +
    'Note="Fire resistance %{level//2>?1}/DC 10 to recover from fire damage (DC 5 with help)"',
  'Darkvision':
    'Section=feature Note="Has normal b/w vision in darkness and dim light"',
  'Death Warden Dwarf':
    'Section=save ' +
    'Note="A successful save vs. a necromancy effect is always a critical success"',
  'Fey-Touched Gnome':
    'Section=feature,magic ' +
    'Note=' +
      '"Fey trait",' +
      '"May cast chosen cantrip at will; may replace chosen cantrip 1/dy"',
  'Forge Dwarf':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1}/Treats environmental heat as 1 step lower"',
  'Gutsy Halfling':
    'Section=save ' +
    'Note="Successful save vs. emotion is always a critical success"',
  'Half-Elf':'Section=feature Note="Has Low-Light Vision feature"',
  'Half-Orc':'Section=combat Note="Has Low-Light Vision feature"',
  'Hillock Halfling':
    'Section=combat Note="Regains +%{level} HP from rest or treatment"',
  'Irongut Goblin':
    'Section=feature,save ' +
    'Note=' +
      '"May safely eat spoiled food and when sickened",' +
      '"+2 vs afflictions and sickened from ingestion, and a successful save is always a critical success"',
  'Low-Light Vision':
    'Section=feature Note="Can see in dim light as well as bright light"',
  'Keen Eyes':
    'Section=combat,skill ' +
    'Note=' +
      '"DC 3/9 to target a concealed/hidden foe",' +
      '"R30\' +2 Seek to find hidden creatures"',
  'Nomadic Halfling':
    'Section=skill Note="+%{2+(feats.Multilingual||0)}  Language Count"',
  'Razortooth Goblin':'Section=combat Note="Jaw attack inflicts 1d6 HP"',
  'Rock Dwarf':
    'Section=save ' +
    'Note="+2 vs. Shove, Trip, and magical knock prone/Suffers halve forced move distance"',
  'Seer Elf':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Detect Magic</i> cantrip at will",' +
      '"+1 Identify Magic and Decipher Writing of a magical nature"',
  'Sensate Gnome':
    'Section=skill ' +
    'Note="R30\' May locate a creature by smell/R30\' +2 Perception (Locate creature)"',
  'Skilled Heritage':
    'Section=skill Note="%{level<5?\'Trained\':\'Expert\'} in chosen skill"',
  'Slow':'Section=ability Note="-10 Speed"',
  'Small':'Section=ability Note="-5 Speed"',
  'Snow Goblin':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1}/Treats environmental cold as 1 step lower"',
  'Strong-Blooded Dwarf':
    'Section=save ' +
    'Note="Has poison resistance %{level//2>?1}; save reduces stage by 2 (virulent 1), critical success by 3 (virulent 2)"',
  'Twilight Halfling':'Section=combat Note="Has Low-Light Vision feature"',
  'Umbral Gnome':'Section=combat Note="Has Darkvision feature"',
  'Unbreakable Goblin':
    'Section=combat,save ' +
    'Note="+4 Hit Points","Suffers falling damage as half distance"',
  'Versatile Heritage':'Section=combat Note="+1 General Feat"',
  'Wellspring Gnome':'Section=magic Note="May cast chosen cantrip at will"',
  'Whisper Elf':
    'Section=combat ' +
    'Note="R60\' Seek, R30\' +2 to locate creatures via hearing"',
  'Wildwood Halfling':
    'Section=feature Note="Ignores difficult terrain from foliage"',
  'Woodland Elf':
    'Section=ability,combat ' +
    'Note=' +
      '"%{speed//2}\' Climb (foliage) (critical success %{speed}\')",' +
      '"May always Take Cover within forest terrain"',

  // Ancestry feats
  'Dwarven Lore':
    'Section=skill Note="Skill Trained (Crafting/Religion/Dwarven Lore)"',
  'Dwarven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Training (Battle Axe/Pick/Warhammer)",' +
      '"Has access to uncommon dwarf weapons/Treats dwarf weapons as one category lower"',
  'Rock Runner':
    'Section=ability,skill ' +
    'Note=' +
      '"May move normally over stone and earth difficult terrain",' +
      '"Acrobatics to Balance on stone and earth is never flat-footed, and success is always a critical success"',
  'Stonecunning':
    'Section=skill ' +
    'Note="+2 Perception (unusual stonework)/Gains an automatic -2 check to note unusual stonework"',
  'Unburdened Iron':
    'Section=ability,ability ' +
    'Note=' +
      '"Suffers no Speed penalty from armor",' +
      '"Reduces speed penalties by 5"',
  'Vengeful Hatred':
    'Section=combat ' +
    'Note="+1 per die weapon damage vs. choice of drow, duergar, giant, or orc and for 1 minute on any foe that inflicts a critical success on attack"',
  'Boulder Roll':
    'Section=combat ' +
    'Note="Stepping into foe\'s space forces 5\' move (Fort vs. Athletics neg but inflicts %{level+strengthModifier} HP})"',
  'Dwarven Weapon Cunning':
    'Section=combat ' +
    'Note="Critical hits with a battle axe, pick, warhammer, or dwarf weapon inflict critical specialization effect"',
  "Mountain's Stoutness":
    'Section=combat,combat ' +
    'Note=' +
      '"+%{level} Hit Points",' +
      '"-%{1+(features.Toughness||0)*3} dying recovery DC"',
  'Stonewalker':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Meld Into Stone</i> 1/dy",' +
      '"May find legendary unusual stonework"',
  'Dwarven Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater proficiency
    'Note="Has expert proficiency in battle axes, picks, warhammers, and dwarf weapons"',

  'Ancestral Longevity':
    'Section=skill Note="May become Trained in choice of skill 1/dy"',
  'Elven Lore':
    'Section=skill Note="Skill Trained (Arcana; Nature; Elven Lore)"',
  'Elven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Proficiency (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow)",' +
      '"Has access to uncommon elf weapons/Treats elf weapons as one category lower"',
  'Forlorn':
    'Section=save ' +
    'Note="+1 vs. emotion effects, and all successes are critical"',
  'Nimble Elf':'Section=ability Note="+5 Speed"',
  'Otherworldly Magic':
    'Section=magic Note="May cast chosen cantrip at will"',
  'Unwavering Mien':
    'Section=save ' +
    'Note="May reduce duration of mental effects by 1 rd/Gives +1 degree of save vs. sleep effects"',
  'Ageless Patience':
    'Section=skill ' +
    'Note="May gain a +2 bonus on a check by spending double the time required; suffers critical failure only on 10 lower than DC"',
  'Elven Weapon Elegance':
    'Section=combat ' +
    'Note="Critical hits with a longbow, composite longbow, longsword, rapier shortbow, composite shortbow, or elf weapon inflict critical specialization effect"',
  'Elf Step':'Section=combat Note="May take a second Step 5\'"',
  'Expert Longevity':
    'Section=skill ' +
    'Note="Ancestral Longevity also gives expert level in chosen trained skill; upon expiration, may replace an existing skill increase with one chosen"',
  'Universal Longevity':
    'Section=skill ' +
    'Note="May replace Ancestral Longevity and Expert Longevity skills 1/dy"',
  'Elven Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater proficiency
    'Note="Has expert proficiency in longbow, composite longbow, longsword, rapier, shortbow, composite shortbow, and elf weapons"',

  'Animal Accomplice':
    'Section=combat Note="Has Familiar feature"',
  'Burrow Elocutionist':
    'Section=skill Note="May speak with burrowing animals"',
  'Fey Fellowship':
    'Section=save,skill ' +
    'Note="+2 vs. fey","+2 Perception (fey)/May attempt an immediate Diplomacy - 5 to Make an Impression with fey; may retry after 1 min conversation"',
  'First World Magic':
    'Section=magic Note="May cast chosen primal cantrip at will"',
  'Gnome Obsession':
    'Section=skill Note="Skill %{level<2?\'Trained\':level<7?\'Expert\':level<15?\'Master\':\'Legendary\'} in chosen and background Lore skill"',
  'Gnome Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Proficiency (Glaive; Kukri)",' +
      '"Has access to uncommon gnome weapons/Treats gnome weapons as one category lower"',
  'Illusion Sense':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. illusions/R10\' Automatic disbelieve check",' +
      '"+1 Perception (illusions)"',
  'Animal Elocutionist':
    'Section=magic,skill ' +
    'Note=' +
      '"May speak with all animals",' +
      '"+1 to Make an Impression on animals"',
  'Energized Font':'Section=magic Note="May regain 1 Focus Point 1/dy"',
  'Gnome Weapon Innovator':
    'Section=combat ' +
    'Note="Critical hits with a glaive, kukri, or gnome weapon inflict critical specialization effect"',
  'First World Adept':
    'Section=magic ' +
     'Note="May cast <i>Faerie Fire</i> and <i>Invisibility</i> as level 2 spells 1/dy"',
  'Vivacious Conduit':
    'Section=combat ' +
    'Note="10 min rest restores %{constitutionModifier+level//2} HP"',
  'Gnome Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater proficiency
    'Note="Has expert proficiency in glaive, kukri, and gnome weapons"',

  'Burn It!':
    'Section=combat,magic ' +
    'Note=' +
      '"+1 persistent fire damage",' +
      '"Fire spells inflict additional damage equal to half the spell level"',
  'City Scavenger':
    'Section=skill ' +
    'Note="+%{1+(features.Irongut?1:0)} Subsist/May make +%{1+features.Irongut?1:0} Society or Survival check to Earn Income while using Subsist in a settlement"',
  'Goblin Lore':
    'Section=skill Note="Skill Trained (Nature; Stealth; Goblin Lore)"',
  'Goblin Scuttle':
    'Section=combat ' +
    'Note="May make a Step Reaction when an ally moves to an adjacent position"',
  'Goblin Song':
    'Section=skill ' +
    'Note="R30\' May use Performance to inflict -1 Perception and Will on targets for 1 rd (critical success 1 min; critical fail immune for 1 hr)"',
  'Goblin Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Proficiency (Dogslicer; Horsechopper)",' +
      '"Has access to uncommon goblin weapons/Treats goblin weapons as one category lower"',
  'Junk Tinker':'Section=skill Note="May use Crafting on junk"',
  'Rough Rider':
    'Section=feature,skill ' +
    'Note="Has Ride feat","+1 Nature (Command a goblin dog or wolf mount)"',
  'Very Sneaky':
    'Section=ability,skill ' +
    'Note=' +
      '"+5\' Sneak",' +
      '"May Stealth between cover"',
  'Goblin Weapon Frenzy':
    'Section=combat ' +
    'Note="Critical hits with a goblin weapon inflict critical specialization effect"',
  'Cave Climber':'Section=ability Note="10\' Climb"',
  'Skittering Scuttle':
    'Section=combat Note="May move up to %{speed//2}\' using Goblin Scuttle"',
  'Goblin Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater proficiency
    'Note="Has expert proficiency in dogslicer, horsechopper, and goblin weapons"',
  'Very, Very Sneaky':
    'Section=combat Note="May Sneak at full speed and without cover"',

  'Distracting Shadows':
    'Section=skill Note="May use larger creatures as cover for Hide and Sneak"',
  'Halfling Lore':
    'Section=skill Note="Skill Trained (Acrobatics; Stealth; Halfling Lore)"',
  'Halfling Luck':
    'Section=feature Note="May reroll a skill check or save 1/dy"',
  'Halfling Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Proficiency (Sling; Halfling Sling Staff; Shortsword)",' +
      '"Has access to uncommon halfling weapons/Treats halfling weapons as one category lower"',
  'Sure Feet':
    'Section=skill ' +
    'Note="Success on Acrobatics (balance) and Athletics (climb) is a critical success/Never flat-footed during balance or climb"',
  'Titan Slinger':
    'Section=combat ' +
    'Note="+1 damage die step on slings against Large and larger foes"',
  'Unfettered Halfling':
    'Section=combat ' +
    'Note="All escape successes and vs. grabbed or restrained are critical successes/All foe Grapple fails are critical fails/Foe Grab requires a successful Athletics check"',
  'Watchful Halfling':
    'Section=combat,skill ' +
    'Note=' +
      '"May use Aid to overcome enchantment",' +
      '"+2 Perception (sense enchantment)/Gains an automatic -2 check to note enchantment"',
  'Cultural Adaptability':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Ancestry feat",' +
      '"Has Adopted Ancestry feature"',
  'Halfling Weapon Trickster':
    'Section=combat ' +
    'Note="Critical hits with a shortsword, sling, or halfling weapon weapon inflict critical specialization effect"',
  'Guiding Luck':
    'Section=skill ' +
    'Note="May reroll a failed Perception check or attack roll 1/dy"',
  'Irrepressible':
    'Section=save ' +
    'Note=' +
      '"Successful save vs. emotion is always a critical success%{saveNotes.gutsyHalfling?\'; failure is never a critical failure\':\'\'}"',
  'Ceaseless Shadows':
    'Section=combat ' +
    'Note="May use Hide and Sneak without cover and gain additional cover from creatures"',
  'Halfling Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater proficiency
    'Note="Has expert proficiency in sling, halfling sling, shortsword, and halfling weapons"',

  'Adapted Cantrip':
    'Section=magic Note="Knows a cantrip from a different tradition"',
  'Cooperative Nature':'Section=skill Note="+4 Aid checks"',
  'General Training':
    'Section=feature Note="+%{$\'features.General Training\'} General feat"',
  'Haughty Obstinacy':
    'Section=save ' +
    'Note="Successful save vs. control is always a critical success; foe Intimidation (Coerce) fails are critical fails"',
  'Natural Ambition':'Section=features Note="+1 Class feat"',
  'Natural Skill':'Section=skill Note="Skill Trained (Choose 2 from any)"',
  'Unconventional Weaponry':
    'Section=combat Note="Trained in choice of uncommon weapon"',
  'Adaptive Adept':
    'Section=magic ' +
    'Note="Knows a cantrip or level 1 spell from a different tradition"',
  'Clever Improviser':
    'Section=feature,skill ' +
    'Note=' +
      '"Has Untrained Improvisation feature",' +
      '"May use any skill untrained"',
  'Cooperative Soul':
    'Section=skill Note="Always succeeds when using Aid with expert skills"',
  'Incredible Improvisation':
    'Section=combat Note="May add +4 to an untrained skill check 1/dy"',
  'Multitalented':'Section=combat Note="Has a 2nd level multiclass feat"',
  'Unconventional Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater proficiency
    'Note="Has expert proficiency in Unconventional Weaponry weapon"',

  'Elf Atavism':'Section=feature Note="Has a feature from elven ancestry"',
  'Inspire Imitation':
    'Section=skill Note="May use Aid freely on skill critical success"',
  'Supernatural Charm':
    'Section=magic Note="May cast 1st level <i>Charm</i> 1/dy"',
  'Monstrous Peacemaker':
    'Section=skill ' +
    'Note="+1 Diplomacy, Perception, and Sense Motive with creatures marginalized in human society"',
  'Orc Ferocity':
    'Section=combat Note="May retain 1 HP when brought to 0 HP 1/%{combatNotes.incredibleFerocity?\'hr\':\'dy\'}"',
  'Orc Sight':'Section=feature Note="Has Darkvision feature"',
  'Orc Superstition':'Section=save Note="+1 vs. magic 1/dy"',
  'Orc Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Proficiency (Falchion; Greataxe)",' +
      '"Has access to uncommon orc weapons/Treats orc weapons as one category lower"',
  'Orc Weapon Carnage':
    'Section=combat ' +
    'Note="Critical hits with a falchion, greataxe, or orc weapon inflict critical specialization effect"',
  'Victorious Vigor':
    'Section=combat ' +
    'Note="Gains %{constitutionModifier} temporary HP for 1 rd when foe drops"',
  'Pervasive Superstition':'Section=save Note="+1 vs. magic"',
  'Incredible Ferocity':'Section=combat Note="May use Orc Ferocity 1/hr"',
  'Orc Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater proficiency
    'Note="Has expert proficiency in falchion, greataxe, and orc weapons"',

  // Background
  'Assurance (%skill)':
    'Section=skill Note="Minimum %{10+proficiencyBonus} on %skill"',
  'Bargain Hunter':'Section=skill Note="May use Diplomacy to Earn Income"',
  'Battle Medic':'Section=skill Note="May use Medicine to Treat Wounds"',
  'Cat Fall':
    'Section=ability Note="Suffers damage from falling as 10\' shorter"',
  'Charming Liar':
    'Section=skill Note="Crit success on Lie improves attitude 1 step"',
  'Courtly Graces':
    'Section=skill Note="May use Society to Make An Impression or Impersonate"',
  'Dubious Knowledge':
    'Section=skill ' +
    'Note="Fail on Recall Knowledge yields a mix of true and false info"',
  'Experienced Smuggler':
    'Section=skill Note="Minimum 10 roll to smuggle concealed item"',
  'Experienced Tracker':'Section=skill Note="May make Track-5 at full Speed"',
  'Fascinating Performance':
    'Section=skill Note="Performance fascinates 1 target for 1 rd (Will neg)"',
  'Forager':
    'Section=skill Note="Has guaranteed success on Survival to Subsist"',
  'Group Impression':
    'Section=skill Note="May Make An Impression on two targets"',
  'Hefty Hauler':'Section=ability Note="+2 Bulk"',
  'Hobnobber':'Section=skill Note="Gather Information takes half time"',
  'Impressive Performance':
    'Section=skill Note="May use Performance to Make An Impression"',
  'Intimidating Glare':'Section=skill Note="May Intimidate visually"',
  'Lie To Me':'Section=skill Note="May use Deception to detect lies"',
  'Multilingual':'Section=skill Note="+2 Language Count"',
  'Natural Medicine':
    'Section=skill Note="May use Nature to Treat Wounds, +2 in wilderness"',
  'Oddity Identification':'Section=skill Note="+2 Occultism to Identify Magic"',
  'Pickpocket':
    'Section=skill Note="May Steal closely-guarded object without penalty"',
  'Quick Coercion':'Section=skill Note="May Coerce in 1 rd"',
  'Quick Jump':
    'Section=skill Note="May use High Jump and Long Jump as 1 action"',
  'Specialty Crafting':'Section=skill Note="+1 Craft on selected type"',
  'Steady Balance':
    'Section=skill ' +
    'Note="All Balance successes are crit/Never flat-footed during Balance/May use Acrobatics to Grab an Edge"',
  'Streetwise':
    'Section=skill ' +
    'Note="May use Society instead of Diplomacy to Gather Information"',
  'Student Of The Canon':
    'Section=skill ' +
    'Note="No crit fail on Religion check to Decipher Writing or Recall Knowledge, no failure to Recall Knowledge about own faith"',
  'Survey Wildlife':
    'Section=skill ' +
    'Note="May use Survival-2 to Recall Knowledge after 10 min study"',
  'Terrain Expertise (Aquatic)':'Section=skill Note="+1 Survival (aquatic)"',
  'Terrain Expertise (Arctic)':'Section=skill Note="+1 Survival (arctic)"',
  'Terrain Expertise (Desert)':'Section=skill Note="+1 Survival (desert)"',
  'Terrain Expertise (Forest)':'Section=skill Note="+1 Survival (forest)"',
  'Terrain Expertise (Mountain)':'Section=skill Note="+1 Survival (mountain)"',
  'Terrain Expertise (Plains)':'Section=skill Note="+1 Survival (plains)"',
  'Terrain Expertise (Sky)':'Section=skill Note="+1 Survival (sky)"',
  'Terrain Expertise (Swamp)':'Section=skill Note="+1 Survival (swamp)"',
  'Terrain Expertise (Underground)':
    'Section=skill Note="+1 Survival (underground)"',
  'Train Animal':'Section=companion Note="May teach tricks to animals"',
  'Underwater Marauder':
    'Section=combat ' +
    'Note="Never flat-footed in water/Suffers no penalty for bludgeoning or slashing weapons"',

  // Class
  'Fighter Feats':'Section=feature Note="%V selections"',
  'General Feats':'Section=feature Note="%V selections"',
  'Skill Feats':'Section=feature Note="%V selections"',
  'Skill Increases':'Section=skill Note="%V selections"',

  'Armor Expertise':'Section=feature Note="FILL"',
  'Armor Mastery':'Section=feature Note="FILL"',
  'Attack Of Opportunity':
    'Section=combat ' +
    'Note="May use Reaction to make a melee Strike at a foe within reach who uses a manipulate or move action, makes a ranged attack"',
  'Battlefield Surveyor':'Section=feature Note="FILL"',
  'Bravery':
    'Section=save ' +
    'Note="Save Expert (Will)/Successful Will save vs. fear is always a critical success/Reduces frightened condition by 1"',
  'Combat Flexibility':'Section=feature Note="FILL"',
  'Evasion':'Section=feature Note="FILL"',
  'Fighter Expertise':'Section=feature Note="FILL"',
  'Fighter Weapon Mastery':'Section=feature Note="FILL"',
  'Greater Weapon Specialization':'Section=feature Note="FILL"',
  'Improved Flexibility':'Section=feature Note="FILL"',
  'Juggernaut':'Section=feature Note="FILL"',
  'Versatile Legend':'Section=feature Note="FILL"',
  'Weapon Legend':'Section=feature Note="FILL"',
  'Weapon Specialization':'Section=feature Note="FILL"',

  'Double Slice':'Section=feature Note="FILL"',
  'Exacting Strike':'Section=feature Note="FILL"',
  'Point-Blank Shot':'Section=feature Note="FILL"',
  'Power Attack':'Section=feature Note="FILL"',
  'Reactive Shield':'Section=feature Note="FILL"',
  'Snagging Strike':'Section=feature Note="FILL"',
  'Sudden Charge':'Section=feature Note="FILL"',
  'Aggressive Block':'Section=feature Note="FILL"',
  'Assisting Shot':'Section=feature Note="FILL"',
  'Brutish Shove':'Section=feature Note="FILL"',
  'Combat Grab':'Section=feature Note="FILL"',
  'Dueling Parry':'Section=feature Note="FILL"',
  'Intimidating Strike':'Section=feature Note="FILL"',
  'Lunge':'Section=feature Note="FILL"',
  'Double Shot':'Section=feature Note="FILL"',
  'Dual-Handed Assault':'Section=feature Note="FILL"',
  'Knockdown':'Section=feature Note="FILL"',
  'Powerful Shove':'Section=feature Note="FILL"',
  'Quick Reversal':'Section=feature Note="FILL"',
  'Shielded Stride':'Section=feature Note="FILL"',
  'Swipe':'Section=feature Note="FILL"',
  'Twin Parry':'Section=feature Note="FILL"',
  'Advanced Weapon Training':'Section=feature Note="FILL"',
  'Advantageous Assault':'Section=feature Note="FILL"',
  'Disarming Stance':'Section=feature Note="FILL"',
  'Furious Focus':'Section=feature Note="FILL"',
  "Guardian's Deflection":'Section=feature Note="FILL"',
  'Reflexive Shield':'Section=feature Note="FILL"',
  'Revealing Stab':'Section=feature Note="FILL"',
  'Shatter Defenses':'Section=feature Note="FILL"',
  'Shield Warden':'Section=feature Note="FILL"',
  'Triple Shot':'Section=feature Note="FILL"',
  'Blind Fight':'Section=feature Note="FILL"',
  'Dueling Riposte':'Section=feature Note="FILL"',
  'Felling Strike':'Section=feature Note="FILL"',
  'Incredible Aim':'Section=feature Note="FILL"',
  'Mobile Shot Stance':'Section=feature Note="FILL"',
  'Positioning Assault':'Section=feature Note="FILL"',
  'Quick Shield Block':'Section=feature Note="FILL"',
  'Sudden Leap':'Section=feature Note="FILL"',
  'Agile Grace':'Section=feature Note="FILL"',
  'Certain Strike':'Section=feature Note="FILL"',
  'Combat Reflexes':'Section=feature Note="FILL"',
  'Debilitating Shot':'Section=feature Note="FILL"',
  'Disarming Twist':'Section=feature Note="FILL"',
  'Disruptive Stance':'Section=feature Note="FILL"',
  'Fearsome Brute':'Section=feature Note="FILL"',
  'Improved Knockdown':'Section=feature Note="FILL"',
  'Mirror Shield':'Section=feature Note="FILL"',
  'Twin Riposte':'Section=feature Note="FILL"',
  'Brutal Finish':'Section=feature Note="FILL"',
  'Dueling Dance':'Section=feature Note="FILL"',
  'Flinging Shove':'Section=feature Note="FILL"',
  'Improved Dueling Riposte':'Section=feature Note="FILL"',
  'Incredible Ricochet':'Section=feature Note="FILL"',
  'Lunging Stance':'Section=feature Note="FILL"',
  "Paragon's Guard":'Section=feature Note="FILL"',
  'Spring Attack':'Section=feature Note="FILL"',
  'Desperate Finisher':'Section=feature Note="FILL"',
  'Determination':'Section=feature Note="FILL"',
  'Guiding Finish':'Section=feature Note="FILL"',
  'Guiding Riposte':'Section=feature Note="FILL"',
  'Improved Twin Riposte':'Section=feature Note="FILL"',
  'Stance Savant':'Section=feature Note="FILL"',
  'Two-Weapon Flurry':'Section=feature Note="FILL"',
  'Whirlwind Strike':'Section=feature Note="FILL"',
  'Graceful Poise':'Section=feature Note="FILL"',
  'Improved Reflexive Shield':'Section=feature Note="FILL"',
  'Multishot Stance':'Section=feature Note="FILL"',
  'Twinned Defense':'Section=feature Note="FILL"',
  'Impossible Volley':'Section=feature Note="FILL"',
  'Savage Critical':'Section=feature Note="FILL"',
  'Boundless Reprisals':'Section=feature Note="FILL"',
  'Weapon Supremacy':'Section=feature Note="FILL"'

};
Pathfinder2E.GOODIES = {
  'Armor':
    'Pattern="([-+]\\d).*(?:armor(?:\\s+class)?|AC)|(?:armor(?:\\s+class)?|AC)\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Charisma':
    'Pattern="([-+]\\d)\\s+cha(?:risma)?|cha(?:risma)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=charisma ' +
    'Section=ability Note="%V Charisma"',
  'Constitution':
    'Pattern="([-+]\\d)\\s+con(?:stitution)?|con(?:stitution)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=constitution ' +
    'Section=ability Note="%V Constitution"',
  'Dexterity':
    'Pattern="([-+]\\d)\\s+dex(?:terity)?|dex(?:terity)\\s+([-+]\\d)" ' +
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
    'Pattern="([-+]\\d)\\s+int(?:elligence)?|int(?:elligence)?\\s+([-+]\\d)" ' +
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
    'Pattern="([-+]\\d)\\s+str(?:ength)?|str(?:ength)?\\s+([-+]\\d)" ' +
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
    'Pattern="([-+]\\d)\\s+wis(?:dom)?|wis(?:dom)?\\s+([-+]\\d)" ' +
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
  'Arcana':'Ability=intelligence',
  'Athletics':'Ability=strength',
  'Crafting':'Ability=intelligence',
  'Deception':'Ability=charisma',
  'Diplomacy':'Ability=charisma',
  'Intimidation':'Ability=charisma',
  'Lore':'Ability=intelligence',
  'Medicine':'Ability=wisdom',
  'Nature':'Ability=wisdom',
  'Occultism':'Ability=intelligence',
  'Performance':'Ability=charisma',
  'Religion':'Ability=wisdom',
  'Society':'Ability=intelligence',
  'Stealth':'Ability=dexterity',
  'Survival':'Ability=wisdom',
  'Thievery':'Ability=dexterity'
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

Pathfinder2E.PROFICIENCY_LEVEL_NAMES =
  ['Untrained', 'Trained', 'Expert', 'Master', 'Legendary'];

/* Defines the rules related to character abilities. */
Pathfinder2E.abilityRules = function(rules, abilities) {

  for(let a in abilities) {
    a = a.toLowerCase();
    rules.defineChoice('notes', a + ':%V (%1)');
    rules.defineRule(a, 'abilityBoosts.' + a, '+', 'source * 2');
    rules.defineRule(a + 'Modifier', a, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule(a + '.1', a + 'Modifier', '=', null);
    rules.defineRule(a, '', 'v', '20');
  }
  rules.defineRule('features.Ability Boost (Choose 4 from any)', '', '=', '1');
  rules.defineRule('speed', '', '=', '30');

};

/* Defines the rules related to combat. */
Pathfinder2E.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable
    (armors, ['Weight', 'AC', 'Dex', 'Skill', 'Speed', 'Str', 'Bulk']);
  QuilvynUtils.checkAttrTable(shields, ['AC', 'Speed', 'Bulk']);
  QuilvynUtils.checkAttrTable(weapons, ['Category', 'Damage', 'Bulk', 'Range', 'Crit']);

  for(let armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(let shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(let weapon in weapons) {
    let pattern = weapon.replace(/  */g, '\\s+');
    let prefix =
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
  rules, alignments, ancestries, backgrounds, classes, deities
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable(ancestries, ['Require', 'Features', 'Selectables', 'HitPoints', 'Languages', 'Traits']);
  QuilvynUtils.checkAttrTable(backgrounds, ['Features']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitPoints', 'Ability', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Font', 'Skill', 'Spells', 'Weapon']);

  for(let a in alignments)
    rules.choiceRules(rules, 'Alignment', a, alignments[a]);
  for(let a in ancestries)
    rules.choiceRules(rules, 'Ancestry', a, ancestries[a]);
  for(let b in backgrounds)
    rules.choiceRules(rules, 'Background', b, backgrounds[b]);
  for(let c in classes)
    rules.choiceRules(rules, 'Class', c, classes[c]);
  for(let d in deities)
    rules.choiceRules(rules, 'Deity', d, deities[d]);

  rules.defineRule('level', 'experience', '=', 'Math.floor(source / 1000) + 1');
  rules.defineRule('experienceNeeded', 'level', '=', 'source * 1000');
  rules.defineRule
    ('featCount.Ancestry', 'level', '=', 'Math.floor((source + 3) / 4)');

};

/* Defines rules related to magic use. */
Pathfinder2E.magicRules = function(rules, schools, spells) {

  QuilvynUtils.checkAttrTable(schools, ['Features']);
  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Group', 'Level', 'Description']);

  for(let school in schools) {
    rules.choiceRules(rules, 'School', school, schools[school]);
  }
  for(let spell in spells) {
    rules.choiceRules(rules, 'Spell', spell, spells[spell]);
  }

};

/* Defines rules related to character aptitudes. */
Pathfinder2E.talentRules = function(
  rules, feats, features, goodies, languages, skills)
{

  let matchInfo;

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Class']);

  for(let goody in goodies) {
    rules.choiceRules(rules, 'Goody', goody, goodies[goody]);
  }
  for(let language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(let skill in skills) {
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
  for(let feat in feats) {
    if((matchInfo = feat.match(/(%(\w+))/)) != null) {
      for(let c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Feat', feat.replace(matchInfo[1], c), feats[feat].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Feat', feat, feats[feat]);
    }
  }
  for(let feature in features) {
    if((matchInfo = feature.match(/(%(\w+))/)) != null) {
      for(let c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Feature', feature.replace(matchInfo[1], c), features[feature].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Feature', feature, features[feature]);
    }
  }

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Pathfinder2E.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    Pathfinder2E.alignmentRules(rules, name);
  else if(type == 'Ancestry') {
    Pathfinder2E.ancestryRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Traits'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    Pathfinder2E.ancestryRulesExtra(rules, name);
  } else if(type == 'Background')
    Pathfinder2E.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
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
    Pathfinder2E.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    Pathfinder2E.languageRules(rules, name);
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
      QuilvynUtils.getAttrValue(attrs, 'Ability')
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
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
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
 * Defines in #rules# the rules associated with ancestry #name#, which has the
 * list of hard prerequisites #requires#. #features# and #selectables# list
 * associated features, #languages# any automatic languages, and #hitPoints#
 * the number of HP gained at level 1.
 */
Pathfinder2E.ancestryRules = function(
  rules, name, requires, hitPoints, features, selectables, traits, languages
) {

  if(!name) {
    console.log('Empty ancestry name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for ancestry ' + name);
    return;
  }
  if(typeof hitPoints != 'number') {
    console.log('Bad hitPoints "' + hitPoints + '" for ancestry ' + name);
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(traits)) {
    console.log('Bad traits list "' + traits + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for ancestry ' + name);
    return;
  }

  let matchInfo;
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let ancestryLevel = prefix + 'Level';

  rules.defineRule(ancestryLevel,
    'ancestry', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Ancestry', ancestryLevel, requires);

  rules.defineRule('selectableFeatureCount.' + name,
    'ancestry', '=', 'source=="' + name + '" ? 1 : null'
  );

  if(languages.length > 0) {
    rules.defineRule('languageCount', ancestryLevel, '=', languages.length);
    for(let i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], ancestryLevel, '=', '1');
    }
  }

  Pathfinder2E.featureListRules(rules, features, name, ancestryLevel, false);
  Pathfinder2E.featureListRules(rules, selectables, name, ancestryLevel, true);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
Pathfinder2E.ancestryRulesExtra = function(rules, name) {
  if(name == 'Elf') {
    rules.defineRule('features.Darkvision', 'featureNotes.cavernElf', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, adds #bulk# to the character's load, allows
 * a maximum dex bonus to ac of #maxDex#, imposes #skillPenalty# on specific
 * skills, slows the character by #speedPenalty#, requires a strength of at
 * least #minStr# to use, and weighs #weight# lbs.
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
    bulk = 0.1;
  if(typeof bulk != 'number') {
    console.log('Bad bulk "' + bulk + '" for armor ' + name);
  }
  if(typeof maxDex != 'number') {
    console.log('Bad max dex "' + maxDex + '" for armor ' + name);
    return;
  }
  if(typeof skillPenalty != 'number') {
    console.log('Bad skill penalty "' + skillPenalty + '" for armor ' + name);
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

/*
 * Defines in #rules# the rules associated with background #name#. #features#
 * lists the background's associated features.
 */
Pathfinder2E.backgroundRules = function(rules, name, features) {
  let prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let backgroundLevel = prefix + 'Level';
  rules.defineRule(backgroundLevel,
    'background', '?', 'source == "' + name + '"',
    'level', '=', null
  );
  Pathfinder2E.featureListRules(rules, features, name, backgroundLevel, false);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');
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

  let classLevel = 'levels.' + name;
  let prefix =
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
    for(let i = 0; i < languages.length; i++) {
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
    let casterLevelExpr = casterLevelArcane || casterLevelDivine || classLevel;
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
    for(let j = 0; j < spellSlots.length; j++) {
      let spellTypeAndLevel = spellSlots[j].replace(/:.*/, '');
      let spellType = spellTypeAndLevel.replace(/\d+/, '');
      let spellLevel = spellTypeAndLevel.replace(spellType, '');
      let spellModifier = spellAbility + 'Modifier';
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

  let classLevel = 'levels.' + name;

  if(name == 'Fighter') {
    rules.defineRule
      ('featCount.Fighter', 'featureNotes.fighterFeats', '+=', null);
    rules.defineRule('featureNotes.fighterFeats',
      classLevel, '+=', 'Math.floor(source / 2) + 1'
    );
    rules.defineRule
      ('featCount.General', 'featureNotes.generalFeats', '+=', null);
    rules.defineRule('featureNotes.generalFeats',
      classLevel, '+=', 'Math.floor((source + 1) / 4)'
    );
    rules.defineRule
      ('featCount.Skill', 'featureNotes.skillFeats', '+=', null);
    rules.defineRule
      ('featureNotes.skillFeats', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('skillBoosts', 'skillNotes.skillIncreases', '+=', null);
    rules.defineRule('skillNotes.skillIncreases',
      classLevel, '+=', 'Math.floor((source - 1) / 2)'
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

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Feat', 'feats.' + name, requires);
  if(implies.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', prefix + 'Feat', 'feats.' + name, implies);
  rules.defineRule('features.' + name, 'feats.' + name, '=', null);
  for(let i = 0; i < types.length; i++) {
    if(types[i] != 'General')
      rules.defineRule('sum' + types[i] + 'Feats', 'feats.' + name, '+=', null);
  }

};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Pathfinder2E.featRulesExtra = function(rules, name) {
  if(name == 'Stonewalker') {
    rules.defineRule
      ('skillNotes.stonewalker', 'features.Stonecunning', '?', null);
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Pathfinder2E.featureRules = function(rules, name, sections, notes) {
  SRD35.featureRules(rules, name, sections, notes);
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  for(let i = 0; i < notes.length; i++) {
    let section = sections[i];
    let matchInfo;
    let note = section + 'Notes.' + prefix;
    matchInfo = notes[i].match(/^([A-Z]\w*)\sProficiency:\s*(.*)$/);
    if(matchInfo) {
      let group = matchInfo[1].toLowerCase();
      let note = sections[i] + 'Notes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
      matchInfo[2].split(/;\s*/).forEach(affected => {
        matchInfo = affected.match(/^Choose\s(\d+)/);
        if(matchInfo)
          rules.defineRule(group + 'ChoiceCount', note, '+=', matchInfo[1]);
        else
          rules.defineRule(group + 'Proficiency.' + affected, note, '=', '1');
      });
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
 */
Pathfinder2E.skillRules = function(rules, name, ability) {

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

  rules.defineRule('skillProficiency.' + name,
    '', '=', '0',
    'skillBoosts.' + name, '+', 'source ? 1 : null'
  );
  rules.defineChoice
    ('notes', 'skills.' + name + ':(' + ability.substring(0, 3) + ') %V (%1)');
  rules.defineRule('skills.' + name,
    'skillProficiency.' + name, '=', 'Pathfinder2E.PROFICIENCY_LEVEL_NAMES[source]'
  );
  rules.defineRule('skills.' + name + '.1', 'skillModifier.' + name, '=', null);
  rules.defineRule('skillModifier.' + name,
    ability + 'Modifier', '=', null,
    'skillProficiency.' + name, '+', '2 * source',
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
  let matchInfo = (damage + '').match(/^(((\d*d)?\d+)([\-+]\d+)?)$/);
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

  let isFinessed = properties.includes('finesse') || properties.includes('Fi');
  let isRanged = properties.includes('ranged') || properties.includes('R');
  let is2h = properties.includes('two-handed') || properties.includes('2h');

  damage = matchInfo[1];
  let weaponName = 'weapons.' + name;
  let format = '%V (%1 %2%3' + (range ? " R%4'" : '') + ')';

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
  for(let i = 0; i < features.length; i++) {
    let feature = features[i].replace(/^(.*\?\s*)?\d+:/, '');
    let matchInfo = feature.match(/([A-Z]\w*)\s(Expert|Trained)\s*\((.*)\)$/i);
    if(matchInfo) {
      let group = matchInfo[1].toLowerCase();
      let proficiency = matchInfo[2] == 'Expert' ? 2 : 1;
      matchInfo[3].split(/;\s*/).forEach(element => {
        if(!element.match(/Choose/))
          rules.defineRule(group + 'Proficiency.' + element,
            setName + '.' + feature, '^=', proficiency
          );
      });
    }
    matchInfo = feature.match(/Ability\s(Boost|Flaw)\s*\((.*)\)$/i);
    if(matchInfo) {
      let flaw = matchInfo[1].match(/flaw/i);
      matchInfo[2].split(/;\s*/).forEach(element => {
        if(!element.match(/Choose/))
          rules.defineRule
            (element.toLowerCase(), setName + '.' + feature, '+', flaw ? '-2' : '2');
      });
    }
  }
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
Pathfinder2E.getFormats = function(rules, viewer) {
  let format;
  let formats = rules.getChoices('notes');
  let result = {};
  let matchInfo;
  if(viewer == 'Collected Notes') {
    for(format in formats) {
      result[format] = formats[format];
      if((matchInfo = format.match(/Notes\.(.*)$/)) != null) {
        let feature = matchInfo[1];
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
  for(let i = 0; i < viewers.length; i++) {
    let name = viewers[i];
    let viewer = new ObjectViewer();
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
      let innerSep = null;
      let listSep = '; ';
      let noteSep = listSep;
      noteSep = '\n';
      let outerSep = name == '\n';
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
              {name: 'Lift', within: 'LoadInfo', format: '/%V'}
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
              {name: 'Weapons', within: 'Gear', separator: listSep}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
            {name: 'Combat Notes', within: 'CombatPart', separator: noteSep}
        );
      }
      viewer.addElements(
          {name: 'SavePart', within: 'Combat', separator: '\n'},
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
  let result = [];
  let zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Alignment')
    result.push(
      // empty
    );
  else if(type == 'Armor') {
    let zeroToFifty = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    let minusTenToZero = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0];
    let tenToEighteen = [10, 11, 12, 13, 14, 15, 16, 17, 18];
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
    let sections =
      ['ability', 'combat', 'companion', 'feature', 'magic', 'skill'];
    result.push(
      ['Section', 'Section', 'select-one', sections],
      ['Note', 'Note', 'text', [60]]
    );
  } else if(type == 'Language')
    result.push(
      // empty
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
    let zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    result.push(
      ['School', 'School', 'select-one', QuilvynUtils.getKeys(rules.getChoices('schools'))],
      ['Group', 'Caster Group', 'text', [15]],
      ['Level', 'Level', 'select-one', zeroToNine],
      ['Description', 'Description', 'text', [60]]
    );
  } else if(type == 'Weapon') {
    let oneToFive = [1, 2, 3, 4, 5];
    let sixteenToTwenty = [16, 17, 18, 19, 20];
    let zeroToOneFifty =
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
  let abilityChoices = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
  ];
  let editorElements = [
    ['name', 'Name', 'text', [20]],
    ['ancestry', 'Ancestry', 'select-one', 'ancestries'],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['experience', 'Experience', 'text', [8]],
    ['levels', 'Levels', 'bag', 'levels'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['strength', 'Str/Boost', 'select-one', abilityChoices],
    ['strengthBoosts', '', 'text', [3]],
    ['dexterity', 'Dex/Boost', 'select-one', abilityChoices],
    ['dexterityBoosts', '', 'text', [3]],
    ['constitution', 'Con/Boost', 'select-one', abilityChoices],
    ['constitutionBoosts', '', 'text', [3]],
    ['intelligence', 'Int/Boost', 'select-one', abilityChoices],
    ['intelligenceBoosts', '', 'text', [3]],
    ['wisdom', 'Wis/Boost', 'select-one', abilityChoices],
    ['wisdomBoosts', '', 'text', [3]],
    ['charisma', 'Cha/Boost', 'select-one', abilityChoices],
    ['charismaBoosts', '', 'text', [3]],
    ['player', 'Player', 'text', [20]],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['gender', 'Gender', 'text', [10]],
    ['deity', 'Deity', 'select-one', 'deities'],
    ['origin', 'Origin', 'text', [20]],
    ['feats', 'Feats', 'set', 'feats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skillBoosts', 'Skills', 'set', 'skills'],
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

  let clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  let consonants = {
    'Dwarf':'dgkmnprst', 'Elf':'fhlmnpqswy', 'Gnome':'bdghjlmnprstw',
    'Goblin':'bdfghklmnprtwyz', 'Halfling':'bdfghlmnprst', 
    'Human': 'bcdfghjklmnprstvwz'
  }[ancestry];
  let endConsonant = '';
  let leading = 'ghjqvwy';
  let vowels = {
    'Dwarf':'aeiou', 'Elf':'aeioy', 'Gnome':'aeiou', 'Goblin':'aeiou',
    'Halfling':'aeiou', 'Human':'aeiou'
  }[ancestry];
  let diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  let syllables = QuilvynUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  let result = '';
  let vowel;

  for(let i = 0; i < syllables; i++) {
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
    let remaining = [].concat(choices);
    for(let i = 0; i < howMany && remaining.length > 0; i++) {
      let which = QuilvynUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  function randomElement(list) {
    return list.length>0 ? list[QuilvynUtils.random(0, list.length - 1)] : '';
  }

  let attr;
  let attrs;
  let choices;
  let howMany;
  let i;
  let matchInfo;

  if(attribute == 'abilities' ||
     attribute.charAt(0).toUpperCase() + attribute.substring(1) in Pathfinder2E.ABILITIES) {
    for(attr in Pathfinder2E.ABILITIES) {
      attr = attr.toLowerCase();
      if(attribute != attr && attribute != 'abilities')
        continue;
      if(!(attr in attributes))
        attributes[attr] = 10;
      else if(attributes[attr] != 10) {
        let rolls = [];
        for(i = 0; i < 4; i++)
          rolls.push(QuilvynUtils.random(1, 6));
        rolls.sort();
        attributes[attr] = rolls[1] + rolls[2] + rolls[3];
      }
    }
  } else if(attribute == 'boosts') {
    let boostsAllocated = {};
    for(attr in Pathfinder2E.ABILITIES) {
      attr = attr.toLowerCase();
      boostsAllocated[attr] = attributes['abilityBoosts.' + attr] || 0;
    }
    attrs = this.applyRules(attributes);
    let notes = this.getChoices('notes');
    for(attr in attrs) {
      if((matchInfo = attr.match(/\wfeatures.Ability\s+Boost\s+\([^\)]*\)/gi)))
        ; // empty
      else if(!notes[attr] ||
         (matchInfo = notes[attr].match(/Ability\s+Boost\s+\([^\)]*\)/gi))==null)
        continue;
      matchInfo.forEach(matched => {
        matched.split(/\s*;\s*/).forEach(boost => {
          let m = boost.match(/Choose\s+(%V|\d+)\s+from\s+([\w,\s]*)/i);
          if(m) {
            console.log(boost);
            howMany = m[1].startsWith('%') ? attrs[attr] : +m[1];
            choices = m[2].match(/^any$/i) ? Object.keys(Pathfinder2E.ABILITIES) : m[2].split(/\s*,\s*/);
            choices = choices.map(x => x.toLowerCase());
            choices.forEach(choice => {
              if(howMany > 0 && boostsAllocated[choice] > 0) {
                howMany--;
                boostsAllocated[choice]--;
              }
            });
            while(howMany > 0 && choices.length > 0) {
              let choice = randomElement(choices);
              console.log('Boosting ' + choice);
              attributes['abilityBoosts.' + choice] = (attributes['abilityBoosts.' + choice] || 0) + 1;
              howMany--;
              choices = choices.filter(x => x != choice);
            }
          }
        });
      });
    }
  } else if(attribute == 'skills') {
    let boostsAllocated = {};
    for(attr in Pathfinder2E.SKILLS) {
      boostsAllocated[attr] = attributes['skillBoosts.' + attr] || 0;
    }
    attrs = this.applyRules(attributes);
    let notes = this.getChoices('notes');
    for(attr in attrs) {
      if((matchInfo = attr.match(/\wfeatures.SKILL\s+(Trained|Expert)\s+\([^\)]*\)/gi)))
        ; // empty
      else if(!notes[attr] ||
         (matchInfo = notes[attr].match(/Skill\s+(Trained|Expert)\s+\([^\)]*\)/gi))==null)
        continue;
      matchInfo.forEach(matched => {
        matched.split(/\s*;\s*/).forEach(boost => {
          let m = boost.match(/Choose\s+(%V|\d+)\s+from\s+([\w,\s]*)/i);
          if(m) {
            console.log(boost);
            howMany = m[1].startsWith('%') ? attrs[attr] : +m[1];
            choices = m[2].match(/^any$/i) ? Object.keys(Pathfinder2E.SKILLS) : m[2].split(/\s*,\s*/);
            choices.forEach(choice => {
              if(howMany > 0 && boostsAllocated[choice] > 0) {
                howMany--;
                boostsAllocated[choice]--;
              }
            });
            while(howMany > 0 && choices.length > 0) {
              let choice = randomElement(choices);
              console.log('Boosting ' + choice);
              attributes['skillBoosts.' + choice] = (attributes['skillBoosts.' + choice] || 0) + 1;
              howMany--;
              choices = choices.filter(x => x != choice);
            }
          }
        });
      });
    }
  } else if(attribute == 'armor') {
    let armors = this.getChoices('armors');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in armors) {
      let weight = QuilvynUtils.getAttrValue(armors[attr], 'Weight');
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
    attributes.armor = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'deity') {
    /* Pick a deity that's no more than one alignment position removed. */
    let aliInfo = attributes.alignment.match(/^([CLN]).*\s([GEN])/);
    let aliPat;
    if(aliInfo == null) /* Neutral character */
      aliPat = 'N[EG]?|[CL]N';
    else if(aliInfo[1] == 'N') /* NG or NE */
      aliPat = 'N|[CLN]' + aliInfo[2];
    else if(aliInfo[2] == 'N') /* CN or LN */
      aliPat = 'N|' + aliInfo[1] + '[GNE]';
    else /* [LC]G or [LC]E */
      aliPat = aliInfo[1] + '[N' + aliInfo[2] + ']|N' + aliInfo[2];
    choices = [];
    let deities = this.getChoices('deities');
    for(attr in deities) {
      if(deities[attr].match('=' + aliPat + '\\b'))
        choices.push(attr);
    }
    if(choices.length > 0)
      attributes.deity = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'feats' || attribute == 'features') {
    let debug = [];
    attribute = attribute == 'feats' ? 'feat' : 'selectableFeature';
    let countPrefix = attribute + 'Count.';
    let prefix = attribute + 's';
    let suffix = attribute.charAt(0).toUpperCase() + attribute.substring(1);
    let toAllocateByType = {};
    attrs = this.applyRules(attributes);
    for(attr in attrs) {
      if(attr.startsWith(countPrefix)) {
        toAllocateByType[attr.replace(countPrefix, '')] = attrs[attr];
      }
    }
    let availableChoices = {};
    let allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      let types = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Type');
      if(types.indexOf('General') < 0)
        types.push('General');
      if(attrs[prefix + '.' + attr] != null) {
        for(i = 0; i < types.length; i++) {
          let t = types[i];
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
      let availableChoicesInType = {};
      for(let a in availableChoices) {
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
        let pick;
        let picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug.push('From ' + QuilvynUtils.getKeys(picks).join(", ") + ' reject');
        for(pick in picks) {
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInType[pick];
        }
        let validate = this.applyRules(attributes);
        for(pick in picks) {
          let name = pick.charAt(0).toLowerCase() +
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
      let notes = attributes.notes;
      attributes.notes =
        (notes != null ? attributes.notes + '\n' : '') + debug.join('\n');
    }
  } else if(attribute == 'gender') {
    attributes.gender = QuilvynUtils.random(0, 99) < 50 ? 'Female' : 'Male';
  } else if(attribute == 'hitPoints') {
    attributes.hitPoints = 0;
    for(let clas in this.getChoices('levels')) {
      if((attr = attributes['levels.' + clas]) == null)
        continue;
      matchInfo = this.getChoices('levels')[clas].match(/^((\d+)?d)?(\d+)$/);
      let number = matchInfo == null || matchInfo[2] == null ||
                   matchInfo[2] == '' ? 1 : matchInfo[2];
      let sides = matchInfo == null || matchInfo[3] == null ||
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
    let assignedLevels = QuilvynUtils.sumMatching(attributes, /^levels\./);
    if(!attributes.level) {
      if(assignedLevels > 0)
        attributes.level = assignedLevels;
      else if(attributes.experience)
        attributes.level =
          Math.floor((1 + Math.sqrt(1 + attributes.experience/125)) / 2);
      else
        // Random 1..8 with each value half as likely as the previous one.
        attributes.level =
          9 - Math.floor(Math.log(QuilvynUtils.random(2, 511)) / Math.log(2));
    }
    let max = attributes.level * 1000 - 1;
    let min = (attributes.level - 1) * 1000;
    if(!attributes.experience || attributes.experience < min)
      attributes.experience = QuilvynUtils.random(min, max);
    choices = QuilvynUtils.getKeys(this.getChoices('levels'));
    if(assignedLevels == 0) {
      let classesToChoose =
        attributes.level == 1 || QuilvynUtils.random(1,10) < 9 ? 1 : 2;
      // Find choices that are valid or can be made so
      while(classesToChoose > 0) {
        let which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
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
      let which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      while(!attributes[which]) {
        which = 'levels.' + choices[QuilvynUtils.random(0,choices.length-1)];
      }
      attributes[which]++;
      assignedLevels++;
    }
    delete attributes.level;
  } else if(attribute == 'name') {
    attributes.name = Pathfinder2E.randomName(attributes.ancestry);
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
    attributes.shield = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'spells') {
    let availableSpellsByGroupAndLevel = {};
    let groupAndLevel;
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
        let slots = attrs['spellSlots.' + groupAndLevel];
        if(slots != null && slots < howMany) {
          howMany = slots;
        }
        pickAttrs
          (attributes, 'spells.', choices, howMany -
           QuilvynUtils.sumMatching(attributes, '^spells\\..*[(]' + groupAndLevel + '[^0]'), 1);
      }
    }
  } else if(attribute == 'weapons') {
    let weapons = this.getChoices('weapons');
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in weapons) {
      let category = QuilvynUtils.getAttrValue(weapons[attr], 'Category');
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
  } else if(this.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      QuilvynUtils.randomKey(this.getChoices(attribute + 's'));
  }

};

/* Fixes as many validation errors in #attributes# as possible. */
Pathfinder2E.makeValid = function(attributes) {

  let attributesChanged = {};
  let debug = [];
  let notes = this.getChoices('notes');

  // If 8 passes don't get rid of all repairable problems, give up
  for(let pass = 0; pass < 8; pass++) {

    let applied = this.applyRules(attributes);
    let fixedThisPass = 0;

    // Try to fix each sanity/validation note w/a non-zero value
    for(let attr in applied) {

      let matchInfo =
        attr.match(/^(sanity|validation)Notes\.(.*)([A-Z][a-z]+)/);
      let attrValue = applied[attr];

      if(matchInfo == null || !attrValue || notes[attr] == null) {
        continue;
      }

      let problemSource = matchInfo[2];
      let problemCategory = matchInfo[3].substring(0, 1).toLowerCase() +
                            matchInfo[3].substring(1).replaceAll(' ', '');
      if(problemCategory == 'features') {
        problemCategory = 'selectableFeatures';
      }
      let requirements =
        notes[attr].replace(/^(Implies|Requires)\s/, '').split(/\s*\/\s*/);

      for(let i = 0; i < requirements.length; i++) {

        // Find a random requirement choice w/the format "name [op value]"
        let choices = requirements[i].split(/\s*\|\|\s*/);
        while(choices.length > 0) {
          let index = QuilvynUtils.random(0, choices.length - 1);
          matchInfo = choices[index].match(/^([^<>!=]+)(([<>!=~]+)(.*))?/);
          if(matchInfo != null) {
            break;
          }
          choices = choices.slice(0, index).concat(choices.slice(index + 1));
        }
        if(matchInfo == null) {
          continue;
        }

        let toFixCombiner = null;
        let toFixName = matchInfo[1].replace(/\s+$/, '');
        let toFixOp = matchInfo[3] == null ? '>=' : matchInfo[3];
        let toFixValue =
          matchInfo[4] == null ? 1 : matchInfo[4].replace(/^\s+/, '');
        if(toFixName.match(/^(Max|Sum)/)) {
          toFixCombiner = toFixName.substring(0, 3);
          toFixName = toFixName.substring(4).replace(/^\s+/, '');
        }
        let toFixAttr = toFixName.substring(0, 1).toLowerCase() +
                        toFixName.substring(1).replaceAll(' ', '');

        // See if this attr has a set of choices (e.g., ancestry) or a category
        // attribute (e.g., a feat)
        choices = this.getChoices(toFixAttr + 's');
        if(choices == null) {
           choices = this.getChoices(problemCategory);
        }
        if(choices != null) {
          // Find the set of choices that satisfy the requirement
          let target =
            this.getChoices(problemCategory) == null ? toFixValue : toFixName;
          let possibilities = [];
          for(let choice in choices) {
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
          let possibilities = [];
          for(let k in attributes) {
            if(k.match('^' + problemSource + '\\.') &&
               attributesChanged[k] == null) {
               possibilities.push(k);
            }
          }
          while(possibilities.length > 0 && attrValue > 0) {
            let index = QuilvynUtils.random(0, possibilities.length - 1);
            toFixAttr = possibilities[index];
            possibilities =
              possibilities.slice(0,index).concat(possibilities.slice(index+1));
            let current = attributes[toFixAttr];
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
          let abilities = {
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
    'Pathfinder2E Quilvyn Module Version ' + Pathfinder2E.VERSION + '\n' +
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
