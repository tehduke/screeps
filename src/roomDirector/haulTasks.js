require('Requestsupply');
/*object discribing a haulTask
 * request and supply haulTasks inherit from the genaric haulTask
 * containes the structID,resourceType, quantity, ownerRoomName, creeps servicing task as and array of creep Id's
 * the base of the prototype chain contains methods that are agnostic to if the task is a supply or request
 */

function HaulTask (structureId, resourceType, quantity, ownerRoomName, servicingCreepsArray) {
	this.structureId = structureId;
	this.resourceType = resourceType;
	this.quantity = quantity;
	this.ownerRoomName = ownerRoomName;
	this.servicingCreepIds = servicingCreepsArray;

	
};

//function to get range to creep so for requesting tasks creeps can take tasks by closest
//sets range to closest exit if creep isnt in the room
HaulTask.prototype.getRangeToCreep = function(creep) {
	var structure = Game.getObjectById(this.structureId);
	if (structure === null) {
			return ERR_INVALID_TARGET;
	}
	if (creep instanceof Creep) {
		//test if creep is in room
		if (creep.room.name === structure.room.name ) {
			return structure.pos.getRangeTo(creep);
		}
		else {
			let exit = structure.room.findExitTo(creep.room.name);
			return structure.pos.getRangeTo(structure.pos.findClosestByRange(exit));
		}
	}
	else {
		return ERR_INVALID_TARGET;
	}
};
//property for total creep carryPower for task
// used in haultask logging, creep spawning and working out task power
Object.defineProperty(HaulTask.prototype, "creepCarryPower", { 
	get: function() {
		var creepCarryPower = 0;
		if (_.isUndefined(this.servicingCreepIds)) {
			return 0
		}
		if (this.servicingCreepIds.length === 0 ) {
			if (DEBUG.haulTaskVerbose) {
				console.log("===========");
				console.log("Creep Carry Power called for " + this.structureId);
				console.log("found " + this.servicingCreepIds.length + " creeps")
				console.log(" Task Creep CarryPower " + creepCarryPower )
				console.log("===========");
			}
			return creepCarryPower;
		}
		else {
			for (let i = 0; i < this.servicingCreepIds.length; ++i) {
				let creep = Game.getObjectById(this.servicingCreepIds[i]);
				if (_.isNull(creep)) {
					console.log("ERR haulTask.servicingCreepIds containes noexistent creepId")
					console.log("THIS SHOULD NEVER HAPPEN");
					return 0;
				}
				creepCarryPower += creep.carryCapacity;
			}
			if (DEBUG.haulTaskVerbose) {
				console.log("===========");
				console.log("Creep Carry Power called for " + this.structureId);
				console.log("found " + this.servicingCreepIds.length + " creeps")
				console.log(" Task Creep CarryPower " + creepCarryPower )
				console.log("===========");
			}
			return creepCarryPower;
		}
	
	},
	configurable: true,
	enumerable: true
});
//taskPower is what supplying tasks are wighted by for assenment priority
Object.defineProperty(HaulTask.prototype, "taskPower", {
    get: function () {
		let taskPower = this.quantity
		taskPower -= this.creepCarryPower;
		return taskPower;

    },
	configurable: true,
	enumerable: true
});

