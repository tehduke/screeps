

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if (creep.ticksToLive < 50 ) {
			if (!creep.memory.timeout) {
				creep.memory.timeout = true;
				var tugs = 
				creep.room.memory.spawnque.unshift('tug', creep.room.name, 'END')
			}
		}
	
function getTask () {
	if (!creep.memory.task) {
		creep.memory.task = new Array();
	}
	creep.memory.targetid = false;
	if (!creep.memory.linkid) {
		var link = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) =>
		s.structureType == STRUCTURE_LINK
		});
		if ( link.length ) {
			for ( let i = 0; i < link.length; ++i ) {
				let temp = link[i].pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (s) =>
				s.structureType == STRUCTURE_STORAGE
				});
				if (temp.length) {
					creep.memory.linkid = link[i].id ;
				}
			}
		}
	}
	var link = Game.getObjectById(creep.memory.linkid);
	if (link !== null ) {
		if (link.energy > 700 ) {
			creep.memory.task.push('emptylink');
		}
	}
	var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) =>
	(s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) &&
	s.energy < s.energyCapacity
	});
	if (target != undefined ) {
		creep.memory.task.push('fillspawn');
	}


}
	
	if (creep.memory.task == undefined || creep.memory.task.length == 0 ) {
			getTask();
	}
	if (creep.memory.task[0] === 'emptylink') {
		var link = Game.getObjectById(creep.memory.linkid);
		if ( link.energy === 0 ) {
			if ( _.sum(creep.carry) < creep.carryCapacity ) {
				if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.storage);
					
				}
			}
			else {
				creep.memory.task.splice(0 , 1);
			}
		}
		else if ( _.sum(creep.carry) === creep.carryCapacity ) {
			if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.storage);
			}
		}
		else if ( creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			creep.moveTo(link);
		}
		
		
	}
	if (creep.memory.task[0] === 'fillspawn') {
		
		if ( creep.memory.targetid === false) {
			if ( _.sum(creep.carry) === 0)  {
				if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.storage);
					
				}
			}
			else {
				var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) =>
				(s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) &&
				s.energy < s.energyCapacity
				});
				if (target != undefined) {
					creep.memory.targetid = target.id;
				}
				else {
					creep.memory.task.splice(0 , 1);
				}
			}
		}
		else {
		var target = Game.getObjectById(creep.memory.targetid);
		if (target == null) {
			creep.memory.targetid = false;
		}
		else if ( _.sum(creep.carry) === 0 ) {
			creep.memory.task.splice(0 , 1);
			creep.memory.targetid  = false;
		}
		else if ( target.energy < target.energyCapacity ) {
			if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE ) {
				creep.moveTo(target)
			}
			else {
				var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) =>
				(s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) &&
				s.energy < s.energyCapacity
				});
				if (target != undefined) {
					creep.memory.targetid = target.id;
					creep.moveTo(target);
				}
				else {
					creep.memory.task.splice(0 , 1);
				}
			}
		}
		else {
			var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) =>
				(s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_TOWER) &&
				s.energy < s.energyCapacity
				});
				if (target != undefined) {
					creep.memory.targetid = target.id;
					creep.moveTo(target);
				}
				else {
					creep.memory.task.splice(0 , 1);
				}
		}
	}
		
	}
	
	}
}