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
  rules.addChoice('abilgens', 'All 10s', '');
  rules.addChoice('abilgens', 'Each 4d6, discarding lowest', '');

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
    Pathfinder2E.LANGUAGES, Pathfinder2E.LORES, Pathfinder2E.SKILLS
  );

  Quilvyn.addRuleSet(rules);
}

Pathfinder2E.VERSION = '2.3.1.0';

/* List of items handled by choiceRules method. */
Pathfinder2E.CHOICES = [
  'Alignment', 'Ancestry', 'Armor', 'Background', 'Class', 'Deity', 'Feat',
  'Feature', 'Goody', 'Language', 'Lore', 'School', 'Shield', 'Skill', 'Spell',
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
      '"1:Ability Boost (Constitution; Wisdom; Choose 1 from any)",' +
      '"1:Ability Flaw (Charisma)",' +
      '1:Darkvision,"1:Clan Dagger","1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Ancient-Blooded Dwarf:Heritage","1:Death Warden Dwarf:Heritage",' +
      '"1:Forge Dwarf:Heritage","1:Rock Dwarf:Heritage",' +
      '"1:Strong-Blooded Dwarf:Heritage" ' +
    'Traits=Dwarf,Humanoid ' +
    'Languages=Common,Dwarven',
  'Elf':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boost (Dexterity; Intelligence; Choose 1 from any)",' +
      '"1:Ability Flaw (Constitution)",' +
      '"1:Low-Light Vision","1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Arctic Elf:Heritage","1:Cavern Elf:Heritage","1:Seer Elf:Heritage",' +
      '"1:Whisper Elf:Heritage","1:Woodland Elf:Heritage" ' +
    'Traits=Elf,Humanoid ' +
    'Languages=Common,Elven',
  'Gnome':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boost (Charisma; Constitution; Choose 1 from any)",' +
      '"1:Ability Flaw (Strength)",' +
      '"1:Low-Light Vision",1:Small,"1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Chameleon Gnome:Heritage","1:Fey-Touched Gnome:Heritage",' +
      '"1:Sensate Gnome:Heritage","1:Umbral Gnome:Heritage",' +
      '"1:Wellspring Gnome:Heritage" ' +
    'Traits=Gnome,Humanoid ' +
    'Languages=Common,Gnomish,Sylvan',
  'Goblin':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boost (Charisma; Dexterity; Choose 1 from any)",' +
      '"1:Ability Flaw (Wisdom)",' +
      '1:Darkvision,1:Small,"1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Charhide Goblin:Heritage","1:Irongut Goblin:Heritage",' +
      '"1:Razortooth Goblin:Heritage","1:Snow Goblin:Heritage",' +
      '"1:Unbreakable Goblin:Heritage" ' +
    'Languages=Common,Goblin',
  'Halfling':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boost (Dexterity; Wisdom; Choose 1 from any)",' +
      '"1:Ability Flaw (Strength)",' +
      '"1:Keen Eyes",1:Small,"1:Ancestry Feats" ' +
    'Selectables=' +
      '"1:Gutsy Halfling:Heritage","1:Hillock Halfling:Heritage",' +
      '"1:Nomadic Halfling:Heritage","1:Twilight Halfling:Heritage",' +
      '"1:Wildwood Halfling:Heritage" ' +
    'Traits=Humanoid,Halfling ' +
    'Languages=Common,Halfling',
  'Human':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boost (Choose 2 from any)","1:Ancestry Feats" ' +
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
      '"1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",'+
      '"1:Skill Trained (Religion; Scribing Lore)","1:Student Of The Canon"',
  'Acrobat':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Acrobatics; Circus Lore)","1:Steady Balance"',
  'Animal Whisperer':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Nature; Choose 1 from Plains Lore, Swamp Lore)",' +
      '"1:Train Animal"',
  'Artisan':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Crafting; Guild Lore)","1:Specialty Crafting"',
  'Artist':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Crafting; Art Lore)","1:Specialty Crafting"',
  'Barkeep':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Constitution; Choose 1 from any)",' +
      '"1:Skill Trained (Diplomacy; Alcohol Lore)",1:Hobnobber',
  'Barrister':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Diplomacy; Legal Lore)","1:Group Impression"',
  'Bounty Hunter':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Strength, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Legal Lore)","1:Experienced Tracker"',
  'Charlatan':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Deception; Underworld Lore)","1:Charming Liar"',
  'Criminal':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Stealth; Underworld Lore)","1:Experienced Smuggler"',
  'Detective':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Underworld Lore)",1:Streetwise',
  'Emissary':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Society; City Lore)",1:Multilingual',
  'Entertainer':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Performance; Theater Lore)",' +
      '"1:Fascinating Performance"',
  'Farmhand':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Athletics; Farming Lore)","1:Assurance (Athletics)"',
  'Field Medic':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Medicine; Warfare Lore)","1:Battle Medicine"',
  'Fortune Teller':
    'Features=' +
      '"1:Ability Boost; Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Occultism; Fortune-Telling Lore)",' +
      '"1:Oddity Identification"',
  'Gambler':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Deception; Games Lore)","1:Lie To Me"',
  'Gladiator':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Performance; Gladitorial Lore)",' +
      '"1:Impressive Performance"',
  'Guard':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Intimidation; Legal Lore)","1:Quick Coercion"',
  'Herbalist':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Nature; Herbalism Lore)","1:Natural Medicine"',
  'Hermit':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Nature; Choose 1 from Cave Lore, Desert)",' +
      '"1:Dubious Knowledge"',
  'Hunter':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Tanning Lore)","1:Survey Wildlife"',
  'Laborer':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Athletics; Labor Lore)","1:Hefty Hauler"',
  'Martial Disciple':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Choose 1 from Acrobatics, Athletics; Warfare Lore)",' +
      // TODO: Cat Fall if Acrobatics chosen; Quick Jump if Athletics chosen
      '"1:Cat Fall",' +
      '"1:Quick Jump"',
  'Merchant':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Diplomacy, Mercantile Lore)","1:Bargain Hunter"',
  'Miner':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Strength, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Mining Lore)",' +
      '"1:Terrain Expertise (Underground)"',
  'Noble':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Heraldry Lore)","1:Courtly Graces"',
  'Nomad':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Choose 1 from Desert Lore, Swamp Lore)",' +
      '"1:Assurance (Survival)"',
  'Prisoner':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Stealth; Underworld Lore)","1:Experienced Smuggler"',
  'Sailor':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from any)",' +
      '"1:Skill Trained (Athletics; Sailing Lore)","1:Underwater Marauder"',
  'Scholar':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Choose 1 from Arcana, Nature, Occultism, Religion; Academia Lore)",' +
      '"1:Assurance (chosen skill)"',
  'Scout':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Choose 1 from Cavern Lore, Forest Lore)",' +
      '1:Forager',
  'Street Urchin':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Thieving; City Lore)",1:Pickpocket',
  'Tinker':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Dexterity, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Crafting; Engineering Lore)","1:Specialty Crafting"',
  'Warrior':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Strength; Choose 1 from any)",' +
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
      '"1:Weapon Trained (Simple Weapons; Alchemical Bombs; Unarmed)",' +
      '"1:Armor Trained (Light Armor; Medium Armor; Unarmored)",' +
      '"1:Class Trained (Alchemist)",' +
      '"1:Alchemical Crafting","1:Advanced Alchemy","1:Quick Alchemy",' +
      '"1:Formula Book","1:Research Field","1:Mutagenic Flashback",' +
      '"1:Alchemist Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases","5:Field Discovery","5:Powerful Alchemy",' +
      '"7:Alchemical Weapon Expertise","7:Iron Will","7:Perpetual Infusions",' +
      '"9:Alchemical Expertise","9:Alertness","9:Double Brew",' +
      '"11:Juggernaut","11:Perpetual Potency","13:Greater Field Discovery",' +
      '"13:Medium Armor Expertise","13:Weapon Specialization",' +
      '"15:Alchemical Alacrity","15:Evasion","17:Alchemical Mastery",' +
      '"17:Perpetual Perfection","19:Medium Armor Mastery"',
  'Barbarian':
    'Ability=intelligence HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Strength)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Will)","1:Save Trained (Reflex)",' +
      '"1:Barbarian Skills",' +
      '"1:Weapon Trained (Simple Weapons; Martial Weapons; Unarmed)",' +
      '"1:Armor Trained (Light Armor; Medium Armor; Unarmored)",' +
      '"1:Class Trained (Barbarian)",' +
      '"1:Rage","1:Instinct","1:Barbarian Feats","2:Skill Feats",' +
      '"3:Deny Advantage","3:General Feats","3:Skill Increases",' +
      '"5:Brutality","7:Juggernaut","7:Weapon Specialization",' +
      '"9:Lightning Reflexes","9:Raging Resistance","11:Mighty Rage",' +
      '"13:Greater Juggernaut","13:Medium Armor Expertise","13:Weapon Fury",' +
      '"15:Greater Weapon Specialization","15:Indomitable Will",' +
      '"17:Heightened Senses","17:Quick Rage","19:Armor Of Fury",' +
      '"19:Devastator" ' +
    'Selectables=' +
      '"1:Animal Instinct:Instinct","1:Dragon Instinct:Instinct",' +
      '"1:Fury Instinct:Instinct","1:Giant Instinct:Instinct",' +
      '"1:Spirit Instinct:Instinct"',
  'Bard':
    'Ability=charisma HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Charisma)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Bard Skills",' +
      '"1:Weapon Trained (Simple Weapons; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip; Unarmed)",' +
      '"1:Armor Trained (Light Armor; Unarmored)",' +
      '"1:Class Trained (Bard)",' +
      '"1:Occult Spellcasting","1:Composition Spells","1:Muses",' +
      '"2:Bard Feats","2:Skill Feats","3:General Feats",' +
      '"3:Lightning Reflexes","3:Signature Spells","3:Skill Increases",' +
      '"7:Expert Spellcaster","9:Great Fortitude","9:Resolve",' +
      '"11:Bard Weapon Expertise","11:Vigilant Senses",' +
      '"13:Light Armor Expertise","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Greater Resolve","19:Magnum Opus",' +
      '"19:Legendary Spellcaster"',
  'Champion':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from Strength, Dexterity)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Will)","1:Save Trained (Reflex)",' +
      '"1:Champion Skills",' +
      '"1:Weapon Trained (Simple Weapons; Martial Weapons; Unarmed)",' +
      '"1:Armor Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored)",' +
      '"1:Class Trained (Champion)",' +
      '"1:Champion\'s Code","Deific Weapon","Champion\'s Reaction",' +
      '"1:Retributive Strike","1:Glimpse Of Redemption","1:Liberating Step",' +
      '"1:Devotion Spells","1:Shield Block","1:Champion Feats",' +
      '"2:Skill Feats","3:Divine Ally","3:General Feats","3:Skill Increases",' +
      '"5:Weapon Expertise","7:Armor Expertise","7:Weapon Specialization",' +
      '"9:Champion Expertise","9:Divine Smite","9:Juggernaut",' +
      '"9:Lightning Reflexes","11:Alertness","11:Divine Will","11:Exalt",' +
      '"13:Armor Mastery","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","17:Champion Mastery",' +
      '"17:Legendary Armor","19:Hero\'s Defiance"',
  'Cleric':
    'Ability=wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Wisdom)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Cleric Skills",' +
      '"1:Weapon Trained (Simple Weapons; Unarmed)",' +
      '"1:Armor Trained (Unarmored)",' +
      '"1:Class Trained (Cleric)",' +
      '"1:Divine Spellcasting","1:Divine Font","1:Doctrine","2:Cleric Feats",' +
      '"2:Skill Feats","3:General Feats","3:Skill Increases","5:Alertness",' +
      '"9:Resolve","11:Lightning Reflexes","13:Divine Defense",' +
      '"13:Weapon Specialization","19:Miraculous Spell"',
  'Druid':
    'Ability=wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Wisdom)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Druid Skills",' +
      '"1:Weapon Trained (Simple Weapons; Unarmed)",' +
      '"1:Armor Trained (Light Armor; Medium Armor; Unarmored)",' +
      '"1:Class Trained (Druid)",' +
      '"1:Primal Spellcasting","1:Druidic Language","1:Druidic Order",' +
      '"1:Shield Block","1:Wild Empathy","2:Druid Feats","2:Skill Feats",' +
      '"3:Alertness","3:General Feats","3:Great Fortitude",' +
      '"3:Skill Increases","5:Lightning Reflexes","7:Expert Spellcaster",' +
      '"11:Druid Weapon Expertise","11:Resolve","13:Medium Armor Expertise",' +
      '"13:Weapon Specialization","15:Master Spellcaster",' +
      '"19:Legendary Spellcaster","19:Primal Hierophant"',
  'Fighter':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Fighter Skills",' +
      '"1:Weapon Expert (Simple Weapons; Martial Weapons; Unarmed)","1:Weapon Trained (Advanced Weapons)",' +
      '"1:Armor Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored)",' +
      '"1:Class Trained (Fighter)",' +
      '"1:Attack Of Opportunity","1:Shield Block","1:Fighter Feats",' +
      '"2:Skill Feats","3:General Feats","3:Skill Increases",' +
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
      '"1:Weapon Trained (Simple Weapons; Unarmed)",' +
      '"1:Defense Expert (Unarmored)",' +
      '"1:Flurry Of Blows","1:Powerful Fist","1:Monk Feats",' +
      '"2:Skill Feats","3:General Feats","3:Incredible Movement",' +
      '"3:Mystic Strikes","3:Skill Increases","5:Alertness",' +
      '"5:Expert Strikes","7:Path To Perfection","7:Weapon Specialization",' +
      '"9:Metal Strikes","9:Monk Expertise","11:Second Path To Perfection",' +
      '"13:Graceful Mastery","13:Master Strikes",' +
      '"15:Greater Weapon Specialization","15:Third Path To Perfection",' +
      '"17:Adamantine Strikes","17:Graceful Legend","19:Perfected Form"',
  'Ranger':
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","Save Trained (Will)",' +
      '"1:Ranger Skills",' +
      '"1:Weapon Trained (Simple Weapons; Martial Weapons; Unarmed)",' +
      '"1:Armor Trained (Light Armor; Medium Armor; Unarmored)",' +
      '"1:Class Trained (Ranger)",' +
      '"1:Hunt Prey","1:Hunter\'s Edge","1:Ranger Feats","2:Skill Feats",' +
      '"3:General Feats","3:Iron Will","3:Skill Increases",' +
      '"5:Ranger Weapon Expertise","5:Trackless Step","7:Evasion",' +
      '"7:Vigilant Senses","7:Weapon Specialization","9:Nature\'s Edge",' +
      '"9:Ranger Expertise","11:Juggernaut","11:Medium Armor Expertise",' +
      '"11:Wild Stride","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","15:Improved Evasion",' +
      '"15:Incredible Senses","17:Masterful Hunter","19:Second Skin",' +
      '"19:Swift Prey"',
  'Rogue':
    'Ability=charisma,constitution,dexterity,intelligence,strength,wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Choose 1 from any)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Reflex; Will)","Save Trained (Fortitude)",' +
      '"1:Rogue Skills",' +
      '"1:Weapon Trained (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed)",' +
      '"1:Armor Trained (Light Armor; Unarmored)",' +
      '"1:Class Trained (Rogue)",' +
      '"1:Rogue\'s Racket","1:Sneak Attack","1:Surprise Attack",' +
      '"1:Rogue Feats","1:Skill Feats","2:Skill Increases",' +
      '"3:Deny Advantage","3:General Feats","5:Weapon Tricks","7:Evasion",' +
      '"7:Vigilant Senses","7:Weapon Specialization","9:Debilitating Strike",' +
      '"9:Great Fortitude","11:Rogue Expertise","13:Improved Evasion",' +
      '"13:Incredible Senses","13:Light Armor Expertise","13:Master Tricks",' +
      '"15:Double Debilitation","15:Greater Weapon Specialization",' +
      '"17:Slippery Mind","19:Light Armor Mastery","19:Master Strike"',
  'Sorcerer':
    'Ability=charisma HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Sorcerer Skills",' +
      '"1:Weapon Trained (Simple Weapons; Unarmed)",' +
      '"1:Armor Trained (Unarmored)",' +
      '"1:Class Trained (Sorcerer)",' +
      '"1:Bloodline","1:Sorcerer Spellcasting","1:Spell Repertoire",' +
      '"2:Skill Feats","2:Sorcerer Feats","3:General Feats",' +
      '"3:Signature Spells","3:Skill Increases","5:Magical Fortitude",' +
      '"7:Expert Spellcaster","9:Lightning Reflexes","11:Alertness",' +
      '"11:Weapon Expertise","13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Resolve","19:Bloodline Paragon",' +
      '"19:Legendary Spellcaster"',
  'Wizard':
    'Ability=intelligence HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Intelligence)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Expert (Fortitude; Reflex)",' +
      '"1:Wizard Skills",' +
      '"1:Weapon Trained (Club; Crossbow; Dagger; Heavy Crossbow; Staff; Unarmed)",' +
      '"1:Armor Trained (Unarmored)",' +
      '"1:Class Trained (Wizard)",' +
      '"1:Arcane Spellcasting","1:Arcane School","1:Arcane Bond",' +
      '"1:Arcane Thesis","2:Skill Feats","2:Wizard Feats","3:General Feats",' +
      '"3:Skill Increases","5:Lightning Reflexes","7:Expert Spellcaster",' +
      '"9:Magical Fortitude","11:Alertness","11:Wizard Weapon Expertise",' +
      '"17:Resolve","19:Archwizard\'s Spellcraft","19:Legendary Spellcaster"'
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
    'Type=Ancestry,Dwarf Require="level >= 5","features.Rock Runner"',
  'Dwarven Weapon Cunning':
    'Type=Ancestry,Dwarf ' +
    'Require="level >= 5","features.Dwarven Weapon Familiarity"',
  "Mountain's Stoutness":'Type=Ancestry,Dwarf Require="level >= 9"',
  'Stonewalker':'Type=Ancestry,Dwarf Require="level >= 9"',
  'Dwarven Weapon Expertise':
    'Type=Ancestry,Dwarf ' +
    'Require="level >= 13","features.Dwarven Weapon Familiarity"',

  // NOTE requires age >= 100
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
    'Type=Ancestry,Gnome Require="level >= 5","features.Focus Pool"',
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
  'Extended Splash':
    'Type=Class,Alchemist Require="level >= 10","features.Calculated Spash"',
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
  'Mutifarious Muse':'Type=Class,Bard Require="level >= 2"',
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
  'Ranged Reprisal':'Type=Class,Champion Require="features.Paladin Cause"',
  'Unimpeded Step':'Type=Class,Champion Require="features.Liberator Cause"',
  'Weight Of Guilt':'Type=Class,Champion Require="features.Redeemer Cause"',
  'Divine Grace':'Type=Class,Champion Require="level >= 2"',
  'Dragonslayer Oath':
    'Type=Class,Champion Require="level >= 2","features.Tenets Of Good"',
  'Fiendsbane Oath':
    'Type=Class,Champion Require="level >= 2","features.Tenets Of Good"',
  'Shining Oath':
    'Type=Class,Champion Require="level >= 2","features.Tenets Of Good"',
  'Vengeful Oath':
    'Type=Class,Champion Require="level >= 2","features.Paladin Cause"',
  'Aura Of Courage':
    'Type=Class,Champion Require="level >= 4","features.Tenets Of Good"',
  'Divine Health':
    'Type=Class,Champion Require="level >= 4","features.Tenets Of Good"',
  'Mercy':
    'Type=Class,Champion Require="level >= 4","spells.Lay On Hands"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Type=Class,Champion ' +
    'Require="level >= 6","features.Devotion Spells","features.Tenets Of Good"',
  'Loyal Warhorse':
    'Type=Class,Champion Require="level >= 6","features.Divine Ally (Steed)"',
  'Shield Warden':
    'Type=Class,Champion,Fighter ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Shield && features.Tenets Of Good || features.Shield Block"',
  'Smite Evil':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Blade)",' +
      '"features.Tenets Of Good"',
  "Advanced Deity's Domain":
    'Type=Class,Champion Require="level >= 8","features.Deity\'s Domain"',
  'Greater Mercy':'Type=Class,Champion Require="level >= 8","features.Mercy"',
  'Heal Mount':
    'Type=Class,Champion ' +
    'Require="level >= 8","features.Divine Ally (Steed)","spells.Lay On Hands"',
  'Quick Shield Block':
    'Type=Class,Champion,Fighter ' +
    'Require=' +
      '"level >= 8",' +
      '"levels.Champion || features.Shield Block && features.Reactive Shield"',
  'Second Ally':
    'Type=Class,Champion Require="level >= 8","features.Divine Ally"',
  'Sense Evil':
    'Type=Class,Champion Require="level >= 8","features.Tenets Of Good"',
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
      '"features.Tenets Of Good"',
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
    'Type=Class,Champion Require="level >= 12","features.Tenets Of Good"',
  'Blade Of Justice':
    'Type=Class,Champion Require="level >= 12","features.Tenets Of Good"',
  "Champion's Sacrifice":
    'Type=Class,Champion Require="level >= 12","features.Tenets Of Good"',
  'Divine Wall':'Type=Class,Champion Require="level >= 12"',
  'Lasting Doubt':
    'Type=Class,Champion Require="level >= 12","features.Redeemer Cause"',
  'Liberating Stride':
    'Type=Class,Champion Require="level >= 12","features.Liberator Cause"',
  'Anchoring Aura':
    'Type=Class,Champion Require="level >= 14","features.Fiendsbane Oath"',
  'Aura Of Life':
    'Type=Class,Champion Require="level >= 14","features.Shining Oath"',
  'Aura Of Righteousness':
    'Type=Class,Champion Require="level >= 14","features.Tenets Of Good"',
  'Aura Of Vengeance':
    'Type=Class,Champion ' +
    'Require="level >= 14","features.Exalt","features.Vengeance Oath"',
  'Divine Reflexes':'Type=Class,Champion Require="level >= 14"',
  'Litany Of Righteousness':
    'Type=Class,Champion Require="level >= 14","features.Tenets Of Good"',
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
      '"features.Tenets Of Good"',
  'Shield Of Grace':
    'Type=Class,Champion Require="level >= 16","features.Shield Warden"',
  'Celestial Form':
    'Type=Class,Champion Require="level >= 18","features.Tenets Of Good"',
  'Ultimate Mercy':
    'Type=Class,Champion Require="level >= 18","features.Mercy"',
  'Celestial Mount':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Steed)",' +
      '"features.Tenets Of Good"',
  'Radiant Blade Master':
    'Type=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Blade)",' +
      '"features.Radiant Blade Spirit"',
  'Shield Paragon':
    'Type=Class,Champion Require="level >= 20","features.Divine Ally (Shield)"',

  'Deadly Simplicity':'Type=Class,Cleric',
  'Domain Initiate':'Type=Class,Cleric',
  'Harming Hands':'Type=Class,Cleric',
  'Healing Hands':'Type=Class,Cleric',
  'Holy Castigation':'Type=Class,Cleric',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':'Type=Class,Cleric Require="level >= 2"',
  'Emblazon Armament':'Type=Class,Cleric Require="level >= 2"',
  'Sap Life':'Type=Class,Cleric Require="level >= 2"',
  'Turn Undead':'Type=Class,Cleric Require="level >= 2"',
  'Versatile Font':
    'Type=Class,Cleric ' +
    'Require="level >= 2","features.Harmful Font || features.Healing Font"',
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
  'Advanced Domain':
    'Type=Class,Cleric Require="level >= 8","features.Domain Initiate"',
  'Align Armament':
    'Type=Class,Cleric ' +
    'Require="level >= 8","deityDomain =~ \'Chaotic|Evil|Good|Lawful\'"',
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
    'Type=Class,Druid,Ranger Require="features.Animal Order || levels.Ranger"',
  'Leshy Familiar':'Type=Class,Druid Require="features.Leaf Order"',
  // Reach Spell as above
  'Storm Born':'Type=Class,Druid Require="features.Storm Order"',
  'Widen Spell':'Type=Class,Druid,Sorcerer,Wizard',
  'Wild Shape':'Type=Class,Druid Require="features.Wild Order"',
  'Call Of The Wild':'Type=Class,Druid Require="level >= 2"',
  'Enhanced Familiar':
    'Type=Class,Druid,Sorcerer,Wizard Require="level >= 2","features.Familiar"',
  'Order Explorer':'Type=Class,Druid Require="level >= 2"',
  // Poison Resistance as above
  'Form Control':
    'Type=Class,Druid ' +
    'Require="level >= 4","strength >= 14","features.Wild Shape"',
  'Mature Animal Companion':
    'Type=Class,Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 4 || levels.Ranger >= 6",' +
      '"features.Animal Companion"',
  'Order Magic':
    'Type=Class,Druid Require="level >= 4","features.Order Explorer"',
  'Thousand Faces':
    'Type=Class,Druid Require="level >= 4","features.Wild Shape"',
  'Woodland Stride':
    'Type=Class,Druid Require="level >= 4","features.Leaf Order"',
  'Green Empathy':
    'Type=Class,Druid Require="level >= 6","features.Leaf Order"',
  'Insect Shape':
    'Type=Class,Druid Require="level >= 6","features.Wild Shape"',
  // Steady Spellcasting as above
  'Storm Retribution':
    'Type=Class,Druid ' +
    'Require="level >= 6","features.Storm Order","spells.Tempest Surge"',
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
    'Type=Class,Druid Require="level >= 8","features.Storm Order"',
  'Elemental Shape':
    'Type=Class,Druid Require="level >= 10","features.Wild Shape"',
  'Healing Transformation':'Type=Class,Druid Require="level >= 10"',
  'Overwhelming Energy':
    'Type=Class,Druid,Sorcerer,Wizard Require="level >= 10"',
  'Plant Shape':
    'Type=Class,Druid ' +
    'Require="level >= 10","features.Leaf Order || features.Wild Shape"',
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
    'Type=Class,Druid Require="level >= 14","features.Leaf Order"',
  // Effortless Concentration as above
  'Impaling Briars':
    'Type=Class,Druid Require="level >= 16","features.Leaf Order"',
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
  'Cruising Grab':'Type=Class,Monk Require="level >= 2"',
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
  'Favored Terrain':'Type=Class,Ranger Require="level >= 2"',
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
    'Type=Class,Rogue Require="level >= 2","features.Ruffian Racket"',
  'Distracting Feint':
    'Type=Class,Rogue Require="level >= 2","features.Scoundrel Racket"',
  'Minor Magic':'Type=Class,Rogue Require="level >= 2"',
  'Mobility':'Type=Class,Rogue Require="level >= 2"',
  // Quick Draw as above
  'Unbalancing Blow':
    'Type=Class,Rogue Require="level >= 2","features.Thief Racket"',
  'Battle Assessment':'Type=Class,Rogue Require="level >= 4"',
  'Dead Striker':'Type=Class,Rogue Require="level >= 4"',
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
      '"features.Thief Racket",' +
      '"features.Debilitating Strike"',
  'Sneak Savant':
    'Type=Class,Rogue Require="level >= 10","rank.Stealth >= 3"',
  'Tactical Debilitations':
    'Type=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Scoundrel Racket",' +
      '"features.Debilitating Strike"',
  'Vicious Debilitations':
    'Type=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Ruffian Racket",' +
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
  'Dangerous Sorcerer':'Type=Class,Sorcerer',
  'Familiar':'Type=Class,Sorcerer,Wizard',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Type=Class,Sorcerer Require="level >= 4","features.Arcane Spells"',
  'Bespell Weapon':'Type=Class,Sorcerer,Wizard Require="level >= 4"',
  'Divine Evolution':
    'Type=Class,Sorcerer Require="level >= 4","features.Divine Spells"',
  'Occult Evolution':
    'Type=Class,Sorcerer Require="level >= 4","features.Occult Spells"',
  'Primal Evolution':
    'Type=Class,Sorcerer Require="level >= 4","features.Primal Spells"',
  'Advanced Bloodline':
    'Type=Class,Sorcerer Require="level >= 6","features.Bloodline Spell"',
  // Steady Spellcasting as above
  'Bloodline Resistance':'Type=Class,Sorcerer Require="level >= 8"',
  'Crossblooded Evolution':'Type=Class,Sorcerer Require="level >= 8"',
  'Greater Bloodline':
    'Type=Class,Sorcerer Require="level >= 10","features.Bloodline Spell"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':
    'Type=Class,Sorcerer Require="level >= 12","features.Bloodline Spell"',
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
  'Hand Of The Apprentice':
    'Type=Class,Wizard Require="features.Universalist Wizard"',
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
      '"features.Universality Wizard",' +
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
  'Weapon Proficiency':'Type=General',
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
  'Skilled Heritage Human':
    'Section=skill Note="%{level<5?\'Trained\':\'Expert\'} in chosen skill"',
  'Slow':'Section=ability Note="-5 Speed"',
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
  'Versatile Heritage Human':'Section=feature Note="+1 General Feat"',
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
     // TODO only if another feature grants expert or greater rank
    'Note="Weapon Expert (Battle Axe; Pick; Warhammer; Dwarf Weapons)"',

  'Ancestral Longevity':
    'Section=skill Note="May become Trained in choice of skill 1/dy"',
  'Elven Lore':
    'Section=skill Note="Skill Trained (Arcana; Nature; Elven Lore)"',
  'Elven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Trained (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow)",' +
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
     // TODO only if another feature grants expert or greater
    'Note="Weapon Expert (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow; Elf Weapons)"',

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
      '"Weapon Trained (Glaive; Kukri)",' +
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
     // TODO only if another feature grants expert or greater
    'Note="Weapon Expert (Glaive; Kukri; Gnome Weapons)"',

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
      '"Weapon Trained (Dogslicer; Horsechopper)",' +
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
     // TODO only if another feature grants expert or greater
    'Note="Weapon Expert (Dogslicer; Horsechopper; Goblin Weapons)"',
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
      '"Weapon Trained (Sling; Halfling Sling Staff; Shortsword)",' +
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
     // TODO only if another feature grants expert or greater
    'Note="Weapon Expert (Sling; Halfling Sling; Shortsword; Halfling Weapons)"',

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
     // TODO only if another feature grants expert or greater
    'Note="Weapon Expert (Unconventional Weaponry)"',

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
      '"Weapon Trained (Falchion; Greataxe)",' +
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
     // TODO only if another feature grants expert or greater
    'Note="Weapon Expert (Falchion; Greataxe; Orc Weapons)"',

  // Class Features and Feats

  'Ability Boosts':'Section=ability Note="Ability Boost (Choose %V from any)"',
  'General Feats':'Section=feature Note="%V selections"',
  'Skill Feats':'Section=feature Note="%V selections"',
  'Skill Increases':'Section=skill Note="Skill Boost (Choose %V from any)"',

  // Alchemist
  // Alchemical Crafting as below
  'Alchemist Feats':'Section=feature Note="%V selections"',
  'Alchemist Skills':
    'Section=feature Note="Skill Trained (Crafting; Choose %V from any)"',
  'Advanced Alchemy':'Section=feature Note="FILL"',
  'Quick Alchemy':'Section=feature Note="FILL"',
  'Formula Book':'Section=feature Note="FILL"',
  'Research Field':'Section=feature Note="FILL"',
  'Mutagenic Flashback':'Section=feature Note="FILL"',
  'Field Discovery':'Section=feature Note="FILL"',
  'Powerful Alchemy':'Section=feature Note="FILL"',
  'Alchemical Weapon Expertise':'Section=feature Note="FILL"',
  'Iron Will':'Section=feature Note="FILL"',
  'Perpetual Infusions':'Section=feature Note="FILL"',
  'Alchemical Expertise':'Section=feature Note="FILL"',
  'Alertness':'Section=feature Note="FILL"',
  'Double Brew':'Section=feature Note="FILL"',
  'Juggernaut':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Fortitude)",' +
      '"Successes on fortitude saves are critical successes"',
  'Perpetual Potency':'Section=feature Note="FILL"',
  'Greater Field Discovery':'Section=feature Note="FILL"',
  'Medium Armor Expertise':
    'Section=combat ' +
    'Note="Armor Expert (Light Armor; Medium Armor; Unarmored Defense)"',
  'Weapon Specialization':
    'Section=combat ' +
    'Note="+%{$\'features.Greater Weapon Specialization\'?4:2}/+%{$\'features.Greater Weapon Specialization\'?6:3}/+%{$\'features.Greater Weapon Specialization\'?8:4} damage with expert/master/legendary weapons"',
  'Alchemical Alacrity':'Section=feature Note="FILL"',
  'Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Reflex)",' +
      '"Success on Reflex save are critical successes"',
  'Alchemical Mastery':'Section=feature Note="FILL"',
  'Perpetual Perfection':'Section=feature Note="FILL"',
  'Medium Armor Mastery':'Section=feature Note="FILL"',
  
  'Alchemical Familiar':'Section=feature Note="FILL"',
  'Alchemical Savant':'Section=feature Note="FILL"',
  'Far Lobber':'Section=feature Note="FILL"',
  'Quick Bomber':'Section=feature Note="FILL"',
  'Poison Resistance':'Section=feature Note="FILL"',
  'Revivifying Mutagen':'Section=feature Note="FILL"',
  'Smoke Bomb':'Section=feature Note="FILL"',
  'Calculated Splash':'Section=feature Note="FILL"',
  'Efficient Alchemy':'Section=feature Note="FILL"',
  'Enduring Alchemy':'Section=feature Note="FILL"',
  'Combine Elixirs':'Section=feature Note="FILL"',
  'Debilitating Bomb':'Section=feature Note="FILL"',
  'Directional Bombs':'Section=feature Note="FILL"',
  'Feral Mutagen':'Section=feature Note="FILL"',
  'Sticky Bomb':'Section=feature Note="FILL"',
  'Elastic Mutagen':'Section=feature Note="FILL"',
  'Extended Splash':'Section=feature Note="FILL"',
  'Greater Debilitating Bomb':'Section=feature Note="FILL"',
  'Merciful Elixir':'Section=feature Note="FILL"',
  'Potent Poisoner':'Section=feature Note="FILL"',
  'Extend Elixir':'Section=feature Note="FILL"',
  'Invincible Mutagen':'Section=feature Note="FILL"',
  'Uncanny Bombs':'Section=feature Note="FILL"',
  'Glib Mutagen':'Section=feature Note="FILL"',
  'Greater Merciful Elixir':'Section=feature Note="FILL"',
  'True Debilitating Bomb':'Section=feature Note="FILL"',
  'Eternal Elixir':'Section=feature Note="FILL"',
  'Exploitive Bomb':'Section=feature Note="FILL"',
  'Genius Mutagen':'Section=feature Note="FILL"',
  'Persistent Mutagen':'Section=feature Note="FILL"',
  'Improbable Elixirs':'Section=feature Note="FILL"',
  'Mindblank Mutagen':'Section=feature Note="FILL"',
  'Miracle Worker':'Section=feature Note="FILL"',
  'Perfect Debilitation':'Section=feature Note="FILL"',
  "Craft Philosopher's Stone":'Section=feature Note="FILL"',
  'Mega Bomb':'Section=feature Note="FILL"',
  'Perfect Mutagen':'Section=feature Note="FILL"',

  // Barbarian
  'Animal Instinct':'Section=feature Note="FILL"',
  'Armor Of Fury':
    'Section=combat ' +
    'Note="Armor Master (Light Armor; Medium Armor; Unarmored Defense)"',
  'Barbarian Feats':'Section=feature Note="%V selections"',
  'Barbarian Skills':
    'Section=skill Note="Skill Trained (Athletics; Choose %V from any)"',
  'Brutality':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"May use melee and unarmed weapon specialization features while raging"',
  'Deny Advantage':
    'Section=combat ' +
    'Note="Foes of equal or lower level cannot inflict flat-footed"',
  'Devastator':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Master (Barbarian)",' +
      '"Successful melee Strikes ignore 10 points of physical resistance"',
  'Dragon Instinct':'Section=feature Note="FILL"',
  'Fury Instinct':'Section=feature Note="FILL"',
  'Giant Instinct':'Section=feature Note="FILL"',
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
  'Mighty Rage':'Section=combat Note="May use 2-action rage activities"',
  'Quick Rage':'Section=combat Note="May use Rage again after 1 turn"',
  'Rage':
    'Section=combat ' +
    'Note="May gain %{level+constitutionModifier} HP and +2 melee damage, and suffer -1 AC and no concentration actions, for 1 min; requires 1 min break between rages"',
  'Raging Resistance':
    'Section=save ' +
    'Note="Resistance %{3+constitutionModifier} to instinct damage type while raging"',
  'Spirit Instinct':'Section=feature Note="FILL"',
  'Weapon Fury':
    'Section=combat ' +
    'Note="Weapon Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  // Weapon Specialization as above

  'Acute Vision':'Section=feature Note="Has Darkvision during rage"',
  'Moment Of Clarity':
    'Section=combat Note="May use concentration actions during rage"',
  'Raging Intimidation':
    'Section=skill,skill ' +
    'Note=' +
      '"Has Intimidating Glare%1 features",' +
      '"May use Demoralize during rage"',
  'Raging Thrower':
    'Section=combat ' +
    'Note="+2 thrown weapon damage during rage/Brutal Critical and Devastator effects apply to thrown weapons"',
  'Sudden Charge':
    'Section=combat Note="May make a melee Strike after a double Stride"',
  'Acute Scent':'Section=ability Note="R30\' imprecise scent"',
  'Furious Finish':
    'Section=combat ' +
    'Note="May gain additional damage on a Strike during rage; suffers loss of rage and fatigue until 10 min rest"',
  'No Escape':
    'Section=combat ' +
    'Note="May use Reaction to Stride along with retreating foe"',
  'Second Wind':
    'Section=combat ' +
    'Note="May start a second rage without waiting; suffers fatigue afterwards until 10 min rest"',
  'Shake It Off':
    'Section=combat ' +
    'Note="May reduce frightened condition by 1 and gain a Fortitude save to reduce sickened condition during rage"',
  'Fast Movement':'Section=combat Note="+10 speed during rage"',
  'Raging Athlete':
    'Section=skill ' +
    'Note="Gains %{speed} climb and swim speed, -10 jump DC, and 5\'/%{speed>=30?20:15}\' vertical/horizontal Leap during rage"',
  'Swipe':'Section=combat Note="May attack two adjacent foes with one Strike"',
  'Wounded Rage':'Section=combat Note="May use a Reaction to enter rage"',
  'Animal Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Armor Expert (Unarmored Defense)",' +
      // TODO Dex cap
      '"+%{$\'features.Greater Juggernaut\'?3:2} AC during rage"',
  'Attack Of Opportunity':
    'Section=combat ' +
    'Note="May use a Reaction to Strike a foe that uses a manipulate action, makes a ranged attack, or leaves a square while moving"',
  'Butal Bully':
    'Section=combat ' +
    'Note="Successful Disarm, Grapple, Shove, or Trip inflicts %{strengthModifier} damage"',
  'Cleave':
    'Section=combat ' +
    'Note="May use a Reaction after killing or knocking unconscious to Strike an adjacent foe"',
  "Dragon's Rage Breath":
    'Section=combat ' +
    'Note="May use breath to inflict %{level}d6 damage in a 30\' cone or 60\' line (Ref neg; half damage for a 2nd breath use within 1 hr)"',
  "Giant's Stature":
    'Section=combat Note="May grow to Large size until rage ends"',
  "Spirit's Interference":
    'Section=combat ' +
    'Note="Foe ranged attacks require a DC 5 flat check until rage ends"',
  'Animal Rage':
    'Section=magic ' +
    'Note="May use <i>Animal Form</i> to transform into spirit animal at will"',
  'Furious Bully':'Section=combat Note="+2 Athletics for attacks during range"',
  'Renewed Vigor':
    'Section=combat ' +
    'Note="May gain %{level//2+constitutionModifier} temporary HP"',
  'Share Rage':
    'Section=combat Note="R30\' May give an ally the effects of rage 1/rage"',
  'Sudden Leap':
    'Section=combat ' +
    'Note="May use 2 actions to make a Strike during a Leap, High Jump, or Long Jump"',
  'Thrash':
    'Section=combat ' +
    'Note="May inflict %{strengthModifier+2}+specialization damge to grabbed foe (Fort neg)"',
  'Come And Get Me':'Section=feature Note="FILL"',
  'Furious Sprint':'Section=feature Note="FILL"',
  'Great Cleave':'Section=feature Note="FILL"',
  'Knockback':'Section=feature Note="FILL"',
  'Terrifying Howl':'Section=feature Note="FILL"',
  "Dragon's Rage Wings":'Section=feature Note="FILL"',
  'Furious Grab':'Section=feature Note="FILL"',
  "Predator's Pounce":'Section=feature Note="FILL"',
  "Spirit's Wrath":'Section=feature Note="FILL"',
  "Titan's Stature":'Section=feature Note="FILL"',
  'Awesome Blow':'Section=feature Note="FILL"',
  "Giant's Lunge":'Section=feature Note="FILL"',
  'Vengeful Strike':'Section=feature Note="FILL"',
  'Whirlwind Strike':
    'Section=combat Note="May use 3 actions to Strike each foe within reach"',
  'Collateral Thrash':'Section=feature Note="FILL"',
  'Dragon Transformation':'Section=feature Note="FILL"',
  'Rackless Abandon':'Section=feature Note="FILL"',
  'Brutal Critical':'Section=feature Note="FILL"',
  'Perfect Clarity':'Section=feature Note="FILL"',
  'Vicious Evisceration':'Section=feature Note="FILL"',
  'Contagious Rage':'Section=feature Note="FILL"',
  'Quaking Stomp':'Section=feature Note="FILL"',

  // Bard
  'Bard Weapon Expertise':'Section=feature Note="FILL"',
  'Bard Feats':'Section=feature Note="%V selections"',
  'Bard Skills':
    'Section=skill ' +
    'Note="Skill Trained (Occultism; Performance; Choose %V from any)"',
  'Composition Spells':'Section=feature Note="FILL"',
  'Expert Spellcaster':'Section=feature Note="FILL"',
  'Great Fortitude':'Section=feature Note="FILL"',
  'Greater Resolve':'Section=feature Note="FILL"',
  'Legendary Spellcaster':'Section=feature Note="FILL"',
  'Light Armor Expertise':'Section=feature Note="FILL"',
  // Lightning Reflexes as above
  'Magnum Opus':'Section=feature Note="FILL"',
  'Master Spellcaster':'Section=feature Note="FILL"',
  'Muses':'Section=feature Note="FILL"',
  'Occult Spellcasting':'Section=feature Note="FILL"',
  'Resolve':'Section=feature Note="FILL"',
  'Signature Spells':'Section=feature Note="FILL"',
  'Vigilant Senses':'Section=feature Note="FILL"',
  // Weapon Specialization as above

  'Bardic Lore':'Section=feature Note="FILL"',
  'Lingering Composition':'Section=feature Note="FILL"',
  'Reach Spell':'Section=feature Note="FILL"',
  'Versatile Performance':'Section=feature Note="FILL"',
  'Cantrip Expansion':'Section=feature Note="FILL"',
  'Esoteric Polymath':'Section=feature Note="FILL"',
  'Inspire Competence':'Section=feature Note="FILL"',
  "Loremaster's Etude":'Section=feature Note="FILL"',
  'Mutifarious Muse':'Section=feature Note="FILL"',
  'Inspire Defense':'Section=feature Note="FILL"',
  'Melodious Spell':'Section=feature Note="FILL"',
  'Triple Time':'Section=feature Note="FILL"',
  'Versatile Signature':'Section=feature Note="FILL"',
  'Dirge Of Doom':'Section=feature Note="FILL"',
  'Harmonize':'Section=feature Note="FILL"',
  'Steady Spellcasting':'Section=feature Note="FILL"',
  'Eclectic Skill':'Section=feature Note="FILL"',
  'Inspire Heroics':'Section=feature Note="FILL"',
  'Know-It-All':'Section=feature Note="FILL"',
  'House Of Imaginary Walls':'Section=feature Note="FILL"',
  'Quickened Casting':'Section=feature Note="FILL"',
  'Unusual Composition':'Section=feature Note="FILL"',
  'Eclectic Polymath':'Section=feature Note="FILL"',
  'Inspirational Focus':'Section=feature Note="FILL"',
  'Allegro':'Section=feature Note="FILL"',
  'Soothing Ballad':'Section=feature Note="FILL"',
  'True Hypercognition':'Section=feature Note="FILL"',
  'Effortless Concentration':'Section=feature Note="FILL"',
  'Studious Capacity':'Section=feature Note="FILL"',
  'Deep Lore':'Section=feature Note="FILL"',
  'Eternal Composition':'Section=feature Note="FILL"',
  'Impossible Polymath':'Section=feature Note="FILL"',
  'Fatal Aria':'Section=feature Note="FILL"',
  'Perfect Encore':'Section=feature Note="FILL"',
  'Symphony Of The Muse':'Section=feature Note="FILL"',
  
  // Champion
  // Alertness as above
  'Armor Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Armor Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"May use specialization effects of medium and heavy armor"',
  'Armor Mastery':
    'Section=combat ' +
    'Note="Armor Master (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Champion Expertise':'Section=feature Note="FILL"',
  'Champion Feats':'Section=feature Note="%V selections"',
  'Champion Mastery':'Section=feature Note="FILL"',
  'Champion Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  "Champion's Code":'Section=feature Note="FILL"',
  "Champion's Reaction":'Section=feature Note="FILL"',
  'Deific Weapon':'Section=feature Note="FILL"',
  'Devotion Spells':'Section=feature Note="FILL"',
  'Divine Ally':'Section=feature Note="FILL"',
  'Divine Smite':'Section=feature Note="FILL"',
  'Divine Will':'Section=feature Note="FILL"',
  'Exalt':'Section=feature Note="FILL"',
  'Glimpse Of Redemption':'Section=feature Note="FILL"',
  // Greater Weapon Specialization as above
  "Hero's Defiance":'Section=feature Note="FILL"',
  // Juggernaut as above
  'Legendary Armor':'Section=feature Note="FILL"',
  'Liberating Step':'Section=feature Note="FILL"',
  // Lightning Reflexes as above
  'Retributive Strike':'Section=feature Note="FILL"',
  // Shield Block as below
  'Weapon Expertise':'Section=feature Note="FILL"',
  'Weapon Mastery':'Section=feature Note="FILL"',
  // Weapon Specialization as above

  "Deity's Domain":'Section=feature Note="FILL"',
  'Ranged Reprisal':'Section=feature Note="FILL"',
  'Unimpeded Step':'Section=feature Note="FILL"',
  'Weight Of Guilt':'Section=feature Note="FILL"',
  'Divine Grace':'Section=feature Note="FILL"',
  'Dragonslayer Oath':'Section=feature Note="FILL"',
  'Fiendsbane Oath':'Section=feature Note="FILL"',
  'Shining Oath':'Section=feature Note="FILL"',
  'Vengeful Oath':'Section=feature Note="FILL"',
  'Aura Of Courage':'Section=feature Note="FILL"',
  'Divine Health':'Section=feature Note="FILL"',
  'Mercy':'Section=feature Note="FILL"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':'Section=feature Note="FILL"',
  'Loyal Warhorse':'Section=feature Note="FILL"',
  'Shield Warden':
    'Section=combat Note="May use Shield Block to protect an adjacent ally"',
  'Smite Evil':'Section=feature Note="FILL"',
  "Advanced Deity's Domain":'Section=feature Note="FILL"',
  'Greater Mercy':'Section=feature Note="FILL"',
  'Heal Mount':'Section=feature Note="FILL"',
  'Quick Shield Block':
    'Section=combat ' +
    'Note="May use an additional Reaction for a Shield Block 1/tn"',
  'Second Ally':'Section=feature Note="FILL"',
  'Sense Evil':'Section=feature Note="FILL"',
  'Devoted Focus':'Section=feature Note="FILL"',
  'Imposing Destrier':'Section=feature Note="FILL"',
  'Litany Against Sloth':'Section=feature Note="FILL"',
  'Radiant Blade Spirit':'Section=feature Note="FILL"',
  'Shield Of Reckoning':'Section=feature Note="FILL"',
  'Affliction Mercy':'Section=feature Note="FILL"',
  'Aura Of Faith':'Section=feature Note="FILL"',
  'Blade Of Justice':'Section=feature Note="FILL"',
  "Champion's Sacrifice":'Section=feature Note="FILL"',
  'Divine Wall':'Section=feature Note="FILL"',
  'Lasting Doubt':'Section=feature Note="FILL"',
  'Liberating Stride':'Section=feature Note="FILL"',
  'Anchoring Aura':'Section=feature Note="FILL"',
  'Aura Of Life':'Section=feature Note="FILL"',
  'Aura Of Righteousness':'Section=feature Note="FILL"',
  'Aura Of Vengeance':'Section=feature Note="FILL"',
  'Divine Reflexes':'Section=feature Note="FILL"',
  'Litany Of Righteousness':'Section=feature Note="FILL"',
  'Wyrmbane Aura':'Section=feature Note="FILL"',
  'Auspicious Mount':'Section=feature Note="FILL"',
  'Instrument Of Zeal':'Section=feature Note="FILL"',
  'Shield Of Grace':'Section=feature Note="FILL"',
  'Celestial Form':'Section=feature Note="FILL"',
  'Ultimate Mercy':'Section=feature Note="FILL"',
  'Celestial Mount':'Section=feature Note="FILL"',
  'Radiant Blade Master':'Section=feature Note="FILL"',
  'Shield Paragon':'Section=feature Note="FILL"',

  // Cleric
  // Alertness as above
  'Cleric Feats':'Section=feature Note="%V selections"',
  'Cleric Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  'Divine Defense':'Section=feature Note="FILL"',
  'Divine Font':'Section=feature Note="FILL"',
  'Divine Spellcasting':'Section=feature Note="FILL"',
  'Doctrine':'Section=feature Note="FILL"',
  // Lightning Reflexes as above
  'Miraculous Spell':'Section=feature Note="FILL"',
  // Resolve as above
  // Weapon Specialization as above

  'Deadly Simplicity':'Section=feature Note="FILL"',
  'Domain Initiate':'Section=feature Note="FILL"',
  'Harming Hands':'Section=feature Note="FILL"',
  'Healing Hands':'Section=feature Note="FILL"',
  'Holy Castigation':'Section=feature Note="FILL"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':'Section=feature Note="FILL"',
  'Emblazon Armament':'Section=feature Note="FILL"',
  'Sap Life':'Section=feature Note="FILL"',
  'Turn Undead':'Section=feature Note="FILL"',
  'Versatile Font':'Section=feature Note="FILL"',
  'Channel Smite':'Section=feature Note="FILL"',
  'Command Undead':'Section=feature Note="FILL"',
  'Directed Channel':'Section=feature Note="FILL"',
  'Improved Communal Healing':'Section=feature Note="FILL"',
  'Necrotic Infusion':'Section=feature Note="FILL"',
  'Cast Down':'Section=feature Note="FILL"',
  'Divine Weapon':'Section=feature Note="FILL"',
  'Selective Energy':'Section=feature Note="FILL"',
  // Steady Spellcasting as above
  'Advanced Domain':'Section=feature Note="FILL"',
  'Align Armament':'Section=feature Note="FILL"',
  'Channeled Succor':'Section=feature Note="FILL"',
  'Cremate Undead':'Section=feature Note="FILL"',
  'Emblazon Energy':'Section=feature Note="FILL"',
  'Castigating Weapon':'Section=feature Note="FILL"',
  'Heroic Recovery':'Section=feature Note="FILL"',
  'Improved Command Undead':'Section=feature Note="FILL"',
  'Replenishment Of War':'Section=feature Note="FILL"',
  'Defensive Recovery':'Section=feature Note="FILL"',
  'Domain Focus':'Section=feature Note="FILL"',
  'Emblazon Antimagic':'Section=feature Note="FILL"',
  'Shared Replenishment':'Section=feature Note="FILL"',
  "Deity's Protection":'Section=feature Note="FILL"',
  'Extend Armament Alignment':'Section=feature Note="FILL"',
  'Fast Channel':'Section=feature Note="FILL"',
  'Swift Banishment':'Section=feature Note="FILL"',
  'Eternal Bane':'Section=feature Note="FILL"',
  'Eternal Blessing':'Section=feature Note="FILL"',
  'Resurrectionist':'Section=feature Note="FILL"',
  'Domain Wellspring':'Section=feature Note="FILL"',
  'Echoing Channel':'Section=feature Note="FILL"',
  'Improved Swift Banishment':'Section=feature Note="FILL"',
  "Avatar's Audience":'Section=feature Note="FILL"',
  'Maker Of Miracles':'Section=feature Note="FILL"',
  'Metamagic Channel':'Section=feature Note="FILL"',

  // Druid
  // Alertness as above
  'Druid Feats':'Section=feature Note="%V selections"',
  'Druid Skills':
    'Section=skill Note="Skill Trained (Nature; Choose %V from any)"',
  'Druidic Language':'Section=feature Note="FILL"',
  'Druidic Order':'Section=feature Note="FILL"',
  'Druid Weapon Expertise':'Section=feature Note="FILL"',
  // Expert Spellcaster as above
  // Great Fortitude as above
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Master Spellcaster as above
  // Medium Armor Expertise as above
  'Primal Hierophant':'Section=feature Note="FILL"',
  'Primal Spellcasting':'Section=feature Note="FILL"',
  // Resolve as above
  // Shield Block as below
  // Weapon Specialization as above
  'Wild Empathy':'Section=feature Note="FILL"',

  'Animal Companion':'Section=feature Note="FILL"',
  'Leshy Familiar':'Section=feature Note="FILL"',
  // Reach Spell as above
  'Storm Born':'Section=feature Note="FILL"',
  'Widen Spell':'Section=feature Note="FILL"',
  'Wild Shape':'Section=feature Note="FILL"',
  'Call Of The Wild':'Section=feature Note="FILL"',
  'Enhanced Familiar':'Section=feature Note="FILL"',
  'Order Explorer':'Section=feature Note="FILL"',
  // Poison Resistance as above
  'Form Control':'Section=feature Note="FILL"',
  'Mature Animal Companion':'Section=feature Note="FILL"',
  'Order Magic':'Section=feature Note="FILL"',
  'Thousand Faces':'Section=feature Note="FILL"',
  'Woodland Stride':'Section=feature Note="FILL"',
  'Green Empathy':'Section=feature Note="FILL"',
  'Insect Shape':'Section=feature Note="FILL"',
  // Steady Spellcasting as above
  'Storm Retribution':'Section=feature Note="FILL"',
  'Ferocious Shape':'Section=feature Note="FILL"',
  'Fey Caller':'Section=feature Note="FILL"',
  'Incredible Companion':'Section=feature Note="FILL"',
  'Soaring Shape':'Section=feature Note="FILL"',
  'Wind Caller':'Section=feature Note="FILL"',
  'Elemental Shape':'Section=feature Note="FILL"',
  'Healing Transformation':'Section=feature Note="FILL"',
  'Overwhelming Energy':'Section=feature Note="FILL"',
  'Plant Shape':'Section=feature Note="FILL"',
  'Side By Side':'Section=feature Note="FILL"',
  'Dragon Shape':'Section=feature Note="FILL"',
  'Green Tongue':'Section=feature Note="FILL"',
  'Primal Focus':'Section=feature Note="FILL"',
  'Primal Summons':'Section=feature Note="FILL"',
  'Specialized Companion':'Section=feature Note="FILL"',
  'Timeless Nature':'Section=feature Note="FILL"',
  'Verdant Metamorphosis':'Section=feature Note="FILL"',
  // Effortless Concentration as above
  'Impaling Briars':'Section=feature Note="FILL"',
  'Monstrosity Shape':'Section=feature Note="FILL"',
  'Invoke Disaster':'Section=feature Note="FILL"',
  'Perfect Form Control':'Section=feature Note="FILL"',
  'Primal Wellspring':'Section=feature Note="FILL"',
  "Hierophant's Power":'Section=feature Note="FILL"',
  'Leyline Conduit':'Section=feature Note="FILL"',
  'True Shapeshifter':'Section=feature Note="FILL"',

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
      '"Success on Will save vs. fear is a critical save/Reduce value of frightened condition by 1"',
  'Combat Flexibility':
    'Section=combat ' +
    'Note="May use chosen fighter feat of up to 8th level %{$\'features.Improved Flexibility\'?\' and chosen fighter feat of up to 14th level\':\'\'} each dy"',
  // Evasion as above
  'Fighter Expertise':'Section=feature Note="Class Expert (Fighter)"',
  'Fighter Feats':'Section=feature Note="%V selections"',
  'Fighter Skills':
    'Section=skill ' +
    'Note="Skill Trained (Choose 1 from Acrobatics, Athletics; Choose %V from any)"',
  'Fighter Weapon Mastery':
    'Section=combat ' +
    'Note="Weapon Master with common weapons of chosen group/Weapon Expert with advanced weapons/May use critical specialization effects of all weapons with master proficiency"',
  // Greater Weapon Specialization as above
  'Improved Flexibility':
    'Section=combat Note="Increased Combat Flexibility effects"',
  // Juggernaut as above
  // Shield Block as below
  'Versatile Legend':
    'Section=combat ' +
    'Note="Weapon Legendary (Simple Weapons; Martial Weapons; Unarmed Attacks)/Weapon Master (Advanced Weapons)/Class Master (Fighter)"',
  'Weapon Legend':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Master (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"Weapon Legendary in common weapons of chosen group/Weapon Master in advanced weapons"',

  // Weapon Specialization as above
  'Double Slice':
    'Section=combat Note="May attack with two weapons simultaneously"',
  'Exacting Strike':
    'Section=combat ' +
    'Note="Failed attack does not count toward multi-attack penalty"',
  'Point-Blank Shot':
    'Section=combat ' +
    'Note="Suffers no volley penalty from ranged volley weapon/+2 attack at close range with ranged non-volley weapon"',
  'Power Attack':
    'Section=combat ' +
    'Note="Melee Strike inflicts %{level<10?1:level<18?2:3} extra dice damage; counts as two Strikes for multi-attack penalty"',
  'Reactive Shield':
    'Section=combat Note="May use Reaction to make a Raise a Shield action"',
  'Snagging Strike':
    'Section=combat ' +
    'Note="Successful Strike inflicts flat-footed on target for 1 rd"',
  // Sudden Charge as above
  'Aggressive Block':
    'Section=combat ' +
    'Note="May use Shield Block to move foe 5\' or cause it to become flat-footed (foe\'s choice)"',
  'Assisting Shot':
    'Section=combat ' +
    'Note="Successful ranged Strike gives next attack on foe +1 attack (critical success +2)"',
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
    'Note="May follow successful Strike with an Athletic check to Trip"',
  'Powerful Shove':
    'Section=combat ' +
    'Note="May use Aggressive Block and Brutish Shove on foes two sizes larger/Shoved creature takes %{strengthModifier>?1} damage from hitting an object"',
  'Quick Reversal':
    'Section=combat Note="May use an attack to Strike two flanking foes"',
  'Shielded Stride':
    'Section=combat ' +
    'Note="May Stride at half Speed without provoking Attacks of Opportunity"',
  // Swipe as above
  'Twin Parry':
    'Section=combat ' +
    'Note="Wielding two weapons give +1 AC, or +2 with parry trait"',
  'Advanced Weapon Training':
    'Section=combat ' +
    'Note="Weapon Trained with advanced weapons in chosen group"',
  'Advantageous Assault':
    'Section=combat ' +
    'Note="Strike on grabbed, prone, or restrained foe inflicts +damage dice damage (+damage dice + 2 if wielded two-handed), even on failure"',
  'Disarming Stance':
    'Section=combat ' +
    'Note="+1 to Disarm; +2 vs. Disarm/May Disarm foes two sizes larger"',
  'Furious Focus':
    'Section=combat ' +
    'Note="Two-handed power attacks count as single attacks for multi-attack penalty"',
  "Guardian's Deflection":
    'Section=combat Note="May use Reaction to give adjacent ally +2 AC"',
  'Reflexive Shield':
    'Section=save Note="Raised shield adds bonus to Reflex saves"',
  'Revealing Stab':
    'Section=combat ' +
    'Note="May leave a piercing weapon embedded in a corporeal concealed or hidden foe to reveal it to others"',
  'Shatter Defenses':
    'Section=combat ' +
    'Note="A successful Strike vs. a frightened foe inflicts flat-footed while fright lasts"',
  // Shield Warden as above
  'Triple Shot':
    'Section=combat ' +
    'Note="May use Double Shot against a single foe/May make three ranged Strikes against a single foe, suffering a -4 attack penalty on each"',
  'Blind-Fight':
    'Section=combat ' +
    'Note="May attack concealed foes without a prior check and hidden creatures with a DC 5 check"',
  'Dueling Riposte':
    'Section=combat ' +
    'Note="May use a Reaction to Strike or Disarm a foe who critically misses an attack on self"',
  'Felling Strike':
    'Section=combat ' +
    'Note="May spend 2 actions to attack a flying foe; a successful Strike causes it to fall 120\', and a critical hit grounds it for 1 rd"',
  'Incredible Aim':
    'Section=combat ' +
    'Note="May spend 2 actions to gain +2 on a ranged attack that ignores concealment"',
  'Mobile Shot Stance':
    'Section=combat ' +
    'Note="Ranged Strikes do not trigger reactions/May use Attack Of Opportunity with a loaded ranged weapon on an adjacent creature"',
  'Positioning Assault':
    'Section=combat ' +
    'Note="May use 2 actions to move target 5\' within reach with a successful Strike"',
  // Quick Shield Block as above
  // Sudden Leap as above
  'Agile Grace':'Section=combat Note="Reduces multi-attack penalty to -3/-6"',
  'Certain Strike':
    'Section=combat ' +
    'Note="Failed Strike inflicts normal damage other than damage dice"',
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
    'Note="May use Attack Of Opportunity in response to a concentrate action; successful Strike disrupts"',
  'Fearsome Brute':
    'Section=combat ' +
    'Note="Strikes against frightened foes inflict +frighted value x %{rank.Intimidation>=2?3:2} damage"',
  'Improved Knockdown':
    'Section=combat Note="May use Knockdown without a Trip check"',
  'Mirror Shield':
    'Section=combat ' +
    'Note="May use a Reaction to reflect a spell back upon caster with a ranged Strike"',
  'Twin Riposte':
    'Section=combat ' +
    'Note="May use a Reaction to Strike or Disarm a foe who critically fails on a Strike on self"',
  'Brutal Finish':
    'Section=combat ' +
    'Note="May end turn with a two-handed Strike that inflicts +%{level>=18?2:1} damage dice, even on a failure"',
  'Dueling Dance':
    'Section=combat ' +
    'Note="+2 AC when wielding a one-handed weapon with a hand free"',
  'Flinging Shove':'Section=combat Note="Aggressive Block moves foe 10\' (critical success 20\') or inflicts flat-footed; Brutish Shove moves foe 10\' (failure 5\', critical success 20\')"',
  'Improved Dueling Riposte':
    'Section=combat ' +
    'Note="May use an additional Reaction to make a Dueling Riposte 1/tn"',
  'Incredible Ricochet':
    'Section=combat ' +
    'Note="Second ranged attack against the same foe ignores concealment and cover"',
  'Lunging Stance':
    'Section=combat Note="May make an Attack Of Opportunity with Lunge"',
  "Paragon's Guard":
    'Section=combat Note="Constantly gain the benefits of a Raised shield"',
  'Spring Attack':
    'Section=combat Note="May attack foes before and after full speed Stride"',
  'Desperate Finisher':
    'Section=combat ' +
    'Note="May use a press action as a Reaction at the end of turn"',
  'Determination':
    'Section=save ' +
    'Note="May end a nonpermanent spell (%{level/2} counteract Will save) or condition affecting self 1/dy"',
  'Guiding Finish':
    'Section=combat ' +
    'Note="May move target 10\' within reach with a successful Strike (unsuccessful 5\')"',
  'Guiding Riposte':
    'Section=combat ' +
    'Note="May move target 10\' within reach with a successful Dueling Riposte Strike"',
  'Improved Twin Riposte':
    'Section=combat ' +
    'Note="May use an additional Reaction to make a Twin Riposte 1/tn"',
  'Stance Savant':'Section=combat Note="May enter a stance upon initiative"',
  'Two-Weapon Flurry':
    'Section=combat Note="May Strike with two weapons simultaneously"',
  // Whirlwind Strike as above
  'Graceful Poise':
    'Section=combat ' +
    'Note="Double Slice with an agile weapon counts as one attack"',
  'Improved Reflexive Shield':
    'Section=combat ' +
    'Note="May use Shield Block to protect both self and adjacent allies"',
  'Multishot Stance':
    'Section=combat Note="Double/Triple Shot penalty reduced to -1/-2"',
  'Twinned Defense':
    'Section=combat Note="Gives constant benefits of Twin Parry"',
  'Impossible Volley':
    'Section=combat ' +
    'Note="May use 3 actions to make a -2 ranged attack against all foes in a 10\' radius"',
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
  'Adamantine Strikes':'Section=feature Note="FILL"',
  // Alertness as above
  'Expert Strikes':'Section=feature Note="FILL"',
  'Flurry Of Blows':'Section=feature Note="FILL"',
  'Graceful Legend':'Section=feature Note="FILL"',
  'Graceful Mastery':'Section=feature Note="FILL"',
  // Greater Weapon Specialization as above
  'Incredible Movement':'Section=feature Note="FILL"',
  'Master Strikes':'Section=feature Note="FILL"',
  'Metal Strikes':'Section=feature Note="FILL"',
  'Monk Expertise':'Section=feature Note="FILL"',
  'Monk Feats':'Section=feature Note="%V selections"',
  'Monk Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Mystic Strikes':'Section=feature Note="FILL"',
  'Path To Perfection':'Section=feature Note="FILL"',
  'Perfected Form':'Section=feature Note="FILL"',
  'Powerful Fist':'Section=feature Note="FILL"',
  'Second Path To Perfection':'Section=feature Note="FILL"',
  'Third Path To Perfection':'Section=feature Note="FILL"',
  // Weapon Specialization as above

  'Crane Stance':'Section=feature Note="FILL"',
  'Dragon Stance':'Section=feature Note="FILL"',
  'Ki Rush':'Section=feature Note="FILL"',
  'Ki Strike':'Section=feature Note="FILL"',
  'Monastic Weaponry':'Section=feature Note="FILL"',
  'Mountain Stance':'Section=feature Note="FILL"',
  'Tiger Stance':'Section=feature Note="FILL"',
  'Wolf Stance':'Section=feature Note="FILL"',
  'Brawling Focus':'Section=feature Note="FILL"',
  'Cruising Grab':'Section=feature Note="FILL"',
  'Dancing Leaf':'Section=feature Note="FILL"',
  'Elemental Fist':'Section=feature Note="FILL"',
  'Stunning Fist':'Section=feature Note="FILL"',
  'Deflect Arrow':'Section=feature Note="FILL"',
  'Flurry Of Maneuvers':'Section=feature Note="FILL"',
  'Flying Kick':'Section=feature Note="FILL"',
  'Guarded Movement':'Section=feature Note="FILL"',
  'Stand Still':'Section=feature Note="FILL"',
  'Wholeness Of Body':'Section=feature Note="FILL"',
  'Abundant Step':'Section=feature Note="FILL"',
  'Crane Flutter':'Section=feature Note="FILL"',
  'Dragon Roar':'Section=feature Note="FILL"',
  'Ki Blast':'Section=feature Note="FILL"',
  'Mountain Stronghold':'Section=feature Note="FILL"',
  'Tiger Slash':'Section=feature Note="FILL"',
  'Water Step':'Section=feature Note="FILL"',
  'Whirling Throw':'Section=feature Note="FILL"',
  'Wolf Drag':'Section=feature Note="FILL"',
  'Arrow Snatching':'Section=feature Note="FILL"',
  'Ironblood Stance':'Section=feature Note="FILL"',
  'Mixed Maneuver':'Section=feature Note="FILL"',
  'Tangled Forest Stance':'Section=feature Note="FILL"',
  'Wall Run':'Section=feature Note="FILL"',
  'Wild Winds Initiate':'Section=feature Note="FILL"',
  'Knockback Strike':'Section=feature Note="FILL"',
  'Sleeper Hold':'Section=feature Note="FILL"',
  'Wind Jump':'Section=feature Note="FILL"',
  'Winding Flow':'Section=feature Note="FILL"',
  'Diamond Soul':'Section=feature Note="FILL"',
  'Disrupt Ki':'Section=feature Note="FILL"',
  'Improved Knockback':'Section=feature Note="FILL"',
  'Meditative Focus':'Section=feature Note="FILL"',
  // Stance Savant as above
  'Ironblood Surge':'Section=feature Note="FILL"',
  'Mountain Quake':'Section=feature Note="FILL"',
  'Tangled Forest Rake':'Section=feature Note="FILL"',
  'Timeless Body':'Section=feature Note="FILL"',
  'Tongue Of Sun And Moon':'Section=feature Note="FILL"',
  'Wild Winds Gust':'Section=feature Note="FILL"',
  'Enlightened Presence':'Section=feature Note="FILL"',
  'Master Of Many Styles':'Section=feature Note="FILL"',
  'Shattering Strike':'Section=feature Note="FILL"',
  'Diamond Fists':'Section=feature Note="FILL"',
  'Empty Body':'Section=feature Note="FILL"',
  'Meditative Wellspring':'Section=feature Note="FILL"',
  'Swift River':'Section=feature Note="FILL"',
  'Enduring Quickness':'Section=feature Note="FILL"',
  'Fuse Stance':'Section=feature Note="FILL"',
  'Impossible Technique':'Section=feature Note="FILL"',

  // Ranger
  // Evasion as above
  // Greater Weapon Specialization as above
  'Hunt Prey':'Section=feature Note="FILL"',
  "Hunter's Edge":'Section=feature Note="FILL"',
  'Improved Evasion':'Section=feature Note="FILL"',
  'Incredible Senses':'Section=feature Note="FILL"',
  // Iron Will as above
  // Juggernaut as above
  'Masterful Hunter':'Section=feature Note="FILL"',
  // Medium Armor Expertise as above
  "Nature's Edge":'Section=feature Note="FILL"',
  'Ranger Expertise':'Section=feature Note="FILL"',
  'Ranger Feats':'Section=feature Note="%V selections"',
  'Ranger Skills':
    'Section=skill Note="Skill Trained (Nature; Survival; Choose %V from any)"',
  'Ranger Weapon Expertise':'Section=feature Note="FILL"',
  'Second Skin':'Section=feature Note="FILL"',
  'Swift Prey':'Section=feature Note="FILL"',
  'Trackless Step':'Section=feature Note="FILL"',
  // Vigilant Senses as above
  'Wild Stride':'Section=feature Note="FILL"',
  // Weapon Mastery as above
  // Weapon Specialization as above

  // Animal Companion as above
  'Crossbow Ace':'Section=feature Note="FILL"',
  'Hunted Shot':'Section=feature Note="FILL"',
  'Monster Hunter':'Section=feature Note="FILL"',
  'Twin Takedown':'Section=feature Note="FILL"',
  'Favored Terrain':'Section=feature Note="FILL"',
  "Hunter's Aim":'Section=feature Note="FILL"',
  'Monster Warden':'Section=feature Note="FILL"',
  'Quick Draw':'Section=feature Note="FILL"',
  // Wild Empathy as above
  "Companion's Cry":'Section=feature Note="FILL"',
  'Disrupt Prey':'Section=feature Note="FILL"',
  'Far Shot':'Section=feature Note="FILL"',
  'Favored Enemy':'Section=feature Note="FILL"',
  'Running Reload':'Section=feature Note="FILL"',
  "Scout's Warning":'Section=feature Note="FILL"',
  'Snare Specialist':'Section=feature Note="FILL"',
  // Twin Parry as above
  // Mature Animal Companion as above
  'Quick Snares':'Section=feature Note="FILL"',
  'Skirmish Strike':'Section=feature Note="FILL"',
  'Snap Shot':'Section=feature Note="FILL"',
  'Swift Tracker':'Section=feature Note="FILL"',
  'Deadly Aim':'Section=feature Note="FILL"',
  'Hazard Finder':'Section=feature Note="FILL"',
  'Powerful Snares':'Section=feature Note="FILL"',
  'Terrain Master':'Section=feature Note="FILL"',
  "Warden's Boon":'Section=feature Note="FILL"',
  'Camouflage':'Section=feature Note="FILL"',
  // Incredible Companion as above
  'Master Monster Hunter':'Section=feature Note="FILL"',
  'Penetrating Shot':'Section=feature Note="FILL"',
  // Twin Riposte as above
  "Warden's Step":'Section=feature Note="FILL"',
  'Distracting Shot':'Section=feature Note="FILL"',
  'Double Prey':'Section=feature Note="FILL"',
  'Lightning Snares':'Section=feature Note="FILL"',
  'Second Sting':'Section=feature Note="FILL"',
  // Side By Side as above
  'Sense The Unseen':'Section=feature Note="FILL"',
  'Shared Prey':'Section=feature Note="FILL"',
  'Stealthy Companion':'Section=feature Note="FILL"',
  'Targeting Shot':'Section=feature Note="FILL"',
  "Warden's Guidance":'Section=feature Note="FILL"',
  'Greater Distracting Shot':'Section=feature Note="FILL"',
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':'Section=feature Note="FILL"',
  // Specialized Companion as above
  'Ubiquitous Snares':'Section=feature Note="FILL"',
  'Impossible Flurry':'Section=feature Note="FILL"',
  // Impossible Volley as above
  'Manifold Edge':'Section=feature Note="FILL"',
  'Masterful Companion':'Section=feature Note="FILL"',
  'Perfect Shot':'Section=feature Note="FILL"',
  'Shadow Hunter':'Section=feature Note="FILL"',
  'Legendary Shot':'Section=feature Note="FILL"',
  'To The Ends Of The Earth':'Section=feature Note="FILL"',
  'Triple Threat':'Section=feature Note="FILL"',
  'Ultimate Skirmisher':'Section=feature Note="FILL"',

  // Rogue
  'Debilitating Strike':'Section=feature Note="FILL"',
  // Deny Advantage as above
  'Double Debilitation':'Section=feature Note="FILL"',
  // Evasion as above
  // Great Fortitude as above
  // Greater Weapon Specialization as above
  // Improved Evasion as above
  // Incredible Senses as above
  // Light Armor Expertise as above
  'Light Armor Mastery':'Section=feature Note="FILL"',
  'Master Strike':'Section=feature Note="FILL"',
  'Master Tricks':'Section=feature Note="FILL"',
  'Rogue Expertise':'Section=feature Note="FILL"',
  'Rogue Feats':'Section=feature Note="%V selections"',
  'Rogue Skills':
    'Section=skill Note="Skill Trained (Stealth; Choose %V from any)"',
  "Rogue's Racket":'Section=feature Note="FILL"',
  'Slippery Mind':'Section=feature Note="FILL"',
  'Sneak Attack':'Section=feature Note="FILL"',
  'Surprise Attack':'Section=feature Note="FILL"',
  // Vigilant Senses as above
  'Weapon Tricks':'Section=feature Note="FILL"',
  // Weapon Specialization as above

  'Nimble Dodge':'Section=feature Note="FILL"',
  'Trap Finder':'Section=feature Note="FILL"',
  'Twin Feint':'Section=feature Note="FILL"',
  "You're Next":'Section=feature Note="FILL"',
  'Brutal Beating':'Section=feature Note="FILL"',
  'Distracting Feint':'Section=feature Note="FILL"',
  'Minor Magic':'Section=feature Note="FILL"',
  'Mobility':'Section=feature Note="FILL"',
  // Quick Draw as above
  'Unbalancing Blow':'Section=feature Note="FILL"',
  'Battle Assessment':'Section=feature Note="FILL"',
  'Dead Striker':'Section=feature Note="FILL"',
  'Magical Trickster':'Section=feature Note="FILL"',
  'Poison Weapon':'Section=feature Note="FILL"',
  'Reactive Pursuit':'Section=feature Note="FILL"',
  'Sabotage':'Section=feature Note="FILL"',
  // Scout's Warning as above
  'Gang Up':'Section=feature Note="FILL"',
  'Light Step':'Section=feature Note="FILL"',
  // Skirmish Strike as above
  'Twist The Knife':'Section=feature Note="FILL"',
  // Blind-Fight as above
  'Delay Trap':'Section=feature Note="FILL"',
  'Improved Poison Weapon':'Section=feature Note="FILL"',
  'Nimble Roll':'Section=feature Note="FILL"',
  'Opportune Backstab':'Section=feature Note="FILL"',
  'Sidestep':'Section=feature Note="FILL"',
  'Sly Striker':'Section=feature Note="FILL"',
  'Precise Debilitations':'Section=feature Note="FILL"',
  'Sneak Savant':'Section=feature Note="FILL"',
  'Tactical Debilitations':'Section=feature Note="FILL"',
  'Vicious Debilitations':'Section=feature Note="FILL"',
  'Critical Debilitation':'Section=feature Note="FILL"',
  'Fantastic Leap':'Section=feature Note="FILL"',
  'Felling Shot':'Section=feature Note="FILL"',
  'Reactive Interference':'Section=feature Note="FILL"',
  'Spring From The Shadows':'Section=feature Note="FILL"',
  'Defensive Roll':'Section=feature Note="FILL"',
  'Instant Opening':'Section=feature Note="FILL"',
  'Leave An Opening':'Section=feature Note="FILL"',
  // Sense The Unseen as above
  'Blank Slate':'Section=feature Note="FILL"',
  'Cloud Step':'Section=feature Note="FILL"',
  'Cognitive Loophole':'Section=feature Note="FILL"',
  'Dispelling Slice':'Section=feature Note="FILL"',
  'Perfect Distraction':'Section=feature Note="FILL"',
  'Implausible Infiltration':'Section=feature Note="FILL"',
  'Powerful Sneak':'Section=feature Note="FILL"',
  "Trickster's Ace":'Section=feature Note="FILL"',
  'Hidden Paragon':'Section=feature Note="FILL"',
  'Impossible Striker':'Section=feature Note="FILL"',
  'Reactive Distraction':'Section=feature Note="FILL"',

  // Sorcerer
  // Alertness as above
  'Bloodline Paragon':'Section=feature Note="FILL"',
  'Bloodline':'Section=feature Note="FILL"',
  'Defensive Robes':'Section=feature Note="FILL"',
  // Expert Spellcaster as above
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  'Magical Fortitude':'Section=feature Note="FILL"',
  // Master Spellcaster as above
  // Resolve as above
  // Signature Spells as above
  'Sorcerer Feats':'Section=feature Note="%V selections"',
  'Sorcerer Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Sorcerer Spellcasting':'Section=feature Note="FILL"',
  'Spell Repertoire':'Section=feature Note="FILL"',
  // Weapon Expertise as above
  // Weapon Specialization as above

  'Counterspell':'Section=feature Note="FILL"',
  'Dangerous Sorcerer':'Section=feature Note="FILL"',
  'Familiar':'Section=feature Note="FILL"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':'Section=feature Note="FILL"',
  'Bespell Weapon':'Section=feature Note="FILL"',
  'Divine Evolution':'Section=feature Note="FILL"',
  'Occult Evolution':'Section=feature Note="FILL"',
  'Primal Evolution':'Section=feature Note="FILL"',
  'Advanced Bloodline':'Section=feature Note="FILL"',
  // Steady Spellcasting as above
  'Bloodline Resistance':'Section=feature Note="FILL"',
  'Crossblooded Evolution':'Section=feature Note="FILL"',
  'Greater Bloodline':'Section=feature Note="FILL"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':'Section=feature Note="FILL"',
  'Magic Sense':'Section=feature Note="FILL"',
  'Interweave Spell':'Section=feature Note="FILL"',
  'Reflect Spell':'Section=feature Note="FILL"',
  // Effortless Concentration as above
  'Greater Mental Evolution':'Section=feature Note="FILL"',
  'Greater Vital Evolution':'Section=feature Note="FILL"',
  'Bloodline Wellspring':'Section=feature Note="FILL"',
  'Greater Crossblooded Evolution':'Section=feature Note="FILL"',
  'Bloodline Conduit':'Section=feature Note="FILL"',
  'Bloodline Perfection':'Section=feature Note="FILL"',
  'Metamagic Mastery':'Section=feature Note="FILL"',

  // Wizard
  // Alertness as above
  'Arcane Bond':'Section=feature Note="FILL"',
  'Arcane School':'Section=feature Note="FILL"',
  'Arcane Spellcasting':'Section=feature Note="FILL"',
  'Arcane Thesis':'Section=feature Note="FILL"',
  "Archwizard's Spellcraft":'Section=feature Note="FILL"',
  // Expert Spellcaster as above
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Magical Fortitude as above
  // Resolve as above
  'Wizard Feats':'Section=feature Note="%V selections"',
  'Wizard Skills':
    'Section=skill Note="Skill Trained (Arcana; Choose %V from any)"',
  'Wizard Weapon Expertise':'Section=feature Note="FILL"',

  // Counterspell as above
  'Eschew Materials':'Section=feature Note="FILL"',
  // Familiar as above
  'Hand Of The Apprentice':'Section=feature Note="FILL"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':'Section=feature Note="FILL"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':'Section=feature Note="FILL"',
  'Silent Spell':'Section=feature Note="FILL"',
  'Spell Penetration':'Section=feature Note="FILL"',
  // Steady Spellcasting as above
  'Advanced School Spell':'Section=feature Note="FILL"',
  'Bond Conservation':'Section=feature Note="FILL"',
  'Universal Versatility':'Section=feature Note="FILL"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Savant':'Section=feature Note="FILL"',
  'Clever Counterspell':'Section=feature Note="FILL"',
  // Magic Sense as above
  'Bonded Focus':'Section=feature Note="FILL"',
  // Reflect Spell as above
  'Superior Bond':'Section=feature Note="FILL"',
  // Effortless Concentration as above
  'Spell Tinker':'Section=feature Note="FILL"',
  'Infinite Possibilities':'Section=feature Note="FILL"',
  'Reprepare Spell':'Section=feature Note="FILL"',
  "Archwizard's Might":'Section=feature Note="FILL"',
  // Metamagic Mastery as above
  'Spell Combination':'Section=feature Note="FILL"',

  // General Feats
  'Adopted Ancestry':
    'Section=feature Note="May take ancestry feats from chosen ancestry"',
  'Ancestral Paragon':'Section=feature Note="FILL"',
  'Armor Proficiency':
    'Section=feature ' +
    // TODO interacts w/other sources of Armor Trained
    'Note="Armor Trained (%{$\'feats.Armor Proficiency\'>=3?\'Heavy\':$\'feats.Armor Proficiency\'>=2?\'Medium\':\'Light\'} Armor)"',
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
  'Weapon Proficiency':'Section=combat Note="+1 Weapon Proficiency Rank"',

  // General Skill Feats
  'Assurance (%skill)':'Section=skill Note="May take 10 on %skill rolls"',
  'Automatic Knowledge (%skill)':
    'Section=skill Note="May use Recall Knowledge with %skill 1/rd"',
  'Dubious Knowledge':
    'Section=skill ' +
    'Note="Fail on Recall Knowledge yields a mix of true and false info"',
  'Magical Shorthand':'Section=skill Note="May learn new spells in %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Religion>=4?\'1 min\':rank.Arcana==3||rank.Nature>=3||rank.Occultism>=3||rank.Religion==3?\'5 min\':\'1 hr\'} per spell level; may retry 1 week after failure"',
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
    'Section=skill Note="May use Craft to create alchemical items"',
  'Arcane Sense':
    'Section=magic ' +
    'Note="May cast <i>Detect Magic</i> at level %{rank.Arcana>=4?4:rank.Arcana>=3?3:1} at will"',
  'Bargain Hunter':
    'Section=skill Note="+2 initial gold/May use Diplomacy to Earn Income"',
  'Battle Cry':
    'Section=combat ' +
    'Note="May Demoralize a foe during initiative%{rank.Intimidation>=4?\' or on attack critical success\':\'\'}"',
  'Battle Medicine':
    'Section=skill Note="May use Medicine for Treat Wounds 1/target/dy"',
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
    'Note="May Track at full Speed%{rank.Survival<3\' at a -5 penalty\':\'\'}%{rank.Survival>=4?\'/Does not require a new roll every hour to Track\':\'\'}"',
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
    'Note="+{strength>=20&&rank.Intimidation>=3?2:1} to Coerce or Demoralize when physically menacing target"',
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
    'Note="May use 1 hr process and a successful Medicine check to remove a disease or condition 1/target/dy"',
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
    'Section=skill ' +
    'Note="May use Nature to Treat Wounds, +2 checks in wilderness"',
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
    'Note="May roll a single Steath check to Avoid Notice when leading a group"',
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
    'Note="May use Survival-2 to Recall Knowledge about local creatures after 10 min study"',
  'Swift Sneak':
    'Section=skill ' +
    'Note="May Sneak at full Speed and while Burrowing, Climbing, Flying, or Swimming"',
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
    'Section=companion ' +
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
Pathfinder2E.LORES = {
  'Academia':'',
  'Accounting':'',
  'Architecture':'',
  'Art':'',
  'Circus':'',
  'Engineering':'',
  'Farming':'',
  'Fishing':'',
  'Fortune-Telling':'',
  'Games':'',
  'Genealogy':'',
  'Gladiatorial':'',
  'Guild':'',
  'Heraldry':'',
  'Herbalism':'',
  'Hunting':'',
  'Labor':'',
  'Legal':'',
  'Library':'',
  // TODO Specific deity
  // TODO Specific creature
  // TODO Specific plane
  // TODO Specific settlement
  // TODO Specific terrain
  'Cave':'',
  'Cavern':'',
  'City':'',
  'Desert':'',
  'Forest':'',
  'Plains':'',
  'Swamp':'',
  // TODO Specific food or drink
  'Alcohol':'',
  //
  'Mercantile':'',
  'Midwifery':'',
  'Milling':'',
  'Mining':'',
  'Sailing':'',
  'Scouting':'',
  'Scribing':'',
  'Stabling':'',
  'Tanning':'',
  'Theater':'',
  'Underworld':'',
  'Warfare':''
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
  '%lore Lore':'Ability=Intelligence',
  'Medicine':'Ability=Wisdom',
  'Nature':'Ability=Wisdom',
  'Occultism':'Ability=Intelligence',
  'Performance':'Ability=Charisma',
  'Religion':'Ability=Wisdom',
  'Society':'Ability=Intelligence',
  'Stealth':'Ability=Dexterity',
  'Survival':'Ability=Wisdom',
  'Thievery':'Ability=Dexterity'
};
Pathfinder2E.SPELLS = {
  // TODO
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
  'Sickle':'Category=Simple Price=0.2 Damage=1d4S Bulk=L Hands=1 Group=Knife Trait=Agile,Finesse,Trip',
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
    'Category=Martial Price=0.3 Damage=1d6B Bulk=L Hands=1 Group=Hammer Trait=Agile,Thrown',
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
    'Category=Martial Price=2 Damage=1d6P Bulk=1 Hands=1 Group=Sword Trait="Deady d8",Disarm,Finesse',
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
    'Category=Martial Price=2 Damage=1d6B Bulk=1 Hands=1 Group=Hammer Trait=Gnome,Trip,"Two-Hand d10",Uncommon,"Versatile P"',
  'Horsechopper':
    'Category=Martial Price=0.9 Damage=1d8S Bulk=2 Hands=2 Group=Polearm Trait=Goblin,Reach,Trip,Uncommon,"Versatile P"',
  'Kama':
    'Category=Martial Price=1 Damage=1d6S Bulk=L Hands=1 Group=Knife Trait=Agile,Monk,Trip,Uncommon',
  'Katana':
    'Category=Martial Price=2 Damage=1d6S Bulk=1 Hands=1 Group=Sword Trait="Deadly d8","Two-hand d10","Versatile P"',
  'Kukri':
    'Category=Martial Price=0.6 Damage=1d6P Bulk=L Hands=1 Group=Knife Trait=Agile,Finesse,Trip',
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
    'Category=Simple Price=0 Damage=1d6P Bulk=L Hands=1 Group=Sling Trait=Propulsive,"Reload 1" Range=50',

  // TODO Alchemical bomb
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
    a = a.toLowerCase();
    rules.defineChoice('notes', a + ':%V (%1)');
    rules.defineRule(a,
      'abilityBoosts.' + a, '+', 'source * 2',
      '', 'v', '20'
    );
    rules.defineRule(a + 'Modifier', a, '=', 'Math.floor((source - 10) / 2)');
    rules.defineRule
      (a + '.1', a + 'Modifier', '=', 'source>=0 ? "+" + source : source');
  }

  rules.defineRule('speed', '', '=', '25');

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
    let prefix = w.charAt(0).toLowerCase() + w.substring(1).replaceAll(' ', '');
    rules.choiceRules(rules, 'Goody', w,
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
    rules.choiceRules(rules, 'Weapon', w, weapons[w]);
  }

  rules.defineRule('armorDexBonus',
    'dexterityModifier', '=', null,
    'armorDexterityCap', 'v', null
  );
  rules.defineChoice('notes',
    'abilityNotes.armorSpeedPenalty:%V Speed',
    'armorClass:%V (dexterity%1; %2)',
    'shield:%V%1%2%3%4',
    'skillNotes.armorSkillPenalty:%V strength and dexterity skills'
  );
  rules.defineRule('armorClass',
    '', '=', '10',
    'armorACBonus', '+', null,
    'armorDexBonus', '+', null,
    'rank.Armor', '+', null,
    'rankLevelBonus.Armor', '+', null
  );
  rules.defineRule('armorClass.1',
    '', '=', '""',
    'armorDexterityCap', '=', '" (" + source + " max)"'
  );
  rules.defineRule
    ('armorClass.2', 'rank.Armor', '=', 'Pathfinder2E.RANK_NAMES[source]');
  rules.defineRule('rank.Armor',
    'armorCategory', '=', '0',
    'rank.Unarmored', '=', 'dict["armorCategory"]=="Unarmored" ? source : null',
    'rank.Light Armor', '=', 'dict["armorCategory"]=="Light" ? source : null',
    'rank.Medium Armor', '=', 'dict["armorCategory"]=="Medium" ? source : null',
    'rank.Heavy Armor', '=', 'dict["armorCategory"]=="Heavy" ? source : null'
  );
  rules.defineRule('rankLevelBonus.Armor',
    'rank.Armor', '=', 'source>0 ? 0 : null',
    'level', '+', null
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
    rules.defineRule('rank.' + s, '', '=', '0');
    rules.defineRule('rankLevelBonus.' + s,
      'rank.' + s, '=', 'source>0 ? 0 : null',
      'level', '+', null
    );
    rules.defineRule('rankBonus.' + s,
      'rank.' + s, '=', '2 * source',
      'rankLevelBonus.' + s, '+', null
    );
    rules.defineRule('save.' + s,
      saves[s] + 'Modifier', '=', null,
      'rankBonus.' + s, '+', null,
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
  rules.defineRule('abilityNotes.abilityBoosts',
    'level', '=', '4 + Math.floor(source / 5)',
    'abilityGeneration', '+', 'source.match(/4d6/) ? -1 : null'
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

};

/* Defines rules related to magic use. */
Pathfinder2E.magicRules = function(rules, schools, spells) {

  QuilvynUtils.checkAttrTable(schools, ['Features']);
  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Group', 'Level', 'Description']);

  for(let s in schools)
    rules.choiceRules(rules, 'School', s, schools[s]);
  for(let s in spells)
    rules.choiceRules(rules, 'Spell', s, spells[s]);

};

/* Defines rules related to character aptitudes. */
Pathfinder2E.talentRules = function(
  rules, feats, features, goodies, languages, lores, skills)
{

  let matchInfo;

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Type']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Class']);

  for(let g in goodies)
    rules.choiceRules(rules, 'Goody', g, goodies[g]);
  for(let l in languages)
    rules.choiceRules(rules, 'Language', l, languages[l]);
  for(let l in lores)
    rules.choiceRules(rules, 'Lore', l, lores[l]);
  for(let s in skills) {
    if((matchInfo = s.match(/(%(\w+))/)) != null) {
      for(let c in rules.getChoices(matchInfo[2] + 's')) {
        rules.choiceRules
          (rules, 'Skill', s.replace(matchInfo[1], c), skills[s].replaceAll(matchInfo[1], c));
      }
    } else {
      rules.choiceRules(rules, 'Skill', s, skills[s]);
    }
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

  rules.defineChoice('notes', 'perception:%S (wisdom; %1)');
  rules.defineRule('rank.Perception', '', '=', '0');
  rules.defineRule('rankLevelBonus.Perception',
    'rank.Perception', '=', 'source>0 ? 0 : null',
    'level', '+', null
  );
  rules.defineRule('rankBonus.Perception',
    'rank.Perception', '=', '2 * source',
    'rankLevelBonus.Perception', '+', null
  );
  rules.defineRule('perception',
    'wisdomModifier', '=', null,
    'rankBonus.Perception', '+', null,
    'skillNotes.goodiesPerceptionAdjustment', '+', null
  );
  rules.defineRule('perception.1',
    'rank.Perception', '=', 'Pathfinder2E.RANK_NAMES[source]'
  );

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
  else if(type == 'Lore')
    Pathfinder2E.loreRules(rules, name);
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
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
           (type.charAt(0).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
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
 * associated features and available heritages, #languages# any automatic
 * languages, and #hitPoints# the number of HP gained each level.
 */
Pathfinder2E.ancestryRules = function(
  rules, name, requires, hitPoints, features, heritages, traits, languages
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
  });
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
      let spellModifier = abilities[0] + 'Modifier';
      if(spellType != name)
        rules.defineRule
          ('casterLevels.' + spellType, 'casterLevels.' + name, '^=', null);
      rules.defineRule('spellAttackModifier.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellModifier, '=', null
      );
      rules.defineRule('spellDifficultyClass.' + spellType,
        'casterLevels.' + spellType, '?', null,
        spellModifier, '=', '8 + source'
      );
    }
  }

  rules.defineRule('featureNotes.' + prefix + 'Feats',
    classLevel, '=', 'Math.floor(source / 2)' + (features.includes('1:' + name + ' Feats') ? ' + 1' : '')
  );
  rules.defineRule
    ('featCount.Class', 'featureNotes.' + prefix + 'Feats', '+=', null);

  let classAbilityModifier = abilities[0];
  if(abilities.length > 1) {
    classAbilityModifier = 'bestAbilityModifier.' + name;
    rules.defineRule
      (classAbilityModifier, abilities[0] + 'Modifier', '=', null);
    for(let i = 1; i < abilities.length; i++)
      rules.defineRule
        (classAbilityModifier, abilities[i] + 'Modifier', '^=', null);
  }
  rules.defineRule('classDifficultyClass.' + name,
    'levels.' + name, '?', null,
    classAbilityModifier, '=', '10 + source',
    'rankBonus.' + name, '+', null
  );
  rules.defineRule('rankLevelBonus.' + name,
    'rank.' + name, '=', 'source>0 ? 0 : null',
    'levels.' + name, '+', null
  );
  rules.defineRule('rankBonus.' + name,
    'rank.' + name, '=', '2 * source',
    'rankLevelBonus.' + name, '+', null
  );

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Pathfinder2E.classRulesExtra = function(rules, name) {

  let classLevel = 'levels.' + name;

  if(name == 'Alchemist') {
    rules.defineRule
      ('skillNotes.alchemistSkills', 'intelligenceModifier', '=', '3 + source');
  } else if(name == 'Barbarian') {
    rules.defineRule
      ('selectableFeatureCount.Barbarian (Instinct)', classLevel, '=', '1');
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
      ('skillNotes.bardSkills', 'intelligenceModifier', '=', '4 + source');
  } else if(name == 'Champion') {
    rules.defineRule
      ('skillNotes.championSkills', 'intelligenceModifier', '=', '2 + source');
  } else if(name == 'Cleric') {
    rules.defineRule
      ('skillNotes.clericSkills', 'intelligenceModifier', '=', '2 + source');
  } else if(name == 'Druid') {
    rules.defineRule
      ('skillNotes.druidSkills', 'intelligenceModifier', '=', '2 + source');
  } else if(name == 'Fighter') {
    rules.defineRule('rank.Will', 'saveNotes.bravery', '^=', '2');
    rules.defineRule
      ('skillNotes.fighterSkills', 'intelligenceModifier', '=', '3 + source');
  } else if(name == 'Monk') {
    rules.defineRule
      ('skillNotes.monkSkills', 'intelligenceModifier', '=', '4 + source');
  } else if(name == 'Ranger') {
    rules.defineRule
      ('skillNotes.rangerSkills', 'intelligenceModifier', '=', '4 + source');
  } else if(name == 'Rogue') {
    rules.defineRule('featureNotes.rogueFeats', classLevel, '=', null);
    rules.defineRule('featureNotes.skillIncreases',
      classLevel, '^=', 'source>=2 ? Math.floor(source / 2) : null'
    );
    rules.defineRule
      ('skillNotes.rogueSkills', 'intelligenceModifier', '=', '7 + source');
  } else if(name == 'Sorcerer') {
    rules.defineRule
      ('skillNotes.sorcererSkills', 'intelligenceModifier', '=', '2 + source');
  } else if(name == 'Wizard') {
    rules.defineRule
      ('skillNotes.wizardSkills', 'intelligenceModifier', '=', '2 + source');
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
  let matchInfo;
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  if((matchInfo = name.match(/Additional Lore \((.*)\)/)) != null) {
    rules.defineRule('skillNotes.additionalLore(' + matchInfo[1] + ')',
      'level', '=', 'source<3 ? "Trained" : source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
    rules.defineRule('rank.' + matchInfo[1] + ' Lore',
      'skillNotes.' + prefix, '^=', 'source=="Trained" ? 1 : source=="Expert" ? 2 : source=="Master" ? 3 : 4'
    );
  } else if(name == 'Canny Acumen (Fortitude)') {
    rules.defineRule('saveNotes.cannyAcumen(Fortitude)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('rank.Fortitude',
      'saveNotes.cannyAcumen(Fortitude)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Perception)') {
    rules.defineRule('skillNotes.cannyAcumen(Perception)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('rank.Perception',
      'skillNotes.cannyAcumen(Perception)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Reflex)') {
    rules.defineRule('saveNotes.cannyAcumen(Reflex)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('rank.Reflex',
      'saveNotes.cannyAcumen(Fortitude)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Canny Acumen (Will)') {
    rules.defineRule('saveNotes.cannyAcumen(Will)',
      'level', '=', 'source<17 ? "Expert" : "Master"'
    );
    rules.defineRule('rank.Will',
      'saveNotes.cannyAcumen(Will)', '^=', 'source=="Expert" ? 2 : 3'
    );
  } else if(name == 'Multilingual') {
    rules.defineRule('skillNotes.multilingual',
      'rank.Society', '=', null,
      'feats.Multilingual', '*', null
    );
  } else if(name == 'Stonewalker') {
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
  for(let i = 0; i < sections.length; i++) {
    let note = notes[i];
    let section = sections[i];
    let noteName =
      section + 'Notes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
    let matchInfo =
      note.match(/([A-Z]\w*)\s(Expert|Master|Trained)\s*\((.*)\)$/i);
    if(matchInfo) {
      let rank =
        matchInfo[2] == 'Master' ? 3 : matchInfo[2] == 'Expert' ? 2 : 1;
      matchInfo[3].split(/;\s*/).forEach(element => {
        if(!element.match(/Choose/))
          rules.defineRule('rank.' + element, noteName, '^=', rank);
      });
    }
    matchInfo = note.match(/Perception\s(Expert|Master|Trained)$/i);
    if(matchInfo) {
      rules.defineRule('rank.Perception',
        noteName, '^=', matchInfo[1] == 'Master' ? 3 : matchInfo[1] == 'Expert' ? '2' : '1'
      );
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

/* Defines in #rules# the rules associated with lore #name#. */
Pathfinder2E.loreRules = function(rules, name) {
  if(!name) {
    console.log('Empty lore name');
    return;
  }
  // No rules pertain to lore
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
 * #ability# (one of 'strength', 'intelligence', etc.).
 */
Pathfinder2E.skillRules = function(rules, name, ability) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(typeof(ability) != 'string' || !(ability in Pathfinder2E.ABILITIES)) {
    console.log('Bad ability "' + ability + '" for skill ' + name);
    return;
  }

  ability = ability.toLowerCase();
  rules.defineChoice
    ('notes', 'skillModifiers.' + name + ':%S (' + ability + '; %1)');
  if(!name.match(/Lore$/))
    rules.defineRule('rank.' + name, '', '=', '0');
  else
    rules.defineRule('totalLoreRanks', 'rank.' + name, '+=', null);
  rules.defineRule
    ('rank.' + name, 'skillBoosts.' + name, '+=', null);
  rules.defineRule('rankLevelBonus.' + name,
    'rank.' + name, '=', 'source>0 ? 0 : null',
    'level', '+', null
  );
  rules.defineRule('rankBonus.' + name,
    'rank.' + name, '=', '2 * source',
    'rankLevelBonus.' + name, '+', null
  );
  rules.defineRule('skillModifiers.' + name,
    'rank.' + name, '?', 'source != null',
    ability + 'Modifier', '=', null,
    'rankBonus.' + name, '+', null,
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
  rules, name, school, casterGroup, level, description
) {
  SRD35.spellRules(rules, name, school, casterGroup, level, description);
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
  let matchInfo = (damage + '').match(/^\d(d\d+)?([BPS])$/);
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
  if(!(group+'').match(/^(Axe|Bow|Brawling|Club|Dart|Flail|Hammer|Knife|Pick|Polearm|Sling|Spear|Sword)$/)) {
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
  let isRanged = group.match(/Bow|Dart|Sling/);
  let isPropulsive = traits.includes('Propulsive');
  let isThrown = traits.includes('Thrown');

  damage = matchInfo[1];
  let damageType = matchInfo[2];
  traits.forEach(t => {
    if(t.match(/^Versatile [BPS]$/))
      damageType += '/' + t.charAt(t.length - 1);
  });

  let weaponName = 'weapons.' + name;
  let format = '%V (%1 %2%3 %4' + (range ? " R%5'" : '') + ')';

  rules.defineChoice('notes', weaponName + ':' + format);

  rules.defineRule('weaponProficiencyBonus.' + name,
    weaponName, '?', null,
    'rank.' + category + ' Weapons', '=', null,
    'rank.' + name, '^=', null,
    'level', '+', null
  );
  rules.defineRule('attackBonus.' + name,
    weaponName, '=', '0',
    isFinesse ? 'maxStrOrDexModifier' :
    isRanged ? 'combatNotes.dexterityAttackAdjustment' :
               'combatNotes.strengthAttackAdjustment', '+', null,
    'weaponProficiencyBonus.' + name, '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    'weaponDamageAdjustment.' + name, '+', null
  );
  if(!isRanged || isThrown)
    rules.defineRule('damageBonus.' + name, 'strengthModifier', '+', null);
  else if(isPropulsive)
    rules.defineRule('damageBonus.' + name,
      'strengthModifier', '+', 'source<0 ? source : Math.floor(source / 2)'
    );

  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'QuilvynUtils.signed(source)'
  );
  rules.defineRule(weaponName + '.2', weaponName, '=', '"' + damage + '"');
  rules.defineRule(weaponName + '.3',
    'damageBonus.' + name, '=', 'source == 0 ? "" : QuilvynUtils.signed(source)'
  );
  rules.defineRule
    (weaponName + '.4', weaponName, '=', '"' + damageType + '"');
  if(range) {
    rules.defineRule('range.' + name,
      weaponName, '=', range,
      'weaponRangeAdjustment.' + name, '+', null
    );
    rules.defineRule(weaponName + '.5', 'range.' + name, '=', null);
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
      feature.match(/([A-Z]\w*)\s(Expert|Master|Trained)\s*\((.*)\)$/i);
    if(matchInfo) {
      let rank =
        matchInfo[2] == 'Master' ? 3 : matchInfo[2] == 'Expert' ? 2 : 1;
      matchInfo[3].split(/;\s*/).forEach(element => {
        if(!element.match(/Choose/))
          rules.defineRule
            ('rank.' + element, setName + '.' + feature, '^=', rank);
      });
    }
    matchInfo = feature.match(/Perception\s(Expert|Master|Trained)$/i);
    if(matchInfo) {
      rules.defineRule('rank.Perception',
        setName + '.' + feature, '^=', matchInfo[1] == 'Master' ? 3 : matchInfo[1] == 'Expert' ? '2' : '1'
      );
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
        {name: 'Header', within: '_top'},
          {name: 'Identity', within: 'Header', separator: ''},
            {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
            {name: 'Gender', within: 'Identity', format: ' -- <b>%V</b>'},
            {name: 'Heritage', within: 'Identity', format: ' <b>%V</b>'},
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
      if(('rank.' + category + ' Armor') in attrs)
        choices.push(attr);
    }
    attributes.armor = choices[QuilvynUtils.random(0, choices.length - 1)];
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
        let anyChoices = Object.keys(Pathfinder2E.ABILITIES);
        matched.split(/\s*;\s*/).forEach(boost => {
          let m = boost.match(/Choose\s+(%V|\d+)\s+from\s+([\w,\s]*)/i);
          if(!m) {
            anyChoices = anyChoices.filter(x => x != boost);
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
  } else if(attribute == 'skills') {
    let boostsAllocated = {};
    for(attr in this.getChoices('skills'))
      boostsAllocated[attr] = attributes['skillBoosts.' + attr] || 0;
    attrs = this.applyRules(attributes);
    let notes = this.getChoices('notes');
    for(attr in attrs) {
      if((matchInfo = attr.match(/\wfeatures.Skill\s+(Expert|Master|Trained)\s+\([^\)]*\)/gi)))
        ; // empty
      else if(!notes[attr] ||
         (matchInfo = notes[attr].match(/Skill\s+(Expert|Master|Trained)\s+\([^\)]*\)/gi))==null)
        continue;
      matchInfo.forEach(matched => {
        matched.split(/\s*;\s*/).forEach(boost => {
          let m = boost.match(/Choose\s+(%V|\d+)\s+from\s+([\w,\s]*)/i);
          if(m) {
            howMany = m[1].startsWith('%') ? attrs[attr] : +m[1];
            choices = m[2].match(/^any$/i) ? Object.keys(this.getChoices('skills')) : m[2].split(/\s*,\s*/);
            choices.forEach(choice => {
              if(howMany > 0 && boostsAllocated[choice] > 0) {
                howMany--;
                boostsAllocated[choice]--;
              }
            });
            while(howMany > 0 && choices.length > 0) {
              let choice = randomElement(choices);
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
    // TODO The rules have no restrictions on shield use; give, e.g., Wizards
    // no shield?
    choices = Object.keys(this.getChoices('shields'));
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
      if(attrs['rank.' + category + ' Weapons'])
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
