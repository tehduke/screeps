require('prototype.creep');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		//build tasklisk function
		var genTaskList = function (creep) {
			if (!creep.memory.tasklisk) {
				creep.memory.tasklisk = new Array();
			}
			//test is room has a link
			var link = Game.getObjectById(creep.memory.linkid);
			//find dropped energy and pickit up
			var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
			if(target) {
				creep.memory.tasklisk.push('gatherdroppedenergy');
			}
		
			//test if link exists or if its undefined
			if (link == null && creep.memory.linkid != false ) {
				link = creep.room.storage.findByRange(FIND_MY_STRUCTURES, 1 , {filter: (s) => 
				s.structureType == STRUCTURE_LINK
				});
				if (link != undefined ) {
					creep.memory.linkid = link.id;
				}
				else {
					creep.memory.linkid = false;
				}
			}
			else if (link.energy > 0 ) {
				creep.memory.tasklisk.push('emptylink');
			}
			var targets = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => 
			s.energy < s.energyCapacity
			});
			if ( targets != undefined ) {
				creep.memory.tasklisk.push('fillspawn');
			}
			//posbitch task
			
		}
		if (!creep.memory.targetid) {
			creep.memory.targetid = false;
		}
		//TTL code + switch to suicide
		//test for creep memory tasklisk
		var storage = creep.room.storage;
		if (!creep.memory.tasklisk || creep.memory.tasklisk.length == 0) {
			genTaskList(creep)
		}
		if (creep.memory.tasklisk[0] == 'emptylink') {
			var link = Game.getObjectById(creep.memory.linkid);
			var storage = creep.room.storage
			//test if link is empty then remove task
			if (link.energy == 0 ) {
				if (creep.carry.energy < creep.carryCapacity ) {
					if ( creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
						creep.moveTo(storage);
					}
				}
				else {
					creep.memory.tasklisk.splice(0, 1);
				}
			}
			else {
				if (creep.carry.energy == creep.carryCapacity) {
					if ( creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
						creep.moveTo(storage);
					}
				}
				if ( creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
						creep.moveTo(link);
				}
			}
		}
		if (creep.memory.tasklisk[0] == 'gatherdroppedenergy') {
			if (creep.memory.targetid == false ) {
				var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
				if (target != undefined ) {
					creep.memory.targetid = target.id
				}
				else {
					if (creep.carry.energy < creep.carryCapacity ) {
						if ( creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
							creep.moveTo(storage);
						}
					}
					else {
						creep.memory.tasklisk.splice(0, 1);
					}
				}
			}
			var target = Game.getObjectById(creep.memory.targetid);
			if (target == null ) {
				creep.memory.targetid = false;
			}
			if ( creep.carry.energy < creep.carryCapacity ) {
				if (creep.pickup(target) == ERR_NOT_IN_RANGE ) {
					creep.moveTo(target);
				}
			}
			else {
				if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage);
				}
			}
		}
		
		if (creep.memory.tasklisk[0] == 'fillspawn') {
			if (creep.memory.targetid == false ) {
				var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => 
				s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
				});
				if (target == undefined) {
					target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => 
					(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity
					});
					if (target == undefined) {
						if (creep.carry.energy < creep.carryCapacity ) {
							if ( creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
								creep.moveTo(storage);
							}
						}
						else {
							creep.memory.tasklisk.splice(0, 1);
						}
					}
				}
				creep.memory.targetid = target.id;
			}
			if (creep.carry.energy == 0 ) {
				creep.memory.targetid = false;
				creep.memory.tasklisk.splice(0, 1);
			}
			var target = Game.getObjectById(creep.memory.targetid);
			if (target == null ) {
				creep.memory.targetid = false;
			}
			var transferReturn = creep.transfer(target, RESOURCE_ENERGY);
			if (transferReturn == ERR_NOT_IN_RANGE ) {
				creep.moveTo(target);
			}
			if (transferReturn == ERR_FULL) {
				creep.memory.targetid = false;
			}
			
		}
		
	}
	
}
      