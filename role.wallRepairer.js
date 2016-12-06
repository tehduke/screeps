var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to repair something but has no energy left
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
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find all walls in the room
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL
            });

            var target = undefined;

            // loop with increasing percentages
            for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
                // find a wall with less than percentage hits
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break;
                    }
                }

                // if there is one
                if (target != undefined) {
                    // break the loop
                    break;
                }
            }

            // if we find a wall that has to be repaired
            if (target != undefined) {
                // try to repair it, if not in range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(target);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleBuilder.run(creep);
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