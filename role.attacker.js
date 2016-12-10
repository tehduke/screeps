module.exports = {
	run: function(creep){
		if (creep.hits < creep.hitsMax ) {
			creep.heal(creep);
		}
		var bluecreeps = creep.pos.findInRange(FIND_MY_CREEPS, 3 , {filter: (c) => 
		c.hits < c.hitsMax
		});
		if ( bluecreeps.length) {
			if ( creep.heal(bluecreeps[0]) == ERR_NOT_IN_RANGE ) {
				creep.moveTo(bluecreeps[0] );
				creep.rangedHeal(bluecreeps[0]);
			}
		}
		var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
		if (target != undefined){
			if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				if ( creep.moveTo(target) == ERR_NO_PATH) {
					var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => 
					s.structureType == STRUCTURE_WALL
					});
					if (creep.attack(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
				}
			}
				
		}
			
		
		else {
			creep.moveTo(Game.flags.attack);
		}
	}
}