 module.exports =  {
    run: function (creep) {
		if ( !creep.memory.storageid ) {
			if (creep.room.storage != undefined) {
				var container = Game.getObjectById(creep.memory.containerid);
				let links = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => 
				s.structureType == STRUCTURE_LINK
				});
				
				if (links.length) {
					if (container != null ) {
						var containersource = container.pos.findInRange(FIND_SOURCES, 1 );
						
						for (let i = 0; i < links.length; ++i ){
							if (links[i].memory.servicedsources != undefined ) {
								let servecedSources = links[i].memory.servicedsources
								
								for (let j = 0; j < servecedSources.length; ++j ) {
									if (servecedSources[j] == containersource[0].id) {
										console.log(links[i].memory.servicedsources[j])
										creep.memory.storageid = links[i].id;
									}
					
								}
					
							}
						}
						if (!creep.memory.storageid ) {
							creep.memory.storageid = creep.room.storage.id
						}
						
					}
					
					
				}
				else {
					 creep.memory.storageid = creep.room.storage.id
				}
			}
		}
		// fallback for if energytug dies and a new one hasnt spawned yet
		var storage = Game.getObjectById(creep.memory.storageid);
		var homeroom = Game.rooms[creep.memory.homeroom];
		var container = Game.getObjectById(creep.memory.containerid);
		//suicide if creep close to timeout quick fix for now will implement a creep function later for all types of hauler
		if ( storage != undefined || null) {
			
			if (!creep.memory.distance ) {
				
				if (container != null) {
					var pathtostorage = PathFinder.search(container.pos, storage.pos);
					creep.memory.distance =  pathtostorage.path.length + 10; 
				}
			}
			else {
				if ( creep.ticksToLive < creep.memory.distance ) {
					var dest = storage
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
		
		
		if ( (homeroom.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'tug' })).length == 0  || (storage == undefined || null) ) {
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
		else if (creep.memory.empty == undefined) {
			creep.memory.empty = true;
		}
		else if (creep.memory.empty == true) {
			if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(container);
			}
			if (creep.carry.energy === creep.carryCapacity ) {
				creep.memory.empty = false;
			}
		}
		else if (creep.memory.empty == false) {
			if (creep.transfer(storage, RESOURCE_ENERGY ) === ERR_NOT_IN_RANGE {
				creep.moveTo(storage);
				var road = _.filter(creep.pos.lookFor(LOOK_STRUCTURES), (s) => s.structureType == STRUCTURE_ROAD);
				if (road.length) {
					if (road[0].hits < road[0].hitsMax) {
						creep.repair(road[0])
					}
				}
			}
			if (creep.carry.energy === 0 ) {
				creep.memory.empty = true;
			}
		}
 }



