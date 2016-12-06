var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to repair something but has no energy left
<<<<<<< HEAD
<<<<<<< HEAD
        if (creep.memory.working == true && creep.carry.energy == 0) {
=======
         if (creep.carry.energy < creep.carryCapacity && creep.memory.working == true) {
>>>>>>> ffa40a4f2f6a132a4342a83f29bdab850f841028
=======
        if (creep.memory.working == true && creep.carry.energy == 0) {
>>>>>>> 2d8e992c1be04092e4d2b672e43154b5395b7e62
            // switch state
            creep.memory.working = false;
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
        else {
            // find closest source
<<<<<<< HEAD
             var storage = Game.rooms[HOME].find(FIND_STRUCTURES, { filter: (s) =>
		   (s.structureType == STRUCTURE_STORAGE) });
		   if (creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			   creep.moveTo(storage[0]);
=======
            var storage = Game.rooms[HOME].find(FIND_STRUCTURES, { filter: (s) =>
		   (s.structureType == STRUCTURE_STORAGE) });
		   if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			   creep.moveTo(storage);
>>>>>>> 2d8e992c1be04092e4d2b672e43154b5395b7e62
		   }
        }
    }
};