module.exports = {
	run: function(creep) {
		if (!creep.memory.storageid) {
			creep.memory.storageid = creep.room.storage.id;
		}
			if (creep.carry.energy == creep.carryCapacity) {
				var storage = Game.getObjectById(creep.memory.storageid);
				if ( creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage)
				}
			}
			else {
				if (Game.flags.reclaim == undefined) {
					creep.moveTo(Game.flags.reclaim);
				}
				else {
					var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) =>
					s.structureType != STRUCTURE_CONTROLLER
					});
					if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
				}
			}
		
	
	}
}