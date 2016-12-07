var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.carry.energy == 0 && creep.memory.working == true) {
            // switch state
            creep.memory.working = false;
            var target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER );
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
                creep.memory.targetid = highestContainer.id;
            }
        }
        // if creep is harvesting energy but is full
        else if (creep.carryCapacity == creep.carry.energy && creep.memory.working == false) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite);
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else if ( creep.memory.working == false){

            var dest = Game.getObjectById(creep.memory.targetid);
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