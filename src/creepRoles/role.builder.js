var roleUpgrader = require('role.upgrader');
require('prototype.creep')

    module.exports = {
    // a function to run the logic for this role
    run : function(creep) {
        /* initlise creep memory*/

        // if no buildtarget is in the room memory initlise memory and get one else do upgrader role
        if(!creep.room.memory.buildtargetid || creep.room.memory.buildtargetid == false ||
           Game.getObjectById(creep.room.memory.buildtargetid) == null) {
			var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			if(constructionSite != undefined) {
	        creep.room.memory.buildtargetid = constructionSite.id;
			}
	    // if no constructionSite is found
			else {
	        // go upgrading the controller
	        roleUpgrader.run(creep);
			}
        }
		else {
	    /*  get energy from storage if it exists else a container*/
			if(creep.memory.getenergy == true) {
				creep.getEnergy();
				if (creep.carry.energy == creep.carryCapacity) {
					creep.memory.getenergy = false
				}
			}
			else {
				var buildtarget = Game.getObjectById(creep.room.memory.buildtargetid);
				var buildreturn = creep.build(buildtarget);
				if(buildreturn == ERR_NOT_IN_RANGE) {
					creep.moveTo(buildtarget);
				}
				else if(buildreturn == ERR_INVALID_TARGET) {
					if(buildtarget.structureType == STRUCTURE_RAMPART) {
						if(buildtarget.hits < 5000) {
							creep.repair(buildtarget);
						}
					}
					creep.room.memory.buildtargetid = false;
				}
				else if ( buildreturn == ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.getenergy = true;
					
				}
			}
		}
	}
};