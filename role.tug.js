require('prototype.creep');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		// check if there is a link next to the storage
		if ( !creep.memory.linkid) {
			var link = creep.room.find(FIND_MY_STRUCTURES, {filter: (s) =>
					s.structureType == STRUCTURE_LINK
			});
			if ( link.length ) {
				for ( let i = 0; i < link.length; ++i ) {
					let temp = link[i].pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (s) =>
					s.structureType == STRUCTURE_STORAGE
					});
					if (temp.length) {
						creep.memory.linkid = link[i].id ;
					}
				}
			}
			
		}
		if ( creep.memory.targetid == undefined) {
			creep.memory.targetid = false;
		}
		
	
		
		var link = Game.getObjectById(creep.memory.linkid);
		var storage = creep.room.storage;
		// empty link if needed or get target

			if (  link != undefined ) {
				if ( link.energy > 0  ) {
					
					creep.memory.targetid = true;
						if ( creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
							creep.moveTo(link);
						}
						else if (creep.carry.energy == creep.carryCapacity ) {
							if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
								creep.moveTo(storage);
							}
						}
				}
				else {
					creep.memory.targetid = false;
					
				}
			}
				
			if (creep.memory.targetid == false ) {
				if (creep.carry.energy == 0  ) {
					if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
						creep.moveTo(storage);
					}
				}
				
				var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => 
				(s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER)
				&& s.energy < s.energyCapacity
				});
				
				if ( target != undefined) {
						creep.memory.targetid = target.id;
						
				}
			}
			
			var target = Game.getObjectById(creep.memory.targetid);
		
			if ( creep.carry.energy == 0 ) {
				creep.memory.targetid = false;
			}
			else if ( creep.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target );
			}
			else if  ( creep.transfer(target,RESOURCE_ENERGY) == ERR_FULL ) {
				creep.memory.targetid = false;
				
			}
	}
}
      