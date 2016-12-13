

/* Function to return the energy income of a room over 100 ticks mesured in creep lifetimes*/
Room.prototype.energyIncomeTracker = function() {
	if (this.storage == undefined) {
		return 0 ;
	}
	if (!this.memory.incomeArray) {
		this.memory.incomeArray = new Array();
		this.memory.incomeArray[0] = 0;
		this.memory.incomeArray[1] = 0;
	}
	if (!this.memory.energyIncome) {
		this.memory.energyIncome = 0;
	}
	if (Memory.tickCount == 0 ) {
		this.memory.incomeArray[0] = this.storage.store[RESOURCE_ENERGY];
		
	}
	if (Memory.tickCount == 99 ) {
		this.memory.incomeArray[1] = this.storage.store[RESOURCE_ENERGY];
		this.memory.energyIncome = (this.memory.incomeArray[1] - this.memory.incomeArray[0]) * 15
	}
	
}
module.exports = function(){}
