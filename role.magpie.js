module.exports = {
	run: function(creep) {
		if (creep.memory.empty == undefined) {
			creep.memory.empty = true;
		}
		if (!creep.memory.storageid) {
			creep.memory.storageid = creep.room.storage.id
		}
		if (_.sum(creep.carry) === creep.carryCapacity) {
				creep.memory.empty = false;
		}
		else {
			creep.memory.empty = true;
		}
		if (creep.memory.empty ===  true) {
			
			if (creep.memory.targetroom == undefined) {
				if (Game.flags.steal.room == undefined ) {
					creep.movePathTo(Game.flags.steal);
				}
				else {
					creep.memory.targetroom =  Game.flags.steal.room.name;
				}
			}
			else if ( creep.room.name !== creep.memory.targetroom ) {
			var exit = creep.room.findExitTo(creep.memory.targetroom);
				creep.movePathTo(creep.pos.findClosestByPath(exit));
			}
			else {
				var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
				if (target == undefined ) {
					var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) =>
					(s.structureType === STRUCTURE_STORAGE || s.structureType == STRUCTURE_TERMINAL) && (s.store[RESOURCE_ENERGY] > 0)
					});
					if (target == undefined ) {
						Game.flags.steal.remove();
						creep.memory.empty = false;
					}
					else if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.movePathTo(target);
					}
				
				}
				else if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
					creep.movePathTo(target);
				}
			}
		}
		else {
			var storage = Game.getObjectById(creep.memory.storageid);
			if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				creep.movePathTo(storage);
			}
		}
	}
}