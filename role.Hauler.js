 module.exports =  {
    run: function (creep) {
        /* Check if we allready have a Destnation its kinda expensive to find so it might save me cpu?*/
       if ( creep.carryCapacity == creep.carry.energy && creep.memory.working == false){
           creep.memory.working = true;
       }
       if ( creep.carry.energy == 0 && creep.memory.working == true) {
           var target = creep.room.find(FIND_STRUCTURES, {
                   filter: (structure) => {
                   return (structure.structureType == STRUCTURE_CONTAINER);}
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
               creep.memory.containerid = highestContainer.id;
               creep.memory.working = false;
           }
       }
        if (creep.memory.working == true){

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
        else if ( creep.memory.working == false){

            var dest = Game.getObjectById(creep.memory.containerid);
            //hacky test to makesure that if containerid isnt initlised it still works
            if ( dest == null || dest.store.energy == 0){
                creep.memory.working = true
            }
            if (creep.withdraw(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dest);
            }
        }

    }
 }



