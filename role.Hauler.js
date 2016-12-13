 module.exports =  {
    run: function (creep) {
		if ( !creep.memory.storageid ) {
			let temp = creep.memory.homeroom;
			
			if ( temp.storage != undefined ){
				creep.memory.storageid = Game.rooms[temp].storage.id;
			}
			
		}
		// fallback for if energytug dies and a new one hasnt spawned yet
		var homeroom = Game.rooms[creep.memory.homeroom];
		//suicide if creep close to timeout quick fix for now will implement a creep function later for all types of hauler
		if (!creep.memory.distance ) {
			var container = Game.getObjectById(creep.memory.containerid);
			if (container != undefined) {
				var pathtostorage = PathFinder.search(container.pos, homeroom.storage.pos);
				creep.memory.distance =  pathtostorage.path.length + 10; 
			}
		}
		else {
			if ( creep.ticksToLive < creep.memory.distance ) {
				var dest = homeroom.storage
				if (creep.carry.energy > 0 ) {
					if (creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
					creep.moveTo(dest);
					}
				}
				else {
				creep.suicide();
				}
			}
		}
		
		
		if ( (homeroom.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'tug' })).length == 0  || homeroom.storage == undefined ) {
				if ( creep.carry.energy == 0 ) {
					var dest = Game.getObjectById(creep.memory.containerid);
					if (creep.withdraw(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ){
						creep.moveTo(dest);
					} 
				}
				else {
					if ( homeroom.name == creep.room.name ) {
						var dest = creep.pos.findClosestByPath( FIND_MY_STRUCTURES, {filter: (s) =>
						(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)  && s.energy < s.energyCapacity
						});
						if ( creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
							creep.moveTo(dest);
						}
					}
					else {
						var dest = homeroom.find( FIND_MY_STRUCTURES, {filter: (s) =>
						(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)  && s.energy < s.energyCapacity
						});
						creep.moveTo(dest[0]);
					} 
				
				}
		}
			
		else if ( creep.carry.energy < creep.carryCapacity ) {
			var dest = Game.getObjectById(creep.memory.containerid);
			if (creep.withdraw(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ){
				creep.moveTo(dest);
			} 
		}
		else {
			var dest = homeroom.storage
			if (creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
				creep.moveTo(dest);
			}
		}
	}

 }



