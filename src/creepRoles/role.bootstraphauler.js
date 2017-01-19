module.exports = {
	run: function (creep) {
		var homeroom = Game.rooms[creep.memory.homeroom];

		
			if (creep.carry.energy == 0 ) {
				if (creep.withdraw(homeroom.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(homeroom.storage)
				}
			}
			else {
				if (creep.room.name != creep.memory.targetroom) {
						// find exit to target room
						var exit = creep.room.findExitTo(creep.memory.targetroom);
						// move to exit
						creep.moveTo(creep.pos.findClosestByPath(exit));
			
				}
				else {
					if (creep.memory.targetid == false ){
						let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => 
						s.structureType === STRUCTURE_CONTAINER && ( _.sum(s.store) < s.storeCapacity)
						});
						if (container != undefined) {
							creep.memory.targetId = container.id
						}
						else {
							var targetcreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (c) =>
							c.memory.role == 'bootstrapworker' && c.carry.energy < c.carryCapacity
							});
							if ( targetcreep != null) {
							creep.memory.targetcreepid = targetcreep.id;
							}
						}
		
					}
					else {
						let target = Game.getObjectById(creep.memory.targetid);
						if (target != null) {
							var transferReturn = creep.transfer(targetcreep, RESOURCE_ENERGY);
							if ( transferReturn === ERR_NOT_IN_RANGE ) {
								creep.moveTo(targetcreep);
							}
							else if (transferReturn === ERR_FULL) {
								creep.memory.targetcreepid = false
							}
				
						}
						else {
							creep.memory.targetcreepid = false
						}
					}
				
				}
			
			}
		

	
		
	}
}