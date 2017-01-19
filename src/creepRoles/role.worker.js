module.exports =  {
	run: function (creep) {
		if (!creep.memory.homeroom) {
			creep.memory.homeroom = creep.room.name;
		}
		var homeroom = Game.rooms[creep.memory.homeroom];
		if (creep.ticksToLive === 1 ) {
			if (homeroom.memory.ecoMultiplyer != undefined ) {
				homeroom.memory.ecoMultiplyer --
			}
		}
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
					if (target == null || target.room == undefined ) {
						homeroom.memory.constructionsites.splice(i, 1 );
						return;
					}
					else {
						creep.memory.targetroom = target.room.name;
						creep.memory.targetid = target.id;
						creep.memory.task = 'build'
						return;
					}
				}
			}
			
			var things = homeroom.find(FIND_STRUCTURES, {filter: (s) =>
			(s.hits < (s.hit * 0.5)) && !(s.structureType === STRUCTURE_WALL ||  s.structureType === STRUCTURE_RAMPART)
			});
			if (things.length) {
				let target = creep.pos.findClosestByRange(things);
				creep.memory.targetid = target.id;
				creep.memory.task = 'fixthings';
				return;
			}
			var walls = homeroom.find(FIND_STRUCTURES, {filter: (s) =>
			(s.structureType === STRUCTURE_WALL ||  s.structureType === STRUCTURE_RAMPART) && (s.hits < s.hitsMax)
			});
			console.log(JSON.stringify(walls))
			
			if (walls.length ) {
				walls = walls.sort(function (a,b) {return a.hits - b.hits})
				if (walls[0].hits < WALL_HEALTH) {
					creep.memory.task = 'fixwalls';
					creep.memory.targetid = walls[0].id;
					return;
				}
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
            creep.movePathTo(creep.pos.findClosestByPath(exit));
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
				creep.movePathTo(creep.pos.findClosestByPath(exit));
			}
			else {
				var target = Game.getObjectById(creep.memory.targetid)
				var buildReturn = creep.build(target)
				if (buildReturn === ERR_NOT_IN_RANGE) {
					creep.movePathTo(target)
				}
				else if ( buildReturn === ERR_INVALID_TARGET) {
					
					let rampart = creep.pos.findInRange(FIND_STRUCTURES, 5, {filter: (s) =>  s.structureType === STRUCTURE_RAMPART && (s.hits === 1) });
					if (rampart.length){
						creep.memory.targetid = rampart[0].id
						creep.memory.task = 'fixwalls'
					}
					else {
						creep.memory.task = false;
					}
				}
				else if ( buildReturn === ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.task = false;
				}
				
			}
		}
		if ( creep.memory.task === 'fixwalls' ) {
			if (creep.room.name != creep.memory.homeroom) {
				var exit = creep.room.findExitTo(creep.memory.homeroom);
				creep.movePathTo(creep.pos.findClosestByPath(exit));
			}
			else {
				var target = Game.getObjectById(creep.memory.targetid);
				var repairReturn = creep.repair(target);
				if (repairReturn == ERR_NOT_IN_RANGE ) {
					creep.movePathTo(target);
				}
				else if ( repairReturn === ERR_INVALID_TARGET) {
					
					creep.memory.task = false;
				}
				else if ( repairReturn === ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.task = false;
				}
				else if (target.hit === target.hitsMax) {
					creep.memory.task = false;
				}
			}
		}
		if ( creep.memory.task === 'fixthings' ) {
			if (creep.room.name != creep.memory.homeroom) {
				var exit = creep.room.findExitTo(creep.memory.homeroom);
				creep.movePathTo(creep.pos.findClosestByPath(exit));
			}
			else {
				var target = Game.getObjectById(creep.memory.targetid)
				var repairReturn = creep.repair(target);
				if (repairReturn == ERR_NOT_IN_RANGE ) {
					creep.movePathTo(target);
				}
				else if ( repairReturn === ERR_INVALID_TARGET) {
					creep.memory.task = false;
				}
				else if ( repairReturn === ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.task = false;
				}
				else if (target.hits === target.hitsMax) {
					creep.memory.task = false;
				}
			}
			
			
		}
		
	}
}