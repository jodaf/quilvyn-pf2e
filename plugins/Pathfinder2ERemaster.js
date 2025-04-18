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
 * This module loads the rules from the Pathfinder Second Edition Remaster
 * rules. The Pathfinder2ERemaster function contains methods that load rules for
 * particular parts of the rules: ancestryRules for character ancestries,
 * magicRules for spells, etc. These member methods can be called independently
 * in order to use a subset of the Pathfinder2ERemaster rules. Similarly, the
 * constant fields of Pathfinder2ERemaster (BACKGROUNDS, FEATS, etc.) can be
 * manipulated to modify the choices.
 */
function Pathfinder2ERemaster(edition) {

  let rules = new QuilvynRules(edition, Pathfinder2ERemaster.VERSION);
  rules.plugin = Pathfinder2ERemaster;
  Pathfinder2ERemaster.rules = rules;

  rules.defineChoice('choices', Pathfinder2E.CHOICES);
  rules.choiceEditorElements = Pathfinder2E.choiceEditorElements;
  rules.choiceRules = Pathfinder2ERemaster.choiceRules;
  rules.removeChoice = Pathfinder2E.removeChoice;
  rules.editorElements = Pathfinder2ERemaster.initialEditorElements();
  rules.getChoices = Pathfinder2E.getChoices;
  rules.getFormats = Pathfinder2E.getFormats;
  rules.getPlugins = Pathfinder2ERemaster.getPlugins;
  rules.makeValid = Pathfinder2E.makeValid;
  rules.randomizeOneAttribute = Pathfinder2E.randomizeOneAttribute;
  rules.defineChoice('random', Pathfinder2ERemaster.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Pathfinder2ERemaster.ruleNotes;

  Pathfinder2E.createViewers(rules, Pathfinder2E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'ancestry:Ancestry,select-one,ancestrys',
    'background:Background,select-one,backgrounds',
    'class:Class,select-one,levels',
    'experience:Experience,text,6'
  );

  let choices = {};
  ['ANCESTRIES', 'ARMORS', 'BACKGROUNDS', 'CLASSES', 'DEITIES', 'FEATS',
   'FEATURES', 'GOODIES', 'LANGUAGES', 'SHIELDS', 'SKILLS', 'SPELLS', 'WEAPONS'
  ].forEach(c => {
    if(edition.match(/legacy/))
      choices[c] = Object.assign({}, Pathfinder2E[c], Pathfinder2ERemaster[c]);
    else
      choices[c] = Pathfinder2ERemaster[c];
  });
  Pathfinder2ERemaster.abilityRules(rules, Pathfinder2E.ABILITIES);
  Pathfinder2ERemaster.combatRules
    (rules, choices.ARMORS, choices.SHIELDS, choices.WEAPONS);
  Pathfinder2ERemaster.magicRules(rules, choices.SPELLS);
  Pathfinder2ERemaster.identityRules(
    rules, choices.ANCESTRIES, choices.BACKGROUNDS, choices.CLASSES,
    choices.DEITIES
  );
  Pathfinder2ERemaster.talentRules(
    rules, choices.FEATS, choices.FEATURES, choices.GOODIES, choices.LANGUAGES,
    choices.SKILLS
  );

  Quilvyn.addRuleSet(rules);

}

Pathfinder2ERemaster.VERSION = '2.4.1.0';

Pathfinder2ERemaster.RANDOMIZABLE_ATTRIBUTES =
  Pathfinder2E.RANDOMIZABLE_ATTRIBUTES.filter(x => x != 'alignment');

Pathfinder2ERemaster.ANCESTRIES = {
  'Dwarf':Pathfinder2E.ANCESTRIES.Dwarf,
  'Elf':Pathfinder2E.ANCESTRIES.Elf.replace('Selectables=', 'Selectables="1:Ancient Elf:Heritage",'),
  'Gnome':Pathfinder2E.ANCESTRIES.Gnome.replace('Sylvan', 'Fey'),
  'Goblin':Pathfinder2E.ANCESTRIES.Goblin,
  'Halfling':Pathfinder2E.ANCESTRIES.Halfling.replace('Selectables=', 'Selectables="1:Jinxed Halfling:Heritage",'),
  'Human':Pathfinder2E.ANCESTRIES.Human.replace('1:Half-Elf:Heritage,1:Half-Orc:Heritage,', '').replaceAll(/Heritage Human/g, 'Human'),
  'Leshy':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boost (Constitution; Wisdom; Choose 1 from any)",' +
      '"1:Ability Flaw (Intelligence)",' +
      '1:Small,"1:Low-Light Vision","1:Ancestry Feats","1:Leshy Heritage","Plant Nourishment" ' +
    'Selectables=' +
      '"1:Cactus Leshy:Heritage",' +
      '"1:Fruit Leshy:Heritage",' +
      '"1:Fungus Leshy:Heritage",' +
      '"1:Gourd Leshy:Heritage",' +
      '"1:Leaf Leshy:Heritage",' +
      '"1:Lotus Leshy:Heritage",' +
      '"1:Root Leshy:Heritage",' +
      '"1:Seaweed Leshy:Heritage",' +
      '"1:Vine Leshy:Heritage" ' +
    'Languages=Common,Fey ' +
    'Trait=Leshy,Plant',
  'Orc':
    'HitPoints=10 ' +
    'Features=' +
      '"1:Ability Boost (Choose 2 from any)",' +
      '1:Darkvision,"1:Ancestry Feats","1:Orc Heritage" ' +
    'Selectables=' +
      '"1:Badlands Orc:Heritage",' +
      '"1:Battle-Ready Orc:Heritage",' +
      '"1:Deep Orc:Heritage",' +
      '"1:Grave Orc:Heritage",' +
      '"1:Hold-Scarred Orc:Heritage",' +
      '"1:Rainfall Orc:Heritage",' +
      '"1:Winter Orc:Heritage" ' +
    'Languages=Common,Orcish ' +
    'Trait=Orc,Humanoid'
  // TODO Versatile heritige
};
Pathfinder2ERemaster.ARMORS = {
  // TODO Str is now expressed as a modifier instead of a score
  'None':Pathfinder2E.ARMORS.None,
  "Explorer's Clothing":Pathfinder2E.ARMORS["Explorer's Clothing"],
  'Padded':Pathfinder2E.ARMORS.Padded,
  'Leather':Pathfinder2E.ARMORS.Leather,
  'Studded Leather':Pathfinder2E.ARMORS['Studded Leather'],
  'Chain Shirt':Pathfinder2E.ARMORS['Chain Shirt'],
  'Hide':Pathfinder2E.ARMORS.Hide,
  'Scale Mail':Pathfinder2E.ARMORS['Scale Mail'],
  'Chain Mail':Pathfinder2E.ARMORS['Chain Mail'],
  'Breastplate':Pathfinder2E.ARMORS.Breastplate,
  'Splint Mail':Pathfinder2E.ARMORS['Splint Mail'],
  'Half Plate':Pathfinder2E.ARMORS['Half Plate'],
  'Full Plate':Pathfinder2E.ARMORS['Full Plate']
};
Pathfinder2ERemaster.BACKGROUNDS = {
  'Acolyte':Pathfinder2E.BACKGROUNDS.Acolyte,
  'Acrobat':Pathfinder2E.BACKGROUNDS.Acrobat,
  'Animal Whisperer':Pathfinder2E.BACKGROUNDS['Animal Whisperer'],
  'Artisan':Pathfinder2E.BACKGROUNDS.Artisan,
  'Artist':Pathfinder2E.BACKGROUNDS.Artist,
  'Barkeep':Pathfinder2E.BACKGROUNDS.Barkeep,
  'Barrister':Pathfinder2E.BACKGROUNDS.Barrister,
  'Bounty Hunter':Pathfinder2E.BACKGROUNDS['Bounty Hunter'],
  'Charlatan':Pathfinder2E.BACKGROUNDS.Charlatan,
  'Cook':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Constitution, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Cooking Lore)",1:Seasoned',
  'Criminal':Pathfinder2E.BACKGROUNDS.Criminal,
  'Cultist':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Charisma; Choose 1 from any)",' +
      // TODO deity or cult lore
      '"1:Skill Trained (Occultism, Choose 1 from any Deity Lore)","1:Schooled In Secrets"',
  'Detective':Pathfinder2E.BACKGROUNDS.Detective,
  'Emissary':Pathfinder2E.BACKGROUNDS.Emissary,
  'Entertainer':Pathfinder2E.BACKGROUNDS.Entertainer,
  'Farmhand':Pathfinder2E.BACKGROUNDS.Farmhand,
  'Field Medic':Pathfinder2E.BACKGROUNDS['Field Medic'],
  'Fortune Teller':Pathfinder2E.BACKGROUNDS['Fortune Teller'],
  'Gambler':Pathfinder2E.BACKGROUNDS.Gambler,
  'Gladiator':Pathfinder2E.BACKGROUNDS.Gladiator,
  'Guard':Pathfinder2E.BACKGROUNDS.Guard,
  'Herbalist':Pathfinder2E.BACKGROUNDS.Herbalist,
  'Hermit':Pathfinder2E.BACKGROUNDS.Hermit,
  'Hunter':Pathfinder2E.BACKGROUNDS.Hunter,
  'Laborer':Pathfinder2E.BACKGROUNDS.Laborer,
  'Martial Disciple':Pathfinder2E.BACKGROUNDS['Martial Disciple'],
  'Merchant':Pathfinder2E.BACKGROUNDS.Merchant,
  'Miner':Pathfinder2E.BACKGROUNDS.Miner,
  'Noble':Pathfinder2E.BACKGROUNDS.Noble,
  'Nomad':Pathfinder2E.BACKGROUNDS.Nomad,
  'Prisoner':Pathfinder2E.BACKGROUNDS.Prisoner,
  'Raised By Belief':
    'Features=' +
      // TODO deity's ability
      '"1:Ability Boost (Choose 1 from Dexterity, Strength; Choose 1 from any)",' +
      // TODO deity's skills; Assurance (deity skill)
      '"1:Skill Trained (Athletics; Sailing Lore)","1:Underwater Marauder"',
  'Sailor':Pathfinder2E.BACKGROUNDS.Sailor,
  'Scholar':Pathfinder2E.BACKGROUNDS.Scholar,
  'Scout':Pathfinder2E.BACKGROUNDS.Scout,
  'Street Urchin':Pathfinder2E.BACKGROUNDS['Street Urchin'],
  'Teacher':
    'Features=' +
      '"1:Ability Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Choose 1 from Performance, Society; Academia Lore)","1:Experienced Professional"',
  'Tinker':Pathfinder2E.BACKGROUNDS.Tinker,
  'Warrior':Pathfinder2E.BACKGROUNDS.Warrior
};
Pathfinder2ERemaster.CLASSES = {
  // TODO
  /*
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
      '"9:Alchemical Expertise","9:Perception Expertise","9:Double Brew",' +
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
      '1:Rage,1:Instinct,"1:Barbarian Feats",' +
      '"features.Animal Instinct || features.Dragon Instinct || ' +
       'features.Giant Instinct || features.Spirit Instinct ? 1:Anathema",' +
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
      '"3:Skill Increases",5:Brutality,7:Juggernaut,' +
      '"7:Specialization Ability","7:Weapon Specialization",' +
      '"9:Reflex Expertise",' +
      '"features.Animal Instinct ? 9:Raging Resistance (Animal)",' +
      '"features.Dragon Instinct ? 9:Raging Resistance (Dragon)",' +
      '"features.Fury Instinct ? 9:Raging Resistance (Fury)",' +
      '"features.Giant Instinct ? 9:Raging Resistance (Giant)",' +
      '"features.Spirit Instinct ? 9:Raging Resistance (Spirit)",' +
      '"11:Mighty Rage",' +
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
  */
  'Bard':
    'Ability=charisma HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Charisma)",' +
      '"1:Perception Expert",' +
      '"1:Save Trained (Fortitude; Reflex)","1:Save Expert (Will)",' +
      '"1:Bard Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Spell Trained (Bard)","1:Class Trained (Bard)",' +
      '"1:Bard Spellcasting","1:Composition Spells",1:Muses,' +
      '"2:Bard Feats","2:Skill Feats","3:General Feats",' +
      '"3:Reflex Expertise","3:Signature Spells","3:Skill Increases",' +
      '"7:Expert Spellcaster","9:Fortitude Expertise","9:Performer\'s Heart",' +
      '"11:Bard Weapon Expertise","11:Perception Mastery",' +
      '"13:Light Armor Expertise","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Greater Performer\'s Heart",' +
      '"19:Magnum Opus","19:Legendary Spellcaster" ' +
    'Selectables=' +
      '1:Enigma:Muse,' +
      '1:Maestro:Muse,' +
      '1:Polymath:Muse,' +
      '1:Warrior:Muse ' +
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
/*
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
      '9:Juggernaut,"9:Reflex Expertise","11:Perception Expertise","11:Divine Will",' +
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
      '"1:Divine Ally (Blade):Divine Ally",' +
      '"1:Divine Ally (Shield):Divine Ally",' +
      '"1:Divine Ally (Steed):Divine Ally",' +
      '"alignment == \'Lawful Good\' ? 1:Paladin:Cause",' +
      '"alignment == \'Neutral Good\' ? 1:Redeemer:Cause",' +
      '"alignment == \'Chaotic Good\' ? 1:Liberator:Cause"',
*/
  /* TODO Ability Boosts has become Attribute Boosts */
  'Cleric':
    'Ability=wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Ability Boosts","1:Ability Boost (Wisdom)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Cleric Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Spell Trained (Cleric)","Class Trained (Cleric)",' +
      '1:Anathema,"1:Cleric Spellcasting",1:Deity,"1:Divine Font",' +
      '1:Doctrine,1:Sanctification,"2:Cleric Feats","2:Skill Feats",' +
      '"3:General Feats","3:Skill Increases","5:Perception Expertise",' +
      '"9:Resolute Faith","11:Reflex Expertise","13:Divine Defense",' +
      '"13:Weapon Specialization","19:Miraculous Spell" ' +
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
/*
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
      '"2:Skill Feats","3:Perception Expertise","3:General Feats","3:Fortitude Expertise",' +
      '"3:Skill Increases","5:Reflex Expertise","7:Expert Spellcaster",' +
      '"11:Druid Weapon Expertise",11:Resolve,"13:Medium Armor Expertise",' +
      '"13:Weapon Specialization","15:Master Spellcaster",' +
      '"19:Legendary Spellcaster","19:Primal Hierophant" ' +
    'Selectables=' +
      '1:Animal:Order,' +
      '1:Leaf:Order,' +
      '1:Storm:Order,' +
      '1:Wild:Order ' +
    'SpellSlots=' +
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
      '"2:Skill Feats",3:Bravery,"3:General Feats","3:Skill Increases",' +
      '"5:Fighter Weapon Mastery","7:Battlefield Surveyor",' +
      '"7:Weapon Specialization","9:Combat Flexibility",9:Juggernaut,' +
      '"11:Armor Expertise","11:Fighter Expertise","13:Weapon Legend",' +
      '15:Evasion,"15:Greater Weapon Specialization",' +
      '"15:Improved Flexibility","17:Armor Mastery","19:Versatile Legend" ' +
    'Selectables=' +
      '"1:Dexterity:Key Ability",' +
      '"1:Strength:Key Ability"',
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
      '"3:Mystic Strikes","3:Skill Increases","5:Perception Expertise",' +
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
      '"7:Perception Mastery","7:Weapon Specialization","9:Nature\'s Edge",' +
      '"9:Ranger Expertise",11:Juggernaut,"11:Medium Armor Expertise",' +
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
      '"7:Perception Mastery","7:Weapon Specialization","9:Debilitating Strike",' +
      '"9:Fortitude Expertise","11:Rogue Expertise","13:Improved Evasion",' +
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
      '"9:Reflex Expertise","11:Perception Expertise","11:Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster",17:Resolve,"19:Bloodline Paragon",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '1:Aberrant:Bloodline,' +
      '1:Angelic:Bloodline,' +
      '1:Demonic:Bloodline,' +
      '1:Diabolic:Bloodline,' +
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
      '1:Fey:Bloodline,' +
      '1:Hag:Bloodline,' +
      '1:Imperial:Bloodline,' +
      '1:Undead:Bloodline ' +
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
      '"1:Arcane Thesis","2:Skill Feats","2:Wizard Feats","3:General Feats",' +
      '"3:Skill Increases","5:Reflex Expertise","7:Expert Spellcaster",' +
      '"9:Magical Fortitude","11:Perception Expertise","11:Wizard Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster",17:Resolve,"19:Archwizard\'s Spellcraft",' +
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
*/
};
Pathfinder2ERemaster.DEITIES = {
  // TODO Divine Attribute is new; Aignment and FollowerAlignments eliminated
  'None':'',
  'Abadar':Pathfinder2E.DEITIES.Abadar.replace('Magnificent Mansion', 'Planar Palace'),
  'Asmodeus':Pathfinder2E.DEITIES.Asmodeus,
  'Calistra':Pathfinder2E.DEITIES.Calistra,
  'Cayden Cailean':Pathfinder2E.DEITIES['Cayden Cailean'].replace('Touch Of Idiocy', 'Stupefy'),
  'Desna':Pathfinder2E.DEITIES.Desna.replace('3:Dream Message', '4:Translocate'),
  'Erastil':Pathfinder2E.DEITIES.Erastil.replace('Tree Stride', "Nature's Pathway"),
  'Gorum':Pathfinder2E.DEITIES.Gorum,
  'Gozreh':Pathfinder2E.DEITIES.Gozreh,
  'Iomedae':Pathfinder2E.DEITIES.Iomedae.replace('See Invisibility', 'Enlarge'),
  'Irori':Pathfinder2E.DEITIES.Irori.replace('4:Stoneskin', '4:Mountain Resilience'),
  'Lamashtu':Pathfinder2E.DEITIES.Lamashtu.replace('Magic Fang', 'Spider Sting'),
  'Nethys':Pathfinder2E.DEITIES.Nethys + ' ' +
    'Spells=' +
      '"1:Force Barrage","2:Embed Message","3:Levitate","4:Flicker",' +
      '"5:Telekinetic Haul","6:Wall Of Force","7:Warp Mind","8:Quadary",' +
      '"9:Detonate Magic"',
  'Norgorber':Pathfinder2E.DEITIES.Norgorber.replace('Phantasmal Killer', 'Vision Of Death'),
  'Pharasma':Pathfinder2E.DEITIES.Pharasma.replace('Phantasmal Killer', 'Vision Of Death'),
  'Rovagug':Pathfinder2E.DEITIES.Rovagug.replace('Burning Hands', 'Breath Fire'),
  'Sarenrae':Pathfinder2E.DEITIES.Sarenrae.replace('Burning Hands', 'Breath Fire'),
  'Shelyn':Pathfinder2E.DEITIES.Shelyn.replace('Color Spray', 'Dizzying Colors'),
  'Torag':Pathfinder2E.DEITIES.Torag,
  'Urgathoa':Pathfinder2E.DEITIES.Urgathoa.replace('False Life', 'False Vitality'),
  'Zon-Kuthon':Pathfinder2E.DEITIES['Zon-Kuthon'].replace('Shadow Walk', 'Umbral Journey')
};
Pathfinder2ERemaster.FEATS = {

  // TODO

  // Ancestries
  'Dwarven Doughtiness':'Trait=Ancestry,Dwarf',
  'Dwarven Lore':Pathfinder2E.FEATS['Dwarven Lore'],
  'Dwarven Weapon Familiarity':Pathfinder2E.FEATS['Dwarven Weapon Familiarity'],
  'Mountain Strategy':'Trait=Ancestry,Dwarf',
  'Rock Runner':Pathfinder2E.FEATS['Rock Runner'],
  "Stonemason's Eye":Pathfinder2E.FEATS.Stonecunning,
  'Unburdened Iron':Pathfinder2E.FEATS['Unburdened Iron'],
  'Boulder Roll':Pathfinder2E.FEATS['Boulder Roll'],
  'Defy The Darkness':
    'Trait=Ancestry,Dwarf Require="level >= 5","features.Darkvision"',
  'Dwarven Reinforcement':
    'Trait=Ancestry,Dwarf Require="level >= 5","rank.Crafting >= 2"',
  'Echoes In Stone':'Trait=Ancestry,Dwarf Require="level >= 9"',
  "Mountain's Stoutness":Pathfinder2E.FEATS["Mountain's Stoutness"],
  'Stone Bones':'Trait=Ancestry,Dwarf Require="level >= 9"',
  'Stonewalker':Pathfinder2E.FEATS.Stonewalker,
  'March The Mines':'Trait=Ancestry,Dwarf Require="level >= 13"',
  'Telluric Power':'Trait=Ancestry,Dwarf Require="level >= 13"',
  'Stonegate':'Trait=Ancestry,Dwarf Require="level >= 17"',
  'Stonewall':'Trait=Ancestry,Dwarf Require="level >= 17"',

  'Ancestral Longevity':Pathfinder2E.FEATS['Ancestral Longevity'],
  'Elven Lore':Pathfinder2E.FEATS['Elven Lore'],
  'Elven Weapon Familiarity':Pathfinder2E.FEATS['Elven Weapon Familiarity'],
  'Forlorn':Pathfinder2E.FEATS.Forlorn,
  'Nimble Elf':Pathfinder2E.FEATS['Nimble Elf'],
  'Otherworldly Magic':Pathfinder2E.FEATS['Otherworldly Magic'],
  'Unwavering Mien':Pathfinder2E.FEATS['Unwavering Mien'],
  'Ageless Patience':Pathfinder2E.FEATS['Ageless Patience'],
  'Ancestral Suspicion':'Trait=Ancestry,Elf Require="level >= 5"',
  'Martial Experience':'Trait=Ancestry,Elf Require="level >= 5"',
  'Elf Step':Pathfinder2E.FEATS['Elf Step'],
  'Expert Longevity':Pathfinder2E.FEATS['Expert Longevity'],
  // TODO requires "at least one innate spell gained from an elf ancestry feat"
  'Otherworldly Acumen':'Trait=Ancestry,Elf Require="level >= 9"',
  'Tree Climber':'Trait=Ancestry,Elf Require="level >= 9"',
  'Avenge Ally':'Trait=Ancestry,Elf Require="level >= 13"',
  'Universal Longevity':Pathfinder2E.FEATS['Universal Longevity'],
  'Magic Rider':'Trait=Ancestry,Elf Require="level >= 17"',

  'Animal Accomplice':Pathfinder2E.FEATS['Animal Accomplice'],
  'Animal Elocutionist':Pathfinder2E.FEATS['Burrow Elocutionist'],
  'Fey Fellowship':Pathfinder2E.FEATS['Fey Fellowship'],
  'First World Magic':Pathfinder2E.FEATS['First World Magic'],
  'Gnome Obsession':Pathfinder2E.FEATS['Gnome Obsession'],
  'Gnome Weapon Familiarity':Pathfinder2E.FEATS['Gnome Weapon Familiarity'],
  'Illusion Sense':Pathfinder2E.FEATS['Illusion Sense'],
  'Razzle-Dazzle':'Trait=Ancestry,Gnome',
  'Energized Font':Pathfinder2E.FEATS['Energized Font'],
  'Project Persona':'Trait=Ancestry,Gnome Require="level >= 5"',
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Cautious Curiosity':'Trait=Ancestry,Gnome Require="level >= 9"',
  'First World Adept':Pathfinder2E.FEATS['First World Adept'],
  'Life Leap':'Trait=Ancestry,Gnome Require="level >= 9"',
  'Vivacious Conduit':Pathfinder2E.FEATS['Vivacious Conduit'],
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Instinctive Obfuscation':'Trait=Ancestry,Gnome Require="level >= 13"',
  'Homeward Bound':'Trait=Ancestry,Gnome Require="level >= 17"',

  'Burn It!':Pathfinder2E.FEATS['Burn It!'],
  'City Scavenger':Pathfinder2E.FEATS['City Scavenger'],
  'Goblin Lore':Pathfinder2E.FEATS['Goblin Lore'],
  'Goblin Scuttle':Pathfinder2E.FEATS['Goblin Scuttle'],
  'Goblin Song':Pathfinder2E.FEATS['Goblin Song'],
  'Goblin Weapon Familiarity':Pathfinder2E.FEATS['Goblin Weapon Familiarity'],
  'Junk Tinker':Pathfinder2E.FEATS['Junk Tinker'],
  'Rough Rider':Pathfinder2E.FEATS['Rough Rider'],
  'Very Sneaky':Pathfinder2E.FEATS['Very Sneaky'],
  'Kneecap':'Trait=Ancestry,Goblin Require="level >= 5"',
  'Loud Singer':
    'Trait=Ancestry,Goblin Require="level >= 5","features.Goblin Song"',
  'Vandal':'Trait=Ancestry,Goblin Require="level >= 5"',
  'Cave Climber':Pathfinder2E.FEATS['Cave Climber'],
  'Cling':'Trait=Ancestry,Goblin Require="level >= 9"',
  'Skittering Scuttle':Pathfinder2E.FEATS['Skittering Scuttle'],
  'Very, Very Sneaky':Pathfinder2E.FEATS['Very, Very Sneaky'],
  'Reckless Abandon':'Trait=Ancestry,Goblin Require="level >= 17"',

  'Distracting Shadows':Pathfinder2E.FEATS['Distracting Shadows'],
  'Folksy Patter':'Trait=Ancestry,Halfling',
  'Halfling Lore':Pathfinder2E.FEATS['Halfling Lore'],
  'Halfling Luck':Pathfinder2E.FEATS['Halfling Luck'],
  'Halfling Weapon Familiarity':
    Pathfinder2E.FEATS['Halfling Weapon Familiarity'],
  'Prarie Rider':'Trait=Ancestry,Halfling',
  'Sure Feet':Pathfinder2E.FEATS['Sure Feet'],
  'Titan Slinger':Pathfinder2E.FEATS['Titan Slinger'],
  'Unfettered Halfling':Pathfinder2E.FEATS['Unfettered Halfling'],
  'Watchful Halfling':Pathfinder2E.FEATS['Watchful Halfling'],
  'Cultural Adaptability (%ancestry)':
    Pathfinder2E.FEATS['Cultural Adaptability (%ancestry)'],
  'Step Lively':'Trait=Ancestry,Halfling Require="level >= 5"',
  'Dance Underfoot':
    'Trait=Ancestry,Halfling Require="level >= 9","features.Step Lively"',
  'Guiding Luck':Pathfinder2E.FEATS['Guiding Luck'],
  'Irrepressible':Pathfinder2E.FEATS.Irrepressible,
  'Unhampered Passage':'Trait=Ancestry,Halfling Require="level >= 9"',
  'Ceaseless Shadows':Pathfinder2E.FEATS['Ceaseless Shadows'],
  'Toppling Dance':
    'Trait=Ancestry,Halfling ' +
    'Require="level >= 13","features.Dance Underfoot"',
  'Shadow Self':
    'Trait=Ancestry,Halfling Require="level >= 17","rank.Stealth >= 4"',

  'Adapted Cantrip':Pathfinder2E.FEATS['Adapted Cantrip'],
  'Cooperative Nature':Pathfinder2E.FEATS['Cooperative Nature'],
  'General Training':Pathfinder2E.FEATS['General Training'],
  'Haughty Obstinacy':Pathfinder2E.FEATS['Haughty Obstinacy'],
  'Natural Ambition':Pathfinder2E.FEATS['Natural Ambition'],
  'Natural Skill':Pathfinder2E.FEATS['Natural Skill'],
  'Unconventional Weaponry (%weapon)':
    Pathfinder2E.FEATS['Unconventional Weaponry (%weapon)'],
  'Adaptive Adept':Pathfinder2E.FEATS['Adaptive Adept'],
  'Clever Improviser':Pathfinder2E.FEATS['Clever Improviser'],
  'Sense Allies':'Trait=Ancestry,Human Require="level >= 5"',
  // Requirements changed
  'Cooperative Soul':'Trait=Ancestry,Human Require="level >= 9"',
  'Group Aid':'Trait=Ancestry,Human Require="level >= 9"',
  'Hardy Traveler':'Trait=Ancestry,Human Require="level >= 9"',
  // Requirements changed
  'Incredible Improvisation':'Trait=Ancestry,Human Require="level >= 9"',
  'Multitalented':Pathfinder2E.FEATS.Multitalented,
  'Advanced General Training':'Trait=Ancestry,Human Require="level >= 13"',
  'Bounce Back':'Trait=Ancestry,Human Require="level >= 13"',
  'Stubborn Persistence':'Trait=Ancestry,Human Require="level >= 13"',
  'Heroic Presence':'Trait=Ancestry,Human Require="level >= 17"',

  'Grasping Reach':'Trait=Ancestry,Leshy',
  'Harmlessly Cute':'Trait=Ancestry,Leshy',
  'Leshy Lore':'Trait=Ancestry,Leshy',
  'Leshy Superstition':'Trait=Ancestry,Leshy',
  'Seedpod':'Trait=Ancestry,Leshy',
  'Shadow Of The Wilds':'Trait=Ancestry,Leshy',
  'Undaunted':'Trait=Ancestry,Leshy',
  'Anchoring Roots':'Trait=Ancestry,Leshy Require="level >= 5"',
  'Leshy Glide':
    'Trait=Ancestry,Leshy ' +
    'Require="level >= 5","features.Leaf Leshy || features.Cat Fall"',
  'Ritual Reversion':'Trait=Ancestry,Leshy Require="level >= 5"',
  'Speak With Kindred':'Trait=Ancestry,Leshy Require="level >= 5"',
  'Bark And Tendril':'Trait=Ancestry,Leshy Require="level >= 9"',
  'Lucky Keepsake':
    'Trait=Ancestry,Leshy Require="level >= 9","features.Leshy Superstition"',
  'Solar Rejuvenation':'Trait=Ancestry,Leshy Require="level >= 9"',
  'Thorned Seedpod':
    'Trait=Ancestry,Leshy Require="level >= 9",features.Seedpod',
  'Call Of The Green Man':'Trait=Ancestry,Leshy Require="level >= 13"',
  'Cloak Of Poison':'Trait=Ancestry,Leshy Require="level >= 13"',
  'Flourish And Run':'Trait=Ancestry,Leshy Require="level >= 17"',
  'Regrowth':'Trait=Ancestry,Leshy Require="level >= 17"',

  'Beast Trainer':'Trait=Ancestry,Orc',
  'Iron Fists':'Trait=Ancestry,Orc',
  'Orc Ferocity':Pathfinder2E.FEATS['Orc Ferocity'],
  'Orc Lore':'Trait=Ancestry,Orc',
  // Requirements changed
  'Orc Superstition':'Trait=Ancestry,Orc',
  'Hold Mark':'Trait=Ancestry,Orc',
  'Orc Weapon Familiarity':Pathfinder2E.FEATS['Orc Weapon Familiarity'],
  'Tusks':'Trait=Ancestry,Orc',
  'Athletic Might':'Trait=Ancestry,Orc Require="level >= 5"',
  'Bloody Blows':'Trait=Ancestry,Orc Require="level >= 5"',
  'Defy Death':
    'Trait=Ancestry,Orc Require="level >= 5","features.Orc Ferocity"',
  'Scar-Thick Skin':'Trait=Ancestry,Orc Require="level >= 5"',
  'Pervasive Superstition':
    'Trait=Ancestry,Orc Require="level >= 9","features.Orc Superstition"',
  'Undying Ferocity':
    'Trait=Ancestry,Orc Require="level >= 9","features.Orc Ferocity"',
  'Incredible Ferocity':Pathfinder2E.FEATS['Incredible Ferocity'],
  // TODO requires "animal companion, Pet, or Bonded Animal"
  'Ferocious Beasts':
    'Trait=Ancestry,Orc Require="level >= 13","features.Orc Ferocity"',
  'Spell Devourer':
    'Trait=Ancestry,Orc Require="level >= 13","features.Orc Superstition"',
  'Rampaging Ferocity':
    'Trait=Ancestry,Orc Require="level >= 17","features.Orc Ferocity"',

  // Class
/*
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
*/

  'Bardic Lore':Pathfinder2E.FEATS['Bardic Lore'],
  'Hymn Of Healing':'Trait=Class,Bard"',
  'Lingering Composition':Pathfinder2E.FEATS['Lingering Composition'],
  'Martial Performance':'Trait=Class,Bard Require="features.Warrior"',
  'Reach Spell':
    Pathfinder2E.FEATS['Reach Spell'].replace('Metamagic', 'Spellshape'),
  'Versatile Performance':Pathfinder2E.FEATS['Versatile Performance'],
  'Well-Versed':'Trait=Class,Bard"',
  'Cantrip Expansion':Pathfinder2E.FEATS['Cantrip Expansion'],
  'Directed Audience':'Trait=Class,Bard Require="level >= 2"',
  'Emotional Push':'Trait=Class,Bard,Concentrate Require="level >= 2"',
  'Esoteric Polymath':Pathfinder2E.FEATS['Esoteric Polymath'],
  "Loremaster's Etude":Pathfinder2E.FEATS["Loremaster's Etude"],
  'Multifarious Muse (Enigma)':Pathfinder2E.FEATS['Multifarious Muse (Enigma)'],
  'Multifarious Muse (Maestro)':
    Pathfinder2E.FEATS['Multifarious Muse (Maestro)'],
  'Multifarious Muse (Polymath)':
    Pathfinder2E.FEATS['Multifarious Muse (Polymath)'],
  'Multifarious Muse (Warrior)':
    Pathfinder2E.FEATS['Multifarious Muse (Polymath)'].replace('Polymath', 'Warrior'),
  'Song Of Strength':
    'Trait=Class,Bard Require="level >= 2","features.Warrior"',
  'Uplifting Overature':
    'Trait=Class,Bard Require="level >= 2","features.Maestro"',
  'Combat Reading':'Trait=Class,Bard,Secret Require="level >= 4"',
  'Courageous Advance':
    'Trait=Auditory,Class,Bard,Concentrate,Spellshape ' +
    'Require="level >= 4","features.Warrior"',
  'In Tune':
    'Trait=Class,Bard,Cocentrate,Spellshape ' +
    'Require="level >= 4","features.Maestro"',
  'Melodious Spell':
    Pathfinder2E.FEATS['Melodious Spell'].replace('Manipulate,Metamagic', 'Spellshape'),
  'Rallying Anthem':'Trait=Class,Bard Require="level >= 4"',
  'Triple Time':Pathfinder2E.FEATS['Triple Time'],
  'Versatile Signature':Pathfinder2E.FEATS['Versatile Signature'],
  'Assured Knowledge':
    'Trait=Class,Bard,Fortune Require="level >= 6","features.Enigma"',
  'Defensive Coordination':
    'Trait=Class,Bard,Auditory,Concentration,Spellshape ' +
    'Require="level >= 6","features.Warrior","features.Rallying Anthem"',
  'Dirge Of Doom':Pathfinder2E.FEATS['Dirge Of Doom'],
  'Educate Allies':
    'Trait=Class,Bard,Concentrate Require="level >= 6","features.Well-Versed"',
  'Harmonize':Pathfinder2E.FEATS.Harmonize.replace('Metamagic', 'Spellshape'),
  'Song Of Marching':'Trait=Class,Bard Require="level >= 6"',
  'Steady Spellcasting':Pathfinder2E.FEATS['Steady Spellcasting'],
  'Accompany':'Trait=Class,Bard,Concentrate,Manipulate Require="level >= 8"',
  'Call And Response':
    'Trait=Class,Bard,Auditory,Concentrate,Spellshape Require="level >= 8"',
  'Eclectic Skill':Pathfinder2E.FEATS['Eclectic Skill'],
  'Fortissimo Composition':
    'Trait=Class,Bard Require="level >= 8","features.Maestro"',
  'Know-It-All':Pathfinder2E.FEATS['Know-It-All'],
  'Reflexive Courage':
    'Trait=Class,Bard,Auditory,Concentrate ' +
    'Require="level >= 8","features.Warrior"',
  'Soulsight':'Trait=Class,Bard Require="level >= 8"',
  'Annotate Composition':
    'Trait=Class,Bard,Exploration,Linguistic Require="level >= 10"',
  'Courageous Assault':
    'Trait=Class,Bard,Auditory,Concentrate,Spellshape Require="level >= 10"',
  'House Of Imaginary Walls':Pathfinder2E.FEATS['House Of Imaginary Walls'],
  'Ode To Ouroboros':'Trait=Class,Bard Require="level >= 10"',
  'Quickened Casting':
    Pathfinder2E.FEATS['Quickened Casting'].replace('Metamagic', 'Spellshape'),
  'Symphony Of The Unfettered Heart':'Trait=Class,Bard Require="level >= 10"',
  'Unusual Composition':
    Pathfinder2E.FEATS['Unusual Composition'].replace('Metamagic', 'Spellshape'),
  'Eclectic Polymath':Pathfinder2E.FEATS['Eclectic Polymath'],
  "Enigma's Knowledge":
    'Trait=Class,Bard Require="level >= 12","features.Assured Knowledge"',
  'Inspirational Focus':Pathfinder2E.FEATS['Inspirational Focus'],
  'Reverberate':'Trait=Class,Bard Require="level >= 12"',
  'Shared Assault':
    'Trait=Class,Bard Require="level >= 12","features.Courageous Assault"',
  'Allegro':Pathfinder2E.FEATS.Allegro,
  'Earworm':'Trait=Class,Bard,Exploration Require="level >= 14"',
  'Soothing Ballad':Pathfinder2E.FEATS['Soothing Ballad'],
  'Triumphant Inspiration':
    'Trait=Class,Bard Require="level >= 14","features.Warrior"',
  'True Hypercognition':Pathfinder2E.FEATS['True Hypercognition'],
  'Vigorous Anthem':
    'Trait=Class,Bard,Auditory,Concentrate,Spellshape Require="level >= 14"',
  'Courageous Onslaught':
    'Trait=Class,Bard,Auditory,Concentrate,Spellshape ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Courageous Advance",' +
      '"features.Courageous Assault"',
  'Effortless Concentration':Pathfinder2E.FEATS['Effortless Concentration'],
  'Resounding Finale':
    'Trait=Class,Bard,Concentrate Require="level >= 16","features.Maestro"',
  'Studious Capacity':Pathfinder2E.FEATS['Studious Capacity'],
  'All In My Head':'Trait=Class,Bard,Illusion,Mental Require="level >= 18"',
  'Deep Lore':Pathfinder2E.FEATS['Deep Lore'],
  'Discordant Voice':
    'Trait=Class,Bard,Sonic Require="level >= 18","features.Courageous Anthem"',
  'Eternal Composition':Pathfinder2E.FEATS['Eternal Composition'],
  'Impossible Polymath':Pathfinder2E.FEATS['Impossible Polymath'],
  'Fatal Aria':Pathfinder2E.FEATS['Fatal Aria'],
  'Perfect Encore':Pathfinder2E.FEATS['Perfect Encore'],
  'Pied Piping':'Trait=Class,Bard Require="level >= 20"',
  'Symphony Of The Muse':Pathfinder2E.FEATS['Symphony Of The Muse'],
  'Ultimate Polymath':
    'Trait=Class,Bard Require="level >= 20","features.Polymath"',

/*
  "Deity's Domain (Air)":
    'Trait=Class,Champion Require="deityDomains =~ \'Air\'"',
  "Deity's Domain (Ambition)":
    'Trait=Class,Champion Require="deityDomains =~ \'Ambition\'"',
  "Deity's Domain (Cities)":
    'Trait=Class,Champion Require="deityDomains =~ \'Cities\'"',
  "Deity's Domain (Confidence)":
    'Trait=Class,Champion Require="deityDomains =~ \'Confidence\'"',
  "Deity's Domain (Creation)":
    'Trait=Class,Champion Require="deityDomains =~ \'Creation\'"',
  "Deity's Domain (Darkness)":
    'Trait=Class,Champion Require="deityDomains =~ \'Darkness\'"',
  "Deity's Domain (Death)":
    'Trait=Class,Champion Require="deityDomains =~ \'Death\'"',
  "Deity's Domain (Destruction)":
    'Trait=Class,Champion Require="deityDomains =~ \'Destruction\'"',
  "Deity's Domain (Dreams)":
    'Trait=Class,Champion Require="deityDomains =~ \'Dreams\'"',
  "Deity's Domain (Earth)":
    'Trait=Class,Champion Require="deityDomains =~ \'Earth\'"',
  "Deity's Domain (Family)":
    'Trait=Class,Champion Require="deityDomains =~ \'Family\'"',
  "Deity's Domain (Fate)":
    'Trait=Class,Champion Require="deityDomains =~ \'Fate\'"',
  "Deity's Domain (Fire)":
    'Trait=Class,Champion Require="deityDomains =~ \'Fire\'"',
  "Deity's Domain (Freedom)":
    'Trait=Class,Champion Require="deityDomains =~ \'Freedom\'"',
  "Deity's Domain (Healing)":
    'Trait=Class,Champion Require="deityDomains =~ \'Healing\'"',
  "Deity's Domain (Indulgence)":
    'Trait=Class,Champion Require="deityDomains =~ \'Indulgence\'"',
  "Deity's Domain (Knowledge)":
    'Trait=Class,Champion Require="deityDomains =~ \'Knowledge\'"',
  "Deity's Domain (Luck)":
    'Trait=Class,Champion Require="deityDomains =~ \'Luck\'"',
  "Deity's Domain (Magic)":
    'Trait=Class,Champion Require="deityDomains =~ \'Magic\'"',
  "Deity's Domain (Might)":
    'Trait=Class,Champion Require="deityDomains =~ \'Might\'"',
  "Deity's Domain (Moon)":
    'Trait=Class,Champion Require="deityDomains =~ \'Moon\'"',
  "Deity's Domain (Nature)":
    'Trait=Class,Champion Require="deityDomains =~ \'Nature\'"',
  "Deity's Domain (Nightmares)":
    'Trait=Class,Champion Require="deityDomains =~ \'Nightmares\'"',
  "Deity's Domain (Pain)":
    'Trait=Class,Champion Require="deityDomains =~ \'Pain\'"',
  "Deity's Domain (Passion)":
    'Trait=Class,Champion Require="deityDomains =~ \'Passion\'"',
  "Deity's Domain (Perfection)":
    'Trait=Class,Champion Require="deityDomains =~ \'Perfection\'"',
  "Deity's Domain (Protection)":
    'Trait=Class,Champion Require="deityDomains =~ \'Protection\'"',
  "Deity's Domain (Secrecy)":
    'Trait=Class,Champion Require="deityDomains =~ \'Secrecy\'"',
  "Deity's Domain (Sun)":
    'Trait=Class,Champion Require="deityDomains =~ \'Sun\'"',
  "Deity's Domain (Travel)":
    'Trait=Class,Champion Require="deityDomains =~ \'Travel\'"',
  "Deity's Domain (Trickery)":
    'Trait=Class,Champion Require="deityDomains =~ \'Trickery\'"',
  "Deity's Domain (Truth)":
    'Trait=Class,Champion Require="deityDomains =~ \'Truth\'"',
  "Deity's Domain (Tyranny)":
    'Trait=Class,Champion Require="deityDomains =~ \'Tyranny\'"',
  "Deity's Domain (Undeath)":
    'Trait=Class,Champion Require="deityDomains =~ \'Undeath\'"',
  "Deity's Domain (Water)":
    'Trait=Class,Champion Require="deityDomains =~ \'Water\'"',
  "Deity's Domain (Wealth)":
    'Trait=Class,Champion Require="deityDomains =~ \'Wealth\'"',
  "Deity's Domain (Zeal)":
    'Trait=Class,Champion Require="deityDomains =~ \'Zeal\'"',
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
    'Require="level >= 4","spells.Lay On Hands (D1 Foc Nec)"',
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
  "Advanced Deity's Domain (Air)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Air)"',
  "Advanced Deity's Domain (Ambition)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Ambition)"',
  "Advanced Deity's Domain (Cities)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Cities)"',
  "Advanced Deity's Domain (Confidence)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Confidence)"',
  "Advanced Deity's Domain (Creation)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Creation)"',
  "Advanced Deity's Domain (Darkness)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Darkness)"',
  "Advanced Deity's Domain (Death)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Death)"',
  "Advanced Deity's Domain (Destruction)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Destruction)"',
  "Advanced Deity's Domain (Dreams)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Dreams)"',
  "Advanced Deity's Domain (Earth)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Earth)"',
  "Advanced Deity's Domain (Family)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Family)"',
  "Advanced Deity's Domain (Fate)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Fate)"',
  "Advanced Deity's Domain (Fire)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Fire)"',
  "Advanced Deity's Domain (Freedom)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Freedom)"',
  "Advanced Deity's Domain (Healing)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Healing)"',
  "Advanced Deity's Domain (Indulgence)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Indulgence)"',
  "Advanced Deity's Domain (Knowledge)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Knowledge)"',
  "Advanced Deity's Domain (Luck)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Luck)"',
  "Advanced Deity's Domain (Magic)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Magic)"',
  "Advanced Deity's Domain (Might)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Might)"',
  "Advanced Deity's Domain (Moon)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Moon)"',
  "Advanced Deity's Domain (Nature)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Nature)"',
  "Advanced Deity's Domain (Nightmares)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Nightmares)"',
  "Advanced Deity's Domain (Pain)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Pain)"',
  "Advanced Deity's Domain (Passion)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Passion)"',
  "Advanced Deity's Domain (Perfection)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Perfection)"',
  "Advanced Deity's Domain (Protection)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Protection)"',
  "Advanced Deity's Domain (Secrecy)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Secrecy)"',
  "Advanced Deity's Domain (Sun)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Sun)"',
  "Advanced Deity's Domain (Travel)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Travel)"',
  "Advanced Deity's Domain (Trickery)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Trickery)"',
  "Advanced Deity's Domain (Truth)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Truth)"',
  "Advanced Deity's Domain (Tyranny)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Tyranny)"',
  "Advanced Deity's Domain (Undeath)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Undeath)"',
  "Advanced Deity's Domain (Water)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Water)"',
  "Advanced Deity's Domain (Wealth)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Wealth)"',
  "Advanced Deity's Domain (Zeal)":
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Zeal)"',
  'Greater Mercy':'Trait=Class,Champion Require="level >= 8","features.Mercy"',
  'Heal Mount':
    'Trait=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Divine Ally (Steed)",' +
      '"spells.Lay On Hands (D1 Foc Nec)"',
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
*/

  'Deadly Simplicity':Pathfinder2E.FEATS['Deadly Simplicity'],
  'Divine Castigation':Pathfinder2E.FEATS['Holy Castigation'],
  'Domain Initiate (Air)':Pathfinder2E.FEATS['Domain Initiate (Air)'],
  'Domain Initiate (Ambition)':Pathfinder2E.FEATS['Domain Initiate (Ambition)'],
  'Domain Initiate (Cities)':Pathfinder2E.FEATS['Domain Initiate (Cities)'],
  'Domain Initiate (Confidence)':
    Pathfinder2E.FEATS['Domain Initiate (Confidence)'],
  'Domain Initiate (Creation)':Pathfinder2E.FEATS['Domain Initiate (Creation)'],
  'Domain Initiate (Darkness)':Pathfinder2E.FEATS['Domain Initiate (Darkness)'],
  'Domain Initiate (Death)':Pathfinder2E.FEATS['Domain Initiate (Death)'],
  'Domain Initiate (Destruction)':
    Pathfinder2E.FEATS['Domain Initiate (Destruction)'],
  'Domain Initiate (Dreams)':Pathfinder2E.FEATS['Domain Initiate (Dreams)'],
  'Domain Initiate (Earth)':Pathfinder2E.FEATS['Domain Initiate (Earth)'],
  'Domain Initiate (Family)':Pathfinder2E.FEATS['Domain Initiate (Family)'],
  'Domain Initiate (Fate)':Pathfinder2E.FEATS['Domain Initiate (Fate)'],
  'Domain Initiate (Fire)':Pathfinder2E.FEATS['Domain Initiate (Fire)'],
  'Domain Initiate (Freedom)':Pathfinder2E.FEATS['Domain Initiate (Freedom)'],
  'Domain Initiate (Healing)':Pathfinder2E.FEATS['Domain Initiate (Healing)'],
  'Domain Initiate (Indulgence)':
    Pathfinder2E.FEATS['Domain Initiate (Indulgence)'],
  'Domain Initiate (Knowledge)':
    Pathfinder2E.FEATS['Domain Initiate (Knowledge)'],
  'Domain Initiate (Luck)':Pathfinder2E.FEATS['Domain Initiate (Luck)'],
  'Domain Initiate (Magic)':Pathfinder2E.FEATS['Domain Initiate (Magic)'],
  'Domain Initiate (Might)':Pathfinder2E.FEATS['Domain Initiate (Might)'],
  'Domain Initiate (Moon)':Pathfinder2E.FEATS['Domain Initiate (Moon)'],
  'Domain Initiate (Nature)':Pathfinder2E.FEATS['Domain Initiate (Nature)'],
  'Domain Initiate (Nightmares)':
    Pathfinder2E.FEATS['Domain Initiate (Nightmares)'],
  'Domain Initiate (Pain)':Pathfinder2E.FEATS['Domain Initiate (Pain)'],
  'Domain Initiate (Passion)':Pathfinder2E.FEATS['Domain Initiate (Passion)'],
  'Domain Initiate (Perfection)':
    Pathfinder2E.FEATS['Domain Initiate (Perfection)'],
  'Domain Initiate (Protection)':
    Pathfinder2E.FEATS['Domain Initiate (Protection)'],
  'Domain Initiate (Secrecy)':Pathfinder2E.FEATS['Domain Initiate (Secrecy)'],
  'Domain Initiate (Sun)':Pathfinder2E.FEATS['Domain Initiate (Sun)'],
  'Domain Initiate (Travel)':Pathfinder2E.FEATS['Domain Initiate (Travel)'],
  'Domain Initiate (Trickery)':Pathfinder2E.FEATS['Domain Initiate (Trickery)'],
  'Domain Initiate (Truth)':Pathfinder2E.FEATS['Domain Initiate (Truth)'],
  'Domain Initiate (Tyranny)':Pathfinder2E.FEATS['Domain Initiate (Tyranny)'],
  'Domain Initiate (Undeath)':Pathfinder2E.FEATS['Domain Initiate (Undeath)'],
  'Domain Initiate (Water)':Pathfinder2E.FEATS['Domain Initiate (Water)'],
  'Domain Initiate (Wealth)':Pathfinder2E.FEATS['Domain Initiate (Wealth)'],
  'Domain Initiate (Zeal)':Pathfinder2E.FEATS['Domain Initiate (Zeal)'],
  'Harming Hands':Pathfinder2E.FEATS['Harming Hands'],
  'Healing Hands':Pathfinder2E.FEATS['Healing Hands'],
  'Premonition Of Avoidance':'Trait=Class,Cleric',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    Pathfinder2E.FEATS['Deadly Simplicity'].replace('Positive', 'Vitality'),
  'Emblazon Armament':Pathfinder2E.FEATS['Emblazon Armament'],
  'Panic The Dead':
    'Trait=Class,Cleric,Emotion,Fear,Mental Require="level >= 2"',
  'Rapid Response':'Trait=Class,Cleric Require="level >= 2"',
  'Sap Life':Pathfinder2E.FEATS['Sap Life'],
  'Versatile Font':Pathfinder2E.FEATS['Versatile Font'],
  "Warpriest's Armor":
    'Trait=Class,Cleric Require="level >= 2","features.Warpriest"',
  // Traits and requirements changed
  'Channel Smite':'Trait=Class,Cleric,Divine Require="level >= 4"',
  'Directed Channel':Pathfinder2E.FEATS['Directed Channel'],
  'Divine Infusion':
    'Trait=Class,Cleric,Concentrate,Spellshape Require="level >= 4"',
  'Raise Symbol':'Trait=Class,Cleric Require="level >= 4"',
  'Restorative Strike':'Trait=Class,Cleric Require="level >= 4"',
  'Sacred Ground':
    'Trait=Class,Cleric,Consecration,Divine,Exploration ' +
    'Require="level >= 4","features.Harmful Font || feature.Healing Font"',
  // Traits and requirements changed
  'Cast Down':'Trait=Class,Cleric,Concentrate,Spellshape Require="level >= 6"',
  'Divine Rebuttal':'Trait=Class,Cleric,Divine Require="level >= 6"',
  'Divine Weapon':Pathfinder2E.FEATS['Divine Weapon'],
  'Magic Hands':
    'Trait=Class,Cleric Require="level >= 6","features.Healing Hands"',
  'Selective Energy':Pathfinder2E.FEATS['Selective Energy'],
  // Steady Spellcasting as above
  'Advanced Domain (Air)':Pathfinder2E.FEATS['Advanced Domain (Air)'],
  'Advanced Domain (Ambition)':Pathfinder2E.FEATS['Advanced Domain (Ambition)'],
  'Advanced Domain (Cities)':Pathfinder2E.FEATS['Advanced Domain (Cities)'],
  'Advanced Domain (Confidence)':
    Pathfinder2E.FEATS['Advanced Domain (Confidence)'],
  'Advanced Domain (Creation)':Pathfinder2E.FEATS['Advanced Domain (Creation)'],
  'Advanced Domain (Darkness)':Pathfinder2E.FEATS['Advanced Domain (Darkness)'],
  'Advanced Domain (Death)':Pathfinder2E.FEATS['Advanced Domain (Death)'],
  'Advanced Domain (Destruction)':
    Pathfinder2E.FEATS['Advanced Domain (Destruction)'],
  'Advanced Domain (Dreams)':Pathfinder2E.FEATS['Advanced Domain (Dreams)'],
  'Advanced Domain (Earth)':Pathfinder2E.FEATS['Advanced Domain (Earth)'],
  'Advanced Domain (Family)':Pathfinder2E.FEATS['Advanced Domain (Family)'],
  'Advanced Domain (Fate)':Pathfinder2E.FEATS['Advanced Domain (Fate)'],
  'Advanced Domain (Fire)':Pathfinder2E.FEATS['Advanced Domain (Fire)'],
  'Advanced Domain (Freedom)':Pathfinder2E.FEATS['Advanced Domain (Freedom)'],
  'Advanced Domain (Healing)':Pathfinder2E.FEATS['Advanced Domain (Healing)'],
  'Advanced Domain (Indulgence)':
    Pathfinder2E.FEATS['Advanced Domain (Indulgence)'],
  'Advanced Domain (Knowledge)':
    Pathfinder2E.FEATS['Advanced Domain (Knowledge)'],
  'Advanced Domain (Luck)':Pathfinder2E.FEATS['Advanced Domain (Luck)'],
  'Advanced Domain (Magic)':Pathfinder2E.FEATS['Advanced Domain (Magic)'],
  'Advanced Domain (Might)':Pathfinder2E.FEATS['Advanced Domain (Might)'],
  'Advanced Domain (Moon)':Pathfinder2E.FEATS['Advanced Domain (Moon)'],
  'Advanced Domain (Nature)':Pathfinder2E.FEATS['Advanced Domain (Nature)'],
  'Advanced Domain (Nightmares)':
    Pathfinder2E.FEATS['Advanced Domain (Nightmares)'],
  'Advanced Domain (Pain)':Pathfinder2E.FEATS['Advanced Domain (Pain)'],
  'Advanced Domain (Passion)':Pathfinder2E.FEATS['Advanced Domain (Passion)'],
  'Advanced Domain (Perfection)':
    Pathfinder2E.FEATS['Advanced Domain (Perfection)'],
  'Advanced Domain (Protection)':
    Pathfinder2E.FEATS['Advanced Domain (Protection)'],
  'Advanced Domain (Secrecy)':Pathfinder2E.FEATS['Advanced Domain (Secrecy)'],
  'Advanced Domain (Sun)':Pathfinder2E.FEATS['Advanced Domain (Sun)'],
  'Advanced Domain (Travel)':Pathfinder2E.FEATS['Advanced Domain (Travel)'],
  'Advanced Domain (Trickery)':Pathfinder2E.FEATS['Advanced Domain (Trickery)'],
  'Advanced Domain (Truth)':Pathfinder2E.FEATS['Advanced Domain (Truth)'],
  'Advanced Domain (Tyranny)':Pathfinder2E.FEATS['Advanced Domain (Tyranny)'],
  'Advanced Domain (Undeath)':Pathfinder2E.FEATS['Advanced Domain (Undeath)'],
  'Advanced Domain (Water)':Pathfinder2E.FEATS['Advanced Domain (Water)'],
  'Advanced Domain (Wealth)':Pathfinder2E.FEATS['Advanced Domain (Wealth)'],
  'Advanced Domain (Zeal)':Pathfinder2E.FEATS['Advanced Domain (Zeal)'],
  'Cremate Undead':Pathfinder2E.FEATS['Cremate Undead'],
  'Emblazon Energy':Pathfinder2E.FEATS['Emblazon Armament'],
  'Martyr':'Trait=Class,Cleric,Spellshape Require="level >= 8"',
  'Restorative Channel':
    'Trait=Class,Cleric Require="level >= 8","features.Healing Font"',
  'Sanctify Armament':
    'Trait=Class,Cleric,Divine ' +
    'Require="level >= 8","features.Holy || features.Unholy"',
  'Surging Focus':'Trait=Class,Cleric Require="level >= 8"',
  'Void Siphon':'Trait=Class,Cleric Require="level >= 8"',
  'Zealous Rish':'Trait=Class,Cleric Require="level >= 8"',
  'Castigating Weapon':
    Pathfinder2E.FEATS['Castigating Weapon'].replace('Holy Castigation', 'Divine Castigation'),
  // Traits and requirements changed
  'Heroic Recovery':
    'Trait=Class,Cleric,Concentrate,Spellshape ' +
    'Require="level >= 10","features.Healing Font"',
  'Replenishment Of War':Pathfinder2E.FEATS['Replenishment Of War'],
  'Shared Avoidance':
    'Trait=Class,Cleric ' +
    'Require="level >= 10","features.Premonition Of Avoidance"',
  'Shield Of Faith':
    'Trait=Class,Cleric Require="level >= 10","features.Domain Initiate"',
  // Traits and requirements changed
  'Defensive Recovery':
    'Trait=Class,Cleric,Concentrate,Spellshape Require="level >= 12"',
  'Domain Focus':Pathfinder2E.FEATS['Domain Focus'],
  'Emblazon Antimagic':Pathfinder2E.FEATS['Emblazon Antimagic'],
  'Foctunate Relief':'Trait=Class,Cleric,Fortune Require="level >= 12"',
  'Sapping Symbol':
    'Trait=Class,Cleric Require="level >= 12","features.Raise Symbol"',
  'Shared Replenishment':Pathfinder2E.FEATS['Shared Replenishment'],
  'Channeling Block':
    'Trait=Class,Cleric Require="level >= 14","features.Shield Block"',
  "Deity's Protection":Pathfinder2E.FEATS["Deity's Protection"],
  'Ebb An Flow':
    'Trait=Class,Cleric,Concentrate,Spellshape ' +
    'Require="level >= 14","features.Versatile Font"',
  'Fast Channel':Pathfinder2E.FEATS['Fast Channel'],
  'Lasting Armament':
    'Trait=Class,Cleric Require="level >= 14","features.Sanctify Armament"',
  'Premonition Of Clarity':'Trait=Class,Cleric Require="level >= 14"',
  'Swift Banishment':Pathfinder2E.FEATS['Swift Banishment'],
  // Requirements changed
  'Eternal Bane':'Trait=Class,Cleric Require="level >= 16","features.Unholy"',
  // Requirements changed
  'Eternal Blessing':'Trait=Class,Cleric Require="level >= 16","features.Holy"',
  'Rebounding Smite':
    'Trait=Class,Cleric Require="level >= 16","features.Channel Smite"',
  'Remediate':'Trait=Class,Cleric Require="level >= 16"',
  'Resurrectionist':Pathfinder2E.FEATS.Resurrectionist,
  'Divine Apex':'Trait=Class,Cleric Require="level >= 18"',
  'Echoing Channel':
    Pathfinder2E.FEATS['Deadly Simplicity'].replace('Metamagic', 'Spellshape'),
  'Improved Swift Banishment':Pathfinder2E.FEATS['Improved Swift Banishment'],
  'Inviolable':'Trait=Class,Cleric Require="level >= 18"',
  'Miraculous Possibility':'Trait=Class,Cleric Require="level >= 18"',
  'Shared Clarity':
    'Trait=Class,Cleric ' +
    'Require="level >= 18","features.Premonition Of Clarity"',
  "Avatar's Audience":Pathfinder2E.FEATS["Avatar's Audience"],
  "Avatar's Protection":'Trait=Class,Cleric Require="level >= 20"',
  'Maker Of Miracles':Pathfinder2E.FEATS['Maker Of Miracles'],
  'Spellshape Channel':Pathfinder2E.FEATS['Metamagic Channel'],

/*
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
    'Trait=Class,Druid ' +
    'Require="level >= 2","features.Animal == 0"',
  'Order Explorer (Leaf)':
    'Trait=Class,Druid ' +
    'Require="level >= 2","features.Leaf == 0"',
  'Order Explorer (Storm)':
    'Trait=Class,Druid ' +
    'Require="level >= 2","features.Storm == 0"',
  'Order Explorer (Wild)':
    'Trait=Class,Druid ' +
    'Require="level >= 2","features.Wild == 0"',
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
      '"spells.Tempest Surge (P1 Foc Evo)"',
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
  'Determination':'Trait=Class,Fighter,Concentrate Require="level >= 14"',
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

  'Crane Stance':'Trait=Class,Monk,Stance',
  'Dragon Stance':'Trait=Class,Monk,Stance',
  'Ki Rush':'Trait=Class,Monk',
  'Ki Strike':'Trait=Class,Monk',
  'Monastic Weaponry':'Trait=Class,Monk',
  'Mountain Stance':'Trait=Class,Monk,Stance',
  'Tiger Stance':'Trait=Class,Monk,Stance',
  'Wolf Stance':'Trait=Class,Monk,Stance',
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
    'Require="level >= 14","knowsDispelMagicSpell"',
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
    'Require=' +
      '"level >= 2",' +
      '"intelligence >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Alchemist == 0"',
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
      '"strength >= 14 || multiclassAbilityRequirementsWaived",' +
      '"constitution >= 14 || multiclassAbilityRequirementsWaived",' +
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
    'Require=' +
      '"level >= 2",' +
      '"charisma >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Bard == 0"',
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
      '"strength >= 14 || multiclassAbilityRequirementsWaived",' +
      '"charisma >= 14 || multiclassAbilityRequirementsWaived",' +
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
      '"rank.Unarmored Defense >= 2 || rank.Light Armor >= 2 || rank.Medium Armor >= 2 || rank.Heavy Armor >= 2"',

  'Cleric Dedication':
    'Trait=Archetype,Dedication,Multiclass,Cleric ' +
    'Require=' +
      '"level >= 2",' +
      '"wisdom >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Cleric == 0"',
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
    'Require=' +
      '"level >= 2",' +
      '"wisdom >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Druid == 0"',
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
      '"strength >= 14 || multitalentedHalfElf",' +
      '"dexterity >= 14 || multitalentedHalfElf",' +
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
      '"maxWeaponTraining >= 2 || rank.Unarmed Attacks >= 2"',

  'Monk Dedication':
    'Trait=Archetype,Dedication,Multiclass,Monk ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14 || multitalentedHalfElf",' +
      '"dexterity >= 14 || multitalentedHalfElf",' +
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
    'Require=' +
      '"level >= 2",' +
      '"dexterity >= 14 || multitalentedHalfElf",' +
      '"levels.Ranger == 0"',
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
    'Require=' +
      '"level >= 2",' +
      '"dexterity >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Rogue == 0"',
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
    'Require=' +
      '"level >= 2",' +
      '"charisma >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Sorcerer == 0"',
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
    'Require=' +
      '"level >= 2",' +
      '"intelligence >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Wizard == 0"',
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
*/

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
  'Weapon Proficiency (%advancedWeapon)':'Trait=General',
  'Ancestral Paragon':'Trait=General Require="level >= 3"',
  'Untrained Improvisation':'Trait=General Require="level >= 3"',
  'Expeditious Search':
    'Trait=General Require="level >= 7","rank.Perception >= 2"',
  'Incredible Investiture':
    'Trait=General Require="level >= 11","charisma >= 16"',

  // Skill
  'Assurance (%skill)':'Trait=Fortune,General,Skill Require="rank.%skill >= 1"',
  'Dubious Knowledge':'Trait=General,Skill',
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
Pathfinder2ERemaster.FEATURES = {

  // TODO

  // Ancestry
  'Ancestry Feats':'Section=feature Note="%V selections"',

  'Ancient-Blooded Dwarf':Pathfinder2E.FEATURES['Ancient-Blooded Dwarf'],
  'Ancient Elf':'Section=feature Note="+1 Class Feat (multiclass dedication)"',
  'Arctic Elf':Pathfinder2E.FEATURES['Arctic Elf'],
  'Cactus Leshy':
    'Section=combat Note="Spines unarmed attack inflicts 1d6 HP piercing"',
  'Call On Ancient Blood':Pathfinder2E.FEATURES['Call On Ancient Blood'],
  'Cavern Elf':Pathfinder2E.FEATURES['Cavern Elf'],
  'Chameleon Gnome':Pathfinder2E.FEATURES['Chameleon Gnome'],
  'Charhide Goblin':Pathfinder2E.FEATURES['Charhide Goblin'],
  'Darkvision':Pathfinder2E.FEATURES['Darkvision'],
  'Death Warden Dwarf':
    Pathfinder2E.FEATURES['Death Warden Dwarf'].replace('necromancy', 'void and undead'),
  'Dwarf Heritage':'Section=feature Note="1 selection"',
  'Elf Heritage':'Section=feature Note="1 selection"',
  'Fast':'Section=ability Note="+5 Speed"',
  'Fey-Touched Gnome':Pathfinder2E.FEATURES['Fey-Touched Gnome'],
  'Forge Dwarf':Pathfinder2E.FEATURES['Forge Dwarf'],
  'Fruit Leshy':
    'Section=magic ' +
    'Note="Produces a fruit each day that restores %{1+(level-1)//2}d8 HP if eaten within an hour after removal"',
  'Fungus Leshy':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Darkvision feature",' +
      '"Has the fungus trait, not the plant trait"',
  'Gnome Heritage':'Section=feature Note="1 selection"',
  'Goblin Heritage':'Section=feature Note="1 selection"',
  'Gourd Leshy':
    'Section=feature Note="Can store 1 Bulk of objects within head"',
  'Gutsy Halfling':Pathfinder2E.FEATURES['Gutsy Halfling'],
  'Half-Elf':'Section=feature Note="Has the Low-Light Vision feature"',
  'Half-Orc':'Section=feature Note="Has the Low-Light Vision feature"',
  'Halfling Heritage':'Section=feature Note="1 selection"',
  'Hillock Halfling':Pathfinder2E.FEATURES['Hillock Halfling'],
  'Human Heritage':'Section=feature Note="1 selection"',
  'Irongut Goblin':Pathfinder2E.FEATURES['Irongut Goblin'],
  'Jinx':
    'Action=2 ' +
    'Section=magic ' +
    'Note="R30\' Inflicts clumsy 1 for 1 min (<b>save Will</b> negates; critical failure inflicts clumsy 2 for 1 min)"',
  'Jinxed Halfling':'Section=feature Note="Has the Jinx feature"',
  'Leaf Leshy':'Section=save Note="Takes no damage from falling"',
  'Lotus Leshy':
    'Section=ability ' +
    'Note="Can walk at %{speed//2}\' Speed across still liquids and Balance to move across flowing water"',
  'Low-Light Vision':'Section=feature Note="Has normal vision in dim light"',
  'Keen Eyes':
    'Section=combat,skill ' +
    'Note=' +
      '"Reduces the DC to target a concealed foe to 3 and a hidden foe to 9",' +
      '"R30\' +2 Seek to find hidden creatures"',
  'Leshy Heritage':'Section=feature Note="1 selection"',
  'Nomadic Halfling':Pathfinder2E.FEATURES['Nomadic Halfling'],
  'Razortooth Goblin':Pathfinder2E.FEATURES['Razortooth Goblin'],
  'Rock Dwarf':
    Pathfinder2E.FEATURES['Rock Dwarf'].replace('Shove', 'Reposition, Shove'),
  'Root Leshy':
    'Section=combat,combat,feature ' +
    'Note=' +
      '"+2 Hit Points",' +
      '"+2 vs. attempts to Reposition, Shove, or Trip",' +
      '"Can go 2 weeks without sunlight before starving"',
  'Seaweek Leshy':
    'Section=ability,ability ' +
    'Note=' +
      '"-5 Speed",' +
      '"Has a 20\' swim Speed and can breathe water"',
  'Seer Elf':Pathfinder2E.FEATURES['Seer Elf'],
  'Sensate Gnome':Pathfinder2E.FEATURES['Sensate Gnome'],
  'Skilled Human':Pathfinder2E.FEATURES['Skilled Heritage Human'],
  'Slow':'Section=ability Note="-5 Speed"',
  'Snow Goblin':Pathfinder2E.FEATURES['Snow Goblin'],
  'Strong-Blooded Dwarf':Pathfinder2E.FEATURES['Strong-Blooded Dwarf'],
  'Twilight Halfling':Pathfinder2E.FEATURES['Twilight Halfling'],
  'Umbral Gnome':Pathfinder2E.FEATURES['Umbral Gnome'],
  'Unbreakable Goblin':Pathfinder2E.FEATURES['Unbreakable Goblin'],
  'Versatile Human':Pathfinder2E.FEATURES['Versatile Heritage Human'],
  'Vine Leshy':
    'Section=skill ' +
    'Note="Can Climb with both hands occupied, and successes to Climb are critical successes"',
  'Wellspring Gnome':Pathfinder2E.FEATURES['Wellspring Gnome'],
  'Wellspring Gnome (Arcane)':
    Pathfinder2E.FEATURES['Wellspring Gnome (Arcane)'],
  'Wellspring Gnome (Divine)':
    Pathfinder2E.FEATURES['Wellspring Gnome (Divine)'],
  'Wellspring Gnome (Occult)':
    Pathfinder2E.FEATURES['Wellspring Gnome (Occult)'],
  // Changed
  'Whisper Elf':
    'Section=skill ' +
    'Note="+2 Seek within 30\' and reduces flat check DC to find concealed or hidden targets to 3 or 9"',
  'Wildwood Halfling':Pathfinder2E.FEATURES['Wildwood Halfling'],
  'Woodland Elf':Pathfinder2E.FEATURES['Woodland Elf'],

  // Ancestry feats
  'Dwarven Doughtiness':
    'Section=save Note="Reduces frightened condition by 2 at the end of turn"',
  // Changed
  'Dwarven Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Dwarven Lore) feature",' +
      '"Skill Trained (Crafting; Religion)"',
  // Changed
  // TODO probably change how weapon familiarity is handed in Pathfinder2E.js
  'Dwarven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Dwarf Weapons; Battle Axe; Pick; Warhammer)",' +
      '"Has access to uncommon dwarf weapons%{level>=5?\'/Critical hits with a dwarf weapon, battle axe, pick, or warhammer inflict its critical specialization effect\':\'\'}"',
  'Rock Runner':
    Pathfinder2E.FEATURES['Rock Runner'].replace('flat-footed', 'off-guard'),
  // Changed from Stonecunning
  "Stonemason's Eye":
    'Section=skill ' +
    'Note="Skill Trained (Crafting)/+2 Perception (unusual stonework)/Automatically attempts a%{features.Stonewalker&&rank.Perception>=4?\' +2\':\'\'} check to notice unusual stonework"',
  'Unburdened Iron':Pathfinder2E.FEATURES['Unburdened Iron'],
  'Boulder Roll':Pathfinder2E.FEATURES['Boulder Roll'],
  'Defy The Darkness':
    'Section=feature,magic ' +
    'Note=' +
      '"Can use Darkvision in magical darkness",' +
      '"Cannot use darkness magic"',
  'Dwarven Reinforcement':
    'Section=skill ' +
    'Note="Can use 1 hr work to give an item +%{levels.Crafting>=4?3:levels.Crafting>=3?2:1} Hardness for 24 hr"',
  'Dwarven Weapon Cunning':
    'Section=combat ' +
    'Note="Critical hits with a battle axe, pick, warhammer, or dwarf weapon inflict its critical specialization effect"',
  'Echoes In Stone':
    'Section=feature ' +
    'Note="Has 20\' imprecise tremorsense when standing on earth or stone"',
  "Mountain's Stoutness":Pathfinder2E.FEATURES["Mountain's Stoutness"],
  'Stone Bones':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful DC 17 flat check turns a critical physical hit into a normal hit"',
  'Stonewalker':Pathfinder2E.FEATURES.Stonewalker,
  'March The Mines':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strides or Burrows 15\' twice, taking along an adjacent willing ally"',
  'Telluric Power':
    'Section=magic ' +
    'Note="Inflicts additional damage equal to the number of weapon damage dice to a foe standing on the same earth or stone surface"',
  'Stonegate':
    'Section=magic ' +
    'Note="Knows the Magic Passage divine innate spell; may cast it once per day to open passages through earth or stone"',
  'Stonewall':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Self becomes petrified until the end of turn, negating damage from the triggering effect or failed Fortitude save that would not affect stone"',

  'Ancestral Longevity':Pathfinder2E.FEATURES['Ancestral Longevity'],
  'Elven Lore':Pathfinder2E.FEATURES['Elven Lore'],
  // Changed
  'Elven Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Elf Weapons; Longbow; Composite Longbow; Rapier; Shortbow; Composite Shortbow)",' +
      '"Has access to uncommon elf weapons%{level>=5?\'/Critical hits with an elf weapon, longbow, composite longbow, rapier, shortbow, or composite shortbow inflict its critical specialization effect\':\'\'}"',
  'Forlorn':Pathfinder2E.FEATURES.Forlorn,
  'Nimble Elf':Pathfinder2E.FEATURES['Nimble Elf'],
  'Otherworldly Magic':Pathfinder2E.FEATURES['Otherworldly Magic'],
  'Unwavering Mien':Pathfinder2E.FEATURES['Unwavering Mien'],
  'Ageless Patience':Pathfinder2E.FEATURES['Ageless Patience'],
  'Ancestral Suspicion':
    'Section=save,skill ' +
    'Note=' +
      '"+2 vs. control effects, and successes are critical successes",' +
      '"+2 Perception to detect controlled creatures"',
  'Martial Experience':
    'Section=combat ' +
    'Note="%{level>=11?\'Skill Trained (Simple Weapons; Martial Weapons; Advanced Weapons)\':\'+\'+level+\' attack with untrained weapons\'}"',
  'Elf Step':Pathfinder2E.FEATURES['Elf Step'],
  'Expert Longevity':Pathfinder2E.FEATURES['Expert Longevity'],
  'Otherworldly Acumen':
    'Section=magic ' +
    'Note="Can cast a chosen 2nd-rank spell as an innate spell once per day and use a day of downtime to change the spell chosen"',
  'Tree Climber':'Section=ability Note="Has a 20\' climb Speed"',
  'Avenge Ally':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Uses the better of two rolls on a Strike when within 30\' of a dying ally once per 10 min"',
  'Universal Longevity':Pathfinder2E.FEATURES['Universal Longevity'],
  'Magic Rider':
    'Section=magic ' +
    'Note="Can teleport another person when affected by a multiple-target teleportation spell, and always arrives within 1 mile of the desired location"',

  'Animal Accomplice':Pathfinder2E.FEATURES['Animal Accomplice'],
  // Changed from Burrow Elocutionist
  'Animal Elocutionist':
    'Section=skill ' +
    'Note="Can speak with animals and gains +1 to Make An Impression with them"',
  'Fey Fellowship':Pathfinder2E.FEATURES['Fey Fellowship'],
  'First World Magic':Pathfinder2E.FEATURES['First World Magic'],
  // Changed
  'Gnome Obsession':
    'Section=feature ' +
    // TODO trouble randomizing?
    'Note="+1 Skill Feat (Additional Lore)/+1 Skill Feat (Assurance)"',
  // Changed
  'Gnome Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Gnome Weapons; Glaive; Kukri)",' +
      '"Has access to kukris and uncommon gnome weapons%{level>=5?\'/Critical hits with a gnome weapon, kukri, or glaive inflict its critical specialization effect\':\'\'}"',
  'Illusion Sense':Pathfinder2E.FEATURES['Illusion Sense'],
  'Razzle-Dazzle':
    'Section=magic ' +
    'Note="Inflicted blinded or dazzled conditions last 1 additional rd"',
  'Energized Font':Pathfinder2E.FEATURES['Energized Font'],
  'Project Persona':
    'Action=1 ' +
    'Section=magic ' +
    // TODO Will DC
    'Note="Places an illusion of normal cloting over armor"',
  'Cautious Curiosity':
    'Section=magic ' +
    // TODO arcane or occult
    'Note="Knows the Disguise Magic and Silence occult innate spells; can cast each at 2nd-rank on self once per day"',
  // Changed
  'First World Adept':
    'Section=magic ' +
     'Note="Knows the Invisibility and Revealing Light primal innate spells; may cast each once per day"',
  'Life Leap':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Passes through an adjacent creature to the opposite side"',
  'Vivacious Conduit':Pathfinder2E.FEATURES['Vivacious Conduit'],
  'Instinctive Obfuscation':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Illusory double forces a successful DC 10 flat check on an attacking foe once per hour; failure negates the attack"',
  'Homeward Bound':
    'Section=magic Note="Knows the Interplanar Teleport primal innate spell; may use it twice per week to travel to the First World"',

  'Burn It!':Pathfinder2E.FEATURES['Burn It!'],
  'City Scavenger':Pathfinder2E.FEATURES['City Scavenger'],
  'Goblin Lore':Pathfinder2E.FEATURES['Goblin Lore'],
  'Goblin Scuttle':Pathfinder2E.FEATURES['Goblin Scuttle'],
  'Goblin Song':Pathfinder2E.FEATURES['Goblin Song'],
  // Changed
  'Goblin Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Goblin Weapons)/Treats goblin weapons as one category simpler",' +
      '"Has access to uncommon goblin weapons%{level>=5?\'/Critical hits with a goblin weapon inflict its critical specialization effect\':\'\'}"',
  'Junk Tinker':Pathfinder2E.FEATURES['Junk Tinker'],
  'Rough Rider':Pathfinder2E.FEATURES['Rough Rider'],
  'Very Sneaky':Pathfinder2E.FEATURES['Very Sneaky'],
  'Kneecap':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Strike inflicts -10\' Speed for 1 rd, or -15\' Speed on a critical success"',
  'Loud Singer':'Section=skill Note="Has increased Goblin Song effects"',
  'Vandal':
    'Section=combat,skill ' +
    'Note=' +
      '"Strikes agains unattended objects and traps ignore 5 Hardness",' +
      '"Skill Trained (Thievery)"',
  'Cave Climber':Pathfinder2E.FEATURES['Cave Climber'],
  'Cling':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Moves with target after a successful Strike with a hand free until a successful DC %{skillModifier.Acrobatics} Escape"',
  'Skittering Scuttle':Pathfinder2E.FEATURES['Skittering Scuttle'],
  'Very, Very Sneaky':Pathfinder2E.FEATURES['Very, Very Sneaky'],
  'Recless Abandon':
    'Action=Free ' +
    'Section=save ' +
    'Note="Critical failures on saves are normal failures and result in minimum damage until end of turn once per day"',

  'Distracting Shadows':Pathfinder2E.FEATURES['Distracting Shadows'],
  'Folksy Patter':
    'Section=skill ' +
    'Note="Can transmit a 3-word hidden message to a target who succeeeds on a DC 20 Perception check; DC is reduced by 5 each for a halfling target and one with Folksy Patter"',
  'Halfling Lore':Pathfinder2E.FEATURES['Halfling Lore'],
  'Halfling Luck':Pathfinder2E.FEATURES['Halfling Luck'],
  // Changed
  'Halfling Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Fammiliarity (Halfling Weapons; Sling; Shortsword)",' +
      '"Has access to uncommon halfling weapons%{level>=5?\'/Critical hits with a halfling weapon, sling, or shortsword inflict its critical specialization effect\':\'\'}"',
  'Prairie Rider':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Nature)",' +
      '"+1 Command An Animal with traditional halfling mounts"',
  'Sure Feet':
    Pathfinder2E.FEATURES['Sure Feet'].replace('flat-footed', 'off-guard'),
  'Titan Slinger':Pathfinder2E.FEATURES['Titan Slinger'],
  'Unfettered Halfling':
    Pathfinder2E.FEATURES['Halfling Luck'].replace(/.Foe Grab.*/, ''),
  'Watchful Halfling':
    Pathfinder2E.FEATURES['Watchful Halfling'].replace('-2 ', ''),
  'Cultural Adaptability (%ancestry)':
    Pathfinder2E.FEATURES['Cultural Adaptability (%ancestry)'],
  'Step Lively':
    'Section=combat Note="Follows a foe move that leaves it adjacent with a Step to a different adjacent space"',
  'Dance Underfoot':
    'Section=combat ' +
    'Note="Can end a Tumble Through or Step Lively action in the same space as a Large or larger foe"',
  'Guiding Luck':Pathfinder2E.FEATURES['Guiding Luck'],
  'Irrepressible':Pathfinder2E.FEATURES.Irrepressible,
  'Unhampered Passage':
    'Section=magic ' +
    'Note="Knows the Unhampered Passage primal spell; can cast it on self once per day"',
  'Ceaseless Shadows':Pathfinder2E.FEATURES['Ceaseless Shadows'],
  'Toppling Dance':
    'Section=combat ' +
    'Note="Melee and unarmed attacks on a foe in the same space have the trip trait/May share space with a Large or larger prone creature"',
  'Shadow Self':
    'Section=skill ' +
    'Note="Can follow a successful Hide or Sneak with 1 min invisibility; a hostile act ends"',

  'Adapted Cantrip':Pathfinder2E.FEATURES['Adapted Cantrip'],
  'Cooperative Nature':Pathfinder2E.FEATURES['Cooperative Nature'],
  'General Training':Pathfinder2E.FEATURES['General Training'],
  'Haughty Obstinacy':Pathfinder2E.FEATURES['Haughty Obstinacy'],
  'Natural Ambition':Pathfinder2E.FEATURES['Natural Ambition'],
  'Natural Skill':Pathfinder2E.FEATURES['Natural Skill'],
  'Unconventional Weaponry':Pathfinder2E.FEATURES['Unconventional Weaponry'],
  'Adaptive Adept':Pathfinder2E.FEATURES['Adaptive Adept'],
  'Clever Improviser':Pathfinder2E.FEATURES['Clever Improviser'],
  'Sense Allies':
    'Section=skill ' +
    'Note="R60\' Willing undetected allies are hidden instead; may target hidden allies with a DC 5 flat check"',
  'Cooperative Soul':Pathfinder2E.FEATURES['Cooperative Soul'],
  'Group Aid':
    'Action=Free ' +
    'Section=skill ' +
    'Note="After Aiding an ally, can Aid another on the same skill"',
  'Handy Traveler':
    'Section=ability,ability ' +
    'Note=' +
      '"+1 Encumbered Bulk/+1 Maximum Bulk",' +
      '"+10\' Speed during overland travel"',
  'Incredible Improvisation':Pathfinder2E.FEATURES['Incredible Improvisation'],
  'Multitalented':Pathfinder2E.FEATURES.Multitalented,
  'Advanced General Training':
    'Section=feature Note="+1 General Feat (7th level)"',
  'Stubborn Persistence':
    'Section=save Note="Can avoid fatigue with a successful DC 17 flat check"',
  'Heroic Presence':
    'Section=magic ' +
    'Note="Can generate the effects of a 6th-level Zealous Conviction once per day"',

  'Elf Atavism':'Section=feature Note="Has an elven heritage"',
  'Inspire Imitation':
    'Section=skill ' +
    'Note="Can immediately Aid an ally on a skill check after a critical success on the same skill"',
  'Supernatural Charm':
    'Section=magic ' +
    'Note="Knows the Charm arcane innate spell; may cast it once per day"',

  'Monstrous Peacemaker':
    'Section=skill ' +
    'Note="+1 Diplomacy and Perception (Sense Motive) with creatures marginalized by human society"',
  'Orc Ferocity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Retains 1 Hit Point when brought to 0 Hit Points once per %{combatNotes.incredibleFerocity?\'hr\':\'day\'}"',
  'Orc Sight':'Section=feature Note="Has the Darkvision feature"',
  'Orc Superstition':'Action=Reaction Section=save Note="+1 vs. magic"',
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
    'Note="Gains %{constitutionModifier} temporary Hit Points for 1 rd when foe drops"',
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
  'Advanced Alchemy':
    'Section=skill ' +
    'Note="Can use a batch of infused reagents to create 2 infused alchemical items of up to level %{level} without a Crafting check"',
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
    'Section=combat Note="Can use 2 polymorphic mutagens simultaneously"',
  'Infused Reagents':
    'Section=skill ' +
    'Note="Can create %{level+(levels.Alchemist?intelligenceModifier:0)} batches of infused reagents each day"',
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
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Mutagenic Flashback feature",' +
      '"Knows the formulas for 2 common 1st-level mutagens"',
  'Perception Expertise':'Section=skill Note="Perception Expert"',
  'Perpetual Infusions':
    'Section=skill ' +
    'Note="Can create 2 alchemical items of up to level %V from research field without using infused reagents"',
  'Perpetual Perfection':
    'Section=skill Note="Has increased Perpetual Infusions effects"',
  'Perpetual Potency':
    'Section=skill Note="Has increased Perpetual Infusions effects"',
  'Powerful Alchemy':
    'Section=combat ' +
    'Note="Increases DC for items created with Quick Alchemy to %{classDifficultyClass.Alchemist}"',
  'Quick Alchemy':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses batches of infused reagents to create %V consumable alchemical %{skillNotes.quickAlchemy==1?\'item\':\'items\'} of up to level %{advancedAlchemyLevel} that last for 1 turn"',
  'Research Field':
    'Section=feature,skill ' +
    'Note=' +
      '"1 selection",' +
      '"Can use 1 batch of infused reagents to create 3 signature items"',
  'Weapon Specialization':
    'Section=combat ' +
    'Note="Inflicts +%V, +%{combatNotes.weaponSpecialization*1.5}, and +%{combatNotes.weaponSpecialization*2} HP damage with expert, master, and legendary weapon proficiency"',

  'Alchemical Familiar':'Section=feature Note="Has the Familiar feature"',
  'Alchemical Savant':
    'Section=skill ' +
    'Note="Can use Crafting to Identify Alchemy in 1 action/+2 to Identify known formulas, and critical failures are normal failures"',
  'Far Lobber':'Section=combat Note="Thrown bombs have a 30\' range"',
  'Quick Bomber':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Can draw and Strike with a bomb in 1 action"',
  'Poison Resistance':
    'Section=save ' +
    'Note="Has poison resistance %{level//2} and +1 saves vs. poison"',
  'Revivifying Mutagen':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ends mutagen effects to restore 1d6 Hit Points per 2 levels of the mutagen"',
  'Smoke Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Creates a bomb of up to level %{level-1} that also creates smoke in a 10\'-radius burst for 1 min"',
  'Calculated Splash':
    'Section=combat ' +
    'Note="Can throw a bomb to inflict %{intelligenceModifier} HP splash damage"',
  'Efficient Alchemy':
    'Section=skill ' +
    'Note="Can produce twice the usual number of alchemical items during downtime"',
  'Enduring Alchemy':
    'Section=skill ' +
    'Note="Quick Alchemy products last until the end of the next turn"',
  'Combine Elixirs':
    'Action=Free ' +
    'Section=skill ' +
    'Note="Uses 2 additional batches of reagents to create a single elixir that has the effects of 2 elixirs of up to level %{level-2}"',
  'Debilitating Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Creates a bomb of up to level %{level-2} that also inflicts dazzled, deafened, flat-footed, or -5 Speed (DC %{classDifficultyClass.Alchemist} Fortitude negates) for 1 turn"',
  'Directional Bombs':
    'Section=combat ' +
    'Note="Can restrict bomb splash effects to a 15\' cone in direction thrown"',
  'Feral Mutagen':
    'Section=combat,skill ' +
    'Note=' +
      '"Consuming a bestial mutagen gives claws and jaws the deadly d10 trait and allows increasing the Armor Class penalty to -2 to increase claws and jaws damage by 1 die step",' +
      '"Consuming a bestial mutagen adds the item bonus to Intimidation"',
  'Sticky Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Once per rd, creates a bomb of up to level %{level-2} that inflicts persistent damage equal to its splash damage"',
  'Elastic Mutagen':
    'Section=skill ' +
    'Note="Consuming a quicksilver mutagen allows 10\' Steps and moving through tight spaces as a creature 1 size smaller"',
  'Expanded Splash':
    'Section=combat ' +
    'Note="Can throw bombs to inflict +%{intelligenceModifier} HP splash damage in a 10\' radius"',
  'Greater Debilitating Bomb':
    'Section=combat ' +
    'Note="Can use Debilitating Bomb to create bombs that also inflict clumsy 1, enfeebled 1, stupefied 1, or -10 Speed (DC %{classDifficultyClass.Alchemist} Fortitude negates) for 1 rd"',
  'Merciful Elixir':
    'Action=Free ' +
    'Section=skill ' +
    'Note="Creates an elixir of life that also allows a +%{classDifficultyClass.Alchemist-10} counteract attempt on a fear or paralyzing effect"',
  'Potent Poisoner':
    'Section=skill ' +
    'Note="+4 crafted poison DCs (+%{classDifficultyClass.Alchemist} max)"',
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
    'Note="Creates an elixir of life that also allows a +%{classDifficultyClass.Alchemist-10} counteract attempt on a blinded, deafened, sickened, or slowed condition"',
  'True Debilitating Bomb':
    'Section=combat ' +
    'Note="Can use Debilitating Bomb to create bombs that also inflict enfeebled 2, stupefied 2, or -15 Speed (DC %{classDifficultyClass.Alchemist} Fortitude negates) or a lesser condition that requires a critical success to negate"',
  'Eternal Elixir':
    'Section=skill ' +
    'Note="Can indefinitely extend the duration of an elixir of up to level %{level//2} that lasts at least 1 min"',
  'Exploitive Bomb':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Creates a bomb of up to level %{level-2} that negates resistance %{level}"',
  'Genius Mutagen':
    'Section=skill ' +
    'Note="Consuming a cognitive mutagen adds its bonus to Deception, Diplomacy, Intimidation, Medicine, Nature, Performance, Religion, and Survival checks and allows R60\' telepathic communication"',
  'Persistent Mutagen':
    'Section=skill ' +
    'Note="Extends the duration of a mutagen until the next day once per day"',
  'Improbable Elixirs':
    'Section=skill ' +
    'Note="Can create elixirs that replicate the effects of %{intelligenceModifier>?1} potion%{intelligenceModifier>1?\'s\':\'\'} of up to level 9"',
  'Mindblank Mutagen':
    'Section=save ' +
    'Note="Consuming a serene mutagen gives immunity to detection, revelation, and scrying up to level 9"',
  'Miracle Worker':
    'Section=combat ' +
    'Note="Once every 10 min, can administer a true elixir of life that restores life with 1 Hit Point and wounded 1 to a creature dead for up to 2 rd"',
  'Perfect Debilitation':
    'Section=combat ' +
    'Note="Debilitating Bombs require a critical success to avoid effects"',
  "Craft Philosopher's Stone":
    'Section=skill ' +
    'Note="Knows the formula for creating a philosopher\'s stone"',
  'Mega Bomb':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Can throw a bomb of up to level %{advancedAlchemyLevel-2} that affects all creatures in a 30\' radius (<b>save basic Reflex</b> DC %{classDifficultyClass.Alchemist})"',
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
    'Note="Can use jaws and claws to inflict 1d%{combatNotes.greaterWeaponSpecialization?\'12+12\':combatNotes.specializationAbility?\'12+5\':\'10+2\'} HP piercing and 1d%{combatNotes.greaterWeaponSpecialization?\'8+12\':combatNotes.specializationAbility?8:6} HP slashing during rage"',
  'Bestial Rage (Deer)':
    'Section=combat ' +
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
      '"Successful melee Strikes ignore 10 points of physical damage resistance"',
  'Draconic Rage':
    'Section=combat ' +
    'Note="Can inflict +%{combatNotes.greaterWeaponSpecialization?16:combatNotes.specializationAbility?8:4} HP %V damage instead of +%{combatNotes.rage} HP weapon damage during rage"',
  'Fury Instinct':'Section=feature Note="+1 Class Feat"',
  'Greater Juggernaut':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Fortitude)",' +
      '"Critical failures on Fortitude saves are normal failures and suffers half damage on a failed Fortitude save"',
  'Greater Weapon Specialization':
    'Section=combat Note="Has increased Weapon Specialization effects"',
  'Heightened Senses':'Section=skill Note="Perception Master"',
  'Indomitable Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Instinct':'Section=feature Note="1 selection"',
  // Juggernaut as above
  'Reflex Expertise':'Section=save Note="Save Expert (Reflex)"',
  // Medium Armor Expertise as above
  'Mighty Rage':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Expert (Barbarian)",' +
      '"' + Pathfinder2E.ACTION_MARKS.Free + ' Immediately uses a rage action when starting to rage"',
  'Quick Rage':
    'Section=combat Note="Can rage again 1 turn after ending rage"',
  'Rage':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gains %{level+constitutionModifier} temporary Hit Points and +%V HP melee damage (agile weapon +%{combatNotes.rage//2} HP) and suffers -1 Armor Class and no concentration actions for 1 min; requires 1 min between rages"',
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
    'Note="Has resistance %{3+constitutionModifier} to bludgeoning and choice of cold, electricity, or fire during rage"',
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
    'Note="Can use concentration actions for the remainder of the turn during rage"',
  'Raging Intimidation':
    'Section=feature,feature,skill ' +
    'Note=' +
      '"Has the Intimidating Glare feature",' +
      '"Has the Scare To Death feature",' +
      '"Can use Demoralize during rage"',
  'Raging Thrower':
    'Section=combat ' +
    'Note="+%{combatNotes.rage} HP thrown weapon damage, and Brutal Critical and Devastator effects apply to thrown weapons during rage"',
  'Sudden Charge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike after a double Stride"',
  'Acute Scent':'Section=skill Note="Has 30\' imprecise scent during rage"',
  'Furious Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike inflicts additional damage equal to the number of rounds remaining in rage, ending rage and causing fatigue until 10 min rest"',
  'No Escape':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Stride keeps pace with a retreating foe"',
  'Second Wind':
    'Section=combat ' +
    'Note="Can rage again immediately after ending rage, suffering fatigue afterwards until 10 min rest"',
  'Shake It Off':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Reduces a frightened condition by 1 and a sickened condition by 1, 2, or 3 with a fail, success, or critical success on a Fortitude save during rage"',
  'Fast Movement':'Section=combat Note="+10 Speed during rage"',
  'Raging Athlete':
    'Section=skill ' +
    'Note="Has a %{speed}\' climb and swim Speed, -10 jump DC, and 5\' and %{speed>=30?20:15}\' vertical and horizontal Leaps during rage"',
  'Swipe':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Melee Strike attacks 2 adjacent foes"',
  'Wounded Rage':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Begins rage upon taking damage"',
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
    'Note="A successful Disarm, Grapple, Shove, or Trip during rage inflicts %{strengthModifier} HP bludgeoning"',
  'Cleave':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike on an adjacent foe after killing a foe or knocking one unconscious"',
  "Dragon's Rage Breath":
    'Action=2 ' +
    'Section=combat ' +
    'Note="Breath inflicts %{level}d6 damage in a 30\' cone or 60\' line once per rage (<b>save basic Reflex</b>; half distance and damage for a 2nd use within 1 hr)"',
  "Giant's Stature":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Increases size to Large, giving +5\' reach and clumsy 1, until rage ends"',
  "Spirits' Interference":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Imposes a DC 5 flat check requirement on foe ranged Strikes until rage ends"',
  'Animal Rage':
    'Action=1 Section=magic Note="Transforms self into spirit animal"',
  'Furious Bully':'Section=combat Note="+2 Athletics for attacks during rage"',
  'Renewed Vigor':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives %{level//2+constitutionModifier} temporary Hit Points"',
  'Share Rage':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Gives an ally the effects of Rage once per rage"',
  'Sudden Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike while Leaping, High Jumping, or Long Jumping up to %{speed*2}\'"',
  'Thrash':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Inflicts %{combatNotes.rage+strengthModifier} HP bludgeoning plus specialization damage on a grabbed foe (<b>save basic Fortitude</b>)"',
  'Come And Get Me':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Suffers flat-footed and +2 HP foe damage until rage ends; successful attackers suffer flat-footed for 1 rd, and a successful Strike on a foe gives %{constitutionModifier} temporary Hit Points (critical success %{constitutionModifier*2})"',
  'Furious Sprint':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strides %{speed*5}\' in a straight line, or %{speed*8}\' by using an additional action"',
  'Great Cleave':
    'Section=combat ' +
    'Note="Can continue to use Cleave on adjacent foes for as long as Strikes incapacitate"',
  'Knockback':
    'Action=1 Section=combat Note="Shoves a foe 5\' after a successful Strike"',
  'Terrifying Howl':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful Intimidate Demoralizes all foes in a 30\' radius"',
  "Dragon's Rage Wings":
    'Action=1 Section=combat Note="Gives %{speed}\' fly Speed during rage"',
  'Furious Grab':
    'Action=1 Section=combat Note="Grapples a foe after a successful Strike"',
  "Predator's Pounce":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strikes after moving up to %{speed}\' in light or no armor"',
  "Spirit's Wrath":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a R120\' +%{$\'trainingLevel.Martial Weapons\'*2+level+strengthModifier+2} spirit Strike that inflicts 4d8+%{constitutionModifier} HP negative or positive damage; a critical hit also inflicts frightened 1"',
  "Titan's Stature":
    'Section=combat ' +
    'Note="Giant\'s Stature can increase size to Huge, giving +10\' reach and clumsy 1, until rage ends"',
  'Awesome Blow':
    'Section=combat ' +
    'Note="A success or critical success on an Athletics vs. Fortitude after using Knockback inflicts success or critical success effects of Shove and Trip"',
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
    'Note="Thrash affects another adjacent foe (<b>save basic Reflex</b>, DC %{classDifficultyClass.Barbarian})"',
  'Dragon Transformation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Transforms into a Large dragon, as with 6th-level <i>Dragon Form</i>,%{level>=18?\' with +20 fly Speed, +12 dragon Strikes, and +14 HP breath weapon damage \':\'\'} during rage"',
  'Reckless Abandon (Barbarian)':
    'Action=Free ' +
    'Section=feature ' +
    'Note="Gives -2 Armor Class, -1 saves, and +2 attacks until the end of rage when reduced to %{hitPoints//2} or fewer Hit Points during rage"',
  'Brutal Critical':
    'Section=combat ' +
    'Note="Critical melee hits inflict an additional damage die and 2 damage dice persistent bleed damage"',
  'Perfect Clarity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Ends rage to gain a +2 reroll on a failed attack or Will save"',
  'Vicious Evisceration':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strike also inflicts drained 1, or drained 2 on a critical success"',
  'Contagious Rage':
    'Section=combat ' +
    'Note="Can use Share Rage unlimited times, also sharing instinct and specialization abilities"',
  'Quaking Stomp':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Invokes <i>Earthquake</i> effects once per 10 min"',

  // Bard
  'Bard Weapon Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Unarmed Attacks; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip)",' +
      '"Critical hits with a simple weapon, unarmed attack, longsword, rapier, sap, shortbow, shortsword, or whip inflict its critical specialization effect when a composition spell is active"',
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
  'Fortitude Expertise':'Section=save Note="Save Expert (Fortitude)"',
  "Greater Performer's Heart":
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Successes on Will saves are critical successes, critical failures are normal failures, and suffers half damage on failed Will saves"',
  'Legendary Spellcaster':'Section=magic Note="Spell Legendary (%V)"',
  'Light Armor Expertise':
    'Section=combat Note="Defense Expert (Light Armor; Unarmored Defense)"',
  // Reflex Expertise as above
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
  "Performer's Heart":
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Polymath':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Versatile Performance feature",' +
      '"Knows the Unseen Servant occult spell"',
  'Signature Spells':
    'Section=magic ' +
    'Note="Can heighten 1 chosen spell of each level without learning a heightened version"',
  'Perception Mastery':'Section=skill Note="Perception Master"',
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
    'Note="Can use Performance in place of Deception, Diplomacy, or Intimidation to Impersonate, Make an Impression, Demoralize, or to satisfy prerequisites"',
  'Cantrip Expansion':
    'Section=magic ' +
    'Note="Can prepare two additional cantrips each day or add two additional cantrips to repertoire"',
  'Esoteric Polymath':
    'Section=magic,skill ' +
    'Note=' +
      '"Can prepare 1 spell from spellbook each day, treating it as an additional signature spell if it is in repertoire",' +
      '"Can use Occultism to add spells to spellbook"',
  'Inspire Competence':
    'Section=magic Note="Knows the Inspire Competence occult cantrip"',
  "Loremaster's Etude":
    'Section=magic ' +
    'Note="Knows the Loremaster\'s Etude occult spell/+1 Focus Points"',
  'Multifarious Muse (Enigma)':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Enigma feature/+1 Class Feat",' +
      '"Can select enigma muse feats"',
  'Multifarious Muse (Maestro)':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Maestro feature/+1 Class Feat",' +
      '"Can select maestro muse feats"',
  'Multifarious Muse (Polymath)':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Polymath feature/+1 Class Feat",' +
      '"Can select polymath muse feats"',
  'Inspire Defense':
    'Section=magic Note="Knows the Inspire Defense occult cantrip"',
  'Melodious Spell':
    'Action=1 ' +
    'Section=skill ' +
    'Note="A successful Performance vs. Perception hides subsequent spellcasting from observers"',
  'Triple Time':'Section=magic Note="Knows the Triple Time occult cantrip"',
  'Versatile Signature':
    'Section=magic Note="Can replace 1 signature spell each day"',
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
      '"+%{level} untrained skills",' +
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
    'Note="Reduces the time required to cast a spell of level %1 or lower by 1 action once per day"',
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
    'Note="Can Recall Knowledge up to 5 times in 1 action"',
  'Effortless Concentration':
    'Action=Free Section=magic Note="Extends the duration of 1 spell"',
  'Studious Capacity':
    'Section=magic ' +
    'Note="Can cast 1 additional spell of level %1 or lower each day"',
  'Deep Lore':'Section=magic Note="Knows 1 additional spell of each level"',
  'Eternal Composition':
    'Section=magic ' +
    'Note="Can use an additional action each rd to cast a composition cantrip"',
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
  // Perception Expertise as above
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
  'Armor Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"Benefits from the specialization effects of medium and heavy armor"',
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
  "Champion's Reaction":
    'Section=feature ' +
    'Note="Can use the Champion\'s Reaction for the chosen champion cause"',
  'Deific Weapon':
    'Section=combat,combat ' +
    'Note=' +
      '"%{deityWeapon} inflicts +1 damage die step",' +
      '"Has access to deity weapon (%{deityWeaponLowered})"',
  'Deity And Cause':
    'Section=combat,feature,magic,skill ' +
    'Note=' +
      '"Attack Trained (%V)",' +
      '"1 selection/Has the Anathema feature",' +
      '"Has access to %V spells",' +
      '"Skill Trained (%V)"',
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
  'Devotion Spells':'Section=magic Note="Has a focus pool and 1 Focus Point"',
  'Divine Ally':
    'Section=feature ' +
    'Note="%V selection%{featureNotes.divineAlly==1?\'\':\'s\'}"',
  'Divine Ally (Blade)':
    'Section=combat ' +
    'Note="Can apply choice of <i>disrupting</i>, <i>ghost touch</i>, <i>returning</i>, or <i>shifting</i> to a weapon chosen each day, and critical hits inflict its critical specialization effect"',
  'Divine Ally (Shield)':
    'Section=combat Note="+2 Shield Hardness/+50% Shield Hit Points"',
  'Divine Ally (Steed)':
    'Section=feature Note="Has a young animal companion for a mount"',
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
    'Note="R15\' Retributive Strike allows allies to use a Reaction to make a %{combatNotes.auraOfVengeance?-2:-5} melee Strike against target"',
  'Exalt (Redeemer)':
    'Section=combat ' +
    'Note="R15\' Can use Glimpse Of Redemption to give allies resistance %{level} to damage"',
  'Glimpse Of Redemption':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R15\' Negates damage to a struck ally or gives the ally damage resistance %{2+level} and inflicts enfeebled 2 on the triggering foe for 1 rd (foe\'s choice)"',
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
    'Note="R15\' Gives an ally damage resistance %{2+level}, an Escape action or save from a restraint as a free action, and a Step as a free action"',
  'Liberator':
    'Section=feature,magic ' +
    'Note=' +
      '"Must always respect others\' freedom and oppose tyranny",' +
      '"Knows the Lay On Hands divine spell"',
  // Reflex Expertise as above
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
    'Note="R15\' Gives an ally damaged by an attack damage resistance %{level+2} and allows a melee Strike against the attacking foe if within reach"',
  // Shield Block as below
  'The Tenets Of Good':
    'Section=feature ' +
    'Note="May not commit anathema or evil acts, harm innocents, or allow harm to come to innocents through inaction"',
  'Weapon Expertise':
    'Section=combat Note="Attack Expert (%V; Unarmed Attacks)"',
  'Weapon Mastery':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  // Weapon Specialization as above

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
    'Action=Reaction Section=combat Note="Gives +2 save vs. a spell"',
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
    'Note="Reduces initial value of frightened condition by 1; reduction of frightened condition also reduces fright of allies within 15\'"',
  'Divine Health':
    'Section=save ' +
    'Note="+1 vs. disease, and successes vs. disease are critical successes"',
  'Mercy':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Lay On Hands</i> can also attempt to counteract fear or paralysis"',
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
  'Greater Mercy':
    'Section=magic ' +
    'Note="Subsequent <i>Lay On Hands</i> can also attempt to counteract blinded, deafened, sickened, or slowed"',
  'Heal Mount':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> cast on mount restores 10 Hit Points +10 Hit Points per heightened level"',
  'Quick Shield Block':
    'Section=combat ' +
    'Note="Can use an additional Reaction for a Shield Block once per turn"',
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
    'Section=combat ' +
    'Note="Can choose <i>flaming</i>, <i>anarchic</i>, <i>axiomatic</i>, <i>holy</i>, or <i>unholy</i> property for Blade Ally"',
  'Shield Of Reckoning':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Uses Shield Block on an ally and Champion\'s Reaction on the attacking foe"',
  'Affliction Mercy':
    'Section=magic ' +
    'Note="Subsequent <i>Lay On Hands</i> can also attempt to counteract a curse, disease, or poison"',
  'Aura Of Faith':
    'Section=combat ' +
    'Note="R15\' All self Strikes and the first Strike of each ally each rd inflict +1 HP good damage vs. evil creatures"',
  'Blade Of Justice':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Adds 2 extra damage dice to a Strike vs. an evil foe and allows converting all damage to good%{features.Paladin ? \', as well as inflicting Retributive Strike effects\' : \'\'}"',
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
    'Note="Can use an additional Reaction for Champion\'s Reaction once per turn"',
  'Litany Of Righteousness':
    'Section=magic ' +
    'Note="Knows the Litany Of Righteousness divine spell/+1 Focus Points"',
  'Wyrmbane Aura':
    'Section=save ' +
    'Note="R15\' Gives self and allies resistance %{charismaModifier} to acid, cold, electricity, fire, and poison, or resistance %{level//2} if damage comes from dragon breath"',
  'Auspicious Mount':
    'Section=feature ' +
    'Note="Mount is a specialized animal companion with %{deity}\'s mark, Skill Expert (Religion), speech, +2 Intelligence, and +1 Wisdom"',
  'Instrument Of Zeal':
    'Section=combat ' +
    'Note="Critical hit with Blade Of Justice or Retributive Strike inflicts an additional damage die and slowed 1 for 1 rd"',
  'Shield Of Grace':
    'Section=combat ' +
    'Note="May suffer half of excess damage when using Shield Block to protect an ally"',
  'Celestial Form':
    'Section=ability,feature ' +
    'Note=' +
      '"Has a %{speed}\' fly speed",' +
      '"Has the Darkvision feature"',
  'Ultimate Mercy':
    'Section=magic ' +
    'Note="Can use <i>Lay On Hands</i> to restore life with 1 Hit Point and wounded 1 to a target who died in the previous rd"',
  'Celestial Mount':
    'Section=feature ' +
    'Note="Mount has Darkvision, +40 Hit Points, and weakness 10 to evil damage and can fly at full Speed"',
  'Radiant Blade Master':
    'Section=combat ' +
    'Note="Can choose <i>dancing</i>, <i>greater disrupting</i>, or <i>keen</i> property for Blade Ally"',
  'Shield Paragon':
    'Section=combat,combat ' +
    'Note=' +
      '"+50% shield Hit Points",' +
      '"Shield is always raised and is automatically remade after 1 day if destroyed"',

  // Cleric
  // Perception Expertise as above
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
    'Note="May not perform acts or cast spells prohibited by %V"',
  'Cleric Feats':'Section=feature Note="%V selections"',
  'Cleric Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  'Cloistered Cleric':
    'Section=combat,combat,feature,magic,save ' +
    'Note=' +
      '"Attack Expert (%V; Simple Weapons; Unarmed Attacks)",' +
      '"Critical hits with a %{deityWeaponLowered} inflict its critical specialization effect",' +
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
    'Note="Can cast <i>Harm</i> at level %V an additional %{charismaModifier+1} times per day"',
  'Healing Font':
    'Section=magic ' +
    'Note="Can cast <i>Heal</i> at level %V an additional %{charismaModifier+1} times per day"',
  // Reflex Expertise as above
  'Miraculous Spell':'Section=magic Note="Has 1 10th-level spell slot"',
  'Resolute Faith':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Warpriest':
    'Section=combat,combat,feature,feature,magic,save,save ' +
    'Note=' +
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
    'Note="Casting <i>Heal</i> on another creature restores Hit Points to self equal to the spell level"',
  'Emblazon Armament':
    'Section=magic ' +
    'Note="10 min process gives a shield +1 Hardness or a weapon +1 HP damage"',
  'Sap Life':
    'Section=magic ' +
    'Note="Casting <i>Harm</i> on another creature restores Hit Points to self equal to the spell level"',
  'Turn Undead':
    'Section=magic ' +
    'Note="Critical failure by undead up to level %{level} damaged by <i>Heal</i> inflicts fleeing for 1 rd"',
  'Versatile Font':
    'Section=magic ' +
    'Note="Can use a font for either <i>Harm</i> or <i>Heal</i>"',
  'Channel Smite':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Adds the damage from <i>Heal</i> or <i>Harm</i> to a melee Strike"',
  'Command Undead':
    'Action=1 ' +
    'Section=magic ' +
    'Note="<i>Harm</i> controls target undead up to level %{level-3} for 1 min (Will negates; critical failure extends to 1 hr)"',
  'Directed Channel':
    'Section=magic ' +
    'Note="Can direct the effects of an area <i>Harm</i> or <i>Heal</i> into a 60\' cone"',
  'Improved Communal Healing':
    'Section=magic ' +
    'Note="Can give the additional Hit Points from Communal Healing to another within range of the spell"',
  'Necrotic Infusion':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Harm</i> cast on an undead causes the target to inflict +1d6 negative HP (5th level spell +2d6 HP; 8th level +3d6 HP) with first melee Strike in the next rd"',
  'Cast Down':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Harm</i> or <i>Heal</i> also inflicts knocked prone, and target critical failure also inflicts -10 Speed for 1 min"',
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
    'Note="Touched weapon inflicts +1d6 HP chaotic for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Align Armament (Evil)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon inflicts +1d6 HP evil for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Align Armament (Good)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon inflicts +1d6 HP good for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Align Armament (Lawful)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon inflicts +1d6 HP lawful for 1 %{combatNotes.extendArmamentAlignment?\'min\':\'rd\'}"',
  'Channeled Succor':
    'Section=magic ' +
    'Note="Can cast <i>Remove Curse</i>, <i>Remove Disease</i>, <i>Remove Paralysis</i>, or <i>Restoration</i> in place of a prepared <i>Heal</i>"',
  'Cremate Undead':
    'Section=magic ' +
    'Note="<i>Heal</i> cast upon undead also inflicts persistent fire damage equal to the spell level"',
  'Emblazon Energy':
    'Section=magic ' +
    'Note="Can use Emblazon Armament to cause a shield to give a save bonus and Shield Block vs. a chosen energy type (plus resistance %{level//2} with a matching domain spell), or to cause a weapon to inflict +1d4 HP energy type damage (or +1d6 HP with a matching domain spell)"',
  'Castigating Weapon':
    'Section=magic ' +
    'Note="Damaging a fiend with <i>Heal</i> causes weapons and unarmed Strikes to inflict bonus good damage vs. fiends equal to half the spell level for 1 rd"',
  'Heroic Recovery':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Heal</i> cast on a single target also gives +5 Speed, +1 attack, and +1 HP damage for 1 rd"',
  'Improved Command Undead':
    'Section=magic ' +
    'Note="Command Undead gives control of target for 1 rd, 10 min, or 24 hr on save success, failure, or critical failure"',
  'Replenishment Of War':
    'Section=combat ' +
    'Note="Successful Strikes with a %{deityWeaponLowered} give self %{level//2} temporary Hit Points, or %{level} temporary Hit Points on a critical hit, for 1 rd"',
  'Defensive Recovery':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Heal</i> cast on a single target also gives +2 Armor Class and saves for 1 rd"',
  'Domain Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Emblazon Antimagic':
    'Section=magic ' +
    'Note="Can use Emblazon Armament to cause a shield to give a save bonus vs. magic and Shield Block vs. spells, or to cause a critical hit with a weapon to allow a counteract attempt vs. a spell using 1/2 the wielder\'s level"',
  'Shared Replenishment':
    'Section=combat ' +
    'Note="Can give the temporary Hit Points from Replenishment Of War to any ally within 10\'"',
  "Deity's Protection":
    'Section=magic ' +
    'Note="Casting a domain spell gives self resistance equal to the spell level to all damage for 1 rd"',
  'Extend Armament Alignment':
    'Section=combat Note="Has increased Align Armament effects"',
  'Fast Channel':
    'Section=magic ' +
    'Note="Can use 2 actions to cast a 3-action <i>Harm</i> or <i>Heal</i>"',
  'Swift Banishment':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Immediately casts <i>Banishment</i> after a critical hit on an extraplanar foe"',
  'Eternal Bane':
    'Section=magic ' +
    'Note="R15\' Aura gives continuous level %{level//2} <i>Bane</i> effects"',
  'Eternal Blessing':
    'Section=magic ' +
    'Note="R15\' Aura gives continuous level %{level//2} <i>Bless</i> effects"',
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
  // Perception Expertise as above
  'Animal':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Animal Companion feature",' +
      '"Knows the Heal Animal primal spell/Has a focus pool and 1 Focus Point",' +
      '"Skill Trained (Athletics)"',
  'Druid Feats':'Section=feature Note="%V selections"',
  'Druid Skills':
    'Section=skill Note="Skill Trained (Nature; Choose %V from any)"',
  'Druidic Language':'Section=skill Note="Knows a druid-specific language"',
  'Druidic Order':'Section=feature Note="1 selection"',
  'Druid Weapon Expertise':
    'Section=combat Note="Attack Expert (Simple Weapons; Unarmed Attacks)"',
  // Expert Spellcaster as above
  // Fortitude Expertise as above
  'Leaf':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Leshy Familiar feature",' +
      '"Knows the Goodberry primal spell/Has a focus pool and 2 Focus Points",' +
      '"Skill Trained (Diplomacy)"',
  // Legendary Spellcaster as above
  // Reflex Expertise as above
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
      '"Knows the Tempest Surge primal spell/Has a focus pool and 2 Focus Points",' +
      '"Skill Trained (Acrobatics)"',
  // Weapon Specialization as above
  'Wild':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Wild Shape feature",' +
      '"Knows the Wild Morph primal spell/Has a focus pool and 1 Focus Point",' +
      '"Skill Trained (Intimidation)"',
  'Wild Empathy':
    'Section=skill ' +
    'Note="Can use Diplomacy with animals to Make An Impression and to make simple Requests"',

  'Animal Companion':'Section=feature Note="Has a young animal companion%{$\'features.Hunt Prey\'?\' that gains Hunt Prey\'+($\'features.Masterful Companion\'?\' and Flurry, Precision, and Outwit\':\'\')+\' effects\':\'\'}"',
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
    'Note="Increases the effect of a subsequent 10\' or greater radius area spell by 5\', the effect of a 15\' or shorter line or cone spell by 5\', or the effect of a longer line or cone spell by 10\'"',
  'Wild Shape':'Section=magic Note="Knows the Wild Shape primal spell"',
  'Call Of The Wild':
    'Section=magic ' +
    'Note="Can spend 10 min to replace a prepared spell with <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> of the same level"',
  'Enhanced Familiar':
    'Section=feature Note="Can select 4 familiar or master abilities each day"',
  'Order Explorer (Animal)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select Animal order feats"',
  'Order Explorer (Leaf)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select Leaf order feats"',
  'Order Explorer (Storm)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select Storm order feats"',
  'Order Explorer (Wild)':
    'Section=feature,feature ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Can select Wild order feats"',
  // Poison Resistance as above
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
    'Note="Moves normally over difficult terrain caused by plants or fungi"',
  'Green Empathy':
    'Section=skill ' +
    'Note="Can use Diplomacy with plants and fungi to Make An Impression and to make simple Requests with a +2 bonus"',
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
    'Note="<i>Tempest Surge</i> cast in response to a foe critical melee hit pushes the foe 5\' (Reflex negates; critical failure pushes 10\')"',
  'Ferocious Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Large dinosaur with +1 on Athletics checks"',
  'Fey Caller':
    'Section=magic ' +
    'Note="Knows the Illusory Disguise, Illusory Object, Illusory Scene, and Veil primal spells"',
  'Incredible Companion':
    'Section=feature ' +
    'Note="Animal Companion has choice of nimble or savage characteristics"',
  'Soaring Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a %{$\'features.Insect Shape\'?\'wasp, \':\'\'}%{$\'features.Ferocious Shape\'?\'pterosaur, \':\'\'}bat or bird with +1 on Acrobatics checks"',
  'Wind Caller':
    'Section=magic ' +
    'Note="Knows the Stormwind Flight primal spell/+1 Focus Points"',
  'Elemental Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Medium elemental with resistance 5 to fire"',
  'Healing Transformation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent polymorph spell restores 1d6 Hit Points per spell level"',
  'Overwhelming Energy':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent spell ignores resistance %{level} to energy"',
  'Plant Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Large plant with resistance 5 to poison"',
  'Side By Side':
    'Section=combat ' +
    'Note="Self and companion automatically flank a foe adjacent to both"',
  'Dragon Shape':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Large dragon with resistance 5 to choice of acid, cold, electricity, fire, or poison"',
  'Green Tongue':
    'Section=magic ' +
    'Note="Self and any leshy familiar have continuous <i>Speak With Plants</i> effects"',
  'Primal Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  'Primal Summons':
    'Section=magic,magic ' +
    'Note=' +
      '"Knows the Primal Summons primal spell",' +
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
    'Section=magic Note="Can use Form Control to retain shape permanently"',
  'Primal Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  "Hierophant's Power":'Section=magic Note="+1 10th level spell slot"',
  'Leyline Conduit':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent casting of an instantaneous spell of 5th level or lower does not expend a spell slot once per min"',
  'True Shapeshifter':
    'Action=2 ' +
    'Section=magic ' +
    'Note="Changes shape during <i>Wild Shape</i>; can change into a kaiju%{$\'features.Plant Shape\'?\' or green man\':\'\'} once per day"',

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
      '"Successes on Will saves vs. fear are critical successes, and the severity of frightened conditions are reduced by 1"',
  'Combat Flexibility':
    'Section=combat ' +
    'Note="Can select a fighter feat of up to 8th level to use each day"',
  // Evasion as above
  'Fighter Expertise':'Section=feature Note="Class Expert (Fighter)"',
  'Fighter Feats':'Section=feature Note="%V selections"',
  'Fighter Key Ability':'Section=feature Note="1 selection"',
  'Fighter Skills':
    'Section=skill ' +
    'Note="Skill Trained (Choose 1 from Acrobatics, Athletics; Choose %V from any)"',
  'Fighter Weapon Mastery':
    'Section=combat ' +
    'Note="Attack Master with simple weapons, martial weapons, and unarmed attacks of chosen group and Attack Expert with advanced weapons of the same group/Critical hits with a master proficiency weapon inflict its critical specialization effect"',
  // Greater Weapon Specialization as above
  'Improved Flexibility':
    'Section=combat ' +
    'Note="Can select a fighter feat of up to 14th level to use each day"',
  // Juggernaut as above
  // Shield Block as below
  'Versatile Legend':
    'Section=combat ' +
    'Note="Attack Legendary (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Master (Advanced Weapons)/Class Master (Fighter)"',
  'Weapon Legend':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)/Attack Expert (Advanced Weapons)",' +
      '"Attack Legendary with simple weapons, martial weapons, and unarmed attacks of chosen group and Attack Master with advanced weapons of the same group"',

  // Weapon Specialization as above
  'Double Slice':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes simultaneous Strikes with two melee weapons at the current multiple attack penalty"',
  'Exacting Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike does not count toward multiple attack penalty on failure"',
  'Point-Blank Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance negates volley penalty from a ranged volley weapon and gives +2 attack at close range with a ranged non-volley weapon"',
  'Power Attack':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Melee Strike inflicts %{level<10?1:level<18?2:3} extra dice damage and counts as two Strikes for multiple attack penalty"',
  'Reactive Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Performs Raise A Shield to absorb damage from a melee Strike"',
  'Snagging Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike with the other hand free inflicts flat-footed for 1 rd"',
  // Sudden Charge as above
  'Aggressive Block':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Shield Block moves foe 5\' or inflicts flat-footed (foe\'s choice)"',
  'Assisting Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful ranged Strike gives the next ally attack on the target within 1 rd +1 attack, or +2 with a critical success"',
  'Brutish Shove':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Two-handed melee Strike inflicts flat-footed until the end of turn; success also allows an automatic Shove"',
  'Combat Grab':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike with the other hand free inflicts grabbed for 1 rd or until the target Escapes"',
  'Dueling Parry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives +2 Armor Class for 1 rd when wielding a one-handed melee weapon with the other hand free"',
  'Intimidating Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful melee Strike inflicts frightened 1, or frightened 2 with a critical hit"',
  'Lunge':'Action=1 Section=combat Note="Melee Strike has a +5\' range"',
  'Double Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes two ranged Strikes against different foes at the current multiple attack penalty -2"',
  'Dual-Handed Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike with a 1-handed weapon and the other hand free inflicts additional damage, equal to its number of damage dice if it has the 2-handed trait or by one die step otherwise"',
  'Knockdown':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Follows a successful melee Strike with an Athletics check to Trip"',
  'Powerful Shove':
    'Section=combat ' +
    'Note="Can use Aggressive Block and Brutish Shove on foes up to two sizes larger, inflicting %{strengthModifier>?1} HP if a shoved creature hits a barrier"',
  'Quick Reversal':
    'Action=1 ' +
    'Section=combat Note="Makes melee Strikes on two foes flanking self"',
  'Shielded Stride':
    'Section=combat ' +
    'Note="Can Stride at half Speed with shield raised without triggering Reactions"',
  // Swipe as above
  'Twin Parry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Parrying with one melee weapon in each hand gives +1 Armor Class for 1 rd, or +2 Armor Class if either weapon has the parry trait"',
  'Advanced Weapon Training':
    'Section=combat ' +
    'Note="Has proficiency with advanced weapons in chosen group equal to martial weapons"',
  'Advantageous Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike on a grabbed, prone, or restrained foe inflicts additional damage equal to the number of damage dice, +2 HP if wielded two-handed, even on failure"',
  'Disarming Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +1 to Disarm and +2 vs. Disarm and allows Disarming foes two sizes larger when wielding a one-handed weapon with the other hand free"',
  'Furious Focus':
    'Section=combat ' +
    'Note="A two-handed Power Attack counts as a single attack for multiple attack penalty"',
  "Guardian's Deflection":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives an adjacent ally +2 Armor Class when wielding a one-handed weapon with the other hand free"',
  'Reflexive Shield':
    'Section=save ' +
    'Note="Raised shield adds shield bonus to Reflex saves"',
  'Revealing Stab':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Leaves a piercing weapon embedded in a corporeal concealed or hidden foe to reveal it to others"',
  'Shatter Defenses':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful melee Strike vs. a frightened foe inflicts flat-footed while the frightened condition lasts"',
  // Shield Warden as above
  'Triple Shot':
    'Section=combat ' +
    'Note="Uses Double Shot against a single target, or uses three actions to make three ranged Strikes at the current multiple attack penalty -4"',
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
    'Note="Successful Strike vs. a flying foe causes it to fall 120\', and a critical success grounds it for 1 rd"',
  'Incredible Aim':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Ranged Strike gains +2 attack and ignores concealment"',
  'Mobile Shot Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance negates Reactions from ranged Strikes and allows using Attack Of Opportunity with a loaded ranged weapon on an adjacent creature"',
  'Positioning Assault':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike with a 2-handed melee weapon moves a foe 5\' to within reach"',
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
    'Note="Gives an additional Reaction to make an Attack Of Opportunity once per turn"',
  'Debilitating Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful ranged Strike also inflicts slowed 1 for 1 rd"',
  'Disarming Twist':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike with a one-handed melee weapon and the other hand free inflicts Disarm on success; failure inflicts flat-footed until the end of turn"',
  'Disruptive Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows using Attack Of Opportunity in response to a concentrate action; a successful Strike disrupts"',
  'Fearsome Brute':
    'Section=combat ' +
    'Note="Strikes against frightened foes inflict additional damage equal to %{rank.Intimidation>=2?3:2}x the frightened value"',
  'Improved Knockdown':
    'Section=combat ' +
    'Note="Knockdown automatically inflicts a critical Trip, and using a two-handed weapon can cause the Trip to inflict damage based on the weapon damage die size"',
  'Mirror Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Raised shield reflects a spell back upon the caster with a ranged Strike or spell attack"',
  'Twin Riposte':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Twin Parry allows Striking or Disarming a foe who critically fails a Strike on self"',
  'Brutal Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ends turn with a two-handed melee Strike that inflicts %{level>=18?\'2 additional damage dice\':\'1 additional damage die\'}, even on failure"',
  'Dueling Dance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives continuous benefits of Dueling Parry"',
  'Flinging Shove':
    'Section=combat ' +
    'Note="Aggressive Block moves foe 10\' (critical success 20\') or inflicts flat-footed, and Brutish Shove moves foe 10\' (failure 5\', critical success 20\')"',
  'Improved Dueling Riposte':
    'Section=combat ' +
    'Note="Gives an additional Reaction to make a Dueling Riposte once per turn"',
  'Incredible Ricochet':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Follows a ranged Strike with another against the same foe that ignores concealment and cover"',
  'Lunging Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +5\' reach on Attacks Of Opportunity"',
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
    'Note="Can use a press action after taking the last action in a turn, losing any further Reactions until next turn"',
  'Determination':
    'Action=1 ' +
    'Section=save ' +
    'Note="Ends a nonpermanent spell (requires a successful counteract attempt) or a condition affecting self once per day"',
  'Guiding Finish':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful Strike moves a foe 10\' to a spot within reach (failure moves the foe 5\') when wielding a one-handed weapon with a hand free"',
  'Guiding Riposte':
    'Section=combat ' +
    'Note="A successful Dueling Riposte Strike moves a foe 10\' to a spot within reach"',
  'Improved Twin Riposte':
    'Section=combat ' +
    'Note="Gives an additional Reaction to make a Twin Riposte once per turn"',
  'Stance Savant':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Enters a stance during initiative"',
  'Two-Weapon Flurry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strikes simultaneously with one weapon in each hand"',
  // Whirlwind Strike as above
  'Graceful Poise':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows Double Slice with an agile weapon to count as one attack"',
  'Improved Reflexive Shield':
    'Section=combat ' +
    'Note="Can use Shield Block on a Reflex save to protect both self and adjacent allies"',
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
     'Note="Gives an additional Reaction to use a fighter feat or class feature once per foe turn"',
  'Weapon Supremacy':
    'Section=combat ' +
    'Note="Permanently quickened; may use additional actions only to Strike"',

  // Monk
  'Adamantine Strikes':
    'Section=combat Note="Unarmed attacks count as adamantine weapons"',
  // Perception Expertise as above
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
      '"Unarmored stance gives +1 Armor Class and restricts attacks to 1d6 HP bludgeoning hand Strikes",' +
      '"Unarmored stance gives -5 jump DC and +2\' and +5\' vertical and horizontal Leaps"',
  'Dragon Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows 1d10 HP bludgeoning leg Strikes and Strides that ignore the first square of difficult terrain"',
  'Ki Rush':
    'Section=magic ' +
    'Note="Knows the Ki Rush occult spell/Has a focus pool and 1 Focus Point"',
  'Ki Strike':
    'Section=magic ' +
    'Note="Knows the Ki Strike occult spell/Has a focus pool and 1 Focus Point"',
  'Monastic Weaponry':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack %V (Monk Weapons)",' +
      '"Has access to uncommon monk weapons/Can use monk weapons in unarmed Strikes"',
  'Mountain Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance gives +%{4-(dexterityModifier-(combatNotes.mountainQuake?2:combatNotes.mountainStronghold?1:0)>?0)} Armor Class, +2 vs. Shove and Trip, and -5 Speed and restricts attacks to 1d8 HP bludgeoning hand Strikes"',
  'Tiger Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows 10\' Steps and hand Strikes that inflict 1d8 HP slashing, plus 1d4 HP persistent bleed damage on a critical success"',
  'Wolf Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows 1d8 HP piercing hand Strikes that have the trip trait when flanking"',
  'Brawling Focus':
    'Section=combat ' +
    'Note="Critical hits with a brawling%{combatNotes.monasticWeaponry?\' or trained monk\':\'\'} weapon inflict its critical specialization effect"',
  'Crushing Grab':
    'Section=combat ' +
    'Note="Can inflict %{strengthModifier} HP bludgeoning, lethal or non-lethal, with a successful Grapple"',
  'Dancing Leaf':
    'Section=ability,skill ' +
    'Note=' +
      '"Takes no falling damage when adjacent to a wall",' +
      '"+5\' Jump and Leap distance"',
  'Elemental Fist':
    'Section=magic ' +
    'Note="Can inflict electricity, bludgeoning, fire, or cold damage with <i>Ki Strike</i>"',
  'Stunning Fist':
    'Section=combat ' +
    'Note="Can inflict stunned 1 with a successful Flurry Of Blows (DC %{classDifficultyClass.Monk} Fortitude negates; critical failure inflicts stunned 3)"',
  'Deflect Arrow':
    'Action=Reaction ' +
    'Section=combat Note="Gives +4 Armor Class vs. a physical ranged attack"',
  'Flurry Of Maneuvers':
    'Section=combat ' +
    'Note="Can use Flurry Of Blows to Grapple, Shove, or Trip"',
  'Flying Kick':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a Strike on a foe at the end of a Leap or Jump"',
  'Guarded Movement':
    'Section=combat Note="+4 Armor Class vs. movement Reactions"',
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
    'Note="While in Crane Stance, gives +3 Armor Class vs. a melee Strike, and a foe miss allows an immediate -2 Strike"',
  'Dragon Roar':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R15\' Bellow while in Dragon Stance inflicts frightened 1 on foes once per 1d4 rd, and affected adjacent foes cannot reduce their frightened value below 1 (DC %{skillModifiers.Intimidation} Will negates; critical failure inflicts frightened 2); first successful Strike in the next rd on a frightened foe inflicts +4 HP"',
  'Ki Blast':
    'Section=magic Note="Knows the Ki Blast occult spell/+1 Focus Points"',
  'Mountain Stronghold':
    'Action=1 ' +
    'Section=combat ' +
    'Note="While in Mountain Stance, gives +2 Armor Class for 1 rd"',
  'Tiger Slash':
    'Action=2 ' +
    'Section=combat ' +
    'Note="While in Tiger Stance, claw attack inflicts +%{level>14?3:2} damage dice and a 5\' push; critical success also inflicts +%{strengthModifier} HP persistent bleed damage"',
  'Water Step':
    'Section=ability ' +
    'Note="Can Stride across liquids; must end on a solid surface"',
  'Whirling Throw':
    'Action=1 ' +
    'Section=combat ' +
    'Note="A successful Athletics vs. a grabbed or restrained foe\'s Fortitude DC, modified for size differences, allows throwing it %{10+5*strengthModifier}\', inflicting %{(10+5*strengthModifier)//10}d6+%{strengthModifier} HP bludgeoning"',
  'Wolf Drag':
    'Action=2 ' +
    'Section=combat ' +
    'Note="While in Wolf Stance, wolf jaw attack inflicts 1d12 HP piercing and knocked prone"',
  'Arrow Snatching':
    'Section=combat ' +
    'Note="After a successful Deflect Arrow, can immediately use the projectile to make a ranged Strike"',
  'Ironblood Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows unarmed sweep Strikes that inflict 1d8 HP bludgeoning and gives resistance %{level//4>?(combatNotes.ironbloodSurge?strengthModifier:0)} to all damage"',
  'Mixed Maneuver':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Uses 2 choices of Grapple, Shove, and Trip at the current multiple attack penalty"',
  'Tangled Forest Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmored stance allows unarmed Strikes that inflict 1d8 HP slashing and prevents foes from moving away (DC %{classDifficultyClass.Monk} Reflex, Acrobatics, or Athletics negates)"',
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
    'Note="Uses 2 choices of Stand, Step, and Stride"',
  'Diamond Soul':'Section=save Note="+1 vs. magic"',
  'Disrupt Ki':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Unarmed Strike also inflicts %{level<18?2:3}d6 HP persistent negative damage and enfeebled 1"',
  'Improved Knockback':
    'Section=combat ' +
    'Note="Successful Shove moves +5\' (critical success +10\') and allows following; pushing into an obstacle inflicts %{strengthModifier+(rank.Athletics>3?8:6)} HP bludgeoning"',
  'Meditative Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Stance Savant as above
  'Ironblood Surge':
    'Action=1 ' +
    'Section=combat,combat ' +
    'Note=' +
      '"Has increased Ironblood Stance effects",' +
      '"While in Ironblood Stance, gains +1 Armor Class for 1 rd"',
  'Mountain Quake':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R20\' Stomp inflicts %{strengthModifier>?0} HP and fall prone (<b>save basic Fortitude</b>) once per 1d4 rd"',
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
    'Note="Ends one Speed status penalty or condition at the end of a turn"',
  'Enduring Quickness':
    'Section=combat ' +
    'Note="Gives an additional action each rd to Stride, Leap, or Jump"',
  'Fuse Stance':
    'Section=combat ' +
    'Note="Has merged two known stances into a unique new stance that grants the effects of both"',
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
    'Note="First hit on hunted prey each rd inflicts +%{level<11?1:level<19?2:3}d8 HP precision damage"',
  'Improved Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Reflex)",' +
      '"Critical failures on Reflex saves are normal failures, and suffers half normal damage from failed Reflex saves"',
  'Incredible Senses':'Section=skill Note="Perception Legendary"',
  // Iron Will as above
  // Juggernaut as above
  'Masterful Hunter':
    'Section=combat,combat,skill ' +
    'Note=' +
      '"Class Master (Ranger)",' +
      '"Suffers no distance penalty when attacking hunted prey in the 3rd range increment of a ranged weapon with master proficiency%{features.Flurry?\'/Reduces multiple attack penalties vs. hunted prey with master weapon proficiency to -2 and -4, or -1 and -2 with an agile weapon\':\'\'}%{features.Outwit?\'/+2 Armor Class vs. a hunt prey target with master armor proficiency\':\'\'}%{features.Precision?(level>=19?\'/2nd and 3rd hits on hunted prey inflict +2d8 HP and +1d8 HP precision damage\':\'/2nd hit on hunted prey inflicts +1d8 HP precision damage\'):\'\'}",' +
      '"With master proficiency, gains +4 Perception to Seek hunted prey%{features.Outwit?\',\':\' and\'} +4 Survival to Track hunted prey%{features.Outwit?\', and +4 Deception, Intimidation, Stealth, and Recall Knowledge checks on hunted prey\':\'\'}"',

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
      '"Critical hits with a simple weapon, martial weapon, or unarmed attack inflict its critical specialization effect"',
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
  // Perception Mastery as above
  'Wild Stride':
    'Section=ability Note="Moves normally over non-magical difficult terrain"',
  // Weapon Mastery as above
  // Weapon Specialization as above

  // Animal Companion as above
  'Crossbow Ace':
    'Section=combat ' +
    'Note="Crossbow inflicts +2 HP damage on hunted prey or immediately after reloading; a simple crossbow also increases its damage die by 1 step"',
  'Hunted Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes two ranged Strikes against hunted prey once per rd"',
  'Monster Hunter':
    'Section=combat ' +
    'Note="Can use Recall Knowledge as part of Hunt Prey; critical success gives +%{1+(combatNotes.legendaryMonsterHunter||0)} attack to self and allies for 1 rd once per target per day"',
  'Twin Takedown':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike with each hand against hunted prey once per rd"',
  'Favored Terrain (Aquatic)':
    'Section=ability ' +
    'Note="Moves normally through underwater difficult terrain/Has a %{speed}\' swim Speed"',
  'Favored Terrain (Arctic)':
    'Section=ability,feature ' +
    'Note=' +
      '"Moves normally over difficult terrain caused by ice and snow without a need to Balance",' +
      '"Can survive on one-tenth normal food and water"',
  'Favored Terrain (Desert)':
    'Section=ability,feature ' +
    'Note=' +
      '"Moves normally over difficult terrain caused by sand without a need to Balance",' +
      '"Can survive on one-tenth normal food and water"',
  'Favored Terrain (Forest)':
    'Section=ability ' +
    'Note="Moves normally over difficult terrain caused by forest/Has a %{speed}\' climb Speed"',
  'Favored Terrain (Mountain)':
    'Section=ability ' +
    'Note="Moves normally over difficult terrain caused by mountains/Has a %{speed}\' climb Speed"',
  'Favored Terrain (Plains)':
    'Section=ability,ability ' +
    'Note=' +
      '"+10 Speed",' +
      '"Moves normally over difficult terrain in plains"',
  'Favored Terrain (Sky)':
    'Section=ability ' +
    'Note="Moves normally through difficult terrain in the sky/Has a %{speed}\' fly Speed"',
  'Favored Terrain (Swamp)':
    'Section=ability ' +
    'Note="Moves normally over greater difficult terrain caused by bogs"',
  'Favored Terrain (Underground)':
    'Section=ability ' +
    'Note="Moves normally over difficult terrain underground/Has a %{speed}\' climb Speed"',
  "Hunter's Aim":
    'Action=2 ' +
    'Section=combat ' +
    'Note="+2 ranged Strike ignores concealment of hunted prey"',
  'Monster Warden':
    'Section=combat ' +
    'Note="Successful use of Monster Hunter also gives self and allies +%{1+(combatNotes.legendaryMonsterHunter||0)} Armor Class on next attack and +%{1+(combatNotes.legendaryMonsterHunter||0)} on next save vs. hunted prey"',
  'Quick Draw':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Draws a weapon and Strikes"',
  // Wild Empathy as above
  "Companion's Cry":
    'Section=combat ' +
    'Note="Can use 2 actions for Command an Animal to give companion an additional action"',
  'Disrupt Prey':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike on hunted prey within reach that uses a manipulate or move action or leaves a square while moving; success disrupts the action"',
  'Far Shot':'Section=combat Note="Doubles ranged weapon increments"',
  'Favored Enemy':
    'Section=combat ' +
    'Note="Can use Hunt Prey with chosen creature type as a free action during initiative"',
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
    'Note="Can use a ranged weapon during a Reaction to Strike an adjacent creature"',
  'Swift Tracker':
    'Section=skill ' +
    'Note="Can Track at full Speed%{rank.Survival>=3?\' without hourly Survival checks\':\'\'}%{rank.Survival>=4?\'/Can perform other exploration activities while tracking\':\'\'}"',
  // Blind-Fight as above
  'Deadly Aim':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ranged Strike with a -2 penalty vs. hunted prey inflicts +%{level<11?4:level<15?6:8} HP damage"',
  'Hazard Finder':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 Armor Class vs. traps",' +
      '"+1 Perception to find traps/Automatically attempts Search to find traps"',
  'Powerful Snares':
    'Section=skill ' +
    'Note="Created snares have a DC of at least %{classDifficultyClass.Ranger}"',
  'Terrain Master':
    'Section=ability ' +
    'Note="Can train for 1 hr to make current terrain favored until spending a day away from it"',
  "Warden's Boon":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Shares Hunt Prey and Hunter\'s Edge benefits with an ally for 1 rd"',
  'Camouflage':
    'Section=skill ' +
    'Note="Can use Hide and Sneak in natural terrain without cover"',
  // Incredible Companion as above
  'Master Monster Hunter':
    'Section=combat,skill ' +
    'Note=' +
      '"Monster Hunter effects take effect on a normal success",' +
      '"Can use Nature to Recall Knowledge to identify any creature"',
  'Penetrating Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strike affects both a target and a creature giving it lesser cover"',
  // Twin Riposte as above
  "Warden's Step":
    'Section=skill ' +
    'Note="Can include allies in an Avoid Notice action in natural terrain"',
  'Distracting Shot':
    'Section=combat ' +
    'Note="Critical or double hit on hunted prey inflicts flat-footed for 1 rd"',
  'Double Prey':'Section=combat Note="Can use Hunt Prey on two targets"',
  'Lightning Snares':'Section=skill Note="Can craft a trap with 1 action"',
  'Second Sting':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Failed Strike against hunted prey with a weapon in one hand inflicts the non-dice damage of the weapon in the other"',
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
    'Note="Companion gains benefits of Camouflage, and an ambusher companion gains an increase in Stealth rank"',
  'Targeting Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ranged attack vs. hunted prey ignores cover and concealment"',
  "Warden's Guidance":
    'Section=skill ' +
    'Note="While observing hunted prey, ally failures and critical failures to Seek prey are successes"',
  'Greater Distracting Shot':
    'Section=combat ' +
    'Note="Ranged hit on hunted prey inflicts flat-footed for 1 rd, or until the end of the next turn on a critical success or double hit"',
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':
    'Section=combat Note="Has increased Monster Hunter effects"',
  // Specialized Companion as above
  'Ubiquitous Snares':
    'Section=skill Note="Has increased Snare Specialist effects"',
  'Impossible Flurry':
    'Action=3 ' +
    'Section=combat ' +
    'Note="While wielding 2 weapons, makes 3 melee Strikes at the maximum multiple attack penalty"',
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
    'Note="Ignores five range increments when attacking hunted prey with a master proficiency weapon"',
  'To The Ends Of The Earth':
    'Section=skill Note="Can follow hunted prey across any distance"',
  'Triple Threat':
    'Section=combat ' +
    'Note="Can use Hunt Prey with 3 targets, share two-target Hunt Prey effects with 1 ally, or share single-target Hunt Prey effects with 2 allies"',
  'Ultimate Skirmisher':
    'Section=ability,save ' +
    'Note=' +
      '"Moves normally over difficult, greater difficult, and hazardous terrain",' +
      '"Never triggers movement-triggered traps"',

  // Rogue
  'Debilitating Strike':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Successful Strike against a flat-footed foe also inflicts choice of -10 Speed or enfeebled 1 until the end of the next turn"',
  // Deny Advantage as above
  'Double Debilitation':
    'Section=combat ' +
    'Note="Debilitating Strike inflicts choice of two debilitations"',
  // Evasion as above
  // Fortitude Expertise as above
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
      '"' + Pathfinder2E.ACTION_MARKS.Free + ' Successful Strike on a flat-footed foe forces a Fortitude save once per target per day; critical failure inflicts choice of paralyzed for 4 rd, unconscious for 2 hr, or killed; failure inflicts paralyzed for 4 rd; success inflicts enfeebled 2 for 1 rd"',
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
    'Note="Successful strike using an agile, finesse, or ranged weapon vs. a flat-footed foe inflicts +%{levels.Rogue?(level+7)//6:1}d%{levels.Rogue?6:level>=6?6:4} HP precision damage"',
  'Surprise Attack':
    'Section=combat ' +
    'Note="Rolling Deception or Stealth for initiative inflicts flat-footed on creatures that haven\'t acted"',
  'Thief':
    'Section=combat,skill ' +
    'Note=' +
      '"+%V damage with finesse melee weapons",' +
      '"Skill Trained (Thievery)"',
  // Perception Mastery as above
  'Weapon Tricks':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks)",' +
      '"Critical hits with an unarmed attack, rogue weapon, or a simple agile or finesse weapon vs. a flat-footed foe inflict its critical specialization effect"',
  // Weapon Specialization as above

  'Nimble Dodge':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives +2 Armor Class against an attack when unencumbered"',
  'Trap Finder':
    'Section=combat,save,skill ' +
    'Note=' +
      '"Gives +%{rank.Thievery>=3?2:1} Perception and automatic Search to find traps and allows disabling traps that require %{rank.Thievery>=3 ? \'legendary\' : \'master\'} proficiency in Thievery",' +
      '"+%{rank.Thievery>=3?2:1} vs. traps",' +
      '"+%{rank.Thievery>=3?2:1} Armor Class vs. traps"',
  'Twin Feint':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strikes with a weapon each hand, inflicting flat-footed on the second"',
  "You're Next":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="After downing one foe, makes a +2 Intimidation check to Demoralize another"',
  'Brutal Beating':
    'Section=combat Note="Critical successes on Strikes inflict frightened 1"',
  'Distracting Feint':
    'Section=combat ' +
    'Note="Successful Feints inflict -2 Perception and Reflex saves while target remains flat-footed"',
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
    'Note="Can Stride at half Speed without triggering Reactions"',
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
    'Action=1 ' +
    'Section=combat ' +
    'Note="Can prepare %{level} poisons each day that inflict 1d4 HP damage/Can apply poison that lasts for 1 turn to piercing and slashing weapons"',
  'Reactive Pursuit':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Moves to remain adjacent to a retreating foe"',
  'Sabotage':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Thievery vs. Reflex inflicts %{skillModifiers.Thievery*2} HP damage (critical success %{skillModifiers.Thievery*4} HP) to an item with moving parts possessed by a creature within reach"',
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
    'Note="Successful +5 DC Thievery check delays or disables trap activation"',
  'Improved Poison Weapon':
    'Section=combat ' +
    'Note="Poisoned weapons inflict +2d4 HP damage, and a critical miss does not waste poison"',
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
    'Section=combat ' +
    'Note="Can use Debilitating Strike to inflict +2d6 HP precision damage or flat-footed"',
  'Sneak Savant':
    'Section=skill Note="Normal failures on Sneak actions are successes"',
  'Tactical Debilitations':
    'Section=combat ' +
    'Note="Can use Debilitating Strike to prevent Reactions or flanking"',
  'Vicious Debilitations':
    'Section=combat ' +
    'Note="Can use Debilitating Strike to inflict weakness 5 to choice of damage type or clumsy 1"',
  'Critical Debilitation':
    'Section=combat ' +
    'Note="Can use Debilitating Strike on a critical hit to force a foe Fortitude save; critical failure paralyzes until the end of the next turn; failure or success inflicts slowed 2 or 1 until the end of the next turn"',
  'Fantastic Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strikes after Long Jump or a High Jump that uses Long Jump distance"',
  'Felling Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike vs. a flat-footed airborne foe forces a Reflex save; failure inflicts a 120\' fall; critical failure also inflicts grounded until the end of the next turn"',
  'Reactive Interference':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Prevents a foe Reaction; a higher-level foe requires a successful attack roll"',
  'Spring From The Shadows':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strikes an unaware foe after a Stride, remaining undetected afterward"',
  'Defensive Roll':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Reduces by half the damage from an attack that would reduce self to 0 HP once per 10 min"',
  'Instant Opening':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Inflicts flat-footed vs. self on the target until the end of the next turn"',
  'Leave An Opening':
    'Section=combat ' +
    'Note="Critical hit on a flat-footed foe allows a chosen ally to make an Attack Of Opportunity"',
  // Sense The Unseen as above
  'Blank Slate':
    'Section=save ' +
    'Note="Immune to detection, revelation and scrying effects of less than counteract level 10"',
  'Cloud Step':
    'Section=ability ' +
    'Note="Can Stride over insubstantial surfaces and traps"',
  'Cognitive Loophole':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Suppresses a mental effect until the end of the next turn"',
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
    'Note="Can become invisible for 1 min when hidden from foes once per hr"',
  'Impossible Striker':
    'Section=combat Note="Has increased Sly Striker effects"',
  'Reactive Distraction':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Redirects an effect or attack from self to Perfect Distraction decoy"',

  // Sorcerer
  // Perception Expertise as above
  'Bloodline':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool and 1 Focus Point"',
  'Bloodline Paragon':'Section=magic Note="Has 1 10th-level spell slot"',
  'Defensive Robes':'Section=combat Note="Defense Expert (Unarmored Defense)"',
  // Expert Spellcaster as above
  // Legendary Spellcaster as above
  // Reflex Expertise as above
  'Magical Fortitude':'Section=save Note="Save Expert (Fortitude)"',
  // Master Spellcaster as above
  // Resolve as above
  // Signature Spells as above
  'Sorcerer Feats':'Section=feature Note="%V selections"',
  'Sorcerer Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Sorcerer Spellcasting':
    'Section=magic Note="Can learn spells from the %V tradition"',
  // Weapon Expertise as above
  // Weapon Specialization as above

  'Aberrant':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)/Knows the Tentacular Limbs occult spell",' +
      '"Casting a bloodline spell gives self or target +2 Will saves for 1 rd",' +
      '"Skill Trained (Intimidation; Occultism)"',
  'Angelic':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Angelic Halo divine spell",' +
      '"Casting a bloodline spell gives self or target +1 saves for 1 rd",' +
      '"Skill Trained (Diplomacy; Religion)"',
  'Demonic':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Glutton\'s Jaws divine spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts -1 Armor Class on the target for 1 rd",' +
      '"Skill Trained (Intimidation; Religion)"',
  'Diabolic':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Diabolic Edict divine spell",' +
      '"Casting a bloodline spell gives self +1 Deception for 1 rd or inflicts 1 HP fire per spell level",' +
      '"Skill Trained (Deception; Religion)"',
  'Draconic (Brass)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Bronze)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Copper)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Gold)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Silver)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Black)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Blue)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Green)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (Red)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Draconic (White)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Dragon Claws arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 Armor Class for 1 rd",' +
      '"Skill Trained (Arcana; Intimidation)"',
  'Elemental (Air)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning or fire per spell level",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Elemental (Earth)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning or fire per spell level",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Elemental (Fire)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning or fire per spell level",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Elemental (Water)':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Elemental Toss primal spell",' +
      '"Casting a bloodline spell gives self +1 Intimidation for 1 rd or inflicts 1 HP bludgeoning or fire per spell level",' +
      '"Skill Trained (Intimidation; Nature)"',
  'Fey':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Faerie Dust primal spell",' +
      '"Casting a bloodline spell gives self or target concealment for 1 rd",' +
      '"Skill Trained (Deception; Nature)"',
  'Hag':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)/Knows the Jealous Hex occult spell",' +
      '"Casting a bloodline spell inflicts 2 HP mental per spell level (<b>save basic Will</b>) on the first successful attacker for 1 rd",' +
      '"Skill Trained (Deception; Occultism)"',
  'Imperial':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Ancestral Memories arcane spell",' +
      '"Casting a bloodline spell gives self or target +1 skill checks for 1 rd",' +
      '"Skill Trained (Arcana; Society)"',
  'Undead':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Undeath\'s Blessing divine spell",' +
      '"Casting a bloodline spell gives self 1 temporary HP per spell level for 1 rd or inflicts 1 HP negative per spell level",' +
      '"Skill Trained (Intimidation; Religion)"',

  'Counterspell':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Expends a spell slot to attempt to counteract a spell with the same spell"',
  'Dangerous Sorcery':
    'Section=magic ' +
    'Note="Using a spell slot to cast an instantaneous harmful spell inflicts additional damage equal to its level"',
  'Familiar':'Section=feature Note="May have a familiar"',
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
    'Note="After casting a non-cantrip spell, causes a wielded weapon to inflict +1d6 HP until the end of turn; damage type depends on the spell school"',
  'Divine Evolution':
    'Section=magic Note="+1 D%V slot for <i>Heal</i> or <i>Harm</i>"',
  'Occult Evolution':
    'Section=magic,skill ' +
    'Note=' +
      '"Can add 1 unknown mental occult spell to repertoire each day until next daily prep",' +
      '"Skill Trained (Choose 1 from any)"',
  'Primal Evolution':
    'Section=magic ' +
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
    'Section=feature ' +
    'Note="Can cast two additional spells of different levels after spell slots in each level are exhausted once per day"',
  'Bloodline Wellspring':'Section=magic Note="Refocus restores 3 Focus Points"',
  'Greater Crossblooded Evolution':
    'Section=magic ' +
    'Note="Can have 3 spells of different levels from different traditions in repertoire"',
  'Bloodline Conduit':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Invokes an instantaneous spell of 5th level or lower without expending a spell slot"',
  'Bloodline Perfection':'Section=magic Note="+1 10th level spell slot"',
  'Metamagic Mastery':
    'Section=magic ' +
    'Note="Can use a 1-action metamagic effect as a free action"',

  // Wizard
  // Perception Expertise as above
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
  // Reflex Expertise as above
  // Magical Fortitude as above
  // Master Spellcaster as above
  'Metamagical Experimentation':
    'Section=feature,magic ' +
    'Note=' +
      '"+1 Class Feat (metamagic wizard)",' +
      '"Can choose 1 metamagic feat of up to level %{level//2} to use each day"',
  // Resolve as above
  'Spell Blending':
    'Section=magic ' +
    'Note="Can use 2 spell slots from a level to prepare a spell up to two levels higher or use a spell slot to prepare 2 cantrips"',
  'Spell Substitution':
    'Section=magic ' +
    'Note="Can use a 10-minute process to replace 1 prepared spell with a different spell"',
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
    'Section=skill ' +
    'Note="Can hide spellcasting from observers with a successful Stealth vs. Perception, plus a successful Deception vs. Perception for verbal spells"',
  // Enhanced Familiar as above
  // Bespell Weapon as above
  'Linked Focus':
    'Section=magic ' +
    'Note="Draining a bonded item to cast a spell restores 1 Focus Point"',
  'Silent Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Invokes a spell without its verbal components"',
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
    'Note="Subsequent Drain Bonded Item leaves enough power to cast another spell 2 levels lower by the end of the next turn"',
  'Universal Versatility':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Focus Points",' +
      '"Can prepare a school focus spell during daily prep and Refocus"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Savant':
    'Section=magic ' +
    'Note="Can prepare %{rank.Arcane>=4?4:rank.Arcane>=3?3:2} temporary scrolls with spells up to level %V each day"',
  'Clever Counterspell':
    'Section=magic ' +
    'Note="Can attempt a Counterspell with a -2 penalty vs. a known spell using any spell that shares a non-tradition trait with it"',
  // Magic Sense as above
  'Bonded Focus':'Section=magic Note="Refocus restores 2 Focus Points"',
  // Reflect Spell as above
  'Superior Bond':
    'Section=magic ' +
    'Note="Can use Drain Bonded Item to cast another spell of up to level %V once per day"',
  // Effortless Concentration as above
  'Spell Tinker':
    'Action=2 ' +
    'Section=magic ' +
    'Note="Alters the ongoing effect choice of a spell cast on self, reducing its remaining duration by half"',
  'Infinite Possibilities':
    'Section=magic ' +
    'Note="Can prepare a spell slot to allow the casting of any known spell of at least 2 levels lower"',
  'Reprepare Spell':
    'Section=magic ' +
    'Note="Can spend 10 min to prepare a previously-cast spell%{$\'features.Spell Substitution\'?\' or another spell of the same level\':\'\'}"',
  "Archwizard's Might":'Section=magic Note="+1 10th level spell slot"',
  // Metamagic Mastery as above
  'Spell Combination':
    'Section=magic ' +
    'Note="Can prepare a spell slot of each level above 2nd to cast a combination of two spells of 2 levels lower"',

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
      '"Has the Anathema, Instinct, and Rage features",' +
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
      '"Has the Anathema, Cause, and Deity features",' +
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
      '"Has the Anathema and Deity features",' +
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
  'Adopted Ancestry (%ancestry)':
    'Section=feature Note="May take %ancestry ancestry feats"',
  'Ancestral Paragon':'Section=feature Note="+1 Ancestry Feat"',
  'Armor Proficiency':'Section=combat Note="Defense Trained (%V Armor)"',
  'Breath Control':
    'Section=ability,save ' +
    'Note=' +
      '"Can hold breath for %{(5+constitutionModifier)*25} rd without suffocating",' +
      '"+1 vs. inhaled threats, and successes vs. inhaled threats are critical successes"',
  'Canny Acumen (Fortitude)':'Section=save Note="Save %V (Fortitude)"',
  'Canny Acumen (Perception)':'Section=skill Note="Perception %V"',
  'Canny Acumen (Reflex)':'Section=save Note="Save %V (Reflex)"',
  'Canny Acumen (Will)':'Section=save Note="Save %V (Will)"',
  'Diehard':'Section=combat Note="Remains alive until dying 5"',
  'Expeditious Search':
    'Section=skill ' +
    'Note="Can Search at %{rank.Perception>=4?4:2}x normal Speed"',
  'Fast Recovery':
    'Section=save ' +
    'Note="Regains 2x Hit Points and drained severity from rest/Successful Fortitude vs. an ongoing disease or poison reduces its stage by 2, or 1 if virulent; critical success by 3, or 2 if virulent"',
  'Feather Step':'Section=ability Note="Can Step into difficult terrain"',
  'Fleet':'Section=ability Note="+5 Speed"',
  'Incredible Initiative':'Section=skill Note="+2 on initiative rolls"',
  'Incredible Investiture':'Section=magic Note="Can invest 12 items"',
  'Ride':
    'Section=feature ' +
    'Note="Automatically succeeds when using Command an Animal to move/Mount acts on self turn"',
  'Shield Block':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Raised shield negates damage equal to its hardness; self and shield each suffer any remaining damage"',
  'Toughness':
    'Section=combat,save ' +
    'Note=' +
      '"+%{level} Hit Points",' +
      '"-1 DC on recovery checks"',
  'Untrained Improvisation':
    'Section=skill ' +
    'Note="+%{level<7 ? level // 2 : level} on untrained skill checks"',
  'Weapon Proficiency (Martial Weapons)':
    'Section=combat Note="Attack Trained (Martial Weapons)"',
  'Weapon Proficiency (Simple Weapons)':
    'Section=combat Note="Attack Trained (Simple Weapons)"',
  'Weapon Proficiency (%advancedWeapon)':
    'Section=combat Note="Attack Trained (%advancedWeapon)"',

  // General Skill Feats
  'Assurance (%skill)':
    'Section=skill ' +
    'Note="Can take an automatic %{10+$\'proficiencyBonus.%skill\'} on %skill checks"',
  'Automatic Knowledge (%skill)':
    'Section=skill ' +
    'Note="Can use Assurance (%skill) to Recall Knowledge as a free action once per rd"',
  'Dubious Knowledge':
    'Section=skill ' +
    'Note="Failure on a Recall Knowledge check yields a mix of true and false information"',
  'Magical Shorthand':
    'Section=skill ' +
    'Note="Can learn new spells with %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Religion>=4?\'1 min\':rank.Arcana==3||rank.Nature>=3||rank.Occultism>=3||rank.Religion==3?\'5 min\':\'1 hr\'} of study per spell level and retry 1 week after a failure/Can learn new spells at a discounted cost"',
  'Quick Identification':
    'Section=skill ' +
    'Note="Can Identify Magic in %{rank.Arcana>=4||rank.Nature>=4||rank.Occultism>=4||rank.Arcana>=4?\'1 action\':rank.Arcana==3||rank.Nature==3||rank.Occultism==3||rank.Religion==3?\'3 actions\':\'1 min\'}"',
  'Quick Recognition':
    'Section=skill ' +
    'Note="Can use a skill with master proficiency to Recognize a Spell as a free action once per rd"',
  'Recognize Spell':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Successful roll of the connected skill gives recognition of a spell; critical success also gives +1 against effects, and critical failure misidentifies it; trained, expert, master, or legendary proficiency guarantees success on spells up to level 2, 4, 6, or 10"',
  'Skill Training (%skill)':'Section=skill Note="Skill Trained (%skill)"',
  'Trick Magic Item':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful check on the related skill temporarily activates a magic item"',

  // Specific Skill Feats
  'Additional Lore (%lore)':'Section=skill Note="Skill %V (%lore)"',
  'Alchemical Crafting':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Formula Book feature",' +
      '"Knows the formulas for 4 common 1st-level alchemical items",' +
      '"Can use Crafting to create alchemical items"',
  'Arcane Sense':
    'Section=magic ' +
    'Note="Knows the Detect Magic arcane innate spell; may cast it at %{rank.Arcana>=4?\'4th\':rank.Arcana==3?\'3rd\':\'1st\'} level at will"',
  'Bargain Hunter':
    'Section=skill Note="+2 initial gold/Can use Diplomacy to purchase items at a discount"',
  'Battle Cry':
    'Section=combat ' +
    'Note="Can use Demoralize as a free action on a foe during initiative%{rank.Intimidation>=4?\' or as a Reaction on a critical hit\':\'\'}"',
  'Battle Medicine':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Can use Medicine to restore Hit Points once per target per day"',
  'Bizarre Magic':
    'Section=magic ' +
    'Note="Increases DCs by 5 to Recognize Spells and Identify Magic on self spells and magic use"',
  'Bonded Animal':
    'Section=skill ' +
    'Note="Can use 1 week of interaction and a successful DC 20 Nature check to make an animal permanently helpful"',
  'Cat Fall':
    'Section=ability ' +
    'Note="Suffers %{rank.Acrobatics>=4?\'no\':rank.Acrobatics==3?\\"50\' less\\":rank.Acrobatics==2?\\"25\' less\\":\\"10\' less\\"} damage from falling"',
  'Charming Liar':
    'Section=skill ' +
    'Note="Critical successes on a Lie improve a target\'s attitude by 1 step once per conversation"',
  'Cloud Jump':
    'Section=skill ' +
    'Note="Triples the distance of long jumps, increases high jump distance to normal long jump distance, and adds %{speed}\' to jump distances for every additional action spent"',
  'Combat Climber':
    'Section=skill ' +
    'Note="Can Climb with one hand occupied, can fight while Climbing, and does not suffer flat-footed while Climbing"',
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
    'Note="Can use Society to impersonate a noble or to Make an Impression on one"',
  'Craft Anything':
    'Section=skill ' +
    'Note="Can craft items without meeting secondary requirements"',
  'Divine Guidance':
    'Section=skill ' +
    'Note="Can use 10 min Decipher Writing on a religious text and a successful Religion check to gain a hint about a current problem"',
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
    'Note="Can fascinate %{rank.Performance>=4?\'targets\':rank.Performance==3?\'10 targets\':rank.Performance==2?\'4 targets\':\'target\'} for 1 rd with a successful Performance vs. Will"',
  'Foil Senses':
    'Section=skill ' +
    'Note="Automatically takes precautions against special senses when using Avoid Notice, Hide, or Sneak"',
  'Forager':
    'Section=skill ' +
    'Note="Failures and critical failures on Survival to Subsist are successes/Subsist successes provide for self and %{rank.Survival>=4?32:rank.Survival==3?16:rank.Survival==2?8:4} others, or twice that number with a critical success"',
  'Glad-Hand':
    'Section=skill ' +
    'Note="Can use Diplomacy with a -5 penalty to Make an Impression immediately upon meeting and to retry after 1 min"',
  'Group Coercion':
    'Section=skill ' +
    'Note="Can use Intimidation to Coerce %{rank.Intimidation>=4?25:rank.Intimidation==3?10:rank.Intimidation==2?4:2} targets"',
  'Group Impression':
    'Section=skill ' +
    'Note="Can use Diplomacy to Make an Impression with %{rank.Diplomacy>=4?25:rank.Diplomacy==3?10:rank.Diplomacy==2?4:2} targets"',
  'Hefty Hauler':'Section=ability Note="+2 Encumbered Bulk/+2 Maximum Bulk"',
  'Hobnobber':'Section=skill Note="Can Gather Information in half normal time%{rank.Diplomacy>=3?\', and critical failures when taking normal time are normal failures\':\'\'}"',
  'Impeccable Crafting':
    'Section=skill ' +
    'Note="Successes on Specialty Crafting are critical successes"',
  'Impressive Performance':
    'Section=skill Note="Can use Performance to Make an Impression"',
  'Intimidating Glare':'Section=skill Note="Can use a glare to Demoralize"',
  'Intimidating Prowess':
    'Section=skill ' +
    'Note="+%{strength>=20&&rank.Intimidation>=3?2:1} to Coerce or Demoralize when physically menacing target"',
  'Inventor':
    'Section=skill Note="Can use Crafting to create unknown common formulas"',
  'Kip Up':
    'Action=Free Section=combat Note="Stands up without triggering Reactions"',
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
    'Note="Can use Diplomacy with a -5 penalty to convince a foe to negotiate; requires a successful Make an Impression followed by a successful Request"',
  'Legendary Performer':
    'Section=skill ' +
    'Note="Improves NPCs\' attitude by 1 step with a successful DC 10 Society check to Recall Knowledge/Earn Income using Performance increases audience by 2 levels"',
  'Legendary Professional':
    'Section=skill ' +
    'Note="Improves NPCs\' attitude by 1 step with a successful DC 10 Society check to Recall Knowledge/Earn Income using Lore increases job level"',
  'Legendary Sneak':
    'Section=skill ' +
    'Note="Can use Hide and Sneak without cover/Automatically uses Avoid Notice when exploring"',
  'Legendary Survivalist':
    'Section=skill ' +
    'Note="Can survive indefinitely without food and water and endure incredible temperatures without damage"',
  'Legendary Thief':
    'Section=skill ' +
    'Note="Can use Steal with a -5 penalty to take actively wielded and highly noticeable items"',
  'Lengthy Diversion':
    'Section=skill ' +
    'Note="Can remain hidden after a Create a Diversion attempt critically succeeds"',
  'Lie To Me':
    'Section=skill Note="Can use Deception to detect lies in a conversation"',
  'Magical Crafting':
    'Section=skill ' +
    'Note="Can craft magic items/Knows the formulas for 4 common magic items of 2nd level or lower"',
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
    'Section=skill Note="Can use Survival to Subsist on different planes"',
  'Powerful Leap':
    'Section=skill Note="Can make 5\' vertical and +5\' horizontal jumps"',
  'Quick Climb':
    'Section=skill ' +
    'Note="%{rank.Athletics>=4?\'Can Climb at full Speed\':\\"Climbing success increases distance by 5\', critical success by 10\'\\"}"',
  'Quick Coercion':'Section=skill Note="Can Coerce in 1 rd"',
  'Quick Disguise':'Section=skill Note="Can create a disguise %{rank.Deception>=4?\'as a 3-action activity\':rank.Deception==3?\'in 1 min\':\'in 5 min\'}"',
  'Quick Jump':
    'Section=skill ' +
    'Note="Can use High Jump and Long Jump as 1 action without an initial Stride"',
  'Quick Repair':
    'Section=skill ' +
    'Note="Can Repair an item in %{rank.Crafting>=4?\'1 action\':rank.Crafting==3?\'3 actions\':\'1 min\'}"',
  'Quick Squeeze':
    'Section=skill ' +
    'Note="Can Squeeze %{rank.Acrobatics>=4?\'at full Speed\':\\"5\'/rd, or 10\'/rd on a critical success\\"}"',
  'Quick Swim':
    'Section=skill ' +
    'Note="%{rank.Athletics>=4?\'Can Swim at full Speed\':\\"Successful Swim increases distance by 5\', critical success by 10\'\\"}"',
  'Quick Unlock':'Section=skill Note="Can Pick a Lock in 1 action"',
  'Quiet Allies':
    'Section=skill ' +
    'Note="Rolls a single Stealth check to Avoid Notice when leading a group"',
  'Rapid Mantel':
    'Section=skill ' +
    'Note="Can stand immediately after a successful Grab an Edge and use Athletics to Grab an Edge"',
  'Read Lips':
    'Section=skill Note="Can read the lips of those who can be seen clearly; in difficult circumstances, this requires a Society check and may inflict fascinated and flat-footed"',
  'Robust Recovery':
    'Section=skill ' +
    'Note="Success on Treat a Disease or a Poison gives a +4 bonus, and patient successes are critical successes"',
  'Scare To Death':
    'Action=1 ' +
    'Section=skill ' +
    'Note="R30\' Successful Intimidation vs. foe Will DC inflicts frightened 2; critical success inflicts frightened 2 and fleeing for 1 rd (<b>save Fortitude</b> critical failure inflicts death); failure inflicts frightened 1"',
  'Shameless Request':
    'Section=skill ' +
    'Note="Reduces the DC for an outrageous request by 2 and changes critical failures into normal failures"',
  'Sign Language':
    'Section=skill Note="Knows the sign equivalents of understood languages"',
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
    'Note="Balance successes are critical successes/Never flat-footed during Balance/Can use Acrobatics to Grab an Edge"',
  'Streetwise':
    'Section=skill ' +
    'Note="Can use Society to Gather Information and to Recall Knowledge in familiar settlements"',
  'Student Of The Canon':
    'Section=skill ' +
    'Note="Critical failures on Religion checks to Decipher Writing or Recall Knowledge are normal failures/Failures to Recall Knowledge about own faith are successes, and successes are critical successes"',
  'Subtle Theft':'Section=skill Note="Successful Steal inflicts -2 Perception on observers to detect/Remains undetected when using Palm an Object or Steal after a successful Create a Diversion"',
  'Survey Wildlife':
    'Section=skill ' +
    'Note="Can use Survival with a -2 penalty to Recall Knowledge about local creatures after 10 min of study"',
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
    'Section=skill ' +
    'Note="Critical success on Demoralize causes a lower-level target to flee for 1 rd"',
  'Titan Wrestler':
    'Section=skill ' +
    'Note="Can use Disarm, Grapple, Shove, and Trip on creatures up to %{rank.Athletics>=4?3:2} sizes larger"',
  'Train Animal':
    'Section=feature ' +
    'Note="Can use 7 days\' training and a successful Nature check to teach an animal to perform a trick"',
  'Underwater Marauder':
    'Section=combat ' +
    'Note="Does not suffer flat-footed or penalties using bludgeoning and slashing weapons in water"',
  'Unified Theory':
    'Section=skill ' +
    'Note="Can use Arcana in place of Nature, Occultism, or Religion"',
  'Unmistakable Lore':
    'Section=skill ' +
    'Note="Critical failures on any trained Lore are normal failures and critical successes provide additional information"',
  'Virtuosic Performer':
    'Section=skill ' +
    'Note="+%{rank.Performance>=3?2:1} checks on chosen Performance type"',
  'Wall Jump':
    'Section=skill ' +
    'Note="Can follow a jump that ends next to a wall with another 1-action jump once per turn"',
  'Ward Medic':
    'Section=skill ' +
    'Note="Can use Medicine to Treat Disease or Treat Wounds on up to %{rank.Medicine>=4?8:rank.Medicine==3?4:2} creatures simultaneously"',
  'Wary Disarmament':
    'Section=skill ' +
    'Note="+2 Armor Class vs. a trap triggered while disarming it"',

};
Pathfinder2ERemaster.GOODIES = Pathfinder2E.GOODIES;
Pathfinder2ERemaster.LANGUAGES = {
  'Common':'',
  'Draconic':'',
  'Dwarven':'',
  'Elven':'',
  'Fey':'',
  'Gnomish':'',
  'Goblin':'',
  'Halfling':'',
  'Jotun':'',
  'Orcish':'',
  'Sakvroth':'',
  'Aklo':'',
  'Cnthonian':'',
  'Diabolic':'',
  'Empyrean':'',
  'Kholo':'',
  'Necril':'',
  'Petran':'',
  'Pyric':'',
  'Shadowtongue':'',
  'Sussuran':'',
  'Thalassic':''
};
Pathfinder2ERemaster.SHIELDS = {
  'None':Pathfinder2E.SHIELDS.None,
  'Buckler':Pathfinder2E.SHIELDS.Buckler,
  'Wooden':Pathfinder2E.SHIELDS.Wooden,
  'Steel':Pathfinder2E.SHIELDS.Steel,
  'Tower':Pathfinder2E.SHIELDS.Tower
};
Pathfinder2ERemaster.SKILLS = {
  'Acrobatics':Pathfinder2E.SKILLS.Acrobatics,
  'Arcana':Pathfinder2E.SKILLS.Arcana,
  'Athletics':Pathfinder2E.SKILLS.Athletics,
  'Crafting':Pathfinder2E.SKILLS.Crafting,
  'Deception':Pathfinder2E.SKILLS.Deception,
  'Diplomacy':Pathfinder2E.SKILLS.Diplomacy,
  'Intimidation':Pathfinder2E.SKILLS.Intimidation,
  'Medicine':Pathfinder2E.SKILLS.Medicine,
  'Nature':Pathfinder2E.SKILLS.Nature,
  'Occultism':Pathfinder2E.SKILLS.Occultism,
  'Performance':Pathfinder2E.SKILLS.Performance,
  'Religion':Pathfinder2E.SKILLS.Religion,
  'Society':Pathfinder2E.SKILLS.Society,
  'Stealth':Pathfinder2E.SKILLS.Stealth,
  'Survival':Pathfinder2E.SKILLS.Survival,
  'Thievery':Pathfinder2E.SKILLS.Thievery,
  // creature (ancestry) lore skills from ancestry chapter pg 40ff
  'Dwarven Lore':Pathfinder2E.SKILLS['Dwarven Lore'],
  'Elven Lore':Pathfinder2E.SKILLS['Elven Lore'],
  'Goblin Lore':Pathfinder2E.SKILLS['Goblin Lore'],
  'Halfling Lore':Pathfinder2E.SKILLS['Halfling Lore'],
  'Leshy Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Orc Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  // terrain lore skills from background chapter pg 84ff
  'Cave Lore':Pathfinder2E.SKILLS['Cave Lore'],
  'Cavern Lore':Pathfinder2E.SKILLS['Cavern Lore'],
  'Desert Lore':Pathfinder2E.SKILLS['Desert Lore'],
  'Forest Lore':Pathfinder2E.SKILLS['Forest Lore'],
  'Plains Lore':Pathfinder2E.SKILLS['Plains Lore'],
  'Swamp Lore':Pathfinder2E.SKILLS['Swamp Lore'],
  'Underground Lore':Pathfinder2E.SKILLS['Underground Lore'],
  'Military Lore':'Ability=Intelligence', // pg 240
  // Adventuring Lore, Magic Lore, Planar Lore pg 241 examples of excluded Lore
  // Common lore subcategories pg 240
  'Academia Lore':Pathfinder2E.SKILLS['Academia Lore'],
  'Accounting Lore':Pathfinder2E.SKILLS['Accounting Lore'],
  'Architecture Lore':Pathfinder2E.SKILLS['Architecture Lore'],
  'Art Lore':Pathfinder2E.SKILLS['Art Lore'],
  'Astronomy Lore':'Ability=Intelligence',
  'Carpentry Lore':'Ability=Intelligence',
  'Circus Lore':Pathfinder2E.SKILLS['Circus Lore'],
  'Driving Lore':'Ability=Intelligence',
  'Engineering Lore':Pathfinder2E.SKILLS['Engineering Lore'],
  'Farming Lore':Pathfinder2E.SKILLS['Farming Lore'],
  'Fishing Lore':Pathfinder2E.SKILLS['Fishing Lore'],
  'Fortune-Telling Lore':Pathfinder2E.SKILLS['Fortune-Telling Lore'],
  'Games Lore':Pathfinder2E.SKILLS['Games Lore'],
  'Genealogy Lore':Pathfinder2E.SKILLS['Genealogy Lore'],
  'Gladitorial Lore':Pathfinder2E.SKILLS['Gladitorial Lore'],
  'Guild Lore':Pathfinder2E.SKILLS['Guild Lore'],
  'Heraldry Lore':Pathfinder2E.SKILLS['Heraldry Lore'],
  'Herbalism Lore':Pathfinder2E.SKILLS['Herbalism Lore'],
  'Hunting Lore':Pathfinder2E.SKILLS['Hunting Lore'],
  'Labor Lore':Pathfinder2E.SKILLS['Labor Lore'],
  'Legal Lore':Pathfinder2E.SKILLS['Legal Lore'],
  'Library Lore':Pathfinder2E.SKILLS['Library Lore'],
  'Abadar Lore':Pathfinder2E.SKILLS['Abadar Lore'],
  'Iomedae Lore':Pathfinder2E.SKILLS['Iomedae Lore'],
  'Demon Lore':Pathfinder2E.SKILLS['Demon Lore'],
  'Giant Lore':'Ability=Intelligence Subcategory="Creature Lore"',
  'Vampire Lore':Pathfinder2E.SKILLS['Vampire Lore'],
  'Astral Plane Lore':Pathfinder2E.SKILLS['Astral Plane Lore'],
  'Heaven Lore':Pathfinder2E.SKILLS['Heaven Lore'],
  'Outer Rifts Lore':'Ability=Intelligence Subcategory="Planar Lore"',
  'Hellknights Lore':'Ability=Intelligence Subcategory="Organization Lore"',
  'Pathfinder Society Lore':
    'Ability=Intelligence Subcategory="Organization Lore"',
  'Absalom Lore':Pathfinder2E.SKILLS['Absalom Lore'],
  'Magnimar Lore':Pathfinder2E.SKILLS['Magnimar Lore'],
  'Mountain Lore':Pathfinder2E.SKILLS['Mountain Lore'],
  'River Lore':Pathfinder2E.SKILLS['River Lore'],
  'Alcohol Lore':Pathfinder2E.SKILLS['Alcohol Lore'],
  'Baking Lore':Pathfinder2E.SKILLS['Baking Lore'],
  'Butchering Lore':Pathfinder2E.SKILLS['Butchering Lore'],
  'Cooking Lore':Pathfinder2E.SKILLS['Cooking Lore'],
  'Tea Lore':Pathfinder2E.SKILLS['Tea Lore'],
  'Mercantile Lore':Pathfinder2E.SKILLS['Mercantile Lore'],
  'Midwifery Lore':Pathfinder2E.SKILLS['Midwifery Lore'],
  'Milling Lore':Pathfinder2E.SKILLS['Milling Lore'],
  'Mining Lore':Pathfinder2E.SKILLS['Mining Lore'],
  'Piloting Lore':'Ability=Intelligence',
  'Sailing Lore':Pathfinder2E.SKILLS['Sailing Lore'],
  'Scouting Lore':Pathfinder2E.SKILLS['Scouting Lore'],
  'Scribing Lore':Pathfinder2E.SKILLS['Scribing Lore'],
  'Stabling Lore':Pathfinder2E.SKILLS['Stabling Lore'],
  'Tanning Lore':Pathfinder2E.SKILLS['Tanning Lore'],
  'Theater Lore':Pathfinder2E.SKILLS['Theater Lore'],
  'Underworld Lore':Pathfinder2E.SKILLS['Underworld Lore'],
  'Warfare Lore':Pathfinder2E.SKILLS['Warfare Lore']
};
Pathfinder2ERemaster.SPELLS = {
  // TODO
  'Abyssal Plague':
    'Level=5 ' +
    'Trait=Chaotic,Disease,Evil,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 1 Abyssal plague, which inflicts unrecoverable drained 1 until cured; subsequent failures after 1 day will inflict drained 2 at stage 2 (<b>save Fortitude</b> inflicts 2 HP evil per spell level and -2 saves vs. Abyssal plague for 1 day; critical success negates; critical failure inflicts stage 2)"',
  'Acid Arrow':
    'Level=2 ' +
    'Trait=Acid,Attack,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 3d8 HP acid, or double HP on a critical success, plus 1d6 HP persistent acid (<b>heightened +2</b> inflicts +2d8 HP initial and +1d6 HP persistent)"',
  'Acid Splash':
    'Level=1 ' +
    'Trait=Acid,Attack,Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d6 HP acid, plus 1 HP persistent acid on a critical success, and 1 HP acid splash (<b>heightened 3rd</b> inflicts 1d6+%{spellModifier.%tradition} HP initial and 2 HP persistent; <b>5th</b> inflicts 2d6+%{spellModifier.%tradition} HP initial, 3 HP persistent, and 2 HP splash; <b>7th</b> inflicts 3d6+%{spellModifier.%tradition} HP initial, 4 HP persistent, and 3 HP splash; <b>9th</b> inflicts 4d6+%{spellModifier.%tradition} HP initial, 5 HP persistent, and 4 HP splash)"',
  'Aerial Form':
    'Level=4 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium bat, bird, pterosaur, or wasp with 5 temporary HP, Armor Class %{level+18}, +16 attack, +5 damage, low-light vision, flight, +16 Acrobatics modifier, and creature-specific features for 1 min (<b>heightened 5th</b> becomes a Large creature with +10\' Speed, 10 temporary HP, +18 attack, +8 damage, +20 Acrobatics; <b>6th</b> becomes a Huge creature with +15\' Speed, 10\' reach, 15 temporary HP, Armor Class %{level+21}, +21 attack, +4 damage with double damage dice, +23 Acrobatics)"',
  'Air Bubble':
    'Level=1 ' +
    'Trait=Air,Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Allows target to breathe normally in any environment for 1 min"',
  'Air Walk':
    'Level=4 ' +
    'Trait=Air,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Touched can walk up to a 45-degree angle on air for 5 min"',
  'Alarm':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"20\' burst triggers a mental or audible alarm when a Small or larger corporeal creature enters without saying a specified password for 8 hr (<b>heightened 3rd</b> allows specifying characteristics of triggering creatures)"',
  'Alter Reality':
    'Level=10 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known occult spell of up to 9th level or a common spell of up to 7th level"',
  'Anathematic Reprisal':
    'Level=4 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Target who committed the triggering anathema act suffers 4d6 HP mental and stupefied 1 for 1 rd (<b>save basic Will</b>; success negates stupefied) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Animal Form':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium animal with 5 temporary HP, Armor Class %{level+16}, +9 attack, +1 damage, low-light vision, 30\' imprecise scent, +9 Athletics modifier, and creature-specific features for 1 min (<b>heightened 3rd</b> gives 10 temporary HP, Armor Class %{level+17}, +14 attack, +5 damage, +14 Athletics; <b>4th</b> becomes a Large creature with 10\' reach, 15 temporary HP, Armor Class %{level+18}, +16 attack, +9 damage, +16 Athletics; <b>5th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, Armor Class %{level+18}, +18 attack, +7 damage with double damage dice, +20 Athletics)"',
  'Animal Messenger':
    'Level=2 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Target Tiny animal carries a small object or note to a specified destination for up to 24 hr"',
  'Animal Vision':
    'Level=3 ' +
    'Trait=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Allows self to share the target animal\'s senses (<b>save Will</b> negates) for 1 hr"',
  'Ant Haul':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched can carry +3 Bulk without encumbrance and +6 Bulk maximum for 8 hr"',
  'Antimagic Field':
    'Level=8 ' +
    'Trait=Rare,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"10\' emanation disables spells and magic items while sustained for up to 1 min"',
  'Augury':
    'Level=2 ' +
    'Trait=Divination,Prediction ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals whether the results of a proposed action up to 30 min in the future will be generally good or bad"',
  'Avatar':
    'Level=10 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Huge creature with 30 temporary HP, Armor Class %{level+25}, +33 attack, +35 Athletics, and deity-specific features for 1 min"',
  'Baleful Polymorph':
    'Level=6 ' +
    'Trait=Incapacitation,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transforms the target\'s form into a harmless animal for 1 min, allowing a new save to revert each rd (<b>save Will</b> inflicts minor physical changes and sickened 1; critical success negates; critical failure transforms permanently and also affects the target\'s mind)"',
  'Bane':
    'Level=1 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"5\' emanation inflicts -1 attack on foes for 1 min (<b>save Will</b> negates); a concentrate action each rd increases the radius by 5\'"',
  'Banishment':
    'Level=5 ' +
    'Trait=Abjuration,Incapacitation ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Returns the target to its home plane (<b>save Will</b> (-2 if cast using an additional action and a target anathema) negates; critical success inflicts stunned 1 on self; critical failure prevents the target\'s return for 1 week) (<b>heightened 9th</b> affects 10 targets)"',
  'Barkskin':
    'Level=2 ' +
    'Trait=Abjuration,Plant ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 2 to bludgeoning and piercing and weakness 3 to fire for 10 min (<b>heightened +2</b> gives +2 resistances and +3 weakness)"',
  'Bind Soul':
    'Level=9 ' +
    'Trait=Uncommon,Evil,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Traps the soul of a corpse dead for less than 1 min in a gem until counteracted or the gem is destroyed"',
  'Bind Undead':
    'Level=3 ' +
    'Trait=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Controls the actions of a mindless undead of level less than or equal to the spell level for 1 day"',
  'Black Tentacles':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Successful spell attacks vs. Fortitude DC in a 20\' burst inflict 3d6 HP bludgeoning and grabbed for 1 min, plus 1d6 HP bludgeoning each rd on grabbed creatures; escaping requires success vs. a DC %{spellDifficultyClass.%tradition} on an unarmed attack or inflicting 12 HP vs. Armor Class %{spellDifficultyClass.%tradition}"',
  'Blade Barrier':
    'Level=6 ' +
    'Trait=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\'x120\'x2\\" wall inflicts 7d8 HP force for 1 min (<b>save basic Reflex</b>; critical failure prevents passage) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Bless':
    'Level=1 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"5\' radius gives allies +1 attack for 1 min; a concentrate action each rd increases the radius by 5\'"',
  'Blindness':
    'Level=3 ' +
    'Trait=Incapacitation,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Blinds the target for 1 min (<b>save Fortitude</b> effects last until next turn; critical success negates; critical failure inflicts permanent blindness)"',
  'Blink':
    'Level=4 ' +
    'Trait=Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains resistance 5 to non-force damage and can use Sustain to randomly teleport 10\' for 1 min (<b>heightened +2</b> gives +3 resistance)"',
  'Blur':
    'Level=2 ' +
    'Trait=Illusion,Veil ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Touched becomes concealed for 1 min"',
  'Breath Of Life':
    'Level=5 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Prevents the triggering target\'s death, restoring 4d8+%{spellModifier.%tradition} HP"',
  'Burning Hands':
    'Level=1 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP fire (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Calm Emotions':
    'Level=2 ' +
    'Trait=Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst calms creatures and prevents them from taking hostile actions while sustained for up to 1 min; a hostile action ends the spell for the target (<b>save Will</b> inflicts -1 attack; critical success negates; critical failure allows the effects to continue after a hostile action)"',
  'Cataclysm':
    'Level=10 ' +
    'Trait=Acid,Air,Cold,Earth,Electricity,Evocation,Fire,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="R1000\' 60\' burst inflicts 3d10 HP each acid, bludgeoning three times, cold, electricity, and fire, ignoring resistance 10 (<b>save basic Reflex</b>)"',
  'Chain Lightning':
    'Level=6 ' +
    'Trait=Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Inflicts 8d12 HP electricity on a chain of targets, jumping up to 30\' between each (<b>save basic Reflex</b>; critical success ends the chain) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Charm':
    'Level=1 ' +
    'Trait=Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target becomes friendly, or helpful if already friendly, and cannot use hostile actions against self for 1 hr (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure makes the target helpful) (<b>heightened 4th</b> effects last until next daily prep; <b>heightened 8th</b> effects last until next daily prep and affect 10 targets)"',
  'Chill Touch':
    'Level=1 ' +
    'Trait=Cantrip,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 1d4+%{spellModifier.%tradition} HP negative on a living creature (<b>save basic Fortitude</b>; critical failure also inflicts enfeebled 1 for 1 rd) or flat-footed on an undead for 1 rd (<b>save Fortitude</b> negates; critical failure also inflicts fleeing for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP on living)"',
  'Chilling Darkness':
    'Level=3 ' +
    'Trait=Attack,Cold,Darkness,Evocation,Evil ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 5d6 HP cold, plus 5d6 HP evil on celestials, (double HP on a critical success) and makes a counteract attempt vs. magical light (<b>heightened +1</b> inflicts +2d6 HP cold and evil)"',
  'Chromatic Wall':
    'Level=5 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 60\'x30\' wall shines 20\' light and inflicts randomly-chosen effects on passing objects and creatures for 10 min: (1) destroys ammunition and inflicts 20 HP fire on creatures (<b>save basic Reflex</b>; <i>Cone Of Cold</i> counteracts); (2) destroys thrown weapons and inflicts 25 HP acid on creatures (<b>save basic Reflex</b>; <i>Gust Of Wind</i> counteracts); (3) negates energy effects and inflicts 30 HP electricity on creatures (<b>save basic Reflex</b>; <i>Disintegrate</i> counteracts); (4) blocks gasses and inflicts 10 HP poison and enfeebled 1 for 1 min on creatures (<b>save basic Fortitude</b> also negates enfeebled; <i>Passwall</i> counteracts) (<b>heightened 7th</b> effects last for 1 hr, inflicts +10 HP, and adds more effects possibilities: (5) negates petrification, sonic, and visual effects and inflicts <i>Flesh To Stone</i> on creatures (<i>Magic Missile</i> counteracts); (6) negates divination and mental effects and inflicts <i>Warp Mind</i> on creatures (<i>Searing Light</i> counteracts); (7) negates targeted spells and inflicts slowed 1 for 1 min on creatures (<b>save Will</b> negates; critical failure teleports to another plane; <i>Dispel Magic</i> counteracts); (8) effects as another option, but with -2 saves)"',
  'Circle Of Protection':
    'Level=3 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"10\' emanation around touched gives +1 Armor Class and saves vs. creatures of a specified alignment, and +3 vs. summoned creatures and on effects that control touched, for 1 min (<b>heightened 4th</b> effects last for 1 hr)"',
  'Clairaudience':
    'Level=3 ' +
    'Trait=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to listen from the target location for 10 min"',
  'Clairvoyance':
    'Level=4 ' +
    'Trait=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location for 10 min"',
  'Cloak Of Colors':
    'Level=5 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creatures adjacent to the target suffer dazzled, and successful attackers suffer blinded for 1 rd, for 1 min (<b>save Will</b> negates; critical failure inflicts stunned for 1 rd)"',
  'Cloudkill':
    'Level=5 ' +
    'Trait=Death,Necromancy,Poison ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a cloud in a 20\' burst that inflicts 6d8 HP poison and moves away 10\' each rd for 1 min (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Collective Transposition':
    'Level=6 ' +
    'Trait=Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Teleports 2 targets within a 30\' radius (<b>save Will</b> negates; critical success allows the target to control the teleport) (<b>heightened +1</b> affects +1 target)"',
  'Color Spray':
    'Level=1 ' +
    'Trait=Illusion,Incapacitation,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts stunned 1, blinded for 1 rd, and dazzled for 1 min (<b>save Will</b> inflicts dazzled for 1 rd only; critical success negates; critical failure extends blindness to 1 min)"',
  'Command':
    'Level=1 ' +
    'Trait=Auditory,Enchantment,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target obeys a command to approach, run away, drop a held object, drop prone, or stand in place for 1 rd (<b>save Will</b> negates; critical failure causes the target to use all actions on its next turn to obey) (<b>heightened 5th</b> affects 10 targets)"',
  'Comprehend Language':
    'Level=2 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target understands a chosen heard language for 1 hr (<b>heightened 3rd</b> the target can also speak the language; <b>4th</b> affects 10 targets)"',
  'Cone Of Cold':
    'Level=5 ' +
    'Trait=Cold,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 12d6 HP cold (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Confusion':
    'Level=4 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts confused for 1 min or until a successful save (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure allows no further save attempts) (<b>heightened 8th</b> affects 10 targets)"',
  'Contingency':
    'Level=7 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Prepares a spell of up to 3 actions and 4th level to activate as a Reaction to a specified trigger (<b>heightened 8th</b> allows a 5th level spell; <b>9th</b> allows a 6th level spell; <b>10th</b> allows a 7th level spell)"',
  'Continual Flame':
    'Level=2 ' +
    'Trait=Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=3 ' +
    'Description="Touched object emits a heatless flame until dismissed"',
  'Control Water':
    'Level=5 ' +
    'Trait=Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="R500\' Raises or lowers water by 10\' and slows water creatures in a 50\'x50\' area"',
  'Create Food':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 hr" ' +
    'Description=' +
      '"R30\' Creates food for 6 Medium creatures that lasts for 1 day (<b>heightened 4th</b> creates food for 12; <b>6th</b> creates food for 50; <b>8th</b> creates food for 200)"',
  'Create Water':
    'Level=1 ' +
    'Trait=Conjuration,Water ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="Creates 2 gallons of water that last for 1 day"',
  'Creation':
    'Level=4 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R0\' Creates an object of up to 5 cubic feet made of vegetable matter that lasts for 1 hr (<b>heightened 5th</b> object can include metal and common minerals)"',
  'Crisis Of Faith':
    'Level=3 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 6d6 HP mental, or 6d8 HP mental and stupefied 1 for 1 rd on divine casters (<b>save Will</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, stupefied 1 for 1 rd, and no divine casting for 1 rd) (<b>heightened +1</b> inflicts +2d6 HP, or +2d8 HP on divine casters)"',
  'Crusade':
    'Level=9 ' +
    'Trait=Uncommon,Enchantment,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 4 targets dedicate their actions to a specified cause for 10 min; the spell ends if an ally attacks a target or for a level 14+ target reduced to half HP (<b>save Will</b> for level 15+ each rd ends the spell) (<b>heightened 10th</b> the spell ends only for a level 16+ target reduced to half HP or a level 17+ target who saves)"',
  'Crushing Despair':
    'Level=5 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone prevents Reactions, and failure on a second save inflicts slowed 1, for 1 min (<b>save Will</b> effects last for 1 turn; critical success negates; critical failure inflicts slowed 1 for 1 min with no second save) (<b>heightened 7th</b> affects a 60\' cone)"',
  'Dancing Lights':
    'Level=1 ' +
    'Trait=Cantrip,Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Creates 4 floating torch lights in a 10\' radius that can be moved 60\' each rd while sustained"',
  'Darkness':
    'Level=2 ' +
    'Trait=Darkness,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' burst suppresses natural light and magical light of equal or lesser level for 1 min (<b>heightened 4th</b> conceals targets within the darkness from creatures with darkvision)"',
  'Darkvision':
    'Level=2 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to see in darkness for 1 hr (<b>heightened 3rd</b> affects a touched target; <b>5th</b> effects last until next daily prep)"',
  'Daze':
    'Level=1 ' +
    'Trait=Cantrip,Enchantment,Mental,Nonlethal ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Inflicts %{spellModifier.%tradition} HP mental (<b>save basic Will</b>; critical failure also inflicts stunned 1) (<b>heightened +2</b> inflicts +1d6 HP)"',
  'Deafness':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts deafness for 10 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure inflicts permanent deafness)"',
  'Death Knell':
    'Level=2 ' +
    'Trait=Death,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Kills a touched target with 0 HP and gives self 10 temporary HP and +1 attack and damage for 10 min (<b>save Will</b> increases the target\'s dying value by 1; critical success negates)"',
  'Death Ward':
    'Level=5 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +4 saves vs. death and negative effects, negative resistance 10, and suppressed doomed effects for 10 min"',
  'Detect Alignment':
    'Level=1 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals auras of a specified alignment (<b>heightened 2nd</b> reveals each aura\'s location and strength)"',
  'Detect Magic':
    'Level=1 ' +
    'Trait=Cantrip,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals the presence of magic and lower-level illusions (<b>heightened 3rd</b> reveals the school of the highest-level effect; <b>4th</b> reveals the approximate location of the highest-level effect)"',
  'Detect Poison':
    'Level=1 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Reveals whether the target creature or object is venomous or poisoned (<b>heightened 2nd</b> reveals the number and types of poison)"',
  'Detect Scrying':
    'Level=4 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals scrying effects, along with the scrying creature for lower-level effects, for 1 hr (<b>heightened 6th</b> effects last until next daily prep)"',
  'Dimension Door':
    'Level=4 ' +
    'Trait=Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Teleports self to a visible location within 120\' (<b>heightened 5th</b> allows teleporting to a familiar location within 1 mile)"',
  'Dimensional Anchor':
    'Level=4 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Attempts to counteract any effect that would move the target to a different plane for 10 min (<b>save Will</b> effects last for 1 min; critical success negates; critical failure effects last for 1 hr)"',
  'Dimensional Lock':
    'Level=7 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 60\' burst attempts to counteract any teleportation or planar travel until next daily prep"',
  'Dinosaur Form':
    'Level=4 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large dinosaur with 15 temporary HP, Armor Class %{level+18}, +16 attack, +9 damage, low-light vision, 30\' imprecise scent, +18 Athletics modifier, and creature-specific attacks for 1 min (<b>heightened 5th</b> becomes a Huge creature with 15\' or 20\' reach, 20 temporary HP, +18 attack, +6 damage with double damage dice, +21 Athletics; <b>7th</b> becomes a Gargantuan creature with 20\' or 25\' reach, Armor Class %{level+21}, 25 temporary HP, +25 attack, +15 damage with double damage dice, +25 Athletics)"',
  'Disappearance':
    'Level=8 ' +
    'Trait=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Touched becomes undetectable by any sense for 10 min"',
  'Discern Lies':
    'Level=4 ' +
    'Trait=Uncommon,Divination,Mental,Revelation ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="Self gains +4 Perception vs. lies for 10 min"',
  'Discern Location':
    'Level=8 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals the exact location of a specified familiar creature or object for 10 min"',
  'Disintegrate':
    'Level=6 ' +
    'Trait=Attack,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 12d10 HP, reducing the target to dust at 0 HP, or destroys a non-artifact 10\' cube object (<b>save basic Fortitude</b>; critical hit worsens save by 1 degree) (<b>heightened +1</b> inflicts +2d10 HP)"',
  'Disjunction':
    'Level=9 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Makes a counteract check to deactivate a non-artifact magic item; critical success destroys it"',
  'Dispel Magic':
    'Level=2 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Makes a counteract check to remove 1 spell effect from the target or to make a magic item inert for 10 min"',
  'Disrupt Undead':
    'Level=1 ' +
    'Trait=Cantrip,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d6+%{spellModifier.%tradition} HP positive on an undead target (<b>save basic Fortitude</b>; critical failure also inflicts enfeebled 1 for 1 rd) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Disrupting Weapons':
    'Level=1 ' +
    'Trait=Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Two touched weapons inflict +1d4 HP positive vs. undead for 1 min (<b>heightened 3rd</b> weapons inflict +2d4 HP; <b>5th</b> three weapons inflict +3d4 HP)"',
  'Divine Aura':
    'Level=8 ' +
    'Trait=Abjuration,Aura ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' emanation gives allies +1 Armor Class and saves, +2 vs. creatures opposed to a specified alignment, and +4 vs. opposed alignment control, and blinds melee attackers of opposed alignment (<b>save Will</b> negates), while sustained for up to 1 min; the first Sustain each rd increases the emanation radius by 10\'"',
  'Divine Decree':
    'Level=7 ' +
    'Trait=Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R40\' 40\' emanation inflicts 7d10 HP specified alignment damage; creatures of opposed alignment also suffer enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, banishment, and, for creatures of level 10 and lower, paralysis for 1 min (<b>save Will</b> negates; critical failure inflicts death); matching alignment negates; neutral alignment improves save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP and increases the level of creatures that suffer paralysis by 2)"',
  'Divine Inspiration':
    'Level=8 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched recovers 1 6th-level or lower spell or slot or regains Focus Points"',
  'Divine Lance':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP of chosen alignment, or double HP on a critical success (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Divine Vessel':
    'Level=7 ' +
    'Trait=Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes Large and gains 40 temporary HP, %{speed}\' fly Speed, +1 vs. spells, darkvision, and fist, bite, or claw attacks that inflict 2d8 HP, 2d10 HP, or 2d10 HP, inflicts +1 HP of chosen alignment, and suffers weakness 10 to the opposite alignment for 1 min (<b>heightened 9th</b> gives 60 temporary HP and weakness 15, lasting 10 min)"',
  'Divine Wrath':
    'Level=4 ' +
    'Trait=Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts 4d10 HP of chosen alignment and sickened 1 (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts sickened 2 and slowed 1; matching alignment negates; neutral alignment improves save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Dominate':
    'Level=6 ' +
    'Trait=Uncommon,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self controls the actions of the target until next daily prep; a successful save at end of each turn ends the spell (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure allows further saves only upon repugnant orders) (<b>heightened 10th</b> effects are permanent)"',
  'Dragon Form':
    'Level=6 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large dragon with 40\' Speed, 100\' fly Speed, 10 temporary HP, Armor Class %{level+18}, +22 attack, +6 damage, a breath weapon, resistance 10 to the breath weapon damage type, darkvision, 60\' imprecise scent, +23 Athletics modifier, and creature-specific features for 1 min (<b>heightened 8th</b> becomes a Huge creature with 120\' fly speed, +5\' reach, 15 temporary HP, Armor Class %{level+21}, +28 attack, +12 damage (breath weapon +14), +28 Athletics)"',
  'Dream Council':
    'Level=8 ' +
    'Trait=Illusion,Mental,Sleep ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Allows 12 known targets to communicate through a shared dream for 1 hr"',
  'Dream Message':
    'Level=3 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Self sends 1 min of speech to a familiar creature, received the next time they sleep (<b>heightened 4th</b> sends speech to 10 familiar creatures)"',
  'Dreaming Potential':
    'Level=5 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched receives a day of downtime retraining during 8 hr sleep"',
  'Drop Dead':
    'Level=5 ' +
    'Trait=Uncommon,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Upon receiving the triggering wound, the target becomes invisible and is replaced by an illusionary corpse while sustained for up to 1 min; a hostile act by the target ends the spell (<b>heightened 7th</b> a hostile act does not end the spell)"',
  'Duplicate Foe':
    'Level=7 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Creates a minion copy of a target up to level 15 with 70 HP and no special abilities while sustained for up to 1 min or until reduced to 0 HP; the copy loses 4d6 HP after each turn (<b>save Fortitude</b> the copy inflicts half HP and lasts 2 rd; critical success negates) (<b>heightened +1</b> increases the target level that can be copied by 2 and the copy HP by 10)"',
  'Earthbind':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Brings a flying target to the ground and prevents flight and levitation for 1 rd (<b>save Fortitude</b> grounds target but does not prevent flight; critical success negates; critical failure effects last for 1 min)"',
  'Earthquake':
    'Level=8 ' +
    'Trait=Earth,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst inflicts difficult terrain, -2 attacks, Armor Class, and skill checks, a 40\' fall (<b>save Reflex</b> negates), and structure collapse that inflicts 11d6 HP bludgeoning and knocked prone (<b>save Reflex</b> inflicts half HP and knocked prone; critical success inflicts half HP only; critical failure causes the fall save to fail) (<b>heightened 10th</b> increases range to a half mile and effect area to a quarter-mile burst)"',
  'Eclipse Burst':
    'Level=7 ' +
    'Trait=Cold,Darkness,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst attempts to counteract magical light and inflicts 8d10 HP cold, plus 8d4 HP negative to living creatures (<b>save basic Reflex</b>; critical failure also inflicts permanent blindness) (<b>heightened +1</b> inflicts +1d10 HP cold and +1d4 HP negative)"',
  'Electric Arc':
    'Level=1 ' +
    'Trait=Cantrip,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+%{spellModifier.%tradition} electricity on 1 or 2 targets (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Elemental Form':
    'Level=5 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium elemental with 10 temporary HP, Armor Class %{level+19}, +18 attack, +9 damage, darkvision, +20 Acrobatics (air or fire) or Athletics (earth or water) modifier, and creature-specific features for 1 min (<b>heightened 6th</b> becomes a Large creature with 10\' reach, 15 temporary HP, Armor Class %{level+22}, +23 attack, +13 damage, +23 Acrobatics or Athletics; <b>7th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, Armor Class %{level+22}, +25 attack, +11 damage and double damage dice, and +25 Acrobatics or Athletics)"',
  'Endure Elements':
    'Level=2 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Protects touched from severe cold or heat until next daily prep (<b>heightened 3rd</b> protects from both cold and heat; <b>5th</b> protects from extreme cold and heat</b>)"',
  'Energy Aegis':
    'Level=7 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touched gains resistance 5 to acid, cold, electricity, fire, force, negative, positive, and sonic damage for 1 min (<b>heightened 9th</b> gives resistance 10)"',
  'Enhance Victuals':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Improves the quality of touched 1 gallon of water or 5 pounds of food for 1 hr and attempts to counteract any poison (<b>heightened +1</b> affects +1 gallon or +5 pounds</b>"',
  'Enlarge':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target becomes Large, gaining 10\' reach, +2 melee damage, and clumsy 1 for 5 min (<b>heightened 4th</b> target becomes Huge, gaining 15\' reach and +4 melee damage; <b>8th</b> affects 10 creatures)"',
  'Entangle':
    'Level=2 ' +
    'Trait=Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts difficult terrain and -10\' Speed for 1 min (<b>save Reflex</b> inflicts difficult terrain only; critical failure inflicts immobilized for 1 rd)"',
  'Enthrall':
    'Level=3 ' +
    'Trait=Auditory,Emotion,Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Fascinates creatures within 120\' while sustained, with additional saves for disagreement (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure allows no further saves)"',
  'Ethereal Jaunt':
    'Level=7 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Moves self from the Material Plane to the Ethereal Plane while sustained for up to 1 min (<b>heightened 9th</b> R30\' affects 5 additional willing creatures, and effects last for 10 min)"',
  'Fabricated Truth':
    'Level=10 ' +
    'Trait=Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R100\' 5 targets believe a specified statement for 1 week (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure effects are permanent)"',
  'Faerie Fire':
    'Level=2 ' +
    'Trait=Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst makes concealed creatures visible and invisible creatures concealed for 5 min"',
  'False Life':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains %{6+spellModifier.%tradition} temporary HP for 8 hr (<b>heightened +1</b> gives +3 HP)"',
  'False Vision':
    'Level=5 ' +
    'Trait=Uncommon,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Controls the image shown by scrying within a 100\' burst until next daily prep"',
  'Fear':
    'Level=1 ' +
    'Trait=Emotion,Enchantment,Fear,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts frightened 2 (<b>save Will</b> inflicts frightened 1; critical success negates; critical failure inflicts frightened 3 and fleeing for 1 rd) (<b>heightened 3rd</b> affects 5 targets)"',
  'Feather Fall':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Falling target slows to 60\' per rd and suffers no falling damage for 1 min or until landing"',
  'Feeblemind':
    'Level=6 ' +
    'Trait=Curse,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts stupefied 4 until the curse is removed (<b>save Will</b> inflicts stupefied 2 for 1 rd; critical success negates; critical failure inflicts permanent animal intelligence and -5 Charisma, Intelligence, and Wisdom modifiers and changes a PC into an NPC)"',
  'Feet To Fins':
    'Level=3 ' +
    'Trait=Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched can swim at full Speed but slows to 5\' on land for 10 min (<b>heightened 6th</b> effects last until next daily prep)"',
  'Field Of Life':
    'Level=6 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 20\' burst restores 1d8 HP per rd to living and inflicts 1d8 HP positive per rd to undead while sustained for up to 1 min (<b>heightened 8th</b> restores and inflicts 1d10 HP; <b>9th</b> restores and inflicts 1d12 HP)"',
  'Fiery Body':
    'Level=7 ' +
    'Trait=Fire,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains fire immunity and resistance 10 to precision damage, suffers weakness 5 to cold and water, inflicts 3d6 HP fire on non-reach melee attackers, gains +1d4 HP fire on unarmed attacks and an additional die of damage on fire spells, can cast <i>Produce Flame</i> using 1 action as an innate spell, gains a 40\' fly Speed, and does not need to breathe for 1 min (<b>heightened 9th</b> inflicts 4d6 HP fire on non-reach melee attackers, inflicts +2d4 HP fire on unarmed attacks, and increases fly Speed to 60\')"',
  'Finger Of Death':
    'Level=7 ' +
    'Trait=Death,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R30\' Target suffers 70 HP negative, dying at 0 HP (<b>heightened +1</b> inflicts +10 HP)"',
  'Fire Seeds':
    'Level=6 ' +
    'Trait=Evocation,Fire,Plant ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates 4 acorns that can be thrown 30\', inflicting 4d6 HP fire in a 5\' burst and continuing to inflict 2d6 HP fire for 1 min (<b>save basic Reflex</b>) (<b>heightened 8th</b> inflicts 5d6 HP initial and 3d6 HP for 1 min; <b>9th</b> inflicts 6d6 HP initial and 3d6 HP for 1 min)"',
  'Fire Shield':
    'Level=4 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains cold resistance 5, and melee attackers suffer 2d6 HP fire, for 1 min (<b>heightened +2</b> gives cold resistance +5 and inflicts +1d6 HP)"',
  'Fireball':
    'Level=3 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 20\' burst inflicts 6d6 HP fire (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Flame Strike':
    'Level=5 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' radius inflicts 8d6 HP fire, ignoring half of any resistance (<b>save basic Reflex</b>; fire immunity improves save by 1 degree) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Flaming Sphere':
    'Level=2 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Movable flame inflicts 3d6 HP fire in a 15\' sq while sustained for up to 1 min (<b>save basic Reflex</b>; success negates) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Fleet Step':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="Self gains +30\' Speed for 1 min"',
  'Flesh To Stone':
    'Level=6 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts initial slowed 1; subsequent failed or successful saves each rd increase or decrease the degree slowed until the target is no longer slowed or becomes immobile and permanently turned to stone (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates; critical failure inflicts initial slowed 2)"',
  'Floating Disk':
    'Level=1 ' +
    'Trait=Conjuration,Force ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates an invisible 2\' radius disk that follows self and holds 5 Bulk for 8 hr"',
  'Fly':
    'Level=4 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains a fly Speed of the greater of its Speed or 20\' for 5 min (<b>heightened 7th</b> effects last for 1 hr)"',
  'Forbidding Ward':
    'Level=1 ' +
    'Trait=Abjuration,Cantrip ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +1 Armor Class and saves vs. a specified foe while sustained for up to 1 min (<b>heightened 6th</b> gives +2 Armor Class and saves)"',
  'Foresight':
    'Level=9 ' +
    'Trait=Divination,Mental,Prediction ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +2 initiative and does not suffer flat-footed vs. undetected and flanking creatures, and self may use a Reaction to give the target the better of two rolls or its foe the worse of two rolls, for 1 hr"',
  'Freedom Of Movement':
    'Level=4 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Relieves touched of Speed penalty effects and gives automatic success on Escape attempts vs. non-magical effects and magical effects up to the spell level for 10 min"',
  'Gaseous Form':
    'Level=4 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched becomes vapor with resistance 8 to physical damage, immunity to precision damage, proficiency modifier for unarmored defense, and 10\' fly Speed  for 5 min or until the target or self ends the spell"',
  'Gate':
    'Level=10 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Opens a 40\' radius gate to another plane while sustained for up to 1 min"',
  'Gentle Repose':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched corpse does not decay and cannot be made undead until next daily prep (<b>heightened 5th</b> effects are permanent)"',
  'Ghost Sound':
    'Level=1 ' +
    'Trait=Auditory,Cantrip,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates sound equivalent to four humans shouting while sustained (<b>heightened 3rd</b> R60\'; <b>5th</b> R120\')"',
  'Ghostly Weapon':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched weapon becomes translucent and can affect incorporeal creatures for 5 min"',
  'Ghoulish Cravings':
    'Level=2 ' +
    'Trait=Disease,Evil,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 2 ghoul fever, which inflicts 3d8 HP negative and half normal healing; subsequent daily save failures will inflict an additional 3d8 HP at stage 3, 3d8 HP and no healing at stage 4 and stage 5, and death and transformation into a ghoul at stage 6 (<b>save Fortitude</b> inflicts stage 1 with no initial ill effects; critical success negates; critical failure inflicts stage 3)"',
  'Glibness':
    'Level=4 ' +
    'Trait=Uncommon,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +%{rank.Deception?4:(4+level)} Deception to lie and against Perception to discern truth for 10 min"',
  'Glitterdust':
    'Level=2 ' +
    'Trait=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst inflicts dazzled and negates invisibility for 1 min (<b>save Reflex</b> negates invisibility only for 2 rd; critical success negates; critical failure blinds for 1 rd and dazzles and negates invisibility for 10 min)"',
  'Globe Of Invulnerability':
    'Level=4 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="10\' burst attempts to counteract outside spells at the spell level - 1 for 10 min"',
  'Glyph Of Warding':
    'Level=3 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Specified trigger on a target container or 10\'x10\' area triggers a chosen spell of lower level"',
  'Goblin Pox':
    'Level=1 ' +
    'Trait=Disease,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 1 goblin pox, which inflicts sickened 1 for 1 rd; subsequent failures after 1 rd will inflict sickened 1 and slowed 1 for 1 rd at stage 2, and incurably sickened 1 for 1 dy at stage 3 (<b>save Fortitude</b> inflicts sickened 1 only; critical success negates; critical failure inflicts stage 2; goblins and goblin dogs are immune)"',
  'Grease':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 4 5\' squares cause falls, or 1 target object inflicts a -2 penalty to checks, for 1 min (<b>save Reflex or Acrobatics</b> negates; critical failure causes the holder to drop the target object)"',
  'Grim Tendrils':
    'Level=1 ' +
    'Trait=Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' line inflicts 2d4 HP negative and 1 HP persistent bleed on living creatures (<b>save Fortitude</b> inflicts half HP negative only; critical success negates; critical failure inflicts double initial and persistent HP) (<b>heightened +1</b> inflicts +2d4 HP initial and +1 HP persistent)"',
  'Guidance':
    'Level=1 ' +
    'Trait=Cantrip,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +1 on an attack, Perception, save, or skill check within 1 rd once per target per hr"',
  'Gust Of Wind':
    'Level=1 ' +
    'Trait=Air,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line extinguishes small, non-magical fires, disperses fog, moves light objects, and knocks prone creatures up to Large for 1 rd (<b>save Fortitude</b> prevents moving against the wind but does not knock prone; critical success negates; critical failure pushes 30\', knocks prone, and inflicts 2d6 HP bludgeoning)"',
  'Hallucination':
    'Level=5 ' +
    'Trait=Illusion,Incapacitation,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Changes target\'s perception of an object or group for 1 hr (<b>save Will</b> target knows that it\'s hallucinating; critical success negates; critical failure inflicts -4 saves to disbelieve) (<b>heightened 6th</b> affects 10 targets or effects last until next daily prep; <b>8th</b> affects any number of targets or effects are permanent)"',
  'Hallucinatory Terrain':
    'Level=4 ' +
    'Trait=Uncommon,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' 50\' burst illusion changes the look, sound, feel, and smell of the terrain until next daily prep (<b>heightened 5th</b> the illusion can mask or incorporate structures)"',
  'Harm':
    'Level=1 ' +
    'Trait=Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched (2 or 3 actions gives R30\' or a 30\' emanation) suffers 1d%{harmSpellDie} HP negative (<b>save basic Fortitude</b>); undead instead regain 1d%{harmSpellDie} HP, or 1d%{harmSpellDie}+8 HP with 2 actions (<b>heightened +1</b> restores or inflicts +1d%{harmSpellDie} HP; undead regain +8 HP with 2 actions)"',
  'Haste':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains an extra Strike or Stride action each rd for 1 min (<b>heightened 7th</b> affects 6 targets)"',
  'Heal':
    'Level=1 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=0 ' +
    'Description=' +
      '"Touched (2 or 3 actions gives R30\' or a 30\' emanation) regains 1d%{healSpellDie} HP, or 1d%{healSpellDie}+8 HP with 2 actions; undead instead suffer 1d%{healSpellDie} HP (<b>save basic Fortitude</b>) (<b>heightened +1</b> restores or inflicts +1d%{healSpellDie} HP; restores +8 HP with 2 actions)"',
  'Heroism':
    'Level=3 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +1 attack, Perception, saves, and skill checks for 10 min (<b>heightened 6th</b> gives +2 bonus; <b>8th</b> gives +3 bonus)"',
  'Hideous Laughter':
    'Level=2 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts slowed 1 and loss of Reactions while sustained (<b>save Will</b> inflicts loss of Reactions only; critical success negates; critical failure inflicts prone for 1 rd, then slowed 1 and loss of Reactions)"',
  'Holy Cascade':
    'Level=4 ' +
    'Trait=Evocation,Good,Positive,Water ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 20\' burst inflicts 3d6 HP bludgeoning, plus 6d6 HP positive to undead and 6d6 HP good to fiends (<b>heightened +1</b> inflicts +1d6 HP bludgeoning and +2d6 HP positive and good)"',
  'Horrid Wilting':
    'Level=8 ' +
    'Trait=Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Targets in a 500\' radius suffer 10d10 HP negative (<b>save basic Fortitude</b>; plant and water creatures worsen save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Humanoid Form':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Small or Medium humanoid and gains +4 Deception to pass as the chosen ancestry for 10 min (<b>heightened 3rd</b> gives darkvision or low-light vision if appropriate to the ancestry; <b>5th</b> becomes a Large humanoid)"',
  'Hydraulic Push':
    'Level=1 ' +
    'Trait=Attack,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 3d6 HP bludgeoning and a 5\' push (double HP and distance with a critical success) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Hydraulic Torrent':
    'Level=4 ' +
    'Trait=Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line inflicts 8d6 HP bludgeoning and a 5\' push (<b>save basic Fortitude</b>; success negates push; critical failure doubles push distance)"',
  'Hypercognition':
    'Level=3 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="Allows self to use 6 Recall Knowledge actions immediately"',
  'Hypnotic Pattern':
    'Level=3 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst inflicts dazzled and fascinated while sustained for up to 1 min (<b>save Will</b> inflicts dazzled only; critical failure inflicts loss of Reactions)"',
  'Illusory Creature':
    'Level=2 ' +
    'Trait=Auditory,Illusion,Olfactory,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Creates an image of a Large or smaller creature with Armor Class %{spellDifficultyClass.%tradition}, +%{spellAttackModifier.%tradition} attack, 1d4+%{spellModifier.%tradition} HP nonlethal mental damage, and +%{spellDifficultyClass.%tradition-10} saves while sustained or until damaged; each Sustain allows directing two actions (<b>heightened +1</b> creature inflicts +1d4 HP and can be one size larger)"',
  'Illusory Disguise':
    'Level=1 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes self appear different and gives +%{4+(rank.Deception?0:level)} Deception to avoid uncovering the disguise for 1 hr (<b>heightened 2nd</b> also disguises voice and scent; <b>3rd</b> allows copying a specific individual)"',
  'Illusory Object':
    'Level=1 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Creates an image of a stationary object in a 20\' burst for 10 min (<b>heightened 2nd</b> effects include sounds and smells and last for 1 hr; <b>5th</b> effects are permanent)"',
  'Illusory Scene':
    'Level=5 ' +
    'Trait=Auditory,Illusion,Olfactory,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Creates in a 30\' burst a moving illusion with up to 10 creatures or objects, sounds, and smells for 1 hr (<b>heightened 6th</b> creatures in the scene can speak; <b>8th</b> effects are permanent)"',
  'Implosion':
    'Level=9 ' +
    'Trait=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 75 HP on 1 target each rd while sustained for up to 1 min; a target cannot be affected twice by a single casting (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +10 HP)"',
  'Insect Form':
    'Level=3 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium critter with 10 temporary HP, Armor Class %{level+18}, +13 attack, +2 damage, low-light vision, +13 Athletics modifier, and creature-specific features for 1 min (<b>heightened 4th</b> becomes a Large creature with 10\' reach, 15 temporary HP, +16 attack, +6 damage, +16 Athletics; <b>5th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, +18 attack, +2 damage and double damage dice, +20 Athletics)"',
  'Invisibility':
    'Level=2 ' +
    'Trait=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched becomes invisible for 10 min or until it uses a hostile action (<b>heightened 4th</b> effects last for 1 min, and a hostile action does not end the spell)"',
  'Invisibility Sphere':
    'Level=3 ' +
    'Trait=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' emanation makes creatures within invisible for 10 min or until any affected performs a hostile act (<b>heightened 5th</b> effects last for 1 hr)"',
  'Item Facade':
    'Level=1 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes the target object up to a 10\' cube appear decrepit or perfect for 1 hr (<b>heightened 2nd</b> effects last for 24 hr; <b>3rd</b> effects are permanent)"',
  'Jump':
    'Level=1 ' +
    'Trait=Move,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self to jump 30\' immediately (<b>heightened 3rd</b> affects touched, and effects last for 1 min)"',
  'Knock':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Gives +4 Athletics or Thievery on attempts to open the target object for 1 min; untrained attempts by self gain an additional +%{level}"',
  'Know Direction':
    'Level=1 ' +
    'Trait=Cantrip,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Reveals which direction is north (<b>heightened 7th</b> reveals direction to a familiar location)"',
  'Levitate':
    'Level=3 ' +
    'Trait=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to use concentrate actions to move the touched object or willing creature up or down 10\' for 5 min"',
  'Light':
    'Level=1 ' +
    'Trait=Cantrip,Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched object lights a 20\' radius until next daily prep (<b>heightened 4th</b> lights a 60\' radius)"',
  'Lightning Bolt':
    'Level=3 ' +
    'Trait=Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"120\' line inflicts 4d12 HP electricity (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Locate':
    'Level=3 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Reveals the direction to a named object or the nearest object of a named type while sustained; effects are blocked by lead and running water (<b>heightened 5th</b> reveals the direction to a creature or ancestry)"',
  'Lock':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched latch or lock opens only for self until next daily prep; a successful DC %{spellDifficultyClass.%tradition} Athletics or Thievery check (or lock DC + 4 if higher) ends the spell (<b>heightened 2nd</b> effects are permanent)"',
  'Longstrider':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +10\' Speed for 1 hr (<b>heightened 2nd</b> effects last for 8 hr)"',
  'Mage Armor':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +1 Armor Class with a +5 maximum Dexterity modifier until next daily prep (<b>heightened 4th</b> also gives +1 saves; <b>6th</b> gives +2 Armor Class; <b>8th</b> gives +2 saves; <b>10th</b> gives +3 Armor Class and saves)"',
  'Mage Hand':
    'Level=1 ' +
    'Trait=Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Moves a light object 20\' per rd while sustained (<b>heightened 3rd</b> moves a Bulk 1 object; <b>5th</b> R60\'; <b>7th</b> moves a Bulk 2 object)"',
  'Magic Aura':
    'Level=1 ' +
    'Trait=Uncommon,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Alters the magical aura of the target object, making it appear as non-magical, as a common magical item of up to twice the spell level, or as under the effects of a spell of up to the spell level, until next daily prep (<b>heightened 3rd</b> can affect a creature or all of its possessions)"',
  'Magic Fang':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched creature\'s unarmed attack gains +1 attack and 2 damage dice for 1 min"',
  'Magic Missile':
    'Level=1 ' +
    'Trait=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' 1 missile (2 or 3 actions gives 2 or 3 missiles) inflicts 1d4+1 HP force (<b>heightened +2</b> gives 1 additional missile per action)"',
  'Magic Mouth':
    'Level=2 ' +
    'Trait=Auditory,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"The image of a mouth appears on the touched creature or object and speaks a specified message up to 25 words the next time a specified trigger occurs within 30\'"',
  'Magic Weapon':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="Touched weapon gains +1 attack and 2 damage dice for 1 min"',
  'Magnificent Mansion':
    'Level=7 ' +
    'Trait=Uncommon,Conjuration,Extradimensional ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Creates an entrance to a 40\'x40\'x40\' demiplane that can only be entered by those specified, is staffed by servants, and contains provisions for up to 150 people"',
  "Mariner's Curse":
    'Level=5 ' +
    'Trait=Curse,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers incurable sickened 1, plus slowed 1 on open water, until the curse is removed (<b>save Will</b> inflicts curable sickened 1; critical success negates; critical success inflicts incurable sickened 2)"',
  'Mask Of Terror':
    'Level=7 ' +
    'Trait=Emotion,Fear,Illusion,Mental,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target inflicts frightened 2 for 1 rd on attackers for 1 min (<b>save Will</b> negates; critical failure prevents attack) (<b>heightened 8th</b> affects 5 targets)"',
  'Massacre':
    'Level=9 ' +
    'Trait=Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line inflicts 100 HP negative on creatures up to level 17 and kills those reduced to 0 HP; if none die, it inflicts an additional 30 negative on all within the line, including self (<b>save Fortitude</b> inflicts 9d6 HP; critical success negates; critical failure kills) (<b>heightened 10th</b> inflicts 115 HP (<b>save Fortitude</b> 10d6 HP) on creatures up to level 19)"',
  'Maze':
    'Level=8 ' +
    'Trait=Conjuration,Extradimensional,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transports the target to an extradimensional maze while sustained or until it has a critical success or 2 successive normal successes on DC %{spellDifficultyClass.%tradition} Survival or Perception checks"',
  'Meld Into Stone':
    'Level=3 ' +
    'Trait=Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to enter a touched stone, retaining the ability to hear outside sounds, for 10 min"',
  'Mending':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Restores 5 HP per spell level to a light, non-magical object (<b>heightened 2nd</b> can affect a 1 Bulk object; <b>3rd</b> can affect a 2 Bulk or magical 1 Bulk object)"',
  'Message':
    'Level=1 ' +
    'Trait=Auditory,Cantrip,Illusion,Linguistic,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' Allows self to hold a private conversation with a visible target for 1 turn (<b>heightened 3rd</b> R500\')"',
  'Meteor Swarm':
    'Level=9 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 4 meteors each inflict 6d10 HP bludgeoning in a 10\' burst and 14d6 HP fire in a 40\' burst (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d10 HP bludgeoning and +2d6 HP fire)"',
  'Mind Blank':
    'Level=8 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +4 saves vs. mental effects and automatic counteract attempts at the spell level + 1 vs. detection, revelation, and scrying until next daily prep"',
  'Mind Probe':
    'Level=5 ' +
    'Trait=Uncommon,Divination,Linguistic,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Self gains answers from the target, requiring a DC %{spellDifficultyClass.%tradition} Deception check to refuse to answer each, with critical success giving a believable false answer (<b>save Will</b> negates; critical failure inflicts -4 Deception)"',
  'Mind Reading':
    'Level=3 ' +
    'Trait=Uncommon,Detection,Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Reveals the surface thoughts of the target and whether its intelligence is higher, lower, or equal (<b>save Will</b> reveals relative intelligence only; critical success allows the target to read self\'s surface thoughts instead; critical failure allows sustaining for up to 1 min with no further save attempts)"',
  'Mindlink':
    'Level=1 ' +
    'Trait=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Telepathically transmits 10 min of information from self to touched"',
  'Miracle':
    'Level=10 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known divine spell of up to 9th level or a common spell of up to 7th level"',
  'Mirror Image':
    'Level=2 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates three duplicates that have an equal chance of misdirecting attacks on self for 1 min; any hit on a duplicate destroys it, and a critical success also hits self with a normal success"',
  'Misdirection':
    'Level=2 ' +
    'Trait=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Changes the magical aura of one target to mimic a second target until next daily prep"',
  'Mislead':
    'Level=6 ' +
    'Trait=Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Turns self invisible and creates an illusory duplicate while sustained for up to 1 min; a successful Deception vs. Perception can make it appear that a self action originated with the duplicate"',
  'Modify Memory':
    'Level=4 ' +
    'Trait=Uncommon,Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Changes 1 rd of the target\'s memory each rd while sustained for up to 5 min (<b>save Will</b> negates; critical success allows the target to notice the attempt) (<b>heightened 6th</b> erases all memory of a specified topic from a willing target)"',
  'Moment Of Renewal':
    'Level=8 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"6 touched instantly gain the effects of 24 hr of rest once per target per day"',
  'Monstrosity Form':
    'Level=8 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Huge phoenix, purple worm, or sea serpent with 20 temporary HP, Armor Class %{level+20}, +28 attack, darkvision, +30 Athletics modifier, and creature-specific attacks for 1 min (<b>heightened 9th</b> gives 25 temporary HP, Armor Class %{level+22}, +31 attack, an additional damage die, +33 Athletics)"',
  'Moon Frenzy':
    'Level=5 ' +
    'Trait=Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5 willing targets gain 5 temporary HP, +10\' Speed, fangs and claws that inflict 2d6 HP piercing and 2d6 HP slashing plus 1d4 HP persistent bleed on a critical hit, and increase a size up to Large in full moonlight, but suffer weakness 5 to silver, for 1 min (<b>heightened 6th</b> gives 10 temporary HP, inflict 3d6 HP piercing and 3d6 HP slashing, weakness 10 to silver; <b>10th</b> gives 20 temporary HP, inflict 4d6 HP piercing and 4d6 HP slashing, weakness 20 to silver)"',
  'Nature Incarnate':
    'Level=10 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium green man or Gargantuan kaiju with 30 temporary HP, Armor Class %{level+25}, +34 attack, darkvision, +36 Athletics modifier, and creature-specific attacks for 1 min"',
  "Nature's Enmity":
    'Level=9 ' +
    'Trait=Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 5 targets in a 500\' burst suffer -10\' Speed, attacks from animals that inflict 2d10 HP slashing and flat-footed for 1 rd (DC 8 flat negates; <b>save basic Reflex</b>), a required DC 5 flat check to cast primal spells, and hostility from bonded animals, fungi, and plants for 10 min"',
  'Negate Aroma':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Negates the scent of a willing touched creature for 1 hr (<b>heightened 5th</b> R30\' affects 10 targets)"',
  'Neutralize Poison':
    'Level=3 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract check against 1 poison affecting touched"',
  'Nightmare':
    'Level=4 ' +
    'Trait=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Causes a familiar target to have nightmares and awaken fatigued (<b>save Will</b> inflicts nightmares only; critical success negates; critical failure also inflicts drained 2 until no longer fatigued)"',
  'Nondetection':
    'Level=3 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched gains automatic counteract attempts vs. magical divinations for 8 hr"',
  'Obscuring Mist':
    'Level=2 ' +
    'Trait=Conjuration,Water ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="R120\' 20\' burst conceals creatures for 1 min"',
  "Outcast's Curse":
    'Level=4 ' +
    'Trait=Curse,Enchantment,Mental,Misfortune ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers one step worse initial attitudes and the worse of two Deception, Diplomacy, Intimidation, and Performance rolls until the curse is removed (<b>save Will</b> effects last for 10 min; critical success negates; critical failure inflicts initial attitudes two steps worse)"',
  'Overwhelming Presence':
    'Level=9 ' +
    'Trait=Auditory,Enchantment,Incapacitation,Mental,Visual ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"40\' burst inflicts fascinated and forces creatures to pay tribute once per turn for six turns (<b>save Will</b> affected must pay tribute only twice; critical success negates; critical failure causes affected to use all actions each turn to pay tribute)"',
  'Paralyze':
    'Level=3 ' +
    'Trait=Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts paralyzed for 1 rd (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure inflicts paralyzed for 4 rd; subsequent successful saves shorten the effects by 1 rd, and a critical success ends them) (<b>heightened 7th</b> affects 10 targets)"',
  'Paranoia':
    'Level=2 ' +
    'Trait=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target becomes unfriendly to all others for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure causes target to treat all others as enemies) (<b>heightened 6th</b> effects 5 targets)"',
  'Pass Without Trace':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Increases the DC to Track self by 4 or to %{spellDifficultyClass.%tradition}, whichever is higher, for 1 hr (<b>heightened 2nd</b> effects last for 8 hr; <b>4th</b> effects last for 8 hr and affect a 20\' radius and 10 creatures)"',
  'Passwall':
    'Level=5 ' +
    'Trait=Uncommon,Conjuration,Earth ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates a 5\'x10\'x10\' tunnel in wood, plaster, or stone for 1 hr (<b>heightened 7th</b> the tunnel extends 20\', appears as normal wall, and can be entered only using a password or trigger)"',
  'Pest Form':
    'Level=1 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Tiny animal with Armor Class %{level+15}, 20\' Speed, low-light vision, 30\' imprecise scent, +10 Athletics and Stealth modifiers, -4 Athletics modifier, and weakness 5 to physical damage for 10 min (<b>heightened 4th</b> becomes a creature with a 20\' fly Speed)"',
  'Phantasmal Calamity':
    'Level=6 ' +
    'Trait=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 30\' burst inflicts 11d6 HP mental (<b>save basic Will</b>; critical failure also inflicts stunned 1 and trapped until a subsequent Will save each rd succeeds) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Phantasmal Killer':
    'Level=4 ' +
    'Trait=Death,Emotion,Fear,Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts 8d6 HP mental and frightened 2 (<b>save Will</b> inflicts 4d6 HP mental and frightened 1; critical success negates; critical failure inflicts death on a failed Fortitude save or 12d6 HP mental, fleeing for 1 rd, and frightened 1 on success) (<b>heightened +1</b> inflicts +2d6 HP, or +3d6 HP on a critical failure)"',
  'Phantom Pain':
    'Level=1 ' +
    'Trait=Illusion,Mental,Nonlethal ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 2d4 HP mental, 1d4 HP persistent mental, and sickened 1 for 1 min or until no longer sickened (<b>save Will</b> inflicts initial HP only; critical success negates; critical failure inflicts sickened 2) (<b>heightened +1</b> inflicts +2d4 HP initial and +1d4 HP persistent)"',
  'Phantom Steed':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R30\' Conjures a magical mount (Armor Class 20, HP 10, 40\' Speed) that can be ridden only by a designated creature for 8 hr (<b>heightened 4th</b> mount has 60\' Speed and can move normally over water and natural difficult terrain; <b>5th</b> mount can also <i>Air Walk</i> for 1 rd; <b>6th</b> mount has 80\' Speed and can fly)"',
  'Plane Shift':
    'Level=7 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transports self and 8 willing targets to an imprecise location on a different plane"',
  'Plant Form':
    'Level=5 ' +
    'Trait=Plant,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large plant with 12 temporary HP, Armor Class %{level+19}, +17 attack, +11 damage, low-light vision, resistance 10 to poison, +19 Athletics modifier, and plant-specific attacks for 1 min (<b>heightened 6th</b> becomes a Huge plant with +5\' reach, 24 temporary HP, Armor Class %{level+22}, +21 attack, +16 damage, +22 Athletics)"',
  'Polar Ray':
    'Level=8 ' +
    'Trait=Attack,Cold,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 10d8 HP cold, or double HP on a critical success, and drained 2 (<b>heightened +1</b> inflicts +2d8 HP)"',
  'Possession':
    'Level=7 ' +
    'Trait=Uncommon,Incapacitation,Mental,Necromancy,Possession ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self inhabits and controls the target\'s body for 1 min (<b>save Will</b> self inhabits but cannot control; critical success negates; critical failure gives control without further saves); a success on subsequent Will saves each turn negates control for 1 rd, and a critical success ends the spell (<b>heightened 9th</b> effects last for 10 min, and self body merges into possessed body)"',
  'Power Word Blind':
    'Level=7 ' +
    'Trait=Uncommon,Auditory,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Permanently blinds a target up to level 11, blinds a level 12 or 13 target for 1d4 min, or dazzles a level 14+ target for 1 min (<b>heightened +1</b> increases outcome levels by 2)"',
  'Power Word Kill':
    'Level=9 ' +
    'Trait=Uncommon,Auditory,Death,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Kills a target up to level 14 or 50 HP, inflicts 0 HP and dying 1 on a level 15 target, or inflicts 50 HP on a level 16+ target (<b>heightened +1</b> increases outcome levels by 2)"',
  'Power Word Stun':
    'Level=8 ' +
    'Trait=Uncommon,Auditory,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts stunned for 1d6 rd on a target up to level 13, stunned for 1 rd on a level 14 or 15 target, or stunned 1 on a level 16+ target (<b>heightened +1</b> increases outcome levels by 2)"',
  'Prestidigitation':
    'Level=1 ' +
    'Trait=Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R10\' Performs cooking, lifting, making a minor object, or tidying while sustained"',
  'Primal Herd':
    'Level=10 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self and 5 willing targets become Huge mammoths with 20 temporary HP, 40\' Speed, low-light vision, Armor Class level + 22, a tusk attack that inflicts 4d8+19 HP piercing, a trunk attack that inflicts 4d6+16 HP bludgeoning, a foot attack that inflicts 4d6+13 HP bludgeoning, low-light vision, +30 Athletics modifier, and a trample action for 1 min"',
  'Primal Phenomenon':
    'Level=10 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known primal spell of up to 9th level or a common spell of up to 7th level"',
  'Prismatic Sphere':
    'Level=9 ' +
    'Trait=Abjuration,Light ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R10\' 20\' bright light in a 10\' burst inflicts blindness for 1 rd (<b>save Will</b> inflicts dazzled for 1 rd; critical failure inflicts blindness for 1 min) and these effects on creatures passing through for 1 hr: 20 HP fire (<b>save basic Reflex</b>); 25 HP acid (<b>save basic Reflex</b>); 30 HP electricity (<b>save basic Reflex</b>); 10 HP poison and enfeebled 1 for 1 min (<b>save basic Fortitude</b> also negates enfeebled); <i>Flesh To Stone</i> effects (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates); <i>Warp Mind</i> effects (<b>save Will</b> inflicts confused for 1 action; critical success negates); slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects)"',
  'Prismatic Spray':
    'Level=7 ' +
    'Trait=Evocation,Light ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone randomly inflicts one of these effects on each creature affected: (1) 50 HP fire (<b>save Reflex</b> negates); (2) 60 HP acid (<b>save Reflex</b> negates); (3) 70 HP electricity (<b>save Reflex</b> negates); (4) 30 HP poison and enfeebled 1 for 1 min (<b>save Fortitude</b> negates); (5) <i>Flesh To Stone</i> effects (<b>save Fortitude</b> negates); (6) <i>Warp Mind</i> effects (<b>save Will</b> negates); (7) slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects); (8) two of the preceding effects"',
  'Prismatic Wall':
    'Level=8 ' +
    'Trait=Abjuration,Light ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' bright light emitted by a 60\'x30\' wall inflicts blindness for 1 rd (<b>save Will</b> inflicts dazzled for 1 rd; critical failure inflicts blindness for 1 min) and these effects on creatures passing through for 1 hr: 20 HP fire (<b>save basic Reflex</b>); 25 HP acid (<b>save basic Reflex</b>); 30 HP electricity (<b>save basic Reflex</b>); 10 HP poison and enfeebled 1 for 1 min (<b>save basic Fortitude</b> also negates enfeebled); <i>Flesh To Stone</i> effects (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates); <i>Warp Mind</i> effects (<b>save Will</b> inflicts confused for 1 action; critical success negates); slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects)"',
  'Private Sanctum':
    'Level=4 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"100\' burst around touched location blocks sensory information, scrying, and mind-reading until next daily prep"',
  'Produce Flame':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP fire, or double HP plus 1d4 HP persistent fire on a critical success (<b>heightened +1</b> inflicts +1d4 HP initial and persistent)"',
  'Project Image':
    'Level=7 ' +
    'Trait=Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates an illusory copy of self, with the same Armor Class and saves, that can be used as a source of spells while sustained for up to 1 min or until damaged (<b>heightened +2</b> extends maximum sustain to 10 min)"',
  'Protection':
    'Level=1 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +1 Armor Class and saves vs. creatures of a specified alignment, and +3 vs. summoned creatures and control effects, for 1 min"',
  'Prying Eye':
    'Level=5 ' +
    'Trait=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location and that can be moved 30\' each rd while sustained"',
  'Punishing Winds':
    'Level=8 ' +
    'Trait=Air,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R100\' 30\' radius lowers flying creatures by 40\', creates greater difficult terrain for flying creatures and difficult terrain for others, and requires a successful flying Acrobatics or grounded Athletics vs. DC %{spellDifficultyClass.%tradition} to exit while sustained for up to 1 min"',
  'Purify Food And Drink':
    'Level=1 ' +
    'Trait=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Removes contaminates from 1 cubic foot of food or water"',
  'Purple Worm Sting':
    'Level=6 ' +
    'Trait=Necromancy,Poison ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers 3d6 HP piercing and stage 1 purple worm venom, which inflicts 3d6 HP poison and enfeebled 2; subsequent failures after 1 rd will inflict 4d6 HP and 6d6 HP at stage 2 and stage 3 (<b>save Fortitude</b> inflicts 3d6 HP piercing and 3d6 HP poison only; critical success inflicts 3d6 HP piercing only; critical failure inflicts stage 2 immediately)"',
  'Raise Dead':
    'Level=6 ' +
    'Trait=Uncommon,Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast="10 min" ' +
    'Description="R10\' Restores a willing soul up to level 13 to its corpse, dead for at most 3 days, giving it 1 HP, clumsy 2, drained 2, and enfeebled 2 for 1 week (<b>heightened 7th</b> raises the maximum level to 15; <b>8th</b> level 17; <b>9th</b> level 19; <b>10th</b> level 21)"',
  'Ray Of Enfeeblement':
    'Level=1 ' +
    'Trait=Attack,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts enfeebled 1; critical success negates; critical failure inflicts enfeebled 3; critical success on attack worsens save by 1 degree)"',
  'Ray Of Frost':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Cold,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP cold (critical success inflicts double HP and -10 Speed for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Read Aura':
    'Level=1 ' +
    'Trait=Cantrip,Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Reveals whether an object is magical and the related school of magic (<b>heightened 3rd</b> affects 10 targets; <b>6th</b> affects unlimited targets)"',
  'Read Omens':
    'Level=4 ' +
    'Trait=Uncommon,Divination,Prediction ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals a clue or advice about a proposed activity up to 1 week in the future"',
  'Regenerate':
    'Level=7 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched target regains 15 HP and regrows a damaged organ each rd for 1 min; suffering new acid or fire damage negates the effects for 1 rd (<b>heightened 9th</b> restores 20 HP each rd)"',
  'Remake':
    'Level=10 ' +
    'Trait=Uncommon,Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 hr" ' +
    'Description=' +
      '"R5\' Fully re-creates a known object up to 5\'x5\'x5\' from a remnant"',
  'Remove Curse':
    'Level=4 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 curse affecting touched"',
  'Remove Disease':
    'Level=3 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast="10 min" ' +
    'Description="Makes a counteract attempt vs. 1 disease affecting touched"',
  'Remove Fear':
    'Level=2 ' +
    'Trait=Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 fear effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Remove Paralysis':
    'Level=2 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 paralysis effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Repulsion':
    'Level=6 ' +
    'Trait=Abjuration,Aura,Mental ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Emanation up to 40\' prevents creatures from approaching for 1 min (<b>save Will</b> inflicts difficult terrain; critical success negates)"',
  'Resilient Sphere':
    'Level=4 ' +
    'Trait=Abjuration,Force ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates an impassible force sphere with Armor Class 5, Harness 10, and 40 HP around the target for 1 min or until destroyed (<b>save Reflex</b> decreases the HP to 10; critical success negates)"',
  'Resist Energy':
    'Level=2 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 5 vs. a specified energy type for 10 min (<b>heightened 4th</b> gives resistance 10 to 2 targets; <b>7th</b> gives resistance 15 to 5 targets)"',
  'Resplendent Mansion':
    'Level=9 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates a 300\'x300\' mansion, with entrances protected by <i>Alarm</i> effects and containing provisions for up to 150 people, until next daily prep"',
  'Restoration':
    'Level=2 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Gives a 2-step reduction to a clumsy, enfeebled, or stupefied condition, a 1-step reduction to two of these conditions, or a 1-stage reduction to a toxin affecting touched (<b>heightened 4th</b> allows reducing a drained condition, lessening a toxin by 2 stages, or reducing a non-permanent doomed condition by 1; <b>6th</b> allows reducing a permanent doomed condition by 1)"',
  'Restore Senses':
    'Level=2 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. a magical blindness or deafness effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Retrocognition':
    'Level=7 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Reveals impressions of 1 day of past events at the current location per 1 min of concentration; traumatic events require a Will save to maintain the spell (<b>heightened 8th</b> gives impressions of 1 year per min; <b>9th</b> gives impressions of 1 century per min)"',
  'Reverse Gravity':
    'Level=7 ' +
    'Trait=Uncommon,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Objects in a 20\'x40\' cylinder fall upward for 1 min"',
  'Revival':
    'Level=10 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' radius restores 10d8+40 HP to living targets and raises dead targets with the same number of temporary HP while sustained for up to 1 min"',
  'Righteous Might':
    'Level=6 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains Armor Class %{level+20}, 10 temporary HP, 40\' Speed, resistance 3 to physical damage, darkvision, +21 attack and +8 damage (+6 if ranged) with a %{deityWeaponLowered}, and +23 Athletics for 1 min (<b>heightened 8th</b> gives a Large form with 10\' reach, Armor Class %{21+level}, 15 temporary HP, resistance 4 to physical damage, +28 attack and +15 damage (+12 if ranged) with a %{deityWeaponLowered}, and +29 Athletics)"',
  'Rope Trick':
    'Level=4 ' +
    'Trait=Uncommon,Conjuration,Extradimensional ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched rope leads to an extradimensional space that can hold 8 Medium creatures for 8 hr"',
  'Sanctified Ground':
    'Level=3 ' +
    'Trait=Abjuration,Consecration ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"30\' burst gives +1 Armor Class, attack, damage, and saves vs. aberrations, celestials, dragons, fiends, monitors, or undead until next daily prep"',
  'Sanctuary':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Prevents creatures from attacking touched for 1 min (<b>save Will</b> each rd negates for 1 rd; critical success ends the spell; critical failure allows no further save attempts)"',
  'Scintillating Pattern':
    'Level=8 ' +
    'Trait=Illusion,Incapacitation,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts confused for 1d4 rd and dazzled in a 40\' radius while sustained for up to 1 min (<b>save Will</b> inflicts dazzled only; critical failure inflicts stunned for 1d4 rd, then confused for the remaining duration)"',
  'Scrying':
    'Level=6 ' +
    'Trait=Uncommon,Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Creates an invisible sensor that allows self to see the target creature while sustained for up to 10 min (<b>save Will</b> negates; critical success allows the target to glimpse self; critical failure allows the sensor to follow the target; scrying an unfamiliar target lowers the save DC by 2, and scrying an unknown target lowers it by 10)"',
  'Searing Light':
    'Level=3 ' +
    'Trait=Attack,Evocation,Fire,Good,Light ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R120\' Spell attack inflicts 5d6 HP fire, plus 5d6 HP good to fiends and undead (critical success inflicts double HP), and attempts to counteract magical darkness (<b>heightened +1</b> inflicts +2d6 HP fire and good)"',
  'Secret Page':
    'Level=3 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Makes the text on a touched page appear as different text unless a specified password is spoken"',
  'See Invisibility':
    'Level=2 ' +
    'Trait=Divination,Revelation ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self treats invisible creatures and objects as concealed for 10 min (<b>heightened 5th</b> effects last for 8 hr)"',
  'Sending':
    'Level=5 ' +
    'Trait=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Self exchanges a pair of 25-word messages with a known creature"',
  'Shadow Blast':
    'Level=5 ' +
    'Trait=Evocation,Shadow ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone, R120\' 15\' burst, or 50\' line inflicts 5d8 HP of choice of damage type (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Shadow Siphon':
    'Level=5 ' +
    'Trait=Illusion,Shadow ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Makes a counteract attempt on a damaging trigger spell at +2 the spell level, reducing the damage by half if successful"',
  'Shadow Walk':
    'Level=5 ' +
    'Trait=Uncommon,Conjuration,Shadow,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Allows self and 9 willing touched to travel through the Shadow Plane at 20x Speed for 8 hr"',
  'Shape Stone':
    'Level=4 ' +
    'Trait=Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="Reshapes touched 10\'x10\'x10\' stone"',
  'Shape Wood':
    'Level=2 ' +
    'Trait=Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Reshapes touched 20 cubic feet of wood"',
  'Shapechange':
    'Level=9 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Replicates any known polymorph spell of up to 8th level for 1 min"',
  'Shatter':
    'Level=2 ' +
    'Trait=Evocation,Sonic ' +
    'School=Evocation ' +
    'Traditions=Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 2d10 HP sonic on an unattended object, ignoring Hardness up to 4 (<b>heightened +1</b> inflicts +1d10 HP and ignores +2 Hardness)"',
  'Shield':
    'Level=1 ' +
    'Trait=Abjuration,Cantrip,Force ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +1 Armor Class for 1 rd; may end the spell and not use it again for 10 min to use Shield Block with Hardness 5 (<b>heightened 3rd</b> gives Hardness 10; <b>5th</b> gives Hardness 15; <b>7th</b> gives Hardness 20; <b>9th</b> gives Hardness 25)"',
  'Shield Other':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transfers half of damage suffered by target to self for 10 min or until either is reduced to 0 HP"',
  'Shillelagh':
    'Level=1 ' +
    'Trait=Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched staff gains +1 attack and 2 damage dice (3 damage dice vs. aberrations, extraplanar creatures, and undead) for 1 min"',
  'Shocking Grasp':
    'Level=1 ' +
    'Trait=Attack,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 2d12 HP electricity; touching an armored target gives +1 attack and also inflicts 1d4 HP persistent electricity (<b>heightened +1</b> inflicts +1d12 HP initial and +1 HP persistent)"',
  'Shrink':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target becomes Tiny for 5 min (<b>heightened 6th</b> affects 10 creatures)"',
  'Shrink Item':
    'Level=3 ' +
    'Trait=Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transforms a touched non-magical object of up to 80 Bulk and 20 cubic feet into the size of a coin with negligible Bulk until next daily prep"',
  'Sigil':
    'Level=1 ' +
    'Trait=Cantrip,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Inscribes a 1\\" sq magical mark on a touched object or creature; the mark can be scrubbed off and fades from a creature after 1 week (<b>heightened 3rd</b> marks a creature for 1 month; <b>5th</b> marks a creature for 1 year; <b>7th</b> marks a creature permanently)"',
  'Silence':
    'Level=2 ' +
    'Trait=Illusion ' +
    'School=Illusion ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched makes no sound for 1 min (<b>heightened 4th</b> affects a 10\' radius around touched)"',
  'Sleep':
    'Level=1 ' +
    'Trait=Enchantment,Incapacitation,Mental,Sleep ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst inflicts unconsciousness for 1 min or until a successful Perception check (<b>save Will</b> inflicts -1 Perception for 1 rd; critical success negates; critical failure inflicts unconsciousness for 1 hr or until a successful Perception check) (<b>heightened 4th</b> inflicts unconsciousness for 1 rd, or 1 min on a critical failure; targets release held objects and do not wake from a successful Perception check)"',
  'Slow':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts slowed 1 for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure inflicts slowed 2) (<b>heightened 6th</b> affects 10 targets)"',
  'Solid Fog':
    'Level=4 ' +
    'Trait=Conjuration,Water ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' burst conceals creatures and inflicts difficult terrain for 1 min"',
  'Soothe':
    'Level=1 ' +
    'Trait=Emotion,Enchantment,Healing,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target regains 1d10+4 HP and gains +2 saves vs. mental effects for 1 min (<b>heightened +1</b> restores +1d10+4 HP)"',
  'Sound Burst':
    'Level=2 ' +
    'Trait=Evocation,Sonic ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10\' burst inflicts 2d10 HP sonic and deafened for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, deafened for 1 min, and stunned 1) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Speak With Animals':
    'Level=2 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Allows self to communicate with animals for 10 min"',
  'Speak With Plants':
    'Level=4 ' +
    'Trait=Divination,Plant ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Allows self to communicate with plants and fungi for 10 min"',
  'Spectral Hand':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Creates a crawling, spectral hand that delivers touch spells for 1 min; damage to the hand ends the spell and inflicts 1d6 HP to self"',
  'Spell Immunity':
    'Level=4 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Gives touched an automatic counteract attempt vs. a specified spell until next daily prep"',
  'Spell Turning':
    'Level=7 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to use a Reaction that redirects a spell to its caster via a successful counterspell once within 1 hr"',
  'Spellwrack':
    'Level=6 ' +
    'Trait=Abjuration,Curse,Force ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Until the curse is removed, each time the target is affected by a spell with a duration, it suffers 2d12 HP persistent force and the duration of every spell affecting it is reduced by 1 rd (<b>save Will</b> effects last for 1 min; critical success negates; critical failure inflicts 4d12 HP)"',
  'Spider Climb':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains a climb Speed equal to its Speed for 10 min (<b>heightened 5th</b> effects last for 1 hr)"',
  'Spider Sting':
    'Level=1 ' +
    'Trait=Necromancy,Poison ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers 1d4 HP piercing and stage 1 spider venom, which inflicts 1d4 HP poison and enfeebled 1; subsequent failures after 1 rd will inflict an additional 1d4 HP poison and enfeebled 2 at stage 2 (<b>save Fortitude</b> inflicts 1d4 HP piercing and 1d4 HP poison only; critical success negates; critical failure inflicts stage 2 immediately)"',
  'Spirit Blast':
    'Level=6 ' +
    'Trait=Force,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target\'s spirit suffers 16d6 HP force (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Spirit Link':
    'Level=1 ' +
    'Trait=Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transfers 2 HP of damage each rd from a willing target to self for 10 min (<b>heightened +1</b> transfers +2 HP)"',
  'Spirit Song':
    'Level=8 ' +
    'Trait=Force,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 18d6 HP force on spirits, including any hidden in solid barriers (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Spiritual Epidemic':
    'Level=8 ' +
    'Trait=Curse,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts enfeebled 2 and stupefied 2 for 1 min and enfeebled 1 and stupefied 1 permanently; also affects creatures who later cast divine or occult spells on the target (<b>save Will</b> inflicts enfeebled 2 and stupefied 2 for 1 rd only; critical success negates; critical failure inflicts enfeebled 3 and stupefied 3 for 1 min and enfeebled 2 and stupefied 2 permanently)"',
  'Spiritual Guardian':
    'Level=5 ' +
    'Trait=Abjuration,Force ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Summoned guardian with 50 HP may attack or defend each rd while sustained for up to 1 min; +%{spellAttackModifier.%tradition} attack inflicts 2d8 HP force or weapon damage type; defense absorbs 10 HP of damage from an attack on an ally (<b>heightened +2</b> guardian gains +20 HP and inflicts +1d8 HP)"',
  'Spiritual Weapon':
    'Level=2 ' +
    'Trait=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spectral weapon makes a +%{spellAttackModifier.%tradition} attack that inflicts 1d8 HP force or weapon damage type each rd while sustained for up to 1 min (<b>heightened +2</b> inflicts +1d8 HP)"',
  'Stabilize':
    'Level=1 ' +
    'Trait=Cantrip,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R30\' Removes dying condition from target"',
  'Status':
    'Level=2 ' +
    'Trait=Detection,Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Reveals willing touched\'s direction, distance, and conditions until next daily prep (<b>heightened 4th</b> R10\' affects 10 targets)"',
  'Stinking Cloud':
    'Level=3 ' +
    'Trait=Conjuration,Poison ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst conceals creatures and inflicts sickened 1 and slowed 1 for 1 min (<b>save Fortitude</b> inflicts sickened 1 only; critical success negates; critical failure inflicts sickened 2 and slowed 1)"',
  'Stone Tell':
    'Level=6 ' +
    'Trait=Uncommon,Evocation,Earth ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Allows self to converse with stone for 10 min"',
  'Stone To Flesh':
    'Level=6 ' +
    'Trait=Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Restores touched petrified creature or transforms a human-sized stone object into flesh"',
  'Stoneskin':
    'Level=4 ' +
    'Trait=Abjuration,Earth ' +
    'School=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 5 to non-adamantine physical damage for 20 min; each hit reduces the duration by 1 min (<b>heightened 6th</b> gives resistance 10; <b>8th</b> gives resistance 15; <b>10th</b> gives resistance 20)"',
  'Storm Of Vengeance':
    'Level=9 ' +
    'Trait=Air,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R800\' 360\' burst inflicts -4 ranged attacks, greater difficult terrain for flying, and a choice each rd of 4d8 HP acid (<b>no save</b>), 4d10 HP bludgeoning (<b>save basic Fortitude</b>), 7d6 HP electricity (<b>save basic Reflex</b>), difficult terrain and concealment, or deafened for 10 min (<b>save Fortitude</b> negates) while sustained for up to 1 min (<b>heightened 10th</b> R2200\' 1000\' burst)"',
  'Subconscious Suggestion':
    'Level=5 ' +
    'Trait=Enchantment,Incapacitation,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Specified trigger prompts the target to follow a reasonable, 1 min suggestion until next daily prep (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure inflicts following the suggestion for 1 hr) (<b>heightened 9th</b> affects 10 targets)"',
  'Suggestion':
    'Level=4 ' +
    'Trait=Enchantment,Incapacitation,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target follows a reasonable suggestion for 1 min (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure effects last for 1 hr) (<b>heightened 8th</b> targets 10 creatures)"',
  'Summon Animal':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 animal appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Celestial':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 celestial appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Construct':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 construct appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Dragon':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 dragon appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Elemental':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 elemental appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Entity':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 aberration appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Fey':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Occult,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 fey appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Fiend':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 fiend appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"', 
  'Summon Giant':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 giant appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Plant Or Fungus':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 plant or fungus appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Sunburst':
    'Level=7 ' +
    'Trait=Evocation,Fire,Light,Positive ' +
    'School=Evocation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst inflicts 8d10 HP fire, plus 8d10 HP positive to undead (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure also inflicts permanent blindness) (<b>heightened +1</b> inflicts +1d10 HP fire and positive)"',
  'Synaptic Pulse':
    'Level=5 ' +
    'Trait=Enchantment,Incapacitation ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts stunned 2 (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure inflicts stunned for 1 rd)"',
  'Synesthesia':
    'Level=5 ' +
    'Trait=Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts a DC 5 flat check for concentration, clumsy 3, -10 Speed, and concealment of all objects and creatures for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure inflicts stunned 2) (<b>heightened 9th</b> affects 5 targets)"',
  'Talking Corpse':
    'Level=4 ' +
    'Trait=Uncommon,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched corpse truthfully answers 3 questions within 10 min (<b>save Will</b> allows lying or refusing to answer; critical success prevents self from resting for 24 hr; critical failure inflicts -2 on Deception checks when giving misleading answers)"',
  'Tanglefoot':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Conjuration,Plant ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts -10\' Speed for 1 rd, or immobilized 1 for 1 rd on a critical success; a successful Escape negates (<b>heightened 2nd</b> effects last for 2 rd; <b>4th</b> effects last for 1 min)"',
  'Tangling Creepers':
    'Level=6 ' +
    'Trait=Conjuration,Plant ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R500\' 40\' burst inflicts -10\' Speed and immobilizes 1 target for 1 rd (a successful Escape negates) each rd for 10 min"',
  'Telekinetic Haul':
    'Level=5 ' +
    'Trait=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Moves an 80 Bulk, 20\' cubic object 20\' each rd while sustained for up to 1 min"',
  'Telekinetic Maneuver':
    'Level=2 ' +
    'Trait=Attack,Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="R60\' Spell attack attempts to Disarm, Shove, or Trip"',
  'Telekinetic Projectile':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Spell attack hurls a loose object that inflicts 1d6+%{spellModifier.%tradition} HP of the appropriate damage type, or double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Telepathic Bond':
    'Level=5 ' +
    'Trait=Uncommon,Divination,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Self and 4 willing touched can communicate telepathically for 8 hr"',
  'Telepathic Demand':
    'Level=9 ' +
    'Trait=Enchantment,Incapacitation,Linguistic,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Self exchanges a pair of 25-word messages with an existing telepathic target, sending a <i>Suggestion</i> as part of the message (<b>save Will</b> gives immunity for 1 day; critical success gives immunity for 1 month)"',
  'Telepathy':
    'Level=4 ' +
    'Trait=Divination,Linguistic,Mental ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to communicate telepathically with any creature in a 30\' radius for 10 min (<b>heightened 6th</b> allows communication with creatures without a shared language)"',
  'Teleport':
    'Level=6 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transports self and 4 willing touched creatures or objects up to 100 miles to a point near a specified known location (<b>heightened 7th</b> transports 1000 miles; <b>8th</b> transports anywhere on the same planet; <b>9th</b> transports to any planet in the same system; <b>10th</b> transports to any planet in the same galaxy)"',
  'Time Stop':
    'Level=10 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Allows self to perform 3 rd of actions that don\'t affect others until the spell ends"',
  'Tongues':
    'Level=5 ' +
    'Trait=Uncommon,Divination ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Target understands and speaks all languages for 1 hr (<b>heightened 7th</b> effects last for 8 hr)"',
  'Touch Of Idiocy':
    'Level=2 ' +
    'Trait=Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts stupefied 2 (<b>save Will</b> negates; critical failure inflicts stupefied 4)"',
  'Tree Shape':
    'Level=2 ' +
    'Trait=Plant,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Self becomes a Large tree with Armor Class 20 for 8 hr"',
  'Tree Stride':
    'Level=5 ' +
    'Trait=Uncommon,Conjuration,Plant,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Transports self from an adjacent tree to another of the same species within 5 miles (<b>heightened 6th</b> transports 50 miles; <b>8th</b> transports 500 miles; <b>9th</b> transports anywhere on the planet)"',
  'True Seeing':
    'Level=6 ' +
    'Trait=Divination,Revelation ' +
    'School=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Makes counteract checks to allow self to see through illusions and transmutations for 10 min"',
  'True Strike':
    'Level=1 ' +
    'Trait=Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self uses the better of two attack rolls, ignores concealed and hidden conditions, and ignores circumstance penalties on the next Strike in the same turn"',
  'True Target':
    'Level=7 ' +
    'Trait=Divination,Fortune,Prediction ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Allies\' attacks within 1 rd on a designated creature ignore concealed and hidden conditions and use the better of two attack rolls"',
  'Uncontrollable Dance':
    'Level=8 ' +
    'Trait=Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers flat-footed and no Reactions for 1 min and spends 2 actions each turn dancing (<b>save Will</b> effects last for 3 rd and the target spends 1 action each turn dancing; critical success negates; critical failure effects last for 1 min and the target spends all actions each turn dancing)"',
  'Undetectable Alignment':
    'Level=2 ' +
    'Trait=Uncommon,Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touched appears neutral to alignment detection until next daily prep"',
  'Unfathomable Song':
    'Level=9 ' +
    'Trait=Auditory,Emotion,Enchantment,Fear,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Randomly inflicts frightened 2, confused for 1 rd, stupefied 4 for 1 rd, or blinded for 1 rd on 5 targets while sustained for up to 1 min (<b>save Will</b> negates for 1 rd; critical success negates; critical failure replaces frightened 2 with stunned for 1 rd and stupefied 1)"',
  'Unfettered Pack':
    'Level=7 ' +
    'Trait=Abjuration ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10 targets ignore environmental difficult terrain and circumstance Speed penalties for 1 hr (<b>heightened 9th</b> targets ignore environmental greater difficult terrain)"',
  'Unrelenting Observation':
    'Level=8 ' +
    'Trait=Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R100\' 5 targets in a 20\' burst can see a 6th target for 1 hr; lead and running water block the vision (<b>save Will</b> effects last for 1 min; critical success negates)"',
  'Unseen Servant':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R60\' Invisible servant with 4 Hit Points and a 30\' fly Speed obeys commands to move and manipulate objects while sustained or until reduced to 0 HP"',
  'Vampiric Exsanguination':
    'Level=6 ' +
    'Trait=Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone inflicts 12d6 HP negative, giving self temporary HP for 1 min equal to half that suffered by the most-affected target (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Vampiric Touch':
    'Level=3 ' +
    'Trait=Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 6d6 HP negative, giving self temporary HP for 1 min equal to half the inflicted damage (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Veil':
    'Level=4 ' +
    'Trait=Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Makes 10 creatures appear as different, similar creatures for 1 hr (<b>heightened 5th</b> also disguises voices and scents; <b>7th</b> targets can appear to be familiar individuals)"',
  'Ventriloquism':
    'Level=1 ' +
    'Trait=Auditory,Illusion ' +
    'School=Illusion ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to project their voice up to 60\' for 10 min (<b>heightened 2nd</b> effects last for 1 hr, allow changing voice quality, and require an active Perception to attempt to disbelieve)"',
  'Vibrant Pattern':
    'Level=6 ' +
    'Trait=Illusion,Incapacitation,Visual ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst dazzles and blinds creatures while sustained for up to 1 min; a successful save each rd after leaving the area removes the blindness (<b>save Will</b> inflicts dazzled only; critical failure blinds for 1 min with no further saves)"',
  'Visions Of Danger':
    'Level=7 ' +
    'Trait=Auditory,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R500\' 30\' burst inflicts 8d8 HP mental for 1 min (<b>save basic Will</b>; critical success allows an attempt to disbelieve that negates the effects) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Vital Beacon':
    'Level=4 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touch heals once each rd: 4d10 HP, 4d8 HP, 4d6 HP, then 4d4 HP, until expended or next daily prep (<b>heightened +1</b> each touch restores +1 die)"',
  'Volcanic Eruption':
    'Level=7 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 5\'x80\' cylinder inflicts 14d6 HP fire, -10\' Speed, and clumsy 1, plus a 20\' descent and difficult terrain on flying creatures (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP), and 3d6 HP fire to creatures within 5\' (<b>heightened +1</b> inflicts +2d6 HP and +1d6 HP within 5\')"',
  'Wail Of The Banshee':
    'Level=9 ' +
    'Trait=Auditory,Death,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"40\' emanation inflicts 8d10 HP negative and drained 1d4 (<b>save Fortitude</b> inflicts HP only; critical success negates; critical failure inflicts double HP and drained 4)"',
  'Wall Of Fire':
    'Level=4 ' +
    'Trait=Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 5\'x60\'x10\' line or 10\' radius ring inflicts 4d6 HP fire for 1 min (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Wall Of Force':
    'Level=6 ' +
    'Trait=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Creates an invisible 50\'x20\' wall with Armor Class 10, Harness 30, and 60 HP that blocks physical effects and corporeal, incorporeal, and ethereal creatures for 1 min (<b>heightened +2</b> gives +20 HP)"',
  'Wall Of Ice':
    'Level=5 ' +
    'Trait=Cold,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a 60\'x10\'x1\' wall or a 10\' radius hemisphere of opaque ice with Armor Class 10, Hardness 10, weakness to fire 15, and 40 HP per 10\' section for 1 min; rubble from destruction inflicts 2d6 HP cold and difficult terrain (<b>heightened +2</b> each section gains +10 HP, and rubble inflicts +1d6 HP)"',
  'Wall Of Stone':
    'Level=5 ' +
    'Trait=Conjuration,Earth ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a permanent 120\'x20\'x1\\" stone wall with Armor Class 10, Hardness 14, and 50 HP per 10\' section; rubble from destruction inflicts difficult terrain (<b>heightened +2</b> each section gains +15 HP)"',
  'Wall Of Thorns':
    'Level=3 ' +
    'Trait=Conjuration,Plant ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R60\' Creates a 60\'x10\'x5\' bramble wall with Armor Class 10, Hardness 10, and 20 HP per 10\' section that inflicts difficult terrain and 3d4 HP piercing for 1 min (<b>heightened +1</b> inflicts +1d4 HP, and each section gains +5 HP)"',
  'Wall Of Wind':
    'Level=3 ' +
    'Trait=Air,Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a 60\'x30\'x5\' wind wall that blocks small ammunition, inflicts -2 attack on larger ammunition, inflicts difficult terrain, and blocks flying creatures for 1 min (<b>save Fortitude</b> (flying creature) allows passage as difficult terrain; critical success negates; critical failure inflicts a 10\' push)"',
  "Wanderer's Guide":
    'Level=3 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Reveals a route to a specified destination and reduces the movement penalty from difficult terrain while following it by half until next daily prep"',
  'Warp Mind':
    'Level=7 ' +
    'Trait=Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts confused for 1 min (<b>save Will</b> inflicts confused for 1 action; critical success negates; critical failure inflicts permanent confusion)"',
  'Water Breathing':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' 5 targets can breathe water for 1 hr (<b>heightened 3rd</b> effects last for 8 hr; <b>4th</b> effects last until next daily prep)"',
  'Water Walk':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched can walk on liquids for 10 min (<b>heightened 4th</b> R30\' affects 10 creatures, and effects last for 1 hr)"',
  'Weapon Of Judgment':
    'Level=9 ' +
    'Trait=Evocation,Force ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R100\' +%{spellAttackModifier.%tradition} attacks by a force weapon inflict 3d10+%{spellModifier.%tradition} HP force or weapon damage type for 1 min (<b>heightened 10th</b> inflicts +1d10 HP)"',
  'Weapon Storm':
    'Level=4 ' +
    'Trait=Evocation ' +
    'School=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Weapon swing inflicts 4 dice of damage to every creature in a 30\' cone or 10\' emanation (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP and critical specialization effect) (<b>heightened +1</b> inflicts +1 damage die)"',
  'Web':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' 10\' burst inflicts difficult terrain and -10\' Speed for 1 rd (<b>save Reflex or Athletics</b> negates for 1 action; critical success negates for 1 rd; critical failure inflicts immobilized for 1 rd or until a successful Escape; successful Athletics also clears squares upon leaving)"',
  'Weird':
    'Level=9 ' +
    'Trait=Death,Emotion,Fear,Illusion,Mental ' +
    'School=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts 16d6 HP mental and frightened 2 on all targets within range (<b>save Will</b> inflicts half HP and frightened 1; critical success negates; critical failure inflicts death on a failed subsequent Fortitude save or double HP, frightened 2 and fleeing on success; critical success negates fleeing)"',
  'Wind Walk':
    'Level=8 ' +
    'Trait=Air,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Self and 5 touched become clouds that can move 20 MPH for 8 hr; attacking or spellcasting ends the spell"',
  'Wish':
    'Level=10 ' +
    'Trait=Divination ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"Reverses effects that require <i>Wish</i> or produces effects similar to a known arcane spell of up to 9th level or a common spell of up to 7th level"',
  'Zealous Conviction':
    'Level=6 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10 willing targets gain 12 temporary HP, gain +2 Will vs. mental effects, and must comply with self requests for 10 min (<b>save Will</b> after fulfilling a repugnant request ends the spell) (<b>heightened 9th</b> gives 18 temporary HP and +3 Will)"',
  'Zone Of Truth':
    'Level=3 ' +
    'Trait=Uncommon,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 20\' burst prevents lies and inflicts -2 Deception for 10 min (<b>save Will</b> inflicts -2 Deception only; critical success negates; critical failure inflicts -4 Deception)"',
  'Allegro':
    'Level=7 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target may take an additional Strike, Stride, or Step for 1 rd"',
  'Counter Performance':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Composition,Enchantment,Fortune,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allies in a 60\' emanation may substitute a self Performance roll for a save vs. the triggering auditory or visual effect"',
  'Dirge Of Doom':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Fear,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="30\' emanation inflicts frightened 1 on foes for 1 rd"',
  'Fatal Aria':
    'Level=10 ' +
    'Trait=Focus,Uncommon,Bard,Composition,Death,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Kills a target up to level 16 or 50 HP, inflicts 0 HP and dying 1 on a level 17 target, or inflicts 50 HP on a level 18+ target"',
  'House Of Imaginary Walls':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Creates an invisible, illusionary, 10\'x10\' wall with Armor Class 10, double the spell level Hardness, and quadruple the spell level HP, for 1 rd"',
  'Inspire Competence':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Allows self to use Performance to Aid an ally skill check, with normal failure counting as a success, for 1 rd"',
  'Inspire Courage':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives allies +1 attack, damage, and saves vs. fear for 1 rd"',
  'Inspire Defense':
    'Level=2 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives allies +1 Armor Class and saves, plus resistance of half the spell level to physical damage, for 1 rd"',
  'Inspire Heroics':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Bard,Enchantment,Metamagic ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"A successful Performance check increases the effects of a subsequent <i>Inspire Courage</i> or <i>Inspire Defense</i> to +2, or +3 on a critical success; failure does not expend a Focus Point"',
  'Lingering Composition':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Enchantment,Metamagic ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"A successful Performance check increases the duration of a subsequent cantrip composition to 3 rd, or 4 rd on a critical success; failure does not expend a Focus Point"',
  "Loremaster's Etude":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"R30\' Target may take the better of two rolls on the triggering Recall Knowledge check"',
  'Soothing Ballad':
    'Level=7 ' +
    'Trait=Focus,Uncommon,Bard,Composition,Emotion,Enchantment,Healing,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self and 9 allies gain a counteract attempt on all fear effects, a counteract attempt on all paralysis effects, or 7d8 HP restored (<b>heightened +1</b> restores +1d8 HP)"',
  'Triple Time':
    'Level=2 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="60\' emanation gives allies +10\' Speed for 1 rd"',
  "Champion's Sacrifice":
    'Level=6 ' +
    'Trait=Focus,Uncommon,Abjuration,Champion ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Redirects the damage of the triggering Strike or failed save from an ally to self"',
  "Hero's Defiance":
    'Level=10 ' +
    'Trait=Focus,Uncommon,Champion,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Free ' +
    'Description=' +
      '"Self recovers 10d4+20 HP before suffering damage that would reduce HP to 0 once per Refocus"',
  'Lay On Hands':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Champion,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched regains 6 HP and gains +2 Armor Class for 1 rd; touched undead instead suffers 1d6 HP and -2 Armor Class for 1 rd (<b>save basic Fortitude</b> also negates -2 Armor Class) (<b>heightened +1</b> restores +6 HP or inflicts +1d6 HP)"',
  'Litany Against Sloth':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers Reaction prevention and slowed 1 for 1 rd (<b>save Will</b> Reaction prevention only; critical success negates; critical failure inflicts slowed 2; slothful creatures worsen save by 1 degree)"',
  'Litany Against Wrath':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers 3d6 HP good whenever it damages a good creature for 1 rd (<b>save Will</b> inflicts damage once; critical success negates; critical failure also inflicts enfeebled 2; wrathful creatures worsen save by 1 degree)"',
  'Litany Of Righteousness':
    'Level=7 ' +
    'Trait=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers weakness 7 to good for 1 rd (<b>heightened +1</b> inflicts weakness +1)"',
  'Agile Feet':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +5\' Speed and can move normally in difficult terrain for the remainder of the turn"',
  'Appearance Of Wealth':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst fascinates creatures attracted to wealth in a 20\' radius while sustained for up to 1 min (<b>save Will</b> effects last for 1 rd; critical success negates)"',
  'Artistic Flourish':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R15\' Target weapon gains +%{(rank.Crafting||0)-1<?1>?0} attack, or target skill tool gains +%{(rank.Crafting||0)-1<?1>?0} checks, for 10 min (<b>heightened 7th</b> gives +%{(rank.Crafting||0)-1<?2>?0} bonus; <b>10th</b> gives +%{(rank.Crafting||0)-1<?3>?0} bonus)"',
  'Athletic Rush':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +10\' Speed and +2 Athletics for 1 rd and may immediately Stride, Leap, Climb, or Swim"',
  'Bit Of Luck':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target may use the better of two rolls on a save within 1 min once per target per day"',
  'Blind Ambition':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Target suffers -2 to resist attempts to Coerce it to advance its ambitions for 10 min (<b>save Will</b> inflicts -1 resistance; critical success negates; critical failure causes single-minded focus on its ambitions)"',
  'Captivating Adoration':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental,Visual ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Fascinates targets in a 15\' emanation for 1 min (<b>save Will</b> effects last for 1 action; critical success negates; critical failure also improves attitude by 1 step) (<b>heightened +1</b> increases the radius by 15\')"',
  'Charming Touch':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched becomes friendly, or helpful if already friendly, and cannot use hostile actions for 10 min (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure makes the target helpful)"',
  'Cloak Of Shadow':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Darkness,Evocation,Shadow ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"20\' emanation around willing touched reduces bright light to dim and conceals touched for 1 min; target may shed the cloak, and the spell ends if another picks it up"',
  'Commanding Lash':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R100\' Target harmed by self\'s most recent action obeys a command to approach, run away, drop a held object, drop prone, or stand in place for 1 rd (<b>save Will</b> negates; critical failure target uses all actions on its next turn to obey)"',
  'Competitive Edge':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +1 attack and skill checks, increasing to +3 immediately after a foe within 20\' critically succeeds on the same, while sustained for up to 1 min (<b>heightened 7th</b> increases bonuses to +2 and +4)"',
  'Cry Of Destruction':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Sonic ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 1d8 HP sonic, or 1d12 HP sonic if self has already damaged a foe this turn (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d8 HP or +1d12 HP)"',
  'Darkened Eyes':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Darkness,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Suppresses the target\'s darkvision or low-light vision for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure also blinds until a successful save at the end of a turn)"',
  'Dazzling Flash':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Light,Visual ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts blinded for 1 rd (Interact action ends the effect) and dazzled for 1 min (<b>save Fortitude</b> inflicts dazzled for 1 rd; critical success negates; critical failure inflicts dazzled for 1 hr) (<b>heightened 3rd</b> extends effects to a 30\' cone)"',
  "Death's Call":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R20\' Gives self temporary HP for 1 min equal to %{spellModifier.%tradition} + the level of a living creature that dies, or double that for an undead creature that is destroyed"',
  'Delusional Pride':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts -1 attacks and skill checks on a target that fails an attack or skill check by the end of its turn, or -2 if it fails twice, for 10 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure effects last for 24 hr)"',
  'Destructive Aura':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Aura,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' emanation inflicts -2 resistances (<b>heightened +2</b> inflicts an additional -2 resistances)"',
  'Disperse Into Air':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Air,Cleric,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"After taking the triggering damage, self becomes air with no actions and immunity to attacks until the end of the turn, then reforms anywhere within 15\'"',
  'Downpour':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 30\' burst extinguishes non-magical flames, gives concealment and fire resistance 10, and damages creatures with a water weakness for 1 min (<b>heightened +1</b> gives +2 fire resistance)"',
  "Dreamer's Call":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target obeys a suggestion and suffers flat-footed and fascinated until the end of its next turn (<b>save Will</b> inflicts flat-footed and fascinated only; critical success negates; critical failure prevents the target from taking other actions)"',
  'Enduring Might':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Gives self resistance %{8+strengthModifier} to the triggering damage (<b>heightened +1</b> gives +2 resistance)"',
  'Eradicate Undeath':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone inflicts 4d12 HP positive to undead (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Face In The Crowd':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +2 Deception and Stealth to blend into a crowd and ignores difficult terrain from crowds for 1 min (<b>heightened 3rd</b> R10\' affects 10 creatures)"',
  'Fire Ray':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Cleric,Evocation,Fire ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 2d6 HP fire; critical success inflicts double HP and 1d4 HP persistent fire (<b>heightened +1</b> inflicts +2d6 HP initial and +1d4 HP persistent)"',
  'Flame Barrier':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Target gains fire resistance 15 against the triggering fire damage (<b>heightened +2</b> gives +5 resistance)"',
  'Forced Quiet':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target can speak only at a whisper, requiring others over 10\' away to succeed on a DC %{spellDifficultyClass.%tradition} Perception to hear, for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure effects last for 10 min)"',
  'Glimpse The Truth':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Revelation ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Successful counteract attempts in a 30\' emanation allow self to see through illusions for 1 rd (<b>heightened 7th</b> allows others to see through illusions)"',
  "Healer's Blessing":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Healing spells affecting the target restore +2 HP for 1 min (<b>heightened +1</b> restores +1 HP)"',
  'Hurtling Stone':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Cleric,Earth,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 1d6+%{strengthModifier} HP bludgeoning, or double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Know The Enemy':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows a Recall Knowledge check, using the better of two rolls, during initiative or immediately after inflicting damage to remember a target\'s abilities"',
  'Localized Quake':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Earth,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Choice of a 15\' emanation or 15\' cone inflicts 4d6 HP bludgeoning and knocked prone (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Lucky Break':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to reroll a triggering failed save once per 10 min"',
  "Magic's Vessel":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched gains +1 saves; subsequent casting sustains the spell up to 1 min and gives the target resistance to spell damage equal to the cast spell\'s level"',
  'Malignant Sustenance':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched undead gains fast healing 7 for 1 min (<b>heightened +1</b> gives fast healing +2)"',
  'Moonbeam':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Cleric,Evocation,Fire,Light ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts dazzled for 1 rd and 1d6 HP fire that counts as silver, or dazzled for 1 min and double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Mystic Beacon':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives heightened +1 effects to the next damage or healing spell cast by the target within 1 rd"',
  "Nature's Bounty":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Conjuration,Plant,Positive ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Creates a fruit or vegetable that counts as a meal and restores 3d10+12 HP if eaten within 1 min (<b>heightened +1</b> restores +6 HP)"',
  'Overstuff':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target suffers sickened 1 and -10\' Speed until no longer sickened (<b>save Fortitude</b> target may use an action to end the sickened condition; critical success negates; critical failure inflicts sickened 2)"',
  'Perfected Form':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Fortune ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to reroll the triggering failed save vs. a morph, petrification, or polymorph effect"',
  'Perfected Mind':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self an additional Will save vs. a mental effect once per effect"',
  'Positive Luminance':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Light,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"10\' light emanation inflicts 2 HP positive on successful undead attackers for 1 min; self may increase the radius by 10\' and the damage by 2 HP each rd and may end the spell early to heal a living creature or damage an undead creature by double the current damage HP (<b>heightened +1</b> inflicts +0.5 HP initially and for each increase)"',
  'Precious Metals':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Transforms touched metal item into cold iron, copper, gold, iron, silver, or steel for 1 min (<b>heightened 8th</b> can transform into adamantine or mithral)"',
  "Protector's Sacrifice":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Transfers 3 HP damage of the triggering attack from target to self (<b>heightened +1</b> transfers +3 HP)"',
  "Protector's Sphere":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Aura,Cleric ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' emanation gives resistance 3 to all damage to self and allies while sustained for up to 1 min (<b>heightened +1</b> gives +1 resistance)"',
  'Pulse Of The City':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Scrying ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R25 miles; reveals information about the nearest settlement (<b>heightened 5th</b> increases range to 100 miles)"',
  'Pushing Gust':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Air,Cleric,Conjuration ' +
    'School=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Pushes target away 10\' (<b>save Fortitude</b> pushes 5\'; critical success negates; critical failure pushes 10\' and knocks prone)"',
  'Read Fate':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Prediction ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R10\' Successful DC 6 flat check gives a one-word clue to the target\'s short-term fate"',
  'Rebuke Death':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"1 target in a 20\' emanation (2 or 3 actions affect 2 or 3 targets) regains 3d6 HP and recovers from the dying condition without increasing its wounded condition (<b>heightened +1</b> restores +1d6 HP)"',
  'Retributive Pain':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Mental,Nonlethal ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Inflicts half the triggering damage to self on the attacker as mental HP"',
  'Safeguard Secret':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Mental ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R10\' Self and allies gain +4 skill checks to conceal a specified piece of knowledge for 1 hr"',
  'Savor The Sting':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental,Nonlethal ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts 1d4 HP mental and 1d4 HP persistent mental and gives self +1 attack and skill checks vs. the target while persistent damage continues (<b>save Will</b> inflicts half initial HP only; critical success negates; critical failure inflicts double initial and persistent HP) (<b>heightened +1</b> inflicts +1d4 HP initial and persistent)"',
  'Scholarly Recollection':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to use the best of two rolls on the triggering Seek or Recall Knowledge check"',
  'Shared Nightmare':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Incapacitation,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts confused for 1 action each rd for 1 min (<b>save Will</b> inflicts confused on self for 1 action next turn; critical success inflicts confused on self for 1 rd; critical failure inflicts confused for 1 min)"',
  'Soothing Words':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives the target +1 Will and +2 vs. emotion effects for 1 rd and attempts to counteract an existing emotion effect (<b>heightened 5th</b> gives +2 Will and +3 vs. emotion effects)"',
  'Splash Of Art':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst randomly inflicts one of dazzled for 1 rd, enfeebled 1 for 1 rd, frightened 1, or clumsy 1 for 1 rd (<b>save Will</b> negates; critical failure inflicts dazzled for 1 min, enfeebled 2 for 1 rd, frightened 2, or clumsy 2 for 1 rd)"',
  'Sudden Shift':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Illusion ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Self Steps and becomes concealed until the end of the next turn after the triggering foe melee attack miss"',
  'Sweet Dream':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Auditory,Cleric,Enchantment,Linguistic,Mental,Sleep ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Willing target who sleeps for 1 min gains +1 intelligence-based skill checks, +1 charisma-based skill checks, or +5\' Speed for 9 min"',
  'Take Its Course':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains an immediate save with a +2 or -2 modifier vs. an affliction, or an immediate DC 5 or 20 flat check against persistent poison damage (<b>save Will</b> negates) (<b>heightened 7th</b> affects multiple afflictions and poisons affecting the target)"',
  'Tempt Fate':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Gives the target +1 on the triggering save and turns a normal success into a critical success or a normal failure into a critical failure (<b>heightened 8th</b> gives +2 on the save)"',
  'Tidal Surge':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Water ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Moves the target 5\' over ground or 10\' in water (<b>save Fortitude</b> negates; critical failure doubles distance)"',
  'Touch Of Obedience':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts stupefied 1 until the end of the next turn (<b>save Will</b> inflicts stupefied 1 until the end of the current turn; critical success negates; critical failure inflicts stupefied 1 for 1 min)"',
  'Touch Of The Moon':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Light ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Target emits dim light in a 20\' radius and cycles through benefits each rd for 1 min: no benefit; +1 attack and +4 damage; +1 attack, +4 damage, +1 Armor Class, and +1 saves; +1 Armor Class and +1 saves"',
  'Touch Of Undeath':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy,Negative ' +
    'School=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts 1d6 HP negative and half healing for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical success inflicts double HP and half healing for 1 min) (<b>heightened +1</b> inflicts +1d6 HP)"',
  "Traveler's Transit":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{speed}\' climb Speed or a %{speed}\' swim Speed for 1 min (<b>heightened 5th</b> allows choosing a %{speed}\' fly Speed)"',
  "Trickster's Twin":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'School=Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target believes that self is in a location up to 100\' distant for 1 min or until succeeding at a Will save in response to interacting with the illusion or to the illusion performing a nonsensical or hostile action (<b>save Will</b> no subsequent Will save is necessary; critical success negates; critical failure requires critical success on a Will save to end the spell)"',
  'Unimpeded Stride':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Frees self from magical holds of a level less than or equal to the spell level and allows a Stride that ignores difficult terrain and Speed penalties"',
  'Unity':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Fortune ' +
    'School=Abjuration ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Allows allies to use self\'s saving throw vs. the triggering spell or ability"',
  'Veil Of Confidence':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Reduces any frightened condition on self by 1 for 1 min; critical failure on a subsequent save ends the spell and increases the frightened condition by 1"',
  'Vibrant Thorns':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Morph,Plant,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Unarmed and adjacent melee attacks on self inflict 1 HP piercing on the attacker for 1 min; casting a positive spell increases the damage to 1d6 HP for 1 turn (<b>heightened +1</b> inflicts +1 HP, or +1d6 HP after casting a positive spell)"',
  'Waking Nightmare':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Fear,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts frightened 2 (<b>save Will</b> inflicts frightened 1; critical success negates; critical failure inflicts frightened 3; failure while sleeping also inflicts fleeing for 1 rd)"',
  'Weapon Surge':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation ' +
    'School=Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Held weapon gains +1 attack and an additional die of damage on the next attack before the start of the next turn"',
  'Word Of Freedom':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Suppresses a confused, frightened, grabbed, paralyzed, or restrained condition affecting the target for 1 rd"',
  'Word Of Truth':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination ' +
    'School=Divination ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Causes a glowing symbol of %{deity} to appear when self speaks true statements of up to 25 words while sustained for up to 1 min"',
  'Zeal For Battle':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Fortune,Mental ' +
    'School=Enchantment ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R10\' Allows self and an ally to each use the higher of their initiative rolls"',
  'Goodberry':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Healing,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Eating the touched berry within 10 min restores 1d6+4 HP; six berries also count as a full meal (<b>heightened +1</b> affects +1 berry)"',
  'Heal Animal':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Healing,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched animal (2 actions gives R30\') regains 1d8 HP, or 1d8+8 HP with 2 actions (<b>heightened +1</b> restores +1d8 HP or +1d8+8 HP)"',
  'Impaling Briars':
    'Level=8 ' +
    'Trait=Focus,Uncommon,Conjuration,Druid,Plant ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation inflicts difficult terrain, -10 Speed (<b>save Reflex</b> negates; critical failure inflicts immobilized for 1 rd), or greater difficult terrain, plus 10d6 HP piercing and -10\' Speed on a target with a successful spell attack (or immobilized with a critical success), each rd while sustained for up to 1 min"',
  'Primal Summons':
    'Level=6 ' +
    'Trait=Focus,Uncommon,Conjuration,Druid ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=Free ' +
    'Description=' +
      '"Subsequent <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> gives summoned creature one of: a 60\' fly Speed; a 20\' burrow speed, -10\' Speed, and resistance 5 to physical damage; +1d6 HP fire damage, resistance 10 to fire, and weakness 5 to cold and water; a 60\' swim Speed, a Shove after a melee attack, and resistance 5 to fire"',
  'Storm Lord':
    'Level=9 ' +
    'Trait=Focus,Uncommon,Air,Druid,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation produces a bolt of lighting that inflicts 10d6 HP electricity and deafened for 1 rd (<b>save basic Reflex</b>) each rd while sustained for up to 1 min, plus a choice of weather: calm; foggy (conceals); rainy (inflicts -2 Acrobatics and Perception); or windy (inflicts -4 ranged attacks and difficult terrain for flying)"',
  'Stormwind Flight':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Air,Druid,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains %{speed}\' fly Speed for 1 min (<b>heightened 6th</b> negates difficult terrain effects when flying against the wind)"',
  'Tempest Surge':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Air,Druid,Electricity,Evocation ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d12 HP electricity, clumsy 2 for 1 rd, and 1 HP persistent electricity (<b>save basic Reflex</b> inflicts initial HP only)"',
  'Wild Morph':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Morph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains claws that inflict 1d6 HP slashing (requires <i>Wild Shape</i>), jaws that inflict 1d8 HP piercing (requires <i>Insect Shape</i>), resistance 5 to critical hits and precision damage (requires <i>Elemental Shape</i>), 10\' reach (requires <i>Plant Shape</i>), or a 30\' fly Speed (requires <i>Soaring Shape</i>) for 1 min (<b>heightened 6th</b> may choose two effects, claws also inflict 2d6 HP persistent bleed damage, and jaws also inflict 2d6 HP persistent poison damage; <b>10th</b> may choose three effects, claws also inflict 4d6 persistent bleed damage and jaws also inflict 4d6 HP persistent poison damage)"',
  'Wild Shape':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Polymorph,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Transforms self into a <i>Pest Form</i> creature for 10 min or another creature for 1 min, gaining +2 attacks (<b>heightened 2nd</b> may transform into an <i>Animal Form</i> creature)"',
  'Abundant Step':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Conjuration,Monk,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="Teleports self %{speed>?15}\' within line of sight"',
  'Empty Body':
    'Level=9 ' +
    'Trait=Focus,Uncommon,Conjuration,Monk,Teleportation ' +
    'School=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="Moves self to the Ethereal Plane for 1 min"',
  'Ki Blast':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Force,Monk ' +
    'School=Evocation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP force and a 5\' push (2 or 3 actions inflicts 3d6 HP in a 30\' cone or 4d6 HP in a 60\' cone) (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and a 10\' push) (<b>heightened +1</b> inflicts +1d6 HP for 1 action or +2d6 HP for 2 or 3)"',
  'Ki Rush':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Monk,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self to move twice and become concealed until the next turn"',
  'Ki Strike':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Monk,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"An unarmed Strike or Flurry Of Blows gains +1 attack and +1d6 HP force, lawful, negative, or positive (<b>heightened +4</b> inflicts +1d6 HP)"',
  'Quivering Palm':
    'Level=8 ' +
    'Trait=Focus,Uncommon,Incapacitation,Monk,Necromancy ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"A successful Strike allows self to inflict stunned 3 and 80 HP on the target at any time within 1 month (<b>save Fortitude</b> inflicts stunned 1 and 40 HP and ends the spell; critical success ends the spell; critical failure kills the target) (<b>heightened +1</b> inflicts +10 HP, or +5 HP on a successful save)"',
  'Wholeness Of Body':
    'Level=2 ' +
    'Trait=Focus,Uncommon,Healing,Monk,Necromancy,Positive ' +
    'School=Necromancy ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self regains 8 HP or attempts to counteract 1 poison or disease (<b>heightened +1</b> restores +8 HP)"',
  'Wild Winds Stance':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Air,Evocation,Monk,Stance ' +
    'School=Evocation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Stance gives +2 Armor Class vs. ranged attacks and R30\' unarmed strikes that ignore concealment and cover and inflict 1d6 HP bludgeoning"',
  'Wind Jump':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Air,Monk,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains a %{speed}\' fly speed, ending each turn on the ground, for 1 min (<b>heightened 6th</b> allows attempting a DC 30 Acrobatics check to avoid falling at the end of a turn)"',
  'Aberrant Whispers':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Auditory,Enchantment,Mental,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation (2 or 3 actions give a 10\' or 15\' emanation) inflicts stupefied 2 (<b>save Will</b> negates; critical failure inflicts confused) (<b>heightened +3</b> increases the radius by 5\')"',
  'Abyssal Wrath':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 4d6 HP each of a random pair of damage types: bludgeoning and electricity; acid and slashing; bludgeoning and cold; fire and piercing (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d6 HP each)"',
  'Ancestral Memories':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Divination,Sorcerer ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes trained in a non-Lore or ancestral Lore skill for 1 min (<b>heightened 6th</b> becomes expert in the skill)"',
  'Angelic Halo':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Aura,Good,Sorcerer ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"15\' emanation increases the HP restored by <i>Heal</i> by double the <i>Heal</i> spell\'s level for 1 min"',
  'Angelic Wings':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Light,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{speed}\' fly Speed and shines a 30\' radius bright light for 3 rd (<b>heightened 5th</b> effects last for 1 min)"',
  'Arcane Countermeasure':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Abjuration,Sorcerer ' +
    'School=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Reduces the triggering spell\'s heightened level by 1 and gives the spell\'s targets +2 saves, skill checks, Armor Class, and DC against it"',
  'Celestial Brand':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Curse,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Self and allies gain +1 attacks and skill checks vs. the evil target, and attacks by good creatures inflict +1d4 HP good, for 1 rd (<b>heightened +2</b> good creature attacks inflict +1 HP)"',
  'Diabolic Edict':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Enchantment,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Willing target performs a stated task, gaining +1 attack and skill checks, for 1 rd; refusal inflicts -1 attack and skill checks for 1 rd"',
  'Dragon Breath':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"%{draconicColor<\'Green\'?\\"60\' line\\":\\"30\' cone\\"} inflicts 5d6 HP %{draconicEnergy||\'fire\'} (<b>save basic %{draconicColor==\'Green\'?\'Fortitude\':\'Reflex\'}</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Dragon Claws':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Claws inflict 1d6 HP slashing and 1d6 HP %{draconicEnergy||\'fire\'}, and self gains resistance 5 to %{draconicEnergy||\'fire\'}, for 1 min (<b>heightened 5th</b> claws inflict 2d6 HP, and self gains resistance 10; <b>9th</b> claws inflict 3d6 HP, and self gains resistance 15)"',
  'Dragon Wings':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{Speed>?60}\' fly Speed for 1 min (<b>heightened 8th</b> effects last for 10 min)"',
  'Drain Life':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Necromancy,Negative,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target suffers 3d4 HP negative, and self gains equal temporary HP (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Elemental Blast':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Choice of 30\' cone, 60\' line, or R30\' 10\' burst inflicts 8d6 HP %{$\'features.Elemental (Fire)\'?\'fire\':\'bludgeoning\'} (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Elemental Motion':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{$\'features.Elemental (Earth)\'?\\"10\' burrow Speed\\":$\'features.Elemental (Water)\'?speed+\\"\' swim Speed and water breathing\\":(speed+\\"\' fly Speed\\")} for 1 min (<b>heightened 6th</b> gives +10\' Speed; <b>9th</b> gives +20\' Speed)"',
  'Elemental Toss':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Evocation,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d8 HP %{$\'features.Elemental (Fire)\'?\'fire\':\'bludgeoning\'}, or double HP on a critical success (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Embrace The Pit':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evil,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains resistance 5 to evil, fire, and poison, resistance 1 to non-silver physical damage, and weakness 5 to good for 1 min (<b>heightened +2</b> gives +5 resistance to evil, fire, and poison, +2 resistance to non-silver physical damage, and +5 weakness to good)"',
  'Extend Spell':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Divination,Metamagic,Sorcerer ' +
    'School=Divination ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Increases the duration of a subsequent targeted spell of less than maximum spell level from 1 min to 10 min"',
  'Faerie Dust':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Enchantment,Mental,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) inflicts loss of Reactions and -2 Perception and Will for 1 rd (<b>save Will</b> negates; critical failure also inflicts -1 Perception and Will for 1 min) (<b>heightened +3</b> increases the radius by 5\')"',
  'Fey Disappearance':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Enchantment,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes invisible and moves normally over natural difficult terrain until the end of the next turn; performing a hostile action ends the spell (<b>heightened 5th</b> a hostile action does not end the spell)"',
  'Fey Glamour':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Illusion,Sorcerer ' +
    'School=Illusion ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="R30\' 30\' burst disguises 10 targets for 10 min"',
  "Glutton's Jaws":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Morph,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Bite inflicts 1d8 HP piercing, giving self 1d6 temporary HP, for 1 min (<b>heightened +2</b> gives +1d6 temporary HP</b>)"',
  'Grasping Grave':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 20\' radius inflicts 6d6 HP slashing and -10\' Speed for 1 rd for 10 min (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and immobilized for 1 rd) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Hellfire Plume':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Evil,Evocation,Fire,Sorcerer ' +
    'School=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 10\' radius inflicts 4d6 HP fire and 4d6 HP evil (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d6 HP fire and evil)"',
  'Horrific Visage':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Emotion,Fear,Illusion,Mental,Sorcerer,Visual ' +
    'School=Illusion ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' radius inflicts frightened 1 (<b>save Will</b> negates; critical failure inflicts frightened 2) (<b>heightened 5th</b> inflicts frightened 1, 2, or 3 and fleeing for 1 rd on save success, failure, or critical failure)"',
  'Jealous Hex':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Curse,Necromancy,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts enfeebled 1, clumsy 1, drained 1, or stupefied 1, based on the target\'s highest ability modifier, until the target saves or for 1 min (<b>save Will</b> negates; critical failure inflicts condition level 2)"',
  'Swamp Of Sloth':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Conjuration,Olfactory,Sorcerer ' +
    'School=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) inflicts difficult terrain and 1d6 HP poison for 1 min (<b>save basic Fortitude</b>) (<b>heightened +2</b> increases radius by 5\' and inflicts +1d6 HP)"',
  'Tentacular Limbs':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Extends reach for touch spells and unarmed Strikes to 10\' for 1 min; adding an action to touch spells extends reach to 20\' (<b>heightened +2</b> adding an action gives +10\' touch spell reach)"',
  "Undeath's Blessing":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Necromancy,Negative,Sorcerer ' +
    'School=Necromancy ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched responds to <i>Heal</i> and <i>Harm</i> as an undead for 1 min, and <i>Harm</i> restores +2 HP (<b>save Will</b> <i>Heal</i> and <i>Harm</i> have half effect; critical success negates) (<b>heightened +1</b> <i>Harm</i> restores +2 HP)"',
  'Unusual Anatomy':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Polymorph,Sorcerer,Transmutation ' +
    'School=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains darkvision and resistance 10 to precision and critical damage and inflicts 2d6 HP acid on successful non-reach melee attackers for 1 min (<b>heightened +2</b> gives +5 resistances and inflicts +1d6 HP)"',
  "You're Mine":
    'Level=5 ' +
    'Trait=Focus,Uncommon,Emotion,Enchantment,Incapacitation,Mental,Sorcerer ' +
    'School=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts stunned 1 for 1 rd and allows self to direct 1 target action (<b>save Will</b> inflicts stunned only; critical success negates; critical failure gives control for 1 rd) (<b>heightened 7th</b> gives control for 1 rd; critical failure gives control for 1 min or until the target succeeds on a save at the end of each turn)"',
  'Augment Summoning':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Conjuration,Wizard ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="R30\' Summoned target gains +1 on all checks for 1 min"',
  'Call Of The Grave':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Arcane,Attack,Necromancy,Wizard ' +
    'School=Necromancy ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts sickened 1, or sickened 2 and slowed 1 until no longer sickened on a critical success"',
  'Charming Words':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Auditory,Enchantment,Incapacitation,Linguistic,Mental,Wizard ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Prevents the target from taking hostile actions against self for 1 rd (<b>save Will</b> target suffers -1 attack and damage vs. self; critical success negates; critical failure inflicts stunned 1)"',
  'Dimensional Steps':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Conjuration,Teleportation,Wizard ' +
    'School=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Teleports self to a visible location within 20\' (<b>heightened +1</b> gives +5\' teleport distance)"',
  "Diviner's Sight":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Concentrate,Divination,Fortune,Wizard ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target may substitute self\'s d20 roll for a saving throw or skill check within 1 rd"',
  'Dread Aura':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Aura,Enchantment,Emotion,Fear,Mental,Wizard ' +
    'School=Enchantment ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts frightened 1 on foes while sustained for up to 1 min"',
  'Elemental Tempest':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Evocation,Metamagic,Wizard ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Subsequent casting of an acid, cold, electricity, or fire spell inflicts 1d6 HP per spell level of the same damage type on foes in a 10\' emanation"',
  'Energy Absorption':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Wizard ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Gives self resistance 15 to damage from the triggering acid, cold, electricity, or fire effect (<b>heightened +1</b> gives +5 resistance)"',
  'Force Bolt':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Evocation,Force,Wizard ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+1 HP force (<b>heightened +2</b> inflicts +1d4+1 HP)"',
  'Hand Of The Apprentice':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Evocation,Wizard ' +
    'School=Evocation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R500\' Makes a remote attack with a melee weapon%{spellModifier.%tradition>strengthModifier?\', inflicting +\'+(spellModifier.%tradition-strengthModifier)+\' damage\':spellModifier.%tradition<strengthModifier?\', inflicting \'+(spellModifier.%tradition-strengthModifier)+\' damage\':\'\'}; a critical hit inflicts the critical specialization effect"',
  'Invisibility Cloak':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Illusion,Wizard ' +
    'School=Illusion ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes invisible for 1 min; using a hostile action ends the spell (<b>heightened 6th</b> effects last 10 min; <b>8th</b> effects last 1 hr)"',
  'Life Siphon':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Healing,Necromancy,Wizard ' +
    'School=Necromancy ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Casting a necromancy spell restores 1d8 HP per spell level to self"',
  'Physical Boost':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Transmutation,Wizard ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched gains +2 on the next Acrobatics check, Athletics check, Fortitude save, or Reflex save within the next rd"',
  'Protective Ward':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Aura,Wizard ' +
    'School=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation gives +1 Armor Class to self and allies while sustained for up to 1 min; each Sustain increases the radius by 5\'"',
  'Shifting Form':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Morph,Transmutation,Wizard ' +
    'School=Transmutation ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +20\' Speed, a %{speed//2}\' climb or swim Speed, darkvision, 60\' imprecise scent, or claws that inflict 1d8 HP slashing for 1 min"',
  'Vigilant Eye':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Divination,Wizard ' +
    'School=Divination ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location for 1 hr; spending a Focus Point extends the duration to 2 hr"',
  'Warped Terrain':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Illusion,Visual,Wizard ' +
    'School=Illusion ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="R60\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) illusion inflicts difficult terrain for 1 min (<b>heightened 4th</b> affects air instead of surface)"'
};
Pathfinder2ERemaster.WEAPONS = {

  'Fist':Pathfinder2E.WEAPONS.Fist,

  'Club':Pathfinder2E.WEAPONS.Club,
  'Dagger':Pathfinder2E.WEAPONS.Dagger,
  'Gauntlet':Pathfinder2E.WEAPONS.Gauntlet,
  'Light Mace':Pathfinder2E.WEAPONS['Light Mace'],
  'Longspear':Pathfinder2E.WEAPONS.Longspear,
  'Mace':Pathfinder2E.WEAPONS.Mace,
  'Morningstar':Pathfinder2E.WEAPONS.Morningstar,
  'Sickle':Pathfinder2E.WEAPONS.Sickle,
  'Spear':Pathfinder2E.WEAPONS.Spear + ' Trait=Monk,Thrown',
  'Spiked Gauntlet':Pathfinder2E.WEAPONS['Spiked Gauntlet'],
  'Staff':Pathfinder2E.WEAPONS.Staff + ' Trait=Monk,"Two-hand d8"',

  'Clan Dagger':Pathfinder2E.WEAPONS['Clan Dagger'],
  'Katar':Pathfinder2E.WEAPONS.Katar,

  'Bastard Sword':Pathfinder2E.WEAPONS['Bastard Sword'],
  'Battle Axe':Pathfinder2E.WEAPONS['Battle Axe'],
  'Bo Staff':Pathfinder2E.WEAPONS['Bo Staff'],
  'Falchion':Pathfinder2E.WEAPONS.Falchion,
  'Flail':Pathfinder2E.WEAPONS.Flail,
  'Glaive':Pathfinder2E.WEAPONS.Glaive,
  'Greataxe':Pathfinder2E.WEAPONS.Greataxe,
  'Greatclub':Pathfinder2E.WEAPONS.Greatclub,
  'Greatpick':Pathfinder2E.WEAPONS.Greatpick,
  'Greatsword':Pathfinder2E.WEAPONS.Greatsword,
  'Guisarme':Pathfinder2E.WEAPONS.Guisarme,
  'Halberd':Pathfinder2E.WEAPONS.Halberd,
  'Hatchet':Pathfinder2E.WEAPONS.Hatchet,
  'Lance':Pathfinder2E.WEAPONS.Lance,
  'Light Hammer':Pathfinder2E.WEAPONS['Light Hammer'],
  'Light Pick':Pathfinder2E.WEAPONS['Light Pick'],
  'Longsword':Pathfinder2E.WEAPONS.Longsword,
  'Main-gauche':Pathfinder2E.WEAPONS['Main-gauche'],
  'Maul':Pathfinder2E.WEAPONS.Maul,
  'Pick':Pathfinder2E.WEAPONS.Pick,
  'Ranseur':Pathfinder2E.WEAPONS.Ranseur,
  'Rapier':Pathfinder2E.WEAPONS.Rapier,
  'Sap':Pathfinder2E.WEAPONS.Sap,
  'Scimitar':Pathfinder2E.WEAPONS.Scimitar,
  'Scythe':Pathfinder2E.WEAPONS.Scythe,
  // TODO
  'Shield':Pathfinder2E.WEAPONS.Shield,
  'Shield Boss':Pathfinder2E.WEAPONS['Shield Boss'],
  'Shield Spikes':Pathfinder2E.WEAPONS['Shield Spikes'],
  'Shortsword':Pathfinder2E.WEAPONS.Shortsword,
  'Starknife':Pathfinder2E.WEAPONS.Starknife,
  'Trident':Pathfinder2E.WEAPONS.Trident,
  'War Flail':Pathfinder2E.WEAPONS['War Flail'],
  'Warhammer':Pathfinder2E.WEAPONS.Warhammer,
  'Whip':Pathfinder2E.WEAPONS.Whip,

  'Dogslicer':Pathfinder2E.WEAPONS.Dogslicer,
  'Elven Curve Blade':Pathfinder2E.WEAPONS['Elven Curve Blade'],
  "Filcher's Fork":Pathfinder2E.WEAPONS["Filcher's Fork"],
  'Gnome Hooked Hammer':Pathfinder2E.WEAPONS['Gnome Hooked Hammer'],
  'Horsechopper':Pathfinder2E.WEAPONS.Horsechopper,
  'Kama':Pathfinder2E.WEAPONS.Kama,
  'Katana':Pathfinder2E.WEAPONS.Katana,
  'Khakkara':
    'Category=Martial Price=2 Damage="1d6 B" Bulk=1 Hands=1 Group=Club ' +
    'Trait=Monk,Shove,"Two-Hand d10",Uncommon,"Versatile P"',
  'Kukri':Pathfinder2E.WEAPONS.Kukri,
  'Nunchaku':Pathfinder2E.WEAPONS.Nunchaku,
  'Orc Knuckle Dragger':Pathfinder2E.WEAPONS['Orc Knuckle Dragger'],
  'Sai':Pathfinder2E.WEAPONS.Sai,
  'Spiked Chain':Pathfinder2E.WEAPONS['Spiked Chain'],
  'Temple Sword':Pathfinder2E.WEAPONS['Temple Sword'],
  'Wakizashi':
    'Category=Martial Price=1 Damage="1d4 S" Bulk=L Hands=1 Group=Sword ' +
    'Trait=Agile,"Deadly d8",Finesse,Uncommon,"Versatile P"',

  'Dwarven Waraxe':Pathfinder2E.WEAPONS['Dwarven Waraxe'],
  'Gnome Flickmace':Pathfinder2E.WEAPONS['Gnome Flickmace'],
  'Orc Necksplitter':Pathfinder2E.WEAPONS['Orc Necksplitter'],
  'Sawtooth Saber':Pathfinder2E.WEAPONS['Sawtooth Saber'],

  'Blowgun':Pathfinder2E.WEAPONS.Blowgun,
  'Crossbow':Pathfinder2E.WEAPONS.Crossbow + ' Group=Crossbow',
  'Dart':Pathfinder2E.WEAPONS.Dart,
  'Hand Crossbow':Pathfinder2E.WEAPONS['Hand Crossbow'] + ' Group=Crossbow',
  'Heavy Crossbow':Pathfinder2E.WEAPONS['Heavy Crossbow'] + ' Group=Crossbow',
  'Javelin':Pathfinder2E.WEAPONS.Javelin,
  'Sling':Pathfinder2E.WEAPONS.Sling,

  // TODO
  'Lesser Acid Flask':
    'Category=Martial Price=0 Damage="1 E" Bulk=L Hands=1 Group=Bomb ' +
    'Trait=Thrown,Splash Range=20',
  "Lesser Alchemist's Fire":
    'Category=Martial Price=0 Damage="1d8 E" Bulk=L Hands=1 Group=Bomb ' +
    'Trait=Thrown,Splash Range=20',
  'Lesser Bottled Lightning':
    'Category=Martial Price=0 Damage="1d6 E" Bulk=L Hands=1 Group=Bomb ' +
    'Trait=Thrown,Splash Range=20',
  'Lesser Frost Vial':
    'Category=Martial Price=0 Damage="1d6 E" Bulk=L Hands=1 Group=Bomb ' +
    'Trait=Thrown,Splash Range=20',
  'Lesser Tanglefoot Bag':
    'Category=Martial Price=0 Damage="0" Bulk=L Hands=1 Group=Bomb ' +
    'Trait=Thrown Range=20',
  'Lesser Thunderstone':
    'Category=Martial Price=0 Damage="1d4 E" Bulk=L Hands=1 Group=Bomb ' +
    'Trait=Thrown,Splash Range=20',
  'Arbalest':
    'Category=Martial Price=12 Damage="1d10 P" Bulk=2 Hands=2 Group=Crossbow ' +
    'Trait=Backstabber,"Reload 1" Range=110',
  'Bola':
    'Category=Martial Price=0.5 Damage="1d6 B" Bulk=L Hands=1 Group=Sling ' +
    'Trait=Nonlethal,"Ranged Trip",Thrown Range=20',
  'Composite Longbow':Pathfinder2E.WEAPONS['Composite Longbow'],
  'Composite Shortbow':Pathfinder2E.WEAPONS['Composite Shortbow'],
  'Longbow':Pathfinder2E.WEAPONS.Longbow,
  'Shortbow':Pathfinder2E.WEAPONS.Shortbow,

  'Halfling Sling Staff':Pathfinder2E.WEAPONS['Halfling Sling Staff'],
  'Shuriken':Pathfinder2E.WEAPONS.Shuriken

};

/* Defines the rules related to character abilities. */
Pathfinder2ERemaster.abilityRules = function(rules, abilities) {
  // TODO
  rules.defineRule
    ('abilityGeneration', '', '=', '"All 10s; standard ancestry boosts"');
  rules.defineRule('alignment', '', '=', '"Neutral"');
  Pathfinder2E.abilityRules(rules, abilities);
  for(let a in abilities) {
    delete rules.choices.notes[a];
    rules.defineChoice('notes', a + ':%1');
  }
};

/* Defines the rules related to combat. */
Pathfinder2ERemaster.combatRules = function(rules, armors, shields, weapons) {
  Pathfinder2E.combatRules(rules, armors, shields, weapons);
};

/* Defines rules related to basic character identity. */
Pathfinder2ERemaster.identityRules = function(
  rules, ancestries, backgrounds, classes, deities
) {
  Pathfinder2E.identityRules
    (rules, {}, ancestries, backgrounds, classes, deities);
};

/* Defines rules related to magic use. */
Pathfinder2ERemaster.magicRules = function(rules, spells) {
  Pathfinder2E.magicRules(rules, spells);
};

/* Defines rules related to character aptitudes. */
Pathfinder2ERemaster.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  Pathfinder2E.talentRules(rules, feats, features, goodies, languages, skills);
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Pathfinder2ERemaster.choiceRules = function(rules, type, name, attrs) {

  if(type == 'Ancestry') {
    Pathfinder2ERemaster.ancestryRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValueArray(attrs, 'Trait')
    );
    Pathfinder2ERemaster.ancestryRulesExtra(rules, name);
  } else if(type == 'Ancestry Feature')
    Pathfinder2ERemaster.ancestryFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ancestry'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Armor')
    Pathfinder2ERemaster.armorRules(rules, name,
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
    Pathfinder2ERemaster.backgroundRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables')
    );
    Pathfinder2ERemaster.backgroundRulesExtra(rules, name);
  } else if(type == 'Background Feature')
    Pathfinder2ERemaster.backgroundFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Background'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Class') {
    Pathfinder2ERemaster.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'HitPoints'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Pathfinder2ERemaster.classRulesExtra(rules, name);
  } else if(type == 'Class Feature')
    Pathfinder2ERemaster.classFeatureRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  else if(type == 'Deity')
    Pathfinder2ERemaster.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Font'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValue(attrs, 'Weapon'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells')
    );
  else if(type == 'Feat') {
    Pathfinder2ERemaster.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Trait')
    );
    Pathfinder2ERemaster.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    Pathfinder2ERemaster.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note'),
      QuilvynUtils.getAttrValue(attrs, 'Action')
    );
  else if(type == 'Goody')
    Pathfinder2ERemaster.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    Pathfinder2ERemaster.languageRules(rules, name);
  else if(type == 'Shield')
    Pathfinder2ERemaster.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Price'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
      QuilvynUtils.getAttrValue(attrs, 'Bulk'),
      QuilvynUtils.getAttrValue(attrs, 'Hardness'),
      QuilvynUtils.getAttrValue(attrs, 'HP')
    );
  else if(type == 'Skill')
    Pathfinder2ERemaster.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'Subcategory')
    );
  else if(type == 'Spell') {
    let level = QuilvynUtils.getAttrValue(attrs, 'Level');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let trads = QuilvynUtils.getAttrValueArray(attrs, 'Traditions');
    let traits = QuilvynUtils.getAttrValueArray(attrs, 'Trait');
    let isCantrip = traits.includes('Cantrip');
    let isFocus = traits.includes('Focus');
    trads.forEach(t => {
      let spellName =
        name + ' (' + t.charAt(0) + (isCantrip ? 'C' : '') + level + ' ' + (isFocus ? 'Foc ' : '') + school.substring(0, 3) + ')';
      Pathfinder2ERemaster.spellRules(rules, spellName,
        school,
        level,
        t,
        QuilvynUtils.getAttrValue(attrs, 'Cast'),
        QuilvynUtils.getAttrValueArray(attrs, 'Trait'),
        QuilvynUtils.getAttrValue(attrs, 'Description').replaceAll('%tradition', t)
      );
      if(!isFocus)
        rules.addChoice('spells', spellName, attrs);
    });
  } else if(type == 'Weapon')
    Pathfinder2ERemaster.weaponRules(rules, name,
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
  if(type == 'feats') {
    type = attrs.includes('Ancestry') ? 'ancestryFeats' :
           attrs.match(/Class|Archetype/) ? 'classFeats' : 'generalFeats';
    rules.addChoice(type, name, attrs);
    rules.defineRule('feats.' + name, type + '.' + name, '=', null);
  }
  if(type == 'weapons' && attrs.includes('Advanced'))
    rules.addChoice('advancedWeapons', name, attrs);

};

/*
 * Defines in #rules# the rules associated with ancestry #name#. #hitPoints#
 * gives the number of HP granted at level 1, #features# and #selectables# list
 * associated automatic and selectable features, #languages# lists languages
 * automatically known by characters with the ancestry, and #traits# lists any
 * traits associated with it.
 */
Pathfinder2ERemaster.ancestryRules = function(
  rules, name, hitPoints, features, selectables, languages, traits
) {
  Pathfinder2E.ancestryRules
    (rules, name, hitPoints, features, selectables, languages, traits);
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
Pathfinder2ERemaster.ancestryRulesExtra = function(rules, name) {
  Pathfinder2E.ancestryRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules required to give feature #name# to ancestry
 * #ancestryName# at level #level#. #selectable# gives the category if this
 * feature is selectable; it is otherwise null. #replace# lists any ancestry
 * features that this new one replaces.
 */
Pathfinder2ERemaster.ancestryFeatureRules = function(
  rules, name, ancestryName, level, selectable, replace
) {
  Pathfinder2E.ancestryFeatureRules
    (rules, name, ancestryName, level, selectable, replace);
};

/*
 * Defines in #rules# the rules associated with armor #name#, which belongs
 * to category #category#, costs #price# gold pieces, adds #ac# to the
 * character's armor class, allows a maximum dex bonus to ac of #maxDex#,
 * imposes #checkPenalty# on specific skills, slows the character by
 * #speedPenalty#, requires a strength of at least #minStr# to use without
 * penalties, adds #bulk# to the character's burden, belongs to group #group#,
 * and has the list of traits #traits#.
 */
Pathfinder2ERemaster.armorRules = function(
  rules, name, category, price, ac, maxDex, checkPenalty, speedPenalty, minStr,
  bulk, group, traits
) {
  Pathfinder2E.armorRules(
    rules, name, category, price, ac, maxDex, checkPenalty, speedPenalty,
    minStr, bulk, group, traits
  );
};

/*
 * Defines in #rules# the rules associated with background #name#. #features#
 * and #selectables# list the background's associated features and any
 * selectable features.
 */
Pathfinder2ERemaster.backgroundRules = function(
  rules, name, features, selectables
) {
  Pathfinder2E.backgroundRules(rules, name, features, selectables);
};

/*
 * Defines in #rules# the rules associated with background #name# that cannot
 * be derived directly from the attributes passed to backgroundRules.
 */
Pathfinder2ERemaster.backgroundRulesExtra = function(rules, name) {
  Pathfinder2E.backgroundRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules required to give feature #name# to background
 * #backgroundName# at level #level#. #replace# lists any background features
 * that this new one replaces.
 */
Pathfinder2ERemaster.backgroundFeatureRules = function(
  rules, name, backgroundName, level, replace
) {
  Pathfinder2E.backgroundFeatureRules
    (rules, name, backgroundName, level, replace);
};

/*
 * Defines in #rules# the rules associated with class #name#. #abilities# lists
 * the possible class abilities for the class. The class grants #hitPoints#
 * additional hit points with each level advance. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level, and #spellSlots# the number of spells per level per day that
 * the class can cast.
 */
Pathfinder2ERemaster.classRules = function(
  rules, name, abilities, hitPoints, features, selectables, spellSlots
) {
  Pathfinder2E.classRules(
    rules, name, abilities, hitPoints, features, selectables, spellSlots
  );
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Pathfinder2ERemaster.classRulesExtra = function(rules, name) {
  Pathfinder2E.classRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules required to give feature #name# to class
 * #className# at level #level#. #selectable# gives the category if this feature
 * is selectable; it is otherwise null. #requires# lists any hard prerequisites
 * for the feature, and #replace# lists any class features that this new one
 * replaces.
 */
Pathfinder2ERemaster.classFeatureRules = function(
  rules, name, className, requires, level, selectable, replace
) {
  Pathfinder2E.classFeatureRules(
    rules, name, className, requires, level, selectable, replace
  );
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, #followerAlignments# lists the alignments permitted
 * for followers, #font# contains the divine font(s), #domains# lists the
 * associated domains, #weapon# is the deity's favored weapon, #skill# the
 * divine skill, and #spells# lists associated cleric spells.
 */
Pathfinder2ERemaster.deityRules = function(
  rules, name, font, domains, weapon, skill, spells
) {
  Pathfinder2E.deityRules(
    rules, name, 'N', ['N'], font, domains, weapon, skill, spells
  );
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #traits#
 * lists the traits of the feat.
 */
Pathfinder2ERemaster.featRules = function(
  rules, name, requires, implies, traits
) {
  Pathfinder2E.featRules(rules, name, requires, implies, traits);
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Pathfinder2ERemaster.featRulesExtra = function(rules, name) {
  Pathfinder2E.featRulesExtra(rules, name);
  if(name == 'Martial Experience') {
    rules.defineRule('combatNotes.martialExperience.1',
      'features.Martial Experience', '?', null,
      'level', '=', 'source>=11 ? 1 : null'
    );
    rules.defineRule('trainingLevel.Simple Weapons',
      'combatNotes.martialExperience.1', '^', null
    );
    rules.defineRule('trainingLevel.Martial Weapons',
      'combatNotes.martialExperience.1', '^', null
    );
    rules.defineRule('trainingLevel.Advanced Weapons',
      'combatNotes.martialExperience.1', '^', null
    );
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements. #action#, if specified, gives
 * the type or number of actions required to use the feature.
 */
Pathfinder2ERemaster.featureRules = function(
  rules, name, sections, notes, action
) {
  Pathfinder2E.featureRules(rules, name, sections, notes, action);
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
Pathfinder2ERemaster.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  Pathfinder2E.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
};

/* Defines in #rules# the rules associated with language #name#. */
Pathfinder2ERemaster.languageRules = function(rules, name) {
  Pathfinder2E.languageRules(rules, name);
};

/*
 * Defines in #rules# the rules associated with shield #name#, which costs
 * #price# gold pieces, adds #ac# to the character's armor class, reduces the
 * character's speed by #speed#, weighs #bulk#, has hardness #hardness#, and
 * can absorb #hp# damage before becoming useless.
 */
Pathfinder2ERemaster.shieldRules = function(
  rules, name, price, ac, speed, bulk, hardness, hp
) {
  Pathfinder2E.shieldRules(rules, name, price, ac, speed, bulk, hardness, hp);
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.) that belongs to
 * subcategory #subcategory#.
 */
Pathfinder2ERemaster.skillRules = function(rules, name, ability, subcategory) {
  Pathfinder2E.skillRules(rules, name, ability, subcategory);
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #tradition# and #level# are used to compute any
 * saving throw value required by the spell. #cast# gives the casting actions
 * or time required to cast the spell, #traits# lists any traits the spell has,
 * and #description# is a verbose description of the spell's effects.
 */
Pathfinder2ERemaster.spellRules = function(
  rules, name, school, level, tradition, cast, traits, description
) {
  Pathfinder2E.spellRules(
    rules, name, school, level, tradition, cast, traits, description
  );
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which costs
 * #price# gold pieces, requires a #category# proficiency level to use
 * effectively, adds #bulk# to the character's encumbrance, requires #hands#
 * hands to operate, belongs to group #group#, and has weapon properties
 * #traits#. If specified, the weapon can be used as a ranged weapon with a
 * range increment of #range# feet.
 */
Pathfinder2ERemaster.weaponRules = function(
  rules, name, category, price, damage, bulk, hands, group, traits, range
) {
  Pathfinder2E.weaponRules(
    rules, name, category, price, damage, bulk, hands, group, traits, range
  );
  rules.defineRule('proficiencyLevelBonus.' + name,
    'combatNotes.martialExperience', '=', '0',
  );
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
Pathfinder2ERemaster.choiceEditorElements = function(rules, type) {
  let result = [];
  let oneToTwenty = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
  ];
  let zeroToTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if(type == 'Ancestry')
    result.push(
      ['HitPoints', 'Hit Points', 'select-one', ['4', '6', '8', '10', '12']],
      ['Features', 'Features', 'text', [60]],
      ['Selectables', 'Selectables', 'text', [60]],
      ['Languages', 'Languages', 'text', [30]],
      ['Trait', 'Trait', 'text', [30]]
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
    let tenToEighteen = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    result.push(
      ['Category', 'Category', 'select-one', armorCategories],
      ['Price', 'Price (GP)', 'text', [4]],
      ['AC', 'AC Bonus', 'select-one', zeroToTen],
      ['Dex', 'Max Dex', 'select-one', zeroToTen],
      ['Check', 'Check Penalty', 'select-one', [0, -1, -2, -3, -4, -5]],
      ['Speed', 'Speed Penalty', 'select-one', [0, -5, -10, -15, -20]],
      ['Str', 'Min Str', 'select-one', tenToEighteen],
      ['Bulk', 'Bulk', 'select-one', ['L', 1, 2, 3, 4, 5]],
      ['Group', 'Group', 'select-one', armorGroups],
      ['Trait', 'Trait', 'text', [20]]
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
      ['Ability', 'Ability', 'text', [20]],
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
      ['Trait', 'Trait', 'text', [20]]
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
      ['Ability', 'Ability', 'select-one', Object.keys(Pathfinder2E.ABILITIES).map(x => x.charAt(0).toUpperCase() + x.substring(1))],
      ['Subcategory', 'Subcategory', 'text', [30]]
    );
  else if(type == 'Spell') {
    let schools =
      Pathfinder2ERemaster.CLASSES.Wizard.match(/([\s\w]*:Arcane School)/g)
      .map(x => x.replace(':Arcane School', ''))
      .filter(x => x != 'Universalist');
    let zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    result.push(
      ['School', 'School', 'select-one', schools],
      ['Level', 'Level', 'select-one', zeroToNine],
      ['Tradition', 'Tradition', 'text', [15]],
      ['Cast', 'Cast', 'text', [15]],
      ['Trait', 'Trait', 'text', [25]],
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
      ['Trait', 'Trait', 'text', [40]],
      ['Range', 'Range in Feet', 'select-one', zeroToOneFifty]
    );
  }
  return result;
};

/* Returns the elements in a basic 5E character editor. */
Pathfinder2ERemaster.initialEditorElements = function() {
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
Pathfinder2ERemaster.randomName = function(ancestry) {

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
Pathfinder2ERemaster.randomizeOneAttribute = function(attributes, attribute) {

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
      if((matchInfo = attr.match(/^\w+Features.Ability\s+Boost\s+\((.*)\)$/)))
        boostTexts.push(matchInfo[1]);
      else if(allNotes[attr] &&
              (matchInfo=allNotes[attr].match(/Ability\s+Boost\s+\((.*?)\)/)) != null)
        boostTexts.push(matchInfo[1].replaceAll('%V', attrs[attr]));
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
  } else if(attribute == 'feats' || attribute == 'selectableFeatures') {
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
      let traits =
        QuilvynUtils.getAttrValueArray
          (allChoices[attr], allChoices[attr].includes('Trait') ? 'Trait' : 'Type');
      if(attrs[prefix + '.' + attr] != null) {
        for(let i = 0; i < traits.length; i++) {
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
      debug.push('Replace Class with ' + attributes['class']);
      toAllocateByTrait[attributes['class']] = toAllocateByTrait.Class;
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
        debug.push('From ' + Object.keys(picks).join(", ") + ' reject');
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
  } else if(attribute == 'name') {
    attributes.name = Pathfinder2ERemaster.randomName(attributes.ancestry);
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
          ; // Improve specific skill; nothing to allocate
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
Pathfinder2ERemaster.makeValid = function(attributes) {

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
Pathfinder2ERemaster.getPlugins = function() {
  return [];
};

/* Returns HTML body content for user notes associated with this rule set. */
Pathfinder2ERemaster.ruleNotes = function() {
  return '' +
    '<h2>Pathfinder2E Remaster Quilvyn Module Notes</h2>\n' +
    'Pathfinder2E Remaster Quilvyn Module Version ' + Pathfinder2ERemaster.VERSION + '\n' +
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
    '  taken as a free action or Reaction.\n' +
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
