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
    'selectableFeatures:Heritage,set,selectableHeritages',
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
  'Gnome':
    Pathfinder2E.ANCESTRIES.Gnome
    .replace('Sylvan', 'Fey'),
  'Goblin':Pathfinder2E.ANCESTRIES.Goblin,
  'Halfling':
    Pathfinder2E.ANCESTRIES.Halfling
    .replace('Selectables=', 'Selectables="1:Jinxed Halfling:Heritage",'),
  'Human':
    Pathfinder2E.ANCESTRIES.Human
    .replace('"1:Half-Elf:Heritage","1:Half-Orc:Heritage",', '')
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
      '"1:Vine Leshy:Heritage" ' +
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
      '"1:Winter Orc:Heritage" ' +
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
      '"1:Winter Catfolk:Heritage" ' +
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
      '"1:Warrenbred Hobgoblin:Heritage" ' +
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
      '"1:Witch Kholo:Heritage" ' +
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
      '"1:Venomtail Kobold:Heritage" ' +
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
      '"1:Woodstalker Lizardfolk:Heritage" ' +
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
      '"1:Tunnel Rat:Heritage" ' +
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
      '"1:Wavediver Tengu:Heritage" ' +
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
      '"1:Windweb Tripkee:Heritage" ' +
    'Languages=Common,Tripkee ' +
    'Traits=Humanoid,Tripkee'
};
for(let a in Pathfinder2ERemaster.ANCESTRIES)
  Pathfinder2ERemaster.ANCESTRIES[a] =
    Pathfinder2ERemaster.ANCESTRIES[a].replaceAll('Ability', 'Attribute');
