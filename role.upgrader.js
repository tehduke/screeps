require('prototype.creep')
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if (creep.memory.inposition == undefined) {
			creep.memory.inposition = false
		}
		if (creep.memory.inposition == false) {
			if (creep.pos.isNearTo(creep.room.controller) == true ) {
				creep.memory.inposition = true
			}
			else creep.moveTo(creep.room.controller);
		}
		
		if ( creep.carry.energy == 0 ) {
			creep.getEnergy();
		}
		else {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);    
			}
		}
    }
};