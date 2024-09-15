/*
Copyright 2024, James J. Hayes

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
  rules.plugin = Pathfinder2E;
  Pathfinder2E.rules = rules;

  rules.defineChoice('choices', Pathfinder2E.CHOICES);
  rules.choiceEditorElements = Pathfinder2E.choiceEditorElements;
  rules.choiceRules = Pathfinder2E.choiceRules;
  rules.removeChoice = Pathfinder2E.removeChoice;
  rules.editorElements = Pathfinder2E.initialEditorElements();
  rules.getChoices = Pathfinder2E.getChoices;
  rules.getFormats = Pathfinder2E.getFormats;
  rules.getPlugins = Pathfinder2E.getPlugins;
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
    'levels:Class Levels,bag,levels',
    'abilityGeneration:Ability Generation,select-one,abilgens'
  );
  rules.addChoice('abilgens', 'All 10s; standard ancestry boosts', '');
  rules.addChoice('abilgens', 'All 10s; two free ancestry boosts', '');
  rules.addChoice('abilgens', 'Each 4d6, standard ancestry boosts', '');
  rules.addChoice('abilgens', 'Each 4d6, one free ancestry boost', '');

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
    Pathfinder2E.LANGUAGES, Pathfinder2E.SKILLS, Pathfinder2E.TERRAINS
  );

  Quilvyn.addRuleSet(rules);
}

Pathfinder2E.VERSION = '2.4.1.0';

/* List of items handled by choiceRules method. */
Pathfinder2E.CHOICES = [
  'Alignment', 'Ancestry', 'Armor', 'Background', 'Class', 'Deity', 'Feat',
  'Feature', 'Goody', 'Language', 'Lore', 'School', 'Shield', 'Skill', 'Spell',
  'Terrain', 'Weapon'
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
  'armor', 'weapons', 'shield', 'spells', 'boosts'
];
Pathfinder2E.VIEWERS = ['Collected Notes', 'Compact', 'Standard'];

Pathfinder2E.ABILITIES = {
  'charisma':'',
  'constitution':'',
  'dexterity':'',
  'intelligence':'',
  'strength':'',
  'wisdom':''
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
    'Size=Medium ' +
    'Features=' +
      '1:Slow,' +
      '"abilityGeneration =~ \'10s..standard\' ? 1:Ability Boost (Constitution; Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6..standard\' ? 1:Ability Boost (Constitution; Wisdom)",' +
      '"abilityGeneration =~ \'10s..two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6..one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Charisma)",' +
      '1:Darkvision,"1:Clan Dagger","1:Ancestry Feats",' +
      '"features.Ancient-Blooded Dwarf ? 1:Call On Ancient Blood" ' +
    'Selectables=' +
      '"1:Ancient-Blooded Dwarf:Heritage","1:Death Warden Dwarf:Heritage",' +
      '"1:Forge Dwarf:Heritage","1:Rock Dwarf:Heritage",' +
      '"1:Strong-Blooded Dwarf:Heritage" ' +
    'Traits=Dwarf,Humanoid ' +
    'Languages=Common,Dwarven',
  'Elf':
    'HitPoints=6 ' +
    'Size=Medium ' +
    'Features=' +
      '"abilityGeneration =~ \'10s..standard\' ? 1:Ability Boost (Dexterity; Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6..standard\' ? 1:Ability Boost (Dexterity; Intelligence)",' +
      '"abilityGeneration =~ \'10s..two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6..one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Constitution)",' +
      '"1:Low-Light Vision","1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Arctic Elf:Heritage","1:Cavern Elf:Heritage","1:Seer Elf:Heritage",' +
      '"1:Whisper Elf:Heritage","1:Woodland Elf:Heritage" ' +
    'Traits=Elf,Humanoid ' +
    'Languages=Common,Elven',
  'Gnome':
    'HitPoints=8 ' +
    'Size=Small ' +
    'Features=' +
      '"abilityGeneration =~ \'10s..standard\' ? 1:Ability Boost (Charisma; Constitution; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6..standard\' ? 1:Ability Boost (Charisma; Constitution)",' +
      '"abilityGeneration =~ \'10s..two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6..one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Strength)",' +
      '"1:Low-Light Vision",1:Small,"1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Chameleon Gnome:Heritage","1:Fey-Touched Gnome:Heritage",' +
      '"1:Sensate Gnome:Heritage","1:Umbral Gnome:Heritage",' +
      '"1:Wellspring Gnome:Heritage" ' +
    'Traits=Gnome,Humanoid ' +
    'Languages=Common,Gnomish,Sylvan',
  'Goblin':
    'HitPoints=6 ' +
    'Size=Small ' +
    'Features=' +
      '"abilityGeneration =~ \'10s..standard\' ? 1:Ability Boost (Charisma; Dexterity; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6..standard\' ? 1:Ability Boost (Charisma; Dexterity)",' +
      '"abilityGeneration =~ \'10s..two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6..one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Wisdom)",' +
      '1:Darkvision,1:Small,"1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Charhide Goblin:Heritage","1:Irongut Goblin:Heritage",' +
      '"1:Razortooth Goblin:Heritage","1:Snow Goblin:Heritage",' +
      '"1:Unbreakable Goblin:Heritage" ' +
    'Languages=Common,Goblin',
  'Halfling':
    'HitPoints=6 ' +
    'Size=Small ' +
    'Features=' +
      '"abilityGeneration =~ \'10s..standard\' ? 1:Ability Boost (Dexterity; Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6..standard\' ? 1:Ability Boost (Dexterity; Wisdom)",' +
      '"abilityGeneration =~ \'10s..two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6..one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Strength)",' +
      '"1:Keen Eyes",1:Small,"1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Gutsy Halfling:Heritage","1:Hillock Halfling:Heritage",' +
      '"1:Nomadic Halfling:Heritage","1:Twilight Halfling:Heritage",' +
      '"1:Wildwood Halfling:Heritage" ' +
    'Traits=Humanoid,Halfling ' +
    'Languages=Common,Halfling',
  'Human':
    'HitPoints=8 ' +
    'Size=Medium ' +
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"1:Ancestry Feats" ' +
    'Selectables=' +
      '1:Half-Elf:Heritage,1:Half-Orc:Heritage,' +
      '"1:Skilled Heritage Human:Heritage",' +
      '"1:Versatile Heritage Human:Heritage" ' +
    'Traits=Humanoid,Human ' +
    'Languages=Common,any'
};
Pathfinder2E.ARMORS = {
  'None':'Category=Unarmored Price=0 AC=0 Check=0 Str=0 Speed=0 Bulk=0',
  "Explorer's Clothing":
    'Category=Unarmored Price=0.1 AC=0 Check=0 Str=3 Speed=0 Bulk=L Group=Cloth Trait=Comfort',
  'Padded':
    'Category=Light Price=0.2 AC=1 Dex=3 Str=10 Check=0 Str=3 Speed=0 Bulk=L Group=Cloth Trait=Comfort',
  'Leather':
    'Category=Light Price=2 AC=1 Dex=4 Check=-1 Str=10 Speed=0 Bulk=1 Group=Leather',
  'Studded Leather':
    'Category=Light Price=2 AC=1 Dex=3 Check=-1 Str=12 Speed=0 Bulk=1 Group=Leather',
  'Chain Shirt':
    'Category=Light Price=5 AC=2 Dex=3 Check=-1 Str=12 Speed=0 Bulk=1 Group=Chain Trait=Flexible,Noisy',
  'Hide':
    'Category=Medium Price=2 AC=3 Dex=2 Check=-2 Speed=-5 Str=14 Bulk=2 Group=Leather',
  'Scale Mail':
    'Category=Medium Price=4 AC=3 Dex=2 Check=-2 Speed=-5 Str=14 Bulk=2 Group=Composite',
  'Chain Mail':
    'Category=Medium Price=6 AC=4 Dex=1 Check=-2 Speed=-5 Str=16 Bulk=2 Group=Chain Trait=Flexible,Noisy',
  'Breastplate':
    'Category=Medium Price=8 AC=4 Dex=1 Check=-2 Speed=-5 Str=16 Bulk=2 Group=Plate',
  'Splint Mail':
    'Category=Heavy Price=13 AC=5 Dex=1 Check=-3 Speed=-10 Str=16 Bulk=3 Group=Composite',
  'Half Plate':
    'Category=Heavy Price=18 AC=5 Dex=1 Check=-3 Speed=-10 Str=16 Bulk=3 Group=Plate',
  'Full Plate':
    'Category=Heavy Price=18 AC=6 Dex=0 Check=-3 Speed=-10 Str=18 Bulk=4 Group=Plate Trait=Bulwark'
};
Pathfinder2E.BACKGROUNDS = {
  'Acolyte':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",'+
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Intelligence, Wisdom)",'+
      '"1:Skill Trained (Religion; Scribing Lore)","1:Student Of The Canon"',
  'Acrobat':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Skill Trained (Acrobatics; Circus Lore)","1:Steady Balance"',
  'Animal Whisperer':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Wisdom)",' +
      '"1:Skill Trained (Nature; Choose 1 from any Terrain Lore)",' +
      '"1:Train Animal"',
  'Artisan':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Intelligence, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Intelligence, Strength)",' +
      '"1:Skill Trained (Crafting; Guild Lore)","1:Specialty Crafting"',
  'Artist':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Dexterity)",' +
      '"1:Skill Trained (Crafting; Art Lore)","1:Specialty Crafting"',
  'Barkeep':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Constitution; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Constitution)",' +
      '"1:Skill Trained (Diplomacy; Alcohol Lore)",1:Hobnobber',
  'Barrister':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence)",' +
      '"1:Skill Trained (Diplomacy; Legal Lore)","1:Group Impression"',
  'Bounty Hunter':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Strength, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Strength, Wisdom)",' +
      '"1:Skill Trained (Survival; Legal Lore)","1:Experienced Tracker"',
  'Charlatan':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence)",' +
      '"1:Skill Trained (Deception; Underworld Lore)","1:Charming Liar"',
  'Criminal':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Dexterity, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Dexterity, Intelligence)",' +
      '"1:Skill Trained (Stealth; Underworld Lore)","1:Experienced Smuggler"',
  'Detective':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Intelligence, Wisdom)",' +
      '"1:Skill Trained (Society; Underworld Lore)",1:Streetwise',
  'Emissary':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence)",' +
      '"1:Skill Trained (Society; Choose 1 from any Settlement Lore)",1:Multilingual',
  'Entertainer':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Dexterity)",' +
      '"1:Skill Trained (Performance; Theater Lore)",' +
      '"1:Fascinating Performance"',
  'Farmhand':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom)",' +
      '"1:Skill Trained (Athletics; Farming Lore)","1:Assurance (Athletics)"',
  'Field Medic':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom)",' +
      '"1:Skill Trained (Medicine; Warfare Lore)","1:Battle Medicine"',
  'Fortune Teller':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost; Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost; Choose 1 from Charisma, Intelligence)",' +
      '"1:Skill Trained (Occultism; Fortune-Telling Lore)",' +
      '"1:Oddity Identification"',
  'Gambler':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Dexterity)",' +
      '"1:Skill Trained (Deception; Games Lore)","1:Lie To Me"',
  'Gladiator':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Strength)",' +
      '"1:Skill Trained (Performance; Gladitorial Lore)",' +
      '"1:Impressive Performance"',
  'Guard':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Strength)",' +
      '"1:Skill Trained (Intimidation; Choose 1 from Legal Lore, Warfare Lore)","1:Quick Coercion"',
  'Herbalist':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom)",' +
      '"1:Skill Trained (Nature; Herbalism Lore)","1:Natural Medicine"',
  'Hermit':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Intelligence)",' +
      '"1:Skill Trained (Choose 1 from Nature, Occultism; Choose 1 from any Terrain Lore)",' +
      '"1:Dubious Knowledge"',
  'Hunter':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Dexterity, Wisdom)",' +
      '"1:Skill Trained (Survival; Tanning Lore)","1:Survey Wildlife"',
  'Laborer':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Strength)",' +
      '"1:Skill Trained (Athletics; Labor Lore)","1:Hefty Hauler"',
  'Martial Disciple':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Skill Trained (Choose 1 from Acrobatics, Athletics; Warfare Lore)",' +
      // TODO Add a note for this
      '"skillIncreases.Acrobatics>0 ? 1:Cat Fall",' +
      '"skillIncreases.Acrobatics==0 ? 1:Quick Jump"',
  'Merchant':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence)",' +
      '"1:Skill Trained (Diplomacy; Mercantile Lore)","1:Bargain Hunter"',
  'Miner':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Strength, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Strength, Wisdom)",' +
      '"1:Skill Trained (Survival; Mining Lore)",' +
      '"1:Terrain Expertise (Underground)"',
  'Noble':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Charisma, Intelligence)",' +
      '"1:Skill Trained (Society; Choose 1 from Genealogy Lore, Heraldry Lore)","1:Courtly Graces"',
  'Nomad':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Wisdom)",' +
      '"1:Skill Trained (Survival; Choose 1 from any Terrain Lore)",' +
      '"1:Assurance (Survival)"',
  'Prisoner':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Strength)",' +
      '"1:Skill Trained (Stealth; Underworld Lore)","1:Experienced Smuggler"',
  'Sailor':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Skill Trained (Athletics; Sailing Lore)","1:Underwater Marauder"',
  'Scholar':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Intelligence, Wisdom)",' +
      '"1:Skill Trained (Choose 1 from Arcana, Nature, Occultism, Religion; Academia Lore)",' +
      // TODO this will erroneously add feats for other trained skills
      '"skillIncreases.Arcana>0 ? 1:Assurance (Arcana)",' +
      '"skillIncreases.Nature>0  ? 1:Assurance (Nature)",' +
      '"skillIncreases.Occultism>0  ? 1:Assurance (Occultism)",' +
      '"skillIncreases.Religion>0  ? 1:Assurance (Religion)"',
  'Scout':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Dexterity, Wisdom)",' +
      '"1:Skill Trained (Survival; Choose 1 from any Terrain Lore)",' +
      '1:Forager',
  'Street Urchin':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Dexterity; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Dexterity)",' +
      '"1:Skill Trained (Thievery; Choose 1 from any Settlement Lore)",1:Pickpocket',
  'Tinker':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Dexterity, Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Dexterity, Intelligence)",' +
      '"1:Skill Trained (Crafting; Engineering Lore)","1:Specialty Crafting"',
  'Warrior':
    'Features=' +
      '"abilityGeneration =~ \'10s\' ? 1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6\' ? 1:Ability Boost (Choose 1 from Constitution, Strength)",' +
      '"1:Skill Trained (Intimidation; Warfare Lore)","1:Intimidating Glare"'
};
Pathfinder2E.CLASSES = {
  'Alchemist':
    'Ability=intelligence HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Intelligence)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Alchemist Skills",' +
      '"1:Attack Trained (Simple Weapons; Alchemical Bombs; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Class Trained (Alchemist)",' +
      '"1:Alchemy","1:Infused Reagents","1:Advanced Alchemy","1:Quick Alchemy",' +
      '"1:Formula Book","1:Research Field","1:Mutagenic Flashback",' +
      '"1:Alchemist Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases","5:Field Discovery","5:Powerful Alchemy",' +
      '"7:Alchemical Weapon Expertise","7:Iron Will","7:Perpetual Infusions",' +
      '"9:Alchemical Expertise","9:Alertness","9:Double Brew",' +
      '"11:Juggernaut","11:Perpetual Potency",' +
      '"features.Bomber ? 13:Greater Field Discovery (Bomber)",' +
      '"features.Chirurgeon ? 13:Greater Field Discovery (Chirurgeon)",' +
      '"features.Mutagenist ? 13:Greater Field Discovery (Mutagenist)",' +
      '"13:Medium Armor Expertise","13:Weapon Specialization",' +
      '"15:Alchemical Alacrity","15:Evasion","17:Alchemical Mastery",' +
      '"17:Perpetual Perfection","19:Medium Armor Mastery" ' +
    'Selectables=' +
      '"1:Bomber:Research Field",' +
      '"1:Chirurgeon:Research Field",' +
      '"1:Mutagenist:Research Field"',
  'Barbarian':
    'Ability=strength HitPoints=12 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Strength)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Will)","1:Save Trained (Reflex)",' +
      '"1:Barbarian Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Class Trained (Barbarian)",' +
      '"1:Rage","1:Instinct","1:Barbarian Feats",' +
      '"features.Animal Instinct ? 1:Bestial Rage",' +
      '"features.Dragon Instinct ? 1:Draconic Rage",' +
      '"features.Giant Instinct ? 1:Titan Mauler",' +
      '"features.Spirit Instinct ? 1:Spirit Rage",' +
      '"2:Skill Feats","3:Deny Advantage","3:General Feats",' +
      '"3:Skill Increases","5:Brutality","7:Juggernaut",' +
      '"7:Specialization Ability","7:Weapon Specialization",' +
      '"9:Lightning Reflexes","9:Raging Resistance","11:Mighty Rage",' +
      '"13:Greater Juggernaut","13:Medium Armor Expertise","13:Weapon Fury",' +
      '"15:Greater Weapon Specialization","15:Indomitable Will",' +
      '"17:Heightened Senses","17:Quick Rage","19:Armor Of Fury",' +
      '"19:Devastator" ' +
    'Selectables=' +
      '"1:Fury Instinct:Instinct",' +
      '"1:Giant Instinct:Instinct",' +
      '"1:Spirit Instinct:Instinct",' +
      '"1:Animal Instinct (Ape):Instinct",' +
      '"1:Animal Instinct (Bear):Instinct",' +
      '"1:Animal Instinct (Bull):Instinct",' +
      '"1:Animal Instinct (Cat):Instinct",' +
      '"1:Animal Instinct (Deer):Instinct",' +
      '"1:Animal Instinct (Frog):Instinct",' +
      '"1:Animal Instinct (Shark):Instinct",' +
      '"1:Animal Instinct (Snake):Instinct",' +
      '"1:Animal Instinct (Wolf):Instinct",' +
      '"1:Dragon Instinct (Black):Instinct",' +
      '"1:Dragon Instinct (Blue):Instinct",' +
      '"1:Dragon Instinct (Green):Instinct",' +
      '"1:Dragon Instinct (Red):Instinct",' +
      '"1:Dragon Instinct (White):Instinct",' +
      '"1:Dragon Instinct (Brass):Instinct",' +
      '"1:Dragon Instinct (Bronze):Instinct",' +
      '"1:Dragon Instinct (Copper):Instinct",' +
      '"1:Dragon Instinct (Gold):Instinct",' +
      '"1:Dragon Instinct (Silver):Instinct"',
  'Bard':
    'Ability=charisma HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Charisma)",' +
      '"1:Perception Expert",' +
      '"1:Save Trained (Fortitude; Reflex)","1:Save Expert (Will)",' +
      '"1:Bard Skills",' +
      '"1:Attack Trained (Simple Weapons; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Spell Trained (Occult)",' +
      '"1:Occult Spellcasting","1:Composition Spells","1:Muses",' +
      '"2:Bard Feats","2:Skill Feats","3:General Feats",' +
      '"3:Lightning Reflexes","3:Signature Spells","3:Skill Increases",' +
      '"7:Expert Spellcaster","9:Great Fortitude","9:Resolve",' +
      '"11:Bard Weapon Expertise","11:Vigilant Senses",' +
      '"13:Light Armor Expertise","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Greater Resolve","19:Magnum Opus",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '"1:Enigma Muse:Muse","1:Maestro Muse:Muse","1:Polymath Muse:Muse" ' +
    'SpellSlots=' +
      'O0:5@1,' +
      'O1:2@1;3@2,' +
      'O2:2@3;3@4,' +
      'O3:2@5;3@6,' +
      'O4:2@7;3@8,' +
      'O5:2@9;3@10,' +
      'O6:2@11;3@12,' +
      'O7:2@13;3@14,' +
      'O8:2@15;3@16,' +
      'O9:2@17;3@18,' +
      'O10:1@19',
  'Champion':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Will)","1:Save Trained (Reflex)",' +
      '"1:Champion Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"1:Class Trained (Champion)",' +
      '"1:Spell Trained (Divine)",' +
      '"1:Cause","1:Champion\'s Code","1:Deific Weapon",' +
      '"1:Champion\'s Reaction",' +
      '"features.Liberator ? 1:Liberating Step",' +
      '"features.Paladin ? 1:Retributive Strike",' +
      '"features.Redeemer ? 1:Glimpse Of Redemption",' +
      '"1:Devotion Spells","1:Shield Block","1:Champion Feats",' +
      '"2:Skill Feats","3:Divine Ally","3:General Feats","3:Skill Increases",' +
      '"5:Weapon Expertise","7:Armor Expertise","7:Weapon Specialization",' +
      '"9:Champion Expertise",' +
      '"features.Liberator ? 9:Divine Smite (Liberator)",' +
      '"features.Paladin ? 9:Divine Smite (Paladin)",' +
      '"features.Redeemer ? 9:Divine Smite (Redeemer)",' +
      '"9:Juggernaut",' +
      '"9:Lightning Reflexes","11:Alertness","11:Divine Will",' +
      '"features.Liberator ? 11:Exalt (Liberator)",' +
      '"features.Paladin ? 11:Exalt (Paladin)",' +
      '"features.Redeemer ? 11:Exalt (Redeemer)",' +
      '"13:Armor Mastery","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","17:Champion Mastery",' +
      '"17:Legendary Armor","19:Hero\'s Defiance" ' +
    'Selectables=' +
      '"1:The Tenets Of Good:Champion\'s Code",' +
      '"1:Divine Ally (Blade):Divine Ally","1:Divine Ally (Shield):Divine Ally","1:Divine Ally (Steed):Divine Ally",' +
      '"alignment == \'Lawful Good\' ? 1:Paladin:Cause",' +
      '"alignment == \'Neutral Good\' ? 1:Redeemer:Cause",' +
      '"alignment == \'Chaotic Good\' ? 1:Liberator:Cause"',
  'Cleric':
    'Ability=wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Wisdom)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Cleric Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Spell Trained (Divine)",' +
      '"1:Anathema","1:Deity","1:Divine Spellcasting","1:Divine Font",' +
      '"1:Doctrine","2:Cleric Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases","5:Alertness","9:Resolve","11:Lightning Reflexes",' +
      '"13:Divine Defense","13:Weapon Specialization","19:Miraculous Spell" ' +
    'Selectables=' +
      '"1:Healing Font:Divine Font","1:Harmful Font:Divine Font",' +
      '"1:Cloistered Cleric:Doctrine","1:Warpriest:Doctrine" ' +
    'SpellSlots=' +
      'D0:5@1,' +
      'D1:2@1;3@2,' +
      'D2:2@3;3@4,' +
      'D3:2@5;3@6,' +
      'D4:2@7;3@8,' +
      'D5:2@9;3@10,' +
      'D6:2@11;3@12,' +
      'D7:2@13;3@14,' +
      'D8:2@15;3@16,' +
      'D9:2@17;3@18,' +
      'D10:1@19',
  'Druid':
    'Ability=wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Wisdom)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Druid Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Spell Trained (Primal)",' +
      '"1:Primal Spellcasting","1:Anathema","1:Druidic Language",' +
      '"1:Druidic Order","1:Shield Block","1:Wild Empathy","2:Druid Feats",' +
      '"2:Skill Feats","3:Alertness","3:General Feats","3:Great Fortitude",' +
      '"3:Skill Increases","5:Lightning Reflexes","7:Expert Spellcaster",' +
      '"11:Druid Weapon Expertise","11:Resolve","13:Medium Armor Expertise",' +
      '"13:Weapon Specialization","15:Master Spellcaster",' +
      '"19:Legendary Spellcaster","19:Primal Hierophant" ' +
    'Selectables=' +
      '"1:Animal Order:Order",' +
      '"1:Leaf Order:Order",' +
      '"1:Storm Order:Order",' +
      '"1:Wild Order:Order" ' +
    'SpellSlots=' +
      'P0:5@1,' +
      'P1:2@1;3@2,' +
      'P2:2@3;3@4,' +
      'P3:2@5;3@6,' +
      'P4:2@7;3@8,' +
      'P5:2@9;3@10,' +
      'P6:2@11;3@12,' +
      'P7:2@13;3@14,' +
      'P8:2@15;3@16,' +
      'P9:2@17;3@18,' +
      'P10:1@19',
  'Fighter':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Fighter Skills",' +
      '"1:Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)","1:Attack Trained (Advanced Weapons)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"1:Class Trained (Fighter)",' +
      '"1:Attack Of Opportunity","1:Shield Block","1:Fighter Feats",' +
      '"2:Skill Feats","3:Bravery","3:General Feats","3:Skill Increases",' +
      '"5:Fighter Weapon Mastery","7:Battlefield Surveyor",' +
      '"7:Weapon Specialization","9:Combat Flexibility","9:Juggernaut",' +
      '"11:Armor Expertise","11:Fighter Expertise","13:Weapon Legend",' +
      '"15:Evasion","15:Greater Weapon Specialization",' +
      '"15:Improved Flexibility","17:Armor Mastery","19:Versatile Legend"',
  'Monk':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Reflex; Will)",' +
      '"1:Monk Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Expert (Unarmored Defense)",' +
      '"1:Class Trained (Monk)",' +
      '"1:Flurry Of Blows","1:Powerful Fist","1:Monk Feats",' +
      '"2:Skill Feats","3:General Feats","3:Incredible Movement",' +
      '"3:Mystic Strikes","3:Skill Increases","5:Alertness",' +
      '"5:Expert Strikes","7:Path To Perfection","7:Weapon Specialization",' +
      '"9:Metal Strikes","9:Monk Expertise","11:Second Path To Perfection",' +
      '"13:Graceful Mastery","13:Master Strikes",' +
      '"15:Greater Weapon Specialization","15:Third Path To Perfection",' +
      '"17:Adamantine Strikes","17:Graceful Legend","19:Perfected Form",' +
      '"features.Ki Spells ? 1:Ki Tradition" ' +
    'Selectables=' +
      '"1:Ki Tradition (Divine):Ki Tradition",' +
      '"1:Ki Tradition (Occult):Ki Tradition",' +
      '"7:Path To Perfection (Fortitude):Perfection",' +
      '"7:Path To Perfection (Reflex):Perfection",' +
      '"7:Path To Perfection (Will):Perfection"',
  'Ranger':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","Save Trained (Will)",' +
      '"1:Ranger Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Class Trained (Ranger)",' +
      '"1:Hunt Prey","1:Hunter\'s Edge","1:Ranger Feats","2:Skill Feats",' +
      '"3:General Feats","3:Iron Will","3:Skill Increases",' +
      '"5:Ranger Weapon Expertise","5:Trackless Step","7:Evasion",' +
      '"7:Vigilant Senses","7:Weapon Specialization","9:Nature\'s Edge",' +
      '"9:Ranger Expertise","11:Juggernaut","11:Medium Armor Expertise",' +
      '"11:Wild Stride","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","15:Improved Evasion",' +
      '"15:Incredible Senses","17:Masterful Hunter","19:Second Skin",' +
      '"19:Swift Prey" ' +
    'Selectables=' +
      '"1:Flurry:Hunter\'s Edge",' +
      '"1:Precision:Hunter\'s Edge",' +
      '"1:Outwit:Hunter\'s Edge"',
  'Rogue':
    // TODO "Other" ability depending on racket
    'Ability=dexterity HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from any)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Reflex; Will)","Save Trained (Fortitude)",' +
      '"1:Rogue Skills",' +
      '"1:Attack Trained (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Class Trained (Rogue)",' +
      '"1:Rogue\'s Racket","1:Sneak Attack","1:Surprise Attack",' +
      '"1:Rogue Feats","1:Skill Feats","2:Skill Increases",' +
      '"3:Deny Advantage","3:General Feats","5:Weapon Tricks","7:Evasion",' +
      '"7:Vigilant Senses","7:Weapon Specialization","9:Debilitating Strike",' +
      '"9:Great Fortitude","11:Rogue Expertise","13:Improved Evasion",' +
      '"13:Incredible Senses","13:Light Armor Expertise","13:Master Tricks",' +
      '"15:Double Debilitation","15:Greater Weapon Specialization",' +
      '"17:Slippery Mind","19:Light Armor Mastery","19:Master Strike" ' +
    'Selectables=' +
      '"1:Ruffian:Racket","1:Scoundrel:Racket","1:Thief:Racket"',
  'Sorcerer':
    'Ability=charisma HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Sorcerer Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Bloodline","1:Sorcerer Spellcasting","2:Skill Feats",' +
      '"2:Sorcerer Feats","3:General Feats","3:Signature Spells",' +
      '"3:Skill Increases","5:Magical Fortitude","7:Expert Spellcaster",' +
      '"9:Lightning Reflexes","11:Alertness","11:Sorcerer Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Resolve","19:Bloodline Paragon",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '"1:Aberrant:Bloodline","1:Angelic:Bloodline","1:Demonic:Bloodline",' +
      '"1:Diabolic:Bloodline","1:Draconic:Bloodline","1:Elemental:Bloodline",' +
      '"1:Fey:Bloodline","1:Hag:Bloodline","1:Imperial:Bloodline",' +
      '"1:Undead:Bloodline" ' +
    // SpellSlots depends on bloodline
    'SpellSlots=',
  'Wizard':
    'Ability=intelligence HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Intelligence)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Wizard Skills",' +
      '"1:Attack Trained (Club; Crossbow; Dagger; Heavy Crossbow; Staff; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Spell Trained (Arcane)",' +
      '"1:Arcane Spellcasting","1:Arcane School","1:Arcane Bond",' +
      '"1:Arcane Thesis","2:Skill Feats","2:Wizard Feats","3:General Feats",' +
      '"3:Skill Increases","5:Lightning Reflexes","7:Expert Spellcaster",' +
      '"9:Magical Fortitude","11:Alertness","11:Wizard Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Resolve","19:Archwizard\'s Spellcraft",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '"1:Abjuration:Specialization",' +
      '"1:Conjuration:Specialization",' +
      '"1:Divination:Specialization",' +
      '"1:Enchantment:Specialization",' +
      '"1:Evocation:Specialization",' +
      '"1:Illusion:Specialization",' +
      '"1:Necromancy:Specialization",' +
      '"1:Transmutation:Specialization",' +
      '"1:Universalist:Specialization",' +
      '"1:Improved Familiar Attunement:Thesis",' +
      '"1:Metamagical Experimentation:Thesis",' +
      '"1:Spell Blending:Thesis",' +
      '"1:Spell Substitution:Thesis" ' +
    'SpellSlots=' +
      'A0:5@1,' +
      'A1:2@1;3@2,' +
      'A2:2@3;3@4,' +
      'A3:2@5;3@6,' +
      'A4:2@7;3@8,' +
      'A5:2@9;3@10,' +
      'A6:2@11;3@12,' +
      'A7:2@13;3@14,' +
      'A8:2@15;3@16,' +
      'A9:2@17;3@18,' +
      'A10:1@19',
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
    'Alignment=N Font=Heal Skill=Survival Weapon=Trident ' +
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
    'Type=Ancestry,Dwarf Require="level >= 5","features.Rock Runner"',
  'Dwarven Weapon Cunning':
    'Type=Ancestry,Dwarf ' +
    'Require="level >= 5","features.Dwarven Weapon Familiarity"',
  "Mountain's Stoutness":'Type=Ancestry,Dwarf Require="level >= 9"',
  'Stonewalker':'Type=Ancestry,Dwarf Require="level >= 9"',
  'Dwarven Weapon Expertise':
    'Type=Ancestry,Dwarf ' +
    'Require="level >= 13","features.Dwarven Weapon Familiarity"',

  'Ancestral Longevity':'Type=Ancestry,Elf',
  'Elven Lore':'Type=Ancestry,Elf',
  'Elven Weapon Familiarity':'Type=Ancestry,Elf',
  'Forlorn':'Type=Ancestry,Elf',
  'Nimble Elf':'Type=Ancestry,Elf',
  'Otherworldly Magic':'Type=Ancestry,Elf',
  'Unwavering Mien':'Type=Ancestry,Elf',
  'Ageless Patience':'Type=Ancestry,Elf Require="level >= 5"',
  'Elven Weapon Elegance':
    'Type=Ancestry,Elf ' +
    'Require="level >= 5","features.Elven Weapon Familiarity"',
  'Elf Step':'Type=Ancestry,Elf Require="level >= 9"',
  'Expert Longevity':
    'Type=Ancestry,Elf Require="level >= 9","features.Ancestral Longevity"',
  'Universal Longevity':
    'Type=Ancestry,Elf Require="level >= 13","features.Expert Longevity"',
  'Elven Weapon Expertise':
    'Type=Ancestry,Elf ' +
    'Require="level >= 13","features.Elven Weapon Familiarity"',

  'Animal Accomplice':'Type=Ancestry,Gnome',
  'Burrow Elocutionist':'Type=Ancestry,Gnome',
  'Fey Fellowship':'Type=Ancestry,Gnome',
  'First World Magic':'Type=Ancestry,Gnome',
  'Gnome Obsession':'Type=Ancestry,Gnome',
  'Gnome Weapon Familiarity':'Type=Ancestry,Gnome',
  'Illusion Sense':'Type=Ancestry,Gnome',
  'Animal Elocutionist':
    'Type=Ancestry,Gnome Require="level >= 5","features.Burrow Elocutionist"',
  // TODO requires "at least one innate spell from a gnome heritage or ancestry feat that shares a tradition with at least on of your focus spells"
  'Energized Font':
    'Type=Ancestry,Gnome Require="level >= 5","focusPoints"',
  'Gnome Weapon Innovator':
    'Type=Ancestry,Gnome ' +
    'Require="level >= 5","features.Gnome Weapon Familiarity"',
  // TODO requires "at least one primal innate spell"
  'First World Adept':'Type=Ancestry,Gnome Require="level >= 9"',
  'Vivacious Conduit':'Type=Ancestry,Gnome Require="level >= 9"',
  'Gnome Weapon Expertise':
    'Type=Ancestry,Gnome ' +
    'Require="level >= 13","features.Gnome Weapon Familiarity"',

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

  // TODO requires any Spellcasting feature
  'Adapted Cantrip':'Type=Ancestry,Human',
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
  'Alchemical Familiar':'Type=Class,Alchemist',
  'Alchemical Savant':
    'Type=Class,Alchemist Require="rank.Crafting >= 1"',
  'Far Lobber':'Type=Class,Alchemist',
  'Quick Bomber':'Type=Class,Alchemist',
  'Poison Resistance':'Type=Class,Alchemist,Druid Require="level >= 2"',
  'Revivifying Mutagen':'Type=Class,Alchemist Require="level >= 2"',
  'Smoke Bomb':'Type=Class,Alchemist Require="level >= 2"',
  'Calculated Splash':'Type=Class,Alchemist Require="level >= 4"',
  'Efficient Alchemy':'Type=Class,Alchemist Require="level >= 4"',
  'Enduring Alchemy':'Type=Class,Alchemist Require="level >= 4"',
  'Combine Elixirs':'Type=Class,Alchemist Require="level >= 6"',
  'Debilitating Bomb':'Type=Class,Alchemist Require="level >= 6"',
  'Directional Bombs':'Type=Class,Alchemist Require="level >= 6"',
  'Feral Mutagen':'Type=Class,Alchemist Require="level >= 8"',
  'Sticky Bomb':'Type=Class,Alchemist Require="level >= 8"',
  'Elastic Mutagen':'Type=Class,Alchemist Require="level >= 10"',
  'Expanded Splash':
    'Type=Class,Alchemist Require="level >= 10","features.Calculated Splash"',
  'Greater Debilitating Bomb':
    'Type=Class,Alchemist Require="level >= 10","features.Debilitating Bomb"',
  'Merciful Elixir':'Type=Class,Alchemist Require="level >= 10"',
  'Potent Poisoner':
    'Type=Class,Alchemist Require="level >= 10","features.Powerful Alchemy"',
  'Extend Elixir':'Type=Class,Alchemist Require="level >= 12"',
  'Invincible Mutagen':'Type=Class,Alchemist Require="level >= 12"',
  'Uncanny Bombs':
    'Type=Class,Alchemist Require="level >= 12","features.Far Lobber"',
  'Glib Mutagen':'Type=Class,Alchemist Require="level >= 14"',
  'Greater Merciful Elixir':
    'Type=Class,Alchemist Require="level >= 14","features.Merciful Elixir"',
  'True Debilitating Bomb':
    'Type=Class,Alchemist ' +
    'Require="level >= 14","features.Greater Debilitating Bomb"',
  'Eternal Elixir':
    'Type=Class,Alchemist Require="level >= 16","features.Extend Elixir"',
  'Exploitive Bomb':'Type=Class,Alchemist Require="level >= 16"',
  'Genius Mutagen':'Type=Class,Alchemist Require="level >= 16"',
  'Persistent Mutagen':
    'Type=Class,Alchemist Require="level >= 16","features.Extend Elixir"',
  'Improbable Elixirs':'Type=Class,Alchemist Require="level >= 18"',
  'Mindblank Mutagen':'Type=Class,Alchemist Require="level >= 18"',
  'Miracle Worker':'Type=Class,Alchemist Require="level >= 18"',
  'Perfect Debilitation':'Type=Class,Alchemist Require="level >= 18"',
  "Craft Philosopher's Stone":'Type=Class,Alchemist Require="level >= 20"',
  'Mega Bomb':
    'Type=Class,Alchemist Require="level >= 20","features.Expanded Splash"',
  'Perfect Mutagen':'Type=Class,Alchemist Require="level >= 20"',

  'Acute Vision':'Type=Class,Barbarian',
  'Moment Of Clarity':'Type=Class,Barbarian',
  'Raging Intimidation':'Type=Class,Barbarian',
  'Raging Thrower':'Type=Class,Barbarian',
  'Sudden Charge':'Type=Class,Barbarian,Fighter',
  'Acute Scent':
    'Type=Class,Barbarian ' +
    'Require="level >= 2","features.Acute Vision||features.Darkvision"',
  'Furious Finish':'Type=Class,Barbarian Require="level >= 2"',
  'No Escape':'Type=Class,Barbarian Require="level >= 2"',
  'Second Wind':'Type=Class,Barbarian Require="level >= 2"',
  'Shake It Off':'Type=Class,Barbarian Require="level >= 2"',
  'Fast Movement':'Type=Class,Barbarian Require="level >= 4"',
  'Raging Athlete':
    'Type=Class,Barbarian Require="level >= 4","rank.Athletics >= 2"',
  'Swipe':'Type=Class,Barbarian,Fighter Require="level >= 4"',
  'Wounded Rage':'Type=Class,Barbarian Require="level >= 4"',
  'Animal Skin':
    'Type=Class,Barbarian Require="level >= 6","features.Animal Instinct"',
  'Attack Of Opportunity':'Type=Class,Barbarian,Champion Require="level >= 6"',
  'Brutal Bully':
    'Type=Class,Barbarian Require="level >= 6","rank.Athletics >= 2"',
  'Cleave':'Type=Class,Barbarian Require="level >= 6"',
  "Dragon's Rage Breath":
    'Type=Class,Barbarian Require="level >= 6","features.Dragon Instinct"',
  "Giant's Stature":
    'Type=Class,Barbarian Require="level >= 6","features.Giant Instinct"',
  "Spirits' Interference":
    'Type=Class,Barbarian Require="level >= 6","features.Spirit Instinct"',
  'Animal Rage':
    'Type=Class,Barbarian Require="level >= 8","features.Animal Instinct"',
  'Furious Bully':
    'Type=Class,Barbarian Require="level >= 8","rank.Athletics >=3 "',
  'Renewed Vigor':'Type=Class,Barbarian Require="level >= 8"',
  'Share Rage':'Type=Class,Barbarian Require="level >= 8"',
  'Sudden Leap':'Type=Class,Barbarian,Fighter Require="level >= 8"',
  'Thrash':'Type=Class,Barbarian Require="level >= 8"',
  'Come And Get Me':'Type=Class,Barbarian Require="level >= 10"',
  'Furious Sprint':'Type=Class,Barbarian Require="level >= 10"',
  'Great Cleave':'Type=Class,Barbarian Require="level >= 10",features.Cleave',
  'Knockback':'Type=Class,Barbarian Require="level >= 10"',
  'Terrifying Howl':
    'Type=Class,Barbarian Require="level >= 10","features.Intimidating Glare"',
  "Dragon's Rage Wings":
    'Type=Class,Barbarian Require="level >= 12","features.Dragon Instinct"',
  'Furious Grab':'Type=Class,Barbarian Require="level >= 12"',
  "Predator's Pounce":
    'Type=Class,Barbarian Require="level >= 12","features.Animal Instinct"',
  "Spirit's Wrath":
    'Type=Class,Barbarian Require="level >= 12","features.Spirit Instinct"',
  "Titan's Stature":
    'Type=Class,Barbarian ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Giant Instinct",' +
      '"features.Giant\'s Stature"',
  'Awesome Blow':
    'Type=Class,Barbarian Require="level >= 14","features.Knockback"',
  "Giant's Lunge":
    'Type=Class,Barbarian Require="level >= 14","features.Giant Instinct"',
  'Vengeful Strike':
    'Type=Class,Barbarian Require="level >= 14","features.Vengeful Strike"',
  'Whirlwind Strike':'Type=Class,Barbarian,Fighter Require="level >= 14"',
  'Collateral Thrash':
    'Type=Class,Barbarian Require="level >= 16","features.Thrash"',
  'Dragon Transformation':
    'Type=Class,Barbarian ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Dragon Instinct",' +
     '"features.Dragon\'s Rage Wings"',
  'Reckless Abandon':'Type=Class,Barbarian Require="level >= 16"',
  'Brutal Critical':'Type=Class,Barbarian Require="level >= 18"',
  'Perfect Clarity':'Type=Class,Barbarian Require="level >= 18"',
  'Vicious Evisceration':'Type=Class,Barbarian Require="level >= 18"',
  'Contagious Rage':
    'Type=Class,Barbarian Require="level >= 20","features.Share Rage"',
  'Quaking Stomp':'Type=Class,Barbarian Require="level >= 20"',

  'Bardic Lore':'Type=Class,Bard Require="features.Enigma Muse"',
  'Lingering Composition':'Type=Class,Bard Require="features.Maestro Muse"',
  'Reach Spell':'Type=Class,Bard,Cleric,Druid,Sorcerer,Wizard',
  'Versatile Performance':'Type=Class,Bard Require="features.Polymath Muse"',
  'Cantrip Expansion':
    'Type=Class,Bard,Cleric,Sorcerer,Wizard Require="level >= 2"',
  'Esoteric Polymath':
    'Type=Class,Bard Require="level >= 2","features.Polymath Muse"',
  'Inspire Competence':
    'Type=Class,Bard Require="level >= 2","features.Maestro Muse"',
  "Loremaster's Etude":
    'Type=Class,Bard Require="level >= 2","features.Enigma Muse"',
  'Multifarious Muse (Enigma Muse)':
    'Type=Class,Bard Require="level >= 2","bardFeatures.Enigma Muse == 0"',
  'Multifarious Muse (Maestro Muse)':
    'Type=Class,Bard Require="level >= 2","bardFeatures.Maestro Muse == 0"',
  'Multifarious Muse (Polymath Muse)':
    'Type=Class,Bard Require="level >= 2","bardFeatures.Polymath Muse == 0"',
  'Inspire Defense':
    'Type=Class,Bard Require="level >= 4","features.Maestro Muse"',
  'Melodious Spell':'Type=Class,Bard Require="level >= 4"',
  'Triple Time':'Type=Class,Bard Require="level >= 4"',
  'Versatile Signature':
    'Type=Class,Bard Require="level >= 4","features.Polymath Muse"',
  'Dirge Of Doom':'Type=Class,Bard Require="level >= 6"',
  'Harmonize':'Type=Class,Bard Require="level >= 6","features.Maestro Muse"',
  'Steady Spellcasting':
    'Type=Class,Bard,Cleric,Druid,Sorcerer,Wizard Require="level >= 6"',
  'Eclectic Skill':
    'Type=Class,Bard ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Polymath Muse",' +
      '"rank.Occultism >= 3"',
  'Inspire Heroics':
    'Type=Class,Bard Require="level >= 8","features.Maestro Muse"',
  'Know-It-All':
    'Type=Class,Bard Require="level >= 8","features.Enigma Muse"',
  'House Of Imaginary Walls':'Type=Class,Bard Require="level >= 10"',
  'Quickened Casting':'Type=Class,Bard,Sorcerer,Wizard Require="level >= 10"',
  'Unusual Composition':
    'Type=Class,Bard Require="level >= 10","features.Polymath Muse"',
  'Eclectic Polymath':
    'Type=Class,Bard Require="level >= 12","features.Esoteric Polymath"',
  'Inspirational Focus':'Type=Class,Bard Require="level >= 12"',
  'Allegro':'Type=Class,Bard Require="level >= 14"',
  'Soothing Ballad':'Type=Class,Bard Require="level >= 14"',
  'True Hypercognition':
    'Type=Class,Bard Require="level >= 14","features.Enigma Muse"',
  'Effortless Concentration':
    'Type=Class,Bard,Druid,Sorcerer,Wizard Require="level >= 16"',
  'Studious Capacity':
    'Type=Class,Bard ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Enigma Muse",' +
      '"rank.Occultism >= 4"',
  'Deep Lore':'Type=Class,Bard Require="level >= 18"',
  'Eternal Composition':
    'Type=Class,Bard Require="level >= 18","features.Maestro Muse"',
  'Impossible Polymath':
    'Type=Class,Bard ' +
    'Require=' +
      '"level >= 18",' +
      '"rank.Arcana >= 1 || rank.Nature >= 1 || rank.Religion >= 1",' +
      '"features.Esoteric Polymath"',
  'Fatal Aria':'Type=Class,Bard Require="level >= 20"',
  'Perfect Encore':
    'Type=Class,Bard Require="level >= 20","features.Magnum Opus"',
  'Symphony Of The Muse':
    'Type=Class,Bard Require="level >= 20","features.Harmonize"',

  "Deity's Domain":'Type=Class,Champion',
  'Ranged Reprisal':'Type=Class,Champion Require="features.Paladin"',
  'Unimpeded Step':'Type=Class,Champion Require="features.Liberator"',
  'Weight Of Guilt':'Type=Class,Champion Require="features.Redeemer"',
  'Divine Grace':'Type=Class,Champion Require="level >= 2"',
  'Dragonslayer Oath':
    'Type=Class,Champion Require="level >= 2","features.The Tenets Of Good"',
  'Fiendsbane Oath':
    'Type=Class,Champion Require="level >= 2","features.The Tenets Of Good"',
  'Shining Oath':
    'Type=Class,Champion Require="level >= 2","features.The Tenets Of Good"',
  'Vengeful Oath':
    'Type=Class,Champion Require="level >= 2","features.Paladin"',
  'Aura Of Courage':
    'Type=Class,Champion Require="level >= 4","features.The Tenets Of Good"',
  'Divine Health':
    'Type=Class,Champion Require="level >= 4","features.The Tenets Of Good"',
  'Mercy':
    'Type=Class,Champion Require="level >= 4","spells.Lay On Hands"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 6","features.Devotion Spells","features.The Tenets Of Good"',
  'Loyal Warhorse':
    'Type=Class,Champion Require="level >= 6","features.Divine Ally (Steed)"',
  'Shield Warden':
    'Type=Class,Champion,Fighter ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Shield && features.The Tenets Of Good || features.Shield Block"',
  'Smite Evil':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Blade)",' +
      '"features.The Tenets Of Good"',
  "Advanced Deity's Domain":
    'Type=Class,Champion Require="level >= 8","features.Deity\'s Domain"',
  'Greater Mercy':'Type=Class,Champion Require="level >= 8","features.Mercy"',
  'Heal Mount':
    'Type=Class,Champion ' +
    'Require="level >= 8","features.Divine Ally (Steed)","spells.Lay On Hands"',
  'Quick Shield Block':
    'Type=Class,Champion,Fighter ' +
    'Require="level >= 8","features.Shield Block"',
  'Second Ally':
    'Type=Class,Champion Require="level >= 8","features.Divine Ally"',
  'Sense Evil':
    'Type=Class,Champion Require="level >= 8","features.The Tenets Of Good"',
  'Devoted Focus':
    'Type=Class,Champion Require="level >= 10","features.Devotion Spells"',
  'Imposing Destrier':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Divine Ally (Steed)",' +
      '"features.Loyal Warhorse"',
  'Litany Against Sloth':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Devotion Spells",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Spirit':
    'Type=Class,Champion Require="level >= 10","features.Divine Ally (Blade)"',
  'Shield Of Reckoning':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Champion\'s Reaction",' +
      '"features.Shield Warden"',
  'Affliction Mercy':
    'Type=Class,Champion Require="level >= 12","features.Mercy"',
  'Aura Of Faith':
    'Type=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  'Blade Of Justice':
    'Type=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  "Champion's Sacrifice":
    'Type=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  'Divine Wall':'Type=Class,Champion Require="level >= 12"',
  'Lasting Doubt':
    'Type=Class,Champion Require="level >= 12","features.Redeemer"',
  'Liberating Stride':
    'Type=Class,Champion Require="level >= 12","features.Liberator"',
  'Anchoring Aura':
    'Type=Class,Champion Require="level >= 14","features.Fiendsbane Oath"',
  'Aura Of Life':
    'Type=Class,Champion Require="level >= 14","features.Shining Oath"',
  'Aura Of Righteousness':
    'Type=Class,Champion Require="level >= 14","features.The Tenets Of Good"',
  // TODO is Exalt req redundant, since all Champions get it at level 11?
  'Aura Of Vengeance':
    'Type=Class,Champion ' +
    'Require="level >= 14","features.Vengeful Oath"',
  'Divine Reflexes':'Type=Class,Champion Require="level >= 14"',
  'Litany Of Righteousness':
    'Type=Class,Champion Require="level >= 14","features.The Tenets Of Good"',
  'Wyrmbane Aura':
    'Type=Class,Champion Require="level >= 14","features.Dragonslayer Oath"',
  'Auspicious Mount':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Ally (Steed)",' +
      '"features.Imposing Destrier"',
  'Instrument Of Zeal':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Ally (Blade)",' +
      '"features.The Tenets Of Good"',
  'Shield Of Grace':
    'Type=Class,Champion Require="level >= 16","features.Shield Warden"',
  'Celestial Form':
    'Type=Class,Champion Require="level >= 18","features.The Tenets Of Good"',
  'Ultimate Mercy':
    'Type=Class,Champion Require="level >= 18","features.Mercy"',
  'Celestial Mount':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Steed)",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Master':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Blade)",' +
      '"features.Radiant Blade Spirit"',
  'Shield Paragon':
    'Type=Class,Champion Require="level >= 20","features.Divine Ally (Shield)"',

  'Deadly Simplicity':
    'Type=Class,Cleric Require="deityWeaponCategory =~ \'Simple|Unarmed\'"',
  'Domain Initiate':'Type=Class,Cleric',
  'Harming Hands':'Type=Class,Cleric Require="features.Harmful Font"',
  'Healing Hands':'Type=Class,Cleric Require="features.Healing Font"',
  'Holy Castigation':'Type=Class,Cleric Require="alignment =~ \'Good\'"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':'Type=Class,Cleric Require="level >= 2"',
  'Emblazon Armament':'Type=Class,Cleric Require="level >= 2"',
  'Sap Life':'Type=Class,Cleric Require="level >= 2"',
  'Turn Undead':'Type=Class,Cleric Require="level >= 2"',
  'Versatile Font':
    'Type=Class,Cleric ' +
    'Require=' +
      '"level >= 2",' +
      '"deityFonts =~ \'Harm\' && deityFonts =~ \'Heal\'",' +
      '"features.Harmful Font || features.Healing Font"',
  'Channel Smite':
    'Type=Class,Cleric ' +
    'Require="level >= 4","features.Harmful Font || features.Healing Font"',
  'Command Undead':
    'Type=Class,Cleric ' +
    'Require="level >= 4","features.Harmful Font","alignment =~ \'Evil\'"',
  'Directed Channel':'Type=Class,Cleric Require="level >= 4"',
  'Improved Communal Healing':
    'Type=Class,Cleric Require="level >= 4","features.Communal Healing"',
  'Necrotic Infusion':
    'Type=Class,Cleric ' +
    'Require="level >= 4","features.Harmful Font","alignment =~ \'Evil\'"',
  'Cast Down':
    'Type=Class,Cleric ' +
    'Require="level >= 6","features.Harmful Font || features.Healing Font"',
  'Divine Weapon':'Type=Class,Cleric Require="level >= 6"',
  'Selective Energy':'Type=Class,Cleric Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced Domain (Chaotic)':
    'Type=Class,Cleric ' +
    'Require="level >= 8","features.Domain Initiate","deityAlignment =~ \'C\'"',
  'Advanced Domain (Evil)':
    'Type=Class,Cleric ' +
    'Require="level >= 8","features.Domain Initiate","deityAlignment =~ \'E\'"',
  'Advanced Domain (Good)':
    'Type=Class,Cleric ' +
    'Require="level >= 8","features.Domain Initiate","deityAlignment =~ \'G\'"',
  'Advanced Domain (Lawful)':
    'Type=Class,Cleric ' +
    'Require="level >= 8","features.Domain Initiate","deityAlignment =~ \'L\'"',
  'Align Armament':
    'Type=Class,Cleric Require="level >= 8","deityAlignment =~ \'C|E|G|L\'"',
  'Channeled Succor':
    'Type=Class,Cleric Require="level >= 8","features.Healing Font"',
  'Cremate Undead':'Type=Class,Cleric Require="level >= 8"',
  'Emblazon Energy':
    'Type=Class,Cleric Require="level >= 8","features.Emblazon Armament"',
  'Castigating Weapon':
    'Type=Class,Cleric Require="level >= 10","features.Holy Castigation"',
  'Heroic Recovery':
    'Type=Class,Cleric ' +
    'Require="level >= 10","features.Healing Font","alignment =~ \'Good\'"',
  'Improved Command Undead':
    'Type=Class,Cleric ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Harmful Font",' +
      '"features.Command Undead",' +
      '"alignment =~ \'Evil\'"',
  // TODO requires expert in deity's favored weapon
  'Replenishment Of War':
    'Type=Class,Cleric Require="level >= 10"',
  'Defensive Recovery':
    'Type=Class,Cleric ' +
    'Require="level >= 12","features.Harmful Font || features.Healing Font"',
  // TODO requires one or more domain spells
  'Domain Focus':
    'Type=Class,Cleric Require="level >= 12"',
  'Emblazon Antimagic':
    'Type=Class,Cleric Require="level >= 12","features.Emblazon Armament"',
  'Shared Replenishment':
    'Type=Class,Cleric Require="level >= 12","features.Replenishment Of War"',
  "Deity's Protection":
    'Type=Class,Cleric Require="level >= 14","features.Advanced Domain"',
  'Extend Armament Alignment':
    'Type=Class,Cleric Require="level >= 14","features.Align Armament"',
  'Fast Channel':
    'Type=Class,Cleric ' +
    'Require="level >= 14","features.Harmful Font || features.Healing Font"',
  'Swift Banishment':'Type=Class,Cleric Require="level >= 14"',
  'Eternal Bane':
    'Type=Class,Cleric Require="level >= 16","alignment =~ \'Evil\'"',
  'Eternal Blessing':
    'Type=Class,Cleric Require="level >= 16","alignment =~ \'Good\'"',
  'Resurrectionist':'Type=Class,Cleric Require="level >= 16"',
  'Domain Wellspring':
    'Type=Class,Cleric Require="level >= 18","features.Domain Focus"',
  'Echoing Channel':'Type=Class,Cleric Require="level >= 18"',
  'Improved Swift Banishment':
    'Type=Class,Cleric Require="level >= 18","features.Swift Banishment"',
  "Avatar's Audience":'Type=Class,Cleric Require="level >= 20"',
  'Maker Of Miracles':
    'Type=Class,Cleric Require="level >= 20","features.Miraculous Spell"',
  'Metamagic Channel':'Type=Class,Cleric Require="level >= 20"',

  'Animal Companion':
    'Type=Class,Druid,Ranger ' +
    'Require="features.Animal Order || features.Order Explorer (Animal Order) || levels.Ranger"',
  'Leshy Familiar':
    'Type=Class,Druid ' +
    'Require="features.Leaf Order || features.Order Explorer (Leaf Order)"',
  // Reach Spell as above
  'Storm Born':
    'Type=Class,Druid ' +
    'Require="features.Storm Order || features.Order Explorer (Storm Order)"',
  'Widen Spell':'Type=Class,Druid,Sorcerer,Wizard',
  'Wild Shape':
    'Type=Class,Druid ' +
    'Require="features.Wild Order || features.Order Explorer (Wild Order)"',
  'Call Of The Wild':'Type=Class,Druid Require="level >= 2"',
  'Enhanced Familiar':
    'Type=Class,Druid,Sorcerer,Wizard ' +
    'Require="level >= 2","features.Familiar || features.Leshy Familiar"',
  'Order Explorer (Animal Order)':
    'Type=Class,Druid Require="level >= 2","features.Animal Order == 0"',
  'Order Explorer (Leaf Order)':
    'Type=Class,Druid Require="level >= 2","features.Leaf Order == 0"',
  'Order Explorer (Storm Order)':
    'Type=Class,Druid Require="level >= 2","features.Storm Order == 0"',
  'Order Explorer (Wild Order)':
    'Type=Class,Druid Require="level >= 2","features.Wild Order == 0"',
  // Poison Resistance as above
  'Form Control':
    'Type=Class,Druid ' +
    'Require="level >= 4","strength >= 14","features.Wild Shape"',
  'Mature Animal Companion':
    'Type=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 4 || levels.Ranger >= 6",' +
      '"features.Animal Companion"',
  'Order Magic (Animal Order)':
    'Type=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Animal Order)"',
  'Order Magic (Leaf Order)':
    'Type=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Leaf Order)"',
  'Order Magic (Storm Order)':
    'Type=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Storm Order)"',
  'Order Magic (Wild Order)':
    'Type=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Wild Order)"',
  'Thousand Faces':
    'Type=Class,Druid Require="level >= 4","features.Wild Shape"',
  'Woodland Stride':
    'Type=Class,Druid ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Leaf Order || features.Order Explorer (Leaf Order)"',
  'Green Empathy':
    'Type=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Leaf Order || features.Order Explorer (Leaf Order)"',
  'Insect Shape':
    'Type=Class,Druid Require="level >= 6","features.Wild Shape"',
  // Steady Spellcasting as above
  'Storm Retribution':
    'Type=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Storm Order || features.Order Explorer (Storm Order)",' +
      '"spells.Tempest Surge"',
  'Ferocious Shape':
    'Type=Class,Druid Require="level >= 8","features.Wild Shape"',
  'Fey Caller':'Type=Class,Druid Require="level >= 8"',
  'Incredible Companion':
    'Type=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 8 || levels.Ranger >= 10",' +
      '"features.Mature Animal Companion"',
  'Soaring Shape':
    'Type=Class,Druid Require="level >= 8","features.Wild Shape"',
  'Wind Caller':
    'Type=Class,Druid ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Storm Order || features.Order Explorer (Storm Order)"',
  'Elemental Shape':
    'Type=Class,Druid Require="level >= 10","features.Wild Shape"',
  'Healing Transformation':'Type=Class,Druid Require="level >= 10"',
  'Overwhelming Energy':
    'Type=Class,Druid,Sorcerer,Wizard Require="level >= 10"',
  'Plant Shape':
    'Type=Class,Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Leaf Order || features.Order Explorer (Leaf Order) || features.Wild Shape"',
  'Side By Side':
    'Type=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 10 || levels.Ranger >= 12",' +
      '"features.Animal Companion"',
  'Dragon Shape':
    'Type=Class,Druid Require="level >= 12","features.Soaring Shape"',
  'Green Tongue':
    'Type=Class,Druid Require="level >= 12","features.Green Empathy"',
  'Primal Focus':'Type=Class,Druid Require="level >= 12"',
  'Primal Summons':
    'Type=Class,Druid Require="level >= 12","features.Call Of The Wild"',
  'Specialized Companion':
    'Type=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 14 || levels.Ranger >= 16",' +
      '"features.Incredible Companion"',
  'Timeless Nature':'Type=Class,Druid Require="level >= 14"',
  'Verdant Metamorphosis':
    'Type=Class,Druid ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Leaf Order || features.Order Explorer (Leaf Order)"',
  // Effortless Concentration as above
  'Impaling Briars':
    'Type=Class,Druid ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Leaf Order || features.Order Explorer (Leaf Order)"',
  'Monstrosity Shape':
    'Type=Class,Druid Require="level >= 16","features.Wild Shape"',
  'Invoke Disaster':
    'Type=Class,Druid Require="level >= 18","features.Wind Caller"',
  'Perfect Form Control':
    'Type=Class,Druid ' +
    'Require="level >= 18","features.Form Control","strength >= 18"',
  'Primal Wellspring':
    'Type=Class,Druid Require="level >= 18","features.Primal Focus"',
  "Hierophant's Power":'Type=Class,Druid Require="level >= 20"',
  'Leyline Conduit':'Type=Class,Druid Require="level >= 20"',
  'True Shapeshifter':
    'Type=Class,Druid ' +
    'Require="level >= 20","features.Dragon Shape","features.Wild Shape"',

  'Double Slice':'Type=Class,Fighter',
  'Exacting Strike':'Type=Class,Fighter',
  'Point-Blank Shot':'Type=Class,Fighter',
  'Power Attack':'Type=Class,Fighter',
  'Reactive Shield':'Type=Class,Fighter',
  'Snagging Strike':'Type=Class,Fighter',
  'Aggressive Block':'Type=Class,Fighter Require="level >= 2"',
  'Assisting Shot':'Type=Class,Fighter Require="level >= 2"',
  'Brutish Shove':'Type=Class,Fighter Require="level >= 2"',
  'Combat Grab':'Type=Class,Fighter Require="level >= 2"',
  'Dueling Parry':'Type=Class,Fighter Require="level >= 2"',
  'Intimidating Strike':'Type=Class,Fighter Require="level >= 2"',
  'Lunge':'Type=Class,Fighter Require="level >= 2"',
  'Double Shot':'Type=Class,Fighter Require="level >= 4"',
  'Dual-Handed Assault':'Type=Class,Fighter Require="level >= 4"',
  'Knockdown':
    'Type=Class,Fighter Require="level >= 4","rank.Athletics >= 1"',
  'Powerful Shove':
    'Type=Class,Fighter ' +
    'Require="level >= 4","features.Aggressive Block||features.Brutish Shove"',
  'Quick Reversal':'Type=Class,Fighter Require="level >= 4"',
  'Shielded Stride':'Type=Class,Fighter Require="level >= 4"',
  'Twin Parry':'Type=Class,Fighter,Ranger Require="level >= 4"',
  'Advanced Weapon Training':'Type=Class,Fighter Require="level >= 6"',
  'Advantageous Assault':'Type=Class,Fighter Require="level >= 6"',
  'Disarming Stance':
    'Type=Class,Fighter Require="level >= 6","rank.Athletics >= 1"',
  'Furious Focus':
    'Type=Class,Fighter Require="level >= 6","features.Power Attack"',
  "Guardian's Deflection":'Type=Class,Fighter Require="level >= 6"',
  'Reflexive Shield':'Type=Class,Fighter Require="level >= 6"',
  'Revealing Stab':'Type=Class,Fighter Require="level >= 6"',
  'Shatter Defenses':'Type=Class,Fighter Require="level >= 6"',
  'Triple Shot':
    'Type=Class,Fighter Require="level >= 6","features.Double Shot"',
  'Blind-Fight':
    'Type=Class,Fighter,Ranger,Rogue ' +
    'Require="level >= 8","rank.Perception >= 3"',
  'Dueling Riposte':
    'Type=Class,Fighter Require="level >= 8","features.Dueling Parry"',
  'Felling Strike':'Type=Class,Fighter Require="level >= 8"',
  'Incredible Aim':'Type=Class,Fighter Require="level >= 8"',
  'Mobile Shot Stance':'Type=Class,Fighter Require="level >= 8"',
  'Positioning Assault':'Type=Class,Fighter Require="level >= 8"',
  'Agile Grace':'Type=Class,Fighter Require="level >= 10"',
  'Certain Strike':'Type=Class,Fighter Require="level >= 10"',
  'Combat Reflexes':'Type=Class,Fighter Require="level >= 10"',
  'Debilitating Shot':'Type=Class,Fighter Require="level >= 10"',
  'Disarming Twist':
    'Type=Class,Fighter Require="level >= 10","rank.Athletics >= 1"',
  'Disruptive Stance':'Type=Class,Fighter Require="level >= 10"',
  'Fearsome Brute':'Type=Class,Fighter Require="level >= 10"',
  'Improved Knockdown':
    'Type=Class,Fighter Require="level >= 10",features.Knockdown',
  'Mirror Shield':'Type=Class,Fighter Require="level >= 10"',
  'Twin Riposte':
    'Type=Class,Fighter,Ranger Require="level >= 10","features.Twin Parry"',
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
    'Type=Class,Fighter,Ranger ' +
    'Require=' +
      '"levels.Fighter >= 14 || levels.Ranger >= 16",' +
      '"features.Twin Riposte"',
  'Stance Savant':
    'Type=Class,Fighter,Monk Require="level >= 14 || levels.Monk >= 12"',
  'Two-Weapon Flurry':'Type=Class,Fighter Require="level >= 14"',
  'Graceful Poise':
    'Type=Class,Fighter Require="level >= 16","features.Double Slice"',
  'Improved Reflexive Shield':
    'Type=Class,Fighter Require="level >= 16","features.Reflexive Shield"',
  'Multishot Stance':
    'Type=Class,Fighter Require="level >= 16","features.Triple Shot"',
  'Twinned Defense':
    'Type=Class,Fighter Require="level >= 16","features.Twin Parry"',
  'Impossible Volley':'Type=Class,Fighter,Ranger Require="level >= 18"',
  'Savage Critical':'Type=Class,Fighter Require="level >= 18"',
  'Boundless Reprisals':'Type=Class,Fighter Require="level >= 20"',
  'Weapon Supremacy':'Type=Class,Fighter Require="level >= 20"',

  'Crane Stance':'Type=Class,Monk"',
  'Dragon Stance':'Type=Class,Monk"',
  'Ki Rush':'Type=Class,Monk"',
  'Ki Strike':'Type=Class,Monk"',
  'Monastic Weaponry':'Type=Class,Monk"',
  'Mountain Stance':'Type=Class,Monk"',
  'Tiger Stance':'Type=Class,Monk"',
  'Wolf Stance':'Type=Class,Monk"',
  'Brawling Focus':'Type=Class,Monk Require="level >= 2"',
  'Crushing Grab':'Type=Class,Monk Require="level >= 2"',
  'Dancing Leaf':'Type=Class,Monk Require="level >= 2"',
  'Elemental Fist':'Type=Class,Monk Require="level >= 2","features.Ki Strike"',
  'Stunning Fist':
    'Type=Class,Monk Require="level >= 2","features.Flurry Of Blows"',
  'Deflect Arrow':'Type=Class,Monk Require="level >= 4"',
  'Flurry Of Maneuvers':
    'Type=Class,Monk Require="level >= 4","rank.Athletics >= 2"',
  'Flying Kick':'Type=Class,Monk Require="level >= 4"',
  'Guarded Movement':'Type=Class,Monk Require="level >= 4"',
  'Stand Still':'Type=Class,Monk Require="level >= 4"',
  'Wholeness Of Body':
    'Type=Class,Monk Require="level >= 4","features.Ki Spells"',
  'Abundant Step':
    'Type=Class,Monk ' +
    'Require="level >= 6","features.Incredible Movement","features.Ki Spells"',
  'Crane Flutter':
    'Type=Class,Monk Require="level >= 6","features.Crane Stance"',
  'Dragon Roar':
    'Type=Class,Monk Require="level >= 6","features.Dragon Stance"',
  'Ki Blast':
    'Type=Class,Monk Require="level >= 6","features.Ki Spells"',
  'Mountain Stronghold':
    'Type=Class,Monk Require="level >= 6","features.Mountain Stance"',
  'Tiger Slash':
    'Type=Class,Monk Require="level >= 6","features.Tiger Stance"',
  'Water Step':'Type=Class,Monk Require="level >= 6"',
  'Whirling Throw':'Type=Class,Monk Require="level >= 6"',
  'Wolf Drag':
    'Type=Class,Monk Require="level >= 6","features.Wolf Stance"',
  'Arrow Snatching':
    'Type=Class,Monk Require="level >= 8","features.Deflect Arrow"',
  'Ironblood Stance':'Type=Class,Monk Require="level >= 8"',
  'Mixed Maneuver':
    'Type=Class,Monk Require="level >= 8","rank.Athletics >= 3"',
  'Tangled Forest Stance':'Type=Class,Monk Require="level >= 8"',
  'Wall Run':'Type=Class,Monk Require="level >= 8"',
  'Wild Winds Initiate':
    'Type=Class,Monk Require="level >= 8","features.Ki Spells"',
  'Knockback Strike':'Type=Class,Monk Require="level >= 10"',
  'Sleeper Hold':'Type=Class,Monk Require="level >= 10"',
  'Wind Jump':
    'Type=Class,Monk Require="level >= 10","features.Ki Spells"',
  'Winding Flow':'Type=Class,Monk Require="level >= 10"',
  'Diamond Soul':'Type=Class,Monk Require="level >= 12"',
  'Disrupt Ki':'Type=Class,Monk Require="level >= 12"',
  'Improved Knockback':
    'Type=Class,Monk Require="level >= 12","rank.Athletics >= 3"',
  'Meditative Focus':
    'Type=Class,Monk Require="level >= 12","features.Ki Spells"',
  // Stance Savant as above
  'Ironblood Surge':
    'Type=Class,Monk Require="level >= 14","features.Ironblood Stance"',
  'Mountain Quake':
    'Type=Class,Monk Require="level >= 14","features.Mountain Stronghold"',
  'Tangled Forest Rake':
    'Type=Class,Monk Require="level >= 14","features.Tangled Forest Stance"',
  'Timeless Body':'Type=Class,Monk Require="level >= 14"',
  'Tongue Of Sun And Moon':'Type=Class,Monk Require="level >= 14"',
  'Wild Winds Gust':
    'Type=Class,Monk Require="level >= 14","features.Wild Winds Initiate"',
  'Enlightened Presence':'Type=Class,Monk Require="level >= 16"',
  'Master Of Many Styles':
    'Type=Class,Monk Require="level >= 16","features.Stance Savant"',
  'Quivering Palm':'Type=Class,Monk Require="level>=16","features.Ki Spells"',
  'Shattering Strike':'Type=Class,Monk Require="level >= 16"',
  'Diamond Fists':'Type=Class,Monk Require="level >= 18"',
  'Empty Body':
    'Type=Class,Monk Require="level >= 18","features.Ki Spells"',
  'Meditative Wellspring':
    'Type=Class,Monk Require="level >= 18","features.Meditative Focus"',
  'Swift River':'Type=Class,Monk Require="level >= 18"',
  'Enduring Quickness':'Type=Class,Monk Require="level >= 20"',
  // TODO requires at least two stances
  'Fuse Stance':'Type=Class,Monk Require="level >= 20"',
  'Impossible Technique':'Type=Class,Monk Require="level >= 20"',

  // Animal Companion as above
  'Crossbow Ace':'Type=Class,Ranger',
  'Hunted Shot':'Type=Class,Ranger',
  'Monster Hunter':'Type=Class,Ranger',
  'Twin Takedown':'Type=Class,Ranger',
  'Favored Terrain (%terrain)':'Type=Class,Ranger Require="level >= 2"',
  "Hunter's Aim":'Type=Class,Ranger Require="level >= 2"',
  'Monster Warden':
    'Type=Class,Ranger Require="level >= 2","features.Monster Hunter"',
  'Quick Draw':'Type=Class,Ranger,Rogue Require="level >= 2"',
  'Wild Empathy':'Type=Class,Ranger Require="level >= 2"',
  "Companion's Cry":
    'Type=Class,Ranger Require="level >= 4","features.Animal Companion"',
  'Disrupt Prey':'Type=Class,Ranger Require="level >= 4"',
  'Far Shot':'Type=Class,Ranger Require="level >= 4"',
  'Favored Enemy':'Type=Class,Ranger Require="level >= 4"',
  'Running Reload':'Type=Class,Ranger Require="level >= 4"',
  "Scout's Warning":'Type=Class,Ranger,Rogue Require="level >= 4"',
  'Snare Specialist':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 4",' +
      '"rank.Crafting >= 2",' +
      '"features.Snare Crafting"',
  // Twin Parry as above
  // Mature Animal Companion as above
  'Quick Snares':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 6",' +
      '"rank.Crafting >= 2",' +
      '"features.Snare Specialist"',
  'Skirmish Strike':'Type=Class,Ranger,Rogue Require="level >= 6"',
  'Snap Shot':'Type=Class,Ranger Require="level >= 6"',
  'Swift Tracker':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 6",' +
      '"rank.Survival >= 2",' +
      '"features.Experienced Tracker"',
  // Blind-Fight as above
  'Deadly Aim':
    'Type=Class,Ranger Require="level >= 8","features.Weapon Specialization"',
  'Hazard Finder':'Type=Class,Ranger Require="level >= 8"',
  'Powerful Snares':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Crafting >= 3",' +
      '"features.Snare Specialist"',
  'Terrain Master':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Survival >= 3",' +
      '"features.Favored Terrain"',
  "Warden's Boon":'Type=Class,Ranger Require="level >= 8"',
  'Camouflage':
    'Type=Class,Ranger Require="level >= 10","rank.Stealth >= 3"',
  // Incredible Companion as above
  'Master Monster Hunter':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 10",' +
      '"rank.Nature >= 3",' +
      '"features.Monster Hunter"',
  'Penetrating Shot':'Type=Class,Ranger Require="level >= 10"',
  // Twin Riposte as above
  "Warden's Step":
    'Type=Class,Ranger Require="level >= 10","rank.Stealth >= 3"',
  'Distracting Shot':'Type=Class,Ranger Require="level >= 12"',
  'Double Prey':'Type=Class,Ranger Require="level >= 12"',
  'Lightning Snares':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 12",' +
      '"rank.Crafting >= 3",' +
      '"features.Quick Snares",' +
      '"features.Snare Specialist"',
  'Second Sting':'Type=Class,Ranger Require="level >= 12"',
  // Side By Side as above
  'Sense The Unseen':'Type=Class,Ranger,Rogue Require="level >= 14"',
  'Shared Prey':
    'Type=Class,Ranger ' +
    'Require="level >= 14","features.Double Prey","features.Warden\'s Boon"',
  'Stealthy Companion':
    'Type=Class,Ranger ' +
    'Require="level >= 14","features.Animal Companion","features.Camouflage"',
  'Targeting Shot':
    'Type=Class,Ranger Require="level >= 14","features.Hunter\'s Aim"',
  "Warden's Guidance":'Type=Class,Ranger Require="level >= 14"',
  'Greater Distracting Shot':
    'Type=Class,Ranger Require="level >= 16","features.Distracting Shot"',
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 16",' +
      '"rank.Nature >= 4",' +
      '"features.Master Monster Hunter"',
  // Specialized Companion as above
  'Ubiquitous Snares':
    'Type=Class,Ranger Require="level >= 16","features.Snare Specialist"',
  'Impossible Flurry':'Type=Class,Ranger Require="level >= 18"',
  // Impossible Volley as above
  'Manifold Edge':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Hunter\'s Edge",' +
      '"features.Masterful Hunter"',
  'Masterful Companion':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Masterful Hunter",' +
      '"features.Animal Companion"',
  'Perfect Shot':'Type=Class,Ranger Require="level >= 18"',
  'Shadow Hunter':
    'Type=Class,Ranger Require="level >= 18","features.Camouflage"',
  'Legendary Shot':
    'Type=Class,Ranger ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Masterful Hunter",' +
      '"rank.Perception >= 4",' +
      '"features.Far Shot"',
  'To The Ends Of The Earth':
    'Type=Class,Ranger Require="level >= 20","rank.Survival >= 4"',
  'Triple Threat':
    'Type=Class,Ranger Require="level >= 20","features.Shared Prey"',
  'Ultimate Skirmisher':
    'Type=Class,Ranger Require="level >= 20","features.Wild Stride"',

  'Nimble Dodge':'Type=Class,Rogue',
  'Trap Finder':'Type=Class,Rogue',
  'Twin Feint':'Type=Class,Rogue',
  "You're Next":'Type=Class,Rogue Require="rank.Intimidation >= 1"',
  'Brutal Beating':
    'Type=Class,Rogue Require="level >= 2","features.Ruffian"',
  'Distracting Feint':
    'Type=Class,Rogue Require="level >= 2","features.Scoundrel"',
  'Minor Magic':'Type=Class,Rogue Require="level >= 2"',
  'Mobility':'Type=Class,Rogue Require="level >= 2"',
  // Quick Draw as above
  'Unbalancing Blow':
    'Type=Class,Rogue Require="level >= 2","features.Thief"',
  'Battle Assessment':'Type=Class,Rogue Require="level >= 4"',
  'Dread Striker':'Type=Class,Rogue Require="level >= 4"',
  'Magical Trickster':'Type=Class,Rogue Require="level >= 4"',
  'Poison Weapon':'Type=Class,Rogue Require="level >= 4"',
  'Reactive Pursuit':'Type=Class,Rogue Require="level >= 4"',
  'Sabotage':'Type=Class,Rogue Require="level >= 4"',
  // Scout's Warning as above
  'Gang Up':'Type=Class,Rogue Require="level >= 6"',
  'Light Step':'Type=Class,Rogue Require="level >= 6"',
  // Skirmish Strike as above
  'Twist The Knife':'Type=Class,Rogue Require="level >= 6"',
  // Blind-Fight as above
  'Delay Trap':'Type=Class,Rogue Require="level >= 8"',
  'Improved Poison Weapon':
    'Type=Class,Rogue Require="level >= 8","features.Poison Weapon"',
  'Nimble Roll':
    'Type=Class,Rogue Require="level >= 8","features.Nimble Dodge"',
  'Opportune Backstab':'Type=Class,Rogue Require="level >= 8"',
  'Sidestep':'Type=Class,Rogue Require="level >= 8"',
  'Sly Striker':
    'Type=Class,Rogue Require="level >= 8","features.Sneak Attack"',
  'Precise Debilitations':
    'Type=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Thief",' +
      '"features.Debilitating Strike"',
  'Sneak Savant':
    'Type=Class,Rogue Require="level >= 10","rank.Stealth >= 3"',
  'Tactical Debilitations':
    'Type=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Scoundrel",' +
      '"features.Debilitating Strike"',
  'Vicious Debilitations':
    'Type=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Ruffian",' +
      '"features.Debilitating Strike"',
  'Critical Debilitation':
    'Type=Class,Rogue Require="level >= 12","features.Debilitating Strike"',
  'Fantastic Leap':'Type=Class,Rogue Require="level >= 12"',
  'Felling Shot':'Type=Class,Rogue Require="level >= 12"',
  'Reactive Interference':'Type=Class,Rogue Require="level >= 12"',
  'Spring From The Shadows':'Type=Class,Rogue Require="level >= 12"',
  'Defensive Roll':'Type=Class,Rogue Require="level >= 14"',
  'Instant Opening':'Type=Class,Rogue Require="level >= 14"',
  'Leave An Opening':'Type=Class,Rogue Require="level >= 14"',
  // Sense The Unseen as above
  'Blank Slate':
    'Type=Class,Rogue Require="level >= 16","rank.Deception >= 4"',
  'Cloud Step':
    'Type=Class,Rogue Require="level >= 16","rank.Acrobatics >= 4"',
  'Cognitive Loophole':'Type=Class,Rogue Require="level >= 16"',
  'Dispelling Slice':'Type=Class,Rogue Require="level >= 16"',
  'Perfect Distraction':
    'Type=Class,Rogue Require="level >= 16","rank.Deception >= 4"',
  'Implausible Infiltration':
    'Type=Class,Rogue ' +
    'Require=' +
      '"level >= 18",' +
      '"rank.Acrobatics >= 4",' +
      '"features.Quick Squeeze"',
  'Powerful Sneak':'Type=Class,Rogue Require="level >= 18"',
  "Trickster's Ace":'Type=Class,Rogue Require="level >= 18"',
  'Hidden Paragon':
    'Type=Class,Rogue Require="level >= 20","rank.Stealth >= 4"',
  'Impossible Striker':
    'Type=Class,Rogue Require="level >= 20","features.Sly Striker"',
  'Reactive Distraction':
    'Type=Class,Rogue ' +
    'Require=' +
      '"level >= 20",' +
      '"rank.Deception >= 4",' +
      '"features.Perfect Distraction"',

  'Counterspell':'Type=Class,Sorcerer,Wizard',
  'Dangerous Sorcery':'Type=Class,Sorcerer',
  'Familiar':'Type=Class,Sorcerer,Wizard',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Type=Class,Sorcerer ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Arcane\'"',
  'Bespell Weapon':'Type=Class,Sorcerer,Wizard Require="level >= 4"',
  'Divine Evolution':
    'Type=Class,Sorcerer ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Divine\'"',
  'Occult Evolution':
    'Type=Class,Sorcerer ' +
     'Require="level >= 4","bloodlineTraditions =~ \'Occult\'"',
  'Primal Evolution':
    'Type=Class,Sorcerer ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Primal\'"',
  'Advanced Bloodline':
    'Type=Class,Sorcerer Require="level >= 6","features.Bloodline"',
  // Steady Spellcasting as above
  'Bloodline Resistance':'Type=Class,Sorcerer Require="level >= 8"',
  'Crossblooded Evolution':'Type=Class,Sorcerer Require="level >= 8"',
  'Greater Bloodline':
    'Type=Class,Sorcerer Require="level >= 10","features.Bloodline"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':
    'Type=Class,Sorcerer Require="level >= 12","features.Bloodline"',
  'Magic Sense':'Type=Class,Sorcerer,Wizard Require="level >= 12"',
  'Interweave Spell':
    'Type=Class,Sorcerer Require="level >= 14","spells.Dispel Magic"',
  'Reflect Spell':
    'Type=Class,Sorcerer,Wizard Require="level >= 14","features.Counterspell"',
  // Effortless Concentration as above
  'Greater Mental Evolution':
    'Type=Class,Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Arcane Evolution || features.Occult Evolution"',
  'Greater Vital Evolution':
    'Type=Class,Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Evolution || features.Primal Evolution"',
  'Bloodline Wellspring':
    'Type=Class,Sorcerer Require="level >= 18","features.Bloodline Focus"',
  'Greater Crossblooded Evolution':
    'Type=Class,Sorcerer ' +
    'Require="level >= 18","features.Crossblooded Evolution"',
  'Bloodline Conduit':'Type=Class,Sorcerer Require="level >= 20"',
  'Bloodline Perfection':
    'Type=Class,Sorcerer Require="level >= 20","features.Bloodline Paragon"',
  'Metamagic Mastery':'Type=Class,Sorcerer,Wizard Require="level >= 20"',

  // Wizard
  // Counterspell as above
  'Eschew Materials':'Type=Class,Wizard',
  // Familiar as above
  'Hand Of The Apprentice':'Type=Class,Wizard Require="features.Universalist"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':'Type=Class,Wizard Require="level >= 2"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':
    'Type=Class,Wizard ' +
    'Require="level >= 4","features.Arcane Bond","features.Arcane School"',
  'Silent Spell':
    'Type=Class,Wizard Require="level >= 4","features.Conceal Spell"',
  'Spell Penetration':'Type=Class,Wizard Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced School Spell':
    'Type=Class,Wizard Require="level >= 8","features.Arcane School"',
  'Bond Conservation':
    'Type=Class,Wizard Require="level >= 8","features.Arcane Bond"',
  'Universal Versatility':
    'Type=Class,Wizard ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Universalist",' +
      '"features.Hand Of The Apprentice"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Savant':
    'Type=Class,Wizard Require="level >= 10","rank.Crafting >= 2"',
  'Clever Counterspell':
    'Type=Class,Wizard ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Counterspell",' +
      '"features.Quick Recognition"',
  // Magic Sense as above
  'Bonded Focus':
    'Type=Class,Wizard Require="level >= 14","features.Arcane Bond"',
  // Reflect Spell as above
  'Superior Bond':
    'Type=Class,Wizard Require="level >= 14","features.Arcane Bond"',
  // Effortless Concentration as above
  'Spell Tinker':'Type=Class,Wizard Require="level >= 16"',
  'Infinite Possibilities':'Type=Class,Wizard Require="level >= 18"',
  'Reprepare Spell':'Type=Class,Wizard Require="level >= 18"',
  "Archwizard's Might":
    'Type=Class,Wizard ' +
    'Require="level >= 20","features.Archwizard\'s Spellcraft"',
  // Metamagic Mastery as above
  'Spell Combination':'Type=Class,Wizard Require="level >= 20"',

  // Archetype
  'Alchemist Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","intelligence >= 14"',
  'Basic Concoction':
    'Type=Archetype Require="level >= 4","features.Alchemist Dedication"',
  'Quick Alchemy':
    'Type=Archetype Require="level >= 4","features.Alchemist Dedication"',
  'Advanced Concoction':
    'Type=Archetype Require="level >= 6","features.Basic Concoction"',
  'Expert Alchemy':
    'Type=Archetype ' +
    'Require="level >= 6","features.Alchemist Dedication","rank.Crafting >= 2"',
  'Master Alchemy':
    'Type=Archetype ' +
    'Require="level >= 12","features.Expert Alchemy","rank.Crafting >= 3"',

  'Barbarian Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","strength >= 14","constitution >= 14"',
  // TODO requires "class granting no more HP/level than 10 + conmod"
  'Barbarian Resiliency':
    'Type=Archetype Require="level >= 4","features.Barbarian Dedication"',
  'Basic Fury':
    'Type=Archetype Require="level >= 4","features.Barbarian Dedication"',
  'Advanced Fury':
    'Type=Archetype Require="level >= 6","features.Basic Fury"',
  'Instinct Ability':
    'Type=Archetype Require="level >= 6","features.Barbarian Dedication"',
  "Juggernaut's Fortitude":
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Barbarian Dedication",' +
      '"rank.Fortitude >= 2"',

  'Bard Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","charisma >= 14"',
  'Basic Bard Spellcasting':
    'Type=Archetype Require="level >= 4","features.Bard Dedication"',
  "Basic Muse's Whispers":
    'Type=Archetype Require="level >= 4","features.Bard Dedication"',
  "Advanced Muse's Whispers":
    'Type=Archetype Require="level >= 4","features.Basic Muse\'s Whispers"',
  'Counter Perform':
    'Type=Archetype Require="level >= 6","features.Bard Dedication"',
  'Inspiration Performance':
    'Type=Archetype Require="level >= 8","features.Bard Dedication"',
  'Occult Breadth':
    'Type=Archetype Require="level >= 8","features.Basic Bard Spellcasting"',
  'Expert Bard Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Bard Spellcasting",' +
      '"rank.Occultism >= 3"',
  'Master Bard Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Bard Spellcasting",' +
      '"rank.Occultism >= 4"',

  'Champion Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","strength >= 14","charisma >= 14"',
  'Basic Devotion':
    'Type=Archetype Require="level >= 4","features.Champion Dedication"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Champion Resiliency':
    'Type=Archetype Require="level >= 4","features.Champion Dedication"',
  'Healing Touch':
    'Type=Archetype Require="level >= 4","features.Champion Dedication"',
  'Advanced Devotion':
    'Type=Archetype Require="level >= 6","features.Basic Devotion"',
  // Divine Ally as above
  'Diverse Armor Expert':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 14",' +
      '"rank.Unarmored Defense >= 2 || rank.Light Armor >=2 || rank.Medium Armor >=2 || rank.Heavy Armor >= 2"',

  'Cleric Dedication':
    'Type=Archetype,Dedication,Multiclass Require="level >= 2","wisdom >= 14"',
  'Basic Cleric Spellcasting':
    'Type=Archetype Require="level >= 4","features.Cleric Dedication"',
  'Basic Dogma':
    'Type=Archetype Require="level >= 4","features.Cleric Dedication"',
  'Advanced Dogma':
    'Type=Archetype Require="level >= 6","features.Basic Dogma"',
  'Divine Breadth':
    'Type=Archetype Require="level >= 8","features.Basic Cleric Spellcasting"',
  'Expert Cleric Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Cleric Spellcasting",' +
      '"rank.Religion >= 3"',
  'Master Cleric Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Cleric Spellcasting",' +
      '"rank.Religion >= 4"',

  'Druid Dedication':
    'Type=Archetype,Dedication,Multiclass Require="level >= 2","wisdom >= 14"',
  'Basic Druid Spellcasting':
    'Type=Archetype Require="level >= 4","features.Druid Dedication"',
  'Basic Wilding':
    'Type=Archetype Require="level >= 4","features.Druid Dedication"',
  'Order Spell':
    'Type=Archetype Require="level >= 4","features.Druid Dedication"',
  'Advanced Wilding':
    'Type=Archetype Require="level >= 6","features.Basic Wilding"',
  'Primal Breadth':
    'Type=Archetype Require="level >= 8","features.Basic Druid Spellcasting"',
  'Expert Druid Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Druid Spellcasting",' +
      '"rank.Nature >= 3"',
  'Master Druid Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Druid Spellcasting",' +
      '"rank.Nature >= 4"',

  'Fighter Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","strength >= 14","dexterity >= 14"',
  'Basic Maneuver':
    'Type=Archetype Require="level >= 4","features.Fighter Dedication"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Fighter Resiliency':
    'Type=Archetype Require="level >= 4","features.Fighter Dedication"',
  'Opportunist':
    'Type=Archetype Require="level >= 4","features.Fighter Dedication"',
  'Advanced Maneuver':
    'Type=Archetype Require="level >= 6","features.Basic Maneuver"',
  'Diverse Weapon Expert':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      // TODO or rank.any weapon >= 3
      '"rank.Unarmed Attacks >= 3"',

  'Monk Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","strength >= 14","dexterity >= 14"',
  'Basic Kata':'Type=Archetype Require="level >= 4","feats.Monk Dedication"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Monk Resiliency':
    'Type=Archetype Require="level >= 4","feats.Monk Dedication"',
  'Advanced Kata':'Type=Archetype Require="level >= 6","feats.Basic Kata"',
  'Monk Moves':'Type=Archetype Require="level >= 8","feats.Monk Dedication"',
  "Monk's Flurry":
    'Type=Archetype Require="level >= 10","feats.Monk Dedication"',
  "Perfection's Path":
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"rank.Fortitude >= 3 || rank.Reflex >= 3 || rank.Will >= 3"',

  'Ranger Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","dexterity >= 14"',
  "Basic Hunter's Trick":
    'Type=Archetype Require="level >= 4","features.Ranger Dedication"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Ranger Resiliency':
    'Type=Archetype Require="level >= 4","features.Ranger Dedication"',
  "Advanced Hunter's Trick":
    'Type=Archetype Require="level >= 6","features.Basic Hunter\'s Trick"',
  'Master Spotter':
    'Type=Archetype ' +
    'Require="level >= 12","features.Ranger Dedication","rank.Perception >= 3"',

  'Rogue Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","dexterity >= 14"',
  'Basic Trickery':
    'Type=Archetype Require="level >= 4","features.Rogue Dedication"',
  'Sneak Attacker':
    'Type=Archetype Require="level >= 4","features.Rogue Dedication"',
  'Advanced Trickery':
    'Type=Archetype Require="level >= 6","features.Basic Trickery"',
  // TODO trained in one skill, expert in one skill
  'Skill Mastery':
    'Type=Archetype Require="level >= 8","features.Rogue Dedication"',
  'Uncanny Dodge':
    'Type=Archetype Require="level >= 10","features.Rogue Dedication"',
  'Evasiveness':
    'Type=Archetype ' +
    'Require="level >= 12","features.Rogue Dedication","rank.Reflex >= 2"',

  'Sorcerer Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","charisma >= 14"',
  'Basic Sorcerer Spellcasting':
    'Type=Archetype Require="level >= 4","features.Sorcerer Dedication"',
  'Basic Blood Potency':
    'Type=Archetype Require="level >= 4","features.Sorcerer Dedication"',
  'Basic Bloodline Spell':
    'Type=Archetype Require="level >= 4","features.Sorcerer Dedication"',
  'Advanced Blood Potency':
    'Type=Archetype Require="level >= 6","features.Basic Blood Potency"',
  'Bloodline Breadth':
    'Type=Archetype ' +
    'Require="level >= 8","features.Basic Sorcerer Spellcasting"',
  'Expert Sorcerer Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Sorcerer Spellcasting",' +
      '"rank.Arcana >= 3 || rank.Nature >= 3 || rank.Occultism >= 3 || rank.Religion >= 3"',
  'Master Sorcerer Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Master Sorcerer Spellcasting",' +
      '"rank.Arcana >= 4 || rank.Nature >= 4 || rank.Occultism >= 4 || rank.Religion >= 4"',

  'Wizard Dedication':
    'Type=Archetype,Dedication,Multiclass ' +
    'Require="level >= 2","intelligence >= 14"',
  'Arcane School Spell':
    'Type=Archetype Require="level >= 4","features.Wizard Dedication"',
  'Basic Arcana':
    'Type=Archetype Require="level >= 4","features.Wizard Dedication"',
  'Basic Wizard Spellcasting':
    'Type=Archetype Require="level >= 4","features.Wizard Dedication"',
  'Advanced Arcana':
    'Type=Archetype Require="level >= 6","features.Basic Arcana"',
  'Arcane Breadth':
    'Type=Archetype Require="level >= 8","features.Basic Wizard Spellcasting"',
  'Expert Wizard Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Wizard Spellcasting",' +
      '"rank.Arcana >= 3"',
  'Master Wizard Spellcasting':
    'Type=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Basic Wizard Spellcasting",' +
      '"rank.Arcana >= 4"',

  // General
  'Adopted Ancestry':'Type=General',
  'Armor Proficiency':'Type=General',
  'Breath Control':'Type=General',
  'Canny Acumen (Fortitude)':'Type=General',
  'Canny Acumen (Perception)':'Type=General',
  'Canny Acumen (Reflex)':'Type=General',
  'Canny Acumen (Will)':'Type=General',
  'Diehard':'Type=General',
  'Fast Recovery':'Type=General Require="constitution >= 14"',
  'Feather Step':'Type=General Require="dexterity >= 14"',
  'Fleet':'Type=General',
  'Incredible Initiative':'Type=General',
  'Ride':'Type=General',
  'Shield Block':'Type=General',
  'Toughness':'Type=General',
  'Weapon Proficiency (Martial Weapons)':'Type=General',
  'Weapon Proficiency (Simple Weapons)':'Type=General',
  'Weapon Proficiency (%weapon)':'Type=General',
  'Ancestral Paragon':'Type=General Require="level >= 3"',
  'Untrained Improvisation':'Type=General Require="level >= 3"',
  'Expeditious Search':
    'Type=General Require="level >= 7","perception >= 2"',
  'Incredible Investiture':
    'Type=General Require="level >= 11","charisma >= 16"',

  // Skill
  'Assurance (%skill)':'Type=Skill Require="rank.%skill >= 1"',
  'Dubious Knowledge':
    'Type=Skill Require="rank.Recall Knowledge >= 1"',
  'Quick Identification':
    'Type=Skill ' +
    'Require="rank.Arcana >= 1 || rank.Nature >= 1 || rank.Occultism >= 1 || rank.Religion >= 1"',
  'Recognize Spell':
    'Type=Skill ' +
    'Require="rank.Arcana >= 1 || rank.Nature >= 1 || rank.Occultism >= 1 || rank.Religion >= 1"',
  'Skill Training (%skill)':'Type=Skill Require="intelligence >= 12"',
  'Trick Magic Item':
    'Type=Skill ' +
    'Require="rank.Arcana >= 1 || rank.Nature >= 1 || rank.Occultism >= 1 || rank.Religion >= 1"',
  'Automatic Knowledge (%skill)':
    'Type=Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.%skill >= 2",' +
      '"features.Assurance (%skill)"',
  'Magical Shorthand':
    'Type=Skill ' +
    'Require="level >= 2","rank.Arcana >= 2 || rank.Nature >= 2 || rank.Occultism >= 2 || rank.Religion >= 2"',
  'Quick Recognition':
    'Type=Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"rank.Arcana >= 3 || rank.Nature >= 3 || rank.Occultism >= 3 || rank.Religion >= 3",' +
      '"features.Recognize Spell"',

  'Cat Fall':'Type=Skill Require="rank.Acrobatics >= 1"',
  'Quick Squeeze':'Type=Skill Require="rank.Acrobatics >= 1"',
  'Steady Balance':'Type=Skill Require="rank.Acrobatics >= 1"',
  'Nimble Crawl':
    'Type=Skill Require="level >= 2","rank.Acrobatics >= 2"',
  'Kip Up':'Type=Skill Require="level >= 7","rank.Acrobatics >= 3"',
  'Arcane Sense':'Type=Skill Require="rank.Arcana >= 1"',
  'Unified Theory':
    'Type=Skill Require="level >= 15","rank.Acrobatics >= 4"',
  'Combat Climber':'Type=Skill Require="rank.Athletics >= 1"',
  'Hefty Hauler':'Type=Skill Require="rank.Athletics >= 1"',
  'Quick Jump':'Type=Skill Require="rank.Athletics >= 1"',
  'Titan Wrestler':'Type=Skill Require="rank.Athletics >= 1"',
  'Underwater Marauder':'Type=Skill Require="rank.Athletics >= 1"',
  'Powerful Leap':
    'Type=Skill Require="level >= 2","rank.Athletics >= 2"',
  'Rapid Mantel':
    'Type=Skill Require="level >= 2","rank.Athletics >= 2"',
  'Quick Climb':
    'Type=Skill Require="level >= 7","rank.Athletics >= 3"',
  'Quick Swim':
    'Type=Skill Require="level >= 7","rank.Athletics >= 3"',
  'Wall Jump':
    'Type=Skill Require="level >= 7","rank.Athletics >= 3"',
  'Cloud Jump':
    'Type=Skill Require="level >= 15","rank.Athletics >= 4"',
  'Alchemical Crafting':'Type=Skill Require="rank.Crafting >= 1"',
  'Quick Repair':'Type=Skill Require="rank.Crafting >= 1"',
  'Snare Crafting':'Type=Skill Require="rank.Crafting >= 1"',
  'Specialty Crafting':'Type=Skill Require="rank.Crafting >= 1"',
  'Magical Crafting':
    'Type=Skill Require="level >= 2","rank.Crafting >= 2"',
  'Impeccable Crafting':
    'Type=Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"rank.Crafting >= 3",' +
      '"features.Specialty Crafting"',
  'Inventor':'Type=Skill Require="level >= 7","rank.Crafting >= 3"',
  'Craft Anything':
    'Type=Skill Require="level >= 15","rank.Crafting >= 4"',
  'Charming Liar':'Type=Skill Require="rank.Deception >= 1"',
  'Lengthy Diversion':'Type=Skill Require="rank.Deception >= 1"',
  'Lie To Me':'Type=Skill Require="rank.Deception >= 1"',
  'Confabulator':
    'Type=Skill Require="level >= 2","rank.Deception >= 2"',
  'Quick Disguise':
    'Type=Skill Require="level >= 2","rank.Deception >= 2"',
  'Slippery Secrets':
    'Type=Skill Require="level >= 7","rank.Deception >= 3"',
  'Bargain Hunter':'Type=Skill Require="rank.Diplomacy >= 1"',
  'Group Impression':'Type=Skill Require="rank.Diplomacy >= 1"',
  'Hobnobber':'Type=Skill Require="rank.Diplomacy >= 1"',
  'Glad-Hand':
    'Type=Skill Require="level >= 2","rank.Diplomacy >= 2"',
  'Shameless Request':
    'Type=Skill Require="level >= 7","rank.Diplomacy >= 3"',
  'Legendary Negotiation':
    'Type=Skill Require="level >= 15","rank.Diplomacy >= 4"',
  'Group Coercion':'Type=Skill Require="rank.Intimidation >= 1"',
  'Intimidating Glare':'Type=Skill Require="rank.Intimidation >= 1"',
  'Quick Coercion':'Type=Skill Require="rank.Intimidation >= 1"',
  'Intimidating Prowess':
    'Type=Skill ' +
    'Require="level >= 2","strength >= 16","rank.Intimidation >= 2"',
  'Lasting Coercion':
    'Type=Skill Require="level >= 2","rank.Intimidation >= 2"',
  'Battle Cry':
    'Type=Skill Require="level >= 7","rank.Intimidation >= 3"',
  'Terrified Retreat':
    'Type=Skill Require="level >= 7","rank.Intimidation >= 3"',
  'Scare To Death':
    'Type=Skill Require="level >= 15","rank.Intimidation >= 4"',
  'Additional Lore (%lore)':'Type=Skill Require="rank.Lore >= 1"',
  'Experienced Professional':'Type=Skill Require="rank.Lore >= 1"',
  'Unmistakable Lore':
    'Type=Skill Require="level >= 2","rank.Lore >= 2"',
  'Legendary Professional':
    'Type=Skill Require="level >= 15","rank.Lore >= 4"',
  'Battle Medicine':'Type=Skill Require="rank.Medicine >= 1"',
  'Continual Recovery':
    'Type=Skill Require="level >= 2","rank.Medicine >= 2"',
  'Robust Recovery':
    'Type=Skill Require="level >= 2","rank.Medicine >= 2"',
  'Ward Medic':
    'Type=Skill Require="level >= 2","rank.Medicine >= 2"',
  'Legendary Medic':
    'Type=Skill Require="level >= 15","rank.Medicine >= 4"',
  'Natural Medicine':'Type=Skill Require="rank.Nature >= 1"',
  'Train Animal':'Type=Skill Require="rank.Nature >= 1"',
  'Bonded Animal':
    'Type=Skill Require="level >= 2","rank.Nature >= 2"',
  'Oddity Identification':'Type=Skill Require="rank.Occultism >= 1"',
  'Bizarre Magic':
    'Type=Skill Require="level >= 7","rank.Occultism >= 3"',
  'Fascinating Performance':
    'Type=Skill Require="rank.Performance >= 1"',
  'Impressive Performance':
    'Type=Skill Require="rank.Performance >= 1"',
  'Virtuosic Performer':'Type=Skill Require="rank.Performance >= 1"',
  'Legendary Performer':
    'Type=Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Performance >= 4",' +
      '"features.Virtuosic Performer"',
  'Student Of The Canon':'Type=Skill Require="rank.Religion >= 1"',
  'Divine Guidance':
    'Type=Skill Require="level >= 15","rank.Religion >= 4"',
  'Courtly Graces':'Type=Skill Require="rank.Society >= 1"',
  'Multilingual':'Type=Skill Require="rank.Society >= 1"',
  'Read Lips':'Type=Skill Require="rank.Society >= 1"',
  'Sign Language':'Type=Skill Require="rank.Society >= 1"',
  'Streetwise':'Type=Skill Require="rank.Society >= 1"',
  'Connections':
    'Type=Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Society >= 2",' +
      '"features.Courtly Graces"',
  'Legendary Codebreaker':
    'Type=Skill Require="level >= 15","rank.Society >= 4"',
  'Legendary Linguist':
    'Type=Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Society >= 4",' +
      '"features.Multilingual"',
  'Experienced Smuggler':'Type=Skill Require="rank.Stealth >= 1"',
  'Terrain Stalker':'Type=Skill Require="rank.Stealth >= 1"',
  'Quiet Allies':
    'Type=Skill Require="level >= 2","rank.Stealth >= 2"',
  'Foil Senses':
    'Type=Skill Require="level >= 7","rank.Stealth >= 3"',
  'Swift Sneak':
    'Type=Skill Require="level >= 7","rank.Stealth >= 3"',
  'Legendary Sneak':
    'Type=Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Stealth >= 4",' +
      '"features.Swift Sneak"',
  'Experienced Tracker':'Type=Skill Require="rank.Survival >= 1"',
  'Forager':'Type=Skill Require="rank.Survival >= 1"',
  'Survey Wildlife':'Type=Skill Require="rank.Survival >= 1"',
  'Terrain Expertise':'Type=Skill Require="rank.Survival >= 1"',
  'Planar Survival':
    'Type=Skill Require="level >= 7","rank.Survival >= 3"',
  'Legendary Survivalist':
    'Type=Skill Require="level >= 15","rank.Survival >= 4"',
  'Pickpocket':'Type=Skill Require="rank.Thievery >= 1"',
  'Subtle Theft':'Type=Skill Require="rank.Thievery >= 1"',
  'Wary Disarmament':
    'Type=Skill Require="level >= 2","rank.Thievery >= 2"',
  'Quick Unlock':
    'Type=Skill Require="level >= 7","rank.Thievery >= 3"',
  'Legendary Thief':
    'Type=Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Thievery >= 4",' +
      '"features.Pickpocket"'

};
Pathfinder2E.FEATURES = {

  // Ancestry
  'Ancestry Feats':'Section=feature Note="%V selections"',

  'Ancient-Blooded Dwarf':
    'Section=feature Note="Has Call On Ancient Blood feature"',
  'Arctic Elf':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1}/Treats environmental cold as 1 step less extreme"',
  'Call On Ancient Blood':
    'Section=save ' +
    'Note="May use a Reaction upon save vs. magic to gain +1 vs. magic until the end of turn"',
  'Cavern Elf':'Section=feature Note="Has Darkvision feature"',
  'Chameleon Gnome':
    'Section=feature,skill ' +
    'Note=' +
      '"May use a 1 hr process to change skin and hair colors",' +
      '"May use 1 action to adjust coloration, gaining +2 Stealth"',
  'Charhide Goblin':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1}/DC 10 to recover from fire damage; DC 5 with help"',
  'Darkvision':
    'Section=feature Note="Has normal b/w vision in darkness and dim light"',
  'Death Warden Dwarf':
    'Section=save ' +
    'Note="Successful saves vs. necromancy effects are critical successes"',
  'Fey-Touched Gnome':
    'Section=magic ' +
    'Note="May cast chosen cantrip at will; may spend 10 min to replace chosen cantrip 1/day"',
  'Forge Dwarf':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1}/Treats environmental heat as 1 step less extreme"',
  'Gutsy Halfling':
    'Section=save Note="Successful saves vs. emotion are critical successes"',
  'Half-Elf':'Section=feature Note="Has Low-Light Vision feature"',
  'Half-Orc':'Section=feature Note="Has Low-Light Vision feature"',
  'Hillock Halfling':
    'Section=combat Note="Regains +%{level} Hit Points from rest or treatment"',
  'Irongut Goblin':
    'Section=feature,save ' +
    'Note=' +
      '"May safely eat spoiled food and when sickened",' +
      '"+2 vs. afflictions and sickened from ingestion; successes on saves are critical successes"',
  'Low-Light Vision':'Section=feature Note="Has normal vision in dim light"',
  'Keen Eyes':
    'Section=combat,skill ' +
    'Note=' +
      '"DC 3/9 to target a concealed/hidden foe",' +
      '"R30\' +2 Seek to find hidden creatures"',
  'Nomadic Halfling':'Section=skill Note="+%V Language Count"',
  // TODO Add jaws to weapon list? finesse, unarmed, brawling
  'Razortooth Goblin':'Section=combat Note="Jaw attack inflicts 1d6P HP"',
  'Rock Dwarf':
    'Section=combat ' +
    'Note="+2 DC vs. Shove, Trip, and magical knock prone/Suffers half any forced move distance of 10\' or more"',
  'Seer Elf':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Detect Magic</i> cantrip at will",' +
      '"+1 to Identify Magic and Decipher Writing of a magical nature"',
  'Sensate Gnome':
    'Section=skill Note="R30\' +2 Perception to locate a creature by smell"',
  'Skilled Heritage Human':'Section=skill Note="Skill %V (Choose 1 from any)"',
  'Slow':'Section=ability Note="-5 Speed"',
  'Snow Goblin':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1}/Treats environmental cold as 1 step less extreme"',
  'Strong-Blooded Dwarf':
    'Section=save ' +
    'Note=' +
      '"Has poison resistance %{level//2>?1}/Successful saves vs. poison reduce stage by 2 (virulent 1); critical successes by 3 (virulent 2)"',
  'Twilight Halfling':'Section=feature Note="Has Low-Light Vision feature"',
  'Umbral Gnome':'Section=feature Note="Has Darkvision feature"',
  'Unbreakable Goblin':
    'Section=combat,save ' +
    'Note="+4 Hit Points","Suffers half distance falling damage"',
  'Versatile Heritage Human':'Section=feature Note="+1 General Feat"',
  'Wellspring Gnome':'Section=magic Note="May cast chosen cantrip at will"',
  'Whisper Elf':
    'Section=skill ' +
    'Note="May attempt a R60\' Seek using hearing; +2 within 30\'"',
  'Wildwood Halfling':
    'Section=ability Note="May move normally over foliage difficult terrain"',
  'Woodland Elf':
    'Section=combat,skill ' +
    'Note=' +
      '"May always Take Cover within forest terrain",' +
      '"May Climb in foliage at %{speed//2}\'; critical success %{speed}\'"',

  // Ancestry feats
  'Dwarven Lore':
    'Section=skill Note="Skill Trained (Crafting; Religion; Dwarven Lore)"',
  'Dwarven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Battle Axe; Pick; Warhammer)",' +
      // TODO implement
      '"Has access to uncommon dwarf weapons/Treats dwarf weapons as one category simpler"',
  'Rock Runner':
    'Section=ability,skill ' +
    'Note=' +
      '"May move normally over stone and earth difficult terrain",' +
      '"Does not suffer flat-footed when using Acrobatics to Balance on stone and earth; successes to do so are critical successes"',
  'Stonecunning':
    'Section=skill ' +
    'Note="+2 Perception (unusual stonework)/Gains an automatic -2 check to note unusual stonework"',
  'Unburdened Iron':
    'Section=ability,ability ' +
    'Note=' +
      '"Suffers no Speed penalty from armor",' +
      '"Reduces non-armor Speed penalties by 5\'"',
  'Vengeful Hatred':
    'Section=combat ' +
    'Note="+1 per die weapon damage vs. ancestral foes and for 1 min on any foe that inflicts a critical success on attack"',
  'Boulder Roll':
    'Section=combat ' +
    'Note="May Step into a foe\'s square to force a 5\' move (Fort vs. Athletics critical success neg; normal success neg but inflicts %{level+strengthModifier}B HP)"',
  'Dwarven Weapon Cunning':
    'Section=combat ' +
    'Note="Critical hits with a battle axe, pick, warhammer, or dwarf weapon inflict its critical specialization effect"',
  "Mountain's Stoutness":
    'Section=combat,combat ' +
    'Note=' +
      '"+%{level} Hit Points",' +
      '"-%{1+(features.Toughness||0)*2} dying recovery DC"',
  'Stonewalker':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Meld Into Stone</i> 1/day",' +
      '"May find unusual stonework that requires legendary Perception"',
  'Dwarven Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater rank
    'Note="Attack Expert (Battle Axe; Pick; Warhammer; Dwarf Weapons)"',

  'Ancestral Longevity':
    'Section=skill ' +
    'Note="May gain Trained proficiency in choice of skill during daily preparations"',
  'Elven Lore':
    'Section=skill Note="Skill Trained (Arcana; Nature; Elven Lore)"',
  'Elven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow)",' +
      // TODO implement
      '"Has access to uncommon elf weapons/Treats elf weapons as one category simpler"',
  'Forlorn':
    'Section=save ' +
    'Note="+1 vs. emotion effects; successes are critical successes"',
  'Nimble Elf':'Section=ability Note="+5 Speed"',
  'Otherworldly Magic':
    'Section=magic Note="May cast chosen cantrip at will"',
  'Unwavering Mien':
    'Section=save ' +
    'Note="May reduce duration of mental effects by 1 rd/+1 degree of success vs. sleep effects"',
  'Ageless Patience':
    'Section=skill ' +
    'Note="May spend double the time normally required on a check to gain a +2 bonus and suffer a critical failure only on a roll of 10 lower than the DC"',
  'Elven Weapon Elegance':
    'Section=combat ' +
    'Note="Critical hits with a longbow, composite longbow, longsword, rapier, shortbow, composite shortbow, or elf weapon inflict its critical specialization effect"',
  'Elf Step':'Section=combat Note="May use 1 action to take two 5\' Steps"',
  'Expert Longevity':
    'Section=skill ' +
    'Note="Ancestral Longevity also gives expert level in a chosen trained skill; upon expiration, may replace an existing skill increase with one chosen"',
  'Universal Longevity':
    'Section=skill ' +
    'Note="May replace Ancestral Longevity and Expert Longevity skills 1/day"',
  'Elven Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater
    'Note="Attack Expert (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow; Elf Weapons)"',

  'Animal Accomplice':'Section=feature Note="Has Familiar feature"',
  'Burrow Elocutionist':
    'Section=skill Note="May speak with burrowing animals"',
  'Fey Fellowship':
    'Section=save,skill ' +
    'Note="+2 vs. fey","+2 Perception (fey)/May attempt an immediate Diplomacy - 5 to Make an Impression with fey and retry after 1 min conversation"',
  'First World Magic':
    'Section=magic Note="May cast chosen primal cantrip at will"',
  'Gnome Obsession':
    'Section=skill ' +
    'Note=' +
      '"Skill %V (Choose 1 from any Lore; %{background} Lore skill)"',
  'Gnome Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Glaive; Kukri)",' +
      // TODO implement
      '"Has access to uncommon gnome weapons/Treats gnome weapons as one category simpler"',
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
  'Energized Font':'Section=magic Note="May regain 1 Focus Point 1/day"',
  'Gnome Weapon Innovator':
    'Section=combat ' +
    'Note="Critical hits with a glaive, kukri, or gnome weapon inflict its critical specialization effect"',
  'First World Adept':
    'Section=magic ' +
     'Note="May cast <i>Faerie Fire</i> and <i>Invisibility</i> as level 2 spells 1/day"',
  'Vivacious Conduit':
    'Section=combat ' +
    'Note="10 min rest restores %{constitutionModifier*(level/2)//1} Hit Points"',
  'Gnome Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater
    'Note="Attack Expert (Glaive; Kukri; Gnome Weapons)"',

  'Burn It!':
    'Section=combat,magic ' +
    'Note=' +
      '"+1 HP persistent fire damage/+1/4 item level fire damage from alchemical items",' +
      '"Fire spells inflict additional damage equal to half the spell level"',
  'City Scavenger':
    'Section=skill ' +
    'Note="+%{1+($\'features.Irongut Goblin\'?1:0)} Subsist checks/May make +%{1+($\'features.Irongut Goblin\'?1:0)} Society or Survival check to Earn Income while using Subsist in a settlement"',
  'Goblin Lore':
    'Section=skill Note="Skill Trained (Nature; Stealth; Goblin Lore)"',
  'Goblin Scuttle':
    'Section=combat ' +
    'Note="May use a Reaction to take a Step when an ally moves to an adjacent position"',
  'Goblin Song':
    'Section=skill ' +
    'Note="R30\' May use Performance vs. target Will DC; success inflicts -1 Perception and Will for 1 rd, critical success for 1 min"',
  'Goblin Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Dogslicer; Horsechopper)",' +
      // TODO implement
      '"Has access to uncommon goblin weapons/Treats goblin weapons as one category simpler"',
  'Junk Tinker':
    'Section=skill Note="May use Crafting on junk to create level 0 items"',
  'Rough Rider':
    'Section=feature,skill ' +
    'Note=' +
      '"Has Ride feature",' +
      '"+1 Nature (Command an Animal with a goblin dog or wolf mount)"',
  'Very Sneaky':
    'Section=skill ' +
    'Note="+5\' Sneak/May Sneak between cover"',
  'Goblin Weapon Frenzy':
    'Section=combat ' +
    'Note="Critical hits with a goblin weapon inflict its critical specialization effect"',
  'Cave Climber':'Section=ability Note="10\' climb Speed"',
  'Skittering Scuttle':
    'Section=combat Note="May use Goblin Scuttle to Stride %{speed//2}\'"',
  'Goblin Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater
    'Note="Attack Expert (Dogslicer; Horsechopper; Goblin Weapons)"',
  'Very, Very Sneaky':
    'Section=combat Note="May Sneak at full speed and without cover"',

  'Distracting Shadows':
    'Section=skill Note="May use larger creatures as cover for Hide and Sneak"',
  'Halfling Lore':
    'Section=skill Note="Skill Trained (Acrobatics; Stealth; Halfling Lore)"',
  'Halfling Luck':
    'Section=feature ' +
    'Note="May reroll a skill check or save as a free action 1/day"',
  'Halfling Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Sling; Halfling Sling Staff; Shortsword)",' +
      // TODO implement
      '"Has access to uncommon halfling weapons/Treats halfling weapons as one category simpler"',
  'Sure Feet':
    'Section=skill ' +
    'Note="Successes on Acrobatics to Balance and Athletics to Climb are critical successes/Does not suffer flat-footed during Balance or Climb"',
  'Titan Slinger':
    'Section=combat ' +
    'Note="+1 damage die step on slings vs. Large and larger foes"',
  'Unfettered Halfling':
    'Section=combat ' +
    'Note="Successes to Escape and vs. grabbed or restrained are critical successes/Foe Grapple fails are critical fails/Foe Grab requires a successful Athletics check"',
  'Watchful Halfling':
    'Section=combat,skill ' +
    'Note=' +
      '"May use Aid to help another overcome enchantment",' +
      '"+2 Perception (sense enchantment)/Gains an automatic -2 check to note enchantment"',
  'Cultural Adaptability':
    'Section=feature Note="+1 Ancestry feat/Has Adopted Ancestry feature"',
  'Halfling Weapon Trickster':
    'Section=combat ' +
    'Note="Critical hits with a shortsword, sling, or halfling weapon weapon inflict its critical specialization effect"',
  'Guiding Luck':
    'Section=feature ' +
    'Note="May reroll a failed Perception check or attack roll 1/day"',
  'Irrepressible':
    'Section=save ' +
    'Note=' +
      '"Successful saves vs. emotion are critical successes%{$\'features.Gutsy Halfling\'?\', and critical failures are normal failures\':\'\'}"',
  'Ceaseless Shadows':
    'Section=combat ' +
    'Note="May use Hide and Sneak without cover and gain additional cover from creatures"',
  'Halfling Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater
    'Note="Attack Expert (Sling; Halfling Sling; Shortsword; Halfling Weapons)"',

  'Adapted Cantrip':
    'Section=magic Note="Knows a cantrip from a different tradition"',
  'Cooperative Nature':'Section=skill Note="+4 Aid checks"',
  'General Training':
    'Section=feature Note="+%{$\'feats.General Training\'} General Feat"',
  'Haughty Obstinacy':
    'Section=save ' +
    'Note="Successful saves vs. mental control are critical successes/Foe Intimidation (Coerce) fails are critical fails"',
  'Natural Ambition':'Section=feature Note="+1 Class Feat"',
  'Natural Skill':'Section=skill Note="Skill Trained (Choose 2 from any)"',
  // TODO how does the player choose? there's nothing in the menu that allows it
  'Unconventional Weaponry':
    'Section=combat ' +
    // TODO implement
    'Note="Attack Trained (Choose 1 from any)/Treats chosen weapon as one category simpler"',
  'Adaptive Adept':
    'Section=magic ' +
    'Note="Knows a cantrip or level 1 spell from a different tradition"',
  'Clever Improviser':
    'Section=feature,skill ' +
    'Note=' +
      '"Has Untrained Improvisation feature",' +
      '"May use any skill untrained"',
  'Cooperative Soul':
    'Section=skill ' +
    'Note="Failures and critical failures when using Aid with expert skills are successes"',
  'Incredible Improvisation':
    'Section=combat ' +
    'Note="May add +4 to an untrained skill check as a free action 1/day"',
  'Multitalented':'Section=combat Note="+1 Class Feat (multiclass dedication)"',
  'Unconventional Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater
    'Note="Attack Expert (Choose 1 from any)"',

  'Elf Atavism':'Section=feature Note="Has an elven heritage"',
  'Inspire Imitation':
    'Section=skill ' +
    'Note="After a critical success using a skill, may immediately Aid an ally on the same skill"',
  'Supernatural Charm':
    'Section=magic Note="May cast 1st level <i>Charm</i> 1/day"',
  'Monstrous Peacemaker':
    'Section=skill ' +
    'Note="+1 Diplomacy and Perception to Sense Motive with creatures marginalized in human society"',
  'Orc Ferocity':
    'Section=combat ' +
    'Note="May use a Reaction to retain 1 Hit Point when brought to 0 Hit Points 1/%V"',
  'Orc Sight':'Section=feature Note="Has Darkvision feature"',
  'Orc Superstition':
    'Section=save Note="May use a Reaction to gain +1 vs. magic"',
  'Orc Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Falchion; Greataxe)",' +
      '"Has access to uncommon orc weapons/Treats orc weapons as one category simpler"',
  'Orc Weapon Carnage':
    'Section=combat ' +
    'Note="Critical hits with a falchion, greataxe, or orc weapon inflict its critical specialization effect"',
  'Victorious Vigor':
    'Section=combat ' +
    'Note="May use a Reaction to gain %{constitutionModifier} temporary Hit Points for 1 rd when foe drops"',
  'Pervasive Superstition':'Section=save Note="+1 vs. magic"',
  'Incredible Ferocity':'Section=combat Note="Increased Orc Ferocity effects"',
  'Orc Weapon Expertise':
    'Section=combat ' +
     // TODO only if another feature grants expert or greater
    'Note="Attack Expert (Falchion; Greataxe; Orc Weapons)"',

  // Class Features and Feats

  'Ability Boosts':'Section=ability Note="Ability Boost (Choose %V from any)"',
  'General Feats':'Section=feature Note="%V selections"',
  'Skill Feats':'Section=feature Note="%V selections"',
  'Skill Increases':'Section=skill Note="Skill Increase (Choose %V from any)"',

  // Alchemist
  'Advanced Alchemy':
    'Section=skill ' +
    'Note="May use a batch of infused reagents to create a pair of infused alchemical items of up to level %{level} without a Crafting check"',
  'Alchemical Alacrity':'Section=skill Note="Increased Quick Alchemy effects"',
  'Alchemical Expertise':'Section=combat Note="Class Expert (Alchemist)"',
  'Alchemical Mastery':'Section=combat Note="Class Master (Alchemist)"',
  'Alchemical Weapon Expertise':
    'Section=combat ' +
    'Note="Attack Expert (Simple Weapons; Alchemical Bombs; Unarmed Attacks)"',
  'Alchemist Feats':'Section=feature Note="%V selections"',
  'Alchemist Skills':
    'Section=skill Note="Skill Trained (Crafting; Choose %V from any)"',
  'Alchemy':'Section=feature Note="Has Alchemical Crafting feature"',
  'Alertness':'Section=skill Note="Perception Expert"',
  'Bomber':
    'Section=combat Note="May have a bomb splash affect only a single target"',
  'Chirurgeon':'Section=skill Note="May use Crafting in place of Medicine"',
  'Double Brew':'Section=skill Note="Increased Quick Alchemy effects"',
  'Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Reflex)",' +
      '"Successes on Reflex saves are critical successes"',
  'Field Discovery':
    'Section=combat ' +
    'Note="Using Advanced Alchemy creates 3 alchemical items from research field"',
  'Formula Book':
    'Section=combat ' +
    'Note="Has a book that contains at least %{level*2+8} alchemical formulas"',
  'Greater Field Discovery (Bomber)':
    'Section=combat ' +
    'Note="May increase bomb splash to %{$\'features.Expanded Flash\'?15:10}\'"',
  'Greater Field Discovery (Chirurgeon)':
    'Section=combat Note="Elixirs restore the maximum number of Hit Points"',
  'Greater Field Discovery (Mutagenist)':
    'Section=combat Note="May use 2 polymorphic mutagens simultaneously"',
  'Infused Reagents':
    'Section=skill ' +
    'Note="May create %{level+intelligenceModifier} batches of infused reagents each day"',
  'Iron Will':'Section=save Note="Save Expert (Will)"',
  'Juggernaut':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Fortitude)",' +
      '"Successes on Fortitude saves are critical successes"',
  'Medium Armor Expertise':
    'Section=combat ' +
    'Note="Defense Expert (Light Armor; Medium Armor; Unarmored Defense)"',
  'Medium Armor Mastery':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Unarmored Defense)"',
  'Mutagenic Flashback':
    'Section=combat ' +
    'Note="May regain the effects of a mutagen consumed earlier in the day for 1 min as a free action 1/day"',
  'Mutagenist':'Section=feature Note="Has Mutagenic Flashback feature"',
  'Perpetual Infusions':
    'Section=skill ' +
    'Note="May create 2 alchemical items of up to level %V from research field without using infused reagents"',
  'Perpetual Perfection':
    'Section=skill Note="Increased Perpetual Infusions effects"',
  'Perpetual Potency':
    'Section=skill Note="Increased Perpetual Infusions effects"',
  'Powerful Alchemy':
    'Section=combat ' +
    'Note="Items created with Quick Alchemy have DC %{classDifficultyClass.Alchemist}"',
  'Quick Alchemy':
    'Section=skill ' +
    'Note="May use batches of infused reagents to create %V alchemical %{skillNotes.quickAlchemy==1?\'item\':\'items\'} of up to level %{level} for 1 tn"',
  'Research Field':
    'Section=feature,skill ' +
    'Note=' +
      '"1 selection",' +
      '"Using Advanced Alchemy creates 3 signature items from research field"',
  'Weapon Specialization':
    'Section=combat ' +
    'Note="+%V/+%{combatNotes.weaponSpecialization*1.5}/+%{combatNotes.weaponSpecialization*2} HP damage with expert/master/legendary weapon proficiency"',

  'Alchemical Familiar':'Section=feature Note="Has Familiar feature"',
  'Alchemical Savant':
    'Section=skill ' +
    'Note="May use Crafting to Identify Alchemy as a single action/+2 to Identify known formulas; critical failures on known formulas are normal failures"',
  'Far Lobber':'Section=combat Note="Bombs have 30\' range"',
  'Quick Bomber':
    'Section=combat Note="May use 1 action to draw and throw a bomb"',
  'Poison Resistance':
    'Section=save Note="Poison resistance %{level//2}/+1 saves vs. poison"',
  'Revivifying Mutagen':
    'Section=combat ' +
    'Note="May use 1 action to end mutagen effects and regain 1d6 Hit Points per 2 levels of the mutagen"',
  'Smoke Bomb':
    'Section=combat ' +
    'Note="May use Quick Alchemy to create a bomb up to level %{level-1} that also creates smoke in a 10\'-radius burst for 1 min"',
  'Calculated Splash':
    'Section=combat ' +
    'Note="May increase the splash damage of bombs to %{intelligenceModifier} Hit Points"',
  'Efficient Alchemy':
    'Section=skill ' +
    'Note="May produce twice the usual number of alchemical items during downtime"',
  'Enduring Alchemy':
    'Section=skill ' +
    'Note="Quick Alchemy products last until the end of next turn"',
  'Combine Elixirs':
    'Section=skill ' +
    'Note="May create a single elixir that has the effects of two elixirs of up to level %{level-2}"',
  'Debilitating Bomb':
    'Section=combat ' +
    'Note="May create bombs up to level %{level-2} that also inflict dazzled, deafened, flat-footed, or -5 Speed (DC %{classDifficultyClass.Alchemist} Fort neg})"',
  'Directional Bombs':
    'Section=combat Note="May restrict bomb splash to a 15\' cone"',
  'Feral Mutagen':
    'Section=combat,skill ' +
    'Note=' +
      '"Consuming a bestial mutagen gives claws and jaws the deadly d10 trait; may also increase AC penalty to -2 to increase claws and jaws damage by 1 die step",' +
      '"Consuming a bestial mutagen adds item bonus to Intimidation"',
  'Sticky Bomb':
    'Section=combat ' +
    'Note="May create bombs up to level %{level-2} that inflict persistent damage equal to splash damage"',
  'Elastic Mutagen':
    'Section=skill ' +
    'Note="Consuming a quicksilver mutagen allows 10\' Steps and moving through tight spaces as 1 size smaller"',
  'Expanded Splash':
    'Section=combat ' +
    'Note="May throw bombs to inflict +%{intelligenceModifier} HP damage in a 10\' radius"',
  'Greater Debilitating Bomb':
    'Section=combat ' +
    'Note="May create bombs up to level %{level-2} that also inflict clumsy 1, enfeebled 1, stupefied 1, or -10 Speed (DC %{classDifficultyClass.Alchemist} Fort neg)"',
  'Merciful Elixir':
    'Section=skill ' +
    'Note="May make an elixir of life that also gives a +%{classDifficultyClass.Alchemist-10} counteract on a fear or paralyzing effect"',
  'Potent Poisoner':
    'Section=skill ' +
    'Note="+4 crafted poison DCs (+%{classDifficultyClass.Alchemist} max)"',
  'Extend Elixir':'Section=skill Note="Doubles elixir duration"',
  'Invincible Mutagen':
    'Section=combat ' +
    'Note="Consuming a juggernaut elixir gives resistance %{intelligenceModifier>?0} to all physical damage"',
  'Uncanny Bombs':
    'Section=combat,combat ' +
    'Note=' +
      '"Thrown bombs have 60\' range",' +
      '"Thrown bombs reduce target cover AC bonus by 1 and automatically succeed on the flat check to target a concealed creature"',
  'Glib Mutagen':
    'Section=skill ' +
    'Note="Consuming a silvertongue mutagen negates Deception, Diplomacy, Intimidation, and Performance circumstance penalties and language barriers"',
  'Greater Merciful Elixir':
    'Section=skill ' +
    'Note="May make an elixir of life that also gives a +%{classDifficultyClass.Alchemist-10} counteract on a blinded, deafened, sickened, or slowed condition"',
  'True Debilitating Bomb':
    'Section=combat ' +
    'Note="May create bombs up to level %{level-2} that also inflict enfeebled 2, stupefied 2, or -15 Speed (DC %{classDifficultyClass.Alchemist} Fort neg) or a lesser condition that requires a critical success to negate"',
  'Eternal Elixir':
    'Section=skill ' +
    'Note="May extend indefinitely the duration of an elixir of up to level %{level//2}"',
  'Exploitive Bomb':
    'Section=combat ' +
    'Note="May use Quick Alchemy to make a bomb up to level %{level-2} that negates resistance %{level}"',
  'Genius Mutagen':
    'Section=skill ' +
    'Note="Consuming a cognitive mutagen adds its bonus to Deception, Diplomacy, Intimidation, Medicine, Nature, Performance, Religion, and Survival checks and allows R60\' telepathic communication"',
  'Persistent Mutagen':
    'Section=skill ' +
    'Note="May extend the duration of a mutagen until the next day 1/day"',
  'Improbable Elixirs':
    'Section=skill ' +
    'Note="May create elixirs that replicate the effects of %{intelligenceModifier>?1} potion%{intelligenceModifier>1?\'s\':\'\'} of up to level 9"',
  'Mindblank Mutagen':
    'Section=save ' +
    'Note="Consuming a serene mutagen gives immunity to detection, revelation, and scrying up to level 9"',
  'Miracle Worker':
    'Section=combat ' +
    'Note="May administer a true elixir of life to restore life to a creature dead for up to 2 rd"',
  'Perfect Debilitation':
    'Section=combat ' +
    'Note="Debilitating Bombs require a critical save to avoid effects"',
  "Craft Philosopher's Stone":
    'Section=skill ' +
    'Note="Knows the formula for creating a philosopher\'s stone"',
  'Mega Bomb':
    'Section=combat ' +
    'Note="May throw a bomb up to 60\' that affects all creatures in a 30\' radius (Ref neg)"',
  'Perfect Mutagen':
    'Section=skill Note="Does not suffer drawbacks from consuming mutagens"',

  // Barbarian
  'Armor Of Fury':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Unarmored Defense)"',
  'Barbarian Feats':'Section=feature Note="%V selections"',
  'Barbarian Skills':
    'Section=skill Note="Skill Trained (Athletics; Choose %V from any)"',
  'Bestial Rage':'Section=combat Note="%V 1d%1%2 HP%3 during rage"',
  'Brutality':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"May use melee and unarmed weapon critical specialization effects while raging"',
  'Deny Advantage':
    'Section=combat ' +
    'Note="Does not suffer flat-footed to foes of equal or lower level"',
  'Devastator':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Master (Barbarian)",' +
      '"Successful melee Strikes ignore 10 points of physical damage resistance"',
  'Draconic Rage':
    'Section=combat ' +
    'Note="May inflict +4 HP %V damage instead of +2 HP weapon damage during rage"',
  'Fury Instinct':'Section=feature Note="+1 Class Feat"',
  'Greater Juggernaut':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Fortitude)",' +
      '"Critical failures on Fortitude saves are normal failures/Suffers half damage on failed Fortitude save"',
  'Greater Weapon Specialization':
    'Section=combat Note="Increased Weapon Specialization effects"',
  'Heightened Senses':'Section=skill Note="Perception Master"',
  'Indomitable Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Instinct':'Section=feature Note="1 selection"',
  // Juggernaut as above
  'Lightning Reflexes':'Section=save Note="Save Expert (Reflex)"',
  // Medium Armor Expertise as above
  'Mighty Rage':
    'Section=combat ' +
    'Note="May use a rage action as a free action when entering rage"',
  'Quick Rage':'Section=combat Note="May re-enter rage after 1 turn"',
  'Rage':
    'Section=combat ' +
    'Note="May gain %{level+constitutionModifier} temporary Hit Points and +%V HP melee damage (agile weapon +1 HP), and suffer -1 AC and no concentration actions, for 1 min; requires 1 min between rages"',
  'Raging Resistance':
    'Section=save ' +
    'Note="Resistance %{3+constitutionModifier} to %V while raging"',
  'Specialization Ability':
     // TODO frog and deer reach => 10'
    'Section=combat Note="Rage damage bonus%1 increases to +%V"',
  'Spirit Rage':
    'Section=combat ' +
    'Note="May inflict +3 HP positive or negative damage, along with <i>ghost touch</i>, instead of +2 HP weapon damage during rage"',
  'Titan Mauler':
    'Section=combat ' +
    'Note="May use weapons made for a larger creature, gaining +6 HP damage and suffering clumsy 1"',
  'Weapon Fury':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  // Weapon Specialization as above

  'Acute Vision':'Section=feature Note="Has Darkvision feature during rage"',
  'Moment Of Clarity':
    'Section=combat ' +
    'Note="During rage, may use 1 action to allow use of concentration actions for the remainder of the turn"',
  'Raging Intimidation':
    'Section=skill,skill ' +
    'Note=' +
      '"Has Intimidating Glare%1 feature",' +
      '"May use Demoralize during rage"',
  'Raging Thrower':
    'Section=combat ' +
    'Note="+%{combatNotes.rage} HP thrown weapon damage during rage/Brutal Critical and Devastator effects apply to thrown weapons"',
  'Sudden Charge':
    'Section=combat ' +
    'Note="May use 2 actions to make a melee Strike after a double Stride"',
  'Acute Scent':'Section=skill Note="R30\' imprecise scent"',
  'Furious Finish':
    'Section=combat ' +
    'Note="May gain additional damage on a Strike during rage; suffers end of rage and fatigue until 10 min rest"',
  'No Escape':
    'Section=combat ' +
    'Note="May use a Reaction to Stride along with retreating foe"',
  'Second Wind':
    'Section=combat ' +
    'Note="May immediately re-enter rage; suffers fatigue afterwards until 10 min rest"',
  'Shake It Off':
    'Section=combat ' +
    'Note="May reduce a frightened condition by 1 and reduce a sickened condition by 1/2/3 with a fail/success/critical success on a Fortitude save during rage"',
  'Fast Movement':'Section=combat Note="+10 speed during rage"',
  'Raging Athlete':
    'Section=skill ' +
    'Note="Gains %{speed}\' climb and swim speed, -10 jump DC, and 5\'/%{speed>=30?20:15}\' vertical/horizontal Leap during rage"',
  'Swipe':
    'Section=combat ' +
    'Note="May use 2 actions to attack 2 adjacent foes with a single Strike"',
  'Wounded Rage':
    'Section=combat ' +
    'Note="May use a Reaction after taking damage to enter rage"',
  'Animal Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Unarmored Defense)",' +
      // TODO Dex cap
      '"+%{$\'features.Greater Juggernaut\'?3:2} AC during rage"',
  'Attack Of Opportunity':
    'Section=combat ' +
    'Note="May use a Reaction to Strike a foe that uses a manipulate action, makes a ranged attack, or leaves a square while moving"',
  'Brutal Bully':
    'Section=combat ' +
    'Note="Successful Disarm, Grapple, Shove, or Trip inflicts %{strengthModifier}B HP damage during rage"',
  'Cleave':
    'Section=combat ' +
    'Note="May use a Reaction after killing or knocking unconscious a foe to Strike an adjacent foe"',
  "Dragon's Rage Breath":
    'Section=combat ' +
    // TODO automate
    'Note="May use breath to inflict %{level}d6 damage in a 30\' cone or 60\' line 1/rage (Ref neg; half distance and damage for a 2nd breath use within 1 hour)"',
  "Giant's Stature":
    'Section=combat ' +
    'Note="May grow to Large size, gaining +5\' reach and suffering clumsy 1, until rage ends"',
  "Spirits' Interference":
    'Section=combat ' +
    'Note="Foe ranged attacks require a DC 5 flat check until rage ends"',
  'Animal Rage':
    'Section=magic ' +
    'Note="May use <i>Animal Form</i> effects to transform into spirit animal at will"',
  'Furious Bully':'Section=combat Note="+2 Athletics for attacks during rage"',
  'Renewed Vigor':
    'Section=combat ' +
    'Note="May gain %{level//2+constitutionModifier} temporary Hit Points"',
  'Share Rage':
    'Section=combat Note="R30\' May give an ally the effects of Rage 1/rage"',
  'Sudden Leap':
    'Section=combat ' +
    'Note="May use 2 actions to make a Strike during a Leap, High Jump, or Long Jump"',
  'Thrash':
    'Section=combat ' +
    'Note="May inflict %{strengthModifier+combatNotes.rage}B HP + specialization damage to grabbed foe (Fort neg)"',
  'Come And Get Me':
    'Section=combat ' +
    'Note="May suffer flat-footed and +2 HP foe damage to gain +%{constitutionModifier} temporary Hit Points from a successful Strike (critical success +%{constitutionModifier*2}) on a successful attacker until rage ends"',
  'Furious Sprint':
    'Section=combat ' +
    'Note="May use 2 actions to Stride %{speed*5}\' in a straight line, or 3 actions to Stride %{speed*8}\'"',
  'Great Cleave':
    'Section=combat ' +
    'Note="May continue to Cleave adjacent foes as long as Strikes incapacitate"',
  'Knockback':
    'Section=combat Note="May shove foe 5\' after a successful Strike"',
  'Terrifying Howl':
    'Section=combat ' +
    'Note="R30\' Successful Intimidate Demoralizes multiple foes"',
  "Dragon's Rage Wings":
    'Section=combat Note="May fly %{speed}\'/rd during rage"',
  'Furious Grab':
    'Section=combat ' +
    'Note="May automatically grab foe after a successful Strike"',
  "Predator's Pounce":
    'Section=combat ' +
    'Note="May Strike after moving %{speed}\' in light or no armor"',
  "Spirit's Wrath":'Section=combat Note="May make a R120\' +%{$\'training.Martial Weapons\'*2+level+strengthModifier+2} spirit Strike that inflicts 4d8+%{constitutionModifier} HP negative or positive damage; a citical hit also inflits frightened 1"',
  "Titan's Stature":
    'Section=combat ' +
    'Note="May grow to Huge size, gaining +10\' reach and suffering clumsy 1, until rage ends"',
  'Awesome Blow':
    'Section=combat ' +
    'Note="A successful Athletics vs. Fortitude with Knockback Shoves and Trips foe"',
  "Giant's Lunge":
    'Section=combat ' +
    'Note="May extend reach of melee weapons and unarmed attacks to 10\' until rage ends"',
  'Vengeful Strike':
    'Section=combat ' +
    'Note="May use a Reaction while using Come And Get Me to make a Strike when hit by a Strike"',
  'Whirlwind Strike':
    'Section=combat Note="May use 3 actions to Strike each foe within reach"',
  'Collateral Thrash':
    'Section=combat ' +
    'Note="May affect another adjacent foe (DC %{classDifficultyClass.Barbarian} Ref neg) with a successful Thrash"',
  'Dragon Transformation':
    'Section=magic ' +
    'Note="May use <i>Dragon Form</i> effects%{level>=18?\', with +20 fly speed, +12 dragon Strikes, and +14 HP breath weapon damage,\':\'\'} during rage"',
  'Reckless Abandon':
    'Section=feature ' +
    'Note="When reduced to %{hitPoints//2} or fewer Hit Points during rage, may suffer -2 AC and -1 saves to gain +2 attacks"',
  'Brutal Critical':
    'Section=combat ' +
    'Note="Critical melee hits inflict +1 damage die and 2 damage dice bleed damage"',
  'Perfect Clarity':
    'Section=combat ' +
    'Note="May use a Reaction to end rage for a +2 reroll on a failed attack or Will save"',
  'Vicious Evisceration':
    'Section=combat ' +
    'Note="May use 2 actions for a Strike that inflicts drained 1 (critical success drained 2)"',
  'Contagious Rage':
    'Section=combat ' +
    'Note="May use Share Rage unlimited times, also sharing instinct and specialization abilities"',
  'Quaking Stomp':
    'Section=magic Note="May use <i>Earthquake</i> effects 1/10 min"',

  // Bard
  'Bard Weapon Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Unarmed Attacks; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip)",' +
      '"May use critical specialization effects of any simple weapon, unarmed attack, longsword, rapier, sap, shortbow, shortsword, and whip"',
  'Bard Feats':'Section=feature Note="%V selections"',
  'Bard Skills':
    'Section=skill ' +
    'Note="Skill Trained (Occultism; Performance; Choose %V from any)"',
  // TODO description needs extending
  'Composition Spells':
    'Section=magic ' +
    'Note="Has a Focus Pool with 1 Focus Point/Knows the <i>Counter Performance</i> and <i>Inspire Courage</i> spells"',
  'Enigma Muse':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Bardic Lore feature",' +
      '"Knows the <i>True Strike</i> spell"',
  'Expert Spellcaster':'Section=magic Note="Spell Expert (%V)"',
  'Great Fortitude':'Section=save Note="Save Expert (Fortitude)"',
  'Greater Resolve':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Critical failures on Will saves are normal failures/Takes half damage on failed Will saves"',
  'Legendary Spellcaster':'Section=magic Note="Spell Legendary (%V)"',
  'Light Armor Expertise':
    'Section=combat Note="Defense Expert (Light Armor; Unarmored Defense)"',
  // Lightning Reflexes as above
  'Maestro Muse':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Lingering Composition feature",' +
      '"Knows the <i>Soothe</i> spell"',
  'Magnum Opus':'Section=magic Note="Knows 2 10th-level occult spells"',
  'Master Spellcaster':'Section=magic Note="Spell Master (%V)"',
  'Muses':'Section=feature Note="1 selection"',
  'Occult Spellcasting':
    'Section=magic Note="May learn spells from the Occult tradition"',
  'Polymath Muse':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Versatile Performance feature",' +
      '"Knows the <i>Unseen Servant</i> spell"',
  'Resolve':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Signature Spells':
    'Section=magic Note="May freely heighten a chosen spell of each level"',
  'Vigilant Senses':'Section=skill Note="Perception Master"',
  // Weapon Specialization as above

  'Bardic Lore':
    'Section=skill Note="May use Bardic Lore to Recall Knowledge on any topic"',
  'Lingering Composition':
    'Section=magic ' +
    'Note="Knows the <i>Lingering Composition</i> spell/+1 Focus Points"',
  'Reach Spell':'Section=magic Note="May extend spell range by 30\'"',
  'Versatile Performance':
    'Section=skill ' +
    'Note="May use Performance in place of Deception, Diplomacy, and Intimidation"',
  'Cantrip Expansion':
    'Section=magic Note="May prepare two additional cantrips each day"',
  'Esoteric Polymath':
    'Section=magic,skill ' +
    'Note=' +
      '"May use Occultism to add spells to spellbook",' +
      '"May learn 1 additional spell from spellbook each day, treating it as a signature spell if it is in repertoire"',
  'Inspire Competence':
    'Section=magic Note="Knows the <i>Inspire Competence</i> cantrip"',
  "Loremaster's Etude":
    'Section=magic ' +
    'Note="Knows the <i>Loremaster\'s Etude<i> spell/+1 Focus Points"',
  'Multifarious Muse (Enigma Muse)':
    'Section=feature,magic ' +
    'Note=' +
      '"May learn enigma muse feats",' +
      '"Knows a 1st-level enigma muse spell"',
  'Multifarious Muse (Maestro Muse)':
    'Section=feature,magic ' +
    'Note=' +
      '"May learn maestro muse feats",' +
      '"Knows a 1st-level maestro muse spell"',
  'Multifarious Muse (Polymath Muse)':
    'Section=feature,magic ' +
    'Note=' +
      '"May learn polymath muse feats",' +
      '"Knows a 1st-level polymath muse spell"',
  'Inspire Defense':
    'Section=magic Note="Knows the <i>Inspire Defense</i> cantrip"',
  'Melodious Spell':
    'Section=skill ' +
    'Note="May hide spellcasting from observers with a successful Performance vs. Perception"',
  'Triple Time':'Section=magic Note="Knows the <i>Triple Time</i> cantrip"',
  'Versatile Signature':
    'Section=magic Note="May change 1 signature spell each day"',
  'Dirge Of Doom':'Section=magic Note="Knows the <i>Dirge Of Doom</i> cantrip"',
  'Harmonize':
    'Section=magic Note="May have 2 composition spells active simultaneously"',
  'Steady Spellcasting':
    'Section=magic ' +
    'Note="A successful DC 15 flat check negates self spellcasting disruption"',
  'Eclectic Skill':
    'Section=skill,skill ' +
    'Note=' +
      '"+%{level} untrained skills",' +
      '"May attempt any skill requiring trained%{rank.Occultism>=4?\' or expert\':\'\'} proficiency"',
  'Inspire Heroics':
    'Section=magic ' +
    'Note="Knows the <i>Inspire Heroics<i> spell/+1 Focus Points"',
  'Know-It-All':
    'Section=skill ' +
    'Note="A successful Recall Knowledge grants additional information"',
  'House Of Imaginary Walls':
    'Section=magic Note="Knows the <i>Imaginary Walls</i> cantrip"',
  'Quickened Casting':
    'Section=magic ' +
    'Note="Reduces the time required to cast a spell of level %1 or lower by 1 action"',
  'Unusual Composition':
    'Section=magic ' +
    'Note="May replace somatic components of a composition spell with verbal components or vice versa"',
  'Eclectic Polymath':
    'Section=magic ' +
    'Note="May retain Esoteric Polymath spell in repertoire by removing a spell of the same level"',
  'Inspirational Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Allegro':'Section=magic Note="Knows the <i>Allegro</i> cantrip"',
  'Soothing Ballad':
    'Section=magic ' +
    'Note="Knows the <i>Soothing Ballad<i> spell/+1 Focus Points"',
  'True Hypercognition':
    'Section=skill Note="May use 1 action for 5 Recall Knowledge actions"',
  'Effortless Concentration':
    'Section=magic Note="May extend the duration of 1 spell as a free action"',
  'Studious Capacity':
    'Section=magic ' +
    'Note="May cast 1 additional spell of level %1 or lower each day"',
  'Deep Lore':'Section=magic Note="Knows 1 additional spell of each level"',
  'Eternal Composition':
    'Section=magic ' +
    'Note="May use an additional action each rd to cast a composition cantrip"',
  'Impossible Polymath':
    'Section=magic Note="May add spells from trained traditions to spellbook"',
  'Fatal Aria':
    'Section=magic Note="Knows the <i>Fatal Aria<i> spell/+1 Focus Points"',
  'Perfect Encore':'Section=magic Note="+1 10th level spell slot"',
  'Symphony Of The Muse':
    'Section=magic ' +
    'Note="May have any number of composition spells active simultaneously"',

  // Champion
  // Alertness as above
  'Armor Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"May use the specialization effects of medium and heavy armor"',
  'Armor Mastery':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Cause':'Section=feature Note="1 selection"',
  'Champion Expertise':
    'Section=combat,magic ' +
    'Note=' +
      '"Class Expert (Champion)",' +
      '"Spell Expert (Divine)"',
  'Champion Feats':'Section=feature Note="%V selections"',
  'Champion Mastery':
    'Section=combat,magic ' +
    'Note=' +
      '"Class Master (Champion)",' +
      '"Spell Master (Divine)"',
  'Champion Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  "Champion's Code":'Section=feature Note="1 selection"',
  "Champion's Reaction":'Section=feature Note="Has %V feature"',
  'Deific Weapon':
    'Section=combat,combat ' +
    'Note=' +
      '"Deity favored unarmed attacks and simple weapons increase damage die 1 step",'+
      '"Has access to deity weapon (%{deityWeapon})"',
  // TODO more to it than this
  'Devotion Spells':
    'Section=magic Note="Has a Focus Pool with 1 Focus Point"',
  'Divine Ally':
    'Section=feature ' +
    'Note="%V selection%{featureNotes.divineAlly==1?\'\':\'s\'}"',
  'Divine Ally (Blade)':
    'Section=combat ' +
    'Note="May apply choice of <i>disrupting</i>, <i>ghost touch</i>, <i>returning</i>, or <i>shifting</i> to a weapon chosen each day; also gains critical specialization effect"',
  'Divine Ally (Shield)':
    'Section=combat Note="+2 shield hardness/+50% shield Hit Points"',
  'Divine Ally (Steed)':
    'Section=feature Note="Has a mount as an animal companion"',
  'Divine Smite (Liberator)':
    'Section=combat ' +
    'Note="Liberating Step inflicts %{charismaModifier} HP persistent good damage on a foe who restrains an ally"',
  'Divine Smite (Paladin)':
    'Section=combat ' +
    'Note="Retributive Strike inflicts %{charismaModifier} HP persistent good damage"',
  'Divine Smite (Redeemer)':
    'Section=combat ' +
    'Note="Glimpse Of Redemption inflicts %{charismaModifier} HP persistent good damage on a target who responds with damage"',
  'Divine Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Exalt (Liberator)':
    'Section=combat ' +
    'Note="R15\' Liberating Step allows all allies to Step if target ally does not attempt to break free"',
  'Exalt (Paladin)':
    'Section=combat ' +
    'Note="R15\' Retributive Strike allows allies a %V melee Strike against target"',
  'Exalt (Redeemer)':
    'Section=combat ' +
    'Note="R15\' May use Glimpse Of Redemption to grant allies %{level} damage resistance"',
  'Glimpse Of Redemption':
    'Section=combat ' +
    'Note="R15\' May use a Reaction to negate damage to a struck ally or to grant ally damage resistance %{2+level} and inflict enfeebled 2 on triggering foe for 1 rd (foe\'s choice)"',
  // Greater Weapon Specialization as above
  "Hero's Defiance":
    'Section=magic Note="Knows the <i>Hero\'s Defiance</i> spell"',
  // Juggernaut as above
  'Legendary Armor':
    'Section=combat ' +
    'Note="Defense Legendary (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Liberating Step':
    'Section=combat ' +
    'Note="R15\' May use a Reaction to grant an ally damage resistance %{2+level}, an Escape action or save from a restraint, and a Step"',
  'Liberator':
    'Section=feature,magic ' +
    'Note=' +
      '"Must always respect others\' freedom and oppose tyranny",' +
      '"Knows the <i>Lay On Hands</i> spell"',
  // Lightning Reflexes as above
  'Paladin':
    'Section=feature,magic ' +
    'Note=' +
      '"Must always act with honor and respect lawful authority",' +
      '"Knows the <i>Lay On Hands</i> spell"',
  'Redeemer':
    'Section=feature,magic ' +
    'Note=' +
      '"Must always show compassion for others and attempt to redeem the wicked",' +
      '"Knows the <i>Lay On Hands</i> spell"',
  'Retributive Strike':
    'Section=combat ' +
    'Note="R15\' May use a Reaction when an ally is damaged to grant them damage resistance %{level+2}, plus make a melee Strike against the triggering foe if within reach"',
  // Shield Block as below
  'The Tenets Of Good':
    'Section=feature ' +
    'Note="May not commit anathema or evil acts, harm innocents, or allow harm to come to innocents through inaction"',
  'Weapon Expertise':
    'Section=combat ' +
    'Note="Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  'Weapon Mastery':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  // Weapon Specialization as above

  "Deity's Domain":'Section=magic Note="Knows a domain spell of deity"',
  'Ranged Reprisal':
    'Section=combat ' +
    'Note="May make a Retributive Strike using a ranged attack or a Step and a melee Strike"',
  'Unimpeded Step':
    'Section=combat ' +
    'Note="Liberating Step target may Step normally in difficult terrain"',
  'Weight Of Guilt':
    'Section=combat ' +
    'Note="May make Glimpse Of Redemption target stupefied instead of enfeebled"',
  'Divine Grace':
    'Section=combat Note="May use a Reaction to gain +2 save vs. a spell"',
  'Dragonslayer Oath':
    'Section=combat,feature ' +
    'Note=' +
      '"%V when used with an evil dragon",' +
      '"Must attempt to slay evil dragons whenever possible"',
  'Fiendsbane Oath':
    'Section=combat,feature ' +
    'Note=' +
      '"%V when used with a fiend",' +
      '"Must attempt to banish or slay fiends whenever possible"',
  'Shining Oath':
    'Section=combat,feature ' +
    'Note=' +
      '"%V when used with undead",' +
      '"Must attempt to put undead to rest whenever possible"',
  'Vengeful Oath':
    'Section=feature,magic ' +
    'Note=' +
      '"Must hunt down and exterminate creatures who have committed atrocities whenever possible",' +
      '"May use <i>Lay On Hands</i> to inflict good damage on creatures seen harming innocents or good allies"',
  'Aura Of Courage':
    'Section=save ' +
    'Note="R15\' Reduces value of frightened condition for self and allies by 1"',
  'Divine Health':
    'Section=save ' +
    'Note="+1 vs. disease/Successes vs. disease are critical successes"',
  'Mercy':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> may also counteract choice of fear or paralysis"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"Knows the <i>Litany Against Wrath</i> spell"',
  'Loyal Warhorse':
    'Section=feature Note="Mount is mature and will not attack self"',
  'Shield Warden':
    'Section=combat Note="May use Shield Block to protect an adjacent ally"',
  'Smite Evil':
    'Section=combat ' +
    'Note="Blade ally inflicts +4 HP good (master proficiency +6 HP) vs. target for 1 rd, extended as long as the target attacks an ally"',
  "Advanced Deity's Domain":
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"Knows an advanced domain spell of deity"',
  'Greater Mercy':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> may also counteract blinded, deafened, sickened, or slowed"',
  'Heal Mount':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> on mount restores 10 Hit Points +10 Hit Points/heightened level"',
  'Quick Shield Block':
    'Section=combat ' +
    'Note="May use an additional Reaction for a Shield Block 1/tn"',
  'Second Ally':'Section=feature Note="+1 selection"',
  'Sense Evil':
    'Section=feature ' +
    'Note="Can detect the presence of powerful evil auras (Deception vs. Perception neg)"',
  'Devoted Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Imposing Destrier':
    'Section=feature ' +
    'Note="Mount is a nimble or savage animal companion and may Stride or Strike without a command"',
  'Litany Against Sloth':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"Knows the <i>Litany Against Sloth</i> spell"',
  'Radiant Blade Spirit':
    'Section=combat ' +
    'Note="May choose <i>flaming</i> or <i>anarchic</i>, <i>axiomatic</i>, <i>holy</i>, or <i>unholy</i> property for Blade Ally"',
  'Shield Of Reckoning':
    'Section=combat ' +
    'Note="May use 1 Reaction to apply Shield Block and Champion\'s Reaction with an ally"',
  'Affliction Mercy':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> may also counteract a curse, disease, or poison"',
  'Aura Of Faith':
    'Section=combat ' +
    'Note="R15\' All self Strikes and the first Strike each ally each rd inflict +1 HP good damage vs. evil creatures"',
  'Blade Of Justice':
    'Section=combat Note="May use 2 actions to add two extra damage dice on a Strike vs. an evil foe and convert all damage to good%{features.Paladin ? \', as well as inflicting Retributive Strike effects\' : \'\'}"',
  "Champion's Sacrifice":
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"Knows the <i>Champion\'s Sacrifice</i> spell"',
  'Divine Wall':
    'Section=combat Note="Adjacent spaces are difficult terrain for foes"',
  'Lasting Doubt':
    'Section=combat ' +
    'Note="Effects of Glimpse Of Redemption linger at half intensity for 1 min"',
  'Liberating Stride':
    'Section=combat ' +
    'Note="Target of Liberating Step may Stride half their Speed"',
  'Anchoring Aura':
    'Section=magic Note="R15\' Aura counteracts teleportation spells cast by fiends"',
  'Aura Of Life':
    'Section=save ' +
    'Note="R15\' Grants resistance 5 to negative energy and +1 saves vs. necromancy"',
  'Aura Of Righteousness':
    'Section=save Note="R15\' Grants resistance 5 to evil"',
  'Aura Of Vengeance':
    'Section=combat ' +
    'Note="Reduces allies\' penalty on Strikes in response to Retributive Strike to -2"',
  'Divine Reflexes':
    'Section=combat ' +
    'Note="May use an additional Reaction for Champion\'s Reaction 1/tn"',
  'Litany Of Righteousness':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"Knows the <i>Litany Of Righteousness</i> spell"',
  'Wyrmbane Aura':
    'Section=save ' +
    'Note="R15\' Grants self and allies resistance %{charismaModifier} to acid, cold, electricity, fire, and poison (resistance %{level} from dragons)"',
  'Auspicious Mount':
    'Section=feature ' +
    'Note="Mount is a specialized animal companion with %{deity}\'s mark, Skill Expert (Religion), speech, +2 Intelligence, and +1 Wisdom"',
  'Instrument Of Zeal':
    'Section=combat ' +
    'Note="Critical hit with Blade Of Justice or Retributive Strike inflicts +1 damage die and slowed 1 for 1 rd"',
  'Shield Of Grace':
    'Section=combat ' +
    'Note="May suffer half of excess damage when using Shield Block to protect an ally"',
  'Celestial Form':
    'Section=feature Note="Has a celestial form with Darkvision and flight"',
  'Ultimate Mercy':
    'Section=magic ' +
    'Note="May use <i>Lay On Hands</i> to restore life to a target who died in the previous rd"',
  'Celestial Mount':
    'Section=feature Note="Mount has a celestial form with Darkvision, +40 Hit Points, weakness 10 to evil damage, and flight"',
  'Radiant Blade Master':
    'Section=combat ' +
    'Note="May choose <i>dancing</i>, <i>greater disrupting</i>, or <i>keen</i> property for Blade Ally"',
  'Shield Paragon':
    'Section=combat,combat ' +
    'Note=' +
      '"+50% shield Hit Points",' +
      '"Shield is always raised and is automatically remade after 1 day if destroyed"',

  // Cleric
  // Alertness as above
  'Anathema':
    'Section=feature ' +
    'Note="May not perform acts or cast spells prohibited by %{levels.Druid?\'druidic order\'+($\'features.Order Explorer\'?\'s\':\'\'):deity}"',
  'Cleric Feats':'Section=feature Note="%V selections"',
  'Cleric Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  'Cloistered Cleric':
    'Section=combat,combat,feature,magic,save ' +
    'Note=' +
      '"Attack Expert (%V; Simple Weapons; Unarmed Attacks)",' +
      '"May use critical specialization effects of %{deityWeapon}",' +
      '"Has Domain Initiate feature",' +
      '"Spell %V (Divine)",' +
      '"Save Expert (Fortitude)"',
  'Deity':
    'Section=combat,magic,skill ' +
    'Note=' +
      '"Attack Trained (%V)",' +
      '"Has access to %V spells",' +
      '"Skill Trained (%V)"',
  'Divine Defense':'Section=combat Note="Defense Expert (Unarmored Defense)"',
  'Divine Font':'Section=feature Note="1 selection"',
  'Divine Spellcasting':
    'Section=magic Note="May learn spells from the Divine tradition"',
  'Doctrine':'Section=feature Note="1 selection"',
  'Harmful Font':'Section=magic Note="+1 D%V slot"',
  'Healing Font':'Section=magic Note="+1 D%V slot"',
  // Lightning Reflexes as above
  'Miraculous Spell':'Section=magic Note="Has 1 10th-level spell slot"',
  // Resolve as above
  'Warpriest':
    'Section=combat,combat,feature,magic,save,save ' +
    'Note=' +
      '"Armor %V (Light Armor; Medium Armor)%{level>=3?\'/Attack Trained (Martial Weapons)\':\'\'}%{level>=7?\'Attack Expert (%1; Simple Weapons; Unarmed Attacks)\':\'\'}",' +
      '"May use critical specialization effects of %{deityWeapon}",' +
      '"Has Shield Block%1 feature",' +
      '"Spell %V (Divine)",' +
      '"Save %V (Fortitude)",' +
      '"Successes on Fortitude saves are critical successes"',
  // Weapon Specialization as above

  'Deadly Simplicity':
    'Section=combat Note="+1 damage die step on %{deityWeapon}"',
  'Domain Initiate':
    'Section=magic ' +
    'Note="Knows 1 domain spell/Has a Focus Pool with 1 Focus Point"',
  'Harming Hands':'Section=magic Note="Harm spells die types increase to d10"',
  'Healing Hands':'Section=magic Note="Heal spells die types increase to d10"',
  'Holy Castigation':
    'Section=magic Note="May use heal spells to damage fiends"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    'Section=magic ' +
    'Note="Casting a heal spell on another creature restores Hit Points to self equal to spell level"',
  'Emblazon Armament':
    'Section=magic ' +
    'Note="10 min process gives target shield +1 Hardness or weapon +1 HP damage"',
  'Sap Life':
    'Section=magic ' +
    'Note="Casting a harm spell on another creature restores Hit Points to self equal to spell level"',
  'Turn Undead':
    'Section=magic ' +
    'Note="Critical failure by undead damaged by a heal spell inflicts fleeing for 1 rd"',
  'Versatile Font':
    'Section=magic ' +
    'Note="May use font slot to prepare either a harm or a heal spell"',
  'Channel Smite':
    'Section=combat ' +
    'Note="May use 2 actions to add the effects of a heal or harm spell to a melee Strike"',
  'Command Undead':
    'Section=magic ' +
    'Note="May use a harm spell to control undead up to level %{level-3} for 1 min (Will neg; critical failure extends to 1 hour)"',
  'Directed Channel':
    'Section=magic Note="May cast an area harm or heal spell in a 60\' cone"',
  'Improved Communal Healing':
    'Section=magic ' +
    'Note="May give additional Hit Points from Communal Healing to another"',
  'Necrotic Infusion':
    'Section=magic ' +
    'Note="Harm spells cast on an undead allow target to inflict +1d6 HP (5th level spell 2d6; 8th level 8d6) with first melee Strike in next rd"',
  'Cast Down':
    'Section=magic ' +
    'Note="May cast a harm or heal spell that inflicts damage also inflict knocked prone (target critical fail also inflicts -10 Speed for 1 min)"',
  'Divine Weapon':
    'Section=magic ' +
    'Note="Casting a spell causes a wielded weapon to inflict +1d4 HP force or +1d6 HP alignment until end of turn"',
  'Selective Energy':
    'Section=magic ' +
    'Note="May choose %{charismaModifier>?1} creatures to be unaffected when casting area harm or heal spell"',
  // Steady Spellcasting as above
  'Advanced Domain (Chaotic)':
    'Section=magic ' +
    'Note="Knows 1 advanced domain spell/+1 Focus Points"',
  'Advanced Domain (Evil)':
    'Section=magic ' +
    'Note="Knows 1 advanced domain spell/+1 Focus Points"',
  'Advanced Domain (Good)':
    'Section=magic ' +
    'Note="Knows 1 advanced domain spell/+1 Focus Points"',
  'Advanced Domain (Lawful)':
    'Section=magic ' +
    'Note="Knows 1 advanced domain spell/+1 Focus Points"',
  'Align Armament':
    'Section=combat ' +
    'Note="May touch a weapon to have it inflict +1d6 HP alignment for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Channeled Succor':
    'Section=magic ' +
    'Note="May cast <i>Remove Curse</i>, <i>Remove Disease</i>, <i>Remove Paralysis</i>, or <i>Restoration</i> in place of a prepared heal spell"',
  'Cremate Undead':
    'Section=magic ' +
    'Note="Heal spell cast upon undead inflicts fire damage equal to spell level"',
  'Emblazon Energy':
    'Section=magic ' +
    'Note="May use Emblazon Armament on a shield to give a save bonus and Shield Block vs. chosen energy type; having a matching domain spell also gives it +%{level//2} resistance; may use on a weapon to give it +1d4 HP chosen energy type (+1d6 with matching domain spell)"',
  'Castigating Weapon':
    'Section=magic ' +
    'Note="Damaging a fiend with a heal spell gives self weapons bonus good damage vs. fiends equal to half the spell level for 1 rd"',
  'Heroic Recovery':
    'Section=magic ' +
    'Note="Single-target heal spell also gives +5 Speed, +1 attack, and +1 HP damage for 1 rd"',
  'Improved Command Undead':
    'Section=magic ' +
    'Note="Target success/failure/critical failure vs. Command Undead gives self control for 1 rd/10 min/24 hour"',
  'Replenishment Of War':
    'Section=combat Note="Successful Strike with %{deityWeapon} gives self %{level//2} temporary Hit Points for 1 rd (critical hit %{level} temporary Hit Points) for 1 rd"',
  'Defensive Recovery':
    'Section=magic ' +
    'Note="May use a heal spell to also give +2 AC and saves for 1 rd"',
  'Domain Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Emblazon Antimagic':
    'Section=magic ' +
    'Note="May use Emblazon Armament on a shield to allow Shield Block vs. spells or on a weapon to have a critical hit also counteract a spell using 1/2 the wielder\'s level"',
  'Shared Replenishment':
    'Section=combat ' +
    'Note="May give temporary Hit Points from Replenishment Of War to an ally"',
  "Deity's Protection":
    'Section=magic ' +
    'Note="Casting a domain spell gives self resistance equal to the spell level to all damage for 1 rd"',
  'Extend Armament Alignment':
    'Section=combat Note="Increased Align Armament effects"',
  'Fast Channel':
    'Section=magic ' +
    'Note="May use 2 actions to cast a 3-action harm or heal spell"',
  'Swift Banishment':
    'Section=magic ' +
    'Note="May use a Reaction to cast <i>Banishment</i> with a critical hit"',
  'Eternal Bane':
    'Section=magic ' +
    'Note="R15\' Surrounded by continuous level %{level//2} <i>Bane</i> effects"',
  'Eternal Blessing':
    'Section=magic ' +
    'Note="R15\' Surrounded by continuous level %{level//2} <i>Bless</i> effects"',
  'Resurrectionist':
    'Section=magic ' +
    'Note="Restoring Hit Points to a dying or dead target also gives fast healing 5 for 1 min"',
  'Domain Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  'Echoing Channel':
    'Section=magic ' +
    'Note="May have a 2-action harm or heal spell also cause 1-action effects on an adjacent creature"',
  'Improved Swift Banishment':
    'Section=magic ' +
    'Note="May sacrifice a 5th level or higher prepared spell to inflict Swift Banishment with a -2 save penalty"',
  "Avatar's Audience":
    'Section=magic ' +
    'Note="May speak for deity, <i>Commune</i> without cost, and <i>Plane Shift</i> to deity 1/day"',
  'Maker Of Miracles':'Section=magic Note="+1 10th level spell slot"',
  'Metamagic Channel':
    'Section=magic ' +
    'Note="May freely apply 1 metamagic action to harm and heal spells"',

  // Druid
  // Alertness as above
  'Animal Order':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has Animal Companion feature",' +
      '"Knows the <i>Heal Animal</i> spell",' +
      '"Skill Trained (Athletics)"',
  'Druid Feats':'Section=feature Note="%V selections"',
  'Druid Skills':
    'Section=skill Note="Skill Trained (Nature; Choose %V from any)"',
  'Druidic Language':'Section=skill Note="Knows a druid-specific language"',
  // TODO more to it than this
  'Druidic Order':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a Focus Pool with 1 Focus Point"',
  'Druid Weapon Expertise':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  // Expert Spellcaster as above
  // Great Fortitude as above
  'Leaf Order':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has Leshy Familiar feature",' +
      '"Knows the <i>Goodberry</i> spell/+1 Focus Points",' +
      '"Skill Trained (Diplomacy)"',
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Master Spellcaster as above
  // Medium Armor Expertise as above
  'Primal Hierophant':'Section=magic Note="Has 1 10th-level spell slot"',
  'Primal Spellcasting':
    'Section=magic Note="May learn spells from the Primal tradition"',
  // Resolve as above
  // Shield Block as below
  'Storm Order':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has Storm Born feature",' +
      '"Knows the <i>Tempest Surge</i> spell/+1 Focus Points",' +
      '"Skill Trained (Acrobatics)"',
  // Weapon Specialization as above
  'Wild Order':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has Wild Shape feature",' +
      '"Knows the <i>Wild Morph</i> spell",' +
      '"Skill Trained (Intimidation)"',
  'Wild Empathy':
    'Section=skill ' +
    'Note="May use Diplomacy with animals to Make an Impression and to make simple Requests"',

  'Animal Companion':'Section=feature Note="Has a young animal companion%{$\'features.Hunt Prey\'?\' that gains Hunt Prey and Flurry, Precision, or Outwit effects\':\'\'}"',
  'Leshy Familiar':'Section=feature Note="Has a Tiny plant or fungus familiar"',
  // Reach Spell as above
  'Storm Born':
    'Section=magic,skill ' +
    'Note=' +
      '"Suffers no ranged spell penalties from weather",' +
      '"Suffers no Perception penalties from weather"',
  'Widen Spell':
    'Section=magic ' +
    'Note="May increase the effect of a 10\' or greater radius area spell by 5\', the effect of a 15\' or shorter line or cone spell by 5\', and the effect of a longer line or cone spell by 10\'"',
  'Wild Shape':'Section=magic Note="Knows the <i>Wild Shape</i> spell"',
  'Call Of The Wild':
    'Section=magic ' +
    'Note="May spend 10 min to replace a prepared spell with <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> of the same level"',
  'Enhanced Familiar':
    'Section=feature Note="May select 4 familiar or master abilities each day"',
  'Order Explorer (Animal Order)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Animal Order feats"',
  'Order Explorer (Leaf Order)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Leaf Order feats"',
  'Order Explorer (Storm Order)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Storm Order feats"',
  'Order Explorer (Wild Order)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Wild Order feats"',
  // Poison Resistance as above
  'Form Control':
    'Section=magic ' +
    'Note="May cast <i>Wild Shape</i> 2 levels lower to retain shape for up to 1 hour"',
  'Mature Animal Companion':
    'Section=feature ' +
    'Note="Animal Companion is a mature companion and may Stride or Strike without a command"',
  'Order Magic (Animal Order)':
    'Section=magic Note="Knows the <i>Heal Animal</i> spell"',
  'Order Magic (Leaf Order)':
    'Section=magic Note="Knows the <i>Goodberry</i> spell"',
  'Order Magic (Storm Order)':
    'Section=magic Note="Knows the <i>Tempest Surge</i> spell"',
  'Order Magic (Wild Order)':
    'Section=magic Note="Knows the <i>Wild Morph</i> spell"',
  'Thousand Faces':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Small or Medium Humanoid"',
  'Woodland Stride':
    'Section=ability ' +
    'Note="May move normally over difficult terrain caused by plants or fungi"',
  'Green Empathy':
    'Section=skill ' +
    'Note="May use Diplomacy with plants and fungi to Make an Impression and (at +2) to make simple Requests"',
  'Insect Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Medium insect; flightless forms last 24 hour"',
  // Steady Spellcasting as above
  'Storm Retribution':
    'Section=combat Note="May use a Reaction on a foe critical melee hit to push foe 5\' (Ref neg; critical failure pushes 10\')"',
  'Ferocious Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Large dinosaur and gain +1 on Athletics checks"',
  'Fey Caller':
    'Section=magic ' +
    'Note="Knows the <i>Illusory Disguise</i>, <i>Illusory Object</i>, <i>Illusory Scene</i>, and <i>Veil</i> primal spells"',
  'Incredible Companion':
    'Section=feature ' +
    'Note="Animal Companion gains choice of nimble or savage characteristics"',
  'Soaring Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a %{$\'features.Insect Shape\'?\'wasp, \':\'\'}%{$\'features.Ferocious Shape\'?\'pterosaur, \':\'\'}bat or bird and gain +1 on Athletics checks"',
  'Wind Caller':
    'Section=magic ' +
    'Note="Knows the <i>Stormwind Flight</i> spell/+1 Focus Points"',
  'Elemental Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Medium elemental and gain resistance 5 to fire"',
  'Healing Transformation':
    'Section=magic ' +
    'Note="Self polymorph spells restore 1d6 Hit Points/spell level"',
  'Overwhelming Energy':
    'Section=magic ' +
    'Note="May have spells ignore resistance %{level} to choice of energy"',
  'Plant Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Large plant and gain resistance 5 to poison"',
  'Side By Side':
    'Section=combat ' +
    'Note="Self and companion automatically flank a foe adjacent to both"',
  'Dragon Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Large dragon and gain resistance 5 to choice of acid, cold, electricity, fire, or poison"',
  'Green Tongue':
    'Section=magic ' +
    'Note="Self and any leshy familiar have continuous <i>Speak With Plants</i> effects"',
  'Primal Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Primal Summons':
    'Section=magic,magic ' +
    'Note=' +
      '"Knows the <i>Primal Summons</i> spell",' +
      '"Summoned creatures gain choice of air, earth, fire, or water elemental power"',
  'Specialized Companion':
    'Section=feature Note="Animal Companion has choice of specialization"',
  'Timeless Nature':
    'Section=feature,save ' +
    'Note=' +
      '"Does not age",' +
      '"+2 saves vs. disease and primal magic"',
  'Verdant Metamorphosis':
    'Section=combat,combat,feature,magic ' +
    'Note=' +
      '"Has Armor Class 30",' +
      '"10 min in sunlight restores half Hit Points; daily rest restores all Hit Points and removes non-permanent conditions, poisons, and diseases",' +
      '"Has plant, not humanoid, trait",' +
      '"Has continuous <i>Tree Shape</i> effects"',
  // Effortless Concentration as above
  'Impaling Briars':
    'Section=magic ' +
    'Note="Knows the <i>Impaling Briars</i> spell/+1 Focus Points"',
  'Monstrosity Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a %{$\'features.Soaring Shape\'?\'phoenix, \':\'\'}purple worm or sea serpent"',
  'Invoke Disaster':
    'Section=magic Note="Knows the <i>Storm Lord</i> spell/+1 Focus Points"',
  'Perfect Form Control':
    'Section=magic ' +
    'Note="May cast <i>Wild Shape</i> 2 levels lower to retain shape permanently"',
  'Primal Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  "Hierophant's Power":'Section=magic Note="+1 10th level spell slot"',
  'Leyline Conduit':
    'Section=magic ' +
    'Note="May cast instantaneous spells of 5th level and lower without expending a spell slot"',
  'True Shapeshifter':
    'Section=magic ' +
    'Note="May change shapes during <i>Wild Shape</i>/May <i>Wild Shape</i> into a kaiju%{$\'features.Plant Shape\'?\' or green man\':\'\'} 1/day"',

  // Fighter
  // Armor Expertise as above
  // Armor Mastery as above
  // Attack Of Opportunity as above
  'Battlefield Surveyor':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Perception for Initiative",' +
      '"Perception Master"',
  'Bravery':
    'Section=save,save ' +
    'Note=' +
      '"Save Expert (Will)",' +
      '"Successes on Will saves vs. fear are critical saves/Reduce value of frightened condition by 1"',
  'Combat Flexibility':
    'Section=combat ' +
    'Note="May use chosen fighter feat of up to 8th level %{$\'features.Improved Flexibility\'?\' and chosen fighter feat of up to 14th level\':\'\'} each day"',
  // Evasion as above
  'Fighter Expertise':'Section=feature Note="Class Expert (Fighter)"',
  'Fighter Feats':'Section=feature Note="%V selections"',
  'Fighter Skills':
    'Section=skill ' +
    'Note="Skill Trained (Choose 1 from Acrobatics, Athletics; Choose %V from any)"',
  'Fighter Weapon Mastery':
    'Section=combat ' +
    'Note="Attack Master with common weapons and Attack Expert with advanced weapons of chosen group/May use critical specialization effects of all weapons with master proficiency"',
  // Greater Weapon Specialization as above
  'Improved Flexibility':
    'Section=combat Note="Increased Combat Flexibility effects"',
  // Juggernaut as above
  // Shield Block as below
  'Versatile Legend':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Master (Advanced Weapons)/Class Master (Fighter)"',
  'Weapon Legend':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Expert (Advanced Weapons)",' +
      '"Attack Legendary in common weapons and Attack Master in advanced weapons of chosen group"',

  // Weapon Specialization as above
  'Double Slice':
    'Section=combat Note="May attack with two weapons simultaneously"',
  'Exacting Strike':
    'Section=combat ' +
    'Note="Failed attack does not count toward multi-attack penalty"',
  'Point-Blank Shot':
    'Section=combat ' +
    'Note="Stance negates volley penalty from a ranged volley weapon and gives +2 attack at close range with a ranged non-volley weapon"',
  'Power Attack':
    'Section=combat ' +
    'Note="May use 2 actions for a melee Strike that inflicts %{level<10?1:level<18?2:3} extra dice damage and counts as two Strikes for multi-attack penalty"',
  'Reactive Shield':
    'Section=combat Note="May use a Reaction to make a Raise a Shield action"',
  'Snagging Strike':
    'Section=combat ' +
    'Note="Successful Strike inflicts flat-footed on target for 1 rd"',
  // Sudden Charge as above
  'Aggressive Block':
    'Section=combat ' +
    'Note="May use Shield Block to move foe 5\' or cause it to become flat-footed (foe\'s choice)"',
  'Assisting Shot':
    'Section=combat ' +
    'Note="Successful ranged Strike gives next ally attack on foe +1 attack (critical success +2)"',
  'Brutish Shove':
    'Section=combat ' +
    'Note="Two-handed Strike inflicts flat-footed until end of turn; success allows subsequent Shove"',
  'Combat Grab':
    'Section=combat ' +
    'Note="Successful Strike allows grabbing foe with free hand for 1 rd or until foe Escapes"',
  'Dueling Parry':
    'Section=combat ' +
    'Note="+2 AC when wielding a one-handed weapon with a hand free"',
  'Intimidating Strike':
    'Section=combat ' +
    'Note="Successful Strike inflicts frightened 1 (critical hit frightened 2)"',
  'Lunge':'Section=combat Note="May make a +5\' Strike"',
  'Double Shot':
    'Section=combat Note="May make two ranged Strikes against two foes, suffering a -2 attack penalty on each"',
  'Dual-Handed Assault':
    'Section=combat ' +
    'Note="Increases damage from 2-handed weapon by number of damage dice and other weapon by one step"',
  'Knockdown':
    'Section=combat ' +
    'Note="May follow a successful Strike with an Athletics check to Trip"',
  'Powerful Shove':
    'Section=combat ' +
    'Note="May use Aggressive Block and Brutish Shove on foes two sizes larger/Shoved creatures take %{strengthModifier>?1} damage from hitting an object"',
  'Quick Reversal':
    'Section=combat Note="May use an attack to Strike two flanking foes"',
  'Shielded Stride':
    'Section=combat ' +
    'Note="May Stride with shield raised at half Speed without triggering Reactions"',
  // Swipe as above
  'Twin Parry':
    'Section=combat ' +
    'Note="May parry with two weapons to gain +1 AC for 1 rd (+2 AC with weapon parry trait)"',
  'Advanced Weapon Training':
    'Section=combat ' +
    'Note="Has proficiency with advanced weapons in chosen group equal to martial weapons"',
  'Advantageous Assault':
    'Section=combat ' +
    'Note="Strike on grabbed, prone, or restrained foe inflicts +damage dice HP damage (+damage dice + 2 HP if wielded two-handed), even on failure"',
  'Disarming Stance':
    'Section=combat ' +
    'Note="Stance gives +1 to Disarm and +2 vs. Disarm when wielding a one-handed weapon with the other hand free and allows Disarming foes two sizes larger"',
  'Furious Focus':
    'Section=combat ' +
    'Note="Two-handed power attacks count as single attacks for multi-attack penalty"',
  "Guardian's Deflection":
    'Section=combat Note="May use a Reaction to give adjacent ally +2 AC"',
  'Reflexive Shield':
    'Section=save Note="Raised shield adds shield bonus to Reflex saves"',
  'Revealing Stab':
    'Section=combat ' +
    'Note="May leave a piercing weapon embedded in a corporeal concealed or hidden foe to reveal it to others"',
  'Shatter Defenses':
    'Section=combat ' +
    'Note="A successful Strike vs. a frightened foe inflicts flat-footed while frightened condition lasts"',
  // Shield Warden as above
  'Triple Shot':
    'Section=combat ' +
    'Note="May use Double Shot against a single foe/May use 2 actions to make 3 ranged Strikes against a single foe, suffering a -4 attack penalty on each"',
  'Blind-Fight':
    'Section=combat ' +
    'Note="May attack concealed foes without a prior check and hidden creatures with a DC 5 check/Does not suffer flat-footed with hidden foes"',
  'Dueling Riposte':
    'Section=combat ' +
    'Note="May use a Reaction to Strike or Disarm a foe who critically fails an attack on self"',
  'Felling Strike':
    'Section=combat ' +
    'Note="May use 2 actions to attack a flying foe; a successful Strike causes it to fall 120\', and a critical hit grounds it for 1 rd"',
  'Incredible Aim':
    'Section=combat ' +
    'Note="May use 2 actions to gain +2 on a ranged attack that ignores concealment"',
  'Mobile Shot Stance':
    'Section=combat ' +
    'Note="Stance negates Reactions from Ranged Strikes and allows Attack Of Opportunity with a loaded ranged weapon on an adjacent creature"',
  'Positioning Assault':
    'Section=combat ' +
    'Note="May use 2 actions to move target 5\' to within reach with a successful Strike"',
  // Quick Shield Block as above
  // Sudden Leap as above
  'Agile Grace':
    'Section=combat ' +
    'Note="Reduces multi-attack penalty with agile weapons to -3/-6"',
  'Certain Strike':
    'Section=combat ' +
    'Note="Failed Strikes inflict normal damage other than damage dice"',
  'Combat Reflexes':
    'Section=combat ' +
    'Note="May use an additional Reaction to make an Attack Of Opportunity 1/tn"',
  'Debilitating Shot':
     'Section=combat ' +
     'Note="May use 2 actions to make a ranged attack that slows target for 1 rd"',
  'Disarming Twist':
    'Section=combat ' +
    'Note="A successful Strike with a one-handed melee weapon and the other hand free inflicts Disarm; failure inflicts flat-footed until the end of tn"',
  'Disruptive Stance':
    'Section=combat ' +
    'Note="Stance allows Attack Of Opportunity in response to a concentrate action; any successful Strike disrupts"',
  'Fearsome Brute':
    'Section=combat ' +
    'Note="Strikes against frightened foes inflict +frighted value x %{rank.Intimidation>=2?3:2} HP damage"',
  'Improved Knockdown':
    'Section=combat Note="May use Knockdown without a Trip check"',
  'Mirror Shield':
    'Section=combat ' +
    'Note="May use a Reaction to reflect a spell back upon caster with a ranged Strike or spell attack"',
  'Twin Riposte':
    'Section=combat ' +
    'Note="May use a Reaction to Strike or Disarm a foe who critically fails a Strike on self"',
  'Brutal Finish':
    'Section=combat ' +
    'Note="May end turn with a two-handed Strike that inflicts +%{level>=18?2:1} damage dice, even on a failure"',
  'Dueling Dance':
    'Section=combat ' +
    'Note="Stance gives +2 AC when wielding a one-handed weapon with a hand free"',
  'Flinging Shove':'Section=combat Note="Aggressive Block moves foe 10\' (critical success 20\') or inflicts flat-footed; Brutish Shove moves foe 10\' (failure 5\', critical success 20\')"',
  'Improved Dueling Riposte':
    'Section=combat ' +
    'Note="May use an additional Reaction to make a Dueling Riposte 1/tn"',
  'Incredible Ricochet':
    'Section=combat ' +
    'Note="Second ranged attack in turn against the same foe ignores concealment and cover"',
  'Lunging Stance':
    'Section=combat Note="Stance gives +5\' reach on Attacks Of Opportunity"',
  "Paragon's Guard":
    'Section=combat Note="Stance gives continuous benefits of Raise a Shield"',
  'Spring Attack':
    'Section=combat Note="May Strike a foe after Striding away from another"',
  'Desperate Finisher':
    'Section=combat ' +
    'Note="May use a press action as a Reaction, foregoing any further Reactions this turn"',
  'Determination':
    'Section=save ' +
    'Note="May end a nonpermanent spell (level %{level/2} Will save) or condition affecting self 1/day"',
  'Guiding Finish':
    'Section=combat ' +
    'Note="May move target 10\' within reach with a successful Strike (failure 5\') when wielding a one-handed weapon with a hand free"',
  'Guiding Riposte':
    'Section=combat ' +
    'Note="May move target 10\' within reach with a successful Dueling Riposte Strike"',
  'Improved Twin Riposte':
    'Section=combat ' +
    'Note="May use an additional Reaction to make a Twin Riposte 1/tn"',
  'Stance Savant':'Section=combat Note="May enter a stance during initiative"',
  'Two-Weapon Flurry':
    'Section=combat Note="May Strike with two weapons simultaneously"',
  // Whirlwind Strike as above
  'Graceful Poise':
    'Section=combat ' +
    'Note="Stance allows Double Slice with an agile weapon to count as one attack"',
  'Improved Reflexive Shield':
    'Section=combat ' +
    'Note="May use Shield Block to protect both self and adjacent allies"',
  'Multishot Stance':
    'Section=combat ' +
    'Note="Stance reduces Double Shot/Triple Shot penalty to -1/-2"',
  'Twinned Defense':
    'Section=combat Note="Stance gives continuous benefits of Twin Parry"',
  'Impossible Volley':
    'Section=combat ' +
    'Note="May use 3 actions to make a -2 ranged Strike against all foes in a 10\' radius"',
  'Savage Critical':
    'Section=combat ' +
    'Note="Successful rolls of 19 with a legendary weapon are critical successes"',
  'Boundless Reprisals':
     'Section=combat ' +
     'Note="May use an additional Reaction to use a fighter feat or class feature 1/foe turn"',
  'Weapon Supremacy':
    'Section=combat ' +
    'Note="Permanently quickened; may use additional actions only to Strike"',

  // Monk
  'Adamantine Strikes':
    'Section=combat Note="Unarmed attacks count as adamantine"',
  // Alertness as above
  'Expert Strikes':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  'Flurry Of Blows':
    'Section=combat Note="May use 1 action to make 2 unarmed Strikes 1/tn"',
  'Graceful Legend':
    'Section=combat,magic ' +
    'Note=' +
      '"Defense Legendary (Unarmored Defense)/Class Master (Monk)",' +
      '"Spell Master (%V)"',
  'Graceful Mastery':'Section=combat Note="Defense Master (Unarmored Defense)"',
  // Greater Weapon Specialization as above
  'Incredible Movement':'Section=ability Note="+%V Speed in no armor"',
  'Ki Tradition':'Section=feature Note="1 selection"',
  'Ki Tradition (Divine)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      '"May learn spells from the Divine tradition"',
  'Ki Tradition (Occult)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      '"May learn spells from the Occult tradition"',
  'Master Strikes':
    'Section=combat Note="Attack Master (Simple Weapons; Unarmed Attacks)"',
  'Metal Strikes':
    'Section=combat Note="Unarmed attacks count as cold iron and silver"',
  'Monk Expertise':
    'Section=combat,magic ' +
    'Note=' +
      '"Class Expert (Monk)",' +
      '"Spell Expert (%V)"',
  'Monk Feats':'Section=feature Note="%V selections"',
  'Monk Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Mystic Strikes':'Section=combat Note="Unarmed attacks count as magical"',
  'Path To Perfection':'Section=feature Note="%V selections"',
  'Path To Perfection (Fortitude)':
     'Section=save,save ' +
     'Note=' +
       '"Save Master (Fortitude)",' +
       '"Successes on Fortitude saves are critical successes"',
  'Path To Perfection (Reflex)':
     'Section=save,save ' +
     'Note=' +
       '"Save Master (Reflex)",' +
       '"Successes on Reflex saves are critical successes"',
  'Path To Perfection (Will)':
     'Section=save,save ' +
     'Note=' +
       '"Save Master (Will)",' +
       '"Successes on Will saves are critical successes"',
  'Perfected Form':
    'Section=combat ' +
    'Note="Rolls of less than 10 on first Strike each tn are treated as 10s"',
  'Powerful Fist':
    'Section=combat,combat ' +
    'Note=' +
      '"Fists inflict 1d6 HP damage",' +
      '"Suffers no attack penalty for inflicting lethal damage with unarmed attacks"',
  // Weapon Specialization as above

  'Crane Stance':
    'Section=combat,skill ' +
    'Note=' +
      '"Unarmored stance gives +1 Armor Class and restricts attacks to 1d6B HP unarmed hand attacks",' +
      '"Unarmored stance gives -5 jump DC and +2\'/+5\' vertical/horizontal Leap"',
  'Dragon Stance':
    'Section=combat ' +
    'Note="Unarmored stance allows leg attacks that inflict 1d10B HP and ignoring first square of difficult terrain when Striding"',
  'Ki Rush':
    'Section=magic ' +
    'Note="Knows the <i>Ki Rush</i> spell/Has a Focus Pool with 1 Focus Point"',
  'Ki Strike':
    'Section=magic ' +
    'Note="Knows the <i>Ki Strike</i> spell/Has a Focus Pool with 1 Focus Point"',
  'Monastic Weaponry':'Section=combat Note="Weapon %V (Monk Weapons)"',
  'Mountain Stance':
    'Section=combat ' +
    'Note="Unarmored stance gives +%{4-(dexterityModifier-(combatNotes.mountainQuake?2:combatNotes.mountainStronghold?1:0)>?0)} Armor Class, +2 vs. Shove and Trip, and -5 Speed and restricts attacks to 1d8B HP unarmed hand attacks"',
  'Tiger Stance':
    'Section=combat ' +
    'Note="Unarmored stance allows 10\' Steps and unarmed hand attacks that inflict 1d8S HP, plus 1d4 HP persistent bleed damage on critical success"',
  'Wolf Stance':
    'Section=combat ' +
    'Note="Unarmored stance allows unarmed hand attacks that inflict 1d8P HP, with the trip trait when flanking"',
  'Brawling Focus':
    'Section=combat ' +
    'Note="May use the critical specialization effects of trained monk weapons and brawling weapons"',
  'Crushing Grab':
    'Section=combat ' +
    'Note="May inflict %{strengthModifier}B HP, lethal or non-lethal, with a successful Grapple"',
  'Dancing Leaf':
    'Section=skill ' +
    'Note="+5\' Jump and Leap/Takes no damage from falling when adjacent to a wall"',
  'Elemental Fist':
    'Section=magic ' +
    'Note="May inflict electricity, bludgeoning, fire, or cold damage with <i>Ki Strike</i>"',
  'Stunning Fist':
    'Section=combat ' +
    'Note="May inflict stunned 1 with a successful Flurry Of Blows (DC %{classDifficultyClass.Monk} Fortitude neg; critical failure inflicts stunned 3)"',
  'Deflect Arrow':
    'Section=combat ' +
    'Note="May use a Reaction to gain +4 Armor Class vs. a physical ranged attack"',
  'Flurry Of Maneuvers':
    'Section=combat ' +
    'Note="May use Flurry Of Blows to Grapple, Shove, or Trip"',
  'Flying Kick':
    'Section=combat ' +
    'Note="May use 2 actions to Strike a foe at the end of a Leap or Jump"',
  'Guarded Movement':
    'Section=combat Note="+4 Armor Class vs. movement reactions"',
  'Stand Still':
    'Section=combat Note="May use a Reaction to Strike an adjacent moving foe"',
  'Wholeness Of Body':
    'Section=magic ' +
    'Note="Knows the <i>Wholeness Of Body</i> spell/+1 Focus Points"',
  'Abundant Step':
    'Section=magic Note="Knows the <i>Abundant Step</i> spell/+1 Focus Points"',
  'Crane Flutter':
    'Section=combat ' +
    'Note="While in Crane Stance, may use a Reaction to gain +3 Armor Class; a missed melee attack allows an immediate -2 Strike"',
  'Dragon Roar':
    'Section=combat ' +
    'Note="R15\' Bellowing while in Dragon Stance inflicts frightened 1 on foes 1/1d4 rd (DC %{skillModifiers.Intimidation} Will neg; critical failure inflicts frightened 2); first successful attack in the next rd on a frightened foe inflicts +4 HP"',
  'Ki Blast':
    'Section=magic Note="Knows the <i>Ki Blast</i> spell/+1 Focus Points"',
  'Mountain Stronghold':
    'Section=combat ' +
    'Note="While in Mountain Stance, may gain +2 Armor Class for 1 rd"',
  'Tiger Slash':
    'Section=combat ' +
    'Note="While in Tiger Stance, may use 2 actions to inflict +%{level>14?3:2} damage dice and a 5\' push; critical success inflicts +%{strengthModifier} HP persistent bleed damage"',
  'Water Step':'Section=ability Note="May Stride across liquids"',
  'Whirling Throw':
    'Section=combat ' +
    'Note="A successful Athletics vs. a grabbed or restrained foe\'s Fortitude DC allows throwing it %{10+5*strengthModifier}\'"',
  'Wolf Drag':
    'Section=combat ' +
    'Note="While in Wolf Stance, may use 2 actions to inflict d12P HP and knocked prone"',
  'Arrow Snatching':
    'Section=combat ' +
    'Note="After a successful Deflect Arrow, may use the projectile to make an immediate ranged Strike"',
  'Ironblood Stance':
    'Section=combat ' +
    'Note="Unarmored stance allows unarmed attacks that inflict 1d8B HP and gives resistance %V to all damage"',
  'Mixed Maneuver':
    'Section=combat ' +
    'Note="May use 2 actions to attempt 2 choices of Grapple, Shove, and Trip simultaneously"',
  'Tangled Forest Stance':
    'Section=combat ' +
    'Note="Unarmored stance allows unarmed attacks that inflict 1d8S HP and prevents foes from moving away (DC %{classDifficultyClass.Monk} Reflex, Acrobatics, or Athletics neg)"',
  'Wall Run':'Section=ability Note="May Stride on vertical surfaces"',
  'Wild Winds Initiate':
    'Section=magic ' +
    'Note="Knows the <i>Wild Winds Stance</i> spell/+1 Focus Points"',
  'Knockback Strike':
    'Section=combat ' +
    'Note="May use 2 actions to Shove 5\' with a successful unarmed attack"',
  'Sleeper Hold':
    'Section=combat ' +
    'Note="A successful Grapple allows inflicting clumsy 1 for 1 tn (critical success inflicts unconscious for 1 min)"',
  'Wind Jump':
    'Section=magic Note="Knows the <i>Wind Jump</i> spell/+1 Focus Points"',
  'Winding Flow':
    'Section=combat ' +
    'Note="May use 1 action to perform 2 choices of Stand, Step, and Stride"',
  'Diamond Soul':'Section=save Note="+1 vs. magic"',
  'Disrupt Ki':
    'Section=combat ' +
    'Note="May use 2 actions to inflict %{level<18?2:3}d6 HP persistent negative damage and enfeebled 1 with an unarmed Strike"',
  'Improved Knockback':
    'Section=combat ' +
    'Note="Successful Shove moves 5\' (critical success 10\') and allows following; pushing into an obstacle inflicts %{strengthModifier+(rank.Athletics>3?8:6)}B HP"',
  'Meditative Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Stance Savant as above
  'Ironblood Surge':
    'Section=combat,combat ' +
    'Note=' +
      '"Ironblood Stance resistance increases to %V",' +
      '"When in Ironblood Stance, may gain +1 Armor Class for 1 rd"',
  'Mountain Quake':
    'Section=combat ' +
    'Note="R20\' Stomp inflicts %{strengthModifier>?0} HP and fall prone (DC %{classDifficultyClass.Monk} Fort HP only) 1/1d4 rd"',
  'Tangled Forest Rake':
    'Section=combat ' +
    'Note="May move target 5\' into a space within reach with a successful Tangled Forest Stance Strike"',
  'Timeless Body':
    'Section=feature,save ' +
    'Note=' +
      '"Does not age",' +
      '"+2 vs. poisons and diseases/Resistance %{level//2} to poison damage"',
  'Tongue Of Sun And Moon':
    'Section=skill Note="Can speak and understand all spoken languages"',
  'Wild Winds Gust':
    'Section=combat ' +
    'Note="May use 2 actions to make a Wild Winds Stance Strike against all creatures in a 30\' cone or 60\' line"',
  'Enlightened Presence':
    'Section=save Note="R15\' Self and allies gain +2 Will vs. mental effects"',
  'Master Of Many Styles':
    'Section=combat ' +
    'Note="May enter a stance at the beginning of a turn as a free action"',
  'Quivering Palm':
    'Section=magic ' +
    'Note="Knows the <i>Quivering Palm</i> spell/+1 Focus Points"',
  'Shattering Strike':
    'Section=combat ' +
    'Note="May use 2 actions for an unarmed Strike that bypasses target resistances and ignores half of target\'s Hardness"',
  'Diamond Fists':
    'Section=combat ' +
    'Note="Unarmed attacks gain the forceful trait or increase damage by 1 die step"',
  'Empty Body':
    'Section=magic Note="Knows the <i>Empty Body</i> spell/+1 Focus Points"',
  'Meditative Wellspring':
    'Section=magic Note="Refocus restores 3 Focus Points"',
  'Swift River':
    'Section=combat ' +
    'Note="May end one speed status penalty or condition at end of each turn as a free action"',
  'Enduring Quickness':
    'Section=combat ' +
    'Note="May use an additional action each rd to Stride, Leap, or Jump"',
  'Fuse Stance':
    'Section=combat ' +
    'Note="Has merged two known stances into a unique new stance that grants the effects of both"',
  'Impossible Technique':
    'Section=combat ' +
    'Note="May use a Reaction to force a foe reroll on a hit or to gain a reroll on a failed save"',

  // Ranger
  // Evasion as above
  // Greater Weapon Specialization as above
  'Hunt Prey':
    'Section=skill ' +
    'Note="+2 Perception to Seek and +2 Survival to Track designated creature"',
  "Hunter's Edge":'Section=feature Note="1 selection"',
  'Flurry':
    'Section=combat ' +
    'Note="Reduces penalty for second/third attack on a Hunt Prey target to -3/-6 (-2/-4 with an agile weapon)"',
  'Outwit':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 Armor Class vs. a Hunt Prey target",' +
      '"+2 Deception, Intimidation, Stealth, and Recall Knowledge checks with a Hunt Prey target"',
  'Precision':
    'Section=combat ' +
    'Note="First hit on a Hunt Prey target inflicts +%{level<11?1:level<19?2:3}d8 HP precision damage each rd"',
  'Improved Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Reflex)",' +
      '"Critical failures on Reflex saves are normal failures/Suffers half normal damage from failed Reflex saves"',
  'Incredible Senses':'Section=skill Note="Perception Legendary"',
  // Iron Will as above
  // Juggernaut as above
  'Masterful Hunter':
    'Section=combat,combat,skill,skill ' +
    'Note=' +
      '"Class Master (Ranger)",' +
      '"No range penalty when attacking a Hunt Prey target in the 2nd or 3rd range increment of a ranged weapon with master proficiency",' +
      '"+4 Perception to Seek a Hunt Prey target",' +
      '"+4 Survival to Track a Hunt Prey target"',
      // TODO increased Hunter's Prey effects
  // Medium Armor Expertise as above
  "Nature's Edge":
    'Section=combat ' +
    'Note="Foes suffer flat-footed vs. self in in natural and snare-imposed difficult terrain"',
  'Ranger Expertise':'Section=combat Note="Class Expert (Ranger)"',
  'Ranger Feats':'Section=feature Note="%V selections"',
  'Ranger Skills':
    'Section=skill Note="Skill Trained (Nature; Survival; Choose %V from any)"',
  'Ranger Weapon Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"May use critical specialization effects of unarmed attacks and simple and martial weapons when attacking a Hunt Prey target"',
  'Second Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Master (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"May rest normally in light or medium armor"',
  'Swift Prey':
    'Section=combat ' +
    'Note="May use Hunt Prey as a free action at the beginning of each rd"',
  'Trackless Step':
    'Section=skill ' +
    'Note="Has the benefits of the Cover Tracks action while moving at full Speed in natural terrain"',
  // Vigilant Senses as above
  'Wild Stride':
    'Section=ability ' +
    'Note="May move normally over non-magical difficult terrain"',
  // Weapon Mastery as above
  // Weapon Specialization as above

  // Animal Companion as above
  'Crossbow Ace':
    'Section=combat ' +
    'Note="Crossbow inflicts +2 HP damage on a Hunt Prey target or immediately after reloading; simple crossbow also increases damage die by 1 step"',
  'Hunted Shot':
    'Section=combat ' +
    'Note="May use 1 action to make two ranged Strikes against a Hunt Prey target 1/rd"',
  'Monster Hunter':
    'Section=combat ' +
    'Note="May attempt to Recall Knowledge as part of Hunt Prey action; critical success gives +%V attack to self and allies for 1 rd"',
  'Twin Takedown':
    'Section=combat ' +
    'Note="May use 1 action to make a melee Strike with each hand against a Hunt Prey target 1/rd"',
  'Favored Terrain (Aquatic)':
    'Section=ability ' +
    'Note="May move normally through underwater difficult terrain/%{speed}\' swim Speed"',
  'Favored Terrain (Arctic)':
    'Section=ability,feature ' +
    'Note=' +
      '"May move normally over icy or snowy difficult terrain without a need to Balance",' +
      '"Can survive on 1/10 normal food and water"',
  'Favored Terrain (Desert)':
    'Section=ability,feature ' +
    'Note=' +
      '"May move normally over sandy difficult terrain without a need to Balance",' +
      '"Can survive on 1/10 normal food and water"',
  'Favored Terrain (Forest)':
    'Section=ability ' +
    'Note="May move normally over forested difficult terrain/%{speed}\' climb Speed"',
  'Favored Terrain (Mountain)':
    'Section=ability ' +
    'Note="May move normally over mountainous difficult terrain/%{speed}\' climb Speed"',
  'Favored Terrain (Plains)':
    'Section=ability,ability ' +
    'Note=' +
      '"+10 Speed",' +
      '"May move normally over difficult terrain in plains"',
  'Favored Terrain (Sky)':
    'Section=ability ' +
    'Note="May move normally through difficult terrain in the sky/%{speed}\' fly Speed"',
  'Favored Terrain (Swamp)':
    'Section=ability ' +
    'Note="May move normally over boggy greater difficult terrain"',
  'Favored Terrain (Underground)':
    'Section=ability ' +
    'Note="May move normally over underground difficult terrain/%{speed}\' climb Speed"',
  "Hunter's Aim":
    'Section=combat ' +
    'Note="May use 2 actions to gain +2 attack and ignore concealment of a Hunt Prey target"',
  'Monster Warden':
    'Section=combat ' +
    'Note="Successful use of Monster Hunter also gives self and allies +%V Armor Class on next attack and +%V on next save vs. a Hunt Prey target"',
  'Quick Draw':
    'Section=combat Note="May use 1 action to draw a weapon and Strike"',
  // Wild Empathy as above
  "Companion's Cry":
    'Section=combat ' +
    'Note="May use 2 actions for Command an Animal to give companion an additional action"',
  'Disrupt Prey':
    'Section=combat ' +
    'Note="May use a Reaction to to make a Strike on a Hunt Prey target; critical success disrupts its action"',
  'Far Shot':'Section=combat Note="Doubles ranged weapon increments"',
  'Favored Enemy':
    'Section=combat ' +
    'Note="May use Hunt Prey with chosen creature type as a free action during initiative"',
  'Running Reload':
    'Section=combat Note="May Reload during Stride, Step, and Sneak"',
  "Scout's Warning":'Section=combat Note="May give allies +1 initiative"',
  'Snare Specialist':
    'Section=skill ' +
    'Note="Knows the formulas for %{rank.Crafting<3?3:rank.Crafting<4?6:9} snares; may prepare %V each day"',
  // Twin Parry as above
  // Mature Animal Companion as above
  'Quick Snares':'Section=skill Note="May prepare snares with 3 actions"',
  'Skirmish Strike':'Section=combat Note="May use 1 action to Step and Strike"',
  'Snap Shot':
    'Section=combat ' +
    'Note="May use a ranged weapon during a Reaction to Strike an adjacent creature"',
  'Swift Tracker':'Section=skill Note="May Track at full Speed"',
  // Blind-Fight as above
  'Deadly Aim':
    'Section=combat ' +
    'Note="May suffer -2 ranged Strike penalty vs. a Hunt Prey target to gain +%{level<11?4:level<15?6:8} HP damage"',
  'Hazard Finder':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 Armor Class vs. traps",' +
      '"+1 Perception to find traps; may find traps even when not searching"',
  'Powerful Snares':
    'Section=skill ' +
    'Note="Created snares have a DC of at least %{classDifficultyClass.Ranger}"',
  'Terrain Master':
    'Section=ability ' +
    'Note="May train for 1 hour to temporarily change favored terrain"',
  "Warden's Boon":
    'Section=combat Note="May share Hunt Prey benefits with an ally for 1 rd"',
  'Camouflage':
    'Section=skill Note="May Hide and Sneak in natural terrain without cover"',
  // Incredible Companion as above
  'Master Monster Hunter':
    'Section=combat,skill ' +
    'Note=' +
      '"Monster Hunter effects take effect on simple success",' +
      '"May use Nature to Recall Knowledge to identify any creature"',
  'Penetrating Shot':
    'Section=combat ' +
    'Note="May use 2 actions to Strike both a target and a creature giving it lesser cover"',
  // Twin Riposte as above
  "Warden's Step":
    'Section=skill ' +
    'Note="May include allies in an Avoid Notice action in natural terrain"',
  'Distracting Shot':
    'Section=combat ' +
    'Note="Critical or double hit on a Hunt Prey target inflicts flat-footed for 1 rd"',
  'Double Prey':'Section=combat Note="May use Hunt Prey on two targets"',
  'Lightning Snares':'Section=skill Note="May craft a trap with 1 action"',
  'Second Sting':
    'Section=combat ' +
    'Note="Failed Strike with a weapon in one hand inflicts non-dice damage of the weapon in the other"',
  // Side By Side as above
  'Sense The Unseen':
    'Section=skill ' +
    'Note="May use a Reaction on a failed Seek to make undetected foes hidden"',
  'Shared Prey':
    'Section=combat ' +
    'Note="May share with an ally the benefits of Hunt Prey and Flurry, Outwit, or Precision on a single target"',
  'Stealthy Companion':
    'Section=skill ' +
    'Note="Companion gains benefits of Camouflage; ambusher companion gains an increase in Stealth rank"',
  'Targeting Shot':
    'Section=combat ' +
    'Note="Ranged attack vs. a Hunt Prey target ignores cover and concealment"',
  "Warden's Guidance":
    'Section=skill ' +
    'Note="Failures and critical failures on Seek of a Hunt Prey target by self and allies are successes"',
  'Greater Distracting Shot':
    'Section=combat ' +
    'Note="Ranged hit on a Hunt Prey target inflicts flat-footed for 1 rd"',
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':
    'Section=combat Note="Increased Monster Hunter effects"',
  // Specialized Companion as above
  'Ubiquitous Snares':'Section=skill Note="Increased Snare Specialist effects"',
  'Impossible Flurry':
    'Section=combat ' +
    'Note="May use 3 actions to make 3 melee Strikes at the maximum multiple attack penalty"',
  // Impossible Volley as above
  'Manifold Edge':
    'Section=combat ' +
    'Note="May use a different hunter\'s edge benefit with Hunt Prey"',
  'Masterful Companion':
    'Section=combat ' +
    'Note="Companion gains Masterful Hunter effects vs. a Hunt Prey target"',
  'Perfect Shot':
    'Section=combat ' +
    'Note="May use 3 actions to inflict maximum damage with a ranged attack on a Hunt Prey target"',
  'Shadow Hunter':
    'Section=skill ' +
    'Note="Has continuous concealment from foes other than Hunt Prey targets in natural surroundings"',
  'Legendary Shot':'Section=combat Note="May ignore five range increments when attacking a Hunt Prey target with a master proficiency weapon"',
  'To The Ends Of The Earth':
    'Section=skill Note="May follow a Hunt Prey target across any distance"',
  'Triple Threat':
    'Section=feature ' +
    'Note="May use Hunt Prey with 3 targets, share two-target Hunt Prey with 1 ally, or share single-target Hunt Prey effects with 2 allies"',
  'Ultimate Skirmisher':
    'Section=ability,save ' +
    'Note=' +
      '"May move normally over difficult, greater difficult, and hazardous terrain",' +
      '"Never triggers movement-connected traps"',

  // Rogue
  'Debilitating Strike':
    'Section=combat ' +
    'Note="Successful Strike against a flat-footed foe inflicts choice of -10 Speed or enfeebled 1"',
  // Deny Advantage as above
  'Double Debilitation':
    'Section=combat ' +
    'Note="Debilitating Strike inflicts choice of two debilitations"',
  // Evasion as above
  // Great Fortitude as above
  // Greater Weapon Specialization as above
  // Improved Evasion as above
  // Incredible Senses as above
  // Light Armor Expertise as above
  'Light Armor Mastery':
    'Section=combat Note="Defense Master (Light Armor; Unarmored Defense)"',
  'Master Strike':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Master (Rogue)",' +
      '"Successful Strikes on flat-footed foes force Fortitude saves; critical failure inflicts choice of paralyzed for 4 rd, knocked unconscious for 2 hours, or killed; failure inflicts paralyzed for 4 rd; success inflicts enfeebled 2 for 1 rd"',
  'Master Tricks':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks)"',
  'Rogue Expertise':'Section=combat Note="Class Expert (Rogue)"',
  'Rogue Feats':'Section=feature Note="%V selections"',
  'Rogue Skills':
    'Section=skill Note="Skill Trained (Stealth; Choose %V from any)"',
  "Rogue's Racket":'Section=feature Note="1 selection"',
  'Ruffian':
    'Section=combat,combat,skill ' +
    'Note=' +
      '"Armor %V (Medium Armor)",' +
      '"May sneak attack with any simple weapon/May apply critical specialization on a successful Strike with a d8 or lighter simple weapon on a flat-footed foe",' +
      '"Skill Trained (Intimidation)"',
  'Scoundrel':
    'Section=combat,skill ' +
    'Note=' +
      '"A successful Feint inflicts flat-footed on foe vs. self attacks (critical success all attacks) for 1 rd",' +
      '"Skill Trained (Deception; Diplomacy)"',
  'Slippery Mind':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Sneak Attack':
    'Section=combat ' +
    'Note="+%{(level+7)//6}d6 HP damage vs. flat-footed foe with agile, finesse, or ranged weapons"',
  'Surprise Attack':
    'Section=combat ' +
    'Note="May use Deception or Stealth for initiative to inflict flat-footed on creatures that haven\'t acted"',
  'Thief':
    'Section=combat,skill ' +
    'Note=' +
      '"+%{dexterityModifier-strengthModifier} HP damage with finesse melee weapons",' +
      '"Skill Trained (Thievery)"',
  // Vigilant Senses as above
  'Weapon Tricks':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks)",' +
      '"Critical hits vs. a flat-footed foe with unarmed attacks and agile, finesse, and rogue weapons inflict its critical specialization effect"',
  // Weapon Specialization as above

  'Nimble Dodge':
    'Section=combat Note="May use a Reaction to gain +2 AC against 1 attacker"',
  'Trap Finder':
    'Section=combat,save,skill ' +
    'Note=' +
      '"+%{rank.Thievery>=3?2:1} Perception and automatic Search to find traps/May disable traps that require %{rank.Thievery>=3 ? \'legendary\' : \'master\'} in Thievery",' +
      '"+%{rank.Thievery>=3?2:1} vs. traps",' +
      '"+%{rank.Thievery>=3?2:1} AC vs. traps"',
  'Twin Feint':
    'Section=combat ' +
    'Note="May use 2 actions to Strike with each hand, inflicting flat-footed on the second"',
  "You're Next":
    'Section=combat ' +
    'Note="May use %{rank.Intimidation>=4 ? \'a free action\' : \'Reaction\'} for a +2 Intimidation to Demoralize another foe after current foe drops"',
  'Brutal Beating':
    'Section=combat Note="Critical success on a Strike inflicts frightened 1"',
  'Distracting Feint':
    'Section=combat ' +
    'Note="A successful Feint inflicts -2 Perception and Reflex saves"',
  'Minor Magic':'Section=magic Note="Knows 2 cantrips from chosen tradition"',
  'Mobility':
    'Section=combat Note="May Stride half Speed without triggering reactions"',
  // Quick Draw as above
  'Unbalancing Blow':
    'Section=combat ' +
    'Note="Critical hits inflict flat-footed vs. self attacks for 1 rd"',
  'Battle Assessment':
    'Section=combat ' +
    'Note="May use Perception vs. Deception or Stealth DC to determine foe strengths and weaknesses"',
  'Dread Striker':
    'Section=combat Note="Frightened foes are flat-footed vs. self attacks"',
  'Magical Trickster':
    'Section=magic ' +
    'Note="Spell attacks vs. flat-footed foes inflict sneak attack damage"',
  'Poison Weapon':
    'Section=combat Note="May apply poison to piercing and slashing weapons"',
  'Reactive Pursuit':
    'Section=combat ' +
    'Note="May use a Reaction to remain adjacent to a retreating foe"',
  'Sabotage':
    'Section=skill Note="May use Thievery to damage an item in a foe\'s hand"',
  // Scout's Warning as above
  'Gang Up':
    'Section=combat ' +
    'Note="Threats from allies inflict flat-footed on foes vs. self attacks"',
  'Light Step':
    'Section=ability Note="May move normally over difficult terrain"',
  // Skirmish Strike as above
  'Twist The Knife':
    'Section=combat ' +
    'Note="Sneak attacks inflict %{(level+7)//6} HP persistent bleed damage"',
  // Blind-Fight as above
  'Delay Trap':
    'Section=skill ' +
    'Note="May attempt a +5 DC Thievery to delay or disable trap activation"',
  'Improved Poison Weapon':
    'Section=combat ' +
    'Note="Poisoned weapons inflict +2d4 HP damage/Critical miss does not waste poison"',
  'Nimble Roll':
    'Section=save ' +
    'Note="May use Nimble Dodge before a Reflex save; success allows a 10\' Stride"',
  'Opportune Backstab':
    'Section=combat ' +
    'Note="May use a Reaction after an ally hits a foe to Strike the same foe"',
  'Sidestep':
    'Section=combat ' +
    'Note="May use a Reaction to redirect a failed Strike on self to an adjacent creature"',
  'Sly Striker':
    'Section=combat ' +
    'Note="Successful Strikes with sneak attack weapons inflict +%{level>=14 ? 2 : 1}d6 HP damage"',
  'Precise Debilitations':
    'Section=combat ' +
    'Note="Debilitating Strike may inflict +2d6 HP damage or flat-footed"',
  'Sneak Savant':
    'Section=skill Note="Normal failures on Sneak actions are successes"',
  'Tactical Debilitations':
    'Section=combat ' +
    'Note="Debilitating Strike may prevent reactions or flanking"',
  'Vicious Debilitations':
    'Section=combat ' +
    'Note="Debilitating Strike may inflict weakness 5 to choice of weapon type or clumsy 1"',
  'Critical Debilitation':
    'Section=combat ' +
    'Note="Debilitating Strike forces foe Fortitude saves; critical failure paralyzes for 1 rd; failure/success inflicts slowed 2/1 for 1 rd"',
  'Fantastic Leap':
    'Section=combat ' +
    'Note="May use 2 actions to Strike after a High Jump or Long Jump, using Long Jump distance for either"',
  'Felling Shot':
    'Section=combat ' +
    'Note="May use 2 actions to force a Reflex save with a successful Strike vs. an airborne flat-footed foe; critical failure grounds for 1 rd; failure causes 120\' fall"',
  'Reactive Interference':
    'Section=combat ' +
    'Note="May use a Reaction to prevent foe Reaction; requires an attack against a higher-level foe"',
  'Spring From The Shadows':
    'Section=combat Note="May Strike an unaware foe after a Stride"',
  'Defensive Roll':
    'Section=combat ' +
    'Note="May negate half damage from an attack that would reduce self to 0 Hit Points 1/10 min"',
  'Instant Opening':
    'Section=combat ' +
    'Note="R30\' May use a distraction to inflict flat-footed vs. self for 1 rd"',
  'Leave An Opening':
    'Section=combat ' +
    'Note="A critical hit vs. a flat-footed foe gives an ally an Attack Of Opportunity"',
  // Sense The Unseen as above
  'Blank Slate':
    'Section=save ' +
    'Note="Immune to detection, revelation and scrying effects of less than 10 counteract level"',
  'Cloud Step':
    'Section=ability Note="May Stride over insubstantial surfaces and traps"',
  'Cognitive Loophole':
    'Section=save Note="May use a Reaction to suppress a mental effect for 1 rd"',
  'Dispelling Slice':
    'Section=combat ' +
    'Note="May use 2 actions to dispel a magical effect on target with a successful sneak attack"',
  'Perfect Distraction':
    'Section=magic Note="May use <i>Mislead</i> effects 1/10 min"',
  'Implausible Infiltration':
    'Section=ability ' +
    'Note="May use 2 actions to move through up to 10\' of wood, plaster, or stone"',
  'Powerful Sneak':
    'Section=combat Note="May change sneak attack damage to match weapon type"',
  "Trickster's Ace":
    'Section=magic ' +
    'Note="May use a Reaction to evoke effects of a prepared spell up to level 4"',
  'Hidden Paragon':'Section=magic Note="May become invisible for 1 min 1/hour"',
  'Impossible Striker':
    'Section=combat Note="May use sneak attack vs. non-flat-footed foe"',
  'Reactive Distraction':
    'Section=combat ' +
    'Note="May use a Reaction to redirect effect or attack from self to decoy"',

  // Sorcerer
  // Alertness as above
  'Aberrant':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      '"Knows the <i>Tentacular Limbs</i> spell",' +
      '"Casting a bloodline spell gives self or target +2 Will saves for 1 rd",' +
      '"Skill Trained (Intimidation; Occultism)"',
  'Angelic':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      '"Knows the <i>Angelic Halo</i> spell",' +
      '"Casting a bloodline spell gives self or target +1 saves for 1 rd",' +
      '"Skill Trained (Diplomacy; Religion)"',
  'Demonic':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      '"Knows the <i>Glutton\'s Jaws</i> spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts -1 AC on target for 1 rd",' +
      '"Skill Trained (Intimidation; Religion)"',
  'Diabolic':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      '"Knows the <i>Diabolic Edict</i> spell",' +
      '"Casting a bloodline spell gives self +1 Deception for 1 rd or inflicts 1 HP fire per spell level on target for 1 rd",' +
      '"Skill Trained (Deception; Religion)"',
  'Draconic':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane))",' +
      '"Knows the <i>Dragon Claws</i> spell",' +
      '"Casting a bloodline spell gives self or target +1 AC for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Elemental':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)",' +
      '"Knows the <i>Elemental Toss</i> spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning or fire per spell level on target for 1 rd",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Fey':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)",' +
      '"Knows the <i>Faerie Dust</i> spell",' +
      '"Casting a bloodline spell gives self or target concealment for 1 rd",' +
      '"Skill Trained (Deception; Nature)"',
  'Hag':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      '"Knows the <i>Jealous Hex</i> spell",' +
      '"Casting a bloodline spell inflicts 2 HP mental per spell level to first successful attacker for 1 rd",' +
      '"Skill Trained (Deception; Occultism)"',
  'Imperial':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)",' +
      '"Knows the <i>Ancestral Memories</i> spell",' +
      '"Casting a bloodline spell gives self or target +1 skill checks for 1 rd",' +
      '"Skill Trained (Arcana; Society)"',
  'Undead':
    'Section=magic,magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      '"Knows the <i>Undeath\'s Blessing</i> spell",' +
      '"Casting a bloodline spell gives self 1 temporary Hit Points per spell level for 1 rd or inflicts 1 HP negative per spell level on target for 1 rd",' +
      '"Skill Trained (Intimidation; Religion)"',
  'Bloodline':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a Focus Pool with 1 Focus Point"',
  'Bloodline Paragon':'Section=magic Note="Has 1 10th-level spell slot"',
  'Defensive Robes':'Section=combat Note="Defense Expert (Unarmored Defense)"',
  // Expert Spellcaster as above
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  'Magical Fortitude':'Section=save Note="Save Expert (Fortitude)"',
  // Master Spellcaster as above
  // Resolve as above
  // Signature Spells as above
  'Sorcerer Feats':'Section=feature Note="%V selections"',
  'Sorcerer Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Sorcerer Spellcasting':
    'Section=magic Note="May learn spells from the %V tradition"',
  'Sorcerer Weapon Expertise':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  // Weapon Specialization as above

  'Counterspell':
    'Section=magic ' +
    'Note="May use a Reaction and expend a spell slot to counteract a spell with the same spell"',
  'Dangerous Sorcery':
    'Section=magic ' +
    'Note="Instantaneous spells inflict additional damage equal to their levels"',
  'Familiar':'Section=feature Note="May have a familiar"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Section=magic,skill ' +
    'Note=' +
      '"May learn 1 additional spell from spellbook each day, treating it as a signature spell if it is in repertoire",' +
      '"Skill Trained (Choose 1 from any)"',
  'Bespell Weapon':
    'Section=magic ' +
    'Note="Casting a spell causes a wielded weapon to inflict +1d6 HP until end of turn; damage type depends on spell school"',
  'Divine Evolution':
    'Section=magic Note="+1 D%V slot for a heal or harm spell"',
  'Occult Evolution':
    'Section=magic,skill ' +
    'Note=' +
      '"May learn 1 unknown mental spell each day",' +
      '"Skill Trained (Choose 1 from any)"',
  'Primal Evolution':
    'Section=magic ' +
    'Note="+1 P%V slot for a <i>Summon Animal</i> or a <i>Summon Plant Or Fungus</i> spell"',
  'Advanced Bloodline':
    // TODO automate
    'Section=magic Note="Knows advanced bloodline spell/+1 Focus Points"',
  // Steady Spellcasting as above
  'Bloodline Resistance':
    'Section=save Note="+1 vs. spells and magical effects"',
  'Crossblooded Evolution':
    'Section=magic Note="May know 1 spell from a different tradition"',
  'Greater Bloodline':
    // TODO automate
    'Section=magic Note="Knows greater bloodline spell/+1 Focus Points"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Magic Sense':
    'Section=magic Note="Has continuous <i>Detect Magic</i> effects"',
  'Interweave Spell':
    'Section=magic ' +
    'Note="May expend a spell slot to add <i>Dispel Magic</i> effects to a successful single-target spell"',
  'Reflect Spell':
    'Section=magic ' +
    'Note="May have a successful Counterspell on a targeted spell inflict the spell effects on the caster"',
  // Effortless Concentration as above
  'Greater Mental Evolution':'Section=magic Note="+1 spell slot of each level"',
  'Greater Vital Evolution':
    'Section=feature ' +
    'Note="May cast two additional spells of different levels after spell slots in each level are exhausted 1/day"',
  'Bloodline Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  'Greater Crossblooded Evolution':
    'Section=magic ' +
    'Note="May know 3 spells of different levels from different traditions"',
  'Bloodline Conduit':
    'Section=magic ' +
    'Note="May cast instantaneous spells of 5th level and lower without expending a spell slot"',
  'Bloodline Perfection':'Section=magic Note="+1 10th level spell slot"',
  'Metamagic Mastery':
    'Section=magic Note="May use a 1-action metamagic effect as a free action"',

  // Wizard
  'Abjuration':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Protective Ward</i> spell",' +
      '"Knows 1 additional 1st-level Abjuration spell"',
  // Alertness as above
  'Arcane Bond':
    'Section=magic ' +
    'Note="May use Drain Bonded Item to cast an expended spell using power stored in a possession 1/day"',
  // TODO more to it than this
  'Arcane School':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a Focus Pool with 1 Focus Point"',
  'Arcane Spellcasting':
    'Section=magic Note="May learn spells from the Arcane tradition"',
  'Arcane Thesis':'Section=feature Note="1 selection"',
  "Archwizard's Spellcraft":'Section=magic Note="Has 1 10th-level spell slot"',
  'Conjuration':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Augment Summoning</i> spell",' +
      '"Knows 1 additional 1st-level Conjuration spell"',
  // Defensive Robes as above
  'Divination':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Diviner\'s Sight</i> spell",' +
      '"Knows 1 additional 1st-level Divination spell"',
  'Enchantment':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Charming Words</i> spell",' +
      '"Knows 1 additional 1st-level Enchantment spell"',
  'Evocation':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Force Bolt</i> spell",' +
      '"Knows 1 additional 1st-level Evocation spell"',
  // Expert Spellcaster as above
  'Illusion':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Warped Terrain</i> spell",' +
      '"Knows 1 additional 1st-level Illusion spell"',
  'Improved Familiar Attunement':
    'Section=feature ' +
    'Note="Familiar is focus of Arcane Bond and has %{level//6+1} additional %{level>5?\'abilities\':\'ability\'}"',
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Magical Fortitude as above
  // Master Spellcaster as above
  'Metamagical Experimentation':
    'Section=feature,magic ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May select 1 metamagic feat of up to level %{level//2} to use each day"',
  'Necromancy':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Call Of The Grave</i> spell",' +
      '"Knows 1 additional 1st-level Necromancy spell"',
  // Resolve as above
  'Spell Blending':
    'Section=magic ' +
    'Note="May use 2 spell slots from a level to prepare a spell two levels higher/May use a spell slot to prepare 2 cantrips"',
  'Spell Substitution':
    'Section=magic ' +
    'Note="May use a 10-minute process to replace 1 prepared spell with a different spell"',
  'Transmutation':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Knows the <i>Physical Boost</i> spell",' +
      '"Knows 1 additional 1st-level Transmutation spell"',
  'Universalist':
    'Section=feature,magic ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May use Drain Bonded Item 1/spell level/Knows 1 additional 1st-level spell"',
  // Weapon Specialization as above
  'Wizard Feats':'Section=feature Note="%V selections"',
  'Wizard Skills':
    'Section=skill Note="Skill Trained (Arcana; Choose %V from any)"',
  'Wizard Weapon Expertise':
    'Section=feature ' +
    'Note="Attack Expert (Club; Crossbow; Dagger; Heavy Crossbow; Staff; Unarmed Attacks)"',

  // Counterspell as above
  'Eschew Materials':
    'Section=magic Note="Does not need material components to cast spells"',
  // Familiar as above
  'Hand Of The Apprentice':
    'Section=magic ' +
    'Note="Knows the <i>Hand Of The Apprentice</i> spell/Has a Focus Pool with 1 Focus Point"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':
    'Section=skill ' +
    'Note="May hide spellcasting from observers with successful Deception and Stealth vs. Perception"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':
    'Section=magic ' +
    'Note="Draining a bonded item to cast a spell restores 1 Focus Point"',
  'Silent Spell':
    'Section=magic Note="Does not need verbal components to cast spells"',
  'Spell Penetration':
    'Section=magic ' +
    'Note="Targets reduce any status bonus to saves vs. self spells by 1"',
  // Steady Spellcasting as above
  'Advanced School Spell':
    'Section=magic Note="Knows the <i>%V</i> spell/+1 Focus Points"',
  'Bond Conservation':
    'Section=magic ' +
    'Note="May use Drain Bonded Item to cast another spell 2 levels lower within 1 rd"',
  'Universal Versatility':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"May select a school spell during daily preparations and Refocus"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Savant':
    'Section=magic ' +
    'Note="May prepare %{rank.Arcane>=4?4:rank.Arcane>=3?3:2} temporary scrolls with spells up to level %V each day"',
  'Clever Counterspell':
    'Section=magic ' +
    'Note="May Counterspell with a -2 penalty a known spell using any spell that shares its school and another trait"',
  // Magic Sense as above
  'Bonded Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Reflect Spell as above
  'Superior Bond':
    'Section=magic ' +
    'Note="May use Drain Bonded Item to cast another spell up to level %V 1/day"',
  // Effortless Concentration as above
  'Spell Tinker':
    'Section=magic Note="May alter effect choice of a spell cast on self"',
  'Infinite Possibilities':
    'Section=magic ' +
    'Note="May designate a spell slot to allow casting of any known spell of 2 levels lower"',
  'Reprepare Spell':
    'Section=magic ' +
    'Note="May spend 10 min to prepare a cast spell%{$\'features.Spell Substitution\'?\' or another spell of the same level\':\'\'}"',
  "Archwizard's Might":'Section=magic Note="+1 10th level spell slot"',
  // Metamagic Mastery as above
  'Spell Combination':
    'Section=magic ' +
    'Note="May use 1 spell slot of each level to cast two spells of 2 levels lower"',

  // Archetype
  'Alchemist Dedication':'Section=feature Note="FILL"',
  'Basic Concoction':'Section=feature Note="FILL"',
  // Quick Alchemy as above
  'Advanced Concoction':'Section=feature Note="FILL"',
  'Expert Alchemy':'Section=feature Note="FILL"',
  'Master Alchemy':'Section=feature Note="FILL"',

  'Barbarian Dedication':'Section=feature Note="FILL"',
  // TODO requires "class granting no more HP/level than 10 + conmod"
  'Barbarian Resiliency':'Section=feature Note="FILL"',
  'Basic Fury':'Section=feature Note="FILL"',
  'Advanced Fury':'Section=feature Note="FILL"',
  'Instinct Ability':'Section=feature Note="FILL"',
  "Juggernaut's Fortitude":'Section=feature Note="FILL"',

  'Bard Dedication':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has Muses feature",' +
      '"Spell Trained(Occult)/Knows 2 Occult cantrips",' +
      '"Skill Trained (Occultism; Performance)"',
  'Basic Bard Spellcasting':'Section=feature Note="FILL"',
  "Basic Muse's Whispers":'Section=feature Note="FILL"',
  "Advanced Muse's Whispers":'Section=feature Note="FILL"',
  'Counter Perform':'Section=feature Note="FILL"',
  'Inspiration Performance':'Section=feature Note="FILL"',
  'Occult Breadth':'Section=feature Note="FILL"',
  'Expert Bard Spellcasting':'Section=feature Note="FILL"',
  'Master Bard Spellcasting':'Section=feature Note="FILL"',

  'Champion Dedication':'Section=feature Note="FILL"',
  'Basic Devotion':'Section=feature Note="FILL"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Champion Resiliency':'Section=feature Note="FILL"',
  'Healing Touch':'Section=feature Note="FILL"',
  'Advanced Devotion':'Section=feature Note="FILL"',
  // Divine Ally as above
  'Diverse Armor Expert':'Section=feature Note="FILL"',

  'Cleric Dedication':'Section=feature Note="FILL"',
  'Basic Cleric Spellcasting':'Section=feature Note="FILL"',
  'Basic Dogma':'Section=feature Note="FILL"',
  'Advanced Dogma':'Section=feature Note="FILL"',
  'Divine Breadth':'Section=feature Note="FILL"',
  'Expert Cleric Spellcasting':'Section=feature Note="FILL"',
  'Master Cleric Spellcasting':'Section=feature Note="FILL"',

  'Druid Dedication':'Section=feature Note="FILL"',
  'Basic Druid Spellcasting':'Section=feature Note="FILL"',
  'Basic Wilding':'Section=feature Note="FILL"',
  'Order Spell':'Section=feature Note="FILL"',
  'Advanced Wilding':'Section=feature Note="FILL"',
  'Primal Breadth':'Section=feature Note="FILL"',
  'Expert Druid Spellcasting':'Section=feature Note="FILL"',
  'Master Druid Spellcasting':'Section=feature Note="FILL"',

  'Fighter Dedication':'Section=feature Note="FILL"',
  'Basic Maneuver':'Section=feature Note="FILL"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Fighter Resiliency':'Section=feature Note="FILL"',
  'Opportunist':'Section=feature Note="FILL"',
  'Advanced Maneuver':'Section=feature Note="FILL"',
  'Diverse Weapon Expert':'Section=feature Note="FILL"',

  'Monk Dedication':'Section=feature Note="FILL"',
  'Basic Kata':'Section=feature Note="FILL"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Monk Resiliency':'Section=feature Note="FILL"',
  'Advanced Kata':'Section=feature Note="FILL"',
  'Monk Moves':'Section=feature Note="FILL"',
  "Monk's Flurry":'Section=feature Note="FILL"',
  "Perfection's Path":'Section=feature Note="FILL"',

  'Ranger Dedication':'Section=feature Note="FILL"',
  "Basic Hunter's Trick":'Section=feature Note="FILL"',
  // TODO requires "class granting no more HP/level than 8 + conmod"
  'Ranger Resiliency':'Section=feature Note="FILL"',
  "Advanced Hunter's Trick":'Section=feature Note="FILL"',
  'Master Spotter':'Section=feature Note="FILL"',

  'Rogue Dedication':'Section=feature Note="FILL"',
  'Basic Trickery':'Section=feature Note="FILL"',
  'Sneak Attacker':'Section=feature Note="FILL"',
  'Advanced Trickery':'Section=feature Note="FILL"',
  'Skill Mastery':
    'Section=skill ' +
    'Note="Skill Trained (Choose 1 from any)/Skill Expert (Choose 1 from any)"',
  'Uncanny Dodge':'Section=feature Note="FILL"',
  'Evasiveness':'Section=feature Note="FILL"',

  'Sorcerer Dedication':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Bloodline feature",' +
      '"Knows 2 %V cantrips"',
  'Basic Sorcerer Spellcasting':'Section=feature Note="FILL"',
  'Basic Blood Potency':'Section=feature Note="FILL"',
  'Basic Bloodline Spell':'Section=feature Note="FILL"',
  'Advanced Blood Potency':'Section=feature Note="FILL"',
  'Bloodline Breadth':'Section=feature Note="FILL"',
  'Expert Sorcerer Spellcasting':'Section=feature Note="FILL"',
  'Master Sorcerer Spellcasting':'Section=feature Note="FILL"',

  'Wizard Dedication':
    'Section=magic,skill ' +
    'Note=' +
      '"Owns a spellbook with 4 arcane cantrips; may prepare 2 each day",' +
      '"Skill Trained (Arcana)"',
  'Arcane School Spell':'Section=feature Note="FILL"',
  'Basic Arcana':'Section=feature Note="FILL"',
  'Basic Wizard Spellcasting':'Section=feature Note="FILL"',
  'Advanced Arcana':'Section=feature Note="FILL"',
  'Arcane Breadth':'Section=feature Note="FILL"',
  'Expert Wizard Spellcasting':'Section=feature Note="FILL"',
  'Master Wizard Spellcasting':'Section=feature Note="FILL"',

  // General Feats
  'Adopted Ancestry':
    'Section=feature Note="May take ancestry feats from chosen ancestry"',
  'Ancestral Paragon':'Section=feature Note="+1 Ancestry Feat"',
  'Armor Proficiency':
    'Section=combat ' +
    // TODO interacts w/other sources of Defense Trained
    'Note="Defense Trained (%{$\'feats.Armor Proficiency\'>=3?\'Heavy\':$\'feats.Armor Proficiency\'>=2?\'Medium\':\'Light\'} Armor)"',
  'Breath Control':
    'Section=attribute,save ' +
    'Note=' +
      '"May hold breath 25x as long as usual without suffocating",' +
      '"+1 vs. inhaled threats/Success vs. inhaled threat is always a critical success"',
  'Canny Acumen (Fortitude)':'Section=save Note="Save %V (Fortitude)"',
  'Canny Acumen (Perception)':'Section=skill Note="Perception %V"',
  'Canny Acumen (Reflex)':'Section=save Note="Save %V (Reflex)"',
  'Canny Acumen (Will)':'Section=save Note="Save %V (Will)"',
  'Diehard':'Section=combat Note="Remains alive until dying 5"',
  'Expeditious Search':
    'Section=skill ' +
    'Note="May Search at %{rank.Perception>=4?4:2}x normal speed"',
  'Fast Recovery':
    'Section=save ' +
    'Note="Regains 2x Hit Points and drained severity from rest/Successful Fortitude vs. ongoing disease or poison reduces stage by 2 (1 if virulent; 3 or 2 with critical success)"',
  'Feather Step':'Section=ability Note="May Step into difficult terrain"',
  'Fleet':'Section=ability Note="+5 Speed"',
  'Incredible Initiative':'Section=combat Note="+2 Initiative"',
  'Incredible Investiture':'Section=magic Note="May invest 12 items"',
  'Ride':
    'Section=feature ' +
    'Note="Command an Animal to move automatically succeeds/Mount acts on self turn"',
  'Shield Block':
    'Section=combat ' +
    'Note="Shield negates damage up to its hardness and absorbs half of remaining damage"',
  'Toughness':
    'Section=combat,save ' +
    'Note=' +
      '"+%{level} Hit Points",' +
      '"-1 DC on recovery checks"',
  'Untrained Improvisation':
    'Section=skill Note="+%{level<7?level//2:level} on untrained skill checks"',
  'Weapon Proficiency (Martial Weapons)':
    'Section=combat Note="Attack Trained (Martial Weapons)"',
  'Weapon Proficiency (Simple Weapons)':
    'Section=combat Note="Attack Trained (Simple Weapons)"',
  'Weapon Proficiency (%weapon)':
    'Section=combat Note="Attack Trained (%weapon)"',

  // General Skill Feats
  'Assurance (%skill)':'Section=skill Note="May take 10 on %skill rolls"',
  'Automatic Knowledge (%skill)':
    'Section=skill Note="May use Recall Knowledge with %skill 1/rd"',
  'Dubious Knowledge':
    'Section=skill ' +
    'Note="Fail on Recall Knowledge yields a mix of true and false info"',
  'Magical Shorthand':'Section=skill Note="May learn new spells in %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Religion>=4?\'1 min\':rank.Arcana==3||rank.Nature>=3||rank.Occultism>=3||rank.Religion==3?\'5 min\':\'1 hour\'} per spell level; may retry 1 week after failure"',
  'Quick Identification':'Section=skill Note="May Identify Magic %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Arcana>=4?\'in 1 action\':rank.Arcana==3||rank.Nature==3||rank.Occultism==3||rank.Religion==3?\'as a 3-action activity\':\'in 1 min\'}"',
  'Quick Recognition':'Section=skill Note="May Recognize a Spell as a free action 1/rd"',
  'Recognize Spell':'Section=feature Note="FILL"',
  'Skill Training (%skill)':'Section=skill Note="Skill Trained (%skill)"',
  'Trick Magic Item':
    'Section=skill ' +
    'Note="Successful check on related skill allows temporary activation of a magic item"',

  // Specific Skill Feats
  'Additional Lore (%lore)':'Section=skill Note="Skill %V (%lore Lore)"',
  'Alchemical Crafting':
    'Section=skill ' +
    'Note="May use Crafting to create alchemical items/Knows formulas for four common 1st-level alchemical items"',
  'Arcane Sense':
    'Section=magic ' +
    'Note="May cast <i>Detect Magic</i> at level %{rank.Arcana>=4?4:rank.Arcana>=3?3:1} at will"',
  'Bargain Hunter':
    'Section=skill Note="+2 initial gold/May use Diplomacy to Earn Income"',
  'Battle Cry':
    'Section=combat ' +
    'Note="May Demoralize a foe during initiative%{rank.Intimidation>=4?\' or on attack critical success\':\'\'}"',
  'Battle Medicine':
    'Section=skill Note="May use Medicine to Treat Wounds 1/target/day"',
  'Bizarre Magic':
    'Section=magic ' +
    'Note="Self spells require +5 DC to Recognize Spells and Identify Magic"',
  'Bonded Animal':
    'Section=skill ' +
    'Note="May make an animal permanently helpful with 1 week interaction and a successful DC 20 Nature test"',
  'Cat Fall':
    'Section=ability ' +
    'Note="Suffers %{rank.Acrobatics>=4?\'no\':rank.Acrobatics==3?\\"50\' less\\":rank.Acrobatics==2?\\"25\' less\\":\\"10\' less\\"} damage from falling"',
  'Charming Liar':
    'Section=skill ' +
    'Note="Critical success on a Lie improves attitude by 1 step"',
  'Cloud Jump':
    'Section=skill ' +
    'Note="May long jump triple normal distance, high jump normal long jump distance, and add %{speed} to jump distance for every additional action spent"',
  'Combat Climber':
    'Section=skill ' +
    'Note="Does not suffer flat-footed and may fight while Climbing/May Climb with one hand occupied"',
  'Confabulator':
    'Section=skill ' +
    'Note="Target of Deception gains %{rank.Deception>=4?\'no\':rank.Deception==3?\'+1\':\'+2\'} bonus for previous attempts"',
  'Connections':
    'Section=skill ' +
    'Note="May use Society to gain meeting with an important figure or to exchange favors"',
  'Continual Recovery':
    'Section=skill Note="May repeat Treat Wounds on a patient after 10 min"',
  'Courtly Graces':
    'Section=skill ' +
    'Note="May use Society to impersonate a noble or to Make an Impression on one"',
  'Craft Anything':
    'Section=skill Note="May ignore secondary Crafting requirements"',
  'Divine Guidance':
    'Section=skill ' +
    'Note="May use Religion after 10 min Deciphering Writing on religious text to gain a hint with current problem"',
  'Experienced Professional':
    'Section=skill ' +
    'Note="A critical failure when using Lore to Earn Income becomes a normal failure, and a normal failure gives twice normal income"',
  'Experienced Smuggler':
    'Section=skill ' +
    'Note="Stealth to conceal a small item gains a minimum %{rank.Stealth>=4?\'success\':rank.Steak>=3\'15\':\'10\'} on roll"',
  'Experienced Tracker':
    'Section=skill ' +
    'Note="May Track at full Speed%{rank.Survival<3?\' at a -5 penalty\':\'\'}%{rank.Survival>=4?\'/Does not require a new roll every hour to Track\':\'\'}"',
  'Fascinating Performance':
    'Section=skill ' +
    'Note="May fascinate %{rank.Performance>=4?\'targets\':rank.Performance==3?\'10 targets\':rank.Performance==2?\'4 targets\':\'target\'} for 1 rd with a successful Performance vs. Will"',
  'Foil Senses':
    'Section=skill ' +
    'Note="Automatically takes precautions against special senses when using Avoid Notice, Hide, or Sneak actions"',
  'Forager':
    'Section=skill ' +
    'Note="Using Survival to Subsist always succeeds; may provide for self and %{rank.Survival>=4?32:rank.Survival==3?16:rank.Survival==2?8:4} others (x2 with a critical success)"',
  'Glad-Hand':
    'Section=skill ' +
    'Note="May attempt to Make an Impression using Diplomacy immediately upon meeting; may retry after 1 min"',
  'Group Coercion':
    'Section=skill ' +
    'Note="May use Intimidation to Coerce %{rank.Intimidation>=4?25:rank.Intimidation==3?10:rank.Intimidation==2?4:2} targets"',
  'Group Impression':
    'Section=skill ' +
    'Note="May use Diplomacy to Make an Impression with %{rank.Diplomacy>=4?25:rank.Diplomacy==3?10:rank.Diplomacy==2?4:2} targets"',
  'Hefty Hauler':'Section=ability Note="x2 maximum and encumbered Bulk"',
  'Hobnobber':'Section=skill Note="May Gather Information in half normal time%{levels.Diplomacy>=3?\'/Gather Information in normal time cannot critically fail\':\'\'}"',
  'Impeccable Crafting':
    'Section=skill ' +
    'Note="Crafting success with Specialty Crafting is always a critical success"',
  'Impressive Performance':
    'Section=skill Note="May use Performance to Make an Impression"',
  'Intimidating Glare':'Section=skill Note="May use glare to Demoralize"',
  'Intimidating Prowess':
    'Section=skill ' +
    'Note="+%{strength>=20&&rank.Intimidation>=3?2:1} to Coerce or Demoralize when physically menacing target"',
  'Inventor':'Section=skill Note="May use Craft o create formulas"',
  'Kip Up':'Section=combat Note="May stand without triggering reactions"',
  'Lasting Coercion':
    'Section=skill ' +
    'Note="Successful Coerce lasts up to a %{rank.Intimidation>=4?\'month\':\'week\'}"',
  'Legendary Codebreaker':
    'Section=skill ' +
    'Note="May use Society to Decipher Writing at full speed; success at normal speed is always a critical success"',
  'Legendary Linguist':
    'Section=skill ' +
    'Note="May establish basic communication with any creature that uses language"',
  'Legendary Medic':
    'Section=skill ' +
    'Note="May use 1 hour process and a successful Medicine check to remove a disease or condition 1/target/day"',
  'Legendary Negotiation':
    'Section=skill ' +
    'Note="May convince a foe to negotiate with a successful Make and Impression followed by a successful Request"',
  'Legendary Performer':
    'Section=skill ' +
    'Note="NPCs\' successful DC 10 Society check to Recall Knowledge improves their attitude by 1 step/Performance to Earn Income increases audience by 2 levels"',
  'Legendary Professional':
    'Section=skill ' +
    'Note="NPCs\' successful DC 10 Society check to Recall Knowledge improves their attitude by 1 step/Lore to Earn Income increases job level"',
  'Legendary Sneak':
    'Section=skill ' +
    'Note="May Hide and Sneak without cover/Automatically uses Avoiding Notice when exploring"',
  'Legendary Survivalist':
    'Section=skill ' +
    'Note="May survive indefinitely without food and water and endure incredible temperatures without damage"',
  'Legendary Thief':
    'Section=skill ' +
    'Note="May attempt a Steal-5 check to take actively wielded and highly noticeable items"',
  'Lengthy Diversion':
    'Section=skill ' +
    'Note="May remain hidden after a Create a Diversion attempt critically succeeds"',
  'Lie To Me':
    'Section=skill Note="May use Deception to detect lies in a conversation"',
  'Magical Crafting':
    'Section=skill ' +
    'Note="May craft magic items/Learns formulas for 4 common magic items of 2nd level or lower"',
  'Multilingual':'Section=skill Note="+%V Language Count"',
  'Natural Medicine':
    'Section=skill Note="May use Nature to Treat Wounds; +2 in wilderness"',
  'Nimble Crawl':
    'Section=ability ' +
    'Note="May crawl at %{rank.Acrobatics>=3?\'full\':\'half\'} speed%{rank.Acrobatics>=4?\'/Being prone does not inflict flat-footed\':\'\'}"',
  'Oddity Identification':'Section=skill Note="+2 Occultism to Identify Magic with a mental, possession, predication, or scrying trait"',
  'Pickpocket':
    'Section=skill ' +
    'Note="May Steal a closely-guarded object without penalty%{levels.Thievery>=3?\'/May use Steal-5 on an alert creature\':\'\'}"',
  'Planar Survival':
    'Section=skill Note="May use Survival to Subsist on different planes"',
  'Powerful Leap':
    'Section=skill Note="May jump 5\' vertically and +5\' horizontally"',
  'Quick Climb':
    'Section=skill ' +
    'Note="%{rank.Athletics>=4?\'/May Climb at full speed\':\'Climb normal/critical success increases distance by 5\'/10\'}"',
  'Quick Coercion':'Section=skill Note="May Coerce in 1 rd"',
  'Quick Disguise':'Section=skill Note="May create a disguise %{rank.Deception>=4?\'as a 3-action activity\':rank.Deception==3?\'in 1 min\':\'in 5 min\'}"',
  'Quick Jump':
    'Section=skill ' +
    'Note="May use High Jump and Long Jump as 1 action without an initial Stride"',
  'Quick Repair':
    'Section=skill ' +
    'Note="May Repair an item in %{rank.Crafting>=4?\'1 action\':rank.Crafting==3?\'3 actions\':\'1 min\'}"',
  'Quick Squeeze':
    'Section=skill ' +
    'Note="May Squeeze %{rank.Athletics>=4?\'at full speed\':\\"5\'/rd (critical success 10\'\\"}"',
  'Quick Swim':
    'Section=skill ' +
    'Note="May Swim %{rank.Athletics>=4?\'at full speed\':\\"5\'/rd (critical success 10\'\\"}"',
  'Quick Unlock':'Section=skill Note="May Pick a Lock in 1 action"',
  'Quiet Allies':
    'Section=skill ' +
    'Note="May roll a single Stealth check to Avoid Notice when leading a group"',
  'Rapid Mantel':
    'Section=skill ' +
    'Note="May stand immediately after a successful Grab an Edge/May use Athletics to Grab an Edge"',
  'Read Lips':
    'Section=skill Note="May read the lips of those who can be seen clearly"',
  'Robust Recovery':
    'Section=skill ' +
    'Note="Success on Treat a Disease or a Poison gives +4 bonus/Patient success is always a critical success"',
  'Scare To Death':
    'Section=skill ' +
    'Note="R30\' May test Intimidation vs. foe Will DC; critical success kills foe (Fortitude save frightened 2 and flees for 1 rd); success inflicts frightened 2; failure inflicts frightened 1"',
  'Shameless Request':
    'Section=skill ' +
    'Note="-2 DC and no critical failures for an outrageous request"',
  'Sign Language':
    'Section=skill Note="Knows the sign equivalents of all known languages"',
  'Slippery Secrets':
    'Section=skill ' +
    'Note="Deception vs. spell DC negates spell effects that read minds, detect lies, or reveal alignment"',
  'Snare Crafting':
    'Section=skill ' +
    'Note="May use Craft to create snares; knows the formulas for 4 common snares"',
  'Specialty Crafting':
    'Section=skill Note="+%{rank.Crafting>=3?2:1} Craft on selected type"',
  'Steady Balance':
    'Section=skill ' +
    'Note="All Balance successes are critical successes/Never flat-footed during Balance/May use Acrobatics to Grab an Edge"',
  'Streetwise':
    'Section=skill ' +
    'Note="May use Society instead of Diplomacy to Gather Information/May use Recall Knowledge to know information in familiar settlements"',
  'Student Of The Canon':
    'Section=skill ' +
    'Note="All critical failures on Religion checks to Decipher Writing or Recall Knowledge are normal failures/Cannot fail to Recall Knowledge about own faith"',
  'Subtle Theft':'Section=skill Note="Successful Steal inflicts -2 Perception on observers to detect/May remain undetected after Palm an Object or Steal action after Create a Diversion"',
  'Survey Wildlife':
    'Section=skill ' +
    'Note="May use Survival with a -2 penalty to Recall Knowledge about local creatures after 10 min study"',
  'Swift Sneak':
    'Section=skill ' +
    'Note="May Sneak at full Speed and while Burrowing, Climbing, Flying, or Swimming"',
  'Terrain Expertise (%terrain)':'Section=skill Note="+1 Survival in %terrain"',
  'Terrain Stalker':
    'Section=skill ' +
    'Note="May Sneak without a Stealth check in choice of difficult terrain"',
  'Terrified Retreat':
    'Section=skill ' +
    'Note="Critical success on Demoralize causes lower-level target to flee for 1 rd"',
  'Titan Wrestler':
    'Section=skill ' +
    'Note="May Disarm, Grapple, Shove, or Trip creatures up to %{rank.Athletics>=4?3:2} sizes larger"',
  'Train Animal':
    'Section=feature ' +
    'Note="May use a successful Nature check to teach an animal to perform a trick"',
  'Underwater Marauder':
    'Section=combat ' +
    'Note="Never flat-footed in water/Suffers no penalty for bludgeoning or slashing weapons"',
  'Unified Theory':
    'Section=skill ' +
    'Note="May use Arcana in place of Nature, Occultism, or Religion"',
  'Unmistakable Lore':
    'Section=skill ' +
    'Note="Critical failure on any trained Lore check is a normal failure"',
  'Virtuosic Performer':
    'Section=skill ' +
    'Note="+%{rank.Performance>=3?2:1} checks on chosen Performance type"',
  'Wall Jump':
    'Section=skill Note="May follow a jump with another if adjacent to a wall"',
  'Ward Medic':
    'Section=skill ' +
    'Note="May use Medicine to Treat Disease or Treat Wounds on up to %{rank.Medicine>=4?8:rank.Medicine==3?4:2} creatures simultaneously"',
  'Wary Disarmament':'Section=skill Note="+2 AC vs. triggered trap"',

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
  'Class Feat Count':
    'Pattern="([-+]\\d)\\s+class\\s+feat|class\\s+feat\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=featCount.Class ' +
    'Section=feature Note="%V Class Feat"',
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
    'Section=ability Note="%V Wisdom"'
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
  'Shadowtongue':'',
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
  'None':'Price=0 AC=0 Speed=0 Bulk=0 Hardness=0 HP=0',
  'Buckler':'Price=1 AC=1 Speed=0 Bulk=L Hardness=3 HP=6',
  'Wooden':'Price=1 AC=2 Speed=0 Bulk=1 Hardness=3 HP=12',
  'Steel':'Price=2 AC=2 Speed=0 Bulk=1 Hardness=5 HP=20',
  'Tower':'Price=10 AC=2 Speed=-5 Bulk=4 Hardness=5 HP=20'
};
Pathfinder2E.SKILLS = {
  'Acrobatics':'Ability=Dexterity',
  'Arcana':'Ability=Intelligence',
  'Athletics':'Ability=Strength',
  'Crafting':'Ability=Intelligence',
  'Deception':'Ability=Charisma',
  'Diplomacy':'Ability=Charisma',
  'Intimidation':'Ability=Charisma',
  'Medicine':'Ability=Wisdom',
  'Nature':'Ability=Wisdom',
  'Occultism':'Ability=Intelligence',
  'Performance':'Ability=Charisma',
  'Religion':'Ability=Wisdom',
  'Society':'Ability=Intelligence',
  'Stealth':'Ability=Dexterity',
  'Survival':'Ability=Wisdom',
  'Thievery':'Ability=Dexterity',
  // creature (ancestry) lore skills from ancestry chapter pg 33ff
  'Dwarven Lore':'Ability=Intelligence Category="Creature Lore"',
  'Elven Lore':'Ability=Intelligence Category="Creature Lore"',
  'Gnome Lore':'Ability=Intelligence Category="Creature Lore"', // added
  'Goblin Lore':'Ability=Intelligence Category="Creature Lore"',
  'Halfling Lore':'Ability=Intelligence Category="Creature Lore"',
  // terrain lore skills from background chapter pg 60ff
  'Cave Lore':'Ability=Intelligence Category="Terrain Lore"',
  'Cavern Lore':'Ability=Intelligence Category="Terrain Lore"',
  'Desert Lore':'Ability=Intelligence Category="Terrain Lore"',
  'Forest Lore':'Ability=Intelligence Category="Terrain Lore"',
  'Plains Lore':'Ability=Intelligence Category="Terrain Lore"',
  'Swamp Lore':'Ability=Intelligence Category="Terrain Lore"',
  'Military Lore':'Ability=Intelligence', // pg 247
  // 'Adventuring Lore':'Ability=Intelligence', // pg 247 excluded
  // 'Magic Lore':'Ability=Intelligence', // pg 247 excluded
  // 'Planar Lore':'Ability=Intelligence', // pg 247 excluded
  // Common lore subcategories pg 248
  'Academia Lore':'Ability=Intelligence',
  'Accounting Lore':'Ability=Intelligence',
  'Architecture Lore':'Ability=Intelligence',
  'Art Lore':'Ability=Intelligence',
  'Circus Lore':'Ability=Intelligence',
  'Engineering Lore':'Ability=Intelligence',
  'Farming Lore':'Ability=Intelligence',
  'Fishing Lore':'Ability=Intelligence',
  'Fortune-Telling Lore':'Ability=Intelligence',
  'Games Lore':'Ability=Intelligence',
  'Genealogy Lore':'Ability=Intelligence',
  'Gladitorial Lore':'Ability=Intelligence',
  'Guild Lore':'Ability=Intelligence',
  'Heraldry Lore':'Ability=Intelligence',
  'Herbalism Lore':'Ability=Intelligence',
  'Hunting Lore':'Ability=Intelligence',
  'Labor Lore':'Ability=Intelligence',
  'Legal Lore':'Ability=Intelligence',
  'Library Lore':'Ability=Intelligence',
  'Abadar Lore':'Ability=Intelligence Category="Deity Lore"',
  'Iomedae Lore':'Ability=Intelligence Category="Deity Lore"',
  'Demon Lore':'Ability=Intelligence Category="Creature Lore"',
  'Owlbear Lore':'Ability=Intelligence Category="Creature Lore"',
  'Vampire Lore':'Ability=Intelligence Category="Creature Lore"',
  'Abyss Lore':'Ability=Intelligence Category="Planar Lore"',
  'Astral Plane Lore':'Ability=Intelligence Category="Planar Lore"',
  'Heaven Lore':'Ability=Intelligence Category="Planar Lore"',
  'Absalom Lore':'Ability=Intelligence Category="Settlement Lore"',
  'Magnimar Lore':'Ability=Intelligence Category="Settlement Lore"',
  'Mountain Lore':'Ability=Intelligence Category="Terrain Lore"',
  'River Lore':'Ability=Intelligence Category="Terrain Lore"',
  'Alcohol Lore':'Ability=Intelligence Category="Food Lore"',
  'Baking Lore':'Ability=Intelligence Category="Food Lore"',
  'Butchering Lore':'Ability=Intelligence Category="Food Lore"',
  'Cooking Lore':'Ability=Intelligence Category="Food Lore"',
  'Tea Lore':'Ability=Intelligence Category="Food Lore"',
  'Mercantile Lore':'Ability=Intelligence',
  'Midwifery Lore':'Ability=Intelligence',
  'Milling Lore':'Ability=Intelligence',
  'Mining Lore':'Ability=Intelligence',
  'Sailing Lore':'Ability=Intelligence',
  'Scouting Lore':'Ability=Intelligence',
  'Scribing Lore':'Ability=Intelligence',
  'Stabling Lore':'Ability=Intelligence',
  'Tanning Lore':'Ability=Intelligence',
  'Theater Lore':'Ability=Intelligence',
  'Underworld Lore':'Ability=Intelligence',
  'Warfare Lore':'Ability=Intelligence',
  'Folktale Lore':'Ability=Intelligence', // pg 503
  'Aberration Lore':'Ability=Intelligence Category="Creature Lore"', // pg 504
  'Troll Lore':'Ability=Intelligence Category="Creature Lore"', // pg 505
  'Taldan History Lore':'Ability=Intelligence' // pg 506
};
Pathfinder2E.SPELLS = {
  'Abyssal Plague':
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Acid Arrow':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Acid Splash':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Aerial Form':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Air Bubble':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Air Walk':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Alarm':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Alter Reality':
    'Level=10 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Anathematic Reprisal':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Animal Form':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Animal Messenger':
    'Level=2 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Animal Vision':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Ant Haul':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Antimagic Field':
    'Level=8 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Augury':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Avatar':
    'Level=10 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Baleful Polymorph':
    'Level=6 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Bane':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Banishment':
    'Level=5 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Barkskin':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Bind Soul':
    'Level=9 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Bind Undead':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Black Tentacles':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Blade Barrier':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Bless':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Blindness':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Blink':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Blur':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Breath Of Life':
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Burning Hands':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP fire (Ref neg; heightened +2d6 HP fire/level)"',
  'Calm Emotions':
    'Level=2 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Cataclysm':
    'Level=10 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Chain Lightning':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Charm':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Chill Touch':
    'Level=Cantrip ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Chilling Darkness':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Chromatic Wall':
    'Level=5 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Circle Of Protection':
    'Level=3 ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Clairaudience':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Clairvoyance':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Cloak Of Colors':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Cloudkill':
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Collective Transposition':
    'Level=6 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Color Spray':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Command':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Comprehend Language':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Cone Of Cold':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Confusion':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Contingency':
    'Level=7 ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Continual Flame':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Control Water':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Create Food':
    'Level=2 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 hour" ' +
    'Description="FILL"',
  'Create Water':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Creation':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Crisis Of Faith':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Crusade':
    'Level=9 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Crushing Despair':
    'Level=5 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dancing Lights':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Darkness':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Darkvision':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Daze':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Deafness':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Death Knell':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Death Ward':
    'Level=5 ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Detect Alignment':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Detect Magic':
    'Level=Cantrip ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Detect Poison':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Detect Scrying':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dimension Door':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dimensional Anchor':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dimensional Lock':
    'Level=7 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dinosaur Form':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Disappearance':
    'Level=8 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Discern Lies':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Discern Location':
    'Level=8 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Disintegrate':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Disjunction':
    'Level=9 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dispel Magic':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Disrupt Undead':
    'Level=Cantrip ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Disrupting Weapons':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Divine Aura':
    'Level=8 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Divine Decree':
    'Level=7 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Divine Inspiration':
    'Level=8 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Divine Lance':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Divine Vessel':
    'Level=7 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Divine Wrath':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dominate':
    'Level=6 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dragon Form':
    'Level=6 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dream Council':
    'Level=8 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Dream Message':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Dreaming Potential':
    'Level=5 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Drop Dead':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Duplicate Foe':
    'Level=7 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Earthbind':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Earthquake':
    'Level=8 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Eclipse Burst':
    'Level=7 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Electric Arc':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Elemental Form':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Endure Elements':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Energy Aegis':
    'Level=7 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Enhance Victuals':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Enlarge':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Entangle':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Enthrall':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ethereal Jaunt':
    'Level=7 ' +
    'School=Conjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Fabricated Truth':
    'Level=10 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Faerie Fire':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'False Life':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'False Vision':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Fear':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Feather Fall':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Feeblemind':
    'Level=6 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Feet To Fins':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Field Of Life':
    'Level=6 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Fiery Body':
    'Level=7 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Finger Of Death':
    'Level=7 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Fire Seeds':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Fire Shield':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Fireball':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Flame Strike':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Flaming Sphere':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Fleet Step':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Flesh To Stone':
    'Level=6 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Floating Disk':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Fly':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Forbidding Ward':
    'Level=Cantrip ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Foresight':
    'Level=9 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Freedom Of Movement':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Gaseous Form':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Gate':
    'Level=10 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Gentle Repose':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ghost Sound':
    'Level=Cantrip ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ghostly Weapon':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ghoulish Cravings':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Glibness':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Glitterdust':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Globe Of Invulnerability':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Glyph Of Warding':
    'Level=3 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Goblin Pox':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Grease':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Grim Tendrils':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Guidance':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Gust Of Wind':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Hallucination':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Hallucinatory Terrain':
    'Level=4 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Harm':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Haste':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Heal':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Heroism':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Hideous Laughter':
    'Level=2 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Holy Cascade':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Horrid Wilting':
    'Level=8 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Humanoid Form':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Hydraulic Push':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Hydraulic Torrent':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Hypercognition':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Hypnotic Pattern':
    'Level=3 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Illusory Creature':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Illusory Disguise':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Illusory Object':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Illusory Scene':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Implosion':
    'Level=9 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Insect Form':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Invisibility':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Invisibility Sphere':
    'Level=3 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Item Facade':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Jump':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Knock':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Know Direction':
    'Level=Cantrip ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Levitate':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Light':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Lightning Bolt':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Locate':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Lock':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Longstrider':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mage Armor':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mage Hand':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Magic Aura':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Magic Fang':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Magic Missile':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Magic Mouth':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Magic Weapon':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Magnificent Mansion':
    'Level=7 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  "Mariner's Curse":
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mask Of Terror':
    'Level=7 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Massacre':
    'Level=9 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Maze':
    'Level=8 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Meld Into Stone':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mending':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Message':
    'Level=Cantrip ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Meteor Swarm':
    'Level=9 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mind Blank':
    'Level=8 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mind Probe':
    'Level=5 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Mind Reading':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mindlink':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Miracle':
    'Level=10 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Mirror Image':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Misdirection':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Mislead':
    'Level=6 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Modify Memory':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Moment Of Renewal':
    'Level=8 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Monstrosity Form':
    'Level=8 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Moon Frenzy':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Nature Incarnate':
    'Level=10 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  "Nature's Enmity":
    'Level=9 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Negate Aroma':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Neutralize Poison':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Nightmare':
    'Level=4 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Nondetection':
    'Level=3 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Obscuring Mist':
    'Level=2 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  "Outcast's Curse":
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Overwhelming Presence':
    'Level=9 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Paralyze':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Paranoia':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Pass Without Trace':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Passwall':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Pest Form':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Phantasmal Calamity':
    'Level=6 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Phantasmal Killer':
    'Level=4 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Phantom Pain':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Phantom Steed':
    'Level=2 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Plane Shift':
    'Level=7 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Plant Form':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Polar Ray':
    'Level=8 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Possession':
    'Level=7 ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Power Word Blind':
    'Level=7 ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Power Word Kill':
    'Level=9 ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Power Word Stun':
    'Level=8 ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Prestidigitation':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Primal Herd':
    'Level=10 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Primal Phenomenon':
    'Level=10 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Prismatic Sphere':
    'Level=9 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Prismatic Spray':
    'Level=7 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Prismatic Wall':
    'Level=8 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Private Sanctum':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Produce Flame':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Project Image':
    'Level=7 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Protection':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Prying Eye':
    'Level=5 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Punishing Winds':
    'Level=8 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Purify Food And Drink':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Purple Worm Sting':
    'Level=6 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Raise Dead':
    'Level=6 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Ray Of Enfeeblement':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ray Of Frost':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Read Aura':
    'Level=Cantrip ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Read Omens':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Regenerate':
    'Level=7 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Remake':
    'Level=10 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 hour" ' +
    'Description="FILL"',
  'Remove Curse':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Remove Disease':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Remove Fear':
    'Level=2 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Remove Paralysis':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Repulsion':
    'Level=6 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Resilient Sphere':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Resist Energy':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Resplendent Mansion':
    'Level=9 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Restoration':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Restore Senses':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Retrocognition':
    'Level=7 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Reverse Gravity':
    'Level=7 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Revival':
    'Level=10 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Righteous Might':
    'Level=6 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Rope Trick':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Sanctified Ground':
    'Level=3 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Sanctuary':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Scintillating Pattern':
    'Level=8 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Scrying':
    'Level=6 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Searing Light':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Secret Page':
    'Level=3 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'See Invisibility':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Sending':
    'Level=5 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Shadow Blast':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shadow Siphon':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Shadow Walk':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Shape Stone':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shape Wood':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shapechange':
    'Level=9 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shatter':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shield':
    'Level=Cantrip ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Shield Other':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shillelagh':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shocking Grasp':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shrink':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Shrink Item':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Sigil':
    'Level=Cantrip ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Silence':
    'Level=2 ' +
    'School=Illusion ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Sleep':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Slow':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Solid Fog':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Soothe':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Sound Burst':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Speak With Animals':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Speak With Plants':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spectral Hand':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spell Immunity':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spell Turning':
    'Level=7 ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spellwrack':
    'Level=6 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spider Climb':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spider Sting':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spirit Blast':
    'Level=6 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spirit Link':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spirit Song':
    'Level=8 ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spiritual Epidemic':
    'Level=8 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spiritual Guardian':
    'Level=5 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Spiritual Weapon':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Stabilize':
    'Level=Cantrip ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Status':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Stinking Cloud':
    'Level=3 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Stone Tell':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Stone To Flesh':
    'Level=6 ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Stoneskin':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Storm Of Vengeance':
    'Level=9 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Subconscious Suggestion':
    'Level=5 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Suggestion':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Summon Animal':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Celestial':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Construct':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Dragon':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Elemental':
    'Level=2 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Entity':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Fey':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Occult,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Fiend':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Giant':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Summon Plant Or Fungus':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Sunburst':
    'Level=7 ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Synaptic Pulse':
    'Level=5 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Synesthesia':
    'Level=5 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Talking Corpse':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Tanglefoot':
    'Level=Cantrip ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Tangling Creepers':
    'Level=6 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Telekinetic Haul':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Telekinetic Maneuver':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Telekinetic Projectile':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Telepathic Bond':
    'Level=5 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Telepathic Demand':
    'Level=9 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Telepathy':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Teleport':
    'Level=6 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Time Stop':
    'Level=10 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Tongues':
    'Level=5 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Touch Of Idiocy':
    'Level=2 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Tree Shape':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Tree Stride':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'True Seeing':
    'Level=6 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'True Strike':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'True Target':
    'Level=7 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Uncontrollable Dance':
    'Level=8 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Undetectable Alignment':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Unfathomable Song':
    'Level=9 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Unfettered Pack':
    'Level=7 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Unrelenting Observation':
    'Level=8 ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Unseen Servant':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Vampiric Exsanguination':
    'Level=6 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Vampiric Touch':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Veil':
    'Level=4 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ventriloquism':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Vibrant Pattern':
    'Level=6 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Visions Of Danger':
    'Level=7 ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Vital Beacon':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Volcanic Eruption':
    'Level=7 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Wail Of The Banshee':
    'Level=9 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Wall Of Fire':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Wall Of Force':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Wall Of Ice':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Wall Of Stone':
    'Level=5 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Wall Of Thorns':
    'Level=3 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Wall Of Wind':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  "Wanderer's Guide":
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Warp Mind':
    'Level=7 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Water Breathing':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Water Walk':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Weapon Of Judgment':
    'Level=9 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Weapon Storm':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Web':
    'Level=2 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Weird':
    'Level=9 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Wind Walk':
    'Level=8 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast="10 min" ' +
    'Description="FILL"',
  'Wish':
    'Level=10 ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Zealous Conviction':
    'Level=6 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Zone Of Truth':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Allegro':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Counter Performance':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Dirge Of Doom':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Fatal Aria':
    'Level=10 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'House Of Imaginary Walls':
    'Level=Cantrip ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Inspire Competence':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Inspire Courage':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Inspire Defense':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Inspire Heroics':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description="FILL"',
  'Lingering Composition':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description="FILL"',
  "Loremaster's Etude":
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description="FILL"',
  'Soothing Ballad':
    'Level=7 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Triple Time':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  "Champion's Sacrifice":
    'Level=6 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  "Hero's Defiance":
    'Level=10 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Free ' +
    'Description="FILL"',
  'Lay On Hands':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Litany Against Sloth':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Litany Against Wrath':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Litany Of Righteousness':
    'Level=7 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Agile Feet':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Appearance Of Wealth':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Artistic Flourish':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Athletic Rush':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Bit Of Luck':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Blind Ambition':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Captivating Adoration':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Charming Touch':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Cloak Of Shadow':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Commanding Lash':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Competitive Edge':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Cry Of Destruction':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Darkened Eyes':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dazzling Flash':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  "Death's Call":
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Delusional Pride':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Destructive Aura':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Disperse Into Air':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Downpour':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  "Dreamer's Call":
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Enduring Might':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Eradicate Undeath':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Face In The Crowd':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Fire Ray':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Flame Barrier':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Forced Quiet':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Glimpse The Truth':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  "Healer's Blessing":
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Hurtling Stone':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Know The Enemy':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Localized Quake':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Lucky Break':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  "Magic's Vessel":
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Malignant Sustenance':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Moonbeam':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Mystic Beacon':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  "Nature's Bounty":
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Overstuff':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Perfected Form':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Perfected Mind':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Positive Luminance':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Precious Metals':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  "Protector's Sacrifice":
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  "Protector's Sphere":
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Pulse Of The City':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Pushing Gust':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Read Fate':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Rebuke Death':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Retributive Pain':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Safeguard Secret':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description="FILL"',
  'Savor The Sting':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Scholarly Recollection':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Shared Nightmare':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Soothing Words':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Splash Of Art':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Sudden Shift':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Sweet Dream':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description="FILL"',
  'Take Its Course':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Tempt Fate':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Tidal Surge':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Touch Of Obedience':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Touch Of The Moon':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Touch Of Undeath':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  "Traveler's Transit":
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  "Trickster's Twin":
    'Level=4 ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Unimpeded Stride':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Unity':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Veil Of Confidence':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Vibrant Thorns':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Waking Nightmare':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Weapon Surge':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Word Of Freedom':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Word Of Truth':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Zeal For Battle':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Goodberry':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Heal Animal':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Impaling Briars':
    'Level=8 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Primal Summons':
    'Level=6 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=Free ' +
    'Description="FILL"',
  'Storm Lord':
    'Level=9 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Stormwind Flight':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Tempest Surge':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Wild Morph':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Wild Shape':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Abundant Step':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Empty Body':
    'Level=9 ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ki Blast':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Ki Rush':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Ki Strike':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Quivering Palm':
    'Level=8 ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Wholeness Of Body':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Wild Winds Stance':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Wind Jump':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Aberrant Whispers':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Abyssal Wrath':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Ancestral Memories':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Angelic Halo':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Angelic Wings':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Arcane Countermeasure':
    'Level=5 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Celestial Brand':
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Diabolic Edict':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Dragon Breath':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Dragon Claws':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Dragon Wings':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Drain Life':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Elemental Blast':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Elemental Motion':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Elemental Toss':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Embrace The Pit':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Extend Spell':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Faerie Dust':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Fey Disappearance':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Fey Glamour':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  "Glutton's Jaws":
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Grasping Grave':
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Hellfire Plume':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Horrific Visage':
    'Level=3 ' +
    'School=Illusion ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Jealous Hex':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Swamp Of Sloth':
    'Level=3 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Tentacular Limbs':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  "Undeath's Blessing":
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Unusual Anatomy':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="FILL"',
  "You're Mine":
    'Level=5 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Augment Summoning':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Call Of The Grave':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Charming Words':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Dimensional Steps':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  "Diviner's Sight":
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Dread Aura':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Elemental Tempest':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Energy Absorption':
    'Level=4 ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Force Bolt':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Hand Of The Apprentice':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Invisibility Cloak':
    'Level=4 ' +
    'School=Illusion ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description="FILL"',
  'Life Siphon':
    'Level=4 ' +
    'School=Necromancy ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description="FILL"',
  'Physical Boost':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Protective Ward':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Shifting Form':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Vigilant Eye':
    'Level=4 ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"',
  'Warped Terrain':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="FILL"'
};
Pathfinder2E.TERRAINS = {
  'Aquatic':'',
  'Arctic':'',
  'Desert':'',
  'Forest':'',
  'Mountain':'',
  'Plains':'',
  'Sky':'',
  'Swamp':'',
  'Underground':''
};
Pathfinder2E.WEAPONS = {

  'Fist':
    'Category=Unarmed Price=0 Damage=1d4B Bulk=0 Hands=1 Group=Brawling Trait=Agile,Finesse,Nonlethal,Unarmed',

  'Club':
    'Category=Simple Price=0 Damage=1d6B Bulk=1 Hands=1 Group=Club Trait=Thrown Range=10',
  'Dagger':
    'Category=Simple Price=0.2 Damage=1d4P Bulk=L Hands=1 Group=Knife Trait=Agile,Finesse,Thrown,"Versatile S" Range=10',
  'Gauntlet':
    'Category=Simple Price=0.2 Damage=1d4B Bulk=L Hands=1 Group=Brawling Trait=Agile,Free-hand',
  'Light Mace':
    'Category=Simple Price=0.4 Damage=1d4B Bulk=L Hands=1 Group=Club Trait=Agile,Finesse,Shove',
  'Longspear':
    'Category=Simple Price=0.5 Damage=1d8P Bulk=2 Hands=2 Group=Spear Trait=Reach',
  'Mace':
    'Category=Simple Price=1 Damage=1d6B Bulk=1 Hands=1 Group=Club Trait=Shove',
  'Morningstar':
    'Category=Simple Price=1 Damage=1d6B Bulk=1 Hands=1 Group=Club Trait="Versatile P"',
  'Sickle':
    'Category=Simple Price=0.2 Damage=1d4S Bulk=L Hands=1 Group=Knife Trait=Agile,Finesse,Trip',
  'Spear':
    'Category=Simple Price=0.1 Damage=1d6P Bulk=1 Hands=1 Group=Spear Trait=Thrown Range=20',
  'Spiked Gauntlet':
    'Category=Simple Price=0.3 Damage=1d4P Bulk=L Hands=1 Group=Brawling Trait=Agile,Free-hand',
  'Staff':
    'Category=Simple Price=0 Damage=1d4B Bulk=1 Hands=1 Group=Club Trait="Two-hand d8"',

  'Clan Dagger':
    'Category=Simple Price=2 Damage=1d4P Bulk=L Hands=1 Group=Knife Trait=Agile,Dwarf,Parry,Uncommon,"Versatile B"',
  'Katar':
    'Category=Simple Price=0.3 Damage=1d4P Bulk=L Hands=1 Group=Knife Trait=Agile,"Deadly d6",Monk,Uncommon',

  'Bastard Sword':
    'Category=Martial Price=4 Damage=1d8S Bulk=1 Hands=1 Group=Sword Trait="Two-hand d12"',
  'Battle Axe':
    'Category=Martial Price=1 Damage=1d8S Bulk=1 Hands=1 Group=Axe Trait="Sweep"',
  'Bo Staff':
    'Category=Martial Price=0.2 Damage=1d8B Bulk=2 Hands=2 Group=Club Trait=Monk,Parry,Reach,Trip',
  'Falchion':
    'Category=Martial Price=3 Damage=1d10S Bulk=2 Hands=2 Group=Sword Trait=Forceful,Sweep',
  'Flail':
    'Category=Martial Price=0.8 Damage=1d6B Bulk=1 Hands=1 Group=Flail Trait=Disarm,Sweep,Trip',
  'Glaive':
    'Category=Martial Price=1 Damage=1d8S Bulk=2 Hands=2 Group=Polearm Trait="Deadly d8",Forceful,Reach',
  'Greataxe':
    'Category=Martial Price=2 Damage=1d12S Bulk=2 Hands=2 Group=Axe Trait=Sweep',
  'Greatclub':
    'Category=Martial Price=1 Damage=1d10B Bulk=2 Hands=2 Group=Club Trait=Backswing,Shove',
  'Greatpick':
    'Category=Martial Price=1 Damage=1d10P Bulk=2 Hands=2 Group=Pick Trait="Fatal d12"',
  'Greatsword':'Category=Martial Price=2 Damage=1d12S Bulk=2 Hands=2 Group=Sword Trait="Versatile P"',
  'Guisarme':'Category=Martial Price=2 Damage=1d10S Bulk=2 Hands=2 Group=Polearm Trait=Reach,Trip',
  'Halberd':'Category=Martial Price=2 Damage=1d10P Bulk=2 Hands=2 Group=Polearm Trait=Reach,"Versatile S"',
  'Hatchet':
    'Category=Martial Price=0.4 Damage=1d6S Bulk=L Hands=1 Group=Axe Trait=Agile,Sweep,Thrown Range=10',
  'Lance':
    'Category=Martial Price=1 Damage=1d8P Bulk=2 Hands=2 Group=Spear Trait="Deadly d8","Jousting d6",Reach',
  'Light Hammer':
    'Category=Martial Price=0.3 Damage=1d6B Bulk=L Hands=1 Group=Hammer Trait=Agile,Thrown Range=20',
  'Light Pick':
    'Category=Martial Price=0.4 Damage=1d4P Bulk=L Hands=1 Group=Pick Trait=Agile,"Fatal d8"',
  'Longsword':
    'Category=Martial Price=1 Damage=1d8S Bulk=1 Hands=1 Group=Sword Trait="Versatile P"',
  'Main-gauche':
    'Category=Martial Price=0.5 Damage=1d4P Bulk=L Hands=1 Group=Knife Trait=Agile,Disarm,Finesse,Parry,"Versatile S"',
  'Maul':
    'Category=Martial Price=3 Damage=1d12B Bulk=2 Hands=2 Group=Hammer Trait=Shove',
  'Pick':
    'Category=Martial Price=0.7 Damage=1d6P Bulk=1 Hands=1 Group=Pick Trait="Fatal d10"',
  'Ranseur':
    'Category=Martial Price=2 Damage=1d10P Bulk=2 Hands=2 Group=Polearm Trait=Disarm,Reach',
  'Rapier':
    'Category=Martial Price=2 Damage=1d6P Bulk=1 Hands=1 Group=Sword Trait="Deadly d8",Disarm,Finesse',
  'Sap':
    'Category=Martial Price=0.1 Damage=1d6B Bulk=L Hands=1 Group=Club Trait=Agile,Nonlethal',
  'Scimitar':
    'Category=Martial Price=1 Damage=1d6S Bulk=1 Hands=1 Group=Sword Trait=Forceful,Sweep',
  'Scythe':
    'Category=Martial Price=2 Damage=1d10S Bulk=2 Hands=2 Group=Polearm Trait="Deadly d10",Tripe',
  // TODO Shield bash, boss, spikes
  'Shortsword':
   'Category=Martial Price=0.9 Damage=1d6P Bulk=L Hands=1 Group=Sword Trait=Agile,Finesse,"Versatile S"',
  'Starknife':
    'Category=Martial Price=2 Damage=1d4P Bulk=L Hands=1 Group=Knife Trait=Agile,"Deadly d6",Finesse,Thrown,"Versatile S" Range=20',
  'Trident':
    'Category=Martial Price=1 Damage=1d8P Bulk=1 Hands=1 Group=Spear Trait=Thrown Range=20',
  'War Flail':
    'Category=Martial Price=2 Damage=1d10B Bulk=2 Hands=2 Group=Flail Trait=Disarm,Sweep,Trip',
  'Warhammer':
    'Category=Martial Price=1 Damage=1d8B Bulk=1 Hands=1 Group=Hammer Trait=Shove',
  'Whip':
    'Category=Martial Price=0.1 Damage=1d4S Bulk=1 Hands=1 Group=Flail Trait=Disarm,Finesse,Nonlethal,Trip',

  'Dogslicer':
    'Category=Martial Price=0.1 Damage=1d6S Bulk=L Hands=1 Group=Sword Trait=Agile,Backstabber,Finesse,Goblin,Uncommon',
  'Elven Curve Blade':
    'Category=Martial Price=4 Damage=1d8S Bulk=2 Hands=2 Group=Sword Trait=Elf,Finesse,Forceful,Uncommon',
  "Filcher's Fork":
    'Category=Martial Price=1 Damage=1d4P Bulk=L Hands=1 Group=Spear Trait=Agile,Backstabber,"Deadly d6",Finesse,Halfling,Thrown,Uncommon Range=20',
  'Gnome Hooked Hammer':
    'Category=Martial Price=2 Damage=1d6B Bulk=1 Hands=1 Group=Hammer Trait=Gnome,Trip,"Two-hand d10",Uncommon,"Versatile P"',
  'Horsechopper':
    'Category=Martial Price=0.9 Damage=1d8S Bulk=2 Hands=2 Group=Polearm Trait=Goblin,Reach,Trip,Uncommon,"Versatile P"',
  'Kama':
    'Category=Martial Price=1 Damage=1d6S Bulk=L Hands=1 Group=Knife Trait=Agile,Monk,Trip,Uncommon',
  'Katana':
    'Category=Martial Price=2 Damage=1d6S Bulk=1 Hands=1 Group=Sword Trait="Deadly d8","Two-hand d10","Versatile P"',
  'Kukri':
    'Category=Martial Price=0.6 Damage=1d6S Bulk=L Hands=1 Group=Knife Trait=Agile,Finesse,Trip',
  'Nunchaku':
    'Category=Martial Price=0.2 Damage=1d6B Bulk=L Hands=1 Group=Club Trait=Backswing,Disarm,Finesse,Monk,Uncommon',
  'Orc Knuckle Dragger':
    'Category=Martial Price=0.7 Damage=1d6P Bulk=L Hands=1 Group=Knife Trait=Agile,Disarm,Orc,Uncommon',
  'Sai':
    'Category=Martial Price=0.6 Damage=1d4P Bulk=L Hands=1 Group=Knife Trait=Agile,Disarm,Finesse,Monk,Uncommon,"Versatile B"',
  'Spiked Chain':
    'Category=Martial Price=3 Damage=1d8S Bulk=1 Hands=2 Group=Flail Trait=Disarm,Finesse,Trip,Uncommon',
  'Temple Sword':'Category=Martial Price=2 Damage=1d8S Bulk=1 Hands=1 Group=Sword Trait=Monk,Trip,Uncommon',

  'Dwarven Waraxe':
    'Category=Advanced Price=3 Damage=1d8S Bulk=2 Hands=1 Group=Axe Trait=Dwarf,Sweep,"Two-hand d12",Uncommon',
  'Gnome Flickmace':
    'Category=Advanced Price=3 Damage=1d6B Bulk=1 Hands=1 Group=Flail Trait=Gnome,Reach,Sweep,Uncommon',
  'Orc Necksplitter':
    'Category=Advanced Price=2 Damage=1d8S Bulk=1 Hands=1 Group=Axe Trait=Forceful,Orc,Sweep,Uncommon',
  'Sawtooth Saber':
    'Category=Advanced Price=5 Damage=1d6S Bulk=L Hands=1 Group=Sword Trait=Agile,Finesse,Twin,Uncommon',

  'Blowgun':
    'Category=Simple Price=0.1 Damage=1P Bulk=L Hands=1 Group=Dart Trait=Agile,Nonlethal,"Reload 1" Range=20',
  'Crossbow':
    'Category=Simple Price=3 Damage=1d8P Bulk=1 Hands=2 Group=Bow Trait="Reload 1", Range=120',
  'Dart':
    'Category=Simple Price=0.01 Damage=1d4P Bulk=L Hands=1 Group=Dart Trait=Agile,Thrown Range=20',
  'Hand Crossbow':
    'Category=Simple Price=3 Damage=1d6P Bulk=L Hands=1 Group=Bow Trait="Reload 1", Range=60',
  'Heavy Crossbow':
    'Category=Simple Price=4 Damage=1d10P Bulk=2 Hands=2 Group=Bow Trait="Reload 2", Range=120',
  'Javelin':
    'Category=Simple Price=0.1 Damage=1d6P Bulk=L Hands=1 Group=Dart Trait=Thrown Range=30',
  'Sling':
    'Category=Simple Price=0 Damage=1d6B Bulk=L Hands=1 Group=Sling Trait=Propulsive,"Reload 1" Range=50',

  'Lesser Acid Flask':
    'Category=Martial Price=0 Damage=1E Bulk=L Hands=1 Group=Bomb Trait=Thrown,Splash Range=20',
  "Lesser Alchemist's Fire":
    'Category=Martial Price=0 Damage=1d8E Bulk=L Hands=1 Group=Bomb Trait=Thrown,Splash Range=20',
  'Lesser Bottled Lightning':
    'Category=Martial Price=0 Damage=1d6E Bulk=L Hands=1 Group=Bomb Trait=Thrown,Splash Range=20',
  'Lesser Frost Vial':
    'Category=Martial Price=0 Damage=1d6E Bulk=L Hands=1 Group=Bomb Trait=Thrown,Splash Range=20',
  'Lesser Tanglefoot Bag':
    'Category=Martial Price=0 Damage=0E Bulk=L Hands=1 Group=Bomb Trait=Thrown Range=20',
  'Lesser Thunderstone':
    'Category=Martial Price=0 Damage=1d4E Bulk=L Hands=1 Group=Bomb Trait=Thrown,Splash Range=20',
  'Composite Longbow':
    'Category=Martial Price=20 Damage=1d8P Bulk=2 Hands=2 Group=Bow Trait="Deadly d10",Propulsive,"Volley 30\'" Range=100',
  'Composite Shortbow':
    'Category=Martial Price=14 Damage=1d6P Bulk=1 Hands=2 Group=Bow Trait="Deadly d10",Propulsive Range=60',
  'Longbow':
    'Category=Martial Price=6 Damage=1d8P Bulk=2 Hands=2 Group=Bow Trait="Deadly d10","Volley 30\'" Range=100',
  'Shortbow':
    'Category=Martial Price=3 Damage=1d6P Bulk=1 Hands=2 Group=Bow Trait="Deadly d10" Range=60',
  'Halfling Sling Staff':
    'Category=Martial Price=5 Damage=1d10B Bulk=1 Hands=2 Group=Sling Trait=Halfling,Propulsive,Uncommon,"Reload 1" Range=80',
  'Shuriken':
    'Category=Martial Price=0.01 Damage=1d4P Bulk=0 Hands=1 Group=Dart Trait=Agile,Monk,Thrown,Uncommon Range=20'

};

Pathfinder2E.RANK_NAMES =
  ['untrained', 'trained', 'expert', 'master', 'legendary'];

/* Defines the rules related to character abilities. */
Pathfinder2E.abilityRules = function(rules, abilities) {

  for(let a in abilities) {
    rules.defineChoice('notes', a + ':%V (%1)');
    rules.defineRule(a,
      // TODO ability boosts add only 1 above 18
      'abilityBoosts.' + a, '+', 'source * 2',
      '', 'v', '20'
    );
    rules.defineRule(a + 'Modifier', a, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule
      (a + '.1', a + 'Modifier', '=', 'source>=0 ? "+" + source : source');
    rules.defineRule
      ('abilityBoostsAllocated', 'abilityBoosts.' + a, '+=', null);
  }

  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitutionModifier', '=', null,
    'level', '*', null
  );
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  QuilvynRules.validAllocationRules
    (rules, 'abilityBoost', 'choiceCount.Ability', 'abilityBoostsAllocated');

};

/* Defines the rules related to combat. */
Pathfinder2E.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable
    (armors, ['Category', 'Price', 'AC', 'Dex', 'Check', 'Speed', 'Str', 'Bulk', 'Group', 'Trait']);
  QuilvynUtils.checkAttrTable
    (shields, ['Price', 'AC', 'Speed', 'Bulk', 'Hardness', 'HP']);
  QuilvynUtils.checkAttrTable
    (weapons, ['Category', 'Price', 'Damage', 'Bulk', 'Hands', 'Group', 'Trait', 'Range']);

  for(let a in armors)
    rules.choiceRules(rules, 'Armor', a, armors[a]);
  for(let s in shields)
    rules.choiceRules(rules, 'Shield', s, shields[s]);
  for(let w in weapons) {
    let pattern = w.replace(/  */g, '\\s+');
    rules.choiceRules(rules, 'Goody', w,
      // To avoid triggering additional weapons with a common suffix (e.g.,
      // "* punching dagger +2" also makes regular dagger +2), require that
      // weapon goodies with a trailing value have no preceding word or be
      // enclosed in parentheses.
      'Pattern="([-+]\\d)\\s+' + pattern + '|(?:^\\W*|\\()' + pattern + '\\s+([-+]\\d)" ' +
      'Effect=add ' +
      'Attribute="weaponAttackAdjustment.' + w + '","weaponDamageAdjustment.' + w + '" ' +
      'Value="$1 || $2" ' +
      'Section=combat Note="%V Attack and damage"'
    );
    rules.choiceRules(rules, 'Weapon', w, weapons[w]);
  }

  rules.defineChoice('notes',
    'abilityNotes.armorSpeedPenalty:%V Speed',
    'armorClass:%V (dexterity%1; %2)',
    'shield:%V%1%2%3%4',
    'skillNotes.armorSkillPenalty:%V strength and dexterity skills'
  );
  rules.defineRule('training.Armor',
    'armorCategory', '=', '0',
    'training.Unarmored Defense', '=', 'dict["armorCategory"]=="Unarmored" ? source : null',
    'training.Light Armor', '=', 'dict["armorCategory"]=="Light" ? source : null',
    'training.Medium Armor', '=', 'dict["armorCategory"]=="Medium" ? source : null',
    'training.Heavy Armor', '=', 'dict["armorCategory"]=="Heavy" ? source : null'
  );
  rules.defineRule('rank.Armor', 'training.Armor', '=', null);
  rules.defineRule('proficiencyLevelBonus.Armor',
    'rank.Armor', '=', 'source>0 ? 0 : null',
    'level', '+', null
  );
  rules.defineRule('proficiencyBonus.Armor',
    'rank.Armor', '=', '2 * source',
    'proficiencyLevelBonus.Armor', '+', null
  );
  rules.defineRule('armorClass',
    '', '=', '10',
    'proficiencyBonus.Armor', '+', null,
    'armorACBonus', '+', null,
    'combatNotes.dexterityArmorClassAdjustment', '+', null
  );
  rules.defineRule('armorClass.1',
    '', '=', '""',
    'armorDexterityCap', '=', '" (" + source + " max)"'
  );
  rules.defineRule
    ('armorClass.2', 'rank.Armor', '=', 'Pathfinder2E.RANK_NAMES[source]');
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterityModifier', '=', null,
    'armorDexterityCap', 'v', null
  );
  rules.defineRule('shield.1',
    '', '=', '""',
    'shieldACBonus', '=', 'source>0 ? " (+" + source + " AC when raised" : ""'
  );
  rules.defineRule('shield.2',
    '', '=', '""',
    'shieldHardness', '=', 'source>0 ? "; hardness " + source : ""'
  );
  rules.defineRule('shield.3',
    '', '=', '""',
    'shieldHP', '=', 'source>0 ? "; HP " + source : ""'
  );
  rules.defineRule('shield.4',
    '', '=', '""',
    'shieldACBonus', '=', 'source>0 ? ")" : ""'
  );

  rules.defineRule('abilityNotes.armorSpeedPenalty',
    'armorSpeedReduction', '=', null,
    'armorStrengthRequirement', '=', 'null',
    'strength', '?', 'source<dict["armorStrengthRequirement"]'
  );
  rules.defineRule
    ('combatNotes.dexterityAttackAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthAttackAdjustment', 'strengthModifier', '=', null);
  // For weapons with the finesse trait
  rules.defineRule('maxStrOrDexModifier',
    'strengthModifier', '=', null,
    'dexterityModifier', '^', null
  );
  rules.defineRule('maxStrOrDex',
    'maxStrOrDexModifier', '=', 'source==dict.strengthModifier ? "strength" : "dexterity"'
  );
  rules.defineRule('skillNotes.armorSkillPenalty',
    'armorCheckPenalty', '=', null,
    'armorStrengthRequirement', '=', 'null',
    'strength', '?', 'source<dict["armorStrengthRequirement"]'
  );
  rules.defineRule('speed', 'abilityNotes.armorSpeedPenalty', '+', null);

  let saves =
    {'Fortitude':'constitution', 'Reflex':'dexterity', 'Will':'wisdom'};
  for(let s in saves) {
    rules.defineChoice('notes', 'save.' + s + ':%S (' + saves[s] + '; %1)');
    rules.defineRule('training.' + s, '', '=', '0');
    rules.defineRule('rank.' + s, 'training.' + s, '=', null);
    rules.defineRule('proficiencyLevelBonus.' + s,
      'rank.' + s, '?', 'source > 0',
      'level', '=', null
    );
    rules.defineRule('proficiencyBonus.' + s,
      'rank.' + s, '=', '2 * source',
      'proficiencyLevelBonus.' + s, '+', null
    );
    rules.defineRule('save.' + s,
      'proficiencyBonus.' + s, '=', null,
      saves[s] + 'Modifier', '+', null,
      'skillNotes.goodies' + s + 'Adjustment', '+', null
    );
    rules.defineRule('save.' + s + '.1',
      'rank.' + s, '=', 'Pathfinder2E.RANK_NAMES[source]'
    );
  }

};

/* Defines rules related to basic character identity. */
Pathfinder2E.identityRules = function(
  rules, alignments, ancestries, backgrounds, classes, deities
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable(ancestries, ['Require', 'Features', 'Selectables', 'HitPoints', 'Size', 'Languages', 'Traits']);
  QuilvynUtils.checkAttrTable(backgrounds, ['Features']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitPoints', 'Ability', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'SpellSlots']);
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
  rules.defineRule('abilityNotes.abilityBoosts',
    'level', '=', '4 + Math.floor(source / 5) * 4'
  );
  rules.defineRule('featureNotes.ancestryFeats',
    'level', '=', 'Math.floor((source + 3) / 4)'
  );
  rules.defineRule('featureNotes.generalFeats',
    'level', '=', 'source>=3 ? Math.floor((source + 1) / 4) : null'
  );
  rules.defineRule('featureNotes.skillFeats',
    'level', '=', 'source>=2 ? Math.floor(source / 2) : null'
  );
  rules.defineRule('skillNotes.skillIncreases',
    'level', '=', 'source>=3 ? Math.floor((source - 1) / 2) : null'
  );
  rules.defineRule
    ('featCount.Ancestry', 'featureNotes.ancestryFeats', '=', null);
  rules.defineRule('featCount.General', 'featureNotes.generalFeats', '=', null);
  rules.defineRule('featCount.Skill', 'featureNotes.skillFeats', '=', null);
  rules.defineRule('speed',
    '', '=', '25',
    'elfLevel', '+', '5'
  );
  QuilvynRules.validAllocationRules
    (rules, 'level', 'level', 'Sum "^levels\\."');

};

/* Defines rules related to magic use. */
Pathfinder2E.magicRules = function(rules, schools, spells) {

  QuilvynUtils.checkAttrTable(schools, ['Features']);
  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Level', 'Traditions', 'Cast', 'Description']);

  for(let s in schools)
    rules.choiceRules(rules, 'School', s, schools[s]);
  for(let s in spells)
    rules.choiceRules(rules, 'Spell', s, spells[s]);

};

/* Defines rules related to character aptitudes. */
Pathfinder2E.talentRules = function(
  rules, feats, features, goodies, languages, skills, terrains
) {

  let matchInfo;

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Category']);
  QuilvynUtils.checkAttrTable(terrains, []);

  for(let g in goodies)
    rules.choiceRules(rules, 'Goody', g, goodies[g]);
  for(let l in languages) {
    rules.choiceRules(rules, 'Language', l, languages[l]);
    rules.defineRule('languagesSpoken', 'languages.' + l, '+=', '1');
  }
  for(let t in terrains)
    rules.choiceRules(rules, 'Terrain', t, terrains[t]);
  for(let s in skills) {
    rules.choiceRules(rules, 'Skill', s, skills[s]);
    rules.defineRule
      ('skillIncreasesAllocated', 'skillIncreases.' + s, '+=', null);
  }
  for(let f in feats) {
    if((matchInfo = f.match(/(%(\w+))/)) != null) {
      for(let c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Feat', f.replace(matchInfo[1], c), feats[f].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Feat', f, feats[f]);
    }
  }
  for(let f in features) {
    if((matchInfo = f.match(/(%(\w+))/)) != null) {
      for(let c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Feature', f.replace(matchInfo[1], c), features[f].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Feature', f, features[f]);
    }
  }

  rules.defineRule
    ('languageCount', 'skillNotes.intelligenceLanguageBonus', '+', null);
  rules.defineChoice('notes',
    'perception:%S (wisdom; %1)',
    'skillNotes.intelligenceLanguageBonus:+%V Language Count'
  );
  rules.defineRule('training.Perception', '', '=', '0');
  rules.defineRule('rank.Perception', 'training.Perception', '=', null);
  rules.defineRule('proficiencyLevelBonus.Perception',
    'rank.Perception', '?', 'source > 0',
    'level', '=', null
  );
  rules.defineRule('proficiencyBonus.Perception',
    'rank.Perception', '=', '2 * source',
    'proficiencyLevelBonus.Perception', '+', null
  );
  rules.defineRule('perception',
    'proficiencyBonus.Perception', '=', null,
    'wisdomModifier', '+', null,
    'skillNotes.goodiesPerceptionAdjustment', '+', null
  );
  rules.defineRule('perception.1',
    'rank.Perception', '=', 'Pathfinder2E.RANK_NAMES[source]'
  );
  rules.defineRule('skillNotes.intelligenceLanguageBonus',
    'intelligenceModifier', '=', 'source>0 ? source : null'
  );
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'languagesSpoken');
  QuilvynRules.validAllocationRules
    (rules, 'skillIncrease', 'choiceCount.Skill', 'skillIncreasesAllocated');

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
      QuilvynUtils.getAttrValue(attrs, 'Size'),
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
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Price'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Check'),
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Bulk'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValueArray(attrs, 'Trait')
    );
  else if(type == 'Class') {
    Pathfinder2E.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Pathfinder2E.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Pathfinder2E.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Font'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValue(attrs, 'Weapon'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells')
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
      QuilvynUtils.getAttrValue(attrs, 'Price'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
      QuilvynUtils.getAttrValue(attrs, 'Bulk'),
      QuilvynUtils.getAttrValue(attrs, 'Hardness'),
      QuilvynUtils.getAttrValue(attrs, 'HP')
    );
  else if(type == 'Skill')
    Pathfinder2E.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'Category')
    );
  else if(type == 'Spell') {
    let level = QuilvynUtils.getAttrValue(attrs, 'Level');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let trads = QuilvynUtils.getAttrValueArray(attrs, 'Traditions');
    name += ' (' + trads.map(x => x.charAt(0)).join('/') + (level=='Cantrip' ? 0 : level) + ' ' + school.substring(0, 4) + ')';
    Pathfinder2E.spellRules(rules, name,
      school,
      level,
      trads,
      QuilvynUtils.getAttrValue(attrs, 'Cast'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  } else if(type == 'Terrain')
    Pathfinder2E.terrainRules(rules, name);
  else if(type == 'Weapon')
    Pathfinder2E.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Price'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Bulk'),
      QuilvynUtils.getAttrValue(attrs, 'Hands'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValueArray(attrs, 'Trait'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  type = type == 'Class' ? 'levels' :
         (type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
  rules.addChoice(type, name, attrs);
};

/*
 * Removes #name# from the set of user #type# choices, reversing the effects of
 * choiceRules.
 */
Pathfinder2E.removeChoice = function(rules, type, name) {
  let group =
    type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's';
  let choices = rules.getChoices(group);
  if(!choices)
    return;
  let currentAttrs = choices[name];
  if(currentAttrs) {
    delete choices[name];
    // Q defines no way to delete rules outright; instead, we override with a
    // noop all rules that have the removed choice as their source
    if(type.match(/^(Armor|Deity|Shield)$/)) {
      // Remove this item from rules' cached item stats ...
      let stats = rules[type.toLowerCase() + 'Stats'];
      if(stats) {
        for(let s in stats)
          delete stats[s][name];
      }
      // ... and force a recomputation of associated rules
      let first = Object.keys(choices)[0];
      if(first)
        rules.choiceRules(rules, type, first, choices[first]);
    } else if(type.match(/^(Class|NPC|Prestige|Race)$/)) {
      let prefix =
        name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
      let level = type == 'Race' ? prefix + 'Level' : ('levels.' + name);
      let targets = rules.allTargets(level);
      targets.forEach(x => {
        rules.defineRule(x, level, '=', 'null');
      });
    } else if(type.match(/^(Class|Race) Feature/)) {
      let base = QuilvynUtils.getAttrValue(currentAttrs, 'Class') ||
                 QuilvynUtils.getAttrValue(currentAttrs, 'Race');
      let prefix =
        base.charAt(0).toLowerCase() + base.substring(1).replaceAll(' ', '');
      let source =
        QuilvynUtils.getAttrValue(currentAttrs, 'Selectable') != null ?
          'selectableFeatures.' + base + ' - ' + name :
        type.includes('Class') ? 'levels.' + base : (prefix + 'Level');
      rules.defineRule(prefix + 'Features.' + name, source, '=', 'null');
    } else {
      let source =
        type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') +
        (type.match(/^(Feat|Feature|Skill)$/) ? 's' : '') +
        '.' + name;
      let targets = rules.allTargets(source);
      targets.forEach(x => {
        rules.defineRule(x, source, '=', 'null');
      });
      delete rules.getChoices('notes')[group + '.' + name];
    }
  } else if(choices && type == 'Spell') {
    let notes = rules.getChoices('notes');
    let potions = rules.getChoices('potions');
    let scrolls = rules.getChoices('scrolls');
    QuilvynUtils.getKeys(choices, '^' + name + '\\(').forEach(s => {
      delete choices[s];
      delete notes['spells.' + s];
      if(potions) {
        delete potions[s.replace('(', ' Oil (')];
        delete potions[s.replace('(', ' Potion (')];
        delete notes['potions.' + s.replace('(', ' Oil (')];
        delete notes['potions.' + s.replace('(', ' Potion (')];
      }
      if(scrolls) {
        delete scrolls[s];
        delete notes['scrolls.' + s];
      }
    });
  }
  // If this choice overloaded a plugin-defined one (e.g., a homebrew Fighter
  // class), restore the plugin version
  let constantName = type.toUpperCase().replaceAll(' ', '_') + 'S';
  let plugins = rules.getPlugins();
  if(rules.plugin)
    plugins.push(rules.plugin);
  for(let i = 0; i < plugins.length; i++) {
    let p = plugins[i];
    if(p[constantName] &&
       name in p[constantName] &&
       p[constantName][name] != currentAttrs) {
      rules.choiceRules(rules, type, name, p[constantName][name]);
      break;
    }
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
 * list of hard prerequisites #requires#. #features# and #heritages# list
 * associated features and available heritages, and #languages# any automatic
 * languages. #hitPoints# gives the number of HP granted at level 1, and #size#
 * specifies the size of characters with the ancestry.
 */
Pathfinder2E.ancestryRules = function(
  rules, name, requires, hitPoints, size, features, heritages, traits, languages
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
  if(!(size+'').match(/^(Small|Medium|Large)$/)) {
    console.log('Bad size "' + size + '" for ancestry ' + name);
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(heritages)) {
    console.log('Bad heritages list "' + heritages + '" for ancestry ' + name);
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

  rules.defineRule
    ('selectableFeatureCount.' + name + ' (Heritage)', ancestryLevel, '=', '1');

  if(languages.length > 0) {
    rules.defineRule('languageCount', ancestryLevel, '=', languages.length);
    for(let i = 0; i < languages.length; i++) {
      if(languages[i] != 'any')
        rules.defineRule('languages.' + languages[i], ancestryLevel, '=', '1');
    }
  }

  Pathfinder2E.featureListRules(rules, features, name, ancestryLevel, false);
  Pathfinder2E.featureListRules(rules, heritages, name, ancestryLevel, true);
  heritages.forEach(h => {
    h = h.replace(/^\d+:/, '').replace(/:.*/, '');
    rules.defineRule('heritage', 'features.' + h, '=', '"' + h + '"');
    rules.defineRule(prefix + 'SelectedHeritageCount',
      'selectableFeatures.' + name + ' - ' + h, '+=', '1'
    );
  });
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');
  rules.defineRule('hitPoints', ancestryLevel, '+=', hitPoints);
  rules.defineRule('size', ancestryLevel, '=', '"' + size + '"');
  QuilvynRules.validAllocationRules
    (rules, prefix + 'Heritage', 'selectableFeatureCount.' + name + ' (Heritage)', prefix + 'SelectedHeritageCount');

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
Pathfinder2E.ancestryRulesExtra = function(rules, name) {
  if(name == 'Dwarf') {
    rules.defineRule('abilityNotes.armorSpeedPenalty',
      'abilityNotes.unburdenedIron', '^', '0'
    );
    rules.defineRule('features.Call On Ancient Blood',
      'featureNotes.ancient-BloodedDwarf', '=', 'null' // italics
    );
    rules.defineRule
      ('spells.Meld Into Stone', 'magicNotes.stonewalker', '=', '1');
    rules.defineRule('weapons.Clan Dagger', 'features.Clan Dagger', '=', '1');
  } else if(name == 'Elf') {
    rules.defineRule('features.Darkvision', 'featureNotes.cavernElf', '=', '1');
    rules.defineRule('spells.Detect Magic', 'magicNotes.seerElf', '=', '1');
  } else if(name == 'Gnome') {
    rules.defineRule
      ('features.Darkvision', 'featureNotes.umbralGnome', '=', '1');
  } else if(name == 'Halfling') {
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.twilightHalfling', '=', '1');
    rules.defineRule('skillNotes.nomadicHalfling',
      '', '=', '2',
      'features.Multilingual', '+', null
    );
  } else if(name == 'Human') {
    rules.defineRule('choiceCount.Skill',
      'skillNotes.skilledHeritageHuman', '+=', 'source=="Trained" ? 1 : 2'
    );
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.half-Elf', '=', '1');
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.half-Orc', '=', '1');
    rules.defineRule('skillNotes.skilledHeritageHuman',
      'level', '=', 'source<5 ? "Trained" : "Expert"'
    );
  }
};

/*
 * Defines in #rules# the rules associated with armor #name#, which costs
 * #price# gold pieces, belongs to category #category#, adds #ac# to the
 * character's armor class, allows a maximum dex bonus to ac of #maxDex#,
 * imposes #checkPenalty# on specific skills, slows the character by
 * #speedPenalty#, requires a strength of at least #minStr# to use, adds #bulk#
 * to the character's burden, belongs to group #group#, and has the list of
 * traits #traits#.
 */
Pathfinder2E.armorRules = function(
  rules, name, category, price, ac, maxDex, checkPenalty, speedPenalty, minStr,
  bulk, group, traits
) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(typeof category != 'string' ||
     !category.match(/^(Unarmored|Light|Medium|Heavy)$/)) {
    console.log('Bad category "' + category + '" for armor ' + name);
    return;
  }
  if(typeof price == 'string' && price.match(/^0\.\d+$/))
    price = +price;
  if(typeof price != 'number') {
    console.log('Bad price "' + price + '" for armor ' + name);
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for armor ' + name);
    return;
  }
  if(maxDex && typeof maxDex != 'number') {
    console.log('Bad max dex "' + maxDex + '" for armor ' + name);
    return;
  }
  if(typeof checkPenalty != 'number') {
    console.log('Bad check penalty "' + checkPenalty + '" for armor ' + name);
    return;
  }
  if(typeof speedPenalty != 'number') {
    console.log('Bad speed penalty "' + speedPenalty + '" for armor ' + name);
    return;
  }
  if(typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(bulk == 'L')
    bulk = 0.1;
  if(typeof bulk != 'number') {
    console.log('Bad bulk "' + bulk + '" for armor ' + name);
    return;
  }
  if(group != null && typeof group != 'string') {
    console.log('Bad group "' + group + '" for armor ' + name);
    return;
  }

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      category:{},
      dex:{},
      check:{},
      speed:{},
      str:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.category[name] = category;
  rules.armorStats.dex[name] = maxDex;
  rules.armorStats.check[name] = checkPenalty;
  rules.armorStats.speed[name] = speedPenalty;
  rules.armorStats.str[name] = minStr;

  rules.defineRule('armorACBonus',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.ac) + '[source]'
  );
  rules.defineRule('armorCategory',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.category) + '[source]'
  );
  rules.defineRule('armorCheckPenalty',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.check) + '[source]'
  );
  rules.defineRule('armorDexterityCap',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.dex) + '[source]'
  );
  rules.defineRule('armorSpeedReduction',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.speed) + '[source]'
  );
  rules.defineRule('armorStrengthRequirement',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.str) + '[source]'
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
 * of hard prerequisites #requires#. The class grants #hitPoints# additional
 * hit points with each level advance. #features# and #selectables# list the
 * fixed and selectable features acquired as the character advances in class
 * level, and #languages# lists any automatic languages for the class.
 * #spellSlots# lists the number of spells per level per day that the class can
 * cast, and #spells# lists spells defined by the class. #spellDict# is the
 * dictionary of all spells used to look up individual spell attributes.
 */
Pathfinder2E.classRules = function(
  rules, name, requires, abilities, hitPoints, features, selectables,
  languages, spellSlots
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

  let validatedSelectionTypes = [];
  selectables.forEach(s => {
    let pieces = s.split(':');
    let selectionType = pieces[2].replaceAll(' ', '');
    rules.defineRule(prefix + 'Selected' + selectionType + 'Count',
      'selectableFeatures.' + name + ' - ' + pieces[1], '+=', '1'
    );
    if(!validatedSelectionTypes.includes(selectionType)) {
      QuilvynRules.validAllocationRules
        (rules, prefix + selectionType, 'selectableFeatureCount.' + name + ' (' + pieces[2] + ')', prefix + 'Selected' + selectionType + 'Count');
      validatedSelectionTypes.push(selectionType);
    }
  });

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

  if(spellSlots.length > 0) {
    QuilvynRules.spellSlotRules(rules, classLevel, spellSlots);
    for(let j = 0; j < spellSlots.length; j++) {
      let spellTypeAndLevel = spellSlots[j].replace(/:.*/, '');
      let spellType = spellTypeAndLevel.replace(/\d+/, '');
      spellType =
        spellType == 'A' ? 'Arcane' :
        spellType == 'D' ? 'Divine' :
        spellType == 'O' ? 'Occult' :
        spellType == 'P' ? 'Primal' : spellType;
      let spellLevel = spellTypeAndLevel.replace(spellType, '');
      let spellModifier = abilities[0] + 'Modifier';
      rules.defineChoice('notes',
        'spellAttackModifier.' + spellType + ':%S (' + abilities[0] + '; %1)',
        'spellDifficultyClass.' + spellType + ':%V (' + abilities[0] + '; %1)'
      );
      rules.defineRule('rank.' + spellType, 'training.' + spellType, '=', null);
      rules.defineRule('proficiencyLevelBonus.' + spellType,
        'rank.' + spellType, '?', 'source > 0',
        'level', '=', null
      );
      rules.defineRule('proficiencyBonus.' + spellType,
        'rank.' + spellType, '=', '2 * source',
        'proficiencyLevelBonus.' + spellType, '+', null
      );
      rules.defineRule('spellAttackModifier.' + spellType,
        'proficiencyBonus.' + spellType, '=', null,
        spellModifier, '+', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'proficiencyBonus.' + spellType, '=', null,
        spellModifier, '+', '8 + source'
      );
      rules.defineRule('spellAttackModifier.' + spellType + '.1',
        'rank.' + spellType, '=', 'Pathfinder2E.RANK_NAMES[source]'
      );
      rules.defineRule('spellDifficultyClass.' + spellType + '.1',
        'rank.' + spellType, '=', 'Pathfinder2E.RANK_NAMES[source]'
      );
    }
  }

  rules.defineRule('featureNotes.' + prefix + 'Feats',
    classLevel, '=', 'Math.floor(source / 2)' + (features.includes('1:' + name + ' Feats') ? ' + 1' : '')
  );
  rules.defineRule
    ('featCount.Class', 'featureNotes.' + prefix + 'Feats', '+=', null);

  rules.defineChoice('notes', 'classDifficultyClass.' + name + ':%V (%1; %2)');
  rules.defineRule('rank.' + name, 'training.' + name, '=', null);
  rules.defineRule
    ('classDifficultyClass.' + name + '.1', '', '=', '"' + abilities[0] + '"');
  let classAbilityModifier = abilities[0] + 'Modifier';
  if(abilities.length > 1) {
    classAbilityModifier = 'bestAbilityModifier.' + name;
    rules.defineRule(classAbilityModifier, classLevel, '?', null);
    abilities.forEach(a => {
      rules.defineRule
        (classAbilityModifier, a + 'Modifier', '^=', null);
      rules.defineRule('classDifficultyClass.' + name + '.1',
        a + 'Modifier', '=', 'dict["' + classAbilityModifier + '"]==source ? "' + a + '" : null'
      );
    });
  }
  rules.defineRule('proficiencyLevelBonus.' + name,
    'rank.' + name, '?', 'source > 0',
    classLevel, '=', null
  );
  rules.defineRule('proficiencyBonus.' + name,
    'rank.' + name, '=', '2 * source',
    'proficiencyLevelBonus.' + name, '+', null
  );
  rules.defineRule('classDifficultyClass.' + name,
    'proficiencyBonus.' + name, '=', null,
    classAbilityModifier, '+', '10 + source'
  );
  rules.defineRule('classDifficultyClass.' + name + '.2',
    'rank.' + name, '=', 'Pathfinder2E.RANK_NAMES[source]'
  );

  rules.defineRule('hitPoints', classLevel, '+=', 'source * ' + hitPoints);

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Pathfinder2E.classRulesExtra = function(rules, name) {

  let classLevel = 'levels.' + name;

  if(name == 'Alchemist') {
    rules.defineRule('combatNotes.weaponSpecialization',
      '', '=', '2',
      'combatNotes.greaterWeaponSpecialization', '+', '2'
    );
    rules.defineRule
      ('features.Alchemical Crafting', 'featureNotes.alchemy', '=', '1');
    rules.defineRule
      ('features.Mutagenic Flashback', 'featureNotes.mutagenist', '=', '1');
    rules.defineRule('selectableFeatureCount.Alchemist (Research Field)',
      'featureNotes.researchField', '=', '1'
    );
    rules.defineRule
      ('skillNotes.alchemistSkills', 'intelligenceModifier', '=', '3 + source');
    rules.defineRule('skillNotes.quickAlchemy',
      '', '=', '1',
      'skillNotes.doubleBrew', '^', '2',
      'skillNotes.alchemicalAlacrity', '^', '3'
    );
    rules.defineRule('skillNotes.perpetualInfusions',
      '', '=', '1',
      'skillNotes.perpetualPotency', '^', 'dict["features.Chirurgeon"] ? 6 : 3',
      'skillNotes.perpetualPerfection', '^', '11'
    );
  } else if(name == 'Barbarian') {
    // TODO make this less hard-coded
    rules.defineRule('features.Animal Instinct',
      'features.Animal Instinct (Ape)', '=', '1',
      'features.Animal Instinct (Bear)', '=', '1',
      'features.Animal Instinct (Bull)', '=', '1',
      'features.Animal Instinct (Cat)', '=', '1',
      'features.Animal Instinct (Deer)', '=', '1',
      'features.Animal Instinct (Frog)', '=', '1',
      'features.Animal Instinct (Shark)', '=', '1',
      'features.Animal Instinct (Snake)', '=', '1',
      'features.Animal Instinct (Wolf)', '=', '1'
    );
    rules.defineRule('features.Dragon Instinct',
      'features.Dragon Instinct (Black)', '=', '1',
      'features.Dragon Instinct (Blue)', '=', '1',
      'features.Dragon Instinct (Green)', '=', '1',
      'features.Dragon Instinct (Red)', '=', '1',
      'features.Dragon Instinct (White)', '=', '1',
      'features.Dragon Instinct (Brass)', '=', '1',
      'features.Dragon Instinct (Bronze)', '=', '1',
      'features.Dragon Instinct (Copper)', '=', '1',
      'features.Dragon Instinct (Gold)', '=', '1',
      'features.Dragon Instinct (Silver)', '=', '1'
    );
    rules.defineRule('combatNotes.bestialRage',
      '', '=', '"Jaws inflict"',
      'features.Animal Instinct (Ape)', '=', '"Fist inflicts"',
      'features.Animal Instinct (Bull)', '=', '"Horn inflicts"',
      'features.Animal Instinct (Deer)', '=', '"Antlers inflict"',
      'features.Animal Instinct (Snake)', '=', '"Fangs inflict"'
    );
    rules.defineRule('combatNotes.bestialRage.1',
      'features.Bestial Rage', '?', null,
      '', '=', '10',
      'level', '+', 'source>=7 ? 2 : null'
    );
    rules.defineRule('combatNotes.bestialRage.2',
      'features.Bestial Rage', '?', null,
      '', '=', '"P"',
      'features.Animal Instinct (Ape)', '=', '"B"',
      'features.Animal Instinct (Frog)', '=', '"B"'
    );
    rules.defineRule('combatNotes.bestialRage.3',
      'features.Bestial Rage', '?', null,
      '', '=', '""',
      'features.Animal Instinct (Bear)', '=', '" and claws 1d%{level>=7?8:6}S HP"',
      'features.Animal Instinct (Cat)', '=', '" and claws 1d%{level>=7?8:6}6S HP"',
      'features.Animal Instinct (Frog)', '=', '" and tongue 1d%{level>=7?6:4}B HP"'
    );
    rules.defineRule('combatNotes.specializationAbility',
      '', '=', '6',
      'features.Animal Instinct', '=', '5',
      'features.Dragon Instinct', '=', '8',
      'features.Giant Instinct', '=', '10',
      'features.Spirit Instinct', '=', '7',
      'combatNotes.specializationAbility.2', '^', null
    );
    rules.defineRule('combatNotes.specializationAbility.1',
      'features.Specialization Ability', '?', null,
      '', '=', '""',
      'features.Animal Instinct', '=', '" with natural weapon"',
      'features.Giant Instinct', '=', '" with larger weapon"',
      'features.Spirit Instinct', '=', '" with Spirit Rage"'
    );
    rules.defineRule('combatNotes.specializationAbility.2',
      'features.Specialization Ability', '?', null,
      'features.Greater Weapon Specialization', '?', null,
      '', '=', '12',
      'features.Dragon Instinct', '=', '16',
      'features.Giant Instinct', '=', '18',
      'features.Spirit Instinct', '=', '13'
    );
    rules.defineRule('combatNotes.draconicRage',
      '', '=', '"fire"',
      'features.Draconic Instinct (Black)', '=', '"acid"',
      'features.Draconic Instinct (Blue)', '=', '"electricity"',
      'features.Draconic Instinct (Green)', '=', '"poison"',
      'features.Draconic Instinct (White)', '=', '"cold"',
      'features.Draconic Instinct (Brass)', '=', '"fire"',
      'features.Draconic Instinct (Bronze)', '=', '"electricity"',
      'features.Draconic Instinct (Copper)', '=', '"acid"',
      'features.Draconic Instinct (Silver)', '=', '"cold"'
    );
    rules.defineRule('combatNotes.rage',
      '', '=', '2',
      'combatNotes.rage.1', '^', null
    );
    rules.defineRule('combatNotes.rage.1',
      'features.Rage', '?', null,
      'features.Specialization Ability', '?', null,
      'features.Dragon Instinct', '=', '8',
      'features.Fury Instinct', '=', '6',
      'features.Greater Weapon Specialization', '*', '2'
    );
    rules.defineRule('saveNotes.ragingResistance',
      'features.Animal Instinct', '=', '"piercing and slashing"',
      'features.Dragon Instinct (Black)', '=', '"acid"',
      'features.Dragon Instinct (Blue)', '=', '"electricity"',
      'features.Dragon Instinct (Green)', '=', '"poison"',
      'features.Dragon Instinct (Red)', '=', '"fire"',
      'features.Dragon Instinct (White)', '=', '"cold"',
      'features.Dragon Instinct (Brass)', '=', '"fire"',
      'features.Dragon Instinct (Bronze)', '=', '"electricity"',
      'features.Dragon Instinct (Copper)', '=', '"acid"',
      'features.Dragon Instinct (Gold)', '=', '"fire"',
      'features.Dragon Instinct (Silver)', '=', '"cold"',
      'features.Fury Instinct', '=', '"bludgeoning and choice of cold, electricity, or fire"',
      'features.Spirit Instinct', '=', '"negative damage and damage from undead"'
    );
    rules.defineRule('selectableFeatureCount.Barbarian (Instinct)',
      'featureNotes.instinct', '=', '1'
    );
    rules.defineRule
      ('skillNotes.barbarianSkills', 'intelligenceModifier', '=', '3 + source');
    rules.defineRule
      ('skillNotes.ragingIntimidation', 'rank.Intimidation', '?', null);
    rules.defineRule('skillNotes.ragingIntimidation.1',
      'skillNotes.ragingIntimidation', '?', null,
      'level', '=', 'source>=15 ? " and Scare To Death" : ""',
      'rank.Intimidation', '=', 'source<4 ? "" : null'
    );
    rules.defineRule('features.Intimidating Glare',
      'skillNotes.ragingIntimidation', '=', '1'
    );
    rules.defineRule('features.Scare To Death',
      'skillNotes.ragingIntimidation.1', '=', 'source=="" ? null : 1'
    );
  } else if(name == 'Bard') {
    rules.defineRule
      ('features.Bardic Lore', 'featureNotes.enigmaMuse', '=', '1');
    rules.defineRule('features.Enigma Muse',
      'featureNotes.multifariousMuse(EnigmaMuse)', '=', '1'
    );
    rules.defineRule
      ('features.Lingering Composition', 'featureNotes.maestroMuse', '=', '1');
    rules.defineRule('features.Maestro Muse',
      'featureNotes.multifariousMuse(MaestroMuse)', '=', '1'
    );
    rules.defineRule('features.Polymath Muse',
      'featureNotes.multifariousMuse(PolymathMuse)', '=', '1'
    );
    rules.defineRule('features.Versatile Performance',
      'featureNotes.polymathMuse', '=', '1'
    );
    rules.defineRule('focusPoints', 'magicNotes.compositionSpells', '+=', '1');
    rules.defineRule
      ('magicNotes.expertSpellcaster', classLevel, '=', '"Occult"');
    rules.defineRule('magicNotes.legendarySpellcaster',
      'bardFeatures.Legendary Spellcaster', '=', '"Occult"'
    );
    rules.defineRule
      ('magicNotes.masterSpellcaster', classLevel, '=', '"Occult"');
    rules.defineRule
      ('selectableFeatureCount.Bard (Muse)', 'featureNotes.muses', '=', '1');
    rules.defineRule
      ('skillNotes.bardSkills', 'intelligenceModifier', '=', '4 + source');
    rules.defineRule
      ('spellSlots.O0', 'magicNotes.occultSpellcasting', '=', 'null'); // italic
    rules.defineRule('spellSlots.O10', 'magicNotes.perfectEncore', '+', '1');
    rules.defineRule
      ('spells.Allegro (O0 Ench)', 'magicNotes.allegro', '=', '1');
    rules.defineRule('spells.Counter Performance (O1 Ench)',
      'magicNotes.compositionSpells', '=', '1'
    );
    rules.defineRule
      ('spells.Dirge Of Doom (O0 Ench)', 'magicNotes.dirgeOfDoom', '=', '1');
    rules.defineRule
      ('spells.Fatal Aria (O10 Ench)', 'magicNotes.fatalAria', '=', '1');
    rules.defineRule('spells.House Of Imaginary Walls (O0 Illu)',
      'magicNotes.houseOfImaginaryWalls', '=', '1'
    );
    rules.defineRule('spells.Inspire Competence (O0 Ench)',
      'magicNotes.inspireCompetence', '=', '1'
    );
    rules.defineRule('spells.Inspire Heroics (O4 Ench)',
      'magicNotes.inspireHeroics', '=', '1'
    );
    rules.defineRule('spells.Inspire Courage (O0 Ench)',
      'magicNotes.compositionSpells', '=', '1'
    );
    rules.defineRule('spells.Inspire Defense (O0 Ench)',
      'magicNotes.inspireDefense', '=', '1'
    );
    rules.defineRule('spells.Lingering Composition (O1 Ench)',
      'magicNotes.lingeringComposition', '=', '1'
    );
    rules.defineRule("spells.Loremaster's Etude (O1 Divi)",
      "magicNotes.loremaster'sEtude", '=', '1'
    );
    rules.defineRule
      ('spells.Soothe (O1 Ench)', 'magicNotes.maestroMuse', '=', '1');
    rules.defineRule('spells.Soothing Ballad (O7 Ench)',
      'magicNotes.soothingBallad', '=', '1'
    );
    rules.defineRule
      ('spells.Triple Time (O0 Ench)', 'magicNotes.tripleTime', '=', '1');
    rules.defineRule
      ('spells.True Strike (A/O1 Divi)', 'magicNotes.enigmaMuse', '=', '1');
    rules.defineRule('spells.Unseen Servant (A/O1 Conj)',
      'featureNotes.polymathMuse', '=', '1'
    );
  } else if(name == 'Champion') {
    rules.defineRule('combatNotes.deificWeapon',
      'deityWeaponCategory', '?', 'source.match(/Simple|Unarmed/)'
    );
    rules.defineRule('combatNotes.dragonslayerOath',
      'features.Glimpse Of Redemption', '=', '"Glimpse Of Redemption grants %{level+7} damage resistance"',
      'features.Liberating Step', '=', '"Liberating Step grants +4 checks and a second Step"',
      'features.Retributive Strike', '=', '"Retributive Strike inflicts +4 HP damage (+6 HP with master proficiency)"'
    );
    rules.defineRule('combatNotes.exalt(Paladin)',
      '', '=', '-5',
      'combatNotes.auraOfVengeance', '+', '3'
    );
    rules.defineRule('combatNotes.fiendsbaneOath',
      'features.Glimpse Of Redemption', '=', '"Glimpse Of Redemption grants %{level+7} damage resistance"',
      'features.Liberating Step', '=', '"Liberating Step grants +4 checks and a second Step"',
      'features.Retributive Strike', '=', '"Retributive Strike inflicts +4 HP damage (+6 HP with master proficiency)"'
    );
    rules.defineRule('combatNotes.shiningOath',
      'features.Glimpse Of Redemption', '=', '"Glimpse Of Redemption grants %{level+7} damage resistance"',
      'features.Liberating Step', '=', '"Liberating Step grants +4 checks and a second Step"',
      'features.Retributive Strike', '=', '"Retributive Strike inflicts +4 HP damage (+6 HP with master proficiency)"'
    );
    rules.defineRule('combatNotes.liberatingStep',
      "featureNotes.champion'sReaction", '+', 'null' // italics
    );
    rules.defineRule('focusPoints', 'magicNotes.devotionSpells', '+=', '1');
    rules.defineRule("featureNotes.champion'sReaction",
      'features.Liberator', '=', '"<i>Liberating Step</i>"',
      'features.Paladin', '=', '"<i>Retributive Strike</i>"',
      'features.Redeemer', '=', '"<i>Glimpse Of Redemption</i>"'
    );
    rules.defineRule('featureNotes.divineAlly',
      '', '=', '1',
      'featureNotes.secondAlly', '+', '1'
    );
    rules.defineRule('selectableFeatureCount.Champion (Cause)',
      'featureNotes.cause', '=', '1'
    );
    rules.defineRule("selectableFeatureCount.Champion (Champion's Code)",
      "featureNotes.champion'sCode", '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Champion (Divine Ally)',
      'featureNotes.divineAlly', '=', null
    );
    rules.defineRule('shieldHardness',
      'combatNotes.divineAlly(Shield)', '+', '2'
    );
    rules.defineRule('shieldHP',
      'shieldHP.1', '*', null
    );
    rules.defineRule('shieldHP.1',
      'combatNotes.divineAlly(Shield)', '=', '1.5',
      'combatNotes.shieldParagon', '^=', '2'
    );
    rules.defineRule
      ('skillNotes.championSkills', 'intelligenceModifier', '=', '2 + source');
  } else if(name == 'Cleric') {
    rules.defineRule('combatNotes.cloisteredCleric',
      'level', '?', 'source>=11',
      'deityWeapon', '=', null
    );
    rules.defineRule('combatNotes.warpriest',
      '', '=', '"Trained"',
      'features.Divine Defense', '=', '"Expert"'
    );
    rules.defineRule('combatNotes.warpriest.1',
      'features.Warpriest', '?', null,
      'deityWeapon', '=', null
    );
    rules.defineRule
      ('combatNotes.cloisteredCleric-1', 'level', '?', 'source>=11');
    rules.defineRule('combatNotes.deity', 'deityWeapon', '=', null);
    rules.defineRule('combatNotes.warpriest-1', 'level', '?', 'source>=7');
    rules.defineRule('featureNotes.warpriest.1',
      'features.Warpriest', '?', null,
      'deityWeaponCategory', '=', 'source.match(/Simple|Unarmed/) ? " and Deadly Simplicity" : ""'
    );
    rules.defineRule('features.Deadly Simplicity',
      'featureNotes.warpriest.1', '=', 'source ? 1 : null'
    );
    rules.defineRule
      ('features.Domain Initiate', 'featureNotes.cloisteredCleric', '=', '1');
    rules.defineRule
      ('features.Shield Block', 'featureNotes.warpriest', '=', '1');
    rules.defineRule('magicNotes.cloisteredCleric',
      'level', '=', 'source<15 ? "Expert" : source<19 ? "Master" : "Legendary"'
    );
    rules.defineRule('magicNotes.deity',
      'deitySpells', '=', '"<i>" + source.replaceAll(/[0-9]+:/g, "").replaceAll("/", "</i>, <i>") + "</i>"'
    );
    rules.defineRule('focusPoints', 'magicNotes.domainInitiate', '+=', '1');
    rules.defineRule('magicNotes.warpriest',
      'level', '=', 'source<19 ? "Expert" : "Master"'
    );
    rules.defineRule('training.Divine',
      'magicNotes.cloisteredCleric', '^=', 'source=="Expert" ? 2 : source=="Master" ? 3 : 4',
      'magicNotes.warpriest', '^=', 'source=="Expert" ? 2 : 3'
    );
    rules.defineRule('training.Fortitude',
      'saveNotes.warpriest', '^=', 'source=="Expert" ? 2 : 3'
    );
    rules.defineRule('training.Light Armor',
      'combatNotes.warpriest', '^=', 'source=="Expert" ? 2 : 1'
    );
    rules.defineRule('training.Medium Armor',
      'combatNotes.warpriest', '^=', 'source=="Expert" ? 2 : 1'
    );
    rules.defineRule('saveNotes.cloisteredCleric', 'level', '?', 'source>=3');
    rules.defineRule
      ('saveNotes.warpriest', 'level', '=', 'source<15 ? "Expert" : "Master"');
    rules.defineRule('saveNotes.warpriest-1', 'level', '?', 'source>=15');
    rules.defineRule('selectableFeatureCount.Cleric (Divine Font)',
      'featureNotes.divineFont', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Cleric (Doctrine)',
      'featureNotes.doctrine', '=', '1'
    );
    rules.defineRule
      ('skillNotes.clericSkills', 'intelligenceModifier', '=', '2 + source');
    rules.defineRule('skillNotes.deity', 'deitySkill', '=', null);
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
      rules.defineRule('magicNotes.harmfulFont', 'spellSlots.D' + l, '^=', l);
      rules.defineRule('magicNotes.healingFont', 'spellSlots.D' + l, '^=', l);
      rules.defineRule('spellSlots.D' + l,
        'magicNotes.harmfulFont', '+', 'source==' + l + ' ? 1 : null',
        'magicNotes.healingFont', '+', 'source==' + l + ' ? 1 : null'
      );
    });
    rules.defineRule('spellSlots.D10',
      'magicNotes.miraculousSpell', '=', 'null', // italics
      'magicNotes.makerOfMiracles', '+', '1'
    );
  } else if(name == 'Druid') {
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.animalOrder', '=', '1');
    rules.defineRule
      ('features.Leshy Familiar', 'featureNotes.leafOrder', '=', '1');
    rules.defineRule
      ('features.Storm Born', 'featureNotes.stormOrder', '=', '1');
    rules.defineRule('features.Wild Shape', 'featureNotes.wildOrder', '=', '1');
    rules.defineRule('focusPoints', 'magicNotes.druidicOrder', '+=', '1');
    rules.defineRule
      ('languages.Druidic', 'skillNotes.druidicLanguage', '=', '1');
    rules.defineRule
      ('magicNotes.expertSpellcaster', classLevel, '=', '"Primal"');
    rules.defineRule('magicNotes.legendarySpellcaster',
      'druidFeatures.Legendary Spellcaster', '=', '"Primal"'
    );
    rules.defineRule
      ('magicNotes.masterSpellcaster', classLevel, '=', '"Primal"');
    rules.defineRule('selectableFeatureCount.Druid (Order)',
      'featureNotes.druidicOrder', '=', '1',
      'featureNotes.orderExplorer', '+', null
    );
    rules.defineRule
      ('skillNotes.druidSkills', 'intelligenceModifier', '=', '2 + source');
    rules.defineRule
      ('spellSlots.P10', 'magicNotes.primalHierophant', '=', 'null'); // italics
    rules.defineRule('spells.Heal Animal', 'magicNotes.animalOrder', '=', '1');
    rules.defineRule('spells.Goodberry', 'magicNotes.leafOrder', '=', '1');
    rules.defineRule('spells.Tempest Surge', 'magicNotes.stormOrder', '=', '1');
    rules.defineRule('spells.Wild Morph', 'magicNotes.wildOrder', '=', '1');
  } else if(name == 'Fighter') {
    rules.defineRule('training.Will', 'saveNotes.bravery', '^=', '2');
    rules.defineRule
      ('skillNotes.fighterSkills', 'intelligenceModifier', '=', '3 + source');
  } else if(name == 'Monk') {
    rules.defineRule('abilityNotes.incredibleMovement',
      'level', '=', 'Math.floor((source + 5) / 4) * 5'
    );
    rules.defineRule('abilityNotes.incredibleMovement.1',
      'features.Incredible Movement', '?', null,
      'armor', '?', 'source == "None"',
      'abilityNotes.incredibleMovement', '=', null
    );
    rules.defineRule('featureNotes.pathToPerfection',
      '', '=', '1',
      'features.Second Path To Perfection', '+', '1',
      'features.Third Path To Perfection', '+', '1'
    );
    rules.defineRule('combatNotes.monasticWeaponry',
      '', '=', '"Trained"',
      'training.Unarmed Attacks', '=', 'source>2 ? "Master" : source>1 ? "Expert" : null'
    );
    rules.defineRule('magicNotes.gracefulLegend',
      'magicNotes.kiTradition(Divine)', '=', '"Divine"',
      'magicNotes.kiTradition(Occult)', '=', '"Occult"'
    );
    rules.defineRule('magicNotes.monkExpertise',
      'magicNotes.kiTradition(Divine)', '=', '"Divine"',
      'magicNotes.kiTradition(Occult)', '=', '"Occult"'
    );
    rules.defineRule('training.Divine',
      'magicNotes.gracefulLegend', '^=', 'source=="Divine" ? 3 : null',
      'magicNotes.monkExpertise', '^=', 'source=="Divine" ? 2 : null'
    );
    rules.defineRule('training.Monk',
      'combatNotes.monasticWeaponry', '=', 'source=="Expert" ? 3 : source=="Master" ? 2 : 1'
    );
    rules.defineRule('training.Occult',
      'magicNotes.gracefulLegend', '^=', 'source=="Occult" ? 3 : null',
      'magicNotes.monkExpertise', '^=', 'source=="Occult" ? 2 : null'
    );
    rules.defineRule('selectableFeatureCount.Monk (Perfection)',
      'featureNotes.pathToPerfection', '=', null
    );
    rules.defineRule('selectableFeatureCount.Monk (Ki Tradition)',
      'featureNotes.kiTradition', '=', null
    );
    rules.defineRule
      ('skillNotes.monkSkills', 'intelligenceModifier', '=', '4 + source');
    rules.defineRule('speed', 'abilityNotes.incredibleMovement.1', '+', null);
    rules.defineRule
      ('weaponDieType.Fist', 'combatNotes.powerfulFist', '^', '6');
  } else if(name == 'Ranger') {
    rules.defineRule('combatNotes.monsterHunter',
      '', '=', '1',
      'combatNotes.legendaryMonsterHunter', '+', '1'
    );
    rules.defineRule('combatNotes.monsterWarden',
      '', '=', '1',
      'combatNotes.legendaryMonsterHunter', '+', '1'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Edge)",
      "featureNotes.hunter'sEdge", '=', '1'
    );
    rules.defineRule
      ('skillNotes.masterfulHunter', 'rank.Perception', '?', 'source >= 3');
    rules.defineRule
      ('skillNotes.masterfulHunter-1', 'rank.Survival', '?', 'source >= 3');
    rules.defineRule
      ('skillNotes.rangerSkills', 'intelligenceModifier', '=', '4 + source');
    rules.defineRule('skillNotes.snareSpecialist',
      'rank.Crafting', '=', 'source<3 ? 4 : source<4 ? 6 : 8',
      'skillNotes.ubiquitousSnares', '*', '2'
    );
  } else if(name == 'Rogue') {
    rules.defineRule('selectableFeatureCount.Rogue (Racket)',
      "featureNotes.rogue'sRacket", '=', '1'
    );
    rules.defineRule('combatNotes.ruffian',
      '', '=', '"Trained"',
      'rank.Light Armor', '=', 'source>=3 ? "Master" : source==2 ? "Expert" : null'
    );
    rules.defineRule('featureNotes.rogueFeats', classLevel, '=', null);
    rules.defineRule('featureNotes.skillIncreases',
      classLevel, '^=', 'source>=2 ? Math.floor(source / 2) : null'
    );
    rules.defineRule('training.Medium Armor',
      'combatNotes.ruffian', '^=', 'source=="Master" ? 3 : source=="Expert" ? 2 : 1'
    );
    rules.defineRule
      ('skillNotes.rogueSkills', 'intelligenceModifier', '=', '7 + source');
  } else if(name == 'Sorcerer') {
    let bloodlineTraditions = {
      'Aberrant':'Occult',
      'Angelic':'Divine',
      'Demonic':'Divine',
      'Diabolic':'Divine',
      'Draconic':'Arcane',
      'Elemental':'Primal',
      'Fey':'Primal',
      'Hag':'Occult',
      'Imperial':'Arcane',
      'Undead':'Divine'
    };
    let spellSlots = [
      'x0:5@1',
      'x1:3@1;4@2',
      'x2:3@3;4@4',
      'x3:3@5;4@6',
      'x4:3@7;4@8',
      'x5:3@9;4@10',
      'x6:3@11;4@12',
      'x7:3@13;4@14',
      'x8:3@15;4@16',
      'x9:3@17;4@18',
      'x10:1@19'
    ];
    for(let b in bloodlineTraditions) {
      let bloodLevel = b.toLowerCase() + 'Level';
      let bloodTrad = bloodlineTraditions[b];
      rules.defineRule(bloodLevel,
        'features.' + b, '?', null,
        classLevel, '=', null
      );
      rules.defineRule('bloodlineTraditions',
        'features.' + b, '=', '!dict.bloodlineTraditions ? "' + bloodTrad + '" : !dict.bloodlineTraditions.includes("' + bloodTrad + '") ? dict.bloodlineTraditions + "; ' + bloodTrad + '" : dict.bloodlineTraditions'
      );
      QuilvynRules.spellSlotRules(rules, bloodLevel, spellSlots.map(x => x.replace(/./, bloodTrad.charAt(0))));
    }
    rules.defineRule('focusPoints', 'magicNotes.bloodline', '+=', '1');
    rules.defineRule
      ('magicNotes.expertSpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.legendarySpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.masterSpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.sorcererSpellcasting', 'bloodlineTraditions', '=', null);
    ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
      rules.defineRule('training.' + t,
        'magicNotes.expertSpellcaster', '^=', 'source.includes("' + t + '") ? 2 : null',
        'magicNotes.masterSpellcaster', '^=', 'source.includes("' + t + '") ? 3 : null',
        'magicNotes.legendarySpellcaster', '^=', 'source.includes("' + t + '") ? 4 : null'
      );
    });
    rules.defineRule('selectableFeatureCount.Sorcerer (Bloodline)',
      'featureNotes.bloodline', '=', '1'
    );
    rules.defineRule
      ('spellSlots.O10', 'magicNotes.bloodlineParagon', '+', 'null'); // italics
    rules.defineRule
      ('skillNotes.sorcererSkills', 'intelligenceModifier', '=', '2 + source');
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
      rules.defineRule
        ('magicNotes.divineEvolution', 'spellSlots.D' + l, '^=', l);
      rules.defineRule('spellSlots.D' + l,
        'magicNotes.divineEvolution', '+', 'source==' + l + ' ? 1 : null'
      );
      rules.defineRule
        ('magicNotes.primalEvolution', 'spellSlots.P' + l, '^=', l);
      rules.defineRule
        ('spellSlots.A' + l, 'magicNotes.greaterMentalEvolution', '+', '1');
      rules.defineRule
        ('spellSlots.O' + l, 'magicNotes.greaterMentalEvolution', '+', '1');
      rules.defineRule('spellSlots.P' + l,
        'magicNotes.primalEvolution', '+', 'source==' + l + ' ? 1 : null'
      );
    });
    rules.defineRule
      ('spellSlots.A10', 'magicNotes.bloodlinePerfection', '+', '1');
    rules.defineRule
      ('spellSlots.D10', 'magicNotes.bloodlinePerfection', '+', '1');
    rules.defineRule
      ('spellSlots.O10', 'magicNotes.bloodlinePerfection', '+', '1');
    rules.defineRule
      ('spellSlots.P10', 'magicNotes.bloodlinePerfection', '+', '1');
  } else if(name == 'Wizard') {
    rules.defineRule('focusPoints', 'magicNotes.arcaneSchool', '+=', '1');
    rules.defineRule('spellSlots.O10',
      "magicNotes.archwizard'sSpellcraft", '+', 'null' // italics
    );
    rules.defineRule
      ('magicNotes.expertSpellcaster', classLevel, '=', '"Arcane"');
    rules.defineRule('magicNotes.legendarySpellcaster',
      'wizardFeatures.Legendary Spellcaster', '=', '"Arcane"'
    );
    rules.defineRule
      ('magicNotes.masterSpellcaster', classLevel, '=', '"Arcane"');
    rules.defineRule('magicNotes.metamagicalExperimentation',
      classLevel, '?', 'source >= 4'
    );
    rules.defineRule('selectableFeatureCount.Wizard (Specialization)',
      'featureNotes.arcaneSchool', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Wizard (Thesis)',
      'featureNotes.arcaneThesis', '=', '1'
    );
    rules.defineRule
      ('skillNotes.wizardSkills', 'intelligenceModifier', '=', '2 + source');
    rules.defineRule
      ('spellSlots.A10', "magicNotes.archwizard'sMight", '+', '1');
    let schoolSpells = {
      'Abjuration':['Protective Ward', 'Energy Absorption'],
      'Conjuration':['Augment Summoning', 'Dimensional Steps'],
      'Divination':["Diviner's Sight", 'Vigilant Eye',],
      'Enchantment':['Charming Words', 'Dread Aura'],
      'Evocation':['Force Bolt', 'Elemental Tempest'],
      'Illusion':['Warped Terrain', 'Invisibility Cloak'],
      'Necromancy':['Call Of The Grave', 'Life Siphon'],
      'Transmutation':['Physical Boost', 'Shifting Form']
    };
    let allSelectables = rules.getChoices('selectableFeatures');
    let schools =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Specialization')).map(x => x.replace('Wizard - ', '')).filter(s => schoolSpells[s]);
    schools.forEach(s => {
      let note = 'magicNotes.' + s.toLowerCase();
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
        rules.defineRule('spellSlots.A' + l, note, '+', '1');
      });
      rules.defineRule('magicNotes.advancedSchoolSpell',
        note, '=', '"' + schoolSpells[s][1] + '"'
      );
      rules.defineRule('spells.' + schoolSpells[s][0], note, '=', '1');
      rules.defineRule('spells.' + schoolSpells[s][1], note, '=', '1');
    });
    [3, 4, 5, 6, 7, 8, 9, 10].forEach(l => {
      rules.defineRule
        ('magicNotes.scrollSavant', 'spellSlots.A' + l, '^=', 'source - 2');
      rules.defineRule
        ('magicNotes.superiorBond', 'spellSlots.A' + l, '^=', 'source - 2');
    });
  }

};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, #fonts# and #domains# lists the divine fonts and
 * associated domains, #weapon# is the deity's favored weapon, #skill# the
 * divine skill, and #spells# lists associated cleric spells.
 */
Pathfinder2E.deityRules = function(
  rules, name, alignment, fonts, domains, weapon, skill, spells
) {

  if(!name) {
    console.log('Empty deity name');
    return;
  }
  if(name != 'None' && !(alignment+'').match(/^(N|[LNC]G|[LNC]E|[LC]N)$/i)) {
    console.log('Bad alignment "' + alignment + '" for deity ' + name);
    return;
  }
  if(!Array.isArray(fonts)) {
    console.log('Bad fonts list "' + fonts + '" for deity ' + name);
    return;
  }
  if(!Array.isArray(domains)) {
    console.log('Bad domains list "' + domains + '" for deity ' + name);
    return;
  }
  if(weapon && typeof(weapon) != 'string') {
    console.log('Bad weapon "' + weapon + '" for deity ' + name);
    return;
  }
  if(skill && typeof(skill) != 'string') {
    console.log('Bad skill "' + skill + '" for deity ' + name);
    return;
  }
  if(!Array.isArray(spells)) {
    console.log('Bad spells list "' + spells + '" for deity ' + name);
    return;
  }

  if(rules.deityStats == null) {
    rules.deityStats = {
      alignment:{},
      fonts:{},
      domains:{},
      weapon:{},
      weaponCategory:{},
      skill:{},
      spells:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.fonts[name] = fonts.join('/');
  rules.deityStats.domains[name] = domains.join('/');
  rules.deityStats.weapon[name] = weapon;
  rules.deityStats.weaponCategory[name] =
    QuilvynUtils.getAttrValue(rules.getChoices('weapons')[weapon] || '', "Category");
  rules.deityStats.skill[name] = skill;
  rules.deityStats.spells[name] = spells.join('/');

  rules.defineRule('deityAlignment',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.alignment) + '[source]'
  );
  rules.defineRule('deityDomains',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.domains) + '[source]'
  );
  rules.defineRule('deityFonts',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.fonts) + '[source]'
  );
  rules.defineRule('deitySkill',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.skill) + '[source]'
  );
  rules.defineRule('deitySpells',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.spells) + '[source]'
  );
  rules.defineRule('deityWeapon',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.weapon) + '[source]'
  );
  rules.defineRule('deityWeaponCategory',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.weaponCategory) + '[source]'
  );

  rules.defineRule('training.' + skill,
    'skillNotes.deity', '^=', 'source=="' + skill + '" ? 1 : null'
  );
  rules.defineRule('training.' + weapon,
    'combatNotes.cloisteredCleric', '^', 'source=="' + weapon + '" ? 2 : null',
    'combatNotes.deity', '^=', 'source=="' + weapon + '" ? 1 : null',
    'combatNotes.warpriest.1', '^', 'source=="' + weapon + '" ? 2 : null'
  );

  rules.defineRule('weaponDieTypeBonus.' + weapon,
    'combatNotes.deificWeapon', '+=', '2',
    'combatNotes.deadlySimplicity', '+=', '2'
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
  types.forEach(t => {
    rules.defineRule('sum' + t + 'Feats', 'feats.' + name, '+=', null);
    if(['Ancestry', 'Class', 'General', 'Skill'].includes(t))
      QuilvynRules.validAllocationRules
        (rules, t + 'Feats', 'featCount.' + t, 'sum' + t + 'Feats');
  });
  rules.defineRule('sumClassFeats', 'sumArchetypeFeats', '+', null);

};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Pathfinder2E.featRulesExtra = function(rules, name) {
  let matchInfo;
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  if((matchInfo = name.match(/Additional Lore \((.*)\)/)) != null) {
    rules.defineRule('skillNotes.additionalLore(' + matchInfo[1] + ')',
      'level', '=', 'source<3 ? "Trained" : source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
    rules.defineRule('training.' + matchInfo[1] + ' Lore',
      'skillNotes.' + prefix, '^=', 'source=="Trained" ? 1 : source=="Expert" ? 2 : source=="Master" ? 3 : 4'
    );
  } else if((matchInfo = name.match(/^Advanced Domain/)) != null) {
    rules.defineRule('features.Advanced Domain', 'features.' + name, '=', '1');
  } else if(name == 'Alchemical Familiar') {
    rules.defineRule
      ('features.Familiar', 'featureNotes.alchemicalFamiliar', '=', '1');
  } else if(name == 'Animal Accomplice') {
    rules.defineRule
      ('features.Familiar', 'featureNotes.animalAccomplice', '=', '1');
  } else if(name == 'Animal Rage') {
    rules.defineRule('spells.Animal Form', 'magicNotes.animalRage', '=', '1');
  } else if(name == 'Armor Proficiency') {
    rules.defineRule
      ('training.Light Armor', 'combatNotes.armorProficiency', '=', '1');
    rules.defineRule('training.Medium Armor',
      'feats.Armor Proficiency', '=', 'source>=2 ? 1 : null'
    );
    rules.defineRule('training.Heavy Armor',
      'feats.Armor Proficiency', '=', 'source>=3 ? 1 : null'
    );
  } else if(name == 'Bard Dedication') {
    rules.defineRule('features.Muses', 'featureNotes.bardDedication', '=', '1');
    rules.defineRule('spellSlots.O0', 'magicNotes.bardDedication', '+=', '2');
    // Suppress validation errors for selected muses and the notes for
    // features of muses that don't come with Bard Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let muses =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Muse')).map(x => x.replace('Bard - ', '').replace(' Muse', ''));
    muses.forEach(m => {
      rules.defineRule('validationNotes.bard-' + m + 'MuseSelectableFeature',
        'featureNotes.bardDedication', '+', '1'
      );
      rules.defineRule('featureNotes.' + m.toLowerCase() + 'Muse',
        'featureNotes.bardDedication', '?', '!source'
      );
      rules.defineRule('magicNotes.' + m.toLowerCase() + 'Muse',
        'featureNotes.bardDedication', '?', '!source'
      );
    });
  } else if(name == 'Bardic Lore') {
    Pathfinder2E.skillRules(rules, 'Bardic Lore', 'Intelligence');
    rules.defineRule('training.Bardic Lore',
      'skillNotes.bardicLore', '=', '1',
      'rank.Occultism', '+', '1'
    );
  } else if(name == 'Canny Acumen (Fortitude)') {
    rules.defineRule('saveNotes.cannyAcumen(Fortitude)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('training.Fortitude',
      'saveNotes.cannyAcumen(Fortitude)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Perception)') {
    rules.defineRule('skillNotes.cannyAcumen(Perception)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('training.Perception',
      'skillNotes.cannyAcumen(Perception)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Reflex)') {
    rules.defineRule('saveNotes.cannyAcumen(Reflex)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('training.Reflex',
      'saveNotes.cannyAcumen(Reflex)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Will)') {
    rules.defineRule('saveNotes.cannyAcumen(Will)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('training.Will',
      'saveNotes.cannyAcumen(Will)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Clever Improviser') {
    rules.defineRule('features.Untrained Improvisation',
      'featureNotes.cleverImproviser', '=', '1'
    );
  } else if(name == 'Cultural Adaptability') {
    rules.defineRule('features.Adopted Ancestry',
      'featureNotes.culturalAdaptability', '=', '1'
    );
    rules.defineRule
      ('featCount.Ancestry', 'featureNotes.culturalAdaptability', '+', '1');
  } else if(name == 'Dragon Transformation') {
    rules.defineRule
      ('spells.Dragon Form', 'magicNotes.dragonTransformation', '=', '1');
  } else if(name == 'Elf Atavism') {
    rules.defineRule('selectableFeatureCount.Elf (Heritage)',
      'featureNotes.elfAtavism', '=', '1'
    );
    // Suppress validation errors for selected half-elf heritages
    let allSelectables = rules.getChoices('selectableFeatures');
    let elfHeritages =
      Object.keys(allSelectables).filter(x => x.includes('Elf -')).map(x => x.replace('Elf - ', ''));
    elfHeritages.forEach(h => {
      rules.defineRule('validationNotes.elf-' + h.replaceAll(' ', '') + 'SelectableFeature',
        'featureNotes.elfAtavism', '+', '1'
      );
    });
  } else if(name == 'Extend Armament Alignment') {
    rules.defineRule('combatNotes.alignArmament',
      'combatNotes.extendArmamentAlignment', '=', 'null' // italics
    );
  } else if(name == 'Far Lobber') {
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons) {
      if(allWeapons[w].includes('Bomb'))
        rules.defineRule
          ('weaponRangeAdjustment.' + w, 'combatNotes.farLobber', '^=', '10');
    }
  } else if(name == 'Far Shot') {
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons) {
      let range = QuilvynUtils.getAttrValue(allWeapons[w], 'Range');
      if(range)
        rules.defineRule
          ('weaponRangeAdjustment.' + w, 'combatNotes.farShot', '+=', range);
    }
  } else if(name.match(/^Favored Terrain/)) {
    rules.defineRule('features.Favored Terrain', 'features.' + name, '=', '1');
  } else if(name == 'Fey Caller') {
    rules.defineRule
      ('spells.Illusory Disguise', 'magicNotes.feyCaller', '=', '1');
    rules.defineRule
      ('spells.Illusory Object', 'magicNotes.feyCaller', '=', '1');
    rules.defineRule('spells.Illusory Scene', 'magicNotes.feyCaller', '=', '1');
    rules.defineRule('spells.Veil', 'magicNotes.feyCaller', '=', '1');
  } else if(name == 'First World Adept') {
    rules.defineRule
      ('spells.Faerie Fire', 'magicNotes.firstWorldAdept', '=', '1');
    rules.defineRule
      ('spells.Invisibility', 'magicNotes.firstWorldAdept', '=', '1');
  } else if(name == 'Gnome Obsession') {
    // TODO find a less klunky way to do this
    rules.defineRule
      ('choiceCount.skill', 'skillNotes.gnomeObsession', '+=', '1');
    rules.defineRule('skillNotes.gnomeObsession',
      'level', '=', 'source<2 ? "Trained" : source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
  } else if(name == 'Hand Of The Apprentice') {
    rules.defineRule
      ('focusPoints', 'magicNotes.handOfTheApprentice', '+=', '1');
    rules.defineRule('spells.Hand Of The Apprentice',
      'magicNotes.handOfTheApprentice', '=', '1'
    );
  } else if(name == "Hierophant's Power") {
    rules.defineRule
      ('spellSlots.P10', "magicNotes.hierophant'sPower", '+', '1');
  } else if(name == 'Impaling Briars') {
    rules.defineRule('focusPoints', 'magicNotes.impalingBriars', '+=', '1');
    rules.defineRule
      ('spells.Impaling Briars', 'magicNotes.impalingBriars', '=', '1');
  } else if(name == 'Invoke Disaster') {
    rules.defineRule('focusPoints', 'magicNotes.invokeDisaster', '+=', '1');
    rules.defineRule
      ('spells.Storm Lord', 'magicNotes.invokeDisaster', '=', '1');
  } else if(name == 'Ironblood Stance') {
    rules.defineRule('combatNotes.ironbloodStance',
      'level', '=', 'source<12 ? 2 : source<16 ? 3 : source<20 ? 4 : 5',
      'combatNotes.ironbloodSurge', '^', null
    );
  } else if(name == 'Ironblood Surge') {
    rules.defineRule
      ('combatNotes.ironbloodSurge', 'strengthModifier', '=', null);
  } else if(name == 'Ki Rush') {
    rules.defineRule('features.Ki Spells', 'features.Ki Rush', '=', '1');
    rules.defineRule('focusPoints', 'magicNotes.kiRush', '+=', '1');
  } else if(name == 'Ki Strike') {
    rules.defineRule('features.Ki Spells', 'features.Ki Strike', '=', '1');
    rules.defineRule('focusPoints', 'magicNotes.kiStrike', '+=', '1');
  } else if(name == 'Multilingual') {
    rules.defineRule('skillNotes.multilingual',
      'rank.Society', '=', null,
      'feats.Multilingual', '*', null
    );
  } else if(name == 'Multitalented') {
    rules.defineRule('featCount.Class', 'featureNotes.multitalented', '+', '1');
  } else if(name == 'Orc Ferocity') {
    rules.defineRule('combatNotes.orcFerocity',
      '', '=', '"day"',
      'combatNotes.incredibleFerocity', '=', '"hour"'
    );
  } else if(name == 'Orc Sight') {
    rules.defineRule('features.Darkvision', 'featureNotes.orcSight', '=', '1');
  } else if(name.match(/^Order Explorer/)) {
    rules.defineRule('features.Order Explorer', 'feats.' + name, '=', '1');
  } else if(name == 'Order Magic (Animal Order)') {
    rules.defineRule
      ('spells.Heal Animal', 'magicNotes.orderMagic(AnimalOrder)', '=', '1');
  } else if(name == 'Order Magic (Leaf Order)') {
    rules.defineRule
      ('spells.Goodberry', 'magicNotes.orderMagic(LeafOrder)', '=', '1');
  } else if(name == 'Order Magic (Storm Order)') {
    rules.defineRule
      ('spells.Tempest Surge', 'magicNotes.orderMagic(StormOrder)', '=', '1');
  } else if(name == 'Order Magic (Wild Order)') {
    rules.defineRule
      ('spells.Wild Morph', 'magicNotes.orderMagic(WildOrder)', '=', '1');
  } else if(name == 'Primal Summons') {
    rules.defineRule
      ('spells.Primal Summons', 'magicNotes.primalSummons', '=', '1');
  } else if(name == 'Quaking Stomp') {
    rules.defineRule('spells.Earthquake', 'magicNotes.quakingStomp', '=', '1');
  } else if(name == 'Quickened Casting') {
    rules.defineRule('magicNotes.quickenedCasting.1',
      'features.Quickened Casting', '?', null,
      '', '=', '0'
    );
    [3, 4, 5, 6, 7, 8, 9, 10].forEach(l => {
      rules.defineRule('magicNotes.quickenedCasting.1',
        'spellSlots.A' + l, '^', l - 2,
        'spellSlots.D' + l, '^', l - 2,
        'spellSlots.O' + l, '^', l - 2,
        'spellSlots.P' + l, '^', l - 2
      );
    });
  } else if(name == 'Rough Rider') {
    rules.defineRule('features.Ride', 'featureNotes.roughRider', '=', '1');
  } else if(name == 'Sorcerer Dedication') {
    rules.defineRule('sorcererFeatures.Bloodline',
      'featureNotes.sorcererDedication', '=', '1'
    );
    rules.defineRule
      ('magicNotes.sorcererDedication', 'bloodlineTraditions', '=', null);
    ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
      rules.defineRule('spellSlots.' + t.charAt(0) + '0',
        'magicNotes.sorcererDedication', '+=', 'source.includes("' + t + '") ? 2 : null'
      );
    });
    // Suppress validation errors for selected bloodlines and the notes for
    // features of bloodlines that don't come with Sorcerer Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let bloodlines =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Bloodline')).map(x => x.replace('Sorcerer - ', ''));
    bloodlines.forEach(b => {
      rules.defineRule('validationNotes.sorcerer-' + b + 'SelectableFeature',
        'featureNotes.sorcererDedication', '+', '1'
      );
      rules.defineRule('magicNotes.' + b.toLowerCase() + '-1',
        'featureNotes.sorcererDedication', '?', '!source'
      );
      rules.defineRule('magicNotes.' + b.toLowerCase() + '-2',
        'featureNotes.sorcererDedication', '?', '!source'
      );
    });
    rules.defineRule('magicNotes.bloodline',
      'featureNotes.sorcererDedication', '?', '!source'
    );
  } else if(name == 'Stonewalker') {
    rules.defineRule
      ('skillNotes.stonewalker', 'features.Stonecunning', '?', null);
  } else if(name == 'Studious Capacity') {
    rules.defineRule('magicNotes.studiousCapacity.1',
      'features.Studious Capacity', '?', null,
      '', '=', '0'
    );
    [2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(l => {
      rules.defineRule('magicNotes.studiousCapacity.1',
        'spellSlots.O' + l, '^', l - 1
      );
    });
  } else if(name == 'Supernatural Charm') {
    rules.defineRule('spells.Charm', 'magicNotes.supernaturalCharm', '=', '1');
  } else if(name == 'Uncanny Bombs') {
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons) {
      if(allWeapons[w].includes('Bomb'))
        rules.defineRule
          ('weaponRangeAdjustment.' + w, 'combatNotes.uncannyBombs', '^=', '40');
    }
  } else if(name == 'Verdant Metamorphosis') {
    rules.defineRule
      ('armorClass', 'combatNotes.verdantMetamorphosis', '^', '30');
  } else if(name == 'Wild Shape') {
    rules.defineRule('spells.Wild Shape', 'magicNotes.wildShape', '=', '1');
  } else if(name == 'Wind Caller') {
    rules.defineRule
      ('spells.Stormwind Flight', 'magicNotes.windCaller', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Pathfinder2E.featureRules = function(rules, name, sections, notes) {
  SRD35.featureRules(rules, name, sections, notes);
  for(let i = 0; i < sections.length; i++) {
    let note = notes[i];
    let section = sections[i];
    let noteName =
      section + 'Notes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
    note.split(/\s*\/\s*/).forEach(n => {
      let matchInfo =
        n.match(/([A-Z]\w*)\s(Expert|Legendary|Master|Trained)\s*\(([^\)]*)\)/i);
      if(matchInfo) {
        let group = matchInfo[1];
        let rank =
          matchInfo[2] == 'Trained' ? 1 : matchInfo[2] == 'Expert' ? 2 : matchInfo[2] == 'Master' ? 3 : 4;
        let choices = '';
        matchInfo[3].split(/;\s*/).forEach(element => {
          let m = element.match(/Choose (\d+|%V)/);
          if(m)
            choices += '+' + (m[1] == '%V' ? 'source' : m[1]);
          else if(!element.startsWith('%'))
            rules.defineRule('training.' + element, noteName, '^=', rank);
          if(group == 'Attack') {
            rules.defineRule('attackProficiency.' + element,
              'training.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
            );
          } else if(group == 'Defense') {
            rules.defineRule('defenseProficiency.' + element,
              'training.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
            );
          }
        });
        if(choices)
          rules.defineRule('choiceCount.' + group,
            noteName, '+=', choices.replace('+', '')
          );
      }
      matchInfo = n.match(/Perception\s(Expert|Legendary|Master|Trained)$/i);
      if(matchInfo) {
        let rank =
          matchInfo[1] == 'Trained' ? 1 : matchInfo[1] == 'Expert' ? 2 : matchInfo[1] == 'Master' ? 3 : 4;
        rules.defineRule('training.Perception', noteName, '^=', rank);
      }
      matchInfo = n.match(/(Ability|Skill)\s(Boost|Flaw|Increase)\s*\(([^\)]*)\)$/i);
      if(matchInfo) {
        let flaw = matchInfo[2].match(/flaw/i);
        let choices = '';
        matchInfo[3].split(/;\s*/).forEach(element => {
          let m = element.match(/Choose (\d+|%V)/);
          if(m)
            choices += '+' + (m[1] == '%V' ? 'source' : m[1]);
          else
            rules.defineRule
              (element.toLowerCase(), noteName, '+', flaw ? '-2' : '2');
        });
        if(choices)
          rules.defineRule('choiceCount.' + matchInfo[1],
            noteName, '+=', choices.replace('+', '')
          );
      }
    });
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
 * Defines in #rules# the rules associated with shield #name#, which costs
 * #price# gold pieces, adds #ac# to the character's armor class, reduces the
 * character's speed by #speed#, weight #bulk#, has hardness #hardness#, and
 * can absorb #hp# damage before becoming useless.
 */
Pathfinder2E.shieldRules = function(
  rules, name, price, ac, speed, bulk, hardness, hp
) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(typeof price == 'string' && price.match(/^0\.\d+$/))
    price = +price;
  if(typeof price != 'number') {
    console.log('Bad price "' + price + '" for shield ' + name);
    return;
  }
  if(typeof speed != 'number') {
    console.log('Bad speed "' + speed + '" for shield ' + name);
    return;
  }
  if(bulk == 'L')
    bulk = 0.1;
  if(typeof bulk != 'number') {
    console.log('Bad bulk "' + bulk + '" for shield ' + name);
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      ac:{},
      speed:{},
      hardness:{},
      hp:{}
    };
  }
  rules.shieldStats.ac[name] = ac;
  rules.shieldStats.speed[name] = speed;
  rules.shieldStats.hardness[name] = hardness;
  rules.shieldStats.hp[name] = hp;

  rules.defineRule('shieldACBonus',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.ac) + '[source]'
  );
  rules.defineRule('shieldSpeedPenalty',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.speed) + '[source]'
  );
  rules.defineRule('shieldHardness',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.hardness) + '[source]'
  );
  rules.defineRule('shieldHP',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.hp) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.) that belongs to
 * category #category#.
 */
Pathfinder2E.skillRules = function(rules, name, ability, category) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(typeof(ability) != 'string' ||
     !(ability.toLowerCase() in Pathfinder2E.ABILITIES)) {
    console.log('Bad ability "' + ability + '" for skill ' + name);
    return;
  }
  if(category && typeof(category) != 'string') {
    console.log('Bad category "' + category + '" for skill ' + name);
    return;
  }

  ability = ability.toLowerCase();
  rules.defineChoice
    ('notes', 'skillModifiers.' + name + ':%S (' + ability + '; %1)');
  if(name.match(/Lore$/)) {
    rules.defineRule('training.' + name, 'skillIncreases.' + name, '^=', '0');
    rules.defineRule('totalLoreRanks', 'rank.' + name, '+=', null);
  } else {
    rules.defineRule('training.' + name, '', '=', '0');
  }
  rules.defineRule('rank.' + name,
    'training.' + name, '=', null,
    'skillIncreases.' + name, '+', null
  );
  rules.defineRule('proficiencyLevelBonus.' + name,
    'rank.' + name, '=', 'source > 0 ? 0 : null',
    // TODO right place for this, or in featRulesExtra?
    'skillNotes.eclecticSkill', '=', '0',
    'level', '+', null
  );
  rules.defineRule('proficiencyBonus.' + name,
    'rank.' + name, '=', '2 * source',
    'proficiencyLevelBonus.' + name, '+', null
  );
  rules.defineRule('skillModifiers.' + name,
    'proficiencyBonus.' + name, '=', null,
    ability + 'Modifier', '+', null,
    'skillNotes.goodies' + name + 'Adjustment', '+', null
  );
  if(['dexterity', 'strength'].includes(ability))
    rules.defineRule
      ('skillModifiers.' + name, 'skillNotes.armorSkillPenalty', '+', null);
  rules.defineRule('skillModifiers.' + name + '.1',
    'rank.' + name, '=', 'Pathfinder2E.RANK_NAMES[source]'
  );

};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
Pathfinder2E.spellRules = function(
  rules, name, school, level, traditions, cast, description
) {
  if(!name) {
    console.log('Empty spell name');
    return;
  }
  if(!school || !(school in rules.getChoices('schools'))) {
    console.log('Bad school "' + school + '" for spell ' + name);
    return;
  }
  if(typeof(level) != 'number' && level != 'Cantrip') {
    console.log('Bad level "' + level + '" for spell ' + name);
    return;
  }
  if(!Array.isArray(traditions)) {
    console.log('Bad traditions list "' + traditions + '" for spell ' + name);
    return;
  }
  traditions.forEach(t => {
    if(!t.match(/^(Arcane|Divine|Occult|Primal)$/)) {
      console.log('Bad tradition "' + t + '" for spell ' + name);
      return;
    }
  });
  if(typeof(cast) != 'number' && typeof(cast) != 'string') {
    console.log('Bad cast "' + cast + '" for spell ' + name);
    return;
  }
  if(typeof(description) != 'string') {
    console.log('Bad description "' + description + '" for spell ' + name);
    return;
  }
  // TODO
  rules.defineChoice('notes', 'spells.' + name + ':' + description);
};

/* Defines in #rules# the rules associated with terrain #name#. */
Pathfinder2E.terrainRules = function(rules, name) {
  if(!name) {
    console.log('Empty terrain name');
    return;
  }
  // No rules pertain to terrain
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which costs
 * #price# gold pieces, requires a #category# proficiency level to use
 * effectively, adds #bulk# to the character's encumbrance, requires #hands#
 * hands to operate, belongs to group #group#, and has weapon properties
 * #traits#. If specified, the weapon can be used as a ranged weapon with a
 * range increment of #range# feet.
 */
Pathfinder2E.weaponRules = function(
  rules, name, category, price, damage, bulk, hands, group, traits, range
) {

  if(!name) {
    console.log('Bad name for weapon  "' + name + '"');
    return;
  }
  if(category == null ||
     !(category + '').match(/^(Unarmed|Simple|Martial|Advanced)$/)) {
    console.log('Bad category "' + category + '" for weapon ' + name);
    return;
  }
  if(typeof price == 'string' && price.match(/^0\.\d+$/))
    price = +price;
  if(typeof price != 'number') {
    console.log('Bad price "' + price + '" for weapon ' + name);
    return;
  }
  let matchInfo = (damage + '').match(/^(\d(d\d+)?)([BEPS])$/);
  if(!matchInfo) {
    console.log('Bad damage "' + damage + '" for weapon ' + name);
    return;
  }
  if(bulk == 'L')
    bulk = 0.1;
  if(typeof bulk != 'number') {
    console.log('Bad bulk "' + bulk + '" for weapon ' + name);
    return;
  }
  if(hands != 1 && hands != 2) {
    console.log('Bad hands "' + hands + '" for weapon ' + name);
    return;
  }
  if(!(group+'').match(/^(Axe|Bomb|Bow|Brawling|Club|Dart|Flail|Hammer|Knife|Pick|Polearm|Sling|Spear|Sword)$/)) {
    console.log('Bad group "' + group + '" for weapon ' + name);
    return;
  }
  if(!Array.isArray(traits)) {
    console.log('Bad traits list "' + traits + '" for weapon ' + name);
    return;
  }
  if(range && typeof range != 'number') {
    console.log('Bad range "' + range + '" for weapon ' + name);
  }

  let isFinesse = traits.includes('Finesse');
  let isRanged = group.match(/Bomb|Bow|Dart|Sling/);
  let isPropulsive = traits.includes('Propulsive');
  let isSplash = traits.includes('Splash');
  let isThrown = traits.includes('Thrown');
  let specialDamage =
    traits.filter(x => x.match(/Two-hand/)).map(x => x.replace('Two-hand', '2h')).concat(
    traits.filter(x => x.match(/Deadly/)).map(x => x.replace('Deadly ', 'Crit +'))).concat(
    traits.filter(x => x.match(/Fatal/)).map(x => x.replace('Fatal', 'Crit')));

  category = category != 'Unarmed' ? category + ' Weapons' : 'Unarmed Attacks';
  damage = matchInfo[1];
  group = group != 'Bomb' ? group + 's' : 'Alchemical Bombs';
  let damageType = matchInfo[3];
  traits.forEach(t => {
    if(t.match(/^Versatile [BPS]$/))
      damageType += '/' + t.charAt(t.length - 1);
  });

  let weaponName = 'weapons.' + name;
  let format = '%V (%1 %2%3 %4' + (specialDamage.length > 0 ? ' [' + specialDamage.join('; ') + ']' : '') + (range ? " R%7'" : '') + '; %5; %6)';

  rules.defineChoice('notes', weaponName + ':' + format);
  rules.defineRule('rank.' + category, 'training.' + category, '=', null);
  rules.defineRule('rank.' + group, 'training.' + group, '=', null);
  rules.defineRule('rank.' + name, 'training.' + name, '=', null);
  rules.defineRule('weaponRank.' + name,
    weaponName, '?', null,
    'rank.' + category, '=', null,
    'rank.' + group, '^=', null,
    'rank.' + name, '^=', null
  );
  rules.defineRule('proficiencyLevelBonus.' + name,
    weaponName, '?', null,
    'weaponRank.' + name, '=', '0',
    'level', '+', null
  );
  rules.defineRule('proficiencyBonus.' + name,
    weaponName, '?', null,
    'weaponRank.' + name, '^=', 'source * 2',
    'proficiencyLevelBonus.' + name, '+', null
  );

  rules.defineRule
    ('weaponAttackAdjustment.' + name, 'weapons.' + name, '=', '0');
  rules.defineRule
    ('weaponDamageAdjustment.' + name, 'weapons.' + name, '=', '0');
  rules.defineRule('attackBonus.' + name,
    weaponName, '=', '0',
    isFinesse ? 'maxStrOrDexModifier' :
    isRanged ? 'combatNotes.dexterityAttackAdjustment' :
               'combatNotes.strengthAttackAdjustment', '+', null,
    'proficiencyBonus.' + name, '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    'weaponDamageAdjustment.' + name, '+', null
  );
  rules.defineRule('weaponDieType.' + name,
    weaponName, '=', damage.replace(/^\d(d)?/, ''),
    'weaponDieTypeBonus.' + name, '+', null
  );
  if(damage == '0')
    ; // empty
  else if(!isRanged || (isThrown && !isSplash))
    rules.defineRule('damageBonus.' + name, 'strengthModifier', '+', null);
  else if(isPropulsive)
    rules.defineRule('damageBonus.' + name,
      'strengthModifier', '+', 'source<0 ? source : Math.floor(source / 2)'
    );

  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'QuilvynUtils.signed(source)'
  );
  rules.defineRule(weaponName + '.2',
    weaponName, '=', '"' + damage + '"',
    'weaponDieType.' + name, '=', '"' + damage.replace(/d\d+/, 'd') + '" + source'
  );
  rules.defineRule(weaponName + '.3',
    'damageBonus.' + name, '=', 'source == 0 ? "" : QuilvynUtils.signed(source)'
  );
  rules.defineRule
    (weaponName + '.4', weaponName, '=', '"' + damageType + '"');
  rules.defineRule(weaponName + '.5',
    weaponName, '?', null,
    '', '=', isRanged ? '"dexterity"' : '"strength"', '=', null
  );
  if(isFinesse)
    rules.defineRule(weaponName + '.5', 'maxStrOrDex', '=', null);
  rules.defineRule(weaponName + '.6',
    weaponName, '=', '"untrained"',
    'weaponRank.' + name, '=', 'Pathfinder2E.RANK_NAMES[source]'
  );
  if(range) {
    rules.defineRule('range.' + name,
      weaponName, '=', range,
      'weaponRangeAdjustment.' + name, '+', null
    );
    rules.defineRule(weaponName + '.7', 'range.' + name, '=', null);
  }

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
    let matchInfo =
      feature.match(/([A-Z]\w*)\s(Expert|Legendary|Master|Trained)\s*\(([^\)]*)\)$/i);
    if(matchInfo) {
      let choices = '';
      let group = matchInfo[1];
      let rank =
        matchInfo[2] == 'Trained' ? 1 : matchInfo[2] == 'Expert' ? 2 : matchInfo[2] == 'Master' ? 3 : 4;
      matchInfo[3].split(/;\s*/).forEach(element => {
        let m = element.match(/Choose (\d+)/);
        if(m)
          choices += '+' + m[1];
        else {
          rules.defineRule
            ('training.' + element, setName + '.' + feature, '^=', rank);
          if(group == 'Attack')
            rules.defineRule('attackProficiency.' + element,
              'training.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
            );
          else if(group == 'Defense')
            rules.defineRule('defenseProficiency.' + element,
              'training.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
            );
        }
      });
      if(choices)
        rules.defineRule('choiceCount.' + group,
          setName + '.' + feature, '+=', choices.replace('+', '')
        );
    }
    matchInfo =
      feature.match(/Perception\s(Expert|Legendary|Master|Trained)$/i);
    if(matchInfo) {
      let rank =
        matchInfo[1] == 'Trained' ? 1 : matchInfo[1] == 'Expert' ? 2 : matchInfo[1] == 'Master' ? 3 : 4;
      rules.defineRule
        ('training.Perception', setName + '.' + feature, '^=', rank);
    }
    matchInfo =
      feature.match(/(Ability|Skill)\s(Boost|Flaw|Increase)\s*\(([^\)]*)\)$/i);
    if(matchInfo) {
      let flaw = matchInfo[2].match(/flaw/i);
      let choices = '';
      matchInfo[3].split(/;\s*/).forEach(element => {
        let m = element.match(/Choose (\d+)/);
        if(m)
          choices += '+' + m[1];
        else
          rules.defineRule
            (element.toLowerCase(), setName + '.' + feature, '+', flaw ? '-2' : '2');
      });
      if(choices)
        rules.defineRule('choiceCount.' + matchInfo[1],
          setName + '.' + feature, '+=', choices.replace('+', '')
        );
    }
  }
};

/*
 * Returns an object that contains all the choices for #name# previously
 * defined for this rule set via addChoice.
 */
Pathfinder2E.getChoices = function(name) {
  return this.choices[name == 'classs' ? 'levels' : name];
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
              {name: 'Heritage', within: 'Identity', format: ' <b>%V</b>'},
              {name: 'Levels', within: 'Identity', format: ' <b>%V</b>',
               separator: '/'},
            {name: 'Hit Points', within: 'Section 1', format: '<b>HP</b> %V'},
            {name: 'Initiative', within: 'Section 1', format: '<b>Init</b> %V'},
            {name: 'Speed', within: 'Section 1', format: '<b>Speed</b> %V'},
            {name: 'Armor Class', within: 'Section 1', format: '<b>AC</b> %V'},
            {name: 'Class Difficulty Class', within: 'Section 1',
             format: '<b>Class DC</b>: %V', separator: '/'},
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
            {name: 'Perception', within: 'Section 2'},
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
        {name: 'Header', within: '_top', separator: ''},
          {name: 'Image Url', within: 'Header', format: '<img src="%V" alt="No Image" style="height:75px; vertical-align:middle"/>&nbsp;&nbsp;'},
          {name: 'Name', within: 'Header', format: '<b>%V</b>'},
          {name: 'Gender', within: 'Header', format: ' -- <b>%V</b>'},
          {name: 'Heritage', within: 'Header', format: ' <b>%V</b>'},
          {name: 'Levels', within: 'Header', format: ' <b>%V</b>',
           separator: '/'},
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
            {name: 'Size', within: 'AbilityStats'},
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
          {name: 'Perception', within: 'FeaturesAndSkills'},
          {name: 'Skill Modifiers', within: 'FeaturesAndSkills', columns: '3LE', separator: null},
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
              {name: 'Class Difficulty Class', within: 'CombatStats',
               format: '<b>Class DC</b>: %V', separator: '; '},
/* TODO include this?
            {name: 'CombatProficiencies', within: 'CombatPart',
             separator: innerSep},
              {name: 'Defense Proficiency', within: 'CombatProficiencies',
               separator: '; '},
              {name: 'Attack Proficiency', within: 'CombatProficiencies',
               separator: '; '},
*/
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
              {name: 'Focus Points', within: 'SpellStats', separator:listSep},
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
    ['ancestry', 'Ancestry', 'select-one', 'ancestrys'],
    ['background', 'Background', 'select-one', 'backgrounds'],
    ['experience', 'Experience', 'text', [8]],
    ['levels', 'Levels', 'bag', 'levels'],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['abilityGeneration', 'Ability Generation', 'select-one', 'abilgens'],
    ['strength', 'Str/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.strength', '', 'text', [3]],
    ['dexterity', 'Dex/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.dexterity', '', 'text', [3]],
    ['constitution', 'Con/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.constitution', '', 'text', [3]],
    ['intelligence', 'Int/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.intelligence', '', 'text', [3]],
    ['wisdom', 'Wis/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.wisdom', '', 'text', [3]],
    ['charisma', 'Cha/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.charisma', '', 'text', [3]],
    ['player', 'Player', 'text', [20]],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['gender', 'Gender', 'text', [10]],
    ['deity', 'Deity', 'select-one', 'deitys'],
    ['origin', 'Origin', 'text', [20]],
    ['feats', 'Feats', 'setbag', 'feats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skillIncreases', 'Skills', 'setbag', 'skills'],
    ['languages', 'Languages', 'set', 'languages'],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'setbag', 'weapons'],
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
  syllables = ancestry == 'Dwarf' ? 2 : // Core rulebook states this
              syllables < 50 ? 2 :
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

  if(attribute == 'abilities' || attribute in Pathfinder2E.ABILITIES) {
    for(attr in Pathfinder2E.ABILITIES) {
      if(attribute != attr && attribute != 'abilities')
        continue;
      if((attributes.abilityGeneration + '').match(/4d6/)) {
        let rolls = [];
        for(i = 0; i < 4; i++)
          rolls.push(QuilvynUtils.random(1, 6));
        rolls.sort();
        attributes[attr] = rolls[1] + rolls[2] + rolls[3];
      } else {
        attributes[attr] = 10;
      }
    }
  } else if(attribute == 'armor') {
    attrs = this.applyRules(attributes);
    let armors = this.getChoices('armors');
    choices = [];
    for(let attr in armors) {
      let category = QuilvynUtils.getAttrValue(armors[attr], 'Category');
      if(category == 'Unarmored' && 'rank.Unarmored Defense' in attrs)
        choices.push(attr);
      else if(('rank.' + category + ' Armor') in attrs)
        choices.push(attr);
    }
    attributes.armor = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'boosts') {
    let boostsAllocated = {};
    for(attr in Pathfinder2E.ABILITIES) {
      boostsAllocated[attr] = attributes['abilityBoosts.' + attr] || 0;
    }
    attrs = this.applyRules(attributes);
    let notes = this.getChoices('notes');
    for(attr in attrs) {
      if((matchInfo = attr.match(/^\w+features.Ability\s+Boost\s+\([^\)]*\)/gi)))
        ; // empty
      else if(!notes[attr] ||
         (matchInfo=notes[attr].match(/Ability\s+Boost\s+\([^\)]*\)/gi))==null)
        continue;
      matchInfo.forEach(matched => {
        matched = matched.replace(/.*\(/i, '').replace(/\)/, '');
        let anyChoices = Object.keys(Pathfinder2E.ABILITIES);
        matched.split(/\s*;\s*/).forEach(boost => {
          let m = boost.match(/Choose\s+(%V|\d+)\s+from\s+([\w,\s]*)/i);
          if(!m) {
            anyChoices = anyChoices.filter(x => x != boost.toLowerCase());
          } else {
            howMany = m[1].startsWith('%') ? attrs[attr] : +m[1];
            choices = m[2].match(/^any$/i) ? anyChoices : m[2].split(/\s*,\s*/);
            choices = choices.map(x => x.toLowerCase());
            choices.forEach(choice => {
              if(howMany > 0 && boostsAllocated[choice] > 0) {
                howMany--;
                boostsAllocated[choice]--;
              }
            });
            while(howMany > choices.length) {
              // Probably only true for level-based ability boosts
              choices.forEach(c => {
                attributes['abilityBoosts.' + c] = (attributes['abilityBoosts.' + c] || 0) + 1;
              });
              howMany -= choices.length;
            }
            while(howMany > 0 && choices.length > 0) {
              let choice = randomElement(choices);
              attributes['abilityBoosts.' + choice] = (attributes['abilityBoosts.' + choice] || 0) + 1;
              howMany--;
              choices = choices.filter(x => x != choice);
              anyChoices = anyChoices.filter(x => x != choice);
            }
          }
        });
      });
    }
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
    let deities = this.getChoices('deitys');
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
      if(attr.startsWith(countPrefix))
        toAllocateByType[attr.replace(countPrefix, '')] = attrs[attr];
    }
    let availableChoices = {};
    let allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      let types = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Type');
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
    if(attribute == 'feat') {
      debug.push('Replace Ancestry with ' + attributes.ancestry);
      toAllocateByType[attributes.ancestry] = toAllocateByType.Ancestry;
      for(let a in this.getChoices('levels')) {
        if(!attributes['levels.' + a])
          continue;
        debug.push('Replace Class with ' + a);
        toAllocateByType[a] = toAllocateByType.Class;
        break;
      }
      delete toAllocateByType.Ancestry;
      delete toAllocateByType.Class;
    }
    for(attr in toAllocateByType) {
      let availableChoicesInType = {};
      for(let a in availableChoices) {
        if(availableChoices[a].includes(attr))
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
    // TODO The rules have no restrictions on shield use; give, e.g., Wizards
    // no shield?
    choices = Object.keys(this.getChoices('shields'));
    attributes.shield = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'skills') {
    let increasesAllocated = {};
    let allSkills = this.getChoices('skills');
    for(attr in this.getChoices('skills'))
      increasesAllocated[attr] = attributes['skillIncreases.' + attr] || 0;
    attrs = this.applyRules(attributes);
    let notes = this.getChoices('notes');
    for(attr in attrs) {
      if((matchInfo = attr.match(/\wfeatures.Skill\s+(Expert|Legendary|Master|Trained)\s+\([^\)]*\)/gi)))
        ; // empty
      else if(!notes[attr] ||
         (matchInfo = notes[attr].match(/Skill\s+(Expert|Legendary|Master|Trained)\s+\([^\)]*\)/gi))==null)
        continue;
      // TODO how to handle allocations above Trained?
      matchInfo.forEach(matched => {
        matched.split(/\s*;\s*/).forEach(increase => {
          let m = increase.match(/Choose\s+(%V|\d+)\s+from\s+([\w,\s]*)/i);
          if(m) {
            howMany = m[1] == '%V' ? attrs[attr] : +m[1];
            if(m[2].match(/^any$/i))
              choices = Object.keys(allSkills);
            else if(m[2].match(/^any\slore$/i))
              choices = Object.keys(allSkills).filter(x => x.includes('Lore'));
            else if(m[2].match(/^any\s/i))
              choices = Object.keys(allSkills).filter(x => allSkills[x].includes(m[2].replace(/any\s+/, '')));
            else
              choices = m[2].split(/\s*,\s*/);
            choices.forEach(choice => {
              if(howMany > 0 && increasesAllocated[choice] > 0) {
                howMany--;
                increasesAllocated[choice]--;
              }
            });
            while(howMany > 0 && choices.length > 0) {
              let choice = randomElement(choices);
              attributes['skillIncreases.' + choice] =
                (attributes['skillIncreases.' + choice] || 0) + 1;
              howMany--;
              choices = choices.filter(x => x != choice);
            }
          }
        });
      });
    }
  } else if(attribute == 'spells') {
/*
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
  */
  } else if(attribute == 'weapons') {
    let weapons = this.getChoices('weapons');
    let clas = 'Fighter';
    for(attr in attributes) {
      if(attr.match(/^levels\./))
        clas = attr.replace('levels.', '');
    }
    let race = attributes.race || 'Human';
    attrs = this.applyRules(attributes);
    choices = [];
    howMany = 3;
    for(attr in weapons) {
      if(attributes['weapons.' + attr]) {
        howMany--;
        continue;
      }
      let category = QuilvynUtils.getAttrValue(weapons[attr], 'Category');
      if(weapons[attr].includes('Uncommon') &&
         !weapons[attr].includes(clas) &&
         !weapons[attr].includes(race))
        continue;
      category += category == 'Unarmed' ? ' Attacks' : ' Weapons';
      if(attrs['rank.' + category] || attrs['rank.' + attr])
        choices.push(attr);
    }
    if(howMany > 0)
      pickAttrs(attributes, 'weapons.', choices, howMany, 1);
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

/* Returns an array of plugins upon which this one depends. */
Pathfinder2E.getPlugins = function() {
  return [];
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
    'To simplify the tracking of character level, the PF2E plugin assumes ' +
    'that the experience points entered for a character are cumulative from ' +
    'the character creation, rather than only the experience points over the ' +
    'amount required to advance to their current level. For example, a 5th ' +
    'level character would have between 5000 and 5999 experience points.\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    'Quilvyn does not note the age requirement for the elven Ancestral ' +
    'Longevity feat.\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '</p>\n';
};
