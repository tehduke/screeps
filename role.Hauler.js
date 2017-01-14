 module.exports =  {
    run: function (creep) {
		if (_.isUndefined(creep.memory.empty)) {
			creep.memory.empty = true;
		}
		if (creep.memory.tasksTargets == undefined) {
			creep.memory.tasksTargets = new Array();
		}
		var target = Game.getObjectById(creep.memory.tasksTargets[0]);
		if (DEBUG) {
			console.log("========");
			console.log("creep " + creep.name);
			console.log(" mem task Targes ");
			console.log(JSON.stringify(creep.memory.tasksTargets));
			console.log("mem empty State " + creep.memory.empty);
			console.log("creep carry state");
			console.log(JSON.stringify(creep.carry));
			console.log("========")
		}
		if (_.isNull(target)) {
			if (DEBUG) {
			console.log("========");
			console.log("creep " + creep.name);
			console.log(" Target Null releaseAllTasks");
			console.log("========")
		}
			releaseAllTasks(creep.memory.homeroom, creep.memory.tasksTargets[0], creep);
		}
		
		if ( creep.memory.tasksTargets.length === 0 ) {
			if (creep.memory.empty == true) {
				getSupplyTask(creep.memory.homeroom, creep);
			}
			else {
				getRequestTasks(creep.memory.homeroom, creep);
			}
		}
		
		if (creep.memory.empty == true) {
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
				releaseAllTasks(creep.memory.homeroom, creep.memory.tasksTargets[0], creep);
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
						if (DEBUG ) {
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
	if (DEBUG) {
		console.log("========")
		console.log("JSON dump getSupplyTask sorted task list for " + creep.name);
		console.log(JSON.stringify(tasklist));
		console.log("========")
	}
	tasklist[0].addCreepToTask(creep);
	creep.memory.tasksTargets = new Array();
	// this change works Im gonna fucking blow a gasgit 
	let temp = tasklist[0].structureId
	creep.memory.tasksTargets.push(temp);
		if (DEBUG) {
		console.log("========")
		console.log("JSON dump mem taskTarges " + creep.name);
		console.log(JSON.stringify(creep.memory.tasksTargets));
		console.log(" in getSupplyTask")
		console.log("========")
		}
	
	
};
function getRequestTasks (roomName, creep) {
	let tasks = new Array();
	let maxTasks = 6;
	creep.memory.tasksTargets = new Array();
	//add all requsting tasks that the creep as resources for into an array
	for (let key in creep.carry) {
		tasks = _.filter(Game.rooms[roomName].requestTasks, (t) => 
		t.resourceType === key && t.taskPower > 0
		);
		//no tasks found try and find the storage task
		if (tasks.length === 0) {
			tasks.push(_.find(Game.rooms[roomName].requestTasks, (t) => 
			t.resourceType === null) )
			//we have a storage
			if (tasks.length > 0) {
			tasks[0].addCreepToTask(creep);
			creep.memory.tasksTargets.push(tasks[0].structureId);
			}
		}
		else {
			//sort tasks by range to creeps
			tasks = _.sortBy(tasks, (t) => t.getRangeToCreep(creep));
			if (DEBUG === true) {
				console.log("========")
				console.log("JSON dump getRequestTasks sorted task list for " + creep.name);
				console.log(JSON.stringify(tasks));
				console.log("========")
			}
			let creepResourceAmount = creep.carry[key];
			while (creepResourceAmount > 0 && maxTasks > 0 ) {
				creep.memory.tasksTargets.push(tasks[0].structureId);
				tasks[0].addCreepToTask(creep);
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
	creep.memory.tasksTargets.splice(0,1)
	 
};
//function to releaseAllTasks
function releaseAllTasks (roomName, structId, creep) {
	for (let i = 0; i < creep.memory.tasksTargets.length; ++i) {
		releaseTask( roomName, structId, creep);
	}
};

