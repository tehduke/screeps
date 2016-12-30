module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if (!creep.memory.travelticks && !creep.spawning) {
					creep.memory.travelticks = 0
		}
		if (creep.memory.travelticks > creep.ticksToLive ) {
			creep.alertCreepTimeOut();
		}
        // if in target room
		if (Game.rooms[creep.memory.targetroom] == undefined) {
			++creep.memory.travelticks;
		}
		else {
			if (!creep.pos.isNearTo(Game.rooms[creep.memory.targetroom].controller)) {
			++creep.memory.travelticks;
			}
			
		}
        if (creep.room.name != creep.memory.targetroom) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetroom);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
			
        }
        else {
		
            // try to claim controller
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
				++creep.memory.travelticks
            }
        }
    }
};