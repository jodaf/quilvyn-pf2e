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
    'selectableFeatures:Heritage,set,ancestryHeritages',
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
  'Dwarf':
    Pathfinder2E.ANCESTRIES.Dwarf
    .replaceAll('Ability', 'Attribute')
    .replace('Selectables=', 'Selectables="1:Versatile Heritage:Heritage",'),
  'Elf':
    Pathfinder2E.ANCESTRIES.Elf
    .replaceAll('Ability', 'Attribute')
    .replace('Selectables=', 'Selectables="1:Versatile Heritage:Heritage","1:Ancient Elf:Heritage",'),
  'Gnome':
    Pathfinder2E.ANCESTRIES.Gnome
    .replaceAll('Ability', 'Attribute')
    .replace('Sylvan', 'Fey')
    .replace('Selectables=', 'Selectables="1:Versatile Heritage:Heritage",'),
  'Goblin':
    Pathfinder2E.ANCESTRIES.Goblin
    .replaceAll('Ability', 'Attribute')
    .replace('Selectables=', 'Selectables="1:Versatile Heritage:Heritage",'),
  'Halfling':
    Pathfinder2E.ANCESTRIES.Halfling
    .replaceAll('Ability', 'Attribute')
    .replace('Selectables=', 'Selectables="1:Versatile Heritage:Heritage","1:Jinxed Halfling:Heritage",'),
  'Human':
    Pathfinder2E.ANCESTRIES.Human
    .replaceAll('Ability', 'Attribute')
    .replace('"1:Half-Elf:Heritage","1:Half-Orc:Heritage"', '"1:Versatile Heritage:Heritage"')
    .replaceAll(/Heritage Human/g, 'Human'),
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
      '"1:Vine Leshy:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Fey ' +
    'Traits=Leshy,Plant',
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
      '"1:Winter Orc:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Orcish ' +
    'Traits=Orc,Humanoid',
  // Core 2
  'Catfolk':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boost (Dexterity; Charisma; Choose 1 from any)",' +
      '"1:Attribute Flaw (Wisdom)",' +
      '"1:Low-Light Vision",' +
      '"1:Land On Your Feet","1:Catfolk Heritage" ' +
    'Selectables=' +
      '"1:Clawed Catfolk:Heritage",' +
      '"1:Hunting Catfolk:Heritage",' +
      '"1:Jungle Catfolk:Heritage",' +
      '"1:Liminal Catfolk:Heritage",' +
      '"1:Nine Lives Catfolk:Heritage",' +
      '"1:Sharp-Eared Catfolk:Heritage",' +
      '"1:Winter Catfolk:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Amurrun,Common ' +
    'Traits=Catfolk,Humanoid',
  'Hobgoblin':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boost (Constitution; Intelligence; Choose 1 from any)",' +
      '"1:Attribute Flaw (Wisdom)",' +
      '"1:Darkvision","1:Hobgoblin Heritage" ' +
    'Selectables=' +
      '"1:Elfbane Hobgoblin:Heritage",' +
      '"1:Runtboss Hobgoblin:Heritage",' +
      '"1:Shortshanks Hobgoblin:Heritage",' +
      '"1:Smokeworker Hobgoblin:Heritage",' +
      '"1:Warmarch Hobgoblin:Heritage",' +
      '"1:Warrenbred Hobgoblin:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Goblin ' +
    'Traits=Hobgoblin,Humanoid',
  'Kholo':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boost (Strength; Intelligence; Choose 1 from any)",' +
      '"1:Attribute Flaw (Wisdom)",' +
      '"1:Bite",' +
      '"1:Low-Light Vision","1:Kholo Heritage" ' +
    'Selectables=' +
      '"1:Ant Kholo:Heritage",' +
      '"1:Cave Kholo:Heritage",' +
      '"1:Dog Kholo:Heritage",' +
      '"1:Great Kholo:Heritage",' +
      '"1:Sweetbreath Kholo:Heritage",' +
      '"1:Winter Kholo:Heritage",' +
      '"1:Witch Kholo:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Kholo ' +
    'Traits=Kholo,Humanoid',
  'Kobold':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boost (Dexterity; Charisma; Choose 1 from any)",' +
      '"1:Attribute Flaw (Constitution)",' +
      '"1:Small",' +
      '"1:Darkvision","1:Kobold Heritage" ' +
    'Selectables=' +
      '"1:Cavernstalker Kobold:Heritage",' +
      '"1:Dragonscaled Kobold:Heritage",' +
      '"1:Elementheart Kobold:Heritage",' +
      '"1:Spellhorn Kobold:Heritage",' +
      '"1:Strongjaw Kobold:Heritage",' +
      '"1:Tunnelflood Kobold:Heritage",' +
      '"1:Venomtail Kobold:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Sakvroth ' +
    'Traits=Humanoid,Kobold',
  'Lizardfolk':
    'HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boost (Strength; Wisdom; Choose 1 from any)",' +
      '"1:Attribute Flaw (Intelligence)",' +
      '"1:Claws",' +
      '"1:Aquatic Adaptation","1:Lizardfolk Heritage" ' +
    'Selectables=' +
      '"1:Cliffscale Lizardfolk:Heritage",' +
      '"1:Cloudleaper Lizardfolk:Heritage",' +
      '"1:Frilled Lizardfolk:Heritage",' +
      '"1:Sandstrider Lizardfolk:Heritage",' +
      '"1:Unseen Lizardfolk:Heritage",' +
      '"1:Wetlander Lizardfolk:Heritage",' +
      '"1:Woodstalker Lizardfolk:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Iruxi ' +
    'Traits=Humanoid,Lizardfolk',
  'Ratfolk':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boost (Dexterity; Intelligence; Choose 1 from any)",' +
      '"1:Attribute Flaw (Strength)",' +
      '"1:Small",' +
      '"1:Low-Light Vision",' +
      '"1:Sharp Teeth","1:Ratfolk Heritage" ' +
    'Selectables=' +
      '"1:Deep Rat:Heritage",' +
      '"1:Desert Rat:Heritage",' +
      '"1:Longsnout Rat:Heritage",' +
      '"1:Sewer Rat:Heritage",' +
      '"1:Shadow Rat:Heritage",' +
      '"1:Snow Rat:Heritage",' +
      '"1:Tunnel Rat:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Ysoki ' +
    'Traits=Humanoid,Ratfolk',
  'Tengu':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boost (Dexterity; Choose 1 from any)",' +
      '"1:Low-Light Vision",' +
      '"1:Sharp Beak","1:Tengu Heritage" ' +
    'Selectables=' +
      '"1:Dogtooth Tengu:Heritage",' +
      '"1:Jinxed Tengu:Heritage",' +
      '"1:Mountainkeeper Tengu:Heritage",' +
      '"1:Skyborn Tengu:Heritage",' +
      '"1:Stormtossed Tengu:Heritage",' +
      '"1:Taloned Tengu:Heritage",' +
      '"1:Wavediver Tengu:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Tengu ' +
    'Traits=Humanoid,Tengu',
  'Tripkee':
    'HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boost (Dexterity; Wisdom; Choose 1 from any)",' +
      '"1:Attribute Flaw (Strength)",' +
      '"1:Low-Light Vision",' +
      '"1:Natural Climber","1:Tripkee Heritage" ' +
    'Selectables=' +
      '"1:Poisonhide Tripkee:Heritage",' +
      '"1:Riverside Tripkee:Heritage",' +
      '"1:Snaptongue Tripkee:Heritage",' +
      '"1:Stickytoe Tripkee:Heritage",' +
      '"1:Thickskin Tripkee:Heritage",' +
      '"1:Windweb Tripkee:Heritage",' +
      '"1:Versatile Heritage:Heritage" ' +
    'Languages=Common,Tripkee ' +
    'Traits=Humanoid,Tripkee'
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
  'Warrior':Pathfinder2E.BACKGROUNDS.Warrior,
  // Core 2
  'Astrologer':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Occultism; Astrology Lore)",' +
      '"1:Oddity Identification"',
  'Barber':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Dexterity, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Medicine; Surgery Lore)",' +
      '"1:Risky Surgery"',
  'Bookkeeper':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Accounting Lore)",' +
      '"1:Eye For Numbers"',
  'Courier':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Dexterity, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Choose 1 from any Settlement Lore)",' +
      '"1:Glean Contents"',
  'Driver':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Strength, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Acrobatics; Piloting Lore)",' +
      '"1:Assurance (Piloting Lore)"',
  'Insurgent':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Strength, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Deception; Warfare Lore)",' +
      '"1:Lengthy Diversion"',
  'Outrider':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Nature; Plains Lore)",' +
      '"1:Express Rider"',
  'Pilgrim':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Wisdom, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Religion; Choose 1 from any Deity Lore)",' +
      '"1:Pilgrim\'s Token"',
  'Refugee':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Choose 1 from any Settlement Lore)",' +
      '"1:Oddity Identification"',
  'Root Worker':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Occultism; Herbalism Lore)",' +
      '"1:Root Magic"',
  'Saboteur':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Strength, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Thievery; Engineering Lore)",' +
      '"1:Concealing Legerdemain"',
  'Scavenger':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Choose 1 from any Settlement Lore)",' +
      '"1:Forager"',
  'Servant':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Dexterity, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Labor Lore)",' +
      '"1:Read Lips"',
  'Squire':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Strength, Constitution; Choose 1 from any)",' +
      '"1:Skill Trained (Athletics; Choose 1 from Heraldry Lore, Warfare Lore)",' +
      '"1:Armor Assist"',
  'Tax Collector':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Strength, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Intimidation; Choose 1 from any Settlement Lore)",' +
      '"1:Quick Coercion"',
  'Ward':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Constitution, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Performance; Genealogy Lore)",' +
      '"1:Fascinating Performance"'
  // TODO Rare backgrounds, pg 51
};
for(let b in Pathfinder2ERemaster.BACKGROUNDS)
  Pathfinder2ERemaster.BACKGROUNDS[b] =
    Pathfinder2ERemaster.BACKGROUNDS[b].replaceAll('Ability', 'Attribute');
