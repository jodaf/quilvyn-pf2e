/*
Copyright 2025, James J. Hayes

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
 * subset of the Pathfinder2E rules. Similarly, the constant fields of
 * Pathfinder2E (BACKGROUNDS, FEATS, etc.) can be manipulated to modify the
 * choices.
 */
function Pathfinder2E() {

  let rules = new QuilvynRules('Pathfinder 2E (Legacy)', Pathfinder2E.VERSION);
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
    'selectableFeatures:Heritage,set,selectableHeritages',
    'background:Background,select-one,backgrounds',
    'class:Class,select-one,levels',
    'level:Level,text,3',
    'abilityGeneration:Ability Generation,select-one,abilgens'
  );

  Pathfinder2E.abilityRules(rules, Pathfinder2E.ABILITIES);
  Pathfinder2E.combatRules
    (rules, Pathfinder2E.ARMORS, Pathfinder2E.SHIELDS, Pathfinder2E.WEAPONS);
  Pathfinder2E.magicRules(rules, Pathfinder2E.SPELLS);
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

Pathfinder2E.VERSION = '2.4.1.0';

Pathfinder2E.ACTION_MARKS = {
  0: '',
  1: '<b>(1)</b>',
  2: '<b>(2)</b>',
  3: '<b>(3)</b>',
  Free: '<b>(F)</b>',
  Reaction: '<b>(R)</b>' // '<b>&larrhk;</b> '
};
Pathfinder2E.RANK_NAMES =
  ['untrained', 'trained', 'expert', 'master', 'legendary'];

/* List of choices that can be expanded by house rules. */
// Note: Left Goody out of this list for now because inclusion would require
// documenting how to construct regular expressions.
Pathfinder2E.CHOICES = [
  'Ancestry', 'Ancestry Feature', 'Armor', 'Background', 'Background Feature',
  'Class', 'Class Feature', 'Deity', 'Feat', 'Feature', 'Language', 'Shield',
  'Skill', 'Spell', 'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
Pathfinder2E.RANDOMIZABLE_ATTRIBUTES = [
  'abilities',
  'strength', 'constitution', 'dexterity', 'intelligence', 'wisdom', 'charisma',
  'gender', 'name', 'alignment', 'background', 'deity', 'boosts', 'experience',
  'selectableFeatures', 'feats', 'skills', 'languages', 'armor', 'weapons',
  'shield', 'spells'
];
Pathfinder2E.VIEWERS = ['Collected Notes', 'Compact', 'Standard', 'Stat Block'];

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
    'Speed=20 ' +
    'Features=' +
      '"1:Ability Boost (Constitution; Wisdom; Choose 1 from any)",' +
      '"1:Ability Flaw (Charisma)",' +
      '1:Darkvision,"1:Clan Dagger","1:Ancestry Feats","1:Dwarf Heritage" ' +
    'Selectables=' +
      '"1:Ancient-Blooded Dwarf:Heritage",' +
      '"1:Death Warden Dwarf:Heritage",' +
      '"1:Forge Dwarf:Heritage",' +
      '"1:Rock Dwarf:Heritage",' +
      '"1:Strong-Blooded Dwarf:Heritage" ' +
    'Languages=Common,Dwarven ' +
    'Traits=Dwarf,Humanoid',
  'Elf':
    'HitPoints=6 ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Ability Boost (Dexterity; Intelligence; Choose 1 from any)",' +
      '"1:Ability Flaw (Constitution)",' +
      '"1:Low-Light Vision","1:Ancestry Feats","1:Elf Heritage" ' +
    'Selectables=' +
      '"1:Arctic Elf:Heritage",' +
      '"1:Cavern Elf:Heritage",' +
      '"1:Seer Elf:Heritage",' +
      '"1:Whisper Elf:Heritage",' +
      '"1:Woodland Elf:Heritage" ' +
    'Languages=Common,Elven ' +
    'Traits=Elf,Humanoid',
  'Gnome':
    'HitPoints=8 ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Ability Boost (Charisma; Constitution; Choose 1 from any)",' +
      '"1:Ability Flaw (Strength)",' +
      '"1:Low-Light Vision",1:Small,"1:Ancestry Feats","1:Gnome Heritage" ' +
    'Selectables=' +
      '"1:Chameleon Gnome:Heritage",' +
      '"1:Fey-Touched Gnome:Heritage",' +
      '"1:Sensate Gnome:Heritage",' +
      '"1:Umbral Gnome:Heritage",' +
      '"1:Wellspring Gnome:Heritage",' +
      '"1:Arcane Wellspring:Wellspring",' +
      '"1:Divine Wellspring:Wellspring",' +
      '"1:Occult Wellspring:Wellspring" ' +
    'Languages=Common,Gnomish,Sylvan ' +
    'Traits=Gnome,Humanoid',
  'Goblin':
    'HitPoints=6 ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Ability Boost (Charisma; Dexterity; Choose 1 from any)",' +
      '"1:Ability Flaw (Wisdom)",' +
      '1:Darkvision,1:Small,"1:Ancestry Feats","1:Goblin Heritage" ' +
    'Selectables=' +
      '"1:Charhide Goblin:Heritage",' +
      '"1:Irongut Goblin:Heritage",' +
      '"1:Razortooth Goblin:Heritage",' +
      '"1:Snow Goblin:Heritage",' +
      '"1:Unbreakable Goblin:Heritage" ' +
    'Languages=Common,Goblin ' +
    'Traits=Goblin,Humanoid',
  'Halfling':
    'HitPoints=6 ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Ability Boost (Dexterity; Wisdom; Choose 1 from any)",' +
      '"1:Ability Flaw (Strength)",' +
      '"1:Keen Eyes",1:Small,"1:Ancestry Feats","1:Halfling Heritage" ' +
    'Selectables=' +
      '"1:Gutsy Halfling:Heritage",' +
      '"1:Hillock Halfling:Heritage",' +
      '"1:Nomadic Halfling:Heritage",' +
      '"1:Twilight Halfling:Heritage",' +
      '"1:Wildwood Halfling:Heritage" ' +
    'Languages=Common,Halfling ' +
    'Traits=Humanoid,Halfling',
  'Human':
    'HitPoints=8 ' +
    'Speed=25 ' +
    'Features=' +
      '"1:Ability Boost (Choose 2 from any)",' +
      '"1:Ancestry Feats","1:Human Heritage" ' +
    'Selectables=' +
      '"1:Half-Elf:Heritage",' +
      '"1:Half-Orc:Heritage",' +
      '"1:Skilled Heritage Human:Heritage",' +
      '"1:Versatile Heritage Human:Heritage" ' +
    // Errata gives humans an additional language
    'Languages=Common,any ' +
    'Traits=Humanoid,Human'
};
Pathfinder2E.ARMORS = {
  'None':'Category=Unarmored Price=0 AC=0 Check=0 Speed=0 Bulk=0',
  "Explorer's Clothing":
    'Category=Unarmored Price=0.1 AC=0 Dex=5 Check=0 Speed=0 Bulk=L ' +
    'Group=Cloth Traits=Comfort',
  'Padded':
    'Category=Light Price=0.2 AC=1 Dex=3 Check=0 Str=10 Speed=0 Bulk=L ' +
    'Group=Cloth Traits=Comfort',
  'Leather':
    'Category=Light Price=2 AC=1 Dex=4 Check=-1 Str=10 Speed=0 Bulk=1 ' +
    'Group=Leather',
  'Studded Leather':
    'Category=Light Price=3 AC=2 Dex=3 Check=-1 Str=12 Speed=0 Bulk=1 ' +
    'Group=Leather',
  'Chain Shirt':
    'Category=Light Price=5 AC=2 Dex=3 Check=-1 Str=12 Speed=0 Bulk=1 ' +
    'Group=Chain Traits=Flexible,Noisy',
  'Hide':
    'Category=Medium Price=2 AC=3 Dex=2 Check=-2 Speed=-5 Str=14 Bulk=2 ' +
    'Group=Leather',
  'Scale Mail':
    'Category=Medium Price=4 AC=3 Dex=2 Check=-2 Speed=-5 Str=14 Bulk=2 ' +
    'Group=Composite',
  'Chain Mail':
    'Category=Medium Price=6 AC=4 Dex=1 Check=-2 Speed=-5 Str=16 Bulk=2 ' +
    'Group=Chain Traits=Flexible,Noisy',
  'Breastplate':
    'Category=Medium Price=8 AC=4 Dex=1 Check=-2 Speed=-5 Str=16 Bulk=2 ' +
    'Group=Plate',
  'Splint Mail':
    'Category=Heavy Price=13 AC=5 Dex=1 Check=-3 Speed=-10 Str=16 Bulk=3 ' +
    'Group=Composite',
  'Half Plate':
    'Category=Heavy Price=18 AC=5 Dex=1 Check=-3 Speed=-10 Str=16 Bulk=3 ' +
    'Group=Plate',
  'Full Plate':
    'Category=Heavy Price=30 AC=6 Dex=0 Check=-3 Speed=-10 Str=18 Bulk=4 ' +
    'Group=Plate Traits=Bulwark'
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
      '"1:Skill Trained (Nature; Choose 1 from any Terrain Lore)",' +
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
      '"1:Skill Trained (Society; Choose 1 from any Settlement Lore)",' +
      '1:Multilingual',
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
      // Errata corrects Battle Medic to Battle Medicine
      '"1:Skill Trained (Medicine; Warfare Lore)","1:Battle Medicine"',
  'Fortune Teller':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
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
      '"1:Skill Trained (Intimidation; Choose 1 from Legal Lore, Warfare Lore)",' +
      '"1:Quick Coercion"',
  'Herbalist':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Nature; Herbalism Lore)","1:Natural Medicine"',
  'Hermit':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Choose 1 from Nature, Occultism; Choose 1 from any Terrain Lore)",' +
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
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Diplomacy; Mercantile Lore)","1:Bargain Hunter"',
  'Miner':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Strength, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Mining Lore)",' +
      '"1:Terrain Expertise (Underground)"',
  'Noble':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Choose 1 from Genealogy Lore, Heraldry Lore)",' +
      '"1:Courtly Graces"',
  'Nomad':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Choose 1 from any Terrain Lore)",' +
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
      '"1:Ability Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Choose 1 from any Terrain Lore)",1:Forager',
  'Street Urchin':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Thievery; Choose 1 from any Settlement Lore)",' +
      '1:Pickpocket',
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
      // Errata extended to Medium Armor Trained/Expertise/Mastery and changed
      // Perpetual Potency/Perfection from moderate/greater to 3rd/11th level
      '"1:Ability Boosts","1:Ability Boost (Intelligence)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Alchemist Skills",' +
      '"1:Attack Trained (Simple Weapons; Alchemical Bombs; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Class Trained (Alchemist)",' +
      '"1:Alchemy","1:Infused Reagents","1:Advanced Alchemy",' +
      '"1:Quick Alchemy","1:Formula Book","1:Research Field",' +
      '"1:Mutagenic Flashback","1:Alchemist Feats","2:Skill Feats",' +
      '"3:General Feats","3:Skill Increases","5:Field Discovery",' +
      // Errata adds 5:Powerful Alchemy
      '"5:Powerful Alchemy","7:Alchemical Weapon Expertise","7:Iron Will",' +
      '"7:Perpetual Infusions","9:Alchemical Expertise","9:Alertness",' +
      '"9:Double Brew","11:Juggernaut","11:Perpetual Potency",' +
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
      '"features.Animal Instinct (Ape) ? 1:Bestial Rage (Ape)",' +
      '"features.Animal Instinct (Bear) ? 1:Bestial Rage (Bear)",' +
      '"features.Animal Instinct (Bull) ? 1:Bestial Rage (Bull)",' +
      '"features.Animal Instinct (Cat) ? 1:Bestial Rage (Cat)",' +
      '"features.Animal Instinct (Deer) ? 1:Bestial Rage (Deer)",' +
      '"features.Animal Instinct (Frog) ? 1:Bestial Rage (Frog)",' +
      '"features.Animal Instinct (Shark) ? 1:Bestial Rage (Shark)",' +
      '"features.Animal Instinct (Snake) ? 1:Bestial Rage (Snake)",' +
      '"features.Animal Instinct (Wolf) ? 1:Bestial Rage (Wolf)",' +
      '"features.Dragon Instinct ? 1:Draconic Rage",' +
      '"features.Giant Instinct ? 1:Titan Mauler",' +
      '"features.Spirit Instinct ? 1:Spirit Rage",' +
      '"2:Skill Feats","3:Deny Advantage","3:General Feats",' +
      '"3:Skill Increases","5:Brutality","7:Juggernaut",' +
      '"7:Specialization Ability","7:Weapon Specialization",' +
      '"9:Lightning Reflexes",' +
      '"features.Animal Instinct ? 9:Raging Resistance (Animal)",' +
      '"features.Dragon Instinct ? 9:Raging Resistance (Dragon)",' +
      '"features.Fury Instinct ? 9:Raging Resistance (Fury)",' +
      '"features.Giant Instinct ? 9:Raging Resistance (Giant)",' +
      '"features.Spirit Instinct ? 9:Raging Resistance (Spirit)",' +
      '"11:Mighty Rage",' +
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
      '"1:Enigma:Muse",' +
      '"1:Maestro:Muse",' +
      '"1:Polymath:Muse" ' +
    'SpellSlots=' +
      'OC1:5@1,' +
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
      '"9:Juggernaut","9:Lightning Reflexes","11:Alertness","11:Divine Will",' +
      '"features.Liberator ? 11:Exalt (Liberator)",' +
      '"features.Paladin ? 11:Exalt (Paladin)",' +
      '"features.Redeemer ? 11:Exalt (Redeemer)",' +
      '"13:Armor Mastery","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","17:Champion Mastery",' +
      '"17:Legendary Armor","19:Hero\'s Defiance" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability",' +
      '"1:Strength:Key Ability",' +
      '"1:The Tenets Of Good:Champion\'s Code",' +
      '"1:Blade Ally:Divine Ally",' +
      '"1:Shield Ally:Divine Ally",' +
      '"1:Steed Ally:Divine Ally",' +
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
      '"1:Deity","1:Divine Spellcasting","1:Divine Font","1:Doctrine",' +
      '"2:Cleric Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases","5:Alertness","9:Resolve","11:Lightning Reflexes",' +
      '"13:Divine Defense","13:Weapon Specialization","19:Miraculous Spell" ' +
    'Selectables=' +
      '"1:Healing Font:Divine Font",' +
      '"1:Harmful Font:Divine Font",' +
      '"1:Cloistered Cleric:Doctrine",' +
      '"1:Warpriest:Doctrine" ' +
    'SpellSlots=' +
      'DC1:5@1,' +
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
      // Errata removes Class Trained
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
      '"1:Animal:Order",' +
      '"1:Leaf:Order",' +
      '"1:Storm:Order",' +
      '"1:Wild:Order" ' +
    'SpellSlots=' +
      // Errata corrects cantrip count
      'PC1:5@1,' +
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
      '"2:Skill Feats","3:Bravery","3:General Feats","3:Skill Increases",' +
      '"5:Fighter Weapon Mastery","7:Battlefield Surveyor",' +
      '"7:Weapon Specialization","9:Combat Flexibility","9:Juggernaut",' +
      '"11:Armor Expertise","11:Fighter Expertise","13:Weapon Legend",' +
      '"15:Evasion","15:Greater Weapon Specialization",' +
      '"15:Improved Flexibility","17:Armor Mastery","19:Versatile Legend" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability",' +
      '"1:Strength:Key Ability",' +
      '"1:Axes:Weapon Group",' +
      '"1:Bombs:Weapon Group",' +
      '"1:Brawling Weapons:Weapon Group",' +
      '"1:Clubs:Weapon Group",' +
      '"1:Crossbows:Weapon Group",' +
      '"1:Darts:Weapon Group",' +
      '"1:Flails:Weapon Group",' +
      '"1:Hammers:Weapon Group",' +
      '"1:Knives:Weapon Group",' +
      '"1:Picks:Weapon Group",' +
      '"1:Polearms:Weapon Group",' +
      '"1:Slings:Weapon Group",' +
      '"1:Shields:Weapon Group",' +
      '"1:Spears:Weapon Group",' +
      '"1:Swords:Weapon Group"',
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
      '"1:Dexterity:Key Ability",' +
      '"1:Strength:Key Ability",' +
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
      // Errata changes Weapon Expertise to Ranger Weapon Expertise
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
      '"9:Ranger Expertise","11:Juggernaut","11:Medium Armor Expertise",' +
      '"11:Wild Stride","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","15:Improved Evasion",' +
      '"15:Incredible Senses","17:Masterful Hunter","19:Second Skin",' +
      '"19:Swift Prey" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability",' +
      '"1:Strength:Key Ability",' +
      '"1:Flurry:Hunter\'s Edge",' +
      '"1:Precision:Hunter\'s Edge",' +
      '"1:Outwit:Hunter\'s Edge"',
  'Rogue':
    'Ability=strength,constitution,dexterity,intelligence,wisdom,charisma ' +
    'HitPoints=8 ' +
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
      '"3:Deny Advantage","3:General Feats","5:Weapon Tricks","7:Evasion",' +
      '"7:Vigilant Senses","7:Weapon Specialization","9:Debilitating Strike",' +
      '"9:Great Fortitude","11:Rogue Expertise","13:Improved Evasion",' +
      '"13:Incredible Senses","13:Light Armor Expertise","13:Master Tricks",' +
      '"15:Double Debilitation","15:Greater Weapon Specialization",' +
      '"17:Slippery Mind","19:Light Armor Mastery","19:Master Strike" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability",' +
      '"features.Ruffian ? 1:Strength:Key Ability",' +
      '"features.Scoundrel ? 1:Charisma:Key Ability",' +
      '"1:Ruffian:Racket",' +
      '"1:Scoundrel:Racket",' +
      '"1:Thief:Racket"',
  'Sorcerer':
    'Ability=charisma HitPoints=6 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Sorcerer Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Bloodline","1:Bloodline Spells","1:Sorcerer Spellcasting",' +
      '"2:Skill Feats","2:Sorcerer Feats","3:General Feats",' +
      '"3:Signature Spells","3:Skill Increases","5:Magical Fortitude",' +
      '"7:Expert Spellcaster","9:Lightning Reflexes","11:Alertness",' +
      '"11:Weapon Expertise","13:Defensive Robes","13:Weapon Specialization",' +
      // Errata adds 17:Resolve
      '"15:Master Spellcaster","17:Resolve","19:Bloodline Paragon",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '"1:Aberrant:Bloodline",' +
      '"1:Angelic:Bloodline",' +
      '"1:Demonic:Bloodline",' +
      '"1:Diabolic:Bloodline",' +
      '"1:Draconic (Brass):Bloodline",' +
      '"1:Draconic (Bronze):Bloodline",' +
      '"1:Draconic (Copper):Bloodline",' +
      '"1:Draconic (Gold):Bloodline",' +
      '"1:Draconic (Silver):Bloodline",' +
      '"1:Draconic (Black):Bloodline",' +
      '"1:Draconic (Blue):Bloodline",' +
      '"1:Draconic (Green):Bloodline",' +
      '"1:Draconic (Red):Bloodline",' +
      '"1:Draconic (White):Bloodline",' +
      '"1:Elemental (Air):Bloodline",' +
      '"1:Elemental (Earth):Bloodline",' +
      '"1:Elemental (Fire):Bloodline",' +
      '"1:Elemental (Water):Bloodline",' +
      '"1:Fey:Bloodline",' +
      '"1:Hag:Bloodline",' +
      '"1:Imperial:Bloodline",' +
      '"1:Undead:Bloodline" ' +
    // SpellSlots tradition depends on bloodline--see classRules
    'SpellSlots=' +
      '0:5@1,' +
      '1:3@1;4@2,' +
      '2:3@3;4@4,' +
      '3:3@5;4@6,' +
      '4:3@7;4@8,' +
      '5:3@9;4@10,' +
      '6:3@11;4@12,' +
      '7:3@13;4@14,' +
      '8:3@15;4@16,' +
      '9:3@17;4@18,' +
      '10:1@19',
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
      // Errata corrects 1:Wizard Feats to 2:Wizard Feats
      '"1:Arcane Thesis","2:Skill Feats","2:Wizard Feats","3:General Feats",' +
      '"3:Skill Increases","5:Lightning Reflexes","7:Expert Spellcaster",' +
      '"9:Magical Fortitude","11:Alertness","11:Wizard Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Resolve","19:Archwizard\'s Spellcraft",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '"1:Abjuration:Arcane School",' +
      '"1:Conjuration:Arcane School",' +
      '"1:Divination:Arcane School",' +
      '"1:Enchantment:Arcane School",' +
      '"1:Evocation:Arcane School",' +
      '"1:Illusion:Arcane School",' +
      '"1:Necromancy:Arcane School",' +
      '"1:Transmutation:Arcane School",' +
      '"1:Universalist:Arcane School",' +
      '"1:Improved Familiar Attunement:Thesis",' +
      '"1:Metamagical Experimentation:Thesis",' +
      '"1:Spell Blending:Thesis",' +
      '"1:Spell Substitution:Thesis" ' +
    'SpellSlots=' +
      'AC1:5@1,' +
      'A1:2@1;3@2,' +
      'A2:2@3;3@4,' +
      'A3:2@5;3@6,' +
      'A4:2@7;3@8,' +
      'A5:2@9;3@10,' +
      'A6:2@11;3@12,' +
      'A7:2@13;3@14,' +
      'A8:2@15;3@16,' +
      'A9:2@17;3@18,' +
      'A10:1@19'
};
Pathfinder2E.DEITIES = {
  'None':'',
  'Abadar':
    'Alignment=LN FollowerAlignments=LG,LN,LE ' +
    'Font=Either Skill=Society Weapon=Crossbow ' +
    'Domain=Cities,Earth,Travel,Wealth ' +
    'Spells="1:Illusory Object","4:Creation","7:Magnificent Mansion"',
  'Asmodeus':
    'Alignment=LE FollowerAlignments=LE ' +
    'Font=Harm Skill=Deception Weapon=Mace ' +
    'Domain=Confidence,Fire,Trickery,Tyranny ' +
    'Spells="1:Charm","4:Suggestion","6:Mislead"',
  'Calistra':
    'Alignment=CN FollowerAlignments=CG,CN,CE ' +
    'Font=Either Skill=Deception Weapon=Whip ' +
    'Domain=Pain,Passion,Secrecy,Trickery ' +
    'Spells="1:Charm","3:Enthrall","6:Mislead"',
  'Cayden Cailean':
    'Alignment=CG FollowerAlignments=NG,CG,CN ' +
    'Font=Heal Skill=Athletics Weapon=Rapier ' +
    'Domain=Cities,Freedom,Indulgence,Might ' +
    'Spells="1:Fleet Step","2:Touch Of Idiocy","5:Hallucination"',
  'Desna':
    'Alignment=CG FollowerAlignments=NG,CG,CN ' +
    'Font=Heal Skill=Acrobatics Weapon=Starknife ' +
    'Domain=Dreams,Luck,Moon,Travel ' +
    'Spells="1:Sleep","3:Dream Message","6:Dreaming Potential"',
  'Erastil':
    'Alignment=LG FollowerAlignments=LG,NG,LN ' +
    'Font=Heal Skill=Survival Weapon=Longbow ' +
    'Domain=Earth,Family,Nature,Wealth ' +
    'Spells="1:True Strike","3:Wall Of Thorns","5:Tree Stride"',
  'Gorum':
    'Alignment=CN FollowerAlignments=CN,CE ' +
    'Font=Either Skill=Athletics Weapon=Greatsword ' +
    'Domain=Confidence,Destruction,Might,Zeal ' +
    'Spells="1:True Strike","2:Enlarge","4:Weapon Storm"',
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
    'Font=Either Skill=Athletics Weapon=Fist ' +
    'Domain=Knowledge,Might,Perfection,Truth ' +
    'Spells="1:Jump","3:Haste","4:Stoneskin"',
  'Lamashtu':
    'Alignment=CE FollowerAlignments=CE ' +
    'Font=Either Skill=Survival Weapon=Falchion ' +
    'Domain=Family,Might,Nightmares,Trickery ' +
    'Spells="1:Magic Fang","2:Animal Form","4:Nightmare"',
  'Nethys':
    'Alignment=N FollowerAlignments=NG,LN,N,CN,NE ' +
    'Font=Either Skill=Arcana Weapon=Staff ' +
    'Domain=Destruction,Knowledge,Magic,Protection ' +
    'Spells=' +
      '"1:Magic Missile","2:Magic Mouth","3:Levitate","4:Blink",' +
      '"5:Prying Eye","6:Wall Of Force","7:Warp Mind","8:Maze","9:Destruction"',
  'Norgorber':
    'Alignment=NE FollowerAlignments=LE,NE,CE ' +
    'Font=Harm Skill=Stealth Weapon=Shortsword ' +
    'Domain=Death,Secrecy,Trickery,Wealth ' +
    'Spells="1:Illusory Disguise","2:Invisibility","4:Phantasmal Killer"',
  'Pharasma':
    'Alignment=N FollowerAlignments=NG,LN,N ' +
    'Font=Heal Skill=Medicine Weapon=Dagger ' +
    'Domain=Death,Fate,Healing,Knowledge ' +
    'Spells="1:Mindlink","3:Ghostly Weapon","4:Phantasmal Killer"',
  'Rovagug':
    'Alignment=CE FollowerAlignments=NE,CE ' +
    'Font=Harm Skill=Athletics Weapon=Greataxe ' +
    'Domain=Air,Destruction,Earth,Zeal ' +
    'Spells="1:Burning Hands","2:Enlarge","6:Disintegrate"',
  'Sarenrae':
    'Alignment=NG FollowerAlignments=LG,NG,CG ' +
    'Font=Heal Skill=Medicine Weapon=Scimitar ' +
    'Domain=Fire,Healing,Sun,Truth ' +
    'Spells="1:Burning Hands","3:Fireball","4:Wall Of Fire"',
  'Shelyn':
    'Alignment=NG FollowerAlignments=LG,NG,CG ' +
    'Font=Heal Skill=Crafting,Performance Weapon=Glaive ' +
    'Domain=Creation,Family,Passion,Protection ' +
    'Spells="1:Color Spray","3:Enthrall","4:Creation"',
  'Torag':
    'Alignment=LG FollowerAlignments=LG,LN ' +
    'Font=Heal Skill=Crafting Weapon=Warhammer ' +
    'Domain=Creation,Earth,Family,Protection ' +
    'Spells="1:Mindlink","3:Earthbind","4:Creation"',
  'Urgathoa':
    'Alignment=NE FollowerAlignments=LE,NE,CE ' +
    'Font=Harm Skill=Intimidation Weapon=Scythe ' +
    'Domain=Indulgence,Magic,Might,Undeath ' +
    'Spells="1:Goblin Pox","2:False Life","7:Mask Of Terror"',
  'Zon-Kuthon':
    'Alignment=LE FollowerAlignments=LN,LE,NE ' +
    'Font=Harm Skill=Intimidation Weapon="Spiked Chain" ' +
    'Domain=Ambition,Darkness,Destruction,Pain ' +
    'Spells="1:Phantom Pain","3:Wall Of Thorns","5:Shadow Walk"'
};
Pathfinder2E.FEATS = {

  // Ancestries

  // Dwarf
  'Dwarven Lore':'Traits=Dwarf',
  'Dwarven Weapon Familiarity':'Traits=Dwarf',
  'Rock Runner':'Traits=Dwarf',
  'Stonecunning':'Traits=Dwarf',
  'Unburdened Iron':'Traits=Dwarf',
  'Vengeful Hatred':'Traits=Dwarf',
  'Boulder Roll':'Traits=Dwarf Require="level >= 5","features.Rock Runner"',
  'Dwarven Weapon Cunning':
    'Traits=Dwarf Require="level >= 5","features.Dwarven Weapon Familiarity"',
  "Mountain's Stoutness":'Traits=Dwarf Require="level >= 9"',
  'Stonewalker':'Traits=Dwarf Require="level >= 9"',
  'Dwarven Weapon Expertise':
    'Traits=Dwarf Require="level >= 13","features.Dwarven Weapon Familiarity"',

  // Elf
  'Ancestral Longevity':'Traits=Elf',
  'Elven Lore':'Traits=Elf',
  'Elven Weapon Familiarity':'Traits=Elf',
  'Forlorn':'Traits=Elf',
  'Nimble Elf':'Traits=Elf',
  'Otherworldly Magic':'Traits=Elf',
  'Unwavering Mien':'Traits=Elf',
  'Ageless Patience':'Traits=Elf Require="level >= 5"',
  'Elven Weapon Elegance':
    'Traits=Elf Require="level >= 5","features.Elven Weapon Familiarity"',
  'Elf Step':'Traits=Elf Require="level >= 9"',
  'Expert Longevity':
    'Traits=Elf Require="level >= 9","features.Ancestral Longevity"',
  // Errata changes Expert Longevity to Ancestral Longevity
  'Universal Longevity':
    'Traits=Elf Require="level >= 13","features.Ancestral Longevity"',
  'Elven Weapon Expertise':
    'Traits=Elf Require="level >= 13","features.Elven Weapon Familiarity"',

  // Gnome
  'Animal Accomplice':'Traits=Gnome',
  'Burrow Elocutionist':'Traits=Gnome',
  'Fey Fellowship':'Traits=Gnome',
  'First World Magic':'Traits=Gnome',
  'Gnome Obsession':'Traits=Gnome',
  'Gnome Weapon Familiarity':'Traits=Gnome',
  'Illusion Sense':'Traits=Gnome',
  'Animal Elocutionist':
    'Traits=Gnome Require="level >= 5","features.Burrow Elocutionist"',
  // TODO requires "at least one innate spell from a gnome heritage or ancestry feat that shares a tradition with at least one of your focus spells"
  'Energized Font':'Traits=Gnome Require="level >= 5","features.Focus Pool"',
  'Gnome Weapon Innovator':
    'Traits=Gnome Require="level >= 5","features.Gnome Weapon Familiarity"',
  'First World Adept':
    'Traits=Gnome Require="level >= 9","rank.Primal Innate >= 1"',
  'Vivacious Conduit':'Traits=Gnome Require="level >= 9"',
  'Gnome Weapon Expertise':
    'Traits=Gnome Require="level >= 13","features.Gnome Weapon Familiarity"',

  // Goblin
  'Burn It!':'Traits=Goblin',
  'City Scavenger':'Traits=Goblin',
  'Goblin Lore':'Traits=Goblin',
  'Goblin Scuttle':'Traits=Goblin',
  'Goblin Song':'Traits=Goblin',
  'Goblin Weapon Familiarity':'Traits=Goblin',
  'Junk Tinker':'Traits=Goblin',
  'Rough Rider':'Traits=Goblin',
  'Very Sneaky':'Traits=Goblin',
  'Goblin Weapon Frenzy':
    'Traits=Goblin Require="level >= 5","features.Goblin Weapon Familiarity"',
  'Cave Climber':'Traits=Goblin Require="level >= 9"',
  'Skittering Scuttle':
    'Traits=Goblin Require="level >= 9","features.Goblin Scuttle"',
  'Goblin Weapon Expertise':
    'Traits=Goblin Require="level >= 13","features.Goblin Weapon Familiarity"',
  'Very, Very Sneaky':
    'Traits=Goblin Require="level >= 13","features.Very Sneaky"',

  // Halfling
  'Distracting Shadows':'Traits=Halfling',
  'Halfling Lore':'Traits=Halfling',
  'Halfling Luck':'Traits=Halfling,Fortune',
  'Halfling Weapon Familiarity':'Traits=Halfling',
  'Sure Feet':'Traits=Halfling',
  'Titan Slinger':'Traits=Halfling',
  'Unfettered Halfling':'Traits=Halfling',
  'Watchful Halfling':'Traits=Halfling',
  // TODO Remove Halfling from the list
  'Cultural Adaptability (%ancestry)':'Traits=Halfling Require="level >= 5"',
  'Halfling Weapon Trickster':
    'Traits=Halfling ' +
    'Require="level >= 5","features.Halfling Weapon Familiarity"',
  'Guiding Luck':
    'Traits=Halfling Require="level >= 9","features.Halfling Luck"',
  'Irrepressible':'Traits=Halfling Require="level >= 9"',
  'Ceaseless Shadows':
    'Traits=Halfling Require="level >= 13","features.Distracting Shadows"',
  'Halfling Weapon Expertise':
    'Traits=Halfling ' +
    'Require="level >= 13","features.Halfling Weapon Familiarity"',

  // Human
  'Adapted Cantrip':'Traits=Human Require="features.Spellcasting"',
  'Cooperative Nature':'Traits=Human',
  'General Training':'Traits=Human',
  'Haughty Obstinacy':'Traits=Human',
  'Natural Ambition':'Traits=Human',
  'Natural Skill':'Traits=Human',
  'Unconventional Weaponry (%weapon)':'Traits=Human',
  'Adaptive Adept':
    'Traits=Human ' +
    'Require=' +
      '"level >= 5",' +
      '"features.Adapted Cantrip",' +
      '"maxSpellLevel >= 3"',
  'Clever Improviser':'Traits=Human Require="level >= 5"',
  'Cooperative Soul':
    'Traits=Human Require="level >= 9","features.Cooperative Nature"',
  'Incredible Improvisation':
    'Traits=Human Require="level >= 9","features.Clever Improviser"',
  'Multitalented':'Traits=Human Require="level >= 9"',
  'Unconventional Expertise':
    'Traits=Human Require="level >= 13","features.Unconventional Weaponry"',
  'Elf Atavism':'Traits=Half-Elf',
  'Inspire Imitation':'Traits=Half-Elf Require="level >= 5"',
  'Supernatural Charm':'Traits=Half-Elf Require="level >= 5"',
  'Monstrous Peacemaker':'Traits=Half-Orc',
  'Orc Ferocity':'Traits=Orc',
  'Orc Sight':'Traits=Half-Orc Require="features.Low-Light Vision"',
  'Orc Superstition':'Traits=Orc,Concentrate',
  'Orc Weapon Familiarity':'Traits=Orc',
  'Orc Weapon Carnage':
    'Traits=Orc Require="level >= 5","features.Orc Weapon Familiarity"',
  'Victorious Vigor':'Traits=Orc Require="level >= 5"',
  'Pervasive Superstition':
    'Traits=Orc Require="level >= 9","features.Orc Superstition"',
  'Incredible Ferocity':
    'Traits=Orc Require="level >= 13","features.Orc Ferocity"',
  'Orc Weapon Expertise':
    'Traits=Orc Require="level >= 13","features.Orc Weapon Familiarity"',

  // Class

  // Alchemist
  'Alchemical Familiar':'Traits=Alchemist',
  'Alchemical Savant':'Traits=Alchemist Require="rank.Crafting >= 1"',
  'Far Lobber':'Traits=Alchemist',
  'Quick Bomber':'Traits=Alchemist',
  'Poison Resistance':'Traits=Alchemist,Druid Require="level >= 2"',
  'Revivifying Mutagen':'Traits=Alchemist Require="level >= 2"',
  'Smoke Bomb':'Traits=Alchemist,"Additive 1" Require="level >= 2"',
  'Calculated Splash':'Traits=Alchemist Require="level >= 4"',
  'Efficient Alchemy':'Traits=Alchemist Require="level >= 4"',
  'Enduring Alchemy':'Traits=Alchemist Require="level >= 4"',
  'Combine Elixirs':'Traits=Alchemist,"Additive 2" Require="level >= 6"',
  'Debilitating Bomb':'Traits=Alchemist,"Additive 2" Require="level >= 6"',
  'Directional Bombs':'Traits=Alchemist Require="level >= 6"',
  'Feral Mutagen':'Traits=Alchemist Require="level >= 8"',
  // Errata makes Powerful Alchemy a 5th-level class feature
  'Sticky Bomb':'Traits=Alchemist,"Additive 2" Require="level >= 8"',
  'Elastic Mutagen':'Traits=Alchemist Require="level >= 10"',
  'Expanded Splash':
    'Traits=Alchemist Require="level >= 10","features.Calculated Splash"',
  'Greater Debilitating Bomb':
    'Traits=Alchemist Require="level >= 10","features.Debilitating Bomb"',
  'Merciful Elixir':'Traits=Alchemist,"Additive 2" Require="level >= 10"',
  'Potent Poisoner':
    'Traits=Alchemist Require="level >= 10","features.Powerful Alchemy"',
  'Extend Elixir':'Traits=Alchemist Require="level >= 12"',
  'Invincible Mutagen':'Traits=Alchemist Require="level >= 12"',
  'Uncanny Bombs':
    'Traits=Alchemist Require="level >= 12","features.Far Lobber"',
  'Glib Mutagen':'Traits=Alchemist Require="level >= 14"',
  'Greater Merciful Elixir':
    'Traits=Alchemist Require="level >= 14","features.Merciful Elixir"',
  'True Debilitating Bomb':
    'Traits=Alchemist ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Greater Debilitating Bomb"',
  'Eternal Elixir':
    'Traits=Alchemist Require="level >= 16","features.Extend Elixir"',
  'Exploitive Bomb':'Traits=Alchemist,"Additive 2" Require="level >= 16"',
  'Genius Mutagen':'Traits=Alchemist Require="level >= 16"',
  'Persistent Mutagen':
    'Traits=Alchemist Require="level >= 16","features.Extend Elixir"',
  'Improbable Elixirs':'Traits=Alchemist Require="level >= 18"',
  'Mindblank Mutagen':'Traits=Alchemist Require="level >= 18"',
  'Miracle Worker':'Traits=Alchemist Require="level >= 18"',
  'Perfect Debilitation':'Traits=Alchemist Require="level >= 18"',
  "Craft Philosopher's Stone":'Traits=Alchemist Require="level >= 20"',
  'Mega Bomb':
    'Traits=Alchemist,"Additive 3" ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Expanded Splash"',
  'Perfect Mutagen':'Traits=Alchemist Require="level >= 20"',

  // Barbarian
  'Acute Vision':'Traits=Barbarian',
  'Moment Of Clarity':'Traits=Barbarian,Concentrate,Rage',
  'Raging Intimidation':'Traits=Barbarian',
  'Raging Thrower':'Traits=Barbarian',
  'Sudden Charge':'Traits=Barbarian,Fighter,Flourish,Open',
  'Acute Scent':
    'Traits=Barbarian ' +
    'Require="level >= 2","features.Acute Vision || features.Darkvision"',
  'Furious Finish':'Traits=Barbarian,Rage Require="level >= 2"',
  'No Escape':'Traits=Barbarian,Rage Require="level >= 2"',
  'Second Wind':'Traits=Barbarian Require="level >= 2"',
  'Shake It Off':'Traits=Barbarian,Concentrate,Rage Require="level >= 2"',
  'Fast Movement':'Traits=Barbarian Require="level >= 4"',
  'Raging Athlete':
    'Traits=Barbarian Require="level >= 4","rank.Athletics >= 2"',
  'Swipe':'Traits=Barbarian,Fighter,Flourish Require="level >= 4"',
  // Errata removes Rage trait
  'Wounded Rage':'Traits=Barbarian Require="level >= 4"',
  // Instinct trait missing from Nethys
  'Animal Skin':
    'Traits=Barbarian,Morph,Primal,Transmutation ' +
    'Require="level >= 6","features.Animal Instinct"',
  'Attack Of Opportunity':'Traits=Barbarian,Champion Require="level >= 6"',
  'Brutal Bully':'Traits=Barbarian Require="level >= 6","rank.Athletics >= 2"',
  'Cleave':'Traits=Barbarian,Rage Require="level >= 6"',
  // Instinct trait missing from Nethys
  "Dragon's Rage Breath":
    'Traits=Barbarian,Arcane,Concentrate,Evocation,Rage ' +
    'Require="level >= 6","features.Dragon Instinct"',
  // Instinct trait missing from Nethys
  "Giant's Stature":
    'Traits=Barbarian,Polymorph,Primal,Rage,Transmutation ' +
    'Require="level >= 6","features.Giant Instinct"',
  // Instinct trait missing from Nethys
  "Spirits' Interference":
    'Traits=Barbarian,Divine,Necromancy,Rage ' +
    'Require="level >= 6","features.Spirit Instinct"',
  // Instinct trait missing from Nethys
  'Animal Rage':
    'Traits=Barbarian,Concentrate,Polymorph,Primal,Rage,Transmutation ' +
    'Require="level >= 8","features.Animal Instinct"',
  'Furious Bully':'Traits=Barbarian Require="level >= 8","rank.Athletics >= 3"',
  'Renewed Vigor':'Traits=Barbarian,Concentrate,Rage Require="level >= 8"',
  'Share Rage':'Traits=Barbarian,Auditory,Rage,Visual Require="level >= 8"',
  'Sudden Leap':'Traits=Barbarian,Fighter Require="level >= 8"',
  'Thrash':'Traits=Barbarian,Rage Require="level >= 8"',
  'Come And Get Me':'Traits=Barbarian,Concentrate,Rage Require="level >= 10"',
  'Furious Sprint':'Traits=Barbarian,Rage Require="level >= 10"',
  'Great Cleave':
    'Traits=Barbarian,Rage Require="level >= 10","features.Cleave"',
  'Knockback':'Traits=Barbarian,Rage Require="level >= 10"',
  'Terrifying Howl':
    'Traits=Barbarian,Auditory,Rage ' +
    'Require="level >= 10","features.Intimidating Glare"',
  // Instinct trait missing from Nethys
  "Dragon's Rage Wings":
    'Traits=Barbarian,Morph,Primal,Rage,Transmutation ' +
    'Require="level >= 12","features.Dragon Instinct"',
  'Furious Grab':'Traits=Barbarian,Rage Require="level >= 12"',
  // Instinct trait missing from Nethys
  "Predator's Pounce":
    'Traits=Barbarian,Flourish,Open,Rage ' +
    'Require="level >= 12","features.Animal Instinct"',
  // Instinct trait missing from Nethys
  "Spirit's Wrath":
    'Traits=Barbarian,Attack,Concentrate,Rage ' +
    'Require="level >= 12","features.Spirit Instinct"',
  // Instinct trait missing from Nethys
  "Titan's Stature":
    'Traits=Barbarian,Polymorph,Transmutation ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Giant Instinct",' +
      '"features.Giant\'s Stature"',
  'Awesome Blow':
    'Traits=Barbarian,Concentrate,Rage ' +
    'Require="level >= 14","features.Knockback"',
  // Instinct trait missing from Nethys
  "Giant's Lunge":
    'Traits=Barbarian,Concentrate,Rage ' +
    'Require="level >= 14","features.Giant Instinct"',
  'Vengeful Strike':
    'Traits=Barbarian,Rage ' +
    'Require="level >= 14","features.Come And Get Me"',
  'Whirlwind Strike':
    'Traits=Barbarian,Fighter,Flourish,Open Require="level >= 14"',
  'Collateral Thrash':
    'Traits=Barbarian,Rage Require="level >= 16","features.Thrash"',
  // Instinct trait missing from Nethys
  'Dragon Transformation':
    'Traits=Barbarian,Concentrate,Polymorph,Primal,Rage,Transmutation ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Dragon Instinct",' +
     '"features.Dragon\'s Rage Wings"',
  'Reckless Abandon':'Traits=Barbarian,Rage Require="level >= 16"',
  'Brutal Critical':'Traits=Barbarian Require="level >= 18"',
  'Perfect Clarity':
    'Traits=Barbarian,Concentrate,Fortune,Rage Require="level >= 18"',
  'Vicious Evisceration':'Traits=Barbarian,Rage Require="level >= 18"',
  'Contagious Rage':
    'Traits=Barbarian,Auditory,Rage,Visual ' +
    'Require="level >= 20","features.Share Rage"',
  'Quaking Stomp':'Traits=Barbarian,Manipulate,Rage Require="level >= 20"',

  // Bard
  'Bardic Lore':'Traits=Bard Require="hasEnigmaMuse"',
  'Lingering Composition':
    'Traits=Bard Require="hasMaestroMuse","features.Focus Pool"',
  'Reach Spell':
    'Traits=Bard,Cleric,Druid,Sorcerer,Wizard,Concentrate,Metamagic',
  'Versatile Performance':'Traits=Bard Require="hasPolymathMuse"',
  'Cantrip Expansion':'Traits=Bard,Cleric,Sorcerer,Wizard Require="level >= 2"',
  'Esoteric Polymath':'Traits=Bard Require="level >= 2","hasPolymathMuse"',
  'Inspire Competence':'Traits=Bard Require="level >= 2","hasMaestroMuse"',
  "Loremaster's Etude":
    'Traits=Bard,Fortune ' +
    'Require="level >= 2","hasEnigmaMuse","features.Focus Pool"',
  'Multifarious Muse (Enigma)':
    'Traits=Bard Require="level >= 2","bardFeatures.Enigma == 0"',
  'Multifarious Muse (Maestro)':
    'Traits=Bard Require="level >= 2","bardFeatures.Maestro == 0"',
  'Multifarious Muse (Polymath)':
    'Traits=Bard Require="level >= 2","bardFeatures.Polymath == 0"',
  'Inspire Defense':'Traits=Bard Require="level >= 4","hasMaestroMuse"',
  'Melodious Spell':
    'Traits=Bard,Concentrate,Manipulate,Metamagic Require="level >= 4"',
  'Triple Time':'Traits=Bard Require="level >= 4"',
  'Versatile Signature':
    'Traits=Bard Require="level >= 4","hasPolymathMuse"',
  'Dirge Of Doom':'Traits=Bard Require="level >= 6"',
  'Harmonize':
    'Traits=Bard,Concentrate,Manipulate,Metamagic ' +
    'Require="level >= 6","hasMaestroMuse"',
  'Steady Spellcasting':
    'Traits=Bard,Cleric,Druid,Sorcerer,Wizard Require="level >= 6"',
  'Eclectic Skill':
    'Traits=Bard ' +
    'Require=' +
      '"level >= 8",' +
      '"hasPolymathMuse",' +
      '"rank.Occultism >= 3"',
  'Inspire Heroics':
    'Traits=Bard ' +
    'Require=' +
      '"level >= 8",' +
      '"hasMaestroMuse",' +
      '"features.Focus Pool"',
  'Know-It-All':'Traits=Bard Require="level >= 8","hasEnigmaMuse"',
  'House Of Imaginary Walls':'Traits=Bard Require="level >= 10"',
  'Quickened Casting':
    'Traits=Bard,Sorcerer,Wizard,Concentrate,Metamagic ' +
    'Require="level >= 10"',
  'Unusual Composition':
    'Traits=Bard,Concentrate,Manipulate,Metamagic ' +
    'Require="level >= 10","hasPolymathMuse"',
  'Eclectic Polymath':
    'Traits=Bard Require="level >= 12","features.Esoteric Polymath"',
  'Inspirational Focus':'Traits=Bard Require="level >= 12"',
  'Allegro':'Traits=Bard Require="level >= 14"',
  'Soothing Ballad':'Traits=Bard Require="level >= 14","features.Focus Pool"',
  'True Hypercognition':
    'Traits=Bard Require="level >= 14","hasEnigmaMuse"',
  'Effortless Concentration':
    'Traits=Bard,Druid,Sorcerer,Wizard Require="level >= 16"',
  'Studious Capacity':
    'Traits=Bard ' +
    'Require=' +
      '"level >= 16",' +
      '"hasEnigmaMuse",' +
      '"rank.Occultism >= 4"',
  'Deep Lore':
    'Traits=Bard ' +
    'Require=' +
      '"level >= 18",' +
      '"hasEnigmaMuse",' +
      '"rank.Occultism >= 4"',
  'Eternal Composition':'Traits=Bard Require="level >= 18","hasMaestroMuse"',
  'Impossible Polymath':
    'Traits=Bard ' +
    'Require=' +
      '"level >= 18",' +
      '"rank.Arcana >= 1 || rank.Nature >= 1 || rank.Religion >= 1",' +
      '"features.Esoteric Polymath"',
  'Fatal Aria':'Traits=Bard Require="level >= 20","features.Focus Pool"',
  'Perfect Encore':'Traits=Bard Require="level >= 20","features.Magnum Opus"',
  'Symphony Of The Muse':
    'Traits=Bard Require="level >= 20","features.Harmonize"',

  // Champion
  "Deity's Domain (%domain)":
    'Traits=Champion Require="deityDomains =~ \'%domain\'"',
  'Ranged Reprisal':'Traits=Champion Require="features.Paladin"',
  'Unimpeded Step':'Traits=Champion Require="features.Liberator"',
  'Weight Of Guilt':'Traits=Champion Require="features.Redeemer"',
  'Divine Grace':'Traits=Champion Require="level >= 2"',
  'Dragonslayer Oath':
    'Traits=Champion,Oath Require="level >= 2","features.The Tenets Of Good"',
  'Fiendsbane Oath':
    'Traits=Champion,Oath Require="level >= 2","features.The Tenets Of Good"',
  'Shining Oath':
    'Traits=Champion,Oath Require="level >= 2","features.The Tenets Of Good"',
  'Vengeful Oath':
    'Traits=Champion,Oath Require="level >= 2","features.Paladin"',
  'Aura Of Courage':
    'Traits=Champion Require="level >= 4","features.The Tenets Of Good"',
  'Divine Health':
    'Traits=Champion Require="level >= 4","features.The Tenets Of Good"',
  'Mercy':
    'Traits=Champion,Concentrate,Metamagic ' +
    'Require="level >= 4","spells.Lay On Hands (D1 Foc Nec)"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Devotion Spells",' +
      '"features.The Tenets Of Good"',
  'Loyal Warhorse':'Traits=Champion Require="level >= 6","features.Steed Ally"',
  'Shield Warden':
    'Traits=Champion,Fighter ' +
    'Require=' +
      '"level >= 6",' +
      // As per core rules:
      // '"features.Shield Ally && features.The Tenets Of Good || ' +
      //  'levels.Fighter && features.Shield Block"',
      // However, QuilvyRules validation doesn't support the && operator. All
      // fighters receive Shield Block at level 1, so that's redundant, and
      // the core rules defines only The Tenets Of Good, so we drop that.
      '"features.Shield Ally || levels.Fighter"',
  'Smite Evil':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Blade Ally",' +
      // Errata adds The Tenets Of Good
      '"features.The Tenets Of Good"',
  "Advanced Deity's Domain (%domain)":
    'Traits=Champion Require="level >= 8","features.Deity\'s Domain (%domain)"',
  'Greater Mercy':'Traits=Champion Require="level >= 8","features.Mercy"',
  'Heal Mount':'Traits=Champion Require="level >= 8","features.Steed Ally"',
  // Errata renames Quick Block to Quick Shield Block and adds a prereq
  'Quick Shield Block':
    'Traits=Champion,Fighter ' +
    'Require="level >= 8","features.Shield Block"',
  'Second Ally':'Traits=Champion Require="level >= 8","features.Divine Ally"',
  'Sense Evil':
    'Traits=Champion Require="level >= 8","features.The Tenets Of Good"',
  'Devoted Focus':
    'Traits=Champion Require="level >= 10","features.Devotion Spells"',
  'Imposing Destrier':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Steed Ally",' +
      '"features.Loyal Warhorse"',
  'Litany Against Sloth':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Devotion Spells",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Spirit':
    'Traits=Champion Require="level >= 10","features.Blade Ally"',
  'Shield Of Reckoning':
    'Traits=Champion,Flourish ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Champion\'s Reaction",' +
      '"features.Shield Ally",' +
      '"features.The Tenets Of Good",' +
      '"features.Shield Warden"',
  'Affliction Mercy':'Traits=Champion Require="level >= 12","features.Mercy"',
  'Aura Of Faith':
    'Traits=Champion Require="level >= 12","features.The Tenets Of Good"',
  // Errata changes Paladin requirement to The Tenets Of Good
  'Blade Of Justice':
    'Traits=Champion Require="level >= 12","features.The Tenets Of Good"',
  "Champion's Sacrifice":
    'Traits=Champion Require="level >= 12","features.The Tenets Of Good"',
  'Divine Wall':'Traits=Champion Require="level >= 12"',
  'Lasting Doubt':'Traits=Champion Require="level >= 12","features.Redeemer"',
  'Liberating Stride':
    'Traits=Champion Require="level >= 12","features.Liberator"',
  'Anchoring Aura':
    'Traits=Champion Require="level >= 14","features.Fiendsbane Oath"',
  'Aura Of Life':
    'Traits=Champion Require="level >= 14","features.Shining Oath"',
  'Aura Of Righteousness':
    'Traits=Champion Require="level >= 14","features.The Tenets Of Good"',
  'Aura Of Vengeance':
    'Traits=Champion ' +
    'Require="level >= 14","features.Exalt","features.Vengeful Oath"',
  'Divine Reflexes':'Traits=Champion Require="level >= 14"',
  'Litany Of Righteousness':
    'Traits=Champion Require="level >= 14","features.The Tenets Of Good"',
  'Wyrmbane Aura':
    'Traits=Champion Require="level >= 14","features.Dragonslayer Oath"',
  'Auspicious Mount':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Steed Ally",' +
      '"features.Imposing Destrier"',
  'Instrument Of Zeal':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Blade Ally",' +
      '"features.The Tenets Of Good"',
  'Shield Of Grace':
    'Traits=Champion Require="level >= 16","features.Shield Warden"',
  'Celestial Form':
    'Traits=Champion Require="level >= 18","features.The Tenets Of Good"',
  'Ultimate Mercy':'Traits=Champion Require="level >= 18","features.Mercy"',
  'Celestial Mount':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Steed Ally",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Master':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Blade Ally",' +
      '"features.Radiant Blade Spirit"',
  'Shield Paragon':
    'Traits=Champion Require="level >= 20","features.Shield Ally"',

  // Cleric
  // Errata allows Unarmed
  'Deadly Simplicity':
    'Traits=Cleric ' +
    'Require=' +
      '"deityWeaponCategory =~ \'Simple|Unarmed\'",' +
      '"deityWeaponRank >= 1"',
  'Domain Initiate (%domain)':
    'Traits=Cleric Require="deityDomains =~ \'%domain\'"',
  'Harming Hands':'Traits=Cleric Require="features.Harmful Font"',
  'Healing Hands':'Traits=Cleric Require="features.Healing Font"',
  'Holy Castigation':'Traits=Cleric Require="alignment =~ \'Good\'"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':'Traits=Cleric,Healing,Positive Require="level >= 2"',
  'Emblazon Armament':'Traits=Cleric,Exploration Require="level >= 2"',
  'Sap Life':'Traits=Cleric,Healing Require="level >= 2"',
  'Turn Undead':'Traits=Cleric Require="level >= 2"',
  'Versatile Font':
    'Traits=Cleric ' +
    'Require=' +
      '"level >= 2",' +
      '"features.Harmful Font || features.Healing Font",' +
      '"deityFont == \'Either\'"',
  'Channel Smite':
    'Traits=Cleric,Divine,Necromancy ' +
    'Require="level >= 4","features.Harmful Font || features.Healing Font"',
  'Command Undead':
    'Traits=Cleric,Concentrate,Metamagic ' +
    'Require="level >= 4","features.Harmful Font","alignment =~ \'Evil\'"',
  'Directed Channel':'Traits=Cleric Require="level >= 4"',
  'Improved Communal Healing':
    'Traits=Cleric Require="level >= 4","features.Communal Healing"',
  'Necrotic Infusion':
    'Traits=Cleric,Concentrate,Metamagic ' +
    'Require="level >= 4","features.Harmful Font","alignment =~ \'Evil\'"',
  'Cast Down':
    'Traits=Cleric,Concentrate,Metamagic ' +
    'Require="level >= 6","features.Harmful Font || features.Healing Font"',
  'Divine Weapon':'Traits=Cleric Require="level >= 6"',
  'Selective Energy':'Traits=Cleric Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced Domain (%domain)':
    'Traits=Cleric ' +
    'Require="level >= 8","features.Domain Initiate (%domain)"',
  'Align Armament (Chaotic)':
    'Traits=Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'C\'"',
  'Align Armament (Evil)':
    'Traits=Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'E\'"',
  'Align Armament (Good)':
    'Traits=Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'G\'"',
  'Align Armament (Lawful)':
    'Traits=Cleric,Divine,Evocation ' +
    'Require="level >= 8","deityAlignment =~ \'L\'"',
  'Channeled Succor':
    'Traits=Cleric Require="level >= 8","features.Healing Font"',
  'Cremate Undead':'Traits=Cleric Require="level >= 8"',
  'Emblazon Energy':
    'Traits=Cleric Require="level >= 8","features.Emblazon Armament"',
  'Castigating Weapon':
    'Traits=Cleric Require="level >= 10","features.Holy Castigation"',
  'Heroic Recovery':
    'Traits=Cleric,Concentrate,Metamagic ' +
    'Require="level >= 10","features.Healing Font","alignment =~ \'Good\'"',
  'Improved Command Undead':
    'Traits=Cleric ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Harmful Font",' +
      '"features.Command Undead",' +
      '"alignment =~ \'Evil\'"',
  'Replenishment Of War':
    'Traits=Cleric Require="level >= 10","deityWeaponRank >= 2"',
  'Defensive Recovery':
    'Traits=Cleric,Concentrate,Metamagic ' +
    'Require="level >= 12","features.Harmful Font || features.Healing Font"',
  'Domain Focus':
    'Traits=Cleric Require="level >= 12","features.Domain Initiate"',
  'Emblazon Antimagic':
    'Traits=Cleric Require="level >= 12","features.Emblazon Armament"',
  'Shared Replenishment':
    'Traits=Cleric Require="level >= 12","features.Replenishment Of War"',
  "Deity's Protection":
    'Traits=Cleric Require="level >= 14","features.Advanced Domain"',
  'Extend Armament Alignment':
    'Traits=Cleric Require="level >= 14","features.Align Armament"',
  'Fast Channel':
    'Traits=Cleric ' +
    'Require="level >= 14","features.Harmful Font || features.Healing Font"',
  'Swift Banishment':'Traits=Cleric Require="level >= 14"',
  'Eternal Bane':'Traits=Cleric Require="level >= 16","alignment =~ \'Evil\'"',
  'Eternal Blessing':
    'Traits=Cleric Require="level >= 16","alignment =~ \'Good\'"',
  'Resurrectionist':'Traits=Cleric Require="level >= 16"',
  'Domain Wellspring':
    'Traits=Cleric Require="level >= 18","features.Domain Focus"',
  'Echoing Channel':'Traits=Cleric,Concentrate,Metamagic Require="level >= 18"',
  'Improved Swift Banishment':
    'Traits=Cleric Require="level >= 18","features.Swift Banishment"',
  "Avatar's Audience":'Traits=Cleric Require="level >= 20"',
  'Maker Of Miracles':
    'Traits=Cleric Require="level >= 20","features.Miraculous Spell"',
  'Metamagic Channel':'Traits=Cleric,Concentrate Require="level >= 20"',

  // Druid
  'Animal Companion':
    'Traits=Druid,Ranger Require="inAnimalOrder || levels.Ranger"',
  'Leshy Familiar':'Traits=Druid Require="inLeafOrder"',
  // Reach Spell as above
  'Storm Born':'Traits=Druid Require="inStormOrder"',
  'Widen Spell':'Traits=Druid,Sorcerer,Wizard,Manipulate,Metamagic',
  'Wild Shape':'Traits=Druid Require="inWildOrder"',
  'Call Of The Wild':'Traits=Druid Require="level >= 2"',
  'Enhanced Familiar':
    'Traits=Druid,Sorcerer,Wizard ' +
    'Require="level >= 2","features.Familiar || features.Leshy Familiar"',
  'Order Explorer (Animal)':
    'Traits=Druid Require="level >= 2","features.Animal == 0"',
  'Order Explorer (Leaf)':
    'Traits=Druid Require="level >= 2","features.Leaf == 0"',
  'Order Explorer (Storm)':
    'Traits=Druid Require="level >= 2","features.Storm == 0"',
  'Order Explorer (Wild)':
    'Traits=Druid Require="level >= 2","features.Wild == 0"',
  // Poison Resistance as above
  'Form Control':
    'Traits=Druid,Manipulate,Metamagic ' +
    'Require="level >= 4","strengthModifier >= 2","features.Wild Shape"',
  'Mature Animal Companion':
    'Traits=Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 4 || levels.Ranger >= 6",' +
      '"features.Animal Companion"',
  'Order Magic (Animal)':
    'Traits=Druid Require="level >= 4","features.Order Explorer (Animal)"',
  'Order Magic (Leaf)':
    'Traits=Druid Require="level >= 4","features.Order Explorer (Leaf)"',
  'Order Magic (Storm)':
    'Traits=Druid Require="level >= 4","features.Order Explorer (Storm)"',
  'Order Magic (Wild)':
    'Traits=Druid Require="level >= 4","features.Order Explorer (Wild)"',
  'Thousand Faces':'Traits=Druid Require="level >= 4","features.Wild Shape"',
  'Woodland Stride':'Traits=Druid Require="level >= 4","inLeafOrder"',
  'Green Empathy':'Traits=Druid Require="level >= 6","inLeafOrder"',
  'Insect Shape':'Traits=Druid Require="level >= 6","features.Wild Shape"',
  // Steady Spellcasting as above
  'Storm Retribution':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"inStormOrder",' +
      '"spells.Tempest Surge (P1 Foc Evo)"',
  'Ferocious Shape':'Traits=Druid Require="level >= 8","features.Wild Shape"',
  'Fey Caller':'Traits=Druid Require="level >= 8"',
  'Incredible Companion':
    'Traits=Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 8 || levels.Ranger >= 10",' +
      '"features.Mature Animal Companion"',
  'Soaring Shape':'Traits=Druid Require="level >= 8","features.Wild Shape"',
  'Wind Caller':'Traits=Druid Require="level >= 8","inStormOrder"',
  'Elemental Shape':'Traits=Druid Require="level >= 10","features.Wild Shape"',
  'Healing Transformation':'Traits=Druid,Metamagic Require="level >= 10"',
  'Overwhelming Energy':
    'Traits=Druid,Sorcerer,Wizard,Manipulate,Metamagic Require="level >= 10"',
  'Plant Shape':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"inLeafOrder || features.Wild Shape"',
  'Side By Side':
    'Traits=Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 10 || levels.Ranger >= 12",' +
      '"features.Animal Companion"',
  'Dragon Shape':'Traits=Druid Require="level >= 12","features.Soaring Shape"',
  'Green Tongue':'Traits=Druid Require="level >= 12","features.Green Empathy"',
  'Primal Focus':'Traits=Druid Require="level >= 12"',
  'Primal Summons':
    'Traits=Druid Require="level >= 12","features.Call Of The Wild"',
  'Specialized Companion':
    'Traits=Druid,Ranger ' +
    'Require=' +
      '"levels.Druid >= 14 || levels.Ranger >= 16",' +
      '"features.Incredible Companion"',
  'Timeless Nature':'Traits=Druid Require="level >= 14"',
  'Verdant Metamorphosis':
    'Traits=Druid Require="level >= 14","inLeafOrder"',
  // Effortless Concentration as above
  'Impaling Briars':'Traits=Druid Require="level >= 16","inLeafOrder"',
  'Monstrosity Shape':
    'Traits=Druid Require="level >= 16","features.Wild Shape"',
  'Invoke Disaster':'Traits=Druid Require="level >= 18","features.Wind Caller"',
  'Perfect Form Control':
    'Traits=Druid ' +
    'Require="level >= 18","features.Form Control","strengthModifier >= 4"',
  // Errata corrects Wild Focus to Primal Focus
  'Primal Wellspring':
    'Traits=Druid Require="level >= 18","features.Primal Focus"',
  // Errata removes legendary Nature requirement
  "Hierophant's Power":'Traits=Druid Require="level >= 20"',
  'Leyline Conduit':
    'Traits=Druid,Concentrate,Manipulate,Metamagic Require="level >= 20"',
  'True Shapeshifter':
    'Traits=Druid,Concentrate ' +
    'Require="level >= 20","features.Dragon Shape","features.Wild Shape"',

  // Fighter
  'Double Slice':'Traits=Fighter',
  'Exacting Strike':'Traits=Fighter,Press',
  'Point-Blank Shot':'Traits=Fighter,Open,Stance',
  'Power Attack':'Traits=Fighter,Flourish',
  'Reactive Shield':'Traits=Fighter',
  'Snagging Strike':'Traits=Fighter',
  // Sudden Charge as above
  'Aggressive Block':'Traits=Fighter Require="level >= 2"',
  // Errata adds Press trait
  'Assisting Shot':'Traits=Fighter,Press Require="level >= 2"',
  'Brutish Shove':'Traits=Fighter,Press Require="level >= 2"',
  'Combat Grab':'Traits=Fighter,Press Require="level >= 2"',
  'Dueling Parry':'Traits=Fighter Require="level >= 2"',
  'Intimidating Strike':
    'Traits=Fighter,Emotion,Fear,Mental Require="level >= 2"',
  'Lunge':'Traits=Fighter Require="level >= 2"',
  'Double Shot':'Traits=Fighter,Flourish Require="level >= 4"',
  'Dual-Handed Assault':'Traits=Fighter,Flourish Require="level >= 4"',
  'Knockdown':
    'Traits=Fighter,Flourish Require="level >= 4","rank.Athletics >= 1"',
  'Powerful Shove':
    'Traits=Fighter ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Aggressive Block || features.Brutish Shove"',
  'Quick Reversal':'Traits=Fighter,Flourish,Press Require="level >= 4"',
  'Shielded Stride':'Traits=Fighter Require="level >= 4"',
  // Swipe as above
  'Twin Parry':'Traits=Fighter,Ranger Require="level >= 4"',
  'Advanced Weapon Training':'Traits=Fighter Require="level >= 6"',
  'Advantageous Assault':'Traits=Fighter,Press Require="level >= 6"',
  'Disarming Stance':
    'Traits=Fighter,Stance Require="level >= 6","rank.Athletics >= 1"',
  'Furious Focus':'Traits=Fighter Require="level >= 6","features.Power Attack"',
  "Guardian's Deflection":'Traits=Fighter Require="level >= 6"',
  'Reflexive Shield':'Traits=Fighter Require="level >= 6"',
  'Revealing Stab':'Traits=Fighter Require="level >= 6"',
  'Shatter Defenses':'Traits=Fighter,Press Require="level >= 6"',
  // Shield Warden as above
  'Triple Shot':'Traits=Fighter Require="level >= 6","features.Double Shot"',
  'Blind-Fight':
    'Traits=Fighter,Ranger,Rogue ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Perception >= 3"',
  'Dueling Riposte':
    'Traits=Fighter Require="level >= 8","features.Dueling Parry"',
  'Felling Strike':'Traits=Fighter Require="level >= 8"',
  'Incredible Aim':'Traits=Fighter,Concentrate Require="level >= 8"',
  'Mobile Shot Stance':'Traits=Fighter,Stance Require="level >= 8"',
  'Positioning Assault':'Traits=Fighter,Flourish Require="level >= 8"',
  // Quick Shield Block as above; errata drops the Reactive Shield prereq
  // Sudden Leap as above
  'Agile Grace':'Traits=Fighter Require="level >= 10"',
  'Certain Strike':'Traits=Fighter,Press Require="level >= 10"',
  'Combat Reflexes':'Traits=Fighter Require="level >= 10"',
  'Debilitating Shot':'Traits=Fighter,Flourish Require="level >= 10"',
  'Disarming Twist':
    'Traits=Fighter,Press Require="level >= 10","rank.Athletics >= 1"',
  'Disruptive Stance':'Traits=Fighter,Stance Require="level >= 10"',
  'Fearsome Brute':'Traits=Fighter Require="level >= 10"',
  'Improved Knockdown':
    'Traits=Fighter Require="level >= 10","features.Knockdown"',
  'Mirror Shield':'Traits=Fighter Require="level >= 10"',
  'Twin Riposte':'Traits=Fighter,Ranger Require="level >= 10"',
  'Brutal Finish':'Traits=Fighter,Press Require="level >= 12"',
  'Dueling Dance':
    'Traits=Fighter,Stance Require="level >= 12","features.Dueling Parry"',
  'Flinging Shove':
    'Traits=Fighter ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Aggressive Block || features.Brutish Shove"',
  'Improved Dueling Riposte':
    'Traits=Fighter Require="level >= 12","features.Dueling Riposte"',
  'Incredible Ricochet':
    'Traits=Fighter,Concentrate,Press ' +
    'Require="level >= 12","features.Incredible Aim"',
  'Lunging Stance':
    'Traits=Fighter,Stance ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Attack Of Opportunity",' +
      '"features.Lunge"',
  "Paragon's Guard":'Traits=Fighter,Stance Require="level >= 12"',
  'Spring Attack':'Traits=Fighter,Press Require="level >= 12"',
  'Desperate Finisher':'Traits=Fighter Require="level >= 14"',
  'Determination':'Traits=Fighter,Concentrate Require="level >= 14"',
  'Guiding Finish':'Traits=Fighter,Press Require="level >= 14"',
  'Guiding Riposte':
    'Traits=Fighter Require="level >= 14","features.Dueling Riposte"',
  'Improved Twin Riposte':
    'Traits=Fighter,Ranger ' +
    'Require=' +
      '"levels.Fighter >= 14 || levels.Ranger >= 16",' +
      '"features.Twin Riposte"',
  'Stance Savant':
    'Traits=Fighter,Monk Require="levels.Fighter >= 14 || levels.Monk >= 12"',
  'Two-Weapon Flurry':'Traits=Fighter,Flourish,Press Require="level >= 14"',
  // Whirlwind Strike as above
  'Graceful Poise':
    'Traits=Fighter,Stance Require="level >= 16","features.Double Slice"',
  'Improved Reflexive Shield':
    'Traits=Fighter Require="level >= 16","features.Reflexive Shield"',
  'Multishot Stance':
    'Traits=Fighter,Stance Require="level >= 16","features.Triple Shot"',
  'Twinned Defense':
    'Traits=Fighter,Stance Require="level >= 16","features.Twin Parry"',
  'Impossible Volley':
    'Traits=Fighter,Ranger,Flourish,Open Require="level >= 18"',
  'Savage Critical':'Traits=Fighter Require="level >= 18"',
  'Boundless Reprisals':'Traits=Fighter Require="level >= 20"',
  'Weapon Supremacy':'Traits=Fighter Require="level >= 20"',

  // Monk
  'Crane Stance':'Traits=Monk,Stance',
  'Dragon Stance':'Traits=Monk,Stance',
  'Ki Rush':'Traits=Monk',
  'Ki Strike':'Traits=Monk',
  'Monastic Weaponry':'Traits=Monk',
  'Mountain Stance':'Traits=Monk,Stance',
  'Tiger Stance':'Traits=Monk,Stance',
  'Wolf Stance':'Traits=Monk,Stance',
  'Brawling Focus':'Traits=Monk Require="level >= 2"',
  'Crushing Grab':'Traits=Monk Require="level >= 2"',
  'Dancing Leaf':'Traits=Monk Require="level >= 2"',
  'Elemental Fist':'Traits=Monk Require="level >= 2","features.Ki Strike"',
  'Stunning Fist':'Traits=Monk Require="level >= 2","features.Flurry Of Blows"',
  'Deflect Arrow':'Traits=Monk Require="level >= 4"',
  'Flurry Of Maneuvers':
    'Traits=Monk Require="level >= 4","rank.Athletics >= 2"',
  'Flying Kick':'Traits=Monk Require="level >= 4"',
  'Guarded Movement':'Traits=Monk Require="level >= 4"',
  'Stand Still':'Traits=Monk Require="level >= 4"',
  'Wholeness Of Body':'Traits=Monk Require="level >= 4","features.Ki Spells"',
  'Abundant Step':
    'Traits=Monk ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Incredible Movement",' +
      '"features.Ki Spells"',
  'Crane Flutter':'Traits=Monk Require="level >= 6","features.Crane Stance"',
  'Dragon Roar':
    'Traits=Monk,Auditory,Emotion,Fear,Mental ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Dragon Stance"',
  'Ki Blast':'Traits=Monk Require="level >= 6","features.Ki Spells"',
  'Mountain Stronghold':
    'Traits=Monk Require="level >= 6","features.Mountain Stance"',
  'Tiger Slash':'Traits=Monk Require="level >= 6","features.Tiger Stance"',
  'Water Step':'Traits=Monk Require="level >= 6"',
  'Whirling Throw':'Traits=Monk Require="level >= 6"',
  'Wolf Drag':'Traits=Monk Require="level >= 6","features.Wolf Stance"',
  'Arrow Snatching':'Traits=Monk Require="level >= 8","features.Deflect Arrow"',
  'Ironblood Stance':'Traits=Monk,Stance Require="level >= 8"',
  'Mixed Maneuver':'Traits=Monk Require="level >= 8","rank.Athletics >= 3"',
  'Tangled Forest Stance':'Traits=Monk,Stance Require="level >= 8"',
  'Wall Run':'Traits=Monk Require="level >= 8"',
  'Wild Winds Initiate':'Traits=Monk Require="level >= 8","features.Ki Spells"',
  'Knockback Strike':'Traits=Monk,Concentrate Require="level >= 10"',
  // Errata removes the Attack trait
  'Sleeper Hold':'Traits=Monk,Incapacitation Require="level >= 10"',
  'Wind Jump':'Traits=Monk Require="level >= 10","features.Ki Spells"',
  'Winding Flow':'Traits=Monk Require="level >= 10"',
  'Diamond Soul':'Traits=Monk Require="level >= 12"',
  'Disrupt Ki':'Traits=Monk,Negative Require="level >= 12"',
  'Improved Knockback':
    'Traits=Monk Require="level >= 12","rank.Athletics >= 3"',
  'Meditative Focus':'Traits=Monk Require="level >= 12","features.Ki Spells"',
  // Stance Savant as above
  'Ironblood Surge':
    'Traits=Monk Require="level >= 14","features.Ironblood Stance"',
  'Mountain Quake':
    'Traits=Monk Require="level >= 14","features.Mountain Stronghold"',
  'Tangled Forest Rake':
    'Traits=Monk Require="level >= 14","features.Tangled Forest Stance"',
  'Timeless Body':'Traits=Monk Require="level >= 14"',
  'Tongue Of Sun And Moon':'Traits=Monk Require="level >= 14"',
  'Wild Winds Gust':
    'Traits=Monk,Air,Concentrate,Evocation,Manipulate ' +
    'Require="level >= 14","features.Wild Winds Initiate"',
  // Errata adds Aura trait
  'Enlightened Presence':
    'Traits=Monk,Aura,Emotion,Mental Require="level >= 16"',
  'Master Of Many Styles':
    'Traits=Monk Require="level >= 16","features.Stance Savant"',
  'Quivering Palm':'Traits=Monk Require="level >= 16","features.Ki Spells"',
  'Shattering Strike':'Traits=Monk Require="level >= 16"',
  'Diamond Fists':'Traits=Monk Require="level >= 18"',
  'Empty Body':'Traits=Monk Require="level >= 18","features.Ki Spells"',
  'Meditative Wellspring':
    'Traits=Monk Require="level >= 18","features.Meditative Focus"',
  'Swift River':'Traits=Monk Require="level >= 18"',
  'Enduring Quickness':'Traits=Monk Require="level >= 20"',
  'Fuse Stance':'Traits=Monk Require="level >= 20","sumStanceFeats >= 2 "',
  'Impossible Technique':'Traits=Monk,Fortune Require="level >= 20"',

  // Ranger
  // Animal Companion as above
  'Crossbow Ace':'Traits=Ranger',
  'Hunted Shot':'Traits=Ranger,Flourish',
  'Monster Hunter':'Traits=Ranger',
  'Twin Takedown':'Traits=Ranger,Flourish',
  'Favored Terrain (%terrain)':'Traits=Ranger Require="level >= 2"',
  "Hunter's Aim":'Traits=Ranger,Concentrate Require="level >= 2"',
  'Monster Warden':
    'Traits=Ranger Require="level >= 2","features.Monster Hunter"',
  'Quick Draw':'Traits=Ranger,Rogue Require="level >= 2"',
  'Wild Empathy':'Traits=Ranger Require="level >= 2"',
  "Companion's Cry":
    'Traits=Ranger Require="level >= 4","features.Animal Companion"',
  'Disrupt Prey':'Traits=Ranger Require="level >= 4"',
  'Far Shot':'Traits=Ranger Require="level >= 4"',
  'Favored Enemy':'Traits=Ranger Require="level >= 4"',
  'Running Reload':'Traits=Ranger Require="level >= 4"',
  "Scout's Warning":'Traits=Ranger,Rogue Require="level >= 4"',
  'Snare Specialist':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 4",' +
      '"rank.Crafting >= 2",' +
      '"features.Snare Crafting"',
  // Twin Parry as above
  // Mature Animal Companion as above
  'Quick Snares':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 6",' +
      '"rank.Crafting >= 2",' +
      '"features.Snare Specialist"',
  'Skirmish Strike':'Traits=Ranger,Rogue,Flourish Require="level >= 6"',
  'Snap Shot':'Traits=Ranger Require="level >= 6"',
  'Swift Tracker':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 6",' +
      '"rank.Survival >= 2",' +
      '"features.Experienced Tracker"',
  // Blind-Fight as above
  'Deadly Aim':
    'Traits=Ranger,Open Require="level >= 8","features.Weapon Specialization"',
  'Hazard Finder':'Traits=Ranger Require="level >= 8"',
  'Powerful Snares':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Crafting >= 3",' +
      '"features.Snare Specialist"',
  'Terrain Master':
    'Traits=Ranger ' +
    // Errata removes Wild Stride
    'Require=' +
      '"level >= 8",' +
      '"rank.Survival >= 3",' +
      '"features.Favored Terrain"',
  "Warden's Boon":'Traits=Ranger Require="level >= 8"',
  'Camouflage':'Traits=Ranger Require="level >= 10","rank.Stealth >= 3"',
  // Incredible Companion as above
  'Master Monster Hunter':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 10",' +
      '"rank.Nature >= 3",' +
      '"features.Monster Hunter"',
  'Penetrating Shot':'Traits=Ranger,Open Require="level >= 10"',
  // Twin Riposte as above
  "Warden's Step":'Traits=Ranger Require="level >= 10","rank.Stealth >= 3"',
  'Distracting Shot':'Traits=Ranger Require="level >= 12"',
  'Double Prey':'Traits=Ranger Require="level >= 12"',
  'Lightning Snares':
    'Traits=Ranger ' +
    // Errata adds Quick Snares
    'Require=' +
      '"level >= 12",' +
      '"rank.Crafting >= 3",' +
      '"features.Quick Snares",' +
      '"features.Snare Specialist"',
  'Second Sting':'Traits=Ranger,Press Require="level >= 12"',
  // Side By Side as above
  'Sense The Unseen':'Traits=Ranger,Rogue Require="level >= 14"',
  'Shared Prey':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Double Prey",' +
      '"features.Warden\'s Boon"',
  'Stealthy Companion':
    'Traits=Ranger ' +
    // Errata adds Animal Companion
    'Require=' +
      '"level >= 14",' +
      '"features.Animal Companion",' +
      '"features.Camouflage"',
  'Targeting Shot':
    'Traits=Ranger,Concentrate,Press ' +
    'Require="level >= 14","features.Hunter\'s Aim"',
  "Warden's Guidance":'Traits=Ranger Require="level >= 14"',
  'Greater Distracting Shot':
    'Traits=Ranger Require="level >= 16","features.Distracting Shot"',
  // Improved Twin Riposte as above; Nethys adds Twin Riposte requirement
  'Legendary Monster Hunter':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 16",' +
      '"rank.Nature >= 4",' +
      '"features.Master Monster Hunter"',
  // Specialized Companion as above
  'Ubiquitous Snares':
    'Traits=Ranger Require="level >= 16","features.Snare Specialist"',
  'Impossible Flurry':'Traits=Ranger,Flourish,Open Require="level >= 18"',
  // Impossible Volley as above; errata adds Flourish and Open traits
  'Manifold Edge':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Hunter\'s Edge",' +
      '"features.Masterful Hunter"',
  'Masterful Companion':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Masterful Hunter",' +
      '"features.Animal Companion"',
  'Perfect Shot':'Traits=Ranger,Flourish Require="level >= 18"',
  'Shadow Hunter':'Traits=Ranger Require="level >= 18","features.Camouflage"',
  'Legendary Shot':
    'Traits=Ranger ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Masterful Hunter",' +
      '"rank.Perception >= 4",' +
      '"features.Far Shot"',
  'To The Ends Of The Earth':
    'Traits=Ranger Require="level >= 20","rank.Survival >= 4"',
  'Triple Threat':'Traits=Ranger Require="level >= 20","features.Shared Prey"',
  'Ultimate Skirmisher':
    'Traits=Ranger Require="level >= 20","features.Wild Stride"',

  // Rogue
  'Nimble Dodge':'Traits=Rogue',
  'Trap Finder':'Traits=Rogue',
  'Twin Feint':'Traits=Rogue',
  "You're Next":
    'Traits=Rogue,Emotion,Fear,Mental Require="rank.Intimidation >= 1"',
  'Brutal Beating':'Traits=Rogue Require="level >= 2","features.Ruffian"',
  'Distracting Feint':'Traits=Rogue Require="level >= 2","features.Scoundrel"',
  'Minor Magic (Arcane)':'Traits=Rogue Require="level >= 2"',
  'Minor Magic (Divine)':'Traits=Rogue Require="level >= 2"',
  'Minor Magic (Occult)':'Traits=Rogue Require="level >= 2"',
  'Minor Magic (Primal)':'Traits=Rogue Require="level >= 2"',
  'Mobility':'Traits=Rogue Require="level >= 2"',
  // Quick Draw as above
  'Unbalancing Blow':'Traits=Rogue Require="level >= 2","features.Thief"',
  'Battle Assessment':'Traits=Rogue,Secret Require="level >= 4"',
  'Dread Striker':'Traits=Rogue Require="level >= 4"',
  'Magical Trickster':'Traits=Rogue Require="level >= 4"',
  'Poison Weapon':'Traits=Rogue,Manipulate Require="level >= 4"',
  'Reactive Pursuit':'Traits=Rogue Require="level >= 4"',
  'Sabotage':'Traits=Rogue,Incapacitation Require="level >= 4"',
  // Scout's Warning as above
  'Gang Up':'Traits=Rogue Require="level >= 6"',
  'Light Step':'Traits=Rogue Require="level >= 6"',
  // Skirmish Strike as above
  'Twist The Knife':'Traits=Rogue Require="level >= 6"',
  // Blind-Fight as above
  'Delay Trap':'Traits=Rogue Require="level >= 8"',
  'Improved Poison Weapon':
    'Traits=Rogue Require="level >= 8","features.Poison Weapon"',
  'Nimble Roll':'Traits=Rogue Require="level >= 8","features.Nimble Dodge"',
  'Opportune Backstab':'Traits=Rogue Require="level >= 8"',
  'Sidestep':'Traits=Rogue Require="level >= 8"',
  'Sly Striker':'Traits=Rogue Require="level >= 8","features.Sneak Attack"',
  'Precise Debilitations':
    'Traits=Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Thief",' +
      '"features.Debilitating Strike"',
  'Sneak Savant':'Traits=Rogue Require="level >= 10","rank.Stealth >= 3"',
  'Tactical Debilitations':
    'Traits=Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Scoundrel",' +
      '"features.Debilitating Strike"',
  'Vicious Debilitations':
    'Traits=Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Ruffian",' +
      '"features.Debilitating Strike"',
  'Critical Debilitation':
    'Traits=Rogue,Incapacitation ' +
    'Require="level >= 12","features.Debilitating Strike"',
  'Fantastic Leap':'Traits=Rogue Require="level >= 12"',
  'Felling Shot':'Traits=Rogue Require="level >= 12"',
  'Reactive Interference':'Traits=Rogue Require="level >= 12"',
  'Spring From The Shadows':'Traits=Rogue,Flourish Require="level >= 12"',
  'Defensive Roll':'Traits=Rogue Require="level >= 14"',
  'Instant Opening':'Traits=Rogue,Concentrate Require="level >= 14"',
  'Leave An Opening':'Traits=Rogue Require="level >= 14"',
  // Sense The Unseen as above
  'Blank Slate':'Traits=Rogue Require="level >= 16","rank.Deception >= 4"',
  'Cloud Step':'Traits=Rogue Require="level >= 16","rank.Acrobatics >= 4"',
  'Cognitive Loophole':'Traits=Rogue Require="level >= 16"',
  'Dispelling Slice':'Traits=Rogue Require="level >= 16"',
  'Perfect Distraction':
    'Traits=Rogue Require="level >= 16","rank.Deception >= 4"',
  'Implausible Infiltration':
    'Traits=Rogue,Magical,Move ' +
    'Require=' +
      '"level >= 18",' +
      '"rank.Acrobatics >= 4",' +
      '"features.Quick Squeeze"',
  'Powerful Sneak':'Traits=Rogue Require="level >= 18"',
  "Trickster's Ace":'Traits=Rogue,Concentrate Require="level >= 18"',
  'Hidden Paragon':'Traits=Rogue Require="level >= 20","rank.Stealth >= 4"',
  'Impossible Striker':
    'Traits=Rogue Require="level >= 20","features.Sly Striker"',
  'Reactive Distraction':
    'Traits=Rogue,Concentrate,Manipulate ' +
    'Require=' +
      '"level >= 20",' +
      '"rank.Deception >= 4",' +
      '"features.Perfect Distraction"',

  // Sorcerer
  // Nethys adds Arcane
  'Counterspell':'Traits=Sorcerer,Wizard,Abjuration,Arcane',
  'Dangerous Sorcery':'Traits=Sorcerer',
  'Familiar':'Traits=Sorcerer,Wizard',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Traits=Sorcerer,Arcane ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Arcane\'"',
  'Bespell Weapon':'Traits=Sorcerer,Wizard Require="level >= 4"',
  'Divine Evolution':
    'Traits=Sorcerer,Divine ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Divine\'"',
  'Occult Evolution':
    'Traits=Sorcerer,Occult ' +
     'Require="level >= 4","bloodlineTraditions =~ \'Occult\'"',
  'Primal Evolution':
    'Traits=Sorcerer,Primal ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Primal\'"',
  'Advanced Bloodline':
    'Traits=Sorcerer ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Bloodline Spells || features.Basic Bloodline Spell"',
  // Steady Spellcasting as above
  'Bloodline Resistance':'Traits=Sorcerer Require="level >= 8"',
  'Crossblooded Evolution':'Traits=Sorcerer Require="level >= 8"',
  'Greater Bloodline':
    'Traits=Sorcerer ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Bloodline Spells || features.Basic Bloodline Spell"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':
    'Traits=Sorcerer ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Bloodline Spells || features.Basic Bloodline Spell"',
  'Magic Sense':
    // Note: for sorcerers, Arcane is replaced by the bloodline tradition
    'Traits=Sorcerer,Wizard,Arcane,Detection,Divination ' +
    'Require="level >= 12"',
  'Interweave Dispel':
    'Traits=Sorcerer,Metamagic Require="level >= 14","knowsDispelMagicSpell"',
  'Reflect Spell':
    'Traits=Sorcerer,Wizard Require="level >= 14","features.Counterspell"',
  // Effortless Concentration as above
  // Errata removes Arcane trait
  'Greater Mental Evolution':
    'Traits=Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Arcane Evolution || features.Occult Evolution"',
  // Errata removes Divine trait
  'Greater Vital Evolution':
    'Traits=Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Evolution || features.Primal Evolution"',
  'Bloodline Wellspring':
    'Traits=Sorcerer Require="level >= 18","features.Bloodline Focus"',
  'Greater Crossblooded Evolution':
    'Traits=Sorcerer ' +
    'Require="level >= 18","features.Crossblooded Evolution"',
  'Bloodline Conduit':'Traits=Sorcerer,Metamagic Require="level >= 20"',
  'Bloodline Perfection':
    'Traits=Sorcerer Require="level >= 20","features.Bloodline Paragon"',
  'Metamagic Mastery':'Traits=Sorcerer,Wizard Require="level >= 20"',

  // Wizard
  // Counterspell as above
  'Eschew Materials':'Traits=Wizard',
  // Familiar as above
  'Hand Of The Apprentice':'Traits=Wizard Require="features.Universalist"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':
    'Traits=Wizard,Concentrate,Manipulate,Metamagic Require="level >= 2"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':
    'Traits=Wizard ' +
    'Require="level >= 4","features.Arcane Bond","features.Arcane School"',
  'Silent Spell':
    'Traits=Wizard,Concentrate,Metamagic ' +
    'Require="level >= 4","features.Conceal Spell"',
  'Spell Penetration':'Traits=Wizard Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced School Spell':
    'Traits=Wizard Require="level >= 8","features.Arcane School"',
  'Bond Conservation':
    'Traits=Wizard,Manipulate,Metamagic ' +
    'Require="level >= 8","features.Arcane Bond"',
  'Universal Versatility':
    'Traits=Wizard ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Universalist",' +
      '"features.Hand Of The Apprentice"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Savant':'Traits=Wizard Require="level >= 10","rank.Crafting >= 2"',
  'Clever Counterspell':
    'Traits=Wizard ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Counterspell",' +
      // Errata corrects Quick Recognize to Quick Recognition
      '"features.Quick Recognition"',
  // Magic Sense as above
  'Bonded Focus':'Traits=Wizard Require="level >= 14","features.Arcane Bond"',
  // Reflect Spell as above
  'Superior Bond':'Traits=Wizard Require="level >= 14","features.Arcane Bond"',
  // Effortless Concentration as above
  'Spell Tinker':'Traits=Wizard,Concentrate Require="level >= 16"',
  'Infinite Possibilities':'Traits=Wizard Require="level >= 18"',
  'Reprepare Spell':'Traits=Wizard Require="level >= 18"',
  "Archwizard's Might":
    'Traits=Wizard ' +
    'Require="level >= 20","features.Archwizard\'s Spellcraft"',
  // Metamagic Mastery as above
  'Spell Combination':'Traits=Wizard Require="level >= 20"',

  // Archetype
  'Alchemist Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"intelligenceModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Alchemist == 0"',
  'Basic Concoction':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Alchemist Dedication"',
  'Quick Alchemy':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Alchemist Dedication"',
  'Advanced Concoction':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Basic Concoction"',
  'Expert Alchemy':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Alchemist Dedication",' +
      '"rank.Crafting >= 2"',
  'Master Alchemy':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Expert Alchemy",' +
      '"rank.Crafting >= 3"',

  'Barbarian Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"strengthModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"constitutionModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Barbarian == 0"',
  'Barbarian Resiliency':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Barbarian Dedication",' +
      '"classHitPoints <= 10"',
  'Basic Fury':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Barbarian Dedication"',
  'Advanced Fury':
    'Traits=Archetype Require="level >= 6","features.Basic Fury"',
  'Instinct Ability':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Barbarian Dedication"',
  "Juggernaut's Fortitude":
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Barbarian Dedication",' +
      '"rank.Fortitude >= 2"',

  'Bard Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"charismaModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Bard == 0"',
  'Basic Bard Spellcasting':
    'Traits=Archetype Require="level >= 4","features.Bard Dedication"',
  "Basic Muse's Whispers":
    'Traits=Archetype Require="level >= 4","features.Bard Dedication"',
  "Advanced Muse's Whispers":
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Basic Muse\'s Whispers"',
  'Counter Perform':
    'Traits=Archetype Require="level >= 6","features.Bard Dedication"',
  'Inspirational Performance':
    'Traits=Archetype Require="level >= 8","features.Bard Dedication"',
  'Occult Breadth':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Basic Bard Spellcasting"',
  'Expert Bard Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Bard Spellcasting",' +
      '"rank.Occultism >= 3"',
  'Master Bard Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Bard Spellcasting",' +
      '"rank.Occultism >= 4"',

  'Champion Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"strengthModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"charismaModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Champion == 0"',
  'Basic Devotion':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Champion Dedication"',
  'Champion Resiliency':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Champion Dedication",' +
      '"classHitPoints <= 8"',
  'Healing Touch':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Champion Dedication"',
  'Advanced Devotion':
    'Traits=Archetype Require="level >= 6","features.Basic Devotion"',
  "Champion's Reaction":
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Champion Dedication"',
  'Divine Ally':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Champion Dedication"',
  'Diverse Armor Expert':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Champion Dedication",' +
      '"rank.Unarmored Defense >= 2 || ' +
       'rank.Light Armor >= 2 || ' +
       'rank.Medium Armor >= 2 || ' +
       'rank.Heavy Armor >= 2"',

  'Cleric Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"wisdomModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Cleric == 0"',
  'Basic Cleric Spellcasting':
    'Traits=Archetype Require="level >= 4","features.Cleric Dedication"',
  'Basic Dogma':
    'Traits=Archetype Require="level >= 4","features.Cleric Dedication"',
  'Advanced Dogma':
    'Traits=Archetype Require="level >= 6","features.Basic Dogma"',
  'Divine Breadth':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Basic Cleric Spellcasting"',
  'Expert Cleric Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Cleric Spellcasting",' +
      '"rank.Religion >= 3"',
  'Master Cleric Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Cleric Spellcasting",' +
      '"rank.Religion >= 4"',

  'Druid Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"wisdomModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Druid == 0"',
  'Basic Druid Spellcasting':
    'Traits=Archetype Require="level >= 4","features.Druid Dedication"',
  'Basic Wilding':
    'Traits=Archetype Require="level >= 4","features.Druid Dedication"',
  'Order Spell':
    'Traits=Archetype Require="level >= 4","features.Druid Dedication"',
  'Advanced Wilding':
    'Traits=Archetype Require="level >= 6","features.Basic Wilding"',
  'Primal Breadth':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Basic Druid Spellcasting"',
  'Expert Druid Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Druid Spellcasting",' +
      '"rank.Nature >= 3"',
  'Master Druid Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Druid Spellcasting",' +
      '"rank.Nature >= 4"',

  'Fighter Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"strengthModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"dexterityModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Fighter == 0"',
  'Basic Maneuver':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Fighter Dedication"',
  'Fighter Resiliency':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Fighter Dedication",' +
      '"classHitPoints <= 8"',
  'Opportunist':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Fighter Dedication"',
  'Advanced Maneuver':
    'Traits=Archetype Require="level >= 6","features.Basic Maneuver"',
  'Diverse Weapon Expert':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"maxWeaponTraining >= 2"',

  'Monk Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"strengthModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"dexterityModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Monk == 0"',
  'Basic Kata':
    'Traits=Archetype Require="level >= 4","feats.Monk Dedication"',
  'Monk Resiliency':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"feats.Monk Dedication",' +
      '"classHitPoints <= 8"',
  'Advanced Kata':
    'Traits=Archetype Require="level >= 6","feats.Basic Kata"',
  'Monk Moves':
    'Traits=Archetype Require="level >= 8","feats.Monk Dedication"',
  "Monk's Flurry":
    'Traits=Archetype Require="level >= 10","feats.Monk Dedication"',
  "Perfection's Path (Fortitude)":
    'Traits=Archetype Require="level >= 12","rank.Fortitude >= 2"',
  "Perfection's Path (Reflex)":
    'Traits=Archetype Require="level >= 12","rank.Fortitude >= 2"',
  "Perfection's Path (Will)":
    'Traits=Archetype Require="level >= 12","rank.Fortitude >= 2"',

  'Ranger Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"dexterityModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Ranger == 0"',
  "Basic Hunter's Trick":
    'Traits=Archetype Require="level >= 4","features.Ranger Dedication"',
  'Ranger Resiliency':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Ranger Dedication",' +
      '"classHitPoints <= 8"',
  "Advanced Hunter's Trick":
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Basic Hunter\'s Trick"',
  'Master Spotter':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Ranger Dedication",' +
      '"rank.Perception >= 2"',

  'Rogue Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"dexterityModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Rogue == 0"',
  'Basic Trickery':
    'Traits=Archetype Require="level >= 4","features.Rogue Dedication"',
  'Sneak Attacker':
    'Traits=Archetype Require="level >= 4","features.Rogue Dedication"',
  'Advanced Trickery':
    'Traits=Archetype Require="level >= 6","features.Basic Trickery"',
  'Skill Mastery':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Rogue Dedication",' +
      '"maxSkillRank >= 2"',
  'Uncanny Dodge':
    'Traits=Archetype Require="level >= 10","features.Rogue Dedication"',
  'Evasiveness':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Rogue Dedication",' +
      '"rank.Reflex >= 2"',

  'Sorcerer Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"charismaModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Sorcerer == 0"',
  'Basic Sorcerer Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Sorcerer Dedication"',
  'Basic Blood Potency':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Sorcerer Dedication"',
  'Basic Bloodline Spell':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Sorcerer Dedication"',
  'Advanced Blood Potency':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Basic Blood Potency"',
  'Bloodline Breadth':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Basic Sorcerer Spellcasting"',
  'Expert Sorcerer Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Sorcerer Spellcasting",' +
      '"rank.Arcana >= 3 || ' +
       'rank.Nature >= 3 || ' +
       'rank.Occultism >= 3 || ' +
       'rank.Religion >= 3"',
  'Master Sorcerer Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Master Sorcerer Spellcasting",' +
      '"rank.Arcana >= 4 || ' +
       'rank.Nature >= 4 || ' +
       'rank.Occultism >= 4 || ' +
       'rank.Religion >= 4"',

  'Wizard Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"intelligenceModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Wizard == 0"',
  'Arcane School Spell':
    'Traits=Archetype Require="level >= 4","features.Wizard Dedication"',
  'Basic Arcana':
    'Traits=Archetype Require="level >= 4","features.Wizard Dedication"',
  'Basic Wizard Spellcasting':
    'Traits=Archetype Require="level >= 4","features.Wizard Dedication"',
  'Advanced Arcana':
    'Traits=Archetype Require="level >= 6","features.Basic Arcana"',
  'Arcane Breadth':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Basic Wizard Spellcasting"',
  'Expert Wizard Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Wizard Spellcasting",' +
      '"rank.Arcana >= 3"',
  'Master Wizard Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Wizard Spellcasting",' +
      '"rank.Arcana >= 4"',

  // General
  'Additional Lore (%lore)':'Traits=General,Skill Require="rank.Lore >= 1"',
  'Adopted Ancestry (%ancestry)':'Traits=General',
  'Alchemical Crafting':'Traits=General,Skill Require="rank.Crafting >= 1"',
  'Ancestral Paragon':'Traits=General Require="level >= 3"',
  'Arcane Sense':'Traits=General,Skill Require="rank.Arcana >= 1"',
  'Armor Proficiency':'Traits=General',
  'Assurance (%skill)':
    'Traits=Fortune,General,Skill Require="rank.%skill >= 1"',
  'Automatic Knowledge (%skill)':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.%skill >= 2",' +
      '"features.Assurance (%skill)"',
  'Bargain Hunter':'Traits=General,Skill Require="rank.Diplomacy >= 1"',
  'Battle Cry':
    'Traits=General,Skill Require="level >= 7","rank.Intimidation >= 3"',
  'Battle Medicine':
    'Traits=General,Healing,Manipulate,Skill Require="rank.Medicine >= 1"',
  'Bizarre Magic':
    'Traits=General,Skill Require="level >= 7","rank.Occultism >= 3"',
  'Bonded Animal':
    'Traits=Downtime,General,Skill Require="level >= 2","rank.Nature >= 2"',
  'Breath Control':'Traits=General',
  'Canny Acumen (Fortitude)':'Traits=General',
  'Canny Acumen (Perception)':'Traits=General',
  'Canny Acumen (Reflex)':'Traits=General',
  'Canny Acumen (Will)':'Traits=General',
  'Cat Fall':'Traits=General,Skill Require="rank.Acrobatics >= 1"',
  'Charming Liar':'Traits=General,Skill Require="rank.Deception >= 1"',
  'Cloud Jump':
    'Traits=General,Skill Require="level >= 15","rank.Athletics >= 4"',
  'Combat Climber':'Traits=General,Skill Require="rank.Athletics >= 1"',
  'Confabulator':
    'Traits=General,Skill Require="level >= 2","rank.Deception >= 2"',
  // errata adds Uncommon trait
  'Connections':
    'Traits=Uncommon,General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Society >= 2",' +
      '"features.Courtly Graces"',
  'Continual Recovery':
    'Traits=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  'Courtly Graces':'Traits=General,Skill Require="rank.Society >= 1"',
  'Craft Anything':
    'Traits=General,Skill Require="level >= 15","rank.Crafting >= 4"',
  'Diehard':'Traits=General',
  'Divine Guidance':
    'Traits=General,Skill Require="level >= 15","rank.Religion >= 4"',
  'Dubious Knowledge':'Traits=General,Skill',
  'Expeditious Search':
    'Traits=General Require="level >= 7","rank.Perception >= 3"',
  'Experienced Professional':'Traits=General,Skill Require="rank.Lore >= 1"',
  'Experienced Smuggler':'Traits=General,Skill Require="rank.Stealth >= 1"',
  'Experienced Tracker':'Traits=General,Skill Require="rank.Survival >= 1"',
  'Fascinating Performance':
    'Traits=General,Skill Require="rank.Performance >= 1"',
  'Fast Recovery':'Traits=General Require="constitutionModifier >= 2"',
  'Feather Step':'Traits=General Require="dexterityModifier >= 2"',
  'Fleet':'Traits=General',
  'Foil Senses':
    'Traits=General,Skill Require="level >= 7","rank.Stealth >= 3"',
  'Forager':'Traits=General,Skill Require="rank.Survival >= 1"',
  'Glad-Hand':
    'Traits=General,Skill Require="level >= 2","rank.Diplomacy >= 2"',
  'Group Coercion':'Traits=General,Skill Require="rank.Intimidation >= 1"',
  'Group Impression':'Traits=General,Skill Require="rank.Diplomacy >= 1"',
  'Hefty Hauler':'Traits=General,Skill Require="rank.Athletics >= 1"',
  'Hobnobber':'Traits=General,Skill Require="rank.Diplomacy >= 1"',
  'Impeccable Crafting':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"rank.Crafting >= 3",' +
      '"features.Specialty Crafting"',
  'Impressive Performance':
    'Traits=General,Skill Require="rank.Performance >= 1"',
  'Incredible Initiative':'Traits=General',
  'Incredible Investiture':
    'Traits=General Require="level >= 11","charismaModifier >= 3"',
  'Intimidating Glare':'Traits=General,Skill Require="rank.Intimidation >= 1"',
  'Intimidating Prowess':
    'Traits=General,Skill ' +
    'Require="level >= 2","strengthModifier >= 3","rank.Intimidation >= 2"',
  'Inventor':
    'Traits=Downtime,General,Skill Require="level >= 7","rank.Crafting >= 3"',
  'Kip Up':'Traits=General,Skill Require="level >= 7","rank.Acrobatics >= 3"',
  'Lasting Coercion':
    'Traits=General,Skill Require="level >= 2","rank.Intimidation >= 2"',
  'Legendary Codebreaker':
    'Traits=General,Skill Require="level >= 15","rank.Society >= 4"',
  'Legendary Linguist':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Society >= 4",' +
      '"features.Multilingual"',
  'Legendary Medic':
    'Traits=General,Skill Require="level >= 15","rank.Medicine >= 4"',
  'Legendary Negotiation':
    'Traits=General,Skill Require="level >= 15","rank.Diplomacy >= 4"',
  'Legendary Performer':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Performance >= 4",' +
      '"features.Virtuosic Performer"',
  'Legendary Professional':
    'Traits=General,Skill Require="level >= 15","rank.Lore >= 4"',
  'Legendary Sneak':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Stealth >= 4",' +
      '"features.Swift Sneak"',
  'Legendary Survivalist':
    'Traits=General,Skill Require="level >= 15","rank.Survival >= 4"',
  'Legendary Thief':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 15",' +
      '"rank.Thievery >= 4",' +
      '"features.Pickpocket"',
  'Lengthy Diversion':'Traits=General,Skill Require="rank.Deception >= 1"',
  'Lie To Me':'Traits=General,Skill Require="rank.Deception >= 1"',
  'Magical Crafting':
    'Traits=General,Skill Require="level >= 2","rank.Crafting >= 2"',
  'Magical Shorthand':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Arcana >= 2 || ' +
       'rank.Nature >= 2 || ' +
       'rank.Occultism >= 2 || ' +
       'rank.Religion >= 2"',
  'Multilingual':'Traits=General,Skill Require="rank.Society >= 1"',
  'Natural Medicine':'Traits=General,Skill Require="rank.Nature >= 1"',
  'Nimble Crawl':
    'Traits=General,Skill Require="level >= 2","rank.Acrobatics >= 2"',
  'Oddity Identification':'Traits=General,Skill Require="rank.Occultism >= 1"',
  'Pickpocket':'Traits=General,Skill Require="rank.Thievery >= 1"',
  'Planar Survival':
    'Traits=General,Skill Require="level >= 7","rank.Survival >= 3"',
  'Powerful Leap':
    'Traits=General,Skill Require="level >= 2","rank.Athletics >= 2"',
  'Quick Climb':
    'Traits=General,Skill Require="level >= 7","rank.Athletics >= 3"',
  'Quick Coercion':'Traits=General,Skill Require="rank.Intimidation >= 1"',
  'Quick Disguise':
    'Traits=General,Skill Require="level >= 2","rank.Deception >= 2"',
  'Quick Identification':
    'Traits=General,Skill ' +
    'Require=' +
      '"rank.Arcana >= 1 || ' +
       'rank.Nature >= 1 || ' +
       'rank.Occultism >= 1 || ' +
       'rank.Religion >= 1"',
  'Quick Jump':'Traits=General,Skill Require="rank.Athletics >= 1"',
  'Quick Recognition':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"rank.Arcana >= 3 || ' +
       'rank.Nature >= 3 || ' +
       'rank.Occultism >= 3 || ' +
       'rank.Religion >= 3",' +
      '"features.Recognize Spell"',
  'Quick Repair':'Traits=General,Skill Require="rank.Crafting >= 1"',
  'Quick Squeeze':'Traits=General,Skill Require="rank.Acrobatics >= 1"',
  'Quick Swim':
    'Traits=General,Skill Require="level >= 7","rank.Athletics >= 3"',
  'Quick Unlock':
    'Traits=General,Skill Require="level >= 7","rank.Thievery >= 3"',
  'Quiet Allies':
    'Traits=General,Skill Require="level >= 2","rank.Stealth >= 2"',
  'Rapid Mantel':
    'Traits=General,Skill Require="level >= 2","rank.Athletics >= 2"',
  'Read Lips':'Traits=General,Skill Require="rank.Society >= 1"',
  'Recognize Spell':
    'Traits=General,Secret,Skill ' +
    'Require=' +
       '"rank.Arcana >= 1 || ' +
        'rank.Nature >= 1 || ' +
        'rank.Occultism >= 1 || ' +
        'rank.Religion >= 1"',
  'Ride':'Traits=General',
  'Robust Recovery':
    'Traits=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  // errata removes the Death trait
  'Scare To Death':
    'Traits=Emotion,Fear,General,Incapacitation,Skill ' +
    'Require="level >= 15","rank.Intimidation >= 4"',
  'Shameless Request':
    'Traits=General,Skill Require="level >= 7","rank.Diplomacy >= 3"',
  'Shield Block':'Traits=General',
  'Sign Language':'Traits=General,Skill Require="rank.Society >= 1"',
  'Skill Training (%skill)':
    'Traits=General,Skill Require="intelligenceModifier >= 1"',
  'Slippery Secrets':
    'Traits=General,Skill Require="level >= 7","rank.Deception >= 3"',
  'Snare Crafting':'Traits=General,Skill Require="rank.Crafting >= 1"',
  'Specialty Crafting':'Traits=General,Skill Require="rank.Crafting >= 1"',
  'Steady Balance':'Traits=General,Skill Require="rank.Acrobatics >= 1"',
  'Streetwise':'Traits=General,Skill Require="rank.Society >= 1"',
  'Student Of The Canon':'Traits=General,Skill Require="rank.Religion >= 1"',
  'Subtle Theft':'Traits=General,Skill Require="rank.Thievery >= 1"',
  'Survey Wildlife':'Traits=General,Skill Require="rank.Survival >= 1"',
  'Swift Sneak':
    'Traits=General,Skill Require="level >= 7","rank.Stealth >= 3"',
  'Terrain Expertise (%terrain)':
    'Traits=General,Skill Require="rank.Survival >= 1"',
  'Terrain Stalker (Rubble)':'Traits=General,Skill Require="rank.Stealth >= 1"',
  'Terrain Stalker (Snow)':'Traits=General,Skill Require="rank.Stealth >= 1"',
  'Terrain Stalker (Underbrush)':
    'Traits=General,Skill Require="rank.Stealth >= 1"',
  'Terrified Retreat':
    'Traits=General,Skill Require="level >= 7","rank.Intimidation >= 3"',
  'Titan Wrestler':'Traits=General,Skill Require="rank.Athletics >= 1"',
  'Toughness':'Traits=General',
  'Train Animal':
    'Traits=Downtime,General,Manipulate,Skill Require="rank.Nature >= 1"',
  'Trick Magic Item':
    'Traits=General,Manipulate,Skill ' +
    'Require=' +
      '"rank.Arcana >= 1 || ' +
       'rank.Nature >= 1 || ' +
       'rank.Occultism >= 1 || ' +
       'rank.Religion >= 1"',
  'Underwater Marauder':'Traits=General,Skill Require="rank.Athletics >= 1"',
  'Unified Theory':
    'Traits=General,Skill Require="level >= 15","rank.Arcana >= 4"',
  'Unmistakable Lore':
    'Traits=General,Skill Require="level >= 2","rank.Lore >= 2"',
  'Untrained Improvisation':'Traits=General Require="level >= 3"',
  'Virtuosic Performer':'Traits=General,Skill Require="rank.Performance >= 1"',
  'Wall Jump':
    'Traits=General,Skill Require="level >= 7","rank.Athletics >= 3"',
  'Ward Medic':
    'Traits=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  'Wary Disarmament':
    'Traits=General,Skill Require="level >= 2","rank.Thievery >= 2"',
  'Weapon Proficiency (Martial Weapons)':'Traits=General',
  'Weapon Proficiency (Simple Weapons)':'Traits=General',
  'Weapon Proficiency (%advancedWeapon)':'Traits=General'

};
Pathfinder2E.FEATURES = {

  // Ancestry
  'Ancestry Feats':'Section=feature Note="%V selections"',

  // Dwarf
  'Ancient-Blooded Dwarf':
    'Section=feature Note="Has the Call On Ancient Blood feature"',
  'Call On Ancient Blood':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Gives +1 vs. magic until the end of the turn"',
  'Darkvision':
    'Section=feature Note="Has normal b/w vision in darkness and dim light"',
  'Death Warden Dwarf':
    'Section=save ' +
    'Note="Successful saves vs. necromancy effects are critical successes"',
  'Dwarf Heritage':'Section=feature Note="1 selection"',
  'Forge Dwarf':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1} and treats environmental heat as 1 step less extreme"',
  'Rock Dwarf':
    'Section=combat ' +
    'Note="+2 DC vs. Shove, Trip, and magical knock prone, and reduces any forced move distance of 10\' or more by half"',
  'Strong-Blooded Dwarf':
    'Section=save ' +
    'Note=' +
      '"Has poison resistance %{level//2>?1} and reduces poison stage by 2 (virulent 1) with a successful save vs. poison, or by 3 (virulent 2) with a critical success"',

  'Dwarven Lore':
    'Section=skill Note="Skill Trained (Crafting; Religion; Dwarven Lore)"',
  'Dwarven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Battle Axe; Pick; Warhammer)/Weapon Familiarity (Dwarf Weapons)",' +
      '"Has access to uncommon dwarf weapons"',
  'Rock Runner':
    'Section=ability,skill ' +
    'Note=' +
      '"Moves normally over difficult terrain caused by stone or earth",' +
      '"Does not suffer flat-footed when using Acrobatics to Balance on stone and earth, and successes to do so are critical successes"',
  'Stonecunning':
    'Section=skill ' +
    'Note="+2 Perception to detect unusual stonework, and automatically attempts a %{features.Stonewalker&&rank.Perception>=4?\'+2\':\'-2\'} check to notice it"',
  'Unburdened Iron':
    'Section=ability,ability ' +
    'Note=' +
      '"Suffers no Speed penalty from armor",' +
      '"Reduces non-armor Speed penalties by 5\'"',
  'Vengeful Hatred':
    'Section=combat ' +
    'Note="Inflicts +1 HP per damage die vs. a choice of drow, dueregar, giants, or orcs and for 1 min vs. any foe that inflicts a critical success on an attack"',
  'Boulder Roll':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Step into a foe\'s square forces a 5\' move (<b>save Fortitude</b> vs. Athletics negates move but inflicts %{level+strengthModifier} HP bludgeoning; critical success negates without damage)"',
  'Dwarven Weapon Cunning':
    'Section=combat ' +
    'Note="Critical hits with a battle axe, pick, warhammer, or dwarf weapon inflict its critical specialization effect"',
  "Mountain's Stoutness":
    'Section=combat,combat ' +
    'Note=' +
      '"+%{level} Hit Points",' +
      '"-%{features.Toughness?4:1} dying recovery DC"',
  'Stonewalker':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows the Meld Into Stone divine innate spell; can cast it at 3rd level once per day",' +
      '"Can find unusual stonework and stonework traps that require legendary Perception"',
  'Dwarven Weapon Expertise':
    'Section=combat ' +
    'Note="Attack %V (Battle Axe; Pick; Warhammer; Dwarf Weapons)"',

  // Elf
  'Arctic Elf':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1} and treats environmental cold as 1 step less extreme"',
  'Cavern Elf':'Section=feature Note="Has the Darkvision feature"',
  'Elf Heritage':'Section=feature Note="1 selection"',
  'Low-Light Vision':'Section=feature Note="Has normal vision in dim light"',
  'Seer Elf':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows the Detect Magic arcane innate cantrip",' +
      '"+1 to Identify Magic and Decipher Writing of a magical nature"',
  'Whisper Elf':
    'Section=skill ' +
    'Note="Can use hearing to Seek in a 60\' cone and gains +2 within 30\' to locate creatures"',
  'Woodland Elf':
    'Section=combat,skill ' +
    'Note=' +
      '"Can always Take Cover within forest terrain",' +
      '"Can Climb foliage at %{speed//2}\', or %{speed}\' on a critical success"',

  'Ancestral Longevity':
    'Section=skill ' +
    'Note="Gains Trained proficiency in a choice of skill during daily prep"',
  'Elven Lore':
    'Section=skill Note="Skill Trained (Arcana; Nature; Elven Lore)"',
  'Elven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow)/Weapon Familiarity (Elf Weapons)",' +
      '"Has access to uncommon elf weapons"',
  'Forlorn':
    'Section=save ' +
    'Note="+1 vs. emotion effects, and successes vs. emotion effects are critical successes"',
  'Nimble Elf':'Section=ability Note="+5 Speed"',
  'Otherworldly Magic':
    'Section=magic ' +
    'Note="Can cast a chosen arcane cantrip as an innate spell at will"',
  'Unwavering Mien':
    'Section=save ' +
    'Note="Reduces the duration of mental effects lasting at least 2 rd by 1 rd/Saves vs. sleep effects gain +1 degree of success"',
  'Ageless Patience':
    'Section=skill ' +
    'Note="May spend double the time normally required on a Perception or skill check to gain a +2 bonus and to suffer a critical failure only on a roll of 10 lower than the DC"',
  'Elven Weapon Elegance':
    'Section=combat ' +
    'Note="Critical hits with a longbow, composite longbow, longsword, rapier, shortbow, composite shortbow, or elf weapon inflict its critical specialization effect"',
  'Elf Step':'Action=1 Section=combat Note="Steps twice"',
  'Expert Longevity':
    'Section=skill ' +
    'Note="Gains expert proficiency in a chosen trained skill during daily prep and may replace an existing skill increase with one chosen for Ancestral Longevity or Expert Longevity upon expiration"',
  'Universal Longevity':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Replaces the Ancestral Longevity %{$\'features.Expert Longevity\'?\'and Expert Longevity skills\':\'skill\'} once per day"',
  'Elven Weapon Expertise':
    'Section=combat ' +
    'Note="Attack %V (Longbow; Composite Longbow; Longsword; Rapier; Shortbow; Composite Shortbow; Elf Weapons)"',

  // Gnome
  'Chameleon Gnome':
    'Section=feature,skill ' +
    'Note=' +
      '"Can use a 1-hr process to change skin and hair colors",' +
      '"' + Pathfinder2E.ACTION_MARKS['1'] + ' Gains +2 Stealth until surroundings change"',
  'Fey-Touched Gnome':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the fey trait",' +
      '"Can cast a chosen primal cantrip as an innate spell at will; may spend 10 min to choose a different cantrip once per day"',
  'Gnome Heritage':'Section=feature Note="1 selection"',
  // Low-Light Vision as above
  'Sensate Gnome':
    'Section=skill ' +
    'Note="Has R30\' imprecise scent; can use it to gain +2 Perception to locate a creature"',
  'Umbral Gnome':'Section=feature Note="Has the Darkvision feature"',
  'Wellspring Gnome':'Section=feature Note="1 selection"',
  // TODO changes innate spell tradition from primal to chosen wellspring
  'Wellspring Gnome (Arcane)':
    'Section=magic ' +
    'Note="Can cast a chosen arcane cantrip as an innate spell at will"',
  'Wellspring Gnome (Divine)':
    'Section=magic ' +
    'Note="Can cast a chosen divine cantrip as an innate spell at will"',
  'Wellspring Gnome (Occult)':
    'Section=magic ' +
    'Note="Can cast a chosen occult cantrip as an innate spell at will"',

  'Animal Accomplice':'Section=feature Note="Has the Familiar feature"',
  'Burrow Elocutionist':'Section=skill Note="Can speak with burrowing animals"',
  'Familiar':'Section=feature Note="Has a Tiny animal minion"',
  'Fey Fellowship':
    'Section=save,skill ' +
    'Note=' +
      '"+2 vs. fey",' +
      '"+2 Perception (fey)/Can make a%{$\'features.Glad-Hand\'?\'\':\' -5\'} Diplomacy check to Make An Impression upon meeting fey and retry a failure after 1 min of conversation"',
  'First World Magic':
    'Section=magic ' +
    'Note="Can cast a chosen primal cantrip as an innate spell at will"',
  'Gnome Obsession':
    'Section=skill ' +
    // NOTE: would like to replace "background Lore skill" with the actual
    // skill, but backgrounds that allow a choice of skills make this difficult
    'Note="Skill %V (Choose 1 from any Lore; background Lore skill)"',
  'Gnome Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Glaive; Kukri)/Weapon Familiarity (Gnome Weapons)",' +
      // Errata added kukris
      '"Has access to kukris and uncommon gnome weapons"',
  'Illusion Sense':
    'Section=save,skill ' +
    'Note=' +
      '"+1 Will vs. illusions/R10\' Automatically attempts to disbelieve illusions",' +
      '"+1 Perception (illusions)"',
  'Animal Elocutionist':
    'Section=magic,skill ' +
    'Note=' +
      '"Can speak with all animals",' +
      '"+1 to Make An Impression on animals"',
  'Energized Font':
    'Action=1 Section=magic Note="Regains 1 Focus Point once per day"',
  'Gnome Weapon Innovator':
    'Section=combat ' +
    'Note="Critical hits with a glaive, kukri, or gnome weapon inflict its critical specialization effect"',
  'First World Adept':
    'Section=magic ' +
     'Note="Knows the Faerie Fire and Invisibility primal spells; can cast each once per day"',
  'Vivacious Conduit':
    'Section=combat ' +
    'Note="10 min rest restores %{constitutionModifier*(level/2)//1} HP"',
  'Gnome Weapon Expertise':
    'Section=combat ' +
    'Note="Attack %V (Glaive; Kukri; Gnome Weapons)"',

  // Goblin
  // Darkvision as above
  'Charhide Goblin':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1} and ends persistent fire damage with success on a DC 10 flat check, or on a DC 5 flat check with help"',
  'Goblin Heritage':'Section=feature Note="1 selection"',
  'Irongut Goblin':
    'Section=feature,save ' +
    'Note=' +
      '"May safely eat garbage and when sickened",' +
      '"+2 vs. conditions inflicted by ingestion, and successes on Fortitude saves vs. ingestion conditions are critical successes"',
  'Razortooth Goblin':
    'Section=combat Note="Jaws attack inflicts 1d6 HP piercing"',
  'Snow Goblin':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1} and treats environmental cold as 1 step less extreme"',
  'Unbreakable Goblin':
    'Section=combat,save ' +
    'Note=' +
      '"+4 Hit Points",' +
      '"Reduces falling damage by half the distance"',

  'Burn It!':
    'Section=combat,magic ' +
    'Note=' +
      '"Persistent fire damage from an attack inflicts +1 HP, and alchemical fire items inflict additional damage equal to 1/4 the item level",' +
      '"Fire spells inflict additional damage equal to half the spell level"',
  'City Scavenger':
    'Section=skill ' +
    'Note="+%{1+($\'features.Irongut Goblin\'?1:0)} Subsist checks/Can attempt +%{1+($\'features.Irongut Goblin\'?1:0)} Society or Survival checks to Earn Income from using Subsist in a settlement"',
  'Goblin Lore':
    'Section=skill Note="Skill Trained (Nature; Stealth; Goblin Lore)"',
  'Goblin Scuttle':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Takes a Step%{$\'features.Skittering Scuttle\'?\' or a \'+(speed//2)+\\"\' Stride\\":\'\'} when an ally moves to an adjacent position"',
  'Goblin Song':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R%{combatNotes.loudSinger?60:30}\' Successful Performance vs. the Will DC of %{(rank.Performance<2?1:rank.Performance<3?2:rank.Performance<4?4:8)+(combatNotes.loudSinger?1:0)} target%{rank.Performance<2&&!combatNotes.loudSinger?\'\':\'s\'} inflicts -1 Perception and Will for 1 rd, or for 1 min on a critical success"',
  'Goblin Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Dogslicer; Horsechopper)/Weapon Familiarity (Goblin Weapons)",' +
      '"Has access to uncommon goblin weapons"',
  'Junk Tinker':
    'Section=skill ' +
    'Note="Can use Crafting on junk to create shoddy level 0 items and suffers no penalty when using them"',
  'Rough Rider':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Ride feature",' +
      '"+1 Nature to Command An Animal with a goblin dog or wolf mount"',
  'Very Sneaky':'Section=skill Note="+5\' Sneak and can Sneak between cover"',
  'Goblin Weapon Frenzy':
    'Section=combat ' +
    'Note="Critical hits with a goblin weapon inflict its critical specialization effect"',
  'Cave Climber':'Section=ability Note="Has a 10\' climb Speed"',
  'Skittering Scuttle':
    'Section=combat Note="Has increased Goblin Scuttle effects"',
  'Goblin Weapon Expertise':
    'Section=combat ' +
    'Note="Attack %V (Dogslicer; Horsechopper; Goblin Weapons)"',
  'Very, Very Sneaky':
    'Section=skill ' +
    'Note="Can Sneak at full Speed and Hide or Sneak without cover"',

  // Halfling
  'Gutsy Halfling':
    'Section=save Note="Successful saves vs. emotion are critical successes"',
  'Halfling Heritage':'Section=feature Note="1 selection"',
  'Hillock Halfling':
    'Section=combat ' +
    'Note="Regains +%{level} Hit Points from treatment and overnight rest"',
  'Keen Eyes':
    'Section=combat,skill ' +
    'Note=' +
      '"Reduces the flat check DC to target a concealed or hidden foe to 3 or 9",' +
      '"R30\' +2 Seek to find hidden creatures"',
  'Nomadic Halfling':'Section=skill Note="+%V Language Count"',
  'Twilight Halfling':'Section=feature Note="Has the Low-Light Vision feature"',
  'Wildwood Halfling':
    'Section=ability ' +
    'Note="Moves normally over difficult terrain caused by plants and fungi"',

  'Distracting Shadows':
    'Section=skill Note="Can use larger creatures as cover for Hide and Sneak"',
  'Halfling Lore':
    'Section=skill Note="Skill Trained (Acrobatics; Stealth; Halfling Lore)"',
  'Halfling Luck':
    'Action=Free ' +
    'Section=feature ' +
    'Note="Rerolls a failed skill check or save once per day"',
  'Halfling Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Sling; Halfling Sling Staff; Shortsword)/Weapon Familiarity (Halfling Weapons)",' +
      '"Has access to uncommon halfling weapons"',
  'Sure Feet':
    'Section=skill ' +
    'Note="Successes on Acrobatics to Balance and Athletics to Climb are critical successes/Does not suffer flat-footed during Balance or Climb"',
  'Titan Slinger':
    'Section=combat ' +
    'Note="Slings inflict +1 damage die step vs. Large and larger targets"',
  'Unfettered Halfling':
    'Section=combat ' +
    'Note="Successes to Escape and vs. grabbed or restrained are critical successes/Foe Grapple fails are critical fails/Foe Grab requires a successful Athletics check"',
  'Watchful Halfling':
    'Section=combat,skill ' +
    'Note=' +
      '"Can use Aid to help another overcome enchantment or possession",' +
      '"+2 Sense Motive to notice enchantment or possession, and automatically attempts a -2 check to notice these"',
  'Cultural Adaptability (%ancestry)':
    'Section=feature ' +
    'Note="+1 Ancestry Feat (%ancestry ancestry feat)/Has the Adopted Ancestry (%ancestry) feature"',
  'Halfling Weapon Trickster':
    'Section=combat ' +
    'Note="Critical hits with a shortsword, sling, or halfling weapon inflict its critical specialization effect"',
  'Guiding Luck':
    'Action=Free ' +
    'Section=feature ' +
    'Note="Rerolls a failed Perception check or attack roll once per day"',
  'Irrepressible':
    'Section=save ' +
    'Note=' +
      '"Successful saves vs. emotion are critical successes%{$\'features.Gutsy Halfling\'?\', and critical failures vs. emotion are normal failures\':\'\'}"',
  'Ceaseless Shadows':
    'Section=combat ' +
    'Note="Can use Hide and Sneak without cover and gains 1 degree better cover from larger creatures"',
  'Halfling Weapon Expertise':
    'Section=combat ' +
    'Note="Attack %V (Sling; Halfling Sling Staff; Shortsword; Halfling Weapons)"',

  // Human
  'Half-Elf':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Low-Light Vision feature",' +
      '"Has the elf trait and may take elf and half-elf feats"',
  'Half-Orc':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Low-Light Vision feature",' +
      '"Has the orc trait and may take orc and half-orc feats"',
  'Human Heritage':'Section=feature Note="1 selection"',
  'Skilled Heritage Human':'Section=skill Note="Skill %V (Choose 1 from any)"',
  'Versatile Heritage Human':'Section=feature Note="+1 General Feat"',

  'Adapted Cantrip':
    'Section=magic Note="Knows a cantrip from a second tradition"',
  'Cooperative Nature':'Section=skill Note="+4 Aid checks"',
  'General Training':
    'Section=feature Note="+%{$\'feats.General Training\'} General Feat"',
  'Haughty Obstinacy':
    'Section=save ' +
    'Note="Successful saves vs. mental effects that control actions are critical successes, and foe Intimidation fails to Coerce are critical fails"',
  'Natural Ambition':'Section=feature Note="+1 Class Feat"',
  'Natural Skill':'Section=skill Note="Skill Trained (Choose 2 from any)"',
  'Unconventional Weaponry (%weapon)':
    'Section=combat Note="Weapon Familiarity (%weapon)"',
  'Adaptive Adept':
    'Section=magic ' +
    'Note="Knows a cantrip or level 1 spell from a second tradition"',
  'Clever Improviser':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Untrained Improvisation feature",' +
      '"May attempt any skill untrained"',
  'Cooperative Soul':
    'Section=skill ' +
    'Note="Failures and critical failures to Aid with expert skills are successes"',
  'Incredible Improvisation':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Gives +4 on an untrained skill check once per day"',
  'Multitalented':'Section=combat Note="+1 Class Feat (multiclass dedication)"',
  'Unconventional Expertise (%weapon)':
    'Section=combat Note="Attack %V (%weapon)"',

  'Elf Atavism':'Section=feature Note="Has an elven heritage"',
  'Inspire Imitation':
    'Section=skill ' +
    'Note="Can immediately Aid an ally on a skill check after a critical success on the same skill"',
  'Supernatural Charm':
    'Section=magic ' +
    'Note="Knows the Charm arcane innate spell; can cast it at 1st level once per day"',

  'Monstrous Peacemaker':
    'Section=skill ' +
    'Note="+1 Diplomacy and Sense Motive with non-humanoids and creatures marginalized by human society"',
  'Orc Ferocity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Retains 1 Hit Point and increases the wounded condition by 1 when brought to 0 Hit Points once per %{combatNotes.incredibleFerocity?\'hr\':\'day\'}"',
  'Orc Sight':'Section=feature Note="Has the Darkvision feature"',
  'Orc Superstition':
    'Action=Reaction Section=save Note="+1 vs. the triggering magic effect"',
  'Orc Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Trained (Falchion; Greataxe)/Weapon Familiarity (Orc Weapons)",' +
      '"Has access to uncommon orc weapons"',
  'Orc Weapon Carnage':
    'Section=combat ' +
    'Note="Critical hits with a falchion, greataxe, or orc weapon inflict its critical specialization effect"',
  'Victorious Vigor':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Reducing a foe to 0 Hit Points gives self %{constitutionModifier} temporary Hit Point%{constitutionModifier>1?\'s\':\'\'} until the end of the next turn"',
  'Pervasive Superstition':'Section=save Note="+1 vs. magic"',
  'Incredible Ferocity':
    'Section=combat Note="Has increased Orc Ferocity effects"',
  'Orc Weapon Expertise':
    'Section=combat ' +
    'Note="Attack %V (Falchion; Greataxe; Orc Weapons)"',

  // Backgrounds
  'Martial Focus':'Section=feature Note="1 selection"',
  'Scholarly Tradition':'Section=feature Note="1 selection"',

  // Class Features and Feats

  'Ability Boosts':'Section=ability Note="Ability Boost (Choose %V from any)"',
  'General Feats':'Section=feature Note="%V selections"',
  'Skill Feats':'Section=feature Note="%V selections"',
  'Skill Increases':'Section=skill Note="Skill Increase (Choose %V from any)"',

  // Alchemist
  // TODO recheck Alchemist feature texts
  'Advanced Alchemy':
    'Section=skill ' +
    'Note="Can use a batch of infused reagents to create 2 infused alchemical items of up to level %{level} without a Crafting check during daily prep"',
  'Alchemical Alacrity':
    'Section=skill Note="Has increased Quick Alchemy effects"',
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
    'Section=combat,skill ' +
    'Note=' +
      '"Can direct a bomb splash onto a single target",' +
      '"Knows the formulas for 2 common 1st-level bombs"',
  'Chirurgeon':
    'Section=skill,skill ' +
    'Note=' +
      '"Knows the formulas for 2 common 1st-level healing elixirs",' +
      '"Can use Crafting in place of Medicine"',
  'Double Brew':'Section=skill Note="Has increased Quick Alchemy effects"',
  'Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Reflex)",' +
      '"Successes on Reflex saves are critical successes"',
  'Field Discovery':
    'Section=combat ' +
    'Note="Can use 1 batch of infused reagents create 3 items from research field"',
  'Formula Book':
    'Section=skill ' +
    'Note="Has a book that contains at least %V alchemical formulas"',
  'Greater Field Discovery (Bomber)':
    'Section=combat ' +
    'Note="Can increase bomb splash radius to %{$\'features.Expanded Splash\'?15:10}\'"',
  'Greater Field Discovery (Chirurgeon)':
    'Section=combat ' +
    'Note="Created elixirs restore the maximum number of Hit Points"',
  'Greater Field Discovery (Mutagenist)':
    'Section=skill Note="Can use 2 polymorphic mutagens simultaneously"',
  'Infused Reagents':
    'Section=skill ' +
    'Note="Can create %{level+(levels.Alchemist?intelligenceModifier:0)} batches of infused reagents during daily prep"',
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
    'Note="Regains the effects of a mutagen consumed earlier in the day for 1 min once per day"',
  'Mutagenist':
    // Errata changes second paragraph to Mutagenic Flashback
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Mutagenic Flashback feature",' +
      '"Knows the formulas for 2 common 1st-level mutagens"',
  'Perpetual Infusions':
    'Section=skill ' +
    'Note="Can create 2 alchemical items of up to level %V from research field without using infused reagents"',
  'Perpetual Perfection':
    'Section=skill Note="Has increased Perpetual Infusions effects"',
  'Perpetual Potency':
    'Section=skill Note="Has increased Perpetual Infusions effects"',
  'Powerful Alchemy':
    'Section=combat ' +
    'Note="Increases the DC for infused alchemical items created with Quick Alchemy to %{classDifficultyClass.Alchemist}"',
  'Quick Alchemy':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses batches of infused reagents to create %V consumable alchemical %{skillNotes.quickAlchemy==1?\'item\':\'items\'} of up to level %{advancedAlchemyLevel} that %{skillNotes.quickAlchemy==1?\'lasts\':\'last\'} until the %{skillNotes.enduringAlchemy?\'end\':\'start\'} of the next turn"',
  'Research Field':'Section=feature Note="1 selection"',
  'Weapon Specialization':
    'Section=combat ' +
    'Note="Inflicts +%V, +%{combatNotes.weaponSpecialization*1.5}, or +%{combatNotes.weaponSpecialization*2} HP damage when using a weapon with expert, master, or legendary proficiency"',

  'Alchemical Familiar':'Section=feature Note="Has the Familiar feature"',
  'Alchemical Savant':
    'Section=skill ' +
    'Note="Can use Crafting to Identify Alchemy on a held item in 1 action; for known formulas, gains +2 on the check and critical failures are normal failures"',
  'Far Lobber':'Section=combat Note="Thrown bombs have a 30\' range"',
  'Quick Bomber':
    'Action=1 Section=combat Note="Draws a bomb and Strikes with it"',
  'Poison Resistance':
    'Section=save ' +
    'Note="Has poison resistance %{level//2} and +1 saves vs. poison"',
  'Revivifying Mutagen':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ends the effects of a mutagen to regain 1d6 Hit Points per 2 levels of the mutagen"',
  'Smoke Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Modifies a bomb of up to level %{level-1} to also create smoke in a 10\'-radius burst for 1 min once per rd"',
  'Calculated Splash':
    'Section=combat ' +
    'Note="Can throw a bomb to inflict %{intelligenceModifier} HP splash damage"',
  'Efficient Alchemy':
    'Section=skill ' +
    'Note="Can produce twice the usual number of alchemical items during downtime"',
  'Enduring Alchemy':'Section=skill Note="Has increased Quick Alchemy effects"',
  'Combine Elixirs':
    'Action=Free ' +
    'Section=skill ' +
    'Note="Uses 2 additional batches of reagents to create a single elixir that has the effects of 2 elixirs of up to level %{advancedAlchemyLevel-2} once per rd"',
  'Debilitating Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Modifies a bomb of up to level %{advancedAlchemyLevel-2} to also inflict %{combatNotes.trueDebilitatingBomb?\'clumsy 1, stupefied 2, enfeebled 2, \':combatNotes.greaterDebilitatingBomb?\'clumsy 1, enfeebled 1, stupefied 1, \':\'\'}dazzled, deafened, flat-footed, or -%{combatNotes.trueDebilitatingBomb?15:combatNotes.greaterDebilitatingBomb?10:5} Speed (<b>save Fortitude</b> negates) until the start of the next turn once per rd"',
  'Directional Bombs':
    'Section=combat ' +
    'Note="Can restrict bomb splash effects to a 15\' cone in the direction thrown"',
  'Feral Mutagen':
    'Section=combat,skill ' +
    'Note=' +
      '"Consuming a bestial mutagen gives claws and jaws the deadly d10 trait and allows increasing the Armor Class penalty to -2 to increase claws and jaws damage by 1 die step",' +
      '"Consuming a bestial mutagen adds the item bonus to Intimidation checks"',
  'Sticky Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Modifies a bomb of up to level %{advancedAlchemyLevel-2} to inflict persistent damage equal to the splash damage once per rd"',
  'Elastic Mutagen':
    'Section=skill ' +
    'Note="Consuming a quicksilver mutagen allows 10\' Steps and moving through tight spaces as a creature 1 size smaller"',
  'Expanded Splash':
    'Section=combat ' +
    'Note="Can throw bombs to inflict +%{intelligenceModifier} HP splash damage in a 10\' radius"',
  'Greater Debilitating Bomb':
    'Section=combat Note="Has increased Debilitating Bomb effects"',
  'Merciful Elixir':
    'Action=Free ' +
    'Section=skill ' +
    // Errata adds the counteract modifier
    'Note="Creates an elixir of life of up to level %{advancedAlchemyLevel-2} that also allows a +%{classDifficultyClass.Alchemist-10} counteract attempt on a fear or paralyzing effect once per rd"',
  'Potent Poisoner':
    'Section=skill ' +
    'Note="+4 crafted poison DCs, up to DC %{classDifficultyClass.Alchemist}"',
  'Extend Elixir':
    'Section=skill ' +
    'Note="Doubles the duration of elixirs that last at least 1 min"',
  'Invincible Mutagen':
    'Section=combat ' +
    'Note="Consuming a juggernaut elixir gives resistance %{intelligenceModifier>?0} to all physical damage"',
  'Uncanny Bombs':
    'Section=combat,combat ' +
    'Note=' +
      '"Thrown bombs have a 60\' range",' +
      '"Thrown bombs reduce target cover Armor Class bonus by 1 and succeed automatically on the flat check to target a concealed creature"',
  'Glib Mutagen':
    'Section=skill ' +
    'Note="Consuming a silvertongue mutagen negates Deception, Diplomacy, Intimidation, and Performance circumstance penalties and linguistic barriers"',
  'Greater Merciful Elixir':
    'Section=skill ' +
    'Note="Can use Merciful Elixir to attempt to counteract a blinded, deafened, sickened, or slowed condition"',
  'True Debilitating Bomb':
    'Section=combat Note="Has increased Debilitating Bomb effects"',
  'Eternal Elixir':
    'Section=skill ' +
    'Note="Can indefinitely extend the duration of 1 elixir of up to level %{level//2} that lasts at least 1 min"',
  'Exploitive Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Modifies a bomb of up to level %{advancedAlchemyLevel-2} to negate resistance %{level} once per rd"',
  'Genius Mutagen':
    'Section=skill ' +
    'Note="Consuming a cognitive mutagen adds its bonus to Deception, Diplomacy, Intimidation, Medicine, Nature, Performance, Religion, and Survival checks and allows R60\' telepathic communication"',
  'Persistent Mutagen':
    'Section=skill ' +
    'Note="Can extend the duration of a mutagen until next daily prep once per day"',
  'Improbable Elixirs':
    'Section=skill ' +
    'Note="Can create elixirs that replicate the effects of %{intelligenceModifier>?1} potion%{intelligenceModifier>1?\'s\':\'\'} of up to level 9"',
  'Mindblank Mutagen':
    'Section=save ' +
    'Note="Consuming a serene mutagen gives immunity to detection, revelation, and scrying up to level 9"',
  'Miracle Worker':
    'Section=combat ' +
    'Note="Can administer a true elixir of life that restores life with 1 HP and wounded 1 to a creature dead for up to 2 rd once per 10 min"',
  'Perfect Debilitation':
    'Section=combat ' +
    'Note="Debilitating Bombs require a critical success to avoid effects"',
  "Craft Philosopher's Stone":
    'Section=skill ' +
    'Note="Knows the formula for creating a philosopher\'s stone"',
  'Mega Bomb':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Modifies a thrown bomb of up to level %{advancedAlchemyLevel-3} to affect all creatures in a 30\' radius within 60\' (<b>save basic Reflex</b>)"',
  'Perfect Mutagen':
    'Section=skill Note="Suffers no drawbacks from consuming mutagens"',

  // Barbarian
  'Armor Of Fury':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Unarmored Defense)"',
  'Barbarian Feats':'Section=feature Note="%V selections"',
  'Barbarian Skills':
    'Section=skill Note="Skill Trained (Athletics; Choose %V from any)"',
  'Bestial Rage (Ape)':
    'Section=combat ' +
    'Note="Can use fists to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP bludgeoning during rage"',
  'Bestial Rage (Bear)':
    'Section=combat ' +
    'Note="Can use jaws and claws to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing and 1d%{combatNotes.greaterWeaponSpecialization?\'8+12\':combatNotes.specializationAbility?\'8+5\':\'6+2\'} HP slashing during rage"',
  'Bestial Rage (Bull)':
    'Section=combat ' +
    'Note="Can use horns to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing during rage"',
  'Bestial Rage (Cat)':
    'Section=combat ' +
    'Note="Can use jaws and claws to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing and 1d%{combatNotes.greaterWeaponSpecialization?\'8+12\':combatNotes.specializationAbility?\'8+5\':\'6+2\'} HP slashing during rage"',
  'Bestial Rage (Deer)':
    'Section=combat ' +
    // Errata changes damage to 1d10
    'Note="Can use antlers to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing%{combatNotes.specializationAbility?\\" with a 10\' reach\\":\'\'} during rage"',
  'Bestial Rage (Frog)':
    'Section=combat ' +
    'Note="Can use jaws and tongue to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP bludgeoning and 1d%{combatNotes.greaterWeaponSpecialization?\'6+12\':combatNotes.specializationAbility?\'6+5\':\'4+2\'} HP bludgeoning%{combatNotes.specializationAbility?\\" with a 10\' reach\\":\'\'} during rage"',
  'Bestial Rage (Shark)':
    'Section=combat ' +
    'Note="Can use jaws to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing during rage"',
  'Bestial Rage (Snake)':
    'Section=combat ' +
    'Note="Can use fangs to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing during rage"',
  'Bestial Rage (Wolf)':
    'Section=combat ' +
    'Note="Can use jaws to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing during rage"',
  'Brutality':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"Critical hits with a melee weapon or unarmed attack inflict its critical specialization effect during rage"',
  'Deny Advantage':
    'Section=combat ' +
    'Note="Does not suffer flat-footed vs. hidden, undetected, flanking, or surprising foes of equal or lower level"',
  'Devastator':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Master (Barbarian)",' +
      '"Successful melee Strikes ignore resistance 10 to physical damage"',
  'Draconic Rage':
    'Section=combat ' +
    'Note="Can inflict +%{combatNotes.greaterWeaponSpecialization?16:combatNotes.specializationAbility?8:4} HP %V damage instead of +%{combatNotes.rage} HP weapon damage during rage"',
  'Fury Instinct':
    'Section=combat,feature ' +
    'Note=' +
      '"Increases added rage damage to %V",' +
      '"+1 Class Feat"',
  'Greater Juggernaut':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Fortitude)",' +
      '"Critical failures on Fortitude saves are normal failures, and failed Fortitude saves inflict half damage"',
  'Greater Weapon Specialization':
    'Section=combat Note="Has increased Weapon Specialization effects"',
  'Heightened Senses':'Section=skill Note="Perception Master"',
  'Indomitable Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Instinct':'Section=feature Note="1 selection/Has the Anathema feature"',
  // Juggernaut as above
  'Lightning Reflexes':'Section=save Note="Save Expert (Reflex)"',
  // Medium Armor Expertise as above
  'Mighty Rage':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Expert (Barbarian)",' +
      '"' + Pathfinder2E.ACTION_MARKS.Free + ' Immediately uses a 1-action rage action when starting to rage; using 2 actions to enter rage allows using a 2-action rage action"',
  'Quick Rage':'Section=combat Note="Has increased Rage effects"',
  'Rage':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gains %{level+constitutionModifier} temporary Hit Points and +%V HP melee damage, or +%{combatNotes.rage//2} HP with an agile weapon, and suffers -1 Armor Class and loss of concentration actions for 1 min; requires 1 %{combatNotes.quickRage?\'turn\':\'min\'} between rages"',
  'Raging Resistance (Animal)':
    'Section=save ' +
    'Note="Has resistance %{3+constitutionModifier} to piercing and slashing during rage"',
  'Raging Resistance (Dragon)':
    'Section=save ' +
    'Note="Has resistance %{3+constitutionModifier} to piercing and %{combatNotes.draconicRage||\'fire\'} during rage"',
  'Raging Resistance (Fury)':
    'Section=save ' +
    'Note="Has resistance %{3+constitutionModifier} to physical weapon damage during rage"',
  'Raging Resistance (Giant)':
    'Section=save ' +
    'Note="Has resistance %{3+constitutionModifier} to bludgeoning and a choice of cold, electricity, or fire during rage"',
  'Raging Resistance (Spirit)':
    'Section=save ' +
    'Note="Has resistance %{3+constitutionModifier} to negative and undead during rage"',
  'Specialization Ability':
    'Section=combat Note="Has increased instinct ability rage effects"',
  'Spirit Rage':
    'Section=combat ' +
    'Note="May inflict +%{combatNotes.greaterWeaponSpecialization?13:combatNotes.specializationAbility?7:3} HP positive or negative damage, along with <i>ghost touch</i>, instead of +%{combatNotes.rage} HP weapon damage during rage"',
  'Titan Mauler':
    'Section=combat ' +
    'Note="Can use weapons made for a larger creature, suffering clumsy 1 and gaining +%{combatNotes.greaterWeaponSpecialization?18:combatNotes.specializationAbility?10:6} HP weapon damage, instead of gaining +%{combatNotes.rage} HP weapon damage during rage"',
  'Weapon Fury':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  // Weapon Specialization as above

  'Acute Vision':
    'Section=feature Note="Has the Darkvision feature during rage"',
  'Moment Of Clarity':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Allows using concentration actions for the remainder of the turn during rage"',
  'Raging Intimidation':
    'Section=combat,feature,feature ' +
    'Note=' +
      '"Can use Demoralize and Scare To Death during rage",' +
      '"Has the Intimidating Glare feature",' +
      '"Has the Scare To Death feature"',
  'Raging Thrower':
    'Section=combat ' +
    'Note="Thrown weapons inflict +%{combatNotes.rage} HP and can apply Brutal Critical and Devastator effects during rage"',
  'Sudden Charge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike after 2 Strides"',
  'Acute Scent':'Section=skill Note="Has R30\' imprecise scent during rage"',
  'Furious Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike inflicts additional damage equal to the number of rounds remaining in rage, ending rage and causing fatigue until 10 min rest"',
  'No Escape':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Stride keeps pace with a retreating foe during rage"',
  'Second Wind':
    'Section=combat ' +
    'Note="Can rage again immediately after ending rage, suffering fatigue afterwards until 10 min rest"',
  'Shake It Off':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Reduces a frightened condition by 1 and a sickened condition by 1, 2, or 3 with a fail, success, or critical success on a Fortitude save during rage"',
  'Fast Movement':'Section=combat Note="Gains +10 Speed during rage"',
  'Raging Athlete':
    'Section=skill ' +
    // Errata changes the jump distance
    'Note="Has a %{speed}\' climb and swim Speed, -10 jump DC, and 5\' and %{speed>=30?20:15}\' vertical and horizontal Leaps during rage"',
  'Swipe':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Melee Strike attacks 2 adjacent foes"',
  'Wounded Rage':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Enters rage upon suffering the triggering damage"',
  'Animal Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Unarmored Defense)",' +
      '"+%{($\'features.Greater Juggernaut\'?3:2)-(dexterityModifier-3>?0)} Armor Class in no armor during rage"',
  'Attack Of Opportunity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike on a foe within reach that uses a manipulate or move action, makes a ranged Strike, or leaves a square while moving"',
  'Brutal Bully':
    'Section=combat ' +
    'Note="A successful Disarm, Grapple, Shove, or Trip inflicts %{strengthModifier} HP bludgeoning during rage"',
  'Cleave':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike on an adjacent foe after killing a foe or knocking one unconscious during rage"',
  "Dragon's Rage Breath":
    'Action=2 ' +
    'Section=combat ' +
    'Note="Breath inflicts %{level}d6 HP %{combatNotes.draconicRage} in a 30\' cone or 60\' line once per rage (<b>save basic Reflex</b>; half distance and damage for a 2nd use within 1 hr)"',
  "Giant's Stature":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Increases size to Large, giving +5\' reach and clumsy 1, until rage ends"',
  "Spirits' Interference":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Imposes a DC 5 flat check on foe ranged Strikes vs. self until rage ends"',
  'Animal Rage':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Transforms self into instinct animal during rage for 1 min or until dismissed"',
  'Furious Bully':'Section=combat Note="+2 Athletics for attacks during rage"',
  'Renewed Vigor':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gains %{level//2+constitutionModifier} temporary Hit Points during rage"',
  'Share Rage':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Gives an ally the effects of Rage once per rage"',
  // Errata adds the 2-action icon
  'Sudden Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike while Leaping, High Jumping, or Long Jumping up to %{speed*2}\'"',
  'Thrash':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Inflicts %{combatNotes.rage+strengthModifier} HP bludgeoning plus specialization damage on a grabbed foe (<b>save basic Fortitude</b>) during rage"',
  'Come And Get Me':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Suffers flat-footed and +2 HP foe damage until rage ends; successful attackers suffer flat-footed until the end of the next turn, and a successful Strike on an attacker during that time gives self %{constitutionModifier} temporary Hit Points, or %{constitutionModifier*2} temporary Hit Points on a critical success, until the rage ends"',
  'Furious Sprint':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strides %{speed*5}\' in a straight line, or %{speed*8}\' by using 3 actions, during rage"',
  'Great Cleave':
    'Section=combat ' +
    'Note="Can continue to use Cleave on adjacent foes for as long as Strikes incapacitate"',
  'Knockback':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Shoves a foe 5\' after a successful Strike during rage"',
  'Terrifying Howl':
    'Action=1 ' +
    'Section=combat ' +
    // Errata corrects "each creature" to "each enemy"
    'Note="Successful Intimidate checks Demoralize each foe in a 30\' radius once per target per min during rage"',
  "Dragon's Rage Wings":
    'Action=1 Section=combat Note="Gains a %{speed}\' fly Speed during rage"',
  'Furious Grab':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Grapples a foe after a successful Strike during rage"',
  "Predator's Pounce":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strikes after a Stride in light or no armor during rage"',
  "Spirit's Wrath":
    'Action=1 ' +
    'Section=combat ' +
    'Note="R120\' +%{$\'trainingLevel.Martial Weapons\'*2+level+strengthModifier+2} spirit Strike during rage inflicts 4d8+%{constitutionModifier} HP negative or positive; a critical hit also inflicts frightened 1"',
  "Titan's Stature":
    'Section=combat ' +
    'Note="Giant\'s Stature can increase size to Huge, giving +10\' reach and clumsy 1, until rage ends"',
  'Awesome Blow':
    'Section=combat ' +
    'Note="Can attempt an Athletics vs. Fortitude check after using Knockback; success or critical success inflicts the success or critical success effects of Shove and Trip"',
  "Giant's Lunge":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Extends reach of melee weapons and unarmed attacks to 10\' until rage ends"',
  'Vengeful Strike':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="While using Come And Get Me, responds to a successful foe attack with an immediate Strike"',
  'Whirlwind Strike':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Makes individual Strikes at the current multiple attack penalty against all foes within reach"',
  'Collateral Thrash':
    'Section=combat ' +
    'Note="Thrash damages a second adjacent foe (<b>save basic Reflex</b>)"',
  'Dragon Transformation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Transforms into a Large dragon, as with 6th-level <i>Dragon Form</i>,%{level>=18?\' with +20 fly Speed, +12 dragon Strikes, and +14 HP breath weapon damage \':\'\'} during rage"',
  'Reckless Abandon':
    'Action=Free ' +
    'Section=feature ' +
    'Note="Gives -2 Armor Class, -1 saves, and +2 attacks at the start of a turn until rage ends when reduced to %{hitPoints//2} or fewer Hit Points"',
  'Brutal Critical':
    'Section=combat ' +
    // Errata limits effects to melee hits
    'Note="Critical melee hits inflict an additional damage die and 2 damage dice persistent bleed damage"',
  'Perfect Clarity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Ends rage to gain a +2 reroll on a failed attack or Will save"',
  'Vicious Evisceration':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike also inflicts drained 1, or drained 2 on a critical success, during rage"',
  'Contagious Rage':
    'Section=combat ' +
    'Note="Can use Share Rage unlimited times, also sharing instinct and specialization abilities"',
  'Quaking Stomp':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Invokes <i>Earthquake</i> effects during rage once per 10 min"',

  // Bard
  'Bard Weapon Expertise':
    'Section=combat,combat ' +
    // Errata adds Unarmed Attacks
    'Note=' +
      '"Attack Expert (Simple Weapons; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip; Unarmed Attacks)",' +
      '"Critical hits with a simple weapon, longsword, rapier, sap, shortbow, shortsword, whip, or unarmed attack inflict its critical specialization effect when a composition spell is active"',
  'Bard Feats':'Section=feature Note="%V selections"',
  'Bard Skills':
    'Section=skill ' +
    'Note="Skill Trained (Occultism; Performance; Choose %V from any)"',
  'Composition Spells':
    'Section=magic ' +
    'Note="Knows the Counter Performance and Inspire Courage occult spells/Has a focus pool and 1 Focus Point"',
  'Enigma':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Bardic Lore feature",' +
      '"Knows the True Strike occult spell"',
  'Expert Spellcaster':'Section=magic Note="Spell Expert (%V)"',
  'Great Fortitude':'Section=save Note="Save Expert (Fortitude)"',
  'Greater Resolve':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Successes on Will saves are critical successes, critical failures are normal failures, and failed Will saves inflict half damage"',
  'Legendary Spellcaster':'Section=magic Note="Spell Legendary (%V)"',
  'Light Armor Expertise':
    'Section=combat Note="Defense Expert (Light Armor; Unarmored Defense)"',
  // Lightning Reflexes as above
  'Maestro':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Lingering Composition feature",' +
      '"Knows the Soothe occult spell"',
  'Magnum Opus':'Section=magic Note="Knows 2 10th-level occult spells"',
  'Master Spellcaster':'Section=magic Note="Spell Master (%V)"',
  'Muses':'Section=feature Note="1 selection"',
  'Occult Spellcasting':
    'Section=magic Note="Can learn spells from the occult tradition"',
  'Polymath':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Versatile Performance feature",' +
      '"Knows the Unseen Servant occult spell"',
  'Resolve':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Signature Spells':
    'Section=magic ' +
    'Note="Can heighten 1 chosen spell of each level without learning a heightened version"',
  'Vigilant Senses':'Section=skill Note="Perception Master"',
  // Weapon Specialization as above

  'Bardic Lore':
    'Section=skill ' +
    'Note="Can use Bardic Lore to attempt to Recall Knowledge on any topic"',
  'Lingering Composition':
    'Section=magic ' +
    'Note="Knows the Lingering Composition occult spell/+1 Focus Points"',
  'Reach Spell':
    'Action=1 Section=magic Note="Extends subsequent spell range by 30\'"',
  'Versatile Performance':
    'Section=skill ' +
    'Note="Can use Performance in place of Deception, Diplomacy, or Intimidation to Impersonate, Make An Impression, Demoralize, or to satisfy prerequisites"',
  'Cantrip Expansion':
    'Section=magic ' +
    'Note="Can prepare 2 additional cantrips each day or add 2 additional cantrips to repertoire"',
  'Esoteric Polymath':
    'Section=magic,skill ' +
    'Note=' +
      '"Can prepare 1 spell from spellbook during daily prep, treating it as an additional signature spell if it is in repertoire",' +
      '"Can use Occultism to add spells to spellbook"',
  'Inspire Competence':
    'Section=magic Note="Knows the Inspire Competence occult cantrip"',
  "Loremaster's Etude":
    'Section=magic ' +
    'Note="Knows the Loremaster\'s Etude occult spell/+1 Focus Points"',
  'Multifarious Muse (Enigma)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select enigma muse feats"',
  'Multifarious Muse (Maestro)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select maestro muse feats"',
  'Multifarious Muse (Polymath)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select polymath muse feats"',
  'Inspire Defense':
    'Section=magic Note="Knows the Inspire Defense occult cantrip"',
  'Melodious Spell':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Performance vs. Perception hides subsequent spellcasting from observers"',
  'Triple Time':'Section=magic Note="Knows the Triple Time occult cantrip"',
  'Versatile Signature':
    'Section=magic Note="Can replace 1 signature spell during daily prep"',
  'Dirge Of Doom':'Section=magic Note="Knows the Dirge Of Doom occult cantrip"',
  'Harmonize':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Can have 2 composition spells active simultaneously"',
  'Steady Spellcasting':
    'Section=magic ' +
    'Note="Successful DC 15 flat check negates spellcasting disruption"',
  'Eclectic Skill':
    'Section=skill,skill ' +
    'Note=' +
      '"+%{level} on untrained skills",' +
      '"Can attempt any skill requiring trained%{rank.Occultism>=4?\' or expert\':\'\'} proficiency"',
  'Inspire Heroics':
    'Section=magic ' +
    'Note="Knows the Inspire Heroics occult spell/+1 Focus Points"',
  'Know-It-All':
    'Section=skill ' +
    'Note="Successful Recall Knowledge checks give additional information"',
  'House Of Imaginary Walls':
    'Section=magic Note="Knows the House Of Imaginary Walls occult cantrip"',
  'Quickened Casting':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Reduces the time required to cast a spell of level %{maxSpellLevel-2} or lower by 1 action once per day"',
  'Unusual Composition':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Replaces the somatic components of a composition spell with verbal components or vice versa"',
  'Eclectic Polymath':
    'Section=magic ' +
    'Note="Can retain a chosen Esoteric Polymath spell in repertoire by removing a spell of the same level"',
  'Inspirational Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Allegro':'Section=magic Note="Knows the Allegro occult cantrip"',
  'Soothing Ballad':
    'Section=magic ' +
    'Note="Knows the Soothing Ballad occult spell/+1 Focus Points"',
  'True Hypercognition':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses up to 5 Recall Knowledge actions"',
  'Effortless Concentration':
    'Action=Free Section=magic Note="Sustains an active spell"',
  'Studious Capacity':
    'Section=magic ' +
    'Note="Can cast 1 additional spell of level %{maxSpellLevel-1} or lower each day"',
  'Deep Lore':'Section=magic Note="Knows 1 additional spell of each level"',
  'Eternal Composition':
    'Section=magic ' +
    'Note="Can use an additional action each rd to cast a 1-action composition cantrip"',
  'Impossible Polymath':
    'Section=magic ' +
    'Note="Can add arcane, divine, and primal spells to spellbook if trained in the corresponding skill"',
  'Fatal Aria':
    'Section=magic Note="Knows the Fatal Aria occult spell/+1 Focus Points"',
  'Perfect Encore':'Section=magic Note="+1 10th level spell slot"',
  'Symphony Of The Muse':
    'Section=magic ' +
    'Note="Can have any number of composition spells active simultaneously"',

  // Champion
  // Alertness as above
  'Armor Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"Benefits from the specialization effects of medium and heavy armor"',
  'Armor Mastery':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Blade Ally':
    'Section=combat ' +
    'Note="Can apply a choice of %{combatNotes.radiantBladeMaster?\'<i>dancing</i>, <i>greater disrupting</i>, <i>keen</i>, \':\'\'}%{combatNotes.radiantBladeSpirit?\'<i>flaming</i>, <i>anarchic</i>, <i>axiomatic</i>, <i>holy</i>, <i>unholy</i>, \':\'\'}<i>disrupting</i>, <i>ghost touch</i>, <i>returning</i>, or <i>shifting</i> to a chosen weapon during daily prep, and critical hits inflict its critical specialization effect"',
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
  "Champion's Reaction":
    'Section=feature ' +
    'Note="Can use the Champion\'s Reaction for the chosen champion cause"',
  'Deity And Cause':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Anathema feature/1 selection",' +
      '"Skill Trained (%V)"',
  'Deific Weapon':
    'Section=combat,combat ' +
    'Note=' +
      '"%{deityWeapon} inflicts +1 damage die step",' +
      '"Has access to %{deityWeaponLowered}"',
  'Devotion Spells':'Section=magic Note="Has a focus pool and 1 Focus Point"',
  'Divine Ally':
    'Section=feature ' +
    'Note="%V selection%{featureNotes.divineAlly==1?\'\':\'s\'}"',
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
    'Note="R15\' Liberating Step allows all allies to Step if the target ally does not attempt to break free"',
  'Exalt (Paladin)':
    'Section=combat ' +
    'Note="R15\' Retributive Strike allows allies to use a reaction to make a %{combatNotes.auraOfVengeance?-2:-5} melee Strike against the target"',
  'Exalt (Redeemer)':
    'Section=combat ' +
    'Note="R15\' Can use Glimpse Of Redemption to give allies resistance %{level} to all damage"',
  'Glimpse Of Redemption':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R15\' Forces a foe who has damaged an ally to choose between negating the damage or giving the ally resistance %{2+level} to all damage and suffering enfeebled 2 until the end of its next turn"',
  // Greater Weapon Specialization as above
  "Hero's Defiance":
    'Section=magic Note="Knows the Hero\'s Defiance divine spell"',
  // Juggernaut as above
  'Legendary Armor':
    'Section=combat ' +
    'Note="Defense Legendary (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Liberating Step':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R15\' Gives an ally resistance %{2+level} to any triggering damage and free actions to Escape or to save from a restraint and to Step"',
  'Liberator':
    'Section=feature,magic ' +
    'Note=' +
      '"Must respect others\' freedom and oppose tyranny",' +
      '"Knows the Lay On Hands divine spell"',
  // Lightning Reflexes as above
  'Paladin':
    'Section=feature,magic ' +
    'Note=' +
      '"Must always act with honor and respect lawful authority",' +
      '"Knows the Lay On Hands divine spell"',
  'Redeemer':
    'Section=feature,magic ' +
    'Note=' +
      '"Must always show compassion for others and attempt to redeem the wicked",' +
      '"Knows the Lay On Hands divine spell"',
  'Retributive Strike':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R15\' Gives an ally damaged by an attack resistance %{level+2} to all damage and allows self to make a melee Strike against the attacking foe if within reach"',
  'Shield Ally':
    'Section=combat Note="+2 Shield Hardness/+50% Shield Hit Points"',
  // Shield Block as below
  'Steed Ally':
    'Section=feature Note="Has a young animal companion for a mount"',
  'The Tenets Of Good':
    'Section=feature ' +
    'Note="May not commit anathema or evil acts, harm innocents, or allow harm to come to innocents through inaction"',
  'Weapon Expertise':
    'Section=combat Note="Attack Expert (%V; Unarmed Attacks)"',
  'Weapon Mastery':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  // Weapon Specialization as above

  "Deity's Domain (Air)":
    'Section=magic Note="Knows the Pushing Gust divine spell"',
  "Deity's Domain (Ambition)":
    'Section=magic Note="Knows the Blind Ambition divine spell"',
  "Deity's Domain (Cities)":
    'Section=magic Note="Knows the Face In The Crowd divine spell"',
  "Deity's Domain (Confidence)":
    'Section=magic Note="Knows the Veil Of Confidence divine spell"',
  "Deity's Domain (Creation)":
    'Section=magic Note="Knows the Splash Of Art divine spell"',
  "Deity's Domain (Darkness)":
    'Section=magic Note="Knows the Cloak Of Shadow divine spell"',
  "Deity's Domain (Death)":
    'Section=magic Note="Knows the Death\'s Call divine spell"',
  "Deity's Domain (Destruction)":
    'Section=magic Note="Knows the Cry Of Destruction divine spell"',
  "Deity's Domain (Dreams)":
    'Section=magic Note="Knows the Sweet Dream divine spell"',
  "Deity's Domain (Earth)":
    'Section=magic Note="Knows the Hurtling Stone divine spell"',
  "Deity's Domain (Family)":
    'Section=magic Note="Knows the Soothing Words divine spell"',
  "Deity's Domain (Fate)":
    'Section=magic Note="Knows the Read Fate divine spell"',
  "Deity's Domain (Fire)":
    'Section=magic Note="Knows the Fire Ray divine spell"',
  "Deity's Domain (Freedom)":
    'Section=magic Note="Knows the Unimpeded Stride divine spell"',
  "Deity's Domain (Healing)":
    'Section=magic Note="Knows the Healer\'s Blessing divine spell"',
  "Deity's Domain (Indulgence)":
    'Section=magic Note="Knows the Overstuff divine spell"',
  "Deity's Domain (Luck)":
    'Section=magic Note="Knows the Bit Of Luck divine spell"',
  "Deity's Domain (Magic)":
    'Section=magic Note="Knows the Magic\'s Vessel divine spell"',
  "Deity's Domain (Might)":
    'Section=magic Note="Knows the Athletic Rush divine spell"',
  "Deity's Domain (Moon)":
    'Section=magic Note="Knows the Moonbeam divine spell"',
  "Deity's Domain (Nature)":
    'Section=magic Note="Knows the Vibrant Thorns divine spell"',
  "Deity's Domain (Nightmares)":
    'Section=magic Note="Knows the Waking Nightmare divine spell"',
  "Deity's Domain (Pain)":
    'Section=magic Note="Knows the Savor The Sting divine spell"',
  "Deity's Domain (Passion)":
    'Section=magic Note="Knows the Charming Touch divine spell"',
  "Deity's Domain (Perfection)":
    'Section=magic Note="Knows the Perfected Mind divine spell"',
  "Deity's Domain (Protection)":
    'Section=magic Note="Knows the Protector\'s Sacrifice divine spell"',
  "Deity's Domain (Secrecy)":
    'Section=magic Note="Knows the Forced Quiet divine spell"',
  "Deity's Domain (Sun)":
    'Section=magic Note="Knows the Dazzling Flash divine spell"',
  "Deity's Domain (Travel)":
    'Section=magic Note="Knows the Agile Feet divine spell"',
  "Deity's Domain (Trickery)":
    'Section=magic Note="Knows the Sudden Shift divine spell"',
  "Deity's Domain (Truth)":
    'Section=magic Note="Knows the Word Of Truth divine spell"',
  "Deity's Domain (Tyranny)":
    'Section=magic Note="Knows the Touch Of Obedience divine spell"',
  "Deity's Domain (Undeath)":
    'Section=magic Note="Knows the Touch Of Undeath divine spell"',
  "Deity's Domain (Water)":
    'Section=magic Note="Knows the Tidal Surge divine spell"',
  "Deity's Domain (Wealth)":
    'Section=magic Note="Knows the Appearance Of Wealth divine spell"',
  "Deity's Domain (Zeal)":
    'Section=magic Note="Knows the Weapon Surge divine spell"',
  'Ranged Reprisal':
    'Section=combat ' +
    'Note="Can make a Retributive Strike using a ranged Strike or a Step and a melee Strike"',
  'Unimpeded Step':
    'Section=combat ' +
    'Note="Liberating Step target may Step normally in any terrain"',
  'Weight Of Guilt':
    'Section=combat ' +
    'Note="Can make a Glimpse Of Redemption target stupefied instead of enfeebled"',
  'Divine Grace':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Gives +2 vs. the triggering spell"',
  'Dragonslayer Oath':
    'Section=combat,feature ' +
    'Note=' +
      '"%V when used vs. an evil dragon",' +
      '"Must attempt to slay evil dragons whenever possible"',
  'Fiendsbane Oath':
    'Section=combat,feature ' +
    'Note=' +
      '"%V when used vs. a fiend",' +
      '"Must attempt to banish or slay fiends whenever possible"',
  'Shining Oath':
    'Section=combat,feature ' +
    'Note=' +
      '"%V when used vs. undead",' +
      '"Must attempt to put undead to rest whenever possible"',
  'Vengeful Oath':
    'Section=feature,magic ' +
    'Note=' +
      '"Must hunt down and exterminate creatures who have committed atrocities whenever possible",' +
      '"Can use <i>Lay On Hands</i> to inflict good damage on creatures seen harming innocents or good allies"',
  'Aura Of Courage':
    'Section=save ' +
    'Note="Reduces the initial value of any frightened condition by 1, and reduction of a frightened condition at the end of a turn also reduces the fright of allies within 15\'"',
  'Divine Health':
    'Section=save ' +
    'Note="+1 vs. disease, and successes vs. disease are critical successes"',
  'Mercy':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Lay On Hands</i> can also attempt to counteract %{magicNotes.afflictionMercy?\'a curse, disease, poison, \':\'\'}%{magicNotes.greaterMercy?\'blinded, deafened, sickened, slowed, \':\'\'}fear or paralysis"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Section=magic ' +
    'Note="Knows the Litany Against Wrath divine spell/+1 Focus Points"',
  'Loyal Warhorse':
    'Section=feature Note="Mount is mature and will never attack self"',
  'Shield Warden':
    'Section=combat Note="Can use Shield Block to protect an adjacent ally"',
  'Smite Evil':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Blade ally inflicts +4 HP good, or +6 HP with master proficiency, vs. a chosen target for 1 rd, extended as long as the target attacks an ally"',
  "Advanced Deity's Domain (Air)":
    'Section=magic ' +
    'Note="Knows the Disperse Into Air divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Ambition)":
    'Section=magic ' +
    'Note="Knows the Competitive Edge divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Cities)":
    'Section=magic ' +
    'Note="Knows the Pulse Of The City divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Confidence)":
    'Section=magic ' +
    'Note="Knows the Delusional Pride divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Creation)":
    'Section=magic ' +
    'Note="Knows the Artistic Flourish divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Darkness)":
    'Section=magic ' +
    'Note="Knows the Darkened Eyes divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Death)":
    'Section=magic ' +
    'Note="Knows the Eradicate Undeath divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Destruction)":
    'Section=magic ' +
    'Note="Knows the Destructive Aura divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Dreams)":
    'Section=magic ' +
    'Note="Knows the Dreamer\'s Call divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Earth)":
    'Section=magic ' +
    'Note="Knows the Localized Quake divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Family)":
    'Section=magic ' +
    'Note="Knows the Unity divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Fate)":
    'Section=magic ' +
    'Note="Knows the Tempt Fate divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Fire)":
    'Section=magic ' +
    'Note="Knows the Flame Barrier divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Freedom)":
    'Section=magic ' +
    'Note="Knows the Word Of Freedom divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Healing)":
    'Section=magic ' +
    'Note="Knows the Rebuke Death divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Indulgence)":
    'Section=magic ' +
    'Note="Knows the Take Its Course divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Knowledge)":
    'Section=magic ' +
    'Note="Knows the Know The Enemy divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Luck)":
    'Section=magic ' +
    'Note="Knows the Lucky Break divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Magic)":
    'Section=magic ' +
    'Note="Knows the Mystic Beacon divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Might)":
    'Section=magic ' +
    'Note="Knows the Enduring Might divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Moon)":
    'Section=magic ' +
    'Note="Knows the Touch Of The Moon divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Nature)":
    'Section=magic ' +
    'Note="Knows the Nature\'s Bounty divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Nightmares)":
    'Section=magic ' +
    'Note="Knows the Shared Nightmare divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Pain)":
    'Section=magic ' +
    'Note="Knows the Retributive Pain divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Passion)":
    'Section=magic ' +
    'Note="Knows the Captivating Adoration divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Perfection)":
    'Section=magic ' +
    'Note="Knows the Perfected Form divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Protection)":
    'Section=magic ' +
    'Note="Knows the Protector\'s Sphere divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Secrecy)":
    'Section=magic ' +
    'Note="Knows the Safeguard Secret divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Sun)":
    'Section=magic ' +
    'Note="Knows the Positive Luminance divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Travel)":
    'Section=magic ' +
    'Note="Knows the Traveler\'s Transit divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Trickery)":
    'Section=magic ' +
    'Note="Knows the Trickster\'s Twin divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Truth)":
    'Section=magic ' +
    'Note="Knows the Glimpse The Truth divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Tyranny)":
    'Section=magic ' +
    'Note="Knows the Commanding Lash divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Undeath)":
    'Section=magic ' +
    'Note="Knows the Malignant Sustenance divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Water)":
    'Section=magic ' +
    'Note="Knows the Downpour divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Wealth)":
    'Section=magic ' +
    'Note="Knows the Precious Metals divine spell/+1 Focus Points"',
  "Advanced Deity's Domain (Zeal)":
    'Section=magic ' +
    'Note="Knows the Zeal For Battle divine spell/+1 Focus Points"',
  'Greater Mercy':'Section=magic Note="Has increased Mercy effects"',
  'Heal Mount':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> cast on mount restores 10 HP + 10 HP per heightened level"',
  'Quick Shield Block':
    'Section=combat ' +
    'Note="Can use an additional reaction for a Shield Block once per turn"',
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
      '"Knows the Litany Against Sloth divine spell/+1 Focus Points"',
  'Radiant Blade Spirit':
    'Section=combat Note="Has increased Blade Ally effects"',
  'Shield Of Reckoning':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Uses Shield Block on an ally and Champion\'s Reaction on the attacking foe"',
  'Affliction Mercy':'Section=magic Note="Has increased Mercy effects"',
  'Aura Of Faith':
    'Section=combat ' +
    'Note="R15\' All self Strikes and the first Strike of each ally each rd inflict +1 HP good damage vs. evil creatures"',
  'Blade Of Justice':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Adds 2 extra damage dice to a Strike vs. an evil foe seen harming an innocent or ally and allows converting all damage to good%{features.Paladin ? \', as well as inflicting Retributive Strike effects\' : \'\'}"',
  "Champion's Sacrifice":
    'Section=magic ' +
    'Note="Knows the Champion\'s Sacrifice divine spell/+1 Focus Points"',
  'Divine Wall':
    'Section=combat Note="Adjacent spaces are difficult terrain for foes"',
  'Lasting Doubt':
    'Section=combat ' +
    'Note="Extends the effects of Glimpse Of Redemption at half intensity for 1 min"',
  'Liberating Stride':
    'Section=combat ' +
    'Note="Target of Liberating Step may Stride half their Speed"',
  'Anchoring Aura':
    'Section=magic Note="R15\' Aura attempts to counteract teleportation spells cast by fiends"',
  'Aura Of Life':
    'Section=save ' +
    'Note="R15\' Gives resistance 5 to negative energy and +1 saves vs. necromancy"',
  'Aura Of Righteousness':
    'Section=save Note="R15\' Gives resistance 5 to evil"',
  'Aura Of Vengeance':
    'Section=combat ' +
    'Note="Reduces allies\' penalty on Strikes in response to Retributive Strike to -2"',
  'Divine Reflexes':
    'Section=combat ' +
    'Note="Can use an additional reaction for Champion\'s Reaction once per turn"',
  'Litany Of Righteousness':
    'Section=magic ' +
    'Note="Knows the Litany Of Righteousness divine spell/+1 Focus Points"',
  'Wyrmbane Aura':
    'Section=save ' +
    'Note="R15\' Gives self and allies resistance %{charismaModifier} to acid, cold, electricity, fire, and poison, or resistance %{level//2} if the damage comes from dragon breath"',
  'Auspicious Mount':
    'Section=feature ' +
    'Note="Mount is a specialized animal companion with %{deity}\'s mark, expert proficiency in Religion, speech, +2 Intelligence, and +1 Wisdom"',
  'Instrument Of Zeal':
    'Section=combat ' +
    // Errata changes Smite Evil to Blade Of Justice
    'Note="Critical hit with Blade Of Justice or Retributive Strike inflicts an additional damage die and slowed 1 for 1 rd"',
  'Shield Of Grace':
    'Section=combat ' +
    'Note="May redirect half of the excess damage to self when using Shield Block to protect an ally"',
  'Celestial Form':
    'Section=ability,feature ' +
    'Note=' +
      '"Has a %{speed}\' fly Speed",' +
      '"Has the Darkvision feature"',
  'Ultimate Mercy':
    'Section=magic ' +
    'Note="Can use <i>Lay On Hands</i> to restore life with 1 Hit Point and wounded 1 to a target who died in the previous rd"',
  'Celestial Mount':
    'Section=feature ' +
    'Note="Mount has Darkvision, +40 Hit Points, and weakness 10 to evil damage and can fly at full Speed"',
  'Radiant Blade Master':
    'Section=combat Note="Has increased Blade Ally effects"',
  'Shield Paragon':
    'Section=combat,combat ' +
    'Note=' +
      '"+50% shield Hit Points",' +
      '"Shield is always raised and is automatically remade after 1 day if destroyed"',

  // Cleric
  // Alertness as above
  'Advanced Domain (Air)':
    'Section=magic ' +
    'Note="Knows the Disperse Into Air divine spell/+1 Focus Points"',
  'Advanced Domain (Ambition)':
    'Section=magic ' +
    'Note="Knows the Competitive Edge divine spell/+1 Focus Points"',
  'Advanced Domain (Cities)':
    'Section=magic ' +
    'Note="Knows the Pulse Of The City divine spell/+1 Focus Points"',
  'Advanced Domain (Confidence)':
    'Section=magic ' +
    'Note="Knows the Delusional Pride divine spell/+1 Focus Points"',
  'Advanced Domain (Creation)':
    'Section=magic ' +
    'Note="Knows the Artistic Flourish divine spell/+1 Focus Points"',
  'Advanced Domain (Darkness)':
    'Section=magic ' +
    'Note="Knows the Darkened Eyes divine spell/+1 Focus Points"',
  'Advanced Domain (Death)':
    'Section=magic ' +
    'Note="Knows the Eradicate Undeath divine spell/+1 Focus Points"',
  'Advanced Domain (Destruction)':
    'Section=magic ' +
    'Note="Knows the Destructive Aura divine spell/+1 Focus Points"',
  'Advanced Domain (Dreams)':
    'Section=magic ' +
    'Note="Knows the Dreamer\'s Call divine spell/+1 Focus Points"',
  'Advanced Domain (Earth)':
    'Section=magic ' +
    'Note="Knows the Localized Quake divine spell/+1 Focus Points"',
  'Advanced Domain (Family)':
    'Section=magic ' +
    'Note="Knows the Unity divine spell/+1 Focus Points"',
  'Advanced Domain (Fate)':
    'Section=magic ' +
    'Note="Knows the Tempt Fate divine spell/+1 Focus Points"',
  'Advanced Domain (Fire)':
    'Section=magic ' +
    'Note="Knows the Flame Barrier divine spell/+1 Focus Points"',
  'Advanced Domain (Freedom)':
    'Section=magic ' +
    'Note="Knows the Word Of Freedom divine spell/+1 Focus Points"',
  'Advanced Domain (Healing)':
    'Section=magic ' +
    'Note="Knows the Rebuke Death divine spell/+1 Focus Points"',
  'Advanced Domain (Indulgence)':
    'Section=magic ' +
    'Note="Knows the Take Its Course divine spell/+1 Focus Points"',
  'Advanced Domain (Knowledge)':
    'Section=magic ' +
    'Note="Knows the Know The Enemy divine spell/+1 Focus Points"',
  'Advanced Domain (Luck)':
    'Section=magic ' +
    'Note="Knows the Lucky Break divine spell/+1 Focus Points"',
  'Advanced Domain (Magic)':
    'Section=magic ' +
    'Note="Knows the Mystic Beacon divine spell/+1 Focus Points"',
  'Advanced Domain (Might)':
    'Section=magic ' +
    'Note="Knows the Enduring Might divine spell/+1 Focus Points"',
  'Advanced Domain (Moon)':
    'Section=magic ' +
    'Note="Knows the Touch Of The Moon divine spell/+1 Focus Points"',
  'Advanced Domain (Nature)':
    'Section=magic ' +
    'Note="Knows the Nature\'s Bounty divine spell/+1 Focus Points"',
  'Advanced Domain (Nightmares)':
    'Section=magic ' +
    'Note="Knows the Shared Nightmare divine spell/+1 Focus Points"',
  'Advanced Domain (Pain)':
    'Section=magic ' +
    'Note="Knows the Retributive Pain divine spell/+1 Focus Points"',
  'Advanced Domain (Passion)':
    'Section=magic ' +
    'Note="Knows the Captivating Adoration divine spell/+1 Focus Points"',
  'Advanced Domain (Perfection)':
    'Section=magic ' +
    'Note="Knows the Perfected Form divine spell/+1 Focus Points"',
  'Advanced Domain (Protection)':
    'Section=magic ' +
    'Note="Knows the Protector\'s Sphere divine spell/+1 Focus Points"',
  'Advanced Domain (Secrecy)':
    'Section=magic ' +
    'Note="Knows the Safeguard Secret divine spell/+1 Focus Points"',
  'Advanced Domain (Sun)':
    'Section=magic ' +
    'Note="Knows the Positive Luminance divine spell/+1 Focus Points"',
  'Advanced Domain (Travel)':
    'Section=magic ' +
    'Note="Knows the Traveler\'s Transit divine spell/+1 Focus Points"',
  'Advanced Domain (Trickery)':
    'Section=magic ' +
    'Note="Knows the Trickster\'s Twin divine spell/+1 Focus Points"',
  'Advanced Domain (Truth)':
    'Section=magic ' +
    'Note="Knows the Glimpse The Truth divine spell/+1 Focus Points"',
  'Advanced Domain (Tyranny)':
    'Section=magic ' +
    'Note="Knows the Commanding Lash divine spell/+1 Focus Points"',
  'Advanced Domain (Undeath)':
    'Section=magic ' +
    'Note="Knows the Malignant Sustenance divine spell/+1 Focus Points"',
  'Advanced Domain (Water)':
    'Section=magic ' +
    'Note="Knows the Downpour divine spell/+1 Focus Points"',
  'Advanced Domain (Wealth)':
    'Section=magic ' +
    'Note="Knows the Precious Metals divine spell/+1 Focus Points"',
  'Advanced Domain (Zeal)':
    'Section=magic ' +
    'Note="Knows the Zeal For Battle divine spell/+1 Focus Points"',
  'Anathema':
    'Section=feature ' +
    'Note="May not perform acts or use spells prohibited by %V"',
  'Cleric Feats':'Section=feature Note="%V selections"',
  'Cleric Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  'Cloistered Cleric':
    'Section=combat,combat,feature,magic,save ' +
    'Note=' +
      // Errata adds Attack Expert (Simple Weapons; Unarmed Attacks)
      '"Attack Expert (%V; Simple Weapons; Unarmed Attacks)",' +
      '"Critical hits with a %{deityWeaponLowered} inflict its critical specialization effect",' +
      '"+1 Class Feat (Domain Initiate feat)",' +
      '"Spell %V (Divine)",' +
      '"Save Expert (Fortitude)"',
  'Deity':
    'Section=combat,feature,magic,skill ' +
    'Note=' +
      '"Attack Trained (%V)",' +
      '"Has the Anathema feature",' +
      '"Has access to %V spells",' +
      '"Skill Trained (%V)"',
  'Divine Defense':'Section=combat Note="Defense Expert (Unarmored Defense)"',
  'Divine Font':'Section=feature Note="1 selection"',
  'Divine Spellcasting':
    'Section=magic Note="Can learn spells from the divine tradition"',
  'Doctrine':'Section=feature Note="1 selection"',
  'Domain Initiate (Air)':
    'Section=magic ' +
    'Note="Knows the Pushing Gust divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Ambition)':
    'Section=magic ' +
    'Note="Knows the Blind Ambition divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Cities)':
    'Section=magic ' +
    'Note="Knows the Face In The Crowd divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Confidence)':
    'Section=magic ' +
    'Note="Knows the Veil Of Confidence divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Creation)':
    'Section=magic ' +
    'Note="Knows the Splash Of Art divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Darkness)':
    'Section=magic ' +
    'Note="Knows the Cloak Of Shadow divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Death)':
    'Section=magic ' +
    'Note="Knows the Death\'s Call divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Destruction)':
    'Section=magic ' +
    'Note="Knows the Cry Of Destruction divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Dreams)':
    'Section=magic ' +
    'Note="Knows the Sweet Dream divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Earth)':
    'Section=magic ' +
    'Note="Knows the Hurtling Stone divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Family)':
    'Section=magic ' +
    'Note="Knows the Soothing Words divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Fate)':
    'Section=magic ' +
    'Note="Knows the Read Fate divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Fire)':
    'Section=magic ' +
    'Note="Knows the Fire Ray divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Freedom)':
    'Section=magic ' +
    'Note="Knows the Unimpeded Stride divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Healing)':
    'Section=magic ' +
    'Note="Knows the Healer\'s Blessing divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Indulgence)':
    'Section=magic ' +
    'Note="Knows the Overstuff divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Luck)':
    'Section=magic ' +
    'Note="Knows the Bit Of Luck divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Magic)':
    'Section=magic ' +
    'Note="Knows the Magic\'s Vessel divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Might)':
    'Section=magic ' +
    'Note="Knows the Athletic Rush divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Moon)':
    'Section=magic ' +
    'Note="Knows the Moonbeam divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Nature)':
    'Section=magic ' +
    'Note="Knows the Vibrant Thorns divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Nightmares)':
    'Section=magic ' +
    'Note="Knows the Waking Nightmare divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Pain)':
    'Section=magic ' +
    'Note="Knows the Savor The Sting divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Passion)':
    'Section=magic ' +
    'Note="Knows the Charming Touch divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Perfection)':
    'Section=magic ' +
    'Note="Knows the Perfected Mind divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Protection)':
    'Section=magic ' +
    'Note="Knows the Protector\'s Sacrifice divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Secrecy)':
    'Section=magic ' +
    'Note="Knows the Forced Quiet divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Sun)':
    'Section=magic ' +
    'Note="Knows the Dazzling Flash divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Travel)':
    'Section=magic ' +
    'Note="Knows the Agile Feet divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Trickery)':
    'Section=magic ' +
    'Note="Knows the Sudden Shift divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Truth)':
    'Section=magic ' +
    'Note="Knows the Word Of Truth divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Tyranny)':
    'Section=magic ' +
    'Note="Knows the Touch Of Obedience divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Undeath)':
    'Section=magic ' +
    'Note="Knows the Touch Of Undeath divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Water)':
    'Section=magic ' +
    'Note="Knows the Tidal Surge divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Wealth)':
    'Section=magic ' +
    'Note="Knows the Appearance Of Wealth divine spell/Has a focus pool and 1 Focus Point"',
  'Domain Initiate (Zeal)':
    'Section=magic ' +
    'Note="Knows the Weapon Surge divine spell/Has a focus pool and 1 Focus Point"',
  'Harmful Font':
    'Section=magic ' +
    'Note="Can cast <i>Harm</i> at level %{maxSpellLevel} an additional %{charismaModifier+1} times per day"',
  'Healing Font':
    'Section=magic ' +
    'Note="Can cast <i>Heal</i> at level %{maxSpellLevel} an additional %{charismaModifier+1} times per day"',
  // Lightning Reflexes as above
  'Miraculous Spell':'Section=magic Note="Has 1 10th-level spell slot"',
  // Resolve as above
  'Warpriest':
    'Section=combat,combat,feature,feature,magic,save,save ' +
    'Note=' +
      // Errata adds Attack Expert (Simple Weapons; Unarmed Attacks)
      '"Defense %V (Light Armor; Medium Armor)%{level>=3?\'/Attack Trained (Martial Weapons)\':\'\'}%{level>=7?\'/Attack Expert (%1; Simple Weapons; Unarmed Attacks)\':\'\'}",' +
      '"Critical hits with a %{deityWeaponLowered} inflict its critical specialization effect",' +
      '"Has the Shield Block feature",' +
      '"Has the Deadly Simplicity feature",' +
      '"Spell %V (Divine)",' +
      '"Save %V (Fortitude)",' +
      '"Successes on Fortitude saves are critical successes"',
  // Weapon Specialization as above

  'Deadly Simplicity':
    'Section=combat Note="%{deityWeapon} inflicts +1 damage die step"',
  'Harming Hands':'Section=magic Note="Increases <i>Harm</i> die type to d10"',
  'Healing Hands':'Section=magic Note="Increases <i>Heal</i> die type to d10"',
  'Holy Castigation':
    'Section=magic Note="Can use <i>Heal</i> to damage fiends"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    'Section=magic ' +
    'Note="Casting <i>Heal</i> on a single target restores HP equal to the spell level to self"',
  'Emblazon Armament':
    'Section=magic ' +
    'Note="10 min process gives a shield +1 Hardness or a weapon +1 HP damage for 1 year"',
  'Sap Life':
    'Section=magic ' +
    'Note="Casting <i>Harm</i> on another creature restores HP equal to the spell level to self"',
  'Turn Undead':
    'Section=magic ' +
    'Note="Critical failure by undead up to level %{level} damaged by <i>Heal</i> inflicts fleeing for 1 rd"',
  'Versatile Font':
    'Section=magic ' +
    'Note="Can use the extra spell slots from Harming Font or Healing Font for either <i>Harm</i> or <i>Heal</i>"',
  'Channel Smite':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Adds the damage from <i>Heal</i> or <i>Harm</i> to a melee Strike"',
  'Command Undead':
    'Action=1 ' +
    'Section=magic ' +
    'Note="<i>Harm</i> inflicts minion status on target undead up to level %{level-3} for 1 min (Will negates; critical failure extends to 1 hr)"',
  'Directed Channel':
    'Section=magic ' +
    'Note="Can direct the effects of an area <i>Harm</i> or <i>Heal</i> into a 60\' cone"',
  'Improved Communal Healing':
    'Section=magic ' +
    'Note="Can give the additional Hit Points from Communal Healing to another within range of the spell"',
  'Necrotic Infusion':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Harm</i> cast on an undead causes the target to inflict +1d6 HP negative (5th level spell +2d6 HP; 8th level +3d6 HP) with melee Strike until the end of its next turn"',
  'Cast Down':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent single-target damaging <i>Harm</i> or <i>Heal</i> also inflicts knocked prone (save negates; critical failure also inflicts -10 Speed for 1 min)"',
  'Divine Weapon':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Using a divine spell slot causes a wielded weapon to inflict +1d4 HP force or +1d6 HP alignment for the remainder of the turn once per turn"',
  'Selective Energy':
    'Section=magic ' +
    'Note="Can choose %{charismaModifier>?1} creatures to be unaffected when casting an area <i>Harm</i> or <i>Heal</i>"',
  // Steady Spellcasting as above
  'Align Armament (Chaotic)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon inflicts +1d6 HP chaotic for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'} once per rd"',
  'Align Armament (Evil)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon inflicts +1d6 HP evil for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'} once per rd"',
  'Align Armament (Good)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon inflicts +1d6 HP good for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'} once per rd"',
  'Align Armament (Lawful)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon inflicts +1d6 HP lawful for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'} once per rd"',
  'Channeled Succor':
    'Section=magic ' +
    'Note="Can cast <i>Remove Curse</i>, <i>Remove Disease</i>, <i>Remove Paralysis</i>, or <i>Restoration</i> in place of a prepared <i>Heal</i>"',
  'Cremate Undead':
    'Section=magic ' +
    'Note="<i>Heal</i> cast upon undead also inflicts persistent fire damage equal to the spell level"',
  'Emblazon Energy':
    'Section=magic ' +
    'Note="Can use Emblazon Armament to instead cause a shield to give a save bonus and Shield Block vs. a chosen energy type, and to give it resistance %{level//2} if the energy matches a known domain spell, or to cause a weapon to inflict +1d4 HP energy type damage, or +1d6 HP if the energy matches a known domain spell"',
  'Castigating Weapon':
    'Section=magic ' +
    'Note="Damaging a fiend with <i>Heal</i> causes self weapons and unarmed Strikes to inflict bonus good damage vs. fiends equal to half the spell level until the end of the next turn"',
  'Heroic Recovery':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent single-target <i>Heal</i> also gives the target +5 Speed, +1 attack, and +1 HP damage until the end of its next turn"',
  'Improved Command Undead':
    'Section=magic ' +
    'Note="Command Undead gives control of target for 1 rd, 10 min, or 24 hr on save success, failure, or critical failure"',
  'Replenishment Of War':
    'Section=combat ' +
    'Note="Successful %{deityWeaponLowered} Strikes give self %{level//2} temporary Hit Points, or %{level} temporary Hit Points on a critical hit, until the start of the next turn"',
  'Defensive Recovery':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent single-target healing also gives the target +2 Armor Class and saves for 1 rd"',
  'Domain Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Emblazon Antimagic':
    'Section=magic ' +
    // Errata corrects the counteract level
    'Note="Can use Emblazon Armament to instead cause a shield to give a save bonus vs. magic and Shield Block vs. spells, or to cause 1 critical hit with a weapon to allow a +%{(level+1)//2} counteract attempt vs. a spell"',
  'Shared Replenishment':
    'Section=combat ' +
    'Note="Can give the temporary Hit Points from Replenishment Of War to an ally within 10\'"',
  "Deity's Protection":
    'Section=magic ' +
    'Note="Casting a domain spell gives self resistance equal to the spell level to all damage until the start of the next turn"',
  'Extend Armament Alignment':
    'Section=combat Note="Has increased Align Armament effects"',
  'Fast Channel':
    'Section=magic ' +
    'Note="Can use 2 actions to cast a 3-action <i>Harm</i> or <i>Heal</i>"',
  'Swift Banishment':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Expends a prepared <i>Banishment</i> with the triggering critical hit on an extraplanar foe"',
  'Eternal Bane':
    'Section=magic ' +
    'Note="R15\' Aura gives continuous level %{level//2} <i>Bane</i> effects; can dismiss it for 1 min"',
  'Eternal Blessing':
    'Section=magic ' +
    'Note="R15\' Aura gives continuous level %{level//2} <i>Bless</i> effects; can dismiss it for 1 min"',
  'Resurrectionist':
    'Section=magic ' +
    'Note="Restoring Hit Points to a dying or dead target also gives fast healing 5 for 1 min or until the target is knocked unconscious"',
  'Domain Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  'Echoing Channel':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent 2-action <i>Harm</i> or <i>Heal</i> cast on a single target also causes 1-action effects on an adjacent creature"',
  'Improved Swift Banishment':
    'Section=magic ' +
    'Note="Can sacrifice any 5th level or higher prepared spell to inflict Swift Banishment with a -2 save penalty"',
  "Avatar's Audience":
    'Section=magic ' +
    'Note="Can speak for %{deity}, conduct the <i>Commune</i> ritual to contact %{deity} without cost, and use <i>Plane Shift</i> to travel to %{deity}\'s realm once per day"',
  'Maker Of Miracles':'Section=magic Note="+1 10th level spell slot"',
  'Metamagic Channel':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Applies a 1-action metamagic action to <i>Harm</i> or <i>Heal</i>"',

  // Druid
  // Alertness as above
  'Animal':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Animal Companion feature",' +
      '"Knows the Heal Animal primal spell",' +
      '"Skill Trained (Athletics)"',
  'Druid Feats':'Section=feature Note="%V selections"',
  'Druid Skills':
    'Section=skill Note="Skill Trained (Nature; Choose %V from any)"',
  'Druidic Language':'Section=skill Note="Knows a druid-specific language"',
  'Druidic Order':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool and 1 Focus Point"',
  'Druid Weapon Expertise':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  // Expert Spellcaster as above
  // Great Fortitude as above
  'Leaf':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Leshy Familiar feature",' +
      '"Knows the Goodberry primal spell/+1 Focus Points",' +
      '"Skill Trained (Diplomacy)"',
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Master Spellcaster as above
  // Medium Armor Expertise as above
  'Primal Hierophant':'Section=magic Note="Has 1 10th-level spell slot"',
  'Primal Spellcasting':
    'Section=magic Note="Can learn spells from the primal tradition"',
  // Resolve as above
  // Shield Block as below
  'Storm':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Storm Born feature",' +
      '"Knows the Tempest Surge primal spell/+1 Focus Points",' +
      '"Skill Trained (Acrobatics)"',
  // Weapon Specialization as above
  'Wild':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Wild Shape feature",' +
      '"Knows the Wild Morph primal spell",' +
      '"Skill Trained (Intimidation)"',
  'Wild Empathy':'Section=skill Note="Can speak with animals"',

  'Animal Companion':
    'Section=feature ' +
    'Note="Has a young animal companion%{$\'features.Hunt Prey\'?\' that gains Hunt Prey\'+($\'features.Masterful Companion\'?\' and Flurry, Precision, and Outwit\':\'\')+\' effects\':\'\'}"',
  // Errata adds fungus
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
    'Note="Increases the effect of a subsequent 10\' or greater radius area instantaneous spell by 5\', the effect of a 15\' or shorter line or cone instantaneous spell by 5\', or the effect of a longer line or cone instantaneous spell by 10\'"',
  'Wild Shape':'Section=magic Note="Knows the Wild Shape primal spell"',
  'Call Of The Wild':
    'Section=magic ' +
    'Note="Can spend 10 min in concert with nature to replace a prepared spell with <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> of the same level"',
  'Enhanced Familiar':
    'Section=feature Note="Can select 4 familiar or master abilities each day"',
  'Order Explorer (Animal)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select animal order feats"',
  'Order Explorer (Leaf)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select leaf order feats"',
  'Order Explorer (Storm)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select storm order feats"',
  'Order Explorer (Wild)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select wild order feats"',
  // Poison Resistance as above; errata removes the 1 action glyph
  'Form Control':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Wild Shape</i>, cast 2 levels lower, lasts for 1 hr"',
  'Mature Animal Companion':
    'Section=feature ' +
    'Note="Animal Companion is a mature companion and may Stride or Strike without a command"',
  'Thousand Faces':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Small or Medium humanoid"',
  'Woodland Stride':
    'Section=ability ' +
    // Errata adds fungi
    'Note="Moves normally over difficult terrain caused by plants or fungi"',
  'Green Empathy':
    'Section=skill ' +
    // Errata adds fungi
    'Note="Can communicate with plants and fungi and gains +2 to make simple Requests"',
  'Insect Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Medium insect; flightless forms last 24 hr"',
  'Order Magic (Animal)':
    'Section=magic Note="Knows the Heal Animal primal spell"',
  'Order Magic (Leaf)':
    'Section=magic Note="Knows the Goodberry primal spell"',
  'Order Magic (Storm)':
    'Section=magic Note="Knows the Tempest Surge primal spell"',
  'Order Magic (Wild)':
    'Section=magic Note="Knows the Wild Morph primal spell"',
  // Steady Spellcasting as above
  'Storm Retribution':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="<i>Tempest Surge</i> cast in response to a foe critical melee hit pushes the foe 5\' (<b>save</b> Reflex negates; critical failure pushes 10\')"',
  'Ferocious Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Large dinosaur, and <i>Wild Shape</i> Athletics bonus increases by 1"',
  'Fey Caller':
    'Section=magic ' +
    'Note="Knows the Illusory Disguise, Illusory Object, Illusory Scene, and Veil primal spells"',
  'Incredible Companion':
    'Section=feature ' +
    'Note="Animal Companion has a choice of nimble or savage characteristics"',
  'Soaring Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a %{$\'features.Insect Shape\'?\'wasp, \':\'\'}%{$\'features.Ferocious Shape\'?\'pterosaur, \':\'\'}bat or bird, and <i>Wild Shape</i> Acrobatics bonus increases by 1"',
  'Wind Caller':
    'Section=magic ' +
    'Note="Knows the Stormwind Flight primal spell/+1 Focus Points"',
  'Elemental Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Medium elemental, and <i>Wild Shape</i> gives resistance 5 to fire"',
  'Healing Transformation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent non-cantrip polymorph spell restores 1d6 Hit Poins per spell level"',
  'Overwhelming Energy':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent spell ignores resistance %{level} to energy"',
  'Plant Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Large plant, and <i>Wild Shape</i> gives resistance 5 to poison"',
  'Side By Side':
    'Section=combat ' +
    'Note="Self and companion automatically flank a foe adjacent to both"',
  'Dragon Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Large dragon, and <i>Wild Shape</i> gives resistance 5 to a choice of acid, cold, electricity, fire, or poison"',
  'Green Tongue':
    'Section=magic ' +
    'Note="Self and any leshy familiar have continuous <i>Speak With Plants</i> effects"',
  'Primal Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Primal Summons':
    'Section=magic Note="Knows the Primal Summons primal spell"',
  'Specialized Companion':
    'Section=feature Note="Animal Companion has a choice of specialization"',
  'Timeless Nature':
    'Section=feature,save ' +
    'Note=' +
      '"Does not age",' +
      '"+2 vs. disease and primal magic"',
  'Verdant Metamorphosis':
    'Section=feature,magic ' +
    'Note=' +
      '"Has plant, not humanoid, trait",' +
      '"Can use <i>Tree Shape</i> effects at will; tree form raises Armor Class to 30, restores half Hit Points with 10 min in sunlight, and restores all Hit Points and removes all non-permanent conditions and poisons and diseases up to level 19 with daily rest"',
  // Effortless Concentration as above
  'Impaling Briars':
    'Section=magic ' +
    'Note="Knows the Impaling Briars primal spell/+1 Focus Points"',
  'Monstrosity Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a %{$\'features.Soaring Shape\'?\'phoenix, purple worm,\':\'purple worm\'} or sea serpent"',
  'Invoke Disaster':
    'Section=magic Note="Knows the Storm Lord primal spell/+1 Focus Points"',
  'Perfect Form Control':
    'Section=magic Note="Can retain Form Control shape permanently"',
  'Primal Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  "Hierophant's Power":'Section=magic Note="+1 10th level spell slot"',
  'Leyline Conduit':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent casting of an instantaneous spell of 5th level or lower does not expend a spell slot once per min"',
  'True Shapeshifter':
    'Section=magic,magic ' +
    'Note=' +
     '"Knows the Nature Incarnate primal spell; can use it to become a kaiju%{$\'features.Plant Shape\'?\' or green man\':\'\'} once per day",' +
     '"' + Pathfinder2E.ACTION_MARKS['2'] + ' Changes shape during <i>Wild Shape</i>"',

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
      '"Successes on Will saves vs. fear are critical successes, and the initial severity of frightened conditions is reduced by 1"',
  'Combat Flexibility':
    'Section=combat ' +
    'Note="Gains a chosen fighter feat of up to 8th level%{combatNotes.improvedFlexibility?\' and one of up to 14th level\':\'\'} during daily prep"',
  // Evasion as above
  'Fighter Expertise':'Section=feature Note="Class Expert (Fighter)"',
  'Fighter Feats':'Section=feature Note="%V selections"',
  'Fighter Key Ability':'Section=feature Note="1 selection"',
  'Fighter Skills':
    'Section=skill ' +
    'Note="Skill Trained (Choose 1 from Acrobatics, Athletics; Choose %V from any)"',
  'Fighter Weapon Mastery':
    'Section=combat,feature ' +
    'Note=' +
      '"Critical hits with a master proficiency weapon inflict its critical specialization effect",' +
      '"1 selection"',
  'Fighter Weapon Mastery (Axes)':
    'Section=combat ' +
    'Note="Attack Master (Simple Axes; Martial Axes)/Attack Expert (Advanced Axes)"',
  'Fighter Weapon Mastery (Bombs)':
    'Section=combat ' +
    'Note="Attack Master (Simple Bombs; Martial Bombs)/Attack Expert (Advanced Bomb Weapons)"',
  'Fighter Weapon Mastery (Brawling Weapons)':
    'Section=combat ' +
    'Note="Attack Master (Unarmed Brawling Weapons; Simple Brawling Weapons; Martial Brawling Weapons)/Attack Expert (Advanced Brawling Weapons)"',
  'Fighter Weapon Mastery (Clubs)':
    'Section=combat ' +
    'Note="Attack Master (Simple Clubs; Martial Clubs)/Attack Expert (Advanced Clubs)"',
  'Fighter Weapon Mastery (Crossbows)':
    'Section=combat ' +
    'Note="Attack Master (Simple Crossbows; Martial Crossbows)/Attack Expert (Advanced Crossbows)"',
  'Fighter Weapon Mastery (Darts)':
    'Section=combat ' +
    'Note="Attack Master (Simple Darts; Martial Darts)/Attack Expert (Advanced Darts)"',
  'Fighter Weapon Mastery (Flails)':
    'Section=combat ' +
    'Note="Attack Master (Simple Flails; Martial Flails)/Attack Expert (Advanced Flails)"',
  'Fighter Weapon Mastery (Hammers)':
    'Section=combat ' +
    'Note="Attack Master (Simple Hammers; Martial Hammers)/Attack Expert (Advanced Hammers)"',
  'Fighter Weapon Mastery (Knives)':
    'Section=combat ' +
    'Note="Attack Master (Simple Knives; Martial Knives)/Attack Expert (Advanced Knives)"',
  'Fighter Weapon Mastery (Picks)':
    'Section=combat ' +
    'Note="Attack Master (Simple Picks; Martial Picks)/Attack Expert (Advanced Picks)"',
  'Fighter Weapon Mastery (Polearms)':
    'Section=combat ' +
    'Note="Attack Master (Simple Polearms; Martial Polearms)/Attack Expert (Advanced Polearms)"',
  'Fighter Weapon Mastery (Slings)':
    'Section=combat ' +
    'Note="Attack Master (Simple Slings; Martial Slings)/Attack Expert (Advanced Slings)"',
  'Fighter Weapon Mastery (Shields)':
    'Section=combat ' +
    'Note="Attack Master (Simple Shields; Martial Shields)/Attack Expert (Advanced Shields)"',
  'Fighter Weapon Mastery (Spears)':
    'Section=combat ' +
    'Note="Attack Master (Simple Spears; Martial Spears)/Attack Expert (Advanced Spears)"',
  'Fighter Weapon Mastery (Swords)':
    'Section=combat ' +
    'Note="Attack Master (Simple Swords; Martial Swords)/Attack Expert (Advanced Swords)"',
  // Greater Weapon Specialization as above
  'Improved Flexibility':
    'Section=combat Note="Has increased Combat Flexibility features"',
  // Juggernaut as above
  // Shield Block as below
  'Versatile Legend':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Master (Advanced Weapons)/Class Master (Fighter)"',
  'Weapon Legend':
    'Section=feature,combat ' +
    'Note=' +
      '"1 selection",' +
      '"Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Expert (Advanced Weapons)"',
  'Weapon Legend (Axes)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Axes; Martial Axes)/Attack Master (Advanced Axes)"',
  'Weapon Legend (Bombs)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Bombs; Martial Bombs)/Attack Master (Advanced Bombs)"',
  'Weapon Legend (Brawling Weapons)':
    'Section=combat ' +
    'Note="Attack Legendary (Unarmed Brawling Weapons; Simple Brawling Weapons; Martial Brawling Weapons)/Attack Master (Advanced Brawling Weapons)"',
  'Weapon Legend (Clubs)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Clubs; Martial Clubs)/Attack Master (Advanced Clubs)"',
  'Weapon Legend (Crossbows)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Crossbows; Martial Crossbows)/Attack Master (Advanced Crossbows)"',
  'Weapon Legend (Darts)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Darts; Martial Darts)/Attack Master (Advanced Darts)"',
  'Weapon Legend (Flails)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Flails; Martial Flails)/Attack Master (Advanced Flails)"',
  'Weapon Legend (Hammers)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Hammers; Martial Hammers)/Attack Master (Advanced Hammers)"',
  'Weapon Legend (Knives)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Knives; Martial Knives)/Attack Master (Advanced Knives)"',
  'Weapon Legend (Picks)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Picks; Martial Picks)/Attack Master (Advanced Picks)"',
  'Weapon Legend (Polearms)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Polearms; Martial Polearms)/Attack Master (Advanced Polearms)"',
  'Weapon Legend (Slings)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Slings; Martial Slings)/Attack Master (Advanced Slings)"',
  'Weapon Legend (Shields)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Shields; Martial Shields)/Attack Master (Advanced Shields)"',
  'Weapon Legend (Spears)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Spears; Martial Spears)/Attack Master (Advanced Spears)"',
  'Weapon Legend (Swords)':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Swords; Martial Swords)/Attack Master (Advanced Swords)"',
  // Weapon Specialization as above

  'Double Slice':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes simultaneous Strikes with 2 melee weapons at the current multiple attack penalty; a non-agile weapon on the second Strike suffers -2 attack"',
  'Exacting Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike does not count toward the multiple attack penalty on failure"',
  'Point-Blank Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance negates volley penalty from a ranged volley weapon and gives +2 HP damage within the first range increment of a ranged non-volley weapon"',
  'Power Attack':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Melee Strike inflicts %{level<10?1:level<18?2:3} extra damage %{level<10?\'die\':\'dice\'} and counts as 2 Strikes for the multiple attack penalty"',
  'Reactive Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Performs Raise A Shield to absorb damage from the triggering melee Strike"',
  'Snagging Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike with the other hand free inflicts flat-footed until the start of the next turn"',
  // Sudden Charge as above
  'Aggressive Block':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Shield Block moves foe 5\' or inflicts flat-footed (foe\'s choice)"',
  'Assisting Shot':
    'Action=1 ' +
    'Section=combat ' +
    // Errata changes description
    'Note="Successful ranged Strike gives the next ally attack on the target +1 attack, or +2 with a critical success, until the start of the next turn"',
  'Brutish Shove':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Two-handed melee Strike inflicts flat-footed until the end of the turn; success also allows an automatic Shove"',
  'Combat Grab':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike with the other hand free inflicts grabbed until the end of the next turn or until the target Escapes"',
  'Dueling Parry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives +2 Armor Class until the start of the next turn when wielding a one-handed melee weapon with the other hand free"',
  'Intimidating Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful melee Strike inflicts frightened 1, or frightened 2 on a critical hit"',
  'Lunge':'Action=1 Section=combat Note="Makes a melee Strike with +5\' range"',
  'Double Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes 2 ranged Strikes against different foes at the current multiple attack penalty -2"',
  'Dual-Handed Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike with a one-handed weapon and the other hand free inflicts additional damage, equal to its number of damage dice if it has the two-handed trait or by 1 die step otherwise"',
  'Knockdown':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Follows a successful melee Strike with an Athletics check to Trip at the same multiple attack penalty"',
  'Powerful Shove':
    'Section=combat ' +
    'Note="Can use Aggressive Block and Brutish Shove on foes up to 2 sizes larger, inflicting %{strengthModifier>?1} HP if a shoved creature hits a barrier"',
  'Quick Reversal':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes 2 melee Strikes at the current multiple attack penalty on 2 foes flanking self; the second Strike does not increase the multiple attack penalty"',
  'Shielded Stride':
    'Section=combat ' +
    'Note="Can Stride at half Speed with a shield raised without triggering reactions"',
  // Swipe as above
  'Twin Parry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Parrying with a melee weapon in each hand gives +1 Armor Class, or +2 Armor Class if either weapon has the parry trait, until the start of the next turn"',
  // TODO implement?
  'Advanced Weapon Training':
    'Section=combat ' +
    'Note="Has proficiency with advanced weapons equal to martial weapons in a chosen weapon group"',
  'Advantageous Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike on a grabbed, prone, or restrained foe inflicts additional damage equal to the number of damage dice, +2 HP if wielded two-handed, even on failure"',
  'Disarming Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +1 to Disarm and +2 vs. Disarm, and allows Disarming foes 2 sizes larger, when wielding a one-handed weapon with the other hand free"',
  'Furious Focus':
    'Section=combat ' +
    'Note="Two-handed Power Attacks count as single attacks for the multiple attack penalty"',
  "Guardian's Deflection":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives an adjacent ally +2 Armor Class vs. the triggering hit when wielding a one-handed weapon with the other hand free"',
  'Reflexive Shield':
    'Section=save Note="Raised shield adds its bonus to Reflex saves"',
  'Revealing Stab':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful strike vs. a concealed target, or with a DC 5 flat check vs. a hidden target, leaves an embedded piercing weapon that reveals the target to others"',
  'Shatter Defenses':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike vs. a frightened foe inflicts flat-footed while the frightened condition lasts"',
  // Shield Warden as above
  'Triple Shot':
    'Section=combat ' +
    'Note="Can use Double Shot against 1 target or use 3 actions to make 3 ranged Strikes at the current multiple attack penalty -4"',
  'Blind-Fight':
    'Section=combat ' +
    'Note="Can attack concealed foes without a prior check and hidden creatures with a DC 5 flat check/Does not suffer flat-footed vs. hidden foes/Treats adjacent undetected creatures up to level %{level} as hidden instead"',
  'Dueling Riposte':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="While using Dueling Parry, makes a Strike or Disarm attempt on a foe who critically fails an attack on self"',
  'Felling Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike vs. a flying foe causes it to fall 120\', and a critical success grounds it until the end of the next turn"',
  'Incredible Aim':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Ranged Strike gains +2 attack and ignores concealment"',
  'Mobile Shot Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows making ranged Strikes without triggering reactions and using Attack Of Opportunity with a loaded ranged weapon to attack an adjacent creature"',
  'Positioning Assault':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike with a two-handed melee weapon moves a foe 5\' to within reach"',
  // Quick Shield Block as above
  // Sudden Leap as above
  'Agile Grace':
    'Section=combat ' +
    'Note="Reduces multiple attack penalties with agile weapons to -3 and -6"',
  'Certain Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Melee Strike inflicts normal non-dice damage on failure"',
  'Combat Reflexes':
    'Section=combat ' +
    'Note="Gives an additional reaction to make an Attack Of Opportunity once per turn"',
  'Debilitating Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful ranged Strike also inflicts slowed 1 until the end of the target\'s next turn"',
  'Disarming Twist':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike with a one-handed melee weapon and the other hand free inflicts Disarm on success; failure inflicts flat-footed until the end of the turn"',
  'Disruptive Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows using Attack Of Opportunity in response to a concentrate action, and a successful Strike disrupts it"',
  'Fearsome Brute':
    'Section=combat ' +
    'Note="Strikes against frightened foes inflict additional damage equal to %{rank.Intimidation>=2?3:2}x the frightened value"',
  'Improved Knockdown':
    'Section=combat ' +
    'Note="Knockdown automatically inflicts a critical Trip, and using a two-handed weapon causes the Trip to inflict damage based on the weapon damage die size"',
  'Mirror Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Raised shield reflects a critically failed spell attack back upon the caster, using a ranged Strike or spell attack"',
  'Twin Riposte':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Twin Parry allows Striking or Disarming a foe who critically fails a Strike on self"',
  'Brutal Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ends the turn with a two-handed melee Strike that inflicts %{level>=18?\'2 additional damage dice\':\'1 additional damage die\'}, even on failure"',
  'Dueling Dance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives continuous benefits of Dueling Parry"',
  'Flinging Shove':
    'Section=combat ' +
    'Note="Successful Aggressive Block moves the target 10\', or 20\' on a critical success, or inflicts flat-footed, and Brutish Shove moves the target 5\', 10\', or 20\' on failure, success, or critical success"',
  'Improved Dueling Riposte':
    'Section=combat ' +
    'Note="Gives an additional reaction to make a Dueling Riposte once per turn, even when not using Dueling Parry"',
  'Incredible Ricochet':
    'Action=1 ' +
    'Section=combat ' +
    // Errata clarifies the need for a prior ranged Strike
    'Note="Follows a ranged Strike with another against the same foe that ignores concealment and cover"',
  'Lunging Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives Attacks Of Opportunity +5\' reach"',
  "Paragon's Guard":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives continuous benefits of Raise A Shield"',
  'Spring Attack':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike on a foe after Striding away from another"',
  'Desperate Finisher':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Uses a press action after taking the last action in a turn, losing any further reactions until the start of the next turn"',
  'Determination':
    'Action=1 ' +
    'Section=save ' +
    // Errata corrects counteract level
    'Note="Ends a nonpermanent condition or allows a +%{(level+1)//2} counteract attempt to end a nonpermanent spell affecting self once per day"',
  'Guiding Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful Strike moves a foe 10\' to a spot within reach, or 5\' on failure, when wielding a one-handed weapon with a hand free"',
  'Guiding Riposte':
    'Section=combat ' +
    'Note="A successful Dueling Riposte Strike moves the target 10\' to a spot within reach"',
  'Improved Twin Riposte':
    'Section=combat ' +
    'Note="Gives an additional reaction to make a Twin Riposte once per turn, even when not using Twin Parry"',
  'Stance Savant':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Enters a stance during initiative"',
  'Two-Weapon Flurry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strikes with a weapon in each hand"',
  // Whirlwind Strike as above
  'Graceful Poise':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows Double Slice with an agile weapon to count as 1 attack"',
  'Improved Reflexive Shield':
    'Section=combat ' +
    'Note="Using Shield Block on a Reflex save protects both self and adjacent allies"',
  'Multishot Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance reduces Double Shot and Triple Shot penalties to -1 and -2"',
  'Twinned Defense':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives continuous benefits of Twin Parry"',
  'Impossible Volley':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Ranged Strike with a -2 penalty attacks all foes in a 10\' radius"',
  'Savage Critical':
    'Section=combat ' +
    'Note="Successful attack rolls of 19 with a legendary weapon are critical successes"',
  'Boundless Reprisals':
     'Section=combat ' +
     // Errata specified fighter feat or feature
     'Note="Gives an additional reaction to use a fighter feat or class feature once per foe turn"',
  'Weapon Supremacy':
    'Section=combat ' +
    'Note="Permanently quickened; can use the additional action only to Strike"',

  // Monk
  'Adamantine Strikes':
    'Section=combat Note="Unarmed attacks count as adamantine weapons"',
  // Alertness as above
  'Expert Strikes':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  'Flurry Of Blows':
    'Action=1 Section=combat Note="Makes 2 unarmed Strikes once per turn"',
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
      '"Can learn spells from the divine tradition"',
  'Ki Tradition (Occult)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      '"Can learn spells from the occult tradition"',
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
    'Note="Rolls of less than 10 on the first Strike each turn are treated as 10s"',
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
      '"Critical failures on Fortitude saves are normal failures, and failed Fortitude saves inflict half damage"',
  'Third Path To Perfection (Reflex)':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Reflex)",' +
      '"Critical failures on Reflex saves are normal failures, and failed Reflex saves inflict half damage"',
  'Third Path To Perfection (Will)':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Critical failures on Will saves are normal failures, and failed Will saves inflict half damage"',
  // Weapon Specialization as above

  'Crane Stance':
    'Action=1 ' +
    'Section=combat,skill ' +
    'Note=' +
      '"Unarmored stance gives +1 Armor Class and restricts Strikes to crane wing attacks",' +
      '"Unarmored stance gives -5 jump DC and +2\' and +5\' vertical and horizontal Leaps"',
  'Dragon Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows dragon tail attacks and Strides that ignore the first square of difficult terrain"',
  // TODO ff tradition may be divine, rather than occult
  'Ki Rush':
    'Section=magic ' +
    'Note="Knows the Ki Rush occult spell/Has a focus pool and 1 Focus Point"',
  'Ki Strike':
    'Section=magic ' +
    'Note="Knows the Ki Strike occult spell/Has a focus pool and 1 Focus Point"',
  'Monastic Weaponry':
    'Section=combat,combat ' +
    'Note=' +
      // Note: actually applies only to simple and martial monk weapons, but
      // all monk weapons in the core book fall into these categories
      '"Attack %V (Monk Weapons)",' +
      '"Has access to uncommon monk weapons/Can use monk weapons in unarmed Strikes"',
  'Mountain Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance gives +%{4-(dexterityModifier-(combatNotes.mountainQuake?2:combatNotes.mountainStronghold?1:0)>?0)} Armor Class, +2 vs. Shove and Trip, and -5 Speed and restricts Strikes to falling stone attacks"',
  'Tiger Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows 10\' Steps and tiger claw attacks that inflict +1d4 HP persistent bleed damage on a critical success"',
  'Wolf Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows wolf jaw attacks that have the trip trait when flanking"',
  'Brawling Focus':
    'Section=combat ' +
    'Note="Critical hits with a brawling%{combatNotes.monasticWeaponry?\' or trained monk\':\'\'} weapon inflict its critical specialization effect"',
  'Crushing Grab':
    'Section=combat ' +
    'Note="Can inflict %{strengthModifier} HP bludgeoning, lethal or non-lethal, with a successful Grapple"',
  'Dancing Leaf':
    'Section=save,skill ' +
    'Note=' +
      '"Takes no falling damage when adjacent to a wall",' +
      '"+5\' Jump and Leap distance"',
  'Elemental Fist':
    'Section=magic ' +
    'Note="Can inflict electricity, bludgeoning, fire, or cold damage with <i>Ki Strike</i>"',
  'Stunning Fist':
    'Section=combat ' +
    'Note="Can inflict stunned 1 with a successful Flurry Of Blows (<b>save Fortitude</b> negates; critical failure inflicts stunned 3)"',
  'Deflect Arrow':
    'Action=Reaction ' +
    'Section=combat Note="Gives +4 Armor Class vs. a physical ranged attack"',
  'Flurry Of Maneuvers':
    'Section=combat ' +
    'Note="Can use Flurry Of Blows to Grapple, Shove, or Trip"',
  'Flying Kick':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a Strike at the end of a Leap or Jump"',
  'Guarded Movement':
    'Section=combat Note="+4 Armor Class vs. movement reactions"',
  'Stand Still':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike on an adjacent moving foe"',
  'Wholeness Of Body':
    'Section=magic ' +
    'Note="Knows the Wholeness Of Body occult spell/+1 Focus Points"',
  'Abundant Step':
    'Section=magic Note="Knows the Abundant Step occult spell/+1 Focus Points"',
  'Crane Flutter':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Crane Stance gives +3 Armor Class vs. the triggering melee Strike, and a miss allows an immediate -2 Strike"',
  'Dragon Roar':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R15\' Bellow while in Dragon Stance inflicts frightened 1 on foes once per 1d4 rd, and affected adjacent foes cannot reduce their frightened value below 1 (<b>save Will</b> vs. Intimidation negates; critical failure inflicts frightened 2); the first successful Strike before the end of the next turn on a frightened foe inflicts +4 HP"',
  'Ki Blast':
    'Section=magic Note="Knows the Ki Blast occult spell/+1 Focus Points"',
  'Mountain Stronghold':
    'Action=1 ' +
    'Section=combat ' +
    'Note="While in Mountain Stance, gives +2 Armor Class until the beginning of the next turn"',
  'Tiger Slash':
    'Action=2 ' +
    'Section=combat ' +
    'Note="While in Tiger Stance, claw attack inflicts +%{level>14?3:2} damage dice and a 5\' push; critical success also inflicts +%{strengthModifier} HP persistent bleed damage"',
  'Water Step':
    'Section=ability ' +
    'Note="Can Stride across liquids, but must end on a solid surface to avoid sinking"',
  'Whirling Throw':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful Athletics vs. a grabbed or restrained foe\'s Fortitude DC, modified for size differences, allows throwing it %{10+5*strengthModifier}\', inflicting %{(10+5*strengthModifier)//10}d6+%{strengthModifier} HP bludgeoning"',
  'Wolf Drag':
    'Action=2 ' +
    'Section=combat ' +
    'Note="While in Wolf Stance, piercing hand attack gains the fatal d12 trait and knocks prone"',
  'Arrow Snatching':
    'Section=combat ' +
    'Note="Successful Deflect Arrow allows an immediate ranged Strike using the deflected projectile"',
  'Ironblood Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance gives resistance %{level//4>?(combatNotes.ironbloodSurge?strengthModifier:0)} to all damage and allows iron sweep attacks"',
  'Mixed Maneuver':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Uses 2 choices of Grapple, Shove, and Trip at the current multiple attack penalty"',
  'Tangled Forest Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance prevents foes from moving away (<b>save Reflex, Acrobatics, or Athletics</b> negates) and allows lashing branch attacks"',
  'Wall Run':
    'Action=1 Section=ability Note="Strides on vertical surfaces"',
  'Wild Winds Initiate':
    'Section=magic ' +
    'Note="Knows the Wild Winds Stance occult spell/+1 Focus Points"',
  'Knockback Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="A successful unarmed Strike also allows an Athletics check to Shove"',
  'Sleeper Hold':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful grapple also inflicts clumsy 1 for 1 turn, or unconscious for 1 min with a critical success"',
  'Wind Jump':
    'Section=magic Note="Knows the Wind Jump occult spell/+1 Focus Points"',
  'Winding Flow':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Uses 2 choices of Stand, Step, and Stride once per rd"',
  'Diamond Soul':'Section=save Note="+1 vs. magic"',
  'Disrupt Ki':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Unarmed Strike also inflicts %{level<18?2:3}d6 HP persistent negative damage and enfeebled 1 while the persistent damage continues"',
  'Improved Knockback':
    'Section=combat ' +
    'Note="Successful Shove moves +5\' (critical success +10\') and allows following; pushing into an obstacle inflicts %{strengthModifier+(rank.Athletics>3?8:6)} HP bludgeoning"',
  'Meditative Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Stance Savant as above
  'Ironblood Surge':
    // 'Action=1 ' + // inserted into second note
    'Section=combat,combat ' +
    'Note=' +
      '"Has increased Ironblood Stance effects",' +
      '"' + Pathfinder2E.ACTION_MARKS[1] + ' While in Ironblood Stance, gains +1 Armor Class until the start of the next turn"',
  'Mountain Quake':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R20\' Stomp inflicts %{strengthModifier>?0} HP and knocked prone (<b>save basic Fortitude</b>) once per 1d4 rd"',
  'Tangled Forest Rake':
    'Action=1 ' +
    'Section=combat ' +
    'Note="While in Tangled Forest Stance, a successful lashing Strike moves the target 5\' into a space within reach"',
  'Timeless Body':
    'Section=feature,save ' +
    'Note=' +
      '"Does not age",' +
      '"+2 vs. poisons and diseases and has Resistance %{level//2} to poison"',
  'Tongue Of Sun And Moon':
    'Section=skill Note="Can speak and understand all spoken languages"',
  'Wild Winds Gust':
    'Action=2 ' +
    'Section=magic ' +
    'Note="Makes a Wild Winds Stance Strike against all creatures in a 30\' cone or 60\' line at the current multiple attack penalty"',
  'Enlightened Presence':
    'Section=save ' +
    'Note="R15\' Gives self and allies +2 Will vs. mental effects"',
  'Master Of Many Styles':
    'Action=Free ' +
    'Section=combat Note="Enters a stance at the beginning of a turn"',
  'Quivering Palm':
    'Section=magic ' +
    'Note="Knows the Quivering Palm occult spell/+1 Focus Points"',
  'Shattering Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Unarmed Strike bypasses target resistances and ignores half of target\'s Hardness"',
  'Diamond Fists':
    'Section=combat ' +
    'Note="Unarmed Strikes gain the forceful trait or increase damage by 1 die step"',
  'Empty Body':
    'Section=magic Note="Knows the Empty Body occult spell/+1 Focus Points"',
  'Meditative Wellspring':
    'Section=magic Note="Refocus restores 3 Focus Points"',
  'Swift River':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Ends a Speed status penalty or condition at the end of a turn"',
  'Enduring Quickness':
    'Section=combat ' +
    'Note="Permanently quickened; cane use the additional action to Stride, Leap, or Jump"',
  'Fuse Stance':
    'Section=combat ' +
    'Note="Has merged 2 known stances into a unique new stance that grants the effects of both"',
  'Impossible Technique':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Forces a foe reroll on a hit or gives a reroll on a failed save"',

  // Ranger
  // Evasion as above
  // Greater Weapon Specialization as above
  'Hunt Prey':
    'Action=1 ' +
    'Section=combat,skill ' +
    'Note=' +
      '"Suffers no distance penalty for ranged Strikes in the 2nd range increment vs. a designated creature until next daily prep",' +
      '"Gives +2 Perception to Seek and +2 Survival to Track a designated creature until next daily prep"',
  "Hunter's Edge":'Section=feature Note="1 selection"',
  'Flurry':
    'Section=combat ' +
    'Note="Reduces multiple attack penalties vs. hunted prey to -3 and -6, or -2 and -4 with an agile weapon"',
  'Outwit':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 Armor Class vs. hunted prey",' +
      '"+2 Deception, Intimidation, Stealth, and Recall Knowledge checks with hunted prey"',
  'Precision':
    'Section=combat ' +
    'Note="First hit on hunted prey each rd inflicts +%{level<11?1:level<19?2:3}d8 HP precision"',
  'Improved Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Reflex)",' +
      '"Critical failures on Reflex saves are normal failures, and failed Reflex saves inflict half damage"',
  'Incredible Senses':'Section=skill Note="Perception Legendary"',
  // Iron Will as above
  // Juggernaut as above
  'Masterful Hunter':
    'Section=combat,combat,skill ' +
    'Note=' +
      '"Class Master (Ranger)",' +
      '"Master weapon proficiency negates distance penalty when attacking hunted prey in the 3rd range increment of a ranged weapon%{features.Flurry?\' and reduces multiple attack penalties vs. hunted prey to -2 and -4, or -1 and -2 with an agile weapon\':\'\'}%{features.Outwit?\'/Master armor proficiency gives +2 Armor Class vs. hunted prey\':\'\'}%{features.Precision?(level>=19?\'/2nd and 3rd hits on hunted prey inflict +2d8 HP and +1d8 HP precision\':\'/2nd hit on hunted prey inflicts +1d8 HP precision\'):\'\'}",' +
      '"Master proficiency gives +4 Perception to Seek hunted prey%{features.Outwit?\',\':\' and\'} +4 Survival to Track hunted prey%{features.Outwit?\', and +4 Deception, Intimidation, Stealth, and Recall Knowledge checks on hunted prey\':\'\'}"',

  // Medium Armor Expertise as above
  "Nature's Edge":
    'Section=combat ' +
    'Note="Foes suffer flat-footed vs. self from natural uneven ground or natural or snare-related difficult terrain"',
  'Ranger Expertise':'Section=combat Note="Class Expert (Ranger)"',
  'Ranger Feats':'Section=feature Note="%V selections"',
  'Ranger Key Ability':'Section=feature Note="1 selection"',
  'Ranger Skills':
    'Section=skill Note="Skill Trained (Nature; Survival; Choose %V from any)"',
  'Ranger Weapon Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"Critical hits with a simple weapon, martial weapon, or unarmed attack vs. hunted prey inflict its critical specialization effect"',
  'Second Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Master (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"Can rest normally in light or medium armor"',
  'Swift Prey':
    'Section=combat ' +
    'Note="Can use Hunt Prey as a free action at the beginning of a turn"',
  'Trackless Step':
    'Section=skill ' +
    'Note="Has continuous benefits of the Cover Tracks action while moving at full Speed in natural terrain"',
  // Vigilant Senses as above
  'Wild Stride':
    'Section=ability ' +
    'Note="Moves normally over non-magical difficult terrain and treats non-magical greater difficult terrain as difficult terrain"',
  // Weapon Mastery as above
  // Weapon Specialization as above

  // Animal Companion as above
  'Crossbow Ace':
    'Section=combat ' +
    'Note="Crossbow inflicts +2 HP damage after using Hunt Prey or reloading, and a simple crossbow also increases its damage die by 1 step, until the end of the next turn"',
  'Hunted Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes 2 ranged Strikes against hunted prey once per rd"',
  'Monster Hunter':
    'Section=combat ' +
    'Note="Can use Recall Knowledge as part of Hunt Prey; %{combatNotes.masterMonsterHunter?\'\':\'critical \'}success gives +%{1+(combatNotes.legendaryMonsterHunter?1:0)} attack to self and allies on the next attack once per target per day"',
  'Twin Takedown':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strikes hunted prey with a melee weapon in each hand once per rd"',
  'Favored Terrain (Aquatic)':
    'Section=ability ' +
    'Note="Moves normally through underwater non-magical difficult terrain%{$\'features.Wild Stride\'?\'/Has a \' + speed + \\"\' swim Speed\\":\'\'}"',
  'Favored Terrain (Arctic)':
    'Section=ability,save ' +
    'Note=' +
      '"Moves normally over non-magical difficult terrain caused by ice and snow without a need to Balance",' +
      '"Can survive on 1/10 normal food and water/Unaffected by extreme cold"',
  'Favored Terrain (Desert)':
    'Section=ability,save ' +
    'Note=' +
      '"Moves normally over non-magical difficult terrain caused by sand%{$\'features.Wild Stride\'?\' without a need to Balance\':\'\'}",' +
      '"Can survive on 1/10 normal food and water/Unaffected by extreme heat"',
  'Favored Terrain (Forest)':
    'Section=ability ' +
    'Note="Moves normally over non-magical difficult terrain caused by forest%{$\'features.Wild Stride\'?\'/Has a \' + speed + \\"\' climb Speed\\":\'\'}"',
  'Favored Terrain (Mountain)':
    'Section=ability ' +
    'Note="Moves normally over non-magical difficult terrain caused by mountains%{$\'features.Wild Stride\'?\'/Has a \' + speed + \\"\' climb Speed\\":\'\'}"',
  'Favored Terrain (Plains)':
    'Section=ability,ability ' +
    'Note=' +
      '"Moves normally over non-magical difficult terrain in plains",' +
      '"+%V Speed"',
  'Favored Terrain (Sky)':
    'Section=ability ' +
    'Note="Moves normally through non-magical difficult terrain in the sky%{$\'features.Wild Stride\'?\'/+10 fly Speed\':\'\'}"',
  'Favored Terrain (Swamp)':
    'Section=ability ' +
    'Note="Moves normally over non-magical%{$\'features.Wild Stride\'?\' greater\':\'\'} difficult terrain caused by bogs"',
  'Favored Terrain (Underground)':
    'Section=ability ' +
    'Note="Moves normally over non-magical difficult terrain underground%{$\'features.Wild Stride\'?\'/Has a \' + speed + \\"\' climb Speed\\":\'\'}"',
  "Hunter's Aim":
    'Action=2 ' +
    'Section=combat ' +
    'Note="+2 ranged Strike vs. hunted prey ignores concealment"',
  'Monster Warden':
    'Section=combat ' +
    'Note="Successful use of Monster Hunter also gives self and allies +%{1+(combatNotes.legendaryMonsterHunter?1:0)} Armor Class on the next attack and +%{1+(combatNotes.legendaryMonsterHunter?1:0)} on the next save vs. hunted prey"',
  'Quick Draw':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Draws a weapon and Strikes"',
  // Wild Empathy as above
  "Companion's Cry":
    'Section=combat ' +
    'Note="Can use 2 actions for Command An Animal to give companion an additional action"',
  // Errata corrects to Action=Reaction
  'Disrupt Prey':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike when hunted prey within reach uses a manipulate or move action or leaves a square while moving; critical success disrupts the action"',
  'Far Shot':'Section=combat Note="Doubles ranged weapon increments"',
  'Favored Enemy':
    'Section=combat ' +
    'Note="Can use Hunt Prey with a chosen creature type as a free action during initiative"',
  'Running Reload':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Reloads during a Stride, Step, or Sneak"',
  "Scout's Warning":
    'Action=Free Section=combat Note="Gives allies +1 initiative"',
  'Snare Specialist':
    'Section=skill ' +
    'Note="Knows the formulas for %{rank.Crafting*3-3} snares; may prepare %{rank.Crafting*2*(skillNotes.ubiquitousSnares?2:1)} each day without using resources"',
  // Twin Parry as above
  // Mature Animal Companion as above
  'Quick Snares':'Section=skill Note="Can prepare snares with 3 actions"',
  'Skirmish Strike':
    'Action=1 Section=combat Note="Steps before or after a Strike"',
  'Snap Shot':
    'Section=combat ' +
    'Note="Can use a ranged weapon during a reaction to Strike an adjacent creature"',
  'Swift Tracker':
    'Section=combat,skill ' +
    'Note=' +
      '"Can Stride toward hunted prey as a free action when using Survival for initiative",' +
      '"Can Track at full Speed%{rank.Survival>=3?\' without hourly Survival checks\':\'\'}%{rank.Survival>=4?\'/Can perform other exploration activities while tracking\':\'\'}"',

  // Blind-Fight as above
  'Deadly Aim':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ranged Strike with a -2 penalty vs. hunted prey inflicts +%{level<11?4:level<15?6:8} HP"',
  'Hazard Finder':
    'Section=combat,save,skill ' +
    'Note=' +
      '"+1 Armor Class vs. traps",' +
      '"+1 vs. trap effects",' +
      '"+1 Perception to find traps and hazards/Automatically attempts Search to find hazards"',
  'Powerful Snares':
    'Section=skill ' +
    'Note="Created snares have a DC of at least %{classDifficultyClass.Ranger}"',
  'Terrain Master':
    'Section=ability ' +
    'Note="Can train for 1 hr to make current natural terrain favored until away from it for 1 day"',
  "Warden's Boon":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Shares Hunt Prey and Hunter\'s Edge benefits with an ally until the end of its next turn"',
  // Errata clarifies effects
  'Camouflage':
    'Section=skill ' +
    'Note="Can use Hide and Sneak in natural terrain without cover"',
  // Incredible Companion as above
  'Master Monster Hunter':
    'Section=combat,skill ' +
    'Note=' +
      '"Has increased Monster Hunter effects",' +
      '"Can use Nature to Recall Knowledge to identify any creature"',
  'Penetrating Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strike affects both a target and a creature giving it lesser cover"',
  // Twin Riposte as above
  "Warden's Step":
    'Section=skill ' +
    // Nethys changes Sneak to Avoid Notice
    'Note="Can include allies in an Avoid Notice action in natural terrain"',
  'Distracting Shot':
    'Section=combat ' +
    'Note="Critical or double hit on hunted prey inflicts flat-footed until the start of the next turn"',
  'Double Prey':'Section=combat Note="Can use Hunt Prey on 2 targets"',
  'Lightning Snares':'Section=skill Note="Can Craft a trap with 1 action"',
  'Second Sting':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Failed Strike vs. hunted prey with a melee weapon inflicts the non-dice damage of the weapon in the other hand"',
  // Side By Side as above
  'Sense The Unseen':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Makes undetected foes hidden after a failed Seek"',
  'Shared Prey':
    'Section=combat ' +
    'Note="Can share with an ally the benefits of Hunt Prey and Flurry, Outwit, or Precision on a single target"',
  'Stealthy Companion':
    'Section=skill ' +
    'Note="Companion gains the benefits of Camouflage, and an ambusher companion gains an increase in Stealth rank"',
  'Targeting Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ranged attack vs. hunted prey ignores cover and concealment"',
  "Warden's Guidance":
    'Section=skill ' +
    'Note="While observing hunted prey, ally failures and critical failures to Seek prey are successes"',
  'Greater Distracting Shot':
    'Section=combat ' +
    'Note="Ranged hit on hunted prey inflicts flat-footed until the start of the next turn, or until the end of the next turn on a critical success or double hit"',
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':
    'Section=combat Note="Has increased Monster Hunter effects"',
  // Specialized Companion as above
  'Ubiquitous Snares':
    'Section=skill Note="Has increased Snare Specialist effects"',
  'Impossible Flurry':
    'Action=3 ' +
    'Section=combat ' +
    'Note="While wielding 2 melee weapons, makes 3 melee Strikes with each at the maximum multiple attack penalty"',
  // Impossible Volley as above
  'Manifold Edge':
    'Section=combat ' +
    'Note="Can use a different Hunter\'s Edge benefit with Hunt Prey"',
  'Masterful Companion':
    'Section=combat ' +
    'Note="Gives companion Masterful Hunter effects vs. hunted prey"',
  'Perfect Shot':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Ranged Strike on hunted prey inflicts maximum damage on success and ends turn"',
  'Shadow Hunter':
    'Section=skill ' +
    'Note="Has continuous concealment from foes other than hunted prey in natural surroundings"',
  'Legendary Shot':
    'Section=combat ' +
    'Note="Ignores 5 range increments when attacking hunted prey with a master proficiency weapon"',
  'To The Ends Of The Earth':
    'Section=skill Note="Can follow hunted prey across any distance"',
  'Triple Threat':
    'Section=combat ' +
    'Note="Can use Hunt Prey with 3 targets, share two-target Hunt Prey effects with 1 ally, or share single-target Hunt Prey effects with 2 allies"',
  'Ultimate Skirmisher':
    'Section=ability,save ' +
    'Note=' +
      '"Moves normally over difficult, greater difficult, and hazardous terrain",' +
      '"Never triggers movement-triggered traps or hazards"',

  // Rogue
  'Debilitating Strike':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Successful Strike against a flat-footed foe also inflicts %{combatNotes.doubleDebilitation?\'2 choices\':\'a choice\'} from: %{combatNotes.preciseDebilitations?\'+2d6 HP precision; flat-footed; \':\'\'}%{combatNotes.viciousDebilitations?\'weakness 5 to a choice of damage type; clumsy 1; \':\'\'}%{combatNotes.tacticalDebilitations?\'prevent reactions; prevent flanking; \':\'\'}%{combatNotes.criticalDebilitation?\'slowed 2 until the end of the next turn (<b>save Fortitude</b> inflicts slowed 1, critical success negates, and critical failure inflicts paralyzed); \':\'\'}-10 Speed unti the end of the next turn; enfeebled 1 until the end of the next turn"',
  // Deny Advantage as above
  'Double Debilitation':
    'Section=combat Note="Has increased Debilitating Strike effects"',
  // Evasion as above
  // Great Fortitude as above
  // Greater Weapon Specialization as above
  // Improved Evasion as above
  // Incredible Senses as above
  // Light Armor Expertise as above
  'Light Armor Mastery':
    'Section=combat Note="Defense Master (Light Armor; Unarmored Defense)"',
  'Master Strike':
    // 'Action=Free ' + // included in second note
    'Section=combat,combat ' +
    'Note=' +
      '"Class Master (Rogue)",' +
      '"' + Pathfinder2E.ACTION_MARKS.Free + ' Successful Strike on a flat-footed foe inflicts paralyzed for 4 rd once per target per day; (<b>save Fortitude</b> inflicts enfeebled 2 until the end of the next turn; critical success negates; critical failure inflicts a choice of paralyzed for 4 rd, unconscious for 2 hr, or killed)"',
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
      '"Can use any simple weapon to sneak attack/Critical hits with a d8 or lighter simple weapon on a flat-footed foe inflict its critical specialization effect",' +
      '"Skill Trained (Intimidation)"',
  'Scoundrel':
    'Section=combat,skill ' +
    'Note=' +
      '"Successful Feint inflicts flat-footed on foe vs. self attacks, or all attacks on a critical success, until the end of the next turn",' +
      '"Skill Trained (Deception; Diplomacy)"',
  'Slippery Mind':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Sneak Attack':
    'Section=combat ' +
    'Note="Successful strike using an agile, finesse, or projectile weapon vs. a flat-footed foe inflicts +%{levels.Rogue?(level+7)//6:1}d%{levels.Rogue?6:level>=6?6:4} HP precision damage"',
  'Surprise Attack':
    'Section=combat ' +
    'Note="Rolling Deception or Stealth for initiative inflicts flat-footed vs. self on creatures that haven\'t acted"',
  'Thief':
    'Section=combat,skill ' +
    'Note=' +
      '"+%V damage with finesse melee weapons",' +
      '"Skill Trained (Thievery)"',
  // Vigilant Senses as above
  'Weapon Tricks':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks)",' +
      '"Critical hits with an unarmed attack, rogue weapon, or a simple agile or finesse weapon vs. a flat-footed foe inflict its critical specialization effect"',
  // Weapon Specialization as above

  'Nimble Dodge':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives +2 Armor Class against the triggering attack when unencumbered"',
  'Trap Finder':
    'Section=combat,save,skill ' +
    'Note=' +
      '"+%{rank.Thievery>=3?2:1} Armor Class vs. traps",' +
      '"+%{rank.Thievery>=3?2:1} vs. traps",' +
      '"Gives +%{rank.Thievery>=3?2:1} Perception and automatic Searches to find traps and allows disabling traps that require %{rank.Thievery>=3 ? \'legendary\' : \'master\'} proficiency in Thievery"',
  'Twin Feint':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strikes with a melee weapon in each hand, inflicting flat-footed vs. the second"',
  "You're Next":
    // 'Action=Reaction ' + // included in note
    'Section=combat ' +
    'Note="%{rank.Intimidation>=4?\'' + Pathfinder2E.ACTION_MARKS.Free + '\':\'' + Pathfinder2E.ACTION_MARKS.Reaction + '\'} After downing a foe, makes a +2 Intimidation check to Demoralize another"',
  'Brutal Beating':
    'Section=combat Note="Critical successes on Strikes inflict frightened 1"',
  'Distracting Feint':
    'Section=combat ' +
    'Note="Successful Feints inflict -2 Perception and Reflex saves while the target remains flat-footed"',
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
    'Section=combat ' +
    'Note="Can Stride at half Speed without triggering reactions"',
  // Quick Draw as above
  'Unbalancing Blow':
    'Section=combat ' +
    'Note="Critical hits inflict flat-footed vs. self attacks until the end of the next turn"',
  'Battle Assessment':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Perception vs. Deception or Stealth DC determines target\'s strengths and weaknesses"',
  'Dread Striker':
    'Section=combat Note="Frightened foes are flat-footed vs. self attacks"',
  'Magical Trickster':
    'Section=magic ' +
    'Note="Spell attacks vs. flat-footed foes inflict sneak attack damage"',
  'Poison Weapon':
    // 'Action=1 ' + // included in first note
    'Section=combat,skill ' +
    'Note=' +
      '"' + Pathfinder2E.ACTION_MARKS[1] + ' Applies a poison that lasts until the end of the next turn to a piercing or slashing weapon",' +
      '"Can prepare %{level} poisons that inflict 1d4 HP poison during daily prep"',
  'Reactive Pursuit':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Moves to remain adjacent to a retreating foe"',
  'Sabotage':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Thievery vs. Reflex inflicts %{skillModifiers.Thievery*2} HP damage, or %{skillModifiers.Thievery*4} HP on a critical success, to an item with moving parts possessed by a creature within reach"',
  // Scout's Warning as above
  'Gang Up':
    'Section=combat ' +
    'Note="Foes within reach of an ally are flat-footed vs. self attacks"',
  'Light Step':
    'Section=ability ' +
    'Note="Can Stride or Step normally over difficult terrain"',
  // Skirmish Strike as above
  'Twist The Knife':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Inflicts %{(level+7)//6} HP persistent bleed damage after a successful sneak attack on a flat-footed foe"',
  // Blind-Fight as above
  'Delay Trap':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Successful +5 DC Thievery check delays or disables triggering trap activation; critical failure inflicts flat-footed until the start of the next turn"',
  'Improved Poison Weapon':
    'Section=combat ' +
    'Note="Poisoned weapons inflict +2d4 HP poison, and a critical miss does not waste the poison"',
  'Nimble Roll':
    'Section=save ' +
    'Note="Can use Nimble Dodge before a Reflex save; success allows a 10\' Stride"',
  'Opportune Backstab':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Strikes a foe immediately after an ally hits it"',
  'Sidestep':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Redirects a failed Strike on self to an adjacent creature"',
  'Sly Striker':
    'Section=combat ' +
    'Note="Successful Strikes with a sneak attack weapon inflict %{combatNotes.impossibleStriker?\'full sneak attack\':level>=14?\'+2d6 HP precision\':\'+1d6 HP precision\'} damage"',
  'Precise Debilitations':
    'Section=combat Note="Has increased Debilitating Strike effects"',
  'Sneak Savant':
    'Section=skill Note="Normal failures on Sneak actions are successes"',
  'Tactical Debilitations':
    'Section=combat Note="Has increased Debilitating Strike effects"',
  'Vicious Debilitations':
    'Section=combat Note="Has increased Debilitating Strike effects"',
  'Critical Debilitation':
    'Section=combat Note="Has increased Debilitating Strike effects"',
  'Fantastic Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strikes after Long Jump or a High Jump that uses Long Jump distance"',
  'Felling Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike vs. a flat-footed airborne foe inflicts a 120\' fall (<b>save Reflex</b> negates; critical failure also inflicts grounded until the end of the next turn)"',
  'Reactive Interference':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Prevents an adjacent foe reaction; a higher-level foe requires a successful attack roll"',
  'Spring From The Shadows':
    'Action=1 Section=combat Note="Strikes a foe after an undetected Stride"',
  'Defensive Roll':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Negates half the damage from an attack that would reduce self to 0 HP once per 10 min"',
  'Instant Opening':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Inflicts flat-footed vs. self attacks until the end of the next turn"',
  'Leave An Opening':
    'Section=combat ' +
    'Note="Critical hit on a flat-footed foe allows a chosen ally to make an Attack Of Opportunity"',
  // Sense The Unseen as above
  'Blank Slate':
    'Section=save ' +
    // Errata changes the counteract level
    'Note="Immune to detection, revelation and scrying effects of less than counteract level 10"',
  'Cloud Step':
    'Section=ability ' +
    'Note="Can Stride over insubstantial surfaces and weight-triggered traps"',
  'Cognitive Loophole':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="At the end of a turn, suppresses a mental effect affecting self until the end of the next turn"',
  'Dispelling Slice':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful sneak attack allows a level %{(level+1)//2}, +%{classDifficultyClass.Rogue-10} counteract attempt to dispel a magical effect"',
  'Perfect Distraction':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Creates a decoy that gives <i>Mislead</i> effects once per 10 min"',
  'Implausible Infiltration':
    'Action=2 ' +
    'Section=ability ' +
    'Note="Can move through up to 10\' of wood, plaster, or stone"',
  'Powerful Sneak':
    'Section=combat ' +
    'Note="Can change sneak attack damage to match weapon damage type"',
  "Trickster's Ace":
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Previously-specified trigger invokes a prepared spell of up to level 4 on self"',
  'Hidden Paragon':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Becomes invisible for 1 min when hidden from foes once per hr"',
  'Impossible Striker':
    'Section=combat Note="Has increased Sly Striker effects"',
  'Reactive Distraction':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Uses Perfect Distraction to redirect the triggering effect or attack on self to a decoy"',

  // Sorcerer
  // Alertness as above
  'Bloodline':'Section=feature Note="1 selection"',
  'Bloodline Paragon':'Section=magic Note="Has 1 10th-level spell slot"',
  'Bloodline Spells':'Section=magic Note="Has a focus pool and 1 Focus Point"',
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
    'Section=magic Note="Can learn spells from the %V tradition"',
  // Nethys changes Simple Weapon Expertise to Weapon Expertise
  // Weapon Expertise as above
  // Weapon Specialization as above

  'Aberrant':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)/Knows the Tentacular Limbs occult spell",' +
      '"Casting a bloodline spell gives self or a target +2 Will saves for 1 rd",' +
      '"Skill Trained (Intimidation; Occultism)"',
  'Angelic':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Angelic Halo divine spell",' +
      '"Casting a bloodline spell gives self or a target +1 saves for 1 rd",' +
      '"Skill Trained (Diplomacy; Religion)"',
  'Demonic':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Glutton\'s Jaws divine spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts -1 Armor Class on a target for 1 rd",' +
      '"Skill Trained (Intimidation; Religion)"',
  'Diabolic':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Diabolic Edict divine spell",' +
      '"Casting a bloodline spell gives self +1 Deception for 1 rd or inflicts 1 HP fire per spell level on a target",' +
      '"Skill Trained (Deception; Religion)"',
  'Draconic (Brass)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Bronze)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Copper)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Gold)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Silver)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Black)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Blue)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Green)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Red)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (White)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Elemental (Air)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning per spell level on a target",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Elemental (Earth)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning per spell level on a target",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Elemental (Fire)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP fire per spell level on a target",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Elemental (Water)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning per spell level on a target",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Fey':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Faerie Dust primal spell",' +
      '"Casting a bloodline spell gives self or a target concealment for 1 rd",' +
      '"Skill Trained (Deception; Nature)"',
  'Hag':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)/Knows the Jealous Hex occult spell",' +
      '"Casting a bloodline spell inflicts 2 HP mental per spell level (<b>save basic Will</b>) on the first successful attacker before the end of the next turn",' +
      '"Skill Trained (Deception; Occultism)"',
  'Imperial':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Ancestral Memories arcane spell",' +
      '"Casting a bloodline spell gives self or a target +1 skill checks for 1 rd",' +
      '"Skill Trained (Arcana; Society)"',
  'Undead':
    'Section=magic,magic,skill ' +
    'Note=' +
      // Errata changes Touch Of Undeath to Undeath's Blessing
      '"Spell Trained (Divine)/Knows the Undeath\'s Blessing divine spell",' +
      '"Casting a bloodline spell gives self 1 temporary HP per spell level for 1 rd or inflicts 1 HP negative per spell level on a target",' +
      '"Skill Trained (Intimidation; Religion)"',

  'Counterspell':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Expends a spell slot to attempt to counteract a spell with the same spell"',
  'Dangerous Sorcery':
    'Section=magic ' +
    'Note="Using a spell slot to cast an instantaneous harmful spell inflicts additional damage equal to its level"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Section=magic,skill ' +
    'Note=' +
      '"Can learn 1 additional spell from spellbook each day, treating it as a signature spell if it is in repertoire",' +
      '"Skill Trained (Choose 1 from any)"',
  'Bespell Weapon':
    'Action=Free ' +
    'Section=magic ' +
    'Note="After casting a non-cantrip spell, causes a wielded weapon to inflict +1d6 HP until the end of the turn once per turn; the damage type depends on the spell school"',
  'Divine Evolution':
    'Section=magic Note="+1 D%V slot for <i>Heal</i> or <i>Harm</i>"',
  'Occult Evolution':
    'Section=magic,skill ' +
    'Note=' +
      '"Can add 1 unknown mental occult spell to repertoire each day until next daily prep",' +
      '"Skill Trained (Choose 1 from any)"',
  'Primal Evolution':
    'Section=magic ' +
    // Nethys fixes Summon Plant Or Fungus name
    'Note="+1 P%V slot for <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i>"',
  'Advanced Bloodline (Aberrant)':
    'Section=magic ' +
    'Note="Knows the Aberrant Whispers occult spell/+1 Focus Points"',
  'Advanced Bloodline (Angelic)':
    'Section=magic Note="Knows the Angelic Wings divine spell/+1 Focus Points"',
  'Advanced Bloodline (Demonic)':
    'Section=magic ' +
    'Note="Knows the Swamp Of Sloth divine spell/+1 Focus Points"',
  'Advanced Bloodline (Diabolic)':
    'Section=magic ' +
    'Note="Knows the Embrace The Pit divine spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Black))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Blue))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Brass))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Bronze))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Copper))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Gold))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Green))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Red))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (Silver))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Draconic (White))':
    'Section=magic Note="Knows the Dragon Breath arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Elemental (Air))':
    'Section=magic ' +
    'Note="Knows the Elemental Motion primal spell/+1 Focus Points"',
  'Advanced Bloodline (Elemental (Earth))':
    'Section=magic ' +
    'Note="Knows the Elemental Motion primal spell/+1 Focus Points"',
  'Advanced Bloodline (Elemental (Fire))':
    'Section=magic ' +
    'Note="Knows the Elemental Motion primal spell/+1 Focus Points"',
  'Advanced Bloodline (Elemental (Water))':
    'Section=magic ' +
    'Note="Knows the Elemental Motion primal spell/+1 Focus Points"',
  'Advanced Bloodline (Fey)':
    'Section=magic ' +
    'Note="Knows the Fey Disappearance primal spell/+1 Focus Points"',
  'Advanced Bloodline (Hag)':
    'Section=magic ' +
    'Note="Knows the Horrific Visage occult spell/+1 Focus Points"',
  'Advanced Bloodline (Imperial)':
    'Section=magic Note="Knows the Extend Spell arcane spell/+1 Focus Points"',
  'Advanced Bloodline (Undead)':
    'Section=magic Note="Knows the Drain Life divine spell/+1 Focus Points"',
  // Steady Spellcasting as above
  'Bloodline Resistance':
    'Section=save Note="+1 vs. spells and magical effects"',
  'Crossblooded Evolution':
    'Section=magic ' +
    'Note="Can have 1 spell from a different tradition in repertoire"',
  'Greater Bloodline (Aberrant)':
    'Section=magic ' +
    'Note="Knows the Unusual Anatomy occult spell/+1 Focus Points"',
  'Greater Bloodline (Angelic)':
    'Section=magic ' +
    'Note="Knows the Celestial Brand divine spell/+1 Focus Points"',
  'Greater Bloodline (Demonic)':
    'Section=magic Note="Knows the Abyssal Wrath divine spell/+1 Focus Points"',
  'Greater Bloodline (Diabolic)':
    'Section=magic ' +
    'Note="Knows the Hellfire Plume divine spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Black))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Blue))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Brass))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Bronze))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Copper))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Gold))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Green))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Red))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (Silver))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Draconic (White))':
    'Section=magic Note="Knows the Dragon Wings arcane spell/+1 Focus Points"',
  'Greater Bloodline (Elemental (Air))':
    'Section=magic ' +
    'Note="Knows the Elemental Blast primal spell/+1 Focus Points"',
  'Greater Bloodline (Elemental (Earth))':
    'Section=magic ' +
    'Note="Knows the Elemental Blast primal spell/+1 Focus Points"',
  'Greater Bloodline (Elemental (Fire))':
    'Section=magic ' +
    'Note="Knows the Elemental Blast primal spell/+1 Focus Points"',
  'Greater Bloodline (Elemental (Water))':
    'Section=magic ' +
    'Note="Knows the Elemental Blast primal spell/+1 Focus Points"',
  'Greater Bloodline (Fey)':
    'Section=magic Note="Knows the Fey Glamour primal spell/+1 Focus Points"',
  'Greater Bloodline (Hag)':
    'Section=magic Note="Knows the You\'re Mine occult spell/+1 Focus Points"',
  'Greater Bloodline (Imperial)':
    'Section=magic ' +
    'Note="Knows the Arcane Countermeasure arcane spell/+1 Focus Points"',
  'Greater Bloodline (Undead)':
    'Section=magic ' +
    'Note="Knows the Grasping Grave divine spell/+1 Focus Points"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Magic Sense':
    'Section=magic ' +
    'Note="Has continuous 1st-level <i>Detect Magic</i> effects that increase to 3rd-level during Seek"',
  'Interweave Dispel':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Expends a spell slot to add <i>Dispel Magic</i> effects to a successful single-target spell"',
  'Reflect Spell':
    'Section=magic ' +
    'Note="Can cause a successful Counterspell to inflict the spell effects on the caster"',
  // Effortless Concentration as above
  'Greater Mental Evolution':
    'Section=magic Note="Adds 1 spell of each level to repertoire"',
  'Greater Vital Evolution':
    'Section=magic ' +
    'Note="Can cast 2 additional spells of different levels after spell slots in each level are exhausted once per day"',
  'Bloodline Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  'Greater Crossblooded Evolution':
    'Section=magic ' +
    'Note="Can have 3 spells of different levels from different traditions in repertoire"',
  'Bloodline Conduit':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Invokes an instantaneous spell of 5th level or lower without expending a spell slot once per min"',
  'Bloodline Perfection':'Section=magic Note="+1 10th level spell slot"',
  'Metamagic Mastery':
    'Section=magic ' +
    'Note="Can use 1-action metamagic effects as free actions"',

  // Wizard
  // Alertness as above
  'Arcane Bond':'Section=feature Note="Has the Drain Bonded Item feature"',
  'Arcane School':'Section=feature Note="1 selection"',
  'Arcane Spellcasting':
    'Section=magic Note="Can learn spells from the arcane tradition"',
  'Arcane Thesis':'Section=feature Note="1 selection"',
  "Archwizard's Spellcraft":'Section=magic Note="Has 1 10th-level spell slot"',
  // Defensive Robes as above
  'Drain Bonded Item':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Can cast an expended spell using power stored in a possession once per day"',
  // Expert Spellcaster as above
  'Improved Familiar Attunement':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Familiar feature",' +
      '"Familiar is the focus of Arcane Bond and has %{level//6+1} additional %{level>5?\'abilities\':\'ability\'}"',
  // Legendary Spellcaster as above
  // Lightning Reflexes as above
  // Magical Fortitude as above
  // Master Spellcaster as above
  'Metamagical Experimentation':
    'Section=feature,magic ' +
    'Note=' +
      '"+1 Class Feat (metamagic wizard)",' +
      '"Can choose 1 metamagic feat of up to level %{level//2} to use each day during daily prep"',
  // Resolve as above
  'Spell Blending':
    'Section=magic ' +
    'Note="Can use 2 spell slots from a level to prepare a spell up to 2 levels higher or use a spell slot to prepare 2 cantrips"',
  'Spell Substitution':
    'Section=magic ' +
    'Note="Can use a 10-min process to replace 1 prepared spell with a different spell"',
  'Universalist':
    'Section=feature,magic ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can use Drain Bonded Item once per spell level each day/Knows 1 additional 1st-level spell"',
  // Weapon Specialization as above
  'Wizard Feats':'Section=feature Note="%V selections"',
  'Wizard Skills':
    'Section=skill Note="Skill Trained (Arcana; Choose %V from any)"',
  'Wizard Weapon Expertise':
    'Section=feature ' +
    'Note="Attack Expert (Club; Crossbow; Dagger; Heavy Crossbow; Staff; Unarmed Attacks)"',

  'Abjuration':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Protective Ward arcane spell",' +
      '"Knows 1 additional 1st-level abjuration spell"',
  'Conjuration':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Augment Summoning arcane spell",' +
      '"Knows 1 additional 1st-level conjuration spell"',
  'Divination':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Diviner\'s Sight arcane spell",' +
      '"Knows 1 additional 1st-level divination spell"',
  'Enchantment':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Charming Words arcane spell",' +
      '"Knows 1 additional 1st-level enchantment spell"',
  'Evocation':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Force Bolt arcane spell",' +
      '"Knows 1 additional 1st-level evocation spell"',
  'Illusion':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Warped Terrain arcane spell",' +
      '"Knows 1 additional 1st-level illusion spell"',
  'Necromancy':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Call Of The Grave arcane spell",' +
      '"Knows 1 additional 1st-level necromancy spell"',
  'Transmutation':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Physical Boost arcane spell",' +
      '"Knows 1 additional 1st-level transmutation spell"',

  // Counterspell as above
  'Eschew Materials':
    'Section=magic ' +
    'Note="Can replace spell material components with sigils drawn in the air"',
  // Familiar as above
  'Hand Of The Apprentice':
    'Section=magic ' +
    'Note="Knows the Hand Of The Apprentice arcane spell/Has a focus pool and 1 Focus Point"',
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Hides spellcasting from observers with a successful Stealth vs. Perception, plus a successful Deception vs. Perception for verbal spells"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':
    'Section=magic ' +
    'Note="Draining a bonded item to cast a school spell restores 1 Focus Point once per day"',
  'Silent Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent spell casting requires no verbal components"',
  'Spell Penetration':
    'Section=magic ' +
    'Note="Reduces any target status bonus to saves vs. self spells by 1"',
  // Steady Spellcasting as above
  'Advanced School Spell (Abjuration)':
    'Section=magic ' +
    'Note="Knows the Energy Absorption arcane spell/+1 Focus Points"',
  'Advanced School Spell (Conjuration)':
    'Section=magic ' +
    'Note="Knows the Dimensional Steps arcane spell/+1 Focus Points"',
  'Advanced School Spell (Divination)':
    'Section=magic ' +
    'Note="Knows the Vigilant Eye arcane spell/+1 Focus Points"',
  'Advanced School Spell (Enchantment)':
    'Section=magic ' +
    'Note="Knows the Dread Aura arcane spell/+1 Focus Points"',
  'Advanced School Spell (Evocation)':
    'Section=magic ' +
    'Note="Knows the Elemental Tempest arcane spell/+1 Focus Points"',
  'Advanced School Spell (Illusion)':
    'Section=magic ' +
    'Note="Knows the Invisibility Cloak arcane spell/+1 Focus Points"',
  'Advanced School Spell (Necromancy)':
    'Section=magic ' +
    'Note="Knows the Life Siphon arcane spell/+1 Focus Points"',
  'Advanced School Spell (Transmutation)':
    'Section=magic ' +
    'Note="Knows the Shifting Form arcane spell/+1 Focus Points"',
  'Bond Conservation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Preceding Drain Bonded Item leaves enough power to cast another spell 2 levels lower by the end of the next turn"',
  'Universal Versatility':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"Can prepare a school focus spell during daily prep and Refocus"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Savant':
    'Section=magic ' +
    'Note="Can prepare %{rank.Arcane>=4?4:rank.Arcane>=3?3:2} temporary scrolls with spells up to level %{maxSpellLevel-2} during daily prep"',
  'Clever Counterspell':
    'Section=magic ' +
    'Note="Can attempt a Counterspell with a -2 penalty vs. a known spell using any spell that shares with it a trait other than concentrate, manipulate, or a tradition"',
  // Magic Sense as above
  'Bonded Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Reflect Spell as above
  'Superior Bond':
    'Section=magic ' +
    'Note="Can use Drain Bonded Item to cast another spell of up to level %{maxSpellLevel-2} once per day"',
  // Effortless Concentration as above
  'Spell Tinker':
    'Action=2 ' +
    'Section=magic ' +
    'Note="Alters a choice of an ongoing effect from a spell cast on self, reducing its remaining duration by half"',
  'Infinite Possibilities':
    'Section=magic ' +
    'Note="Can prepare a spell slot to allow the casting of any known spell of at least 2 levels lower"',
  'Reprepare Spell':
    'Section=magic ' +
    'Note="Can spend 10 min to prepare a previously-cast instantaneous spell of up to 4th level%{$\'features.Spell Substitution\'?\' or another instantaneous spell of the same level\':\'\'}"',
  "Archwizard's Might":'Section=magic Note="+1 10th level spell slot"',
  // Metamagic Mastery as above
  'Spell Combination':
    'Section=magic ' +
    'Note="Can prepare a spell slot of each level above 2nd to cast a combination of 2 spells of 2 levels lower"',

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
  'Advanced Concoction':
    'Section=feature Note="+1 Class Feat (alchemist up to level %{level//2})"',
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
  'Advanced Fury':
    'Section=feature Note="+%V Class Feat (barbarian up to level %{level//2})"',
  'Instinct Ability':
    'Section=feature ' +
    'Note="Has the instinct ability for the chosen barbarian instinct"',
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
  "Advanced Muse's Whispers":
    'Section=feature Note="+1 Class Feat (bard up to level %{level//2})"',
  'Counter Perform':
    'Section=magic ' +
    'Note="Knows the Counter Performance occult spell/Has a focus pool and at least 1 Focus Point"',
  'Inspirational Performance':
    'Section=magic Note="Knows the Inspire Courage occult cantrip"',
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
      '"Has the Champion Key Ability and Deity And Cause features",' +
      '"Skill Trained (Religion)"',
  'Basic Devotion':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level champion)"',
  'Champion Resiliency':'Section=combat Note="+%V Hit Points"',
  // NOTE: Might not be Lay On Hands for other causes
  'Healing Touch':
    'Section=magic ' +
    'Note="Knows the Lay On Hands divine spell/Has a focus pool and at least 1 Focus Point"',
  'Advanced Devotion':
    'Section=feature Note="+1 Class Feat (champion up to level %{level//2})"',
  // Champion's Reaction as above
  // Divine Ally as above
  'Diverse Armor Expert':
    'Section=combat ' +
    'Note="Defense Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',

  'Cleric Dedication':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Deity feature",' +
      '"Spell Trained (Divine)/Can prepare 2 divine cantrips each day",' +
      '"Skill Trained (Religion)"',
  'Basic Cleric Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} divine spell"',
  'Basic Dogma':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level cleric)"',
  'Advanced Dogma':
    'Section=feature Note="+1 Class Feat (cleric up to level %{level//2})"',
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
      '"Has the Anathema, Druidic Language, and Druidic Order features",' +
      '"Spell Trained (Primal)/Can prepare 2 primal cantrips each day",' +
      '"Skill Trained (Nature)"',
  'Basic Druid Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} primal spell"',
  'Basic Wilding':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level druid)"',
  'Order Spell (Animal)':
    'Section=magic ' +
    'Note="Knows the Heal Animal primal spell/Has a focus pool and at least 1 Focus Point"',
  'Order Spell (Leaf)':
    'Section=magic ' +
    'Note="Knows the Goodberry primal spell/Has a focus pool and at least 1 Focus Point"',
  'Order Spell (Storm)':
    'Section=magic ' +
    'Note="Knows the Tempest Surge primal spell/Has a focus pool and at least 1 Focus Point"',
  'Order Spell (Wild)':
    'Section=magic ' +
    'Note="Knows the Wild Morph primal spell/Has a focus pool and at least 1 Focus Point"',
  'Advanced Wilding':
    'Section=feature Note="+1 Class Feat (druid up to level %{level//2})"',
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
  'Advanced Maneuver':
    'Section=feature Note="+1 Class Feat (fighter up to level %{level//2})"',
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
  'Advanced Kata':
    'Section=feature Note="+1 Class Feat (monk up to level %{level//2})"',
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
      '"Skill Trained (Survival)"',
  "Basic Hunter's Trick":
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level ranger)"',
  'Ranger Resiliency':'Section=combat Note="+%V Hit Points"',
  "Advanced Hunter's Trick":
    'Section=feature Note="+1 Class Feat (ranger up to level %{level//2})"',
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
  'Advanced Trickery':
    'Section=feature Note="+1 Class Feat (rogue up to level %{level//2})"',
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
  'Basic Bloodline Spell (Aberrant)':
    'Section=magic ' +
    'Note="Knows the Tentacular Limbs occult spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Angelic)':
    'Section=magic ' +
    'Note="Knows the Angelic Halo divine spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Demonic)':
    'Section=magic ' +
    'Note="Knows the Glutton\'s Jaws divine spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Diabolic)':
    'Section=magic ' +
    'Note="Knows the Diabolic Edict divine spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Black))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Blue))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Brass))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Bronze))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Copper))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Gold))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Green))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Red))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (Silver))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Draconic (White))':
    'Section=magic ' +
    'Note="Knows the Dragon Claws arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Elemental (Air))':
    'Section=magic ' +
    'Note="Knows the Elemental Toss primal spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Elemental (Earth))':
    'Section=magic ' +
    'Note="Knows the Elemental Toss primal spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Elemental (Fire))':
    'Section=magic ' +
    'Note="Knows the Elemental Toss primal spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Elemental (Water))':
    'Section=magic ' +
    'Note="Knows the Elemental Toss primal spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Fey)':
    'Section=magic ' +
    'Note="Knows the Faerie Dust primal spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Hag)':
    'Section=magic ' +
    'Note="Knows the Jealous Hex occult spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Imperial)':
    'Section=magic ' +
    'Note="Knows the Ancestral Memories arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Bloodline Spell (Undead)':
    'Section=magic ' +
    // Errata changes Touch Of Undeath to Undeath's Blessing
    'Note="Knows the Undeath\'s Blessing divine spell/Has a focus pool and at least 1 Focus Point"',
  'Advanced Blood Potency':
    'Section=feature Note="+1 Class Feat (sorcerer up to level %{level//2})"',
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
      // Errata adds Arcane School, but gaining no features from it
      '"Has the Arcane School feature",' +
      '"Spell Trained (Arcane)/Can prepare 2 arcane cantrips each day",' +
      '"Owns a spellbook with 4 arcane cantrips",' +
      '"Skill Trained (Arcana)"',
  'Arcane School Spell (Abjuration)':
    'Section=magic ' +
    'Note="Knows the Protective Ward arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Arcane School Spell (Conjuration)':
    'Section=magic ' +
    'Note="Knows the Augment Summoning arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Arcane School Spell (Divination)':
    'Section=magic ' +
    'Note="Knows the Diviner\'s Sight arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Arcane School Spell (Enchantment)':
    'Section=magic ' +
    'Note="Knows the Charming Words arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Arcane School Spell (Evocation)':
    'Section=magic ' +
    'Note="Knows the Force Bolt arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Arcane School Spell (Illusion)':
    'Section=magic ' +
    'Note="Knows the Warped Terrain arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Arcane School Spell (Necromancy)':
    'Section=magic ' +
    'Note="Knows the Call Of The Grave arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Arcane School Spell (Transmutation)':
    'Section=magic ' +
    'Note="Knows the Physical Boost arcane spell/Has a focus pool and at least 1 Focus Point"',
  'Basic Arcana':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level wizard)"',
  'Basic Wizard Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} arcane spell"',
  'Advanced Arcana':
    'Section=feature Note="+1 Class Feat (wizard up to level %{level//2})"',
  'Arcane Breadth':
    'Section=magic Note="+1 arcane spell slot of each level up to %V"',
  'Expert Wizard Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (Arcane)/Knows 1 4th-level%{level>=16?\', 1 5th-level, and 1 6th-level\':level>=14?\' and 1 5th-level\':\'\'} arcane spell"',
  'Master Wizard Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (Arcane)/Knows 1 7th-level%{level>=20?\' and 1 8th-level\':\'\'} arcane spell"',

  // General Feats
  'Additional Lore (%lore)':'Section=skill Note="Skill %V (%lore)"',
  'Adopted Ancestry (%ancestry)':
    'Section=feature Note="May take %ancestry ancestry feats"',
  'Alchemical Crafting':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Formula Book feature",' +
      '"Knows the formulas for 4 common 1st-level alchemical items",' +
      '"Can use Crafting to create alchemical items"',
  'Ancestral Paragon':'Section=feature Note="+1 Ancestry Feat"',
  'Arcane Sense':
    'Section=magic ' +
    'Note="Knows the Detect Magic arcane innate spell; can cast it at %{rank.Arcana>=4?\'4th\':rank.Arcana==3?\'3rd\':\'1st\'} level at will"',
  'Armor Proficiency':'Section=combat Note="Defense Trained (%V Armor)"',
  'Assurance (%skill)':
    'Section=skill ' +
    'Note="Can take an automatic %{10+$\'proficiencyBonus.%skill\'} on %skill checks"',
  'Automatic Knowledge (%skill)':
    'Section=skill ' +
    'Note="Can use Assurance (%skill) to Recall Knowledge as a free action once per rd"',
  'Bargain Hunter':
    'Section=skill ' +
    'Note="+2 initial gold/Can use Diplomacy to purchase items at a discount"',
  'Battle Cry':
    'Section=combat ' +
    'Note="Can use Demoralize as a free action on a foe during initiative%{rank.Intimidation>=4?\' or as a reaction on a critical hit\':\'\'}"',
  'Battle Medicine':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses Medicine to restore Hit Points once per target per day"',
  'Bizarre Magic':
    'Section=magic ' +
    'Note="Increases DCs by 5 to Recognize Spells and Identify Magic on self spells and magic use"',
  'Bonded Animal':
    'Section=skill ' +
    'Note="Can use 1 week of interaction and a successful DC 20 Nature check to make an animal permanently helpful"',
  'Breath Control':
    'Section=ability,save ' +
    'Note=' +
      '"Can hold breath for %{(5+constitutionModifier)*25} rd without suffocating",' +
      '"+1 vs. inhaled threats, and successes vs. inhaled threats are critical successes"',
  'Canny Acumen (Fortitude)':'Section=save Note="Save %V (Fortitude)"',
  'Canny Acumen (Perception)':'Section=skill Note="Perception %V"',
  'Canny Acumen (Reflex)':'Section=save Note="Save %V (Reflex)"',
  'Canny Acumen (Will)':'Section=save Note="Save %V (Will)"',
  'Cat Fall':
    'Section=ability ' +
    'Note="Suffers %{rank.Acrobatics>=4?\'no\':rank.Acrobatics==3?\\"50\' less\\":rank.Acrobatics==2?\\"25\' less\\":\\"10\' less\\"} damage from falling"',
  'Charming Liar':
    'Section=skill ' +
    'Note="Critical success on a Lie improves a target\'s attitude by 1 step once per conversation"',
  'Cloud Jump':
    'Section=skill ' +
    'Note="Triples the distance of long jumps, increases high jump distance to normal long jump distance, and adds %{speed}\' to jump distances for every additional action spent"',
  'Combat Climber':
    'Section=skill ' +
    'Note="Can Climb with a hand occupied, can fight while Climbing, and Climbing does not inflict flat-footed"',
  'Confabulator':
    'Section=skill ' +
    'Note="Reduces the bonus given to targets of Deception for previous attempts to %{rank.Deception>=4?\'0\':rank.Deception==3?\'+1\':\'+2\'}"',
  'Connections':
    'Section=skill ' +
    'Note="Can use Society to gain a meeting with an important figure or to exchange favors"',
  'Continual Recovery':
    'Section=skill Note="Can repeat Treat Wounds on a patient after 10 min"',
  'Courtly Graces':
    'Section=skill ' +
    'Note="Can use Society to impersonate a noble or to Make An Impression on one"',
  'Craft Anything':
    'Section=skill ' +
    'Note="Can craft items without meeting secondary requirements"',
  'Diehard':'Section=combat Note="Remains alive until dying 5"',
  'Divine Guidance':
    'Section=skill ' +
    'Note="Can use 10 min Decipher Writing on a religious text and a successful Religion check to gain a hint about a current problem"',
  'Dubious Knowledge':
    'Section=skill ' +
    'Note="Failure on a Recall Knowledge check yields a mix of true and false information"',
  'Expeditious Search':
    'Section=skill ' +
    'Note="Can Search at %{rank.Perception>=4?4:2}x normal Speed"',
  'Experienced Professional':
    'Section=skill ' +
    'Note="Critical failures when using Lore to Earn Income are normal failures, and normal failures give twice the income"',
  'Experienced Smuggler':
    'Section=skill ' +
    'Note="Automatically %{rank.Stealth>=4?\'succeed\':rank.Steak>=3\' gets at least 15\':\' gets at least 10\'} on Stealth rolls to conceal a small item/Earning Income using Underworld Lore gives increased earnings"',
  'Experienced Tracker':
    'Section=skill ' +
    'Note="Can Track at full Speed%{rank.Survival<3?\', suffering a -5 Survival penalty\':\'\'}%{rank.Survival>=4?\'/Can Track without hourly Survival checks\':\'\'}"',
  'Fascinating Performance':
    'Section=skill ' +
    'Note="Can fascinate %{rank.Performance>=4?\'targets\':rank.Performance==3?\'10 targets\':rank.Performance==2?\'4 targets\':\'a target\'} for 1 rd with a successful Performance vs. Will"',
  'Fast Recovery':
    'Section=save ' +
    'Note="Regains 2x Hit Points and drained severity from rest/Successful Fortitude vs. an ongoing disease or poison reduces its stage by 2, or 1 if virulent; critical success by 3, or 2 if virulent"',
  'Feather Step':'Section=ability Note="Can Step into difficult terrain"',
  'Fleet':'Section=ability Note="+5 Speed"',
  'Foil Senses':
    'Section=skill ' +
    'Note="Automatically takes precautions against special senses when using Avoid Notice, Hide, or Sneak"',
  'Forager':
    'Section=skill ' +
    'Note="Failures and critical failures on Survival to Subsist are successes/Subsist successes provide for self and %{rank.Survival>=4?32:rank.Survival==3?16:rank.Survival==2?8:4} others, or twice that number with a critical success"',
  'Glad-Hand':
    'Section=skill ' +
    'Note="Can make a -5 Diplomacy check to Make An Impression upon meeting and retry a failure after 1 min of conversation"',
  'Group Coercion':
    'Section=skill ' +
    'Note="Can use Intimidation to Coerce %{rank.Intimidation>=4?25:rank.Intimidation==3?10:rank.Intimidation==2?4:2} targets"',
  'Group Impression':
    'Section=skill ' +
    'Note="Can use Diplomacy to Make An Impression with %{rank.Diplomacy>=4?25:rank.Diplomacy==3?10:rank.Diplomacy==2?4:2} targets"',
  'Hefty Hauler':'Section=ability Note="+2 Encumbered Bulk/+2 Maximum Bulk"',
  'Hobnobber':'Section=skill Note="Can Gather Information in half the normal time%{rank.Diplomacy>=3?\', and critical failures when taking normal time are normal failures\':\'\'}"',
  'Impeccable Crafting':
    'Section=skill ' +
    'Note="Successes on Specialty Crafting are critical successes"',
  'Impressive Performance':
    'Section=skill Note="Can use Performance to Make An Impression"',
  'Incredible Initiative':'Section=skill Note="+2 on initiative rolls"',
  'Incredible Investiture':'Section=magic Note="Can invest 12 magic items"',
  'Intimidating Glare':'Section=combat Note="Can use a glare to Demoralize"',
  'Intimidating Prowess':
    'Section=combat ' +
    'Note="+%{strengthModifier>=5&&rank.Intimidation>=3?2:1} to Coerce or Demoralize when physically menacing the target"',
  'Inventor':
    'Section=skill Note="Can use Crafting to create unknown common formulas"',
  'Kip Up':
    'Action=Free Section=combat Note="Stands up without triggering reactions"',
  'Lasting Coercion':
    'Section=skill ' +
    'Note="Successful Coerce lasts up to a %{rank.Intimidation>=4?\'month\':\'week\'}"',
  'Legendary Codebreaker':
    'Section=skill ' +
    'Note="Can use Society to Decipher Writing at full Speed, and successes at normal Speed are critical successes"',
  'Legendary Linguist':
    'Section=skill ' +
    'Note="Can establish basic communication with any creature that uses language"',
  'Legendary Medic':
    'Section=skill ' +
    'Note="Can use a 1 hr process and a successful Medicine check to remove a disease or condition once per target per day"',
  'Legendary Negotiation':
    'Action=3 ' +
    'Section=skill ' +
    'Note="Can use Diplomacy with a -5 penalty to convince a foe to negotiate; requires a successful Make An Impression followed by a successful Request"',
  'Legendary Performer':
    'Section=skill ' +
    'Note="Improves NPCs\' attitude by 1 step when they succeed on a DC 10 Society check to Recall Knowledge/Increases the audience level when Earning Income using Performance"',
  'Legendary Professional':
    'Section=skill ' +
    'Note="Improves NPCs\' attitude by 1 step when they succeed on a DC 10 Society check to Recall Knowledge/Increases the job level when Earning Income using Lore"',
  'Legendary Sneak':
    'Section=skill ' +
    'Note="Can use Hide and Sneak without cover/Automatically uses Avoid Notice when exploring"',
  'Legendary Survivalist':
    'Section=skill ' +
    'Note="Can survive indefinitely without food and water and endure incredible temperatures without damage"',
  'Legendary Thief':
    'Section=skill ' +
    'Note="Can use Steal with a -5 penalty when hidden to take actively wielded and highly noticeable items"',
  'Lengthy Diversion':
    'Section=skill ' +
    'Note="Can remain hidden after a Create A Diversion attempt critically succeeds"',
  'Lie To Me':
    'Section=skill Note="Can use Deception to detect lies in a conversation"',
  'Magical Crafting':
    'Section=skill ' +
    'Note="Can Craft magic items/Knows the formulas for 4 common magic items of 2nd level or lower"',
  'Magical Shorthand':
    'Section=skill ' +
    'Note="Can learn new spells with %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Religion>=4?\'1 min\':rank.Arcana==3||rank.Nature>=3||rank.Occultism>=3||rank.Religion==3?\'5 min\':\'1 hr\'} of study per spell level and retry 1 week after a failure/Can learn new spells at a discounted cost"',
  'Multilingual':'Section=skill Note="+%V Language Count"',
  'Natural Medicine':
    'Section=skill ' +
    'Note="Can use Nature to Treat Wounds; gives a +2 bonus in wilderness"',
  'Nimble Crawl':
    'Section=ability ' +
    'Note="Can Crawl at %{rank.Acrobatics>=3?\'full\':\'half\'} Speed%{rank.Acrobatics>=4?\'/Does not suffer flat-footed from being prone\':\'\'}"',
  'Oddity Identification':
    'Section=skill ' +
    'Note="+2 Occultism to Identify Magic with a mental, possession, prediction, or scrying trait"',
  'Pickpocket':
    'Section=skill ' +
    'Note="Can Steal a closely-guarded object without penalty%{rank.Thievery>=3?\'/Can use 2 actions to Steal with a -5 penalty from an alert creature\':\'\'}"',
  'Planar Survival':
    'Section=skill ' +
    'Note="Can use Survival to Subsist on different planes and to prevent damage from planar conditions"',
  'Powerful Leap':
    'Section=skill Note="Can make 5\' vertical and +5\' horizontal jumps"',
  'Quick Climb':
    'Section=skill ' +
    'Note="%{rank.Athletics>=4?\'Can Climb at full Speed\':\\"Climbing success increases distance by 5\', critical success by 10\'\\"}"',
  'Quick Coercion':'Section=skill Note="Can Coerce with 1 rd of conversation"',
  'Quick Disguise':
    'Section=skill ' +
    'Note="Can create a disguise %{rank.Deception>=4?\'as a 3-action activity\':rank.Deception==3?\'in 1 min\':\'in 5 min\'}"',
  'Quick Identification':
    'Section=skill ' +
    'Note="Can Identify Magic in %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Arcana>=4?\'1 action\':rank.Arcana==3||rank.Nature==3||rank.Occultism==3||rank.Religion==3?\'3 actions\':\'1 min\'}"',
  'Quick Jump':
    'Section=skill ' +
    'Note="Can use High Jump and Long Jump as 1 action without an initial Stride"',
  'Quick Recognition':
    'Section=skill ' +
    'Note="Can use a skill with master proficiency to Recognize Spell as a free action once per rd"',
  'Quick Repair':
    'Section=skill ' +
    'Note="Can Repair an item in %{rank.Crafting>=4?\'1 action\':rank.Crafting==3?\'3 actions\':\'1 min\'}"',
  'Quick Squeeze':
    'Section=skill ' +
    'Note="Can Squeeze %{rank.Acrobatics>=4?\'at full Speed\':\\"5\' per rd, or 10\' per rd on a critical success\\"}"',
  'Quick Swim':
    'Section=skill ' +
    'Note="%{rank.Athletics>=4?\'Can Swim at full Speed\':\\"Successful Swim increases distance by 5\', or by 10\' on a critical success\\"}"',
  'Quick Unlock':'Section=skill Note="Can Pick A Lock in 1 action"',
  'Quiet Allies':
    'Section=skill ' +
    'Note="Rolls a single Stealth check to Avoid Notice when leading a group"',
  'Rapid Mantel':
    'Section=skill ' +
    'Note="Can stand immediately after a successful Grab An Edge and use Athletics to Grab An Edge"',
  'Read Lips':
    'Section=skill ' +
    'Note="Can read the lips of those who can be seen clearly; in difficult circumstances, this requires a Society check and may inflict fascinated and flat-footed"',
  'Recognize Spell':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Successful roll of the connected skill gives recognition of a spell; critical success also gives +1 against effects, and critical failure misidentifies it; trained, expert, master, or legendary proficiency guarantees success on spells up to level 2, 4, 6, or 10"',
  'Ride':
    'Section=feature ' +
    'Note="Automatically succeeds when using Command An Animal to move/Mount acts on self turn"',
  'Robust Recovery':
    'Section=skill ' +
    'Note="Success on Treat Disease or Treat Poison gives a +4 bonus, and patient successes are critical successes"',
  'Scare To Death':
    'Action=1 ' +
    'Section=skill ' +
    'Note="R30\' Successful Intimidation vs. foe Will DC inflicts frightened 2; critical success inflicts frightened 2 and fleeing for 1 rd (<b>save Fortitude</b> critical success negates; critical failure inflicts death); failure inflicts frightened 1"',
  'Shameless Request':
    'Section=skill ' +
    'Note="Reduces the DC for an outrageous request by 2 and changes critical failures into normal failures"',
  'Shield Block':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Raised shield negates damage equal to its hardness; self and shield each suffer any remaining damage"',
  'Sign Language':
    'Section=skill Note="Knows the sign equivalents of understood languages"',
  'Skill Training (%skill)':'Section=skill Note="Skill Trained (%skill)"',
  'Slippery Secrets':
    'Section=skill ' +
    'Note="Successful Deception vs. spell DC negates spell effects that read minds, detect lies, or reveal alignment"',
  'Snare Crafting':
    'Section=skill ' +
    'Note="Can use Crafting to create snares and knows the formulas for 4 common snares"',
  'Specialty Crafting':
    'Section=skill ' +
    'Note="+%{rank.Crafting>=3?2:1} Crafting on selected type of item"',
  'Steady Balance':
    'Section=skill ' +
    'Note="Balance successes are critical successes/Balance does not inflict flat-footed/Can use Acrobatics to Grab An Edge"',
  'Streetwise':
    'Section=skill ' +
    'Note="Can use Society to Gather Information and to Recall Knowledge in familiar settlements"',
  'Student Of The Canon':
    'Section=skill ' +
    'Note="Critical failures on Religion checks to Decipher Writing or Recall Knowledge are normal failures/Failures to Recall Knowledge about own faith are successes, and successes are critical successes"',
  'Subtle Theft':
    'Section=skill ' +
    'Note="Successful Steal inflicts -2 Perception on observers to detect/Remains undetected when using Palm An Object or Steal after a successful Create A Diversion"',
  'Survey Wildlife':
    'Section=skill ' +
    'Note="Can use Survival%{rank.Survival<3?\' with a -2 penalty\':\'\'} to Recall Knowledge about local creatures after 10 min of study"',
  'Swift Sneak':'Section=skill Note="Can Sneak at full Speed"',
  'Terrain Expertise (%terrain)':'Section=skill Note="+1 Survival in %terrain"',
  'Terrain Stalker (Rubble)':
    'Section=skill ' +
    'Note="Sneaking 5\' in rubble at least 10\' from foes requires no Stealth check"',
  'Terrain Stalker (Snow)':
    'Section=skill ' +
    'Note="Sneaking 5\' in snow at least 10\' from foes requires no Stealth check"',
  'Terrain Stalker (Underbrush)':
    'Section=skill ' +
    'Note="Sneaking 5\' in underbrush at least 10\' from foes requires no Stealth check"',
  'Terrified Retreat':
    'Section=combat ' +
    'Note="Critical success on Demoralize causes a lower-level target to flee for 1 rd"',
  'Titan Wrestler':
    'Section=skill ' +
    'Note="Can use Disarm, Grapple, Shove, and Trip on creatures up to %{rank.Athletics>=4?3:2} sizes larger"',
  'Toughness':
    'Section=combat,save ' +
    'Note=' +
      '"+%{level} Hit Points",' +
      '"-1 DC on recovery checks"',
  'Train Animal':
    'Section=feature ' +
    'Note="Can use days of training and a successful Nature check to teach an animal to perform a trick"',
  'Trick Magic Item':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful check on the related skill activates a magic item until the end of the turn"',
  'Underwater Marauder':
    'Section=combat ' +
    'Note="Does not suffer flat-footed or penalties using bludgeoning and slashing melee weapons in water"',
  'Unified Theory':
    'Section=skill ' +
    'Note="Can use Arcana in place of Nature, Occultism, or Religion"',
  'Unmistakable Lore':
    'Section=skill ' +
    'Note="Critical failures to Recall Knowledge on a trained Lore are normal failures and critical successes on a Lore with master proficiency provide additional information"',
  'Untrained Improvisation':
    'Section=skill ' +
    'Note="+%{level<7 ? level // 2 : level} on untrained skill checks"',
  'Virtuosic Performer':
    'Section=skill ' +
    'Note="+%{rank.Performance>=3?2:1} checks on chosen Performance type"',
  'Wall Jump':
    'Section=skill ' +
    'Note="Can follow a jump that ends next to a wall with another 1-action jump%{rank.Athletics<4?\' once per turn\':\'\'}"',
  'Ward Medic':
    'Section=skill ' +
    'Note="Can use Medicine to Treat Disease or Treat Wounds on up to %{rank.Medicine>=4?8:rank.Medicine==3?4:2} creatures simultaneously"',
  'Wary Disarmament':
    'Section=skill ' +
    'Note="+2 Armor Class and saves vs. a trap triggered while disarming it"',
  'Weapon Proficiency (Martial Weapons)':
    'Section=combat Note="Attack Trained (Martial Weapons)"',
  'Weapon Proficiency (Simple Weapons)':
    'Section=combat Note="Attack Trained (Simple Weapons)"',
  'Weapon Proficiency (%advancedWeapon)':
    'Section=combat Note="Attack Trained (%advancedWeapon)"'

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
  'Dwarven Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Elven Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Gnome Lore':'Ability=Intelligence Subcategory="Creature Lore"', // added
  'Goblin Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Halfling Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  // terrain lore skills from background chapter pg 60ff
  'Cave Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Cavern Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Desert Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Forest Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Plains Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Swamp Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Underground Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  // terrain lore skills from Ranger favored terrain feat pg 171
  'Aquatic Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Arctic Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Sky Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Military Lore':'Ability=Intelligence', // pg 247
  // Adventuring Lore, Magic Lore, Planar Lore pg 247 examples of excluded Lore
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
  'Abadar Lore':'Ability=Intelligence Subcategory="Deity Lore"',
  'Iomedae Lore':'Ability=Intelligence Subcategory="Deity Lore"',
  'Demon Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Owlbear Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Vampire Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Abyss Lore':'Ability=Intelligence Subcategory="Planar Lore"',
  'Astral Plane Lore':'Ability=Intelligence Subcategory="Planar Lore"',
  'Heaven Lore':'Ability=Intelligence Subcategory="Planar Lore"',
  'Absalom Lore':'Ability=Intelligence Subcategory="Settlement Lore"',
  'Magnimar Lore':'Ability=Intelligence Subcategory="Settlement Lore"',
  'Mountain Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'River Lore':'Ability=Intelligence Subcategory="Terrain Lore"',
  'Alcohol Lore':'Ability=Intelligence Subcategory="Food Lore"',
  'Baking Lore':'Ability=Intelligence Subcategory="Food Lore"',
  'Butchering Lore':'Ability=Intelligence Subcategory="Food Lore"',
  'Cooking Lore':'Ability=Intelligence Subcategory="Food Lore"',
  'Tea Lore':'Ability=Intelligence Subcategory="Food Lore"',
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
  'Aberration Lore':'Ability=Intelligence Subcategory="Creature Lore"',// pg 504
  'Troll Lore':'Ability=Intelligence Subcategory="Creature Lore"', // pg 505
  'Taldan History Lore':'Ability=Intelligence' // pg 506
};
Pathfinder2E.SPELLS = {
  'Abyssal Plague':
    'Level=5 ' +
    'Traits=Chaotic,Disease,Evil,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 1 Abyssal plague, which inflicts unrecoverable drained 1 until cured; subsequent failures after 1 day will inflict drained 2 at stage 2 (<b>save Fortitude</b> inflicts 2 HP evil per spell level and -2 saves vs. Abyssal plague for 1 day; critical success negates; critical failure inflicts stage 2)"',
  'Acid Arrow':
    'Level=2 ' +
    'Traits=Acid,Attack,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 3d8 HP acid, or double HP on a critical success, plus 1d6 HP persistent acid (<b>heightened +2</b> inflicts +2d8 HP initial and +1d6 HP persistent)"',
  'Acid Splash':
    'Level=1 ' +
    'Traits=Acid,Attack,Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d6 HP acid, plus 1 HP persistent acid on a critical success, and 1 HP acid splash (<b>heightened 3rd</b> inflicts 1d6+%{spellModifier.%tradition} HP initial and 2 HP persistent; <b>5th</b> inflicts 2d6+%{spellModifier.%tradition} HP initial, 3 HP persistent, and 2 HP splash; <b>7th</b> inflicts 3d6+%{spellModifier.%tradition} HP initial, 4 HP persistent, and 3 HP splash; <b>9th</b> inflicts 4d6+%{spellModifier.%tradition} HP initial, 5 HP persistent, and 4 HP splash)"',
  'Aerial Form':
    'Level=4 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium bat, bird, pterosaur, or wasp with 5 temporary HP, Armor Class %{level+18}, +16 attack, +5 damage, low-light vision, flight, +16 Acrobatics modifier, and creature-specific features for 1 min (<b>heightened 5th</b> becomes a Large creature with +10\' Speed, 10 temporary HP, +18 attack, +8 damage, +20 Acrobatics; <b>6th</b> becomes a Huge creature with +15\' Speed, 10\' reach, 15 temporary HP, Armor Class %{level+21}, +21 attack, +4 damage with double damage dice, +23 Acrobatics)"',
  'Air Bubble':
    'Level=1 ' +
    'Traits=Air,Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Allows target to breathe normally in any environment for 1 min"',
  'Air Walk':
    'Level=4 ' +
    'Traits=Air,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Touched can walk up to a 45-degree angle on air for 5 min"',
  'Alarm':
    'Level=1 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"20\' burst triggers a mental or audible alarm when a Small or larger corporeal creature enters without saying a specified password for 8 hr (<b>heightened 3rd</b> allows specifying characteristics of triggering creatures)"',
  'Alter Reality':
    'Level=10 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known occult spell of up to 9th level or a common spell of up to 7th level"',
  'Anathematic Reprisal':
    'Level=4 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Target who committed the triggering anathema act suffers 4d6 HP mental and stupefied 1 for 1 rd (<b>save basic Will</b>; success negates stupefied) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Animal Form':
    'Level=2 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium animal with 5 temporary HP, Armor Class %{level+16}, +9 attack, +1 damage, low-light vision, 30\' imprecise scent, +9 Athletics modifier, and creature-specific features for 1 min (<b>heightened 3rd</b> gives 10 temporary HP, Armor Class %{level+17}, +14 attack, +5 damage, +14 Athletics; <b>4th</b> becomes a Large creature with 10\' reach, 15 temporary HP, Armor Class %{level+18}, +16 attack, +9 damage, +16 Athletics; <b>5th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, Armor Class %{level+18}, +18 attack, +7 damage with double damage dice, +20 Athletics)"',
  'Animal Messenger':
    'Level=2 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Target Tiny animal carries a small object or note to a specified destination for up to 24 hr"',
  'Animal Vision':
    'Level=3 ' +
    'Traits=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Allows self to share the target animal\'s senses (<b>save Will</b> negates) for 1 hr"',
  'Ant Haul':
    'Level=1 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched can carry +3 Bulk without encumbrance and +6 Bulk maximum for 8 hr"',
  'Antimagic Field':
    'Level=8 ' +
    'Traits=Rare,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"10\' emanation disables spells and magic items while sustained for up to 1 min"',
  'Augury':
    'Level=2 ' +
    'Traits=Divination,Prediction ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals whether the results of a proposed action up to 30 min in the future will be generally good or bad"',
  'Avatar':
    'Level=10 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Huge creature with darkvision, 30 temporary HP, Armor Class %{level+25}, +33 attack, +35 Athletics, and deity-specific features for 1 min"',
  'Baleful Polymorph':
    'Level=6 ' +
    'Traits=Incapacitation,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transforms the target\'s form into a harmless animal for 1 min, allowing a new save to revert each rd (<b>save Will</b> inflicts minor physical changes and sickened 1; critical success negates; critical failure transforms permanently and also affects the target\'s mind)"',
  'Bane':
    'Level=1 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"5\' emanation inflicts -1 attack on foes for 1 min (<b>save Will</b> negates); a concentrate action each rd increases the radius by 5\'"',
  'Banishment':
    'Level=5 ' +
    'Traits=Abjuration,Incapacitation ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Returns the target to its home plane (<b>save Will</b> (-2 if cast using an additional action and a target anathema) negates; critical success inflicts stunned 1 on self; critical failure prevents the target\'s return for 1 week) (<b>heightened 9th</b> affects 10 targets)"',
  'Barkskin':
    'Level=2 ' +
    'Traits=Abjuration,Plant ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 2 to bludgeoning and piercing and weakness 3 to fire for 10 min or until dismissed by target (<b>heightened +2</b> gives +2 resistances and +3 weakness)"',
  'Bind Soul':
    'Level=9 ' +
    'Traits=Uncommon,Evil,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Traps the soul of a corpse dead for less than 1 min in a gem until counteracted or the gem is destroyed"',
  'Bind Undead':
    'Level=3 ' +
    'Traits=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Controls the actions of a mindless undead of level less than or equal to the spell level for 1 day"',
  'Black Tentacles':
    'Level=5 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Successful spell attacks vs. Fortitude DC in a 20\' burst inflict 3d6 HP bludgeoning and grabbed for 1 min, plus 1d6 HP bludgeoning each rd on grabbed creatures; escaping requires success vs. a DC %{spellDifficultyClass.%tradition} on an unarmed attack or inflicting 12 HP vs. Armor Class %{spellDifficultyClass.%tradition}"',
  'Blade Barrier':
    'Level=6 ' +
    'Traits=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\'x120\'x2\\" wall inflicts 7d8 HP force for 1 min (<b>save basic Reflex</b>; critical failure prevents passage) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Bless':
    'Level=1 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"5\' radius gives allies +1 attack for 1 min; a concentrate action each rd increases the radius by 5\'"',
  'Blindness':
    'Level=3 ' +
    'Traits=Incapacitation,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Blinds the target for 1 min (<b>save Fortitude</b> effects last until next turn; critical success negates; critical failure inflicts permanent blindness)"',
  'Blink':
    'Level=4 ' +
    'Traits=Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains resistance 5 to non-force damage and can use Sustain to randomly teleport 10\' for 1 min (<b>heightened +2</b> gives +3 resistance)"',
  'Blur':
    'Level=2 ' +
    'Traits=Illusion,Veil ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Touched becomes concealed for 1 min"',
  'Breath Of Life':
    'Level=5 ' +
    'Traits=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Prevents the triggering target\'s death, restoring 4d8+%{spellModifier.%tradition} HP"',
  'Burning Hands':
    'Level=1 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP fire (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Calm Emotions':
    'Level=2 ' +
    'Traits=Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst calms creatures and prevents them from taking hostile actions while sustained for up to 1 min; a hostile action ends the spell for the target (<b>save Will</b> inflicts -1 attack; critical success negates; critical failure allows the effects to continue after a hostile action)"',
  'Cataclysm':
    'Level=10 ' +
    'Traits=Acid,Air,Cold,Earth,Electricity,Evocation,Fire,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R1000\' 60\' burst inflicts 3d10 HP each acid, bludgeoning 3 times, cold, electricity, and fire, ignoring resistance 10 (<b>save basic Reflex</b>)"',
  'Chain Lightning':
    'Level=6 ' +
    'Traits=Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Inflicts 8d12 HP electricity on a chain of targets, jumping up to 30\' between each (<b>save basic Reflex</b>; critical success ends the chain) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Charm':
    'Level=1 ' +
    'Traits=Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target becomes friendly, or helpful if already friendly, and cannot use hostile actions against self for 1 hr (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure makes the target helpful) (<b>heightened 4th</b> effects last until next daily prep; <b>heightened 8th</b> effects last until next daily prep and affect 10 targets)"',
  'Chill Touch':
    'Level=1 ' +
    'Traits=Cantrip,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 1d4+%{spellModifier.%tradition} HP negative on a living creature (<b>save basic Fortitude</b>; critical failure also inflicts enfeebled 1 for 1 rd) or flat-footed on an undead for 1 rd (<b>save Fortitude</b> negates; critical failure also inflicts fleeing for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP on living)"',
  'Chilling Darkness':
    'Level=3 ' +
    'Traits=Attack,Cold,Darkness,Evocation,Evil ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 5d6 HP cold, plus 5d6 HP evil on celestials, (double HP on a critical success) and makes a counteract attempt vs. magical light (<b>heightened +1</b> inflicts +2d6 HP cold and evil)"',
  'Chromatic Wall':
    'Level=5 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 60\'x30\' wall shines 20\' light and inflicts randomly-chosen effects on passing objects and creatures for 10 min: (1) destroys ammunition and inflicts 20 HP fire on creatures (<b>save basic Reflex</b>; <i>Cone Of Cold</i> counteracts); (2) destroys thrown weapons and inflicts 25 HP acid on creatures (<b>save basic Reflex</b>; <i>Gust Of Wind</i> counteracts); (3) negates energy effects and inflicts 30 HP electricity on creatures (<b>save basic Reflex</b>; <i>Disintegrate</i> counteracts); (4) blocks gasses and inflicts 10 HP poison and enfeebled 1 for 1 min on creatures (<b>save basic Fortitude</b> also negates enfeebled; <i>Passwall</i> counteracts) (<b>heightened 7th</b> effects last for 1 hr, inflicts +10 HP, and adds more effects possibilities: (5) negates petrification, sonic, and visual effects and inflicts <i>Flesh To Stone</i> on creatures (<i>Magic Missile</i> counteracts); (6) negates divination and mental effects and inflicts <i>Warp Mind</i> on creatures (<i>Searing Light</i> counteracts); (7) negates targeted spells and inflicts slowed 1 for 1 min on creatures (<b>save Will</b> negates; critical failure teleports to another plane; <i>Dispel Magic</i> counteracts); (8) effects as another option, but with -2 saves)"',
  'Circle Of Protection':
    'Level=3 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"10\' emanation around touched gives +1 Armor Class and saves vs. creatures of a specified alignment, and +3 vs. summoned creatures and on effects that control touched, for 1 min (<b>heightened 4th</b> effects last for 1 hr)"',
  'Clairaudience':
    'Level=3 ' +
    'Traits=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to listen from the target location for 10 min"',
  'Clairvoyance':
    'Level=4 ' +
    'Traits=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location for 10 min"',
  'Cloak Of Colors':
    'Level=5 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creatures adjacent to the target suffer dazzled, and successful attackers suffer blinded for 1 rd (<b>save Will</b> negates; critical failure inflicts stunned for 1 rd), for 1 min"',
  'Cloudkill':
    'Level=5 ' +
    'Traits=Death,Necromancy,Poison ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a cloud in a 20\' burst that inflicts 6d8 HP poison and moves away 10\' each rd for 1 min (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Collective Transposition':
    'Level=6 ' +
    'Traits=Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Teleports 2 targets within a 30\' radius (<b>save Will</b> negates; critical success allows the target to control the teleport) (<b>heightened +1</b> affects +1 target)"',
  'Color Spray':
    'Level=1 ' +
    'Traits=Illusion,Incapacitation,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts stunned 1, blinded for 1 rd, and dazzled for 1 min (<b>save Will</b> inflicts dazzled for 1 rd only; critical success negates; critical failure extends blindness to 1 min)"',
  'Command':
    'Level=1 ' +
    'Traits=Auditory,Enchantment,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target obeys a command to approach, run away, drop a held object, drop prone, or stand in place for 1 action (<b>save Will</b> negates; critical failure causes the target to use all actions on its next turn to obey) (<b>heightened 5th</b> affects 10 targets)"',
  'Comprehend Language':
    'Level=2 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target understands a chosen heard language for 1 hr (<b>heightened 3rd</b> the target can also speak the language; <b>4th</b> affects 10 targets)"',
  'Cone Of Cold':
    'Level=5 ' +
    'Traits=Cold,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 12d6 HP cold (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Confusion':
    'Level=4 ' +
    'Traits=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts confused for 1 min or until a successful save (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure allows no further save attempts) (<b>heightened 8th</b> affects 10 targets)"',
  'Contingency':
    'Level=7 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Prepares a spell of up to 3 actions and 4th level to activate as a reaction to a specified trigger (<b>heightened 8th</b> allows a 5th level spell; <b>9th</b> allows a 6th level spell; <b>10th</b> allows a 7th level spell)"',
  'Continual Flame':
    'Level=2 ' +
    'Traits=Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=3 ' +
    'Description="Touched object emits a heatless flame until dismissed"',
  'Control Water':
    'Level=5 ' +
    'Traits=Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Raises or lowers water by 10\' and slows water creatures in a 50\'x50\' area"',
  'Create Food':
    'Level=2 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 hr" ' +
    'Description=' +
      '"R30\' Creates food for 6 Medium creatures that lasts for 1 day (<b>heightened 4th</b> creates food for 12; <b>6th</b> creates food for 50; <b>8th</b> creates food for 200)"',
  'Create Water':
    'Level=1 ' +
    'Traits=Conjuration,Water ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="Creates 2 gallons of water that last for 1 day"',
  'Creation':
    'Level=4 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R0\' Creates an object of up to 5 cubic feet made of vegetable matter that lasts for 1 hr (<b>heightened 5th</b> object can include metal and common minerals)"',
  'Crisis Of Faith':
    'Level=3 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 6d6 HP mental, or 6d8 HP mental and stupefied 1 for 1 rd on divine casters (<b>save Will</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, stupefied 1 for 1 rd, and no divine casting for 1 rd) (<b>heightened +1</b> inflicts +2d6 HP, or +2d8 HP on divine casters)"',
  'Crusade':
    'Level=9 ' +
    'Traits=Uncommon,Enchantment,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 4 targets dedicate their actions to a specified cause for 10 min; the spell ends if an ally attacks a target or for a level 14+ target reduced to half HP (<b>save Will</b> for level 15+ each rd ends the spell) (<b>heightened 10th</b> the spell ends only for a level 16+ target reduced to half HP or a level 17+ target who saves)"',
  'Crushing Despair':
    'Level=5 ' +
    'Traits=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone prevents reactions, and failure on a second save inflicts slowed 1, for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure inflicts slowed 1 for 1 min with no second save) (<b>heightened 7th</b> affects a 60\' cone)"',
  'Dancing Lights':
    'Level=1 ' +
    'Traits=Cantrip,Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Creates 4 floating torch lights in a 10\' radius that can be moved 60\' each rd while sustained"',
  'Darkness':
    'Level=2 ' +
    'Traits=Darkness,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' burst suppresses natural light and magical light of equal or lesser level for 1 min (<b>heightened 4th</b> conceals targets within the darkness from creatures with darkvision)"',
  'Darkvision':
    'Level=2 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to see in darkness for 1 hr (<b>heightened 3rd</b> affects a touched target; <b>5th</b> effects last until next daily prep)"',
  'Daze':
    'Level=1 ' +
    'Traits=Cantrip,Enchantment,Mental,Nonlethal ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Inflicts %{spellModifier.%tradition} HP mental (<b>save basic Will</b>; critical failure also inflicts stunned 1) (<b>heightened +2</b> inflicts +1d6 HP)"',
  'Deafness':
    'Level=2 ' +
    'Traits=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts deafness for 10 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure inflicts permanent deafness)"',
  'Death Knell':
    'Level=2 ' +
    'Traits=Death,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Kills a touched target with 0 HP and gives self 10 temporary HP and +1 attack and damage for 10 min (<b>save Will</b> increases the target\'s dying value by 1; critical success negates)"',
  'Death Ward':
    'Level=5 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +4 saves vs. death and negative effects, negative resistance 10, and suppressed doomed effects for 10 min"',
  'Detect Alignment':
    'Level=1 ' +
    'Traits=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals auras of a specified alignment (<b>heightened 2nd</b> reveals each aura\'s location and strength)"',
  'Detect Magic':
    'Level=1 ' +
    'Traits=Cantrip,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals the presence of magic and lower-level illusions (<b>heightened 3rd</b> reveals the school of the highest-level effect; <b>4th</b> reveals the approximate location of the highest-level effect)"',
  'Detect Poison':
    'Level=1 ' +
    'Traits=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Reveals whether the target creature or object is venomous or poisoned (<b>heightened 2nd</b> reveals the number and types of poison)"',
  'Detect Scrying':
    'Level=4 ' +
    'Traits=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals scrying effects, along with the scrying creature for lower-level effects, for 1 hr (<b>heightened 6th</b> effects last until next daily prep)"',
  'Dimension Door':
    'Level=4 ' +
    'Traits=Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Teleports self to a visible location within 120\' (<b>heightened 5th</b> allows teleporting to a familiar location within 1 mile)"',
  'Dimensional Anchor':
    'Level=4 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Attempts to counteract any effect that would move the target to a different plane for 10 min (<b>save Will</b> effects last for 1 min; critical success negates; critical failure effects last for 1 hr)"',
  'Dimensional Lock':
    'Level=7 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 60\' burst attempts to counteract any teleportation or planar travel until next daily prep"',
  'Dinosaur Form':
    'Level=4 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large dinosaur with 15 temporary HP, Armor Class %{level+18}, +16 attack, +9 damage, low-light vision, 30\' imprecise scent, +18 Athletics modifier, and creature-specific attacks for 1 min (<b>heightened 5th</b> becomes a Huge creature with 15\' or 20\' reach, 20 temporary HP, +18 attack, +6 damage with double damage dice, +21 Athletics; <b>7th</b> becomes a Gargantuan creature with 20\' or 25\' reach, Armor Class %{level+21}, 25 temporary HP, +25 attack, +15 damage with double damage dice, +25 Athletics)"',
  'Disappearance':
    'Level=8 ' +
    'Traits=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Touched becomes undetectable by any sense for 10 min"',
  'Discern Lies':
    'Level=4 ' +
    'Traits=Uncommon,Divination,Mental,Revelation ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="Self gains +4 Perception vs. lies for 10 min"',
  'Discern Location':
    'Level=8 ' +
    'Traits=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals the exact location of a specified familiar creature or object"',
  'Disintegrate':
    'Level=6 ' +
    'Traits=Attack,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 12d10 HP, reducing the target to dust at 0 HP, or destroys a non-artifact 10\' cube object (<b>save basic Fortitude</b>; critical hit worsens save by 1 degree) (<b>heightened +1</b> inflicts +2d10 HP)"',
  'Disjunction':
    'Level=9 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Makes a counteract check to deactivate a non-artifact magic item; critical success destroys it"',
  'Dispel Magic':
    'Level=2 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Makes a counteract check to remove 1 spell effect from the target or to make a magic item inert for 10 min"',
  'Disrupt Undead':
    'Level=1 ' +
    'Traits=Cantrip,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d6+%{spellModifier.%tradition} HP positive on an undead target (<b>save basic Fortitude</b>; critical failure also inflicts enfeebled 1 for 1 rd) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Disrupting Weapons':
    'Level=1 ' +
    'Traits=Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Two touched weapons inflict +1d4 HP positive vs. undead for 1 min (<b>heightened 3rd</b> weapons inflict +2d4 HP; <b>5th</b> 3 weapons inflict +3d4 HP)"',
  'Divine Aura':
    'Level=8 ' +
    'Traits=Abjuration,Aura ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' emanation gives allies +1 Armor Class and saves, +2 vs. creatures opposed to a specified alignment, and +4 vs. opposed alignment control, and blinds melee attackers of opposed alignment (<b>save Will</b> negates), while sustained for up to 1 min; the first Sustain each rd increases the emanation radius by 10\'"',
  'Divine Decree':
    'Level=7 ' +
    'Traits=Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R40\' 40\' emanation inflicts 7d10 HP specified alignment damage; creatures of opposed alignment also suffer enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, banishment, and, for creatures of level 10 and lower, paralysis for 1 min (<b>save Will</b> negates; critical failure inflicts death); matching alignment negates; neutral alignment improves save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP and increases the level of creatures that suffer paralysis by 2)"',
  'Divine Inspiration':
    'Level=8 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched recovers 1 6th-level or lower spell or slot and regains Focus Points"',
  'Divine Lance':
    'Level=1 ' +
    'Traits=Attack,Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP of chosen alignment, or double HP on a critical success (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Divine Vessel':
    'Level=7 ' +
    'Traits=Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes Large and gains 40 temporary HP, %{speed}\' fly Speed, +1 vs. spells, darkvision, and fist, bite, or claw attacks that inflict 2d8 HP, 2d10 HP, or 2d10 HP, inflicts +1 HP of chosen alignment, and suffers weakness 10 to the opposite alignment for 1 min (<b>heightened 9th</b> gives 60 temporary HP and weakness 15, lasting 10 min)"',
  'Divine Wrath':
    'Level=4 ' +
    'Traits=Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts 4d10 HP of chosen alignment and sickened 1 (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts sickened 2 and slowed 1; matching alignment negates; neutral alignment improves save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Dominate':
    'Level=6 ' +
    'Traits=Uncommon,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self controls the actions of the target until next daily prep; a successful save at end of each turn ends the spell (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure allows further saves only upon repugnant orders) (<b>heightened 10th</b> effects are permanent)"',
  'Dragon Form':
    'Level=6 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large dragon with 40\' Speed, 100\' fly Speed, 10 temporary HP, Armor Class %{level+18}, +22 attack, +6 damage, a breath weapon, resistance 10 to the breath weapon damage type, darkvision, 60\' imprecise scent, +23 Athletics modifier, and creature-specific features for 1 min (<b>heightened 8th</b> becomes a Huge creature with 120\' fly Speed, +5\' reach, 15 temporary HP, Armor Class %{level+21}, +28 attack, +12 damage (breath weapon +14), +28 Athletics)"',
  'Dream Council':
    'Level=8 ' +
    'Traits=Illusion,Mental,Sleep ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Allows 12 known targets to communicate through a shared dream for 1 hr"',
  'Dream Message':
    'Level=3 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Self sends 1 min of speech to a familiar creature, received the next time they sleep (<b>heightened 4th</b> sends speech to 10 familiar creatures)"',
  'Dreaming Potential':
    'Level=5 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched receives a day of downtime retraining during 8 hr sleep"',
  'Drop Dead':
    'Level=5 ' +
    'Traits=Uncommon,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Upon receiving the triggering wound, the target becomes invisible and is replaced by an illusionary corpse while sustained for up to 1 min; a hostile act by the target ends the spell (<b>heightened 7th</b> a hostile act does not end the spell)"',
  'Duplicate Foe':
    'Level=7 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Creates a minion copy of a target up to level 15 with 70 HP and no special abilities while sustained for up to 1 min or until reduced to 0 HP; the copy loses 4d6 HP after each turn (<b>save Fortitude</b> the copy inflicts half HP and lasts 2 rd; critical success negates) (<b>heightened +1</b> increases the target level that can be copied by 2 and the copy HP by 10)"',
  'Earthbind':
    'Level=3 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Brings a flying target to the ground and prevents flight and levitation for 1 rd (<b>save Fortitude</b> grounds target but does not prevent flight; critical success negates; critical failure effects last for 1 min)"',
  'Earthquake':
    'Level=8 ' +
    'Traits=Earth,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst inflicts difficult terrain, -2 attacks, Armor Class, and skill checks, a 40\' fall (<b>save Reflex</b> negates), and structure collapse that inflicts 11d6 HP bludgeoning and knocked prone (<b>save Reflex</b> inflicts half HP and knocked prone; critical success inflicts half HP only; critical failure causes the fall save to fail) (<b>heightened 10th</b> increases range to a half mile and effect area to a quarter-mile burst)"',
  'Eclipse Burst':
    'Level=7 ' +
    'Traits=Cold,Darkness,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst attempts to counteract magical light and inflicts 8d10 HP cold, plus 8d4 HP negative to living creatures (<b>save Reflex</b>; inflicts half HP; critical success negates; critical failure inflicts double HP and permanent blindness) (<b>heightened +1</b> inflicts +1d10 HP cold and +1d4 HP negative)"',
  'Electric Arc':
    'Level=1 ' +
    'Traits=Cantrip,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+%{spellModifier.%tradition} electricity on 1 or 2 targets (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Elemental Form':
    'Level=5 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium elemental with 10 temporary HP, Armor Class %{level+19}, +18 attack, +9 damage, darkvision, +20 Acrobatics (air or fire) or Athletics (earth or water) modifier, and creature-specific features for 1 min (<b>heightened 6th</b> becomes a Large creature with 10\' reach, 15 temporary HP, Armor Class %{level+22}, +23 attack, +13 damage, +23 Acrobatics or Athletics; <b>7th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, Armor Class %{level+22}, +25 attack, +11 damage and double damage dice, and +25 Acrobatics or Athletics)"',
  'Endure Elements':
    'Level=2 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Protects touched from severe cold or heat until next daily prep (<b>heightened 3rd</b> protects from both cold and heat; <b>5th</b> protects from extreme cold and heat</b>)"',
  'Energy Aegis':
    'Level=7 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touched gains resistance 5 to acid, cold, electricity, fire, force, negative, positive, and sonic damage for 1 day (<b>heightened 9th</b> gives resistance 10)"',
  'Enhance Victuals':
    'Level=2 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Improves the quality of touched 1 gallon of water or 5 pounds of food for 1 hr and attempts to counteract any poison (<b>heightened +1</b> affects +1 gallon or +5 pounds</b>"',
  'Enlarge':
    'Level=2 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target becomes Large, gaining +5\' reach, +2 melee damage, and clumsy 1 for 5 min (<b>heightened 4th</b> target becomes Huge, gaining +10\' reach and +4 melee damage; <b>8th</b> affects 10 creatures)"',
  'Entangle':
    'Level=2 ' +
    'Traits=Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts difficult terrain and -10\' Speed for 1 min (<b>save Reflex</b> inflicts difficult terrain only; critical failure inflicts immobilized for 1 rd)"',
  'Enthrall':
    'Level=3 ' +
    'Traits=Auditory,Emotion,Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Fascinates creatures within 120\' while sustained, with additional saves for disagreement (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure allows no further saves)"',
  'Ethereal Jaunt':
    'Level=7 ' +
    'Traits=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Moves self from the Material Plane to the Ethereal Plane while sustained for up to 1 min (<b>heightened 9th</b> R30\' affects 5 additional willing creatures, and effects last for 10 min)"',
  'Fabricated Truth':
    'Level=10 ' +
    'Traits=Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R100\' 5 targets believe a specified statement for 1 week (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure effects are permanent)"',
  'Faerie Fire':
    'Level=2 ' +
    'Traits=Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst makes concealed creatures visible and invisible creatures concealed for 5 min"',
  'False Life':
    'Level=2 ' +
    'Traits=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains %{6+spellModifier.%tradition} temporary HP for 8 hr (<b>heightened +1</b> gives +3 HP)"',
  'False Vision':
    'Level=5 ' +
    'Traits=Uncommon,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Controls the image shown by scrying within a 100\' burst until next daily prep"',
  'Fear':
    'Level=1 ' +
    'Traits=Emotion,Enchantment,Fear,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts frightened 2 (<b>save Will</b> inflicts frightened 1; critical success negates; critical failure inflicts frightened 3 and fleeing for 1 rd) (<b>heightened 3rd</b> affects 5 targets)"',
  'Feather Fall':
    'Level=1 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Falling target slows to 60\' per rd and suffers no falling damage for 1 min or until landing"',
  'Feeblemind':
    'Level=6 ' +
    'Traits=Curse,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts stupefied 4 until the curse is removed (<b>save Will</b> inflicts stupefied 2 for 1 rd; critical success negates; critical failure inflicts permanent animal intelligence and -5 Charisma, Intelligence, and Wisdom modifiers and changes a PC into an NPC)"',
  'Feet To Fins':
    'Level=3 ' +
    'Traits=Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched can swim at full Speed but slows to 5\' on land for 10 min (<b>heightened 6th</b> effects last until next daily prep)"',
  'Field Of Life':
    'Level=6 ' +
    'Traits=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 20\' burst restores 1d8 HP per rd to living and inflicts 1d8 HP positive per rd to undead while sustained for up to 1 min (<b>heightened 8th</b> restores and inflicts 1d10 HP; <b>9th</b> restores and inflicts 1d12 HP)"',
  'Fiery Body':
    'Level=7 ' +
    'Traits=Fire,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains fire immunity and resistance 10 to precision damage, suffers weakness 5 to cold and water, inflicts 3d6 HP fire on non-reach melee attackers, inflicts +1d4 HP fire on unarmed attacks and an additional die of damage on fire spells, can cast <i>Produce Flame</i> using 1 action as an innate spell, gains a 40\' fly Speed, and does not need to breathe for 1 min (<b>heightened 9th</b> inflicts 4d6 HP fire on non-reach melee attackers, inflicts +2d4 HP fire on unarmed attacks, and increases fly Speed to 60\')"',
  'Finger Of Death':
    'Level=7 ' +
    'Traits=Death,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target suffers 70 HP negative, dying at 0 HP (<b>save basic Fortitude</b) (<b>heightened +1</b> inflicts +10 HP)"',
  'Fire Seeds':
    'Level=6 ' +
    'Traits=Evocation,Fire,Plant ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates 4 acorns that can be thrown 30\', inflicting 4d6 HP fire in a 5\' burst and continuing to inflict 2d6 HP fire for 1 min (<b>save basic Reflex</b>) (<b>heightened 8th</b> inflicts 5d6 HP initial and 3d6 HP for 1 min; <b>9th</b> inflicts 6d6 HP initial and 3d6 HP for 1 min)"',
  'Fire Shield':
    'Level=4 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains cold resistance 5, and melee attackers suffer 2d6 HP fire, for 1 min (<b>heightened +2</b> gives cold resistance +5 and inflicts +1d6 HP)"',
  'Fireball':
    'Level=3 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 20\' burst inflicts 6d6 HP fire (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Flame Strike':
    'Level=5 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' radius inflicts 8d6 HP fire, ignoring half of any resistance (<b>save basic Reflex</b>; fire immunity improves save by 1 degree) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Flaming Sphere':
    'Level=2 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Movable flame inflicts 3d6 HP fire in a 15\' sq while sustained for up to 1 min (<b>save basic Reflex</b>; success negates) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Fleet Step':
    'Level=1 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="Self gains +30\' Speed for 1 min"',
  'Flesh To Stone':
    'Level=6 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts initial slowed 1; subsequent failed or successful saves each rd increase or decrease the degree slowed until the target is no longer slowed or becomes immobile and permanently turned to stone (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates; critical failure inflicts initial slowed 2)"',
  'Floating Disk':
    'Level=1 ' +
    'Traits=Conjuration,Force ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates an invisible 2\' radius disk that follows self and holds 5 Bulk for 8 hr"',
  'Fly':
    'Level=4 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains a fly Speed of the greater of its Speed or 20\' for 5 min (<b>heightened 7th</b> effects last for 1 hr)"',
  'Forbidding Ward':
    'Level=1 ' +
    'Traits=Abjuration,Cantrip ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +1 Armor Class and saves vs. a specified foe while sustained for up to 1 min (<b>heightened 6th</b> gives +2 Armor Class and saves)"',
  'Foresight':
    'Level=9 ' +
    'Traits=Divination,Mental,Prediction ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +2 initiative and does not suffer flat-footed vs. undetected and flanking creatures, and self may use a reaction to give the target the better of 2 rolls or its foe the worse of 2 rolls, for 1 hr"',
  'Freedom Of Movement':
    'Level=4 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Relieves touched of Speed penalty effects and gives automatic success on Escape attempts vs. non-magical effects and magical effects up to the spell level for 10 min"',
  'Gaseous Form':
    'Level=4 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched becomes vapor with resistance 8 to physical damage, immunity to precision damage, proficiency modifier for unarmored defense, and 10\' fly Speed  for 5 min or until the target or self ends the spell"',
  'Gate':
    'Level=10 ' +
    'Traits=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Opens a 40\' radius gate to another plane while sustained for up to 1 min"',
  'Gentle Repose':
    'Level=2 ' +
    'Traits=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched corpse does not decay and cannot be made undead until next daily prep (<b>heightened 5th</b> effects are permanent)"',
  'Ghost Sound':
    'Level=1 ' +
    'Traits=Auditory,Cantrip,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates sound equivalent to 4 humans shouting while sustained (<b>heightened 3rd</b> R60\'; <b>5th</b> R120\')"',
  'Ghostly Weapon':
    'Level=3 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched weapon becomes translucent and can affect incorporeal creatures for 5 min"',
  'Ghoulish Cravings':
    'Level=2 ' +
    'Traits=Disease,Evil,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 2 ghoul fever, which inflicts 3d8 HP negative and half normal healing; subsequent daily save failures will inflict an additional 3d8 HP at stage 3, 3d8 HP and no healing at stage 4 and stage 5, and death and transformation into a ghoul at stage 6 (<b>save Fortitude</b> inflicts stage 1 with no initial ill effects; critical success negates; critical failure inflicts stage 3)"',
  'Glibness':
    'Level=4 ' +
    'Traits=Uncommon,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +%{rank.Deception?4:(4+level)} Deception to lie and against Perception to discern truth for 10 min"',
  'Glitterdust':
    'Level=2 ' +
    'Traits=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst inflicts dazzled and negates invisibility for 1 min (<b>save Reflex</b> negates invisibility only for 2 rd; critical success negates; critical failure blinds for 1 rd and dazzles and negates invisibility for 10 min)"',
  'Globe Of Invulnerability':
    'Level=4 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' burst attempts to counteract outside spells at the spell level - 1 for 10 min"',
  'Glyph Of Warding':
    'Level=3 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Specified trigger on a target container or 10\'x10\' area triggers a chosen spell of lower level"',
  'Goblin Pox':
    'Level=1 ' +
    'Traits=Disease,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 1 goblin pox, which inflicts sickened 1 for 1 rd; subsequent failures after 1 rd will inflict sickened 1 and slowed 1 for 1 rd at stage 2, and incurably sickened 1 for 1 dy at stage 3 (<b>save Fortitude</b> inflicts sickened 1 only; critical success negates; critical failure inflicts stage 2; goblins and goblin dogs are immune)"',
  'Grease':
    'Level=1 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 4 5\' squares cause falls, or 1 target object inflicts a -2 penalty to checks, for 1 min (<b>save Reflex or Acrobatics</b> negates; critical failure causes the holder to drop the target object)"',
  'Grim Tendrils':
    'Level=1 ' +
    'Traits=Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' line inflicts 2d4 HP negative and 1 HP persistent bleed on living creatures (<b>save Fortitude</b> inflicts half HP negative only; critical success negates; critical failure inflicts double initial and persistent HP) (<b>heightened +1</b> inflicts +2d4 HP initial and +1 HP persistent)"',
  'Guidance':
    'Level=1 ' +
    'Traits=Cantrip,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target gains +1 on an attack, Perception, save, or skill check within 1 rd once per target per hr"',
  'Gust Of Wind':
    'Level=1 ' +
    'Traits=Air,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line extinguishes small, non-magical fires, disperses fog, moves light objects, and knocks prone creatures up to Large for 1 rd (<b>save Fortitude</b> prevents moving against the wind but does not knock prone; critical success negates; critical failure pushes 30\', knocks prone, and inflicts 2d6 HP bludgeoning)"',
  'Hallucination':
    'Level=5 ' +
    'Traits=Illusion,Incapacitation,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Changes target\'s perception of an object or group for 1 hr (<b>save Will</b> target knows that it\'s hallucinating; critical success negates; critical failure inflicts -4 saves to disbelieve) (<b>heightened 6th</b> affects 10 targets or effects last until next daily prep; <b>8th</b> affects any number of targets or effects are permanent)"',
  'Hallucinatory Terrain':
    'Level=4 ' +
    'Traits=Uncommon,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' 50\' burst illusion changes the look, sound, feel, and smell of the terrain until next daily prep (<b>heightened 5th</b> the illusion can mask or incorporate structures)"',
  'Harm':
    'Level=1 ' +
    'Traits=Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched (2 or 3 actions gives R30\' or a 30\' emanation) suffers 1d%{harmSpellDie} HP negative (<b>save basic Fortitude</b>); undead instead regain 1d%{harmSpellDie} HP, or 1d%{harmSpellDie}+8 HP with 2 actions (<b>heightened +1</b> restores or inflicts +1d%{harmSpellDie} HP; undead regain +8 HP with 2 actions)"',
  'Haste':
    'Level=3 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains an extra Strike or Stride action each rd for 1 min (<b>heightened 7th</b> affects 6 targets)"',
  'Heal':
    'Level=1 ' +
    'Traits=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched (2 or 3 actions gives R30\' or a 30\' emanation) regains 1d%{healSpellDie} HP, or 1d%{healSpellDie}+8 HP with 2 actions; undead instead suffer 1d%{healSpellDie} HP (<b>save basic Fortitude</b>) (<b>heightened +1</b> restores or inflicts +1d%{healSpellDie} HP; restores +8 HP with 2 actions)"',
  'Heroism':
    'Level=3 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +1 attack, Perception, saves, and skill checks for 10 min (<b>heightened 6th</b> gives +2 bonus; <b>8th</b> gives +3 bonus)"',
  'Hideous Laughter':
    'Level=2 ' +
    'Traits=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts slowed 1 and loss of reactions while sustained (<b>save Will</b> inflicts loss of reactions only; critical success negates; critical failure inflicts prone for 1 rd, then slowed 1 and loss of reactions)"',
  'Holy Cascade':
    'Level=4 ' +
    'Traits=Evocation,Good,Positive,Water ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 20\' burst inflicts 3d6 HP bludgeoning, plus 6d6 HP positive to undead and 6d6 HP good to fiends (<b>heightened +1</b> inflicts +1d6 HP bludgeoning and +2d6 HP positive and good)"',
  'Horrid Wilting':
    'Level=8 ' +
    'Traits=Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Targets in a 500\' radius suffer 10d10 HP negative (<b>save basic Fortitude</b>; plant and water creatures worsen save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Humanoid Form':
    'Level=2 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Small or Medium humanoid and gains +4 Deception to pass as the chosen ancestry for 10 min (<b>heightened 3rd</b> gives darkvision or low-light vision if appropriate to the ancestry; <b>5th</b> becomes a Large humanoid)"',
  'Hydraulic Push':
    'Level=1 ' +
    'Traits=Attack,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 3d6 HP bludgeoning and a 5\' push, or 6d6 HP bludgeoning and a 10\' push with a critical success (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Hydraulic Torrent':
    'Level=4 ' +
    'Traits=Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line inflicts 8d6 HP bludgeoning and a 5\' push (<b>save basic Fortitude</b>; success negates push; critical failure doubles push distance)"',
  'Hypercognition':
    'Level=3 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="Allows self to use 6 Recall Knowledge actions immediately"',
  'Hypnotic Pattern':
    'Level=3 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst inflicts dazzled and fascinated while sustained for up to 1 min (<b>save Will</b> inflicts dazzled only; critical failure inflicts loss of reactions)"',
  'Illusory Creature':
    'Level=2 ' +
    'Traits=Auditory,Illusion,Olfactory,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Creates an image of a Large or smaller creature with Armor Class %{spellDifficultyClass.%tradition}, +%{spellAttackModifier.%tradition} attack, 1d4+%{spellModifier.%tradition} HP nonlethal mental damage, and +%{spellDifficultyClass.%tradition-10} saves while sustained or until damaged; each Sustain allows directing 2 actions (<b>heightened +1</b> creature inflicts +1d4 HP and can be 1 size larger)"',
  'Illusory Disguise':
    'Level=1 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes self appear different and gives +%{4+(rank.Deception?0:level)} Deception to avoid uncovering the disguise for 1 hr (<b>heightened 2nd</b> also disguises voice and scent; <b>3rd</b> allows copying a specific individual)"',
  'Illusory Object':
    'Level=1 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Creates an image of a stationary object in a 20\' burst for 10 min (<b>heightened 2nd</b> effects include sounds and smells and last for 1 hr; <b>5th</b> effects are permanent)"',
  'Illusory Scene':
    'Level=5 ' +
    'Traits=Auditory,Illusion,Olfactory,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Creates in a 30\' burst a moving illusion with up to 10 creatures or objects, sounds, and smells for 1 hr (<b>heightened 6th</b> creatures in the scene can speak; <b>8th</b> effects are permanent)"',
  'Implosion':
    'Level=9 ' +
    'Traits=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 75 HP on 1 target each rd while sustained for up to 1 min; a target cannot be affected twice by a single casting (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +10 HP)"',
  'Insect Form':
    'Level=3 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium bug with 10 temporary HP, Armor Class %{level+18}, +13 attack, +2 damage, low-light vision, +13 Athletics modifier, and creature-specific features for 1 min (<b>heightened 4th</b> becomes a Large creature with 10\' reach, 15 temporary HP, +16 attack, +6 damage, +16 Athletics; <b>5th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, +18 attack, +2 damage and double damage dice, +20 Athletics)"',
  'Invisibility':
    'Level=2 ' +
    'Traits=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched becomes invisible for 10 min; using a hostile action ends (<b>heightened 4th</b> effects last for 1 min, and a hostile action does not end the spell)"',
  'Invisibility Sphere':
    'Level=3 ' +
    'Traits=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' emanation makes creatures within invisible for 10 min or until any affected performs a hostile act (<b>heightened 5th</b> effects last for 1 hr)"',
  'Item Facade':
    'Level=1 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes the target object up to a 10\' cube appear decrepit or perfect for 1 hr (<b>heightened 2nd</b> effects last for 24 hr; <b>3rd</b> effects are permanent)"',
  'Jump':
    'Level=1 ' +
    'Traits=Move,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self to jump 30\' immediately (<b>heightened 3rd</b> affects touched, and effects last for 1 min)"',
  'Knock':
    'Level=2 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Gives +4 Athletics or Thievery on attempts to open the target object for 1 min; untrained attempts by self gain an additional +%{level}"',
  'Know Direction':
    'Level=1 ' +
    'Traits=Cantrip,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Reveals which direction is north (<b>heightened 7th</b> reveals direction to a familiar location)"',
  'Levitate':
    'Level=3 ' +
    'Traits=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to use concentrate actions to move the touched object or willing creature up or down 10\' for 5 min"',
  'Light':
    'Level=1 ' +
    'Traits=Cantrip,Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched object lights a 20\' radius until next daily prep (<b>heightened 4th</b> lights a 60\' radius)"',
  'Lightning Bolt':
    'Level=3 ' +
    'Traits=Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"120\' line inflicts 4d12 HP electricity (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Locate':
    'Level=3 ' +
    'Traits=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Reveals the direction to a named object or the nearest object of a named type while sustained; effects are blocked by lead and running water (<b>heightened 5th</b> reveals the direction to a familiar creature or ancestry)"',
  'Lock':
    'Level=1 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched latch or lock opens only for self until next daily prep; a successful DC %{spellDifficultyClass.%tradition} Athletics or Thievery check (or lock DC + 4 if higher) ends the spell (<b>heightened 2nd</b> effects are permanent)"',
  'Longstrider':
    'Level=1 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +10\' Speed for 1 hr (<b>heightened 2nd</b> effects last for 8 hr)"',
  'Mage Armor':
    'Level=1 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +1 Armor Class with a +5 maximum Dexterity modifier until next daily prep (<b>heightened 4th</b> also gives +1 saves; <b>6th</b> gives +2 Armor Class; <b>8th</b> gives +2 saves; <b>10th</b> gives +3 Armor Class and saves)"',
  'Mage Hand':
    'Level=1 ' +
    'Traits=Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Moves a light object 20\' per rd while sustained (<b>heightened 3rd</b> moves a Bulk 1 object; <b>5th</b> R60\'; <b>7th</b> moves a Bulk 2 object)"',
  'Magic Aura':
    'Level=1 ' +
    'Traits=Uncommon,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Alters the magical aura of the target object, making it appear as non-magical, as a common magical item of up to twice the spell level, or as under the effects of a spell of up to the spell level, until next daily prep (<b>heightened 3rd</b> can affect a creature or all of its possessions)"',
  'Magic Fang':
    'Level=1 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched creature\'s unarmed attack gains +1 attack and 2 damage dice for 1 min"',
  'Magic Missile':
    'Level=1 ' +
    'Traits=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' 1 missile (2 or 3 actions gives 2 or 3 missiles) inflicts 1d4+1 HP force (<b>heightened +2</b> gives 1 additional missile per action)"',
  'Magic Mouth':
    'Level=2 ' +
    'Traits=Auditory,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"The image of a mouth appears on the touched creature or object and speaks a specified message up to 25 words the next time a specified trigger occurs within 30\'"',
  'Magic Weapon':
    'Level=1 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="Touched weapon gains +1 attack and 2 damage dice for 1 min"',
  'Magnificent Mansion':
    'Level=7 ' +
    'Traits=Uncommon,Conjuration,Extradimensional ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Creates an entrance to a 40\'x40\'x30\' demiplane that can be entered only by those specified, is staffed by servants, and contains provisions for up to 150 people"',
  "Mariner's Curse":
    'Level=5 ' +
    'Traits=Curse,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers incurable sickened 1, plus slowed 1 on open water, until the curse is removed (<b>save Will</b> inflicts curable sickened 1; critical success negates; critical success inflicts incurable sickened 2)"',
  'Mask Of Terror':
    'Level=7 ' +
    'Traits=Emotion,Fear,Illusion,Mental,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target inflicts frightened 2 for 1 rd on attackers for 1 min (<b>save Will</b> negates; critical failure prevents attack) (<b>heightened 8th</b> affects 5 targets)"',
  'Massacre':
    'Level=9 ' +
    'Traits=Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line inflicts 100 HP negative on creatures up to level 17 and kills those reduced to 0 HP; if none die, it inflicts an additional 30 negative on all within the line, including self (<b>save Fortitude</b> inflicts 9d6 HP; critical success negates; critical failure kills) (<b>heightened 10th</b> inflicts 115 HP (<b>save Fortitude</b> 10d6 HP) on creatures up to level 19)"',
  'Maze':
    'Level=8 ' +
    'Traits=Conjuration,Extradimensional,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transports the target to an extradimensional maze while sustained or until it gains 2 solution steps; success on a Survival or Perception check gives 1 step, critical success gives 2 steps, and critical failure negates any previous successes"',
  'Meld Into Stone':
    'Level=3 ' +
    'Traits=Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to enter a touched stone, retaining the ability to hear outside sounds, for 10 min"',
  'Mending':
    'Level=1 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Restores 5 HP per spell level to a touched light, non-magical object (<b>heightened 2nd</b> can affect a 1 Bulk object; <b>3rd</b> can affect a 2 Bulk or magical 1 Bulk object)"',
  'Message':
    'Level=1 ' +
    'Traits=Auditory,Cantrip,Illusion,Linguistic,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' Allows self to hold a private conversation with a visible target for 1 turn (<b>heightened 3rd</b> R500\')"',
  'Meteor Swarm':
    'Level=9 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 4 meteors each inflict 6d10 HP bludgeoning in a 10\' burst and 14d6 HP fire in a 40\' burst (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d10 HP bludgeoning and +2d6 HP fire)"',
  'Mind Blank':
    'Level=8 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +4 saves vs. mental effects and automatic counteract attempts at the spell level + 1 vs. detection, revelation, and scrying until next daily prep"',
  'Mind Probe':
    'Level=5 ' +
    'Traits=Uncommon,Divination,Linguistic,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Self gains answers from the target, requiring a DC %{spellDifficultyClass.%tradition} Deception check to refuse to answer each, with critical success giving a believable false answer (<b>save Will</b> negates; critical failure inflicts -4 Deception)"',
  'Mind Reading':
    'Level=3 ' +
    'Traits=Uncommon,Detection,Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Reveals the surface thoughts of the target and whether its intelligence is higher, lower, or equal (<b>save Will</b> reveals relative intelligence only; critical success allows the target to read self\'s surface thoughts instead; critical failure allows sustaining for up to 1 min with no further save attempts)"',
  'Mindlink':
    'Level=1 ' +
    'Traits=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Telepathically transmits 10 min of information from self to touched"',
  'Miracle':
    'Level=10 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known divine spell of up to 9th level or a common spell of up to 7th level"',
  'Mirror Image':
    'Level=2 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates 3 duplicates that have an equal chance of misdirecting attacks on self for 1 min; any hit on a duplicate destroys it, and a critical success also hits self with a normal success"',
  'Misdirection':
    'Level=2 ' +
    'Traits=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Changes the magical aura of a target to mimic another until next daily prep"',
  'Mislead':
    'Level=6 ' +
    'Traits=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Turns self invisible and creates an illusory duplicate while sustained for up to 1 min; a successful Deception vs. Perception can make it appear that a self action originated with the duplicate"',
  'Modify Memory':
    'Level=4 ' +
    'Traits=Uncommon,Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Changes 1 rd of the target\'s memory each rd while sustained for up to 5 min (<b>save Will</b> negates; critical success allows the target to notice the attempt) (<b>heightened 6th</b> erases all memory of a specified topic from a willing target)"',
  'Moment Of Renewal':
    'Level=8 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"6 touched instantly gain the effects of 24 hr of rest once per target per day"',
  'Monstrosity Form':
    'Level=8 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Huge phoenix, purple worm, or sea serpent with 20 temporary HP, Armor Class %{level+20}, +28 attack, darkvision, +30 Athletics modifier, and creature-specific attacks for 1 min (<b>heightened 9th</b> gives 25 temporary HP, Armor Class %{level+22}, +31 attack, an additional damage die, +33 Athletics)"',
  'Moon Frenzy':
    'Level=5 ' +
    'Traits=Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5 willing targets gain 5 temporary HP, +10\' Speed, fangs and claws that inflict 2d8 HP piercing and 2d6 HP slashing plus 1d4 HP persistent bleed on a critical hit, and increase a size up to Large in full moonlight, but suffer weakness 5 to silver and prohibition of non-rage, non-Seek concentration actions, for 1 min (<b>heightened 6th</b> gives 10 temporary HP, inflict 3d8 HP piercing and 3d6 HP slashing, weakness 10 to silver; <b>10th</b> gives 20 temporary HP, inflict 4d8 HP piercing and 4d6 HP slashing, weakness 20 to silver)"',
  'Nature Incarnate':
    'Level=10 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium green man or Gargantuan kaiju with 30 temporary HP, Armor Class %{level+25}, +34 attack, darkvision, +36 Athletics modifier, and creature-specific attacks for 1 min"',
  "Nature's Enmity":
    'Level=9 ' +
    'Traits=Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 5 targets in a 500\' burst suffer -10\' Speed, attacks from animals that inflict 2d10 HP slashing and flat-footed for 1 rd (DC 8 flat negates; <b>save basic Reflex</b>), a required DC 5 flat check to cast primal spells, and hostility from bonded animals, fungi, and plants for 10 min"',
  'Negate Aroma':
    'Level=1 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Negates the scent of a willing touched creature for 1 hr (<b>heightened 5th</b> R30\' affects 10 targets)"',
  'Neutralize Poison':
    'Level=3 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract check against 1 poison affecting touched"',
  'Nightmare':
    'Level=4 ' +
    'Traits=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Causes a familiar target to have nightmares and awaken fatigued (<b>save Will</b> inflicts nightmares only; critical success negates; critical failure also inflicts drained 2 until no longer fatigued)"',
  'Nondetection':
    'Level=3 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched gains automatic counteract attempts vs. magical divinations for 8 hr"',
  'Obscuring Mist':
    'Level=2 ' +
    'Traits=Conjuration,Water ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="R120\' 20\' burst conceals creatures for 1 min"',
  "Outcast's Curse":
    'Level=4 ' +
    'Traits=Curse,Enchantment,Mental,Misfortune ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers 1 step worse initial attitudes and the worse of 2 Deception, Diplomacy, Intimidation, and Performance rolls until the curse is removed (<b>save Will</b> effects last for 10 min; critical success negates; critical failure inflicts initial attitudes 2 steps worse)"',
  'Overwhelming Presence':
    'Level=9 ' +
    'Traits=Auditory,Enchantment,Incapacitation,Mental,Visual ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"40\' burst inflicts fascinated and forces creatures to pay tribute once per turn for 6 turns (<b>save Will</b> affected must pay tribute only twice; critical success negates; critical failure causes affected to use all actions each turn to pay tribute)"',
  'Paralyze':
    'Level=3 ' +
    'Traits=Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts paralyzed for 1 rd (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure inflicts paralyzed for 4 rd; subsequent successful saves shorten the effects by 1 rd, and a critical success ends them) (<b>heightened 7th</b> affects 10 targets)"',
  'Paranoia':
    'Level=2 ' +
    'Traits=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target becomes unfriendly to all others for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure causes target to treat all others as enemies) (<b>heightened 6th</b> effects 5 targets)"',
  'Pass Without Trace':
    'Level=1 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Increases the DC to Track self by 4 or to %{spellDifficultyClass.%tradition}, whichever is higher, for 1 hr (<b>heightened 2nd</b> effects last for 8 hr; <b>4th</b> effects last for 8 hr and affect a 20\' radius and 10 creatures)"',
  'Passwall':
    'Level=5 ' +
    'Traits=Uncommon,Conjuration,Earth ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates a 5\'x10\'x10\' tunnel in wood, plaster, or stone for 1 hr (<b>heightened 7th</b> the tunnel extends 20\', appears as normal wall, and can be entered only using a password or trigger)"',
  'Pest Form':
    'Level=1 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Tiny animal with Armor Class %{level+15}, 20\' Speed, low-light vision, 30\' imprecise scent, +10 Acrobatics and Stealth modifiers, -4 Athletics modifier, and weakness 5 to physical damage for 10 min (<b>heightened 4th</b> becomes a creature with a 20\' fly Speed)"',
  'Phantasmal Calamity':
    'Level=6 ' +
    'Traits=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 30\' burst inflicts 11d6 HP mental (<b>save basic Will</b>; critical failure also inflicts stunned 1 and trapped (<b>save Reflex</b> negates) until a subsequent Will save each rd succeeds) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Phantasmal Killer':
    'Level=4 ' +
    'Traits=Death,Emotion,Fear,Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts 8d6 HP mental and frightened 2 (<b>save Will</b> inflicts 4d6 HP mental and frightened 1; critical success negates; critical failure inflicts death on a failed Fortitude save or 12d6 HP mental, fleeing for 1 rd, and frightened 1 on success) (<b>heightened +1</b> inflicts +2d6 HP, or +3d6 HP on a critical failure)"',
  'Phantom Pain':
    'Level=1 ' +
    'Traits=Illusion,Mental,Nonlethal ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 2d4 HP mental, 1d4 HP persistent mental, and sickened 1 for 1 min or until no longer sickened (<b>save Will</b> inflicts initial HP only; critical success negates; critical failure inflicts sickened 2) (<b>heightened +1</b> inflicts +2d4 HP initial and +1d4 HP persistent)"',
  'Phantom Steed':
    'Level=2 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R30\' Conjures a magical mount (Armor Class 20, HP 10, 40\' Speed) that can be ridden only by a designated creature for 8 hr (<b>heightened 4th</b> mount has 60\' Speed and can move normally over water and natural difficult terrain; <b>5th</b> mount can also <i>Air Walk</i> for 1 rd; <b>6th</b> mount has 80\' Speed and can fly)"',
  'Plane Shift':
    'Level=7 ' +
    'Traits=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transports self and 8 willing targets to an imprecise location on a different plane"',
  'Plant Form':
    'Level=5 ' +
    'Traits=Plant,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large plant with 12 temporary HP, Armor Class %{level+19}, +17 attack, +11 damage, low-light vision, resistance 10 to poison, +19 Athletics modifier, and plant-specific attacks for 1 min (<b>heightened 6th</b> becomes a Huge plant with +5\' reach, 24 temporary HP, Armor Class %{level+22}, +21 attack, +16 damage, +22 Athletics)"',
  'Polar Ray':
    'Level=8 ' +
    'Traits=Attack,Cold,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 10d8 HP cold, or double HP on a critical success, and drained 2 (<b>heightened +1</b> inflicts +2d8 HP)"',
  'Possession':
    'Level=7 ' +
    'Traits=Uncommon,Incapacitation,Mental,Necromancy,Possession ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self inhabits and controls the target\'s body for 1 min (<b>save Will</b> self inhabits but cannot control; critical success negates; critical failure gives control without further saves); a success on subsequent Will saves each turn negates control for 1 rd, and a critical success ends the spell (<b>heightened 9th</b> effects last for 10 min, and self body merges into possessed body)"',
  'Power Word Blind':
    'Level=7 ' +
    'Traits=Uncommon,Auditory,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Permanently blinds a target up to level 11, blinds a level 12 or 13 target for 1d4 min, or dazzles a level 14+ target for 1 min (<b>heightened +1</b> increases outcome levels by 2)"',
  'Power Word Kill':
    'Level=9 ' +
    'Traits=Uncommon,Auditory,Death,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Kills a target up to level 14 or 50 HP, inflicts 0 HP and dying 1 on a level 15 target, or inflicts 50 HP on a level 16+ target (<b>heightened +1</b> increases outcome levels by 2)"',
  'Power Word Stun':
    'Level=8 ' +
    'Traits=Uncommon,Auditory,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts stunned for 1d6 rd on a target up to level 13, stunned for 1 rd on a level 14 or 15 target, or stunned 1 on a level 16+ target (<b>heightened +1</b> increases outcome levels by 2)"',
  'Prestidigitation':
    'Level=1 ' +
    'Traits=Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R10\' Performs cooking, lifting, making a minor object, or tidying while sustained"',
  'Primal Herd':
    'Level=10 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self and 5 willing targets become Huge mammoths with 20 temporary HP, 40\' Speed, low-light vision, Armor Class level + 22, a tusk attack that inflicts 4d8+19 HP piercing, a trunk attack that inflicts 4d6+16 HP bludgeoning, a foot attack that inflicts 4d6+13 HP bludgeoning, low-light vision, +30 Athletics modifier, and a trample action for 1 min"',
  'Primal Phenomenon':
    'Level=10 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known primal spell of up to 9th level or a common spell of up to 7th level"',
  'Prismatic Sphere':
    'Level=9 ' +
    'Traits=Abjuration,Light ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R10\' 20\' bright light in a 10\' burst inflicts blindness for 1 rd (<b>save Will</b> inflicts dazzled for 1 rd; critical failure inflicts blindness for 1 min) and these effects on creatures passing through for 1 hr: 20 HP fire (<b>save basic Reflex</b>); 25 HP acid (<b>save basic Reflex</b>); 30 HP electricity (<b>save basic Reflex</b>); 10 HP poison and enfeebled 1 for 1 min (<b>save basic Fortitude</b> also negates enfeebled); <i>Flesh To Stone</i> effects (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates); <i>Warp Mind</i> effects (<b>save Will</b> inflicts confused for 1 action; critical success negates); slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects)"',
  'Prismatic Spray':
    'Level=7 ' +
    'Traits=Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone randomly inflicts an effect on each creature affected: (1) 50 HP fire (<b>save Reflex</b> negates); (2) 60 HP acid (<b>save Reflex</b> negates); (3) 70 HP electricity (<b>save Reflex</b> negates); (4) 30 HP poison and enfeebled 1 for 1 min (<b>save Fortitude</b> negates); (5) <i>Flesh To Stone</i> effects (<b>save Fortitude</b> negates); (6) <i>Warp Mind</i> effects (<b>save Will</b> negates); (7) slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects); (8) 2 of the preceding effects"',
  'Prismatic Wall':
    'Level=8 ' +
    'Traits=Abjuration,Light ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' bright light emitted by a 60\'x30\' wall inflicts blindness for 1 rd (<b>save Will</b> inflicts dazzled for 1 rd; critical failure inflicts blindness for 1 min) and these effects on creatures passing through for 1 hr: 20 HP fire (<b>save basic Reflex</b>); 25 HP acid (<b>save basic Reflex</b>); 30 HP electricity (<b>save basic Reflex</b>); 10 HP poison and enfeebled 1 for 1 min (<b>save basic Fortitude</b> also negates enfeebled); <i>Flesh To Stone</i> effects (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates); <i>Warp Mind</i> effects (<b>save Will</b> inflicts confused for 1 action; critical success negates); slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects)"',
  'Private Sanctum':
    'Level=4 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"100\' burst around touched location blocks sensory information, scrying, and mind-reading until next daily prep"',
  'Produce Flame':
    'Level=1 ' +
    'Traits=Attack,Cantrip,Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP fire, or double HP plus 1d4 HP persistent fire on a critical success (<b>heightened +1</b> inflicts +1d4 HP initial and persistent)"',
  'Project Image':
    'Level=7 ' +
    'Traits=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates an illusory copy of self, with the same Armor Class and saves, that can be used as a source of spells while sustained for up to 1 min or until damaged (<b>heightened +2</b> extends maximum sustain to 10 min)"',
  'Protection':
    'Level=1 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +1 Armor Class and saves vs. creatures of a specified alignment, and +3 vs. summoned creatures and control effects, for 1 min"',
  'Prying Eye':
    'Level=5 ' +
    'Traits=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location and that can be moved 30\' each rd while sustained"',
  'Punishing Winds':
    'Level=8 ' +
    'Traits=Air,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R100\' 30\' radius lowers flying creatures by 40\', creates greater difficult terrain for flying creatures and difficult terrain for others, and requires a successful flying Acrobatics or grounded Athletics vs. DC %{spellDifficultyClass.%tradition} to exit while sustained for up to 1 min"',
  'Purify Food And Drink':
    'Level=1 ' +
    'Traits=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Removes contaminates from 1 cubic foot of food or water"',
  'Purple Worm Sting':
    'Level=6 ' +
    'Traits=Necromancy,Poison ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers 3d6 HP piercing and stage 1 purple worm venom, which inflicts 3d6 HP poison and enfeebled 2; subsequent failures after 1 rd will inflict 4d6 HP and 6d6 HP at stage 2 and stage 3 (<b>save Fortitude</b> inflicts 3d6 HP piercing and 3d6 HP poison only; critical success inflicts 3d6 HP piercing only; critical failure inflicts stage 2 immediately)"',
  'Raise Dead':
    'Level=6 ' +
    'Traits=Uncommon,Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R10\' Restores a willing soul up to level 13 to its corpse, dead for at most 3 days, giving it 1 HP, clumsy 2, drained 2, and enfeebled 2 for 1 week (<b>heightened 7th</b> raises the maximum level to 15; <b>8th</b> level 17; <b>9th</b> level 19; <b>10th</b> level 21)"',
  'Ray Of Enfeeblement':
    'Level=1 ' +
    'Traits=Attack,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts enfeebled 1; critical success negates; critical failure inflicts enfeebled 3; critical success on attack worsens save by 1 degree)"',
  'Ray Of Frost':
    'Level=1 ' +
    'Traits=Attack,Cantrip,Cold,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP cold (critical success inflicts double HP and -10 Speed for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Read Aura':
    'Level=1 ' +
    'Traits=Cantrip,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Reveals whether an object is magical and the related school of magic (<b>heightened 3rd</b> affects 10 targets; <b>6th</b> affects unlimited targets)"',
  'Read Omens':
    'Level=4 ' +
    'Traits=Uncommon,Divination,Prediction ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals a clue or advice about a proposed activity up to 1 week in the future"',
  'Regenerate':
    'Level=7 ' +
    'Traits=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched target regains 15 HP and regrows a damaged organ each rd for 1 min; suffering new acid or fire damage negates the effects for 1 rd (<b>heightened 9th</b> restores 20 HP each rd)"',
  'Remake':
    'Level=10 ' +
    'Traits=Uncommon,Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 hr" ' +
    'Description=' +
      '"R5\' Fully re-creates a known object up to 5\'x5\'x5\' from a remnant"',
  'Remove Curse':
    'Level=4 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 curse affecting touched"',
  'Remove Disease':
    'Level=3 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast="10 min" ' +
    'Description="Makes a counteract attempt vs. 1 disease affecting touched"',
  'Remove Fear':
    'Level=2 ' +
    'Traits=Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 fear effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Remove Paralysis':
    'Level=2 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. a paralysis effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Repulsion':
    'Level=6 ' +
    'Traits=Abjuration,Aura,Mental ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Emanation up to 40\' prevents creatures from approaching for 1 min (<b>save Will</b> inflicts difficult terrain; critical success negates)"',
  'Resilient Sphere':
    'Level=4 ' +
    'Traits=Abjuration,Force ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates an impassible force sphere with Armor Class 5, Harness 10, and 40 HP around the target for 1 min or until destroyed (<b>save Reflex</b> decreases the HP to 10; critical success negates)"',
  'Resist Energy':
    'Level=2 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 5 vs. a specified energy type for 10 min (<b>heightened 4th</b> gives resistance 10 to 2 targets; <b>7th</b> gives resistance 15 to 5 targets)"',
  'Resplendent Mansion':
    'Level=9 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates a 300\'x300\' mansion, with entrances protected by <i>Alarm</i> effects and containing provisions for up to 150 people, until next daily prep"',
  'Restoration':
    'Level=2 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Gives a 2-step reduction to a clumsy, enfeebled, or stupefied condition, a 1-step reduction to 2 of these conditions, or a 1-stage reduction to a toxin affecting touched (<b>heightened 4th</b> allows reducing a drained condition, lessening a toxin by 2 stages, or reducing a non-permanent doomed condition by 1; <b>6th</b> allows reducing a permanent doomed condition by 1)"',
  'Restore Senses':
    'Level=2 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. a magical blindness or deafness effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Retrocognition':
    'Level=7 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Reveals impressions of 1 day of past events at the current location per 1 min of concentration; traumatic events require a Will save to maintain the spell (<b>heightened 8th</b> gives impressions of 1 year per min; <b>9th</b> gives impressions of 1 century per min)"',
  'Reverse Gravity':
    'Level=7 ' +
    'Traits=Uncommon,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Objects in a 20\'x40\' cylinder fall upward for 1 min"',
  'Revival':
    'Level=10 ' +
    'Traits=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' radius restores 10d8+40 HP to living targets and raises dead targets with the same number of temporary HP while sustained for up to 1 min"',
  'Righteous Might':
    'Level=6 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains Armor Class %{level+20}, 10 temporary HP, 40\' Speed, resistance 3 to physical damage, darkvision, +21 attack and +8 damage (+6 if ranged) with a %{deityWeaponLowered}, and +23 Athletics for 1 min (<b>heightened 8th</b> gives a Large form with 10\' reach, Armor Class %{21+level}, 15 temporary HP, resistance 4 to physical damage, +28 attack and +15 damage (+12 if ranged) with a %{deityWeaponLowered}, and +29 Athletics)"',
  'Rope Trick':
    'Level=4 ' +
    'Traits=Uncommon,Conjuration,Extradimensional ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched rope leads to an extradimensional space that can hold 8 Medium creatures for 8 hr"',
  'Sanctified Ground':
    'Level=3 ' +
    'Traits=Abjuration,Consecration ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"30\' burst gives +1 Armor Class, attacks, damage, and saves vs. aberrations, celestials, dragons, fiends, monitors, or undead until next daily prep"',
  'Sanctuary':
    'Level=1 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Prevents creatures from attacking touched for 1 min (<b>save Will</b> each rd negates for 1 rd; critical success ends the spell; critical failure allows no further save attempts)"',
  'Scintillating Pattern':
    'Level=8 ' +
    'Traits=Illusion,Incapacitation,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts confused for 1d4 rd and dazzled in a 40\' radius while sustained for up to 1 min (<b>save Will</b> inflicts dazzled only; critical failure inflicts stunned for 1d4 rd, then confused for the remaining duration)"',
  'Scrying':
    'Level=6 ' +
    'Traits=Uncommon,Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Creates an invisible sensor that allows self to see the target creature while sustained for up to 10 min (<b>save Will</b> negates; critical success allows the target to glimpse self; critical failure allows the sensor to follow the target; scrying an unfamiliar target lowers the save DC by 2, and scrying an unknown target lowers it by 10)"',
  'Searing Light':
    'Level=3 ' +
    'Traits=Attack,Evocation,Fire,Good,Light ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 5d6 HP fire, plus 5d6 HP good to fiends and undead (critical success inflicts double HP), and attempts to counteract magical darkness (<b>heightened +1</b> inflicts +2d6 HP fire and good)"',
  'Secret Page':
    'Level=3 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Makes the text on a touched page appear as different text unless a specified password is spoken"',
  'See Invisibility':
    'Level=2 ' +
    'Traits=Divination,Revelation ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self treats invisible creatures and objects as concealed for 10 min (<b>heightened 5th</b> effects last for 8 hr)"',
  'Sending':
    'Level=5 ' +
    'Traits=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Self exchanges a pair of 25-word messages with a known creature"',
  'Shadow Blast':
    'Level=5 ' +
    'Traits=Evocation,Shadow ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone, R120\' 15\' burst, or 50\' line inflicts 5d8 HP of a choice of damage type (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Shadow Siphon':
    'Level=5 ' +
    'Traits=Illusion,Shadow ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Makes a counteract attempt on a damaging trigger spell at +2 the spell level, reducing the damage by half if successful"',
  'Shadow Walk':
    'Level=5 ' +
    'Traits=Uncommon,Conjuration,Shadow,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Allows self and 9 willing touched to travel through the Shadow Plane at 20x Speed for 8 hr"',
  'Shape Stone':
    'Level=4 ' +
    'Traits=Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="Reshapes touched 10\'x10\'x10\' stone"',
  'Shape Wood':
    'Level=2 ' +
    'Traits=Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Reshapes touched 20 cubic feet of wood"',
  'Shapechange':
    'Level=9 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Replicates any known polymorph spell of up to 8th level for 1 min"',
  'Shatter':
    'Level=2 ' +
    'Traits=Evocation,Sonic ' +
    'School=Evocation ' +
    'Traditions=Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 2d10 HP sonic on an unattended object, ignoring Hardness up to 4 (<b>heightened +1</b> inflicts +1d10 HP and ignores +2 Hardness)"',
  'Shield':
    'Level=1 ' +
    'Traits=Abjuration,Cantrip,Force ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +1 Armor Class for 1 rd; may end the spell and not use it again for 10 min to use Shield Block with Hardness 5 (<b>heightened 3rd</b> gives Hardness 10; <b>5th</b> gives Hardness 15; <b>7th</b> gives Hardness 20; <b>9th</b> gives Hardness 25)"',
  'Shield Other':
    'Level=2 ' +
    'Traits=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transfers half of damage suffered by target to self for 10 min or until either is reduced to 0 HP"',
  'Shillelagh':
    'Level=1 ' +
    'Traits=Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched staff gains +1 attack and 2 damage dice (3 damage dice vs. aberrations, extraplanar creatures, and undead) for 1 min"',
  'Shocking Grasp':
    'Level=1 ' +
    'Traits=Attack,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 2d12 HP electricity; touching an armored target gives +1 attack and also inflicts 1d4 HP persistent electricity (<b>heightened +1</b> inflicts +1d12 HP initial and +1 HP persistent)"',
  'Shrink':
    'Level=2 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target becomes Tiny for 5 min (<b>heightened 6th</b> affects 10 creatures)"',
  'Shrink Item':
    'Level=3 ' +
    'Traits=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transforms a touched non-magical object of up to 80 Bulk and 20 cubic feet into the size of a coin with negligible Bulk until next daily prep"',
  'Sigil':
    'Level=1 ' +
    'Traits=Cantrip,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Inscribes a 1\\" sq magical mark on a touched object or creature; the mark can be scrubbed off and fades from a creature after 1 week (<b>heightened 3rd</b> marks a creature for 1 month; <b>5th</b> marks a creature for 1 year; <b>7th</b> marks a creature permanently)"',
  'Silence':
    'Level=2 ' +
    'Traits=Illusion ' +
    'School=Illusion ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched makes no sound for 1 min (<b>heightened 4th</b> affects a 10\' radius around touched)"',
  'Sleep':
    'Level=1 ' +
    'Traits=Enchantment,Incapacitation,Mental,Sleep ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst inflicts unconsciousness for 1 min or until a successful Perception check (<b>save Will</b> inflicts -1 Perception for 1 rd; critical success negates; critical failure inflicts unconsciousness for 1 hr or until a successful Perception check) (<b>heightened 4th</b> inflicts unconsciousness for 1 rd, or 1 min on a critical failure, followed by normal sleep; targets release held objects and do not wake from a successful Perception check)"',
  'Slow':
    'Level=3 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts slowed 1 for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure inflicts slowed 2) (<b>heightened 6th</b> affects 10 targets)"',
  'Solid Fog':
    'Level=4 ' +
    'Traits=Conjuration,Water ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' burst conceals creatures and inflicts difficult terrain for 1 min"',
  'Soothe':
    'Level=1 ' +
    'Traits=Emotion,Enchantment,Healing,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target regains 1d10+4 Hit Points and gains +2 saves vs. mental effects for 1 min (<b>heightened +1</b> restores +1d10+4 Hit Points)"',
  'Sound Burst':
    'Level=2 ' +
    'Traits=Evocation,Sonic ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10\' burst inflicts 2d10 HP sonic and deafened for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, deafened for 1 min, and stunned 1) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Speak With Animals':
    'Level=2 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Allows self to communicate with animals for 10 min"',
  'Speak With Plants':
    'Level=4 ' +
    'Traits=Divination,Plant ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Allows self to communicate with plants and fungi for 10 min"',
  'Spectral Hand':
    'Level=2 ' +
    'Traits=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Creates a crawling, spectral hand that delivers touch spells for 1 min; damage to the hand ends the spell and inflicts 1d6 HP to self"',
  'Spell Immunity':
    'Level=4 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Gives touched an automatic counteract attempt vs. a specified spell until next daily prep"',
  'Spell Turning':
    'Level=7 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to use a reaction that redirects a spell to its caster via a successful counterspell once within 1 hr"',
  'Spellwrack':
    'Level=6 ' +
    'Traits=Abjuration,Curse,Force ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Until the curse is removed, each time the target is affected by a spell with a duration, it suffers 2d12 HP persistent force and the duration of every spell affecting it is reduced by 1 rd (<b>save Will</b> effects last for 1 min; critical success negates; critical failure inflicts 4d12 HP)"',
  'Spider Climb':
    'Level=2 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains a climb Speed equal to its Speed for 10 min (<b>heightened 5th</b> effects last for 1 hr)"',
  'Spider Sting':
    'Level=1 ' +
    'Traits=Necromancy,Poison ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers 1d4 HP piercing and stage 1 spider venom, which inflicts 1d4 HP poison and enfeebled 1; subsequent failures after 1 rd will inflict an additional 1d4 HP poison and enfeebled 2 at stage 2 (<b>save Fortitude</b> inflicts 1d4 HP piercing and 1d4 HP poison only; critical success negates; critical failure inflicts stage 2 immediately)"',
  'Spirit Blast':
    'Level=6 ' +
    'Traits=Force,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target\'s spirit suffers 16d6 HP force (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Spirit Link':
    'Level=1 ' +
    'Traits=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transfers 2 HP of damage each rd from a willing target to self for 10 min (<b>heightened +1</b> transfers +2 HP)"',
  'Spirit Song':
    'Level=8 ' +
    'Traits=Force,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 18d6 HP force on spirits, including any hidden in solid barriers (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Spiritual Epidemic':
    'Level=8 ' +
    'Traits=Curse,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts enfeebled 2 and stupefied 2 for 1 min and enfeebled 1 and stupefied 1 permanently; also affects creatures who later cast divine or occult spells on the target (<b>save Will</b> inflicts enfeebled 2 and stupefied 2 for 1 rd only; critical success negates; critical failure inflicts enfeebled 3 and stupefied 3 for 1 min and enfeebled 2 and stupefied 2 permanently)"',
  'Spiritual Guardian':
    'Level=5 ' +
    'Traits=Abjuration,Force ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Summoned guardian with 50 HP may attack or defend each rd while sustained for up to 1 min; +%{spellAttackModifier.%tradition} attack inflicts 2d8 HP force or weapon damage type; defense absorbs 10 HP of damage from an attack on an ally (<b>heightened +2</b> guardian gains +20 HP and inflicts +1d8 HP)"',
  'Spiritual Weapon':
    'Level=2 ' +
    'Traits=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spectral weapon makes a +%{spellAttackModifier.%tradition} attack that inflicts 1d8 HP force or weapon damage type each rd while sustained for up to 1 min (<b>heightened +2</b> inflicts +1d8 HP)"',
  'Stabilize':
    'Level=1 ' +
    'Traits=Cantrip,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R30\' Removes dying condition from target"',
  'Status':
    'Level=2 ' +
    'Traits=Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Reveals willing touched\'s direction, distance, and conditions until next daily prep (<b>heightened 4th</b> R10\' affects 10 targets)"',
  'Stinking Cloud':
    'Level=3 ' +
    'Traits=Conjuration,Poison ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst conceals creatures and inflicts sickened 1 and slowed 1 for 1 min (<b>save Fortitude</b> inflicts sickened 1 only; critical success negates; critical failure inflicts sickened 2 and slowed 1)"',
  'Stone Tell':
    'Level=6 ' +
    'Traits=Uncommon,Evocation,Earth ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Allows self to converse with stone for 10 min"',
  'Stone To Flesh':
    'Level=6 ' +
    'Traits=Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Restores touched petrified creature or transforms a human-sized stone object into flesh"',
  'Stoneskin':
    'Level=4 ' +
    'Traits=Abjuration,Earth ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 5 to non-adamantine physical damage for 20 min; each hit reduces the duration by 1 min (<b>heightened 6th</b> gives resistance 10; <b>8th</b> gives resistance 15; <b>10th</b> gives resistance 20)"',
  'Storm Of Vengeance':
    'Level=9 ' +
    'Traits=Air,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R800\' 360\' burst inflicts -4 ranged attacks, greater difficult terrain for flying, and a choice each rd of 4d8 HP acid (<b>no save</b>), 4d10 HP bludgeoning (<b>save basic Fortitude</b>), 7d6 HP electricity on 10 targets (<b>save basic Reflex</b>), difficult terrain and concealment, or deafened for 10 min (<b>save Fortitude</b> negates) while sustained for up to 1 min (<b>heightened 10th</b> R2200\' 1000\' burst)"',
  'Subconscious Suggestion':
    'Level=5 ' +
    'Traits=Enchantment,Incapacitation,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Specified trigger prompts the target to follow a reasonable, 1 min suggestion until next daily prep (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure inflicts following the suggestion for 1 hr) (<b>heightened 9th</b> affects 10 targets)"',
  'Suggestion':
    'Level=4 ' +
    'Traits=Enchantment,Incapacitation,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target follows a reasonable suggestion for 1 min (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure effects last for 1 hr) (<b>heightened 8th</b> targets 10 creatures)"',
  'Summon Animal':
    'Level=1 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 animal appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Celestial':
    'Level=5 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 celestial appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Construct':
    'Level=1 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 construct appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Dragon':
    'Level=5 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 dragon appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Elemental':
    'Level=2 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 1 elemental appears and fights for self while sustained for up to 1 min (<b>heightened 3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Entity':
    'Level=5 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 aberration appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Fey':
    'Level=1 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Occult,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 fey appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Fiend':
    'Level=5 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 fiend appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"', 
  'Summon Giant':
    'Level=5 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 giant appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Plant Or Fungus':
    'Level=1 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 plant or fungus appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Sunburst':
    'Level=7 ' +
    'Traits=Evocation,Fire,Light,Positive ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst attempts to counteract magical darkness and inflicts 8d10 HP fire, plus 8d10 HP positive to undead (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure also inflicts permanent blindness) (<b>heightened +1</b> inflicts +1d10 HP fire and positive)"',
  'Synaptic Pulse':
    'Level=5 ' +
    'Traits=Enchantment,Incapacitation ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts stunned 2 (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure inflicts stunned for 1 rd)"',
  'Synesthesia':
    'Level=5 ' +
    'Traits=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts a DC 5 flat check for concentration, clumsy 3, -10 Speed, and concealment of all objects and creatures for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure inflicts stunned 2) (<b>heightened 9th</b> affects 5 targets)"',
  'Talking Corpse':
    'Level=4 ' +
    'Traits=Uncommon,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched corpse truthfully answers 3 questions within 10 min (<b>save Will</b> allows lying or refusing to answer; critical success prevents self from resting for 24 hr; critical failure inflicts -2 on Deception checks when giving misleading answers)"',
  'Tanglefoot':
    'Level=1 ' +
    'Traits=Attack,Cantrip,Conjuration,Plant ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts -10\' Speed for 1 rd, plus immobilized for 1 rd on a critical success; a successful Escape negates (<b>heightened 2nd</b> effects last for 2 rd; <b>4th</b> effects last for 1 min)"',
  'Tangling Creepers':
    'Level=6 ' +
    'Traits=Conjuration,Plant ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R500\' 40\' burst inflicts -10\' Speed, and a successful unarmed attack immobilizes 1 target for 1 rd (a successful Escape negates), each rd for 10 min"',
  'Telekinetic Haul':
    'Level=5 ' +
    'Traits=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Moves an 80 Bulk, 20\' cubic object 20\' each rd while sustained for up to 1 min"',
  'Telekinetic Maneuver':
    'Level=2 ' +
    'Traits=Attack,Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="R60\' Spell attack attempts to Disarm, Shove, or Trip"',
  'Telekinetic Projectile':
    'Level=1 ' +
    'Traits=Attack,Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Spell attack hurls a loose object that inflicts 1d6+%{spellModifier.%tradition} HP of the appropriate damage type, or double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Telepathic Bond':
    'Level=5 ' +
    'Traits=Uncommon,Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Self and 4 willing touched can communicate telepathically for 8 hr"',
  'Telepathic Demand':
    'Level=9 ' +
    'Traits=Enchantment,Incapacitation,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Self exchanges a pair of 25-word messages with an existing telepathic target, sending a <i>Suggestion</i> as part of the message (<b>save Will</b> gives immunity for 1 day; critical success gives immunity for 1 month)"',
  'Telepathy':
    'Level=4 ' +
    'Traits=Divination,Linguistic,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to communicate telepathically with any creature in a 30\' radius for 10 min (<b>heightened 6th</b> allows communication with creatures without a shared language)"',
  'Teleport':
    'Level=6 ' +
    'Traits=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transports self and 4 willing touched creatures or objects up to 100 miles to a point near a specified known location (<b>heightened 7th</b> transports 1000 miles; <b>8th</b> transports anywhere on the same planet; <b>9th</b> transports to any planet in the same system; <b>10th</b> transports to any planet in the same galaxy)"',
  'Time Stop':
    'Level=10 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Allows self to perform 3 rd of actions that don\'t affect others until the spell ends"',
  'Tongues':
    'Level=5 ' +
    'Traits=Uncommon,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Target understands and speaks all languages for 1 hr (<b>heightened 7th</b> effects last for 8 hr)"',
  'Touch Of Idiocy':
    'Level=2 ' +
    'Traits=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts stupefied 2 for 1 min (<b>save Will</b> negates; critical failure inflicts stupefied 4)"',
  'Tree Shape':
    'Level=2 ' +
    'Traits=Plant,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Self becomes a Large tree with Armor Class 20 for 8 hr"',
  'Tree Stride':
    'Level=5 ' +
    'Traits=Uncommon,Conjuration,Plant,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Transports self from an adjacent tree to another of the same species within 5 miles (<b>heightened 6th</b> transports 50 miles; <b>8th</b> transports 500 miles; <b>9th</b> transports anywhere on the planet)"',
  'True Seeing':
    'Level=6 ' +
    'Traits=Divination,Revelation ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Makes counteract checks to allow self to see through illusions and transmutations for 10 min"',
  'True Strike':
    'Level=1 ' +
    'Traits=Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self uses the better of 2 attack rolls, ignores concealed and hidden conditions, and ignores circumstance penalties on the next Strike in the same turn"',
  'True Target':
    'Level=7 ' +
    'Traits=Divination,Fortune,Prediction ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Allies\' attacks within 1 rd on a designated creature use the better of 2 attack rolls and ignore circumstance penalties and concealed and hidden conditions"',
  'Uncontrollable Dance':
    'Level=8 ' +
    'Traits=Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers flat-footed and no reactions for 1 min and spends 2 actions each turn dancing (<b>save Will</b> effects last for 3 rd and the target spends 1 action each turn dancing; critical success negates; critical failure effects last for 1 min and the target spends all actions each turn dancing)"',
  'Undetectable Alignment':
    'Level=2 ' +
    'Traits=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touched appears neutral to alignment detection until next daily prep"',
  'Unfathomable Song':
    'Level=9 ' +
    'Traits=Auditory,Emotion,Enchantment,Fear,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Randomly inflicts frightened 2, confused for 1 rd, stupefied 4 for 1 rd, or blinded for 1 rd on 5 targets while sustained for up to 1 min (<b>save Will</b> negates for 1 rd; critical success negates; critical failure replaces frightened 2 with stunned for 1 rd and stupefied 1)"',
  'Unfettered Pack':
    'Level=7 ' +
    'Traits=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10 targets ignore environmental difficult terrain and circumstance Speed penalties for 1 hr (<b>heightened 9th</b> targets ignore environmental greater difficult terrain)"',
  'Unrelenting Observation':
    'Level=8 ' +
    'Traits=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R100\' 5 targets in a 20\' burst can see a 6th target for 1 hr; lead and running water block the vision (<b>save Will</b> effects last for 1 min; critical success negates)"',
  'Unseen Servant':
    'Level=1 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R60\' Invisible servant with 4 Hit Points and a 30\' fly Speed obeys commands to move and manipulate objects while sustained or until reduced to 0 HP"',
  'Vampiric Exsanguination':
    'Level=6 ' +
    'Traits=Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone inflicts 12d6 HP negative, giving self temporary HP for 1 min equal to half that suffered by the most-affected target (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Vampiric Touch':
    'Level=3 ' +
    'Traits=Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 6d6 HP negative, giving self temporary HP for 1 min equal to half the inflicted damage (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Veil':
    'Level=4 ' +
    'Traits=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Makes 10 creatures appear as different, similar creatures for 1 hr (<b>heightened 5th</b> also disguises voices and scents; <b>7th</b> targets can appear to be familiar individuals)"',
  'Ventriloquism':
    'Level=1 ' +
    'Traits=Auditory,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to project their voice up to 60\' for 10 min (<b>heightened 2nd</b> effects last for 1 hr, allow changing voice quality, and require an active Perception to attempt to disbelieve)"',
  'Vibrant Pattern':
    'Level=6 ' +
    'Traits=Illusion,Incapacitation,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst dazzles and blinds creatures while sustained for up to 1 min; a successful save each rd after leaving the area removes the blindness (<b>save Will</b> inflicts dazzled only; critical failure blinds for 1 min with no further saves)"',
  'Visions Of Danger':
    'Level=7 ' +
    'Traits=Auditory,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R500\' 30\' burst inflicts 8d8 HP mental for 1 min (<b>save basic Will</b>; critical success allows an attempt to disbelieve that negates the effects) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Vital Beacon':
    'Level=4 ' +
    'Traits=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touch heals once each rd: 4d10 HP, 4d8 HP, 4d6 HP, then 4d4 HP, until expended or next daily prep (<b>heightened +1</b> each touch restores +1 die)"',
  'Volcanic Eruption':
    'Level=7 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 5\'x80\' cylinder inflicts 14d6 HP fire, a 20\' descent and difficult terrain on flying creatures, and -10\' Speed and clumsy 1 until a successful escape (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP), and 3d6 HP fire to creatures within 5\' (<b>heightened +1</b> inflicts +2d6 HP and +1d6 HP within 5\')"',
  'Wail Of The Banshee':
    'Level=9 ' +
    'Traits=Auditory,Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"40\' emanation inflicts 8d10 HP negative and drained 1d4 (<b>save Fortitude</b> inflicts HP only; critical success negates; critical failure inflicts double HP and drained 4)"',
  'Wall Of Fire':
    'Level=4 ' +
    'Traits=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 5\'x60\'x10\' line or 10\' radius ring inflicts 4d6 HP fire for 1 min (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Wall Of Force':
    'Level=6 ' +
    'Traits=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Creates an invisible 50\'x20\' wall with Armor Class 10, Harness 30, and 60 HP that blocks physical effects and corporeal, incorporeal, and ethereal creatures for 1 min (<b>heightened +2</b> gives +20 HP)"',
  'Wall Of Ice':
    'Level=5 ' +
    'Traits=Cold,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a 60\'x10\'x1\' wall or a 10\' radius hemisphere of opaque ice with Armor Class 10, Hardness 10, weakness to fire 15, and 40 HP per 10\' section for 1 min; rubble from destruction inflicts 2d6 HP cold and difficult terrain (<b>heightened +2</b> each section gains +10 HP, and rubble inflicts +1d6 HP)"',
  'Wall Of Stone':
    'Level=5 ' +
    'Traits=Conjuration,Earth ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a permanent 120\'x20\'x1\\" stone wall with Armor Class 10, Hardness 14, and 50 HP per 10\' section; rubble from destruction inflicts difficult terrain (<b>heightened +2</b> each section gains +15 HP)"',
  'Wall Of Thorns':
    'Level=3 ' +
    'Traits=Conjuration,Plant ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R60\' Creates a 60\'x10\'x5\' bramble wall with Armor Class 10, Hardness 10, and 20 HP per 10\' section that inflicts difficult terrain and 3d4 HP piercing for 1 min (<b>heightened +1</b> inflicts +1d4 HP, and each section gains +5 HP)"',
  'Wall Of Wind':
    'Level=3 ' +
    'Traits=Air,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a 60\'x30\'x5\' wind wall that blocks small ammunition, inflicts -2 attack on larger ammunition, inflicts difficult terrain, and blocks flying creatures for 1 min (<b>save Fortitude</b> (flying creature) allows passage as difficult terrain; critical success negates; critical failure inflicts a 10\' push)"',
  "Wanderer's Guide":
    'Level=3 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Reveals a route to a specified destination and reduces the movement penalty from difficult terrain while following it by half until next daily prep"',
  'Warp Mind':
    'Level=7 ' +
    'Traits=Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts confused for 1 min (<b>save Will</b> inflicts confused for 1 action; critical success negates; critical failure inflicts permanent confusion)"',
  'Water Breathing':
    'Level=2 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' 5 targets can breathe water for 1 hr (<b>heightened 3rd</b> effects last for 8 hr; <b>4th</b> effects last until next daily prep)"',
  'Water Walk':
    'Level=2 ' +
    'Traits=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched can walk on liquids for 10 min (<b>heightened 4th</b> R30\' affects 10 creatures, and effects last for 1 hr)"',
  'Weapon Of Judgment':
    'Level=9 ' +
    'Traits=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R100\' +%{spellAttackModifier.%tradition} attacks by a force weapon inflict 3d10+%{spellModifier.%tradition} HP force or weapon damage type for 1 min (<b>heightened 10th</b> inflicts +1d10 HP)"',
  'Weapon Storm':
    'Level=4 ' +
    'Traits=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Weapon swing inflicts 4 dice of damage to every creature in a 30\' cone or a 10\' emanation (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP and critical specialization effect) (<b>heightened +1</b> inflicts +1 damage die)"',
  'Web':
    'Level=2 ' +
    'Traits=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' 10\' burst inflicts difficult terrain and -10\' Speed for 1 rd (<b>save Reflex or Athletics</b> negates for 1 action; critical success negates for 1 rd; critical failure inflicts immobilized for 1 rd or until a successful Escape; successful Athletics also clears squares upon leaving)"',
  'Weird':
    'Level=9 ' +
    'Traits=Death,Emotion,Fear,Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts 16d6 HP mental and frightened 2 on all targets within range (<b>save Will</b> inflicts half HP and frightened 1; critical success negates; critical failure inflicts death on a failed subsequent Fortitude save or double HP, frightened 2 and fleeing on success; critical success negates fleeing)"',
  'Wind Walk':
    'Level=8 ' +
    'Traits=Air,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Self and 5 touched become clouds that can move 20 MPH for 8 hr; attacking or spellcasting ends the spell"',
  'Wish':
    'Level=10 ' +
    'Traits=Divination ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"Reverses effects that require <i>Wish</i> or produces effects similar to a known arcane spell of up to 9th level or a common spell of up to 7th level"',
  'Zealous Conviction':
    'Level=6 ' +
    'Traits=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10 willing targets gain 12 temporary HP, gain +2 Will vs. mental effects, and must comply with self requests for 10 min (<b>save Will</b> after fulfilling a repugnant request ends the spell) (<b>heightened 9th</b> gives 18 temporary HP and +3 Will)"',
  'Zone Of Truth':
    'Level=3 ' +
    'Traits=Uncommon,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 20\' burst prevents lies and inflicts -2 Deception for 10 min (<b>save Will</b> inflicts -2 Deception only; critical success negates; critical failure inflicts -4 Deception)"',
  'Allegro':
    'Level=7 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target may take an additional Strike, Stride, or Step for 1 rd"',
  'Counter Performance':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Bard,Composition,Enchantment,Fortune,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allies in a 60\' emanation may substitute a self Performance roll for a save vs. the triggering auditory or visual effect"',
  'Dirge Of Doom':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Fear,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="30\' emanation inflicts frightened 1 on foes for 1 rd"',
  'Fatal Aria':
    'Level=10 ' +
    'Traits=Focus,Uncommon,Bard,Composition,Death,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Kills a target up to level 16 or 50 HP, inflicts 0 HP and dying 1 on a level 17 target, or inflicts 50 HP on a level 18+ target"',
  'House Of Imaginary Walls':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Creates an adjacent invisible, illusionary, 10\'x10\' wall with Armor Class 10, double the spell level Hardness, and quadruple the spell level HP, for 1 rd"',
  'Inspire Competence':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Allows self to use Performance to Aid an ally skill check, with normal failure counting as a %{rank.Performance>=4?\'critical \':\'\'}success, for 1 rd"',
  'Inspire Courage':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives allies +1 attack, damage, and saves vs. fear for 1 rd"',
  'Inspire Defense':
    'Level=2 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives allies +1 Armor Class and saves, plus resistance of half the spell level to physical damage, for 1 rd"',
  'Inspire Heroics':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Bard,Enchantment,Metamagic ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"A successful Performance check increases the effects of a subsequent <i>Inspire Courage</i> or <i>Inspire Defense</i> to +2, or +3 on a critical success; failure does not expend a Focus Point"',
  'Lingering Composition':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Bard,Enchantment,Metamagic ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"A successful Performance check increases the duration of a subsequent cantrip composition to 3 rd, or 4 rd on a critical success; failure does not expend a Focus Point"',
  "Loremaster's Etude":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Bard,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"R30\' Target may take the better of 2 rolls on the triggering Recall Knowledge check"',
  'Soothing Ballad':
    'Level=7 ' +
    'Traits=Focus,Uncommon,Bard,Composition,Emotion,Enchantment,Healing,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self and 9 allies gain a counteract attempt on all fear effects, a counteract attempt on all paralysis effects, or 7d8 HP restored (<b>heightened +1</b> restores +1d8 HP)"',
  'Triple Time':
    'Level=2 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="60\' emanation gives allies +10\' Speed for 1 rd"',
  "Champion's Sacrifice":
    'Level=6 ' +
    'Traits=Focus,Uncommon,Abjuration,Champion ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Redirects the damage of the triggering Strike or failed save from an ally to self"',
  "Hero's Defiance":
    'Level=10 ' +
    'Traits=Focus,Uncommon,Champion,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Free ' +
    'Description=' +
      '"Self recovers 10d4+20 HP before suffering damage that would reduce HP to 0 once per Refocus"',
  'Lay On Hands':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Champion,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched regains 6 HP and gains +2 Armor Class for 1 rd; touched undead instead suffers 1d6 HP and -2 Armor Class for 1 rd (<b>save basic Fortitude</b> also negates -2 Armor Class) (<b>heightened +1</b> restores +6 HP or inflicts +1d6 HP)"',
  'Litany Against Sloth':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers reaction prevention and slowed 1 for 1 rd (<b>save Will</b> reaction prevention only; critical success negates; critical failure inflicts slowed 2; slothful creatures worsen save by 1 degree)"',
  'Litany Against Wrath':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers 3d6 HP good whenever it damages a good creature for 1 rd (<b>save Will</b> inflicts damage once; critical success negates; critical failure also inflicts enfeebled 2; wrathful creatures worsen save by 1 degree)"',
  'Litany Of Righteousness':
    'Level=7 ' +
    'Traits=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers weakness 7 to good for 1 rd (<b>heightened +1</b> inflicts weakness +1)"',
  'Agile Feet':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +5\' Speed and can move normally in difficult terrain for the remainder of the turn"',
  'Appearance Of Wealth':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Illusion ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst fascinates creatures attracted to wealth in a 20\' radius while sustained for up to 1 min (<b>save Will</b> effects last for 1 action; critical success negates)"',
  'Artistic Flourish':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R15\' Target weapon or skill tool becomes impressive and gains +%{rank.Crafting>1?1:0} attack or checks for 10 min (<b>heightened 7th</b> gives +%{(rank.Crafting||0)-1<?2>?0} bonus; <b>10th</b> gives +%{(rank.Crafting||0)-1<?3>?0} bonus)"',
  'Athletic Rush':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +10\' Speed and +2 Athletics for 1 rd and may immediately Stride, Leap, Climb, or Swim"',
  'Bit Of Luck':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target may use the better of 2 rolls on a save within 1 min once per target per day"',
  'Blind Ambition':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Target suffers -2 to resist attempts to Coerce it to advance its ambitions for 10 min (<b>save Will</b> inflicts -1 resistance; critical success negates; critical failure causes single-minded focus on its ambitions)"',
  'Captivating Adoration':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental,Visual ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Fascinates targets in a 15\' emanation for 1 min (<b>save Will</b> effects last for 1 action; critical success negates; critical failure also improves attitude by 1 step) (<b>heightened +1</b> increases the radius by 15\')"',
  'Charming Touch':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched becomes friendly, or helpful if already friendly, and cannot use hostile actions for 10 min (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure makes the target helpful)"',
  'Cloak Of Shadow':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Darkness,Evocation,Shadow ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"20\' emanation around willing touched reduces bright light to dim and conceals touched for 1 min; target may shed the cloak, and the spell ends if another picks it up"',
  'Commanding Lash':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R100\' Target harmed by self\'s most recent action obeys a command to approach, run away, drop a held object, drop prone, or stand in place for 1 rd (<b>save Will</b> negates; critical failure target uses all actions on its next turn to obey)"',
  'Competitive Edge':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +1 attack and skill checks, increasing to +3 immediately after a foe within 20\' critically succeeds on the same, while sustained for up to 1 min (<b>heightened 7th</b> increases bonuses to +2 and +4)"',
  'Cry Of Destruction':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Evocation,Sonic ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 1d8 HP sonic, or 1d12 HP sonic if self has already damaged a foe this turn (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d8 HP or +1d12 HP)"',
  'Darkened Eyes':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Darkness,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Suppresses the target\'s darkvision or low-light vision for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure also blinds until a successful save at the end of a turn)"',
  'Dazzling Flash':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Evocation,Light,Visual ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts blinded for 1 rd (Interact action ends the effect) and dazzled for 1 min (<b>save Fortitude</b> inflicts dazzled only for 1 rd; critical success negates; critical failure extends dazzled to 1 hr) (<b>heightened 3rd</b> extends effects to a 30\' cone)"',
  "Death's Call":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R20\' Gives self temporary HP for 1 min equal to %{spellModifier.%tradition} + the level of a living creature that dies, or double that for an undead creature that is destroyed"',
  'Delusional Pride':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts -1 attacks and skill checks on a target that fails an attack or skill check by the end of its turn, or -2 if it fails twice, for 10 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure effects last for 24 hr)"',
  'Destructive Aura':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Aura,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' emanation inflicts -2 resistances (<b>heightened +2</b> inflicts an additional -2 resistances)"',
  'Disperse Into Air':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Air,Cleric,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"After taking the triggering damage, self becomes air with no actions and immunity to attacks until the end of the turn, then reforms anywhere within 15\'"',
  'Downpour':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 30\' burst extinguishes non-magical flames, gives concealment and fire resistance 10, and damages creatures with a water weakness for 1 min (<b>heightened +1</b> gives +2 fire resistance)"',
  "Dreamer's Call":
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target obeys a suggestion and suffers flat-footed and fascinated until the end of its next turn (<b>save Will</b> inflicts flat-footed and fascinated only; critical success negates; critical failure prevents the target from taking other actions)"',
  'Enduring Might':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Gives self resistance %{8+strengthModifier} to the triggering damage (<b>heightened +1</b> gives +2 resistance)"',
  'Eradicate Undeath':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone inflicts 4d12 HP positive to undead (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Face In The Crowd':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +2 Deception and Stealth to blend into a crowd and ignores difficult terrain from crowds for 1 min (<b>heightened 3rd</b> R10\' affects 10 creatures)"',
  'Fire Ray':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Attack,Cleric,Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 2d6 HP fire; critical success inflicts double HP and 1d4 HP persistent fire (<b>heightened +1</b> inflicts +2d6 HP initial and +1d4 HP persistent)"',
  'Flame Barrier':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Target gains fire resistance 15 against the triggering fire damage (<b>heightened +2</b> gives +5 resistance)"',
  'Forced Quiet':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target can speak only at a whisper, requiring others over 10\' away to succeed on a DC %{spellDifficultyClass.%tradition} Perception to hear, for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure effects last for 10 min)"',
  'Glimpse The Truth':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Revelation ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Successful counteract attempts in a 30\' emanation allow self to see through illusions for 1 rd (<b>heightened 7th</b> allows others to see through illusions)"',
  "Healer's Blessing":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Healing spells affecting the target restore +2 HP for 1 min (<b>heightened +1</b> restores +2 HP)"',
  'Hurtling Stone':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Attack,Cleric,Earth,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 1d6+%{strengthModifier} HP bludgeoning, or double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Know The Enemy':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows a Recall Knowledge check, using the better of 2 rolls, during initiative or immediately after inflicting damage to remember a target\'s abilities"',
  'Localized Quake':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Choice of a 15\' emanation or 15\' cone inflicts 4d6 HP bludgeoning and knocked prone (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Lucky Break':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to reroll a triggering failed save once per 10 min"',
  "Magic's Vessel":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched gains +1 saves; subsequent casting sustains the spell up to 1 min and gives the target resistance to spell damage equal to the cast spell\'s level"',
  'Malignant Sustenance':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched undead gains fast healing 7 for 1 min (<b>heightened +1</b> gives fast healing +2)"',
  'Moonbeam':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Attack,Cleric,Evocation,Fire,Light ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts dazzled for 1 rd and 1d6 HP fire that counts as silver, or dazzled for 1 min and double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Mystic Beacon':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives heightened +1 effects to the next damage or healing spell cast by the target within 1 rd"',
  "Nature's Bounty":
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Conjuration,Plant,Positive ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Creates a fruit or vegetable that counts as a meal and restores 3d10+12 HP if eaten within 1 min (<b>heightened +1</b> restores +6 HP)"',
  'Overstuff':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target suffers sickened 1 and -10\' Speed until no longer sickened (<b>save Fortitude</b> target may use an action to end the sickened condition; critical success negates; critical failure inflicts sickened 2)"',
  'Perfected Form':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric,Fortune ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to reroll the triggering failed save vs. a morph, petrification, or polymorph effect"',
  'Perfected Mind':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self an additional Will save vs. a mental effect once per effect"',
  'Positive Luminance':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Light,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"10\' light emanation inflicts 2 HP positive on successful undead attackers for 1 min; self may increase the radius by 10\' and the damage by 2 HP each rd and may end the spell early to heal a living creature or damage an undead creature by double the current damage HP (<b>heightened +1</b> inflicts +0.5 HP initially and for each increase)"',
  'Precious Metals':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Transforms touched metal item into cold iron, copper, gold, iron, silver, or steel for 1 min (<b>heightened 8th</b> can transform into adamantine or mithral)"',
  "Protector's Sacrifice":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Transfers 3 HP damage of the triggering attack from target to self (<b>heightened +1</b> transfers +3 HP)"',
  "Protector's Sphere":
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Aura,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' emanation gives resistance 3 to all damage to self and allies while sustained for up to 1 min (<b>heightened +1</b> gives +1 resistance)"',
  'Pulse Of The City':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R25 miles; reveals information about the nearest settlement (<b>heightened 5th</b> increases the range to 100 miles)"',
  'Pushing Gust':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Air,Cleric,Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Pushes target away 10\' (<b>save Fortitude</b> pushes 5\'; critical success negates; critical failure pushes 10\' and knocks prone)"',
  'Read Fate':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Prediction ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R10\' Successful DC 6 flat check gives a one-word clue to the target\'s short-term fate"',
  'Rebuke Death':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"1 target in a 20\' emanation (2 or 3 actions affect 2 or 3 targets) regains 3d6 HP and recovers from the dying condition without increasing its wounded condition (<b>heightened +1</b> restores +1d6 HP)"',
  'Retributive Pain':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric,Mental,Nonlethal ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Inflicts half the triggering damage to self on the attacker as mental HP"',
  'Safeguard Secret':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric,Mental ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R10\' Self and allies gain +4 skill checks to conceal a specified piece of knowledge for 1 hr"',
  'Savor The Sting':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment,Mental,Nonlethal ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts 1d4 HP mental and 1d4 HP persistent mental and gives self +1 attack and skill checks vs. the target while persistent damage continues (<b>save Will</b> inflicts half initial HP only; critical success negates; critical failure inflicts double initial and persistent HP) (<b>heightened +1</b> inflicts +1d4 HP initial and persistent)"',
  'Scholarly Recollection':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to use the better of 2 rolls on the triggering Seek or Recall Knowledge check"',
  'Shared Nightmare':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts confused for 1 action each rd for 1 min (<b>save Will</b> inflicts confused on self for 1 action next turn; critical success inflicts confused on self for 1 rd; critical failure inflicts confused for 1 min)"',
  'Soothing Words':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives the target +1 Will and +2 vs. emotion effects for 1 rd and attempts to counteract an existing emotion effect (<b>heightened 5th</b> gives +2 Will and +3 vs. emotion effects)"',
  'Splash Of Art':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      // Errata corrects sluggish to clumsy
      '"R30\' 5\' burst randomly inflicts one of dazzled for 1 rd, enfeebled 1 for 1 rd, frightened 1, or clumsy 1 for 1 rd (<b>save Will</b> negates; critical failure inflicts dazzled for 1 min, enfeebled 2 for 1 rd, frightened 2, or clumsy 2 for 1 rd)"',
  'Sudden Shift':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric,Illusion ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Self Steps and becomes concealed until the end of the next turn after the triggering foe melee attack miss"',
  'Sweet Dream':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Auditory,Cleric,Enchantment,Linguistic,Mental,Sleep ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Willing target who sleeps for 1 min gains +1 intelligence-based skill checks, +1 charisma-based skill checks, or +5\' Speed for 9 min"',
  'Take Its Course':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains an immediate save with a +2 or -2 modifier vs. an affliction, or an immediate DC 5 or 20 flat check against persistent poison damage (<b>save Will</b> negates) (<b>heightened 7th</b> affects multiple afflictions and poisons affecting the target)"',
  'Tempt Fate':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Gives the target +1 on the triggering save and turns a normal success into a critical success or a normal failure into a critical failure (<b>heightened 8th</b> gives +2 on the save)"',
  'Tidal Surge':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Moves the target 5\' over ground or 10\' in water (<b>save Fortitude</b> negates; critical failure doubles distance)"',
  'Touch Of Obedience':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts stupefied 1 until the end of the next turn (<b>save Will</b> inflicts stupefied 1 until the end of the current turn; critical success negates; critical failure inflicts stupefied 1 for 1 min)"',
  'Touch Of The Moon':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment,Light ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Target emits dim light in a 20\' radius and cycles through benefits each rd for 1 min: no benefit; +1 attack and +4 damage; +1 attack, +4 damage, +1 Armor Class, and +1 saves; +1 Armor Class and +1 saves"',
  'Touch Of Undeath':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts 1d6 HP negative and half healing for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical success inflicts double HP and half healing for 1 min) (<b>heightened +1</b> inflicts +1d6 HP)"',
  "Traveler's Transit":
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{speed}\' climb Speed or a %{speed}\' swim Speed for 1 min (<b>heightened 5th</b> allows choosing a %{speed}\' fly Speed)"',
  "Trickster's Twin":
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target believes that self is in a location up to 100\' distant for 1 min or until succeeding at a Will save in response to interacting with the illusion or to the illusion performing a nonsensical or hostile action (<b>save Will</b> no subsequent Will save is necessary; critical success negates; critical failure requires critical success on a Will save to end the spell)"',
  'Unimpeded Stride':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Frees self from magical holds of a level less than or equal to the spell level and allows a Stride that ignores difficult terrain and Speed penalties"',
  'Unity':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Cleric,Fortune ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Allows allies to use self\'s saving throw vs. the triggering spell or ability"',
  'Veil Of Confidence':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Reduces any frightened condition on self by 1 for 1 min; critical failure on a subsequent save ends the spell and increases the frightened condition by 1"',
  'Vibrant Thorns':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Morph,Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Unarmed and adjacent melee attacks on self inflict 1 HP piercing on the attacker for 1 min; casting a positive spell increases the damage to 1d6 HP for 1 turn (<b>heightened +1</b> inflicts +1 HP, or +1d6 HP after casting a positive spell)"',
  'Waking Nightmare':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Fear,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts frightened 2 (<b>save Will</b> inflicts frightened 1; critical success negates; critical failure inflicts frightened 3; failure while sleeping also inflicts fleeing for 1 rd)"',
  'Weapon Surge':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Held weapon gains +1 attack and an additional die of damage on the next attack before the start of the next turn"',
  'Word Of Freedom':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Suppresses a confused, frightened, grabbed, paralyzed, or restrained condition affecting the target for 1 rd"',
  'Word Of Truth':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Cleric,Divination ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Causes a glowing symbol of %{deity} to appear when self speaks true statements of up to 25 words while sustained for up to 1 min"',
  'Zeal For Battle':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Cleric,Emotion,Enchantment,Fortune,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R10\' Allows self and an ally to each use the higher of their initiative rolls"',
  'Goodberry':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Druid,Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Eating the touched piece of produce within 10 min restores 1d6+4 HP; 6 pieces also count as a full meal (<b>heightened +1</b> affects +1 piece)"',
  'Heal Animal':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Druid,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched animal (2 actions gives R30\') regains 1d8 HP, or 1d8+8 HP with 2 actions (<b>heightened +1</b> restores +1d8 HP or +1d8+8 HP)"',
  'Impaling Briars':
    'Level=8 ' +
    'Traits=Focus,Uncommon,Conjuration,Druid,Plant ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation inflicts difficult terrain, -10 Speed (<b>save Reflex</b> negates; critical failure inflicts immobilized for 1 rd), or greater difficult terrain, plus 10d6 HP piercing and -10\' Speed on a target with a successful spell attack (or immobilized with a critical success), each rd while sustained for up to 1 min"',
  'Primal Summons':
    'Level=6 ' +
    'Traits=Focus,Uncommon,Conjuration,Druid ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=Free ' +
    'Description=' +
      '"Subsequent <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> gives summoned creature one of: a 60\' fly Speed; a 20\' burrow Speed, -10\' Speed, and resistance 5 to physical damage; +1d6 HP fire damage, resistance 10 to fire, and weakness 5 to cold and water; a 60\' swim Speed, a Shove after a melee attack, and resistance 5 to fire"',
  'Storm Lord':
    'Level=9 ' +
    'Traits=Focus,Uncommon,Air,Druid,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation produces a bolt of lighting that inflicts 10d6 HP electricity and deafened for 1 rd (<b>save basic Reflex</b>) each rd while sustained for up to 1 min, plus a choice of weather: calm; foggy (conceals); rainy (inflicts -2 Acrobatics and Perception); or windy (inflicts -4 ranged attacks and difficult terrain for flying)"',
  'Stormwind Flight':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Air,Druid,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains %{speed}\' fly Speed for 1 min (<b>heightened 6th</b> negates difficult terrain effects when flying against the wind)"',
  'Tempest Surge':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Air,Druid,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d12 HP electricity, clumsy 2 for 1 rd, and 1 HP persistent electricity (<b>save basic Reflex</b> inflicts initial HP only) (<b>heightened +1</b> inflicts +1d12 HP initial and +1 HP persistent)"',
  'Wild Morph':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Druid,Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains claws that inflict 1d6 HP slashing (requires <i>Wild Shape</i>), jaws that inflict 1d8 HP piercing (requires <i>Insect Shape</i>), resistance 5 to critical hits and precision damage (requires <i>Elemental Shape</i>), 10\' reach (requires <i>Plant Shape</i>), or a 30\' fly Speed (requires <i>Soaring Shape</i>) for 1 min (<b>heightened 6th</b> may choose 2 effects, claws also inflict 2d6 HP persistent bleed damage, and jaws also inflict 2d6 HP persistent poison damage; <b>10th</b> may choose 3 effects, claws also inflict 4d6 persistent bleed damage and jaws also inflict 4d6 HP persistent poison damage)"',
  'Wild Shape':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Druid,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Transforms self into a <i>Pest Form</i> creature for 10 min or another creature for 1 min, gaining +2 attacks (<b>heightened 2nd</b> may transform into an <i>Animal Form</i> creature)"',
  'Abundant Step':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Conjuration,Monk,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="Teleports self %{speed>?15}\' within line of sight"',
  'Empty Body':
    'Level=9 ' +
    'Traits=Focus,Uncommon,Conjuration,Monk,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="Moves self to the Ethereal Plane for 1 min"',
  'Ki Blast':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Evocation,Force,Monk ' +
    'School=Evocation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP force and a 5\' push (2 or 3 actions inflicts 3d6 HP in a 30\' cone or 4d6 HP in a 60\' cone) (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and a 10\' push) (<b>heightened +1</b> inflicts +1d6 HP for 1 action or +2d6 HP for 2 or 3)"',
  'Ki Rush':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Monk,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self to move twice and become concealed until the next turn"',
  'Ki Strike':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Monk,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"An unarmed Strike or Flurry Of Blows gains +1 attack and +1d6 HP force, lawful, negative, or positive (<b>heightened +4</b> inflicts +1d6 HP)"',
  'Quivering Palm':
    'Level=8 ' +
    'Traits=Focus,Uncommon,Incapacitation,Monk,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"A successful Strike allows self to inflict stunned 3 and 80 HP on the target at any time within 1 month (<b>save Fortitude</b> inflicts stunned 1 and 40 HP and ends the spell; critical success ends the spell; critical failure kills the target) (<b>heightened +1</b> inflicts +10 HP, or +5 HP on a successful save)"',
  'Wholeness Of Body':
    'Level=2 ' +
    'Traits=Focus,Uncommon,Healing,Monk,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self regains 8 HP or attempts to counteract 1 poison or disease (<b>heightened +1</b> restores +8 HP)"',
  'Wild Winds Stance':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Air,Evocation,Monk,Stance ' +
    'School=Evocation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Stance gives +2 Armor Class vs. ranged attacks and R30\' unarmed strikes that ignore concealment and cover and inflict 1d6 HP bludgeoning"',
  'Wind Jump':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Air,Monk,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains a %{speed}\' fly Speed, ending each turn on the ground, for 1 min (<b>heightened 6th</b> allows attempting a DC 30 Acrobatics check to avoid falling at the end of a turn)"',
  'Aberrant Whispers':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Auditory,Enchantment,Mental,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation (2 or 3 actions give a 10\' or 15\' emanation) inflicts stupefied 2 (<b>save Will</b> negates; critical failure inflicts confused) (<b>heightened +3</b> increases the radius by 5\')"',
  'Abyssal Wrath':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 4d6 HP each of a random pair of damage types: bludgeoning and electricity; acid and slashing; bludgeoning and cold; fire and piercing (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d6 HP each)"',
  'Ancestral Memories':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Divination,Sorcerer ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes trained in a non-Lore or ancestral Lore skill for 1 min (<b>heightened 6th</b> becomes expert in the skill)"',
  'Angelic Halo':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Abjuration,Aura,Good,Sorcerer ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"15\' emanation increases the HP restored by <i>Heal</i> by double the <i>Heal</i> spell\'s level for 1 min"',
  'Angelic Wings':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Evocation,Light,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{speed}\' fly Speed and shines a 30\' radius bright light for 3 rd (<b>heightened 5th</b> effects last for 1 min)"',
  'Arcane Countermeasure':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Abjuration,Sorcerer ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Reduces the triggering spell\'s heightened level by 1 and gives the spell\'s targets +2 saves, skill checks, Armor Class, and DC against it"',
  'Celestial Brand':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Curse,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Self and allies gain +1 attacks and skill checks vs. the evil target, and attacks by good creatures inflict +1d4 HP good, for 1 rd (<b>heightened +2</b> good creature attacks inflict +1 HP)"',
  'Diabolic Edict':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Enchantment,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Willing target performs a stated task, gaining +1 attack and skill checks, for 1 rd; refusal inflicts -1 attack and skill checks for 1 rd"',
  'Dragon Breath':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"%{draconicColor<\'Green\'?\\"60\' line\\":\\"30\' cone\\"} inflicts 5d6 HP %{bloodlineDamage||\'fire\'} (<b>save basic %{draconicColor==\'Green\'?\'Fortitude\':\'Reflex\'}</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Dragon Claws':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Claws inflict 1d6 HP slashing and 1d6 HP %{bloodlineDamage||\'fire\'}, and self gains resistance 5 to %{bloodlineDamage||\'fire\'}, for 1 min (<b>heightened 5th</b> claws inflict 2d6 HP, and self gains resistance 10; <b>9th</b> claws inflict 3d6 HP, and self gains resistance 15)"',
  'Dragon Wings':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{Speed>?60}\' fly Speed for 1 min (<b>heightened 8th</b> effects last for 10 min)"',
  'Drain Life':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Necromancy,Negative,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target suffers 3d4 HP negative, and self gains equal temporary HP for 1 min (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Elemental Blast':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Choice of 30\' cone, 60\' line, or R30\' 10\' burst inflicts 8d6 HP %{bloodlineDamage} (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Elemental Motion':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{$\'features.Elemental (Earth)\'?\\"10\' burrow Speed\\":$\'features.Elemental (Water)\'?(speed+\\"\' swim Speed and water breathing\\"):(speed+\\"\' fly Speed\\")} for 1 min (<b>heightened 6th</b> gives +10\' Speed; <b>9th</b> gives +20\' Speed)"',
  'Elemental Toss':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Attack,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d8 HP %{bloodlineDamage}, or double HP on a critical success (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Embrace The Pit':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Evil,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains resistance 5 to evil, fire, and poison, resistance 1 to non-silver physical damage, and weakness 5 to good, for 1 min (<b>heightened +2</b> gives +5 resistance to evil, fire, and poison, +2 resistance to non-silver physical damage, and +5 weakness to good)"',
  'Extend Spell':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Divination,Metamagic,Sorcerer ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Increases the duration of a subsequent targeted spell of less than maximum spell level from 1 min to 10 min"',
  'Faerie Dust':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Enchantment,Mental,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) inflicts loss of reactions and -2 Perception and Will for 1 rd (<b>save Will</b> negates; critical failure also inflicts -1 Perception and Will for 1 min) (<b>heightened +3</b> increases the radius by 5\')"',
  'Fey Disappearance':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Enchantment,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes invisible and moves normally over natural difficult terrain until the end of the next turn; performing a hostile action ends the spell (<b>heightened 5th</b> a hostile action does not end the spell)"',
  'Fey Glamour':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Illusion,Sorcerer ' +
    'School=Illusion ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="R30\' 30\' burst disguises an area or 10 targets for 10 min"',
  "Glutton's Jaws":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Morph,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Bite inflicts 1d8 HP piercing, giving self 1d6 temporary HP, for 1 min (<b>heightened +2</b> gives +1d6 temporary HP</b>)"',
  'Grasping Grave':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 20\' radius inflicts 6d6 HP slashing and -10\' Speed for 1 rd for 10 min (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and immobilized for 1 rd) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Hellfire Plume':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Evil,Evocation,Fire,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 10\' radius inflicts 4d6 HP fire and 4d6 HP evil (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d6 HP fire and evil)"',
  'Horrific Visage':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Emotion,Fear,Illusion,Mental,Sorcerer,Visual ' +
    'School=Illusion ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' radius inflicts frightened 1 (<b>save Will</b> negates; critical failure inflicts frightened 2) (<b>heightened 5th</b> inflicts frightened 1, 2, or 3 and fleeing for 1 rd on save success, failure, or critical failure)"',
  'Jealous Hex':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Curse,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts enfeebled 1, clumsy 1, drained 1, or stupefied 1, based on the target\'s highest ability modifier, until the target saves or for 1 min (<b>save Will</b> negates; critical failure inflicts condition level 2)"',
  'Swamp Of Sloth':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Conjuration,Olfactory,Sorcerer ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) inflicts difficult terrain and 1d6 HP poison for 1 min (<b>save basic Fortitude</b>) (<b>heightened +2</b> increases radius by 5\' and inflicts +1d6 HP)"',
  'Tentacular Limbs':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Extends reach for touch spells and unarmed Strikes to 10\' for 1 min; adding an action to touch spells extends reach to 20\' (<b>heightened +2</b> adding an action gives +10\' touch spell reach)"',
  "Undeath's Blessing":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Necromancy,Negative,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched responds to <i>Heal</i> and <i>Harm</i> as an undead for 1 min, and <i>Harm</i> restores +2 Hit Points (<b>save Will</b> <i>Heal</i> and <i>Harm</i> have half effect for 1 rd; critical success negates) (<b>heightened +1</b> <i>Harm</i> restores +2 Hit Points)"',
  'Unusual Anatomy':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Polymorph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains darkvision and resistance 10 to precision and critical damage and inflicts 2d6 HP acid on successful non-reach melee attackers for 1 min (<b>heightened +2</b> gives +5 resistances and inflicts +1d6 HP)"',
  "You're Mine":
    'Level=5 ' +
    'Traits=Focus,Uncommon,Emotion,Enchantment,Incapacitation,Mental,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts stunned 1 for 1 rd and allows self to direct 1 target action (<b>save Will</b> inflicts stunned only; critical success negates; critical failure gives control for 1 rd) (<b>heightened 7th</b> gives control for 1 rd; critical failure gives control for 1 min or until the target succeeds on a save at the end of each turn)"',
  'Augment Summoning':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Conjuration,Wizard ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="R30\' Summoned target gains +1 on all checks for 1 min"',
  'Call Of The Grave':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Arcane,Attack,Necromancy,Wizard ' +
    'School=Necromancy ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts sickened 1, or sickened 2 and slowed 1 until no longer sickened on a critical success"',
  'Charming Words':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Auditory,Enchantment,Incapacitation,Linguistic,Mental,Wizard ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Prevents the target from taking hostile actions against self for 1 rd (<b>save Will</b> target suffers -1 attack and damage vs. self; critical success negates; critical failure inflicts stunned 1)"',
  'Dimensional Steps':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Conjuration,Teleportation,Wizard ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Teleports self to a visible location within 20\' (<b>heightened +1</b> gives +5\' teleport distance)"',
  "Diviner's Sight":
    'Level=1 ' +
    'Traits=Focus,Uncommon,Concentrate,Divination,Fortune,Wizard ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target may substitute self\'s d20 roll for a saving throw or skill check within 1 rd"',
  'Dread Aura':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Aura,Enchantment,Emotion,Fear,Mental,Wizard ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts frightened 1 on foes while sustained for up to 1 min"',
  'Elemental Tempest':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Evocation,Metamagic,Wizard ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Subsequent casting of an acid, cold, electricity, or fire spell inflicts 1d6 HP per spell level of the same damage type on foes in a 10\' emanation"',
  'Energy Absorption':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Abjuration,Wizard ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Gives self resistance 15 to damage from the triggering acid, cold, electricity, or fire effect (<b>heightened +1</b> gives +5 resistance)"',
  'Force Bolt':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Evocation,Force,Wizard ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+1 HP force (<b>heightened +2</b> inflicts +1d4+1 HP)"',
  'Hand Of The Apprentice':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Attack,Evocation,Wizard ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R500\' Makes a remote attack with a melee weapon%{spellModifier.%tradition>strengthModifier?\', inflicting +\'+(spellModifier.%tradition-strengthModifier)+\' damage\':spellModifier.%tradition<strengthModifier?\', inflicting \'+(spellModifier.%tradition-strengthModifier)+\' damage\':\'\'}; a critical hit inflicts the critical specialization effect"',
  'Invisibility Cloak':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Illusion,Wizard ' +
    'School=Illusion ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes invisible for 1 min; using a hostile action ends the spell (<b>heightened 6th</b> effects last 10 min; <b>8th</b> effects last 1 hr)"',
  'Life Siphon':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Healing,Necromancy,Wizard ' +
    'School=Necromancy ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Casting a necromancy spell restores 1d8 HP per spell level to self"',
  'Physical Boost':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Transmutation,Wizard ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched gains +2 on the next Acrobatics check, Athletics check, Fortitude save, or Reflex save within the next rd"',
  'Protective Ward':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Abjuration,Aura,Wizard ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation gives +1 Armor Class to self and allies while sustained for up to 1 min; each Sustain increases the radius by 5\'"',
  'Shifting Form':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Morph,Transmutation,Wizard ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +20\' Speed, a %{speed//2}\' climb or swim Speed, darkvision, 60\' imprecise scent, or claws that inflict 1d8 HP slashing for 1 min"',
  'Vigilant Eye':
    'Level=4 ' +
    'Traits=Focus,Uncommon,Divination,Wizard ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location for 1 hr; spending a Focus Point extends the duration to 2 hr"',
  'Warped Terrain':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Illusion,Visual,Wizard ' +
    'School=Illusion ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="R60\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) illusion inflicts difficult terrain for 1 min (<b>heightened 4th</b> affects air instead of surface)"'
};
Pathfinder2E.WEAPONS = {

  'Fist':
    'Category=Unarmed Price=0 Damage="1d4 B" Bulk=0 Hands=1 Group=Brawling ' +
    'Traits=Agile,Finesse,Nonlethal,Unarmed',

  'Club':
    'Category=Simple Price=0 Damage="1d6 B" Bulk=1 Hands=1 Group=Club ' +
    'Traits=Thrown Range=10',
  'Dagger':
    'Category=Simple Price=0.2 Damage="1d4 P" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Finesse,Thrown,"Versatile S" Range=10',
  'Gauntlet':
    'Category=Simple Price=0.2 Damage="1d4 B" Bulk=L Hands=1 Group=Brawling ' +
    'Traits=Agile,Free-hand',
  'Light Mace':
    'Category=Simple Price=0.4 Damage="1d4 B" Bulk=L Hands=1 Group=Club ' +
    'Traits=Agile,Finesse,Shove',
  'Longspear':
    'Category=Simple Price=0.5 Damage="1d8 P" Bulk=2 Hands=2 Group=Spear ' +
    'Traits=Reach',
  'Mace':
    'Category=Simple Price=1 Damage="1d6 B" Bulk=1 Hands=1 Group=Club ' +
    'Traits=Shove',
  'Morningstar':
    'Category=Simple Price=1 Damage="1d6 B" Bulk=1 Hands=1 Group=Club ' +
    'Traits="Versatile P"',
  'Sickle':
    'Category=Simple Price=0.2 Damage="1d4 S" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Finesse,Trip',
  'Spear':
    'Category=Simple Price=0.1 Damage="1d6 P" Bulk=1 Hands=1 Group=Spear ' +
    'Traits=Thrown Range=20',
  'Spiked Gauntlet':
    'Category=Simple Price=0.3 Damage="1d4 P" Bulk=L Hands=1 Group=Brawling ' +
    'Traits=Agile,Free-hand',
  'Staff':
    'Category=Simple Price=0 Damage="1d4 B" Bulk=1 Hands=1 Group=Club ' +
    'Traits="Two-hand d8"',

  'Clan Dagger':
    'Category=Simple Price=2 Damage="1d4 P" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Dwarf,Parry,Uncommon,"Versatile B"',
  'Katar':
    'Category=Simple Price=0.3 Damage="1d4 P" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,"Deadly d6",Monk,Uncommon',

  'Bastard Sword':
    'Category=Martial Price=4 Damage="1d8 S" Bulk=1 Hands=1 Group=Sword ' +
    'Traits="Two-hand d12"',
  'Battle Axe':
    'Category=Martial Price=1 Damage="1d8 S" Bulk=1 Hands=1 Group=Axe ' +
    'Traits="Sweep"',
  'Bo Staff':
    'Category=Martial Price=0.2 Damage="1d8 B" Bulk=2 Hands=2 Group=Club ' +
    'Traits=Monk,Parry,Reach,Trip',
  'Falchion':
    'Category=Martial Price=3 Damage="1d10 S" Bulk=2 Hands=2 Group=Sword ' +
    'Traits=Forceful,Sweep',
  'Flail':
    'Category=Martial Price=0.8 Damage="1d6 B" Bulk=1 Hands=1 Group=Flail ' +
    'Traits=Disarm,Sweep,Trip',
  'Glaive':
    'Category=Martial Price=1 Damage="1d8 S" Bulk=2 Hands=2 Group=Polearm ' +
    'Traits="Deadly d8",Forceful,Reach',
  'Greataxe':
    'Category=Martial Price=2 Damage="1d12 S" Bulk=2 Hands=2 Group=Axe ' +
    'Traits=Sweep',
  'Greatclub':
    'Category=Martial Price=1 Damage="1d10 B" Bulk=2 Hands=2 Group=Club ' +
    'Traits=Backswing,Shove',
  'Greatpick':
    'Category=Martial Price=1 Damage="1d10 P" Bulk=2 Hands=2 Group=Pick ' +
    'Traits="Fatal d12"',
  'Greatsword':
    'Category=Martial Price=2 Damage="1d12 S" Bulk=2 Hands=2 Group=Sword ' +
    'Traits="Versatile P"',
  'Guisarme':
    'Category=Martial Price=2 Damage="1d10 S" Bulk=2 Hands=2 Group=Polearm ' +
    'Traits=Reach,Trip',
  'Halberd':
    'Category=Martial Price=2 Damage="1d10 P" Bulk=2 Hands=2 Group=Polearm ' +
    'Traits=Reach,"Versatile S"',
  'Hatchet':
    'Category=Martial Price=0.4 Damage="1d6 S" Bulk=L Hands=1 Group=Axe ' +
    'Traits=Agile,Sweep,Thrown Range=10',
  'Lance':
    'Category=Martial Price=1 Damage="1d8 P" Bulk=2 Hands=2 Group=Spear ' +
    'Traits="Deadly d8","Jousting d6",Reach',
  'Light Hammer':
    'Category=Martial Price=0.3 Damage="1d6 B" Bulk=L Hands=1 Group=Hammer ' +
    'Traits=Agile,Thrown Range=20',
  'Light Pick':
    'Category=Martial Price=0.4 Damage="1d4 P" Bulk=L Hands=1 Group=Pick ' +
    'Traits=Agile,"Fatal d8"',
  'Longsword':
    'Category=Martial Price=1 Damage="1d8 S" Bulk=1 Hands=1 Group=Sword ' +
    'Traits="Versatile P"',
  'Main-gauche':
    'Category=Martial Price=0.5 Damage="1d4 P" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Disarm,Finesse,Parry,"Versatile S"',
  'Maul':
    'Category=Martial Price=3 Damage="1d12 B" Bulk=2 Hands=2 Group=Hammer ' +
    'Traits=Shove',
  'Pick':
    'Category=Martial Price=0.7 Damage="1d6 P" Bulk=1 Hands=1 Group=Pick ' +
    'Traits="Fatal d10"',
  'Ranseur':
    'Category=Martial Price=2 Damage="1d10 P" Bulk=2 Hands=2 Group=Polearm ' +
    'Traits=Disarm,Reach',
  'Rapier':
    'Category=Martial Price=2 Damage="1d6 P" Bulk=1 Hands=1 Group=Sword ' +
    'Traits="Deadly d8",Disarm,Finesse',
  'Sap':
    'Category=Martial Price=0.1 Damage="1d6 B" Bulk=L Hands=1 Group=Club ' +
    'Traits=Agile,Nonlethal',
  'Scimitar':
    'Category=Martial Price=1 Damage="1d6 S" Bulk=1 Hands=1 Group=Sword ' +
    'Traits=Forceful,Sweep',
  'Scythe':
    'Category=Martial Price=2 Damage="1d10 S" Bulk=2 Hands=2 Group=Polearm ' +
    'Traits="Deadly d10",Trip',
  'Shield':
    'Category=Martial Price=0 Damage="1d4 B" Bulk=0 Hands=1 Group=Shield',
  'Shield Boss':
    'Category=Martial Price=0.5 Damage="1d6 B" Bulk=0 Hands=1 Group=Shield',
  'Shield Spikes':
    'Category=Martial Price=0.5 Damage="1d6 P" Bulk=0 Hands=1 Group=Shield',
  'Shortsword':
    'Category=Martial Price=0.9 Damage="1d6 P" Bulk=L Hands=1 Group=Sword ' +
    'Traits=Agile,Finesse,"Versatile S"',
  'Starknife':
    'Category=Martial Price=2 Damage="1d4 P" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,"Deadly d6",Finesse,Thrown,"Versatile S" Range=20',
  'Trident':
    'Category=Martial Price=1 Damage="1d8 P" Bulk=1 Hands=1 Group=Spear ' +
    'Traits=Thrown Range=20',
  'War Flail':
    'Category=Martial Price=2 Damage="1d10 B" Bulk=2 Hands=2 Group=Flail ' +
    'Traits=Disarm,Sweep,Trip',
  'Warhammer':
    'Category=Martial Price=1 Damage="1d8 B" Bulk=1 Hands=1 Group=Hammer ' +
    'Traits=Shove',
  'Whip':
    'Category=Martial Price=0.1 Damage="1d4 S" Bulk=1 Hands=1 Group=Flail ' +
    'Traits=Disarm,Finesse,Nonlethal,Trip',

  'Dogslicer':
    'Category=Martial Price=0.1 Damage="1d6 S" Bulk=L Hands=1 Group=Sword ' +
    'Traits=Agile,Backstabber,Finesse,Goblin,Uncommon',
  'Elven Curve Blade':
    'Category=Martial Price=4 Damage="1d8 S" Bulk=2 Hands=2 Group=Sword ' +
    'Traits=Elf,Finesse,Forceful,Uncommon',
  "Filcher's Fork":
    'Category=Martial Price=1 Damage="1d4 P" Bulk=L Hands=1 Group=Spear ' +
    'Traits=Agile,Backstabber,"Deadly d6",Finesse,Halfling,Thrown,Uncommon ' +
    'Range=20',
  'Gnome Hooked Hammer':
    'Category=Martial Price=2 Damage="1d6 B" Bulk=1 Hands=1 Group=Hammer ' +
    'Traits=Gnome,Trip,"Two-hand d10",Uncommon,"Versatile P"',
  'Horsechopper':
    'Category=Martial Price=0.9 Damage="1d8 S" Bulk=2 Hands=2 Group=Polearm ' +
    'Traits=Goblin,Reach,Trip,Uncommon,"Versatile P"',
  'Kama':
    'Category=Martial Price=1 Damage="1d6 S" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Monk,Trip,Uncommon',
  'Katana':
    'Category=Martial Price=2 Damage="1d6 S" Bulk=1 Hands=1 Group=Sword ' +
    'Traits="Deadly d8","Two-hand d10",Uncommon,"Versatile P"',
  'Kukri':
    'Category=Martial Price=0.6 Damage="1d6 S" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Finesse,Trip,Uncommon',
  'Nunchaku':
    'Category=Martial Price=0.2 Damage="1d6 B" Bulk=L Hands=1 Group=Club ' +
    'Traits=Backswing,Disarm,Finesse,Monk,Uncommon',
  'Orc Knuckle Dragger':
    'Category=Martial Price=0.7 Damage="1d6 P" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Disarm,Orc,Uncommon',
  'Sai':
    'Category=Martial Price=0.6 Damage="1d4 P" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Agile,Disarm,Finesse,Monk,Uncommon,"Versatile B"',
  'Spiked Chain':
    'Category=Martial Price=3 Damage="1d8 S" Bulk=1 Hands=2 Group=Flail ' +
    'Traits=Disarm,Finesse,Trip,Uncommon',
  'Temple Sword':
    'Category=Martial Price=2 Damage="1d8 S" Bulk=1 Hands=1 Group=Sword ' +
    'Traits=Monk,Trip,Uncommon',

  'Dwarven Waraxe':
    'Category=Advanced Price=3 Damage="1d8 S" Bulk=2 Hands=1 Group=Axe ' +
    'Traits=Dwarf,Sweep,"Two-hand d12",Uncommon',
  'Gnome Flickmace':
    'Category=Advanced Price=3 Damage="1d6 B" Bulk=1 Hands=1 Group=Flail ' +
    'Traits=Gnome,Reach,Sweep,Uncommon',
  'Orc Necksplitter':
    'Category=Advanced Price=2 Damage="1d8 S" Bulk=1 Hands=1 Group=Axe ' +
    'Traits=Forceful,Orc,Sweep,Uncommon',
  'Sawtooth Saber':
    'Category=Advanced Price=5 Damage="1d6 S" Bulk=L Hands=1 Group=Sword ' +
    'Traits=Agile,Finesse,Twin,Uncommon',

  'Blowgun':
    'Category=Simple Price=0.1 Damage="1 P" Bulk=L Hands=1 Group=Dart ' +
    'Traits=Agile,Nonlethal,"Reload 1" Range=20',
  'Crossbow':
    'Category=Simple Price=3 Damage="1d8 P" Bulk=1 Hands=2 Group=Bow ' +
    'Traits="Reload 1", Range=120',
  'Dart':
    'Category=Simple Price=0.01 Damage="1d4 P" Bulk=L Hands=1 Group=Dart ' +
    'Traits=Agile,Thrown Range=20',
  'Hand Crossbow':
    'Category=Simple Price=3 Damage="1d6 P" Bulk=L Hands=1 Group=Bow ' +
    'Traits="Reload 1", Range=60',
  'Heavy Crossbow':
    'Category=Simple Price=4 Damage="1d10 P" Bulk=2 Hands=2 Group=Bow ' +
    'Traits="Reload 2", Range=120',
  'Javelin':
    'Category=Simple Price=0.1 Damage="1d6 P" Bulk=L Hands=1 Group=Dart ' +
    'Traits=Thrown Range=30',
  'Sling':
    'Category=Simple Price=0 Damage="1d6 B" Bulk=L Hands=1 Group=Sling ' +
    'Traits=Propulsive,"Reload 1" Range=50',

  'Lesser Acid Flask':
    'Category=Martial Price=0 Damage="1 E" Bulk=L Hands=1 Group=Bomb ' +
    'Traits=Thrown,Splash Range=20',
  "Lesser Alchemist's Fire":
    'Category=Martial Price=0 Damage="1d8 E" Bulk=L Hands=1 Group=Bomb ' +
    'Traits=Thrown,Splash Range=20',
  'Lesser Bottled Lightning':
    'Category=Martial Price=0 Damage="1d6 E" Bulk=L Hands=1 Group=Bomb ' +
    'Traits=Thrown,Splash Range=20',
  'Lesser Frost Vial':
    'Category=Martial Price=0 Damage="1d6 E" Bulk=L Hands=1 Group=Bomb ' +
    'Traits=Thrown,Splash Range=20',
  'Lesser Tanglefoot Bag':
    'Category=Martial Price=0 Damage="0" Bulk=L Hands=1 Group=Bomb ' +
    'Traits=Thrown Range=20',
  'Lesser Thunderstone':
    'Category=Martial Price=0 Damage="1d4 E" Bulk=L Hands=1 Group=Bomb ' +
    'Traits=Thrown,Splash Range=20',
  'Composite Longbow':
    'Category=Martial Price=20 Damage="1d8 P" Bulk=2 Hands=2 Group=Bow ' +
    'Traits="Deadly d10",Propulsive,"Volley 30\'" Range=100',
  'Composite Shortbow':
    'Category=Martial Price=14 Damage="1d6 P" Bulk=1 Hands=2 Group=Bow ' +
    'Traits="Deadly d10",Propulsive Range=60',
  'Longbow':
    'Category=Martial Price=6 Damage="1d8 P" Bulk=2 Hands=2 Group=Bow ' +
    'Traits="Deadly d10","Volley 30\'" Range=100',
  'Shortbow':
    'Category=Martial Price=3 Damage="1d6 P" Bulk=1 Hands=2 Group=Bow ' +
    'Traits="Deadly d10" Range=60',

  'Halfling Sling Staff':
    'Category=Martial Price=5 Damage="1d10 B" Bulk=1 Hands=2 Group=Sling ' +
    'Traits=Halfling,Propulsive,Uncommon,"Reload 1" Range=80',
  'Shuriken':
    'Category=Martial Price=0.01 Damage="1d4 P" Bulk=0 Hands=1 Group=Dart ' +
    'Traits=Agile,Monk,Thrown,Uncommon Range=20'

};

/* Defines the rules related to character abilities. */
Pathfinder2E.abilityRules = function(rules, abilities) {

  rules.defineChoice('abilgens',
    'All 10s; standard ancestry boosts', 'All 10s; 2 free ancestry boosts',
    'Each 4d6, standard ancestry boosts', 'Each 4d6, 1 free ancestry boost'
  );
  rules.defineChoice('notes',
    'validationNotes.maximumInitialAbility:' +
      'Abilities may not exceed 18 until level >= 2'
  );

  for(let a in abilities) {
    rules.defineChoice('notes', a + ':%V (%1)');
    let baseAbility = 'base' + a.charAt(0).toUpperCase() + a.substring(1);
    rules.defineRule('fullyBoosted.' + a,
      baseAbility, '=', null,
      'abilityBoosts.' + a, '+', 'source * 2',
      'fixedBoosts.' + a, '+', 'source * 2'
    );
    rules.defineRule('halfBoosts.' + a,
      'fullyBoosted.' + a, '=', 'source>19 ? Math.floor((source - 18) / 2) : null'
    );
    rules.defineRule(a,
      'fullyBoosted.' + a, '=', null,
      'halfBoosts.' + a, '+', '-source'
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
  rules.defineRule('encumberedBulk', 'strengthModifier', '=', '5 + source');
  rules.defineRule('maximumBulk', 'strengthModifier', '=', '10 + source');
  rules.defineRule
    ('validationNotes.maximumInitialAbility', 'level', '?', 'source == 1');

  QuilvynRules.validAllocationRules
    (rules, 'abilityBoost', 'choiceCount.Ability', 'abilityBoostsAllocated');

};

/* Defines the rules related to combat. */
Pathfinder2E.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable(armors, [
    'Category', 'Price', 'AC', 'Dex', 'Check', 'Speed', 'Str', 'Bulk',
    'Group', 'Traits'
  ]);
  QuilvynUtils.checkAttrTable(shields, [
    'Price', 'AC', 'Speed', 'Bulk', 'Hardness', 'HP'
  ]);
  QuilvynUtils.checkAttrTable(weapons, [
    'Category', 'Price', 'Damage', 'Bulk', 'Hands', 'Group', 'Traits', 'Range'
  ]);

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

  rules.defineChoice('notes',
    'abilityNotes.armorSpeedPenalty:%V Speed',
    'armorClass:%V (dexterity%1; %2)',
    'shield:%V%1%2%3%4',
    'skillNotes.armorSkillPenalty:%V strength and dexterity skills'
  );

  rules.defineRule('abilityNotes.armorSpeedPenalty',
    'armorSpeedReduction', '=', null,
    'armorStrengthRequirement', '=', 'null', // recomputation trigger
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
  rules.defineRule('finesseAttackBonus',
    'dexterityModifier', '=', null,
    'strengthModifier', '+', '-source',
    '', '^', '0'
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
    'shieldHitPoints', '=', 'source>0 ? "; HP " + source : ""'
  );
  rules.defineRule('shield.4',
    '', '=', '""',
    'shieldACBonus', '=', 'source>0 ? ")" : ""'
  );
  rules.defineRule('skillNotes.armorSkillPenalty',
    'armorCheckPenalty', '=', null,
    'armorStrengthRequirement', '=', 'null', // recomputation trigger
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
  // Define ancestry-specific unarmed attack weapons
  Pathfinder2E.weaponRules(
    rules, 'Jaws', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
    ['Finesse', 'Unarmed'], null
  );

};

/* Defines rules related to basic character identity. */
Pathfinder2E.identityRules = function(
  rules, alignments, ancestries, backgrounds, classes, deities
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable(ancestries, ['Features', 'Selectables', 'HitPoints', 'Languages', 'Speed', 'Traits']);
  QuilvynUtils.checkAttrTable(backgrounds, ['Features', 'Selectables']);
  QuilvynUtils.checkAttrTable
    (classes, ['HitPoints', 'Ability', 'Attribute', 'Features', 'Selectables', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'FollowerAlignments', 'Domain', 'Font', 'Skill', 'Spells', 'Weapon', 'AreasOfConcern', 'DivineAttribute', 'DivineSanctification']);

  rules.defineRule('heritage', 'ancestry', '=', null);

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

  rules.defineRule('combatNotes.weaponSpecialization',
    '', '=', '2',
    'combatNotes.greaterWeaponSpecialization', '+', '2'
  );
  rules.defineRule('experienceNeeded', 'level', '=', 'source * 1000');
  rules.defineRule('featureNotes.anathema',
    'deity', '+', 'null', // recomputation trigger
    'featureNotes.anathema.1', '=',
      '[]' +
        '.concat(source & 1 ? ["barbarian instinct"] : [])' +
        '.concat(source & 2 || source & 4 ? [dict.deity] : [])' +
        '.concat(source & 8 ? ["druidic order"] : [])' +
        '.concat(source & 16 ? ["background"] : [])' +
        '.join(", ")' +
        '.replace(/^([^,]*), ([^,]*)$/, "$1 or $2")' +
        '.replace(/,([^,]*)$/, ", or$1")'
  );
  rules.defineRule('featureNotes.anathema.1',
    'features.Anathema', '=', '0',
    'levels.Barbarian', '+', '1',
    'features.Barbarian Dedication', '+', '1',
    'levels.Champion', '+', '2',
    'features.Champion Dedication', '+', '2',
    'levels.Cleric', '+', '4',
    'features.Cleric Dedication', '+', '4',
    'levels.Druid', '+', '8',
    'features.Druid Dedication', '+', '8'
  );
  rules.defineRule('level', 'experience', '=', 'Math.floor(source / 1000) + 1');
  rules.defineRule('size',
    '', '=', '"Medium"',
    "features.Large", '=', '"Large"',
    "features.Small", '=', '"Small"'
  );

};

/* Defines rules related to magic use. */
Pathfinder2E.magicRules = function(rules, spells) {

  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Level', 'Traditions', 'Cast', 'Description', 'Traits']);

  for(let s in spells)
    rules.choiceRules(rules, 'Spell', s, spells[s]);

  ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
    let innate = t + ' Innate';
    rules.defineChoice('notes',
      'spellAttackModifier.' + t + ':%S (' + '%{spellAbility.' + t + '}; %1)',
      'spellDifficultyClass.' + t + ':%V (' + '%{spellAbility.' + t + '}; %1)',
      'spellAttackModifier.' + innate + ':%S (charisma; %1)',
      'spellDifficultyClass.' + innate + ':%V (charisma; %1)'
    );
    rules.defineRule('rank.' + t, 'trainingLevel.' + t, '=', null);
    rules.defineRule('proficiencyBonus.' + innate,
      'rank.' + innate, '=', '2 * source',
      'level', '+', null
    );
    rules.defineRule('proficiencyBonus.' + t,
      'rank.' + t, '=', '2 * source',
      'proficiencyLevelBonus.' + t, '+', null
    );
    rules.defineRule('proficiencyLevelBonus.' + t,
      'rank.' + t, '?', 'source > 0',
      'level', '=', null
    );
    rules.defineRule('spellAttackModifier.' + innate,
      'proficiencyBonus.' + innate, '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule('spellAttackModifier.' + t,
      'proficiencyBonus.' + t, '=', null,
      'spellModifier.' + t, '+', null
    );
    rules.defineRule('spellAttackModifier.' + innate + '.1',
      'rank.' + innate, '=', 'Pathfinder2E.RANK_NAMES[source]'
    );
    rules.defineRule('spellAttackModifier.' + t + '.1',
      'rank.' + t, '=', 'Pathfinder2E.RANK_NAMES[source]'
    );
    rules.defineRule('spellDifficultyClass.' + innate,
      'proficiencyBonus.' + innate, '=', null,
      'charismaModifier', '+', '10 + source'
    );
    rules.defineRule('spellDifficultyClass.' + t,
      'proficiencyBonus.' + t, '=', null,
      'spellModifier.' + t, '+', '10 + source'
    );
    rules.defineRule('spellDifficultyClass.' + innate + '.1',
      'rank.' + innate, '=', 'Pathfinder2E.RANK_NAMES[source]'
    );
    rules.defineRule('spellDifficultyClass.' + t + '.1',
      'rank.' + t, '=', 'Pathfinder2E.RANK_NAMES[source]'
    );
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
      rules.defineRule
        ('maxSpellLevel', 'spellSlots.' + t.charAt(0) + l, '^=', l);
    });
  });
  // Define max focus points in a variable so that goodies can change it
  rules.defineRule('focusPointMaximum', 'features.Focus Pool', '=', '3');
  rules.defineRule('focusPoints',
    'features.Focus Pool', '=', '0',
    'focusPointMaximum', 'v', null
  );

};

/* Defines rules related to character aptitudes. */
Pathfinder2E.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {

  let matchInfo;

  QuilvynUtils.checkAttrTable(feats, ['Require', 'Imply', 'Traits']);
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note', 'Action']);
  QuilvynUtils.checkAttrTable
    (goodies, ['Pattern', 'Effect', 'Value', 'Attribute', 'Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Attribute', 'Subcategory']);

  for(let g in goodies)
    rules.choiceRules(rules, 'Goody', g, goodies[g]);
  for(let l in languages) {
    rules.choiceRules(rules, 'Language', l, languages[l]);
    rules.defineRule('languagesSpoken', 'languages.' + l, '+=', '1');
  }
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

  rules.defineChoice('notes',
    'perception:%S (wisdom; %1)',
    'skillNotes.duplicatedTraining:Skill Trained (Choose %V from any)',
    'skillNotes.intelligenceLanguageBonus:+%V Language Count'
  );

  rules.defineRule
    ('choiceCount.Skill', 'skillNotes.duplicatedTraining', '+=', null);
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
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValueArray(attrs, 'Traits')
    );
    Pathfinder2E.ancestryRulesExtra(rules, name);
  } else if(type == 'Ancestry Feature')
    Pathfinder2E.ancestryFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ancestry'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
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
      QuilvynUtils.getAttrValueArray(attrs, 'Traits')
    );
  else if(type == 'Background') {
    Pathfinder2E.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables')
    );
    Pathfinder2E.backgroundRulesExtra(rules, name);
  } else if(type == 'Background Feature')
    Pathfinder2E.backgroundFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Background'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Class') {
    Pathfinder2E.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Pathfinder2E.classRulesExtra(rules, name);
  } else if(type == 'Class Feature')
    Pathfinder2E.classFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Deity')
    Pathfinder2E.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'FollowerAlignments'),
      QuilvynUtils.getAttrValue(attrs, 'Font'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValue(attrs, 'Weapon'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells')
    );
  else if(type == 'Feat') {
    Pathfinder2E.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Traits')
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
      QuilvynUtils.getAttrValue(attrs, 'Subcategory')
    );
  else if(type == 'Spell') {
    let level = QuilvynUtils.getAttrValue(attrs, 'Level');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let trads = QuilvynUtils.getAttrValueArray(attrs, 'Traditions');
    let traits = QuilvynUtils.getAttrValueArray(attrs, 'Traits');
    let isCantrip = traits.includes('Cantrip');
    let isFocus = traits.includes('Focus');
    trads.forEach(t => {
      let spellName =
        name + ' (' + t.charAt(0) + (isCantrip ? 'C' : '') + level + (isFocus ? ' Foc' : '') + (school ? ' ' + school.substring(0, 3) : '') + ')';
      Pathfinder2E.spellRules(rules, spellName,
        school,
        level,
        t,
        QuilvynUtils.getAttrValue(attrs, 'Cast'),
        QuilvynUtils.getAttrValueArray(attrs, 'Traits'),
        QuilvynUtils.getAttrValue(attrs, 'Description').replaceAll('%tradition', t)
      );
      if(!isFocus)
        rules.addChoice('spells', spellName, attrs);
    });
  } else if(type == 'Weapon')
    Pathfinder2E.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Price'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Bulk'),
      QuilvynUtils.getAttrValue(attrs, 'Hands'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValueArray(attrs, 'Traits'),
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
  if(type == 'feats') {
    type = 'generalFeats';
    QuilvynUtils.getAttrValueArray(attrs, 'Traits').forEach(a => {
      if(a == 'Archetype')
        type = 'classFeats';
      else if(a == 'Orc' ||
              a.startsWith('Half-') ||
              a in (rules.getChoices('ancestrys') || {}))
        type = 'ancestryFeats';
      else if(a in (rules.getChoices('levels') || {}))
        type = 'classFeats';
    });
    rules.addChoice(type, name, attrs);
    rules.defineRule('feats.' + name, type + '.' + name, '=', null);
    rules.defineRule('sum' + type.charAt(0).toUpperCase() + type.substring(1),
      'feats.' + name, '+=', '1'
    );
  }
  if(type == 'weapons' && attrs.includes('Advanced'))
    rules.addChoice('advancedWeapons', name, attrs);

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
    } else if(type.match(/^(Ancestry|Background|Class)$/)) {
      let prefix =
        name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
      let level = type == 'Class' ? 'levels.' + name : (prefix + 'Level');
      let targets = rules.allTargets(level);
      targets.forEach(x => {
        rules.defineRule(x, level, '=', 'null');
      });
    } else if(type.match(/^(Ancestry|Background|Class) Feature/)) {
      let base =
        QuilvynUtils.getAttrValue(currentAttrs, 'Ancestry') ||
        QuilvynUtils.getAttrValue(currentAttrs, 'Background') ||
        QuilvynUtils.getAttrValue(currentAttrs, 'Class');
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
    QuilvynUtils.getKeys(choices, '^' + name + ' \\(').forEach(s => {
      delete choices[s];
      delete notes['spells.' + s];
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
 * Defines in #rules# the rules associated with ancestry #name#. #hitPoints#
 * gives the number of HP granted at level 1 and #speed# the speed, #features#
 * and #selectables# list associated automatic and selectable features,
 * #languages# lists languages automatically known by characters with the
 * ancestry, and #traits# lists any traits associated with it.
 */
Pathfinder2E.ancestryRules = function(
  rules, name, hitPoints, speed, features, selectables, languages, traits
) {

  if(!name) {
    console.log('Empty ancestry name');
    return;
  }
  if(typeof hitPoints != 'number') {
    console.log('Bad hitPoints "' + hitPoints + '" for ancestry ' + name);
  }
  if(typeof speed != 'number') {
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
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for ancestry ' + name);
    return;
  }
  if(!Array.isArray(traits)) {
    console.log('Bad traits list "' + traits + '" for ancestry ' + name);
    return;
  }

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let ancestryLevel = prefix + 'Level';

  rules.defineRule(ancestryLevel,
    'ancestry', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  rules.defineRule('selectableFeatureCount.' + name + ' (Heritage)',
    'featureNotes.' + prefix + 'Heritage', '=', '1'
  );

  if(features.filter(x => x.match(/^(\d+:)?Low-Light Vision$/)).length > 0)
    rules.defineRule('hasAncestralLowLightVision', ancestryLevel, '=', '1');
  rules.defineRule('hitPoints', ancestryLevel, '+=', hitPoints);
  rules.defineRule('languageCount', ancestryLevel, '=', languages.length);
  languages.forEach(l => {
    if(l != 'any')
      rules.defineRule('languages.' + l, ancestryLevel, '=', '1');
  });
  rules.defineRule('speed', ancestryLevel, '=', speed);

  let boostFeature =
    features.filter(x => x.match(/(Ability|Attribute) Boost/))[0];
  if(boostFeature) {
    features = features.filter(x => !(x.match(/(Ability|Attribute) Boost/)));
    if(boostFeature.includes('(Choose 2 from any')) {
      features.push(
        'abilityGeneration !~ "4d6" ? ' + boostFeature,
        'abilityGeneration =~ "4d6" ? ' + boostFeature.replace('2 from', '1 from')
      );
    } else {
      features.push(
        'abilityGeneration =~ "^[^6]*[Ss]tandard" ? ' + boostFeature,
        'abilityGeneration =~ "^[^6]*free" ? ' + boostFeature.replace(/\(.*\)/, '(Choose 2 from any)'),
        'abilityGeneration =~ "4d6.*standard" ? ' + boostFeature.replace('; Choose 1 from any', ''),
        'abilityGeneration =~ "4d6.*free" ? ' + boostFeature.replace(/\(.*\)/, '(Choose 1 from any)')
      );
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
  traits.forEach(t => {
    rules.defineRule('traits.' + t, ancestryLevel, '=', '1');
  });

  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  selectables = rules.getChoices('selectableFeatures');
  for(let s in selectables) {
    if(s.includes(name) && selectables[s].includes('Heritage'))
      rules.addChoice('selectableHeritages', s, selectables[s]);
  }

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
Pathfinder2E.ancestryRulesExtra = function(rules, name) {
  if(name == 'Dwarf') {
    rules.defineRule('weapons.Clan Dagger', 'features.Clan Dagger', '=', '1');
  } else if(name == 'Gnome') {
    rules.defineRule('selectableFeatureCount.Gnome (Wellspring)',
      'featureNotes.wellspringGnome', '=', '1'
    );
    ['Arcane', 'Divine', 'Occult'].forEach(t => {
      rules.defineRule('features.Wellspring Gnome (' + t + ')',
        'features.Wellspring Gnome', '?', null,
        'features.' + t + ' Wellspring', '=', '1'
      );
    });
  } else if(name == 'Goblin') {
    rules.defineRule('weapons.Jaws', 'combatNotes.razortoothGoblin', '=', '1');
  } else if(name == 'Halfling') {
    rules.defineRule('skillNotes.nomadicHalfling',
      '', '=', '2',
      'features.Multilingual', '+', null
    );
  } else if(name == 'Human') {
    rules.defineRule('skillNotes.skilledHeritageHuman',
      'level', '=', 'source<5 ? "Trained" : "Expert"'
    );
  }
};

/*
 * Defines in #rules# the rules required to give feature #name# to ancestry
 * #ancestryName# at level #level#. #selectable# gives the category if this
 * feature is selectable; it is otherwise null. #replace# lists any ancestry
 * features that this new one replaces.
 */
Pathfinder2E.ancestryFeatureRules = function(
  rules, name, ancestryName, level, selectable, replace
) {

  if(!name) {
    console.log('Empty ancestry feature name');
    return;
  }
  if(!(ancestryName in rules.getChoices('ancestrys'))) {
    console.log('Bad ancestry "' + ancestryName + '" for ancestry feature ' + name);
    return;
  }
  if(typeof level != 'number') {
    console.log('Bad level "' + level + '" for ancestry feature ' + name);
    return;
  }
  if(selectable && typeof selectable != 'string') {
    console.log('Bad selectable "' + selectable + '" for ancestry feature ' + name);
    return;
  }
  if(!Array.isArray(replace)) {
    console.log('Bad replace list "' + replace + '" for ancestry feature ' + name);
    return;
  }

  let prefix =
    ancestryName.charAt(0).toLowerCase() + ancestryName.substring(1).replaceAll(' ','');
  let ancestryLevel = prefix + 'Level';
  let featureSpec = level + ':' + name;
  if(selectable)
    featureSpec += ':' + selectable;
  QuilvynRules.featureListRules
    (rules, [featureSpec], ancestryName, ancestryLevel, selectable ? true : false);
  if(selectable) {
    let countVar =
      'selectableFeatureCount.' + ancestryName + ' (' + selectable + ')';
    if(!rules.getSources(countVar))
      rules.defineRule(countVar,
        ancestryLevel, '=', level>1 ? 'source>=' + level + ' ? 1 : null' : '1'
      );
  }
  replace.forEach(f => {
    let hasVar = 'has' + f.replaceAll(' ', '');
    rules.defineRule(prefix + 'Features.' + f, hasVar, '?', 'source==1');
    rules.defineRule(hasVar,
      ancestryLevel, '=', '1',
      prefix + 'Features.' + name, '=', '0'
    );
  });

};

/*
 * Defines in #rules# the rules associated with armor #name#, which belongs
 * to category #category#, costs #price# gold pieces, adds #ac# to the
 * character's armor class, allows a maximum dex bonus to ac of #maxDex#,
 * imposes #checkPenalty# on specific skills, slows the character by
 * #speedPenalty#, requires a strength (or strengthModifier if < 6) of at least
 * #minStr# to use without penalties, adds #bulk# to the character's burden,
 * belongs to group #group#, and has the list of traits #traits#.
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
  if(minStr && typeof minStr != 'number') {
    console.log('Bad min str "' + minStr + '" for armor ' + name);
    return;
  }
  if(minStr == null)
    minStr = 0;
  else if(minStr < 6)
    // convert strengthModifier value to strength value
    minStr = 10 + minStr * 2;
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
    'armor', '=', 'null', // recomputation trigger
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

  let boostFeature = features.filter(x => x.includes('Ability Boost'))[0];
  if(boostFeature) {
    features = features.filter(x => !x.includes('Ability Boost'));
    features.push('abilityGeneration !~ "4d6" ? ' + boostFeature);
    if(boostFeature.includes('(Choose 2 from any'))
      features.push(
        'abilityGeneration =~ "4d6" ? ' + boostFeature.replace('2 from', '1 from')
      );
    else
      features.push(
        'abilityGeneration =~ "4d6" ? ' + boostFeature.replace('; Choose 1 from any', '')
      );
  }
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

/*
 * Defines in #rules# the rules required to give feature #name# to background
 * #backgroundName# at level #level#. #replace# lists any background features
 * that this new one replaces.
 */
Pathfinder2E.backgroundFeatureRules = function(
  rules, name, backgroundName, level, replace
) {

  if(!name) {
    console.log('Empty background feature name');
    return;
  }
  if(!(backgroundName in rules.getChoices('backgrounds'))) {
    console.log('Bad background "' + backgroundName + '" for background feature ' + name);
    return;
  }
  if(typeof level != 'number') {
    console.log('Bad level "' + level + '" for background feature ' + name);
    return;
  }
  if(!Array.isArray(replace)) {
    console.log('Bad replace list "' + replace + '" for background feature ' + name);
    return;
  }

  let featureSpec = level + ':' + name;
  let prefix =
    backgroundName.charAt(0).toLowerCase() + backgroundName.substring(1).replaceAll(' ', '');
  let backgroundLevel = prefix + 'Level';

  QuilvynRules.featureListRules
    (rules, [featureSpec], backgroundName, backgroundLevel, false);
  replace.forEach(f => {
    let hasVar = 'has' + f.replaceAll(' ', '');
    rules.defineRule(prefix + 'Features.' + f, hasVar, '?', 'source==1');
    rules.defineRule(hasVar,
      'features.' + backgroundName, '=', '1',
      prefix + 'Features.' + name, '=', '0'
    );
  });

};

/*
 * Defines in #rules# the rules associated with class #name#. #abilities# lists
 * the possible class abilities for the class. The class grants #hitPoints#
 * additional hit points with each level advance. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level, and #spellSlots# the number of spells per level per day that
 * the class can cast.
 */
Pathfinder2E.classRules = function(
  rules, name, abilities, hitPoints, features, selectables, spellSlots
) {

  if(!name) {
    console.log('Empty class name');
    return;
  }
  if(!Array.isArray(abilities)) {
    console.log('Bad abilities list "' + abilities + '" for class ' + name);
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

  rules.defineRule(classLevel,
    'class', '?', 'source=="' + name + '"',
    'level', '=', null
  );

  Pathfinder2E.featureListRules(rules, features, name, classLevel, false);
  Pathfinder2E.featureListRules(rules, selectables, name, classLevel, true);

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
    rules.defineRule('spellModifier.' + name,
      classLevel, '?', null,
      abilities[0] + 'Modifier', '=', null
    );
    let firstChar = spellSlots[0].charAt(0);
    if('ADOP'.includes(firstChar)) {
      QuilvynRules.spellSlotRules(rules, classLevel, spellSlots);
      let spellType =
        {'A':'Arcane', 'D':'Divine', 'O':'Occult', 'P':'Primal'}[firstChar];
      rules.defineRule('spellAbility.' + spellType,
        classLevel, '=', '"' + abilities[0] + '"'
      );
      rules.defineRule
        ('spellModifier.' + spellType, 'spellModifier.' + name, '=', null);
    } else if('0123456789'.includes(firstChar)) {
      // Sorcerer slots depend on bloodline. Generate rules here based on a
      // tradition-specific level that is set by featureRules.
      ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
        let firstChar = t.charAt(0);
        let tLevel = prefix + t + 'Level';
        let tSlots = spellSlots.map(x => firstChar + x);
        QuilvynRules.spellSlotRules(rules, tLevel, tSlots);
        rules.defineRule
          ('spellAbility.' + t, tLevel, '=', '"' + abilities[0] + '"');
        rules.defineRule('spellModifier' + t + '.' + name,
          tLevel, '?', null,
          'spellModifier.' + name, '=', null
        );
        rules.defineRule
          ('spellModifier.' + t, 'spellModifier' + t + '.' + name, '=', null);
      });
    }
  }

  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

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
        modifier, '+', 'null', // recomputation trigger
        prefix + 'Features.' + a, '+', '10 + dict.' + modifier
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
    rules.defineRule('skillNotes.formulaBook',
      'skillNotes.alchemicalCrafting', '=', '4',
      'levels.Alchemist', '+', 'source * 2',
      'skillNotes.bomber', '+', '2',
      'skillNotes.chirurgeon', '+', '2',
      'skillNotes.mutagenist', '+', '2'
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
      'features.Chirurgeon', '=', 'null', // recomputation trigger
      'skillNotes.perpetualPotency', '^', 'dict["features.Chirurgeon"] ? 6 : 3',
      'skillNotes.perpetualPerfection', '^', '11'
    );
  } else if(name == 'Barbarian') {
    rules.defineRule('combatNotes.draconicRage',
      '', '=', '"fire"',
      'features.Dragon Instinct (Black)', '=', '"acid"',
      'features.Dragon Instinct (Blue)', '=', '"electricity"',
      'features.Dragon Instinct (Green)', '=', '"poison"',
      'features.Dragon Instinct (White)', '=', '"cold"',
      'features.Dragon Instinct (Bronze)', '=', '"electricity"',
      'features.Dragon Instinct (Copper)', '=', '"acid"',
      'features.Dragon Instinct (Silver)', '=', '"cold"'
    );
    rules.defineRule('combatNotes.furyInstinct',
      'combatNotes.specializationAbility', '=', 'null', // italics
      'features.Weapon Specialization', '=', '6',
      'features.Greater Weapon Specialization', '=', '12'
    );
    rules.defineRule('combatNotes.rage',
      '', '=', '2',
      'combatNotes.furyInstinct', '^', null,
      'combatNotes.quickRage', '=', 'null' // italics
    );
    let allSelectables = rules.getChoices('selectableFeatures');
    let instincts =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Instinct')).map(x => x.replace('Barbarian - ', ''));
    instincts.forEach(i => {
      if(i.includes('(')) {
        let instinctGroup = i.replace(/\s*\(.*/, '');
        rules.defineRule
          ('features.' + instinctGroup, 'features.' + i, '=', '1');
      }
    });
    rules.defineRule('selectableFeatureCount.Barbarian (Instinct)',
      'featureNotes.instinct', '=', '1'
    );
    rules.defineRule
      ('skillNotes.barbarianSkills', 'intelligenceModifier', '=', '3 + source');
    rules.defineRule
      ('featureNotes.ragingIntimidation', 'rank.Intimidation', '?', null);
    rules.defineRule('featureNotes.ragingIntimidation-1',
      'rank.Intimidation', '?', 'source>=4',
      'level', '?', 'source>=15'
    );
  } else if(name == 'Bard') {
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
      ('spellSlots.OC1', 'magicNotes.occultSpellcasting', '=', 'null'); // italic
    rules.defineRule('spellSlots.O10', 'magicNotes.perfectEncore', '+', '1');
  } else if(name == 'Champion') {
    rules.defineRule('combatNotes.deificWeapon',
      'deityWeaponDamage', '?', 'source',
      'deityWeaponCategory', '?', 'source && (source=="Simple" || (source=="Unarmed" && dict.deityWeaponDamage.includes("d4")))'
    );
    ['dragonslayerOath', 'fiendsbaneOath', 'shiningOath'].forEach(f => {
      rules.defineRule('combatNotes.' + f,
        'features.Glimpse Of Redemption', '=', '"Glimpse Of Redemption grants %{level+7} damage resistance"',
        'features.Liberating Step', '=', '"Liberating Step grants +4 checks and a 2nd Step"',
        'features.Retributive Strike', '=', '"Retributive Strike inflicts +4 HP damage, or +6 HP with master proficiency,"'
      );
    });
    rules.defineRule('combatNotes.exalt(Paladin)',
      'combatNotes.auraOfVengeance', '=', 'null' // italics
    );
    rules.defineRule('combatNotes.weaponExpertise',
      classLevel, '=', '"Simple Weapons; Martial Weapons"'
    );
    rules.defineRule('combatNotes.shieldAlly.1',
      'combatNotes.shieldAlly', '=', '1.5',
      'combatNotes.shieldParagon', '^', '2'
    );
    rules.defineRule('featureNotes.divineAlly',
      '', '=', '1',
      'featureNotes.secondAlly', '+', '1'
    );
    rules.defineRule('featureNotes.liberator',
      "featureNotes.champion'sReaction", '=', 'null' // italics
    );
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
      ('shieldHitPoints', 'combatNotes.shieldAlly.1', '*', null);
    rules.defineRule
      ('skillNotes.championSkills', 'intelligenceModifier', '=', '2 + source');
    rules.defineRule('skillNotes.deityAndCause', 'deitySkill', '=', null);
    rules.defineRule('spellModifier.Champion',
      classLevel, '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Divine', 'spellModifier.Champion', '=', null);
    rules.defineRule
      ('spellAbility.Divine', classLevel, '=', '"charisma"');
    rules.defineRule('trainingLevel.Martial Weapons',
      'combatNotes.weaponExpertise', '^=', 'source.includes("Martial Weapons") ? 2 : null'
    );
    rules.defineRule('trainingLevel.Simple Weapons',
      'combatNotes.weaponExpertise', '^=', 'source.includes("Simple Weapons") ? 2 : null'
    );
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
      'deityWeaponCategory', '?', 'source && source.match(/Simple|Unarmed/)'
    );
    rules.defineRule('combatNotes.deity', 'deityWeapon', '=', null);
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
      'deityWeaponCategory', '?', 'source.match(/Simple|Unarmed/)'
    );
    rules.defineRule('magicNotes.cloisteredCleric',
      'level', '=', 'source<7 ? "Trained" : source<15 ? "Expert" : source<19 ? "Master" : "Legendary"'
    );
    rules.defineRule('magicNotes.deity',
      'deitySpells', '=', 'source.split("/").map(x => "<i>" + x.replace(/\\d+:/, "") + "</i>").join(", ").replace(/, ([^,]*)$/, ", and $1")'
    );
    rules.defineRule('magicNotes.warpriest',
      'level', '=', 'source<11 ? "Trained" : source<19 ? "Expert" : "Master"'
    );
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
  } else if(name == 'Fighter') {
    ['Axes', 'Bombs', 'Brawling Weapons', 'Clubs', 'Crossbows', 'Darts',
     'Flails', 'Hammers', 'Knives', 'Picks', 'Polearms', 'Slings', 'Shields',
     'Spears', 'Swords'].forEach(g => {
      rules.defineRule('features.Fighter Weapon Mastery (' + g + ')',
        'features.Fighter Weapon Mastery', '?', null,
        'features.' + g, '=', '1'
      );
      rules.defineRule('features.Weapon Legend (' + g + ')',
        'features.Weapon Legend', '?', null,
        'features.' + g, '=', '1'
      );
    });
    rules.defineRule('combatNotes.combatFlexibility',
      'combatNotes.improvedFlexibility', '=', 'null' // italics
    )
    rules.defineRule('selectableFeatureCount.Fighter (Key Ability)',
      'featureNotes.fighterKeyAbility', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Weapon Group)',
      'featureNotes.fighterWeaponMastery', '=', '1',
      'featureNotes.weaponLegend', '=', '1'
    );
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
    rules.defineRule('combatNotes.monasticWeaponry',
      '', '=', '"Trained"',
      'trainingLevel.Unarmed Attacks', '=', 'source>2 ? "Master" : source>1 ? "Expert" : null'
    );
    rules.defineRule('featureNotes.pathToPerfection',
      '', '=', '1',
      'featureNotes.secondPathToPerfection', '+', '1'
    );
    rules.defineRule('magicNotes.gracefulLegend',
      'features.Ki Tradition (Divine)', '=', '"Divine"',
      'features.Ki Tradition (Occult)', '=', '"Occult"'
    );
    rules.defineRule('magicNotes.monkExpertise',
      'features.Ki Tradition (Divine)', '=', '"Divine"',
      'features.Ki Tradition (Occult)', '=', '"Occult"'
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
      'features.Ki Tradition (Divine)', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('spellModifierOccult.Monk',
      'features.Ki Tradition (Occult)', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Divine', 'spellModifierDivine.Monk', '=', null);
    rules.defineRule
      ('spellModifier.Occult', 'spellModifierOccult.Monk', '=', null);
    rules.defineRule('spellAbility.Divine',
      'spellModifierDivine.Monk', '=', '"wisdom"'
    );
    rules.defineRule('spellAbility.Occult',
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
      'combatNotes.legendaryMonsterHunter', '+', 'null' // italics
    );
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Edge)",
      "featureNotes.hunter'sEdge", '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Key Ability)',
      'featureNotes.rangerKeyAbility', '=', '1'
    );
    rules.defineRule
      ('saveNotes.favoredTerrain(Arctic)', 'features.Wild Stride', '?', null);
    rules.defineRule
      ('saveNotes.favoredTerrain(Desert)', 'features.Wild Stride', '?', null);
    rules.defineRule
      ('saveNotes.favoredTerrain(Plains)-1', 'features.Wild Stride', '?', null);
    rules.defineRule
      ('skillNotes.rangerSkills', 'intelligenceModifier', '=', '4 + source');
  } else if(name == 'Rogue') {
    rules.defineRule('combatNotes.debilitatingStrike',
      'combatNotes.criticalDebilitation', '=', 'null', // italics
      'combatNotes.doubleDebilitation', '=', 'null', // italics
      'combatNotes.preciseDebilitations', '=', 'null', // italics
      'combatNotes.tacticalDebilitations', '=', 'null', // italics
      'combatNotes.viciousDebilitations', '=', 'null' // italics
    );
    rules.defineRule('combatNotes.ruffian',
      '', '=', '"Trained"',
      'rank.Light Armor', '=', 'source>=3 ? "Master" : source==2 ? "Expert" : null'
    );
    rules.defineRule('combatNotes.slyStriker',
      'combatNotes.impossibleStriker', '+', 'null' // italics
    );
    rules.defineRule('combatNotes.thief',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule('featureNotes.rogueFeats',
      classLevel, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('featureNotes.skillFeats', classLevel, '=', null);
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
    rules.defineRule('bloodlineTraditions',
      classLevel, '=', 'Pathfinder2E.bloodlineTraditions = ""'
    );
    rules.defineRule('bloodlineTraditionsLowered',
      'bloodlineTraditions', '=', 'source.toLowerCase()'
    );
    rules.defineRule('bloodlineDamage',
      'draconicColor', '=', '{Black:"acid", Blue:"electricity", Bronze:"electricity", Copper:"acid", Green:"poison", Silver:"cold", White:"cold"}[source] || "fire"',
      'features.Elemental (Air)', '=', '"bludgeoning"',
      'features.Elemental (Earth)', '=', '"bludgeoning"',
      'features.Elemental (Fire)', '=', '"fire"',
      'features.Elemental (Water)', '=', '"bludgeoning"'
    );
    rules.defineRule('draconicColor',
      'features.Draconic (Black)', '=', '"Black"',
      'features.Draconic (Blue)', '=', '"Blue"',
      'features.Draconic (Brass)', '=', '"Brass"',
      'features.Draconic (Bronze)', '=', '"Bronze"',
      'features.Draconic (Copper)', '=', '"Copper"',
      'features.Draconic (Gold)', '=', '"Gold"',
      'features.Draconic (Green)', '=', '"Green"',
      'features.Draconic (Red)', '=', '"Red"',
      'features.Draconic (Silver)', '=', '"Silver"',
      'features.Draconic (White)', '=', '"White"'
    );
    // NOTE: using '' instead of classLevel allows Simple Weapons to be the
    // default for, e.g., homebrew classes
    rules.defineRule
      ('combatNotes.weaponExpertise', '', '=', '"Simple Weapons"');
    rules.defineRule('magicNotes.divineEvolution', 'maxSpellLevel', '=', null);
    rules.defineRule
      ('magicNotes.expertSpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.legendarySpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule
      ('magicNotes.masterSpellcaster', 'bloodlineTraditions', '=', null);
    rules.defineRule('magicNotes.primalEvolution', 'maxSpellLevel', '=', null);
    rules.defineRule('magicNotes.sorcererSpellcasting',
      'bloodlineTraditionsLowered', '=', null
    );
    ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
      rules.defineRule('trainingLevel.' + t,
        'magicNotes.expertSpellcaster', '^=', 'source.includes("' + t + '") ? 2 : null',
        'magicNotes.masterSpellcaster', '^=', 'source.includes("' + t + '") ? 3 : null',
        'magicNotes.legendarySpellcaster', '^=', 'source.includes("' + t + '") ? 4 : null'
      );
      rules.defineRule('spellSlots.' + t.charAt(0) + '10',
        'magicNotes.bloodlinePerfection', '+', '1'
      );
    });
    let allSelectables = rules.getChoices('selectableFeatures');
    let bloodlines =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Bloodline')).map(x => x.replace('Sorcerer - ', ''));
    bloodlines.forEach(b => {
      if(b.includes('(')) {
        let bloodlineGroup = b.replace(/\s*\(.*/, '');
        rules.defineRule
          ('features.' + bloodlineGroup, 'features.' + b, '=', '1');
      }
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
      rules.defineRule('spellSlots.D' + l,
        'magicNotes.divineEvolution', '+', 'source==' + l + ' ? 1 : null'
      );
      rules.defineRule('spellSlots.P' + l,
        'magicNotes.primalEvolution', '+', 'source==' + l + ' ? 1 : null'
      );
    });
  } else if(name == 'Wizard') {
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
    rules.defineRule('selectableFeatureCount.Wizard (Arcane School)',
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
    let schools =
      rules.plugin.CLASSES.Wizard.match(/([\s\w]*:Arcane School)/g)
      .map(x => x.replace(':Arcane School', ''))
      .filter(x => !x.includes('Uni'));
    schools.forEach(s => {
      let prefix =
        s.charAt(0).toLowerCase() + s.substring(1).replaceAll(' ', '');
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
        rules.defineRule('spellSlots.A' + l, 'magicNotes.' + prefix, '+', '1');
      });
    });
  }

};

/*
 * Defines in #rules# the rules required to give feature #name# to class
 * #className# at level #level#. #selectable# gives the category if this feature
 * is selectable; it is otherwise null. #requires# lists any hard prerequisites
 * for the feature, and #replace# lists any class features that this new one
 * replaces.
 */
Pathfinder2E.classFeatureRules = function(
  rules, name, className, requires, level, selectable, replace
) {

  if(!name) {
    console.log('Empty class feature name');
    return;
  }
  if(!(className in rules.getChoices('levels'))) {
    console.log('Bad class "' + className + '" for class feature ' + name);
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for class feature ' + name);
    return;
  }
  if(typeof level != 'number') {
    console.log('Bad level "' + level + '" for class feature ' + name);
    return;
  }
  if(selectable && typeof selectable != 'string') {
    console.log('Bad selectable "' + selectable + '" for class feature ' + name);
    return;
  }
  if(!Array.isArray(replace)) {
    console.log('Bad replace list "' + replace + '" for class feature ' + name);
    return;
  }

  let classLevel = 'levels.' + className;
  let featureSpec = level + ':' + name;
  let prefix =
    className.charAt(0).toLowerCase() + className.substring(1).replaceAll(' ', '');
  if(selectable)
    featureSpec += ':' + selectable;
  if(requires.length > 0)
    featureSpec = requires.join('/') + ' ? ' + featureSpec;
  QuilvynRules.featureListRules
    (rules, [featureSpec], className, classLevel, selectable ? true : false);
  if(selectable) {
    let countVar =
      'selectableFeatureCount.' + className + ' (' + selectable + ')';
    if(!rules.getSources(countVar))
      rules.defineRule(countVar,
        classLevel, '=', level>1 ? 'source>=' + level + ' ? 1 : null' : '1'
      );
  }
  replace.forEach(f => {
    let hasVar = 'has' + f.replaceAll(' ', '');
    rules.defineRule(prefix + 'Features.' + f, hasVar, '?', 'source==1');
    rules.defineRule(hasVar,
      classLevel, '=', '1',
      prefix + 'Features.' + name, '=', '0'
    );
  });

};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, #followerAlignments# lists the alignments permitted
 * for followers, #font# contains the divine font(s), #domains# lists the
 * associated domains, #weapon# is the deity's favored weapon, #skill# the
 * divine skill, and #spells# lists associated cleric spells.
 */
Pathfinder2E.deityRules = function(
  rules, name, alignment, followerAlignments, font, domains, weapon, skill,
  spells
) {

  if(!name) {
    console.log('Empty deity name');
    return;
  }
  if(alignment && !alignment.match(/^(N|[LNC]G|[LNC]E|[LC]N)$/i)) {
    console.log('Bad alignment "' + alignment + '" for deity ' + name);
    return;
  }
  if(!Array.isArray(followerAlignments)) {
    console.log('Bad follower alignments list "' + followerAlignments + '" for deity ' + name);
    return;
  }
  followerAlignments.forEach(a => {
    if(!a.match(/^(N|[LNC]G|[LNC]E|[LC]N)$/i)) {
      console.log('Bad follower alignment "' + a + '" for deity ' + name);
      return;
    }
  });
  if(font && !(font+'').match(/^(Either|Harm|Heal)$/)) {
    console.log('Bad font "' + font + '" for deity ' + name);
    return;
  }
  if(!Array.isArray(domains)) {
    console.log('Bad domains list "' + domains + '" for deity ' + name);
    return;
  }
  if(weapon && typeof(weapon) != 'string') {
    console.log('Bad weapon "' + weapon + '" for deity ' + name);
    return;
  } else if(weapon && !(weapon in rules.getChoices('weapons'))) {
    console.log('Unknown weapon "' + weapon + '" for deity ' + name);
    return;
  }
  if(skill && typeof(skill) != 'string') {
    console.log('Bad skill "' + skill + '" for deity ' + name);
    return;
  }
  let allSkills = rules.getChoices('skills') || Pathfinder2E.SKILLS;
  if(skill && !(skill in allSkills)) {
    console.log('Unknown skill "' + skill + '" for deity ' + name);
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
      font:{},
      domains:{},
      weapon:{},
      weaponCategory:{},
      weaponDamage:{},
      skill:{},
      spells:{}
    };
  }

  rules.deityStats.alignment[name] = alignment;
  rules.deityStats.followerAlignments[name] = followerAlignments.join('/');
  rules.deityStats.font[name] = font;
  rules.deityStats.domains[name] = domains.join('/');
  rules.deityStats.weapon[name] = weapon;
  rules.deityStats.weaponCategory[name] =
    QuilvynUtils.getAttrValue(rules.getChoices('weapons')[weapon] || '', "Category");
  rules.deityStats.weaponDamage[name] =
    QuilvynUtils.getAttrValue(rules.getChoices('weapons')[weapon] || '', "Damage");
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
  rules.defineRule('deityFont',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.font) + '[source]'
  );
  rules.defineRule('deitySkill',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.skill) + '[source]'
  );
  rules.defineRule('deitySpells',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.spells) + '[source]'
  );

  if(weapon) {
    rules.defineRule('deityWeapon',
      'deity', '=', QuilvynUtils.dictLit(rules.deityStats.weapon) + '[source]'
    );
    rules.defineRule
      ('deityWeaponLowered', 'deityWeapon', '=', 'source.toLowerCase()');
    rules.defineRule('deityWeaponCategory',
      'deity', '=', QuilvynUtils.dictLit(rules.deityStats.weaponCategory) + '[source]'
    );
    rules.defineRule('deityWeaponDamage',
      'deity', '=', QuilvynUtils.dictLit(rules.deityStats.weaponDamage) + '[source]'
    );
    rules.defineRule('deityWeaponRank',
      'deityWeapon', '=', 'null', // recomputation trigger
      'rank.' + weapon, '=', 'dict.deityWeapon=="' + weapon + '" ? source : null'
    );
    rules.defineRule('trainingLevel.' + weapon,
      'combatNotes.cloisteredCleric', '^', 'source=="' + weapon + '" ? 2 : null',
      'combatNotes.deity', '^=', 'source=="' + weapon + '" ? 1 : null',
      'combatNotes.warpriest.1', '^', 'source=="' + weapon + '" ? 2 : null'
    );
    rules.defineRule('weaponDieSidesBonus.' + weapon,
      'deityWeapon', '=', 'null', // recomputation trigger
      'combatNotes.deificWeapon', '+=', 'dict.deityWeapon=="' + weapon + '" ? 2 : null',
      'combatNotes.deadlySimplicity', '+=', 'dict.deityWeapon=="' + weapon + '" ? 2 : null'
    );
  }
  rules.defineRule('trainingLevel.' + skill,
    'skillNotes.deity', '^=', 'source=="' + skill + '" ? 1 : null',
    'skillNotes.deityAndCause', '^=', 'source=="' + skill + '" ? 1 : null'
  );

  domains.forEach(d => {
    rules.addChoice('domains', d, '');
  });

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
  traits.forEach(t => {
    if(!(Pathfinder2E.featRules.traits.includes(t)))
      console.log('Bad trait "' + t + '" for feat ' + name);
  });

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
  });

};
Pathfinder2E.featRules.traits = [
  'Abjuration', 'Additive 1', 'Additive 2', 'Additive 3', 'Air', 'Alchemist',
  'Ancestry', 'Arcane', 'Archetype', 'Attack', 'Auditory', 'Aura', 'Barbarian',
  'Bard', 'Champion', 'Class', 'Cleric', 'Concentrate', 'Dedication',
  'Detection', 'Divination', 'Divine', 'Downtime', 'Druid', 'Dwarf', 'Elf',
  'Emotion', 'Evocation', 'Exploration', 'Fear', 'Fighter', 'Flourish',
  'Fortune', 'General', 'Gnome', 'Goblin', 'Half-Elf', 'Half-Orc', 'Halfling',
  'Healing', 'Human', 'Incapacitation', 'Magical', 'Manipulate', 'Mental',
  'Metamagic', 'Monk', 'Morph', 'Move', 'Multiclass', 'Necromancy', 'Negative',
  'Oath', 'Occult', 'Open', 'Orc', 'Polymorph', 'Positive', 'Press', 'Primal',
  'Rage', 'Ranger', 'Rogue', 'Secret', 'Skill', 'Sorcerer', 'Stance',
  'Transmutation', 'Uncommon', 'Visual', 'Wizard',
  // Core 2
  'Additive', 'Aiuvarin', 'Bravado', 'Catfolk', 'Changeling', 'Cold',
  'Concentration', 'Consecration', 'Cursebound', 'Death', 'Dhampir', 'Disease',
  'Dragonblood', 'Dromaar', 'Duskwalker', 'Earth', 'Finisher', 'Fire',
  'Hobgoblin', 'Illusion', 'Investigator', 'Kholo', 'Kobold', 'Leshy', 'Light',
  'Lineage', 'Linguistic', 'Lizardfolk', 'Misfortune', 'Nephilim', 'Oracle',
  'Poison', 'Prediction', 'Ratfolk', 'Revelation', 'Sonic', 'Spellshape',
  'Spirit', 'Swashbuckler', 'Teleportation', 'Tengu', 'Tripkee', 'Vitality',
  'Void', 'Water', 'Witch'
];

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Pathfinder2E.featRulesExtra = function(rules, name) {

  let matchInfo;
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if((matchInfo = name.match(/Additional Lore \((.*)\)/)) != null) {
    rules.defineRule('skillNotes.' + prefix,
      'level', '=', 'source<3 ? "Trained" : source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
    rules.defineRule('trainingLevel.' + matchInfo[1],
      'skillNotes.' + prefix, '^=', 'source=="Trained" ? 1 : source=="Expert" ? 2 : source=="Master" ? 3 : 4'
    );
  } else if(name.startsWith('Advanced Domain')) {
    rules.defineRule('features.Advanced Domain', 'features.' + name, '=', '1');
  } else if(name == 'Advanced Fury') {
    rules.defineRule
      ('featureNotes.advancedFury', 'feats.Advanced Fury', '=', null);
  } else if(name == 'Advanced School Spell') {
    let schools =
      rules.plugin.CLASSES.Wizard.match(/([\s\w]*:Arcane School)/g)
      .map(x => x.replace(':Arcane School', ''));
    schools.forEach(s => {
      rules.defineRule('features.Advanced School Spell (' + s + ')',
        'features.Advanced School Spell', '?', null,
        'features.' + s, '=', '1'
      );
    });
  } else if(name == 'Affliction Mercy') {
    rules.defineRule('magicNotes.mercy',
       'magicNotes.afflictionMercy', '=', 'null' // italics
    );
  } else if(name == 'Alchemist Dedication') {
    rules.defineRule
      ('advancedAlchemyLevel', 'featureNotes.alchemistDedication', '=', '1');
  } else if((matchInfo = name.match(/^(Arcane|Bloodline|Divine|Occult|Primal) Breadth$/)) != null) {
    let trad = matchInfo[1];
    let c = {'Arcane':'Wizard', 'Bloodline':'Sorcerer', 'Divine':'Cleric', 'Occult':'Bard', 'Primal':'Druid'}[trad];
    let note = 'magicNotes.' + trad.toLowerCase() + 'Breadth';
    rules.defineRule(note,
      'level', '?', null, // recomputation trigger
      'magicNotes.basic' + c + 'Spellcasting', '=', '1',
      'magicNotes.expert' + c + 'Spellcasting', '^', 'dict.level>=16 ? 4 : dict.level>=14 ? 3 : 2',
      'magicNotes.master' + c + 'Spellcasting', '^', 'dict.level>=20 ? 6 : 5'
    );
    if(c == 'Sorcerer') {
      ['A', 'D', 'O', 'P'].forEach(t => {
        rules.defineRule(note + '.' + t + '.1',
          'bloodlineTraditions', '?', 'source && source.includes("' + t + '")',
           note, '=', null
        );
        [1, 2, 3, 4, 5, 6].forEach(l => {
          rules.defineRule('spellSlots.' + t + l,
            note + '.' + t + '.1', '+', 'source>=' + l + ' ? 1 : null'
          );
        });
      });
    } else {
      let t = trad.charAt(0);
      [1, 2, 3, 4, 5, 6].forEach(l => {
        rules.defineRule
          ('spellSlots.' + t + l, note, '+', 'source>=' + l + ' ? 1 : null');
      });
    }
  } else if(name == 'Arcane School Spell') {
    let schools =
      Pathfinder2E.CLASSES.Wizard.match(/([\s\w]*:Arcane School)/g)
      .map(x => x.replace(':Arcane School', ''))
      .filter(x => x != 'Universalist');
    schools.forEach(s => {
      rules.defineRule('features.Arcane School Spell (' + s + ')',
        'features.Arcane School Spell', '?', null,
        'features.' + s, '=', '1'
      );
    });
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
  } else if(name == 'Aura Of Vengeance') {
    let allSelectables = rules.getChoices('selectableFeatures');
    let causes =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Cause)'))
      .map(x => x.replace('Champion - ', ''));
    causes.forEach(c => {
      rules.defineRule('features.Exalt', 'features.' + c, '=', '1');
    });
  } else if(name == 'Barbarian Dedication') {
    // Suppress validation errors for selected instinct
    let allSelectables = rules.getChoices('selectableFeatures');
    let instincts =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Barbarian (Instinct)'))
      .map(x => x.replace('Barbarian - ', ''));
    instincts.forEach(i => {
      let condensed = i.replaceAll(' ', '');
      rules.defineRule('validationNotes.barbarian-' + condensed + 'SelectableFeature',
        'featureNotes.barbarianDedication', '+', '1'
      );
    });
  } else if((matchInfo = name.match(/^([\w\s]+) Resiliency$/)) != null) {
    let c = matchInfo[1];
    rules.defineRule('combatNotes.' + c.toLowerCase() + 'Resiliency',
      'sumArchetypeFeats', '=', 'source * 3'
    );
  } else if(name == 'Bard Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.bardDedication', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Occult', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAbility.Occult',
      'magicNotes.bardDedication', '=', '"charisma"'
    );
    rules.defineRule('spellSlots.OC1', 'magicNotes.bardDedication', '+=', '2');
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
      'features.Bardic Lore', '=', '1',
      'rank.Occultism', '+', 'source>=4 ? 1 : null'
    );
  } else if((matchInfo = name.match(/^(Basic|Expert|Master) (\w+) Spellcasting$/)) != null) {
    let c = matchInfo[2];
    let level = matchInfo[1];
    let slots =
      level=='Basic' ? {'1':0, '2':6, '3':8} :
      level=='Expert' ? {'4':0, '5':14, '6':16} : {'7':0, '8':20};
    let trad =
      (QuilvynUtils.getAttrValue(Pathfinder2E.CLASSES[c], 'SpellSlots') || 'A').charAt(0);
    let note =
      'magicNotes.' + level.toLowerCase() + c.replaceAll(' ', '') + 'Spellcasting';
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
  } else if((matchInfo = name.match(/^Canny Acumen \((.*)\)$/)) != null) {
    let target = matchInfo[1];
    let note =
      (target == 'Perception' ? 'skill' : 'save') + 'Notes.cannyAcumen(' + target + ')';
    rules.defineRule(note, 'level', '=', 'source<17 ? "Expert" : "Master"');
    rules.defineRule
      ('trainingLevel.' + target, note, '^=', 'source=="Expert" ? 2 : 3');
  } else if(name == 'Champion Dedication') {
    // Suppress validation errors for selected cause and key ability and the
    // cause and deity notes that don't come with Champion Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Key Ability)'))
      .map(x => x.replace('Champion - ', ''));
    abilities.forEach(a => {
      rules.defineRule('validationNotes.champion-' + a + 'SelectableFeature',
        'features.Champion Dedication', '+', '1'
      );
    });
    let causes =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Cause)'))
      .map(x => x.replace('Champion - ', ''));
    causes.forEach(c => {
      let condensed = c.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.champion-' + condensed + 'SelectableFeature',
        'featureNotes.championDedication', '+', '1'
      );
      rules.defineRule('magicNotes.' + noteName, 'levels.Champion', '?', null);
    });
  } else if(name == "Champion's Reaction") {
    // Extend test rules to allow characters with the Champion's Reaction
    // archetype feature to acquire Champion Reactions.
    // NOTE: Because this code is run only when the feat is processed, any
    // homebrew Reactions will still generate validation errors if selected by
    // a non-champion.
    let allSelectables = rules.getChoices('selectableFeatures');
    let causes =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Cause)'))
      .map(x => x.replace('Champion - ', ''));
    let reactions =
      QuilvynUtils.getAttrValueArray
        (rules.getChoices('levels').Champion, 'Features')
        .filter(x => x.match(new RegExp('features.(' + causes.join('|') + ')\\s*\\?\\s*(1:)?[A-Z]')))
        .map(x => x.replace(/^.*\?\s*(1:)?/, ''));
    reactions.forEach(r => {
      rules.defineRule
        ('championFeatures.' + r, "featureNotes.champion'sReaction", '=', '1');
      rules.defineRule('testNotes.championFeatures.' + r,
        "featureNotes.champion'sReaction", '=', '-1'
      );
    });
  } else if(name == 'Cleric Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.clericDedication', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Divine', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAbility.Divine',
      'magicNotes.clericDedication', '=', '"wisdom"'
    );
    rules.defineRule
      ('spellSlots.DC1', 'magicNotes.clericDedication', '+=', '2');
    // Suppress the deity notes that don't come with Cleric Dedication
    rules.defineRule('combatNotes.deity', 'levels.Cleric', '?', null);
    rules.defineRule('magicNotes.deity', 'levels.Cleric', '?', null);
  } else if(name == 'Crane Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Crane Wing', 'Unarmed', 0, '1d6 B', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Nonlethal', 'Unarmed'], null
    );
    rules.defineRule('weapons.Crane Wing', 'features.Crane Stance', '=', '1');
  } else if(name == 'Divine Ally') {
    // Suppress validation errors for selected ally
    let allSelectables = rules.getChoices('selectableFeatures');
    let allies =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Divine Ally)'))
      .map(x => x.replace('Champion - ', ''));
    allies.forEach(a => {
      rules.defineRule('validationNotes.champion-' + a.replaceAll(' ', '') + 'SelectableFeature',
        'feats.Divine Ally', '+', '1'
      );
    });
  } else if(name.startsWith('Domain Initiate')) {
    rules.defineRule('features.Domain Initiate', 'features.' + name, '=', '1');
  } else if(name == 'Dragon Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Dragon Tail', 'Unarmed', 0, '1d10 B', 0, 0, 'Brawling',
      ['Backswing', 'Nonlethal', 'Unarmed'], null
    );
    rules.defineRule('weapons.Dragon Tail', 'features.Dragon Stance', '=', '1');
  } else if(name == 'Druid Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.druidDedication', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Primal', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAbility.Primal',
      'magicNotes.druidDedication', '=', '"wisdom"'
    );
    rules.defineRule('spellSlots.PC1', 'magicNotes.druidDedication', '+=', '2');
    // Suppress validation errors for selected order and the notes for features
    // of Druidic Order that don't come with Druid Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let orders =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Druid (Order)'))
      .map(x => x.replace('Druid - ', ''));
    orders.forEach(o => {
      let condensed = o.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.druid-' + condensed + 'SelectableFeature',
        'featureNotes.druidDedication', '+', '1'
      );
      rules.defineRule('featureNotes.' + noteName, 'levels.Druid', '?', null);
      rules.defineRule('magicNotes.' + noteName, 'levels.Druid', '?', null);
    });
    rules.defineRule('magicNotes.druidicOrder', 'levels.Druid', '?', null);
  } else if(name.match(/(Dwarven|Elven|Gnome|Goblin|Halfling|Orc) Weapon Expertise/)) {
    let note =
      'combatNotes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
    rules.defineRule(note,
      'maxWeaponTraining', '=', 'source<2 ? null : source==2 ? "Expert" : source==3 ? "Master" : "Legendary"'
    );
  } else if(name == 'Elf Atavism') {
    rules.defineRule('selectableFeatureCount.Elf (Heritage)',
      'featureNotes.elfAtavism', '=', '1'
    );
    // Suppress validation errors for selected half-elf heritages
    let allSelectables = rules.getChoices('selectableFeatures');
    let elfHeritages =
      Object.keys(allSelectables)
      .filter(x => x.includes('Elf -'))
      .map(x => x.replace('Elf - ', ''));
    elfHeritages.forEach(h => {
      rules.defineRule('validationNotes.elf-' + h.replaceAll(' ', '') + 'SelectableFeature',
        'featureNotes.elfAtavism', '+', '1'
      );
    });
  } else if(name == 'Enduring Alchemy') {
    rules.defineRule('skillNotes.quickAlchemy',
      'skillNotes.enduringAlchemy', '=', 'null' // italics
    );
  } else if(name == 'Expert Alchemy') {
    rules.defineRule
      ('advancedAlchemyLevel', 'featureNotes.expertAlchemy', '^', null);
    rules.defineRule
      ('featureNotes.expertAlchemy', 'level', '=', 'source>=10 ? 5 : 3');
  } else if(name == 'Extend Armament Alignment') {
    rules.defineRule('combatNotes.alignArmament(Chaotic)',
      'combatNotes.extendArmamentAlignment', '=', 'null' // italics
    );
    rules.defineRule('features.Align Armament',
      'features.Align Armament (Chaotic)', '=', '1',
      'features.Align Armament (Evil)', '=', '1',
      'features.Align Armament (Good)', '=', '1',
      'features.Align Armament (Lawful)', '=', '1'
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
  } else if(name.startsWith('Favored Terrain')) {
    rules.defineRule('features.Favored Terrain', 'features.' + name, '=', '1');
    if(name.match(/Arctic|Desert/))
      rules.defineRule
        ('featureNotes.' + prefix, 'features.Wild Stride', '?', null);
    else if(name.includes('Plains'))
      rules.defineRule
        ('abilityNotes.' + prefix + '-1', 'features.Wild Stride', '=', '10');
  } else if(name == 'Fighter Dedication') {
    // Suppress validation errors for selected key ability
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Fighter (Key Ability)'))
      .map(x => x.replace('Fighter - ', ''));
    abilities.forEach(a => {
      rules.defineRule('validationNotes.fighter-' + a + 'SelectableFeature',
        'features.Fighter Dedication', '+', '1'
      );
    });
    rules.defineRule
      ('features.Fighter Key Ability', 'features.Fighter Dedication', '=', '1');
  } else if(name == 'Gnome Obsession') {
    rules.defineRule('skillNotes.gnomeObsession',
      'level', '=', 'source<2 ? "Trained" : source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
  } else if(name.match(/^(Greater|True) Debilitating Bomb/)) {
    rules.defineRule('combatNotes.debilitatingBomb',
      'combatNotes.' + prefix, '=', 'null' // italics
    );
  } else if(name == 'Greater Mercy') {
    rules.defineRule
      ('magicNotes.mercy', 'magicNotes.greaterMercy', '=', 'null'); // italics
  } else if(name == 'Harming Hands') {
    rules.defineRule('harmSpellDie', 'magicNotes.harmingHands', '^', '10');
  } else if(name == 'Healing Hands') {
    rules.defineRule('healSpellDie', 'magicNotes.healingHands', '^', '10');
  } else if(name == "Hierophant's Power") {
    rules.defineRule
      ('spellSlots.P10', "magicNotes.hierophant'sPower", '+', '1');
  } else if(name == 'Instinct Ability') {
    // Extend test rules to allow characters with the Instinct Ability
    // archetype feature to acquire barbarian instinct abilities.
    // NOTE: Because this code is run only when the feat is processed, any
    // homebrew instincts will still generate validation errors if selected by
    // a non-barbarian.
    let instinctAbilities =
      QuilvynUtils.getAttrValueArray
        (rules.getChoices('levels').Barbarian, 'Features')
        .filter(x => x.match(/Instinct\s*(\(.*\)\s*)?\?\s*[A-Z1]/))
        .map(x => x.replace(/^.*\?\s*(1:)?/, ''))
        .filter(x => x != 'Anathema');
    instinctAbilities.forEach(ia => {
      rules.defineRule
        ('barbarianFeatures.' + ia, 'featureNotes.instinctAbility', '=', '1');
      rules.defineRule('testNotes.barbarianFeatures.' + ia,
        'featureNotes.instinctAbility', '=', '-1'
      );
    });
  } else if(name == 'Interweave Dispel') {
    rules.defineRule('knowsDispelMagicSpell',
      'spells.Dispel Magic (A2 Abj)', '=', '1',
      'spells.Dispel Magic (D2 Abj)', '=', '1',
      'spells.Dispel Magic (O2 Abj)', '=', '1',
      'spells.Dispel Magic (P2 Abj)', '=', '1'
    );
  } else if(name == 'Ironblood Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Iron Sweep', 'Unarmed', 0, '1d8 B', 0, 0, 'Brawling',
      ['Nonlethal', 'Parry', 'Sweep', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Iron Sweep', 'features.Ironblood Stance', '=', '1');
  } else if(name == 'Ironblood Surge') {
    rules.defineRule('combatNotes.ironbloodStance',
      'combatNotes.ironbloodSurge', '=', 'null' // italics
    );
  } else if(name == 'Ki Rush') {
    rules.defineRule('features.Ki Spells', 'features.Ki Rush', '=', '1');
  } else if(name == 'Ki Strike') {
    rules.defineRule('features.Ki Spells', 'features.Ki Strike', '=', '1');
  } else if(name == 'Master Alchemy') {
    rules.defineRule
      ('advancedAlchemyLevel', 'featureNotes.masterAlchemy', '^', null);
    rules.defineRule
      ('featureNotes.masterAlchemy', 'level', '=', 'source - 5');
  } else if(name == 'Master Monster Hunter') {
    rules.defineRule('combatNotes.monsterHunter',
      'combatNotes.masterMonsterHunter', '=', 'null' // italics
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
    rules.defineRule('spellAbility.' + trad, note, '=', '"charisma"');
    rules.defineRule('spellSlots.' + trad.charAt(0) + '0', note, '+=', '2');
  } else if(name == 'Monk Dedication') {
    // Suppress validation errors for selected key ability
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Monk (Key Ability)'))
      .map(x => x.replace('Monk - ', ''));
    abilities.forEach(a => {
      rules.defineRule('validationNotes.monk-' + a + 'SelectableFeature',
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
  } else if(name == 'Mountain Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Falling Stone', 'Unarmed', 0, '1d8 B', 0, 0, 'Brawling',
      ['Forceful', 'Nonlethal', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Falling Stone', 'features.Mountain Stance', '=', '1');
  } else if(name.match(/^Multifarious Muse/)) {
    let muse = name.replace('Multifarious Muse (', '').replace(')', '');
    rules.defineRule
      ('features.Multifarious Muse', 'features.' + name, '=', '1');
    rules.defineRule('has' + muse + 'Muse',
      'features.' + muse, '=', '1',
      'features.' + name, '=', '1'
    );
  } else if(name == 'Multilingual') {
    rules.defineRule('skillNotes.multilingual',
      'rank.Society', '=', 'source<2 ? 2 : source',
      'feats.Multilingual', '*', null
    );
  } else if(name == 'Multitalented') {
    rules.defineRule('multiclassAbilityRequirementsWaived',
      'features.Multitalented', '?', null,
      'features.Half-Elf', '=', '1'
    );
  } else if(name == 'Orc Ferocity') {
    rules.defineRule('combatNotes.orcFerocity',
      'combatNotes.incredibleFerocity', '=', 'null' // italics
    );
  } else if(name.match(/^Order Explorer/)) {
    let order = name.replace('Order Explorer (', '').replace(')', '');
    rules.defineRule('features.Order Explorer', 'features.' + name, '=', '1');
    rules.defineRule('in' + order + 'Order',
      'features.' + order, '=', '1',
      'features.' + name, '=', '1'
    );
  } else if(name == 'Order Spell') {
    let allSelectables = rules.getChoices('selectableFeatures');
    let orders =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Druid (Order)'))
      .map(x => x.replace('Druid - ', ''));
    orders.forEach(o => {
      rules.defineRule('features.Order Spell (' + o + ')',
        'features.Order Spell', '?', null,
        'features.' + o, '=', '1'
      );
    });
  } else if(name.match(/^Radiant Blade (Master|Spirit)$/)) {
    rules.defineRule('combatNotes.bladeAlly',
      'combatNotes.' + prefix, '=', 'null' // italics
    );
  } else if(name == 'Ranger Dedication') {
    // Suppress validation errors for selected key ability
    let allSelectables = rules.getChoices('selectableFeatures');
    let abilities =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Ranger (Key Ability)'))
      .map(x => x.replace('Ranger - ', ''));
    abilities.forEach(a => {
      rules.defineRule('validationNotes.ranger-' + a + 'SelectableFeature',
        'features.Ranger Dedication', '+', '1'
      );
    });
    rules.defineRule
      ('features.Ranger Key Ability', 'features.Ranger Dedication', '=', '1');
  } else if(name == 'Rogue Dedication') {
    // NOTE: key ability for Rogue Dedication is always Dexterity--no racket.
    rules.defineRule('classDifficultyClass.Rogue',
      'features.Rogue Dedication', '+', '10 + dict["dexterityModifier"]'
    );
    rules.defineRule('classDifficultyClass.Rogue.1',
      'features.Rogue Dedication', '=', '"dexterity"'
    );
  } else if(name == 'Skittering Scuttle') {
    rules.defineRule('combatNotes.goblinScuttle',
      'combatNotes.skitteringScuttle', '=', 'null' // italics
    );
  } else if(name == 'Sorcerer Dedication') {
    rules.defineRule('bloodlineTraditions',
      'feats.' + name, '=', 'Pathfinder2E.bloodlineTraditions = ""'
    );
    rules.defineRule
      ('magicNotes.sorcererDedication', 'bloodlineTraditions', '=', null);
    rules.defineRule('magicNotes.sorcererDedication.1',
      'bloodlineTraditionsLowered', '=', null
    );
    ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
      rules.defineRule('trainingLevel.' + t,
        'magicNotes.sorcererDedication', '^=', 'source.includes("' + t + '") ? 1 : null'
      );
      rules.defineRule('spellSlots.' + t.charAt(0) + '0',
        'magicNotes.sorcererDedication', '+=', 'source.includes("' + t + '") ? 2 : null'
      );
      rules.defineRule('spellModifier' + t + '.' + name,
        'features.Sorcerer Dedication', '?', null,
        'bloodlineTraditions', '?', 'source && source.includes("' + t + '")',
        'charismaModifier', '=', null
      );
      rules.defineRule
        ('spellModifier.' + t, 'spellModifier' + t + '.' + name, '=', null);
      rules.defineRule('spellAbility.' + t,
        'spellModifier' + t + '.' + name, '=', '"charisma"'
      );
    });
    // Suppress validation errors for selected bloodlines and the notes for
    // features of bloodlines that don't come with Sorcerer Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let bloodlines =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Bloodline'))
      .map(x => x.replace('Sorcerer - ', ''));
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
  } else if(name == 'Tangled Forest Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Lashing Branch', 'Unarmed', 0, '1d8 S', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Nonlethal', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Lashing Branch', 'features.Tangled Forest Stance', '=', '1');
  } else if(name == 'Tiger Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Tiger Claw', 'Unarmed', 0, '1d8 S', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Nonlethal', 'Unarmed'], null
    );
    rules.defineRule('weapons.Tiger Claw', 'features.Tiger Stance', '=', '1');
  } else if(name == 'Ubiquitous Snares') {
    rules.defineRule('skillNotes.snareSpecialist',
      'skillNotes.ubiquitousSnares', '=', 'null' // italics
    );
  } else if(name == 'Unburdened Iron') {
    rules.defineRule('abilityNotes.armorSpeedPenalty',
      'abilityNotes.unburdenedIron', '^', '0'
    );
  } else if(name == 'Uncanny Bombs') {
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons) {
      if(allWeapons[w].includes('Bomb'))
        rules.defineRule('weaponRangeAdjustment.' + w,
          'combatNotes.uncannyBombs', '^=', '40'
        );
    }
  } else if((matchInfo = name.match(/^Unconventional Weaponry \((.*)\)$/)) != null) {
    let weapon = matchInfo[1];
    rules.defineRule('features.Unconventional Expertise (' + weapon + ')',
      'features.Unconventional Expertise', '?', null,
      'features.' + name, '=', '1'
    );
    rules.defineRule('combatNotes.unconventionalExpertise(' + weapon.replaceAll(' ', '') + ')',
      'features.Unconventional Expertise (' + weapon + ')', '?', null,
      'maxWeaponTraining', '=', 'source<2 ? null : source==2 ? "Expert" : source==3 ? "Master" : "Legendary"'
    );
    rules.defineRule
      ('features.Unconventional Weaponry', 'features.' + name, '=', '1');
  } else if(name == 'Wizard Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.wizardDedication', '?', null,
      'intelligenceModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Arcane', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAbility.Arcane',
      'magicNotes.wizardDedication', '=', '"intelligence"'
    );
    rules.defineRule
      ('spellSlots.AC1', 'magicNotes.wizardDedication', '+=', '2');
    // Suppress validation errors for selected school and the notes for
    // features of the school that don't come with Wizard Dedication
    let allSelectables = rules.getChoices('selectableFeatures');
    let schools =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Wizard (Arcane School)'))
      .map(x => x.replace('Wizard - ', ''))
      .filter(x => x != 'Universalist');
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
  } else if(name == 'Wolf Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Wolf Jaw', 'Unarmed', 0, '1d8 P', 0, 0, 'Brawling',
      ['Agile', 'Backstabber', 'Finesse', 'Nonlethal', 'Unarmed'], null
    );
    rules.defineRule('weapons.Wolf Jaw', 'features.Wolf Stance', '=', '1');
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
  sections.forEach(s => {
    if(!(s.match(/^(ability|combat|feature|magic|save|skill)$/i))) {
      console.log('Bad section "' + s + '" for feature ' + name);
      return;
    }
  });
  if(!Array.isArray(notes)) {
    console.log('Bad notes list "' + notes + '" for feature ' + name);
    return;
  }
  if(sections.length != notes.length) {
    console.log(sections.length + ' sections, ' + notes.length + ' notes for feature ' + name);
    return;
  }
  if(action != null && !(action+'').match(/^(1|2|3|Free|Reaction|None)$/)) {
    console.log('Bad action "' + action + '" for feature ' + name);
    return;
  }

  notes = notes.map(x => QuilvynRules.wrapVarsContainingSpace(x));

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  for(let i = 0; i < sections.length; i++) {

    let section = sections[i].toLowerCase();
    let effects = notes[i];
    let matchInfo;
    let maxSubnote =
      effects.includes('%1') ? +effects.match(/%\d/g).sort().pop().replace('%', '') :
      effects.includes('%V') ? 0 : -1;
    let note = section + 'Notes.' + prefix;
    let priorInSection =
      sections.slice(0, i).filter(x => x.toLowerCase() == section).length;
    if(priorInSection > 0)
      note += '-' + priorInSection;

    let noteText =
      (action in Pathfinder2E.ACTION_MARKS ? Pathfinder2E.ACTION_MARKS[action] + ' ' : '') + effects;
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
          adjusted = 'skillModifiers.' + adjusted;
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
          matchInfo[2] == '%V' ? '(source=="Trained" ? 1 : source=="Expert" ? 2 : source=="Master" ? 3 : 4)' : matchInfo[2] == 'Trained' ? 1 : matchInfo[2] == 'Expert' ? 2 : matchInfo[2] == 'Master' ? 3 : 4;
        let choices = '';
        matchInfo[3].split(/;\s*/).forEach(element => {
          let m = element.match(/Choose (\d+|%V)/);
          if(m)
            choices += '+' + (m[1] == '%V' ? 'source' : m[1]);
          else if(!element.startsWith('%')) {
            rules.defineRule('trainingLevel.' + element, note, '^=', rank);
            rules.defineRule('trainingCount.' + element, note, '+=', '1');
          }
        });
        if(choices) {
          choices = choices.replace('+', '');
          let choiceCount =
            rank == 1 ? choices :
            choices == '1' ? rank :
            choices.includes('+') ? '(' + choices + ') * ' + rank :
            (choices + ' * ' + rank);
          rules.defineRule('choiceCount.' + group, note, '+=', choiceCount);
        }
      }
      matchInfo = n.match(/Perception\s(Expert|Legendary|Master|Trained)$/i);
      if(matchInfo) {
        let rank =
          matchInfo[1] == 'Trained' ? 1 : matchInfo[1] == 'Expert' ? 2 : matchInfo[1] == 'Master' ? 3 : 4;
        rules.defineRule('trainingLevel.Perception', note, '^=', rank);
      }
      matchInfo = n.match(/(Ability|Attribute|Skill)\s(Boost|Flaw|Increase)\s*\(([^\)]*)\)$/i);
      if(matchInfo) {
        let flaw = matchInfo[2].match(/flaw/i);
        let choices = '';
        matchInfo[3].split(/;\s*/).forEach(element => {
          let m = element.match(/Choose (\d+|%V)/);
          if(m)
            choices += '+' + (m[1] == '%V' ? 'source' : m[1]);
          else if(matchInfo[1] == 'Skill')
            rules.defineRule('skillIncreases.' + element, note, '+=', '1');
          else
            rules.defineRule('fixedBoosts.' + element.toLowerCase(),
              note, '+=', flaw ? '-1' : '1'
            );
        });
        if(choices)
          rules.defineRule('choiceCount.' + matchInfo[1],
            note, '+=', choices.replace('+', '')
          );
      }
      matchInfo = n.match(/Weapon\sFamiliarity\s*\(([^\)]*)\)/i);
      if(matchInfo) {
        matchInfo[1].split(/;\s*/).forEach(element => {
          rules.defineRule('weaponFamiliarity.' + element, note, '=', '1');
        });
      }
      matchInfo = n.match(/^Has\s+the\s+(.*)\s+features?$/);
      if(matchInfo) {
        let features = matchInfo[1].split(/\s*,\s*|\s*\band\s+/);
        features.forEach(f => {
          f = f.trim();
          if(f != '')
            rules.defineRule('features.' + f, note, '=', '1');
        });
      }
      matchInfo = n.match(/^Knows\s+the\s+(.*)\s+(arcane|divine|occult|primal)\s+(innate\s)?(cantrip|hex|spell)s?($|;)/);
      if(matchInfo) {
        let spells = matchInfo[1].split(/\s*,\s*|\s*\band\s+/);
        spells.forEach(s => {
          s = s.replace('<i>', '').replace('</i>', '').trim();
          if(s == '') {
            // empty
          // TODO this is ugly...
          } else if(!(s in Object.assign({}, Pathfinder2E.SPELLS, rules.plugin.SPELLS))) {
            console.log('Unknown spell "' + s + '" for feature ' + name);
          } else {
            // TODO ... and so is this
            let spellAttrs =
              Object.assign({}, Pathfinder2E.SPELLS, rules.plugin.SPELLS)[s];
            let spellLevel = QuilvynUtils.getAttrValue(spellAttrs, 'Level');
            let spellSchool = QuilvynUtils.getAttrValue(spellAttrs, 'School');
            let spellTraits =
              QuilvynUtils.getAttrValueArray(spellAttrs, 'Traits');
            let spellTrad =
              matchInfo[2].charAt(0).toUpperCase() + matchInfo[2].substring(1);
            let isCantrip = spellTraits.includes('Cantrip');
            let isFocus = spellTraits.includes('Focus');
            let spellName =
              s + ' (' + spellTrad.charAt(0) + (isCantrip ? 'C' : '') + spellLevel + (isFocus ? ' Foc' : '') + (spellSchool ? ' ' + spellSchool.substring(0, 3) : '') + ')';
            rules.defineRule('spells.' + spellName, note, '=', '1');
            Pathfinder2E.spellRules(rules, spellName,
              spellSchool,
              spellLevel,
              spellTrad,
              QuilvynUtils.getAttrValue(spellAttrs, 'Cast'),
              QuilvynUtils.getAttrValueArray(spellAttrs, 'Traits'),
              QuilvynUtils.getAttrValue(spellAttrs, 'Description').replaceAll('%tradition', spellTrad)
            );
          }
        });
      }
      matchInfo = n.match(/\s(arcane|divine|occult|primal)\s/);
      if(matchInfo && n.match(/innate (cantrip|hex|spell)/)) {
        let trad =
          matchInfo[1].charAt(0).toUpperCase() + matchInfo[1].substring(1);
        rules.defineRule('rank.' + trad + ' Innate',
          'features.' + name, '=', '1',
          'rank.' + trad, '^', null
        );
      }
      matchInfo = n.match(/Spell Trained \((.*)\)/);
      if(matchInfo && ((rules.getChoices('levels') || {}).Sorcerer || '').includes(name + ':Bloodline')) {
        let trad = matchInfo[1];
        rules.defineRule('sorcerer' + trad + 'Level',
          'bloodlineTraditions', '?', 'source && source.includes("' + trad + '")',
          'levels.Sorcerer', '=', null
        );
        rules.defineRule('bloodlineTraditions',
          'features.' + name, '=', 'Pathfinder2E.bloodlineTraditions = !Pathfinder2E.bloodlineTraditions ? "' + trad + '" : !Pathfinder2E.bloodlineTraditions.includes("' + trad + '") ? Pathfinder2E.bloodlineTraditions + "; ' + trad + '" : Pathfinder2E.bloodlineTraditions'
        );
        rules.defineRule('features.Advanced Bloodline (' + name + ')',
          'features.Advanced Bloodline', '?', null,
          'features.' + name, '=', '1'
        );
        rules.defineRule('features.Basic Bloodline Spell (' + name + ')',
          'features.Basic Bloodline Spell', '?', null,
          'features.' + name, '=', '1'
        );
        rules.defineRule('features.Greater Bloodline (' + name + ')',
          'features.Greater Bloodline', '?', null,
          'features.' + name, '=', '1'
        );
      }
      matchInfo = n.match(/^Has a focus pool( and (at least |\+)?(\d|%V) Focus Points?)?/);
      if(matchInfo) {
        rules.defineRule('features.Focus Pool', note, '=', '1');
        if(matchInfo[1])
          rules.defineRule('focusPoints',
            note, matchInfo[2] == 'at least ' ? '^' : '+', matchInfo[3]=='%V' ? 'source' : matchInfo[3]
          );
      }
      matchInfo = n.match(/^Can take (.*) ancestry feats$/);
      if(matchInfo) {
        // TODO What about a character that has both, e.g., Changeling and
        // Adopted Ancestry?
        rules.defineRule
          ('addedAncestry', 'features.' + name, '=', '"' + matchInfo[1] + '"');
      }
      if(n.match(/^Can learn spells from the .* tradition$/))
        rules.defineRule('features.Spellcasting', 'features.' + name, '=', '1');
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
 * Defines in #rules# the rules associated with shield #name#, which costs
 * #price# gold pieces, adds #ac# to the character's armor class, reduces the
 * character's speed by #speed#, weighs #bulk#, has hardness #hardness#, and
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
  rules.defineRule('shieldHitPoints',
    'shield', '=', QuilvynUtils.dictLit(rules.shieldStats.hp) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.) that belongs to
 * subcategory #subcategory#.
 */
Pathfinder2E.skillRules = function(rules, name, ability, subcategory) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(typeof(ability) != 'string' ||
     !(ability.toLowerCase() in Pathfinder2E.ABILITIES)) {
    console.log('Bad ability "' + ability + '" for skill ' + name);
    return;
  }
  if(subcategory && typeof(subcategory) != 'string') {
    console.log('Bad subcategory "' + subcategory + '" for skill ' + name);
    return;
  }

  ability = ability.toLowerCase();
  rules.defineChoice
    ('notes', 'skillModifiers.' + name + ':%S (' + ability + '; %1)');
  if(name.match(/Lore$/)) {
    rules.defineRule
      ('trainingLevel.' + name, 'skillIncreases.' + name, '^=', '0');
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
    'trainingLevel.' + name, '=', 'source > 0 ? 0 : null',
    'skillIncreases.' + name, '=', 'source > 0 ? 0 : null',
    'skillNotes.eclecticSkill', '=', '0',
    'skillNotes.untrainedImprovisation', '^=', 'dict.level<7 ? Math.floor(-dict.level / 2) : 0',
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

  if(name.endsWith(' Lore'))
    rules.addChoice('lores', name, '');
  if(subcategory == 'Terrain Lore')
    rules.addChoice('terrains', name.replace(' Lore', ''), '');

};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #tradition# and #level# are used to compute any
 * saving throw value required by the spell. #cast# gives the casting actions
 * or time required to cast the spell, #traits# lists any traits the spell has,
 * and #description# is a verbose description of the spell's effects.
 */
Pathfinder2E.spellRules = function(
  rules, name, school, level, tradition, cast, traits, description
) {
  if(!name) {
    console.log('Empty spell name');
    return;
  }
  let wizard =
    (rules.getChoices('levels') || {}).Wizard || Pathfinder2E.CLASSES.Wizard;
  let schools =
    wizard.match(/[\w\s]*:Arcane School/g).map(x => x.replace(':Arcane School', ''));
  if(school && !(schools.includes(school))) {
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
  if(!Array.isArray(traits)) {
    console.log('Bad traits "' + traits + '" for spell ' + name);
    return;
  }
  traits.forEach(t => {
    if(!(Pathfinder2E.spellRules.traits.includes(t)))
      console.log('Bad trait "' + t + '" for spell ' + name);
  });
  if(typeof(description) != 'string') {
    console.log('Bad description "' + description + '" for spell ' + name);
    return;
  }
  let action =
    cast in Pathfinder2E.ACTION_MARKS ?
      Pathfinder2E.ACTION_MARKS[cast] :
      ('<b>(' + cast + ')</b>');
  rules.defineChoice
    ('notes', 'spells.' + name + ':' + action + ' ' + description);
  if(description.includes('harmSpellDie'))
    rules.defineRule('harmSpellDie', 'spells.' + name, '=', '8');
  if(description.includes('healSpellDie'))
    rules.defineRule('healSpellDie', 'spells.' + name, '=', '8');

};
Pathfinder2E.spellRules.traits = [
  'Abjuration', 'Acid', 'Air', 'Attack', 'Auditory', 'Aura', 'Cantrip',
  'Chaotic', 'Cold', 'Conjuration', 'Consecration', 'Curse', 'Darkness',
  'Death', 'Detection', 'Disease', 'Divination', 'Earth', 'Electricity',
  'Emotion', 'Enchantment', 'Evil', 'Evocation', 'Extradimensional', 'Fear',
  'Fire', 'Focus', 'Force', 'Fortune', 'Good', 'Healing', 'Illusion',
  'Incapacitation', 'Light', 'Linguistic', 'Mental', 'Misfortune', 'Morph',
  'Move', 'Necromancy', 'Negative', 'Nonlethal', 'Olfactory', 'Plant',
  'Poison', 'Polymorph', 'Positive', 'Possession', 'Prediction', 'Rare',
  'Revelation', 'Scrying', 'Shadow', 'Sleep', 'Sonic', 'Teleportation',
  'Transmutation', 'Uncommon', 'Veil', 'Visual', 'Water',
  // Focus
  'Bard', 'Composition', 'Metamagic', 'Champion', 'Litany', 'Cleric', 'Druid',
  'Monk', 'Stance', 'Sorcerer', 'Wizard', 'Arcane', 'Concentrate',
  // Renewed
  'Hex', 'Holy', 'Manipulate', 'Metal', 'Ranger', 'Sanctified', 'Spellshape',
  'Spirit', 'Subtle', 'Summon', 'Unholy', 'Vitality', 'Void', 'Witch', 'Wood'
];

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
  let matchInfo = (damage + '').match(/^(\d(d\d+)?)( ([BEPS]))?$/);
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
  if(!(group+'').match(/^(Axe|Bomb|Bow|Brawling|Club|Crossbow|Dart|Flail|Hammer|Knife|Pick|Polearm|Sling|Shield|Spear|Sword)$/)) {
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
  let isRanged = group.match(/Bomb|Bow|Crossbow|Dart|Sling/);
  let isPropulsive = traits.includes('Propulsive');
  let isSplash = traits.includes('Splash');
  let isThrown = traits.includes('Thrown');
  let specialDamage =
    traits.filter(x => x.match(/Two-hand/)).map(x => x.replace('Two-hand', '2h')).concat(
    traits.filter(x => x.match(/Deadly/)).map(x => x.replace('Deadly ', 'Crit +'))).concat(
    traits.filter(x => x.match(/Fatal/)).map(x => x.replace('Fatal', 'Crit')));

  group =
    group == 'Knife' ? 'Knives' :
    group == 'Brawling' ? 'Brawling Weapons' :(group + 's');
  let categoryAndGroup = category + ' ' + group;
  category = category != 'Unarmed' ? category + ' Weapons' : 'Unarmed Attacks';
  let lowerCategory =
    category == 'Advanced Weapons' ? 'Martial Weapons' : 'Simple Weapons';
  damage = matchInfo[1];
  let damageType = matchInfo[4];
  traits.forEach(t => {
    if(t.match(/^Versatile [BPS]$/))
      damageType += '/' + t.charAt(t.length - 1);
  });

  let weaponName = 'weapons.' + name;
  let format = '%V (%1 %2%3 %4%5' + (range ? " R%8'" : '') + '; %6; %7)';

  rules.defineChoice('notes', weaponName + ':' + format);
  rules.defineRule('rank.' + categoryAndGroup,
    'trainingLevel.' + categoryAndGroup, '=', null
  );
  rules.defineRule('rank.' + category, 'trainingLevel.' + category, '=', null);
  rules.defineRule('rank.' + name, 'trainingLevel.' + name, '=', null);
  rules.defineRule('maxWeaponTraining',
    'trainingLevel.' + category, '^=', null,
    'trainingLevel.' + categoryAndGroup, '^=', null,
    'trainingLevel.' + name, '^=', null
  );
  rules.defineRule('weaponRank.' + name,
    weaponName, '?', null,
    'rank.' + category, '=', null,
    'rank.' + categoryAndGroup, '^=', null,
    'rank.' + name, '^=', null,
    'weaponFamiliarity.' + group, '^=', 'dict["rank.' + lowerCategory + '"]',
    'weaponFamiliarity.' + name, '^=', 'dict["rank.' + lowerCategory + '"]'
  );
  if(group == 'Bombs') {
    rules.defineRule
      ('maxWeaponTraining', 'trainingLevel.Alchemical Bombs', '^=', null);
    rules.defineRule
      ('rank.Alchemical Bombs', 'trainingLevel.Alchemical Bombs', '=', null);
    rules.defineRule('weaponRank.' + name, 'rank.Alchemical Bombs', '^=', null);
  }
  traits.forEach(t => {
    t += ' Weapons';
    rules.defineRule('weaponRank.' + name,
      'trainingLevel.' + t, '^=', null,
      'weaponFamiliarity.' + t, '^=', 'dict["rank.' + lowerCategory + '"]'
    );
  });
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

  rules.defineRule('weaponAttackAdjustment.' + name, weaponName, '=', '0');
  rules.defineRule('weaponDamageAdjustment.' + name, weaponName, '=', '0');
  rules.defineRule('attackBonus.' + name,
    weaponName, '=', '0',
    isRanged ? 'combatNotes.dexterityAttackAdjustment' :
               'combatNotes.strengthAttackAdjustment', '+', null,
    'proficiencyBonus.' + name, '+', null,
    'weaponAttackAdjustment.' + name, '+', null
  );
  if(isFinesse)
    rules.defineRule('attackBonus.' + name, 'finesseAttackBonus', '+', null);
  rules.defineRule('damageBonus.' + name,
    weaponName, '=', '0',
    'weaponDamageAdjustment.' + name, '+', null
  );
  rules.defineRule('weaponDieSides.' + name,
    weaponName, '=', damage.replace(/^\d(d)?/, '') || '""',
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
  if(isFinesse)
    rules.defineRule('damageBonus.' + name, 'combatNotes.thief', '+', null);

  rules.defineRule(weaponName + '.1',
    'attackBonus.' + name, '=', 'QuilvynUtils.signed(source)'
  );
  rules.defineRule(weaponName + '.2',
    'weaponDieSides.' + name, '=', '"' + damage.replace(/d\d+/, 'd') + '" + source'
  );
  rules.defineRule(weaponName + '.3',
    'damageBonus.' + name, '=', 'source == 0 ? "" : QuilvynUtils.signed(source)'
  );
  rules.defineRule(weaponName + '.4', weaponName, '=', '"' + damageType + '"');
  rules.defineRule(weaponName + '.5',
    '', '=', specialDamage.length > 0 ? '" [' + specialDamage.join('; ') + ']"' : '""'
  );
  if(isFinesse)
    rules.defineRule(weaponName + '.6',
      'finesseAttackBonus', '=', 'source>0 ? "dexterity" : "strength"'
    );
  else
    rules.defineRule(weaponName + '.6',
      weaponName, '=', isRanged ? '"dexterity"' : '"strength"'
    );
  rules.defineRule(weaponName + '.7',
    weaponName, '=', '"untrained"',
    'weaponRank.' + name, '=', 'Pathfinder2E.RANK_NAMES[source]'
  );
  if(range) {
    rules.defineRule('range.' + name,
      weaponName, '=', range,
      'weaponRangeAdjustment.' + name, '+', null
    );
    rules.defineRule(weaponName + '.8', 'range.' + name, '=', null);
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

  setName =
    setName.charAt(0).toLowerCase() + setName.substring(1).replaceAll(' ', '') + 'Features';

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
      feature.match(/(Ability|Attribute|Skill)\s(Boost|Flaw|Increase)\s*\(([^\)]*)\)$/i);
    if(matchInfo) {
      let flaw = matchInfo[2].match(/flaw/i);
      let choices = '';
      matchInfo[3].split(/;\s*/).forEach(element => {
        let m = element.match(/Choose (\d+)/);
        if(m)
          choices += '+' + m[1];
        else if(matchInfo[1] == 'Skill')
          rules.defineRule
            ('skillIncreases.' + element, setName + '.' + feature, '+=', '1');
        else
          rules.defineRule('fixedBoosts.' + element.toLowerCase(),
            setName + '.' + feature, '+=', flaw ? '-1' : '1'
          );
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
              {name: 'Encumbered Bulk', within: 'LoadInfo',
               format: '<b>Encumbered/Maximum Bulk:</b> %V'},
              {name: 'Maximum Bulk', within: 'LoadInfo', format: '/%V'}
      );
      if(name != 'Collected Notes') {
        viewer.addElements(
          {name: 'Ability Notes', within: 'Attributes', separator: noteSep,
           format: '<b>' + (rules.plugin==Pathfinder2E ? 'Ability' : 'Attribute') + ' Notes</b>: %V'}
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
              {name: 'Spell Slots', within: 'SpellStats', separator:listSep},
              {name: 'Spell Points', within: 'SpellStats'},
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
  let isLegacy = rules.plugin == Pathfinder2E;
  let abilityLabel = isLegacy ? 'Ability' : 'Attribute';
  let result = [];
  let oneToTwenty = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
  ];
  let zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Ancestry')
    result.push(
      ['HitPoints', 'Hit Points', 'select-one', ['4', '6', '8', '10', '12']],
      ['Speed', 'Speed', 'text', [3]],
      ['Features', 'Features', 'text', [60]],
      ['Selectables', 'Selectables', 'text', [60]],
      ['Languages', 'Languages', 'text', [30]],
      ['Traits', 'Traits', 'text', [30]]
    );
  else if(type == 'Ancestry Feature')
    result.push(
      ['Ancestry', 'Ancestry', 'select-one', Object.keys(rules.getChoices('ancestrys'))],
      ['Level', 'Level', 'select-one', oneToTwenty],
      ['Selectable', 'Selectable Type', 'text', [20]],
      ['Replace', 'Replace', 'text', [40]]
    );
  else if(type == 'Armor') {
    let armorCategories = ['Unarmored', 'Light', 'Medium', 'Heavy'];
    let armorGroups =
      ['Unarmored', 'Cloth', 'Leather', 'Chain', 'Composite', 'Plate'];
    let strChoices =
      isLegacy ? [10, 11, 12, 13, 14, 15, 16, 17, 18] : [0, 1, 2, 3, 4];
    result.push(
      ['Category', 'Category', 'select-one', armorCategories],
      ['Price', 'Price (GP)', 'text', [4]],
      ['AC', 'AC Bonus', 'select-one', zeroToTen],
      ['Dex', 'Max Dex', 'select-one', zeroToTen],
      ['Check', 'Check Penalty', 'select-one', [0, -1, -2, -3, -4, -5]],
      ['Speed', 'Speed Penalty', 'select-one', [0, -5, -10, -15, -20]],
      ['Str', 'Min Str', 'select-one', strChoices],
      ['Bulk', 'Bulk', 'select-one', ['L', 1, 2, 3, 4, 5]],
      ['Group', 'Group', 'select-one', armorGroups],
      ['Traits', 'Traits', 'text', [20]]
    );
  } else if(type == 'Background')
    result.push(
      ['Features', 'Features', 'text', [60]],
      ['Selectables', 'Selectables', 'text', [60]]
    );
  else if(type == 'Background Feature')
    result.push(
      ['Background', 'Background', 'select-one', Object.keys(rules.getChoices('backgrounds'))],
      ['Level', 'Level', 'select-one', oneToTwenty],
      ['Selectable', 'Selectable Type', 'text', [20]],
      ['Replace', 'Replace', 'text', [40]]
    );
  else if(type == 'Class') {
    result.push(
      [abilityLabel, abilityLabel, 'text', [20]],
      ['HitPoints', 'Hit Points', 'select-one', ['4', '6', '8', '10', '12']],
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Selectable Features', 'text', [40]],
      ['SpellSlots', 'Spells Slots', 'text', [40]]
    );
  } else if(type == 'Class Feature')
    result.push(
      ['Class', 'Class', 'select-one', Object.keys(rules.getChoices('levels'))],
      ['Require', 'Prerequisite', 'text', [40]],
      ['Level', 'Level', 'select-one', oneToTwenty],
      ['Selectable', 'Selectable Type', 'text', [20]],
      ['Replace', 'Replace', 'text', [40]]
    );
  else if(type == 'Deity') {
    let shortAlignments =
      Object.keys(rules.getChoices('alignments')).map(a => a.replaceAll(/[a-z ]/g, ''));
    result.push(
      ['Alignment', 'Alignment', 'select-one', shortAlignments],
      ['FollowerAlignments', 'Follower Alignments', 'text', [30]],
      ['Font', 'Divine Font', 'select-one', ['Harm', 'Heal', 'Either']],
      ['Skill', 'Divine Skill', 'select-one', Object.keys(rules.getChoices('skills'))],
      ['Weapon', 'Favored Weapon', 'select-one', Object.keys(rules.getChoices('weapons'))],
      ['Domain', 'Domains', 'text', [30]],
      ['Spells', 'Spells', 'text', [60]]
    );
  } else if(type == 'Feat')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['Imply', 'Implies', 'text', [40]],
      ['Traits', 'Traits', 'text', [20]]
    );
  else if(type == 'Feature') {
    result.push(
      ['Section', 'Section', 'text', [30]],
      ['Note', 'Note', 'text', [60]],
      ['Action', 'Action', 'select-one', ['None', 'Free', 'Reaction', '1', '2', '3']]
    );
  } else if(type == 'Language')
    result.push(
      // empty
    );
  else if(type == 'Shield')
    result.push(
      ['Price', 'Price (GP)', 'text', [4]],
      ['AC', 'AC Bonus', 'select-one', zeroToTen],
      ['Speed', 'Speed Penalty', 'select-one', [0, -5, -10, -15, -20]],
      ['Bulk', 'Bulk', 'select-one', ['L', 1, 2, 3, 4, 5]],
      ['Hardness', 'Hardness', 'select-one', zeroToTen],
      ['HP', 'Hit Points', 'select-one', [4, 6, 8, 10, 12, 20]]
    );
  else if(type == 'Skill')
    result.push(
      [abilityLabel, abilityLabel, 'select-one', Object.keys(Pathfinder2E.ABILITIES).map(x => x.charAt(0).toUpperCase() + x.substring(1))],
      ['Subcategory', 'Subcategory', 'text', [30]]
    );
  else if(type == 'Spell') {
    let schools =
      Pathfinder2E.CLASSES.Wizard.match(/([\s\w]*:Arcane School)/g)
      .map(x => x.replace(':Arcane School', ''))
      .filter(x => x != 'Universalist');
    let zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    result.push(
      ['School', 'School', 'select-one', schools],
      ['Level', 'Level', 'select-one', zeroToNine],
      ['Tradition', 'Tradition', 'text', [15]],
      ['Cast', 'Cast', 'text', [15]],
      ['Traits', 'Traits', 'text', [25]],
      ['Description', 'Description', 'text', [60]]
    );
  } else if(type == 'Weapon') {
    let weaponDamages = [0];
    ['B', 'E', 'P', 'S'].forEach(t => {
      weaponDamages.push('1 ' + t);
      [4, 6, 8, 10, 12].forEach(s => {
        weaponDamages.push('1d' + s + ' ' + t);
      });
    });
    let weaponGroups = [];
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons) {
      let group = QuilvynUtils.getAttrValue(allWeapons[w], 'Group');
      if(group && !(group in weaponGroups))
        weaponGroups.push(group);
    }
    weaponGroups.sort();
    let zeroToOneFifty =
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    result.push(
      ['Category', 'Category', 'select-one', ['Unarmed', 'Simple', 'Martial', 'Advanced']],
      ['Price', 'Price (GP)', 'text', [4]],
      ['Damage', 'Damage', 'select-one', weaponDamages],
      ['Bulk', 'Bulk', 'select-one', [0, 'L', 1, 2, 3, 4, 5]],
      ['Hands', 'Hands', 'select-one', [1, 2]],
      ['Group', 'Group', 'select-one', weaponGroups],
      ['Traits', 'Traits', 'text', [40]],
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
    ['class', 'Class', 'select-one', 'levels'],
    ['experience', 'Experience', 'text', [8]],
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
    ['ancestryFeats', 'Ancestry Feats', 'setbag', 'ancestryFeats'],
    ['classFeats', 'Class Feats', 'setbag', 'classFeats'],
    ['generalFeats', 'General Feats', 'setbag', 'generalFeats'],
    ['selectableFeatures', 'Selectable Features', 'set', 'selectableFeatures'],
    ['skillIncreases', 'Skills', 'setbag', 'skills'],
    ['languages', 'Languages', 'set', 'languages'],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'setbag', 'weapons'],
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

  /* Returns a random element from the array #list#. */
  function randomElement(list) {
    return list.length>0 ? list[QuilvynUtils.random(0, list.length - 1)] : '';
  }

  let attr;
  let attrs;
  let choices;
  let howMany;
  let matchInfo;

  if(attribute == 'abilities' || attribute in Pathfinder2E.ABILITIES) {
    for(attr in Pathfinder2E.ABILITIES) {
      if(attribute != attr && attribute != 'abilities')
        continue;
      let baseAttr = 'base' + attr.charAt(0).toUpperCase() + attr.substring(1);
      if((attributes.abilityGeneration + '').match(/4d6/)) {
        let rolls = [];
        for(let i = 0; i < 4; i++)
          rolls.push(QuilvynUtils.random(1, 6));
        rolls.sort();
        attributes[baseAttr] = rolls[1] + rolls[2] + rolls[3];
      } else {
        attributes[baseAttr] = 10;
      }
    }
  } else if(attribute == 'armor') {
    attrs = this.applyRules(attributes);
    let allArmors = this.getChoices('armors');
    choices = [];
    for(let attr in allArmors) {
      let category = QuilvynUtils.getAttrValue(allArmors[attr], 'Category');
      if(category == 'Unarmored')
        choices.push(attr);
      else if(attributes['class'] == 'Druid' &&
              allArmors[attr].match(/Chain|Composite|Plate/))
        ; // empty
      else if(attrs['rank.' + category + ' Armor'])
        choices.push(attr);
    }
    attributes.armor = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'boosts') {
    attrs = this.applyRules(attributes);
    let boostsAllocated = {};
    for(attr in Pathfinder2E.ABILITIES)
      boostsAllocated[attr] = attributes['abilityBoosts.' + attr] || 0;
    let allNotes = this.getChoices('notes');
    // Grab text of all Ability Boost features and notes
    let boostTexts = [];
    for(attr in attrs) {
      if((matchInfo = attr.match(/^\w+Features.(Ability|Attribute)\s+Boost\s+\((.*)\)$/)))
        boostTexts.push(matchInfo[2]);
      else if(allNotes[attr] &&
              (matchInfo=allNotes[attr].match(/(Ability|Attribute)\s+Boost\s+\((.*?)\)/)) != null)
        boostTexts.push(matchInfo[2].replaceAll('%V', attrs[attr]));
    }
    // Sort in order of most restrictive to least restrictive
    boostTexts = boostTexts.sort((a, b) =>
      a == b ? 0 :
      a.match(/^Choose[^;]*from any$/) ? 1 :
      b.match(/^Choose[^;]*from any$/) ? -1 :
      a.includes('from any') ? 1 :
      b.includes('from any') ? -1 : 0
    );
    boostTexts.forEach(text => {
      let anyChoices = Object.keys(Pathfinder2E.ABILITIES);
      text.split(/\s*;\s*/).forEach(boost => {
        let m = boost.match(/Choose\s+(\d+)\s+from\s+([\w,\s]*)/i);
        if(!m) {
          // Specific ability boost; remove from subsequent any choice
          anyChoices = anyChoices.filter(x => x != boost.toLowerCase());
        } else {
          howMany = +m[1];
          choices = m[2].match(/^any$/i) ? anyChoices : m[2].split(/\s*,\s*/);
          choices = choices.map(x => x.toLowerCase());
          // If existing allocations have been applied to the abilities in
          // choices, assume that they apply to this boost and reduce howMany
          // and boostsAllocated appropriately
          while(howMany > 0 &&
                choices.reduce((total, choice) => total + boostsAllocated[choice], 0) > 0) {
            choices.forEach(choice => {
              if(howMany > 0 && boostsAllocated[choice] > 0) {
                howMany--;
                boostsAllocated[choice]--;
              }
            });
          }
          // While we have more to allocate than choices, assign a boost to
          // each choice--this probably will only occur when assigning the
          // boost acquired at every 5th level
          while(howMany > choices.length) {
            choices.forEach(c => {
              attributes['abilityBoosts.' + c] = (attributes['abilityBoosts.' + c] || 0) + 1;
            });
            howMany -= choices.length;
          }
          // Finally, randomly assign any remaining allocations
          while(howMany > 0 && choices.length > 0) {
            let choice = randomElement(choices);
            attributes['abilityBoosts.' + choice] =
              (attributes['abilityBoosts.' + choice] || 0) + 1;
            howMany--;
            choices = choices.filter(x => x != choice);
            anyChoices = anyChoices.filter(x => x != choice);
          }
        }
      });
    });
  } else if(attribute == 'deity') {
    let alignment =
      (attributes.alignment || 'Neutral').match(/^([CLN]).*\s([GEN])/);
    alignment = alignment ? alignment[1] + alignment[2] : 'N';
    choices = [];
    let deities = this.getChoices('deitys');
    for(let d in deities) {
      let allowed =
        QuilvynUtils.getAttrValueArray(deities[d], 'FollowerAlignments');
      if(!allowed || allowed.includes(alignment))
        choices.push(d);
    }
    if(choices.length > 0)
      attributes.deity = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'experience') {
    let level = attributes.level || 1;
    delete attributes.level;
    attributes.experience = (level - 1) * 1000 + QuilvynUtils.random(0, 999);
  } else if(attribute == 'feats' || attribute == 'selectableFeatures') {
    attrs = this.applyRules(attributes);
    let debug = [];
    let countPrefix = attribute.replace(/s$/, '') + 'Count.';
    let toAllocateByTrait = {};
    for(attr in attrs) {
      if(attr.startsWith(countPrefix))
        toAllocateByTrait[attr.replace(countPrefix, '')] = attrs[attr];
    }
    let availableChoices = {};
    let allChoices =
      attribute == 'feats' ?
        Object.assign({}, this.getChoices('ancestryFeats'), this.getChoices('classFeats'), this.getChoices('generalFeats')) :
        this.getChoices('selectableFeatures');
    for(attr in allChoices) {
      let traits =
        QuilvynUtils.getAttrValueArray
          (allChoices[attr], allChoices[attr].includes('Type') ? 'Type' : 'Traits');
      if(attrs[attribute + '.' + attr] != null) {
        traits.forEach(t => {
          if(toAllocateByTrait[t] != null && toAllocateByTrait[t] > 0) {
            debug.push(attribute + '.' + attr + ' reduces ' + t + ' feats from ' + toAllocateByTrait[t]);
            toAllocateByTrait[t]--;
          }
        });
      } else if(attrs['features.' + attr] == null &&
                !allChoices[attr].includes('Uncommon')) {
        availableChoices[attr] = traits;
      }
    }
    for(attr in toAllocateByTrait) {
      let availableChoicesWithTrait = {};
      let prefix =
        attribute == 'feats' ? (attr == 'Skill' ? 'general' : attr.toLowerCase()) + 'Feats' : attribute;
      for(let a in availableChoices) {
        let trait = attr == 'Ancestry' ? attributes.ancestry : attr == 'Class' ? attributes['class'] : attr;
        if(availableChoices[a].includes(trait))
          availableChoicesWithTrait[a] = '';
        else if(attr == 'Ancestry' &&
                attributes.addedAncestry &&
                availableChoices[a].includes(attributes.addedAncestry))
          availableChoicesWithTrait[a] = '';
      }
      howMany = toAllocateByTrait[attr];
      debug.push('Choose ' + howMany + ' ' + attr + ' ' + attribute);
      let setsPicked = {};
      while(howMany > 0 &&
            (choices=Object.keys(availableChoicesWithTrait)).length > 0) {
        debug.push('Pick ' + howMany + ' from ' + choices.length);
        let pick;
        let picks = {};
        pickAttrs(picks, '', choices, howMany, 1);
        debug.push('From ' + Object.keys(picks).join(", ") + ' reject');
        for(pick in picks) {
          // Only choose 1 choice from choice sets, like Assurance (skill) feats
          if(pick.includes('(')) {
            let pickSet = pick.replace(/ \(.*/, '');
            if(pickSet in setsPicked) {
              delete picks[pick];
              delete availableChoicesWithTrait[pick];
              continue;
            }
            setsPicked[pickSet] = pick;
          }
          attributes[prefix + '.' + pick] = 1;
          delete availableChoicesWithTrait[pick];
        }
        let validate = this.applyRules(attributes);
        for(pick in picks) {
          let name = pick.charAt(0).toLowerCase() +
                     pick.substring(1).replaceAll(' ', '').
                     replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          let note =
            name + attribute.charAt(0).toUpperCase() + attribute.substring(1).replace(/s$/, '');
          if(QuilvynUtils.sumMatching
               (validate,
                new RegExp('^(sanity|validation)Notes.' + note)) != 0) {
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
  } else if(attribute == 'name') {
    attributes.name = Pathfinder2E.randomName(attributes.ancestry);
  } else if(attribute == 'shield') {
    // The rules have no restrictions on shield use, but it seems weird to give
    // Wizards, etc. a shield, and so we restrict shields to characters with a
    // rank in armor.
    attrs = this.applyRules(attributes);
    choices = attrs['rank.Light Armor']>0 ? Object.keys(this.getChoices('shields')) : ['None'];
    if(attributes['class'] == 'Druid')
      choices = choices.filter(x => !x.match(/Steel|Metal/));
    attributes.shield = randomElement(choices);
  } else if(attribute == 'skills') {
    attrs = this.applyRules(attributes);
    let allSkills = this.getChoices('skills');
    let skillsAllocated = {};
    for(attr in allSkills)
      skillsAllocated[attr] = attrs['skillIncreases.' + attr] || 0;
    let allNotes = this.getChoices('notes');
    // Get text and improvement level of all features and notes affecting skills
    let skillTexts = [];
    for(attr in attrs) {
      if((matchInfo = attr.match(/^\w+Features.Skill\s+(Trained|Expert|Master|Legendary|Increase)\s+\((.*)\)$/)))
        ; // empty
      else if(!allNotes[attr] ||
         (matchInfo = allNotes[attr].match(/Skill\s+(Trained|Expert|Master|Legendary|Increase|%V)\s+\((.*?)\)/)) == null)
        continue;
      let improvement = matchInfo[1].replace('%V', attrs[attr]);
      let prior =
        {Trained:0, Expert:1, Master:2, Legendary:3, Increase:9}[improvement];
      if(prior == null) {
        console.log('Unknown skill improvement "' + improvement + '"');
        continue;
      }
      skillTexts.push(prior + matchInfo[2].replaceAll('%V', attrs[attr]));
    }
    // Sort in order of most restrictive to least restrictive
    skillTexts = skillTexts.sort((a, b) =>
      a.charAt(0) != b.charAt(0) ? a.charAt(0) - b.charAt(0) :
      a == b ? 0 :
      a.match(/^Choose[^;]*from any$/) ? 1 :
      b.match(/^Choose[^;]*from any$/) ? -1 :
      a.includes('from any') ? 1 :
      b.includes('from any') ? -1 : 0
    );
    skillTexts.forEach(text => {
      let improveFrom = text.charAt(0);
      text = text.substring(1);
      text.split(/\s*;\s*/).forEach(improvement => {
        let m = improvement.match(/Choose\s+(\d+)\s+from\s+([\w,\s]*)/i);
        if(!m) {
          // Improve specific skill; nothing to allocate
        } else {
          howMany = +m[1];
          if(m[2].match(/^any$/i))
            choices = Object.keys(allSkills);
          else if(m[2].match(/^any\s/))
            // e.g., choose 2 from any Lore
            choices = Object.keys(allSkills).filter(x => allSkills[x].includes(m[2].replace(/any\s+/, '')));
          else
            choices = m[2].split(/\s*,\s*/);
          // If existing increases have been allocated to the skills in
          // choices, assume that they apply to this improvement and reduce
          // howMany and skillsAllocated appropriately
          while(howMany > 0 &&
                choices.reduce((total, choice) => total + skillsAllocated[choice], 0) > 0) {
            choices.forEach(choice => {
              if(howMany > 0 && skillsAllocated[choice] > 0) {
                howMany--;
                skillsAllocated[choice]--;
              }
            });
          }
          // Remove any choices that don't have the appropriate number of
          // prior improvements
          if(improveFrom != 9)
            choices =
              choices.filter(x => (attrs['rank.' + x] || 0) == improveFrom);
          // Finally, randomly assign any remaining allocations
          while(howMany > 0 && choices.length > 0) {
            let choice = randomElement(choices);
            attributes['skillIncreases.' + choice] =
              (attributes['skillIncreases.' + choice] || 0) + 1;
            attrs['rank.' + choice] = (attrs['rank.' + choice] || 0) + 1;
            howMany--;
            choices = choices.filter(x => x != choice);
          }
        }
      });
    });
  } else if(attribute == 'spells') {
    let availableSpellsByGroupAndLevel = {};
    let groupAndLevel;
    let allSpells = this.getChoices('spells');
    attrs = this.applyRules(attributes);
    for(attr in allSpells) {
      if(allSpells[attr].includes('Focus'))
        continue;
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
    let c = 'Fighter';
    for(attr in attributes) {
      if(attr.match(/^levels\./))
        c = attr.replace('levels.', '');
    }
    let ancestry = attributes.ancestry || 'Human';
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
         !weapons[attr].includes(c) &&
         !weapons[attr].includes(ancestry))
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
    '  <li>\n' +
    '  To simplify tracking character level, the PF2E plugin interprets the ' +
    '  experience points entered for a character to be cumulative from ' +
    '  initial character creation, rather than only the experience points ' +
    '  over the amount required to advance to their current level. For ' +
    '  example, a 5th-level character would have between 4000 and 4999 ' +
    '  experience points.\n' +
    '  </li><li>\n' +
    '  Discussion of adding different types of homebrew options to the ' +
    '  Pathfinder rule set can be found in <a href="plugins/homebrew-pf2e.html">Pathfinder 2E Homebrew Examples</a>.\n' +
    '  </li><li>\n' +
    '  The PF2E plugin uses (1), (2), (3), (F), and (R) on the character ' +
    '  sheet to note features that require 1, 2, or 3 actions or can be ' +
    '  taken as a free action or reaction.\n' +
    '  </li>\n' +
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
