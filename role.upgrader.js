module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the controller but has no energy left
         if (creep.carry.energy < creep.carryCapacity && creep.memory.working == true) {
            // switch state
            creep.memory.working = false;
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
                creep.memory.containerid = highestContainer.id;
            }
        }
        // if creep is harvesting energy but is full
        else if (creep.carryCapacity == creep.carry.energy && creep.memory.working == false) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        // if creep is supposed to harvest energy from source
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
};