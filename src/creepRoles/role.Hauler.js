 module.exports =  {
    run: function (creep) {
		
		var homeroom = Game.rooms[creep.memory.homeroom]
		if (_.isUndefined(creep.memory.empty)) {
			creep.memory.empty = true;
		}
		if (creep.memory.taskTargetId == undefined) {
			homeroom.addCreepToTask(creep);
			return;
		}
		var target = Game.getObjectById(creep.memory.taskTargetId);
		if (DEBUG.haulerVerbose) {
			console.log("========");
			console.log("creep " + creep.name);
			console.log(" mem task Targes ");
			console.log(JSON.stringify(creep.memory.taskTargetId));
			console.log("mem empty State " + creep.memory.empty);
			console.log("creep carry state");
			console.log(JSON.stringify(creep.carry));
			console.log("========")
		}
		if (_.isNull(target)) {
			if (DEBUG.haulerVerbose) {
			console.log("========");
			console.log("creep " + creep.name);
			console.log(" Target Null releaseAllTasks");
			console.log("========")
			}
			homeroom.removeCreepFromTask(creep);
			homeroom.addCreepToTask(creep);
			return;
			
			
		}
		if (creep.ticksToLive === 1 ) {
			homeroom.removeCreepFromTask(creep);
		}
		
		
		if (creep.memory.empty == true) {
			if ( _.sum(creep.carry) > (creep.carryCapacity * 0.9)) {
				creep.memory.empty = false;
				homeroom.removeCreepFromTask(creep);
				homeroom.addCreepToTask(creep);
			}
			else {
				findFloorStuff(creep);
				
				if (!creep.pos.isNearTo(target)) {
					creep.movePathTo(target);
				}
				else if (target.store[creep.memory.resourceType] != undefined && target.store[creep.memory.resourceType] > 200 ) {
					creep.withdraw(target, creep.memory.resourceType);
					
				}
				else {
				homeroom.removeCreepFromTask(creep);
				homeroom.addCreepToTask(creep);
				}
			}
		}
		else {
			if (_.sum(creep.carry) === 0 ) {
				creep.memory.empty = true;
				homeroom.removeCreepFromTask(creep);
				homeroom.addCreepToTask(creep);
			}
			else {
				fixRoads(creep);
				if (target.structureType === STRUCTURE_EXTENSION || target.structureType === STRUCTURE_SPAWN || target.structureType === STRUCTURE_TOWER) {
					if (target.energy < target.energyCapacity) {
						//if target is extension or spawn try and driveby extensions/spawns on our way to target
						if (creep.room.name === creep.memory.homeroom) {
							let passingTarget = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (s) => 
							(s.structureType === STRUCTURE_EXTENSION || target.structureType === STRUCTURE_SPAWN) && s.energy < s.energyCapacity
							});
							if (passingTarget.length) {
								creep.transfer(passingTarget[0], RESOURCE_ENERGY)
							}
						}
						if (creep.transfer(target, creep.memory.resourceType) === ERR_NOT_IN_RANGE) {
							creep.movePathTo(target);
						} //hacky workround to stop creep trying to stuff mins into extsions
						if ( creep.carry.energy === 0 && _.sum(creep.carry) > 0) {
							if (creep.room.storage != undefined) {
								creep.memory.taskTargetId = creep.room.storage.id
							}
						}
					} 
					else {
						homeroom.removeCreepFromTask(creep);
						homeroom.addCreepToTask(creep)
					}
				}
				else if (target.structureType === STRUCTURE_STORAGE) {
					if (!creep.pos.isNearTo(target)) {
						creep.movePathTo(target)
					}
					for (let key in creep.carry) {
						creep.transfer(target, key);
					}
				}
				else {
					if (!creep.pos.isNearTo(target)) {
						creep.movePathTo(target)
					}
					//test if the creep has resources that the building is requesting
					//or if the building is no longer requesting things
					let shairedKeys = [];
					for ( let key in target.requesting ) {
						if (!_.isUndefined(creep.carry[key])) {
							if (target.requesting[key] > 0  && creep.carry[key] > 0) {
								shairedKeys.push(key);
							}
						}
					}
					//the building is still requesing stuff that we have
					if (shairedKeys.length > 0) {
						if (DEBUG.haulerVerbose ) {
							console.log("========")
							console.log("JSON dump shairedKeys for " + creep.name);
							console.log(JSON.stringify(shairedKeys))
							console.log("========")
						}
						
						for (let i = 0; i < shairedKeys.length; ++i) {
							creep.transfer(target, shairedKeys[i]);
						}
					}
					
					//else creep job is done here releaseTask
					else {
						homeroom.removeCreepFromTask(creep);
						homeroom.addCreepToTask(creep)
					}
				}
			}
		}
	}
 };
 
function findFloorStuff (creep) {
	let floorstuff = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
	if (floorstuff.length) {
		creep.pickup(floorstuff[0]);
	}
};
function fixRoads (creep) {
	var road = _.filter(creep.pos.lookFor(LOOK_STRUCTURES), (s) => s.structureType == STRUCTURE_ROAD);
	if (road.length) {
		if (road[0].hits < road[0].hitsMax) {
			creep.repair(road[0])
		}
	}
};