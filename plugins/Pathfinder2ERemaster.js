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
    'Speed=25 ' +
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
    'Speed=25 ' +
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
    'Speed=25 ' +
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
    'Speed=25 ' +
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
    'Speed=25 ' +
    'Features=' +
      '"1:Attribute Boost (Strength; Intelligence; Choose 1 from any)",' +
      '"1:Attribute Flaw (Wisdom)",' +
      '"1:Bite","1:Low-Light Vision","1:Kholo Heritage" ' +
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
    'Speed=25 ' +
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
    'Speed=25 ' +
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
    'Speed=25 ' +
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
    'Speed=25 ' +
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
    'Speed=25 ' +
    'Features=' +
      '"1:Attribute Boost (Dexterity; Wisdom; Choose 1 from any)",' +
      '"1:Attribute Flaw (Strength)",' +
      '"1:Small",' +
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
      // NOTE: Deity Lore, not deitySkill
      '"1:Skill Trained (Religion; Choose 1 from any Deity Lore)",' +
      '"1:Pilgrim\'s Token"',
  'Refugee':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Constitution, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Society; Choose 1 from any Settlement Lore)",' +
      '"1:Streetwise"',
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
      '"1:Fascinating Performance"',
  // Rare backgrounds, pg 51
  'Amnesiac':
    'Features=' +
      '"1:Attribute Boost (Choose 3 from any)"',
  'Blessed':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Charisma, Wisdom; Choose 1 from any)",' +
      '"1:Skill Trained (Choose 1 from any Deity Lore)",' +
      '"1:Blessed Blessing"',
  'Cursed':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Charisma, Intelligence; Choose 1 from any)",' +
      '"1:Skill Trained (Occultism; Curse Lore)",' +
      '"1:Warding Sign"',
  'Feral Child':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Strength, Dexterity, Constitution)",' +
      '"1:Skill Trained (Nature; Survival)",' +
      '"1:Low-Light Vision","1:Feral Scent","1:Forager"',
  'Feybound':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Dexterity, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Fey Lore)",' +
      '"1:Anathema","1:Fey\'s Fortune"',
  'Haunted':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Wisdom, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Occultism; Choose 1 from any)",' +
      '"1:Haunted Skill"',
  'Returned':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Wisdom, Constitution; Choose 1 from any)",' +
      '"1:Diehard","1:Additional Lore (Boneyard Lore)"',
  'Royalty':
    'Features=' +
      '"1:Attribute Boost (Choose 1 from Intelligence, Charisma; Choose 1 from any)",' +
      '"1:Skill Trained (Society)",' +
      '"1:Courtly Graces"'
});
for(let b in Pathfinder2ERemaster.BACKGROUNDS)
  Pathfinder2ERemaster.BACKGROUNDS[b] =
    Pathfinder2ERemaster.BACKGROUNDS[b].replaceAll('Ability', 'Attribute');
Pathfinder2ERemaster.CLASSES = {

  'Bard':
    // Ability => Attribute
    // 1:Attack Trained (Simple Weapons; Longsword; Rapier; Sap; Shortbow; Shortsword; Whip; Unarmed Attacks) =>
    // 1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)
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
      '"1:Spell Trained (Occult)","1:Class Trained (Bard)",' +
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
      '"1:Spell Trained (Divine)","Class Trained (Cleric)",' +
      '"1:Cleric Spellcasting","1:Deity","1:Divine Font","1:Doctrine",' +
      '"2:Cleric Feats","2:Skill Feats","3:General Feats",' +
      '"3:Skill Increases","5:Perception Expertise","9:Resolute Faith",' +
      '"11:Reflex Expertise","13:Divine Defense","13:Weapon Specialization",' +
      '"19:Miraculous Spell" ' +
    'Selectables=' +
      '"deityFont==\'Either\' ? 1:Healing Font:Divine Font",' +
      '"deityFont==\'Either\' ? 1:Harmful Font:Divine Font",' +
      '"1:Cloistered Cleric:Doctrine",' +
      '"1:Warpriest:Doctrine",' +
      '"deitySanctification==\'Either\' ? 1:Holy:Sanctification",' +
      '"deitySanctification==\'Either\' ? 1:Unholy:Sanctification" ' +
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
      '"1:Spell Trained (Primal)","Class Trained (Druid)",' +
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
      '"1:Strength:Key Attribute",' +
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
      '"1:Class Trained (Witch)",' +
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
      'C1:5@1,' +
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
      '"1:Spell Trained (Arcane)","1:Class Trained (Wizard)",' +
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
    // 11:Perpetual Potency => null
    // 15:Alchemical Alacrity => 15:Alchemical Weapon Mastery
    // 15:Evasion => 15:Explosion Dodger
    // 17:Perpetual Perfection => 17:Abundant Vials
    'Attribute=intelligence HitPoints=8 ' +
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
      '"features.Bomber ? 5:Field Discovery (Bomber)",' +
      '"features.Chirurgeon ? 5:Field Discovery (Chirurgeon)",' +
      '"features.Mutagenist ? 5:Field Discovery (Mutagenist)",' +
      '"features.Toxicologist ? 5:Field Discovery (Toxicologist)",' +
      '"5:Powerful Alchemy",' +
      '"7:Alchemical Weapon Expertise","7:Will Expertise",' +
      '"9:Alchemical Expertise","9:Double Brew","9:Perception Expertise",' +
      '"features.Bomber ? 11:Advanced Vials (Bomber)",' +
      '"features.Chirurgeon ? 11:Advanced Vials (Chirurgeon)",' +
      '"features.Mutagenist ? 11:Advanced Vials (Mutagenist)",' +
      '"features.Toxicologist ? 11:Advanced Vials (Toxicologist)",' +
      '"11:Chemical Hardiness",' +
      '"features.Bomber ? 13:Greater Field Discovery (Bomber)",' +
      '"features.Chirurgeon ? 13:Greater Field Discovery (Chirurgeon)",' +
      '"features.Mutagenist ? 13:Greater Field Discovery (Mutagenist)",' +
      '"features.Toxicologist ? 13:Greater Field Discovery (Toxicologist)",' +
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
    // 19:Armor Of Fury => 19:Armor Mastery (should be Medium AM?)
    // null => 1:Superstition Instinct
    'Attribute=strength HitPoints=12 ' +
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
      '"features.Fury Instinct ? 1:Unstoppable Frenzy",' +
      '"features.Giant Instinct ? 1:Titan Mauler",' +
      '"features.Spirit Instinct ? 1:Spirit Rage",' +
      '"features.Superstition Instinct ? 1:Superstitious Resilience",' +
      '"2:Skill Feats","3:Furious Footfalls","3:General Feats",' +
      '"3:Skill Increases",5:Brutality,7:Juggernaut,' +
      '"7:Specialization Ability","7:Weapon Specialization",' +
      '"9:Reflex Expertise",' +
      '"features.Animal Instinct ? 9:Raging Resistance (Animal)",' +
      '"features.Dragon Instinct ? 9:Raging Resistance (Dragon)",' +
      '"features.Fury Instinct ? 9:Raging Resistance (Fury)",' +
      '"features.Giant Instinct ? 9:Raging Resistance (Giant)",' +
      '"features.Spirit Instinct ? 9:Raging Resistance (Spirit)",' +
      '"features.Superstition Instinct ? 9:Raging Resistance (Superstition)",' +
      '"11:Mighty Rage","13:Greater Juggernaut","13:Medium Armor Expertise",' +
      '"13:Weapon Mastery","15:Greater Weapon Specialization",' +
      '"15:Indomitable Will","17:Perception Mastery","17:Revitalizing Rage",' +
      '"19:Medium Armor Mastery",19:Devastator ' +
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
      '"1:Dragon Instinct (Adamantine):Instinct",' +
      '"1:Dragon Instinct (Conspirator):Instinct",' +
      '"1:Dragon Instinct (Diabolic):Instinct",' +
      '"1:Dragon Instinct (Empyreal):Instinct",' +
      '"1:Dragon Instinct (Fortune):Instinct",' +
      '"1:Dragon Instinct (Horned):Instinct",' +
      '"1:Dragon Instinct (Mirage):Instinct",' +
      '"1:Dragon Instinct (Omen):Instinct",' +
      '"1:Superstition Instinct:Instinct"',

  'Champion':
    // Ability => Attribute
    // 1:Champion's Code => null
    // 1:Champion's Reaction => null
    // 1:Deity And Cause => 1:Deity,1:Cause
    // null => 1:Champion's Aura
    // 3:Divine Ally => 3:Blessing Of The Devoted
    // 9:Divine Smite => 9:Relentless Reaction
    // 9:Juggernaut => 9:Sacred Body
    // 11:Exalt => 11:Exalted Reaction
    'Attribute=strength,dexterity HitPoints=10 ' +
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
      '"1:Spell Trained (Divine)",' +
      '"1:Class Trained (Champion)",' +
      '"1:Deity","1:Deific Weapon","1:Champion\'s Aura",' +
      '"1:Cause","1:Devotion Spells","1:Shield Block","1:Champion Feats",' +
      '"2:Skill Feats","3:Blessing Of The Devoted","3:General Feats",' +
      '"3:Skill Increases","5:Weapon Expertise","7:Armor Expertise",' +
      '"7:Weapon Specialization","9:Champion Expertise","9:Reflex Expertise",' +
      '"9:Relentless Reaction","9:Sacred Body","11:Divine Will",' +
      '"11:Perception Expertise","11:Exalted Reaction","13:Armor Mastery",' +
      '"13:Weapon Mastery","15:Greater Weapon Specialization",' +
      '"17:Champion Mastery","17:Legendary Armor","19:Hero\'s Defiance" ' +
    'Selectables=' +
      '"1:Dexterity:Key Attribute",' +
      '"1:Strength:Key Attribute",' +
      '"deitySanctification==\'Either\' ? 1:Holy:Sanctification",' +
      '"deitySanctification==\'Either\' ? 1:Unholy:Sanctification",' +
      '"1:Shields Of The Spirit:Devotion Spell",' +
      '"deityFont != \'Harm\' ? 1:Lay On Hands:Devotion Spell",' +
      '"deityFont != \'Heal\' ? 1:Touch Of The Void:Devotion Spell",' +
      '"1:Blessed Armament:Blessing Of The Devoted",' +
      '"1:Blessed Shield:Blessing Of The Devoted",' +
      '"1:Blessed Swiftness:Blessing Of The Devoted",' +
      '"traits.Unholy ? 1:Desecration:Cause",' +
      '"traits.Holy ? 1:Grandeur:Cause",' +
      '"traits.Unholy ? 1:Iniquity:Cause",' +
      '"1:Justice:Cause",' +
      '"1:Liberation:Cause",' +
      '"1:Obedience:Cause",' +
      '"traits.Holy ? 1:Redemption:Cause"',

  'Investigator':
    'Attribute=intelligence HitPoints=8 ' +
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
    'Attribute=strength,dexterity HitPoints=10 ' +
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
    'Attribute=charisma HitPoints=8 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Oracle Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Spell Trained (Divine)",' +
      '"1:Class Trained (Oracle)",' +
      '"1:Oracle Spellcasting","1:Mystery","1:Revelation Spells",' +
      '"1:Oracular Curse","2:Oracle Feats","2:Skill Feats","3:General Feats",' +
      '"3:Signature Spells","3:Skill Increases","7:Expert Spellcaster",' +
      '"7:Mysterious Resolve","9:Magical Fortitude","11:Divine Access",' +
      '"11:Major Curse","11:Oracular Senses","11:Weapon Expertise",' +
      '"13:Light Armor Expertise","13:Premonition\'s Reflexes",' +
      '"13:Weapon Specialization","15:Master Spellcaster","17:Extreme Curse",' +
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
    // 9:Lightning Reflexes => 9:Reflex Expertise
    // 11:Alertness => 11:Perception Expertise
    // 17:Resolve => 17:Majestic Will
    // added Elemental (Metal) and Elemental (Wood) bloodlines
    // Draconic Bloodline changed to different exemplars
    // Added Metal and Wood to Elemental bloodlines
    'Attribute=charisma HitPoints=6 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Charisma)",' +
      '"1:Perception Trained",' +
      '"1:Save Expert (Will)","Save Trained (Fortitude; Reflex)",' +
      '"1:Sorcerer Skills",' +
      '"1:Attack Trained (Simple Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Unarmored Defense)",' +
      '"1:Class Trained (Sorcerer)",' +
      '"1:Bloodline","1:Bloodline Spells","1:Sorcerer Spellcasting",' +
      '"1:Sorcerous Potency","2:Skill Feats","2:Sorcerer Feats",' +
      '"3:General Feats","3:Signature Spells","3:Skill Increases",' +
      '"5:Magical Fortitude","7:Expert Spellcaster","9:Reflex Expertise",' +
      '"11:Perception Expertise","11:Weapon Expertise","13:Defensive Robes",' +
      '"13:Weapon Specialization","15:Master Spellcaster","17:Majestic Will",' +
      '"19:Bloodline Paragon","19:Legendary Spellcaster" ' +
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
      'C1:5@1,' +
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
    'Attribute=dexterity HitPoints=10 ' +
    'Features=' +
      '"1:Attribute Boosts","1:Attribute Boost (Dexterity)",' +
      '"1:Perception Expert",' +
      '"1:Save Expert (Reflex; Will)","Save Trained (Fortitude)",' +
      '"1:Swashbuckler Skills",' +
      '"1:Attack Trained (Simple Weapons; Martial Weapons; Unarmed Attacks)",' +
      '"1:Defense Trained (Light Armor; Unarmored Defense)",' +
      '"1:Class Trained (Swashbuckler)",' +
      '"1:Panache","1:Precise Strike","1:Stylish Combatant",' +
      '"1:Swashbuckler\'s Style","1:Confident Finisher",' +
      '"1:Swashbuckler Feats","2:Skill Feats","3:Fortitude Expertise",' +
      '"3:General Feats","3:Opportune Riposte","3:Skill Increases",' +
      '"3:Stylish Tricks","3:Vivacious Speed","5:Weapon Expertise",' +
      '"7:Confident Evasion","7:Weapon Specialization",' +
      '"9:Exemplary Finisher","9:Swashbuckler Expertise",' +
      '"11:Continuous Flair","11:Perception Mastery","13:Assured Evasion",' +
      '"13:Light Armor Expertise","13:Weapon Mastery",' +
      '"15:Greater Weapon Specialization","15:Keen Flair",' +
      '"17:Reinforced Ego","19:Eternal Confidence","19:Light Armor Mastery" ' +
    'Selectables=' +
      '"1:Battledancer:Style",' +
      '"1:Braggart:Style",' +
      '"1:Fencer:Style",' +
      '"1:Gymnast:Style",' +
      '"1:Rascal:Style",' +
      '"1:Wit:Style"'

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
  'Dwarven Doughtiness':'Traits=Dwarf',
  'Dwarven Lore':Pathfinder2E.FEATS['Dwarven Lore'],
  'Dwarven Weapon Familiarity':Pathfinder2E.FEATS['Dwarven Weapon Familiarity'],
  'Mountain Strategy':'Traits=Dwarf',
  'Rock Runner':Pathfinder2E.FEATS['Rock Runner'],
  "Stonemason's Eye":Pathfinder2E.FEATS.Stonecunning,
  'Unburdened Iron':Pathfinder2E.FEATS['Unburdened Iron'],
  'Boulder Roll':Pathfinder2E.FEATS['Boulder Roll'],
  'Defy The Darkness':'Traits=Dwarf Require="level >= 5","features.Darkvision"',
  'Dwarven Reinforcement':
    'Traits=Dwarf Require="level >= 5","rank.Crafting >= 2"',
  'Echoes In Stone':'Traits=Dwarf,Concentrate Require="level >= 9"',
  "Mountain's Stoutness":Pathfinder2E.FEATS["Mountain's Stoutness"],
  'Stone Bones':'Traits=Dwarf Require="level >= 9"',
  'Stonewalker':Pathfinder2E.FEATS.Stonewalker,
  'March The Mines':'Traits=Dwarf Require="level >= 13"',
  'Telluric Power':'Traits=Dwarf Require="level >= 13"',
  'Stonegate':
    'Traits=Dwarf,Uncommon Require="level >= 17","features.Stonewalker"',
  'Stonewall':'Traits=Dwarf,Earth,Polymorph Require="level >= 17"',

  // Elf
  'Ancestral Longevity':Pathfinder2E.FEATS['Ancestral Longevity'],
  'Elven Lore':Pathfinder2E.FEATS['Elven Lore'],
  'Elven Weapon Familiarity':Pathfinder2E.FEATS['Elven Weapon Familiarity'],
  'Forlorn':Pathfinder2E.FEATS.Forlorn,
  'Nimble Elf':Pathfinder2E.FEATS['Nimble Elf'],
  'Otherworldly Magic':Pathfinder2E.FEATS['Otherworldly Magic'],
  'Unwavering Mien':Pathfinder2E.FEATS['Unwavering Mien'],
  'Ageless Patience':Pathfinder2E.FEATS['Ageless Patience'],
  'Ancestral Suspicion':'Traits=Elf Require="level >= 5"',
  'Martial Experience':'Traits=Elf Require="level >= 5"',
  'Elf Step':Pathfinder2E.FEATS['Elf Step'],
  'Expert Longevity':Pathfinder2E.FEATS['Expert Longevity'],
  // TODO requires "at least one innate spell gained from an elf ancestry feat"
  'Otherworldly Acumen':'Traits=Elf Require="level >= 9"',
  'Tree Climber':'Traits=Elf Require="level >= 9"',
  'Avenge Ally':'Traits=Elf,Fortune Require="level >= 13"',
  'Universal Longevity':Pathfinder2E.FEATS['Universal Longevity'],
  'Magic Rider':'Traits=Elf Require="level >= 17"',

  // Gnome
  'Animal Accomplice':Pathfinder2E.FEATS['Animal Accomplice'],
  'Animal Elocutionist':Pathfinder2E.FEATS['Burrow Elocutionist'],
  'Fey Fellowship':Pathfinder2E.FEATS['Fey Fellowship'],
  'First World Magic':Pathfinder2E.FEATS['First World Magic'],
  'Gnome Obsession':Pathfinder2E.FEATS['Gnome Obsession'],
  'Gnome Weapon Familiarity':Pathfinder2E.FEATS['Gnome Weapon Familiarity'],
  'Illusion Sense':Pathfinder2E.FEATS['Illusion Sense'],
  'Razzle-Dazzle':'Traits=Gnome',
  'Energized Font':Pathfinder2E.FEATS['Energized Font'],
  'Project Persona':
    'Traits=Gnome,Concentrate,Illusion,Primal,Visual Require="level >= 5"',
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Cautious Curiosity (Arcane)':'Traits=Gnome Require="level >= 9"',
  'Cautious Curiosity (Occult)':'Traits=Gnome Require="level >= 9"',
  'First World Adept':Pathfinder2E.FEATS['First World Adept'],
  'Life Leap':'Traits=Gnome,Move,Teleportation Require="level >= 9"',
  'Vivacious Conduit':Pathfinder2E.FEATS['Vivacious Conduit'],
  // TODO requires "at least one arcane or occult innate spell gained from a
  // gnome heritage or gnome ancestry feat"
  'Instinctive Obfuscation':
    'Traits=Gnome,Illusion,Visual Require="level >= 13"',
  'Homeward Bound':'Traits=Gnome,Uncommon Require="level >= 17"',

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
  'Kneecap':'Traits=Goblin Require="level >= 5"',
  'Loud Singer':'Traits=Goblin Require="level >= 5","features.Goblin Song"',
  'Vandal':'Traits=Goblin Require="level >= 5"',
  'Cave Climber':Pathfinder2E.FEATS['Cave Climber'],
  'Cling':'Traits=Goblin Require="level >= 9"',
  'Skittering Scuttle':Pathfinder2E.FEATS['Skittering Scuttle'],
  'Very, Very Sneaky':Pathfinder2E.FEATS['Very, Very Sneaky'],
  'Reckless Abandon':'Traits=Goblin,Fortune Require="level >= 17"',

  // Halfling
  'Distracting Shadows':Pathfinder2E.FEATS['Distracting Shadows'],
  'Folksy Patter':'Traits=Halfling',
  'Halfling Lore':Pathfinder2E.FEATS['Halfling Lore'],
  'Halfling Luck':Pathfinder2E.FEATS['Halfling Luck'],
  'Halfling Weapon Familiarity':
    Pathfinder2E.FEATS['Halfling Weapon Familiarity'],
  'Prairie Rider':'Traits=Halfling',
  'Sure Feet':Pathfinder2E.FEATS['Sure Feet'],
  'Titan Slinger':Pathfinder2E.FEATS['Titan Slinger'],
  'Unfettered Halfling':Pathfinder2E.FEATS['Unfettered Halfling'],
  'Watchful Halfling':Pathfinder2E.FEATS['Watchful Halfling'],
  'Cultural Adaptability (%ancestry)':
    Pathfinder2E.FEATS['Cultural Adaptability (%ancestry)'],
  'Step Lively':'Traits=Halfling Require="level >= 5"',
  'Dance Underfoot':
    'Traits=Halfling Require="level >= 9","features.Step Lively"',
  'Guiding Luck':Pathfinder2E.FEATS['Guiding Luck'],
  'Irrepressible':Pathfinder2E.FEATS.Irrepressible,
  'Unhampered Passage':'Traits=Halfling Require="level >= 9"',
  'Ceaseless Shadows':Pathfinder2E.FEATS['Ceaseless Shadows'],
  'Toppling Dance':
    'Traits=Halfling Require="level >= 13","features.Dance Underfoot"',
  'Shadow Self':'Traits=Halfling Require="level >= 17","rank.Stealth >= 4"',

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
  'Sense Allies':'Traits=Human Require="level >= 5"',
  // Requirements changed
  'Cooperative Soul':'Traits=Human Require="level >= 9"',
  'Group Aid':'Traits=Human Require="level >= 9"',
  'Hardy Traveler':'Traits=Human Require="level >= 9"',
  // Requirements changed
  'Incredible Improvisation':'Traits=Human Require="level >= 9"',
  'Multitalented':Pathfinder2E.FEATS.Multitalented,
  'Advanced General Training':'Traits=Human Require="level >= 13"',
  'Bounce Back':'Traits=Human Require="level >= 13"',
  'Stubborn Persistence':'Traits=Human Require="level >= 13"',
  'Heroic Presence':'Traits=Human,Emotion,Mental Require="level >= 17"',

  // Leshy
  'Grasping Reach':'Traits=Leshy',
  'Harmlessly Cute':'Traits=Leshy',
  'Leshy Lore':'Traits=Leshy',
  'Leshy Superstition':'Traits=Leshy',
  'Seedpod':'Traits=Leshy',
  'Shadow Of The Wilds':'Traits=Leshy',
  'Undaunted':'Traits=Leshy',
  'Anchoring Roots':'Traits=Leshy Require="level >= 5"',
  'Leshy Glide':
    'Traits=Leshy ' +
    'Require="level >= 5","features.Leaf Leshy || features.Cat Fall"',
  'Ritual Reversion':'Traits=Leshy,Polymorph,Primal Require="level >= 5"',
  'Speak With Kindred':'Traits=Leshy Require="level >= 5"',
  'Bark And Tendril':'Traits=Leshy Require="level >= 9"',
  'Lucky Keepsake':
    'Traits=Leshy Require="level >= 9","features.Leshy Superstition"',
  'Solar Rejuvenation':'Traits=Leshy Require="level >= 9"',
  'Thorned Seedpod':'Traits=Leshy Require="level >= 9","features.Seedpod"',
  'Call Of The Green Man':'Traits=Leshy Require="level >= 13"',
  'Cloak Of Poison':'Traits=Leshy,Poison Require="level >= 13"',
  'Flourish And Ruin':'Traits=Leshy Require="level >= 17"',
  'Regrowth':'Traits=Leshy Require="level >= 17"',

  // Orc
  'Beast Trainer':'Traits=Orc',
  'Iron Fists':'Traits=Orc',
  'Orc Ferocity':Pathfinder2E.FEATS['Orc Ferocity'],
  'Orc Lore':'Traits=Orc',
  'Orc Superstition':Pathfinder2E.FEATS['Orc Superstition'],
  'Hold Mark (Burning Sun)':'Traits=Orc',
  "Hold Mark (Death's Head)":'Traits=Orc',
  'Hold Mark (Defiled Corpse)':'Traits=Orc',
  'Hold Mark (Empty Hand)':'Traits=Orc',
  'Orc Weapon Familiarity':Pathfinder2E.FEATS['Orc Weapon Familiarity'],
  'Tusks':'Traits=Orc',
  'Athletic Might':'Traits=Orc Require="level >= 5"',
  'Bloody Blows':'Traits=Orc Require="level >= 5"',
  'Defy Death':'Traits=Orc Require="level >= 5","features.Orc Ferocity"',
  'Scar-Thick Skin':'Traits=Orc Require="level >= 5"',
  'Pervasive Superstition':
    'Traits=Orc Require="level >= 9","features.Orc Superstition"',
  'Undying Ferocity':'Traits=Orc Require="level >= 9","features.Orc Ferocity"',
  'Incredible Ferocity':Pathfinder2E.FEATS['Incredible Ferocity'],
  'Ferocious Beasts':
    'Traits=Orc ' +
    'Require=' +
      '"level >= 13",' +
      '"features.Orc Ferocity",' +
      '"features.Animal Companion || features.Pet || features.Bonded Animal"',
  'Spell Devourer':
    'Traits=Orc Require="level >= 13","features.Orc Superstition"',
  'Rampaging Ferocity':
    'Traits=Orc Require="level >= 17","features.Orc Ferocity"',

  // Changeling
  'Brine May':'Traits=Changeling,Lineage',
  'Callow May':'Traits=Changeling,Lineage',
  'Dream May':'Traits=Changeling,Lineage',
  'Slag May':'Traits=Changeling,Lineage',
  'Changeling Lore':'Traits=Changeling',
  'Hag Claws':'Traits=Changeling',
  "Hag's Sight":'Traits=Changeling',
  'Called':'Traits=Changeling Require="level >= 5"',
  'Mist Child':'Traits=Changeling Require="level >= 5"',
  'Accursed Claws':'Traits=Changeling Require="level >= 9","weapons.Claws"',
  'Occult Resistance':
    'Traits=Changeling Require="level >= 9","rank.Occultism >= 2"',
  'Hag Magic':'Traits=Changeling Require="level >= 13"',

  // Nephilim
  'Angelkin':'Traits=Nephilim,Lineage',
  'Grimspawn':'Traits=Nephilim,Lineage',
  'Hellspawn':'Traits=Nephilim,Lineage',
  'Lawbringer':'Traits=Nephilim,Lineage',
  'Musetouched':'Traits=Nephilim,Lineage',
  'Pitborn':'Traits=Nephilim,Lineage',
  'Bestial Manifestation (Claw)':'Traits=Nephilim',
  'Bestial Manifestation (Hoof)':'Traits=Nephilim',
  'Bestial Manifestation (Jaws)':'Traits=Nephilim',
  'Bestial Manifestation (Tail)':'Traits=Nephilim',
  'Halo':'Traits=Nephilim',
  'Nephilim Eyes':'Traits=Nephilim Require="features.Low-Light Vision"',
  'Nephilim Lore':'Traits=Nephilim',
  'Nimble Hooves':'Traits=Nephilim',
  'Blessed Blood':'Traits=Nephilim Require="level >= 5"',
  'Extraplanar Supplication (Bane)':'Traits=Nephilim Require="level >= 5"',
  'Extraplanar Supplication (Bless)':'Traits=Nephilim Require="level >= 5"',
  'Nephilim Resistance':'Traits=Nephilim Require="level >= 5"',
  'Scion Of Many Planes':'Traits=Nephilim Require="level >= 5"',
  'Skillful Tail':'Traits=Nephilim Require="level >= 5"',
  'Celestial Magic':
    'Traits=Nephilim Require="level >= 9","features.Celestial Lineage"',
  'Divine Countermeasures':'Traits=Nephilim Require="level >= 9"',
  'Divine Wings':'Traits=Nephilim,Divine,Morph Require="level >= 9"',
  'Fiendish Magic':
    'Traits=Nephilim Require="level >= 9","features.Fiendish Lineage"',
  'Celestial Mercy':
    'Traits=Nephilim Require="level >= 13","features.Celestial Lineage"',
  'Slip Sideways':
    'Traits=Nephilim Require="level >= 13","features.Fiendish Lineage"',
  'Summon Nephilim Kin':
    'Traits=Nephilim Require="level >= 13","sumLineageFeats > 0"',
  'Divine Declaration':'Traits=Nephilim Require="level >= 17"',
  'Eternal Wings':
    'Traits=Nephilim Require="level >= 17","features.Divine Wings"',

  // Aiuvarin
  'Earned Glory':'Traits=Aiuvarin',
  'Elf Atavism':
     Pathfinder2E.FEATS['Elf Atavism']
     .replace('Half-Elf', 'Aiuvarin'),
  'Inspire Imitation':
     Pathfinder2E.FEATS['Inspire Imitation']
     .replace('Half-Elf', 'Aiuvarin'),
  'Supernatural Charm':
     Pathfinder2E.FEATS['Supernatural Charm']
     .replace('Half-Elf', 'Aiuvarin'),

  // Dromaar
  'Monstrous Peacemaker':
     Pathfinder2E.FEATS['Monstrous Peacemaker']
     .replace('Half-Orc', 'Dromaar'),
  'Orc Sight':
     Pathfinder2E.FEATS['Orc Sight']
     .replace('Half-Orc', 'Dromaar'),

  // Core 2

  // Catfolk
  'Cat Nap':'Traits=Catfolk,Concentrate,Exploration',
  "Cat's Luck":'Traits=Catfolk,Fortune',
  'Catfolk Dance':'Traits=Catfolk',
  'Catfolk Lore':'Traits=Catfolk',
  'Catfolk Weapon Familiarity':'Traits=Catfolk',
  'Saber Teeth':'Traits=Catfolk',
  'Well-Met Traveler':'Traits=Catfolk',
  'Climbing Claws':'Traits=Catfolk Require="level >= 5"',
  'Graceful Guidance':'Traits=Catfolk Require="level >= 5"',
  'Light Paws':'Traits=Catfolk Require="level >= 5"',
  'Lucky Break':'Traits=Catfolk Require="level >= 5","features.Cat\'s Luck"',
  'Pride Hunter':'Traits=Catfolk Require="level >= 5"',
  'Springing Leaper':
    'Traits=Catfolk Require="level >= 5","rank.Athletics >= 2"',
  'Well-Groomed':'Traits=Catfolk Require="level >= 5"',
  'Aggravating Scratch':
    'Traits=Catfolk,Disease Require="level >= 9","weapons.Claws"',
  'Evade Doom':'Traits=Catfolk Require="level >= 9"',
  'Luck Of The Clowder':
    'Traits=Catfolk Require="level >= 9","features.Cat\'s Luck"',
  "Predator's Growl":
    'Traits=Catfolk Require="level >= 9","rank.Intimidation >= 2"',
  'Silent Step':'Traits=Catfolk,Flourish Require="level >= 9"',
  'Wary Skulker':'Traits=Catfolk Require="level >= 9"',
  'Black Cat Curse':'Traits=Catfolk,Misfortune,Occult Require="level >= 13"',
  'Caterwaul':
    'Traits=Catfolk,Auditory,Concentrate,Emotion,Mental ' +
    'Require="level >= 13"',
  'Elude Trouble':'Traits=Catfolk Require="level >= 17"',
  'Reliable Luck':'Traits=Catfolk Require="level >= 17","features.Cat\'s Luck"',
  'Ten Lives':'Traits=Catfolk Require="level >= 17","features.Evade Doom"',

  // Hobgoblin
  'Alchemical Scholar':'Traits=Hobgoblin',
  'Cantorian Reinforcement':'Traits=Hobgoblin',
  'Hobgoblin Lore':'Traits=Hobgoblin',
  'Hobgoblin Weapon Familiarity':'Traits=Hobgoblin',
  'Leech-Clip':'Traits=Hobgoblin',
  'Remorseless Lash':'Traits=Hobgoblin',
  'Sneaky':'Traits=Hobgoblin',
  'Stone Face':'Traits=Hobgoblin',
  'Vigorous Health':'Traits=Hobgoblin',
  'Agonizing Rebuke':'Traits=Hobgoblin Require="level >= 5"',
  'Expert Drill Sergeant':'Traits=Hobgoblin Require="level >= 5"',
  'Recognize Ambush':'Traits=Hobgoblin Require="level >= 5"',
  'Runtsage':'Traits=Hobgoblin Require="level >= 5"',
  'Cantorian Rejuvenation':
    'Traits=Hobgoblin,Healing,Vitality Require="level >= 9"',
  'Fell Rider':
    'Traits=Hobgoblin Require="level >= 9","features.Animal Companion"',
  'Pride In Arms':
    'Traits=Hobgoblin,Auditory,Emotion,Mental Require="level >= 9"',
  'Squad Tactics':'Traits=Hobgoblin Require="level >= 9"',
  "Can't Fall Here":
    'Traits=Hobgoblin,Auditory,Manipulate Require="level >= 13"',
  'War Conditioning (Climb)':'Traits=Hobgoblin Require="level >= 13"',
  'War Conditioning (Swim)':'Traits=Hobgoblin Require="level >= 13"',
  'Cantorian Restoration':
    'Traits=Hobgoblin,Healing,Vitality Require="level >= 17"',
  'Rallying Cry':'Traits=Hobgoblin,Auditory Require="level >= 17"',

  // Kholo
  'Ask The Bones':'Traits=Kholo',
  'Crunch':'Traits=Kholo',
  'Hyena Familiar':'Traits=Kholo',
  'Kholo Lore':'Traits=Kholo',
  'Kholo Weapon Familiarity':'Traits=Kholo',
  'Pack Hunter':'Traits=Kholo',
  'Sensitive Nose':'Traits=Kholo',
  'Absorb Strength':'Traits=Kholo,Uncommon Require="level >= 5"',
  'Distant Cackle':'Traits=Kholo Require="level >= 5","features.Witch Kholo"',
  'Pack Stalker':'Traits=Kholo Require="level >= 5","rank.Stealth >= 2"',
  'Rabid Sprint':
    'Traits=Kholo,Flourish Require="level >= 5","features.Dog Kholo"',
  'Affliction Resistance':'Traits=Kholo Require="level >= 5"',
  'Left-Hand Blood':'Traits=Kholo Require="level >= 5"',
  'Right-Hand Blood':'Traits=Kholo Require="level >= 5"',
  'Ambush Hunter':'Traits=Kholo Require="level >= 9"',
  'Breath Like Honey':
    'Traits=Kholo Require="level >= 9","features.Sweetbreath Kholo"',
  "Grandmother's Wisdom":'Traits=Kholo Require="level >= 9"',
  'Laughing Kholo':'Traits=Kholo Require="level >= 9","rank.Intimidation >= 3"',
  "Ancestor's Rage":'Traits=Kholo Require="level >= 13"',
  "Bonekeeper's Bane":'Traits=Kholo Require="level >= 13"',
  'First To Strike, First To Fall':'Traits=Kholo Require="level >= 17"',
  'Impaling Bone':'Traits=Kholo Require="level >= 17"',
  'Legendary Laugh':
    'Traits=Kholo Require="level >= 17","features.Laughing Kholo"',

  // Kobold
  'Cringe':'Traits=Kobold,Emotion,Mental,Visual',
  "Dragon's Presence":'Traits=Kobold Require="features.Dragonscaled Kobold"',
  'Kobold Lore':'Traits=Kobold',
  'Kobold Weapon Familiarity':'Traits=Kobold',
  'Scamper':'Traits=Kobold',
  'Snare Setter':'Traits=Kobold Require="rank.Crafting >= 1"',
  "Ally's Shelter":'Traits=Kobold,Fortune Require="level >= 5"',
  'Grovel':
    'Traits=Kobold,Auditory,Concentrate,Emotion,Mental ' +
    'Require="level >= 5","rank.Deception >= 1"',
  'Snare Genius':
    'Traits=Kobold ' +
    'Require="level >= 5","rank.Crafting >= 2","features.Snare Crafting"',
  'Winglets':'Traits=Kobold Require="level >= 5"',
  'Between The Scales':'Traits=Kobold Require="level >= 9"',
  'Briar Battler':'Traits=Kobold Require="level >= 9"',
  'Close Quarters':'Traits=Kobold Require="level >= 9"',
  'Evolved Spellhorn':
    'Traits=Kobold Require="level >= 9","features.Spellhorn Kobold"',
  'Fleeing Shriek':'Traits=Kobold,Auditory,Sonic Require="level >= 9"',
  'Winglet Flight':'Traits=Kobold Require="level >= 9","features.Winglets"',
  'Resplendent Spellhorn':
    'Traits=Kobold Require="level >= 13","features.Evolved Spellhorn"',
  'Tumbling Diversion':
    'Traits=Kobold ' +
    'Require="level >= 13","rank.Acrobatics >= 2","rank.Deception >= 2"',
  'Vicious Snares':
    'Traits=Kobold ' +
    'Require="level >= 13","rank.Crafting >= 2","features.Snare Crafting"',
  "Benefactor's Majesty":'Traits=Kobold,Healing,Visual Require="level >= 17"',

  // Lizardfolk
  'Bone Magic (Occult)':'Traits=Lizardfolk',
  'Bone Magic (Primal)':'Traits=Lizardfolk',
  'Iruxi Armaments (Claws)':'Traits=Lizardfolk',
  'Iruxi Armaments (Fangs)':'Traits=Lizardfolk',
  'Iruxi Armaments (Tail)':'Traits=Lizardfolk',
  'Lizardfolk Lore':'Traits=Lizardfolk',
  // TODO Requires a swim Speed
  'Marsh Runner':'Traits=Lizardfolk',
  'Parthenogenic Hatchling':'Traits=Lizardfolk',
  'Reptile Speaker':'Traits=Lizardfolk',
  'Envenom Fangs':
    'Traits=Lizardfolk ' +
    'Require="level >= 5","features.Iruxi Armaments (Fangs)"',
  'Flexible Tail':'Traits=Lizardfolk Require="level >= 5"',
  "Gecko's Grip":'Traits=Lizardfolk Require="level >= 5"',
  'Shed Tail':
    'Traits=Lizardfolk Require="level >= 5","features.Iruxi Armaments (Tail)"',
  'Swift Swimmer':'Traits=Lizardfolk Require="level >= 5"',
  'Dangle':'Traits=Lizardfolk Require="level >= 9"',
  'Hone Claws':
    'Traits=Lizardfolk Require="level >= 9","features.Iruxi Armaments (Claws)"',
  'Terrain Advantage':'Traits=Lizardfolk Require="level >= 9"',
  'Bone Investiture':
    'Traits=Lizardfolk Require="level >= 13","features.Bone Magic"',
  'Iruxi Spirit Strike':'Traits=Lizardfolk Require="level >= 13"',
  'Primal Rampage':'Traits=Lizardfolk Require="level >= 13"',
  'Fossil Rider':
    'Traits=Lizardfolk Require="level >= 17","features.Bone Magic"',
  'Scion Transformation':'Traits=Lizardfolk,Primal Require="level >= 17"',

  // Ratfolk
  'Cheek Pouches':'Traits=Ratfolk',
  'Pack Rat':'Traits=Ratfolk',
  'Rat Familiar':'Traits=Ratfolk',
  'Ratfolk Lore':'Traits=Ratfolk',
  'Ratspeak':'Traits=Ratfolk',
  'Tinkering Fingers':'Traits=Ratfolk',
  'Vicious Incisors':'Traits=Ratfolk',
  'Warren Navigator':'Traits=Ratfolk',
  'Cornered Fury':'Traits=Ratfolk Require="level >= 5"',
  'Lab Rat':'Traits=Ratfolk Require="level >= 5"',
  'Quick Stow':'Traits=Ratfolk Require="level >= 5","features.Cheek Pouches"',
  'Rat Magic':'Traits=Ratfolk Require="level >= 5"',
  'Ratfolk Roll':'Traits=Ratfolk,Move Require="level >= 5"',
  'Big Mouth':'Traits=Ratfolk Require="level >= 9","features.Cheek Pouches"',
  'Overcrowd':'Traits=Ratfolk Require="level >= 9"',
  'Rat Form':'Traits=Ratfolk,Concentrate,Polymorph,Primal Require="level >= 9"',
  'Uncanny Cheeks':'Traits=Ratfolk Require="level >= 9"',
  'Shinstabber':'Traits=Ratfolk Require="level >= 13","features.Overcrowd"',
  'Skittering Sneak':'Traits=Ratfolk Require="level >= 13"',
  'Warren Digger':'Traits=Ratfolk Require="level >= 13"',
  'Call The Swarm':'Traits=Ratfolk Require="level >= 17","features.Ratspeak"',
  'Greater Than The Sum':'Traits=Ratfolk Require="level >= 17"',

  // Tengu
  "Mariner's Fire":'Traits=Tengu',
  'One-Toed Hop':'Traits=Tengu',
  "Scavenger's Search":'Traits=Tengu',
  'Squawk!':'Traits=Tengu',
  "Storm's Lash":'Traits=Tengu',
  'Tengu Lore':'Traits=Tengu',
  'Tengu Weapon Familiarity':'Traits=Tengu',
  'Uncanny Agility':'Traits=Tengu',
  'Eat Fortune':'Traits=Tengu,Concentrate,Divine Require="level >= 5"',
  'Long-Nosed Form':
    'Traits=Tengu,Concentrate,Polymorph,Primal Require="level >= 5"',
  'Magpie Snatch':'Traits=Tengu Require="level >= 5"',
  'Soaring Flight':'Traits=Tengu Require="level >= 5","features.Skyborn Tengu"',
  'Tengu Feather Fan':'Traits=Tengu Require="level >= 5"',
  'Soaring Form':'Traits=Tengu Require="level >= 9","features.Soaring Flight"',
  "Wind God's Fan":
    'Traits=Tengu Require="level >= 9","features.Tengu Feather Fan"',
  "Harbinger's Claw":
    'Traits=Tengu,Auditory,Divine,Misfortune Require="level >= 13"',
  'Jinx Glutton':'Traits=Tengu Require="level >= 13","features.Eat Fortune"',
  // Errata corrects level to 13
  "Thunder God's Fan":
    'Traits=Tengu Require="level >= 13","features.Tengu Feather Fan"',
  'Great Tengu Form':
    'Traits=Tengu Require="level >= 17","features.Long-Nosed Form"',
  'Trickster Tengu':'Traits=Tengu Require="level >= 17"',

  // Tripkee
  'Croak Talker':'Traits=Tripkee',
  "Hunter's Defense":'Traits=Tripkee Require="rank.Nature >= 1"',
  'Jungle Strider':'Traits=Tripkee',
  'Nocturnal Tripkee':'Traits=Tripkee',
  'Terrifying Croak':'Traits=Tripkee Require="rank.Intimidation >= 1"',
  'Tripkee Lore':'Traits=Tripkee',
  'Tripkee Weapon Familiarity':'Traits=Tripkee',
  'Fantastic Leaps':'Traits=Tripkee Require="level >= 5"',
  'Long Tongue':
    'Traits=Tripkee Require="level >= 5","features.Snaptongue Tripkee"',
  'Prodigious Climber':'Traits=Tripkee Require="level >= 5"',
  'Tenacious Net':'Traits=Tripkee Require="level >= 5"',
  'Tripkee Glide':
    'Traits=Tripkee Require="level >= 5","features.Windweb Tripkee"',
  'Vomit Stomach':'Traits=Tripkee Require="level >= 5"',
  // TODO require "not immune to diseases or poisons"
  'Absorb Toxin':'Traits=Tripkee Require="level >= 9"',
  'Moisture Bath':'Traits=Tripkee,Manipulate Require="level >= 9"',
  'Ricocheting Leap':'Traits=Tripkee Require="level >= 9","features.Wall Jump"',
  'Tongue Tether':
    'Traits=Tripkee Require="level >= 9","features.Snaptongue Tripkee"',
  'Envenomed Edge':'Traits=Tripkee Require="level >= 13"',
  'Hop Up':'Traits=Tripkee Require="level >= 13"',
  'Unbound Leaper':'Traits=Tripkee Require="level >= 17"',

  // Dhampir
  'Straveika':'Traits=Dhampir,Lineage',
  'Svetocher':'Traits=Dhampir,Lineage',
  'Eyes Of Night':'Traits=Dhampir',
  'Fangs':'Traits=Dhampir',
  'Vampire Lore':'Traits=Dhampir',
  'Voice Of The Night':'Traits=Dhampir',
  'Enthralling Allure':'Traits=Dhampir Require="level >= 5"',
  'Necromantic Physiology':'Traits=Dhampir Require="level >= 5"',
  'Undead Slayer':'Traits=Dhampir Require="level >= 5"',
  'Bloodletting Fangs':'Traits=Dhampir Require="level >= 9","weapons.Fangs"',
  'Night Magic':'Traits=Dhampir Require="level >= 9"',
  'Form Of The Bat':
    'Traits=Dhampir,Concentrate,Divine,Polymorph Require="level >= 13"',
  'Symphony Of Blood':'Traits=Dhampir Require="level >= 17"',

  // Dragonblood
  'Arcane Dragonblood':'Traits=Dragonblood,Lineage',
  'Divine Dragonblood':'Traits=Dragonblood,Lineage',
  'Occult Dragonblood':'Traits=Dragonblood,Lineage',
  'Primal Dragonblood':'Traits=Dragonblood,Lineage',
  'Breath Of The Dragon':'Traits=Dragonblood,Magical',
  'Draconic Aspect (Claw)':'Traits=Dragonblood',
  'Draconic Aspect (Jaws)':'Traits=Dragonblood',
  'Draconic Aspect (Tail)':'Traits=Dragonblood',
  'Draconic Resistance':'Traits=Dragonblood',
  // Low-Light Vision requirement removed by errata
  'Draconic Sight':'Traits=Dragonblood',
  'Dragon Lore':'Traits=Dragonblood',
  'Scaly Hide':'Traits=Dragonblood',
  'Deadly Aspect':
    'Traits=Dragonblood Require="level >= 5","features.Draconic Aspect"',
  'Draconic Scent':'Traits=Dragonblood Require="level >= 5"',
  "Dragon's Flight":'Traits=Dragonblood Require="level >= 5"',
  'Traditional Resistances':
    'Traits=Dragonblood ' +
    'Require=' +
      '"level >= 5",' +
      '"features.Arcane Dragonblood || ' +
       'features.Divine Dragonblood || ' +
       'features.Occult Dragonblood || ' +
       'features.Primal Dragonblood"',
  'Formidable Breath':
    'Traits=Dragonblood Require="level >= 9","features.Breath Of The Dragon"',
  "True Dragon's Flight":
    'Traits=Dragonblood Require="level >= 9","features.Dragon\'s Flight"',
  'Wing Buffet':
    'Traits=Dragonblood,Attack Require="level >= 9","rank.Athletics >= 2"',
  'Draconic Veil':'Traits=Dragonblood Require="level >= 13"',
  'Majestic Presence':
    'Traits=Dragonblood,Emotion,Fear,Mental,Visual Require="level >= 13"',
  'Form Of The Dragon':'Traits=Dragonblood Require="level >= 17"',
  'Lingering Breath':
    'Traits=Dragonblood Require="level >= 17","features.Breath Of The Dragon"',

  // Duskwalker
  'Chance Death':'Traits=Duskwalker,Fortune',
  'Deliberate Death':'Traits=Duskwalker',
  'Duskwalker Lore':'Traits=Duskwalker',
  'Duskwalker Weapon Familiarity':'Traits=Duskwalker',
  'Ghost Hunter':'Traits=Duskwalker',
  'Gravesight':'Traits=Duskwalker',
  'Lifesense':'Traits=Duskwalker,Divine Require="level >= 5"',
  'Spirit Soother':'Traits=Duskwalker Require="level >= 5"',
  'Ward Against Corruption':'Traits=Duskwalker Require="level >= 5"',
  'Duskwalker Magic':'Traits=Duskwalker Require="level >= 9"',
  'Quietus Strikes':'Traits=Duskwalker Require="level >= 9"',
  'Resist Ruin':'Traits=Duskwalker Require="level >= 13"',
  "Boneyard's Call":'Traits=Duskwalker,Uncommon Require="level >= 17"',

  // Class

  // Bard
  'Bardic Lore':Pathfinder2E.FEATS['Bardic Lore'],
  'Hymn Of Healing':'Traits=Bard',
  'Lingering Composition':
    Pathfinder2E.FEATS['Lingering Composition'] + ' ' +
    'Require="hasMaestroMuse"',
  'Martial Performance':'Traits=Bard Require="hasWarriorMuse"',
  'Reach Spell':
    Pathfinder2E.FEATS['Reach Spell']
    .replace('Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Oracle,Witch,'),
  'Versatile Performance':Pathfinder2E.FEATS['Versatile Performance'],
  'Well-Versed':'Traits=Bard',
  'Cantrip Expansion':
    Pathfinder2E.FEATS['Cantrip Expansion']
    .replace('Traits=', 'Traits=Oracle,Witch,'),
  'Directed Audience':'Traits=Bard Require="level >= 2"',
  'Emotional Push':'Traits=Bard,Concentrate Require="level >= 2"',
  'Esoteric Polymath':Pathfinder2E.FEATS['Esoteric Polymath'],
  "Loremaster's Etude":
    Pathfinder2E.FEATS["Loremaster's Etude"] + ' ' +
    'Require="level >= 2","hasEnigmaMuse"',
  'Multifarious Muse (Enigma)':Pathfinder2E.FEATS['Multifarious Muse (Enigma)'],
  'Multifarious Muse (Maestro)':
    Pathfinder2E.FEATS['Multifarious Muse (Maestro)'],
  'Multifarious Muse (Polymath)':
    Pathfinder2E.FEATS['Multifarious Muse (Polymath)'],
  'Multifarious Muse (Warrior)':
    Pathfinder2E.FEATS['Multifarious Muse (Polymath)']
    .replace('Polymath', 'Warrior'),
  'Song Of Strength':'Traits=Bard Require="level >= 2","hasWarriorMuse"',
  'Uplifting Overture':Pathfinder2E.FEATS['Inspire Competence'],
  'Combat Reading':'Traits=Bard,Secret Require="level >= 4"',
  'Courageous Advance':
    'Traits=Bard,Auditory,Concentrate,Spellshape ' +
    'Require="level >= 4","hasWarriorMuse"',
  'In Tune':
    'Traits=Bard,Concentrate,Spellshape ' +
    'Require="level >= 4","features.Maestro"',
  'Melodious Spell':
    Pathfinder2E.FEATS['Melodious Spell']
    .replace('Manipulate,Metamagic', 'Spellshape'),
  'Rallying Anthem':
    Pathfinder2E.FEATS['Inspire Defense'] + ' ' +
    'Require="level >= 4"',
  'Ritual Researcher':
    'Traits=Bard,Uncommon ' +
    'Require="level >= 4","hasEnigmaMuse","rank.Occultism >= 2"',
  'Triple Time':Pathfinder2E.FEATS['Triple Time'],
  'Versatile Signature':Pathfinder2E.FEATS['Versatile Signature'],
  'Assured Knowledge':
    'Traits=Bard,Fortune Require="level >= 6","hasEnigmaMuse"',
  'Defensive Coordination':
    'Traits=Bard,Auditory,Concentration,Spellshape ' +
    'Require="level >= 6","hasWarriorMuse","features.Rallying Anthem"',
  'Dirge Of Doom':Pathfinder2E.FEATS['Dirge Of Doom'],
  'Educate Allies':
    'Traits=Bard,Concentrate Require="level >= 6","features.Well-Versed"',
  'Harmonize':Pathfinder2E.FEATS.Harmonize.replace('Metamagic', 'Spellshape'),
  'Song Of Marching':'Traits=Bard Require="level >= 6"',
  'Steady Spellcasting':
    Pathfinder2E.FEATS['Steady Spellcasting']
    .replace('Traits=', 'Traits=Witch,Oracle,'),
  'Accompany':'Traits=Bard,Concentrate,Manipulate Require="level >= 8"',
  'Call And Response':
    'Traits=Bard,Auditory,Concentrate,Spellshape Require="level >= 8"',
  'Eclectic Skill':Pathfinder2E.FEATS['Eclectic Skill'],
  'Fortissimo Composition':
    Pathfinder2E.FEATS['Inspire Heroics'] + ' ' +
    'Require="level >= 8","hasMaestroMuse"',
  'Know-It-All':Pathfinder2E.FEATS['Know-It-All'],
  'Reflexive Courage':
    'Traits=Bard,Auditory,Concentrate Require="level >= 8","hasWarriorMuse"',
  'Soulsight':'Traits=Bard Require="level >= 8"',
  'Annotate Composition':
    'Traits=Bard,Exploration,Linguistic Require="level >= 10"',
  'Courageous Assault':
    'Traits=Bard,Auditory,Concentrate,Spellshape ' +
    'Require="level >= 10","hasWarriorMuse"',
  'House Of Imaginary Walls':Pathfinder2E.FEATS['House Of Imaginary Walls'],
  'Ode To Ouroboros':'Traits=Bard Require="level >= 10"',
  'Quickened Casting':
    Pathfinder2E.FEATS['Quickened Casting']
    .replace('Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Witch,Oracle,'),
  'Symphony Of The Unfettered Heart':'Traits=Bard Require="level >= 10"',
  'Unusual Composition':
    Pathfinder2E.FEATS['Unusual Composition']
    .replace('Metamagic', 'Spellshape'),
  'Eclectic Polymath':Pathfinder2E.FEATS['Eclectic Polymath'],
  "Enigma's Knowledge":
    'Traits=Bard Require="level >= 12","features.Assured Knowledge"',
  'Inspirational Focus':Pathfinder2E.FEATS['Inspirational Focus'],
  'Reverberate':'Traits=Bard Require="level >= 12"',
  'Shared Assault':
    'Traits=Bard Require="level >= 12","features.Courageous Assault"',
  'Allegro':Pathfinder2E.FEATS.Allegro,
  'Earworm':'Traits=Bard,Exploration Require="level >= 14"',
  'Soothing Ballad':
    Pathfinder2E.FEATS['Soothing Ballad'] + ' ' +
    'Require="level >= 14"',
  'Triumphant Inspiration':
    'Traits=Bard Require="level >= 14","hasWarriorMuse"',
  'True Hypercognition':Pathfinder2E.FEATS['True Hypercognition'],
  'Vigorous Anthem':
    'Traits=Bard,Auditory,Concentrate,Spellshape Require="level >= 14"',
  'Courageous Onslaught':
    'Traits=Bard,Auditory,Concentrate,Spellshape ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Courageous Advance",' +
      '"features.Courageous Assault"',
  'Effortless Concentration':
    Pathfinder2E.FEATS['Effortless Concentration']
    .replace('Traits=', 'Traits=Witch,'),
  'Resounding Finale':
    'Traits=Bard,Concentrate Require="level >= 16","hasMaestroMuse"',
  'Studious Capacity':Pathfinder2E.FEATS['Studious Capacity'],
  'All In My Head':'Traits=Bard,Illusion,Mental Require="level >= 18"',
  'Deep Lore':Pathfinder2E.FEATS['Deep Lore'],
  'Discordant Voice':
    'Traits=Bard,Sonic ' +
    'Require="level >= 18","spells.Courageous Anthem (OC1 Foc)"',
  'Eternal Composition':Pathfinder2E.FEATS['Eternal Composition'],
  'Impossible Polymath':Pathfinder2E.FEATS['Impossible Polymath'],
  'Fatal Aria':
    Pathfinder2E.FEATS['Fatal Aria'] + ' ' +
    'Require="level >= 20"',
  'Perfect Encore':Pathfinder2E.FEATS['Perfect Encore'],
  'Pied Piping':'Traits=Bard Require="level >= 20"',
  'Symphony Of The Muse':Pathfinder2E.FEATS['Symphony Of The Muse'],
  'Ultimate Polymath':'Traits=Bard Require="level >= 20","hasPolymathMuse"',

  // Cleric
  'Deadly Simplicity':Pathfinder2E.FEATS['Deadly Simplicity'],
  'Divine Castigation':
    Pathfinder2E.FEATS['Holy Castigation'] + ' ' +
    'Require="traits.Holy || traits.Unholy"',
  'Domain Initiate (%domain)':Pathfinder2E.FEATS['Domain Initiate (%domain)'],
  'Harming Hands':Pathfinder2E.FEATS['Harming Hands'],
  'Healing Hands':Pathfinder2E.FEATS['Healing Hands'],
  'Premonition Of Avoidance':'Traits=Cleric,Divine,Prediction',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    Pathfinder2E.FEATS['Communal Healing']
    .replace('Positive', 'Vitality'),
  'Emblazon Armament':Pathfinder2E.FEATS['Emblazon Armament'],
  'Panic The Dead':
    Pathfinder2E.FEATS['Turn Undead']
    .replace('Traits=', 'Traits=Emotion,Fear,Mental,'),
  'Rapid Response':'Traits=Cleric Require="level >= 2"',
  'Sap Life':Pathfinder2E.FEATS['Sap Life'],
  'Versatile Font':Pathfinder2E.FEATS['Versatile Font'],
  "Warpriest's Armor":'Traits=Cleric Require="level >= 2","features.Warpriest"',
  'Channel Smite':
    Pathfinder2E.FEATS['Channel Smite']
    .replace(',Necromancy', '') + ' ' +
    'Require="level >= 4"',
  'Directed Channel':Pathfinder2E.FEATS['Directed Channel'],
  'Divine Infusion':
    Pathfinder2E.FEATS['Necrotic Infusion']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 4"',
  'Raise Symbol':'Traits=Cleric Require="level >= 4"',
  'Restorative Strike':'Traits=Cleric Require="level >= 4"',
  'Sacred Ground':
    'Traits=Cleric,Consecration,Divine,Exploration ' +
    'Require="level >= 4","features.Harmful Font || feature.Healing Font"',
  'Cast Down':
    Pathfinder2E.FEATS['Cast Down']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 6"',
  'Divine Rebuttal':'Traits=Cleric,Divine Require="level >= 6"',
  'Divine Weapon':Pathfinder2E.FEATS['Divine Weapon'],
  'Magic Hands':'Traits=Cleric Require="level >= 6","features.Healing Hands"',
  'Selective Energy':Pathfinder2E.FEATS['Selective Energy'],
  // Steady Spellcasting as above
  'Advanced Domain (%domain)':Pathfinder2E.FEATS['Advanced Domain (%domain)'],
  'Cremate Undead':Pathfinder2E.FEATS['Cremate Undead'],
  'Emblazon Energy':Pathfinder2E.FEATS['Emblazon Armament'],
  'Martyr':'Traits=Cleric,Spellshape Require="level >= 8"',
  'Restorative Channel':Pathfinder2E.FEATS['Channeled Succor'],
  'Sanctify Armament':
    Pathfinder2E.FEATS['Align Armament (Chaotic)']
    .replace(',Evocation', '') + ' ' +
    'Require="level >= 8","traits.Holy || traits.Unholy"',
  'Surging Focus':'Traits=Cleric Require="level >= 8"',
  'Void Siphon':'Traits=Cleric Require="level >= 8"',
  'Zealous Rush':'Traits=Cleric Require="level >= 8"',
  'Castigating Weapon':
    Pathfinder2E.FEATS['Castigating Weapon']
    .replace('Holy', 'Divine'),
  'Heroic Recovery':
    Pathfinder2E.FEATS['Heroic Recovery']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 10","features.Healing Font"',
  'Replenishment Of War':Pathfinder2E.FEATS['Replenishment Of War'],
  'Shared Avoidance':
    'Traits=Cleric Require="level >= 10","features.Premonition Of Avoidance"',
  'Shield Of Faith':
    'Traits=Cleric Require="level >= 10","features.Domain Initiate"',
  'Defensive Recovery':
    Pathfinder2E.FEATS['Defensive Recovery']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 12"',
  'Domain Focus':
    Pathfinder2E.FEATS['Domain Focus'] + ' ' +
    'Require="level >= 12"',
  'Emblazon Antimagic':Pathfinder2E.FEATS['Emblazon Antimagic'],
  'Fortunate Relief':'Traits=Cleric,Fortune Require="level >= 12"',
  'Sapping Symbol':
    'Traits=Cleric,Divine Require="level >= 12","features.Raise Symbol"',
  'Shared Replenishment':Pathfinder2E.FEATS['Shared Replenishment'],
  'Channeling Block':
    'Traits=Cleric Require="level >= 14","features.Shield Block"',
  "Deity's Protection":Pathfinder2E.FEATS["Deity's Protection"],
  'Ebb And Flow':
    'Traits=Cleric,Concentrate,Spellshape ' +
    'Require="level >= 14","features.Versatile Font"',
  'Fast Channel':Pathfinder2E.FEATS['Fast Channel'],
  'Lasting Armament':
    Pathfinder2E.FEATS['Extend Armament Alignment']
    .replace('Align', 'Sanctify'),
  'Premonition Of Clarity':'Traits=Cleric,Fortune Require="level >= 14"',
  'Swift Banishment':Pathfinder2E.FEATS['Swift Banishment'],
  'Eternal Bane':
    Pathfinder2E.FEATS['Eternal Bane'] + ' ' +
    'Require="level >= 16","traits.Unholy"',
  'Eternal Blessing':
    Pathfinder2E.FEATS['Eternal Blessing'] + ' ' +
    'Require="level >= 16","traits.Holy"',
  'Rebounding Smite':
    'Traits=Cleric Require="level >= 16","features.Channel Smite"',
  'Remediate':'Traits=Cleric,Concentrate,Spellshape Require="level >= 16"',
  'Resurrectionist':Pathfinder2E.FEATS.Resurrectionist,
  'Divine Apex':'Traits=Cleric Require="level >= 18"',
  'Echoing Channel':
    Pathfinder2E.FEATS['Deadly Simplicity']
    .replace('Metamagic', 'Spellshape'),
  'Improved Swift Banishment':Pathfinder2E.FEATS['Improved Swift Banishment'],
  'Inviolable':'Traits=Cleric Require="level >= 18"',
  'Miraculous Possibility':'Traits=Cleric Require="level >= 18"',
  'Shared Clarity':
    'Traits=Cleric Require="level >= 18","features.Premonition Of Clarity"',
  "Avatar's Audience":Pathfinder2E.FEATS["Avatar's Audience"],
  "Avatar's Protection":'Traits=Cleric Require="level >= 20"',
  'Maker Of Miracles':Pathfinder2E.FEATS['Maker Of Miracles'],
  'Spellshape Channel':Pathfinder2E.FEATS['Metamagic Channel'],

  // Druid
  'Animal Companion':Pathfinder2E.FEATS['Animal Companion'],
  // Changes from Wild Empathy
  'Animal Empathy':
    'Traits=Druid,Ranger ' +
    'Require="levels.Druid >= 1 || levels.Ranger >= 2"',
  'Leshy Familiar':Pathfinder2E.FEATS['Leshy Familiar'],
  // Note: Feat 1 Plant Empathy links to legacy Feat 6 Druid Empathy in Nethys
  'Plant Empathy':'Traits=Druid',
  // Reach Spell as above
  'Storm Born':Pathfinder2E.FEATS['Storm Born'],
  'Verdant Weapon':'Traits=Druid,Exploration',
  'Widen Spell':
    Pathfinder2E.FEATS['Widen Spell']
    .replace('Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Oracle,Witch,'),
  'Untamed Form':
    Pathfinder2E.FEATS['Wild Shape']
    .replace('Wild', 'Untamed'),
  'Call Of The Wild':Pathfinder2E.FEATS['Call Of The Wild'],
  'Enhanced Familiar':
    Pathfinder2E.FEATS['Enhanced Familiar']
    .replace('Traits=', 'Traits=Witch,'),
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
  'Elemental Summons':'Traits=Druid Require="level >= 4"',
  'Forest Passage':Pathfinder2E.FEATS['Woodland Stride'],
  'Form Control':
    Pathfinder2E.FEATS['Form Control']
    .replace('Metamagic', 'Spellshape') + ' ' +
    'Require="level >= 4","features.Untamed Form"',
  'Leshy Familiar Secrets':'Traits=Druid Require="level >=4","inLeafOrder"',
  'Mature Animal Companion':Pathfinder2E.FEATS['Mature Animal Companion'],
  'Order Magic (Animal)':Pathfinder2E.FEATS['Order Magic (Animal)'],
  'Order Magic (Leaf)':Pathfinder2E.FEATS['Order Magic (Leaf)'],
  'Order Magic (Storm)':Pathfinder2E.FEATS['Order Magic (Storm)'],
  'Order Magic (Untamed)':
    Pathfinder2E.FEATS['Order Magic (Wild)']
    .replace('Wild', 'Untamed'),
  'Snowdrift Spell':
    'Traits=Druid,Cold,Manipulate,Spellshape ' +
    'Require="level >= 4","inStormOrder"',
  'Current Spell':'Traits=Druid,Concentrate,Spellshape Require="level >= 6"',
  'Grown Of Oak':'Traits=Druid Require="level >= 6","inLeafOrder"',
  'Insect Shape':
    Pathfinder2E.FEATS['Insect Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Instinctive Support':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Animal Companion"',
  // Steady Spellcasting as above
  'Storm Retribution':
    Pathfinder2E.FEATS['Storm Retribution']
    .replace(' Evo', ''),
  'Deimatic Display':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 8",' +
      '"rank.Intimidation >= 1"',
  'Ferocious Shape':
    Pathfinder2E.FEATS['Ferocious Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Fey Caller':Pathfinder2E.FEATS['Fey Caller'],
  'Floral Restoration':
    'Traits=Druid,Healing,Vitality Require="level >= 8","inLeafOrder"',
  'Incredible Companion':Pathfinder2E.FEATS['Incredible Companion'],
  'Raise Menhir':'Traits=Druid Require="level >= 8"',
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
    Pathfinder2E.FEATS['Plant Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Primal Howl':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Incredible Companion"',
  'Pristine Weapon':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Verdant Weapon"',
  'Side By Side':Pathfinder2E.FEATS['Side By Side'],
  'Thunderclap Spell':
    'Traits=Druid,Sonic,Spellshape Require="level >= 10","inStormOrder"',
  'Dragon Shape':Pathfinder2E.FEATS['Dragon Shape'],
  // errata correct plant order to leaf order
  'Garland Spell':
    'Traits=Druid,Manipulate,Spellshape Require="level >= 12","inLeafOrder"',
  // Note: also subsumes legacy Feat 18 Primal Wellspring
  'Primal Focus':Pathfinder2E.FEATS['Primal Focus'],
  'Primal Summons':Pathfinder2E.FEATS['Primal Summons'],
  'Wandering Oasis':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 12",' +
      '"rank.Survival >= 3"',
  'Reactive Transformation':
    'Traits=Druid ' +
    'Require=' +
      '"level >= 14",' +
      '"features.Untamed Form",' +
      '"features.Dragon Shape || ' +
       'features.Elemental Shape || ' +
       'features.Plant Shape || ' +
       'features.Soaring Shape"',
  'Sow Spell':'Traits=Druid,Concentrate,Spellshape Require="level >= 14"',
  'Specialized Companion':Pathfinder2E.FEATS['Specialized Companion'],
  'Timeless Nature':Pathfinder2E.FEATS['Timeless Nature'],
  'Verdant Metamorphosis':Pathfinder2E.FEATS['Verdant Metamorphosis'],
  // Effortless Concentration as above
  'Impaling Briars':Pathfinder2E.FEATS['Impaling Briars'],
  'Monstrosity Shape':
    Pathfinder2E.FEATS['Monstrosity Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Uplifting Winds':'Traits=Druid Require="level >= 16","inStormOrder"',
  'Invoke Disaster':Pathfinder2E.FEATS['Invoke Disaster'],
  'Perfect Form Control':Pathfinder2E.FEATS['Perfect Form Control'],
  'Primal Aegis':'Traits=Druid Require="level >= 18"',
  "Hierophant's Power":Pathfinder2E.FEATS["Hierophant's Power"],
  'Ley Line Conduit':
    Pathfinder2E.FEATS['Leyline Conduit']
    .replace('Metamagic', 'Spellshape'),
  'True Shapeshifter':
    Pathfinder2E.FEATS['True Shapeshifter']
    .replace('Wild Shape', 'Untamed Form'),

  // Fighter
  'Combat Assessment':'Traits=Fighter',
  'Double Slice':Pathfinder2E.FEATS['Double Slice'],
  'Exacting Strike':Pathfinder2E.FEATS['Exacting Strike'],
  'Point Blank Stance':
    Pathfinder2E.FEATS['Point-Blank Shot']
    .replace(',Open', ''),
  'Reactive Shield':Pathfinder2E.FEATS['Reactive Shield'],
  'Snagging Strike':Pathfinder2E.FEATS['Snagging Strike'],
  'Sudden Charge':
    Pathfinder2E.FEATS['Sudden Charge']
    .replace(',Open', ''),
  'Vicious Swing':Pathfinder2E.FEATS['Power Attack'],
  'Aggressive Block':Pathfinder2E.FEATS['Aggressive Block'],
  'Assisting Shot':Pathfinder2E.FEATS['Assisting Shot'],
  'Blade Brake':'Traits=Fighter,Manipulate Require="level >= 2"',
  'Brutish Shove':Pathfinder2E.FEATS['Brutish Shove'],
  'Combat Grab':Pathfinder2E.FEATS['Combat Grab'],
  'Dueling Parry':Pathfinder2E.FEATS['Dueling Parry'],
  'Intimidating Strike':
    Pathfinder2E.FEATS['Intimidating Strike']
    .replace('Traits=', 'Traits=Barbarian,'),
  'Lightning Swap':'Traits=Fighter,Flourish Require="level >= 2"',
  'Lunge':Pathfinder2E.FEATS.Lunge,
  'Rebounding Toss':'Traits=Fighter,Flourish Require="level >= 2"',
  'Sleek Reposition':'Traits=Fighter,Press Require="level >= 2"',
  'Barreling Charge':
    'Traits=Barbarian,Fighter,Flourish ' +
    'Require="level >= 4","rank.Athletics >= 1"',
  'Double Shot':Pathfinder2E.FEATS['Double Shot'],
  'Dual-Handed Assault':Pathfinder2E.FEATS['Dual-Handed Assault'],
  'Parting Shot':'Traits=Fighter Require="level >= 4"',
  'Powerful Shove':Pathfinder2E.FEATS['Powerful Shove'],
  'Quick Reversal':Pathfinder2E.FEATS['Quick Reversal'],
  'Shielded Stride':Pathfinder2E.FEATS['Shielded Stride'],
  'Slam Down':Pathfinder2E.FEATS.Knockdown,
  'Swipe':Pathfinder2E.FEATS.Swipe,
  'Twin Parry':Pathfinder2E.FEATS['Twin Parry'],
  'Advanced Weapon Training':Pathfinder2E.FEATS['Advanced Weapon Training'],
  'Advantageous Assault':Pathfinder2E.FEATS['Advantageous Assault'],
  'Dazing Blow':'Traits=Fighter,Press Require="level >= 6"',
  'Disarming Stance':Pathfinder2E.FEATS['Disarming Stance'],
  'Furious Focus':
    Pathfinder2E.FEATS['Furious Focus']
    .replace('Power Attack', 'Vicious Swing'),
  "Guardian's Deflection":
    Pathfinder2E.FEATS["Guardian's Deflection"]
    .replace('Traits=', 'Traits=Swashbuckler,'),
  'Reflexive Shield':Pathfinder2E.FEATS['Reflexive Shield'],
  'Revealing Stab':Pathfinder2E.FEATS['Revealing Stab'],
  'Ricochet Stance':
    'Traits=Fighter,Rogue,Stance ' +
    'Require="levels.Fighter >= 6 || levels.Rogue >= 8"',
  'Shatter Defenses':Pathfinder2E.FEATS['Shatter Defenses'],
  'Shield Warden':
    'Traits=Champion,Fighter Require="level >=6","features.Shield Block"',
  'Triple Shot':Pathfinder2E.FEATS['Triple Shot'],
  'Blind-Fight':
    Pathfinder2E.FEATS['Blind-Fight']
    .replace('Traits=', 'Traits=Investigator,'),
  'Disorienting Opening':
    'Traits=Fighter Require="level >= 8","features.Reactive Strike"',
  'Dueling Riposte':Pathfinder2E.FEATS['Dueling Riposte'],
  'Felling Strike':Pathfinder2E.FEATS['Felling Strike'],
  'Incredible Aim':Pathfinder2E.FEATS['Incredible Aim'],
  'Mobile Shot Stance':Pathfinder2E.FEATS['Mobile Shot Stance'],
  'Positioning Assault':Pathfinder2E.FEATS['Positioning Assault'],
  'Quick Shield Block':
    'Traits=Champion,Fighter ' +
    'Require="level >= 8","features.Shield Block"',
  'Resounding Bravery':'Traits=Fighter Require="level >= 8","features.Bravery"',
  'Sudden Leap':'Traits=Fighter Require="level >= 8"',
  'Agile Grace':Pathfinder2E.FEATS['Agile Grace'],
  'Certain Strike':Pathfinder2E.FEATS['Certain Strike'],
  'Crashing Slam':
    Pathfinder2E.FEATS['Improved Knockdown']
    .replace('Knockdown', 'Slam Down'),
  'Cut From The Air':'Traits=Fighter Require="level >= 10"',
  'Debilitating Shot':Pathfinder2E.FEATS['Debilitating Shot'],
  'Disarming Twist':Pathfinder2E.FEATS['Disarming Twist'],
  'Disruptive Stance':Pathfinder2E.FEATS['Disruptive Stance'],
  'Fearsome Brute':Pathfinder2E.FEATS['Fearsome Brute'],
  'Flinging Charge':'Traits=Fighter,Flourish Require="level >= 10"',
  'Mirror Shield':Pathfinder2E.FEATS['Mirror Shield'],
  'Overpowering Charge':
    'Traits=Barbarian,Fighter ' +
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
  'Opening Stance':'Traits=Fighter Require="level >= 14"',
  'Two-Weapon Flurry':Pathfinder2E.FEATS['Two-Weapon Flurry'],
  'Whirlwind Strike':
    Pathfinder2E.FEATS['Whirlwind Strike']
    .replace(',Open', ''),
  'Graceful Poise':Pathfinder2E.FEATS['Graceful Poise'],
  'Improved Reflexive Shield':Pathfinder2E.FEATS['Improved Reflexive Shield'],
  'Master Of Many Styles':
    'Traits=Fighter,Monk ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Opening Stance || features.Reflexive Stance"',
  'Multishot Stance':
    Pathfinder2E.FEATS['Multishot Stance']
    .replace('Triple', 'Double'),
  'Overwhelming Blow':'Traits=Fighter Require="level >= 16"',
  'Twinned Defense':Pathfinder2E.FEATS['Twinned Defense'],
  'Impossible Volley':
    Pathfinder2E.FEATS['Impossible Volley']
    .replace(',Open', ''),
  'Savage Critical':Pathfinder2E.FEATS['Savage Critical'],
  'Smash From The Air':
    'Traits=Fighter Require="level >= 18","features.Cut From The Air"',
  'Boundless Reprisals':Pathfinder2E.FEATS['Boundless Reprisals'],
  'Ultimate Flexibility':
    'Traits=Fighter ' +
    'Require="level >= 20","features.Improved Flexibility"',
  'Weapon Supremacy':Pathfinder2E.FEATS['Weapon Supremacy'],

  // Ranger
  // Animal Companion as above
  'Crossbow Ace':Pathfinder2E.FEATS['Crossbow Ace'],
  'Hunted Shot':Pathfinder2E.FEATS['Hunted Shot'],
  'Initiate Warden':'Traits=Ranger',
  'Monster Hunter':Pathfinder2E.FEATS['Monster Hunter'],
  'Twin Takedown':Pathfinder2E.FEATS['Twin Takedown'],
  // Animal Empathy as above
  'Favored Terrain (%terrain)':Pathfinder2E.FEATS['Favored Terrain (%terrain)'],
  "Hunter's Aim":Pathfinder2E.FEATS["Hunter's Aim"],
  'Monster Warden':Pathfinder2E.FEATS['Monster Warden'],
  'Quick Draw':Pathfinder2E.FEATS['Quick Draw'],
  'Advanced Warden':
    'Traits=Ranger Require="level >= 4","features.Initiate Warden"',
  "Companion's Cry":Pathfinder2E.FEATS["Companion's Cry"],
  'Disrupt Prey':Pathfinder2E.FEATS['Disrupt Prey'],
  'Far Shot':Pathfinder2E.FEATS['Far Shot'],
  'Favored Prey':Pathfinder2E.FEATS['Favored Enemy'],
  'Running Reload':Pathfinder2E.FEATS['Running Reload'],
  "Scout's Warning":Pathfinder2E.FEATS["Scout's Warning"],
  // Twin Parry as above
  'Additional Recollection':'Traits=Ranger Require="level >= 6"',
  'Masterful Warden':
    'Traits=Ranger Require="level >= 6","features.Initiate Warden"',
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
    'Traits=Ranger Require="level >= 10","features.Initiate Warden"',
  'Penetrating Shot':
    Pathfinder2E.FEATS['Penetrating Shot']
    .replace(',Open', ''),
  // Twin Riposte as above; Nethys omits Twin Parry prereq, as does Fighter
  "Warden's Step":Pathfinder2E.FEATS["Warden's Step"],
  'Distracting Shot':Pathfinder2E.FEATS['Distracting Shot'],
  'Double Prey':Pathfinder2E.FEATS['Double Prey'],
  'Second Sting':Pathfinder2E.FEATS['Second Sting'],
  // Side By Side as above
  "Warden's Focus":
    'Traits=Ranger Require="level >= 12","features.Initiate Warden"',
  'Sense The Unseen':
    Pathfinder2E.FEATS['Sense The Unseen']
    .replace('Traits=', 'Traits=Investigator,'),
  'Shared Prey':Pathfinder2E.FEATS['Shared Prey'],
  'Stealthy Companion':Pathfinder2E.FEATS['Stealthy Companion'],
  "Warden's Guidance":Pathfinder2E.FEATS["Warden's Guidance"],
  'Greater Distracting Shot':Pathfinder2E.FEATS['Greater Distracting Shot'],
  // Improved Twin Riposte as above
  'Legendary Monster Hunter':Pathfinder2E.FEATS['Legendary Monster Hunter'],
  // Specialized Companion as above
  "Warden's Reload":'Traits=Ranger Require="level >= 16"',
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
  'Overextending Feint':'Traits=Rogue Require="rank.Deception >= 1"',
  'Plant Evidence':'Traits=Rogue Require="features.Pickpocket"',
  'Trap Finder':
    Pathfinder2E.FEATS['Trap Finder']
    .replace('Traits=', 'Traits=Investigator,'),
  'Tumble Behind':
    'Traits=Rogue,Swashbuckler ' +
    'Require="levels.Rogue >= 1 || levels.Swashbuckler >= 2"',
  'Twin Feint':Pathfinder2E.FEATS['Twin Feint'],
  "You're Next":
    Pathfinder2E.FEATS["You're Next"]
    .replace('Traits=', 'Traits=Swashbuckler,'),
  'Brutal Beating':Pathfinder2E.FEATS['Brutal Beating'],
  'Clever Gambit':'Traits=Rogue Require="level >=2","features.Mastermind"',
  'Distracting Feint':Pathfinder2E.FEATS['Distracting Feint'],
  'Mobility':Pathfinder2E.FEATS.Mobility,
  // Quick Draw as above
  'Strong Arm':'Traits=Rogue Require="level >= 2"',
  'Unbalancing Blow':Pathfinder2E.FEATS['Unbalancing Blow'],
  'Underhanded Assault':'Traits=Rogue Require="level >= 2","rank.Stealth >= 1"',
  'Dread Striker':Pathfinder2E.FEATS['Dread Striker'],
  'Head Stomp':'Traits=Rogue Require="level >= 4"',
  'Mug':'Traits=Rogue Require="level >= 4"',
  'Poison Weapon':Pathfinder2E.FEATS['Poison Weapon'],
  'Predictable!':'Traits=Rogue Require="level >= 4"',
  'Reactive Pursuit':Pathfinder2E.FEATS['Reactive Pursuit'],
  'Sabotage':Pathfinder2E.FEATS.Sabotage,
  "Scoundrel's Surprise":'Traits=Rogue,Manipulate Require="level >= 4"',
  // Scout's Warning as above
  'The Harder They Fall':'Traits=Rogue Require="level >= 4"',
  'Twin Distraction':'Traits=Rogue Require="level >= 4","features.Twin Feint"',
  // Note: "sneak attack 2d6" requirement is met by Rogue level 5
  'Analyze Weakness':
    'Traits=Rogue Require="level >= 6","features.Sneak Attack"',
  'Anticipate Ambush':
    'Traits=Rogue,Exploration Require="level >= 6","rank.Stealth >= 2"',
  'Far Throw':'Traits=Rogue Require="level >= 6"',
  'Gang Up':Pathfinder2E.FEATS['Gang Up'],
  'Light Step':Pathfinder2E.FEATS['Light Step'],
  'Shove Down':'Traits=Rogue Require="level >= 6","rank.Athletics >= 1"',
  // Skirmish Strike as above
  'Sly Disarm':'Traits=Rogue Require="level >= 6"',
  'Twist The Knife':Pathfinder2E.FEATS['Twist The Knife'],
  'Watch Your Back':
    'Traits=Rogue,Emotion,Fear,Mental ' +
    'Require="level >= 6","rank.Intimidation >= 1"',
  // Blind-Fight as above
  'Bullseye':'Traits=Rogue Require="level >= 8"',
  'Delay Trap':Pathfinder2E.FEATS['Delay Trap'],
  'Improved Poison Weapon':Pathfinder2E.FEATS['Improved Poison Weapon'],
  'Inspired Stratagem':'Traits=Rogue Require="level >= 8"',
  'Nimble Roll':Pathfinder2E.FEATS['Nimble Roll'],
  'Opportune Backstab':Pathfinder2E.FEATS['Opportune Backstab'],
  'Predictive Purchase':
    'Traits=Rogue,Investigator ' +
    'Require="levels.Rogue >= 8 || levels.Investigator >= 6"',
  // Ricochet Stance as above
  'Sidestep':Pathfinder2E.FEATS.Sidestep,
  'Sly Striker':Pathfinder2E.FEATS['Sly Striker'],
  'Swipe Souvenir':'Traits=Rogue Require="level >= 8"',
  'Tactical Entry':'Traits=Rogue Require="level >= 8","rank.Stealth >= 3"',
  'Methodical Debilitations':
    'Traits=Rogue ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Mastermind",' +
      '"features.Debilitating Strike"',
  'Nimble Strike':'Traits=Rogue Require="level >= 10","features.Nimble Roll"',
  'Precise Debilitations':Pathfinder2E.FEATS['Precise Debilitations'],
  'Sneak Adept':Pathfinder2E.FEATS['Sneak Savant'],
  'Tactical Debilitations':Pathfinder2E.FEATS['Tactical Debilitations'],
  'Vicious Debilitations':Pathfinder2E.FEATS['Vicious Debilitations'],
  'Bloody Debilitation':
    'Traits=Rogue ' +
    'Require="level >= 12","rank.Medicine >= 1","features.Debilitating Strike"',
  'Critical Debilitation':Pathfinder2E.FEATS['Critical Debilitation'],
  'Fantastic Leap':Pathfinder2E.FEATS['Fantastic Leap'],
  'Felling Shot':Pathfinder2E.FEATS['Felling Shot'],
  'Preparation':'Traits=Rogue,Flourish Require="level >= 12"',
  'Reactive Interference':Pathfinder2E.FEATS['Reactive Interference'],
  'Ricochet Feint':
    'Traits=Rogue Require="level >= 12","features.Ricochet Stance"',
  'Spring From The Shadows':Pathfinder2E.FEATS['Spring From The Shadows'],
  'Defensive Roll':Pathfinder2E.FEATS['Defensive Roll'],
  'Instant Opening':Pathfinder2E.FEATS['Instant Opening'],
  'Leave An Opening':Pathfinder2E.FEATS['Leave An Opening'],
  // Sense The Unseen as above
  'Stay Down!':'Traits=Rogue Require="level >= 14","rank.Athletics >= 3"',
  'Blank Slate':Pathfinder2E.FEATS['Blank Slate'],
  'Cloud Step':Pathfinder2E.FEATS['Cloud Step'],
  'Cognitive Loophole':Pathfinder2E.FEATS['Cognitive Loophole'],
  'Dispelling Slice':Pathfinder2E.FEATS['Dispelling Slice'],
  'Perfect Distraction':Pathfinder2E.FEATS['Perfect Distraction'],
  'Reconstruct The Scene':
    'Traits=Rogue,Investigator,Concentrate Require="level >= 16"',
  'Swift Elusion':'Traits=Rogue Require="level >= 16","rank.Acrobatics >= 4"',
  'Implausible Infiltration':Pathfinder2E.FEATS['Implausible Infiltration'],
  'Implausible Purchase':
    'Traits=Rogue,Investigator ' +
    'Require=' +
      '"levels.Rogue >= 18 || levels.Investigator >= 16",' +
      '"features.Predictive Purchase"',
  'Powerful Sneak':Pathfinder2E.FEATS['Powerful Sneak'],
  'Hidden Paragon':Pathfinder2E.FEATS['Hidden Paragon'],
  'Impossible Striker':Pathfinder2E.FEATS['Impossible Striker'],
  'Reactive Distraction':Pathfinder2E.FEATS['Reactive Distraction'],

  // Witch
  'Cackle':'Traits=Witch',
  'Cauldron':'Traits=Witch',
  'Counterspell':
    Pathfinder2E.FEATS.Counterspell.replace('Traits=', 'Traits=Witch,'),
  // Widen Spell as above
  "Witch's Armaments (Eldritch Nails)":'Traits=Witch',
  "Witch's Armaments (Iron Teeth)":'Traits=Witch',
  "Witch's Armaments (Living Hair)":'Traits=Witch',
  'Basic Lesson (Dreams)':'Traits=Witch Require="level >= 2"',
  'Basic Lesson (Elements)':'Traits=Witch Require="level >= 2"',
  'Basic Lesson (Life)':'Traits=Witch Require="level >= 2"',
  'Basic Lesson (Protection)':'Traits=Witch Require="level >= 2"',
  'Basic Lesson (Vengeance)':'Traits=Witch Require="level >= 2"',
  // Cantrip Expansion as above
  'Conceal Spell':
    Pathfinder2E.FEATS['Conceal Spell']
    .replace('Manipulate,Metamagic', 'Spellshape')
    .replace('Traits=', 'Traits=Witch,'),
  // Enhanced Familiar as above
  "Familiar's Language":'Traits=Witch Require="level >= 2","features.Familiar"',
  'Rites Of Convocation':'Traits=Witch Require="level >= 4"',
  'Sympathetic Strike':
    'Traits=Witch Require="level >= 4","features.Witch\'s Armaments"',
  'Ceremonial Knife':'Traits=Witch Require="level >= 6"',
  'Greater Lesson (Mischief)':'Traits=Witch Require="level >= 6"',
  'Greater Lesson (Shadow)':'Traits=Witch Require="level >= 6"',
  'Greater Lesson (Snow)':'Traits=Witch Require="level >= 6"',
  // Steady Spellcasting as above
  "Witch's Charge":'Traits=Witch,Detection Require="level >= 6"',
  'Incredible Familiar':
    'Traits=Witch Require="level >= 8","features.Enhanced Familiar"',
  'Murksight':'Traits=Witch Require="level >= 8"',
  'Spirit Familiar':
    'Traits=Witch ' +
    'Require=' +
      '"level >= 8",' +
      '"witchTraditions =~ \'Divine|Occult\'"',
  'Stitched Familiar':
    'Traits=Witch ' +
    'Require="' +
      'level >= 8",' +
      '"witchTraditions =~ \'Arcane|Primal\'"',
  "Witch's Bottle":'Traits=Witch Require="level >= 8","features.Cauldron"',
  'Double, Double':'Traits=Witch Require="level >= 10","features.Cauldron"',
  'Major Lesson (Death)':'Traits=Witch Require="level >= 10"',
  'Major Lesson (Renewal)':'Traits=Witch Require="level >= 10"',
  // Quickened Casting as above
  "Witch's Communion":
    'Traits=Witch Require="level >= 10","features.Witch\'s Charge"',
  'Coven Spell':'Traits=Witch,Spellshape Require="level >= 12"',
  'Hex Focus':'Traits=Witch Require="level >= 12"',
  "Witch's Broom":'Traits=Witch Require="level >= 12"',
  'Reflect Spell':
    Pathfinder2E.FEATS['Reflect Spell']
    .replace('Traits=', 'Traits=Witch,'),
  'Rites Of Transfiguration':'Traits=Witch Require="level >= 14"',
  "Patron's Presence":'Traits=Witch Require="level >= 14"',
  // Effortless Concentration as above
  'Siphon Power':'Traits=Witch Require="level >= 16"',
  'Split Hex':'Traits=Witch,Concentrate,Spellshape Require="level >= 18"',
  "Patron's Claim":'Traits=Witch Require="level >= 18"',
  'Hex Master':'Traits=Witch Require="level >= 20"',
  "Patron's Truth":
    'Traits=Witch Require="level >= 20","features.Patron\'s Gift"',
  "Witch's Hut":'Traits=Witch Require="level >= 20"',

  // Wizard
  // Counterspell as above
  'Familiar':Pathfinder2E.FEATS.Familiar,
  // Reach Spell as above
  'Spellbook Prodigy':'Traits=Wizard Require="rank.Arcana >= 1"',
  // Widen Spell as above
  // Cantrip Expansion as above
  // Conceal Spell as above
  'Energy Ablation':'Traits=Wizard,Spellshape Require="level >= 2"',
  // Enhanced Familiar as above
  'Nonlethal Spell':'Traits=Wizard,Manipulate,Spellshape Require="level >= 2"',
  'Bespell Strikes':
    Pathfinder2E.FEATS['Bespell Weapon']
    .replace('Traits=', 'Traits=Oracle,'),
  'Call Wizardly Tools':
    'Traits=Wizard,Concentrate,Teleportation ' +
    'Require="level >= 4","features.Arcane Bond"',
  'Linked Focus':
    Pathfinder2E.FEATS['Linked Focus']
    .replace('Arcane School', 'Curriculum'),
  'Spell Protection Array':
    'Traits=Wizard,Arcane,Manipulate Require="level >= 4"',
  'Convincing Illusion':
    'Traits=Wizard Require="level >= 6","rank.Deception >= 2"',
  'Explosive Arrival':
    'Traits=Wizard,Concentrate,Manipulate,Spellshape Require="level >= 6"',
  'Irresistible Magic':Pathfinder2E.FEATS['Spell Penetration'],
  'Split Slot':'Traits=Wizard Require="level >= 6"',
  // Steady Spellcasting as above
  'Advanced School Spell':Pathfinder2E.FEATS['Advanced School Spell'],
  'Bond Conservation':
    Pathfinder2E.FEATS['Bond Conservation']
    .replace('Metamagic', 'Spellshape'),
  'Form Retention':'Traits=Wizard Require="level >= 8"',
  'Knowledge Is Power':'Traits=Wizard Require="level >= 8"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Adept':
    Pathfinder2E.FEATS['Scroll Savant'] + ' ' +
    'Require="level >= 10"',
  'Clever Counterspell':Pathfinder2E.FEATS['Clever Counterspell'],
  'Forcible Energy':'Traits=Wizard,Manipulate,Spellshape Require="level >= 12"',
  'Keen Magical Detection':'Traits=Wizard,Fortune Require="level >= 12"',
  // Note: oracle replaces Arcane trait with Divine
  'Magic Sense':
    Pathfinder2E.FEATS['Magic Sense']
    .replace(',Divination', '')
    .replace('Traits=', 'Traits=Oracle,'),
  'Bonded Focus':Pathfinder2E.FEATS['Bonded Focus'],
  // Reflect Spell as above
  'Secondary Detonation Array':
    'Traits=Wizard,Manipulate,Spellshape Require="level >= 14"',
  'Superior Bond':Pathfinder2E.FEATS['Superior Bond'],
  // Effortless Concentration as above
  'Scintillating Spell':
    'Traits=Wizard,Sorcerer,Concentrate,Light,Spellshape Require="level >= 16"',
  'Spell Tinker':Pathfinder2E.FEATS['Spell Tinker'],
  'Infinite Possibilities':Pathfinder2E.FEATS['Infinite Possibilities'],
  'Reprepare Spell':Pathfinder2E.FEATS['Reprepare Spell'],
  'Second Thoughts':'Traits=Wizard,Concentrate,Mental Require="level >= 18"',
  "Archwizard's Might":Pathfinder2E.FEATS["Archwizard's Might"],
  'Spell Combination':Pathfinder2E.FEATS['Spell Combination'],
  'Spell Mastery':'Traits=Wizard Require="level >= 20"',
  'Spellshape Mastery':Pathfinder2E.FEATS['Metamagic Mastery'],

  // Player Core 2

  // Alchemist
  'Alchemical Familiar':Pathfinder2E.FEATS['Alchemical Familiar'],
  'Alchemical Assessment':Pathfinder2E.FEATS['Alchemical Savant'],
  'Blowgun Poisoner':'Traits=Alchemist',
  'Far Lobber':Pathfinder2E.FEATS['Far Lobber'],
  'Quick Bomber':Pathfinder2E.FEATS['Quick Bomber'],
  'Soothing Vials':'Traits=Alchemist Require="features.Chirurgeon"',
  'Clotting Elixirs':'Traits=Alchemist Require="level >= 2"',
  'Improvise Admixture':
    'Traits=Alchemist,Concentrate,Manipulate Require="level >= 2"',
  'Pernicious Poison':'Traits=Alchemist Require="level >= 2"',
  'Revivifying Mutagen':
    Pathfinder2E.FEATS['Revivifying Mutagen']
    .replace('Traits=', 'Traits=Concentrate,'),
  'Smoke Bomb':
    Pathfinder2E.FEATS['Smoke Bomb']
    .replace('Additive 1', 'Additive'),
  'Efficient Alchemy':Pathfinder2E.FEATS['Efficient Alchemy'],
  'Enduring Alchemy':Pathfinder2E.FEATS['Enduring Alchemy'],
  'Healing Bomb':'Traits=Alchemist,Additive Require="level >= 4"',
  'Invigorating Elixir':'Traits=Alchemist,Additive Require="level >= 4"',
  'Regurgitate Mutagen':'Traits=Alchemist,Manipulate Require="level >= 4"',
  'Tenacious Toxins':'Traits=Alchemist Require="level >= 4"',
  'Combine Elixirs':
    Pathfinder2E.FEATS['Combine Elixirs']
    .replace('Additive 2', 'Additive'),
  'Debilitating Bomb':
    Pathfinder2E.FEATS['Debilitating Bomb']
    .replace('Additive 2', 'Additive'),
  'Directional Bombs':Pathfinder2E.FEATS['Directional Bombs'],
  'Fortified Elixirs':'Traits=Alchemist Require="level >= 6"',
  'Sticky Poison':'Traits=Alchemist Require="level >= 6"',
  'Alter Admixture':'Traits=Alchemist,Exploration Require="level >= 8"',
  'Improved Invigorating Elixir (Mental)':
    'Traits=Alchemist Require="level >= 8","features.Invigorating Elixir"',
  'Improved Invigorating Elixir (Physical)':
    'Traits=Alchemist Require="level >= 8","features.Invigorating Elixir"',
  'Mutant Physique':'Traits=Alchemist Require="level >= 8"',
  'Pinpoint Poisoner':'Traits=Alchemist Require="level >= 8"',
  'Sticky Bomb':
    Pathfinder2E.FEATS['Sticky Bomb']
    .replace('Additive 2', 'Additive'),
  'Advanced Efficient Alchemy':
    'Traits=Alchemist Require="level >= 10","features.Efficient Alchemy"',
  'Expanded Splash':
    Pathfinder2E.FEATS['Expanded Splash'] + ' ' +
    'Require="level >= 10"',
  'Greater Debilitating Bomb':Pathfinder2E.FEATS['Greater Debilitating Bomb'],
  'Unstable Concoction':'Traits=Alchemist,Additive Require="level >= 10"',
  'Extend Elixir':Pathfinder2E.FEATS['Extend Elixir'],
  'Supreme Invigorating Elixir':
    'Traits=Alchemist Require="level >= 12","features.Invigorating Elixir"',
  'Uncanny Bombs':Pathfinder2E.FEATS['Uncanny Bombs'],
  'Double Poison':'Traits=Alchemist Require="level >= 14"',
  'Mutant Innervation':'Traits=Alchemist Require="level >= 14"',
  'True Debilitating Bomb':Pathfinder2E.FEATS['True Debilitating Bomb'],
  'Eternal Elixir':Pathfinder2E.FEATS['Eternal Elixir'],
  'Exploitive Bomb':
    Pathfinder2E.FEATS['Exploitive Bomb']
    .replace('Additive 2', 'Additive'),
  'Persistent Mutagen':Pathfinder2E.FEATS['Persistent Mutagen'],
  'Improbable Elixirs':Pathfinder2E.FEATS['Improbable Elixirs'],
  'Miracle Worker':Pathfinder2E.FEATS['Miracle Worker'],
  'Perfect Debilitation':Pathfinder2E.FEATS['Perfect Debilitation'],
  'Alchemical Revivification':'Traits=Alchemist Require="level >= 20"',
  "Craft Philosopher's Stone":Pathfinder2E.FEATS["Craft Philosopher's Stone"],
  // Changed traits and requirements
  'Mega Bomb':'Traits=Alchemist,Additive,Manipulate Require="level >= 20"',

  // Barbarian
  'Acute Vision':Pathfinder2E.FEATS['Acute Vision'],
  'Adrenaline Rush':'Traits=Barbarian,Rage',
  'Draconic Arrogance':
    'Traits=Barbarian,Rage Require="features.Dragon Instinct"',
  'Moment Of Clarity':Pathfinder2E.FEATS['Moment Of Clarity'],
  'Raging Intimidation':Pathfinder2E.FEATS['Raging Intimidation'],
  'Raging Thrower':Pathfinder2E.FEATS['Raging Thrower'],
  // Sudden Charge as above
  'Acute Scent':
    Pathfinder2E.FEATS['Acute Scent'] + ' ' +
    'Require="level >= 2"',
  'Bashing Charge':
    'Traits=Barbarian,Flourish Require="level >= 2","rank.Athletics >= 1"',
  'Furious Finish':Pathfinder2E.FEATS['Furious Finish'],
  // Intimidating Strike as above
  'No Escape':Pathfinder2E.FEATS['No Escape'],
  'Second Wind':Pathfinder2E.FEATS['Second Wind'],
  'Shake It Off':Pathfinder2E.FEATS['Shake It Off'],
  // Barreling Charge as above
  'Oversized Throw':'Traits=Barbarian,Rage Require="level >= 4"',
  'Raging Athlete':Pathfinder2E.FEATS['Raging Athlete'],
  'Scars Of Steel':
    'Traits=Barbarian,Rage Require="level >= 4","features.Fury Instinct"',
  'Spiritual Guides':
    'Traits=Barbarian,Fortune Require="level >= 4","features.Spirit Instinct"',
  'Supernatural Senses':
    // TODO features.Scent isn't a thing
    'Traits=Barbarian,Rage ' +
    'Require="level >= 4","features.Acute Scent || features.Scent"',
  // Swipe as above
  'Wounded Rage':Pathfinder2E.FEATS['Wounded Rage'],
  'Animal Skin':
    Pathfinder2E.FEATS['Animal Skin']
    .replace(',Transmutation', ''),
  'Brutal Bully':Pathfinder2E.FEATS['Brutal Bully'],
  'Cleave':Pathfinder2E.FEATS.Cleave,
  "Dragon's Rage Breath":
    Pathfinder2E.FEATS["Dragon's Rage Breath"] + ' ' +
    'Traits=Barbarian,Concentrate,Rage',
  "Giant's Stature":
    Pathfinder2E.FEATS["Giant's Stature"]
    .replace(',Transmutation', ''),
  'Inner Strength':
    'Traits=Barbarian,Concentrate,Rage ' +
    'Require="level >= 6","features.Spirit Instinct"',
  'Mage Hunter':
    'Traits=Barbarian,Rage ' +
    'Require="level >= 6","features.Superstition Instinct"',
  'Nocturnal Senses':
    'Traits=Barbarian,Rage ' +
    // TODO features.Scent isn't a thing
    'Require="level >= 6","features.Low-Light Vision || features.Scent"',
  'Reactive Strike':
    Pathfinder2E.FEATS['Attack Of Opportunity']
    .replace('Traits=', 'Traits=Swashbuckler,'),
  // TODO requires "instinct that allows you to change your Rage damage type"
  'Scouring Rage':'Traits=Barbarian Require="level >= 6"',
  "Spirits' Interference":
    Pathfinder2E.FEATS["Spirits' Interference"]
    .replace(',Necromancy', ''),
  'Animalistic Brutality':
    'Traits=Barbarian,Concentrate,Morph,Primal,Rage ' +
    'Require="level >= 8","features.Animal Instinct"',
  'Disarming Assault':
    'Traits=Barbarian,Flourish,Rage ' +
    'Require="level >= 8","rank.Athletics >= 1"',
  'Follow-Up Assault':'Traits=Barbarian,Rage Require="level >= 8"',
  'Friendly Toss':'Traits=Barbarian,Manipulate,Rage Require="level >= 8"',
  'Furious Bully':Pathfinder2E.FEATS['Furious Bully'],
  'Instinctive Strike':
    'Traits=Barbarian ' +
    // TODO features.Scent isn't a thing
    'Require="level >= 8","features.Acute Scent || features.Scent"',
  'Invulnerable Rager':'Traits=Barbarian Require="level >= 8"',
  'Renewed Vigor':Pathfinder2E.FEATS['Renewed Vigor'],
  'Share Rage':Pathfinder2E.FEATS['Share Rage'],
  // Sudden Leap as above
  'Thrash':Pathfinder2E.FEATS.Thrash,
  'Come And Get Me':Pathfinder2E.FEATS['Come And Get Me'],
  'Furious Sprint':Pathfinder2E.FEATS['Furious Sprint'],
  'Great Cleave':Pathfinder2E.FEATS['Great Cleave'],
  'Impressive Landing':'Traits=Barbarian Require="level >= 10"',
  'Knockback':Pathfinder2E.FEATS.Knockback,
  // Overpowering Charge as above
  'Resounding Blow':'Traits=Barbarian,Rage Require="level >= 10"',
  'Silencing Strike':
    'Traits=Barbarian,Incapacitation,Rage Require="level >= 10"',
  'Tangle Of Battle':'Traits=Barbarian,Rage Require="level >= 10"',
  'Terrifying Howl':
    Pathfinder2E.FEATS['Terrifying Howl'] + ' ' +
    'Require="level >= 10"',
  "Dragon's Rage Wings":
    Pathfinder2E.FEATS["Dragon's Rage Wings"] + ' ' +
    'Traits=Barbarian,Morph,Rage',
  'Embrace The Pain':'Traits=Barbarian,Rage Require="level >= 12"',
  'Furious Grab':Pathfinder2E.FEATS['Furious Grab'],
  "Predator's Pounce":
    Pathfinder2E.FEATS["Predator's Pounce"]
    .replace(',Open', ''),
  "Spirit's Wrath":Pathfinder2E.FEATS["Spirit's Wrath"],
  'Sunder Spell':
    'Traits=Barbarian,Attack,Concentrate,Rage ' +
    'Require="level >= 12","features.Superstition Instinct"',
  // Traits and requirements changed
  "Titan's Stature":
    'Traits=Barbarian Require="level >= 12","features.Giant\'s Stature"',
  'Unbalancing Sweep':
    'Traits=Barbarian,Flourish ' +
    'Require="level >= 12"',
  'Awesome Blow':Pathfinder2E.FEATS['Awesome Blow'],
  "Giant's Lunge":Pathfinder2E.FEATS["Giant's Lunge"],
  'Impaling Thrust':'Traits=Barbarian,Rage Require="level >= 14"',
  'Sunder Enchantment':
    'Traits=Barbarian Require="level >= 14","features.Sunder Spell"',
  'Vengeful Strike':Pathfinder2E.FEATS['Vengeful Strike'],
  // Whirlwind Strike as above
  'Collateral Thrash':Pathfinder2E.FEATS['Collateral Thrash'],
  'Desperate Wrath':Pathfinder2E.FEATS['Reckless Abandon'],
  // Changed traits and requirements
  'Dragon Transformation':
    'Traits=Barbarian,Concentrate,Polymorph,Primal,Rage ' +
    'Require="features.Dragon\'s Rage Wings"',
  'Furious Vengeance':
    'Traits=Barbarian,Rage Require="level >= 16","features.Fury Instinct"',
  'Penetrating Projectile':
    'Traits=Barbarian,Flourish,Rage Require="level >= 16"',
  'Shattering Blows':'Traits=Barbarian,Rage Require="level >= 16"',
  'Brutal Critical':Pathfinder2E.FEATS['Brutal Critical'],
  'Perfect Clarity':Pathfinder2E.FEATS['Perfect Clarity'],
  'Vicious Evisceration':Pathfinder2E.FEATS['Vicious Evisceration'],
  'Whirlwind Toss':
    'Traits=Barbarian,Rage Require="level >= 18","features.Collateral Thrash"',
  'Annihilating Swing':'Traits=Barbarian Require="level >= 20"',
  'Contagious Rage':Pathfinder2E.FEATS['Contagious Rage'],
  'Quaking Stomp':Pathfinder2E.FEATS['Quaking Stomp'],
  'Unstoppable Juggernaut':'Traits=Barbarian Require="level >= 20"',

  // Champion
  'Brilliant Flash':'Traits=Champion Require="features.Grandeur"',
  'Defensive Advance':'Traits=Champion,Flourish',
  "Deity's Domain (%domain)":Pathfinder2E.FEATS["Deity's Domain (%domain)"],
  'Desperate Prayer':'Traits=Champion',
  'Faithful Steed':'Traits=Champion',
  'Iron Repercussions':'Traits=Champion Require="features.Obedience"',
  'Nimble Reprisal':
    Pathfinder2E.FEATS['Ranged Reprisal']
    .replace('Paladin', 'Justice'),
  'Ongoing Selfishness':
    'Traits=Champion,Uncommon Require="features.Desecration"',
  'Unimpeded Step':
    Pathfinder2E.FEATS['Unimpeded Step']
    .replace('Liberator', 'Liberation'),
  'Vicious Vengeance':'Traits=Champion,Uncommon Require="features.Iniquity"',
  'Weight Of Guilt':
    Pathfinder2E.FEATS['Weight Of Guilt']
    .replace('Redeemer', 'Redemption'),
  'Divine Grace':Pathfinder2E.FEATS['Divine Grace'],
  // NOTE: level and requirements changed
  'Divine Health':
    Pathfinder2E.FEATS['Divine Health'] + ' ' +
    'Require="level >= 2"',
  'Aura Of Courage':
    Pathfinder2E.FEATS['Aura Of Courage'] + ' ' +
    'Require="level >= 4","features.Champion\'s Aura","traits.Holy"',
  'Aura Of Despair':
    'Traits=Champion,Uncommon ' +
    'Require="level >= 4","features.Champion\'s Aura","traits.Unholy"',
  'Cruelty':
    'Traits=Champion Require="level >= 4","spells.Touch Of The Void (D1 Foc)"',
  // Traits and requirements changed
  'Mercy (Body)':
    'Traits=Champion ' +
    'Require="level >= 4","spells.Lay On Hands (D1 Foc)"',
  'Mercy (Grace)':
    'Traits=Champion ' +
    'Require="level >= 4","spells.Lay On Hands (D1 Foc)"',
  'Mercy (Mind)':
    'Traits=Champion ' +
    'Require="level >= 4","spells.Lay On Hands (D1 Foc)"',
  'Security':
    'Traits=Champion ' +
    'Require="level >= 4","spells.Shields Of The Spirit (D1 Foc)"',
  'Expand Aura':
    'Traits=Champion,Concentrate ' +
    'Require="level >= 6","features.Champion\'s Aura"',
  'Loyal Warhorse':
    Pathfinder2E.FEATS['Loyal Warhorse']
    .replace('Steed Ally', 'Faithful Steed'),
  // Reactive Strike as above
  // Shield Warden as above
  // Traits and requirements changed
  'Smite':'Traits=Champion,Concentrate Require="level >= 6"',
  "Advanced Deity's Domain (%domain)":
    Pathfinder2E.FEATS["Advanced Deity's Domain (%domain)"],
  'Greater Cruelty':'Traits=Champion Require="level >= 8","features.Cruelty"',
  'Greater Mercy':Pathfinder2E.FEATS['Greater Mercy'],
  'Greater Security':'Traits=Champion Require="level >= 8","features.Security"',
  'Heal Mount':
    Pathfinder2E.FEATS['Heal Mount']
    .replace('Steed Ally', 'Faithful Steed'),
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
  // Changed traits and requirements
  'Shield Of Reckoning':
    'Traits=Champion ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Blessed Shield",' +
      '"features.Champion\'s Reaction",' +
      '"features.Shield Warden"',
  'Spectral Advance':
    'Traits=Champion,Concentrate,Divine,Teleportation ' +
    'Require="level >= 10","features.Blessed Swiftness"',
  'Affliction Mercy':Pathfinder2E.FEATS['Affliction Mercy'],
  'Aura Of Faith':
    Pathfinder2E.FEATS['Aura Of Faith']
    .replace('The Tenets Of Good', 'Holy || traits.Unholy'),
  // TODO require "champion's reaction that grants an ally resistance"
  'Blessed Counterstrike':'Traits=Champion,Flourish Require="level >= 12"',
  "Champion's Sacrifice":
    Pathfinder2E.FEATS["Champion's Sacrifice"]
    .replace('features.The Tenets Of Good', 'traits.Unholy == 0'),
  'Devoted Focus':
    Pathfinder2E.FEATS['Devoted Focus']
    .replace('10', '12'),
  'Divine Wall':Pathfinder2E.FEATS['Divine Wall'],
  // TODO require "champion's reaction that grants extra damage"
  'Gruesome Strike':'Traits=Champion Require="level >= 12"',
  'Aura Of Determination':
    'Traits=Champion Require="level >= 14","features.Champion\'s Aura"',
  'Aura Of Life':
    Pathfinder2E.FEATS['Aura Of Life']
    .replace('Shining Oath', "Champion's Aura"),
  'Aura Of Righteousness':
    Pathfinder2E.FEATS['Aura Of Righteousness']
    .replace('The Tenets Of Good', 'Champion\'s Aura","traits.Holy'),
  'Divine Reflexes':Pathfinder2E.FEATS['Divine Reflexes'],
  'Auspicious Mount':
    Pathfinder2E.FEATS['Auspicious Mount']
    .replace(',"features.Steed Ally"', ''),
  // TODO require "champion's reaction that grants extra damage"
  'Instrument Of Slaughter':'Traits=Champion Require="level >= 16"',
  // TODO require "champion's reaction that grants an ally resistance"
  'Instrument Of Zeal':
    Pathfinder2E.FEATS['Instrument Of Zeal'] + ' ' +
    'Require="level >= 16","features.Blessed Counterstrike || features.Retributive Strike"',
  'Shield Of Grace':Pathfinder2E.FEATS['Shield Of Grace'],
  'Rejuvenating Touch':
    'Traits=Champion Require="level >= 18","spells.Lay On Hands (D1 Foc)"',
  'Swift Retribution':
    'Traits=Champion Require="level >= 18","features.Champion\'s Reaction"',
  'Ultimate Mercy':Pathfinder2E.FEATS['Ultimate Mercy'],
  'Armament Paragon':
    Pathfinder2E.FEATS['Radiant Blade Master'] + ' ' +
    'Require="level >= 20","features.Blessed Armament"',
  'Sacred Defender':'Traits=Champion Require="level >= 20"',
  'Shield Paragon':
    Pathfinder2E.FEATS['Shield Paragon']
    .replace('Shield Ally', 'Blessed Shield'),
  'Swift Paragon':
    'Traits=Champion Require="level >= 20","features.Blessed Swiftness"',

  // Investigator
  'Eliminate Red Herrings':'Traits=Investigator',
  'Flexible Studies':'Traits=Investigator',
  'Known Weaknesses':'Traits=Investigator',
  'Takedown Expert':'Traits=Investigator',
  "That's Odd":'Traits=Investigator',
  // Trap Finder as above
  'Underworld Investigator':'Traits=Investigator',
  'Athletic Strategist':
    'Traits=Investigator Require="level >= 2","rank.Athletics >= 1"',
  'Certain Stratagem':'Traits=Investigator Require="level >= 2"',
  'Exploit Blunder':'Traits=Investigator Require="level >= 2"',
  'Person Of Interest':'Traits=Investigator Require="level >= 2"',
  'Shared Stratagem':'Traits=Investigator Require="level >= 2"',
  'Solid Lead':'Traits=Investigator Require="level >= 2"',
  'Alchemical Discoveries':
    'Traits=Investigator Require="level >= 4","features.Alchemical Sciences"',
  "Detective's Readiness":'Traits=Investigator Require="level >= 4"',
  'Lie Detector':
    'Traits=Investigator ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Empiricism || features.Interrogation"',
  'Ongoing Investigation':'Traits=Investigator Require="level >= 4"',
  "Scalpel's Point":
    'Traits=Investigator Require="level >= 4","features.Forensic Medicine"',
  'Strategic Assessment':'Traits=Investigator Require="level >= 4"',
  'Connect The Dots':
    'Traits=Investigator,Auditory,Concentrate,Linguistic Require="level >= 6"',
  // Predictive Purchase as above
  'Thorough Research':'Traits=Investigator Require="level >= 6"',
  // Blind-Fight as above
  'Clue Them All In':'Traits=Investigator Require="level >= 8"',
  'Defensive Stratagem':'Traits=Investigator Require="level >= 8"',
  'Whodunnit?':'Traits=Investigator,Uncommon Require="level >= 8"',
  'Just One More Thing':'Traits=Investigator,Fortune Require="level >= 10"',
  'Ongoing Strategy':
    'Traits=Investigator Require="level >= 10","features.Strategic Strike"',
  'Suspect Of Opportunity':
    'Traits=Investigator Require="level >= 10","features.Person Of Interest"',
  "Empiricist's Eye":
    'Traits=Investigator Require="level >= 12","features.Empiricism"',
  'Foresee Danger':'Traits=Investigator,Concentrate Require="level >= 12"',
  'Just As Planned':'Traits=Investigator,Fortune Require="level >= 12"',
  "Make 'Em Sweat":
    'Traits=Investigator Require="level >= 12","features.Interrogation"',
  'Reason Rapidly':'Traits=Investigator Require="level >= 12"',
  'Share Tincture':
    'Traits=Investigator Require="level >= 12","features.Alchemical Sciences"',
  'Surgical Shock':
    'Traits=Investigator,Attack ' +
    'Require="level >= 12","features.Forensic Medicine"',
  'Plot The Future':
    'Traits=Investigator,Uncommon,Concentrate,Prediction Require="level >= 14"',
  // Sense The Unseen as above
  'Strategic Bypass':'Traits=Investigator Require="level >= 14"',
  'Didactic Strike':
    'Traits=Investigator Require="level >= 16","features.Shared Stratagem"',
  // Implausible Purchase as above
  // Reconstruct The Scene as above
  'Lead Investigator':
    'Traits=Investigator,Exploration ' +
    'Require="level >= 18","features.Clue Them All In"',
  "Trickster's Ace":
    Pathfinder2E.FEATS["Trickster's Ace"]
    .replace('Rogue', 'Investigator'),
  "Everyone's A Suspect":'Traits=Investigator Require="level >= 20"',
  'Just The Facts':
    'Traits=Investigator Require="level >= 20","features.Thorough Research"',

  // Monk
  'Crane Stance':Pathfinder2E.FEATS['Crane Stance'],
  'Dragon Stance':Pathfinder2E.FEATS['Dragon Stance'],
  'Monastic Archer Stance':'Traits=Monk,Stance',
  'Monastic Weaponry':Pathfinder2E.FEATS['Monastic Weaponry'],
  'Mountain Stance':Pathfinder2E.FEATS['Mountain Stance'],
  'Qi Spells (Inner Upheaval)':'Traits=Monk',
  'Qi Spells (Qi Rush)':'Traits=Monk',
  'Stumbling Stance':'Traits=Monk,Stance Require="rank.Deception >= 1"',
  'Tiger Stance':Pathfinder2E.FEATS['Tiger Stance'],
  'Wolf Stance':Pathfinder2E.FEATS['Wolf Stance'],
  'Crushing Grab':Pathfinder2E.FEATS['Crushing Grab'],
  'Dancing Leaf':Pathfinder2E.FEATS['Dancing Leaf'],
  'Elemental Fist':
    Pathfinder2E.FEATS['Elemental Fist']
    .replace('features.Ki Strike', 'spells.Inner Upheaval (O1 Foc)'),
  'Shooting Stars Stance':
    'Traits=Monk,Stance Require="level >= 2","features.Monastic Weaponry"',
  'Stunning Blows':Pathfinder2E.FEATS['Stunning Fist'],
  'Cobra Stance':'Traits=Monk,Stance Require="level >= 4"',
  'Deflect Projectile':Pathfinder2E.FEATS['Deflect Arrow'],
  'Flurry Of Maneuvers':Pathfinder2E.FEATS['Flurry Of Maneuvers'],
  'Flying Kick':Pathfinder2E.FEATS['Flying Kick'],
  'Guarded Movement':Pathfinder2E.FEATS['Guarded Movement'],
  'Harmonize Self':
    Pathfinder2E.FEATS['Wholeness Of Body']
    .replace('Ki Spells', 'Qi Spells'),
  'Stand Still':Pathfinder2E.FEATS['Stand Still'],
  'Advanced Monastic Weaponry':
    'Traits=Monk Require="level >= 6","features.Monastic Weaponry"',
  'Advanced Qi Spells (Qi Blast)':
    'Traits=Monk Require="level >= 6","features.Qi Spells"',
  'Advanced Qi Spells (Shrink The Span)':
    'Traits=Monk Require="level >= 6","features.Qi Spells"',
  'Align Qi':'Traits=Monk Require="level >= 6","features.Qi Spells"',
  'Crane Flutter':Pathfinder2E.FEATS['Crane Flutter'],
  'Dragon Roar':Pathfinder2E.FEATS['Dragon Roar'],
  'Mountain Stronghold':Pathfinder2E.FEATS['Mountain Stronghold'],
  'One-Inch Punch':'Traits=Monk Require="level >= 6","features.Expert Strikes"',
  'Return Fire':
    'Traits=Monk ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Deflect Projectile",' +
      '"features.Monastic Archer Stance"',
  'Stumbling Feint':
    'Traits=Monk ' +
    'Require="level >= 6","rank.Deception >= 2","features.Stumbling Stance"',
  'Tiger Slash':Pathfinder2E.FEATS['Tiger Stance'],
  'Water Step':Pathfinder2E.FEATS['Water Step'],
  'Whirling Throw':
    Pathfinder2E.FEATS['Whirling Throw']
    .replace('Traits=', 'Traits=Attack,'),
  'Wolf Drag':Pathfinder2E.FEATS['Wolf Drag'],
  'Clinging Shadows Initiate':
    'Traits=Monk Require="level >= 8","features.Qi Spells"',
  'Ironblood Stance':Pathfinder2E.FEATS['Ironblood Stance'],
  'Mixed Maneuver':Pathfinder2E.FEATS['Mixed Maneuver'],
  'Pinning Fire':'Traits=Monk Require="level >= 8"',
  'Projectile Snatching':
    Pathfinder2E.FEATS['Arrow Snatching']
   .replace('Deflect Arrow', 'Deflect Projectile'),
  'Tangled Forest Stance':Pathfinder2E.FEATS['Tangled Forest Stance'],
  'Wall Run':Pathfinder2E.FEATS['Wall Run'],
  'Wild Winds Initiate':
    Pathfinder2E.FEATS['Wild Winds Initiate']
    .replace('Ki Spells', 'Qi Spells'),
  'Cobra Envenom':
    'Traits=Monk,Poison ' +
    'Require="level >= 10","features.Cobra Stance","rank.Unarmed Attacks >= 2"',
  'Knockback Strike':Pathfinder2E.FEATS['Knockback Strike'],
  'Prevailing Position':
    'Traits=Monk Require="level >= 10","sumStanceFeats >= 1"',
  'Sleeper Hold':Pathfinder2E.FEATS['Sleeper Hold'],
  'Wind Jump':
    Pathfinder2E.FEATS['Wind Jump']
    .replace('Ki Spells', 'Qi Spells'),
  'Winding Flow':Pathfinder2E.FEATS['Winding Flow'],
  'Disrupt Qi':
    Pathfinder2E.FEATS['Disrupt Ki']
    .replace('Negative', 'Void'),
  'Dodging Roll':'Traits=Monk Require="level >= 12","rank.Acrobatics >= 3"',
  'Focused Shot':
    'Traits=Monk,Concentrate ' +
    'Require="level >= 12","features.Monastic Archer Stance"',
  // Changed requirements
  'Improved Knockback':
    'Traits=Monk Require="level >= 12","features.Knockback Strike"',
  'Meditative Focus':
    Pathfinder2E.FEATS['Meditative Focus']
    .replace('Ki Spells', 'Qi Spells'),
  'Overwhelming Breath':
    'Traits=Monk,Concentrate,Spellshape ' +
    'Require="level >= 12","features.Qi Spells"',
  'Reflexive Stance':'Traits=Monk Require="level >= 12"',
  'Form Lock':
    'Traits=Monk,Archetype,Attack ' +
    'Require=' +
      '"level >= 14",' +
      '"levels.Monk >= 14 || features.Wrestler Dedication"',
  'Ironblood Surge':Pathfinder2E.FEATS['Ironblood Surge'],
  'Mountain Quake':Pathfinder2E.FEATS['Mountain Quake'],
  'Peerless Form':Pathfinder2E.FEATS['Timeless Body'],
  "Shadow's Web":
    'Traits=Monk Require="level >= 14","features.Clinging Shadows Initiate"',
  'Tangled Forest Rake':Pathfinder2E.FEATS['Tangled Forest Rake'],
  'Whirling Blade Stance':
    'Traits=Monk,Stance Require="level >= 14","features.Monastic Weaponry"',
  'Wild Winds Gust':
    Pathfinder2E.FEATS['Wild Winds Gust']
    .replace(',Evocation', ''),
  'Fuse Stance':
    Pathfinder2E.FEATS['Fuse Stance']
    .replace('20', '16'),
  // Master Of Many Styles as above
  "Master Qi Spells (Medusa's Wrath)":
    'Traits=Monk Require="level >= 16","features.Qi Spells"',
  'Master Qi Spells (Touch Of Death)':
    'Traits=Monk Require="level >= 16","features.Qi Spells"',
  'One-Millimeter Punch':
    'Traits=Monk Require="level >= 16","features.One-Inch Punch"',
  'Shattering Strike (Monk)':Pathfinder2E.FEATS['Shattering Strike'],
  'Diamond Fists':Pathfinder2E.FEATS['Diamond Fists'],
  'Grandmaster Qi Spells (Embrace Nothingness)':
    'Traits=Monk Require="level >= 18","features.Qi Spells"',
  'Grandmaster Qi Spells (Qi Form)':
    'Traits=Monk Require="level >= 18","features.Qi Spells"',
  'Qi Center':
    'Traits=Monk ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Qi Spells",' +
      '"features.Master Of Many Styles"',
  'Swift River':Pathfinder2E.FEATS['Swift River'],
  'Triangle Shot':
    'Traits=Monk,Concentrate,Fortune ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Monastic Archer Stance",' +
      '"features.Stunning Blows"',
  'Enduring Quickness':Pathfinder2E.FEATS['Enduring Quickness'],
  'Godbreaker':
    'Traits=Monk ' +
    'Require="level >= 20","features.Crushing Grab","features.Whirling Throw"',
  'Immortal Techniques':
    'Traits=Monk Require="level >= 20","features.Master Of Many Styles"',
  'Impossible Technique':Pathfinder2E.FEATS['Impossible Technique'],
  'Lightning Qi':'Traits=Monk Require="level >= 20","features.Qi Spells"',

  // Oracle
  'Foretell Harm':'Traits=Oracle,Cursebound,Divine',
  'Glean Lore':'Traits=Oracle,Divine,Secret',
  'Nudge The Scales':'Traits=Oracle,Cursebound,Divine,Healing,Spirit',
  'Oracular Warning':'Traits=Oracle,Auditory,Cursebound,Divine,Emotion,Mental',
  // Reach Spell as above
  'Whispers Of Weakness':'Traits=Oracle,Cursebound,Divine',
  // Widen Spell as above
  // Cantrip Expansion as above
  'Divine Aegis':'Traits=Oracle,Divine Require="level >= 2"',
  'Domain Acumen (%domain)':'Traits=Oracle Require="level >= 2"',
  // Added domains from Divine Mysteries
  'Domain Acumen (Decay)':'Traits=Oracle Require="level >= 2"',
  'Domain Acumen (Dust)':'Traits=Oracle Require="level >= 2"',
  'Domain Acumen (Duty)':'Traits=Oracle Require="level >= 2"',
  'Domain Acumen (Lightning)':'Traits=Oracle Require="level >= 2"',
  'Domain Acumen (Nothingness)':'Traits=Oracle Require="level >= 2"',
  'Domain Acumen (Soul)':'Traits=Oracle Require="level >= 2"',
  'Domain Acumen (Star)':'Traits=Oracle Require="level >= 2"',
  'Domain Acumen (Vigil)':'Traits=Oracle Require="level >= 2"',
  'Meddling Futures':'Traits=Oracle,Cursebound,Divine Require="level >= 2"',
  // Bespell Strikes as above
  'Knowledge Of Shapes':
    'Traits=Oracle,Cursebound,Spellshape ' +
    'Require="level >= 4","features.Reach Spell || features.Widen Spell"',
  'Thousand Visions':'Traits=Oracle,Cursebound,Prediction Require="level >= 4"',
  // TODO requires "initial revelation spell"
  'Advanced Revelation':'Traits=Oracle Require="level >= 6"',
  'Gifted Power':'Traits=Oracle Require="level >= 6"',
  'Spiritual Sense':'Traits=Oracle,Divine Require="level >= 6"',
  // Steady Spellcasting as above
  'Debilitating Dichotomy':
    'Traits=Oracle,Concentrate,Cursebound,Divine,Mental Require="level >= 8"',
  'Read Disaster':'Traits=Oracle,Exploration,Prediction Require="level >= 8"',
  'Surging Might':'Traits=Oracle,Manipulate,Spellshape Require="level >= 8"',
  'Water Walker':'Traits=Oracle Require="level >= 8"',
  // Quickened Casting as above
  'Roll The Bones Of Fate':
    'Traits=Oracle,Cursebound,Divine,Prediction ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Bones || features.Lore"',
  'The Dead Walk':
    'Traits=Oracle,Cursebound,Divine ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Ancestors || features.Battle"',
  'Trial By Skyfire':
    'Traits=Oracle,Cursebound,Divine,Fire ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Cosmos || features.Flames"',
  'Waters Of Creation':
    'Traits=Oracle,Cursebound,Divine,Healing,Vitality,Water ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Life || features.Tempest"',
  'Domain Fluency (%domain)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  // Added domains from Divine Mysteries
  'Domain Fluency (Decay)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Domain Fluency (Dust)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Domain Fluency (Duty)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Domain Fluency (Lightning)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Domain Fluency (Nothingness)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Domain Fluency (Soul)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Domain Fluency (Star)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Domain Fluency (Vigil)':
    'Traits=Oracle Require="level >= 12","features.Domain Acumen"',
  'Epiphany At The Crossroads':'Traits=Oracle,Divine Require="level >= 12"',
  // TODO require "initial revelation spell"
  'Greater Revelation':'Traits=Oracle Require="level >= 12"',
  // Magic Sense as above
  'Forestall Curse':'Traits=Oracle,Concentrate Require="level >= 14"',
  'Lighter Than Air':
    'Traits=Oracle,Divine ' +
    'Require="level >= 14","features.Water Walker"',
  'Mysterious Repertoire':'Traits=Oracle Require="level >= 14"',
  "Revelation's Focus":'Traits=Oracle Require="level >= 14"',
  'Conduit Of Void And Vitality':
    'Traits=Oracle,Cursebound,Divine Require="level >= 16","feature.Mystery"',
  'Diverse Mystery':
    'Traits=Oracle Require="level >= 16","features.Advanced Revelation"',
  'Portentous Spell':
    'Traits=Oracle,Manipulate,Mental,Spellshape,Visual Require="level >= 16"',
  'Blaze Of Revelation':'Traits=Oracle Require="level >= 18"',
  'Divine Effusion':'Traits=Oracle Require="level >= 18"',
  'Mystery Conduit':'Traits=Oracle,Cursebound,Spellshape Require="level >= 20"',
  'Oracular Providence':
    'Traits=Oracle Require="level >= 20","features.Oracular Clarity"',
  'Paradoxical Mystery':
    'Traits=Oracle Require="level >= 20","features.Greater Revelation"',

  // Sorcerer
  'Blood Rising':'Traits=Sorcerer',
  // Familiar as above
  // Reach Spell as above
  'Tap Into Blood':'Traits=Sorcerer,Concentrate',
  // Widen Spell as above
  'Anoint Ally':'Traits=Sorcerer,Manipulate Require="level >= 2"',
  'Bleed Out':'Traits=Sorcerer,Attack Require="level >= 2"',
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Propelling Sorcery':'Traits=Sorcerer Require="level >= 2"',
  'Arcane Evolution':Pathfinder2E.FEATS['Arcane Evolution'],
  // Bespell Strikes as above
  'Divine Evolution':Pathfinder2E.FEATS['Divine Evolution'],
  'Occult Evolution':Pathfinder2E.FEATS['Occult Evolution'],
  'Primal Evolution':Pathfinder2E.FEATS['Primal Evolution'],
  'Split Shot':'Traits=Sorcerer,Concentrate,Spellshape Require="level >= 4"',
  'Advanced Bloodline':Pathfinder2E.FEATS['Advanced Bloodline'],
  'Diverting Vortex':'Traits=Sorcerer Require="level >= 6"',
  'Energy Ward':'Traits=Sorcerer Require="level >= 6"',
  'Safeguard Spell':
    'Traits=Sorcerer,Concentrate,Spellshape Require="level >= 6"',
  'Spell Relay':'Traits=Sorcerer,Concentrate Require="level >= 6"',
  // Steady Spellcasting as above
  'Bloodline Resistance':Pathfinder2E.FEATS['Bloodline Resistance'],
  // Changed configuration
  'Crossblooded Evolution (Aberrant)':
    'Traits=Sorcerer Require="level >= 8","features.Aberrant == 0"',
  'Crossblooded Evolution (Angelic)':
    'Traits=Sorcerer Require="level >= 8","features.Angelic == 0"',
  'Crossblooded Evolution (Demonic)':
    'Traits=Sorcerer Require="level >= 8","features.Demonic == 0"',
  'Crossblooded Evolution (Diabolic)':
    'Traits=Sorcerer Require="level >= 8","features.Diabolic == 0"',
  'Crossblooded Evolution (Draconic)':
    'Traits=Sorcerer Require="level >= 8","features.Draconic == 0"',
  'Crossblooded Evolution (Elemental (Air))':
    'Traits=Sorcerer Require="level >= 8","features.Elemental == 0"',
  'Crossblooded Evolution (Elemental (Earth))':
    'Traits=Sorcerer Require="level >= 8","features.Elemental == 0"',
  'Crossblooded Evolution (Elemental (Fire))':
    'Traits=Sorcerer Require="level >= 8","features.Elemental == 0"',
  'Crossblooded Evolution (Elemental (Metal))':
    'Traits=Sorcerer Require="level >= 8","features.Elemental == 0"',
  'Crossblooded Evolution (Elemental (Water))':
    'Traits=Sorcerer Require="level >= 8","features.Elemental == 0"',
  'Crossblooded Evolution (Elemental (Wood))':
    'Traits=Sorcerer Require="level >= 8","features.Elemental == 0"',
  'Crossblooded Evolution (Fey)':
    'Traits=Sorcerer Require="level >= 8","features.Fey == 0"',
  'Crossblooded Evolution (Hag)':
    'Traits=Sorcerer Require="level >= 8","features.Hag == 0"',
  'Crossblooded Evolution (Imperial)':
    'Traits=Sorcerer Require="level >= 8","features.Imperial == 0"',
  'Crossblooded Evolution (Undead)':
    'Traits=Sorcerer Require="level >= 8","features.Undead == 0"',
  'Explosion Of Power':'Traits=Sorcerer Require="level >= 8"',
  'Energy Fusion':
    'Traits=Sorcerer,Concentrate,Spellshape Require="level >= 10"',
  'Greater Bloodline':Pathfinder2E.FEATS['Greater Bloodline'],
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Signature Spell Expansion':'Traits=Sorcerer Require="level >= 10"',
  'Blood Sovereignty':'Traits=Sorcerer Require="level >= 12"',
  'Bloodline Focus':Pathfinder2E.FEATS['Bloodline Focus'],
  'Greater Physical Evolution':
    'Traits=Sorcerer ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Arcane Evolution || features.Primal Evolution"',
  'Greater Spiritual Evolution':
    'Traits=Sorcerer ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Divine Evolution || features.Occult Evolution"',
  // Magic Sense as above
  'Terraforming Trickery':
    'Traits=Sorcerer,Concentrate,Earth Require="level >= 12"',
  'Blood Ascendancy':
    'Traits=Sorcerer Require="level >= 14","features.Blood Rising"',
  'Interweave Dispel':
    Pathfinder2E.FEATS['Interweave Dispel']
    .replace('Metamagic', 'Spellshape'),
  'Reflect Harm':'Traits=Sorcerer Require="level >= 14"',
  'Spell Shroud':'Traits=Sorcerer,Concentrate,Spellshape Require="level >= 14"',
  // Effortless Concentration as above
  'Greater Mental Evolution':Pathfinder2E.FEATS['Greater Mental Evolution'],
  'Greater Vital Evolution':Pathfinder2E.FEATS['Greater Vital Evolution'],
  // Scintillating Spell as above
  'Echoing Spell':
    'Traits=Sorcerer,Concentrate,Spellshape Require="level >= 18"',
  'Greater Crossblooded Evolution':
    Pathfinder2E.FEATS['Greater Crossblooded Evolution'],
  'Bloodline Conduit':
    Pathfinder2E.FEATS['Bloodline Conduit']
    .replace('Metamagic', 'Spellshape'),
  // TODO require "a bloodline based on a specific type of creature"
  'Bloodline Mutation':'Traits=Sorcerer Require="level >= 20"',
  'Bloodline Perfection':Pathfinder2E.FEATS['Bloodline Perfection'],
  // Spellshape Mastery as above

  // Swashbuckler
  'Disarming Flair':'Traits=Swashbuckler',
  'Elegant Buckler':'Traits=Swashbuckler',
  'Extravagant Parry':'Traits=Swashbuckler',
  'Flashy Dodge':'Traits=Swashbuckler',
  'Flying Blade':'Traits=Swashbuckler Require="features.Precise Strike"',
  'Focused Fascination':
    'Traits=Swashbuckler Require="features.Fascinating Performance"',
  'Goading Feint':'Traits=Swashbuckler Require="rank.Deception >= 1"',
  'One For All':
    'Traits=Swashbuckler,Auditory,Concentrate,Emotion,Linguistic,Mental '+
    'Require="rank.Diplomacy >= 1"',
  'Plummeting Roll':'Traits=Swashbuckler Require="rank.Acrobatics >= 1"',
  // You're Next as above
  'After You':'Traits=Swashbuckler Require="level >= 2"',
  'Antagonize':'Traits=Swashbuckler Require="level >= 2"',
  'Brandishing Draw':'Traits=Swashbuckler Require="level >= 2"',
  'Charmed Life':
    'Traits=Swashbuckler Require="level >= 2","charismaModifier >= 2"',
  'Enjoy The Show':'Traits=Swashbuckler Require="level >= 2"',
  'Finishing Follow-Through':'Traits=Swashbuckler Require="level >= 2"',
  'Retreating Finisher':'Traits=Swashbuckler,Finisher Require="level >= 2"',
  // Tumble Behind as above
  'Unbalancing Finisher':'Traits=Swashbuckler,Finisher Require="level >= 2"',
  'Dastardly Dash':'Traits=Swashbuckler,Flourish Require="level >= 4"',
  'Even The Odds':'Traits=Swashbuckler Require="level >= 4"',
  'Flamboyant Athlete':
    'Traits=Swashbuckler Require="level >= 4","rank.Athletics >= 4"',
  "Guardian's Reflection":'Traits=Swashbuckler Require="level >= 4"',
  'Impaling Finisher':'Traits=Swashbuckler,Finisher Require="level >= 4"',
  'Leading Dance':
    'Traits=Swashbuckler,Bravado,Move ' +
    'Require="level >= 4","rank.Performance >= 1"',
  'Swaggering Initiative':'Traits=Swashbuckler Require="level >= 4"',
  'Twirling Throw':
    'Traits=Swashbuckler,Finisher Require="level >= 4","features.Flying Blade"',
  'Agile Maneuvers':
    'Traits=Swashbuckler Require="level >= 6","rank.Athletics >= 2"',
  'Combination Finisher':'Traits=Swashbuckler Require="level >= 6"',
  'Precise Finisher':
    'Traits=Swashbuckler Require="level >= 6","features.Confident Finisher"',
  // Reactive Strike as above
  'Vexing Tumble':'Traits=Swashbuckler,Bravado Require="level >= 6"',
  'Bleeding Finisher':'Traits=Swashbuckler,Finisher Require="level >= 8"',
  'Distracting Toss':
    'Traits=Swashbuckler,Bravado,Flourish Require="level >= 8"',
  'Dual Finisher':'Traits=Swashbuckler,Finisher Require="level >= 8"',
  'Flashy Roll':
    'Traits=Swashbuckler Require="level >= 8","features.Flashy Dodge"',
  'Stunning Finisher':'Traits=Swashbuckler,Finisher Require="level >= 8"',
  'Vivacious Bravado':'Traits=Swashbuckler Require="level >= 8"',
  'Buckler Dance':'Traits=Swashbuckler,Stance Require="level >= 10"',
  'Derring-Do':'Traits=Swashbuckler,Fortune Require="level >= 10"',
  'Reflexive Riposte':
    'Traits=Swashbuckler Require="level >= 10","features.Opportune Riposte"',
  'Stumbling Finisher':'Traits=Swashbuckler,Finisher Require="level >= 10"',
  'Switcheroo':'Traits=Swashbuckler Require="level >= 10"',
  'Targeting Finisher':'Traits=Swashbuckler,Finisher Require="level >= 10"',
  'Cheat Death':'Traits=Swashbuckler Require="level >= 12"',
  'Get Used To Disappointment':
    'Traits=Swashbuckler,Bravado ' +
    'Require="level >= 12","rank.Intimidation >= 2"',
  'Mobile Finisher':'Traits=Swashbuckler,Finisher Require="level >= 12"',
  'The Bigger They Are':'Traits=Swashbuckler,Bravado Require="level >= 12"',
  'Flamboyant Leap':
    'Traits=Swashbuckler ' +
    'Require=' +
      '"level >= 14",' +
      '"rank.Athletics >= 3",' +
      '"features.Flamboyant Athlete"',
  'Impossible Riposte':
    'Traits=Swashbuckler Require="level >= 14","features.Opportune Riposte"',
  'Perfect Finisher':
    'Traits=Swashbuckler,Finisher,Fortune Require="level >= 14"',
  'Deadly Grace':'Traits=Swashbuckler Require="level >= 16"',
  'Felicitous Riposte':'Traits=Swashbuckler,Fortune Require="level >= 16"',
  'Revitalizing Finisher':'Traits=Swashbuckler,Finisher Require="level >= 16"',
  'Incredible Luck':
    'Traits=Swashbuckler,Fortune Require="level >= 18","features.Charmed Life"',
  // Note "precise strike 6d6" requirement is equivalent to "level >= 17"
  'Lethal Finisher':'Traits=Swashbuckler,Death,Finisher Require="level >= 18"',
  'Parry And Riposte':
    'Traits=Swashbuckler Require="level >= 18","features.Opportune Riposte"',
  'Illimitable Finisher':
    'Traits=Swashbuckler,Finisher,Fortune Require="level >= 20"',
  'Inexhaustible Countermoves':'Traits=Swashbuckler Require="level >= 20"',
  'Panache Paragon':'Traits=Swashbuckler Require="level >= 20"',

  // Archetype

  'Bard Dedication':Pathfinder2E.FEATS['Bard Dedication'],
  'Basic Bard Spellcasting':Pathfinder2E.FEATS['Basic Bard Spellcasting'],
  "Basic Muse's Whispers":Pathfinder2E.FEATS["Basic Muse's Whispers"],
  "Advanced Muse's Whispers":Pathfinder2E.FEATS["Advanced Muse's Whispers"],
  'Counter Perform':Pathfinder2E.FEATS['Counter Perform'],
  'Anthemic Performance':Pathfinder2E.FEATS['Inspirational Performance'],
  'Occult Breadth':Pathfinder2E.FEATS['Occult Breadth'],
  'Expert Bard Spellcasting':Pathfinder2E.FEATS['Expert Bard Spellcasting'],
  'Master Bard Spellcasting':Pathfinder2E.FEATS['Master Bard Spellcasting'],

  'Cleric Dedication':Pathfinder2E.FEATS['Cleric Dedication'],
  'Basic Cleric Spellcasting':Pathfinder2E.FEATS['Basic Cleric Spellcasting'],
  'Basic Dogma':Pathfinder2E.FEATS['Basic Dogma'],
  'Advanced Dogma':Pathfinder2E.FEATS['Advanced Dogma'],
  'Divine Breadth':Pathfinder2E.FEATS['Divine Breadth'],
  'Expert Cleric Spellcasting':Pathfinder2E.FEATS['Expert Cleric Spellcasting'],
  'Master Cleric Spellcasting':Pathfinder2E.FEATS['Master Cleric Spellcasting'],

  'Druid Dedication':Pathfinder2E.FEATS['Druid Dedication'],
  'Basic Druid Spellcasting':Pathfinder2E.FEATS['Basic Druid Spellcasting'],
  'Basic Wilding':Pathfinder2E.FEATS['Basic Wilding'],
  'Order Spell':Pathfinder2E.FEATS['Order Spell'],
  'Advanced Wilding':Pathfinder2E.FEATS['Basic Wilding'],
  'Primal Breadth':Pathfinder2E.FEATS['Primal Breadth'],
  'Expert Druid Spellcasting':Pathfinder2E.FEATS['Expert Druid Spellcasting'],
  'Master Druid Spellcasting':Pathfinder2E.FEATS['Master Druid Spellcasting'],

  'Fighter Dedication':Pathfinder2E.FEATS['Fighter Dedication'],
  'Basic Maneuver':Pathfinder2E.FEATS['Basic Maneuver'],
  'Fighter Resiliency':Pathfinder2E.FEATS['Fighter Resiliency'],
  'Reactive Striker':Pathfinder2E.FEATS.Opportunist,
  'Advanced Maneuver':Pathfinder2E.FEATS['Advanced Maneuver'],
  'Diverse Weapon Expert':Pathfinder2E.FEATS['Diverse Weapon Expert'],

  'Ranger Dedication':Pathfinder2E.FEATS['Ranger Dedication'],
  "Basic Hunter's Trick":Pathfinder2E.FEATS["Basic Hunter's Trick"],
  'Ranger Resiliency':Pathfinder2E.FEATS['Ranger Resiliency'],
  "Advanced Hunter's Trick":Pathfinder2E.FEATS["Advanced Hunter's Trick"],
  'Master Spotter':
    Pathfinder2E.FEATS['Master Spotter']
    .replace('features.Ranger Dedication', 'features.Ranger Dedication || features.Investigator Dedication'),

  'Rogue Dedication':Pathfinder2E.FEATS['Rogue Dedication'],
  'Basic Trickery':Pathfinder2E.FEATS['Basic Trickery'],
  'Sneak Attacker':Pathfinder2E.FEATS['Sneak Attacker'],
  'Advanced Trickery':Pathfinder2E.FEATS['Advanced Trickery'],
  'Skill Mastery':
    Pathfinder2E.FEATS['Skill Mastery']
    .replace('features.Rogue Dedication', 'features.Rogue Dedication || features.Investigator Dedication'),
  'Uncanny Dodge':Pathfinder2E.FEATS['Uncanny Dodge'],
  'Evasiveness':
    Pathfinder2E.FEATS.Evasiveness
    .replace('features.Rogue Dedication', 'features.Rogue Dedication || features.Swashbuckler Dedication'),

  'Witch Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2 || multiclassLevelRequirementsWaived",' +
      '"intelligenceModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Witch == 0"',
  'Basic Witch Spellcasting':
    'Traits=Archetype Require="level >= 4","features.Witch Dedication"',
  'Basic Witchcraft':
    'Traits=Archetype Require="level >= 4","features.Witch Dedication"',
  'Advanced Witchcraft':
    'Traits=Archetype Require="level >= 6","features.Basic Witchcraft"',
  "Patron's Breadth":
    'Traits=Archetype Require="level >= 8","features.Basic Witch Spellcasting"',
  'Expert Witch Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Witch Spellcasting",' +
      '"rank.patronSkill >= 3"',
  'Master Witch Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Witch Spellcasting",' +
      '"rank.patronSkill >= 4"',

  'Wizard Dedication':Pathfinder2E.FEATS['Wizard Dedication'],
  'Arcane School Spell':Pathfinder2E.FEATS['Arcane School Spell'],
  'Basic Arcana':Pathfinder2E.FEATS['Basic Arcana'],
  'Basic Wizard Spellcasting':Pathfinder2E.FEATS['Basic Wizard Spellcasting'],
  'Advanced Arcana':Pathfinder2E.FEATS['Advanced Arcana'],
  'Arcane Breadth':Pathfinder2E.FEATS['Arcane Breadth'],
  'Expert Wizard Spellcasting':Pathfinder2E.FEATS['Expert Wizard Spellcasting'],
  'Master Wizard Spellcasting':Pathfinder2E.FEATS['Master Wizard Spellcasting'],

  // Core 2

  'Alchemist Dedication':Pathfinder2E.FEATS['Alchemist Dedication'],
  'Advanced Alchemy':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Alchemist Dedication"',
  'Basic Concoction':Pathfinder2E.FEATS['Basic Concoction'],
  'Advanced Concoction':Pathfinder2E.FEATS['Advanced Concoction'],
  'Voluminous Vials':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Alchemist Dedication",' +
      '"rank.Crafting >= 2"',
  'Alchemical Power':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Alchemist Dedication",' +
      '"rank.Crafting >= 3"',

  'Barbarian Dedication':Pathfinder2E.FEATS['Barbarian Dedication'],
  'Barbarian Resiliency':Pathfinder2E.FEATS['Barbarian Resiliency'],
  'Basic Fury':Pathfinder2E.FEATS['Basic Fury'],
  'Advanced Fury':Pathfinder2E.FEATS['Advanced Fury'],
  'Instinct Ability':Pathfinder2E.FEATS['Instinct Ability'],
  "Juggernaut's Fortitude":Pathfinder2E.FEATS["Juggernaut's Fortitude"],

  'Champion Dedication':Pathfinder2E.FEATS['Champion Dedication'],
  'Basic Devotion':Pathfinder2E.FEATS['Basic Devotion'],
  'Champion Resiliency':Pathfinder2E.FEATS['Champion Resiliency'],

  'Devout Magic':Pathfinder2E.FEATS['Healing Touch'],
  'Advanced Devotion':Pathfinder2E.FEATS['Advanced Devotion'],
  "Champion's Reaction":Pathfinder2E.FEATS["Champion's Reaction"],
  'Devout Blessing':Pathfinder2E.FEATS['Divine Ally'],

  'Investigator Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2",' +
      '"intelligenceModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Investigator == 0"',
  'Basic Deduction':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Investigator Dedication"',
  "Investigator's Stratagem":
    'Traits=Archetype ' +
    'Require="level >= 4","features.Investigator Dedication"',
  'Advanced Deduction':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Basic Deduction"',
  'Keen Recollection':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Investigator Dedication"',
  // Skill Mastery as above
  // Master Spotter as above

  'Monk Dedication':Pathfinder2E.FEATS['Monk Dedication'],
  'Basic Kata':Pathfinder2E.FEATS['Basic Kata'],
  'Monk Resiliency':Pathfinder2E.FEATS['Monk Resiliency'],
  'Advanced Kata':Pathfinder2E.FEATS['Advanced Kata'],
  'Monk Moves':Pathfinder2E.FEATS['Monk Moves'],
  "Monk's Flurry":Pathfinder2E.FEATS["Monk's Flurry"],
  "Perfection's Path (Fortitude)":
    Pathfinder2E.FEATS["Perfection's Path (Fortitude)"],
  "Perfection's Path (Reflex)":Pathfinder2E.FEATS["Perfection's Path (Reflex)"],
  "Perfection's Path (Will)":Pathfinder2E.FEATS["Perfection's Path (Will)"],

  'Oracle Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2",' +
      '"charismaModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Oracle == 0"',
  'Basic Mysteries':
    'Traits=Archetype Require="level >= 4","features.Oracle Dedication"',
  'Basic Oracle Spellcasting':
    'Traits=Archetype Require="level >= 4","features.Oracle Dedication"',
  'First Revelation':
    'Traits=Archetype Require="level >= 4","features.Oracle Dedication"',
  'Advanced Mysteries':
    'Traits=Archetype Require="level >= 6","features.Basic Mysteries"',
  'Mysterious Breadth':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Basic Oracle Spellcasting"',
  'Expert Oracle Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Basic Oracle Spellcasting",' +
      '"rank.Religion >= 3"',
  'Master Oracle Spellcasting':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 18",' +
      '"features.Expert Oracle Spellcasting",' +
      '"rank.Religion >= 4"',

  'Sorcerer Dedication':Pathfinder2E.FEATS['Sorcerer Dedication'],
  'Basic Sorcerer Spellcasting':
    Pathfinder2E.FEATS['Basic Sorcerer Spellcasting'],
  'Basic Blood Potency':Pathfinder2E.FEATS['Basic Blood Potency'],
  'Basic Bloodline Spell':Pathfinder2E.FEATS['Basic Bloodline Spell'],
  'Advanced Blood Potency':Pathfinder2E.FEATS['Advanced Blood Potency'],
  'Bloodline Breadth':Pathfinder2E.FEATS['Bloodline Breadth'],
  'Expert Sorcerer Spellcasting':
    Pathfinder2E.FEATS['Expert Sorcerer Spellcasting'],
  'Master Sorcerer Spellcasting':
    Pathfinder2E.FEATS['Master Sorcerer Spellcasting'],

  'Swashbuckler Dedication':
    'Traits=Archetype,Dedication,Multiclass ' +
    'Require=' +
      '"level >= 2",' +
      '"charismaModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"dexterityModifier >= 2 || multiclassAbilityRequirementsWaived",' +
      '"levels.Swashbuckler == 0"',
  'Basic Flair':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Swashbuckler Dedication"',
  'Finishing Precision':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Swashbuckler Dedication"',
  'Advanced Flair':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Basic Flair"',
  "Swashbuckler's Riposte":
    'Traits=Archetype ' +
    'Require="level >= 6","features.Swashbuckler Dedication"',
  "Swashbuckler's Speed":
    'Traits=Archetype ' +
    'Require="level >= 8","features.Swashbuckler Dedication"',
  // Evasiveness as above

  'Acrobat Dedication':
    'Traits=Archetype,Dedication Require="level >= 2","rank.Acrobatics >= 1"',
  'Contortionist':
    'Traits=Archetype Require="level >= 4","features.Acrobat Dedication"',
  'Dodge Away':
    'Traits=Archetype Require="level >= 6","features.Acrobat Dedication"',
  'Graceful Leaper':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"features.Acrobat Dedication",' +
      '"rank.Acrobatics >= 3"',
  'Tumbling Strike':
    'Traits=Archetype,Flourish,Move ' +
    'Require="level >= 8","features.Acrobat Dedication"',
  'Tumbling Opportunist':
    'Traits=Archetype,Attack ' +
    'Require="level >= 10","features.Acrobat Dedication"',

  'Archaeologist Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Society >= 1",' +
      '"rank.Thievery >= 1"',
  'Magical Scholastics':
    'Traits=Archetype Require="level >= 4","features.Archaeologist Dedication"',
  'Settlement Scholastics':
    'Traits=Archetype,Skill ' +
    'Require="level >= 4","features.Archaeologist Dedication"',
  'Scholastic Identification':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Archaeologist Dedication",' +
      '"rank.Society >= 3"',
  "Archaeologist's Luck":
    'Traits=Archetype,Skill ' +
    'Require="level >= 8","features.Archaeologist Dedication"',
  'Greater Magical Scholastics':
    'Traits=Archetype Require="level >= 10","features.Magical Scholastics"',

  'Archer Dedication':'Traits=Archetype,Dedication Require="level >= 2"',
  'Quick Shot':
    'Traits=Archetype Require="level >= 4","features.Archer Dedication"',
  'Crossbow Terror':
    'Traits=Archetype Require="level >= 6","features.Archer Dedication"',
  "Archer's Aim":
    'Traits=Archetype,Concentrate ' +
    'Require="level >= 8","features.Archer Dedication"',
  'Unobstructed Shot':
    'Traits=Archetype,Flourish ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Archer Dedication",' +
      '"rank.Athletics >= 2"',

  'Assassin Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","rank.Deception >= 1","rank.Stealth >= 1"',
  'Expert Backstabber':
    'Traits=Archetype Require="level >= 4","features.Assassin Dedication"',
  'Surprise Attack':
    'Traits=Archetype Require="level >= 4","features.Assassin Dedication"',
  'Angel Of Death':
    'Traits=Archetype Require="level >= 10","features.Assassin Dedication"',
  'Assassinate':
    'Traits=Archetype Require="level >= 12","features.Assassin Dedication"',

  'Bastion Dedication':'Traits=Archetype,Dedication Require="level >= 2"',
  'Disarming Block':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Bastion Dedication",' +
      '"rank.Athletics >= 1"',
  'Nimble Shield Hand':
    'Traits=Archetype Require="level >= 6","features.Bastion Dedication"',
  'Destructive Block':
    'Traits=Archetype Require="level >= 10","features.Bastion Dedication"',
  'Shield Salvation':
    'Traits=Archetype Require="level >= 10","features.Bastion Dedication"',

  'Beastmaster Dedication':
    'Traits=Archetype,Dedication Require="level >= 2","rank.Nature >= 1"',
  'Additional Companion':
    'Traits=Archetype Require="level >= 4","features.Beastmaster Dedication"',
  'Mature Beastmaster Companion':
    'Traits=Archetype Require="level >= 4","features.Beastmaster Dedication"',
  "Beastmaster's Trance":
    'Traits=Archetype Require="level >= 6","features.Beastmaster Dedication"',
  'Swift Guardian':
    'Traits=Archetype,Concentrate ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Beastmaster Dedication",' +
      '"features.Call Companion"',
  'Incredible Beastmaster Companion':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Mature Beastmaster Companion"',
  'Beastmaster Bond':
    'Traits=Archetype,Mental,Primal ' +
    'Require="level >= 10","features.Beastmaster Dedication"',
  "Beastmaster's Call":
    'Traits=Archetype,Auditory,Concentrate,Primal ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Beastmaster Dedication",' +
      '"features.Call Companion"',
  'Specialized Beastmaster Companion':
    'Traits=Archetype ' +
    'Require="level >= 14","features.Incredible Beastmaster Companion"',
  // TODO requires multiple companions
  'Lead The Pack':
    'Traits=Archetype,Uncommon ' +
    'Require="level >= 16","features.Beastmaster Companion"',

  'Blessed One Dedication':'Traits=Archetype,Dedication Require="level >= 2"',
  'Blessed Sacrifice':
    'Traits=Archetype Require="level >= 4","features.Blessed One Dedication"',
  'Blessed Spell':
    'Traits=Archetype,Concentrate,Spellshape ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Blessed One Dedication",' +
      '"maxSpellLevel >= 1",' +
      '"features.Mercy"',
  'Blessed Denial':
    'Traits=Archetype Require="level >= 12","features.Blessed One Dedication"',

  'Bounty Hunter Dedication':
    'Traits=Archetype,Dedication Require="level >= 2","rank.Survival >= 1"',
  'Posse':
    'Traits=Archetype,Exploration ' +
    'Require="level >= 4","features.Bounty Hunter Dedication"',
  'Tools Of The Trade':
    'Traits=Archetype Require="level >= 4","features.Bounty Hunter Dedication"',
  'Keep Pace':
    'Traits=Archetype Require="level >= 6","features.Bounty Hunter Dedication"',
  'Opportunistic Grapple':
    'Traits=Archetype Require="level >= 8","features.Bounty Hunter Dedication"',

  'Cavalier Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Nature >= 1 || rank.Society >= 1"',
  "Cavalier's Banner":
    'Traits=Archetype,Uncommon,Aura,Emotion,Mental,Visual ' +
    'Require="level >= 4","features.Cavalier Dedication"',
  "Cavalier's Charge":
    'Traits=Archetype,Flourish ' +
    'Require="level >= 4","features.Cavalier Dedication"',
  'Impressive Mount':
    'Traits=Archetype Require="level >= 4","features.Cavalier Dedication"',
  'Quick Mount':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Cavalier Dedication",' +
      '"rank.Nature >= 2"',
  'Defend Mount':
    'Traits=Archetype Require="level >= 6","features.Cavalier Dedication"',
  'Mounted Shield':
    'Traits=Archetype Require="level >= 6","features.Cavalier Dedication"',
  'Incredible Mount':
    'Traits=Archetype Require="level >= 8","features.Impressive Mount"',
  'Trampling Charge':
    'Traits=Archetype,Flourish ' +
    'Require="level >= 10","features.Cavalier Dedication"',
  'Unseat':
    'Traits=Archetype Require="level >= 10","features.Cavalier Dedication"',
  'Specialized Mount':
    'Traits=Archetype Require="level >= 14","features.Incredible Mount"',
  'Legendary Rider':
    'Traits=Archetype Require="level >= 20","features.Cavalier Dedication"',

  'Celebrity Dedication':'Traits=Archetype,Dedication Require="level >= 2"',
  'Never Tire':
    'Traits=Archetype Require="level >= 4","features.Celebrity Dedication"',
  'Mesmerizing Gaze':
    'Traits=Archetype,Concentrate,Emotion,Mental,Visual ' +
    'Require="level >= 6","features.Celebrity Dedication"',
  'Command Attention':
    'Traits=Archetype,Auditory,Aura,Concentrate,Emotion,Mental,Visual ' +
    'Require="level >= 10","features.Celebrity Dedication"',

  'Dandy Dedication':
    'Traits=Archetype,Dedication Require="level >= 2","rank.Diplomacy >= 1"',
  'Distracting Flattery':
    'Traits=Archetype,Skill ' +
    'Require="level >= 4","features.Dandy Dedication","rank.Deception >= 2"',
  'Gossip Lore':
    'Traits=Archetype Require="level >= 4","features.Dandy Dedication"',
  'Fabricated Connections':
    'Traits=Archetype,Skill ' +
    'Require="level >= 7","features.Dandy Dedication","rank.Deception >= 3"',
  'Party Crasher':
    'Traits=Archetype,Skill ' +
    'Require="level >= 7","features.Dandy Dedication","rank.Society >= 3"',

  'Dual-Weapon Warrior Dedication':
    'Traits=Archetype,Dedication Require="level >= 2"',
  'Dual Thrower':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Dual-Weapon Warrior Dedication"',
  'Dual-Weapon Reload':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Dual-Weapon Warrior Dedication"',
  'Flensing Slice':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Dual-Weapon Warrior Dedication"',
  'Dual-Weapon Blitz':
    'Traits=Archetype ' +
    'Require="level >= 10","features.Dual-Weapon Warrior Dedication"',
  'Dual Onslaught':
    'Traits=Archetype ' +
    'Require="level >= 14","features.Dual-Weapon Warrior Dedication"',

  'Duelist Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Light Armor >= 1",' +
      '"rank.Simple Weapons >= 1"',
  "Duelist's Challenge":
    'Traits=Archetype Require="level >= 4","features.Duelist Dedication"',
  'Selfless Parry':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Duelist Dedication",' +
      '"features.Dueling Parry"',
  'Student Of The Dueling Arts':
    'Traits=Archetype Require="level >= 12","features.Duelist Dedication"',

  // TODO require expert in a bow or crossbow
  'Eldritch Archer Dedication':
    'Traits=Archetype,Dedication,Magical Require="level >= 6"',
  'Basic Eldritch Archer Spellcasting':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Eldritch Archer Dedication"',
  'Enchanting Shot':
    'Traits=Archetype,Emotion,Magical,Mental ' +
    'Require="level >= 8","features.Eldritch Archer Dedication"',
  'Magic Ammunition':
    'Traits=Archetype,Magical ' +
    'Require="level >= 8","features.Eldritch Archer Dedication"',
  'Precious Ammunition':
    'Traits=Archetype,Magical ' +
    'Require="level >= 8","features.Eldritch Archer Dedication"',
  'Eldritch Reload':
    'Traits=Archetype ' +
    'Require="level >= 10","features.Eldritch Archer Dedication"',
  'Expert Eldritch Archer Spellcaster':
    'Traits=Archetype ' +
    'Require="level >= 12","features.Basic Eldritch Archer Spellcasting"',
  'Homing Shot':
    'Traits=Archetype,Magical ' +
    'Require="level >= 14","features.Eldritch Archer Dedication"',
  'Incorporeal Shot':
    'Traits=Archetype,Magical ' +
    'Require="level >= 16","features.Eldritch Archer Dedication"',
  'Fatal Shot':
    'Traits=Archetype,Magical ' +
    'Require="level >= 18","features.Eldritch Archer Dedication"',
  'Master Eldritch Archer Spellcaster':
    'Traits=Archetype ' +
    'Require="level >= 18","features.Expert Eldritch Archer Spellcasting"',

  'Familiar Master Dedication':
    'Traits=Archetype,Dedication Require="level >= 2"',
  'Familiar Mascot':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Familiar Master Dedication"',
  // TODO: Requires ability to cast spells
  'Familiar Conduit':
    'Traits=Archetype,Concentrate,Spellshape ' +
    'Require="level >= 4","features.Familiar Master Dedication"',
  'Improved Familiar':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Familiar Master Dedication"',
  'Mutable Familiar':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Familiar Master Dedication"',
  // TODO different traits and level requirement than the Witch feat
  // 'Incredible Familiar':
  //   'Traits=Archetype Require="level >= 10","features.Enhanced Familiar"',

  'Gladiator Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","features.Impressive Performance"',
  'Fancy Moves':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Gladiator Dedication",' +
      '"rank.Performance >= 2"',
  'Play To The Crowd':
    'Traits=Archetype,Concentrate ' +
    'Require="level >= 4","features.Gladiator Dedication"',
  'Stage Fighting':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Gladiator Dedication"',
  'Performative Weapons Training':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Gladiator Dedication"',
  'Call Your Shot':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Play To The Crowd"',

  'Herbalist Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Medicine >= 1",' +
      '"features.Natural Medicine"',
  'Fresh Ingredients':
    'Traits=Archetype,Skill ' +
    'Require="level >= 2","features.Herbalist Dedication"',
  'Poultice Preparation':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Herbalist Dedication"',
  'Advanced Herbalism':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Herbalist Dedication",' +
      '"rank.Nature >= 2"',
  'Endemic Herbs':
    'Traits=Archetype,Additive ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Herbalist Dedication",' +
      '"rank.Survival >= 1"',

  'Linguist Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","languageCount >= 3"',
  'Multilingual Cipher':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Linguist Dedication",' +
      '"rank.Society >= 2"',
  'Phonetic Training':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Linguist Dedication",' +
      '"rank.Society >= 2"',
  'Spot Translate':
    'Traits=Archetype,Auditory,Linguistic ' +
    'Require="level >= 4","features.Linguist Dedication"',
  'Analyze Idiolect':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Linguist Dedication",' +
      '"rank.Deception >= 2",' +
      '"rank.Society >= 2"',
  'Read Shibboleths':
    'Traits=Archetype,Linguistic,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"features.Linguist Dedication",' +
      '"rank.Society >= 3"',
  'Crude Communication':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Linguist Dedication"',

  'Marshal Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Martial Weapons >= 1",' +
      '"rank.Diplomacy >= 1 || rank.Intimidation >= 1"',
  'Dread Marshal Stance':
    'Traits=Archetype,Stance ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Marshal Dedication",' +
      '"rank.Intimidation >= 1"',
  'Inspiring Marshal Stance':
    'Traits=Archetype,Stance ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Marshal Dedication",' +
      '"rank.Diplomacy >= 1"',
  'Snap Out Of It!':
    'Traits=Archetype,Auditory,Emotion,Mental ' +
    'Require="level >= 4","features.Marshal Dedication"',
  'Steel Yourself!':
    'Traits=Archetype,Auditory,Emotion,Mental ' +
    'Require="level >= 4","features.Marshal Dedication"',
  'Cadence Call':
    'Traits=Archetype,Auditory,Flourish ' +
    'Require="level >= 6","features.Marshal Dedication"',
  'Rallying Charge':
    'Traits=Archetype,Visual ' +
    'Require="level >= 6","features.Marshal Dedication"',
  'Back To Back':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Marshal Dedication"',
  'To Battle!':
    'Traits=Archetype,Auditory,Flourish ' +
    'Require="level >= 8","features.Marshal Dedication"',
  'Topple Foe':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 10",' +
      '"features.Marshal Dedication",' +
      '"rank.Athletics >= 1"',
  'Coordinated Charge':
    'Traits=Archetype,Flourish,Visual ' +
    'Require="level >= 12","features.Marshal Dedication"',
  'Tactical Cadence':
    'Traits=Archetype ' +
    'Require="level >= 14","features.Cadence Call"',
  'Target Of Opportunity':
    'Traits=Archetype,Manipulate ' +
    'Require="level >= 14","features.Martial Dedication"',

  'Martial Artist Dedication':
    'Traits=Archetype,Dedication Require="level >= 2"',
  'Follow-Up Strike':
    'Traits=Archetype,Flourish ' +
    'Require="level >= 6","features.Martial Artist Dedication"',
  'Grievous Blow':
    'Traits=Archetype,Flourish ' +
    'Require="level >= 8","features.Martial Artist Dedication"',
  'Path Of Iron':
    'Traits=Archetype,Flourish ' +
    'Require="level >= 14","features.Martial Artist Dedication"',

  'Mauler Dedication':
    'Traits=Archetype,Dedication Require="level >= 2","strengthModifier >= 2"',
  'Clear The Way':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Mauler Dedication"',
  'Shoving Sweep':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Mauler Dedication",' +
      '"rank.Athletics >= 2"',
  'Hammer Quake':
    'Traits=Archetype,Flourish ' +
    'Require="level >= 14","features.Mauler Dedication"',
  'Avalanche Strike':
    'Traits=Archetype,Flourish ' +
    'Require="level >= 16","features.Mauler Dedication"',

  'Medic Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Medicine >= 1",' +
      '"features.Battle Medicine"',
  "Doctor's Visitation":
    'Traits=Archetype,Flourish ' +
    'Require="level >= 4","features.Medic Dedication"',
  'Treat Condition':
    'Traits=Archetype,Healing,Manipulate,Skill ' +
    'Require="level >= 4","features.Medic Dedication"',
  'Holistic Care':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 6",' +
      '"rank.Diplomacy >= 1",' +
      '"features.Treat Condition"',
  'Resuscitate':
    'Traits=Archetype,Healing,Manipulate ' +
    'Require=' +
      '"level >= 16",' +
      '"features.Medic Condition",' +
      '"rank.Medicine >= 4"',

  'Pirate Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","rank.Intimidation >= 1"',
  'Pirate Combat Training':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Pirate Dedication"',
  'Rope Runner':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Pirate Dedication",' +
      '"rank.Acrobatics >= 1",' +
      '"rank.Athletics >= 1"',
  'Walk The Plank':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Pirate Dedication"',

  'Poisoner Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","rank.Crafting >= 1"',
  "Poisoner's Twist":
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Poisoner Dedication",' +
      '"rank.Medicine >= 1"',
  'Advanced Poisoncraft':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Poisoner Dedication"',
  'Poison Coat':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Poisoner Dedication"',
  'Acquired Tolerance':
    'Traits=Archetype,Fortune ' +
    'Require="level >= 8","features.Poisoner Dedication"',
  'Chemical Contagion':
    'Traits=Archetype ' +
    'Require="level >= 18","features.Poisoner Dedication"',

  'Ritualist Dedication':
    'Traits=Archetype,Uncommon,Dedication ' +
    'Require=' +
      '"level >= 4",' +
      '"rank.Arcana >= 2 || ' +
       'rank.Nature >= 2 || ' +
       'rank.Occultism >= 2 || ' +
       'rank.Religion >= 2"',
  'Flexible Ritualist':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Ritualist Dedication"',
  'Resourceful Ritualist':
    'Traits=Archetype,Skill ' +
    'Require="level >= 6","features.Ritualist Dedication"',
  'Efficient Rituals':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Ritualist Dedication"',
  'Assured Ritualist':
    'Traits=Archetype,Fortune ' +
    'Require="level >= 10","features.Flexible Ritualist"',
  'Enterprising Ritualist':
    'Traits=Archetype ' +
    'Require="level >= 14","features.Ritualist Dedication"',

  'Scout Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Stealth >= 1",' +
      '"rank.Survival >= 1"',
  "Scout's Charge":
    'Traits=Archetype,Flourish ' +
    'Require="level >= 4","features.Scout Dedication"',
  'Terrain Scout':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Scout Dedication"',
  'Fleeting Shadow':
    'Traits=Archetype,Flourish ' +
    'Require="level >= 6","features.Scout Dedication"',
  "Scout's Speed":
    'Traits=Archetype ' +
    'Require="level >= 6","features.Scout Dedication"',
  "Scout's Pounce":
    'Traits=Archetype,Flourish ' +
    'Require="level >= 10","features.Scout Dedication"',

  'Scroll Trickster Dedication':
    'Traits=Archetype,Dedication ' +
    'Require=' +
      '"level >= 2",' +
      '"rank.Arcana >= 1 || ' +
       'rank.Nature >= 1 || ' +
       'rank.Occultism >= 1 || ' +
       'rank.Religion >= 1"',
  'Basic Scroll Cache':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Scroll Trickster Dedication"',
  'Skim Scroll':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Scroll Trickster Dedication"',
  'Expert Scroll Cache':
    'Traits=Archetype ' +
    'Require="level >= 12","features.Basic Scroll Cache"',
  'Master Scroll Cache':
    'Traits=Archetype ' +
    'Require="level >= 18","features.Expert Scroll Cache"',

  'Scrounger Dedication':
    'Traits=Archetype,Uncommon,Dedication ' +
    'Require="level >= 2","rank.Crafting >= 1"',
  'Reverse Engineering':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Scrounger Dedication",' +
      '"rank.Crafting >= 2"',
  'Magical Scrounger':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 6",' +
      '"features.Scrounger Dedication",' +
      '"features.Magical Crafting"',
  'Expert Disassembly':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"features.Scrounger Dedication",' +
      '"rank.Crafting >= 3"',

  'Sentinel Dedication':
    'Traits=Archetype,Dedication Require="level >= 2"',
  'Steel Skin':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Sentinel Dedication",' +
      '"rank.Survival >= 1"',
  'Armor Specialist':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Sentinel Dedication"',
  'Armored Rebuff':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Sentinel Dedication"',
  'Mighty Bulwark':
    'Traits=Archetype ' +
    'Require="level >= 10","features.Sentinel Dedication"',

  'Snarecrafter Dedication':
    'Traits=Archetype,Dedication Require="level >= 2","rank.Crafting >= 1"',
  'Surprise Snare':
    'Traits=Archetype,Manipulate ' +
    'Require="level >= 4","features.Snarecrafter Dedication"',
  'Remote Trigger':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Snarecrafter Dedication"',
  'Giant Snare':
    'Traits=Archetype ' +
    'Require="level >= 10","features.Snarecrafter Dedication"',
  'Lightning Snares':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 12",' +
      '"features.Snarecrafter Dedication",' +
      '"rank.Crafting >= 3"',
  'Plentiful Snares':
    'Traits=Archetype ' +
    'Require="level >= 12","features.Snarecrafter Dedication"',

  'Talisman Dabbler Dedication':
    'Traits=Archetype,Dedication Require="level >= 2"',
  'Quick Fix':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Talisman Dabbler Dedication"',
  'Deeper Dabbler':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Talisman Dabbler Dedication"',
  'Talismanic Sage':
    'Traits=Archetype ' +
    'Require="level >= 14","features.Talisman Dabbler Dedication"',

  'Vigilante Dedication':
    'Traits=Archetype,Dedication,Uncommon ' +
    'Require="level >= 2","rank.Deception >= 1"',
  'Hidden Magic':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Vigilante Dedication",' +
      '"rank.Arcana >= 2 || ' +
       'rank.Nature >= 2 || ' +
       'rank.Occultism >= 2 || ' +
       'rank.Religion >= 2"',
  'Minion Guise':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 4",' +
      '"features.Vigilante Dedication",' +
      '"features.Animal Companion || features.Familiar",' +
      '"rank.Deception >= 2"',
  'Safe House':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Vigilante Dedication"',
  'Social Purview':
    'Traits=Archetype,Skill ' +
    'Require="level >= 4","features.Vigilante Dedication"',
  'Startling Appearance':
    'Traits=Archetype,Emotion,Fear,Mental,Vigilante ' +
    'Require="level >= 6","features.Vigilante Dedication"',
  'Quick Change':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 7",' +
      '"features.Vigilante Dedication",' +
      '"rank.Deception >= 3"',
  'Subjective Truth':
    'Traits=Archetype,Skill ' +
    'Require=' +
      '"level >= 7",' +
      '"features.Vigilante Dedication",' +
      '"rank.Deception >= 3"',
  'Many Guises':
    'Traits=Archetype ' +
    'Require=' +
      '"level >= 8",' +
      '"features.Vigilante Dedication",' +
      '"rank.Deception >= 3"',
  'Frightening Appearance':
    'Traits=Archetype,Vigilante ' +
    'Require=' +
      '"level >= 12",' +
      '"rank.Intimidation >= 2",' +
      '"features.Startling Appearance"',
  'Stunning Appearance':
    'Traits=Archetype,Vigilante ' +
    'Require="level >= 16","features.Startling Appearance"',

  'Viking Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","rank.Athletics >= 1"',
  'Hurling Charge':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Viking Dedication"',
  'Viking Weapon Familiarity':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Viking Dedication"',
  'Second Shield':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Viking Dedication"',
  'Into The Fray':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Viking Dedication"',

  'Weapon Improviser Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","rank.Martial Weapons >= 1"',
  'Improvised Pummel':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Weapon Improviser Dedication"',
  'Surprise Strike':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Weapon Improviser Dedication"',
  'Improvised Critical':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Weapon Improviser Dedication"',
  'Makeshift Strike':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Weapon Improviser Dedication"',
  'Shattering Strike (Weapon Improviser)':
    'Traits=Archetype ' +
    'Require="level >= 10","features.Improvised Pummel"',

  'Wrestler Dedication':
    'Traits=Archetype,Dedication ' +
    'Require="level >= 2","rank.Athletics >= 1"',
  'Disengaging Twist':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Wrestler Dedication"',
  'Elbow Breaker':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Wrestler Dedication"',
  'Suplex':
    'Traits=Archetype ' +
    'Require="level >= 4","features.Wrestler Dedication"',
  'Clinch Strike':
    'Traits=Archetype ' +
    'Require="level >= 6","features.Wrestler Dedication"',
  'Running Tackle':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Wrestler Dedication"',
  'Strangle':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Wrestler Dedication"',
  'Submission Hold':
    'Traits=Archetype ' +
    'Require="level >= 8","features.Wrestler Dedication"',
  'Aerial Piledriver':
    'Traits=Archetype ' +
    'Require="level >= 10","features.Wrestler Dedication"',
  'Spinebreaker':
    'Traits=Archetype ' +
    'Require="level >= 10","features.Wrestler Dedication"',
  'Inescapable Grasp':
    'Traits=Archetype ' +
    'Require="level >= 12","features.Wrestler Dedication"',
  // Form Lock as above

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
  'Consult The Spirits (Nature)':
    'Traits=General,Skill,Secret Require="level >= 7","rank.Nature >= 3"',
  'Consult The Spirits (Occult)':
    'Traits=General,Skill,Secret Require="level >= 7","rank.Occult >= 3"',
  'Consult The Spirits (Religion)':
    'Traits=General,Skill,Secret Require="level >= 7","rank.Religion >= 3"',
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
  // TODO Has Specialty Crafting (Stonemasonry) if already trained in Crafting
  "Stonemason's Eye":
    Pathfinder2E.FEATURES.Stonecunning
    .replace('Section=', 'Section=skill,')
    .replace('Note=', 'Note="Skill Trained (Crafting)",')
    .replace('-2', '+0'),
  'Unburdened Iron':Pathfinder2E.FEATURES['Unburdened Iron'],
  'Boulder Roll':Pathfinder2E.FEATURES['Boulder Roll'],
  'Defy The Darkness':
    'Section=feature ' +
    'Note="Can use Darkvision in magical darkness, but cannot use magic or abilities with the darkness trait"',
  'Dwarven Reinforcement':
    'Section=skill ' +
    'Note="Can use 1 hr work to give an item +%{rank.Crafting<3?1:rank.Crafting<4?2:3} Hardness for 24 hr"',
  'Echoes In Stone':
    'Action=1 ' +
    'Section=feature ' +
    'Note="Gives 20\' imprecise tremorsense when standing on earth or stone until the start of the next turn"',
  "Mountain's Stoutness":Pathfinder2E.FEATURES["Mountain's Stoutness"],
  'Stone Bones':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful DC 17 flat check turns a physical critical hit into a normal hit"',
  'Stonewalker':
    Pathfinder2E.FEATURES.Stonewalker
    .replace('Stonecunning', "Stonemason's Eye")
    .replace('Meld Into Stone', 'One With Stone')
    .replace('level', 'rank'),
  'March The Mines':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Gains a 15\' Burrow Speed and Strides or Burrows twice; can take along an adjacent willing ally"',
  'Telluric Power':
    'Section=magic ' +
    'Note="Melee Strikes vs. a foe standing on the same earth or stone surface inflict additional damage equal to the number of weapon damage dice"',
  'Stonegate':
    'Section=magic ' +
    'Note="Knows the Magic Passage divine innate spell; can cast it once per day at 7th rank to open passages through earth or stone"',
  'Stonewall':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Petrifies self until the end of the current turn, negating the damage from the triggering effect and subsequent effects that would not affect stone, once per day"',

  // Elf
  'Ancient Elf':'Section=feature Note="+1 Class Feat (multiclass dedication)"',
  'Arctic Elf':Pathfinder2E.FEATURES['Arctic Elf'],
  'Cavern Elf':Pathfinder2E.FEATURES['Cavern Elf'],
  'Elf Heritage':Pathfinder2E.FEATURES['Elf Heritage'],
  'Low-Light Vision':Pathfinder2E.FEATURES['Low-Light Vision'],
  'Seer Elf':Pathfinder2E.FEATURES['Seer Elf'],
  // Changed
  'Whisper Elf':
    'Section=skill ' +
    'Note="+2 Seek to locate creatures within 30\' and reduces the flat check DC to target a concealed or hidden foe to 3 or 9"',
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
      '"+2 vs. control effects, and successes vs. control effects are critical successes",' +
      '"+2 Sense Motive to detect controlled creatures"',
  'Martial Experience':
    'Section=combat ' +
    'Note="%{level>=11?\'Skill Trained (Simple Weapons; Martial Weapons; Advanced Weapons)\':\'+\'+level+\' attack with untrained weapons\'}"',
  'Elf Step':Pathfinder2E.FEATURES['Elf Step'],
  'Expert Longevity':Pathfinder2E.FEATURES['Expert Longevity'],
  'Otherworldly Acumen':
    'Section=magic ' +
    'Note="Knows 1 chosen 2nd-rank innate spell; can cast it once per day and use a day of downtime to change the spell chosen"',
  'Tree Climber':'Section=ability Note="Has a 10\' climb Speed"',
  'Avenge Ally':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Uses the better of 2 rolls on a Strike when within 30\' of a dying ally once per 10 min"',
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
      '"+2 Skill Feat (Additional Lore and Assurance for chosen Lore)",' +
      '"Can use 1 day of downtime to change the chosen Gnome Obsession skill"',
  // Changed
  'Gnome Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Gnome Weapons; Glaive; Kukri)",' +
      '"Has access to kukris and uncommon gnome weapons%{level>=5?\'/Critical hits with a gnome weapon, kukri, or glaive inflict its critical specialization effect\':\'\'}"',
  'Illusion Sense':Pathfinder2E.FEATURES['Illusion Sense'],
  'Razzle-Dazzle':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Extends an inflicted blinded or dazzled condition by 1 rd once per hr"',
  'Energized Font':Pathfinder2E.FEATURES['Energized Font'],
  'Project Persona':
    'Action=1 ' +
    'Section=magic ' +
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
    'Note="Forces a DC 10 flat check on an attacking foe once per hr; failure negates the attack"',
  'Homeward Bound':
    'Section=magic ' +
    'Note="Knows the Interplanar Teleport primal innate spell; can use it twice per week to travel to and from the First World"',

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
    'Note="Successful melee Strike inflicts -10\' Speed for 1 rd, or -15\' Speed on a critical success"',
  'Loud Singer':'Section=combat Note="Has increased Goblin Song effects"',
  'Vandal':
    'Section=combat,skill ' +
    'Note=' +
      '"Strikes against unattended objects and traps ignore Hardness 5",' +
      '"Skill Trained (Thievery)"',
  'Cave Climber':Pathfinder2E.FEATURES['Cave Climber'],
  'Cling':
    'Action=1 ' +
    'Section=combat ' +
    'Note="After a successful Strike with a hand free, can latch onto the target until a successful DC %{10+skillModifiers.Acrobatics} Escape"',
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
    'Note="R30\' Inflicts clumsy 1 for 1 min (<b>save Will</b> negates; critical failure inflicts clumsy 2 for 1 min) once per day"',
  'Jinxed Halfling':'Section=feature Note="Has the Jinx feature"',
  'Keen Eyes':Pathfinder2E.FEATURES['Keen Eyes'],
  'Nomadic Halfling':Pathfinder2E.FEATURES['Nomadic Halfling'],
  'Twilight Halfling':Pathfinder2E.FEATURES['Twilight Halfling'],
  'Wildwood Halfling':Pathfinder2E.FEATURES['Wildwood Halfling'],

  'Distracting Shadows':Pathfinder2E.FEATURES['Distracting Shadows'],
  'Folksy Patter':
    'Section=skill ' +
    'Note="Can transmit a 3-word hidden message to a target who succeeds on a DC 20 Perception check; the DC is reduced by 5 each for a halfling target and one with Folksy Patter, and a successful Perception vs. Deception allows others to understand the message"',
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
    .replace('-2', '+0'),
  'Cultural Adaptability (%ancestry)':
    Pathfinder2E.FEATURES['Cultural Adaptability (%ancestry)'],
  'Step Lively':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Follows a foe move that leaves it adjacent with a Step to a different adjacent space"',
  'Dance Underfoot':
    'Section=combat ' +
    'Note="Can end a Tumble Through or Step Lively action in the same space as a Large or larger foe"',
  'Guiding Luck':Pathfinder2E.FEATURES['Guiding Luck'],
  'Irrepressible':Pathfinder2E.FEATURES.Irrepressible,
  'Unhampered Passage':
    'Section=magic ' +
    'Note="Knows the Unfettered Movement primal innate spell; can cast it on self once per day"',
  'Ceaseless Shadows':Pathfinder2E.FEATURES['Ceaseless Shadows'],
  'Toppling Dance':
    'Section=combat ' +
    'Note="Melee and unarmed attacks on a foe in the same space have the trip trait/May share a space with a Large or larger prone creature"',
  'Shadow Self':
    'Section=skill ' +
    'Note="Can follow a successful Hide or Sneak with 1 min of invisibility once per hr; a hostile act ends"',

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
    'Note="R60\' Willing undetected allies are hidden instead and may be targeted with a DC 5 flat check"',
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
    'Section=combat,feature,save ' +
    'Note=' +
      '"+2 Hit Points",' +
      '"Can go 2 weeks without sunlight before starving",' +
      '"+2 vs. attempts to Reposition, Shove, or Trip and spells and effects that move or knock prone"',
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
    'Note="Can reach 10\' with two-handed weapons that inflict at least 1d6 HP; doing so reduces the damage die by 1 step"',
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
    'Action=Reaction ' +
    'Section=save ' +
    'Note="+1 on the triggering save vs. a spell or magical effect"',
  'Seedpod':
    'Section=combat ' +
    'Note="R30\' Seedpod attack inflicts 1d4 HP bludgeoning, plus -10\' Speed until the start of the next turn on a critical success"',
  'Shadow Of The Wilds':
    'Section=skill ' +
    'Note="Has continuous Covering Tracks effects outside of urban environments"',
  'Undaunted':
    'Section=save ' +
    'Note="+1 vs. emotion effects, and successes vs. emotion are critical successes"',
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
    'Note="Can speak with plants and fungi and gains +2 Diplomacy with plants or fungi similar to self"',
  'Bark And Tendril':
    'Section=magic ' +
    'Note="Knows the Entangling Flora and Oaken Resilience primal innate spells; can cast each at 2nd rank once per day"',
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
    'Note="Knows the Plant Form primal innate spell; can cast it at %{level>=17?6:5}th rank once per day"',
  'Cloak Of Poison':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful foe unarmed and non-reach melee attacks inflict 3d6 HP poison on the attacker for 1 min once per day"',
  'Flourish And Ruin':
    'Section=magic ' +
    'Note="Knows the Field Of Life and Tangling Creepers primal innate spells; can cast each at 6th rank once per day"',
  'Regrowth':
    'Section=magic ' +
    'Note="Knows the Regenerate primal innate spell; can cast it at 7th rank once per day"',

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
    'Section=combat ' +
    'Note="Fist attacks lose the nonlethal trait and gain the shove trait"',
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
    'Note="-1 DC on dying recovery checks, and suffers no debilitation after being returned to life"',
  'Scar-Thick Skin':
    'Section=save ' +
    'Note="Ends persistent bleed damage with success on a DC 10 flat check, or on a DC 5 flat check with help"',
  'Pervasive Superstition':Pathfinder2E.FEATURES['Pervasive Superstition'],
  'Undying Ferocity':
    'Section=combat ' +
    'Note="Using Orc Ferocity gives %{level} temporary Hit Point%{level>1?\'s\':\'\'}"',
  'Incredible Ferocity':Pathfinder2E.FEATURES['Incredible Ferocity'],
  'Ferocious Beasts':
    'Section=combat ' +
    'Note="Partnered animals have the Orc Ferocity %{$\'features.Undying Ferocity\'?\'and Undying Ferocity features\':\'feature\'}"',
  'Spell Devourer':
    'Section=save ' +
    'Note="Successful saves vs. magic give temporary Hit Points equal to the effect level or double the spell rank until the end of the next turn"',
  'Rampaging Ferocity':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Using Orc Ferocity gives a Strike against the attacking foe that allows another use of Orc Ferocity if it reduces the foe to 0 HP"',

  // Changeling
  'Changeling Heritage':
    'Section=feature ' +
    'Note="Has the changeling trait and may take changeling ancestry feats"',
  'Brine May':
    'Section=skill ' +
    'Note="Successful Swim checks are critical successes, and failure does not inflict sinking"',
  'Callow May':
    'Section=combat,feature ' +
    'Note=' +
      '"Rolling Deception for initiative makes foes that haven\'t acted off-guard vs. self",' +
      '"Has the Charming Liar feature"',
  'Dream May':
    'Section=save ' +
    'Note="+2 vs. sleep and dream effects/Sleep restores %{constitutionModifier*level} Hit Points and reduces drained and doomed conditions by 2"',
  'Slag May':
    'Section=combat,combat ' +
    'Note=' +
      '"Slag Claws inflict 1d6 HP slashing",' +
      '"Slag Claws are cold-iron weapons"',
  'Changeling Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Hag Lore) feature",' +
      '"Skill Trained (Deception; Occultism)"',
  'Hag Claws':'Section=combat Note="Claws inflict 1d4 HP slashing"',
  "Hag's Sight":'Section=feature Note="Has the Darkvision feature"',
  'Called':
    'Section=save ' +
    'Note="+1 vs. mental effects, and successes vs. mental control are critical successes"',
  'Mist Child':
    'Section=combat ' +
    'Note="Increases the flat check DC to target self when concealed or hidden to 6 or 12"',
  'Accursed Claws':
    'Section=combat ' +
    'Note="Critical hits with claws also inflict 1d4 HP persistent mental"',
  'Occult Resistance':'Section=save Note="+1 vs. occult effects"',
  'Hag Magic':
    'Section=magic ' +
    'Note="Knows 1 chosen occult innate spell of up to 4th rank; can cast it at 4th rank once per day"',

  // Nephilim
  'Nephilim Heritage':
    'Section=feature ' +
    'Note="Has the nephilim trait and may take nephilim ancestry feats"',
  'Angelkin':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Multilingual and Celestial Lineage features",' +
      '"Skill Trained (Society)/Knows the Empyrean language"',
  'Grimspawn':
    'Section=feature Note="Has the Diehard and Fiendish Lineage features"',
  'Hellspawn':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Lie To Me and Fiendish Lineage features",' +
      '"Skill Trained (Deception; Legal Lore)"',
  'Lawbringer':
    'Section=feature,save ' +
    'Note=' +
      '"Has the Celestial Lineage feature",' +
      '"+1 vs. emotion effects, and successes vs. emotion effects are critical successes"',
  'Musetouched':
    'Section=combat,feature ' +
    'Note=' +
      '"+1 on Escape attempts, critical failures to Escape are normal failures, and successes to Escape are critical successes",' +
      '"Has the Celestial Lineage feature"',
  'Pitborn':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Fiendish Lineage feature",' +
      // TODO randomizeOneAttribute won't process this extra feat properly
      '"Skill Trained (Athletics)/+1 Skill Feat (Athletics-based)"',
  'Celestial Lineage':
    'Section=feature Note="Can take feats that require celestial lineage"',
  'Fiendish Lineage':
    'Section=feature Note="Can take feats that require fiendish lineage"',
  'Bestial Manifestation (Claw)':
    'Section=combat Note="Claws inflict 1d4 HP slashing"',
  'Bestial Manifestation (Hoof)':
    'Section=combat Note="Hoof inflicts 1d6 HP bludgeoning"',
  'Bestial Manifestation (Jaws)':
    'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Bestial Manifestation (Tail)':
    'Section=combat Note="Tail inflicts 1d4 HP bludgeoning"',
  'Halo':
    'Section=magic ' +
    'Note="Can use a Sustain action to evoke or suppress a halo that lights a 20\' radius"',
  'Nephilim Eyes':
    'Section=feature Note="Has the Darkvision feature"',
  'Nephilim Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"+1 Skill Feat (Additional Lore for a related plane)",' +
      '"Skill Trained (Choose 1 from Diplomacy, Intimidation; Religion)"',
  'Nimble Hooves':'Section=ability Note="+5 Speed"',
  'Blessed Blood':
    'Section=combat,skill ' +
    'Note=' +
      '"Blood inflicts 1d6 HP spirit on a fiend, undead, or creature with holy weakness that inflicts unarmed slashing or piercing damage",' +
      '"+4 Crafting to create <i>holy water</i> using own blood"',
  'Extraplanar Supplication (Bane)':
    'Section=magic ' +
    'Note="Knows the Bane divine innate spell; can cast it at 1st rank once per day"',
  'Extraplanar Supplication (Bless)':
    'Section=magic ' +
    'Note="Knows the Bless divine innate spell; can cast it at 1st rank once per day"',
  'Nephilim Resistance':
    'Section=save Note="Has resistance 5 to a choice of energy"',
  'Scion Of Many Planes':
    'Section=feature Note="+1 Ancestry Feat (Nephilim lineage)"',
  'Skillful Tail':
    'Section=feature Note="Can use tail for simple Interact actions"',
  'Celestial Magic':
    'Section=magic ' +
    'Note="Knows 2 divine innate spells; can cast each at 2nd rank once per day"',
  'Divine Countermeasures':'Section=save Note="+1 vs. divine effects"',
  'Divine Wings':
    'Action=2 ' +
    'Section=ability ' +
    'Note="Brings forth wings that give a %{speed}\' fly Speed for 10 min once per day"',
  'Fiendish Magic':
    'Section=magic ' +
    'Note="Knows 2 divine innate spells; can cast each at 2nd rank once per day"',
  'Celestial Mercy':
    'Section=magic ' +
    'Note="Knows the Cleanse Affliction divine innate spell; can cast it at 4th rank twice per day"',
  'Slip Sideways':
    'Section=magic ' +
    'Note="Knows the Translocate divine innate spell; can cast it at 5th rank twice per day"',
  'Summon Nephilim Kin':
    'Section=magic ' +
    'Note="Knows 1 summoning divine innate spell; can cast it at 5th rank once per day to summon an extraplanar ally"',
  'Divine Declaration':
    'Section=magic ' +
    'Note="Knows the Divine Decree divine innate spell; can cast it at 7th rank once per day"',
  'Eternal Wings':'Section=ability Note="Has a %{speed}\' fly Speed"',

  // Aiuvarin
  'Aiuvarin Heritage':
    'Section=feature ' +
    'Note="Has the elf and aiuvarin traits and may take elf and aiuvarin ancestry feats"',
  'Earned Glory':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Impressive Performance feature",' +
      '"Skill Trained (Performance)",' +
      '"Critical failures on Performance to Make An Impression on an elf are normal failures"',
  'Elf Atavism':Pathfinder2E.FEATURES['Elf Atavism'],
  'Inspire Imitation':Pathfinder2E.FEATURES['Inspire Imitation'],
  'Supernatural Charm':
    Pathfinder2E.FEATURES['Supernatural Charm']
    .replace('level', 'rank'),

  // Dromaar
  'Dromaar':
    'Section=feature ' +
    'Note="Has the orc and dromaar traits and may take orc and dromaar ancestry feats"',
  'Monstrous Peacemaker':Pathfinder2E.FEATURES['Monstrous Peacemaker'],
  'Orc Sight':Pathfinder2E.FEATURES['Orc Sight'],

  // Core 2

  // Catfolk
  'Catfolk Heritage':'Section=feature Note="1 selection"',
  'Clawed Catfolk':'Section=combat Note="Claws inflict 1d6 HP slashing"',
  'Hunting Catfolk':
    'Section=skill ' +
    'Note="Has 30\' imprecise scent, and gains +2 to Track familiar scents"',
  'Jungle Catfolk':
    'Section=ability ' +
    'Note="Moves normally through undergrowth difficult terrain, and through undergrowth greater difficult terrain as difficult terrain"',
  'Land On Your Feet':
    'Section=save ' +
    'Note="Takes half damage from falling and does not land prone"',
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
    'Note="+2 to Seek creatures within 30\' that can be heard, and can Point Out a heard creature as a free action once per rd"',
  'Winter Catfolk':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1} and treats environmental cold as 1 step less extreme"',

  'Cat Nap':
    'Section=combat ' +
    'Note="10 min sleep gives %{level} temporary Hit Point%{level>1?\'s\':\'\'} for 1 hr once per hr"',
  "Cat's Luck":
    'Action=Free ' +
    'Section=save ' +
    'Note="Rerolls a failed Reflex save%{saveNotes.luckyBreak?\', Fortitude save, Acrobatics check, or Athletics check\':\'\'} once per %{saveNotes.reliableLuck?\'hr\':\'day\'}"',
  'Catfolk Dance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Acrobatics vs. Reflex inflicts -2 Reflex on an adjacent target until the start of the next turn, or -2 Reflex and off-guard on a critical success"',
  'Catfolk Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Catfolk Lore) feature",' +
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
  'Graceful Guidance':'Section=save Note="Can Aid an ally\'s Reflex save"',
  'Light Paws':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Takes a Stride and a Step, ignoring difficult terrain"',
  'Lucky Break':'Section=save Note="Has increased Cat\'s Luck effects"',
  'Pride Hunter':
    'Section=skill Note="Can use lesser cover from allies to Hide"',
  'Springing Leaper':
    'Section=skill ' +
    'Note="Can use 2 or 3 actions to double or triple vertical Leap distance, and can Long Jump in a different direction than the preceding Stride"',
  'Well-Groomed':
    'Section=save ' +
    'Note="+2 vs. disease, and successes vs. disease are critical successes"',
  'Aggravating Scratch':
    'Section=combat ' +
    'Note="Critical hits with claws also inflict 1d4 HP persistent poison"',
  'Evade Doom':
    'Section=save ' +
    'Note="Successful DC 17 flat check negates acquiring the doomed condition"',
  'Luck Of The Clowder':
    'Section=save Note="Cat\'s Luck also gives targets within 10\' a reroll"',
  "Predator's Growl":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Attempts to Demoralize an uncovered creature, suffering no penalty for lacking a shared language"',
  'Silent Step':'Action=1 Section=combat Note="Steps, then Hides or Sneaks"',
  'Wary Skulker':
    'Section=skill Note="Can Scout and Avoid Notice simultaneously"',
  'Black Cat Curse':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R30\' Forces target to reroll a successful save once per day"',
  'Caterwaul':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives 1 HP and a wounded condition increase to an ally reduced to 0 HP once per day"',
  'Elude Trouble':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Strides up to %{speed}\' in response to a missed melee attack, triggering no reaction from the attacking foe"',
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
    'Note="+1 vs. the triggering magical effect, or +2 vs. an arcane effect"',
  'Runtboss Hobgoblin':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Group Coercion feature",' +
      '"Successes on Coercion checks vs. goblins are critical successes and critical failures are normal failures"',
  'Shortshanks Hobgoblin':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Ride feature",' +
      '"Climbing does not inflict off-guard"',
  'Smokeworker Hobgoblin':
    'Section=combat,save ' +
    'Note=' +
      '"Targeting a smoke-concealed creature requires no flat check",' +
      '"Has fire resistance %{level//2>?1}"',
  'Warmarch Hobgoblin':
    'Section=skill ' +
    'Note="Normal failures to Subsist in wilderness locate enough poor fare to stay fed/Can Hustle twice as long as normal when exploring"',
  'Warrenbred Hobgoblin':
    'Section=combat,skill ' +
    'Note=' +
      '"Reduces the flat check DC to target a concealed or hidden foe to 3 or 9",' +
      '"Successes on Acrobatics to Squeeze are critical successes"',

  'Alchemical Scholar':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Alchemical Crafting feature",' +
      '"Knows +%{level} common alchemical formulas"',
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
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike with a flail inflicts -10\' Speed, or -15\' Speed on a critical hit, for 1 rd"',
  'Remorseless Lash':
    'Section=combat ' +
    'Note="Melee hits prevent reduction of a frightened condition until the beginning of the next turn"',
  'Sneaky':'Section=skill Note="+5 Sneak speed, and can Sneak between cover"',
  'Stone Face':
    'Section=save Note="+1 vs. fear and +2 Will DC vs. Intimidation"',
  'Vigorous Health':
    'Section=save ' +
    'Note="Successful DC 17 flat check negates gaining the drained condition"',
  'Agonizing Rebuke':
    'Section=combat ' +
    'Note="Successful Demoralize inflicts %{rank.Intimidation<3?1:rank.Intimidation<4?2:3}d4 HP mental each rd for 1 min or until the target is more than 30\' away or no longer frightened"',
  'Expert Drill Sergeant':
    'Section=skill ' +
    'Note="Following an Expert while exploring gives allies a +3 or +4 bonus on skills with expert or master proficiency"',
  'Recognize Ambush':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Draws a weapon during initiative"',
  'Runtsage':
    'Section=feature Note="Has the Adopted Ancestry (Goblin) feature/+1 Ancestry Feat (Goblin feat)"',
  'Cantorian Rejuvenation':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Recovers %{level<15?4:6}d6 Hit Points and gains %{level<15?10:15} temporary Hit Points for 1 min once per day"',
  'Fell Rider':
    'Section=feature ' +
    'Note="Animal companion is trained in Intimidation and can give Aid on Demoralize attempts"',
  'Pride In Arms':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives an ally who brings a foe to 0 HP temporary HP equal to their Constitution modifier until the end of their next turn"',
  'Squad Tactics':
    'Section=combat ' +
    'Note="Adjacent foes within reach of 2 allies are off-guard vs. self"',
  "Can't Fall Here":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Adjacent willing ally reduced to 0 Hit Points retains 1 Hit Point, suffers a wounded level, and gains %{level} temporary Hit Point%{level>1?\'s\':\'\'} for 1 min once per day"',
  'War Conditioning (Climb)':'Section=ability Note="Has a 20\' climb Speed"',
  'War Conditioning (Swim)':'Section=ability Note="Has a 20\' swim Speed"',
  'Cantorian Restoration':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R60\' Restores 6d8+%{constitutionModifier} Hit Points to a dying creature once per day"',
  'Rallying Cry':
    'Action=2 ' +
    'Section=combat ' +
    'Note="30\' emanation gives allies %{level} temporary Hit Point%{level>1?\'s\':\'\'} and an additional Step, Stride, or Strike each rd for 1 min once per day"',

  // Kholo
  'Ant Kholo':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"+1 initiative when using Deception",' +
      '"Has the Small feature",' +
      '"Skill Trained (Deception)",' +
      '"+1 Deception to claim innocence and +1 Deception DC vs. Sense Motive to notice lies about innocence"',
  'Bite':'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Cave Kholo':'Section=feature Note="Has the Darkvision feature"',
  'Dog Kholo':'Section=ability Note="Has 30\' Speed on all fours"',
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
       '"+%{skillNotes.breathLikeHoney?2:1} to Make An Impression when breath can be smelled"',
  'Winter Kholo':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1} and treats environmental cold as 1 step less extreme"',
  'Witch Kholo':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows the Figment occult innate cantrip; can cast it at will",' +
      '"+1 to Create A Diversion or Impersonate using voice"',

  'Ask The Bones':
    'Action=Free ' +
    'Section=skill ' +
    'Note="Gains +1 to Recall Knowledge if the source of possessed bones knew the topic well once per day"',
  'Crunch':
    'Section=combat,combat ' +
    'Note=' +
      '"Jaws inflict 1d8 HP",' +
      '"Jaws have the grapple trait"',
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
    'Section=skill Note="+2 to Aid and to allies\' checks to Aid self"',
  'Sensitive Nose':'Section=skill Note="Has 30\' imprecise scent"',
  'Absorb Strength':
    'Action=1 ' +
    'Section=feature ' +
    'Note="Consuming a piece of a foe\'s fresh corpse gives temporary Hit Points equal to the foe\'s level for 1 min once per hr"',
  'Distant Cackle':
    'Section=magic ' +
    'Note="Knows the Ventriloquism occult innate spell; can cast it at 1st rank once per day"',
  'Pack Stalker':
    'Section=feature,skill ' +
    'Note=' +
      '"+1 Skill Feat (Terrain Stalker feat)",' +
      '"Can extend Terrain Stalker effects to %{rank.Stealth<3?\'1 ally\':rank.Stealth<4?\'2 allies\':\'3 allies\'} within 10\'"',
  'Rabid Sprint':'Action=2 Section=combat Note="Strides on all fours 3 times"',
  'Affliction Resistance':
    'Section=save ' +
    'Note="+1 vs. disease and poison, and successes vs. disease and poison are critical successes"',
  'Left-Hand Blood':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Suffers 1 HP slashing to enhance a weapon to inflict 1d4 HP persistent poison on the next hit before the end of the next turn once per hr"',
  'Right-Hand Blood':
    'Section=skill ' +
    'Note="Can suffer 1 HP slashing to gain +1 on Administer First Aid or 2d8 HP slashing to gain +1 on Treat Disease or Treat Wounds"',
  'Ambush Hunter':
    'Section=skill Note="Can Scout and Avoid Notice simultaneously"',
  'Breath Like Honey':
    'Section=magic,skill ' +
    'Note=' +
      '"Knows the Enthrall occult innate spell; can cast it at 3rd rank once per day with a range of 30\'",' +
      '"Has increased Sweetbreath Kholo effects"',
  "Grandmother's Wisdom":
    'Section=magic ' +
    'Note="Knows the Augury occult innate spell; can cast it at 2nd rank twice a day"',
  'Laughing Kholo':
    'Section=combat,feature ' +
    'Note=' +
      '"Suffers no Demoralize penalty for lacking a shared language",' +
      '"Has the Battle Cry feature"',
  "Ancestor's Rage":
    'Section=magic ' +
    'Note="Knows the Animal Form occult innate spell; can cast it at 5th rank once per day to become a canine"',
  "Bonekeeper's Bane":
    'Section=combat ' +
    'Note="Adjacent foes suffer -1 attacks and skill checks once per foe per day (<b>save Will</b> negates)"',
  'First To Strike, First To Fall':
    'Section=feature ' +
    'Note="Successful Strike in the 1st round on a foe that hasn\'t acted inflicts off-guard until the end of the next turn; reducing the foe to 0 HP by the end of that turn gives self and allies within 30\' an extra Step, Stride, or Strike until the end of the following turn"',
  'Impaling Bone':
    'Section=magic ' +
    'Note="Knows the Impaling Spike occult innate spell; can cast it at 7th rank once per day for a bone spike that affects both corporeal or incorporeal targets"',
  'Legendary Laugh':
    'Section=combat ' +
    'Note="Can Demoralize targets up to 60\' away, and success inflicts 3d8 HP mental, or 6d8 HP on a critical success"',

  // Kobold
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
    'Note="+1 vs. a choice of cold, electricity, fire, sonic, acid, or poison"',
  'Kobold Heritage':'Section=feature Note="1 selection"',
  'Spellhorn Kobold':
    'Section=magic ' +
    'Note="Knows 1 chosen arcane innate cantrip; can cast it at will"',
  'Strongjaw Kobold':'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Tunnelflood Kobold':'Section=ability Note="Has a 15\' swim Speed"',
  'Venomtail Kobold':'Section=feature Note="Has the Tail Toxin feature"',
  'Tail Toxin':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Enhances a piercing or slashing weapon to inflict %{level} HP persistent poison on the next hit before the end of the next turn once per day"',

  'Cringe':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Lowers the damage of a foe\'s critical hit by %{level+2} once per foe per day"',
  "Dragon's Presence":
    'Section=combat,save ' +
    'Note=' +
      '"+1 to Demoralize a foe of equal or lesser level",' +
      '"Successes vs. fear are critical successes, and failures vs. fear are critical failures"',
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
    'Note="Strides up to %{speed+5}\' feet away from an adjacent foe to a clear space, gaining +2 Armor Class against triggered reactions"',
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
    'Note="Can Craft snares in 3 actions instead of 1 min and prepare %{rank.Crafting<3?3:rank.Crafting<4?4:5} snares for quick deployment during daily prep/Creatures who critically fail saves vs. self snares suffer off-guard until the end of their next turn"',
  'Winglets':
    'Section=skill ' +
    'Note="+5\' horizontal Leap and +10\' Long Jump distances, and can High Jump and Long Jump without a Stride"',
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
    'Note="Knows 1 chosen 1st-rank and 1 chosen 2nd-rank arcane innate spell; can cast each once per day"',
  'Fleeing Shriek':
    'Action=2 ' +
    'Section=combat ' +
    'Note="10\' emanation inflicts %{(level+1)//2>?5}d6 HP sonic (<b>save basic Fortitude</b>), and a subsequent Stride triggers no reactions from any creature that critically failed its save, once per hr"',
  'Winglet Flight':'Action=1 Section=ability Note="Can Fly 20\' once per rd"',
  'Resplendent Spellhorn':
    'Section=magic ' +
    'Note="Knows 1 chosen 3rd-rank and 1 chosen 4th-rank arcane innate spell; can cast each once per day"',
  'Tumbling Diversion':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Tumble Through a foe\'s space allows a subsequent +1 Create A Diversion attempt, or +2 on a critical success, to make self hidden to that foe"',
  'Vicious Snares':
    'Section=skill ' +
    'Note="Snares inflict +%{rank.Crafting<4?1:2}d6 HP precision"',
  "Benefactor's Majesty":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives self %{level} temporary Hit Point%{level>1?\'s\':\'\'} for 1 min and flat checks to remove persistent damage, and requires foes to succeed on a DC 11 flat check to attack self until the start of the next turn, once per day"',

  // Lizardfolk
  'Aquatic Adaptation':'Section=feature Note="Has the Breath Control feature"',
  'Claws':'Section=combat Note="Claws inflict 1d4 HP slashing"',
  'Cliffscale Lizardfolk':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Combat Climber feature",' +
      '"Can use bare feet to Climb without using hands, and successes on Athletics to Climb are critical successes"',
  'Cloudleaper Lizardfolk':
    'Section=save Note="Can use limbs to negate falling damage"',
  'Frilled Lizardfolk':
    'Section=combat,feature ' +
    'Note=' +
      '"Can use visual threats to Demoralize",' +
      '"Has the Threatening Approach feature"',
  'Lizardfolk Heritage':'Section=feature Note="1 selection"',
  'Sandstrider Lizardfolk':
    'Section=save ' +
    'Note="Has fire resistance %{level//2>?1}, treats environmental heat as 1 step less extreme but environmental cold as 1 step more extreme without protection, and can last 10x as long as normal without food and water"',
  'Threatening Approach':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Demoralize after Striding to a spot adjacent to a foe inflicts frightened 2"',
  'Unseen Lizardfolk':
    Pathfinder2E.FEATURES['Chameleon Gnome']
    .replace('and hair colors', 'color'),
  'Wetlander Lizardfolk':'Section=ability Note="Has a 15\' swim Speed"',
  'Woodstalker Lizardfolk':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Terrain Stalker (Underbrush) feature",' +
      '"Can always Take Cover in forest or jungle"',

  'Bone Magic (Occult)':
    'Section=magic ' +
    'Note="Knows 1 chosen occult innate cantrip; can cast it at will"',
  'Bone Magic (Primal)':
    'Section=magic ' +
    'Note="Knows 1 chosen primal innate cantrip; can cast it at will"',
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
      '"+1 Skill Feat (Additional Lore for Astrology Lore or Lizardfolk Lore)",' +
      '"Skill Trained (Survival; Choose 1 from Nature, Occultism)"',
  'Marsh Runner':
    'Section=combat,skill ' +
   'Note=' +
     '"Can Step in difficult terrain caused by flooding, swamps, and quicksand",' +
     '"Using Acrobatics to Balance on narrow surfaces or marshy ground does not inflict off-guard, and successes to do so are critical successes"',
  'Parthenogenic Hatchling':
    'Section=save ' +
    'Note="+1 vs. disease, and successes vs. disease are critical successes/Takes damage from thirst every 2 hr and from starvation every 2 days"',
  'Reptile Speaker':'Section=skill Note="Can converse with reptiles"',
  'Envenom Fangs':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Enhances fangs to inflict +1d6 HP persistent poison on the next hit before the end of the next turn once per hr"',
  'Flexible Tail':
    'Section=feature Note="Can use tail to perform simple Interact actions"',
  "Gecko's Grip":
    'Section=ability,feature,skill ' +
    'Note=' +
      '"Has a 15\' climb Speed",' +
      '"Has the Combat Climber feature",' +
      '"Successes on Athletics to Climb are critical successes"',
  'Shed Tail':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Can release tail to escape being grabbed and then Stride without triggering reactions from the grabbing creature; regrowth takes 1 day and inflicts -2 Balance"',
  'Swift Swimmer':
    'Section=ability ' +
    'Note="Has a %{abilityNotes.wetlanderLizardfolk?25:15}\' swim Speed"',
  'Dangle':
    'Section=feature Note="Can use limbs freely while hanging from tail"',
  'Hone Claws':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Enhances claws to inflict +1d6 HP bleed damage on the next hit once per hr"',
  'Terrain Advantage':
    'Section=combat ' +
    'Note="Non-lizardfolk foes in difficult terrain or in water without a swim Speed are off-guard vs. self"',
  'Bone Investiture (Occult)':
    'Section=magic ' +
    'Note="Knows the Dinosaur Form occult innate spell; can cast it at 5th rank once per day"',
  'Bone Investiture (Primal)':
    'Section=magic ' +
    'Note="Knows the Dinosaur Form occult innate spell; can cast it at 5th rank once per day"',
  'Iruxi Spirit Strike':
    'Section=combat ' +
    'Note="Lizardfolk ancestry attacks have the <i>ghost touch</i> property"',
  'Primal Rampage (Occult)':
    'Section=magic ' +
    'Note="Knows the Unfettered Movement and Mountain Resilience occult innate spells; can cast each at 4th rank once per day or use 3 actions to cast both simultaneously"',
  'Primal Rampage (Primal)':
    'Section=magic ' +
    'Note="Knows the Unfettered Movement and Mountain Resilience occult innate spells; can each at 4th rank once per day or use 3 actions to cast both simultaneously"',
  'Fossil Rider (Occult)':
    'Section=magic ' +
    'Note="Knows the Mask Of Terror occult innate spell; can cast it once per day"',
  'Fossil Rider (Primal)':
    'Section=magic ' +
    'Note="Knows the Mask Of Terror occult innate spell; can cast it once per day"',
  'Scion Transformation':
    'Section=feature ' +
    'Note="Can use a 24-hr hibernation to gain the effects of <i>Enlarge</i> and +%{level} Hit Points permanently"',

  // Ratfolk
  // Low-Light Vision as above
  'Sharp Teeth':'Section=combat Note="Jaws inflict 1d4 HP piercing"',
  'Deep Rat':'Section=feature Note="Has the Darkvision feature"',
  'Desert Rat':
    'Section=ability,save ' +
    'Note=' +
      '"Has 30\' Speed on all fours",' +
      '"Treats environmental heat as 1 step less extreme but environmental cold as 1 step more extreme without protection, and can last 10x as long as normal without food and water"',
  'Longsnout Rat':
    'Section=skill ' +
    'Note="Has 30\' imprecise scent, and gains +2 Perception to Seek using scent"',
  'Ratfolk Heritage':'Section=feature Note="1 selection"',
  'Sewer Rat':
     'Section=save ' +
     'Note="Immune to putrid plague, +1 vs. disease and poison, and successes vs. disease and poison are critical successes"',
  'Shadow Rat':
    'Section=combat,skill,skill ' +
    'Note=' +
      '"Can use Intimidation to Coerce animals and suffers no Demoralize penalty for lacking a shared language with them",' +
      '"Skill Trained (Intimidation)",' +
      '"Suffers 1 step worse on initial animal attitudes"',
  'Snow Rat':
    'Section=save ' +
    'Note="Has cold resistance %{level//2>?1} and treats environmental cold as 1 step less extreme"',
  'Tunnel Rat':
    'Section=ability,skill ' +
    'Note=' +
      '"Moves normally through snug spaces",' +
      '"Has the Quick Squeeze feature"',

  'Cheek Pouches':
    'Section=feature Note="Can store %{featureNotes.bigMouth?\'1 Bulk of items\':\'4 items of light Bulk\'} in cheeks"',
  'Pack Rat':'Section=feature Note="Can store 50% extra Bulk in containers"',
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
      '"Suffers no Crafting penalty to Repair an item without a toolkit, and gains +1 with a toolkit"',
  'Vicious Incisors':'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Warren Navigator':
    'Section=save,skill,skill ' +
    'Note=' +
      '"Improves save results vs. <i>Quandary</i> by 1 degree",' +
      '"Skill Trained (Survival)",' +
      '"Improves Sense Direction check results by 1 degree, and suffers no penalty from having no compass"',
  'Cornered Fury':
    'Section=combat ' +
    'Note="Critical hit by a larger foe leaves it off-guard vs. self for 1 rd"',
  'Lab Rat':
     'Section=save ' +
     'Note="+1 vs. disease and poison, and successes vs. disease and poison are critical successes"',
  'Quick Stow':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Stows an item in cheek pouches once per rd"',
  'Rat Magic':
    'Section=magic ' +
    'Note="Knows the Animal Messenger primal innate spell; can cast it once per day"',
  'Ratfolk Roll':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Rolls %{speed*4}\' per rd down an incline; after the 1st rd, suffers slowed 2 and suffers and inflicts 4d6 HP bludgeoning if stopped by an obstacle"',
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
    'Note="R120\' Rats swarming a 30\' burst inflict on foes difficult terrain, 6d8 HP piercing initially, and 3d6 HP piercing per rd for 1 min once per day"',
  'Greater Than The Sum':
    'Section=magic ' +
    'Note="Knows the Enlarge primal innate spell; can cast it at 6th rank once per day"',

  // Tengu
  // Low-Light Vision as above
  'Sharp Beak':'Section=combat Note="Beak inflicts 1d6 HP piercing"',
  'Dogtooth Tengu':'Section=combat Note="Beak has the deadly d8 trait"',
  'Jinxed Tengu':
    'Section=save ' +
    'Note="Successful saves vs. curses are critical successes, and a successful DC 17 flat check on gaining a doomed condition reduces its severity by 1"',
  'Mountainkeeper Tengu':
    'Section=magic,magic ' +
    'Note=' +
      '"Knows the Vitality Lash primal innate cantrip; can cast it at will",' +
      '"Can cast tengu-acquired spells as divine or primal spells"',
  'Skyborn Tengu':'Section=save Note="Takes no damage from falling"',
  'Stormtossed Tengu':
    'Section=combat,save ' +
    'Note=' +
      '"Ignores target concealment from rain or fog",' +
      '"Has resistance %{level//2>?1} to electricity"',
  'Taloned Tengu':
    'Section=combat Note="Talons inflict 1d4 HP slashing or piercing"',
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
    'Note="Changes the triggering critical failure on Deception, Diplomacy, or Intimidation with a non-tengu target into a normal failure; cannot be used again on the target or observers for 1 day"',
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
      '"Can gain familiarity with a sword during daily prep/Has access to uncommon tengu weapons%{level>=5?\'/Critical hits with a tengu weapon, katana, khakkara, temple sword, or wakizashi inflict its critical specialization effect\':\'\'}"',
  'Uncanny Agility':
    'Section=ability,feature ' +
    'Note=' +
      '"Can Step into difficult terrain caused by uneven ground",' +
      '"Has the Steady Balance feature"',
  'Eat Fortune':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R60\' Counteracts a fortune or misfortune effect once per %{combatNotes.jinxGlutton?\'hr\':\'day\'}"',
  'Long-Nosed Form':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Becomes a human with tengu-like features"',
  'Magpie Snatch':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Picks up an unattended object while Striding twice"',
  'Soaring Flight':'Action=1 Section=ability Note="Flies 20\' once per rd"',
  'Tengu Feather Fan':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Wave Fan feature",' +
      '"Knows the Gust Of Wind primal spell; can cast it at 1st rank using the feather fan"',
  'Wave Fan':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Can cast a spell using the feather fan %V time%{magicNotes.waveFan>1?\'s\':\'\'} per day"',
  'Soaring Form':'Section=ability Note="Has a 20\' fly Speed"',
  "Wind God's Fan":
    'Section=magic ' +
    'Note="Knows the Wall Of Wind primal spell; can cast it at 3rd rank using the feather fan/+1 feather fan use per day"',
  "Harbinger's Claw":
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="R60\' Inflicts the worse of 2 rolls on the triggering attack or skill check once per day"',
  'Jinx Glutton':'Section=combat Note="Has increased Eat Fortune effects"',
  "Thunder God's Fan":
    'Section=magic ' +
    'Note="Knows the Lightning Bolt primal spell; can cast it at 5th rank using the feather fan/+1 feather fan use per day"',
  'Great Tengu Form':
    'Section=magic ' +
    'Note="Gains the effects of 4th-rank <i>Enlarge</i> and <i>Fly</i> while in Long-Nosed form for 5 min once per day"',
  'Trickster Tengu':
    'Section=magic ' +
    'Note="Knows the Aerial Form and Cursed Metamorphosis primal innate spells; can cast 1 of them at 7th rank once per day"',

  // Tripkee
  // Low-Light Vision as above
  'Natural Climber':'Section=skill Note="+2 Athletics to Climb"',
  'Tripkee Heritage':'Section=feature Note="1 selection"',
  'Poisonhide Tripkee':'Section=feature Note="Has the Toxic Skin feature"',
  'Toxic Skin':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Inflicts %{(level+1)//2}d4 HP poison on triggering touch (<b>save basic Fortitude</b>) once per hr"',
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
  'Windweb Tripkee':
    'Section=save Note="Takes no damage from falling with a hand free"',

  'Croak Talker':'Section=skill Note="Can converse with amphibians"',
  "Hunter's Defense":
    'Action=Reaction ' +
    'Section=feature ' +
    'Note="Can use Nature DC instead of Armor Class vs. a nature creature once per hr"',
  'Jungle Strider':
    'Section=ability,skill ' +
    'Note=' +
      '"Moves normally through difficult terrain in forests and jungles",' +
      '"Does not suffer off-guard when Balancing on narrow surfaces or uneven ground made of plants, and successes to do so are critical successes"',
  'Nocturnal Tripkee':'Section=feature Note="Has the Darkvision feature"',
  'Terrifying Croak':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Demoralize attempt suffers no penalty for lacking a shared language; success prevents reducing the target\'s frightened condition below 1 for 1 rd"',
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
    'Section=skill ' +
    'Note="Gives +5\' vertical and +10\' horizontal Leap distance"',
  'Long Tongue':'Section=feature Note="Gives +5\' reach using tongue"',
  'Prodigious Climber':
    'Section=ability ' +
    'Note="Has a %{skillNotes.stickytoeTripkee?20:10}\' climb Speed"',
  'Tenacious Net':
    'Section=skill ' +
    'Note="Nets require a successful DC 18 to Escape, and a successful Escape leaves the target off-guard until the start of their next turn"',
  'Tripkee Glide':
    'Action=1 ' +
    'Section=ability ' +
    'Note="Can glide 5\' down and up to 25\' forward each rd with a hand free"',
  'Vomit Stomach':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Reduces a sickened condition by 2 and gives a +2 save vs. recently-ingested poisons, leaving self off-guard for 1 rd, once per day"',
  'Absorb Toxin':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Successful counteract check ends the effects on others of an area disease or poison affect; requires a successful -2 save to avoid the effects on self"',
  'Moisture Bath':
    'Action=1 ' +
    'Section=save ' +
    'Note="Successful DC 10 flat check ends persistent fire and cold damage and gives fire and cold resistance %{level//2} for 1 min once per day"',
  'Ricocheting Leap':
    'Section=skill ' +
    'Note="Can use Wall Jump to carom off creatures that are larger than self and to Shove or Trip a creature once per turn"',
  'Tongue Tether':
    'Section=combat ' +
    'Note="Can use tongue to Disarm, Grab An Edge, Reposition, and Trip"',
  'Envenomed Edge':
    'Section=combat ' +
    'Note="Critical hits that inflict slashing or piercing damage also inflict 1d4 HP persistent poison"',
  'Hop Up':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Stands without triggering reactions when regaining consciousness"',
  'Unbound Leaper':'Section=skill Note="Can Leap 30\' in any direction"',

  // Dhampir
  'Dhampir Heritage':
    'Section=feature ' +
    'Note="Has the dhampir trait and may take dhampir ancestry feats"',
  'Void Healing':
    'Section=save Note="Vitality effects cause harm and void effects heal"',
  'Straveika':
    'Section=skill ' +
    'Note="+1 Perception to Sense Motive and +1 Perception DC vs. Lies"',
  'Svetocher':
    'Section=save,skill ' +
    'Note=' +
      '"Treats drained condition as 1 step lower for Fortitude save and Hit Point reduction",' +
      '"Skill Trained (Diplomacy)"',
  'Eyes Of Night':'Section=feature Note="Has the Darkvision feature"',
  'Fangs':'Section=combat Note="Fangs inflict 1d6 HP piercing"',
  'Vampire Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Vampire Lore) feature",' +
      '"Skill Trained (Religion; Society)"',
  'Voice Of The Night':
    'Section=skill ' +
    'Note="Can converse with bats, rats, and wolves, and gains +1 to Make An Impression on them"',
  'Enthralling Allure':
    'Section=magic ' +
    'Note="Knows the Charm divine innate spell; can cast it at rank %{(level+1)//2} once per day"',
  'Necromantic Physiology':
    'Section=save ' +
    'Note="+2 vs. disease, and successful saves vs. disease are critical successes"',
  'Undead Slayer':
    'Section=combat ' +
    'Note="Inflicts additional damage vs. undead equal to the number of weapon damage dice, or double the number of dice vs. vampires"',
  'Bloodletting Fangs':
    'Section=combat ' +
    'Note="Fangs inflict +1d4 HP persistent bleed on a critical hit"',
  'Night Magic':
    'Section=magic ' +
    'Note="Knows the Animal Form and Mist divine innate spells; can cast each (Animal Form wolf only) at 2nd rank once per day"',
  'Form Of The Bat':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Knows the Pest Form divine innate spell; can cast it (bat form only) at 4th rank once per hr"',
  'Symphony Of Blood':
    'Section=magic ' +
    'Note="Knows the Vampiric Exsanguination divine innate spell; can cast it at 7th rank once per day"',

  // Dragonblood
  'Dragonblood Heritage':
    'Section=feature,save ' +
    'Note=' +
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
    'Action=2 ' +
    'Section=combat ' +
    'Note="Breath inflicts %{(level+1)//2}d%{combatNotes.formidableBreath?6:4} HP %V (<b>save basic %1</b>) in a %{combatNotes.formidableBreath?30:15}\' cone or %{combatNotes.formidableBreath?60:30}\' line once every 1d4 rd"',
  'Draconic Aspect (Claw)':
    'Section=combat Note="Claws inflict 1d4 HP slashing"',
  'Draconic Aspect (Jaws)':
    'Section=combat Note="Jaws inflict 1d6 HP piercing"',
  'Draconic Aspect (Tail)':
    'Section=combat Note="Tail inflicts 1d6 HP bludgeoning"',
  'Draconic Resistance':
    'Section=save Note="Has resistance %{level//2>?1} to %V, or resistance %{level} if the source is a dragon"',
  'Draconic Sight':'Section=feature Note="Has the %V feature"',
  'Dragon Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Dragon Lore) feature",' +
      '"Skill Trained (Diplomacy; Intimidation)"',
  'Scaly Hide':
    'Section=combat ' +
    'Note="+%{2-(dexterityModifier-3>?0)} Armor Class in no armor"',
  'Deadly Aspect':
    'Section=combat Note="Draconic Aspect attack has the deadly d8 trait"',
  'Draconic Scent':'Section=skill Note="Has 30\' imprecise scent"',
  "Dragon's Flight":
    'Action=1 Section=ability Note="Can Fly 20\' once per rd"',
  'Traditional Resistances':
    'Section=save ' +
    'Note="+1 Armor Class and saves vs. %V magical effects, or +2 vs. %V sleep and paralysis"',
  'Formidable Breath':
    'Section=combat Note="Has increased Breath Of The Dragon effects"',
  "True Dragon's Flight":'Section=ability Note="Has a 20\' fly Speed"',
  'Wing Buffet':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Athletics vs. Fortitude inflicts on 2 adjacent targets %{level} HP bludgeoning and a 5\' push, %{level*2} HP and a 10\' push on a critical success, or %{level//2} HP only on a failure; critical failure inflicts prone on self"',
  'Draconic Veil (Arcane)':
    'Section=magic ' +
    'Note="Knows the Humanoid Form arcane innate spell; can cast it at 5th rank once per day, lasting 1 hr"',
  'Draconic Veil (Divine)':
    'Section=magic ' +
    'Note="Knows the Humanoid Form divine innate spell; can cast it at 5th rank once per day, lasting 1 hr"',
  'Draconic Veil (Occult)':
    'Section=magic ' +
    'Note="Knows the Humanoid Form occult innate spell; can cast it at 5th rank once per day, lasting 1 hr"',
  'Draconic Veil (Primal)':
    'Section=magic ' +
    'Note="Knows the Humanoid Form primal innate spell; can cast it at 5th rank once per day, lasting 1 hr"',
  'Majestic Presence':
    'Action=1 ' +
    'Section=combat ' +
    'Note="20\' emanation inflicts frightened 2 once per creature per day (<b>save Will</b> inflicts frightened 1; critical success negates, critical failure inflicts frightened 4)"',
  'Form Of The Dragon (Arcane)':
    'Section=magic ' +
    'Note="Knows the Dragon Form arcane innate spell; can cast it at 8th rank once per day"',
  'Form Of The Dragon (Divine)':
    'Section=magic ' +
    'Note="Knows the Dragon Form divine innate spell; can cast it at 8th rank once per day"',
  'Form Of The Dragon (Occult)':
    'Section=magic ' +
    'Note="Knows the Dragon Form occult innate spell; can cast it at 8th rank once per day"',
  'Form Of The Dragon (Primal)':
    'Section=magic ' +
    'Note="Knows the Dragon Form primal innate spell; can cast it at 8th rank once per day"',
  'Lingering Breath':
    'Section=combat ' +
    'Note="Breath Of The Dragon inflicts difficult terrain for 1 min, and targets that critically fail their saves suffer +2d6 HP persistent damage"',

  // Duskwalker
  'Duskwalker Heritage':
    'Section=feature,save ' +
    'Note=' +
      '"Has the duskwalker trait and may take duskwalker ancestry feats",' +
      '"Cannot become undead"',
  'Chance Death':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Rerolls a fatally failed recovery check or save once per day"',
  'Deliberate Death':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike against a foe that inflicts the dying condition on self once per day"',
  'Duskwalker Lore':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Additional Lore (Boneyard Lore) feature",' +
      '"Skill Trained (Medicine; Religion)"',
  'Duskwalker Weapon Familiarity':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Bo Staff; Longbow; Composite Longbow; Scythe; Staff)",' +
      '"Critical hits with a bo staff, longbow, composite longbow, scythe, or staff inflict its critical specialization effect"',
  'Ghost Hunter':
    'Section=combat ' +
    'Note="Strikes on incorporeal creatures are magical, and magical weapons gain the <i>ghost touch</i> property"',
  'Gravesight':'Section=feature Note="Has the Darkvision feature"',
  'Lifesense':
    'Section=skill ' +
    'Note="Can imprecisely sense the life force of living and undead creatures within 10\'"',
  'Spirit Soother':
    'Section=skill ' +
    'Note="Can attempt to notice haunts without Searching, and gains +1 to disable them"',
  'Ward Against Corruption':
    'Section=save ' +
    'Note="+1 vs. death effects, disease, undead, and sahkils, and +2 vs. undead and sahkil death effects and disease"',
  'Duskwalker Magic':
    'Section=magic ' +
    'Note="Knows the Augury and Peaceful Rest divine innate spells; can cast earch at 2nd rank once per day"',
  'Quietus Strikes':
    'Section=combat ' +
    'Note="Attacks are magical and inflict +1 HP void or vitality, or +2 HP with a <i>+3 potency</i> rune"',
  'Resist Ruin':
    'Section=magic,save ' +
    'Note=' +
      '"Knows the False Vitality divine innate spell; can cast it at 5th rank once per day",' +
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
  'Blessed Blessing':
    'Section=magic ' +
    'Note="Knows the Guidance divine innate spell; can cast it at will"',
  'Feral Scent':'Section=skill Note="Has 30\' imprecise scent"',
  "Fey's Fortune":
    'Action=Free ' +
    'Section=skill ' +
    'Note="Gains the better of 2 rolls on a skill check once per day"',
  'Haunted Skill':
    'Section=skill ' +
    'Note="+1 on haunt-linked skill; failure inflicts frightened 2, or frightened 4 on a critical failure"',
  'Martial Focus':'Section=feature Note="1 selection"',
  'Scholarly Tradition':'Section=feature Note="1 selection"',
  'Warding Sign':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="+2 vs. the triggering magical effect, or +3 if it is a curse, once per min"',

  // Class

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
    .replace('Inspire Courage', 'Courageous Anthem')
    .replace(' and 1 Focus Point', ''),
  'Enigma':Pathfinder2E.FEATURES.Enigma.replace('True Strike', 'Sure Strike'),
  'Expert Spellcaster':Pathfinder2E.FEATURES['Expert Spellcaster'],
  'Fortitude Expertise':Pathfinder2E.FEATURES['Great Fortitude'],
  "Greater Performer's Heart":
    Pathfinder2E.FEATURES['Greater Resolve']
    .replace(/Successes.*critical failures/, 'Critical failures on Will saves')
    .replace(', and', ' and'),
  'Legendary Spellcaster':Pathfinder2E.FEATURES['Legendary Spellcaster'],
  'Light Armor Expertise':Pathfinder2E.FEATURES['Light Armor Expertise'],
  'Magnum Opus':
    Pathfinder2E.FEATURES['Magnum Opus']
    .replace('level', 'rank'),
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
    'Section=magic Note="Knows the Hymn Of Healing occult spell"',
  'Lingering Composition':
    Pathfinder2E.FEATURES['Lingering Composition'],
  'Martial Performance':
    'Section=magic ' +
    'Note="Successful Strike while <i>Courageous Anthem</i>, <i>Rallying Anthem</i>, or <i>Song Of Strength</i> is active extends the spell by 1 rd"',
  'Reach Spell':Pathfinder2E.FEATURES['Reach Spell'],
  'Versatile Performance':Pathfinder2E.FEATURES['Versatile Performance'],
  'Well-Versed':
    'Section=save ' +
    'Note="+1 vs. auditory, illusion, linguistic, sonic, and visual effects"',
  'Cantrip Expansion':Pathfinder2E.FEATURES['Cantrip Expansion'],
  'Directed Audience':
    'Section=magic ' +
    'Note="Can redirect the emanation of a composition spell into a cone up to 10\' longer and twice the area"',
  'Emotional Push':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Foe who fails the triggering save vs. an emotion spell suffers off-guard against the next self attack before the end of the next turn"',
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
    'Note="Successful Occultism vs. the higher of the target\'s Deception or Stealth DC reveals a target weakness, poorest save, or highest resistance; critical success gives 2 of these, and critical failure gives false information"',
  'Courageous Advance':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Courageous Anthem</i> casting allows 1 ally to use a reaction to Stride"',
  'In Tune':
    'Action=1 ' +
    'Section=magic ' +
    'Note="R60\' Subsequent composition spell emanation centers on a willing ally"',
  'Melodious Spell':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Subsequent spell cast gains the subtle trait"',
  'Rallying Anthem':
    'Section=magic Note="Knows the Rallying Anthem occult cantrip"',
  'Ritual Researcher':
    'Section=magic Note="+2 on checks made as part of casting a ritual"',
  'Triple Time':Pathfinder2E.FEATURES['Triple Time'],
  'Versatile Signature':Pathfinder2E.FEATURES['Versatile Signature'],
  'Assured Knowledge':
    'Section=skill ' +
    'Note="Can take an automatic 10 + proficiency bonus on any Recall Knowledge check"',
  'Defensive Coordination':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent cast of <i>Rallying Anthem</i> allows self and 1 target to Raise A Shield"',
  'Dirge Of Doom':Pathfinder2E.FEATURES['Dirge Of Doom'],
  'Educate Allies':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Allies affected by a composition spell gain +1, and self gains +2, vs. auditory, illusion, linguistic, sonic, and visual effects until the beginning of the next turn"',
  'Harmonize':Pathfinder2E.FEATURES.Harmonize,
  'Song Of Marching':
    'Section=magic Note="Knows the Song Of Marching occult cantrip"',
  'Steady Spellcasting':Pathfinder2E.FEATURES['Steady Spellcasting'],
  'Accompany':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="R30\' Successful Performance and sacrifice of a Focus Point or spell slot allows an ally to cast the triggering spell without expending a point or slot"',
  'Call And Response':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Allows allies to use an action to extend for 1 rd a subsequent composition cantrip that affects them"',
  'Eclectic Skill':Pathfinder2E.FEATURES['Eclectic Skill'],
  'Fortissimo Composition':
    'Section=magic Note="Knows the Fortissimo Composition occult spell"',
  'Know-It-All':
    'Section=skill ' +
    'Note="Successful Recall Knowledge checks give additional information"',
  'Reflexive Courage':
    Pathfinder2E.FEATURES['Attack Of Opportunity']
    .replace('uses', 'uses an auditory effect, uses'),
  'Soulsight':'Section=skill Note="Has 60\' imprecise spiritsense"',
  'Annotate Composition':
    'Section=magic ' +
    'Note="Can spend 10 minutes and a Focus Point to write a 1-action composition spell that can be activated by anyone until next daily prep"',
  'Courageous Assault':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Allows a chosen ally affected by a subsequent <i>Courageous Anthem</i> to immediately use a reaction to make a melee Strike"',
  'House Of Imaginary Walls':Pathfinder2E.FEATURES['House Of Imaginary Walls'],
  'Ode To Ouroboros':
    'Section=magic Note="Knows the Ode To Ouroboros occult spell"',
  'Quickened Casting':
    Pathfinder2E.FEATURES['Quickened Casting']
    .replace('level', 'rank'),
  'Symphony Of The Unfettered Heart':
    'Section=magic ' +
    'Note="Knows the Symphony Of The Unfettered Heart occult spell"',
  'Unusual Composition':
    Pathfinder2E.FEATURES['Unusual Composition'] + ' ' +
    'Note="Allows a subsequent visual or auditory spell to affect any sense"',
  'Eclectic Polymath':
    Pathfinder2E.FEATURES['Eclectic Polymath']
    .replace('level', 'rank'),
  "Enigma's Knowledge":
    'Section=skill ' +
    'Note="Can Recall Knowledge using any skill as a free action once per rd"',
  'Inspirational Focus':
    Pathfinder2E.FEATURES['Inspirational Focus'].replace('2', 'all'),
  'Reverberate':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Successful Performance vs. creature Will DC, hazard Fortitude DC, or caster spell DC reflects %{level*2} HP sonic from the triggering effect back to its source, or %{level*4} on a critical success"',
  'Shared Assault':
    'Section=magic ' +
   'Note="A critical hit by the target of Courageous Assault allows another ally affected by <i>Courageous Anthem</i> to immediately use a reaction to make a melee Strike"',
  'Allegro':Pathfinder2E.FEATURES.Allegro,
  'Earworm':
    'Section=magic ' +
    'Note="10 min process prepares allies to be affected by a composition cantrip with a successful Performance check"',
  'Soothing Ballad':Pathfinder2E.FEATURES['Soothing Ballad'],
  'Triumphant Inspiration':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Casts a 1-action composition cantrip after inflicting a critical melee hit"',
  'True Hypercognition':Pathfinder2E.FEATURES['True Hypercognition'],
  'Vigorous Anthem':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Courageous Anthem</i> gives self and allies %{3+charismaModifier} temporary Hit Points for 1 min"',
  'Courageous Onslaught':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Courageous Anthem</i> allows 1 ally to immediately use a reaction to Stride and make a melee Strike"',
  'Effortless Concentration':Pathfinder2E.FEATURES['Effortless Concentration'],
  'Resounding Finale':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Ending a composition spell gives affected allies resistance equal to twice the spell\'s rank to the triggering sonic damage"',
  'Studious Capacity':
    Pathfinder2E.FEATURES['Studious Capacity']
    .replace('level', 'rank'),
  'All In My Head':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Changes the triggering damage to self from a non-death Strike or spell to nonlethal mental damage"',
  'Deep Lore':
    Pathfinder2E.FEATURES['Deep Lore']
    .replace('level', 'rank'),
  'Discordant Voice':
    'Section=magic ' +
    'Note="Strikes by allies affected by <i>Courageous Anthem</i> inflict +1d6 HP sonic"',
  'Eternal Composition':Pathfinder2E.FEATURES['Eternal Composition'],
  'Impossible Polymath':Pathfinder2E.FEATURES['Impossible Polymath'],
  'Fatal Aria':Pathfinder2E.FEATURES['Fatal Aria'],
  'Perfect Encore':
    Pathfinder2E.FEATURES['Perfect Encore']
    .replace('level', 'rank'),
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
    .replace('level', 'rank')
    .replace(/charismaModifier\s*\+\s*1/, 'level<5?4:level<15?5:6'),
  'Healing Font':
    Pathfinder2E.FEATURES['Healing Font']
    .replace('level', 'rank')
    .replace(/charismaModifier\s*\+\s*1/, 'level<5?4:level<15?5:6'),
  'Miraculous Spell':
    Pathfinder2E.FEATURES['Miraculous Spell']
    .replace('level', 'rank'),
  'Perception Expertise':Pathfinder2E.FEATURES.Alertness,
  // Reflex Expertise as above
  'Resolute Faith':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Sanctification':
    'Section=feature ' +
    'Note="%{deitySanctification==\'Either\'?\'1 selection\':deitySanctification==\'Holy\'?\'Has the Holy trait\':deitySanctification==\'Unholy\'?\'Has the Unholy trait\':\'Has neither the Holy nor Unholy trait\'}"',
  'Warpriest':Pathfinder2E.FEATURES.Warpriest
    .replace('Simple Weapons', 'Simple Weapons; Martial Weapons')
    .replace('",', '%{level>=19?\'/Attack Master (%1)\':\'\'}",'),
  // Weapon Specialization as above

  'Deadly Simplicity':Pathfinder2E.FEATURES['Deadly Simplicity'],
  // Changed effects
  'Divine Castigation':
    'Section=magic ' +
    'Note="Can add the holy or unholy trait to <i>Harm</i> and <i>Heal</i> spells to inflict spirit damage"',
  'Domain Initiate (Air)':
    Pathfinder2E.FEATURES['Domain Initiate (Air)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Ambition)':
    Pathfinder2E.FEATURES['Domain Initiate (Ambition)']
    .replace(' and 1 Focus Point', '')
    .replace('Blind', 'Ignite'),
  'Domain Initiate (Cities)':
    Pathfinder2E.FEATURES['Domain Initiate (Cities)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Confidence)':
    Pathfinder2E.FEATURES['Domain Initiate (Confidence)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Creation)':
    Pathfinder2E.FEATURES['Domain Initiate (Creation)']
    .replace(' and 1 Focus Point', '')
    .replace('Splash Of Art', 'Creative Splash'),
  'Domain Initiate (Darkness)':
    Pathfinder2E.FEATURES['Domain Initiate (Darkness)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Death)':
    Pathfinder2E.FEATURES['Domain Initiate (Death)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Destruction)':
    Pathfinder2E.FEATURES['Domain Initiate (Destruction)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Dreams)':
    Pathfinder2E.FEATURES['Domain Initiate (Dreams)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Earth)':
    Pathfinder2E.FEATURES['Domain Initiate (Earth)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Family)':
    Pathfinder2E.FEATURES['Domain Initiate (Family)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Fate)':
    Pathfinder2E.FEATURES['Domain Initiate (Fate)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Fire)':
    Pathfinder2E.FEATURES['Domain Initiate (Fire)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Freedom)':
    Pathfinder2E.FEATURES['Domain Initiate (Freedom)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Healing)':
    Pathfinder2E.FEATURES['Domain Initiate (Healing)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Indulgence)':
    Pathfinder2E.FEATURES['Domain Initiate (Indulgence)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Knowledge)':
    Pathfinder2E.FEATURES['Domain Initiate (Knowledge)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Luck)':
    Pathfinder2E.FEATURES['Domain Initiate (Luck)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Magic)':
    Pathfinder2E.FEATURES['Domain Initiate (Magic)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Might)':
    Pathfinder2E.FEATURES['Domain Initiate (Might)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Moon)':
    Pathfinder2E.FEATURES['Domain Initiate (Moon)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Nature)':
    Pathfinder2E.FEATURES['Domain Initiate (Nature)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Nightmares)':
    Pathfinder2E.FEATURES['Domain Initiate (Nightmares)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Pain)':
    Pathfinder2E.FEATURES['Domain Initiate (Pain)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Passion)':
    Pathfinder2E.FEATURES['Domain Initiate (Passion)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Perfection)':
    Pathfinder2E.FEATURES['Domain Initiate (Perfection)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Protection)':
    Pathfinder2E.FEATURES['Domain Initiate (Protection)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Secrecy)':
    Pathfinder2E.FEATURES['Domain Initiate (Secrecy)']
    .replace(' and 1 Focus Point', '')
    .replace('Forced', 'Whispering'),
  'Domain Initiate (Sun)':
    Pathfinder2E.FEATURES['Domain Initiate (Sun)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Travel)':
    Pathfinder2E.FEATURES['Domain Initiate (Travel)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Trickery)':
    Pathfinder2E.FEATURES['Domain Initiate (Trickery)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Truth)':
    Pathfinder2E.FEATURES['Domain Initiate (Truth)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Tyranny)':
    Pathfinder2E.FEATURES['Domain Initiate (Tyranny)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Undeath)':
    Pathfinder2E.FEATURES['Domain Initiate (Undeath)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Water)':
    Pathfinder2E.FEATURES['Domain Initiate (Water)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Wealth)':
    Pathfinder2E.FEATURES['Domain Initiate (Wealth)']
    .replace(' and 1 Focus Point', ''),
  'Domain Initiate (Zeal)':
    Pathfinder2E.FEATURES['Domain Initiate (Zeal)']
    .replace(' and 1 Focus Point', ''),
  'Harming Hands':Pathfinder2E.FEATURES['Harming Hands'],
  'Healing Hands':Pathfinder2E.FEATURES['Healing Hands'],
  'Premonition Of Avoidance':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Gives +2 save vs. triggering hazard"',
  // Reach Spell as above
  // Cantrip Expansion as above
  'Communal Healing':
    Pathfinder2E.FEATURES['Communal Healing']
    .replace('level', 'rank')
    .replace('self', 'self or another target'),
  'Emblazon Armament':Pathfinder2E.FEATURES['Emblazon Armament'],
  // Changed effects from Turn Undead
  'Panic The Dead':
    'Section=magic ' +
    'Note="<i>Heal</i> also inflicts frightened 1 on intelligent undead (save negates; critical failure also inflicts fleeing until the start of the next turn)"',
  'Rapid Response':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Strides with +10 Speed toward an ally reduced to 0 Hit Points"',
  'Sap Life':
    Pathfinder2E.FEATURES['Sap Life']
    .replace('level', 'rank'),
  'Versatile Font':Pathfinder2E.FEATURES['Versatile Font'],
  "Warpriest's Armor":
    'Section=combat,combat ' +
    'Note=' +
      '"Defense %V (Heavy Armor)",' +
      '"Treats armor of 2 Bulk or higher as 1 Bulk lighter"',
  'Channel Smite':
    Pathfinder2E.FEATURES['Channel Smite']
    .replace('from', 'from a 1-action'),
  'Directed Channel':Pathfinder2E.FEATURES['Directed Channel'],
  // Changed effects from Necrotic Infusion
  'Divine Infusion':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Target of a subsequent single-target <i>Harm</i> or <i>Heal</i> inflicts +1d6 HP (+2d6 HP or +3d6 HP if cast at 5th or 8th rank) with melee attacks until the end of its next turn"',
  'Raise Symbol':
    'Action=1 ' +
    'Section=save ' +
    'Note="Gives self +2 saves and changes successful saves vs. vitality and void into critical successes until the start of the next turn"',
  'Restorative Strike':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful melee Strike (+1 with %{deityWeaponLowered}) after healing self restores the same number of Hit Points to another willing creature"',
  'Sacred Ground':
    'Section=magic ' +
    'Note="1 min prayer creates a 30 min burst that restores %{level} HP to creatures who remain in the area for 10 min once per 10 min"',
  'Cast Down':Pathfinder2E.FEATURES['Cast Down'],
  'Divine Rebuttal':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful %{deityWeaponLowered} Strike against an adjacent foe gives allies +2 vs. its triggering magic effect, or +3 on a critical hit"',
  // Changed effects
  'Divine Weapon':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Using a divine spell slot causes a wielded weapon to inflict +1d4 HP spirit, or +2d4 HP vs. opposed holy or unholy creatures, until the end of the turn once per turn"',
  'Magic Hands':
    'Section=skill ' +
    'Note="Successful Medicine to Treat Wounds restores d10s and +%{level} Hit Points"',
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
  'Cremate Undead':
    Pathfinder2E.FEATURES['Cremate Undead']
    .replace('level', 'rank'),
  'Emblazon Energy':Pathfinder2E.FEATURES['Emblazon Energy'],
  'Martyr':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent healing spell also transfers 1d8 HP per spell rank from self to target"',
  // Changed spell list from Channel Succor
  'Restorative Channel':
    'Section=magic ' +
    'Note="Can cast <i>Cleanse Affliction</i>, <i>Clear Mind</i>, <i>Sound Body</i>, or <i>Sure Footing</i> in place of a prepared <i>Heal</i>"',
  // Changed effects from Align Armament
  'Sanctify Armament':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Touched weapon gains the holy or unholy trait and inflicts +2d6 HP spirit on opposed creatures for 1 %{combatNotes.lastingArmament?\'hr\':\'rd\'}"',
  'Surging Focus':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Seeing an ally reduced to 0 HP restores 1 Focus Point to self once per day"',
  'Void Siphon':
    'Section=magic ' +
    'Note="Critical failures vs. self <i>Harm</i> inflict drained 1"',
  'Zealous Rush':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Can Stride 10\' while casting a 1-action spell on self, or %{speed}\' while casting a spell that requires more actions"',
  // Changed effects
  'Castigating Weapon':
    'Section=magic ' +
    'Note="Inflicting damage using <i>Harm</i> or <i>Heal</i> with Divine Castigation gives weapons and unarmed Strikes the holy or unholy trait and additional spirit damage equal to the spell rank until the end of turn"',
  'Heroic Recovery':
    Pathfinder2E.FEATURES['Heroic Recovery']
    .replace('turn', 'turn and allows the target to stand from prone immediately without triggering reactions'),
  'Replenishment Of War':Pathfinder2E.FEATURES['Replenishment Of War'],
  'Shared Avoidance':
    'Section=save ' +
    'Note="Premonition Of Avoidance gives allies within 20\' +2 vs. the triggering hazard"',
  'Shield Of Faith':
    'Section=magic ' +
    'Note="Casting a domain spell gives +1 AC until the start of the next turn"',
  'Defensive Recovery':Pathfinder2E.FEATURES['Defensive Recovery'],
  'Domain Focus':
    Pathfinder2E.FEATURES['Domain Focus']
    .replace('2', 'all'),
  'Emblazon Antimagic':Pathfinder2E.FEATURES['Emblazon Antimagic'],
  'Fortunate Relief':
    'Section=magic ' +
    'Note="Counteract attempts from healing spells gain the better of 2 rolls"',
  'Sapping Symbol':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Raised symbol and a successful Religion check when taking melee damage inflicts enfeebled 1 on the attacker, or enfeebled 2 on a critical success, until the attacker moves away"',
  'Shared Replenishment':Pathfinder2E.FEATURES['Shared Replenishment'],
  'Channeling Block':
    'Section=magic ' +
    'Note="Can expend a <i>Harm</i> or <i>Heal</i> with Shield Block to add 1d8 per spell rank to the shield\'s Hardness"',
  "Deity's Protection":
    Pathfinder2E.FEATURES["Deity's Protection"]
    .replace('level', 'rank'),
  'Ebb And Flow':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent <i>Harm</i> or <i>Heal</i> harms 1 target and heals another"',
  'Fast Channel':Pathfinder2E.FEATURES['Fast Channel'],
  'Lasting Armament':
    Pathfinder2E.FEATURES['Extend Armament Alignment']
    .replace('Align', 'Sanctify'),
  'Premonition Of Clarity':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Rerolls the triggering failed mental save with a +2 bonus once per hr"',
  'Swift Banishment':Pathfinder2E.FEATURES['Swift Banishment'],
  'Eternal Bane':
    Pathfinder2E.FEATURES['Eternal Bane']
    .replace('level', 'rank'),
  'Eternal Blessing':
    Pathfinder2E.FEATURES['Eternal Blessing']
    .replace('level', 'rank'),
  'Rebounding Smite':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Missed Strike using Channel Smite allows retargeting the <i>Harm</i> or <i>Heal</i>"',
  'Remediate':
    'Action=Free ' +
    'Section=magic ' +
    'Note="3-action <i>Harm</i> or <i>Heal</i> attempts to counteract a divine effect once per hr"',
  'Resurrectionist':Pathfinder2E.FEATURES.Resurrectionist,
  'Divine Apex':
    'Section=magic ' +
    'Note="Can give a worn magic item the apex trait and increase its divine attribute value by 1 during daily prep"',
  'Echoing Channel':
    Pathfinder2E.FEATURES['Echoing Channel']
    .replace('an adjacent', 'another'),
  'Improved Swift Banishment':
    Pathfinder2E.FEATURES['Improved Swift Banishment']
    .replace('level', 'rank'),
  'Inviolable':
    'Section=combat ' +
    'Note="Successful attacks on self inflict 3d6 HP spirit, holy, or unholy on the attacker"',
  'Miraculous Possibility':
    'Section=magic ' +
    'Note="Can leave a spell slot free during daily prep to later cast any spell 2 ranks lower"',
  'Shared Clarity':
    'Section=save ' +
    'Note="Premonition Of Clarity gives allies within 15\' a +2 reroll vs. the triggering mental effect"',
  "Avatar's Audience":Pathfinder2E.FEATURES["Avatar's Audience"],
  "Avatar's Protection":
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Casts a prepared <i>Avatar</i> spell and changes the triggering critical hit to self to a normal hit"',
  'Maker Of Miracles':
    Pathfinder2E.FEATURES['Maker Of Miracles']
    .replace('level', 'rank'),
  'Spellshape Channel':
    Pathfinder2E.FEATURES['Metamagic Channel']
    .replace('metamagic', 'spellshape'),

  // Druid
  // Anathema as above
  'Animal':Pathfinder2E.FEATURES.Animal,
  'Druid Feats':Pathfinder2E.FEATURES['Druid Feats'],
  'Druid Skills':Pathfinder2E.FEATURES['Druid Skills'],
  'Druid Spellcasting':Pathfinder2E.FEATURES['Primal Spellcasting'],
  'Druidic Order':
    Pathfinder2E.FEATURES['Druidic Order']
    .replace(' and 1 Focus Point', ''),
  // Expert Spellcaster as above
  // Fortitude Expertise as above
  'Leaf':
    Pathfinder2E.FEATURES.Leaf
    .replace('Goodberry', 'Cornucopia'),
  // Legendary Spellcaster as above
  // Master Spellcaster as above
  'Medium Armor Expertise':Pathfinder2E.FEATURES['Medium Armor Expertise'],
  // Perception Expertise as above
  'Primal Hierophant':
    Pathfinder2E.FEATURES['Primal Hierophant']
    .replace('level', 'rank'),
  // Reflex Expertise as above
  'Storm':Pathfinder2E.FEATURES.Storm,
  'Untamed':
    Pathfinder2E.FEATURES.Wild
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
  'Plant Empathy':
     Pathfinder2E.FEATURES['Green Empathy']
     .replace(/ and gains[^"]*/, ''),
  // Reach Spell as above
  'Storm Born':Pathfinder2E.FEATURES['Storm Born'],
  'Verdant Weapon':
    'Section=magic ' +
    'Note="10 min process prepares a seed to grow into a weapon or shrink back into a seed with 1 action"',
  'Widen Spell':Pathfinder2E.FEATURES['Widen Spell'],
  'Untamed Form':
    Pathfinder2E.FEATURES['Wild Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Call Of The Wild':
    Pathfinder2E.FEATURES['Call Of The Wild']
    .replace('level', 'rank'),
  'Enhanced Familiar':Pathfinder2E.FEATURES['Enhanced Familiar'],
  'Order Explorer (Animal)':Pathfinder2E.FEATURES['Order Explorer (Animal)'],
  'Order Explorer (Leaf)':Pathfinder2E.FEATURES['Order Explorer (Leaf)'],
  'Order Explorer (Storm)':Pathfinder2E.FEATURES['Order Explorer (Storm)'],
  'Order Explorer (Untamed)':
    Pathfinder2E.FEATURES['Order Explorer (Wild)'].replace('wild', 'untamed'),
  'Poison Resistance':Pathfinder2E.FEATURES['Poison Resistance'],
  'Anthropomorphic Shape':
     Pathfinder2E.FEATURES['Thousand Faces']
     .replace('Wild Shape', 'Untamed Form'),
  'Thousand Faces':
    'Section=magic ' +
    'Note="Can use <i>Wild Shape</i> to change into a Small or Medium humanoid"',
  'Elemental Summons':
    'Section=magic ' +
    'Note="Can spend 10 min in concert with nature to replace a prepared spell with <i>Summon Elemental</i> of the same rank"',
  'Forest Passage':Pathfinder2E.FEATURES['Woodland Stride'],
  'Form Control':
    Pathfinder2E.FEATURES['Form Control']
    .replace('Wild Shape', 'Untamed Form')
    .replace('level', 'rank'),
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
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent air, water, or cold spell creates difficult terrain underneath 1 affected creature until the start of the next turn"',
  'Current Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent air or water spell gives self +1 Armor Class (+2 vs. ranged attacks) and +1 saves vs. air and water until the start of the next turn"',
  'Grown Of Oak':
    'Section=magic ' +
    'Note="Knows the Oaken Resilience primal spell; can cast it up to rank %V at will on self and on leshy familiar within 30\'"',
  'Insect Shape':
    Pathfinder2E.FEATURES['Insect Shape']
    .replace('Wild Shape', 'Untamed Form'),
  'Instinctive Support':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Casting a non-cantrip spell on companion allows it to Support and take its actions"',
  // Steady Spellcasting as above
  'Storm Retribution':Pathfinder2E.FEATURES['Storm Retribution'],
  'Deimatic Display':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a Demoralize attempt against animals, fungi, and plants in a 15\' cone, with no penalty for lacking a shared language"',
  'Ferocious Shape':
    Pathfinder2E.FEATURES['Ferocious Shape']
    .replaceAll('Wild Shape', 'Untamed Form'),
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
    'Note="R30\' 15\' radius gives creatures +2 saves vs. a choice of arcane, divine, or occult effects while sustained up to 1 min"',
  'Soaring Shape':
    Pathfinder2E.FEATURES['Soaring Shape']
    .replaceAll('Wild Shape', 'Untamed Form'),
  'Wind Caller':Pathfinder2E.FEATURES['Wind Caller'],
  'Elemental Shape':
    Pathfinder2E.FEATURES['Elemental Shape']
    .replaceAll('Wild Shape', 'Untamed Form'),
  'Healing Transformation':
    Pathfinder2E.FEATURES['Healing Transformation']
    .replace('level', 'rank'),
  'Overwhelming Energy':Pathfinder2E.FEATURES['Overwhelming Energy'],
  'Plant Shape':
    Pathfinder2E.FEATURES['Plant Shape']
    .replaceAll('Wild Shape', 'Untamed Form'),
  'Primal Howl':
    'Section=feature ' +
    'Note="Companion can use 2 actions to inflict 1d6 HP sonic per 2 levels and frightened 1 in a 30\' cone once per hr (<b>save basic Fortitude</b> also negates frightened; critical failure inflicts frightened 2)"',
  'Pristine Weapon':
    'Section=combat ' +
    'Note="Verdant weapon counts as cold iron and silver, inflicting +1d6 HP persistent bleed to creatures with weakness to either on a critical hit"',
  'Side By Side':Pathfinder2E.FEATURES['Side By Side'],
  'Thunderclap Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent instantaneous electricity spell also inflicts deafened for 1 rd (<b>save Reflex</b> negates; critical failure also knocks prone)"',
  'Dragon Shape':
    Pathfinder2E.FEATURES['Dragon Shape']
    .replaceAll('Wild Shape', 'Untamed Form'),
  'Garland Spell':
    'Action=1 ' +
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
    'Note="Casts <i>Untamed Form</i> to assume a form from <i>Aerial Form</i>, <i>Dragon Form</i>, <i>Elemental Form</i>, or <i>Plant Form</i> in response to falling, energy damage, fire damage, or poison damage"',
  'Sow Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Prepares a subsequent 1- or 2-action spell to take effect in an adjacent square when a creature enters or is adjacent to it within 10 min; a successful Perception allows a creature to notice before triggering"',
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
    'Note="Casting an air or electricity spell while flying gives +10 fly Speed and an immediate %{speed//2}\' Fly action"',
  'Invoke Disaster':Pathfinder2E.FEATURES['Invoke Disaster'],
  'Perfect Form Control':Pathfinder2E.FEATURES['Perfect Form Control'],
  'Primal Aegis':
    'Section=save ' +
    'Note="Self and allies within 30\' have resistance %{wisdomModifier} to acid, cold, electricity, fire, vitality, and void damage"',
  "Hierophant's Power":
    Pathfinder2E.FEATURES["Hierophant's Power"]
    .replace('level', 'rank'),
  'Ley Line Conduit':
    Pathfinder2E.FEATURES['Leyline Conduit']
    .replace('level', 'rank'),
  'True Shapeshifter':
    Pathfinder2E.FEATURES['True Shapeshifter']
    .replace('Wild Shape', 'Untamed Form'),

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
  'Combat Flexibility':
    // Modified to include Ultimate Flexibility effects
    Pathfinder2E.FEATURES['Combat Flexibility'] + ' ' +
    'Note="Gains 1 chosen fighter feat of up to 8th level%{combatNotes.ultimateFlexibility?\',\':combatNotes.improvedFlexibility?\' and\':\'\'}%{combatNotes.improvedFlexibility?\' 1 of up to 14th level\':\'\'}%{combatNotes.ultimateFlexibility?\', and 1 of up to 18th level\':\'\'} during daily prep%{combatNotes.ultimateFlexibility?\'; can use 1 hr training to change selections\':\'\'}"',
  'Fighter Expertise':Pathfinder2E.FEATURES['Fighter Expertise'],
  'Fighter Feats':Pathfinder2E.FEATURES['Fighter Feats'],
  'Fighter Key Attribute':Pathfinder2E.FEATURES['Fighter Key Ability'],
  'Fighter Skills':Pathfinder2E.FEATURES['Fighter Skills'],
  'Fighter Weapon Mastery':Pathfinder2E.FEATURES['Fighter Weapon Mastery'],
  'Fighter Weapon Mastery (Axes)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Axes)'],
  'Fighter Weapon Mastery (Bombs)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Bombs)'],
  'Fighter Weapon Mastery (Brawling Weapons)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Brawling Weapons)'],
  'Fighter Weapon Mastery (Clubs)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Clubs)'],
  'Fighter Weapon Mastery (Crossbows)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Crossbows)'],
  'Fighter Weapon Mastery (Darts)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Darts)'],
  'Fighter Weapon Mastery (Flails)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Flails)'],
  'Fighter Weapon Mastery (Hammers)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Hammers)'],
  'Fighter Weapon Mastery (Knives)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Knives)'],
  'Fighter Weapon Mastery (Picks)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Picks)'],
  'Fighter Weapon Mastery (Polearms)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Polearms)'],
  'Fighter Weapon Mastery (Slings)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Slings)'],
  'Fighter Weapon Mastery (Shields)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Shields)'],
  'Fighter Weapon Mastery (Spears)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Spears)'],
  'Fighter Weapon Mastery (Swords)':
    Pathfinder2E.FEATURES['Fighter Weapon Mastery (Swords)'],
  'Greater Weapon Specialization':
    Pathfinder2E.FEATURES['Greater Weapon Specialization'],
  'Improved Flexibility':Pathfinder2E.FEATURES['Improved Flexibility'],
  'Reactive Strike':Pathfinder2E.FEATURES['Attack Of Opportunity'],
  // Shield Block as above
  'Tempered Reflexes':Pathfinder2E.FEATURES.Evasion,
  'Versatile Legend':Pathfinder2E.FEATURES['Versatile Legend'],
  'Weapon Legend':Pathfinder2E.FEATURES['Weapon Legend'],
  'Weapon Legend (Axes)':
    Pathfinder2E.FEATURES['Weapon Legend (Axes)'],
  'Weapon Legend (Bombs)':
    Pathfinder2E.FEATURES['Weapon Legend (Bombs)'],
  'Weapon Legend (Brawling Weapons)':
    Pathfinder2E.FEATURES['Weapon Legend (Brawling Weapons)'],
  'Weapon Legend (Clubs)':
    Pathfinder2E.FEATURES['Weapon Legend (Clubs)'],
  'Weapon Legend (Crossbows)':
    Pathfinder2E.FEATURES['Weapon Legend (Crossbows)'],
  'Weapon Legend (Darts)':
    Pathfinder2E.FEATURES['Weapon Legend (Darts)'],
  'Weapon Legend (Flails)':
    Pathfinder2E.FEATURES['Weapon Legend (Flails)'],
  'Weapon Legend (Hammers)':
    Pathfinder2E.FEATURES['Weapon Legend (Hammers)'],
  'Weapon Legend (Knives)':
    Pathfinder2E.FEATURES['Weapon Legend (Knives)'],
  'Weapon Legend (Picks)':
    Pathfinder2E.FEATURES['Weapon Legend (Picks)'],
  'Weapon Legend (Polearms)':
    Pathfinder2E.FEATURES['Weapon Legend (Polearms)'],
  'Weapon Legend (Slings)':
    Pathfinder2E.FEATURES['Weapon Legend (Slings)'],
  'Weapon Legend (Shields)':
    Pathfinder2E.FEATURES['Weapon Legend (Shields)'],
  'Weapon Legend (Spears)':
    Pathfinder2E.FEATURES['Weapon Legend (Spears)'],
  'Weapon Legend (Swords)':
    Pathfinder2E.FEATURES['Weapon Legend (Swords)'],
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
  // errata changes action to Free
  'Aggressive Block':
    Pathfinder2E.FEATURES['Aggressive Block']
    .replace('flat-footed', 'off-guard'),
  'Assisting Shot':Pathfinder2E.FEATURES['Assisting Shot'],
  'Blade Brake':
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
    'Note="Stows held objects and draws 2 weapons or a shield and a weapon"',
  'Lunge':Pathfinder2E.FEATURES.Lunge,
  'Rebounding Toss':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Thrown weapon makes a second Strike against a second target within 10\' of the first"',
  'Sleek Reposition':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Melee Strike with a finesse or polearm weapon automatically Repositions target, or inflicts off-guard until the end of the turn on failure"',
  'Barreling Charge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Athletics vs. Fortitude allows Striding through foes\' spaces to make a melee Strike"',
  'Double Shot':Pathfinder2E.FEATURES['Double Shot'],
  'Dual-Handed Assault':Pathfinder2E.FEATURES['Dual-Handed Assault'],
  'Parting Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Steps away from a foe and makes a ranged Strike with the target off-guard"',
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
    'Note="Successful melee Strike against a grabbed foe inflicts bludgeoning damage and stunned 2 (<b>save Fortitude</b> inflicts stunned 1; critical success negates stunning; critical failure inflicts stunned 3)"',
  'Disarming Stance':Pathfinder2E.FEATURES['Disarming Stance'],
  'Furious Focus':
    Pathfinder2E.FEATURES['Furious Focus']
    .replace('Power Attack', 'Vicious Swing'),
  "Guardian's Deflection":
    Pathfinder2E.FEATURES["Guardian's Deflection"]
    .replace('triggering attack', "triggering attack%{features.Panache?' and gives self panache until the end of the next turn':''}"),
  'Reflexive Shield':Pathfinder2E.FEATURES['Reflexive Shield'],
  'Revealing Stab':Pathfinder2E.FEATURES['Revealing Stab'],
  'Ricochet Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance causes thrown bludgeoning and slashing weapons to return up to their listed range increment after a ranged Strike"',
  'Shatter Defenses':
    Pathfinder2E.FEATURES['Shatter Defenses']
    .replace('flat-footed', 'off-guard'),
  'Shield Warden':
    'Section=combat Note="Can use Shield Block to protect an adjacent ally"',
  'Triple Shot':Pathfinder2E.FEATURES['Triple Shot'],
  'Blind-Fight':Pathfinder2E.FEATURES['Blind-Fight'],
  'Disorienting Opening':
    'Section=combat ' +
    'Note="Successful Reactive Strike inflicts off-guard until the start of the next turn"',
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
    'Note="Successful Will saves give +1 saves and %{level//2} temporary Hit Points, or +2 saves and %{level} temporary Hit Points on a critical success, for 1 min"',
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
    'Note="Successful Strike with a thrown weapon during a double Stride inflicts off-guard against next self attack before the end of the turn"',
  'Mirror Shield':Pathfinder2E.FEATURES['Mirror Shield'],
  'Overpowering Charge':
    'Section=combat ' +
    'Note="Successful Barreling Charge moves inflict %{strengthModifier} HP bludgeoning, or %{strengthModifier*2} HP and off-guard until the end of the next turn on a critical hit"',
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
    'Note="Successful melee Strike counts as critical, and a natural critical gains deadly d12; counts as 3 attacks for the multiple attack penalty and leaves self stunned 1 and off-guard until the start of the next turn"',
  'Twinned Defense':Pathfinder2E.FEATURES['Twinned Defense'],
  'Impossible Volley':Pathfinder2E.FEATURES['Impossible Volley'],
  'Savage Critical':Pathfinder2E.FEATURES['Savage Critical'],
  'Smash From The Air':
    'Section=combat ' +
    'Note="Can use Cut From The Air against ranged spell attacks"',
  'Boundless Reprisals':Pathfinder2E.FEATURES['Boundless Reprisals'],
  'Ultimate Flexibility':
    'Section=combat Note="Has increased Combat Flexibility effects"',
  'Weapon Supremacy':Pathfinder2E.FEATURES['Weapon Supremacy'],

  // Ranger
  'Flurry':Pathfinder2E.FEATURES.Flurry,
  'Greater Natural Reflexes':Pathfinder2E.FEATURES['Improved Evasion'],
  // Greater Weapon Specialization as above
  'Hunt Prey':Pathfinder2E.FEATURES['Hunt Prey'],
  "Hunter's Edge":Pathfinder2E.FEATURES["Hunter's Edge"],
  'Martial Weapon Mastery':Pathfinder2E.FEATURES['Weapon Mastery'],
  'Masterful Hunter':
    Pathfinder2E.FEATURES['Masterful Hunter']
    .replace('Section=', 'Section=magic,')
    .replace('Note=', 'Note="Spell Master (Primal)",'),
  // Medium Armor Expertise as above
  // Medium Armor Mastery as above
  'Natural Reflexes':Pathfinder2E.FEATURES.Evasion,
  "Nature's Edge":
    // Changed effects
    Pathfinder2E.FEATURES["Nature's Edge"] + ' ' +
    'Note="Foes suffer off-guard vs. self from difficult terrain"',
  'Outwit':Pathfinder2E.FEATURES.Outwit,
  'Perception Legend':Pathfinder2E.FEATURES['Incredible Senses'],
  // Perception Mastery as above
  'Precision':Pathfinder2E.FEATURES.Precision,
  'Ranger Expertise':
    Pathfinder2E.FEATURES['Ranger Expertise']
    .replace('Section=', 'Section=magic,')
    .replace('Note=', 'Note="Spell Expert (Primal)",'),
  'Ranger Feats':Pathfinder2E.FEATURES['Ranger Feats'],
  'Ranger Key Attribute':Pathfinder2E.FEATURES['Ranger Key Ability'],
  'Ranger Skills':Pathfinder2E.FEATURES['Ranger Skills'],
  'Ranger Weapon Expertise':Pathfinder2E.FEATURES['Ranger Weapon Expertise'],
  'Swift Prey':Pathfinder2E.FEATURES['Swift Prey'],
  'Trackless Journey':Pathfinder2E.FEATURES['Trackless Step'],
  'Unimpeded Journey':
    Pathfinder2E.FEATURES['Wild Stride']
    .replaceAll('non-magical ', ''),
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
    'Section=magic,magic ' +
    'Note=' +
      '"Spell Trained (Primal)/Has a focus pool",' +
      '"Knows %V choice%{$\'features.Initiate Warden\'>1?\'s\':\'\'} of initial warden spells"',
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
    'Note="Knows %V choice%{$\'features.Advanced Warden\'>1?\'s\':\'\'} of advanced warden spells"',
  "Companion's Cry":Pathfinder2E.FEATURES["Companion's Cry"],
  'Disrupt Prey':Pathfinder2E.FEATURES['Disrupt Prey'],
  'Far Shot':Pathfinder2E.FEATURES['Far Shot'],
  'Favored Prey':Pathfinder2E.FEATURES['Favored Enemy'],
  'Running Reload':Pathfinder2E.FEATURES['Running Reload'],
  "Scout's Warning":Pathfinder2E.FEATURES["Scout's Warning"],
  // Twin Parry as above
  'Additional Recollection':
    'Action=Free ' +
    'Section=skill ' +
    'Note="Follows a successful Recall Knowledge on hunted prey with a Recall Knowledge check on another creature"',
  'Masterful Warden':
    'Section=magic ' +
    'Note="Knows %V choice%{$\'features.Masterful Warden\'>1?\'s\':\'\'} of master warden spells"',
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
    'Note="Knows %V choice%{$\'features.Peerless Warden\'>1?\'s\':\'\'} of peerless warden spells"',
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
    'Note="Casting a warden spell allows reloading a crossbow once per rd"',
  'Impossible Flurry':
    Pathfinder2E.FEATURES['Impossible Flurry']
    .replace('each', 'each, the first as if 1 attack had already been made this turn and the remainder'),
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
    .replace('a flat-footed', 'an off-guard')
    .replaceAll('flat-footed', 'off-guard')
    .replace(' from: ', " from: %{combatNotes.methodicalDebilitations?'prevent flanking; negate Armor Class bonus from shields, lesser cover, and standard cover; ':''}%{combatNotes.bloodyDebilitation?'+3d6 HP persistent bleed; ':''}"),
  'Deny Advantage':
    'Section=combat ' +
    'Note="Does not suffer off-guard vs. hidden, undetected, flanking, or surprising foes of equal or lower level"',
  'Double Debilitation':Pathfinder2E.FEATURES['Double Debilitation'],
  'Evasive Reflexes':Pathfinder2E.FEATURES.Evasion,
  'Greater Rogue Reflexes':Pathfinder2E.FEATURES['Improved Evasion'],
  // Greater Weapon Specialization as above
  // Light Armor Expertise as above
  'Light Armor Mastery':Pathfinder2E.FEATURES['Light Armor Mastery'],
  'Master Strike':
    Pathfinder2E.FEATURES['Master Strike']
    .replace('a flat-footed', 'an off-guard'),
  // Changed effects
  'Master Tricks':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Martial Weapons; Unarmed Attacks)"',
  'Mastermind':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Society; Choose 1 from Arcana, Nature, Occultism, Religion)",' +
      '"Successful Recall Knowledge to identify a creature inflicts off-guard vs. self attacks until the start of the next turn, or for 1 min on a critical success"',
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
      '"Can sneak attack using any weapon other than simple or martial weapons that deal greater than d8 or d6 damage, and critical hits with one of these weapons on an off-guard foe inflict its critical specialization effect",' +
      '"Skill Trained (Intimidation)"',
  // Changed effects
  'Scoundrel':
    'Section=combat,skill ' +
    'Note=' +
      '"Successful Feint inflicts off-guard vs. self attacks, or vs. all attacks on a critical success, until the end of the next turn/Can take a free Step after a successful Feint with an agile or finesse weapon",' +
      '"Skill Trained (Deception; Diplomacy)"',
  'Sneak Attack':
    Pathfinder2E.FEATURES['Sneak Attack']
    .replace('flat-footed', 'off-guard'),
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
      '"Critical hits with an agile or finesse unarmed attack or weapon vs. an off-guard foe inflict its critical specialization effect"',

  'Nimble Dodge':Pathfinder2E.FEATURES['Nimble Dodge'],
  'Overextending Feint':
    'Section=combat ' +
    'Note="Successful Feint inflicts -2 on target\'s next attack vs. self, or on all attacks vs. self with a critical success, until the end of its next rd"',
  'Plant Evidence':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Thievery vs. Perception allows planting a light item on target%{features.Ruffian?\'; can also be done as a free action as part of a Shove\':\'\'}"',
  'Trap Finder':Pathfinder2E.FEATURES['Trap Finder'],
  'Tumble Behind':
    'Section=combat ' +
    'Note="Successful Tumble Through inflicts off-guard against the next self attack until the end of the turn"',
  'Twin Feint':
    Pathfinder2E.FEATURES['Twin Feint']
    .replace('flat-footed', 'off-guard'),
  "You're Next":
    Pathfinder2E.FEATURES["You're Next"]
    .replace('another', "another within 60'"),
  'Brutal Beating':Pathfinder2E.FEATURES['Brutal Beating'],
  'Clever Gambit':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Follows a critical hit on an identified creature with a Step or Stride that does not provoke target reactions"',
  'Distracting Feint':
    Pathfinder2E.FEATURES['Distracting Feint']
    .replace('flat-footed', 'off-guard'),
  'Mobility':Pathfinder2E.FEATURES.Mobility,
  // Quick Draw as above
  'Strong Arm':'Section=combat Note="+10 thrown weapon range"',
  'Unbalancing Blow':
    Pathfinder2E.FEATURES['Unbalancing Blow']
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
    'Note="Successful unarmed melee Strike vs. a prone foe inflicts stupefied 1 and off-guard, or stupefied 2 and off-guard on a critical hit, until the end of the next turn"',
  'Mug':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful sneak attack vs. an adjacent foe allows a Steal attempt"',
  'Poison Weapon':
    Pathfinder2E.FEATURES['Poison Weapon']
    .replace(/that lasts[^"]*/, 'to a weapon'),
  'Predictable!':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Sense Motive vs. Deception gives +1 AC and next save vs. target until the start of the next turn, or +2 on a critical success or -1 on a critical failure"',
  'Reactive Pursuit':Pathfinder2E.FEATURES['Reactive Pursuit'],
  'Sabotage':Pathfinder2E.FEATURES.Sabotage,
  "Scoundrel's Surprise":
    'Action=1 ' +
    'Section=combat ' +
    'Note="Removing a disguise inflicts off-guard vs. the next self attack on unaware foes until the end of the turn"',
  // Scout's Warning as above
  'The Harder They Fall':
    'Section=combat ' +
    'Note="Successful Trip inflicts 1d6 HP bludgeoning, plus sneak attack damage on a critical success"',
  'Twin Distraction':
    'Section=combat ' +
    'Note="Successful Twin Feint attacks with both weapons inflict stupefied 1 until the end of the next turn (<b>save Will</b> negates)"',
  'Analyze Weakness':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Next sneak attack on an identified target inflicts +%{level<11?2:level<17?3:4}d6 HP precision"',
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
    'Note="Follows a Shove with a Trip; can be used even when the foe is no longer within reach"',
  // Skirmish Strike as above
  'Sly Disarm':
    'Section=combat ' +
    'Note="Can use Thievery to Disarm; success inflicts off-guard against the next self attack before the end of the turn"',
  'Twist The Knife':
    Pathfinder2E.FEATURES['Twist The Knife']
    .replace('flat-footed', 'off-guard'),
  'Watch Your Back':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Successful Intimidation vs. Will gives target +2 Perception vs. self and inflicts -2 Will saves vs. fear for 1 min"',
  // Blind-Fight as above
  'Bullseye':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Next Strike with a thrown weapon before the end of the turn gains +1 attack, ignores target concealment, and reduces target cover"',
  'Delay Trap':
    Pathfinder2E.FEATURES['Delay Trap']
    .replace('+5 DC ', '').replace('flat-footed', 'off-guard'),
  'Improved Poison Weapon':Pathfinder2E.FEATURES['Improved Poison Weapon'],
  'Inspired Stratagem':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Five previously-briefed allies can use the better of 2 attack or skill rolls once per day"',
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
    'Note="Strides without provoking reactions after rolling Stealth for initiative"',
  'Methodical Debilitations':
    'Section=combat Note="Has increased Debilitating Strike effects"',
  'Nimble Strike':
    'Section=combat ' +
    'Note="Can make a Strike during Nimble Dodge, unaffected by any multiple attack penalty"',
  'Precise Debilitations':
    Pathfinder2E.FEATURES['Precise Debilitations']
    .replace('flat-footed', 'off-guard'),
  'Sneak Adept':Pathfinder2E.FEATURES['Sneak Savant'],
  'Tactical Debilitations':Pathfinder2E.FEATURES['Tactical Debilitations'],
  'Vicious Debilitations':Pathfinder2E.FEATURES['Vicious Debilitations'],
  'Bloody Debilitation':
    'Section=combat Note="Has increased Debilitating Strike effects"',
  'Critical Debilitation':Pathfinder2E.FEATURES['Critical Debilitation'],
  'Fantastic Leap':Pathfinder2E.FEATURES['Fantastic Leap'],
  'Felling Shot':Pathfinder2E.FEATURES['Felling Shot'],
  'Preparation':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives 1 additional rogue reaction that can be used before the start of the next turn"',
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
    'Note="Successful Athletics vs. Fortitude negates the triggering Stand action; critical success prevents the target from Standing until its next turn"',
  'Blank Slate':
    Pathfinder2E.FEATURES['Blank Slate']
    .replace('level', 'rank'),
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
    'Note="Can use Prescient Planner at will with 1 action, and can use it to retrieve a level %{level-6} consumable 5 times per day"',
  // Changed effects
  'Powerful Sneak':
    'Section=combat ' +
    'Note="Sneak attack ignores precision immunity and resistance, and sneak attack damage dice on the first attack before the end of the next turn after a Sneak have a minimum roll of 3"',
  'Hidden Paragon':Pathfinder2E.FEATURES['Hidden Paragon'],
  'Impossible Striker':Pathfinder2E.FEATURES['Impossible Striker'],
  'Reactive Distraction':Pathfinder2E.FEATURES['Reactive Distraction'],

  // Witch
  // Defensive Robes as above
  // Expert Spellcaster as above
  "Faith's Flamekeeper":
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Divine)/Knows the Stoke The Heart and Command divine spells",' +
      '"Casting or Sustaining a hex gives a target within 15\' of familiar %{2+level//2} temporary Hit Points until the start of the next turn",' +
      '"Skill Trained (Religion)"',
  'Familiar':Pathfinder2E.FEATURES.Familiar,
  'Hex Spells':
    'Section=magic,magic ' +
    'Note=' +
      '"Has a focus pool",' +
      '"Knows a choice of the <i>Patron\'s Puppet</i> and <i>Phase Familiar</i> spells"',
  // Legendary Spellcaster as above
  'Magical Fortitude':'Section=save Note="Save Expert (Fortitude)"',
  // Master Spellcaster as above
  'Patron':'Section=feature Note="1 selection"',
  "Patron's Gift":'Section=magic Note="Has 1 10th-rank spell slot"',
  // Perception Expertise as above
  // Reflex Expertise as above
  'Silence In Snow':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Clinging Ice and Gust Of Wind primal spells",' +
      '"Casting or Sustaining a hex allows ice to inflict difficult terrain on a 5\' square centered on familiar until the start of the next turn",' +
      '"Skill Trained (Nature)"',
  'Spinner Of Threads':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)/Knows the Nudge Fate and Sure Strike occult spells",' +
      '"Casting or Sustaining a hex gives a choice of +1 or -1 Armor Class to 1 target within 15\' of familiar until the start of the next turn",' +
      '"Skill Trained (Occultism)"',
  'Starless Shadow':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)/Knows the Shroud Of Night and Fear occult spells",' +
      '"Casting or Sustaining a hex inflicts frightened 1 on a target unaware of adjacent familiar",' +
      '"Skill Trained (Occultism)"',
  'The Inscribed One':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Arcane)/Knows the Discern Secrets and Runic Weapon arcane spells",' +
      '"Casting or Sustaining a hex allows familiar to provide flanking until the start of the next turn",' +
      '"Skill Trained (Arcana)"',
  'The Resentment':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Occult)/Knows the Evil Eye and Enfeeble occult spells",' +
      '"Casting or Sustaining a hex allows prolonging by 1 rd a negative condition affecting a target within 15\' of familiar",' +
      '"Skill Trained (Occultism)"',
  // Weapon Expertise as above
  // Weapon Specialization as above
  'Wilding Steward':
    'Section=magic,magic,skill ' +
    'Note=' +
      '"Spell Trained (Primal)/Knows the Wilding Word primal cantrip",' +
      '"Knows a choice of the Summon Animal and Summon Plant Or Fungus primal spells/Casting or Sustaining a hex gives familiar a choice of imprecise scent, tremorsense, and wavesense with a 60\' range until the start of the next turn, allowing it to immediately Point Out as a free action",' +
      '"Skill Trained (Nature)"',
  'Will Of The Pupil':Pathfinder2E.FEATURES.Resolve,
  'Witch Feats':'Section=feature Note="%V selections"',
  'Witch Skills':'Section=skill Note="Skill Trained (Choose %V from any)"',
  'Witch Spellcasting':
    'Section=magic Note="Can learn spells from the %V tradition"',

  'Cackle':'Section=magic Note="Knows the Cackle %V spell"',
  'Cauldron':
    'Section=skill ' +
    'Note="Knows the formulas for %{level//2+3>?4} common oils or potions and can use Craft to create %{((rank.Arcane||rank.Divine||rank.Occult||rank.Primal||0)<3?1:(rank.Arcane||rank.Divine||rank.Occult||rank.Primal)<4?2:3)*($\'features.Double, Double\'?2:1)} oils or potions during daily prep"',
  'Counterspell':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Expends a spell slot to attempt to counteract a spell with the same spell"',
  // Reach Spell as above
  // Widen Spell as above; errata corrects Concentrate to Manipulate
  "Witch's Armaments (Eldritch Nails)":
    'Section=combat Note="Nails inflict 1d6 HP slashing"',
  "Witch's Armaments (Iron Teeth)":
    'Section=combat Note="Jaws inflict 1d8 HP piercing"',
  "Witch's Armaments (Living Hair)":
    'Section=combat Note="Hair inflicts 1d4 bludgeoning"',
  'Basic Lesson (Dreams)':
    'Section=magic Note="Knows the Veil Of Dreams %V hex"',
  'Basic Lesson (Elements)':
    'Section=magic Note="Knows the Elemental Betrayal %V hex"',
  'Basic Lesson (Life)': 'Section=magic Note="Knows the Life Boost %V hex"',
  'Basic Lesson (Protection)':
    'Section=magic Note="Knows the Blood Ward %V hex"',
  'Basic Lesson (Vengeance)':
    'Section=magic Note="Knows the Needle Of Vengeance %V hex"',
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
    'Note="Subsequent hit with a Witch\'s Armament weapon inflicts -1 saves vs. self hexes, or -2 on a critical hit, until the start of the next turn once per rd"',
  'Ceremonial Knife':
    'Section=feature ' +
    'Note="Can prepare a knife to contain a spell of up to rank %{level//2-2>?1} during daily prep"',
  'Greater Lesson (Mischief)':
    'Section=magic Note="Knows the Deceiver\'s Cloak %V hex"',
  'Greater Lesson (Shadow)':
    'Section=magic Note="Knows the Malicious Shadow %V hex"',
  'Greater Lesson (Snow)':
    'Section=magic Note="Knows the Personal Blizzard %V hex"',
  // Steady Spellcasting as above
  "Witch's Charge":
    'Section=magic ' +
    'Note="Knows the direction, distance, and state of %{$\\"features.Witch\'s Communion\\"?intelligenceModifier+\' willing targets\':\'a willing target\'} designated during daily prep, and can cast R30\' touch spells on them"',
  'Incredible Familiar':
    'Section=feature Note="Can select 6 familiar or master abilities each day"',
  'Murksight':
    'Section=combat ' +
    'Note="Suffers no ranged attack or Perception penalties from non-magical precipitation, and requires no flat check to attack a target concealed by it"',
  'Spirit Familiar':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Familiar leaves its body, flies 20\' to a foe, inflicts %{(level-1)//2*2}d6 HP spirit (<b>save basic Will</b>), flies 30\' to an ally, and restores HP equal to half the damage dealt once per 10 min"',
  'Stitched Familiar':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Familiar makes a R30\' attack that inflicts %{(level-1)//2*2}d6 HP slashing and immobilized for 1 rd (<b>save basic Reflex</b> also negates immobilized) once per 10 min"',
  "Witch's Bottle":
    'Section=magic ' +
    'Note="Can spend 10 min and 1 Focus Point to create a potion that inflicts a hex on the imbiber, lasting until next daily prep"',
  'Double, Double':'Section=skill Note="Has increased Cauldron effects"',
  'Major Lesson (Death)':
    'Section=magic Note="Knows the Curse Of Death %V hex"',
  'Major Lesson (Renewal)':
    'Section=magic Note="Knows the Restorative Moment %V hex"',
  // Quickened Casting as above
  "Witch's Communion":
    'Section=magic Note="Has increased Witch\'s Charge effects"',
  'Coven Spell':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Gives the triggering ally spell a damage bonus equal to its rank or a spellshape effect"',
  'Hex Focus':'Section=magic Note="Refocus restores all focus points"',
  "Witch's Broom":
    'Section=skill Note="Can give a broom or similar object a 20\' fly Speed for 1 day, or give an existing <i>flying broomstick</i> +10\' Speed, during daily prep"',
  'Reflect Spell':Pathfinder2E.FEATURES['Reflect Spell'],
  'Rites Of Transfiguration':
    'Section=magic ' +
    'Note="Can use a 10-min process to replace a prepared spell of at least 6th rank with <i>Cursed Metamorphosis</i>"',
  "Patron's Presence":
    'Section=combat Note="Familiar can use 2 actions to create a 15\' emanation that inflicts stupefied 2 on foes (<b>save Will</b> negates; critical failure inflicts stupefied 3) while sustained for up to 1 min once per hr"',
  // Effortless Concentration as above
  'Siphon Power':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Can cast a spell from familiar without using a spell slot once per day"',
  'Split Hex':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent single-target hex, reduced in rank by 2, affects a second target"',
  "Patron's Claim":
    'Action=2 ' +
    'Section=combat ' +
    'Note="Familiar makes a R30\' attack that inflicts 10d10 HP spirit and drained 2 (<b>save basic Fortitude</b> also negates drained; critical failure inflicts drained 4) and restores 1 Focus Point to self once per hr"',
  'Hex Master':
    'Section=magic ' +
    'Note="Can cast multiple hexes per turn, and <i>Cackle</i> Sustains all active hexes"',
  "Patron's Truth":'Section=magic Note="+1 10th rank spell slot"',
  "Witch's Hut":
    'Section=magic Note="1-day ritual creates an animated Huge or smaller dwelling with Armor Class %{armorClass}, +%{perception} Perception, 60\' Speed, 150 HP, and Hardness 10 that can guard, hide, teleport, lock, and move"',

  // Wizard
  'Arcane Bond':Pathfinder2E.FEATURES['Arcane Bond'],
  'Arcane School':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool"',
  'Arcane Thesis':Pathfinder2E.FEATURES['Arcane Thesis'],
  "Archwizard's Spellcraft":
    Pathfinder2E.FEATURES["Archwizard's Spellcraft"]
    .replace('level', 'rank'),
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
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Curriculum feature",' +
      '"+1 spell slot each rank/Knows the Protective Wards arcane spell"',
  'School Of Battle Magic':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Curriculum feature",' +
      '"+1 spell slot each rank/Knows the Force Bolt arcane spell"',
  'School Of The Boundary':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Curriculum feature",' +
      '"+1 spell slot each rank/Knows the Fortify Summoning arcane spell"',
  'School Of Civic Wizardry':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Curriculum feature",' +
      '"+1 spell slot each rank/Knows the Earthworks arcane spell"',
  'School Of Mentalism':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Curriculum feature",' +
      '"+1 spell slot each rank/Knows the Charming Push arcane spell"',
  'School Of Protean Form':
    'Section=feature,magic ' +
    'Note=' +
      '"Has the Curriculum feature",' +
      '"+1 spell slot each rank/Knows the Scramble Body arcane spell"',
  'School Of Unified Magical Theory':
    'Section=feature,magic,magic ' +
    'Note=' +
      '"+1 Class Feat",' +
      '"Knows the Hand Of The Apprentice arcane spell",' +
      '"Can use Drain Bonded Item once per spell rank each day"',
  'Spell Blending':
    Pathfinder2E.FEATURES['Spell Blending']
    .replaceAll('level', 'rank'),
  'Spell Substitution':Pathfinder2E.FEATURES['Spell Substitution'],
  'Staff Nexus':
    'Section=magic ' +
    'Note="Can cast a chosen cantrip and a chosen 1st-rank spell from a staff that contains charges equal to the total ranks of %{level<8?\'1 spell\':level<16?\'2 spells\':\'3 spells\'} expended during daily prep"',
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
    'Note="Casting a spell that inflicts energy damage gives self resistance to a chosen energy type equal to the spell rank until the end of the next turn"',
  // Enhanced Familiar as above
  'Nonlethal Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Changes the damage caused by a subsequent spell to non-lethal"',
  'Bespell Strikes':
    Pathfinder2E.FEATURES['Bespell Weapon']
    .replace('depends on the spell school', 'is force or the same type as the spell inflicted'),
  'Call Wizardly Tools':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Teleports bonded item or spellbook within 1 mile to self"',
  'Linked Focus':Pathfinder2E.FEATURES['Linked Focus'],
  'Spell Protection Array':
    'Action=1 ' +
    'Section=magic ' +
    'Note="R30\' 5\' burst gives +1 saves vs. magic while sustained for up to 1 min"',
  'Convincing Illusion':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="R30\' Successful Deception vs. Perception changes a normal success to disbelieve a self illusion into a failure"',
  'Explosive Arrival':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Subsequent summoning inflicts 1d4 HP fire or creature-specific damage in a 10\' emanation around the summoned creature"',
  'Irresistible Magic':Pathfinder2E.FEATURES['Spell Penetration'],
  'Split Slot':
    'Section=magic ' +
    'Note="Can cast either of 2 prepared spells from a slot up to rank %{maxSpellRank-1}"',
  // Steady Spellcasting as above
  'Advanced School Spell (School Of Ars Grammatica)':
    'Section=magic Note="Knows the Rune Of Observation arcane spell"',
  'Advanced School Spell (School Of Battle Magic)':
    'Section=magic Note="Knows the Energy Absorption arcane spell"',
  'Advanced School Spell (School Of The Boundary)':
    'Section=magic Note="Knows the Spiral Of Horrors arcane spell"',
  'Advanced School Spell (School Of Civic Wizardry)':
    'Section=magic Note="Knows the Community Restoration arcane spell"',
  'Advanced School Spell (School Of Mentalism)':
    'Section=magic Note="Knows the Invisibility Cloak arcane spell"',
  'Advanced School Spell (School Of Protean Form)':
    'Section=magic Note="Knows the Shifting Form arcane spell"',
  'Advanced School Spell (School Of Unified Magical Theory)':
    'Section=magic Note="Knows the Interdisciplinary Incantation arcane spell"',
  'Bond Conservation':
    Pathfinder2E.FEATURES['Bond Conservation']
    .replace('level', 'rank'),
  'Form Retention':
    'Section=magic ' +
    'Note="Can prepare battle polymorph spells that last for 10 min by using a slot 2 ranks higher than normal"',
  'Knowledge Is Power':
    'Section=skill ' +
    'Note="Critical success to Recall Knowledge about a creature inflicts -1 attack and saves vs. next self attack and -1 attack or DC on next attack vs. self within 1 min; sharing the knowledge with allies extends the effects to them"',
  // Overwhelming Energy as above
  // Quickened Casting as above
  'Scroll Adept':Pathfinder2E.FEATURES['Scroll Savant'],
  'Clever Counterspell':
    Pathfinder2E.FEATURES['Clever Counterspell']
    .replace(' with a -2 penalty', ''),
  'Forcible Energy':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent spell that inflicts energy damage also inflicts weakness 5 to that damage type on 1 target until the end of the next turn"',
  'Keen Magical Detection':
    'Section=magic ' +
    'Note="Use of Detect Magic exploration activity gives the better of 2 initiative rolls against foes that have magic active"',
  // Magic Sense as above
  'Bonded Focus':
    Pathfinder2E.FEATURES['Bonded Focus']
    .replace('2', 'all'),
  // Reflect Spell as above
  'Secondary Detonation Array':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent instantaneous area damage spell inflicts an additional 1d6 HP force or the spell\'s damage type (<b>save basic Reflex</b>) in a 5\' burst within its area of effect at the beginning of the next turn"',
  'Superior Bond':
    Pathfinder2E.FEATURES['Superior Bond']
    .replace('level', 'rank'),
  // Effortless Concentration as above
  'Scintillating Spell':
    'Action=1 ' +
    'Section=magic ' + 
    'Note="Targets that fail a Reflex save vs. a subsequent instantaneous non-darkness spell also suffer dazzled for 1 rd, or blinded for 1 rd on a critical failure"',
  'Spell Tinker':
    Pathfinder2E.FEATURES['Spell Tinker']
    .replace(', reducing its remaining duration by half', ''),
  'Infinite Possibilities':
    Pathfinder2E.FEATURES['Infinite Possibilities']
    .replace('level', 'rank'),
  'Reprepare Spell':
    Pathfinder2E.FEATURES['Reprepare Spell']
    .replaceAll('level', 'rank'),
  'Second Thoughts':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Triggering critical save by the target of a single-target mental spell allows redirecting it before the end of the next turn without expending an additional spell slot"',
  "Archwizard's Might":
    Pathfinder2E.FEATURES["Archwizard's Might"]
    .replace('level', 'rank'),
  'Spell Combination':
    Pathfinder2E.FEATURES['Spell Combination']
    .replaceAll('level', 'rank'),
  'Spell Mastery':
    'Section=magic ' +
    'Note="Can cast 4 chosen spells of different ranks once each day without preparation; can change the spell selection with 1 week of downtime"',
  'Spellshape Mastery':
    Pathfinder2E.FEATURES['Metamagic Mastery']
    .replace('metamagic', 'spellshape'),

  // Core 2

  // Alchemist
  'Abundant Vials':
    'Section=combat ' +
    'Note="Permanently quickened; can use the additional action only to use Quick Alchemy"',
  'Advanced Alchemy':
    Pathfinder2E.FEATURES['Advanced Alchemy']
    .replace('use a batch of infused reagents to create 2', 'create %{skillNotes.advancedEfficientAlchemy?intelligenceModifier+(level>=16?10:8):skillNotes.efficientAlchemy?6+intelligenceModifier:levels.Alchemist?4+intelligenceModifier:4} consumable'),
  'Advanced Vials (Bomber)':
    'Section=skill Note="Can make bombs with a special material trait"',
  'Advanced Vials (Chirurgeon)':
    'Section=skill ' +
    'Note="Does not need to wait between multiple uses of healing field vials on a creature that has fewer than half of its maximum Hit Points"',
  'Advanced Vials (Mutagenist)':
    'Section=save ' +
    'Note="Drinking a field vial gives resistance %{level//2} to physical damage until the beginning of the next turn"',
  'Advanced Vials (Toxicologist)':
    'Section=combat ' +
    'Note="Poison vials also inflict persistent poison damage equal to their splash damage"',
  // Changed effects
  'Alchemical Expertise':
    'Section=combat,skill ' +
    'Note=' +
      '"Class Expert (Alchemist)",' +
      '"Gathering reagents during exploration regains 3 vials"',
  'Alchemical Mastery':Pathfinder2E.FEATURES['Alchemical Mastery'],
  'Alchemical Weapon Expertise':
    Pathfinder2E.FEATURES['Alchemical Weapon Expertise'],
  'Alchemical Weapon Mastery':
    'Section=combat ' +
    'Note="Attack Master (Simple Weapons; Alchemical Bombs; Unarmed Attacks)"',
  'Alchemist Feats':Pathfinder2E.FEATURES['Alchemist Feats'],
  'Alchemist Skills':Pathfinder2E.FEATURES['Alchemist Skills'],
  'Alchemy':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Alchemical Crafting feature",' +
      '"Can automatically identify familiar alchemical items"',
  'Bomber':
   Pathfinder2E.FEATURES.Bomber
   .replace('target', 'target/Can use versatile vials to inflict cold, electricity, or fire damage'),
  'Chemical Hardiness':Pathfinder2E.FEATURES.Juggernaut,
  'Chirurgeon':
    // Once per target per 10 min comes from the Coagulant trait
    Pathfinder2E.FEATURES.Chirurgeon
    .replace('Medicine', "Medicine/Can use versatile vials to restore Hit Points equal to their initial damage to a willing target within 20' once per target per 10 min"),
  'Double Brew':Pathfinder2E.FEATURES['Double Brew'],
  'Explosion Dodger':Pathfinder2E.FEATURES.Evasion,
  'Field Discovery (Bomber)':Pathfinder2E.FEATURES['Calculated Splash'],
  'Field Discovery (Chirurgeon)':
    'Section=skill Note="Crafted healing elixirs give %{intelligenceModifier>?0} temporary Hit Points for 1 min"',
  'Field Discovery (Mutagenist)':
    'Section=save Note="Can end a the effects of a mutagen to reroll a Fortitude save"',
  'Field Discovery (Toxicologist)':
    'Section=save Note="Has poison resistance %{level//2}"',
  'Formula Book':Pathfinder2E.FEATURES['Formula Book'],
  'Greater Field Discovery (Bomber)':
    Pathfinder2E.FEATURES['Greater Field Discovery (Bomber)'],
  'Greater Field Discovery (Chirurgeon)':
    Pathfinder2E.FEATURES['Greater Field Discovery (Chirurgeon)'],
  'Greater Field Discovery (Mutagenist)':
    Pathfinder2E.FEATURES['Greater Field Discovery (Mutagenist)'],
  'Greater Field Discovery (Toxicologist)':
    'Section=combat ' +
    'Note="Infused injury poisons can also affect an adjacent target"',
  // Medium Armor Expertise as above
  'Medium Armor Mastery':Pathfinder2E.FEATURES['Medium Armor Mastery'],
  // Effects have changed
  'Mutagenist':
    'Section=combat,save,skill ' +
    'Note=' +
      '"Using a mutagen gives %{level//2+(intelligenceModifier>?0)} temporary Hit Points for 1 min or until the mutagen expires once per min",' +
      '"Can drink a versatile vial to suppress a drawback from 1 mutagen until the start of the next turn",' +
      '"Knows the formulas for 2 common 1st-level mutagens"',
  // Perception Expertise as above
  'Powerful Alchemy':
    Pathfinder2E.FEATURES['Powerful Alchemy']
    .replace(' created with Quick Alchemy', ''),
  'Toxicologist':
    'Section=combat,skill ' +
    'Note=' +
      '"Can apply a poison to a weapon as a single action, and creatures immune to poison take acid damage instead/Versatile vials have the poison, not acid, trait and can be used to poison a weapon for the first successful Strike before the end of the current turn",' +
      '"Knows the formulas for 2 common 1st-level alchemical poisons"',
  'Quick Alchemy':
    Pathfinder2E.FEATURES['Quick Alchemy']
    .replace('Uses', "Creates %V versatile vial bomb%{skillNotes.quickAlchemy>1?'s':''} or research item%{skillNotes.quickAlchemy>1?'s':''} that last%{skillNotes.quickAlchemy>1?'':'s'} until the end of the turn, or uses")
    .replace('batches of infused reagents', 'versatile vials')
    .replace(' consumable', ''),
  'Research Field':Pathfinder2E.FEATURES['Research Field'],
  // Changed calculations from Infused Reagents
  'Versatile Vials':
    'Section=skill ' +
    'Note="Can create %{(levels.Alchemist?2+intelligenceModifier:skillNotes.alchemicalSciences?intelligenceModifier:4)+(skillNotes.alchemicalDiscoveries?rank.Crafting-1:0)+($\'features.Voluminous Vials\'||0)} versatile vials during daily prep"',
  // Weapon Specialization as above
  'Will Expertise':Pathfinder2E.FEATURES['Iron Will'],

  'Alchemical Familiar':Pathfinder2E.FEATURES['Alchemical Familiar'],
  'Alchemical Assessment':
    Pathfinder2E.FEATURES['Alchemical Savant']
    .replace(/;[^"]*/, ''),
  'Blowgun Poisoner':
    'Section=combat ' +
    'Note="Poisoned blowgun Strikes apply injury poisons even if the target\'s resistance negates the attack damage, and critical successes with a poisoned blowgun Strike inflict 1 degree worse on the save/Successful Stealth vs. Perception when using a blowgun allows remaining hidden"',
  'Far Lobber':Pathfinder2E.FEATURES['Far Lobber'],
  'Quick Bomber':
    Pathfinder2E.FEATURES['Quick Bomber']
    .replace('Draws', 'Draws or uses Quick Alchemy to create'),
  'Soothing Vials':
    'Section=skill ' +
    'Note="Versatile vials that restore Hit Points allow an immediate +1 Will saving throw to end 1 mental effect"',
  'Clotting Elixirs':
    'Section=skill ' +
    'Note="Healing elixirs allow a DC 10 flat check to remove persistent bleed damage"',
  'Improvise Admixture':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Crafting check using an alchemist\'s toolkit creates 1, 2, or 3 versatile vials on a failure, success, or critical success once per day"',
  'Pernicious Poison':
    'Section=combat ' +
    'Note="Specially-prepared poison inflicts HP equal to its level if the target saves"',
  'Revivifying Mutagen':Pathfinder2E.FEATURES['Revivifying Mutagen'],
  // Changed effects
  'Smoke Bomb':
    'Section=combat ' +
    'Note="Can craft bombs to also create smoke in a 10\'-radius burst for 1 min"',
  // Changed effects
  'Efficient Alchemy':
    'Section=skill,skill ' +
    'Note=' +
      '"Has increased Advanced Alchemy effects",' +
      '"Can produce twice the usual number of alchemical consumables during downtime"',
  'Enduring Alchemy':Pathfinder2E.FEATURES['Enduring Alchemy'],
  'Healing Bomb':
    'Section=combat ' +
    'Note="Successful ranged Strike with an elixir of life gives its effects to the target and restores Hit Points equal to the elixir\'s dice to adjacent creatures; failure restores Hit Points equal to the elixir\'s dice to the target only"',
  'Invigorating Elixir':
    'Section=skill ' +
    'Note="Prepared elixirs can be imbibed by sickened creatures and attempt to counteract at rank %{level//2+(skillNotes.supremeInvigoratingElixir?1:0)} the imbiber\'s choice of %{skillNotes.supremeInvigoratingElixir?\'petrified, stunned, any disease, \':\'\'}%{$\'skillNotes.improvedInvigoratingElixir(Mental)\'?\'confused, controlled, fleeing, frightened, \':\'\'}%{$\'skillNotes.improvedInvigoratingElixir(Physical)\'?\'blinded, deafened, drained, \':\'\'}%{$\'skillNotes.improvedInvigoratingElixir(Mental)\'||$\'skillNotes.improvedInvigoratingElixir(Physical)\'?\'paralyzed, slowed, \':\'\'}clumsy, enfeebled, sickened, or stupefied once per creature per 10 min"',
  'Regurgitate Mutagen':
    'Action=1 ' +
    'Section=combat ' +
    'Note="R30\' Ends the effects of a mutagen to inflict %{level//2}d6 HP acid and sickened 1 (<b>save basic Reflex</b> also negates sickened; critical failure inflicts sickened 2)"',
  'Tenacious Toxins':
    'Section=skill ' +
    'Note="Increases the duration of poisons by their stage 1 interval"',
  // Changed effects
  'Combine Elixirs':
    'Section=skill ' +
    'Note="Uses the ingredients of 2 elixirs to create a single elixir that has the effects of both"',
  'Debilitating Bomb':
    Pathfinder2E.FEATURES['Debilitating Bomb']
    .replace('Action=Free', '')
    .replace(/Modifies a bomb of up to level \S*/, 'Can craft bombs')
    .replace('flat-footed', 'off-guard')
    .replace(' once per rd', ''),
  'Directional Bombs':
    Pathfinder2E.FEATURES['Directional Bombs']
    .replace(' in the direction thrown', '')
    .replace('15', '%{combatNotes.expandedSplash?20:15}'),
  'Fortified Elixirs':
    'Section=skill ' +
    'Note="Consumer of an infused antidote or antiplague can end its effects to reroll a failed Fortitude save vs. poison or disease"',
  'Sticky Poison':
    'Section=combat ' +
    'Note="Poisoned weapon remains poisoned after a failed Strike with a successful DC 5 flat check, or until the end of the next turn after a successful Strike with a successful DC 17 flat check"',
  'Alter Admixture':
    'Section=skill ' +
    'Note="Can use a 10 min process to change the type of an alchemical bomb, elixir, or poison"',
  'Improved Invigorating Elixir (Mental)':
    'Section=skill Note="Has increased Invigorating Elixir effects"',
  'Improved Invigorating Elixir (Physical)':
    'Section=skill Note="Has increased Invigorating Elixir effects"',
  'Mutant Physique':
    'Section=skill ' +
    'Note="Bestial mutagens give an Intimidation bonus and increase claws and jaws damage die by 1 step and give them the deadly d10 trait; juggernaut mutagens give resistance %{level//2} to physical damage; quicksilver mutagens give 10\' Steps and Squeezing as 1 size smaller"',
  'Pinpoint Poisoner':
    'Section=combat ' +
    'Note="Off-guard targets suffer -2 initial saves vs. self poisoned weapons and inhaled poisons"',
  'Sticky Bomb':
    Pathfinder2E.FEATURES['Sticky Bomb']
    .replace('Action=Free', '')
    .replace(/Modifies a bomb of up to level \S*/, 'Can craft bombs')
    .replace(' once per rd', ''),
  'Advanced Efficient Alchemy':
    'Section=skill Note="Has increased Advanced Alchemy effects"',
  'Expanded Splash':Pathfinder2E.FEATURES['Expanded Splash'],
  'Greater Debilitating Bomb':
    Pathfinder2E.FEATURES['Greater Debilitating Bomb'],
  'Unstable Concoction':
    'Section=skill ' +
    'Note="Can increase the die size of the initial effects of a alchemical consumable by 1 step; the consumer must succeed on a DC 10 flat check or suffer acid damage equal to the item\'s level"',
  'Extend Elixir':Pathfinder2E.FEATURES['Extend Elixir'],
  'Supreme Invigorating Elixir':
    'Section=skill Note="Has increased Invigorating Elixir effects"',
  'Uncanny Bombs':Pathfinder2E.FEATURES['Uncanny Bombs'],
  'Double Poison':
    'Section=combat ' +
    'Note="Can apply 2 poisons of up to level %{level-2} to a weapon simultaneously"',
  'Mutant Innervation':
    'Section=skill ' +
    'Note="Cognitive mutagens boost Deception, Diplomacy, Intimidation, Medicine, Nature, Performance, Religion, and Survival and allow R60\' telepathic communication; serene mutagens negate detection, revelation, and scrying effects up to rank 9; silvertongue mutagens negate circumstance penalties to Deception, Diplomacy, Intimidation, and Performance and translate speech into listeners\' languages"',
  'True Debilitating Bomb':Pathfinder2E.FEATURES['True Debilitating Bomb'],
  'Eternal Elixir':Pathfinder2E.FEATURES['Eternal Elixir'],
  // Effects change
  'Exploitive Bomb':
    'Section=combat Note="Can create bombs that negate resistance %{level}"',
  'Persistent Mutagen':Pathfinder2E.FEATURES['Persistent Mutagen'],
  'Improbable Elixirs':Pathfinder2E.FEATURES['Improbable Elixirs'],
  'Miracle Worker':Pathfinder2E.FEATURES['Miracle Worker'],
  'Perfect Debilitation':Pathfinder2E.FEATURES['Perfect Debilitation'],
  'Alchemical Revivification':
    'Section=save ' +
    'Note="After dying while under the effects of an elixir, returns to life at the start of the next turn with the effects of an elixir of rejuvenation, a true elixir of life, and a choice of a major bestial, juggernaut, or quicksilver mutagen, once every 1d4 hr"',
  "Craft Philosopher's Stone":
    Pathfinder2E.FEATURES["Craft Philosopher's Stone"],
  'Mega Bomb':
    Pathfinder2E.FEATURES['Mega Bomb']
    .replace('Action=1', '')
    .replace('Modifies a thrown bomb', 'Can create thrown bombs')
    .replace('to affect', 'that require 2 actions to throw and that affect'),

  // Barbarian
  // Armor Mastery as above
  'Barbarian Feats':Pathfinder2E.FEATURES['Barbarian Feats'],
  'Barbarian Skills':Pathfinder2E.FEATURES['Barbarian Skills'],
  'Bestial Rage (Ape)':
    Pathfinder2E.FEATURES['Bestial Rage (Ape)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Bear)':
    Pathfinder2E.FEATURES['Bestial Rage (Bear)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Bull)':
    Pathfinder2E.FEATURES['Bestial Rage (Bull)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Cat)':
    Pathfinder2E.FEATURES['Bestial Rage (Cat)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Deer)':
    Pathfinder2E.FEATURES['Bestial Rage (Deer)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Frog)':
    Pathfinder2E.FEATURES['Bestial Rage (Frog)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Shark)':
    Pathfinder2E.FEATURES['Bestial Rage (Shark)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Snake)':
    Pathfinder2E.FEATURES['Bestial Rage (Snake)']
    .replace('use', 'attack only using'),
  'Bestial Rage (Wolf)':
    Pathfinder2E.FEATURES['Bestial Rage (Wolf)']
    .replace('use', 'attack only using'),
  'Brutality':Pathfinder2E.FEATURES.Brutality,
  'Devastator':Pathfinder2E.FEATURES.Devastator,
  'Draconic Rage':Pathfinder2E.FEATURES['Draconic Rage'],
  'Furious Footfalls':
    'Section=ability,ability ' +
    'Note=' +
      '"+5 Speed",' +
      '"+5 Speed during rage"',
  'Greater Juggernaut':Pathfinder2E.FEATURES['Greater Juggernaut'],
  // Greater Weapon Specialization as above
  'Indomitable Will':Pathfinder2E.FEATURES['Indomitable Will'],
  'Instinct':Pathfinder2E.FEATURES.Instinct,
  'Juggernaut':Pathfinder2E.FEATURES.Juggernaut,
  // Medium Armor Expertise as above
  // Changed effects
  'Mighty Rage':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Expert (Barbarian)",' +
      '"First Strike during the first turn after using Quick-Tempered inflicts +%{combatNotes.rage} HP"',
  // Perception Mastery as above
  'Quick-Tempered':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Enters rage during initiative when unencumbered and in medium or lighter armor"',
  'Rage':
   Pathfinder2E.FEATURES.Rage
   .replace('-1 Armor Class and ', "%{levels.Barbarian?'':'-1 Armor Class and '}")
   .replace('quickRage', 'revitalizingRage')
   .replace('rages', 'rages to again gain temporary Hit Points'),
  'Raging Resistance (Animal)':
    Pathfinder2E.FEATURES['Raging Resistance (Animal)']
    .replace('3+constitutionModifier', 'saveNotes.unstoppableJuggernaut?12:(3+constitutionModifier)'),
  'Raging Resistance (Dragon)':
    Pathfinder2E.FEATURES['Raging Resistance (Dragon)']
    .replace('3+constitutionModifier', 'saveNotes.unstoppableJuggernaut?12:(3+constitutionModifier)'),
  'Raging Resistance (Fury)':
    Pathfinder2E.FEATURES['Raging Resistance (Fury)']
    .replace('3+constitutionModifier', 'saveNotes.unstoppableJuggernaut?12:(3+constitutionModifier)'),
  'Raging Resistance (Giant)':
    Pathfinder2E.FEATURES['Raging Resistance (Giant)']
    .replace('3+constitutionModifier', 'saveNotes.unstoppableJuggernaut?12:(3+constitutionModifier)'),
  'Raging Resistance (Spirit)':
    Pathfinder2E.FEATURES['Raging Resistance (Spirit)']
    .replace('3+constitutionModifier', 'saveNotes.unstoppableJuggernaut?12:(3+constitutionModifier)')
    .replace('negative', 'void'),
  'Raging Resistance (Superstition)':
    'Section=save ' +
    'Note="Has resistance %{saveNotes.unstoppableJuggernaut?12:(3+constitutionModifier)} to a choice of arcane or divine spells and a choice of occult or primal spells during rage"',
  'Revitalizing Rage':Pathfinder2E.FEATURES['Quick Rage'],
  'Specialization Ability':Pathfinder2E.FEATURES['Specialization Ability'],
  'Spirit Rage':
    Pathfinder2E.FEATURES['Spirit Rage']
    .replace('positive or negative', 'spirit'),
  'Superstitious Resilience':
    'Section=combat,combat,save ' +
    'Note=' +
      '"Increases added rage damage to %V",' +
      '"Entering rage restores %{level+constitutionModifier} Hit Points once per 10 min/Inflicts +%{combatNotes.greaterWeaponSpecialization?3:1} HP vs. targets seen casting within the past hr during rage",' +
      '"+2 vs. magic during rage/Willingly accepting magic effects during rage inflicts frightened 1 as long as the effects last"',
  'Titan Mauler':Pathfinder2E.FEATURES['Titan Mauler'],
  'Unstoppable Frenzy':
    'Section=combat,feature ' +
    'Note=' +
      '"Increases added rage damage to %V",' +
      '"+1 Class Feat"',
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
  'Second Wind':
    Pathfinder2E.FEATURES['Second Wind']
    .replace('rage', 'gain temporary Hit Points from raging'),
  'Shake It Off':Pathfinder2E.FEATURES['Shake It Off'],
  // Barreling Charge as above
  'Oversized Throw':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Uses an item from surroundings to make a R20\' ranged strike that deals %{combatNotes.greaterWeaponSpecialization?3:combatNotes.weaponSpecialization?2:1}d10 HP bludgeoning during rage"',
  'Raging Athlete':Pathfinder2E.FEATURES['Raging Athlete'],
  'Scars Of Steel':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives resistance %{constitutionModifier+level//2} to the damage from the triggering critical hit once per day during rage"',
  'Spiritual Guides':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Rerolls a normal failure on a Perception or skill check once per day"',
  'Supernatural Senses':
    'Section=skill ' +
    'Note="Reduces the flat check DC to target a concealed or hidden foe to 3 or 9 during rage"',
  // Swipe as above
  'Wounded Rage':Pathfinder2E.FEATURES['Wounded Rage'],
  'Animal Skin':Pathfinder2E.FEATURES['Animal Skin'],
  'Brutal Bully':
    Pathfinder2E.FEATURES['Brutal Bully']
    .replace('Shove', 'Reposition, Shove'),
  'Cleave':Pathfinder2E.FEATURES.Cleave,
  // Changed effects
  "Dragon's Rage Breath":
    'Action=2 ' +
    'Section=combat ' +
    'Note="Breath inflicts %{level}d6 HP %{combatNotes.draconicRage} damage in a 30\' cone (<b>save basic Reflex</b>) once per 10 min during rage"',
  "Giant's Stature":Pathfinder2E.FEATURES["Giant's Stature"],
  'Inner Strength':
    'Action=1 Section=save Note="Reduces enfeebled condition by 1 during rage"',
  'Mage Hunter':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike on a known spell caster inflicts stupefied 1, or stupefied 2 on a critical hit, until the start of the next turn during rage"',
  'Nocturnal Senses':
    'Section=feature ' +
    'Note="Low-Light Vision becomes Darkvision and imprecise scent range increases to 60\' during rage"',
  // Reactive Strike as above
  'Scouring Rage':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Entering rage inflicts %{level} HP rage damage type on foes in a 20\' emanation (<b>save basic Fortitude</b>)"',
  "Spirits' Interference":Pathfinder2E.FEATURES["Spirits' Interference"],
  'Animalistic Brutality':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Unarmed attack gains a choice of the backswing, forceful, parry, razing, and sweep traits until rage ends"',
  'Disarming Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike allows an Athletics check to Disarm during rage"',
  'Follow-Up Assault':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Follows a missed melee Strike with another Strike that has the backswing and forceful traits during rage"',
  'Friendly Toss':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Throws an adjacent ally to a space within 30\', where it can use a reaction to make a melee Strike against a foe, during rage"',
  'Furious Bully':Pathfinder2E.FEATURES['Furious Bully'],
  'Instinctive Strike':
    'Section=combat ' +
    'Note="Melee Strikes against scent-detected foes ignore concealed and hidden"',
  'Invulnerable Rager':
    'Section=combat,combat ' +
    'Note=' +
      '"Defense %V (Heavy Armor)",' +
      '"Can use Quick-Tempered action in heavy armor"',
  'Renewed Vigor':
    Pathfinder2E.FEATURES['Renewed Vigor']
    .replace('Hit Points during rage', 'Hit Points, or %{level+constitutionModifier} Hit Points after attacking, until the rage ends'),
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
    'Note="Reduces falling damage by 10\' and inflicts 5 HP bludgeoning and difficult terrain in a 5\' emanation"',
  'Knockback':Pathfinder2E.FEATURES.Knockback,
  // Overpowering Charge as above
  'Resounding Blow':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful melee Strike also inflicts deafened until the start of the next turn, or for 1 min with a critical hit, during rage"',
  'Silencing Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike inflicts stunned 1, requiring a successful DC 11 flat check to use linguistic actions (<b>save Fortitude</b> negates; critical failure inflicts stunned 3) during rage"',
  'Tangle Of Battle':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a Grapple attempt immediately after a critical hit on an adjacent foe during rage"',
  'Terrifying Howl':Pathfinder2E.FEATURES['Terrifying Howl'],
  "Dragon's Rage Wings":Pathfinder2E.FEATURES["Dragon's Rage Wings"],
  'Embrace The Pain':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Successful Athletics check inflicts Grapple or Disarm after a foe melee hit during rage"',
  'Furious Grab':Pathfinder2E.FEATURES['Furious Grab'],
  "Predator's Pounce":Pathfinder2E.FEATURES["Predator's Pounce"],
  "Spirit's Wrath":
    Pathfinder2E.FEATURES["Spirit's Wrath"]
    .replace('negative or positive', 'spirit')
    .replace('also inflicts', 'inflicts double HP and'),
  'Sunder Spell':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful melee Strike on a creature, object, or spell manifestation allows a rank %{(level+1)//2} counteract attempt vs. a spell or magical effect once per target per day during rage"',
  "Titan's Stature":Pathfinder2E.FEATURES["Titan's Stature"],
  'Unbalancing Sweep':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Makes a Shove or Trip attempt vs. 3 foes within reach"',
  'Awesome Blow':Pathfinder2E.FEATURES['Awesome Blow'],
  "Giant's Lunge":Pathfinder2E.FEATURES["Giant's Lunge"],
  'Impaling Thrust':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Strike with a piercing melee weapon during rage inflicts grabbed; ending the grab inflicts persistent bleed damage equal to the weapon\'s damage dice"',
  'Sunder Enchantment':
    'Section=combat ' +
    'Note="Can use Sunder Spell to instead attempt to counteract an unattended magic item, or one possessed by the target, making it mundane for 10 min"',
  'Vengeful Strike':
    Pathfinder2E.FEATURES['Vengeful Strike']
    .replace(/"$/, '; using Vengeful Strike in response to a critical hit is a free action"'),
  // Whirlwind Strike as above
  'Collateral Thrash':Pathfinder2E.FEATURES['Collateral Thrash'],
  'Desperate Wrath':Pathfinder2E.FEATURES['Reckless Abandon'],
  'Dragon Transformation':
    Pathfinder2E.FEATURES['Dragon Transformation']
    .replace('level', 'rank')
    .replace('during rage', 'once per 10 min during rage'),
  'Furious Vengeance':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Makes a melee Strike against a foe that inflicts a critical hit on self during rage"',
  'Penetrating Projectile':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a ranged or thrown piercing weapon Strike on each creature in a 30\' line during rage"',
  'Shattering Blows':
    'Section=combat ' +
    'Note="Strikes ignore %{features.Devastator?10:5} Hardness during rage"',
  'Brutal Critical':Pathfinder2E.FEATURES['Brutal Critical'],
  'Perfect Clarity':Pathfinder2E.FEATURES['Perfect Clarity'],
  'Vicious Evisceration':Pathfinder2E.FEATURES['Vicious Evisceration'],
  'Whirlwind Toss':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Collateral Thrash damages all adjacent foes and allows throwing the grabbed foe 10\'"',
  'Annihilating Swing':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Melee Strike ignores target resistances, destroys non-magical objects with Hardness up to 20, and destroys magical objects with Hardness up to 20 with a successful rank 10 counteract check"',
  'Contagious Rage':Pathfinder2E.FEATURES['Contagious Rage'],
  'Quaking Stomp':Pathfinder2E.FEATURES['Quaking Stomp'],
  'Unstoppable Juggernaut':
    'Section=save,save ' +
    'Note=' +
      '"Has increased Raging Resistance effects",' +
      '"Has resistance %{constitutionModifier+3} to all damage and can use a reaction to retain 1 Hit Point and suffer wounded 2 when reduced to 0 Hit Points during rage"',

  // Champion
  // Anathema as above
  // Armor Expertise as above
  // Armor Mastery as above
  // Changed description
  'Blessed Armament':
    'Section=combat ' +
    'Note="Can apply a choice of %{combatNotes.armamentParagon?\'<i>animated</i>, <i>greater fearsome</i>, <i>grievous</i>, <i>keen</i>, <i>greater vitalizing</i>, \'+(combatNotes.radiantArmament?\'<i>greater astral</i>, <i>greater brilliant</i>, \':\'\'):\'\'}%{combatNotes.radiantArmament?\'<i>astral</i>, <i>brilliant</i>, <i>holy</i>, <i>unholy</i>, \':\'\'}<i>fearsome</i>, <i>ghost touch</i>, <i>returning</i>, <i>shifting</i>, or <i>vitalizing</i> to a chosen weapon during daily prep%{combatNotes.radiantArmament?\' and use a \'+(combatNotes.armamentParagon?\'1-action\':\'10-min\')+\' activity to chance the choice\':\'\'}, and critical hits inflict its critical specialization effect"',
  'Blessed Shield':
    'Section=combat Note="+%V Shield Hardness/+%1 Shield Hit Points"',
  'Blessed Swiftness':
    'Section=ability,combat ' +
    'Note=' +
      '"+5 Speed",' +
      '"Ally moving within aura gains +2 defense vs. movement reactions"',
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
  // Note: also Weapon Familiarity (%{deityWeapon}) if the weapon is advanced,
  // but there are no predefined deities for which that's the case
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
    'Note="Triggering attack from within aura inflicts an additional %{level<5?1:level<9?2:level<12?3:level<16?4:level<19?5:6}d6 HP on self and an equal amount of spirit damage%{combatNotes.relentlessReaction?\', plus \'+charismaModifier+\' HP persistent spirit,\':\'\'} on the attacker, and self Strikes on attacker inflict +%{level<9?2:level<16?4:6} HP spirit until the end of the next turn%{combatNotes.exaltedReaction?\'; other foes within aura suffer half the damage dealt to the triggering foe\':\'\'}"',
  // Changed effects
  'Devotion Spells':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool"',
  'Divine Will':Pathfinder2E.FEATURES['Divine Will'],
  'Exalted Reaction':'Section=combat Note="Has increased %V effects"',
  'Flash Of Grandeur':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives an ally within aura resistance %{level+2} to the triggering damage from within aura%{combatNotes.relentlessReaction?\', inflicts \'+charismaModifier+\' HP persistent spirit on attacker,\':\'\'} and inflicts <i>Revealing Light</i> on %{combatNotes.exaltedReaction?\'all foes within aura\':\'attacker\'} for 1 rd"',
  // Changed description
  'Glimpse Of Redemption':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Forces a foe within aura who has damaged an ally within aura to choose between negating the damage or giving the ally resistance %{2+level} to it and suffering enfeebled 2 until the end of its next turn%{combatNotes.relentlessReaction?\' and \'+charismaModifier+\' HP persistent spirit\':\'\'}%{combatNotes.exaltedReaction?\'; self may share resistance \'+level+\' with every ally within aura instead of only the damaged ally\':\'\'}"',
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
    'Note="Foe that inflicted the triggering damage suffers its choice of kneeling or %{level<5?1:level<9?2:level<12?3:level<16?4:level<19?5:6}d6 HP mental%{combatNotes.relentlessReaction?\' and \'+charismaModifier+\' HP persistent spirit\':\'\'}, and self Strikes vs. that foe inflict +%{level<9?1:level<16?2:3} HP spirit until the end of the next turn%{combatNotes.exaltedReaction?\'; other foes within aura must also kneel or suffer \'+(level<5?1:level<9?2:level<12?3:level<16?4:level<19?5:6)+\' HP mental\':\'\'}"',
  'Justice':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Retributive Strike feature",' +
      '"Must follow the law and respect legitimate authorities"',
  'Lay On Hands':'Section=magic Note="Knows the Lay On Hands divine spell"',
  'Legendary Armor':Pathfinder2E.FEATURES['Legendary Armor'],
  // Changed description
  'Liberating Step':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives an ally within aura resistance %{2+level} to any triggering damage from within aura and free actions to Escape or to save from a restraint and to Step%{combatNotes.relentlessReaction?\'; restraining foe suffers \'+charismaModifier+\' HP persistent spirit\':\'\'}%{combatNotes.relentlessReaction?\', and self and allies also gain a free Step\':\'\'}"',
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
  'Relentless Reaction':'Section=combat Note="Has increased %V effects"',
  // Changed description
  'Retributive Strike':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives an ally within aura resistance %{level+2} to the triggering damage from within aura%{combatNotes.relentlessReaction?\',\':\' and\'} allows self to make a melee Strike against the attacker if within reach%{combatNotes.exaltedReaction?\',\':combatNotes.relentlessReaction?\', and\':\'\'}%{combatNotes.relentlessReaction?\' inflicting \'+charismaModifier+\' HP persistent spirit if the Strike hits\':\'\'}%{combatNotes.exaltedReaction?\', and allows allies within aura and within reach of the attacker to use a reaction to make a -5 melee Strike on the attacker\':\'\'}"',
  'Sacred Body':Pathfinder2E.FEATURES.Juggernaut,
  // Sanctification as above
  'Selfish Shield':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives resistance %{level//2+(combatNotes.relentlessReaction&&charismaModifier>2?charismaModifier:2)} to the triggering damage from within aura%{combatNotes.exaltedReaction?\',\':\' and\'} gives self Strikes against the triggering foe +%{level<9?1:level<16?2:3} HP spirit until the end of the next turn%{combatNotes.exaltedReaction?\', and inflicts -1 attacks vs. self on foes within aura until the start of the next turn\':\'\'}"',
  // Shield Block as above
  'Shields Of The Spirit':
    'Section=magic Note="Knows the Shields Of The Spirit divine spell"',
  'Touch Of The Void':
    'Section=magic Note="Knows the Touch Of The Void divine spell"',
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
  "Deity's Domain (Knowledge)":
    Pathfinder2E.FEATURES["Deity's Domain (Knowledge)"],
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
    'Note="Gains 1 Focus Spell to cast a devotion spell by the end of the turn once per day"',
  'Faithful Steed':
    'Section=feature Note="Has a young animal companion as a mount"',
  'Iron Repercussions':
    'Section=magic ' +
    'Note="Iron Command can inflict persistent mental damage"',
  'Nimble Reprisal':Pathfinder2E.FEATURES['Ranged Reprisal'],
  'Ongoing Selfishness':
    'Section=combat ' +
    'Note="Selfish Shield gives resistance %{(level//2+(combatNotes.relentlessReaction&&charismaModifier>2?charismaModifier:2))//2} to all damage from the triggering foe until the end of the turn"',
  'Unimpeded Step':
    'Section=combat ' +
    'Note="Liberating Step allows Stepping normally in any terrain"',
  'Vicious Vengeance':
    'Section=combat ' +
    'Note="Destructive Vengeance inflicts +%{level<5?1:level<9?2:level<12?3:level<16?4:level<19?5:6} HP initial damage on the foe"',
  'Weight Of Guilt':Pathfinder2E.FEATURES['Weight Of Guilt'],
  'Divine Grace':Pathfinder2E.FEATURES['Divine Grace'],
  'Divine Health':Pathfinder2E.FEATURES['Divine Health'] + ' ' +
    'Note="+2 vs. diseases and poisons and on flat checks to recover from persistent poison%{saveNotes.sacredBody?\', critical failures vs. disease or poison are normal failures\':\'\'}, and successes vs. disease or poison are critical successes; allies within aura gain +1 vs. disease and poison"',
  // Change of description
  'Aura Of Courage':
    'Section=save ' +
    'Note="Reduces the initial value of any frightened condition by 1, and the end of a turn reduces the fright of allies within aura by 1"',
  'Aura Of Despair':
    'Section=combat ' +
    'Note="Foes within aura suffer -1 saves vs. fear and cannot remove the frightened condition"',
  'Cruelty':
    'Section=magic ' +
    'Note="2-action <i>Touch Of The Void</i> also inflicts%{magicNotes.greaterCruelty?\' clumsy, stupefied, or\':\'\'} enfeebled 1 for 1 min on a failed save, or%{magicNotes.greaterCruelty?\' clumsy, stupefied, or\':\'\'} enfeebled 2 on a critical failure"',
  'Mercy (Body)':
    'Section=magic ' +
    'Note="2-action <i>Lay On Hands</i> can also attempt to counteract %{magicNotes.greaterMercy?(level<16?\'\':\'stunned, \')+\'drained, slowed, \':\'\'}blinded, dazzled, deafened, enfeebled, or sickened"',
  'Mercy (Grace)':
    'Section=magic ' +
    'Note="2-action <i>Lay On Hands</i> can also attempt to counteract %{magicNotes.greaterMercy?(level<12?\'\':level<16?\'petrified, \':\'petrified, stunned, \')+\'immobilized, restrained, slowed, \':\'\'}clumsy, grabbed, or paralyzed"',
  'Mercy (Mind)':
    'Section=magic ' +
    'Note="2-action <i>Lay On Hands</i> can also attempt to counteract %{magicNotes.greaterMercy?(level<16?\'\':\'doomed, stunned, \')+\'confused, controlled, slowed, \':\'\'}fleeing, frightened, or stupefied"',
  'Security':
    'Section=magic ' +
    'Note="2-action <i>Shields Of The Spirit</i> gives 1 ally the benefits of the spell for 1 min"',
  'Expand Aura':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Extends Champion\'s Aura to 30\' %{level<10?\'for 1 rd\':level<16?\'for 1 min\':\'until Dismissed\'}"',
  'Loyal Warhorse':Pathfinder2E.FEATURES['Loyal Warhorse'],
  // Reactive Strike as above
  // Shield Warden as above
  // Changed effects
  'Smite':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strikes against a designated foe gain +3 damage, or +4 with a master proficiency weapon%{traits.Holy?\' (+4 or +6 vs. an unholy foe)\':traits.Unholy?\' (+4 or +6 vs. a holy foe)\':\'\'}, until the start of the next turn; hostile actions by the foe extend the effect each rd"',
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
  'Greater Cruelty':'Section=magic Note="Has increased Cruelty effects"',
  'Greater Mercy':'Section=magic Note="Has increased Mercy effects"',
  'Greater Security':
    'Section=magic ' +
    'Note="Security gives the target +%{shieldACBonus} Armor Class and allows self to use Shield Block to benefit them"',
  'Heal Mount':
    Pathfinder2E.FEATURES['Heal Mount']
    .replace('level', 'rank'),
  // Quick Shield Block as above
  'Second Blessing':Pathfinder2E.FEATURES['Second Ally'],
  'Imposing Destrier':Pathfinder2E.FEATURES['Imposing Destrier'],
  'Radiant Armament':
    'Section=combat Note="Has increased Blessed Armament effects"',
  'Shield Of Reckoning':
    Pathfinder2E.FEATURES['Shield Of Reckoning']
    .replace('foe', 'foe once per rd'),
  'Spectral Advance':
    'Section=magic Note="Knows the Spectral Advance divine spell"',
  // Changed description
  'Affliction Mercy':
    'Section=magic ' +
    'Note="2-action <i>Lay On Hands</i> can attempt to counteract an affliction such as a curse, disease, or poison"',
  // Changed description
  'Aura Of Faith':
    'Section=combat ' +
    'Note="Strikes by allies within aura gain the %{traits.Unholy?\'unholy\':\'holy\'} trait"',
  'Blessed Counterstrike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Strike after a Champion\'s Reaction inflicts +1 damage die and weakness %{level//2} to Strikes by self and allies until the start of the next turn"',
  "Champion's Sacrifice":Pathfinder2E.FEATURES["Champion's Sacrifice"],
  'Devoted Focus':
    Pathfinder2E.FEATURES['Devoted Focus']
    .replace('2', 'all'),
  'Divine Wall':Pathfinder2E.FEATURES['Divine Wall'],
  'Gruesome Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Champion\'s Reaction Strike inflicts double extra damage and drained 1 (<b>save Fortitude</b> negates drained) once per target per day"',
  'Aura Of Determination':
    'Section=save ' +
    'Note="Aura gives self and allies +1 vs. mental, morph, and polymorph"',
  // Changed description
  'Aura Of Life':
    'Section=save ' +
    'Note="Aura gives self and allies resistance 5 to void and +1 vs. void"',
  'Aura Of Righteousness':
    Pathfinder2E.FEATURES['Aura Of Righteousness']
    .replace("R15' Gives", 'Aura gives self and allies')
    .replace('evil', 'unholy and attempts to counteract teleportation affecting unholy creatures'),
  'Divine Reflexes':Pathfinder2E.FEATURES['Divine Reflexes'],
  // Changed description
  'Auspicious Mount':
    'Section=feature ' +
    'Note="Mount is a specialized animal companion with celestial, fiend, or monitor trait, +2 Intelligence, +1 Wisdom, expert proficiency in Religion, ability to speak the language of %{deity}\'s servitors, flight, +%{level<18?20:level<20?25:30} Hit Points, and, as appropriate, the holy or unholy trait with +5 Hit Points and weakness 5 to the opposing trait"',
  'Instrument Of Slaughter':
    'Section=combat ' +
    'Note="Critical hit on a Champion\'s Reaction that inflicts extra damage also inflicts persistent bleed damage equal to 2 damage dice"',
  'Instrument Of Zeal':
    Pathfinder2E.FEATURES['Instrument Of Zeal']
    .replace('Blade Of Justice', 'Blessed Counterstrike'),
  'Shield Of Grace':Pathfinder2E.FEATURES['Shield Of Grace'],
  'Rejuvenating Touch':
    'Section=magic ' +
    'Note="<i>Lay On Hands</i> gives 10 temporary Hit Points, lasting 1 rd, each rd for 10 rd"',
  'Swift Retribution':
    'Section=combat ' +
    'Note="Champion\'s Reaction gives self an additional Stride toward or Strike on the triggering foe during the next turn"',
  'Ultimate Mercy':
    Pathfinder2E.FEATURES['Ultimate Mercy']
    .replace('Mercy', '2-action <i>Lay On Hands</i>'),
  'Armament Paragon':
    'Section=combat Note="Has increased Blessed Armament effects"',
  'Sacred Defender':
    'Section=save ' +
    'Note="Has resistance 5 to bludgeoning, piercing, and slashing%{traits.Holy?\', or resistance 10 vs. unholy creatures\':traits.Unholy?\', or resistance 10 vs. holy creatures\':\'\'}, and a natural 20 on a foe Strike does not improve the success degree"',
  'Shield Paragon':Pathfinder2E.FEATURES['Shield Paragon'],
  'Swift Paragon':
    'Section=combat ' +
    'Note="Has an additional action each rd to Step or Stride, and aura allows allies to move without triggering reactions"',

  // Investigator
  'Alchemical Sciences':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Alchemical Crafting, Quick Tincture, and Versatile Vials features",' +
      '"Skill Trained (Crafting)",' +
      '"Knows the formulas for %{level+5+(skillNotes.alchemicalDiscoveries?level-4:0)} common alchemical elixirs or tools"',
  'Clue In':
    'Action=Reaction ' +
    'Section=skill ' +
    'Note="Gives another creature +%{skillNotes.investigationExpertise?2:1} on the triggering Perception or skill check that will help to answer an active investigation question once per 10 min"',
  'Deductive Improvisation':
    'Section=skill ' +
    'Note="Can attempt skill checks that require trained, expert, or master proficiency when untrained, trained, or expert"',
  'Devise A Stratagem':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Attack Stratagem and Skill Stratagem features",' +
      '"Can use%{features.Defensive Stratagem?\' Defensive Stratagem,\':\'\'} Attack Stratagem or Skill Stratagem once per rd"',
  'Attack Stratagem':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Uses a pre-rolled value for the first attack vs. a chosen creature before the start of the next turn; can substitute intelligence for strength or dexterity on the attack if using a sap or an agile, finesse, or ranged weapon"',
  'Skill Stratagem':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Refrains from attacking a chosen creature to gain +1 on the next intelligence-, wisdom-, or charisma-based skill or Perception check involving it before the start of the next turn"',
  'Dogged Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Empiricism':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the That\'s Odd and Expeditious Inspection features",' +
      // TODO randomizing problem
      '"Skill Trained (Choose 1 from any Intelligence)"',
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
      '"Can Pursue A Lead and Make An Impression simultaneously"',
  // Fortitude Expertise as above
  'Greater Dogged Will':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Successes on Will saves are critical successes, critical failures on Will saves are normal failures, and failed Will saves inflict half damage"',
  // Greater Weapon Specialization as above
  'Investigator Expertise':
    'Section=combat,skill ' +
    'Note=' +
      '"Class Expert (Investigator)",' +
      '"Has increased Pursue A Lead effects"',
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
      '"Automatically senses the presence of a clue that pertains to an active investigation when entering a new location"',
  'Methodology':'Section=feature Note="1 selection"',
  'On The Case':
    'Section=feature Note="Has the Clue In and Pursue A Lead features"',
  // TODO 2 active investigations maximum?
  'Pursue A Lead':
    'Section=skill ' +
    'Note="Can use 1 min examining a detail to detect a deeper mystery; success allows opening an investigation and gives +%V on later Perception and skill checks when attempting to answer a central question about it"',
  'Pointed Question':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Diplomacy vs. Will gives +2 Perception to detect a Lie and inflicts off-guard vs. Attack Stratagem until the end of the turn; critical success gives +4 Perception; critical failure worsens the target\'s attitude by 1 step"',
  'Quick Tincture':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses a versatile vial to create a alchemical elixir or tool of up to level %{level} that lasts until the end of the turn"',
  'Savvy Reflexes':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Reflex)",' +
      '"Successes on Reflex saves are critical successes"',
  'Skillful Lessons':'Section=feature Note="+%V Skill Feat"',
  'Strategic Strike':
    'Section=combat ' +
    'Note="Successful Attack Stratagems that use intelligence inflict +%{(level+3)//4}d6 HP precision"',
  'Vigilant Senses':'Section=skill Note="Perception Master"',
  // Weapon Expertise as above
  // Weapon Mastery as above
  // Weapon Specialization as above

  'Eliminate Red Herrings':
    'Section=skill ' +
    'Note="Critical failures to Recall Knowledge about an active investigation are normal failures"',
  'Flexible Studies':
    'Section=skill ' +
    'Note="Can become temporarily trained in 1 skill during daily prep"',
  'Known Weaknesses':
    'Section=combat ' +
    'Note="Critical success on a Recall Knowledge as part of Devise A Stratagem gives self and each ally +1 on their first attack on the target before the start of the next turn"',
  'Takedown Expert':
    'Section=combat ' +
    'Note="Clubs gain Devise A Stratagem attack bonus/Suffers no penalty for making a Strike nonlethal"',
  "That's Odd":
    'Section=skill ' +
    'Note="Automatically notices 1 unusual detail when first entering a location and can immediately use Pursue A Lead with it"',
  // Trap Finder as above
  'Underworld Investigator':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Trained (Underworld Lore)",' +
      '"+%{skillNotes.pursueALead} Thievery to investigate a case"',
  'Athletic Strategist':
    'Section=combat ' +
    'Note="Can use Devise A Stratagem to Disarm, Grapple, Reposition, Shove, or Trip, and can use Intelligence for the check"',
  'Certain Stratagem':
    'Section=combat ' +
    'Note="Failed Attack Stratagem that uses Intelligence inflicts %{(level+3)//4}d6 / 2 HP"',
  'Exploit Blunder':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Takes a Step after the triggering miss by the prior turn\'s Devise A Stratagem target"',
  'Person Of Interest':
    'Action=1 ' +
    'Section=feature ' +
    'Note="Can use Devise A Stratagem for 1 min on a chosen creature unrelated to active investigations once per 10 min"',
  'Shared Stratagem':
    'Section=combat ' +
    'Note="Successful Attack Stratagem makes the target off-guard to the next attack by a chosen ally until the start of the next turn"',
  'Solid Lead':
    'Section=skill ' +
    'Note="Can use 1 action to later switch back to following a chosen dropped lead"',
  'Alchemical Discoveries':
    'Section=skill ' +
    'Note="Has increased Alchemical Sciences and Versatile Vials effects"',
  "Detective's Readiness":
    'Section=save ' +
    'Note="+2 saves vs. creatures and effects related to an open investigation, and Clue In gives this bonus to allies"',
  'Lie Detector':
    'Section=skill ' +
    'Note="+1 Perception to Sense Motive and DCs vs. attempts to Lie, or +%{skillNotes.pursueALead+1} when Pursuing A Lead; success gives +1 to the next Deception, Diplomacy, Intimidation, or Performance vs. the target within 1 min"',
  'Ongoing Investigation':
    'Section=skill ' +
    'Note="Can Investigate at full Speed and use another exploration activity while Investigating"',
  "Scalpel's Point":
    'Section=combat ' +
    'Note="Critical hits on Attack Stratagems that inflict piercing or slashing damage also inflict 1d6 HP persistent bleed"',
  'Strategic Assessment':
    'Section=combat ' +
    'Note="Successful Attack Stratagems give info on the target\'s weaknesses, resistances, saves, or immunities"',
  'Connect The Dots':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Successful Perception vs. a foe\'s Deception or Will gives a chosen ally +%{skillNotes.pursueALead} on its next attack on the target before the start of the next turn; critical success gives the ally +%{skillNotes.pursueALead} on all attacks before for the start of the next turn; critical failure inflicts stupefied 1 on self until the end of the next turn"',
  // Predictive Purchase as above
  'Thorough Research':
    'Section=skill ' +
    'Note="Success on a Recall Knowledge check gives additional information"',
  // Blind-Fight as above
  'Clue Them All In':
    'Section=skill Note="Clue In applies to all allies for 1 rd"',
  'Defensive Stratagem':
    'Action=1 ' +
    'Section=save ' +
    'Note="Refrains from attacking a target while gaining +1 vs. all effects caused by it until the start of the next turn"',
  'Whodunnit?':
    'Section=skill ' +
    'Note="Successful Pursue A Lead allows receiving answers to 2 questions about the mystery once per day"',
  'Just One More Thing':
    // In description 'Action=1 ' +
    'Section=skill ' +
    'Note="Rerolls a normal failure on a Demoralize, Feint, Request, Lie, Gather Information, Make An Impression, or Coerce check, adding %{skillNotes.pursueALead} if the check is connected to an active investigation, once per target per day; rerolling Demoralize, Feint, and Request requires 1 action, and the others require the maximum of 1 rd or half the time spent on the failed action"',
  'Ongoing Strategy':
    'Section=combat ' +
    'Note="Successful non-Stratagem attacks that use an Attack Stratagem weapon inflict +%{(level+3)//4} HP precision"',
  'Suspect Of Opportunity':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Uses Person Of Interest against an attacking creature unrelated to any active investigation"',
  "Empiricist's Eye":
    'Section=combat ' +
    'Note="Can use non-auditory Point Out%{$\'features.Blind-Fight\'?\',\':\' and\'} the target is off-guard to allies until the start of the next turn%{$\'features.Blind-Fight\'?\', and allies can use Blind-Fight effects against it\':\'\'}"',
  'Foresee Danger':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Triggering foe attack targets Perception DC instead of Armor Class"',
  'Just As Planned':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Devise A Stratagem uses the higher of 2 d20 rolls once per hr"',
  "Make 'Em Sweat":
    'Section=skill ' +
    'Note="Successful Pointed Question inflicts frightened 1, or frightened 2 on a critical success"',
  'Reason Rapidly':
    'Action=1 Section=skill Note="Uses up to 5 Recall Knowledge actions"',
  'Share Tincture':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses Quick Tincture to create an item lasting until the start of the next turn and can pass it to another creature"',
  'Surgical Shock':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Medicine vs. Fortitude inflicts a choice of clumsy 2 or stupefied 2; critical success inflicts clumsy 3 or stupefied 3; failure gives self +1 to the first self attack on the target before the end of the turn; critical failure triggers manipulate reactions"',
  'Plot The Future':
    'Section=skill ' +
    'Note="10 min reflection gives a general idea of the likelihood of an event up to 1 week in the future and a suggestion of how to make it more or less likely"',
  // Sense The Unseen as above
  'Strategic Bypass':
    'Section=combat ' +
    'Note="Successful Attack Stratagem ignores resistance %{intelligenceModifier}"',
  'Didactic Strike':
    'Section=combat ' +
    'Note="Can use Shared Stratagem with 10 allies; each ally\'s first Strike on the target inflicts +2d6 HP precision"',
  // Implausible Purchase as above
  // Reconstruct The Scene as above
  'Lead Investigator':
    'Section=skill ' +
    'Note="1 min briefing gives 4 allies Pursue A Lead bonuses to investigation checks for 1 day or until the Lead is dropped"',
  "Trickster's Ace":Pathfinder2E.FEATURES["Trickster's Ace"],
  "Everyone's A Suspect":
    'Section=skill ' +
    'Note="1 min interaction gives an automatic Pursue A Lead with the target; can have an unlimited number of these"',
  'Just The Facts':
    'Section=skill ' +
    'Note="Can make an additional Recall Knowledge each round, knows the result of Recall Knowledge checks, gains +1 level of success on Recall Knowledge checks, and recognizes inaccurate knowledge from self or ally Recall Knowledge checks"',

  // Monk
  'Adamantine Strikes':Pathfinder2E.FEATURES['Adamantine Strikes'],
  // Effects changed
  'Expert Strikes':
    'Section=combat,combat ' +
    'Note=' +
      '"Attack Expert (Simple Weapons; Unarmed Attacks)",' +
      '"Critical hits with a brawling unarmed attack inflict its critical specialization effect"',
  'Flurry Of Blows':
    Pathfinder2E.FEATURES['Flurry Of Blows']
    .replace('turn', "%{$$'feats.Monk Dedication'?'1d4 rd':'turn'}"),
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
      '"Unarmored stance allows only bow Strikes; can use Flurry Of Blows and other unarmed monk features with bows at half their range increment"',
  'Mountain Stance':
    Pathfinder2E.FEATURES['Mountain Stance']
    .replace('Shove', 'Reposition, Shove'),
  'Qi Spells (Inner Upheaval)':
    'Section=magic ' +
    'Note="Knows the Inner Upheaval occult spell/Has a focus pool"',
  'Qi Spells (Qi Rush)':
    'Section=magic Note="Knows the Qi Rush occult spell/Has a focus pool"',
  'Stumbling Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance gives +1 Deception to Feint, restricts Strikes to stumbling swing attacks, and inflicts off-guard on successful melee attackers against the next stumbling swing attack before the end of the next turn"',
  'Tiger Stance':Pathfinder2E.FEATURES['Tiger Stance'],
  'Wolf Stance':Pathfinder2E.FEATURES['Wolf Stance'],
  'Crushing Grab':Pathfinder2E.FEATURES['Crushing Grab'],
  'Dancing Leaf':Pathfinder2E.FEATURES['Dancing Leaf'],
  'Elemental Fist':
    Pathfinder2E.FEATURES['Elemental Fist']
    .replace('Ki Strike', 'Inner Upheaval')
    .replace('fire', 'fire, slashing'),
  'Shooting Stars Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows using shuriken with unarmed attack features"',
  'Stunning Blows':Pathfinder2E.FEATURES['Stunning Fist'],
  'Cobra Stance':
    'Action=1 ' +
    'Section=combat,save ' +
    'Note=' +
      '"Stance allows only cobra fang attacks",' +
      '"Stance gives resistance %{level//2} to poison and +%{combatNotes.cobraEnvenom?2:1} Fortitude saves and Fortitude DC"',
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
    'Section=combat Note="Weapon Familiarity (Advanced Monk Weapons)"',
  'Advanced Qi Spells (Qi Blast)':
    'Section=magic Note="Knows the Qi Blast occult spell"',
  'Advanced Qi Spells (Shrink The Span)':
    'Section=magic Note="Knows the Shrink The Span occult spell"',
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
    'Note="Successful unarmed strike inflicts +%{level<10?1:level<18?2:3} damage %{level<10?\'die\':\'dice\'}, or +%{level<10?2:level<18?4:6} dice with 3 actions"',
  'Return Fire':
    Pathfinder2E.FEATURES['Arrow Snatching']
    .replace('Arrow', 'Projectile')
    .replace('projectile', 'arrow'),
  'Stumbling Feint':
    'Section=combat ' +
    'Note="Stumbling Stance allows using a free Feint before Flurry Of Blows; success inflicts off-guard from both attacks"',
  'Tiger Slash':Pathfinder2E.FEATURES['Tiger Slash'],
  'Water Step':Pathfinder2E.FEATURES['Water Step'],
  'Whirling Throw':Pathfinder2E.FEATURES['Whirling Throw'],
  'Wolf Drag':Pathfinder2E.FEATURES['Wolf Drag'],
  'Clinging Shadows Initiate':
    'Section=magic Note="Knows the Clinging Shadows Stance occult spell"',
  'Ironblood Stance':Pathfinder2E.FEATURES['Ironblood Stance'],
  'Mixed Maneuver':
    Pathfinder2E.FEATURES['Mixed Maneuver']
    .replace('Shove', 'Reposition, Shove'),
  'Pinning Fire':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Two successful ranged Flurry Of Blows Strikes inflict immobilized (<b>save Reflex</b> negates; successful DC 10 Athletics by the target or an adjacent creature ends)"',
  'Projectile Snatching':
    Pathfinder2E.FEATURES['Arrow Snatching']
    .replace('Arrow', 'Projectile'),
  'Tangled Forest Stance':Pathfinder2E.FEATURES['Tangled Forest Stance'],
  'Wall Run':Pathfinder2E.FEATURES['Wall Run'],
  'Wild Winds Initiate':Pathfinder2E.FEATURES['Wild Winds Initiate'],
  'Cobra Envenom':
    // 'Action=1 ' + // inserted into second note
    'Section=combat,combat ' +
    'Note=' +
      '"Has increased Cobra Stance effects",' +
      '"' + Pathfinder2E.ACTION_MARKS['1'] + ' Strike from Cobra Stance gains +5\' reach and inflicts +1d4 HP persistent poison once per min"',
  'Knockback Strike':Pathfinder2E.FEATURES['Knockback Strike'],
  'Prevailing Position':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Leaving the current stance gives +4 save or Armor Class vs. the triggering damage"',
  'Sleeper Hold':Pathfinder2E.FEATURES['Sleeper Hold'],
  'Wind Jump':Pathfinder2E.FEATURES['Wind Jump'],
  'Winding Flow':Pathfinder2E.FEATURES['Winding Flow'],
  'Disrupt Qi':
    Pathfinder2E.FEATURES['Disrupt Ki']
    .replace('negative', 'void'),
  'Dodging Roll':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Step when in an area affected by area damage gives resistance %{level} to the triggering damage, or resistance %{level+dexterityModifier} if the Step exits the area"',
  'Focused Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Ranged weapon Strike within its first range increment ignores cover and concealment"',
  'Improved Knockback':
    Pathfinder2E.FEATURES['Improved Knockback']
    .replace(/\S* HP bludgeoning/, "1d6 HP bludgeoning per 5' of prevented movement"),
  'Meditative Focus':
    Pathfinder2E.FEATURES['Meditative Focus']
    .replace('2', 'all'),
  'Overwhelming Breath':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent instantaneous monk spell ignores resistance %{level} to physical damage"',
  'Reflexive Stance':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Enters a stance during initiative"',
  'Form Lock':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Athletics check counteracts a polymorph effect affecting a restrained target once per target per day"',
  'Ironblood Surge':Pathfinder2E.FEATURES['Ironblood Surge'],
  'Mountain Quake':Pathfinder2E.FEATURES['Mountain Quake'],
  'Peerless Form':
    'Section=feature,save ' +
    'Note=' +
      '"Does not age",' +
      '"+2 Fortitude/+2 Will"',
  "Shadow's Web":'Section=magic Note="Knows the Shadow\'s Web occult spell"',
  'Tangled Forest Rake':
    Pathfinder2E.FEATURES['Tangled Forest Rake']
   .replace("5'", "10'"),
  'Whirling Blade Stance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Stance allows throwing finesse monk melee weapons 10\' to make multiple ranged Strikes, after which they return"',
  'Wild Winds Gust':Pathfinder2E.FEATURES['Wild Winds Gust'],
  'Fuse Stance':Pathfinder2E.FEATURES['Fuse Stance'],
  // Master Of Many Styles as above
  "Master Qi Spells (Medusa's Wrath)":
    'Section=magic Note="Knows the Medusa\'s Wrath occult spell"',
  'Master Qi Spells (Touch Of Death)':
    'Section=magic Note="Knows the Touch Of Death occult spell"',
  'One-Millimeter Punch':
    'Section=combat ' +
    'Note="One-Inch Punch inflicts a 10\' Push (<b>save Fortitude</b> inflicts a 5\' Push; critical success negates; critical failure inflicts a 20\' Push, or a 30\' Push with 3 actions"',
  'Shattering Strike (Monk)':Pathfinder2E.FEATURES['Shattering Strike'],
  'Diamond Fists':
    Pathfinder2E.FEATURES['Diamond Fists']
    .replace('forceful trait', 'forceful and deadly d10 traits'),
  'Grandmaster Qi Spells (Embrace Nothingness)':
    'Section=magic Note="Knows the Embrace Nothingness occult spell"',
  'Grandmaster Qi Spells (Qi Form)':
    'Section=magic Note="Knows the Qi Form occult spell"',
  'Qi Center':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Casts a 1-action stance qi spell without spending a Focus Point once per min"',
  'Swift River':Pathfinder2E.FEATURES['Swift River'],
  'Triangle Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="While in Monastic Archer Stance, 3 bow Strikes with a -2 penalty against a single target apply Stunning Blows effects and inflict +3d6 HP persistent bleed if all 3 hit"',
  'Enduring Quickness':Pathfinder2E.FEATURES['Enduring Quickness'],
  'Godbreaker':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Successful unarmed Strike after throwing a grappled foe upward 20\' also inflicts falling damage and allows repeating twice; hitting with all 3 Strikes inflicts additional unarmed Strike damage, retains grapple, and negates falling damage to self"',
  'Immortal Techniques':
    'Section=combat ' +
    'Note="First use of a monk stance action each rd gives 20 temporary Hit Points until the start of the next turn"',
  'Impossible Technique':Pathfinder2E.FEATURES['Impossible Technique'],
  'Lightning Qi':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Reduces the number of actions required to cast a subsequent qi spell by 1 once per 10 min"',

  // Oracle
  'Ancestors':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of Ancestral Meddling feature",' +
      '"Has the Whispers Of Weakness feature",' +
      '"Knows the Ancestral Touch divine spell",' +
      '"Skill Trained (Society)"',
  'Battle':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of The Mortal Warrior feature",' +
      '"Has the Oracular Warning feature",' +
      '"Knows the Weapon Trance divine spell",' +
      '"Skill Trained (Athletics)"',
  'Bones':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of Living Death feature",' +
      '"Has the Nudge The Scales feature",' +
      '"Knows the Soul Siphon divine spell",' +
      '"Skill Trained (Medicine)"',
  'Cosmos':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of The Sky\'s Call feature",' +
      '"Has the Oracular Warning and feature",' +
      '"Knows the Spray Of Stars divine spell",' +
      '"Skill Trained (Nature)"',
  'Curse Of Ancestral Meddling':
    'Section=combat ' +
    'Note="Cursebound inflicts clumsy of equal severity"',
  'Curse Of Engulfing Flames':
    'Section=combat,feature ' +
    'Note=' +
      '"Cursebound inflicts persistent fire damage of equal severity",' +
      '"Shows aspects of heat and flame"',
  'Curse Of Inclement Headwinds':
    'Section=ability,combat,feature,save ' +
    'Note=' +
      '"Cursebound 4 inflicts -10\' Speed",' +
      '"Cursebound 2 inflicts -2 ranged attacks",' +
      '"Shows aspects of weather",' +
      '"Cursebound 1 and 3 inflict weakness 2 and weakness %{5+level} to electricity"',
  'Curse Of Living Death':
    'Section=feature,save ' +
    'Note=' +
      '"Shows aspects of death and decay",' +
      '"Cursebound 1, 2, 3, and 4 inflict weakness 2 to vitality and void damage, -1 Fortitude saves, weakness %{5+level} to vitality and void damage, and -2 Fortitude saves"',
  'Curse Of Outpouring Life':
    'Section=combat,feature ' +
    'Note=' +
      '"Regains %{level} * cursebound severity fewer Hit Points from magical healing",' +
      '"Presence causes minor healing and vitality effects"',
  'Curse Of The Mortal Warrior':
    'Section=feature,save ' +
    'Note=' +
      '"Smells of steel and blood and appears more muscular than actual",' +
      '"Cursebound 1, 2, 3, and 4 inflict weakness 2 to spell damage, -1 saves vs. spells, weakness %{level} to spell damage, and -2 saves vs. spells"',
  "Curse Of The Sky's Call":
    'Section=combat,feature,save ' +
    'Note=' +
      '"Cursebound inflicts enfeebled of equal severity",' +
      '"Has eyes that glow and hair and clothing that floats",' +
      '"Suffers a penalty vs. forced movement equal to the current cursebound severity"',
  'Curse Of Torrential Knowledge':
    'Section=combat,feature,save,skill ' +
    'Note=' +
      '"Cursebound 4 prevents communication and inflicts stupefied 1",' +
      '"Shows effects of overflowing knowledge",' +
      '"Cursebound inflicts a penalty to Will saves of equal severity",' +
      '"Cursebound inflicts a penalty to Perception of equal severity"',
  'Flames':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of Engulfing Flames feature",' +
      '"Has the Foretell Harm feature",' +
      '"Knows the Incendiary Aura divine spell",' +
      '"Skill Trained (Acrobatics)"',
  'Life':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of Outpouring Life feature",' +
      '"Has the Nudge The Scales feature",' +
      '"Knows the Life Link divine spell",' +
      '"Skill Trained (Medicine)"',
  'Lore':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of Torrential Knowledge feature",' +
      '"Has the Whispers Of Weakness feature",' +
      '"Knows the Brain Drain divine spell",' +
      '"Skill Trained (Occultism; choose 1 from any Lore)"',
  'Oracular Clarity':'Section=magic Note="Has 1 10th-rank spell slot"',
  'Tempest':
    'Section=feature,feature,magic,skill ' +
    'Note=' +
      '"Has the Curse Of Inclement Headwinds feature",' +
      '"Has the Foretell Harm feature",' +
      '"Knows the Tempest Touch divine spell",' +
      '"Skill Trained (Nature)"',
  // Expert Spellcaster as above
  'Divine Access':
    'Section=magic ' +
    'Note="Can learn 3 cleric spells from a deity with a shared domain"',
  'Extreme Curse':'Section=magic Note="Can tolerate cursebound severity 4"',
  'Greater Mysterious Resolve':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Will)",' +
      '"Successes on Will saves are critical successes, critical failures on Will saves are normal failures, and failed Will saves inflict half damage"',
  // Light Armor Expertise as above
  'Major Curse':'Section=magic Note="Can tolerate cursebound severity 3"',
  // Master Spellcaster as above
  'Mysterious Resolve':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will saves are critical successes"',
  'Mystery':'Section=feature Note="1 selection"',
  'Ocular Clarity':'Section=magic Note="Knows 2 10th-level divine spells"',
  'Oracular Curse':
    'Section=feature ' +
    'Note="Suffers from a mystery-linked curse and a cursebound condition"',
  'Oracular Senses':'Section=skill Note="Perception Expert"',
  'Oracle Feats':'Section=feature Note="%V selections"',
  'Oracle Skills':
    'Section=skill Note="Skill Trained (Religion; Choose %V from any)"',
  'Oracle Spellcasting':
    'Section=magic Note="Can learn spells from the divine tradition"',
  "Premonition's Reflexes":'Section=save Note="Save Expert (Reflex)"',
  'Revelation Spells':'Section=magic Note="Has a focus pool"',
  // Signature Spells as above
  // Weapon Expertise as above
  // Weapon Specialization as above

  'Foretell Harm':
    'Action=Free ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> Target of a damaging non-cantrip spell takes additional damage equal to the spell rank at the beginning of its turn once per rd, once per target per day"',
  'Glean Lore':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Successful Religion check gives 1 true and 1 false piece of info about a desired topic, critical success gives accurate info or a clue, and failure or critical failure gives 1 or 2 pieces of incorrect info or misleading clues"',
  'Nudge The Scales':
    // in note 'Action=1 ' +
    'Section=magic,magic ' +
    'Note=' +
      '"' + Pathfinder2E.ACTION_MARKS['1'] + ' <b>(Cursebound)</b> R30\' Target regains %{level*2+2} Hit Points",' +
      '"Can choose during daily prep to be healed by vitality healing or void healing"',
  'Oracular Warning':
    'Action=Free ' +
    'Section=feature ' +
    'Note="<b>(Cursebound)</b> R20\' At the start of initiative, gives allies +2 initiative, or +3 or +4 initiative with cursebound 2 or 3, and %{level//2} temporary Hit Points for 1 min"',
  // Reach Spell as above
  'Whispers Of Weakness':
    'Action=1 ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> R60\' Reveals target weakness and its lowest saving throw and gives self +2 to the next attack before the end of the turn once per target per day"',
  // Widen Spell as above
  // Cantrip Expansion as above
  'Divine Aegis':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Upon attempting a save vs. magic, gives self +1 vs. non-divine magical effects and -1 vs. divine effects until the start of the next turn"',
  'Domain Acumen (Air)':
    Pathfinder2E.FEATURES['Domain Initiate (Air)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Ambition)':
    Pathfinder2E.FEATURES['Domain Initiate (Ambition)']
    .replace(/\/[^"]*/, '')
    .replace('Blind', 'Ignite'),
  'Domain Acumen (Cities)':
    Pathfinder2E.FEATURES['Domain Initiate (Cities)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Confidence)':
    Pathfinder2E.FEATURES['Domain Initiate (Confidence)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Creation)':
    Pathfinder2E.FEATURES['Domain Initiate (Creation)']
    .replace(/\/[^"]*/, '')
    .replace('Splash Of Art', 'Creative Splash'),
  'Domain Acumen (Darkness)':
    Pathfinder2E.FEATURES['Domain Initiate (Darkness)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Death)':
    Pathfinder2E.FEATURES['Domain Initiate (Death)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Destruction)':
    Pathfinder2E.FEATURES['Domain Initiate (Destruction)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Dreams)':
    Pathfinder2E.FEATURES['Domain Initiate (Dreams)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Earth)':
    Pathfinder2E.FEATURES['Domain Initiate (Earth)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Family)':
    Pathfinder2E.FEATURES['Domain Initiate (Family)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Fate)':
    Pathfinder2E.FEATURES['Domain Initiate (Fate)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Fire)':
    Pathfinder2E.FEATURES['Domain Initiate (Fire)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Freedom)':
    Pathfinder2E.FEATURES['Domain Initiate (Freedom)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Healing)':
    Pathfinder2E.FEATURES['Domain Initiate (Healing)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Indulgence)':
    Pathfinder2E.FEATURES['Domain Initiate (Indulgence)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Luck)':
    Pathfinder2E.FEATURES['Domain Initiate (Luck)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Magic)':
    Pathfinder2E.FEATURES['Domain Initiate (Magic)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Might)':
    Pathfinder2E.FEATURES['Domain Initiate (Might)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Moon)':
    Pathfinder2E.FEATURES['Domain Initiate (Moon)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Nature)':
    Pathfinder2E.FEATURES['Domain Initiate (Nature)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Nightmares)':
    Pathfinder2E.FEATURES['Domain Initiate (Nightmares)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Pain)':
    Pathfinder2E.FEATURES['Domain Initiate (Pain)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Passion)':
    Pathfinder2E.FEATURES['Domain Initiate (Passion)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Perfection)':
    Pathfinder2E.FEATURES['Domain Initiate (Perfection)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Protection)':
    Pathfinder2E.FEATURES['Domain Initiate (Protection)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Secrecy)':
    Pathfinder2E.FEATURES['Domain Initiate (Secrecy)']
    .replace(/\/[^"]*/, '')
    .replace('Forced', 'Whispering'),
  'Domain Acumen (Sun)':
    Pathfinder2E.FEATURES['Domain Initiate (Sun)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Travel)':
    Pathfinder2E.FEATURES['Domain Initiate (Travel)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Trickery)':
    Pathfinder2E.FEATURES['Domain Initiate (Trickery)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Truth)':
    Pathfinder2E.FEATURES['Domain Initiate (Truth)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Tyranny)':
    Pathfinder2E.FEATURES['Domain Initiate (Tyranny)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Undeath)':
    Pathfinder2E.FEATURES['Domain Initiate (Undeath)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Water)':
    Pathfinder2E.FEATURES['Domain Initiate (Water)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Wealth)':
    Pathfinder2E.FEATURES['Domain Initiate (Wealth)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Zeal)':
    Pathfinder2E.FEATURES['Domain Initiate (Zeal)']
    .replace(/\/[^"]*/, ''),
  'Domain Acumen (Decay)':
    'Section=magic Note="Knows the Withering Grasp divine spell"',
  'Domain Acumen (Dust)':'Section=magic Note="Knows the Parch divine spell"',
  'Domain Acumen (Duty)':
    'Section=magic Note="Knows the Swear Oath divine spell"',
  'Domain Acumen (Lightning)':
    'Section=magic Note="Knows the Charged Javelin divine spell"',
  'Domain Acumen (Nothingness)':
    'Section=magic Note="Knows the Empty Inside divine spell"',
  'Domain Acumen (Soul)':
    'Section=magic Note="Knows the Eject Soul divine spell"',
  'Domain Acumen (Star)':
    'Section=magic Note="Knows the Zenith Star divine spell"',
  'Domain Acumen (Vigil)':
    'Section=magic Note="Knows the Object Memory divine spell"',
  'Meddling Futures':
    'Action=Free ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> Randomly gives self a Strike with +1 attack and +2 damage, a +1 Perception check or skill action, a spell cast with increased damage or healing equal to the spell rank, or a +10\' Stride; cursebound 3 increases these bonuses to +6 damage, +2 check, spell rank + 3 damage or healing, or +20\' Speed, and using a different action requires a successful DC 6 flat check"',
  // Bespell Strikes as above
  'Knowledge Of Shapes':
    'Action=Free ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> Uses Reach Spell or Widen Spell"',
  'Thousand Visions':
    'Action=Free ' +
    'Section=skill ' +
    'Note="<b>(Cursebound)</b> R30\' Can target concealed or hidden creatures with no flat check or a DC 5 flat check, does not suffer off-guard from hidden creatures, and senses beyond 30\' become imprecise, for 1 min"',
  'Advanced Revelation (Ancestors)':
    'Section=magic Note="Knows the Ancestral Defense divine spell"',
  'Advanced Revelation (Battle)':
    'Section=magic Note="Knows the Battlefield Persistence divine spell"',
  'Advanced Revelation (Bones)':
    'Section=magic Note="Knows the Armor Of Bones divine spell"',
  'Advanced Revelation (Cosmos)':
    'Section=magic Note="Knows the Interstellar Void divine spell"',
  'Advanced Revelation (Flames)':
    'Section=magic Note="Knows the Whirling Flames divine spell"',
  'Advanced Revelation (Life)':
    'Section=magic Note="Knows the Delay Affliction divine spell"',
  'Advanced Revelation (Lore)':
    'Section=magic Note="Knows the Access Lore divine spell"',
  'Advanced Revelation (Tempest)':
    'Section=magic Note="Knows the Thunderburst divine spell"',
  'Gifted Power':
    'Section=magic Note="+1 rank %V spell slot for a mystery granted spell"',
  'Spiritual Sense':
    'Section=skill ' +
    'Note="Makes an automatic check to find spirit creatures while exploring, and can notice spirits within 30\' that are up to 5\' deep within objects"',
  // Steady Spellcasting as above
  'Debilitating Dichotomy':
    'Action=2 ' +
    'Section=combat ' +
    'Note="<b>(Cursebound)</b> R30\' Inflicts %{((level//2)-1)*3}d6 HP mental on self and target (<b>save basic Fortitude</b>; self improves save by 1 step; critical failure also inflicts stunned 1)"',
  'Read Disaster':
    'Section=magic ' +
    'Note="%{rank.Religion>=4?1:10} min contemplation reveals whether the results of a proposed action up to 30 min in the future will be generally bad"',
  'Surging Might':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent spell ignores resistance %{level} to spirit, vitality, and void"',
  'Water Walker':
    'Section=magic ' +
    'Note="Cursebound 1 allows Striding across liquids to a solid destination, and cursebound 2 allows walking on liquids as if they were solid"',
  // Quickened Casting as above
  'Roll The Bones Of Fate':
    'Action=1 ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> R30\' Randomly causes 1 of 4 effects once per 10 min: gives self or an ally the better of 2 rolls on the next attack or skill check; inflicts on a target the worse of 2 rolls on the next attack or skill check (<b>save Will</b> negates); both of the previous; forces all within range to roll twice on their next attack or skill check, giving the better roll if the higher is even and the worse if it is odd"',
  'The Dead Walk':
    'Action=2 ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> R30\' 2 spell attacks (cursebound 2 or 3 gives 3 or 4 attacks) each inflict 4d6 HP spirit and can flank with allies or each other"',
  'Trial By Skyfire':
    'Action=1 ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> 10\' emanation inflicts 2d6 HP fire (cursebound 3 inflicts 4d6 HP in a 15\' emanation) (<b>save basic Reflex</b>) at the end of each turn for 1 min; a Sustain suppresses the effects for 1 rd"',
  'Waters Of Creation':
    'Action=2 ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> 15\' emanation restores %{level//2}d6 Hit Points (cursebound 3 restores %{level//2}d8 Hit Points)"',
  'Domain Fluency (Air)':Pathfinder2E.FEATURES['Advanced Domain (Air)'],
  'Domain Fluency (Ambition)':
    Pathfinder2E.FEATURES['Advanced Domain (Ambition)'],
  'Domain Fluency (Cities)':
    Pathfinder2E.FEATURES['Advanced Domain (Cities)']
    .replace('The City', 'Civilization'),
  'Domain Fluency (Confidence)':
    Pathfinder2E.FEATURES['Advanced Domain (Confidence)'],
  'Domain Fluency (Creation)':
    Pathfinder2E.FEATURES['Advanced Domain (Creation)'],
  'Domain Fluency (Darkness)':
    Pathfinder2E.FEATURES['Advanced Domain (Darkness)']
    .replace('Eyes', 'Sight'),
  'Domain Fluency (Death)':Pathfinder2E.FEATURES['Advanced Domain (Death)'],
  'Domain Fluency (Destruction)':
    Pathfinder2E.FEATURES['Advanced Domain (Destruction)'],
  'Domain Fluency (Dreams)':Pathfinder2E.FEATURES['Advanced Domain (Dreams)'],
  'Domain Fluency (Earth)':Pathfinder2E.FEATURES['Advanced Domain (Earth)'],
  'Domain Fluency (Family)':Pathfinder2E.FEATURES['Advanced Domain (Family)'],
  'Domain Fluency (Fate)':Pathfinder2E.FEATURES['Advanced Domain (Fate)'],
  'Domain Fluency (Fire)':Pathfinder2E.FEATURES['Advanced Domain (Fire)'],
  'Domain Fluency (Freedom)':Pathfinder2E.FEATURES['Advanced Domain (Freedom)'],
  'Domain Fluency (Healing)':Pathfinder2E.FEATURES['Advanced Domain (Healing)'],
  'Domain Fluency (Indulgence)':
    Pathfinder2E.FEATURES['Advanced Domain (Indulgence)'],
  'Domain Fluency (Knowledge)':
    Pathfinder2E.FEATURES['Advanced Domain (Knowledge)'],
  'Domain Fluency (Luck)':Pathfinder2E.FEATURES['Advanced Domain (Luck)'],
  'Domain Fluency (Magic)':Pathfinder2E.FEATURES['Advanced Domain (Magic)'],
  'Domain Fluency (Might)':Pathfinder2E.FEATURES['Advanced Domain (Might)'],
  'Domain Fluency (Moon)':Pathfinder2E.FEATURES['Advanced Domain (Moon)'],
  'Domain Fluency (Nature)':Pathfinder2E.FEATURES['Advanced Domain (Nature)'],
  'Domain Fluency (Nightmares)':
    Pathfinder2E.FEATURES['Advanced Domain (Nightmares)'],
  'Domain Fluency (Pain)':Pathfinder2E.FEATURES['Advanced Domain (Pain)'],
  'Domain Fluency (Passion)':Pathfinder2E.FEATURES['Advanced Domain (Passion)'],
  'Domain Fluency (Perfection)':
    Pathfinder2E.FEATURES['Advanced Domain (Perfection)']
    .replace('Form', 'Body'),
  'Domain Fluency (Protection)':
    Pathfinder2E.FEATURES['Advanced Domain (Protection)'],
  'Domain Fluency (Secrecy)':Pathfinder2E.FEATURES['Advanced Domain (Secrecy)'],
  'Domain Fluency (Sun)':
    Pathfinder2E.FEATURES['Advanced Domain (Sun)']
    .replace('Positive', 'Vital'),
  'Domain Fluency (Travel)':Pathfinder2E.FEATURES['Advanced Domain (Travel)'],
  'Domain Fluency (Trickery)':
    Pathfinder2E.FEATURES['Advanced Domain (Trickery)'],
  'Domain Fluency (Truth)':Pathfinder2E.FEATURES['Advanced Domain (Truth)'],
  'Domain Fluency (Tyranny)':Pathfinder2E.FEATURES['Advanced Domain (Tyranny)'],
  'Domain Fluency (Undeath)':Pathfinder2E.FEATURES['Advanced Domain (Undeath)'],
  'Domain Fluency (Water)':Pathfinder2E.FEATURES['Advanced Domain (Water)'],
  'Domain Fluency (Wealth)':Pathfinder2E.FEATURES['Advanced Domain (Wealth)'],
  'Domain Fluency (Zeal)':Pathfinder2E.FEATURES['Advanced Domain (Zeal)'],
  'Domain Fluency (Decay)':
    'Section=magic Note="Knows the Fallow Field divine spell"',
  'Domain Fluency (Dust)':
    'Section=magic Note="Knows the Dust Storm divine spell"',
  'Domain Fluency (Duty)':
    'Section=magic Note="Knows the Dutiful Challenge divine spell"',
  'Domain Fluency (Lightning)':
    'Section=magic Note="Knows the Bottle The Storm divine spell"',
  'Domain Fluency (Nothingness)':
    'Section=magic Note="Knows the Door To Beyond divine spell"',
  'Domain Fluency (Soul)':
    'Section=magic Note="Knows the Ectoplasmic Interstice divine spell"',
  'Domain Fluency (Star)':
    'Section=magic Note="Knows the Asterism divine spell"',
  'Domain Fluency (Vigil)':
    'Section=magic Note="Knows the Remember The Lost divine spell"',
  'Epiphany At The Crossroads':
    'Action=Free ' +
    'Section=magic ' +
    'Note="While dying, gains the effects of an <i>Augury</i>, loses the dying condition, gains a wounded level, regains %{level*2} Hit Points, and can Stand once per day"',
  'Greater Revelation (Ancestors)':
    'Section=magic Note="Knows the Ancestral Form divine spell"',
  'Greater Revelation (Battle)':
    'Section=magic Note="Knows the Revel In Retribution divine spell"',
  'Greater Revelation (Bones)':
    'Section=magic Note="Knows the Claim Undead divine spell"',
  'Greater Revelation (Cosmos)':
    'Section=magic Note="Knows the Moonlight Bridge divine spell"',
  'Greater Revelation (Flames)':
    'Section=magic Note="Knows the Flaming Fusillade divine spell"',
  'Greater Revelation (Life)':
    'Section=magic Note="Knows the Life-Giving Form divine spell"',
  'Greater Revelation (Lore)':
    'Section=magic Note="Knows the Dread Secret divine spell"',
  'Greater Revelation (Tempest)':
    'Section=magic Note="Knows the Tempest Form divine spell"',
  // Magic Sense as above
  'Forestall Curse':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Subsequent cursebound ability use does not increase cursebound severity once per day"',
  'Lighter Than Air':
    'Section=magic ' +
    'Note="Cursebound gives %{speed>?20}\' fly Speed, or %{(speed>?20)+10}\' fly Speed with cursebound 3"',
  'Mysterious Repertoire':
    'Section=magic Note="Knows 1 spell from a different tradition"',
  "Revelation's Focus":'Section=magic Note="Refocus restores all Focus Points"',
  'Conduit Of Void And Vitality':
    'Action=2 ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> Casting a 3-action signature <i>Harm</i> or <i>Heal</i> restores or inflicts on 1 target additional Hit Points equal to 1d8 * cursebound severity"',
  'Diverse Mystery':
    'Section=magic ' +
    'Note="Can cast an initial or advanced revelation spell from another mystery, increasing cursebound severity and suffering the mystery\'s cursebound 1 effects"',
  'Portentous Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note=' +
      '"Subsequent spell inflicts -2 on reaction attacks and skill tests, plus fascinated until the start of the next turn on any targets that suffer damage or fail to save"',
  'Blaze Of Revelation':
    'Action=Free ' +
    'Section=magic ' +
    'Note="While at cursebound 4, can cast 1 revelation spell each rd without spending Focus Points for 1 min; afterward, must attempt a DC 40 Fortitude save, suffering drained 2 until next daily prep, drained 4 until next daily prep, or death on success, failure, or critical failure"',
  'Divine Effusion':
    Pathfinder2E.FEATURES['Greater Vital Evolution']
    .replaceAll('level', 'rank'),
  'Mystery Conduit':
    'Action=Free ' +
    'Section=magic ' +
    'Note="<b>(Cursebound)</b> Subsequent casting of an instantaneous spell of up to rank 5 does not expend a spell slot"',
  'Oracular Providence':'Section=magic Note="+1 10th rank spell slot"',
  'Paradoxical Mystery':
   'Section=magic ' +
   'Note="Can select 1 spell from an accessible domain during daily prep to cast as a revelation spell"',

  // Sorcerer
  'Aberrant':
    Pathfinder2E.FEATURES.Aberrant
    .replace('self or a target +2', 'self +2 or a target -1'),
  'Angelic':Pathfinder2E.FEATURES.Angelic,
  'Bloodline':Pathfinder2E.FEATURES.Bloodline,
  'Bloodline Paragon':
    Pathfinder2E.FEATURES['Bloodline Paragon']
    .replace('level', 'rank'),
  'Bloodline Spells':
    Pathfinder2E.FEATURES['Bloodline Spells']
    .replace(' and 1 Focus Point', '')
    .replace('granted', 'sorcerous gift'),
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
    .replace('bludgeoning', 'slashing')
    .replace('level', 'rank'),
  'Elemental (Earth)':
    Pathfinder2E.FEATURES['Elemental (Earth)']
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Elemental (Fire)':
    Pathfinder2E.FEATURES['Elemental (Fire)']
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Elemental (Metal)':
    Pathfinder2E.FEATURES['Elemental (Air)']
    .replace('+1', '+2')
    .replace('bludgeoning', 'piercing')
    .replace('level', 'rank'),
  'Elemental (Water)':
    Pathfinder2E.FEATURES['Elemental (Water)']
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Elemental (Wood)':
    Pathfinder2E.FEATURES['Elemental (Earth)']
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Fey':
    Pathfinder2E.FEATURES.Fey
    .replace('self or a target', 'self +2 Performance or'),
  'Hag':
    Pathfinder2E.FEATURES.Hag
    .replace('2 HP', '4 HP')
    .replace('level', 'rank')
    .replace('next turn', 'next turn; if no attacks succeed, gives self temporary Hit Points equal to the spell rank until the beginning of the following turn'),
  'Imperial':
    Pathfinder2E.FEATURES.Imperial
    .replace('self or a target', 'self +1 Armor Class or'),
  'Undead':
    Pathfinder2E.FEATURES.Undead
    .replace('negative', 'void')
    .replace('for 1 rd', 'until the start of the next turn')
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
    'Section=magic ' +
    'Note="Triggering casting by another of a%{sorcererTraditions=~\'^[AO]\'?\'n\':\'\'} %{sorcererTraditionsLowered} spell targeting self invokes a blood magic effect that targets self or the caster"',
  // Familiar as above
  // Reach Spell as above
  'Tap Into Blood (Arcane)':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Uses Arcana in place of the associated skill for a Recall Knowledge check while benefiting from blood magic"',
  'Tap Into Blood (Divine)':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Steps or Repositions a target using Religion for the check while benefiting from blood magic"',
  'Tap Into Blood (Occult)':
    'Action=1 Section=combat Note="Takes a 10\' Step while benefiting from blood magic"',
  'Tap Into Blood (Primal)':
    'Action=1 Section=combat Note="Uses Nature for a Demoralize check while benefiting from blood magic"',
  // Widen Spell as above
  'Anoint Ally':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Allows transferring blood magic effects to a chosen ally for 1 min"',
  'Bleed Out':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Immediately after gaining a blood magic effect, a successful R60\' ranged spell attack also inflicts persistent bleed damage equal to the rank of the prior spell"',
  // Cantrip Expansion as above
  // Enhanced Familiar as above
  'Propelling Sorcery':
    'Section=magic ' +
    'Note="Blood magic effect allows Stepping as a free action or moving a target 5\'"',
  'Arcane Evolution':Pathfinder2E.FEATURES['Arcane Evolution'],
  // Bespell Strikes as above
  'Divine Evolution':Pathfinder2E.FEATURES['Divine Evolution'],
  'Occult Evolution':Pathfinder2E.FEATURES['Occult Evolution'],
  'Primal Evolution':Pathfinder2E.FEATURES['Primal Evolution'],
  'Split Shot':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Adds a second target, inflicting half the initial damage, to a single-target instantaneous attack spell"',
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
    'Note="Immediately after casting a non-cantrip spell, gains +1 Armor Class vs. ranged weapons until the start of the next turn"',
  'Energy Ward':
    'Action=Free ' +
    'Section=magic ' +
    'Note="Immediately after casting a non-cantrip energy damage spell, gains resistance equal to 4 + the spell rank to a choice of energy until the start of the next turn once per turn"',
  'Safeguard Spell':
    'Action=1 Section=magic Note="Subsequent area spell does not affect self"',
  'Spell Relay':
    'Action=Reaction ' +
    'Section=magic ' +
    'Note="Allows an ally to cast the triggering spell with self as the origin"',
  // Steady Spellcasting as above
  'Bloodline Resistance':Pathfinder2E.FEATURES['Bloodline Resistance'],
  // Changed effects
  'Crossblooded Evolution (Aberrant)':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Aberrant, 'Note')[1] + '"')
    .replace('self or a target +2', 'self +2 or a target -1'),
  'Crossblooded Evolution (Angelic)':
    'Section=magic ' +
    'Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Angelic, 'Note')[1] + '"',
  'Crossblooded Evolution (Demonic)':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Demonic, 'Note')[1] + '"')
    .replace('+1', '+2'),
  'Crossblooded Evolution (Diabolic)':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Diabolic, 'Note')[1] + '"')
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Crossblooded Evolution (Draconic)':
    'Section=magic ' +
    'Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES['Draconic (Brass)'], 'Note')[1] + '"',
  'Crossblooded Evolution (Elemental (Air))':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES['Elemental (Air)'], 'Note')[1] + '"')
    .replace('+1', '+2')
    .replace('bludgeoning', 'slashing')
    .replace('level', 'rank'),
  'Crossblooded Evolution (Elemental (Earth))':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES['Elemental (Earth)'], 'Note')[1] + '"')
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Crossblooded Evolution (Elemental (Fire))':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES['Elemental (Fire)'], 'Note')[1] + '"')
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Crossblooded Evolution (Elemental (Metal))':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES['Elemental (Air)'], 'Note')[1] + '"')
    .replace('+1', '+2')
    .replace('bludgeoning', 'piercing')
    .replace('level', 'rank'),
  'Crossblooded Evolution (Elemental (Water))':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES['Elemental (Water)'], 'Note')[1] + '"')
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Crossblooded Evolution (Elemental (Wood))':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES['Elemental (Earth)'], 'Note')[1] + '"')
    .replace('+1', '+2')
    .replace('level', 'rank'),
  'Crossblooded Evolution (Fey)':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Fey, 'Note')[1] + '"')
    .replace('self or a target', 'self +2 Performance or'),
  'Crossblooded Evolution (Hag)':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Hag, 'Note')[1] + '"')
    .replace('2 HP', '4 HP')
    .replace('level', 'rank')
    .replace('next turn', 'next turn; if no attacks succeed, gives self temporary Hit Points equal to the spell rank until the beginning of the following turn'),
  'Crossblooded Evolution (Imperial)':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Imperial, 'Note')[1] + '"')
    .replace('self or a target', 'self +1 Armor Class or'),
  'Crossblooded Evolution (Undead)':
    'Section=magic ' +
    ('Note="' + QuilvynUtils.getAttrValueArray(Pathfinder2E.FEATURES.Undead, 'Note')[1] + '"')
    .replace('negative', 'void')
    .replace('for 1 rd', 'until the start of the next turn')
    .replaceAll('level', 'rank'),
  'Explosion Of Power':
    'Section=magic ' +
    'Note="Blood magic effect inflicts 1d6 HP %{sorcererTraditions=~\'Arcane\'?\'force\':sorcererTraditions=~\'Divine\'?\'spirit\':sorcererTraditions=~\'Occult\'?\'mental\':\'fire\'} per spell rank (<b>save basic Reflex</b>) in a 5\' emanation"',
  'Energy Fusion':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Expends 2 spell slots to increase a subsequent spell\'s energy damage by another spell\'s rank; the total damage is split evenly between the energy types inflicted by the 2 spells"',
  'Greater Bloodline (Aberrant)':
    Pathfinder2E.FEATURES['Greater Bloodline (Aberrant)'],
  'Greater Bloodline (Angelic)':
    Pathfinder2E.FEATURES['Greater Bloodline (Angelic)'],
  'Greater Bloodline (Demonic)':
    Pathfinder2E.FEATURES['Greater Bloodline (Demonic)']
    .replace('Abyssal', 'Chthonian'),
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
    'Note="When casting a bloodline or sorcerous gift spell, can suffer Hit Point loss equal to twice the spell rank to gain 2 blood magic effects"',
  'Bloodline Focus':
    Pathfinder2E.FEATURES['Bloodline Focus']
    .replace('2', 'all'),
  'Greater Physical Evolution':
    'Section=magic ' +
    'Note="Can expend a spell slot to cast a common polymorph battle form spell as a signature spell once per day"',
  'Greater Spiritual Evolution':
    'Section=magic ' +
    'Note="Spells have the <i>ghost touch</i> property"',
  'Magic Sense':
    Pathfinder2E.FEATURES['Magic Sense']
    .replaceAll('level', 'rank'),
  'Terraforming Trickery':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Blood magic effect creates or removes difficult terrain in adjacent squares"',
  'Blood Ascendancy':
    'Section=magic Note="Blood Rising can invoke 2 blood magic effects"',
  'Interweave Dispel':Pathfinder2E.FEATURES['Interweave Dispel'],
  'Reflect Harm':
    'Section=magic ' +
    'Note="Blood magic effect allows responding with a spell attack to the first spell damage suffered by self before the start of the next turn; success inflicts equal damage on the caster, or twice the damage with a critical hit"',
  'Spell Shroud':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Subsequent spell cast on self creates a 15\' emanation that conceals creatures until the start of the next turn"',
  // Effortless Concentration as above
  'Greater Mental Evolution':
    Pathfinder2E.FEATURES['Greater Mental Evolution']
    .replace('level', 'rank'),
  'Greater Vital Evolution':
    Pathfinder2E.FEATURES['Greater Vital Evolution']
    .replaceAll('level', 'rank'),
  // Scintillating Spell as above
  'Echoing Spell':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Casts a subsequent instantaneous spell of up to 4th rank a second time before the end of the next turn without using another spell slot"',
  // Changed effects
  'Greater Crossblooded Evolution':
    'Section=magic ' +
    'Note="Adds 3 sorcerous gift spells from a secondary bloodline, heightened to maximum rank, to spell repertoire"',
  'Bloodline Conduit':
    Pathfinder2E.FEATURES['Bloodline Conduit']
    .replace('level', 'rank'),
  'Bloodline Mutation':
    'Section=feature ' +
    'Note="Gains low-light vision, darkvision, flight, swimming, water breathing, and/or resistance 20 to an energy type as appropriate for bloodline"',
  'Bloodline Perfection':
    Pathfinder2E.FEATURES['Bloodline Perfection']
    .replace('level', 'rank'),
  // Spellshape Mastery as above

  // Swashbuckler
  'Assured Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Legendary (Reflex)",' +
      '"Critical failures on Reflex saves are normal failures, and failed Reflex saves inflict half damage"',
  'Battledancer':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Fascinating Performance feature",' +
      '"Skill Trained (Performance)",' +
      '"Perform actions have the bravado trait"',
  'Braggart':
    'Section=combat,skill ' +
    'Note=' +
      '"Demoralize actions have the bravado trait",' +
      '"Skill Trained (Intimidation)"',
  'Confident Evasion':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Reflex)",' +
      '"Successes on Reflex saves are critical successes"',
  'Confident Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike with an agile or finesse weapon inflicts %{combatNotes.preciseFinisher?\'full\':\'half of\'} Precise Strike precision damage on failure"',
  'Continuous Flair':
    'Section=skill ' +
    'Note="Stylish Combatant bonus applies during exploration"',
  'Eternal Confidence':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Master (Swashbuckler)",' +
      '"Finisher and Opportune Riposte Strikes with agile and finesse weapons gain the Confident Finisher failure effect"',
  'Exemplary Finisher (Battledancer)':
    'Section=combat ' +
    'Note="Successful finisher Strike allows a free Step afterward"',
  'Exemplary Finisher (Braggart)':
    'Section=combat ' +
    'Note="Successful finisher Strike ends any temporary immunity to self Demoralize"',
  'Exemplary Finisher (Fencer)':
    'Section=combat ' +
    'Note="Successful finisher Strike inflicts off-guard until the start of the next turn"',
  'Exemplary Finisher (Gymnast)':
    'Section=combat ' +
    'Note="Successful finisher Strike on a grabbed, restrained, or prone target inflicts additional damage equal to double the number of damage dice"',
  'Exemplary Finisher (Rascal)':
    'Section=combat ' +
    'Note="Successful finisher Strike inflicts -10 Speed until the start of the next turn"',
  'Exemplary Finisher (Wit)':
    'Section=combat ' +
    'Note="Successful finisher Strike inflicts -2 attacks on self until the start of the next turn"',
  'Fencer':
    'Section=combat,skill ' +
    'Note=' +
      '"Create A Distraction and Feint actions have the bravado trait",' +
      '"Skill Trained (Deception)"',
  // Fortitude Expertise as above
  // Greater Weapon Specialization as above
  'Gymnast':
    'Section=combat,skill ' +
    'Note=' +
      '"Grapple, Reposition, Shove, and Trip actions have the bravado trait",' +
      '"Skill Trained (Athletics)"',
  'Keen Flair':
    'Section=combat ' +
    'Note="Strikes with a master proficiency weapon critically succeed on a 19"',
  // Light Armor Expertise as above
  // Light Armor Mastery as above
  'Opportune Riposte':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="<b>(Bravado)</b> Strikes or attempts to Disarm the attacker in response to the triggering critical miss"',
  'Panache':
    'Section=combat ' +
    'Note="Tumble Through and other bravado actions give panache that enables finisher actions"',
  // Perception Mastery as above
  'Precise Strike':
    'Section=combat ' +
    'Note="Strikes with agile and finesse weapons inflict +%{levels.Swashbuckler?(level+7)//4:1} HP precision, or +%{levels.Swashbuckler?(level+7)//4:1}d6 HP precision with finisher Strikes"',
  'Rascal':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Dirty Trick feature",' +
      '"Skill Trained (Thievery)",' +
      '"Dirty Trick actions have the bravado trait"',
  'Reinforced Ego':
    'Section=save,save ' +
    'Note=' +
      '"Save Master (Will)",' +
      '"Successes on Will save are critical successes"',
  'Stylish Combatant':
    'Section=ability,skill ' +
    'Note=' +
      '"+%V Speed with panache",' +
      '"Gains +%{skillNotes.swashbucklerExpertise?2:1} on bravado skill checks during combat"',
  // TODO randomizing
  'Stylish Tricks (Battledancer)':
    'Section=feature,skill ' +
    'Note=' +
      '"+%V Skill Feat (Acrobatics or Performance)",' +
      '"+%V Skill Increase (Acrobatics or Performance)"',
  'Stylish Tricks (Braggart)':
    'Section=feature,skill ' +
    'Note=' +
      '"+%V Skill Feat (Acrobatics or Intimidation)",' +
      '"+%V Skill Increase (Acrobatics or Intimidation)"',
  'Stylish Tricks (Fencer)':
    'Section=feature,skill ' +
    'Note=' +
      '"+%V Skill Feat (Acrobatics or Deception)",' +
      '"+%V Skill Increase (Acrobatics or Deception)"',
  'Stylish Tricks (Gymnast)':
    'Section=feature,skill ' +
    'Note=' +
      '"+%V Skill Feat (Acrobatics or Athletics)",' +
      '"+%V Skill Increase (Acrobatics or Athletics)"',
  'Stylish Tricks (Rascal)':
    'Section=feature,skill ' +
    'Note=' +
      '"+%V Skill Feat (Acrobatics or Thievery)",' +
      '"+%V Skill Increase (Acrobatics or Thievery)"',
  'Stylish Tricks (Wit)':
    'Section=feature,skill ' +
    'Note=' +
      '"+%V Skill Feat (Acrobatics or Diplomacy)",' +
      '"+%V Skill Increase (Acrobatics or Diplomacy)"',
  'Swashbuckler Expertise':
    'Section=combat,skill ' +
    'Note=' +
      '"Class Expert (Swashbuckler)",' +
      '"Has increased Stylish Combatant effects"',
  'Swashbuckler Feats':'Section=feature Note="%V selections"',
  'Swashbuckler Skills':
    'Section=skill Note="Skill Trained (Acrobatics; Select %V from any)"',
  "Swashbuckler's Style":'Section=feature Note="1 selection"',
  'Vivacious Speed':
    'Section=ability Note="+%V Speed/Has increased Stylish Combatant effects"',
  // Weapon Expertise as above
  // Weapon Mastery as above
  // Weapon Specialization as above
  'Wit':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Has the Bon Mot feature",' +
      '"Skill Trained (Diplomacy)",' +
      '"Bon Mot actions have the bravado trait"',

  'Disarming Flair':'Section=combat Note="Disarm action has the bravado trait"',
  'Elegant Buckler':
    'Section=combat ' +
    'Note="Raise A Shield with a buckler gives +2 Armor Class, and a foe critical miss while a buckler is raised gives panache until the end of the next turn"',
  'Extravagant Parry':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gives +1 Armor Class when wielding a one-handed weapon, or +2 with a free hand or a parry weapon, until the start of the next turn; a foe miss during this time gives panache until the end of the next turn"',
  'Flashy Dodge':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gives +2 Armor Class vs. the triggering attack; a miss gives panache until the end of the next turn"',
  'Flying Blade':
   'Section=combat ' +
   'Note="Can apply Precise Strike damage bonuses when using agile or finesse thrown weapons within their first range increment"',
  'Focused Fascination':
    'Section=skill ' +
    'Note="Fascinating Performance used with a single target fascinates on a normal success"',
  'Goading Feint':
    'Section=combat ' +
    'Note="Successful Feint can instead inflict -2 to the target\'s next attack vs. self before the end of the its next turn, or to all of its attacks vs. self on a critical success"',
  'One For All':
    'Action=1 ' +
    'Section=skill ' +
    'Note="Prepares to Aid an ally within 30\'; the subsequent Aid can use Diplomacy for the check and has the bravado trait"',
  'Plummeting Roll':
    // 'Action=Reaction ' + in note
    'Section=combat,feature ' +
    'Note=' +
      '"' + Pathfinder2E.ACTION_MARKS.Reaction + ' Strides up to %{speed//2}\' after the triggering fall of at least 10\' that inflicts no damage",' +
      '"Has the Cat Fall feature"',
  // You're Next as above
  'After You':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Gains panache during initiative by taking the last position in the initiative order"',
  'Antagonize':
    'Section=combat ' +
    'Note="Successful Demoralize prevents the target from removing its frightened condition until it attacks self or moves out of sight for 1 rd"',
  'Brandishing Draw':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Draws a weapon and uses it for a Strike or a 1-action finisher"',
  'Charmed Life':
    'Action=Reaction ' +
    'Section=save ' +
    'Note="Gives +2 on the triggering save, and success gives panache until the end of the next turn"',
  'Enjoy The Show':
    'Section=combat ' +
    'Note="R30\' Successful single-target Perform can instead inflict -1 attacks against creatures others than self, or -2 on a critical success, until the end of the target\'s next turn; critical failure instead gives the target +1 attacks against self until the end of its next turn"',
  'Finishing Follow-Through':
    'Section=combat ' +
    'Note="Gains panache whenever a finisher brings the target to 0 HP"',
  'Retreating Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike allows a free Step on failure"',
  // Tumble Behind as above
  'Unbalancing Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Strike inflicts off-guard until the end of the next turn"',
  'Dastardly Dash':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strides up to %{speed//2}\'; can attempt 1 Trip%{$\'features.Dirty Trick\'?\' or Dirty Trick\':\'\'} during the move"',
  'Even The Odds':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Gains panache at the beginning of the turn when flanked once per 10 min"',
  'Flamboyant Athlete':
    'Section=ability,skill ' +
    'Note=' +
      '"Panache gives %{speed//2}\' climb and swim Speeds",' +
      '"Panache gives -10 jump DCs, and 5\' and %{speed>30?20:15}\' vertical and horizontal Leaps"',
  // Guardian's Deflection as above
  'Impaling Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a bludgeoning or piercing melee Strike against an adjacent foe and another one behind it"',
  'Leading Dance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="<b>(Bravado)</b> Successful Performance vs. Will moves self and an adjacent foe 5\' in the same direction, or 10\' on a critical success; critical failure inflicts prone on self"',
  'Swaggering Initiative':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Gives +2 initiative and allows drawing a weapon; acting first in combat gives panache"',
  'Twirling Throw':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Thrown weapon attack ignores 2nd and 3rd range increment penalties, and the weapon returns except on a critical failure"',
  'Agile Maneuvers':
    'Section=combat ' +
    'Note="Reduces the multiple attack penalty for Disarm, Grapple, Reposition, Shove, and Trip to -4 and -8, or -3 and -6 for an agile weapon with panache"',
  'Combination Finisher':
    'Section=combat ' +
    'Note="Reduces the multiple attack penalty for finisher Strikes to -4 and -8, or -3 and -6 for an agile weapon"',
  'Precise Finisher':
   'Section=combat Note="Has increased Confident Finisher effects"', 
  // Reactive Strike as above
  'Vexing Tumble':
    'Action=1 ' +
    'Section=combat ' +
    'Note="<b>(Bravado)</b> Successful Acrobatics vs. each foe\'s Reflex while Striding up to %{speed//2}\' does not trigger reactions; critical success also inflicts off-guard vs. self until the end of the turn, and critical failure ends the move within the foe\'s reach"',
  'Bleeding Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Slashing or piercing attack also inflicts persistent bleed damage equal to Precise Strike damage"',
  'Distracting Toss':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Attempts a Feint and a thrown weapon Strike vs. a target within 30\'"',
  'Dual Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Uses a weapon in each hand to make 1 attack each at the current multiple attack penalty against 2 different foes"',
  'Flashy Roll':
    'Section=save ' +
    'Note="Flashy Dodge can also be used with Reflex saves; failure on the attack or success on the save allows a 10\' Stride"',
  'Stunning Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful melee Strike inflicts stunned 1 (<b>save Fortitude</b> prevents target reactions until its next turn; critical success negates; critical failure inflicts stunned 3)"',
  'Vivacious Bravado':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Gains %{level+charismaModifier} temporary Hit Points until the start of the next turn after gaining panache"',
  'Buckler Dance':
    'Action=1 Section=combat Note="Constantly has buckler raised"',
  'Derring-Do':
    'Section=combat ' +
    'Note="With panache, can use the better of 2 rolls on bravado actions"',
  'Reflexive Riposte':
    'Section=combat ' +
    'Note="Can use an additional reaction for Opportune Riposte each turn"',
  'Stumbling Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Strike pushes the target 5\', or 10\' on a critical hit"',
  'Switcheroo':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="With panache, Repositions an adjacent foe so that it suffers the triggering ranged attack with lesser cover, or with no cover on a critical success; critical failure inflicts off-guard on self against the attack, and any result other than critical success causes loss of panache"',
  'Targeting Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful targeted attack on a foe\'s arm, head, or legs inflicts enfeebled 2, stupefied 2, or -10\' Speed until the end of the next turn; the effect extends for 1 min at half severity on a critical hit"',
  'Cheat Death':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Retains 1 Hit Point, gains panache, and gains 1 level of doomed for 10 min in response to the triggering damage that would reduce self to 0 Hit Points"',
  'Get Used To Disappointment':
    'Action=Free ' +
    'Section=combat ' +
    'Note="<b>(Bravado)</b> At the beginning of a turn, attempts to Demoralize a target within 30\' who failed an attack or skill check vs. self once per target per min"',
  'Mobile Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes a Strike after a Stride"',
  'The Bigger They Are':
    'Action=1 ' +
    'Section=combat ' +
    'Note="<b>(Bravado)</b> Successful Tumble Through a larger creature\'s space as difficult terrain inflicts weakness %{level//2} to precision damage from the next self attack until the end of the turn, or against all self attacks on a critical success; failure ends movement, triggering reactions, and critical failure inflicts prone on self"',
  // TODO check Jump distance
  'Flamboyant Leap':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Attempts a 1-action finisher during a Leap or Jump of up to %{speed*2}\', then falls"',
  'Impossible Riposte':
    'Section=combat ' +
    'Note="Can use Opportune Riposte against ranged attacks, with the subsequent Strike inflicting the same damage type as the attack"',
  'Perfect Finisher':
    'Action=1 Section=combat Note="Strike uses the better of 2 rolls"',
  'Deadly Grace':
    'Section=combat ' +
    'Note="Critical hits with agile and finesse melee weapons gain the deadly d8 trait or inflict double the normal damage dice if wielding a weapon that already has the deadly trait"',
  'Felicitous Riposte':
    'Section=combat ' +
    'Note="Opportune Riposte uses the better of 2 attack rolls"',
  'Revitalizing Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful strike gives self and allies within 30\' %{level//2} temporary Hit Points; failure gives them only to self"',
  'Incredible Luck':
    'Section=save Note="Charmed life uses the better of 2 rolls"',
  'Lethal Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike inflicts 12d6 HP precision (<b>save Fortitude</b> inflicts 6d6 HP; critical success inflicts 6 HP; critical failure inflicts 18d6 HP) instead of Precise Strike damage"',
  'Parry And Riposte':
    'Section=combat ' +
    'Note="While benefitting from Extravagant Parry or a parry weapon Armor Class bonus, can use Opportune Riposte after a normal failure on a foe Strike if the foe was damaged by a finisher on the prior turn"',
  'Illimitable Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Steps and attempts a 1-action finisher Strike as a bravado action; regaining panache allows immediately using another finisher"',
  'Inexhaustible Countermoves':
    'Section=combat ' +
    'Note="Gains a reaction at the start of each foe turn that can be used to make an Opportune Riposte%{$\'features.Reactive Strike\'?\' or Reactive Strike\':\'\'}"',
  'Panache Paragon':
    'Section=combat ' +
    'Note="Permanently quickened; can use the extra action only to perform a bravado action"',

  // Archetype

  'Bard Dedication':Pathfinder2E.FEATURES['Bard Dedication'],
  'Basic Bard Spellcasting':
    Pathfinder2E.FEATURES['Basic Bard Spellcasting']
    .replaceAll('level', 'rank'),
  "Basic Muse's Whispers":Pathfinder2E.FEATURES["Basic Muse's Whispers"],
  "Advanced Muse's Whispers":Pathfinder2E.FEATURES["Advanced Muse's Whispers"],
  'Counter Perform':
    Pathfinder2E.FEATURES['Counter Perform']
    .replace(' and at least 1 Focus Point', ''),
  'Anthemic Performance':
    Pathfinder2E.FEATURES['Inspirational Performance']
    .replace('Inspire Courage', 'Courageous Anthem'),
  'Occult Breadth':
    Pathfinder2E.FEATURES['Occult Breadth']
    .replace('level', 'rank'),
  'Expert Bard Spellcasting':
    Pathfinder2E.FEATURES['Expert Bard Spellcasting']
    .replaceAll('level', 'rank'),
  'Master Bard Spellcasting':
    Pathfinder2E.FEATURES['Master Bard Spellcasting']
    .replaceAll('level', 'rank'),

  'Cleric Dedication':Pathfinder2E.FEATURES['Cleric Dedication'],
  'Basic Cleric Spellcasting':
    Pathfinder2E.FEATURES['Basic Cleric Spellcasting']
    .replaceAll('level', 'rank'),
  'Basic Dogma':Pathfinder2E.FEATURES['Basic Dogma'],
  'Advanced Dogma':Pathfinder2E.FEATURES['Advanced Dogma'],
  'Divine Breadth':
    Pathfinder2E.FEATURES['Divine Breadth']
    .replace('level', 'rank'),
  'Expert Cleric Spellcasting':
    Pathfinder2E.FEATURES['Expert Cleric Spellcasting']
    .replaceAll('level', 'rank'),
  'Master Cleric Spellcasting':
    Pathfinder2E.FEATURES['Master Cleric Spellcasting']
    .replaceAll('level', 'rank'),

  'Druid Dedication':
    Pathfinder2E.FEATURES['Druid Dedication']
    .replace('Druidic Language', 'Wildsong'),
  'Basic Druid Spellcasting':
    Pathfinder2E.FEATURES['Basic Druid Spellcasting']
    .replaceAll('level', 'rank'),
  'Basic Wilding':Pathfinder2E.FEATURES['Basic Wilding'],
  'Order Spell (Animal)':
    Pathfinder2E.FEATURES['Order Spell (Animal)']
    .replace(' and at least 1 Focus Point', ''),
  'Order Spell (Leaf)':
    Pathfinder2E.FEATURES['Order Spell (Leaf)']
    .replace(' and at least 1 Focus Point', '')
    .replace('Goodberry', 'Cornucopia'),
  'Order Spell (Storm)':
    Pathfinder2E.FEATURES['Order Spell (Storm)']
    .replace(' and at least 1 Focus Point', ''),
  'Order Spell (Untamed)':
    Pathfinder2E.FEATURES['Order Spell (Wild)']
    .replace(' and at least 1 Focus Point', '')
    .replace('Wild Morph', 'Untamed Form'),
  'Advanced Wilding':Pathfinder2E.FEATURES['Advanced Wilding'],
  'Primal Breadth':
    Pathfinder2E.FEATURES['Primal Breadth']
    .replace('level', 'rank'),
  'Expert Druid Spellcasting':
    Pathfinder2E.FEATURES['Expert Druid Spellcasting']
    .replaceAll('level', 'rank'),
  'Master Druid Spellcasting':
    Pathfinder2E.FEATURES['Master Druid Spellcasting']
    .replaceAll('level', 'rank'),

  'Ranger Dedication':Pathfinder2E.FEATURES['Ranger Dedication'],
  "Basic Hunter's Trick":Pathfinder2E.FEATURES["Basic Hunter's Trick"],
  'Ranger Resiliency':Pathfinder2E.FEATURES['Ranger Resiliency'],
  "Advanced Hunter's Trick":Pathfinder2E.FEATURES["Advanced Hunter's Trick"],
  'Master Spotter':Pathfinder2E.FEATURES['Master Spotter'],

  'Fighter Dedication':Pathfinder2E.FEATURES['Fighter Dedication'],
  'Basic Maneuver':Pathfinder2E.FEATURES['Basic Maneuver'],
  'Fighter Resiliency':Pathfinder2E.FEATURES['Fighter Resiliency'],
  'Reactive Striker':
    Pathfinder2E.FEATURES.Opportunist
    .replace('Attack Of Opportunity', 'Reactive Strike'),
  'Advanced Maneuver':Pathfinder2E.FEATURES['Advanced Maneuver'],
  'Diverse Weapon Expert':Pathfinder2E.FEATURES['Diverse Weapon Expert'],

  'Rogue Dedication':Pathfinder2E.FEATURES['Rogue Dedication'],
  'Basic Trickery':Pathfinder2E.FEATURES['Basic Trickery'],
  'Sneak Attacker':Pathfinder2E.FEATURES['Sneak Attacker'],
  'Advanced Trickery':Pathfinder2E.FEATURES['Advanced Trickery'],
  'Skill Mastery':Pathfinder2E.FEATURES['Skill Mastery'],
  'Uncanny Dodge':Pathfinder2E.FEATURES['Uncanny Dodge'],
  'Evasiveness':Pathfinder2E.FEATURES.Evasiveness,

  'Witch Dedication':
    'Section=feature Note="Has the Familiar and Patron features"',
  'Basic Witch Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-rank%{rank>=8?\', 1 2nd-rank, and 1 3rd-rank\':rank>=6?\' and 1 2nd-rank\':\'\'} %{witchTraditionsLowered} spell"',
  'Basic Witchcraft':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level witch)"',
  'Advanced Witchcraft':
    'Section=feature Note="+%V Class Feat (witch up to level %{level//2})"',
  "Patron's Breadth":
    'Section=magic Note="+1 %{witchTraditionsLowered} spell slot of each rank up to %V"',
  'Expert Witch Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (Arcane)/Knows 1 4th-rank%{rank>=16?\', 1 5th-rank, and 1 6th-rank\':rank>=14?\' and 1 5th-rank\':\'\'} %{witchTraditionsLowered} spell"',
  'Master Witch Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (Arcane)/Knows 1 7th-rank%{rank>=20?\' and 1 8th-rank\':\'\'} %{witchTraditionsLowered} spell"',

  'Wizard Dedication':Pathfinder2E.FEATURES['Wizard Dedication'],
  'Arcane School Spell (School Of Ars Grammatica)':
    Pathfinder2E.FEATURES['Arcane School Spell (Abjuration)']
    .replace(' and at least 1 Focus Point', '')
    .replace('Ward', 'Wards'),
  'Arcane School Spell (School Of Battle Magic)':
    Pathfinder2E.FEATURES['Arcane School Spell (Evocation)']
    .replace(' and at least 1 Focus Point', ''),
  'Arcane School Spell (School Of The Boundary)':
    Pathfinder2E.FEATURES['Arcane School Spell (Conjuration)']
    .replace(' and at least 1 Focus Point', '')
    .replace('Augment', 'Fortify'),
  'Arcane School Spell (School Of Civic Wizardry)':
    'Section=magic Note="Knows the Earthworks arcane spell/Has a focus pool"',
  'Arcane School Spell (School Of Mentalism)':
    Pathfinder2E.FEATURES['Arcane School Spell (Enchantment)']
    .replace(' and at least 1 Focus Point', '')
    .replace('Words', 'Push'),
  'Arcane School Spell (School Of Protean Form)':
    Pathfinder2E.FEATURES['Arcane School Spell (Necromancy)']
    .replace(' and at least 1 Focus Point', '')
    .replace('Call Of The Grave', 'Scramble Body'),
  'Arcane School Spell (School Of Unified Magical Theory)':
    Pathfinder2E.FEATURES['Hand Of The Apprentice']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Arcana':Pathfinder2E.FEATURES['Basic Arcana'],
  'Basic Wizard Spellcasting':
    Pathfinder2E.FEATURES['Basic Wizard Spellcasting']
    .replaceAll('level', 'rank'),
  'Advanced Arcana':Pathfinder2E.FEATURES['Advanced Arcana'],
  'Arcane Breadth':
    Pathfinder2E.FEATURES['Arcane Breadth']
    .replace('level', 'rank'),
  'Expert Wizard Spellcasting':
    Pathfinder2E.FEATURES['Expert Wizard Spellcasting']
    .replaceAll('level', 'rank'),
  'Master Wizard Spellcasting':
    Pathfinder2E.FEATURES['Master Wizard Spellcasting']
    .replaceAll('level', 'rank'),

  // Core 2

  'Alchemist Dedication':
    Pathfinder2E.FEATURES['Alchemist Dedication']
    .replace(' and Infused Reagents', ', Quick Alchemy, and Versatile Vials'),
  // Advanced Alchemy as above
  'Basic Concoction':Pathfinder2E.FEATURES['Basic Concoction'],
  'Advanced Concoction':Pathfinder2E.FEATURES['Advanced Concoction'],
  'Voluminous Vials':
    'Section=skill Note="Has increased Versatile Vials effects"',
  'Alchemical Power':
    'Section=combat,combat ' +
    'Note=' +
      '"Class Expert (Alchemist)",' +
      '"Can use Alchemist DC for infused item save DC"',

  'Barbarian Dedication':Pathfinder2E.FEATURES['Barbarian Dedication'],
  'Barbarian Resiliency':Pathfinder2E.FEATURES['Barbarian Resiliency'],
  'Basic Fury':Pathfinder2E.FEATURES['Basic Fury'],
  'Advanced Fury':Pathfinder2E.FEATURES['Advanced Fury'],
  'Instinct Ability (Animal Instinct (Ape))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Ape))'],
  'Instinct Ability (Animal Instinct (Bear))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Bear))'],
  'Instinct Ability (Animal Instinct (Bull))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Bull))'],
  'Instinct Ability (Animal Instinct (Cat))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Cat))'],
  'Instinct Ability (Animal Instinct (Deer))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Deer))'],
  'Instinct Ability (Animal Instinct (Frog))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Frog))'],
  'Instinct Ability (Animal Instinct (Shark))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Shark))'],
  'Instinct Ability (Animal Instinct (Snake))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Snake))'],
  'Instinct Ability (Animal Instinct (Wolf))':
    Pathfinder2E.FEATURES['Instinct Ability (Animal Instinct (Wolf))'],
  'Instinct Ability (Dragon Instinct (Adamantine))':
    Pathfinder2E.FEATURES['Instinct Ability (Dragon Instinct (Black))'],
  'Instinct Ability (Dragon Instinct (Conspirator))':
    Pathfinder2E.FEATURES['Instinct Ability (Dragon Instinct (Black))'],
  'Instinct Ability (Dragon Instinct (Diabolic))':
    Pathfinder2E.FEATURES['Instinct Ability (Dragon Instinct (Black))'],
  'Instinct Ability (Dragon Instinct (Empyreal))':
    Pathfinder2E.FEATURES['Instinct Ability (Dragon Instinct (Black))'],
  'Instinct Ability (Dragon Instinct (Fortune))':
    Pathfinder2E.FEATURES['Instinct Ability (Dragon Instinct (Black))'],
  'Instinct Ability (Dragon Instinct (Horned))':
    Pathfinder2E.FEATURES['Instinct Ability (Dragon Instinct (Black))'],
  'Instinct Ability (Dragon Instinct (Mirage))':
    Pathfinder2E.FEATURES['Instinct Ability (Dragon Instinct (Black))'],
  'Instinct Ability (Fury Instinct)':
    'Section=feature Note="Has the Unstoppable Frenzy feature"',
  'Instinct Ability (Giant Instinct)':
    Pathfinder2E.FEATURES['Instinct Ability (Giant Instinct)'],
  'Instinct Ability (Spirit Instinct)':
    Pathfinder2E.FEATURES['Instinct Ability (Spirit Instinct)'],
  'Instinct Ability (Superstition Instinct)':
    'Section=feature Note="Has the Superstitious Resilience feature"',
  "Juggernaut's Fortitude":Pathfinder2E.FEATURES["Juggernaut's Fortitude"],

  // TODO Trained in Heavy Armor only if already trained in Medium Armor
  'Champion Dedication':
    Pathfinder2E.FEATURES['Champion Dedication']
    .replace('Ability and Deity And Cause', 'Attribute, Deity, and Cause'),
  'Basic Devotion':Pathfinder2E.FEATURES['Basic Devotion'],
  'Champion Resiliency':Pathfinder2E.FEATURES['Champion Resiliency'],
  // Changed effects
  'Devout Magic':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Has a focus pool"',
  'Advanced Devotion':Pathfinder2E.FEATURES['Advanced Devotion'],
  "Champion's Reaction (Desecration)":
    'Section=feature Note="Has the Selfish Shield feature"',
  "Champion's Reaction (Grandeur)":
    'Section=feature Note="Has the Flash Of Grandeur feature"',
  "Champion's Reaction (Iniquity)":
    'Section=feature Note="Has the Destructive Vengeance feature"',
  "Champion's Reaction (Justice)":
    'Section=feature Note="Has the Retributive Strike feature"',
  "Champion's Reaction (Liberation)":
    'Section=feature Note="Has the Liberating Step feature"',
  "Champion's Reaction (Obedience)":
    'Section=feature Note="Has the Iron Command feature"',
  "Champion's Reaction (Redemption)":
    'Section=feature Note="Has the Glimpse Of Redemption feature"',
  'Devout Blessing':
    'Section=feature Note="Has the Blessing Of The Devoted feature"',

  'Investigator Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Class Trained (Investigator)",' +
      '"Has the On The Case feature",' +
      '"Skill Trained (Society; choose 1 from any)"',
  'Basic Deduction':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level investigator)"',
  "Investigator's Stratagem":
    'Section=feature ' +
    'Note="Has the Devise A Stratagem feature; cannot substitute intelligence when using Attack Stratagem"',
  'Advanced Deduction':
    'Section=feature ' +
    'Note="+%V Class Feat (investigator up to level %{level//2})"',
  // Keen Recollection as above
  // Skill Mastery as above
  // Master Spotter as above

  'Monk Dedication':Pathfinder2E.FEATURES['Monk Dedication'],
  'Basic Kata':Pathfinder2E.FEATURES['Basic Kata'],
  'Monk Resiliency':Pathfinder2E.FEATURES['Monk Resiliency'],
  'Advanced Kata':Pathfinder2E.FEATURES['Advanced Kata'],
  'Monk Moves':Pathfinder2E.FEATURES['Monk Moves'],
  "Monk's Flurry":Pathfinder2E.FEATURES["Monk's Flurry"],
  "Perfection's Path (Fortitude)":
    Pathfinder2E.FEATURES["Perfection's Path (Fortitude)"],
  "Perfection's Path (Reflex)":
    Pathfinder2E.FEATURES["Perfection's Path (Reflex)"],
  "Perfection's Path (Will)":Pathfinder2E.FEATURES["Perfection's Path (Will)"],

  'Oracle Dedication':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has the Mystery and Oracular Curse features",' +
      '"Spell Trained (Divine)/Knows 2 choices of divine cantrips",' +
      '"Skill Trained (Religion)"',
  'Basic Mysteries':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level oracle)"',
  'Basic Oracle Spellcasting':
    'Section=magic ' +
    'Note="Knows 1 1st-level%{level>=8?\', 1 2nd-level, and 1 3rd-level\':level>=6?\' and 1 2nd-level\':\'\'} divine spell"',
  'First Revelation (Ancestors)':
    'Section=magic ' +
    'Note="Knows the Ancestral Touch divine spell/Has a focus pool"',
  'First Revelation (Battle)':
    'Section=magic ' +
    'Note="Knows the Weapon Trance divine spell/Has a focus pool"',
  'First Revelation (Bones)':
    'Section=magic ' +
    'Note="Knows the Soul Siphon divine spell/Has a focus pool"',
  'First Revelation (Cosmos)':
    'Section=magic ' +
    'Note="Knows the Spray Of Stars divine spell/Has a focus pool"',
  'First Revelation (Flames)':
    'Section=magic ' +
    'Note="Knows the Incendiary Aura divine spell/Has a focus pool"',
  'First Revelation (Life)':
    'Section=magic ' +
    'Note="Knows the Life Link divine spell/Has a focus pool"',
  'First Revelation (Lore)':
    'Section=magic ' +
    'Note="Knows the Brain Drain divine spell/Has a focus pool"',
  'First Revelation (Tempest)':
    'Section=magic ' +
    'Note="Knows the Tempest Touch divine spell/Has a focus pool"',
  'Advanced Mysteries':
    'Section=feature ' +
    'Note="+%V Class Feat (oracle up to level %{level//2})"',
  'Mysterious Breadth':
    'Section=magic Note="+1 divine spell slot of each level up to %V"',
  'Expert Oracle Spellcasting':
    'Section=magic ' +
    'Note="Spell Expert (Divine)/Knows 1 4th-level%{level>=16?\', 1 5th-level, and 1 6th-level\':level>=14?\' and 1 5th-level\':\'\'} divine spell"',
  'Master Oracle Spellcasting':
    'Section=magic ' +
    'Note="Spell Master (Divine)/Knows 1 7th-level%{level>=20?\' and 1 8th-level\':\'\'} divine spell"',

  'Sorcerer Dedication':Pathfinder2E.FEATURES['Sorcerer Dedication'],
  'Basic Sorcerer Spellcasting':
    Pathfinder2E.FEATURES['Basic Sorcerer Spellcasting'],
  'Basic Blood Potency':Pathfinder2E.FEATURES['Basic Blood Potency'],
  'Basic Bloodline Spell (Aberrant)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Aberrant)']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Angelic)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Angelic)']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Demonic)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Demonic)']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Diabolic)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Diabolic)']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Draconic (Arcane))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Draconic (Brass))']
    .replace(' and at least 1 Focus Point', '')
    .replace('Dragon Claws', 'Flurry Of Claws'),
  'Basic Bloodline Spell (Draconic (Divine))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Draconic (Brass))']
    .replace(' and at least 1 Focus Point', '')
    .replace('arcane', 'divine')
    .replace('Dragon Claws', 'Flurry Of Claws'),
  'Basic Bloodline Spell (Draconic (Occult))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Draconic (Brass))']
    .replace(' and at least 1 Focus Point', '')
    .replace('arcane', 'occult')
    .replace('Dragon Claws', 'Flurry Of Claws'),
  'Basic Bloodline Spell (Draconic (Primal))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Draconic (Brass))']
    .replace(' and at least 1 Focus Point', '')
    .replace('arcane', 'primal')
    .replace('Dragon Claws', 'Flurry Of Claws'),
  'Basic Bloodline Spell (Elemental (Air))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Elemental (Air))']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Elemental (Earth))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Elemental (Earth))']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Elemental (Fire))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Elemental (Fire))']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Elemental (Metal))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Elemental (Earth))']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Elemental (Water))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Elemental (Water))']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Elemental (Wood))':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Elemental (Water))']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Fey)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Fey)']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Hag)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Hag)']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Imperial)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Imperial)']
    .replace(' and at least 1 Focus Point', ''),
  'Basic Bloodline Spell (Undead)':
    Pathfinder2E.FEATURES['Basic Bloodline Spell (Undead)']
    .replace(' and at least 1 Focus Point', ''),
  'Advanced Blood Potency':Pathfinder2E.FEATURES['Advanced Blood Potency'],
  'Bloodline Breadth':Pathfinder2E.FEATURES['Bloodline Breadth'],
  'Expert Sorcerer Spellcasting':
    Pathfinder2E.FEATURES['Expert Sorcerer Spellcasting'],
  'Master Sorcerer Spellcasting':
    Pathfinder2E.FEATURES['Master Sorcerer Spellcasting'],

  'Swashbuckler Dedication':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Class Trained (Swashbuckler)",' +
      '"Has the Panache and Swashbuckler\'s Style features",' +
      // TODO or the style-linked skill
      '"Skill Trained (Acrobatics)"',
  'Basic Flair':
    'Section=feature Note="+1 Class Feat (1st- or 2nd-level swashbuckler)"',
  'Finishing Precision':
    'Section=combat ' +
    'Note="Has the Precise Strike and Basic Finisher features"',
  'Basic Finisher':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Strike with a Precise Strike weapon inflicts +1d6 HP precision"',
  'Advanced Flair':
    'Section=feature ' +
    'Note="+%V Class Feat (swashbuckler up to level %{level//2})"',
  "Swashbuckler's Riposte":
    'Section=combat Note="Has the Opportune Riposte feature"',
  "Swashbuckler's Speed":
    'Section=ability,ability ' +
    'Note=' +
      '"+5 Speed",' +
      '"+5 Speed with panache"',
  // Evasiveness as above

  'Acrobat Dedication':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill %V (Acrobatics)",' +
      '"Critical success on Tumble Through allows moving normally through a foe\'s space"',
  'Contortionist':
    'Section=feature,skill ' +
    'Note=' +
      '"Has the Quick Squeeze feature",' +
      '"Successful Escape using Acrobatics inflicts off-guard vs. next self attack before the end of the next turn%{rank.Acrobatics>=3?\'/Can Squeeze at full speed\':\'\'}"',
  'Dodge Away':
    'Action=Reaction ' +
    'Section=combat ' +
    'Note="Gains +1 Armor Class vs. the triggering melee attack and can Step%{rank.Acrobatics>=3?\\" 10\'\\":\'\'} if the attack misses"',
  'Graceful Leaper':
    'Section=skill Note="Can use Acrobatics instead of Athletics for Jumps"',
  'Tumbling Strike':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Successful Acrobatics vs. Reflex allows moving through a foe\'s space without triggering reactions to make a melee Strike against it; critical success inflicts off-guard against the Strike, failure allows the Strike but not the move, and critical failure negates both"',
  'Tumbling Opportunist':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Attempts to use Acrobatics to Trip a foe after moving through its space"',

  'Archaeologist Dedication':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Expert (Society; Thievery)",' +
      '"+1 to Recall Knowledge about ancient history, peoples, and cultures"',

  'Magical Scholastics':
    'Section=magic ' +
    'Note="Knows the Detect Magic, Guidance, and Read Aura occult innate cantrips"',
  'Settlement Scholastics':
    'Section=feature,skill ' +
    'Note=' +
      '"+%V Skill Feat (settlement Additional Lore)",' +
      '"+%V Language Count"',
  'Scholastic Identification':
    'Section=skill ' +
    'Note="Can use Society to Decipher Writing and to Identify Magic with an item of cultural significance"',
  "Archaeologist's Luck":
    'Action=Free ' +
    'Section=save ' +
    'Note="Rerolls a failed save vs. a trap once per hr"',
  'Greater Magical Scholastics':
    'Section=magic ' +
    'Note="Knows the Augury, Locate, and Veil Of Privacy occult innate spells; can cast each once per day"',

  'Archer Dedication':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Familiarity (Bows; Crossbows)",' +
      '"Critical hits with an expert proficiency bow or crossbow inflict its critical specialization effect"',
  'Quick Shot':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Draws and fires a bow or crossbow"',
  'Crossbow Terror':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Makes an Intimidation check after loading a crossbow; gains +2 on the check from a prior successful crossbow Strike in the same turn"',
  "Archer's Aim":
    'Action=2 ' +
    'Section=combat ' +
    'Note="Ranged Strike with a bow or crossbow gains +2 attack, ignores concealment, and can attack a hidden target with a DC 5 flat check"',
  'Unobstructed Shot':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Makes a ranged Strike after Shoving or Tripping an adjacent creature"',

  'Assassin Dedication':
    'Section=combat,combat ' +
    'Note=' +
      '"Has the Mark For Death and Sneak Attack features",' +
      '"Sneak Attack on a marked target inflicts +1d%{level<6?4:6} HP precision, or +%{level<6?1:2} HP precsion from an existing Sneak Attack ability"',
  'Mark For Death':
    'Action=3 ' +
    'Section=combat ' +
    'Note="Gains +2 Seek and Feint vs. a chosen target and can use Sneak Attack against it"',
  'Expert Backstabber':
    'Section=combat ' +
    'Note="Strike on an off-guard foe with a backstabber weapon inflicts +2 HP precision"',
  // Surprise Attack as above
  'Angel Of Death':
    'Section=combat ' +
    'Note="Reducing a marked target to 0 HP inflicts death, and interaction with it afterward requires a %{level//2} counteract rank"',
  'Assassinate':
    'Action=2 ' +
    'Section=combat ' +
    'Note="Strike on marked target inflicts +6d6 HP precision (<b>save basic Fortitude</b>; critical failure by targets up to level %{level} inflicts death) once per target per day"',

  'Bastion Dedication':'Section=combat Note="Has the Reactive Shield feature"',
  'Disarming Block':
    'Action=Free ' +
    'Section=combat ' +
    'Note="Follows a successful Shield Block with a Disarm attempt"',
  'Nimble Shield Hand':
    'Section=combat Note="Can hold an object in the same hand as a shield"',
  'Destructive Block':
    'Section=combat ' +
    'Note="Can use Shield Block to negate %{shieldHardness*2} HP damage, doubling the amount of damage to the shield"',
  'Shield Salvation':
    'Section=combat ' +
    'Note="Can have shield retain 1 HP when it would normally be destroyed by Shield Block"',

  // General and Skill

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
    Pathfinder2E.FEATURES['Automatic Knowledge (%skill)']
    .replace('features.Assurance (%skill)', 'features.Assurance (%skill) || features.Assured Knowledge'),
  'Bargain Hunter':Pathfinder2E.FEATURES['Bargain Hunter'],
  'Battle Cry':Pathfinder2E.FEATURES['Battle Cry'],
  'Battle Medicine':Pathfinder2E.FEATURES['Battle Medicine'],
  'Bizarre Magic':Pathfinder2E.FEATURES['Bizarre Magic'],
  'Bonded Animal':Pathfinder2E.FEATURES['Bonded Animal'],
  'Break Curse':
    'Section=skill ' +
    'Note="After %{rank.Occultism>=4||rank.Religion>=4?\'10 min\':\'8 hr\'} of preparation, can use Occultism or Religion for a %{(level+1)//2}-rank counteract check against a curse"',
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
    'Note="Can use Diplomacy to Make An Impression on %{rank.Diplomacy>=4?100:rank.Diplomacy==3?50:rank.Diplomacy==2?20:10} targets"',
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
  'Recognize Spell':
    Pathfinder2E.FEATURES['Recognize Spell']
    .replace('level', 'rank'),
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
    'Note="Successful DC 20 check to Treat Wounds reduces a choice of clumsy, enfeebled, or stupefied%{rank.Medicine>=3?\', or successful DC 30 reduces drained,\':\'\'} by %{rank.Medicine<3?1:2} once per patient per day"',
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

  'A Home In Every Port':
    'Section=skill ' +
    'Note="Can use 8 hr interaction in a town or village to obtain free lodging for self and 6 allies for 1 dy"',
  'Acrobatic Performer':
    'Section=skill ' +
    'Note="Can use Acrobatics to Perform%{rank.Acrobatics&&rank.Performance?\' with +1 on checks\':\'\'}"',
  'Aerobatics Mastery':
    'Section=skill ' +
    'Note="+2 Acrobatics to Maneuver In Flight and can attempt to combine 2 maneuvers at the higher DC + 5%{rank.Acrobatics>=4?\' or 3 maneuvers at the highest DC + 10\':\'\'}"',
  'Armor Assist':
    'Section=skill Note="Successful Athletics or Warfare Lore allows donning armor in half the normal time or helping an ally do so"',
  'Armored Stealth':
    'Section=skill ' +
    'Note="Suffers no Stealth penalty for noisy armor and reduces the penalty for non-noisy armor by %{rank.Stealth<3?1:rank.Stealth<4?2:3}"',
  'Assured Identification':
    'Section=skill ' +
    'Note="Critical failures on Identify Magic are normal failures, and successes on Identify Magic with cursed items do not misidentify them"',
  'Backup Disguise':
    'Section=skill ' +
    'Note="Can assume a prepared disguise with %{rank.Deception<3?\'3 actions\':rank.Deception<4?\'2 actions\':\'1 action\'}"',
  'Battle Planner':
    'Section=skill ' +
    'Note="1 min preparation with detailed scouting info allows using Warfare Lore for initiative"',
  'Biographical Eye':
    'Section=skill ' +
    'Note="1 min with a target and a successful DC 30 Society check reveals its profession, specialty, and where it lives, critical success adds its homeland and a major accomplishment or controversy, failure reveals only its homeland and profession, and critical failure gives incorrect info"',
  'Bon Mot':
    'Section=combat ' +
    'Note="R30\' Successful Diplomacy vs. Will inflicts -2 Perception and Will, or -3 on a critical success, for 1 min; critical failure inflicts the same on self for 1 min or until a successful Bon Mot"',
  'Caravan Leader':
    'Section=skill ' +
    'Note="Group can Hustle for the best length of time among its members plus 20 min"',
  'Concealing Legerdemain':
    'Section=skill Note="Can use Thievery to Conceal An Object of light Bulk"',
  'Consult The Spirits (Nature)':
    'Section=skill ' +
    'Note="Successful Nature answers 1 question, or 3 questions with a critical success, about the surrounding 100\' area once per %{rank.Nature<4?\'day\':\'hr\'}; critical failure gives harmful information"',
  'Consult The Spirits (Occult)':
    'Section=skill ' +
    'Note="Successful Occult answers 1 question, or 3 questions with a critical success, about the surrounding 100\' area once per %{rank.Nature<4?\'day\':\'hr\'}; critical failure gives harmful information"',
  'Consult The Spirits (Religion)':
    'Section=skill ' +
    'Note="Successful Religion answers 1 question, or 3 questions with a critical success, about the surrounding 100\' area once per %{rank.Nature<4?\'day\':\'hr\'}; critical failure gives harmful information"',
  "Crafter's Appraisal":
    'Section=skill Note="Can use Crafting to Identify Magic on items"',
  'Deceptive Worship':
    'Section=skill ' +
    'Note="Can use Occultism to Lie when claiming membership in another faith"',
  'Dirty Trick':
    'Section=combat ' +
    'Note="Successful Thievery vs. Reflex inflicts clumsy 1 for 1 rd, or until the target performs an Interact action on a critical success; critical failure inflicts prone on self"',
  'Discreet Inquiry':
    'Section=skill ' +
    'Note="Others\' attempts to detect self Gather Information activities require a successful check vs. Deception DC"',
  'Distracting Performance':
    'Action=1 ' +
    'Section=combat ' +
    'Note="Can use Performance to Create A Diversion for an ally until the end of its turn"',
  'Disturbing Knowledge':
    'Action=2 ' +
    'Section=combat ' +
    'Note="R30\' Successful Occultism vs. Will inflicts frightened 1%{rank.Occultism>=4?\' on all foes within range\':\'\'}; critical success also inflicts confused for 1 rd; critical failure inflicts frightened 1 on self"',
  'Doublespeak':
    'Section=skill ' +
    'Note="Can include in speech meanings understood only by allies and observers who critically succeed on Perception vs. Deception"',
  'Environmental Guide':
    'Section=save Note="1 hr adjustment allows self and 5 allies to treat environmental temperature effects as %{rank.Survival<4?\'1 step\':\'2 steps\'} less severe"',
  'Evangelize':
    'Section=skill ' +
    'Note="Successful Diplomacy vs. Will inflicts stupefied 1 on target for 1 rd, or stupefied 2 for 1 rd on a critical success, once per target per day"',
  'Exhort The Faithful':
    'Section=skill ' +
    'Note="Can use a Religion with a +2 bonus to Request or Coerce other members of the same faith, and a critical failure does not worsen target\'s attitude"',
  'Express Rider':
    'Section=skill ' +
    'Note="Successful Nature increases the speed of self and 6 allies\' mounts by half for a day"',
  'Eye For Numbers':
    'Section=skill ' +
    'Note="Can accurately estimate the number of items in a group with a glance and can do so with a foe\'s possessions to gain a +1 Society check to Create A Diversion or Feint"',
  'Eyes Of The City':
    'Section=skill ' +
    'Note="Can use Diplomacy or Society to Track within a settlement"',
  'Forensic Acumen':
    'Section=skill ' +
    'Note="Can perform a forensic examination in half the normal time to gain +%{rank.Medicine<3?2:rank.Medicine<4?3:4}l on a Recall Knowledge to determine the cause of injury or death"',
  'Glean Contents':
    'Section=skill ' +
    'Note="Can use a Society check with a +1 bonus to Decipher Writing on a partially-glimpsed message or sealed letter"',
  'Improvise Tool':
    'Section=skill ' +
    'Note="Can craft basic tools and repair them without a toolkit"',
  'Improvised Repair':
    'Section=skill ' +
    'Note="Can quickly repair a broken item into shoddy condition"',
  'Incredible Scout':'Section=skill Note="Scouting gives allies +2 initiative"',
  'Influence Nature':
    'Section=skill Note="Can spend %{rank.Nature<4?\' at least a day of downtime\':\'at least 10 min\'} to influence the behavior of local wildlife"',
  'Inoculation':
    'Section=skill ' +
    'Note="Successful patient recover from Treat A Disease gives them +2 saves vs. the disease for 1 week"',
  'Keen Follower':
    'Section=skill Note="Gains +3 to Follow An Expert, or +4 when following a master, and others in the group can use self skill for group rolls"',
  'Lead Climber':
    'Section=skill ' +
    'Note="Successful Athletics check turns a ally\'s critical Climb failure when a following self into a normal failure; a critical failure inflicts the consequences on both"',
  'Legendary Guide':
    'Section=skill ' +
    'Note="Following party gains +10\' Speed when traveling and can travel normally over difficult terrain and at half speed over greater difficult terrain"',
  'Leverage Connections':Pathfinder2E.FEATURES.Connections,
  'Numb To Death':
    'Section=save ' +
    'Note="Regains +%{level} Hit Points and does not increase wounded condition when recovering from dying once per day"',
  'Pick Up The Pace':
    'Section=skill ' +
    'Note="Hustling group can continue as long as the best member"',
  "Pilgrim's Token":
    'Section=combat ' +
    'Note="Religious symbol allows self to act first when tied with a foe on initiative"',
  'Rapid Affixture':
    'Section=skill ' +
    'Note="Can Affix A Talisman in %{rank.Crafting<4?\'1 min\':\'3 actions\'}"',
  'Risky Surgery':
    'Section=skill ' +
    'Note="Inflicting 1d8 HP slashing on a Treat Wounds patient to gives +2 on the subsequent check and makes a success into a critical success"',
  'Robust Health':
    'Section=save ' +
    'Note="Successful Treat Wounds or Battle Medicine on self restores +%{level} Hit Points, and Battle Medicine can be used again after 1 hr"',
  'Rolling Landing':
    'Section=feature ' +
    'Note="After falling without damage, can use a reaction to Step or Stride up to %{rank.Acrobatics<3?speed//2:speed}\'%{rank.Acrobatics>=4?\', triggering no reactions\':\'\'}"',
  'Root Magic':
    'Section=skill ' +
    'Note="Talisman given to an ally during daily prep gives +%{rank.Occultism<2?1:rank.Occultism<4?2:3} on first save that day vs. a spell or haunt"',
  'Sanctify Water':
    'Action=1 ' +
    'Section=magic ' +
    'Note="Makes the water in %{rank.Religion<3?\'a\':rank.Religion<4?2:3} light Bulk container%{rank.Religion<3?\'\':\'s\'} held by self or an adjacent ally holy or unholy until the end of the next turn"',
  'Shadow Mark':
    'Section=skill ' +
    'Note="Followed target suffers -%{rank.Stealth<3?2:rank.Stealth<4?3:4} on Perception vs. Stealth to notice"',
  'Signature Crafting':
    'Section=skill ' +
    'Note="Successful DC 9 flat check after Crafting a permanent magic item gives it a random quirk, or a selected quirk on a critical success"',
  'Slippery Prey':
    'Section=skill ' +
    'Note="Reduces the penalty for repeated Escape attempts using Acrobatics or Athletics to -4 and -8, -3 and -6 with master proficiency, or zero with legendary proficiency"',
  'Snare Crafting':Pathfinder2E.FEATURES['Snare Crafting'],
  'Sow Rumor':
    'Section=skill ' +
    'Note="Successful Deception spreads a rumor for 1 week, giving +1 Deception, Diplomacy, and Intimidation that invokes it; critical success gives a +2 bonus for 1 month and critical failure gives a -4 penalty for 1 week"',
  'Supertaster':
    'Section=skill ' +
    'Note="Automatically attempts to identify ingredients, including poisons, in consumed items, and tasting gives +2 to a relevant Recall Knowledge check"',
  'Terrifying Resistance':
    'Section=combat ' +
    'Note="Successful Demoralize gives self +1 saves vs. target\'s spells for 1 day"',
  'Thorough Search':
    'Section=skill ' +
    'Note="Taking twice the normal time to Search gives +2 Perception on the check and changes a success into a critical success"',
  'True Perception':
    'Section=magic ' +
    'Note="Has constant 6th-rank <i>Truesight</i> effects, using Perception for the counteract check"',
  'Tumbling Teamwork':
    'Section=combat ' +
    'Note="Successful Tumble Through a foe\'s space allows adjacent allies to Step as a reaction into another adjacent space"',
  'Tumbling Theft':
    'Section=skill ' +
    'Note="Successful Tumble Through a foe\'s space allows a +1 Steal check on an accessible light item"',
  'Underground Network':
    'Section=skill ' +
    'Note="1 hr spent with local contacts gives a +1 Recall Knowledge to Gather Information, or +2 if using Underworld Lore"',
  'Water Sprint':
    'Section=ability Note="Can%{rank.Athletics<4?\' travel half of Stride in a straight line\':\'Stride\'} over water; must end on solid ground to avoid sinking"'

};
for(let f in Pathfinder2ERemaster.FEATURES) {
  if(!Pathfinder2ERemaster.FEATURES[f])
    console.log(f);
  Pathfinder2ERemaster.FEATURES[f] =
    Pathfinder2ERemaster.FEATURES[f].replace('/+1 Focus Points', '');
}
Pathfinder2ERemaster.GOODIES = Pathfinder2E.GOODIES;
Pathfinder2ERemaster.HERITAGES = {
  'Changeling':
    'Traits=Uncommon ' +
    'Features=' +
      '"hasAncestralLowLightVision==0 ? 1:Low-Light Vision",' +
      '"hasAncestralLowLightVision ? 1:Darkvision",' +
      '"1:Changeling Heritage"',
  'Nephilim':
    'Traits=Uncommon ' +
    'Features=' +
      '"hasAncestralLowLightVision==0 ? 1:Low-Light Vision",' +
      '"hasAncestralLowLightVision ? 1:Darkvision",' +
      '"1:Nephilim Heritage"',
  'Aiuvarin':
    'Traits=Non-Elf ' +
    'Features=' +
      '"1:Low-Light Vision",' +
      '"1:Aiuvarin Heritage"',
  'Dromaar':
    'Traits=Non-Orc ' +
    'Features=' +
      '"1:Low-Light Vision",' +
      '"1:Dromaar Heritage"',
  // Core 2
  'Dhampir':
    'Traits=Uncommon ' +
    'Features=' +
      '"1:Void Healing",' +
      '"hasAncestralLowLightVision==0 ? 1:Low-Light Vision",' +
      '"hasAncestralLowLightVision ? 1:Darkvision",' +
      '"1:Dhampir Heritage"',
  'Dragonblood':
    'Traits=Uncommon ' +
    'Features=' +
      '"1:Draconic Exemplar",' +
      '"1:Dragonblood Heritage" ' +
    'Selectables=' +
      '"1:Adamantine Exemplar:Draconic Exemplar",' +
      '"1:Conspirator Exemplar:Draconic Exemplar",' +
      '"1:Diabolic Exemplar:Draconic Exemplar",' +
      '"1:Empyreal Exemplar:Draconic Exemplar",' +
      '"1:Fortune Exemplar:Draconic Exemplar",' +
      '"1:Horned Exemplar:Draconic Exemplar",' +
      '"1:Mirage Exemplar:Draconic Exemplar",' +
      '"1:Omen Exemplar:Draconic Exemplar"',
  'Duskwalker':
    'Traits=Uncommon ' +
    'Features=' +
      '"hasAncestralLowLightVision==0 ? 1:Low-Light Vision",' +
      '"hasAncestralLowLightVision ? 1:Darkvision",' +
      '"1:Duskwalker Heritage"'
};
Pathfinder2ERemaster.LANGUAGES = {
  // Common (pg 89)
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
  // Uncommon (pg 89)
  'Aklo':'',
  'Chthonian':'',
  'Diabolic':'',
  'Empyrean':'',
  'Kholo':'',
  'Necril':'',
  'Petran':'',
  'Pyric':'',
  'Shadowtongue':'',
  'Sussuran':'',
  'Thalassic':'',
  // Regional (pg 34)
  'Hallit':'',
  'Kelish':'',
  'Mwangi':'',
  'Osiriani':'',
  'Shoanti':'',
  'Skald':'',
  'Tien':'',
  'Varisian':'',
  'Vudrani':'',
  // Core 2
  'Amurrun':'',
  'Iruxi':'',
  'Tengu':'',
  'Tripkee':'',
  'Ysoki':''
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
  'Catfolk Lore':'Attribute=Intelligence Subcategory="Creature Lore"',
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
  'Surgery Lore':'Attribute=Intelligence',
  'Curse Lore':'Attribute=Intelligence',
  'Fey Lore':'Attribute=Intelligence'
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
      '"Melee spell attack inflicts 2d6 HP slashing or piercing, plus 2 HP persistent bleed, or double both on a critical success (<b>heightened +1</b> inflicts +1d6 HP initial and +1 persistent bleed)"',
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
      '"Target suffers worse of 2 rolls on the next attack or skill check within 1 rd (<b>save Will</b> negates; critical failure affects all attacks and skill checks within 1 rd)"',
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
  'Veil Of Privacy':
    'Level=3 ' +
    'Traits=Uncommon,Concentrate,Manipulate ' +
    'Traditions=Arcane,Occult,Primal ' +
    'Cast="10 min" ' +
    'Description=' +
      '"Attempts to counteract detection, revelation, and scrying cast against the target for 8 hr"',
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

  // Bard
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
    .replace('Traits=', 'Traits=Manipulate,')
    .replaceAll('level', 'rank'),
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
      '"R30\' Uses Performance to counteract a choice of grabbed, immobilized, paralyzed, restrained, slowed, or stunned affecting target (<b>heightened 9th</b> affects 4 targets)"',
  'Triple Time':
    Pathfinder2E.SPELLS['Triple Time']
    .replace('Enchantment', 'Manipulate'),
  'Uplifting Overture':
    Pathfinder2E.SPELLS['Inspire Competence']
    .replace('Enchantment', 'Concentrate'),

  // Cleric
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

  // Druid
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
      '"Gives the better of 2 rolls on a Recall Knowledge check about a creature"',
  'Soothing Mist':
    'Level=2 ' +
    'Traits=Uncommon,Focus,Ranger,Concentrate,Manipulate,Healing,Vitality ' +
    'Traditions=Primal ' +
    'Cast=2 ' +
    'Description=' +
      '"R30\' Restores 2d8 HP and removes a source of persistent damage to a living creature, or inflicts 2d8 HP vitality and 2 HP persistent vitality to an undead target"',
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

  // Witch
  'Blood Ward':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Manipulate ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=1 ' +
    'Description=' +
      '"R30\' Target gains +1 Armor Class and saves vs. a choice of creature type while sustained for up to 1 min (<b>heightened 5th</b> gives +2 bonus"',
  'Cackle':
    'Level=1 ' +
    'Traits=Uncommon,Focus,Witch,Concentrate,Hex ' +
    'Traditions=Arcane,Divine,Occult,Primal ' +
    'Cast=Free ' +
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
      '"R30\' Inflicts weakness 2 to a choice of element while sustained for up to 1 min (<b>heightened +2</b> inflicts weakness +1)"',
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
      '"Successful attacks by the target\'s shadow inflict 1d10+%{spellModifier.%tradition} HP of a choice of damage type on target each rd while sustained for up to 1 min (<b>heightened +2</b> inflicts +1d10 HP)"',
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
    'Traits=Uncommon,Focus,Witch,Cantrip,Concentrate,Emotion,Hex ' +
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

  // Wizard
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
      '"Gives self a choice of +20\' Speed, %{speed//2}\' climb or swim Speed, darkvision, 60\' imprecise scent, or claws that inflict 1d8 HP slashing, for 1 min"',
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
  'Embrace Nothingness':
    'Level=9 ' +
    'Traits=Monk,Uncommon,Concentrate,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="Self gains resistance %{level} to physical damage, half speed in any direction, concealment when moving and invisibility when still, and the ability toe move through up to 2\' of solid material for 1 min"',
  'Qi Form':
    'Level=9 ' +
    'Traits=Monk,Uncommon,Concentrate,Focus,Polymorph ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="Self gains a %{speed}\' fly Speed, +1d6 HP force, spirit, vitality, or force damage, a 5\' aura that inflicts 2d6 HP that can be extended to 30\', nonlethal weapon attacks, -2 saves vs. emotion, and +2 saves vs. other mental for 1 min"',
  'Clinging Shadows Stance':
    'Level=4 ' +
    'Traits=Monk,Uncommon,Focus,Manipulate,Shadow,Stance ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="Stance gives +2 Grapple checks and DC to Escape and allows shadow grasp Strikes that inflict 1d4 HP void"',
  'Wild Winds Stance':
    Pathfinder2E.SPELLS['Wild Winds Stance']
    .replace('Evocation', 'Manipulate'),
  "Shadow's Web":
    'Level=7 ' +
    'Traits=Uncommon,Focus,Monk,Concentrate,Manipulate ' +
    'Traditions=Occult ' +
    'Cast=2 ' +
    'Description=' +
      '"30\' emanation inflicts 14d4 HP void and enfeebled 2 for 1 rd (<b>save Fortitude</b> inflicts half HP and enfeebled 1 for 1 rd; critical success negates; critical failure inflicts double HP, stunned 1, enfeebled 2 for 1 rd, and immobilized for 1 rd)"',
  'Harmonize Self':
    Pathfinder2E.SPELLS['Wholeness Of Body']
    .replace('Necromancy', 'Concentrate')
    .replace('Positive', 'Vitality'),
  'Wind Jump':
    Pathfinder2E.SPELLS['Wind Jump']
    .replace('Transmutation', 'Concentrate'),

  // Oracle
  'Ancestral Touch':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Emotion,Fear,Focus,Manipulate,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Ancestral Defense':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Focus,Fortune,Manipulate,Mental ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="TODO"',
  'Ancestral Form':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Weapon Trance':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Battlefield Persistence':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="TODO"',
  'Revel In Retribution':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Manipulate,Mental ' +
    'Traditions=Divine ' +
    'Cast=6 ' +
    'Description="TODO"',
  'Soul Siphon':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Focus,Manipulate,Void ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Armor Of Bones':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Claim Undead':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Incapacitation,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Spray Of Stars':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Concentrate,Fire,Focus,Light,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Interstellar Void':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Cold,Concentrate,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Moonlight Bridge':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Light,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Incendiary Aura':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Concentrate,Fire,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Whirling Flames':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Fire,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Flaming Fusillade':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Fire,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Life Link':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Focus,Healing,Manipulate,Vitality ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Delay Affliction':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Healing,Manipulate,Vitality ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Life-Giving Form':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Healing,Light,Manipulate,Vitality ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Brain Drain':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Manipulate,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Access Lore':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Dread Secret':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Emotion,Fear,Focus,Manipulate,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Tempest Touch':
    'Level=1 ' +
    'Traits=Oracle,Uncommon,Cold,Focus,Manipulate,Water ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Thunderburst':
    'Level=3 ' +
    'Traits=Oracle,Uncommon,Air,Concentrate,Focus,Manipulate,Sonic ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Tempest Form':
    'Level=6 ' +
    'Traits=Oracle,Uncommon,Concentrate,Focus,Manipulate,Polymorph ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  // Additional domain spells from Divine Mysteries
  'Withering Grasp':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Attack,Concentrate,Focus,Manipulate,Void ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Parch':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Air,Concentrate,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Swear Oath':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Charged Javelin':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Attack,Concentrate,Electricity,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Empty Inside':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Mental ' +
    'Traditions=Divine ' +
    'Cast=1 ' +
    'Description="TODO"',
  'Eject Soul':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Incapacitation,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Zenith Star':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Light,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Object Memory':
    'Level=1 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Fallow Field':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Manipulate,Void ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Dust Storm':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Air,Concentrate,Focus,Manipulate,Nonlethal ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Dutiful Challenge':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Bottle The Storm':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Electricity,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=Reaction ' +
    'Description="TODO"',
  'Door To Beyond':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Ectoplasmic Interstice':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Asterism':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Concentrate,Fire,Focus,Light,Manipulate ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',
  'Remember The Lost':
    'Level=4 ' +
    'Traits=Cleric,Uncommon,Concentrate,Focus,Manipulate,Mental ' +
    'Traditions=Divine ' +
    'Cast=2 ' +
    'Description="TODO"',

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
    .replace('Good', 'Holy')
    .replace('level', 'rank'),
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
  'Chthonian Wrath':
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
    .replace('Abjuration', 'Manipulate')
    .replace('level', 'rank'),
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
  // Define ancestry-specific unarmed attack weapons. Traits on some vary
  // between ancestries; these are modified by the individual features
  Pathfinder2E.weaponRules(
    rules, 'Beak', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
    ['Finesse', 'Unarmed'], null
  );
  Pathfinder2ERemaster.weaponRules(
    rules, 'Claws', 'Unarmed', 0, '1d4 S', 0, 0, 'Brawling',
    ['Agile', 'Finesse', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Fangs', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling', ['Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Hair', 'Unarmed', 0, '1d4 B', 0, 0, 'Brawling',
    ['Agile', 'Disarm', 'Finesse', 'Trip', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Hoof', 'Unarmed', 0, '1d6 B', 0, 0, 'Brawling',
    ['Finesse', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Jaws', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
    ['Finesse', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Nails', 'Unarmed', 0, '1d6 S', 0, 0, 'Brawling',
    ['Agile', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Slag Claws', 'Unarmed', 0, '1d6 S', 0, 0, 'Brawling',
    ['Grapple', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Spines', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
    ['Finesse', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Tail', 'Unarmed', 0, '1d6 B', 0, 0, 'Brawling',
    ['Sweep', 'Unarmed'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Talons', 'Unarmed', 0, '1d4 S', 0, 0, 'Brawling',
    ['Agile', 'Finesse', 'Unarmed', 'Versatile P'], null
  );
  Pathfinder2E.weaponRules(
    rules, 'Tusks', 'Unarmed', 0, '1d6 P', 0, 0, 'Brawling',
    ['Finesse', 'Unarmed'], null
  );
  // Most jaws attacks have the finesse trait; the few that do not can enable
  // the jawsNonFinesseAttack attribute to undo any finesse bonus
  rules.defineRule
    ('jawsNonFinesseAttack', 'finesseAttackBonus', '+', '-source');
  rules.defineRule('attackBonus.Jaws', 'jawsNonFinesseAttack', '+', null);
  rules.defineRule('weapons.Jaws.6', 'jawsNonFinesseAttack', '=', '"strength"');
};

/* Defines rules related to basic character identity. */
Pathfinder2ERemaster.identityRules = function(
  rules, ancestries, backgrounds, classes, deities, heritages
) {
  QuilvynUtils.checkAttrTable(heritages, ['Traits', 'Features', 'Selectables']);
  Pathfinder2E.identityRules
    (rules, {}, ancestries, backgrounds, classes, deities);
  for(let h in heritages)
    rules.choiceRules(rules, 'Heritage', h, heritages[h]);
};

/* Defines rules related to magic use. */
Pathfinder2ERemaster.magicRules = function(rules, spells) {
  Pathfinder2E.magicRules(rules, spells);
  ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
      rules.defineRule
        ('maxSpellRank', 'spellSlots.' + t.charAt(0) + l, '^=', l);
    });
  });
  rules.defineRule('maxSpellLevel', 'maxSpellRank', '=', null);
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
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
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
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
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
    type = 'generalFeats';
    QuilvynUtils.getAttrValueArray(attrs, 'Traits').forEach(a => {
      if(a == 'Archetype')
        type = 'classFeats';
      else if(a == 'Orc' ||
              a in (rules.getChoices('heritages') ||{}) ||
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
 * Defines in #rules# the rules associated with ancestry #name#. #hitPoints#
 * gives the number of HP granted at level 1 and #speed# the speed, #features#
 * and #selectables# list associated automatic and selectable features,
 * #languages# lists languages automatically known by characters with the
 * ancestry, and #traits# lists any traits associated with it.
 */
Pathfinder2ERemaster.ancestryRules = function(
  rules, name, hitPoints, speed, features, selectables, languages, traits
) {
  Pathfinder2E.ancestryRules
    (rules, name, hitPoints, speed, features, selectables, languages, traits);
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
  if(features.filter(x => x.match(/^(\d+:)?Low-Light Vision$/)).length > 0)
    rules.defineRule('hasAncestralLowLightVision', prefix + 'Level', '=', '1');
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to ancestryRules.
 */
Pathfinder2ERemaster.ancestryRulesExtra = function(rules, name) {
  Pathfinder2E.ancestryRulesExtra(rules, name);
  if(name == 'Catfolk') {
    rules.defineRule('weapons.Claws', 'combatNotes.clawedCatfolk', '=', '1');
    rules.defineRule
      ('weaponDieSidesBonus.Claws', 'combatNotes.clawedCatfolk', '^=', '2');
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
    rules.defineRule('weapons.Jaws', 'combatNotes.bite', '=', '1');
    rules.defineRule
      ('jawsNonFinesseAttack', 'combatNotes.bite', '=', '0'); // enable
  } else if(name == 'Kobold') {
    rules.defineRule('weapons.Jaws', 'combatNotes.strongjawKobold', '=', '1');
  } else if(name == 'Leshy') {
    rules.defineRule('weapons.Spines', 'combatNotes.cactusLeshy', '=', '1');
  } else if(name == 'Lizardfolk') {
    rules.defineRule('weapons.Claws', 'combatNotes.claws', '=', '1');
  } else if(name == 'Ratfolk') {
    rules.defineRule('weapons.Jaws', 'combatNotes.sharpTeeth', '=', '1');
    rules.defineRule('weaponDieSidesBonus.Jaws',
      'combatNotes.sharpTeeth', '^=', '-2' // decrease to 1d4
    );
    // Note: Ignore Agile trait currently not shown on character sheet
  } else if(name == 'Tengu') {
    rules.defineRule('weapons.Beak', 'combatNotes.sharpBeak', '=', '1');
    rules.defineRule
      ('weapons.Beak.5', 'combatNotes.dogtoothTengu', '=', '" [Crit +d8]"');
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
  if(name == 'Feybound') {
    rules.defineRule('featureNotes.anathema.1', 'feyboundLevel', '+', '16');
  } else if(name == 'Raised By Belief') {
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
    rules.defineRule
      ('skillNotes.formulaBook', 'skillNotes.toxicologist', '+', '2');
    // Suppress legacy note
    rules.defineRule('skillNotes.perpetualInfusions',
      'features.Perpetual Infusions', '?', null
    );
  } else if(name == 'Barbarian') {
    rules.defineRule('combatNotes.draconicRage',
      '', '=', '"mental"',
      'features.Dragon Instinct (Adamantine)', '=', '"bludgeoning"',
      'features.Dragon Instinct (Conspirator)', '=', '"poison"',
      'features.Dragon Instinct (Diabolic)', '=', '"fire"',
      'features.Dragon Instinct (Empyreal)', '=', '"spirit"',
      'features.Dragon Instinct (Fortune)', '=', '"force"',
      'features.Dragon Instinct (Horned)', '=', '"poison"'
    );
    rules.defineRule('combatNotes.rage',
      'combatNotes.superstitiousResilience', '^', null,
      'combatNotes.unstoppableFrenzy', '^', null
    );
    rules.defineRule('combatNotes.superstitiousResilience',
      '', '=', '3',
      'features.Weapon Specialization', '^', '7',
      'features.Greater Weapon Specialization', '^', '13'
    );
    rules.defineRule('combatNotes.unstoppableFrenzy',
      '', '=', '3',
      'features.Weapon Specialization', '^', '7',
      'features.Greater Weapon Specialization', '^', '13'
    );
    // Suppress legacy note
    rules.defineRule('combatNotes.furyInstinct',
      'featureNotes.furyInstinct', '?', null
    );
  } else if(name == 'Champion') {
    rules.defineRule('combatNotes.blessedShield',
      'level', '=', 'source<13 ? 3 : source<20 ? 5 : 7'
    );
    rules.defineRule('combatNotes.blessedShield.1',
      'features.Blessed Shield', '?', null,
      'level', '=', 'source<7?44:source<10?52:source<13?64:source<16?80:source<19?84:108'
    );
    rules.defineRule('combatNotes.exaltedReaction',
      'combatNotes.relentlessReaction', '=', null
    );
    // TODO generalize to handle homebrew?
    rules.defineRule('combatNotes.relentlessReaction',
      'featureNotes.desecration', '=', '"Selfish Shield"',
      'featureNotes.grandeur', '=', '"Flash Of Grandeur"',
      'featureNotes.iniquity', '=', '"Destructive Vengeance"',
      'featureNotes.justice', '=', '"Retributive Strike"',
      'featureNotes.liberation', '=', '"Liberating Step"',
      'featureNotes.obedience', '=', '"Iron Command"',
      'featureNotes.redemption', '=', '"Glimpse Of Redemption"'
    );
    rules.defineRule('featureNotes.blessingOfTheDevoted',
      '', '=', '1',
      'featureNotes.secondBlessing', '+', '1'
    );
    rules.defineRule
      ("features.Champion's Reaction", 'features.Cause', '=', '1');
    rules.defineRule('selectableFeatureCount.Champion (Blessing Of The Devoted)',
      'featureNotes.blessingOfTheDevoted', '=', null
    );
    rules.defineRule('selectableFeatureCount.Champion (Cause)',
      'featureNotes.cause', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Champion (Key Attribute)',
      'featureNotes.championKeyAttribute', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Champion (Sanctification)',
      'featureNotes.sanctification', '?', null,
      'deitySanctification', '?', 'source=="Either"',
      'levels.Champion', '=', '1',
      'featureNotes.championDedication', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Champion (Devotion Spell)',
      'featureNotes.devotionSpells', '=', '1'
    );
    rules.defineRule('shieldHardness', 'combatNotes.blessedShield', '+', null);
    rules.defineRule
      ('shieldHitPoints', 'combatNotes.blessedShield.1', '+', null);
    // Suppress legacy notes
    rules.defineRule
      ('skillNotes.deityAndCause', 'features.Deity And Cause', '?', null);
    rules.defineRule
      ('featureNotes.divineAlly', 'features.Divine Ally', '?', null);
    rules.defineRule('combatNotes.dragonslayerOath',
      'features.Dragonslayer Oath', '?', null
    );
    rules.defineRule('combatNotes.fiendsbaneOath',
      'features.Fiendsbane Oath', '?', null
    );
    rules.defineRule('combatNotes.shiningOath',
      'features.Shining Oath', '?', null
    );
  } else if(name == 'Cleric') {
    rules.defineRule('clericFeatures.Holy',
      'deitySanctification', '=', 'source=="Holy" ? 1 : null'
    );
    rules.defineRule('clericFeatures.Unholy',
      'deitySanctification', '=', 'source=="Unholy" ? 1 : null'
    );
    rules.defineRule('selectableFeatureCount.Cleric (Sanctification)',
      'featureNotes.sanctification', '?', null,
      'deitySanctification', '?', 'source=="Either"',
      'levels.Cleric', '=', '1',
      'featureNotes.clericDedication', '=', '1'
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
    rules.defineRule('combatNotes.weaponExpertise',
      classLevel, '=', 'source>=5 ? "Simple Weapons; Martial Weapons" : null'
    );
    rules.defineRule('featureNotes.skillfulLessons',
      classLevel, '=', 'Math.floor((source - 1) / 2)'
    );
    rules.defineRule('selectableFeatureCount.Investigator (Methodology)',
      'featureNotes.methodology', '=', '1'
    );
    rules.defineRule('skillNotes.pursueALead',
      '', '=', '1',
      'skillNotes.investigatorExpertise', '+', '1'
    );
    rules.defineRule
      ('skillNotes.skillIncreases', classLevel, '=', 'source - 1');
    rules.defineRule('skillNotes.investigatorSkills',
      'intelligenceModifier', '=', '4 + source'
    );
  } else if(name == 'Monk') {
    rules.defineRule('features.Ki Tradition (Divine)',
      'features.Qi Tradition (Divine)', '=', '1'
    );
    rules.defineRule('features.Ki Tradition (Occult)',
      'features.Qi Tradition (Occult)', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Monk (Key Attribute)',
      'featureNotes.monkKeyAttribute', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Monk (Qi Tradition)',
      'featureNotes.qiTradition', '=', null
    );
  } else if(name == 'Oracle') {
    rules.defineRule
      ('magicNotes.expertSpellcaster', classLevel, '=', '"Divine"');
    rules.defineRule
      ('magicNotes.legendarySpellcaster', classLevel, '=', '"Divine"');
    rules.defineRule
      ('magicNotes.masterSpellcaster', classLevel, '=', '"Divine"');
    rules.defineRule('selectableFeatureCount.Oracle (Mystery)',
      'featureNotes.mystery', '=', '1'
    );
    rules.defineRule
      ('skillNotes.oracleSkills', 'intelligenceModifier', '=', '3 + source');
    rules.defineRule('spellSlots.D10',
      'magicNotes.oracularClarity', '=', 'null', // italics
      'magicNotes.oracularProvidence', '+', '1'
    );
  } else if(name == 'Ranger') {
    // Easiest way to deal with legacy rules that depend on Wild Stride
    rules.defineRule
      ('features.Wild Stride', 'features.Unimpeded Journey', '=', '1');
    rules.defineRule
      ('magicNotes.masterfulHunter', 'magicNotes.initiateWarden', '?', null);
    rules.defineRule
      ('magicNotes.rangerExpertise', 'magicNotes.initiateWarden', '?', null);
    rules.defineRule('selectableFeatureCount.Ranger (Key Attribute)',
      'featureNotes.rangerKeyAttribute', '=', '1'
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
    ['Battledancer', 'Braggart', 'Fencer', 'Gymnast', 'Rascal', 'Wit'].forEach(s => {
      rules.defineRule('features.Exemplary Finisher (' + s + ')',
        'features.Exemplary Finisher', '?', null,
        'features.' + s, '=', '1'
      );
      rules.defineRule('features.Stylish Tricks (' + s + ')',
        'features.Stylish Tricks', '?', null,
        'features.' + s, '=', '1'
      );
      s = s.replaceAll(' ', '');
      rules.defineRule('featureNotes.stylishTricks(' + s + ')',
        classLevel, '=', 'source<7 ? 1 : source<15 ? 2 : 3'
      );
      rules.defineRule('skillNotes.stylishTricks(' + s + ')',
        classLevel, '=', 'source<7 ? 1 : source<15 ? 2 : 3'
      );
      rules.defineRule('skillNotes.skillIncreases',
        'skillNotes.stylishTricks(' + s + ')', '+', null
      );
    });
    rules.defineRule('abilityNotes.stylishCombatant',
      '', '=', '5',
      'abilityNotes.vivaciousSpeed.1', '+', null
    );
    rules.defineRule('abilityNotes.vivaciousSpeed',
      classLevel, '=', '5 * Math.floor((source + 5) / 8)'
    );
    rules.defineRule('abilityNotes.vivaciousSpeed.1',
      classLevel, '=', '5 * Math.floor((source + 5) / 4)'
    );
    rules.defineRule('combatNotes.weaponExpertise',
      classLevel, '=', 'source>=5 ? "Simple Weapons; Martial Weapons" : null'
    );
    rules.defineRule('skillNotes.swashbucklerSkills',
      'intelligenceModifier', '=', 'source + 4'
    );
    rules.defineRule('selectableFeatureCount.Swashbuckler (Style)',
      "featureNotes.swashbuckler'sStyle", '=', '1'
    );
  } else if(name == 'Witch') {
    // TODO Generalize for homebrew?
    let patronSkills = {
      "Faith's Flamekeeper":'Religion',
      'The Inscribed One':'Arcana',
      'The Resentment':'Occultism',
      'Silence In Snow':'Nature',
      'Spinner Of Threads':'Occultism',
      'Starless Shadow':'Occultism',
      'Wilding Steward':'Nature'
    };
    for(let p in patronSkills) {
      rules.defineRule('rank.' + p + ' Skill',
        'features.' + p, '?', null,
        'rank.' + patronSkills[p], '=', null
      );
      rules.defineRule('rank.patronSkill', 'rank.' + p + ' Skill', '^=', null);
    }
    rules.defineRule('witchTraditionsLowered',
      'witchTraditions', '=', 'source.toLowerCase()'
    );
    rules.defineRule
      ('magicNotes.expertSpellcaster', 'witchTraditions', '=', null);
    rules.defineRule
      ('magicNotes.legendarySpellcaster', 'witchTraditions', '=', null);
    rules.defineRule
      ('magicNotes.masterSpellcaster', 'witchTraditions', '=', null);
    rules.defineRule
      ('magicNotes.witchSpellcasting', 'witchTraditionsLowered', '=', null);
    rules.defineRule('selectableFeatureCount.Witch (Patron)',
      'featureNotes.patron', '=', '1'
    );
    rules.defineRule
      ('skillNotes.witchSkills', 'intelligenceModifier', '=', 'source + 3');
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
  Pathfinder2E.featRulesExtra(rules, name);
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  if(name == 'Acrobat Dedication') {
    rules.defineRule('skillNotes.acrobatDedication',
      'level', '=', 'source<7 ? "Expert" : source<15 ? "Master" : "Legendary"'
    );
  } if(name.match(/^(Advanced|Masterful|Peerless)\sWarden$/)) {
    rules.defineRule('magicNotes.' + prefix, 'feats.' + name, '=', null);
  } else if(name.match(/^(Advanced|Greater) Revelation$/)) {
    // TODO Homebrew mysteries
    ['Ancestors', 'Battle', 'Bones', 'Cosmos', 'Flames', 'Life', 'Lore',
     'Tempest'].forEach(m => {
      rules.defineRule('features.' + name + ' (' + m + ')',
        'features.' + name, '?', null,
        'features.' + m, '=', '1'
      );
    });
  } else if(name.match(/^Advanced (Deduction|Flair|Mysteries|Witchcraft)$/)) {
    rules.defineRule('featureNotes.' + prefix, 'feats.' + name, '=', null);
  } else if(name == 'Angelkin') {
    rules.defineRule('languages.Empyrean', 'skillNotes.angelkin', '=', '1');
  } else if(name.startsWith('Bestial Manifestation')) {
    rules.defineRule
      ('features.Bestial Manifestation', 'features.' + name, '=', '1');
    if(name.includes('Claw')) {
      rules.defineRule
        ('weapons.Claws', 'combatNotes.bestialManifestation(Claw)', '=', '1');
      // Add Versatile P trait
      rules.defineRule('weapons.Claws.4',
        'combatNotes.bestialManifestation(Claw)', '=', '"S/P"'
      );
    } else if(name.includes('Hoof')) {
      rules.defineRule
        ('weapons.Hoof', 'combatNotes.bestialManifestation(Hoof)', '=', '1');
    } else if(name.includes('Jaws')) {
      rules.defineRule
        ('weapons.Jaws', 'combatNotes.bestialManifestation(Jaws)', '=', '1');
    } else if(name.includes('Tail')) {
      rules.defineRule
        ('weapons.Tail', 'combatNotes.bestialManifestation(Tail)', '=', '1');
      rules.defineRule('weaponDieSidesBonus.Tail',
        'combatNotes.bestialManifestation(Tail)', '^=', '-2' // decrease to 1d4
      );
      // Add Finesse trait to this derivation of the Tail weapon
      rules.defineRule('combatNotes.bestialManifestation(Tail).1',
        'features.Bestial Manifestation (Tail)', '?', null,
         'finesseAttackBonus', '=', null
      );
      rules.defineRule('attackBonus.Tail',
        'combatNotes.bestialManifestation(Tail).1', '+', null
      );
      rules.defineRule('weapons.Tail.6',
        'combatNotes.bestialManifestation(Tail).1', '=', 'source>0 ? "dexterity" : "strength"'
      );
    }
  } else if(name.match(/^(Basic|Greater|Major) Lesson/)) {
    let hex =
      name.includes('Dreams') ? 'Veil Of Dreams' :
      name.includes('Elements') ? 'Elemental Betrayal' :
      name.includes('Life') ? 'Life Boost' :
      name.includes('Protection') ? 'Blood Ward' :
      name.includes('Vengeance') ? 'Needle Of Vengeance' :
      name.includes('Mischief') ? "Deceiver's Cloak" :
      name.includes('Shadow') ? 'Malicious Shadow' :
      name.includes('Snow') ? 'Personal Blizzard' :
      name.includes('Death') ? 'Curse Of Death' :
      name.includes('Renewal') ? 'Restorative Moment' :
      null;
    let rank = name.match('Basic') ? 1 : name.match('Greater') ? 3 : 5;
    rules.defineRule('magicNotes.' + prefix,
      'witchTraditions', '=', 'source.includes("arcane") ? "arcane" : source.includes("divine") ? "divine" : source.includes("occult") ? "occult" : "primal"'
    );
    if(hex) {
      ['arcane', 'divine', 'occult', 'primal'].forEach(t => {
        rules.defineRule('spells.' + hex + ' (' + t.charAt(0).toUpperCase() + rank + ' Foc)',
          'magicNotes.' + prefix, '=', 'source=="' + t + '" ? 1 : null'
        );
      });
    }
  } else if(name.match(/^(Bone Investiture|Fossil Rider|Primal Rampage)$/)) {
    rules.defineRule('features.' + name + ' (Occult)',
      'features.' + name, '?', null,
      'features.Bone Magic (Occult)', '=', '1'
    );
    rules.defineRule('features.' + name + ' (Primal)',
      'features.' + name, '?', null,
      'features.Bone Magic (Primal)', '=', '1'
    );
  } else if(name.startsWith('Bone Magic')) {
    rules.defineRule('features.Bone Magic', 'features.' + name, '=', '1');
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
  } else if(name == 'Cackle') {
    rules.defineRule('magicNotes.cackle',
      'witchTraditions', '=', 'source.includes("arcane") ? "arcane" : source.includes("divine") ? "divine" : source.includes("occult") ? "occult" : "primal"'
    );
    ['arcane', 'divine', 'occult', 'primal'].forEach(t => {
      rules.defineRule('spells.Cackle (' + t.charAt(0).toUpperCase() + '1 Foc)',
        'magicNotes.cackle', '=', 'source=="' + t + '" ? 1 : null'
      );
    });
  } else if(name.match(/^(Champion|Cleric) Dedication$/)) {
    let c = name.startsWith('Champion') ? 'Champion' : 'Cleric';
    // Suppress validation errors for selected sanctification
    let allSelectables = rules.getChoices('selectableFeatures');
    let sanctifications =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Sanctification'))
      .map(x => x.replace(/^\w+ - /, ''));
    sanctifications.forEach(s => {
      rules.defineRule('validationNotes.' + c.toLowerCase() + '-' + s.replaceAll(' ', '') + 'SelectableFeature',
        'feats.' + c + ' Dedication', '+', '1'
      );
    });
  } else if(name == "Champion's Reaction") {
    let allSelectables = rules.getChoices('selectableFeatures');
    let causes =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Cause)'))
      .map(x => x.replace('Champion - ', ''));
    causes.forEach(c => {
      rules.defineRule("features.Champion's Reaction (" + c + ")",
        "feats.Champion's Reaction", '?', null,
        'features.' + c, '=', '1'
      );
      rules.defineRule('featureNotes.' + c.charAt(0).toLowerCase() + c.substring(1).replaceAll(' ', ''),
        'levels.Champion', '?', null
      );
    });
  } else if(name == 'Cobra Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Cobra Fang', 'Unarmed', 0, '1d4 P', 0, 0, 'Brawling',
      ['Agile', 'Deadly d10', 'Finesse', 'Unarmed', 'Venomous'], null
    );
    rules.defineRule('weapons.Cobra Fang', 'features.Cobra Stance', '=', '1');
  } else if(name.startsWith('Crossblooded Evolution')) {
    rules.defineRule
      ('features.Crossblooded Evolution', 'features.' + name, '=', '1');
  } else if(name == 'Crunch') {
    rules.defineRule
      ('weaponDieSidesBonus.Jaws', 'combatNotes.crunch', '^=', '2');
    // Note: Ignore Grapple trait currently not shown on character sheet
  } else if(name == 'Deadly Aspect') {
    rules.defineRule('combatNotes.deadlyAspect.1',
      'combatNotes.deadlyAspect', '?', null,
      'features.Draconic Aspect (Claw)', '=', '" [Crit +d8]"'
    );
    rules.defineRule('combatNotes.deadlyAspect.2',
      'combatNotes.deadlyAspect', '?', null,
      'features.Draconic Aspect (Jaws)', '=', '" [Crit +d8]"'
    );
    rules.defineRule('combatNotes.deadlyAspect.3',
      'combatNotes.deadlyAspect', '?', null,
      'features.Draconic Aspect (Tail)', '=', '" [Crit +d8]"'
    );
    rules.defineRule
      ('weapons.Claws.5', 'combatNotes.deadlyAspect.1', '=', null);
    rules.defineRule('weapons.Jaws.5', 'combatNotes.deadlyAspect.2', '=', null);
    rules.defineRule('weapons.Tail.5', 'combatNotes.deadlyAspect.3', '=', null);
  } else if(name == 'Devout Blessing') {
    // Suppress validation errors for Blessings
    let allSelectables = rules.getChoices('selectableFeatures');
    let blessings =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Blessing Of The Devoted)'))
      .map(x => x.replace('Champion - ', ''));
    blessings.forEach(b => {
      rules.defineRule('validationNotes.champion-' + b.replaceAll(' ', '') + 'SelectableFeature',
        'features.' + name, '+', '1'
      );
    });
  } else if(name == 'Devout Magic') {
    rules.defineRule('selectableFeatureCount.Champion (Devotion Spell)',
      'featureNotes.' + prefix, '=', '1'
    );
    // Suppress validation errors for Devotion Spells
    let allSelectables = rules.getChoices('selectableFeatures');
    let spells =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Champion (Devotion Spell)'))
      .map(x => x.replace('Champion - ', ''));
    spells.forEach(s => {
      rules.defineRule('validationNotes.champion-' + s.replaceAll(' ', '') + 'SelectableFeature',
        'features.' + name, '+', '1'
      );
    });
  } else if(name.startsWith('Domain Acumen')) {
    rules.defineRule('features.Domain Acumen', 'features.' + name, '=', '1');
  } else if(name.startsWith('Draconic Aspect')) {
    rules.defineRule('features.Draconic Aspect', 'features.' + name, '=', '1');
    if(name.includes('Claw')) {
      rules.defineRule
        ('weapons.Claws', 'combatNotes.draconicAspect(Claw)', '=', '1');
    } else if(name.includes('Jaws')) {
      rules.defineRule
        ('weapons.Jaws', 'combatNotes.draconicAspect(Jaws)', '=', '1');
      rules.defineRule('jawsNonFinesseAttack',
        'combatNotes.draconicAspect(Jaws)', '=', '0' // enable
      );
      // Note: Ignore Forceful trait currently not shown on character sheet
    } else if(name.includes('Tail')) {
      rules.defineRule
        ('weapons.Tail', 'combatNotes.draconicAspect(Tail)', '=', '1');
      // Note: Ignore Trip trait currently not shown on character sheet
    }
  } else if(name == 'Draconic Resistance') {
    rules.defineRule('saveNotes.draconicResistance',
      // NOTE: Nethys removes ambiguity; resistance to bludgeoning isn't allowed
      'features.Adamantine Exemplar', '=', '"a choice of acid, cold, fire, electricity, or sonic"',
      'features.Conspirator Exemplar', '=', '"poison"',
      'features.Diabolic Exemplar', '=', '"fire"',
      'features.Empyreal Exemplar', '=', '"spirit"',
      'features.Fortune Exemplar', '=', '"force"',
      'features.Horned Exemplar', '=', '"poison"',
      'features.Mirage Exemplar', '=', '"mental"',
      'features.Omen Exemplar', '=', '"mental"'
    );
  } else if(name == 'Draconic Sight') {
    rules.defineRule('featureNotes.draconicSight',
      '', '=', '"Low-Light Vision"',
      'hasAncestralLowLightVision', '=', '"Darkvision"'
    );
    rules.defineRule('features.Darkvision',
      'featureNotes.draconicSight', '=', 'source=="Darkvision" ? 1 : null'
    );
    rules.defineRule('features.Low-Light Vision',
      'featureNotes.draconicSight', '=', 'source=="Low-Light Vision" ? 1 : null'
    );
  } else if(name == 'Draconic Veil') {
    rules.defineRule('features.Draconic Veil (Arcane)',
      'features.Draconic Veil', '?', null,
      'features.Arcane Dragonblood', '=', '1'
    );
    rules.defineRule('features.Draconic Veil (Divine)',
      'features.Draconic Veil', '?', null,
      'features.Divine Dragonblood', '=', '1'
    );
    rules.defineRule('features.Draconic Veil (Occult)',
      'features.Draconic Veil', '?', null,
      'features.Occult Dragonblood', '=', '1'
    );
    rules.defineRule('features.Draconic Veil (Primal)',
      'features.Draconic Veil', '?', null,
      'features.Primal Dragonblood', '=', '1'
    );
  } else if(name == 'Fangs') {
    rules.defineRule('weapons.Fangs', 'combatNotes.fangs', '=', '1');
    // Note: Ignore Grapple trait currently not shown on character sheet
  } else if(name == 'First Revelation') {
    let mysteries =
      rules.plugin.CLASSES.Oracle.match(/([\s\w]*:Mystery)/g)
      .map(x => x.replace(':Mystery', ''));
    mysteries.forEach(s => {
      rules.defineRule('features.First Revelation (' + s + ')',
        'features.First Revelation', '?', null,
        'features.' + s, '=', '1'
      );
    });
  } else if(name == 'Form Of The Dragon') {
    rules.defineRule('features.Form Of The Dragon (Arcane)',
      'features.Form Of The Dragon', '?', null,
      'features.Arcane Dragonblood', '=', '1'
    );
    rules.defineRule('features.Form Of The Dragon (Divine)',
      'features.Form Of The Dragon', '?', null,
      'features.Divine Dragonblood', '=', '1'
    );
    rules.defineRule('features.Form Of The Dragon (Occult)',
      'features.Form Of The Dragon', '?', null,
      'features.Occult Dragonblood', '=', '1'
    );
    rules.defineRule('features.Form Of The Dragon (Primal)',
      'features.Form Of The Dragon', '?', null,
      'features.Primal Dragonblood', '=', '1'
    );
  } else if(name == "Gecko's Grip") {
    rules.defineRule("abilityNotes.gecko'sGrip",
      'features.Cliffscale Lizardfolk', '?', 'source'
    );
    rules.defineRule("featureNotes.gecko'sGrip",
      'features.Cliffscale Lizardfolk', '?', '!source'
    );
    rules.defineRule("skillNotes.gecko'sGrip",
      'features.Cliffscale Lizardfolk', '?', '!source'
    );
  } else if(name == 'Gifted Power') {
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(l => {
      rules.defineRule('magicNotes.giftedPower', 'spellSlots.D' + l, '^=', l);
      rules.defineRule('spellSlots.D' + l,
        'magicNotes.giftedPower', '+', 'source==' + l + ' ? 1 : null'
      );
    });
  } else if(name == 'Gnome Obsession') {
    // Override legacy rule
    rules.defineRule('skillNotes.gnomeObsession', 'level', '=', 'null');
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
    // No mods needed to base Claw attributes
    rules.defineRule('weapons.Claws', 'combatNotes.hagClaws', '=', '1');
  } else if(name.match(/^(Improved|Supreme) Invigorating Elixir/)) {
    rules.defineRule('skillNotes.invigoratingElixir',
      'skillNotes.' + prefix, '=', 'null' // italics
    );
  } else if(name == 'Interweave Dispel') {
    rules.defineRule('knowsDispelMagicSpell',
      'spells.Dispel Magic (A2)', '=', '1',
      'spells.Dispel Magic (D2)', '=', '1',
      'spells.Dispel Magic (O2)', '=', '1',
      'spells.Dispel Magic (P2)', '=', '1'
    );
  } else if(name == 'Initiate Warden') {
    rules.defineRule
      ('spellAbility.Primal', 'magicNotes.initiateWarden', '=', '"wisdom"');
    rules.defineRule('spellModifier.Ranger',
      'magicNotes.initiateWarden', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('spellModifier.Primal', 'spellModifier.Ranger', '=', null);
    rules.defineRule
      ('magicNotes.initiateWarden-1', 'feats.Initiate Warden', '=', null);
  } else if(name == 'Invulnerable Rager') {
    rules.defineRule('combatNotes.invulnerableRager',
      'rank.Medium Armor', '=', 'source==4 ? "Legendary" : source==3 ? "Master" : source==2 ? "Expert" : null'
    );
  } else if(name.startsWith('Iruxi Armaments')) {
    if(name == 'Iruxi Armaments (Claws)') {
      rules.defineRule('weaponDieSidesBonus.Claws',
        'combatNotes.iruxiArmaments(Claws)', '^=', '2' // increase to 1d6
      );
      // Add the Versatile P trait
      rules.defineRule('weapons.Claws.4',
        'combatNotes.iruxiArmaments(Claws)', '=', '"S/P"'
      );
    } else if(name == 'Iruxi Armaments (Fangs)') {
      rules.defineRule
        ('weapons.Fangs', 'combatNotes.iruxiArmaments(Fangs)', '=', '1');
      rules.defineRule('weaponDieSidesBonus.Fangs',
        'combatNotes.iruxiArmaments(Fangs)', '^=', '2' // increase to 1d8
      );
    } else if(name == 'Iruxi Armaments (Tail)') {
      rules.defineRule
        ('weapons.Tail', 'combatNotes.iruxiArmaments(Tail)', '=', '1');
      // Note: Ignore Sweep trait currently not shown on character sheet
    }
    rules.defineRule('combatNotes.' + prefix + '-1', 'level', '?', 'source>=5');
  } else if(name == 'Lasting Armament') {
    rules.defineRule('combatNotes.sanctifyArmament',
      'combatNotes.lastingArmament', '=', 'null' // italics
    );
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
  } else if(name == 'Monastic Archer Stance') {
    rules.defineRule('combatNotes.monasticArcherStance',
      '', '=', '"Trained"',
      'features.Expert Strikes', '=', '"Expert"',
      'features.Master Strikes', '=', '"Master"'
    );
  } else if(name == 'Oracle Dedication') {
    rules.defineRule('spellModifier.' + name,
      'magicNotes.oracleDedication', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule
      ('spellModifier.Divine', 'spellModifier.' + name, '=', null);
    rules.defineRule('spellAbility.Divine',
      'magicNotes.oracleDedication', '=', '"charisma"'
    );
    rules.defineRule
      ('spellSlots.DC1', 'magicNotes.oracleDedication', '+=', '2');
    // Suppress validation errors for Mysteries and mystery features that don't
    // come from OD
    let allSelectables = rules.getChoices('selectableFeatures');
    let mysteries =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Oracle (Mystery)'))
      .map(x => x.replace('Oracle - ', ''));
    mysteries.forEach(m => {
      rules.defineRule('validationNotes.oracle-' + m.replaceAll(' ', '') + 'SelectableFeature',
        'features.' + name, '+', '1'
      );
      m = m.charAt(0).toLowerCase() + m.substring(1).replaceAll(' ', '');
      rules.defineRule('featureNotes.' + m + '-1', 'levels.Oracle', '?', null);
      rules.defineRule('magicNotes.' + m, 'levels.Oracle', '?', null);
    });
  } else if(name == 'Pack Stalker') {
    // Make sure there's a featCount.Skill to increment
    rules.defineRule('featCount.Skill', 'features.Pack Stalker', '^=', '0');
  } else if(name == "Patron's Truth") {
    rules.defineRule('spellSlots.A10', "magicNotes.patron'sTruth", '+', '1');
    rules.defineRule('spellSlots.D10', "magicNotes.patron'sTruth", '+', '1');
    rules.defineRule('spellSlots.O10', "magicNotes.patron'sTruth", '+', '1');
    rules.defineRule('spellSlots.P10', "magicNotes.patron'sTruth", '+', '1');
  } else if(name.startsWith('Qi Spells')) {
    rules.defineRule('features.Qi Spells', 'features.' + name, '=', '1');
  } else if(name == 'Reliable Luck') {
    rules.defineRule
      ("saveNotes.cat'sLuck", 'saveNotes.reliableLuck', '=', 'null'); // italics
  } else if(name == 'Saber Teeth') {
    rules.defineRule('weapons.Jaws', 'combatNotes.saberTeeth', '=', '1');
    rules.defineRule
      ('jawsNonFinesseAttack', 'combatNotes.saberTeeth', '=', '0'); // enable
  } else if(name == 'Scaly Hide') {
    rules.defineRule('combatNotes.scalyHide.1',
      'armorCategory', '?', 'source=="Unarmored"',
      'combatNotes.scalyHide', '=', '2'
    );
    rules.defineRule('armorClass', 'combatNotes.scalyHide.1', '+', null);
    // NOTE: apparently reduced dex cap only applies if unarmored
    rules.defineRule('armorDexterityCap', 'combatNotes.scalyHide.1', 'v=', '3');
  } else if(name == 'Settlement Scholastics') {
    rules.defineRule('featureNotes.' + prefix, 'feats.' + name, '=', null);
    rules.defineRule('skillNotes.' + prefix, 'feats.' + name, '=', null);
  } else if(name == 'Slag May') {
    rules.defineRule('weapons.Slag Claws', 'combatNotes.slagMay', '=', '1');
  } else if(name == 'Tengu Feather Fan') {
    rules.defineRule('magicNotes.waveFan',
      'magicNotes.tenguFeatherFan', '=', '1',
      "magicNotes.windGod'sFan", '+', '1',
      "magicNotes.thunderGod'sFan", '+', '1'
    );
  } else if(name == 'Stumbling Stance') {
    Pathfinder2E.weaponRules(
      rules, 'Stumbling Swing', 'Unarmed', 0, '1d8 B', 0, 0, 'Brawling',
      ['Agile', 'Backstabber', 'Finesse', 'Nonlethal', 'Unarmed'], null
    );
    rules.defineRule
      ('weapons.Stumbling Swing', 'features.Stumbling Stance', '=', '1');
  } else if(name == 'Swashbuckler Dedication') {
    // Suppress validation errors for Styles and style features that don't
    // come from SD
    let allSelectables = rules.getChoices('selectableFeatures');
    let styles =
      Object.keys(allSelectables)
      .filter(x => allSelectables[x].includes('Swashbuckler (Style)'))
      .map(x => x.replace('Swashbuckler - ', ''));
    styles.forEach(s => {
      rules.defineRule('validationNotes.swashbuckler-' + s.replaceAll(' ', '') + 'SelectableFeature',
        'features.' + name, '+', '1'
      );
      s = s.charAt(0).toLowerCase() + s.substring(1).replaceAll(' ', '');
      rules.defineRule('featureNotes.' + s, 'levels.Swashbuckler', '?', null);
    });
  } else if(name == 'Tap Into Blood') {
    ['Arcane', 'Divine', 'Occult', 'Primal'].forEach(t => {
      rules.defineRule('features.Tap Into Blood (' + t + ')',
        'features.Tap Into Blood', '?', null,
        'sorcererTraditions', '=', 'source.match(/' + t + '/) ? 1 : null'
      );
    });
  } else if(name == 'Traditional Resistances') {
    rules.defineRule('saveNotes.traditionalResistances',
      'features.Arcane Dragonblood', '=', '"arcane"',
      'features.Divine Dragonblood', '=', '"divine"',
      'features.Occult Dragonblood', '=', '"occult"',
      'features.Primal Dragonblood', '=', '"primal"'
    );
  } else if(name == 'Tusks') {
    rules.defineRule('weapons.Tusks', 'combatNotes.tusks', '=', '1');
  } else if(name == 'Untamed Form') {
    rules.defineRule
      ('spells.Untamed Form (P1 Foc)', 'magicNotes.untamedForm', '=', '1');
  } else if(name == 'Vicious Incisors') {
    rules.defineRule
      ('weaponDieSidesBonus.Jaws', 'combatNotes.viciousIncisors', '^=', '0');
    // Note: Ignore Backstabber trait currently not shown on character sheet
  } else if(name == "Warpriest's Armor") {
    rules.defineRule("combatNotes.warpriest'sArmor",
      'rank.Medium Armor', '=', 'source==1 ? "Trained" : source==2 ? "Expert" : source==3 ? "Master" : "Legendary"'
    );
  } else if(name.startsWith('Weapon Proficiency')) {
    rules.defineRule('combatNotes.' + prefix,
      'level', '=', 'source<11 ? "Trained" : "Expert"'
    );
  } else if(name.startsWith('Witch Dedication')) {
    // Suppress validation errors for selected patron and the notes for features
    // of patron that don't come with Witch Dedication
    // TODO Suppress standard patron spells
    let allSelectables = rules.getChoices('selectableFeatures');
    let patrons =
      Object.keys(allSelectables).filter(x => allSelectables[x].includes('Witch (Patron)')).map(x => x.replace('Witch - ', ''));
    patrons.forEach(m => {
      let condensed = m.replaceAll(' ', '');
      let noteName = condensed.charAt(0).toLowerCase() + condensed.substring(1);
      rules.defineRule('validationNotes.witch-' + condensed + 'SelectableFeature',
        'featureNotes.witchDedication', '+', '1'
      );
      rules.defineRule
        ('magicNotes.' + noteName + '-1', 'levels.Witch', '?', null);
    });
  } else if(name.startsWith("Witch's Armaments")) {
    rules.defineRule
      ("features.Witch's Armaments", 'features.' + name, '=', '1');
    if(name.includes('Nails')) {
      rules.defineRule('weapons.Nails',
        "combatNotes.witch'sArmaments(EldritchNails)", '=', '1'
      );
    } else if(name.includes('Teeth')) {
      rules.defineRule('weapons.Jaws',
        "combatNotes.witch'sArmaments(IronTeeth)", '=', '1'
      );
      rules.defineRule('weaponDieSidesBonus.Jaws',
        "combatNotes.witch'sArmaments(IronTeeth)", '^=', '2' // increase to 1d8
      );
      rules.defineRule('jawsNonFinesseAttack',
        "combatNotes.witch'sArmaments(IronTeeth)", '=', '0' // enable
      );
    } else if(name.includes('Hair')) {
      rules.defineRule('weapons.Hair',
        "combatNotes.witch'sArmaments(LivingHair)", '=', '1'
      );
    }
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
        'witchTraditions', '?', 'source && source.includes("' + trad + '")',
        'levels.Witch', '=', null
      );
      rules.defineRule('witchTraditions',
        'features.' + name, '=', '!dict.witchTraditions ? "' + trad + '" : !dict.witchTraditions.includes("' + trad + '") ? dict.witchTraditions + "; ' + trad + '" : dict.witchTraditions'
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
 * which has the list of traits #traits# and the list of fixed and selectable
 * features #features# and #selectables#.
 */
Pathfinder2ERemaster.heritageRules = function(
  rules, name, traits, features, selectables
) {

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let heritageLevel = prefix + 'Level';

  rules.defineRule(heritageLevel,
    'features.' + name, '?', null,
    'level', '=', null
  );

  Pathfinder2E.featureListRules
    (rules, ['1:' + name + ':Heritage'], 'Versatile Heritage', heritageLevel,
     true);
  Pathfinder2E.featureListRules(rules, features, name, heritageLevel, false);
  Pathfinder2E.featureListRules(rules, selectables, name, heritageLevel, true);
  selectables.forEach(selectable => {
    let pieces = selectable.split(':');
    let s = pieces[pieces.length > 1 && pieces[0].match(/\d+$/) ? 1 : 0];
    let sType = s == s[pieces.length - 1] ? '' : pieces[pieces.length - 1];
    let sCount = prefix + sType.replaceAll(' ', '') + 'Count';
    rules.defineRule(sCount, prefix + 'Features.' + s, '+=', '1');
    QuilvynRules.validAllocationRules
      (rules, prefix + sType.replaceAll(' ', ''), 'selectableFeatureCount.' + name + (sType != '' ? ' (' + sType + ')' : ''), sCount);
  });

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

  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

};

/*
 * Defines in #rules# the rules associated with versatile heritage #name# that
 * cannot be derived directly from the attributes passed to heritageRules.
 */
Pathfinder2ERemaster.heritageRulesExtra = function(rules, name) {
  if(name == 'Dragonblood') {
    rules.defineRule('selectableFeatureCount.Dragonblood (Draconic Exemplar)',
      'featureNotes.draconicExemplar', '=', '1'
    );
  } else if(name == 'Duskwalker') {
    rules.defineRule('combatNotes.duskwalkerWeaponFamiliarity-1',
      'level', '?', 'source >= 5'
    );
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
  if(traits.includes('Focus') && !traits.includes('Cantrip'))
    rules.defineRule('focusPoints', 'spells.' + name, '+', '1');
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
  if(traits.includes('Monk') && category == 'Advanced')
    rules.defineRule('weaponFamiliarity.' + name,
      'weaponFamiliarity.Advanced Monk Weapons', '=', null
    );
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
    '  </li><li>\n' +
    '  For consistency with the features of other classes, Quilvyn gives ' +
    '  barbarians Medium Armor Master at level 19, rather than Armor Mastery ' +
    "  that doesn't apply to heavy armor.\n" +
    '  </li><li>\n' +
    '  Shattering Strike is both a Monk feat and a Weapon Improviser feat, ' +
    '  but the two have different effects. To avoid confusion, Quilvyn ' +
    '  defines the feats Shattering Strike (Monk) and Shattering Strike ' +
    '  (Weapon Improviser).\n' +
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
