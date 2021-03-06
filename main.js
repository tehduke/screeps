// import modules


require('prototype.creep');
require('Roomstate');
require('prototype.structure');
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
var roleMagpie = require('role.magpie');
//blargh
const profiler = require('screeps-profiler');
global.DEBUG = false;
global.MYROOMS = {

	'W39S51' : ['W39S52', 'W38S51','W38S52'],
	'W39S55' : []

}
global.ENERGY_RESERVE = 50000;
global.WALL_HEALTH = 5000000;



profiler.enable();
module.exports.loop = function() {
profiler.wrap(function() {

		var tickCount = function() { 
			if (!Memory.tickCount) {
				Memory.tickCount = 0;
			}
			if (Memory.tickCount === 99 ){
				Memory.tickCount = 0;
			}
			else {
			Memory.tickCount++;
			}
		}

	
	
	tickCount();
//Dumb towerCode toBe Rewitten on the defence update
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

    // cleenup memory of dead things
		for (let name in Memory.creeps) {

			if (Game.creeps[name] == undefined) {

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
	
	

    // run the roles. Should change to _.invoke(Game.creeps, 'run') and at least get this crap out of the main loop.
    for (let name in Game.creeps) {

        var creep = Game.creeps[name];


        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

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
		else if (creep.memory.role == 'magpie') {
            roleMagpie.run(creep);
        }
    }






// should again make this a run method on rooms. #legacycodefromwhenIdidntknowthefuckiwasdoing
	for ( let roomname in MYROOMS) {
		let room = Game.rooms[roomname];
		if (room == undefined) {
			Memory.roomstates[roomname] = {};
			Memory.roomstates[roomname].claiming = true;
		}
		else {
		room.check();
		}
		//basic call to arms code for slaverooms
		let slaverooms = MYROOMS[roomname]
		for ( let i = 0; i < slaverooms.length; ++i) {
			
			let room = Game.rooms[slaverooms[i]];
			if(room) {
			let reds = room.find(FIND_HOSTILE_CREEPS);
			if (reds.length) {
				let flag = room.find(FIND_FLAGS, {filter: (f) => f.color == COLOR_BLUE })
				if (flag.length < 1 ) {
					let flagname = room.controller.pos.createFlag(undefined, COLOR_BLUE);
					Memory.rooms[roomname].spawnque.unshift("defender", flagname,"END")
				}
			}
			}
		}
	}
	//sexylodash usage
	_.invoke(Game.structures, 'run');

 });
}