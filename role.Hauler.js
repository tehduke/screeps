 module.exports =  {
    run: function (creep) {
		if (_.isUndefined(creep.memory.empty)) {
			creep.memory.empty = true;
		}
		if (_.isUndefined(creep.memory.tasksTargets)) {
			creep.memory.tasksTargets = new Array();
		}
		var target = Game.getObjectById(creep.memory.tasksTargets[0]);
		if (_.isNull(target)) {
			releaseTask(creep.memory.homeroom, creep.memory.tasksTargets[0], creep);
		}
		
		if ( creep.memory.tasksTargets.length === 0 ) {
			if (creep.memory.empty == true) {
				getSupplyTask(creep.memory.homeroom, creep);
			}
			else {
				getRequestTasks(creep.memory.homeroom, creep);
			}
		}
		
		if (creep.memory.empty = true) {
			if ( _.sum(creep.carry) > (creep.carryCapacity * 0.9)) {
				creep.memory.empty = false;
				releaseTask(creep.memory.homeroom, creep.memory.tasksTargets[0], creep);
				getRequestTasks(creep.memory.homeroom, creep);
			}
			else {
				let floorstuff = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
				if (floorstuff.length) {
					creep.pickup(floorstuff[0]);
				}
				if (!creep.pos.isNearTo(target)) {
					creep.movePathTo(target);
				}
				else if (_.sum(target.store) > 0 ) {
					for (key in target.store) {
						creep.withdraw(target, key);
					}
				}
				else {
					releaseTask(creep.memory.homeroom, creep.memory.tasksTargets[0], creep);
				}
			}
		}
		else {
			if (_.sum(creep.carry) === 0 ) {
				creep.memory.empty = true;
				releaseTask(creep.memory.homeroom, creep.memory.tasksTargets[0], creep);
				getSupplyTask(creep.memory.homeroom, creep);
			}
			else {
				var road = _.filter(creep.pos.lookFor(LOOK_STRUCTURES), (s) => s.structureType == STRUCTURE_ROAD);
				if (road.length) {
					if (road[0].hits < road[0].hitsMax) {
						creep.repair(road[0])
					}
				}
				if (!creep.pos.isNearTo(target)) {
					creep.movePathTo(target);
				}
				else {
					if (target.structureType === STRUCTURE_STORAGE ) {
						for (let key in creep.carry) {
							creep.transfer(target, key);
						}
					}
					//test if the creep has resources that the building is requesting
					//or if the building is no longer requesting things
					let shairedKeys = new Array();
					for ( let key in target.requesting ) {
						if (!_.isUndefined(creep.carry[key])) {
							if (target.requesting[key] > 0  && creep.carry[key] > 0) {
								shairedKeys.push(key);
							}
						}
					}
					//the building is still requesing stuff that we have
					if (shairedKeys.length > 0) {
						for (let i = 0; i < shairedKeys.length; ++i) {
							creep.transfer(target, shairedKeys[i]);
						}
					}
					//else creep job is done here releaseTask
					else {
						releaseTask(creep.memory.homeroom, creep.memory.tasksTargets[0], creep);
						//if we still have tasks move at it
						if (creep.memory.tasksTargets.length > 0 ) {
							target = Game.getObjectById(creep.memory.tasksTargets[0]);
							if (!_.isNull(target)) {
								creep.movePathTo(target);
							}
						}
					}
				}
			}
		}
	}
 };
//utility functions to get tasks and set the task structId's in creep memory
function getSupplyTask (roomName, creep) {
	let tasklist = _.sortByOrder(Game.rooms[roomName].supplyTasks, 'taskPower', 'desc' );
	tasklist[0].addCreepToTask(creep);
	creep.memory.tasksTargets = new Array();
	creep.memory.tasksTargets.push(tasklist[0].structureId);
	
	
};
function getRequestTasks (roomName, creep) {
	let tasks = new Array();
	let maxTasks = 6;
	creep.memory.tasksTargets = new Array();
	//add all requsting tasks that the creep as resources for into an array
	for (let key in creep.carry) {
		tasks = _.filter(Game.rooms[roomName].requestTasks, (t) => 
		t.resourceType === key
		);
		//no tasks found try and find the storage task
		if (tasks.length === 0) {
			task.push(_.find(Game.rooms[roomName].requestTasks, (t) => 
			t.resourceType === null) )
			//we have a storage
			if (tasks.length > 0) {
			task[0].addCreepToTask(creep);
			creep.memory.tasksTargets.push(task[0].structureId);
			}
		}
		else {
			//sort tasks by range to creeps
			tasks = _.sortBy(tasks, (t) => t.getRangeToCreep(creep));
			let creepResourceAmount = creep.carry[key];
			while (creepResourceAmount > 0 || maxTasks !== 0 ) {
				creep.memory.tasksTargets.push(tasks[0].structureId);
				--maxTasks;
				creepResourceAmount -= tasks[0].quantity;
				tasks.splice(0, 1);
				if (tasks.length === 0 ) {
					break;
				}
			}
		}
		
		
	}
	


	
	
};
//findTask in homeroomTasklists and call remove creep function
function releaseTask (roomName, structId, creep) {
	
	let task = _(Game.rooms[roomName].supplyTasks).concat(Game.rooms[roomName].requestTasks).filter( (t) => t.structureId === structId);
	if (task.length > 0) {
		task[0].removeCreepFromTask(creep);
	}
	 
};

