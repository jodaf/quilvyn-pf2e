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
/* globals Pathfinder2E, Quilvyn, QuilvynRules, QuilvynUtils */
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

  rules.defineChoice('choices', Pathfinder2E.CHOICES, 'Heritage');
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
    'level:Level,text,3',
    'abilityGeneration:Attribute Generation,select-one,abilgens'
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

  Pathfinder2ERemaster.attributeRules(rules, Pathfinder2E.ABILITIES);
  Pathfinder2ERemaster.combatRules
    (rules, choices.ARMORS, choices.SHIELDS, choices.WEAPONS);
  Pathfinder2ERemaster.magicRules(rules, choices.SPELLS);
  Pathfinder2ERemaster.identityRules(
    rules, choices.ANCESTRIES, choices.BACKGROUNDS, choices.CLASSES,
    choices.DEITIES, Pathfinder2ERemaster.HERITAGES
  );
  Pathfinder2ERemaster.talentRules(
    rules, choices.FEATS, choices.FEATURES, choices.GOODIES, choices.LANGUAGES,
    choices.SKILLS
  );

  Quilvyn.addRuleSet(rules);

}

Pathfinder2ERemaster.VERSION = '2.4.1.0';

Pathfinder2ERemaster.RANDOMIZABLE_ATTRIBUTES =
  Pathfinder2E.RANDOMIZABLE_ATTRIBUTES.filter(x => !(x.match(/alignment|abilities|strength|constitution|dexterity|intelligence|wisdom|charisma/)));

Pathfinder2ERemaster.ANCESTRIES = {
  'Dwarf':Pathfinder2E.ANCESTRIES.Dwarf,
  'Elf':
    Pathfinder2E.ANCESTRIES.Elf
    .replace('Selectables=', 'Selectables="1:Ancient Elf:Heritage",'),
  'Gnome':Pathfinder2E.ANCESTRIES.Gnome
  .replace('Sylvan', 'Fey'),
  'Goblin':Pathfinder2E.ANCESTRIES.Goblin,
  'Halfling':
    Pathfinder2E.ANCESTRIES.Halfling
    .replace('Selectables=', 'Selectables="1:Jinxed Halfling:Heritage",'),
  'Human':
    Pathfinder2E.ANCESTRIES.Human
    .replaceAll(/Heritage Human/g, 'Human')
    .replace('"1:Half-Elf:Heritage","1:Half-Orc:Heritage",', ''),
  'Leshy':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boost (Constitution; Wisdom; Choose 1 from any)",' +
      '"1:Attribute Flaw (Intelligence)",' +
      '"1:Small","1:Low-Light Vision","1:Ancestry Feats","1:Leshy Heritage",' +
      '"1:Plant Nourishment" ' +
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
      '"1:Attribute Boost (Choose 2 from any)",' +
      '"1:Darkvision","1:Ancestry Feats","1:Orc Heritage" ' +
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
};
Pathfinder2ERemaster.ARMORS = {
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
for(let a in Pathfinder2ERemaster.ARMORS) {
  let m = Pathfinder2ERemaster.ARMORS[a].match(/Str=(\d+)/);
  if(m) {
    let strMod = Math.floor((+m[1] - 10) / 2);
    Pathfinder2ERemaster.ARMORS[a] =
      Pathfinder2ERemaster.ARMORS[a].replace(/Str=\d+/, 'Str=' + strMod);
  }
}
Pathfinder2ERemaster.BACKGROUNDS = {
  'Acolyte':Pathfinder2E.BACKGROUNDS.Acolyte,
  'Acrobat':Pathfinder2E.BACKGROUNDS.Acrobat,
  'Animal Whisperer':Pathfinder2E.BACKGROUNDS['Animal Whisperer'],
  'Artisan':Pathfinder2E.BACKGROUNDS.Artisan,
  'Artist':Pathfinder2E.BACKGROUNDS.Artist,
  'Barkeep':Pathfinder2E.BACKGROUNDS.Barkeep,
  'Bandit':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Intimidation; Choose 1 from any Terrain Lore)","1:Group Coercion"',
  'Barrister':Pathfinder2E.BACKGROUNDS.Barrister,
  'Bounty Hunter':Pathfinder2E.BACKGROUNDS['Bounty Hunter'],
  'Charlatan':Pathfinder2E.BACKGROUNDS.Charlatan,
  'Cook':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Constitution, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Cooking Lore)","1:Seasoned"',
  'Criminal':Pathfinder2E.BACKGROUNDS.Criminal,
  'Cultist':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Charisma; Choose 1 from any)",' +
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
      '"1:Belief Attributes","1:Belief Skills"',
  'Sailor':Pathfinder2E.BACKGROUNDS.Sailor,
  'Scholar':Pathfinder2E.BACKGROUNDS.Scholar,
  'Scout':Pathfinder2E.BACKGROUNDS.Scout,
  'Street Urchin':Pathfinder2E.BACKGROUNDS['Street Urchin'],
  'Teacher':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Choose 1 from Performance, Society; Academia Lore)",' +
      '"1:Experienced Professional"',
  'Tinker':Pathfinder2E.BACKGROUNDS.Tinker,
  'Warrior':Pathfinder2E.BACKGROUNDS.Warrior
};
for(let b in Pathfinder2ERemaster.BACKGROUNDS)
  Pathfinder2ERemaster.BACKGROUNDS[b] =
    Pathfinder2ERemaster.BACKGROUNDS[b].replaceAll('Ability', 'Attribute');
Pathfinder2ERemaster.CLASSES = {
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
    // Ability => Attribute
    // 1:Attack Trained (Simple Weapons; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip; Unarmed Attacks) =>
    // 1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)
    // TODO 1:Spell Trained (Occult) => 1:Spell Trained (Bard)?
    // 1:Occult Spellcasting => 1:Bard Spellcasting
    // "" => 1:Warrior:Muse
    // 3:Lightning Reflexes => 3:Reflex Expertise
    // 9:Great Fortitude => 9:Fortitude Expertise
    // 9:Resolve => 9:Performer's Heart
    // 11: Vigilant Senses => 11:Perception Mastery
    // 17:Greater Resolve => 17:Greater Performer's Heart
    'Attribute=charisma HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Charisma)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Bard Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Spell Trained (Bard)","1:Class Trained (Bard)",' +
      '"1:Bard Spellcasting","1:Composition Spells",1:Muses,"2:Bard Feats",' +
      '"2:Skill Feats","3:General Feats","3:Reflex Expertise",' +
      '"3:Signature Spells","3:Skill Increases","7:Expert Spellcaster",' +
      '"9:Fortitude Expertise","9:Performer\'s Heart",' +
      '"11:Bard Weapon Expertise","11:Perception Mastery",' +
      '"13:Light Armor Expertise","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Greater Performer\'s Heart",' +
      '"19:Magnum Opus","19:Legendary Spellcaster" ' +
    'Selectables=' +
      '"1:Enigma:Muse",' +
      '"1:Maestro:Muse",' +
      '"1:Polymath:Muse",' +
      '"1:Warrior:Muse" ' +
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
  'Cleric':
    // Ability => Attribute
    // TODO 1:Spell Trained (Divine) => Spell Trained (Cleric)?
    // "" => 1:Class Trained (Cleric)
    // 1:Divine Spellcasting => Cleric Spellcasting
    // "" => 1:Sanctification
    // 5:Alertness => 5:Perception Expertise
    // 9:Resolve => 9:Resolute Faith
    // 11:Lightning Reflexes => 11:Reflex Expertise
    'Attribute=wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Wisdom)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Cleric Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Spell Trained (Cleric)","Class Trained (Cleric)",' +
      '"1:Anathema","1:Cleric Spellcasting","1:Deity","1:Divine Font",' +
      '"1:Doctrine","1:Sanctification","2:Cleric Feats","2:Skill Feats",' +
      '"3:General Feats","3:Skill Increases","5:Perception Expertise",' +
      '"9:Resolute Faith","11:Reflex Expertise","13:Divine Defense",' +
      '"13:Weapon Specialization","19:Miraculous Spell" ' +
    'Selectables=' +
      '"1:Healing Font:Divine Font",' +
      '"1:Harmful Font:Divine Font",' +
      '"1:Cloistered Cleric:Doctrine",' +
      '"1:Warpriest:Doctrine",' +
      '"1:Holy:Sanctification",' +
      '"1:Unholy:Sanctification" ' +
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
    // Ability => Attribute
    // TODO 1:Spell Trained (Primal) => 1:Spell Trained (Druid)?
    // "" => Class Trained (Druid)
    // 1:Primal Spellcasting => 1:Druid Spellcasting
    // 1:Druidic Language => 1:Wildsong
    // 1:Wild Empathy => 1:Voice Of Nature
    // 1:Wild:Order => 1:Untamed:Order
    // 2:Alertness => 2:Perception Expertise
    // 3:Great Fortitude => 3:Fortitude Expertise
    // 5:Lightning Reflexes => 5:Reflex Expertise
    // 11:Druid Weapon Expertise => 11:Weapon Expertise
    // 11:Resolve => 11:Wild Willpower
    'Attribute=wisdom HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Wisdom)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","1:Save Trained (Fortitude; Reflex)",' +
      '"1:Druid Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Spell Trained (Druid)","Class Trained (Druid)",' +
      '"1:Druid Spellcasting","1:Anathema","1:Druidic Order",' +
      '"1:Shield Block","1:Voice Of Nature",1:Wildsong,"2:Druid Feats",' +
      '"2:Skill Feats","3:Perception Expertise","3:General Feats",' +
      '"3:Fortitude Expertise","3:Skill Increases","5:Reflex Expertise",' +
      '"7:Expert Spellcaster","11:Weapon Expertise","11:Wild Willpower",' +
      '"13:Medium Armor Expertise","13:Weapon Specialization",' +
      '"15:Master Spellcaster","19:Legendary Spellcaster",' +
      '"19:Primal Hierophant" ' +
    'Selectables=' +
      '1:Animal:Order,' +
      '1:Leaf:Order,' +
      '1:Storm:Order,' +
      '1:Untamed:Order ' +
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
    // Ability => Attribute
    // 1:Attack Of Opportunity => 1:Reactive Strike
    // 9:Juggernaut => 9:Battle Hardened
    // 15:Evasion => 15:Tempered Reflexes
    'Attribute=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Fighter Key Attribute",' +
      '"features.Dexterity ? 1:Attribute Boost (Dexterity)",' +
      '"features.Strength ? 1:Attribute Boost (Strength)",' +
      '"1:Attribute Boosts",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Fighter Skills",' +
      '"1:Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)","1:Attack Trained (Advanced Weapons)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"1:Class Trained (Fighter)",' +
      '"1:Reactive Strike","1:Shield Block","1:Fighter Feats",' +
      '"2:Skill Feats","3:Bravery","3:General Feats","3:Skill Increases",' +
      '"5:Fighter Weapon Mastery","7:Battlefield Surveyor",' +
      '"7:Weapon Specialization","9:Combat Flexibility","9:Battle Hardened",' +
      '"11:Armor Expertise","11:Fighter Expertise","13:Weapon Legend",' +
      '"15:Tempered Reflexes","15:Greater Weapon Specialization",' +
      '"15:Improved Flexibility","17:Armor Mastery","19:Versatile Legend" ' +
    'Selectables=' +
      '"1:Dexterity:Key Attribute",' +
      '"1:Strength:Key Attribute"',
/*
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
*/
  'Ranger':
    // Ability => Attribute
    // 3:Iron Will => 3:Will Expertise
    // 5:Trackless Step => 5:Trackless Journey
    // 7:Evasion => 7:Natural Reflexes
    // 7:Vigilant Senses => 7:Perception Mastery
    // 11:Juggernaut => 11:Warden's Endurance
    // 11:Wild Stride => 11:Unimpeded Journey
    // 13:Weapon Mastery => 13:Martial Weapon Mastery
    // 15:Improved Evasion => 15:Greater Natural Reflexes
    // 15:Incredible Senses => 15:Perception Legend
    // 19:Second Skin => 19:Medium Armor Mastery
    'Attribute=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Ranger Key Attribute",' +
      '"features.Dexterity ? 1:Attribute Boost (Dexterity)",' +
      '"features.Strength ? 1:Attribute Boost (Strength)",' +
      '"1:Attribute Boosts",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Reflex)","Save Trained (Will)",' +
      '"1:Ranger Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Class Trained (Ranger)",' +
      '"1:Hunt Prey","1:Hunter\'s Edge","1:Ranger Feats","2:Skill Feats",' +
      '"3:General Feats","3:Will Expertise","3:Skill Increases",' +
      '"5:Ranger Weapon Expertise","5:Trackless Journey",' +
      '"7:Natural Reflexes","7:Perception Mastery","7:Weapon Specialization",' +
      '"9:Nature\'s Edge","9:Ranger Expertise","11:Warden\'s Endurance",' +
      '"11:Medium Armor Expertise","11:Unimpeded Journey",' +
      '"13:Martial Weapon Mastery","15:Greater Weapon Specialization",' +
      '"15:Greater Natural Reflexes","15:Perception Legend",' +
      '"17:Masterful Hunter","19:Medium Armor Mastery","19:Swift Prey" ' +
    'Selectables=' +
      '"1:Dexterity:Key Attribute",' +
      '"1:Strength:Key Attribute",' +
      '"1:Flurry:Hunter\'s Edge",' +
      '"1:Precision:Hunter\'s Edge",' +
      '"1:Outwit:Hunter\'s Edge"',
  'Rogue':
    // Ability => Attribute
    // 1:Attack Trained (Simple Weapons; Rapier; Sap; Shortbow; Shortsword; Unarmed Attacks) => Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)
    // "" => 1:Mastermind:Racket
    // "" => features.Mastermind ? 1:Intelligence:Key Ability
    // 7:Evasion => 7:Evasive Reflexes
    // 7:Vigilant Senses => 7:Perception Mastery
    // 9:Great Fortitude => 9:Rogue Resilience
    // 13:Improved Evasion => 13:Greater Rogue Reflexes
    // 13:Incredible Senses => 13:Perception Legend
    // 17:Slippery Mind => 17:Agile Mind
    'Attribute=strength,constitution,dexterity,intelligence,wisdom,charisma ' +
    'HitPoints=8 ' +
    'Features=' +
      '"1:Rogue Key Attribute",' +
      '"1:Attribute Boosts",' +
      '"features.Charisma ? 1:Attribute Boost (Charisma)",' +
      '"features.Constitution ? 1:Attribute Boost (Constitution)",' +
      '"features.Dexterity ? 1:Attribute Boost (Dexterity)",' +
      '"features.Intelligence ? 1:Attribute Boost (Intelligence)",' +
      '"features.Strength ? 1:Attribute Boost (Strength)",' +
      '"features.Wisdom ? 1:Attribute Boost (Wisdom)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Reflex; Will)","Save Trained (Fortitude)",' +
      '"1:Rogue Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Class Trained (Rogue)",' +
      '"1:Rogue\'s Racket","1:Sneak Attack","1:Surprise Attack",' +
      '"1:Rogue Feats","1:Skill Feats","2:Skill Increases",' +
      '"3:Deny Advantage","3:General Feats","5:Weapon Tricks",' +
      '"7:Evasive Reflexes","7:Perception Mastery","7:Weapon Specialization",' +
      '"9:Debilitating Strike","9:Rogue Resilience","11:Rogue Expertise",' +
      '"13:Greater Rogue Reflexes","13:Perception Legend",' +
      '"13:Light Armor Expertise","13:Master Tricks",' +
      '"15:Double Debilitation","15:Greater Weapon Specialization",' +
      '"17:Agile Mind","19:Light Armor Mastery","19:Master Strike" ' +
    'Selectables=' +
      '"1:Dexterity:Key Attribute",' +
      '"features.Mastermind ? 1:Intelligence:Key Attribute",' +
      '"features.Ruffian ? 1:Strength:Key Attribute",' +
      '"features.Scoundrel ? 1:Charisma:Key Attribute",' +
      '"1:Mastermind:Racket",' +
      '"1:Ruffian:Racket",' +
      '"1:Scoundrel:Racket",' +
      '"1:Thief:Racket"',
/*
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
*/
  'Witch':
    'Attribute=intelligence HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Intelligence)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Witch Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Spell Trained (Witch)","1:Class Trained (Witch)",' +
      '"1:Witch Spellcasting","1:Familiar","1:Hex Spells","1:Patron",' +
      '"2:Skill Feats","2:Witch Feats","3:General Feats","3:Skill Increases",' +
      '"5:Magical Fortitude","7:Expert Spellcaster","9:Reflex Expertise",' +
      '"11:Perception Expertise","11:Weapon Expertise","13:Defensive Robes",' +
      '"13:Weapon Specialization","15:Master Spellcaster",' +
      '"17:Will Of The Pupil","19:Legendary Spellcaster","19:Patron\'s Gift" ' +
    'Selectables=' +
      '"1:Faith\'s Flamekeeper:Patron",' +
      '"1:The Inscribed One:Patron",' +
      '"1:The Resentment:Patron",' +
      '"1:Silence In Snow:Patron",' +
      '"1:Spinner Of Threads:Patron",' +
      '"1:Starless Shadow:Patron",' +
      '"1:Wilding Steward:Patron" ' +
    // SpellSlots tradition depends on patron--see classRules
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
    // Ability => Attribute
    // 1:Attack Trained (Club; Crossbow; Dagger; Heavy Crossbow; Staff; Unarmed Attacks) => 1:Attack Trained (Simple Weapons; Unarmed Attacks)
    // TODO 1:Spell Trained (Arcane) => 1:Spell Trained (Wizard)?
    // "" => 1:Class Trained (Wizard)
    // 1:Arcane Spellcasting => 1:Wizard Spellcasting
    // 1:Metamagical Experimentation:Thesis=>1:Experimental Spellshaping:Thesis
    // "" => 1:Staff Nexus:Thesis
    // schools have been replaced
    // 11:Wizard Weapon Expertise => 11:Weapon Expertise
    // 17:Resolve => 17:Prodigious Will
    'Attribute=intelligence HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Intelligence)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Wizard Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Spell Trained (Wizard)","1:Class Trained (Wizard)",' +
      '"1:Wizard Spellcasting","1:Arcane School","1:Arcane Bond",' +
      '"1:Arcane Thesis","2:Skill Feats","2:Wizard Feats","3:General Feats",' +
      '"3:Skill Increases","5:Reflex Expertise","7:Expert Spellcaster",' +
      '"9:Magical Fortitude","11:Perception Expertise","11:Weapon Expertise",' +
      '"13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Prodigious Will",' +
      '"19:Archwizard\'s Spellcraft","19:Legendary Spellcaster" ' +
    'Selectables=' +
      '"1:Ars Grammatica:Arcane School",' +
      '"1:Battle Magic:Arcane School",' +
      '"1:Boundary:Arcane School",' +
      '"1:Civic Wizardry:Arcane School",' +
      '"1:Mentalism:Arcane School",' +
      '"1:Protean Form:Arcane School",' +
      '"1:Unified Magical Theory:Arcane School",' +
      '"1:Experimental Spellshaping:Thesis",' +
      '"1:Improved Familiar Attunement:Thesis",' +
      '"1:Spell Blending:Thesis",' +
      '"1:Spell Substitution:Thesis",' +
      '"1:Staff Nexus:Thesis" ' +
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
Pathfinder2ERemaster.DEITIES = {
  'None':'',
  'Abadar':
    Pathfinder2E.DEITIES.Abadar
    .replace('Magnificent Mansion', 'Planar Palace') + ' ' +
    'AreasOfConcern=Cities,Law,Merchants,Wealth ' +
    'DivineAttribute=Constitution,Intelligence ' +
    'DivineSanctification=Either',
  'Asmodeus':
    Pathfinder2E.DEITIES.Asmodeus + ' ' +
    'AreasOfConcern=Contracts,Oppression,Pride,Tyranny ' +
    'DivineAttribute=Charisma,Constitution,Dexterity,Intelligence,Strength,Wisdom ' +
    'DivineSanctification=Unholy',
  'Calistra':
    Pathfinder2E.DEITIES.Calistra + ' ' +
    'AreasOfConcern=Lust,Revenge,Trickery ' +
    'DivineAttribute=Charisma,Dexterity ' +
    'DivineSanctification=Either',
  'Cayden Cailean':
    Pathfinder2E.DEITIES['Cayden Cailean']
    .replace('Touch Of Idiocy', 'Stupefy') + ' ' +
    'AreasOfConcern=Ale,Bravery,Freedom,Wine ' +
    'DivineAttribute=Charisma,Constitution ' +
    'DivineSanctification=Holy',
  'Desna':
    Pathfinder2E.DEITIES.Desna
    .replace('3:Dream Message', '4:Translocate') + ' ' +
    'AreasOfConcern=Dreams,Luck,Stars,Travelers ' +
    'DivineAttribute=Charisma,Dexterity ' +
    'DivineSanctification=Holy',
  'Erastil':
    Pathfinder2E.DEITIES.Erastil
    .replace('Tree Stride', "Nature's Pathway") + ' ' +
    'AreasOfConcern=Family,Farming,Hunting,Trade ' +
    'DivineAttribute=Constitution,Wisdom ' +
    'DivineSanctification=Holy',
  'Gorum':Pathfinder2E.DEITIES.Gorum + ' ' +
    'AreasOfConcern=Battle,Strength,Weapons ' +
    'DivineAttribute=Constitution,Strength ' +
    'DivineSanctification=Either',
  'Gozreh':Pathfinder2E.DEITIES.Gozreh + ' ' +
    'AreasOfConcern=Nature,"The Sea",Weather ' +
    'DivineAttribute=Constitution,Wisdom ' +
    'DivineSanctification=None',
  'Iomedae':
    Pathfinder2E.DEITIES.Iomedae
    .replace('See Invisibility', 'Enlarge') + ' ' +
    'AreasOfConcern=Honor,Justice,Rulership,Valor ' +
    'DivineAttribute=Constitution,Strength ' +
    'DivineSanctification=Holy',
  'Irori':
    Pathfinder2E.DEITIES.Irori
    .replace('4:Stoneskin', '4:Mountain Resilience') + ' ' +
    'AreasOfConcern=History,Knowledge,Self-Perfection ' +
    'DivineAttribute=Intelligence,Wisdom ' +
    'DivineSanctification=Either',
  'Lamashtu':
    Pathfinder2E.DEITIES.Lamashtu
    .replace('Magic Fang', 'Spider Sting') + ' ' +
    'AreasOfConcern=Aberrance,Monsters,Nightmares ' +
    'DivineAttribute=Constitution,Strength ' +
    'DivineSanctification=Unholy',
  'Nethys':
    Pathfinder2E.DEITIES.Nethys + ' ' +
    'Spells=' +
      '"1:Force Barrage","2:Embed Message","3:Levitate","4:Flicker",' +
      '"5:Telekinetic Haul","6:Wall Of Force","7:Warp Mind","8:Quandary",' +
      '"9:Detonate Magic" ' +
    'AreasOfConcern=Magic ' +
    'DivineAttribute=Intelligence,Wisdom ' +
    'DivineSanctification=Either',
  'Norgorber':
    Pathfinder2E.DEITIES.Norgorber
    .replace('Phantasmal Killer', 'Vision Of Death') + ' ' +
    'AreasOfConcern=Greed,Murder,Poison,Secrets ' +
    'DivineAttribute=Dexterity,Intelligence ' +
    'DivineSanctification=Unholy',
  'Pharasma':
    Pathfinder2E.DEITIES.Pharasma
    .replace('Phantasmal Killer', 'Vision Of Death') + ' ' +
    'AreasOfConcern=Birth,Death,Fate,Prophecy,Time ' +
    'DivineAttribute=Constitution,Wisdom ' +
    'DivineSanctification=None',
  'Rovagug':
    Pathfinder2E.DEITIES.Rovagug
    .replace('Burning Hands', 'Breath Fire') + ' ' +
    'AreasOfConcern=Destruction,Disaster,Wrath ' +
    'DivineAttribute=Constitution,Strength ' +
    'DivineSanctification=Unholy',
  'Sarenrae':
    Pathfinder2E.DEITIES.Sarenrae
    .replace('Burning Hands', 'Breath Fire') + ' ' +
    'AreasOfConcern=Healing,"Honest Redemption","The Sun" ' +
    'DivineAttribute=Constitution,Wisdom ' +
    'DivineSanctification=Holy',
  'Shelyn':
    Pathfinder2E.DEITIES.Shelyn
    .replace('Color Spray', 'Dizzying Colors') + ' ' +
    'AreasOfConcern=Art,Beauty,Love,Music ' +
    'DivineAttribute=Charisma,Wisdom ' +
    'DivineSanctification=Holy',
  'Torag':
    Pathfinder2E.DEITIES.Torag + ' ' +
    'AreasOfConcern=Forge,Protection,Strategy ' +
    'DivineAttribute=Constitution,Wisdom ' +
    'DivineSanctification=Holy',
  'Urgathoa':
    Pathfinder2E.DEITIES.Urgathoa
    .replace('False Life', 'False Vitality') + ' ' +
    'AreasOfConcern=Disease,Gluttony,Undeath ' +
    'DivineAttribute=Constitution,Wisdom ' +
    'DivineSanctification=Unholy',
  'Zon-Kuthon':
    Pathfinder2E.DEITIES['Zon-Kuthon']
    .replace('Shadow Walk', 'Umbral Journey') + ' ' +
    'AreasOfConcern=Darkness,Envy,Loss,Pain ' +
    'DivineAttribute=Constitution,Wisdom ' +
    'DivineSanctification=Unholy'
};
Pathfinder2ERemaster.FEATS = {

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
  'Cautious Curiosity (Arcane)':'Trait=Ancestry,Gnome Require="level >= 9"',
  'Cautious Curiosity (Occult)':'Trait=Ancestry,Gnome Require="level >= 9"',
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
  'Prairie Rider':'Trait=Ancestry,Halfling',
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
  'Flourish And Ruin':'Trait=Ancestry,Leshy Require="level >= 17"',
  'Regrowth':'Trait=Ancestry,Leshy Require="level >= 17"',

  'Beast Trainer':'Trait=Ancestry,Orc',
  'Iron Fists':'Trait=Ancestry,Orc',
  'Orc Ferocity':Pathfinder2E.FEATS['Orc Ferocity'],
  'Orc Lore':'Trait=Ancestry,Orc',
  'Orc Superstition':Pathfinder2E.FEATS['Orc Superstition'],
  'Hold Mark (Burning Sun)':'Trait=Ancestry,Orc',
  "Hold Mark (Death's Head)":'Trait=Ancestry,Orc',
  'Hold Mark (Defiled Corpse)':'Trait=Ancestry,Orc',
  'Hold Mark (Empty Hand)':'Trait=Ancestry,Orc',
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
  'Ferocious Beasts':
    'Trait=Ancestry,Orc ' +
    'Require=' +
      '"level >= 13",' +
      '"features.Orc Ferocity",' +
      '"features.Animal Companion || features.Pet || features.Bonded Animal"',
  'Spell Devourer':
    'Trait=Ancestry,Orc Require="level >= 13","features.Orc Superstition"',
  'Rampaging Ferocity':
    'Trait=Ancestry,Orc Require="level >= 17","features.Orc Ferocity"',

  'Brine May':'Trait=Ancestry,Changeling,Lineage',
  'Callow May':'Trait=Ancestry,Changeling,Lineage',
  'Dream May':'Trait=Ancestry,Changeling,Lineage',
  'Slag May':'Trait=Ancestry,Changeling,Lineage',
  'Changeling Lore':'Trait="Ancestry,Changeling"',
  'Hag Claws':'Trait="Ancestry,Changeling"',
  "Hag's Sight":'Trait="Ancestry,Changeling"',
  'Called':'Trait="Ancestry,Changeling" Require="level >= 5"',
  'Mist Child':'Trait="Ancestry,Changeling" Require="level >= 5"',
  'Accursed Claws':
    'Trait="Ancestry,Changeling" Require="level >= 9",weapons.Claws',
  'Occult Resistance':
    'Trait="Ancestry,Changeling" Require="level >= 9","rank.Occultism >= 2"',
  'Hag Magic':'Trait="Ancestry,Changeling" Require="level >= 13"',

  'Angelkin':'Trait=Ancestry,Nephilim,Lineage',
  'Grimspawn':'Trait=Ancestry,Nephilim,Lineage',
  'Hellspawn':'Trait=Ancestry,Nephilim,Lineage',
  'Pitborn':'Trait=Ancestry,Nephilim,Lineage',
  'Bestial Manifestation':'Trait="Ancestry,Nephilim"',
  'Halo':'Trait="Ancestry,Nephilim"',
  'Nephilim Eyes':'Trait="Ancestry,Nephilim"',
  'Nephilim Lore':'Trait="Ancestry,Nephilim"',
  'Nimble Hooves':'Trait="Ancestry,Nephilim"',
  'Blessed Blood':'Trait="Ancestry,Nephilim" Require="level >= 5"',
  'Extraplanar Supplication':'Trait="Ancestry,Nephilim" Require="level >= 5"',
  'Nephilim Resistance':'Trait="Ancestry,Nephilim" Require="level >= 5"',
  'Scion Of Many Planes':'Trait="Ancestry,Nephilim" Require="level >= 5"',
  'Skillful Tail':'Trait="Ancestry,Nephilim" Require="level >= 5"',
  'Celestial Magic':
    'Trait="Ancestry,Nephilim" Require="level >= 9","features.Celestial"',
  'Divine Countermeasures':'Trait="Ancestry,Nephilim" Require="level >= 9"',
  'Divine Wings':'Trait="Ancestry,Nephilim" Require="level >= 9"',
  'Fiendish Magic':
    'Trait="Ancestry,Nephilim" ' +
    'Require=' +
      '"level >= 9",' +
      '"features.Grimspawn || features.Pitborn || features.Hellspawn"',
  'Celestial Mercy':
    'Trait="Ancestry,Nephilim" Require="level >= 13","features.Celestial"',
  'Slip Sideways':
    'Trait="Ancestry,Nephilim" Require="level >= 13","features.Fiendish"',
  'Summon Nephilim Kin':'Trait="Ancestry,Nephilim" Require="level >= 13"',
  'Divine Declaration':'Trait="Ancestry,Nephilim" Require="level >= 17"',
  'Eternal Wings':
    'Trait="Ancestry,Nephilim" Require="level >= 17","features.Divine Wings"',

  'Earned Glory':'Trait="Ancestry,Aiuvarin"',
  'Elf Atavism':
     Pathfinder2E.FEATS['Inspire Imitation'].replace('Half-Elf', 'Aiuvarin'),
  'Inspire Imitation':'Trait="Ancestry,Aiuvarin" Require="level >= 5"',
  'Supernatural Charm':
     Pathfinder2E.FEATS['Supernatural Charm'].replace('Half-Elf', 'Aiuvarin'),

  'Monstrous Peacemaker':
     Pathfinder2E.FEATS['Monstrous Peacemaker'].replace('Half-Orc', 'Dromaar'),
  'Orc Sight':Pathfinder2E.FEATS['Orc Sight'].replace('Half-Orc', 'Dromaar'),

  // Class
/*
  'Alchemical Familiar':'Trait=Class,Alchemist',
  'Alchemical Savant':
    'Trait=Class,Alchemist Require="rank.Crafting >= 1"',
  'Far Lobber':'Trait=Class,Alchemist',
  'Quick Bomber':'Trait=Class,Alchemist',
*/
  'Poison Resistance':Pathfinder2E.FEATS['Poison Resistance'],
/*
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
*/
  'Sudden Charge':Pathfinder2E.FEATS['Sudden Charge'],
/*
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
*/
  'Swipe':Pathfinder2E.FEATS.Swipe,
/*
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
*/
  'Whirlwind Strike':Pathfinder2E.FEATS['Whirlwind Strike'],
/*
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
    Pathfinder2E.FEATS['Reach Spell']
    .replace('Metamagic', 'Spellshape')
    .replace('Trait=', 'Trait=Witch,'),
  'Versatile Performance':Pathfinder2E.FEATS['Versatile Performance'],
  'Well-Versed':'Trait=Class,Bard"',
  'Cantrip Expansion':
    Pathfinder2E.FEATS['Cantrip Expansion'].replace('Trait=', 'Trait=Witch,'),
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
    Pathfinder2E.FEATS['Multifarious Muse (Polymath)']
    .replace('Polymath', 'Warrior'),
  'Song Of Strength':
    'Trait=Class,Bard Require="level >= 2","features.Warrior"',
  'Uplifting Overture':Pathfinder2E.FEATS['Inspire Competence'],
  'Combat Reading':'Trait=Class,Bard,Secret Require="level >= 4"',
  'Courageous Advance':
    'Trait=Class,Bard,Auditory,Concentrate,Spellshape ' +
    'Require="level >= 4","features.Warrior"',
  'In Tune':
    'Trait=Class,Bard,Concentrate,Spellshape ' +
    'Require="level >= 4","features.Maestro"',
  'Melodious Spell':
    Pathfinder2E.FEATS['Melodious Spell']
    .replace('Manipulate,Metamagic', 'Spellshape'),
  'Rallying Anthem':Pathfinder2E.FEATS['Inspire Defense'],
  'Ritual Researcher':
    'Trait=Class,Bard,Uncommon ' +
    'Require="level >= 4","features.Enigma","rank.Occultism >= 2"',
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
  'Steady Spellcasting':
    Pathfinder2E.FEATS['Steady Spellcasting'].replace('Trait=', 'Trait=Witch,'),
  'Accompany':'Trait=Class,Bard,Concentrate,Manipulate Require="level >= 8"',
  'Call And Response':
    'Trait=Class,Bard,Auditory,Concentrate,Spellshape Require="level >= 8"',
  'Eclectic Skill':Pathfinder2E.FEATS['Eclectic Skill'],
  'Fortissimo Composition':Pathfinder2E.FEATS['Inspire Heroics'],
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
    Pathfinder2E.FEATS['Quickened Casting']
    .replace('Metamagic', 'Spellshape')
    .replace('Trait=', 'Trait=Witch,'),
  'Symphony Of The Unfettered Heart':'Trait=Class,Bard Require="level >= 10"',
  'Unusual Composition':
    Pathfinder2E.FEATS['Unusual Composition']
    .replace('Metamagic', 'Spellshape'),
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
  'Effortless Concentration':
    Pathfinder2E.FEATS['Effortless Concentration']
    .replace('Trait=', 'Trait=Witch,'),
  'Resounding Finale':
    'Trait=Class,Bard,Concentrate Require="level >= 16","features.Maestro"',
  'Studious Capacity':Pathfinder2E.FEATS['Studious Capacity'],
  'All In My Head':'Trait=Class,Bard,Illusion,Mental Require="level >= 18"',
  'Deep Lore':Pathfinder2E.FEATS['Deep Lore'],
  'Discordant Voice':
    'Trait=Class,Bard,Sonic ' +
    'Require="level >= 18","spells.Courageous Anthem (OC1 Foc)"',
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
  'Divine Castigation':
    Pathfinder2E.FEATS['Holy Castigation'] + ' ' +
    'Require="traits.Holy || traits.Unholy"',
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
  'Premonition Of Avoidance':'Trait=Class,Cleric,Divine,Prediction',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    Pathfinder2E.FEATS['Deadly Simplicity'].replace('Positive', 'Vitality'),
  'Emblazon Armament':Pathfinder2E.FEATS['Emblazon Armament'],
  'Panic The Dead':
    Pathfinder2E.FEATS['Turn Undead']
    .replace('Trait=', 'Trait=Emotion,Fear,Mental,'),
  'Rapid Response':'Trait=Class,Cleric Require="level >= 2"',
  'Sap Life':Pathfinder2E.FEATS['Sap Life'],
  'Versatile Font':Pathfinder2E.FEATS['Versatile Font'],
  "Warpriest's Armor":
    'Trait=Class,Cleric Require="level >= 2","features.Warpriest"',
  'Channel Smite':
    Pathfinder2E.FEATS['Channel Smite']
    .replace(',Necromancy', '') + ' Require="level >= 4"',
  'Directed Channel':Pathfinder2E.FEATS['Directed Channel'],
  'Divine Infusion':
    Pathfinder2E.FEATS['Necrotic Infusion']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 4"',
  'Raise Symbol':'Trait=Class,Cleric Require="level >= 4"',
  'Restorative Strike':'Trait=Class,Cleric Require="level >= 4"',
  'Sacred Ground':
    'Trait=Class,Cleric,Consecration,Divine,Exploration ' +
    'Require="level >= 4","features.Harmful Font || feature.Healing Font"',
  'Cast Down':
    Pathfinder2E.FEATS['Cast Down']
    .replace('Metamagic', 'Spellshape') + ' Require="level >= 6"',
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
  'Restorative Channel':Pathfinder2E.FEATS['Channeled Succor'],
  'Sanctify Armament':
    Pathfinder2E.FEATS['Align Armament (Chaotic)']
    .replace(',Evocation', '') + ' ' +
    'Require="level >= 8","traits.Holy || traits.Unholy"',
  'Surging Focus':'Trait=Class,Cleric Require="level >= 8"',
  'Void Siphon':'Trait=Class,Cleric Require="level >= 8"',
  'Zealous Rush':'Trait=Class,Cleric Require="level >= 8"',
  'Castigating Weapon':
    Pathfinder2E.FEATS['Castigating Weapon'].replace('Holy', 'Divine'),
  'Heroic Recovery':
    Pathfinder2E.FEATS['Heroic Recovery']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 10","features.Healing Font"',
  'Replenishment Of War':Pathfinder2E.FEATS['Replenishment Of War'],
  'Shared Avoidance':
    'Trait=Class,Cleric ' +
    'Require="level >= 10","features.Premonition Of Avoidance"',
  'Shield Of Faith':
    'Trait=Class,Cleric Require="level >= 10","features.Domain Initiate"',
  'Defensive Recovery':
    Pathfinder2E.FEATS['Defensive Recovery']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 12"',
  'Domain Focus':Pathfinder2E.FEATS['Domain Focus'],
  'Emblazon Antimagic':Pathfinder2E.FEATS['Emblazon Antimagic'],
  'Fortunate Relief':'Trait=Class,Cleric,Fortune Require="level >= 12"',
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
    Pathfinder2E.FEATS['Extend Armament Alignment']
    .replace('Align', 'Sanctify'),
  'Premonition Of Clarity':'Trait=Class,Cleric,Fortune Require="level >= 14"',
  'Swift Banishment':Pathfinder2E.FEATS['Swift Banishment'],
  'Eternal Bane':
    Pathfinder2E.FEATS['Eternal Bane'] + ' ' +
    'Require="level >= 16","traits.Unholy"',
  'Eternal Blessing':
    Pathfinder2E.FEATS['Eternal Blessing'] + ' ' +
    'Require="level >= 16","traits.Holy"',
  'Rebounding Smite':
    'Trait=Class,Cleric Require="level >= 16","features.Channel Smite"',
  'Remediate':'Trait=Class,Cleric,Concentrate,Spellshape Require="level >= 16"',
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

  'Animal Companion':Pathfinder2E.FEATS['Animal Companion'],
  'Animal Empathy':Pathfinder2E.FEATS['Wild Empathy'],
  'Leshy Familiar':Pathfinder2E.FEATS['Leshy Familiar'],
  // Note: Feat 1 Plant Empathy links to legacy Feat 6 Druid Empathy in Nethys
  'Plant Empathy':'Trait=Class,Druid',
  'Storm Born':Pathfinder2E.FEATS['Storm Born'],
  'Verdant Weapon':'Trait=Class,Druid,Exploration',
  // Reach Spell as above
  'Widen Spell':
    Pathfinder2E.FEATS['Widen Spell']
    .replace('Metamagic', 'Spellshape')
    .replace('Trait=', 'Trait=Witch,'),
  'Untamed Form':Pathfinder2E.FEATS['Wild Shape'].replaceAll('Wild', 'Untamed'),
  'Call Of The Wild':Pathfinder2E.FEATS['Call Of The Wild'],
  'Enhanced Familiar':
    Pathfinder2E.FEATS['Enhanced Familiar'].replace('Trait=', 'Trait=Witch,'),
  'Order Explorer (Animal)':Pathfinder2E.FEATS['Order Explorer (Animal)'],
  'Order Explorer (Leaf)':Pathfinder2E.FEATS['Order Explorer (Leaf)'],
  'Order Explorer (Storm)':Pathfinder2E.FEATS['Order Explorer (Storm)'],
  'Order Explorer (Untamed)':
    Pathfinder2E.FEATS['Order Explorer (Wild)']
    .replace('Wild', 'Untamed'),
  // Poison Resistance as above
  'Anthropomorphic Shape':
    Pathfinder2E.FEATS['Thousand Faces']
    .replace('Wild Shape', 'Untamed Form'),
  'Elemental Summons':'Trait=Class,Druid Require="level >= 4"',
  'Forest Passage':Pathfinder2E.FEATS['Woodland Stride'],
  'Form Control':
    Pathfinder2E.FEATS['Form Control']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 4","features.Untamed Form"',
  'Leshy Familiar Secrets':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >=4",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Mature Animal Companion':Pathfinder2E.FEATS['Mature Animal Companion'],
  'Order Magic (Animal)':Pathfinder2E.FEATS['Order Magic (Animal)'],
  'Order Magic (Leaf)':Pathfinder2E.FEATS['Order Magic (Leaf)'],
  'Order Magic (Storm)':Pathfinder2E.FEATS['Order Magic (Storm)'],
  'Order Magic (Untamed)':
    Pathfinder2E.FEATS['Order Magic (Wild)'].replace('Wild', 'Untamed'),
  'Snowdrift Spell':
    'Trait=Class,Druid,Cold,Manipulate,Spellshape ' +
    'Require="level >= 4","features.Storm"',
  'Current Spell':
    'Trait=Class,Druid,Concentrate,Spellshape Require="level >= 6"',
  'Grown Of Oak':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Insect Shape':
    Pathfinder2E.FEATS['Insect Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Instinctive Support':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Animal Companion"',
  // Steady Spellcasting as above
  'Storm Retribution':
    Pathfinder2E.FEATS['Storm Retribution']
    .replace(' Evo', ''),
  'Deimatic Display':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Intimidation >= 1"',
  'Ferocious Shape':
    Pathfinder2E.FEATS['Ferocious Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Fey Caller':Pathfinder2E.FEATS['Fey Caller'],
  'Floral Restoration':
    'Trait=Class,Druid,Healing,Vitality ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Incredible Companion':Pathfinder2E.FEATS['Incredible Companion'],
  'Raise Menhir':'Trait=Class,Druid Require="level >= 8"',
  'Soaring Shape':
    Pathfinder2E.FEATS['Soaring Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Wind Caller':Pathfinder2E.FEATS['Wind Caller'],
  'Elemental Shape':
    Pathfinder2E.FEATS['Elemental Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Healing Transformation':
    Pathfinder2E.FEATS['Healing Transformation']
    .replace('Metamagic', 'Spellshape'),
  'Overwhelming Energy':
    Pathfinder2E.FEATS['Overwhelming Energy']
    .replace('Metamagic', 'Spellshape'),
  'Plant Shape':
    Pathfinder2E.FEATS['Plant Shape'].replace('Wild Shape', 'Untamed Form'),
  'Primal Howl':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Incredible Companion"',
  'Pristine Weapon':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Verdant Weapon"',
  'Side By Side':Pathfinder2E.FEATS['Side By Side'],
  'Thunderclap Spell':
    'Trait=Class,Druid,Sonic,Spellshape ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Storm || features.Order Explorer (Storm)"',
  'Dragon Shape':Pathfinder2E.FEATS['Dragon Shape'],
  'Garland Spell':
    'Trait=Class,Druid,Manipulate,Spellshape ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  // Note: also subsumes legacy Feat 18 Primal Wellspring
  'Primal Focus':Pathfinder2E.FEATS['Primal Focus'],
  'Primal Summons':Pathfinder2E.FEATS['Primal Summons'],
  'Wandering Oasis':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 12",' +
      '"rank.Survival >= 3"',
  'Reactive Transformation':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Untamed Form",' +
      '"features.Dragon Shape || features.Elemental Shape || features.Plant Shape || features.Soaring Shape"',
  'Sow Spell':'Trait=Class,Druid,Concentrate,Spellshape Require="level >= 14"',
  'Specialized Companion':Pathfinder2E.FEATS['Specialized Companion'],
  'Timeless Nature':Pathfinder2E.FEATS['Timeless Nature'],
  'Verdant Metamorphosis':Pathfinder2E.FEATS['Verdant Metamorphosis'],
  // Effortless Concentration as above
  'Impaling Briars':Pathfinder2E.FEATS['Impaling Briars'],
  'Monstrosity Shape':
    Pathfinder2E.FEATS['Monstrosity Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Uplifting Winds':
    'Trait=Class,Druid ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Storm || features.Order Explorer (Storm)"',
  'Invoke Disaster':Pathfinder2E.FEATS['Invoke Disaster'],
  'Perfect Form Control':Pathfinder2E.FEATS['Perfect Form Control'],
  'Primal Aegis':'Trait=Class,Druid Require="level >= 18"',
  "Hierophant's Power":Pathfinder2E.FEATS["Hierophant's Power"],
  'Ley Line Conduit':
    Pathfinder2E.FEATS['Leyline Conduit']
    .replace('Metamagic', 'Spellshape'),
  'True Shapeshifter':
    Pathfinder2E.FEATS['True Shapeshifter']
    .replace('Wild Shape', 'Untamed Form'),

  'Combat Assessment':'Trait=Class,Fighter',
  'Double Slice':Pathfinder2E.FEATS['Double Slice'],
  'Exacting Strike':Pathfinder2E.FEATS['Exacting Strike'],
  'Point Blank Stance':
    Pathfinder2E.FEATS['Point-Blank Shot']
    .replace(',Open', ''),
  'Reactive Shield':Pathfinder2E.FEATS['Reactive Shield'],
  'Snagging Strike':Pathfinder2E.FEATS['Snagging Strike'],
  // Sudden Charge as above
  'Vicious Swing':Pathfinder2E.FEATS['Power Attack'],
  'Aggressive Block':Pathfinder2E.FEATS['Aggressive Block'],
  'Assisting Shot':Pathfinder2E.FEATS['Assisting Shot'],
  'Blade Brake':'Trait=Class,Fighter,Manipulate Require="level >= 2"',
  'Brutish Shove':Pathfinder2E.FEATS['Brutish Shove'],
  'Combat Grab':Pathfinder2E.FEATS['Combat Grab'],
  'Dueling Parry':Pathfinder2E.FEATS['Dueling Parry'],
  'Intimidating Strike':Pathfinder2E.FEATS['Intimidating Strike'],
  'Lightning Swap':'Trait=Class,Fighter,Flourish Require="level >= 2"',
  'Lunge':Pathfinder2E.FEATS.Lunge,
  'Rebounding Toss':'Trait=Class,Fighter,Flourish Require="level >= 2"',
  'Sleek Reposition':'Trait=Class,Fighter,Press Require="level >= 2"',
  'Barreling Charge':
    'Trait=Class,Fighter,Flourish Require="level >= 4","rank.Athletics >= 1"',
  'Double Shot':Pathfinder2E.FEATS['Double Shot'],
  'Dual-Handed Assault':Pathfinder2E.FEATS['Dual-Handed Assault'],
  'Parting Shot':'Trait=Class,Fighter Require="level >= 4"',
  'Powerful Shove':Pathfinder2E.FEATS['Powerful Shove'],
  'Quick Reversal':Pathfinder2E.FEATS['Quick Reversal'],
  'Shielded Stride':Pathfinder2E.FEATS['Shielded Stride'],
  'Slam Down':Pathfinder2E.FEATS.Knockdown,
  // Swipe as above
  'Twin Parry':Pathfinder2E.FEATS['Twin Parry'],
  'Advanced Weapon Training':Pathfinder2E.FEATS['Advanced Weapon Training'],
  'Advantageous Assault':Pathfinder2E.FEATS['Advantageous Assault'],
  'Dazing Blow':'Trait=Class,Fighter,Press Require="level >= 6"',
  'Disarming Stance':Pathfinder2E.FEATS['Disarming Stance'],
  'Furious Focus':
    Pathfinder2E.FEATS['Furious Focus']
    .replace('Power Attack', 'Vicious Swing'),
  "Guardian's Deflection":Pathfinder2E.FEATS["Guardian's Deflection"],
  'Reflexive Shield':Pathfinder2E.FEATS['Reflexive Shield'],
  'Revealing Stab':Pathfinder2E.FEATS['Revealing Stab'],
  'Ricochet Stance':'Trait=Class,Fighter,Rogue,Stance Require="level >= 6"',
  'Shatter Defenses':Pathfinder2E.FEATS['Shatter Defenses'],
  'Shield Warden':
    'Trait=Class,Fighter Require="level >=6","features.Shield Block"',
  'Triple Shot':Pathfinder2E.FEATS['Triple Shot'],
  'Blind-Fight':Pathfinder2E.FEATS['Blind-Fight'],
  'Disorienting Opening':
    'Trait=Class,Fighter Require="level >= 8","features.Reactive Strike"',
  'Dueling Riposte':Pathfinder2E.FEATS['Dueling Riposte'],
  'Felling Strike':Pathfinder2E.FEATS['Felling Strike'],
  'Incredible Aim':Pathfinder2E.FEATS['Incredible Aim'],
  'Mobile Shot Stance':Pathfinder2E.FEATS['Mobile Shot Stance'],
  'Positioning Assault':Pathfinder2E.FEATS['Positioning Assault'],
  'Quick Shield Block':
    'Trait=Class,Fighter Require="level >= 8","features.Shield Block"',
  'Resounding Bravery':
    'Trait=Class,Fighter Require="level >= 8","features.Bravery"',
  'Sudden Leap':'Trait=Class,Fighter Require="level >= 8"',
  'Agile Grace':Pathfinder2E.FEATS['Agile Grace'],
  'Certain Strike':Pathfinder2E.FEATS['Certain Strike'],
  'Crashing Slam':
    Pathfinder2E.FEATS['Improved Knockdown']
    .replace('Knockdown', 'Slam Down'),
  'Cut From The Air':'Trait=Class,Fighter Require="level >= 10"',
  'Debilitating Shot':Pathfinder2E.FEATS['Debilitating Shot'],
  'Disarming Twist':Pathfinder2E.FEATS['Disarming Twist'],
  'Disruptive Stance':Pathfinder2E.FEATS['Disruptive Stance'],
  'Fearsome Brute':Pathfinder2E.FEATS['Fearsome Brute'],
  'Flinging Charge':'Trait=Class,Fighter,Flourish Require="level >= 10"',
  'Mirror Shield':Pathfinder2E.FEATS['Mirror Shield'],
  'Overpowering Charge':
    'Trait=Class,Fighter Require="level >= 10","features.Barreling Charge"',
  'Tactical Reflexes':Pathfinder2E.FEATS['Combat Reflexes'],
  'Twin Riposte':Pathfinder2E.FEATS['Twin Riposte'],
  'Brutal Finish':Pathfinder2E.FEATS['Brutal Finish'],
  'Dashing Strike':Pathfinder2E.FEATS['Spring Attack'],
  'Dueling Dance':Pathfinder2E.FEATS['Dueling Dance'],
  'Flinging Shove':Pathfinder2E.FEATS['Flinging Shove'],
  'Improved Dueling Riposte':Pathfinder2E.FEATS['Improved Dueling Riposte'],
  'Incredible Ricochet':Pathfinder2E.FEATS['Incredible Ricochet'],
  'Lunging Stance':
    Pathfinder2E.FEATS['Lunging Stance']
    .replace('Attack Of Opportunity', 'Reactive Strike'),
  "Paragon's Guard":Pathfinder2E.FEATS["Paragon's Guard"],
  'Desperate Finisher':
    Pathfinder2E.FEATS['Desperate Finisher']
    .replace('Trait=', 'Trait=Press,'),
  'Determination':Pathfinder2E.FEATS.Determination,
  'Guiding Finish':Pathfinder2E.FEATS['Guiding Finish'],
  'Guiding Riposte':Pathfinder2E.FEATS['Guiding Riposte'],
  'Improved Twin Riposte':Pathfinder2E.FEATS['Improved Twin Riposte'],
  'Opening Stance':Pathfinder2E.FEATS['Stance Savant'],
  'Two-Weapon Flurry':Pathfinder2E.FEATS['Two-Weapon Flurry'],
  // Whirlwind Strike as above
  'Graceful Poise':Pathfinder2E.FEATS['Graceful Poise'],
  'Improved Reflexive Shield':Pathfinder2E.FEATS['Improved Reflexive Shield'],
  'Master Of Many Styles':
    'Trait=Class,Fighter Require="level >= 16","features.Opening Stance"',
  'Multishot Stance':
    Pathfinder2E.FEATS['Multishot Stance']
    .replace('Triple', 'Double'),
  'Overwhelming Blow':'Trait=Class,Fighter Require="level >= 16"',
  'Twinned Defense':Pathfinder2E.FEATS['Twinned Defense'],
  'Impossible Volley':
    Pathfinder2E.FEATS['Impossible Volley']
    .replace(',Open', ''),
  'Savage Critical':Pathfinder2E.FEATS['Savage Critical'],
  'Smash From The Air':
    'Trait=Class,Fighter Require="level >= 18","features.Cut From The Air"',
  'Boundless Reprisals':Pathfinder2E.FEATS['Boundless Reprisals'],
  'Ultimate Flexibility':
    'Trait=Class,Fighter Require="level >= 20","features.Improved Flexibility"',
  'Weapon Supremacy':Pathfinder2E.FEATS['Weapon Supremacy'],

/*
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
*/

  // Animal Companion as above
  'Crossbow Ace':Pathfinder2E.FEATS['Crossbow Ace'],
  'Hunted Shot':Pathfinder2E.FEATS['Hunted Shot'],
  'Initiate Warden':'Trait=Class,Ranger',
  'Monster Hunter':Pathfinder2E.FEATS['Monster Hunter'],
  'Twin Takedown':Pathfinder2E.FEATS['Twin Takedown'],
  'Favored Terrain (%terrain)':Pathfinder2E.FEATS['Favored Terrain (%terrain)'],
  "Hunter's Aim":Pathfinder2E.FEATS["Hunter's Aim"],
  'Monster Warden':Pathfinder2E.FEATS['Monster Warden'],
  'Quick Draw':Pathfinder2E.FEATS['Quick Draw'],
  'Advanced Warden':
    'Trait=Class,Ranger Require="level >= 4","features.Initiate Warden"',
  "Companion's Cry":Pathfinder2E.FEATS["Companion's Cry"],
  'Disrupt Prey':Pathfinder2E.FEATS['Disrupt Prey'],
  'Far Shot':Pathfinder2E.FEATS['Far Shot'],
  'Favored Prey':Pathfinder2E.FEATS['Favored Enemy'],
  'Running Reload':Pathfinder2E.FEATS['Running Reload'],
  "Scout's Warning":Pathfinder2E.FEATS["Scout's Warning"],
  // Twin Parry as above
  'Additional Recollection':'Trait=Class,Ranger Require="level >= 6"',
  'Masterful Warden':
    'Trait=Class,Ranger Require="level >= 6","features.Initiate Warden"',
  // Mature Animal Companion as above
  'Skirmish Strike':Pathfinder2E.FEATS['Skirmish Strike'],
  'Snap Shot':Pathfinder2E.FEATS['Snap Shot'],
  'Swift Tracker':Pathfinder2E.FEATS['Swift Tracker'],
  // Blind-Fight as above
  'Deadly Aim':Pathfinder2E.FEATS['Deadly Aim'].replace('Open', 'Flourish'),
  'Hazard Finder':Pathfinder2E.FEATS['Hazard Finder'],
  'Terrain Master':Pathfinder2E.FEATS['Terrain Master'],
  "Warden's Boon":Pathfinder2E.FEATS["Warden's Boon"],
  'Camouflage':Pathfinder2E.FEATS.Camouflage,
  // Incredible Companion as above
  'Master Monster Hunter':Pathfinder2E.FEATS['Master Monster Hunter'],
  'Peerless Warden':
    'Trait=Class,Ranger Require="level >= 10","features.Initiate Warden"',
  'Penetrating Shot':
    Pathfinder2E.FEATS['Penetrating Shot']
    .replace(',Open', ''),
  // Twin Riposte as above
  "Warden's Step":Pathfinder2E.FEATS["Warden's Step"],
  'Distracting Shot':Pathfinder2E.FEATS['Distracting Shot'],
  'Double Prey':Pathfinder2E.FEATS['Double Prey'],
  'Second Sting':Pathfinder2E.FEATS['Second Sting'],
  // Side By Side as above
  // TODO Requirements?
  "Warden's Focus":
    'Trait=Class,Ranger Require="level >= 12","features.Initiate Warden"',
  'Sense The Unseen':Pathfinder2E.FEATS['Sense The Unseen'],
  'Shared Prey':Pathfinder2E.FEATS['Shared Prey'],
  'Stealthy Companion':Pathfinder2E.FEATS['Stealthy Companion'],
  "Warden's Guidance":Pathfinder2E.FEATS["Warden's Guidance"],
  'Greater Distracting Shot':Pathfinder2E.FEATS['Greater Distracting Shot'],
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':Pathfinder2E.FEATS['Legendary Monster Hunter'],
  // Specialized Companion as above
  "Warden's Reload":'Trait=Class,Ranger Require="level >= 16"',
  'Impossible Flurry':
    Pathfinder2E.FEATS['Impossible Flurry']
    .replace(',Open', ''),
  // Impossible Volley as above
  'Manifold Edge':Pathfinder2E.FEATS['Manifold Edge'],
  'Masterful Companion':Pathfinder2E.FEATS['Masterful Companion'],
  'Perfect Shot':Pathfinder2E.FEATS['Perfect Shot'],
  'Shadow Hunter':Pathfinder2E.FEATS['Shadow Hunter'],
  'Legendary Shot':
    Pathfinder2E.FEATS['Legendary Shot']
    .replace(',"features.Masterful Hunter"', ''),
  'To The Ends Of The Earth':Pathfinder2E.FEATS['To The Ends Of The Earth'],
  'Triple Threat':Pathfinder2E.FEATS['Triple Threat'],
  'Ultimate Skirmisher':
    Pathfinder2E.FEATS['Ultimate Skirmisher']
    .replace('Wild Stride', 'Unimpeded Journey'),

  'Nimble Dodge':Pathfinder2E.FEATS['Nimble Dodge'],
  'Overextending Feint':'Trait=Class,Rogue Require="rank.Deception >= 1"',
  'Plant Evidence':'Trait=Class,Rogue Require="features.Pickpocket"',
  'Trap Finder':Pathfinder2E.FEATS['Trap Finder'],
  'Tumble Behind':'Trait=Class,Rogue',
  'Twin Feint':Pathfinder2E.FEATS['Twin Feint'],
  "You're Next":Pathfinder2E.FEATS["You're Next"],
  'Brutal Beating':Pathfinder2E.FEATS['Brutal Beating'],
  'Clever Gambit':'Trait=Class,Rogue Require="level >=2","features.Mastermind"',
  'Distracting Feint':Pathfinder2E.FEATS['Distracting Feint'],
  'Mobility':Pathfinder2E.FEATS.Mobility,
  // Quick Draw as above
  'Strong Arm':'Trait=Class,Rogue',
  'Unbalancing Blow':Pathfinder2E.FEATS['Unbalancing Blow'],
  'Underhanded Assault':
    'Trait=Class,Rogue Require="level >= 2","rank.Stealth >= 1"',
  'Dread Striker':Pathfinder2E.FEATS['Dread Striker'],
  'Head Stomp':'Trait=Class,Rogue Require="level >= 4"',
  'Mug':'Trait=Class,Rogue Require="level >= 4"',
  'Poison Weapon':Pathfinder2E.FEATS['Poison Weapon'],
  'Predictable!':'Trait=Class,Rogue Require="level >= 4"',
  'Reactive Pursuit':Pathfinder2E.FEATS['Reactive Pursuit'],
  'Sabotage':Pathfinder2E.FEATS.Sabotage,
  "Scoundrel's Surprise":'Trait=Class,Rogue,Manipulate Require="level >= 4"',
  // Scout's Warning as above
  'The Harder They Fall':'Trait=Class,Rogue Require="level >= 4"',
  'Twin Distraction':
    'Trait=Class,Rogue Require="level >= 4","features.Twin Feint"',
  'Analyze Weakness':
    'Trait=Class,Rogue Require="level >= 6","features.Sneak Attack"',
  'Anticipate Ambush':
    'Trait=Class,Rogue,Exploration Require="level >= 6","rank.Stealth >= 2"',
  'Far Throw':'Trait=Class,Rogue Require="level >= 6"',
  'Gang Up':Pathfinder2E.FEATS['Gang Up'],
  'Light Step':Pathfinder2E.FEATS['Light Step'],
  'Shove Down':'Trait=Class,Rogue Require="level >= 6","rank.Athletics >= 1"',
  // Skirmish Strike as above
  'Sly Disarm':'Trait=Class,Rogue Require="level >= 6"',
  'Twist The Knife':Pathfinder2E.FEATS['Twist The Knife'],
  'Watch Your Back':
    'Trait=Class,Rogue,Emotion,Fear,Mental ' +
    'Require="level >= 6","rank.Intimidation >= 1"',
  // Blind-Fight as above
  'Bullseye':'Trait=Class,Rogue Require="level >= 8"',
  'Delay Trap':Pathfinder2E.FEATS['Delay Trap'],
  'Improved Poison Weapon':Pathfinder2E.FEATS['Improved Poison Weapon'],
  'Inspired Stratagem':'Trait=Class,Rogue Require="level >= 8"',
  'Nimble Roll':Pathfinder2E.FEATS['Nimble Roll'],
  'Opportune Backstab':Pathfinder2E.FEATS['Opportune Backstab'],
  'Predictive Purchase':'Trait=Class,Rogue Require="level >= 8"',
  // Ricochet Stance as above
  'Sidestep':Pathfinder2E.FEATS.Sidestep,
  'Sly Striker':Pathfinder2E.FEATS['Sly Striker'],
  'Swipe Souvenir':'Trait=Class,Rogue Require="level >= 8"',
  'Tactical Entry':'Trait=Class,Rogue Require="level >= 8","rank.Stealth >= 3"',
  'Methodical Debilitations':
    'Trait=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Mastermind",' +
      '"features.Debilitating Strike"',
  'Nimble Strike':
    'Trait=Class,Rogue Require="level >= 10","features.Nimble Roll"',
  'Precise Debilitations':Pathfinder2E.FEATS['Precise Debilitations'],
  'Sneak Adept':Pathfinder2E.FEATS['Sneak Savant'],
  'Tactical Debilitations':Pathfinder2E.FEATS['Tactical Debilitations'],
  'Vicious Debilitations':Pathfinder2E.FEATS['Vicious Debilitations'],
  'Bloody Debilitation':
    'Trait=Class,Rogue ' +
    'Require="level >= 12","rank.Medicine >= 1","features.Debilitating Strike"',
  'Critical Debilitation':Pathfinder2E.FEATS['Critical Debilitation'],
  'Fantastic Leap':Pathfinder2E.FEATS['Fantastic Leap'],
  'Felling Shot':Pathfinder2E.FEATS['Felling Shot'],
  'Preparation':'Trait=Class,Rogue,Flourish Require="level >= 12"',
  'Reactive Interference':Pathfinder2E.FEATS['Reactive Interference'],
  'Ricochet Feint':
    'Trait=Class,Rogue Require="level >= 12","features.Ricochet Stance"',
  'Spring From The Shadows':Pathfinder2E.FEATS['Spring From The Shadows'],
  'Defensive Roll':Pathfinder2E.FEATS['Defensive Roll'],
  'Instant Opening':Pathfinder2E.FEATS['Instant Opening'],
  'Leave An Opening':Pathfinder2E.FEATS['Leave An Opening'],
  // Sense The Unseen as above
  'Stay Down!':'Trait=Class,Rogue Require="level >= 12","rank.Athletics >= 3"',
  'Blank Slate':Pathfinder2E.FEATS['Blank Slate'],
  'Cloud Step':Pathfinder2E.FEATS['Cloud Step'],
  'Cognitive Loophole':Pathfinder2E.FEATS['Cognitive Loophole'],
  'Dispelling Slice':Pathfinder2E.FEATS['Dispelling Slice'],
  'Perfect Distraction':Pathfinder2E.FEATS['Perfect Distraction'],
  'Reconstruct The Scene':'Trait=Class,Rogue,Concentrate Require="level >= 16"',
  'Swift Elusion':
    'Trait=Class,Rogue Require="level >= 16","rank.Acrobatics >= 4"',
  'Implausible Infiltration':Pathfinder2E.FEATS['Implausible Infiltration'],
  'Implausible Purchase':
    'Trait=Class,Rogue Require="level >= 18","features.Predictive Purchase"',
  'Powerful Sneak':Pathfinder2E.FEATS['Powerful Sneak'],
  "Trickster's Ace":
    Pathfinder2E.FEATS["Trickster's Ace"]
    .replace('Trait=', 'Trait=Investigator,'),
  'Hidden Paragon':Pathfinder2E.FEATS['Hidden Paragon'],
  'Impossible Striker':Pathfinder2E.FEATS['Impossible Striker'],
  'Reactive Distraction':Pathfinder2E.FEATS['Reactive Distraction'],

  'Counterspell':
    Pathfinder2E.FEATS.Counterspell.replace('Trait=', 'Trait=Witch,'),
/*
  'Dangerous Sorcery':'Trait=Class,Sorcerer',
*/
  'Familiar':Pathfinder2E.FEATS.Familiar,
/*
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Trait=Class,Sorcerer,Arcane ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Arcane\'"',
*/
  'Bespell Strikes':Pathfinder2E.FEATS['Bespell Weapon'],
/*
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
*/
  'Magic Sense':Pathfinder2E.FEATS['Magic Sense'],
/*
  'Interweave Dispel':
    'Trait=Class,Sorcerer,Metamagic ' +
    'Require="level >= 14","knowsDispelMagicSpell"',
  */
  'Reflect Spell':
    Pathfinder2E.FEATS['Reflect Spell']
    .replace('Trait=', 'Trait=Witch,'),
  /*
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
*/
  'Spellshape Mastery':Pathfinder2E.FEATS['Metamagic Mastery'],

  'Cackle':'Trait=Class,Witch',
  'Cauldron':'Trait=Class,Witch',
  // Counterspell as above
  // Widen Spell as above
  "Witch's Armaments (Eldritch Nails)":'Trait=Class,Witch',
  "Witch's Armaments (Iron Teeth)":'Trait=Class,Witch',
  "Witch's Armaments (Living Hair)":'Trait=Class,Witch',
  'Basic Lesson (Dreams)':'Trait=Class,Witch Require="level >= 2"',
  'Basic Lesson (Elements)':'Trait=Class,Witch Require="level >= 2"',
  'Basic Lesson (Life)':'Trait=Class,Witch Require="level >= 2"',
  'Basic Lesson (Protection)':'Trait=Class,Witch Require="level >= 2"',
  'Basic Lesson (Vengeance)':'Trait=Class,Witch Require="level >= 2"',
  // Cantrip Expansion as above
  'Conceal Spell':
    Pathfinder2E.FEATS['Conceal Spell']
    .replace('Manipulate,Metamagic', 'Spellshape')
    .replace('Trait=', 'Trait=Witch,'),
  // Enhanced Familiar as above
  "Familiar's Language":'Trait=Class,Witch Require="level >= 2"',
  'Rites Of Convocation':'Trait=Class,Witch Require="level >= 4"',
  'Sympathetic Strike':
    'Trait=Class,Witch Require="level >= 4","features.Witch\'s Armaments"',
  'Ceremonial Knife':'Trait=Class,Witch Require="level >= 6"',
  'Greater Lesson (Mischief)':'Trait=Class,Witch Require="level >= 6"',
  'Greater Lesson (Shadow)':'Trait=Class,Witch Require="level >= 6"',
  'Greater Lesson (Snow)':'Trait=Class,Witch Require="level >= 6"',
  // Steady Spellcasting as above
  "Witch's Charge":'Trait=Class,Witch,Detection Require="level >= 6"',
  'Incredible Familiar':
    'Trait=Class,Witch Require="level >= 8","features.Enhanced Familiar"',
  'Murksight':'Trait=Class,Witch Require="level >= 8"',
  // TODO Requires "divine or occult patron"
  'Spirit Familiar':'Trait=Class,Witch Require="level >= 8"',
  // TODO Requires "arcane or primal patron"
  'Stitched Familiar':'Trait=Class,Witch Require="level >= 8"',
  "Witch's Bottle":'Trait=Class,Witch Require="level >= 8","features.Cauldron"',
  'Double, Double':
    'Trait=Class,Witch Require="level >= 10","features.Cauldron"',
  'Major Lesson (Death)':'Trait=Class,Witch Require="level >= 10"',
  'Major Lesson (Renewal)':'Trait=Class,Witch Require="level >= 10"',
  // Quickened Casting as above
  "Witch's Communion":
    'Trait=Class,Witch Require="level >= 10","features.Witch\'s Charge"',
  'Coven Spell':'Trait=Class,Witch,Spellshape Require="level >= 12"',
  'Hex Focus':'Trait=Class,Witch Require="level >= 12"',
  "Witch's Broom":'Trait=Class,Witch Require="level >= 12"',
  // Reflect Spell as above
  'Rites of Transfiguration':'Trait=Class,Witch Require="level >= 14"',
  "Patron's Presence":'Trait=Class,Witch Require="level >= 14"',
  // Effortless Concentration as above
  'Siphon Power':'Trait=Class,Witch Require="level >= 16"',
  'Split Hex':'Trait=Class,Witch,Concentrate,Spellshape Require="level >= 18"',
  "Patron's Claim":'Trait=Class,Witch Require="level >= 18"',
  'Hex Master':'Trait=Class,Witch Require="level >= 20"',
  "Patron's Truth":
    'Trait=Class,Witch Require="level >= 20","features.Patron\'s Gift"',
  "Witch's Hut":'Trait=Class,Witch Require="level >= 20"',

  // Wizard
  // Counterspell as above
  // Familiar as above
  // Reach Spell as above
  'Spellbook Prodigy':'Trait=Class,Wizard Require="rank.Arcana >= 1"',
  // Widen Spell as above
  // Cantrip Expansion as above
  // Conceal Spell as above
  'Energy Ablation':'Trait=Class,Wizard,Spellshape Require="level >= 2"',
  // Enhanced Familiar as above
  'Nonlethal Spell':
    'Trait=Class,Wizard,Manipulate,Spellshape Require="level >= 2"',
  // Bespell Weapon as above
  'Call Wizardly Tools':
    'Trait=Class,Wizard,Concentrate,Teleportation ' +
    'Require="level >= 4","features.Arcane Bond"',
  'Linked Focus':Pathfinder2E.FEATS['Linked Focus'],
  'Spell Protection Array':
    'Trait=Class,Wizard,Arcane,Manipulate Require="level >= 4"',
  'Convincing Illusion':
    'Trait=Class,Wizard Require="level >= 6","rank.Deception >= 2"',
  'Explosive Arrival':
    'Trait=Class,Wizard,Concentrate,Manipulate,Spellshape Require="level >= 6"',
  'Irresistible Magic':Pathfinder2E.FEATS['Spell Penetration'],
  'Split Slot':'Trait=Class,Wizard Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced School Spell':Pathfinder2E.FEATS['Advanced School Spell'],
  'Bond Conservation':
    Pathfinder2E.FEATS['Bond Conservation']
    .replace('Metamagic', 'Spellshape'),
  'Form Retention':'Trait=Class,Wizard Require="level >= 8"',
  'Knowledge Is Power':'Trait=Class,Wizard Require="level >= 8"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Adept':Pathfinder2E.FEATS['Scroll Savant'],
  'Clever Counterspell':Pathfinder2E.FEATS['Clever Counterspell'],
  'Forcible Energy':
    'Trait=Class,Wizard,Manipulate,Spellshape Require="level >= 12"',
  'Keen Magical Detection':'Trait=Class,Wizard,Fortune Require="level >= 12"',
  // Magic Sense as above
  'Bonded Focus':Pathfinder2E.FEATS['Bonded Focus'],
  // Reflect Spell as above
  'Secondary Detonation Array':
    'Trait=Class,Wizard,Manipulate,Spellshape Require="level >= 14"',
  'Superior Bond':Pathfinder2E.FEATS['Superior Bond'],
  // Effortless Concentration as above
  'Scintillating Spell':
    'Trait=Class,Wizard,Concentrate,Light,Spellshape Require="level >= 16"',
  'Spell Tinker':Pathfinder2E.FEATS['Spell Tinker'],
  'Infinite Possibilities':Pathfinder2E.FEATS['Infinite Possibilities'],
  'Reprepare Spell':Pathfinder2E.FEATS['Reprepare Spell'],
  'Second Thoughts':
    'Trait=Class,Wizard,Concentrate,Mental Require="level >= 18"',
  "Archwizard's Might":Pathfinder2E.FEATS["Archwizard's Might"],
  'Spell Combination':Pathfinder2E.FEATS['Spell Combination'],
  'Spell Mastery':'Trait=Class,Wizard Require="level >= 20"',
  // Spellshape Mastery as above

/*
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

  // General and Skill
  'Additional Lore (%lore)':
    Pathfinder2E.FEATS['Additional Lore (%lore)'] + ' Require=""',
  'Adopted Ancestry (%ancestry)':
    Pathfinder2E.FEATS['Adopted Ancestry (%ancestry)'],
  'Advanced First Aid':
    'Trait=General,Healing,Manipulate,Skill ' +
    'Require="level >= 7","rank.Medicine >= 3"',
  'Alchemical Crafting':Pathfinder2E.FEATS['Alchemical Crafting'],
  'Ancestral Paragon':Pathfinder2E.FEATS['Ancestral Paragon'],
  'Arcane Sense':Pathfinder2E.FEATS['Arcane Sense'],
  'Armor Proficiency':Pathfinder2E.FEATS['Armor Proficiency'],
  'Assurance (%skill)':Pathfinder2E.FEATS['Assurance (%skill)'],
  'Automatic Knowledge (%skill)':
    Pathfinder2E.FEATS['Automatic Knowledge (%skill)'],
  'Bargain Hunter':Pathfinder2E.FEATS['Bargain Hunter'],
  'Battle Cry':Pathfinder2E.FEATS['Battle Cry'],
  'Battle Medicine':Pathfinder2E.FEATS['Battle Medicine'],
  'Bizarre Magic':Pathfinder2E.FEATS['Bizarre Magic'],
  'Bonded Animal':Pathfinder2E.FEATS['Bonded Animal'],
  'Break Curse':
    'Trait=Concentrate,Exploration,General,Healing,Skill ' +
    'Require="level >= 7","rank.Occultism >= 3 || rank.Religion >= 3"',
  'Breath Control':'Trait=General',
  'Canny Acumen (Fortitude)':Pathfinder2E.FEATS['Canny Acumen (Fortitude)'],
  'Canny Acumen (Perception)':Pathfinder2E.FEATS['Canny Acumen (Perception)'],
  'Canny Acumen (Reflex)':Pathfinder2E.FEATS['Canny Acumen (Reflex)'],
  'Canny Acumen (Will)':Pathfinder2E.FEATS['Canny Acumen (Will)'],
  'Cat Fall':Pathfinder2E.FEATS['Cat Fall'],
  'Charming Liar':Pathfinder2E.FEATS['Charming Liar'],
  'Cloud Jump':Pathfinder2E.FEATS['Cloud Jump'],
  'Combat Climber':Pathfinder2E.FEATS['Combat Climber'],
  'Communal Crafting':
    'Trait=General,Skill Require="level >= 2","rank.Crafting >= 2"',
  'Confabulator':Pathfinder2E.FEATS.Confabulator,
  'Continual Recovery':Pathfinder2E.FEATS['Continual Recovery'],
  'Courtly Graces':Pathfinder2E.FEATS['Courtly Graces'],
  'Craft Anything':Pathfinder2E.FEATS['Craft Anything'],
  'Diehard':Pathfinder2E.FEATS.Diehard,
  'Divine Guidance':Pathfinder2E.FEATS['Divine Guidance'],
  'Dubious Knowledge':Pathfinder2E.FEATS['Dubious Knowledge'],
  'Expeditious Search':Pathfinder2E.FEATS['Expeditious Search'],
  'Experienced Professional':Pathfinder2E.FEATS['Experienced Professional'],
  'Experienced Smuggler':
    Pathfinder2E.FEATS['Experienced Smuggler'].replace(/\/[^"]*/, ''),
  'Experienced Tracker':Pathfinder2E.FEATS['Experienced Tracker'],
  'Fascinating Performance':Pathfinder2E.FEATS['Fascinating Performance'],
  'Fast Recovery':Pathfinder2E.FEATS['Fast Recovery'],
  'Feather Step':Pathfinder2E.FEATS['Feather Step'],
  'Fleet':Pathfinder2E.FEATS.Fleet,
  'Foil Senses':Pathfinder2E.FEATS['Foil Senses'],
  'Forager':Pathfinder2E.FEATS.Forager,
  'Glad-Hand':Pathfinder2E.FEATS['Glad-Hand'],
  'Group Coercion':Pathfinder2E.FEATS['Group Coercion'],
  'Group Impression':Pathfinder2E.FEATS['Group Impression'],
  'Hefty Hauler':Pathfinder2E.FEATS['Hefty Hauler'],
  'Hobnobber':Pathfinder2E.FEATS.Hobnobber,
  'Impeccable Crafting':Pathfinder2E.FEATS['Impeccable Crafting'],
  'Impressive Performance':Pathfinder2E.FEATS['Impressive Performance'],
  'Incredible Initiative':Pathfinder2E.FEATS['Incredible Initiative'],
  'Incredible Investiture':Pathfinder2E.FEATS['Incredible Investiture'],
  'Intimidating Glare':Pathfinder2E.FEATS['Intimidating Glare'],
  'Intimidating Prowess':Pathfinder2E.FEATS['Intimidating Prowess'],
  'Inventor':
    Pathfinder2E.FEATS.Inventor + ' Require="level >= 2","rank.Crafting >= 2"',
  'Kip Up':Pathfinder2E.FEATS['Kip Up'],
  'Lasting Coercion':Pathfinder2E.FEATS['Lasting Coercion'],
  'Legendary Codebreaker':Pathfinder2E.FEATS['Legendary Codebreaker'],
  'Legendary Linguist':Pathfinder2E.FEATS['Legendary Linguist'],
  'Legendary Medic':Pathfinder2E.FEATS['Legendary Medic'],
  'Legendary Negotiation':Pathfinder2E.FEATS['Legendary Negotiation'],
  'Legendary Performer':Pathfinder2E.FEATS['Legendary Performer'],
  'Legendary Professional':Pathfinder2E.FEATS['Legendary Professional'],
  'Legendary Sneak':Pathfinder2E.FEATS['Legendary Sneak'],
  'Legendary Survivalist':Pathfinder2E.FEATS['Legendary Survivalist'],
  'Legendary Thief':Pathfinder2E.FEATS['Legendary Thief'],
  'Lengthy Diversion':Pathfinder2E.FEATS['Lengthy Diversion'],
  'Leverage Connections': // TODO Player Core 2
    Pathfinder2E.FEATS.Connections
    .replace('Graces', 'Graces || features.Streetwise'),
  'Lie To Me':Pathfinder2E.FEATS['Lie To Me'],
  'Magical Crafting':Pathfinder2E.FEATS['Magical Crafting'],
  'Magical Shorthand':Pathfinder2E.FEATS['Magical Shorthand'],
  'Monster Crafting':
    'Trait=General,Skill Require="level >= 7","rank.Survival >= 3"',
  'Multilingual':Pathfinder2E.FEATS.Multilingual,
  'Natural Medicine':Pathfinder2E.FEATS['Natural Medicine'],
  'Nimble Crawl':Pathfinder2E.FEATS['Nimble Crawl'],
  'No Cause For Alarm':
    'Trait=General,Skill,Auditory,Concentrate,Emotion,Linguistic,Mental ' +
    'Require="rank.Diplomacy >= 1"',
  'Oddity Identification':Pathfinder2E.FEATS['Oddity Identification'],
  'Pet':'Trait=General',
  'Pickpocket':Pathfinder2E.FEATS.Pickpocket,
  'Planar Survival':Pathfinder2E.FEATS['Planar Survival'],
  'Powerful Leap':Pathfinder2E.FEATS['Powerful Leap'],
  'Prescient Consumable':
    'Trait=General Require="level >= 7","features.Prescient Planner"',
  'Prescient Planner':'Trait=General Require="level >= 3"',
  'Quick Climb':Pathfinder2E.FEATS['Quick Climb'],
  'Quick Coercion':Pathfinder2E.FEATS['Quick Coercion'],
  'Quick Disguise':Pathfinder2E.FEATS['Quick Disguise'],
  'Quick Identification':Pathfinder2E.FEATS['Quick Identification'],
  'Quick Jump':Pathfinder2E.FEATS['Quick Jump'],
  'Quick Recognition':Pathfinder2E.FEATS['Quick Recognition'],
  'Quick Repair':Pathfinder2E.FEATS['Quick Repair'],
  'Quick Squeeze':Pathfinder2E.FEATS['Quick Squeeze'],
  'Quick Swim':Pathfinder2E.FEATS['Quick Swim'],
  'Quick Unlock':Pathfinder2E.FEATS['Quick Unlock'],
  'Quiet Allies':Pathfinder2E.FEATS['Quiet Allies'],
  'Rapid Mantel':Pathfinder2E.FEATS['Rapid Mantel'],
  'Read Lips':Pathfinder2E.FEATS['Read Lips'],
  'Recognize Spell':Pathfinder2E.FEATS['Recognize Spell'],
  'Ride':Pathfinder2E.FEATS.Ride,
  'Robust Recovery':Pathfinder2E.FEATS['Robust Recovery'],
  'Scare To Death':Pathfinder2E.FEATS['Scare To Death'],
  'Schooled In Secrets':'Trait=General,Skill Require="rank.Occultism >= 1"',
  'Seasoned':
    'Trait=General,Skill ' +
    'Require="rank.Alcohol Lore >= 1 || rank.Cooking Lore >= 1 || rank.Crafting >= 1"',
  'Shameless Request':Pathfinder2E.FEATS['Shameless Request'],
  'Shield Block':Pathfinder2E.FEATS['Shield Block'],
  'Sign Language':Pathfinder2E.FEATS['Sign Language'],
  'Skill Training (%skill)':Pathfinder2E.FEATS['Skill Training (%skill)'],
  'Slippery Secrets':Pathfinder2E.FEATS['Slippery Secrets'],
  'Snare Crafting':Pathfinder2E.FEATS['Snare Crafting'],
  'Specialty Crafting':Pathfinder2E.FEATS['Specialty Crafting'],
  'Steady Balance':Pathfinder2E.FEATS['Steady Balance'],
  'Streetwise':Pathfinder2E.FEATS.Streetwise,
  'Student Of The Canon':Pathfinder2E.FEATS['Student Of The Canon'],
  'Subtle Theft':Pathfinder2E.FEATS['Subtle Theft'],
  'Survey Wildlife':Pathfinder2E.FEATS['Survey Wildlife'],
  'Swift Sneak':Pathfinder2E.FEATS['Swift Sneak'],
  'Terrain Expertise (%terrain)':
    Pathfinder2E.FEATS['Terrain Expertise (%terrain)'],
  'Terrain Stalker (Rubble)':Pathfinder2E.FEATS['Terrain Stalker (Rubble)'],
  'Terrain Stalker (Snow)':Pathfinder2E.FEATS['Terrain Stalker (Snow)'],
  'Terrain Stalker (Underbrush)':
    Pathfinder2E.FEATS['Terrain Stalker (Underbrush)'],
  'Terrified Retreat':Pathfinder2E.FEATS['Terrified Retreat'],
  'Titan Wrestler':Pathfinder2E.FEATS['Titan Wrestler'],
  'Toughness':Pathfinder2E.FEATS.Toughness,
  'Train Animal':Pathfinder2E.FEATS['Train Animal'],
  'Trick Magic Item':Pathfinder2E.FEATS['Trick Magic Item'],
  'Underwater Marauder':Pathfinder2E.FEATS['Underwater Marauder'],
  'Unified Theory':Pathfinder2E.FEATS['Unified Theory'],
  'Unmistakable Lore':Pathfinder2E.FEATS['Unmistakable Lore'],
  'Untrained Improvisation':Pathfinder2E.FEATS['Untrained Improvisation'],
  'Unusual Treatment':
    'Trait=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  'Virtuosic Performer':Pathfinder2E.FEATS['Virtuosic Performer'],
  'Wall Jump':Pathfinder2E.FEATS['Wall Jump'],
  'Ward Medic':Pathfinder2E.FEATS['Ward Medic'],
  'Wary Disarmament':Pathfinder2E.FEATS['Wary Disarmament'],
  'Weapon Proficiency (Martial Weapons)':
    Pathfinder2E.FEATS['Weapon Proficiency (Martial Weapons)'],
  'Weapon Proficiency (%advancedWeapon)':
    Pathfinder2E.FEATS['Weapon Proficiency (%advancedWeapon)']

};
Pathfinder2ERemaster.FEATURES = {

  // Ancestry
  'Ancestry Feats':'Section=feature Note="%V selections"',

  'Ancient-Blooded Dwarf':Pathfinder2E.FEATURES['Ancient-Blooded Dwarf'],
  'Ancient Elf':'Section=feature Note="+1 Class Feat (multiclass dedication)"',
  'Arctic Elf':Pathfinder2E.FEATURES['Arctic Elf'],
  'Badlands Orc':
    'Section=ability,save ' +
    'Note=' +
      '"Can Hustle twice the normal duration while exploring",' +
      '"Treats environmental heat as 1 step less extreme"',
  'Battle-Ready Orc':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Intimidating Glare feature",' +
      '"Skill Trained (Intimidation)"',
  'Cactus Leshy':
    'Section=combat Note="Spines unarmed attack inflicts 1d6 HP piercing"',
  'Call On Ancient Blood':Pathfinder2E.FEATURES['Call On Ancient Blood'],
  'Cavern Elf':Pathfinder2E.FEATURES['Cavern Elf'],
  'Chameleon Gnome':Pathfinder2E.FEATURES['Chameleon Gnome'],
  'Charhide Goblin':Pathfinder2E.FEATURES['Charhide Goblin'],
  'Darkvision':Pathfinder2E.FEATURES.Darkvision,
  'Death Warden Dwarf':
    Pathfinder2E.FEATURES['Death Warden Dwarf']
    .replace('necromancy', 'void and undead'),
  'Deep Orc':
    'Section=feature ' +
    'Note="Has the Combat Climber and Terrain Expertise (Underground) features"',
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
  'Grave Orc':
    'Section=save ' +
    'Note="Has resistance %{level//2>?1} to void damage/+1 vs. death and void effects"',
  'Gutsy Halfling':Pathfinder2E.FEATURES['Gutsy Halfling'],
  'Half-Elf':'Section=feature Note="Has the Low-Light Vision feature"',
  'Half-Orc':'Section=feature Note="Has the Low-Light Vision feature"',
  'Halfling Heritage':'Section=feature Note="1 selection"',
  'Hillock Halfling':Pathfinder2E.FEATURES['Hillock Halfling'],
  'Hold-Scarred Orc':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 Hit Points",' +
      '"Has the Diehard feature"',
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
  'Orc Heritage':'Section=feature Note="1 selection"',
  'Plant Nourishment':'Section=feature Note="Gains nourishment from nature"',
  'Rainfall Orc':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. disease",' +
      '"+2 Athletics to Climb or Swim"',
  'Razortooth Goblin':Pathfinder2E.FEATURES['Razortooth Goblin'],
  'Rock Dwarf':
    Pathfinder2E.FEATURES['Rock Dwarf'].replace('Shove', 'Reposition, Shove'),
  'Root Leshy':
    'Section=combat,combat,feature,save ' +
    'Note=' +
      '"+2 Hit Points",' +
      '"+2 vs. attempts to Reposition, Shove, or Trip",' +
      '"Can go 2 weeks without sunlight before starving",' +
      '"+2 vs. spells and effects that move and knock prone"',
  'Seaweed Leshy':
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
  'Winter Orc':
    'Section=save,skill ' +
    'Note=' +
      '"Treats environmental cold as 1 step less extreme",' +
      '"Skill Trained (Survival)"',
  'Woodland Elf':Pathfinder2E.FEATURES['Woodland Elf'],

  // Ancestry feats
  'Dwarven Doughtiness':
    'Section=save ' +
    'Note="Reduces frightened condition by 2 at the end of each turn"',
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
  'Mountain Strategy':
    'Section=combat ' +
    'Note="Inflicts additional damage equal to the number of damage dice to giant, goblin, hryngar, and orc foes"',
  'Rock Runner':
    Pathfinder2E.FEATURES['Rock Runner']
    .replace('flat-footed', 'off-guard'),
  // Changed from Stonecunning
  "Stonemason's Eye":Pathfinder2E.FEATURES.Stonecunning,
  'Unburdened Iron':Pathfinder2E.FEATURES['Unburdened Iron'],
  'Boulder Roll':Pathfinder2E.FEATURES['Boulder Roll'],
  'Defy The Darkness':
    'Section=feature,magic ' +
    'Note=' +
      '"Can use Darkvision in magical darkness",' +
      '"Cannot use darkness magic"',
  'Dwarven Reinforcement':
    'Section=skill ' +
    'Note="Can use 1 hr work to give an item +%{rank.Crafting<3?1:rank.Crafting<4?2:3} Hardness for 24 hr"',
  'Echoes In Stone':
    'Action=1 ' +
    'Section=feature ' +
    'Note="Gives 20\' imprecise tremorsense for 1 turn when standing on earth or stone"',
  "Mountain's Stoutness":Pathfinder2E.FEATURES["Mountain's Stoutness"],
  'Stone Bones':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful DC 17 flat check turns a critical physical hit into a normal hit"',
  'Stonewalker':
    Pathfinder2E.FEATURES.Stonewalker
    .replace('Stonecunning', "Stonemason's Eye"),
  'March The Mines':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strides or Burrows 15\' twice; can take along an adjacent willing ally"',
  'Telluric Power':
    'Section=magic ' +
    'Note="Inflicts additional damage equal to the number of weapon damage dice to a foe standing on the same earth or stone surface"',
  'Stonegate':
    'Section=magic ' +
    'Note="Knows the Magic Passage divine innate spell; may cast it once per day to open passages through earth or stone"',
  'Stonewall':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Petrifies self until the end of the turn, negating damage from the triggering effect and subsequent effects that would not affect stone"',

  'Ancestral Longevity':Pathfinder2E.FEATURES['Ancestral Longevity'],
  // Changed
  'Elven Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Elven Lore) feature",' +
      '"Skill Trained (Arcana; Nature)"',
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
  'Tree Climber':'Section=ability Note="Has a 10\' climb Speed"',
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
    'Note="Can speak with animals and gains +1 to Make An Impression on them"',
  'Fey Fellowship':Pathfinder2E.FEATURES['Fey Fellowship'],
  'First World Magic':Pathfinder2E.FEATURES['First World Magic'],
  // Changed
  'Gnome Obsession':
    'Section=feature ' +
    // TODO trouble randomizing?
    'Note="+2 Skill Feat (Additional Lore; Assurance)"',
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
    'Note="Places an illusion of normal clothing over armor"',
  'Cautious Curiosity (Arcane)':
    'Section=magic ' +
    'Note="Knows the Disguise Magic and Silence arcane innate spells; can cast each at 2nd-rank on self once per day"',
  'Cautious Curiosity (Occult)':
    'Section=magic ' +
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
    'Section=magic ' +
    'Note="Knows the Interplanar Teleport primal innate spell; may use it twice per week to travel to the First World"',

  'Burn It!':
    Pathfinder2E.FEATURES['Burn It!'].replace('spell level', 'spell rank'),
  'City Scavenger':Pathfinder2E.FEATURES['City Scavenger'],
  // Changed
  'Goblin Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Goblin Lore) feature",' +
      '"Skill Trained (Nature; Stealth)"',
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
  'Loud Singer':'Section=combat Note="Has increased Goblin Song effects"',
  'Vandal':
    'Section=combat,skill ' +
    'Note=' +
      '"Strikes against unattended objects and traps ignore 5 Hardness",' +
      '"Skill Trained (Thievery)"',
  'Cave Climber':Pathfinder2E.FEATURES['Cave Climber'],
  'Cling':
    'Action=1 ' +
    'Section=combat ' +
    'Note="After a successful Strike with a hand free, moves with the target until a successful DC %{10+skillModifiers.Acrobatics} Escape"',
  'Skittering Scuttle':Pathfinder2E.FEATURES['Skittering Scuttle'],
  'Very, Very Sneaky':Pathfinder2E.FEATURES['Very, Very Sneaky'],
  'Reckless Abandon':
    'Action=Free ' +
    'Section=save ' +
    'Note="Critical failures and failures on saves due to hazardous actions are successes and result in minimum damage until the end of the turn once per day"',

  'Distracting Shadows':Pathfinder2E.FEATURES['Distracting Shadows'],
  'Folksy Patter':
    'Section=skill ' +
    'Note="Can transmit a 3-word hidden message to a target who succeeds on a DC 20 Perception check; DC is reduced by 5 each for a halfling target and one with Folksy Patter"',
  // Changed
  'Halfling Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Halfling Lore) feature",' +
      '"Skill Trained (Acrobatics; Stealth)"',
  'Halfling Luck':Pathfinder2E.FEATURES['Halfling Luck'],
  // Changed
  'Halfling Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Halfling Weapons; Sling; Shortsword)",' +
      '"Has access to uncommon halfling weapons%{level>=5?\'/Critical hits with a halfling weapon, sling, or shortsword inflict its critical specialization effect\':\'\'}"',
  'Prairie Rider':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Nature)",' +
      '"+1 Command An Animal with traditional halfling mounts"',
  'Sure Feet':
    Pathfinder2E.FEATURES['Sure Feet']
    .replace('flat-footed', 'off-guard'),
  'Titan Slinger':Pathfinder2E.FEATURES['Titan Slinger'],
  'Unfettered Halfling':
    Pathfinder2E.FEATURES['Unfettered Halfling']
    .replace(/.Foe Grab[^"]*/, ''),
  'Watchful Halfling':
    Pathfinder2E.FEATURES['Watchful Halfling']
    .replace('-2 ', ''),
  'Cultural Adaptability (%ancestry)':
    Pathfinder2E.FEATURES['Cultural Adaptability (%ancestry)'],
  'Step Lively':
    'Section=combat ' +
    'Note="Follows a foe move that leaves it adjacent with a Step to a different adjacent space"',
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
  'Adaptive Adept':
    Pathfinder2E.FEATURES['Adaptive Adept'].replace('level', 'rank'),
  'Clever Improviser':Pathfinder2E.FEATURES['Clever Improviser'],
  'Sense Allies':
    'Section=skill ' +
    'Note="R60\' Willing undetected allies are hidden instead; may target hidden allies with a DC 5 flat check"',
  'Cooperative Soul':Pathfinder2E.FEATURES['Cooperative Soul'],
  'Group Aid':
    'Action=Free ' +
    'Section=skill ' +
    'Note="After Aiding an ally, Aids another on the same skill"',
  'Hardy Traveler':
    'Section=ability,ability ' +
    'Note=' +
      '"+1 Encumbered Bulk/+1 Maximum Bulk",' +
      '"+10\' Speed during overland travel"',
  'Incredible Improvisation':Pathfinder2E.FEATURES['Incredible Improvisation'],
  'Multitalented':Pathfinder2E.FEATURES.Multitalented,
  'Advanced General Training':
    'Section=feature Note="+1 General Feat (7th level)"',
  'Bounce Back':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Wounded condition does not increase when losing the dying condition once per day"',
  'Stubborn Persistence':
    'Section=save Note="Can avoid fatigue with a successful DC 17 flat check"',
  'Heroic Presence':
    'Action=1 ' +
    'Section=magic ' +
    'Note="R30\' Generates the effects of a 6th-level Zealous Conviction on 10 willing creatures once per day"',

  'Grasping Reach':
    'Section=combat ' +
    'Note="Can reach 10\' with two-handed weapons; doing so reduces the damage die by 1 step"',
  'Harmlessly Cute':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Shameless Request feature",' +
      '"+1 Initiative when using Deception"',
  'Leshy Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Leshy Lore) feature",' +
      '"Skill Trained (Nature; Stealth)"',
  'Leshy Superstition':
    'Action=Reaction Section=save Note="+1 on the triggering save"',
  'Seedpod':
    'Section=combat ' +
    'Note="R30\' Seedpod attack inflicts 1d4 HP bludgeoning, plus -10\' Speed on a critical success"',
  'Shadow Of The Wilds':
    'Section=skill ' +
    'Note="Has continuous Covering Tracks effects outside of urban environments"',
  'Undaunted':
    'Section=save ' +
    'Note="+1 vs. emotion effects, and successes are critical successes"',
  'Anchoring Roots':
    'Section=feature Note="Has the Anchor and Steady Balance features"',
  'Anchor':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives +%{$\'features.Root Leshy\'?4:2} vs. Reposition, Shove, and Trip attempts and reduces the distance on a successful attempt by half; taking a move action ends"',
  'Leshy Glide':
    'Action=1 ' +
    'Section=ability ' +
    'Note="Can glide downward, moving 5\' down and up to 25\' forward each rd"',
  // TODO check One With Plants spell
  'Ritual Reversion':
    'Action=2 Section=magic Note="Transforms self into a normal plant"',
  'Speak With Kindred':
    'Section=skill ' +
    'Note="Can speak with plants and fungi/+2 Diplomacy with plants or fungi of the same kind as self"',
  'Bark And Tendril':
    'Section=magic ' +
    'Note="Knows the Entangling Flora and Oaken Resilience primal innate spells; can cast each at rank 2 once per day"',
  'Lucky Keepsake':
    'Section=save Note="+1 vs. spells and magical effects"',
  'Solar Rejuvenation':
    'Section=combat ' +
    'Note="Regains %{constitutionModifier*(level//2)} HP from 10 min rest in a suitable environment"',
  'Thorned Seedpod':
    'Section=combat ' +
    'Note="Critical hits with seedpods inflict 1d4 HP persistent piercing"',
  'Call Of The Green Man':
    'Section=magic ' +
    'Note="Knows the Plant Form primal innate spell; can cast it at rank %{level>=17?6:5} once per day"',
  'Cloak Of Poison':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful foe unarmed and non-reach melee attacks inflict 3d6 HP poison on the attacker for 1 min"',
  'Flourish And Ruin':
    'Section=magic ' +
    'Note="Knows the Field Of Life and Tangling Creepers primal innate spells; can cast each at rank 6 once per day"',
  'Regrowth':
    'Section=magic ' +
    'Note="Knows the Regenerate primal innate spell; can cast it at rank 7 once per day"',

  'Beast Trainer':
    'Section=feature,skill ' +
    'Note=' +
      // TODO problems randomizing
      '"+1 General Feat (Pet or Train Animal)",' +
      '"Skill Trained (Nature)"',
  'Iron Fists':
    'Section=combat Note="Fists can inflict lethal damage and can shove"',
  'Orc Ferocity':Pathfinder2E.FEATURES['Orc Ferocity'],
  'Orc Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Orc Lore) feature",' +
      '"Skill Trained (Athletics; Survival)"',
  'Orc Superstition':Pathfinder2E.FEATURES['Orc Superstition'],
  'Hold Mark (Burning Sun)':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. arcane spells",' +
      '"Skill Trained (Diplomacy)"',
  "Hold Mark (Death's Head)":
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. primal spells",' +
      '"Skill Trained (Survival)"',
  'Hold Mark (Defiled Corpse)':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. divine spells",' +
      '"Skill Trained (Religion)"',
  'Hold Mark (Empty Hand)':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. occult spells",' +
      '"Skill Trained (Intimidation)"',
  // Changed
  'Orc Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Orc Weapons; Falchion; Greataxe)",' +
      '"Has access to uncommon orc weapons%{level>=5?\'/Critical hits with a orc weapon, falchion, or greataxe inflict its critical specialization effect\':\'\'}"',
  'Tusks':'Section=combat Note="Tusks inflict 1d6 HP piercing"',
  'Athletic Might':
    'Section=skill ' +
    'Note="Successes on Athletics to Climb or Swim are critical successes"',
  'Bloody Blows':
    'Section=combat ' +
    'Note="Lethal unarmed attacks inflict 1d4 HP persistent bleed damage"',
  'Defy Death':
    'Section=save ' +
    'Note="-1 DC on dying recovery checks/Suffers no debilitation after being returned to life"',
  'Scar-Thick Skin':'Section=save Note="-5 DC to end persistent bleed damage"',
  'Pervasive Superstition':Pathfinder2E.FEATURES['Pervasive Superstition'],
  'Undying Ferocity':
    'Section=combat Note="Using Orc Ferocity gives %{level} temporary HP"',
  'Incredible Ferocity':Pathfinder2E.FEATURES['Incredible Ferocity'],
  'Ferocious Beasts':
    'Section=combat ' +
    'Note="Partnered animals have the Orc Ferocity %{$\'features.Undying Ferocity\'?\'and Undying Ferocity features\':\'feature\'}"',
  'Spell Devourer':
    'Section=save ' +
    'Note="Successful saves vs. magic give temporary HP equal do double the spell rank or equal to the effect level"',
  'Rampaging Ferocity':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Using Orc Ferocity gives a Strike against the attacking foe and gives another use of Orc Ferocity if the Strike reduces the foe to 0 HP"',

  'Changeling':'Section=feature Note="May take Changeling feats"',
  'Nephilim':'Section=feature Note="May take Nephilim feats"',

  'Brine May':
    'Section=skill ' +
    'Note="Successful Swim checks are critical successes, and failure does cause sinking"',
  'Callow May':
    'Section=combat,feature ' +
    'Note=' +
      '"Rolling Deception for initiative causes foes that haven\'t acted to be off-guard",' +
      '"Has the Charming Liar feature"',
  'Dream May':
    'Section=save ' +
    'Note="+2 vs. sleep and dream effects/Sleep restores double normal HP and reduces drained and doomed conditions by 2"',
  'Slag May':'Section=combat Note="Cold-iron claws inflict 1d6 HP slashing"',
  'Changeling Lore':
    'Section=feature Note="TODO"',
  'Hag Claws':
    'Section=feature Note="TODO"',
  "Hag's Sight":
    'Section=feature Note="TODO"',
  'Called':
    'Section=feature Note="TODO"',
  'Mist Child':
    'Section=feature Note="TODO"',
  'Accursed Claws':
    'Section=feature Note="TODO"',
  'Occult Resistance':
    'Section=feature Note="TODO"',
  'Hag Magic':
    'Section=feature Note="TODO"',

  'Angelkin':
    'Section=feature Note="TODO"',
  'Grimspawn':
    'Section=feature Note="TODO"',
  'Hellspawn':
    'Section=feature Note="TODO"',
  'Lawbringer':
    'Section=feature Note="TODO"',
  'Musetouched':
    'Section=feature Note="TODO"',
  'Pitborn':
    'Section=feature Note="TODO"',
  'Bestial Manifestation':
    'Section=feature Note="TODO"',
  'Halo':
    'Section=feature Note="TODO"',
  'Nephilim Eyes':
    'Section=feature Note="TODO"',
  'Nephilim Lore':
    'Section=feature Note="TODO"',
  'Nimble Hooves':
    'Section=feature Note="TODO"',
  'Blessed Blood':
    'Section=feature Note="TODO"',
  'Extraplanar Supplication':
    'Section=feature Note="TODO"',
  'Nephilim Resistance':
    'Section=feature Note="TODO"',
  'Scion Of Many Planes':
    'Section=feature Note="TODO"',
  'Skillful Tail':
    'Section=feature Note="TODO"',
  'Celestial Magic':
    'Section=feature Note="TODO"',
  'Divine Countermeasures':
    'Section=feature Note="TODO"',
  'Divine Wings':
    'Section=feature Note="TODO"',
  'Fiendish Magic':
    'Section=feature Note="TODO"',
  'Celestial Mercy':
    'Section=feature Note="TODO"',
  'Slip Sideways':
    'Section=feature Note="TODO"',
  'Summon Nephilim Kin':
    'Section=feature Note="TODO"',
  'Divine Declaration':
    'Section=feature Note="TODO"',
  'Eternal Wings':
    'Section=feature Note="TODO"',

  'Earned Glory':
    'Section=feature Note="TODO"',
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
  'Orc Sight':'Section=feature Note="Has the Darkvision feature"',

  // Backgrounds
  'Belief Attributes':
    'Section=ability ' +
    'Note="Attribute Boost (Choose 1 from %V; Choose 1 from any)"',
  'Belief Skills':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Assurance (%V) feature",' +
      '"Skill Trained (%V; %1)"',
  'Martial Focus':'Section=feature Note="1 selection"',
  'Scholarly Tradition':'Section=feature Note="1 selection"',

  // Class Features and Feats

  'Attribute Boosts':
    Pathfinder2E.FEATURES['Ability Boosts'].replace('Ability', 'Attribute'),
  'General Feats':Pathfinder2E.FEATURES['General Feats'],
  'Skill Feats':Pathfinder2E.FEATURES['Skill Feats'],
  'Skill Increases':Pathfinder2E.FEATURES['Skill Increases'],

  /*
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
*/
  'Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Reflex)",' +
      '"Successes on Reflex saves are critical successes"',
/*
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
*/
  'Juggernaut':Pathfinder2E.FEATURES.Juggernaut,
  'Medium Armor Expertise':Pathfinder2E.FEATURES['Medium Armor Expertise'],
  'Medium Armor Mastery':Pathfinder2E.FEATURES['Medium Armor Mastery'],
/*
  'Mutagenic Flashback':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Regains the effects of a mutagen consumed earlier in the day for 1 min once per day"',
  'Mutagenist':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Mutagenic Flashback feature",' +
      '"Knows the formulas for 2 common 1st-level mutagens"',
*/
  'Perception Expertise':'Section=skill Note="Perception Expert"',
/*
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
*/
  'Weapon Specialization':Pathfinder2E.FEATURES['Weapon Specialization'],
/*

  'Alchemical Familiar':'Section=feature Note="Has the Familiar feature"',
  'Alchemical Savant':
    'Section=skill ' +
    'Note="Can use Crafting to Identify Alchemy in 1 action/+2 to Identify known formulas, and critical failures are normal failures"',
  'Far Lobber':'Section=combat Note="Thrown bombs have a 30\' range"',
  'Quick Bomber':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Can draw and Strike with a bomb in 1 action"',
*/
  'Poison Resistance':
    'Section=save ' +
    'Note="Has poison resistance %{level//2} and +1 saves vs. poison"',
/*
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
    'Note="Once every 10 min, can administer a true elixir of life that restores life with 1 HP and wounded 1 to a creature dead for up to 2 rd"',
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
*/
  'Deny Advantage':
    'Section=combat ' +
    'Note="Does not suffer flat-footed vs. hidden, undetected, flanking, or surprising foes of equal or lower level"',
/*
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
*/
  'Greater Weapon Specialization':
    Pathfinder2E.FEATURES['Greater Weapon Specialization'],
/*
  'Heightened Senses':'Section=skill Note="Perception Master"',
  'Indomitable Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Instinct':'Section=feature Note="1 selection"',
  // Juggernaut as above
*/
  'Reflex Expertise':'Section=save Note="Save Expert (Reflex)"',
/*
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
*/
  'Sudden Charge':Pathfinder2E.FEATURES['Sudden Charge'],
/*
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
*/
  'Swipe':Pathfinder2E.FEATURES.Swipe,
/*
  'Wounded Rage':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Begins rage upon taking damage"',
  'Animal Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Unarmored Defense)",' +
      '"+%{($\'features.Greater Juggernaut\'?3:2)-(dexterityModifier-3>?0)} Armor Class in no armor during rage"',
  */
  'Reactive Strike':Pathfinder2E.FEATURES['Attack Of Opportunity'],
  /*
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
*/
  'Sudden Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike while Leaping, High Jumping, or Long Jumping up to %{speed*2}\'"',
/*
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
*/
  'Whirlwind Strike':Pathfinder2E.FEATURES['Whirlwind Strike'],
/*
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
*/

  // Bard
  'Bard Feats':Pathfinder2E.FEATURES['Bard Feats'],
  'Bard Skills':Pathfinder2E.FEATURES['Bard Skills'],
  'Bard Spellcasting':Pathfinder2E.FEATURES['Occult Spellcasting'],
  'Bard Weapon Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"Critical hits with a simple weapon, martial weapon, or unarmed attack inflict its critical specialization effect when a composition spell is active"',
  'Composition Spells':
    Pathfinder2E.FEATURES['Composition Spells']
    .replace('Inspire Courage', 'Courageous Anthem'),
  'Enigma':Pathfinder2E.FEATURES.Enigma.replace('True Strike', 'Sure Strike'),
  'Expert Spellcaster':Pathfinder2E.FEATURES['Expert Spellcaster'],
  'Fortitude Expertise':Pathfinder2E.FEATURES['Great Fortitude'],
  "Greater Performer's Heart":Pathfinder2E.FEATURES['Greater Resolve'],
  'Legendary Spellcaster':Pathfinder2E.FEATURES['Legendary Spellcaster'],
  'Light Armor Expertise':Pathfinder2E.FEATURES['Light Armor Expertise'],
  'Magnum Opus':Pathfinder2E.FEATURES['Magnum Opus'],
  'Master Spellcaster':Pathfinder2E.FEATURES['Master Spellcaster'],
  'Maestro':Pathfinder2E.FEATURES.Maestro,
  'Muses':Pathfinder2E.FEATURES.Muses,
  "Performer's Heart":Pathfinder2E.FEATURES.Resolve,
  'Perception Mastery':Pathfinder2E.FEATURES['Vigilant Senses'],
  'Polymath':
    Pathfinder2E.FEATURES.Polymath
    .replace('Unseen Servant', 'Phantasmal Minion'),
  // Reflex Expertise as above
  'Signature Spells':
    Pathfinder2E.FEATURES['Signature Spells'].replace('level', 'rank'),
  'Warrior':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Martial Performance feature",' +
      '"Knows the Fear occult spell"',
  // Weapon Specialization as above

  'Bardic Lore':Pathfinder2E.FEATURES['Bardic Lore'],
  'Hymn Of Healing':
    'Section=magic Note="Knows the Hymn Of Healing occult focus spell"',
  'Lingering Composition':
    Pathfinder2E.FEATURES['Lingering Composition'],
  'Martial Performance':
    'Section=magic ' +
    'Note="Successful Strike while <i>Courageous Anthem</i>, <i>Rallying Anthem</i>, or <i>Song Of Strength</i> is active extends the spell by 1 rd"',
  'Reach Spell':Pathfinder2E.FEATURES['Reach Spell'],
  'Versatile Performance':Pathfinder2E.FEATURES['Versatile Performance'],
  'Well-Versed':
    'Section=save ' +
    'Note="+1 vs. auditory, illusion, linguistic, sonic, and visual spells"',
  'Cantrip Expansion':Pathfinder2E.FEATURES['Cantrip Expansion'],
  'Directed Audience':
    'Section=magic ' +
    'Note="Can redirect the emanation of a composition spell into a cone up to 10\' or twice the area"',
  'Emotional Push':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a foe who fails a save vs. emotion off-guard against next self attack before the end of turn"',
  'Esoteric Polymath':Pathfinder2E.FEATURES['Esoteric Polymath'],
  "Loremaster's Etude":
    Pathfinder2E.FEATURES["Loremaster's Etude"],
  'Multifarious Muse (Enigma)':
    Pathfinder2E.FEATURES['Multifarious Muse (Enigma)'],
  'Multifarious Muse (Maestro)':
    Pathfinder2E.FEATURES['Multifarious Muse (Maestro)'],
  'Multifarious Muse (Polymath)':
    Pathfinder2E.FEATURES['Multifarious Muse (Polymath)'],
  'Multifarious Muse (Warrior)':
    Pathfinder2E.FEATURES['Multifarious Muse (Polymath)']
    .replace('Polymath', 'Warrior').replace('polymath', 'warrior'),
  'Song Of Strength':
    Pathfinder2E.FEATURES['Inspire Defense']
    .replace('Inspire Defense', 'Song Of Strength'),
  'Uplifting Overture':
    Pathfinder2E.FEATURES['Inspire Competence']
    .replace('Inspire Competence', 'Uplifting Overture'),
  'Combat Reading':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Occultism vs. the higher of target\'s Deception or Stealth DC reveals a target weakness, poorest save, or highest resistance; critical success gives two of these, and critical failure gives false information"',
  'Courageous Advance':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Courageous Anthem</i> casting allows one ally to take a Stride Reaction"',
  'In Tune':
    'Action=1 ' +
    'Section=magic ' +
    'Note="R60\' Subsequent composition spell emanation centers on a willing ally"',
  'Melodious Spell':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Give a subsequent spell the subtle trait"',
  'Rallying Anthem':
    'Section=magic ' +
    'Note="Knows the Rallying Anthem occult focus cantrip"',
  'Ritual Researcher':
    'Section=magic Note="+2 on checks made as part of casting a ritual"',
  'Triple Time':Pathfinder2E.FEATURES['Triple Time'],
  'Versatile Signature':Pathfinder2E.FEATURES['Versatile Signature'],
  'Dirge Of Doom':Pathfinder2E.FEATURES['Dirge Of Doom'],
  'Educate Allies':
    'Section=magic ' +
    'Note="Allies affected by a composition spell gain +1, and self gains +2, vs. auditory, illusion, linguistic, sonic, and visual spells for 1 rd"',
  'Harmonize':Pathfinder2E.FEATURES.Harmonize,
  'Song Of Marching':
    'Section=magic Note="Knows the Song Of Marching occult cantrip"',
  'Steady Spellcasting':Pathfinder2E.FEATURES['Steady Spellcasting'],
  'Accompany':
    'Section=skill ' +
    'Note="Successful Performance and sacrifice of a Focus Point or spell slot allows an ally to cast a spell without expending a point or slot"',
  'Call And Response':
    'Section=magic ' +
    'Note="Allows allies to use an action to extend for 1 rd a subsequent composition cantrip that affects them"',
  'Eclectic Skill':Pathfinder2E.FEATURES['Eclectic Skill'],
  'Fortissimo Composition':
    'Section=magic ' +
    'Note="Knows the Fortissimo Composition occult spell"',
  'Know-It-All':
    'Section=skill ' +
    'Note="Successful Recall Knowledge checks give additional information"',
  'Reflexive Courage':Pathfinder2E.FEATURES['Attack Of Opportunity'],
  'Soulsight':
    'Section=skill ' +
    'Note="R60\' Has imprecise spiritsense that can detect the presence of spirits"',
  'Annotate Composition':
    'Section=magic ' +
    'Note="Can spend 10 minutes and a Focus Point to write a composition spell that can be activated by anyone until next daily prep"',
  'Courageous Assault':
    'Section=magic ' +
    'Note="Target of subsequent <i>Courageous Anthem</i> can immediately use a Reaction to Strike"',
  'House Of Imaginary Walls':Pathfinder2E.FEATURES['House Of Imaginary Walls'],
  'Ode To Ouroboros':
    'Section=magic Note="Knows the Ode To Ouroboros occult spell"',
  'Quickened Casting':Pathfinder2E.FEATURES['Quickened Casting'],
  'Symphony Of The Unfettered Heart':
    'Section=magic ' +
    'Note="Knows the Symphony Of The Unfettered Heart occult spell"',
  'Unusual Composition':
    Pathfinder2E.FEATURES['Unusual Composition'] + ' ' +
    'Note="Allows a subsequent visual or auditory spell to affect any sense"',
  'Eclectic Polymath':Pathfinder2E.FEATURES['Eclectic Polymath'],
  "Enigma's Knowledge":
    'Section=skill Note="Can use Automatic Knowledge with any skill"',
  'Inspirational Focus':
    Pathfinder2E.FEATURES['Inspirational Focus'].replace('2', 'all'),
  'Reverberate':
    'Section=save ' +
    'Note="Successful Performance reflects %{level*2} HP sonic back to its source, or %{level*4} on a critical success"',
  'Shared Assault':
    'Section=magic ' +
   'Note="A critical hit by an ally affected by by Courageous Assault allows another <i>Courageous Anthem</i> target to immediately use a Reaction to Strike"',
  'Allegro':Pathfinder2E.FEATURES.Allegro,
  'Earworm':
    'Section=magic ' +
    'Note="10 min process primes allies to be affected by a composition cantrip with a successful Performance check"',
  'Soothing Ballad':Pathfinder2E.FEATURES['Soothing Ballad'],
  'Triumphant Inspiration':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Follows a critical melee hit with a single-action composition cantrip"',
  'True Hypercognition':Pathfinder2E.FEATURES['True Hypercognition'],
  'Vigorous Anthem':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Courageous Anthem</i> gives allies %{3+charismaModifier} temporary Hit Points for 1 min"',
  'Courageous Onslaught':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Courageous Anthem</i> allows 1 ally a Reaction to Stride and make a melee Strike"',
  'Effortless Concentration':Pathfinder2E.FEATURES['Effortless Concentration'],
  'Resounding Finale':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Ending a composition spell gives affected allies resistance to triggering sonic damage equal to twice the spell\'s rank"',
  'Studious Capacity':Pathfinder2E.FEATURES['Studious Capacity'],
  'All In My Head':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Changes damage from a non-death Strike or spell to non-lethal mental damage"',
  'Deep Lore':Pathfinder2E.FEATURES['Deep Lore'],
  'Discordant Voice':
    'Section=magic ' +
    'Note="Weapon Strikes and unarmed attack by allies affected by <i>Courageous Anthem</i> inflict +1d6 HP sonic"',
  'Eternal Composition':Pathfinder2E.FEATURES['Eternal Composition'],
  'Impossible Polymath':Pathfinder2E.FEATURES['Impossible Polymath'],
  'Fatal Aria':Pathfinder2E.FEATURES['Fatal Aria'],
  'Perfect Encore':Pathfinder2E.FEATURES['Perfect Encore'],
  'Pied Piping':'Section=magic Note="Knows the Pied Piping occult spell"',
  'Symphony Of The Muse':Pathfinder2E.FEATURES['Symphony Of The Muse'],
  'Ultimate Polymath':'Section=magic Note="All spells are signature spells"',

  /*
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
  */
  'Armor Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"Benefits from the specialization effects of medium and heavy armor"',
  /*
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
  */
  'Shield Block':Pathfinder2E.FEATURES['Shield Block'],
  /*
  'The Tenets Of Good':
    'Section=feature ' +
    'Note="May not commit anathema or evil acts, harm innocents, or allow harm to come to innocents through inaction"',
  */
  'Weapon Expertise':
    'Section=combat Note="Attack Expert (%V; Unarmed Attacks)"',
  'Weapon Mastery':Pathfinder2E.FEATURES['Weapon Mastery'],
  /*
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
*/
  'Shield Warden':
    'Section=combat Note="Can use Shield Block to protect an adjacent ally"',
/*
  'Smite Evil':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Blade ally inflicts +4 HP good, or +6 HP with master proficiency, vs. a chosen target for 1 rd, extended as long as the target attacks an ally"',
  'Greater Mercy':
    'Section=magic ' +
    'Note="Subsequent <i>Lay On Hands</i> can also attempt to counteract blinded, deafened, sickened, or slowed"',
  'Heal Mount':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> cast on mount restores 10 HP + 10 HP per heightened level"',
*/
  'Quick Shield Block':
    'Section=combat ' +
    'Note="Can use an additional Reaction for a Shield Block once per turn"',
/*
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
*/

  // Cleric
  'Anathema':Pathfinder2E.FEATURES.Anathema,
  'Cleric Feats':Pathfinder2E.FEATURES['Cleric Feats'],
  'Cleric Skills':Pathfinder2E.FEATURES['Cleric Skills'],
  'Cleric Spellcasting':Pathfinder2E.FEATURES['Divine Spellcasting'],
  'Cloistered Cleric':Pathfinder2E.FEATURES['Cloistered Cleric'],
  'Deity':Pathfinder2E.FEATURES.Deity,
  'Divine Defense':Pathfinder2E.FEATURES['Divine Defense'],
  'Divine Font':Pathfinder2E.FEATURES['Divine Font'],
  'Doctrine':Pathfinder2E.FEATURES.Doctrine,
  'Harmful Font':
    Pathfinder2E.FEATURES['Harmful Font']
    .replace(/{.*}/, '{level<5?4:level<15?5:6}'),
  'Healing Font':
    Pathfinder2E.FEATURES['Healing Font']
    .replace(/{.*}/, '{level<5?4:level<15?5:6}'),
  'Miraculous Spell':Pathfinder2E.FEATURES['Miraculous Spell'],
  // Perception Expertise as above
  // Reflex Expertise as above
  // TODO Figure which programatically
  'Resolute Faith':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Sanctification':
    'Section=feature ' +
    'Note="%{deitySanctification==\'Either\'?\'1 selection\':deitySanctification==\'Holy\'?\'Has the Holy trait\':\'Has the Unholy trait\'}"',
  'Warpriest':Pathfinder2E.FEATURES.Warpriest
    .replace('Simple Weapons', 'Simple Weapons; Martial Weapons')
    .replace('",', '%{level>=19?\'/Attack Master (%1)\':\'\'}",'),
  // Weapon Specialization as above


  'Deadly Simplicity':Pathfinder2E.FEATURES['Deadly Simplicity'],
  // Changed effects
  'Divine Castigation':
    'Section=magic ' +
    'Note="Can add holy or unholy train to <i>Harm</i> and <i>Heal</i> spells"',
  'Domain Initiate (Air)':Pathfinder2E.FEATURES['Domain Initiate (Air)'],
  'Domain Initiate (Ambition)':
    Pathfinder2E.FEATURES['Domain Initiate (Ambition)']
    .replace('Blind', 'Ignite'),
  'Domain Initiate (Cities)':Pathfinder2E.FEATURES['Domain Initiate (Cities)'],
  'Domain Initiate (Confidence)':
    Pathfinder2E.FEATURES['Domain Initiate (Confidence)'],
  'Domain Initiate (Creation)':
    Pathfinder2E.FEATURES['Domain Initiate (Creation)']
    .replace('Splash Of Art', 'Creative Splash'),
  'Domain Initiate (Darkness)':
    Pathfinder2E.FEATURES['Domain Initiate (Darkness)'],
  'Domain Initiate (Death)':Pathfinder2E.FEATURES['Domain Initiate (Death)'],
  'Domain Initiate (Destruction)':
    Pathfinder2E.FEATURES['Domain Initiate (Destruction)'],
  'Domain Initiate (Dreams)':Pathfinder2E.FEATURES['Domain Initiate (Dreams)'],
  'Domain Initiate (Earth)':
    Pathfinder2E.FEATURES['Domain Initiate (Earth)'],
  'Domain Initiate (Family)':Pathfinder2E.FEATURES['Domain Initiate (Family)'],
  'Domain Initiate (Fate)':Pathfinder2E.FEATURES['Domain Initiate (Fate)'],
  'Domain Initiate (Fire)':Pathfinder2E.FEATURES['Domain Initiate (Fire)'],
  'Domain Initiate (Freedom)':
    Pathfinder2E.FEATURES['Domain Initiate (Freedom)'],
  'Domain Initiate (Healing)':
    Pathfinder2E.FEATURES['Domain Initiate (Healing)'],
  'Domain Initiate (Indulgence)':
    Pathfinder2E.FEATURES['Domain Initiate (Indulgence)'],
  'Domain Initiate (Luck)':Pathfinder2E.FEATURES['Domain Initiate (Luck)'],
  'Domain Initiate (Magic)':Pathfinder2E.FEATURES['Domain Initiate (Magic)'],
  'Domain Initiate (Might)':Pathfinder2E.FEATURES['Domain Initiate (Might)'],
  'Domain Initiate (Moon)':Pathfinder2E.FEATURES['Domain Initiate (Moon)'],
  'Domain Initiate (Nature)':Pathfinder2E.FEATURES['Domain Initiate (Nature)'],
  'Domain Initiate (Nightmares)':
    Pathfinder2E.FEATURES['Domain Initiate (Nightmares)'],
  'Domain Initiate (Pain)':Pathfinder2E.FEATURES['Domain Initiate (Pain)'],
  'Domain Initiate (Passion)':
    Pathfinder2E.FEATURES['Domain Initiate (Passion)'],
  'Domain Initiate (Perfection)':
    Pathfinder2E.FEATURES['Domain Initiate (Perfection)'],
  'Domain Initiate (Protection)':
    Pathfinder2E.FEATURES['Domain Initiate (Protection)'],
  'Domain Initiate (Secrecy)':
    Pathfinder2E.FEATURES['Domain Initiate (Secrecy)']
    .replace('Forced', 'Whispering'),
  'Domain Initiate (Sun)':Pathfinder2E.FEATURES['Domain Initiate (Sun)'],
  'Domain Initiate (Travel)':Pathfinder2E.FEATURES['Domain Initiate (Travel)'],
  'Domain Initiate (Trickery)':
    Pathfinder2E.FEATURES['Domain Initiate (Trickery)'],
  'Domain Initiate (Truth)':Pathfinder2E.FEATURES['Domain Initiate (Truth)'],
  'Domain Initiate (Tyranny)':
    Pathfinder2E.FEATURES['Domain Initiate (Tyranny)'],
  'Domain Initiate (Undeath)':
    Pathfinder2E.FEATURES['Domain Initiate (Undeath)'],
  'Domain Initiate (Water)':Pathfinder2E.FEATURES['Domain Initiate (Water)'],
  'Domain Initiate (Wealth)':Pathfinder2E.FEATURES['Domain Initiate (Wealth)'],
  'Domain Initiate (Zeal)':Pathfinder2E.FEATURES['Domain Initiate (Zeal)'],
  'Harming Hands':Pathfinder2E.FEATURES['Harming Hands'],
  'Healing Hands':Pathfinder2E.FEATURES['Healing Hands'],
  'Premonition Of Avoidance':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Gives +2 on save vs. triggering hazard"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    Pathfinder2E.FEATURES['Deadly Simplicity'].replace('self', 'another'),
  'Emblazon Armament':Pathfinder2E.FEATURES['Emblazon Armament'],
  // Changed effects from Turn Undead
  'Panic The Dead':
    'Section=magic ' +
    'Note="<i>Heal</i> also inflicts frightened 1 on undead (save negates); critical failure also inflicts fleeing for 1 rd"',
  'Rapid Response':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="+10 Speed to Stride toward an ally reduced to 0 Hit Points"',
  'Sap Life':Pathfinder2E.FEATURES['Sap Life'],
  'Versatile Font':Pathfinder2E.FEATURES['Versatile Font'],
  "Warpriest's Armor":
    'Section=combat,combat ' +
    'Note=' +
      '"Defense %V (Heavy Armor)",' +
      '"Treats armor of 2 Bulk or higher as 1 Bulk lighter"',
  'Channel Smite':Pathfinder2E.FEATURES['Channel Smite'],
  'Directed Channel':Pathfinder2E.FEATURES['Directed Channel'],
  // Changed effects from Necrotic Infusion
  'Divine Infusion':
    'Section=magic ' +
    'Note="Target of <i>Harm</i> or <i>Heal</i> inflicts +1d6 HP (+2d6 HP or +3d6 HP if cast at 5th or 8th rank) for 1 turn"',
  'Raise Symbol':
    'Action=1 ' +
    'Section=save ' +
    'Note="Gives +2 saves, and successes vs. vitality and void are critical successes, for 1 rd"',
  'Restorative Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike (+1 with %{deityWeaponLowered} after healing self restores save number of Hit Points to another willing creature"',
  'Sacred Ground':
    'Section=magic ' +
    'Note="1 min prayer creates a 30 min burst that restores %{level} HP to creatures who remain in the area for 10 min"',
  'Cast Down':Pathfinder2E.FEATURES['Cast Down'],
  'Divine Rebuttal':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful Strike with %{deityWeaponLowered} give allies +2 vs. triggering magic effect"',
  // Changed effects
  'Divine Weapon':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Using a divine spell slot causes a wielded weapon to inflict +1d4 HP spirit, or +2d4 HP vs. opposed holy or unholy creatures, for the remainder of the turn once per turn"',
  'Magic Hands':
    'Section=skill ' +
    'Note="Successful Medicine to Treat Wounds restores d10s +%{level} HP"',
  'Selective Energy':
    Pathfinder2E.FEATURES['Selective Energy']
    .replace(/%{.*}/, 5),
  // Steady Spellcasting as above
  'Advanced Domain (Air)':Pathfinder2E.FEATURES['Advanced Domain (Air)'],
  'Advanced Domain (Ambition)':
    Pathfinder2E.FEATURES['Advanced Domain (Ambition)'],
  'Advanced Domain (Cities)':
    Pathfinder2E.FEATURES['Advanced Domain (Cities)']
    .replace('The City', 'Civilization'),
  'Advanced Domain (Confidence)':
    Pathfinder2E.FEATURES['Advanced Domain (Confidence)'],
  'Advanced Domain (Creation)':
    Pathfinder2E.FEATURES['Advanced Domain (Creation)'],
  'Advanced Domain (Darkness)':
    Pathfinder2E.FEATURES['Advanced Domain (Darkness)']
    .replace('Eyes', 'Sight'),
  'Advanced Domain (Death)':Pathfinder2E.FEATURES['Advanced Domain (Death)'],
  'Advanced Domain (Destruction)':
    Pathfinder2E.FEATURES['Advanced Domain (Destruction)'],
  'Advanced Domain (Dreams)':Pathfinder2E.FEATURES['Advanced Domain (Dreams)'],
  'Advanced Domain (Earth)':Pathfinder2E.FEATURES['Advanced Domain (Earth)'],
  'Advanced Domain (Family)':Pathfinder2E.FEATURES['Advanced Domain (Family)'],
  'Advanced Domain (Fate)':Pathfinder2E.FEATURES['Advanced Domain (Fate)'],
  'Advanced Domain (Fire)':Pathfinder2E.FEATURES['Advanced Domain (Fire)'],
  'Advanced Domain (Freedom)':
    Pathfinder2E.FEATURES['Advanced Domain (Freedom)'],
  'Advanced Domain (Healing)':
    Pathfinder2E.FEATURES['Advanced Domain (Healing)'],
  'Advanced Domain (Indulgence)':
    Pathfinder2E.FEATURES['Advanced Domain (Indulgence)'],
  'Advanced Domain (Knowledge)':
    Pathfinder2E.FEATURES['Advanced Domain (Knowledge)'],
  'Advanced Domain (Luck)':Pathfinder2E.FEATURES['Advanced Domain (Luck)'],
  'Advanced Domain (Magic)':Pathfinder2E.FEATURES['Advanced Domain (Magic)'],
  'Advanced Domain (Might)':Pathfinder2E.FEATURES['Advanced Domain (Might)'],
  'Advanced Domain (Moon)':Pathfinder2E.FEATURES['Advanced Domain (Moon)'],
  'Advanced Domain (Nature)':Pathfinder2E.FEATURES['Advanced Domain (Nature)'],
  'Advanced Domain (Nightmares)':
    Pathfinder2E.FEATURES['Advanced Domain (Nightmares)'],
  'Advanced Domain (Pain)':Pathfinder2E.FEATURES['Advanced Domain (Pain)'],
  'Advanced Domain (Passion)':
    Pathfinder2E.FEATURES['Advanced Domain (Passion)'],
  'Advanced Domain (Perfection)':
    Pathfinder2E.FEATURES['Advanced Domain (Perfection)']
    .replace('Form', 'Body'),
  'Advanced Domain (Protection)':
    Pathfinder2E.FEATURES['Advanced Domain (Protection)'],
  'Advanced Domain (Secrecy)':
    Pathfinder2E.FEATURES['Advanced Domain (Secrecy)'],
  'Advanced Domain (Sun)':
    Pathfinder2E.FEATURES['Advanced Domain (Sun)']
    .replace('Positive', 'Vital'),
  'Advanced Domain (Travel)':Pathfinder2E.FEATURES['Advanced Domain (Travel)'],
  'Advanced Domain (Trickery)':
    Pathfinder2E.FEATURES['Advanced Domain (Trickery)'],
  'Advanced Domain (Truth)':Pathfinder2E.FEATURES['Advanced Domain (Truth)'],
  'Advanced Domain (Tyranny)':
    Pathfinder2E.FEATURES['Advanced Domain (Tyranny)'],
  'Advanced Domain (Undeath)':
    Pathfinder2E.FEATURES['Advanced Domain (Undeath)'],
  'Advanced Domain (Water)':Pathfinder2E.FEATURES['Advanced Domain (Water)'],
  'Advanced Domain (Wealth)':Pathfinder2E.FEATURES['Advanced Domain (Wealth)'],
  'Advanced Domain (Zeal)':Pathfinder2E.FEATURES['Advanced Domain (Zeal)'],
  'Cremate Undead':Pathfinder2E.FEATURES['Cremate Undead'],
  'Emblazon Energy':Pathfinder2E.FEATURES['Emblazon Energy'],
  'Martyr':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent healing spell transfers an additional 1d8 HP from self to target"',
  // Changed spell list from Channel Succor
  'Restorative Channel':
    'Section=magic ' +
    'Note="Can cast <i>Cleanse Affliction</i>, <i>Clear Mind</i>, <i>Sound Body</i>, or <i>Sure Footing</i> in place of a prepared <i>Heal</i>"',
  // Changed effects from Align Armament
  'Sanctify Armament':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon gains holy or unholy trait, inflicting +2d6 HP spirit for 1 to opposed creatures"',
  'Surging Focus':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Seeing an ally reduced to 0 HP restores 1 Focus Point to self once per day"',
  'Void Siphon':
    'Section=magic ' +
    'Note="Critical failure vs. self <i>Harm</i> inflicts drained 1"',
  'Zealous Rush':
    'Section=magic ' +
    'Note="Can Stride 10\' while casting a 1-action spell on self, or %{speed}\' for a longer spell"',
  // Changed effects
  'Castigating Weapon':
    'Section=magic ' +
    'Note="Inflicting damage using <i>Harm</i> or <i>Heal</i> with Divine Castigation gives weapons and unarmed Strikes the holy or unholy trait and additional spirit damage equal to the spell level until the end of turn"',
  'Heroic Recovery':
    Pathfinder2E.FEATURES['Heroic Recovery']
    .replace('1 rd', '1 rd and allows the target to stand from prone immediately without triggering Reactions'),
  'Replenishment Of War':Pathfinder2E.FEATURES['Replenishment Of War'],
  'Shared Avoidance':
    'Section=save ' +
    'Note="Premonition Of Avoidance gives allies within 20\' +2 vs. the triggering hazard"',
  'Shield Of Faith':
    'Section=magic Note="Casting a domain spell gives +1 AC for 1 rd"',
  'Defensive Recovery':Pathfinder2E.FEATURES['Defensive Recovery'],
  'Domain Focus':Pathfinder2E.FEATURES['Domain Focus'],
  'Emblazon Antimagic':Pathfinder2E.FEATURES['Emblazon Antimagic'],
  'Fortunate Relief':
    'Section=magic ' +
    'Note="Counteract attempts from healing spells gain the better of two rolls"',
  'Sapping Symbol':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Raised symbol and a successful Religion check when taking melee damage inflicts enfeebled 1 on the attacker, or enfeebled 2 on a critical success, until the attacker moves away"',
  'Shared Replenishment':Pathfinder2E.FEATURES['Shared Replenishment'],
  'Channeling Block':
    'Section=magic ' +
    'Note="Can expend a <i>Harm</i> or <i>Heal</i> with Shield Block to add 1d8 per spell level to the shield\'s Hardness"',
  "Deity's Protection":Pathfinder2E.FEATURES["Deity's Protection"],
  'Ebb And Flow':
    'Section=magic ' +
    'Note="Casting <i>Harm</i> or <i>Heal</i> harms one target and heals another"',
  'Fast Channel':Pathfinder2E.FEATURES['Fast Channel'],
  'Lasting Armament':Pathfinder2E.FEATURES['Extend Armament Alignment'],
  'Premonition Of Clarity':
    'Section=save ' +
    'Note="Rerolls a failed mental save with a +2 bonus once per hour"',
  'Swift Banishment':Pathfinder2E.FEATURES['Swift Banishment'],
  'Eternal Bane':Pathfinder2E.FEATURES['Eternal Bane'],
  'Eternal Blessing':Pathfinder2E.FEATURES['Eternal Blessing'],
  'Rebounding Smite':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Missed Strike using Channel Smite allows retargeting the <i>Harm</i> or <i>Heal</i>"',
  'Remediate':
    'Action=Free ' +
    'Section=magic ' +
    'Note="3-action <i>Harm</i> or <i>Heal</i> attempts to counteract a divine effect"',
  'Resurrectionist':Pathfinder2E.FEATURES.Resurrectionist,
  'Divine Apex':
    'Section=magic ' +
    'Note="Can give a worn magic item the apex trait and increase its divine attribute value by 1 once per daily preparations"',
  'Echoing Channel':Pathfinder2E.FEATURES['Echoing Channel'],
  'Improved Swift Banishment':
    Pathfinder2E.FEATURES['Improved Swift Banishment'],
  'Inviolable':
    'Section=combat ' +
    'Note="Successful attacks on self inflict 3d6 HP spirit, holy, or unholy on attacker"',
  'Miraculous Possibility':
    'Section=magic ' +
    'Note="Can leave a spell slot free during daily prep to later cast any spell 2 levels lower"',
  'Shared Clarity':
    'Section=save ' +
    'Note="Premonition Of Clarity gives allies within 15\' a +2 reroll vs. the triggering mental effect"',
  "Avatar's Audience":Pathfinder2E.FEATURES["Avatar's Audience"],
  "Avatar's Protection":
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Changes a foe critical hit no self to a normal hit and casts <i>Avatar</i>"',
  'Maker Of Miracles':Pathfinder2E.FEATURES['Maker Of Miracles'],
  'Spellshape Channel':
    Pathfinder2E.FEATURES['Metamagic Channel']
    .replace('metamagic', 'spellshape'),

  // Druid

  // Anathema as above
  'Animal':Pathfinder2E.FEATURES.Animal,
  'Druid Feats':Pathfinder2E.FEATURES['Druid Feats'],
  'Druid Skills':Pathfinder2E.FEATURES['Druid Skills'],
  'Druid Spellcasting':Pathfinder2E.FEATURES['Primal Spellcasting'],
  'Druidic Order':Pathfinder2E.FEATURES['Druidic Order'],
  // Expert Spellcaster as above
  // Fortitude Expertise as above
  'Leaf':
    Pathfinder2E.FEATURES.Leaf
    .replace('Goodberry', 'Cornucopia')
    .replace('2', '1'),
  // Legendary Spellcaster as above
  // Master Spellcaster as above
  // Medium Armor Expertise as above
  // Perception Expertise as above
  'Primal Hierophant':Pathfinder2E.FEATURES['Primal Hierophant'],
  // Reflex Expertise as above
  'Storm':Pathfinder2E.FEATURES.Storm,
  'Untamed':
    Pathfinder2E.FEATURES['Wild']
    .replace('Wild Shape', 'Untamed Form')
    .replace('Wild Morph', 'Untamed Shift'),
  // Shield Block as above
  'Voice Of Nature':
    'Section=feature Note="+1 Class Feat (Animal Empathy or Plant Empathy)"',
  // Weapon Expertise as above
  // Weapon Specialization as above
  'Wild Willpower':Pathfinder2E.FEATURES.Resolve,
  'Wildsong':Pathfinder2E.FEATURES['Druidic Language'],

  'Animal Companion':Pathfinder2E.FEATURES['Animal Companion'],
/* TODO Check to see if this is identical
    'Section=feature ' +
    'Note="Has a young animal companion%{$\'features.Hunt Prey\'?\' that gains Hunt Prey\'+($\'features.Masterful Companion\'?\' and Flurry, Precision, and Outwit\':\'\')+\' effects\':\'\'}"',
*/
  'Animal Empathy':
    Pathfinder2E.FEATURES['Wild Empathy']
    .replace('Class,', 'Class,Druid'),
  'Leshy Familiar':Pathfinder2E.FEATURES['Leshy Familiar'],
  'Plant Empathy':Pathfinder2E.FEATURES['Green Empathy'],
  // Reach Spell as above
  'Storm Born':Pathfinder2E.FEATURES['Storm Born'],
  'Verdant Weapon':
    'Section=magic ' +
    'Note="10 min process prepares a seed to grow into a weapon with 1 action"',
  'Widen Spell':Pathfinder2E.FEATURES['Widen Spell'],
  'Untamed Form':
    Pathfinder2E.FEATURES['Wild Shape'].replace('Wild Shape', 'Untamed Form'),
  'Call Of The Wild':
    Pathfinder2E.FEATURES['Call Of The Wild'].replace('level', 'rank'),
  'Enhanced Familiar':Pathfinder2E.FEATURES['Enhanced Familiar'],
  'Order Explorer (Animal)':Pathfinder2E.FEATURES['Order Explorer (Animal)'],
  'Order Explorer (Leaf)':Pathfinder2E.FEATURES['Order Explorer (Leaf)'],
  'Order Explorer (Storm)':Pathfinder2E.FEATURES['Order Explorer (Storm)'],
  'Order Explorer (Untamed)':
    Pathfinder2E.FEATURES['Order Explorer (Wild)'].replace('Wild', 'Untamed'),
  // Poison Resistance as above
  'Anthropomorphic Shape':
     Pathfinder2E.FEATURES['Thousand Faces']
     .replace('Wild Shape', 'Untamed Form'),
  'Thousand Faces':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Small or Medium humanoid"',
  'Elemental Summons':
    'Section=magic ' +
    'Note="10 min process in nature replaces a prepared spell slot with <i>Summon Elemental</i>"',
  'Forest Passage':Pathfinder2E.FEATURES['Woodland Stride'],
  'Form Control':Pathfinder2E.FEATURES['Form Control'],
  'Leshy Familiar Secrets':
    'Section=feature ' +
    'Note="Familiar gains Grasping Tendrils, Purify Air, or Verdant Burst feature each day"',
  'Mature Animal Companion':Pathfinder2E.FEATURES['Mature Animal Companion'],
  'Order Magic (Animal)':Pathfinder2E.FEATURES['Order Magic (Animal)'],
  'Order Magic (Leaf)':
    Pathfinder2E.FEATURES['Order Magic (Leaf)']
    .replace('Goodberry', 'Cornucopia'),
  'Order Magic (Storm)':Pathfinder2E.FEATURES['Order Magic (Storm)'],
  'Order Magic (Untamed)':
    Pathfinder2E.FEATURES['Order Magic (Wild)']
    .replace('Wild Shape', 'Untamed Shift'),
  'Snowdrift Spell':
    'Section=magic ' +
    'Note="Subsequent air, water, or cold spell creates difficult terrain underneath 1 affected creature for 1 rd"',
  'Current Spell':
    'Section=magic ' +
    'Note="Subsequent air or water spell gives self +1 Armor Class (+2 vs. ranged attacks) and +1 saves vs. air and water for 1 rd"',
  'Grown Of Oak':
    'Section=magic ' +
    'Note="Can cast <i>Oaken Resilience</i> up to level %V at will on self and leshy familiar within 30\'"',
  'Insect Shape':Pathfinder2E.FEATURES['Insect Shape'],
  'Instinctive Support':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Casting a non-cantrip spell on companion allows it to Support and take its actions"',
  // Steady Spellcasting as above
  'Storm Retribution':Pathfinder2E.FEATURES['Storm Retribution'],
  'Deimatic Display':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Makes a Demoralize attempt against animals, fungii, and plants in a 15\' cone"',
  'Ferocious Shape':
    Pathfinder2E.FEATURES['Ferocious Shape']
    .replace('Wild Shape', 'Untamed Form'),
  // Changed spell list
  'Fey Caller':
    'Section=magic ' +
    'Note="Knows the Illusory Disguise, Illusory Object, and Illusory Scene primal spells"',
  'Floral Restoration':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Draws on 15\' sq of plant life to regain %{(level+1)//2>?4}d8 HP and 1 Focus Point once per day"',
  'Incredible Companion':Pathfinder2E.FEATURES['Incredible Companion'],
  'Raise Menhir':
    'Action=2 ' +
    'Section=magic ' +
    'Note="R30\' 15\' radius gives creatures +2 saves vs. choice of arcane, divine, or occult effects while sustained up to 1 min"',
  'Soaring Shape':
    Pathfinder2E.FEATURES['Soaring Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Wind Caller':Pathfinder2E.FEATURES['Wind Caller'],
  'Elemental Shape':
    Pathfinder2E.FEATURES['Elemental Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Healing Transformation':
    Pathfinder2E.FEATURES['Healing Transformation']
    .replace('level', 'rank'),
  'Overwhelming Energy':Pathfinder2E.FEATURES['Overwhelming Energy'],
  'Plant Shape':
    Pathfinder2E.FEATURES['Plant Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Primal Howl':
    'Section=feature ' +
    'Note="Companion can use 2 actions to inflict 1d6 HP sonic per 2 levels and frightened 1 in a 30\' cone once per hour (<b>save basic Fortitude</b> also negates frightened; critical failure inflicts frightened 2)"',
  'Pristine Weapon':
    'Section=combat ' +
    'Note="Verdant weapon counts as cold iron and silver, inflicting 1d6 HP persistent bleed to creatures with weakness to either"',
  'Side By Side':Pathfinder2E.FEATURES['Side By Side'],
  'Thunderclap Spell':
    'Section=magic ' +
    'Note="Subsequent instantaneous electricity spell also inflicts deafened for 1 rd (<b>save Reflex</b> negates; critical failure also knocks prone)"',
  'Dragon Shape':
    Pathfinder2E.FEATURES['Dragon Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Garland Spell':
    'Section=magic ' +
    'Note="Subsequent fungus or plant spell grows plants in a 10\' burst that inflict difficult terrain and %{level//4-1}d6 HP piercing or poison for 1 min"',
  'Primal Focus':Pathfinder2E.FEATURES['Primal Focus'].replace('2', 'all'),
  'Primal Summons':Pathfinder2E.FEATURES['Primal Summons'],
  'Wandering Oasis':
    'Section=save ' +
    'Note="Self and allies within 60\' are protected from %{rank.Survival>=4?\'extreme\':\'severe\'} environmental heat and cold"',
  'Reactive Transformation':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Invokes Aerial Form, Dragon Form, Elemental Form, or Plant form in response to falling, energy damage, fire damage, or poison damage"',
  'Sow Seed':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Prepares a subsequent 1- or 2-action spell to take effect in an adjacent square when a creature enters or is adjacent to it within 10 min"',
  'Specialized Companion':Pathfinder2E.FEATURES['Specialized Companion'],
  'Timeless Nature':Pathfinder2E.FEATURES['Timeless Nature'],
  'Verdant Metamorphosis':
    Pathfinder2E.FEATURES['Verdant Metamorphosis']
    .replace('Tree Shape', 'One With Plants'),
  // Effortless Concentration as above
  'Impaling Briars':Pathfinder2E.FEATURES['Impaling Briars'],
  'Monstrosity Shape':
    Pathfinder2E.FEATURES['Monstrosity Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Uplifting Winds':
    'Section=magic ' +
    'Note="Casting an air or electricity spell while flying gives +10\' fly Speed and an immediate %{speed//2}\' Fly action"',
  'Invoke Disaster':Pathfinder2E.FEATURES['Invoke Disaster'],
  'Perfect Form Control':Pathfinder2E.FEATURES['Perfect Form Control'],
  'Primal Aegis':
    'Section=save ' +
    'Note="Self and allies within 30\' have resistance %{wisdomModifier} to acid, cold, fire, vitality, and void damage"',
  "Hierophant's Power":Pathfinder2E.FEATURES["Hierophant's Power"],
  'Ley Line Conduit':Pathfinder2E.FEATURES['Leyline Conduit'],
  'True Shapeshifter':Pathfinder2E.FEATURES['True Shapeshifter'],

  // Fighter
  // Armor Expertise as above
  // Armor Mastery as above
  'Battle Hardened':Pathfinder2E.FEATURES.Juggernaut,
  'Battlefield Surveyor':Pathfinder2E.FEATURES['Battlefield Surveyor'],
  'Bravery':Pathfinder2E.FEATURES.Bravery,
  'Combat Flexibility':Pathfinder2E.FEATURES['Combat Flexibility'],
  'Fighter Expertise':Pathfinder2E.FEATURES['Fighter Expertise'],
  'Fighter Feats':Pathfinder2E.FEATURES['Fighter Feats'],
  'Fighter Key Attribute':Pathfinder2E.FEATURES['Fighter Key Ability'],
  'Fighter Skills':Pathfinder2E.FEATURES['Fighter Skills'],
  'Fighter Weapon Mastery':Pathfinder2E.FEATURES['Fighter Weapon Mastery'],
  // Greater Weapon Specialization as above
  'Improved Flexibility':Pathfinder2E.FEATURES['Improved Flexibility'],
  // Reactive Strike as above
  // Shield Block as above
  'Tempered Reflexes':Pathfinder2E.FEATURES.Evasion,
  'Versatile Legend':Pathfinder2E.FEATURES['Versatile Legend'],
  'Weapon Legend':Pathfinder2E.FEATURES['Weapon Legend'],
  // Weapon Specialization as above

  'Combat Assessment':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Melee Strike allows an immediate Recall Knowledge about the target; a critical hit gives a +2 bonus"',
  'Double Slice':Pathfinder2E.FEATURES['Double Slice'],
  'Exacting Strike':Pathfinder2E.FEATURES['Exacting Strike'],
  'Point Blank Stance':Pathfinder2E.FEATURES['Point-Blank Shot'],
  'Reactive Shield':Pathfinder2E.FEATURES['Reactive Shield'],
  'Snagging Strike':
    Pathfinder2E.FEATURES['Snagging Strike']
    .replace('flat-footed', 'off-guard'),
  // Sudden Charge as above
  'Vicious Swing':Pathfinder2E.FEATURES['Power Attack'],
  'Aggressive Block':
    Pathfinder2E.FEATURES['Aggressive Block']
    .replace('flat-footed', 'off-guard') + ' Action=Reaction',
  'Assisting Shot':Pathfinder2E.FEATURES['Assisting Shot'],
  'Blade Break':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Negates the triggering forced move of less than 20\', or reduces a longer forced move to 5\'"',
  'Brutish Shove':
    Pathfinder2E.FEATURES['Brutish Shove']
    .replace('flat-footed', 'off-guard'),
  'Combat Grab':Pathfinder2E.FEATURES['Combat Grab'],
  'Dueling Parry':Pathfinder2E.FEATURES['Dueling Parry'],
  'Intimidating Strike':Pathfinder2E.FEATURES['Intimidating Strike'],
  'Lightning Swap':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stows held objects and draws two weapons or a shield and a weapon"',
  'Lunge':Pathfinder2E.FEATURES.Lunge,
  'Rebounding Toss':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Thrown weapon makes a second Strike against a second target within 10\' of the first"',
  'Sleek Reposition':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Melee Strike with a finesse or polearm weapon automatically Repositions target, or inflicts off-guard until the end of turn on failure"',
  'Barreling Charge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Athletics vs. Fortitude allows moving through foes\' spaces to make a melee Strike"',
  'Double Shot':Pathfinder2E.FEATURES['Double Shot'],
  'Dual-Handed Assault':Pathfinder2E.FEATURES['Dual-Handed Assault'],
  'Parting Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Steps away from foe, making it off-guard for a ranged Strike"',
  'Powerful Shove':Pathfinder2E.FEATURES['Powerful Shove'],
  'Quick Reversal':Pathfinder2E.FEATURES['Quick Reversal'],
  'Shielded Stride':Pathfinder2E.FEATURES['Shielded Stride'],
  'Slam Down':Pathfinder2E.FEATURES.Knockdown,
  // Swipe as above
  'Twin Parry':Pathfinder2E.FEATURES['Twin Parry'],
  'Advanced Weapon Training':Pathfinder2E.FEATURES['Advanced Weapon Training'],
  'Advantageous Assault':Pathfinder2E.FEATURES['Advantageous Assault'],
  'Dazing Blow':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Melee Strike against a grabbed foe inflicts bludgeoning damage and stunned 2 (<b>save Fortitude</b> inflicts stunned 1; critical success negates stunning; critical failure inflicts stunned 3)"',
  'Disarming Stance':Pathfinder2E.FEATURES['Disarming Stance'],
  'Furious Focus':
    Pathfinder2E.FEATURES['Furious Focus']
    .replace('Power Attack', 'Vicious Swing'),
  "Guardian's Deflection":Pathfinder2E.FEATURES["Guardian's Deflection"],
  'Reflexive Shield':Pathfinder2E.FEATURES['Reflexive Shield'],
  'Revealing Stab':Pathfinder2E.FEATURES['Revealing Stab'],
  'Ricochet Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance causes thrown weapons to return up to their listed range increment after a ranged Strike"',
  'Shatter Defenses':
    Pathfinder2E.FEATURES['Shatter Defenses']
    .replace('flat-footed', 'off-guard'),
  // Shield Warden as above
  'Triple Shot':Pathfinder2E.FEATURES['Triple Shot'],
  'Blind-Fight':Pathfinder2E.FEATURES['Blind-Fight'],
  'Disorienting Opening':
    'Section=combat ' +
    'Note="Successful Reactive Strike inflicts off-guard for 1 rd"',
  'Dueling Riposte':Pathfinder2E.FEATURES['Dueling Riposte'],
  'Felling Strike':Pathfinder2E.FEATURES['Felling Strike'],
  'Incredible Aim':Pathfinder2E.FEATURES['Incredible Aim'],
  'Mobile Shot Stance':
    Pathfinder2E.FEATURES['Mobile Shot Stance']
    .replace('Attack Of Opportunity', 'Reactive Strike'),
  'Positioning Assault':
    Pathfinder2E.FEATURES['Positioning Assault']
    .replace(' to within reach', ''),
  // Quick Shield Block as above
  'Resounding Bravery':
    'Section=save ' +
    'Note="Will saves give +1 saves and %{level//2} temporary Hit Points, or +2 saves and %{level} temporary on a critical success, for 1 min"',
  // Sudden Leap as above
  'Agile Grace':Pathfinder2E.FEATURES['Agile Grace'],
  'Certain Strike':Pathfinder2E.FEATURES['Certain Strike'],
  'Crashing Slam':
    Pathfinder2E.FEATURES['Improved Knockdown']
    .replace('Knockdown', 'Slam Down'),
  'Cut From The Air':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives +4 AC vs. the triggering ranged attack"',
  'Debilitating Shot':Pathfinder2E.FEATURES['Debilitating Shot'],
  'Disarming Twist':
    Pathfinder2E.FEATURES['Disarming Twist']
    .replace('flat-footed', 'off-guard'),
  'Disruptive Stance':
    Pathfinder2E.FEATURES['Disruptive Stance']
    .replace('Attack Of Opportunity', 'Reactive Strike'),
  'Fearsome Brute':Pathfinder2E.FEATURES['Fearsome Brute'],
  'Flinging Charge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Hit with a thrown Strike during a double Stride inflicts off-guard against next attack in the same turn"',
  'Mirror Shield':Pathfinder2E.FEATURES['Mirror Shield'],
  'Overpowering Charge':
    'Section=combat ' +
    'Note="Barreling Charge inflicts %{strengthModifier} HP bludgeoning, or %{strengthModifier*2} HP and off-guard for 1 rd on a critical hit"',
  'Tactical Reflexes':
    Pathfinder2E.FEATURES['Combat Reflexes']
    .replace('Attack Of Opportunity', 'Reactive Strike'),
  'Twin Riposte':Pathfinder2E.FEATURES['Twin Riposte'],
  'Brutal Finish':Pathfinder2E.FEATURES['Brutal Finish'],
  'Dashing Strike':Pathfinder2E.FEATURES['Spring Attack'],
  'Dueling Dance':Pathfinder2E.FEATURES['Dueling Dance'],
  'Flinging Shove':
    Pathfinder2E.FEATURES['Flinging Shove']
    .replace('flat-footed', 'off-guard'),
  'Improved Dueling Riposte':Pathfinder2E.FEATURES['Improved Dueling Riposte'],
  'Incredible Ricochet':Pathfinder2E.FEATURES['Incredible Ricochet'],
  'Lunging Stance':
    Pathfinder2E.FEATURES['Lunging Stance']
    .replace('Attacks Of Opportunity', 'Reactive Strikes'),
  "Paragon's Guard":Pathfinder2E.FEATURES["Paragon's Guard"],
  'Desperate Finisher':Pathfinder2E.FEATURES['Desperate Finisher'],
  'Determination':Pathfinder2E.FEATURES.Determination,
  'Guiding Finish':
    Pathfinder2E.FEATURES['Guiding Finish']
    .replace(' to a spot within reach', ''),
  'Guiding Riposte':
    Pathfinder2E.FEATURES['Guiding Riposte']
    .replace(' to a spot within reach', ''),
  'Improved Twin Riposte':Pathfinder2E.FEATURES['Improved Twin Riposte'],
  'Opening Stance':Pathfinder2E.FEATURES['Stance Savant'],
  'Two-Weapon Flurry':Pathfinder2E.FEATURES['Two-Weapon Flurry'],
  // Whirlwind Strike as above
  'Graceful Poise':Pathfinder2E.FEATURES['Graceful Poise'],
  'Improved Reflexive Shield':
    Pathfinder2E.FEATURES['Improved Reflexive Shield'],
  'Master Of Many Styles':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Enters a stance at the beginning of a turn"',
  'Multishot Stance':Pathfinder2E.FEATURES['Multishot Stance'],
  'Overwhelming Blow':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Melee Strike hit automatically counts critical, and a natural critical gains deadly d12, leaving self stunned 1 and off-guard for 1 rd"',
  'Twinned Defense':Pathfinder2E.FEATURES['Twinned Defense'],
  'Impossible Volley':Pathfinder2E.FEATURES['Impossible Volley'],
  'Savage Critical':Pathfinder2E.FEATURES['Savage Critical'],
  'Smash From The Air':
    'Section=combat ' +
    'Note="Can use Cut From The Air against ranged spell attacks"',
  'Boundless Reprisals':Pathfinder2E.FEATURES['Boundless Reprisals'],
  'Ultimate Flexibility':
    'Section=combat ' +
    'Note="Can select a fighter feat of up to 18th level to use each day and use 1 hr training to change flexibility feats"',
  'Weapon Supremacy':Pathfinder2E.FEATURES['Weapon Supremacy'],

  /*
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
  */


  // Ranger
  'Flurry':Pathfinder2E.FEATURES.Flurry,
  'Greater Natural Reflexes':Pathfinder2E.FEATURES['Improved Evasion'],
  // Greater Weapon Specialization as above
  'Hunt Prey':Pathfinder2E.FEATURES['Hunt Prey'],
  "Hunter's Edge":Pathfinder2E.FEATURES["Hunter's Edge"],
  'Martial Weapon Mastery':Pathfinder2E.FEATURES['Weapon Mastery'],
  'Masterful Hunter':Pathfinder2E.FEATURES['Masterful Hunter'],
  // Medium Armor Expertise as above
  // Medium Armor Mastery as above
  'Natural Reflexes':Pathfinder2E.FEATURES.Evasion,
  "Nature's Edge":
    Pathfinder2E.FEATURES["Nature's Edge"]
    .replace(' natural and snare-imposed', ''),
  'Outwit':Pathfinder2E.FEATURES.Outwit,
  'Perception Legend':Pathfinder2E.FEATURES['Incredible Senses'],
  'Perception Mastery':Pathfinder2E.FEATURES['Vigilant Senses'],
  'Precision':Pathfinder2E.FEATURES.Precision,
  'Ranger Expertise':Pathfinder2E.FEATURES['Ranger Expertise'],
  'Ranger Feats':Pathfinder2E.FEATURES['Ranger Feats'],
  'Ranger Key Attribute':Pathfinder2E.FEATURES['Ranger Key Ability'],
  'Ranger Skills':Pathfinder2E.FEATURES['Ranger Skills'],
  'Ranger Weapon Expertise':Pathfinder2E.FEATURES['Ranger Weapon Expertise'],
  'Swift Prey':Pathfinder2E.FEATURES['Swift Prey'],
  'Trackless Journey':Pathfinder2E.FEATURES['Trackless Step'],
  'Unimpeded Journey':Pathfinder2E.FEATURES['Wild Stride'],
  // Weapon Specialization as above
  "Warden's Endurance":Pathfinder2E.FEATURES.Juggernaut,
  'Will Expertise':Pathfinder2E.FEATURES['Iron Will'],

  // Animal Companion as above
  // Changed effects
  'Crossbow Ace':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Uses Create A Diversion or Take Cover, then Interact to reload a crossbow"',
  'Hunted Shot':
    Pathfinder2E.FEATURES['Hunted Shot']
    .replace(' once per rd', ''),
  'Initiate Warden':
    'Section=magic ' +
    'Note="Knows choice of warden spell/Has a focus pool with at least 1 Focus Point"',
  'Monster Hunter':Pathfinder2E.FEATURES['Monster Hunter'],
  'Twin Takedown':
    Pathfinder2E.FEATURES['Twin Takedown']
    .replace(' once per rd', ''),
  // Animal Empathy as above
  'Favored Terrain (Aquatic)':
    Pathfinder2E.FEATURES['Favored Terrain (Aquatic)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Arctic)':
    Pathfinder2E.FEATURES['Favored Terrain (Arctic)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Desert)':
    Pathfinder2E.FEATURES['Favored Terrain (Desert)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Forest)':
    Pathfinder2E.FEATURES['Favored Terrain (Forest)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Mountain)':
    Pathfinder2E.FEATURES['Favored Terrain (Mountain)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Plains)':
    Pathfinder2E.FEATURES['Favored Terrain (Plains)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Sky)':
    Pathfinder2E.FEATURES['Favored Terrain (Sky)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Swamp)':
    Pathfinder2E.FEATURES['Favored Terrain (Swamp)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  'Favored Terrain (Underground)':
    Pathfinder2E.FEATURES['Favored Terrain (Underground)']
    .replace('Wild Stride', 'Unimpeded Journey'),
  "Hunter's Aim":Pathfinder2E.FEATURES["Hunter's Aim"],
  'Monster Warden':Pathfinder2E.FEATURES['Monster Warden'],
  'Quick Draw':Pathfinder2E.FEATURES['Quick Draw'],
  'Advanced Warden':
    'Section=magic ' +
    'Note="Knows choice of advanced warden spell/+1 Focus Points"',
  "Companion's Cry":Pathfinder2E.FEATURES["Companion's Cry"],
  'Disrupt Prey':Pathfinder2E.FEATURES['Disrupt Prey'],
  'Far Shot':Pathfinder2E.FEATURES['Far Shot'],
  'Favored Prey':Pathfinder2E.FEATURES['Favored Enemy'],
  'Running Reload':Pathfinder2E.FEATURES['Running Reload'],
  "Scout's Warning":Pathfinder2E.FEATURES["Scout's Warning"],
  // Twin Parry as above
  'Additional Recollection':
    'Section=skill ' +
    'Note="Successful Recall Knowledge on hunted prey gives a Recall Knowledge check on another creature"',
  'Masterful Warden':
    'Section=magic Note="Knows choice of warden spell/+1 Focus Points"',
  // Mature Animal Companion as above
  'Skirmish Strike':Pathfinder2E.FEATURES['Skirmish Strike'],
  'Snap Shot':Pathfinder2E.FEATURES['Snap Shot'],
  'Swift Tracker':Pathfinder2E.FEATURES['Swift Tracker'],
  // Blind-Fight as above
  'Deadly Aim':Pathfinder2E.FEATURES['Deadly Aim'],
  'Hazard Finder':Pathfinder2E.FEATURES['Hazard Finder'],
  'Terrain Master':Pathfinder2E.FEATURES['Terrain Master'],
  "Warden's Boon":Pathfinder2E.FEATURES["Warden's Boon"],
  'Camouflage':Pathfinder2E.FEATURES.Camouflage,
  // Incredible Companion as above
  'Master Monster Hunter':Pathfinder2E.FEATURES['Master Monster Hunter'],
  'Peerless Warden':
    'Section=magic ' +
    'Note="Knows choice of peerless warden spell/+1 Focus Points"',
  'Penetrating Shot':Pathfinder2E.FEATURES['Penetrating Shot'],
  // Twin Riposte as above
  "Warden's Step":Pathfinder2E.FEATURES["Warden's Step"],
  'Distracting Shot':
    Pathfinder2E.FEATURES['Distracting Shot']
    .replace('flat-footed', 'off-guard'),
  'Double Prey':Pathfinder2E.FEATURES['Double Prey'],
  'Second Sting':Pathfinder2E.FEATURES['Second Sting'],
  // Side By Side as above
  "Warden's Focus":'Section=magic Note="Refocus restores all focus points"',
  'Sense The Unseen':Pathfinder2E.FEATURES['Sense The Unseen'],
  'Shared Prey':Pathfinder2E.FEATURES['Shared Prey'],
  'Stealthy Companion':Pathfinder2E.FEATURES['Stealthy Companion'],
  "Warden's Guidance":Pathfinder2E.FEATURES["Warden's Guidance"],
  'Greater Distracting Shot':
    Pathfinder2E.FEATURES['Greater Distracting Shot']
    .replace('flat-footed', 'off-guard'),
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':Pathfinder2E.FEATURES['Legendary Monster Hunter'],
  // Specialized Companion as above
  "Warden's Reload":
    'Action=Free ' +
    'Section=combat ' +
    'Note="Casting a warden spell allows reloading a crossbow"',
  'Impossible Flurry':Pathfinder2E.FEATURES['Impossible Flurry'],
  // Impossible Volley as above
  'Manifold Edge':Pathfinder2E.FEATURES['Manifold Edge'],
  'Masterful Companion':Pathfinder2E.FEATURES['Masterful Companion'],
  'Perfect Shot':Pathfinder2E.FEATURES['Perfect Shot'],
  'Shadow Hunter':Pathfinder2E.FEATURES['Shadow Hunter'],
  'Legendary Shot':Pathfinder2E.FEATURES['Legendary Shot'],
  'To The Ends Of The Earth':Pathfinder2E.FEATURES['To The Ends Of The Earth'],
  'Triple Threat':Pathfinder2E.FEATURES['Triple Threat'],
  'Ultimate Skirmisher':Pathfinder2E.FEATURES['Ultimate Skirmisher'],

  // Rogue
  'Agile Mind':Pathfinder2E.FEATURES['Slippery Mind'],
  'Debilitating Strike':
    Pathfinder2E.FEATURES['Debilitating Strike']
    .replace('a flat-footed', 'an off-guard'),
  // Deny Advantage as above
  'Double Debilitation':Pathfinder2E.FEATURES['Double Debilitation'],
  'Evasive Reflexes':Pathfinder2E.FEATURES.Evasion,
  'Greater Rogue Reflexes':Pathfinder2E.FEATURES['Improved Evasion'],
  // Greater Weapon Specialization as above
  // Light Armor Expertise as above
  'Light Armor Mastery':Pathfinder2E.FEATURES['Light Armor Mastery'],
  'Master Strike':Pathfinder2E.FEATURES['Master Strike'],
  // Changed effects
  'Master Tricks':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  'Mastermind':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Society; Choose 1 from Arcana, Nature, Occultism, Religion)",' +
      '"Successful Recall Knowledge to identify a creature makes it off-guard against self attacks for 1 rd, or for 1 min on a critical success"',
  // Perception Mastery as above
  // Perception Legend as above
  'Rogue Expertise':Pathfinder2E.FEATURES['Rogue Expertise'],
  'Rogue Feats':Pathfinder2E.FEATURES['Rogue Feats'],
  'Rogue Key Attribute':Pathfinder2E.FEATURES['Rogue Key Ability'],
  'Rogue Resilience':Pathfinder2E.FEATURES['Great Fortitude'],
  'Rogue Skills':Pathfinder2E.FEATURES['Rogue Skills'],
  "Rogue's Racket":Pathfinder2E.FEATURES["Rogue's Racket"],
  // Changed effects
  'Ruffian':
    'Section=combat,combat,skill ' +
    'Note=' +
      '"Defense %V (Medium Armor)",' +
      '"Can use any weapon, other than simple or martial weapons that deal greater than d8 or d6 damage, to sneak attack/Critical hits with these weapons on an off-guard foe inflict their critical specialization effect",' +
      '"Skill Trained (Intimidation)"',
  // Changed effects
  'Scoundrel':
    'Section=combat,skill ' +
    'Note=' +
      '"Successful Feint inflicts off-guard on foe vs. self attacks, or all attacks on a critical success, until the end of the next turn/Successful Feint with an agile or finesse weapon gives a free Step",' +
      '"Skill Trained (Deception; Diplomacy)"',
  'Sneak Attack':Pathfinder2E.FEATURES['Sneak Attack'],
  'Surprise Attack':
    Pathfinder2E.FEATURES['Surprise Attack']
    .replace('flat-footed', 'off-guard'),
  'Thief':Pathfinder2E.FEATURES.Thief,
  // Weapon Specialization as above
  // Changed effects
  'Weapon Tricks':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"Critical hits with an unarmed attack or an agile or finesse weapon vs. an off-guard foe inflict its critical specialization effect"',
  'Nimble Dodge':Pathfinder2E.FEATURES['Nimble Dodge'],
  'Overextending Feint':
    'Section=combat ' +
    'Note="Successful Feint inflicts -2 on target\'s next attack on self, or on all attacks against self for 1 rd with a critical success"',
  'Plant Evidence':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Thievery vs. Perception allows planting a light item on target%{features.Ruffian?\'; can also be done as a free action as part of a Shove\':\'\'}"',
  'Trap Finder':Pathfinder2E.FEATURES['Trap Finder'],
  'Tumble Behind':
    'Section=combat ' +
    'Note="Successful Tumble Through inflicts off-guard against next self attack before the end of the turn"',
  'Twin Feint':Pathfinder2E.FEATURES['Twin Feint'],
  "You're Next":Pathfinder2E.FEATURES["You're Next"],
  'Brutal Beating':Pathfinder2E.FEATURES['Brutal Beating'],
  'Clever Gambit':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Follows a critical hit on an identified creature with a Step or Stride that does not provoke a target Reaction"',
  'Distracting Feint':
    Pathfinder2E.FEATURES['Distracting Feint']
    .replace('flat-footed', 'off-guard'),
  'Mobility':Pathfinder2E.FEATURES.Mobility,
  // Quick Draw as above
  'Strong Arm':'Section=combat Note="+10 thrown weapon range"',
  'Unbalancing Blow':
    Pathfinder2E.FEATURES['Brutal Finish']
    .replace('flat-footed', 'off-guard'),
  'Underhanded Assault':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike after a successful -2 Stealth vs. a foe that is adjacent to an ally"',
  'Dread Striker':
    Pathfinder2E.FEATURES['Dread Striker']
    .replace('flat-footed', 'off-guard'),
  'Head Stomp':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Success unarmed melee Strike against a prone foe inflicts stupefied 1 and off-guard, or stupefied 2 on a critical hit, until the end of the next turn"',
  'Mug':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful sneak attack against an adjacent foe allows a Steal attempt"',
  'Poison Weapon':
    Pathfinder2E.FEATURES['Poison Weapon']
    .replace(/that lasts[^"]*/, 'to a weapon'),
  'Predictable!':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Sense Motive vs. Deception gives +1 AC and next save vs. target for 1 rd, or +2 on a critical success or -1 on a critical failure"',
  'Reactive Pursuit':Pathfinder2E.FEATURES['Reactive Pursuit'],
  'Sabotage':Pathfinder2E.FEATURES.Sabotage,
  "Scoundrel's Surprise":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Removing disguise inflicts off-guard against next attack on unaware foes until the end of the turn"',
  // Scout's Warning as above
  'The Harder They Fall':
    'Section=combat ' +
    'Note="Successful Trip inflicts 1d6 HP bludgeoning, plus sneak attack damage on a critical success"',
  'Twin Distraction':
    'Section=combat ' +
    'Note="Successful Twin Feint attacks with both weapons inflict stupefied 1 until the end of next turn (<b>save Will</b> negates)"',
  'Analyze Weakness':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Next sneak attack on the identified target inflicts +%{level<11?2:level<17?3:4}d6 HP precision"',
  'Anticipate Ambush':
    'Section=combat ' +
    'Note="Moving at half Speed during travel allows using Perception for initiative and inflicts -2 on foes using Stealth for initiative"',
  'Far Throw':
    'Section=combat ' +
    'Note="Reduces the penalty for each additional range increment on thrown weapons to -1"',
  // Changed effect
  'Gang Up':
    'Section=combat ' +
    'Note="Self and allies flank any foe within reach of both"',
  'Light Step':Pathfinder2E.FEATURES['Light Step'],
  'Shove Down':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Can follow a Shove with a Trip even when the foe is not in reach"',
  // Skirmish Strike as above
  'Sly Disarm':
    'Section=combat ' +
    'Note="Can use Thievery to Disarm; success inflicts off-guard against next self attack before the end of the turn"',
  'Twist The Knife':Pathfinder2E.FEATURES['Twist The Knife'],
  'Watch Your Back':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Intimidation vs. Will gives target +2 Perception and =2 Will saves vs. self for 1 min"',
  // Blind-Fight as above
  'Bullseye':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Net Strike with a thrown weapon before the end of the turn gains +1 attack, ignores target concealment, and reduces target cover"',
  'Delay Trap':
    Pathfinder2E.FEATURES['Delay Trap']
    .replace('+5 DC ', '').replace('flat-footed', 'off-guard'),
  'Improved Poison Weapon':Pathfinder2E.FEATURES['Improved Poison Weapon'],
  'Inspired Stratagem':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Previously-briefed ally can use the better of two attack or skill rolls once per day"',
  'Nimble Roll':Pathfinder2E.FEATURES['Nimble Roll'],
  'Opportune Backstab':Pathfinder2E.FEATURES['Opportune Backstab'],
  'Predictive Purchase':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Prescient Planner and Prescient Consumable features",' +
      '"Can use Prescient Planner with 2 actions"',
  // Ricochet Stance as above
  'Sidestep':Pathfinder2E.FEATURES.Sidestep,
  'Sly Striker':Pathfinder2E.FEATURES['Sly Striker'],
  'Swipe Souvenir':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Escape allows a Steal attempt"',
  'Tactical Entry':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Strides without provoking Reactions after rolling Stealth for initiative"',
  'Methodical Debilitations':
    'Section=combat ' +
    'Note="Can use Debilitating Strike to prevent flanking or to negate AC bonus from shields, lesser cover, and standard cover"',
  'Nimble Strike':
    'Section=combat ' +
    'Note="Can make a Strike during Nimble Dodge that suffers no multiple attack penalty"',
  'Precise Debilitations':
    Pathfinder2E.FEATURES['Precise Debilitations']
    .replace('flat-footed', 'off-guard'),
  'Sneak Adept':Pathfinder2E.FEATURES['Sneak Savant'],
  'Tactical Debilitations':Pathfinder2E.FEATURES['Tactical Debilitations'],
  'Vicious Debilitations':Pathfinder2E.FEATURES['Vicious Debilitations'],
  'Bloody Debilitations':
    'Section=combat ' +
    'Note="Can use Debilitating Strike to inflict 3d6 HP persistent bleed"',
  'Critical Debilitation':Pathfinder2E.FEATURES['Critical Debilitation'],
  'Fantastic Leap':Pathfinder2E.FEATURES['Fantastic Leap'],
  'Felling Shot':Pathfinder2E.FEATURES['Felling Shot'],
  'Preparation':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives 1 additional rogue reaction that can be used before the next turn"',
  'Reactive Interference':Pathfinder2E.FEATURES['Reactive Interference'],
  'Ricochet Feint':
    'Section=combat ' +
    'Note="While in Ricochet Stance, can use Feint against a creature within the first range increment of a wielded thrown weapon"',
  'Spring From The Shadows':Pathfinder2E.FEATURES['Spring From The Shadows'],
  'Defensive Roll':Pathfinder2E.FEATURES['Defensive Roll'],
  'Instant Opening':
    Pathfinder2E.FEATURES['Instant Opening']
    .replace('flat-footed', 'off-guard'),
  'Leave An Opening':
    Pathfinder2E.FEATURES['Leave An Opening']
    .replace('flat-footed', 'off-guard')
    .replace('an Attack Of Opportunity', 'a Reactive Strike'),
  // Sense The Unseen as above
  'Stay Down!':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful Athletics vs. Fortitude negates foe Stand action; critical success prevents Standing for 1 rd"',
  'Blank Slate':Pathfinder2E.FEATURES['Blank Slate'],
  'Cloud Step':Pathfinder2E.FEATURES['Cloud Step'],
  'Cognitive Loophole':Pathfinder2E.FEATURES['Cognitive Loophole'],
  'Dispelling Slice':Pathfinder2E.FEATURES['Dispelling Slice'],
  'Perfect Distraction':Pathfinder2E.FEATURES['Perfect Distraction'],
  'Reconstruct The Scene':
    'Section=skill ' +
    'Note="1 min survey gives impressions of events that occurred within the prior day"',
  'Swift Elusion':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful Acrobatics vs. Reflex of a foe moving to an adjacent spot allows Striding or moving the foe to a different adjacent spot"',
  'Implausible Infiltration':Pathfinder2E.FEATURES['Implausible Infiltration'],
  'Implausible Purchase':
    'Section=feature ' +
    'Note="Can use Prescient Planner at will with a single action, and can use it to retrieve a level %{level-6} consumable"',
  // Changed effects
  'Powerful Sneak':
    'Section=combat ' +
    'Note="Sneak attack ignores precision immunity and resistance, and damage dice on a designated target after a Sneak have a minimum roll of 3"',
  'Hidden Paragon':Pathfinder2E.FEATURES['Hidden Paragon'],
  'Impossible Striker':Pathfinder2E.FEATURES['Impossible Striker'],
  'Reactive Distraction':Pathfinder2E.FEATURES['Reactive Distraction'],

  /*
  // Sorcerer
  // Perception Expertise as above
  'Bloodline':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool and 1 Focus Point"',
  'Bloodline Paragon':'Section=magic Note="Has 1 10th-level spell slot"',
*/
  'Defensive Robes':'Section=combat Note="Defense Expert (Unarmored Defense)"',
/*
  // Expert Spellcaster as above
  // Legendary Spellcaster as above
  // Reflex Expertise as above
*/
  'Magical Fortitude':'Section=save Note="Save Expert (Fortitude)"',
/*
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
*/
  'Counterspell':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Expends a spell slot to attempt to counteract a spell with the same spell"',
/*
  'Dangerous Sorcery':
    'Section=magic ' +
    'Note="Using a spell slot to cast an instantaneous harmful spell inflicts additional damage equal to its level"',
*/
  'Familiar':'Section=feature Note="May have a familiar"',
/*
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
  */

  // Witch
  // Defensive Robes as above
  // Expert Spellcaster as above
  "Faith's Flamekeeper":
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      // TODO familiar knows Command
      '"Knows the Stoke The Heart divine cantrip",' +
      '"Skill Trained (Religion)"',
  // Familiar as above
  'Hex Spells':'Section=magic Note="Has a focus pool and 1 Focus Point"',
  // Legendary Spellcaster as above
  // Magical Fortitude as above
  // Master Spellcaster as above
  'Patron':'Section=feature Note="1 selection"',
  "Patron's Gift":'Section=magic Note="Has 1 10th-level spell slot"',
  // Perception Expertise as above
  // Reflex Expertise as above
  'Silence In Snow':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)",' +
      // TODO familiar knows Gust Of Wind
      '"Knows the Clinging Ice primal cantrip",' +
      '"Skill Trained (Nature)"',
  'Spinner Of Threads':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      // TODO familiar knows Gust Of Wind
      '"Knows the Nudge Fate occult cantrip",' +
      '"Skill Trained (Occultism)"',
  'Starless Shadow':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      // TODO familiar knows Fear
      '"Knows the Shroud Of Night occult cantrip",' +
      '"Skill Trained (Occultism)"',
  'The Inscribed One':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)",' +
      // TODO familiar knows Runic Weapon
      '"Knows the Discern Secrets arcane spell",' +
      '"Skill Trained (Arcana)"',
  'The Resentment':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      // TODO familiar knows Enfeeble
      '"Knows the Evil Eye occult cantrip",' +
      '"Skill Trained (Occultism)"',
  // Weapon Expertise as above
  // Weapon Specialization as above
  'Wilding Steward':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)",' +
      // TODO familiar knows Summon Animal or Summon Plant Or Fungus
      '"Knows the Wilding Word primal cantrip",' +
      '"Skill Trained (Nature)"',
  'Will Of The Pupil':Pathfinder2E.FEATURES.Resolve,
  'Witch Feats':'Section=feature Note="%V selections"',
  'Witch Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Witch Spellcasting':
    'Section=magic Note="Can learn spells from the %V tradition"',
  // TODO: Patron familiar gift

  'Cackle':'Section=magic Note="Knows the Cackle hex"',
  'Cauldron':
    'Section=skill ' +
    'Note="Knows the formulas for %{level//2+1?>4} common oils or potions and can use Craft to create %{(rank.Arcane||rank.Divine||rank.Occult||rank.Primal||0<3?1:rank.Arcane||rank.Divine||rank.Occult||rank.Primal<4?2:3)*($\'features.Double, Double\'?2:1)} oils or potions during daily prep"',
  // Counterspell as above
  // Reach Spell as above
  // Widen Spell as above
  "Witch's Armaments (Eldritch Nails)":
    'Section=combat Note="Nails inflict 1d6 HP slashing"',
  "Witch's Armaments (Iron Teeth)":
    'Section=combat Note="Teeth inflict 1d8 HP piercing"',
  "Witch's Armaments (Living Hair)":
    'Section=combat Note="Hair inflicts 1d4 bludgeoning"',
  'Basic Lesson (Dreams)':
    'Section=magic ' +
    'Note="Knows the Veil Of Dreams hex, and familiar knows the Sleep spell"',
  'Basic Lesson (Elements)':
    'Section=magic ' +
    'Note="Knows the Elemental Betrayal hex, and familiar knows the choice of the Breath Fire, Gust Of Wind, Hydraulic Push, or Pummeling Rubble spells"',
  'Basic Lesson (Life)':
    'Section=magic ' +
    'Note="Knows the Life Boost hex, and familiar knows the Spirit Link spell"',
  'Basic Lesson (Protection)':
    'Section=magic ' +
    'Note="Knows the Blood Ward hex, and familiar knows the Mystic Armor spell"',
  'Basic Lesson (Vengeance)':
    'Section=magic ' +
    'Note="Knows the Needle Of Vengeance hex, and familiar knows the Phantom Pain spell"',
  // Cantrip Expansion as above
  // Changed effects
  'Conceal Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Casts a subsequent spell without an incantation or obvious manifestations"',
  // Enhanced Familiar as above
  "Familiar's Language":
    'Section=skill ' +
    'Note="Can speak with animals in the same family as familiar"',
  'Rites Of Convocation':
    'Section=magic ' +
    'Note="Can use a 10-min process to replace a prepared spell with a summoning spell"',
  'Sympathetic Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Subsequent hit with a Witch\'s Armament weapon inflicts -1 saves vs. self hexes for 1 rd, or -2 on a critical hit"',
  'Ceremonial Knife':
    'Section=feature ' +
    'Note="Can prepare a knife to contain a spell of up to rank %{level//2-2>?1} during daily prep"',
  'Greater Lesson (Mischief)':
    'Section=magic ' +
    'Note="Knows the Deceiver\'s Cloak hex, and familiar knows the Mad Monkeys spell"',
  'Greater Lesson (Shadow)':
    'Section=magic ' +
    'Note="Knows the Malicious Shadow hex, and familiar knows the Chilling Darkness spell"',
  'Greater Lesson (Snow)':
    'Section=magic ' +
    'Note="Knows the Personal Blizzard hex, and familiar knows the Wall Of Wind spell"',
  // Steady Spellcasting as above
  "Witch's Charge":
    'Section=magic ' +
    'Note="Knows the direction, distance, and state of %{$\\"features.Witch\'s Communion\\"?\'2 willing targets\':\'a willing target\'} designated during daily prep, and can cast R30\' touch spells on that target"',
  'Incredible Familiar':
    'Section=feature Note="Can select 6 familiar or master abilities each day"',
  'Murksight':
    'Section=combat ' +
    'Note="Suffers no ranged attack or Perception penalties from non-magical precipitation, and requires no flat check to attack a target concealed by it"',
  'Spirit Familiar':
    'Section=combat ' +
    'Note="Familiar can use two actions to leave its body, fly 20\' to a foe, inflict %{(level-1)//2*2}d6 HP spirit (<b>save basic Will</b>), fly 30\' to an ally, and restore HP equal to half the damage dealt once per 10 min"',
  'Stitched Familiar':
    'Section=combat ' +
    'Note="Familiar can use two actions for a R30\' attack that inflicts %{(level-1)//2*2}d6 HP slashing and immobilized for 1 rd (<b>save basic Reflex</b> also negates immobilized) once per 10 min"',
  "Witch's Bottle":
    'Section=magic ' +
    'Note="Can spend 10 min and 1 Focus Point to create a potion that inflicts a hex on the imbiber"',
  'Double, Double':
    'Section=skill Note="Has increased Cauldron effects"',
  'Major Lesson (Death)':
    'Section=magic ' +
    'Note="Knows the Curse Of Death hex, and familiar knows the Raise Dead spell"',
  'Major Lesson (Renewal)':
    'Section=magic ' +
    'Note="Knows the Restorative Moment hex, and familiar knows the Field Of Life spell"',
  // Quickened Casting as above
  "Witch's Communion":
    'Section=magic Note="Has increased Witch\'s Charge effects"',
  'Coven Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Gives the triggering ally spell a damage bonus equal to its rank or a spellshape effect"',
  'Hex Focus':'Section=magic Note="Refocus restores all focus points"',
  "Witch's Broom":
    'Section=skill Note="Can give a broom or similar object a 20\' fly Speed for 1 day, or give an existing <i>flying broomstick</i> +10\' Speed, during daily prep"',
  // Reflect Spell as above
  'Rites of Transfiguration':
    'Section=magic ' +
    'Note="Can use a 10-min process to replace a prepared spell of at least 6th rank with <i>Cursed Metamorphasis</i>"',
  "Patron's Presence":
    'Section=combat Note="Familiar can use 2 actions to create a 15\' emanation that inflicts stupefied 2 on foes (<b>save Will</b> negates; critical failure inflicts stupefied 3) while sustained for up to 1 min once per hour"',
  // Effortless Concentration as above
  'Siphon Power':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Can cast a spell from familiar once per day"',
  'Split Hex':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent targeted hex, cast at 2 ranks lower, affects a second target"',
  "Patron's Claim":
    'Section=combat ' +
    'Note="Familiar can spend 2 actions for a R30\' attack that inflicts 10d10 HP spirit and drained 2 (<b>save basic Fortitude</b> also negates drained; critical failure inflicts drained 4) and restores 1 Focus Point to self once per hour"',
  'Hex Master':
    'Section=magic ' +
    'Note="Can cast multiple hexes per turn, and <i>Cackle</i> Sustains all active hexes"',
  "Patron's Truth":'Section=magic Note="+1 10th rank spell slot"',
  "Witch's Hut":
    'Section=magic Note="1-day ritual creates an animated Huge or smaller dwelling with %{armorClass} AC, +%{perceptionModifier} Perception, 60\' Speed 150 HP, and Hardness 10 that can guard, hide, teleport, lock, and move"',

  // Wizard
  'Arcane Bond':Pathfinder2E.FEATURES['Arcane Bond'],
  'Arcane School':Pathfinder2E.FEATURES['Arcane School'],
  'Arcane Thesis':Pathfinder2E.FEATURES['Arcane Thesis'],
  "Archwizard's Spellcraft":Pathfinder2E.FEATURES["Archwizard's Spellcraft"],
  'Ars Grammatica':
    'Section=feature ' +
    'Note="TODO"',
  'Battle Magic':
    'Section=feature ' +
    'Note="TODO"',
  'Boundary':
    'Section=feature ' +
    'Note="TODO"',
  'Civic Wizardry':
    'Section=feature ' +
    'Note="TODO"',
  // Defensive Robes as above
  'Drain Bonded Item':Pathfinder2E.FEATURES['Drain Bonded Item'],
  'Experimental Spellshaping':
    Pathfinder2E.FEATURES['Metamagical Experimentation']
    .replaceAll('metamagic', 'spellshape'),
  // Expert Spellcaster as above
  'Improved Familiar Attunement':
    Pathfinder2E.FEATURES['Improved Familiar Attunement'],
  // Legendary Spellcaster as above
  // Magical Fortitude as above
  // Master Spellcaster as above
  'Mentalism':
    'Section=feature ' +
    'Note="TODO"',
  // Perception Expertise as above
  'Prodigious Will':Pathfinder2E.FEATURES.Resolve,
  'Protean Form':
    'Section=feature ' +
    'Note="TODO"',
  // Reflex Expertise as above
  'Spell Blending':Pathfinder2E.FEATURES['Spell Blending'],
  'Spell Substitution':Pathfinder2E.FEATURES['Spell Substitution'],
  'Staff Nexus':
    'Section=magic ' +
    'Note="Can cast spells from staff, using charges from %{level<8?\'1 spell\':level<16?\'2 spells\':\'3 spells\'} expended during daily prep"',
  'Unified Magical Theory':
    'Section=feature ' +
    'Note="TODO"',
  // Weapon Expertise as above
  // Weapon Specialization as above
  'Wizard Feats':Pathfinder2E.FEATURES['Wizard Feats'],
  'Wizard Skills':
    'Section=skill Note="Skill Trained (Arcana; Choose %V from any)"',
  'Wizard Spellcasting':Pathfinder2E.FEATURES['Arcane Spellcasting'],
  // Counterspell as above
  // Familiar as above
  // Reach Spell as above
  'Spellbook Prodigy':
    'Section=magic,skill ' +
    'Note=' +
      '"Critical failures to Learn A Spell are normal failures",' +
      '"Has the Magical Shorthand feature"',
  // Widen Spell as above
  // Cantrip Expansion as above
  'Conceal Spell':Pathfinder2E.FEATURES['Conceal Spell'],
  'Energy Ablation':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Casting a spell that inflicts energy damage gives self resistance to a chosen energy type equal to the spell rank"',
  // Enhanced Familiar as above
  'Nonlethal Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Changed the damage caused by a subsequent spell to non-lethal"',

  /*-----*/

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

/*
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
*/

  // General and Skill Feats
  'Additional Lore (%lore)':Pathfinder2E.FEATURES['Additional Lore (%lore)'],
  'Adopted Ancestry (%ancestry)':
    Pathfinder2E.FEATURES['Adopted Ancestry (%ancestry)'],
  'Advanced First Aid':
    'Section=skill ' +
    'Note="Can use Administer First Aid to reduce a frightened or sickened condition by 2, or remove it entirely with a critical success"',
  'Alchemical Crafting':Pathfinder2E.FEATURES['Alchemical Crafting'],
  'Ancestral Paragon':Pathfinder2E.FEATURES['Ancestral Paragon'],
  'Arcane Sense':Pathfinder2E.FEATURES['Arcane Sense'].replace('level', 'rank'),
  'Armor Proficiency':Pathfinder2E.FEATURES['Armor Proficiency'],
  'Assurance (%skill)':Pathfinder2E.FEATURES['Assurance (%skill)'],
  'Automatic Knowledge (%skill)':
    Pathfinder2E.FEATURES['Automatic Knowledge (%skill)'],
  'Bargain Hunter':Pathfinder2E.FEATURES['Bargain Hunter'],
  'Battle Cry':Pathfinder2E.FEATURES['Battle Cry'],
  'Battle Medicine':Pathfinder2E.FEATURES['Battle Medicine'],
  'Bizarre Magic':Pathfinder2E.FEATURES['Bizarre Magic'],
  'Bonded Animal':Pathfinder2E.FEATURES['Bonded Animal'],
  'Break Curse':
    'Section=skill ' +
    'Note="After %{rank.Occultism>=4||rank.Religion>=4?\'10 min\':\'8 hr\'} of preparation, can use Occultism or Religion for a %{(level+1}//2}-level counteract check against a curse"',
  'Breath Control':Pathfinder2E.FEATURES['Breath Control'],
  'Canny Acumen (Fortitude)':Pathfinder2E.FEATURES['Canny Acumen (Fortitude)'],
  'Canny Acumen (Perception)':
    Pathfinder2E.FEATURES['Canny Acumen (Perception)'],
  'Canny Acumen (Reflex)':Pathfinder2E.FEATURES['Canny Acumen (Reflex)'],
  'Canny Acumen (Will)':Pathfinder2E.FEATURES['Canny Acumen (Will)'],
  'Cat Fall':Pathfinder2E.FEATURES['Cat Fall'],
  'Charming Liar':Pathfinder2E.FEATURES['Charming Liar'],
  'Cloud Jump':Pathfinder2E.FEATURES['Cloud Jump'],
  'Combat Climber':Pathfinder2E.FEATURES['Combat Climber'],
  'Communal Crafting':
    'Section=skill ' +
    'Note="Can reduce the cost of crafting items by giving or receiving assistance"',
  'Confabulator':Pathfinder2E.FEATURES.Confabulator,
  'Continual Recovery':Pathfinder2E.FEATURES['Continual Recovery'],
  'Courtly Graces':Pathfinder2E.FEATURES['Courtly Graces'],
  'Craft Anything':Pathfinder2E.FEATURES['Craft Anything'],
  'Diehard':Pathfinder2E.FEATURES.Diehard,
  'Divine Guidance':Pathfinder2E.FEATURES['Divine Guidance'],
  'Dubious Knowledge':Pathfinder2E.FEATURES['Dubious Knowledge'],
  'Expeditious Search':Pathfinder2E.FEATURES['Expeditious Search'],
  'Experienced Professional':Pathfinder2E.FEATURES['Experienced Professional'],
  'Experienced Smuggler':
    Pathfinder2E.FEATURES['Experienced Smuggler'].replace(/\/[^"]*/, ''),
  'Experienced Tracker':Pathfinder2E.FEATURES['Experienced Tracker'],
  'Fascinating Performance':Pathfinder2E.FEATURES['Fascinating Performance'],
  'Fast Recovery':Pathfinder2E.FEATURES['Fast Recovery'],
  'Feather Step':Pathfinder2E.FEATURES['Feather Step'],
  'Fleet':Pathfinder2E.FEATURES.Fleet,
  'Foil Senses':Pathfinder2E.FEATURES['Foil Senses'],
  'Forager':Pathfinder2E.FEATURES.Forager,
  'Glad-Hand':Pathfinder2E.FEATURES['Glad-Hand'],
  'Group Coercion': // Target counts changed
    'Section=skill ' +
    'Note="Can use Intimidation to Coerce %{rank.Intimidation>=4?50:rank.Intimidation==3?25:rank.Intimidation==2?10:5} targets"',
  'Group Impression': // Target counts changed
    'Section=skill ' +
    'Note="Can use Diplomacy to Make an Impression with %{rank.Diplomacy>=4?100:rank.Diplomacy==3?50:rank.Diplomacy==2?20:10} targets"',
  'Hefty Hauler':Pathfinder2E.FEATURES['Hefty Hauler'],
  'Hobnobber':
    Pathfinder2E.FEATURES.Hobnobber.replace('when taking normal time ', ''),
  'Impeccable Crafting':Pathfinder2E.FEATURES['Impeccable Crafting'],
  'Impressive Performance':Pathfinder2E.FEATURES['Impressive Performance'],
  'Incredible Initiative':Pathfinder2E.FEATURES['Incredible Initiative'],
  'Incredible Investiture':Pathfinder2E.FEATURES['Incredible Investiture'],
  'Intimidating Glare':Pathfinder2E.FEATURES['Intimidating Glare'],
  'Intimidating Prowess':Pathfinder2E.FEATURES['Intimidating Prowess'],
  'Inventor':Pathfinder2E.FEATURES.Inventor,
  'Kip Up':Pathfinder2E.FEATURES['Kip Up'],
  'Lasting Coercion':Pathfinder2E.FEATURES['Lasting Coercion'],
  'Legendary Codebreaker':Pathfinder2E.FEATURES['Legendary Codebreaker'],
  'Legendary Linguist':Pathfinder2E.FEATURES['Legendary Linguist'],
  'Legendary Medic':Pathfinder2E.FEATURES['Legendary Medic'],
  'Legendary Negotiation':Pathfinder2E.FEATURES['Legendary Negotiation'],
  'Legendary Performer':
    Pathfinder2E.FEATURES['Legendary Performer']
    .replace(/1 step[^\/]*/, '1 step for those with ranks in Society'),
  'Legendary Professional':
    Pathfinder2E.FEATURES['Legendary Professional']
    .replace(/1 step[^\/]*/, '1 step for those with ranks in Society'),
  'Legendary Sneak':Pathfinder2E.FEATURES['Legendary Sneak'],
  'Legendary Survivalist':Pathfinder2E.FEATURES['Legendary Survivalist'],
  'Legendary Thief':
    Pathfinder2E.FEATURES['Legendary Thief'].replace(' with.*penalty', ''),
  'Lengthy Diversion':Pathfinder2E.FEATURES['Lengthy Diversion'],
  'Leverage Connections': // TODO Player Core 2
    Pathfinder2E.FEATURES.Connections,
  'Lie To Me':Pathfinder2E.FEATURES['Lie To Me'],
  'Magical Crafting':Pathfinder2E.FEATURES['Magical Crafting'],
  'Magical Shorthand':
    Pathfinder2E.FEATURES['Magical Shorthand']
    .replace(/with.*spell level/, 'with 10 min of study'),
  'Monster Crafting':
    'Section=skill Note="Can use monster bodies with Survival to craft items"',
  'Multilingual':Pathfinder2E.FEATURES.Multilingual,
  'Natural Medicine':Pathfinder2E.FEATURES['Natural Medicine'],
  'Nimble Crawl':Pathfinder2E.FEATURES['Nimble Crawl'],
  'No Cause For Alarm':
    'Section=skill ' +
    'Note="Successful Diplomacy reduces frightened levels by 1 in a 10\' emanation, or by 2 on a critical success"',
  'Oddity Identification':
    Pathfinder2E.FEATURES['Oddity Identification']
    .replace('mental', 'fortune, mental'),
  'Pet':
    'Section=feature ' +
    'Note="Has a Tiny animal minion with the same level, modifiers, and AC as self, %{level*5} Hit Points, low-light vision, 25\' Speed, and creature-specific abilities"',
  'Pickpocket':Pathfinder2E.FEATURES.Pickpocket,
  'Planar Survival':Pathfinder2E.FEATURES['Planar Survival'],
  'Powerful Leap':Pathfinder2E.FEATURES['Powerful Leap'],
  'Prescient Consumable':
    'Section=feature ' +
    'Note="Can retrieve an undeclared consumable from backpack once per shopping trip"',
  'Prescient Planner':
    'Section=feature ' +
    'Note="Can retrieve an undeclared piece of adventuring gear from backpack once per shopping trip"',
  'Quick Climb':Pathfinder2E.FEATURES['Quick Climb'],
  'Quick Coercion':Pathfinder2E.FEATURES['Quick Coercion'],
  // Times have changed
  'Quick Disguise':
    'Section=skill ' +
    'Note="Can create a disguise %{rank.Deception>=4?\'using 1 action\':rank.Deception==3?\'as a 3-action activity\':\'in 1 min\'}"',
  'Quick Identification':Pathfinder2E.FEATURES['Quick Identification'],
  'Quick Jump':Pathfinder2E.FEATURES['Quick Jump'],
  'Quick Recognition':Pathfinder2E.FEATURES['Quick Recognition'],
  'Quick Repair':Pathfinder2E.FEATURES['Quick Repair'],
  'Quick Squeeze':Pathfinder2E.FEATURES['Quick Squeeze'],
  'Quick Swim':Pathfinder2E.FEATURES['Quick Swim'],
  'Quick Unlock':Pathfinder2E.FEATURES['Quick Unlock'],
  'Quiet Allies':Pathfinder2E.FEATURES['Quiet Allies'],
  'Rapid Mantel':Pathfinder2E.FEATURES['Rapid Mantel'],
  'Read Lips':
    Pathfinder2E.FEATURES['Read Lips'].replace('flat-footed', 'off-guard'),
  'Recognize Spell':Pathfinder2E.FEATURES['Recognize Spell'],
  'Ride':Pathfinder2E.FEATURES.Ride,
  'Robust Recovery':Pathfinder2E.FEATURES['Robust Recovery'],
  'Scare To Death':Pathfinder2E.FEATURES['Scare To Death'],
  'Schooled In Secrets':
    'Section=skill ' +
    'Note="Can use Occultism to Gather Information about secret societies and to Impersonate a member"',
  'Seasoned':
    'Section=skill ' +
    'Note="+%{$\'rank.Alcohol Lore\' >= 3 || $\'rank.Cooking Lore\' >= 3 || rank.Crafting >= 3?2:1} to Craft food and drink"',
  'Shameless Request':Pathfinder2E.FEATURES['Shameless Request'],
  // Shield Block as above
  'Sign Language':Pathfinder2E.FEATURES['Sign Language'],
  'Skill Training (%skill)':Pathfinder2E.FEATURES['Skill Training (%skill)'],
  'Slippery Secrets':Pathfinder2E.FEATURES['Slippery Secrets'],
  'Specialty Crafting':Pathfinder2E.FEATURES['Specialty Crafting'],
  'Steady Balance':
    Pathfinder2E.FEATURES['Steady Balance']
    .replace('flat-footed', 'off-balance'),
  'Streetwise':Pathfinder2E.FEATURES.Streetwise,
  'Student Of The Canon':Pathfinder2E.FEATURES['Student Of The Canon'],
  'Subtle Theft':Pathfinder2E.FEATURES['Subtle Theft'],
  'Survey Wildlife':Pathfinder2E.FEATURES['Survey Wildlife'],
  'Swift Sneak':Pathfinder2E.FEATURES['Swift Sneak'],
  'Terrain Expertise (%terrain)':
    Pathfinder2E.FEATURES['Terrain Expertise (%terrain)'],
  'Terrain Stalker (Rubble)':Pathfinder2E.FEATURES['Terrain Stalker (Rubble)'],
  'Terrain Stalker (Snow)':Pathfinder2E.FEATURES['Terrain Stalker (Snow)'],
  'Terrain Stalker (Underbrush)':
    Pathfinder2E.FEATURES['Terrain Stalker (Underbrush)'],
  'Terrified Retreat':Pathfinder2E.FEATURES['Terrified Retreat'],
  'Titan Wrestler':Pathfinder2E.FEATURES['Titan Wrestler'],
  'Toughness':Pathfinder2E.FEATURES.Toughness,
  'Train Animal':Pathfinder2E.FEATURES['Train Animal'],
  'Trick Magic Item':Pathfinder2E.FEATURES['Trick Magic Item'],
  'Underwater Marauder':Pathfinder2E.FEATURES['Underwater Marauder'],
  'Unified Theory':Pathfinder2E.FEATURES['Unified Theory'],
  'Unmistakable Lore':Pathfinder2E.FEATURES['Unmistakable Lore'],
  // Computation has changed
  'Untrained Improvisation':
    'Section=skill ' +
    'Note="+%{level-(level<5?2:level<7?1:0)} on untrained skill checks"',
  'Unusual Treatment':
    'Section=skill ' +
    'Note="Successful DC 20 check to Treat Wounds reduces one of clumsy, enfeebled, or stupefied%{rank.Medicine>=3?\', or successful DC 30 reduces drained,\':\'\'} by %{rank.Medicine<3?1:2} once per patient per day"',
  'Virtuosic Performer':Pathfinder2E.FEATURES['Virtuosic Performer'],
  'Wall Jump':Pathfinder2E.FEATURES['Wall Jump'],
  'Ward Medic':Pathfinder2E.FEATURES['Ward Medic'],
  'Wary Disarmament':Pathfinder2E.FEATURES['Wary Disarmament'],
  // Rank computation has changed
  'Weapon Proficiency (Martial Weapons)':
    'Section=combat Note="Attack %V (Martial Weapons)"',
  // Rank computation has changed
  'Weapon Proficiency (%advancedWeapon)':
    'Section=combat Note="Attack %V (%advancedWeapon)"',

};
Pathfinder2ERemaster.GOODIES = Pathfinder2E.GOODIES;
Pathfinder2ERemaster.HERITAGES = {
  'Changeling':'Trait=Uncommon',
  'Nephilim':'Trait=Uncommon',
  'Aiuvarin':'Trait=Non-Elf',
  'Dromaar':'Trait=Non-Orc'
};
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
  'Leshy Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Orc Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  // terrain lore skills from background chapter pg 84ff
  'Cave Lore':Pathfinder2E.SKILLS['Cave Lore'],
  'Cavern Lore':Pathfinder2E.SKILLS['Cavern Lore'],
  'Desert Lore':Pathfinder2E.SKILLS['Desert Lore'],
  'Forest Lore':Pathfinder2E.SKILLS['Forest Lore'],
  'Plains Lore':Pathfinder2E.SKILLS['Plains Lore'],
  'Swamp Lore':Pathfinder2E.SKILLS['Swamp Lore'],
  'Underground Lore':Pathfinder2E.SKILLS['Underground Lore'],
  // terrain lore skills from Ranger favored terrain feat pg 158
  'Aquatic Lore':Pathfinder2E.SKILLS['Aquatic Lore'],
  'Arctic Lore':Pathfinder2E.SKILLS['Arctic Lore'],
  'Sky Lore':Pathfinder2E.SKILLS['Sky Lore'],
  'Military Lore':'Attribute=Intelligence', // pg 240
  // Adventuring Lore, Magic Lore, Planar Lore pg 241 examples of excluded Lore
  // Common lore subcategories pg 240
  'Academia Lore':Pathfinder2E.SKILLS['Academia Lore'],
  'Accounting Lore':Pathfinder2E.SKILLS['Accounting Lore'],
  'Architecture Lore':Pathfinder2E.SKILLS['Architecture Lore'],
  'Art Lore':Pathfinder2E.SKILLS['Art Lore'],
  'Astronomy Lore':'Attribute=Intelligence',
  'Carpentry Lore':'Attribute=Intelligence',
  'Circus Lore':Pathfinder2E.SKILLS['Circus Lore'],
  'Driving Lore':'Attribute=Intelligence',
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
  'Giant Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Vampire Lore':Pathfinder2E.SKILLS['Vampire Lore'],
  'Astral Plane Lore':Pathfinder2E.SKILLS['Astral Plane Lore'],
  'Heaven Lore':Pathfinder2E.SKILLS['Heaven Lore'],
  'Outer Rifts Lore':'Attribute=Intelligence Subcategory="Planar Lore"',
  'Hellknights Lore':'Attribute=Intelligence Subcategory="Organization Lore"',
  'Pathfinder Society Lore':
    'Attribute=Intelligence Subcategory="Organization Lore"',
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
  'Piloting Lore':'Attribute=Intelligence',
  'Sailing Lore':Pathfinder2E.SKILLS['Sailing Lore'],
  'Scouting Lore':Pathfinder2E.SKILLS['Scouting Lore'],
  'Scribing Lore':Pathfinder2E.SKILLS['Scribing Lore'],
  'Stabling Lore':Pathfinder2E.SKILLS['Stabling Lore'],
  'Tanning Lore':Pathfinder2E.SKILLS['Tanning Lore'],
  'Theater Lore':Pathfinder2E.SKILLS['Theater Lore'],
  'Underworld Lore':Pathfinder2E.SKILLS['Underworld Lore'],
  'Warfare Lore':Pathfinder2E.SKILLS['Warfare Lore']
};
for(let s in Pathfinder2ERemaster.SKILLS)
  Pathfinder2ERemaster.SKILLS[s] =
    Pathfinder2ERemaster.SKILLS[s].replace('Ability', 'Attribute');
Pathfinder2ERemaster.SPELLS = {
  'Acid Grip':
    Pathfinder2E.SPELLS['Acid Arrow']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Manipulate') + ' ' +
    'Description=' +
      '"R120\' Inflicts 2d8 HP acid, 1d6 HP persistent acid, and -10\' Speed for 1 min (<b>save Reflex</b> inflicts half initial HP only and moves the target 5\'; critical success negates; critical failure inflicts double initial HP and moves the target 20\') (<b>heightened +2</b> inflicts +2d8 HP initial and +1d6 HP persistent)"',
  'Aerial Form':
    Pathfinder2E.SPELLS['Aerial Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Manipulate,Concentrate'),
  'Air Bubble':
    Pathfinder2E.SPELLS['Air Bubble']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate'),
  'Alarm':
    Pathfinder2E.SPELLS.Alarm
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Animal Form':
    Pathfinder2E.SPELLS['Animal Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Animal Messenger':
    Pathfinder2E.SPELLS['Animal Messenger']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Ant Haul':
    Pathfinder2E.SPELLS['Ant Haul']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  // TODO
  'Courageous Anthem':
    Pathfinder2E.SPELLS['Inspire Courage']
    .replace('School=Enchantment', '')
    .replace('Enchantment', 'Concentrate'),
  'Stoke The Heart':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Clinging Ice':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Nudge Fate':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Shroud Of Night':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Discern Secrets':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Evil Eye':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Wilding Word':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Untamed Form':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Cornucopia':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Untamed Shift':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Pulse Of Civilization':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Darkened Sight':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Perfected Body':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Vital Luminance':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Whispering Quiet':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Creative Splash':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Ignite Ambition':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Pied Piping':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Symphony Of The Unfettered Heart':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Ode To Ouroboros':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Fortissimo Composition':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Song Of Marching':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Disguise Magic':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Entangling Flora':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Interplanar Teleport':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Magic Passage':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Oaken Resilience':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Phantasmal Minion':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Revealing Light':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Song Of Strength':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Sure Strike':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Unhampered Passage':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Uplifting Overture':
    'Level=1 ' +
    'Trait=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  // TODO
  'Abyssal Plague':
    'Level=5 ' +
    'Trait=Chaotic,Disease,Evil,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 1 Abyssal plague, which inflicts unrecoverable drained 1 until cured; subsequent failures after 1 day will inflict drained 2 at stage 2 (<b>save Fortitude</b> inflicts 2 HP evil per spell level and -2 saves vs. Abyssal plague for 1 day; critical success negates; critical failure inflicts stage 2)"',
  'Acid Arrow':
    'Level=2 ' +
    'Trait=Acid,Attack,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 3d8 HP acid, or double HP on a critical success, plus 1d6 HP persistent acid (<b>heightened +2</b> inflicts +2d8 HP initial and +1d6 HP persistent)"',
  'Acid Splash':
    'Level=1 ' +
    'Trait=Acid,Attack,Cantrip,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d6 HP acid, plus 1 HP persistent acid on a critical success, and 1 HP acid splash (<b>heightened 3rd</b> inflicts 1d6+%{spellModifier.%tradition} HP initial and 2 HP persistent; <b>5th</b> inflicts 2d6+%{spellModifier.%tradition} HP initial, 3 HP persistent, and 2 HP splash; <b>7th</b> inflicts 3d6+%{spellModifier.%tradition} HP initial, 4 HP persistent, and 3 HP splash; <b>9th</b> inflicts 4d6+%{spellModifier.%tradition} HP initial, 5 HP persistent, and 4 HP splash)"',
  'Aerial Form':
    'Level=4 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium bat, bird, pterosaur, or wasp with 5 temporary HP, Armor Class %{level+18}, +16 attack, +5 damage, low-light vision, flight, +16 Acrobatics modifier, and creature-specific features for 1 min (<b>heightened 5th</b> becomes a Large creature with +10\' Speed, 10 temporary HP, +18 attack, +8 damage, +20 Acrobatics; <b>6th</b> becomes a Huge creature with +15\' Speed, 10\' reach, 15 temporary HP, Armor Class %{level+21}, +21 attack, +4 damage with double damage dice, +23 Acrobatics)"',
  'Air Bubble':
    'Level=1 ' +
    'Trait=Air,Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Allows target to breathe normally in any environment for 1 min"',
  'Air Walk':
    'Level=4 ' +
    'Trait=Air,Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Touched can walk up to a 45-degree angle on air for 5 min"',
  'Alarm':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"20\' burst triggers a mental or audible alarm when a Small or larger corporeal creature enters without saying a specified password for 8 hr (<b>heightened 3rd</b> allows specifying characteristics of triggering creatures)"',
  'Alter Reality':
    'Level=10 ' +
    'Trait=Divination ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known occult spell of up to 9th level or a common spell of up to 7th level"',
  'Anathematic Reprisal':
    'Level=4 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Target who committed the triggering anathema act suffers 4d6 HP mental and stupefied 1 for 1 rd (<b>save basic Will</b>; success negates stupefied) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Animal Form':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium animal with 5 temporary HP, Armor Class %{level+16}, +9 attack, +1 damage, low-light vision, 30\' imprecise scent, +9 Athletics modifier, and creature-specific features for 1 min (<b>heightened 3rd</b> gives 10 temporary HP, Armor Class %{level+17}, +14 attack, +5 damage, +14 Athletics; <b>4th</b> becomes a Large creature with 10\' reach, 15 temporary HP, Armor Class %{level+18}, +16 attack, +9 damage, +16 Athletics; <b>5th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, Armor Class %{level+18}, +18 attack, +7 damage with double damage dice, +20 Athletics)"',
  'Animal Messenger':
    'Level=2 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Target Tiny animal carries a small object or note to a specified destination for up to 24 hr"',
  'Animal Vision':
    'Level=3 ' +
    'Trait=Divination,Mental ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R120\' Allows self to share the target animal\'s senses (<b>save Will</b> negates) for 1 hr"',
  'Ant Haul':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched can carry +3 Bulk without encumbrance and +6 Bulk maximum for 8 hr"',
  'Antimagic Field':
    'Level=8 ' +
    'Trait=Rare,Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"10\' emanation disables spells and magic items while sustained for up to 1 min"',
  'Augury':
    'Level=2 ' +
    'Trait=Divination,Prediction ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals whether the results of a proposed action up to 30 min in the future will be generally good or bad"',
  'Avatar':
    'Level=10 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Huge creature with 30 temporary HP, Armor Class %{level+25}, +33 attack, +35 Athletics, and deity-specific features for 1 min"',
  'Baleful Polymorph':
    'Level=6 ' +
    'Trait=Incapacitation,Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transforms the target\'s form into a harmless animal for 1 min, allowing a new save to revert each rd (<b>save Will</b> inflicts minor physical changes and sickened 1; critical success negates; critical failure transforms permanently and also affects the target\'s mind)"',
  'Bane':
    'Level=1 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"5\' emanation inflicts -1 attack on foes for 1 min (<b>save Will</b> negates); a concentrate action each rd increases the radius by 5\'"',
  'Banishment':
    'Level=5 ' +
    'Trait=Abjuration,Incapacitation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Returns the target to its home plane (<b>save Will</b> (-2 if cast using an additional action and a target anathema) negates; critical success inflicts stunned 1 on self; critical failure prevents the target\'s return for 1 week) (<b>heightened 9th</b> affects 10 targets)"',
  'Barkskin':
    'Level=2 ' +
    'Trait=Abjuration,Plant ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 2 to bludgeoning and piercing and weakness 3 to fire for 10 min (<b>heightened +2</b> gives +2 resistances and +3 weakness)"',
  'Bind Soul':
    'Level=9 ' +
    'Trait=Uncommon,Evil,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Traps the soul of a corpse dead for less than 1 min in a gem until counteracted or the gem is destroyed"',
  'Bind Undead':
    'Level=3 ' +
    'Trait=Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Controls the actions of a mindless undead of level less than or equal to the spell level for 1 day"',
  'Black Tentacles':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Successful spell attacks vs. Fortitude DC in a 20\' burst inflict 3d6 HP bludgeoning and grabbed for 1 min, plus 1d6 HP bludgeoning each rd on grabbed creatures; escaping requires success vs. a DC %{spellDifficultyClass.%tradition} on an unarmed attack or inflicting 12 HP vs. Armor Class %{spellDifficultyClass.%tradition}"',
  'Blade Barrier':
    'Level=6 ' +
    'Trait=Evocation,Force ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\'x120\'x2\\" wall inflicts 7d8 HP force for 1 min (<b>save basic Reflex</b>; critical failure prevents passage) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Bless':
    'Level=1 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"5\' radius gives allies +1 attack for 1 min; a concentrate action each rd increases the radius by 5\'"',
  'Blindness':
    'Level=3 ' +
    'Trait=Incapacitation,Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Blinds the target for 1 min (<b>save Fortitude</b> effects last until next turn; critical success negates; critical failure inflicts permanent blindness)"',
  'Blink':
    'Level=4 ' +
    'Trait=Conjuration,Teleportation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains resistance 5 to non-force damage and can use Sustain to randomly teleport 10\' for 1 min (<b>heightened +2</b> gives +3 resistance)"',
  'Blur':
    'Level=2 ' +
    'Trait=Illusion,Veil ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Touched becomes concealed for 1 min"',
  'Breath Of Life':
    'Level=5 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Prevents the triggering target\'s death, restoring 4d8+%{spellModifier.%tradition} HP"',
  'Burning Hands':
    'Level=1 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP fire (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Calm Emotions':
    'Level=2 ' +
    'Trait=Emotion,Enchantment,Incapacitation,Mental ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst calms creatures and prevents them from taking hostile actions while sustained for up to 1 min; a hostile action ends the spell for the target (<b>save Will</b> inflicts -1 attack; critical success negates; critical failure allows the effects to continue after a hostile action)"',
  'Cataclysm':
    'Level=10 ' +
    'Trait=Acid,Air,Cold,Earth,Electricity,Evocation,Fire,Water ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="R1000\' 60\' burst inflicts 3d10 HP each acid, bludgeoning three times, cold, electricity, and fire, ignoring resistance 10 (<b>save basic Reflex</b>)"',
  'Chain Lightning':
    'Level=6 ' +
    'Trait=Electricity,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Inflicts 8d12 HP electricity on a chain of targets, jumping up to 30\' between each (<b>save basic Reflex</b>; critical success ends the chain) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Charm':
    'Level=1 ' +
    'Trait=Emotion,Enchantment,Incapacitation,Mental ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target becomes friendly, or helpful if already friendly, and cannot use hostile actions against self for 1 hr (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure makes the target helpful) (<b>heightened 4th</b> effects last until next daily prep; <b>heightened 8th</b> effects last until next daily prep and affect 10 targets)"',
  'Chill Touch':
    'Level=1 ' +
    'Trait=Cantrip,Necromancy,Negative ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 1d4+%{spellModifier.%tradition} HP negative on a living creature (<b>save basic Fortitude</b>; critical failure also inflicts enfeebled 1 for 1 rd) or flat-footed on an undead for 1 rd (<b>save Fortitude</b> negates; critical failure also inflicts fleeing for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP on living)"',
  'Chilling Darkness':
    'Level=3 ' +
    'Trait=Attack,Cold,Darkness,Evocation,Evil ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 5d6 HP cold, plus 5d6 HP evil on celestials, (double HP on a critical success) and makes a counteract attempt vs. magical light (<b>heightened +1</b> inflicts +2d6 HP cold and evil)"',
  'Chromatic Wall':
    'Level=5 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 60\'x30\' wall shines 20\' light and inflicts randomly-chosen effects on passing objects and creatures for 10 min: (1) destroys ammunition and inflicts 20 HP fire on creatures (<b>save basic Reflex</b>; <i>Cone Of Cold</i> counteracts); (2) destroys thrown weapons and inflicts 25 HP acid on creatures (<b>save basic Reflex</b>; <i>Gust Of Wind</i> counteracts); (3) negates energy effects and inflicts 30 HP electricity on creatures (<b>save basic Reflex</b>; <i>Disintegrate</i> counteracts); (4) blocks gasses and inflicts 10 HP poison and enfeebled 1 for 1 min on creatures (<b>save basic Fortitude</b> also negates enfeebled; <i>Passwall</i> counteracts) (<b>heightened 7th</b> effects last for 1 hr, inflicts +10 HP, and adds more effects possibilities: (5) negates petrification, sonic, and visual effects and inflicts <i>Flesh To Stone</i> on creatures (<i>Magic Missile</i> counteracts); (6) negates divination and mental effects and inflicts <i>Warp Mind</i> on creatures (<i>Searing Light</i> counteracts); (7) negates targeted spells and inflicts slowed 1 for 1 min on creatures (<b>save Will</b> negates; critical failure teleports to another plane; <i>Dispel Magic</i> counteracts); (8) effects as another option, but with -2 saves)"',
  'Circle Of Protection':
    'Level=3 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"10\' emanation around touched gives +1 Armor Class and saves vs. creatures of a specified alignment, and +3 vs. summoned creatures and on effects that control touched, for 1 min (<b>heightened 4th</b> effects last for 1 hr)"',
  'Clairaudience':
    'Level=3 ' +
    'Trait=Divination,Scrying ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to listen from the target location for 10 min"',
  'Clairvoyance':
    'Level=4 ' +
    'Trait=Divination,Scrying ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location for 10 min"',
  'Cloak Of Colors':
    'Level=5 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creatures adjacent to the target suffer dazzled, and successful attackers suffer blinded for 1 rd, for 1 min (<b>save Will</b> negates; critical failure inflicts stunned for 1 rd)"',
  'Cloudkill':
    'Level=5 ' +
    'Trait=Death,Necromancy,Poison ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a cloud in a 20\' burst that inflicts 6d8 HP poison and moves away 10\' each rd for 1 min (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Collective Transposition':
    'Level=6 ' +
    'Trait=Conjuration,Teleportation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Teleports 2 targets within a 30\' radius (<b>save Will</b> negates; critical success allows the target to control the teleport) (<b>heightened +1</b> affects +1 target)"',
  'Color Spray':
    'Level=1 ' +
    'Trait=Illusion,Incapacitation,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts stunned 1, blinded for 1 rd, and dazzled for 1 min (<b>save Will</b> inflicts dazzled for 1 rd only; critical success negates; critical failure extends blindness to 1 min)"',
  'Command':
    'Level=1 ' +
    'Trait=Auditory,Enchantment,Linguistic,Mental ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target obeys a command to approach, run away, drop a held object, drop prone, or stand in place for 1 rd (<b>save Will</b> negates; critical failure causes the target to use all actions on its next turn to obey) (<b>heightened 5th</b> affects 10 targets)"',
  'Comprehend Language':
    'Level=2 ' +
    'Trait=Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target understands a chosen heard language for 1 hr (<b>heightened 3rd</b> the target can also speak the language; <b>4th</b> affects 10 targets)"',
  'Cone Of Cold':
    'Level=5 ' +
    'Trait=Cold,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 12d6 HP cold (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Confusion':
    'Level=4 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts confused for 1 min or until a successful save (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure allows no further save attempts) (<b>heightened 8th</b> affects 10 targets)"',
  'Contingency':
    'Level=7 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Prepares a spell of up to 3 actions and 4th level to activate as a Reaction to a specified trigger (<b>heightened 8th</b> allows a 5th level spell; <b>9th</b> allows a 6th level spell; <b>10th</b> allows a 7th level spell)"',
  'Continual Flame':
    'Level=2 ' +
    'Trait=Evocation,Light ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=3 ' +
    'Description="Touched object emits a heatless flame until dismissed"',
  'Control Water':
    'Level=5 ' +
    'Trait=Evocation,Water ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="R500\' Raises or lowers water by 10\' and slows water creatures in a 50\'x50\' area"',
  'Create Food':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 hr" ' +
    'Description=' +
      '"R30\' Creates food for 6 Medium creatures that lasts for 1 day (<b>heightened 4th</b> creates food for 12; <b>6th</b> creates food for 50; <b>8th</b> creates food for 200)"',
  'Create Water':
    'Level=1 ' +
    'Trait=Conjuration,Water ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description="Creates 2 gallons of water that last for 1 day"',
  'Creation':
    'Level=4 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R0\' Creates an object of up to 5 cubic feet made of vegetable matter that lasts for 1 hr (<b>heightened 5th</b> object can include metal and common minerals)"',
  'Crisis Of Faith':
    'Level=3 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 6d6 HP mental, or 6d8 HP mental and stupefied 1 for 1 rd on divine casters (<b>save Will</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, stupefied 1 for 1 rd, and no divine casting for 1 rd) (<b>heightened +1</b> inflicts +2d6 HP, or +2d8 HP on divine casters)"',
  'Crusade':
    'Level=9 ' +
    'Trait=Uncommon,Enchantment,Linguistic,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 4 targets dedicate their actions to a specified cause for 10 min; the spell ends if an ally attacks a target or for a level 14+ target reduced to half HP (<b>save Will</b> for level 15+ each rd ends the spell) (<b>heightened 10th</b> the spell ends only for a level 16+ target reduced to half HP or a level 17+ target who saves)"',
  'Crushing Despair':
    'Level=5 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone prevents Reactions, and failure on a second save inflicts slowed 1, for 1 min (<b>save Will</b> effects last for 1 turn; critical success negates; critical failure inflicts slowed 1 for 1 min with no second save) (<b>heightened 7th</b> affects a 60\' cone)"',
  'Dancing Lights':
    'Level=1 ' +
    'Trait=Cantrip,Evocation,Light ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Creates 4 floating torch lights in a 10\' radius that can be moved 60\' each rd while sustained"',
  'Darkness':
    'Level=2 ' +
    'Trait=Darkness,Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' burst suppresses natural light and magical light of equal or lesser level for 1 min (<b>heightened 4th</b> conceals targets within the darkness from creatures with darkvision)"',
  'Darkvision':
    'Level=2 ' +
    'Trait=Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to see in darkness for 1 hr (<b>heightened 3rd</b> affects a touched target; <b>5th</b> effects last until next daily prep)"',
  'Daze':
    'Level=1 ' +
    'Trait=Cantrip,Enchantment,Mental,Nonlethal ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Inflicts %{spellModifier.%tradition} HP mental (<b>save basic Will</b>; critical failure also inflicts stunned 1) (<b>heightened +2</b> inflicts +1d6 HP)"',
  'Deafness':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts deafness for 10 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure inflicts permanent deafness)"',
  'Death Knell':
    'Level=2 ' +
    'Trait=Death,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Kills a touched target with 0 HP and gives self 10 temporary HP and +1 attack and damage for 10 min (<b>save Will</b> increases the target\'s dying value by 1; critical success negates)"',
  'Death Ward':
    'Level=5 ' +
    'Trait=Abjuration ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +4 saves vs. death and negative effects, negative resistance 10, and suppressed doomed effects for 10 min"',
  'Detect Alignment':
    'Level=1 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals auras of a specified alignment (<b>heightened 2nd</b> reveals each aura\'s location and strength)"',
  'Detect Magic':
    'Level=1 ' +
    'Trait=Cantrip,Detection,Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals the presence of magic and lower-level illusions (<b>heightened 3rd</b> reveals the school of the highest-level effect; <b>4th</b> reveals the approximate location of the highest-level effect)"',
  'Detect Poison':
    'Level=1 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Reveals whether the target creature or object is venomous or poisoned (<b>heightened 2nd</b> reveals the number and types of poison)"',
  'Detect Scrying':
    'Level=4 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation reveals scrying effects, along with the scrying creature for lower-level effects, for 1 hr (<b>heightened 6th</b> effects last until next daily prep)"',
  'Dimension Door':
    'Level=4 ' +
    'Trait=Conjuration,Teleportation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Teleports self to a visible location within 120\' (<b>heightened 5th</b> allows teleporting to a familiar location within 1 mile)"',
  'Dimensional Anchor':
    'Level=4 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Attempts to counteract any effect that would move the target to a different plane for 10 min (<b>save Will</b> effects last for 1 min; critical success negates; critical failure effects last for 1 hr)"',
  'Dimensional Lock':
    'Level=7 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 60\' burst attempts to counteract any teleportation or planar travel until next daily prep"',
  'Dinosaur Form':
    'Level=4 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large dinosaur with 15 temporary HP, Armor Class %{level+18}, +16 attack, +9 damage, low-light vision, 30\' imprecise scent, +18 Athletics modifier, and creature-specific attacks for 1 min (<b>heightened 5th</b> becomes a Huge creature with 15\' or 20\' reach, 20 temporary HP, +18 attack, +6 damage with double damage dice, +21 Athletics; <b>7th</b> becomes a Gargantuan creature with 20\' or 25\' reach, Armor Class %{level+21}, 25 temporary HP, +25 attack, +15 damage with double damage dice, +25 Athletics)"',
  'Disappearance':
    'Level=8 ' +
    'Trait=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="Touched becomes undetectable by any sense for 10 min"',
  'Discern Lies':
    'Level=4 ' +
    'Trait=Uncommon,Divination,Mental,Revelation ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="Self gains +4 Perception vs. lies for 10 min"',
  'Discern Location':
    'Level=8 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals the exact location of a specified familiar creature or object for 10 min"',
  'Disintegrate':
    'Level=6 ' +
    'Trait=Attack,Evocation ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 12d10 HP, reducing the target to dust at 0 HP, or destroys a non-artifact 10\' cube object (<b>save basic Fortitude</b>; critical hit worsens save by 1 degree) (<b>heightened +1</b> inflicts +2d10 HP)"',
  'Disjunction':
    'Level=9 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Makes a counteract check to deactivate a non-artifact magic item; critical success destroys it"',
  'Dispel Magic':
    'Level=2 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Makes a counteract check to remove 1 spell effect from the target or to make a magic item inert for 10 min"',
  'Disrupt Undead':
    'Level=1 ' +
    'Trait=Cantrip,Necromancy,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d6+%{spellModifier.%tradition} HP positive on an undead target (<b>save basic Fortitude</b>; critical failure also inflicts enfeebled 1 for 1 rd) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Disrupting Weapons':
    'Level=1 ' +
    'Trait=Necromancy,Positive ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Two touched weapons inflict +1d4 HP positive vs. undead for 1 min (<b>heightened 3rd</b> weapons inflict +2d4 HP; <b>5th</b> three weapons inflict +3d4 HP)"',
  'Divine Aura':
    'Level=8 ' +
    'Trait=Abjuration,Aura ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' emanation gives allies +1 Armor Class and saves, +2 vs. creatures opposed to a specified alignment, and +4 vs. opposed alignment control, and blinds melee attackers of opposed alignment (<b>save Will</b> negates), while sustained for up to 1 min; the first Sustain each rd increases the emanation radius by 10\'"',
  'Divine Decree':
    'Level=7 ' +
    'Trait=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R40\' 40\' emanation inflicts 7d10 HP specified alignment damage; creatures of opposed alignment also suffer enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, banishment, and, for creatures of level 10 and lower, paralysis for 1 min (<b>save Will</b> negates; critical failure inflicts death); matching alignment negates; neutral alignment improves save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP and increases the level of creatures that suffer paralysis by 2)"',
  'Divine Inspiration':
    'Level=8 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched recovers 1 6th-level or lower spell or slot or regains Focus Points"',
  'Divine Lance':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP of chosen alignment, or double HP on a critical success (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Divine Vessel':
    'Level=7 ' +
    'Trait=Morph,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes Large and gains 40 temporary HP, %{speed}\' fly Speed, +1 vs. spells, darkvision, and fist, bite, or claw attacks that inflict 2d8 HP, 2d10 HP, or 2d10 HP, inflicts +1 HP of chosen alignment, and suffers weakness 10 to the opposite alignment for 1 min (<b>heightened 9th</b> gives 60 temporary HP and weakness 15, lasting 10 min)"',
  'Divine Wrath':
    'Level=4 ' +
    'Trait=Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts 4d10 HP of chosen alignment and sickened 1 (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts sickened 2 and slowed 1; matching alignment negates; neutral alignment improves save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Dominate':
    'Level=6 ' +
    'Trait=Uncommon,Enchantment,Incapacitation,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self controls the actions of the target until next daily prep; a successful save at end of each turn ends the spell (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure allows further saves only upon repugnant orders) (<b>heightened 10th</b> effects are permanent)"',
  'Dragon Form':
    'Level=6 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large dragon with 40\' Speed, 100\' fly Speed, 10 temporary HP, Armor Class %{level+18}, +22 attack, +6 damage, a breath weapon, resistance 10 to the breath weapon damage type, darkvision, 60\' imprecise scent, +23 Athletics modifier, and creature-specific features for 1 min (<b>heightened 8th</b> becomes a Huge creature with 120\' fly speed, +5\' reach, 15 temporary HP, Armor Class %{level+21}, +28 attack, +12 damage (breath weapon +14), +28 Athletics)"',
  'Dream Council':
    'Level=8 ' +
    'Trait=Illusion,Mental,Sleep ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Allows 12 known targets to communicate through a shared dream for 1 hr"',
  'Dream Message':
    'Level=3 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Self sends 1 min of speech to a familiar creature, received the next time they sleep (<b>heightened 4th</b> sends speech to 10 familiar creatures)"',
  'Dreaming Potential':
    'Level=5 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched receives a day of downtime retraining during 8 hr sleep"',
  'Drop Dead':
    'Level=5 ' +
    'Trait=Uncommon,Illusion,Visual ' +
    'Traditions=Arcane,Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Upon receiving the triggering wound, the target becomes invisible and is replaced by an illusionary corpse while sustained for up to 1 min; a hostile act by the target ends the spell (<b>heightened 7th</b> a hostile act does not end the spell)"',
  'Duplicate Foe':
    'Level=7 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Creates a minion copy of a target up to level 15 with 70 HP and no special abilities while sustained for up to 1 min or until reduced to 0 HP; the copy loses 4d6 HP after each turn (<b>save Fortitude</b> the copy inflicts half HP and lasts 2 rd; critical success negates) (<b>heightened +1</b> increases the target level that can be copied by 2 and the copy HP by 10)"',
  'Earthbind':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Brings a flying target to the ground and prevents flight and levitation for 1 rd (<b>save Fortitude</b> grounds target but does not prevent flight; critical success negates; critical failure effects last for 1 min)"',
  'Earthquake':
    'Level=8 ' +
    'Trait=Earth,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst inflicts difficult terrain, -2 attacks, Armor Class, and skill checks, a 40\' fall (<b>save Reflex</b> negates), and structure collapse that inflicts 11d6 HP bludgeoning and knocked prone (<b>save Reflex</b> inflicts half HP and knocked prone; critical success inflicts half HP only; critical failure causes the fall save to fail) (<b>heightened 10th</b> increases range to a half mile and effect area to a quarter-mile burst)"',
  'Eclipse Burst':
    'Level=7 ' +
    'Trait=Cold,Darkness,Necromancy,Negative ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst attempts to counteract magical light and inflicts 8d10 HP cold, plus 8d4 HP negative to living creatures (<b>save basic Reflex</b>; critical failure also inflicts permanent blindness) (<b>heightened +1</b> inflicts +1d10 HP cold and +1d4 HP negative)"',
  'Electric Arc':
    'Level=1 ' +
    'Trait=Cantrip,Electricity,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+%{spellModifier.%tradition} electricity on 1 or 2 targets (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Elemental Form':
    'Level=5 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium elemental with 10 temporary HP, Armor Class %{level+19}, +18 attack, +9 damage, darkvision, +20 Acrobatics (air or fire) or Athletics (earth or water) modifier, and creature-specific features for 1 min (<b>heightened 6th</b> becomes a Large creature with 10\' reach, 15 temporary HP, Armor Class %{level+22}, +23 attack, +13 damage, +23 Acrobatics or Athletics; <b>7th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, Armor Class %{level+22}, +25 attack, +11 damage and double damage dice, and +25 Acrobatics or Athletics)"',
  'Endure Elements':
    'Level=2 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Protects touched from severe cold or heat until next daily prep (<b>heightened 3rd</b> protects from both cold and heat; <b>5th</b> protects from extreme cold and heat</b>)"',
  'Energy Aegis':
    'Level=7 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touched gains resistance 5 to acid, cold, electricity, fire, force, negative, positive, and sonic damage for 1 min (<b>heightened 9th</b> gives resistance 10)"',
  'Enhance Victuals':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Improves the quality of touched 1 gallon of water or 5 pounds of food for 1 hr and attempts to counteract any poison (<b>heightened +1</b> affects +1 gallon or +5 pounds</b>"',
  'Enlarge':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target becomes Large, gaining 10\' reach, +2 melee damage, and clumsy 1 for 5 min (<b>heightened 4th</b> target becomes Huge, gaining 15\' reach and +4 melee damage; <b>8th</b> affects 10 creatures)"',
  'Entangle':
    'Level=2 ' +
    'Trait=Plant,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts difficult terrain and -10\' Speed for 1 min (<b>save Reflex</b> inflicts difficult terrain only; critical failure inflicts immobilized for 1 rd)"',
  'Enthrall':
    'Level=3 ' +
    'Trait=Auditory,Emotion,Enchantment ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Fascinates creatures within 120\' while sustained, with additional saves for disagreement (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure allows no further saves)"',
  'Ethereal Jaunt':
    'Level=7 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Moves self from the Material Plane to the Ethereal Plane while sustained for up to 1 min (<b>heightened 9th</b> R30\' affects 5 additional willing creatures, and effects last for 10 min)"',
  'Fabricated Truth':
    'Level=10 ' +
    'Trait=Enchantment,Incapacitation,Mental ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R100\' 5 targets believe a specified statement for 1 week (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure effects are permanent)"',
  'Faerie Fire':
    'Level=2 ' +
    'Trait=Evocation,Light ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst makes concealed creatures visible and invisible creatures concealed for 5 min"',
  'False Life':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains %{6+spellModifier.%tradition} temporary HP for 8 hr (<b>heightened +1</b> gives +3 HP)"',
  'False Vision':
    'Level=5 ' +
    'Trait=Uncommon,Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Controls the image shown by scrying within a 100\' burst until next daily prep"',
  'Fear':
    'Level=1 ' +
    'Trait=Emotion,Enchantment,Fear,Mental ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts frightened 2 (<b>save Will</b> inflicts frightened 1; critical success negates; critical failure inflicts frightened 3 and fleeing for 1 rd) (<b>heightened 3rd</b> affects 5 targets)"',
  'Feather Fall':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Falling target slows to 60\' per rd and suffers no falling damage for 1 min or until landing"',
  'Feeblemind':
    'Level=6 ' +
    'Trait=Curse,Enchantment,Incapacitation,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts stupefied 4 until the curse is removed (<b>save Will</b> inflicts stupefied 2 for 1 rd; critical success negates; critical failure inflicts permanent animal intelligence and -5 Charisma, Intelligence, and Wisdom modifiers and changes a PC into an NPC)"',
  'Feet To Fins':
    'Level=3 ' +
    'Trait=Morph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched can swim at full Speed but slows to 5\' on land for 10 min (<b>heightened 6th</b> effects last until next daily prep)"',
  'Field Of Life':
    'Level=6 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 20\' burst restores 1d8 HP per rd to living and inflicts 1d8 HP positive per rd to undead while sustained for up to 1 min (<b>heightened 8th</b> restores and inflicts 1d10 HP; <b>9th</b> restores and inflicts 1d12 HP)"',
  'Fiery Body':
    'Level=7 ' +
    'Trait=Fire,Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains fire immunity and resistance 10 to precision damage, suffers weakness 5 to cold and water, inflicts 3d6 HP fire on non-reach melee attackers, gains +1d4 HP fire on unarmed attacks and an additional die of damage on fire spells, can cast <i>Produce Flame</i> using 1 action as an innate spell, gains a 40\' fly Speed, and does not need to breathe for 1 min (<b>heightened 9th</b> inflicts 4d6 HP fire on non-reach melee attackers, inflicts +2d4 HP fire on unarmed attacks, and increases fly Speed to 60\')"',
  'Finger Of Death':
    'Level=7 ' +
    'Trait=Death,Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R30\' Target suffers 70 HP negative, dying at 0 HP (<b>heightened +1</b> inflicts +10 HP)"',
  'Fire Seeds':
    'Level=6 ' +
    'Trait=Evocation,Fire,Plant ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates 4 acorns that can be thrown 30\', inflicting 4d6 HP fire in a 5\' burst and continuing to inflict 2d6 HP fire for 1 min (<b>save basic Reflex</b>) (<b>heightened 8th</b> inflicts 5d6 HP initial and 3d6 HP for 1 min; <b>9th</b> inflicts 6d6 HP initial and 3d6 HP for 1 min)"',
  'Fire Shield':
    'Level=4 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains cold resistance 5, and melee attackers suffer 2d6 HP fire, for 1 min (<b>heightened +2</b> gives cold resistance +5 and inflicts +1d6 HP)"',
  'Fireball':
    'Level=3 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 20\' burst inflicts 6d6 HP fire (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Flame Strike':
    'Level=5 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' radius inflicts 8d6 HP fire, ignoring half of any resistance (<b>save basic Reflex</b>; fire immunity improves save by 1 degree) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Flaming Sphere':
    'Level=2 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Movable flame inflicts 3d6 HP fire in a 15\' sq while sustained for up to 1 min (<b>save basic Reflex</b>; success negates) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Fleet Step':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="Self gains +30\' Speed for 1 min"',
  'Flesh To Stone':
    'Level=6 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts initial slowed 1; subsequent failed or successful saves each rd increase or decrease the degree slowed until the target is no longer slowed or becomes immobile and permanently turned to stone (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates; critical failure inflicts initial slowed 2)"',
  'Floating Disk':
    'Level=1 ' +
    'Trait=Conjuration,Force ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates an invisible 2\' radius disk that follows self and holds 5 Bulk for 8 hr"',
  'Fly':
    'Level=4 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains a fly Speed of the greater of its Speed or 20\' for 5 min (<b>heightened 7th</b> effects last for 1 hr)"',
  'Forbidding Ward':
    'Level=1 ' +
    'Trait=Abjuration,Cantrip ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +1 Armor Class and saves vs. a specified foe while sustained for up to 1 min (<b>heightened 6th</b> gives +2 Armor Class and saves)"',
  'Foresight':
    'Level=9 ' +
    'Trait=Divination,Mental,Prediction ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +2 initiative and does not suffer flat-footed vs. undetected and flanking creatures, and self may use a Reaction to give the target the better of two rolls or its foe the worse of two rolls, for 1 hr"',
  'Freedom Of Movement':
    'Level=4 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Relieves touched of Speed penalty effects and gives automatic success on Escape attempts vs. non-magical effects and magical effects up to the spell level for 10 min"',
  'Gaseous Form':
    'Level=4 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched becomes vapor with resistance 8 to physical damage, immunity to precision damage, proficiency modifier for unarmored defense, and 10\' fly Speed  for 5 min or until the target or self ends the spell"',
  'Gate':
    'Level=10 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Opens a 40\' radius gate to another plane while sustained for up to 1 min"',
  'Gentle Repose':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched corpse does not decay and cannot be made undead until next daily prep (<b>heightened 5th</b> effects are permanent)"',
  'Ghost Sound':
    'Level=1 ' +
    'Trait=Auditory,Cantrip,Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates sound equivalent to four humans shouting while sustained (<b>heightened 3rd</b> R60\'; <b>5th</b> R120\')"',
  'Ghostly Weapon':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched weapon becomes translucent and can affect incorporeal creatures for 5 min"',
  'Ghoulish Cravings':
    'Level=2 ' +
    'Trait=Disease,Evil,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 2 ghoul fever, which inflicts 3d8 HP negative and half normal healing; subsequent daily save failures will inflict an additional 3d8 HP at stage 3, 3d8 HP and no healing at stage 4 and stage 5, and death and transformation into a ghoul at stage 6 (<b>save Fortitude</b> inflicts stage 1 with no initial ill effects; critical success negates; critical failure inflicts stage 3)"',
  'Glibness':
    'Level=4 ' +
    'Trait=Uncommon,Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +%{rank.Deception?4:(4+level)} Deception to lie and against Perception to discern truth for 10 min"',
  'Glitterdust':
    'Level=2 ' +
    'Trait=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst inflicts dazzled and negates invisibility for 1 min (<b>save Reflex</b> negates invisibility only for 2 rd; critical success negates; critical failure blinds for 1 rd and dazzles and negates invisibility for 10 min)"',
  'Globe Of Invulnerability':
    'Level=4 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="10\' burst attempts to counteract outside spells at the spell level - 1 for 10 min"',
  'Glyph Of Warding':
    'Level=3 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Specified trigger on a target container or 10\'x10\' area triggers a chosen spell of lower level"',
  'Goblin Pox':
    'Level=1 ' +
    'Trait=Disease,Necromancy ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers stage 1 goblin pox, which inflicts sickened 1 for 1 rd; subsequent failures after 1 rd will inflict sickened 1 and slowed 1 for 1 rd at stage 2, and incurably sickened 1 for 1 dy at stage 3 (<b>save Fortitude</b> inflicts sickened 1 only; critical success negates; critical failure inflicts stage 2; goblins and goblin dogs are immune)"',
  'Grease':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 4 5\' squares cause falls, or 1 target object inflicts a -2 penalty to checks, for 1 min (<b>save Reflex or Acrobatics</b> negates; critical failure causes the holder to drop the target object)"',
  'Grim Tendrils':
    'Level=1 ' +
    'Trait=Necromancy,Negative ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' line inflicts 2d4 HP negative and 1 HP persistent bleed on living creatures (<b>save Fortitude</b> inflicts half HP negative only; critical success negates; critical failure inflicts double initial and persistent HP) (<b>heightened +1</b> inflicts +2d4 HP initial and +1 HP persistent)"',
  'Guidance':
    'Level=1 ' +
    'Trait=Cantrip,Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +1 on an attack, Perception, save, or skill check within 1 rd once per target per hr"',
  'Gust Of Wind':
    'Level=1 ' +
    'Trait=Air,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line extinguishes small, non-magical fires, disperses fog, moves light objects, and knocks prone creatures up to Large for 1 rd (<b>save Fortitude</b> prevents moving against the wind but does not knock prone; critical success negates; critical failure pushes 30\', knocks prone, and inflicts 2d6 HP bludgeoning)"',
  'Hallucination':
    'Level=5 ' +
    'Trait=Illusion,Incapacitation,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Changes target\'s perception of an object or group for 1 hr (<b>save Will</b> target knows that it\'s hallucinating; critical success negates; critical failure inflicts -4 saves to disbelieve) (<b>heightened 6th</b> affects 10 targets or effects last until next daily prep; <b>8th</b> affects any number of targets or effects are permanent)"',
  'Hallucinatory Terrain':
    'Level=4 ' +
    'Trait=Uncommon,Illusion ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' 50\' burst illusion changes the look, sound, feel, and smell of the terrain until next daily prep (<b>heightened 5th</b> the illusion can mask or incorporate structures)"',
  'Harm':
    'Level=1 ' +
    'Trait=Necromancy,Negative ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched (2 or 3 actions gives R30\' or a 30\' emanation) suffers 1d%{harmSpellDie} HP negative (<b>save basic Fortitude</b>); undead instead regain 1d%{harmSpellDie} HP, or 1d%{harmSpellDie}+8 HP with 2 actions (<b>heightened +1</b> restores or inflicts +1d%{harmSpellDie} HP; undead regain +8 HP with 2 actions)"',
  'Haste':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains an extra Strike or Stride action each rd for 1 min (<b>heightened 7th</b> affects 6 targets)"',
  'Heal':
    'Level=1 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast=0 ' +
    'Description=' +
      '"Touched (2 or 3 actions gives R30\' or a 30\' emanation) regains 1d%{healSpellDie} HP, or 1d%{healSpellDie}+8 HP with 2 actions; undead instead suffer 1d%{healSpellDie} HP (<b>save basic Fortitude</b>) (<b>heightened +1</b> restores or inflicts +1d%{healSpellDie} HP; restores +8 HP with 2 actions)"',
  'Heroism':
    'Level=3 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +1 attack, Perception, saves, and skill checks for 10 min (<b>heightened 6th</b> gives +2 bonus; <b>8th</b> gives +3 bonus)"',
  'Hideous Laughter':
    'Level=2 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts slowed 1 and loss of Reactions while sustained (<b>save Will</b> inflicts loss of Reactions only; critical success negates; critical failure inflicts prone for 1 rd, then slowed 1 and loss of Reactions)"',
  'Holy Cascade':
    'Level=4 ' +
    'Trait=Evocation,Good,Positive,Water ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 20\' burst inflicts 3d6 HP bludgeoning, plus 6d6 HP positive to undead and 6d6 HP good to fiends (<b>heightened +1</b> inflicts +1d6 HP bludgeoning and +2d6 HP positive and good)"',
  'Horrid Wilting':
    'Level=8 ' +
    'Trait=Necromancy,Negative ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Targets in a 500\' radius suffer 10d10 HP negative (<b>save basic Fortitude</b>; plant and water creatures worsen save by 1 degree) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Humanoid Form':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Small or Medium humanoid and gains +4 Deception to pass as the chosen ancestry for 10 min (<b>heightened 3rd</b> gives darkvision or low-light vision if appropriate to the ancestry; <b>5th</b> becomes a Large humanoid)"',
  'Hydraulic Push':
    'Level=1 ' +
    'Trait=Attack,Evocation,Water ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 3d6 HP bludgeoning and a 5\' push (double HP and distance with a critical success) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Hydraulic Torrent':
    'Level=4 ' +
    'Trait=Evocation,Water ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line inflicts 8d6 HP bludgeoning and a 5\' push (<b>save basic Fortitude</b>; success negates push; critical failure doubles push distance)"',
  'Hypercognition':
    'Level=3 ' +
    'Trait=Divination ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="Allows self to use 6 Recall Knowledge actions immediately"',
  'Hypnotic Pattern':
    'Level=3 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst inflicts dazzled and fascinated while sustained for up to 1 min (<b>save Will</b> inflicts dazzled only; critical failure inflicts loss of Reactions)"',
  'Illusory Creature':
    'Level=2 ' +
    'Trait=Auditory,Illusion,Olfactory,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Creates an image of a Large or smaller creature with Armor Class %{spellDifficultyClass.%tradition}, +%{spellAttackModifier.%tradition} attack, 1d4+%{spellModifier.%tradition} HP nonlethal mental damage, and +%{spellDifficultyClass.%tradition-10} saves while sustained or until damaged; each Sustain allows directing two actions (<b>heightened +1</b> creature inflicts +1d4 HP and can be one size larger)"',
  'Illusory Disguise':
    'Level=1 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes self appear different and gives +%{4+(rank.Deception?0:level)} Deception to avoid uncovering the disguise for 1 hr (<b>heightened 2nd</b> also disguises voice and scent; <b>3rd</b> allows copying a specific individual)"',
  'Illusory Object':
    'Level=1 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Creates an image of a stationary object in a 20\' burst for 10 min (<b>heightened 2nd</b> effects include sounds and smells and last for 1 hr; <b>5th</b> effects are permanent)"',
  'Illusory Scene':
    'Level=5 ' +
    'Trait=Auditory,Illusion,Olfactory,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Creates in a 30\' burst a moving illusion with up to 10 creatures or objects, sounds, and smells for 1 hr (<b>heightened 6th</b> creatures in the scene can speak; <b>8th</b> effects are permanent)"',
  'Implosion':
    'Level=9 ' +
    'Trait=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 75 HP on 1 target each rd while sustained for up to 1 min; a target cannot be affected twice by a single casting (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +10 HP)"',
  'Insect Form':
    'Level=3 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium critter with 10 temporary HP, Armor Class %{level+18}, +13 attack, +2 damage, low-light vision, +13 Athletics modifier, and creature-specific features for 1 min (<b>heightened 4th</b> becomes a Large creature with 10\' reach, 15 temporary HP, +16 attack, +6 damage, +16 Athletics; <b>5th</b> becomes a Huge creature with 15\' reach, 20 temporary HP, +18 attack, +2 damage and double damage dice, +20 Athletics)"',
  'Invisibility':
    'Level=2 ' +
    'Trait=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched becomes invisible for 10 min or until it uses a hostile action (<b>heightened 4th</b> effects last for 1 min, and a hostile action does not end the spell)"',
  'Invisibility Sphere':
    'Level=3 ' +
    'Trait=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"10\' emanation makes creatures within invisible for 10 min or until any affected performs a hostile act (<b>heightened 5th</b> effects last for 1 hr)"',
  'Item Facade':
    'Level=1 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes the target object up to a 10\' cube appear decrepit or perfect for 1 hr (<b>heightened 2nd</b> effects last for 24 hr; <b>3rd</b> effects are permanent)"',
  'Jump':
    'Level=1 ' +
    'Trait=Move,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self to jump 30\' immediately (<b>heightened 3rd</b> affects touched, and effects last for 1 min)"',
  'Knock':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Gives +4 Athletics or Thievery on attempts to open the target object for 1 min; untrained attempts by self gain an additional +%{level}"',
  'Know Direction':
    'Level=1 ' +
    'Trait=Cantrip,Detection,Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Reveals which direction is north (<b>heightened 7th</b> reveals direction to a familiar location)"',
  'Levitate':
    'Level=3 ' +
    'Trait=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to use concentrate actions to move the touched object or willing creature up or down 10\' for 5 min"',
  'Light':
    'Level=1 ' +
    'Trait=Cantrip,Evocation,Light ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched object lights a 20\' radius until next daily prep (<b>heightened 4th</b> lights a 60\' radius)"',
  'Lightning Bolt':
    'Level=3 ' +
    'Trait=Electricity,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"120\' line inflicts 4d12 HP electricity (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Locate':
    'Level=3 ' +
    'Trait=Uncommon,Detection,Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R500\' Reveals the direction to a named object or the nearest object of a named type while sustained; effects are blocked by lead and running water (<b>heightened 5th</b> reveals the direction to a creature or ancestry)"',
  'Lock':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched latch or lock opens only for self until next daily prep; a successful DC %{spellDifficultyClass.%tradition} Athletics or Thievery check (or lock DC + 4 if higher) ends the spell (<b>heightened 2nd</b> effects are permanent)"',
  'Longstrider':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +10\' Speed for 1 hr (<b>heightened 2nd</b> effects last for 8 hr)"',
  'Mage Armor':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains +1 Armor Class with a +5 maximum Dexterity modifier until next daily prep (<b>heightened 4th</b> also gives +1 saves; <b>6th</b> gives +2 Armor Class; <b>8th</b> gives +2 saves; <b>10th</b> gives +3 Armor Class and saves)"',
  'Mage Hand':
    'Level=1 ' +
    'Trait=Cantrip,Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Moves a light object 20\' per rd while sustained (<b>heightened 3rd</b> moves a Bulk 1 object; <b>5th</b> R60\'; <b>7th</b> moves a Bulk 2 object)"',
  'Magic Aura':
    'Level=1 ' +
    'Trait=Uncommon,Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Alters the magical aura of the target object, making it appear as non-magical, as a common magical item of up to twice the spell level, or as under the effects of a spell of up to the spell level, until next daily prep (<b>heightened 3rd</b> can affect a creature or all of its possessions)"',
  'Magic Fang':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched creature\'s unarmed attack gains +1 attack and 2 damage dice for 1 min"',
  'Magic Missile':
    'Level=1 ' +
    'Trait=Evocation,Force ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' 1 missile (2 or 3 actions gives 2 or 3 missiles) inflicts 1d4+1 HP force (<b>heightened +2</b> gives 1 additional missile per action)"',
  'Magic Mouth':
    'Level=2 ' +
    'Trait=Auditory,Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"The image of a mouth appears on the touched creature or object and speaks a specified message up to 25 words the next time a specified trigger occurs within 30\'"',
  'Magic Weapon':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description="Touched weapon gains +1 attack and 2 damage dice for 1 min"',
  'Magnificent Mansion':
    'Level=7 ' +
    'Trait=Uncommon,Conjuration,Extradimensional ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Creates an entrance to a 40\'x40\'x40\' demiplane that can only be entered by those specified, is staffed by servants, and contains provisions for up to 150 people"',
  "Mariner's Curse":
    'Level=5 ' +
    'Trait=Curse,Necromancy ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers incurable sickened 1, plus slowed 1 on open water, until the curse is removed (<b>save Will</b> inflicts curable sickened 1; critical success negates; critical success inflicts incurable sickened 2)"',
  'Mask Of Terror':
    'Level=7 ' +
    'Trait=Emotion,Fear,Illusion,Mental,Visual ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target inflicts frightened 2 for 1 rd on attackers for 1 min (<b>save Will</b> negates; critical failure prevents attack) (<b>heightened 8th</b> affects 5 targets)"',
  'Massacre':
    'Level=9 ' +
    'Trait=Death,Necromancy,Negative ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' line inflicts 100 HP negative on creatures up to level 17 and kills those reduced to 0 HP; if none die, it inflicts an additional 30 negative on all within the line, including self (<b>save Fortitude</b> inflicts 9d6 HP; critical success negates; critical failure kills) (<b>heightened 10th</b> inflicts 115 HP (<b>save Fortitude</b> 10d6 HP) on creatures up to level 19)"',
  'Maze':
    'Level=8 ' +
    'Trait=Conjuration,Extradimensional,Teleportation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transports the target to an extradimensional maze while sustained or until it has a critical success or 2 successive normal successes on DC %{spellDifficultyClass.%tradition} Survival or Perception checks"',
  'Meld Into Stone':
    'Level=3 ' +
    'Trait=Earth,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to enter a touched stone, retaining the ability to hear outside sounds, for 10 min"',
  'Mending':
    'Level=1 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Restores 5 HP per spell level to a light, non-magical object (<b>heightened 2nd</b> can affect a 1 Bulk object; <b>3rd</b> can affect a 2 Bulk or magical 1 Bulk object)"',
  'Message':
    'Level=1 ' +
    'Trait=Auditory,Cantrip,Illusion,Linguistic,Mental ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' Allows self to hold a private conversation with a visible target for 1 turn (<b>heightened 3rd</b> R500\')"',
  'Meteor Swarm':
    'Level=9 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 4 meteors each inflict 6d10 HP bludgeoning in a 10\' burst and 14d6 HP fire in a 40\' burst (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d10 HP bludgeoning and +2d6 HP fire)"',
  'Mind Blank':
    'Level=8 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target gains +4 saves vs. mental effects and automatic counteract attempts at the spell level + 1 vs. detection, revelation, and scrying until next daily prep"',
  'Mind Probe':
    'Level=5 ' +
    'Trait=Uncommon,Divination,Linguistic,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Self gains answers from the target, requiring a DC %{spellDifficultyClass.%tradition} Deception check to refuse to answer each, with critical success giving a believable false answer (<b>save Will</b> negates; critical failure inflicts -4 Deception)"',
  'Mind Reading':
    'Level=3 ' +
    'Trait=Uncommon,Detection,Divination,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Reveals the surface thoughts of the target and whether its intelligence is higher, lower, or equal (<b>save Will</b> reveals relative intelligence only; critical success allows the target to read self\'s surface thoughts instead; critical failure allows sustaining for up to 1 min with no further save attempts)"',
  'Mindlink':
    'Level=1 ' +
    'Trait=Divination,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Telepathically transmits 10 min of information from self to touched"',
  'Miracle':
    'Level=10 ' +
    'Trait=Divination ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known divine spell of up to 9th level or a common spell of up to 7th level"',
  'Mirror Image':
    'Level=2 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates three duplicates that have an equal chance of misdirecting attacks on self for 1 min; any hit on a duplicate destroys it, and a critical success also hits self with a normal success"',
  'Misdirection':
    'Level=2 ' +
    'Trait=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Changes the magical aura of one target to mimic a second target until next daily prep"',
  'Mislead':
    'Level=6 ' +
    'Trait=Illusion ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Turns self invisible and creates an illusory duplicate while sustained for up to 1 min; a successful Deception vs. Perception can make it appear that a self action originated with the duplicate"',
  'Modify Memory':
    'Level=4 ' +
    'Trait=Uncommon,Divination,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Changes 1 rd of the target\'s memory each rd while sustained for up to 5 min (<b>save Will</b> negates; critical success allows the target to notice the attempt) (<b>heightened 6th</b> erases all memory of a specified topic from a willing target)"',
  'Moment Of Renewal':
    'Level=8 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"6 touched instantly gain the effects of 24 hr of rest once per target per day"',
  'Monstrosity Form':
    'Level=8 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Huge phoenix, purple worm, or sea serpent with 20 temporary HP, Armor Class %{level+20}, +28 attack, darkvision, +30 Athletics modifier, and creature-specific attacks for 1 min (<b>heightened 9th</b> gives 25 temporary HP, Armor Class %{level+22}, +31 attack, an additional damage die, +33 Athletics)"',
  'Moon Frenzy':
    'Level=5 ' +
    'Trait=Morph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5 willing targets gain 5 temporary HP, +10\' Speed, fangs and claws that inflict 2d6 HP piercing and 2d6 HP slashing plus 1d4 HP persistent bleed on a critical hit, and increase a size up to Large in full moonlight, but suffer weakness 5 to silver, for 1 min (<b>heightened 6th</b> gives 10 temporary HP, inflict 3d6 HP piercing and 3d6 HP slashing, weakness 10 to silver; <b>10th</b> gives 20 temporary HP, inflict 4d6 HP piercing and 4d6 HP slashing, weakness 20 to silver)"',
  'Nature Incarnate':
    'Level=10 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Medium green man or Gargantuan kaiju with 30 temporary HP, Armor Class %{level+25}, +34 attack, darkvision, +36 Athletics modifier, and creature-specific attacks for 1 min"',
  "Nature's Enmity":
    'Level=9 ' +
    'Trait=Enchantment ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 5 targets in a 500\' burst suffer -10\' Speed, attacks from animals that inflict 2d10 HP slashing and flat-footed for 1 rd (DC 8 flat negates; <b>save basic Reflex</b>), a required DC 5 flat check to cast primal spells, and hostility from bonded animals, fungi, and plants for 10 min"',
  'Negate Aroma':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Negates the scent of a willing touched creature for 1 hr (<b>heightened 5th</b> R30\' affects 10 targets)"',
  'Neutralize Poison':
    'Level=3 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract check against 1 poison affecting touched"',
  'Nightmare':
    'Level=4 ' +
    'Trait=Illusion,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Causes a familiar target to have nightmares and awaken fatigued (<b>save Will</b> inflicts nightmares only; critical success negates; critical failure also inflicts drained 2 until no longer fatigued)"',
  'Nondetection':
    'Level=3 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched gains automatic counteract attempts vs. magical divinations for 8 hr"',
  'Obscuring Mist':
    'Level=2 ' +
    'Trait=Conjuration,Water ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description="R120\' 20\' burst conceals creatures for 1 min"',
  "Outcast's Curse":
    'Level=4 ' +
    'Trait=Curse,Enchantment,Mental,Misfortune ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers one step worse initial attitudes and the worse of two Deception, Diplomacy, Intimidation, and Performance rolls until the curse is removed (<b>save Will</b> effects last for 10 min; critical success negates; critical failure inflicts initial attitudes two steps worse)"',
  'Overwhelming Presence':
    'Level=9 ' +
    'Trait=Auditory,Enchantment,Incapacitation,Mental,Visual ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"40\' burst inflicts fascinated and forces creatures to pay tribute once per turn for six turns (<b>save Will</b> affected must pay tribute only twice; critical success negates; critical failure causes affected to use all actions each turn to pay tribute)"',
  'Paralyze':
    'Level=3 ' +
    'Trait=Enchantment,Incapacitation,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts paralyzed for 1 rd (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure inflicts paralyzed for 4 rd; subsequent successful saves shorten the effects by 1 rd, and a critical success ends them) (<b>heightened 7th</b> affects 10 targets)"',
  'Paranoia':
    'Level=2 ' +
    'Trait=Illusion,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target becomes unfriendly to all others for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure causes target to treat all others as enemies) (<b>heightened 6th</b> effects 5 targets)"',
  'Pass Without Trace':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Increases the DC to Track self by 4 or to %{spellDifficultyClass.%tradition}, whichever is higher, for 1 hr (<b>heightened 2nd</b> effects last for 8 hr; <b>4th</b> effects last for 8 hr and affect a 20\' radius and 10 creatures)"',
  'Passwall':
    'Level=5 ' +
    'Trait=Uncommon,Conjuration,Earth ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Creates a 5\'x10\'x10\' tunnel in wood, plaster, or stone for 1 hr (<b>heightened 7th</b> the tunnel extends 20\', appears as normal wall, and can be entered only using a password or trigger)"',
  'Pest Form':
    'Level=1 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Tiny animal with Armor Class %{level+15}, 20\' Speed, low-light vision, 30\' imprecise scent, +10 Athletics and Stealth modifiers, -4 Athletics modifier, and weakness 5 to physical damage for 10 min (<b>heightened 4th</b> becomes a creature with a 20\' fly Speed)"',
  'Phantasmal Calamity':
    'Level=6 ' +
    'Trait=Illusion,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 30\' burst inflicts 11d6 HP mental (<b>save basic Will</b>; critical failure also inflicts stunned 1 and trapped until a subsequent Will save each rd succeeds) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Phantasmal Killer':
    'Level=4 ' +
    'Trait=Death,Emotion,Fear,Illusion,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts 8d6 HP mental and frightened 2 (<b>save Will</b> inflicts 4d6 HP mental and frightened 1; critical success negates; critical failure inflicts death on a failed Fortitude save or 12d6 HP mental, fleeing for 1 rd, and frightened 1 on success) (<b>heightened +1</b> inflicts +2d6 HP, or +3d6 HP on a critical failure)"',
  'Phantom Pain':
    'Level=1 ' +
    'Trait=Illusion,Mental,Nonlethal ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 2d4 HP mental, 1d4 HP persistent mental, and sickened 1 for 1 min or until no longer sickened (<b>save Will</b> inflicts initial HP only; critical success negates; critical failure inflicts sickened 2) (<b>heightened +1</b> inflicts +2d4 HP initial and +1d4 HP persistent)"',
  'Phantom Steed':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"R30\' Conjures a magical mount (Armor Class 20, HP 10, 40\' Speed) that can be ridden only by a designated creature for 8 hr (<b>heightened 4th</b> mount has 60\' Speed and can move normally over water and natural difficult terrain; <b>5th</b> mount can also <i>Air Walk</i> for 1 rd; <b>6th</b> mount has 80\' Speed and can fly)"',
  'Plane Shift':
    'Level=7 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transports self and 8 willing targets to an imprecise location on a different plane"',
  'Plant Form':
    'Level=5 ' +
    'Trait=Plant,Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes a Large plant with 12 temporary HP, Armor Class %{level+19}, +17 attack, +11 damage, low-light vision, resistance 10 to poison, +19 Athletics modifier, and plant-specific attacks for 1 min (<b>heightened 6th</b> becomes a Huge plant with +5\' reach, 24 temporary HP, Armor Class %{level+22}, +21 attack, +16 damage, +22 Athletics)"',
  'Polar Ray':
    'Level=8 ' +
    'Trait=Attack,Cold,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 10d8 HP cold, or double HP on a critical success, and drained 2 (<b>heightened +1</b> inflicts +2d8 HP)"',
  'Possession':
    'Level=7 ' +
    'Trait=Uncommon,Incapacitation,Mental,Necromancy,Possession ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self inhabits and controls the target\'s body for 1 min (<b>save Will</b> self inhabits but cannot control; critical success negates; critical failure gives control without further saves); a success on subsequent Will saves each turn negates control for 1 rd, and a critical success ends the spell (<b>heightened 9th</b> effects last for 10 min, and self body merges into possessed body)"',
  'Power Word Blind':
    'Level=7 ' +
    'Trait=Uncommon,Auditory,Enchantment,Mental ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Permanently blinds a target up to level 11, blinds a level 12 or 13 target for 1d4 min, or dazzles a level 14+ target for 1 min (<b>heightened +1</b> increases outcome levels by 2)"',
  'Power Word Kill':
    'Level=9 ' +
    'Trait=Uncommon,Auditory,Death,Enchantment,Mental ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Kills a target up to level 14 or 50 HP, inflicts 0 HP and dying 1 on a level 15 target, or inflicts 50 HP on a level 16+ target (<b>heightened +1</b> increases outcome levels by 2)"',
  'Power Word Stun':
    'Level=8 ' +
    'Trait=Uncommon,Auditory,Enchantment,Mental ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts stunned for 1d6 rd on a target up to level 13, stunned for 1 rd on a level 14 or 15 target, or stunned 1 on a level 16+ target (<b>heightened +1</b> increases outcome levels by 2)"',
  'Prestidigitation':
    'Level=1 ' +
    'Trait=Cantrip,Evocation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R10\' Performs cooking, lifting, making a minor object, or tidying while sustained"',
  'Primal Herd':
    'Level=10 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self and 5 willing targets become Huge mammoths with 20 temporary HP, 40\' Speed, low-light vision, Armor Class level + 22, a tusk attack that inflicts 4d8+19 HP piercing, a trunk attack that inflicts 4d6+16 HP bludgeoning, a foot attack that inflicts 4d6+13 HP bludgeoning, low-light vision, +30 Athletics modifier, and a trample action for 1 min"',
  'Primal Phenomenon':
    'Level=10 ' +
    'Trait=Divination ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"Acts as <i>Wish</i> to reverse effects or produces effects similar to a known primal spell of up to 9th level or a common spell of up to 7th level"',
  'Prismatic Sphere':
    'Level=9 ' +
    'Trait=Abjuration,Light ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R10\' 20\' bright light in a 10\' burst inflicts blindness for 1 rd (<b>save Will</b> inflicts dazzled for 1 rd; critical failure inflicts blindness for 1 min) and these effects on creatures passing through for 1 hr: 20 HP fire (<b>save basic Reflex</b>); 25 HP acid (<b>save basic Reflex</b>); 30 HP electricity (<b>save basic Reflex</b>); 10 HP poison and enfeebled 1 for 1 min (<b>save basic Fortitude</b> also negates enfeebled); <i>Flesh To Stone</i> effects (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates); <i>Warp Mind</i> effects (<b>save Will</b> inflicts confused for 1 action; critical success negates); slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects)"',
  'Prismatic Spray':
    'Level=7 ' +
    'Trait=Evocation,Light ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone randomly inflicts one of these effects on each creature affected: (1) 50 HP fire (<b>save Reflex</b> negates); (2) 60 HP acid (<b>save Reflex</b> negates); (3) 70 HP electricity (<b>save Reflex</b> negates); (4) 30 HP poison and enfeebled 1 for 1 min (<b>save Fortitude</b> negates); (5) <i>Flesh To Stone</i> effects (<b>save Fortitude</b> negates); (6) <i>Warp Mind</i> effects (<b>save Will</b> negates); (7) slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects); (8) two of the preceding effects"',
  'Prismatic Wall':
    'Level=8 ' +
    'Trait=Abjuration,Light ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' bright light emitted by a 60\'x30\' wall inflicts blindness for 1 rd (<b>save Will</b> inflicts dazzled for 1 rd; critical failure inflicts blindness for 1 min) and these effects on creatures passing through for 1 hr: 20 HP fire (<b>save basic Reflex</b>); 25 HP acid (<b>save basic Reflex</b>); 30 HP electricity (<b>save basic Reflex</b>); 10 HP poison and enfeebled 1 for 1 min (<b>save basic Fortitude</b> also negates enfeebled); <i>Flesh To Stone</i> effects (<b>save Fortitude</b> inflicts slowed 1 for 1 rd; critical success negates); <i>Warp Mind</i> effects (<b>save Will</b> inflicts confused for 1 action; critical success negates); slowed 1 for 1 min (<b>save Will</b> negates; critical failure inflicts <i>Plane Shift</i> effects)"',
  'Private Sanctum':
    'Level=4 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"100\' burst around touched location blocks sensory information, scrying, and mind-reading until next daily prep"',
  'Produce Flame':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Evocation,Fire ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP fire, or double HP plus 1d4 HP persistent fire on a critical success (<b>heightened +1</b> inflicts +1d4 HP initial and persistent)"',
  'Project Image':
    'Level=7 ' +
    'Trait=Illusion,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates an illusory copy of self, with the same Armor Class and saves, that can be used as a source of spells while sustained for up to 1 min or until damaged (<b>heightened +2</b> extends maximum sustain to 10 min)"',
  'Protection':
    'Level=1 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains +1 Armor Class and saves vs. creatures of a specified alignment, and +3 vs. summoned creatures and control effects, for 1 min"',
  'Prying Eye':
    'Level=5 ' +
    'Trait=Divination,Scrying ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location and that can be moved 30\' each rd while sustained"',
  'Punishing Winds':
    'Level=8 ' +
    'Trait=Air,Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R100\' 30\' radius lowers flying creatures by 40\', creates greater difficult terrain for flying creatures and difficult terrain for others, and requires a successful flying Acrobatics or grounded Athletics vs. DC %{spellDifficultyClass.%tradition} to exit while sustained for up to 1 min"',
  'Purify Food And Drink':
    'Level=1 ' +
    'Trait=Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Removes contaminates from 1 cubic foot of food or water"',
  'Purple Worm Sting':
    'Level=6 ' +
    'Trait=Necromancy,Poison ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers 3d6 HP piercing and stage 1 purple worm venom, which inflicts 3d6 HP poison and enfeebled 2; subsequent failures after 1 rd will inflict 4d6 HP and 6d6 HP at stage 2 and stage 3 (<b>save Fortitude</b> inflicts 3d6 HP piercing and 3d6 HP poison only; critical success inflicts 3d6 HP piercing only; critical failure inflicts stage 2 immediately)"',
  'Raise Dead':
    'Level=6 ' +
    'Trait=Uncommon,Healing,Necromancy ' +
    'Traditions=Divine ' +
    'Cast="10 min" ' +
    'Description="R10\' Restores a willing soul up to level 13 to its corpse, dead for at most 3 days, giving it 1 HP, clumsy 2, drained 2, and enfeebled 2 for 1 week (<b>heightened 7th</b> raises the maximum level to 15; <b>8th</b> level 17; <b>9th</b> level 19; <b>10th</b> level 21)"',
  'Ray Of Enfeeblement':
    'Level=1 ' +
    'Trait=Attack,Necromancy ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts enfeebled 1; critical success negates; critical failure inflicts enfeebled 3; critical success on attack worsens save by 1 degree)"',
  'Ray Of Frost':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Cold,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts 1d4+%{spellModifier.%tradition} HP cold (critical success inflicts double HP and -10 Speed for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Read Aura':
    'Level=1 ' +
    'Trait=Cantrip,Detection,Divination ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Reveals whether an object is magical and the related school of magic (<b>heightened 3rd</b> affects 10 targets; <b>6th</b> affects unlimited targets)"',
  'Read Omens':
    'Level=4 ' +
    'Trait=Uncommon,Divination,Prediction ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Reveals a clue or advice about a proposed activity up to 1 week in the future"',
  'Regenerate':
    'Level=7 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched target regains 15 HP and regrows a damaged organ each rd for 1 min; suffering new acid or fire damage negates the effects for 1 rd (<b>heightened 9th</b> restores 20 HP each rd)"',
  'Remake':
    'Level=10 ' +
    'Trait=Uncommon,Conjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast="1 hr" ' +
    'Description=' +
      '"R5\' Fully re-creates a known object up to 5\'x5\'x5\' from a remnant"',
  'Remove Curse':
    'Level=4 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 curse affecting touched"',
  'Remove Disease':
    'Level=3 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Primal ' +
    'Cast="10 min" ' +
    'Description="Makes a counteract attempt vs. 1 disease affecting touched"',
  'Remove Fear':
    'Level=2 ' +
    'Trait=Enchantment ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 fear effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Remove Paralysis':
    'Level=2 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 paralysis effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Repulsion':
    'Level=6 ' +
    'Trait=Abjuration,Aura,Mental ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Emanation up to 40\' prevents creatures from approaching for 1 min (<b>save Will</b> inflicts difficult terrain; critical success negates)"',
  'Resilient Sphere':
    'Level=4 ' +
    'Trait=Abjuration,Force ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Creates an impassible force sphere with Armor Class 5, Harness 10, and 40 HP around the target for 1 min or until destroyed (<b>save Reflex</b> decreases the HP to 10; critical success negates)"',
  'Resist Energy':
    'Level=2 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 5 vs. a specified energy type for 10 min (<b>heightened 4th</b> gives resistance 10 to 2 targets; <b>7th</b> gives resistance 15 to 5 targets)"',
  'Resplendent Mansion':
    'Level=9 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R500\' Creates a 300\'x300\' mansion, with entrances protected by <i>Alarm</i> effects and containing provisions for up to 150 people, until next daily prep"',
  'Restoration':
    'Level=2 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Gives a 2-step reduction to a clumsy, enfeebled, or stupefied condition, a 1-step reduction to two of these conditions, or a 1-stage reduction to a toxin affecting touched (<b>heightened 4th</b> allows reducing a drained condition, lessening a toxin by 2 stages, or reducing a non-permanent doomed condition by 1; <b>6th</b> allows reducing a permanent doomed condition by 1)"',
  'Restore Senses':
    'Level=2 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Makes a counteract attempt vs. a magical blindness or deafness effect affecting touched (<b>heightened 6th</b> R30\' affects 10 targets)"',
  'Retrocognition':
    'Level=7 ' +
    'Trait=Divination ' +
    'Traditions=Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Reveals impressions of 1 day of past events at the current location per 1 min of concentration; traumatic events require a Will save to maintain the spell (<b>heightened 8th</b> gives impressions of 1 year per min; <b>9th</b> gives impressions of 1 century per min)"',
  'Reverse Gravity':
    'Level=7 ' +
    'Trait=Uncommon,Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Objects in a 20\'x40\' cylinder fall upward for 1 min"',
  'Revival':
    'Level=10 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' radius restores 10d8+40 HP to living targets and raises dead targets with the same number of temporary HP while sustained for up to 1 min"',
  'Righteous Might':
    'Level=6 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains Armor Class %{level+20}, 10 temporary HP, 40\' Speed, resistance 3 to physical damage, darkvision, +21 attack and +8 damage (+6 if ranged) with a %{deityWeaponLowered}, and +23 Athletics for 1 min (<b>heightened 8th</b> gives a Large form with 10\' reach, Armor Class %{21+level}, 15 temporary HP, resistance 4 to physical damage, +28 attack and +15 damage (+12 if ranged) with a %{deityWeaponLowered}, and +29 Athletics)"',
  'Rope Trick':
    'Level=4 ' +
    'Trait=Uncommon,Conjuration,Extradimensional ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched rope leads to an extradimensional space that can hold 8 Medium creatures for 8 hr"',
  'Sanctified Ground':
    'Level=3 ' +
    'Trait=Abjuration,Consecration ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"30\' burst gives +1 Armor Class, attack, damage, and saves vs. aberrations, celestials, dragons, fiends, monitors, or undead until next daily prep"',
  'Sanctuary':
    'Level=1 ' +
    'Trait=Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Prevents creatures from attacking touched for 1 min (<b>save Will</b> each rd negates for 1 rd; critical success ends the spell; critical failure allows no further save attempts)"',
  'Scintillating Pattern':
    'Level=8 ' +
    'Trait=Illusion,Incapacitation,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst inflicts confused for 1d4 rd and dazzled in a 40\' radius while sustained for up to 1 min (<b>save Will</b> inflicts dazzled only; critical failure inflicts stunned for 1d4 rd, then confused for the remaining duration)"',
  'Scrying':
    'Level=6 ' +
    'Trait=Uncommon,Divination,Scrying ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Creates an invisible sensor that allows self to see the target creature while sustained for up to 10 min (<b>save Will</b> negates; critical success allows the target to glimpse self; critical failure allows the sensor to follow the target; scrying an unfamiliar target lowers the save DC by 2, and scrying an unknown target lowers it by 10)"',
  'Searing Light':
    'Level=3 ' +
    'Trait=Attack,Evocation,Fire,Good,Light ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R120\' Spell attack inflicts 5d6 HP fire, plus 5d6 HP good to fiends and undead (critical success inflicts double HP), and attempts to counteract magical darkness (<b>heightened +1</b> inflicts +2d6 HP fire and good)"',
  'Secret Page':
    'Level=3 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Makes the text on a touched page appear as different text unless a specified password is spoken"',
  'See Invisibility':
    'Level=2 ' +
    'Trait=Divination,Revelation ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Self treats invisible creatures and objects as concealed for 10 min (<b>heightened 5th</b> effects last for 8 hr)"',
  'Sending':
    'Level=5 ' +
    'Trait=Divination,Mental ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Self exchanges a pair of 25-word messages with a known creature"',
  'Shadow Blast':
    'Level=5 ' +
    'Trait=Evocation,Shadow ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone, R120\' 15\' burst, or 50\' line inflicts 5d8 HP of choice of damage type (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Shadow Siphon':
    'Level=5 ' +
    'Trait=Illusion,Shadow ' +
    'Traditions=Arcane,Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Makes a counteract attempt on a damaging trigger spell at +2 the spell level, reducing the damage by half if successful"',
  'Shadow Walk':
    'Level=5 ' +
    'Trait=Uncommon,Conjuration,Shadow,Teleportation ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Allows self and 9 willing touched to travel through the Shadow Plane at 20x Speed for 8 hr"',
  'Shape Stone':
    'Level=4 ' +
    'Trait=Earth,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description="Reshapes touched 10\'x10\'x10\' stone"',
  'Shape Wood':
    'Level=2 ' +
    'Trait=Plant,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Reshapes touched 20 cubic feet of wood"',
  'Shapechange':
    'Level=9 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Replicates any known polymorph spell of up to 8th level for 1 min"',
  'Shatter':
    'Level=2 ' +
    'Trait=Evocation,Sonic ' +
    'Traditions=Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 2d10 HP sonic on an unattended object, ignoring Hardness up to 4 (<b>heightened +1</b> inflicts +1d10 HP and ignores +2 Hardness)"',
  'Shield':
    'Level=1 ' +
    'Trait=Abjuration,Cantrip,Force ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +1 Armor Class for 1 rd; may end the spell and not use it again for 10 min to use Shield Block with Hardness 5 (<b>heightened 3rd</b> gives Hardness 10; <b>5th</b> gives Hardness 15; <b>7th</b> gives Hardness 20; <b>9th</b> gives Hardness 25)"',
  'Shield Other':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transfers half of damage suffered by target to self for 10 min or until either is reduced to 0 HP"',
  'Shillelagh':
    'Level=1 ' +
    'Trait=Plant,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched staff gains +1 attack and 2 damage dice (3 damage dice vs. aberrations, extraplanar creatures, and undead) for 1 min"',
  'Shocking Grasp':
    'Level=1 ' +
    'Trait=Attack,Electricity,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 2d12 HP electricity; touching an armored target gives +1 attack and also inflicts 1d4 HP persistent electricity (<b>heightened +1</b> inflicts +1d12 HP initial and +1 HP persistent)"',
  'Shrink':
    'Level=2 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target becomes Tiny for 5 min (<b>heightened 6th</b> affects 10 creatures)"',
  'Shrink Item':
    'Level=3 ' +
    'Trait=Polymorph,Transmutation ' +
    'Traditions=Arcane ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transforms a touched non-magical object of up to 80 Bulk and 20 cubic feet into the size of a coin with negligible Bulk until next daily prep"',
  'Sigil':
    'Level=1 ' +
    'Trait=Cantrip,Transmutation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Inscribes a 1\\" sq magical mark on a touched object or creature; the mark can be scrubbed off and fades from a creature after 1 week (<b>heightened 3rd</b> marks a creature for 1 month; <b>5th</b> marks a creature for 1 year; <b>7th</b> marks a creature permanently)"',
  'Silence':
    'Level=2 ' +
    'Trait=Illusion ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Willing touched makes no sound for 1 min (<b>heightened 4th</b> affects a 10\' radius around touched)"',
  'Sleep':
    'Level=1 ' +
    'Trait=Enchantment,Incapacitation,Mental,Sleep ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst inflicts unconsciousness for 1 min or until a successful Perception check (<b>save Will</b> inflicts -1 Perception for 1 rd; critical success negates; critical failure inflicts unconsciousness for 1 hr or until a successful Perception check) (<b>heightened 4th</b> inflicts unconsciousness for 1 rd, or 1 min on a critical failure; targets release held objects and do not wake from a successful Perception check)"',
  'Slow':
    'Level=3 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts slowed 1 for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure inflicts slowed 2) (<b>heightened 6th</b> affects 10 targets)"',
  'Solid Fog':
    'Level=4 ' +
    'Trait=Conjuration,Water ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 20\' burst conceals creatures and inflicts difficult terrain for 1 min"',
  'Soothe':
    'Level=1 ' +
    'Trait=Emotion,Enchantment,Healing,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target regains 1d10+4 HP and gains +2 saves vs. mental effects for 1 min (<b>heightened +1</b> restores +1d10+4 HP)"',
  'Sound Burst':
    'Level=2 ' +
    'Trait=Evocation,Sonic ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10\' burst inflicts 2d10 HP sonic and deafened for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, deafened for 1 min, and stunned 1) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Speak With Animals':
    'Level=2 ' +
    'Trait=Divination ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Allows self to communicate with animals for 10 min"',
  'Speak With Plants':
    'Level=4 ' +
    'Trait=Divination,Plant ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Allows self to communicate with plants and fungi for 10 min"',
  'Spectral Hand':
    'Level=2 ' +
    'Trait=Necromancy ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Creates a crawling, spectral hand that delivers touch spells for 1 min; damage to the hand ends the spell and inflicts 1d6 HP to self"',
  'Spell Immunity':
    'Level=4 ' +
    'Trait=Abjuration ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Gives touched an automatic counteract attempt vs. a specified spell until next daily prep"',
  'Spell Turning':
    'Level=7 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to use a Reaction that redirects a spell to its caster via a successful counterspell once within 1 hr"',
  'Spellwrack':
    'Level=6 ' +
    'Trait=Abjuration,Curse,Force ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Until the curse is removed, each time the target is affected by a spell with a duration, it suffers 2d12 HP persistent force and the duration of every spell affecting it is reduced by 1 rd (<b>save Will</b> effects last for 1 min; critical success negates; critical failure inflicts 4d12 HP)"',
  'Spider Climb':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains a climb Speed equal to its Speed for 10 min (<b>heightened 5th</b> effects last for 1 hr)"',
  'Spider Sting':
    'Level=1 ' +
    'Trait=Necromancy,Poison ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers 1d4 HP piercing and stage 1 spider venom, which inflicts 1d4 HP poison and enfeebled 1; subsequent failures after 1 rd will inflict an additional 1d4 HP poison and enfeebled 2 at stage 2 (<b>save Fortitude</b> inflicts 1d4 HP piercing and 1d4 HP poison only; critical success negates; critical failure inflicts stage 2 immediately)"',
  'Spirit Blast':
    'Level=6 ' +
    'Trait=Force,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target\'s spirit suffers 16d6 HP force (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Spirit Link':
    'Level=1 ' +
    'Trait=Healing,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Transfers 2 HP of damage each rd from a willing target to self for 10 min (<b>heightened +1</b> transfers +2 HP)"',
  'Spirit Song':
    'Level=8 ' +
    'Trait=Force,Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 18d6 HP force on spirits, including any hidden in solid barriers (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Spiritual Epidemic':
    'Level=8 ' +
    'Trait=Curse,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts enfeebled 2 and stupefied 2 for 1 min and enfeebled 1 and stupefied 1 permanently; also affects creatures who later cast divine or occult spells on the target (<b>save Will</b> inflicts enfeebled 2 and stupefied 2 for 1 rd only; critical success negates; critical failure inflicts enfeebled 3 and stupefied 3 for 1 min and enfeebled 2 and stupefied 2 permanently)"',
  'Spiritual Guardian':
    'Level=5 ' +
    'Trait=Abjuration,Force ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Summoned guardian with 50 HP may attack or defend each rd while sustained for up to 1 min; +%{spellAttackModifier.%tradition} attack inflicts 2d8 HP force or weapon damage type; defense absorbs 10 HP of damage from an attack on an ally (<b>heightened +2</b> guardian gains +20 HP and inflicts +1d8 HP)"',
  'Spiritual Weapon':
    'Level=2 ' +
    'Trait=Evocation,Force ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spectral weapon makes a +%{spellAttackModifier.%tradition} attack that inflicts 1d8 HP force or weapon damage type each rd while sustained for up to 1 min (<b>heightened +2</b> inflicts +1d8 HP)"',
  'Stabilize':
    'Level=1 ' +
    'Trait=Cantrip,Healing,Necromancy,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="R30\' Removes dying condition from target"',
  'Status':
    'Level=2 ' +
    'Trait=Detection,Divination ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Reveals willing touched\'s direction, distance, and conditions until next daily prep (<b>heightened 4th</b> R10\' affects 10 targets)"',
  'Stinking Cloud':
    'Level=3 ' +
    'Trait=Conjuration,Poison ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 20\' burst conceals creatures and inflicts sickened 1 and slowed 1 for 1 min (<b>save Fortitude</b> inflicts sickened 1 only; critical success negates; critical failure inflicts sickened 2 and slowed 1)"',
  'Stone Tell':
    'Level=6 ' +
    'Trait=Uncommon,Evocation,Earth ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description="Allows self to converse with stone for 10 min"',
  'Stone To Flesh':
    'Level=6 ' +
    'Trait=Earth,Transmutation ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Restores touched petrified creature or transforms a human-sized stone object into flesh"',
  'Stoneskin':
    'Level=4 ' +
    'Trait=Abjuration,Earth ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains resistance 5 to non-adamantine physical damage for 20 min; each hit reduces the duration by 1 min (<b>heightened 6th</b> gives resistance 10; <b>8th</b> gives resistance 15; <b>10th</b> gives resistance 20)"',
  'Storm Of Vengeance':
    'Level=9 ' +
    'Trait=Air,Electricity,Evocation ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R800\' 360\' burst inflicts -4 ranged attacks, greater difficult terrain for flying, and a choice each rd of 4d8 HP acid (<b>no save</b>), 4d10 HP bludgeoning (<b>save basic Fortitude</b>), 7d6 HP electricity (<b>save basic Reflex</b>), difficult terrain and concealment, or deafened for 10 min (<b>save Fortitude</b> negates) while sustained for up to 1 min (<b>heightened 10th</b> R2200\' 1000\' burst)"',
  'Subconscious Suggestion':
    'Level=5 ' +
    'Trait=Enchantment,Incapacitation,Linguistic,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Specified trigger prompts the target to follow a reasonable, 1 min suggestion until next daily prep (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure inflicts following the suggestion for 1 hr) (<b>heightened 9th</b> affects 10 targets)"',
  'Suggestion':
    'Level=4 ' +
    'Trait=Enchantment,Incapacitation,Linguistic,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target follows a reasonable suggestion for 1 min (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure effects last for 1 hr) (<b>heightened 8th</b> targets 10 creatures)"',
  'Summon Animal':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 animal appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Celestial':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 celestial appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Construct':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 construct appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Dragon':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 dragon appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Elemental':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 elemental appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Entity':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 aberration appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Fey':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'Traditions=Occult,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 fey appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Summon Fiend':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 fiend appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"', 
  'Summon Giant':
    'Level=5 ' +
    'Trait=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 giant appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Plant Or Fungus':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 plant or fungus appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Sunburst':
    'Level=7 ' +
    'Trait=Evocation,Fire,Light,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' 60\' burst inflicts 8d10 HP fire, plus 8d10 HP positive to undead (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure also inflicts permanent blindness) (<b>heightened +1</b> inflicts +1d10 HP fire and positive)"',
  'Synaptic Pulse':
    'Level=5 ' +
    'Trait=Enchantment,Incapacitation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts stunned 2 (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure inflicts stunned for 1 rd)"',
  'Synesthesia':
    'Level=5 ' +
    'Trait=Divination,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts a DC 5 flat check for concentration, clumsy 3, -10 Speed, and concealment of all objects and creatures for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure inflicts stunned 2) (<b>heightened 9th</b> affects 5 targets)"',
  'Talking Corpse':
    'Level=4 ' +
    'Trait=Uncommon,Necromancy ' +
    'Traditions=Divine,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Touched corpse truthfully answers 3 questions within 10 min (<b>save Will</b> allows lying or refusing to answer; critical success prevents self from resting for 24 hr; critical failure inflicts -2 on Deception checks when giving misleading answers)"',
  'Tanglefoot':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Conjuration,Plant ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts -10\' Speed for 1 rd, or immobilized 1 for 1 rd on a critical success; a successful Escape negates (<b>heightened 2nd</b> effects last for 2 rd; <b>4th</b> effects last for 1 min)"',
  'Tangling Creepers':
    'Level=6 ' +
    'Trait=Conjuration,Plant ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R500\' 40\' burst inflicts -10\' Speed and immobilizes 1 target for 1 rd (a successful Escape negates) each rd for 10 min"',
  'Telekinetic Haul':
    'Level=5 ' +
    'Trait=Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Moves an 80 Bulk, 20\' cubic object 20\' each rd while sustained for up to 1 min"',
  'Telekinetic Maneuver':
    'Level=2 ' +
    'Trait=Attack,Evocation,Force ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description="R60\' Spell attack attempts to Disarm, Shove, or Trip"',
  'Telekinetic Projectile':
    'Level=1 ' +
    'Trait=Attack,Cantrip,Evocation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Spell attack hurls a loose object that inflicts 1d6+%{spellModifier.%tradition} HP of the appropriate damage type, or double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Telepathic Bond':
    'Level=5 ' +
    'Trait=Uncommon,Divination,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Self and 4 willing touched can communicate telepathically for 8 hr"',
  'Telepathic Demand':
    'Level=9 ' +
    'Trait=Enchantment,Incapacitation,Linguistic,Mental ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Self exchanges a pair of 25-word messages with an existing telepathic target, sending a <i>Suggestion</i> as part of the message (<b>save Will</b> gives immunity for 1 day; critical success gives immunity for 1 month)"',
  'Telepathy':
    'Level=4 ' +
    'Trait=Divination,Linguistic,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to communicate telepathically with any creature in a 30\' radius for 10 min (<b>heightened 6th</b> allows communication with creatures without a shared language)"',
  'Teleport':
    'Level=6 ' +
    'Trait=Uncommon,Conjuration,Teleportation ' +
    'Traditions=Arcane,Occult ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Transports self and 4 willing touched creatures or objects up to 100 miles to a point near a specified known location (<b>heightened 7th</b> transports 1000 miles; <b>8th</b> transports anywhere on the same planet; <b>9th</b> transports to any planet in the same system; <b>10th</b> transports to any planet in the same galaxy)"',
  'Time Stop':
    'Level=10 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Allows self to perform 3 rd of actions that don\'t affect others until the spell ends"',
  'Tongues':
    'Level=5 ' +
    'Trait=Uncommon,Divination ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Target understands and speaks all languages for 1 hr (<b>heightened 7th</b> effects last for 8 hr)"',
  'Touch Of Idiocy':
    'Level=2 ' +
    'Trait=Enchantment,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts stupefied 2 (<b>save Will</b> negates; critical failure inflicts stupefied 4)"',
  'Tree Shape':
    'Level=2 ' +
    'Trait=Plant,Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="Self becomes a Large tree with Armor Class 20 for 8 hr"',
  'Tree Stride':
    'Level=5 ' +
    'Trait=Uncommon,Conjuration,Plant,Teleportation ' +
    'Traditions=Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Transports self from an adjacent tree to another of the same species within 5 miles (<b>heightened 6th</b> transports 50 miles; <b>8th</b> transports 500 miles; <b>9th</b> transports anywhere on the planet)"',
  'True Seeing':
    'Level=6 ' +
    'Trait=Divination,Revelation ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Makes counteract checks to allow self to see through illusions and transmutations for 10 min"',
  'True Strike':
    'Level=1 ' +
    'Trait=Divination,Fortune ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self uses the better of two attack rolls, ignores concealed and hidden conditions, and ignores circumstance penalties on the next Strike in the same turn"',
  'True Target':
    'Level=7 ' +
    'Trait=Divination,Fortune,Prediction ' +
    'Traditions=Arcane,Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Allies\' attacks within 1 rd on a designated creature ignore concealed and hidden conditions and use the better of two attack rolls"',
  'Uncontrollable Dance':
    'Level=8 ' +
    'Trait=Enchantment,Incapacitation,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers flat-footed and no Reactions for 1 min and spends 2 actions each turn dancing (<b>save Will</b> effects last for 3 rd and the target spends 1 action each turn dancing; critical success negates; critical failure effects last for 1 min and the target spends all actions each turn dancing)"',
  'Undetectable Alignment':
    'Level=2 ' +
    'Trait=Uncommon,Abjuration ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touched appears neutral to alignment detection until next daily prep"',
  'Unfathomable Song':
    'Level=9 ' +
    'Trait=Auditory,Emotion,Enchantment,Fear,Incapacitation,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Randomly inflicts frightened 2, confused for 1 rd, stupefied 4 for 1 rd, or blinded for 1 rd on 5 targets while sustained for up to 1 min (<b>save Will</b> negates for 1 rd; critical success negates; critical failure replaces frightened 2 with stunned for 1 rd and stupefied 1)"',
  'Unfettered Pack':
    'Level=7 ' +
    'Trait=Abjuration ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10 targets ignore environmental difficult terrain and circumstance Speed penalties for 1 hr (<b>heightened 9th</b> targets ignore environmental greater difficult terrain)"',
  'Unrelenting Observation':
    'Level=8 ' +
    'Trait=Divination,Scrying ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R100\' 5 targets in a 20\' burst can see a 6th target for 1 hr; lead and running water block the vision (<b>save Will</b> effects last for 1 min; critical success negates)"',
  'Unseen Servant':
    'Level=1 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R60\' Invisible servant with 4 Hit Points and a 30\' fly Speed obeys commands to move and manipulate objects while sustained or until reduced to 0 HP"',
  'Vampiric Exsanguination':
    'Level=6 ' +
    'Trait=Death,Necromancy,Negative ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone inflicts 12d6 HP negative, giving self temporary HP for 1 min equal to half that suffered by the most-affected target (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Vampiric Touch':
    'Level=3 ' +
    'Trait=Death,Necromancy,Negative ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Touch inflicts 6d6 HP negative, giving self temporary HP for 1 min equal to half the inflicted damage (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Veil':
    'Level=4 ' +
    'Trait=Illusion,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Makes 10 creatures appear as different, similar creatures for 1 hr (<b>heightened 5th</b> also disguises voices and scents; <b>7th</b> targets can appear to be familiar individuals)"',
  'Ventriloquism':
    'Level=1 ' +
    'Trait=Auditory,Illusion ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self to project their voice up to 60\' for 10 min (<b>heightened 2nd</b> effects last for 1 hr, allow changing voice quality, and require an active Perception to attempt to disbelieve)"',
  'Vibrant Pattern':
    'Level=6 ' +
    'Trait=Illusion,Incapacitation,Visual ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst dazzles and blinds creatures while sustained for up to 1 min; a successful save each rd after leaving the area removes the blindness (<b>save Will</b> inflicts dazzled only; critical failure blinds for 1 min with no further saves)"',
  'Visions Of Danger':
    'Level=7 ' +
    'Trait=Auditory,Illusion,Visual ' +
    'Traditions=Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R500\' 30\' burst inflicts 8d8 HP mental for 1 min (<b>save basic Will</b>; critical success allows an attempt to disbelieve that negates the effects) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Vital Beacon':
    'Level=4 ' +
    'Trait=Healing,Necromancy,Positive ' +
    'Traditions=Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Touch heals once each rd: 4d10 HP, 4d8 HP, 4d6 HP, then 4d4 HP, until expended or next daily prep (<b>heightened +1</b> each touch restores +1 die)"',
  'Volcanic Eruption':
    'Level=7 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 5\'x80\' cylinder inflicts 14d6 HP fire, -10\' Speed, and clumsy 1, plus a 20\' descent and difficult terrain on flying creatures (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP), and 3d6 HP fire to creatures within 5\' (<b>heightened +1</b> inflicts +2d6 HP and +1d6 HP within 5\')"',
  'Wail Of The Banshee':
    'Level=9 ' +
    'Trait=Auditory,Death,Necromancy,Negative ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"40\' emanation inflicts 8d10 HP negative and drained 1d4 (<b>save Fortitude</b> inflicts HP only; critical success negates; critical failure inflicts double HP and drained 4)"',
  'Wall Of Fire':
    'Level=4 ' +
    'Trait=Evocation,Fire ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' 5\'x60\'x10\' line or 10\' radius ring inflicts 4d6 HP fire for 1 min (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Wall Of Force':
    'Level=6 ' +
    'Trait=Evocation,Force ' +
    'Traditions=Arcane,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Creates an invisible 50\'x20\' wall with Armor Class 10, Harness 30, and 60 HP that blocks physical effects and corporeal, incorporeal, and ethereal creatures for 1 min (<b>heightened +2</b> gives +20 HP)"',
  'Wall Of Ice':
    'Level=5 ' +
    'Trait=Cold,Evocation,Water ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a 60\'x10\'x1\' wall or a 10\' radius hemisphere of opaque ice with Armor Class 10, Hardness 10, weakness to fire 15, and 40 HP per 10\' section for 1 min; rubble from destruction inflicts 2d6 HP cold and difficult terrain (<b>heightened +2</b> each section gains +10 HP, and rubble inflicts +1d6 HP)"',
  'Wall Of Stone':
    'Level=5 ' +
    'Trait=Conjuration,Earth ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a permanent 120\'x20\'x1\\" stone wall with Armor Class 10, Hardness 14, and 50 HP per 10\' section; rubble from destruction inflicts difficult terrain (<b>heightened +2</b> each section gains +15 HP)"',
  'Wall Of Thorns':
    'Level=3 ' +
    'Trait=Conjuration,Plant ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R60\' Creates a 60\'x10\'x5\' bramble wall with Armor Class 10, Hardness 10, and 20 HP per 10\' section that inflicts difficult terrain and 3d4 HP piercing for 1 min (<b>heightened +1</b> inflicts +1d4 HP, and each section gains +5 HP)"',
  'Wall Of Wind':
    'Level=3 ' +
    'Trait=Air,Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R120\' Creates a 60\'x30\'x5\' wind wall that blocks small ammunition, inflicts -2 attack on larger ammunition, inflicts difficult terrain, and blocks flying creatures for 1 min (<b>save Fortitude</b> (flying creature) allows passage as difficult terrain; critical success negates; critical failure inflicts a 10\' push)"',
  "Wanderer's Guide":
    'Level=3 ' +
    'Trait=Divination ' +
    'Traditions=Divine,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"Reveals a route to a specified destination and reduces the movement penalty from difficult terrain while following it by half until next daily prep"',
  'Warp Mind':
    'Level=7 ' +
    'Trait=Emotion,Enchantment,Incapacitation,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts confused for 1 min (<b>save Will</b> inflicts confused for 1 action; critical success negates; critical failure inflicts permanent confusion)"',
  'Water Breathing':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' 5 targets can breathe water for 1 hr (<b>heightened 3rd</b> effects last for 8 hr; <b>4th</b> effects last until next daily prep)"',
  'Water Walk':
    'Level=2 ' +
    'Trait=Transmutation ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched can walk on liquids for 10 min (<b>heightened 4th</b> R30\' affects 10 creatures, and effects last for 1 hr)"',
  'Weapon Of Judgment':
    'Level=9 ' +
    'Trait=Evocation,Force ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R100\' +%{spellAttackModifier.%tradition} attacks by a force weapon inflict 3d10+%{spellModifier.%tradition} HP force or weapon damage type for 1 min (<b>heightened 10th</b> inflicts +1d10 HP)"',
  'Weapon Storm':
    'Level=4 ' +
    'Trait=Evocation ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Weapon swing inflicts 4 dice of damage to every creature in a 30\' cone or 10\' emanation (<b>save Reflex</b> inflicts half HP; critical success negates; critical failure inflicts double HP and critical specialization effect) (<b>heightened +1</b> inflicts +1 damage die)"',
  'Web':
    'Level=2 ' +
    'Trait=Conjuration ' +
    'Traditions=Arcane,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' 10\' burst inflicts difficult terrain and -10\' Speed for 1 rd (<b>save Reflex or Athletics</b> negates for 1 action; critical success negates for 1 rd; critical failure inflicts immobilized for 1 rd or until a successful Escape; successful Athletics also clears squares upon leaving)"',
  'Weird':
    'Level=9 ' +
    'Trait=Death,Emotion,Fear,Illusion,Mental ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts 16d6 HP mental and frightened 2 on all targets within range (<b>save Will</b> inflicts half HP and frightened 1; critical success negates; critical failure inflicts death on a failed subsequent Fortitude save or double HP, frightened 2 and fleeing on success; critical success negates fleeing)"',
  'Wind Walk':
    'Level=8 ' +
    'Trait=Air,Transmutation ' +
    'Traditions=Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Self and 5 touched become clouds that can move 20 MPH for 8 hr; attacking or spellcasting ends the spell"',
  'Wish':
    'Level=10 ' +
    'Trait=Divination ' +
    'Traditions=Arcane ' +
    'Cast=3 ' +
    'Description=' +
      '"Reverses effects that require <i>Wish</i> or produces effects similar to a known arcane spell of up to 9th level or a common spell of up to 7th level"',
  'Zealous Conviction':
    'Level=6 ' +
    'Trait=Emotion,Enchantment,Mental ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 10 willing targets gain 12 temporary HP, gain +2 Will vs. mental effects, and must comply with self requests for 10 min (<b>save Will</b> after fulfilling a repugnant request ends the spell) (<b>heightened 9th</b> gives 18 temporary HP and +3 Will)"',
  'Zone Of Truth':
    'Level=3 ' +
    'Trait=Uncommon,Enchantment,Mental ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 20\' burst prevents lies and inflicts -2 Deception for 10 min (<b>save Will</b> inflicts -2 Deception only; critical success negates; critical failure inflicts -4 Deception)"',
  'Allegro':
    'Level=7 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target may take an additional Strike, Stride, or Step for 1 rd"',
  'Counter Performance':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Composition,Enchantment,Fortune,Mental ' +
    'Traditions=Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allies in a 60\' emanation may substitute a self Performance roll for a save vs. the triggering auditory or visual effect"',
  'Dirge Of Doom':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Fear,Mental ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="30\' emanation inflicts frightened 1 on foes for 1 rd"',
  'Fatal Aria':
    'Level=10 ' +
    'Trait=Focus,Uncommon,Bard,Composition,Death,Emotion,Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Kills a target up to level 16 or 50 HP, inflicts 0 HP and dying 1 on a level 17 target, or inflicts 50 HP on a level 18+ target"',
  'House Of Imaginary Walls':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Illusion,Visual ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Creates an invisible, illusionary, 10\'x10\' wall with Armor Class 10, double the spell level Hardness, and quadruple the spell level HP, for 1 rd"',
  'Inspire Competence':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Allows self to use Performance to Aid an ally skill check, with normal failure counting as a success, for 1 rd"',
  'Inspire Courage':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives allies +1 attack, damage, and saves vs. fear for 1 rd"',
  'Inspire Defense':
    'Level=2 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation gives allies +1 Armor Class and saves, plus resistance of half the spell level to physical damage, for 1 rd"',
  'Inspire Heroics':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Bard,Enchantment,Metamagic ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"A successful Performance check increases the effects of a subsequent <i>Inspire Courage</i> or <i>Inspire Defense</i> to +2, or +3 on a critical success; failure does not expend a Focus Point"',
  'Lingering Composition':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Enchantment,Metamagic ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"A successful Performance check increases the duration of a subsequent cantrip composition to 3 rd, or 4 rd on a critical success; failure does not expend a Focus Point"',
  "Loremaster's Etude":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Bard,Divination,Fortune ' +
    'Traditions=Occult ' +
    'Cast=Free ' +
    'Description=' +
      '"R30\' Target may take the better of two rolls on the triggering Recall Knowledge check"',
  'Soothing Ballad':
    'Level=7 ' +
    'Trait=Focus,Uncommon,Bard,Composition,Emotion,Enchantment,Healing,Mental ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Self and 9 allies gain a counteract attempt on all fear effects, a counteract attempt on all paralysis effects, or 7d8 HP restored (<b>heightened +1</b> restores +1d8 HP)"',
  'Triple Time':
    'Level=2 ' +
    'Trait=Focus,Uncommon,Bard,Cantrip,Composition,Emotion,Enchantment,Mental ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="60\' emanation gives allies +10\' Speed for 1 rd"',
  "Champion's Sacrifice":
    'Level=6 ' +
    'Trait=Focus,Uncommon,Abjuration,Champion ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Redirects the damage of the triggering Strike or failed save from an ally to self"',
  "Hero's Defiance":
    'Level=10 ' +
    'Trait=Focus,Uncommon,Champion,Healing,Necromancy,Positive ' +
    'Traditions=Divine ' +
    'Cast=Free ' +
    'Description=' +
      '"Self recovers 10d4+20 HP before suffering damage that would reduce HP to 0 once per Refocus"',
  'Lay On Hands':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Champion,Healing,Necromancy,Positive ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched regains 6 HP and gains +2 Armor Class for 1 rd; touched undead instead suffers 1d6 HP and -2 Armor Class for 1 rd (<b>save basic Fortitude</b> also negates -2 Armor Class) (<b>heightened +1</b> restores +6 HP or inflicts +1d6 HP)"',
  'Litany Against Sloth':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers Reaction prevention and slowed 1 for 1 rd (<b>save Will</b> Reaction prevention only; critical success negates; critical failure inflicts slowed 2; slothful creatures worsen save by 1 degree)"',
  'Litany Against Wrath':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers 3d6 HP good whenever it damages a good creature for 1 rd (<b>save Will</b> inflicts damage once; critical success negates; critical failure also inflicts enfeebled 2; wrathful creatures worsen save by 1 degree)"',
  'Litany Of Righteousness':
    'Level=7 ' +
    'Trait=Focus,Uncommon,Champion,Evocation,Good,Litany ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Evil target suffers weakness 7 to good for 1 rd (<b>heightened +1</b> inflicts weakness +1)"',
  'Agile Feet':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +5\' Speed and can move normally in difficult terrain for the remainder of the turn"',
  'Appearance Of Wealth':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst fascinates creatures attracted to wealth in a 20\' radius while sustained for up to 1 min (<b>save Will</b> effects last for 1 rd; critical success negates)"',
  'Artistic Flourish':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R15\' Target weapon gains +%{(rank.Crafting||0)-1<?1>?0} attack, or target skill tool gains +%{(rank.Crafting||0)-1<?1>?0} checks, for 10 min (<b>heightened 7th</b> gives +%{(rank.Crafting||0)-1<?2>?0} bonus; <b>10th</b> gives +%{(rank.Crafting||0)-1<?3>?0} bonus)"',
  'Athletic Rush':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +10\' Speed and +2 Athletics for 1 rd and may immediately Stride, Leap, Climb, or Swim"',
  'Bit Of Luck':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Willing target may use the better of two rolls on a save within 1 min once per target per day"',
  'Blind Ambition':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Target suffers -2 to resist attempts to Coerce it to advance its ambitions for 10 min (<b>save Will</b> inflicts -1 resistance; critical success negates; critical failure causes single-minded focus on its ambitions)"',
  'Captivating Adoration':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental,Visual ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Fascinates targets in a 15\' emanation for 1 min (<b>save Will</b> effects last for 1 action; critical success negates; critical failure also improves attitude by 1 step) (<b>heightened +1</b> increases the radius by 15\')"',
  'Charming Touch':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Incapacitation,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched becomes friendly, or helpful if already friendly, and cannot use hostile actions for 10 min (<b>save Will</b> negates; critical success allows the target to notice the attempt; critical failure makes the target helpful)"',
  'Cloak Of Shadow':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Darkness,Evocation,Shadow ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"20\' emanation around willing touched reduces bright light to dim and conceals touched for 1 min; target may shed the cloak, and the spell ends if another picks it up"',
  'Commanding Lash':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Incapacitation,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R100\' Target harmed by self\'s most recent action obeys a command to approach, run away, drop a held object, drop prone, or stand in place for 1 rd (<b>save Will</b> negates; critical failure target uses all actions on its next turn to obey)"',
  'Competitive Edge':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +1 attack and skill checks, increasing to +3 immediately after a foe within 20\' critically succeeds on the same, while sustained for up to 1 min (<b>heightened 7th</b> increases bonuses to +2 and +4)"',
  'Cry Of Destruction':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Sonic ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 1d8 HP sonic, or 1d12 HP sonic if self has already damaged a foe this turn (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d8 HP or +1d12 HP)"',
  'Darkened Eyes':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Darkness,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Suppresses the target\'s darkvision or low-light vision for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure also blinds until a successful save at the end of a turn)"',
  'Dazzling Flash':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Light,Visual ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts blinded for 1 rd (Interact action ends the effect) and dazzled for 1 min (<b>save Fortitude</b> inflicts dazzled for 1 rd; critical success negates; critical failure inflicts dazzled for 1 hr) (<b>heightened 3rd</b> extends effects to a 30\' cone)"',
  "Death's Call":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R20\' Gives self temporary HP for 1 min equal to %{spellModifier.%tradition} + the level of a living creature that dies, or double that for an undead creature that is destroyed"',
  'Delusional Pride':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts -1 attacks and skill checks on a target that fails an attack or skill check by the end of its turn, or -2 if it fails twice, for 10 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure effects last for 24 hr)"',
  'Destructive Aura':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Aura,Cleric,Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' emanation inflicts -2 resistances (<b>heightened +2</b> inflicts an additional -2 resistances)"',
  'Disperse Into Air':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Air,Cleric,Polymorph,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"After taking the triggering damage, self becomes air with no actions and immunity to attacks until the end of the turn, then reforms anywhere within 15\'"',
  'Downpour':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Water ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 30\' burst extinguishes non-magical flames, gives concealment and fire resistance 10, and damages creatures with a water weakness for 1 min (<b>heightened +1</b> gives +2 fire resistance)"',
  "Dreamer's Call":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Incapacitation,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target obeys a suggestion and suffers flat-footed and fascinated until the end of its next turn (<b>save Will</b> inflicts flat-footed and fascinated only; critical success negates; critical failure prevents the target from taking other actions)"',
  'Enduring Might':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Gives self resistance %{8+strengthModifier} to the triggering damage (<b>heightened +1</b> gives +2 resistance)"',
  'Eradicate Undeath':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy,Positive ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' cone inflicts 4d12 HP positive to undead (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d12 HP)"',
  'Face In The Crowd':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +2 Deception and Stealth to blend into a crowd and ignores difficult terrain from crowds for 1 min (<b>heightened 3rd</b> R10\' affects 10 creatures)"',
  'Fire Ray':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Cleric,Evocation,Fire ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 2d6 HP fire; critical success inflicts double HP and 1d4 HP persistent fire (<b>heightened +1</b> inflicts +2d6 HP initial and +1d4 HP persistent)"',
  'Flame Barrier':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Target gains fire resistance 15 against the triggering fire damage (<b>heightened +2</b> gives +5 resistance)"',
  'Forced Quiet':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target can speak only at a whisper, requiring others over 10\' away to succeed on a DC %{spellDifficultyClass.%tradition} Perception to hear, for 1 min (<b>save Fortitude</b> effects last for 1 rd; critical success negates; critical failure effects last for 10 min)"',
  'Glimpse The Truth':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Revelation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Successful counteract attempts in a 30\' emanation allow self to see through illusions for 1 rd (<b>heightened 7th</b> allows others to see through illusions)"',
  "Healer's Blessing":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Healing spells affecting the target restore +2 HP for 1 min (<b>heightened +1</b> restores +1 HP)"',
  'Hurtling Stone':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Cleric,Earth,Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 1d6+%{strengthModifier} HP bludgeoning, or double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Know The Enemy':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows a Recall Knowledge check, using the better of two rolls, during initiative or immediately after inflicting damage to remember a target\'s abilities"',
  'Localized Quake':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Earth,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Choice of a 15\' emanation or 15\' cone inflicts 4d6 HP bludgeoning and knocked prone (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Lucky Break':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to reroll a triggering failed save once per 10 min"',
  "Magic's Vessel":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched gains +1 saves; subsequent casting sustains the spell up to 1 min and gives the target resistance to spell damage equal to the cast spell\'s level"',
  'Malignant Sustenance':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy,Negative ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched undead gains fast healing 7 for 1 min (<b>heightened +1</b> gives fast healing +2)"',
  'Moonbeam':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Cleric,Evocation,Fire,Light ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Spell attack inflicts dazzled for 1 rd and 1d6 HP fire that counts as silver, or dazzled for 1 min and double HP on a critical success (<b>heightened +1</b> inflicts +1d6 HP)"',
  'Mystic Beacon':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives heightened +1 effects to the next damage or healing spell cast by the target within 1 rd"',
  "Nature's Bounty":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Conjuration,Plant,Positive ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Creates a fruit or vegetable that counts as a meal and restores 3d10+12 HP if eaten within 1 min (<b>heightened +1</b> restores +6 HP)"',
  'Overstuff':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target suffers sickened 1 and -10\' Speed until no longer sickened (<b>save Fortitude</b> target may use an action to end the sickened condition; critical success negates; critical failure inflicts sickened 2)"',
  'Perfected Form':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Fortune ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to reroll the triggering failed save vs. a morph, petrification, or polymorph effect"',
  'Perfected Mind':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self an additional Will save vs. a mental effect once per effect"',
  'Positive Luminance':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Light,Necromancy,Positive ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"10\' light emanation inflicts 2 HP positive on successful undead attackers for 1 min; self may increase the radius by 10\' and the damage by 2 HP each rd and may end the spell early to heal a living creature or damage an undead creature by double the current damage HP (<b>heightened +1</b> inflicts +0.5 HP initially and for each increase)"',
  'Precious Metals':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Transforms touched metal item into cold iron, copper, gold, iron, silver, or steel for 1 min (<b>heightened 8th</b> can transform into adamantine or mithral)"',
  "Protector's Sacrifice":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Transfers 3 HP damage of the triggering attack from target to self (<b>heightened +1</b> transfers +3 HP)"',
  "Protector's Sphere":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Aura,Cleric ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' emanation gives resistance 3 to all damage to self and allies while sustained for up to 1 min (<b>heightened +1</b> gives +1 resistance)"',
  'Pulse Of The City':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Scrying ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R25 miles; reveals information about the nearest settlement (<b>heightened 5th</b> increases range to 100 miles)"',
  'Pushing Gust':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Air,Cleric,Conjuration ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R500\' Pushes target away 10\' (<b>save Fortitude</b> pushes 5\'; critical success negates; critical failure pushes 10\' and knocks prone)"',
  'Read Fate':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Prediction ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R10\' Successful DC 6 flat check gives a one-word clue to the target\'s short-term fate"',
  'Rebuke Death':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Healing,Necromancy,Positive ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"1 target in a 20\' emanation (2 or 3 actions affect 2 or 3 targets) regains 3d6 HP and recovers from the dying condition without increasing its wounded condition (<b>heightened +1</b> restores +1d6 HP)"',
  'Retributive Pain':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Mental,Nonlethal ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Inflicts half the triggering damage to self on the attacker as mental HP"',
  'Safeguard Secret':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Mental ' +
    'Traditions=Divine ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R10\' Self and allies gain +4 skill checks to conceal a specified piece of knowledge for 1 hr"',
  'Savor The Sting':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental,Nonlethal ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts 1d4 HP mental and 1d4 HP persistent mental and gives self +1 attack and skill checks vs. the target while persistent damage continues (<b>save Will</b> inflicts half initial HP only; critical success negates; critical failure inflicts double initial and persistent HP) (<b>heightened +1</b> inflicts +1d4 HP initial and persistent)"',
  'Scholarly Recollection':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Allows self to use the best of two rolls on the triggering Seek or Recall Knowledge check"',
  'Shared Nightmare':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Incapacitation,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts confused for 1 action each rd for 1 min (<b>save Will</b> inflicts confused on self for 1 action next turn; critical success inflicts confused on self for 1 rd; critical failure inflicts confused for 1 min)"',
  'Soothing Words':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives the target +1 Will and +2 vs. emotion effects for 1 rd and attempts to counteract an existing emotion effect (<b>heightened 5th</b> gives +2 Will and +3 vs. emotion effects)"',
  'Splash Of Art':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' 5\' burst randomly inflicts one of dazzled for 1 rd, enfeebled 1 for 1 rd, frightened 1, or clumsy 1 for 1 rd (<b>save Will</b> negates; critical failure inflicts dazzled for 1 min, enfeebled 2 for 1 rd, frightened 2, or clumsy 2 for 1 rd)"',
  'Sudden Shift':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Illusion ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Self Steps and becomes concealed until the end of the next turn after the triggering foe melee attack miss"',
  'Sweet Dream':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Auditory,Cleric,Enchantment,Linguistic,Mental,Sleep ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' Willing target who sleeps for 1 min gains +1 intelligence-based skill checks, +1 charisma-based skill checks, or +5\' Speed for 9 min"',
  'Take Its Course':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched gains an immediate save with a +2 or -2 modifier vs. an affliction, or an immediate DC 5 or 20 flat check against persistent poison damage (<b>save Will</b> negates) (<b>heightened 7th</b> affects multiple afflictions and poisons affecting the target)"',
  'Tempt Fate':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Divination,Fortune ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Gives the target +1 on the triggering save and turns a normal success into a critical success or a normal failure into a critical failure (<b>heightened 8th</b> gives +2 on the save)"',
  'Tidal Surge':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation,Water ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Moves the target 5\' over ground or 10\' in water (<b>save Fortitude</b> negates; critical failure doubles distance)"',
  'Touch Of Obedience':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts stupefied 1 until the end of the next turn (<b>save Will</b> inflicts stupefied 1 until the end of the current turn; critical success negates; critical failure inflicts stupefied 1 for 1 min)"',
  'Touch Of The Moon':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Light ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Target emits dim light in a 20\' radius and cycles through benefits each rd for 1 min: no benefit; +1 attack and +4 damage; +1 attack, +4 damage, +1 Armor Class, and +1 saves; +1 Armor Class and +1 saves"',
  'Touch Of Undeath':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Necromancy,Negative ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch inflicts 1d6 HP negative and half healing for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical success inflicts double HP and half healing for 1 min) (<b>heightened +1</b> inflicts +1d6 HP)"',
  "Traveler's Transit":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{speed}\' climb Speed or a %{speed}\' swim Speed for 1 min (<b>heightened 5th</b> allows choosing a %{speed}\' fly Speed)"',
  "Trickster's Twin":
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Illusion,Visual ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target believes that self is in a location up to 100\' distant for 1 min or until succeeding at a Will save in response to interacting with the illusion or to the illusion performing a nonsensical or hostile action (<b>save Will</b> no subsequent Will save is necessary; critical success negates; critical failure requires critical success on a Will save to end the spell)"',
  'Unimpeded Stride':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Frees self from magical holds of a level less than or equal to the spell level and allows a Stride that ignores difficult terrain and Speed penalties"',
  'Unity':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Cleric,Fortune ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Allows allies to use self\'s saving throw vs. the triggering spell or ability"',
  'Veil Of Confidence':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Reduces any frightened condition on self by 1 for 1 min; critical failure on a subsequent save ends the spell and increases the frightened condition by 1"',
  'Vibrant Thorns':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Morph,Plant,Transmutation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Unarmed and adjacent melee attacks on self inflict 1 HP piercing on the attacker for 1 min; casting a positive spell increases the damage to 1d6 HP for 1 turn (<b>heightened +1</b> inflicts +1 HP, or +1d6 HP after casting a positive spell)"',
  'Waking Nightmare':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Fear,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts frightened 2 (<b>save Will</b> inflicts frightened 1; critical success negates; critical failure inflicts frightened 3; failure while sleeping also inflicts fleeing for 1 rd)"',
  'Weapon Surge':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Evocation ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Held weapon gains +1 attack and an additional die of damage on the next attack before the start of the next turn"',
  'Word Of Freedom':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Enchantment,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Suppresses a confused, frightened, grabbed, paralyzed, or restrained condition affecting the target for 1 rd"',
  'Word Of Truth':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Cleric,Divination ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Causes a glowing symbol of %{deity} to appear when self speaks true statements of up to 25 words while sustained for up to 1 min"',
  'Zeal For Battle':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Cleric,Emotion,Enchantment,Fortune,Mental ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R10\' Allows self and an ally to each use the higher of their initiative rolls"',
  'Goodberry':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Healing,Necromancy ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Eating the touched berry within 10 min restores 1d6+4 HP; six berries also count as a full meal (<b>heightened +1</b> affects +1 berry)"',
  'Heal Animal':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Healing,Necromancy,Positive ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched animal (2 actions gives R30\') regains 1d8 HP, or 1d8+8 HP with 2 actions (<b>heightened +1</b> restores +1d8 HP or +1d8+8 HP)"',
  'Impaling Briars':
    'Level=8 ' +
    'Trait=Focus,Uncommon,Conjuration,Druid,Plant ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation inflicts difficult terrain, -10 Speed (<b>save Reflex</b> negates; critical failure inflicts immobilized for 1 rd), or greater difficult terrain, plus 10d6 HP piercing and -10\' Speed on a target with a successful spell attack (or immobilized with a critical success), each rd while sustained for up to 1 min"',
  'Primal Summons':
    'Level=6 ' +
    'Trait=Focus,Uncommon,Conjuration,Druid ' +
    'Traditions=Primal ' +
    'Cast=Free ' +
    'Description=' +
      '"Subsequent <i>Summon Animal</i> or <i>Summon Plant Or Fungus</i> gives summoned creature one of: a 60\' fly Speed; a 20\' burrow speed, -10\' Speed, and resistance 5 to physical damage; +1d6 HP fire damage, resistance 10 to fire, and weakness 5 to cold and water; a 60\' swim Speed, a Shove after a melee attack, and resistance 5 to fire"',
  'Storm Lord':
    'Level=9 ' +
    'Trait=Focus,Uncommon,Air,Druid,Electricity,Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"100\' emanation produces a bolt of lighting that inflicts 10d6 HP electricity and deafened for 1 rd (<b>save basic Reflex</b>) each rd while sustained for up to 1 min, plus a choice of weather: calm; foggy (conceals); rainy (inflicts -2 Acrobatics and Perception); or windy (inflicts -4 ranged attacks and difficult terrain for flying)"',
  'Stormwind Flight':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Air,Druid,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains %{speed}\' fly Speed for 1 min (<b>heightened 6th</b> negates difficult terrain effects when flying against the wind)"',
  'Tempest Surge':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Air,Druid,Electricity,Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 1d12 HP electricity, clumsy 2 for 1 rd, and 1 HP persistent electricity (<b>save basic Reflex</b> inflicts initial HP only)"',
  'Wild Morph':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Morph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains claws that inflict 1d6 HP slashing (requires <i>Wild Shape</i>), jaws that inflict 1d8 HP piercing (requires <i>Insect Shape</i>), resistance 5 to critical hits and precision damage (requires <i>Elemental Shape</i>), 10\' reach (requires <i>Plant Shape</i>), or a 30\' fly Speed (requires <i>Soaring Shape</i>) for 1 min (<b>heightened 6th</b> may choose two effects, claws also inflict 2d6 HP persistent bleed damage, and jaws also inflict 2d6 HP persistent poison damage; <b>10th</b> may choose three effects, claws also inflict 4d6 persistent bleed damage and jaws also inflict 4d6 HP persistent poison damage)"',
  'Wild Shape':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Druid,Polymorph,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Transforms self into a <i>Pest Form</i> creature for 10 min or another creature for 1 min, gaining +2 attacks (<b>heightened 2nd</b> may transform into an <i>Animal Form</i> creature)"',
  'Abundant Step':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Conjuration,Monk,Teleportation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description="Teleports self %{speed>?15}\' within line of sight"',
  'Empty Body':
    'Level=9 ' +
    'Trait=Focus,Uncommon,Conjuration,Monk,Teleportation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description="Moves self to the Ethereal Plane for 1 min"',
  'Ki Blast':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Force,Monk ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"15\' cone inflicts 2d6 HP force and a 5\' push (2 or 3 actions inflicts 3d6 HP in a 30\' cone or 4d6 HP in a 60\' cone) (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and a 10\' push) (<b>heightened +1</b> inflicts +1d6 HP for 1 action or +2d6 HP for 2 or 3)"',
  'Ki Rush':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Monk,Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self to move twice and become concealed until the next turn"',
  'Ki Strike':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Monk,Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"An unarmed Strike or Flurry Of Blows gains +1 attack and +1d6 HP force, lawful, negative, or positive (<b>heightened +4</b> inflicts +1d6 HP)"',
  'Quivering Palm':
    'Level=8 ' +
    'Trait=Focus,Uncommon,Incapacitation,Monk,Necromancy ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"A successful Strike allows self to inflict stunned 3 and 80 HP on the target at any time within 1 month (<b>save Fortitude</b> inflicts stunned 1 and 40 HP and ends the spell; critical success ends the spell; critical failure kills the target) (<b>heightened +1</b> inflicts +10 HP, or +5 HP on a successful save)"',
  'Wholeness Of Body':
    'Level=2 ' +
    'Trait=Focus,Uncommon,Healing,Monk,Necromancy,Positive ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self regains 8 HP or attempts to counteract 1 poison or disease (<b>heightened +1</b> restores +8 HP)"',
  'Wild Winds Stance':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Air,Evocation,Monk,Stance ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Stance gives +2 Armor Class vs. ranged attacks and R30\' unarmed strikes that ignore concealment and cover and inflict 1d6 HP bludgeoning"',
  'Wind Jump':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Air,Monk,Transmutation ' +
    'Traditions=Occult ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains a %{speed}\' fly speed, ending each turn on the ground, for 1 min (<b>heightened 6th</b> allows attempting a DC 30 Acrobatics check to avoid falling at the end of a turn)"',
  'Aberrant Whispers':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Auditory,Enchantment,Mental,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation (2 or 3 actions give a 10\' or 15\' emanation) inflicts stupefied 2 (<b>save Will</b> negates; critical failure inflicts confused) (<b>heightened +3</b> increases the radius by 5\')"',
  'Abyssal Wrath':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"60\' cone inflicts 4d6 HP each of a random pair of damage types: bludgeoning and electricity; acid and slashing; bludgeoning and cold; fire and piercing (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d6 HP each)"',
  'Ancestral Memories':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Divination,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes trained in a non-Lore or ancestral Lore skill for 1 min (<b>heightened 6th</b> becomes expert in the skill)"',
  'Angelic Halo':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Aura,Good,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"15\' emanation increases the HP restored by <i>Heal</i> by double the <i>Heal</i> spell\'s level for 1 min"',
  'Angelic Wings':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Light,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{speed}\' fly Speed and shines a 30\' radius bright light for 3 rd (<b>heightened 5th</b> effects last for 1 min)"',
  'Arcane Countermeasure':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Abjuration,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R120\' Reduces the triggering spell\'s heightened level by 1 and gives the spell\'s targets +2 saves, skill checks, Armor Class, and DC against it"',
  'Celestial Brand':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Curse,Necromancy,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Self and allies gain +1 attacks and skill checks vs. the evil target, and attacks by good creatures inflict +1d4 HP good, for 1 rd (<b>heightened +2</b> good creature attacks inflict +1 HP)"',
  'Diabolic Edict':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Enchantment,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Willing target performs a stated task, gaining +1 attack and skill checks, for 1 rd; refusal inflicts -1 attack and skill checks for 1 rd"',
  'Dragon Breath':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"%{draconicColor<\'Green\'?\\"60\' line\\":\\"30\' cone\\"} inflicts 5d6 HP %{draconicEnergy||\'fire\'} (<b>save basic %{draconicColor==\'Green\'?\'Fortitude\':\'Reflex\'}</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Dragon Claws':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Claws inflict 1d6 HP slashing and 1d6 HP %{draconicEnergy||\'fire\'}, and self gains resistance 5 to %{draconicEnergy||\'fire\'}, for 1 min (<b>heightened 5th</b> claws inflict 2d6 HP, and self gains resistance 10; <b>9th</b> claws inflict 3d6 HP, and self gains resistance 15)"',
  'Dragon Wings':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{Speed>?60}\' fly Speed for 1 min (<b>heightened 8th</b> effects last for 10 min)"',
  'Drain Life':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Necromancy,Negative,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target suffers 3d4 HP negative, and self gains equal temporary HP (<b>save basic Fortitude</b>) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Elemental Blast':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Choice of 30\' cone, 60\' line, or R30\' 10\' burst inflicts 8d6 HP %{$\'features.Elemental (Fire)\'?\'fire\':\'bludgeoning\'} (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Elemental Motion':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evocation,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Self gains a %{$\'features.Elemental (Earth)\'?\\"10\' burrow Speed\\":$\'features.Elemental (Water)\'?speed+\\"\' swim Speed and water breathing\\":(speed+\\"\' fly Speed\\")} for 1 min (<b>heightened 6th</b> gives +10\' Speed; <b>9th</b> gives +20\' Speed)"',
  'Elemental Toss':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Evocation,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Spell attack inflicts 1d8 HP %{$\'features.Elemental (Fire)\'?\'fire\':\'bludgeoning\'}, or double HP on a critical success (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Embrace The Pit':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Evil,Morph,Sorcerer,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains resistance 5 to evil, fire, and poison, resistance 1 to non-silver physical damage, and weakness 5 to good for 1 min (<b>heightened +2</b> gives +5 resistance to evil, fire, and poison, +2 resistance to non-silver physical damage, and +5 weakness to good)"',
  'Extend Spell':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Divination,Metamagic,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Increases the duration of a subsequent targeted spell of less than maximum spell level from 1 min to 10 min"',
  'Faerie Dust':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Enchantment,Mental,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) inflicts loss of Reactions and -2 Perception and Will for 1 rd (<b>save Will</b> negates; critical failure also inflicts -1 Perception and Will for 1 min) (<b>heightened +3</b> increases the radius by 5\')"',
  'Fey Disappearance':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Enchantment,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self becomes invisible and moves normally over natural difficult terrain until the end of the next turn; performing a hostile action ends the spell (<b>heightened 5th</b> a hostile action does not end the spell)"',
  'Fey Glamour':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Illusion,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="R30\' 30\' burst disguises 10 targets for 10 min"',
  "Glutton's Jaws":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Morph,Necromancy,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Bite inflicts 1d8 HP piercing, giving self 1d6 temporary HP, for 1 min (<b>heightened +2</b> gives +1d6 temporary HP</b>)"',
  'Grasping Grave':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Necromancy,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 20\' radius inflicts 6d6 HP slashing and -10\' Speed for 1 rd for 10 min (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and immobilized for 1 rd) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Hellfire Plume':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Evil,Evocation,Fire,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 10\' radius inflicts 4d6 HP fire and 4d6 HP evil (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d6 HP fire and evil)"',
  'Horrific Visage':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Emotion,Fear,Illusion,Mental,Sorcerer,Visual ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' radius inflicts frightened 1 (<b>save Will</b> negates; critical failure inflicts frightened 2) (<b>heightened 5th</b> inflicts frightened 1, 2, or 3 and fleeing for 1 rd on save success, failure, or critical failure)"',
  'Jealous Hex':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Curse,Necromancy,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts enfeebled 1, clumsy 1, drained 1, or stupefied 1, based on the target\'s highest ability modifier, until the target saves or for 1 min (<b>save Will</b> negates; critical failure inflicts condition level 2)"',
  'Swamp Of Sloth':
    'Level=3 ' +
    'Trait=Focus,Uncommon,Conjuration,Olfactory,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R120\' 5\' burst (2 or 3 actions give a 10\' or 15\' burst) inflicts difficult terrain and 1d6 HP poison for 1 min (<b>save basic Fortitude</b>) (<b>heightened +2</b> increases radius by 5\' and inflicts +1d6 HP)"',
  'Tentacular Limbs':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Morph,Sorcerer,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Extends reach for touch spells and unarmed Strikes to 10\' for 1 min; adding an action to touch spells extends reach to 20\' (<b>heightened +2</b> adding an action gives +10\' touch spell reach)"',
  "Undeath's Blessing":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Necromancy,Negative,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched responds to <i>Heal</i> and <i>Harm</i> as an undead for 1 min, and <i>Harm</i> restores +2 HP (<b>save Will</b> <i>Heal</i> and <i>Harm</i> have half effect; critical success negates) (<b>heightened +1</b> <i>Harm</i> restores +2 HP)"',
  'Unusual Anatomy':
    'Level=5 ' +
    'Trait=Focus,Uncommon,Polymorph,Sorcerer,Transmutation ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains darkvision and resistance 10 to precision and critical damage and inflicts 2d6 HP acid on successful non-reach melee attackers for 1 min (<b>heightened +2</b> gives +5 resistances and inflicts +1d6 HP)"',
  "You're Mine":
    'Level=5 ' +
    'Trait=Focus,Uncommon,Emotion,Enchantment,Incapacitation,Mental,Sorcerer ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts stunned 1 for 1 rd and allows self to direct 1 target action (<b>save Will</b> inflicts stunned only; critical success negates; critical failure gives control for 1 rd) (<b>heightened 7th</b> gives control for 1 rd; critical failure gives control for 1 min or until the target succeeds on a save at the end of each turn)"',
  'Augment Summoning':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Conjuration,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="R30\' Summoned target gains +1 on all checks for 1 min"',
  'Call Of The Grave':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Arcane,Attack,Necromancy,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spell attack inflicts sickened 1, or sickened 2 and slowed 1 until no longer sickened on a critical success"',
  'Charming Words':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Auditory,Enchantment,Incapacitation,Linguistic,Mental,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Prevents the target from taking hostile actions against self for 1 rd (<b>save Will</b> target suffers -1 attack and damage vs. self; critical success negates; critical failure inflicts stunned 1)"',
  'Dimensional Steps':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Conjuration,Teleportation,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Teleports self to a visible location within 20\' (<b>heightened +1</b> gives +5\' teleport distance)"',
  "Diviner's Sight":
    'Level=1 ' +
    'Trait=Focus,Uncommon,Concentrate,Divination,Fortune,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target may substitute self\'s d20 roll for a saving throw or skill check within 1 rd"',
  'Dread Aura':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Aura,Enchantment,Emotion,Fear,Mental,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts frightened 1 on foes while sustained for up to 1 min"',
  'Elemental Tempest':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Evocation,Metamagic,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Subsequent casting of an acid, cold, electricity, or fire spell inflicts 1d6 HP per spell level of the same damage type on foes in a 10\' emanation"',
  'Energy Absorption':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Abjuration,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Gives self resistance 15 to damage from the triggering acid, cold, electricity, or fire effect (<b>heightened +1</b> gives +5 resistance)"',
  'Force Bolt':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Evocation,Force,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+1 HP force (<b>heightened +2</b> inflicts +1d4+1 HP)"',
  'Hand Of The Apprentice':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Attack,Evocation,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R500\' Makes a remote attack with a melee weapon%{spellModifier.%tradition>strengthModifier?\', inflicting +\'+(spellModifier.%tradition-strengthModifier)+\' damage\':spellModifier.%tradition<strengthModifier?\', inflicting \'+(spellModifier.%tradition-strengthModifier)+\' damage\':\'\'}; a critical hit inflicts the critical specialization effect"',
  'Invisibility Cloak':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Illusion,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"Self becomes invisible for 1 min; using a hostile action ends the spell (<b>heightened 6th</b> effects last 10 min; <b>8th</b> effects last 1 hr)"',
  'Life Siphon':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Healing,Necromancy,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Casting a necromancy spell restores 1d8 HP per spell level to self"',
  'Physical Boost':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Transmutation,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched gains +2 on the next Acrobatics check, Athletics check, Fortitude save, or Reflex save within the next rd"',
  'Protective Ward':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Abjuration,Aura,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation gives +1 Armor Class to self and allies while sustained for up to 1 min; each Sustain increases the radius by 5\'"',
  'Shifting Form':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Morph,Transmutation,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains +20\' Speed, a %{speed//2}\' climb or swim Speed, darkvision, 60\' imprecise scent, or claws that inflict 1d8 HP slashing for 1 min"',
  'Vigilant Eye':
    'Level=4 ' +
    'Trait=Focus,Uncommon,Divination,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R500\' Creates an invisible sensor that allows self to see from the target location for 1 hr; spending a Focus Point extends the duration to 2 hr"',
  'Warped Terrain':
    'Level=1 ' +
    'Trait=Focus,Uncommon,Illusion,Visual,Wizard ' +
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
  'Shield Bash':Pathfinder2E.WEAPONS.Shield,
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

  'Lesser Acid Flask':
    Pathfinder2E.WEAPONS['Lesser Acid Flask'] + ' Trait=Acid,Bomb,Splash',
  "Lesser Alchemist's Fire":
    Pathfinder2E.WEAPONS["Lesser Alchemist's Fire"] + ' Trait=Fire,Bomb,Splash',
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
Pathfinder2ERemaster.attributeRules = function(rules, abilities) {
  Pathfinder2E.abilityRules(rules, abilities);
  delete rules.choices.abilgens;
  rules.defineChoice('abilgens',
    'Standard ancestry boosts', 'Two free ancestry boosts'
  );
  for(let a in abilities) {
    delete rules.choices.notes[a];
    rules.defineChoice('notes', a + ':%1');
    rules.defineRule
      ('base' + a.charAt(0).toUpperCase() + a.substring(1), '', '=', '10');
  }
  rules.defineRule('abilityNotes.abilityBoosts', '', '?', 'null');
  rules.defineRule('abilityNotes.attributeBoosts',
    'level', '=', '4 + Math.floor(source / 5) * 4'
  );
  QuilvynRules.validAllocationRules
    (rules, 'attributeBoost', 'choiceCount.Attribute', 'abilityBoostsAllocated');
  rules.defineRule('validationNotes.abilityBoostAllocation',
    'abilityBoostsAllocated', '?', 'null'
  );
};

/* Defines the rules related to combat. */
Pathfinder2ERemaster.combatRules = function(rules, armors, shields, weapons) {
  Pathfinder2E.combatRules(rules, armors, shields, weapons);
};

/* Defines rules related to basic character identity. */
Pathfinder2ERemaster.identityRules = function(
  rules, ancestries, backgrounds, classes, deities, heritages
) {
  QuilvynUtils.checkAttrTable(heritages, ['Trait']);
  Pathfinder2E.identityRules
    (rules, {}, ancestries, backgrounds, classes, deities);
  for(let h in heritages)
    rules.choiceRules(rules, 'Heritage', h, heritages[h]);
  rules.defineRule('featCount.Ancestry', 'featureNotes.lineage', '+=', '1');
};

/* Defines rules related to magic use. */
Pathfinder2ERemaster.magicRules = function(rules, spells) {
  Pathfinder2E.magicRules(rules, spells);
};

/* Defines rules related to character aptitudes. */
Pathfinder2ERemaster.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  for(let f in features)
    if(features[f] == null)
      console.log(f);
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
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
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
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      QuilvynUtils.getAttrValueArray(attrs, 'AreasOfConcern'),
      QuilvynUtils.getAttrValueArray(attrs, 'DivineAttribute'),
      QuilvynUtils.getAttrValue(attrs, 'DivineSanctification')
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
  else if(type == 'Heritage')
    Pathfinder2ERemaster.heritageRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Trait')
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
      QuilvynUtils.getAttrValue(attrs, 'Attribute'),
      QuilvynUtils.getAttrValue(attrs, 'Subcategory')
    );
  else if(type == 'Spell') {
    let level = QuilvynUtils.getAttrValue(attrs, 'Level');
    let trads = QuilvynUtils.getAttrValueArray(attrs, 'Traditions');
    let traits = QuilvynUtils.getAttrValueArray(attrs, 'Trait');
    let isCantrip = traits.includes('Cantrip');
    let isFocus = traits.includes('Focus');
    trads.forEach(t => {
      let spellName =
        name + ' (' + t.charAt(0) + (isCantrip ? 'C' : '') + level + (isFocus ? ' Foc' : '') + ')';
      Pathfinder2ERemaster.spellRules(rules, spellName,
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
  if(name == 'Human') {
    rules.defineRule('skillNotes.skilledHeritageHuman', 'level', '?', 'null');
    rules.defineRule('skillNotes.skilledHuman',
      'level', '=', 'source<5 ? "Trained" : "Expert"'
    );
  } else if(name == 'Leshy') {
    Pathfinder2E.weaponRules(
      rules, 'Spines', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Spines', 'combatNotes.cactusLeshy', '=', '1');
  }
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
  if(name == 'Raised By Belief') {
    rules.defineRule('abilityNotes.beliefAttributes',
      'deityAttributes', '=', 'source.replaceAll(\'/\', \', \')'
    );
    rules.defineRule('featureNotes.beliefSkills', 'deitySkill', '=', null);
    rules.defineRule('skillNotes.beliefSkills', 'deitySkill', '=', null);
    rules.defineRule
      ('skillNotes.beliefSkills.1', 'deity', '=', 'source + " Lore"');
  }
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
  if(name == 'Cleric') {
    rules.defineRule('selectableFeatureCount.Cleric (Sanctification)',
      'deitySanctification', '?', 'source=="Either"',
      'featureNotes.sanctification', '=', '1'
    );
    rules.defineRule('traits.Holy',
      'deitySanctification', '=', 'source=="Holy" ? 1 : null',
      'features.Holy', '=', '1'
    );
    rules.defineRule('traits.Unholy',
      'deitySanctification', '=', 'source=="Unholy" ? 1 : null',
      'features.Unholy', '=', '1'
    );
  } else if(name == 'Fighter') {
    rules.defineRule('selectableFeatureCount.Fighter (Key Attribute)',
      'featureNotes.fighterKeyAttribute', '=', '1'
    );
  } else if(name == 'Witch') {
    rules.defineRule('patronTraditionsLowered',
      'patronTraditions', '=', 'source.toLowerCase()'
    );
    rules.defineRule
      ('magicNotes.expertSpellcaster', 'patronTraditions', '=', null);
    rules.defineRule
      ('magicNotes.legendarySpellcaster', 'patronTraditions', '=', null);
    rules.defineRule
      ('magicNotes.masterSpellcaster', 'patronTraditions', '=', null);
    rules.defineRule
      ('magicNotes.witchSpellcasting', 'patronTraditionsLowered', '=', null);
    rules.defineRule('selectableFeatureCount.Witch (Patron)',
      'featureNotes.patron', '=', '1'
    );
    rules.defineRule
      ('skillNotes.witchSkills', 'intelligenceModifier', '=', 'source * 3');
    rules.defineRule
      ('spellSlots.P10', "magicNotes.patron'sGift", '=', 'null'); // italics
  }
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
  rules, name, font, domains, weapon, skill, spells, areas, attributes,
  sanctification
) {
  Pathfinder2E.deityRules(
    rules, name, null, [], font, domains, weapon, skill, spells
  );
  if(rules.deityStats.areas == null) {
    rules.deityStats.areas = {},
    rules.deityStats.attributes = {},
    rules.deityStats.sanctification = {}
  }
  rules.deityStats.areas[name] = areas.join('/');
  rules.deityStats.attributes[name] = attributes.join('/');
  rules.deityStats.sanctification[name] = sanctification;
  rules.defineRule('deityAreas',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.areas) + '[source]'
  );
  rules.defineRule('deityAttributes',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.attributes) + '[source]'
  );
  rules.defineRule('deitySanctification',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.sanctification) + '[source]'
  );
  rules.defineRule('features.Assurance (' + skill + ')',
    'featureNotes.beliefSkills', '=', 'source=="' + skill + '" ? 1 : null'
  );
  rules.defineRule('trainingLevel.' + skill,
    'skillNotes.beliefSkills', '^=', 'source=="' + skill + '" ? 1 : null'
  );
  rules.defineRule('trainingCount.' + skill,
    'skillNotes.beliefSkills', '+=', 'source=="' + skill + '" ? 1 : null'
  );
  rules.defineRule('trainingLevel.' + name + ' Lore',
    'skillNotes.beliefSkills.1', '^=', 'source=="' + name + ' Lore" ? 1 : null'
  );
  rules.defineRule('trainingCount.' + name + ' Lore',
    'skillNotes.beliefSkills.1', '+=', 'source=="' + name + ' Lore" ? 1 : null'
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
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  Pathfinder2E.featRulesExtra(rules, name);
  if(name == 'Double, Double') {
    rules.defineRule(
      'skillNotes.cauldron', 'skillNodes.double,Double', '=', 'null' // italics
    );
  } else if(name == 'Gnome Obsession') {
    rules.defineRule('skillNotes.gnomeObsession', 'level', '?', 'null');
  } else if(name == 'Grown Of Oak') {
    rules.defineRule('magicNotes.grownOfOak',
      '', '=', '1',
      'spellSlots.P4', '^', '2',
      'spellSlots.P5', '^', '3',
      'spellSlots.P6', '^', '4',
      'spellSlots.P7', '^', '5',
      'spellSlots.P8', '^', '6',
      'spellSlots.P9', '^', '7',
      'spellSlots.P10', '^', '8'
    );
  } else if(name == 'Loud Singer') {
    rules.defineRule
      ('combatNotes.goblinSong', 'combatNotes.loudSinger', '=', 'null');
  } else if(name == 'Martial Experience') {
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
  } else if(name == "Patron's Truth") {
    rules.defineRule('spellSlots.A10', "magicNotes.patron'sTruth", '+', '1');
    rules.defineRule('spellSlots.D10', "magicNotes.patron'sTruth", '+', '1');
    rules.defineRule('spellSlots.O10', "magicNotes.patron'sTruth", '+', '1');
    rules.defineRule('spellSlots.P10', "magicNotes.patron'sTruth", '+', '1');
  } else if(name == 'Slag May') {
    Pathfinder2E.weaponRules(
      rules, 'Claws', 'Unarmed', 0, '1d6 S', 0, 0, 'Brawling',
      ['Grapple', 'Unarmed'], null
    );
    rules.defineRule('weapons.Claws', 'combatNotes.slagMay', '=', '1');
  } else if(name == 'Tusks') {
    Pathfinder2E.weaponRules(
      rules, 'Tusks', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Tusks', 'combatNotes.tusks', '=', '1');
  } else if(name.startsWith('Weapon Proficiency')) {
    rules.defineRule('combatNotes.' + prefix,
      'level', '=', 'source<11 ? "Trained" : "Expert"'
    );
  } else if(name.match(/^Witch's Armaments/)) {
    rules.defineRule
      ("features.Witch's Armaments", 'features.' + name, '=', '1');
  } else if(name == "Witch's Communion") {
    rules.defineRule("magicNotes.witch'sCharge",
      "magicNotes.witch'sCommunion", '=', 'null' // italics
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
  let matchInfo;
  notes.forEach(n => {
    matchInfo = n.match(/Spell Trained \((.*)\)/);
    if(matchInfo && ((rules.getChoices('levels') || {}).Witch || '').includes(name + ':Patron')) {
      let trad = matchInfo[1];
      rules.defineRule('witch' + trad + 'Level',
        'patronTraditions', '?', 'source && source.includes("' + trad + '")',
        'levels.Witch', '=', null
      );
      rules.defineRule('patronTraditions',
        'features.' + name, '=', '!dict.patronTraditions ? "' + trad + '" : !dict.patronTraditions.includes("' + trad + '") ? dict.patronTraditions + "; ' + trad + '" : dict.patronTraditions'
      );
    }
  });
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

Pathfinder2ERemaster.heritageRules = function(rules, name, traits) {
  for(let a in rules.getChoices('ancestrys')) {
    if(traits.includes('Non-' + a))
      continue;
    let heritage = name + ' ' + a;
    let prefix = a.charAt(0).toLowerCase() + a.substring(1).replaceAll(' ', '');
    Pathfinder2E.featureListRules
      (rules, ['1:' + heritage + ':Heritage'], a, prefix + 'Level', true);
    rules.defineRule
      (prefix + 'HeritageCount', prefix + 'Features.' + heritage, '+=', '1');
    rules.defineRule
      ('heritage', prefix + 'Features.' + heritage, '=', '"' + heritage + '"');
    rules.defineRule('features.' + name, 'features.' + heritage, '=', '1');
    let selectables = rules.getChoices('selectableFeatures');
    if(a + ' - ' + heritage in selectables)
      selectables[a + ' - ' + heritage] +=
        ' Trait=' + traits.map(x => '"' + x + '"').join(',');
  }
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
 * Defines in #rules# the rules associated with spell #name#. #tradition# and
 * #level# are used to compute any saving throw value required by the spell.
 * #cast# gives the casting actions or time required to cast the spell,
 * #traits# lists any traits the spell has, and #description# is a verbose
 * description of the spell's effects.
 */
Pathfinder2ERemaster.spellRules = function(
  rules, name, level, tradition, cast, traits, description
) {
  Pathfinder2E.spellRules(
    rules, name, null, level, tradition, cast, traits, description
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
    'combatNotes.martialExperience', '=', '0'
  );
  if(range)
    rules.defineRule('range.' + name, 'combatNotes.strongArm', '+', '10');
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
      ['Attribute', 'Attribute', 'text', [20]],
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
      ['Attribute', 'Attribute', 'select-one', Object.keys(Pathfinder2E.ABILITIES).map(x => x.charAt(0).toUpperCase() + x.substring(1))],
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
  let result =
    Pathfinder2E.initialEditorElements()
    .filter(x => !(x[0].startsWith('base')) && x != 'alignment');
  result.forEach(item => {
    let m = item[0].match(/^abilityBoosts.(.)(.*)$/);
    if(m)
      item[1] = m[1].toUpperCase() + m[2] + ' Boosts';
    item[1] = item[1].replace('Ability', 'Attribute');
  });
  return result;
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
    // Grab text of all Attribute Boost features and notes
    let boostTexts = [];
    for(attr in attrs) {
      if((matchInfo = attr.match(/^\w+Features.Attribute\s+Boost\s+\((.*)\)$/)))
        boostTexts.push(matchInfo[1]);
      else if(allNotes[attr] &&
              (matchInfo=allNotes[attr].match(/Attribute\s+Boost\s+\((.*?)\)/)) != null)
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
