var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is trying to repair something but has no energy left
        if ( creep.carry.energy == 0 && creep.memory.working == true) {
            // switch state
            creep.memory.working = false;
            var target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
        }
        })
            ;
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

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find closest structure with less than max hits
            // Exclude walls because they have way too many max hits and would keep
            // our repairers busy forever. We have to find a solution for that later.
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
        })
            ;

            // if we find one
            if (structure != undefined) {
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        else if (creep.memory.working == false) {

            var dest = Game.getObjectById(creep.memory.containerid);
            //hacky test to makesure that if containerid isnt initlised it still works
            if ( dest == null || dest.store.energy == 0){
                creep.memory.working = true
            }
        }
    }
}