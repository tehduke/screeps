require('prototype.creep');
module.exports = {
    // a function to run the logic for this role
    run: function (creep) {

		if ( !creep.memory.containerid ) {
			creep.memory.containerid = false
		}
        var source = Game.getObjectById(creep.memory.source);
        
		if (!creep.memory.travelticks ); {
			creep.memory.travelticks = 0
		}
		if (!creep.memory.starttime && creep.spawning == false) {
			creep.memory.starttime = Game.time;
		}
		if (source != null ) {
			if (creep.pos.isNearTo( source) && creep.memory.travelticks == 0 ) {
				creep.memory.travelticks = creep.memory.starttime - Game.time
			}
		}
		if (creep.memory.travelticks > creep.ticksToLive ) {
			creep.alertCreepTimeOut();
		}
		// fallback code if no source is assined
        if ( source == undefined){
			if ( !creep.memory.working ) {
				creep.memory.working = false;
			}
            if (creep.memory.working == true && creep.carry.energy == 0) {
                // switch state
                creep.memory.working = false;
            }
            // if creep is harvesting energy but is full
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                // switch state
                creep.memory.working = true;
            }

            // if creep is supposed to transfer energy to the spawn or an extension
            if (creep.memory.working == true) {
                // find closest spawn or extension which is not full
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        // the second argument for findClosestByPath is an object which takes
                        // a property called filter which can be a function
                        // we use the arrow operator to define it
                        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION)
                    && s.energy < s.energyCapacity
            });

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
            }
            // if creep is supposed to harvest energy from source
            else {
                // find closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
            }

        }
		else {
        if (creep.memory.containerid == false) {
            if (!creep.pos.isNearTo(source)) {
                creep.moveTo(source);
            }
			// when creep gets to source test for container and if there isnt one there buildone
            else {
                var contaner = creep.pos.findInRange(FIND_STRUCTURES, 2, {filter: (s) =>
                    (s.structureType == STRUCTURE_CONTAINER)});
				var contanerbuildsite = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 2, {filter: (s) =>
                        (s.structureType == STRUCTURE_CONTAINER)});
                if (contaner.length  ) {
					
					var link = creep.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (s) =>
                        (s.structureType == STRUCTURE_LINK)
						});
                    for( var i in contaner) {
                        if (source.pos.isNearTo(contaner[i])) {
							//test if a link is near
							if (contaner[i].pos.isNearTo(link[0]) ) {
								creep.memory.linkid = link[0].id;
							}					
                            creep.memory.containerid = contaner[i].id;
							creep.moveTo(contaner[i]);
                        }
                    }
                }
				else  if (contanerbuildsite.length) {

                        for (var i in contanerbuildsite) {
                            var temp = contanerbuildsite[i];
                            if (source.pos.isNearTo(temp)) {
                                
                                if (creep.carryCapacity > creep.carry.energy){
                                    creep.harvest(source);
                                }

                                else  {
                                    creep.build(temp)
                                }
                            }
                        }
				}
                    else {
                        if (creep.pos.isNearTo(source)) {
                            

                            creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
                        }
                    }

            }
        }
        else {
            var contaner = Game.getObjectById(creep.memory.containerid);
			var link = Game.getObjectById(creep.memory.linkid);

            if (creep.pos.isEqualTo(contaner) == false){
                
                creep.moveTo(contaner);
            }

			else if (contaner.hits < ((90 / 100 ) * contaner.hitsMax) ) {
                if ( creep.repair(contaner) == ERR_NOT_ENOUGH_RESOURCES ) {
					creep.harvest(source);
				}
            }
            else {
				if ( link ) {
					// stuff energy into the link
					creep.withdraw(contaner, RESOURCE_ENERGY);
					//check that the link has a destnation to transport to if not find it
					if ( creep.transfer(link, RESOURCE_ENERGY) == ERR_FULL ) {
					 
						if ( !creep.memory.destid ) {
							var storage = creep.room.storage
							var destlink = storage.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => 
							s.structureType == STRUCTURE_LINK
							});
							creep.memory.destid = destlink.id;
						}
					 link.transferEnergy(Game.getObjectById(creep.memory.destid));
					}
				}
				
				creep.harvest(source);
			}
            
        }
		
		}
    }
}
