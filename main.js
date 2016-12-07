// import modules

require('spawn.factory');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHauler = require('role.Hauler');
var roleWallRepairer = require('role.wallRepairer');
var roleEnergytug = require('role.energytug');
var roleClamer = require('role.clamer');
var roleAttacker = require('role.attacker');
global.HOME = 'W49S71' ;



module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'hauler'){
            roleHauler.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
		 else if (creep.memory.role == 'claimer') {
            roleClamer.run(creep);
        }
		else if (creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
        
    }

    var towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
    });
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            }
            else {
                target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (c) =>
                    (c.hits < c.hitsMax)});
                    if (target != undefined) {
                        tower.heal(target);
                    }
                
            }
        } 

	Game.spawns.Spawn1.factory() ;
	
	

    
    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false

};