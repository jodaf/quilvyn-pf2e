## Pathfinder 2E plugin for the Quilvyn RPG character sheet generator

The quilvyn-pf2e package bundles modules that extend Quilvyn to work with
the Second Edition Pathfinder RPG, applying the rules of the
<a href="https://2e.aonprd.com/Default.aspx">Pathfinder 2E Reference
Document</a>.

### Requirements

quilvyn-pf2e relies on the core modules installed by the quilvyn-core package.

### Installation

To use quilvyn-pf2e, unbundle the release package, making sure that the
contents of the plugins/ and Images/ subdirectories are placed into the
corresponding Quilvyn installation subdirectories, then append the following
lines to the file plugins/plugins.js:

    RULESETS['Pathfinder 2E (Legacy)'] = {
      url:'plugins/Pathfinder2E.js',
      group:'Pathfinder'
    };
    RULESETS['Pathfinder 2E (Remaster)'] = {
      url:'plugins/Pathfinder2ERemaster.js',
      group:'Pathfinder',
      require:'Pathfinder2E.js'
    };
    RULESETS['Pathfinder 2E Remaster w/legacy features'] = {
      url:'plugins/Pathfinder2ERemaster.js',
      group:'Pathfinder',
      require:'Pathfinder2E.js'
    };

### Usage

Once the Pathfinder2E plugin is installed as described above, start Quilvyn and
choose Pathfinder 2E from the Rules menu in the editor window.
