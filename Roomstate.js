

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
		if (!this.memory.constructionsites) {
			this.memory.constructionsites = new Array()
		}
		var roomslist = new Array([this.name]) 
		roomslist = roomslist.concat(this.memory.slaves);
		var constructionSites = new Array();
		for (let i = 0; i < roomslist.length; ++i ) {
			if (Game.rooms[i] != undefined ) {
				constructionSites = Game.rooms[i].find(FIND_MY_CONSTRUCTION_SITES);
				if (constructionSites.length) {
					for (let j = 0; j < constructionSites.length; ++j) {
						this.memory.constructionsites.push(constructionSites[j].id);
					}
				}
			}
		}
	}
	
} 
module.exports = function(){}
