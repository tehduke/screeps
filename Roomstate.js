

/* Function to return the energy income of a room over 100 ticks mesured in creep lifetimes*/
Room.prototype.energyIncomeTracker = function() {
	if (this.storage == undefined) {
		return 0 ;
	}

	if (!this.memory.energyIncome) {
		this.memory.energyIncome = 0;
	}

		this.memory.energyIncome = Math.floor( (this.storage.store[RESOURCE_ENERGY]  + this.memory.energyIncome  / 2 )  );
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
module.exports = function(){}
