module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if (creep.memory.working == true && creep.carry.energy == 0) {
                // switch state
                creep.memory.working = false;
            }
            // if creep is harvesting energy but is full
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                // switch state
                creep.memory.working = true;
            }
<<<<<<< HEAD
=======
            target =  creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) =>
                (s.structureType == STRUCTURE_SPAWN && s.energy < s.storeCapacity)});
            if (target.length) {
                creep.memory.targetid = target.id;
                return;
            }
			return;
            

		}





        /* Check if we allready have a Destnation its kinda expensive to find so it might save me cpu?*/
       
       if ( creep.carry.energy < creep.carryCapacity && creep.memory.working == true) {
           var target = creep.room.find(FIND_STRUCTURES, {
                   filter: (structure) => {
                   return (structure.structureType == STRUCTURE_CONTAINER && structure.structureType == STRUCTURE_STORAGE);}
                    });
           if (target.length) {
               var allContainer = [];
               // Calculate the percentage of energy in each container.
               for (var i = 0; i < target.length; i++) {
                   allContainer.push({
                       energyPercent: ( ( target[i].store.energy / target[i].storeCapacity ) * 100 ),
                       id: target[i].id
                   });
               }
               // Get the container containing the most energy.
               var highestContainer = _.max(allContainer, function (container) {
                   return container.energyPercent;
               });

               // set the target in memory so the creep dosen't
               // change target in the middle of the room.
               creep.memory.targetid = highestContainer.id;
               creep.memory.working = false;
           }
       }
        if (creep.memory.working == true){
           var dest = Game.getObjectById(creep.memory.targetid);
           var trasferreturn = creep.transfer(dest, RESOURCE_ENERGY);
           if ( trasferreturn == ERR_NOT_IN_RANGE) {
               creep.moveTo(dest);
           }
           if (trasferreturn == ERR_FULL) {
               getNewDropofftaget();
           }
>>>>>>> ffa40a4f2f6a132a4342a83f29bdab850f841028

            // if creep is supposed to transfer energy to the spawn or an extension
            if (creep.memory.working == true) {
                // find closest spawn or extension which is not full
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        // the second argument for findClosestByPath is an object which takes
                        // a property called filter which can be a function
                        // we use the arrow operator to define it
                        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER)
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
			else {
				var storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) =>
				(s.structureType == STRUCTURE_STORAGE)
				});
				if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(storage)
				}
			}
	}
}
      