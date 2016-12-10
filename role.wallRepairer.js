var roleBuilder = require('role.builder');
require('prototype.creep')

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if ( creep.carry.energy == 0 ) {
			creep.getEnergy();
		}
		if ( creep.memory.targetid == false ) {
			var walls = creep.room.find(FIND_STRUCTURES, { filter: (s) =>
			s.structureType == STRUCTURE_WALL && s.structureType == STRUCTURE_RAMPART
			});
				if (walls.length) {
					var allwall = [];
					// Calculate the percentage health
					for (var i = 0; i < walls.length; i++) {
						allwall.push({
							wallhealth: ( ( walls[i].hits / walls[i].hitsMax ) * 100 )
                        
						});
					}
					// Get the container containing the most energy.
					var minwallhealth = _.min(allwall, function (container) {
						return container.wallhealth;
					});	
					creep.memory.targetid = minwallhealth.id;
				}
		}
		else {
		var wall = Game.getObjectById(creep.memory.targetid);
		if ( wall.hits < wall.hitsMax ) {
			if ( creep.repair(wall) == ERR_NOT_IN_RANGE ) {
				creep.moveTo(wall);
			}
		}
		else {
			creep.memory.targetid = false;
		}
		}
		
		
			
		
		
    }
};