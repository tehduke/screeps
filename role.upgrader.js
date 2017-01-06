require('prototype.creep')
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if (creep.memory.inposition == undefined) {
			creep.memory.inposition = false
		}
		if (creep.memory.getenergy == undefined) {
			creep.memory.getenergy = true;
		}
		if (creep.memory.inposition == false) {
			if (creep.room.storage == undefined) {
				creep.memory.inposition = true
			}
			if (creep.pos.isNearTo(creep.room.controller) == true ) {
				creep.memory.inposition = true
			}
			else creep.movePathTo(creep.room.controller);
		}
		
		if ( creep.memory.getenergy == true ) {
			creep.getEnergy();
			creep.upgradeController(creep.room.controller);
			if (creep.carry.energy === creep.carryCapacity) {
				creep.memory.getenergy = false;
			}
		}
		else {
			if (creep.room.storage == undefined ) {
				creep.upgradeController(creep.room.controller);
				creep.moveTo(creep.room.controller);  
			}
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.movePathTo(creep.room.controller);    
			}
			if (creep.carry.energy === 0) {
				creep.memory.getenergy = true;
				creep.getEnergy();
			}
		}
    }
};