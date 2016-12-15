require('prototype.creep');
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if (!creep.memory.travelticks ); {
			creep.memory.travelticks = 0
		}
		if (!creep.memory.starttime && creep.spawning == false) {
			creep.memory.starttime = Game.time;
		}
		if (Game.rooms[creep.memory.targetroom] != undefined ) {
			if (creep.pos.isNearTo( creep.room.controller) && creep.memory.travelticks == 0 ) {
				creep.memory.travelticks = creep.memory.starttime - Game.time
			}
		}

		if (creep.memory.travelticks > creep.ticksToLive ) {

			creep.alertCreepTimeOut();
		}
        if (creep.room.name != creep.memory.targetroom) {
            var exit = creep.room.findExitTo(creep.memory.targetroom);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
        else {
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};