Room.prototype.trackTaskPower = function () {
	var tasks = this.supplyTasks.concat(this.requestTasks);
	//add all the quantitys of all tasks together to get total task power
	var totalTaskPower = _.sum(tasks, (t) => t.quantity)
	var sampleTicks = 10000;
	
	
	if (_.isUndefined(this.memory.avgTaskPower)) {
		this.memory.lastTotalTaskPower = (totalTaskPower);
		this.memory.avgTaskPower = (totalTaskPower + totalTaskPower) / sampleTicks;
	}
	else {
		this.memory.lastTotalTaskPower -= this.memory.avgTaskPower;
		this.memory.avgTaskPower = (this.memory.lastTotalTaskPower + totalTaskPower) / sampleTicks;
		this.memory.lastTotalTaskPower = totalTaskPower;
	}
	return this.memory.avgTaskPower;
	
};
Room.prototype.trackHaulPower = function () {
	var tasks = this.supplyTasks.concat(this.requestTasks);
	var totalHaulPower = _.sum(tasks, (t) => t.creepCarryPower);
	var sampleTicks = 10000;
	
	
	if (_.isUndefined(this.memory.avgHaulPower)) {
		this.memory.lastTotalHaulPower = (totalHaulPower);
		this.memory.avgHaulPower = (totalHaulPower + totalHaulPower) / sampleTicks;
	}
	else {
		this.memory.lastTotalHaulPower -= this.memory.avgHaulPower;
		this.memory.avgHaulPower = (this.memory.lastTotalHaulPower + totalHaulPower) / sampleTicks;
		this.memory.lastTotalHaulPower = totalHaulPower;
	}
	 return this.memory.avgHaulPower
};
//logic to addcreeps to task or getstuff from storage
Room.prototype.addCreepToTask = function(creep) {
	this.removeCreepFromTask(creep);
	this.accountTasks();
	if (DEBUG.haulTaskVerbose) {
	console.log("~~~~~~~~")
	console.log("adding creep id" + creep.id + " to task");
	}
	//creep is empty so fetch somthing
	if (creep.memory.empty === true) {
		// I think this sytem will pro doing minral based tasks could be a bad thing in low haulpower situations?!?
		//outstanding request/supply tasks so see if we can pickup the resources to 
		//complete the highist outstanding request task from supplytasts or storage
		if (this.supplyTasks.length > 0 && this.requestTasks.length > 0 ) {
			if (this.supplyTasks[0].resourceType === this.requestTasks[0].resourceType) {
				creep.memory.taskTargetId = this.supplyTasks[0].structureId;
				creep.memory.resourceType = this.supplyTasks[0].resourceType;
				this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType].push(creep.id);
				
				if (DEBUG.haulTaskVerbose) {
					console.log("struct id " + this.supplyTasks[0].structureId )
					console.log("resource type " + this.supplyTasks[0].resourceType )
					console.log("dump haultasks creepIds " )
					console.log(this.supplyTasks[0].servicingCreepIds)
					console.log("dump [structid][resource] creep array")
					console.log(this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType])
					console.log("~~~~~~~~")
				}
				return;
			}
			//test if we have a storage and it has at least one creep load of resouces to complete the task
			else if (this.storage != undefined && (this.storage.store[this.requestTasks[0].resourceType] != undefined || this.storage.store[this.requestTasks[0].resourceType] >= creep.carryCapacity)) {
				creep.memory.taskTargetId = this.storage.id;
				creep.memory.resourceType = this.requestTasks[0].resourceType;
				if (DEBUG.haulTaskVerbose) { 
					console.log("storage Task")
					console.log("~~~~~~~~")
				}
				return;
			}
			//no resource found to complete the highistprio requst task just get a supplyTask
			else {
				creep.memory.taskTargetId = this.supplyTasks[0].structureId;
				creep.memory.resourceType = this.supplyTasks[0].resourceType;
				this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType].push(creep.id);
				if (DEBUG.haulTaskVerbose) {
					console.log("struct id " + this.supplyTasks[0].structureId )
					console.log("resource type " + this.supplyTasks[0].resourceType )
					console.log("dump haultasks creepIds " )
					console.log(this.supplyTasks[0].servicingCreepIds)
					console.log("dump [structid][resource] creep array")
					console.log(this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType])
					console.log("~~~~~~~~")
				}
				return;
			}
		}
		//else try and do a supplyTasks
		else if (this.supplyTasks.length > 0) {
			creep.memory.taskTargetId = this.supplyTasks[0].structureId;
			creep.memory.resourceType = this.supplyTasks[0].resourceType;
			let resourceType = this.supplyTasks[0].resourceType;
			this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType].push(creep.id);
			if (DEBUG.haulTaskVerbose) {
					console.log("struct id " + this.supplyTasks[0].structureId )
					console.log("resource type " + this.supplyTasks[0].resourceType )
					console.log("dump haultasks creepIds " )
					console.log(this.supplyTasks[0].servicingCreepIds)
					console.log("dump [structid][resource] creep array")
					console.log(this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType])
					console.log("~~~~~~~~")
			}
			return;
		}
		//else try and grab from storage to do request Task ToDO make creeps sleep if no tasks found
		else if (this.requestTasks.length > 0) {
			if (this.storage != undefined && (this.storage.store[this.requestTasks[0].resourceType] != undefined || this.storage.store[this.requestTasks[0].resourceType] >= creep.carryCapacity)) {
				creep.memory.taskTargetId = this.storage.id;
				creep.memory.resourceType = this.requestTasks[0].resourceType;
				if (DEBUG.haulTaskVerbose) { 
					console.log("storage Task")
					console.log("~~~~~~~~")
				}
				return;
			}
		}
	}
	else {
		if (this.requestTasks.length > 0) {
		//test if creep resource type matches highist prio request task
			if (creep.memory.resourceType === this.requestTasks[0].resourceType) {
				creep.memory.taskTargetId = this.requestTasks[0].structureId;
				creep.memory.resourceType = this.requestTasks[0].resourceType;
				this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType].push(creep.id);
				if (DEBUG.haulTaskVerbose) {
					console.log("struct id " + this.requestTasks[0].structureId )
					console.log("resource type " + this.requestTasks[0].resourceType )
					console.log("dump haultasks creepIds " )
					console.log(this.requestTasks[0].servicingCreepIds)
					console.log("dump [structid][resource] creep array")
					console.log(this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType])
					console.log("~~~~~~~~")
				}
				return;
			}
			else if (this.storage != undefined) {
				creep.memory.taskTargetId = this.storage.id;
				if (DEBUG.haulTaskVerbose) { 
					console.log("storage Task")
					console.log("~~~~~~~~")
				}
				return;
			}
		}
		else if (this.storage != undefined) {
				creep.memory.taskTargetId = this.storage.id;
				if (DEBUG.haulTaskVerbose) { 
					console.log("storage Task")
					console.log("~~~~~~~~")
				}
				return;
		}
	}
};
//remove creep from stuct: resoruce : [creep array]
//task will repropergate back into tasklist next tick
Room.prototype.removeCreepFromTask = function (creep) {
	if(DEBUG.haulTaskVerbose) {
		console.log("++++++++")
		console.log("removing creep " + creep.name)
		console.log("creep id " + creep.id)
		console.log("from task " + creep.memory.taskTargetId)
	}
	let struct = Game.getObjectById(creep.memory.taskTargetId)
	if ( struct == null) {
		creep.memory.taskTargetId = null;
		if (DEBUG.haulTaskVerbose) {
			console.log("struct is null");
			console.log("++++++++");
		}
		return;
	}
	if (this.memory.haulTagetBuildingIds[creep.memory.taskTargetId] != undefined
	&& this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType] != undefined) {
		let sCreepArray = _.clone(this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType])

		let creepIndex = sCreepArray.indexOf(creep.id);
		if (creepIndex > -1 ) {
			sCreepArray.splice(creepIndex, 1);
			this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType] = sCreepArray
			if (DEBUG.haulTaskVerbose) {
				console.log("creep index found splice attampted")
				console.log("dumping array")
				console.log(this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType])
				console.log("++++++++")
			}
		}
		else if (DEBUG.haulTaskVerbose) {
				console.log("ERR creepid index not found")
				console.log("dumping array")
				console.log(this.memory.haulTagetBuildingIds[creep.memory.taskTargetId][creep.memory.resourceType])
				console.log("++++++++")
			}
	}
	else if (DEBUG.haulTaskVerbose) {
		console.log("failed to find task" + creep.memory.taskTargetId)
		console.log("resourceKey " + creep.memory.resourceType)
		console.log("++++++++")
	}
	creep.memory.taskTargetId = null;
};
//wrapper function to invoke account supplyTasks and account RequestTasks
//should only be called once per tick
//other task account functions split to save cpu
Room.prototype.accountTasks = function () {
	this.accountSupplyTasks();
	this.accountRequestTasks();
};

