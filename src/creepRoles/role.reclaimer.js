module.exports = {
	run: function(creep) {

	if (creep.memory.targetroom == undefined) {
		if (Game.flags.reclaim.room == undefined ) {
			creep.movePathTo(Game.flags.reclaim);
		}
		else {
			creep.memory.targetroom =  Game.flags.reclaim.room.name;
		}
	}
	else if ( creep.room.name !== creep.memory.targetroom ) {
	var exit = creep.room.findExitTo(creep.memory.targetroom);
		creep.movePathTo(creep.pos.findClosestByPath(exit));
	}
		else {
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) =>
			s.structureType != STRUCTURE_CONTROLLER && s.structureType != STRUCTURE_STORAGE && s.structureType != STRUCTURE_TERMINAL
			});
			if (target == undefined ) {
			Game.flags.reclaim.remove();
				creep.suicide();
			}
				if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
					creep.movePathTo(target);
				}
		}
	}
}