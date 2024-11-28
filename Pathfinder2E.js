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
/* globals Expr, ObjectViewer, Quilvyn, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * This module loads the rules from the Pathfinder Second Edition rules. The
 * Pathfinder2E function contains methods that load rules for particular parts
 * of the rules: ancestryRules for character ancestries, magicRules for spells,
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

  Pathfinder2E.abilityRules(rules, Pathfinder2E.ABILITIES);
  Pathfinder2E.combatRules
    (rules, Pathfinder2E.ARMORS, Pathfinder2E.SHIELDS, Pathfinder2E.WEAPONS);
  Pathfinder2E.magicRules
    (rules, Pathfinder2E.SCHOOLS, Pathfinder2E.SPELLS, Pathfinder2E.DOMAINS);
  Pathfinder2E.identityRules(
    rules, Pathfinder2E.ALIGNMENTS, Pathfinder2E.ANCESTRIES,
    Pathfinder2E.BACKGROUNDS, Pathfinder2E.CLASSES, Pathfinder2E.DEITIES,
    Pathfinder2E.BLOODLINES
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
  'Alignment', 'Ancestry', 'Armor', 'Background', 'Bloodline', 'Class',
  'Deity', 'Domain', 'Feat', 'Feature', 'Goody', 'Language', 'Lore', 'School',
  'Shield', 'Skill', 'Spell', 'Terrain', 'Weapon'
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
  'armor', 'weapons', 'shield', 'spells'
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
      '"abilityGeneration =~ \'10s.*standard\' ? 1:Ability Boost (Constitution; Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6.*standard\' ? 1:Ability Boost (Constitution; Wisdom)",' +
      '"abilityGeneration =~ \'10s.*two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6.*one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Charisma)",' +
      '1:Darkvision,"1:Clan Dagger","1:Ancestry Feats","1:Dwarf Heritage" ' +
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
      '"abilityGeneration =~ \'10s.*standard\' ? 1:Ability Boost (Dexterity; Intelligence; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6.*standard\' ? 1:Ability Boost (Dexterity; Intelligence)",' +
      '"abilityGeneration =~ \'10s.*two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6.*one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Constitution)",' +
      '"1:Low-Light Vision","1:Ancestry Feats","1:Elf Heritage" ' +
    'Selectables=' +
      '"1:Arctic Elf:Heritage","1:Cavern Elf:Heritage","1:Seer Elf:Heritage",' +
      '"1:Whisper Elf:Heritage","1:Woodland Elf:Heritage" ' +
    'Traits=Elf,Humanoid ' +
    'Languages=Common,Elven',
  'Gnome':
    'HitPoints=8 ' +
    'Size=Small ' +
    'Features=' +
      '"abilityGeneration =~ \'10s.*standard\' ? 1:Ability Boost (Charisma; Constitution; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6.*standard\' ? 1:Ability Boost (Charisma; Constitution)",' +
      '"abilityGeneration =~ \'10s.*two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6.*one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Strength)",' +
      '"1:Low-Light Vision",1:Small,"1:Ancestry Feats","1:Gnome Heritage" ' +
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
      '"abilityGeneration =~ \'10s.*standard\' ? 1:Ability Boost (Charisma; Dexterity; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6.*standard\' ? 1:Ability Boost (Charisma; Dexterity)",' +
      '"abilityGeneration =~ \'10s.*two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6.*one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Wisdom)",' +
      '1:Darkvision,1:Small,"1:Ancestry Feats","1:Goblin Heritage" ' +
    'Selectables=' +
      '"1:Charhide Goblin:Heritage","1:Irongut Goblin:Heritage",' +
      '"1:Razortooth Goblin:Heritage","1:Snow Goblin:Heritage",' +
      '"1:Unbreakable Goblin:Heritage" ' +
    'Languages=Common,Goblin',
  'Halfling':
    'HitPoints=6 ' +
    'Size=Small ' +
    'Features=' +
      '"abilityGeneration =~ \'10s.*standard\' ? 1:Ability Boost (Dexterity; Wisdom; Choose 1 from any)",' +
      '"abilityGeneration =~ \'4d6.*standard\' ? 1:Ability Boost (Dexterity; Wisdom)",' +
      '"abilityGeneration =~ \'10s.*two free\' ? 1:Ability Boost (Choose 2 from any)",' +
      '"abilityGeneration =~ \'4d6.*one free\' ? 1:Ability Boost (Choose 1 from any)",' +
      '"abilityGeneration =~ \'standard\' ? 1:Ability Flaw (Strength)",' +
      '"1:Keen Eyes",1:Small,"1:Ancestry Feats","1:Halfling Heritage" ' +
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
      '"1:Ancestry Feats","1:Human Heritage" ' +
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
      '"1:Martial Focus",' +
      '"martialDiscipleFeatures.Acrobatics ? 1:Skill Trained (Acrobatics; Warfare Lore)",' +
      '"martialDiscipleFeatures.Acrobatics ? 1:Cat Fall",' +
      '"martialDiscipleFeatures.Athletics ? 1:Skill Trained (Athletics; Warfare Lore)",' +
      '"martialDiscipleFeatures.Athletics ? 1:Quick Jump" ' +
    'Selectables=' +
      '"1:Acrobatics:Martial Focus",' +
      '"1:Athletics:Martial Focus"',
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
      '"1:Scholarly Tradition",' +
      '"scholarFeatures.Arcana ? 1:Skill Trained (Arcana; Academia Lore)",' +
      '"scholarFeatures.Arcana ? 1:Assurance (Arcana)",' +
      '"scholarFeatures.Nature ? 1:Skill Trained (Nature; Academia Lore)",' +
      '"scholarFeatures.Nature ? 1:Assurance (Nature)",' +
      '"scholarFeatures.Occultism ? 1:Skill Trained (Occultism; Academia Lore)",' +
      '"scholarFeatures.Occultism ? 1:Assurance (Occultism)",' +
      '"scholarFeatures.Religion ? 1:Skill Trained (Religion; Academia Lore)",' +
      '"scholarFeatures.Religion ? 1:Assurance (Religion)" ' +
    'Selectables=' +
      '"1:Arcana:Scholarly Tradition",' +
      '"1:Nature:Scholarly Tradition",' +
      '"1:Occultism:Scholarly Tradition",' +
      '"1:Religion:Scholarly Tradition"',
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
Pathfinder2E.BLOODLINES = {
  'Aberrant':
      'SpellList=Occult ' +
      'BloodlineSkills=Intimidation,Occultism ' +
      'BloodlineSpells="Tentacular Limbs","Aberrant Whispers","Unusual Anatomy" ' +
      'BloodMagic="gives self or target +2 Will saves for 1 rd"',
  'Angelic':
      'SpellList=Divine ' +
      'BloodlineSkills=Diplomacy,Religion ' +
      'BloodlineSpells="Angelic Halo","Angelic Wings","Celestial Brand" ' +
      'BloodMagic="gives self or target +1 saves for 1 rd"',
  'Demonic':
      'SpellList=Divine ' +
      'BloodlineSkills=Intimidation,Religion ' +
      'BloodlineSpells="Glutton\'s Jaws","Swamp Of Sloth","Abyssal Wrath" ' +
      'BloodMagic="gives self +1 Intimidation for 1 rd or inflicts -1 AC on target for 1 rd"',
  'Diabolic':
      'SpellList=Divine ' +
      'BloodlineSkills=Deception,Religion ' +
      'BloodlineSpells="Diabolic Edict","Embrace The Pit","Hellfire Plume" ' +
      'BloodMagic="gives self +1 Deception for 1 rd or inflicts 1 HP fire per spell level"',
  'Draconic':
      'SpellList=Arcane ' +
      'BloodlineSkills=Arcana,Intimidation ' +
      'BloodlineSpells="Dragon Claws","Dragon Breath","Dragon Wings" ' +
      // TODO '"Shows physical relationship to chosen dragon type",' +
      'BloodMagic="gives self or target +1 AC for 1 rd"',
  'Elemental':
      'SpellList=Primal ' +
      'BloodlineSkills=Intimidation,Nature ' +
      'BloodlineSpells="Elemental Toss","Elemental Motion","Elemental Blast" ' +
      // TODO '"Shows physical relationship to chosen elemental type",' +
      'BloodMagic="gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning or fire per spell level on target for 1 rd"',
  'Fey':
      'SpellList=Primal ' +
      'BloodlineSkills=Deception,Nature ' +
      'BloodlineSpells="Faerie Dust","Fey Disappearance","Fey Glamour" ' +
      'BloodMagic="gives self or target concealment for 1 rd"',
  'Hag':
      'SpellList=Occult ' +
      'BloodlineSkills=Deception,Occultism ' +
      'BloodlineSpells="Jealous Hex","Horrific Visage","You\'re Mine" ' +
      'BloodMagic="inflicts 2 HP mental per spell level (Will negates) to first successful attacker for 1 rd"',
  'Imperial':
      'SpellList=Arcane ' +
      'BloodlineSkills=Arcana,Society ' +
      'BloodlineSpells="Ancestral Memories","Extend Spell","Arcane Countermeasure" ' +
      'BloodMagic="gives self or target +1 skill checks for 1 rd"',
  'Undead':
      'SpellList=Divine ' +
      'BloodlineSkills=Intimidation,Religion ' +
      'BloodlineSpells="Undeath\'s Blessing","Drain Life","Grasping Grave" ' +
      'BloodMagic="gives self 1 temporary Hit Point per spell level for 1 rd or inflicts 1 HP negative per spell level on target for 1 rd"'
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
      '1:Alchemy,"1:Infused Reagents","1:Advanced Alchemy","1:Quick Alchemy",' +
      '"1:Formula Book","1:Research Field","1:Mutagenic Flashback",' +
      '"1:Alchemist Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases","5:Field Discovery","5:Powerful Alchemy",' +
      '"7:Alchemical Weapon Expertise","7:Iron Will","7:Perpetual Infusions",' +
      '"9:Alchemical Expertise",9:Alertness,"9:Double Brew",' +
      '11:Juggernaut,"11:Perpetual Potency",' +
      '"features.Bomber ? 13:Greater Field Discovery (Bomber)",' +
      '"features.Chirurgeon ? 13:Greater Field Discovery (Chirurgeon)",' +
      '"features.Mutagenist ? 13:Greater Field Discovery (Mutagenist)",' +
      '"13:Medium Armor Expertise","13:Weapon Specialization",' +
      '"15:Alchemical Alacrity",15:Evasion,"17:Alchemical Mastery",' +
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
      '1:Rage,1:Instinct,"1:Instinct Ability","1:Barbarian Feats",' +
      '"2:Skill Feats","3:Deny Advantage","3:General Feats",' +
      '"3:Skill Increases",5:Brutality,7:Juggernaut,' +
      '"7:Specialization Ability","7:Weapon Specialization",' +
      '"9:Lightning Reflexes","9:Raging Resistance","11:Mighty Rage",' +
      '"13:Greater Juggernaut","13:Medium Armor Expertise","13:Weapon Fury",' +
      '"15:Greater Weapon Specialization","15:Indomitable Will",' +
      '"17:Heightened Senses","17:Quick Rage","19:Armor Of Fury",' +
      '19:Devastator ' +
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
      '"1:Occult Spellcasting","1:Composition Spells",1:Muses,' +
      '"2:Bard Feats","2:Skill Feats","3:General Feats",' +
      '"3:Lightning Reflexes","3:Signature Spells","3:Skill Increases",' +
      '"7:Expert Spellcaster","9:Great Fortitude",9:Resolve,' +
      '"11:Bard Weapon Expertise","11:Vigilant Senses",' +
      '"13:Light Armor Expertise","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Greater Resolve","19:Magnum Opus",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '1:Enigma:Muse,1:Maestro:Muse,1:Polymath:Muse ' +
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
      '"1:Champion Key Ability",' +
      '"features.Dexterity ? 1:Ability Boost (Dexterity)",' +
      '"features.Strength ? 1:Ability Boost (Strength)",' +
      '"1:Ability Boosts",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Will)","1:Save Trained (Reflex)",' +
      '"1:Champion Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"1:Class Trained (Champion)",' +
      '"1:Spell Trained (Divine)",' +
      '"1:Deity And Cause","1:Champion\'s Code","1:Deific Weapon",' +
      '"1:Champion\'s Reaction",' +
      '"1:Devotion Spells","1:Shield Block","1:Champion Feats",' +
      '"2:Skill Feats","3:Divine Ally","3:General Feats","3:Skill Increases",' +
      '"5:Weapon Expertise","7:Armor Expertise","7:Weapon Specialization",' +
      '"9:Champion Expertise",' +
      '"features.Liberator ? 9:Divine Smite (Liberator)",' +
      '"features.Paladin ? 9:Divine Smite (Paladin)",' +
      '"features.Redeemer ? 9:Divine Smite (Redeemer)",' +
      '9:Juggernaut,"9:Lightning Reflexes",11:Alertness,"11:Divine Will",' +
      '"features.Liberator ? 11:Exalt (Liberator)",' +
      '"features.Paladin ? 11:Exalt (Paladin)",' +
      '"features.Redeemer ? 11:Exalt (Redeemer)",' +
      '"13:Armor Mastery","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","17:Champion Mastery",' +
      '"17:Legendary Armor","19:Hero\'s Defiance" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability","1:Strength:Key Ability",' +
      '"1:The Tenets Of Good:Champion\'s Code",' +
      '"1:Divine Ally (Blade):Divine Ally",' +
      '"1:Divine Ally (Shield):Divine Ally",' +
      '"1:Divine Ally (Steed):Divine Ally",' +
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
      '1:Anathema,1:Deity,"1:Divine Spellcasting","1:Divine Font",' +
      '1:Doctrine,"2:Cleric Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases",5:Alertness,9:Resolve,"11:Lightning Reflexes",' +
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
      '"1:Primal Spellcasting",1:Anathema,"1:Druidic Language",' +
      '"1:Druidic Order","1:Shield Block","1:Wild Empathy","2:Druid Feats",' +
      '"2:Skill Feats",3:Alertness,"3:General Feats","3:Great Fortitude",' +
      '"3:Skill Increases","5:Lightning Reflexes","7:Expert Spellcaster",' +
      '"11:Druid Weapon Expertise",11:Resolve,"13:Medium Armor Expertise",' +
      '"13:Weapon Specialization","15:Master Spellcaster",' +
      '"19:Legendary Spellcaster","19:Primal Hierophant" ' +
    'Selectables=' +
      '1:Animal:Order,' +
      '1:Leaf:Order,' +
      '1:Storm:Order,' +
      '1:Wild:Order ' +
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
      '"1:Fighter Key Ability",' +
      '"features.Dexterity ? 1:Ability Boost (Dexterity)",' +
      '"features.Strength ? 1:Ability Boost (Strength)",' +
      '"1:Ability Boosts",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Fighter Skills",' +
      '"1:Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)","1:Attack Trained (Advanced Weapons)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"1:Class Trained (Fighter)",' +
      '"1:Attack Of Opportunity","1:Shield Block","1:Fighter Feats",' +
      '"2:Skill Feats",3:Bravery,"3:General Feats","3:Skill Increases",' +
      '"5:Fighter Weapon Mastery","7:Battlefield Surveyor",' +
      '"7:Weapon Specialization","9:Combat Flexibility",9:Juggernaut,' +
      '"11:Armor Expertise","11:Fighter Expertise","13:Weapon Legend",' +
      '15:Evasion,"15:Greater Weapon Specialization",' +
      '"15:Improved Flexibility","17:Armor Mastery","19:Versatile Legend" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability","1:Strength:Key Ability"',
  'Monk':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Monk Key Ability",' +
      '"features.Dexterity ? 1:Ability Boost (Dexterity)",' +
      '"features.Strength ? 1:Ability Boost (Strength)",' +
      '"1:Ability Boosts",' +
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
      '"1:Dexterity:Key Ability","1:Strength:Key Ability",' +
      '"1:Ki Tradition (Divine):Ki Tradition",' +
      '"1:Ki Tradition (Occult):Ki Tradition",' +
      '"7:Path To Perfection (Fortitude):Perfection",' +
      '"7:Path To Perfection (Reflex):Perfection",' +
      '"7:Path To Perfection (Will):Perfection",' +
      '"features.Path To Perfection (Fortitude) ? 7:Third Path To Perfection (Fortitude):Third Perfection",' +
      '"features.Path To Perfection (Reflex) ? 7:Third Path To Perfection (Reflex):Third Perfection",' +
      '"features.Path To Perfection (Will) ? 7:Third Path To Perfection (Will):Third Perfection"',
  'Ranger':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ranger Key Ability",' +
      '"features.Dexterity ? 1:Ability Boost (Dexterity)",' +
      '"features.Strength ? 1:Ability Boost (Strength)",' +
      '"1:Ability Boosts",' +
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
      '"9:Ranger Expertise",11:Juggernaut,"11:Medium Armor Expertise",' +
      '"11:Wild Stride","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","15:Improved Evasion",' +
      '"15:Incredible Senses","17:Masterful Hunter","19:Second Skin",' +
      '"19:Swift Prey" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability","1:Strength:Key Ability",' +
      '"1:Flurry:Hunter\'s Edge",' +
      '"1:Precision:Hunter\'s Edge",' +
      '"1:Outwit:Hunter\'s Edge"',
  'Rogue':
    'Ability=dexterity,charisma,strength HitPoints=8 ' +
    'Features=' +
      '"1:Rogue Key Ability",' +
      '"1:Ability Boosts",' +
      '"features.Charisma ? 1:Ability Boost (Charisma)",' +
      '"features.Constitution ? 1:Ability Boost (Constitution)",' +
      '"features.Dexterity ? 1:Ability Boost (Dexterity)",' +
      '"features.Intelligence ? 1:Ability Boost (Intelligence)",' +
      '"features.Strength ? 1:Ability Boost (Strength)",' +
      '"features.Wisdom ? 1:Ability Boost (Wisdom)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Reflex; Will)","Save Trained (Fortitude)",' +
      '"1:Rogue Skills",' +
      '"1:Attack Trained (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Class Trained (Rogue)",' +
      '"1:Rogue\'s Racket","1:Sneak Attack","1:Surprise Attack",' +
      '"1:Rogue Feats","1:Skill Feats","2:Skill Increases",' +
      '"3:Deny Advantage","3:General Feats","5:Weapon Tricks",7:Evasion,' +
      '"7:Vigilant Senses","7:Weapon Specialization","9:Debilitating Strike",' +
      '"9:Great Fortitude","11:Rogue Expertise","13:Improved Evasion",' +
      '"13:Incredible Senses","13:Light Armor Expertise","13:Master Tricks",' +
      '"15:Double Debilitation","15:Greater Weapon Specialization",' +
      '"17:Slippery Mind","19:Light Armor Mastery","19:Master Strike" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability",' +
      '"features.Ruffian ? 1:Strength:Key Ability",' +
      '"features.Scoundrel ? 1:Charisma:Key Ability",' +
      '1:Ruffian:Racket,' +
      '1:Scoundrel:Racket,' +
      '1:Thief:Racket',
  'Sorcerer':
    'Ability=charisma HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Sorcerer Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '1:Bloodline,"1:Sorcerer Spellcasting","2:Skill Feats",' +
      '"2:Sorcerer Feats","3:General Feats","3:Signature Spells",' +
      '"3:Skill Increases","5:Magical Fortitude","7:Expert Spellcaster",' +
      '"9:Lightning Reflexes",11:Alertness,"11:Sorcerer Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster",17:Resolve,"19:Bloodline Paragon",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '1:Aberrant:Bloodline,1:Angelic:Bloodline,1:Demonic:Bloodline,' +
      '1:Diabolic:Bloodline,1:Draconic:Bloodline,1:Elemental:Bloodline,' +
      '1:Fey:Bloodline,1:Hag:Bloodline,1:Imperial:Bloodline,' +
      '1:Undead:Bloodline ' +
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
      '"9:Magical Fortitude",11:Alertness,"11:Wizard Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster",17:Resolve,"19:Archwizard\'s Spellcraft",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '1:Abjuration:Specialization,' +
      '1:Conjuration:Specialization,' +
      '1:Divination:Specialization,' +
      '1:Enchantment:Specialization,' +
      '1:Evocation:Specialization,' +
      '1:Illusion:Specialization,' +
      '1:Necromancy:Specialization,' +
      '1:Transmutation:Specialization,' +
      '1:Universalist:Specialization,' +
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
    'Alignment=LN FollowerAlignments=LG,LN,LE ' +
    'Font=Harm,Heal Skill=Society Weapon=Crossbow ' +
    'Domain=Cities,Earth,Travel,Wealth ' +
    'Spells="1:Illusory Object",4:Creation,"7:Magnificent Mansion"',
  'Asmodeus':
    'Alignment=LE FollowerAlignments=LE ' +
    'Font=Harm Skill=Deception Weapon=Mace ' +
    'Domain=Confidence,Fire,Trickery,Tyranny ' +
    'Spells=1:Charm,4:Suggestion,6:Mislead',
  'Calistra':
    'Alignment=CN FollowerAlignments=CG,CN,CE ' +
    'Font=Harm,Heal Skill=Deception Weapon=Whip ' +
    'Domain=Pain,Passion,Secrecy,Trickery ' +
    'Spells=1:Charm,3:Enthrall,6:Mislead',
  'Cayden Cailean':
    'Alignment=CG FollowerAlignments=NG,CG,CN ' +
    'Font=Heal Skill=Athletics Weapon=Rapier ' +
    'Domain=Cities,Freedom,Indulgence,Might ' +
    'Spells="1:Fleet Step","2:Touch Of Idiocy",5:Hallucination',
  'Desna':
    'Alignment=CG FollowerAlignments=NG,CG,CN ' +
    'Font=Heal Skill=Acrobatics Weapon=Starknife ' +
    'Domain=Dreams,Luck,Moon,Travel ' +
    'Spells=1:Sleep,"3:Dream Message","6:Dreaming Potential"',
  'Erastil':
    'Alignment=LG FollowerAlignments=LG,NG,LN ' +
    'Font=Heal Skill=Survival Weapon=Longbow ' +
    'Domain=Earth,Family,Nature,Wealth ' +
    'Spells="1:True Strike","3:Wall Of Thorns","5:Tree Stride"',
  'Gorum':
    'Alignment=CN FollowerAlignments=CN,CE ' +
    'Font=Harm,Heal Skill=Athletics Weapon=Greatsword ' +
    'Domain=Confidence,Destruction,Might,Zeal ' +
    'Spells="1:True Strike",2:Enlarge,"4:Weapon Storm"',
  'Gozreh':
    'Alignment=N FollowerAlignments=NG,LN,N,CN,NE ' +
    'Font=Heal Skill=Survival Weapon=Trident ' +
    'Domain=Air,Nature,Travel,Water ' +
    'Spells="1:Gust Of Wind","3:Lightning Bolt","5:Control Water"',
  'Iomedae':
    'Alignment=LG FollowerAlignments=LG,NG ' +
    'Font=Heal Skill=Intimidation Weapon=Longsword ' +
    'Domain=Confidence,Might,Truth,Zeal ' +
    'Spells="1:True Strike","2:See Invisibility","5:Fire Shield"',
  'Irori':
    'Alignment=LN FollowerAlignments=LG,LN,LE ' +
    'Font=Harm,Heal Skill=Athletics Weapon=Fist ' +
    'Domain=Knowledge,Might,Perfection,Truth ' +
    'Spells=1:Jump,3:Haste,4:Stoneskin',
  'Lamashtu':
    'Alignment=CE FollowerAlignments=CE ' +
    'Font=Harm,Heal Skill=Survival Weapon=Falchion ' +
    'Domain=Family,Might,Nightmares,Trickery ' +
    'Spells="1:Magic Fang","2:Animal Form",4:Nightmare',
  'Nethys':
    'Alignment=N FollowerAlignments=NG,LN,N,CN,NE ' +
    'Font=Harm,Heal Skill=Arcana Weapon=Staff ' +
    'Domain=Destruction,Knowledge,Magic,Protection ' +
    'Spells=' +
      '"1:Magic Missile","2:Magic Mouth",3:Levitate,4:Blink,' +
      '"5:Prying Eye","6:Wall Of Force","7:Warp Mind",8:Maze,9:Destruction',
  'Norgorber':
    'Alignment=NE FollowerAlignments=LE,NE,CE ' +
    'Font=Harm Skill=Stealth Weapon=Shortsword ' +
    'Domain=Death,Secrecy,Trickery,Wealth ' +
    'Spells="1:Illusory Disguise",2:Invisibility,"4:Phantasmal Killer"',
  'Pharasma':
    'Alignment=N FollowerAlignments=NG,LN,N ' +
    'Font=Heal Skill=Medicine Weapon=Dagger ' +
    'Domain=Death,Fate,Healing,Knowledge ' +
    'Spells=1:Mindlink,"3:Ghostly Weapon","4:Phantasmal Killer"',
  'Rovagug':
    'Alignment=CE FollowerAlignments=NE,CE ' +
    'Font=Harm Skill=Athletics Weapon=Greataxe ' +
    'Domain=Air,Destruction,Earth,Zeal ' +
    'Spells="1:Burning Hands",2:Enlarge,6:Disintegrate',
  'Sarenrae':
    'Alignment=NG FollowerAlignments=LG,NG,CG ' +
    'Font=Heal Skill=Medicine Weapon=Scimitar ' +
    'Domain=Fire,Healing,Sun,Truth ' +
    'Spells="1:Burning Hands",3:Fireball,"4:Wall Of Fire"',
  'Shelyn':
    'Alignment=NG FollowerAlignments=LG,NG,CG ' +
    'Font=Heal Skill=Crafting,Performance Weapon=Glaive ' +
    'Domain=Creation,Family,Passion,Protection ' +
    'Spells="1:Color Spray",3:Enthrall,4:Creation',
  'Torag':
    'Alignment=LG FollowerAlignments=LG,LN ' +
    'Font=Heal Skill=Crafting Weapon=Warhammer ' +
    'Domain=Creation,Earth,Family,Protection ' +
    'Spells=1:Mindlink,3:Earthbind,4:Creation',
  'Urgathoa':
    'Alignment=NE FollowerAlignments=LE,NE,CE ' +
    'Font=Harm Skill=Intimidation Weapon=Scythe ' +
    'Domain=Indulgence,Magic,Might,Undeath ' +
    'Spells="1:Goblin Pox","2:False Life","7:Mask Of Terror"',
  'Zon-Kuthon':
    'Alignment=LE FollowerAlignments=LN,LE,NE ' +
    'Font=Harm Skill=Intimidation Weapon="Spiked Chain" ' +
    'Domain=Ambition,Darkness,Destruction,Pain ' +
    'Spells="1:Phantom Pain","3:Wall Of Thorns","5:Shadow Walk"',
};
Pathfinder2E.DOMAINS = {
  'Air':'Spell="Pushing Gust" AdvancedSpell="Disperse Into Air"',
  'Ambition':'Spell="Blind Ambition" AdvancedSpell="Competitive Edge"',
  'Cities':'Spell="Face In The Crowd" AdvancedSpell="Pulse Of The City"',
  'Confidence':'Spell="Veil Of Confidence" AdvancedSpell="Delusional Pride"',
  'Creation':'Spell="Splash Of Art" AdvancedSpell="Artistic Flourish"',
  'Darkness':'Spell="Cloak Of Shadow" AdvancedSpell="Darkened Eyes"',
  'Death':'Spell="Death\'s Call" AdvancedSpell="Eradicate Undeath"',
  'Destruction':'Spell="Cry Of Destruction" AdvancedSpell="Destructive Aura"',
  'Dreams':'Spell="Sweet Dream" AdvancedSpell="Dreamer\'s Call"',
  'Earth':'Spell="Hurtling Stone" AdvancedSpell="Localized Quake"',
  'Family':'Spell="Soothing Words" AdvancedSpell="Unity"',
  'Fate':'Spell="Read Fate" AdvancedSpell="Tempt Fate"',
  'Fire':'Spell="Fire Ray" AdvancedSpell="Flame Barrier"',
  'Freedom':'Spell="Unimpeded Stride" AdvancedSpell="Word Of Freedom"',
  'Healing':'Spell="Healer\'s Blessing" AdvancedSpell="Rebuke Death"',
  'Indulgence':'Spell="Overstuff" AdvancedSpell="Take Its Course"',
  'Knowledge':'Spell="Scholarly Recollection" AdvancedSpell="Know The Enemy"',
  'Luck':'Spell="Bit Of Luck" AdvancedSpell="Lucky Break"',
  'Magic':'Spell="Magic\'s Vessel" AdvancedSpell="Mystic Beacon"',
  'Might':'Spell="Athletic Rush" AdvancedSpell="Enduring Might"',
  'Moon':'Spell="Moonbeam" AdvancedSpell="Touch Of The Moon"',
  'Nature':'Spell="Vibrant Thorns" AdvancedSpell="Nature\'s Bounty"',
  'Nightmares':'Spell="Waking Nightmare" AdvancedSpell="Shared Nightmare"',
  'Pain':'Spell="Savor The Sting" AdvancedSpell="Retributive Pain"',
  'Passion':'Spell="Charming Touch" AdvancedSpell="Captivating Adoration"',
  'Perfection':'Spell="Perfected Mind" AdvancedSpell="Perfected Form"',
  'Protection':
    'Spell="Protector\'s Sacrifice" AdvancedSpell="Protector\'s Sphere"',
  'Secrecy':'Spell="Forced Quiet" AdvancedSpell="Safeguard Secret"',
  'Sun':'Spell="Dazzling Flash" AdvancedSpell="Positive Luminance"',
  'Travel':'Spell="Agile Feet" AdvancedSpell="Traveler\'s Transit"',
  'Trickery':'Spell="Sudden Shift" AdvancedSpell="Trickster\'s Twin"',
  'Truth':'Spell="Word Of Truth" AdvancedSpell="Glimpse The Truth"',
  'Tyranny':'Spell="Touch Of Obedience" AdvancedSpell="Commanding Lash"',
  'Undeath':'Spell="Touch Of Undeath" AdvancedSpell="Malignant Sustenance"',
  'Water':'Spell="Tidal Surge" AdvancedSpell="Downpour"',
  'Wealth':'Spell="Appearance Of Wealth" AdvancedSpell="Precious Metals"',
  'Zeal':'Spell="Weapon Surge" AdvancedSpell="Zeal For Battle"'
};
Pathfinder2E.FEATS = {

  // Ancestries
  'Dwarven Lore':'Trait=Ancestry,Dwarf',
  'Dwarven Weapon Familiarity':'Trait=Ancestry,Dwarf',
  'Rock Runner':'Trait=Ancestry,Dwarf',
  'Stonecunning':'Trait=Ancestry,Dwarf',
  'Unburdened Iron':'Trait=Ancestry,Dwarf',
  'Vengeful Hatred':'Trait=Ancestry,Dwarf',
  'Boulder Roll':
    'Trait=Ancestry,Dwarf Require="level >= 5","features.Rock Runner"',
  'Dwarven Weapon Cunning':
    'Trait=Ancestry,Dwarf ' +
    'Require="level >= 5","features.Dwarven Weapon Familiarity"',
  "Mountain's Stoutness":'Trait=Ancestry,Dwarf Require="level >= 9"',
  'Stonewalker':'Trait=Ancestry,Dwarf Require="level >= 9"',
  'Dwarven Weapon Expertise':
    'Trait=Ancestry,Dwarf ' +
    'Require="level >= 13","features.Dwarven Weapon Familiarity"',

  'Ancestral Longevity':'Trait=Ancestry,Elf',
  'Elven Lore':'Trait=Ancestry,Elf',
  'Elven Weapon Familiarity':'Trait=Ancestry,Elf',
  'Forlorn':'Trait=Ancestry,Elf',
  'Nimble Elf':'Trait=Ancestry,Elf',
  'Otherworldly Magic':'Trait=Ancestry,Elf',
  'Unwavering Mien':'Trait=Ancestry,Elf',
  'Ageless Patience':'Trait=Ancestry,Elf Require="level >= 5"',
  'Elven Weapon Elegance':
    'Trait=Ancestry,Elf ' +
    'Require="level >= 5","features.Elven Weapon Familiarity"',
  'Elf Step':'Trait=Ancestry,Elf Require="level >= 9"',
  'Expert Longevity':
    'Trait=Ancestry,Elf Require="level >= 9","features.Ancestral Longevity"',
  'Universal Longevity':
    'Trait=Ancestry,Elf Require="level >= 13","features.Expert Longevity"',
  'Elven Weapon Expertise':
    'Trait=Ancestry,Elf ' +
    'Require="level >= 13","features.Elven Weapon Familiarity"',

  'Animal Accomplice':'Trait=Ancestry,Gnome',
  'Burrow Elocutionist':'Trait=Ancestry,Gnome',
  'Fey Fellowship':'Trait=Ancestry,Gnome',
  'First World Magic':'Trait=Ancestry,Gnome',
  'Gnome Obsession':'Trait=Ancestry,Gnome',
  'Gnome Weapon Familiarity':'Trait=Ancestry,Gnome',
  'Illusion Sense':'Trait=Ancestry,Gnome',
  'Animal Elocutionist':
    'Trait=Ancestry,Gnome Require="level >= 5","features.Burrow Elocutionist"',
  // TODO requires "at least one innate spell from a gnome heritage or ancestry feat that shares a tradition with at least one of your focus spells"
  'Energized Font':
    'Trait=Ancestry,Gnome Require="level >= 5","focusPoints"',
  'Gnome Weapon Innovator':
    'Trait=Ancestry,Gnome ' +
    'Require="level >= 5","features.Gnome Weapon Familiarity"',
  // TODO requires "at least one primal innate spell"
  'First World Adept':'Trait=Ancestry,Gnome Require="level >= 9"',
  'Vivacious Conduit':'Trait=Ancestry,Gnome Require="level >= 9"',
  'Gnome Weapon Expertise':
    'Trait=Ancestry,Gnome ' +
    'Require="level >= 13","features.Gnome Weapon Familiarity"',

  'Burn It!':'Trait=Ancestry,Goblin',
  'City Scavenger':'Trait=Ancestry,Goblin',
  'Goblin Lore':'Trait=Ancestry,Goblin',
  'Goblin Scuttle':'Trait=Ancestry,Goblin',
  'Goblin Song':'Trait=Ancestry,Goblin',
  'Goblin Weapon Familiarity':'Trait=Ancestry,Goblin',
  'Junk Tinker':'Trait=Ancestry,Goblin',
  'Rough Rider':'Trait=Ancestry,Goblin',
  'Very Sneaky':'Trait=Ancestry,Goblin',
  'Goblin Weapon Frenzy':
    'Trait=Ancestry,Goblin ' +
    'Require="level >= 5","features.Goblin Weapon Familiarity"',
  'Cave Climber':'Trait=Ancestry,Goblin Require="level >= 9"',
  'Skittering Scuttle':
    'Trait=Ancestry,Goblin Require="level >= 9","features.Goblin Scuttle"',
  'Goblin Weapon Expertise':
    'Trait=Ancestry,Goblin ' +
    'Require="level >= 13","features.Goblin Weapon Familiarity"',
  'Very, Very Sneaky':
    'Trait=Ancestry,Goblin Require="level >= 13","features.Very Sneaky"',

  'Distracting Shadows':'Trait=Ancestry,Halfling',
  'Halfling Lore':'Trait=Ancestry,Halfling',
  'Halfling Luck':'Trait=Ancestry,Halfling,Fortune',
  'Halfling Weapon Familiarity':'Trait=Ancestry,Halfling',
  'Sure Feet':'Trait=Ancestry,Halfling',
  'Titan Slinger':'Trait=Ancestry,Halfling',
  'Unfettered Halfling':'Trait=Ancestry,Halfling',
  'Watchful Halfling':'Trait=Ancestry,Halfling',
  'Cultural Adaptability (%ancestry)':
    'Trait=Ancestry,Halfling Require="level >= 5"',
  'Halfling Weapon Trickster':
    'Trait=Ancestry,Halfling ' +
    'Require="level >= 5","features.Halfling Weapon Familiarity"',
  'Guiding Luck':
    'Trait=Ancestry,Halfling Require="level >= 9","features.Halfling Luck"',
  'Irrepressible':'Trait=Ancestry,Halfling Require="level >= 9"',
  'Ceaseless Shadows':
    'Trait=Ancestry,Halfling ' +
    'Require="level >= 13","features.Distracting Shadows"',
  'Halfling Weapon Expertise':
    'Trait=Ancestry,Halfling ' +
    'Require="level >= 13","features.Halfling Weapon Familiarity"',

  'Adapted Cantrip':
    'Trait=Ancestry,Human ' +
    'Require="features.Arcane Spellcasting || features.Divine Spellcasting || features.Occult Spellcasting || features.Primal Spellcasting || features.Sorcerer Spellcasting"',
  'Cooperative Nature':'Trait=Ancestry,Human',
  'General Training':'Trait=Ancestry,Human',
  'Haughty Obstinacy':'Trait=Ancestry,Human',
  'Natural Ambition':'Trait=Ancestry,Human',
  'Natural Skill':'Trait=Ancestry,Human',
  'Unconventional Weaponry (%weapon)':'Trait=Ancestry,Human',
  'Adaptive Adept':
    'Trait=Ancestry,Human ' +
    'Require=' +
      '"level >= 5",' +
      '"features.Adapted Cantrip",' +
      '"spellSlots.A3 || spellSlots.D3 || spellSlots.O3 || spellSlots.P3"',
  'Clever Improviser':'Trait=Ancestry,Human Require="level >= 5"',
  'Cooperative Soul':
    'Trait=Ancestry,Human Require="level >= 9","features.Cooperative Nature"',
  'Incredible Improvisation':
    'Trait=Ancestry,Human Require="level >= 9","features.Clever Improviser"',
  'Multitalented':'Trait=Ancestry,Human Require="level >= 9"',
  'Unconventional Expertise':
    'Trait=Ancestry,Human ' +
    'Require=' +
      '"level >= 13",' +
      '"features.Unconventional Weaponry",' +
      '"unconventionalWeaponRank >= 2"',
  'Elf Atavism':'Trait=Ancestry,Half-Elf',
  'Inspire Imitation':'Trait=Ancestry,Half-Elf Require="level >= 5"',
  'Supernatural Charm':'Trait=Ancestry,Half-Elf Require="level >= 5"',
  'Monstrous Peacemaker':'Trait=Ancestry,Half-Orc',
  'Orc Ferocity':'Trait=Ancestry,Orc',
  'Orc Sight':'Trait=Ancestry,Half-Orc Require="features.Low-Light Vision"',
  'Orc Superstition':'Trait=Ancestry,Orc,Concentrate',
  'Orc Weapon Familiarity':'Trait=Ancestry,Orc',
  'Orc Weapon Carnage':
    'Trait=Ancestry,Orc Require="level >= 5","features.Orc Weapon Familiarity"',
  'Victorious Vigor':'Trait=Ancestry,Orc Require="level >= 5"',
  'Pervasive Superstition':
    'Trait=Ancestry,Orc Require="level >= 9","features.Orc Superstition"',
  'Incredible Ferocity':
    'Trait=Ancestry,Orc Require="level >= 13","features.Orc Ferocity"',
  'Orc Weapon Expertise':
    'Trait=Ancestry,Half-Orc ' +
    'Require="level >= 13","features.Orc Weapon Familiarity"',

  // TODO: add class or dedication to class feat requirements?
  // Class
  'Alchemical Familiar':'Trait=Class,Alchemist',
  'Alchemical Savant':
    'Trait=Class,Alchemist Require="rank.Crafting >= 1"',
  'Far Lobber':'Trait=Class,Alchemist',
  'Quick Bomber':'Trait=Class,Alchemist',
  'Poison Resistance':'Trait=Class,Alchemist,Druid Require="level >= 2"',
  'Revivifying Mutagen':'Trait=Class,Alchemist Require="level >= 2"',
  'Smoke Bomb':'Trait=Class,Alchemist,Additive1 Require="level >= 2"',
  'Calculated Splash':'Trait=Class,Alchemist Require="level >= 4"',
  'Efficient Alchemy':'Trait=Class,Alchemist Require="level >= 4"',
  'Enduring Alchemy':'Trait=Class,Alchemist Require="level >= 4"',
  'Combine Elixirs':'Trait=Class,Alchemist,Additive2 Require="level >= 6"',
  'Debilitating Bomb':'Trait=Class,Alchemist,Additive2 Require="level >= 6"',
  'Directional Bombs':'Trait=Class,Alchemist Require="level >= 6"',
  'Feral Mutagen':'Trait=Class,Alchemist Require="level >= 8"',
  'Sticky Bomb':'Trait=Class,Alchemist,Additive2 Require="level >= 8"',
  'Elastic Mutagen':'Trait=Class,Alchemist Require="level >= 10"',
  'Expanded Splash':
    'Trait=Class,Alchemist Require="level >= 10","features.Calculated Splash"',
  'Greater Debilitating Bomb':
    'Trait=Class,Alchemist Require="level >= 10","features.Debilitating Bomb"',
  'Merciful Elixir':'Trait=Class,Alchemist,Additive2 Require="level >= 10"',
  'Potent Poisoner':
    'Trait=Class,Alchemist Require="level >= 10","features.Powerful Alchemy"',
  'Extend Elixir':'Trait=Class,Alchemist Require="level >= 12"',
  'Invincible Mutagen':'Trait=Class,Alchemist Require="level >= 12"',
  'Uncanny Bombs':
    'Trait=Class,Alchemist Require="level >= 12","features.Far Lobber"',
  'Glib Mutagen':'Trait=Class,Alchemist Require="level >= 14"',
  'Greater Merciful Elixir':
    'Trait=Class,Alchemist Require="level >= 14","features.Merciful Elixir"',
  'True Debilitating Bomb':
    'Trait=Class,Alchemist ' +
    'Require="level >= 14","features.Greater Debilitating Bomb"',
  'Eternal Elixir':
    'Trait=Class,Alchemist Require="level >= 16","features.Extend Elixir"',
  'Exploitive Bomb':'Trait=Class,Alchemist,Additive2 Require="level >= 16"',
  'Genius Mutagen':'Trait=Class,Alchemist Require="level >= 16"',
  'Persistent Mutagen':
    'Trait=Class,Alchemist Require="level >= 16","features.Extend Elixir"',
  'Improbable Elixirs':'Trait=Class,Alchemist Require="level >= 18"',
  'Mindblank Mutagen':'Trait=Class,Alchemist Require="level >= 18"',
  'Miracle Worker':'Trait=Class,Alchemist Require="level >= 18"',
  'Perfect Debilitation':'Trait=Class,Alchemist Require="level >= 18"',
  "Craft Philosopher's Stone":'Trait=Class,Alchemist Require="level >= 20"',
  'Mega Bomb':
    'Trait=Class,Alchemist,Additive3 ' +
    'Require="level >= 20","features.Expanded Splash"',
  'Perfect Mutagen':'Trait=Class,Alchemist Require="level >= 20"',

  'Acute Vision':'Trait=Class,Barbarian',
  'Moment Of Clarity':'Trait=Class,Barbarian,Concentrate,Rage',
  'Raging Intimidation':'Trait=Class,Barbarian',
  'Raging Thrower':'Trait=Class,Barbarian',
  'Sudden Charge':'Trait=Class,Barbarian,Fighter,Flourish,Open',
  'Acute Scent':
    'Trait=Class,Barbarian ' +
    'Require="level >= 2","features.Acute Vision||features.Darkvision"',
  'Furious Finish':'Trait=Class,Barbarian,Rage Require="level >= 2"',
  'No Escape':'Trait=Class,Barbarian,Rage Require="level >= 2"',
  'Second Wind':'Trait=Class,Barbarian Require="level >= 2"',
  'Shake It Off':'Trait=Class,Barbarian,Concentrate,Rage Require="level >= 2"',
  'Fast Movement':'Trait=Class,Barbarian Require="level >= 4"',
  'Raging Athlete':
    'Trait=Class,Barbarian Require="level >= 4","rank.Athletics >= 2"',
  'Swipe':'Trait=Class,Barbarian,Fighter,Flourish Require="level >= 4"',
  'Wounded Rage':'Trait=Class,Barbarian Require="level >= 4"',
  'Animal Skin':
    'Trait=Class,Barbarian,Morph,Primal,Transmutation ' +
    'Require="level >= 6","features.Animal Instinct"',
  'Attack Of Opportunity':'Trait=Class,Barbarian,Champion Require="level >= 6"',
  'Brutal Bully':
    'Trait=Class,Barbarian Require="level >= 6","rank.Athletics >= 2"',
  'Cleave':'Trait=Class,Barbarian,Rage Require="level >= 6"',
  "Dragon's Rage Breath":
    'Trait=Class,Barbarian,Arcane,Concentrate,Evocation,Rage ' +
    'Require="level >= 6","features.Dragon Instinct"',
  "Giant's Stature":
    'Trait=Class,Barbarian,Polymorph,Primal,Rage,Transmutation ' +
    'Require="level >= 6","features.Giant Instinct"',
  "Spirits' Interference":
    'Trait=Class,Barbarian,Divine,Necromancy,Rage ' +
    'Require="level >= 6","features.Spirit Instinct"',
  'Animal Rage':
    'Trait=Class,Barbarian,Concentrate,Polymorph,Primal,Rage,Transmutation ' +
    'Require="level >= 8","features.Animal Instinct"',
  'Furious Bully':
    'Trait=Class,Barbarian Require="level >= 8","rank.Athletics >=3 "',
  'Renewed Vigor':'Trait=Class,Barbarian,Concentrate,Rage Require="level >= 8"',
  'Share Rage':
    'Trait=Class,Barbarian,Auditory,Rage,Visual Require="level >= 8"',
  'Sudden Leap':'Trait=Class,Barbarian,Fighter Require="level >= 8"',
  'Thrash':'Trait=Class,Barbarian,Rage Require="level >= 8"',
  'Come And Get Me':
    'Trait=Class,Barbarian,Concentrate,Rage Require="level >= 10"',
  'Furious Sprint':'Trait=Class,Barbarian,Rage Require="level >= 10"',
  'Great Cleave':
    'Trait=Class,Barbarian,Rage Require="level >= 10",features.Cleave',
  'Knockback':'Trait=Class,Barbarian,Rage Require="level >= 10"',
  'Terrifying Howl':
    'Trait=Class,Barbarian,Auditory,Rage ' +
    'Require="level >= 10","features.Intimidating Glare"',
  "Dragon's Rage Wings":
    'Trait=Class,Barbarian,Morph,Primal,Rage,Transmutation ' +
    'Require="level >= 12","features.Dragon Instinct"',
  'Furious Grab':'Trait=Class,Barbarian,Rage Require="level >= 12"',
  "Predator's Pounce":
    'Trait=Class,Barbarian,Flourish,Open,Rage ' +
    'Require="level >= 12","features.Animal Instinct"',
  "Spirit's Wrath":
    'Trait=Class,Barbarian,Attack,Concentrate,Rage ' +
    'Require="level >= 12","features.Spirit Instinct"',
  "Titan's Stature":
    'Trait=Class,Barbarian,Polymorph,Transmutation ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Giant Instinct",' +
      '"features.Giant\'s Stature"',
  'Awesome Blow':
    'Trait=Class,Barbarian,Rage Require="level >= 14","features.Knockback"',
  "Giant's Lunge":
    'Trait=Class,Barbarian,Rage ' +
    'Require="level >= 14","features.Giant Instinct"',
  'Vengeful Strike':
    'Trait=Class,Barbarian,Rage ' +
    'Require="level >= 14","features.Vengeful Strike"',
  'Whirlwind Strike':
    'Trait=Class,Barbarian,Fighter,Flourish,Open Require="level >= 14"',
  'Collateral Thrash':
    'Trait=Class,Barbarian,Rage Require="level >= 16","features.Thrash"',
  'Dragon Transformation':
    'Trait=Class,Barbarian,Concentrate,Polymorph,Primal,Rage,Transmutation ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Dragon Instinct",' +
     '"features.Dragon\'s Rage Wings"',
  'Reckless Abandon':'Trait=Class,Barbarian,Rage Require="level >= 16"',
  'Brutal Critical':'Trait=Class,Barbarian Require="level >= 18"',
  'Perfect Clarity':
    'Trait=Class,Barbarian,Concentrate,Fortune,Rage Require="level >= 18"',
  'Vicious Evisceration':'Trait=Class,Barbarian,Rage Require="level >= 18"',
  'Contagious Rage':
    'Trait=Class,Barbarian,Auditory,Rage,Visual ' +
    'Require="level >= 20","features.Share Rage"',
  'Quaking Stomp':'Trait=Class,Barbarian,Manipulate,Rage Require="level >= 20"',

  'Bardic Lore':'Trait=Class,Bard Require="features.Enigma"',
  'Lingering Composition':'Trait=Class,Bard Require="features.Maestro"',
  'Reach Spell':
    'Trait=Class,Bard,Cleric,Druid,Sorcerer,Wizard,Concentrate,Metamagic',
  'Versatile Performance':'Trait=Class,Bard Require="features.Polymath"',
  'Cantrip Expansion':
    'Trait=Class,Bard,Cleric,Sorcerer,Wizard Require="level >= 2"',
  'Esoteric Polymath':
    'Trait=Class,Bard Require="level >= 2","features.Polymath"',
  'Inspire Competence':
    'Trait=Class,Bard Require="level >= 2","features.Maestro"',
  "Loremaster's Etude":
    'Trait=Class,Bard,Fortune Require="level >= 2","features.Enigma"',
  'Multifarious Muse (Enigma)':
    'Trait=Class,Bard Require="level >= 2","bardFeatures.Enigma == 0"',
  'Multifarious Muse (Maestro)':
    'Trait=Class,Bard Require="level >= 2","bardFeatures.Maestro == 0"',
  'Multifarious Muse (Polymath)':
    'Trait=Class,Bard Require="level >= 2","bardFeatures.Polymath == 0"',
  'Inspire Defense':
    'Trait=Class,Bard Require="level >= 4","features.Maestro"',
  'Melodious Spell':
    'Trait=Class,Bard,Concentrate,Manipulate,Metamagic Require="level >= 4"',
  'Triple Time':'Trait=Class,Bard Require="level >= 4"',
  'Versatile Signature':
    'Trait=Class,Bard Require="level >= 4","features.Polymath"',
  'Dirge Of Doom':'Trait=Class,Bard Require="level >= 6"',
  'Harmonize':
    'Trait=Class,Bard,Concentrate,Manipulate,Metamagic ' +
    'Require="level >= 6","features.Maestro"',
  'Steady Spellcasting':
    'Trait=Class,Bard,Cleric,Druid,Sorcerer,Wizard Require="level >= 6"',
  'Eclectic Skill':
    'Trait=Class,Bard ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Polymath",' +
      '"rank.Occultism >= 3"',
  'Inspire Heroics':
    'Trait=Class,Bard Require="level >= 8","features.Maestro"',
  'Know-It-All':
    'Trait=Class,Bard Require="level >= 8","features.Enigma"',
  'House Of Imaginary Walls':'Trait=Class,Bard Require="level >= 10"',
  'Quickened Casting':
    'Trait=Class,Bard,Sorcerer,Wizard,Concentrate,Metamagic ' +
    'Require="level >= 10"',
  'Unusual Composition':
    'Trait=Class,Bard,Concentrate,Manipulate,Metamagic ' +
    'Require="level >= 10","features.Polymath"',
  'Eclectic Polymath':
    'Trait=Class,Bard Require="level >= 12","features.Esoteric Polymath"',
  'Inspirational Focus':'Trait=Class,Bard Require="level >= 12"',
  'Allegro':'Trait=Class,Bard Require="level >= 14"',
  'Soothing Ballad':'Trait=Class,Bard Require="level >= 14"',
  'True Hypercognition':
    'Trait=Class,Bard Require="level >= 14","features.Enigma"',
  'Effortless Concentration':
    'Trait=Class,Bard,Druid,Sorcerer,Wizard Require="level >= 16"',
  'Studious Capacity':
    'Trait=Class,Bard ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Enigma",' +
      '"rank.Occultism >= 4"',
  'Deep Lore':'Trait=Class,Bard Require="level >= 18"',
  'Eternal Composition':
    'Trait=Class,Bard Require="level >= 18","features.Maestro"',
  'Impossible Polymath':
    'Trait=Class,Bard ' +
    'Require=' +
      '"level >= 18",' +
      '"rank.Arcana >= 1 || rank.Nature >= 1 || rank.Religion >= 1",' +
      '"features.Esoteric Polymath"',
  'Fatal Aria':'Trait=Class,Bard Require="level >= 20"',
  'Perfect Encore':
    'Trait=Class,Bard Require="level >= 20","features.Magnum Opus"',
  'Symphony Of The Muse':
    'Trait=Class,Bard Require="level >= 20","features.Harmonize"',

  "Deity's Domain (%domain)":
    'Trait=Class,Champion Require="deityDomains =~ \'%domain\'"',
  'Ranged Reprisal':'Trait=Class,Champion Require="features.Paladin"',
  'Unimpeded Step':'Trait=Class,Champion Require="features.Liberator"',
  'Weight Of Guilt':'Trait=Class,Champion Require="features.Redeemer"',
  'Divine Grace':'Trait=Class,Champion Require="level >= 2"',
  'Dragonslayer Oath':
    'Trait=Class,Champion,Oath ' +
    'Require="level >= 2","features.The Tenets Of Good"',
  'Fiendsbane Oath':
    'Trait=Class,Champion,Oath ' +
    'Require="level >= 2","features.The Tenets Of Good"',
  'Shining Oath':
    'Trait=Class,Champion,Oath ' +
    'Require="level >= 2","features.The Tenets Of Good"',
  'Vengeful Oath':
    'Trait=Class,Champion,Oath ' +
    'Require="level >= 2","features.Paladin"',
  'Aura Of Courage':
    'Trait=Class,Champion Require="level >= 4","features.The Tenets Of Good"',
  'Divine Health':
    'Trait=Class,Champion Require="level >= 4","features.The Tenets Of Good"',
  'Mercy':
    'Trait=Class,Champion,Concentrate,Metamagic ' +
    'Require="level >= 4","spells.Lay On Hands (D1 Nec)"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 6","features.Devotion Spells","features.The Tenets Of Good"',
  'Loyal Warhorse':
    'Trait=Class,Champion Require="level >= 6","features.Divine Ally (Steed)"',
  'Shield Warden':
    'Trait=Class,Champion,Fighter ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Shield && features.The Tenets Of Good || features.Shield Block"',
  'Smite Evil':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Blade)",' +
      '"features.The Tenets Of Good"',
  "Advanced Deity's Domain (%domain)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (%domain)"',
  'Greater Mercy':'Trait=Class,Champion Require="level >= 8","features.Mercy"',
  'Heal Mount':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Divine Ally (Steed)",' +
      '"spells.Lay On Hands (D1 Nec)"',
  'Quick Shield Block':
    'Trait=Class,Champion,Fighter ' +
    'Require="level >= 8","features.Shield Block"',
  'Second Ally':
    'Trait=Class,Champion Require="level >= 8","features.Divine Ally"',
  'Sense Evil':
    'Trait=Class,Champion Require="level >= 8","features.The Tenets Of Good"',
  'Devoted Focus':
    'Trait=Class,Champion Require="level >= 10","features.Devotion Spells"',
  'Imposing Destrier':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Divine Ally (Steed)",' +
      '"features.Loyal Warhorse"',
  'Litany Against Sloth':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Devotion Spells",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Spirit':
    'Trait=Class,Champion Require="level >= 10","features.Divine Ally (Blade)"',
  'Shield Of Reckoning':
    'Trait=Class,Champion,Flourish ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Champion\'s Reaction",' +
      '"features.Shield Warden"',
  'Affliction Mercy':
    'Trait=Class,Champion Require="level >= 12","features.Mercy"',
  'Aura Of Faith':
    'Trait=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  'Blade Of Justice':
    'Trait=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  "Champion's Sacrifice":
    'Trait=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  'Divine Wall':'Trait=Class,Champion Require="level >= 12"',
  'Lasting Doubt':
    'Trait=Class,Champion Require="level >= 12","features.Redeemer"',
  'Liberating Stride':
    'Trait=Class,Champion Require="level >= 12","features.Liberator"',
  'Anchoring Aura':
    'Trait=Class,Champion Require="level >= 14","features.Fiendsbane Oath"',
  'Aura Of Life':
    'Trait=Class,Champion Require="level >= 14","features.Shining Oath"',
  'Aura Of Righteousness':
    'Trait=Class,Champion Require="level >= 14","features.The Tenets Of Good"',
  // NOTE: Exalt requirement redundant? All Champions get it at level 11
  'Aura Of Vengeance':
    'Trait=Class,Champion ' +
    'Require="level >= 14","features.Vengeful Oath"',
  'Divine Reflexes':'Trait=Class,Champion Require="level >= 14"',
  'Litany Of Righteousness':
    'Trait=Class,Champion Require="level >= 14","features.The Tenets Of Good"',
  'Wyrmbane Aura':
    'Trait=Class,Champion Require="level >= 14","features.Dragonslayer Oath"',
  'Auspicious Mount':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Ally (Steed)",' +
      '"features.Imposing Destrier"',
  'Instrument Of Zeal':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Ally (Blade)",' +
      '"features.The Tenets Of Good"',
  'Shield Of Grace':
    'Trait=Class,Champion Require="level >= 16","features.Shield Warden"',
  'Celestial Form':
    'Trait=Class,Champion Require="level >= 18","features.The Tenets Of Good"',
  'Ultimate Mercy':
    'Trait=Class,Champion Require="level >= 18","features.Mercy"',
  'Celestial Mount':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Steed)",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Master':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Blade)",' +
      '"features.Radiant Blade Spirit"',
  'Shield Paragon':
    'Trait=Class,Champion Require="level >= 20","features.Divine Ally (Shield)"',

  'Deadly Simplicity':
    'Trait=Class,Cleric Require="deityWeaponCategory =~ \'Simple|Unarmed\'"',
  'Domain Initiate (%domain)':
    'Trait=Class,Cleric Require="deityDomains =~ \'%domain\'"',
  'Harming Hands':'Trait=Class,Cleric Require="features.Harmful Font"',
  'Healing Hands':'Trait=Class,Cleric Require="features.Healing Font"',
  'Holy Castigation':'Trait=Class,Cleric Require="alignment =~ \'Good\'"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':'Trait=Class,Cleric,Healing,Positive Require="level >= 2"',
  'Emblazon Armament':'Trait=Class,Cleric,Exploration Require="level >= 2"',
  'Sap Life':'Trait=Class,Cleric,Healing Require="level >= 2"',
  'Turn Undead':'Trait=Class,Cleric Require="level >= 2"',
  'Versatile Font':
    'Trait=Class,Cleric ' +
    'Require=' +
      '"level >= 2",' +
      '"deityFonts =~ \'Harm/Heal|Heal/Harm\'",' +
      '"features.Harmful Font || features.Healing Font"',
  'Channel Smite':
    'Trait=Class,Cleric,Divine,Necromancy ' +
    'Require="level >= 4","features.Harmful Font || features.Healing Font"',
  'Command Undead':
    'Trait=Class,Cleric,Concentrate,Metamagic ' +
    'Require="level >= 4","features.Harmful Font","alignment =~ \'Evil\'"',
  'Directed Channel':'Trait=Class,Cleric Require="level >= 4"',
  'Improved Communal Healing':
    'Trait=Class,Cleric Require="level >= 4","features.Communal Healing"',
  'Necrotic Infusion':
    'Trait=Class,Cleric,Concentrate,Metamagic ' +
    'Require="level >= 4","features.Harmful Font","alignment =~ \'Evil\'"',
  'Cast Down':
    'Trait=Class,Cleric,Concentrate,Metamagic ' +
    'Require="level >= 6","features.Harmful Font || features.Healing Font"',
  'Divine Weapon':'Trait=Class,Cleric Require="level >= 6"',
  'Selective Energy':'Trait=Class,Cleric Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced Domain (%domain)':
    'Trait=Class,Cleric ' +
    'Require="level >= 8","features.Domain Initiate (%domain)"',
  'Align Armament (Chaotic)':
    'Trait=Class,Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'C\'"',
  'Align Armament (Evil)':
    'Trait=Class,Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'E\'"',
  'Align Armament (Good)':
    'Trait=Class,Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'G\'"',
  'Align Armament (Lawful)':
    'Trait=Class,Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'L\'"',
  'Channeled Succor':
    'Trait=Class,Cleric Require="level >= 8","features.Healing Font"',
  'Cremate Undead':'Trait=Class,Cleric Require="level >= 8"',
  'Emblazon Energy':
    'Trait=Class,Cleric Require="level >= 8","features.Emblazon Armament"',
  'Castigating Weapon':
    'Trait=Class,Cleric Require="level >= 10","features.Holy Castigation"',
  'Heroic Recovery':
    'Trait=Class,Cleric,Concentrate,Metamagic ' +
    'Require="level >= 10","features.Healing Font","alignment =~ \'Good\'"',
  'Improved Command Undead':
    'Trait=Class,Cleric ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Harmful Font",' +
      '"features.Command Undead",' +
      '"alignment =~ \'Evil\'"',
  'Replenishment Of War':
    'Trait=Class,Cleric Require="level >= 10","deityWeaponRank >= 1"',
  'Defensive Recovery':
    'Trait=Class,Cleric,Concentrate,Metamagic ' +
    'Require="level >= 12","features.Harmful Font || features.Healing Font"',
  'Domain Focus':
    'Trait=Class,Cleric Require="level >= 12",domain',
  'Emblazon Antimagic':
    'Trait=Class,Cleric Require="level >= 12","features.Emblazon Armament"',
  'Shared Replenishment':
    'Trait=Class,Cleric Require="level >= 12","features.Replenishment Of War"',
  "Deity's Protection":
    'Trait=Class,Cleric Require="level >= 14","features.Advanced Domain"',
  'Extend Armament Alignment':
    'Trait=Class,Cleric Require="level >= 14","features.Align Armament"',
  'Fast Channel':
    'Trait=Class,Cleric ' +
    'Require="level >= 14","features.Harmful Font || features.Healing Font"',
  'Swift Banishment':'Trait=Class,Cleric Require="level >= 14"',
  'Eternal Bane':
    'Trait=Class,Cleric Require="level >= 16","alignment =~ \'Evil\'"',
  'Eternal Blessing':
    'Trait=Class,Cleric Require="level >= 16","alignment =~ \'Good\'"',
  'Resurrectionist':'Trait=Class,Cleric Require="level >= 16"',
  'Domain Wellspring':
    'Trait=Class,Cleric Require="level >= 18","features.Domain Focus"',
  'Echoing Channel':
    'Trait=Class,Cleric,Concentrate,Metamagic Require="level >= 18"',
  'Improved Swift Banishment':
    'Trait=Class,Cleric Require="level >= 18","features.Swift Banishment"',
  "Avatar's Audience":'Trait=Class,Cleric Require="level >= 20"',
  'Maker Of Miracles':
    'Trait=Class,Cleric Require="level >= 20","features.Miraculous Spell"',
  'Metamagic Channel':'Trait=Class,Cleric,Concentrate Require="level >= 20"',

  'Animal Companion':
    'Trait=Class,Druid,Ranger ' +
    'Require="features.Animal || features.Order Explorer (Animal) || levels.Ranger"',
  'Leshy Familiar':
    'Trait=Class,Druid ' +
    'Require="features.Leaf || features.Order Explorer (Leaf)"',
  // Reach Spell as above
  'Storm Born':
    'Trait=Class,Druid ' +
    'Require="features.Storm || features.Order Explorer (Storm)"',
  'Widen Spell':'Trait=Class,Druid,Sorcerer,Wizard,Manipulate,Metamagic',
  'Wild Shape':
    'Trait=Class,Druid ' +
    'Require="features.Wild || features.Order Explorer (Wild)"',
  'Call Of The Wild':'Trait=Class,Druid Require="level >= 2"',
  'Enhanced Familiar':
    'Trait=Class,Druid,Sorcerer,Wizard ' +
    'Require="level >= 2","features.Familiar || features.Leshy Familiar"',
  'Order Explorer (Animal)':
    'Trait=Class,Druid Require="level >= 2","features.Animal == 0"',
  'Order Explorer (Leaf)':
    'Trait=Class,Druid Require="level >= 2","features.Leaf == 0"',
  'Order Explorer (Storm)':
    'Trait=Class,Druid Require="level >= 2","features.Storm == 0"',
  'Order Explorer (Wild)':
    'Trait=Class,Druid Require="level >= 2","features.Wild == 0"',
  // Poison Resistance as above
  'Form Control':
    'Trait=Class,Druid,Manipulate,Metamagic ' +
    'Require="level >= 4","strength >= 14","features.Wild Shape"',
  'Mature Animal Companion':
    'Trait=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 4 || levels.Ranger >= 6",' +
      '"features.Animal Companion"',
  'Order Magic (Animal)':
    'Trait=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Animal)"',
  'Order Magic (Leaf)':
    'Trait=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Leaf)"',
  'Order Magic (Storm)':
    'Trait=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Storm)"',
  'Order Magic (Wild)':
    'Trait=Class,Druid ' +
    'Require="level >= 4","features.Order Explorer (Wild)"',
  'Thousand Faces':
    'Trait=Class,Druid Require="level >= 4","features.Wild Shape"',
  'Woodland Stride':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Green Empathy':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Insect Shape':
    'Trait=Class,Druid Require="level >= 6","features.Wild Shape"',
  // Steady Spellcasting as above
  'Storm Retribution':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Storm || features.Order Explorer (Storm)",' +
      '"spells.Tempest Surge (P1 Evo)"',
  'Ferocious Shape':
    'Trait=Class,Druid Require="level >= 8","features.Wild Shape"',
  'Fey Caller':'Trait=Class,Druid Require="level >= 8"',
  'Incredible Companion':
    'Trait=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 8 || levels.Ranger >= 10",' +
      '"features.Mature Animal Companion"',
  'Soaring Shape':
    'Trait=Class,Druid Require="level >= 8","features.Wild Shape"',
  'Wind Caller':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Storm || features.Order Explorer (Storm)"',
  'Elemental Shape':
    'Trait=Class,Druid Require="level >= 10","features.Wild Shape"',
  'Healing Transformation':'Trait=Class,Druid,Metamagic Require="level >= 10"',
  'Overwhelming Energy':
    'Trait=Class,Druid,Sorcerer,Wizard,Manipulate,Metamagic ' +
    'Require="level >= 10"',
  'Plant Shape':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Leaf || features.Order Explorer (Leaf) || features.Wild Shape"',
  'Side By Side':
    'Trait=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 10 || levels.Ranger >= 12",' +
      '"features.Animal Companion"',
  'Dragon Shape':
    'Trait=Class,Druid Require="level >= 12","features.Soaring Shape"',
  'Green Tongue':
    'Trait=Class,Druid Require="level >= 12","features.Green Empathy"',
  'Primal Focus':'Trait=Class,Druid Require="level >= 12"',
  'Primal Summons':
    'Trait=Class,Druid Require="level >= 12","features.Call Of The Wild"',
  'Specialized Companion':
    'Trait=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 14 || levels.Ranger >= 16",' +
      '"features.Incredible Companion"',
  'Timeless Nature':'Trait=Class,Druid Require="level >= 14"',
  'Verdant Metamorphosis':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  // Effortless Concentration as above
  'Impaling Briars':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Monstrosity Shape':
    'Trait=Class,Druid Require="level >= 16","features.Wild Shape"',
  'Invoke Disaster':
    'Trait=Class,Druid Require="level >= 18","features.Wind Caller"',
  'Perfect Form Control':
    'Trait=Class,Druid ' +
    'Require="level >= 18","features.Form Control","strength >= 18"',
  'Primal Wellspring':
    'Trait=Class,Druid Require="level >= 18","features.Primal Focus"',
  "Hierophant's Power":'Trait=Class,Druid Require="level >= 20"',
  'Leyline Conduit':
    'Trait=Class,Druid,Concentrate,Manipulate,Metamagic Require="level >= 20"',
  'True Shapeshifter':
    'Trait=Class,Druid,Concentrate ' +
    'Require="level >= 20","features.Dragon Shape","features.Wild Shape"',

  'Double Slice':'Trait=Class,Fighter',
  'Exacting Strike':'Trait=Class,Fighter,Press',
  'Point-Blank Shot':'Trait=Class,Fighter,Open,Stance',
  'Power Attack':'Trait=Class,Fighter,Flourish',
  'Reactive Shield':'Trait=Class,Fighter',
  'Snagging Strike':'Trait=Class,Fighter',
  // Sudden Charge as above
  'Aggressive Block':'Trait=Class,Fighter Require="level >= 2"',
  'Assisting Shot':'Trait=Class,Fighter,Press Require="level >= 2"',
  'Brutish Shove':'Trait=Class,Fighter,Press Require="level >= 2"',
  'Combat Grab':'Trait=Class,Fighter,Press Require="level >= 2"',
  'Dueling Parry':'Trait=Class,Fighter Require="level >= 2"',
  'Intimidating Strike':
    'Trait=Class,Fighter,Emotion,Fear,Mental Require="level >= 2"',
  'Lunge':'Trait=Class,Fighter Require="level >= 2"',
  'Double Shot':'Trait=Class,Fighter,Flourish Require="level >= 4"',
  'Dual-Handed Assault':'Trait=Class,Fighter,Flourish Require="level >= 4"',
  'Knockdown':
    'Trait=Class,Fighter,Flourish Require="level >= 4","rank.Athletics >= 1"',
  'Powerful Shove':
    'Trait=Class,Fighter ' +
    'Require="level >= 4","features.Aggressive Block||features.Brutish Shove"',
  'Quick Reversal':'Trait=Class,Fighter,Flourish,Press Require="level >= 4"',
  'Shielded Stride':'Trait=Class,Fighter Require="level >= 4"',
  // Swipe as above
  'Twin Parry':'Trait=Class,Fighter,Ranger Require="level >= 4"',
  'Advanced Weapon Training':'Trait=Class,Fighter Require="level >= 6"',
  'Advantageous Assault':'Trait=Class,Fighter,Press Require="level >= 6"',
  'Disarming Stance':
    'Trait=Class,Fighter,Stance Require="level >= 6","rank.Athletics >= 1"',
  'Furious Focus':
    'Trait=Class,Fighter Require="level >= 6","features.Power Attack"',
  "Guardian's Deflection":'Trait=Class,Fighter Require="level >= 6"',
  'Reflexive Shield':'Trait=Class,Fighter Require="level >= 6"',
  'Revealing Stab':'Trait=Class,Fighter Require="level >= 6"',
  'Shatter Defenses':'Trait=Class,Fighter,Press Require="level >= 6"',
  'Triple Shot':
    'Trait=Class,Fighter Require="level >= 6","features.Double Shot"',
  'Blind-Fight':
    'Trait=Class,Fighter,Ranger,Rogue ' +
    'Require="level >= 8","rank.Perception >= 3"',
  'Dueling Riposte':
    'Trait=Class,Fighter Require="level >= 8","features.Dueling Parry"',
  'Felling Strike':'Trait=Class,Fighter Require="level >= 8"',
  'Incredible Aim':'Trait=Class,Fighter,Concentrate Require="level >= 8"',
  'Mobile Shot Stance':'Trait=Class,Fighter,Stance Require="level >= 8"',
  'Positioning Assault':'Trait=Class,Fighter,Flourish Require="level >= 8"',
  'Agile Grace':'Trait=Class,Fighter Require="level >= 10"',
  'Certain Strike':'Trait=Class,Fighter,Press Require="level >= 10"',
  'Combat Reflexes':'Trait=Class,Fighter Require="level >= 10"',
  'Debilitating Shot':'Trait=Class,Fighter,Flourish Require="level >= 10"',
  'Disarming Twist':
    'Trait=Class,Fighter,Press Require="level >= 10","rank.Athletics >= 1"',
  'Disruptive Stance':'Trait=Class,Fighter,Stance Require="level >= 10"',
  'Fearsome Brute':'Trait=Class,Fighter Require="level >= 10"',
  'Improved Knockdown':
    'Trait=Class,Fighter Require="level >= 10",features.Knockdown',
  'Mirror Shield':'Trait=Class,Fighter Require="level >= 10"',
  'Twin Riposte':
    'Trait=Class,Fighter,Ranger Require="level >= 10","features.Twin Parry"',
  'Brutal Finish':'Trait=Class,Fighter,Press Require="level >= 12"',
  'Dueling Dance':
    'Trait=Class,Fighter,Stance Require="level >= 12","features.Dueling Parry"',
  'Flinging Shove':
    'Trait=Class,Fighter ' +
    'Require="level >= 12","features.Aggressive Block||features.Brutish Shove"',
  'Improved Dueling Riposte':
    'Trait=Class,Fighter Require="level >= 12","features.Dueling Riposte"',
  'Incredible Ricochet':
    'Trait=Class,Fighter,Concentrate,Press ' +
    'Require="level >= 12","features.Incredible Aim"',
  'Lunging Stance':
    'Trait=Class,Fighter,Stance ' +
    'Require="level >= 12","features.Attack Of Opportunity","features.Lunge"',
  "Paragon's Guard":'Trait=Class,Fighter,Stance Require="level >= 12"',
  'Spring Attack':'Trait=Class,Fighter,Press Require="level >= 12"',
  'Desperate Finisher':'Trait=Class,Fighter Require="level >= 14"',
  'Determination':'Trait=Class,Fighter,Concentration Require="level >= 14"',
  'Guiding Finish':'Trait=Class,Fighter,Press Require="level >= 14"',
  'Guiding Riposte':
    'Trait=Class,Fighter Require="level >= 14","features.Dueling Riposte"',
  'Improved Twin Riposte':
    'Trait=Class,Fighter,Ranger ' +
    'Require=' +
      '"levels.Fighter >= 14 || levels.Ranger >= 16",' +
      '"features.Twin Riposte"',
  'Stance Savant':
    'Trait=Class,Fighter,Monk Require="level >= 14 || levels.Monk >= 12"',
  'Two-Weapon Flurry':
    'Trait=Class,Fighter,Flourish,Press Require="level >= 14"',
  // Whirlwind Strike as above
  'Graceful Poise':
    'Trait=Class,Fighter,Stance Require="level >= 16","features.Double Slice"',
  'Improved Reflexive Shield':
    'Trait=Class,Fighter Require="level >= 16","features.Reflexive Shield"',
  'Multishot Stance':
    'Trait=Class,Fighter,Stance Require="level >= 16","features.Triple Shot"',
  'Twinned Defense':
    'Trait=Class,Fighter,Stance Require="level >= 16","features.Twin Parry"',
  'Impossible Volley':
    'Trait=Class,Fighter,Ranger,Flourish,Open Require="level >= 18"',
  'Savage Critical':'Trait=Class,Fighter Require="level >= 18"',
  'Boundless Reprisals':'Trait=Class,Fighter Require="level >= 20"',
  'Weapon Supremacy':'Trait=Class,Fighter Require="level >= 20"',

  'Crane Stance':'Trait=Class,Monk,Stance"',
  'Dragon Stance':'Trait=Class,Monk,Stance"',
  'Ki Rush':'Trait=Class,Monk"',
  'Ki Strike':'Trait=Class,Monk"',
  'Monastic Weaponry':'Trait=Class,Monk"',
  'Mountain Stance':'Trait=Class,Monk,Stance"',
  'Tiger Stance':'Trait=Class,Monk,Stance"',
  'Wolf Stance':'Trait=Class,Monk,Stance"',
  'Brawling Focus':'Trait=Class,Monk Require="level >= 2"',
  'Crushing Grab':'Trait=Class,Monk Require="level >= 2"',
  'Dancing Leaf':'Trait=Class,Monk Require="level >= 2"',
  'Elemental Fist':'Trait=Class,Monk Require="level >= 2","features.Ki Strike"',
  'Stunning Fist':
    'Trait=Class,Monk Require="level >= 2","features.Flurry Of Blows"',
  'Deflect Arrow':'Trait=Class,Monk Require="level >= 4"',
  'Flurry Of Maneuvers':
    'Trait=Class,Monk Require="level >= 4","rank.Athletics >= 2"',
  'Flying Kick':'Trait=Class,Monk Require="level >= 4"',
  'Guarded Movement':'Trait=Class,Monk Require="level >= 4"',
  'Stand Still':'Trait=Class,Monk Require="level >= 4"',
  'Wholeness Of Body':
    'Trait=Class,Monk Require="level >= 4","features.Ki Spells"',
  'Abundant Step':
    'Trait=Class,Monk ' +
    'Require="level >= 6","features.Incredible Movement","features.Ki Spells"',
  'Crane Flutter':
    'Trait=Class,Monk Require="level >= 6","features.Crane Stance"',
  'Dragon Roar':
    'Trait=Class,Monk,Auditory,Emotion,Fear,Mental ' +
    'Require="level >= 6","features.Dragon Stance"',
  'Ki Blast':
    'Trait=Class,Monk Require="level >= 6","features.Ki Spells"',
  'Mountain Stronghold':
    'Trait=Class,Monk Require="level >= 6","features.Mountain Stance"',
  'Tiger Slash':
    'Trait=Class,Monk Require="level >= 6","features.Tiger Stance"',
  'Water Step':'Trait=Class,Monk Require="level >= 6"',
  'Whirling Throw':'Trait=Class,Monk Require="level >= 6"',
  'Wolf Drag':
    'Trait=Class,Monk Require="level >= 6","features.Wolf Stance"',
  'Arrow Snatching':
    'Trait=Class,Monk Require="level >= 8","features.Deflect Arrow"',
  'Ironblood Stance':'Trait=Class,Monk,Stance Require="level >= 8"',
  'Mixed Maneuver':
    'Trait=Class,Monk Require="level >= 8","rank.Athletics >= 3"',
  'Tangled Forest Stance':'Trait=Class,Monk,Stance Require="level >= 8"',
  'Wall Run':'Trait=Class,Monk Require="level >= 8"',
  'Wild Winds Initiate':
    'Trait=Class,Monk Require="level >= 8","features.Ki Spells"',
  'Knockback Strike':'Trait=Class,Monk,Concentrate Require="level >= 10"',
  'Sleeper Hold':'Trait=Class,Monk,Incapacitation Require="level >= 10"',
  'Wind Jump':
    'Trait=Class,Monk Require="level >= 10","features.Ki Spells"',
  'Winding Flow':'Trait=Class,Monk Require="level >= 10"',
  'Diamond Soul':'Trait=Class,Monk Require="level >= 12"',
  'Disrupt Ki':'Trait=Class,Monk,Negative Require="level >= 12"',
  'Improved Knockback':
    'Trait=Class,Monk Require="level >= 12","rank.Athletics >= 3"',
  'Meditative Focus':
    'Trait=Class,Monk Require="level >= 12","features.Ki Spells"',
  // Stance Savant as above
  'Ironblood Surge':
    'Trait=Class,Monk Require="level >= 14","features.Ironblood Stance"',
  'Mountain Quake':
    'Trait=Class,Monk Require="level >= 14","features.Mountain Stronghold"',
  'Tangled Forest Rake':
    'Trait=Class,Monk Require="level >= 14","features.Tangled Forest Stance"',
  'Timeless Body':'Trait=Class,Monk Require="level >= 14"',
  'Tongue Of Sun And Moon':'Trait=Class,Monk Require="level >= 14"',
  'Wild Winds Gust':
    'Trait=Class,Monk,Air,Concentrate,Evocation,Manipulate ' +
    'Require="level >= 14","features.Wild Winds Initiate"',
  'Enlightened Presence':
    'Trait=Class,Monk,Aura,Emotion,Mental Require="level >= 16"',
  'Master Of Many Styles':
    'Trait=Class,Monk Require="level >= 16","features.Stance Savant"',
  'Quivering Palm':'Trait=Class,Monk Require="level>=16","features.Ki Spells"',
  'Shattering Strike':'Trait=Class,Monk Require="level >= 16"',
  'Diamond Fists':'Trait=Class,Monk Require="level >= 18"',
  'Empty Body':
    'Trait=Class,Monk Require="level >= 18","features.Ki Spells"',
  'Meditative Wellspring':
    'Trait=Class,Monk Require="level >= 18","features.Meditative Focus"',
  'Swift River':'Trait=Class,Monk Require="level >= 18"',
  'Enduring Quickness':'Trait=Class,Monk Require="level >= 20"',
  'Fuse Stance':'Trait=Class,Monk Require="level >= 20","sumStanceFeats >=2 "',
  'Impossible Technique':'Trait=Class,Monk,Fortune Require="level >= 20"',

  // Animal Companion as above
  'Crossbow Ace':'Trait=Class,Ranger',
  'Hunted Shot':'Trait=Class,Ranger,Flourish',
  'Monster Hunter':'Trait=Class,Ranger',
  'Twin Takedown':'Trait=Class,Ranger,Flourish',
  'Favored Terrain (%terrain)':'Trait=Class,Ranger Require="level >= 2"',
  "Hunter's Aim":'Trait=Class,Ranger,Concentrate Require="level >= 2"',
  'Monster Warden':
    'Trait=Class,Ranger Require="level >= 2","features.Monster Hunter"',
  'Quick Draw':'Trait=Class,Ranger,Rogue Require="level >= 2"',
  'Wild Empathy':'Trait=Class,Ranger Require="level >= 2"',
  "Companion's Cry":
    'Trait=Class,Ranger Require="level >= 4","features.Animal Companion"',
  'Disrupt Prey':'Trait=Class,Ranger Require="level >= 4"',
  'Far Shot':'Trait=Class,Ranger Require="level >= 4"',
  'Favored Enemy':'Trait=Class,Ranger Require="level >= 4"',
  'Running Reload':'Trait=Class,Ranger Require="level >= 4"',
  "Scout's Warning":'Trait=Class,Ranger,Rogue Require="level >= 4"',
  'Snare Specialist':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 4",' +
      '"rank.Crafting >= 2",' +
      '"features.Snare Crafting"',
  // Twin Parry as above
  // Mature Animal Companion as above
  'Quick Snares':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 6",' +
      '"rank.Crafting >= 2",' +
      '"features.Snare Specialist"',
  'Skirmish Strike':'Trait=Class,Ranger,Rogue,Flourish Require="level >= 6"',
  'Snap Shot':'Trait=Class,Ranger Require="level >= 6"',
  'Swift Tracker':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 6",' +
      '"rank.Survival >= 2",' +
      '"features.Experienced Tracker"',
  // Blind-Fight as above
  'Deadly Aim':
    'Trait=Class,Ranger,Open ' +
    'Require="level >= 8","features.Weapon Specialization"',
  'Hazard Finder':'Trait=Class,Ranger Require="level >= 8"',
  'Powerful Snares':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Crafting >= 3",' +
      '"features.Snare Specialist"',
  'Terrain Master':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Survival >= 3",' +
      '"features.Favored Terrain"',
  "Warden's Boon":'Trait=Class,Ranger Require="level >= 8"',
  'Camouflage':
    'Trait=Class,Ranger Require="level >= 10","rank.Stealth >= 3"',
  // Incredible Companion as above
  'Master Monster Hunter':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 10",' +
      '"rank.Nature >= 3",' +
      '"features.Monster Hunter"',
  'Penetrating Shot':'Trait=Class,Ranger,Open Require="level >= 10"',
  // Twin Riposte as above
  "Warden's Step":
    'Trait=Class,Ranger Require="level >= 10","rank.Stealth >= 3"',
  'Distracting Shot':'Trait=Class,Ranger Require="level >= 12"',
  'Double Prey':'Trait=Class,Ranger Require="level >= 12"',
  'Lightning Snares':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 12",' +
      '"rank.Crafting >= 3",' +
      '"features.Quick Snares",' +
      '"features.Snare Specialist"',
  'Second Sting':'Trait=Class,Ranger,Press Require="level >= 12"',
  // Side By Side as above
  'Sense The Unseen':'Trait=Class,Ranger,Rogue Require="level >= 14"',
  'Shared Prey':
    'Trait=Class,Ranger ' +
    'Require="level >= 14","features.Double Prey","features.Warden\'s Boon"',
  'Stealthy Companion':
    'Trait=Class,Ranger ' +
    'Require="level >= 14","features.Animal Companion","features.Camouflage"',
  'Targeting Shot':
    'Trait=Class,Ranger,Concentrate,Press ' +
    'Require="level >= 14","features.Hunter\'s Aim"',
  "Warden's Guidance":'Trait=Class,Ranger Require="level >= 14"',
  'Greater Distracting Shot':
    'Trait=Class,Ranger Require="level >= 16","features.Distracting Shot"',
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 16",' +
      '"rank.Nature >= 4",' +
      '"features.Master Monster Hunter"',
  // Specialized Companion as above
  'Ubiquitous Snares':
    'Trait=Class,Ranger Require="level >= 16","features.Snare Specialist"',
  'Impossible Flurry':'Trait=Class,Ranger,Flourish,Open Require="level >= 18"',
  // Impossible Volley as above
  'Manifold Edge':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Hunter\'s Edge",' +
      '"features.Masterful Hunter"',
  'Masterful Companion':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Masterful Hunter",' +
      '"features.Animal Companion"',
  'Perfect Shot':'Trait=Class,Ranger,Flourish Require="level >= 18"',
  'Shadow Hunter':
    'Trait=Class,Ranger Require="level >= 18","features.Camouflage"',
  'Legendary Shot':
    'Trait=Class,Ranger ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Masterful Hunter",' +
      '"rank.Perception >= 4",' +
      '"features.Far Shot"',
  'To The Ends Of The Earth':
    'Trait=Class,Ranger Require="level >= 20","rank.Survival >= 4"',
  'Triple Threat':
    'Trait=Class,Ranger Require="level >= 20","features.Shared Prey"',
  'Ultimate Skirmisher':
    'Trait=Class,Ranger Require="level >= 20","features.Wild Stride"',

  'Nimble Dodge':'Trait=Class,Rogue',
  'Trap Finder':'Trait=Class,Rogue',
  'Twin Feint':'Trait=Class,Rogue',
  "You're Next":
    'Trait=Class,Rogue,Emotion,Fear,Mental Require="rank.Intimidation >= 1"',
  'Brutal Beating':
    'Trait=Class,Rogue Require="level >= 2","features.Ruffian"',
  'Distracting Feint':
    'Trait=Class,Rogue Require="level >= 2","features.Scoundrel"',
  'Minor Magic (Arcane)':'Trait=Class,Rogue Require="level >= 2"',
  'Minor Magic (Divine)':'Trait=Class,Rogue Require="level >= 2"',
  'Minor Magic (Occult)':'Trait=Class,Rogue Require="level >= 2"',
  'Minor Magic (Primal)':'Trait=Class,Rogue Require="level >= 2"',
  'Mobility':'Trait=Class,Rogue Require="level >= 2"',
  // Quick Draw as above
  'Unbalancing Blow':
    'Trait=Class,Rogue Require="level >= 2","features.Thief"',
  'Battle Assessment':'Trait=Class,Rogue,Secret Require="level >= 4"',
  'Dread Striker':'Trait=Class,Rogue Require="level >= 4"',
  'Magical Trickster':'Trait=Class,Rogue Require="level >= 4"',
  'Poison Weapon':'Trait=Class,Rogue,Manipulate Require="level >= 4"',
  'Reactive Pursuit':'Trait=Class,Rogue Require="level >= 4"',
  'Sabotage':'Trait=Class,Rogue,Incapacitation Require="level >= 4"',
  // Scout's Warning as above
  'Gang Up':'Trait=Class,Rogue Require="level >= 6"',
  'Light Step':'Trait=Class,Rogue Require="level >= 6"',
  // Skirmish Strike as above
  'Twist The Knife':'Trait=Class,Rogue Require="level >= 6"',
  // Blind-Fight as above
  'Delay Trap':'Trait=Class,Rogue Require="level >= 8"',
  'Improved Poison Weapon':
    'Trait=Class,Rogue Require="level >= 8","features.Poison Weapon"',
  'Nimble Roll':
    'Trait=Class,Rogue Require="level >= 8","features.Nimble Dodge"',
  'Opportune Backstab':'Trait=Class,Rogue Require="level >= 8"',
  'Sidestep':'Trait=Class,Rogue Require="level >= 8"',
  'Sly Striker':
    'Trait=Class,Rogue Require="level >= 8","features.Sneak Attack"',
  'Precise Debilitations':
    'Trait=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Thief",' +
      '"features.Debilitating Strike"',
  'Sneak Savant':
    'Trait=Class,Rogue Require="level >= 10","rank.Stealth >= 3"',
  'Tactical Debilitations':
    'Trait=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Scoundrel",' +
      '"features.Debilitating Strike"',
  'Vicious Debilitations':
    'Trait=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Ruffian",' +
      '"features.Debilitating Strike"',
  'Critical Debilitation':
    'Trait=Class,Rogue,Incapacitation ' +
    'Require="level >= 12","features.Debilitating Strike"',
  'Fantastic Leap':'Trait=Class,Rogue Require="level >= 12"',
  'Felling Shot':'Trait=Class,Rogue Require="level >= 12"',
  'Reactive Interference':'Trait=Class,Rogue Require="level >= 12"',
  'Spring From The Shadows':'Trait=Class,Rogue,Flourish Require="level >= 12"',
  'Defensive Roll':'Trait=Class,Rogue Require="level >= 14"',
  'Instant Opening':'Trait=Class,Rogue,Concentrate Require="level >= 14"',
  'Leave An Opening':'Trait=Class,Rogue Require="level >= 14"',
  // Sense The Unseen as above
  'Blank Slate':
    'Trait=Class,Rogue Require="level >= 16","rank.Deception >= 4"',
  'Cloud Step':
    'Trait=Class,Rogue Require="level >= 16","rank.Acrobatics >= 4"',
  'Cognitive Loophole':'Trait=Class,Rogue Require="level >= 16"',
  'Dispelling Slice':'Trait=Class,Rogue Require="level >= 16"',
  'Perfect Distraction':
    'Trait=Class,Rogue Require="level >= 16","rank.Deception >= 4"',
  'Implausible Infiltration':
    'Trait=Class,Rogue,Magical,Move ' +
    'Require=' +
      '"level >= 18",' +
      '"rank.Acrobatics >= 4",' +
      '"features.Quick Squeeze"',
  'Powerful Sneak':'Trait=Class,Rogue Require="level >= 18"',
  "Trickster's Ace":'Trait=Class,Rogue,Concentrate Require="level >= 18"',
  'Hidden Paragon':
    'Trait=Class,Rogue Require="level >= 20","rank.Stealth >= 4"',
  'Impossible Striker':
    'Trait=Class,Rogue Require="level >= 20","features.Sly Striker"',
  'Reactive Distraction':
    'Trait=Class,Rogue,Concentrate,Manipulate ' +
    'Require=' +
      '"level >= 20",' +
      '"rank.Deception >= 4",' +
      '"features.Perfect Distraction"',

  'Counterspell':'Trait=Class,Sorcerer,Wizard,Abjuration',
  'Dangerous Sorcery':'Trait=Class,Sorcerer',
  'Familiar':'Trait=Class,Sorcerer,Wizard',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Trait=Class,Sorcerer,Arcane ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Arcane\'"',
  'Bespell Weapon':'Trait=Class,Sorcerer,Wizard Require="level >= 4"',
  'Divine Evolution':
    'Trait=Class,Sorcerer,Divine ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Divine\'"',
  'Occult Evolution':
    'Trait=Class,Sorcerer,Occult ' +
     'Require="level >= 4","bloodlineTraditions =~ \'Occult\'"',
  'Primal Evolution':
    'Trait=Class,Sorcerer,Primal ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Primal\'"',
  'Advanced Bloodline':
    'Trait=Class,Sorcerer Require="level >= 6","features.Bloodline"',
  // Steady Spellcasting as above
  'Bloodline Resistance':'Trait=Class,Sorcerer Require="level >= 8"',
  'Crossblooded Evolution':'Trait=Class,Sorcerer Require="level >= 8"',
  'Greater Bloodline':
    'Trait=Class,Sorcerer Require="level >= 10","features.Bloodline"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':
    'Trait=Class,Sorcerer Require="level >= 12","features.Bloodline"',
  'Magic Sense':
    'Trait=Class,Sorcerer,Wizard,Detection,Divination Require="level >= 12"',
  'Interweave Dispel':
    'Trait=Class,Sorcerer,Metamagic ' +
    'Require="level >= 14","spells.Dispel Magic"',
  'Reflect Spell':
    'Trait=Class,Sorcerer,Wizard Require="level >= 14","features.Counterspell"',
  // Effortless Concentration as above
  'Greater Mental Evolution':
    'Trait=Class,Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Arcane Evolution || features.Occult Evolution"',
  'Greater Vital Evolution':
    'Trait=Class,Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Evolution || features.Primal Evolution"',
  'Bloodline Wellspring':
    'Trait=Class,Sorcerer Require="level >= 18","features.Bloodline Focus"',
  'Greater Crossblooded Evolution':
    'Trait=Class,Sorcerer ' +
    'Require="level >= 18","features.Crossblooded Evolution"',
  'Bloodline Conduit':'Trait=Class,Sorcerer,Metamagic Require="level >= 20"',
  'Bloodline Perfection':
    'Trait=Class,Sorcerer Require="level >= 20","features.Bloodline Paragon"',
  'Metamagic Mastery':'Trait=Class,Sorcerer,Wizard Require="level >= 20"',

  // Wizard
  // Counterspell as above
  'Eschew Materials':'Trait=Class,Wizard',
  // Familiar as above
  'Hand Of The Apprentice':'Trait=Class,Wizard Require="features.Universalist"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':
    'Trait=Class,Wizard,Concentrate,Manipulate,Metamagic Require="level >= 2"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':
    'Trait=Class,Wizard ' +
    'Require="level >= 4","features.Arcane Bond","features.Arcane School"',
  'Silent Spell':
    'Trait=Class,Wizard,Concentrate,Metamagic ' +
    'Require="level >= 4","features.Conceal Spell"',
  'Spell Penetration':'Trait=Class,Wizard Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced School Spell':
    'Trait=Class,Wizard Require="level >= 8","features.Arcane School"',
  'Bond Conservation':
    'Trait=Class,Wizard,Manipulate,Metamagic ' +
    'Require="level >= 8","features.Arcane Bond"',
  'Universal Versatility':
    'Trait=Class,Wizard ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Universalist",' +
      '"features.Hand Of The Apprentice"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Savant':
    'Trait=Class,Wizard Require="level >= 10","rank.Crafting >= 2"',
  'Clever Counterspell':
    'Trait=Class,Wizard ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Counterspell",' +
      '"features.Quick Recognition"',
  // Magic Sense as above
  'Bonded Focus':
    'Trait=Class,Wizard Require="level >= 14","features.Arcane Bond"',
  // Reflect Spell as above
  'Superior Bond':
    'Trait=Class,Wizard Require="level >= 14","features.Arcane Bond"',
  // Effortless Concentration as above
  'Spell Tinker':'Trait=Class,Wizard,Concentrate Require="level >= 16"',
  'Infinite Possibilities':'Trait=Class,Wizard Require="level >= 18"',
  'Reprepare Spell':'Trait=Class,Wizard Require="level >= 18"',
  "Archwizard's Might":
    'Trait=Class,Wizard ' +
    'Require="level >= 20","features.Archwizard\'s Spellcraft"',
  // Metamagic Mastery as above
  'Spell Combination':'Trait=Class,Wizard Require="level >= 20"',

  // Archetype
  'Alchemist Dedication':
    'Trait=Archetype,Dedication,Multiclass,Alchemist ' +
    'Require="level >= 2","intelligence >= 14","levels.Alchemist == 0"',
  'Basic Concoction':
    'Trait=Archetype,Alchemist ' +
    'Require="level >= 4","features.Alchemist Dedication"',
  'Quick Alchemy':
    'Trait=Archetype,Alchemist ' +
    'Require="level >= 4","features.Alchemist Dedication"',
  'Advanced Concoction':
    'Trait=Archetype,Alchemist ' +
    'Require="level >= 6","features.Basic Concoction"',
  'Expert Alchemy':
    'Trait=Archetype,Alchemist ' +
    'Require="level >= 6","features.Alchemist Dedication","rank.Crafting >= 2"',
  'Master Alchemy':
    'Trait=Archetype,Alchemist ' +
    'Require="level >= 12","features.Expert Alchemy","rank.Crafting >= 3"',

  'Barbarian Dedication':
    'Trait=Archetype,Dedication,Multiclass,Barbarian ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14",' +
      '"constitution >= 14",' +
      '"levels.Barbarian == 0"',
  'Barbarian Resiliency':
    'Trait=Archetype,Barbarian ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Barbarian Dedication",' +
      '"classHitPoints <= 10"',
  'Basic Fury':
    'Trait=Archetype,Barbarian ' +
    'Require="level >= 4","features.Barbarian Dedication"',
  'Advanced Fury':
    'Trait=Archetype,Barbarian Require="level >= 6","features.Basic Fury"',
  'Instinct Ability':
    'Trait=Archetype,Barbarian ' +
    'Require="level >= 6","features.Barbarian Dedication"',
  "Juggernaut's Fortitude":
    'Trait=Archetype,Barbarian ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Barbarian Dedication",' +
      '"rank.Fortitude >= 2"',

  'Bard Dedication':
    'Trait=Archetype,Dedication,Multiclass,Bard ' +
    'Require="level >= 2","charisma >= 14","levels.Bard == 0"',
  'Basic Bard Spellcasting':
    'Trait=Archetype,Bard Require="level >= 4","features.Bard Dedication"',
  "Basic Muse's Whispers":
    'Trait=Archetype,Bard Require="level >= 4","features.Bard Dedication"',
  "Advanced Muse's Whispers":
    'Trait=Archetype,Bard ' +
    'Require="level >= 4","features.Basic Muse\'s Whispers"',
  'Counter Perform':
    'Trait=Archetype,Bard Require="level >= 6","features.Bard Dedication"',
  'Inspirational Performance':
    'Trait=Archetype,Bard Require="level >= 8","features.Bard Dedication"',
  'Occult Breadth':
    'Trait=Archetype,Bard ' +
    'Require="level >= 8","features.Basic Bard Spellcasting"',
  'Expert Bard Spellcasting':
    'Trait=Archetype,Bard ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Bard Spellcasting",' +
      '"rank.Occultism >= 3"',
  'Master Bard Spellcasting':
    'Trait=Archetype,Bard ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Bard Spellcasting",' +
      '"rank.Occultism >= 4"',

  'Champion Dedication':
    'Trait=Archetype,Dedication,Multiclass,Champion ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14",' +
      '"charisma >= 14",' +
      '"levels.Champion == 0"',
  'Basic Devotion':
    'Trait=Archetype,Champion ' +
    'Require="level >= 4","features.Champion Dedication"',
  'Champion Resiliency':
    'Trait=Archetype,Champion ' +
    'Require="level >= 4","features.Champion Dedication","classHitPoints <= 8"',
  'Healing Touch':
    'Trait=Archetype,Champion ' +
    'Require="level >= 4","features.Champion Dedication"',
  'Advanced Devotion':
    'Trait=Archetype,Champion Require="level >= 6","features.Basic Devotion"',
  "Champion's Reaction":
    'Trait=Archetype,Champion ' +
    'Require="level >= 6","features.Champion Dedication"',
  'Divine Ally':
    'Trait=Archetype,Champion ' +
    'Require="level >= 6","features.Champion Dedication"',
  'Diverse Armor Expert':
    'Trait=Archetype,Champion ' +
    'Require=' +
      '"level >= 14",' +
      '"rank.Unarmored Defense >= 2 || rank.Light Armor >=2 || rank.Medium Armor >=2 || rank.Heavy Armor >= 2"',

  'Cleric Dedication':
    'Trait=Archetype,Dedication,Multiclass,Cleric ' +
    'Require="level >= 2","wisdom >= 14","levels.Cleric == 0"',
  'Basic Cleric Spellcasting':
    'Trait=Archetype,Cleric Require="level >= 4","features.Cleric Dedication"',
  'Basic Dogma':
    'Trait=Archetype,Cleric Require="level >= 4","features.Cleric Dedication"',
  'Advanced Dogma':
    'Trait=Archetype,Cleric Require="level >= 6","features.Basic Dogma"',
  'Divine Breadth':
    'Trait=Archetype,Cleric ' +
    'Require="level >= 8","features.Basic Cleric Spellcasting"',
  'Expert Cleric Spellcasting':
    'Trait=Archetype,Cleric ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Cleric Spellcasting",' +
      '"rank.Religion >= 3"',
  'Master Cleric Spellcasting':
    'Trait=Archetype,Cleric ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Cleric Spellcasting",' +
      '"rank.Religion >= 4"',

  'Druid Dedication':
    'Trait=Archetype,Dedication,Multiclass,Druid ' +
    'Require="level >= 2","wisdom >= 14","levels.Druid == 0"',
  'Basic Druid Spellcasting':
    'Trait=Archetype,Druid Require="level >= 4","features.Druid Dedication"',
  'Basic Wilding':
    'Trait=Archetype,Druid Require="level >= 4","features.Druid Dedication"',
  'Order Spell':
    'Trait=Archetype,Druid Require="level >= 4","features.Druid Dedication"',
  'Advanced Wilding':
    'Trait=Archetype,Druid Require="level >= 6","features.Basic Wilding"',
  'Primal Breadth':
    'Trait=Archetype,Druid ' +
    'Require="level >= 8","features.Basic Druid Spellcasting"',
  'Expert Druid Spellcasting':
    'Trait=Archetype,Druid ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Druid Spellcasting",' +
      '"rank.Nature >= 3"',
  'Master Druid Spellcasting':
    'Trait=Archetype,Druid ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Druid Spellcasting",' +
      '"rank.Nature >= 4"',

  'Fighter Dedication':
    'Trait=Archetype,Dedication,Multiclass,Fighter ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14",' +
      '"dexterity >= 14",' +
      '"levels.Fighter == 0"',
  'Basic Maneuver':
    'Trait=Archetype,Fighter Require="level >= 4","features.Fighter Dedication"',
  'Fighter Resiliency':
    'Trait=Archetype,Fighter ' +
    'Require="level >= 4","features.Fighter Dedication","classHitPoints <= 8"',
  'Opportunist':
    'Trait=Archetype,Fighter Require="level >= 4","features.Fighter Dedication"',
  'Advanced Maneuver':
    'Trait=Archetype,Fighter Require="level >= 6","features.Basic Maneuver"',
  'Diverse Weapon Expert':
    'Trait=Archetype,Fighter ' +
    'Require=' +
      '"level >= 12",' +
      '"maxWeaponRank >= 2 || rank.Unarmed Attacks >= 2"',

  'Monk Dedication':
    'Trait=Archetype,Dedication,Multiclass,Monk ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14",' +
      '"dexterity >= 14",' +
      '"levels.Monk == 0"',
  'Basic Kata':
    'Trait=Archetype,Monk Require="level >= 4","feats.Monk Dedication"',
  'Monk Resiliency':
    'Trait=Archetype,Monk ' +
    'Require="level >= 4","feats.Monk Dedication","classHitPoints <= 8"',
  'Advanced Kata':'Trait=Archetype,Monk Require="level >= 6","feats.Basic Kata"',
  'Monk Moves':'Trait=Archetype,Monk Require="level >= 8","feats.Monk Dedication"',
  "Monk's Flurry":
    'Trait=Archetype,Monk Require="level >= 10","feats.Monk Dedication"',
  "Perfection's Path (Fortitude)":
    'Trait=Archetype,Monk Require="level >= 12","rank.Fortitude >= 3"',
  "Perfection's Path (Reflex)":
    'Trait=Archetype,Monk Require="level >= 12","rank.Fortitude >= 3"',
  "Perfection's Path (Will)":
    'Trait=Archetype,Monk Require="level >= 12","rank.Fortitude >= 3"',

  'Ranger Dedication':
    'Trait=Archetype,Dedication,Multiclass,Ranger ' +
    'Require="level >= 2","dexterity >= 14","levels.Ranger == 0"',
  "Basic Hunter's Trick":
    'Trait=Archetype,Ranger Require="level >= 4","features.Ranger Dedication"',
  'Ranger Resiliency':
    'Trait=Archetype,Ranger ' +
    'Require="level >= 4","features.Ranger Dedication","classHitPoints <= 8"',
  "Advanced Hunter's Trick":
    'Trait=Archetype,Ranger ' +
    'Require="level >= 6","features.Basic Hunter\'s Trick"',
  'Master Spotter':
    'Trait=Archetype,Ranger ' +
    'Require="level >= 12","features.Ranger Dedication","rank.Perception >= 3"',

  'Rogue Dedication':
    'Trait=Archetype,Dedication,Multiclass,Rogue ' +
    'Require="level >= 2","dexterity >= 14","levels.Rogue == 0"',
  'Basic Trickery':
    'Trait=Archetype,Rogue Require="level >= 4","features.Rogue Dedication"',
  'Sneak Attacker':
    'Trait=Archetype,Rogue Require="level >= 4","features.Rogue Dedication"',
  'Advanced Trickery':
    'Trait=Archetype,Rogue Require="level >= 6","features.Basic Trickery"',
  'Skill Mastery':
    'Trait=Archetype,Rogue ' +
    'Require="level >= 8","features.Rogue Dedication","maxSkillRank>=2"',
  'Uncanny Dodge':
    'Trait=Archetype,Rogue Require="level >= 10","features.Rogue Dedication"',
  'Evasiveness':
    'Trait=Archetype,Rogue ' +
    'Require="level >= 12","features.Rogue Dedication","rank.Reflex >= 2"',

  'Sorcerer Dedication':
    'Trait=Archetype,Dedication,Multiclass,Sorcerer ' +
    'Require="level >= 2","charisma >= 14","levels.Sorcerer == 0"',
  'Basic Sorcerer Spellcasting':
    'Trait=Archetype,Sorcerer ' +
    'Require="level >= 4","features.Sorcerer Dedication"',
  'Basic Blood Potency':
    'Trait=Archetype,Sorcerer ' +
    'Require="level >= 4","features.Sorcerer Dedication"',
  'Basic Bloodline Spell':
    'Trait=Archetype,Sorcerer ' +
    'Require="level >= 4","features.Sorcerer Dedication"',
  'Advanced Blood Potency':
    'Trait=Archetype,Sorcerer ' +
    'Require="level >= 6","features.Basic Blood Potency"',
  'Bloodline Breadth':
    'Trait=Archetype,Sorcerer ' +
    'Require="level >= 8","features.Basic Sorcerer Spellcasting"',
  'Expert Sorcerer Spellcasting':
    'Trait=Archetype,Sorcerer ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Sorcerer Spellcasting",' +
      '"rank.Arcana >= 3 || rank.Nature >= 3 || rank.Occultism >= 3 || rank.Religion >= 3"',
  'Master Sorcerer Spellcasting':
    'Trait=Archetype,Sorcerer ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Master Sorcerer Spellcasting",' +
      '"rank.Arcana >= 4 || rank.Nature >= 4 || rank.Occultism >= 4 || rank.Religion >= 4"',

  'Wizard Dedication':
    'Trait=Archetype,Dedication,Multiclass,Wizard ' +
    'Require="level >= 2","intelligence >= 14","levels.Wizard == 0"',
  'Arcane School Spell':
    'Trait=Archetype,Wizard Require="level >= 4","features.Wizard Dedication"',
  'Basic Arcana':
    'Trait=Archetype,Wizard Require="level >= 4","features.Wizard Dedication"',
  'Basic Wizard Spellcasting':
    'Trait=Archetype,Wizard Require="level >= 4","features.Wizard Dedication"',
  'Advanced Arcana':
    'Trait=Archetype,Wizard Require="level >= 6","features.Basic Arcana"',
  'Arcane Breadth':
    'Trait=Archetype,Wizard ' +
    'Require="level >= 8","features.Basic Wizard Spellcasting"',
  'Expert Wizard Spellcasting':
    'Trait=Archetype,Wizard ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Wizard Spellcasting",' +
      '"rank.Arcana >= 3"',
  'Master Wizard Spellcasting':
    'Trait=Archetype,Wizard ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Basic Wizard Spellcasting",' +
      '"rank.Arcana >= 4"',

  // General
  'Adopted Ancestry (%ancestry)':'Trait=General',
  'Armor Proficiency':'Trait=General',
  'Breath Control':'Trait=General',
  'Canny Acumen (Fortitude)':'Trait=General',
  'Canny Acumen (Perception)':'Trait=General',
  'Canny Acumen (Reflex)':'Trait=General',
  'Canny Acumen (Will)':'Trait=General',
  'Diehard':'Trait=General',
  'Fast Recovery':'Trait=General Require="constitution >= 14"',
  'Feather Step':'Trait=General Require="dexterity >= 14"',
  'Fleet':'Trait=General',
  'Incredible Initiative':'Trait=General',
  'Ride':'Trait=General',
  'Shield Block':'Trait=General',
  'Toughness':'Trait=General',
  'Weapon Proficiency (Martial Weapons)':'Trait=General',
  'Weapon Proficiency (Simple Weapons)':'Trait=General',
  'Weapon Proficiency (%weapon)':'Trait=General',
  'Ancestral Paragon':'Trait=General Require="level >= 3"',
  'Untrained Improvisation':'Trait=General Require="level >= 3"',
  'Expeditious Search':
    'Trait=General Require="level >= 7","perception >= 2"',
  'Incredible Investiture':
    'Trait=General Require="level >= 11","charisma >= 16"',

  // Skill
  'Assurance (%skill)':'Trait=Fortune,General,Skill Require="rank.%skill >= 1"',
  'Dubious Knowledge':'Trait=General,Skill"',
  'Quick Identification':
    'Trait=General,Skill ' +
    'Require="rank.Arcana >= 1 || rank.Nature >= 1 || rank.Occultism >= 1 || rank.Religion >= 1"',
  'Recognize Spell':
    'Trait=Secret,General,Skill ' +
    'Require="rank.Arcana >= 1 || rank.Nature >= 1 || rank.Occultism >= 1 || rank.Religion >= 1"',
  'Skill Training (%skill)':'Trait=General,Skill Require="intelligence >= 12"',
  'Trick Magic Item':
    'Trait=Manipulate,General,Skill ' +
    'Require="rank.Arcana >= 1 || rank.Nature >= 1 || rank.Occultism >= 1 || rank.Religion >= 1"',
  'Automatic Knowledge (%skill)':
    'Trait=General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.%skill >= 2",' +
      '"features.Assurance (%skill)"',
  'Magical Shorthand':
    'Trait=General,Skill ' +
    'Require="level >= 2","rank.Arcana >= 2 || rank.Nature >= 2 || rank.Occultism >= 2 || rank.Religion >= 2"',
  'Quick Recognition':
    'Trait=General,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"rank.Arcana >= 3 || rank.Nature >= 3 || rank.Occultism >= 3 || rank.Religion >= 3",' +
      '"features.Recognize Spell"',

  'Cat Fall':'Trait=General,Skill Require="rank.Acrobatics >= 1"',
  'Quick Squeeze':'Trait=General,Skill Require="rank.Acrobatics >= 1"',
  'Steady Balance':'Trait=General,Skill Require="rank.Acrobatics >= 1"',
  'Nimble Crawl':
    'Trait=General,Skill Require="level >= 2","rank.Acrobatics >= 2"',
  'Kip Up':'Trait=General,Skill Require="level >= 7","rank.Acrobatics >= 3"',
  'Arcane Sense':'Trait=General,Skill Require="rank.Arcana >= 1"',
  'Unified Theory':
    'Trait=General,Skill Require="level >= 15","rank.Arcana >= 4"',
  'Combat Climber':'Trait=General,Skill Require="rank.Athletics >= 1"',
  'Hefty Hauler':'Trait=General,Skill Require="rank.Athletics >= 1"',
  'Quick Jump':'Trait=General,Skill Require="rank.Athletics >= 1"',
  'Titan Wrestler':'Trait=General,Skill Require="rank.Athletics >= 1"',
  'Underwater Marauder':'Trait=General,Skill Require="rank.Athletics >= 1"',
  'Powerful Leap':
    'Trait=General,Skill Require="level >= 2","rank.Athletics >= 2"',
  'Rapid Mantel':
    'Trait=General,Skill Require="level >= 2","rank.Athletics >= 2"',
  'Quick Climb':
    'Trait=General,Skill Require="level >= 7","rank.Athletics >= 3"',
  'Quick Swim':
    'Trait=General,Skill Require="level >= 7","rank.Athletics >= 3"',
  'Wall Jump':
    'Trait=General,Skill Require="level >= 7","rank.Athletics >= 3"',
  'Cloud Jump':
    'Trait=General,Skill Require="level >= 15","rank.Athletics >= 4"',
  'Alchemical Crafting':'Trait=General,Skill Require="rank.Crafting >= 1"',
  'Quick Repair':'Trait=General,Skill Require="rank.Crafting >= 1"',
  'Snare Crafting':'Trait=General,Skill Require="rank.Crafting >= 1"',
  'Specialty Crafting':'Trait=General,Skill Require="rank.Crafting >= 1"',
  'Magical Crafting':
    'Trait=General,Skill Require="level >= 2","rank.Crafting >= 2"',
  'Impeccable Crafting':
    'Trait=General,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"rank.Crafting >= 3",' +
      '"features.Specialty Crafting"',
  'Inventor':
    'Trait=Downtime,General,Skill Require="level >= 7","rank.Crafting >= 3"',
  'Craft Anything':
    'Trait=General,Skill Require="level >= 15","rank.Crafting >= 4"',
  'Charming Liar':'Trait=General,Skill Require="rank.Deception >= 1"',
  'Lengthy Diversion':'Trait=General,Skill Require="rank.Deception >= 1"',
  'Lie To Me':'Trait=General,Skill Require="rank.Deception >= 1"',
  'Confabulator':
    'Trait=General,Skill Require="level >= 2","rank.Deception >= 2"',
  'Quick Disguise':
    'Trait=General,Skill Require="level >= 2","rank.Deception >= 2"',
  'Slippery Secrets':
    'Trait=General,Skill Require="level >= 7","rank.Deception >= 3"',
  'Bargain Hunter':'Trait=General,Skill Require="rank.Diplomacy >= 1"',
  'Group Impression':'Trait=General,Skill Require="rank.Diplomacy >= 1"',
  'Hobnobber':'Trait=General,Skill Require="rank.Diplomacy >= 1"',
  'Glad-Hand':
    'Trait=General,Skill Require="level >= 2","rank.Diplomacy >= 2"',
  'Shameless Request':
    'Trait=General,Skill Require="level >= 7","rank.Diplomacy >= 3"',
  'Legendary Negotiation':
    'Trait=General,Skill Require="level >= 15","rank.Diplomacy >= 4"',
  'Group Coercion':'Trait=General,Skill Require="rank.Intimidation >= 1"',
  'Intimidating Glare':'Trait=General,Skill Require="rank.Intimidation >= 1"',
  'Quick Coercion':'Trait=General,Skill Require="rank.Intimidation >= 1"',
  'Intimidating Prowess':
    'Trait=General,Skill ' +
    'Require="level >= 2","strength >= 16","rank.Intimidation >= 2"',
  'Lasting Coercion':
    'Trait=General,Skill Require="level >= 2","rank.Intimidation >= 2"',
  'Battle Cry':
    'Trait=General,Skill Require="level >= 7","rank.Intimidation >= 3"',
  'Terrified Retreat':
    'Trait=General,Skill Require="level >= 7","rank.Intimidation >= 3"',
  'Scare To Death':
    'Trait=Emotion,Fear,Incapacitation,General,Skill ' +
    'Require="level >= 15","rank.Intimidation >= 4"',
  'Additional Lore (%lore)':'Trait=General,Skill Require="rank.Lore >= 1"',
  'Experienced Professional':'Trait=General,Skill Require="rank.Lore >= 1"',
  'Unmistakable Lore':
    'Trait=General,Skill Require="level >= 2","rank.Lore >= 2"',
  'Legendary Professional':
    'Trait=General,Skill Require="level >= 15","rank.Lore >= 4"',
  'Battle Medicine':
    'Trait=Healing,Manipulate,General,Skill Require="rank.Medicine >= 1"',
  'Continual Recovery':
    'Trait=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  'Robust Recovery':
    'Trait=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  'Ward Medic':
    'Trait=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  'Legendary Medic':
    'Trait=General,Skill Require="level >= 15","rank.Medicine >= 4"',
  'Natural Medicine':'Trait=General,Skill Require="rank.Nature >= 1"',
  'Train Animal':
    'Trait=Downtime,Manipulate,General,Skill Require="rank.Nature >= 1"',
  'Bonded Animal':
    'Trait=Downtime,General,Skill Require="level >= 2","rank.Nature >= 2"',
  'Oddity Identification':'Trait=General,Skill Require="rank.Occultism >= 1"',
  'Bizarre Magic':
    'Trait=General,Skill Require="level >= 7","rank.Occultism >= 3"',
  'Fascinating Performance':
    'Trait=General,Skill Require="rank.Performance >= 1"',
  'Impressive Performance':
    'Trait=General,Skill Require="rank.Performance >= 1"',
  'Virtuosic Performer':'Trait=General,Skill Require="rank.Performance >= 1"',
  'Legendary Performer':
    'Trait=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Performance >= 4",' +
      '"features.Virtuosic Performer"',
  'Student Of The Canon':'Trait=General,Skill Require="rank.Religion >= 1"',
  'Divine Guidance':
    'Trait=General,Skill Require="level >= 15","rank.Religion >= 4"',
  'Courtly Graces':'Trait=General,Skill Require="rank.Society >= 1"',
  'Multilingual':'Trait=General,Skill Require="rank.Society >= 1"',
  'Read Lips':'Trait=General,Skill Require="rank.Society >= 1"',
  'Sign Language':'Trait=General,Skill Require="rank.Society >= 1"',
  'Streetwise':'Trait=General,Skill Require="rank.Society >= 1"',
  'Connections':
    'Trait=Uncommon,General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Society >= 2",' +
      '"features.Courtly Graces"',
  'Legendary Codebreaker':
    'Trait=General,Skill Require="level >= 15","rank.Society >= 4"',
  'Legendary Linguist':
    'Trait=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Society >= 4",' +
      '"features.Multilingual"',
  'Experienced Smuggler':'Trait=General,Skill Require="rank.Stealth >= 1"',
  'Terrain Stalker (Rubble)':'Trait=General,Skill Require="rank.Stealth >= 1"',
  'Terrain Stalker (Snow)':'Trait=General,Skill Require="rank.Stealth >= 1"',
  'Terrain Stalker (Underbrush)':
    'Trait=General,Skill Require="rank.Stealth >= 1"',
  'Quiet Allies':
    'Trait=General,Skill Require="level >= 2","rank.Stealth >= 2"',
  'Foil Senses':
    'Trait=General,Skill Require="level >= 7","rank.Stealth >= 3"',
  'Swift Sneak':
    'Trait=General,Skill Require="level >= 7","rank.Stealth >= 3"',
  'Legendary Sneak':
    'Trait=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Stealth >= 4",' +
      '"features.Swift Sneak"',
  'Experienced Tracker':'Trait=General,Skill Require="rank.Survival >= 1"',
  'Forager':'Trait=General,Skill Require="rank.Survival >= 1"',
  'Survey Wildlife':'Trait=General,Skill Require="rank.Survival >= 1"',
  'Terrain Expertise (%terrain)':
    'Trait=General,Skill Require="rank.Survival >= 1"',
  'Planar Survival':
    'Trait=General,Skill Require="level >= 7","rank.Survival >= 3"',
  'Legendary Survivalist':
    'Trait=General,Skill Require="level >= 15","rank.Survival >= 4"',
  'Pickpocket':'Trait=General,Skill Require="rank.Thievery >= 1"',
  'Subtle Theft':'Trait=General,Skill Require="rank.Thievery >= 1"',
  'Wary Disarmament':
    'Trait=General,Skill Require="level >= 2","rank.Thievery >= 2"',
  'Quick Unlock':
    'Trait=General,Skill Require="level >= 7","rank.Thievery >= 3"',
  'Legendary Thief':
    'Trait=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Thievery >= 4",' +
      '"features.Pickpocket"'

};
Pathfinder2E.FEATURES = {

  // Ancestry
  'Ancestry Feats':'Section=feature Note="%V selections"',

  'Ancient-Blooded Dwarf':
    'Section=feature Note="Has the Call On Ancient Blood feature"',
  'Arctic Elf':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1}/Treats environmental cold as 1 step less extreme"',
  'Call On Ancient Blood':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="May gain +1 vs. magic until the end of turn"',
  'Cavern Elf':'Section=feature Note="Has the Darkvision feature"',
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
  'Dwarf Heritage':'Section=feature Note="1 selection"',
  'Elf Heritage':'Section=feature Note="1 selection"',
  'Fey-Touched Gnome':
    'Section=magic ' +
    'Note="May cast chosen cantrip at will; may spend 10 min to replace chosen cantrip 1/day"',
  'Forge Dwarf':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1}/Treats environmental heat as 1 step less extreme"',
  'Gnome Heritage':'Section=feature Note="1 selection"',
  'Goblin Heritage':'Section=feature Note="1 selection"',
  'Gutsy Halfling':
    'Section=save Note="Successful saves vs. emotion are critical successes"',
  'Half-Elf':'Section=feature Note="Has the Low-Light Vision feature"',
  'Half-Orc':'Section=feature Note="Has the Low-Light Vision feature"',
  'Halfling Heritage':'Section=feature Note="1 selection"',
  'Hillock Halfling':
    'Section=combat Note="Regains +%{level} Hit Points from rest or treatment"',
  'Human Heritage':'Section=feature Note="1 selection"',
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
  'Twilight Halfling':'Section=feature Note="Has the Low-Light Vision feature"',
  'Umbral Gnome':'Section=feature Note="Has the Darkvision feature"',
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
      '"Attack Trained (Battle Axe; Pick; Warhammer)/Treats dwarf weapons as one category simpler",' +
      '"Has access to uncommon dwarf weapons"',
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
    'Action=2 ' +
    'Section=combat ' +
    'Note="May Step into a foe\'s square to force a 5\' move (Fort vs. Athletics critical success negates; normal success negates but inflicts %{level+strengthModifier}B HP)"',
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
    'Note="Attack Expert (Battle Axe; Pick; Warhammer; Dwarf Weapons)"',

  'Ancestral Longevity':
    'Section=skill ' +
    'Note="May gain Trained proficiency in choice of skill during daily preparations"',
  'Elven Lore':
    'Section=skill Note="Skill Trained (Arcana; Nature; Elven Lore)"',
  'Elven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow)/Treats elf weapons as one category simpler",' +
      '"Has access to uncommon elf weapons"',
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
  'Elf Step':'Action=1 Section=combat Note="May take two 5\' Steps"',
  'Expert Longevity':
    'Section=skill ' +
    'Note="Ancestral Longevity also gives expert level in a chosen trained skill; upon expiration, may replace an existing skill increase with one chosen"',
  'Universal Longevity':
    'Action=1 ' +
    'Section=skill ' +
    'Note="May replace Ancestral Longevity and Expert Longevity skills 1/day"',
  'Elven Weapon Expertise':
    'Section=combat ' +
    'Note="Attack Expert (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow; Elf Weapons)"',

  'Animal Accomplice':'Section=feature Note="Has the Familiar feature"',
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
      // TODO implement
      '"Skill %V (Choose 1 from any Lore; %{background} Lore skill)"',
  'Gnome Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Glaive; Kukri)/Treats gnome weapons as one category simpler",' +
      '"Has access to uncommon gnome weapons"',
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
  'Energized Font':
    'Action=1 Section=magic Note="May regain 1 Focus Point 1/day"',
  'Gnome Weapon Innovator':
    'Section=combat ' +
    'Note="Critical hits with a glaive, kukri, or gnome weapon inflict its critical specialization effect"',
  'First World Adept':
    'Section=magic ' +
     'Note="May cast <i>Faerie Fire</i> and <i>Invisibility</i> at level 2 1/day"',
  'Vivacious Conduit':
    'Section=combat ' +
    'Note="10 min rest restores %{constitutionModifier*(level/2)//1} Hit Points"',
  'Gnome Weapon Expertise':
    'Section=combat ' +
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
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May take a Step when an ally moves to an adjacent position"',
  'Goblin Song':
    'Action=1 ' +
    'Section=skill ' +
    'Note="R30\' May use Performance vs. target Will DC; success inflicts -1 Perception and Will for 1 rd, critical success for 1 min"',
  'Goblin Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Dogslicer; Horsechopper)/Treats goblin weapons as one category simpler",' +
      '"Has access to uncommon goblin weapons"',
  'Junk Tinker':
    'Section=skill Note="May use Crafting on junk to create level 0 items"',
  'Rough Rider':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Ride feature",' +
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
    'Note="Attack Expert (Dogslicer; Horsechopper; Goblin Weapons)"',
  'Very, Very Sneaky':
    'Section=combat Note="May Sneak at full Speed and without cover"',

  'Distracting Shadows':
    'Section=skill Note="May use larger creatures as cover for Hide and Sneak"',
  'Halfling Lore':
    'Section=skill Note="Skill Trained (Acrobatics; Stealth; Halfling Lore)"',
  'Halfling Luck':
    'Action=Free ' +
    'Section=feature ' +
    'Note="May reroll a failed skill check or save 1/day"',
  'Halfling Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Sling; Halfling Sling Staff; Shortsword)/Treats halfling weapons as one category simpler",' +
      '"Has access to uncommon halfling weapons"',
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
  'Cultural Adaptability (%ancestry)':
    'Section=feature ' +
    'Note="+1 Ancestry feat/Has the Adopted Ancestry (%ancestry) feature"',
  'Halfling Weapon Trickster':
    'Section=combat ' +
    'Note="Critical hits with a shortsword, sling, or halfling weapon weapon inflict its critical specialization effect"',
  'Guiding Luck':
    'Action=Free ' +
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
  'Unconventional Weaponry (%weapon)':
    'Section=combat Note="Treats %weapon as one category simpler"',
  'Adaptive Adept':
    'Section=magic ' +
    'Note="Knows a cantrip or level 1 spell from a different tradition"',
  'Clever Improviser':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Untrained Improvisation feature",' +
      '"May use any skill untrained"',
  'Cooperative Soul':
    'Section=skill ' +
    'Note="Failures and critical failures when using Aid with expert skills are successes"',
  'Incredible Improvisation':
    'Action=Free ' +
    'Section=combat ' +
    'Note="May add +4 to an untrained skill check 1/day"',
  'Multitalented':'Section=combat Note="+1 Class Feat (multiclass dedication)"',
  'Unconventional Expertise':'Section=combat Note="Attack Expert (%V)"',

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
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May retain 1 Hit Point when brought to 0 Hit Points 1/%V"',
  'Orc Sight':'Section=feature Note="Has the Darkvision feature"',
  'Orc Superstition':'Action=1 Section=save Note="May gain +1 vs. magic"',
  'Orc Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Falchion; Greataxe)/Treats orc weapons as one category simpler",' +
      '"Has access to uncommon orc weapons"',
  'Orc Weapon Carnage':
    'Section=combat ' +
    'Note="Critical hits with a falchion, greataxe, or orc weapon inflict its critical specialization effect"',
  'Victorious Vigor':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May gain %{constitutionModifier} temporary Hit Points for 1 rd when foe drops"',
  'Pervasive Superstition':'Section=save Note="+1 vs. magic"',
  'Incredible Ferocity':'Section=combat Note="Increased Orc Ferocity effects"',
  'Orc Weapon Expertise':
    'Section=combat ' +
    'Note="Attack Expert (Falchion; Greataxe; Orc Weapons)"',

  // Backgrounds
  'Martial Focus':'Section=feature Note="1 selection"',
  'Scholarly Tradition':'Section=feature Note="1 selection"',

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
  'Alchemy':'Section=feature Note="Has the Alchemical Crafting feature"',
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
    'Note="May create %{level+(levels.Alchemist?intelligenceModifier:0)} batches of infused reagents each day"',
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
    'Action=Free ' +
    'Section=combat ' +
    'Note="May regain the effects of a mutagen consumed earlier in the day for 1 min 1/day"',
  'Mutagenist':'Section=feature Note="Has the Mutagenic Flashback feature"',
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
    'Action=1 ' +
    'Section=skill ' +
    'Note="May use batches of infused reagents to create %V alchemical %{skillNotes.quickAlchemy==1?\'item\':\'items\'} of up to level %{level} for 1 turn"',
  'Research Field':
    'Section=feature,skill ' +
    'Note=' +
      '"1 selection",' +
      '"Using Advanced Alchemy creates 3 signature items from research field"',
  'Weapon Specialization':
    'Section=combat ' +
    'Note="+%V/+%{combatNotes.weaponSpecialization*1.5}/+%{combatNotes.weaponSpecialization*2} HP damage with expert/master/legendary weapon proficiency"',

  'Alchemical Familiar':'Section=feature Note="Has the Familiar feature"',
  'Alchemical Savant':
    'Section=skill ' +
    'Note="May use Crafting to Identify Alchemy as a single action/+2 to Identify known formulas; critical failures on known formulas are normal failures"',
  'Far Lobber':'Section=combat Note="Bombs have 30\' range"',
  'Quick Bomber':'Action=1 Section=combat Note="May draw and throw a bomb"',
  'Poison Resistance':
    'Section=save Note="Has poison resistance %{level//2}/+1 saves vs. poison"',
  'Revivifying Mutagen':
    'Section=combat ' +
    'Note="May use 1 action to end mutagen effects and regain 1d6 Hit Points per 2 levels of the mutagen"',
  'Smoke Bomb':
    'Action=Free ' +
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
    'Action=Free ' +
    'Section=skill ' +
    'Note="May create a single elixir that has the effects of two elixirs of up to level %{level-2}"',
  'Debilitating Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="May create bombs up to level %{level-2} that also inflict dazzled, deafened, flat-footed, or -5 Speed (DC %{classDifficultyClass.Alchemist} Fort negates)"',
  'Directional Bombs':
    'Section=combat Note="May restrict bomb splash to a 15\' cone"',
  'Feral Mutagen':
    'Section=combat,skill ' +
    'Note=' +
      '"Consuming a bestial mutagen gives claws and jaws the deadly d10 trait; may also increase AC penalty to -2 to increase claws and jaws damage by 1 die step",' +
      '"Consuming a bestial mutagen adds item bonus to Intimidation"',
  'Sticky Bomb':
    'Action=Free ' +
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
    'Note="May create bombs up to level %{level-2} that also inflict clumsy 1, enfeebled 1, stupefied 1, or -10 Speed (DC %{classDifficultyClass.Alchemist} Fort negates)"',
  'Merciful Elixir':
    'Action=Free ' +
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
    'Note="May create bombs up to level %{level-2} that also inflict enfeebled 2, stupefied 2, or -15 Speed (DC %{classDifficultyClass.Alchemist} Fort negates) or a lesser condition that requires a critical success to negate"',
  'Eternal Elixir':
    'Section=skill ' +
    'Note="May extend indefinitely the duration of an elixir of up to level %{level//2}"',
  'Exploitive Bomb':
    'Action=Free ' +
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
    'Action=1 ' +
    'Section=combat ' +
    'Note="May throw a bomb up to 60\' that affects all creatures in a 30\' radius (Ref negates)"',
  'Perfect Mutagen':
    'Section=skill Note="Does not suffer drawbacks from consuming mutagens"',

  // Barbarian
  'Armor Of Fury':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Unarmored Defense)"',
  'Barbarian Feats':'Section=feature Note="%V selections"',
  'Barbarian Skills':
    'Section=skill Note="Skill Trained (Athletics; Choose %V from any)"',
  'Bestial Rage':'Section=combat Note="%V inflict%{combatNotes.bestialRage=~\'s$\'?\'\':\'s\'} 1d%{level>=7?12:10}%1 HP%2 during rage"',
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
    'Action=Free ' +
    'Section=combat ' +
    'Note="May use a rage action as a free action when entering rage"',
  'Quick Rage':'Section=combat Note="May re-enter rage after 1 turn"',
  'Rage':
    'Action=1 ' +
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

  'Acute Vision':
    'Section=feature Note="Has the Darkvision feature during rage"',
  'Moment Of Clarity':
    'Action=1 ' +
    'Section=combat ' +
    'Note="During rage, may use concentration actions for the remainder of the turn"',
  'Raging Intimidation':
    'Section=skill,skill,skill ' +
    'Note=' +
      '"Has the Intimidating Glare feature",' +
      '"May use Demoralize during rage",' +
      '"Has the Scare To Death feature"',
  'Raging Thrower':
    'Section=combat ' +
    'Note="+%{combatNotes.rage} HP thrown weapon damage during rage/Brutal Critical and Devastator effects apply to thrown weapons"',
  'Sudden Charge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make a melee Strike after a double Stride"',
  'Acute Scent':'Section=skill Note="R30\' imprecise scent"',
  'Furious Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May gain additional damage on a Strike during rage; suffers end of rage and fatigue until 10 min rest"',
  'No Escape':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May Stride along with a retreating foe"',
  'Second Wind':
    'Section=combat ' +
    'Note="May immediately re-enter rage; suffers fatigue afterwards until 10 min rest"',
  'Shake It Off':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May reduce a frightened condition by 1 and reduce a sickened condition by 1/2/3 with a fail/success/critical success on a Fortitude save during rage"',
  'Fast Movement':'Section=combat Note="+10 Speed during rage"',
  'Raging Athlete':
    'Section=skill ' +
    'Note="Gains %{speed}\' climb and swim Speed, -10 jump DC, and 5\'/%{speed>=30?20:15}\' vertical/horizontal Leap during rage"',
  'Swipe':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May attack 2 adjacent foes with a single Strike"',
  'Wounded Rage':
    'Action=Reaction Section=combat Note="May enter rage after taking damage"',
  'Animal Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Unarmored Defense)",' +
      '"+%{($\'features.Greater Juggernaut\'?3:2)-(dexterityModifier-3>?0)} AC in no armor during rage"',
  'Attack Of Opportunity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May make a melee Strike on foe that uses a manipulate or move action, makes a ranged Strike, or leaves a square while moving"',
  'Brutal Bully':
    'Section=combat ' +
    'Note="Successful Disarm, Grapple, Shove, or Trip inflicts %{strengthModifier}B HP damage during rage"',
  'Cleave':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May Strike an adjacent foe after killing or knocking a foe unconscious"',
  "Dragon's Rage Breath":
    'Action=2 ' +
    'Section=combat ' +
    'Note="May use breath to inflict %{level}d6 damage in a 30\' cone or 60\' line 1/rage (Ref negates; half distance and damage for a 2nd breath use within 1 hour)"',
  "Giant's Stature":
    'Action=1 ' +
    'Section=combat ' +
    'Note="May grow to Large size, gaining +5\' reach and suffering clumsy 1, until rage ends"',
  "Spirits' Interference":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Foe ranged Strikes require a DC 5 flat check until rage ends"',
  'Animal Rage':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May use <i>Animal Form</i> effects to transform into spirit animal at will"',
  'Furious Bully':'Section=combat Note="+2 Athletics for attacks during rage"',
  'Renewed Vigor':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May gain %{level//2+constitutionModifier} temporary Hit Points"',
  'Share Rage':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' May give an ally the effects of Rage 1/rage"',
  'Sudden Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make a Strike during a Leap, High Jump, or Long Jump"',
  'Thrash':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May inflict %{strengthModifier+combatNotes.rage}B HP + specialization damage to grabbed foe (Fort negates)"',
  'Come And Get Me':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May suffer flat-footed and +2 HP foe damage to gain +%{constitutionModifier} temporary Hit Points from a successful Strike (critical success +%{constitutionModifier*2}) on a successful attacker until rage ends"',
  'Furious Sprint':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May Stride %{speed*5}\' in a straight line/May use an additional action to Stride %{speed*8}\'"',
  'Great Cleave':
    'Section=combat ' +
    'Note="May continue to Cleave adjacent foes as long as Strikes incapacitate"',
  'Knockback':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May shove foe 5\' after a successful Strike"',
  'Terrifying Howl':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Successful Intimidate Demoralizes multiple foes"',
  "Dragon's Rage Wings":
    'Action=1 Section=combat Note="May fly %{speed}\'/rd during rage"',
  'Furious Grab':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May automatically grab foe after a successful Strike"',
  "Predator's Pounce":
    'Action=1 ' +
    'Section=combat ' +
    'Note="May Strike after moving %{speed}\' in light or no armor"',
  "Spirit's Wrath":
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a R120\' +%{$\'trainingLevel.Martial Weapons\'*2+level+strengthModifier+2} spirit Strike that inflicts 4d8+%{constitutionModifier} HP negative or positive damage; a critical hit also inflicts frightened 1"',
  "Titan's Stature":
    'Section=combat ' +
    'Note="May grow to Huge size, gaining +10\' reach and suffering clumsy 1, until rage ends"',
  'Awesome Blow':
    'Section=combat ' +
    'Note="A successful Athletics vs. Fortitude with Knockback Shoves and Trips foe"',
  "Giant's Lunge":
    'Action=1 ' +
    'Section=combat ' +
    'Note="May extend reach of melee weapons and unarmed attacks to 10\' until rage ends"',
  'Vengeful Strike':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May use Come And Get Me to make a Strike when hit by a Strike"',
  'Whirlwind Strike':
    'Action=3 Section=combat Note="May Strike each foe within reach"',
  'Collateral Thrash':
    'Section=combat ' +
    'Note="May affect another adjacent foe (DC %{classDifficultyClass.Barbarian} Ref negates) with a successful Thrash"',
  'Dragon Transformation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May use <i>Dragon Form</i> effects%{level>=18?\', with +20 fly Speed, +12 dragon Strikes, and +14 HP breath weapon damage,\':\'\'} during rage"',
  'Reckless Abandon':
    'Action=Free ' +
    'Section=feature ' +
    'Note="When reduced to %{hitPoints//2} or fewer Hit Points during rage, may suffer -2 AC and -1 saves to gain +2 attacks"',
  'Brutal Critical':
    'Section=combat ' +
    'Note="Critical melee hits inflict +1 damage die and 2 damage dice bleed damage"',
  'Perfect Clarity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May end rage for a +2 reroll on a failed attack or Will save"',
  'Vicious Evisceration':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May use a Strike that inflicts drained 1 (critical success drained 2)"',
  'Contagious Rage':
    'Section=combat ' +
    'Note="May use Share Rage unlimited times, also sharing instinct and specialization abilities"',
  'Quaking Stomp':
    'Action=1 Section=magic Note="May use <i>Earthquake</i> effects 1/10 min"',

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
  'Composition Spells':
    'Section=magic ' +
    'Note="Has a focus pool with 1 Focus Point/Knows the <i>Counter Performance</i> and <i>Inspire Courage</i> spells"',
  'Enigma':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Bardic Lore feature",' +
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
  'Maestro':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Lingering Composition feature",' +
      '"Knows the <i>Soothe</i> spell"',
  'Magnum Opus':'Section=magic Note="Knows 2 10th-level occult spells"',
  'Master Spellcaster':'Section=magic Note="Spell Master (%V)"',
  'Muses':'Section=feature Note="1 selection"',
  'Occult Spellcasting':
    'Section=magic Note="May learn spells from the occult tradition"',
  'Polymath':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Versatile Performance feature",' +
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
  'Reach Spell':'Action=1 Section=magic Note="May extend spell range by 30\'"',
  'Versatile Performance':
    'Section=skill ' +
    'Note="May use Performance in place of Deception, Diplomacy, and Intimidation"',
  'Cantrip Expansion':
    // TODO
    // Bard: add two additional cantrips from your spell list to your repertoire
    // Cleric: can prepare 2 additional cantrips each day
    // Sorcerer: add two additional cantrips from your spell list to your repertoire
    // Wizard: can prepare 2 additional cantrips each day
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
  'Multifarious Muse (Enigma)':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Enigma feature/+1 Class Feat",' +
      '"May learn enigma muse feats"',
  'Multifarious Muse (Maestro)':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Maestro feature/+1 Class Feat",' +
      '"May learn maestro muse feats"',
  'Multifarious Muse (Polymath)':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Polymath feature/+1 Class Feat",' +
      '"May learn polymath muse feats"',
  'Inspire Defense':
    'Section=magic Note="Knows the <i>Inspire Defense</i> cantrip"',
  'Melodious Spell':
    'Action=1 ' +
    'Section=skill ' +
    'Note="May hide spellcasting from observers with a successful Performance vs. Perception"',
  'Triple Time':'Section=magic Note="Knows the <i>Triple Time</i> cantrip"',
  'Versatile Signature':
    'Section=magic Note="May replace 1 signature spell each day"',
  'Dirge Of Doom':'Section=magic Note="Knows the <i>Dirge Of Doom</i> cantrip"',
  'Harmonize':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May have 2 composition spells active simultaneously"',
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
    'Section=magic Note="Knows the <i>House Of Imaginary Walls</i> cantrip"',
  'Quickened Casting':
    'Action=Free ' +
    'Section=magic ' +
    'Note="May reduce the time required to cast a spell of level %1 or lower by 1 action 1/day"',
  'Unusual Composition':
    'Action=1 ' +
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
    'Action=1 Section=skill Note="May Recall Knowledge 5 times"',
  'Effortless Concentration':
    'Action=Free Section=magic Note="May extend the duration of 1 spell"',
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
      // TODO: give details of effects for current armor (pg 275)
      '"May use the specialization effects of medium and heavy armor"',
  'Armor Mastery':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Champion Expertise':
    'Section=combat,magic ' +
    'Note=' +
      '"Class Expert (Champion)",' +
      '"Spell Expert (Divine)"',
  'Champion Feats':'Section=feature Note="%V selections"',
  'Champion Key Ability':'Section=feature Note="1 selection"',
  'Champion Mastery':
    'Section=combat,magic ' +
    'Note=' +
      '"Class Master (Champion)",' +
      '"Spell Master (Divine)"',
  'Champion Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  "Champion's Code":'Section=feature Note="1 selection"',
  "Champion's Reaction":'Section=feature Note="Has the %V feature"',
  'Deific Weapon':
    'Section=combat,combat ' +
    'Note=' +
      '"Has access to deity weapon (%{deityWeapon})",' +
      '"+1 damage die step on %V"',
  'Deity And Cause':
    'Section=combat,feature,magic,skill ' +
    'Note=' +
      '"Attack Trained (%V)",' +
      '"1 selection",' +
      '"Has access to %V spells",' +
      '"Skill Trained (%V)"',
  'Devotion Spells':
    'Section=magic Note="Has a focus pool with 1 Focus Point"',
  'Divine Ally':
    'Section=feature ' +
    'Note="%V selection%{featureNotes.divineAlly==1?\'\':\'s\'}"',
  'Divine Ally (Blade)':
    'Section=combat ' +
    'Note="May apply choice of <i>disrupting</i>, <i>ghost touch</i>, <i>returning</i>, or <i>shifting</i> to a weapon chosen each day; also gains critical specialization effect"',
  'Divine Ally (Shield)':
    'Section=combat Note="+2 shield hardness/+50% shield Hit Points"',
  'Divine Ally (Steed)':
    'Section=feature Note="Has a mount as a young animal companion"',
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
    'Note="R15\' Retributive Strike allows allies a %{combatNotes.auraOfVengeance?-2:-5} melee Strike against target"',
  'Exalt (Redeemer)':
    'Section=combat ' +
    'Note="R15\' May use Glimpse Of Redemption to grant allies %{level} damage resistance"',
  'Glimpse Of Redemption':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R15\' May negate damage to a struck ally or grant the ally damage resistance %{2+level} and inflict enfeebled 2 on triggering foe for 1 rd (foe\'s choice)"',
  // Greater Weapon Specialization as above
  "Hero's Defiance":
    'Section=magic Note="Knows the <i>Hero\'s Defiance</i> spell"',
  // Juggernaut as above
  'Legendary Armor':
    'Section=combat ' +
    'Note="Defense Legendary (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Liberating Step':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R15\' May grant an ally damage resistance %{2+level}, an Escape action or save from a restraint, and a Step"',
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
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R15\' When an ally is damaged, may grant them damage resistance %{level+2}, plus make a melee Strike against the triggering foe if within reach"',
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

  'Ranged Reprisal':
    'Section=combat ' +
    'Note="May make a Retributive Strike using a ranged Strike or a Step and a melee Strike"',
  'Unimpeded Step':
    'Section=combat ' +
    'Note="Liberating Step target may Step normally in any terrain"',
  'Weight Of Guilt':
    'Section=combat ' +
    'Note="May make Glimpse Of Redemption target stupefied instead of enfeebled"',
  'Divine Grace':
    'Action=Reaction Section=combat Note="May gain +2 save vs. a spell"',
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
    'Action=1 ' +
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> may also counteract choice of fear or paralysis"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Section=magic ' +
    'Note="+1 Focus Points/Knows the <i>Litany Against Wrath</i> spell"',
  'Loyal Warhorse':
    'Section=feature Note="Mount is mature and will never attack self"',
  'Shield Warden':
    'Section=combat Note="May use Shield Block to protect an adjacent ally"',
  'Smite Evil':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May have Blade ally inflict +4 HP good (master proficiency +6 HP) vs. target for 1 rd, extended as long as the target attacks an ally"',
  'Greater Mercy':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> may also counteract blinded, deafened, sickened, or slowed"',
  'Heal Mount':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> on mount restores 10 Hit Points +10 Hit Points/heightened level"',
  'Quick Shield Block':
    'Section=combat ' +
    'Note="May use an additional Reaction for a Shield Block 1/turn"',
  'Second Ally':'Section=feature Note="+1 selection"',
  'Sense Evil':
    'Section=feature ' +
    'Note="Can detect the presence of powerful evil auras (Deception vs. Perception negates)"',
  'Devoted Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Imposing Destrier':
    'Section=feature ' +
    'Note="Mount is a nimble or savage animal companion and may Stride or Strike without a command"',
  'Litany Against Sloth':
    'Section=magic ' +
    'Note=' +
      '"+1 Focus Points/Knows the <i>Litany Against Sloth</i> spell"',
  'Radiant Blade Spirit':
    'Section=combat ' +
    'Note="May choose <i>flaming</i> or <i>anarchic</i>, <i>axiomatic</i>, <i>holy</i>, or <i>unholy</i> property for Blade Ally"',
  'Shield Of Reckoning':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May apply Shield Block and Champion\'s Reaction with an ally"',
  'Affliction Mercy':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> may also counteract a curse, disease, or poison"',
  'Aura Of Faith':
    'Section=combat ' +
    'Note="R15\' All self Strikes and the first Strike of each ally each rd inflict +1 HP good damage vs. evil creatures"',
  'Blade Of Justice':
    'Action=2 ' +
    'Section=combat Note="May add two extra damage dice on a Strike vs. an evil foe and convert all damage to good%{features.Paladin ? \', as well as inflicting Retributive Strike effects\' : \'\'}"',
  "Champion's Sacrifice":
    'Section=magic ' +
    'Note="+1 Focus Points/Knows the <i>Champion\'s Sacrifice</i> spell"',
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
    'Note="May use an additional Reaction for Champion\'s Reaction 1/turn"',
  'Litany Of Righteousness':
    'Section=magic ' +
    'Note="+1 Focus Points/Knows the <i>Litany Of Righteousness</i> spell"',
  'Wyrmbane Aura':
    'Section=save ' +
    'Note="R15\' Grants self and allies resistance %{charismaModifier} to acid, cold, electricity, fire, and poison (resistance %{level//2} from dragons)"',
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
      '"+1 Class Feat (Domain Initiate feat)",' +
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
    'Section=magic Note="May learn spells from the divine tradition"',
  'Doctrine':'Section=feature Note="1 selection"',
  'Harmful Font':'Section=magic Note="+%{charismaModifier+1} D%V slots"',
  'Healing Font':'Section=magic Note="+%{charismaModifier+1} D%V slots"',
  // Lightning Reflexes as above
  'Miraculous Spell':'Section=magic Note="Has 1 10th-level spell slot"',
  // Resolve as above
  'Warpriest':
    'Section=combat,combat,feature,feature,magic,save,save ' +
    'Note=' +
      '"Defense %V (Light Armor; Medium Armor)%{level>=3?\'/Attack Trained (Martial Weapons)\':\'\'}%{level>=7?\'Attack Expert (%1; Simple Weapons; Unarmed Attacks)\':\'\'}",' +
      '"May use critical specialization effects of %{deityWeapon}",' +
      '"Has the Shield Block feature",' +
      '"Has the Deadly Simplicity feature",' +
      '"Spell %V (Divine)",' +
      '"Save %V (Fortitude)",' +
      '"Successes on Fortitude saves are critical successes"',
  // Weapon Specialization as above

  'Deadly Simplicity':'Section=combat Note="+1 damage die step on %V"',
  // TODO Implement?
  'Harming Hands':'Section=magic Note="<i>Harm</i> die type increases to d10"',
  // TODO Implement?
  'Healing Hands':'Section=magic Note="<i>Heal</i> die type increases to d10"',
  'Holy Castigation':
    'Section=magic Note="May use <i>Heal</i> to damage fiends"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    'Section=magic ' +
    'Note="Casting <i>Heal</i> on another creature restores Hit Points to self equal to the spell level"',
  'Emblazon Armament':
    'Section=magic ' +
    'Note="10 min process gives target shield +1 Hardness or weapon +1 HP damage"',
  'Sap Life':
    'Section=magic ' +
    'Note="Casting <i>Harm</i> on another creature restores Hit Points to self equal to the spell level"',
  'Turn Undead':
    'Section=magic ' +
    'Note="Critical failure by undead up to level %{level} damaged by <i>Heal</i> inflicts fleeing for 1 rd"',
  'Versatile Font':
    'Section=magic ' +
    'Note="May use a font slot to prepare either <i>Harm</i> or <i>Heal</i>"',
  'Channel Smite':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May add the effects of <i>Heal</i> or <i>Harm</i> to a melee Strike"',
  'Command Undead':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May use <i>Harm</i> to control undead up to level %{level-3} for 1 min (Will negates; critical failure extends to 1 hour)"',
  'Directed Channel':
    'Section=magic ' +
    'Note="May cast an area <i>Harm</i> or <i>Heal</i> in a 60\' cone"',
  'Improved Communal Healing':
    'Section=magic ' +
    'Note="May give additional Hit Points from Communal Healing to another"',
  'Necrotic Infusion':
    'Action=1 ' +
    'Section=magic ' +
    'Note="<i>Harm</i> cast on an undead allows the target to inflict +1d6 negative HP (5th level spell +2d6 HP; 8th level +3d6 HP) with first melee Strike in next rd"',
  'Cast Down':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May modify <i>Harm</i> or <i>Heal</i> to also inflict knocked prone (target critical fail also inflicts -10 Speed for 1 min)"',
  'Divine Weapon':
    'Action=Free ' +
    'Section=magic ' +
    'Note="May cast a spell that also causes a wielded weapon to inflict +1d4 HP force or +1d6 HP alignment for the remainder of turn"',
  'Selective Energy':
    'Section=magic ' +
    'Note="May choose %{charismaModifier>?1} creatures to be unaffected when casting an area <i>Harm</i> or <i>Heal</i>"',
  // Steady Spellcasting as above
  'Align Armament (Chaotic)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May touch a weapon to have it inflict +1d6 HP chaotic for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Align Armament (Evil)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May touch a weapon to have it inflict +1d6 HP evil for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Align Armament (Good)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May touch a weapon to have it inflict +1d6 HP good for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Align Armament (Lawful)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May touch a weapon to have it inflict +1d6 HP lawful for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Channeled Succor':
    'Section=magic ' +
    'Note="May cast <i>Remove Curse</i>, <i>Remove Disease</i>, <i>Remove Paralysis</i>, or <i>Restoration</i> in place of a prepared <i>Heal</i>"',
  'Cremate Undead':
    'Section=magic ' +
    'Note="<i>Heal</i> cast upon undead inflicts persistent fire damage equal to the spell level"',
  'Emblazon Energy':
    'Section=magic ' +
    'Note="May use Emblazon Armament on a shield to give a save bonus and Shield Block vs. chosen energy type, and having a matching domain spell also gives it +%{level//2} resistance; may use on a weapon to give it +1d4 HP chosen energy type, or +1d6 HP with a matching domain spell"',
  'Castigating Weapon':
    'Section=magic ' +
    'Note="Damaging a fiend with <i>Heal</i> gives self weapons bonus good damage vs. fiends equal to half the spell level for 1 rd"',
  'Heroic Recovery':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May cast a single-target <i>Heal</i> that also gives the target +5 Speed, +1 attack, and +1 HP damage for 1 rd"',
  'Improved Command Undead':
    'Section=magic ' +
    'Note="Target success/failure/critical failure vs. Command Undead gives self control for 1 rd/10 min/24 hours"',
  'Replenishment Of War':
    'Section=combat Note="Successful Strike with %{deityWeapon} gives self %{level//2} temporary Hit Points (critical hit %{level} temporary Hit Points) for 1 rd"',
  'Defensive Recovery':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May cast a single-target <i>Heal</i> that also gives +2 AC and saves for 1 rd"',
  'Domain Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Emblazon Antimagic':
    'Section=magic ' +
    'Note="May use Emblazon Armament on a shield to give a bonus on saves vs. magic and allow Shield Block vs. spells, or on a weapon to have a critical hit also counteract a spell using 1/2 the wielder\'s level"',
  'Shared Replenishment':
    'Section=combat ' +
    'Note="R10\' May give temporary Hit Points from Replenishment Of War to an ally"',
  "Deity's Protection":
    'Section=magic ' +
    'Note="Casting a domain spell gives self resistance equal to the spell level to all damage for 1 rd"',
  'Extend Armament Alignment':
    'Section=combat Note="Increased Align Armament effects"',
  'Fast Channel':
    'Section=magic ' +
    'Note="May use 2 actions to cast a 3-action <i>Harm</i> or <i>Heal</i>"',
  'Swift Banishment':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="May apply <i>Banishment</i> effects with a critical hit"',
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
    'Action=1 ' +
    'Section=magic ' +
    'Note="May have a 2-action, single-target <i>Harm</i> or <i>Heal</i> also cause 1-action effects on an adjacent creature"',
  'Improved Swift Banishment':
    'Section=magic ' +
    'Note="May sacrifice any 5th level or higher prepared spell to inflict Swift Banishment with a -2 save penalty"',
  "Avatar's Audience":
    'Section=magic ' +
    'Note="May speak for deity, <i>Commune</i> without cost, and <i>Plane Shift</i> to deity 1/day"',
  'Maker Of Miracles':'Section=magic Note="+1 10th level spell slot"',
  'Metamagic Channel':
    'Action=Free ' +
    'Section=magic ' +
    'Note="May apply a metamagic action to <i>Harm</i> and <i>Heal</i>"',

  // Druid
  // Alertness as above
  'Animal':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Animal Companion feature",' +
      '"Knows the <i>Heal Animal</i> spell",' +
      '"Skill Trained (Athletics)"',
  'Druid Feats':'Section=feature Note="%V selections"',
  'Druid Skills':
    'Section=skill Note="Skill Trained (Nature; Choose %V from any)"',
  'Druidic Language':'Section=skill Note="Knows a druid-specific language"',
  'Druidic Order':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool with 1 Focus Point"',
  'Druid Weapon Expertise':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  // Expert Spellcaster as above
  // Great Fortitude as above
  'Leaf':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Leshy Familiar feature",' +
      '"Knows the <i>Goodberry</i> spell/+1 Focus Points",' +
      '"Skill Trained (Diplomacy)"',
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Master Spellcaster as above
  // Medium Armor Expertise as above
  'Primal Hierophant':'Section=magic Note="Has 1 10th-level spell slot"',
  'Primal Spellcasting':
    'Section=magic Note="May learn spells from the primal tradition"',
  // Resolve as above
  // Shield Block as below
  'Storm':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Storm Born feature",' +
      '"Knows the <i>Tempest Surge</i> spell/+1 Focus Points",' +
      '"Skill Trained (Acrobatics)"',
  // Weapon Specialization as above
  'Wild':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Wild Shape feature",' +
      '"Knows the <i>Wild Morph</i> spell",' +
      '"Skill Trained (Intimidation)"',
  'Wild Empathy':
    'Section=skill ' +
    'Note="May use Diplomacy with animals to Make an Impression and to make simple Requests"',

  'Animal Companion':'Section=feature Note="Has a young animal companion%{$\'features.Hunt Prey\'?\' that gains Hunt Prey\'+($\'features.Masterful Companion\'?\' and Flurry, Precision, or Outwit\':\'\')+\' effects\':\'\'}"',
  'Leshy Familiar':'Section=feature Note="Has a Tiny plant or fungus familiar"',
  // Reach Spell as above
  'Storm Born':
    'Section=magic,skill ' +
    'Note=' +
      '"Suffers no ranged spell penalties from weather",' +
      '"Suffers no Perception penalties from weather"',
  'Widen Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May increase the effect of a 10\' or greater radius area spell by 5\', the effect of a 15\' or shorter line or cone spell by 5\', and the effect of a longer line or cone spell by 10\'"',
  'Wild Shape':'Section=magic Note="Knows the <i>Wild Shape</i> spell"',
  'Call Of The Wild':
    'Section=magic ' +
    'Note="May spend 10 min to replace a prepared spell with <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> of the same level"',
  'Enhanced Familiar':
    'Section=feature Note="May select 4 familiar or master abilities each day"',
  'Order Explorer (Animal)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Animal order feats"',
  'Order Explorer (Leaf)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Leaf order feats"',
  'Order Explorer (Storm)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Storm order feats"',
  'Order Explorer (Wild)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May learn Wild order feats"',
  // Poison Resistance as above
  'Form Control':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May cast <i>Wild Shape</i> 2 levels lower to retain shape for up to 1 hour"',
  'Mature Animal Companion':
    'Section=feature ' +
    'Note="Animal Companion is a mature companion and may Stride or Strike without a command"',
  'Order Magic (Animal)':
    'Section=magic Note="Knows the <i>Heal Animal</i> spell"',
  'Order Magic (Leaf)':
    'Section=magic Note="Knows the <i>Goodberry</i> spell"',
  'Order Magic (Storm)':
    'Section=magic Note="Knows the <i>Tempest Surge</i> spell"',
  'Order Magic (Wild)':
    'Section=magic Note="Knows the <i>Wild Morph</i> spell"',
  'Thousand Faces':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Small or Medium humanoid"',
  'Woodland Stride':
    'Section=ability ' +
    'Note="May move normally over difficult terrain caused by plants or fungi"',
  'Green Empathy':
    'Section=skill ' +
    'Note="May use Diplomacy with plants and fungi to Make an Impression and to make simple Requests with a +2 bonus"',
  'Insect Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Medium insect; flightless forms last 24 hour"',
  // Steady Spellcasting as above
  'Storm Retribution':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="On a foe critical melee hit, may cast <i>Tempest Surge</i>, pushing foe 5\' (Ref negates; critical failure pushes 10\')"',
  'Ferocious Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Large dinosaur and to gain +1 on Athletics checks"',
  'Fey Caller':
    'Section=magic ' +
    'Note="Knows the <i>Illusory Disguise</i>, <i>Illusory Object</i>, <i>Illusory Scene</i>, and <i>Veil</i> primal spells"',
  'Incredible Companion':
    'Section=feature ' +
    'Note="Animal Companion gains choice of nimble or savage characteristics"',
  'Soaring Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a %{$\'features.Insect Shape\'?\'wasp, \':\'\'}%{$\'features.Ferocious Shape\'?\'pterosaur, \':\'\'}bat or bird and to gain +1 on Acrobatics checks"',
  'Wind Caller':
    'Section=magic ' +
    'Note="Knows the <i>Stormwind Flight</i> spell/+1 Focus Points"',
  'Elemental Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Medium elemental and to gain resistance 5 to fire"',
  'Healing Transformation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May have self polymorph spells restore 1d6 Hit Points per spell level"',
  'Overwhelming Energy':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May cast a spell that ignores resistance %{level} to choice of energy"',
  'Plant Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Large plant and to gain resistance 5 to poison"',
  'Side By Side':
    'Section=combat ' +
    'Note="Self and companion automatically flank a foe adjacent to both"',
  'Dragon Shape':
    'Section=magic ' +
    'Note="May use <i>Wild Shape</i> to change into a Large dragon and to gain resistance 5 to choice of acid, cold, electricity, fire, or poison"',
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
    'Section=feature,magic ' +
    'Note=' +
      '"Has plant, not humanoid, trait",' +
      '"May use <i>Tree Shape</i> effects at will; tree form raises AC to 30, allows 10 min in sunlight to restore half Hit Points, and allows daily rest to restore all Hit Points and remove all non-permanent conditions, poisons, and diseases"',
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
    'Action=1 ' +
    'Section=magic ' +
    'Note="May cast instantaneous spells of 5th level and lower without expending a spell slot"',
  'True Shapeshifter':
    'Action=2 ' +
    'Section=magic ' +
    'Note="May change shapes during <i>Wild Shape</i>/May <i>Wild Shape</i> into a kaiju%{$\'features.Plant Shape\'?\' or green man\':\'\'} 1/day"',

  // Fighter
  // Armor Expertise as above
  // Armor Mastery as above
  // Attack Of Opportunity as above
  'Battlefield Surveyor':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Perception for initiative",' +
      '"Perception Master"',
  'Bravery':
    'Section=save,save ' +
    'Note=' +
      '"Save Expert (Will)",' +
      '"Successes on Will saves vs. fear are critical saves/Reduces value of frightened condition by 1"',
  'Combat Flexibility':
    'Section=combat ' +
    'Note="May use a chosen fighter feat of up to 8th level each day"',
  // Evasion as above
  'Fighter Expertise':'Section=feature Note="Class Expert (Fighter)"',
  'Fighter Feats':'Section=feature Note="%V selections"',
  'Fighter Key Ability':'Section=feature Note="1 selection"',
  'Fighter Skills':
    'Section=skill ' +
    'Note="Skill Trained (Choose 1 from Acrobatics, Athletics; Choose %V from any)"',
  'Fighter Weapon Mastery':
    'Section=combat ' +
    'Note="Attack Master with simple and martial weapons and Attack Expert with advanced weapons of chosen group/May use critical specialization effects of all weapons with master proficiency"',
  // Greater Weapon Specialization as above
  'Improved Flexibility':
    'Section=combat ' +
    'Note="May use a chosen fighter feat of up to 14th level each day"',
  // Juggernaut as above
  // Shield Block as below
  'Versatile Legend':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Master (Advanced Weapons)/Class Master (Fighter)"',
  'Weapon Legend':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Expert (Advanced Weapons)",' +
      '"Attack Legendary in simple and martial weapons and Attack Master in advanced weapons of chosen group"',

  // Weapon Specialization as above
  'Double Slice':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make melee Strikes with two weapons simultaneously"',
  'Exacting Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a Strike that does not count toward multiple attack penalty on failure"',
  'Point-Blank Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance negates volley penalty from a ranged volley weapon and gives +2 attack at close range with a ranged non-volley weapon"',
  'Power Attack':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make a melee Strike that inflicts %{level<10?1:level<18?2:3} extra dice damage and counts as two Strikes for multiple attack penalty"',
  'Reactive Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May make a Raise a Shield action when hit by a melee Strike"',
  'Snagging Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a Strike that inflicts flat-footed on target for 1 rd if successful"',
  // Sudden Charge as above
  'Aggressive Block':
    'Action=Free ' +
    'Section=combat ' +
    'Note="May use Shield Block to move a foe 5\' or cause them to become flat-footed (foe\'s choice) as a free action"',
  'Assisting Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Make make a ranged Strike that gives the next ally attack on the target within 1 rd +1 attack (critical success +2) if successful"',
  'Brutish Shove':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a two-handed melee Strike that inflicts flat-footed until end of turn; success allows subsequent Shove"',
  'Combat Grab':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a melee Strike with a one-handed weapon that allows grabbing the foe with the other hand if successful for 1 rd or until foe Escapes"',
  'Dueling Parry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May gain +2 AC when wielding a one-handed weapon with the other hand free"',
  'Intimidating Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make a melee Strike that inflicts frightened 1 if successful (critical hit frightened 2)"',
  'Lunge':'Action=1 Section=combat Note="May make a +5\' melee Strike"',
  'Double Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make two ranged Strikes against two foes, suffering a -2 attack penalty on each"',
  'Dual-Handed Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May use free hand to increase the damage from a 1-handed weapon with the 2-handed trail by its number of damage dice or a weapon without that trait by one step"',
  'Knockdown':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May follow a successful Strike with an Athletics check to Trip"',
  'Powerful Shove':
    'Section=combat ' +
    'Note="May use Aggressive Block and Brutish Shove on foes two sizes larger/Shoved creatures take %{strengthModifier>?1} damage from hitting a barrier"',
  'Quick Reversal':
    'Action=1 Section=combat Note="May Strike two foes flanking self"',
  'Shielded Stride':
    'Section=combat ' +
    'Note="May Stride at half Speed with shield raised without triggering Reactions"',
  // Swipe as above
  'Twin Parry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May parry with two weapons to gain +1 AC for 1 rd (+2 AC if either weapon has the parry trait)"',
  'Advanced Weapon Training':
    'Section=combat ' +
    'Note="Has proficiency with advanced weapons in chosen group equal to martial weapons"',
  'Advantageous Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a Strike on a grabbed, prone, or restrained foe that inflicts +damage dice HP damage (+damage dice + 2 HP if wielded two-handed), even on failure"',
  'Disarming Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +1 to Disarm and +2 vs. Disarm and allows Disarming foes two sizes larger when wielding a one-handed weapon with the other hand free"',
  'Furious Focus':
    'Section=combat ' +
    'Note="Two-handed power attacks count as single attacks for multiple attack penalty"',
  "Guardian's Deflection":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May give an adjacent ally +2 AC when wielding a one-handed weapon with the other hand free"',
  'Reflexive Shield':
    'Section=save ' +
    'Note="Raised shield adds shield bonus to Reflex saves"',
  'Revealing Stab':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May leave a piercing weapon embedded in a corporeal concealed or hidden foe to reveal it to others"',
  'Shatter Defenses':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful Strike vs. a frightened foe inflicts flat-footed while frightened condition lasts"',
  // Shield Warden as above
  'Triple Shot':
    'Section=combat ' +
    'Note="May use Double Shot against a single foe/May use 2 actions to make 3 ranged Strikes, suffering a -4 attack penalty on each"',
  'Blind-Fight':
    'Section=combat ' +
    'Note="May attack concealed foes without a prior check and hidden creatures with a DC 5 check/Does not suffer flat-footed with hidden foes"',
  'Dueling Riposte':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="While using Dueling Parry, may Strike or Disarm a foe who critically fails an attack on self"',
  'Felling Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May attack a flying foe; a successful Strike causes it to fall 120\', and a critical hit grounds it for 1 rd"',
  'Incredible Aim':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May gain +2 on a ranged Strike that ignores concealment"',
  'Mobile Shot Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance negates Reactions from ranged Strikes and allows using Attack Of Opportunity with a loaded ranged weapon on an adjacent creature"',
  'Positioning Assault':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May move target 5\' to within reach on a successful Strike with a 2-handed melee weapon"',
  // Quick Shield Block as above
  // Sudden Leap as above
  'Agile Grace':
    'Section=combat ' +
    'Note="Reduces multiple attack penalty with agile weapons to -3/-6"',
  'Certain Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a Strike that inflicts normal damage other than damage dice on failure"',
  'Combat Reflexes':
    'Section=combat ' +
    'Note="May use an additional Reaction to make an Attack Of Opportunity 1/turn"',
  'Debilitating Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make a ranged Strike that slows target for 1 rd"',
  'Disarming Twist':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Make make a Strike with a one-handed melee weapon and the other hand free that inflicts Disarm on success; failure inflicts flat-footed until the end of turn"',
  'Disruptive Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows using Attack Of Opportunity in response to a concentrate action; any successful Strike disrupts"',
  'Fearsome Brute':
    'Section=combat ' +
    'Note="Strikes against frightened foes inflict +frightened value x %{rank.Intimidation>=2?3:2} HP damage"',
  'Improved Knockdown':
    'Section=combat Note="Knockdown automatically inflicts a critical Trip"',
  'Mirror Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May reflect a spell back upon caster with a ranged Strike or spell attack"',
  'Twin Riposte':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="When using Twin Parry, may Strike or Disarm a foe who critically fails a Strike on self"',
  'Brutal Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May end turn with a two-handed Strike that inflicts +%{level>=18?2:1} damage dice, even on failure"',
  'Dueling Dance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +2 AC when wielding a one-handed weapon with a hand free"',
  'Flinging Shove':'Section=combat Note="Aggressive Block moves foe 10\' (critical success 20\') or inflicts flat-footed; Brutish Shove moves foe 10\' (failure 5\', critical success 20\')"',
  'Improved Dueling Riposte':
    'Section=combat ' +
    'Note="May use an additional Reaction to make a Dueling Riposte 1/turn"',
  'Incredible Ricochet':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May follow a ranged Strike with another against the same foe that ignores concealment and cover"',
  'Lunging Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +5\' reach on Attacks Of Opportunity"',
  "Paragon's Guard":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives continuous benefits of Raise a Shield"',
  'Spring Attack':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May Strike a foe after Striding away from another"',
  'Desperate Finisher':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May use a press action after taking the last action in a turn, losing any further Reactions during the turn"',
  'Determination':
    'Action=1 ' +
    'Section=save ' +
    'Note="May end a nonpermanent spell (level %{level/2} Will save) or condition affecting self 1/day"',
  'Guiding Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May move target 10\' to a spot within reach with a successful Strike (failure 5\') when wielding a one-handed weapon with a hand free"',
  'Guiding Riposte':
    'Section=combat ' +
    'Note="May move target 10\' to a spot within reach with a successful Dueling Riposte Strike"',
  'Improved Twin Riposte':
    'Section=combat ' +
    'Note="May use an additional Reaction to make a Twin Riposte 1/turn"',
  'Stance Savant':
    'Action=Free Section=combat Note="May enter a stance during initiative"',
  'Two-Weapon Flurry':
    'Action=1 Section=combat Note="May Strike with two weapons"',
  // Whirlwind Strike as above
  'Graceful Poise':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows Double Slice with an agile weapon to count as one attack"',
  'Improved Reflexive Shield':
    'Section=combat ' +
    'Note="May use Shield Block to protect both self and adjacent allies"',
  'Multishot Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance reduces Double Shot/Triple Shot penalty to -1/-2"',
  'Twinned Defense':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives continuous benefits of Twin Parry"',
  'Impossible Volley':
    'Action=3 ' +
    'Section=combat ' +
    'Note="May make a -2 ranged Strike against all foes in a 10\' radius"',
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
    'Section=combat Note="Unarmed attacks count as adamantine weapons"',
  // Alertness as above
  'Expert Strikes':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  'Flurry Of Blows':
    'Action=1 Section=combat Note="May make 2 Unarmed Strikes 1/turn"',
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
      '"May learn spells from the divine tradition"',
  'Ki Tradition (Occult)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      '"May learn spells from the occult tradition"',
  'Master Strikes':
    'Section=combat Note="Attack Master (Simple Weapons; Unarmed Attacks)"',
  'Metal Strikes':
    'Section=combat ' +
    'Note="Unarmed attacks count as cold iron and silver weapons"',
  'Monk Expertise':
    'Section=combat,magic ' +
    'Note=' +
      '"Class Expert (Monk)",' +
      '"Spell Expert (%V)"',
  'Monk Feats':'Section=feature Note="%V selections"',
  'Monk Key Ability':'Section=feature Note="1 selection"',
  'Monk Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Mystic Strikes':
    'Section=combat Note="Unarmed attacks count as magic weapons"',
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
    'Note="Rolls of less than 10 on first Strike each turn are treated as 10s"',
  'Powerful Fist':
    'Section=combat,combat ' +
    'Note=' +
      '"Fists inflict 1d6 HP damage",' +
      '"Suffers no attack penalty for inflicting lethal damage with unarmed attacks"',
  'Second Path To Perfection':'Section=feature Note="+1 selection"',
  'Third Path To Perfection':'Section=feature Note="1 selection"',
  'Third Path To Perfection (Fortitude)':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Fortitude)",' +
      '"Critical failures on Fortitude saves are normal failures/Takes half damage on failed Fortitude saves"',
  'Third Path To Perfection (Reflex)':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Reflex)",' +
      '"Critical failures on Reflex saves are normal failures/Takes half damage on failed Reflex saves"',
  'Third Path To Perfection (Will)':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Critical failures on Will saves are normal failures/Takes half damage on failed Will saves"',
  // Weapon Specialization as above

  'Crane Stance':
    'Action=1 ' +
    'Section=combat,skill ' +
    'Note=' +
      '"Unarmored stance gives +1 Armor Class and restricts attacks to 1d6B HP hand Unarmed Strikes",' +
      '"Unarmored stance gives -5 jump DC and +2\'/+5\' vertical/horizontal Leap"',
  'Dragon Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows leg Unarmed Strikes that inflict 1d10B HP and ignoring first square of difficult terrain when Striding"',
  'Ki Rush':
    'Section=magic ' +
    'Note="Knows the <i>Ki Rush</i> spell/Has a focus pool with 1 Focus Point"',
  'Ki Strike':
    'Section=magic ' +
    'Note="Knows the <i>Ki Strike</i> spell/Has a focus pool with 1 Focus Point"',
  'Monastic Weaponry':'Section=combat Note="Attack %V (Monk Weapons)"',
  'Mountain Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance gives +%{4-(dexterityModifier-(combatNotes.mountainQuake?2:combatNotes.mountainStronghold?1:0)>?0)} Armor Class, +2 vs. Shove and Trip, and -5 Speed and restricts attacks to 1d8B HP hand Unarmed Strikes"',
  'Tiger Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows 10\' Steps and hand Unarmed Strikes that inflict 1d8S HP, plus 1d4 HP persistent bleed damage on critical success"',
  'Wolf Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows hand Unarmed Strikes that inflict 1d8P HP, with the trip trait when flanking"',
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
    'Note="May inflict stunned 1 with a successful Flurry Of Blows (DC %{classDifficultyClass.Monk} Fort negates; critical failure inflicts stunned 3)"',
  'Deflect Arrow':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May gain +4 Armor Class vs. a physical ranged Strike"',
  'Flurry Of Maneuvers':
    'Section=combat ' +
    'Note="May use Flurry Of Blows to Grapple, Shove, or Trip"',
  'Flying Kick':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May Strike a foe at the end of a Leap or Jump"',
  'Guarded Movement':
    'Section=combat Note="+4 Armor Class vs. movement reactions"',
  'Stand Still':
    'Action=Reaction Section=combat Note="May Strike an adjacent moving foe"',
  'Wholeness Of Body':
    'Section=magic ' +
    'Note="Knows the <i>Wholeness Of Body</i> spell/+1 Focus Points"',
  'Abundant Step':
    'Section=magic Note="Knows the <i>Abundant Step</i> spell/+1 Focus Points"',
  'Crane Flutter':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="While in Crane Stance, may gain +3 Armor Class vs. a melee Strike; a miss allows an immediate -2 Strike"',
  'Dragon Roar':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R15\' Bellowing while in Dragon Stance inflicts frightened 1 on foes 1/1d4 rd (DC %{skillModifiers.Intimidation} Will negates; critical failure inflicts frightened 2); first successful self Strike in the next rd on a frightened foe inflicts +4 HP"',
  'Ki Blast':
    'Section=magic Note="Knows the <i>Ki Blast</i> spell/+1 Focus Points"',
  'Mountain Stronghold':
    'Action=1 ' +
    'Section=combat ' +
    'Note="While in Mountain Stance, may gain +2 Armor Class for 1 rd"',
  'Tiger Slash':
    'Action=2 ' +
    'Section=combat ' +
    'Note="While in Tiger Stance, may inflict +%{level>14?3:2} damage dice and a 5\' push; critical success inflicts +%{strengthModifier} HP persistent bleed damage"',
  'Water Step':'Section=ability Note="May Stride across liquids"',
  'Whirling Throw':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful Athletics vs. a grabbed or restrained foe\'s Fortitude DC allows throwing it %{10+5*strengthModifier}\', inflicting up to %{(10+5*strengthModifier)//10}d6+%{strengthModifier}B HP"',
  'Wolf Drag':
    'Action=2 ' +
    'Section=combat ' +
    'Note="While in Wolf Stance, may inflict 1d12P HP and knocked prone"',
  'Arrow Snatching':
    'Section=combat ' +
    'Note="After a successful Deflect Arrow, may use the projectile to make an immediate ranged Strike"',
  'Ironblood Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows Unarmed Strikes that inflict 1d8B HP and gives resistance %V to all damage"',
  'Mixed Maneuver':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May attempt 2 choices of Grapple, Shove, and Trip simultaneously"',
  'Tangled Forest Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows Unarmed Strikes that inflict 1d8S HP and prevents foes from moving away (DC %{classDifficultyClass.Monk} Reflex, Acrobatics, or Athletics negates)"',
  'Wall Run':
    'Action=1 Section=ability Note="May Stride on vertical surfaces"',
  'Wild Winds Initiate':
    'Section=magic ' +
    'Note="Knows the <i>Wild Winds Stance</i> spell/+1 Focus Points"',
  'Knockback Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May Shove 5\' with a successful Unarmed Strike"',
  'Sleeper Hold':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May use Grapple to inflict clumsy 1 for 1 turn (critical success unconscious for 1 min)"',
  'Wind Jump':
    'Section=magic Note="Knows the <i>Wind Jump</i> spell/+1 Focus Points"',
  'Winding Flow':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May perform 2 choices of Stand, Step, and Stride"',
  'Diamond Soul':'Section=save Note="+1 vs. magic"',
  'Disrupt Ki':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May inflict %{level<18?2:3}d6 HP persistent negative damage and enfeebled 1 with an Unarmed Strike"',
  'Improved Knockback':
    'Section=combat ' +
    'Note="Successful Shove moves 5\' (critical success 10\') and allows following; pushing into an obstacle inflicts %{strengthModifier+(rank.Athletics>3?8:6)}B HP"',
  'Meditative Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Stance Savant as above
  'Ironblood Surge':
    'Action=1 ' +
    'Section=combat,combat ' +
    'Note=' +
      '"Ironblood Stance resistance increases to %V",' +
      '"When in Ironblood Stance, may gain +1 Armor Class for 1 rd"',
  'Mountain Quake':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R20\' Stomp inflicts %{strengthModifier>?0} HP and fall prone (DC %{classDifficultyClass.Monk} Fort HP only) 1/1d4 rd"',
  'Tangled Forest Rake':
    'Action=1 ' +
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
    'Action=2 ' +
    'Section=magic ' +
    'Note="May make a Wild Winds Stance Strike against all creatures in a 30\' cone or 60\' line"',
  'Enlightened Presence':
    'Section=save Note="R15\' Self and allies gain +2 Will vs. mental effects"',
  'Master Of Many Styles':
    'Action=Free ' +
    'Section=combat ' +
    'Note="May enter a stance at the beginning of a turn"',
  'Quivering Palm':
    'Section=magic ' +
    'Note="Knows the <i>Quivering Palm</i> spell/+1 Focus Points"',
  'Shattering Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make an Unarmed Strike that bypasses target resistances and ignores half of target\'s Hardness"',
  'Diamond Fists':
    'Section=combat ' +
    'Note="Unarmed Strikes gain the forceful trait or increase damage by 1 die step"',
  'Empty Body':
    'Section=magic Note="Knows the <i>Empty Body</i> spell/+1 Focus Points"',
  'Meditative Wellspring':
    'Section=magic Note="Refocus restores 3 Focus Points"',
  'Swift River':
    'Action=Free ' +
    'Section=combat ' +
    'Note="May end one Speed status penalty or condition at end of each turn"',
  'Enduring Quickness':
    'Section=combat ' +
    'Note="May use an additional action each rd to Stride, Leap, or Jump"',
  'Fuse Stance':
    'Section=combat ' +
    'Note="Has merged two known stances into a unique new stance that grants the effects of both"',
  'Impossible Technique':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May force a foe reroll on a hit or to gain a reroll on a failed save"',

  // Ranger
  // Evasion as above
  // Greater Weapon Specialization as above
  'Hunt Prey':
    'Action=1 ' +
    'Section=combat,skill ' +
    'Note=' +
      '"Suffers no distance penalty for ranged Strikes in the 2nd range increment against designated creature",' +
      '"+2 Perception to Seek and +2 Survival to Track designated creature"',
  "Hunter's Edge":'Section=feature Note="1 selection"',
  'Flurry':
    'Section=combat ' +
    'Note="Reduces penalty for 2nd/3rd attack on hunted prey to -3/-6 (-2/-4 with an agile weapon)"',
  'Outwit':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 Armor Class vs. hunted prey",' +
      '"+2 Deception, Intimidation, Stealth, and Recall Knowledge checks with hunted prey"',
  'Precision':
    'Section=combat ' +
    'Note="First hit on hunted prey inflicts +%{level<11?1:level<19?2:3}d8 HP precision damage each rd"',
  'Improved Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Reflex)",' +
      '"Critical failures on Reflex saves are normal failures/Suffers half normal damage from failed Reflex saves"',
  'Incredible Senses':'Section=skill Note="Perception Legendary"',
  // Iron Will as above
  // Juggernaut as above
  'Masterful Hunter':
    'Section=combat,combat,skill,skill,skill ' +
    'Note=' +
      '"Class Master (Ranger)",' +
      '"Suffers no distance penalty when attacking hunted prey in the 3rd range increment of a ranged weapon with master proficiency%{features.Flurry?\'/2nd/3rd attacks on hunted prey with master weapon proficiency suffer -2/-4 penalty (agile weapon -1/-2)\':\'\'}%{features.Outwit?\'/+2 Armor Class vs. a hunt prey target with master armor proficiency\':\'\'}%{features.Precision?(level>=19?\'/2nd/3rd hit on hunted prey inflicts +2d8/+1d8 HP precision damage\':\'/2nd hit on hunted prey inflicts +1d8 HP precision damage\'):\'\'}",' +
      '"+4 Perception to Seek hunted prey",' +
      '"+4 Survival to Track hunted prey",' +
      '"+4 Deception, Intimidation, Stealth, and Recall Knowledge checks with hunted prey"',

  // Medium Armor Expertise as above
  "Nature's Edge":
    'Section=combat ' +
    'Note="Foes suffer flat-footed vs. self in natural and snare-imposed difficult terrain"',
  'Ranger Expertise':'Section=combat Note="Class Expert (Ranger)"',
  'Ranger Feats':'Section=feature Note="%V selections"',
  'Ranger Key Ability':'Section=feature Note="1 selection"',
  'Ranger Skills':
    'Section=skill Note="Skill Trained (Nature; Survival; Choose %V from any)"',
  'Ranger Weapon Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"May use critical specialization effects of unarmed attacks and simple and martial weapons when attacking hunted prey"',
  'Second Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Master (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"May rest normally in light or medium armor"',
  'Swift Prey':
    'Section=combat ' +
    'Note="May use Hunt Prey as a free action at the beginning of each turn"',
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
    'Note="Crossbow inflicts +2 HP damage on hunted prey or immediately after reloading; simple crossbow also increases damage die by 1 step"',
  'Hunted Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make two ranged Strikes against hunted prey 1/rd"',
  'Monster Hunter':
    'Section=combat ' +
    'Note="May attempt to Recall Knowledge as part of Hunt Prey action; critical success gives +%V attack to self and allies for 1 rd 1/target/day"',
  'Twin Takedown':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May make a melee Strike with each hand against hunted prey 1/rd"',
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
    'Action=2 ' +
    'Section=combat ' +
    'Note="May make a +2 attack that ignores concealment of hunted prey"',
  'Monster Warden':
    'Section=combat ' +
    'Note="Successful use of Monster Hunter also gives self and allies +%V Armor Class on next attack and +%V on next save vs. hunted prey"',
  'Quick Draw':'Action=1 Section=combat Note="May draw a weapon and Strike"',
  // Wild Empathy as above
  "Companion's Cry":
    'Section=combat ' +
    'Note="May use 2 actions for Command an Animal to give companion an additional action"',
  'Disrupt Prey':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May make an Attack of Opportunity on hunted prey; critical success disrupts its action"',
  'Far Shot':'Section=combat Note="Doubles ranged weapon increments"',
  'Favored Enemy':
    'Section=combat ' +
    'Note="May use Hunt Prey with chosen creature type as a free action during initiative"',
  'Running Reload':
    'Action=1 Section=combat Note="May Reload during Stride, Step, and Sneak"',
  "Scout's Warning":
    'Action=Free Section=combat Note="May give allies +1 initiative"',
  'Snare Specialist':
    'Section=skill ' +
    'Note="Knows the formulas for %{rank.Crafting<3?3:rank.Crafting<4?6:9} snares; may prepare %V each day"',
  // Twin Parry as above
  // Mature Animal Companion as above
  'Quick Snares':'Section=skill Note="May prepare snares with 3 actions"',
  'Skirmish Strike':'Action=1 Section=combat Note="May Step and Strike"',
  'Snap Shot':
    'Section=combat ' +
    'Note="May use a ranged weapon during a Reaction to Strike an adjacent creature"',
  'Swift Tracker':'Section=skill Note="May Track at full Speed%{rank.Survival>=3?\' without hourly Survival checks\':\'\'}%{rank.Survival>=4?\'/May perform other exploration while tracking\':\'\'}"',
  // Blind-Fight as above
  'Deadly Aim':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May suffer -2 ranged Strike penalty vs. hunted prey to gain +%{level<11?4:level<15?6:8} HP damage"',
  'Hazard Finder':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 Armor Class vs. traps",' +
      '"+1 Perception to find traps/Automatic Search to find traps"',
  'Powerful Snares':
    'Section=skill ' +
    'Note="Created snares have a DC of at least %{classDifficultyClass.Ranger}"',
  'Terrain Master':
    'Section=ability ' +
    'Note="May train for 1 hour to temporarily change favored terrain"',
  "Warden's Boon":
    'Action=1 ' +
    'Section=combat ' +
    'Note="May share Hunt Prey benefits with an ally for 1 rd"',
  'Camouflage':
    'Section=skill Note="May Hide and Sneak in natural terrain without cover"',
  // Incredible Companion as above
  'Master Monster Hunter':
    'Section=combat,skill ' +
    'Note=' +
      '"Monster Hunter effects take effect on simple success",' +
      '"May use Nature to Recall Knowledge to identify any creature"',
  'Penetrating Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May Strike both a target and a creature giving it lesser cover"',
  // Twin Riposte as above
  "Warden's Step":
    'Section=skill ' +
    'Note="May include allies in an Avoid Notice action in natural terrain"',
  'Distracting Shot':
    'Section=combat ' +
    'Note="Critical or double hit on hunted prey inflicts flat-footed for 1 rd"',
  'Double Prey':'Section=combat Note="May use Hunt Prey on two targets"',
  'Lightning Snares':'Section=skill Note="May craft a trap with 1 action"',
  'Second Sting':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Failed Strike against hunted prey with a weapon in one hand inflicts the non-dice damage of the weapon in the other"',
  // Side By Side as above
  'Sense The Unseen':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Upon a failed Seek, may make undetected foes hidden"',
  'Shared Prey':
    'Section=combat ' +
    'Note="May share with an ally the benefits of Hunt Prey and Flurry, Outwit, or Precision on a single target"',
  'Stealthy Companion':
    'Section=skill ' +
    'Note="Companion gains benefits of Camouflage; ambusher companion gains an increase in Stealth rank"',
  'Targeting Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ranged attack vs. hunted prey ignores cover and concealment"',
  "Warden's Guidance":
    'Section=skill ' +
    'Note="While observing hunted prey, Seek failures and critical failures by allies are successes"',
  'Greater Distracting Shot':
    'Section=combat ' +
    'Note="Ranged hit on hunted prey inflicts flat-footed for 1 rd; critical hit until end of next turn"',
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':
    'Section=combat Note="Increased Monster Hunter effects"',
  // Specialized Companion as above
  'Ubiquitous Snares':'Section=skill Note="Increased Snare Specialist effects"',
  'Impossible Flurry':
    'Action=3 ' +
    'Section=combat ' +
    'Note="While wielding 2 weapons, may make 3 melee Strikes with each at the maximum multiple attack penalty"',
  // Impossible Volley as above
  'Manifold Edge':
    'Section=combat ' +
    'Note="May use a different hunter\'s edge benefit with Hunt Prey"',
  'Masterful Companion':
    'Section=combat ' +
    'Note="Companion gains Masterful Hunter effects vs. hunted prey"',
  'Perfect Shot':
    'Action=3 ' +
    'Section=combat ' +
    'Note="May inflict maximum damage with a ranged Strike on hunted prey"',
  'Shadow Hunter':
    'Section=skill ' +
    'Note="Has continuous concealment from foes other than hunted prey in natural surroundings"',
  'Legendary Shot':'Section=combat Note="May ignore five range increments when attacking hunted prey with a master proficiency weapon"',
  'To The Ends Of The Earth':
    'Section=skill Note="May follow hunted prey across any distance"',
  'Triple Threat':
    'Section=feature ' +
    'Note="May use Hunt Prey with 3 targets, share two-target Hunt Prey effects with 1 ally, or share single-target Hunt Prey effects with 2 allies"',
  'Ultimate Skirmisher':
    'Section=ability,save ' +
    'Note=' +
      '"May move normally over difficult, greater difficult, and hazardous terrain",' +
      '"Never triggers movement-connected traps"',

  // Rogue
  'Debilitating Strike':
    'Action=Free ' +
    'Section=combat ' +
    'Note="May have a successful Strike against a flat-footed foe inflict choice of -10 Speed or enfeebled 1 until end of next turn"',
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
    'Action=Free ' +
    'Section=combat,combat ' +
    'Note=' +
      '"Class Master (Rogue)",' +
      '"May have a successful Strike on a flat-footed foe force a Fortitude save 1/target/day; critical failure inflicts choice of paralyzed for 4 rd, knocked unconscious for 2 hours, or killed; failure inflicts paralyzed for 4 rd; success inflicts enfeebled 2 for 1 rd"',
  'Master Tricks':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks)"',
  'Rogue Expertise':'Section=combat Note="Class Expert (Rogue)"',
  'Rogue Feats':'Section=feature Note="%V selections"',
  'Rogue Key Ability':'Section=feature Note="1 selection"',
  'Rogue Skills':
    'Section=skill Note="Skill Trained (Stealth; Choose %V from any)"',
  "Rogue's Racket":'Section=feature Note="1 selection"',
  'Ruffian':
    'Section=combat,combat,skill ' +
    'Note=' +
      '"Defense %V (Medium Armor)",' +
      '"May sneak attack with any simple weapon/May apply critical specialization on a critical hit with a d8 or lighter simple weapon on a flat-footed foe",' +
      '"Skill Trained (Intimidation)"',
  'Scoundrel':
    'Section=combat,skill ' +
    'Note=' +
      '"A successful Feint inflicts flat-footed on foe vs. self attacks (critical success all attacks) for until the end of next turn",' +
      '"Skill Trained (Deception; Diplomacy)"',
  'Slippery Mind':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Sneak Attack':
    'Section=combat ' +
    'Note="+%{levels.Rogue?(level+7)//6:1}d%{levels.Rogue?6:level>=6?6:4} HP damage vs. flat-footed foe with agile, finesse, or ranged weapons"',
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
    'Action=Reaction Section=combat Note="May gain +2 AC against an attack"',
  'Trap Finder':
    'Section=combat,save,skill ' +
    'Note=' +
      '"+%{rank.Thievery>=3?2:1} Perception and automatic Search to find traps/May disable traps that require %{rank.Thievery>=3 ? \'legendary\' : \'master\'} in Thievery",' +
      '"+%{rank.Thievery>=3?2:1} vs. traps",' +
      '"+%{rank.Thievery>=3?2:1} AC vs. traps"',
  'Twin Feint':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May Strike with each hand, inflicting flat-footed on the second"',
  "You're Next":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May gain +2 Intimidation to Demoralize another foe after current foe drops"',
  'Brutal Beating':
    'Section=combat Note="Critical success on a Strike inflicts frightened 1"',
  'Distracting Feint':
    'Section=combat ' +
    'Note="A successful Feint inflicts -2 Perception and Reflex saves"',
  'Minor Magic (Arcane)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Arcane)",' +
      '"Knows 2 arcane cantrips"',
  'Minor Magic (Divine)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      '"Knows 2 divine cantrips"',
  'Minor Magic (Occult)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      '"Knows 2 occult cantrips"',
  'Minor Magic (Primal)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Primal)",' +
      '"Knows 2 primal cantrips"',
  'Mobility':
    'Section=combat Note="May Stride half Speed without triggering reactions"',
  // Quick Draw as above
  'Unbalancing Blow':
    'Section=combat ' +
    'Note="Critical hits inflict flat-footed vs. self attacks until the end of next turn"',
  'Battle Assessment':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May use Perception vs. Deception or Stealth DC to determine foe strengths and weaknesses"',
  'Dread Striker':
    'Section=combat Note="Frightened foes are flat-footed vs. self attacks"',
  'Magical Trickster':
    'Section=magic ' +
    'Note="Spell attacks vs. flat-footed foes inflict sneak attack damage"',
  'Poison Weapon':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May prepare %{level} poisons each day that inflict 1d4 HP damage/May apply poison to piercing and slashing weapons"',
  'Reactive Pursuit':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May remain adjacent to a retreating foe"',
  'Sabotage':
    'Action=1 ' +
    'Section=skill ' +
    'Note="May use Thievery vs. Reflex to inflict %{skillModifiers.Thievery*2} HP damage (critical success %{skillModifiers.Thievery*4} HP) to an item possessed by a creature within reach"',
  // Scout's Warning as above
  'Gang Up':
    'Section=combat ' +
    'Note="Flanking by allies inflict flat-footed on foes vs. self attacks"',
  'Light Step':
    'Section=ability Note="May Stride or Step normally over difficult terrain"',
  // Skirmish Strike as above
  'Twist The Knife':
    'Action=1 ' +
    'Section=combat ' +
    'Note="May inflict %{(level+7)//6} HP persistent bleed damage with a sneak attack"',
  // Blind-Fight as above
  'Delay Trap':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="May attempt a +5 DC Thievery to delay or disable trap activation"',
  'Improved Poison Weapon':
    'Section=combat ' +
    'Note="Poisoned weapons inflict +2d4 HP damage/Critical miss does not waste poison"',
  'Nimble Roll':
    'Section=save ' +
    'Note="May use Nimble Dodge before a Reflex save; success allows a 10\' Stride"',
  'Opportune Backstab':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="After an ally hits a foe, may Strike the same foe"',
  'Sidestep':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May redirect a failed Strike on self to an adjacent creature"',
  'Sly Striker':
    'Section=combat ' +
    'Note="Successful Strikes with a sneak attack weapon inflict +%{level>=14 ? 2 : 1}d6 HP precision damage"',
  'Precise Debilitations':
    'Section=combat ' +
    'Note="Debilitating Strike may inflict +2d6 HP precision damage or flat-footed"',
  'Sneak Savant':
    'Section=skill Note="Normal failures on Sneak actions are successes"',
  'Tactical Debilitations':
    'Section=combat ' +
    'Note="Debilitating Strike may prevent reactions or flanking"',
  'Vicious Debilitations':
    'Section=combat ' +
    'Note="Debilitating Strike may inflict weakness 5 to choice of damage type or clumsy 1"',
  'Critical Debilitation':
    'Section=combat ' +
    'Note="Debilitating Strike may force a foe Fortitude save; critical failure paralyzes until the end of next turn; failure/success inflicts slowed 2/1 until the end of next turn"',
  'Fantastic Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May Strike after a High Jump or Long Jump, using Long Jump distance for either"',
  'Felling Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May force a Reflex save with a successful Strike vs. an airborne flat-footed foe; critical failure grounds until the end of next turn; failure causes 120\' fall"',
  'Reactive Interference':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May prevent a foe Reaction; requires an attack against a higher-level foe"',
  'Spring From The Shadows':
    'Action=1 Section=combat Note="May Strike an unaware foe after a Stride"',
  'Defensive Roll':
    'Action=Free ' +
    'Section=combat ' +
    'Note="May negate half damage from an attack that would reduce self to 0 HP 1/10 min"',
  'Instant Opening':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' May use a distraction to inflict flat-footed vs. self until the end of next turn"',
  'Leave An Opening':
    'Section=combat ' +
    'Note="May follow a critical hit on a flat-footed foe by giving a chosen ally an Attack Of Opportunity"',
  // Sense The Unseen as above
  'Blank Slate':
    'Section=save ' +
    'Note="Immune to detection, revelation and scrying effects of less than 10 counteract level"',
  'Cloud Step':
    'Section=ability Note="May Stride over insubstantial surfaces and traps"',
  'Cognitive Loophole':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="May suppress a mental effect until the end of next turn"',
  'Dispelling Slice':
    'Action=2 ' +
    'Section=combat ' +
    'Note="May attempt a level %{(level+1)//2}, DC %{classDifficultyClass.Rogue-10} counteract to dispel a magical effect on the target of a successful sneak attack"',
  'Perfect Distraction':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May create a decoy that invokes <i>Mislead</i> effects 1/10 min"',
  'Implausible Infiltration':
    'Action=2 ' +
    'Section=ability ' +
    'Note="May move through up to 10\' of wood, plaster, or stone"',
  'Powerful Sneak':
    'Section=combat Note="May change sneak attack damage to match weapon type"',
  "Trickster's Ace":
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="May evoke the effects of a prepared spell up to level 4 on self"',
  'Hidden Paragon':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="May become invisible for 1 min when hidden from foes 1/hour"',
  'Impossible Striker':
    'Section=combat ' +
    'Note="May inflict sneak attack damage on a non-flat-footed foe"',
  'Reactive Distraction':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="May redirect an effect or attack from self to Perfect Distraction decoy"',

  // Sorcerer
  // Alertness as above
  // bloodlines handled by bloodlineRules
  'Bloodline':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool with 1 Focus Point"',
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
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="May expend a spell slot to counteract a spell with the same spell"',
  'Dangerous Sorcery':
    'Section=magic ' +
    'Note="Casting an instantaneous harmful spell inflicts additional damage equal to its level"',
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
    'Action=Free ' +
    'Section=magic ' +
    'Note="May cast a non-cantrip spell to also cause a wielded weapon to inflict +1d6 HP until end of turn; damage type depends on spell school"',
  'Divine Evolution':
    'Section=magic Note="+1 D%V slot for <i>Heal</i> or <i>Harm</i>"',
  'Occult Evolution':
    'Section=magic,skill ' +
    'Note=' +
      '"May temporarily add 1 unknown mental spell to repertoire each day",' +
      '"Skill Trained (Choose 1 from any)"',
  'Primal Evolution':
    'Section=magic ' +
    'Note="+1 P%V slot for <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i>"',
  'Advanced Bloodline':
    'Section=magic Note="Knows the <i>%V</i> spell/+1 Focus Points"',
  // Steady Spellcasting as above
  'Bloodline Resistance':
    'Section=save Note="+1 vs. spells and magical effects"',
  'Crossblooded Evolution':
    'Section=magic ' +
    'Note="May have 1 spell from a different tradition in repertoire"',
  'Greater Bloodline':
    'Section=magic Note="Knows the <i>%V</i> spell/+1 Focus Points"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Magic Sense':
    'Section=magic ' +
    'Note="Has continuous 1st-level <i>Detect Magic</i> effects that increase to 3rd-level during Seek"',
  'Interweave Dispel':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May expend a spell slot to add <i>Dispel Magic</i> effects to a successful single-target spell"',
  'Reflect Spell':
    'Section=magic ' +
    'Note="May have a successful Counterspell inflict the spell effects on the caster"',
  // Effortless Concentration as above
  'Greater Mental Evolution':
    'Section=magic Note="Adds 1 spell of each level to repertoire"',
  'Greater Vital Evolution':
    'Section=feature ' +
    'Note="May cast two additional spells of different levels after spell slots in each level are exhausted 1/day"',
  'Bloodline Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  'Greater Crossblooded Evolution':
    'Section=magic ' +
    'Note="May know 3 spells of different levels from different traditions"',
  'Bloodline Conduit':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May cast instantaneous spells of 5th level and lower without expending a spell slot"',
  'Bloodline Perfection':'Section=magic Note="+1 10th level spell slot"',
  'Metamagic Mastery':
    'Section=magic Note="May use a 1-action metamagic effect as a free action"',

  // Wizard
  // schools handled in schoolRules
  // Alertness as above
  'Arcane Bond':'Section=feature Note="Has the Drain Bonded Item feature"',
  'Arcane School':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool with 1 Focus Point"',
  'Arcane Spellcasting':
    'Section=magic Note="May learn spells from the arcane tradition"',
  'Arcane Thesis':'Section=feature Note="1 selection"',
  "Archwizard's Spellcraft":'Section=magic Note="Has 1 10th-level spell slot"',
  // Defensive Robes as above
  'Drain Bonded Item':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="May cast an expended spell using power stored in a possession 1/day"',
  // Expert Spellcaster as above
  'Improved Familiar Attunement':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Familiar feature",' +
      '"Familiar is focus of Arcane Bond and has %{level//6+1} additional %{level>5?\'abilities\':\'ability\'}"',
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Magical Fortitude as above
  // Master Spellcaster as above
  'Metamagical Experimentation':
    'Section=feature,magic ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May select 1 metamagic feat of up to level %{level//2} to use each day"',
  // Resolve as above
  'Spell Blending':
    'Section=magic ' +
    'Note="May use 2 spell slots from a level to prepare a spell two levels higher/May use a spell slot to prepare 2 cantrips"',
  'Spell Substitution':
    'Section=magic ' +
    'Note="May use a 10-minute process to replace 1 prepared spell with a different spell"',
  'Universalist':
    'Section=feature,magic ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"May use Drain Bonded Item 1 per spell level/Knows 1 additional 1st-level spell"',
  // Weapon Specialization as above
  'Wizard Feats':'Section=feature Note="%V selections"',
  'Wizard Skills':
    'Section=skill Note="Skill Trained (Arcana; Choose %V from any)"',
  'Wizard Weapon Expertise':
    'Section=feature ' +
    'Note="Attack Expert (Club; Crossbow; Dagger; Heavy Crossbow; Staff; Unarmed Attacks)"',

  // Counterspell as above
  'Eschew Materials':
    'Section=magic ' +
    'Note="May replace spell material components with sigils drawn in the air"',
  // Familiar as above
  'Hand Of The Apprentice':
    'Section=magic ' +
    'Note="Knows the <i>Hand Of The Apprentice</i> spell/Has a focus pool with 1 Focus Point"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':
    'Section=skill ' +
    'Note="May hide spellcasting from observers with a successful Stealth vs. Perception, plus a successful Deception vs. Perception for verbal spells"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':
    'Section=magic ' +
    'Note="Draining a bonded item to cast a spell restores 1 Focus Point"',
  'Silent Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May cast a spell without its verbal components"',
  'Spell Penetration':
    'Section=magic ' +
    'Note="Targets reduce any status bonus to saves vs. self spells by 1"',
  // Steady Spellcasting as above
  'Advanced School Spell':
    'Section=magic Note="Knows the <i>%V</i> spell/+1 Focus Points"',
  'Bond Conservation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="May use Drain Bonded Item to cast another spell 2 levels lower by the end of next turn"',
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
    'Note="May Counterspell with a -2 penalty a known spell using any spell that shares a non-tradition trait with it"',
  // Magic Sense as above
  'Bonded Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Reflect Spell as above
  'Superior Bond':
    'Section=magic ' +
    'Note="May use Drain Bonded Item to cast another spell up to level %V 1/day"',
  // Effortless Concentration as above
  'Spell Tinker':
    'Action=2 ' +
    'Section=magic ' +
    'Note="May alter the ongoing effect choice of a spell cast on self, reducing its remaining duration by half"',
  'Infinite Possibilities':
    'Section=magic ' +
    'Note="May prepare a spell slot to allow casting of any known spell of 2 levels lower"',
  'Reprepare Spell':
    'Section=magic ' +
    'Note="May spend 10 min to prepare a cast spell%{$\'features.Spell Substitution\'?\' or another spell of the same level\':\'\'}"',
  "Archwizard's Might":'Section=magic Note="+1 10th level spell slot"',
  // Metamagic Mastery as above
  'Spell Combination':
    'Section=magic ' +
    'Note="May use 1 spell slot of each level above 2nd to cast a combination of two spells of 2 levels lower"',

  // Archetype
  'Alchemist Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Attack Trained (Alchemical Bombs)/Class Trained (Alchemist)",' +
      '"Has the Alchemical Crafting and Infused Reagents features",' +
      '"Skill Trained (Crafting)"',
  'Basic Concoction':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level alchemist)"',
  // Quick Alchemy as above
  'Advanced Concoction':'Section=feature Note="+1 Class Feat (alchemist)"',
  'Expert Alchemy':'Section=feature Note="Raises advanced alchemy level to %V"',
  'Master Alchemy':'Section=feature Note="Raises advanced alchemy level to %V"',

  'Barbarian Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Class Trained (Barbarian)",' +
      '"Has the Instinct and Rage features",' +
      '"Skill Trained (Athletics)"',
  'Barbarian Resiliency':'Section=combat Note="+%V Hit Points"',
  'Basic Fury':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level barbarian)"',
  'Advanced Fury':'Section=feature Note="+%V Class Feat (barbarian)"',
  'Instinct Ability':'Section=feature Note="Has the %V feature"',
  "Juggernaut's Fortitude":'Section=save Note="Save Master (Fortitude)"',

  'Bard Dedication':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Muses feature",' +
      '"Spell Trained (Occult)/Knows 2 occult cantrips",' +
      '"Skill Trained (Occultism; Performance)"',
  'Basic Bard Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} occult spell"',
  "Basic Muse's Whispers":
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level bard)"',
  "Advanced Muse's Whispers":'Section=feature Note="+1 Class Feat (bard)"',
  'Counter Perform':
    'Section=magic ' +
    'Note="Knows the <i>Counter Performance</i> spell/Has a focus pool with 1 Focus Point"',
  'Inspirational Performance':
    'Section=magic Note="Knows the <i>Inspire Courage</i> cantrip"',
  'Occult Breadth':
    'Section=magic Note="+1 occult spell slot of each level up to %V"',
  'Expert Bard Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (Occult)/Knows 1 4th-level%{level>=16?\', 1 5th-level, and 1 6th-level\':level>=14?\' and 1 5th-level\':\'\'} occult spell"',
  'Master Bard Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (Occult)/Knows 1 7th-level%{level>=20?\' and 1 8th-level\':\'\'} occult spell"',

  'Champion Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Defense Trained (Light Armor; Medium Armor; Heavy Armor)/Class Trained (Champion)",' +
      '"Has the Anathema, Cause, and Deity features",' +
      '"Skill Trained (Religion)"',
  'Basic Devotion':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level champion)"',
  'Champion Resiliency':'Section=combat Note="+%V Hit Points"',
  // NOTE: Might not be Lay On Hands for other causes
  'Healing Touch':
    'Section=magic ' +
    'Note="Knows the <i>Lay On Hands</i> spell/Has a focus pool with 1 Focus Point"',
  'Advanced Devotion':'Section=feature Note="+1 Class Feat (champion)"',
  // Champion's Reaction as above
  // Divine Ally as above
  'Diverse Armor Expert':
    'Section=combat ' +
    'Note="Defense Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',

  'Cleric Dedication':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Anathema and Deity features",' +
      '"Spell Trained (Divine)/May prepare 2 divine cantrips each day",' +
      '"Skill Trained (Religion)"',
  'Basic Cleric Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} divine spell"',
  'Basic Dogma':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level cleric)"',
  'Advanced Dogma':'Section=feature Note="+1 Class Feat (cleric)"',
  'Divine Breadth':
    'Section=magic Note="+1 divine spell slot of each level up to %V"',
  'Expert Cleric Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (Divine)/Knows 1 4th-level%{level>=16?\', 1 5th-level, and 1 6th-level\':level>=14?\' and 1 5th-level\':\'\'} divine spell"',
  'Master Cleric Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (Divine)/Knows 1 7th-level%{level>=20?\' and 1 8th-level\':\'\'} divine spell"',

  'Druid Dedication':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Druidic Language and Druidic Order features",' +
      '"Spell Trained (Primal)/May prepare 2 primal cantrips each day",' +
      '"Skill Trained (Nature)"',
  'Basic Druid Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} primal spell"',
  'Basic Wilding':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level druid)"',
  'Order Spell':
    'Section=magic ' +
    'Note="Knows the <i>%V</i> spell/Has a focus pool with 1 Focus Point"',
  'Advanced Wilding':'Section=feature Note="+1 Class Feat (druid)"',
  'Primal Breadth':
    'Section=magic Note="+1 primal spell slot of each level up to %V"',
  'Expert Druid Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (Primal)/Knows 1 4th-level%{level>=16?\', 1 5th-level, and 1 6th-level\':level>=14?\' and 1 5th-level\':\'\'} primal spell"',
  'Master Druid Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (Primal)/Knows 1 7th-level%{level>=20?\' and 1 8th-level\':\'\'} primal spell"',

  'Fighter Dedication':
    'Section=combat,skill ' +
    'Note=' +
      '"Attack Trained (Simple Weapons; Martial Weapons)/Class Trained (Fighter)",' +
      '"Skill Trained (Choose 1 from Acrobatics, Athletics)"',
  'Basic Maneuver':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level fighter)"',
  'Fighter Resiliency':'Section=combat Note="+%V Hit Points"',
  'Opportunist':'Section=feature Note="Has the Attack Of Opportunity feature"',
  'Advanced Maneuver':'Section=feature Note="+1 Class Feat (fighter)"',
  'Diverse Weapon Expert':
    'Section=combat ' +
    'Note="Attack Expert (Simple Weapons; Martial Weapons)/Attack Trained (Advanced Weapons)"',

  'Monk Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Attack Trained (Unarmed Attacks)/Class Trained (Monk)",' +
      '"Has the Powerful Fist feature",' +
      '"Skill Trained (Choose 1 from Acrobatics, Athletics)"',
  'Basic Kata':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level monk)"',
  'Monk Resiliency':'Section=combat Note="+%V Hit Points"',
  'Advanced Kata':'Section=feature Note="+1 Class Feat (monk)"',
  'Monk Moves':'Section=ability Note="+10 Speed in no armor"',
  "Monk's Flurry":'Section=feature Note="Has the Flurry Of Blows feature"',
  "Perfection's Path (Fortitude)":'Section=save Note="Save Master (Fortitude)"',
  "Perfection's Path (Reflex)":'Section=save Note="Save Master (Reflex)"',
  "Perfection's Path (Will)":'Section=save Note="Save Master (Will)"',

  'Ranger Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Class Trained (Ranger)",' +
      '"Has the Hunt Prey feature",' +
      '"Skill Trained (Nature)"',
  "Basic Hunter's Trick":
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level ranger)"',
  'Ranger Resiliency':'Section=combat Note="+%V Hit Points"',
  "Advanced Hunter's Trick":'Section=feature Note="+1 Class Feat (ranger)"',
  'Master Spotter':'Section=skill Note="Perception Master"',

  'Rogue Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Class Trained (Rogue)/Defense Trained (Light Armor)",' +
      '"+1 Skill Feat/Has the Surprise Attack feature",' +
      '"Skill Trained (Choose 1 from Stealth, Thievery; Choose 1 from any)"',
  'Basic Trickery':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level rogue)"',
  'Sneak Attacker':'Section=feature Note="Has the Sneak Attack feature"',
  'Advanced Trickery':'Section=feature Note="+1 Class Feat (rogue)"',
  'Skill Mastery':
    'Section=feature,skill ' +
    'Note=' +
      '"+1 Skill Feat",' +
      '"Skill Expert (Choose 1 from any)/Skill Master (Choose 1 from any)"',
  'Uncanny Dodge':'Section=feature Note="Has the Deny Advantage feature"',
  'Evasiveness':'Section=save Note="Save Master (Reflex)"',

  'Sorcerer Dedication':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Bloodline feature",' +
      '"Spell Trained (%V)/Knows 2 %1 cantrips"',
  'Basic Sorcerer Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} %{bloodlineTraditionsLowered} spell"',
  'Basic Blood Potency':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level sorcerer)"',
  'Basic Bloodline Spell':
    'Section=magic ' +
    'Note="Knows the <i>%V</i> spell/Has a focus pool with 1 Focus Point"',
  'Advanced Blood Potency':'Section=feature Note="+1 Class Feat (sorcerer)"',
  'Bloodline Breadth':
    'Section=magic ' +
    'Note="+1 %{bloodlineTraditionsLowered} spell slot of each level up to %V"',
  'Expert Sorcerer Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (%{bloodlineTraditions})/Knows 1 4th-level%{level>=16?\', 1 5th-level, and 1 6th-level\':level>=14?\' and 1 5th-level\':\'\'} %{bloodlineTraditionsLowered} spell"',
  'Master Sorcerer Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (%{bloodlineTraditions})/Knows 1 7th-level%{level>=20?\' and 1 8th-level\':\'\'} %{bloodlineTraditionsLowered} spell"',

  'Wizard Dedication':
    'Section=feature,magic,magic,skill ' +
    'Note=' +
      '"Has the Arcane School feature",' +
      '"Spell Trained (Arcane)/May prepare 2 arcane cantrips each day",' +
      '"Owns a spellbook with 4 arcane cantrips",' +
      '"Skill Trained (Arcana)"',
  'Arcane School Spell':
    'Section=magic Note="Knows the <i>%V</i> spell/Has a focus pool with 1 focus point"',
  'Basic Arcana':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level wizard)"',
  'Basic Wizard Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} arcane spell"',
  'Advanced Arcana':'Section=feature Note="+1 Class Feat (wizard)"',
  'Arcane Breadth':
    'Section=magic Note="+1 arcane spell slot of each level up to %V"',
  'Expert Wizard Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (Arcane)/Knows 1 4th-level%{level>=16?\', 1 5th-level, and 1 6th-level\':level>=14?\' and 1 5th-level\':\'\'} arcane spell"',
  'Master Wizard Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (Arcane)/Knows 1 7th-level%{level>=20?\' and 1 8th-level\':\'\'} arcane spell"',

  // General Feats
  'Adopted Ancestry (%ancestry)':
    'Section=feature Note="May take %ancestry ancestry feats"',
  'Ancestral Paragon':'Section=feature Note="+1 Ancestry Feat"',
  'Armor Proficiency':'Section=combat Note="Defense Trained (%V Armor)"',
  'Breath Control':
    'Section=ability,save ' +
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
    'Note="May Search at %{rank.Perception>=4?4:2}x normal Speed"',
  'Fast Recovery':
    'Section=save ' +
    'Note="Regains 2x Hit Points and drained severity from rest/Successful Fortitude vs. an ongoing disease or poison reduces its stage by 2, or 1 if virulent; critical success by 3, or 2 if virulent"',
  'Feather Step':'Section=ability Note="May Step into difficult terrain"',
  'Fleet':'Section=ability Note="+5 Speed"',
  'Incredible Initiative':'Section=skill Note="+2 on initiative rolls"',
  'Incredible Investiture':'Section=magic Note="May invest 12 items"',
  'Ride':
    'Section=feature ' +
    'Note="Automatically succeeds when using Command an Animal to move/Mount acts on self turn"',
  'Shield Block':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="When shield is raised, may negate damage up to its hardness and have it absorb half of remaining damage"',
  'Toughness':
    'Section=combat,save ' +
    'Note=' +
      '"+%{level} Hit Points",' +
      '"-1 DC on recovery checks"',
  'Untrained Improvisation':
    'Section=skill Note="+%V on untrained skill checks"',
  'Weapon Proficiency (Martial Weapons)':
    'Section=combat Note="Attack Trained (Martial Weapons)"',
  'Weapon Proficiency (Simple Weapons)':
    'Section=combat Note="Attack Trained (Simple Weapons)"',
  'Weapon Proficiency (%weapon)':
    'Section=combat Note="Attack Trained (%weapon)"',

  // General Skill Feats
  'Assurance (%skill)':
    'Section=skill ' +
    'Note="May forgo rolling a %skill check for an automatic %{10+$\'proficiencyBonus.%skill\'}"',
  'Automatic Knowledge (%skill)':
    'Section=skill ' +
    'Note="May use Assurance (%skill) to Recall Knowledge as a free action 1/rd"',
  'Dubious Knowledge':
    'Section=skill ' +
    'Note="Failure on a Recall Knowledge check yields a mix of true and false information"',
  'Magical Shorthand':'Section=skill Note="May learn new spells with %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Religion>=4?\'1 min\':rank.Arcana==3||rank.Nature>=3||rank.Occultism>=3||rank.Religion==3?\'5 min\':\'1 hour\'} of study per spell level; may retry 1 week after failure"',
  'Quick Identification':'Section=skill Note="May use %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Arcana>=4?\'1 action\':rank.Arcana==3||rank.Nature==3||rank.Occultism==3||rank.Religion==3?\'3 actions\':\'a 1 min process\'} to Identify Magic"',
  'Quick Recognition':
    'Section=skill ' +
    'Note="May use a skill with master proficiency to Recognize a Spell as a free action 1/rd"',
  'Recognize Spell':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="May gain guaranteed success in recognizing an unknown common spell up to level 2/4/6/10 with trained/expert/master/legendary proficiency in the connected skill"',
  'Skill Training (%skill)':'Section=skill Note="Skill Trained (%skill)"',
  'Trick Magic Item':
    'Action=1 ' +
    'Section=skill ' +
    'Note="A successful check on the related skill allows temporary activation of a magic item"',

  // Specific Skill Feats
  'Additional Lore (%lore)':'Section=skill Note="Skill %V (%lore)"',
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
    'Action=1 ' +
    'Section=skill ' +
    'Note="May use Medicine to restore Hit Points 1/target/day"',
  'Bizarre Magic':
    'Section=magic ' +
    'Note="Others suffer +5 DC to Recognize Spells and Identify Magic on self spells"',
  'Bonded Animal':
    'Section=skill ' +
    'Note="May make an animal permanently helpful with 1 week of interaction and a successful DC 20 Nature check"',
  'Cat Fall':
    'Section=ability ' +
    'Note="Suffers %{rank.Acrobatics>=4?\'no\':rank.Acrobatics==3?\\"50\' less\\":rank.Acrobatics==2?\\"25\' less\\":\\"10\' less\\"} damage from falling"',
  'Charming Liar':
    'Section=skill ' +
    'Note="Critical success on a Lie improves attitude by 1 step 1/conversation"',
  'Cloud Jump':
    'Section=skill ' +
    'Note="May long jump triple normal distance, high jump normal long jump distance, and add %{speed}\' to jump distance for every additional action spent"',
  'Combat Climber':
    'Section=skill ' +
    'Note="Does not suffer flat-footed and may fight while Climbing/May Climb with one hand occupied"',
  'Confabulator':
    'Section=skill ' +
    'Note="Reduces bonus given to target of Deception for previous attempts to %{rank.Deception>=4?\'0\':rank.Deception==3?\'+1\':\'+2\'}"',
  'Connections':
    'Section=skill ' +
    'Note="May use Society to gain a meeting with an important figure or to exchange favors"',
  'Continual Recovery':
    'Section=skill Note="May repeat Treat Wounds on a patient after 10 min"',
  'Courtly Graces':
    'Section=skill ' +
    'Note="May use Society to impersonate a noble or to Make an Impression on one"',
  'Craft Anything':
    'Section=skill Note="May ignore secondary Crafting requirements"',
  'Divine Guidance':
    'Section=skill ' +
    'Note="May 10 min Deciphering Writing on religious text and a successful Religion check to gain a hint for a current problem"',
  'Experienced Professional':
    'Section=skill ' +
    'Note="Critical failures when using Lore to Earn Income are normal failures; normal failures give twice the income"',
  'Experienced Smuggler':
    'Section=skill ' +
    'Note="%{rank.Stealth>=4?\'Automatic success\':rank.Steak>=3\'Minimum 15\':\'Minimum 10\'} on Stealth rolls to conceal a small item/Earn Income using Underworld Lore gives increased earnings"',
  'Experienced Tracker':
    'Section=skill ' +
    'Note="May Track at full Speed%{rank.Survival<3?\', suffering a -5 Survival penalty\':\'\'}%{rank.Survival>=4?\'/Does not require a Survival check every hour to Track\':\'\'}"',
  'Fascinating Performance':
    'Section=skill ' +
    'Note="May fascinate %{rank.Performance>=4?\'targets\':rank.Performance==3?\'10 targets\':rank.Performance==2?\'4 targets\':\'target\'} for 1 rd with a successful Performance vs. Will"',
  'Foil Senses':
    'Section=skill ' +
    'Note="Automatically takes precautions against special senses when using Avoid Notice, Hide, or Sneak"',
  'Forager':
    'Section=skill ' +
    'Note="Failures and critical failures on Survival to Subsist are successes; may provide for self and %{rank.Survival>=4?32:rank.Survival==3?16:rank.Survival==2?8:4} others (x2 with a critical success)"',
  'Glad-Hand':
    'Section=skill ' +
    'Note="May use Diplomacy with a -5 penalty to Make an Impression immediately upon meeting; may retry after 1 min"',
  'Group Coercion':
    'Section=skill ' +
    'Note="May use Intimidation to Coerce %{rank.Intimidation>=4?25:rank.Intimidation==3?10:rank.Intimidation==2?4:2} targets"',
  'Group Impression':
    'Section=skill ' +
    'Note="May use Diplomacy to Make an Impression with %{rank.Diplomacy>=4?25:rank.Diplomacy==3?10:rank.Diplomacy==2?4:2} targets"',
  // TODO implement
  'Hefty Hauler':'Section=ability Note="x2 maximum and encumbered Bulk"',
  'Hobnobber':'Section=skill Note="May Gather Information in half normal time%{rank.Diplomacy>=3?\'/Critical failures on Gather Information when taking normal time are normal failures\':\'\'}"',
  'Impeccable Crafting':
    'Section=skill ' +
    'Note="Crafting success with Specialty Crafting is always a critical success"',
  'Impressive Performance':
    'Section=skill Note="May use Performance to Make an Impression"',
  'Intimidating Glare':'Section=skill Note="May use glare to Demoralize"',
  'Intimidating Prowess':
    'Section=skill ' +
    'Note="+%{strength>=20&&rank.Intimidation>=3?2:1} to Coerce or Demoralize when physically menacing target"',
  'Inventor':'Section=skill Note="May use Crafting to create formulas"',
  'Kip Up':
    'Action=Free Section=combat Note="May stand without triggering reactions"',
  'Lasting Coercion':
    'Section=skill ' +
    'Note="Successful Coerce lasts up to a %{rank.Intimidation>=4?\'month\':\'week\'}"',
  'Legendary Codebreaker':
    'Section=skill ' +
    'Note="May use Society to Decipher Writing at full Speed; successes at normal Speed are critical successes"',
  'Legendary Linguist':
    'Section=skill ' +
    'Note="May establish basic communication with any creature that uses language"',
  'Legendary Medic':
    'Section=skill ' +
    'Note="May use a 1 hour process and a successful Medicine check to remove a disease or condition 1/target/day"',
  'Legendary Negotiation':
    'Action=3 ' +
    'Section=skill ' +
    'Note="May use Diplomacy with a -5 penalty to convince a foe to negotiate; requires a successful Make an Impression followed by a successful Request"',
  'Legendary Performer':
    'Section=skill ' +
    'Note="NPCs\' successful DC 10 Society check to Recall Knowledge improves their attitude by 1 step/Earn Income using Performance increases audience by 2 levels"',
  'Legendary Professional':
    'Section=skill ' +
    'Note="NPCs\' successful DC 10 Society check to Recall Knowledge improves their attitude by 1 step/Earn Income using Lore increases job level"',
  'Legendary Sneak':
    'Section=skill ' +
    'Note="May Hide and Sneak without cover/Automatically uses Avoiding Notice when exploring"',
  'Legendary Survivalist':
    'Section=skill ' +
    'Note="May survive indefinitely without food and water and endure incredible temperatures without damage"',
  'Legendary Thief':
    'Section=skill ' +
    'Note="May attempt Steal with a -5 penalty to take actively wielded and highly noticeable items"',
  'Lengthy Diversion':
    'Section=skill ' +
    'Note="May remain hidden after a Create a Diversion attempt critically succeeds"',
  'Lie To Me':
    'Section=skill Note="May use Deception to detect lies in a conversation"',
  'Magical Crafting':
    'Section=skill ' +
    'Note="May craft magic items/Knows formulas for 4 common magic items of 2nd level or lower"',
  'Multilingual':'Section=skill Note="+%V Language Count"',
  'Natural Medicine':
    'Section=skill Note="May use Nature to Treat Wounds; +2 in wilderness"',
  'Nimble Crawl':
    'Section=ability ' +
    'Note="May crawl at %{rank.Acrobatics>=3?\'full\':\'half\'} Speed%{rank.Acrobatics>=4?\'/Being prone does not inflict flat-footed\':\'\'}"',
  'Oddity Identification':'Section=skill Note="+2 Occultism to Identify Magic with a mental, possession, predication, or scrying trait"',
  'Pickpocket':
    'Section=skill ' +
    'Note="May Steal a closely-guarded object without penalty%{rank.Thievery>=3?\'/May use Steal with a -5 penalty on an alert creature\':\'\'}"',
  'Planar Survival':
    'Section=skill Note="May use Survival to Subsist on different planes"',
  'Powerful Leap':
    'Section=skill Note="May jump 5\' vertically and +5\' horizontally"',
  'Quick Climb':
    'Section=skill ' +
    'Note="%{rank.Athletics>=4?\'May Climb at full Speed\':\\"Climbing success increases distance by 5\', critical success by 10\'\\"}"',
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
    'Note="May Squeeze %{rank.Acrobatics>=4?\'at full Speed\':\\"5\'/rd, or 10\'/rd on a critical success\\"}"',
  'Quick Swim':
    'Section=skill ' +
    'Note="%{rank.Athletics>=4?\'May Swim at full Speed\':\\"Swimming success increases distance by 5\', critical success by 10\'\\"}"',
  'Quick Unlock':'Section=skill Note="May use 1 action to Pick a Lock"',
  'Quiet Allies':
    'Section=skill ' +
    'Note="May roll a single Stealth check to Avoid Notice when leading a group"',
  'Rapid Mantel':
    'Section=skill ' +
    'Note="May stand immediately after a successful Grab an Edge/May use Athletics to Grab an Edge"',
  'Read Lips':
    'Section=skill Note="May read the lips of those who can be seen clearly; in difficult circumstances, this requires a Society check and may inflict fascinated and flat-footed"',
  'Robust Recovery':
    'Section=skill ' +
    'Note="Success on Treat a Disease or a Poison gives a +4 bonus/Patient success is always a critical success"',
  'Scare To Death':
    'Action=1 ' +
    'Section=skill ' +
    'Note="R30\' May attempt Intimidation vs. foe Will DC; critical success inflicts death (Fortitude save inflicts frightened 2 and flees for 1 rd); success inflicts frightened 2; failure inflicts frightened 1"',
  'Shameless Request':
    'Section=skill ' +
    'Note="-2 DC for an outrageous request, and critical failures are normal failures"',
  'Sign Language':
    'Section=skill Note="Knows the sign equivalents of understood languages"',
  'Slippery Secrets':
    'Section=skill ' +
    'Note="Deception vs. spell DC negates spell effects that read minds, detect lies, or reveal alignment"',
  'Snare Crafting':
    'Section=skill ' +
    'Note="May use Crafting to create snares; knows the formulas for 4 common snares"',
  'Specialty Crafting':
    'Section=skill Note="+%{rank.Crafting>=3?2:1} Crafting on selected type"',
  'Steady Balance':
    'Section=skill ' +
    'Note="All Balance successes are critical successes/Never flat-footed during Balance/May use Acrobatics to Grab an Edge"',
  'Streetwise':
    'Section=skill ' +
    'Note="May use Society to Gather Information and to Recall Knowledge in familiar settlements"',
  'Student Of The Canon':
    'Section=skill ' +
    'Note="Critical failures on Religion checks to Decipher Writing or Recall Knowledge are normal failures/Failures to Recall Knowledge about own faith are successes, and successes are critical successes"',
  'Subtle Theft':'Section=skill Note="Successful Steal inflicts -2 Perception on observers to detect/May remain undetected when using Palm an Object or Steal after a successful Create a Diversion"',
  'Survey Wildlife':
    'Section=skill ' +
    'Note="May use Survival with a -2 penalty to Recall Knowledge about local creatures after 10 min of study"',
  'Swift Sneak':'Section=skill Note="May Sneak at full Speed"',
  'Terrain Expertise (%terrain)':'Section=skill Note="+1 Survival in %terrain"',
  'Terrain Stalker (Rubble)':
    'Section=skill Note="May Sneak in rubble without a Stealth check"',
  'Terrain Stalker (Snow)':
    'Section=skill Note="May Sneak in snow without a Stealth check"',
  'Terrain Stalker (Underbrush)':
    'Section=skill Note="May Sneak in underbrush without a Stealth check"',
  'Terrified Retreat':
    'Section=skill ' +
    'Note="Critical success on Demoralize causes lower-level target to flee for 1 rd"',
  'Titan Wrestler':
    'Section=skill ' +
    'Note="May Disarm, Grapple, Shove, or Trip creatures up to %{rank.Athletics>=4?3:2} sizes larger"',
  'Train Animal':
    'Section=feature ' +
    'Note="May use 7 days\' training and a successful Nature check to teach an animal to perform a trick"',
  'Underwater Marauder':
    'Section=combat ' +
    'Note="Does not suffer flat-footed from being in water/Suffers no penalty when using bludgeoning and slashing weapons in water"',
  'Unified Theory':
    'Section=skill ' +
    'Note="May use Arcana in place of Nature, Occultism, or Religion"',
  'Unmistakable Lore':
    'Section=skill ' +
    'Note="Critical failures on any trained Lore are normal failures"',
  'Virtuosic Performer':
    'Section=skill ' +
    'Note="+%{rank.Performance>=3?2:1} checks on chosen Performance type"',
  'Wall Jump':
    'Section=skill ' +
    'Note="May follow a jump with another 1-action jump when adjacent to a wall 1/turn"',
  'Ward Medic':
    'Section=skill ' +
    'Note="May use Medicine to Treat Disease or Treat Wounds on up to %{rank.Medicine>=4?8:rank.Medicine==3?4:2} creatures simultaneously"',
  'Wary Disarmament':
    'Section=skill Note="+2 AC vs. a trap triggered while disarming it"',

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
  'Abjuration':'Spell="Protective Ward" AdvancedSpell="Energy Absorption"',
  'Conjuration':'Spell="Augment Summoning" AdvancedSpell="Dimensional Steps"',
  'Divination':'Spell="Diviner\'s Sight" AdvancedSpell="Vigilant Eye"',
  'Enchantment':'Spell="Charming Words" AdvancedSpell="Dread Aura"',
  'Evocation':'Spell="Force Bolt" AdvancedSpell="Elemental Tempest"',
  'Illusion':'Spell="Warped Terrain" AdvancedSpell="Invisibility Cloak"',
  'Necromancy':'Spell="Call Of The Grave" AdvancedSpell="Life Siphon"',
  'Transmutation':'Spell="Physical Boost" AdvancedSpell="Shifting Form"'
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
    'Description=' +
      '"R120\' Spell attack inflicts 3d8 HP acid (critical hit doubles) plus 1d6 HP persistent acid (<b>heightened +2</b> inflicts +2d8 initial and +1d6 HP persistent)"',
  'Acid Splash':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d6 HP acid (critical hit also 1 HP persistent acid) and 1 HP acid splash (<b>heightened 3rd</b> inflicts 1d6+%{spellModifier.Arcane||spellModifier.Primal} HP initial and 2 HP persistent; <b>5th</b> inflicts 2d6+%{spellModifier.Arcane||spellModifier.Primal} HP initial, 3 HP persistent, and 2 HP splash; <b>7th</b> inflicts 3d6+%{spellModifier.Arcane||spellModifier.Primal} HP initial, 4 HP persistent, and 3 HP splash; <b>9th</b> inflicts 4d6+%{spellModifier.Arcane||spellModifier.Primal} HP initial, 5 HP persistent, and 4 HP splash)"',
  'Aerial Form':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes choice of a medium bat, bird, pterosaur, or wasp (<b>heightened 5th</b> large creature; <b>6th</b> huge creature) for 1 min"',
  'Air Bubble':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=Reaction ' +
    'Description="R60\' Allows target to breathe normally for 1 min"',
  'Air Walk':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Touched may walk on air up to a 45-degree angle for 5 min"',
  'Alarm':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"20\' burst triggers choice of mental or audible alarm when a Small or larger corporeal creature enters without saying the specified password for 8 hr"',
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
    'Description=' +
      '"Self transforms into choice of Medium animal with 5 temporary HP, AC %{level+16}, +9 attack, +1 damage, low-light vision, 30\' imprecise scent, +9 Athletics modifier, and animal-specific attacks for 1 min (<b>heightened 3rd</b> 10 temporary HP, AC %{level+17}, +14 attack, +5 damage, +14 Athletics; <b>4th</b> Large animal with 10\' reach, 15 temporary HP, AC %{level+18}, +16 attack, +9 damage, +16 Athletics; <b>5th</b> Huge animal with 15\' reach, 20 temporary HP, AC %{level+18}, +18 attack, +7 damage with double damage dice, +20 Athletics)"',
  'Animal Messenger':
    'Level=2 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Target Tiny animal carries a small object or note to specified destination for up to 24 hr"',
  'Animal Vision':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Self can share target animal\'s senses (<b>save Will</b> negates) for 1 hr"',
  'Ant Haul':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched can carry +3 Bulk without encumbrance and +6 Bulk maximum for 8 hr"',
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
    'Description=' +
      '"R30\' Transforms target into a harmless animal for 1 min (<b>save Will</b> inflicts minor physical changes and sickened 1; critical success negates; critical failure extends transformation indefinitely; save may be repeated each rd)"',
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
    'Description=' +
      '"R30\' Returns target to its home plane (<b>save Will</b> (-2 if cast using a target anathema) negates; critical success inflicts stunned 1 on caster; critical failure prevents target return for 1 week) (<b>heightened 9th</b> may target up to 10 creatures)"',
  'Barkskin':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 2 to bludgeoning and piercing and weakness 3 to fire for 10 min (<b>heightened +2</b> +2 resistances and +3 weakness)"',
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
    'Description=' +
      '"R120\' Successful attack vs. Fortitude DC in a 20\' burst inflicts 3d6 HP bludgeoning and grabbed for 1 min, plus 1d6 HP bludgeoning each rd on grabbed creatures; escaping requires success vs. a %{spellDifficultyClass.Arcane||spellDifficultyClass.Occult} DC on an unarmed attack or inflicting 12 HP vs. a %{spellDifficultyClass.Arcane||spellDifficultyClass.Occult} AC"',
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
    'Description=' +
      '"5\' radius gives allies +1 attack for 1 min; may use a concentrate action to extend to 10\'"',
  'Blindness':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Blinds target for 1 min (<b>save Fortitude</b> effects last until next turn; critical success negates; critical failure makes effects permanent)"',
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
    'Description=' +
      '"R60\' Prevents target death and restores 4d8+%{spellModifier.Divine} HP"',
  'Burning Hands':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP fire (<b>heightened +1</b> +2d6 HP) (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP)"',
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
    'Description="R1000\' 60\' burst inflicts 3d10 HP acid, bludgeoning three times, cold, electricity, and fire, ignoring resistance 10 (<b>save Reflex</b> inflicts half HP; critical success negates, critical failure inflicts double HP)"',
  'Chain Lightning':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Inflicts 8d12 HP electricity to a chain of targets, jumping up to 30\' between each (<b>save Reflex</b> inflicts half HP; critical save negates and ends chain; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Charm':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target becomes friendly (<b>save Will</b> negates; critical success target notices spell; critical failure makes target helpful)"',
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
    'Description=' +
      '"R120\' Cloud move 10\' away from self each rd, inflicting 6d8 HP poison each rd to creatures within (<b>save Fortitude</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +1d8 HP)"',
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
    'Description=' +
      '"15\' cone inflicts stunned 1, blinded for 1 rd, and dazzled for 1 min (<b>save Will</b> dazzled 1 rd; critical success negates; critical failure inflicts blinded for 1 min)"',
  'Command':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target obeys a command to approach, run away, drop a held object, drop prone, or stand in place for 1 rd (<b>save Will</b> negates; critical failure target uses all actions on next turn to obey)"',
  'Comprehend Language':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target can understand choice of heard language for 1 hr (<b>heightened 3rd</b> may also speak language; <b>4th</b> affects 10 targets)"',
  'Cone Of Cold':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' cone inflicts 12d6 HP cold (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +2d6 HP)"',
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
    'Description="Touched object glows as a torch until dismissed"',
  'Control Water':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="R500\' Raises or lowers water in a 50\'x50\' are by 10\'"',
  'Create Food':
    'Level=2 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 hour" ' +
    'Description=' +
      '"R30\ Creates food for 6 Medium creatures that remains edible for 1 dy (<b>heightened 4th</b> creates food for 12; <b>6th</b> creates food for 50; <b>8th</b> creates food for 200)"',
  'Create Water':
    'Level=1 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="R0\' Creates 2 gallons of water that remains for 1 day"',
  'Creation':
    'Level=4 ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R0\' Creates an object of up to 5 cubic feet made from vegetable matter (<b>heightened 5th</b> may create an object of metal and common minerals)"',
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
    'Description=' +
      '"30\' cone prevents reactions and inflicts slowed 1 for 1 min <b>Will</b> slowed for 1 turn; critical success negates; critical failure inflicts slowed for 1 min)"',
  'Dancing Lights':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Creates 4 floating torch lights in a 10\' radius that may be moved 60\'/rd while sustained"',
  'Darkness':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst counteracts natural light and magical light of equal or lesser level (<b>heightened 4th</b> creatures with darkvision treat targets as concealed)"',
  'Darkvision':
    'Level=2 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self can see in darkness for 1 hr (<b>heightened 3rd</b> affects touched target; <b>5th</b> lasts until next daily preparations)"',
  'Daze':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Target suffers %{spellModifier.Arcane||spellModifier.Divine||spellModifier.Occult} HP mental (<b>save Will</b> inflicts half HP; critical success negates; critical failure inflicts double HP plus stunned 1) (<b>heightened +2</b> inflicts +1d6 HP)"',
  'Deafness':
    'Level=2 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Deafens target for 10 min (<b>save Fortitude</b> lasts 1 rd; critical success negates; critical failure effects are permanent)"',
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
    'Description=' +
      '"Touched gains +4 saves vs. death and negative effects, negative resistance 10, and suppressed doomed effects for 10 min"',
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
    'Description=' +
      '"Allows self to discern the presence of magic in a 30\' radius; detects illusions up up to the spell level (<b>heightened 3rd</b> reveals school of highest-level effect; <b>4th</b> reveals source of highest-level effect)"',
  'Detect Poison':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self learns whether target creature or object is venomous or poisoned (<b>heightened 2nd</b> learn the number and types of poison)"',
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
    'Description="R120\' Teleports self to a visible target location"',
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
    'Description=' +
      '"Self transforms into choice of Large dinosaur with 15 temporary HP, AC %{level+18}, +16 attack, +9 damage, low-light vision, 30\' imprecise scent, +18 Athletics modifier, and dinosaur-specific attacks for 1 min (<b>heightened 5th</b> Huge dinosaur with 15\' or 20\' reach, 20 temporary HP, +18 attack, +6 damage with double damage dice, +21 Athletics; <b>7th</b> Gargantuan dinosaur with 20\' or 25\' reach, 25 temporary HP, +25 attack, +15 damage with double damage dice, +25 Athletics)"',
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
    'Description=' +
      '"R120\' Allows a counteract check to deactivate a non-artifact magic item; critical success destroys it"',
  'Dispel Magic':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' A successful counteract check removes 1 spell effect from target or make a magic item inert for 10 min"',
  'Disrupt Undead':
    'Level=Cantrip ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d6+%{spellModifier.Divine||spellModifier.Primal||0} HP positive to target undead (<b>heightened +1</b> inflicts +1d6 HP)"',
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
    'Description=' +
      '"R120\' 20\' burst inflicts 4d10 HP chosen alignment damage and sickened 1 (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts sickened 2 and slowed 1; creatures with matching alignment are unaffected and neutral creatures improve save by 1 step) (<b>heightened +1</b> +1d10 HP)"',
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
    'Description=' +
      '"Self transforms into choice of Large dragon with 10 temporary HP, AC %{level+18}, +22 attack, +6 damage, a breath weapon, resistance 10 to breath weapon damage type, darkvision, 60\' imprecise scent, +23 Athletics modifier, and dragon-specific attacks for 1 min (<b>heightened 8th</b> Huge dragon with +5\' reach, 15 temporary HP, AC %{level+21}, +28 attack, +12 damage (+14 on breath weapon), +28 Athletics)"',
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
    'Description=' +
      '"R120\' Brings flying target to the ground and prevents flight for 1 rd (<b>save Fortitude</b> grounds target but does not prevent flight; critical success negates; critical failure lasts 1 min"',
  'Earthquake':
    'Level=8 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst inflicts difficult terrain, -2 attacks, AC, and skill checks, falling into 40\' fissures (<b>save Reflex</b> negates), and structure collapse that inflicts 11d6 HP bludgeoning (<b>save Reflex</b> inflicts half HP and prone; critical success inflicts half HP; critical failure inflicts fall into fissure)"',
  'Eclipse Burst':
    'Level=7 ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst blocks magical light and inflicts 8d10 HP cold, plus 8d4 HP negative to living creatures (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP and blinded) (<b>heightened +1</b> +1d10 HP cold and +1d4 HP negative)"',
  'Electric Arc':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+%{spellModifier.Arcane||spellModifier.Primal} electricity up to 2 targets (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> +1d4 HP)"',
  'Elemental Form':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes choice of a medium air, earth, water, or fire elemental (<b>heightened 6th</b> large elemental; <b>7th</b> huge elemental) for 1 min"',
  'Endure Elements':
    'Level=2 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched protected from choice of severe cold or heat until next daily preparations (<b>heightened 3rd</b> protected from both cold and heat; <b>5th</b> protected from extreme cold and heat</b>)"',
  'Energy Aegis':
    'Level=7 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touched gains resistance 5 to acid, cold, electricity, fire, force, negative, positive, and sonic damage for 1 min (<b>heightened 9th</b> gives resistance 10)"',
  'Enhance Victuals':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Removes poison and improves quality of touched 1 gallon of water or 5 pounds of food for 1 hr (<b>heightened +1</b> affects +1 gallon or +5 pounds</b>"',
  'Enlarge':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target becomes Large, gaining 10\' reach, +2 melee damage, and clumsy 1 for 5 min (<b>heightened 4th</b> target becomes Huge, gaining 10\' reach and +4 melee damage; <b>8th</b> affects up to 10 creatures)"',
  'Entangle':
    'Level=2 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Plants in 20\' burst create difficult terrain and -10\' Speed for 1 min (<b>save Reflex</b> negates Speed penalty; critical failure inflicts immobilized for 1 rd)"',
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
    'Description=' +
      '"R120\' 10\' burst makes concealed creatures visible and invisible creatures concealed for 5 min"',
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
    'Description=' +
      '"R30\' Target suffers frightened 2 (<b>heightened 3rd</b> 5 targets) (<b>save Will</b> inflicts frightened 1; critical success negates; critical failure inflicts frightened 3 and target flees for 1 rd)"',
  'Feather Fall':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Falling target slows to 60\'/rd and takes no damage from fall for 1 min or until landing"',
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
    'Description=' +
      '"Allows willing touched to swim at full Speed, but reduces land Speed to 5\', for 10 min (<b>heightened 6th</b> effects last until next daily preparations)"',
  'Field Of Life':
    'Level=6 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 20\' burst restores 1d8 HP/rd to living and inflicts 1d8 HP positive/rd to undead while sustained up to 1 min (<b>heightened 8th</b> 1d10 HP; <b>9th</b> 1d12 HP)"',
  'Fiery Body':
    'Level=7 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains fire immunity and resistance 10 to precision damage, suffers weakness 5 to cold and water, inflicts 3d6 HP fire on unarmed attackers, gains +1d4 HP fire on unarmed attacks and an additional die of damage on fire spells, may cast <i>Produce Flame</i> as an innate spell, gains a 40\' fly Speed, and does not need to breathe for 1 min (<b>heightened 9th</b> inflicts 4d6 HP fire on unarmed attackers, inflicts +2d4 HP fire on unarmed attacks, and increase fly Speed to 60\'"',
  'Finger Of Death':
    'Level=7 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R30\' Target suffers 70 HP negative, dying at 0 HP (<b>heightened +1</b> inflicts +10 HP)"',
  'Fire Seeds':
    'Level=6 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates 4 acorns that may be thrown 30\', inflicting 4d6 HP fire in a 6\' burst and continuing to inflict 2d6 HP fire for 1 min (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened 8th</b> inflicts 5d6 HP initial and 3d6 HP for 1 min; <b>9th</b> inflicts 6d6 initial and 3d6 for 1 min)"',
  'Fire Shield':
    'Level=4 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains cold resistance 5, and unarmed attackers suffer 2d6 HP fire, for 1 min (<b>heightened +2</b> cold resistance +5, damage +1d6 HP)"',
  'Fireball':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 20\' burst inflicts 6d6 HP fire (<b>heightened +1</b> +2d6 HP) (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP)"',
  'Flame Strike':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' radius inflicts 8d6 HP fire, reducing any resistance by half (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP; creatures immune to fire improve save by 1 degree) (<b>heightened +1</b> +2d6 HP)"',
  'Flaming Sphere':
    'Level=2 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 3d6 HP fire (<b>heightened +1</b> +1d6 HP) in a 15\' sq while sustained for up to 1 min (<b>save Reflex</b> negates; critical failure inflicts double HP)"',
  'Fleet Step':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="Self gains +30\' Speed for 1 min"',
  'Flesh To Stone':
    'Level=6 ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Target suffers slowed 1, plus an additional slowed 1 on a failed save each rd until immobile and permanently turned to stone (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates; critical failure inflicts slowed 2)"',
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
    'Description=' +
      '"Touched gains a fly Speed of the greater of its Speed or 20\' for 5 min (<b>heightened 7th</b> lasts 1 hr)"',
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
    'Description=' +
      '"Relieves touched of Speed penalty effects and gives automatic success on Escape attempts for 10 min"',
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
    'Description=' +
      '"R30\' Creates sound equivalent to four humans shouting while sustained (<b>heightened 3rd</b> R60\'; <b>5th</b> 120\')"',
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
    'Description="10\' burst inflicts <i>Dispel Magic</i> effects for 10 min"',
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
    'Description=' +
      '"R30\' 4 5\' squares cause falls or 1 target object inflicts a -2 penalty to checks for 1 min (<b>save Reflex or Acrobatics</b> negates; critical failure inflicts dropped object)"',
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
    'Description=' +
      '"R30\' Changes target\'s perception of 1 object (<b>save Will</b> target knows that it\'s hallucinating; critical success negates; critical failure inflicts -4 saves to disbelieve)"',
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
    'Description=' +
      '"R30\' Target gains an extra Strike or Stride action each rd for 1 min (<b>heightened 7th</b> affects 6 targets)"',
  'Heal':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"<b>(1)</b> Touched, <b>(2)</b> R30\' target, or <b>(3)</b> 30\' emanation recovers 1d8 HP (1d8+8 HP for <b>(2)</b>); undead suffer 1d8HP (<b>save</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> +1d8 HP and +8 HP for <b>(2)</b>)</b> "',
  'Heroism':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +1 attack, Perception, saves, and skill checks for 10 min (<b>heightened 6th</b> +2; <b>8th</b> +3)"',
  'Hideous Laughter':
    'Level=2 ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts slowed 1 and loss of reactions on target while sustained (<b>save Will</b> loss of reactions only; critical success negates; critical failure inflicts prone for 1 rd, then slowed 1 and loss of reactions)"',
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
    'Description=' +
      '"R120\' 10\' burst inflicts dazzled and fascinated while sustained up to 1 min (<b>save Will</b> dazzled only; critical failure inflicts loss of reactions)"',
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
    'Description=' +
      '"Illusion makes self look differently for 1 hr (<b>heightened 2nd</b> also disguises voice and scent; <b>3rd</b> may copy a specific individual)"',
  'Illusory Object':
    'Level=1 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Creates an illusion of a stationary object in a 20\' burst for 10 min (<b>heightened 2nd</b> illusion includes sounds and smells; <b>5th</b> unlimited duration)"',
  'Illusory Scene':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Creates in a 30\' burst a moving illusion with up to 10 creatures, or objects, sounds, and smells for 1 hr (<b>heightened 6th</b> creatures in scene can speak; <b>8th</b> unlimited duration)"',
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
    'Description=' +
      '"Touched becomes invisible for 10 min or until it uses a hostile action (<b>heightened 4th</b> lasts 1 min, hostile action does not end)"',
  'Invisibility Sphere':
    'Level=3 ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' emanation makes creatures within invisible for 10 min or until any affected perform a hostile act (<b>heightened 5th</b> lasts for 1 rd)"',
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
    'Description=' +
      '"Touched object lights a 20\' radius until next daily preparations (<b>heightened 4th</b> 60\' radius)"',
  'Lightning Bolt':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"120\' line inflicts 4d12 HP electricity (<b>heightened +1</b> +1d12 HP) (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP)"',
  'Locate':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Reveals direction to named object or the nearest object of a named type while sustained (<b>heightened 5th</b> reveals direction to a creature or ancestry)"',
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
    'Description=' +
      '"Self gains +1 AC with a +5 maximum Dexterity modifier until next daily preparations (<b>heightened 4th</b> also +1 saves; <b>6th</b> +2 AC)"',
  'Mage Hand':
    'Level=Cantrip ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Allows self to move a light object 20\'/rd while sustained (<b>heightened 3rd</b> may move Bulk 1 object; <b>5th</b> move 60\'/rd; <b>7th</b> may move Bulk 2 object)"',
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
    'Description=' +
      '"R120\' 1 missile per action inflicts 1d4+1 force damage (<b>heightened +2</b> 1 additional missile per action)"',
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
    'Description=' +
      '"Touched weapon gains +1 attack and a second damage die for 1 min"',
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
    'Description=' +
      '"Self may enter touched stone, retaining the ability to hear outside sounds, for 10 min"',
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
    'Description=' +
      '"R120\' Self may hold a private conversation with visible target for 1 turn (<b>heightened 3rd</b> R500\')"',
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
    'Description=' +
      '"Allows a counteract check against 1 poison affecting touched"',
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
    'Description=' +
      '"R10\' Performs choice of cooking, lifting, make a minor object, or tidying while sustained"',
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
    'Description="Removes contaminates from 1 cubic foot of food or water"',
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
    'Description="R10\' Restores soul to a willing creature up to level 13 dead up to 3 days; gives target 1 HP, clumsy 2, drained 2, and enfeebled 2 for 1 week (<b>heightened +2</b> level +2)"',
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
    'Description=' +
      '"R120\' Spell attack inflicts 1d4+%{spellModifier.Arcane||spellModifier.Primal} HP cold (critical success inflicts double damage and -10 Speed for 1 rd) (<b>heightened +1</b> +1d4 HP)"',
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
    'Description="Allows a counteract attempt vs. a single fear effect affecting touched target (<b>heightened 6th</b> R30\' and may affect 10 targets)"',
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
    'Description=' +
      '"Touched target gains resistance 5 vs. chosen energy type for 10 min (<b>heightened 4th</b> resistance 10 and two targets; <b>7th</b> resistance 15 and 5 targets)"',
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
    'Description="R120\' Ranged spell attack inflicts 5d6 HP fire, +5d6 HP good to fiends and undead (critical success inflicts double HP) (<b>heightened +1</b> +2d6 HP)"',
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
    'Description=' +
      '"Self treats invisible creatures and objects as concealed for 10 min (<b>heightened 5th</b> effects last 8 hr)"',
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
    'Description=' +
      '"Self touch inflicts 2d12 HP electricity; +1 attack and 1d4 HP persistent damage vs. armored foe (<b>heightened +1</b> +1d12 HP initial and +1 HP persistent)"',
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
    'Description=' +
      '"Touched target makes no sound for 1 min (<b>heightened 4th</b> affects a 10\' radius around target)"',
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
    'Description=' +
      '"R30\' Target regains 1d10+4 HP and gains +2 saves vs. mental effects for 1 min (<b>heightened +1</b> +1d10+4 HP)"',
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
    'Description=' +
      '"Touched gains a climb Speed equal to its Speed for 10 min (<b>heightened 5th</b> effects last for 1 hr)"',
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
    'Description=' +
      '"R120\' Spectral weapon attacks 1/rd, inflicting 1d8 HP force or weapon type while sustained up to 1 min (<b>heightened +2</b> +1d8 HP)"',
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
    'Description=' +
      '"R30\' Target follows a reasonable suggestion for 1 min (<b>save Will</b> negates; critical success target notices spell; critical failure effects last 1 hr) (<b>heightened 8th</b> targets 10 creatures)"',
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
    'Description=' +
      '"R30\' Conjured celestial up to level 5 (<b>heightened +1</b> +2 level) fights foes while sustained up to 1 min"',
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
    'Description=' +
      '"R30\' Conjured dragon up to level 5 (<b>heightened +1</b> +2 level) fights foes while sustained up to 1 min"',
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
    'Description=' +
      '"Target can understand and speak all languages for 1 hr (<b>heightened 7th</b> lasts for 8 hr)"',
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
    'Description=' +
      '"Next self Strike in same turn uses the better of two rolls, ignores concealed or hidden, and ignores circumstance penalties"',
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
    'Description=' +
      '"R60\' Invisible servant obeys commands to move and manipulate objects while sustained"',
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
    'Description=' +
      '"Up to 10 creatures appear as different, similar creatures for 1 hr (<b>heightened 5th</b> also disguises voices and scents; <b>7th</b> targets may appear as specific individuals)"',
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
    'Description=' +
      '"R120\' 5\'x60\'x10\' line or 10\' radius inflicts 4d6 HP fire for 1 min (<b>heightened +1</b> +1d6 HP)"',
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
    'Description=' +
      '"Reveals a route to chosen destination and reduces movement penalty from difficult terrain by half until next daily preparations"',
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
    'Description=' +
      '"R30\' target becomes quickened and may take an additional Strike, Stride, or Step for 1 rd"',
  'Counter Performance':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allies in a 60\' radius may substitute self Performance roll for save"',
  'Dirge Of Doom':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="Inflicts frightened 1 on foes in a 30\' emanation for 1 rd"',
  'Fatal Aria':
    'Level=10 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts death (target up to level 16 or up to 50 HP), 0 HP and dying 1 (target level 17), or 50 HP damage (target level 18+)"',
  'House Of Imaginary Walls':
    'Level=Cantrip ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Creates an invisible, illusionary, 10\'x10\' wall with AC 10, double the spell level Hardness, and quadruple the spell level HP, for 1 rd"',
  'Inspire Competence':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Allows use of Performance to Aid an ally skill check, with normal failure counting as a success, for 1 rd"',
  'Inspire Courage':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives +1 attack, damage, and saves vs. fear for 1 rd"',
  'Inspire Defense':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives +1 AC and saves, plus resistance of half the spell level to physical damage, for 1 rd"',
  'Inspire Heroics':
    'Level=4 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"Allows a Performance check to increase effects of a subsequent Inspire Courage or Inspire Defense to +2 (critical success +3; no loss of Focus Point on failure)"',
  'Lingering Composition':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"Allows a Performance check to increase the duration of a subsequent cantrip composition to 3 rd (critical success 4 rd; no loss of Focus Point on failure)"',
  "Loremaster's Etude":
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"R30\' Target may take the better of two Recall Knowledge rolls"',
  'Soothing Ballad':
    'Level=7 ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self and up to 9 allies gain choice of counteracted fear effects, counteracted paralysis, or 7d8 HP restored (<b>heightened +1</b> restores +1d8 HP)"',
  'Triple Time':
    'Level=Cantrip ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="60\' emanation gives allies +10\' Speed for 1 rd"',
  "Champion's Sacrifice":
    'Level=6 ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="R30\' Redirects damage from an ally to self"',
  "Hero's Defiance":
    'Level=10 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Free ' +
    'Description="Self recovers 10d4+20 HP"',
  'Lay On Hands':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Restores 6 HP and gives +2 AC for 1 rd to touched living; undead suffers 1d6 HP and -2 AC for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts doubles HP) (<b>heightened +1</b> +6 HP or +1d6 damage)"',
  'Litany Against Sloth':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Evil target suffers reaction prevention and slowed 1 for 1 rd (<b>save Will</b> reaction prevention only; critical success negates; critical failure inflicts slowed 2)"',
  'Litany Against Wrath':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers 3d6 HP good whenever it damages a good creature for 1 rd (<b>save Will</b> first time damaging a good creature only; critical success negates; critical failure inflicts enfeebled 2)"',
  'Litany Of Righteousness':
    'Level=7 ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers weakness 7 to good for 1 rd (<b>heightened +1</b> weakness +1)"',
  'Agile Feet':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +5 Speed and may ignore difficult terrain for the remainder of turn"',
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
    'Description=' +
      '"15\' cone inflicts blinded for 1 rd (Interact action ends) and dazzled for 1 min (<b>save Fortitude</b> dazzled for 1 rd; critical success negates; critical failure inflicts dazzled for 1 hr) (<b>heightened 3rd</b> 30\' cone)"',
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
    'Description=' +
      '"R30\' Target gains +2 HP from healing spells for 1 min (<b>heightened +1</b> +1 HP)"',
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
    'Description=' +
      '"10\' radius light inflicts 2 HP positive to successful undead attackers for 1 min; may increase radius by 10\' and damage by 2 HP each rd; may end the spell early to heal a living creature or damage an undead creature by double HP (<b>heightened +1</b> +0.5 HP)"',
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
    'Description=' +
      '"R10\' Successful DC 6 flat check gives a one-word to target\'s short-term fate"',
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
    'Description=' +
      '"R30\' target gains +1 Will and +2 vs. emotion effects for 1 rd; also counteracts an existing emotion effect (<b>heightened 5th</b> +2 Will and +3 vs. emotion effects)"',
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
    'Description=' +
      '"R120\' Target gains +1 on triggering save, making it either a critical success or critical failure"',
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
    'Description=' +
      '"Self gains choice of climb or swim Speed equal to Speed for 1 min (<b>heightened 5th</b> may choose fly speed)"',
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
    'Description=' +
      '"Eating touched berry within 10 min restores 1d6+4 HP (<b>heightened +1</b> +1 berry)"',
  'Heal Animal':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched animal regains 1d8 HP, or R30\' animal regains 1d8+8 HP (<b>heightened +1</b> +1d8 HP or +1d8+8 HP)"',
  'Impaling Briars':
    'Level=8 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation inflicts choice of difficult terrain, -10 Speed (<b>save Reflex</b> negates; critical failure inflicts immobilized for 1 rd), or greater difficulty terrain each rd while sustained up to 1 min"',
  'Primal Summons':
    'Level=6 ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=Free ' +
    'Description=' +
      '"Subsequent <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> gives summoned creature choice of: 60\' fly Speed; 20\' burrow speed and -10\' Speed); +1d6 HP fire damage, resistance 10 to fire, and weakness 5 to cold and water; 60\' swim Speed, Shove after melee attack, and resistance 5 to fire"',
  'Storm Lord':
    'Level=9 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation produces the effects of choice of calm, foggy (conceals), rainy(-2 Acrobatics and Perception), or windy (-4 ranged attacks, flying suffers difficulty terrain) weather, plus a bolt of lighting that inflicts 10d6 HP electricity each rd (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP), while sustained up to 1 min"',
  'Stormwind Flight':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self may fly equal to Speed for 1 min (<b>heightened 6th</b> flying against the wind does not suffer difficult terrain effects)"',
  'Tempest Surge':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d12 HP electricity, clumsy 2 for 1 rd, and 1 persistent electricity (<b>save Reflex</b> HP only; critical success negates; critical failure inflicts double HP)"',
  'Wild Morph':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains choice of claws that inflict 1d6S HP, jaws that inflict 1d8P HP, resistance 5 to critical hits and precision damage, 10\' reach, or 30\' fly Speed for 1 min (<b>heightened 6th</b> may choose two effects, and claws and jaws inflict 2d6 persistent bleed and 2d6 persistent poison; <b>10th</b> may choose three effects, and claws and jaws inflict 4d6 persistent bleed and 4d6 persistent poison"',
  'Wild Shape':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Transforms self into a pest for 10 min or another creature for 1 min, gaining +2 attacks (<b>heightened 2nd</b> may transform into an animal form)"',
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
    'Description=' +
      '"5\' emanation (10\'/15\' emanation for 2/3 actions) inflicts stupefied 2 (<b>save Will</b> negates; critical failure inflicts confused) (<b>heightened +3</b> increases radius by 5\')"',
  'Abyssal Wrath':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 4d6 HP of variable type (roll d4): bludgeoning and electricity; acid and slashing; bludgeoning and cold; fire and piercing (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Ancestral Memories':
    'Level=1 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes trained in choice of non-Lore or ancestral Lore skill for 1 min (<b>heightened 6th</b> expert in chosen skill)"',
  'Angelic Halo':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"15\' emanation increases the effects of <i>Heal</i> by double the <i>Heal</i> spell\'s level"',
  'Angelic Wings':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self may fly at full Speed and casts a 30\' radius bright list for 3 rd (<b>heightened 5th</b> lasts 1 min)"',
  'Arcane Countermeasure':
    'Level=5 ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Reduces target heightened spell\'s level by 1 and gives that spell\'s targets +2 saves, skill checks, AC, or DC against it"',
  'Celestial Brand':
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Self and allies gain +1 attacks and skill checks vs. evil target, and attacks by good creatures inflict +1d4 HP good (<b>heightened +2</b> +1 HP good)"',
  'Diabolic Edict':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target performs stated task, gaining +1 attack and skill checks, for 1 rd; refusal inflicts -1 attack and skill checks for 1 rd"',
  'Dragon Breath':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    // TODO line/cone, energy type, and save type depend on dragon type
    'Description=' +
      '"30\' cone or 60\' line inflicts 5d6 HP energy (<b>heightened +1</b> +2d6 HP)"',
  'Dragon Claws':
    'Level=1 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self fingers inflict 1d6S HP+1d6 energy HP for 1 min; self gains resistance 5 to energy (<b>heightened 5th</b> 2d6S HP and resistance 10; <b>9th</b> 3d6S HP and resistance 15)"',
  'Dragon Wings':
    'Level=5 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains %{Speed>?60} fly Speed for 1 min (<b>heightened 8th</b> effects last 10 min)"',
  'Drain Life':
    'Level=3 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target suffers 3d4 HP negative; self gains equal temporary HP (<b>save Fortitude</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> +1d4 HP)"',
  'Elemental Blast':
    'Level=5 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Choice of 30\' cone, 60\' line, or R30\' 10\' burst inflicts 8d6 HP bludgeoning or fire (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +dd6 HP)"',
  'Elemental Motion':
    'Level=3 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self may fly at full Speed, swim at full speed and breathe water, or burrow at 10\' for 1 min (<b>heightened 6th</b> +10\' Speed; <b>9th</b>+20\' Speed)"',
  'Elemental Toss':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d8 HP bludgeoning or fire (<b>heightened +1</b> +1d8 HP)"',
  'Embrace The Pit':
    'Level=3 ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains resistance 5 to evil, fire, and poison, resistance 1 to non-silver physical damage, and weakness 5 to good for 1 min (<b>heightened +2</b> gives resistance 10/2 and weakness 10)"',
  'Extend Spell':
    'Level=3 ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Duration of subsequent targeted spell of less than maximum spell level increases from 1 min to 10 min"',
  'Faerie Dust':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' 5\' burst per action inflicts loss of reactions and -2 Perception and will for 1 rd (<b>save Will</b> negates; critical failure inflicts -1 Perception and Will for 1 min) (<b>heightened +3</b> +5\' radius)"',
  'Fey Disappearance':
    'Level=3 ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes invisible and may ignore natural difficult terrain until the end of next turn; performing a hostile action ends invisibility (<b>heightened 5th</b> hostile action does not end invisibility)"',
  'Fey Glamour':
    'Level=5 ' +
    'School=Illusion ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="R30\' 30\' burst cloaks up to 10 targets for 10 min"',
  "Glutton's Jaws":
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self jaws inflict 1d8P HP, giving self 1d6 temporary HP, for 1 min (<b>heightened +2</b> gives +1d6 temporary HP</b>)"',
  'Grasping Grave':
    'Level=5 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 20\' radius inflicts 6d6S HP and -10\' Speed for 10 min (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and immobilized) (<b>heightened +1</b> +2d6 HP)"',
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
    'Description=' +
      '"R30\' Inflicts enfeebled 1, clumsy 1, drained 1, or stupefied 1, based on target\'s highest ability modifier, until target saves up to 1 min (<b>save Will</b> negates; critical failure inflicts condition level 2)"',
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
    'Description=' +
      '"Extends self reach for touch spells and unarmed Strikes to 10\'; adding another action to touch spells extends reach to 20\' for 1 min (<b>heightened +2</b> adding another action extends touch spell reach to 30\')"',
  "Undeath's Blessing":
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched gains undead responses to <i>Heal</i> and <i>Harm</i> for 1 min, and <i>Harm</i> restores +2 HP (<b>save Will</b> <i>Heal</i> and <i>Harm</i> have half effect; critical success negates) (<b>heightened +1</b> <i>Harm</i> restores +2 HP)"',
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
    'Description=' +
      '"R30\' Target summoned creature gains +1 to all checks for 1 min"',
  'Call Of The Grave':
    'Level=1 ' +
    'School=Necromancy ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts sickened 1 (critical success sickened 2 and slowed 1)"',
  'Charming Words':
    'Level=1 ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Prevents target from taking hostile actions against self for 1 rd (<b>save Will</b> target suffers -1 attack and damage vs. self; critical success negates; critical failure inflicts stunned 1)"',
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
    'Description=' +
      '"R30\' Target may substitute self d20 roll for a saving throw or skill check within 1 rd"',
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
    'Description=' +
      '"R30\' Inflicts 1d4+1 force damage (<b>heightened +2</b> +1d4+1 HP)"',
  'Hand Of The Apprentice':
    'Level=1 ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R500\' Allows a remote attack with a melee weapon%{spellModifier.Arcane>strengthModifier?\', +\'+spellModifier.Arcane-strengthModifier+\' damage\':spellModifier.Arcane<strengthModifier?\', \'+spellModifier.Arcane-strengthModifier+\' damage\':\'\'}"',
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
    'Description=' +
      '"Touched gains +2 on next Acrobatics, Athletics, Fortitude, or Reflex check within next rd"',
  'Protective Ward':
    'Level=1 ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation gives +1 AC while sustained up to 1 min; radius increases by 5\' for every sustain"',
  'Shifting Form':
    'Level=4 ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains choice of +20\' Speed, climb or swim at half Speed, darkvision, 60\' imprecise scent, or claws that inflict 1d8S HP for 1 min"',
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
    'Description="60\' 5\' burst (10\'/15\' burst for 2/3 actions) appears to be difficult terrain for 1 min (<b>heightened 4th</b> may affect air instead of surface)"'
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
  'Shield':
    'Category=Martial Price=0 Damage=1d4B Bulk=0 Hands=1 Group=Shield',
  'Shield Boss':
    'Category=Martial Price=0.5 Damage=1d6B Bulk=0 Hands=1 Group=Shield',
  'Shield Spikes':
    'Category=Martial Price=0.5 Damage=1d6P Bulk=0 Hands=1 Group=Shield',
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

  rules.defineChoice('abilgens',
    'All 10s; standard ancestry boosts', 'All 10s; two free ancestry boosts',
    'Each 4d6, standard ancestry boosts', 'Each 4d6, one free ancestry boost'
  );
  rules.defineChoice('notes',
    'validationNotes.maximumInitialAbility:' +
      'Abilities may not exceed 18 until level >= 2'
  );

  for(let a in abilities) {
    rules.defineChoice('notes', a + ':%V (%1)');
    let baseAbility = 'base' + a.charAt(0).toUpperCase() + a.substring(1);
    rules.defineRule(a, baseAbility, '=', null,
      'abilityBoosts.' + a, '+', 'source * 2 - Math.max(Math.floor((dict["' + baseAbility + '"] + source * 2 - 20) / 2), 0)'
    );
    rules.defineRule(a + 'Modifier', a, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule
      (a + '.1', a + 'Modifier', '=', 'QuilvynUtils.signed(source)');
    rules.defineRule
      ('abilityBoostsAllocated', 'abilityBoosts.' + a, '+=', null);
    rules.defineRule
      ('validationNotes.maximumInitialAbility', a, '=', 'source>18 ? 1 : null');
  }

  rules.defineRule('abilityNotes.abilityBoosts',
    'level', '=', '4 + Math.floor(source / 5) * 4'
  );
  rules.defineRule('speed', '', '=', '25');
  rules.defineRule
    ('validationNotes.maximumInitialAbility', 'level', '?', 'source == 1');

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

  rules.defineChoice('notes',
    'abilityNotes.armorSpeedPenalty:%V Speed',
    'armorClass:%V (dexterity%1; %2)',
    'shield:%V%1%2%3%4',
    'skillNotes.armorSkillPenalty:%V strength and dexterity skills'
  );

  for(let a in armors)
    rules.choiceRules(rules, 'Armor', a, armors[a]);
  for(let s in shields)
    rules.choiceRules(rules, 'Shield', s, shields[s]);
  for(let w in weapons) {
    rules.choiceRules(rules, 'Weapon', w, weapons[w]);
    if(w != 'Shield') {
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
    }
  }

  rules.defineRule('abilityNotes.armorSpeedPenalty',
    'armorSpeedReduction', '=', null,
    'armorStrengthRequirement', '=', 'null',
    'strength', '?', 'source<dict["armorStrengthRequirement"]'
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
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitutionModifier', '=', null,
    'level', '*', null
  );
  rules.defineRule
    ('combatNotes.dexterityAttackAdjustment', 'dexterityModifier', '=', null);
  rules.defineRule
    ('combatNotes.strengthAttackAdjustment', 'strengthModifier', '=', null);
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  // For weapons with the finesse trait
  rules.defineRule('maxStrOrDex',
    'maxStrOrDexModifier', '=', 'source==dict.strengthModifier ? "strength" : "dexterity"'
  );
  rules.defineRule('maxStrOrDexModifier',
    'strengthModifier', '=', null,
    'dexterityModifier', '^', null
  );
  rules.defineRule('proficiencyBonus.Armor',
    'rank.Armor', '=', '2 * source',
    'proficiencyLevelBonus.Armor', '+', null
  );
  rules.defineRule('proficiencyLevelBonus.Armor',
    'rank.Armor', '=', 'source>0 ? 0 : null',
    'level', '+', null
  );
  rules.defineRule('rank.Armor', 'armorCategory', '=', '0');
  ['Unarmored Defense', 'Light Armor', 'Medium Armor', 'Heavy Armor'].forEach(a => {
    rules.defineRule('rank.Armor',
      'rank.' + a, '=', 'dict["armorCategory"]=="' + a.replace(/\s.*/, '') + '" ? source : null'
    );
    rules.defineRule('trainingLevel.' + a, '', '=', '0');
    rules.defineRule('rank.' + a, 'trainingLevel.' + a, '=', null);
  });
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
    rules.defineRule('trainingLevel.' + s, '', '=', '0');
    rules.defineRule('rank.' + s, 'trainingLevel.' + s, '=', null);
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
  rules, alignments, ancestries, backgrounds, classes, deities, bloodlines
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable(ancestries, ['Require', 'Features', 'Selectables', 'HitPoints', 'Size', 'Languages', 'Traits']);
  QuilvynUtils.checkAttrTable(backgrounds, ['Features', 'Selectables']);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitPoints', 'Ability', 'Features', 'Selectables', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'FollowerAlignments', 'Domain', 'Font', 'Skill', 'Spells', 'Weapon']);
  QuilvynUtils.checkAttrTable(bloodlines, ['SpellList', 'BloodlineSkills', 'GrantedSpells', 'BloodlineSpells', 'BloodMagic']);

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
  for(let b in bloodlines)
    rules.choiceRules(rules, 'Bloodline', b, bloodlines[b]);

  rules.defineRule('experienceNeeded', 'level', '=', 'source * 1000');
  rules.defineRule('level', 'experience', '=', 'Math.floor(source / 1000) + 1');

  QuilvynRules.validAllocationRules
    (rules, 'level', 'level', 'Sum "^levels\\."');

};

/* Defines rules related to magic use. */
Pathfinder2E.magicRules = function(rules, schools, spells, domains) {

  QuilvynUtils.checkAttrTable(schools, ['Spell', 'AdvancedSpell']);
  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Level', 'Traditions', 'Cast', 'Description']);
  QuilvynUtils.checkAttrTable(domains, ['Spell', 'AdvancedSpell']);

  for(let s in schools)
    rules.choiceRules(rules, 'School', s, schools[s]);
  for(let s in spells)
    rules.choiceRules(rules, 'Spell', s, spells[s]);
  for(let d in domains)
    rules.choiceRules(rules, 'Domain', d, domains[d]);

};

/* Defines rules related to character aptitudes. */
Pathfinder2E.talentRules = function(
  rules, feats, features, goodies, languages, skills, terrains
) {

  let matchInfo;

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Trait']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note', 'Action']);
  QuilvynUtils.checkAttrTable
    (goodies, ['Pattern', 'Effect', 'Value', 'Attribute', 'Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Category']);
  QuilvynUtils.checkAttrTable(terrains, []);

  rules.defineChoice('notes',
    'perception:%S (wisdom; %1)',
    'skillNotes.intelligenceLanguageBonus:+%V Language Count'
  );

  for(let g in goodies)
    rules.choiceRules(rules, 'Goody', g, goodies[g]);
  for(let l in languages) {
    rules.choiceRules(rules, 'Language', l, languages[l]);
    rules.defineRule('languagesSpoken', 'languages.' + l, '+=', '1');
  }
  rules.defineChoice
    ('notes', 'skillNotes.duplicatedTraining:Skill Trained (Choose %V from any)');
  rules.defineRule
    ('choiceCount.Skill', 'skillNotes.duplicatedTraining', '+=', null);
  for(let s in skills) {
    rules.choiceRules(rules, 'Skill', s, skills[s]);
    rules.defineRule('skillNotes.duplicatedTraining',
      'trainingCount.' + s, '+=', 'source>1 ? source - 1 : null'
    );
    rules.defineRule
      ('skillIncreasesAllocated', 'skillIncreases.' + s, '+=', null);
    let pattern =
      s.replaceAll('(', '\\(').replaceAll(')', '\\)').replace(/\s+/, '\\b\\s*');
    rules.choiceRules(rules, 'Goody', s,
      'Pattern="([-+]\\d+).*\\s+' + pattern + '\\s+Skill|' + pattern + '\\s+skill\\s+([-+]\\d+)"' +
      'Effect=add ' +
      'Value="$1 || $2" ' +
      'Attribute="skillModifiers.' + s + '" ' +
      'Section=skill Note="%V ' + s + '"'
    );
  }
  for(let t in terrains)
    rules.choiceRules(rules, 'Terrain', t, terrains[t]);
  // feats and features after skills because some contain %skill
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
    ('featCount.Ancestry', 'featureNotes.ancestryFeats', '=', null);
  rules.defineRule('featCount.General',
    '', '=', '0',
    'featureNotes.generalFeats', '+', null
  );
  rules.defineRule('featCount.Skill', 'featureNotes.skillFeats', '=', null);
  rules.defineRule('featureNotes.ancestryFeats',
    'level', '=', 'Math.floor((source + 3) / 4)'
  );
  rules.defineRule
    ('languageCount', 'skillNotes.intelligenceLanguageBonus', '+', null);
  rules.defineRule('perception',
    'proficiencyBonus.Perception', '=', null,
    'wisdomModifier', '+', null,
    'skillNotes.goodiesPerceptionAdjustment', '+', null
  );
  rules.defineRule('perception.1',
    'rank.Perception', '=', 'Pathfinder2E.RANK_NAMES[source]'
  );
  rules.defineRule('proficiencyBonus.Perception',
    'rank.Perception', '=', '2 * source',
    'proficiencyLevelBonus.Perception', '+', null
  );
  rules.defineRule('proficiencyLevelBonus.Perception',
    'rank.Perception', '?', 'source > 0',
    'level', '=', null
  );
  rules.defineRule('rank.Perception', 'trainingLevel.Perception', '=', null);
  rules.defineRule('skillNotes.intelligenceLanguageBonus',
    'intelligenceModifier', '=', 'source>0 ? source : null'
  );
  rules.defineRule('sumClassFeats', 'sumArchetypeFeats', '+=', null);
  rules.defineRule('trainingLevel.Perception', '', '=', '0');

  QuilvynRules.validAllocationRules
    (rules, 'AncestryFeats', 'featCount.Ancestry', 'sumAncestryFeats');
  QuilvynRules.validAllocationRules
    (rules, 'ClassFeats', 'featCount.Class', 'sumClassFeats');
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'languagesSpoken');
  QuilvynRules.validAllocationRules
    (rules, 'skillIncrease', 'choiceCount.Skill', 'skillIncreasesAllocated');
  // Because skill feats are also general feats, the number of selected general
  // feats must equal featCount.General + featCount.Skill, and the number of
  // selected skill feats may validly exceed featCount.Skill.
  rules.defineRule('generalPlusSkillFeatCount',
    'featCount.General', '+=', null,
    'featCount.Skill', '+=', null
  );
  QuilvynRules.validAllocationRules
    (rules, 'generalAndSkillFeat', 'generalPlusSkillFeatCount',
     'sumGeneralFeats');
  QuilvynRules.validAllocationRules
    (rules, 'skillFeat', 'featCount.Skill', 'sumSkillFeats');
  rules.defineRule('validationNotes.skillFeatAllocation', '', 'v', '0');

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
  } else if(type == 'Armor')
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
  else if(type == 'Background') {
    Pathfinder2E.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables')
    );
    Pathfinder2E.backgroundRulesExtra(rules, name);
  } else if(type == 'Bloodline') {
    Pathfinder2E.bloodlineRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'SpellList'),
      QuilvynUtils.getAttrValueArray(attrs, 'BloodlineSkills'),
      QuilvynUtils.getAttrValueArray(attrs, 'GrantedSpells'),
      QuilvynUtils.getAttrValueArray(attrs, 'BloodlineSpells'),
      QuilvynUtils.getAttrValue(attrs, 'BloodMagic')
    );
  } else if(type == 'Class') {
    Pathfinder2E.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Pathfinder2E.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Pathfinder2E.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'FollowerAlignments'),
      QuilvynUtils.getAttrValueArray(attrs, 'Font'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValue(attrs, 'Weapon'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells')
    );
  else if(type == 'Domain')
    Pathfinder2E.domainRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Spell'),
      QuilvynUtils.getAttrValue(attrs, 'AdvancedSpell')
    );
  else if(type == 'Feat') {
    Pathfinder2E.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Trait')
    );
    Pathfinder2E.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    Pathfinder2E.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note'),
      QuilvynUtils.getAttrValue(attrs, 'Action')
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
      QuilvynUtils.getAttrValue(attrs, 'Spell'),
      QuilvynUtils.getAttrValue(attrs, 'AdvancedSpell')
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
    trads.forEach(t => {
      let spellName =
        name + ' (' + t.charAt(0) + (level=='Cantrip' ? 0 : level) + ' ' + school.substring(0, 3) + ')';
      Pathfinder2E.spellRules(rules, spellName,
        school,
        level,
        t,
        QuilvynUtils.getAttrValue(attrs, 'Cast'),
        QuilvynUtils.getAttrValue(attrs, 'Description')
      );
      rules.addChoice('spells', spellName, attrs);
    });
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
  if(type != 'spells')
    rules.addChoice(type, name, attrs);
  if(type == 'skills' && name.endsWith(' Lore'))
    rules.addChoice('lores', name, attrs);
};

/*
 * Removes #name# from the set of user #type# choices, reversing the effects of
 * choiceRules. TODO
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
 * list of hard prerequisites #requires#. #hitPoints# gives the number of HP
 * granted at level 1, and #size# specifies the size of characters with the
 * ancestry. * #features# and #selectables# list associated automatic and
 * selectable features, #traits# any traits granted by the ancestry, and
 * #languages# any automatic languages.
 */
Pathfinder2E.ancestryRules = function(
  rules, name, requires, hitPoints, size, features, selectables, traits,
  languages
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

  rules.defineRule('selectableFeatureCount.' + name + ' (Heritage)',
    'featureNotes.' + prefix + 'Heritage', '=', '1'
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

  selectables.forEach(selectable => {
    let pieces = selectable.split(':');
    let s = pieces[pieces.length > 1 && pieces[0].match(/\d+$/) ? 1 : 0];
    let sType = s == s[pieces.length - 1] ? '' : pieces[pieces.length - 1];
    let sCount = prefix + sType.replaceAll(' ', '') + 'Count';
    rules.defineRule(sCount, prefix + 'Features.' + s, '+=', '1');
    QuilvynRules.validAllocationRules
      (rules, prefix + sType.replaceAll(' ', ''), 'selectableFeatureCount.' + name + (sType != '' ? ' (' + sType + ')' : ''), sCount);
    if(sType == 'Heritage')
      rules.defineRule
        ('heritage', prefix + 'Features.' + s, '=', '"' + s + '"');
  });

  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');
  rules.defineRule('hitPoints', ancestryLevel, '+=', hitPoints);
  rules.defineRule('size', ancestryLevel, '=', '"' + size + '"');

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
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.stonewalker', '1', 'Meld Into Stone', null, null,
       'Divine', null, null);
    rules.defineRule('weapons.Clan Dagger', 'features.Clan Dagger', '=', '1');
  } else if(name == 'Elf') {
    rules.defineRule('speed', 'elfLevel', '+', '5');
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.seerElf', '1', 'Detect Magic', null, null, 'Arcane',
       null, null);
  } else if(name == 'Goblin') {
    Pathfinder2E.weaponRules
      (rules, 'Jaws', 'Unarmed', 0, '1d6P', 0, 0, 'Brawling', ['Finesse', 'Unarmed'], null);
    rules.defineRule('weapons.Jaws', 'combatNotes.razortoothGoblin', '=', '1');
  } else if(name == 'Halfling') {
    rules.defineRule('skillNotes.nomadicHalfling',
      '', '=', '2',
      'features.Multilingual', '+', null
    );
  } else if(name == 'Human') {
    // TODO: proper way to handle skill expert?
    rules.defineRule('choiceCount.Skill',
      'skillNotes.skilledHeritageHuman', '+=', 'source=="Trained" ? 1 : 2'
    );
    rules.defineRule('skillNotes.skilledHeritageHuman',
      'level', '=', 'source<5 ? "Trained" : "Expert"'
    );
  }
};

/*
 * Defines in #rules# the rules associated with armor #name#, which belongs
 * to category #category#, costs #price# gold pieces, adds #ac# to the
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
  if(!Array.isArray(traits)) {
    console.log('Bad traits list "' + traits + '" for armor ' + name);
    return;
  }

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      bulk:{},
      category:{},
      dex:{},
      check:{},
      group:{},
      speed:{},
      str:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.bulk[name] = bulk;
  rules.armorStats.category[name] = category;
  rules.armorStats.dex[name] = maxDex;
  rules.armorStats.check[name] = checkPenalty;
  rules.armorStats.group[name] = group;
  rules.armorStats.speed[name] = speedPenalty;
  rules.armorStats.str[name] = minStr;

  rules.defineRule('armorACBonus',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.ac) + '[source]'
  );
  rules.defineRule('armorBulk',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.bulk) + '[source]'
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
  rules.defineRule('armorGroup',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.group) + '[source]'
  );
  rules.defineRule('armorSpeedReduction',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.speed) + '[source]'
  );
  rules.defineRule('armorStrengthRequirement',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.str) + '[source]'
  );

  rules.defineRule('rank.' + name, 'trainingLevel.' + name);
  rules.defineRule('rank.Armor',
    'rank.' + name, '^', 'dict["armor"]=="' + name + '" ? source : null'
  );

};

/*
 * Defines in #rules# the rules associated with background #name#. #features#
 * and #selectables# list the background's associated features and any
 * selectable features.
 */
Pathfinder2E.backgroundRules = function(rules, name, features, selectables) {
  let prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let backgroundLevel = prefix + 'Level';
  rules.defineRule(backgroundLevel,
    'background', '?', 'source == "' + name + '"',
    'level', '=', null
  );
  Pathfinder2E.featureListRules(rules, features, name, backgroundLevel, false);
  Pathfinder2E.featureListRules
    (rules, selectables, name, backgroundLevel, true);
  selectables.forEach(selectable => {
    let pieces = selectable.split(':');
    let s = pieces[pieces.length > 1 && pieces[0].match(/\d+$/) ? 1 : 0];
    let sType = s == s[pieces.length - 1] ? '' : pieces[pieces.length - 1];
    let sCount = prefix + sType.replaceAll(' ', '') + 'Count';
    rules.defineRule(sCount, prefix + 'Features.' + s, '+=', '1');
    QuilvynRules.validAllocationRules
      (rules, prefix + sType.replaceAll(' ', ''), 'selectableFeatureCount.' + name + (sType != '' ? ' (' + sType + ')' : ''), sCount);
  });
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');
};

/*
 * Defines in #rules# the rules associated with background #name# that cannot
 * be derived directly from the attributes passed to backgroundRules.
 */
Pathfinder2E.backgroundRulesExtra = function(rules, name) {
  if(name == 'Martial Disciple') {
    rules.defineRule('selectableFeatureCount.Martial Disciple (Martial Focus)',
      'featureNotes.martialFocus', '=', '1'
    );
  } else if(name == 'Scholar') {
    rules.defineRule('selectableFeatureCount.Scholar (Scholarly Tradition)',
      'featureNotes.scholarlyTradition', '=', '1'
    );
  }
};

Pathfinder2E.bloodlineRules = function(
  rules, name, spellList, bloodlineSkills, grantedSpells, bloodlineSpells,
  bloodMagic
) {

  if(!name) {
    console.log('Empty bloodline name');
    return;
  }
  if(!(spellList+'').match(/^(Arcane|Divine|Occult|Primal)$/)) {
    console.log('Bad spell list "' + spellList + '" for bloodline ' + name);
    return;
  }
  if(!Array.isArray(bloodlineSkills)) {
    console.log('Bad skills list "' + bloodlineSkills + '" for bloodline ' + name);
    return;
  }
  if(!Array.isArray(grantedSpells)) {
    console.log('Bad granted spells list "' + grantedSpells + '" for bloodline ' + name);
    return;
  }
  if(!Array.isArray(bloodlineSpells) || bloodlineSpells.length != 3) {
    console.log('Bad bloodline spells list "' + bloodlineSpells + '" for bloodline ' + name);
    return;
  }
  if(typeof(bloodMagic) != 'string') {
    console.log('Bad blood magic "' + bloodMagic + '" for bloodline ' + name);
    return;
  }

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  Pathfinder2E.featureRules(rules, name,
    ['magic', 'magic', 'skill'], [
      'Spell Trained (' + spellList + ')/' +
      'Knows the <i>' + bloodlineSpells[0] + '</i> spell',
      'Casting a bloodline spell ' + bloodMagic,
      'Skill Trained (' + bloodlineSkills.join('; ') + ')'
    ], null);

  rules.defineRule('bloodlineTraditions',
    'features.' + name, '=', '!dict.bloodlineTraditions ? "' + spellList + '" : !dict.bloodlineTraditions.includes("' + spellList + '") ? dict.bloodlineTraditions + "; ' + spellList + '" : dict.bloodlineTraditions'
  );
  rules.defineRule('magicNotes.advancedBloodline',
    'features.' + name, '=', '"' + bloodlineSpells[1] + '"'
  );
  rules.defineRule('magicNotes.basicBloodlineSpell',
    'features.' + name, '=', '"' + bloodlineSpells[0] + '"'
  );
  rules.defineRule('magicNotes.greaterBloodline',
    'features.' + name, '=', '"' + bloodlineSpells[2] + '"'
  );
  for(let i = 0; i < bloodlineSpells.length; i++) {
    let note =
      ['basicBloodlineSpell', 'advancedBloodline', 'greaterBloodline'][i];
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.' + note,
       'source=="' + bloodlineSpells[i] + '" ? 1 : null', bloodlineSpells[i],
       null, null, spellList, null, null);
    if(i == 0)
      Pathfinder2E.featureSpell
        (rules, 'magicNotes.' + prefix, '1', bloodlineSpells[0], null, null,
         spellList, null, null);
  }
  rules.defineRule('spellAttackModifier.' + spellList + '.1',
    'features.' + name, '=', '"charisma"'
  );
  rules.defineRule('spellDifficultyClass.' + spellList + '.1',
    'features.' + name, '=', '"charisma"'
  );
  rules.defineRule('spellModifier.' + name,
    'features.' + name, '?', null,
    'charismaModifier', '=', null
  );
  rules.defineRule
    ('spellModifier.' + spellList, 'spellModifier.' + name, '=', null);

  let spellSlots = [
    '0:5@1',
    '1:3@1;4@2',
    '2:3@3;4@4',
    '3:3@5;4@6',
    '4:3@7;4@8',
    '5:3@9;4@10',
    '6:3@11;4@12',
    '7:3@13;4@14',
    '8:3@15;4@16',
    '9:3@17;4@18',
    '10:1@19'
  ];
  rules.defineRule(prefix + 'Level',
    'features.' + name, '?', null,
    'levels.Sorcerer', '=', null
  );
  QuilvynRules.spellSlotRules
    (rules, prefix + 'Level', spellSlots.map(x => x.replace(/^/, spellList.charAt(0))));

};

/*
 * Defines in #rules# the rules associated with class #name#, which has the
 * list of hard prerequisites #requires#. #abilities# lists the possible
 * class abilities for the class. The class grants #hitPoints# additional hit
 * points with each level advance. #features# and #selectables# list the
 * fixed and selectable features acquired as the character advances in class
 * level. #spellSlots# lists the number of spells per level per day that the
 * class can cast.
 */
Pathfinder2E.classRules = function(
  rules, name, requires, abilities, hitPoints, features, selectables, spellSlots
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

  selectables.forEach(selectable => {
    let pieces = selectable.split(':');
    let s = pieces[pieces.length > 1 && pieces[0].match(/\d+$/) ? 1 : 0];
    let sType = s == s[pieces.length - 1] ? '' : pieces[pieces.length - 1];
    let sCount = prefix + sType.replaceAll(' ', '') + 'Count';
    rules.defineRule(sCount, prefix + 'Features.' + s, '+=', '1');
    QuilvynRules.validAllocationRules
      (rules, prefix + sType.replaceAll(' ', ''), 'selectableFeatureCount.' + name + (sType != '' ? ' (' + sType + ')' : ''), sCount);
  });

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
      rules.defineChoice('notes',
        'spellAttackModifier.' + spellType + ':%S (' + '%1; %2)',
        'spellDifficultyClass.' + spellType + ':%V (' + '%1; %2)'
      );
      rules.defineRule
        ('rank.' + spellType, 'trainingLevel.' + spellType, '=', null);
      rules.defineRule('proficiencyLevelBonus.' + spellType,
        'rank.' + spellType, '?', 'source > 0',
        'level', '=', null
      );
      rules.defineRule('spellModifier.' + name,
        classLevel, '?', null,
        abilities[0] + 'Modifier', '=', null
      );
      rules.defineRule
        ('spellModifier.' + spellType, 'spellModifier.' + name, '=', null);
      rules.defineRule('proficiencyBonus.' + spellType,
        'rank.' + spellType, '=', '2 * source',
        'proficiencyLevelBonus.' + spellType, '+', null
      );
      rules.defineRule('spellAttackModifier.' + spellType,
        'proficiencyBonus.' + spellType, '=', null,
        'spellModifier.' + spellType, '+', null
      );
      rules.defineRule('spellAttackModifier.' + spellType + '.1',
        classLevel, '=', '"' + abilities[0] + '"'
      );
      rules.defineRule('spellAttackModifier.' + spellType + '.2',
        'rank.' + spellType, '=', 'Pathfinder2E.RANK_NAMES[source]'
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'proficiencyBonus.' + spellType, '=', null,
        'spellModifier.' + spellType, '+', '10 + source'
      );
      rules.defineRule('spellDifficultyClass.' + spellType + '.1',
        classLevel, '=', '"' + abilities[0] + '"'
      );
      rules.defineRule('spellDifficultyClass.' + spellType + '.2',
        'rank.' + spellType, '=', 'Pathfinder2E.RANK_NAMES[source]'
      );
    }
  }

  rules.defineChoice('notes', 'classDifficultyClass.' + name + ':%V (%1; %2)');

  rules.defineRule
    ('classDifficultyClass.' + name, 'proficiencyBonus.' + name, '=', null);
  if(abilities.length == 1) {
    rules.defineRule('classDifficultyClass.' + name,
      abilities[0] + 'Modifier', '+', '10 + source'
    );
    rules.defineRule('classDifficultyClass.' + name + '.1',
      'classDifficultyClass.' + name, '=', '"' + abilities[0] + '"'
    );
  } else {
    abilities.forEach(a => {
      let modifier = a + 'Modifier';
      a = a.charAt(0).toUpperCase() + a.substring(1).toLowerCase();
      rules.defineRule('classDifficultyClass.' + name,
        modifier, '+', 'null',
        prefix + 'Features.' + a, '+', '10 + dict["' + modifier + '"]'
      );
      rules.defineRule('classDifficultyClass.' + name + '.1',
        prefix + 'Features.' + a, '=', '"' + a.toLowerCase() + '"'
      );
    });
  }
  rules.defineRule('classDifficultyClass.' + name + '.2',
    'rank.' + name, '=', 'Pathfinder2E.RANK_NAMES[source]'
  );
  rules.defineRule('classHitPoints', classLevel, '=', hitPoints);
  rules.defineRule('featureNotes.' + prefix + 'Feats',
    classLevel, '=', 'Math.floor(source / 2)' + (features.includes('1:' + name + ' Feats') ? ' + 1' : '')
  );
  rules.defineRule
    ('featCount.Class', 'featureNotes.' + prefix + 'Feats', '+=', null);
  rules.defineRule('featureNotes.generalFeats',
    classLevel, '=', 'source>=3 ? Math.floor((source + 1) / 4) : 0'
  );
  rules.defineRule('featureNotes.skillFeats',
    classLevel, '=', 'source>=2 ? Math.floor(source / 2) : null'
  );
  rules.defineRule('hitPoints', classLevel, '+=', 'source * ' + hitPoints);
  rules.defineRule('proficiencyBonus.' + name,
    'rank.' + name, '=', '2 * source',
    'proficiencyLevelBonus.' + name, '+', null
  );
  rules.defineRule('proficiencyLevelBonus.' + name,
    'rank.' + name, '?', 'source > 0',
    classLevel, '=', null
  );
  rules.defineRule('rank.' + name, 'trainingLevel.' + name, '=', null);
  rules.defineRule('skillNotes.skillIncreases',
    classLevel, '=', 'source>=3 ? Math.floor((source - 1) / 2) : null'
  );

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Pathfinder2E.classRulesExtra = function(rules, name) {

  let classLevel = 'levels.' + name;

  if(name == 'Alchemist') {
    rules.defineRule('advancedAlchemyLevel', classLevel, '=', null);
    rules.defineRule('combatNotes.weaponSpecialization',
      '', '=', '2',
      'combatNotes.greaterWeaponSpecialization', '+', '2'
    );
    rules.defineRule('hasClassWeaponExpertise',
      'features.Alchemical Weapon Expertise', '=', '1'
    );
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
    // TODO: Use a table for Animal and Dragon Instinct attacks?
    rules.defineRule('combatNotes.bestialRage',
      '', '=', '"Jaws"',
      'features.Animal Instinct (Ape)', '=', '"Fist"',
      'features.Animal Instinct (Bull)', '=', '"Horn"',
      'features.Animal Instinct (Deer)', '=', '"Antlers"',
      'features.Animal Instinct (Snake)', '=', '"Fangs"'
    );
    rules.defineRule('combatNotes.bestialRage.1',
      'features.Bestial Rage', '=', '"P"',
      'features.Animal Instinct (Ape)', '=', '"B"',
      'features.Animal Instinct (Frog)', '=', '"B"'
    );
    rules.defineRule('combatNotes.bestialRage.2',
      'features.Bestial Rage', '=', '""',
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
      'features.Specialization Ability', '=', '""',
      'features.Animal Instinct', '=', '" with natural weapon"',
      'features.Giant Instinct', '=', '" with a larger weapon"',
      'features.Spirit Instinct', '=', '" with Spirit Rage"'
    );
    rules.defineRule('combatNotes.specializationAbility.2',
      'features.Greater Weapon Specialization', '?', null,
      'features.Specialization Ability', '=', '12',
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
    let allSelectables = rules.getChoices('selectableFeatures');
    let instincts =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Instinct')).map(x => x.replace('Barbarian - ', ''));
    instincts.forEach(i => {
      if(i.includes('Animal Instinct'))
        rules.defineRule('features.Animal Instinct', 'features.' + i, '=', '1');
      else if(i.includes('Dragon Instinct'))
        rules.defineRule('features.Dragon Instinct', 'features.' + i, '=', '1');
    });
    rules.defineRule('hasClassWeaponExpertise', 'features.Brutality', '=', '1');
    rules.defineRule('saveNotes.ragingResistance',
      'features.Animal Instinct', '=', '"piercing and slashing"',
      'features.Dragon Instinct', '=', '"fire"',
      'features.Dragon Instinct (Black)', '=', '"acid"',
      'features.Dragon Instinct (Blue)', '=', '"electricity"',
      'features.Dragon Instinct (Green)', '=', '"poison"',
      'features.Dragon Instinct (White)', '=', '"cold"',
      'features.Dragon Instinct (Bronze)', '=', '"electricity"',
      'features.Dragon Instinct (Copper)', '=', '"acid"',
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
    rules.defineRule
      ('skillNotes.ragingIntimidation-1', 'rank.Intimidation', '?', null);
    rules.defineRule('skillNotes.ragingIntimidation-2',
      'rank.Intimidation', '?', 'source>=4',
      'level', '?', 'source>=15'
    );
  } else if(name == 'Bard') {
    rules.defineRule('focusPoints', 'magicNotes.compositionSpells', '+=', '1');
    rules.defineRule
      ('hasClassWeaponExpertise', 'features.Bard Weapon Expertise', '=', '1');
    rules.defineRule
      ('magicNotes.expertSpellcaster', classLevel, '=', '"Occult"');
    rules.defineRule
      ('magicNotes.legendarySpellcaster', classLevel, '=', '"Occult"');
    rules.defineRule
      ('magicNotes.masterSpellcaster', classLevel, '=', '"Occult"');
    rules.defineRule
      ('selectableFeatureCount.Bard (Muse)', 'featureNotes.muses', '=', '1');
    rules.defineRule
      ('skillNotes.bardSkills', 'intelligenceModifier', '=', '4 + source');
    rules.defineRule
      ('spellSlots.O0', 'magicNotes.occultSpellcasting', '=', 'null'); // italic
    rules.defineRule('spellSlots.O10', 'magicNotes.perfectEncore', '+', '1');
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.allegro', '1', 'Allegro', null, null, 'Occult', null,
       null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.compositionSpells', '1', 'Counter Performance', null,
       null, 'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.compositionSpells', '1', 'Inspire Courage', null,
       null, 'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.dirgeOfDoom', '1', 'Dirge Of Doom', null, null,
       'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.fatalAria', '1', 'Fatal Aria', null, null, 'Occult',
       null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.houseOfImaginaryWalls', '1',
       'House Of Imaginary Walls', null, null, 'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.inspireCompetence', '1', 'Inspire Competence', null,
       null, 'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.inspireCourage', '1', 'Inspire Courage', null, null,
       'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.inspireDefense', '1', 'Inspire Defense', null, null,
       'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.inspireHeroics', '1', 'Inspire Heroics', null, null,
       'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.lingeringComposition', '1', 'Lingering Composition',
       null, null, 'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, "magicNotes.loremaster'sEtude", '1', "Loremaster's Etude", null,
       null, 'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.maestro', '1', 'Soothe', null, null, 'Occult', null,
       null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.soothingBallad', '1', 'Soothing Ballad', null, null,
       'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.tripleTime', '1', 'Triple Time', null, null,
       'Occult', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.enigma', '1', 'True Strike', null, null, 'Occult',
       null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.polymath', '1', 'Unseen Servant', null, null,
       'Occult', null, null);
  } else if(name == 'Champion') {
    rules.defineRule('combatNotes.deificWeapon-1',
      'deityWeaponCategory', '?', 'source && source.match(/Simple|Unarmed/)',
      'deityWeapon', '=', null
    );
    ['dragonslayerOath', 'fiendsbaneOath', 'shiningOath'].forEach(f => {
      rules.defineRule('combatNotes.' + f,
        'features.Glimpse Of Redemption', '=', '"Glimpse Of Redemption grants %{level+7} damage resistance"',
        'features.Liberating Step', '=', '"Liberating Step grants +4 checks and a 2nd Step"',
        'features.Retributive Strike', '=', '"Retributive Strike inflicts +4 HP damage (+6 HP with master proficiency)"'
      );
    });
    rules.defineRule('combatNotes.exalt(Paladin)',
      'combatNotes.auraOfVengeance', '=', 'null' // italics
    );
    rules.defineRule('focusPoints', 'magicNotes.devotionSpells', '+=', '1');
    rules.defineRule('featureNotes.divineAlly',
      '', '=', '1',
      'featureNotes.secondAlly', '+', '1'
    );
    rules.defineRule
      ('hasClassWeaponExpertise', 'features.Weapon Expertise', '=', '1');
    rules.defineRule('selectableFeatureCount.Champion (Cause)',
      'featureNotes.deityAndCause', '=', '1'
    );
    rules.defineRule("selectableFeatureCount.Champion (Champion's Code)",
      "featureNotes.champion'sCode", '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Champion (Divine Ally)',
      'featureNotes.divineAlly', '=', null
    );
    rules.defineRule('selectableFeatureCount.Champion (Key Ability)',
      'featureNotes.championKeyAbility', '=', '1'
    );
    rules.defineRule
      ('shieldHardness', 'combatNotes.divineAlly(Shield)', '+', '2');
    rules.defineRule('shieldHP', 'shieldHP.1', '*', null);
    rules.defineRule('shieldHP.1',
      'combatNotes.divineAlly(Shield)', '=', '1.5',
      'combatNotes.shieldParagon', '^', '2'
    );
    rules.defineRule
      ('skillNotes.championSkills', 'intelligenceModifier', '=', '2 + source');
    rules.defineRule('spellModifier.Champion',
      classLevel, '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Divine', 'spellModifier.Champion', '=', null);
    rules.defineRule
      ('spellAttackModifier.Divine.1', classLevel, '=', '"charisma"');
    rules.defineRule
      ('spellDifficultyClass.Divine.1', classLevel, '=', '"charisma"');
    Pathfinder2E.featureSpell
      (rules, "magicNotes.hero'sDefiance", '1', "Hero's Defiance", null, null,
       'Divine', null,
       null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.liberator', '1', 'Lay On Hands', null, null,
       'Divine', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.paladin', '1', 'Lay On Hands', null, null, 'Divine',
       null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.redeemer', '1', 'Lay On Hands', null, null, 'Divine',
       null, null);
    rules.defineChoice
      ('notes', 'validationNotes.championAlignment:Requires deityFollowerAlignments =~ alignment');
    rules.defineRule('validationNotes.championAlignment',
      classLevel, '?', null,
      'deityFollowerAlignments', '?', null,
      'alignment', '=', 'dict.deityFollowerAlignments.split("/").includes(source.replaceAll(/[a-z ]/g, "")) ? null : 1'
    );
  } else if(name == 'Cleric') {
    rules.defineRule('combatNotes.cloisteredCleric',
      'level', '?', 'source>=11',
      'deityWeapon', '=', null
    );
    rules.defineRule
      ('combatNotes.cloisteredCleric-1', 'level', '?', 'source>=11');
    rules.defineRule('combatNotes.deadlySimplicity',
      'deityWeaponCategory', '?', 'source && source.match(/Simple|Unarmed/)',
      'deityWeapon', '=', null
    );
    rules.defineRule('combatNotes.deity', 'deityWeapon', '=', null);
    rules.defineRule('combatNotes.deityAndCause', 'deityWeapon', '=', null);
    rules.defineRule('combatNotes.warpriest',
      '', '=', '"Trained"',
      'features.Divine Defense', '=', '"Expert"'
    );
    rules.defineRule('combatNotes.warpriest.1',
      'features.Warpriest', '?', null,
      'deityWeapon', '=', null
    );
    rules.defineRule('combatNotes.warpriest-1', 'level', '?', 'source>=7');
    rules.defineRule('featureNotes.warpriest-1',
      'features.Warpriest', '?', null,
      'deityWeaponCategory', '?', 'source.match(/Simple|Unarmed/)'
    );
    rules.defineRule('hasClassWeaponExpertise',
      'features.Cloistered Cleric', '=', '1',
      'features.Warpriest', '=', '1'
    );
    rules.defineRule('magicNotes.cloisteredCleric',
      'level', '=', 'source<15 ? "Expert" : source<19 ? "Master" : "Legendary"'
    );
    rules.defineRule('magicNotes.deity',
      'deitySpells', '=', '"<i>" + source.replaceAll(/[0-9]+:/g, "").replaceAll("/", "</i>, <i>") + "</i>"'
    );
    rules.defineRule('magicNotes.deityAndCause',
      'deitySpells', '=', '"<i>" + source.replaceAll(/[0-9]+:/g, "").replaceAll("/", "</i>, <i>") + "</i>"'
    );
    rules.defineRule
      ('magicNotes.warpriest', 'level', '=', 'source<19 ? "Expert" : "Master"');
    rules.defineRule('trainingLevel.Divine',
      'magicNotes.cloisteredCleric', '^=', 'source=="Expert" ? 2 : source=="Master" ? 3 : 4',
      'magicNotes.warpriest', '^=', 'source=="Expert" ? 2 : 3'
    );
    rules.defineRule('trainingLevel.Fortitude',
      'saveNotes.warpriest', '^=', 'source=="Expert" ? 2 : 3'
    );
    rules.defineRule('trainingLevel.Light Armor',
      'combatNotes.warpriest', '^=', 'source=="Expert" ? 2 : 1'
    );
    rules.defineRule('trainingLevel.Medium Armor',
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
    rules.defineRule('skillNotes.deityAndCause', 'deitySkill', '=', null);
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
      rules.defineRule('magicNotes.harmfulFont', 'spellSlots.D' + l, '^=', l);
      rules.defineRule('magicNotes.healingFont', 'spellSlots.D' + l, '^=', l);
      rules.defineRule('spellSlots.D' + l,
        'magicNotes.harmfulFont', '+', 'source==' + l + ' ? dict["charismaModifier"]+1 : null',
        'magicNotes.healingFont', '+', 'source==' + l + ' ? dict["charismaModifier"]+1 : null'
      );
    });
    rules.defineRule('spellSlots.D10',
      'magicNotes.miraculousSpell', '=', 'null', // italics
      'magicNotes.makerOfMiracles', '+', '1'
    );
    rules.defineChoice
      ('notes', 'validationNotes.clericAlignment:Requires deityFollowerAlignments =~ alignment');
    rules.defineRule('validationNotes.clericAlignment',
      classLevel, '?', null,
      'deityFollowerAlignments', '?', null,
      'alignment', '=', 'dict.deityFollowerAlignments.split("/").includes(source.replaceAll(/[a-z ]/g, "")) ? null : 1'
    );
  } else if(name == 'Druid') {
    rules.defineRule
      ('hasClassWeaponExpertise', 'features.Druid Weapon Expertise', '=', '1');
    rules.defineRule('focusPoints', 'magicNotes.druidicOrder', '+=', '1');
    rules.defineRule
      ('languages.Druidic', 'skillNotes.druidicLanguage', '=', '1');
    rules.defineRule
      ('magicNotes.expertSpellcaster', classLevel, '=', '"Primal"');
    rules.defineRule
      ('magicNotes.legendarySpellcaster', classLevel, '=', '"Primal"');
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
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.animal', '1', 'Heal Animal', null, null, 'Primal',
       null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.leaf', '1', 'Goodberry', null, null, 'Primal', null,
       null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.storm', '1', 'Tempest Surge', null, null, 'Primal',
       null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.wild', '1', 'Wild Morph', null, null, 'Primal', null,
       null);
  } else if(name == 'Fighter') {
    rules.defineRule('hasClassWeaponExpertise', 'levels.Fighter', '=', '1');
    rules.defineRule('selectableFeatureCount.Fighter (Key Ability)',
      'featureNotes.fighterKeyAbility', '=', '1'
    );
    rules.defineRule
      ('skillNotes.fighterSkills', 'intelligenceModifier', '=', '3 + source');
    rules.defineRule('trainingLevel.Will', 'saveNotes.bravery', '^=', '2');
  } else if(name == 'Monk') {
    rules.defineRule('abilityNotes.incredibleMovement',
      'level', '=', 'Math.floor((source + 5) / 4) * 5'
    );
    rules.defineRule('abilityNotes.incredibleMovement.1',
      'features.Incredible Movement', '?', null,
      'armor', '?', 'source == "None"',
      'abilityNotes.incredibleMovement', '=', null
    );
    rules.defineRule('combatNotes.monasticWeaponry',
      '', '=', '"Trained"',
      'trainingLevel.Unarmed Attacks', '=', 'source>2 ? "Master" : source>1 ? "Expert" : null'
    );
    rules.defineRule('featureNotes.pathToPerfection',
      '', '=', '1',
      'featureNotes.secondPathToPerfection', '+', '1'
    );
    rules.defineRule
      ('hasClassWeaponExpertise', 'features.Expert Strikes', '=', '1');
    rules.defineRule('magicNotes.gracefulLegend',
      'magicNotes.kiTradition(Divine)', '=', '"Divine"',
      'magicNotes.kiTradition(Occult)', '=', '"Occult"'
    );
    rules.defineRule('magicNotes.monkExpertise',
      'magicNotes.kiTradition(Divine)', '=', '"Divine"',
      'magicNotes.kiTradition(Occult)', '=', '"Occult"'
    );
    rules.defineRule('selectableFeatureCount.Monk (Ki Tradition)',
      'featureNotes.kiTradition', '=', null
    );
    rules.defineRule('selectableFeatureCount.Monk (Key Ability)',
      'featureNotes.monkKeyAbility', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Monk (Perfection)',
      'featureNotes.pathToPerfection', '=', null
    );
    rules.defineRule('selectableFeatureCount.Monk (Third Perfection)',
      'featureNotes.thirdPathToPerfection', '=', null
    );
    rules.defineRule
      ('skillNotes.monkSkills', 'intelligenceModifier', '=', '4 + source');
    rules.defineRule('speed', 'abilityNotes.incredibleMovement.1', '+', null);
    rules.defineRule('spellModifierDivine.Monk',
      'magicNotes.kiTradition(Divine)', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('spellModifierOccult.Monk',
      'magicNotes.kiTradition(Occult)', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Divine', 'spellModifierDivine.Monk', '=', null);
    rules.defineRule
      ('spellModifier.Occult', 'spellModifierOccult.Monk', '=', null);
    rules.defineRule('spellAttackModifier.Divine.1',
      'spellModifierDivine.Monk', '=', '"wisdom"'
    );
    rules.defineRule('spellAttackModifier.Occult.1',
      'spellModifierOccult.Monk', '=', '"wisdom"'
    );
    rules.defineRule('spellDifficultyClass.Divine.1',
      'spellModifierDivine.Monk', '=', '"wisdom"'
    );
    rules.defineRule('spellDifficultyClass.Occult.1',
      'spellModifierOccult.Monk', '=', '"wisdom"'
    );
    rules.defineRule('trainingLevel.Divine',
      'magicNotes.gracefulLegend', '^=', 'source=="Divine" ? 3 : null',
      'magicNotes.monkExpertise', '^=', 'source=="Divine" ? 2 : null'
    );
    rules.defineRule('trainingLevel.Monk',
      'combatNotes.monasticWeaponry', '=', 'source=="Expert" ? 3 : source=="Master" ? 2 : 1'
    );
    rules.defineRule('trainingLevel.Occult',
      'magicNotes.gracefulLegend', '^=', 'source=="Occult" ? 3 : null',
      'magicNotes.monkExpertise', '^=', 'source=="Occult" ? 2 : null'
    );
    rules.defineRule
      ('weaponDieSides.Fist', 'combatNotes.powerfulFist', '^', '6');
  } else if(name == 'Ranger') {
    rules.defineRule('combatNotes.monsterHunter',
      '', '=', '1',
      'combatNotes.legendaryMonsterHunter', '+', '1'
    );
    rules.defineRule('combatNotes.monsterWarden',
      '', '=', '1',
      'combatNotes.legendaryMonsterHunter', '+', '1'
    );
    rules.defineRule
      ('hasClassWeaponExpertise', 'features.Ranger Weapon Expertise', '=', '1');
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Edge)",
      "featureNotes.hunter'sEdge", '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Key Ability)',
      'featureNotes.rangerKeyAbility', '=', '1'
    );
    rules.defineRule
      ('skillNotes.masterfulHunter', 'rank.Perception', '?', 'source >= 3');
    rules.defineRule
      ('skillNotes.masterfulHunter-1', 'rank.Survival', '?', 'source >= 3');
    rules.defineRule('skillNotes.masterfulHunter-2',
      'features.Outwit', '?', null,
      'rank.Deception', '?', 'source >= 3'
    );
    rules.defineRule
      ('skillNotes.rangerSkills', 'intelligenceModifier', '=', '4 + source');
    rules.defineRule('skillNotes.snareSpecialist',
      'rank.Crafting', '=', 'source<3 ? 4 : source<4 ? 6 : 8',
      'skillNotes.ubiquitousSnares', '*', '2'
    );
  } else if(name == 'Rogue') {
    rules.defineRule('combatNotes.ruffian',
      '', '=', '"Trained"',
      'rank.Light Armor', '=', 'source>=3 ? "Master" : source==2 ? "Expert" : null'
    );
    rules.defineRule('featureNotes.rogueFeats',
      classLevel, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('featureNotes.skillFeats', classLevel, '=', null);
    rules.defineRule
      ('hasClassWeaponExpertise', 'features.Weapon Tricks', '=', '1');
    rules.defineRule('selectableFeatureCount.Rogue (Racket)',
      "featureNotes.rogue'sRacket", '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Rogue (Key Ability)',
      'featureNotes.rogueKeyAbility', '=', '1'
    );
    rules.defineRule
      ('skillNotes.rogueSkills', 'intelligenceModifier', '=', '7 + source');
    rules.defineRule('skillNotes.skillIncreases',
      classLevel, '=', 'source>=2 ? source - 1 : null'
    );
    rules.defineRule('trainingLevel.Medium Armor',
      'combatNotes.ruffian', '^=', 'source=="Master" ? 3 : source=="Expert" ? 2 : 1'
    );
  } else if(name == 'Sorcerer') {
    rules.defineRule('bloodlineTraditionsLowered',
      'bloodlineTraditions', '=', 'source.toLowerCase()'
    );
    rules.defineRule('focusPoints', 'magicNotes.bloodline', '+=', '1');
    rules.defineRule('hasClassWeaponExpertise',
      'features.Sorcerer Weapon Expertise', '=', '1'
    );
    rules.defineRule
      ('magicNotes.expertSpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.legendarySpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.masterSpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.sorcererSpellcasting', 'bloodlineTraditions', '=', null);
    ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
      rules.defineRule('trainingLevel.' + t,
        'magicNotes.expertSpellcaster', '^=', 'source.includes("' + t + '") ? 2 : null',
        'magicNotes.masterSpellcaster', '^=', 'source.includes("' + t + '") ? 3 : null',
        'magicNotes.legendarySpellcaster', '^=', 'source.includes("' + t + '") ? 4 : null'
      );
    });
    rules.defineRule('selectableFeatureCount.Sorcerer (Bloodline)',
      'featureNotes.bloodline', '=', '1'
    );
    rules.defineRule
      ('skillNotes.sorcererSkills', 'intelligenceModifier', '=', '2 + source');
    rules.defineRule('spellModifier.Sorcerer',
      classLevel, '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule
      ('spellSlots.O10', 'magicNotes.bloodlineParagon', '+', 'null'); // italics
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
      rules.defineRule
        ('magicNotes.divineEvolution', 'spellSlots.D' + l, '^=', l);
      rules.defineRule('spellSlots.D' + l,
        'magicNotes.divineEvolution', '+', 'source==' + l + ' ? 1 : null'
      );
      rules.defineRule
        ('magicNotes.primalEvolution', 'spellSlots.P' + l, '^=', l);
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
    rules.defineRule
      ('hasClassWeaponExpertise', 'features.Wizard Weapon Expertise', '=', '1');
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
    rules.defineRule('spellSlots.A10',
      "magicNotes.archwizard'sSpellcraft", '+', 'null', // italics
      "magicNotes.archwizard'sMight", '+', '1'
    );
    [3, 4, 5, 6, 7, 8, 9, 10].forEach(l => {
      rules.defineRule
        ('magicNotes.scrollSavant', 'spellSlots.A' + l, '^=', l - 2);
      rules.defineRule
        ('magicNotes.superiorBond', 'spellSlots.A' + l, '^=', l - 2);
    });
  }

};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, #followerAlignments# lists the alignments permitted
 * for followers, #fonts# and #domains# lists the divine fonts and associated
 * domains, #weapon# is the deity's favored weapon, #skill# the divine skill,
 * and #spells# lists associated cleric spells.
 */
Pathfinder2E.deityRules = function(
  rules, name, alignment, followerAlignments, fonts, domains, weapon, skill,
  spells
) {

  if(!name) {
    console.log('Empty deity name');
    return;
  }
  if(name != 'None' && !(alignment+'').match(/^(N|[LNC]G|[LNC]E|[LC]N)$/i)) {
    console.log('Bad alignment "' + alignment + '" for deity ' + name);
    return;
  }
  if(!Array.isArray(followerAlignments)) {
    console.log('Bad follower alignments list "' + followerAlignments + '" for deity ' + name);
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
      followerAlignments:{},
      fonts:{},
      domains:{},
      weapon:{},
      weaponCategory:{},
      skill:{},
      spells:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.followerAlignments[name] = followerAlignments.join('/');
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
  rules.defineRule('deityFollowerAlignments',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.followerAlignments) + '[source]'
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

  rules.defineRule('deityWeaponRank',
    'deityWeapon', '=', 'null',
    'rank.' + weapon, '=', 'dict.deityWeapon=="' + weapon + '" ? source : null'
  );
  rules.defineRule('trainingLevel.' + skill,
    'skillNotes.deity', '^=', 'source=="' + skill + '" ? 1 : null',
    'skillNotes.deityAndCause', '^=', 'source=="' + skill + '" ? 1 : null'
  );
  rules.defineRule('trainingLevel.' + weapon,
    'combatNotes.cloisteredCleric', '^', 'source=="' + weapon + '" ? 2 : null',
    'combatNotes.deity', '^=', 'source=="' + weapon + '" ? 1 : null',
    'combatNotes.deityAndCause', '^=', 'source=="' + weapon + '" ? 1 : null',
    'combatNotes.warpriest.1', '^', 'source=="' + weapon + '" ? 2 : null'
  );
  rules.defineRule('weaponDieSidesBonus.' + weapon,
    'combatNotes.deificWeapon-1', '+=', 'source=="' + weapon + '" ? 2 : null',
    'combatNotes.deadlySimplicity', '+=', 'source=="' + weapon + '" ? 2 : null'
  );

};

/*
 * Defines in #rules# the rules associated with domain #name#. #spell# and
 * #advancedSpell# designate the spells associated with the domain.
 */
Pathfinder2E.domainRules = function(rules, name, spell, advancedSpell) {

  Pathfinder2E.featureRules(
    rules, "Advanced Deity's Domain (" + name + ')', ['magic'],
    ['Knows the <i>' + advancedSpell + '</i> spell/+1 Focus Points'], null
  );
  Pathfinder2E.featureRules(
    rules, 'Advanced Domain (' + name + ')', ['magic'],
    ['Knows the <i>' + advancedSpell + '</i> spell/+1 Focus Points'], null
  );
  Pathfinder2E.featureRules(
    rules, "Deity's Domain (" + name + ')', ['magic'],
     ['Knows the <i>' + spell + '</i> spell'], null
  );
  Pathfinder2E.featureRules(
    rules, 'Domain Initiate (' + name + ')', ['magic'],
    ['Knows the <i>' + spell + '</i> spell/Has a focus pool with 1 Focus Point'], null
  );

  let condensed = name.replaceAll(' ', '');
  rules.defineRule('domain',
    "magicNotes.deity'sDomain(" + condensed + ')', '=', '"' + name + '"',
    'magicNotes.domainInitiate(' + condensed + ')', '=', '"' + name + '"'
  );
  rules.defineRule('features.Advanced Domain',
    'features.Advanced Domain (' + name + ')', '=', '1'
  );
  rules.defineRule
    ('focusPoints', 'magicNotes.domainInitiate(' + condensed + ')', '+=', '1');
  Pathfinder2E.featureSpell
    (rules, "magicNotes.deity'sDomain(" + condensed + ')', '1', spell, null,
     null, 'Divine', null, null);
  Pathfinder2E.featureSpell
    (rules, 'magicNotes.domainInitiate(' + condensed + ')', '1', spell, null,
     null, 'Divine', null, null);
  Pathfinder2E.featureSpell
    (rules, "magicNotes.advancedDeity'sDomain(" + condensed + ')', '1',
     advancedSpell, null, null, 'Divine', null, null);
  Pathfinder2E.featureSpell
    (rules, 'magicNotes.advancedDomain(' + condensed + ')', '1', advancedSpell,
     null, null, 'Divine', null, null);

};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #traits#
 * lists the traits of the feat.
 */
Pathfinder2E.featRules = function(rules, name, requires, implies, traits) {

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
  if(!Array.isArray(traits)) {
    console.log('Bad traits list "' + traits + '" for feat ' + name);
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
  traits.forEach(t => {
    rules.defineRule('sum' + t + 'Feats', 'feats.' + name, '+=', null);
    if(t == 'Archetype') {
      let classes =
        traits.filter(t => !t.match(/Archetype|Dedication|Multiclass/));
      if(classes.length > 0)
        rules.defineRule
          ('sum' + classes[0] + 'ArchetypeFeats', 'feats.' + name, '+=', null);
    }
  });

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
    rules.defineRule('skillNotes.additionalLore(' + matchInfo[1].replaceAll(' ', '') + ')',
      'level', '=', 'source<3 ? "Trained" : source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
    rules.defineRule('trainingLevel.' + matchInfo[1],
      'skillNotes.' + prefix, '^=', 'source=="Trained" ? 1 : source=="Expert" ? 2 : source=="Master" ? 3 : 4'
    );
  } else if(name == 'Advanced Fury') {
    rules.defineRule
      ('featureNotes.advancedFury', 'feats.Advanced Fury', '=', null);
  } else if(name == 'Alchemist Dedication') {
    rules.defineRule
      ('advancedAlchemyLevel', 'featureNotes.alchemistDedication', '=', '1');
  } else if((matchInfo = name.match(/^(Arcane|Bloodline|Divine|Occult|Primal) Breadth$/)) != null) {
    let trad = matchInfo[1];
    let c = {'Arcane':'Wizard', 'Bloodline':'Sorcerer', 'Divine':'Cleric', 'Occult':'Bard', 'Primal':'Druid'}[trad];
    let note = 'magicNotes.' + trad.toLowerCase() + 'Breadth';
    rules.defineRule(note,
      'level', '?', null, // force recomputation when level changes
      'magicNotes.basic' + c + 'Spellcasting', '=', '1',
      'magicNotes.expert' + c + 'Spellcasting', '^', 'dict.level>=16 ? 4 : dict.level>=14 ? 3 : 2',
      'magicNotes.master' + c + 'Spellcasting', '^', 'dict.level>=20 ? 6 : 5'
    );
    if(c == 'Sorcerer') {
      ['A', 'D', 'O', 'P'].forEach(trad => {
        rules.defineRule(note + '.' + trad + '.1',
          'bloodlineTraditions', '?', 'source && source.includes("' + trad + '")',
           note, '=', null
        );
        [1, 2, 3, 4, 5, 6].forEach(l => {
          rules.defineRule('spellSlots.' + trad.charAt(0) + l,
            note + '.' + trad + '.1', '+', 'source>=' + l + ' ? 1 : null'
          );
        });
      });
    } else {
      [1, 2, 3, 4, 5, 6].forEach(l => {
        rules.defineRule('spellSlots.' + trad.charAt(0) + l,
          note, '+', 'source>=' + l + ' ? 1 : null'
        );
      });
    }
  } else if(name == 'Arcane School Spell') {
    rules.defineRule('focusPoints', 'magicNotes.arcaneSchoolSpell', '+=', '1');
  } else if(name == 'Armor Proficiency') {
    rules.defineRule('combatNotes.armorProficiency',
      '', '=', '"Light"',
      'trainingLevel.Light Armor', '=', 'source>0 ? "Medium" : null',
      'trainingLevel.Medium Armor', '=', 'source>0 ? "Heavy" : null'
    );
    rules.defineRule
      ('rank.Light Armor', 'combatNotes.armorProficiency', '^=', '1');
    rules.defineRule('rank.Medium Armor',
      'combatNotes.armorProficiency', '^=', 'source!="Light" ? 1 : null'
    );
    rules.defineRule('rank.Heavy Armor',
      'combatNotes.armorProficiency', '^=', 'source=="Heavy" ? 1 : null'
    );
  } else if(name == 'Barbarian Dedication') {
    // Suppress validation errors for selected instinct
    let allSelectables = rules.getChoices('selectableFeatures');
    let instincts =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Barbarian (Instinct)')).map(x => x.replace('Barbarian - ', ''));
    instincts.forEach(i => {
      let condensed = i.replaceAll(' ', '');
      rules.defineRule('validationNotes.barbarian-' + condensed + 'SelectableFeature',
        'featureNotes.barbarianDedication', '+', '1'
      );
    });
  } else if((matchInfo = name.match(/^(Barbarian|Champion|Fighter|Monk|Ranger) Resiliency$/)) != null) {
    let c = matchInfo[1];
    rules.defineRule('combatNotes.' + c.toLowerCase() + 'Resiliency',
      'sum' + c + 'ArchetypeFeats', '=', 'source * 3'
    );
  } else if(name == 'Bard Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.bardDedication', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Occult', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAttackModifier.Occult.1',
      'magicNotes.bardDedication', '=', '"charisma"'
    );
    rules.defineRule('spellDifficultyClass.Occult.1',
      'magicNotes.bardDedication', '=', '"charisma"'
    );
    rules.defineRule('spellSlots.O0', 'magicNotes.bardDedication', '+=', '2');
    // Suppress validation errors for selected muse and the notes for features
    // of muse that don't come with Bard Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let muses =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Bard (Muse)')).map(x => x.replace('Bard - ', ''));
    muses.forEach(m => {
      let condensed = m.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.bard-' + condensed + 'SelectableFeature',
        'featureNotes.bardDedication', '+', '1'
      );
      rules.defineRule('featureNotes.' + noteName, 'levels.Bard', '?', null);
      rules.defineRule('magicNotes.' + noteName, 'levels.Bard', '?', null);
    });
  } else if(name == 'Bardic Lore') {
    Pathfinder2E.skillRules(rules, 'Bardic Lore', 'Intelligence');
    rules.defineRule('trainingLevel.Bardic Lore',
      'skillNotes.bardicLore', '=', '1',
      'rank.Occultism', '+', '1'
    );
  } else if((matchInfo = name.match(/^(Basic|Expert|Master) (\w+) Spellcasting$/)) != null) {
    let c = matchInfo[2];
    let level = matchInfo[1];
    let slots =
      level=='Basic' ? {'1':0, '2':6, '3':8} :
      level=='Expert' ? {'4':0, '5':14, '6':16} :
      {'7':0, '8':20};
    let trad =
      (QuilvynUtils.getAttrValue(Pathfinder2E.CLASSES[c], 'SpellSlots') || 'A').charAt(0);
    let note = 'magicNotes.' + level.toLowerCase() + c + 'Spellcasting';
    if(c == 'Sorcerer') {
      ['A', 'D', 'O', 'P'].forEach(trad => {
        for(let s in slots) {
          if(slots[s] > 0)
            rules.defineRule
              (note + '.' + trad + '.' + s, 'level', '?', 'source>' + slots[s]);
          rules.defineRule(note + '.' + trad + '.' + s,
            'bloodlineTraditions', '?', 'source && source.includes("' + trad + '")',
             note, '=', '1'
          );
          rules.defineRule
            ('spellSlots.' + trad + s, note + '.' + trad + '.' + s, '+=', null);
        }
      });
    } else {
      for(let s in slots) {
        if(slots[s] > 0)
          rules.defineRule(note + '.' + s, 'level', '?', 'source>' + slots[s]);
        rules.defineRule(note + '.' + s, note, '=', '1');
        rules.defineRule('spellSlots.' + trad + s, note + '.' + s, '+=', null);
      }
    }
  } else if(name == 'Canny Acumen (Fortitude)') {
    rules.defineRule('saveNotes.cannyAcumen(Fortitude)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('trainingLevel.Fortitude',
      'saveNotes.cannyAcumen(Fortitude)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Perception)') {
    rules.defineRule('skillNotes.cannyAcumen(Perception)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('trainingLevel.Perception',
      'skillNotes.cannyAcumen(Perception)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Reflex)') {
    rules.defineRule('saveNotes.cannyAcumen(Reflex)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('trainingLevel.Reflex',
      'saveNotes.cannyAcumen(Reflex)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Will)') {
    rules.defineRule('saveNotes.cannyAcumen(Will)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('trainingLevel.Will',
      'saveNotes.cannyAcumen(Will)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Champion Dedication') {
    // Suppress validation errors for selected cause and key ability and the
    // cause and deity notes that don't come with Champion Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Champion (Key Ability)')).map(x => x.replace('Champion - ', ''));
    abilities.forEach(a => {
      let condensed = a.replaceAll(' ', '');
      rules.defineRule('validationNotes.champion-' + condensed + 'SelectableFeature',
        'features.Champion Dedication', '+', '1'
      );
    });
    let causes =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Champion (Cause)')).map(x => x.replace('Champion - ', ''));
    causes.forEach(c => {
      let condensed = c.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.champion-' + condensed + 'SelectableFeature',
        'featureNotes.championDedication', '+', '1'
      );
      rules.defineRule('magicNotes.' + noteName, 'levels.Champion', '?', null);
    });
    rules.defineRule('combatNotes.deityAndCause',
      'championFeatures.Deity And Cause', '?', null
    );
    rules.defineRule('magicNotes.deityAndCause',
      'championFeatures.Deity And Cause', '?', null
    );
    rules.defineRule('features.Champion Key Ability',
      'features.Champion Dedication', '=', '1'
    );
    rules.defineRule('features.Deity And Cause',
      'features.Champion Dedication', '=', '1'
    );
  } else if(name == "Champion's Reaction") {
    rules.defineRule("featureNotes.champion'sReaction",
      'features.Liberator', '=', '"Liberating Step"',
      'features.Paladin', '=', '"Retributive Strike"',
      'features.Redeemer', '=', '"Glimpse Of Redemption"'
    );
    rules.defineRule('features.Glimpse Of Redemption',
      "featureNotes.champion'sReaction", '=', 'source=="Glimpse Of Redemption" ? 1 : null'
    );
    rules.defineRule('features.Liberating Step',
      "featureNotes.champion'sReaction", '=', 'source=="Liberating Step" ? 1 : null'
    );
    rules.defineRule('features.Retributive Strike',
      "featureNotes.champion'sReaction", '=', 'source=="Retributive Strike" ? 1 : null'
    );
  } else if(name == "Champion's Sacrifice") {
    Pathfinder2E.featureSpell
      (rules, "magicNotes.champion'sSacrifice", '1', "Champion's Sacrifice",
       null, null, 'Divine', null, null);
  } else if(name == 'Cleric Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.clericDedication', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Divine', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAttackModifier.Divine.1',
      'magicNotes.clericDedication', '=', '"wisdom"'
    );
    rules.defineRule('spellDifficultyClass.Divine.1',
      'magicNotes.clericDedication', '=', '"wisdom"'
    );
    rules.defineRule('spellSlots.D0', 'magicNotes.clericDedication', '+=', '2');
    // Suppress the deity notes that don't come with Cleric Dedication
    rules.defineRule('combatNotes.deity', 'levels.Cleric', '?', null);
    rules.defineRule('magicNotes.deity', 'levels.Cleric', '?', null);
  } else if(name == 'Counter Perform') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.counterPerform', '1', 'Counter Performance', null,
       null, 'Occult', null, null);
    rules.defineRule('focusPoints', 'magicNotes.counterPerform', '+=', '1');
  } else if(name == 'Divine Ally') {
    // Suppress validation errors for selected ally
    let allSelectables = rules.getChoices('selectableFeatures');
    let allies =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Champion (Divine Ally)')).map(x => x.replace('Champion - ', ''));
    allies.forEach(a => {
      let condensed = a.replaceAll(' ', '');
      rules.defineRule('validationNotes.champion-' + condensed + 'SelectableFeature',
        'feats.Divine Ally', '+', '1'
      );
    });
  } else if(name == 'Druid Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.druidDedication', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Primal', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAttackModifier.Primal.1',
      'magicNotes.druidDedication', '=', '"wisdom"'
    );
    rules.defineRule('spellDifficultyClass.Primal.1',
      'magicNotes.druidDedication', '=', '"wisdom"'
    );
    rules.defineRule('spellSlots.P0', 'magicNotes.druidDedication', '+=', '2');
    // Suppress validation errors for selected order and the notes for features
    // of Druidic Order that don't come with Druid Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let orders =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Druid (Order)')).map(x => x.replace('Druid - ', ''));
    orders.forEach(o => {
      let condensed = o.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.druid-' + condensed + 'SelectableFeature',
        'featureNotes.druidDedication', '+', '1'
      );
      rules.defineRule('featureNotes.' + noteName, 'levels.Druid', '?', null);
      rules.defineRule('magicNotes.' + noteName, 'levels.Druid', '?', null);
    });
    rules.defineRule('magicNotes.druidOrder', 'levels.Druid', '?', null);
  } else if(name.match(/(Dwarven|Elven|Gnome|Goblin|Halfling|Orc) Weapon Expertise/) || name == 'Unconventional Expertise') {
    let note = 'combatNotes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
    rules.defineRule(note, 'hasClassWeaponExpertise', '?', null);
  } else if(name == 'Elf Atavism') {
    rules.defineRule('selectableFeatureCount.Elf (Heritage)',
      'featureNotes.elfAtavism', '=', '1'
    );
    // Suppress validation errors for selected half-elf heritages
    let allSelectables = rules.getChoices('selectableFeatures');
    let elfHeritages =
      Object.keys(allSelectables).filter(x => x.includes('Elf -')).map(x => x.replace('Elf - ', ''));
    elfHeritages.forEach(h => {
      let condensed = h.replaceAll(' ', '');
      rules.defineRule('validationNotes.elf-' + condensed + 'SelectableFeature',
        'featureNotes.elfAtavism', '+', '1'
      );
    });
  } else if(name == 'Expert Alchemy') {
    rules.defineRule
      ('advancedAlchemyLevel', 'featureNotes.expertAlchemy', '^', null);
    rules.defineRule
      ('featureNotes.expertAlchemy', 'level', '=', 'source>=10 ? 5 : 3');
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
    ['Illusory Disguise', 'Illusory Object', 'Illusory Scene', 'Veil'].forEach(s => {
      Pathfinder2E.featureSpell
        (rules, 'magicNotes.feyCaller', '1', s, null, null, 'Primal', null,
         null);
    });
  } else if(name == 'Fighter Dedication') {
    // Suppress validation errors for selected key ability
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Fighter (Key Ability)')).map(x => x.replace('Fighter - ', ''));
    abilities.forEach(a => {
      let condensed = a.replaceAll(' ', '');
      rules.defineRule('validationNotes.fighter-' + condensed + 'SelectableFeature',
        'features.Fighter Dedication', '+', '1'
      );
    });
    rules.defineRule
      ('features.Fighter Key Ability', 'features.Fighter Dedication', '=', '1');
  } else if(name == 'First World Adept') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.firstWorldAdept', '1', 'Faerie Fire', null, null,
       'Primal', null, null);
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.firstWorldAdept', '1', 'Invisibility', null, null,
       'Primal', null, null);
  } else if(name == 'Gnome Obsession') {
    rules.defineRule('skillNotes.gnomeObsession',
      'level', '=', 'source<2 ? "Trained" : source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
    rules.defineRule
      ('choiceCount.skill', 'skillNotes.gnomeObsession', '+=', 'source=="Trained" ? 1 : source=="Expert" ? 2 : source=="Master" ? 3 : 4');
  } else if(name == 'Hand Of The Apprentice') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.handOfTheApprentice', '1', 'Hand Of The Apprentice',
       null, null, 'Arcane', null, null);
    rules.defineRule
      ('focusPoints', 'magicNotes.handOfTheApprentice', '+=', '1');
  } else if(name == 'Healing Touch') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.healingTouch', '1', 'Lay On Hands', null, null,
       'Divine', null, null);
    rules.defineRule('focusPoints', 'magicNotes.healingTouch', '+=', '1');
  } else if(name == "Hierophant's Power") {
    rules.defineRule
      ('spellSlots.P10', "magicNotes.hierophant'sPower", '+', '1');
  } else if(name == 'Impaling Briars') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.impalingBriars', '1', 'Impaling Briars', null, null,
       'Primal', null, null);
    rules.defineRule('focusPoints', 'magicNotes.impalingBriars', '+=', '1');
  } else if(name == 'Inspirational Performance') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.inspirationalPerformance', '1', 'Inspire Courage',
       null, null, 'Occult', null, null);
  } else if(name == 'Instinct Ability') {
    // TODO What about homebrew instincts?
    rules.defineRule('featureNotes.instinctAbility',
      'features.Animal Instinct', '=', '"Bestial Rage"',
      'features.Dragon Instinct', '=', '"Draconic Rage"',
      'features.Giant Instinct', '=', '"Titan Mauler"',
      'features.Spirit Instinct', '=', '"Spirit Rage"'
    );
    rules.defineRule('features.Bestial Rage',
      'featureNotes.instinctAbility', '=', 'source=="Bestial Rage" ? 1 : null'
    );
    rules.defineRule('features.Draconic Rage',
      'featureNotes.instinctAbility', '=', 'source=="Draconic Rage" ? 1 : null'
    );
    rules.defineRule('features.Spirit Rage',
      'featureNotes.instinctAbility', '=', 'source=="Spirit Rage" ? 1 : null'
    );
    rules.defineRule('features.Titan Mauler',
      'featureNotes.instinctAbility', '=', 'source=="Titan Mauler" ? 1 : null'
    );
  } else if(name == 'Invoke Disaster') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.invokeDisaster', '1', 'Storm Lord', null, null,
       'Primal', null, null);
    rules.defineRule('focusPoints', 'magicNotes.invokeDisaster', '+=', '1');
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
  } else if(name == 'Litany Against Sloth') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.litanyAgainstSloth', '1', 'Litany Against Sloth',
       null, null, 'Divine', null, null);
  } else if(name == 'Litany Against Wrath') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.litanyAgainstWrath', '1', 'Litany Against Wrath',
       null, null, 'Divine', null, null);
  } else if(name == 'Litany Of Righteousness') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.litanyOfRighteousness', '1',
       'Litany Of Righteousness', null, null, 'Divine', null, null);
  } else if(name == 'Master Alchemy') {
    rules.defineRule
      ('advancedAlchemyLevel', 'featureNotes.masterAlchemy', '^', null);
    rules.defineRule
      ('featureNotes.masterAlchemy', 'level', '=', 'source - 5');
  } else if(name == 'Masterful Companion') {
    rules.defineRule('featureNotes.animalCompanion',
      'combatNotes.masterfulCompanion', '=', 'null' // italics
    );
  } else if((matchInfo = name.match(/^Minor Magic \((.*)\)$/)) != null) {
    let trad = matchInfo[1];
    let note = 'magicNotes.minorMagic(' + trad + ')';
    rules.defineRule('spellModifier.' + name,
      note, '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.' + trad, 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAttackModifier.' + trad + '.1',
      note, '=', '"charisma"'
    );
    rules.defineRule('spellDifficultyClass.' + trad + '.1',
      note, '=', '"charisma"'
    );
    rules.defineRule('spellSlots.' + trad.charAt(0) + '0', note, '+=', '2');
  } else if(name == 'Monk Dedication') {
    // Suppress validation errors for selected key ability
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Monk (Key Ability)')).map(x => x.replace('Monk - ', ''));
    abilities.forEach(a => {
      let condensed = a.replaceAll(' ', '');
      rules.defineRule('validationNotes.monk-' + condensed + 'SelectableFeature',
        'features.Monk Dedication', '+', '1'
      );
    });
    rules.defineRule
      ('features.Monk Key Ability', 'features.Monk Dedication', '=', '1');
  } else if(name == 'Monk Moves') {
    rules.defineRule('abilityNotes.monkMoves.1',
      'abilityNotes.monkMoves', '=', '10',
      'armorCategory', '?', 'source == "Unarmored"'
    );
    rules.defineRule('speed', 'abilityNotes.monkMoves.1', '+', null);
  } else if(name == 'Multilingual') {
    rules.defineRule('skillNotes.multilingual',
      'rank.Society', '=', null,
      'feats.Multilingual', '*', null
    );
  } else if(name == 'Orc Ferocity') {
    rules.defineRule('combatNotes.orcFerocity',
      '', '=', '"day"',
      'combatNotes.incredibleFerocity', '=', '"hour"'
    );
  } else if(name.match(/^Order Explorer/)) {
    rules.defineRule('features.Order Explorer', 'feats.' + name, '=', '1');
  } else if(name == 'Order Spell') {
    // TODO get rid of hard-coding
    rules.defineRule('magicNotes.orderSpell',
      'features.Animal', '=', '"Heal Animal"',
      'features.Leaf', '=', '"Goodberry"',
      'features.Storm', '=', '"Tempest Surge"',
      'features.Wild', '=', '"Wild Morph"'
    );
    rules.defineRule('spells.Heal Animal (P1 Nec)',
      'magicNotes.orderSpell', '=', 'source=="Heal Animal" ? 1 : null'
    );
    rules.defineRule('spells.Goodberry (P1 Nec)',
      'magicNotes.orderSpell', '=', 'source=="Goodberry" ? 1 : null'
    );
    rules.defineRule('spells.Tempest Surge (P1 Evo)',
      'magicNotes.orderSpell', '=', 'source=="Tempest Surge" ? 1 : null'
    );
    rules.defineRule('spells.Wild Morph (P1 Tra)',
      'magicNotes.orderSpell', '=', 'source=="Wild Morph" ? 1 : null'
    );
  } else if(name == 'Order Magic (Animal)') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.orderMagic(Animal)', '1', 'Heal Animal', null, null,
       'Primal', null, null);
  } else if(name == 'Order Magic (Leaf)') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.orderMagic(Leaf)', '1', 'Goodberry', null, null,
       'Primal', null, null);
  } else if(name == 'Order Magic (Storm)') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.orderMagic(Storm)', '1', 'Tempest Surge', null, null,
       'Primal', null, null);
  } else if(name == 'Order Magic (Wild)') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.orderMagic(Wild)', '1', 'Wild Morph', null, null,
       'Primal', null, null);
  } else if(name == 'Primal Summons') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.primalSummons', '1', 'Primal Summons', null, null,
       'Primal', null, null);
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
  } else if(name == 'Ranger Dedication') {
    // Suppress validation errors for selected key ability
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Ranger (Key Ability)')).map(x => x.replace('Ranger - ', ''));
    abilities.forEach(a => {
      let condensed = a.replaceAll(' ', '');
      rules.defineRule('validationNotes.ranger-' + condensed + 'SelectableFeature',
        'features.Ranger Dedication', '+', '1'
      );
    });
    rules.defineRule
      ('features.Ranger Key Ability', 'features.Ranger Dedication', '=', '1');
  } else if(name == 'Rogue Dedication') {
    // The key ability for Rogue Dedication is always dexterity--no racket.
    rules.defineRule('classDifficultyClass.Rogue',
      'features.Rogue Dedication', '+', '10 + dict["dexterityModifier"]'
    );
    rules.defineRule('classDifficultyClass.Rogue.1',
      'features.Rogue Dedication', '=', '"dexterity"'
    );
  } else if(name == 'Sorcerer Dedication') {
    rules.defineRule
      ('magicNotes.sorcererDedication', 'bloodlineTraditions', '=', null);
    rules.defineRule('magicNotes.sorcererDedication.1',
      'bloodlineTraditions', '=', 'source.toLowerCase()'
    );
    ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
      rules.defineRule('trainingLevel.' + t,
        'magicNotes.sorcererDedication', '^=', 'source.includes("' + t + '") ? 1 : null'
      );
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
      let condensed = b.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.sorcerer-' + condensed + 'SelectableFeature',
        'featureNotes.sorcererDedication', '+', '1'
      );
      rules.defineRule('magicNotes.' + noteName, 'levels.Sorcerer', '?', null);
      rules.defineRule
        ('magicNotes.' + noteName + '-1', 'levels.Sorcerer', '?', null);
      rules.defineRule
        ('magicNotes.' + noteName + '-2', 'levels.Sorcerer', '?', null);
    });
    rules.defineRule('magicNotes.bloodline', 'levels.Sorcerer', '?', null);
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
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.supernaturalCharm', '1', 'Charm', null, null,
       'Divine', null, null);
  } else if(name == 'Uncanny Bombs') {
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons) {
      if(allWeapons[w].includes('Bomb'))
        rules.defineRule
          ('weaponRangeAdjustment.' + w, 'combatNotes.uncannyBombs', '^=', '40');
    }
  } else if((matchInfo = name.match(/^Unconventional Weaponry \((.*)\)$/)) != null) {
    rules.defineRule
      ('features.Unconventional Weaponry', 'feats.' + name, '=', '1');
    rules.defineRule('combatNotes.unconventionalExpertise',
      'combatNotes.unconventionalWeaponry(' + matchInfo[1].replaceAll(' ', '') + ')', '=', '"' + matchInfo[1] + '"'
    );
  } else if(name == 'Untrained Improvisation') {
    rules.defineRule('skillNotes.untrainedImprovisation',
      'level', '=', 'source<7 ? Math.floor(source / 2) : source'
    );
  } else if(name == 'Wild Shape') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.wildShape', '1', 'Wild Shape', null, null, 'Primal',
       null, null);
  } else if(name == 'Wind Caller') {
    Pathfinder2E.featureSpell
      (rules, 'magicNotes.windCaller', '1', 'Stormwind Flight', null, null,
       'Primal', null, null);
  } else if(name == 'Wizard Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.wizardDedication', '?', null,
      'intelligenceModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Arcane', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAttackModifier.Arcane.1',
      'magicNotes.wizardDedication', '=', '"intelligence"'
    );
    rules.defineRule('spellDifficultyClass.Arcane.1',
      'magicNotes.wizardDedication', '=', '"intelligence"'
    );
    rules.defineRule('spellSlots.A0', 'magicNotes.wizardDedication', '+=', '2');
    // Suppress validation errors for selected school and the notes for
    // features of the school that don't come with Wizard Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let schools =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Wizard (Specialization)')).map(x => x.replace('Wizard - ', '')).filter(x => x != 'Universalist');
    schools.forEach(s => {
      let condensed = s.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.wizard-' + condensed + 'SelectableFeature',
        'featureNotes.wizardDedication', '+', '1'
      );
      rules.defineRule('magicNotes.' + noteName, 'levels.Wizard', '?', null);
      rules.defineRule
        ('magicNotes.' + noteName + '-1', 'levels.Wizard', '?', null);
    });
    rules.defineRule('magicNotes.arcaneSchool', 'levels.Wizard', '?', null);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements. #action#, if specified, gives
 * the type or number of actions required to use the feature.
 */
Pathfinder2E.featureRules = function(rules, name, sections, notes, action) {

  if(!name) {
    console.log('Empty feature name');
    return;
  }
  if(!Array.isArray(sections) || sections.length == 0) {
    console.log('Bad sections list "' + sections + '" for feature ' + name);
    return;
  }
  if(!Array.isArray(notes)) {
    console.log('Bad notes list "' + notes + '" for feature ' + name);
    return;
  }
  if(sections.length != notes.length) {
    console.log(sections.length + ' sections, ' + notes.length + ' notes for feature ' + name);
    return;
  }
  if(action != null && !(action+'').match(/^(1|2|3|Free|Reaction)$/)) {
    console.log('Bad action "' + action + '" for feature ' + name);
    return;
  }

  let actionMarks = {
    1: '<b>(1)</b> ',
    2: '<b>(2)</b> ',
    3: '<b>(3)</b> ',
    Free: '<b>(F)</b> ',
    Reaction: '<b>(R)</b> ' // '<b>&larrhk;</b> '
  };

  notes = notes.map(x => QuilvynRules.wrapVarsContainingSpace(x));

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  for(let i = 0; i < sections.length; i++) {

    let section = sections[i].toLowerCase();
    let effects = notes[i];
    let matchInfo;
    let maxSubnote =
      effects.includes('%1') ? +effects.match(/%\d/g).sort().pop().replace('%') :
      effects.includes('%V') ? 0 : -1;
    let note = section + 'Notes.' + prefix;
    let priorInSection =
      sections.slice(0, i).filter(x => x.toLowerCase() == section.toLowerCase()).length;
    if(priorInSection > 0)
      note += '-' + priorInSection;

    let noteText = (actionMarks[action] || '') + effects;
    rules.defineChoice('notes', note + ':' + noteText);
    rules.defineRule
      (note, 'features.' + name, effects.indexOf('%V') >= 0 ? '?' : '=', null);

    while(effects.length > 0) {

      let m = effects.match(/^((%\{[^\}]*\}|[^\/])*)\/?(.*)$/);
      let effect = m[1];
      effects = m[3];
      if((matchInfo = effect.match(/^([-+x](\d+(\.\d+)?|%[V1-9]|%\{[^\}]*\}))\s+(.*)$/)) != null) {

        let adjust = matchInfo[1];
        let adjusted = matchInfo[4];

        // Support +%{expr} by evaling expr for each id it contains
        if(adjust.match(/%{/) && !adjusted.match(/\b[a-z]/)) {
          let expression = adjust.substring(3, adjust.length - 1);
          let ids = new Expr(expression).identifiers();
          // TODO What if ids.length==0?
          // TODO If only 1 id, we could use a normal rule w/out eval
          let sn = ++maxSubnote;
          let target = sn>0 ? note + '.' + sn : note;
          rules.defineRule(target, 'features.' + name, '?', null);
          ids.forEach(id => {
            if(expression.trim() == id)
              rules.defineRule(target, id, '=', null);
            else
              rules.defineRule
                (target, id, '=', 'new Expr("' + expression + '").eval(dict)');
          });
          adjust = '%' + (sn==0 ? 'V' : sn);
          if(sn == 0)
            // Override '=' feature dependency rule created above
            rules.defineRule(note, 'features.' + name, '?', null);
        }

        let adjuster =
          adjust.match(/%\d/) ? note + '.' + adjust.replace(/.*%/, '') : note;
        let op = adjust.startsWith('x') ? '*' : '+';
        if(op == '*')
          adjust = adjust.substring(1);

        if((matchInfo = adjusted.match(/^(([A-Z][a-z]*)\s)?Feat\b/)) != null) {
          adjusted = 'featCount.' + (matchInfo[2] ? matchInfo[2] : 'General');
        } else if(section == 'save' && adjusted.match(/^[A-Z]\w*$/)) {
          adjusted = 'save.' + adjusted;
        } else if(section == 'skill' &&
                  adjusted != 'Language Count' &&
                  adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*(\s\([A-Z][a-z]*(\s[A-Z][a-z]*)*\))?$/)) {
          adjusted = 'skillModifier.' + adjusted;
        } else if(adjusted.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/)) {
          adjusted = adjusted.charAt(0).toLowerCase() + adjusted.substring(1).replaceAll(' ', '');
        } else {
          continue;
        }
        rules.defineRule(adjusted,
          adjuster, op, !adjust.includes('%') ? adjust : adjust.startsWith('-') ? '-source' : 'source'
        );
        if(adjust == '%1' && !effect.includes(adjust))
          rules.defineRule(adjuster, note, '?', null);

      }

    }

    notes[i].split(/\s*\/\s*/).forEach(n => {
      let matchInfo =
        n.match(/([A-Z]\w*)\s(%V|Expert|Legendary|Master|Trained)\s*\(([^\)]*)\)/i);
      if(matchInfo) {
        let group = matchInfo[1];
        let rank =
          matchInfo[2] == '%V' ? 'source=="Trained" ? 1 : source=="Expert" ? 2 : source=="Master" ? 3 : 4' : matchInfo[2] == 'Trained' ? 1 : matchInfo[2] == 'Expert' ? 2 : matchInfo[2] == 'Master' ? 3 : 4;
        let choices = '';
        matchInfo[3].split(/;\s*/).forEach(element => {
          let m = element.match(/Choose (\d+|%V)/);
          if(m)
            choices += '+' + (m[1] == '%V' ? 'source' : m[1]);
          else if(!element.startsWith('%')) {
            rules.defineRule('trainingLevel.' + element, note, '^=', rank);
            rules.defineRule('trainingCount.' + element, note, '+=', '1');
          }
          if(group == 'Attack') {
            rules.defineRule('attackProficiency.' + element,
              'trainingLevel.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
            );
          } else if(group == 'Defense') {
            rules.defineRule('defenseProficiency.' + element,
              'trainingLevel.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
            );
          }
        });
        if(choices)
          rules.defineRule('choiceCount.' + group,
            note, '+=', choices.replace('+', '')
          );
      }
      matchInfo = n.match(/Perception\s(Expert|Legendary|Master|Trained)$/i);
      if(matchInfo) {
        let rank =
          matchInfo[1] == 'Trained' ? 1 : matchInfo[1] == 'Expert' ? 2 : matchInfo[1] == 'Master' ? 3 : 4;
        rules.defineRule('trainingLevel.Perception', note, '^=', rank);
      }
      matchInfo = n.match(/(Ability|Skill)\s(Boost|Flaw|Increase)\s*\(([^\)]*)\)$/i);
      if(matchInfo) {
        let flaw = matchInfo[2].match(/flaw/i);
        let choices = '';
        matchInfo[3].split(/;\s*/).forEach(element => {
          let m = element.match(/Choose (\d+|%V)/);
          if(m)
            choices += '+' + (m[1] == '%V' ? 'source' : m[1]);
          else if(matchInfo[1] == 'Skill')
            rules.defineRule('skillIncreases.' + element, note, '+', '1');
          else
            rules.defineRule
              ('abilityBoosts.' + element, note, '+', flaw ? '-1' : '1');
        });
        if(choices)
          rules.defineRule('choiceCount.' + matchInfo[1],
            note, '+=', choices.replace('+', '')
          );
      }
      matchInfo = n.match(/^Has\s+the\s+(.*)\s+features?$/);
      if(matchInfo && !matchInfo[1].includes('%')) {
        let features = matchInfo[1].split(/\s*,\s*|\s+and\s+/);
        features.forEach(f => {
          f = f.trim();
          if(f != '')
            rules.defineRule('features.' + f, note, '=', '1');
        });
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
 * has the associated spells #spell# and #advancedSpell#.
 */
Pathfinder2E.schoolRules = function(rules, name, spell, advancedSpell) {

  if(!name) {
    console.log('Empty school name');
    return;
  }
  if(!spell) {
    console.log('Empty spell for school ' + name);
    return;
  }
  if(!advancedSpell) {
    console.log('Empty advanced spell for school ' + name);
    return;
  }

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  Pathfinder2E.featureRules(rules, name, ['magic', 'magic'],
    ['+1 spell slot each level/Knows the <i>' + spell + '</i> spell',
     'Knows 1 additional 1st-level ' + name + ' spell']);

  rules.defineRule('magicNotes.advancedSchoolSpell',
    'features.' + name, '=', '"' + advancedSpell + '"'
  );
  rules.defineRule('magicNotes.arcaneSchoolSpell',
    'features.' + name, '=', '"' + spell + '"'
  );
  Pathfinder2E.featureSpell
    (rules, 'magicNotes.advancedSchoolSpell',
     'source=="' + advancedSpell + '" ? 1 : null', advancedSpell, null, null,
     'Arcane', null, null);
  Pathfinder2E.featureSpell
    (rules, 'magicNotes.arcaneSchoolSpell',
     'source=="' + spell + '" ? 1 : null', spell, null, null, 'Arcane', null,
     null);
  Pathfinder2E.featureSpell
    (rules, 'magicNotes.' + prefix, '1', spell, null, null, 'Arcane', null,
     null);
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
    rules.defineRule('spellSlots.A' + l, 'magicNotes.' + prefix, '+', '1');
  });

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
    rules.defineRule
      ('trainingLevel.' + name, 'skillIncreases.' + name, '^=', '0');
    rules.defineRule('totalLoreRanks', 'rank.' + name, '+=', null);
  } else {
    rules.defineRule('trainingLevel.' + name, '', '=', '0');
  }
  rules.defineRule('rank.' + name,
    'trainingLevel.' + name, '=', null,
    'skillIncreases.' + name, '+', null
  );
  rules.defineRule('maxSkillRank', 'rank.' + name, '^=', null);
  if(name.endsWith(' Lore'))
    rules.defineRule('rank.Lore', 'rank.' + name, '^=', null);
  rules.defineRule('proficiencyLevelBonus.' + name,
    'rank.' + name, '=', 'source > 0 ? 0 : null',
    // TODO right place for this, or in featRulesExtra?
    'skillNotes.eclecticSkill', '=', '0',
    // TODO this is ugly
    'skillNotes.untrainedImprovisation', '=', 'dict["rank.' + name + '"] || dict["skillNotes.eclecticSkill"] ? null : dict.level<7 ? Math.floor(-dict.level / 2) : 0',
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
 * magic school #school#. #tradition# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
Pathfinder2E.spellRules = function(
  rules, name, school, level, tradition, cast, description
) {
  if(!name) {
    console.log('Empty spell name');
    return;
  }
  if(!school || !(school in Pathfinder2E.SCHOOLS)) {
    console.log('Bad school "' + school + '" for spell ' + name);
    return;
  }
  if(typeof(level) != 'number' && level != 'Cantrip') {
    console.log('Bad level "' + level + '" for spell ' + name);
    return;
  }
  if(!(tradition+'').match(/^(Arcane|Divine|Occult|Primal)$/)) {
    console.log('Bad tradition "' + tradition + '" for spell ' + name);
    return;
  }
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

/*
 * TODO
 */
Pathfinder2E.featureSpell = function(
  rules, note, expr, name, school, level, tradition, cast, description
) {
  if(!(name in Pathfinder2E.SPELLS)) {
    console.log('Unknown feature spell "' + name + '"');
    return;
  }
  let spellAttrs = Pathfinder2E.SPELLS[name];
  if(!school)
    school = QuilvynUtils.getAttrValue(spellAttrs, 'School');
  if(!level)
    level = QuilvynUtils.getAttrValue(spellAttrs, 'Level');
  if(level == 'Cantrip')
    level = 0;
  if(!tradition)
    tradition = QuilvynUtils.getAttrValue(spellAttrs, 'Traditions');
  if(!cast)
    cast = QuilvynUtils.getAttrValue(spellAttrs, 'Cast');
  if(!description)
    description = QuilvynUtils.getAttrValue(spellAttrs, 'Description');
  let spellName =
    name + ' (' + tradition.charAt(0) + level + ' ' +
    school.substring(0, 3) + ')';
  Pathfinder2E.spellRules
    (rules, spellName, school, level, tradition, cast, description);
  if(note)
    rules.defineRule('spells.' + spellName, note, '=', expr || '1');
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
  if(!(category + '').match(/^(Unarmed|Simple|Martial|Advanced)$/)) {
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
  if(!(hands+'').match(/^(0|1|2)$/)) {
    console.log('Bad hands "' + hands + '" for weapon ' + name);
    return;
  }
  if(!(group+'').match(/^(Axe|Bomb|Bow|Brawling|Club|Dart|Flail|Hammer|Knife|Pick|Polearm|Sling|Shield|Spear|Sword)$/)) {
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
  let lowerCategory =
    category == 'Advanced Weapons' ? 'Martial Weapons' : 'Simple Weapons';
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
  rules.defineRule('rank.' + category, 'trainingLevel.' + category, '=', null);
  rules.defineRule('rank.' + group, 'trainingLevel.' + group, '=', null);
  rules.defineRule('rank.' + name, 'trainingLevel.' + name, '=', null);
  rules.defineRule('weaponRank.' + name,
    weaponName, '?', null,
    'rank.' + category, '=', null,
    'rank.' + group, '^=', null,
    'rank.' + name, '^=', null,
    'ancestralWeaponRank.' + name, '^=', null,
    'unconventionalWeaponRank.' + name, '^=', null
  );
  rules.defineRule('maxWeaponRank', 'rank.' + name, '^=', null);
  let allFeats = rules.getChoices('feats') || {};
  traits.forEach(t => {
    let feat = t.replace(/f$/, 'ven') + ' Weapon Familiarity';
    if((feat in Pathfinder2E.FEATS || feat in allFeats) &&
       category.match(/^(Advanced|Martial) Weapons$/)) {
      let note = 'combatNotes.' + feat.charAt(0).toLowerCase() + feat.substring(1).replaceAll(' ', '');
      rules.defineRule('ancestralWeaponRank.' + name,
        note, '=', '0',
        'rank.' + lowerCategory, '^', null
      );
    }
  });
  rules.defineRule('unconventionalWeaponRank.' + name,
    'combatNotes.unconventionalWeaponry(' + name.replaceAll(' ', '') + ')', '=', '0',
    'combatNotes.unconventionalExpertise', '^', 'source=="' + name + '" ? 2 : null'
  );
  rules.defineRule
     ('unconventionalWeaponRank', 'unconventionalWeaponRank.' + name, '=', '1');
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
  rules.defineRule('weaponDieSides.' + name,
    weaponName, '=', damage.replace(/^\d(d)?/, ''),
    'weaponDieSidesBonus.' + name, '+', null
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
    'weaponDieSides.' + name, '=', '"' + damage.replace(/d\d+/, 'd') + '" + source'
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
            ('trainingLevel.' + element, setName + '.' + feature, '^=', rank);
          if(group == 'Attack')
            rules.defineRule('attackProficiency.' + element,
              'trainingLevel.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
            );
          else if(group == 'Defense')
            rules.defineRule('defenseProficiency.' + element,
              'trainingLevel.' + element, '=', 'Pathfinder2E.RANK_NAMES[source]'
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
        ('trainingLevel.Perception', setName + '.' + feature, '^=', rank);
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
            {name: 'Skill Modifiers', within: 'Section 2', separator: '/'},
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
      ['Trait', 'Traits', 'text', [20]]
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
    ['baseStrength', 'Str/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.strength', '', 'text', [3]],
    ['baseDexterity', 'Dex/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.dexterity', '', 'text', [3]],
    ['baseConstitution', 'Con/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.constitution', '', 'text', [3]],
    ['baseIntelligence', 'Int/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.intelligence', '', 'text', [3]],
    ['baseWisdom', 'Wis/Boosts', 'select-one', abilityChoices],
    ['abilityBoosts.wisdom', '', 'text', [3]],
    ['baseCharisma', 'Cha/Boosts', 'select-one', abilityChoices],
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
      let baseAttr = 'base' + attr.charAt(0).toUpperCase() + attr.substring(1);
      if((attributes.abilityGeneration + '').match(/4d6/)) {
        let rolls = [];
        for(i = 0; i < 4; i++)
          rolls.push(QuilvynUtils.random(1, 6));
        rolls.sort();
        attributes[baseAttr] = rolls[1] + rolls[2] + rolls[3];
      } else {
        attributes[baseAttr] = 10;
      }
    }
  } else if(attribute == 'armor') {
    attrs = this.applyRules(attributes);
    let armors = this.getChoices('armors');
    choices = [];
    for(let attr in armors) {
      let category = QuilvynUtils.getAttrValue(armors[attr], 'Category');
      if(category == 'Unarmored')
        choices.push(attr);
      else if(('rank.' + category + ' Armor') in attrs &&
              attrs['rank.' + category + 'Armor'] > 0)
        choices.push(attr);
    }
    attributes.armor = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'boosts') {
    let boostsAllocated = {};
    for(attr in Pathfinder2E.ABILITIES) {
      boostsAllocated[attr] = attributes['abilityBoosts.' + attr] || 0;
    }
    attrs = this.applyRules(attributes);
    let allNotes = this.getChoices('notes');
    for(attr in attrs) {
      if((matchInfo = attr.match(/^\w+features.Ability\s+Boost\s+\([^\)]*\)/gi)))
        ; // empty
      else if(!allNotes[attr] ||
         (matchInfo=allNotes[attr].match(/Ability\s+Boost\s+\([^\)]*\)/gi))==null)
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
    let alignment = attributes.alignment.match(/^([CLN]).*\s([GEN])/);
    alignment = alignment ? alignment[1] + alignment[2] : 'N';
    choices = [];
    let deities = this.getChoices('deitys');
    for(let d in deities) {
      let allowed =
        QuilvynUtils.getAttrValueArray(deities[d], 'FollowerAlignments');
      if(allowed.includes(alignment))
        choices.push(d);
    }
    if(choices.length > 0)
      attributes.deity = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'feats' || attribute == 'features') {
    let debug = [];
    attribute = attribute == 'feats' ? 'feat' : 'selectableFeature';
    let countPrefix = attribute + 'Count.';
    let prefix = attribute + 's';
    let suffix = attribute.charAt(0).toUpperCase() + attribute.substring(1);
    let toAllocateByTrait = {};
    attrs = this.applyRules(attributes);
    for(attr in attrs) {
      if(attr.startsWith(countPrefix))
        toAllocateByTrait[attr.replace(countPrefix, '')] = attrs[attr];
    }
    let availableChoices = {};
    let allChoices = this.getChoices(prefix);
    for(attr in allChoices) {
      let traits = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Trait');
      if(traits.length == 0)
        traits = QuilvynUtils.getAttrValueArray(allChoices[attr], 'Type');
      if(attrs[prefix + '.' + attr] != null) {
        for(i = 0; i < traits.length; i++) {
          let t = traits[i];
          if(toAllocateByTrait[t] != null && toAllocateByTrait[t] > 0) {
            debug.push(prefix + '.' + attr + ' reduces ' + t + ' feats from ' + toAllocateByTrait[t]);
            toAllocateByTrait[t]--;
            break;
          }
        }
      } else if(attrs['features.' + attr] == null) {
        availableChoices[attr] = traits;
      }
    }
    if(attribute == 'feat') {
      debug.push('Replace Ancestry with ' + attributes.ancestry);
      toAllocateByTrait[attributes.ancestry] = toAllocateByTrait.Ancestry;
      for(let a in this.getChoices('levels')) {
        if(!attributes['levels.' + a])
          continue;
        debug.push('Replace Class with ' + a);
        toAllocateByTrait[a] = toAllocateByTrait.Class;
        break;
      }
      delete toAllocateByTrait.Ancestry;
      delete toAllocateByTrait.Class;
    }
    for(attr in toAllocateByTrait) {
      let availableChoicesInTrait = {};
      for(let a in availableChoices) {
        if(availableChoices[a].includes(attr))
          availableChoicesInTrait[a] = '';
      }
      howMany = toAllocateByTrait[attr];
      debug.push('Choose ' + howMany + ' ' + attr + ' ' + prefix);
      let setsPicked = {};
      while(howMany > 0 &&
            (choices=Object.keys(availableChoicesInTrait)).length > 0) {
        debug.push('Pick ' + howMany + ' from ' + choices.length);
        let pick;
        let picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug.push('From ' + QuilvynUtils.getKeys(picks).join(", ") + ' reject');
        for(pick in picks) {
          // Only choose 1 choice from choice sets, like Assurance (skill) feats
          if(pick.includes('(')) {
            let pickSet = pick.replace(/ \(.*/, '');
            if(pickSet in setsPicked) {
              delete picks[pick];
              delete availableChoicesInTrait[pick];
              continue;
            }
            setsPicked[pickSet] = pick;
          }
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesInTrait[pick];
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
        attributes.level = Math.floor(attributes.experience / 1000) + 1;
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
    attrs = this.applyRules(attributes);
    let allNotes = this.getChoices('notes');
    let allSkills = this.getChoices('skills');
    let skillRanks = {};
    for(attr in allSkills)
      skillRanks[attr] = attrs['rank.' + attr] || 0;
    // Collect info for each feature and note that provides a skill choice,
    // split into choices limited to specified skills and choices of any skill
    let anyChoices = [];
    let increaseChoices = [];
    let limitedChoices = [];
    for(attr in attrs) {
      if((matchInfo = attr.match(/^features.Skill\s+(Trained|Expert|Master|Legendary|Increase)\s+\([^\)]*\)/g)))
        ; // empty
      else if(!allNotes[attr] ||
         (matchInfo = allNotes[attr].match(/Skill\s+(Trained|Expert|Master|Legendary|Increase|%V)\s+\([^\)]*\)/g)) == null)
        continue;
      matchInfo.forEach(match => {
        let skillLevel =
          match.match(/Trained|Expert|Master|Legendary|Increase|%V/)[0];
        if(skillLevel == '%V')
          skillLevel = attrs[attr];
        match.split(/\s*;\s*/).forEach(increased => {
          let m = increased.match(/Choose\s+(%V|\d+)\s+from\s+([\w,\s]*)/);
          if(m) {
            howMany = m[1] == '%V' ? +attrs[attr] : +m[1];
            let options = m[2];
            if(skillLevel == 'Increase')
              increaseChoices.push([skillLevel, options, howMany]);
            else if(options.match(/^any\b/))
              anyChoices.push([skillLevel, options, howMany]);
            else
              limitedChoices.push([skillLevel, options, howMany]);
          }
        });
      });
    }
    // Allocate limited choices before those with a large number of options,
    // and do increases last, since they can boost beyond trained
    limitedChoices.concat(anyChoices).concat(increaseChoices).forEach(c => {
      let skillLevel = c[0];
      let options = c[1];
      howMany = c[2];
      // Unsure if the restriction of applying multiple ability boosts to the
      // same ability also applies to skill increases. Possibly moot, since
      // the issue might only arise with Skill Trained, where the max rank
      // would prevent doubling up, or Skill Increase, which typically grants
      // only a single increase
      let maxRankAllowed =
        skillLevel == 'Trained' ? 0 :
        skillLevel == 'Expert' ? 1 :
        skillLevel == 'Master' ? 2 :
        skillLevel == 'Legendary' ? 3 :
        // Increase
        attrs.level < 7 ? 1 :
        attrs.level < 15 ? 2 : 3;
      if(options == 'any')
        choices = Object.keys(allSkills);
      else if(options.match(/^any\s/))
        choices = Object.keys(allSkills).filter(x => allSkills[x].includes(options.replace(/any\s+/, '')));
      else
        choices = options.split(/\s*,\s*/);
      // Try to determine whether any choices from this feature have already
      // been selected
      (choices.concat([])).forEach(c => {
        if(skillRanks[c] > maxRankAllowed) {
          choices = choices.filter(x => x != c);
/*
          if((attributes['skillIncreases.' + c] || 0) > 0)
            // Assume a choice from this feature has already been applied to
            // this skill. Note that this assumption may be incorrect when
            // multiple features allow choosing the same skill.
            howMany--;
*/
        } else if(skillLevel != 'Increase' && skillRanks[c] != maxRankAllowed) {
          choices = choices.filter(x => x != c);
        }
      });
      while(howMany > 0 && choices.length > 0) {
        let choice = randomElement(choices);
        attributes['skillIncreases.' + choice] =
          (attributes['skillIncreases.' + choice] || 0) + 1;
        skillRanks[choice]++;
        howMany--;
        choices = choices.filter(x => x != choice);
      }
    });
  } else if(attribute == 'spells') {
/* TODO
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
    '</ul><ul>\n' +
    'Quilvyn does not note the skill training requirement for the Dubious ' +
    'Knowledge feat.\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '</p>\n';
};
