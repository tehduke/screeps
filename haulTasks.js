require('prototype.structure');
/*object discribing a haulTask
 * request and supply haulTasks inherit from the genaric haulTask
 * containes the structID,resourceType, and quantity
 * the base of the prototype chain contains methods that are agnostic to if the task is a supply or request
 */

function haulTask (structureId, resourceType, quantity,ownerRoomName) {
	this.structureId = structureId;
	this.resourceType = resourceType;
	this.quantity = quantity;
	this.ownerRoomName = ownerRoomName;
	this.servicingCreepIds = new Array();
	// check that task structure exists and that stuct servicing creep memory is set and 
	//cull any noexistent creep from sturuct memory GC if necssery  
	this.initTask  = function ()  {
		var structure = Game.getObjectById(this.structureId);
		if (structure === null) {
			return ERR_INVALID_TARGET;
		}
		if (_.isUndefined(structure.memory.servicingCreepIds) ) {
			this.servicingCreepIds = new Array();
		}
		else  {
			structure.memory.servicingCreepIds.forEach(function(element, index, array) {
				if (Game.getObjectById(element) === null ) {
					array.splice(index, 1);
				}
			});
			if (structure.memory.servicingCreepIds.length === 0 ) {
				delete structure.memory;
				this.servicingCreepIds = new Array();
			}
			else {
				this.servicingCreepIds = structure.memory.servicingCreepIds;
			}
		}
		
	};
	
};
//haulTask function to updateTask with the creepID and the task orgin structmemory
haulTask.prototype.addCreepToTask = function(creep) {
	var structure = Game.getObjectById(this.structureId);
	if (structure === null) {
			return ERR_INVALID_TARGET;
	}
	if (_.isUndefined(structure.memory.servicingCreepIds) ) {
		structure.memory.servicingCreepIds = new Array();
	}

	this.servicingCreepIds.push(creep.id);
	structure.memory.servicingCreepIds.push(creep.id);
	if (DEBUG.haulTaskVerbose) {
		let temp = structure.memory.servicingCreepIds.find((t) => t == creep.id)
		//if (!_.isUndefined(temp)) {
			//throw new Error();
		//}
		console.log("===========");
		console.log(" in room " +this.ownerRoomName )
		console.log(" Orgin task structId" + this.structureId)
		console.log(" adding Creep " + creep.name + " to task of " + this.structureId);
		console.log(" thisTask creepIds is " + this.servicingCreepIds);
		console.log(" Orgin task servicingCreepIds is " + structure.memory.servicingCreepIds);
		console.log("===========");
		
	}
	return OK

	
};
//function to remove creep from task
haulTask.prototype.removeCreepFromTask = function(creep) {
	var structure = Game.getObjectById(this.structureId);
	if (structure === null) {
			return  OK;
	}
	if (this.servicingCreepIds.length <= 1) {
		this.servicingCreepIds = new Array();
		delete structure.memory.servicingCreepIds;
	}
	else {
		let servicingCreepIdsIndex = this.servicingCreepIds.indexOf(creep.id);
		if (servicingCreepIdsIndex > -1) {
			this.servicingCreepIds.splice(servicingCreepIdsIndex, 1);
		}
		let StrucIndex = structure.memory.servicingCreepIds.indexOf(creep.id);
		if (StrucIndex > -1) {
			 structure.memory.servicingCreepIds.splice(StrucIndex, 1);
		}
	}
	return OK;
	
};
//function to get range to creep so for requesting tasks creeps can take tasks by closest
//sets range to closest exit if creep isnt in the room
haulTask.prototype.getRangeToCreep = function(creep) {
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
Object.defineProperty(haulTask.prototype, "creepCarryPower", { 
	get: function() {
		var creepCarryPower = 0;
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
Object.defineProperty(haulTask.prototype, "taskPower", {
    get: function () {
		let building = Game.getObjectById(this.structureId);
		var taskPower =  this.quantity;
	if (building.structureType === STRUCTURE_STORAGE) {
		taskPower = 0;
		if (DEBUG.haulTaskVerbose ) {
			console.log("===========");
			console.log("Task power called for " + this.structureId);
			console.log("found " + this.servicingCreepIds.length + " creeps")
			console.log(" Task Power " + taskPower );
			console.log("===========");
		}
		return taskPower;
	}
	if (this.servicingCreepIds.length === 0 ) {
		return this.quantity;
	}
	taskPower -= this.creepCarryPower;
		if (DEBUG.haulTaskVerbose ) {
				console.log("===========");
				console.log("Task power called for " + this.structureId);
				console.log("found " + this.servicingCreepIds.length + " creeps")
				console.log(" Task Power " + taskPower );
				console.log("===========");
		}
		return taskPower;

    },
	configurable: true,
	enumerable: true
});

Room.prototype.getHaulTasks = function () {

	if (!this.controller.my) {
		return ERR_NOT_OWNER;
		console.log("ERR called getHaulTasks on unownded room " + this.name);
	}
	//refresh room haultargt buildings
	if (_.isUndefined(this.memory.haulTagetBuildingIds)  || Game.time & 20 === 0 ) {
		this.memory.haulTagetBuildingIds = new Array();
		let roomsList = new Array();
		roomsList.push(this.name);
		roomsList = roomsList.concat(MYROOMS[this.name]);
		for (let i = 0; i < roomsList.length; ++i ) {
			//get buildings and filter out any that can never have a haultask and storage
			let allBuidlidings = Game.rooms[roomsList[i]].find(FIND_STRUCTURES, {filter: (s) => 
			s.structureType !== STRUCTURE_ROAD || s.structureType !== STRUCTURE_WALL || s.structureType !== STRUCTURE_RAMPART || s.structureType !== STRUCTURE_STORAGE
			});
			
			for (let i = 0; i < allBuidlidings.length; ++i) {
				if ( !_.isUndefined(allBuidlidings[i].requesting) || !_.isUndefined(allBuidlidings[i].supplying)) {
				this.memory.haulTagetBuildingIds.push(allBuidlidings[i].id);
				}
			}
		}
	}
	var supplyTasks = new Array();
	var requestTasks = new Array();
	//create special requesting task for storage that be used when other taskes are fufilled
	if (!_.isUndefined(this.storage)) {
		let task = new haulTask ( this.storage.id, null, 0, this.name);
		task.initTask();
		requestTasks.push(task);
	}
	for( let i = 0; i < this.memory.haulTagetBuildingIds.length; ++i ) {
		let building = Game.getObjectById( this.memory.haulTagetBuildingIds[i]);
		//if the building exists add supply/request tasks to new arrays
		if (!_.isNull(building)) {
			
			if (!_.isUndefined(building.supplying)) {
				for (key in building.supplying ) {
					let task = new haulTask (building.id, key, building.supplying[key], this.name);
					//int the task and set taskPower
					if (task.initTask() !== ERR_INVALID_TARGET) {
						supplyTasks.push(task);
					}
				}
			}
			if (!_.isUndefined(building.requesting)) {
				for (key in building.requesting ) {
					let task = new haulTask (building.id, key, building.requesting[key], this.name);
					//int the task and set taskPower
					if (task.initTask() !== ERR_INVALID_TARGET && task.taskPower > 0) {
						requestTasks.push(task);
					}
				}
			}
		}
		else {
			this.memory.haulTagetBuildingIds.splice(i, 1);
		}
	}
	// set room haul tasks as propertys of this
	this.supplyTasks = supplyTasks;
	this.requestTasks = requestTasks;
	if (DEBUG.haulTaskVerbose) {
		console.log("====== " + this.name + " ======")
		console.log("supplyTasks JSON dump");
		console.log(JSON.stringify(supplyTasks));
		console.log("requestTasks JSON dump");
		console.log(JSON.stringify(requestTasks));
		console.log("====== END ======");
	}
	
}
Room.prototype.trackTaskPower = function () {
	if (_.isUndefined(this.supplyTasks) || _.isUndefined(this.requestTasks)) {
		console.log("ERR " + this.name + " undefined taskList");
		return 0;
	}
	//add all the quantitys of all tasks together to get total task power
	var totalTaskPower = _.sum(this.supplyTasks, (t) => t.quantity) + _.sum(this.requestTasks, (t) => t.quantity);
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
	if (_.isUndefined(this.supplyTasks) || _.isUndefined(this.requestTasks)) {
		console.log("ERR " + this.name + " undefined taskList");
		return 0;
	}
	var totalHaulPower = _.sum(this.supplyTasks, (t) => t.creepCarryPower) + _.sum(this.requestTasks, (t) => t.creepCarryPower);
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
