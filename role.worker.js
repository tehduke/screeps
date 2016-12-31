module.exports =  {
	run: function (creep) {
		if (!creep.memory.homeroom) {
			creep.memory.homeroom = creep.room.name;
		}
		var homeroom = Game.rooms[creep.memory.homeroom];
		function getTask() {
			if (!creep.memory.task) {
				creep.memory.task = false;
			}
			if (creep.carry.energy === 0 ) {
				creep.memory.task = 'getenergy'
				creep.memory.targetroom = creep.memory.homeroom
				return;
			}
			if (homeroom.memory.constructionsites.length ) {
				for (let i = 0; i < homeroom.memory.constructionsites.length; ++i) {
					let target = Game.getObjectById(homeroom.memory.constructionsites[i]);
					if (target == null || undefined ) {
						homeroom.memory.constructionsites.splice(i, 1 );
						return;
					}
					else {
						if ( target.room == undefined ) {
							return
						}
						creep.memory.targetroom = target.room.name;
						creep.memory.targetid = target.id;
						creep.memory.task = 'build'
						return;
					}
				}
			}
			var walls = homeroom.find(FIND_STRUCTURES, {filter: (s) =>
			(s.structureType == STRUCTURE_WALL && s.structureType == STRUCTURE_RAMPART) && (s.hits < WALL_HEALTH)
			});
			if (walls.length ) {
				creep.memory.task = 'fixwalls';
				return;
			}
			var things = homeroom.find(FIND_STRUCTURES, {filter: (s) =>
			s.hits < s.hitsMax
			});
			if (things.length) {
				creep.memory.task = 'fixthings';
				return;
			}
		}
		if (creep.memory.task == undefined ) {
			creep.memory.task = false;
		}
		if (creep.memory.task === false ) {
			getTask();
		}
		if (creep.memory.task === 'getenergy' ) {
			if (creep.room.name != creep.memory.homeroom) {
            var exit = creep.room.findExitTo(creep.memory.homeroom);
            creep.moveTo(creep.pos.findClosestByPath(exit));
			}
			else {
				creep.getEnergy();
				if (creep.carry.energy === creep.carryCapacity) {
					creep.memory.task = false;
				}
			}
		}
		if (creep.memory.task === 'build' ) {
			if ( Game.rooms[creep.memory.targetroom] == undefined ) {
				var exit = creep.room.findExitTo(creep.memory.targetroom);
				creep.moveTo(creep.pos.findClosestByPath(exit));
			}
			else {
				var target = Game.getObjectById(creep.memory.targetid)
				var buildReturn = creep.build(target)
				if (buildReturn === ERR_NOT_IN_RANGE) {
					creep.moveTo(target)
				}
				else if ( buildReturn === ERR_INVALID_TARGET) {
					creep.memory.task = false;
				}
				else if ( buildReturn === ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.task = false;
				}
				
			}
		}
		if ( creep.memory.task === 'fixwalls' ) {
			if (creep.room.name != creep.memory.homeroom) {
				var exit = creep.room.findExitTo(creep.memory.homeroom);
				creep.moveTo(creep.pos.findClosestByPath(exit));
			}
			else {
				var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) =>
				(s.structureType == STRUCTURE_WALL && s.structureType == STRUCTURE_RAMPART) && s.hits < WALL_HEALTH
				});
				var repairReturn = creep.repair(target);
				if (repairReturn == ERR_NOT_IN_RANGE ) {
					creep.moveTo(target);
				}
				else if ( repairReturn === ERR_INVALID_TARGET) {
					
					creep.memory.task = false;
				}
				else if ( repairReturn === ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.task = false;
				}
			}
		}
		if ( creep.memory.task === 'fixthings' ) {
			if (creep.room.name != creep.memory.homeroom) {
				var exit = creep.room.findExitTo(creep.memory.homeroom);
				creep.moveTo(creep.pos.findClosestByPath(exit));
			}
			else {
				var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => 
				(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
				&& s.hits < s.hitsMax
				});
				var repairReturn = creep.repair(target);
				if (repairReturn == ERR_NOT_IN_RANGE ) {
					creep.moveTo(target);
				}
				else if ( repairReturn === ERR_INVALID_TARGET) {
					creep.memory.task = false;
				}
				else if ( repairReturn === ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.task = false;
				}
			}
			
			
		}
		
	}
}