module.exports = {
	run: function (creep) {
		var reds = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (creep.hits < creep.hitsMax) {
					creep.heal(creep);
					if (reds != undefined || null) {
						var path = PathFinder.search(creep.pos, {pos: reds.pos, range: 20}, {flee: true } );
						creep.move(creep.pos.getDirectionTo(path.path[0]));
						creep.rangedAttack(reds);
					}
		} 
		else {
		if (Game.flags[creep.memory.targetflag] != undefined ) {
			if (Game.flags[creep.memory.targetflag].room == undefined) {
				creep.moveTo(Game.flags[creep.memory.targetflag]);
			}
			else if (creep.room.name != Game.flags[creep.memory.targetflag].room.name ) {
				creep.moveTo(Game.flags[creep.memory.targetflag])
			}
			else {
				
				
				if (reds == undefined || null ) {
					Game.flags[creep.memory.targetflag].remove()
					creep.memory.targetflag = false;
				}
				else {
					var rangeToReds = creep.pos.getRangeTo(reds);
					if (rangeToReds < 3 ) {
						var path = PathFinder.search(creep.pos, {pos: reds.pos, range: 3}, {flee: true } );
						creep.move(creep.pos.getDirectionTo(path.path[0]));
						creep.rangedAttack(reds);
					}
					else if (creep.rangedAttack(reds) == ERR_NOT_IN_RANGE) {
						creep.moveTo(reds);
					}
				}
				
			}
		}
		else if (creep.moveTo(Game.flags[creep.memory.targetflag]) == ERR_INVALID_TARGET ) {
			creep.memory.targetflag = false;
			
		}
		if (creep.memory.targetflag == false ) {
			var flag =  _.filter(Game.flags, (f) => f.color == COLOR_BLUE ) 
				if (flag.length) {
					creep.memory.targetflag = flag[0].name;
				}
			
		}
		}
	}
}