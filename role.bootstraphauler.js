module.exports = {
	run: function (creep) {
		var hoomroom = Game.rooms[creep.memory.homeroom];
		
		if (creep.carry.energy == 0 ) {
			if (creep.withdraw(homeroom.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(homeroom.storage);
			}
		}
		if (creep.room.name != creep.memory.targetroom) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetroom);
			// move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
			
		}
		else {
			var targetcreep = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (c) =>
			c.memory.role == 'bootstrapworker' && c.carry.energy < c.carryCapacity
			});
			if ( creep.transfer(targetcreep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
				creep.moveTo(targetcreep);
			}
		}
	}