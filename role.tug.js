require('prototype.creep');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		//build tasklisk function
		var genTask = function (creep) {
			if (!creep.memory.tasklisk) {
				creep.memory.tasklisk = new Array();
			}
			//test is room has a link
			var link = Game.getObjectById(creep.memory.linkid);
			
			
			if (link == null  ) {
				link = creep.room.storage.pos.findClosestByRange(FIND_MY_STRUCTURES,  {filter: (s) => 
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
				console.log("pushing task empty link");
				creep.memory.tasklisk.push('emptylink');
				return;
			}
			
			//find dropped energy and pickit up
			var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
			if( target != null && target.amount > 200 && creep.carry.energy != creep.carryCapacity) {
				creep.memory.tasklisk.push('gatherdroppedenergy');
				return;
			}
		
			//test if link exists or if its undefined

			var targets = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => 
			s.energy < s.energyCapacity
			});
			if ( targets != undefined ) {
				creep.memory.tasklisk.push('fillspawn');
				return;
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
			genTask(creep);
		}
		if (creep.memory.tasklisk[0] == 'emptylink') {
			var link = Game.getObjectById(creep.memory.linkid);
			var storage = creep.room.storage
			//test if link is empty then remove task
			if (link.energy == 0 ) {
				if (creep.carry.energy < creep.carryCapacity && storage.store[RESOURCE_ENERGY] > 0) {
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
				if (target != undefined && target.amount > 200 ) {
					creep.memory.targetid = target.id
				}
				else {
						creep.memory.tasklisk.splice(0, 1);
				}
			}
			var target = Game.getObjectById(creep.memory.targetid);
			if (target == null ) {
				creep.memory.targetid = false;
			}
			else if ( creep.carry.energy < creep.carryCapacity ) {
				if (creep.pickup(target) == ERR_NOT_IN_RANGE ) {
					creep.moveTo(target);
				}
			}
			else {
				creep.memory.tasklisk.splice(0, 1);
				creep.memory.targetid = false;
				
			}
		 }
		
		if (creep.memory.tasklisk[0] == 'fillspawn') {
			if (creep.memory.targetid == false ) {
				var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => 
				s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
				});
				if (target == null) {
					target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => 
					(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity
					});
					if (target == null) {
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
				if (target != undefined) {
				creep.memory.targetid = target.id;
				}
			}
			if (creep.carry.energy == 0 ) {
				creep.memory.targetid = false;
				creep.memory.tasklisk.splice(0, 1);
			}
			var target = Game.getObjectById(creep.memory.targetid);
			if (target == null ) {
				creep.memory.targetid = false;
			}
			if (storage.store[RESOURCE_ENERGY] == 0 ) {
				creep.memory.tasklisk.splice(0, 1);
				creep.memory.targetid = false;
			}

				var transferReturn = creep.transfer(target, RESOURCE_ENERGY);
				if (transferReturn == ERR_NOT_IN_RANGE ) {
				creep.moveTo(target);
				}
				if (transferReturn == OK || transferReturn == ERR_FULL) {
				creep.memory.targetid = false;
				}
			
			
			
		}
		
	}
	
}
      