Pathfinder2ERemaster.ARMORS = Object.assign({}, Pathfinder2E.ARMORS);
// Convert minimum strength from scores to modifiers
for(let a in Pathfinder2ERemaster.ARMORS) {
  let m = Pathfinder2ERemaster.ARMORS[a].match(/Str=(\d+)/);
  if(m) {
    let strMod = Math.floor((+m[1] - 10) / 2);
    Pathfinder2ERemaster.ARMORS[a] =
      Pathfinder2ERemaster.ARMORS[a].replace(/Str=\d+/, 'Str=' + strMod);
  }
}
Pathfinder2ERemaster.BACKGROUNDS =
  Object.assign({}, Pathfinder2E.BACKGROUNDS, {
  'Bandit':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Charisma, Dexterity; Choose 1 from any)",' +
      '"1:Skill Trained (Intimidation; Choose 1 from any Terrain Lore)","1:Group Coercion"',
  'Cook':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Constitution, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Survival; Cooking Lore)","1:Seasoned"',
  'Cultist':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Occultism, Choose 1 from any Deity Lore)","1:Schooled In Secrets"',
  'Raised By Belief':
    'Features=' +
      '"1:Belief Attributes","1:Belief Skills"',
  'Teacher':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Choose 1 from Performance, Society; Academia Lore)",' +
      '"1:Experienced Professional"',
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
});
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
      '"1:Doctrine","2:Cleric Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases","5:Perception Expertise","9:Resolute Faith",' +
      '"11:Reflex Expertise","13:Divine Defense","13:Weapon Specialization",' +
      '"19:Miraculous Spell" ' +
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
      '"1:Superstition Instinct:Instinct"',

  'Champion':
    // Ability => Attribute
    // TODO 1:Spell Trained (Divine) => 1:Spell Trained (Champion)?
    // 1:Champion's Code => null
    // 1:Champion's Reaction => null
    // 1:Deity And Cause => 1:Deity,1:Cause
    // null => 1:Champion's Aura
    // 3:Divine Ally => 3:Blessing Of The Devoted
    // 9:Divine Smite => 9:Relentless Reaction
    // 9:Juggernaut => 9:Sacred Body
    // 11:Exalt => 11:Exalted Reaction
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Champion Key Attribute",' +
      '"features.Dexterity ? 1:Attribute Boost (Dexterity)",' +
      '"features.Strength ? 1:Attribute Boost (Strength)",' +
      '"1:Attribute Boosts",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Fortitude; Will)","1:Save Trained (Reflex)",' +
      '"1:Champion Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Medium Armor; Heavy Armor; Unarmored Defense)",' +
      '"1:Spell Trained (Champion)",' +
      '"1:Class Trained (Champion)",' +
      '"1:Deity","1:Deific Weapon","1:Champion\'s Aura",' +
      '"1:Cause","1:Devotion Spells","1:Shield Block","1:Champion Feats",' +
      '"Has the Anathema feature/1 selection",' +
      '"2:Skill Feats","3:Blessing Of The Devoted","3:General Feats",' +
      '"3:Skill Increases","5:Weapon Expertise","7:Armor Expertise",' +
      '"7:Weapon Specialization","9:Champion Expertise","9:Reflex Expertise",' +
      '"features.Desecration ? 9:Relentless Reaction (Desecration)",' +
      '"features.Grandeur ? 9:Relentless Reaction (Grandeur)",' +
      '"features.Iniquity ? 9:Relentless Reaction (Iniquity)",' +
      '"features.Justice ? 9:Relentless Reaction (Justice)",' +
      '"features.Liberation ? 9:Relentless Reaction (Liberation)",' +
      '"features.Obedience ? 9:Relentless Reaction (Obedience)",' +
      '"features.Redemption ? 9:Relentless Reaction (Redemption)",' +
      '"9:Sacred Body","11:Divine Will","11:Perception Expertise",' +
      '"features.Desecration ? 11:Exalted Reaction (Desecration)",' +
      '"features.Grandeur ? 11:Exalted Reaction (Grandeur)",' +
      '"features.Iniquity ? 11:Exalted Reaction (Iniquity)",' +
      '"features.Justice ? 11:Exalted Reaction (Justice)",' +
      '"features.Liberation ? 11:Exalted Reaction (Liberation)",' +
      '"features.Obedience ? 11:Exalted Reaction (Obedience)",' +
      '"features.Redemption ? 11:Exalted Reaction (Redemption)",' +
      '"13:Armor Mastery","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","17:Champion Mastery",' +
      '"17:Legendary Armor","19:Hero\'s Defiance" ' +
    'Selectables=' +
      '"1:Dexterity:Key Attribute",' +
      '"1:Strength:Key Attribute",' +
      '"1:Holy:Sanctification",' +
      '"1:Unholy:Sanctification",' +
      '"1:Blessed Armament:Blessing Of The Devoted",' +
      '"1:Blessed Shield:Blessing Of The Devoted",' +
      '"1:Blessed Swiftness:Blessing Of The Devoted",' +
      '"features.Unholy ? 1:Desecration:Cause",' +
      '"features.Holy ? 1:Grandeur:Cause",' +
      '"features.Unholy ? 1:Iniquity:Cause",' +
      '"1:Justice:Cause",' +
      '"1:Liberation:Cause",' +
      '"1:Obedience:Cause",' +
      '"features.Holy ? 1:Redemption:Cause"',

  'Investigator':
    'Ability=intelligence HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boost (Intelligence)",' +
      '"1:Attribute Boosts",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Reflex; Will)","1:Save Trained (Fortitude)",' +
      '"1:Investigator Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Class Trained (Investigator)",' +
      '"1:On The Case","1:Clue In","1:Devise A Stratagem","1:Methodology",' +
      '"1:Investigator Feats","1:Strategic Strike","2:Skill Feats",' +
      '"2:Skill Increases","3:General Feats","3:Keen Recollection",' +
      '"3:Skillful Lessons","5:Weapon Expertise","7:Vigilant Senses",' +
      '"7:Weapon Specialization","9:Fortitude Expertise",' +
      '"9:Investigator Expertise","11:Deductive Improvisation",' +
      '"11:Dogged Will","13:Incredible Senses","13:Light Armor Expertise",' +
      '"13:Weapon Mastery","15:Greater Weapon Specialization",' +
      '"15:Savvy Reflexes","17:Greater Dogged Will","19:Light Armor Mastery",' +
      '"19:Master Detective" ' +
    'Selectables=' +
      '"1:Alchemical Sciences:Methodology",' +
      '"1:Empiricism:Methodology",' +
      '"1:Forensic Medicine:Methodology",' +
      '"1:Interrogation:Methodology"',

  'Monk':
    // Ability => Attribute
    // Ki Tradition => Qi Tradition
    'Ability=strength,dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Monk Key Attribute",' +
      '"features.Dexterity ? 1:Attribute Boost (Dexterity)",' +
      '"features.Strength ? 1:Attribute Boost (Strength)",' +
      '"1:Attribute Boosts",' +
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
      '"features.Qi Spells ? 1:Qi Tradition" ' +
    'Selectables=' +
      '"1:Dexterity:Key Attribute",' +
      '"1:Strength:Key Attribute",' +
      '"1:Qi Tradition (Divine):Qi Tradition",' +
      '"1:Qi Tradition (Occult):Qi Tradition",' +
      '"7:Path To Perfection (Fortitude):Perfection",' +
      '"7:Path To Perfection (Reflex):Perfection",' +
      '"7:Path To Perfection (Will):Perfection",' +
      '"features.Path To Perfection (Fortitude) ? 7:Third Path To Perfection (Fortitude):Third Perfection",' +
      '"features.Path To Perfection (Reflex) ? 7:Third Path To Perfection (Reflex):Third Perfection",' +
      '"features.Path To Perfection (Will) ? 7:Third Path To Perfection (Will):Third Perfection"',

  'Oracle':
    'Ability=charisma HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Oracle Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Class Trained (Oracle)",' +
      '"1:Oracle Spellcasting","1:Mystery","1:Revelation Spells",' +
      '"1:Oracular Curse","2:Oracle Feats","2:Skill Feats","3:General Feats",' +
      '"3:Signature Spells","3:Skill Increases","7:Expert Spellcaster",' +
      '"7:Mysterious Resolve","11:Divine Access","11:Major Curse",' +
      '"11:Oracular Senses","11:Weapon Expertise","13:Light Armor Expertise",' +
      '"13:Premonition\'s Reflexes","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Extreme Curse",' +
      '"17:Greater Mysterious Resolve","19:Legendary Spellcaster",' +
      '"19:Oracular Clarity" ' +
    'Selectables=' +
      '"1:Ancestors:Mystery",' +
      '"1:Battle:Mystery",' +
      '"1:Bones:Mystery",' +
      '"1:Cosmos:Mystery",' +
      '"1:Flames:Mystery",' +
      '"1:Life:Mystery",' +
      '"1:Lore:Mystery",' +
      '"1:Tempest:Mystery" ' +
    'SpellSlots=' +
      'DC1:5@1,' +
      'D1:3@1;4@2,' +
      'D2:3@3;4@4,' +
      'D3:3@5;4@6,' +
      'D4:3@7;4@8,' +
      'D5:3@9;4@10,' +
      'D6:3@11;4@12,' +
      'D7:3@13;4@14,' +
      'D8:3@15;4@16,' +
      'D9:3@17;4@18,' +
      'D10:1@19',

  'Sorcerer':
    // Ability => Attribute
    // null => 1:Class Trained (Sorcerer)
    // null => 1:Sorcerous Potency
    // 17:Resolve => 17:Majestic Will
    // added Elemental (Metal) and Elemental (Wood) bloodlines
    // Draconic Bloodline changed to different exemplars
    'Ability=charisma HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Sorcerer Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Class Trained (Sorcerer)",' +
      '1:Bloodline,"1:Sorcerer Spellcasting","1:Sorcerous Potency",' +
      '"2:Skill Feats","2:Sorcerer Feats","3:General Feats",' +
      '"3:Signature Spells","3:Skill Increases","5:Magical Fortitude",' +
      '"7:Expert Spellcaster","9:Reflex Expertise","11:Perception Expertise",' +
      '"11:Weapon Expertise","13:Defensive Robes","13:Weapon Specialization",' +
      '"15:Master Spellcaster","17:Majestic Will","19:Bloodline Paragon",' +
      '"19:Legendary Spellcaster" ' +
    'Selectables=' +
      '1:Aberrant:Bloodline,' +
      '1:Angelic:Bloodline,' +
      '1:Demonic:Bloodline,' +
      '1:Diabolic:Bloodline,' +
      '"1:Draconic (Arcane):Bloodline",' +
      '"1:Draconic (Divine):Bloodline",' +
      '"1:Draconic (Occult):Bloodline",' +
      '"1:Draconic (Primal):Bloodline",' +
      '"1:Elemental (Air):Bloodline",' +
      '"1:Elemental (Earth):Bloodline",' +
      '"1:Elemental (Fire):Bloodline",' +
      '"1:Elemental (Metal):Bloodline",' +
      '"1:Elemental (Water):Bloodline",' +
      '"1:Elemental (Wood):Bloodline",' +
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

  'Swashbuckler':
    'Ability=dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Dexterity)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Reflex; Will)","Save Trained (Fortitude)",' +
      '"1:Swashbuckler Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Class Trained (Swashbuckler)",' +
      '"1:Panache","1:Precise Strike","1:Stylish Combatant",' +
      '"1:Swashbuckler\'s Style","1:Confident Finisher",' +
      '"1:Swashbuckler Feats","3:Fortitude Expertise","3:General Feats",' +
      '"3:Opportune Riposte","3:Skill Increases","3:Stylish Tricks",' +
      '"3:Vivacious Speed","5:Weapon Expertise","7:Confident Evasion",' +
      '"7:Weapon Specialization","9:Exemplary Finisher",' +
      '"9:Swashbuckler Expertise","11:Continuous Flair",' +
      '"11:Perception Mastery","13:Assured Evasion",' +
      '"13:Light Armor Expertise","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","15:Keen Flair",' +
      '"17:Reinforced Ego","19:Eternal Confidence","19:Light Armor Mastery" ' +
    'Selectables=' +
      '"1:Battledancer:Style",' +
      '"1:Braggart:Style",' +
      '"1:Fencer:Style",' +
      '"1:Gymnast:Style",' +
      '"1:Rascal:Style",' +
      '"1:Wit:Style"',

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

  // Dwarf
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
  'Echoes In Stone':'Traits=Ancestry,Dwarf,Concentrate Require="level >= 9"',
  "Mountain's Stoutness":Pathfinder2E.FEATS["Mountain's Stoutness"],
  'Stone Bones':'Traits=Ancestry,Dwarf Require="level >= 9"',
  'Stonewalker':Pathfinder2E.FEATS.Stonewalker,
  'March The Mines':'Traits=Ancestry,Dwarf Require="level >= 13"',
  'Telluric Power':'Traits=Ancestry,Dwarf Require="level >= 13"',
  'Stonegate':
    'Traits=Ancestry,Dwarf,Uncommon ' +
    'Require="level >= 17","features.Stonewalker"',
  'Stonewall':'Traits=Ancestry,Dwarf,Earth,Polymorph Require="level >= 17"',

  // Elf
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
  'Avenge Ally':'Traits=Ancestry,Elf,Fortune Require="level >= 13"',
  'Universal Longevity':
    Pathfinder2E.FEATS['Universal Longevity']
    .replace('Expert Longevity', 'Ancestral Longevity'),
  'Magic Rider':'Traits=Ancestry,Elf Require="level >= 17"',

  // Gnome
  'Animal Accomplice':Pathfinder2E.FEATS['Animal Accomplice'],
  'Animal Elocutionist':Pathfinder2E.FEATS['Burrow Elocutionist'],
  'Fey Fellowship':Pathfinder2E.FEATS['Fey Fellowship'],
  'First World Magic':Pathfinder2E.FEATS['First World Magic'],
  'Gnome Obsession':Pathfinder2E.FEATS['Gnome Obsession'],
  'Gnome Weapon Familiarity':Pathfinder2E.FEATS['Gnome Weapon Familiarity'],
  'Illusion Sense':Pathfinder2E.FEATS['Illusion Sense'],
  'Razzle-Dazzle':'Traits=Ancestry,Gnome',
  'Energized Font':Pathfinder2E.FEATS['Energized Font'],
  'Project Persona':
    'Traits=Ancestry,Gnome,Concentrate,Illusion,Primal,Visual ' +
    'Require="level >= 5"',
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Cautious Curiosity (Arcane)':'Traits=Ancestry,Gnome Require="level >= 9"',
  'Cautious Curiosity (Occult)':'Traits=Ancestry,Gnome Require="level >= 9"',
  'First World Adept':Pathfinder2E.FEATS['First World Adept'],
  'Life Leap':'Traits=Ancestry,Gnome,Move,Teleportation Require="level >= 9"',
  'Vivacious Conduit':Pathfinder2E.FEATS['Vivacious Conduit'],
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Instinctive Obfuscation':
    'Traits=Ancestry,Gnome,Illusion,Visual ' +
    'Require="level >= 13"',
  'Homeward Bound':'Traits=Ancestry,Gnome,Uncommon Require="level >= 17"',

  // Goblin
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
  'Reckless Abandon':'Traits=Ancestry,Goblin,Fortune Require="level >= 17"',

  // Halfling
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

  // Human
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
  'Heroic Presence':
    'Traits=Ancestry,Human,Emotion,Mental Require="level >= 17"',

  // Leshy
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
  'Ritual Reversion':
    'Traits=Ancestry,Leshy,Polymorph,Primal Require="level >= 5"',
  'Speak With Kindred':'Traits=Ancestry,Leshy Require="level >= 5"',
  'Bark And Tendril':'Traits=Ancestry,Leshy Require="level >= 9"',
  'Lucky Keepsake':
    'Traits=Ancestry,Leshy Require="level >= 9","features.Leshy Superstition"',
  'Solar Rejuvenation':'Traits=Ancestry,Leshy Require="level >= 9"',
  'Thorned Seedpod':
    'Traits=Ancestry,Leshy Require="level >= 9",features.Seedpod',
  'Call Of The Green Man':'Traits=Ancestry,Leshy Require="level >= 13"',
  'Cloak Of Poison':'Traits=Ancestry,Leshy,Poison Require="level >= 13"',
  'Flourish And Ruin':'Traits=Ancestry,Leshy Require="level >= 17"',
  'Regrowth':'Traits=Ancestry,Leshy Require="level >= 17"',

  // Orc
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

  // Changeling
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

  // Nephilim
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

  // Aiuvarin
  'Earned Glory':'Traits=Ancestry,Aiuvarin',
  'Elf Atavism':
     Pathfinder2E.FEATS['Inspire Imitation'].replace('Half-Elf', 'Aiuvarin'),
  'Inspire Imitation':'Traits=Ancestry,Aiuvarin Require="level >= 5"',
  'Supernatural Charm':
     Pathfinder2E.FEATS['Supernatural Charm'].replace('Half-Elf', 'Aiuvarin'),

  // Dromaar
  'Monstrous Peacemaker':
     Pathfinder2E.FEATS['Monstrous Peacemaker'].replace('Half-Orc', 'Dromaar'),
  'Orc Sight':Pathfinder2E.FEATS['Orc Sight'].replace('Half-Orc', 'Dromaar'),

  // Core 2

  // Catfolk
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

  // Hobgoblin
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

  // Kholo
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

  // Kobold
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

  // Lizardfolk
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

  // Ratfolk
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

  // Tengu
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

  // Tripkee
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

  // Dhampir
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

  // Dragonblood
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
      '"features.Arcane Dragonblood || ' +
       'features.Divine Dragonblood || ' +
       'features.Occult Dragonblood || ' +
       'features.Primal Dragonblood"',
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

  // Duskwalker
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

  // Bard
  'Bardic Lore':Pathfinder2E.FEATS['Bardic Lore'],
  'Hymn Of Healing':'Traits=Class,Bard',
  'Lingering Composition':Pathfinder2E.FEATS['Lingering Composition'],
  'Martial Performance':'Traits=Class,Bard Require="features.Warrior"',
  'Reach Spell':
    Pathfinder2E.FEATS['Reach Spell']
    .replace('Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Oracle,Witch,'),
  'Versatile Performance':Pathfinder2E.FEATS['Versatile Performance'],
  'Well-Versed':'Traits=Class,Bard',
  'Cantrip Expansion':
    Pathfinder2E.FEATS['Cantrip Expansion']
    .replace('Traits=', 'Traits=Oracle,Witch,'),
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
    Pathfinder2E.FEATS['Steady Spellcasting']
    .replace('Traits=', 'Traits=Witch,Oracle,'),
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
    .replace('Traits=', 'Traits=Witch,Oracle,'),
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

  // Cleric
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

  // Druid
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
    .replace('Traits=', 'Traits=Oracle,Witch,'),
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
    Pathfinder2E.FEATS['Order Magic (Wild)']
    .replace('Wild', 'Untamed'),
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
      '"features.Dragon Shape || ' +
       'features.Elemental Shape || ' +
       'features.Plant Shape || ' +
       'features.Soaring Shape"',
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

  // Fighter
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
  'Intimidating Strike':
    Pathfinder2E.FEATS['Intimidating Strike']
    .replace('Class', 'Class,Barbarian'),
  'Lightning Swap':'Traits=Class,Fighter,Flourish Require="level >= 2"',
  'Lunge':Pathfinder2E.FEATS.Lunge,
  'Rebounding Toss':'Traits=Class,Fighter,Flourish Require="level >= 2"',
  'Sleek Reposition':'Traits=Class,Fighter,Press Require="level >= 2"',
  'Barreling Charge':
    'Traits=Class,Barbarian,Fighter,Flourish ' +
    'Require="level >= 4","rank.Athletics >= 1"',
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
    'Traits=Class,Champion,Fighter Require="level >=6","features.Shield Block"',
  'Triple Shot':Pathfinder2E.FEATS['Triple Shot'],
  'Blind-Fight':
    Pathfinder2E.FEATS['Blind-Fight']
    .replace('Class', 'Class,Investigator'),
  'Disorienting Opening':
    'Traits=Class,Fighter Require="level >= 8","features.Reactive Strike"',
  'Dueling Riposte':Pathfinder2E.FEATS['Dueling Riposte'],
  'Felling Strike':Pathfinder2E.FEATS['Felling Strike'],
  'Incredible Aim':Pathfinder2E.FEATS['Incredible Aim'],
  'Mobile Shot Stance':Pathfinder2E.FEATS['Mobile Shot Stance'],
  'Positioning Assault':Pathfinder2E.FEATS['Positioning Assault'],
  'Quick Shield Block':
    'Traits=Class,Champion,Fighter ' +
    'Require="level >= 8","features.Shield Block"',
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
    'Traits=Class,Barbarian,Fighter ' +
    'Require="level >= 10","features.Barreling Charge"',
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
  'Opening Stance':'Traits=Class,Fighter Require="level >= 14"',
  'Two-Weapon Flurry':Pathfinder2E.FEATS['Two-Weapon Flurry'],
  'Whirlwind Strike':Pathfinder2E.FEATS['Whirlwind Strike'],
  'Graceful Poise':Pathfinder2E.FEATS['Graceful Poise'],
  'Improved Reflexive Shield':Pathfinder2E.FEATS['Improved Reflexive Shield'],
  'Master Of Many Styles':
    'Traits=Class,Fighter,Monk ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Opening Stance || features.Reflexive Stance"',
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
    'Traits=Class,Fighter ' +
    'Require="level >= 20","features.Improved Flexibility"',
  'Weapon Supremacy':Pathfinder2E.FEATS['Weapon Supremacy'],

  // Ranger
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
  'Sense The Unseen':
    Pathfinder2E.FEATS['Sense The Unseen']
    .replace('Class', 'Class,Investigator'),
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

  // Rogue
  'Nimble Dodge':Pathfinder2E.FEATS['Nimble Dodge'],
  'Overextending Feint':'Traits=Class,Rogue Require="rank.Deception >= 1"',
  'Plant Evidence':'Traits=Class,Rogue Require="features.Pickpocket"',
  'Trap Finder':
    Pathfinder2E.FEATS['Trap Finder']
    .replace('Class', 'Class,Investigator'),
  'Tumble Behind':'Traits=Class,Rogue,Swashbuckler',
  'Twin Feint':Pathfinder2E.FEATS['Twin Feint'],
  "You're Next":
    Pathfinder2E.FEATS["You're Next"]
    .replace('Traits=', 'Traits=Swashbuckler,'),
  'Brutal Beating':Pathfinder2E.FEATS['Brutal Beating'],
  'Clever Gambit':
    'Traits=Class,Rogue Require="level >=2","features.Mastermind"',
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
  'Predictive Purchase':'Traits=Class,Rogue,Investigator Require="level >= 8"',
  // Ricochet Stance as above
  'Sidestep':Pathfinder2E.FEATS.Sidestep,
  'Sly Striker':Pathfinder2E.FEATS['Sly Striker'],
  'Swipe Souvenir':'Traits=Class,Rogue Require="level >= 8"',
  'Tactical Entry':
    'Traits=Class,Rogue Require="level >= 8","rank.Stealth >= 3"',
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
  'Reconstruct The Scene':
    'Traits=Class,Rogue,Investigator,Concentrate Require="level >= 16"',
  'Swift Elusion':
    'Traits=Class,Rogue Require="level >= 16","rank.Acrobatics >= 4"',
  'Implausible Infiltration':Pathfinder2E.FEATS['Implausible Infiltration'],
  'Implausible Purchase':
    'Traits=Class,Rogue,Investigator ' +
    'Require="level >= 18","features.Predictive Purchase"',
  'Powerful Sneak':Pathfinder2E.FEATS['Powerful Sneak'],
  "Trickster's Ace":
    Pathfinder2E.FEATS["Trickster's Ace"]
    .replace('Traits=', 'Traits=Investigator,'),
  'Hidden Paragon':Pathfinder2E.FEATS['Hidden Paragon'],
  'Impossible Striker':Pathfinder2E.FEATS['Impossible Striker'],
  'Reactive Distraction':Pathfinder2E.FEATS['Reactive Distraction'],

  // Witch
  'Cackle':'Traits=Class,Witch',
  'Cauldron':'Traits=Class,Witch',
  'Counterspell':
    Pathfinder2E.FEATS.Counterspell.replace('Traits=', 'Traits=Witch,'),
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
  "Witch's Bottle":
    'Traits=Class,Witch Require="level >= 8","features.Cauldron"',
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
  'Reflect Spell':
    Pathfinder2E.FEATS['Reflect Spell']
    .replace('Traits=', 'Traits=Witch,'),
  'Rites Of Transfiguration':'Traits=Class,Witch Require="level >= 14"',
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
  'Familiar':Pathfinder2E.FEATS.Familiar,
  // Reach Spell as above
  'Spellbook Prodigy':'Traits=Class,Wizard Require="rank.Arcana >= 1"',
  // Widen Spell as above
  // Cantrip Expansion as above
  // Conceal Spell as above
  'Energy Ablation':'Traits=Class,Wizard,Spellshape Require="level >= 2"',
  // Enhanced Familiar as above
  'Nonlethal Spell':
    'Traits=Class,Wizard,Manipulate,Spellshape Require="level >= 2"',
  'Bespell Strikes':
    Pathfinder2E.FEATS['Bespell Weapon']
    .replace('Traits=', 'Traits=Oracle,'),
  'Call Wizardly Tools':
    'Traits=Class,Wizard,Concentrate,Teleportation ' +
    'Require="level >= 4","features.Arcane Bond"',
  'Linked Focus':Pathfinder2E.FEATS['Linked Focus'],
  'Spell Protection Array':
    'Traits=Class,Wizard,Arcane,Manipulate Require="level >= 4"',
  'Convincing Illusion':
    'Traits=Class,Wizard Require="level >= 6","rank.Deception >= 2"',
  'Explosive Arrival':
    'Traits=Class,Wizard,Concentrate,Manipulate,Spellshape ' +
    'Require="level >= 6"',
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
  'Magic Sense':
    Pathfinder2E.FEATS['Magic Sense']
    .replace('Traits=', 'Traits=Oracle,'),
  'Bonded Focus':Pathfinder2E.FEATS['Bonded Focus'],
  // Reflect Spell as above
  'Secondary Detonation Array':
    'Traits=Class,Wizard,Manipulate,Spellshape Require="level >= 14"',
  'Superior Bond':Pathfinder2E.FEATS['Superior Bond'],
  // Effortless Concentration as above
  'Scintillating Spell':
    'Traits=Class,Wizard,Sorcerer,Concentrate,Light,Spellshape ' +
    'Require="level >= 16"',
  'Spell Tinker':Pathfinder2E.FEATS['Spell Tinker'],
  'Infinite Possibilities':Pathfinder2E.FEATS['Infinite Possibilities'],
  'Reprepare Spell':Pathfinder2E.FEATS['Reprepare Spell'],
  'Second Thoughts':
    'Traits=Class,Wizard,Concentrate,Mental Require="level >= 18"',
  "Archwizard's Might":Pathfinder2E.FEATS["Archwizard's Might"],
  'Spell Combination':Pathfinder2E.FEATS['Spell Combination'],
  'Spell Mastery':'Traits=Class,Wizard Require="level >= 20"',
  'Spellshape Mastery':Pathfinder2E.FEATS['Metamagic Mastery'],

  // Player Core 2

  // Alchemist
  'Alchemical Familiar':Pathfinder2E.FEATS['Alchemical Familiar'],
  'Alchemical Assessment':Pathfinder2E.FEATS['Alchemical Savant'],
  'Blowgun Poisoner':'Traits=Class,Alchemist',
  'Far Lobber':Pathfinder2E.FEATS['Far Lobber'],
  'Quick Bomber':Pathfinder2E.FEATS['Quick Bomber'],
  'Soothing Vials':'Traits=Class,Alchemist Require="features.Chirurgeon"',
  'Clotting Elixirs':'Traits=Class,Alchemist Require="level >= 2"',
  'Improvise Admixture':
    'Traits=Class,Alchemist,Concentrate,Manipulate Require="level >= 2"',
  'Pernicious Poison':'Traits=Class,Alchemist Require="level >= 2"',
  'Revivifying Mutagen':
    Pathfinder2E.FEATS['Revivifying Mutagen']
    .replace('Traits=', 'Traits=Concentrate,'),
  'Smoke Bomb':
    Pathfinder2E.FEATS['Smoke Bomb']
    .replace('Additive 1', 'Additive'),
  'Efficient Alchemy':Pathfinder2E.FEATS['Efficient Alchemy'],
  'Enduring Alchemy':Pathfinder2E.FEATS['Enduring Alchemy'],
  'Healing Bomb':'Traits=Class,Alchemist,Additive Require="level >= 4"',
  'Invigorating Elixir':'Traits=Class,Alchemist,Additive Require="level >= 4"',
  'Regurgitate Mutagen':
    'Traits=Class,Alchemist,Manipulate Require="level >= 4"',
  'Tenacious Toxins':'Traits=Class,Alchemist Require="level >= 4"',
  'Combine Elixirs':
    Pathfinder2E.FEATS['Combine Elixirs']
    .replace('Additive 2', 'Additive'),
  'Debilitating Bomb':
    Pathfinder2E.FEATS['Debilitating Bomb']
    .replace('Additive 2', 'Additive'),
  'Directional Bombs':Pathfinder2E.FEATS['Directional Bombs'],
  'Fortified Elixirs':'Traits=Class,Alchemist Require="level >= 6"',
  'Sticky Poison':'Traits=Class,Alchemist Require="level >= 6"',
  'Alter Admixture':'Traits=Class,Alchemist,Exploration Require="level >= 8"',
  'Improved Invigorating Elixir (Mental)':
    'Traits=Class,Alchemist Require="level >= 8"',
  'Improved Invigorating Elixir (Physical)':
    'Traits=Class,Alchemist Require="level >= 8"',
  'Mutant Physique':'Traits=Class,Alchemist Require="level >= 8"',
  'Pinpoint Poisoner':'Traits=Class,Alchemist Require="level >= 8"',
  'Sticky Bomb':
    Pathfinder2E.FEATS['Sticky Bomb']
    .replace('Additive 2', 'Additive'),
  'Advanced Efficient Alchemy':
    'Traits=Class,Alchemist Require="level >= 10","features.Efficient Alchemy"',
  'Expanded Splash':
    Pathfinder2E.FEATS['Expanded Splash'] + ' ' +
    'Require="level >= 10"',
  'Greater Debilitating Bomb':Pathfinder2E.FEATS['Greater Debilitating Bomb'],
  'Unstable Concoction':'Traits=Class,Alchemist,Additive Require="level >= 10"',
  'Extend Elixir':Pathfinder2E.FEATS['Extend Elixir'],
  'Supreme Invigorating Elixir':
    'Traits=Class,Alchemist ' +
    'Require="level >= 12","features.Invigorating Elixir"',
  'Uncanny Bombs':Pathfinder2E.FEATS['Uncanny Bombs'],
  'Double Poison':'Traits=Class,Alchemist Require="level >= 14"',
  'Mutant Innervation':'Traits=Class,Alchemist Require="level >= 14"',
  'True Debilitating Bomb':Pathfinder2E.FEATS['True Debilitating Bomb'],
  'Eternal Elixir':Pathfinder2E.FEATS['Eternal Elixir'],
  'Exploitive Bomb':
    Pathfinder2E.FEATS['Exploitive Bomb']
    .replace('Additive 2', 'Additive'),
  'Persistent Mutagen':Pathfinder2E.FEATS['Persistent Mutagen'],
  'Improbable Elixirs':Pathfinder2E.FEATS['Improbable Elixirs'],
  'Miracle Worker':Pathfinder2E.FEATS['Miracle Worker'],
  'Perfect Debilitation':Pathfinder2E.FEATS['Perfect Debilitation'],
  'Alchemical Revivification':'Traits=Class,Alchemist Require="level >= 20"',
  "Craft Philosopher's Stone":Pathfinder2E.FEATS["Craft Philosopher's Stone"],
  'Mega Bomb':
    Pathfinder2E.FEATS['Mega Bomb']
    .replace('Additive 3', 'Additive') + ' ' +
    'Require="level >= 20"',

  // Barbarian
  'Acute Vision':Pathfinder2E.FEATS['Acute Vision'],
  'Adrenaline Rush':'Traits=Class,Barbarian,Rage',
  'Draconic Arrogance':'Traits=Class,Barbarian,Rage',
  'Moment Of Clarity':Pathfinder2E.FEATS['Moment Of Clarity'],
  'Raging Intimidation':Pathfinder2E.FEATS['Raging Intimidation'],
  'Raging Thrower':Pathfinder2E.FEATS['Raging Thrower'],
  // Sudden Charge as above
  'Acute Scent':
    Pathfinder2E.FEATS['Acute Scent'] + ' ' +
    'Require="level >= 2"',
  'Bashing Charge':
    'Traits=Class,Barbarian,Rage Require="level >= 2","rank.Athletics >= 1"',
  'Furious Finish':Pathfinder2E.FEATS['Furious Finish'],
  // Intimidating Strike as above
  'No Escape':Pathfinder2E.FEATS['No Escape'],
  'Second Wind':Pathfinder2E.FEATS['Second Wind'],
  'Shake It Off':Pathfinder2E.FEATS['Shake It Off'],
  // Barreling Charge as above
  'Oversized Throw':'Traits=Class,Barbarian,Rage Require="level >= 4"',
  'Raging Athlete':Pathfinder2E.FEATS['Raging Athlete'],
  'Scars Of Steel':
    'Traits=Class,Barbarian,Rage Require="level >= 4","features.Fury Instinct"',
  'Spiritual Guides':
    'Traits=Class,Barbarian,Fortune ' +
    'Require="level >= 4","features.Spirit Instinct"',
  'Supernatural Senses':
    // TODO features.Scent isn't a thing
    'Traits=Class,Barbarian,Rage ' +
    'Require="level >= 4","features.Acute Scent || features.Scent"',
  // Swipe as above
  'Wounded Rage':Pathfinder2E.FEATS['Wounded Rage'],
  'Animal Skin':
    Pathfinder2E.FEATS['Animal Skin']
    .replace(',Transmutation', ''),
  'Brutal Bully':Pathfinder2E.FEATS['Brutal Bully'],
  'Cleave':Pathfinder2E.FEATS.Cleave,
  "Dragon's Rage Breath":
    Pathfinder2E.FEATS["Dragon's Rage Breath"]
    .replaceAll(/,(Arcane|Evocation)/g, ''),
  "Giant's Stature":
    Pathfinder2E.FEATS["Giant's Stature"]
    .replace(',Transmutation', ''),
  'Inner Strength':
    'Traits=Class,Barbarian,Concentrate,Rage ' +
    'Require="level >= 6","features.Spirit Instinct"',
  'Mage Hunter':
    'Traits=Class,Barbarian,Rage ' +
    'Require="level >= 6","features.Superstition Instinct"',
  'Nocturnal Senses':
    'Traits=Class,Barbarian,Rage ' +
    'Require="level >= 6","features.Low-Light Vision || features.Scent"',
  'Reactive Strike':Pathfinder2E.FEATS['Attack Of Opportunity'],
  'Scouring Rage':
    // TODO requires "instinct that allows you to change your Rage damage type"
    'Traits=Class,Barbarian Require="level >= 6"',
  "Spirits' Interference":
    Pathfinder2E.FEATS["Spirits' Interference"]
    .replace(',Necromancy', ''),
  'Animalistic Brutality':
    'Traits=Class,Barbarian,Concentrate,Morph,Primal,Rage ' +
    'Require="level >= 8","features.Animal Instinct"',
  'Disarming Assault':
    'Traits=Class,Barbarian,Flourish,Rage ' +
    'Require="level >= 8","rank.Athletics >= 1"',
  'Follow-Up Assault':'Traits=Class,Barbarian,Rage Require="level >= 8"',
  'Friendly Toss':'Traits=Class,Barbarian,Manipulate,Rage Require="level >= 8"',
  'Furious Bully':Pathfinder2E.FEATS['Furious Bully'],
  'Instinctive Strike':
    'Traits=Class,Barbarian ' +
    'Require="level >= 8","features.Acute Scent || features.Scent"',
  'Invulnerable Rager':'Traits=Class,Barbarian Require="level >= 8"',
  'Renewed Vigor':Pathfinder2E.FEATS['Renewed Vigor'],
  'Share Rage':Pathfinder2E.FEATS['Share Rage'],
  // Sudden Leap as above
  'Thrash':Pathfinder2E.FEATS.Thrash,
  'Come And Get Me':Pathfinder2E.FEATS['Come And Get Me'],
  'Furious Sprint':Pathfinder2E.FEATS['Furious Sprint'],
  'Great Cleave':Pathfinder2E.FEATS['Great Cleave'],
  'Impressive Landing':'Traits=Class,Barbarian Require="level >= 10"',
  'Knockback':Pathfinder2E.FEATS.Knockback,
  // Overpowering Charge as above
  'Resounding Blow':'Traits=Class,Barbarian,Rage Require="level >= 10"',
  'Silencing Strike':
    'Traits=Class,Barbarian,Incapacitation,Rage Require="level >= 10"',
  'Tangle Of Battle':'Traits=Class,Barbarian,Rage Require="level >= 10"',
  'Terrifying Howl':
    Pathfinder2E.FEATS['Terrifying Howl'] + ' ' +
    'Require="level >= 10"',
  "Dragon's Rage Wings":
    Pathfinder2E.FEATS["Dragon's Rage Wings"]
    .replaceAll(/,(Primal|Transmutation)/g, ''),
  'Embrace The Pain':'Traits=Class,Barbarian,Rage Require="level >= 12"',
  'Furious Grab':Pathfinder2E.FEATS['Furious Grab'],
  "Predator's Pounce":
    Pathfinder2E.FEATS["Predator's Pounce"]
    .replace(',Open', ''),
  "Spirit's Wrath":Pathfinder2E.FEATS["Spirit's Wrath"],
  'Sunder Spell':
    'Traits=Class,Barbarian,Attack,Concentrate,Rage ' +
    'Require="level >= 12","features.Superstition Instinct"',
  "Titan's Stature":
    Pathfinder2E.FEATS["Titan's Stature"]
    .replaceAll(/,(Polymorph|Transmutation)/g, '') + ' ' +
    'Require="level >= 12","features.Giant\'s Stature"',
  'Unbalancing Sweep':
    'Traits=Class,Barbarian,Flourish ' +
    'Require="level >= 12"',
  'Awesome Blow':Pathfinder2E.FEATS['Awesome Blow'],
  "Giant's Lunge":
    Pathfinder2E.FEATS["Giant's Lunge"]
    .replace(',Instinct', ''),
  'Impaling Thrust':'Traits=Class,Barbarian,Rage Require="level >= 14"',
  'Sunder Enchantment':
    'Traits=Class,Barbarian Require="level >= 14","features.Sunder Spell"',
  'Vengeful Strike':Pathfinder2E.FEATS['Vengeful Strike'],
  // Whirlwind Strike as above
  'Collateral Thrash':Pathfinder2E.FEATS['Collateral Thrash'],
  'Desperate Wrath':Pathfinder2E.FEATS['Reckless Abandon'],
  'Dragon Transformation':
    Pathfinder2E.FEATS['Dragon Transformation']
    .replace(',Transmutation', '') + ' ' +
    'Require="level >= 16","features.Dragon\'s Rage Wings"',
  'Furious Vengeance':
    'Traits=Class,Barbarian,Rage ' +
    'Require="level >= 16","features.Fury Instinct"',
  'Penetrating Projectile':
    'Traits=Class,Barbarian,Flourish,Rage Require="level >= 16"',
  'Shattering Blows':'Traits=Class,Barbarian,Rage Require="level >= 16"',
  'Brutal Critical':Pathfinder2E.FEATS['Brutal Critical'],
  'Perfect Clarity':Pathfinder2E.FEATS['Perfect Clarity'],
  'Vicious Evisceration':Pathfinder2E.FEATS['Vicious Evisceration'],
  'Whirlwind Toss':
    'Traits=Class,Barbarian,Rage ' +
    'Require="level >= 18","features.Collateral Thrash"',
  'Annihilating Swing':'Traits=Class,Barbarian Require="level >= 20"',
  'Contagious Rage':Pathfinder2E.FEATS['Contagious Rage'],
  'Quaking Stomp':Pathfinder2E.FEATS['Quaking Stomp'],
  'Unstoppable Juggernaut':'Traits=Class,Barbarian Require="level >= 20"',

  // Champion
  'Brilliant Flash':'Traits=Class,Champion Require="features.Grandeur"',
  'Defensive Advance':'Traits=Class,Champion,Flourish',
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
  'Desperate Prayer':'Traits=Class,Champion',
  'Faithful Steed':'Traits=Class,Champion',
  'Iron Repercussions':'Traits=Class,Champion Require="features.Obedience"',
  'Nimble Reprisal':
    Pathfinder2E.FEATS['Ranged Reprisal']
    .replace('Paladin', 'Justice'),
  'Ongoing Selfishness':'Traits=Class,Champion Require="features.Desecration"',
  'Unimpeded Step':
    Pathfinder2E.FEATS['Unimpeded Step']
    .replace('Liberator', 'Liberation'),
  'Vicious Vengeance':'Traits=Class,Champion Require="features.Iniquity"',
  'Weight Of Guilt':
    Pathfinder2E.FEATS['Weight Of Guilt']
    .replace('Redeemer', 'Redemption'),
  'Divine Grace':Pathfinder2E.FEATS['Divine Grace'],
  'Divine Health':Pathfinder2E.FEATS['Divine Health'] + ' ' +
    'Require="level >= 2"',
  'Aura Of Courage':
    Pathfinder2E.FEATS['Aura Of Courage'] + ' ' +
    'Require="level >= 4","features.Champion\'s Aura","features.Holy"',
  'Aura Of Despair':
    'Traits=Class,Champion,Uncommon ' +
    'Require="level >= 4","features.Champion\'s Aura","features.Unholy"',
  'Cruelty':
    'Traits=Class,Champion ' +
    'Require="level >= 4","spells.Touch Of The Void (D1 Foc)"',
  'Mercy (Body)':
    Pathfinder2E.FEATS.Mercy
    .replace(' Nec', ''),
  'Mercy (Grace)':
    Pathfinder2E.FEATS.Mercy
    .replace(' Nec', ''),
  'Mercy (Mind)':
    Pathfinder2E.FEATS.Mercy
    .replace(' Nec', ''),
  'Security':
    'Traits=Class,Champion ' +
    'Require="level >= 4","spells.Shields Of The Spirit (D1 Foc)"',
  'Expand Aura':
    'Traits=Class,Champion,Concentrate ' +
    'Require="level >= 6","features.Champion\'s Aura"',
  'Loyal Warhorse':
    Pathfinder2E.FEATS['Loyal Warhorse']
    .replace('Steed Ally', 'Faithful Steed'),
  // Reactive Strike as above
  // Shield Warden as above
  'Smite':
    Pathfinder2E.FEATS['Smite Evil'] + ' ' +
    'Require="level >= 6"',
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
  'Greater Cruelty':
    'Traits=Class,Champion Require="level >= 8","features.Cruelty"',
  'Greater Mercy':Pathfinder2E.FEATS['Greater Mercy'],
  'Greater Security':
    'Traits=Class,Champion Require="level >= 8","features.Security"',
  'Heal Mount':
    Pathfinder2E.FEATS['Heal Mount']
    .replace('Steed Ally', 'Faithful Steed')
    .replace(' Nec', ''),
  // Quick Shield Block as above
  'Second Blessing':
    Pathfinder2E.FEATS['Second Ally']
    .replace('Divine Ally', 'Blessing Of The Devoted'),
  'Imposing Destrier':
    Pathfinder2E.FEATS['Imposing Destrier']
    .replace(',"features.Steed Ally"', ''),
  'Radiant Armament':
    Pathfinder2E.FEATS['Radiant Blade Spirit']
    .replace('Blade Ally', 'Blessed Armament'),
  'Shield Of Reckoning':
    Pathfinder2E.FEATS['Shield Of Reckoning']
    .replace(',Flourish', '')
    .replace('Require=', 'Require="features.Blessed Shield",'),
  'Spectral Advance':
    'Traits=Class,Champion,Concentrate,Divine,Teleportation ' +
    'Require="level >= 10","features.Blessed Swiftness"',
  'Affliction Mercy':Pathfinder2E.FEATS['Affliction Mercy'],
  'Aura Of Faith':
    Pathfinder2E.FEATS['Aura Of Faith']
    .replace('The Tenets Of Good', 'Holy || features.Unholy'),
  'Blessed Counterstrike':
    // TODO require "champion's reaction that grants an ally resistance"
    'Traits=Class,Champion,Flourish Require="level >= 12"',
  "Champion's Sacrifice":
    Pathfinder2E.FEATS["Champion's Sacrifice"]
    .replace('features.The Tenets Of Good', 'features.Unholy == 0'),
  'Devoted Focus':
    Pathfinder2E.FEATS['Devoted Focus']
    .replace('10', '12'),
  'Divine Wall':Pathfinder2E.FEATS['Divine Wall'],
  'Gruesome Strike':'Traits=Class,Champion Require="level >= 12"',
  'Aura Of Determination':
    'Traits=Class,Champion Require="level >= 14","features.Champion\'s Aura"',
  'Aura Of Life':
    Pathfinder2E.FEATS['Aura Of Life']
    .replace('Shining Oath', "Champion's Aura"),
  'Aura Of Righteousness':
    Pathfinder2E.FEATS['Aura Of Righteousness']
    .replace('The Tenets Of Good', 'Champion\'s Aura","features.Holy'),
  'Divine Reflexes':Pathfinder2E.FEATS['Divine Reflexes'],
  'Auspicious Mount':
    Pathfinder2E.FEATS['Auspicious Mount']
    .replace(',"features.Steed Ally"', ''),
  'Instrument Of Slaughter':
    // TODO require "champion's reaction that grants extra damage"
    'Traits=Class,Champion Require="level >= 16"',
  'Instrument Of Zeal':
    Pathfinder2E.FEATS['Instrument Of Zeal'] + ' ' +
    // TODO require "champion's reaction that grants an ally resistance"
    'Require="level >= 16","features.Blessed Counterstrike || features.Retributive Strike"',
  'Shield Of Grace':Pathfinder2E.FEATS['Shield Of Grace'],
  'Rejuvenating Touch':
    'Traits=Class,Champion ' +
    'Require="level >= 18","spells.Lay On Hands (D1 Foc)"',
  'Swift Retribution':
    'Traits=Class,Champion ' +
    'Require="level >= 18","features.Champion\'s Reaction"',
  'Ultimate Mercy':Pathfinder2E.FEATS['Ultimate Mercy'],
  'Armament Paragon':
    Pathfinder2E.FEATS['Radiant Blade Master'] + ' ' +
    'Require="level >= 20","features.Blessed Armament"',
  'Sacred Defender':'Traits=Class,Champion Require="level >= 20"',
  'Shield Paragon':
    Pathfinder2E.FEATS['Shield Paragon']
    .replace('Shield Ally', 'Blessed Shield'),
  'Swift Paragon':
    'Traits=Class,Champion Require="level >= 20","features.Blessed Swiftness"',

  // Investigator
  'Eliminate Red Herrings':'Traits=Class,Investigator',
  'Flexible Studies':'Traits=Class,Investigator',
  'Known Weaknesses':'Traits=Class,Investigator',
  'Takedown Expert':'Traits=Class,Investigator',
  "That's Odd":'Traits=Class,Investigator',
  // Trap Finder as above
  'Underworld Investigator':'Traits=Class,Investigator',
  'Athletic Strategist':
    'Traits=Class,Investigator Require="level >= 2","rank.Athletics >= 1"',
  'Certain Stratagem':'Traits=Class,Investigator Require="level >= 2"',
  'Exploit Blunder':'Traits=Class,Investigator Require="level >= 2"',
  'Person Of Interest':'Traits=Class,Investigator Require="level >= 2"',
  'Shared Stratagem':'Traits=Class,Investigator Require="level >= 2"',
  'Solid Lead':'Traits=Class,Investigator Require="level >= 2"',
  'Alchemical Discoveries':
    'Traits=Class,Investigator ' +
    'Require="level >= 4","features.Alchemical Sciences"',
  "Detective's Readiness":'Traits=Class,Investigator Require="level >= 4"',
  'Lie Detector':
    'Traits=Class,Investigator ' +
    'Require="level >= 4","features.Empiricism || features.Interrogation"',
  'Ongoing Investigation':'Traits=Class,Investigator Require="level >= 4"',
  "Scalpel's Point":
    'Traits=Class,Investigator ' +
    'Require="level >= 4","features.Forensic Medicine"',
  'Strategic Assessment':'Traits=Class,Investigator Require="level >= 4"',
  'Connect The Dots':
    'Traits=Class,Investigator,Auditory,Concentrate,Linguistic ' +
    'Require="level >= 6"',
  // Predictive Purchase as above
  'Thorough Research':'Traits=Class,Investigator Require="level >= 6"',
  // Blind-Fight as above
  'Clue Them All In':'Traits=Class,Investigator Require="level >= 8"',
  'Defensive Stratagem':'Traits=Class,Investigator Require="level >= 8"',
  'Whodunnit?':'Traits=Class,Investigator,Uncommon Require="level >= 8"',
  'Just One More Thing':
    'Traits=Class,Investigator,Fortune Require="level >= 10"',
  'Ongoing Strategy':
    'Traits=Class,Investigator,Fortune ' +
    'Require="level >= 10","features.Strategic Strike"',
  'Suspect Of Opportunity':
    'Traits=Class,Investigator ' +
    'Require="level >= 10","features.Person Of Interest"',
  "Empiricist's Eye":
    'Traits=Class,Investigator Require="level >= 12","features.Empiricism"',
  'Foresee Danger':
    'Traits=Class,Investigator,Concentrate Require="level >= 12"',
  'Just As Planned':
    'Traits=Class,Investigator,Fortune Require="level >= 12"',
  "Make 'em Sweat":
    'Traits=Class,Investigator Require="level >= 12","features.Interrogation"',
  'Reason Rapidly':'Traits=Class,Investigator Require="level >= 12"',
  'Share Tincture':
    'Traits=Class,Investigator ' +
    'Require="level >= 12","features.Alchemical Sciences"',
  'Surgical Shock':
    'Traits=Class,Investigator,Attack ' +
    'Require="level >= 12","features.Forensic Medicine"',
  'Plot The Future':
    'Traits=Class,Investigator,Uncommon,Concentrate,Prediction ' +
    'Require="level >= 14"',
  // Sense The Unseen as above
  'Strategic Bypass':'Traits=Class,Investigator Require="level >= 14"',
  'Didactic Strike':
    'Traits=Class,Investigator ' +
    'Require="level >= 16","features.Shared Stratagem"',
  // Implausible Purchase as above
  // Reconstruct The Scene as above
  'Lead Investigator':
    'Traits=Class,Investigator,Exploration ' +
    'Require="level >= 18","features.Clue Them All In"',
  // Trickster's Ace as above
  "Everyone's A Suspect":'Traits=Class,Investigator Require="level >= 20"',
  'Just The Facts':
    'Traits=Class,Investigator ' +
    'Require="level >= 20","features.Thorough Research"',

  // Monk
  'Crane Stance':Pathfinder2E.FEATS['Crane Stance'],
  'Dragon Stance':Pathfinder2E.FEATS['Dragon Stance'],
  'Monastic Archer Stance':'Traits=Class,Monk,Stance',
  'Monastic Weaponry':Pathfinder2E.FEATS['Monastic Weaponry'],
  'Mountain Stance':Pathfinder2E.FEATS['Mountain Stance'],
  'Qi Spells':'Traits=Class,Monk',
  'Stumbling Stance':'Traits=Class,Monk,Stance',
  'Tiger Stance':Pathfinder2E.FEATS['Tiger Stance'],
  'Wolf Stance':Pathfinder2E.FEATS['Wolf Stance'],
  'Crushing Grab':Pathfinder2E.FEATS['Crushing Grab'],
  'Dancing Leaf':Pathfinder2E.FEATS['Dancing Leaf'],
  'Elemental Fist':
    Pathfinder2E.FEATS['Elemental Fist']
    .replace('features.Ki Strike', 'spells.Inner Upheaval (O1 Foc)'),
  'Shooting Stars Stance':
    'Traits=Class,Monk,Stance ' +
    'Require="level >= 2","features.Monastic Weaponry"',
  'Stunning Blows':Pathfinder2E.FEATS['Stunning Fist'],
  'Cobra Stance':'Traits=Class,Monk,Stance Require="level >= 4"',
  'Deflect Projectile':Pathfinder2E.FEATS['Deflect Arrow'],
  'Flurry Of Maneuvers':Pathfinder2E.FEATS['Flurry Of Maneuvers'],
  'Flying Kick':Pathfinder2E.FEATS['Flying Kick'],
  'Guarded Movement':Pathfinder2E.FEATS['Guarded Movement'],
  'Harmonize Self':
    Pathfinder2E.FEATS['Wholeness Of Body']
    .replace('Ki Spells', 'Qi Spells'),
  'Stand Still':Pathfinder2E.FEATS['Stand Still'],
  'Advanced Monastic Weaponry':
    'Traits=Class,Monk Require="level >= 6","features.Monastic Weaponry"',
  'Advanced Qi Spells':
    'Traits=Class,Monk Require="level >= 6","features.Qi Spells"',
  'Align Qi':'Traits=Class,Monk Require="level >= 6","features.Qi Spells"',
  'Crane Flutter':Pathfinder2E.FEATS['Crane Flutter'],
  'Dragon Roar':Pathfinder2E.FEATS['Dragon Roar'],
  'Mountain Stronghold':Pathfinder2E.FEATS['Mountain Stronghold'],
  'One-Inch Punch':
    'Traits=Class,Monk Require="level >= 6","features.Expert Strikes"',
  'Return Fire':
    'Traits=Class,Monk ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Deflect Projectile",' +
      '"features.Monastic Archer Stance"',
  'Stumbling Feint':
    'Traits=Class,Monk ' +
    'Require="level >= 6","rank.Deception >= 2","features.Stumbling Stance"',
  'Tiger Slash':Pathfinder2E.FEATS['Tiger Stance'],
  'Water Step':Pathfinder2E.FEATS['Water Step'],
  'Whirling Throw':Pathfinder2E.FEATS['Whirling Throw'],
  'Wolf Drag':Pathfinder2E.FEATS['Wolf Stance'],
  'Clinging Shadows Initiate':
    'Traits=Class,Monk Require="level >= 8","features.Qi Spells"',
  'Ironblood Stance':Pathfinder2E.FEATS['Ironblood Stance'],
  'Mixed Maneuver':Pathfinder2E.FEATS['Mixed Maneuver'],
  'Pinning Fire':'Traits=Class,Monk Require="level >= 8"',
  'Projectile Snatching':
    Pathfinder2E.FEATS['Arrow Snatching']
   .replace('Deflect Arrow', 'Deflect Projectile'),
  'Tangled Forest Stance':Pathfinder2E.FEATS['Tangled Forest Stance'],
  'Wall Run':Pathfinder2E.FEATS['Wall Run'],
  'Wild Winds Initiate':
    Pathfinder2E.FEATS['Wild Winds Initiate']
    .replace('Ki Spells', 'Qi Spells'),
  'Cobra Envenom':
    'Traits=Class,Monk,Poison ' +
    'Require="level >= 10","features.Cobra Stance","rank.Unarmed Attacks >= 2"',
  'Knockback Strike':Pathfinder2E.FEATS['Knockback Strike'],
  'Prevailing Position':
    'Traits=Class,Monk Require="level >= 10","sumStanceFeats >= 1"',
  'Sleeper Hold':Pathfinder2E.FEATS['Sleeper Hold'],
  'Wind Jump':
    Pathfinder2E.FEATS['Wind Jump']
    .replace('Ki Spells', 'Qi Spells'),
  'Winding Flow':Pathfinder2E.FEATS['Winding Flow'],
  'Disrupt Qi':
    Pathfinder2E.FEATS['Disrupt Ki']
    .replace('Negative', 'Void'),
  'Dodging Roll':
    'Traits=Class,Monk Require="level >= 12","rank.Acrobatics >= 3"',
  'Focused Shot':
    'Traits=Class,Monk,Concentrate ' +
    'Require="level >= 12","features.Monastic Archer Stance"',
  'Improved Knockback':
    Pathfinder2E.FEATS['Improved Knockback'] + ' ' +
    'Require="level >= 12","features.Knockback Strike"',
  'Meditative Focus':
    Pathfinder2E.FEATS['Meditative Focus']
    .replace('Ki Spells', 'Qi Spells'),
  'Overwhelming Breath':
    'Traits=Class,Monk,Concentrate,Spellshape ' +
    'Require="level >= 12","features.Qi Spells"',
  'Reflexive Stance':'Traits=Class,Monk Require="level >= 12"',
  'Form Lock':'Traits=Class,Monk,Attack Require="level >= 14"',
  'Ironblood Surge':Pathfinder2E.FEATS['Ironblood Surge'],
  'Mountain Quake':Pathfinder2E.FEATS['Mountain Quake'],
  'Peerless Form':Pathfinder2E.FEATS['Timeless Body'],
  "Shadow's Web":
    'Traits=Class,Monk ' +
    'Require="level >= 14","features.Clinging Shadows Initiate"',
  'Tangled Forest Rake':Pathfinder2E.FEATS['Tangled Forest Rake'],
  'Whirling Blade Stance':
    'Traits=Class,Monk,Stance ' +
    'Require="level >= 14","features.Monastic Weaponry"',
  'Wild Winds Gust':
    Pathfinder2E.FEATS['Wild Winds Gust']
    .replace(',Evocation', ''),
  'Fuse Stance':
    Pathfinder2E.FEATS['Fuse Stance']
    .replace('20', '16'),
  // Master Of Many Styles as above
  'Master Qi Spells':'Traits=Class,Monk Require="features.Qi Spells"',
  'One-Millimeter Punch':'Traits=Class,Monk Require="features.One-Inch Punch"',
  'Shattering Strike':Pathfinder2E.FEATS['Shattering Strike'],
  'Diamond Fists':Pathfinder2E.FEATS['Diamond Fists'],
  'Grandmaster Qi Spells':'Traits=Class,Monk Require="features.Qi Spells"',
  'Qi Center':
    'Traits=Class,Monk ' +
    'Require="features.Qi Spells","features.Master Of Many Styles"',
  'Swift River':Pathfinder2E.FEATS['Swift River'],
  'Triangle Shot':
    'Traits=Class,Monk,Concentrate,Fortune ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Monastic Archer Stance",' +
      '"features.Stunning Blows"',
  'Enduring Quickness':Pathfinder2E.FEATS['Enduring Quickness'],
  'Godbreaker':
    'Traits=Class,Monk ' +
    'Require="level >= 20","features.Crushing Grab","features.Whirling Throw"',
  'Immortal Techniques':
    'Traits=Class,Monk Require="level >= 20","features.Master Of Many Styles"',
  'Impossible Technique':Pathfinder2E.FEATS['Impossible Technique'],
  'Lightning Qi':'Traits=Class,Monk Require="level >= 20","features.Qi Spells"',

  // Oracle
  'Foretell Harm':'Traits=Class,Oracle,Cursebound,Divine',
  'Glean Lore':'Traits=Class,Oracle,Divine,Secret',
  'Nudge The Scales':'Traits=Class,Oracle,Cursebound,Divine,Healing,Spirit',
  'Oracular Warning':
    'Traits=Class,Oracle,Auditory,Cursebound,Divine,Emotion,Mental',
  // Reach Spell as above
  'Whispers Of Weakness':'Traits=Class,Oracle,Cursebound,Divine',
  // Widen Spell as above
  // Cantrip Expansion as above
  'Divine Aegis':'Traits=Class,Oracle,Divine Require="level >= 2"',
  'Domain Acumen':'Traits=Class,Oracle Require="level >= 2"',
  'Meddling Futures':
    'Traits=Class,Oracle,Cursebound,Divine Require="level >= 2"',
  // Bespell Strikes as above
  'Knowledge Of Shapes':
    'Traits=Class,Oracle,Cursebound,Spellshape ' +
    'Require="level >= 4","features.Reach Spell || features.Widen Spell"',
  'Thousand Visions':
    'Traits=Class,Oracle,Cursebound,Prediction Require="level >= 4"',
  'Advanced Revelation':
    // TODO requires "initial revelation spell"
    'Traits=Class,Oracle Require="level >= 6"',
  'Gifted Power':'Traits=Class,Oracle Require="level >= 6"',
  'Spiritual Sense':'Traits=Class,Oracle,Divine Require="level >= 6"',
  // Steady Spellcasting as above
  'Debilitating Dichotomy':
    'Traits=Class,Oracle,Concentrate,Cursebound,Divine,Mental ' +
    'Require="level >= 8"',
  'Read Disaster':
    'Traits=Class,Oracle,Exploration,Prediction Require="level >= 8"',
  'Surging Might':
    'Traits=Class,Oracle,Manipulate,Spellshape Require="level >= 8"',
  'Water Walker':'Traits=Class,Oracle Require="level >= 8"',
  // Quickened Casting as above
  'Roll The Bones Of Fate':
    'Traits=Class,Oracle,Cursebound,Divine,Prediction ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Bones || features.Lore"',
  'The Dead Walk':
    'Traits=Class,Oracle,Cursebound,Divine ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Ancestors || features.Battle"',
  'Trial By Skyfire':
    'Traits=Class,Oracle,Cursebound,Divine,Fire ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Cosmos || features.Flames"',
  'Waters Of Creation':
    'Traits=Class,Oracle,Cursebound,Divine,Healing,Vitality,Water ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Life || features.Tempest"',
  'Domain Fluency':
    'Traits=Class,Oracle ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Domain Acumen"',
  'Epiphany At The Crossroads':
    'Traits=Class,Oracle,Divine Require="level >= 12"',
  'Greater Revelation':
    // TODO require "initial revelation spell"
    'Traits=Class,Oracle Require="level >= 12"',
  // Magic Sense as above
  'Forestall Curse':'Traits=Class,Oracle,Concentrate Require="level >= 14"',
  'Lighter Than Air':
    'Traits=Class,Oracle,Divine ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Water Walker"',
  'Mysterious Repertoire':'Traits=Class,Oracle Require="level >= 14"',
  "Revelation's Focus":'Traits=Class,Oracle Require="level >= 14"',
  'Conduit Of Void and Vitality':
    'Traits=Class,Oracle,Cursebound,Divine ' +
    // TODO require "any oracle mystery"
    'Require="level >= 16"',
  'Diverse Mystery':
    'Traits=Class,Oracle Require="level >= 16","features.Advanced Revelation"',
  'Portentous Spell':
    'Traits=Class,Oracle,Manipulate,Mental,Spellshape,Visual ' +
    'Require="level >= 16"',
  'Blaze Of Revelation':'Traits=Class,Oracle Require="level >= 18"',
  'Divine Effusion':'Traits=Class,Oracle Require="level >= 18"',
  'Mystery Conduit':
    'Traits=Class,Oracle,Cursebound,Spellshape Require="level >= 20"',
  'Oracular Providence':
    'Traits=Class,Oracle Require="level >= 20","features.Oracular Clarity"',
  'Paradoxical Mystery':
    'Traits=Class,Oracle Require="level >= 20","features.Greater Revelation"',

  // Sorcerer
  'Blood Rising':'Traits=Class,Sorcerer',
  // Familiar as above
  // Reach Spell as above
  'Tap Into Blood':'Traits=Class,Sorcerer,Concentrate',
  // Widen Spell as above
  'Anoint Ally':'Traits=Class,Sorcerer,Manipulate Require="level >= 2"',
  'Bleed Out':'Traits=Class,Sorcerer,Attack Require="level >= 2"',
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Propelling Sorcery':'Traits=Class,Sorcerer Require="level >= 2"',
  'Arcane Evolution':Pathfinder2E.FEATS['Arcane Evolution'],
  // Bespell Strikes as above
  'Divine Evolution':Pathfinder2E.FEATS['Divine Evolution'],
  'Occult Evolution':Pathfinder2E.FEATS['Occult Evolution'],
  'Primal Evolution':Pathfinder2E.FEATS['Primal Evolution'],
  'Split Shot':'Traits=Class,Sorcerer,Spellshape Require="level >= 4"',
  'Advanced Bloodline':Pathfinder2E.FEATS['Advanced Bloodline'],
  'Diverting Vortex':'Traits=Class,Sorcerer Require="level >= 6"',
  'Energy Ward':'Traits=Class,Sorcerer Require="level >= 6"',
  'Safeguard Spell':
    'Traits=Class,Sorcerer,Concentrate,Spellshape Require="level >= 6"',
  'Spell Relay':'Traits=Class,Sorcerer,Concentrate Require="level >= 6"',
  // Steady Spellcasting as above
  'Bloodline Resistance':Pathfinder2E.FEATS['Bloodline Resistance'],
  'Crossblooded Evolution':Pathfinder2E.FEATS['Crossblooded Evolution'],
  'Explosion Of Power':'Traits=Class,Sorcerer Require="level >= 8"',
  'Energy Fusion':
    'Traits=Class,Sorcerer,Concentrate,Spellshape Require="level >= 10"',
  'Greater Bloodline':Pathfinder2E.FEATS['Greater Bloodline'],
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Signature Spell Expansion':'Traits=Class,Sorcerer Require="level >= 10"',
  'Blood Sovereignty':'Traits=Class,Sorcerer Require="level >= 12"',
  'Bloodline Focus':Pathfinder2E.FEATS['Bloodline Focus'],
  'Greater Physical Evolution':
    'Traits=Class,Sorcerer ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Arcane Evolution || features.Primal Evolution"',
  'Greater Spiritual Evolution':
    'Traits=Class,Sorcerer ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Divine Evolution || features.Occult Evolution"',
  // Magic Sense as above
  'Terraforming Trickery':
    'Traits=Class,Sorcerer,Concentrate,Earth Require="level >= 12"',
  'Blood Ascendancy':
    'Traits=Class,Sorcerer Require="level >= 12","features.Blood Rising"',
  'Interweave Dispel':
    Pathfinder2E.FEATS['Interweave Dispel']
    .replace('Metamagic', 'Spellshape'),
  'Reflect Harm':'Traits=Class,Sorcerer Require="level >= 14"',
  'Spell Shroud':
    'Traits=Class,Sorcerer,Concentrate,Spellshape Require="level >= 14"',
  // Effortless Concentration as above
  'Greater Mental Evolution':Pathfinder2E.FEATS['Greater Mental Evolution'],
  'Greater Vital Evolution':Pathfinder2E.FEATS['Greater Vital Evolution'],
  // Scintillating Spell as above
  'Echoing Spell':
    'Traits=Class,Sorcerer,Concentrate,Spellshape Require="level >= 18"',
  'Greater Crossblooded Evolution':
    Pathfinder2E.FEATS['Greater Crossblooded Evolution'],
  'Bloodline Conduit':
    Pathfinder2E.FEATS['Bloodline Conduit']
    .replace('Metamagic', 'Spellshape'),
  'Bloodline Mutation':'Traits=Class,Sorcerer Require="level >= 20"',
  'Bloodline Perfection':Pathfinder2E.FEATS['Bloodline Perfection'],
  // Spellshape Mastery as above

  // Swashbuckler
  'Disarming Flair':'Traits=Class,Swashbuckler',
  'Elegant Buckler':'Traits=Class,Swashbuckler',
  'Extravagant Parry':'Traits=Class,Swashbuckler',
  'Flashy Dodge':'Traits=Class,Swashbuckler',
  'Flying Blade':'Traits=Class,Swashbuckler Require="features.Precise Strike"',
  'Focused Fascination':
    'Traits=Class,Swashbuckler Require="features.Fascinating Performance"',
  'Goading Feint':'Traits=Class,Swashbuckler Require="rank.Deception >= 1"',
  'One For All':
    'Traits=Class,Swashbuckler,Auditory,Concentrate,Emotion,Linguistic,Mental '+
    'Require="rank.Diplomacy >= 1"',
  'Plummeting Roll':'Traits=Class,Swashbuckler Require="rank.Acrobatics >= 1"',
  // You're Next as above
  'After You':'Traits=Class,Swashbuckler Require="level >= 2"',
  'Antagonize':'Traits=Class,Swashbuckler Require="level >= 2"',
  'Brandishing Draw':'Traits=Class,Swashbuckler Require="level >= 2"',
  'Charmed Life':
    'Traits=Class,Swashbuckler Require="level >= 2","charismaModifier >= 2"',
  'Enjoy The Show':'Traits=Class,Swashbuckler Require="level >= 2"',
  'Finishing Follow-Through':'Traits=Class,Swashbuckler Require="level >= 2"',
  'Retreating Finisher':
    'Traits=Class,Swashbuckler,Finisher Require="level >= 2"',
  // Tumble Behind as above
  'Unbalancing Finisher':
    'Traits=Class,Swashbuckler,Finisher Require="level >= 2"',
  'Dastardly Dash':
    'Traits=Class,Swashbuckler,Flourish Require="level >= 4"',
  'Even The Odds':'Traits=Class,Swashbuckler Require="level >= 4"',
  'Flamboyant Athlete':
    'Traits=Class,Swashbuckler Require="level >= 4","rank.Athletics >= 4"',
  "Guardian's Reflection":'Traits=Class,Swashbuckler Require="level >= 4"',
  'Impaling Finisher':'Traits=Class,Swashbuckler,Finisher Require="level >= 4"',
  'Leading Dance':
    'Traits=Class,Swashbuckler,Bravado,Move ' +
    'Require="level >= 4","rank.Performance >= 1"',
  'Swaggering Initiative':'Traits=Class,Swashbuckler Require="level >= 4"',
  'Twirling Throw':
    'Traits=Class,Swashbuckler,Finisher ' +
    'Require="level >= 4","features.Flying Blade"',
  'Agile Maneuvers':
    'Traits=Class,Swashbuckler Require="level >= 6","rank.Athletics >= 2"',
  'Combination Finisher':'Traits=Class,Swashbuckler Require="level >= 6"',
  'Precise Finisher':
    'Traits=Class,Swashbuckler ' +
    'Require="level >= 6","rank.Athletics >= 2","features.Confident Finisher"',
  // Reactive Strike as above
  'Vexing Tumble':'Traits=Class,Swashbuckler,Bravado Require="level >= 6"',
  'Bleeding Finisher':'Traits=Class,Swashbuckler,Finisher Require="level >= 8"',
  'Distracting Toss':
    'Traits=Class,Swashbuckler,Bravado,Flourish Require="level >= 8"',
  'Dual Finisher':'Traits=Class,Swashbuckler,Finisher Require="level >= 8"',
  'Flashy Roll':
    'Traits=Class,Swashbuckler Require="level >= 8","features.Flashy Dodge"',
  'Stunning Finisher':'Traits=Class,Swashbuckler,Finisher Require="level >= 8"',
  'Vivacious Bravado':'Traits=Class,Swashbuckler Require="level >= 8"',
  'Buckler Dance':'Traits=Class,Swashbuckler,Stance Require="level >= 10"',
  'Derring-Do':'Traits=Class,Swashbuckler,Fortune Require="level >= 10"',
  'Reflexive Riposte':
    'Traits=Class,Swashbuckler ' +
    'Require="level >= 10","features.Opportune Riposte"',
  'Stumbling Finisher':
    'Traits=Class,Swashbuckler,Finisher Require="level >= 10"',
  'Switcheroo':'Traits=Class,Swashbuckler Require="level >= 10"',
  'Targeting Finisher':
    'Traits=Class,Swashbuckler,Finisher Require="level >= 10"',
  'Cheat Death':'Traits=Class,Swashbuckler Require="level >= 12"',
  'Get Used To Disappointment':
    'Traits=Class,Swashbuckler,Bravado ' +
    'Require="level >= 12","rank.Intimidation >= 2"',
  'Mobile Finisher':'Traits=Class,Swashbuckler,Finisher Require="level >= 12"',
  'The Bigger They Are':
    'Traits=Class,Swashbuckler,Bravado Require="level >= 12"',
  'Flamboyant Leap':
    'Traits=Class,Swashbuckler ' +
    'Require=' +
      '"level >= 14",' +
      '"rank.Athletics >= 3",' +
      '"features.Flamboyant Athlete"',
  'Impossible Riposte':
    'Traits=Class,Swashbuckler ' +
    'Require="level >= 14","features.Opportune Riposte"',
  'Perfect Finisher':
    'Traits=Class,Swashbuckler,Finisher,Fortune Require="level >= 14"',
  'Deadly Grace':'Traits=Class,Swashbuckler Require="level >= 16"',
  'Felicitous Riposte':
    'Traits=Class,Swashbuckler,Fortune Require="level >= 16"',
  'Revitalizing Finisher':
    'Traits=Class,Swashbuckler,Finisher Require="level >= 16"',
  'Incredible Luck':
    'Traits=Class,Swashbuckler,Fortune ' +
    'Require="level >= 18","features.Charmed Life"',
  'Lethal Finisher':
    'Traits=Class,Swashbuckler,Death,Finisher ' +
    // TODO require "precise strike 6d6"
    'Require="level >= 18"',
  'Parry And Riposte':
    'Traits=Class,Swashbuckler ' +
    'Require="level >= 18","features.Opportune Riposte"',
  'Illimitable Finisher':
    'Traits=Class,Swashbuckler,Finisher,Fortune Require="level >= 20"',
  'Inexhaustible Countermoves':
    'Traits=Class,Swashbuckler Require="level >= 20"',
  'Panache Paragon':'Traits=Class,Swashbuckler Require="level >= 20"',

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

  */
  'Bard Dedication':Pathfinder2E.FEATS['Bard Dedication'],
  /*
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
      '"rank.Unarmored Defense >= 2 || ' +
       'rank.Light Armor >= 2 || ' +
       'rank.Medium Armor >= 2 || ' +
       'rank.Heavy Armor >= 2"',

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
    'Traits=Archetype,Fighter ' +
    'Require="level >= 4","features.Fighter Dedication"',
  'Fighter Resiliency':
    'Traits=Archetype,Fighter ' +
    'Require="level >= 4","features.Fighter Dedication","classHitPoints <= 8"',
  'Opportunist':
    'Traits=Archetype,Fighter ' +
    'Require="level >= 4","features.Fighter Dedication"',
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
  'Advanced Kata':
    'Traits=Archetype,Monk Require="level >= 6","feats.Basic Kata"',
  'Monk Moves':
    'Traits=Archetype,Monk Require="level >= 8","feats.Monk Dedication"',
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
      '"rank.Arcana >= 3 || ' +
       'rank.Nature >= 3 || ' +
       'rank.Occultism >= 3 || ' +
       'rank.Religion >= 3"',
  'Master Sorcerer Spellcasting':
    'Traits=Archetype,Sorcerer ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Master Sorcerer Spellcasting",' +
      '"rank.Arcana >= 4 || ' +
       'rank.Nature >= 4 || ' +
       'rank.Occultism >= 4 || ' +
       'rank.Religion >= 4"',

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
    'Require=' +
      '"rank.Alcohol Lore >= 1 || ' +
       'rank.Cooking Lore >= 1 || ' +
       'rank.Crafting >= 1"',
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
      '"rank.Arcana >= 2 || ' +
       'rank.Nature >= 2 || ' +
       'rank.Occultism >= 2 || ' +
       'rank.Religion >= 2"',
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
    'Traits=General,Skill Require="level >= 7","rank.Athletics >= 3"',

  // Core 2

  'Leverage Connections':
    Pathfinder2E.FEATS.Connections
    .replace('Graces', 'Graces || features.Streetwise')

};
Pathfinder2ERemaster.FEATURES = {

  // Ancestry
  'Ancestry Feats':'Section=feature Note="%V selections"',

  // Dwarf
  'Ancient-Blooded Dwarf':Pathfinder2E.FEATURES['Ancient-Blooded Dwarf'],
  'Call On Ancient Blood':Pathfinder2E.FEATURES['Call On Ancient Blood'],
  'Darkvision':Pathfinder2E.FEATURES.Darkvision,
  'Death Warden Dwarf':
    Pathfinder2E.FEATURES['Death Warden Dwarf']
    .replace('necromancy', 'void and undead'),
  'Dwarf Heritage':Pathfinder2E.FEATURES['Dwarf Heritage'],
  'Forge Dwarf':Pathfinder2E.FEATURES['Forge Dwarf'],
  'Rock Dwarf':
    Pathfinder2E.FEATURES['Rock Dwarf']
    .replace('Shove', 'Reposition, Shove')
    .replace('knock prone', 'move or knock prone'),
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
    'Note="Inflicts additional damage equal to the number of damage dice vs. giant, goblin, hryngar, and orc foes, as well as for 1 min vs. any foe who critically hits self"',
  'Rock Runner':
    Pathfinder2E.FEATURES['Rock Runner']
    .replace('flat-footed', 'off-guard'),
  // Changed from Stonecunning
  "Stonemason's Eye":
    Pathfinder2E.FEATURES.Stonecunning
    .replace('Section=', 'Section=skill,')
    .replace('Note=', 'Note="Skill Trained (Crafting)",')
    .replace(' -2', ''),
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
    'Note="Gives 20\' imprecise tremorsense until the start of the next turn when standing on earth or stone"',
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
    'Note="Melee Strikes vs. a foe standing on the same earth or stone surface inflict additional damage equal to the number of weapon damage dice"',
  'Stonegate':
    'Section=magic ' +
    'Note="Knows the Magic Passage divine innate spell; can cast it once per day at 7th rank to open passages through earth or stone"',
  'Stonewall':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Petrifies self until the end of the turn, negating damage from the triggering effect and subsequent effects that would not affect stone, once per day"',

  // Elf
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
    'Note="+2 Seek within 30\' and reduces the flat check DC to find concealed or hidden targets to 3 or 9"',
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
      '"+2 Sense Motive to detect controlled creatures"',
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
    'Note="Can bring another person when affected by a multiple-target teleportation spell, and always arrives within 1 mile of the desired location"',

  // Gnome
  'Chameleon Gnome':Pathfinder2E.FEATURES['Chameleon Gnome'],
  'Fey-Touched Gnome':Pathfinder2E.FEATURES['Fey-Touched Gnome'],
  'Gnome Heritage':Pathfinder2E.FEATURES['Gnome Heritage'],
  // Low-Light Vision as above
  'Sensate Gnome':Pathfinder2E.FEATURES['Sensate Gnome'],
  'Umbral Gnome':Pathfinder2E.FEATURES['Umbral Gnome'],
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
    'Section=feature,skill ' +
    // TODO trouble randomizing?
    'Note=' +
      '"+2 Skill Feat (Additional Lore; Assurance)",' +
      '"Can use 1 day of downtime to change chosen Gnome Obsession skill"',
  // Changed
  'Gnome Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Gnome Weapons; Glaive; Kukri)",' +
      '"Has access to kukris and uncommon gnome weapons%{level>=5?\'/Critical hits with a gnome weapon, kukri, or glaive inflict its critical specialization effect\':\'\'}"',
  'Illusion Sense':Pathfinder2E.FEATURES['Illusion Sense'],
  'Razzle-Dazzle':
    'Section=magic ' +
    'Note="Extends an inflicted blinded or dazzled condition by 1 rd once per hr"',
  'Energized Font':Pathfinder2E.FEATURES['Energized Font'],
  'Project Persona':
    'Action=1 ' +
    'Section=magic ' +
    // TODO Will DC
    'Note="Places an illusion of normal clothing over self armor"',
  'Cautious Curiosity (Arcane)':
    'Section=magic ' +
    'Note="Knows the Disguise Magic and Silence arcane innate spells; can cast each on self at 2nd rank once per day"',
  'Cautious Curiosity (Occult)':
    'Section=magic ' +
    'Note="Knows the Disguise Magic and Silence occult innate spells; can cast each on self at 2nd rank once per day"',
  // Changed
  'First World Adept':
    'Section=magic ' +
     'Note="Knows the Invisibility and Revealing Light primal innate spells; can cast each at 2nd rank once per day"',
  'Life Leap':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Passes through an adjacent creature to the opposite side"',
  'Vivacious Conduit':Pathfinder2E.FEATURES['Vivacious Conduit'],
  'Instinctive Obfuscation':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Illusory double forces a DC 10 flat check on an attacking foe once per hr; failure negates the attack and destroys the double"',
  'Homeward Bound':
    'Section=magic ' +
    'Note="Knows the Interplanar Teleport primal innate spell; may use it twice per week to travel to the First World"',

  // Goblin
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
      '"Weapon Familiarity (Goblin Weapons)",' +
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
    'Note="After a successful Strike with a hand free, latches onto the target until a successful DC %{10+skillModifiers.Acrobatics} Escape"',
  'Skittering Scuttle':Pathfinder2E.FEATURES['Skittering Scuttle'],
  'Very, Very Sneaky':Pathfinder2E.FEATURES['Very, Very Sneaky'],
  'Reckless Abandon':
    'Action=Free ' +
    'Section=save ' +
    'Note="Critical failures and failures on saves due to hazardous actions are successes and result in minimum damage until the end of the turn once per day"',

  // Halfling
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
    'Note="Can transmit a 3-word hidden message to a target who succeeds on a DC 20 Perception check; the DC is reduced by 5 each for a halfling target and one with Folksy Patter"',
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
    'Note="Knows the Unfettered Movement primal spell; can cast it on self once per day"',
  'Ceaseless Shadows':Pathfinder2E.FEATURES['Ceaseless Shadows'],
  'Toppling Dance':
    'Section=combat ' +
    'Note="Melee and unarmed attacks on a foe in the same space have the trip trait/May share a space with a Large or larger prone creature"',
  'Shadow Self':
    'Section=skill ' +
    'Note="Can follow a successful Hide or Sneak with 1 min of invisibility; a hostile act ends"',

  // Human
  'Human Heritage':Pathfinder2E.FEATURES['Human Heritage'],
  'Skilled Human':Pathfinder2E.FEATURES['Skilled Heritage Human'],
  'Versatile Human':Pathfinder2E.FEATURES['Versatile Heritage Human'],

  'Adapted Cantrip':Pathfinder2E.FEATURES['Adapted Cantrip'],
  'Cooperative Nature':Pathfinder2E.FEATURES['Cooperative Nature'],
  'General Training':Pathfinder2E.FEATURES['General Training'],
  'Haughty Obstinacy':Pathfinder2E.FEATURES['Haughty Obstinacy'],
  'Natural Ambition':Pathfinder2E.FEATURES['Natural Ambition'],
  'Natural Skill':Pathfinder2E.FEATURES['Natural Skill'],
  'Unconventional Weaponry (%weapon)':
    Pathfinder2E.FEATURES['Unconventional Weaponry (%weapon)'],
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
    'Section=feature Note="+1 General Feat (up to 7th level)"',
  'Bounce Back':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Recovery from dying does not increase the wounded condition once per day"',
  'Stubborn Persistence':
    'Section=save Note="Successful DC 17 flat check negates becoming fatigued"',
  'Heroic Presence':
    'Action=1 ' +
    'Section=magic ' +
    'Note="R30\' Generates the effects of a 6th-rank <i>Zealous Conviction</i> on 10 willing creatures once per day"',

  // Leshy
  'Cactus Leshy':
    'Section=combat Note="Spines unarmed attack inflicts 1d6 HP piercing"',
  'Fruit Leshy':
    'Section=magic ' +
    'Note="Produces a fruit each day that restores %{1+(level-1)//2}d8 Hit Points if eaten within an hr after removal"',
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
      '"+2 vs. spells and effects that move or knock prone"',
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
      '"+1 initiative when using Deception"',
  'Leshy Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Leshy Lore) feature",' +
      '"Skill Trained (Nature; Stealth)"',
  'Leshy Superstition':
    'Action=Reaction Section=save Note="+1 on the triggering save"',
  'Seedpod':
    'Section=combat ' +
    'Note="R30\' Seedpod attack inflicts 1d4 HP bludgeoning, plus -10\' Speed until the start of the next turn on a critical success"',
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
    'Section=save ' +
    'Note="Gives +%{$\'features.Root Leshy\'?4:2} vs. Reposition, Shove, Trip, magical move, and magical knock prone and reduces the distance on a successful attempt by half; taking a move action ends"',
  'Leshy Glide':
    'Action=1 ' +
    'Section=ability ' +
    'Note="Glides downward, moving 5\' down and up to 25\' forward each rd"',
  'Ritual Reversion':
    'Action=2 ' +
    'Section=magic ' +
    'Note="Transforms self into a normal plant with AC 20 for 8 hr"',
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

  // Orc
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
    'Section=combat Note="Fists inflict lethal damage and can shove"',
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
    'Note="Lethal unarmed attacks inflict 1d4 HP persistent bleed"',
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
    'Note="Successful saves vs. magic give temporary HP equal to the effect level or double the spell rank"',
  'Rampaging Ferocity':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Using Orc Ferocity gives a Strike against the attacking foe that allows another use of Orc Ferocity if it reduces the foe to 0 HP"',

  // Changeling
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

  // Nephilim
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

  // Aiuvarin
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

  // Dromaar
  'Dromaar':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Low-Light Vision feature",' +
      '"Has the orc and dromaar traits and may take orc and dromaar ancestry feats"',
  'Monstrous Peacemaker':Pathfinder2E.FEATURES['Monstrous Peacemaker'],
  'Orc Sight':Pathfinder2E.FEATURES['Orc Sight'],

  // Core 2

  // Catfolk
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
    'Note="10 min sleep gives %{level} temporary Hit Points once per hr"',
  "Cat's Luck":
    'Action=Free ' +
    'Section=save ' +
    'Note="Rerolls a failed Reflex save once per %{combatNotes.reliableLuck?\'hr\':\'day\'}"',
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

  // Hobgoblin
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
    'Note="30\' emanation gives allies %{level} temporary Hit Points and an additional Step, Stride, or Strike each rd for 1 min"',

  // Kholo
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

  // Kobold
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
    'Note="10\' emanation inflicts %{(level-3)//2}d6 HP sonic (<b>save basic Fortitude</b>), and a subsequent Stride triggers no reactions from any creature that failed to save, once per hr"',
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

  // Lizardfolk
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
    'Note="+1 vs. disease, and successes vs. disease are critical successes/Takes damage from thirst every 2 hr and from starvation every 2 days"',
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
    'Note="Can use a 24-hr hibernation to gain effects of <i>Enlarge</i> and +%{level} Hit Points permanently"',

  // Ratfolk
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
      '"Improves saves vs. <i>Quandary</i> by 1 degree",' +
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
    'Note="Rolls %{speed*4}\' down an incline; after the 1st rd, suffers slowed 2 and suffers and inflicts 4d6 HP bludgeoning if stopped by an obstacle"',
  'Big Mouth':'Section=feature Note="Has increased Cheek Pouches effects"',
  'Overcrowd':
    'Section=combat ' +
    'Note="Can end movement in the same square as %{features.Shinstabber?\'an\':\'a Small or smaller\'} ally"',
  'Rat Form':'Action=1 Section=magic Note="Becomes a Tiny rat"',
  'Uncanny Cheeks':
    'Section=feature ' +
    'Note="Has the Prescient Consumable and Prescient Planner features"',
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

  // Tengu
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
    'Note="R60\' Counteracts a fortune or misfortune effects once per %{combatNotes.jinxGlutton?\'hr\':\'day\'}"',
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

  // Tripkee
  // Low-Light Vision as above
  'Natural Climber':'Section=skill Note="+2 Athletics to Climb"',
  'Tripkee Heritage':'Section=feature Note="1 selection"',
  'Poisonhide Tripkee':
    'Section=combat ' +
    'Note="Can use a reaction once per hr to exude a poison that inflicts %{(level+1)//2}d4 HP poison (<b>save basic Fortitude</b>)"',
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
    'Note="Can use Nature instead of Armor Class vs. a natural creature once per hr"',
  'Jungle Strider':
    'Section=ability,skill ' +
    'Note=' +
      '"Moves normally through difficult terrain in forests and jungles",' +
      '"Does not suffer off-guard when Balancing on narrow surfaces or uneven ground made of plants, and successes to do so are critical successes"',
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

  // Dhampir
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
    'Note="Knows the Pest Form divine innate spell; can cast it (bat only) once per hr"',
  'Symphony Of Blood':
    'Section=magic ' +
    'Note="Knows the Vampiric Exsanguination divine innate spell; can cast it once per day"',

  // Dragonblood
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
    'Note="Successful Athletics vs. Fortitude inflicts %{level} HP bludgeoning and a 5\' push, %{level*2} HP and 10\' on a critical success, or %{level//2} HP only on a failure; critical failure inflicts prone on self"',
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

  // Duskwalker
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
  'Duskwalker Weapon Familiarity':
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
  'Deity':
    Pathfinder2E.FEATURES.Deity
    .replace('Anathema feature', 'Anathema and Sanctification features'),
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
    'Note="Rerolls a failed mental save with a +2 bonus once per hr"',
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
    .replace('Wild Morph', 'Untamed Shift'),
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
    'Note="Companion can use 2 actions to inflict 1d6 HP sonic per 2 levels and frightened 1 in a 30\' cone once per hr (<b>save basic Fortitude</b> also negates frightened; critical failure inflicts frightened 2)"',
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
  'Quick Shield Block':Pathfinder2E.FEATURES['Quick Shield Block'],
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
  'Rites Of Transfiguration':
    'Section=magic ' +
    'Note="Can use a 10-min process to replace a prepared spell of at least 6th rank with <i>Cursed Metamorphosis</i>"',
  "Patron's Presence":
    'Section=combat Note="Familiar can use 2 actions to create a 15\' emanation that inflicts stupefied 2 on foes (<b>save Will</b> negates; critical failure inflicts stupefied 3) while sustained for up to 1 min once per hr"',
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
    'Note="Familiar can spend 2 actions for a R30\' attack that inflicts 10d10 HP spirit and drained 2 (<b>save basic Fortitude</b> also negates drained; critical failure inflicts drained 4) and restores 1 Focus Point to self once per hr"',
  'Hex Master':
    'Section=magic ' +
    'Note="Can cast multiple hexes per turn, and <i>Cackle</i> Sustains all active hexes"',
  "Patron's Truth":'Section=magic Note="+1 10th rank spell slot"',
  "Witch's Hut":
    'Section=magic Note="1-day ritual creates an animated Huge or smaller dwelling with %{armorClass} AC, +%{perception} Perception, 60\' Speed 150 HP, and Hardness 10 that can guard, hide, teleport, lock, and move"',

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
  'Advanced School Spell (School Of Ars Grammatica)':
    'Section=magic ' +
    'Note="Knows the Rune Of Observation arcane focus spell"',
  'Advanced School Spell (School Of Battle Magic)':
    'Section=magic ' +
    'Note="Knows the Energy Absorption arcane focus spell"',
  'Advanced School Spell (School Of The Boundary)':
    'Section=magic ' +
    'Note="Knows the Spiral Of Horrors arcane focus spell"',
  'Advanced School Spell (School Of Civic Wizardry)':
    'Section=magic ' +
    'Note="Knows the Community Restoration arcane focus spell"',
  'Advanced School Spell (School Of Mentalism)':
    'Section=magic ' +
    'Note="Knows the Invisibility Cloak arcane focus spell"',
  'Advanced School Spell (School Of Protean Form)':
    'Section=magic ' +
    'Note="Knows the Shifting Form arcane focus spell"',
  'Advanced School Spell (School Of Unified Magical Theory)':
    'Section=magic ' +
    'Note="Knows the Interdisciplinary Incantation arcane focus spell"',
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
  'Advanced Alchemy':
    Pathfinder2E.FEATURES['Advanced Alchemy']
    .replace('use a batch of infused reagents to create 2', 'create %{intelligenceModifier+(!skillNotes.efficientAlchemy?4:!skillNotes.advancedEfficientAlchemy?6:level>=16?10:8)}'),
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
  'Quick Alchemy':
    Pathfinder2E.FEATURES['Quick Alchemy']
    .replace('batches of infused reagents', 'versatile vials'),
  'Research Field':Pathfinder2E.FEATURES['Research Field'],
  'Versatile Vials':
    Pathfinder2E.FEATURES['Infused Reagents']
    .replace('level', '2+(skillNotes.efficientAlchemy?4:0)')
    .replace('batches of infused reagents', 'versatile vials'),
  // Weapon Specialization as above
  'Will Expertise':Pathfinder2E.FEATURES['Iron Will'],

  'Alchemical Familiar':Pathfinder2E.FEATURES['Alchemical Familiar'],
  'Alchemical Assessment':
    Pathfinder2E.FEATURES['Alchemical Savant']
    .replace(/\/[^"]*/, ''),
  'Blowgun Poisoner':
    'Section=combat ' +
    'Note="Critical success with a poisoned blowgun Strike inflicts 1 degree worse on the save/Successful Stealth vs. Perception when using a blowgun allows remaining hidden or undetected"',
  'Far Lobber':Pathfinder2E.FEATURES['Far Lobber'],
  'Quick Bomber':
    Pathfinder2E.FEATURES['Quick Bomber']
    .replace('Draws', 'Draws or uses Quick Alchemy to create'),
  'Soothing Vials':
    'Section=skill ' +
    'Note="Versatile vial that restores Hit Points allows an immediate +1 Will saving throw to end 1 mental effect"',
  'Clotting Elixirs':
    'Section=skill ' +
    'Note="Healing elixirs allow a DC 10 flat check to remove any persistent bleed damage"',
  'Improvise Admixture':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Crafting check using an alchemist\'s toolkit provides 1, 2, or 3 versatile vials on a failure, success, or critical success once per day"',
  'Pernicious Poison':
    'Section=combat ' +
    'Note="Specially-prepared poison inflicts HP equal to its level if the target saves"',
  'Revivifying Mutagen':Pathfinder2E.FEATURES['Revivifying Mutagen'],
  'Smoke Bomb':
    Pathfinder2E.FEATURES['Smoke Bomb']
    .replace(/of up to level.*that/, 'that') + ' ' +
    'Action=',
  // Changed effects
  'Efficient Alchemy':
    'Section=skill,skill ' +
    'Note=' +
      '"Has increased Advanced Alchemy effects",' +
      '"Can produce twice the usual number of alchemical items during downtime"',
  'Enduring Alchemy':Pathfinder2E.FEATURES['Enduring Alchemy'],
  'Healing Bomb':
    'Section=combat ' +
    'Note="Successful ranged Strike with an elixir of life gives its effects to the target and restores Hit Points equal to the elixir\'s dice to adjacent creatures; failure restores Hit Points equal to the elixir\'s dice to the target only"',
  'Invigorating Elixir':
    'Section=skill ' +
    'Note="Prepared elixir can be imbibed by sickened creatures and attempts to counteract imbiber\'s choice of clumsy, enfeebled, sickened, or stupefied"',
  'Regurgitate Mutagen':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Ends a mutagen to inflict %{level//2}d6 HP acid and sickened 1 (<b>save basic Reflex</b> also negates sickened; critical failure inflicts sickened 2)"',
  'Tenacious Toxins':
    'Section=skill ' +
    'Note="Increases duration of poisons by their stage 1 interval"',
  'Combine Elixirs':
    Pathfinder2E.FEATURES['Combine Elixirs'] + ' ' +
    'Action= ' +
    'Note="Uses the ingredients of 2 elixirs to create a single elixir that has the effects of both"',
  'Debilitating Bomb':
    Pathfinder2E.FEATURES['Debilitating Bomb']
    .replace('of up to level.*that', 'that') + ' ' +
    'Action=',
  'Directional Bombs':Pathfinder2E.FEATURES['Directional Bombs'],
  'Fortified Elixirs':
    'Section=skill ' +
    'Note="Consumer of an infused antidote or antiplague can end its effects to gain a reroll on a failed Fortitude save vs. poison or disease"',
  'Sticky Poison':
    'Section=combat ' +
    'Note="Poisoned weapon remains poisoned for 1 rd after a Strike on a successful DC 17 flat check, or DC 5 if the Strike had no effect"',
  'Alter Admixture':
    'Section=skill ' +
    'Note="Can use a 10 min process to change the type of an alchemical bomb, elixir, or poison"',
  'Improved Invigorating Elixir (Mental)':
    'Section=skill ' +
    'Note="Can make invigorating elixirs that counteract confused, controlled, fleeing, frightened, paralyzed, or slowed"',
  'Improved Invigorating Elixir (Physical)':
    'Section=skill ' +
    'Note="Can make invigorating elixirs that counteract blinded, deafened, drained, paralyzed, or slowed"',
  'Mutant Physique':
    'Section=skill ' +
    'Note="Bestial mutagens give an Intimidation bonus and increase claws and jaws damage die by 1 step and give them the deadly d10 trait; juggernaut mutagens give %{level//2} physical damage resistance, and quicksilver mutagens give 10\' Steps and Squeezing as one size smaller"',
  'Pinpoint Poisoner':
    'Section=combat ' +
    'Note="Off-guard targets suffer -2 initial saves vs. self poisoned weapons and inhaled poisons"',
  'Sticky Bomb':
    Pathfinder2E.FEATURES['Sticky Bomb'] + ' ' +
    'Action= ' +
    'Note="Can create bombs that inflict persistent damage equal to their splash damage"',
  'Advanced Efficient Alchemy':
    'Section=skill Note="Has increased Advance Alchemy effects"',
  'Expanded Splash':Pathfinder2E.FEATURES['Expanded Splash'],
  'Greater Debilitating Bomb':
    Pathfinder2E.FEATURES['Greater Debilitating Bomb'],
  'Unstable Concoction':
    'Section=skill ' +
    'Note="Can increase the die size of the initial effects of a alchemical consumable by 1 step; the consumer suffers acid damage equal to the items level (DC 10 flat check negates)"',
  'Extend Elixir':Pathfinder2E.FEATURES['Extend Elixir'],
  'Supreme Invigorating Elixir':
    'Section=skill ' +
    'Note="Invigorating elixirs counteract as level %{level+2} and can counteract petrified, stunned, or any disease"',
  'Uncanny Bombs':Pathfinder2E.FEATURES['Uncanny Bombs'],
  'Double Poison':
    'Section=combat ' +
    'Note="Can apply 2 poisons of up to level %{level-2} to a weapon simultaneously"',
  'Mutant Innervation':
    'Section=skill ' +
    'Note="Cogintive mutagens boost Deception, Diplomacy, Intimidation, Medicine, Nature, Performance, Religion, and Survival and allow R60\' telepathic communication; Serene mutagens negate detection, revelation, and scrying effects up to rank 9; Silvertongue mutagens negate circumstance penalties to Deception, Diplomacy, Intimidation, and Performance and translate speech into listeners\' languages"',
  'True Debilitating Bomb':
    Pathfinder2E.FEATURES['True Debilitating Bomb']
    .replace(/or a lesser[^"]*/, ''),
  'Eternal Elixir':Pathfinder2E.FEATURES['Eternal Elixir'],
  'Exploitive Bomb':
    Pathfinder2E.FEATURES['Exploitive Bomb']
    .replace(/ of up to level.*that/, 'that') + ' ' +
    'Action=',
  'Persistent Mutagen':Pathfinder2E.FEATURES['Persistent Mutagen'],
  'Improbable Elixirs':Pathfinder2E.FEATURES['Improbable Elixirs'],
  'Miracle Worker':Pathfinder2E.FEATURES['Miracle Worker'],
  'Perfect Debilitation':Pathfinder2E.FEATURES['Perfect Debilitation'],
  'Alchemical Revivification':
    'Section=save ' +
    'Note="If killed while under the effects of an elixir, returns to life next turn with the effects of a major bestial, juggernaut, or quicksilver mutagen"',
  "Craft Philosopher's Stone":
    Pathfinder2E.FEATURES["Craft Philosopher's Stone"],
  'Mega Bomb':
    Pathfinder2E.FEATURES['Mega Bomb'] + ' ' +
    'Action=2',

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
    'Action=Free ' +
    'Section=combat ' +
    'Note="Enters rage during initiative when unencumbered and in medium or lighter armor"',
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

  'Acute Vision':Pathfinder2E.FEATURES['Acute Vision'],
  'Adrenaline Rush':
    'Section=ability,skill ' +
    'Note=' +
      '"+2 encumbrance and maximum Bulk during rage",' +
      '"+1 Athletics to lift, Escape, and Force Open during rage"',
  'Draconic Arrogance':'Section=save Note="+2 vs. emotion effects during rage"',
  'Moment Of Clarity':Pathfinder2E.FEATURES['Moment Of Clarity'],
  'Raging Intimidation':Pathfinder2E.FEATURES['Raging Intimidation'],
  'Raging Thrower':Pathfinder2E.FEATURES['Raging Thrower'],
  // Sudden Charge as above
  'Acute Scent':Pathfinder2E.FEATURES['Acute Scent'],
  'Bashing Charge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="+1 to Force Open an obstacle during a double Stride"',
  'Furious Finish':Pathfinder2E.FEATURES['Furious Finish'],
  // Intimidating Strike as above
  'No Escape':Pathfinder2E.FEATURES['No Escape'],
  'Second Wind':Pathfinder2E.FEATURES['Second Wind'],
  'Shake It Off':Pathfinder2E.FEATURES['Shake It Off'],
  // Barreling Charge as above
  'Oversized Throw':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Uses an item from surroundings to make a R20\' ranged strike that deals %{combatNotes.greaterWeaponSpecialization?3:combatNotes.weaponSpecialization?2:1}d10 HP bludgeoning"',
  'Raging Athlete':Pathfinder2E.FEATURES['Raging Athlete'],
  'Scars Of Steel':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives resistance %{constitutionModifier+level//2} to the damage from the triggering critical hit once per day"',
  'Spiritual Guides':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Rerolls a normal failure on a Perception or skill check once per day"',
  'Supernatural Senses':
    'Section=skill ' +
    'Note="Reduces flat check to attack a concealed or hidden target to 3 or 9"',
  // Swipe as above
  'Wounded Rage':Pathfinder2E.FEATURES['Wounded Rage'],
  'Animal Skin':Pathfinder2E.FEATURES['Animal Skin'],
  'Brutal Bully':
    Pathfinder2E.FEATURES['Brutal Bully']
    .replace('Shove', 'Reposition, Shove'),
  'Cleave':Pathfinder2E.FEATURES.Cleave,
  "Dragon's Rage Breath":
    Pathfinder2E.FEATURES["Dragon's Rage Breath"] + ' ' +
    'Note="Breath inflicts %{level}d6 damage in a 30\' cone once per 10 min (<b>save basic Reflex</b>)"',
  "Giant's Stature":Pathfinder2E.FEATURES["Giant's Stature"],
  'Inner Strength':
    'Action=1 Section=save Note="Reduces enfeebled condition by 1"',
  'Mage Hunter':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike on a spell caster inflicts stupefied 1 for 1 rd, or stupefied 2 on a critical hit"',
  'Nocturnal Senses':
    'Section=feature ' +
    'Note="Low-Light Vision becomes Darkvision while raging and imprecise scent range increases to 60\'"',
  // Reactive Strike as above
  'Scouring Rage':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Upon entering rage, 20\' emanation inflicts %{level} HP modified rage damage type on foes (<b>save basic Fortitude</b>)"',
  "Spirits' Interference":Pathfinder2E.FEATURES["Spirits' Interference"],
  'Animalistic Brutality':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmed attack gains backswing, forceful, parry, or razing trait until rage ends"',
  'Disarming Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike allows an Athletics check to Disarm"',
  'Follow-Up Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Follows a melee Strike miss with another with the backswing and forceful traits"',
  'Friendly Toss':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Throws an adjacent ally to a space within 30\', where it can use a Reaction for a melee Strike against a foe"',
  'Furious Bully':Pathfinder2E.FEATURES['Furious Bully'],
  'Instinctive Strike':
    'Section=combat ' +
    'Note="Melee Strikes against scent-detected foes ignore concealed and hidden"',
  'Invulnerable Rager':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense %V (Heavy Armor)",' +
      '"May use Quick-Tempered action in heavy armor"',
  'Renewed Vigor':
    Pathfinder2E.FEATURES['Renewed Vigor']
    .replace('Hit Points', 'Hit Points, or %{level+constitutionModifier} after attacking'),
  'Share Rage':Pathfinder2E.FEATURES['Share Rage'],
  // Sudden Leap as above
  'Thrash':Pathfinder2E.FEATURES.Thrash,
  'Come And Get Me':
    Pathfinder2E.FEATURES['Come And Get Me']
    .replaceAll('flat-footed', 'off-guard'),
  'Furious Sprint':Pathfinder2E.FEATURES['Furious Sprint'],
  'Great Cleave':Pathfinder2E.FEATURES['Great Cleave'],
  'Impressive Landing':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Reduces fall damage by 10\' and inflicts 5 HP bludgeoning and difficult terrain in a 5\' emanation"',
  'Knockback':Pathfinder2E.FEATURES.Knockback,
  // Overpowering Charge as above
  'Resounding Blow':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful melee Strike inflicts deafened for 1 rd, or for 1 min with a critical hit"',
  'Silencing Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike inflicts stunned 1, requiring a successful DC flat check to use linguistic actions (<b>save Fortitude</b> negates; critical success inflicts stunned 3)"',
  'Tangle Of Battle':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a Grapple attempt immediately after a critical hit"',
  'Terrifying Howl':Pathfinder2E.FEATURES['Terrifying Howl'],
  "Dragon's Rage Wings":Pathfinder2E.FEATURES["Dragon's Rage Wings"],
  'Embrace The Pain':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful Athletics check inflects Grapple or Disarm after a foe melee hit"',
  'Furious Grab':Pathfinder2E.FEATURES['Furious Grab'],
  "Predator's Pounce":Pathfinder2E.FEATURES["Predator's Pounce"],
  "Spirit's Wrath":Pathfinder2E.FEATURES["Spirit's Wrath"],
  'Sunder Spell':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike on a creature, object, or spell manifestation allows an attempt to counteract a spell or magical effect"',
  "Titan's Stature":Pathfinder2E.FEATURES["Titan's Stature"],
  'Unbalancing Sweep':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Makes a Shove or Trip against three foes within reach"',
  'Awesome Blow':Pathfinder2E.FEATURES['Awesome Blow'],
  "Giant's Lunge":Pathfinder2E.FEATURES["Giant's Lunge"],
  'Impaling Thrust':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike with a piercing melee weapon inflicts grabbed, then persistent bleed damage equal to the weapon\'s damage dice"',
  'Sunder Enchantment':
    'Section=combat ' +
    'Note="Can use Sunder Spell to counteract an unattended magic item or one possessed by the target to make it mundane for 10 min"',
  'Vengeful Strike':
    Pathfinder2E.FEATURES['Vengeful Strike']
    .replace(/"$/, '; using in response to a critical hit is a free action"'),
  // Whirlwind Strike as above
  'Collateral Thrash':Pathfinder2E.FEATURES['Collateral Thrash'],
  'Desperate Wrath':Pathfinder2E.FEATURES['Reckless Abandon'],
  'Dragon Transformation':
    Pathfinder2E.FEATURES['Dragon Transformation']
    .replace('level', 'rank'),
  'Furious Vengeance':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike against a foe that inflicts a critical hit"',
  'Penetrating Projectile':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a ranged or thrown piercing weapon Strike on each creature in a 30\' line"',
  'Shattering Blows':
    'Section=combat Note="Strikes ignore %{features.Devastator?10:5} Hardness"',
  'Brutal Critical':Pathfinder2E.FEATURES['Brutal Critical'],
  'Perfect Clarity':Pathfinder2E.FEATURES['Perfect Clarity'],
  'Vicious Evisceration':Pathfinder2E.FEATURES['Vicious Evisceration'],
  'Whirlwind Toss':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Collateral Thrash affects all adjacent foes"',
  'Annihilating Swing':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Melee Strike ignores target resistances, destroys non-magical objects with Hardness up to 20, and destroys magical objects with Hardness up to 20 with a successful counteract check"',
  'Contagious Rage':Pathfinder2E.FEATURES['Contagious Rage'],
  'Quaking Stomp':Pathfinder2E.FEATURES['Quaking Stomp'],
  'Unstoppable Juggernaut':
    'Section=save ' +
    'Note="Has resistance %{constitutionModifier+3} to all damage, resistance %{constitutionModifier+8} during rage, and can retain 1 Hit Point and suffer wounded 2 when reduced to 0 Hit Points during rage"',

  // Champion
  // Anathema as above
  // Armor Expertise as above
  // Armor Mastery as above
  'Blessed Armament':
    Pathfinder2E.FEATURES['Blade Ally']
    .replace('<i>disrupting</i>', '<i>fearsome</i>, <i>vitalizing</i>'),
  'Blessed Shield':
    'Section=combat Note="+%V Shield Hardness/+%1 Shield Hit Points"',
  'Blessed Swiftness':
    'Section=ability,combat ' +
    'Note=' +
      '"+5 Speed",' +
      '"Ally moving within aura gains +2 defense vs. reactions"',
  'Blessing Of The Devoted':
    Pathfinder2E.FEATURES['Divine Ally']
    .replace('divineAlly', 'blessingOfTheDevoted'),
  'Cause':'Section=feature Note="1 selection"',
  'Champion Expertise':Pathfinder2E.FEATURES['Champion Expertise'],
  'Champion Feats':Pathfinder2E.FEATURES['Champion Feats'],
  'Champion Key Attribute':Pathfinder2E.FEATURES['Champion Key Ability'],
  'Champion Mastery':Pathfinder2E.FEATURES['Champion Mastery'],
  'Champion Skills':Pathfinder2E.FEATURES['Champion Skills'],
  "Champion's Aura":
    'Section=feature ' +
    'Note="15\' aura can be detected by followers of %{deity} and can be suppressed or resumed with 1 action"',
  'Deific Weapon':Pathfinder2E.FEATURES['Deific Weapon'],
  // Deity as above
  'Desecration':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Selfish Shield feature",' +
      '"Must subvert all that is pure and holy"',
  'Destructive Vengeance':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Attack on self inflicts an additional %{level<5?1:level<9?2:level<12?3:level<16?4:level<19?5:6} and an equal amount of spirit damage on attacker, and self Strikes on attacker inflict +%{level<9?2:level<16?4:6} HP spirit until the end of the next turn"',
  'Devotion Spells':Pathfinder2E.FEATURES['Devotion Spells'],
  'Divine Will':Pathfinder2E.FEATURES['Divine Will'],
  'Exalted Reaction (Desecration)':
    'Section=combat ' +
    'Note="Selfish Shield inflicts -1 on foe attacks on self from within aura"',
  'Exalted Reaction (Grandeur)':
    'Section=combat ' +
    'Note="Flash Of Grandeur inflicts <i>Revealing Light</i> on all foes within aura"',
  'Exalted Reaction (Iniquity)':
    'Section=combat ' +
    'Note="Destructive Vengeance also inflicts half its damage on other foes within aura"',
  'Exalted Reaction (Justice)':
    Pathfinder2E.FEATURES['Exalt (Paladin)']
    .replace("R15' ", '')
    .replace('allies', 'allies within aura'),
  'Exalted Reaction (Liberation)':
    Pathfinder2E.FEATURES['Exalt (Liberator)']
    .replace("R15' ", '')
    .replace('all allies', 'self and all allies within aura')
    .replace(/ if[^"]*/, ''),
  'Exalted Reaction (Obedience)':
    'Section=combat ' +
    'Note="Iron Command also inflicts %{level<12?3:level<16?4:level<19?5:6} HP mental on other foes within aura who refuse to kneel"',
  'Exalted Reaction (Redemption)':
    Pathfinder2E.FEATURES['Exalt (Redeemer)']
    .replace("R15' ", '')
    .replace('all allies', 'self and all allies within aura'),
  'Flash Of Grandeur':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives an ally within aura resistance %{level+2} to triggering damage and inflicts <i>Revealing Light</i> on attacker for 1 rd"',
  'Glimpse Of Redemption':
    Pathfinder2E.FEATURES['Glimpse Of Redemption']
    .replace("R15' ", '')
    .replace('ally', 'ally within aura'),
  'Grandeur':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Flash Of Grandeur feature",' +
      '"Must provide a shining example for others"',
  // Greater Weapon Specialization as above
  "Hero's Defiance":Pathfinder2E.FEATURES["Hero's Defiance"],
  'Iniquity':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Destructive Vengeance feature",' +
      '"Must destroy and take advantage of others"',
  'Iron Command':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Triggering foe suffers its choice of kneeling or %{level<5?1:level<9?2:level<12?3:level<16?4:level<19?5:6}d6 HP mental, and self Strikes vs. that foe inflict +%{level<9?1:level<16?2:3} HP spirit until the end of the next turn"',
  'Justice':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Retributive Strike feature",' +
      '"Must follow the law and respect legitimate authorities"',
  'Legendary Armor':Pathfinder2E.FEATURES['Legendary Armor'],
  'Liberating Step':
    Pathfinder2E.FEATURES['Liberating Step']
    .replace("R15' ", '')
    .replace('ally', 'ally within aura'),
  'Liberation':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Liberating Step feature",' +
      '"Must respect others\' freedom and oppose tyranny"',
  'Obedience':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Iron Command feature",' +
      '"Must enforce proper hierarchies and lead when appropriate"',
  // Perception Expertise as above
  // Reflex Expertise as above
  'Redemption':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Glimpse Of Redemption feature",' +
      '"Must always show compassion for others and attempt to redeem the wicked"',
  'Relentless Reaction (Desecration)':
    'Section=combat ' +
    'Note="Has increased Selfish Shield effects"',
  'Relentless Reaction (Grandeur)':
    'Section=combat ' +
    'Note="Flash Of Grandeur also inflicts %{charismaModifier} HP spirit on attacker, unrecoverable while affected by <i>Revealing Light</i>"',
  'Relentless Reaction (Iniquity)':
    'Section=combat ' +
    'Note="Destructive Vengeance also inflicts %{charismaModifier} HP persistent spirit"',
  'Relentless Reaction (Justice)':
    'Section=combat ' +
    'Note="Retributive Strike also inflicts %{charismaModifier} HP persistent spirit"',
  'Relentless Reaction (Liberation)':
    'Section=combat ' +
    'Note="Liberating Step also inflicts %{charismaModifier} HP persistent spirit on triggering foe who was restraining ally"',
  'Relentless Reaction (Obedience)':
    'Section=combat ' +
    'Note="Iron Command also inflicts %{charismaModifier} HP persistent spirit on a foe who refuses to kneel"',
  'Relentless Reaction (Redemption)':
    'Section=combat ' +
    'Note="Glimpse Of Redemption also inflicts %{charismaModifier} HP spirit on an attacker who refuses to repent"',
  'Retributive Strike':
    Pathfinder2E.FEATURES['Retributive Strike']
    .replace("R15' ", '')
    .replace('ally', 'ally within aura'),
  'Sacred Body':Pathfinder2E.FEATURES.Juggernaut,
  // Sanctification as above
  'Selfish Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives resistance %{level//2+($\'combatNotes.relentlessReaction(Desecration)\'&&charismaModifier>2?charismaModifier:2)} to triggering damage, and Strikes against the triggering foe inflict +%{level<9?1:level<16?2:3} HP spirit for 1 rd"',
  // Shield Block as above
  // Weapon Expertise as above
  // Weapon Mastery as above
  // Weapon Specialization as above

  'Brilliant Flash':
    'Section=combat Note="Flash Of Grandeur inflicts off-guard for 1 rd"',
  'Defensive Advance':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Uses Raise A Shield, Strides, and then makes a melee Strike"',
  "Deity's Domain (Air)":
    Pathfinder2E.FEATURES["Deity's Domain (Air)"],
  "Deity's Domain (Ambition)":
    Pathfinder2E.FEATURES["Deity's Domain (Ambition)"]
    .replace('Blind', 'Ignite'),
  "Deity's Domain (Cities)":
    Pathfinder2E.FEATURES["Deity's Domain (Cities)"],
  "Deity's Domain (Confidence)":
    Pathfinder2E.FEATURES["Deity's Domain (Confidence)"],
  "Deity's Domain (Creation)":
    Pathfinder2E.FEATURES["Deity's Domain (Confidence)"]
    .replace('Splash Of Art', 'Creative Splash'),
  "Deity's Domain (Darkness)":
    Pathfinder2E.FEATURES["Deity's Domain (Darkness)"],
  "Deity's Domain (Death)":
    Pathfinder2E.FEATURES["Deity's Domain (Death)"],
  "Deity's Domain (Destruction)":
    Pathfinder2E.FEATURES["Deity's Domain (Destruction)"],
  "Deity's Domain (Dreams)":
    Pathfinder2E.FEATURES["Deity's Domain (Dreams)"],
  "Deity's Domain (Earth)":
    Pathfinder2E.FEATURES["Deity's Domain (Earth)"],
  "Deity's Domain (Family)":
    Pathfinder2E.FEATURES["Deity's Domain (Family)"],
  "Deity's Domain (Fate)":
    Pathfinder2E.FEATURES["Deity's Domain (Fate)"],
  "Deity's Domain (Fire)":
    Pathfinder2E.FEATURES["Deity's Domain (Fire)"],
  "Deity's Domain (Freedom)":
    Pathfinder2E.FEATURES["Deity's Domain (Freedom)"],
  "Deity's Domain (Healing)":
    Pathfinder2E.FEATURES["Deity's Domain (Healing)"],
  "Deity's Domain (Indulgence)":
    Pathfinder2E.FEATURES["Deity's Domain (Indulgence)"],
  "Deity's Domain (Luck)":
    Pathfinder2E.FEATURES["Deity's Domain (Luck)"],
  "Deity's Domain (Magic)":
    Pathfinder2E.FEATURES["Deity's Domain (Magic)"],
  "Deity's Domain (Might)":
    Pathfinder2E.FEATURES["Deity's Domain (Might)"],
  "Deity's Domain (Moon)":
    Pathfinder2E.FEATURES["Deity's Domain (Moon)"],
  "Deity's Domain (Nature)":
    Pathfinder2E.FEATURES["Deity's Domain (Nature)"],
  "Deity's Domain (Nightmares)":
    Pathfinder2E.FEATURES["Deity's Domain (Nightmares)"],
  "Deity's Domain (Pain)":
    Pathfinder2E.FEATURES["Deity's Domain (Pain)"],
  "Deity's Domain (Passion)":
    Pathfinder2E.FEATURES["Deity's Domain (Passion)"],
  "Deity's Domain (Perfection)":
    Pathfinder2E.FEATURES["Deity's Domain (Perfection)"],
  "Deity's Domain (Protection)":
    Pathfinder2E.FEATURES["Deity's Domain (Protection)"],
  "Deity's Domain (Secrecy)":
    Pathfinder2E.FEATURES["Deity's Domain (Secrecy)"]
    .replace('Forced', 'Whispering'),
  "Deity's Domain (Sun)":
    Pathfinder2E.FEATURES["Deity's Domain (Sun)"],
  "Deity's Domain (Travel)":
    Pathfinder2E.FEATURES["Deity's Domain (Travel)"],
  "Deity's Domain (Trickery)":
    Pathfinder2E.FEATURES["Deity's Domain (Trickery)"],
  "Deity's Domain (Truth)":
    Pathfinder2E.FEATURES["Deity's Domain (Truth)"],
  "Deity's Domain (Tyranny)":
    Pathfinder2E.FEATURES["Deity's Domain (Tyranny)"],
  "Deity's Domain (Undeath)":
    Pathfinder2E.FEATURES["Deity's Domain (Undeath)"],
  "Deity's Domain (Water)":
    Pathfinder2E.FEATURES["Deity's Domain (Water)"],
  "Deity's Domain (Wealth)":
    Pathfinder2E.FEATURES["Deity's Domain (Wealth)"],
  "Deity's Domain (Zeal)":
    Pathfinder2E.FEATURES["Deity's Domain (Zeal)"],
  'Desperate Prayer':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Gains 1 Focus Spell to cast a devotion spell by the end of the turn"',
  'Faithful Steed':
    'Section=feature Note="Has a young animal companion as a mount"',
  'Iron Repercussions':
    'Section=magic ' +
    'Note="Iron Command can inflict persistent mental damage"',
  'Nimble Reprisal':Pathfinder2E.FEATURES['Ranged Reprisal'],
  'Ongoing Selfishness':
    'Section=combat ' +
    'Note="Selfish Shield gives half resistance to all damage from the triggering foe until the end of the turn"',
  // TODO: extends to everyone who Steps if self has exalted reaction
  'Unimpeded Step':Pathfinder2E.FEATURES['Unimpeded Step'],
  'Vicious Vengeance':
    'Section=combat ' +
    'Note="Destructive Vengeance inflicts additional damage on foe equal to the number of damage dice"',
  'Weight Of Guilt':Pathfinder2E.FEATURES['Weight Of Guilt'],
  'Divine Grace':Pathfinder2E.FEATURES['Divine Grace'],
  'Divine Health':Pathfinder2E.FEATURES['Divine Health'] + ' ' +
    'Note="+2 vs. diseases and poisons and on flat checks to recover from persistent poison, and successes vs. disease or poison are critical successes; allies within aura gain a +1 bonus"',
  'Aura Of Courage':Pathfinder2E.FEATURES['Aura Of Courage']
    .replace("15'", 'aura'),
  'Aura Of Despair':
    'Section=combat ' +
    'Note="Foes within aura suffer -1 save vs. fear and cannot remove frightened condition"',
  'Cruelty':
    'Section=magic ' +
    'Note="Using 2 actions to cast <i>Touch Of The Void</i> also inflicts enfeebled 1 for 1 min on a failed save, or enfeebled 2 on a critical failure"',
  'Mercy (Body)':
    'Section=magic ' +
    'Note="Using 2 actions to cast <i>Lay On Hands</i> can also attempt to counteract %{magicNotes.greaterMercy?(level<16?\'\':\'stunned, \')+\'drained, slowed, \':\'\'}blinded, dazzled, deafened, enfeebled, or sickened"',
  'Mercy (Grace)':
    'Section=magic ' +
    'Note="Using 2 actions to cast <i>Lay On Hands</i> can also attempt to counteract %{magicNotes.greaterMercy?(level<12?\'\':level<16?\'petrified, \':\'petrified, stunned, \')+\'immobilized, restrained, slowed, \':\'\'}clumsy, grabbed, or paralyzed"',
  'Mercy (Mind)':
    'Section=magic ' +
    'Note="Using 2 actions to cast <i>Lay On Hands</i> can also attempt to counteract %{magicNotes.greaterMercy?(level<16?\'\':\'doomed, stunned, \')+\'confused, controlled,slowed, \':\'\'}fleeing, frightened, or stupefied"',
  'Security':
    'Section=magic ' +
    'Note="Using 2 actions to cast <i>Shields Of The Spirit</i> gives 1 ally the benefits of the spell for 1 min"',
  'Expand Aura':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Extends Champion\'s Aura to 30\' %{level<10?\'for 1 rd\':level<16?\'for 1 min\':\'until Dismissed\'}"',
  'Loyal Warhorse':Pathfinder2E.FEATURES['Loyal Warhorse'],
  // Reactive Strike as above
  // Shield Warden as above
  'Smite Evil':Pathfinder2E.FEATURES['Smite Evil'] + ' ' +
    'Note="Strikes against a designated foe gain +3 damage, or +4 with master proficiency (+4 or +6 vs. an opposing holy or unholy foe) for 1 rd; hostile actions by the foe extend the effect each rd"',
  "Advanced Deity's Domain (Air)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Air)"],
  "Advanced Deity's Domain (Ambition)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Air)"],
  "Advanced Deity's Domain (Cities)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Air)"]
    .replace('The City', 'Civilization'),
  "Advanced Deity's Domain (Confidence)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Confidence)"],
  "Advanced Deity's Domain (Creation)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Creation)"],
  "Advanced Deity's Domain (Darkness)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Creation)"]
    .replace('Eyes', 'Sight'),
  "Advanced Deity's Domain (Death)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Death)"],
  "Advanced Deity's Domain (Destruction)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Destruction)"],
  "Advanced Deity's Domain (Dreams)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Dreams)"],
  "Advanced Deity's Domain (Earth)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Earth)"],
  "Advanced Deity's Domain (Family)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Family)"],
  "Advanced Deity's Domain (Fate)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Fate)"],
  "Advanced Deity's Domain (Fire)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Fire)"],
  "Advanced Deity's Domain (Freedom)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Freedom)"],
  "Advanced Deity's Domain (Healing)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Healing)"],
  "Advanced Deity's Domain (Indulgence)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Indulgence)"],
  "Advanced Deity's Domain (Knowledge)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Knowledge)"],
  "Advanced Deity's Domain (Luck)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Luck)"],
  "Advanced Deity's Domain (Magic)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Magic)"],
  "Advanced Deity's Domain (Might)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Might)"],
  "Advanced Deity's Domain (Moon)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Moon)"],
  "Advanced Deity's Domain (Nature)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Nature)"],
  "Advanced Deity's Domain (Nightmares)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Nightmares)"],
  "Advanced Deity's Domain (Pain)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Pain)"],
  "Advanced Deity's Domain (Passion)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Passion)"],
  "Advanced Deity's Domain (Perfection)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Perfection)"]
    .replace('Form', 'Body'),
  "Advanced Deity's Domain (Protection)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Protection)"],
  "Advanced Deity's Domain (Secrecy)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Secrecy)"],
  "Advanced Deity's Domain (Sun)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Sun)"]
    .replace('Positive', 'Vital'),
  "Advanced Deity's Domain (Travel)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Travel)"],
  "Advanced Deity's Domain (Trickery)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Trickery)"],
  "Advanced Deity's Domain (Truth)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Truth)"],
  "Advanced Deity's Domain (Tyranny)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Tyranny)"],
  "Advanced Deity's Domain (Undeath)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Undeath)"],
  "Advanced Deity's Domain (Water)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Water)"],
  "Advanced Deity's Domain (Wealth)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Wealth)"],
  "Advanced Deity's Domain (Zeal)":
    Pathfinder2E.FEATURES["Advanced Deity's Domain (Zeal)"],
  'Greater Cruelty':
    'Section=magic ' +
    'Note="Can use Cruelty to make the target clumsy or stupefied instead"',
  'Greater Mercy':'Section=magic Note="Has increased Mercy effects"',
  'Greater Security':
    'Section=combat ' +
    'Note="Can give an ally full shield AC bonus and use Shield Block to benefit them"',
  'Heal Mount':Pathfinder2E.FEATURES['Heal Mount'],
  // Quick Shield Block as above
  'Second Blessing':Pathfinder2E.FEATURES['Second Ally'],
  'Imposing Destrier':Pathfinder2E.FEATURES['Imposing Destrier'],
  'Radiant Armament':
    'Section=combat ' +
    'Note="Can choose <i>astral</i>, <i>brilliant</i>, <i>holy</i>, or <i>unholy</i> rune for Blessed Armament, and can use a 10-min activity to change the rune"',
  'Shield Of Reckoning':Pathfinder2E.FEATURES['Shield Of Reckoning'],
  'Spectral Advance':
    'Section=magic ' +
    'Note="Knows the Spectral Advance divine focus spell/+1 Focus Points"',
  'Affliction Mercy':Pathfinder2E.FEATURES['Affliction Mercy'],
  'Aura Of Faith':
    Pathfinder2E.FEATURES['Aura Of Faith'] + ' ' +
    'Note="Strikes by allies within aura gain the holy or unholy trait"',
  'Blessed Counterstrike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike after Champion\'s Reaction gains 1 extra damage die and inflicts weakness %{level//2} to Strikes by self and allies for 1 rd"',
  "Champion's Sacrifice":Pathfinder2E.FEATURES["Champion's Sacrifice"],
  'Devoted Focus':
    Pathfinder2E.FEATURES['Devoted Focus']
    .replace('2', 'all'),
  'Divine Wall':Pathfinder2E.FEATURES['Divine Wall'],
  'Gruesome Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Champion\'s Reaction Strike inflicts double extra damage and drained 1 (<b>save Fortitude</b> negates drained)"',
  'Aura Of Determination':
    'Section=save Note="Aura gives +1 vs. mental, morph, and polymorph"',
  'Aura Of Life':
    Pathfinder2E.FEATURES['Aura Of Life']
    .replace("R15' Gives", 'Aura gives')
    .replaceAll(/negative|necromancy/g, 'void'),
  'Aura Of Righteousness':
    Pathfinder2E.FEATURES['Aura Of Righteousness']
    .replace("R15' Gives", 'Aura gives')
    .replace('evil', 'unholy and attempts counteract to counteract teleportation affecting unholy creatures'),
  'Divine Reflexes':Pathfinder2E.FEATURES['Divine Reflexes'],
  'Auspicious Mount':
    Pathfinder2E.FEATURES['Auspicious Mount'] + ' ' +
    'Note="Mount is a specialized animal companion with celestial, fiend, or monitor trait, +2 Intelligence, +1 Wisdom, Skill Expert (Religion), ability to speak the language of %{deity}\'s servitors, flight, +%{level<18?20:level<20?25:30} Hit Points, and, as appropriate, holy or unholy trait with +5 Hit Points and weakness 5 to the opposing trait"',
  'Instrument Of Slaughter':
    'Section=combat ' +
    'Note="Champion\'s Reaction that inflicts extra damage also inflicts persistent bleed damage equal to two damage dice"',
  'Instrument Of Zeal':
    Pathfinder2E.FEATURES['Instrument Of Zeal']
    .replace('Blade Of Justice', 'Blessed Counterstrike'),
  'Shield Of Grace':Pathfinder2E.FEATURES['Shield Of Grace'],
  'Rejuvenating Touch':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> gives 10 temporary Hit Points, lasting 1 rd, each rd for 10 rd"',
  'Swift Retribution':
    'Section=combat ' +
    'Note="Using Champion\'s Reaction makes self quickened for 1 rd"',
  'Ultimate Mercy':Pathfinder2E.FEATURES['Ultimate Mercy'],
  'Radiant Blade Master':
    Pathfinder2E.FEATURES['Radiant Blade Master'] + ' ' +
    'Note="Can choose %{combatNotes.radiantArmament?\'<i>greater astral</i>, <i>greater brilliant</b>, \':\'\'}<i>animated</i>, <i>greater fearsome</i>, <i>grievous</i>, <i>keen</i>, or <i>greater vitalizing</i> rune for brilliant armament, and can use 1 action to change the rune"',
  'Sacred Defender':
    'Section=save ' +
    'Note="Has resistance 5 to bludgeoning, piercing, and slashing, and resistance 10 to these vs. holy or unholy creatures as appropriate/Natural 20 by foe does not improve success degree"',
  'Shield Paragon':
    'Section=combat ' +
    'Note="Shield is always raised and is automatically remade after 1 day if destroyed"',
  'Swift Paragon':
    'Section=combat ' +
    'Note="Has an additional action each rd to Step or Stride, and aura allows allies to move without triggering reactions"',

  // Investigator
  'Alchemical Sciences':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Alchemical Crafting and Quick Tincture features",' +
      '"Skill Trained (Crafting)",' +
      '"Knows the formulas for %{level+1} common alchemical elixirs or tools and can create %{intelligenceModifier>?0} versatile vial%{intelligenceModifier==1?\'\':\'s\'} during daily prep"',
  'Clue In':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Gives another creature +%{skillNotes.investigationExpertise?2:1} Perception on a check that will help to answer the Persue A Lead question"',
  'Deductive Improvisation':
    'Section=skill ' +
    'Note="Can attempt checks that require trained, expert, or master proficiency when untrained, trained, or expert"',
  'Devise A Stratagem':
    'Action=1 ' +
    'Section=combat,skill ' +
    'Note=' +
      '"First Strike using a agile or finesse weapon against the target uses intelligence modifier instead of strength or dexterity",' +
      '"Gives +1 on the next intelligence-, wisdom-, or charisma-based Perception check involving the target before the start of the next turn"',
  'Dogged Will':'Section=save Note="Save Master (Will)"',
  'Empiricism':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the That\'s Odd and Expedition Inspection features",' +
      // TODO randomizing problem
      '"Skill Trained (Choose 1 from any intelligence)"',
  'Expeditious Inspection':
    'Action=Free ' +
    'Section=skill ' +
    'Note="Uses Recall Knowledge, Seek, or Sense Motive once per 10 min"',
  'Forensic Medicine':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Forensic Acumen and Battle Medicine features",' +
      '"Skill Trained (Medicine)",' +
      '"Battle Medicine restores +%{level} Hit Points and can be used on the same target once per hr"',
  'Incredible Senses':'Section=skill Note="Perception Legendary"',
  'Interrogation':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the No Cause For Alarm and Pointed Question features",' +
      '"Skill Trained (Diplomacy)",' +
      '"Can use Persue A Lead and Make An Impression simultaneously"',
  // Fortitude Expertise as above
  'Greater Dogged Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Successes on Will saves are critical successes, and critical failures are failures and inflict half damage"',
  // Greater Weapon Specialization as above
  'Investigator Expertise':
    'Section=combat,feature ' +
    'Note=' +
      '"Class Expert (Investigator)",' +
      '"Increased Persue A Lead effects"',
  'Investigator Feats':'Section=feature Note="%V selections"',
  'Investigator Skills':
    'Section=skill Note="Skill Trained (Society; Choose %V from any)"',
  'Keen Recollection':
    'Section=skill Note="+%{level} on untrained Recall Knowledge checks"',
  // Light Armor Expertise as above
  // Light Armor Mastery as above
  'Master Detective':
    'Section=combat,skill ' +
    'Note=' +
      '"Class Master (Investigator)",' +
      '"Automatically senses the presence of a clue that pertains to current investigation when entering a new location"',
  'Methodology':'Section=feature Note="1 selection"',
  'On The Case':
    'Section=feature Note="Has the Clue In and Persue A Lead features"',
  'Persue A Lead':
    'Section=skill ' +
    'Note="1 min reflection gives +%{skillNotes.investigatorExpertise?2:1} Perception when attempting to answer a formulated question"',
  'Pointed Question':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Diplomacy vs. Will gives +2 Perception to detect Lie and inflicts off-guard vs. Devise A Stratagem until the end of the turn; critical success gives +4 Perception; critical failure worsens the target\'s attitude by 1 step"',
  'Quick Tincture':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Can use a versatile vial to create a alchemical elixir or tool that last until the end of the turn"',
  'Savvy Reflexes':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Reflex)",' +
      '"Successes on Reflex saves are critical successes"',
  'Skillful Lessons':'Section=feature Note="+%{(level-1)//2} Skill Feats"',
  'Strategic Strike':
    'Section=combat ' +
    'Note="Successful Strikes using Devising A Stratagem inflict +1d6 HP precision"',
  'Vigilant Senses':'Section=skill Note="Perception Master"',
  // Weapon Expertise as above
  // Weapon Mastery as above
  // Weapon Specialization as above

  // Monk
  'Adamantine Strikes':Pathfinder2E.FEATURES['Adamantine Strikes'],
  'Expert Strikes':Pathfinder2E.FEATURES['Expert Strikes'],
  'Flurry Of Blows':Pathfinder2E.FEATURES['Flurry Of Blows'],
  'Graceful Legend':Pathfinder2E.FEATURES['Graceful Legend'],
  'Graceful Mastery':Pathfinder2E.FEATURES['Graceful Mastery'],
  // Greater Weapon Specialization as above
  'Incredible Movement':Pathfinder2E.FEATURES['Incredible Movement'],
  'Master Strikes':Pathfinder2E.FEATURES['Master Strikes'],
  'Metal Strikes':Pathfinder2E.FEATURES['Metal Strikes'],
  'Monk Expertise':Pathfinder2E.FEATURES['Monk Expertise'],
  'Monk Feats':Pathfinder2E.FEATURES['Monk Feats'],
  'Monk Key Attribute':Pathfinder2E.FEATURES['Monk Key Ability'],
  'Monk Skills':Pathfinder2E.FEATURES['Monk Skills'],
  'Mystic Strikes':Pathfinder2E.FEATURES['Mystic Strikes'],
  'Path To Perfection':Pathfinder2E.FEATURES['Path To Perfection'],
  'Path To Perfection (Fortitude)':
    Pathfinder2E.FEATURES['Path To Perfection (Fortitude)'],
  'Path To Perfection (Reflex)':
    Pathfinder2E.FEATURES['Path To Perfection (Reflex)'],
  'Path To Perfection (Will)':
    Pathfinder2E.FEATURES['Path To Perfection (Will)'],
  // Perception Expertise as above
  'Perfected Form':Pathfinder2E.FEATURES['Perfected Form'],
  'Powerful Fist':Pathfinder2E.FEATURES['Powerful Fist'],
  'Qi Tradition':'Section=feature Note="1 selection"',
  'Qi Tradition (Divine)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Divine)",' +
      '"Can learn spells from the divine tradition"',
  'Qi Tradition (Occult)':
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Occult)",' +
      '"Can learn spells from the occult tradition"',
  'Second Path To Perfection':
    Pathfinder2E.FEATURES['Second Path To Perfection'],
  'Third Path To Perfection':Pathfinder2E.FEATURES['Third Path To Perfection'],
  'Third Path To Perfection (Fortitude)':
    Pathfinder2E.FEATURES['Third Path To Perfection (Fortitude)'],
  'Third Path To Perfection (Reflex)':
    Pathfinder2E.FEATURES['Third Path To Perfection (Reflex)'],
  'Third Path To Perfection (Will)':
    Pathfinder2E.FEATURES['Third Path To Perfection (Will)'],
  // Weapon Specialization as above

  'Crane Stance':Pathfinder2E.FEATURES['Crane Stance'],
  'Monastic Weaponry':Pathfinder2E.FEATURES['Monastic Weaponry'],
  'Dragon Stance':Pathfinder2E.FEATURES['Dragon Stance'],
  'Monastic Archer Stance':
    'Action=1 ' +
    'Section=combat,combat ' +
    'Note=' +
      '"Attack %V (Longbow; Shortbow; Monk Bows)",' +
      '"Stance allows only bow Strikes; may use Flurry Of Blows and other unarmed monk features with bows at half their range increment"',
  'Mountain Stance':
    Pathfinder2E.FEATURES['Mountain Stance']
    .replace('Shove', 'Reposition, Shove'),
  'Qi Spells':
    'Section=magic ' +
    'Note="Knows choice of 1st-rank monk qi spell/Has a focus pool with 1 Focus Point"',
  'Stumbling Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +1 Deception to Feint, restricts Strikes to 1d8 HP bludgeoning hand attacks, and inflicts off-guard against successful melee attackers until the end of the next turn"',
  'Tiger Stance':Pathfinder2E.FEATURES['Tiger Stance'],
  'Wolf Stance':Pathfinder2E.FEATURES['Wolf Stance'],
  'Crushing Grab':Pathfinder2E.FEATURES['Crushing Grab'],
  'Dancing Leaf':Pathfinder2E.FEATURES['Dancing Leaf'],
  'Elemental Fist':
    Pathfinder2E.FEATURES['Elemental Fist']
    .replace('Ki Strike', 'Inner Upheaval')
    .replace('electricity', 'slashing, electricity'),
  'Shooting Stars Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows using unarmed monk features with shuriken"',
  'Stunning Blows':Pathfinder2E.FEATURES['Stunning Fist'],
  'Cobra Stance':
    'Action=1 ' +
    'Section=combat,save ' +
    'Note=' +
      '"Stance allows only hand Strikes that inflict 1d4 HP piercing, or 1d10 HP on a critical hit",' +
      '"Stance gives +%{combatNotes.cobraEnvenom?2:1} Fortitude and Fortitude DC and poison resistance %{level//2}"',
  'Deflect Projectile':Pathfinder2E.FEATURES['Deflect Arrow'],
  'Flurry Of Maneuvers':
    Pathfinder2E.FEATURES['Flurry Of Maneuvers']
    .replace('Shove', 'Reposition, Shove'),
  'Flying Kick':Pathfinder2E.FEATURES['Flying Kick'],
  'Guarded Movement':Pathfinder2E.FEATURES['Guarded Movement'],
  'Harmonize Self':
    Pathfinder2E.FEATURES['Wholeness Of Body']
    .replace('Wholeness Of Body', 'Harmonize Self'),
  'Stand Still':Pathfinder2E.FEATURES['Stand Still'],
  'Advanced Monastic Weaponry':
    // TODO implement
    'Section=combat Note="Weapon Familiarity (Advanced Monk Weapons)"',
  'Advanced Qi Spells':
    'Section=magic ' +
    'Note="Knows choice of 3rd-rank monk qi spell/+1 Focus Points"',
  'Align Qi':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Casting a monk spell restores %{level+wisdomModifier} Hit Points once per hr"',
  'Crane Flutter':Pathfinder2E.FEATURES['Crane Flutter'],
  'Dragon Roar':Pathfinder2E.FEATURES['Dragon Roar'],
  'Mountain Stronghold':Pathfinder2E.FEATURES['Mountain Stronghold'],
  'One-Inch Punch':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful unarmed strike inflicts %{level<10?1:level<18?2:3} additional damage %{level<10?\'die\':\'dice\'}; 3 actions gives %{level<10?2:level<18?4:6} additional dice"',
  'Return Fire':Pathfinder2E.FEATURES['Arrow Snatching'],
  'Stumbling Feint':
    'Section=combat ' +
    'Note="Stumbling Stance allows using a free Feint before Flurry Of Blows; success inflicts off-guard from both attacks"',
  'Tiger Slash':Pathfinder2E.FEATURES['Tiger Slash'],
  'Water Step':Pathfinder2E.FEATURES['Water Step'],
  'Whirling Throw':Pathfinder2E.FEATURES['Whirling Throw'],
  'Wolf Drag':Pathfinder2E.FEATURES['Wolf Drag'],
  'Clinging Shadows Initiate':
    'Section=magic ' +
    'Note="Knows the Clinging Shadows Stance occult focus spell/+1 Focus Points"',
  'Ironblood Stance':Pathfinder2E.FEATURES['Ironblood Stance'],
  'Mixed Maneuver':
    Pathfinder2E.FEATURES['Mixed Maneuver']
    .replace('Shove', 'Reposition, Shove'),
  'Pinning Fire':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Two successful ranged Flurry Of Blows Strikes inflict immobilized (<b>save Reflex</b> negates; successful DC 10 Athletics by target or adjacent creature ends)"',
  'Projectile Snatching':
    'Section=combat ' +
    'Note="Deflect Projectile allows an immediate Strike against the attacker"',
  'Tangled Forest Stance':Pathfinder2E.FEATURES['Tangled Forest Stance'],
  'Wall Run':Pathfinder2E.FEATURES['Wall Run'],
  'Wild Winds Initiate':Pathfinder2E.FEATURES['Wild Winds Initiate'],
  'Cobra Envenom':
    'Action=1 ' +
    'Section=combat,combat ' +
    'Note=' +
      '"Has increased Cobra Stance features",' +
      '"Strike from Cobra Stance gains +5\' reach and +1d4 HP persistent poison"',
  'Knockback Strike':Pathfinder2E.FEATURES['Knockback Strike'],
  'Prevailing Position':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Leaving current stance gives +4 save or Armor Class vs. triggering damage"',
  'Sleeper Hold':Pathfinder2E.FEATURES['Sleeper Hold'],
  'Wind Jump':Pathfinder2E.FEATURES['Wind Jump'],
  'Winding Flow':Pathfinder2E.FEATURES['Winding Flow'],
  'Disrupt Qi':
    Pathfinder2E.FEATURES['Disrupt Ki']
    .replace('negative', 'void'),
  'Dodging Roll':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Steps when in area affected by area damage, gaining resistance %{level} to all damage, or %{level+dexterityModifier} if the Step exits the affected area"',
  'Focused Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ranged Strike within first range increment ignores cover and concealment"',
  'Improved Knockback':
    Pathfinder2E.FEATURES['Improved Knockback']
    .replace(/inflicts.HP bludgeoning/, "1d6 HP bludgeoning per 5'"),
  'Meditative Focus':
    Pathfinder2E.FEATURES['Meditative Focus']
    .replace('2', 'all'),
  'Overwhelming Breath':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent monk spell with no duration ignore resistance %{level} to physical damage"',
  'Reflexive Stance':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Enters a stance during initiative"',
  'Form Lock':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Athletics check counteracts a polymorph effect effecting target once per target per day"',
  'Ironblood Surge':Pathfinder2E.FEATURES['Ironblood Surge'],
  'Mountain Quake':Pathfinder2E.FEATURES['Mountain Quake'],
  'Peerless Form':
    'Section=feature,save ' +
    'Note=' +
      '"Does not age",' +
      '"+2 Fortitude/+2 Will"',
  "Shadow's Web":
    'Section=magic ' +
    'Note="Knows the Shadow\'s Web occult spell/+1 Focus Points"',
  'Tangled Forest Rake':
    Pathfinder2E.FEATURES['Tangled Forest Rake']
   .replace("5'", "10'"),
  'Whirling Blade Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows making Strikes by throwing monk finesse melee weapons 10\'"',
  'Wild Winds Gust':Pathfinder2E.FEATURES['Wild Winds Gust'],
  'Fuse Stance':Pathfinder2E.FEATURES['Fuse Stance'],
  // Master Of Many Styles as above
  'Master Qi Spells':
    'Section=magic ' +
    'Note="Knows choice of 8th-rank monk qi spell/+1 Focus Points"',
  'One-Millimeter Punch':
    'Section=combat ' +
    'Note="One-Inch Punch inflicts 10\' Push (<b>save Fortitude</b> inflicts 5\' Push; critical success negates; critical failure inflicts 10\' Push per action"',
  'Shattering Strike':Pathfinder2E.FEATURES['Shattering Strike'],
  'Diamond Fists':
    Pathfinder2E.FEATURES['Diamond Fists']
    .replace('forceful trait', 'forceful and deadly d10 traits'),
  'Grandmaster Qi Spells':
    'Section=magic ' +
    'Note="Knows choice of 9th-rank monk qi spell/+1 Focus Points"',
  'Qi Center':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Casts a single-action qi stance spell without spending a Focus Point"',
  'Swift River':Pathfinder2E.FEATURES['Swift River'],
  'Triangle Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Make 3 bow Strikes against a single target with a -2 penalty"',
  'Enduring Quickness':Pathfinder2E.FEATURES['Enduring Quickness'],
  'Godbreaker':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Successful Strikes after throwing a grappled foe upward 20\' allows repeating 2 times"',
  'Immortal Techniques':
    'Section=combat ' +
    'Note="Using a monk stance action gives 20 temporary Hit Points for 1 rd"',
  'Impossible Technique':Pathfinder2E.FEATURES['Impossible Technique'],
  'Lightning Qi':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Reduces the number of actions required to cast a subsequent qi spell by 1 once per 10 min"',

  // Monk
  'Mystery':'Section=feature Note="1 selection"',

  // Sorcerer
  'Aberrant':
    Pathfinder2E.FEATURES.Aberrant
    .replace('self or target +2', 'self +2 or target -1'),
  'Angelic':Pathfinder2E.FEATURES.Angelic,
  'Bloodline':Pathfinder2E.FEATURES.Bloodline,
  'Bloodline Paragon':Pathfinder2E.FEATURES['Bloodline Paragon'],
  // Defensive Robes as above
  'Demonic':
    Pathfinder2E.FEATURES.Demonic
    .replace('+1', '+2'),
  'Diabolic':
    Pathfinder2E.FEATURES.Diabolic
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Draconic (Arcane)':
    Pathfinder2E.FEATURES['Draconic (Brass)']
    .replace('Dragon Claws', 'Flurry Of Claws'),
  'Draconic (Divine)':
    Pathfinder2E.FEATURES['Draconic (Brass)']
    .replace('Dragon Claws', 'Flurry Of Claws')
    .replace('Arcane', 'Divine')
    .replace('arcane', 'divine')
    .replace('Arcana', 'Religion'),
  'Draconic (Occult)':
    Pathfinder2E.FEATURES['Draconic (Brass)']
    .replace('Dragon Claws', 'Flurry Of Claws')
    .replace('Arcane', 'Occult')
    .replace('arcane', 'occult')
    .replace('Arcana', 'Occultism'),
  'Draconic (Primal)':
    Pathfinder2E.FEATURES['Draconic (Brass)']
    .replace('Dragon Claws', 'Flurry Of Claws')
    .replace('Arcane', 'Primal')
    .replace('arcane', 'primal')
    .replace('Arcana', 'Nature'),
  'Elemental (Air)':
    Pathfinder2E.FEATURES['Elemental (Air)']
    .replace('+1', '+2')
    .replace('blugeoning', 'slashing'),
  'Elemental (Earth)':
    Pathfinder2E.FEATURES['Elemental (Earth)']
    .replace('+1', '+2'),
  'Elemental (Fire)':
    Pathfinder2E.FEATURES['Elemental (Fire)']
    .replace('+1', '+2'),
  'Elemental (Metal)':
    Pathfinder2E.FEATURES['Elemental (Air)']
    .replace('+1', '+2')
    .replace('blugeoning', 'piercing'),
  'Elemental (Water)':
    Pathfinder2E.FEATURES['Elemental (Water)']
    .replace('+1', '+2'),
  'Elemental (Wood)':
    Pathfinder2E.FEATURES['Elemental (Earth)']
    .replace('+1', '+2'),
  'Fey':
    Pathfinder2E.FEATURES.Fey
    .replace('self or target', 'self +2 Performance or'),
  'Hag':
    Pathfinder2E.FEATURES.Hag
    .replace('2 HP mental', '4 HP mental')
    .replace('for 1 rd', 'for 1 rd; if no attacks succeed, gives self temporary Hit Points equal to the spell rank for 1 rd'),
  'Imperial':
    Pathfinder2E.FEATURES.Imperial
    .replace('self or target', 'self +1 Armor Class or'),
  'Undead':
    Pathfinder2E.FEATURES.Undead
    .replace('negative', 'void')
    .replaceAll('level', 'rank'),
  // Expert Spellcaster as above
  // Magical Fortitude as above
  // Legendary Spellcaster as above
  'Majestic Will':Pathfinder2E.FEATURES.Resolve,
  // Master Spellcaster as above
  // Perception Expertise as above
  // Reflex Expertise as above
  // Signature Spells as above
  'Sorcerer Feats':Pathfinder2E.FEATURES['Sorcerer Feats'],
  'Sorcerer Skills':Pathfinder2E.FEATURES['Sorcerer Skills'],
  'Sorcerer Spellcasting':Pathfinder2E.FEATURES['Sorcerer Spellcasting'],
  'Sorcerous Potency':
    'Section=magic ' +
    'Note="Initial damage or healing from spell slots inflicts or restores additional Hit Points equal to the spell\'s rank"',
  // Weapon Expertise as above
  // Weapon Specialization as above

  'Blood Rising':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Casting of a %{bloodlineTraditionsLowered} spell targeting self invokes Blood Magic effect that targets self or caster"',
  // Familiar as above
  // Reach Spell as above
  'Tap Into Blood (Arcane)':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses Arcana in place of the associated skill for a Recall Knowledge check"',
  'Tap Into Blood (Divine)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Steps or Repositions a target using Religion for the check"',
  'Tap Into Blood (Occult)':
    'Action=1 Section=combat Note="Takes a 10\' Step"',
  'Tap Into Blood (Primal)':
    'Action=1 Section=combat Note="Uses Nature for a Demoralize check"',
  // Widen Spell as above
  'Anoint Ally':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Allows transferring blood magic effects to a specified ally for 1 min"',
  'Bleed Out':
    'Action=1 ' +
    'Section=magic ' +
    'Note="R60\' Successful ranged spell attack inflicts persistent bleed damage equal to the rank of a just-cast spell"',
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Propelling Sorcery':
    'Section=magic ' +
    'Note="Blood magic effect allows Stepping as a free action or moving a target 5\'"',
  'Arcane Evolution':Pathfinder2E.FEATURES['Arcane Evolution'],
  'Bespell Strikes':
    Pathfinder2E.FEATURES['Bespell Weapon']
    .replace('depends on the spell school', 'is force or the same type as the spell inflicted'),
  'Divine Evolution':Pathfinder2E.FEATURES['Divine Evolution'],
  'Occult Evolution':Pathfinder2E.FEATURES['Occult Evolution'],
  'Primal Evolution':Pathfinder2E.FEATURES['Primal Evolution'],
  'Split Shot':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Adds a second target, inflicting half damage, to a targeted attack spell"',
  'Advanced Bloodline (Aberrant)':
    Pathfinder2E.FEATURES['Advanced Bloodline (Aberrant)'],
  'Advanced Bloodline (Angelic)':
    Pathfinder2E.FEATURES['Advanced Bloodline (Angelic)'],
  'Advanced Bloodline (Demonic)':
    Pathfinder2E.FEATURES['Advanced Bloodline (Demonic)'],
  'Advanced Bloodline (Diabolic)':
    Pathfinder2E.FEATURES['Advanced Bloodline (Diabolic)'],
  'Advanced Bloodline (Draconic (Arcane))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Draconic (Black))'],
  'Advanced Bloodline (Draconic (Divine))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Draconic (Black))'],
  'Advanced Bloodline (Draconic (Occult))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Draconic (Black))'],
  'Advanced Bloodline (Draconic (Primal))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Draconic (Black))'],
  'Advanced Bloodline (Elemental (Air))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Elemental (Air))'],
  'Advanced Bloodline (Elemental (Earth))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Elemental (Earth))'],
  'Advanced Bloodline (Elemental (Fire))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Elemental (Fire))'],
  'Advanced Bloodline (Elemental (Metal))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Elemental (Earth))'],
  'Advanced Bloodline (Elemental (Water))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Elemental (Water))'],
  'Advanced Bloodline (Elemental (Wood))':
    Pathfinder2E.FEATURES['Advanced Bloodline (Elemental (Water))'],
  'Advanced Bloodline (Fey)':Pathfinder2E.FEATURES['Advanced Bloodline (Fey)'],
  'Advanced Bloodline (Hag)':Pathfinder2E.FEATURES['Advanced Bloodline (Hag)'],
  'Advanced Bloodline (Imperial)':
    Pathfinder2E.FEATURES['Advanced Bloodline (Imperial)']
    .replace('Extend Spell', 'Extend Blood Magic'),
  'Advanced Bloodline (Undead)':
    Pathfinder2E.FEATURES['Advanced Bloodline (Undead)'],
  'Diverting Vortex':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Casting a non-cantrip spell gives +1 Armor Class vs. ranged weapons until the end of the turn"',
  'Energy Ward':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Casting a non-cantrip spell gives resistance equal to the spell rank to a choice of energy for 1 rd"',
  'Safeguard Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Negate the effects on self of a subsequent self area spell"',
  'Spell Relay':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Allows the triggering ally spell to be cast from self location"',
  // Steady Spellcasting as above
  'Bloodline Resistance':Pathfinder2E.FEATURES['Bloodline Resistance'],
  'Crossblood Evolution':
    'Section=magic ' +
    'Note="Can use the blood magic effect from another bloodline"',
  'Explosion Of Power':
    'Section=magic ' +
    'Note="Blood magic effect in a 5\' emanation inflicts 1d6 HP %{bloodlineTraditions=~\'Arcane\'?\'force\':bloodlineTraditions=~\'Divine\'?\'spirit\':bloodlineTraditions=~\'Occult\'?\'mental\':\'fire\' per rank of just-cast spell (<b>save basic Reflex</b>)"',
  'Energy Fusion':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Expends a spell slot to add the damage of one spell to another"',
  'Greater Bloodline (Aberrant)':
    Pathfinder2E.FEATURES['Greater Bloodline (Aberrant)'],
  'Greater Bloodline (Angelic)':
    Pathfinder2E.FEATURES['Greater Bloodline (Angelic)'],
  'Greater Bloodline (Demonic)':
    Pathfinder2E.FEATURES['Greater Bloodline (Demonic)']
    .replace('Abyssal', 'Cnthonian'),
  'Greater Bloodline (Diabolic)':
    Pathfinder2E.FEATURES['Greater Bloodline (Diabolic)'],
  'Greater Bloodline (Draconic (Arcane))':
    Pathfinder2E.FEATURES['Greater Bloodline (Draconic (Black))'],
  'Greater Bloodline (Draconic (Divine))':
    Pathfinder2E.FEATURES['Greater Bloodline (Draconic (Black))'],
  'Greater Bloodline (Draconic (Occult))':
    Pathfinder2E.FEATURES['Greater Bloodline (Draconic (Black))'],
  'Greater Bloodline (Draconic (Primal))':
    Pathfinder2E.FEATURES['Greater Bloodline (Draconic (Black))'],
  'Greater Bloodline (Elemental (Air))':
    Pathfinder2E.FEATURES['Greater Bloodline (Elemental (Air))'],
  'Greater Bloodline (Elemental (Earth))':
    Pathfinder2E.FEATURES['Greater Bloodline (Elemental (Earth))'],
  'Greater Bloodline (Elemental (Fire))':
    Pathfinder2E.FEATURES['Greater Bloodline (Elemental (Fire))'],
  'Greater Bloodline (Elemental (Metal))':
    Pathfinder2E.FEATURES['Greater Bloodline (Elemental (Earth))'],
  'Greater Bloodline (Elemental (Water))':
    Pathfinder2E.FEATURES['Greater Bloodline (Elemental (Water))'],
  'Greater Bloodline (Elemental (Wood))':
    Pathfinder2E.FEATURES['Greater Bloodline (Elemental (Earth))'],
  'Greater Bloodline (Fey)':Pathfinder2E.FEATURES['Greater Bloodline (Fey)'],
  'Greater Bloodline (Hag)':Pathfinder2E.FEATURES['Greater Bloodline (Hag)'],
  'Greater Bloodline (Imperial)':
     Pathfinder2E.FEATURES['Greater Bloodline (Imperial)'],
  'Greater Bloodline (Undead)':
     Pathfinder2E.FEATURES['Greater Bloodline (Undead)'],
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Signature Spell Expansion':
    'Section=magic ' +
    'Note="Has 2 additional signature spells of up to 3rd rank"',
  'Blood Sovereignty':
    'Section=magic ' +
    'Note="When casting a spell, can suffer Hit Point loss equal to twice the spell rank to use 2 blood magic effects"',
  'Bloodline Focus':
    Pathfinder2E.FEATURES['Bloodline Focus']
    .replace('2', 'all'),
  'Greater Physical Evolution':
    'Section=magic ' +
    'Note="Can expend a spell slot to cast a battle polymorph spell on self once per day"',
  'Greater Spiritual Evolution':
    'Section=magic ' +
    'Note="Spells have the <i>ghost touch</i> property"',
  'Magic Sense':Pathfinder2E.FEATURES['Magic Sense'],
  'Terraforming Trickery':
    'Section=magic ' +
    'Note="Can use a blood magic effect to create or remove difficult terrain from adjacent squares"',
  'Blood Ascendancy':
    'Section=magic ' +
    'Note="Can use Blood Rising to benefit from 2 blood magic effects"',
  'Interweave Dispel':Pathfinder2E.FEATURES['Interweave Dispel'],
  'Reflect Harm':
    'Section=magic ' +
    'Note="Blood magic effect allows a spell attack to duplicate the damage from a spell attack cast on self onto caster for 1 rd"',
  'Spell Shroud':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent spell cast creates a 15\' emanation that conceals creatures for 1 rd"',
  // Effortless Concentration as above
  'Greater Mental Evolution':Pathfinder2E.FEATURES['Greater Mental Evolution'],
  'Greater Vital Evolution':Pathfinder2E.FEATURES['Greater Vital Evolution'],
  'Scintillating Spell':
    'Action=1 ' +
    'Section=magic ' + 'Note="Targets that fail a Reflex save vs. a subsequent spell also suffer dazzled for 1 rd, or blinded for 1 rd on a critical failure"',
  'Echoing Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Casts an instantaneous spell twice using 1 spell slot"',
  'Greater Crossblooded Evolution':
    Pathfinder2E.FEATURES['Greater Crossblooded Evolution']
    .replace('different traditions', 'second bloodline'),
  'Bloodline Conduit':Pathfinder2E.FEATURES['Bloodline Conduit'],
  'Bloodline Mutation':
    'Section=feature ' +
    'Note="Gains low-light vision, darkvision, flight, swimming, water breathing, and/or resistances as appropriate from bloodline"',
  'Bloodline Perfection':Pathfinder2E.FEATURES['Bloodline Perfection'],
  'Spellshape Mastery':
    Pathfinder2E.FEATURES['Metamagic Mastery']
    .replace('metamagic', 'spellshape'),

  // Swashbuckler
  'Battledancer':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Fascinating Performance feature",' +
      '"Skill Trained (Performance",' +
      '"Perform actions have the bravado trait"',
  "Swashbuckler's Style":'Section=feature Note="1 selection"',

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

  // Core 2

  'Leverage Connections':Pathfinder2E.FEATURES.Connections

};
Pathfinder2ERemaster.GOODIES = Pathfinder2E.GOODIES;
Pathfinder2ERemaster.HERITAGES = {
  'Changeling':'Traits=Uncommon',
  'Nephilim':'Traits=Uncommon',
  'Aiuvarin':'Traits=Non-Elf',
  'Dromaar':'Traits=Non-Orc',
  // Core 2
  'Dhampir':'Traits=Uncommon',
  'Dragonblood':
    'Traits=Uncommon ' +
    'Selectables=' +
      '"1:Adamantine Exemplar:Draconic Exemplar",' +
      '"1:Conspirator Exemplar:Draconic Exemplar",' +
      '"1:Diabolic Exemplar:Draconic Exemplar",' +
      '"1:Empyreal Exemplar:Draconic Exemplar",' +
      '"1:Fortune Exemplar:Draconic Exemplar",' +
      '"1:Horned Exemplar:Draconic Exemplar",' +
      '"1:Mirage Exemplar:Draconic Exemplar",' +
      '"1:Omen Exemplar:Draconic Exemplar"',
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
    .replace('Evocation', 'Manipulate') + ' ' +
    // Duration deleted by errata
    'Description=' +
      '"R120\' Inflicts 2d8 HP acid, 1d6 HP persistent acid, and -10\' Speed (<b>save Reflex</b> inflicts half initial HP only and moves the target 5\'; critical success negates; critical failure inflicts double initial HP and moves the target 20\') (<b>heightened +2</b> inflicts +2d8 HP initial and +1d6 HP persistent)"',
  'Aerial Form':
    Pathfinder2E.SPELLS['Aerial Form']
    .replace('Transmutation', 'Manipulate,Concentrate'),
  'Air Bubble':
    Pathfinder2E.SPELLS['Air Bubble']
    .replace('Conjuration', 'Concentrate'),
  'Alarm':
    Pathfinder2E.SPELLS.Alarm
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Animal Form':
    Pathfinder2E.SPELLS['Animal Form']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Animal Messenger':
    Pathfinder2E.SPELLS['Animal Messenger']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Ant Haul':
    Pathfinder2E.SPELLS['Ant Haul']
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
    .replace('Attack,', '')
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R120\' Inflicts 12d8 HP cold and slowed 1 for 1 rd (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and slowed 1 until ice with 60 HP and Hardness 5 is cleared) (<b>heightened +1</b> inflicts +2d8 HP and gives ice +5 HP)"',
  'Augury':
    Pathfinder2E.SPELLS.Augury
    .replace('Divination', 'Concentrate,Manipulate'),
  'Avatar':
    Pathfinder2E.SPELLS.Avatar
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Bane':
    Pathfinder2E.SPELLS.Bane
    // Aura trait added by errata
    .replace('Enchantment', 'Concentrate,Manipulate,Aura')
    .replaceAll('5', '10'),
  'Banishment':
    Pathfinder2E.SPELLS.Banishment
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Bind Undead':
    Pathfinder2E.SPELLS['Bind Undead']
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
    // Aura trait added by errata
    .replace('Enchantment', 'Concentrate,Manipulate,Aura')
    .replace('5', '15')
    .replace('by 5', 'by 10'),
  'Blessed Boundary':
    Pathfinder2E.SPELLS['Blade Barrier']
    .replace('Evocation', 'Concentrate,Manipulate,Sanctified') + ' ' +
    'Description=' +
      '"R120\' 60\' burst inflicts 7d8 HP force and a 10\' push for 1 min (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts doubles HP and push distance) (<b>heightened +1</b> inflicts +1d8 HP)"',
  'Blindness':
    Pathfinder2E.SPELLS.Blindness
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
    .replace('Veil', 'Concentrate,Manipulate,Visual'),
  'Breath Of Life':
    Pathfinder2E.SPELLS['Breath Of Life']
    .replace('Necromancy,Positive', 'Concentrate,Vitality') + ' ' +
    'Description=' +
      '"R60\' Prevents the triggering target\'s death, restoring 5d8 HP (<b>heightened +2</b> restores +1d8 HP)"',
  'Breathe Fire':
    Pathfinder2E.SPELLS['Burning Hands']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Calm':
    Pathfinder2E.SPELLS['Calm Emotions']
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
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Caustic Blast':
    Pathfinder2E.SPELLS['Acid Splash']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace(',Attack', ''),
  'Chain Lightning':
    Pathfinder2E.SPELLS['Chain Lightning']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Charm':
    Pathfinder2E.SPELLS.Charm
    .replace('Enchantment', 'Concentrate,Manipulate,Subtle'),
  'Chilling Darkness':
    Pathfinder2E.SPELLS['Chilling Darkness']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Evil', 'Unholy')
    .replaceAll('evil', 'spirit')
    .replace('celestials', 'holy creatures'),
  'Clairaudience':
    Pathfinder2E.SPELLS.Clairaudience
    .replace('Divination', 'Concentrate,Manipulate'),
  'Clairvoyance':
    Pathfinder2E.SPELLS.Clairvoyance
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
    .replace('Necromancy', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R10\' Enhances or removes contaminants from 1 cubic foot of food and drink (<b>heightened +2</b> affects +1 cubic foot)"',
  'Clear Mind':
    Pathfinder2E.SPELLS['Remove Fear'] + ' ' +
    'Traits=Concentrate,Healing,Manipulate,Mental ' +
    'Description=' +
      '"Makes a counteract attempt vs. 1 fleeing, frightened, or stupefied effect affecting touched (<b>heightened 4th</b> can counteract confused, controlled, or slows; <b>6th</b> can counteract doomed; <b>8th</b> can counteract stunned)"',
  'Command':
    Pathfinder2E.SPELLS.Command
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Confusion':
    Pathfinder2E.SPELLS.Confusion
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Contingency':
    Pathfinder2E.SPELLS.Contingency
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Control Water':
    Pathfinder2E.SPELLS['Control Water']
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
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Create Water':
    Pathfinder2E.SPELLS['Create Water']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Creation':
    Pathfinder2E.SPELLS.Creation
    .replace('Conjuration', 'Concentrate,Manipulate')
    .replace('vegetable', 'earth or vegetable'),
  'Crisis Of Faith':
    Pathfinder2E.SPELLS['Crisis Of Faith']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Cursed Metamorphosis':
    Pathfinder2E.SPELLS['Baleful Polymorph']
    .replace('Transmutation', 'Concentrate,Manipulate,Curse')
    .replace('Traditions=', 'Traditions=Occult,'),
  'Darkvision':
    Pathfinder2E.SPELLS.Darkvision
    .replace('Divination', 'Concentrate,Manipulate'),
  'Daze':
    Pathfinder2E.SPELLS.Daze
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace(/%\{.*\}/, '1d6'),
  'Deafness':
    Pathfinder2E.SPELLS.Deafness
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Desiccate':
    Pathfinder2E.SPELLS['Horrid Wilting']
    .replace('negative', 'void') + ' ' +
    'Traits=Concentrate,Manipulate,Void',
  'Detect Magic':
    Pathfinder2E.SPELLS['Detect Magic']
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('school', 'rank'),
  'Detect Poison':
    Pathfinder2E.SPELLS['Detect Poison']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Detect Scrying':
    Pathfinder2E.SPELLS['Detect Scrying']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Detonate Magic':
    Pathfinder2E.SPELLS.Disjunction
    .replace('Abjuration', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R120\' Makes a counteract check to convert the target magic into an explosion that inflicts 8d6 HP force (<b>save basic Reflex</b>)"',
  'Dinosaur Form':
    Pathfinder2E.SPELLS['Dinosaur Form']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Disappearance':
    Pathfinder2E.SPELLS.Disappearance
    .replace('Illusion', 'Illusion,Manipulate,Subtle'),
  'Disguise Magic':
    Pathfinder2E.SPELLS['Magic Aura']
    .replace('Uncommon', 'Concentrate,Manipulate')
    .replace('3rd', '2nd'),
  'Disintegrate':
    Pathfinder2E.SPELLS.Disintegrate
    .replace('Evocation', 'Illusion,Manipulate,Subtle'),
  'Dispel Magic':
    Pathfinder2E.SPELLS['Dispel Magic']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Dispelling Globe':
    Pathfinder2E.SPELLS['Globe Of Invulnerability']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Divine Decree':
    Pathfinder2E.SPELLS['Divine Decree'] + ' ' +
    'Traits=Concentrate,Manipulate,Sanctified,Spirit ' +
    'Description=' +
      '"R40\' 40\' emanation inflicts 7d10 HP spirit and enfeebled 2 for 1 min on foes (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts double HP, banishment, and, for creatures of level 10 and lower, paralysis for 1 min (<b>save Will</b> negates; critical failure inflicts death) (<b>heightened +1</b> inflicts +1d10 HP and increases the level of creatures that suffer paralysis by 2)"',
  'Divine Immolation':
    Pathfinder2E.SPELLS['Flame Strike']
    .replace('Evocation', 'Concentrate,Manipulate,Sanctified,Spirit') + ' ' +
    'Description=' +
      '"R120\' 20\' burst inflicts 6d6 HP fire or spirit and 2d6 HP persistent fire or spirit (<b>save Reflex</b> inflicts half initial HP only; critical success negates; critical failure inflicts double HP initial and persistent) (<b>heightened +1</b> inflicts +1d6 HP initial and persistent)"',
  'Divine Inspiration':
    Pathfinder2E.SPELLS['Divine Inspiration']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Divine Lance':
    Pathfinder2E.SPELLS['Divine Lance']
    .replace('Evocation', 'Concentrate,Manipulate,Sanctified,Spirit')
    .replace(/1d4+%\{.*\}/, '2d4'),
  'Divine Wrath':
    Pathfinder2E.SPELLS['Divine Wrath'] + ' ' +
    'Traits=Concentrate,Manipulate,Sanctified,Spirit' + ' ' +
    'Description=' +
      '"R120\' 20\' burst inflicts 4d10 HP spirit and sickened 1 (<b>save Fortitude</b> inflicts half HP only; critical success negates; critical failure inflicts sickened 2 and slowed 1) (<b>heightened +1</b> inflicts +1d10 HP)"',
  'Dizzying Colors':
    Pathfinder2E.SPELLS['Color Spray']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Dominate':
    Pathfinder2E.SPELLS.Dominate
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace('Traditions=', 'Traditions=Divine,'),
  'Dragon Form':
    Pathfinder2E.SPELLS['Dragon Form']
    .replace('Transmutation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal'
    .replace('+14', '+4d6'),
  'Dream Message':
    Pathfinder2E.SPELLS['Dream Message']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Dreaming Potential':
    Pathfinder2E.SPELLS['Dreaming Potential']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Duplicate Foe':
    Pathfinder2E.SPELLS['Duplicate Foe']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Earthbind':
    Pathfinder2E.SPELLS.Earthbind
    .replace('Transmutation', 'Concentrate,Earth,Manipulate'),
  'Earthquake':
    Pathfinder2E.SPELLS.Earthquake
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Eclipse Burst':
    Pathfinder2E.SPELLS['Eclipse Burst']
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace('Negative', 'Void')
    .replaceAll('negative', 'void'),
  'Electric Arc':
    Pathfinder2E.SPELLS['Electric Arc']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace(/1d4.*%\{.*\}/, '2d4'),
  'Elemental Form':
    Pathfinder2E.SPELLS['Elemental Form']
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('air or fire', 'air, fire, or metal')
    .replace('earth or water', 'earth, water, or wood'),
  'Embed Message':
    Pathfinder2E.SPELLS['Magic Mouth']
    .replace('Auditory', 'Concentrate,Manipulate')
    .replace(',Visual', '') + ' ' +
    'Description=' +
      '"Illusory text and a disembodied voice convey a specified message of up to 25 words the next time a specified trigger occurs within 30\' (<b>heightened 4th</b> can include additional sensory effects; <b>6th</b> message can repeat multiple times)"',
  'Energy Aegis':
    Pathfinder2E.SPELLS['Energy Aegis']
    .replace('Abjuration', 'Concentrate,Manipulate')
    .replace('for 1 day', 'until next daily prep')
    .replace('negative, positive', 'vitality, void'),
  'Enfeeble':
    Pathfinder2E.SPELLS['Ray Of Enfeeblement'] + ' ' +
    // Attack trait removed by errata
    'Traits=Concentrate,Manipulate ' +
    'Description=' +
      '"R30\' Inflicts enfeebled 2 for 1 min (<b>save Fortitude</b> inflicts enfeebled 1 for 1 rd; critical success negates; critical failure inflicts enfeebled 3 for 1 min)"',
  'Enlarge':
    Pathfinder2E.SPELLS.Enlarge
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Entangling Flora':
    Pathfinder2E.SPELLS.Entangle
    .replace('Transmutation', 'Concentrate,Manipulate,Wood')
    .replace('Primal', 'Arcane,Primal'),
  'Enthrall':
    Pathfinder2E.SPELLS.Enthrall
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Environmental Endurance':
    Pathfinder2E.SPELLS['Endure Elements']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Everlight':
    Pathfinder2E.SPELLS['Continual Flame']
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Description="Touched gemstone emits 20\' bright light until dismissed"',
  'Execute':
    Pathfinder2E.SPELLS['Finger Of Death']
    .replace('Necromancy', 'Concentrate,Manipulate,Void')
    .replace('negative', 'void'),
  'Fabricated Truth':
    Pathfinder2E.SPELLS['Fabricated Truth']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Falling Stars':
    Pathfinder2E.SPELLS['Meteor Swarm']
    .replace('Evocation,Fire', 'Concentrate,Manipulate')
    .replaceAll('fire', 'chosen energy'),
  'False Vision':
    Pathfinder2E.SPELLS['False Vision']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'False Vitality':
    Pathfinder2E.SPELLS['False Life']
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace(/%\{.*\}/, '10'),
  'Fear':
    Pathfinder2E.SPELLS.Fear
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Feet To Fins':
    Pathfinder2E.SPELLS['Feet To Fins']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Field Of Life':
    Pathfinder2E.SPELLS['Field Of Life']
    .replace('Necromancy,Positive', 'Concentrate,Manipulate')
    .replaceAll('positive', 'vitality'),
  'Fiery Body':
    Pathfinder2E.SPELLS['Fiery Body']
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('Produce Flame', 'Ignite'),
  'Figment':
    Pathfinder2E.SPELLS['Ghost Sound']
    // Subtle trait added by errata
    .replace('Auditory', 'Concentrate,Manipulate,Subtle') + ' ' +
    'Description=' +
      '"R30\' Creates a simply illusory sound or vision while sustained"',
  'Fire Shield':
    Pathfinder2E.SPELLS['Fire Shield']
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Hovering shield with Hardness 10 and 40 HP gives self cold resistance 5 and immunity to severe environmental cold and inflicts 2d6 HP fire on melee attackers for 1 min (<b>heightened +2</b> shield has +10 HP, gives cold resistance +5, and inflicts +1d6 HP)"',
  'Fireball':
    Pathfinder2E.SPELLS.Fireball
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Fleet Step':
    Pathfinder2E.SPELLS['Fleet Step']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Flicker':
    Pathfinder2E.SPELLS.Blink
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Floating Flame':
    Pathfinder2E.SPELLS['Flaming Sphere']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('; success negates', ''),
  'Fly':
    Pathfinder2E.SPELLS.Fly
    .replace('Transmutation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Occult,Primal',
  'Forbidding Ward':
    Pathfinder2E.SPELLS['Forbidding Ward']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Force Barrage':
    Pathfinder2E.SPELLS['Magic Missile']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replaceAll('missile', 'shard'),
  'Foresight':
    Pathfinder2E.SPELLS.Foresight
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('flat-footed', 'off-guard'),
  'Freeze Time':
    Pathfinder2E.SPELLS['Time Stop']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Frostbite':
    Pathfinder2E.SPELLS['Ray Of Frost'] + ' ' +
    // Attack trait removed by errata
    'Traits=Cantrip,Cold,Concentrate,Manipulate ' +
    'Description=' +
      '"R60\' Inflicts 2d4 HP cold (<b>save basic Fortitude</b>; critical failure also inflicts weakness 1 to bludgeoning for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP and weakness +1 to bludgeoning)"',
  'Gate':
    Pathfinder2E.SPELLS.Gate
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Gecko Grip':
    Pathfinder2E.SPELLS['Spider Climb']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Feather Fall':
    Pathfinder2E.SPELLS['Feather Fall']
    .replace('Abjuration', 'Air,Concentrate'),
  'Ghostly Carrier':
    Pathfinder2E.SPELLS['Spectral Hand']
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace(/ends the spell[^"]*/, 'ends the spell'),
  'Ghostly Weapon':
    Pathfinder2E.SPELLS['Ghostly Weapon']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Goblin Pox':
    Pathfinder2E.SPELLS['Goblin Pox']
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
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Grim Tendrils':
    Pathfinder2E.SPELLS['Grim Tendrils'] + ' ' +
    'Traits=Concentrate,Manipulate,Void'
    .replaceAll('negative', 'void'),
  'Guidance':
    Pathfinder2E.SPELLS.Guidance
    .replace('Divination', 'Concentrate'),
  'Gust Of Wind':
    Pathfinder2E.SPELLS['Gust Of Wind']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Hallucination':
    Pathfinder2E.SPELLS.Hallucination
    .replace('Traits=', 'Traits=Manipulate,Subtle,'),
  'Harm':
    Pathfinder2E.SPELLS.Harm + ' ' +
    'Traits=Manipulate,Void'
    .replaceAll('negative', 'void'),
  'Haste':
    Pathfinder2E.SPELLS.Haste
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Heal':
    Pathfinder2E.SPELLS.Heal
    .replace('Necromancy,Positive', 'Manipulate,Vitality'),
  'Heroism':
    Pathfinder2E.SPELLS.Heroism
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Hidden Mind':
    Pathfinder2E.SPELLS['Mind Blank']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Holy Light':
    Pathfinder2E.SPELLS['Searing Light']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Good', 'Holy')
    .replaceAll('good', 'spirit')
    .replace('fiends and undead', 'unholy creatures'),
  'Glibness':
    Pathfinder2E.SPELLS.Glibness
    .replace('Uncommon,Enchantment', 'Concentrate,Manipulate'),
  'Howling Blizzard':
    Pathfinder2E.SPELLS['Cone Of Cold']
    .replace('Evocation', 'Concentrate,Manipulate,Air') + ' ' +
    'Description=' +
      '"60\' cone (using 3 actions gives R500\' and a 30\' burst) inflicts 10d6 HP cold (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Humanoid Form':
    Pathfinder2E.SPELLS['Humanoid Form']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Hydraulic Push':
    Pathfinder2E.SPELLS['Hydraulic Push']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Hydraulic Torrent':
    Pathfinder2E.SPELLS['Hydraulic Torrent']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Hypercognition':
    Pathfinder2E.SPELLS.Hypercognition
    .replace('Divination', 'Concentrate'),
  'Hypnotize':
    Pathfinder2E.SPELLS['Hypnotic Pattern']
    .replace('Traits=', 'Traits=Manipulate,Subtle,'),
  'Ignition':
    Pathfinder2E.SPELLS['Produce Flame']
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
    .replace('Traits=', 'Traits=Concentrate,Manipulate,')
    .replace(/1d4\+%\{.*\}/, '3d4'),
  'Illusory Disguise':
    Pathfinder2E.SPELLS['Illusory Disguise']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,') + ' ' +
    'Description=' +
      '"R30\' Makes the target appear different and gives +4 Deception, plus the target level if untrained, to avoid uncovering the disguise for 1 hr (<b>heightened 3rd</b> allows copying a specific individual; <b>4th</b> affects 10 targets; <b>7th</b> affects 10 targets and allows copying specific individuals)"',
  'Illusory Object':
    Pathfinder2E.SPELLS['Illusory Object']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Illusory Scene':
    Pathfinder2E.SPELLS['Illusory Scene']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Impaling Spike':
    'Level=5 ' +
    'Traits=Concentrate,Manipulate,Metal ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts 8d6 HP piercing from cold iron and immobilized (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and off-guard) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Implosion':
    Pathfinder2E.SPELLS.Implosion
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Indestructibility':
    'Level=10 ' +
    'Traits=Concentrate,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="Gives self immunity to harm for 1 rd"',
  'Infuse Vitality':
    Pathfinder2E.SPELLS['Disrupting Weapons']
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality') + ' ' +
    'Cast=1 ' +
    'Description=' +
      '"Touched weapon (using 2 or 3 actions affects 2 or 3 weapons) inflicts +1d4 HP vitality%{traits.Holy?\' and holy\':\'\'} for 1 min (<b>heightened 3rd</b> weapon inflicts +2d4 HP; <b>5th</b> weapon inflicts +3d4 HP)"',
  'Insect Form':
    Pathfinder2E.SPELLS['Insect Form']
    .replace('Transmutation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Primal',
  'Interplanar Teleport':
    Pathfinder2E.SPELLS['Plane Shift']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Invisibility':
    Pathfinder2E.SPELLS.Invisibility
    .replace('Traits=', 'Traits=Manipulate,Subtle,'),
  'Invoke Spirits':
    'Level=5 ' +
    'Traits=Concentrate,Emotion,Fear,Manipulate,Mental,Void ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' 10\' burst, movable 30\' per rd, inflicts 2d4 HP mental and 2d4 HP void while sustained for up to 1 min (<b>save Will</b> negates; critical failure also inflicts frightened 2, plus fleeing in the first rd) (<b>heightened +2</b> inflicts +1d4 HP mental and void)"',
  'Item Facade':
    Pathfinder2E.SPELLS['Item Facade']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Jump':
    Pathfinder2E.SPELLS.Jump
    .replace('Transmutation', 'Manipulate'),
  'Knock':
    Pathfinder2E.SPELLS.Knock
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Know The Way':
    Pathfinder2E.SPELLS['Know Direction']
    .replace('Divination', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Reveals which direction is north (<b>heightened 3rd</b> reveals direction to a location visited in the past week; <b>7th</b> reveals direction to a familiar location)"',
  'Laughing Fit':
    Pathfinder2E.SPELLS['Hideous Laughter']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Levitate':
    Pathfinder2E.SPELLS.Levitate
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Light':
    Pathfinder2E.SPELLS.Light
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Touched object', "R120' Orb"),
  'Lightning Bolt':
    Pathfinder2E.SPELLS['Lightning Bolt']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Liminal Doorway':
    Pathfinder2E.SPELLS['Rope Trick']
    .replace('Conjuration', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Drawn doorway leads to an 20\' cubic extradimensional space for 8 hr or until erased"',
  'Locate':
    Pathfinder2E.SPELLS.Locate
    .replace('Divination', 'Concentrate,Manipulate'),
  'Lock':
    Pathfinder2E.SPELLS.Lock
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
    .replace('Conjuration', 'Concentrate,Manipulate'),
  "Mariner's Curse":
    Pathfinder2E.SPELLS["Mariner's Curse"]
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Marvelous Mount':
    Pathfinder2E.SPELLS['Phantom Steed']
    .replace('Conjuration', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Description=' +
      '"R30\' Conjures a magical mount (Armor Class %{armorClass}, HP 10, 40\' Speed) that can be ridden only by a designated creature for 8 hr (<b>heightened 3rd</b> mount can walk on water; <b>4th</b> mount has 60\' Speed; <b>5th</b> mount can also fly for 1 rd; <b>6th</b> mount has 80\' Speed and can fly)"',
  'Mask Of Terror':
    Pathfinder2E.SPELLS['Mask Of Terror']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Massacre':
    Pathfinder2E.SPELLS.Massacre
    .replace('Necromancy,Negative', 'Concentrate,Manipulate,Void')
    .replaceAll('negative', 'void'),
  'Mending':
    Pathfinder2E.SPELLS.Mending
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('level', 'rank'),
  'Message':
    Pathfinder2E.SPELLS.Message
    .replace('Traits=', 'Traits=Concentrate,Subtle,'),
  'Metamorphosis':
    Pathfinder2E.SPELLS.Shapechange
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('level', 'rank'),
  'Migration':
    Pathfinder2E.SPELLS['Wind Walk'] + ' ' +
    'Traits=Concentrate,Manipulate,Polymorph'
    .replace('clouds', 'animals')
    .replace('MPH', 'MPH, have immunity to extreme cold and heat, and can transform into a Tiny or Small animal'),
  'Mind Probe':
    Pathfinder2E.SPELLS['Mind Probe']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Mind Reading':
    Pathfinder2E.SPELLS['Mind Reading']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Mindlink':
    Pathfinder2E.SPELLS.Mindlink
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('Traditions=', 'Traditions=Arcane,'),
  'Mirage':
    Pathfinder2E.SPELLS['Hallucinatory Terrain']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Mislead':
    Pathfinder2E.SPELLS.Mislead
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Mist':
    Pathfinder2E.SPELLS['Obscuring Mist']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Moment Of Renewal':
    Pathfinder2E.SPELLS['Moment Of Renewal']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Monstrosity Form':
    Pathfinder2E.SPELLS['Monstrosity Form']
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('purple', 'cave'),
  'Moon Frenzy':
    Pathfinder2E.SPELLS['Moon Frenzy']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Mountain Resilience':
    Pathfinder2E.SPELLS.Stoneskin
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Mystic Armor':
    Pathfinder2E.SPELLS['Mage Armor'] + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal',
  'Nature Incarnate':
    Pathfinder2E.SPELLS['Nature Incarnate']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  "Nature's Pathway":
    Pathfinder2E.SPELLS['Tree Stride']
    .replace('Conjuration', 'Concentrate,Manipulate,Mental')
    .replace(' of the same species', ''),
  'Never Mind':
    Pathfinder2E.SPELLS.Feeblemind
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Nightmare':
    Pathfinder2E.SPELLS.Nightmare
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Noise Blast':
    Pathfinder2E.SPELLS['Sound Burst']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Traditions=', 'Traditions=Arcane,'),
  'Oaken Resilience':
    Pathfinder2E.SPELLS.Barkskin
    .replace('Abjuration', 'Concentrate,Manipulate,Wood')
    .replace('Traditions=', 'Traditions=Arcane,'),
  'One With Plants':
    Pathfinder2E.SPELLS['Tree Shape']
    .replace('Transmutation', 'Concentrate,Manipulate,Wood')
    .replace('8 hr', '8 hr or merges into plant matter for 10 min'),
  'One With Stone':
    Pathfinder2E.SPELLS['Meld Into Stone']
    .replace('Transmutation', 'Concentrate,Manipulate,Polymorph') + ' ' +
    'Description=' +
      '"Self becomes a block of stone with Armor Class 23 for 8 hr or merges into stone for 10 min"',
  "Outcast's Curse":
    Pathfinder2E.SPELLS["Outcast's Curse"]
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Overwhelming Presence':
    Pathfinder2E.SPELLS['Overwhelming Presence']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Paralyze':
    Pathfinder2E.SPELLS.Paralyze
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Paranoia':
    Pathfinder2E.SPELLS.Paranoia
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Peaceful Bubble':
    Pathfinder2E.SPELLS['Private Sanctum']
    .replace('Abjuration', 'Concentrate,Manipulate')
    .replace('until next daily prep', 'for 24 hr; sleeping within for 8 hr reduces doomed conditions by 2'),
  'Peaceful Rest':
    Pathfinder2E.SPELLS['Gentle Repose']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Pest Form':
    Pathfinder2E.SPELLS['Pest Form']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Pest Cache':
    'Level=1 ' +
    'Traits=Extradimensional,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description="Moves companion into a pocket dimension for up to 8 hr"',
  'Petrify':
    Pathfinder2E.SPELLS['Flesh To Stone']
    .replace('Transmutation', 'Concentrate,Earth,Manipulate'),
  'Phantasmagoria':
    Pathfinder2E.SPELLS.Weird
    .replace('Emotion,Fear', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R120\' Inflicts 16d6 HP mental and confused for 1 rd on all targets within range (<b>save Will</b> inflicts half HP loss of reactions for 1 rd; critical success negates; critical failure inflicts double HP and confused for 1 min)"',
  'Phantasmal Calamity':
    Pathfinder2E.SPELLS['Phantasmal Calamity']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Phantasmal Minion':
    Pathfinder2E.SPELLS['Unseen Servant']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Phantom Pain':
    Pathfinder2E.SPELLS['Phantom Pain']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Pinpoint':
    Pathfinder2E.SPELLS['Discern Location']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Planar Palace':
    Pathfinder2E.SPELLS['Magnificent Mansion']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Planar Seal':
    Pathfinder2E.SPELLS['Dimensional Lock']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Planar Tether':
    Pathfinder2E.SPELLS['Dimensional Anchor']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Plant Form':
    Pathfinder2E.SPELLS['Plant Form']
    .replace('Transmutation', 'Concentrate,Manipulate,Wood'),
  'Possession':
    Pathfinder2E.SPELLS.Possession
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Prestidigitation':
    Pathfinder2E.SPELLS.Prestidigitation
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Project Image':
    Pathfinder2E.SPELLS['Project Image']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Protection':
    Pathfinder2E.SPELLS.Protection + ' ' +
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
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Quandary':
    Pathfinder2E.SPELLS.Maze
    .replace('Conjuration', 'Concentrate,Manipulate')
    .replace('maze', 'puzzle room')
    .replace('Survival or', 'Thievery, Occultism, or'),
  'Raise Dead':
    Pathfinder2E.SPELLS['Raise Dead']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Read Aura':
    Pathfinder2E.SPELLS['Read Aura']
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('the related school of magic', 'gives +2 to Identify Magic on it'),
  'Read Omens':
    Pathfinder2E.SPELLS['Read Omens']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Regenerate':
    Pathfinder2E.SPELLS.Regenerate
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality'),
  'Remake':
    Pathfinder2E.SPELLS.Remake
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Repulsion':
    Pathfinder2E.SPELLS.Repulsion
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Resist Energy':
    Pathfinder2E.SPELLS['Resist Energy']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Retrocognition':
    Pathfinder2E.SPELLS.Retrocognition
    .replace('Divination', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Occult',
  'Revealing Light':
    Pathfinder2E.SPELLS['Faerie Fire']
    .replace('Evocation', 'Concentrate,Manipulate') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Description=' +
      '"R120\' 10\' burst dazzles makes concealed creatures visible and invisible creatures concealed for 1 min (<b>save Reflex</b> effects last 2 rd; critical success negates; critical failure effects last 10 min)"',
  'Revival':
    Pathfinder2E.SPELLS.Revival
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality'),
  'Rewrite Memory':
    Pathfinder2E.SPELLS['Modify Memory']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Ring Of Truth':
    // Note: assume casting time remains the same
    Pathfinder2E.SPELLS['Zone Of Truth']
    .replace('Enchantment', 'Concentrate,Manipulate,Detection')
    .replace(/; critical failure[^)]/, ''),
  'Runic Body':
    Pathfinder2E.SPELLS['Magic Fang']
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace('for 1 min', 'for 1 min (<b>heightened 6th</b> gives +2 attack; <b>9th</b> gives +3 attack') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal',
  'Runic Weapon':
    Pathfinder2E.SPELLS['Magic Weapon']
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
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Scouting Eye':
    Pathfinder2E.SPELLS['Prying Eye']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Scrying':
    Pathfinder2E.SPELLS.Scrying
    .replace('Divination', 'Concentrate,Manipulate'),
  'See The Unseen':
    Pathfinder2E.SPELLS['See Invisibility']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Seize Soul':
    Pathfinder2E.SPELLS['Bind Soul']
    .replace('Evil,Necromancy', 'Unholy,Concentrate,Manipulate'),
  'Sending':
    Pathfinder2E.SPELLS.Sending
    .replace('Divination', 'Concentrate,Manipulate'),
  'Shadow Blast':
    Pathfinder2E.SPELLS['Shadow Blast']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('5d8', '6d8'),
  'Shape Stone':
    Pathfinder2E.SPELLS['Shape Stone']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Shape Wood':
    Pathfinder2E.SPELLS['Shape Wood']
    .replace('Transmutation', 'Concentrate,Manipulate,Wood') + ' ' +
    'Traditions=Arcane,Primal',
  'Share Life':
    Pathfinder2E.SPELLS['Shield Other']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Shatter':
    Pathfinder2E.SPELLS.Shatter
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Shield':
    Pathfinder2E.SPELLS.Shield
    .replace('Abjuration', 'Concentrate')
    .replace(/\(.*\)/, '(<b>heightened +2</b> gives Hardness +5)'),
  'Shrink':
    Pathfinder2E.SPELLS.Shrink
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Sigil':
    Pathfinder2E.SPELLS.Sigil
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Silence':
    Pathfinder2E.SPELLS.Silence
    .replace('Traits=', 'Traits=Subtle,Manipulate,'),
  'Sleep':
    Pathfinder2E.SPELLS.Sleep
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Slither':
    Pathfinder2E.SPELLS['Black Tentacles']
    .replace('Conjuration', 'Concentrate,Manipulate,Shadow') + ' ' +
    'Description=' +
      '"R120\' 20\' bursts inflict 3d6 HP piercing, 1d6 HP persistent poison, and grabbed for 1 min; requires a successful success on a DC %{spellDifficultyClass.%tradition} Escape or inflicting 12 HP vs. Armor Class %{spellDifficultyClass.%tradition} to escape (<b>save Reflex</b> negates; critical failure inflicts double HP) (<b>heightened +2</b> inflicts +1d6 HP persistent poison and requires +6 HP damage to escape)"',
  'Slow':
    Pathfinder2E.SPELLS.Slow
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Soothe':
    Pathfinder2E.SPELLS.Soothe
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Sound Body':
    Pathfinder2E.SPELLS['Restore Senses']
    .replace('Necromancy', 'Concentrate,Manipulate,Vitality') + ' ' +
    'Description=' +
      '"Makes a counteract attempt vs. a magical blinded, dazzled, deafness, enfeebled, or sickened effect affecting touched; failure that would succeed against an effect 2 ranks lower suppresses the effect for 1 rd (<b>heightened 4th</b> attempts to counteract drained; <b>8th</b> attempts to counteract stunned)"',
  'Speak With Animals':
    Pathfinder2E.SPELLS['Speak With Animals']
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('10 min', '1 hr'),
  'Speak With Plants':
    Pathfinder2E.SPELLS['Speak With Plants']
    .replace('Divination', 'Concentrate,Manipulate')
    .replace('10 min', '1 hr (<b>heightened 4th</b> effects last 8 hr') + ' ' +
    'Level=3',
  'Speak With Stones':
    Pathfinder2E.SPELLS['Stone Tell']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('10 min', '1 hr (<b>heightened 6th</b> effects last 8 hr') + ' ' +
    'Level=5',
  'Spellwrack':
    Pathfinder2E.SPELLS.Spellwrack
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Spider Sting':
    Pathfinder2E.SPELLS['Spider Sting']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Spirit Blast':
    Pathfinder2E.SPELLS['Spirit Blast']
    .replace('Force,Necromancy', 'Concentrate,Manipulate,Spirit')
    .replace('force', 'spirit'),
  'Spirit Link':
    Pathfinder2E.SPELLS['Spirit Link']
    .replace('Necromancy', 'Concentrate,Manipulate,Spirit'),
  'Spiritual Armament':
    Pathfinder2E.SPELLS['Spiritual Weapon']
    .replace('Evocation,Force', 'Concentrate,Manipulate,Sanctified,Spirit')
    .replace(/\+%\{.*\}/, 'spell')
    .replace('1d8 HP force', '2d8 HP spirit'),
  'Spiritual Guardian':
    Pathfinder2E.SPELLS['Spiritual Guardian']
    .replace('Abjuration,Force', 'Concentrate,Manipulate,Sanctified,Spirit')
    .replace(/\+%\{.*\} /, '')
    .replace('2d8 HP force', '3d8 HP spirit'),
  'Stabilize':
    Pathfinder2E.SPELLS.Stabilize
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality'),
  'Status':
    Pathfinder2E.SPELLS.Status
    .replace('Divination', 'Concentrate,Manipulate'),
  'Stupefy':
    Pathfinder2E.SPELLS['Touch Of Idiocy']
    .replace('Enchantment', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R30\' Inflicts stupefied 2 for 1 min (<b>save Will</b> inflicts stupefied 1 for 1 rd; critical success negates; critical failure inflicts stupefied 3)"',
  'Subconscious Suggestion':
    Pathfinder2E.SPELLS['Subconscious Suggestion']
    .replace('Enchantment', 'Concentrate,Manipulate,Subtle'),
  'Suggestion':
    Pathfinder2E.SPELLS.Suggestion
    .replace('Enchantment', 'Concentrate,Manipulate,Subtle'),
  'Summon Animal':
    Pathfinder2E.SPELLS['Summon Animal']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Summon Celestial':
    Pathfinder2E.SPELLS['Summon Celestial']
    .replace('Conjuration', 'Concentrate,Holy,Manipulate,Summon'),
  'Summon Construct':
    Pathfinder2E.SPELLS['Summon Construct']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Summon Dragon':
    Pathfinder2E.SPELLS['Summon Dragon']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon') + ' ' +
    'Traditions=Arcane,Divine,Occult,Primal',
  'Summon Elemental':
    Pathfinder2E.SPELLS['Summon Elemental']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Summon Entity':
    Pathfinder2E.SPELLS['Summon Entity']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Summon Fey':
    Pathfinder2E.SPELLS['Summon Fey']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Summon Fiend':
    Pathfinder2E.SPELLS['Summon Fiend']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon,Unholy'),
  'Summon Giant':
    Pathfinder2E.SPELLS['Summon Giant']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Summon Instrument':
    'Level=1 ' +
    'Traits=Cantrip,Concentrate,Manipulate ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"Creates a handheld musical instrument that self can play for 1 hr (<b>Heightened 5th</b> creates a virtuoso instrument"',
  'Summon Monitor':
    'Level=5 ' +
    'Traits=Concentrate,Manipulate,Summon ' +
    'Traditions=Divine ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level 5 monitor appears and fights for self while sustained for up to 1 min (<b>heightened +1</b> summons a +2 level creature)"',
  'Summon Plant Or Fungus':
    Pathfinder2E.SPELLS['Summon Plant Or Fungus']
    .replace('Conjuration', 'Concentrate,Manipulate,Summon'),
  'Summon Undead':
    'Level=1 ' +
    'Traits=Concentrate,Manipulate,Summon ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=3 ' +
    'Description=' +
      '"R30\' A level -1 undead appears and fights for self while sustained for up to 1 min (<b>heightened 2nd</b> summons a level 1 creature; <b>3rd</b> summons a level 2 creature; <b>4th</b> summons a level 3 creature; <b>5th</b> summons a level 5 creature; <b>6th</b> summons a level 7 creature; <b>7th</b> summons a level 9 creature; <b>8th</b> summons a level 11 creature; <b>9th</b> summons a level 13 creature; <b>10th</b> summons a level 15 creature)"',
  'Sunburst':
    Pathfinder2E.SPELLS.Sunburst
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Positive', 'Vitality')
    .replaceAll('positive', 'vitality'),
  'Sure Footing':
    Pathfinder2E.SPELLS['Remove Paralysis']
    .replace('Necromancy', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Makes a counteract attempt vs. a clumsy, grabbed, or paralysis effect affecting touched; failure that would succeed against an effect 2 ranks lower suppresses the effect for 1 rd (<b>heightened 4th</b> attempts to counteract immobilized or restrained; <b>6th</b> attempts to counteract petrified; <b>8th</b> attempts to counteract stunned)"',
  'Sure Strike':
    Pathfinder2E.SPELLS['True Strike']
    .replace('Divination', 'Concentrate'),
  'Synaptic Pulse':
    Pathfinder2E.SPELLS['Synaptic Pulse']
    .replace('Enchantment', 'Concentrate,Manipulate,Metal'),
  'Tailwind':
    Pathfinder2E.SPELLS.Longstrider
    .replace('Transmutation', 'Concentrate,Manipulate,Air'),
  'Talking Corpse':
    Pathfinder2E.SPELLS['Talking Corpse']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Tangle Vine':
    Pathfinder2E.SPELLS.Tanglefoot
    .replace('Conjuration', 'Concentrate,Manipulate,Wood'),
  'Tangling Creepers':
    Pathfinder2E.SPELLS['Tangling Creepers']
    .replace('Conjuration', 'Concentrate,Manipulate,Wood') + ' ' +
    'Traditions=Arcane,Primal',
  'Telekinetic Hand':
    Pathfinder2E.SPELLS['Mage Hand']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Telekinetic Haul':
    Pathfinder2E.SPELLS['Telekinetic Haul']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Telekinetic Maneuver':
    Pathfinder2E.SPELLS['Telekinetic Maneuver']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Telekinetic Projectile':
    Pathfinder2E.SPELLS['Telekinetic Projectile']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace(/1d6+%\{.*\}/, '2d6'),
  'Telepathy':
    Pathfinder2E.SPELLS.Telepathy
    .replace('Divination', 'Concentrate,Manipulate'),
  'Teleport':
    Pathfinder2E.SPELLS.Teleport
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Thunderstrike':
    Pathfinder2E.SPELLS['Shocking Grasp']
    .replace('Electricity,Evocation', 'Concentrate,Manipulate,Sonic') + ' ' +
    'Description=' +
      '"R120\' Inflicts 1d12 HP electricity and 1d4 HP sonic (<b>save basic Reflex</b>; targets in metal armor suffer -1 save and clumsy 1 for 1 rd (<b>heightened +1</b> inflicts +1d12 HP electricity and +1d4 HP sonic)"',
  'Toxic Cloud':
    Pathfinder2E.SPELLS.Cloudkill
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Translate':
    Pathfinder2E.SPELLS['Comprehend Language']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Translocate':
    Pathfinder2E.SPELLS['Dimension Door']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Tree Of Seasons':
    Pathfinder2E.SPELLS['Fire Seeds']
    .replace('Evocation,Fire', 'Concentrate,Manipulate,Wood') + ' ' +
    'Description=' +
      '"Creates 4 seedpods that can be thrown 30\', inflicting 6d6 HP electricity, fire, poison, or cold in a 5\' burst within 1 min (<b>save basic Reflex</b>) (<b>heightened +1</b> inflicts +1d6 HP)"',
  'True Target':
    Pathfinder2E.SPELLS['True Target']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Truesight':
    Pathfinder2E.SPELLS['True Seeing']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Truespeech':
    Pathfinder2E.SPELLS.Tongues
    .replace('Divination', 'Concentrate,Manipulate'),
  'Umbral Journey':
    Pathfinder2E.SPELLS['Shadow Walk']
    .replace('Conjuration', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"Allows self and 10 willing touched to travel through the Netherworld at 72x Speed for 8 hr"',
  'Uncontrollable Dance':
    Pathfinder2E.SPELLS['Uncontrollable Dance']
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace('flat-footed', 'off-guard'),
  'Unfathomable Song':
    Pathfinder2E.SPELLS['Unfathomable Song']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Unfettered Movement':
    Pathfinder2E.SPELLS['Freedom Of Movement']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Unfettered Pack':
    Pathfinder2E.SPELLS['Unfettered Pack']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Unrelenting Observation':
    Pathfinder2E.SPELLS['Unrelenting Observation']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Vampiric Exsanguination':
    Pathfinder2E.SPELLS['Vampiric Exsanguination']
    .replace('Necromancy', 'Concentrate,Manipulate,Void')
    .replaceAll('negative', 'void'),
  'Vampiric Feast':
    Pathfinder2E.SPELLS['Vampiric Touch']
    .replace('Necromancy', 'Concentrate,Manipulate,Void')
    .replaceAll('negative', 'void'),
  'Vanishing Tracks':
    Pathfinder2E.SPELLS['Pass Without Trace']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Gaseous Form':
    Pathfinder2E.SPELLS['Gaseous Form']
    .replace('Transmutation', 'Concentrate,Manipulate,Air'),
  'Nondetection':
    Pathfinder2E.SPELLS.Nondetection
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Ventriloquism':
    Pathfinder2E.SPELLS.Ventriloquism
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Vibrant Pattern':
    Pathfinder2E.SPELLS['Vibrant Pattern']
    .replace('Traits=', 'Traits=Manipulate,Subtle,'),
  'Vision Of Death':
    Pathfinder2E.SPELLS['Phantasmal Killer']
    .replace('Illusion', 'Concentrate,Manipulate') + ' ' +
    'Description=' +
      '"R120\' Inflicts 8d6 HP mental, frightened 2, and death if taken to 0 HP (<b>save Will</b> inflicts half HP, frightened 1, and death at 0 HP; critical success negates; critical failure double HP, frightened 4, death at 0 HP, and fleeing until no longer frightened) (<b>heightened +1</b> inflicts +2d6 HP)"',
  'Vital Beacon':
    Pathfinder2E.SPELLS['Vital Beacon']
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality'),
  'Vitality Lash':
    Pathfinder2E.SPELLS['Disrupt Undead']
    .replace('Necromancy,Positive', 'Concentrate,Manipulate,Vitality')
    .replace(/1d6.*%\{.*\}/, '2d6'),
  'Void Warp':
    Pathfinder2E.SPELLS['Chill Touch']
    .replace('Necromancy,Negative', 'Concentrate,Manipulate,Void') + ' ' +
    'Description=' +
      '"Touch inflicts 2d4 HP negative on a living creature (<b>save basic Fortitude</b>; critical failure also inflicts enfeebled 1 for 1 rd) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Volcanic Eruption':
    Pathfinder2E.SPELLS['Volcanic Eruption']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Wails Of The Damned':
    Pathfinder2E.SPELLS['Wail Of The Banshee']
    .replace('Necromancy,Negative', 'Concentrate,Manipulate,Void')
    .replaceAll('negative', 'void'),
  'Wall Of Fire':
    Pathfinder2E.SPELLS['Wall Of Fire']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Wall Of Force':
    Pathfinder2E.SPELLS['Wall Of Force']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Wall Of Ice':
    Pathfinder2E.SPELLS['Wall Of Ice']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Wall Of Stone':
    Pathfinder2E.SPELLS['Wall Of Stone']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Wall Of Thorns':
    Pathfinder2E.SPELLS['Wall Of Thorns']
    .replace('Conjuration', 'Concentrate,Manipulate,Wood') + ' ' +
    'Traditions=Arcane,Primal',
  'Wall Of Wind':
    Pathfinder2E.SPELLS['Wall Of Wind']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Warp Mind':
    Pathfinder2E.SPELLS['Warp Mind']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Water Breathing':
    Pathfinder2E.SPELLS['Water Breathing']
    .replace('Transmutation', 'Concentrate,Manipulate,Water'),
  'Water Walk':
    Pathfinder2E.SPELLS['Water Walk']
    .replace('Transmutation', 'Concentrate,Manipulate,Water'),
  'Wave Of Despair':
    Pathfinder2E.SPELLS['Crushing Despair']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Weapon Storm':
    Pathfinder2E.SPELLS['Weapon Storm']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Wrathful Storm':
    Pathfinder2E.SPELLS['Storm Of Vengeance']
    .replace('Evocation', 'Concentrate,Manipulate,Cold') + ' ' +
    'Description=' +
      '"R800\' 400\' burst inflicts -4 ranged attacks, greater difficult terrain for flying, and a choice each rd of 4d8 HP cold (<b>no save</b>), 4d10 HP bludgeoning (<b>save basic Fortitude</b>), 7d6 HP electricity on 10 targets (<b>save basic Reflex</b>), or thrown 40\' (<b>no save</b>) while sustained for up to 1 min (<b>heightened 10th</b> R2200\' 1000\' burst)"',
  'Zealous Conviction':
    Pathfinder2E.SPELLS['Zealous Conviction']
    .replace('Enchantment', 'Concentrate,Manipulate'),

  'Allegro':
    Pathfinder2E.SPELLS.Allegro
    .replace('Enchantment', 'Concentrate'),
  'Counter Performance':
    Pathfinder2E.SPELLS['Counter Performance']
    .replace('Enchantment', 'Concentrate'),
  'Courageous Anthem':
    Pathfinder2E.SPELLS['Inspire Courage']
    .replace('Enchantment', 'Concentrate'),
  'Dirge Of Doom':
    Pathfinder2E.SPELLS['Dirge Of Doom']
    .replace('Enchantment', 'Concentrate'),
  'Fatal Aria':
    Pathfinder2E.SPELLS['Fatal Aria']
    .replace('Enchantment', 'Concentrate'),
  'Fortissimo Composition':
    Pathfinder2E.SPELLS['Inspire Heroics']
    .replace('Enchantment', 'Concentrate')
    .replace('Metamagic', 'Spellshape')
    .replace('<i>Inspire Courage</i> or <i>Inspire Defense', '<i>Courageous Anthem</i>, <i>Rallying Anthem</i>, or <i>Song Of Strength</i>'),
  'House Of Imaginary Walls':
    Pathfinder2E.SPELLS['House Of Imaginary Walls']
    .replace('Traits=', 'Traits=Manipulate,'),
  'Hymn Of Healing':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Bard,Composition,Concentrate,Healing,Vitality ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Gives the target fast healing 2 and 2 temporary Hit Points each rd while sustained up to 4 rd (<b>heightened +1</b> gives +2 fast healing and temporary Hit Points)"',
  'Lingering Composition':
    Pathfinder2E.SPELLS['Lingering Composition']
    .replace('Enchantment', 'Concentrate')
    .replace('Metamagic', 'Spellshape'),
  "Loremaster's Etude":
    Pathfinder2E.SPELLS["Loremaster's Etude"]
    .replace('Divination', 'Manipulate'),
  'Ode To Ouroboros':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Bard,Composition,Concentrate ' +
    'Traditions=Occult ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Negates an increase in target\'s dying condition that would cause death"',
  'Pied Piping':
    'Level=10 ' +
    'Traits=Focus,Uncommon,Bard,Composition,Concentrate,Incapacitation,Mental,Sonic ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"5\' emanation fascinates creature and causes them to approach while sustained for up to 1 min; a hostile action ends the effect (<b>save Will</i> inflicts fascination only; critical success negates; critical failure inflicts complete control)"',
  'Rallying Anthem':
    Pathfinder2E.SPELLS['Inspire Defense']
    .replace('Enchantment', 'Concentrate')
    .replace('level', 'rank'),
  'Song Of Marching':
    'Level=3 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Concentrate,Mental ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation allows self and allies to Hustle and self to use Performance for initiate while sustained for up to 1 hr (<b>heightened 6th</b> effects last 2 hr; <b>9th</b> effect last 4 hr)"',
  'Song Of Strength':
    'Level=1 ' +
    'Traits=Focus,Uncommon,Bard,Cantrip,Composition,Concentrate,Emotion,Mental ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' emanation give allies +1 Athletics and DCs vs. Athletics skill actions for 1 rd"',
  'Soothing Ballad':
    Pathfinder2E.SPELLS['Soothing Ballad']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Symphony Of The Unfettered Heart':
    'Level=5 ' +
    'Traits=Focus,Uncommon,Bard,Composition,Concentrate ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Uses Performance to counteract one of grabbed, immobilized, paralyzed, restrained, slowed, or stunned affecting target (<b>heightened 9th</b> affects 4 targets)"',
  'Triple Time':
    Pathfinder2E.SPELLS['Triple Time']
    .replace('Enchantment', 'Manipulate'),
  'Uplifting Overture':
    Pathfinder2E.SPELLS['Inspire Competence']
    .replace('Enchantment', 'Concentrate'),
  'Pushing Gust':
    Pathfinder2E.SPELLS['Pushing Gust']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Disperse Into Air':
    Pathfinder2E.SPELLS['Disperse Into Air']
    .replace('Transmutation', 'Manipulate'),
  'Ignite Ambition':
    Pathfinder2E.SPELLS['Blind Ambition']
    .replace('Enchantment', 'Concentrate,Subtle') + ' ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Target suffers -4 to resist the triggering attempt to convince it to advance its ambitions (<b>save Will</b> inflicts -2 resistance; critical success negates; critical failure inflicts automatic compliance)"',
  'Competitive Edge':
    Pathfinder2E.SPELLS['Competitive Edge']
    .replace('Enchantment', 'Concentrate'),
  'Face In The Crowd':
    Pathfinder2E.SPELLS['Face In The Crowd']
    .replace('Illusion', 'Manipulate'),
  'Pulse Of Civilization':
    Pathfinder2E.SPELLS['Pulse Of The City']
    .replace('Divination', 'Concentrate,Manipulate') + ' ' +
    'Cast=2 ' +
    'Description=' +
      '"R25 miles; reveals information about settlements and gives +2 to Recall Knowledge and Gather Information about them for 8 hr (<b>heightened 5th</b> increases the range to 100 miles; <b>7th</b> increases the range to 500 miles and the bonus to +3)"',
  'Veil Of Confidence':
    Pathfinder2E.SPELLS['Veil Of Confidence']
    .replace('Enchantment', 'Concentrate')
    .replace('increases', 'decreases'),
  'Delusional Pride':
    Pathfinder2E.SPELLS['Delusional Pride']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Creative Splash':
    Pathfinder2E.SPELLS['Splash Of Art']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Artistic Flourish':
    Pathfinder2E.SPELLS['Artistic Flourish']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Cloak Of Shadow':
    Pathfinder2E.SPELLS['Cloak Of Shadow']
    .replace('Evocation', 'Manipulate,Aura'),
  'Darkened Sight':
    Pathfinder2E.SPELLS['Darkened Eyes']
    .replace('Transmutation', 'Concentrate,Manipulate') + ' ' +
    'Description="R60\' Target gains greater darkvision for 1 min"',
  "Death's Call":
    Pathfinder2E.SPELLS["Death's Call"]
    .replace('Necromancy', 'Concentrate'),
  'Eradicate Undeath':
    Pathfinder2E.SPELLS['Eradicate Undeath']
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace('Positive', 'Vitality'),
  'Cry Of Destruction':
    Pathfinder2E.SPELLS['Cry Of Destruction']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Destructive Aura':
    Pathfinder2E.SPELLS['Destructive Aura']
    .replace('Evocation', 'Concentrate,Manipulate,Aura'),
  'Sweet Dream':
    Pathfinder2E.SPELLS['Sweet Dream']
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace('for 9 min', 'for 59 min (<b>heightened 4th<b> gives +2 skill checks; <b>7th</b> gives +3 skill checks') + ' ' +
    'Cast=2',
  "Dreamer's Call":
    Pathfinder2E.SPELLS["Dreamer's Call"]
    .replace('Enchantment', 'Concentrate,Manipulate,Illusion')
    .replaceAll('flat-footed and ', ''),
  'Hurtling Stone':
    Pathfinder2E.SPELLS['Hurtling Stone']
    .replace('Evocation', 'Manipulate')
    .replace(/1d6.*HP/, '2d6 HP'),
  'Localized Quake':
    Pathfinder2E.SPELLS['Localized Quake']
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replace(/\(<b>save[^\)]*./, '(<b>save basic Reflex</b> also negates knocked prone)'),
  'Soothing Words':
    Pathfinder2E.SPELLS['Soothing Words']
    .replace('Enchantment', 'Concentrate')
    .replace('Mental', 'Manipulate')
    .replace('1 rd', '1 min'),
  'Unity':
    Pathfinder2E.SPELLS.Unity
    .replace('Abjuration', 'Concentrate'),
  'Read Fate':
    Pathfinder2E.SPELLS['Read Fate']
    .replace('Divination', 'Concentrate,Manipulate') + ' ' +
    'Cast=2',
  'Tempt Fate':
    Pathfinder2E.SPELLS['Tempt Fate']
    .replace('Divination', 'Manipulate'),
  'Fire Ray':
    Pathfinder2E.SPELLS['Fire Ray']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replaceAll('1d4 HP persistent fire', "1d6 HP to others in the target\'s square"),
  'Flame Barrier':
    Pathfinder2E.SPELLS['Flame Barrier']
    .replace('Abjuration', 'Concentrate'),
  'Unimpeded Stride':
    Pathfinder2E.SPELLS['Unimpeded Stride']
    .replace('Transmutation', 'Manipulate'),
  'Word Of Freedom':
    Pathfinder2E.SPELLS['Word Of Freedom']
    .replace('Enchantment', 'Concentrate'),
  "Healer's Blessing":
    Pathfinder2E.SPELLS["Healer's Blessing"]
    .replace('Necromancy', 'Concentrate'),
  'Rebuke Death':
    Pathfinder2E.SPELLS['Rebuke Death']
    .replace('Necromancy', 'Manipulate'),
  'Overstuff':
    Pathfinder2E.SPELLS.Overstuff
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Take Its Course':
    Pathfinder2E.SPELLS['Take Its Course']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Scholarly Recollection':
    Pathfinder2E.SPELLS['Scholarly Recollection']
    .replace('Divination', 'Concentrate'),
  'Know The Enemy':
    Pathfinder2E.SPELLS['Know The Enemy']
    .replace('Divination', 'Manipulate'),
  'Bit Of Luck':
    Pathfinder2E.SPELLS['Bit Of Luck']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Lucky Break':
    Pathfinder2E.SPELLS['Lucky Break']
    .replace('Divination', 'Concentrate'),
  "Magic's Vessel":
    Pathfinder2E.SPELLS["Magic's Vessel"]
    .replace('Enchantment', 'Manipulate')
    .replace('level', 'rank'),
  'Mystic Beacon':
    Pathfinder2E.SPELLS['Mystic Beacon']
    .replace('Evocation', 'Manipulate'),
  'Athletic Rush':
    Pathfinder2E.SPELLS['Athletic Rush']
    .replace('Transmutation', 'Manipulate'),
  'Enduring Might':
    Pathfinder2E.SPELLS['Enduring Might']
    .replace('Abjuration', 'Manipulate'),
  'Moonbeam':
    Pathfinder2E.SPELLS.Moonbeam
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('1d6', '2d6'),
  'Touch Of The Moon':
    Pathfinder2E.SPELLS['Touch Of The Moon']
    .replace('Enchantment', 'Manipulate'),
  'Vibrant Thorns':
    Pathfinder2E.SPELLS['Vibrant Thorns']
    .replace('Transmutation', 'Manipulate,Wood')
    .replaceAll('positive', 'vitality'),
  "Nature's Bounty":
    Pathfinder2E.SPELLS["Nature's Bounty"]
    .replace('Conjuration', 'Manipulate')
    .replace('Positive', 'Vitality'),
  'Waking Nightmare':
    Pathfinder2E.SPELLS['Waking Nightmare']
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace('frightened 2', 'frightened 2 and +1 HP mental from successful Strikes')
    .replace('fleeing', 'paralyzed'),
  'Shared Nightmare':
    Pathfinder2E.SPELLS['Shared Nightmare']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Savor The Sting':
    Pathfinder2E.SPELLS['Savor The Sting']
    .replace('Enchantment', 'Manipulate'),
  'Retributive Pain':
    Pathfinder2E.SPELLS['Retributive Pain']
    .replace('Abjuration', 'Manipulate'),
  'Charming Touch':
    Pathfinder2E.SPELLS['Retributive Pain']
    .replace('Enchantment', 'Manipulate'),
  'Captivating Adoration':
    Pathfinder2E.SPELLS['Retributive Pain']
    .replace('Enchantment', 'Concentrate,Manipulate,Aura'),
  'Perfected Mind':
    Pathfinder2E.SPELLS['Perfected Mind']
    .replace('Abjuration', 'Concentrate'),
  'Perfected Body':
    Pathfinder2E.SPELLS['Perfected Form'] + ' ' +
    'Traits=Focus,Uncommon,Cleric,Concentrate' + ' ' +
    'Description="Improves the triggering save result vs. a physical effect from critical failure to failure or from failure to success"',
  "Protector's Sacrifice":
    Pathfinder2E.SPELLS["Protector's Sacrifice"]
    .replace('Abjuration', 'Manipulate'),
  "Protector's Sphere":
    Pathfinder2E.SPELLS["Protector's Sphere"]
    .replace('Abjuration', 'Concentrate,Manipulate,Aura'),
  'Whispering Quiet':
    Pathfinder2E.SPELLS['Forced Quiet']
    .replace('Abjuration', 'Manipulate,Sonic') + ' ' +
    'Description=' +
      '"R60\' 15\' burst mutes speech, requiring others over 5\' away to succeed on a DC %{spellDifficultyClass.%tradition} Perception to hear, for 1 min"',
  'Safeguard Secret':
    Pathfinder2E.SPELLS['Safeguard Secret']
    .replace('Abjuration', 'Concentrate,Manipulate')
    .replace('R10', 'R30') + ' ' +
    'Cast=2',
  'Dazzling Flash':
    Pathfinder2E.SPELLS['Dazzling Flash']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Vital Luminance':
    Pathfinder2E.SPELLS['Positive Luminance']
    .replace('Necromancy', 'Concentrate,Manipulate,Aura')
    .replace('Positive', 'Vitality') + ' ' +
    'Description=' +
      '"30\' light emanation inflicts 2 HP vitality on successful undead attackers, increasing by 2 HP each rd for 1 min; self may end the spell early to heal a living creature or damage an undead creature by double the current damage HP (<b>heightened +1</b> inflicts +0.5 HP initially and for each increase)"',
  'Agile Feet':
    Pathfinder2E.SPELLS['Agile Feet']
    .replace('Transmutation', 'Manipulate'),
  "Traveler's Transit":
    Pathfinder2E.SPELLS["Traveler's Transit"]
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Sudden Shift':
    Pathfinder2E.SPELLS['Sudden Shift'] + ' ' +
    'Traits=Focus,Uncommon,Cleric,Manipulate',
  "Trickster's Twin":
    Pathfinder2E.SPELLS["Trickster's Twin"]
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Word Of Truth':
    Pathfinder2E.SPELLS['Word Of Truth']
    .replace('Divination', 'Concentrate')
    .replace('Causes', 'Gives +2 Diplomacy and causes'),
  'Glimpse The Truth':
    Pathfinder2E.SPELLS['Glimpse The Truth']
    .replace('Divination', 'Manipulate,Aura'),
  'Touch Of Obedience':
    Pathfinder2E.SPELLS['Touch Of Obedience']
    .replace('Enchantment', 'Manipulate') + ' ' +
    'Description=' +
      '"Touch inflicts stupefied 2 until the end of the next turn (<b>save Will</b> inflicts stupefied 1 until the end of the next turn; critical success negates; critical failure inflicts stupefied 2 for 1 min and prone)"',
  'Commanding Lash':
    Pathfinder2E.SPELLS['Commanding Lash']
    .replace('Enchantment', 'Concentrate,Manipulate')
    .replace('Incapacitation', 'Linguistic')
    .replace('negates', '(-2 if frightened, stupefied, or suffering persistent damage) negates'),
  'Touch Of Undeath':
    Pathfinder2E.SPELLS['Touch Of Undeath']
    .replace('Necromancy', 'Manipulate')
    .replace('Negative', 'Void')
    .replace('negative', 'void'),
  'Malignant Sustenance':
    Pathfinder2E.SPELLS['Malignant Sustenance']
    .replace('Necromancy', 'Concentrate,Manipulate')
    .replace('Negative', 'Void'),
  'Tidal Surge':
    Pathfinder2E.SPELLS['Tidal Surge']
    .replace('Evocation', 'Manipulate') + ' ' +
    'Description=' +
      '"R60\' Moves the target 10\' over ground or 20\' in water (<b>save Fortitude</b> negates)"',
  'Downpour':
    Pathfinder2E.SPELLS.Downpour
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Appearance Of Wealth':
    Pathfinder2E.SPELLS['Appearance Of Wealth']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Precious Metals':
    Pathfinder2E.SPELLS['Precious Metals']
    .replace('Transmutation', 'Concentrate,Metal')
    .replace('<b>', '<b>heightened +1</b> gives +2 Hardness; <b>'),
  'Weapon Surge':
    Pathfinder2E.SPELLS['Weapon Surge']
    .replace('Evocation', 'Manipulate,Sanctified') + ' ' +
    'Description=' +
      '"Held weapon gains +1 attack and +1d6 HP spirit on the next attack before the start of the next turn (<b>heightened 5th</b> gives +1d6 HP; <b>9th</b> gives +1d6 HP)"',
  'Zeal For Battle':
    Pathfinder2E.SPELLS['Zeal For Battle']
    .replace('Enchantment', 'Concentrate'),

  'Primal Summons':
    Pathfinder2E.SPELLS['Primal Summons']
    .replace('Conjuration', 'Concentrate')
    .replace('fire"', 'fire; +1d6 HP electricity damage and resistance 5 to electricity; a 30\' climb Speed and resistance 2 to bludgeoning and piercing"'),
  'Heal Animal':
    Pathfinder2E.SPELLS['Heal Animal']
    .replace('Necromancy', 'Manipulate'),
  'Cornucopia':
    Pathfinder2E.SPELLS.Goodberry
    .replace('Necromancy', 'Concentrate,Manipulate,Plant,Vitality'),
  'Impaling Briars':
    Pathfinder2E.SPELLS['Impaling Briars']
    .replace('Conjuration', 'Concentrate,Manipulate,Wood') + ' ' +
    'Cast=3',
  'Storm Lord':
    Pathfinder2E.SPELLS['Storm Lord']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Stormwind Flight':
    Pathfinder2E.SPELLS['Stormwind Flight']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Tempest Surge':
    Pathfinder2E.SPELLS['Tempest Surge']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Untamed Form':
    Pathfinder2E.SPELLS['Wild Shape']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Untamed Shift':
    Pathfinder2E.SPELLS['Wild Morph']
    .replace('Transmutation', 'Concentrate,Manipulate')
    .replaceAll(/ \(requires[^\)]*./g, ''),

  'Gravity Weapon':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Ranger ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"First Strike each rd gains a damage bonus equal to twice the number of damage dice"',
  'Heal Companion':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Ranger,Healing,Vitality ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Touch restores 1d10 HP to companion, or using 2 actions gives R30\' and restores 1d10+8 HP (<b>heightened +1</b> restores +1d10 HP or +1d10+8 HP)"',
  'Magic Hide':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Ranger,Manipulate ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description="R30\' Gives companion +1 Armor Class for 1 min"',
  'Animal Feature':
    'Level=2 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Manipulate,Morph ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"Self gains low-light vision, claws that inflict 1d6 HP slashing, or jaws that inflict 1d8 HP piercing for 1 min (<b>heightened 4th</b> allows choosing %{speed}\' swim or fly Speed or darkvision)"',
  'Enlarge Companion':
    'Level=2 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Manipulate,Polymorph ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="' +
      QuilvynUtils.getAttrValue(Pathfinder2E.SPELLS.Enlarge, 'Description')
      .replace('Willing target', 'Companion')
      .replace('5 min', '1 min')
      .replace(/; <b>8th[^\)]*/, '') + '"',
  "Hunter's Luck":
    'Level=2 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Fortune ' +
    'Traditions=Primal ' +
    'Cast=Free ' +
    'Description=' +
      '"Gives the better of two rolls on a Recall Knowledge check about a creature"',
  'Soothing Mist':
    'Level=2 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Manipulate,Healing,Vitality ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Restores 2d8 HP and removes one source of persistent damage to a living creature, or inflicts 2d8 HP vitality and 2 HP persistent vitality to an undead target"',
  'Ephemeral Tracking':
    'Level=3 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Manipulate ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows DC 30+ checks to track through air and water for 1 hr"',
  "Ranger's Bramble":
    'Level=3 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Manipulate,Plant ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description="' +
      QuilvynUtils.getAttrValue(Pathfinder2E.SPELLS.Entangle, 'Description')
      .replace("120' 20", "100' 5")
      .replace('for 1 rd', 'for 1 rd and 2d4 HP persistent bleed) (<b>heightened +1</b> inflicts +1d4 persistent bleed') + '"',
  "Hunter's Vision":
    'Level=5 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate ' +
    'Traditions=Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Self and led companions ignore penalties from lighting, concealed, and invisible status on target for 10 min"',
  'Terrain Transposition':
    'Level=5 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Manipulate,Teleportation ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Teleports self and adjacent animal companion 90\', or 180\' in favored terrain"',

  'Blood Ward':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target gains +1 Armor Class and saves vs. choice of creature type while sustained for up to 1 min (<b>heightened 5th</b> gives +2 bonus"',
  'Cackle':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Curse,Death,Hex,Manipulate,Void ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="Sustains an active spell"',
  'Curse Of Death':
    'Level=5 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Curse,Death,Hex,Manipulate,Void ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Target suffers a curse at stage 1, which inflicts 4d6 HP void and fatigued while sustained for up to 1 min; subsequent failures after 1 rd inflict 8d6 HP void at stage 2, 12d6 HP void at stage 3, and death at stage 4 (<b>save Fortitude</b> inflicts stage 1 with no further saves; critical success negates; critical failure inflicts stage 2) (<b>heightened +1 inflicts +1d6 HP void)"',
  "Deceiver's Cloak":
    'Level=3 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Hex,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description="' +
      QuilvynUtils.getAttrValue(Pathfinder2E.SPELLS['Illusory Disguise'], 'Description')
      .replace('for 1 hr', 'while sustained up to 1 hr')
      .replace(' (heightened 2nd</b>', ';')
      .replace('; <b>3rd</b>', ' and')
      .replace(/\)$/, ' (<b>heightened 6th</b> allows copying any creature of the same size</b>)"'),
  'Elemental Betrayal':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Hex ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts weakness 2 to choice of element while sustained for up to 1 min (<b>heightened +2</b> inflicts weakness +1)"',
  'Life Boost':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Healing,Hex,Manipulate,Vitality ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives fast healing 2 for 4 rd (<b>heightened +1</b> gives fast healing +2)"',
  'Malicious Shadow':
    'Level=3 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Hex,Manipulate,Shadow ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Successful attacks by the target\'s shadow inflict 1d10+%{spellModifier.%tradition} HP of choice of damage type on target each rd while sustained for up to 1 min (<b>heightened +2</b> inflicts +1d10 HP)"',
  'Needle Of Vengeance':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Hex,Manipulate,Mental ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target suffers 2 HP mental <b>save basic Will</b>) whenever it attacks the named creature while sustained for up to 1 min (<b>heightened +1</b> inflicts +2 HP)"',
  "Patron's Puppet":
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Hex ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=Free ' +
    'Description="Allows Commanding of familiar at the beginning of a turn"',
  'Personal Blizzard':
    'Level=3 ' +
    'Traits=Uncommon,Focus,Witch,Cold,Hex ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target suffers 1d6 HP cold and 1d6 HP persistent cold while sustained for up to 1 min (<b>save Fortitude</b> inflicts initial cold only; critical success negates; critical failure inflicts 2d6 HP cold and 2d6 HP persistent cold) (<b>heightened +1</> inflicts +1 HP initial and persistent, or +2 on a critical save failure)"',
  'Phase Familiar':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Hex,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Gives familiar resistance 5 and immunity to precision damage on triggering damage (<b>heightened +1</b> gives resistance +2)"',
  'Restorative Moment':
    'Level=5 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Hex,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Decreases doomed and drained values by 1 and allows an additional save vs. afflictions once per target per day"',
  'Veil Of Dreams':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Hex,Manipulate,Mental ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts -1 Perception, attacks, and Will saves, -2 vs. sleep, and a DC 5 flat check to use a concentrate action while sustained for up to 1 min (<b>save Will</b> negates flat check; critical success negates)"',
  'Clinging Ice':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Cantrip,Cold,Hex,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts 1d4 HP cold and -5\' Speed while sustained for up to 1 min (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and -10\' Speed) (<b>heightened +1</b> inflicts +1d4 HP)"',
  'Discern Secrets':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Cantrip,Hex,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Give +1 on attempts to Recall Knowledge, Seek, or Sense Motive as free actions while sustained for up to 1 min (<b>heightened 5th</b> affects 2 targets)"',
  'Evil Eye':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Cantrip,Curse,Hex,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts sickened 1 that cannot be cured while sustained for up to 1 min (<b>save Will</b> negates; critical failure inflicts sickened 2)"',
  'Nudge Fate':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Cantrip,Concentrate,Hex ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives +1 to make a failed attack, skill check, or save into a success within 1 min"',
  'Shroud Of Night':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Cantrip,Hex,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts dim vision and concealment of other creatures while sustained for up to 1 min (<b>save Will</b> negates)"',
  'Stoke The Heart':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Emotion,Hex ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Gives +2 damage while sustained for up to 1 min (<b>heightened +2</b> gives +1 damage)"',
  'Wilding Word':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Cantrip,Hex ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target suffers -2 attack and sickened 1 when attacking self while sustained for up to 1 min (<b>save Will</b> negates sickened; critical success negates; critical failure inflicts sickened 2)"',

  'Protective Wards':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Wizard,Aura,Manipulate ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"5\' emanation gives allies +1 Armor Class while sustained for up to 1 min; each sustain increases the radius by 5\' up to 30\'"',
  'Rune Of Observation':
    'Level=4 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description="' +
      QuilvynUtils.getAttrValue(Pathfinder2E.SPELLS.Clairvoyance, 'Description')
      .replace('10 min', '1 hr') + '; spending Focus Points extends the spell for 1 hr each"',
  'Force Bolt':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Wizard,Force,Manipulate ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Inflicts 1d4+1 HP force (<b>heightened +2</b> inflicts +1d4+1 HP)"',
  'Energy Absorption':
    'Level=4 ' +
    'Traits=Uncommon,Focus,Wizard ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Gives resistance 15 to the triggering acid, cold, electricity, or fire damage (<b>heightened +1</b> gives resistance +5)"',
  'Fortify Summoning':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Summoned creature gains +1 checks, Armor Class, and DCs for 1 min"',
  'Spiral Of Horrors':
    'Level=4 ' +
    'Traits=Uncommon,Focus,Wizard,Aura,Concentrate,Emotion,Fear,Manipulate,Mental ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts irreducible frightened 1 while sustained for up to 1 min"',
  'Earthworks':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate,Earth,Manipulate ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"60\' 5\' burst (using 2 or 3 actions gives a 10\' or 15\' burst) inflicts difficult terrain for 1 min (<b>heightened 4th</b> inflicts difficult terrain for flying creatures)"',
  'Community Restoration':
    'Level=4 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate,Healing ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"Casting a spell on an ally gives self 2 temporary Hit Points per spell rank, plus an equal number to distribute among affected allies, for 1 min"',
  'Charming Push':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate,Incapacitation,Mental ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Prevents target from using hostile actions vs. self for 1 rd (<b>save Will</b> inflicts -1 attack and damage vs. self; critical success negates; critical failure also inflicts stunned 1)"',
  'Invisibility Cloak':
    'Level=4 ' +
    'Traits=Uncommon,Focus,Wizard,Illusion,Manipulate ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description="' +
      QuilvynUtils.getAttrValue(Pathfinder2E.SPELLS.Invisibility, 'Description')
      .replace('Touched', 'Self')
      .replace('10 min', '1 min')
      .replace(/\([^\)]*./, '(<b>heightened 6th</b> effects last for 10 min</b>; <b>8th</b> effect last for 1 hr)"'),
  'Scramble Body':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate,Manipulate ' +
    'Traditions=Arcane ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Inflicts sickened 1 (<b>save Fortitude</b> negates; critical failure inflicts sickened 2 and slowed 1 while sickened)"',
  'Shifting Form':
    'Level=4 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate,Morph ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Gives self choice of +20\' Speed, %{speed//2}\' climb or swim Speed, darkvision, 60\' imprecise scent, or claws that inflict 1d8 HP slashing, for 1 min"',
  'Hand Of The Apprentice':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Wizard,Attack,Manipulate ' +
    'Traditions=Arcane ' +
    'Cast=1 ' +
    'Description=' +
      '"Successful spell attack while throwing a melee weapon inflicts its base damage + %{spellModifier.%tradition}, or double HP and the weapon\'s critical specialization effect on a critical success; the weapon returns afterwards"',
  'Interdisciplinary Incantation':
    'Level=4 ' +
    'Traits=Uncommon,Focus,Wizard,Concentrate ' +
    'Traditions=Arcane ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R30\' Allows imitating the triggering spell cast until the end of the next turn once per 24 hr"',

  // Core 2

  'Animal Vision':
    Pathfinder2E.SPELLS['Animal Vision']
    .replace('Divination', 'Concentrate,Manipulate'),
  'Animated Assault':
    'Level=2 ' +
    'Traits=Concentrate,Manipulate ' +
    'Traditions=Arcane,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R120\' Loose objects in a 10\' burst inflict 2d10 HP bludgeoning initially and 1d10 HP bludgeoning on subsequent rd while sustained for up to 1 min (<b>save basic Reflex</b>) (<b>heightened +2</b> inflicts +2d10 HP initially and +1d10 HP when sustained)"',
  'Anointed Ground':
    Pathfinder2E.SPELLS['Sanctified Ground']
    .replace('Abjuration', 'Concentrate,Manipulate'),
  'Bestial Curse':
    'Level=4 ' +
    'Traits=Concentrate,Curse,Manipulate,Polymorph ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers clumsy 1, requires a successful DC 5 flat check for manipulate actions, and gains a claw, hoof, horn, or jaws Strike for 1 hr (<b>save Fortitude</b> only inflicts clumsy 1 for 1 rd; critical success negates; critical failure effects are permanent)"',
  'Blanket Of Stars':
    'Level=6 ' +
    'Traits=Concentrate,Illusion,Manipulate ' +
    'Traditions=Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Gives self +2 Stealth to Hide and Sneak and invisibility or concealment when still or moving beneath a starry sky, and inflicts dazzled for 1 rd on adjacent creatures (<b>save Will negates; critical failure also inflicts confused</b) for 10 min"',
  'Blinding Fury':
    'Level=6 ' +
    'Traits=Concentrate,Curse,Emotion,Incapacitation,Mental ' +
    'Traditions=Divine,Occult,Primal ' +
    'Cast=Reaction ' +
    'Description=' +
      '"R60\' Makes self hidden from the triggering attacker for 1 rd after every damaging attack for 1 min (<b>save Will</b> effects last for 1 rd; critical success negates; critical failure effects are permanent and also affect the target\'s perception of other creatures)"',
  'Blister':
    'Level=5 ' +
    'Traits=Concentrate,Manipulate ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R60\' Allows self to create 2 15\' cones from target that each inflict 7d6 HP acid (<b>save basic Fortitude</b>) anytime within 1 min (<b>save Fortitude</b> allows 1 cone; critical success negates; critical failure allows 4 cones)"',
  'Blistering Invective':
    'Level=1 ' +
    'Traits=Auditory,Cantrip,Concentrate,Illusion,Manipulate ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Allows self voice to be heard up to 500\' away, giving +1 Coerce and auditory Perform in large venues (<b>heightened 5th</b> extends voice to 1200\'; <b>7th</b> extends voice to 1 mile)"',
  'Carryall':
    Pathfinder2E.SPELLS['Floating Disk']
    .replace('Conjuration', 'Concentrate,Manipulate')
    .replace(/"$/, ' (<b>heightened 4th</b> allows carrying passengers and 10 Bulk"'),
  'Chameleon Coat':
    'Level=5 ' +
    'Traits=Concentrate,Illusion,Manipulate ' +
    'Traditions=Primal ' +
    'Cast=3 ' +
    'Description=' +
      '"R15\' 8 targets gain +3 Stealth and Hide for 10 min; shedding gear or clothes ends the spell for that target (<b>heightened 6th</b> makes critical failures on Sneak vs. creatures within 30\' into normal failures; <b>8th</b> gives +4 Stealth and Hide)"',
  'Charitable Urge':
    'Level=2 ' +
    'Traits=Concentrate,Incapacitation,Manipulate,Mental ' +
    'Traditions=Arcane,Divine,Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Compels the target to give a possession to the nearest creature (<b>save Will</b> inflicts stunned 1; critical success negates; critical failure effects last for 4 rd or until a successful save)"',
  'Chilling Spray':
    'Level=1 ' +
    'Traits=Cold,Concentrate,Manipulate ' +
    'Traditions=Arcane,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"15\' code inflicts 2d4 HP cold and -5\' Speed for 2 rd (<b>save Reflex</b> inflicts half HP only; critical success negates; critical failure inflicts double HP and -10\' Speed)"',
  'Chroma Leach':
    'Level=4 ' +
    'Traits=Concentrate,Manipulate ' +
    'Traditions=Occult,Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"Touched suffers enfeebled 2 for 1 min and drained 1 and must succeed on a Will save to move for 1 rd (<b>save Fortitude</b> only inflicts enfeebled 2 for 1 rd; critical success negates; critical failure inflicts enfeebled 2 permanently and drained 2)"',
  'Cloak Of Colors':
    Pathfinder2E.SPELLS['Cloak Of Colors']
    .replace('Illusion', 'Concentrate,Manipulate'),

  // Champion
  'Lay On Hands':
    Pathfinder2E.SPELLS['Lay On Hands']
    .replace('Necromancy', 'Manipulate')
    .replace('Positive', 'Vitality'),
  'Touch Of The Void':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Champion,Manipulate,Void ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="' +
      QuilvynUtils.getAttrValue(Pathfinder2E.SPELLS['Lay On Hands'], 'Description')
      .replace('Touched', 'Touched undead')
      .replace('touched undead', 'touched living') + '"',
  'Shields Of The Spirit':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Champion,Concentrate,Sanctified,Spirit ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"While shield is raised, self aura gives allies +1 Armor Class and inflicts 1d4 HP spirit on attacking foes for 1 rd (<b>heightened +2</b> inflicts +1d4 HP)"',
  "Champion's Sacrifice":
    Pathfinder2E.SPELLS["Champion's Sacrifice"]
    .replace('Abjuration', 'Manipulate'),
  "Hero's Defiance":
    Pathfinder2E.SPELLS["Hero's Defiance"]
    .replace('Necromancy', 'Concentrate')
    .replace('Positive', 'Vitality')
    .replace('10d4', '6d8'),
  'Spectral Advance':
    'Level=5 ' +
    'Traits=Uncommon,Focus,Champion,Concentrate,Polymorph,Spirit ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description=' +
      '"Allows self to Stride (using 2 actions gives 2 Strides) without triggering reactions, ignoring greater difficult terrain, and with resistance %{level} to all damage while moving"',

  // Monk
  'Inner Upheaval':
    Pathfinder2E.SPELLS['Ki Strike']
    .replace('Transmutation', 'Concentrate')
    .replace('lawful, negative, or positive', 'spirit, vitality, or void'),
  'Qi Rush':
    Pathfinder2E.SPELLS['Ki Rush']
    .replace('Transmutation', 'Concentrate'),
  'Qi Blast':
    Pathfinder2E.SPELLS['Ki Blast']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Shrink The Span':
    Pathfinder2E.SPELLS['Abundant Step']
    .replace('Conjuration', 'Manipulate') + ' ' +
    'Level=3',
  "Medusa's Wrath":
    'Level=8 ' +
    'Traits=Uncommon,Focus,Monk,Concentrate,Manipulate '  +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"Unarmed Strike inflicts slowed 1, or slowed 2 on a critical success; subsequent successful or failed Fortitude reduce or increase the slowed condition by 1, or by 2 on a critical failure"',
  'Touch Of Death':
    Pathfinder2E.SPELLS['Quivering Palm']
    .replace('Necromancy', 'Concentrate,Manipulate'),
  'Harmonize Self':
    Pathfinder2E.SPELLS['Wholeness Of Body']
    .replace('Necromancy', 'Concentrate')
    .replace('Positive', 'Vitality'),
  "Shadow's Web":
    'Level=7 ' +
    'Traits=Uncommon,Focus,Monk,Concentrate,Manipulate ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts 14d4 HP void and enfeebled 2 for 1 rd (<b>save Fortitude</b> inflicts half HP and enfeebled 1 for 1 rd; critical success negates; critical failure inflicts double HP, stunned 1, enfeebled 2 for 1 rd, and immobilized for 1 rd)"',
  'Wild Winds Stance':
    Pathfinder2E.SPELLS['Wild Winds Stance']
    .replace('Evocation', 'Manipulate'),
  'Wind Jump':
    Pathfinder2E.SPELLS['Wind Jump']
    .replace('Transmutation', 'Concentrate'),

  // Sorcerer
  'Tentacular Limbs':
    Pathfinder2E.SPELLS['Tentacular Limbs']
    .replace('Transmutation', 'Manipulate'),
  'Aberrant Whispers':
    Pathfinder2E.SPELLS['Aberrant Whispers']
    .replace('Enchantment', 'Concentrate'),
  'Unusual Anatomy':
    Pathfinder2E.SPELLS['Aberrant Whispers']
    .replace('Transmutation', 'Manipulate'),
  'Angelic Halo':
    Pathfinder2E.SPELLS['Angelic Halo']
    .replace('Abjuration', 'Concentrate')
    .replace('Good', 'Holy'),
  'Angelic Wings':
    Pathfinder2E.SPELLS['Angelic Wings']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Celestial Brand':
    Pathfinder2E.SPELLS['Celestial Brand']
    .replace('Necromancy', 'Manipulate')
    .replace('evil', 'unholy')
    .replace('HP good', 'HP spirit')
    .replaceAll('good', 'holy'),
  "Glutton's Jaws":
    Pathfinder2E.SPELLS["Glutton's Jaws"] + ' ' +
    'Cast=2 ' +
    'Traits=Uncommon,Focus,Sorcerer,Attack,Concentrate,Manipulate ' +
    'Description=' +
      '"Spell attack inflicts 2d6 HP piercing, giving self 1d4 temporary HP for 1 rd (<b>heightened +2</b> inflicts +2d6 HP and gives +1d4 temporary HP</b>)"',
  'Swamp Of Sloth':
    Pathfinder2E.SPELLS['Swamp Of Sloth']
    .replace('Conjuration', 'Concentrate,Manipulate'),
  'Cnthonian Wrath':
    Pathfinder2E.SPELLS['Abyssal Wrath']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Diabolic Edict':
    Pathfinder2E.SPELLS['Diabolic Edict']
    .replace('Enchantment', 'Concentrate'),
  'Embrace The Pit':
    Pathfinder2E.SPELLS['Embrace The Pit']
    .replace('Transmutation', 'Concentrate')
    .replace(',Evil', '')
    .replaceAll('evil, fire,', 'fire')
    .replaceAll(/, and weakness \S+ to good,?/g, ''),
  'Hellfire Plume':
    Pathfinder2E.SPELLS['Hellfire Plume']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('Evil', 'Spirit')
    .replaceAll('evil', 'spirit'),
  'Flurry Of Claws':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Sorcerer,Attack,Concentrate,Manipulate ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Successful spell attack inflicts 1d8 HP slashing plus 1d4 HP %{\'%tradition\'==\'Arcane\'?\'force\':\'%tradition\'==\'Divine\'?\'spirit\':\'%tradition\'==\'Occult\'?\'mental\':\'fire\'} on 2 targets within 10\' of each other (<b>heightened +1</b> inflicts +1d8 HP slashing and +1d4 HP additional)"',
  'Dragon Breath':
    Pathfinder2E.SPELLS['Dragon Breath']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replaceAll(/draconicColor[^:]*:/g, ''),
  'Dragon Wings':
    Pathfinder2E.SPELLS['Dragon Wings']
    .replace('Transmutation', 'Concentrate,Manipulate'),
  'Elemental Toss':
    Pathfinder2E.SPELLS['Elemental Toss']
    .replace('Evocation', 'Manipulate'),
  'Elemental Motion':
    Pathfinder2E.SPELLS['Elemental Motion']
    .replace('Evocation', 'Concentrate,Manipulate')
    .replace('(Earth)', "(Earth)'||$$'features.Elemental (Metal)")
    .replace('{', "{$$'features.Elemental (Wood)'?(speed+\\\"' climb Speed\\\"):"),
  'Elemental Blast':
    Pathfinder2E.SPELLS['Elemental Blast']
    .replace('Evocation', 'Concentrate,Manipulate'),
  'Faerie Dust':
    Pathfinder2E.SPELLS['Faerie Dust']
    .replace('Enchantment', 'Concentrate,Manipulate'),
  'Fey Disappearance':
    Pathfinder2E.SPELLS['Fey Disappearance']
    .replace('Enchantment', 'Manipulate'),
  'Fey Glamour':
    Pathfinder2E.SPELLS['Fey Glamour']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  'Jealous Hex':
    Pathfinder2E.SPELLS['Jealous Hex']
    .replace('Necromancy', 'Concentrate'),
  'Horrific Visage':
    Pathfinder2E.SPELLS['Jealous Hex']
    .replace('Traits=', 'Traits=Concentrate,Manipulate,'),
  "You're Mine":
    Pathfinder2E.SPELLS["You're Mine"]
    .replace('Enchantment','Concentrate,Manipulate'),
  'Ancestral Memories':
    Pathfinder2E.SPELLS['Ancestral Memories']
    .replace('Divination', 'Concentrate') + ' ' +
    'Description=' +
      '"R60\' Self gains +1 on the next spell attack or target suffers -1 on its next save before the end of the turn (<b>heightened 5th</b> gives or inflicts +2 or -2; <b>8th</b> gives or inflicts +3 or -3)"',
  'Extend Blood Magic':
    'Level=3 ' +
    'Traits=Uncommon,Focus,Sorcerer,Concentrate,Spellshape ' +
    'Cast=1 ' +
    'Description=' +
      '"Extends the blood magic effect from a subsequent spell by 1 rd"',
  'Arcane Countermeasure':
    Pathfinder2E.SPELLS['Arcane Countermeasure']
    .replace('Abjuration', 'Manipulate'),
  "Undeath's Blessing":
    Pathfinder2E.SPELLS["Undeath's Blessing"]
    .replace('Necromancy', 'Manipulate')
    .replace('Negative', 'Void'),
  'Drain Life':
    Pathfinder2E.SPELLS['Drain Life']
    .replace('Necromancy', 'Manipulate')
    .replace('Negative', 'Void'),
  'Grasping Grave':
    Pathfinder2E.SPELLS['Grasping Grave']
    .replace('Necromancy', 'Concentrate,Manipulate')

};
for(let s in Pathfinder2ERemaster.SPELLS)
  Pathfinder2ERemaster.SPELLS[s] =
    Pathfinder2ERemaster.SPELLS[s].replace(/School=\w*/, '');
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
  QuilvynUtils.checkAttrTable(heritages, ['Traits', 'Selectables']);
  Pathfinder2E.identityRules
    (rules, {}, ancestries, backgrounds, classes, deities);
  for(let h in heritages)
    rules.choiceRules(rules, 'Heritage', h, heritages[h]);
};

/* Defines rules related to magic use. */
Pathfinder2ERemaster.magicRules = function(rules, spells) {
  Pathfinder2E.magicRules(rules, spells);
};

/* Defines rules related to character aptitudes. */
Pathfinder2ERemaster.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  for(let f in feats)
    if(feats[f] == null)
      console.log(f);
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
      QuilvynUtils.getAttrValueArray(attrs, 'Traits'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables')
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
  let prefix = name.charAt(0) + name.substring(1).replaceAll(' ', '');
  selectables = rules.getChoices('selectableFeatures');
  // This duplicates code in heritageRules; replicating it here ensures that
  // versatile heritages work with homebrew heritages
  for(let s in selectables) {
    if(s.includes('Versatile Heritage') && !selectables[s].includes(name)) {
      rules.defineRule(prefix + 'HeritageCount',
        'features.' + s, '+=', 'dict.ancestry=="' + name + '" ? 1 : null'
      );
      selectables[s] =
        selectables[s].replace('Type=', 'Type="' + name + ' (Heritage)",');
    }
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
  } else if(name == 'Elf') {
    rules.defineRule
      ('multiclassLevelRequirementsWaived', 'features.Ancient Elf', '=', '1');
  } else if(name == 'Gnome') {
    // Make sure there's a featCount.Skill to increment
    rules.defineRule('featCount.Skill', 'features.Gnome Obsession', '^=', '0');
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
  let classLevel = 'levels.' + name;
  if(name == 'Alchemist') {
    // Suppress legacy note
    rules.defineRule('skillNotes.perpetualInfusions', '', '=', 'null');
  } else if(name == 'Champion') {
    rules.defineRule('combatNotes.blessedShield',
      'classLevel', '=', 'source<13 ? 3 : source<20 ? 5 : 7'
    );
    rules.defineRule('combatNotes.blessedShield.1',
      'features.Blessed Shield', '?', null,
      'classLevel', '=', 'source<7?44:source<10?52:source<13?64:source<16?80:source<19?84:108'
    );
    rules.defineRule('featureNotes.blessingOfTheDevoted',
      '', '=', '1',
      'featureNotes.secondBlessing', '+', '1'
    );
    // TODO Might have to revisit for archetypes
    rules.defineRule
      ("features.Champion's Reaction", 'features.Cause', '=', '1');
    rules.defineRule('selectableFeatureCount.Champion (Blessing Of The Devoted)',
      'featureNotes.blessingOfTheDevoted', '=', null
    );
    rules.defineRule('selectableFeatureCount.Champion (Key Attribute)',
      'featureNotes.championKeyAttribute', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Champion (Sanctification)',
      // TODO Might have to revisit for archetypes
      'levels.Champion', '?', null,
      'featureNotes.sanctification', '=', '1'
    );
    rules.defineRule('shieldHardness', 'combatNotes.blessedShield', '+', null);
    rules.defineRule
      ('shieldHitPoints', 'combatNotes.blessedShield.1', '+', null);
    // Suppress legacy feature
    rules.defineRule('featureNotes.divineAlly', classLevel, '?', null);
  } else if(name == 'Cleric') {
    rules.defineRule('selectableFeatureCount.Cleric (Sanctification)',
      // TODO Might have to revisit for archetypes
      'levels.Cleric', '?', null,
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
  } else if(name == 'Investigator') {
    rules.defineRule('selectableFeatureCounts.Investigator (Methodology)',
      'featureNotes.methodology', '=', '1'
    );
    rules.defineRule('skillNotes.investigatorSkills',
      'intelligenceModifier', '=', '4 + source'
    );
  } else if(name == 'Ranger') {
    rules.defineRule('selectableFeatureCount.Ranger (Key Attribute)',
      'featureNotes.rangerKeyAttribute', '=', '1'
    );
  } else if(name == 'Monk') {
    rules.defineRule('selectableFeatureCount.Monk (Key Attribute)',
      'featureNotes.monkKeyAttribute', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Monk (Qi Tradition)',
      'featureNotes.qiTradition', '=', null
    );
  } else if(name == 'Oracle') {
    rules.defineRule('selectableFeatureCount.Oracle (Mystery)',
      'featureNotes.mystery', '=', null
    );
  } else if(name == 'Rogue') {
    rules.defineRule('selectableFeatureCount.Rogue (Key Attribute)',
      'featureNotes.rogueKeyAttribute', '=', '1'
    );
  } else if(name == 'Sorcerer') {
    rules.defineRule('bloodlineDamage',
      'features.Elemental (Air)', '=', '"slashing"',
      'features.Elemental (Metal)', '=', '"piercing"',
      'features.Elemental (Wood)', '=', '"bludgeoning"'
    );
  } else if(name == 'Swashbuckler') {
    rules.defineRule('selectableFeatureCount.Swashbuckler (Style)',
      "featureNotes.swashbuckler'sStyle", '=', '1'
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
  if(name == 'Advanced Efficient Alchemy') {
    rules.defineRule('skillNotes.advancedAlchemy',
      'skillNotes.advancedEfficientAlchemy', '=', 'null' // italics
    );
  } else if(name == 'Angelkin') {
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
  } else if(name == 'Efficient Alchemy') {
    rules.defineRule('skillNotes.advancedAlchemy',
      'skillNotes.efficientAlchemy', '=', 'null' // italics
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
  } else if(name == 'Greater Mercy') {
    rules.defineRule('magicNotes.mercy(Body)',
      'magicNotes.greaterMercy', '=', 'null' // italics
    );
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
  } else if(name == 'Interweave Dispel') {
    rules.defineRule('knowsDispelMagicSpell',
      'spells.Dispel Magic (A2)', '=', '1',
      'spells.Dispel Magic (D2)', '=', '1',
      'spells.Dispel Magic (O2)', '=', '1',
      'spells.Dispel Magic (P2)', '=', '1'
    );
  } else if(name == 'Invulnerable Rager') {
    rules.defineRule('combatNotes.invulnerableRager',
      'rank.Medium Armor', '=', 'source==4 ? "Legendary" : source==3 ? "Master" : source==2 ? "Expert" : null'
    );
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
  } else if(name.match(/^Mercy \(.*\)$/)) {
    rules.defineRule('features.Mercy', 'features.' + name, '=', '1');
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
 * Defines in #rules# the rules associated with versatile heritage #name#,
 * which has the list of traits #traits#.
 */
Pathfinder2ERemaster.heritageRules = function(
  rules, name, traits, selectables
) {

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let heritageLevel = prefix + 'Level';

  Pathfinder2E.featureListRules
    (rules, ['1:' + name + ':Heritage'], 'Versatile Heritage', heritageLevel,
     true);
  Pathfinder2E.featureListRules(rules, selectables, name, heritageLevel, true);
  rules.defineRule(heritageLevel,
    'features.' + name, '?', null,
    'level', '=', null
  );

  selectables = rules.getChoices('selectableFeatures');
  let s = QuilvynUtils.getKeys(selectables, 'Versatile Heritage.*' + name)[0];
  rules.addChoice('selectableHeritages', s, selectables[s]);
  rules.defineRule
    ('heritage', 'features.' + name, '=', '"' + name + ' " + dict.ancestry');
  for(let a in rules.getChoices('ancestrys')) {
    if(!selectables[s].includes(a)) {
      let prefix =
        a.charAt(0).toLowerCase() + a.substring(1).replaceAll(' ', '');
      rules.defineRule(prefix + 'HeritageCount',
        'features.' + name, '+=', 'dict.ancestry=="' + a + '" ? 1 : null'
      );
      selectables[s] =
        selectables[s].replace('Type=', 'Type="' + a + ' (Heritage)",');
    }
  }

};

/*
 * Defines in #rules# the rules associated with versatile heritage #name# that
 * cannot be derived directly from the attributes passed to heritageRules.
 */
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
       ], 'Draconic Exemplar', 'dragonbloodLevel', true);
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
  if(traits.includes('Monk') && group == 'Bow')
    rules.defineRule
     ('trainingLevel.' + name, 'trainingLevel.Monk Bows', '^=', null);
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
