module.exports = {
	run: function(creep) {

	if (creep.memory.targetroom == undefined) {
		if (Game.flags.reclaim == undefined ) {
			creep.suicide();
		}
		else {
			creep.memory.targetroom =  Game.flags.reclaim.pos.roomName;
		}
	}
	else if ( creep.room.name !== creep.memory.targetroom ) {
	var exit = creep.room.findExitTo(creep.memory.targetroom);
			let exitplace = creep.pos.findClosestByRange(exit)
			if (creep.memory.clearPathTarget == undefined) {
				creep.memory.clearPathTarget = false;
			}
			if (creep.memory.clearPathTarget === false) {
				if (creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.targetroom)) , {maxRooms:1}) === ERR_NO_PATH ) {
				let wall = exitplace.findClosestByRange(FIND_STRUCTURES, {filter: (s) => 
				s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL
				});
				creep.memory.clearPathTarget = wall.id;
				}
			}
			else if (Game.getObjectById(creep.memory.clearPathTarget) == null) {
				creep.memory.clearPathTarget = false;
					
			}
			else {
				if (creep.dismantle(Game.getObjectById(creep.memory.clearPathTarget)) === ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.getObjectById(creep.memory.clearPathTarget));
				}
			}
				
				
			
		
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