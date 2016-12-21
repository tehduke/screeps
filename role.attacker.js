
module.exports = {
	run: function(creep){
		
		if (!creep.memory.targetid) {
			creep.memory.targetid = false;
		}
		if (creep.memory.targetid == false ) {
		
			var target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
			if (target.length ) {
				creep.memory.targetid = target[0].id;
			}
			if (Game.flags.kill != undefined ) {
					var target = Game.flags.kill.pos.lookFor(LOOK_STRUCTURES)
					if (target != undefined ) {
						creep.memory.targetid = target[0].id
					}
					else {
						var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES , {filter: (s) =>
						s.structureType != STRUCTURE_CONTROLLER
						});
						if ( target != undefined ) {
						creep.memory.targetid = target.id
						}
					}
			}
			else {
				var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES , {filter: (s) =>
						s.structureType != STRUCTURE_CONTROLLER
						});
				if (target != undefined) {
					creep.memory.targetid = target.id
				}
			}
			
			
				
		}
		var target = Game.getObjectById(creep.memory.targetid);
			if (target == null ) {
				creep.memory.targetid = false;
				creep.moveTo(Game.flags.attack);
			}
			else if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target)
			}
		
		



	}
}
