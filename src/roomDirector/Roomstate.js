

/* Function to return the energy income of a room over 100 ticks mesured in creep lifetimes*/
Room.prototype.energyIncomeTracker = function() {
	if (this.storage == undefined) {
		return 0 ;
	}

	if (!this.memory.energyIncome) {
		this.memory.energyIncome = 0;
	}

		this.memory.energyIncome = Math.floor( (this.storage.store[RESOURCE_ENERGY]  + this.memory.energyIncome ) / 2   );
	}

	
	

/* function to check if other rooms should aid this room */
Room.prototype.checkMutialAid = function () {
	//test for vision
	if (Game.rooms[this.name] != undefined) {
		if (this.controller.my == true) {

			if (this.controller.level < 4 ) {
				// room is bootstraping
				Memory.roomstates[this.name].bootstraping = true;
			}
			else if ( Memory.roomstates[this.name] != undefined) {
				delete Memory.roomstates[this.name].claiming;
				delete Memory.roomstates[this.name].bootstraping;
			}
		}
		else {
			Memory.roomstates[this.name].claiming = true;
		}
	}
	//else send scout
}
Room.prototype.check = function () {
	if (!Memory.roomstates ) {
		Memory.roomstates = new Object();
	}
	if (!Memory.roomstates[this.name]) {
		Memory.roomstates[this.name] = {};
	}
	//wrapper for the roomstate eval functions
	this.manageConstrutionSites()
	this.planRoads();
	this.buildRoads();
	this.energyIncomeTracker();
	this.checkMutialAid();
	if (this.storage != undefined) {

		if (this.storage.store[RESOURCE_ENERGY] > ENERGY_RESERVE ) {
			Memory.roomstates[this.name].energyOk = true;
		}
		else {
			Memory.roomstates[this.name].energyOk = false
		}

	}
}
Room.prototype.setSlaveSources = function() {
	if ( Game.time % 500 === 0 ) {
		
		for (let room in MYROOMS) {
			var slaverooms = MYROOMS[room];
			for ( let i = 0; i < slaverooms.length; ++i) {
				Memory.rooms[slaverooms[i]] = {};
				Memory.rooms[slaverooms[i]].sources = new Array();
				let sources = Game.rooms[slaverooms[i]].find(FIND_SOURCES);
				for (let j = 0; j < sources.length; ++j) {
					Memory.rooms[slaverooms[i]].sources.push(sources[j].id);
				}
			}
		}
	}
}
Room.prototype.manageConstrutionSites = function () {
	if (Game.time % 100 === 0) {
		
			this.memory.constructionsites = new Array()
		
		var roomslist = new Array([this.name]) 
		roomslist = roomslist.concat(this.memory.slaves);
		var constructionSites = new Array();
		for (let i = 0; i < roomslist.length; ++i ) {
			if (Game.rooms[roomslist[i]] != undefined ) {
				constructionSites = Game.rooms[roomslist[i]].find(FIND_MY_CONSTRUCTION_SITES);
				if (constructionSites.length) {
					for (let j = 0; j < constructionSites.length; ++j) {
						this.memory.constructionsites.push(constructionSites[j].id);
					}
				}
			}
		}
	}
	
} 
Room.prototype.planRoads = function()  {
	if (Game.time % 100 === 0 ) {
		if ( this.memory.constructionsites.length ) {
			return;
		}
		if (Memory.roomstates[this.name].roadPlanned == true) {
			return;
		}
		var roomslist = new Array([this.name]) 
		roomslist = roomslist.concat(this.memory.slaves);
		var containers = new Array();
		for (let i = 0; i < roomslist.length; ++i ) {
			if (Game.rooms[roomslist[i]] != undefined ) {
				containers = containers.concat(Game.rooms[roomslist[i]].find(FIND_STRUCTURES, {filter: (s) =>
				s.structureType == STRUCTURE_CONTAINER
				}));
			}
		}
		for (let i = 0; i < containers.length; ++i) {
			let road = containers[i].pos.findInRange(FIND_STRUCTURES, 1 , {filter: (s) =>
			s.structureType == STRUCTURE_ROAD
			});
			if (road.length > 0 ) {
				containers.splice(i, 1);
			}
		}
		for (let i = 0; i < containers.length; ++i ) {
			var plannedRoad = PathFinder.search(this.storage.pos, {pos :containers[i].pos, range: 1},  {
				plainCost: 2,
				swampCost: 10,
				maxOps:10000,
				roomCallback: function (roomName) {
					let room = Game.rooms[roomName];
					// In this example `room` will always exist, but since PathFinder 
					// supports searches which span multiple rooms you should be careful!
					if (!room) return;
					let costs = new PathFinder.CostMatrix;
					room.find(FIND_FLAGS).forEach(function(flag) {
					if (flag.color === COLOR_PURPLE ) {
							costs.set(flag.pos.x, flag.pos.y, 1)
					}
					});
					room.find(FIND_STRUCTURES).forEach(function(structure) {
						if (structure.structureType === STRUCTURE_ROAD) {
						// Favor roads over plain tiles
						costs.set(structure.pos.x, structure.pos.y, 1);
						}
						else if ( structure.structureType !== STRUCTURE_RAMPART || !structure.my && OBSTACLE_OBJECT_TYPES.indexOf(structure.structureType)!==-1) {
							// Can't walk through non-walkable buildings
							costs.set(structure.pos.x, structure.pos.y, 256);
						}
					
					});
					return costs;
					
				}
			});
			for (let i = 0; i < plannedRoad.path.length; ++i) {
				var aLook = plannedRoad.path[i].lookFor(LOOK_FLAGS);
				if ( aLook.length === 0 ) {
				plannedRoad.path[i].createFlag(undefined, COLOR_PURPLE);
				}
			}
		
		}
		Memory.roomstates[this.name].roadPlanned = true;
		
	
	}
}
Room.prototype.buildRoads = function() {
	if (Memory.roomstates[this.name].roadPlanned == true) {
		var roadFlags = _.filter(Game.flags, (f) => f.color == COLOR_PURPLE);
		
		if (roadFlags.length === 0 ) {
			Memory.roomstates[this.name].roadPlanned = false;
		}
		for (let i = 0; i < roadFlags.length ; ++i ){
			if (_.size(Game.constructionSites) < 80 ) {
				roadFlags[i].room.createConstructionSite(roadFlags[i].pos, STRUCTURE_ROAD);
				roadFlags[i].remove();
			}
			else {
				return;
			}
		
		}
	}
}
module.exports = function(){}
