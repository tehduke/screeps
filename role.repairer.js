var roleBuilder = require('role.builder');
require('prototype.creep')

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {

       //creep get energy from storage or container
		
		if ( creep.carry.energy == 0 ) {
			creep.getEnergy();
		}
		
		if ( creep.memory.targetid == false ) {
			var building = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) =>
			(s.structureType != STRUCTURE_CONTAINER && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL)
			&& s.hits < s.hitsMax
			});
			if ( building != undefined ) {
			creep.memory.targetid = building.id
			}
			else {
				roleBuilder.run(creep);
			}
		}
		var building = Game.getObjectById(creep.memory.targetid);
		if ( building.hits < building.hitsMax ) {
			if ( creep.repair(building) == ERR_NOT_IN_RANGE ) {
				creep.moveTo(building);
			}
		}
		else {
			creep.memory.targetid = false;
		}
    }
}