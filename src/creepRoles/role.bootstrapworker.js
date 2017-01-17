var roleBuilder = require('role.builder');
module.exports = {
	run: function (creep) {
	
	
		if (creep.room.name != creep.memory.targetroom) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetroom);
			// move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
			
		}
		else if (creep.room.controller.level < 2 ) {
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) {
				creep.moveTo(creep.room.controller);
			}
		}
		else {
			roleBuilder.run(creep);
		}
	}
}