Pathfinder2ERemaster.CLASSES = {

  'Bard':
    // Ability => Attribute
    // 1:Attack Trained (Simple Weapons; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip; Unarmed Attacks) =>
    // 1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)
    // TODO 1:Spell Trained (Occult) => 1:Spell Trained (Bard)?
    // 1:Occult Spellcasting => 1:Bard Spellcasting
    // null => 1:Warrior:Muse
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
      '"1:School Of Ars Grammatica:Arcane School",' +
      '"1:School Of Battle Magic:Arcane School",' +
      '"1:School Of The Boundary:Arcane School",' +
      '"1:School Of Civic Wizardry:Arcane School",' +
      '"1:School Of Mentalism:Arcane School",' +
      '"1:School Of Protean Form:Arcane School",' +
      '"1:School Of Unified Magical Theory:Arcane School",' +
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
      'A10:1@19',

  // Core 2

  'Alchemist':
    // Ability => Attribute
    // 1:Infused Reagents => 1:Versatile Vials
    // 1:Mutagenic Flashback => null
    // 7:Iron Will => 7:Will Expertise
    // 7:Perpetual Infusions => null
    // 9:Alertness => 9:Perception Expertise
    // 11:Juggernaut => 11:Chemical Hardiness
    // 11:Perpetual Potency => 11:Advanced Vials
    // 15:Alchemical Alacrity => 15:Alchemical Weapon Mastery
    // 15:Evasion => 15:Explosion Dodger
    // 17:Perpetual Perfection => 17:Abundant Vials
    'Ability=intelligence HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Intelligence)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Reflex)","1:Save Trained (Will)",' +
      '"1:Alchemist Skills",' +
      '"1:Attack Trained (Simple Weapons; Alchemical Bombs; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Class Trained (Alchemist)",' +
      '"1:Alchemy","1:Formula Book","1:Advanced Alchemy","1:Versatile Vials",' +
      '"1:Quick Alchemy","1:Research Field","1:Alchemist Feats",' +
      '"2:Skill Feats","3:General Feats","3:Skill Increases",' +
      '"5:Field Discovery","5:Powerful Alchemy",' +
      '"7:Alchemical Weapon Expertise","7:Will Expertise",' +
      '"9:Alchemical Expertise","9:Double Brew","9:Perception Expertise",' +
      '"11:Advance Vials","11:Chemical Hardiness",' +
      '"features.Bomber ? 13:Greater Field Discovery (Bomber)",' +
      '"features.Chirurgeon ? 13:Greater Field Discovery (Chirurgeon)",' +
      '"features.Mutagenist ? 13:Greater Field Discovery (Mutagenist)",' +
      '"13:Medium Armor Expertise","13:Weapon Specialization",' +
      '"15:Alchemical Weapon Mastery","15:Explosion Dodger",' +
      '"17:Abundant Vials","17:Alchemical Mastery",' +
      '"19:Medium Armor Mastery" ' +
    'Selectables=' +
      '"1:Bomber:Research Field",' +
      '"1:Chirurgeon:Research Field",' +
      '"1:Mutagenist:Research Field",' +
      '"1:Toxicologist:Research Field"',

  'Barbarian':
    // Ability => Attribute
    // null => 1:Quick-Tempered
    // 3:Deny Advantage => null
    // null => 3:Furious Footfalls
    // 13:Weapon Fury => 13:Weapon Mastery
    // 17:Heightened Senses => 17:Perception Mastery
    // 17:Quick Rage => 17:Revitalizing Rage
    // 19:Armor Of Fury => 19:Armor Mastery
    // null => 1:Superstition Instinct
    'Ability=strength HitPoints=12 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Strength)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Fortitude; Will)","1:Save Trained (Reflex)",' +
      '"1:Barbarian Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Unarmored Defense)",' +
      '"1:Class Trained (Barbarian)",' +
      '1:Rage,"1:Quick-Tempered",1:Instinct,"1:Barbarian Feats",' +
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
      '"2:Skill Feats","3:Furious Footfalls","3:General Feats",' +
      '"3:Skill Increases",5:Brutality,7:Juggernaut,' +
      '"7:Specialization Ability","7:Weapon Specialization",' +
      '"9:Reflex Expertise",' +
      '"features.Animal Instinct ? 9:Raging Resistance (Animal)",' +
      '"features.Dragon Instinct ? 9:Raging Resistance (Dragon)",' +
      '"features.Fury Instinct ? 9:Raging Resistance (Fury)",' +
      '"features.Giant Instinct ? 9:Raging Resistance (Giant)",' +
      '"features.Spirit Instinct ? 9:Raging Resistance (Spirit)",' +
      '"11:Mighty Rage","13:Greater Juggernaut","13:Medium Armor Expertise",' +
      '"13:Weapon Mastery","15:Greater Weapon Specialization",' +
      '"15:Indomitable Will","17:Perception Mastery","19:Armor Mastery",' +
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
      '"1:Dragon Instinct (Silver):Instinct",' +
      '"1:Superstition Instinct:Instinct"'

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
  'Dwarven Doughtiness':'Traits=Ancestry,Dwarf',
  'Dwarven Lore':Pathfinder2E.FEATS['Dwarven Lore'],
  'Dwarven Weapon Familiarity':Pathfinder2E.FEATS['Dwarven Weapon Familiarity'],
  'Mountain Strategy':'Traits=Ancestry,Dwarf',
  'Rock Runner':Pathfinder2E.FEATS['Rock Runner'],
  "Stonemason's Eye":Pathfinder2E.FEATS.Stonecunning,
  'Unburdened Iron':Pathfinder2E.FEATS['Unburdened Iron'],
  'Boulder Roll':Pathfinder2E.FEATS['Boulder Roll'],
  'Defy The Darkness':
    'Traits=Ancestry,Dwarf Require="level >= 5","features.Darkvision"',
  'Dwarven Reinforcement':
    'Traits=Ancestry,Dwarf Require="level >= 5","rank.Crafting >= 2"',
  'Echoes In Stone':'Traits=Ancestry,Dwarf Require="level >= 9"',
  "Mountain's Stoutness":Pathfinder2E.FEATS["Mountain's Stoutness"],
  'Stone Bones':'Traits=Ancestry,Dwarf Require="level >= 9"',
  'Stonewalker':Pathfinder2E.FEATS.Stonewalker,
  'March The Mines':'Traits=Ancestry,Dwarf Require="level >= 13"',
  'Telluric Power':'Traits=Ancestry,Dwarf Require="level >= 13"',
  'Stonegate':'Traits=Ancestry,Dwarf Require="level >= 17"',
  'Stonewall':'Traits=Ancestry,Dwarf Require="level >= 17"',

  'Ancestral Longevity':Pathfinder2E.FEATS['Ancestral Longevity'],
  'Elven Lore':Pathfinder2E.FEATS['Elven Lore'],
  'Elven Weapon Familiarity':Pathfinder2E.FEATS['Elven Weapon Familiarity'],
  'Forlorn':Pathfinder2E.FEATS.Forlorn,
  'Nimble Elf':Pathfinder2E.FEATS['Nimble Elf'],
  'Otherworldly Magic':Pathfinder2E.FEATS['Otherworldly Magic'],
  'Unwavering Mien':Pathfinder2E.FEATS['Unwavering Mien'],
  'Ageless Patience':Pathfinder2E.FEATS['Ageless Patience'],
  'Ancestral Suspicion':'Traits=Ancestry,Elf Require="level >= 5"',
  'Martial Experience':'Traits=Ancestry,Elf Require="level >= 5"',
  'Elf Step':Pathfinder2E.FEATS['Elf Step'],
  'Expert Longevity':Pathfinder2E.FEATS['Expert Longevity'],
  // TODO requires "at least one innate spell gained from an elf ancestry feat"
  'Otherworldly Acumen':'Traits=Ancestry,Elf Require="level >= 9"',
  'Tree Climber':'Traits=Ancestry,Elf Require="level >= 9"',
  'Avenge Ally':'Traits=Ancestry,Elf Require="level >= 13"',
  'Universal Longevity':Pathfinder2E.FEATS['Universal Longevity'],
  'Magic Rider':'Traits=Ancestry,Elf Require="level >= 17"',

  'Animal Accomplice':Pathfinder2E.FEATS['Animal Accomplice'],
  'Animal Elocutionist':Pathfinder2E.FEATS['Burrow Elocutionist'],
  'Fey Fellowship':Pathfinder2E.FEATS['Fey Fellowship'],
  'First World Magic':Pathfinder2E.FEATS['First World Magic'],
  'Gnome Obsession':Pathfinder2E.FEATS['Gnome Obsession'],
  'Gnome Weapon Familiarity':Pathfinder2E.FEATS['Gnome Weapon Familiarity'],
  'Illusion Sense':Pathfinder2E.FEATS['Illusion Sense'],
  'Razzle-Dazzle':'Traits=Ancestry,Gnome',
  'Energized Font':Pathfinder2E.FEATS['Energized Font'],
  'Project Persona':'Traits=Ancestry,Gnome Require="level >= 5"',
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Cautious Curiosity (Arcane)':'Traits=Ancestry,Gnome Require="level >= 9"',
  'Cautious Curiosity (Occult)':'Traits=Ancestry,Gnome Require="level >= 9"',
  'First World Adept':Pathfinder2E.FEATS['First World Adept'],
  'Life Leap':'Traits=Ancestry,Gnome Require="level >= 9"',
  'Vivacious Conduit':Pathfinder2E.FEATS['Vivacious Conduit'],
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Instinctive Obfuscation':'Traits=Ancestry,Gnome Require="level >= 13"',
  'Homeward Bound':'Traits=Ancestry,Gnome Require="level >= 17"',

  'Burn It!':Pathfinder2E.FEATS['Burn It!'],
  'City Scavenger':Pathfinder2E.FEATS['City Scavenger'],
  'Goblin Lore':Pathfinder2E.FEATS['Goblin Lore'],
  'Goblin Scuttle':Pathfinder2E.FEATS['Goblin Scuttle'],
  'Goblin Song':Pathfinder2E.FEATS['Goblin Song'],
  'Goblin Weapon Familiarity':Pathfinder2E.FEATS['Goblin Weapon Familiarity'],
  'Junk Tinker':Pathfinder2E.FEATS['Junk Tinker'],
  'Rough Rider':Pathfinder2E.FEATS['Rough Rider'],
  'Very Sneaky':Pathfinder2E.FEATS['Very Sneaky'],
  'Kneecap':'Traits=Ancestry,Goblin Require="level >= 5"',
  'Loud Singer':
    'Traits=Ancestry,Goblin Require="level >= 5","features.Goblin Song"',
  'Vandal':'Traits=Ancestry,Goblin Require="level >= 5"',
  'Cave Climber':Pathfinder2E.FEATS['Cave Climber'],
  'Cling':'Traits=Ancestry,Goblin Require="level >= 9"',
  'Skittering Scuttle':Pathfinder2E.FEATS['Skittering Scuttle'],
  'Very, Very Sneaky':Pathfinder2E.FEATS['Very, Very Sneaky'],
  'Reckless Abandon':'Traits=Ancestry,Goblin Require="level >= 17"',

  'Distracting Shadows':Pathfinder2E.FEATS['Distracting Shadows'],
  'Folksy Patter':'Traits=Ancestry,Halfling',
  'Halfling Lore':Pathfinder2E.FEATS['Halfling Lore'],
  'Halfling Luck':Pathfinder2E.FEATS['Halfling Luck'],
  'Halfling Weapon Familiarity':
    Pathfinder2E.FEATS['Halfling Weapon Familiarity'],
  'Prairie Rider':'Traits=Ancestry,Halfling',
  'Sure Feet':Pathfinder2E.FEATS['Sure Feet'],
  'Titan Slinger':Pathfinder2E.FEATS['Titan Slinger'],
  'Unfettered Halfling':Pathfinder2E.FEATS['Unfettered Halfling'],
  'Watchful Halfling':Pathfinder2E.FEATS['Watchful Halfling'],
  'Cultural Adaptability (%ancestry)':
    Pathfinder2E.FEATS['Cultural Adaptability (%ancestry)'],
  'Step Lively':'Traits=Ancestry,Halfling Require="level >= 5"',
  'Dance Underfoot':
    'Traits=Ancestry,Halfling Require="level >= 9","features.Step Lively"',
  'Guiding Luck':Pathfinder2E.FEATS['Guiding Luck'],
  'Irrepressible':Pathfinder2E.FEATS.Irrepressible,
  'Unhampered Passage':'Traits=Ancestry,Halfling Require="level >= 9"',
  'Ceaseless Shadows':Pathfinder2E.FEATS['Ceaseless Shadows'],
  'Toppling Dance':
    'Traits=Ancestry,Halfling ' +
    'Require="level >= 13","features.Dance Underfoot"',
  'Shadow Self':
    'Traits=Ancestry,Halfling Require="level >= 17","rank.Stealth >= 4"',

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
  'Sense Allies':'Traits=Ancestry,Human Require="level >= 5"',
  // Requirements changed
  'Cooperative Soul':'Traits=Ancestry,Human Require="level >= 9"',
  'Group Aid':'Traits=Ancestry,Human Require="level >= 9"',
  'Hardy Traveler':'Traits=Ancestry,Human Require="level >= 9"',
  // Requirements changed
  'Incredible Improvisation':'Traits=Ancestry,Human Require="level >= 9"',
  'Multitalented':Pathfinder2E.FEATS.Multitalented,
  'Advanced General Training':'Traits=Ancestry,Human Require="level >= 13"',
  'Bounce Back':'Traits=Ancestry,Human Require="level >= 13"',
  'Stubborn Persistence':'Traits=Ancestry,Human Require="level >= 13"',
  'Heroic Presence':'Traits=Ancestry,Human Require="level >= 17"',

  'Grasping Reach':'Traits=Ancestry,Leshy',
  'Harmlessly Cute':'Traits=Ancestry,Leshy',
  'Leshy Lore':'Traits=Ancestry,Leshy',
  'Leshy Superstition':'Traits=Ancestry,Leshy',
  'Seedpod':'Traits=Ancestry,Leshy',
  'Shadow Of The Wilds':'Traits=Ancestry,Leshy',
  'Undaunted':'Traits=Ancestry,Leshy',
  'Anchoring Roots':'Traits=Ancestry,Leshy Require="level >= 5"',
  'Leshy Glide':
    'Traits=Ancestry,Leshy ' +
    'Require="level >= 5","features.Leaf Leshy || features.Cat Fall"',
  'Ritual Reversion':'Traits=Ancestry,Leshy Require="level >= 5"',
  'Speak With Kindred':'Traits=Ancestry,Leshy Require="level >= 5"',
  'Bark And Tendril':'Traits=Ancestry,Leshy Require="level >= 9"',
  'Lucky Keepsake':
    'Traits=Ancestry,Leshy Require="level >= 9","features.Leshy Superstition"',
  'Solar Rejuvenation':'Traits=Ancestry,Leshy Require="level >= 9"',
  'Thorned Seedpod':
    'Traits=Ancestry,Leshy Require="level >= 9",features.Seedpod',
  'Call Of The Green Man':'Traits=Ancestry,Leshy Require="level >= 13"',
  'Cloak Of Poison':'Traits=Ancestry,Leshy Require="level >= 13"',
  'Flourish And Ruin':'Traits=Ancestry,Leshy Require="level >= 17"',
  'Regrowth':'Traits=Ancestry,Leshy Require="level >= 17"',

  'Beast Trainer':'Traits=Ancestry,Orc',
  'Iron Fists':'Traits=Ancestry,Orc',
  'Orc Ferocity':Pathfinder2E.FEATS['Orc Ferocity'],
  'Orc Lore':'Traits=Ancestry,Orc',
  'Orc Superstition':Pathfinder2E.FEATS['Orc Superstition'],
  'Hold Mark (Burning Sun)':'Traits=Ancestry,Orc',
  "Hold Mark (Death's Head)":'Traits=Ancestry,Orc',
  'Hold Mark (Defiled Corpse)':'Traits=Ancestry,Orc',
  'Hold Mark (Empty Hand)':'Traits=Ancestry,Orc',
  'Orc Weapon Familiarity':Pathfinder2E.FEATS['Orc Weapon Familiarity'],
  'Tusks':'Traits=Ancestry,Orc',
  'Athletic Might':'Traits=Ancestry,Orc Require="level >= 5"',
  'Bloody Blows':'Traits=Ancestry,Orc Require="level >= 5"',
  'Defy Death':
    'Traits=Ancestry,Orc Require="level >= 5","features.Orc Ferocity"',
  'Scar-Thick Skin':'Traits=Ancestry,Orc Require="level >= 5"',
  'Pervasive Superstition':
    'Traits=Ancestry,Orc Require="level >= 9","features.Orc Superstition"',
  'Undying Ferocity':
    'Traits=Ancestry,Orc Require="level >= 9","features.Orc Ferocity"',
  'Incredible Ferocity':Pathfinder2E.FEATS['Incredible Ferocity'],
  'Ferocious Beasts':
    'Traits=Ancestry,Orc ' +
    'Require=' +
      '"level >= 13",' +
      '"features.Orc Ferocity",' +
      '"features.Animal Companion || features.Pet || features.Bonded Animal"',
  'Spell Devourer':
    'Traits=Ancestry,Orc Require="level >= 13","features.Orc Superstition"',
  'Rampaging Ferocity':
    'Traits=Ancestry,Orc Require="level >= 17","features.Orc Ferocity"',

  'Brine May':'Traits=Ancestry,Changeling,Lineage',
  'Callow May':'Traits=Ancestry,Changeling,Lineage',
  'Dream May':'Traits=Ancestry,Changeling,Lineage',
  'Slag May':'Traits=Ancestry,Changeling,Lineage',
  'Changeling Lore':'Traits=Ancestry,Changeling',
  'Hag Claws':'Traits=Ancestry,Changeling',
  "Hag's Sight":'Traits=Ancestry,Changeling',
  'Called':'Traits=Ancestry,Changeling Require="level >= 5"',
  'Mist Child':'Traits=Ancestry,Changeling Require="level >= 5"',
  'Accursed Claws':
    'Traits=Ancestry,Changeling Require="level >= 9",weapons.Claws',
  'Occult Resistance':
    'Traits=Ancestry,Changeling Require="level >= 9","rank.Occultism >= 2"',
  'Hag Magic':'Traits=Ancestry,Changeling Require="level >= 13"',

  'Angelkin':'Traits=Ancestry,Nephilim,Lineage',
  'Grimspawn':'Traits=Ancestry,Nephilim,Lineage',
  'Hellspawn':'Traits=Ancestry,Nephilim,Lineage',
  'Pitborn':'Traits=Ancestry,Nephilim,Lineage',
  'Bestial Manifestation (Claw)':'Traits=Ancestry,Nephilim',
  'Bestial Manifestation (Hoof)':'Traits=Ancestry,Nephilim',
  'Bestial Manifestation (Jaws)':'Traits=Ancestry,Nephilim',
  'Bestial Manifestation (Tail)':'Traits=Ancestry,Nephilim',
  'Halo':'Traits=Ancestry,Nephilim',
  'Nephilim Eyes':'Traits=Ancestry,Nephilim',
  'Nephilim Lore':'Traits=Ancestry,Nephilim',
  'Nimble Hooves':'Traits=Ancestry,Nephilim',
  'Blessed Blood':'Traits=Ancestry,Nephilim Require="level >= 5"',
  'Extraplanar Supplication':'Traits=Ancestry,Nephilim Require="level >= 5"',
  'Nephilim Resistance':'Traits=Ancestry,Nephilim Require="level >= 5"',
  'Scion Of Many Planes':'Traits=Ancestry,Nephilim Require="level >= 5"',
  'Skillful Tail':'Traits=Ancestry,Nephilim Require="level >= 5"',
  'Celestial Magic':
    'Traits=Ancestry,Nephilim Require="level >= 9","features.Celestial"',
  'Divine Countermeasures':'Traits=Ancestry,Nephilim Require="level >= 9"',
  'Divine Wings':'Traits=Ancestry,Nephilim Require="level >= 9"',
  'Fiendish Magic':
    'Traits=Ancestry,Nephilim ' +
    'Require=' +
      '"level >= 9",' +
      '"features.Grimspawn || features.Pitborn || features.Hellspawn"',
  'Celestial Mercy':
    'Traits=Ancestry,Nephilim Require="level >= 13","features.Celestial"',
  'Slip Sideways':
    'Traits=Ancestry,Nephilim Require="level >= 13","features.Fiendish"',
  'Summon Nephilim Kin':'Traits=Ancestry,Nephilim Require="level >= 13"',
  'Divine Declaration':'Traits=Ancestry,Nephilim Require="level >= 17"',
  'Eternal Wings':
    'Traits=Ancestry,Nephilim Require="level >= 17","features.Divine Wings"',

  'Earned Glory':'Traits=Ancestry,Aiuvarin',
  'Elf Atavism':
     Pathfinder2E.FEATS['Inspire Imitation'].replace('Half-Elf', 'Aiuvarin'),
  'Inspire Imitation':'Traits=Ancestry,Aiuvarin Require="level >= 5"',
  'Supernatural Charm':
     Pathfinder2E.FEATS['Supernatural Charm'].replace('Half-Elf', 'Aiuvarin'),

  'Monstrous Peacemaker':
     Pathfinder2E.FEATS['Monstrous Peacemaker'].replace('Half-Orc', 'Dromaar'),
  'Orc Sight':Pathfinder2E.FEATS['Orc Sight'].replace('Half-Orc', 'Dromaar'),

  // Core 2
  'Cat Nap':'Traits=Ancestry,Catfolk,Concentrate,Exploration',
  "Cat's Luck":'Traits=Ancestry,Catfolk,Fortune',
  'Catfolk Dance':'Traits=Ancestry,Catfolk',
  'Catfolk Lore':'Traits=Ancestry,Catfolk',
  'Catfolk Weapon Familiarity':'Traits=Ancestry,Catfolk',
  'Saber Teeth':'Traits=Ancestry,Catfolk',
  'Well-Met Traveler':'Traits=Ancestry,Catfolk',
  'Climbing Claws':'Traits=Ancestry,Catfolk Require="level >= 5"',
  'Graceful Guidance':'Traits=Ancestry,Catfolk Require="level >= 5"',
  'Light Paws':'Traits=Ancestry,Catfolk Require="level >= 5"',
  'Lucky Break':
    'Traits=Ancestry,Catfolk Require="features.Cat\'s Luck","level >= 5"',
  'Pride Hunter':'Traits=Ancestry,Catfolk Require="level >= 5"',
  'Springing Leaper':
    'Traits=Ancestry,Catfolk Require="rank.Athletics >= 2","level >= 5"',
  'Well-Groomed':'Traits=Ancestry,Catfolk Require="level >= 5"',
  'Aggravating Scratch':
    'Traits=Ancestry,Catfolk,Disease Require="level >= 9","weapons.Claws"',
  'Evade Doom':'Traits=Ancestry,Catfolk Require="level >= 9"',
  'Luck Of The Clowder':
    'Traits=Ancestry,Catfolk ' +
    'Require="features.Cat\'s Luck" Require="level >= 9"',
  "Predator's Growl":
    'Traits=Ancestry,Catfolk Require="rank.Intimidation >= 2","level >= 9"',
  'Silent Step':'Traits=Ancestry,Catfolk,Flourish Require="level >= 9"',
  'Wary Skulker':'Traits=Ancestry,Catfolk Require="level >= 9"',
  'Black Cat Curse':
    'Traits=Ancestry,Catfolk,Misfortune,Occult Require="level >= 13"',
  'Caterwaul':
    'Traits=Ancestry,Catfolk,Auditory,Concentrate,Emotion,Mental ' +
    'Require="level >= 13"',
  'Elude Trouble':'Traits=Ancestry,Catfolk Require="level >= 17"',
  'Reliable Luck':
    'Traits=Ancestry,Catfolk Require="features.Cat\'s Luck","level >= 17"',
  'Ten Lives':
    'Traits=Ancestry,Catfolk Require="features.Evade Doom","level >= 17"',

  'Alchemical Scholar':'Traits=Ancestry,Hobgoblin',
  'Cantorian Reinforcement':'Traits=Ancestry,Hobgoblin',
  'Hobgoblin Lore':'Traits=Ancestry,Hobgoblin',
  'Hobgoblin Weapon Familiarity':'Traits=Ancestry,Hobgoblin',
  'Leech-Clip':'Traits=Ancestry,Hobgoblin',
  'Remorseless Lash':'Traits=Ancestry,Hobgoblin',
  'Sneaky':'Traits=Ancestry,Hobgoblin',
  'Stone Face':'Traits=Ancestry,Hobgoblin',
  'Vigorous Health':'Traits=Ancestry,Hobgoblin',
  'Agonizing Rebuke':'Traits=Ancestry,Hobgoblin Require="level >= 5"',
  'Expert Drill Sergeant':'Traits=Ancestry,Hobgoblin Require="level >= 5"',
  'Recognize Ambush':'Traits=Ancestry,Hobgoblin Require="level >= 5"',
  'Runtsage':'Traits=Ancestry,Hobgoblin Require="level >= 5"',
  'Cantorian Rejuvenation':
    'Traits=Ancestry,Hobgoblin,Healing,Vitality Require="level >= 9"',
  'Fell Rider':
    'Traits=Ancestry,Hobgoblin ' +
    'Require="features.Animal Companion" Require="level >= 9"',
  'Pride In Arms':
    'Traits=Ancestry,Hobgoblin,Auditory,Emotion,Mental Require="level >= 9"',
  'Squad Tactics':'Traits=Ancestry,Hobgoblin Require="level >= 9"',
  "Can't Fall Here":
    'Traits=Ancestry,Hobgoblin,Auditory,Manipulate Require="level >= 13"',
  'War Conditioning (Climb)':'Traits=Ancestry,Hobgoblin Require="level >= 13"',
  'War Conditioning (Swim)':'Traits=Ancestry,Hobgoblin Require="level >= 13"',
  'Cantorian Restoration':
    'Traits=Ancestry,Hobgoblin,Healing,Vitality Require="level >= 17"',
  'Rallying Cry':'Traits=Ancestry,Hobgoblin Require="level >= 17"',

  'Ask The Bones':'Traits=Ancestry,Kholo',
  'Crunch':'Traits=Ancestry,Kholo',
  'Hyena Familiar':'Traits=Ancestry,Kholo',
  'Kholo Lore':'Traits=Ancestry,Kholo',
  'Kholo Weapon Familiarity':'Traits=Ancestry,Kholo',
  'Pack Hunter':'Traits=Ancestry,Kholo',
  'Sensitive Nose':'Traits=Ancestry,Kholo',
  'Absorb Strength':'Traits=Ancestry,Kholo,Uncommon Require="level >= 5"',
  'Distant Cackle':
    'Traits=Ancestry,Kholo Require="level >= 5","features.Witch Kholo"',
  'Pack Stalker':
    'Traits=Ancestry,Kholo Require="level >= 5","rank.Stealth >= 2"',
  'Rabid Sprint':
    'Traits=Ancestry,Kholo,Flourish Require="level >= 5","features.Dog Kholo"',
  'Affliction Resistance':'Traits=Ancestry,Kholo Require="level >= 5"',
  'Left-Hand Blood':'Traits=Ancestry,Kholo Require="level >= 5"',
  'Right-Hand Blood':'Traits=Ancestry,Kholo Require="level >= 5"',
  'Ambush Hunter':'Traits=Ancestry,Kholo Require="level >= 9"',
  'Breath Like Honey':
    'Traits=Ancestry,Kholo Require="level >= 9","features.Sweetbreath Kholo"',
  "Grandmother's Wisdom":'Traits=Ancestry,Kholo Require="level >= 9"',
  'Laughing Kholo':
    'Traits=Ancestry,Kholo Require="level >= 9","rank.Intimidation >= 3"',
  "Ancestor's Rage":'Traits=Ancestry,Kholo Require="level >= 13"',
  "Bonekeeper's Bane":'Traits=Ancestry,Kholo Require="level >= 13"',
  'First To Strike, First To Fall':
    'Traits=Ancestry,Kholo Require="level >= 17"',
  'Impaling Bone':'Traits=Ancestry,Kholo Require="level >= 17"',
  'Legendary Laugh':
    'Traits=Ancestry,Kholo Require="level >= 17","features.Laughing Kholo"',

  'Cringe':'Traits=Ancestry,Kobold,Emotion,Mental,Visual',
  "Dragon's Presence":
    'Traits=Ancestry,Kobold Require="features.Dragonscaled Kobold"',
  'Kobold Lore':'Traits=Ancestry,Kobold',
  'Kobold Weapon Familiarity':'Traits=Ancestry,Kobold',
  'Scamper':'Traits=Ancestry,Kobold',
  'Snare Setter':'Traits=Ancestry,Kobold Require="rank.Crafting >= 1"',
  "Ally's Shelter":'Traits=Ancestry,Kobold,Fortune Require="level >= 5"',
  'Grovel':
    'Traits=Ancestry,Kobold,Auditory,Concentrate,Emotion,Mental ' +
    'Require="level >= 5","rank.Deception >= 1"',
  'Snare Genius':
    'Traits=Ancestry ' +
    'Require="level >= 5","rank.Crafting >= 2","features.Snare Crafting"',
  'Winglets':'Traits=Ancestry,Kobold Require="level >= 5"',
  'Between The Scales':'Traits=Ancestry,Kobold Require="level >= 9"',
  'Briar Battler':'Traits=Ancestry,Kobold Require="level >= 9"',
  'Close Quarters':'Traits=Ancestry,Kobold Require="level >= 9"',
  'Evolved Spellhorn':
    'Traits=Ancestry,Kobold Require="level >= 9","features.Spellhorn Kobold"',
  'Fleeing Shriek':'Traits=Ancestry,Kobold Require="level >= 9"',
  'Winglet Flight':
    'Traits=Ancestry,Kobold Require="level >= 9","features.Winglets"',
  'Resplendent Spellhorn':
    'Traits=Ancestry,Kobold Require="level >= 13","features.Evolved Spellhorn"',
  'Tumbling Diversion':
    'Traits=Ancestry,Kobold ' +
    'Require="level >= 13","rank.Acrobatics >= 2","rank.Deception >= 2"',
  'Vicious Snares':
    'Traits=Ancestry,Kobold ' +
    'Require="level >= 13","rank.Crafting >= 2","features.Snare Crafting"',
  "Benefactor's Majesty":
    'Traits=Ancestry,Kobold,Healing,Visual Require="level >= 17"',

  'Bone Magic':'Traits=Ancestry,Lizardfolk',
  'Iruxi Armaments (Claws)':'Traits=Ancestry,Lizardfolk',
  'Iruxi Armaments (Fangs)':'Traits=Ancestry,Lizardfolk',
  'Iruxi Armaments (Tail)':'Traits=Ancestry,Lizardfolk',
  'Lizardfolk Lore':'Traits=Ancestry,Lizardfolk',
  // TODO Requires a swim Speed
  'Marsh Runner':'Traits=Ancestry,Lizardfolk',
  'Parthenogenic Hatchling':'Traits=Ancestry,Lizardfolk',
  'Reptile Speaker':'Traits=Ancestry,Lizardfolk',
  'Envenom Fangs':
    'Traits=Ancestry,Lizardfolk Require="level >= 5","Iruxi Armaments (Fangs)"',
  'Flexible Tail':'Traits=Ancestry,Lizardfolk Require="level >= 5"',
  "Gecko's Grip":'Traits=Ancestry,Lizardfolk Require="level >= 5"',
  'Shed Tail':
    'Traits=Ancestry,Lizardfolk Require="level >= 5","Iruxi Armaments (Tail)"',
  'Swift Swimmer':'Traits=Ancestry,Lizardfolk Require="level >= 5"',
  'Dangle':'Traits=Ancestry,Lizardfolk Require="level >= 9"',
  'Hone Claws':
    'Traits=Ancestry,Lizardfolk Require="level >= 9","Iruxi Armaments (Claws)"',
  'Terrain Advantage':'Traits=Ancestry,Lizardfolk Require="level >= 9"',
  'Bone Investiture':
    'Traits=Ancestry,Lizardfolk Require="level >= 13","features.Bone Magic"',
  'Iruxi Spirit Strike':'Traits=Ancestry,Lizardfolk Require="level >= 13"',
  'Primal Rampage':'Traits=Ancestry,Lizardfolk Require="level >= 13"',
  'Fossil Rider':
    'Traits=Ancestry,Lizardfolk Require="level >= 17","features.Bone Magic"',
  'Scion Transformation':
    'Traits=Ancestry,Lizardfolk,Primal Require="level >= 17"',

  'Cheek Pouches':'Traits=Ancestry,Ratfolk',
  'Pack Rat':'Traits=Ancestry,Ratfolk',
  'Rat Familiar':'Traits=Ancestry,Ratfolk',
  'Ratfolk Lore':'Traits=Ancestry,Ratfolk',
  'Ratspeak':'Traits=Ancestry,Ratfolk',
  'Tinkering Fingers':'Traits=Ancestry,Ratfolk',
  'Vicious Incisors':'Traits=Ancestry,Ratfolk',
  'Warren Navigator':'Traits=Ancestry,Ratfolk',
  'Cornered Fury':'Traits=Ancestry,Ratfolk Require="level >= 5"',
  'Lab Rat':'Traits=Ancestry,Ratfolk Require="level >= 5"',
  'Quick Stow':
    'Traits=Ancestry,Ratfolk Require="level >= 5","features.Cheek Pouches"',
  'Rat Magic':'Traits=Ancestry,Ratfolk Require="level >= 5"',
  'Ratfolk Roll':'Traits=Ancestry,Ratfolk,Move Require="level >= 5"',
  'Big Mouth':
    'Traits=Ancestry,Ratfolk Require="level >= 9","features.Cheek Pouches"',
  'Overcrowd':'Traits=Ancestry,Ratfolk Require="level >= 9"',
  'Rat Form':
    'Traits=Ancestry,Ratfolk,Concentrate,Polymorph,Primal Require="level >= 9"',
  'Uncanny Cheeks':'Traits=Ancestry,Ratfolk Require="level >= 9"',
  'Shinstabber':
    'Traits=Ancestry,Ratfolk Require="level >= 13","features.Overcrowd"',
  'Skittering Sneak':'Traits=Ancestry,Ratfolk Require="level >= 13"',
  'Warren Digger':'Traits=Ancestry,Ratfolk Require="level >= 13"',
  'Call The Swarm':
    'Traits=Ancestry,Ratfolk Require="level >= 17","features.Ratspeak"',
  'Greater Than The Sum':'Traits=Ancestry,Ratfolk Require="level >= 17"',

  "Mariner's Fire":'Traits=Ancestry,Tengu',
  'One-Toed Hop':'Traits=Ancestry,Tengu',
  "Scavenger's Search":'Traits=Ancestry,Tengu',
  'Squawk!':'Traits=Ancestry,Tengu',
  "Storm's Lash":'Traits=Ancestry,Tengu',
  'Tengu Lore':'Traits=Ancestry,Tengu',
  'Tengu Weapon Familiarity':'Traits=Ancestry,Tengu',
  'Uncanny Agility':'Traits=Ancestry,Tengu',
  'Eat Fortune':'Traits=Ancestry,Tengu,Concentrate,Divine Require="level >= 5"',
  'Long-Nosed Form':
    'Traits=Ancestry,Tengu,Concentrate,Polymorph,Primal Require="level >= 5"',
  'Magpie Snatch':'Traits=Ancestry,Tengu Require="level >= 5"',
  'Soaring Flight':
    'Traits=Ancestry,Tengu Require="level >= 5","features.Skyborn Tengu"',
  'Tengu Feather Fan':'Traits=Ancestry,Tengu Require="level >= 5"',
  'Soaring Form':
    'Traits=Ancestry,Tengu Require="level >= 9","features.Soaring Flight"',
  "Wind God's Fan":
    'Traits=Ancestry,Tengu Require="level >= 9","features.Tengu Feather Fan"',
  "Harbinger's Claw":
    'Traits=Ancestry,Tengu,Auditory,Divine,Misfortune Require="level >= 13"',
  'Jinx Glutton':
    'Traits=Ancestry,Tengu Require="level >= 13","features.Eat Fortune"',
  "Thunder God's Fan":
    'Traits=Ancestry,Tengu Require="level >= 13","features.Tengu Feather Fan"',
  'Great Tengu Form':
    'Traits=Ancestry,Tengu Require="level >= 17","features.Long-Nosed Form"',
  'Trickster Tengu':'Traits=Ancestry,Tengu Require="level >= 17"',

  'Croak Talker':'Traits=Ancestry,Tripkee',
  "Hunter's Defense":'Traits=Ancestry,Tripkee Require="rank.Nature >= 1"',
  'Jungle Strider':'Traits=Ancestry,Tripkee',
  'Nocturnal Tripkee':'Traits=Ancestry,Tripkee',
  'Terrifying Croak':'Traits=Ancestry,Tripkee Require="rank.Intimidation >= 1"',
  'Tripkee Lore':'Traits=Ancestry,Tripkee',
  'Tripkee Weapon Familiarity':'Traits=Ancestry,Tripkee',
  'Fantastic Leaps':'Traits=Ancestry,Tripkee Require="level >= 5"',
  'Long Tongue':
    'Traits=Ancestry,Tripkee ' +
    'Require="level >= 5","features.Snaptongue Tripkee"',
  'Prodigious Climber':'Traits=Ancestry,Tripkee Require="level >= 5"',
  'Tenacious Net':'Traits=Ancestry,Tripkee Require="level >= 5"',
  'Tripkee Glide':
    'Traits=Ancestry,Tripkee Require="level >= 5","features.Windweb Tripkee"',
  'Vomit Stomach':'Traits=Ancestry,Tripkee Require="level >= 5"',
  'Absorb Toxin':'Traits=Ancestry,Tripkee Require="level >= 9"',
  'Moisture Bath':'Traits=Ancestry,Tripkee,Manipulate Require="level >= 9"',
  'Ricocheting Leap':
    'Traits=Ancestry,Tripkee Require="level >= 9","features.Wall Jump"',
  'Tongue Tether':
    'Traits=Ancestry,Tripkee ' +
    'Require="level >= 9","features.Snaptongue Tripkee"',
  'Envenomed Edge':'Traits=Ancestry,Tripkee Require="level >= 13"',
  'Hop Up':'Traits=Ancestry,Tripkee Require="level >= 13"',
  'Unbound Leaper':'Traits=Ancestry,Tripkee Require="level >= 17"',

  'Straveika':'Traits=Ancestry,Dhampir,Lineage',
  'Svetocher':'Traits=Ancestry,Dhampir,Lineage',
  'Eyes Of Night':'Traits=Ancestry,Dhampir',
  'Fangs':'Traits=Ancestry,Dhampir',
  'Vampire Lore':'Traits=Ancestry,Dhampir',
  'Voice Of The Night':'Traits=Ancestry,Dhampir',
  'Enthralling Allure':'Traits=Ancestry,Dhampir Require="level >= 5"',
  'Necromantic Physiology':'Traits=Ancestry,Dhampir Require="level >= 5"',
  'Undead Slayer':'Traits=Ancestry,Dhampir Require="level >= 5"',
  'Bloodletting Fangs':
    'Traits=Ancestry,Dhampir Require="level >= 9","features.Fangs"',
  'Night Magic':'Traits=Ancestry,Dhampir Require="level >= 9"',
  'Form Of The Bat':
    'Traits=Ancestry,Dhampir,Concentrate,Divine,Polymorph ' +
    'Require="level >= 13"',
  'Symphony Of Blood':'Traits=Ancestry,Dhampir Require="level >= 17"',

  'Arcane Dragonblood':'Traits=Ancestry,Dragonblood,Lineage',
  'Divine Dragonblood':'Traits=Ancestry,Dragonblood,Lineage',
  'Occult Dragonblood':'Traits=Ancestry,Dragonblood,Lineage',
  'Primal Dragonblood':'Traits=Ancestry,Dragonblood,Lineage',
  'Breath Of The Dragon':'Traits=Ancestry,Dragonblood,Magical',
  'Draconic Aspect (Claw)':'Traits=Ancestry,Dragonblood',
  'Draconic Aspect (Jaws)':'Traits=Ancestry,Dragonblood',
  'Draconic Aspect (Tail)':'Traits=Ancestry,Dragonblood',
  'Draconic Resistance':'Traits=Ancestry,Dragonblood',
  // Low-Light Vision requirement removed by errata
  'Draconic Sight':'Traits=Ancestry,Dragonblood',
  'Dragon Lore':'Traits=Ancestry,Dragonblood',
  'Scaly Hide':'Traits=Ancestry,Dragonblood',
  'Deadly Aspect':
    'Traits=Ancestry,Dragonblood ' +
    'Require="level >= 5","features.Draconic Aspect"',
  'Draconic Scent':'Traits=Ancestry,Dragonblood Require="level >= 5"',
  "Dragon's Flight":'Traits=Ancestry,Dragonblood Require="level >= 5"',
  'Traditional Resistances':
    'Traits=Ancestry,Dragonblood ' +
    'Require=' +
      '"level >= 5",' +
      '"features.Arcane Dragonblood || features.Divine Dragonblood || features.Occult Dragonblood || features.Primal Dragonblood"',
  'Formidable Breath':
    'Traits=Ancestry,Dragonblood ' +
    'Require="level >= 9","features.Breath Of The Dragon"',
  "True Dragon's Flight":
    'Traits=Ancestry,Dragonblood ' +
    'Require="level >= 9","features.Dragon\'s Flight"',
  'Wing Buffet':
    'Traits=Ancestry,Dragonblood,Attack ' +
    'Require="level >= 9","rank.Athletics >= 2"',
  'Draconic Veil':'Traits=Ancestry,Dragonblood Require="level >= 13"',
  'Majestic Presence':
    'Traits=Ancestry,Dragonblood,Emotion,Fear,Mental,Visual ' +
    'Require="level >= 13"',
  'Form Of The Dragon':'Traits=Ancestry,Dragonblood Require="level >= 17"',
  'Lingering Breath':
    'Traits=Ancestry,Dragonblood ' +
    'Require="level >= 17","features.Breath Of The Dragon"',

  'Chance Death':'Traits=Ancestry,Duskwalker,Fortune',
  'Deliberate Death':'Traits=Ancestry,Duskwalker',
  'Duskwalker Lore':'Traits=Ancestry,Duskwalker',
  'Duskwalker Weapon Familiarity':'Traits=Ancestry,Duskwalker',
  'Ghost Hunter':'Traits=Ancestry,Duskwalker',
  'Gravesight':'Traits=Ancestry,Duskwalker',
  'Lifesense':'Traits=Ancestry,Duskwalker,Divine Require="level >= 5"',
  'Spirit Soother':'Traits=Ancestry,Duskwalker Require="level >= 5"',
  'Ward Against Corruption':'Traits=Ancestry,Duskwalker Require="level >= 5"',
  'Duskwalker Magic':'Traits=Ancestry,Duskwalker Require="level >= 9"',
  'Quietus Strikes':'Traits=Ancestry,Duskwalker Require="level >= 9"',
  'Resist Ruin':'Traits=Ancestry,Duskwalker Require="level >= 13"',
  "Boneyard's Call":'Traits=Ancestry,Duskwalker,Uncommon Require="level >= 17"',

  // Class

  'Alchemical Familiar':Pathfinder2E.FEATS['Alchemical Familiar'],
  'Alchemical Assessment':Pathfinder2E.FEATS['Alchemical Savant'],
  'Blowgun Poisoner':'Traits=Class,Alchemist',
  'Far Lobber':Pathfinder2E.FEATS['Far Lobber'],
  'Quick Bomber':Pathfinder2E.FEATS['Quick Bomber'],
  'Soothing Vials':'Traits=Class,Alchemist Require="features.Chirurgeon"',

/*
  'Revivifying Mutagen':'Traits=Class,Alchemist Require="level >= 2"',
  'Smoke Bomb':'Traits=Class,Alchemist,Additive1 Require="level >= 2"',
  'Calculated Splash':'Traits=Class,Alchemist Require="level >= 4"',
  'Efficient Alchemy':'Traits=Class,Alchemist Require="level >= 4"',
  'Enduring Alchemy':'Traits=Class,Alchemist Require="level >= 4"',
  'Combine Elixirs':'Traits=Class,Alchemist,Additive2 Require="level >= 6"',
  'Debilitating Bomb':'Traits=Class,Alchemist,Additive2 Require="level >= 6"',
  'Directional Bombs':'Traits=Class,Alchemist Require="level >= 6"',
  'Feral Mutagen':'Traits=Class,Alchemist Require="level >= 8"',
  'Sticky Bomb':'Traits=Class,Alchemist,Additive2 Require="level >= 8"',
  'Elastic Mutagen':'Traits=Class,Alchemist Require="level >= 10"',
  'Expanded Splash':
    'Traits=Class,Alchemist Require="level >= 10","features.Calculated Splash"',
  'Greater Debilitating Bomb':
    'Traits=Class,Alchemist Require="level >= 10","features.Debilitating Bomb"',
  'Merciful Elixir':'Traits=Class,Alchemist,Additive2 Require="level >= 10"',
  'Potent Poisoner':
    'Traits=Class,Alchemist Require="level >= 10","features.Powerful Alchemy"',
  'Extend Elixir':'Traits=Class,Alchemist Require="level >= 12"',
  'Invincible Mutagen':'Traits=Class,Alchemist Require="level >= 12"',
  'Uncanny Bombs':
    'Traits=Class,Alchemist Require="level >= 12","features.Far Lobber"',
  'Glib Mutagen':'Traits=Class,Alchemist Require="level >= 14"',
  'Greater Merciful Elixir':
    'Traits=Class,Alchemist Require="level >= 14","features.Merciful Elixir"',
  'True Debilitating Bomb':
    'Traits=Class,Alchemist ' +
    'Require="level >= 14","features.Greater Debilitating Bomb"',
  'Eternal Elixir':
    'Traits=Class,Alchemist Require="level >= 16","features.Extend Elixir"',
  'Exploitive Bomb':'Traits=Class,Alchemist,Additive2 Require="level >= 16"',
  'Genius Mutagen':'Traits=Class,Alchemist Require="level >= 16"',
  'Persistent Mutagen':
    'Traits=Class,Alchemist Require="level >= 16","features.Extend Elixir"',
  'Improbable Elixirs':'Traits=Class,Alchemist Require="level >= 18"',
  'Mindblank Mutagen':'Traits=Class,Alchemist Require="level >= 18"',
  'Miracle Worker':'Traits=Class,Alchemist Require="level >= 18"',
  'Perfect Debilitation':'Traits=Class,Alchemist Require="level >= 18"',
  "Craft Philosopher's Stone":'Traits=Class,Alchemist Require="level >= 20"',
  'Mega Bomb':
    'Traits=Class,Alchemist,Additive3 ' +
    'Require="level >= 20","features.Expanded Splash"',
  'Perfect Mutagen':'Traits=Class,Alchemist Require="level >= 20"',

  'Acute Vision':'Traits=Class,Barbarian',
  'Moment Of Clarity':'Traits=Class,Barbarian,Concentrate,Rage',
  'Raging Intimidation':'Traits=Class,Barbarian',
  'Raging Thrower':'Traits=Class,Barbarian',
  // Sudden Charge as above
  'Acute Scent':
    'Traits=Class,Barbarian ' +
    'Require="level >= 2","features.Acute Vision||features.Darkvision"',
  'Furious Finish':'Traits=Class,Barbarian,Rage Require="level >= 2"',
  'No Escape':'Traits=Class,Barbarian,Rage Require="level >= 2"',
  'Second Wind':'Traits=Class,Barbarian Require="level >= 2"',
  'Shake It Off':'Traits=Class,Barbarian,Concentrate,Rage Require="level >= 2"',
  'Fast Movement':'Traits=Class,Barbarian Require="level >= 4"',
  'Raging Athlete':
    'Traits=Class,Barbarian Require="level >= 4","rank.Athletics >= 2"',
  // Swipe as above
  'Wounded Rage':'Traits=Class,Barbarian Require="level >= 4"',
  'Animal Skin':
    'Traits=Class,Barbarian,Morph,Primal,Transmutation ' +
    'Require="level >= 6","features.Animal Instinct"',
  'Attack Of Opportunity':'Traits=Class,Barbarian,Champion Require="level >= 6"',
  'Brutal Bully':
    'Traits=Class,Barbarian Require="level >= 6","rank.Athletics >= 2"',
  'Cleave':'Traits=Class,Barbarian,Rage Require="level >= 6"',
  "Dragon's Rage Breath":
    'Traits=Class,Barbarian,Arcane,Concentrate,Evocation,Rage ' +
    'Require="level >= 6","features.Dragon Instinct"',
  "Giant's Stature":
    'Traits=Class,Barbarian,Polymorph,Primal,Rage,Transmutation ' +
    'Require="level >= 6","features.Giant Instinct"',
  "Spirits' Interference":
    'Traits=Class,Barbarian,Divine,Necromancy,Rage ' +
    'Require="level >= 6","features.Spirit Instinct"',
  'Animal Rage':
    'Traits=Class,Barbarian,Concentrate,Polymorph,Primal,Rage,Transmutation ' +
    'Require="level >= 8","features.Animal Instinct"',
  'Furious Bully':
    'Traits=Class,Barbarian Require="level >= 8","rank.Athletics >=3 "',
  'Renewed Vigor':'Traits=Class,Barbarian,Concentrate,Rage Require="level >= 8"',
  'Share Rage':
    'Traits=Class,Barbarian,Auditory,Rage,Visual Require="level >= 8"',
  'Sudden Leap':'Traits=Class,Barbarian,Fighter Require="level >= 8"',
  'Thrash':'Traits=Class,Barbarian,Rage Require="level >= 8"',
  'Come And Get Me':
    'Traits=Class,Barbarian,Concentrate,Rage Require="level >= 10"',
  'Furious Sprint':'Traits=Class,Barbarian,Rage Require="level >= 10"',
  'Great Cleave':
    'Traits=Class,Barbarian,Rage Require="level >= 10",features.Cleave',
  'Knockback':'Traits=Class,Barbarian,Rage Require="level >= 10"',
  'Terrifying Howl':
    'Traits=Class,Barbarian,Auditory,Rage ' +
    'Require="level >= 10","features.Intimidating Glare"',
  "Dragon's Rage Wings":
    'Traits=Class,Barbarian,Morph,Primal,Rage,Transmutation ' +
    'Require="level >= 12","features.Dragon Instinct"',
  'Furious Grab':'Traits=Class,Barbarian,Rage Require="level >= 12"',
  "Predator's Pounce":
    'Traits=Class,Barbarian,Flourish,Open,Rage ' +
    'Require="level >= 12","features.Animal Instinct"',
  "Spirit's Wrath":
    'Traits=Class,Barbarian,Attack,Concentrate,Rage ' +
    'Require="level >= 12","features.Spirit Instinct"',
  "Titan's Stature":
    'Traits=Class,Barbarian,Polymorph,Transmutation ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Giant Instinct",' +
      '"features.Giant\'s Stature"',
  'Awesome Blow':
    'Traits=Class,Barbarian,Rage Require="level >= 14","features.Knockback"',
  "Giant's Lunge":
    'Traits=Class,Barbarian,Rage ' +
    'Require="level >= 14","features.Giant Instinct"',
  'Vengeful Strike':
    'Traits=Class,Barbarian,Rage ' +
    'Require="level >= 14","features.Vengeful Strike"',
  // Whirlwind Strike as above
  'Collateral Thrash':
    'Traits=Class,Barbarian,Rage Require="level >= 16","features.Thrash"',
  'Dragon Transformation':
    'Traits=Class,Barbarian,Concentrate,Polymorph,Primal,Rage,Transmutation ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Dragon Instinct",' +
     '"features.Dragon\'s Rage Wings"',
  'Reckless Abandon':'Traits=Class,Barbarian,Rage Require="level >= 16"',
  'Brutal Critical':'Traits=Class,Barbarian Require="level >= 18"',
  'Perfect Clarity':
    'Traits=Class,Barbarian,Concentrate,Fortune,Rage Require="level >= 18"',
  'Vicious Evisceration':'Traits=Class,Barbarian,Rage Require="level >= 18"',
  'Contagious Rage':
    'Traits=Class,Barbarian,Auditory,Rage,Visual ' +
    'Require="level >= 20","features.Share Rage"',
  'Quaking Stomp':'Traits=Class,Barbarian,Manipulate,Rage Require="level >= 20"',
*/

  'Bardic Lore':Pathfinder2E.FEATS['Bardic Lore'],
  'Hymn Of Healing':'Traits=Class,Bard',
  'Lingering Composition':Pathfinder2E.FEATS['Lingering Composition'],
  'Martial Performance':'Traits=Class,Bard Require="features.Warrior"',
  'Reach Spell':
    Pathfinder2E.FEATS['Reach Spell']
    .replace('Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Witch,'),
  'Versatile Performance':Pathfinder2E.FEATS['Versatile Performance'],
  'Well-Versed':'Traits=Class,Bard',
  'Cantrip Expansion':
    Pathfinder2E.FEATS['Cantrip Expansion'].replace('Traits=', 'Traits=Witch,'),
  'Directed Audience':'Traits=Class,Bard Require="level >= 2"',
  'Emotional Push':'Traits=Class,Bard,Concentrate Require="level >= 2"',
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
    'Traits=Class,Bard Require="level >= 2","features.Warrior"',
  'Uplifting Overture':Pathfinder2E.FEATS['Inspire Competence'],
  'Combat Reading':'Traits=Class,Bard,Secret Require="level >= 4"',
  'Courageous Advance':
    'Traits=Class,Bard,Auditory,Concentrate,Spellshape ' +
    'Require="level >= 4","features.Warrior"',
  'In Tune':
    'Traits=Class,Bard,Concentrate,Spellshape ' +
    'Require="level >= 4","features.Maestro"',
  'Melodious Spell':
    Pathfinder2E.FEATS['Melodious Spell']
    .replace('Manipulate,Metamagic', 'Spellshape'),
  'Rallying Anthem':Pathfinder2E.FEATS['Inspire Defense'],
  'Ritual Researcher':
    'Traits=Class,Bard,Uncommon ' +
    'Require="level >= 4","features.Enigma","rank.Occultism >= 2"',
  'Triple Time':Pathfinder2E.FEATS['Triple Time'],
  'Versatile Signature':Pathfinder2E.FEATS['Versatile Signature'],
  'Assured Knowledge':
    'Traits=Class,Bard,Fortune Require="level >= 6","features.Enigma"',
  'Defensive Coordination':
    'Traits=Class,Bard,Auditory,Concentration,Spellshape ' +
    'Require="level >= 6","features.Warrior","features.Rallying Anthem"',
  'Dirge Of Doom':Pathfinder2E.FEATS['Dirge Of Doom'],
  'Educate Allies':
    'Traits=Class,Bard,Concentrate Require="level >= 6","features.Well-Versed"',
  'Harmonize':Pathfinder2E.FEATS.Harmonize.replace('Metamagic', 'Spellshape'),
  'Song Of Marching':'Traits=Class,Bard Require="level >= 6"',
  'Steady Spellcasting':
    Pathfinder2E.FEATS['Steady Spellcasting'].replace('Traits=', 'Traits=Witch,'),
  'Accompany':'Traits=Class,Bard,Concentrate,Manipulate Require="level >= 8"',
  'Call And Response':
    'Traits=Class,Bard,Auditory,Concentrate,Spellshape Require="level >= 8"',
  'Eclectic Skill':Pathfinder2E.FEATS['Eclectic Skill'],
  'Fortissimo Composition':Pathfinder2E.FEATS['Inspire Heroics'],
  'Know-It-All':Pathfinder2E.FEATS['Know-It-All'],
  'Reflexive Courage':
    'Traits=Class,Bard,Auditory,Concentrate ' +
    'Require="level >= 8","features.Warrior"',
  'Soulsight':'Traits=Class,Bard Require="level >= 8"',
  'Annotate Composition':
    'Traits=Class,Bard,Exploration,Linguistic Require="level >= 10"',
  'Courageous Assault':
    'Traits=Class,Bard,Auditory,Concentrate,Spellshape Require="level >= 10"',
  'House Of Imaginary Walls':Pathfinder2E.FEATS['House Of Imaginary Walls'],
  'Ode To Ouroboros':'Traits=Class,Bard Require="level >= 10"',
  'Quickened Casting':
    Pathfinder2E.FEATS['Quickened Casting']
    .replace('Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Witch,'),
  'Symphony Of The Unfettered Heart':'Traits=Class,Bard Require="level >= 10"',
  'Unusual Composition':
    Pathfinder2E.FEATS['Unusual Composition']
    .replace('Metamagic', 'Spellshape'),
  'Eclectic Polymath':Pathfinder2E.FEATS['Eclectic Polymath'],
  "Enigma's Knowledge":
    'Traits=Class,Bard Require="level >= 12","features.Assured Knowledge"',
  'Inspirational Focus':Pathfinder2E.FEATS['Inspirational Focus'],
  'Reverberate':'Traits=Class,Bard Require="level >= 12"',
  'Shared Assault':
    'Traits=Class,Bard Require="level >= 12","features.Courageous Assault"',
  'Allegro':Pathfinder2E.FEATS.Allegro,
  'Earworm':'Traits=Class,Bard,Exploration Require="level >= 14"',
  'Soothing Ballad':Pathfinder2E.FEATS['Soothing Ballad'],
  'Triumphant Inspiration':
    'Traits=Class,Bard Require="level >= 14","features.Warrior"',
  'True Hypercognition':Pathfinder2E.FEATS['True Hypercognition'],
  'Vigorous Anthem':
    'Traits=Class,Bard,Auditory,Concentrate,Spellshape Require="level >= 14"',
  'Courageous Onslaught':
    'Traits=Class,Bard,Auditory,Concentrate,Spellshape ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Courageous Advance",' +
      '"features.Courageous Assault"',
  'Effortless Concentration':
    Pathfinder2E.FEATS['Effortless Concentration']
    .replace('Traits=', 'Traits=Witch,'),
  'Resounding Finale':
    'Traits=Class,Bard,Concentrate Require="level >= 16","features.Maestro"',
  'Studious Capacity':Pathfinder2E.FEATS['Studious Capacity'],
  'All In My Head':'Traits=Class,Bard,Illusion,Mental Require="level >= 18"',
  'Deep Lore':Pathfinder2E.FEATS['Deep Lore'],
  'Discordant Voice':
    'Traits=Class,Bard,Sonic ' +
    'Require="level >= 18","spells.Courageous Anthem (OC1 Foc)"',
  'Eternal Composition':Pathfinder2E.FEATS['Eternal Composition'],
  'Impossible Polymath':Pathfinder2E.FEATS['Impossible Polymath'],
  'Fatal Aria':Pathfinder2E.FEATS['Fatal Aria'],
  'Perfect Encore':Pathfinder2E.FEATS['Perfect Encore'],
  'Pied Piping':'Traits=Class,Bard Require="level >= 20"',
  'Symphony Of The Muse':Pathfinder2E.FEATS['Symphony Of The Muse'],
  'Ultimate Polymath':
    'Traits=Class,Bard Require="level >= 20","features.Polymath"',

/*
  "Deity's Domain (Air)":
    'Traits=Class,Champion Require="deityDomains =~ \'Air\'"',
  "Deity's Domain (Ambition)":
    'Traits=Class,Champion Require="deityDomains =~ \'Ambition\'"',
  "Deity's Domain (Cities)":
    'Traits=Class,Champion Require="deityDomains =~ \'Cities\'"',
  "Deity's Domain (Confidence)":
    'Traits=Class,Champion Require="deityDomains =~ \'Confidence\'"',
  "Deity's Domain (Creation)":
    'Traits=Class,Champion Require="deityDomains =~ \'Creation\'"',
  "Deity's Domain (Darkness)":
    'Traits=Class,Champion Require="deityDomains =~ \'Darkness\'"',
  "Deity's Domain (Death)":
    'Traits=Class,Champion Require="deityDomains =~ \'Death\'"',
  "Deity's Domain (Destruction)":
    'Traits=Class,Champion Require="deityDomains =~ \'Destruction\'"',
  "Deity's Domain (Dreams)":
    'Traits=Class,Champion Require="deityDomains =~ \'Dreams\'"',
  "Deity's Domain (Earth)":
    'Traits=Class,Champion Require="deityDomains =~ \'Earth\'"',
  "Deity's Domain (Family)":
    'Traits=Class,Champion Require="deityDomains =~ \'Family\'"',
  "Deity's Domain (Fate)":
    'Traits=Class,Champion Require="deityDomains =~ \'Fate\'"',
  "Deity's Domain (Fire)":
    'Traits=Class,Champion Require="deityDomains =~ \'Fire\'"',
  "Deity's Domain (Freedom)":
    'Traits=Class,Champion Require="deityDomains =~ \'Freedom\'"',
  "Deity's Domain (Healing)":
    'Traits=Class,Champion Require="deityDomains =~ \'Healing\'"',
  "Deity's Domain (Indulgence)":
    'Traits=Class,Champion Require="deityDomains =~ \'Indulgence\'"',
  "Deity's Domain (Knowledge)":
    'Traits=Class,Champion Require="deityDomains =~ \'Knowledge\'"',
  "Deity's Domain (Luck)":
    'Traits=Class,Champion Require="deityDomains =~ \'Luck\'"',
  "Deity's Domain (Magic)":
    'Traits=Class,Champion Require="deityDomains =~ \'Magic\'"',
  "Deity's Domain (Might)":
    'Traits=Class,Champion Require="deityDomains =~ \'Might\'"',
  "Deity's Domain (Moon)":
    'Traits=Class,Champion Require="deityDomains =~ \'Moon\'"',
  "Deity's Domain (Nature)":
    'Traits=Class,Champion Require="deityDomains =~ \'Nature\'"',
  "Deity's Domain (Nightmares)":
    'Traits=Class,Champion Require="deityDomains =~ \'Nightmares\'"',
  "Deity's Domain (Pain)":
    'Traits=Class,Champion Require="deityDomains =~ \'Pain\'"',
  "Deity's Domain (Passion)":
    'Traits=Class,Champion Require="deityDomains =~ \'Passion\'"',
  "Deity's Domain (Perfection)":
    'Traits=Class,Champion Require="deityDomains =~ \'Perfection\'"',
  "Deity's Domain (Protection)":
    'Traits=Class,Champion Require="deityDomains =~ \'Protection\'"',
  "Deity's Domain (Secrecy)":
    'Traits=Class,Champion Require="deityDomains =~ \'Secrecy\'"',
  "Deity's Domain (Sun)":
    'Traits=Class,Champion Require="deityDomains =~ \'Sun\'"',
  "Deity's Domain (Travel)":
    'Traits=Class,Champion Require="deityDomains =~ \'Travel\'"',
  "Deity's Domain (Trickery)":
    'Traits=Class,Champion Require="deityDomains =~ \'Trickery\'"',
  "Deity's Domain (Truth)":
    'Traits=Class,Champion Require="deityDomains =~ \'Truth\'"',
  "Deity's Domain (Tyranny)":
    'Traits=Class,Champion Require="deityDomains =~ \'Tyranny\'"',
  "Deity's Domain (Undeath)":
    'Traits=Class,Champion Require="deityDomains =~ \'Undeath\'"',
  "Deity's Domain (Water)":
    'Traits=Class,Champion Require="deityDomains =~ \'Water\'"',
  "Deity's Domain (Wealth)":
    'Traits=Class,Champion Require="deityDomains =~ \'Wealth\'"',
  "Deity's Domain (Zeal)":
    'Traits=Class,Champion Require="deityDomains =~ \'Zeal\'"',
  'Ranged Reprisal':'Traits=Class,Champion Require="features.Paladin"',
  'Unimpeded Step':'Traits=Class,Champion Require="features.Liberator"',
  'Weight Of Guilt':'Traits=Class,Champion Require="features.Redeemer"',
  'Divine Grace':'Traits=Class,Champion Require="level >= 2"',
  'Dragonslayer Oath':
    'Traits=Class,Champion,Oath ' +
    'Require="level >= 2","features.The Tenets Of Good"',
  'Fiendsbane Oath':
    'Traits=Class,Champion,Oath ' +
    'Require="level >= 2","features.The Tenets Of Good"',
  'Shining Oath':
    'Traits=Class,Champion,Oath ' +
    'Require="level >= 2","features.The Tenets Of Good"',
  'Vengeful Oath':
    'Traits=Class,Champion,Oath ' +
    'Require="level >= 2","features.Paladin"',
  'Aura Of Courage':
    'Traits=Class,Champion Require="level >= 4","features.The Tenets Of Good"',
  'Divine Health':
    'Traits=Class,Champion Require="level >= 4","features.The Tenets Of Good"',
  'Mercy':
    'Traits=Class,Champion,Concentrate,Metamagic ' +
    'Require="level >= 4","spells.Lay On Hands (D1 Foc Nec)"',
  // Attack Of Opportunity as above
  'Litany Against Wrath':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 6","features.Devotion Spells","features.The Tenets Of Good"',
  'Loyal Warhorse':
    'Traits=Class,Champion Require="level >= 6","features.Divine Ally (Steed)"',
  'Shield Warden':
    'Traits=Class,Champion,Fighter ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Shield && features.The Tenets Of Good || features.Shield Block"',
  'Smite Evil':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Divine Ally (Blade)",' +
      '"features.The Tenets Of Good"',
  "Advanced Deity's Domain (Air)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Air)"',
  "Advanced Deity's Domain (Ambition)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Ambition)"',
  "Advanced Deity's Domain (Cities)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Cities)"',
  "Advanced Deity's Domain (Confidence)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Confidence)"',
  "Advanced Deity's Domain (Creation)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Creation)"',
  "Advanced Deity's Domain (Darkness)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Darkness)"',
  "Advanced Deity's Domain (Death)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Death)"',
  "Advanced Deity's Domain (Destruction)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Destruction)"',
  "Advanced Deity's Domain (Dreams)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Dreams)"',
  "Advanced Deity's Domain (Earth)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Earth)"',
  "Advanced Deity's Domain (Family)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Family)"',
  "Advanced Deity's Domain (Fate)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Fate)"',
  "Advanced Deity's Domain (Fire)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Fire)"',
  "Advanced Deity's Domain (Freedom)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Freedom)"',
  "Advanced Deity's Domain (Healing)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Healing)"',
  "Advanced Deity's Domain (Indulgence)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Indulgence)"',
  "Advanced Deity's Domain (Knowledge)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Knowledge)"',
  "Advanced Deity's Domain (Luck)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Luck)"',
  "Advanced Deity's Domain (Magic)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Magic)"',
  "Advanced Deity's Domain (Might)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Might)"',
  "Advanced Deity's Domain (Moon)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Moon)"',
  "Advanced Deity's Domain (Nature)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Nature)"',
  "Advanced Deity's Domain (Nightmares)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Nightmares)"',
  "Advanced Deity's Domain (Pain)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Pain)"',
  "Advanced Deity's Domain (Passion)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Passion)"',
  "Advanced Deity's Domain (Perfection)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Perfection)"',
  "Advanced Deity's Domain (Protection)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Protection)"',
  "Advanced Deity's Domain (Secrecy)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Secrecy)"',
  "Advanced Deity's Domain (Sun)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Sun)"',
  "Advanced Deity's Domain (Travel)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Travel)"',
  "Advanced Deity's Domain (Trickery)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Trickery)"',
  "Advanced Deity's Domain (Truth)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Truth)"',
  "Advanced Deity's Domain (Tyranny)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Tyranny)"',
  "Advanced Deity's Domain (Undeath)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Undeath)"',
  "Advanced Deity's Domain (Water)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Water)"',
  "Advanced Deity's Domain (Wealth)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Wealth)"',
  "Advanced Deity's Domain (Zeal)":
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Deity\'s Domain (Zeal)"',
  'Greater Mercy':'Traits=Class,Champion Require="level >= 8","features.Mercy"',
  'Heal Mount':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Divine Ally (Steed)",' +
      '"spells.Lay On Hands (D1 Foc Nec)"',
  'Quick Shield Block':
    'Traits=Class,Champion,Fighter ' +
    'Require="level >= 8","features.Shield Block"',
  'Second Ally':
    'Traits=Class,Champion Require="level >= 8","features.Divine Ally"',
  'Sense Evil':
    'Traits=Class,Champion Require="level >= 8","features.The Tenets Of Good"',
  'Devoted Focus':
    'Traits=Class,Champion Require="level >= 10","features.Devotion Spells"',
  'Imposing Destrier':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Divine Ally (Steed)",' +
      '"features.Loyal Warhorse"',
  'Litany Against Sloth':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Devotion Spells",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Spirit':
    'Traits=Class,Champion Require="level >= 10","features.Divine Ally (Blade)"',
  'Shield Of Reckoning':
    'Traits=Class,Champion,Flourish ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Champion\'s Reaction",' +
      '"features.Shield Warden"',
  'Affliction Mercy':
    'Traits=Class,Champion Require="level >= 12","features.Mercy"',
  'Aura Of Faith':
    'Traits=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  'Blade Of Justice':
    'Traits=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  "Champion's Sacrifice":
    'Traits=Class,Champion Require="level >= 12","features.The Tenets Of Good"',
  'Divine Wall':'Traits=Class,Champion Require="level >= 12"',
  'Lasting Doubt':
    'Traits=Class,Champion Require="level >= 12","features.Redeemer"',
  'Liberating Stride':
    'Traits=Class,Champion Require="level >= 12","features.Liberator"',
  'Anchoring Aura':
    'Traits=Class,Champion Require="level >= 14","features.Fiendsbane Oath"',
  'Aura Of Life':
    'Traits=Class,Champion Require="level >= 14","features.Shining Oath"',
  'Aura Of Righteousness':
    'Traits=Class,Champion Require="level >= 14","features.The Tenets Of Good"',
  // NOTE: Exalt requirement redundant? All Champions get it at level 11
  'Aura Of Vengeance':
    'Traits=Class,Champion ' +
    'Require="level >= 14","features.Vengeful Oath"',
  'Divine Reflexes':'Traits=Class,Champion Require="level >= 14"',
  'Litany Of Righteousness':
    'Traits=Class,Champion Require="level >= 14","features.The Tenets Of Good"',
  'Wyrmbane Aura':
    'Traits=Class,Champion Require="level >= 14","features.Dragonslayer Oath"',
  'Auspicious Mount':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Ally (Steed)",' +
      '"features.Imposing Destrier"',
  'Instrument Of Zeal':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Ally (Blade)",' +
      '"features.The Tenets Of Good"',
  'Shield Of Grace':
    'Traits=Class,Champion Require="level >= 16","features.Shield Warden"',
  'Celestial Form':
    'Traits=Class,Champion Require="level >= 18","features.The Tenets Of Good"',
  'Ultimate Mercy':
    'Traits=Class,Champion Require="level >= 18","features.Mercy"',
  'Celestial Mount':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Steed)",' +
      '"features.The Tenets Of Good"',
  'Radiant Blade Master':
    'Traits=Class,Champion ' +
    'Require=' +
      '"level >= 20",' +
      '"features.Divine Ally (Blade)",' +
      '"features.Radiant Blade Spirit"',
  'Shield Paragon':
    'Traits=Class,Champion Require="level >= 20","features.Divine Ally (Shield)"',
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
  'Premonition Of Avoidance':'Traits=Class,Cleric,Divine,Prediction',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    Pathfinder2E.FEATS['Deadly Simplicity'].replace('Positive', 'Vitality'),
  'Emblazon Armament':Pathfinder2E.FEATS['Emblazon Armament'],
  'Panic The Dead':
    Pathfinder2E.FEATS['Turn Undead']
    .replace('Traits=', 'Traits=Emotion,Fear,Mental,'),
  'Rapid Response':'Traits=Class,Cleric Require="level >= 2"',
  'Sap Life':Pathfinder2E.FEATS['Sap Life'],
  'Versatile Font':Pathfinder2E.FEATS['Versatile Font'],
  "Warpriest's Armor":
    'Traits=Class,Cleric Require="level >= 2","features.Warpriest"',
  'Channel Smite':
    Pathfinder2E.FEATS['Channel Smite']
    .replace(',Necromancy', '') + ' Require="level >= 4"',
  'Directed Channel':Pathfinder2E.FEATS['Directed Channel'],
  'Divine Infusion':
    Pathfinder2E.FEATS['Necrotic Infusion']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 4"',
  'Raise Symbol':'Traits=Class,Cleric Require="level >= 4"',
  'Restorative Strike':'Traits=Class,Cleric Require="level >= 4"',
  'Sacred Ground':
    'Traits=Class,Cleric,Consecration,Divine,Exploration ' +
    'Require="level >= 4","features.Harmful Font || feature.Healing Font"',
  'Cast Down':
    Pathfinder2E.FEATS['Cast Down']
    .replace('Metamagic', 'Spellshape') + ' Require="level >= 6"',
  'Divine Rebuttal':'Traits=Class,Cleric,Divine Require="level >= 6"',
  'Divine Weapon':Pathfinder2E.FEATS['Divine Weapon'],
  'Magic Hands':
    'Traits=Class,Cleric Require="level >= 6","features.Healing Hands"',
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
  'Martyr':'Traits=Class,Cleric,Spellshape Require="level >= 8"',
  'Restorative Channel':Pathfinder2E.FEATS['Channeled Succor'],
  'Sanctify Armament':
    Pathfinder2E.FEATS['Align Armament (Chaotic)']
    .replace(',Evocation', '') + ' ' +
    'Require="level >= 8","traits.Holy || traits.Unholy"',
  'Surging Focus':'Traits=Class,Cleric Require="level >= 8"',
  'Void Siphon':'Traits=Class,Cleric Require="level >= 8"',
  'Zealous Rush':'Traits=Class,Cleric Require="level >= 8"',
  'Castigating Weapon':
    Pathfinder2E.FEATS['Castigating Weapon'].replace('Holy', 'Divine'),
  'Heroic Recovery':
    Pathfinder2E.FEATS['Heroic Recovery']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 10","features.Healing Font"',
  'Replenishment Of War':Pathfinder2E.FEATS['Replenishment Of War'],
  'Shared Avoidance':
    'Traits=Class,Cleric ' +
    'Require="level >= 10","features.Premonition Of Avoidance"',
  'Shield Of Faith':
    'Traits=Class,Cleric Require="level >= 10","features.Domain Initiate"',
  'Defensive Recovery':
    Pathfinder2E.FEATS['Defensive Recovery']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 12"',
  'Domain Focus':Pathfinder2E.FEATS['Domain Focus'],
  'Emblazon Antimagic':Pathfinder2E.FEATS['Emblazon Antimagic'],
  'Fortunate Relief':'Traits=Class,Cleric,Fortune Require="level >= 12"',
  'Sapping Symbol':
    'Traits=Class,Cleric Require="level >= 12","features.Raise Symbol"',
  'Shared Replenishment':Pathfinder2E.FEATS['Shared Replenishment'],
  'Channeling Block':
    'Traits=Class,Cleric Require="level >= 14","features.Shield Block"',
  "Deity's Protection":Pathfinder2E.FEATS["Deity's Protection"],
  'Ebb An Flow':
    'Traits=Class,Cleric,Concentrate,Spellshape ' +
    'Require="level >= 14","features.Versatile Font"',
  'Fast Channel':Pathfinder2E.FEATS['Fast Channel'],
  'Lasting Armament':
    Pathfinder2E.FEATS['Extend Armament Alignment']
    .replace('Align', 'Sanctify'),
  'Premonition Of Clarity':'Traits=Class,Cleric,Fortune Require="level >= 14"',
  'Swift Banishment':Pathfinder2E.FEATS['Swift Banishment'],
  'Eternal Bane':
    Pathfinder2E.FEATS['Eternal Bane'] + ' ' +
    'Require="level >= 16","traits.Unholy"',
  'Eternal Blessing':
    Pathfinder2E.FEATS['Eternal Blessing'] + ' ' +
    'Require="level >= 16","traits.Holy"',
  'Rebounding Smite':
    'Traits=Class,Cleric Require="level >= 16","features.Channel Smite"',
  'Remediate':
    'Traits=Class,Cleric,Concentrate,Spellshape Require="level >= 16"',
  'Resurrectionist':Pathfinder2E.FEATS.Resurrectionist,
  'Divine Apex':'Traits=Class,Cleric Require="level >= 18"',
  'Echoing Channel':
    Pathfinder2E.FEATS['Deadly Simplicity']
    .replace('Metamagic', 'Spellshape'),
  'Improved Swift Banishment':Pathfinder2E.FEATS['Improved Swift Banishment'],
  'Inviolable':'Traits=Class,Cleric Require="level >= 18"',
  'Miraculous Possibility':'Traits=Class,Cleric Require="level >= 18"',
  'Shared Clarity':
    'Traits=Class,Cleric ' +
    'Require="level >= 18","features.Premonition Of Clarity"',
  "Avatar's Audience":Pathfinder2E.FEATS["Avatar's Audience"],
  "Avatar's Protection":'Traits=Class,Cleric Require="level >= 20"',
  'Maker Of Miracles':Pathfinder2E.FEATS['Maker Of Miracles'],
  'Spellshape Channel':Pathfinder2E.FEATS['Metamagic Channel'],

  'Animal Companion':Pathfinder2E.FEATS['Animal Companion'],
  'Animal Empathy':Pathfinder2E.FEATS['Wild Empathy'],
  'Leshy Familiar':Pathfinder2E.FEATS['Leshy Familiar'],
  // Note: Feat 1 Plant Empathy links to legacy Feat 6 Druid Empathy in Nethys
  'Plant Empathy':'Traits=Class,Druid',
  'Storm Born':Pathfinder2E.FEATS['Storm Born'],
  'Verdant Weapon':'Traits=Class,Druid,Exploration',
  // Reach Spell as above
  'Widen Spell':
    Pathfinder2E.FEATS['Widen Spell']
    .replace('Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Witch,'),
  'Untamed Form':Pathfinder2E.FEATS['Wild Shape'].replaceAll('Wild', 'Untamed'),
  'Call Of The Wild':Pathfinder2E.FEATS['Call Of The Wild'],
  'Enhanced Familiar':
    Pathfinder2E.FEATS['Enhanced Familiar'].replace('Traits=', 'Traits=Witch,'),
  'Order Explorer (Animal)':Pathfinder2E.FEATS['Order Explorer (Animal)'],
  'Order Explorer (Leaf)':Pathfinder2E.FEATS['Order Explorer (Leaf)'],
  'Order Explorer (Storm)':Pathfinder2E.FEATS['Order Explorer (Storm)'],
  'Order Explorer (Untamed)':
    Pathfinder2E.FEATS['Order Explorer (Wild)']
    .replace('Wild', 'Untamed'),
  'Poison Resistance':Pathfinder2E.FEATS['Poison Resistance'],
  'Anthropomorphic Shape':
    Pathfinder2E.FEATS['Thousand Faces']
    .replace('Wild Shape', 'Untamed Form'),
  'Elemental Summons':'Traits=Class,Druid Require="level >= 4"',
  'Forest Passage':Pathfinder2E.FEATS['Woodland Stride'],
  'Form Control':
    Pathfinder2E.FEATS['Form Control']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 4","features.Untamed Form"',
  'Leshy Familiar Secrets':
    'Traits=Class,Druid ' +
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
    'Traits=Class,Druid,Cold,Manipulate,Spellshape ' +
    'Require="level >= 4","features.Storm"',
  'Current Spell':
    'Traits=Class,Druid,Concentrate,Spellshape Require="level >= 6"',
  'Grown Of Oak':
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Insect Shape':
    Pathfinder2E.FEATS['Insect Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Instinctive Support':
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Animal Companion"',
  // Steady Spellcasting as above
  'Storm Retribution':
    Pathfinder2E.FEATS['Storm Retribution']
    .replace(' Evo', ''),
  'Deimatic Display':
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Intimidation >= 1"',
  'Ferocious Shape':
    Pathfinder2E.FEATS['Ferocious Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Fey Caller':Pathfinder2E.FEATS['Fey Caller'],
  'Floral Restoration':
    'Traits=Class,Druid,Healing,Vitality ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  'Incredible Companion':Pathfinder2E.FEATS['Incredible Companion'],
  'Raise Menhir':'Traits=Class,Druid Require="level >= 8"',
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
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Incredible Companion"',
  'Pristine Weapon':
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Verdant Weapon"',
  'Side By Side':Pathfinder2E.FEATS['Side By Side'],
  'Thunderclap Spell':
    'Traits=Class,Druid,Sonic,Spellshape ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Storm || features.Order Explorer (Storm)"',
  'Dragon Shape':Pathfinder2E.FEATS['Dragon Shape'],
  'Garland Spell':
    'Traits=Class,Druid,Manipulate,Spellshape ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Leaf || features.Order Explorer (Leaf)"',
  // Note: also subsumes legacy Feat 18 Primal Wellspring
  'Primal Focus':Pathfinder2E.FEATS['Primal Focus'],
  'Primal Summons':Pathfinder2E.FEATS['Primal Summons'],
  'Wandering Oasis':
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 12",' +
      '"rank.Survival >= 3"',
  'Reactive Transformation':
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Untamed Form",' +
      '"features.Dragon Shape || features.Elemental Shape || features.Plant Shape || features.Soaring Shape"',
  'Sow Spell':'Traits=Class,Druid,Concentrate,Spellshape Require="level >= 14"',
  'Specialized Companion':Pathfinder2E.FEATS['Specialized Companion'],
  'Timeless Nature':Pathfinder2E.FEATS['Timeless Nature'],
  'Verdant Metamorphosis':Pathfinder2E.FEATS['Verdant Metamorphosis'],
  // Effortless Concentration as above
  'Impaling Briars':Pathfinder2E.FEATS['Impaling Briars'],
  'Monstrosity Shape':
    Pathfinder2E.FEATS['Monstrosity Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Uplifting Winds':
    'Traits=Class,Druid ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Storm || features.Order Explorer (Storm)"',
  'Invoke Disaster':Pathfinder2E.FEATS['Invoke Disaster'],
  'Perfect Form Control':Pathfinder2E.FEATS['Perfect Form Control'],
  'Primal Aegis':'Traits=Class,Druid Require="level >= 18"',
  "Hierophant's Power":Pathfinder2E.FEATS["Hierophant's Power"],
  'Ley Line Conduit':
    Pathfinder2E.FEATS['Leyline Conduit']
    .replace('Metamagic', 'Spellshape'),
  'True Shapeshifter':
    Pathfinder2E.FEATS['True Shapeshifter']
    .replace('Wild Shape', 'Untamed Form'),

  'Combat Assessment':'Traits=Class,Fighter',
  'Double Slice':Pathfinder2E.FEATS['Double Slice'],
  'Exacting Strike':Pathfinder2E.FEATS['Exacting Strike'],
  'Point Blank Stance':
    Pathfinder2E.FEATS['Point-Blank Shot']
    .replace(',Open', ''),
  'Reactive Shield':Pathfinder2E.FEATS['Reactive Shield'],
  'Snagging Strike':Pathfinder2E.FEATS['Snagging Strike'],
  'Sudden Charge':Pathfinder2E.FEATS['Sudden Charge'],
  'Vicious Swing':Pathfinder2E.FEATS['Power Attack'],
  'Aggressive Block':Pathfinder2E.FEATS['Aggressive Block'],
  'Assisting Shot':Pathfinder2E.FEATS['Assisting Shot'],
  'Blade Brake':'Traits=Class,Fighter,Manipulate Require="level >= 2"',
  'Brutish Shove':Pathfinder2E.FEATS['Brutish Shove'],
  'Combat Grab':Pathfinder2E.FEATS['Combat Grab'],
  'Dueling Parry':Pathfinder2E.FEATS['Dueling Parry'],
  'Intimidating Strike':Pathfinder2E.FEATS['Intimidating Strike'],
  'Lightning Swap':'Traits=Class,Fighter,Flourish Require="level >= 2"',
  'Lunge':Pathfinder2E.FEATS.Lunge,
  'Rebounding Toss':'Traits=Class,Fighter,Flourish Require="level >= 2"',
  'Sleek Reposition':'Traits=Class,Fighter,Press Require="level >= 2"',
  'Barreling Charge':
    'Traits=Class,Fighter,Flourish Require="level >= 4","rank.Athletics >= 1"',
  'Double Shot':Pathfinder2E.FEATS['Double Shot'],
  'Dual-Handed Assault':Pathfinder2E.FEATS['Dual-Handed Assault'],
  'Parting Shot':'Traits=Class,Fighter Require="level >= 4"',
  'Powerful Shove':Pathfinder2E.FEATS['Powerful Shove'],
  'Quick Reversal':Pathfinder2E.FEATS['Quick Reversal'],
  'Shielded Stride':Pathfinder2E.FEATS['Shielded Stride'],
  'Slam Down':Pathfinder2E.FEATS.Knockdown,
  'Swipe':Pathfinder2E.FEATS.Swipe,
  'Twin Parry':Pathfinder2E.FEATS['Twin Parry'],
  'Advanced Weapon Training':Pathfinder2E.FEATS['Advanced Weapon Training'],
  'Advantageous Assault':Pathfinder2E.FEATS['Advantageous Assault'],
  'Dazing Blow':'Traits=Class,Fighter,Press Require="level >= 6"',
  'Disarming Stance':Pathfinder2E.FEATS['Disarming Stance'],
  'Furious Focus':
    Pathfinder2E.FEATS['Furious Focus']
    .replace('Power Attack', 'Vicious Swing'),
  "Guardian's Deflection":Pathfinder2E.FEATS["Guardian's Deflection"],
  'Reflexive Shield':Pathfinder2E.FEATS['Reflexive Shield'],
  'Revealing Stab':Pathfinder2E.FEATS['Revealing Stab'],
  'Ricochet Stance':'Traits=Class,Fighter,Rogue,Stance Require="level >= 6"',
  'Shatter Defenses':Pathfinder2E.FEATS['Shatter Defenses'],
  'Shield Warden':
    'Traits=Class,Fighter Require="level >=6","features.Shield Block"',
  'Triple Shot':Pathfinder2E.FEATS['Triple Shot'],
  'Blind-Fight':Pathfinder2E.FEATS['Blind-Fight'],
  'Disorienting Opening':
    'Traits=Class,Fighter Require="level >= 8","features.Reactive Strike"',
  'Dueling Riposte':Pathfinder2E.FEATS['Dueling Riposte'],
  'Felling Strike':Pathfinder2E.FEATS['Felling Strike'],
  'Incredible Aim':Pathfinder2E.FEATS['Incredible Aim'],
  'Mobile Shot Stance':Pathfinder2E.FEATS['Mobile Shot Stance'],
  'Positioning Assault':Pathfinder2E.FEATS['Positioning Assault'],
  'Quick Shield Block':
    'Traits=Class,Fighter Require="level >= 8","features.Shield Block"',
  'Resounding Bravery':
    'Traits=Class,Fighter Require="level >= 8","features.Bravery"',
  'Sudden Leap':'Traits=Class,Fighter Require="level >= 8"',
  'Agile Grace':Pathfinder2E.FEATS['Agile Grace'],
  'Certain Strike':Pathfinder2E.FEATS['Certain Strike'],
  'Crashing Slam':
    Pathfinder2E.FEATS['Improved Knockdown']
    .replace('Knockdown', 'Slam Down'),
  'Cut From The Air':'Traits=Class,Fighter Require="level >= 10"',
  'Debilitating Shot':Pathfinder2E.FEATS['Debilitating Shot'],
  'Disarming Twist':Pathfinder2E.FEATS['Disarming Twist'],
  'Disruptive Stance':Pathfinder2E.FEATS['Disruptive Stance'],
  'Fearsome Brute':Pathfinder2E.FEATS['Fearsome Brute'],
  'Flinging Charge':'Traits=Class,Fighter,Flourish Require="level >= 10"',
  'Mirror Shield':Pathfinder2E.FEATS['Mirror Shield'],
  'Overpowering Charge':
    'Traits=Class,Fighter Require="level >= 10","features.Barreling Charge"',
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
    .replace('Traits=', 'Traits=Press,'),
  'Determination':Pathfinder2E.FEATS.Determination,
  'Guiding Finish':Pathfinder2E.FEATS['Guiding Finish'],
  'Guiding Riposte':Pathfinder2E.FEATS['Guiding Riposte'],
  'Improved Twin Riposte':Pathfinder2E.FEATS['Improved Twin Riposte'],
  'Opening Stance':Pathfinder2E.FEATS['Stance Savant'],
  'Two-Weapon Flurry':Pathfinder2E.FEATS['Two-Weapon Flurry'],
  'Whirlwind Strike':Pathfinder2E.FEATS['Whirlwind Strike'],
  'Graceful Poise':Pathfinder2E.FEATS['Graceful Poise'],
  'Improved Reflexive Shield':Pathfinder2E.FEATS['Improved Reflexive Shield'],
  'Master Of Many Styles':
    'Traits=Class,Fighter Require="level >= 16","features.Opening Stance"',
  'Multishot Stance':
    Pathfinder2E.FEATS['Multishot Stance']
    .replace('Triple', 'Double'),
  'Overwhelming Blow':'Traits=Class,Fighter Require="level >= 16"',
  'Twinned Defense':Pathfinder2E.FEATS['Twinned Defense'],
  'Impossible Volley':
    Pathfinder2E.FEATS['Impossible Volley']
    .replace(',Open', ''),
  'Savage Critical':Pathfinder2E.FEATS['Savage Critical'],
  'Smash From The Air':
    'Traits=Class,Fighter Require="level >= 18","features.Cut From The Air"',
  'Boundless Reprisals':Pathfinder2E.FEATS['Boundless Reprisals'],
  'Ultimate Flexibility':
    'Traits=Class,Fighter Require="level >= 20","features.Improved Flexibility"',
  'Weapon Supremacy':Pathfinder2E.FEATS['Weapon Supremacy'],

/*
  'Crane Stance':'Traits=Class,Monk,Stance',
  'Dragon Stance':'Traits=Class,Monk,Stance',
  'Ki Rush':'Traits=Class,Monk',
  'Ki Strike':'Traits=Class,Monk',
  'Monastic Weaponry':'Traits=Class,Monk',
  'Mountain Stance':'Traits=Class,Monk,Stance',
  'Tiger Stance':'Traits=Class,Monk,Stance',
  'Wolf Stance':'Traits=Class,Monk,Stance',
  'Brawling Focus':'Traits=Class,Monk Require="level >= 2"',
  'Crushing Grab':'Traits=Class,Monk Require="level >= 2"',
  'Dancing Leaf':'Traits=Class,Monk Require="level >= 2"',
  'Elemental Fist':'Traits=Class,Monk Require="level >= 2","features.Ki Strike"',
  'Stunning Fist':
    'Traits=Class,Monk Require="level >= 2","features.Flurry Of Blows"',
  'Deflect Arrow':'Traits=Class,Monk Require="level >= 4"',
  'Flurry Of Maneuvers':
    'Traits=Class,Monk Require="level >= 4","rank.Athletics >= 2"',
  'Flying Kick':'Traits=Class,Monk Require="level >= 4"',
  'Guarded Movement':'Traits=Class,Monk Require="level >= 4"',
  'Stand Still':'Traits=Class,Monk Require="level >= 4"',
  'Wholeness Of Body':
    'Traits=Class,Monk Require="level >= 4","features.Ki Spells"',
  'Abundant Step':
    'Traits=Class,Monk ' +
    'Require="level >= 6","features.Incredible Movement","features.Ki Spells"',
  'Crane Flutter':
    'Traits=Class,Monk Require="level >= 6","features.Crane Stance"',
  'Dragon Roar':
    'Traits=Class,Monk,Auditory,Emotion,Fear,Mental ' +
    'Require="level >= 6","features.Dragon Stance"',
  'Ki Blast':
    'Traits=Class,Monk Require="level >= 6","features.Ki Spells"',
  'Mountain Stronghold':
    'Traits=Class,Monk Require="level >= 6","features.Mountain Stance"',
  'Tiger Slash':
    'Traits=Class,Monk Require="level >= 6","features.Tiger Stance"',
  'Water Step':'Traits=Class,Monk Require="level >= 6"',
  'Whirling Throw':'Traits=Class,Monk Require="level >= 6"',
  'Wolf Drag':
    'Traits=Class,Monk Require="level >= 6","features.Wolf Stance"',
  'Arrow Snatching':
    'Traits=Class,Monk Require="level >= 8","features.Deflect Arrow"',
  'Ironblood Stance':'Traits=Class,Monk,Stance Require="level >= 8"',
  'Mixed Maneuver':
    'Traits=Class,Monk Require="level >= 8","rank.Athletics >= 3"',
  'Tangled Forest Stance':'Traits=Class,Monk,Stance Require="level >= 8"',
  'Wall Run':'Traits=Class,Monk Require="level >= 8"',
  'Wild Winds Initiate':
    'Traits=Class,Monk Require="level >= 8","features.Ki Spells"',
  'Knockback Strike':'Traits=Class,Monk,Concentrate Require="level >= 10"',
  'Sleeper Hold':'Traits=Class,Monk,Incapacitation Require="level >= 10"',
  'Wind Jump':
    'Traits=Class,Monk Require="level >= 10","features.Ki Spells"',
  'Winding Flow':'Traits=Class,Monk Require="level >= 10"',
  'Diamond Soul':'Traits=Class,Monk Require="level >= 12"',
  'Disrupt Ki':'Traits=Class,Monk,Negative Require="level >= 12"',
  'Improved Knockback':
    'Traits=Class,Monk Require="level >= 12","rank.Athletics >= 3"',
  'Meditative Focus':
    'Traits=Class,Monk Require="level >= 12","features.Ki Spells"',
  // Stance Savant as above
  'Ironblood Surge':
    'Traits=Class,Monk Require="level >= 14","features.Ironblood Stance"',
  'Mountain Quake':
    'Traits=Class,Monk Require="level >= 14","features.Mountain Stronghold"',
  'Tangled Forest Rake':
    'Traits=Class,Monk Require="level >= 14","features.Tangled Forest Stance"',
  'Timeless Body':'Traits=Class,Monk Require="level >= 14"',
  'Tongue Of Sun And Moon':'Traits=Class,Monk Require="level >= 14"',
  'Wild Winds Gust':
    'Traits=Class,Monk,Air,Concentrate,Evocation,Manipulate ' +
    'Require="level >= 14","features.Wild Winds Initiate"',
  'Enlightened Presence':
    'Traits=Class,Monk,Aura,Emotion,Mental Require="level >= 16"',
  'Master Of Many Styles':
    'Traits=Class,Monk Require="level >= 16","features.Stance Savant"',
  'Quivering Palm':'Traits=Class,Monk Require="level>=16","features.Ki Spells"',
  'Shattering Strike':'Traits=Class,Monk Require="level >= 16"',
  'Diamond Fists':'Traits=Class,Monk Require="level >= 18"',
  'Empty Body':
    'Traits=Class,Monk Require="level >= 18","features.Ki Spells"',
  'Meditative Wellspring':
    'Traits=Class,Monk Require="level >= 18","features.Meditative Focus"',
  'Swift River':'Traits=Class,Monk Require="level >= 18"',
  'Enduring Quickness':'Traits=Class,Monk Require="level >= 20"',
  'Fuse Stance':'Traits=Class,Monk Require="level >= 20","sumStanceFeats >=2 "',
  'Impossible Technique':'Traits=Class,Monk,Fortune Require="level >= 20"',
*/

  // Animal Companion as above
  'Crossbow Ace':Pathfinder2E.FEATS['Crossbow Ace'],
  'Hunted Shot':Pathfinder2E.FEATS['Hunted Shot'],
  'Initiate Warden':'Traits=Class,Ranger',
  'Monster Hunter':Pathfinder2E.FEATS['Monster Hunter'],
  'Twin Takedown':Pathfinder2E.FEATS['Twin Takedown'],
  'Favored Terrain (%terrain)':Pathfinder2E.FEATS['Favored Terrain (%terrain)'],
  "Hunter's Aim":Pathfinder2E.FEATS["Hunter's Aim"],
  'Monster Warden':Pathfinder2E.FEATS['Monster Warden'],
  'Quick Draw':Pathfinder2E.FEATS['Quick Draw'],
  'Advanced Warden':
    'Traits=Class,Ranger Require="level >= 4","features.Initiate Warden"',
  "Companion's Cry":Pathfinder2E.FEATS["Companion's Cry"],
  'Disrupt Prey':Pathfinder2E.FEATS['Disrupt Prey'],
  'Far Shot':Pathfinder2E.FEATS['Far Shot'],
  'Favored Prey':Pathfinder2E.FEATS['Favored Enemy'],
  'Running Reload':Pathfinder2E.FEATS['Running Reload'],
  "Scout's Warning":Pathfinder2E.FEATS["Scout's Warning"],
  // Twin Parry as above
  'Additional Recollection':'Traits=Class,Ranger Require="level >= 6"',
  'Masterful Warden':
    'Traits=Class,Ranger Require="level >= 6","features.Initiate Warden"',
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
    'Traits=Class,Ranger Require="level >= 10","features.Initiate Warden"',
  'Penetrating Shot':
    Pathfinder2E.FEATS['Penetrating Shot']
    .replace(',Open', ''),
  // Twin Riposte as above
  "Warden's Step":Pathfinder2E.FEATS["Warden's Step"],
  'Distracting Shot':Pathfinder2E.FEATS['Distracting Shot'],
  'Double Prey':Pathfinder2E.FEATS['Double Prey'],
  'Second Sting':Pathfinder2E.FEATS['Second Sting'],
  // Side By Side as above
  "Warden's Focus":
    'Traits=Class,Ranger Require="level >= 12","features.Initiate Warden"',
  'Sense The Unseen':Pathfinder2E.FEATS['Sense The Unseen'],
  'Shared Prey':Pathfinder2E.FEATS['Shared Prey'],
  'Stealthy Companion':Pathfinder2E.FEATS['Stealthy Companion'],
  "Warden's Guidance":Pathfinder2E.FEATS["Warden's Guidance"],
  'Greater Distracting Shot':Pathfinder2E.FEATS['Greater Distracting Shot'],
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':Pathfinder2E.FEATS['Legendary Monster Hunter'],
  // Specialized Companion as above
  "Warden's Reload":'Traits=Class,Ranger Require="level >= 16"',
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
  'Overextending Feint':'Traits=Class,Rogue Require="rank.Deception >= 1"',
  'Plant Evidence':'Traits=Class,Rogue Require="features.Pickpocket"',
  'Trap Finder':Pathfinder2E.FEATS['Trap Finder'],
  'Tumble Behind':'Traits=Class,Rogue',
  'Twin Feint':Pathfinder2E.FEATS['Twin Feint'],
  "You're Next":Pathfinder2E.FEATS["You're Next"],
  'Brutal Beating':Pathfinder2E.FEATS['Brutal Beating'],
  'Clever Gambit':'Traits=Class,Rogue Require="level >=2","features.Mastermind"',
  'Distracting Feint':Pathfinder2E.FEATS['Distracting Feint'],
  'Mobility':Pathfinder2E.FEATS.Mobility,
  // Quick Draw as above
  'Strong Arm':'Traits=Class,Rogue',
  'Unbalancing Blow':Pathfinder2E.FEATS['Unbalancing Blow'],
  'Underhanded Assault':
    'Traits=Class,Rogue Require="level >= 2","rank.Stealth >= 1"',
  'Dread Striker':Pathfinder2E.FEATS['Dread Striker'],
  'Head Stomp':'Traits=Class,Rogue Require="level >= 4"',
  'Mug':'Traits=Class,Rogue Require="level >= 4"',
  'Poison Weapon':Pathfinder2E.FEATS['Poison Weapon'],
  'Predictable!':'Traits=Class,Rogue Require="level >= 4"',
  'Reactive Pursuit':Pathfinder2E.FEATS['Reactive Pursuit'],
  'Sabotage':Pathfinder2E.FEATS.Sabotage,
  "Scoundrel's Surprise":'Traits=Class,Rogue,Manipulate Require="level >= 4"',
  // Scout's Warning as above
  'The Harder They Fall':'Traits=Class,Rogue Require="level >= 4"',
  'Twin Distraction':
    'Traits=Class,Rogue Require="level >= 4","features.Twin Feint"',
  'Analyze Weakness':
    'Traits=Class,Rogue Require="level >= 6","features.Sneak Attack"',
  'Anticipate Ambush':
    'Traits=Class,Rogue,Exploration Require="level >= 6","rank.Stealth >= 2"',
  'Far Throw':'Traits=Class,Rogue Require="level >= 6"',
  'Gang Up':Pathfinder2E.FEATS['Gang Up'],
  'Light Step':Pathfinder2E.FEATS['Light Step'],
  'Shove Down':'Traits=Class,Rogue Require="level >= 6","rank.Athletics >= 1"',
  // Skirmish Strike as above
  'Sly Disarm':'Traits=Class,Rogue Require="level >= 6"',
  'Twist The Knife':Pathfinder2E.FEATS['Twist The Knife'],
  'Watch Your Back':
    'Traits=Class,Rogue,Emotion,Fear,Mental ' +
    'Require="level >= 6","rank.Intimidation >= 1"',
  // Blind-Fight as above
  'Bullseye':'Traits=Class,Rogue Require="level >= 8"',
  'Delay Trap':Pathfinder2E.FEATS['Delay Trap'],
  'Improved Poison Weapon':Pathfinder2E.FEATS['Improved Poison Weapon'],
  'Inspired Stratagem':'Traits=Class,Rogue Require="level >= 8"',
  'Nimble Roll':Pathfinder2E.FEATS['Nimble Roll'],
  'Opportune Backstab':Pathfinder2E.FEATS['Opportune Backstab'],
  'Predictive Purchase':'Traits=Class,Rogue Require="level >= 8"',
  // Ricochet Stance as above
  'Sidestep':Pathfinder2E.FEATS.Sidestep,
  'Sly Striker':Pathfinder2E.FEATS['Sly Striker'],
  'Swipe Souvenir':'Traits=Class,Rogue Require="level >= 8"',
  'Tactical Entry':'Traits=Class,Rogue Require="level >= 8","rank.Stealth >= 3"',
  'Methodical Debilitations':
    'Traits=Class,Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Mastermind",' +
      '"features.Debilitating Strike"',
  'Nimble Strike':
    'Traits=Class,Rogue Require="level >= 10","features.Nimble Roll"',
  'Precise Debilitations':Pathfinder2E.FEATS['Precise Debilitations'],
  'Sneak Adept':Pathfinder2E.FEATS['Sneak Savant'],
  'Tactical Debilitations':Pathfinder2E.FEATS['Tactical Debilitations'],
  'Vicious Debilitations':Pathfinder2E.FEATS['Vicious Debilitations'],
  'Bloody Debilitation':
    'Traits=Class,Rogue ' +
    'Require="level >= 12","rank.Medicine >= 1","features.Debilitating Strike"',
  'Critical Debilitation':Pathfinder2E.FEATS['Critical Debilitation'],
  'Fantastic Leap':Pathfinder2E.FEATS['Fantastic Leap'],
  'Felling Shot':Pathfinder2E.FEATS['Felling Shot'],
  'Preparation':'Traits=Class,Rogue,Flourish Require="level >= 12"',
  'Reactive Interference':Pathfinder2E.FEATS['Reactive Interference'],
  'Ricochet Feint':
    'Traits=Class,Rogue Require="level >= 12","features.Ricochet Stance"',
  'Spring From The Shadows':Pathfinder2E.FEATS['Spring From The Shadows'],
  'Defensive Roll':Pathfinder2E.FEATS['Defensive Roll'],
  'Instant Opening':Pathfinder2E.FEATS['Instant Opening'],
  'Leave An Opening':Pathfinder2E.FEATS['Leave An Opening'],
  // Sense The Unseen as above
  'Stay Down!':'Traits=Class,Rogue Require="level >= 12","rank.Athletics >= 3"',
  'Blank Slate':Pathfinder2E.FEATS['Blank Slate'],
  'Cloud Step':Pathfinder2E.FEATS['Cloud Step'],
  'Cognitive Loophole':Pathfinder2E.FEATS['Cognitive Loophole'],
  'Dispelling Slice':Pathfinder2E.FEATS['Dispelling Slice'],
  'Perfect Distraction':Pathfinder2E.FEATS['Perfect Distraction'],
  'Reconstruct The Scene':'Traits=Class,Rogue,Concentrate Require="level >= 16"',
  'Swift Elusion':
    'Traits=Class,Rogue Require="level >= 16","rank.Acrobatics >= 4"',
  'Implausible Infiltration':Pathfinder2E.FEATS['Implausible Infiltration'],
  'Implausible Purchase':
    'Traits=Class,Rogue Require="level >= 18","features.Predictive Purchase"',
  'Powerful Sneak':Pathfinder2E.FEATS['Powerful Sneak'],
  "Trickster's Ace":
    Pathfinder2E.FEATS["Trickster's Ace"]
    .replace('Traits=', 'Traits=Investigator,'),
  'Hidden Paragon':Pathfinder2E.FEATS['Hidden Paragon'],
  'Impossible Striker':Pathfinder2E.FEATS['Impossible Striker'],
  'Reactive Distraction':Pathfinder2E.FEATS['Reactive Distraction'],

  'Counterspell':
    Pathfinder2E.FEATS.Counterspell.replace('Traits=', 'Traits=Witch,'),
/*
  'Dangerous Sorcery':'Traits=Class,Sorcerer',
*/
  'Familiar':Pathfinder2E.FEATS.Familiar,
/*
  // Reach Spell as above
  // Widen Spell as above
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Arcane Evolution':
    'Traits=Class,Sorcerer,Arcane ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Arcane\'"',
*/
  'Bespell Strikes':Pathfinder2E.FEATS['Bespell Weapon'],
/*
  'Divine Evolution':
    'Traits=Class,Sorcerer,Divine ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Divine\'"',
  'Occult Evolution':
    'Traits=Class,Sorcerer,Occult ' +
     'Require="level >= 4","bloodlineTraditions =~ \'Occult\'"',
  'Primal Evolution':
    'Traits=Class,Sorcerer,Primal ' +
    'Require="level >= 4","bloodlineTraditions =~ \'Primal\'"',
  'Advanced Bloodline':
    'Traits=Class,Sorcerer Require="level >= 6","features.Bloodline"',
  // Steady Spellcasting as above
  'Bloodline Resistance':'Traits=Class,Sorcerer Require="level >= 8"',
  'Crossblooded Evolution':'Traits=Class,Sorcerer Require="level >= 8"',
  'Greater Bloodline':
    'Traits=Class,Sorcerer Require="level >= 10","features.Bloodline"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Bloodline Focus':
    'Traits=Class,Sorcerer Require="level >= 12","features.Bloodline"',
*/
  'Magic Sense':Pathfinder2E.FEATS['Magic Sense'],
/*
  'Interweave Dispel':
    'Traits=Class,Sorcerer,Metamagic ' +
    'Require="level >= 14","knowsDispelMagicSpell"',
  */
  'Reflect Spell':
    Pathfinder2E.FEATS['Reflect Spell']
    .replace('Traits=', 'Traits=Witch,'),
  /*
  // Effortless Concentration as above
  'Greater Mental Evolution':
    'Traits=Class,Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Arcane Evolution || features.Occult Evolution"',
  'Greater Vital Evolution':
    'Traits=Class,Sorcerer ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Divine Evolution || features.Primal Evolution"',
  'Bloodline Wellspring':
    'Traits=Class,Sorcerer Require="level >= 18","features.Bloodline Focus"',
  'Greater Crossblooded Evolution':
    'Traits=Class,Sorcerer ' +
    'Require="level >= 18","features.Crossblooded Evolution"',
  'Bloodline Conduit':'Traits=Class,Sorcerer,Metamagic Require="level >= 20"',
  'Bloodline Perfection':
    'Traits=Class,Sorcerer Require="level >= 20","features.Bloodline Paragon"',
*/
  'Spellshape Mastery':Pathfinder2E.FEATS['Metamagic Mastery'],

  'Cackle':'Traits=Class,Witch',
  'Cauldron':'Traits=Class,Witch',
  // Counterspell as above
  // Widen Spell as above
  "Witch's Armaments (Eldritch Nails)":'Traits=Class,Witch',
  "Witch's Armaments (Iron Teeth)":'Traits=Class,Witch',
  "Witch's Armaments (Living Hair)":'Traits=Class,Witch',
  'Basic Lesson (Dreams)':'Traits=Class,Witch Require="level >= 2"',
  'Basic Lesson (Elements)':'Traits=Class,Witch Require="level >= 2"',
  'Basic Lesson (Life)':'Traits=Class,Witch Require="level >= 2"',
  'Basic Lesson (Protection)':'Traits=Class,Witch Require="level >= 2"',
  'Basic Lesson (Vengeance)':'Traits=Class,Witch Require="level >= 2"',
  // Cantrip Expansion as above
  'Conceal Spell':
    Pathfinder2E.FEATS['Conceal Spell']
    .replace('Manipulate,Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Witch,'),
  // Enhanced Familiar as above
  "Familiar's Language":'Traits=Class,Witch Require="level >= 2"',
  'Rites Of Convocation':'Traits=Class,Witch Require="level >= 4"',
  'Sympathetic Strike':
    'Traits=Class,Witch Require="level >= 4","features.Witch\'s Armaments"',
  'Ceremonial Knife':'Traits=Class,Witch Require="level >= 6"',
  'Greater Lesson (Mischief)':'Traits=Class,Witch Require="level >= 6"',
  'Greater Lesson (Shadow)':'Traits=Class,Witch Require="level >= 6"',
  'Greater Lesson (Snow)':'Traits=Class,Witch Require="level >= 6"',
  // Steady Spellcasting as above
  "Witch's Charge":'Traits=Class,Witch,Detection Require="level >= 6"',
  'Incredible Familiar':
    'Traits=Class,Witch Require="level >= 8","features.Enhanced Familiar"',
  'Murksight':'Traits=Class,Witch Require="level >= 8"',
  'Spirit Familiar':
    'Traits=Class,Witch ' +
    'Require=' +
      '"level >= 8",' +
      '"patronTraditions =~ \'Divine|Occult\'"',
  'Stitched Familiar':
    'Traits=Class,Witch ' +
    'Require="' +
      'level >= 8",' +
      '"patronTraditions =~ \'Arcane|Primal\'"',
  "Witch's Bottle":'Traits=Class,Witch Require="level >= 8","features.Cauldron"',
  'Double, Double':
    'Traits=Class,Witch Require="level >= 10","features.Cauldron"',
  'Major Lesson (Death)':'Traits=Class,Witch Require="level >= 10"',
  'Major Lesson (Renewal)':'Traits=Class,Witch Require="level >= 10"',
  // Quickened Casting as above
  "Witch's Communion":
    'Traits=Class,Witch Require="level >= 10","features.Witch\'s Charge"',
  'Coven Spell':'Traits=Class,Witch,Spellshape Require="level >= 12"',
  'Hex Focus':'Traits=Class,Witch Require="level >= 12"',
  "Witch's Broom":'Traits=Class,Witch Require="level >= 12"',
  // Reflect Spell as above
  'Rites of Transfiguration':'Traits=Class,Witch Require="level >= 14"',
  "Patron's Presence":'Traits=Class,Witch Require="level >= 14"',
  // Effortless Concentration as above
  'Siphon Power':'Traits=Class,Witch Require="level >= 16"',
  'Split Hex':'Traits=Class,Witch,Concentrate,Spellshape Require="level >= 18"',
  "Patron's Claim":'Traits=Class,Witch Require="level >= 18"',
  'Hex Master':'Traits=Class,Witch Require="level >= 20"',
  "Patron's Truth":
    'Traits=Class,Witch Require="level >= 20","features.Patron\'s Gift"',
  "Witch's Hut":'Traits=Class,Witch Require="level >= 20"',

  // Wizard
  // Counterspell as above
  // Familiar as above
  // Reach Spell as above
  'Spellbook Prodigy':'Traits=Class,Wizard Require="rank.Arcana >= 1"',
  // Widen Spell as above
  // Cantrip Expansion as above
  // Conceal Spell as above
  'Energy Ablation':'Traits=Class,Wizard,Spellshape Require="level >= 2"',
  // Enhanced Familiar as above
  'Nonlethal Spell':
    'Traits=Class,Wizard,Manipulate,Spellshape Require="level >= 2"',
  // Bespell Weapon as above
  'Call Wizardly Tools':
    'Traits=Class,Wizard,Concentrate,Teleportation ' +
    'Require="level >= 4","features.Arcane Bond"',
  'Linked Focus':Pathfinder2E.FEATS['Linked Focus'],
  'Spell Protection Array':
    'Traits=Class,Wizard,Arcane,Manipulate Require="level >= 4"',
  'Convincing Illusion':
    'Traits=Class,Wizard Require="level >= 6","rank.Deception >= 2"',
  'Explosive Arrival':
    'Traits=Class,Wizard,Concentrate,Manipulate,Spellshape Require="level >= 6"',
  'Irresistible Magic':Pathfinder2E.FEATS['Spell Penetration'],
  'Split Slot':'Traits=Class,Wizard Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced School Spell':Pathfinder2E.FEATS['Advanced School Spell'],
  'Bond Conservation':
    Pathfinder2E.FEATS['Bond Conservation']
    .replace('Metamagic', 'Spellshape'),
  'Form Retention':'Traits=Class,Wizard Require="level >= 8"',
  'Knowledge Is Power':'Traits=Class,Wizard Require="level >= 8"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Adept':Pathfinder2E.FEATS['Scroll Savant'],
  'Clever Counterspell':Pathfinder2E.FEATS['Clever Counterspell'],
  'Forcible Energy':
    'Traits=Class,Wizard,Manipulate,Spellshape Require="level >= 12"',
  'Keen Magical Detection':'Traits=Class,Wizard,Fortune Require="level >= 12"',
  // Magic Sense as above
  'Bonded Focus':Pathfinder2E.FEATS['Bonded Focus'],
  // Reflect Spell as above
  'Secondary Detonation Array':
    'Traits=Class,Wizard,Manipulate,Spellshape Require="level >= 14"',
  'Superior Bond':Pathfinder2E.FEATS['Superior Bond'],
  // Effortless Concentration as above
  'Scintillating Spell':
    'Traits=Class,Wizard,Concentrate,Light,Spellshape Require="level >= 16"',
  'Spell Tinker':Pathfinder2E.FEATS['Spell Tinker'],
  'Infinite Possibilities':Pathfinder2E.FEATS['Infinite Possibilities'],
  'Reprepare Spell':Pathfinder2E.FEATS['Reprepare Spell'],
  'Second Thoughts':
    'Traits=Class,Wizard,Concentrate,Mental Require="level >= 18"',
  "Archwizard's Might":Pathfinder2E.FEATS["Archwizard's Might"],
  'Spell Combination':Pathfinder2E.FEATS['Spell Combination'],
  'Spell Mastery':'Traits=Class,Wizard Require="level >= 20"',
  // Spellshape Mastery as above

/*
  // Archetype
  'Alchemist Dedication':
    'Traits=Archetype,Dedication,Multiclass,Alchemist ' +
    'Require=' +
      '"level >= 2",' +
      '"intelligence >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Alchemist == 0"',
  'Basic Concoction':
    'Traits=Archetype,Alchemist ' +
    'Require="level >= 4","features.Alchemist Dedication"',
  'Quick Alchemy':
    'Traits=Archetype,Alchemist ' +
    'Require="level >= 4","features.Alchemist Dedication"',
  'Advanced Concoction':
    'Traits=Archetype,Alchemist ' +
    'Require="level >= 6","features.Basic Concoction"',
  'Expert Alchemy':
    'Traits=Archetype,Alchemist ' +
    'Require="level >= 6","features.Alchemist Dedication","rank.Crafting >= 2"',
  'Master Alchemy':
    'Traits=Archetype,Alchemist ' +
    'Require="level >= 12","features.Expert Alchemy","rank.Crafting >= 3"',

  'Barbarian Dedication':
    'Traits=Archetype,Dedication,Multiclass,Barbarian ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14 || multiclassAbilityRequirementsWaived",' +
      '"constitution >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Barbarian == 0"',
  'Barbarian Resiliency':
    'Traits=Archetype,Barbarian ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Barbarian Dedication",' +
      '"classHitPoints <= 10"',
  'Basic Fury':
    'Traits=Archetype,Barbarian ' +
    'Require="level >= 4","features.Barbarian Dedication"',
  'Advanced Fury':
    'Traits=Archetype,Barbarian Require="level >= 6","features.Basic Fury"',
  'Instinct Ability':
    'Traits=Archetype,Barbarian ' +
    'Require="level >= 6","features.Barbarian Dedication"',
  "Juggernaut's Fortitude":
    'Traits=Archetype,Barbarian ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Barbarian Dedication",' +
      '"rank.Fortitude >= 2"',

  'Bard Dedication':
    'Traits=Archetype,Dedication,Multiclass,Bard ' +
    'Require=' +
      '"level >= 2",' +
      '"charisma >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Bard == 0"',
  'Basic Bard Spellcasting':
    'Traits=Archetype,Bard Require="level >= 4","features.Bard Dedication"',
  "Basic Muse's Whispers":
    'Traits=Archetype,Bard Require="level >= 4","features.Bard Dedication"',
  "Advanced Muse's Whispers":
    'Traits=Archetype,Bard ' +
    'Require="level >= 4","features.Basic Muse\'s Whispers"',
  'Counter Perform':
    'Traits=Archetype,Bard Require="level >= 6","features.Bard Dedication"',
  'Inspirational Performance':
    'Traits=Archetype,Bard Require="level >= 8","features.Bard Dedication"',
  'Occult Breadth':
    'Traits=Archetype,Bard ' +
    'Require="level >= 8","features.Basic Bard Spellcasting"',
  'Expert Bard Spellcasting':
    'Traits=Archetype,Bard ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Bard Spellcasting",' +
      '"rank.Occultism >= 3"',
  'Master Bard Spellcasting':
    'Traits=Archetype,Bard ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Bard Spellcasting",' +
      '"rank.Occultism >= 4"',

  'Champion Dedication':
    'Traits=Archetype,Dedication,Multiclass,Champion ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14 || multiclassAbilityRequirementsWaived",' +
      '"charisma >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Champion == 0"',
  'Basic Devotion':
    'Traits=Archetype,Champion ' +
    'Require="level >= 4","features.Champion Dedication"',
  'Champion Resiliency':
    'Traits=Archetype,Champion ' +
    'Require="level >= 4","features.Champion Dedication","classHitPoints <= 8"',
  'Healing Touch':
    'Traits=Archetype,Champion ' +
    'Require="level >= 4","features.Champion Dedication"',
  'Advanced Devotion':
    'Traits=Archetype,Champion Require="level >= 6","features.Basic Devotion"',
  "Champion's Reaction":
    'Traits=Archetype,Champion ' +
    'Require="level >= 6","features.Champion Dedication"',
  'Divine Ally':
    'Traits=Archetype,Champion ' +
    'Require="level >= 6","features.Champion Dedication"',
  'Diverse Armor Expert':
    'Traits=Archetype,Champion ' +
    'Require=' +
      '"level >= 14",' +
      '"rank.Unarmored Defense >= 2 || rank.Light Armor >= 2 || rank.Medium Armor >= 2 || rank.Heavy Armor >= 2"',

  'Cleric Dedication':
    'Traits=Archetype,Dedication,Multiclass,Cleric ' +
    'Require=' +
      '"level >= 2",' +
      '"wisdom >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Cleric == 0"',
  'Basic Cleric Spellcasting':
    'Traits=Archetype,Cleric Require="level >= 4","features.Cleric Dedication"',
  'Basic Dogma':
    'Traits=Archetype,Cleric Require="level >= 4","features.Cleric Dedication"',
  'Advanced Dogma':
    'Traits=Archetype,Cleric Require="level >= 6","features.Basic Dogma"',
  'Divine Breadth':
    'Traits=Archetype,Cleric ' +
    'Require="level >= 8","features.Basic Cleric Spellcasting"',
  'Expert Cleric Spellcasting':
    'Traits=Archetype,Cleric ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Cleric Spellcasting",' +
      '"rank.Religion >= 3"',
  'Master Cleric Spellcasting':
    'Traits=Archetype,Cleric ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Cleric Spellcasting",' +
      '"rank.Religion >= 4"',

  'Druid Dedication':
    'Traits=Archetype,Dedication,Multiclass,Druid ' +
    'Require=' +
      '"level >= 2",' +
      '"wisdom >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Druid == 0"',
  'Basic Druid Spellcasting':
    'Traits=Archetype,Druid Require="level >= 4","features.Druid Dedication"',
  'Basic Wilding':
    'Traits=Archetype,Druid Require="level >= 4","features.Druid Dedication"',
  'Order Spell':
    'Traits=Archetype,Druid Require="level >= 4","features.Druid Dedication"',
  'Advanced Wilding':
    'Traits=Archetype,Druid Require="level >= 6","features.Basic Wilding"',
  'Primal Breadth':
    'Traits=Archetype,Druid ' +
    'Require="level >= 8","features.Basic Druid Spellcasting"',
  'Expert Druid Spellcasting':
    'Traits=Archetype,Druid ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Druid Spellcasting",' +
      '"rank.Nature >= 3"',
  'Master Druid Spellcasting':
    'Traits=Archetype,Druid ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Druid Spellcasting",' +
      '"rank.Nature >= 4"',

  'Fighter Dedication':
    'Traits=Archetype,Dedication,Multiclass,Fighter ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14 || multitalentedHalfElf",' +
      '"dexterity >= 14 || multitalentedHalfElf",' +
      '"levels.Fighter == 0"',
  'Basic Maneuver':
    'Traits=Archetype,Fighter Require="level >= 4","features.Fighter Dedication"',
  'Fighter Resiliency':
    'Traits=Archetype,Fighter ' +
    'Require="level >= 4","features.Fighter Dedication","classHitPoints <= 8"',
  'Opportunist':
    'Traits=Archetype,Fighter Require="level >= 4","features.Fighter Dedication"',
  'Advanced Maneuver':
    'Traits=Archetype,Fighter Require="level >= 6","features.Basic Maneuver"',
  'Diverse Weapon Expert':
    'Traits=Archetype,Fighter ' +
    'Require=' +
      '"level >= 12",' +
      '"maxWeaponTraining >= 2 || rank.Unarmed Attacks >= 2"',

  'Monk Dedication':
    'Traits=Archetype,Dedication,Multiclass,Monk ' +
    'Require=' +
      '"level >= 2",' +
      '"strength >= 14 || multitalentedHalfElf",' +
      '"dexterity >= 14 || multitalentedHalfElf",' +
      '"levels.Monk == 0"',
  'Basic Kata':
    'Traits=Archetype,Monk Require="level >= 4","feats.Monk Dedication"',
  'Monk Resiliency':
    'Traits=Archetype,Monk ' +
    'Require="level >= 4","feats.Monk Dedication","classHitPoints <= 8"',
  'Advanced Kata':'Traits=Archetype,Monk Require="level >= 6","feats.Basic Kata"',
  'Monk Moves':'Traits=Archetype,Monk Require="level >= 8","feats.Monk Dedication"',
  "Monk's Flurry":
    'Traits=Archetype,Monk Require="level >= 10","feats.Monk Dedication"',
  "Perfection's Path (Fortitude)":
    'Traits=Archetype,Monk Require="level >= 12","rank.Fortitude >= 3"',
  "Perfection's Path (Reflex)":
    'Traits=Archetype,Monk Require="level >= 12","rank.Fortitude >= 3"',
  "Perfection's Path (Will)":
    'Traits=Archetype,Monk Require="level >= 12","rank.Fortitude >= 3"',

  'Ranger Dedication':
    'Traits=Archetype,Dedication,Multiclass,Ranger ' +
    'Require=' +
      '"level >= 2",' +
      '"dexterity >= 14 || multitalentedHalfElf",' +
      '"levels.Ranger == 0"',
  "Basic Hunter's Trick":
    'Traits=Archetype,Ranger Require="level >= 4","features.Ranger Dedication"',
  'Ranger Resiliency':
    'Traits=Archetype,Ranger ' +
    'Require="level >= 4","features.Ranger Dedication","classHitPoints <= 8"',
  "Advanced Hunter's Trick":
    'Traits=Archetype,Ranger ' +
    'Require="level >= 6","features.Basic Hunter\'s Trick"',
  'Master Spotter':
    'Traits=Archetype,Ranger ' +
    'Require="level >= 12","features.Ranger Dedication","rank.Perception >= 3"',

  'Rogue Dedication':
    'Traits=Archetype,Dedication,Multiclass,Rogue ' +
    'Require=' +
      '"level >= 2",' +
      '"dexterity >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Rogue == 0"',
  'Basic Trickery':
    'Traits=Archetype,Rogue Require="level >= 4","features.Rogue Dedication"',
  'Sneak Attacker':
    'Traits=Archetype,Rogue Require="level >= 4","features.Rogue Dedication"',
  'Advanced Trickery':
    'Traits=Archetype,Rogue Require="level >= 6","features.Basic Trickery"',
  'Skill Mastery':
    'Traits=Archetype,Rogue ' +
    'Require="level >= 8","features.Rogue Dedication","maxSkillRank>=2"',
  'Uncanny Dodge':
    'Traits=Archetype,Rogue Require="level >= 10","features.Rogue Dedication"',
  'Evasiveness':
    'Traits=Archetype,Rogue ' +
    'Require="level >= 12","features.Rogue Dedication","rank.Reflex >= 2"',

  'Sorcerer Dedication':
    'Traits=Archetype,Dedication,Multiclass,Sorcerer ' +
    'Require=' +
      '"level >= 2",' +
      '"charisma >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Sorcerer == 0"',
  'Basic Sorcerer Spellcasting':
    'Traits=Archetype,Sorcerer ' +
    'Require="level >= 4","features.Sorcerer Dedication"',
  'Basic Blood Potency':
    'Traits=Archetype,Sorcerer ' +
    'Require="level >= 4","features.Sorcerer Dedication"',
  'Basic Bloodline Spell':
    'Traits=Archetype,Sorcerer ' +
    'Require="level >= 4","features.Sorcerer Dedication"',
  'Advanced Blood Potency':
    'Traits=Archetype,Sorcerer ' +
    'Require="level >= 6","features.Basic Blood Potency"',
  'Bloodline Breadth':
    'Traits=Archetype,Sorcerer ' +
    'Require="level >= 8","features.Basic Sorcerer Spellcasting"',
  'Expert Sorcerer Spellcasting':
    'Traits=Archetype,Sorcerer ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Sorcerer Spellcasting",' +
      '"rank.Arcana >= 3 || rank.Nature >= 3 || rank.Occultism >= 3 || rank.Religion >= 3"',
  'Master Sorcerer Spellcasting':
    'Traits=Archetype,Sorcerer ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Master Sorcerer Spellcasting",' +
      '"rank.Arcana >= 4 || rank.Nature >= 4 || rank.Occultism >= 4 || rank.Religion >= 4"',

  'Wizard Dedication':
    'Traits=Archetype,Dedication,Multiclass,Wizard ' +
    'Require=' +
      '"level >= 2",' +
      '"intelligence >= 14 || multiclassAbilityRequirementsWaived",' +
      '"levels.Wizard == 0"',
  'Arcane School Spell':
    'Traits=Archetype,Wizard Require="level >= 4","features.Wizard Dedication"',
  'Basic Arcana':
    'Traits=Archetype,Wizard Require="level >= 4","features.Wizard Dedication"',
  'Basic Wizard Spellcasting':
    'Traits=Archetype,Wizard Require="level >= 4","features.Wizard Dedication"',
  'Advanced Arcana':
    'Traits=Archetype,Wizard Require="level >= 6","features.Basic Arcana"',
  'Arcane Breadth':
    'Traits=Archetype,Wizard ' +
    'Require="level >= 8","features.Basic Wizard Spellcasting"',
  'Expert Wizard Spellcasting':
    'Traits=Archetype,Wizard ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Wizard Spellcasting",' +
      '"rank.Arcana >= 3"',
  'Master Wizard Spellcasting':
    'Traits=Archetype,Wizard ' +
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
    'Traits=General,Healing,Manipulate,Skill ' +
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
    'Traits=Concentrate,Exploration,General,Healing,Skill ' +
    'Require="level >= 7","rank.Occultism >= 3 || rank.Religion >= 3"',
  'Breath Control':'Traits=General',
  'Canny Acumen (Fortitude)':Pathfinder2E.FEATS['Canny Acumen (Fortitude)'],
  'Canny Acumen (Perception)':Pathfinder2E.FEATS['Canny Acumen (Perception)'],
  'Canny Acumen (Reflex)':Pathfinder2E.FEATS['Canny Acumen (Reflex)'],
  'Canny Acumen (Will)':Pathfinder2E.FEATS['Canny Acumen (Will)'],
  'Cat Fall':Pathfinder2E.FEATS['Cat Fall'],
  'Charming Liar':Pathfinder2E.FEATS['Charming Liar'],
  'Cloud Jump':Pathfinder2E.FEATS['Cloud Jump'],
  'Combat Climber':Pathfinder2E.FEATS['Combat Climber'],
  'Communal Crafting':
    'Traits=General,Skill Require="level >= 2","rank.Crafting >= 2"',
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
  'Lie To Me':Pathfinder2E.FEATS['Lie To Me'],
  'Magical Crafting':Pathfinder2E.FEATS['Magical Crafting'],
  'Magical Shorthand':Pathfinder2E.FEATS['Magical Shorthand'],
  'Monster Crafting':
    'Traits=General,Skill Require="level >= 7","rank.Survival >= 3"',
  'Multilingual':Pathfinder2E.FEATS.Multilingual,
  'Natural Medicine':Pathfinder2E.FEATS['Natural Medicine'],
  'Nimble Crawl':Pathfinder2E.FEATS['Nimble Crawl'],
  'No Cause For Alarm':
    'Traits=General,Skill,Auditory,Concentrate,Emotion,Linguistic,Mental ' +
    'Require="rank.Diplomacy >= 1"',
  'Oddity Identification':Pathfinder2E.FEATS['Oddity Identification'],
  'Pet':'Traits=General',
  'Pickpocket':Pathfinder2E.FEATS.Pickpocket,
  'Planar Survival':Pathfinder2E.FEATS['Planar Survival'],
  'Powerful Leap':Pathfinder2E.FEATS['Powerful Leap'],
  'Prescient Consumable':
    'Traits=General Require="level >= 7","features.Prescient Planner"',
  'Prescient Planner':'Traits=General Require="level >= 3"',
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
  'Schooled In Secrets':'Traits=General,Skill Require="rank.Occultism >= 1"',
  'Seasoned':
    'Traits=General,Skill ' +
    'Require="rank.Alcohol Lore >= 1 || rank.Cooking Lore >= 1 || rank.Crafting >= 1"',
  'Shameless Request':Pathfinder2E.FEATS['Shameless Request'],
  'Shield Block':Pathfinder2E.FEATS['Shield Block'],
  'Sign Language':Pathfinder2E.FEATS['Sign Language'],
  'Skill Training (%skill)':Pathfinder2E.FEATS['Skill Training (%skill)'],
  'Slippery Secrets':Pathfinder2E.FEATS['Slippery Secrets'],
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
    'Traits=General,Skill Require="level >= 2","rank.Medicine >= 2"',
  'Virtuosic Performer':Pathfinder2E.FEATS['Virtuosic Performer'],
  'Wall Jump':Pathfinder2E.FEATS['Wall Jump'],
  'Ward Medic':Pathfinder2E.FEATS['Ward Medic'],
  'Wary Disarmament':Pathfinder2E.FEATS['Wary Disarmament'],
  'Weapon Proficiency (Martial Weapons)':
    Pathfinder2E.FEATS['Weapon Proficiency (Martial Weapons)'],
  'Weapon Proficiency (%advancedWeapon)':
    Pathfinder2E.FEATS['Weapon Proficiency (%advancedWeapon)'],

  // Core 2
  'A Home In Every Port':
    'Traits=General,Downtime Require="level >= 11","charismaModifier >= 3"',
  'Acrobatic Performer':'Traits=General,Skill Require="rank.Acrobatics >= 1"',
  'Aerobatics Mastery':
    'Traits=General,Skill Require="level >= 7","rank.Acrobatics >= 3"',
  'Armor Assist':
    'Traits=General,Skill ' +
    'Require="rank.Athletics >= 1 || rank.Warfare Lore >= 1"',
  'Armored Stealth':
    'Traits=General,Skill Require="level >= 2","rank.Stealth >= 2"',
  'Assured Identification':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Arcana >= 2 || rank.Nature >= 2 || rank.Occultism >= 2 || rank.Religion >= 2"',
  'Backup Disguise':
    'Traits=General,Skill Require="level >= 2","rank.Deception >= 2"',
  'Battle Planner':
    'Traits=General,Skill Require="level >= 2","rank.Warfare Lore >= 2"',
  'Biographical Eye':
    'Traits=General,Skill,Secret Require="level >= 7","rank.Society >= 3"',
  'Bon Mot':
    'Traits=General,Skill,Auditory,Concentrate,Emotion,Linguistic,Mental ' +
    'Require="rank.Diplomacy >= 1"',
  'Caravan Leader':
    'Traits=General Require="level >= 11","features.Pick Up The Pace"',
  'Concealing Legerdemain':'Traits=General,Skill Require="rank.Thievery >= 1"',
  'Consult The Spirits':
    'Traits=General,Skill,Secret ' +
    'Require=' +
      '"level >= 7",' +
      '"rank.Nature >= 3 || rank.Occult >= 3 || rank.Religion >= 3"',
  "Crafter's Appraisal":'Traits=General,Skill Require="rank.Crafting >= 1"',
  'Deceptive Worship':'Traits=General,Skill Require="rank.Occultism >= 1"',
  'Dirty Trick':
    'Traits=General,Skill,Attack,Manipulate Require="rank.Thievery >= 1"',
  'Discreet Inquiry':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Deception >= 2 || rank.Diplomacy >= 2"',
  'Distracting Performance':
    'Traits=General,Skill Require="level >= 2","rank.Performance >= 2"',
  'Disturbing Knowledge':
    'Traits=General,Skill,Emotion,Fear,Mental ' +
    'Require="level >= 7","rank.Occultism >= 3"',
  'Doublespeak':
    'Traits=General,Skill Require="level >= 7","rank.Deception >= 3"',
  'Environmental Guide':
    'Traits=General,Skill Require="level >= 7","rank.Survival >= 3"',
  'Evangelize':
    'Traits=General,Skill Require="level >= 7","rank.Diplomacy >= 3"',
  'Exhort The Faithful':
    'Traits=General,Skill Require="level >= 2","rank.Religion >= 2"',
  'Express Rider':'Traits=General,Skill,Exploration Require="rank.Nature >= 1"',
  'Eye For Numbers':'Traits=General,Skill Require="rank.Society >= 1"',
  'Eyes Of The City':
    'Traits=General,Skill ' +
    'Require="level >= 2","rank.Diplomacy >= 1 || rank.Society >= 1"',
  'Forensic Acumen':'Traits=General,Skill Require="rank.Medicine >= 1"',
  'Glean Contents':'Traits=General,Skill Require="rank.Society >= 1"',
  'Improvise Tool':'Traits=General,Skill Require="rank.Crafting >= 1"',
  'Improvised Repair':'Traits=General Require="level >= 3"',
  'Incredible Scout':
    'Traits=General,Exploration Require="level >= 11","rank.Perception >= 3"',
  'Influence Nature':
    'Traits=General,Skill,Downtime Require="level >= 7","rank.Nature >= 3"',
  'Inoculation':'Traits=General,Skill,Healing Require="rank.Medicine >= 1"',
  'Keen Follower':'Traits=General Require="level >= 3"',
  'Lead Climber':
    'Traits=General,Skill Require="level >= 2","rank.Athletics >= 2"',
  'Legendary Guide':
    'Traits=General,Skill Require="level >= 15","rank.Survival >= 4"',
  'Leverage Connections':
    Pathfinder2E.FEATS.Connections
    .replace('Graces', 'Graces || features.Streetwise'),
  'Numb To Death':'Traits=General Require="level >= 7","features.Diehard"',
  'Pick Up The Pace':
    'Traits=General Require="level >= 3","constitutionModifier >= 2"',
  "Pilgrim's Token":'Traits=General,Skill Require="rank.Religion >= 1"',
  'Rapid Affixture':
    'Traits=General,Skill Require="level >= 7","rank.Crafting >= 3"',
  'Risky Surgery':'Traits=General,Skill Require="rank.Medicine >= 1"',
  'Robust Health':'Traits=General Require="level >= 3"',
  'Rolling Landing':
    'Traits=General,Skill Require="level >= 2","features.Cat Fall"',
  'Root Magic':'Traits=General,Skill Require="rank.Occultism >= 1"',
  'Sanctify Water':
    'Traits=General,Skill ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Religion >= 2",' +
      '"deitySanctification != \'None\'"',
  'Shadow Mark':'Traits=General,Skill Require="level >= 2","rank.Stealth >= 2"',
  'Signature Crafting':
    'Traits=General,Skill,Uncommon ' +
    'Require="level >= 7","rank.Crafting >= 3","features.Magical Crafting"',
  'Slippery Prey':
    'Traits=General,Skill ' +
    'Require="level >= 2","rank.Acrobatics >= 1 || rank.Athletics >= 1"',
  'Snare Crafting':Pathfinder2E.FEATS['Snare Crafting'],
  'Sow Rumor':
    'Traits=General,Skill,Uncommon,Secret ' +
    'Require="level >= 2","rank.Deception >= 2"',
  'Supertaster':'Traits=General Require="level >= 7","rank.Perception >= 3"',
  'Terrifying Resistance':
    'Traits=General,Skill Require="level >= 2","rank.Intimidation >= 2"',
  'Thorough Search':
    'Traits=General Require="level >= 3","rank.Perception >= 2"',
  'True Perception':
    'Traits=General,Revelation Require="level >= 19","rank.Perception >= 4"',
  'Tumbling Teamwork':
    'Traits=General,Skill Require="level >= 2","rank.Acrobatics >= 2"',
  'Tumbling Theft':
    'Traits=General,Skill ' +
    'Require="level >= 7","rank.Acrobatics >= 2","rank.Thievery >= 2"',
  'Underground Network':
    'Traits=General,Skill,Uncommon ' +
    'Require="level >= 2","rank.Society >= 2","features.Streetwise"',
  'Water Sprint':
    'Traits=General,Skill Require="level >= 7","rank.Athletics >= 3"'

};
Pathfinder2ERemaster.FEATURES = {

  // Ancestry
  'Ancestry Feats':'Section=feature Note="%V selections"',

  'Ancient-Blooded Dwarf':Pathfinder2E.FEATURES['Ancient-Blooded Dwarf'],
  'Call On Ancient Blood':Pathfinder2E.FEATURES['Call On Ancient Blood'],
  'Darkvision':Pathfinder2E.FEATURES.Darkvision,
  'Death Warden Dwarf':
    Pathfinder2E.FEATURES['Death Warden Dwarf']
    .replace('necromancy', 'void and undead'),
  'Dwarf Heritage':Pathfinder2E.FEATURES['Dwarf Heritage'],
  'Forge Dwarf':Pathfinder2E.FEATURES['Forge Dwarf'],
  'Rock Dwarf':
    Pathfinder2E.FEATURES['Rock Dwarf'].replace('Shove', 'Reposition, Shove'),
  'Slow':Pathfinder2E.FEATURES.Slow,
  'Strong-Blooded Dwarf':Pathfinder2E.FEATURES['Strong-Blooded Dwarf'],

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
    .replace('Stonecunning', "Stonemason's Eye")
    .replace('Meld Into Stone', 'One With Stone'),
  'March The Mines':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strides or Burrows 15\' twice; can take along an adjacent willing ally"',
  'Telluric Power':
    'Section=magic ' +
    'Note="Inflicts additional damage equal to the number of weapon damage dice to a foe standing on the same earth or stone surface"',
  'Stonegate':
    'Section=magic ' +
    'Note="Knows the Magic Passage divine innate spell; can cast it once per day to open passages through earth or stone"',
  'Stonewall':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Petrifies self until the end of the turn, negating damage from the triggering effect and subsequent effects that would not affect stone"',

  'Ancient Elf':'Section=feature Note="+1 Class Feat (multiclass dedication)"',
  'Arctic Elf':Pathfinder2E.FEATURES['Arctic Elf'],
  'Cavern Elf':Pathfinder2E.FEATURES['Cavern Elf'],
  'Elf Heritage':Pathfinder2E.FEATURES['Elf Heritage'],
  'Fast':Pathfinder2E.FEATURES.Fast,
  'Low-Light Vision':Pathfinder2E.FEATURES['Low-Light Vision'],
  'Seer Elf':Pathfinder2E.FEATURES['Seer Elf'],
  // Changed
  'Whisper Elf':
    'Section=skill ' +
    'Note="+2 Seek within 30\' and reduces flat check DC to find concealed or hidden targets to 3 or 9"',
  'Woodland Elf':Pathfinder2E.FEATURES['Woodland Elf'],

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

  'Chameleon Gnome':Pathfinder2E.FEATURES['Chameleon Gnome'],
  'Fey-Touched Gnome':Pathfinder2E.FEATURES['Fey-Touched Gnome'],
  'Gnome Heritage':Pathfinder2E.FEATURES['Gnome Heritage'],
  // Low-Light Vision as above
  'Sensate Gnome':Pathfinder2E.FEATURES['Sensate Gnome'],
  'Wellspring Gnome':Pathfinder2E.FEATURES['Wellspring Gnome'],
  'Wellspring Gnome (Arcane)':
    Pathfinder2E.FEATURES['Wellspring Gnome (Arcane)'],
  'Wellspring Gnome (Divine)':
    Pathfinder2E.FEATURES['Wellspring Gnome (Divine)'],
  'Wellspring Gnome (Occult)':
    Pathfinder2E.FEATURES['Wellspring Gnome (Occult)'],

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
     'Note="Knows the Invisibility and Revealing Light primal innate spells; can cast each once per day"',
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

  'Charhide Goblin':Pathfinder2E.FEATURES['Charhide Goblin'],
  // Darkvision as above
  'Goblin Heritage':Pathfinder2E.FEATURES['Goblin Heritage'],
  'Irongut Goblin':Pathfinder2E.FEATURES['Irongut Goblin'],
  'Razortooth Goblin':Pathfinder2E.FEATURES['Razortooth Goblin'],
  'Snow Goblin':Pathfinder2E.FEATURES['Snow Goblin'],
  'Unbreakable Goblin':Pathfinder2E.FEATURES['Unbreakable Goblin'],

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

  'Gutsy Halfling':Pathfinder2E.FEATURES['Gutsy Halfling'],
  'Halfling Heritage':Pathfinder2E.FEATURES['Halfling Heritage'],
  'Hillock Halfling':Pathfinder2E.FEATURES['Hillock Halfling'],
  'Jinx':
    'Action=2 ' +
    'Section=magic ' +
    'Note="R30\' Inflicts clumsy 1 for 1 min (<b>save Will</b> negates; critical failure inflicts clumsy 2 for 1 min)"',
  'Jinxed Halfling':'Section=feature Note="Has the Jinx feature"',
  'Keen Eyes':Pathfinder2E.FEATURES['Keen Eyes'],
  'Nomadic Halfling':Pathfinder2E.FEATURES['Nomadic Halfling'],
  'Twilight Halfling':Pathfinder2E.FEATURES['Twilight Halfling'],
  'Wildwood Halfling':Pathfinder2E.FEATURES['Wildwood Halfling'],

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

  'Human Heritage':Pathfinder2E.FEATURES['Human Heritage'],
  'Skilled Human':Pathfinder2E.FEATURES['Skilled Heritage Human'],
  'Versatile Human':Pathfinder2E.FEATURES['Versatile Heritage Human'],

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

  'Cactus Leshy':
    'Section=combat Note="Spines unarmed attack inflicts 1d6 HP piercing"',
  'Fruit Leshy':
    'Section=magic ' +
    'Note="Produces a fruit each day that restores %{1+(level-1)//2}d8 HP if eaten within an hour after removal"',
  'Fungus Leshy':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Darkvision feature",' +
      '"Has the fungus trait, not the plant trait"',
  'Gourd Leshy':
    'Section=feature Note="Can store 1 Bulk of objects within head"',
  'Leaf Leshy':'Section=save Note="Takes no damage from falling"',
  'Leshy Heritage':'Section=feature Note="1 selection"',
  'Lotus Leshy':
    'Section=ability ' +
    'Note="Can walk at %{speed//2}\' Speed across still liquids and Balance to move across flowing water"',
  'Plant Nourishment':'Section=feature Note="Gains nourishment from nature"',
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
  'Vine Leshy':
    'Section=skill ' +
    'Note="Can Climb with both hands occupied, and successes to Climb are critical successes"',

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
  'Ritual Reversion':
    'Action=2 ' +
    'Section=magic ' +
    'Note="Transforms self into a normal plant with AC 20 for 8 hours"',
  'Speak With Kindred':
    'Section=skill ' +
    'Note="Can speak with plants and fungi and gains +2 Diplomacy with plants or fungi of the same kind as self"',
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
  // Darkvision as above
  'Deep Orc':
    'Section=feature ' +
    'Note="Has the Combat Climber and Terrain Expertise (Underground) features"',
  'Grave Orc':
    'Section=save ' +
    'Note="Has resistance %{level//2>?1} to void damage/+1 vs. death and void effects"',
  'Hold-Scarred Orc':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 Hit Points",' +
      '"Has the Diehard feature"',
  'Orc Heritage':'Section=feature Note="1 selection"',
  'Rainfall Orc':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. disease",' +
      '"+2 Athletics to Climb or Swim"',
  'Winter Orc':
    'Section=save,skill ' +
    'Note=' +
      '"Treats environmental cold as 1 step less extreme",' +
      '"Skill Trained (Survival)"',

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
      '"Has access to uncommon orc weapons%{level>=5?\'/Critical hits with an orc weapon, falchion, or greataxe inflict its critical specialization effect\':\'\'}"',
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

  'Versatile Heritage':'Section=feature Note="1 selection"',

  'Changeling':
    'Section=feature,feature ' +
    'Note=' +
      // TODO or Darkvision
      '"Has the Low-Light Vision feature",' +
      '"Has the changeling trait and may take changeling ancestry feats"',
  'Brine May':
    'Section=skill ' +
    'Note="Successful Swim checks are critical successes, and failure does not inflict sinking"',
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
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Hag Lore) feature",' +
      '"Skill Trained (Deception; Occultism)"',
  'Hag Claws':'Section=combat Note="Claws inflict 1d4 HP slashing"',
  "Hag's Sight":'Section=feature Note="Has the Darkvision feature"',
  'Called':
    'Section=save ' +
    'Note="+1 vs. mental effects, and successes vs. control are critical successes"',
  'Mist Child':
    'Section=combat ' +
    'Note="Increases the flat check DC to target self when concealed or hidden to 6 or 12"',
  'Accursed Claws':
    'Section=combat ' +
    'Note="Critical hits with claws also inflict 1d4 HP persistent mental"',
  'Occult Resistance':'Section=save Note="+1 vs. occult effects"',
  'Hag Magic':
    'Section=magic ' +
    'Note="Can cast a chosen spell up to 4th rank as an occult innate spell once per day"',

  'Angelkin':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Multilingual feature",' +
      '"Skill Trained (Society)/Knows the Empyrean language"',
  'Grimspawn':
    'Section=feature Note="Has the Diehard feature"',
  'Hellspawn':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Lie To Me feature",' +
      '"Skill Trained (Deception; Legal Lore)"',
  'Lawbringer':
    'Section=save ' +
    'Note="+1 vs. emotion effects, and successes vs. emotion effects are critical successes"',
  'Musetouched':
    'Section=combat ' +
    'Note="+1 on Escape attempts, critical Escape failures are normal failure, and successes to Escape are critical successes"',
  'Pitborn':
    'Section=skill ' +
    // TODO randomizeOneAttribute won't process this extra feat properly
    'Note="Skill Trained (Athletics)/+1 Skill Feat (Athletics-based)"',

  'Nephilim':
    'Section=feature,feature ' +
    'Note=' +
      // or Darkvision
      '"Has the Low-Light Vision feature",' +
      '"Has the nephilim trait and may take nephilim ancestry feats"',
  'Bestial Manifestation (Claw)':
    'Section=combat Note="Claws inflict 1d4 HP slashing"',
  'Bestial Manifestation (Hoof)':
    'Section=combat Note="Hoof inflicts 1d6 HP bludgeoning"',
  'Bestial Manifestation (Jaws)':
    'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Bestial Manifestation (Tail)':
    'Section=combat Note="Tail inflicts 1d4 HP bludgeoning"',
  'Halo':
    'Section=feature Note="Can evoke a halo that lights a 20\' radius"',
  'Nephilim Eyes':
    'Section=feature Note="Has the Darkvision feature"',
  'Nephilim Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Choose 1 from any Planar Lore)",' +
      '"Skill Trained (Choose 1 from Diplomacy, Intimidation; Religion)"',
  'Nimble Hooves':'Section=ability Note="+5 Speed"',
  'Blessed Blood':
    'Section=combat,skill ' +
    'Note=' +
      '"Blood inflicts 1d6 HP spirit on an attacker that inflicts unarmed slashing or piercing damage",' +
      '"+4 Craft to create <i>holy water</i> using own blood"',
  'Extraplanar Supplication (Bane)':
    'Section=magic ' +
    'Note="Knows the Bane divine innate spell; can cast it once per day at 1st rank"',
  'Extraplanar Supplication (Bless)':
    'Section=magic ' +
    'Note="Knows the Bless divine innate spell; can cast it once per day at 1st rank"',
  'Nephilim Resistance':
    'Section=save Note="Has resistance 5 to choice of energy"',
  'Scion Of Many Planes':
    'Section=feature Note="+1 Ancestry Feat (Nephilim lineage)"',
  'Skillful Tail':
    'Section=feature Note="Can use tail for simple Interact actions"',
  'Celestial Magic':
    'Section=magic ' +
    'Note="Knows choice of two 2nd-rank divine innate spells; can cast each once per day"',
  'Divine Countermeasures':'Section=save Note="+1 vs. divine effects"',
  'Divine Wings':
    'Action=2 ' +
    'Section=ability ' +
    'Note="Brings forth wings that give %{speed}\' fly Speed for 10 min"',
  'Fiendish Magic':
    'Section=magic ' +
    'Note="Knows choice of two 2nd-rank divine innate spells; can cast each once per day"',
  'Celestial Mercy':
    'Section=magic ' +
    'Note="Knows the Cleanse Affliction divine innate spell; can cast it twice per day at 4th rank"',
  'Slip Sideways':
    'Section=magic ' +
    'Note="Knows the Translocate divine innate spell; can cast it twice per day at 5th rank"',
  'Summon Nephilim Kin':
    'Section=magic ' +
    'Note="Can cast a summoning spell to call divine allies as a 5th-rank divine innate spell once per day"',
  'Divine Declaration':
    'Section=magic ' +
    'Note="Knows the Divine Decree divine innate spell; can cast it once per day at 7th rank"',
  'Eternal Wings':
    'Section=ability Note="Wings give continuous %{speed}\' fly Speed"',

  'Aiuvarin':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Low-Light Vision feature",' +
      '"Has the elf and aiuvarin traits and may take elf and aiuvarin ancestry feats"',
  'Earned Glory':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Impressive Performance feature",' +
      '"Skill Trained (Performance)"',
  'Elf Atavism':Pathfinder2E.FEATURES['Elf Atavism'],
  'Inspire Imitation':Pathfinder2E.FEATURES['Inspire Imitation'],
  'Supernatural Charm':Pathfinder2E.FEATURES['Supernatural Charm'],

  'Dromaar':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Low-Light Vision feature",' +
      '"Has the orc and dromaar traits and may take orc and dromaar ancestry feats"',
  'Monstrous Peacemaker':Pathfinder2E.FEATURES['Monstrous Peacemaker'],
  'Orc Sight':Pathfinder2E.FEATURES['Orc Sight'],

  // Core 2

  'Catfolk Heritage':'Section=feature Note="1 selection"',
  'Clawed Catfolk':'Section=combat Note="Claws inflict 1d6 HP slashing"',
  'Hunting Catfolk':
    'Section=skill Note="Has 30\' imprecise scent/+2 to Track familiar scents"',
  'Jungle Catfolk':
    'Section=ability ' +
    'Note="Moves normally through undergrowth difficult terrain, and through greater difficult terrain as difficult terrain"',
  'Land On Your Feet':
    'Section=save Note="Takes half damage from falls and does not land prone"',
  'Liminal Catfolk':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows the Detect Magic occult innate cantrip; can cast it at will",' +
      '"+1 Occultism to Recall Knowledge about extraplanar creatures"',
  // Low-Light Vision as above
  'Nine Lives Catfolk':
    'Section=feature,save ' +
    'Note=' +
      '"Has the Diehard feature",' +
      '"Dying value does not affect recovery DC"',
  'Sharp-Eared Catfolk':
    'Section=skill ' +
    'Note="+2 to Seek creatures that can be heard within 30\', and can Point Out a heard creature as a free action once per rd"',
  'Winter Catfolk':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1} and treats environmental cold as 1 step less extreme"',

  'Cat Nap':
    'Section=combat ' +
    'Note="10 min sleep gives %{level} temporary Hit Points once per hour"',
  "Cat's Luck":
    'Action=Free ' +
    'Section=save ' +
    'Note="Rerolls a failed Reflex save once per %{combatNotes.reliableLuck?\'hour\':\'day\'}"',
  'Catfolk Dance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Acrobatics vs. Reflex inflicts -2 Reflex on an adjacent target for 1 rd, or -2 Reflex and off-guard on a critical success"',
  'Catfolk Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Cat Lore) feature",' +
      '"Skill Trained (Acrobatics; Survival)"',
  'Catfolk Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Catfolk Weapons; Kama; Kukri; Scimitar; Sickle)",' +
      '"Has access to uncommon catfolk weapons%{level>=5?\'/Critical hits with a catfolk weapon, kama, kukri, scimitar or sickle inflict its critical specialization effect\':\'\'}"',
  'Saber Teeth':'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Well-Met Traveler':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Hobnobber feature",' +
      '"Skill Trained (Diplomacy)"',
  'Climbing Claws':'Section=ability Note="Has a 10\' climb Speed"',
  'Graceful Guidance':
    'Section=skill ' +
    'Note="Can use an Aid Reaction to give an ally a bonus on a Reflex save"',
  'Light Paws':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Takes a Stride and a Step, ignoring difficult terrain"',
  'Lucky Break':
    'Section=save ' +
    'Note="Can use Cat\'s Luck for a Fortitude save, Acrobatics check, or Athletics check"',
  'Pride Hunter':
    'Section=skill Note="Can use lesser cover from allies to Hide"',
  'Springing Leaper':
    'Section=skill ' +
    'Note="Can use 2 or 3 actions to double or triple vertical Leap distance, and can include a change of direction in a Long Jump"',
  'Well-Groomed':
    'Section=save ' +
    'Note="+2 vs. disease, and successes vs. disease are critical successes"',
  'Aggravating Scratch':
    'Section=combat ' +
    'Note="Claws also inflict 1d4 HP persistent poison on a critical hit"',
  'Evade Doom':
    'Section=save ' +
    'Note="Successful DC 17 flat check negates acquiring the doomed condition"',
  'Luck Of The Clowder':
    'Section=save Note="Cat\'s Luck also gives targets within 10\' a reroll"',
  "Predator's Growl":
    'Action=Reaction ' +
    'Section=skill Note="Attempts to Demoralize an uncovered creature"',
  'Silent Step':'Action=1 Section=combat Note="Hides or Sneaks after a Step"',
  'Wary Skulker':
    'Section=skill Note="Can Scout and Avoid Notice simultaneously"',
  'Black Cat Curse':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R30\' Forces reroll of a successful save once per day"',
  'Caterwaul':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives 1 HP and a wounded increase to an ally reduced to 0 HP"',
  'Elude Trouble':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Strides up to %{speed}\' in response to a missed melee attack"',
  'Reliable Luck':'Section=save Note="Increased Cat\'s Luck effects"',
  'Ten Lives':
    'Section=combat ' +
    'Note="Successful DC 17 flat check upon dying instead inflicts 0 HP and dying 3"',

  // Darkvision as above
  'Elfbane Hobgoblin':'Section=feature Note="Has the Resist Elf Magic feature"',
  'Hobgoblin Heritage':'Section=feature Note="1 selection"',
  'Resist Elf Magic':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="+1 vs. triggering magical effect, or +2 vs. an arcane effect"',
  'Runtboss Hobgoblins':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Group Coercion feature",' +
      '"Successes on Coercion checks vs. goblins are critical successes and critical failure are normal failures"',
  'Shortshanks Hobgoblin':
    'Section=ability,feature ' +
    'Note=' +
      '"Not off-guard during Climb",' +
      '"Has the Ride feature"',
  'Smokeworker Hobgoblin':
    'Section=save,skill ' +
    'Note=' +
      '"Can automatically target smoke-concealed creatures",' +
      '"Has fire resistance %{level//2>?1}"',
  'Warmarch Hobgoblin':
    'Section=skill ' +
    'Note="Normal failures to Subsist in wilderness allow eating/Can Hustle twice as long as normal when exploring"',
  'Warrenbred Hobgoblin':
    'Section=skill ' +
    'Note="Successes on Acrobatics to Squeeze are critical successes/Reduces flat check to attack a concealed or hidden target to 3 or 9"',

  'Alchemical Scholar':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Alchemical Crafting feature",' +
      '"Knows +%{level} alchemical formulas"',
  'Cantorian Reinforcement':
    'Section=save ' +
    'Note="Successes vs. disease or poison are critical successes"',
  'Hobgoblin Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Hobgoblin Lore) feature",' +
      '"Skill Trained (Athletics; Crafting)"',
  'Hobgoblin Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Hobgoblin Weapons; Composite Longbow; Composite Shortbow; Glaive; Longbow; Longsword; Shortbow)",' +
      '"Has access to uncommon hobgoblin weapons%{level>=5?\'/Critical hits with a hobgoblin weapon, composite longbow, composite shortbow, glaive, longbow, longsword, or shortbow inflict its critical specialization effect\':\'\'}"',
  'Leech-Clip':
    'Section=combat ' +
    'Note="Hits with flails inflict -10\' Speed, or -15\' Speed on a critical hit, for 1 rd"',
  'Remorseless Lash':
    'Section=combat ' +
    'Note="Melee hits inflict no reduction of frightened condition for 1 rd"',
  'Sneaky':'Section=skill Note="+5 Sneak speed, and can Sneak between cover"',
  'Stone Face':'Section=save Note="+1 vs. fear; +2 Will DC vs. Intimidation"',
  'Vigorous Health':
    'Section=save ' +
    'Note="Successful DC 17 flat check negates gaining the drained condition"',
  'Agonizing Rebuke':
    'Section=skill ' +
    'Note="Successful Demoralize inflicts %{rank.Intimidation<3?1:rank.Intimidation<4?2:3}d4 mental each rd for 1 min or until moving 30\' away"',
  'Expert Drill Sergeant':
    'Section=skill ' +
    'Note="Following An Expert while exploring gives allies a +2, +3, or +4 bonus on skills with trained, expert, or master proficiency"',
  'Recognize Ambush':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Draws a weapon during initiative"',
  'Runtsage':'Section=feature Note="Has the Adopted Ancestry (Goblin) feature"',
  'Cantorian Rejuvenation':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Recovers %{level<15?4:6}d6 HP and gains %{level<15?10:15} temporary HP for 1 min once per day"',
  'Fell Rider':
    'Section=feature ' +
    'Note="Animal companion is trained in Intimidation and can give Aid on Demoralize attempts"',
  'Pride In Arms':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives 30 temporary HP for 1 rd to an ally that brings a foe to 0 HP"',
  'Squad Tactics':
    'Section=combat ' +
    'Note="Adjacent foes within reach of two allies are off-guard to self"',
  "Can't Fall Here":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Adjacent willing ally reduced to 0 Hit Point retains 1 Hit Point and gains %{level} temporary Hit Points and a wounded level for 1 min once per day"',
  'War Conditioning (Climb)':'Section=ability Note="Has a 20\' climb Speed"',
  'War Conditioning (Swim)':'Section=ability Note="Has a 20\' swim Speed"',
  'Cantorian Restoration':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R60\' Restores 6d6+%{constitutionModifier} Hit Points to a dying creature once per day"',
  'Rallying Cry':
    'Action=2 ' +
    'Section=combat ' +
    'Note="30\' emanation gives alies %{level} temporary Hit Points and an additional Step, Stride, or Strike each rd for 1 min"',

  'Ant Kholo':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"+1 initiative when using Deception",' +
      '"Has the Small feature",' +
      '"Skill Trained (Deception)",' +
      '"+1 Deception to claim innocence and against Sense Motive to notice innocence lies"',
  'Bite':'Section=combat Note="Jaws inflict 1d6 HP P"',
  'Cave Kholo':'Section=feature Note="Has the Darkvision feature"',
  'Dog Kholo':'Section=ability Note="30\' Speed on all fours"',
  'Great Kholo':
    'Section=combat,combat ' +
    'Note=' +
      '"+2 Hit Points",' +
      '"+1 Athletics to Reposition, Shove, or Trip"',
  'Kholo Heritage':'Section=feature Note="1 selection"',
  // Low-light vision as above
  'Sweetbreath Kholo':
     'Section=skill,skill ' +
     'Note=' +
       '"Skill Trained (Diplomacy)",' +
       '"+%{skillNotes.breathLikeHoney?2:1} checks to Make An Impression when breath can be smelled"',
  'Winter Kholo':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1} and treats environmental cold as 1 step less extreme"',
  'Witch Kholo':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows the Figment occult innate cantrip; can cast it at will",' +
      '"+1 to Make An Impression or Impersonate using voice"',

  'Ask The Bones':
    'Action=Free ' +
    'Section=skill ' +
    'Note="Attempts a Recall Knowledge once per day; gains +1 if possessed bones are from a creature with knowledge of topic"',
  'Crunch':
    'Section=combat Note="Jaws inflict 1d8 HP and have the grapple trait"',
  'Hyena Familiar':'Section=feature Note="Has the Familiar feature"',
  'Kholo Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Kholo Lore) feature",' +
      '"Skill Trained (Stealth; Survival)"',
  'Kholo Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Kholo Weapons; Flail; Khopesh; Mambele; War Flail)",' +
      '"Has access to uncommon kholo weapons%{level>=5?\'/Critical hits with a kholo weapon, flail, khopesh, khopesh, mambele, or war flail inflict its critical specialization effect\':\'\'}"',
  'Pack Hunter':
    'Section=skill Note="+2 Aid and +2 allies\' checks to Aid self"',
  'Sensitive Nose':'Section=skill Note="Has 30\' imprecise scent"',
  'Absorb Strength':
    'Action=1 ' +
    'Section=feature ' +
    'Note="Consuming a piece of a foe\'s fresh corpse gives temporary Hit Points equal to the foe\'s level for 1 min"',
  'Distant Cackle':
    'Section=magic ' +
    'Note="Knows the Ventriloquism occult innate spell; can cast it once per day at rank 1"',
  'Pack Stalker':
    'Section=combat,feature ' +
    'Note=' +
      '"Can extend Terrain Stalker effects to %{rank.Stealth<3?\'an ally\':rank.Stealth<4\'2 allies\':\'3 allies\'} within 10\'",' +
      '"Has the Terrain Stalker feature"',
  'Rabid Sprint':'Action=2 Section=combat Note="Strides three times"',
  'Affliction Resistance':
    'Section=save ' +
    'Note="+1 vs. disease and poison, and successes vs. disease and poison are critical successes"',
  'Left-Hand Blood':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Suffers 1 HP slashing to enhance a weapon to inflict 1d4 HP persistent poison on next hit before the end of the next turn"',
  'Right-Hand Blood':
    'Section=skill ' +
    'Note="Can suffer 1 HP slashing to gain +1 on Administer First Aid or 2d8 HP slashing to gain +1 on Treat Disease or Treat Wounds"',
  'Ambush Hunter':
    'Section=skill Note="Can perform Scout and Avoid Notice simultaneously"',
  'Breath Like Honey':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows the Enthrall occult innate spell; can cast it once a day with a range of 30\'",' +
      '"Has increased Sweetbreath Kholo effects"',
  "Grandmother's Wisdom":
    'Section=magic ' +
    'Note="Knows the Augury occult innate spell; can cast it twice a day at 2nd rank"',
  'Laughing Kholo':'Section=feature Note="Has the Battle Cry feature"',
  "Ancestor's Rage":
    'Section=magic ' +
    'Note="Knows the Animal Form occult innate spell; can cast it at 5th rank once per day to become a canine"',
  "Bonekeeper's Bane":
    'Section=combat ' +
    'Note="Adjacent foes suffer -1 attacks and skill checks once per foe per day (<b>save Will</b> vs. higher of class or spell DC negates)"',
  'First To Strike, First To Fall':
    'Section=feature ' +
    'Note="TODO"',
  'Impaling Bone':
    'Section=magic ' +
    'Note="Knows the Impaling Spike occult innate spell; can cast it once per day at 7th rank to affect corporeal or incorporeal targets"',
  'Legendary Laugh':
    'Section=feature,skill ' +
    'Note=' +
      '"Can Demoralize within 60\'",' +
      '"Successful Demoralize inflicts 3d6 HP mental, or 6d8 HP on a critical success"',

  'Cavernstalker Kobold':
    'Section=skill ' +
    'Note="Can Climb at %{speed//2}\' on a success, or %{speed}\' on a critical success/Successes on Acrobatics to Squeeze are critical successes"',
  // Darkvision as above
  'Dragonscaled Kobold':
    'Section=combat,save ' +
    'Note=' +
      '"+4 Hit Points",' +
      '"+1 vs. dragon breath, sleep, and paralysis"',
  'Elementheart Kobold':
    'Section=save ' +
    'Note="+1 vs. choice of cold, electricity, fire, sonic, acid, or poison"',
  'Kobold Heritage':'Section=feature Note="1 selection"',
  'Spellhorn Kobold':
    'Section=magic ' +
    'Note="Can cast a chosen cantrip as an arcane innate spell at will"',
  'Strongjaw Kobold':'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Tunnelflood Kobold':'Section=ability Note="Has a 15\' swim Speed"',
  'Venomtail Kobold':
    'Section=combat Note="Can enhance a piercing or slashing weapon to inflict %{level} HP persistent poison on next hit before the end of the next turn once per day"',

  'Cringe':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Lowers the damage of a foe\'s critical hit by %{level+2} once per foe per day"',
  "Dragon's Presence":
    'Section=save,skill ' +
    'Note=' +
      '"Successes vs. fear are critical successes, and failures vs. fear are critical failures",' +
      '"+1 Intimidation to Demoralize a foe of equal or lesser level"',
  'Kobold Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Kobold Lore) feature",' +
      '"Skill Trained (Stealth; Thievery)"',
  'Kobold Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Kobold Weapons; Greatpick; Light Pick; Pick)",' +
      '"Has access to uncommon kobold weapons%{level>=5?\'/Critical hits with a kobold weapon, greatpick, light pick, or pick inflict its critical specialization effect\':\'\'}"',
  'Scamper':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strides up to %{speed+5}\' feet away from a foe, gaining +2 Armor Class against triggered reactions"',
  'Snare Setter':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Snare Crafting feature",' +
      '"Skill Trained (Crafting)",' +
      '"Has access to uncommon kobold snares"',
  "Ally's Shelter":
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Uses an adjacent ally\'s modifier for the triggering save once per day"',
  'Grovel':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a Feint vs. Will against a foe within 30\' to reduce its threat perception"',
  'Snare Genius':
    'Section=skill ' +
    'Note="Can Craft snares in 3 actions instead of 1 min and prepare %{rank.Crafting<3?3:rank.Crafting<4?4:5} snares for quick deployment during daily prep/Snares inflict off-guard for 1 rd on critical failure"',
  'Winglets':
    'Section=skill ' +
    'Note="Gains +5\' horizontal Leap and 10\' Long Jump distances and can High Jump and Long Jump without a Stride"',
  'Between The Scales':
    'Section=combat ' +
    'Note="Agile and finesse melee weapons and unarmed attacks vs. an off-guard creature have the backstabber trait"',
  'Briar Battler':
    'Section=combat ' +
    'Note="Can Take Cover in any environmental difficult terrain"',
  'Close Quarters':
    'Section=combat ' +
    'Note="Can end movement in the same square as a Small or smaller ally"',
  'Evolved Spellhorn':
    'Section=magic ' +
    'Note="Can cast a chosen 1st-rank and a chosen 2nd-rank arcane spell as arcane innate spells once each per day"',
  'Fleeing Shriek':
    'Action=2 ' +
    'Section=combat ' +
    'Note="10\' emanation inflicts %{(level-3)//2}d6 HP sonic (<b>save basic Fortitude</b>), and a subsequent Stride triggers no reactions from any creature that failed to save, once per hour"',
  'Winglet Flight':'Section=ability Note="Can Fly 20\' once per rd"',
  'Resplendent Spellhorn':
    'Section=magic ' +
    'Note="Can cast a chosen 3rd-rank and a chosen 4th-rank arcane spell as arcane innate spells once each per day"',
  'Tumbling Diversion':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Tumble Through a foe\'s space allows subsequent +1 Create A Diversion attempt, or +2 on a critical success to make self hidden to that foe"',
  'Vicious Snares':
    'Section=skill Note="Snakes inflict +%{rank.Crafting<4?1:2}d6 precision"',
  "Benefactor's Majesty":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives self %{level} temporary Hit Points for 1 min and a flat check to remove persistent damage, and requires foes to make a DC 11 flat check to attack self for 1 rd"',

  'Aquatic Adaptation':'Section=feature Note="Has the Breath Control feature"',
  'Claws':'Section=combat Note="Claws inflict 1d4 HP slashing"',
  'Cliffscale Lizardfolk':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Combat Climber feature",' +
      '"Can use bare feet to Climb, and successes on Athletics to Climb are critical successes"',
  'Cloudleaper Lizardfolk':
    'Section=save Note="Can use limbs to negate falling damage"',
  'Frilled Lizardfolk':
    'Section=feature Note="Has the Threatening Approach feature"',
  'Lizardfolk Heritage':'Section=feature Note="1 selection"',
  'Sandstrider Lizardfolk':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1}, treats environmental heat as 1 step less extreme but environmental cold as 1 step more extreme without protection, and can last 10x normal without food and water"',
  'Threatening Approach':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Stride adjacent to foe followed by a successful Demoralize inflicts frightened 2"',
  'Unseen Lizardfolk':
    'Section=skill ' +
    'Note="+2 Stealth in environments of similar color as self"',
  'Wetlander Lizardfolk':'Section=ability Note="Has a 15\' swim Speed"',
  'Woodstalker Lizardfolk':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Terrain Stalker (Underbrush) feature",' +
      '"Can always Take Cover in forest or jungle"',

  'Bone Magic':
    'Section=magic ' +
    'Note="Can cast a chosen occult or primal cantrip as an innate spell at will"',
  'Iruxi Armaments (Claws)':
    'Section=combat,combat ' +
    'Note=' +
      '"Claws inflict 1d6 HP slashing or piercing",' +
      '"Critical hits with claws inflict its critical specialization effect"',
  'Iruxi Armaments (Fangs)':
    'Section=combat,combat ' +
    'Note=' +
      '"Fangs inflict 1d8 HP piercing",' +
      '"Critical hits with fangs inflict its critical specialization effect"',
  'Iruxi Armaments (Tail)':
    'Section=combat,combat ' +
    'Note=' +
      '"Tail inflicts 1d6 HP bludgeoning",' +
      '"Critical hits with tail inflict its critical specialization effect"',
  'Lizardfolk Lore':
    'Section=feature,skill ' +
    'Note=' +
      // TODO randomizing
      '"+1 Skill Feat (Astrology Lore or Lizardfolk Lore)",' +
      '"Skill Trained (Survival; Choose 1 from Nature, Occultism)"',
  'Marsh Runner':
    'Section=combat,skill ' +
   'Note=' +
     '"Can Step in difficult terrain caused by flooding, swamps, and quicksand",' +
     '"Using Acrobatics to Balance on narrow surfaces or marshy ground does not inflict off-guard, and successes are critical successes"',
  'Parthenogenic Hatchling':
    'Section=save ' +
    'Note="+1 vs. disease, and successes vs. disease are critical successes/Takes damage from thirst every 2 hours and from starvation every 2 days"',
  'Reptile Speaker':'Section=skill Note="Can converse with reptiles"',
  'Envenom Fangs':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Enhances fangs to inflict +1d6 HP persistent poison on next hit before the end of the next turn"',
  'Flexible Tail':
    'Section=feature Note="Can use tail to perform simple Interact actions"',
  "Gecko's Grip":
    'Section=ability,feature,skill ' +
    'Note=' +
      '"Has a 15\' climb Speed",' +
      '"Has the Combat Climber feat",' +
      '"Successes on Athletics to climb are critical successes"',
  'Shed Tail':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Can release tail to escape being grabbed and then Stride without triggering reactions from grabbing foe; regrowth takes 1 day and inflicts -2 Balance"',
  'Swift Swimmer':
    'Section=ability ' +
    'Note="Has a %{abilityNotes.wetlanderLizardfolk?25:15}\' swim Speed"',
  'Dangle':
    'Section=feature Note="Can use limbs freely while hanging from tail"',
  'Hone Claws':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Enhances claws to inflict +1d6 HP bleed damage on next hit"',
  'Terrain Advantage':
    'Section=combat ' +
    'Note="Non-lizardfolk foes in difficult terrain or in water without a swim Speed are off-guard to self"',
  'Bone Investiture':
    'Section=magic ' +
    // TODO or occult
    'Note="Knows the Dinosaur Form primal innate spell; can cast it at 5th rank once per day"',
  'Iruxi Spirit Strike':
    'Section=combat ' +
    'Note="Lizardfolk ancestry attacks have the <i>ghost touch</i> property"',
  'Primal Rampage':
    'Section=magic ' +
    'Note="Knows the Unfettered Movement and Mountain Resilience primal innate spells; can each once per day or use 3 actions to cast both simultaneously"',
  'Fossil Rider':
    'Section=magic ' +
    'Note="Knows the Mask Of Terror primal innate spell; can cast it once per day"',
  'Scion Transformation':
    'Section=feature ' +
    'Note="Can use a 24-hour hibernation to gain effects of <i>Enlarge</i> and +%{level} Hit Points permanently"',

  // Low-Light Vision as above
  'Sharp Teeth':'Section=combat Note="Jaws inflict 1d4 HP piercing"',
  'Deep Rat':'Section=feature Note="Has the Darkvision feature"',
  'Desert Rat':
    'Section=ability,save ' +
    'Note=' +
      '"30\' Speed on all fours",' +
      '"Treats environmental heat as 1 step less extreme but environmental cold as 1 step more extreme without protection, and can last 10x normal without food and water"',
  'Longsnout Rat':
    'Section=skill ' +
    'Note="Has 30\' imprecise scent/+2 Perception to Seek using scent"',
  'Ratfolk Heritage':'Section=feature Note="1 selection"',
  'Sewer Rat':
     'Section=save ' +
     'Note="+1 vs. disease and poison, and successes vs. disease and poison are critical successes"',
  'Shadow Rat':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Intimidation)",' +
      '"Can use Intimidation to Coerce animals/Suffers no Demoralize penalty for lacking a shared language/Suffers 1 step worse on initial animal attitudes"',
  'Snow Rat':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1}, and treats environmental cold as 1 step less extreme"',
  'Tunnel Rat':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Quick Squeeze feature",' +
      '"Can move normally through snug spaces"',

  'Cheek Pouches':
    'Section=feature Note="Can store %{featureNotes.bigMouth?\'1 Bulk of items\':\'4 items of light Bulk\'} in cheeks"',
  'Pack Rat':'Section=feature Note="Can store 50% extra in containers"',
  'Rat Familiar':'Section=feature Note="Has the Familiar feature"',
  'Ratfolk Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Ratfolk Lore) feature",' +
      '"Skill Trained (Acrobatics; Stealth)"',
  'Ratspeak':'Section=feature Note="Can speak with rodents"',
  'Tinkering Fingers':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Crafting)",' +
      '"Suffers no penalty when Repairing an item without a toolkit, and gains +1 with a toolkit"',
  'Vicious Incisors':'Section=combat Note="Jaws include 1d6 HP piercing"',
  'Warren Navigator':
    'Section=save,skill,skill ' +
    'Note=' +
      '"Improves saves vs. <i>Quandry</i> by 1 degree",' +
      '"Skill Trained (Survival)",' +
      '"Improves Sense Direction test by 1 degree, and suffers no penalty from having no compass"',
  'Cornered Fury':
    'Section=combat ' +
    'Note="Critical hit by a larger foe leaves it off-guard to self for 1 rd"',
  'Lab Rat':
     'Section=save ' +
     'Note="+1 vs. disease and poison, and successes vs. disease and poison are critical successes"',
  'Quick Stow':
    'Action=Free Section=combat Note="Stows an item in cheek pouches"',
  'Rat Magic':
    'Section=magic ' +
    'Note="Knows the Animal Messenger primal innate spell; can cast it once per day"',
  'Ratfolk Roll':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Rolls %{speed*4}\' down an incline; after the 1st rd, suffers slowed 2 and suffers and inflcits 4d6 HP bludgeoning if stopped by an obstacle"',
  'Big Mouth':'Section=feature Note="Has increased Cheek Pouches effects"',
  'Overcrowd':
    'Section=combat ' +
    'Note="Can end movement in the same square as %{features.Shinstabber?\'an\':\'a Small or smaller\'} ally"',
  'Rat Form':'Action=1 Section=magic Note="Becomes a Tiny rat"',
  'Uncanny Cheeks':
    'Section=feature ' +
    'Note="Has the Precient Consumable and Prescient Planner features"',
  'Shinstabber':'Section=combat Note="Has increased Overcrowd effects"',
  'Skittering Sneak':'Section=skill Note="Can Sneak at full Speed"',
  'Warren Digger':'Section=ability Note="Has a 15\' burrow Speed"',
  'Call The Swarm':
    'Action=3 ' +
    'Section=magic ' +
    'Note="R120\' Rats swarming a 30\' burst inflict 6d8 HP piercing and difficult terrain to foes"',
  'Greater Than The Sum':
    'Section=magic ' +
    'Note="Knows the Enlarge primal innate spell; can cast it at 6th rank once per day"',

  // Low-Light Vision as above
  'Sharp Beak':'Section=combat Note="Beak inflicts 1d6 HP piercing"',
  'Dogtooth Tengu':'Section=combat Note="Beak has deadly d8 trait"',
  'Jinxed Tengu':
    'Section=save ' +
    'Note="Successful saves vs. curses are critical successes, and a successful DC 17 flat check reduces a doomed condition by 1"',
  'Mountainkeeper Tengu':
    'Section=magic,magic ' +
    'Note=' +
      '"Knows the Vitality Lash primal innate cantrip; can cast it at will",' +
      '"Can cast tengu-acquired spells as divine or primal spells"',
  'Skyborn Tengu':'Section=save Note="Takes no damage from falls"',
  'Stormtossed Tengu':
    'Section=combat,save ' +
    'Note=' +
      '"Ignores target concealment from rain or fog",' +
      '"Has resistance %{level//2>?1} to electricity"',
  'Taloned Tengu':'Section=combat Note="Talons inflict 1d4 HP slashing"',
  'Tengu Heritage':'Section=feature Note="1 selection"',
  'Wavediver Tengu':'Section=ability Note="Has a 15\' swim Speed"',

  "Mariner's Fire":
    'Section=magic ' +
    'Note="Knows the Ignition primal innate cantrip; can cast it at will"',
  'One-Toed Hop':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a vertical Leap without triggering reactions"',
  "Scavenger's Search":
    'Section=skill Note="+2 Seek to locate objects within 30\'"',
  'Squawk!':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Triggering critical failure on Deception, Diplomacy, or Intimidation with a non-tengu target is a normal failure once per target per day"',
  "Storm's Lash":
    'Section=magic ' +
    'Note="Knows the Electric Arc primal innate cantrip; can cast it at will"',
  'Tengu Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Tengu Lore) feature",' +
      '"Skill Trained (Society; Survival)"',
  'Tengu Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Tengu Weapons; Katana; Khakkara; Temple Sword; Wakizashi)",' +
      '"Can gain familiarity with a possessed sword during daily prep/Has access to uncommon tengu weapons%{level>=5?\'/Critical hits with a tengu weapon, katana, khakkara, temple sword, or wakizashi inflict its critical specialization effect\':\'\'}"',
  'Uncanny Agility':
    'Section=ability,feature ' +
    'Note=' +
      '"Can Step into difficult terrain caused by uneven ground",' +
      '"Has the Stead Balance feature"',
  'Eat Fortune':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R60\' Counteracts a fortune or misfortune effects once per %{combatNotes.jinxGlutton?\'hour\':\'day\'}"',
  'Long-Nosed Form':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Becomes a human with tengu-like features"',
  'Magpie Snatch':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Picks up an object while Striding twice"',
  'Soaring Flight':'Action=1 Section=combat Note="Flies 20\' once per rd"',
  'Tengu Feather Fan':
    'Section=magic,magic ' +
    'Note=' +
      '"Knows the Gust Of Wind primal spell",' +
      '"Can cast a spell using a feather fan %V time per day"',
  'Soaring Form':'Section=ability Note="Has a 20\' fly Speed"',
  "Wind God's Fan":
    'Section=magic ' +
    'Note="Knows the Wall Of Wind primal spell; can cast it using feather fan at 3rd rank/+1 feather fan use per day"',
  "Harbinger's Claw":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R60\' Inflicts the worse of two rolls on the triggering attack or skill check"',
  'Jinx Glutton':'Section=combat Note="Has increased Eat Fortune effects"',
  "Thunder God's Fan":
    'Section=magic ' +
    'Note="Knows the Lightning Bolt primal spell; can cast it using feather fan at 5th rank/+1 feather fan use per day"',
  'Great Tengu Form':
    'Section=magic ' +
    'Note="Gains the benefits of 5 min <i>Enlarge</i> and <i>Fly</i> while in Long-Nosed form"',
  'Trickster Tengu':
    'Section=magic ' +
    'Note="Knows the Aerial Form and Cursed Metamorphosis primal innate spells; can cast one of the once per day at 7th rank"',

  // Low-Light Vision as above
  'Natural Climber':'Section=skill Note="+2 Athletics to Climb"',
  'Tripkee Heritage':'Section=feature Note="1 selection"',
  'Poisonhide Tripkee':
    'Section=combat ' +
    'Note="Can use a reaction once per hour to exude a poison that inflicts %{(level+1)//2}d4 HP poison (<b>save basic Fortitude</b>)"',
  'Riverside Tripkee':'Section=ability Note="Has a 15\' swim Speed"',
  'Snaptongue Tripkee':
    'Section=feature ' +
    'Note="Can use tongue to deliver touch spells and to perform simple Interact actions"',
  'Stickytoe Tripkee':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Fortitude and Reflex DC vs. Disarm, Shove, Reposition, and Trip attempts",' +
      '"Successes on Athletics to Climb foliage are critical successes"',
  'Thickskin Tripkee':
    'Section=combat,save ' +
    'Note=' +
      '"+2 Hit Points",' +
      '"+1 vs. disease and poison"',
  'Windweb Tripkee':'Section=save Note="Takes no damage from falls"',

  'Croak Talker':
    'Section=skill Note="Can converse with frogs and similar creatures"',
  "Hunter's Defense":
    'Action=Reaction ' +
    'Section=feature ' +
    'Note="Can use Nature instead of Armor Class vs. a natural creature once per hour"',
  'Jungle Strider':
    'Section=ability,skill ' +
    'Note=' +
      '"Moves normally through difficult terrain in forests and jungles",' +
      '"Does not suffer off-guard when Balancing on narrow surfaces or unevan ground made of plants, and successes to do so are critical successes"',
  'Nocturnal Tripkee':'Section=feature Note="Has the Darkvision feature"',
  'Terrifying Croak':
    'Action=1 ' +
    'Section=skill ' +
    'Note="R30\' Successful Demoralize using Intimidation prevents reducing frightened below 1 for 1 rd"',
  'Tripkee Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Tripkee Lore) feature",' +
      '"Skill Trained (Nature; Stealth)"',
  'Tripkee Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Tripkee Weapons; Blowgun; Dart; Hatchet; Scythe; Shortbow)",' +
      '"Has access to uncommon tripkee weapons%{level>=5?\'/Critical hits with a tripkee weapon, blowgun, dart, hatchet, scythe, or shortbow inflict its critical specialization effect\':\'\'}"',
  'Fantastic Leaps':
    'Section=skill Note="+5\' vertical and +10\' horizontal Leap distance"',
  'Long Tongue':'Section=feature Note="+5\' reach when using tongue"',
  'Prodigious Climber':
    'Section=ability ' +
    'Note="Has a %{abilityNotes.stickytoeTripkee?20:10}\' climb Speed"',
  'Tenacious Net':
    'Section=skill ' +
    'Note="Nets require a successful DC 18 to Escape and inflict off-guard for 1 rd afterward"',
  'Tripkee Glide':
    'Action=1 ' +
    'Section=ability ' +
    'Note="Can glide 5\' down and 25\' forward each rd"',
  'Vomit Stomach':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Reduces sickened condition 2 and gives a +2 save vs. recently-ingested positions, leaving self off-guard for 1 rd"',
  'Absorb Toxin':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Successful counteract check neutralizes an area disease or poison, requiring a -2 save to avoid effect"',
  'Moisture Bath':
    'Action=1 ' +
    'Section=save ' +
    'Note="Successful DC 10 flat check gives recovery from ongoing persistent file and cold and fire and cold resistance %{level//2} once per day"',
  'Ricocheting Leap':
    'Section=skill ' +
    'Note="Can using Wall Jump to carom off creatures that are larger than self"',
  'Tongue Tether':
    'Section=combat ' +
    'Note="Can use tongue to Disarm, Grab An Edge, Reposition, and Trip"',
  'Envenomed Edge':
    'Section=combat ' +
    'Note="Critical hits that deal slashing or piercing damage inflict +1d4 persistent HP poison"',
  'Hop Up':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Stands after bring unconscious without triggering reactions"',
  'Unbound Leaper':'Section=skill Note="Can Leap 30\' in any directions"',

  'Dhampir':
    'Section=feature,feature ' +
    'Note=' +
      // or Darkvision
      '"Has the Void Healing and Low-Light Vision features",' +
      '"Has the dhampir trait and may take dhampir ancestry feats"',
  'Void Healing':
    'Section=save Note="Vitality damage causes harm and void effects heal"',
  'Straveika':
    'Section=skill Note="+1 Perception to Sense Motive and vs. Lies"',
  'Svetocher':
    'Section=save,skill ' +
    'Note=' +
      '"Lowers drained penalty by 1 for Fortitude save and Hit Point reduction",' +
      '"Skill Trained (Diplomacy)"',
  'Eyes Of The Night':'Section=feature Note="Has the Darkvision feature"',
  'Fangs':'Section=combat Note="Fangs inflict 1d6 HP piercing"',
  'Vampire Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Vampire Lore) feature",' +
      '"Skill Trained (Religion; Society)"',
  'Voice Of The Night':
    'Section=skill ' +
    'Note="Can converse with bats, rats, and wolves, and gains +1 on Make An Impression with them"',
  'Enthralling Allure':
    'Section=magic ' +
    'Note="Knows the Charm divine innate spell; can cast it once a day at rank %{(level+1)//2}"',
  'Necromantic Physiology':
    'Section=save ' +
    'Note="+2 save vs. disease, and successful saves vs. disease are critical successes"',
  'Undead Slayer':
    'Section=combat ' +
    'Note="Inflicts additional damage vs. undead equal to the number of weapon damage dice, or double this vs. vampires"',
  'Bloodletting Fangs':
    'Section=combat ' +
    'Note="Fangs inflict +1d4 HP persistent bleed on a critical hit"',
  'Night Magic':
    'Section=magic ' +
    'Note="Knows the Animal Form and Mist divine innate spells; can cast each (Animal Form wolf only) once per day at 2nd rank"',
  'Form Of The Bat':
    'Section=magic ' +
    'Note="Knows the Pest Form divine innate spell; can cast it (bat only) once per hour"',
  'Symphony Of Blood':
    'Section=magic ' +
    'Note="Knows the Vampiric Exsanguination divine innate spell; can cast it once per day"',

  'Dragonblood':
    'Section=feature,feature,save ' +
    'Note=' +
      '"Has the Draconic Exemplar feature",' +
      '"Has the dragonblood trait and may take Dragonblood ancestry feats",' +
      '"Successes on saves vs. fear are critical successes"',
  'Draconic Exemplar':'Section=feature Note="1 selection"',
  'Arcane Dragonblood':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Arcane Sense feature",' +
      '"Skill Trained (Arcana)"',
  'Divine Dragonblood':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 initiative",' +
      '"Skill Trained (Religion)"',
  'Occult Dragonblood':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Oddity Identification feature",' +
      '"Skill Trained (Occultism)"',
  'Primal Dragonblood':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Nature)",' +
      '"Can use Nature to Sense Direction and Subsist in the wilds"',
  'Breath Of The Dragon':
    'Section=combat ' +
    'Note="Breath inflicts %{(level+1)//2}d%{combatNotes.formidableBreath?6:4} HP %V (<b>save basic %1</b>) in a %{combatNotes.formidableBreath?30:15}\' cone or %{combatNotes.formidableBreath?60:30}\' line once every 1d4 rd"',
  'Draconic Aspect (Claw)':
    'Section=combat Note="Claws inflict 1d4 HP slashing"',
  'Draconic Aspect (Jaws)':
    'Section=feature Note="Jaws inflict 1d6 HP piercing"',
  'Draconic Aspect (Tail)':
    'Section=feature Note="Tail inflicts 1d6 HP bludgeoning"',
  'Draconic Resistance':
    'Section=feature Note="Has resistance %{level//2>?1} to %V"',
  'Draconic Sight':
    // TODO or Darkvision
    'Section=feature Note="Has the Low-Light Vision feature"',
  'Dragon Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Dragon Lore) feature",' +
      '"Skill Trained (Diplomacy; Intimidation)"',
  'Scaly Hide':
    'Section=combat Note="+2 Armor Class in no armor, with a +3 dexterity cap"',
  'Deadly Aspect':
    'Section=combat Note="Draconic Aspect attack has the deadly d8 trait"',
  'Draconic Scent':'Section=skill Note="Has 30\' imprecise scent"',
  "Dragon's Flight":'Section=ability Note="Can Fly 20\' once per rd"',
  'Traditional Resistances':
    'Section=save ' +
    'Note="+1 Armor Class and saves vs. %{magicNotes.arcaneDragonblood?\'arcane\':magicNotes.divineDragonblood?\'divine\':magicNotes.occultDragonblood?\'occult\':\'primal\'} magical effects/+2 vs. sleep and paralysis"',
  'Formidable Breath':
    'Section=combat Note="Has increased Breath Of The Dragon effects"',
  "True Dragon's Flight":'Section=ability Note="Has a 20\' fly Speed"',
  'Wing Buffet':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Athletics vs. Fortitude inflicts %{level} HP bludgeoning and a 5\' push, %{level*2} HP and 10\' on a critical success, or %{level//2} HP only on a failure; critical failure inflcits prone on self"',
  'Draconic Veil':
    // TODO tradition may vary
    'Section=magic ' +
    'Note="Knows the Humanoid Form primal innate spell; can cast it at 5th rank once per day, lasting 1 hr"',
  'Majestic Presence':
    'Action=1 ' +
    'Section=combat ' +
    'Note="20\' emanation inflicts frightened 2 once per creature per day (<b>save Will</b> inflicts frightened 1; critical success negates, critical failure inflicts frightened 4)"',
  'Form Of The Dragon':
    'Section=magic ' +
    // TODO tradition varies
    'Note="Knows the Dragon Form primal innate spell; can cast it once per day at 8th rank"',
  'Lingering Breath':
    'Section=combat ' +
    'Note="Breath Of The Dragon inflicts difficult terrain for 1 min, and targets that critically fail their saves suffer +2d6 HP persistent damage"',

  'Duskwalker':
    'Section=feature,feature,save ' +
    'Note=' +
      '"Has the Low-Light Vision feature",' +
      '"Has the duskwalker trait and may take duskwalker ancestry feats",' +
      '"Cannot become undead"',
  'Change Death':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Rerolls a fatally failed recovery check or save once per day"',
  'Deliberate Death':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike against a foe that inflicts the dying condition on self"',
  'Duskwalker Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Boneyard Lore) feature",' +
      '"Skill Trained (Medicine; Religion)"',
  'Duskwaker Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Bo Staff; Longbow; Composite Longbow; Scythe; Staff)",' +
      '"%{level>=5?\'Critical hits with a bo staff, longbow, composite longbow, scythe, or staff inflict its critical specialization effect\':\'\'}"',
  'Ghost Hunter':
    'Section=combat ' +
    'Note="Strikes on incorporeal creatures are magical, and magical weapons gain the <i>ghost touch</i> property"',
  'Gravesight':'Section=feature Note="Has the Darkvision feature"',
  'Lifesense':
    'Section=skill ' +
    'Note="R10\' Can imprecisely sense the life force of living and undead creatures"',
  'Spirit Soother':
    'Section=skill ' +
    'Note="Automatically attempts a check to notice haunts, and gains +1 to disable haunts"',
  'Ward Against Corruption':
    'Section=save ' +
    'Note="+1 vs. death effects, disease, and undead or sahkils, and +2 vs. undead and sahkil death effects and disease"',
  'Duskwalker Magic':
    'Section=magic ' +
    'Note="Knows the Augury and Peaceful Rest divine innate spells; can cast earch once per day at 2nd rank"',
  'Quietus Strikes':
    'Section=combat ' +
    'Note="Attacks are magical and inflict +1 HP void or vitality, or +2 with a <i>+3 potency</i> rune"',
  'Resist Ruin':
    'Section=magic,save ' +
    'Note=' +
      '"Knows the False Vitality divine innate spell; can cast it once per day at 5th rank",' +
      '"Has resistance 5 to void"',
  "Boneyard's Call":
    'Section=magic ' +
    'Note="Knows the Interplanar Teleport divine innate spell; can cast it twice per week to travel to and from the Boneyard"',

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
  'Reflex Expertise':Pathfinder2E.FEATURES['Lightning Reflexes'],
  'Signature Spells':
    Pathfinder2E.FEATURES['Signature Spells'].replace('level', 'rank'),
  'Warrior':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Martial Performance feature",' +
      '"Knows the Fear occult spell"',
  'Weapon Specialization':Pathfinder2E.FEATURES['Weapon Specialization'],

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
  'Perception Expertise':Pathfinder2E.FEATURES.Alertness,
  // Reflex Expertise as above
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
  'Medium Armor Expertise':Pathfinder2E.FEATURES['Medium Armor Expertise'],
  // Perception Expertise as above
  'Primal Hierophant':Pathfinder2E.FEATURES['Primal Hierophant'],
  // Reflex Expertise as above
  'Storm':Pathfinder2E.FEATURES.Storm,
  'Untamed':
    Pathfinder2E.FEATURES['Wild Shape']
    .replace('Wild Shape', 'Untamed Form')
    .replace('Wild Morph', 'Untamed Shift'),
  'Shield Block':Pathfinder2E.FEATURES['Shield Block'],
  'Voice Of Nature':
    'Section=feature Note="+1 Class Feat (Animal Empathy or Plant Empathy)"',
  'Weapon Expertise':
    'Section=combat Note="Attack Expert (%V; Unarmed Attacks)"',
  // Weapon Specialization as above
  'Wild Willpower':Pathfinder2E.FEATURES.Resolve,
  'Wildsong':Pathfinder2E.FEATURES['Druidic Language'],

  'Animal Companion':Pathfinder2E.FEATURES['Animal Companion'],
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
  'Poison Resistance':Pathfinder2E.FEATURES['Poison Resistance'],
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
  'Armor Expertise':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"Benefits from the specialization effects of medium and heavy armor"',
  'Armor Mastery':
    'Section=combat ' +
    'Note="Defense Master (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)"',
  'Battle Hardened':Pathfinder2E.FEATURES.Juggernaut,
  'Battlefield Surveyor':Pathfinder2E.FEATURES['Battlefield Surveyor'],
  'Bravery':Pathfinder2E.FEATURES.Bravery,
  'Combat Flexibility':Pathfinder2E.FEATURES['Combat Flexibility'],
  'Fighter Expertise':Pathfinder2E.FEATURES['Fighter Expertise'],
  'Fighter Feats':Pathfinder2E.FEATURES['Fighter Feats'],
  'Fighter Key Attribute':Pathfinder2E.FEATURES['Fighter Key Ability'],
  'Fighter Skills':Pathfinder2E.FEATURES['Fighter Skills'],
  'Fighter Weapon Mastery':Pathfinder2E.FEATURES['Fighter Weapon Mastery'],
  'Greater Weapon Specialization':
    Pathfinder2E.FEATURES['Greater Weapon Specialization'],
  'Improved Flexibility':Pathfinder2E.FEATURES['Improved Flexibility'],
  'Reactive Strike':Pathfinder2E.FEATURES['Attack Of Opportunity'],
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
  'Sudden Charge':Pathfinder2E.FEATURES['Sudden Charge'],
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
  'Swipe':Pathfinder2E.FEATURES.Swipe,
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
  'Shield Warden':
    'Section=combat Note="Can use Shield Block to protect an adjacent ally"',
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
  'Quick Shield Block':
    'Section=combat ' +
    'Note="Can use an additional Reaction for a Shield Block once per turn"',
  'Resounding Bravery':
    'Section=save ' +
    'Note="Will saves give +1 saves and %{level//2} temporary Hit Points, or +2 saves and %{level} temporary on a critical success, for 1 min"',
  'Sudden Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a melee Strike while Leaping, High Jumping, or Long Jumping up to %{speed*2}\'"',
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
  'Whirlwind Strike':Pathfinder2E.FEATURES['Whirlwind Strike'],
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
  // Perception Mastery as above
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
  // Will Expertise as above

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
  'Deny Advantage':
    'Section=combat ' +
    'Note="Does not suffer flat-footed vs. hidden, undetected, flanking, or surprising foes of equal or lower level"',
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
  'Familiar':Pathfinder2E.FEATURES.Familiar,
  'Hex Spells':'Section=magic Note="Has a focus pool and 1 Focus Point"',
  // Legendary Spellcaster as above
  'Magical Fortitude':'Section=save Note="Save Expert (Fortitude)"',
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
    'Note="Knows the formulas for %{level//2+1>?4} common oils or potions and can use Craft to create %{(rank.Arcane||rank.Divine||rank.Occult||rank.Primal||0<3?1:rank.Arcane||rank.Divine||rank.Occult||rank.Primal<4?2:3)*($\'features.Double, Double\'?2:1)} oils or potions during daily prep"',
  'Counterspell':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Expends a spell slot to attempt to counteract a spell with the same spell"',
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
  // TODO Do anything with curriculum spells? Leaning no.
  'Defensive Robes':'Section=combat Note="Defense Expert (Unarmored Defense)"',
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
  // Perception Expertise as above
  'Prodigious Will':Pathfinder2E.FEATURES.Resolve,
  // Reflex Expertise as above
  'School Of Ars Grammatica':
    'Section=magic ' +
    'Note="+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Protective Wards arcane spell"',
  'School Of Battle Magic':
    'Section=magic ' +
    'Note="+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Force Bolt arcane spell"',
  'School Of The Boundary':
    'Section=magic ' +
    'Note="+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Fortify Summoning arcane spell"',
  'School Of Civic Wizardry':
    'Section=magic ' +
    'Note="+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Earthworks arcane spell"',
  'School Of Mentalism':
    'Section=magic ' +
    'Note="+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Charming Push arcane spell"',
  'School Of Protean Form':
    'Section=magic ' +
    'Note="+1 spell slot each level/Has a focus pool and 1 Focus Point/Knows the Scramble Body arcane spell"',
  'School Of Unified Magical Theory':
    'Section=feature,magic,magic ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Has a focus pool and 1 Focus Point/Knows the Hand Of The Apprentice arcane spell",' +
      '"Can use Drain Bonded Item once per spell rank each day"',
  'Spell Blending':Pathfinder2E.FEATURES['Spell Blending'],
  'Spell Substitution':Pathfinder2E.FEATURES['Spell Substitution'],
  'Staff Nexus':
    'Section=magic ' +
    'Note="Can cast spells from staff, using charges from %{level<8?\'1 spell\':level<16?\'2 spells\':\'3 spells\'} expended during daily prep"',
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
  // Conceal Spell as above
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

  // Core 2

  // Alchemist
  'Abundant Vials':Pathfinder2E.FEATURES['Perpetual Perfection'],
  'Advanced Alchemy':Pathfinder2E.FEATURES['Advanced Alchemy'],
  'Advanced Vials':Pathfinder2E.FEATURES['Perpetual Potency'],
  'Alchemical Expertise':Pathfinder2E.FEATURES['Alchemical Expertise'],
  'Alchemical Mastery':Pathfinder2E.FEATURES['Alchemical Mastery'],
  'Alchemical Weapon Expertise':
    Pathfinder2E.FEATURES['Alchemical Weapon Expertise'],
  'Alchemical Weapon Mastery':
    'Section=combat Note="Attack Master (Simple Weapons; Alchemical Bombs)"',
  'Alchemist Feats':Pathfinder2E.FEATURES['Alchemist Feats'],
  'Alchemist Skills':Pathfinder2E.FEATURES['Alchemist Skills'],
  'Alchemy':Pathfinder2E.FEATURES.Alchemy,
  'Bomber':Pathfinder2E.FEATURES.Bomber,
  'Chemical Hardiness':Pathfinder2E.FEATURES.Juggernaut,
  'Chirurgeon':Pathfinder2E.FEATURES.Chirurgeon,
  'Double Brew':Pathfinder2E.FEATURES['Double Brew'],
  'Explosion Dodger':Pathfinder2E.FEATURES.Evasion,
  'Field Discovery':Pathfinder2E.FEATURES['Field Discovery'],
  'Formula Book':Pathfinder2E.FEATURES['Formula Book'],
  'Greater Field Discovery (Bomber)':
    Pathfinder2E.FEATURES['Greater Field Discovery (Bomber)'],
  'Greater Field Discovery (Chirurgeon)':
    Pathfinder2E.FEATURES['Greater Field Discovery (Chirurgeon)'],
  'Greater Field Discovery (Mutagenist)':
    Pathfinder2E.FEATURES['Greater Field Discovery (Mutagenist)'],
  'Greater Field Discovery (Toxicologist)':
    'Section=feature ' +
    'Note="TODO"',
  // Medium Armor Expertise as above
  'Medium Armor Mastery':Pathfinder2E.FEATURES['Medium Armor Mastery'],
  'Mutagenist':Pathfinder2E.FEATURES.Mutagenist,
  // Perception Expertise as above
  'Powerful Alchemy':Pathfinder2E.FEATURES['Powerful Alchemy'],
  'Toxicologist':
    'Section=feature ' +
    'Note="TODO"',
  'Quick Alchemy':Pathfinder2E.FEATURES['Quick Alchemy'],
  'Research Field':Pathfinder2E.FEATURES['Research Field'],
  'Versatile Vials':Pathfinder2E.FEATURES['Infused Reagents'],
  // Weapon Specialization as above
  'Will Expertise':Pathfinder2E.FEATURES['Iron Will'],

  'Alchemical Familiar':Pathfinder2E.FEATURES['Alchemical Familiar'],
  'Alchemical Assessment':Pathfinder2E.FEATURES['Alchemical Savant'],
  'Blowgun Poisoner':
    'Section=feature ' +
    'Note="TODO"',
  'Far Lobber':Pathfinder2E.FEATURES['Far Lobber'],
  'Quick Bomber':Pathfinder2E.FEATURES['Quick Bomber'],
  'Soothing Vials':
    'Section=feature ' +
    'Note="TODO"',
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
*/

  // Barbarian
  // Armor Mastery as above
  'Barbarian Feats':Pathfinder2E.FEATURES['Barbarian Feats'],
  'Barbarian Skills':Pathfinder2E.FEATURES['Barbarian Skills'],
  'Bestial Rage (Ape)':Pathfinder2E.FEATURES['Bestial Rage (Ape)'],
  'Bestial Rage (Bear)':Pathfinder2E.FEATURES['Bestial Rage (Bear)'],
  'Bestial Rage (Bull)':Pathfinder2E.FEATURES['Bestial Rage (Bull)'],
  'Bestial Rage (Cat)':Pathfinder2E.FEATURES['Bestial Rage (Cat)'],
  'Bestial Rage (Deer)':Pathfinder2E.FEATURES['Bestial Rage (Deer)'],
  'Bestial Rage (Frog)':Pathfinder2E.FEATURES['Bestial Rage (Frog)'],
  'Bestial Rage (Shark)':Pathfinder2E.FEATURES['Bestial Rage (Shark)'],
  'Bestial Rage (Snake)':Pathfinder2E.FEATURES['Bestial Rage (Snake)'],
  'Bestial Rage (Wolf)':Pathfinder2E.FEATURES['Bestial Rage (Wolf)'],
  'Brutality':Pathfinder2E.FEATURES.Brutality,
  'Devastator':Pathfinder2E.FEATURES.Devastator,
  'Draconic Rage':Pathfinder2E.FEATURES['Draconic Rage'],
  'Furious Footfalls':
    'Section=ability,ability ' +
    'Note=' +
      '"+5 Speed",' +
      '"+5 Speed during rage"',
  'Fury Instinct':Pathfinder2E.FEATURES['Fury Instinct'],
  'Greater Juggernaut':Pathfinder2E.FEATURES['Greater Juggernaut'],
  // Greater Weapon Specialization as above
  'Indomitable Will':Pathfinder2E.FEATURES['Indomitable Will'],
  'Instinct':Pathfinder2E.FEATURES.Instinct,
  'Juggernaut':Pathfinder2E.FEATURES.Juggernaut,
  // Medium Armor Expertise as above
  'Mighty Rage':Pathfinder2E.FEATURES['Mighty Rage'],
  // Perception Mastery as above
  'Quick-Tempered':
    'Action=Free Section=combat Note="Enters rage during initiative"',
  'Rage':Pathfinder2E.FEATURES.Rage,
  'Raging Resistance (Animal)':
    Pathfinder2E.FEATURES['Raging Resistance (Animal)'],
  'Raging Resistance (Dragon)':
    Pathfinder2E.FEATURES['Raging Resistance (Dragon)'],
  'Raging Resistance (Fury)':Pathfinder2E.FEATURES['Raging Resistance (Fury)'],
  'Raging Resistance (Giant)':
    Pathfinder2E.FEATURES['Raging Resistance (Giant)'],
  'Raging Resistance (Spirit)':
    Pathfinder2E.FEATURES['Raging Resistance (Spirit)'],
  'Revitalizing Rage':Pathfinder2E.FEATURES['Quick Rage'],
  'Specialization Ability':Pathfinder2E.FEATURES['Specialization Ability'],
  'Spirit Rage':Pathfinder2E.FEATURES['Spirit Rage'],
  'Titan Mauler':Pathfinder2E.FEATURES['Titan Mauler'],
  'Weapon Mastery':Pathfinder2E.FEATURES['Weapon Fury'],
  // Reflex Expertise as above
  // Weapon Specialization as above

/*
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
  // Sudden Charge as above
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
  // Swipe as above
  'Wounded Rage':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Begins rage upon taking damage"',
  'Animal Skin':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense Expert (Unarmored Defense)",' +
      '"+%{($\'features.Greater Juggernaut\'?3:2)-(dexterityModifier-3>?0)} Armor Class in no armor during rage"',
  // Reactive Strike as above
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
  // Sudden Leap as above
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
  // Whirlwind Strike as above
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
  // Armor Expertise as above
  // Armor Mastery as above
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
  // Shield Block as above
  /*
  'The Tenets Of Good':
    'Section=feature ' +
    'Note="May not commit anathema or evil acts, harm innocents, or allow harm to come to innocents through inaction"',
  */
  // Weapon Expertise as above
  // Weapon Mastery
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
  // Shield Warden as above
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
  // Quick Shield Block as above
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

  /*
  // Sorcerer
  // Perception Expertise as above
  'Bloodline':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool and 1 Focus Point"',
  'Bloodline Paragon':'Section=magic Note="Has 1 10th-level spell slot"',
  // Defensive Robes as above
  // Expert Spellcaster as above
  // Legendary Spellcaster as above
  // Reflex Expertise as above
  // Magical Fortitude as above
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
  // Counterspell as above
  'Dangerous Sorcery':
    'Section=magic ' +
    'Note="Using a spell slot to cast an instantaneous harmful spell inflicts additional damage equal to its level"',
  // Familiar as above
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
    'Note="After %{rank.Occultism>=4||rank.Religion>=4?\'10 min\':\'8 hr\'} of preparation, can use Occultism or Religion for a %{(level+1)//2}-level counteract check against a curse"',
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
  'Changeling':'Traits=Uncommon',
  'Nephilim':'Traits=Uncommon',
  'Aiuvarin':'Traits=Non-Elf',
  'Dromaar':'Traits=Non-Orc',
  // Core 2
  'Dhampir':'Traits=Uncommon',
  'Dragonblood':'Traits=Uncommon',
  'Duskwalker':'Traits=Uncommon'
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
  'Hag Lore':'Attribute=Intelligence Subcategory="Creature Lore"', // pg 77
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
  'Warfare Lore':Pathfinder2E.SKILLS['Warfare Lore'],
  // Core 2 lores from ancestries (pg 7ff)
  'Boneyard Lore':'Attribute=Intelligence Subcategory="Boneyard Lore"',
  'Cat Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Dragon Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Duskwalker Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Hobgoblin Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Kholo Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Kobold Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Ratfolk Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Lizardfolk Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Tengu Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  'Tripkee Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
  // Core 2 lores from backgrounds (pg 50ff)
  'Astrology Lore':'Attribute=Intelligence',
  'Surgery Lore':'Attribute=Intelligence'
};
for(let s in Pathfinder2ERemaster.SKILLS)
  Pathfinder2ERemaster.SKILLS[s] =
    Pathfinder2ERemaster.SKILLS[s].replace('Ability', 'Attribute');
Pathfinder2ERemaster.SPELLS = {
  'Acid Grip':
    Pathfinder2E.SPELLS['Acid Arrow']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Manipulate') + ' ' +
    // Duration deleted by errata
    'Description=' +
      '"R120\' Inflicts 2d8 HP acid, 1d6 HP persistent acid, and -10\' Speed (<b>save Reflex</b> inflicts half initial HP only and moves the target 5\'; critical success negates; critical failure inflicts double initial HP and moves the target 20\') (<b>heightened +2</b> inflicts +2d8 HP initial and +1d6 HP persistent)"',
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
  'Aqueous Orb':
    'Level=3 ' +
    'Traits=Concentrate,Manipulate,Water ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' 10\' sphere extinguishes normal fires, attempts to counteract magical fires, and engulfs Large or smaller creatures until they succeed on an Escape or DC 10 Swim check (<b>save Reflex</b> negates; critical failure disallows Swim) while sustained for up to 1 min"',
  'Arctic Rift':
    Pathfinder2E.SPELLS['Polar Ray']
    .replace(/School=\w*/, '')
    .replace('Attack,', '')
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R120\' Inflicts 12d8 HP cold and slowed 1 for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and slowed 1 until ice with 60 HP and Hardness 5 is cleared) (<b>heightened +1</b> inflicts +2d8 HP and gives ice +5 HP)"',
  'Augury':
    Pathfinder2E.SPELLS.Augury
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Avatar':
    Pathfinder2E.SPELLS.Avatar
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Bane':
    Pathfinder2E.SPELLS.Bane
    .replace(/School=\w*/, '')
    // Aura trait added by errata
    .replace('Enchantment', 'Concentrate,Manipulate,Aura')
    .replaceAll('5', '10'),
  'Banishment':
    Pathfinder2E.SPELLS.Banishment
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Bind Undead':
    Pathfinder2E.SPELLS['Bind Undead']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Blazing Bolt':
    'Level=2 ' +
    'Traits=Attack,Concentrate,Fire,Manipulate ' +
    'Traditions=Arcane,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R60\' Spell attack inflicts 2d6 HP fire, or double on a critical success; using 2 or 3 actions increases the damage to 4d6 HP fire and attacks 2 or 3 targets (<b>heightened +1</b> inflicts +1d6 HP, or +2d6 HP with 2 or 3 actions)"',
  'Bless':
    Pathfinder2E.SPELLS.Bless
    .replace(/School=\w*/, '')
    // Aura trait added by errata
    .replace('Enchantment', 'Concentrate,Manipulate,Aura')
    .replace('5', '15')
    .replace('by 5', 'by 10'),
  'Blessed Boundary':
    Pathfinder2E.SPELLS['Blade Barrier']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate,Sanctified') + ' ' +
    'Description=' +
      '"R120\' 60\' burst inflicts 7d8 HP force and a 10\' push for 1 min (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts doubles HP and push distance) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Blindness':
    Pathfinder2E.SPELLS.Blindness
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Blood Vendetta':
    'Level=2 ' +
    'Traits=Curse ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Spell attack inflicts 2d6 HP persistent bleed and weakness 1 to piercing and slashing on a target that has inflicted piercing, slashing, or persistent bleed on self (<b>save Will</b> inflicts half HP only; critical success negates; critical failure inflicts double HP) (<b>heightened +2</b> inflicts +2d6 HP)"',
  'Blur':
    Pathfinder2E.SPELLS.Blur
    .replace(/School=\w*/, '')
    .replace('Veil', 'Concentrate,Manipulate,Visual'),
  'Breath Of Life':
    Pathfinder2E.SPELLS['Breath Of Life']
    .replace(/School=\w*/, '')
    .replace('Necromancy,Positive', 'Concentrate,Vitality') + ' ' +
    'Description=' +
      '"R60\' Prevents the triggering target\'s death, restoring 5d8 HP (<b>heightened +2</b> restores +1d8 HP)"',
  'Breathe Fire':
    Pathfinder2E.SPELLS['Burning Hands']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Calm':
    Pathfinder2E.SPELLS['Calm Emotions']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Canticle Of Everlasting Grief':
    'Level=8 ' +
    'Traits=Auditory,Concentrate,Curse,Emotion,Fear,Manipulate,Mental ' +
    'Traditions=Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Inflicts 10d6 HP mental, frightened 3, a curse that negates of circumstance and status bonuses for 1 week (<b>save Will</b> inflicts half HP, frightened 1, and cursed for 1 rd; critical success negates; critical failure inflicts double HP, frightened 4, and permanent curse that also affects allies within 15\'"',
  'Cataclysm':
    Pathfinder2E.SPELLS.Cataclysm
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Caustic Blast':
    Pathfinder2E.SPELLS['Acid Splash']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace(',Attack', ''),
  'Chain Lightning':
    Pathfinder2E.SPELLS['Chain Lightning']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Charm':
    Pathfinder2E.SPELLS.Charm
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate,Subtle'),
  'Chilling Darkness':
    Pathfinder2E.SPELLS['Chilling Darkness']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Evil', 'Unholy')
    .replaceAll('evil', 'spirit')
    .replace('celestials', 'holy creatures'),
  'Clairaudience':
    Pathfinder2E.SPELLS.Clairaudience
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Clairvoyance':
    Pathfinder2E.SPELLS.Clairvoyance
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Cleanse Affliction': // ref Neutralize Poison, Remove Curse, Remove Disease
    'Level=2 ' +
    'Traits=Concentrate,Healing,Manipulate ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Reduces the stage of a curse, disease, or poison affecting touched by 1 (<b>heightened 3rd</b> attempts to counteract a disease or poison; <b>4th</b> attempts to counteract a curse, disease, or poison)"',
  'Cleanse Cuisine':
    Pathfinder2E.SPELLS['Purify Food And Drink']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R10\' Enhances or removes contaminants from 1 cubic foot of food and drink (<b>heightened +2</b> affects +1 cubic foot)"',
  'Clear Mind':
    Pathfinder2E.SPELLS['Remove Fear']
    .replace(/School=\w*/, '') + ' ' +
    'Traits=Concentrate,Healing,Manipulate,Mental ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 fleeing, frightened, or stupefied effect affecting touched (<b>heightened 4th</b> can counteract confused, controlled, or slows; <b>6th</b> can counteract doomed; <b>8th</b> can counteract stunned)"',
  'Command':
    Pathfinder2E.SPELLS.Command
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Confusion':
    Pathfinder2E.SPELLS.Confusion
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Contingency':
    Pathfinder2E.SPELLS.Contingency
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Control Water':
    Pathfinder2E.SPELLS['Control Water']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    // Duration from errata
    .replace('creatures', 'creatures for 1 hr (<b>save Fortitude</b> negates)'),
  'Cozy Cabin':
    'Level=3 ' +
    'Traits=Concentrate,Manipulate,Wood ' +
    'Traditions=Arcane,Occult ' +
    'Cast="1 min" ' +
    'Description=' +
      '"R30\' Creates a 20\'x20\'x10\' comfortable wooden cabin for 12 hr or until self exits"',
  'Create Food':
    Pathfinder2E.SPELLS['Create Food']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Create Water':
    Pathfinder2E.SPELLS['Create Water']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Creation':
    Pathfinder2E.SPELLS.Creation
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate')
    .replace('vegetable', 'earth or vegetable'),
  'Crisis Of Faith':
    Pathfinder2E.SPELLS['Crisis Of Faith']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Cursed Metamorphosis':
    Pathfinder2E.SPELLS['Baleful Polymorph']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate,Curse')
    .replace('Traditions=', 'Traditions=Occult,'),
  'Darkvision':
    Pathfinder2E.SPELLS.Darkvision
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Daze':
    Pathfinder2E.SPELLS.Daze
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace(/%\{.*\}/, '1d6'),
  'Deafness':
    Pathfinder2E.SPELLS.Deafness
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Desiccate':
    Pathfinder2E.SPELLS['Horrid Wilting']
    .replace(/School=\w*/, '')
    .replace('negative', 'void') + ' ' +
    'Traits=Concentrate,Manipulate,Void',
  'Detect Magic':
    Pathfinder2E.SPELLS['Detect Magic']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('school', 'rank'),
  'Detect Poison':
    Pathfinder2E.SPELLS['Detect Poison']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Detect Scrying':
    Pathfinder2E.SPELLS['Detect Scrying']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Detonate Magic':
    Pathfinder2E.SPELLS.Disjunction
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R120\' Makes a counteract check to convert the target magic into an explosion that inflicts 8d6 HP force (<b>save basic Reflex</b>)"',
  'Dinosaur Form':
    Pathfinder2E.SPELLS['Dinosaur Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Disappearance':
    Pathfinder2E.SPELLS.Disappearance
    .replace(/School=\w*/, '')
    .replace('Illusion', 'Illusion,Manipulate,Subtle'),
  'Disguise Magic':
    Pathfinder2E.SPELLS['Magic Aura']
    .replace(/School=\w*/, '')
    .replace('Uncommon', 'Concentrate,Manipulate')
    .replace('3rd', '2nd'),
  'Disintegrate':
    Pathfinder2E.SPELLS.Disintegrate
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Illusion,Manipulate,Subtle'),
  'Dispel Magic':
    Pathfinder2E.SPELLS['Dispel Magic']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Dispelling Globe':
    Pathfinder2E.SPELLS['Globe Of Invulnerability']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Divine Decree':
    Pathfinder2E.SPELLS['Divine Decree']
    .replace(/School=\w*/, '') + ' ' +
    'Traits=Concentrate,Manipulate,Sanctified,Spirit ' +
    'Description=' +
      '"R40\' 40\' emanation inflicts 7d10 HP spirit and enfeebled 2 for 1 min on foes (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, banishment, and, for creatures of level 10 and lower, paralysis for 1 min (<b>save Will</b> negates; critical failure inflicts death) (<b>heightened +1</b> inflicts +1d10 HP and increases the level of creatures that suffer paralysis by 2)"',
  'Divine Immolation':
    Pathfinder2E.SPELLS['Flame Strike']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate,Sanctified,Spirit') + ' ' +
    'Description=' +
      '"R120\' 20\' burst inflicts 6d6 HP fire or spirit and 2d6 HP persistent fire or spirit (<b>save Reflex</b> inflicts half initial HP only; critical success negates; critical failure inflicts double HP initial and persistent) (<b>heightened +1</b> inflicts +1d6 HP initial and persistent)"',
  'Divine Inspiration':
    Pathfinder2E.SPELLS['Divine Inspiration']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Divine Lance':
    Pathfinder2E.SPELLS['Divine Lance']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate,Sanctified,Spirit')
    .replace(/1d4+%\{.*\}/, '2d4'),
  'Divine Wrath':
    Pathfinder2E.SPELLS['Divine Wrath']
    .replace(/School=\w*/, '') + ' ' +
    'Traits=Concentrate,Manipulate,Sanctified,Spirit' + ' ' +
    'Description=' +
      '"R120\' 20\' burst inflicts 4d10 HP spirit and sickened 1 (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts sickened 2 and slowed 1) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Dizzying Colors':
    Pathfinder2E.SPELLS['Color Spray']
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Dominate':
    Pathfinder2E.SPELLS.Dominate
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace('Traditions=', 'Traditions=Divine,'),
  'Dragon Form':
    Pathfinder2E.SPELLS['Dragon Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal'
    .replace('+14', '+4d6'),
  'Dream Message':
    Pathfinder2E.SPELLS['Dream Message']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Dreaming Potential':
    Pathfinder2E.SPELLS['Dreaming Potential']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Duplicate Foe':
    Pathfinder2E.SPELLS['Duplicate Foe']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Earthbind':
    Pathfinder2E.SPELLS.Earthbind
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Earth,Manipulate'),
  'Earthquake':
    Pathfinder2E.SPELLS.Earthquake
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Eclipse Burst':
    Pathfinder2E.SPELLS['Eclipse Burst']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace('Negative', 'Void')
    .replaceAll('negative', 'void'),
  'Electric Arc':
    Pathfinder2E.SPELLS['Electric Arc']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace(/1d4+%\{.*\}/, '2d4'),
  'Elemental Form':
    Pathfinder2E.SPELLS['Elemental Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('air or fire', 'air, fire, or metal')
    .replace('earth or water', 'earth, water, or wood'),
  'Embed Message':
    Pathfinder2E.SPELLS['Magic Mouth']
    .replace(/School=\w*/, '')
    .replace('Auditory', 'Concentrate,Manipulate')
    .replace(',Visual', '') + ' ' +
    'Description=' +
      '"Illusory text and a disembodied voice convey a specified message of up to 25 words the next time a specified trigger occurs within 30\' (<b>heightened 4th</b> can include additional sensory effects; <b>6th</b> message can repeat multiple times)"',
  'Energy Aegis':
    Pathfinder2E.SPELLS['Energy Aegis']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate')
    .replace('for 1 day', 'until next daily prep')
    .replace('negative, positive', 'vitality, void'),
  'Enfeeble':
    Pathfinder2E.SPELLS['Ray Of Enfeeblement']
    .replace(/School=\w*/, '') + ' ' +
    // Attack trait removed by errata
    'Traits=Concentrate,Manipulate ' +
    'Description=' +
      '"R30\' Inflicts enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts enfeebled 1 for 1 rd; critical success negates; critical failure inflicts enfeebled 3 for 1 min)"',
  'Enlarge':
    Pathfinder2E.SPELLS.Enlarge
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Entangling Flora':
    Pathfinder2E.SPELLS.Entangle
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate,Wood')
    .replace('Primal', 'Arcane,Primal'),
  'Enthrall':
    Pathfinder2E.SPELLS.Enthrall
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Environmental Endurance':
    Pathfinder2E.SPELLS['Endure Elements']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Everlight':
    Pathfinder2E.SPELLS['Continual Flame']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Description="Touched gemstone emits 20\' bright light until dismissed"',
  'Execute':
    Pathfinder2E.SPELLS['Finger Of Death']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate,Void')
    .replace('negative', 'void'),
  'Fabricated Truth':
    Pathfinder2E.SPELLS['Fabricated Truth']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Falling Stars':
    Pathfinder2E.SPELLS['Meteor Swarm']
    .replace(/School=\w*/, '')
    .replace('Evocation,Fire', 'Concentrate,Manipulate')
    .replaceAll('fire', 'chosen energy'),
  'False Vision':
    Pathfinder2E.SPELLS['False Vision']
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'False Vitality':
    Pathfinder2E.SPELLS['False Life']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace(/%\{.*\}/, '10'),
  'Fear':
    Pathfinder2E.SPELLS.Fear
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Feet To Fins':
    Pathfinder2E.SPELLS['Feet To Fins']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Field Of Life':
    Pathfinder2E.SPELLS['Field Of Life']
    .replace(/School=\w*/, '')
    .replace('Necromancy,Positive', 'Concentrate,Manipulate')
    .replaceAll('positive', 'vitality'),
  'Fiery Body':
    Pathfinder2E.SPELLS['Fiery Body']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('Produce Flame', 'Ignite'),
  'Figment':
    Pathfinder2E.SPELLS['Ghost Sound']
    .replace(/School=\w*/, '')
    // Subtle trait added by errata
    .replace('Auditory', 'Concentrate,Manipulate,Subtle') + ' ' +
    'Description=' +
      '"R30\' Creates a simply illusory sound or vision while sustained"',
  'Fire Shield':
    Pathfinder2E.SPELLS['Fire Shield']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Hovering shield with Hardness 10 and 40 HP gives self cold resistance 5 and immunity to severe environmental cold and inflicts 2d6 HP fire on melee attackers for 1 min (<b>heightened +2</b> shield has +10 HP, gives cold resistance +5, and inflicts +1d6 HP)"',
  'Fireball':
    Pathfinder2E.SPELLS.Fireball
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Fleet Step':
    Pathfinder2E.SPELLS['Fleet Step']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Flicker':
    Pathfinder2E.SPELLS.Blink
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Floating Flame':
    Pathfinder2E.SPELLS['Flaming Sphere']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('; success negates', ''),
  'Fly':
    Pathfinder2E.SPELLS.Fly
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Occult,Primal',
  'Forbidding Ward':
    Pathfinder2E.SPELLS['Forbidding Ward']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Force Barrage':
    Pathfinder2E.SPELLS['Magic Missile']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replaceAll('missile', 'shard'),
  'Foresight':
    Pathfinder2E.SPELLS.Foresight
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('flat-footed', 'off-guard'),
  'Freeze Time':
    Pathfinder2E.SPELLS['Time Stop']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Frostbite':
    Pathfinder2E.SPELLS['Ray Of Frost']
    .replace(/School=\w*/, '') + ' ' +
    // Attack trait removed by errata
    'Traits=Cantrip,Cold,Concentrate,Manipulate ' +
    'Description=' +
      '"R60\' Inflicts 2d4 HP cold (<b>save basic Fortitude</b>; critical failure also inflicts weakness 1 to bludgeoning for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP and weakness +1 to bludgeoning)"',
  'Gate':
    Pathfinder2E.SPELLS.Gate
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Gecko Grip':
    Pathfinder2E.SPELLS['Spider Climb']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Feather Fall':
    Pathfinder2E.SPELLS['Feather Fall']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Air,Concentrate'),
  'Ghostly Carrier':
    Pathfinder2E.SPELLS['Spectral Hand']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace(/ends the spell[^"]*/, 'ends the spell'),
  'Ghostly Weapon':
    Pathfinder2E.SPELLS['Ghostly Weapon']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Goblin Pox':
    Pathfinder2E.SPELLS['Goblin Pox']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Gouging Claw':
    'Level=1 ' +
    'Traits=Attack,Cantrip,Concentrate,Manipulate,Morph ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Melee spell attack inflicts 2d6 HP choice of slashing or piercing, plus 2 HP persistent bleed, or double both on a critical success (<b>heightened +1</b> inflicts +1d6 HP initial and +1 persistent bleed)"',
  'Grease':
    Pathfinder2E.SPELLS.Grease
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Grim Tendrils':
    Pathfinder2E.SPELLS['Grim Tendrils']
    .replace(/School=\w*/, '') + ' ' +
    'Traits=Concentrate,Manipulate,Void'
    .replaceAll('negative', 'void'),
  'Guidance':
    Pathfinder2E.SPELLS.Guidance
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate'),
  'Gust Of Wind':
    Pathfinder2E.SPELLS['Gust Of Wind']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Hallucination':
    Pathfinder2E.SPELLS.Hallucination
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Manipulate,Subtle,'),
  'Harm':
    Pathfinder2E.SPELLS.Harm
    .replace(/School=\w*/, '') + ' ' +
    'Traits=Manipulate,Void'
    .replaceAll('negative', 'void'),
  'Haste':
    Pathfinder2E.SPELLS.Haste
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Heal':
    Pathfinder2E.SPELLS.Heal
    .replace(/School=\w*/, '')
    .replace('Necromancy,Positive', 'Manipulate,Vitality'),
  'Heroism':
    Pathfinder2E.SPELLS.Heroism
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Hidden Mind':
    Pathfinder2E.SPELLS['Mind Blank']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Holy Light':
    Pathfinder2E.SPELLS['Searing Light']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Good', 'Holy')
    .replaceAll('good', 'spirit')
    .replace('fiends and undead', 'unholy creatures'),
  'Glibness':
    Pathfinder2E.SPELLS.Glibness
    .replace(/School=\w*/, '')
    .replace('Uncommon,Enchantment', 'Concentrate,Manipulate'),
  'Howling Blizzard':
    Pathfinder2E.SPELLS['Cone Of Cold']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate,Air') + ' ' +
    'Description=' +
      '"60\' cone (3 actions gives R500\' and a 30\' burst) inflicts 10d6 HP cold (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Humanoid Form':
    Pathfinder2E.SPELLS['Humanoid Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Hydraulic Push':
    Pathfinder2E.SPELLS['Hydraulic Push']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Hydraulic Torrent':
    Pathfinder2E.SPELLS['Hydraulic Torrent']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Hypercognition':
    Pathfinder2E.SPELLS.Hypercognition
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate'),
  'Hypnotize':
    Pathfinder2E.SPELLS['Hypnotic Pattern']
    .replace(/School=\w*/, '')
    .replace('Trait=', 'Trait=Manipulate,Subtle,'),
  'Ignition':
    Pathfinder2E.SPELLS['Produce Flame']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace(/1d4\+%\{.*\} HP/, '2d4 HP (2d6 HP if a melee attack)'),
  'Ill Omen':
    'Level=1 ' +
    'Traits=Concentrate,Curse,Manipulate,Misfortune ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Target suffers worse of two rolls on next attack or skill check within 1 rd (<b>save Will</b> negates; critical failure affects all attacks and skill checks within 1 rd)"',
  'Illusory Creature':
    Pathfinder2E.SPELLS['Illusory Creature']
    .replace(/School=\w*/, '')
    .replace('Trait=', 'Trait=Concentrate,Manipulate,')
    .replace(/1d4\+%\{.*\}/, '3d4'),
  'Illusory Disguise':
    Pathfinder2E.SPELLS['Illusory Disguise']
    .replace(/School=\w*/, '')
    .replace('Trait=', 'Trait=Concentrate,Manipulate,') + ' ' +
    'Description=' +
      '"R30\' Makes the target appear different and gives +4 Deception, plus the target level if untrained, to avoid uncovering the disguise for 1 hr (<b>heightened 3rd</b> allows copying a specific individual; <b>4th</b> affects 10 targets; <b>7th</b> affects 10 targets and allows copying specific individuals)"',
  'Illusory Object':
    Pathfinder2E.SPELLS['Illusory Object']
    .replace(/School=\w*/, '')
    .replace('Trait=', 'Trait=Concentrate,Manipulate,'),
  'Illusory Scene':
    Pathfinder2E.SPELLS['Illusory Scene']
    .replace(/School=\w*/, '')
    .replace('Trait=', 'Trait=Concentrate,Manipulate,'),
  'Impaling Spike':
    'Level=5 ' +
    'Traits=Concentrate,Manipulate,Metal ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 8d6 HP piercing from cold iron and immobilized (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and off-guard) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Implosion':
    Pathfinder2E.SPELLS.Implosion
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Indestructibility':
    'Level=10 ' +
    'Traits=Concentrate,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="Gives self immunity to harm for 1 rd"',
  'Infuse Vitality':
    Pathfinder2E.SPELLS['Disrupting Weapons']
    .replace(/School=\w*/, '')
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality') + ' ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched weapon (2 or 3 actions affect 2 or 3 actions) inflicts +1d4 HP vitality%{traits.Holy?\' and holy\':\'\'} for 1 min (<b>heightened 3rd</b> weapon inflicts +2d4 HP; <b>5th</b> weapon inflicts +3d4 HP)"',
  'Insect Form':
    Pathfinder2E.SPELLS['Insect Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Primal',
  'Interplanar Teleport':
    Pathfinder2E.SPELLS['Plane Shift']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Invisibility':
    Pathfinder2E.SPELLS.Invisibility
    .replace(/School=\w*/, '')
    .replace('Trait=', 'Trait=Manipulate,Subtle'),
  'Invoke Spirits':
    'Level=5 ' +
    'Traits=Concentrate,Emotion,Fear,Manipulate,Mental,Void ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst, movable 30\' per rd, inflicts 2d4 HP mental and 2d4 HP void while sustained for up to 1 min (<b>save Will</b> negates; critical failure also inflicts frightened 2, plus fleeing in the first rd) (<b>heightened +2</b> inflicts +1d4 HP mental and void)"',
  'Item Facade':
    Pathfinder2E.SPELLS['Item Facade']
    .replace(/School=\w*/, '')
    .replace('Trait=', 'Trait=Concentrate,Manipulate,'),
  'Jump':
    Pathfinder2E.SPELLS.Jump
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Manipulate'),
  'Knock':
    Pathfinder2E.SPELLS.Knock
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Know The Way':
    Pathfinder2E.SPELLS['Know Direction']
    .replace('Divination', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Reveals which direction is north (<b>heightened 3rd</b> reveals direction to a location visited in the past week; <b>7th</b> reveals direction to a familiar location)"',
  'Laughing Fit':
    Pathfinder2E.SPELLS['Hideous Laughter']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Levitate':
    Pathfinder2E.SPELLS.Levitate
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Light':
    Pathfinder2E.SPELLS.Light
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Touched object', "R120' Orb"),
  'Lightning Bolt':
    Pathfinder2E.SPELLS['Lightning Bolt']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Liminal Doorway':
    Pathfinder2E.SPELLS['Rope Trick']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Drawn doorway leads to an 20\' cubic extradimensional space for 8 hr or until erased"',
  'Locate':
    Pathfinder2E.SPELLS.Locate
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Lock':
    Pathfinder2E.SPELLS.Lock
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Mad Monkeys':
    'Level=3 ' +
    'Traits=Concentrate,Manipulate ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Spiritual monkeys in a 5\' burst obey self order to Steal, screech to deafen for 1 rd (<b>save Fortitude</b> negates; critical failure deafens for 1 min), or interfere with manipulate actions for 1 rd (<b>save Reflex</b> negates; critical failure extends until the spell ends; a successful DC 5 flat check allows a specific manipulate action) while sustained for up to 1 min"',
  'Magic Passage':
    Pathfinder2E.SPELLS.Passwall
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  "Mariner's Curse":
    Pathfinder2E.SPELLS["Mariner's Curse"]
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Marvelous Mount':
    Pathfinder2E.SPELLS['Phantom Steed']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Description=' +
      '"R30\' Conjures a magical mount (Armor Class %{armorClass}, HP 10, 40\' Speed) that can be ridden only by a designated creature for 8 hr (<b>heightened 3rd</b> mount can walk on water; <b>4th</b> mount has 60\' Speed; <b>5th</b> mount can also fly for 1 rd; <b>6th</b> mount has 80\' Speed and can fly)"',
  'Mask Of Terror':
    Pathfinder2E.SPELLS['Mask Of Terror']
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Massacre':
    Pathfinder2E.SPELLS.Massacre
    .replace(/School=\w*/, '')
    .replace('Necromancy,Negative', 'Concentrate,Manipulate,Void')
    .replaceAll('negative', 'void'),
  'Mending':
    Pathfinder2E.SPELLS.Mending
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('level', 'rank'),
  'Message':
    Pathfinder2E.SPELLS.Message
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Subtle,'),
  'Metamorphosis':
    Pathfinder2E.SPELLS.Shapechange
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('level', 'rank'),
  'Migration':
    Pathfinder2E.SPELLS['Wind Walk']
    .replace(/School=\w*/, '') + ' ' +
    'Traits=Concentrate,Manipulate,Polymorph'
    .replace('clouds', 'animals')
    .replace('MPH', 'MPH, have immunity to extreme cold and heat, and can transform into a Tiny or Small animal'),
  'Mind Probe':
    Pathfinder2E.SPELLS['Mind Probe']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Mind Reading':
    Pathfinder2E.SPELLS['Mind Reading']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Mindlink':
    Pathfinder2E.SPELLS.Mindlink
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('Traditions=', 'Traditions=Arcane,'),
  'Mirage':
    Pathfinder2E.SPELLS['Hallucinatory Terrain']
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Mislead':
    Pathfinder2E.SPELLS.Mislead
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Mist':
    Pathfinder2E.SPELLS['Obscuring Mist']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Moment Of Renewal':
    Pathfinder2E.SPELLS['Moment Of Renewal']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Monstrosity Form':
    Pathfinder2E.SPELLS['Monstrosity Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('purple', 'cave'),
  'Moon Frenzy':
    Pathfinder2E.SPELLS['Moon Frenzy']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Stoneskin':
    Pathfinder2E.SPELLS.Stoneskin
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Mystic Armor':
    Pathfinder2E.SPELLS['Mage Armor']
    .replace(/School=\w*/, '') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal',
  'Nature Incarnate':
    Pathfinder2E.SPELLS['Nature Incarnate']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  "Nature's Pathway":
    Pathfinder2E.SPELLS['Tree Stride']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate,Mental')
    .replace(' of the same species', ''),
  'Never Mind':
    Pathfinder2E.SPELLS.Feeblemind
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Nightmare':
    Pathfinder2E.SPELLS.Nightmare
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Noise Blast':
    Pathfinder2E.SPELLS['Sound Burst']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Traditions=', 'Traditions=Arcane,'),
  'Oaken Resilience':
    Pathfinder2E.SPELLS.Barkskin
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate,Wood')
    .replace('Traditions=', 'Traditions=Arcane,'),
  'One With Plants':
    Pathfinder2E.SPELLS['Tree Shape']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate,Wood')
    .replace('8 hr', '8 hr or merges into plant matter for 10 min'),
  'One With Stone':
    Pathfinder2E.SPELLS['Meld Into Stone']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate,Polymorph') + ' ' +
    'Description=' +
      '"Self becomes a block of stone with Armor Class 23 for 8 hr or merges into stone for 10 min"',
  "Outcast's Curse":
    Pathfinder2E.SPELLS["Outcast's Curse"]
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Overwhelming Presence':
    Pathfinder2E.SPELLS['Overwhelming Presence']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Paralyze':
    Pathfinder2E.SPELLS.Paralyze
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Paranoia':
    Pathfinder2E.SPELLS.Paranoia
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Peaceful Bubble':
    Pathfinder2E.SPELLS['Private Sanctum']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate')
    .replace('until next daily prep', 'for 24 hours; sleeping within for 8 hours reduces doomed conditions by 2'),
  'Peaceful Rest':
    Pathfinder2E.SPELLS['Gentle Repose']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Pest Form':
    Pathfinder2E.SPELLS['Pest Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Pest Cache':
    'Level=1 ' +
    'Traits=Extradimensional,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description="Moves companion into a pocket dimension for up to 8 hours"',
  'Petrify':
    Pathfinder2E.SPELLS['Flesh To Stone']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Earth,Manipulate'),
  'Phantasmagoria':
    Pathfinder2E.SPELLS.Weird
    .replace(/School=\w*/, '')
    .replace('Emotion,Fear', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R120\' Inflicts 16d6 HP mental and confused for 1 rd on all targets within range (<b>save Will</b> inflicts half HP loss of reactions for 1 rd; critical success negates; critical failure inflicts double HP and confused for 1 min)"',
  'Phantasmal Calamity':
    Pathfinder2E.SPELLS['Phantasmal Calamity']
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Phantasmal Minion':
    Pathfinder2E.SPELLS['Unseen Servant']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Phantom Pain':
    Pathfinder2E.SPELLS['Phantom Pain']
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Pinpoint':
    Pathfinder2E.SPELLS['Discern Location']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Planar Palace':
    Pathfinder2E.SPELLS['Magnificent Mansion']
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Planar Seal':
    Pathfinder2E.SPELLS['Dimensional Lock']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Planar Tether':
    Pathfinder2E.SPELLS['Dimensional Anchor']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Plant Form':
    Pathfinder2E.SPELLS['Plant Form']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate,Wood'),
  'Possession':
    Pathfinder2E.SPELLS.Possession
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Prestidigitation':
    Pathfinder2E.SPELLS.Prestidigitation
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Project Image':
    Pathfinder2E.SPELLS['Project Image']
    .replace(/School=\w*/, '')
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Protection':
    Pathfinder2E.SPELLS.Protection
    .replace(/School=\w*/, '') + ' ' +
    'Traits=Concentrate,Manipulate ' +
    'Description=' +
      '"Touched gains +1 Armor Class and saves for 1 min (<b>heightened 3rd</b> effects allies in a 10\' emanation around target)"',
  'Pummeling Rubble':
    'Level=1 ' +
    'Traits=Concentrate,Earth,Manipulate ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' cone inflicts 2d4 HP bludgeon and a 5\' push (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and a 10\' push) (<b>heightened +1</b> inflicts +2d4 HP)"',
  'Punishing Winds':
    Pathfinder2E.SPELLS['Punishing Winds']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Quandry':
    Pathfinder2E.SPELLS.Maze
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate')
    .replace('maze', 'puzzle room')
    .replace('Survial or', 'Thievery, Occultism, or'),
  'Raise Dead':
    Pathfinder2E.SPELLS['Raise Dead']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Read Aura':
    Pathfinder2E.SPELLS['Read Aura']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('the related school of magic', 'gives +2 to Identify Magic on it'),
  'Read Omens':
    Pathfinder2E.SPELLS['Read Omens']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Regenerate':
    Pathfinder2E.SPELLS.Regenerate
    .replace(/School=\w*/, '')
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality'),
  'Remake':
    Pathfinder2E.SPELLS.Remake
    .replace(/School=\w*/, '')
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Repulsion':
    Pathfinder2E.SPELLS.Repulsion
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Resist Energy':
    Pathfinder2E.SPELLS['Resist Energy']
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Retrocognition':
    Pathfinder2E.SPELLS.Retrocognition
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Occult',
  'Revealing Light':
    Pathfinder2E.SPELLS['Faerie Fire']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Description=' +
      '"R120\' 10\' burst dazzles makes concealed creatures visible and invisible creatures concealed for 1 min (<b>save Reflex</b> effects last 2 rd; critical success negates; critical failure effects last 10 min)"',
  'Revival':
    Pathfinder2E.SPELLS.Revival
    .replace(/School=\w*/, '')
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality'),
  'Rewrite Memory':
    Pathfinder2E.SPELLS['Modify Memory']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Ring Of Truth':
    // Note: assume casting time remains the same
    Pathfinder2E.SPELLS['Zone Of Truth']
    .replace(/School=\w*/, '')
    .replace('Enchantment', 'Concentrate,Manipulate,Detection')
    .replace(/; critical failure[^)]/, ''),
  'Runic Body':
    Pathfinder2E.SPELLS['Magic Fang']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('for 1 min', 'for 1 min (<b>heightened 6th</b> gives +2 attack; <b>9th</b> gives +3 attack') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal',
  'Runic Weapon':
    Pathfinder2E.SPELLS['Magic Weapon']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('for 1 min', 'for 1 min (<b>heightened 6th</b> gives +2 attack; <b>9th</b> gives +3 attack') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal',
  'Safe Passage':
    'Level=3 ' +
    'Traits=Concentrate,Manipulate ' +
    'Traditions=Arcane,Divine,Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"10\'x10\'x60\' area gives +2 Armor Class, +2 saves, and resistance 5 to damage from the terrain and environment while sustained for up to 1 min (<b>heightened 5th</b> gives resistance 10 and extends area to 120\'; <b>8th</b> gives resistance 15 and extends area to 500\'"',
  'Sanctuary':
    Pathfinder2E.SPELLS.Sanctuary
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Scouting Eye':
    Pathfinder2E.SPELLS['Prying Eye']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Scrying':
    Pathfinder2E.SPELLS.Scrying
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'See The Unseen':
    Pathfinder2E.SPELLS['See Invisibility']
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Seize Soul':
    Pathfinder2E.SPELLS['Bind Soul']
    .replace(/School=\w*/, '')
    .replace('Evil,Necromancy', 'Unholy,Concentrate,Manipulate'),
  'Sending':
    Pathfinder2E.SPELLS.Sending
    .replace(/School=\w*/, '')
    .replace('Divination', 'Concentrate,Manipulate'),
  'Shadow Blast':
    Pathfinder2E.SPELLS['Shadow Blast']
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('5d8', '6d8'),
  'Shape Stone':
    Pathfinder2E.SPELLS['Shape Stone']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Shape Wood':
    Pathfinder2E.SPELLS['Shape Wood']
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate,Wood') + ' ' +
    'Traditions=Arcane,Primal',
  'Share Life':
    Pathfinder2E.SPELLS['Shield Other']
    .replace(/School=\w*/, '')
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Shatter':
    Pathfinder2E.SPELLS.Shatter
    .replace(/School=\w*/, '')
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Shield':
    Pathfinder2E.SPELLS.Shield
    .replace(/School=\w*/, '')
    .replace('Abjuration', 'Concentrate')
    .replace(/\(.*\)/, '(<b>heightened +2</b> gives Hardness +5)'),
  'Shrink':
    Pathfinder2E.SPELLS.Shrink
    .replace(/School=\w*/, '')
    .replace('Transmutation', 'Concentrate,Manipulate'),

  // TODO
  'Commanding Lash':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Courageous Anthem':
    Pathfinder2E.SPELLS['Inspire Courage']
    .replace('School=Enchantment', '')
    .replace('Enchantment', 'Concentrate'),
  'Dimensional Steps':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Downpour':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Dread Aura':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Elemental Tempest':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Energy Absorption':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Force Bolt':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Hand Of The Apprentice':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Heal Animal':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Impaling Briars':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Invisibility Cloak':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Life Siphon':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Malignant Sustenance':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Mountain Resilience':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Precious Metals':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Primal Summons':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Shifting Form':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Storm Lord':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Stormwind Flight':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Tempest Surge':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Unfettered Movement':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Vampiric Exsanguination':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Ventriloquism':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Vigilant Eye':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Vitality Lash':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Wall Of Wind':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Wild Morph':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Zeal For Battle':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Glimpse The Truth':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Trickster's Twin":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Traveler's Transit":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Safeguard Secret':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Protector's Sphere":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Captivating Adoration':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Retributive Pain':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Shared Nightmare':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Nature's Bounty":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Touch Of The Moon':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Enduring Might':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Mystic Beacon':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Lucky Break':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Know The Enemy':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Take Its Course':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Rebuke Death':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Word Of Freedom':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Flame Barrier':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Tempt Fate':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Unity':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Localized Quake':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Dreamer's Call":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Destructive Aura':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Eradicate Undeath':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Artistic Flourish':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Delusional Pride':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Competitive Edge':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Disperse Into Air':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Weapon Surge':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Appearance Of Wealth':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Tidal Surge':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Touch Of Undeath':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Touch Of Obedience':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Word Of Truth':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Sudden Shift':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Agile Feet':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Dazzling Flash':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Protector's Sacrifice":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Perfected Mind':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Charming Touch':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Savor The Sting':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Waking Nightmare':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Vibrant Thorns':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Moonbeam':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Athletic Rush':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Magic's Vessel":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Bit Of Luck':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Overstuff':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Healer's Blessing":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Unimpeded Stride':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Fire Ray':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Read Fate':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Soothing Words':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Hurtling Stone':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Sweet Dream':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Cry Of Destruction':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Death's Call":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Cloak Of Shadow':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Veil Of Confidence':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Face In The Crowd':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Pushing Gust':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Fatal Aria':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Soothing Ballad':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Allegro':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'House Of Imaginary Walls':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Dirge Of Doom':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Triple Time':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  "Loremaster's Etude":
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Lingering Composition':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Soothe':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Counter Performance':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Regenerate':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Tangling Creepers':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Plant Form':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Silence':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Protective Wards':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Fortify Summoning':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Earthworks':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Charming Push':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Scramble Body':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Translocate':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Stoke The Heart':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Clinging Ice':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Nudge Fate':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Shroud Of Night':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Discern Secrets':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Evil Eye':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Wilding Word':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Untamed Form':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Cornucopia':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Untamed Shift':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Pulse Of Civilization':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Darkened Sight':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Perfected Body':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Vital Luminance':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Whispering Quiet':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Creative Splash':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Ignite Ambition':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Pied Piping':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Symphony Of The Unfettered Heart':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Ode To Ouroboros':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Fortissimo Composition':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Song Of Marching':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Phantasmal Minion':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Revealing Light':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Song Of Strength':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Sure Strike':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Unhampered Passage':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"',
  'Uplifting Overture':
    'Level=1 ' +
    'Traits=Evocation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"TODO"'
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
  'Spear':Pathfinder2E.WEAPONS.Spear + ' Traits=Monk,Thrown',
  'Spiked Gauntlet':Pathfinder2E.WEAPONS['Spiked Gauntlet'],
  'Staff':Pathfinder2E.WEAPONS.Staff + ' Traits=Monk,"Two-hand d8"',

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
    'Traits=Monk,Shove,"Two-Hand d10",Uncommon,"Versatile P"',
  'Kukri':Pathfinder2E.WEAPONS.Kukri,
  'Nunchaku':Pathfinder2E.WEAPONS.Nunchaku,
  'Orc Knuckle Dragger':Pathfinder2E.WEAPONS['Orc Knuckle Dragger'],
  'Sai':Pathfinder2E.WEAPONS.Sai,
  'Spiked Chain':Pathfinder2E.WEAPONS['Spiked Chain'],
  'Temple Sword':Pathfinder2E.WEAPONS['Temple Sword'],
  'Wakizashi':
    'Category=Martial Price=1 Damage="1d4 S" Bulk=L Hands=1 Group=Sword ' +
    'Traits=Agile,"Deadly d8",Finesse,Uncommon,"Versatile P"',

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
    Pathfinder2E.WEAPONS['Lesser Acid Flask'] + ' Traits=Acid,Bomb,Splash',
  "Lesser Alchemist's Fire":
    Pathfinder2E.WEAPONS["Lesser Alchemist's Fire"] + ' Traits=Fire,Bomb,Splash',
  'Arbalest':
    // Price changed by errata
    'Category=Martial Price=8 Damage="1d10 P" Bulk=2 Hands=2 Group=Crossbow ' +
    'Traits=Backstabber,"Reload 1" Range=110',
  'Bola':
    'Category=Martial Price=0.5 Damage="1d6 B" Bulk=L Hands=1 Group=Sling ' +
    'Traits=Nonlethal,"Ranged Trip",Thrown Range=20',
  'Composite Longbow':Pathfinder2E.WEAPONS['Composite Longbow'],
  'Composite Shortbow':Pathfinder2E.WEAPONS['Composite Shortbow'],
  'Longbow':Pathfinder2E.WEAPONS.Longbow,
  'Shortbow':Pathfinder2E.WEAPONS.Shortbow,

  'Halfling Sling Staff':Pathfinder2E.WEAPONS['Halfling Sling Staff'],
  'Shuriken':Pathfinder2E.WEAPONS.Shuriken,

   // Core2
  'Adze':
    'Category=Martial Price=1 Damage="1d10 S" Bulk=2 Hands=2 Group=Axe ' +
    'Traits=Forceful,Sweep,Tripkee',
  'Cruuk':
    'Category=Martial Price=0.4 Damage="1d6 B" Bulk=L Hands=1 Group=Club ' +
    'Traits=Shove,Thrown,Tripkee Range=30',
  'Hand Adze':
    'Category=Martial Price=0.5 Damage="1d4 S" Bulk=L Hands=1 Group=Axe ' +
    'Traits=Agile,Finesse,Sweep,Thrown,Tripkee Range=10',

  'Breaching Pike':
    'Category=Martial Price=8 Damage="1d6 P" Bulk=1 Hands=1 Group=Spear ' +
    'Traits=Uncommon,Hobgoblin,Razing,Reach',
  'Claw Blade':
    'Category=Martial Price=2 Damage="1d4 S" Bulk=L Hands=1 Group=Knife ' +
    'Traits=Uncommon,Agile,Catfolk,"Deadly d8",Disarm,Finesse,"Versatile P"',
  'Fangwire':
    'Category=Martial Price=4 Damage="1d4 S" Bulk=L Hands=1 Group=Brawling ' +
    'Traits=Uncommon,Agile,Backstabber,"Deadly d8",Finesse,Grapple,Kobold',
  'Khopesh':
    'Category=Martial Price=2 Damage="1d8 S" Bulk=1 Hands=1 Group=Sword ' +
    'Traits=Uncommon,Trip',
  'Mambele':
    'Category=Martial Price=0.6 Damage="1d6 S" Bulk=1 Hands=1 Group=Axe ' +
    'Traits=Uncommon,"Deadly d8",Disarm,Thrown Range=20',
  'Tengu Gale Blade':
    'Category=Martial Price=4 Damage="1d6 S" Bulk=L Hands=1 Group=Sword ' +
    'Traits=Uncommon,Agile,Disarm,Finesse,Tengu',

  'Capturing Spetum':
    'Category=Advanced Price=9 Damage="1d10 P" Bulk=2 Hands=2 Group=Polearm ' +
    'Traits=Uncommon,Hampering,Hobgoblin,Reach,Trip',
  'Flying Talon':
    'Category=Advanced Price=6 Damage="1d4 P" Bulk=1 Hands=1 Group=Flail ' +
    'Traits=Uncommon,Agile,Finesse,Kobold,"Ranged Trip",Tethered,Thrown,Trip ' +
    'Range=10',
  'Spirit Thresher':
    'Category=Advanced Price=2 Damage="1d12 B" Bulk=2 Hands=2 Group=Flail ' +
    'Traits=Uncommon,Kholo,Sweep,"Versatile S"',
  // TODO modular damage
  'Tricky Pick':
    'Category=Advanced Price=10 Damage="1d6 B" Bulk=1 Hands=1 Group=Pick ' +
    'Traits=Uncommon,Backstabber,"Fatal d10",Kobold,Modular',
  'Whip Claw':
    'Category=Advanced Price=5 Damage="1d6 S" Bulk=1 Hands=2 Group=Flail ' +
    'Traits=Uncommon,Catfolk,Finesse,Hampering,Reach',

  'Thunder Sling':
    'Category=Martial Price=5 Damage="1d6 P" Bulk=L Hands=1 Group=Sling ' +
    'Traits=Uncommon,Agile,Propulsive,Tengu Range=50',
  'Daikyu':
    'Category=Advanced Price=8 Damage="1d8 P" Bulk=2 Hands=1 Group=Bow ' +
    'Traits=Uncommon,Forceful,Propulsive Range=80'
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
  QuilvynUtils.checkAttrTable(heritages, ['Traits']);
  Pathfinder2E.identityRules
    (rules, {}, ancestries, backgrounds, classes, deities);
  for(let h in heritages)
    rules.choiceRules(rules, 'Heritage', h, heritages[h]);
  rules.defineRule
    ('choiceCount.Versatile Heritage', 'features.Versatile Heritage', '=', '1');
  rules.defineRule('featCount.Ancestry', 'featureNotes.lineage', '+=', '1');
  rules.defineRule('selectableFeatureCount.Versatile Heritage',
    'features.Versatile Heritage', '=', '1'
  );
  QuilvynRules.validAllocationRules
    (rules, 'versatileHeritage', 'choiceCount.Versatile Heritage', 'versatileHeritagesAllocated');
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
      QuilvynUtils.getAttrValueArray(attrs, 'Traits')
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
      QuilvynUtils.getAttrValueArray(attrs, 'Traits')
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
      QuilvynUtils.getAttrValueArray(attrs, 'Traits')
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
  else if(type == 'Heritage') {
    Pathfinder2ERemaster.heritageRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Traits')
    );
    Pathfinder2ERemaster.heritageRulesExtra(rules, name);
  } else if(type == 'Language')
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
    let traits = QuilvynUtils.getAttrValueArray(attrs, 'Traits');
    let isCantrip = traits.includes('Cantrip');
    let isFocus = traits.includes('Focus');
    trads.forEach(t => {
      let spellName =
        name + ' (' + t.charAt(0) + (isCantrip ? 'C' : '') + level + (isFocus ? ' Foc' : '') + ')';
      Pathfinder2ERemaster.spellRules(rules, spellName,
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
    Pathfinder2ERemaster.weaponRules(rules, name,
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
  selectables = rules.getChoices('selectableFeatures');
  for(let s in selectables) {
    if(selectables[s].includes('Heritage'))
      rules.addChoice('ancestryHeritages', s, selectables[s]);
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
Pathfinder2ERemaster.ancestryRulesExtra = function(rules, name) {
  Pathfinder2E.ancestryRulesExtra(rules, name);
  if(name == 'Catfolk') {
    Pathfinder2E.weaponRules(
      rules, 'Claws', 'Unarmed', 0, '1d6 S', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Claws', 'combatNotes.clawedCatfolk', '=', '1');
  } else if(name == 'Human') {
    rules.defineRule('skillNotes.skilledHeritageHuman', 'level', '?', 'null');
    rules.defineRule('skillNotes.skilledHuman',
      'level', '=', 'source<5 ? "Trained" : "Expert"'
    );
  } else if(name == 'Kholo') {
    Pathfinder2E.weaponRules(
      rules, 'Jaws', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling', ['Unarmed'], null
    );
    rules.defineRule('weapons.Jaws', 'combatNotes.bite', '=', '1');
  } else if(name == 'Kobold') {
    Pathfinder2E.weaponRules(
      rules, 'Jaws', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Unarmed', 'Finesse'], null
    );
    rules.defineRule('weapons.Jaws', 'combatNotes.strongjawKobold', '=', '1');
  } else if(name == 'Leshy') {
    Pathfinder2E.weaponRules(
      rules, 'Spines', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Spines', 'combatNotes.cactusLeshy', '=', '1');
  } else if(name == 'Lizardfolk') {
    Pathfinder2E.weaponRules(
      rules, 'Claws', 'Unarmed', 0, '1d6 S', 0, 0, 'Brawling',
      ['Unarmed', 'Agile', 'Finesse'], null
    );
    rules.defineRule('weapons.Claws', 'combatNotes.claws', '=', '1');
  } else if(name == 'Ratfolk') {
    Pathfinder2E.weaponRules(
      rules, 'Jaws', 'Unarmed', 0, '1d4 P', 0, 0, 'Brawling',
      ['Unarmed', 'Agile', 'Finesse'], null
    );
    rules.defineRule('weapons.Jaws', 'combatNotes.sharpTeeth', '=', '1');
  } else if(name == 'Tengu') {
    Pathfinder2E.weaponRules(
      rules, 'Beak', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Beak', 'combatNotes.sharpBeak', '=', '1');
    Pathfinder2E.weaponRules(
      rules, 'Talons', 'Unarmed', 0, '1d4 S', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Unarmed', 'Versatile P'], null
    );
    rules.defineRule('weapons.Talons', 'combatNotes.talonedTengu', '=', '1');
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
  if(name == 'Alchemist') {
    // Suppress legacy note
    rules.defineRule('skillNotes.perpetualInfusions', '', '=', 'null');
  } else if(name == 'Cleric') {
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
    rules.deityStats.areas = {};
    rules.deityStats.attributes = {};
    rules.deityStats.sanctification = {};
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
  if(name == 'Angelkin') {
    rules.defineRule('languages.Empyrean', 'skillNotes.angelkin', '=', '1');
  } else if(name == 'Bestial Manifestation (Claw)') {
    // TODO different traits
    Pathfinder2E.weaponRules(
      rules, 'Claws', 'Unarmed', 0, '1d4 S', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Unarmed', 'Versatile P'], null
    );
    rules.defineRule
      ('weapons.Claws', 'combatNotes.bestialManifestation(Claw)', '=', '1');
  } else if(name == 'Bestial Manifestation (Hoof)') {
    Pathfinder2E.weaponRules(
      rules, 'Hoof', 'Unarmed', 0, '1d6 B', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Hoof', 'combatNotes.bestialManifestation(Hoof)', '=', '1');
  } else if(name == 'Bestial Manifestation (Jaws)') {
    Pathfinder2E.weaponRules(
      rules, 'Jaws', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Jaws', 'combatNotes.bestialManifestation(Jaws)', '=', '1');
  } else if(name == 'Bestial Manifestation (Tail)') {
    Pathfinder2E.weaponRules(
      rules, 'Tail', 'Unarmed', 0, '1d4 B', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Tail', 'combatNotes.bestialManifestation(Tail)', '=', '1');
  } else if(name == 'Big Mouth') {
    rules.defineRule('featureNotes.cheekPouches',
      'featureNotes.bigMouth', '=', 'null' // italics
    );
  } else if(name == 'Breath Like Honey') {
    rules.defineRule('skillNotes.sweetbreathKholo',
      'skillNotes.breathLikeHoney', '=', 'null' // italics
    );
  } else if(name == 'Breath Of The Dragon') {
    rules.defineRule('combatNotes.breathOfTheDragon',
      'features.Adamantine Exemplar', '=', '"bludgeoning"',
      'features.Conspirator Exemplar', '=', '"poison"',
      'features.Diabolic Exemplar', '=', '"fire"',
      'features.Empyreal Exemplar', '=', '"spirit"',
      'features.Fortune Exemplar', '=', '"force"',
      'features.Horned Exemplar', '=', '"poison"',
      'features.Mirage Exemplar', '=', '"mental"',
      'features.Omen Exemplar', '=', '"mental"'
    );
    rules.defineRule('combatNotes.breathOfTheDragon.1',
      'features.Breath Of The Dragon', '=', '"Reflex"',
      'features.Conspirator Exemplar', '=', '"Fortitude"',
      'features.Horned Exemplar', '=', '"Fortitude"',
      'features.Mirage Exemplar', '=', '"Will"',
      'features.Omen Exemplar', '=', '"Will"'
    );
  } else if(name == 'Crunch') {
    rules.defineRule
      ('weaponDieSidesBonus.Jaws', 'combatNotes.crunch', '^=', '2');
  } else if(name == 'Double, Double') {
    rules.defineRule('skillNotes.cauldron',
      'skillNotes.double,Double', '=', 'null' // italics
    );
  } else if(name == 'Draconic Aspect (Claw)') {
    Pathfinder2E.weaponRules(
      rules, 'Claws', 'Unarmed', 0, '1d4 S', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Jaws', 'combatNotes.draconicAspect(Jaws)', '=', '1');
  } else if(name == 'Draconic Aspect (Jaws)') {
    Pathfinder2E.weaponRules(
      rules, 'Jaws', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Forceful', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Jaws', 'combatNotes.draconicAspect(Jaws)', '=', '1');
  } else if(name == 'Draconic Aspect (Tail)') {
    Pathfinder2E.weaponRules(
      rules, 'Tail', 'Unarmed', 0, '1d6 B', 0, 0, 'Brawling',
      ['Sweep', 'Trip', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Tail', 'combatNotes.draconicAspect(Tail)', '=', '1');
  } else if(name == 'Draconic Resistance') {
    rules.defineRule('saveNotes.draconicResistance',
      'features.Adamantine Exemplar', '=', '"choice of bludgeoning, acid, cold, fire, electricity, or sonic"',
      'features.Conspirator Exemplar', '=', '"poison"',
      'features.Diabolic Exemplar', '=', '"fire"',
      'features.Empyreal Exemplar', '=', '"spirit"',
      'features.Fortune Exemplar', '=', '"force"',
      'features.Horned Exemplar', '=', '"poison"',
      'features.Mirage Exemplar', '=', '"mental"',
      'features.Omen Exemplar', '=', '"mental"'
    );
  } else if(name == 'Fangs') {
    Pathfinder2E.weaponRules(
      rules, 'Fangs', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Fangs', 'combatNotes.fangs', '=', '1');
  } else if(name == 'Formidable Breath') {
    rules.defineRule('combatNotes.breathOfTheDragon',
      'combatNotes.formidableBreath', '=', 'null' // italics
    );
  } else if(name == "Gecko's Grip") {
    rules.defineRule("abilityNotes.gecko'sGrip",
      'features.Cliffscale Lizardfolk', '?', 'source'
    );
    rules.defineRule("featureNotes.gecko'sGrip",
      'features.Cliffscale Lizardfolk', '?', '!source'
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
  } else if(name == 'Hag Claws') {
    Pathfinder2E.weaponRules(
      rules, 'Claws', 'Unarmed', 0, '1d4 S', 0, 0, 'Brawling',
      ['Agile', 'Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Claws', 'combatNotes.hagClaws', '=', '1');
  } else if(name.startsWith('Iruxi Armaments')) {
    if(name == 'Iruxi Armaments (Claws)') {
      rules.defineRule('weaponDieSidesBonus.Claws',
        'combatNotes.iruxiArmaments(Claws)', '^=', '2'
      );
    } else if(name == 'Iruxi Armaments (Fangs)') {
      Pathfinder2E.weaponRules(
        rules, 'Fangs', 'Unarmed', 0, '1d8 S', 0, 0, 'Brawling', ['Unarmed'],
        null
      );
      rules.defineRule
        ('weapons.Fangs', 'combatNotes.iruxiArmaments(Fangs)', '=', '1');
    } else if(name == 'Iruxi Armaments (Tail)') {
      Pathfinder2E.weaponRules(
        rules, 'Tail', 'Unarmed', 0, '1d6 B', 0, 0, 'Brawling',
        ['Unarmed', 'Sweep'], null
      );
      rules.defineRule
        ('weapons.Tail', 'combatNotes.iruxiArmaments(Tail)', '=', '1');
    }
    rules.defineRule('combatNotes.' + prefix + '-1', 'level', '?', 'source>=5');
  } else if(name == 'Jinx Glutton') {
    rules.defineRule(
      'combatNotes.eatFortune', 'combatNotes.jinxGlutton', '=', 'null'// italics
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
  } else if(name == 'Reliable Luck') {
    rules.defineRule
      ("saveNotes.cat'sLuck", 'saveNotes.reliableLuck', '=', 'null'); // italics
  } else if(name == 'Saber Teeth') {
    // TODO traits differ
    Pathfinder2E.weaponRules(
      rules, 'Jaws', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Unarmed'], null
    );
    rules.defineRule('weapons.Jaws', 'combatNotes.saberTeeth', '=', '1');
  } else if(name == 'Scaly Hide') {
    rules.defineRule('combatNotes.scalyHide.1',
      'armorCategory', '?', 'source=="Unarmored"',
      'combatNotes.scalyHide', '=', '2'
    );
    rules.defineRule('armorClass', 'combatNotes.scalyHide.1', '+', null);
    // NOTE: apparently reduced dex cap only applies if unarmored
    rules.defineRule('armorDexterityCap', 'combatNotes.scalyHide.1', 'v', '3');
  } else if(name == 'Shinstabber') {
    rules.defineRule('combatNotes.overcrowd',
      'combatNotes.shinstabber', '=', 'null' // italics
    );
  } else if(name == 'Slag May') {
    Pathfinder2E.weaponRules(
      rules, 'Claws', 'Unarmed', 0, '1d4 S', 0, 0, 'Brawling',
      ['Grapple', 'Unarmed'], null
    );
    rules.defineRule('weapons.Claws', 'combatNotes.slagMay', '=', '1');
    rules.defineRule
      ('weaponDieSidesBonus.Claws', 'combatNotes.slagMay', '^=', '2');
  } else if(name == 'Tengu Feather Fan') {
    rules.defineRule('magicNotes.tenguFeatherFan',
      'features.Tengu Feather Fan', '=', '1',
      "magicNotes.windGod'sFan", '+', '1',
      "magicNotes.thunderGod'sFan", '+', '1'
    );
  } else if(name == 'Tusks') {
    Pathfinder2E.weaponRules(
      rules, 'Tusks', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
      ['Finesse', 'Unarmed'], null
    );
    rules.defineRule('weapons.Tusks', 'combatNotes.tusks', '=', '1');
  } else if(name == 'Vicious Incisors') {
    rules.defineRule
      ('weaponDieSidesBonus.Jaws', 'combatNotes.viciousIncisors', '^=', '2');
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

/*
 * TODO
 */
Pathfinder2ERemaster.heritageRules = function(rules, name, traits) {
  Pathfinder2E.featureListRules
    (rules, ['1:' + name + ':Versatile Heritage'], 'Versatile Heritage',
     'heritageLevel', true);
  let selectables = rules.getChoices('selectableFeatures');
  for(let s in selectables) {
    if(selectables[s].includes('Heritage'))
      rules.addChoice('ancestryHeritages', s, selectables[s]);
  }
  rules.defineRule('heritageLevel', 'features.' + name, '=', '1');
  rules.defineRule
    ('heritage', 'features.' + name, '=', '"' + name + ' " + dict.ancestry');
  rules.defineRule
    ('versatileHeritagesAllocated', 'features.' + name, '+=', '1');
};

Pathfinder2ERemaster.heritageRulesExtra = function(rules, name) {
  if(name == 'Dragonblood') {
    rules.defineRule('dragonbloodLevel',
      'features.Dragonblood', '?', null,
      'level', '=', null
    );
    rules.defineRule('selectableFeatureCount.Draconic Exemplar',
      'featureNotes.draconicExemplar', '=', '1'
    );
    // TODO Probably put this in HERITAGES and change heritageRules
    Pathfinder2E.featureListRules
      (rules, [
       '1:Adamantine Exemplar:Draconic Exemplar',
       '1:Conspirator Exemplar:Draconic Exemplar',
       '1:Diabolic Exemplar:Draconic Exemplar',
       '1:Empyreal Exemplar:Draconic Exemplar',
       '1:Fortune Exemplar:Draconic Exemplar',
       '1:Horned Exemplar:Draconic Exemplar',
       '1:Mirage Exemplar:Draconic Exemplar',
       '1:Omen Exemplar:Draconic Exemplar'
       ], 'Draconic Examplar', 'dragonbloodLevel', true);
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

/* Returns an array of plugins upon which this one depends. */
Pathfinder2ERemaster.getPlugins = function() {
  return [Pathfinder2E];
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