Room.prototype.accountSupplyTasks = function () {
	//sort tasks by taskpower highist to lowist
	if (this.supplyTasks.length > 0) {
		this.supplyTasks = _.sortByOrder(this.supplyTasks, 'taskPower', 'desc' );
		//tweek min valid tastpower up to stop creeps waiting for containers to fill
		if (this.supplyTasks[0].taskPower <= 100 ) {
			this.supplyTasks = [];
		}
	}
};
Room.prototype.accountRequestTasks = function () {
	//sort tasks by taskpower highist to lowist
	if (this.requestTasks.length > 0) {
		this.requestTasks = _.sortByOrder(this.requestTasks, 'taskPower', 'desc' );
		if (this.requestTasks[0].taskPower <= 0 ) {
			this.requestTasks = [];
		}
	}
};
//function to gen tasklists 
Room.prototype.genTasks = function () {
/*validate/setup tasks in memory
tasks format in memory is
room.memory.structId = {
 resourceType: [creeps on task ids],
 and so on...
   
  }
then populate this rooms tasklists
 */ 
	this.supplyTasks = [];
	this.requestTasks =[];
	for (let structId in this.memory.haulTagetBuildingIds) {
		let structResourceKeys = [];
		let structSupplyingKeys = [];
		let structRequestingKeys = [];
		let struct = Game.getObjectById(structId);
		//build a list of resourcekeys in stuct request/supply
		if (!_.isUndefined(struct.supplying)) {
			for (let resourcekey in struct.supplying) {
				structSupplyingKeys.push(resourcekey);
			}
		}
		if (!_.isUndefined(struct.requesting)) {
			for (let resourcekey in struct.requesting) {
				structRequestingKeys.push(resourcekey);
			}
		}
		structResourceKeys = structSupplyingKeys.concat(structRequestingKeys);
		//first cull any resource keys that the buildings isn't requesting/supplying anymore
		for (let resourceKey in this.memory.haulTagetBuildingIds[structId]) {
			let temp = structResourceKeys.indexOf(resourceKey)
			if (temp === -1) {
				delete this.memory.haulTagetBuildingIds[structId][resourceKey]
			}
			
		}
		//next add any resource keys to memory we dont have
		let structMemoryResourceKeys = _.keys(this.memory.haulTagetBuildingIds[structId]);
		for (let i = 0; i < structResourceKeys.length; ++i) {
		let temp = structMemoryResourceKeys.indexOf(structResourceKeys[i]);
			if (temp === -1) {
				this.memory.haulTagetBuildingIds[structId][structResourceKeys[i]] = [];
			}
		}
		// gc dead creeps in struct memory
		for (let resourceKey in this.memory.haulTagetBuildingIds[structId]) {
			let creepIds = this.memory.haulTagetBuildingIds[structId][resourceKey];
			if (creepIds.length > 0) {
				for(let i = 0; i < creepIds.length; ++i) {
					let temp = Game.getObjectById(creepIds[i]);
					if (_.isNull(temp)) {
						let creepindex = this.memory.haulTagetBuildingIds[structId][resourceKey].indexOf(creepIds[i]);
						if (creepindex > -1 ) {
							creepindex = this.memory.haulTagetBuildingIds[structId][resourceKey].splice(creepindex, 1);
						}
					}
				}
			}
		}
		//memory accounting done start gening this buildings supply/request tasks and adding them to this roomtasklists
		
		//build supplyTasks
		for (let i = 0; i < structSupplyingKeys.length; ++i) {
			let tmp = structSupplyingKeys[i]
			let task = new HaulTask(structId, structSupplyingKeys[i], struct.supplying[structSupplyingKeys[i]], this.name, 
			this.memory.haulTagetBuildingIds[structId][tmp]
			);
			console.log("room " + this.name);
			console.log(this.memory.haulTagetBuildingIds[structId][tmp])
			console.log(structSupplyingKeys[i])
			this.supplyTasks.push(task);
		}
		for (let i = 0; i < structRequestingKeys.length; ++i) {
			let tmp = structRequestingKeys[i]
			let task = new HaulTask(structId, structRequestingKeys[i], struct.requesting[structRequestingKeys[i]], this.name, 
			this.memory.haulTagetBuildingIds[structId][tmp]
			);
			console.log("room " + this.name);
			console.log(this.memory.haulTagetBuildingIds[structId][tmp])
			console.log(structRequestingKeys[i])
			this.requestTasks.push(task);
		}
	}
};
Room.prototype.accountHaulTargets = function() {
	if (!this.controller.my) {
		return ERR_NOT_OWNER;
		console.log("ERR called getHaulTasks on unownded room " + this.name);
	}
	//gc dead building or lacking vision from list
	for (let key in this.memory.haulTagetBuildingIds) {
		let temp = Game.getObjectById(key);
		if (_.isNull(temp)) {
			delete this.memory.haulTagetBuildingIds[key]
		}
	} 
	//refresh room haultargt buildings
	if (this.memory.haulTagetBuildingIds == undefined  || Game.time & 20 === 0 ) {
		if (!this.memory.haulTagetBuildingIds) {
			this.memory.haulTagetBuildingIds =  {};
		}
		let roomsList = [];
		roomsList.push(this.name);
		roomsList = roomsList.concat(MYROOMS[this.name]);
		for (let i = 0; i < roomsList.length; ++i ) {
			//get buildings and filter out any that can never have a haultask and storage/links
			//storage/links is a special case  addCreepToTask will make creeps use them when appropriet 
			if (Game.rooms[roomsList[i]] != undefined) {
				let allBuidlidings = Game.rooms[roomsList[i]].find(FIND_STRUCTURES, {filter: (s) => 
				s.structureType !== STRUCTURE_ROAD || s.structureType !== STRUCTURE_WALL || s.structureType !== STRUCTURE_RAMPART || s.structureType !== STRUCTURE_STORAGE
				});
				console.log("allBuidlidings length " + allBuidlidings.length)
				for (let i = 0; i < allBuidlidings.length; ++i) {
					if ( !_.isUndefined(allBuidlidings[i].requesting) || !_.isUndefined(allBuidlidings[i].supplying)) {
						let tmp = allBuidlidings[i].id
						console.log(tmp)
						if (!this.memory.haulTagetBuildingIds[tmp]) {
						
							this.memory.haulTagetBuildingIds[tmp] = {};
						}
					}
				}
			}
		}
	}
	
};
