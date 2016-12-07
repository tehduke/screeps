 module.exports =  {
    run: function (creep) {
       if (creep.carry.energy == 0 ){
		   var container = Game.getObjectById(creep.memory.containerid);
		   if ( creep.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
			   creep.moveTo(container);
		   }
		   else {
			   droppedenergy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
			   creep.pickup(droppedenergy);
		   }
	   }
	   else {
		   if (creep.room.name != creep.memory.homeroom) {
			   var route = Game.map.findRoute(creep.room, creep.memory.homeroom);
			   if (route.length > 0 ){
				   var exit = creep.pos.findClosestByRange(route[0].exit);
						creep.moveTo(exit);
			   }
			   
		   }
		   else {
			   var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        // the second argument for findClosestByPath is an object which takes
                        // a property called filter which can be a function
                        // we use the arrow operator to define it
                        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER)
                    && s.energy < s.energyCapacity });
					
					if (structure != null) {
						if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(structure);
						}
					}
					else {
						structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                      
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE)});
						if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(structure);
						}
					}
			}
			
		  
		}
		   
	}

 }



