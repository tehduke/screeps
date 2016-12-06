module.exports = {
	run: function() {
		var targetroom = Game.rooms['W49S72'];
		if (creep.room.name != targetroom){
			var exit = creep.room.findExitTo(targetroom);
			creep.moveTo(creep.pos.findClosestByRange(exit));
		}
		else {
			if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
            }
		}
	}
}