module.exports = {
    // a function to run the logic for this role
    run: function (creep) {


        var source = Game.getObjectById(creep.memory.Source);
        // migration code
        if ( source == undefined){
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


        if (creep.memory.containerid == false) {
            if (!creep.pos.isNearTo(source)) {
                console.log(creep.name + "moving to source");
                creep.moveTo(source);

            }
            else {
                var contaner = creep.pos.findInRange(FIND_STRUCTURES, 2, {filter: (s) =>
                    (s.structureType == STRUCTURE_CONTAINER)});
                if (contaner.length  ) {
                    for( var i in contaner) {
                        if (source.pos.isNearTo(contaner[i])) {
                            console.log(creep.name + " found container");
                            creep.memory.containerid = contaner[i].id;
                        }
                    }
                }

                    var contanerbuildsite = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 2, {filter: (s) =>
                        (s.structureType == STRUCTURE_CONTAINER)});

                    if (contanerbuildsite.length) {

                        for (var i in contanerbuildsite) {
                            var temp = contanerbuildsite[i];
                            if (source.pos.isNearTo(temp)) {
                                console.log(creep.name + " found construction site");
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
                            console.log(creep.name + "no container or build sites found");

                            creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
                        }
                    }

            }
        }
        else {
            var target = Game.getObjectById((creep.memory.containerid));

            if (creep.pos.isEqualTo(target) == false){
                console.log("not next to target")
                creep.moveTo(target);
            }
            else if (creep.carryCapacity > creep.carry.energy){
                creep.harvest(source);
            }
            else if (target.hits < target.hitsMax){
                creep.repair(target);
            }
            else if (creep.carryCapacity == creep.carry.energy){
                creep.drop(RESOURCE_ENERGY);
            }
        }
    }
}
