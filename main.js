// import modules


require('prototype.creep');
require('Roomstate');
require('prototype.structure');
var globalspawn = require('Globalspawnque')
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleHauler = require('role.Hauler');
var roleTug = require('role.tug');
var roleClamer = require('role.clamer');
var roleAttacker = require('role.attacker');
var roleReclaimer = require('role.reclaimer');
var roleCapture = require('role.capture');
var bootStrapWorker = require('role.bootstrapworker');
var bootStrapHauler = require('role.bootstraphauler');
var roleDrain = require('role.drain');
var roleDefender = require('role.defender');
var roleBuilder = require('role.builder');
var roleWorker = require('role.worker');
//blargh
const profiler = require('screeps-profiler');
global.DEBUG = false;
global.MYROOMS = {

	'W18S22' : ['W17S22', 'W19S22', 'W18S21','W19S21'],
	'W16S21' : ['W17S21', 'W16S22'],
	'W18S23' : ['W19S23', 'W18S24', 'W18S25', 'W19S24']

}
global.ENERGY_RESERVE = 50000;
global.WALL_HEALTH = 5000000



profiler.enable();
module.exports.loop = function() {
profiler.wrap(function() {

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
		if (Game.rooms[room] != undefined ) {
			var towers = Game.rooms[room].find(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_TOWER
			});
		}
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
		for (let structuretype in Memory.structures ) {
			for (let strutureid in structuretype) {
				if (Game.getObjectById(strutureid) == null || undefined) {
					delete Memory.structures[structuretype[strutureid]];
				} 
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
        else if (creep.memory.role == 'hauler'){
            roleHauler.run(creep);
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
		else if (creep.memory.role == 'drain') {
            roleDrain.run(creep);
        }
        else if (creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
		 else if (creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
		else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }






	for (let spawnname in Game.spawns) {
		let spawn = Game.spawns[spawnname];
		spawn.factory();
	}
	for ( let roomname in MYROOMS) {
		let room = Game.rooms[roomname];
		if (room == undefined) {
			Memory.roomstates[roomname] = {};
			Memory.roomstates[roomname].claiming = true;
		}
		else {
		room.check();
		}
		let slaverooms = MYROOMS[roomname]
		for ( let i = 0; i < slaverooms.length; ++i) {
			
			let room = Game.rooms[slaverooms[i]];
			if(room) {
			let reds = room.find(FIND_HOSTILE_CREEPS);
			if (reds.length) {
				let flag = room.find(FIND_FLAGS, {filter: (f) => f.color == COLOR_BLUE })
				console.log(flag);
				if (flag.length < 1 ) {
					let flagname = room.controller.pos.createFlag(undefined, COLOR_BLUE);
					Memory.rooms[roomname].spawnque.unshift("defender", flagname,"END")
				}
			}
			}
		}
	}
	_.invoke(Game.structures, 'run');

 });
}