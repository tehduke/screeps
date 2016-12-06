// import modules


require('prototype.spawn');
require('spawn.Harvester');
require('spawn.Hauler');
require('spawn.energytug');
require('spawn.claimer');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHauler = require('role.Hauler');
var roleWallRepairer = require('role.wallRepairer');
var roleEnergytug = require('role.energytug');

global.HOME = 'W49S71' ;



module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'hauler'){
            roleHauler.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
		 else if (creep.memory.role == 'energytug') {
            roleEnergytug.run(creep);
        }
        
    }

   /var towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
    });
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            }
        } 

    // setup some minimum numbers for different roles
    var minimumNumberOfHarvesters = 2;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 5;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfHaulers = 2;
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
    var name = undefined;
	
    

    
        Game.spawns.Spawn1.createHarvester(energy);
		Game.spawns.Spawn1.createEnergyTug(energy);
		Game.spawns.Spawn1.createHauler(energy);

        // if spawning failed and we have no harvesters left
        if (numberOfHarvesters == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.createHarvester(Game.spawns.Spawn1.room.energyAvailable);
        }
		// if not enough haulers
        if (numberOfTugs == 0) {
        // spawn one with what is available
        name = Game.spawns.Spawn1.createEnergyTug(Game.spawns.Spawn1.room.energyAvailable);
        }
		if (numberOfHaulers == 0) {
        // spawn one with what is available
        name = Game.spawns.Spawn1.createHauler(Game.spawns.Spawn1.room.energyAvailable);
        }
		
    
	
    

    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
    }
	else if (numberOfClaimers < minimumNumberOfClaimers ) {
        // try to spawn one
        name = Game.spawns.Spawn1.createClaimer(energy);
	}
    // if not enough repairers
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
    }
    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
    }
    // if not enough wallRepairers
	else if (numberOfWallRepairers < minimumNumberOfWallRepairers ) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
    }
	
	

    
    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false

};