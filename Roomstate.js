

/* Function to return the energy income of a room over 100 ticks mesured in creep lifetimes*/
Room.prototype.energyIncomeTracker = function() {
	if (this.storage == undefined) {
		return 0 ;
	}
	if (!this.memory.incomeArray) {
		this.memory.incomeArray = new Array();
	}
	if (!this.memory.energyIncome) {
		this.memory.energyIncome = 0;
	}
	if (Memory.tickCount == 0 ) {
		this.memory.incomeArray.push(this.storage[RESOURCE_ENERGY]);
	}
	if (this.memory.incomeArray.length > 10 ) {
		this.memory.incomeArray.push(this.memory.energyIncome);
		let temp = 0;
		for ( let i = 0; i < this.memory.incomeArray.length; ++i ) {
			temp += this.memory.incomeArray[i]
		}
		this.memory.energyIncome = Math.floor( (temp / memory.incomeArray.length) * 15 );
		delete this.memory.incomeArray;
	}
}
	
	

/* function to check if other rooms should aid this room */
Room.prototype.checkMutialAid = function () {
	//test for vision
	if (Game.rooms[this.name] != undefined) {
		if (this.controller.my == true) {

			if (this.controller < 4 ) {
				// room is bootstraping
				Memory.roomstates[this.name].bootstraping = true;
			}
			else if ( Memory.roomstates[this.name] != undefined) {
				delete Memory.roomstates[this.name].claiming;
				delete Memory.roomstates[this.name].bootstraping;
			}
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
	if (this.storage.store[RESOURCE_ENERGY] > ENERGY_RESERVE ) {
		Memory.roomstates[this.name].energyOk = true;
	}
}
module.exports = function(){}
