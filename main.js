// import modules

require('spawn.factory');
require('prototype.creep');
require('Roomstate');
var globalspawn = require('Globalspawnque')
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHauler = require('role.Hauler');
var roleWallRepairer = require('role.wallRepairer');
var roleTug = require('role.tug');
var roleClamer = require('role.clamer');
var roleAttacker = require('role.attacker');
var roleReclaimer = require('role.reclaimer');
var roleCapture = require('role.capture');
var bootStrapWorker = require('role.bootstrapworker');
var bootStrapHauler = require('role.bootstraphauler');


global.MYROOMS = {
	'W18S22' : ['W17S22', 'W19S22', 'W18S21', 'W19S21'],
	'W16S21' : ['W17S21', 'W16S22', 'W16S23']
}
global.ENERGY_RESERVE = 25000;



module.exports.loop = function () {

		var tickCount = function() { 
			if (!Memory.tickCount) {
				Memory.tickCount = 0;
			}
			if (Memory.tickCount == 99 ){
				Memory.tickCount = 0;
			}
			else {
			Memory.tickCount++;
			}
		}

	
	
	tickCount();
	for (let room in MYROOMS) {
		var towers = Game.rooms[room].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
		});
	if (towers != undefined) {
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
	}	
	}
		
	 

	
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
		else if (creep.memory.role == 'tug') {
			roleTug.run(creep);
		}
		else if (creep.memory.role == 'reclaimer') {
			roleReclaimer.run(creep);
		}
		else if (creep.memory.role == 'capture') {
			roleCapture.run(creep);
		}
		else if (creep.memory.role == 'bootstrapworker') {
			bootStrapWorker.run(creep);
		}
		else if (creep.memory.role == 'bootstraphauler') {
			bootStrapHauler.run(creep);
		}
        
    }



	for (let spawnname in Game.spawns) {
		let spawn = Game.spawns[spawnname];
		spawn.factory();
	}
	for ( roomname in MYROOMS) {
		let room = Game.rooms[roomname];
		if (room == undefined) {
			Memory.roomstates[roomname] = {};
			Memory.roomstates[roomname].claiming = true;
		}
		else {
		room.check();
		}
	}

};