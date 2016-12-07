
require('prototype.spawn');
require('spawn.Harvester');
require('spawn.Hauler');
require('spawn.energytug');
require('spawn.claimer');

StructureSpawn.prototype.factory = function () {
	// setup some minimum numbers for different roles
	var minimumNumberOfBuilders = 0 ;
	var buildsites = Game.rooms[HOME].find(FIND_CONSTRUCTION_SITES);
	if (buildsites.length){
		var minimumNumberOfBuilders =  1;
	}
    
    var minimumNumberOfUpgraders = 2;
    
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfWallRepairers = 1;
	var minimumNumberOfClaimers = 1;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfTugs = _.sum(Game.creeps, (c) => c.memory.role == 'energytug');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
	var numberOfHaulers = _.sum(Game.creeps, (c) => c.memory.role == 'hauler');
	var numberOfClaimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer');



    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    
	
    

    
        
		
		

        /* make sure that we have at least 1 hauler/harvester combo */
        if (numberOfHarvesters == 0) {
            // spawn one with what is available
             Game.spawns.Spawn1.createHarvester(Game.spawns.Spawn1.room.energyAvailable);
        }
		if (numberOfHaulers == 0) {
     
         Game.spawns.Spawn1.createHauler(Game.spawns.Spawn1.room.energyAvailable);
        }
		var spawnreturn = Game.spawns.Spawn1.createHarvester(energy);
		if (spawnreturn == OK ){
		
			spawnreturn = Game.spawns.Spawn1.createHauler(energy);
			if ( spawnreturn == OK) {
				
				  // if not enough upgraders
				if (numberOfUpgraders < minimumNumberOfUpgraders) {
				// try to spawn one
					 Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
				}
				else if (numberOfClaimers < minimumNumberOfClaimers ) {
				// try to spawn one
					 Game.spawns.Spawn1.createClaimer(energy);
				}
    // if not enough repairers
				else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
					Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
				}
    // if not enough builders
				else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
					 Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
				}
    // if not enough wallRepairers
				else if (numberOfWallRepairers < minimumNumberOfWallRepairers ) {
        // try to spawn one
				Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
				}
			}
		}
};
module.exports = function () {}
