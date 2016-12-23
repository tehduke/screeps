 module.exports =  {
    run: function (creep) {
		if ( !creep.memory.storageid ) {
			if (creep.room.storage != undefined) {
				let links = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => 
				s.structureType == STRUCTURE_LINK
				});
				if (links.length) {
					let container = Game.getObjectById(creep.memory.containerid);
					if (container !== null || undefined) {
						let path = PathFinder.search(container.pos, creep.room.storage.pos);
						let distanceToStorage = path.path.length
						var oldLink ;
						
						for (let i = 0; i < links.length; ++i ) {
							if (links[i].memory.receiver == false ) {
								path = PathFinder.search(container.pos, links[i].pos);
								if ( oldLink.distance < path.path.length) {
									oldLink = links[i];
									oldLink.distance = path.path.length
								}
							}
						}
						if (oldLink != undefined ) {
							if ( oldLink.distance < distanceToStorage ) {
							creep.memory.storageid = oldLink.id;
							}
							else {
								creep.memory.storageid = creep.room.storage.id;
							}
						}
						else {
							creep.memory.storageid = creep.room.storage.id;
						}
					}
				}
				else {
					creep.memory.storageid = creep.room.storage.id;
				}
			}
			
		}
		// fallback for if energytug dies and a new one hasnt spawned yet
		var homeroom = Game.rooms[creep.memory.homeroom];
		//suicide if creep close to timeout quick fix for now will implement a creep function later for all types of hauler
		if ( homeroom.storage != undefined) {
			var storage = homeroom.storage
			if (!creep.memory.distance ) {
				var container = Game.getObjectById(creep.memory.containerid);
				if (container != null) {
					var pathtostorage = PathFinder.search(container.pos, storage.pos);
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
						(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER )  && s.energy < s.energyCapacity
						});
						if (dest != undefined) {
							if ( creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
								creep.moveTo(dest);
							}
						}
						else {
							dest = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (c) => 
							(c.memory.role == 'upgrader' || c.memory.role == 'builder' || c.memory.role == 'repairer') && c.carry.energy < c.carryCapacity
							});
							if (dest != undefined) {
								if ( creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
									creep.moveTo(dest);
								}
							}
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
		else if (homeroom.storage != undefined) {
			var dest = homeroom.storage
			if (creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
				creep.moveTo(dest);
			}
		}
	}

 }



