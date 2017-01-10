/*object discribing a haulTask
 * request and supply haulTasks inherit from the genaric haulTask
 * containes the structID,resourceType, and quantity
 * the base of the prototype chain contains methods that are agnostic to if the task is a supply or request
 */

function haulTask (structureId, resourceType, quantity,ownerRoomName) {
	this.structureId = structureId;
	this.resourceType = resourceType;
	this.quantity = quantity;
	this.taskPower = quantity;
	this.ownerRoomName = ownerRoomName;
	// check that task structure exists and that stuct servicing creep memory is set and 
	//cull any noexistent creep from sturuct memory
	initTask: function () = {
		var stucture = Game.getObjectById(this.structureId);
		if (stucture === null) {
			return;
		}
		if (stucture.memory.servicingCreepIds == undefined) {
			stucture.memory.servicingCreepIds = new Array();
		}
		if (stucture.memory.servicingCreepIds.length > 0 ) {
			stucture.memory.servicingCreepIds.forEach(function(element, index, array) {
				if (Game.getObjectById(element) === null ) {
					array.splice(index, 1);
				}
			});
		}
		this.servicingCreepIds = stucture.memory.servicingCreepIds;
	};
	setTaskPower: = function(roomName) {
		if (this.servicingCreepIds.length === 0 ) {
			return;
		}
		var creepCarryPower = 0;
		for (let i = 0; i < this.servicingCreepIds.length; ++i) {
			let creep = Game.getObjectById(this.servicingCreepIds[i]);
			if (_.isNull(creep)) {
				console.log("ERR haulTask.servicingCreepIds containes noexistent creepId")
				console.log(" THIS SHOULD NEVER HAPPEN");
				break;
			}
			creepCarryPower += creep.carryCapacity;
		}
		this.taskPower -= creepCarryPower;
		return;
		
	};
	/* method to find range to closest exit so
	 * creeps taking request tasks can take a list of tasks
	 * and have them (hopefully) be in a sensible order
	*/
	getRangeToExit: = function(exitDir) {
		let building = Game.getObjectById(this.structureId);
		return building.getRangeTo(building.findClosestByRange(exitDir));
	}
	
};
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
			//get buildings and filter out any that can never have a haultask
			let allBuidlidings = Game.rooms[roomsList[i]].find(FIND_STRUCTURES, {filter: (s) => 
			s.structureType !== STRUCTURE_ROAD || s.structureType !== STRUCTURE_WALL || s.structureType !== STRUCTURE_WALL
			});
			_.forEach(allBuidlidings, (s) => 
			if ( !_.isUndefined(s.requesting) || !_.isUndefined(s.supplying)) {
				this.memory.haulTagetBuildingIds.push(s.id);
			}
			)
		}
	}
	var supplyTasks = new Array();
	var requestTasks = new Array();
	for( let i = 0; i < this.memory.haulTagetBuildingIds.length; ++i ) {
		let building = Game.getObjectById( this.memory.haulTagetBuildingIds[i]);
		//if the building exists add supply/request tasks to new arrays
		if (!_.isNull(building)) {
			
			if (!_isUndefined(building.supplying)) {
				for (key in building.supplying ) {
					let task = new haulTask (building.id, key, building.supplying[key], this.name);
					//int the task and set taskPower
					task.initTask();
					task.setTaskPower(this.name);
					//test if the building is storage and set its taskpower to 0
					//this is to provide a floor to make creeps use storage when other
					//supplying buildings are over subscribed
					if (building.structureType === STRUCTURE_STORAGE) {
						task.taskPower = 0;
					}
					supplyTasks.push(task);
				}
			}
			if (!_isUndefined(building.requesting)) {
				for (key in building.requesting ) {
					let task = new haulTask (building.id, key, building.requesting[key], this.name);
					//int the task and set taskPower
					task.initTask();
					task.setTaskPower(this.name);
					requestTasks.push(task);
				}
			}
		}
	}
	// set room haul tasks as propertys of this
	this.supplyTasks = supplyTasks;
	this.requestTasks = requestTasks;
}
