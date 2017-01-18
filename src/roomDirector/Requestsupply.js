// Buildings use getters to workout what they are requesting/supplying for the
// hauling task manager
Object.defineProperty(StructureExtension.prototype, "requesting", {
    get: function () {
		let requiredEnergy = this.energyCapacity - this.energy;
	return {[RESOURCE_ENERGY]: requiredEnergy};
    },
	configurable: true,
	enumerable: false
});
Object.defineProperty(StructureSpawn.prototype, "requesting", {
    get: function () {
		let requiredEnergy = this.energyCapacity - this.energy;
	return {[RESOURCE_ENERGY]: requiredEnergy};
    },
	configurable: true,
	enumerable: false
});
Object.defineProperty(StructureTower.prototype, "requesting", {
    get: function () {
		let requiredEnergy = this.energyCapacity - this.energy;
	return {[RESOURCE_ENERGY]: requiredEnergy};
    },
	configurable: true,
	enumerable: false
});
Object.defineProperty(StructureContainer.prototype, "supplying", {
    get: function () {
		
	return this.store;
    },
	configurable: true,
	enumerable: false
});

