StructureSpawn.prototype.createUpgrader = function() {
	
	var energy = this.room.energyCapacityAvailable - 100;
	var body = [CARRY,CARRY];
	if (this.room.storage == undefined) {
		this.createCustomCreep('upgrader');
	}
	var numberOfParts = Math.floor(energy / 450);
	if (numberOfParts > 10 ) {
		numberOfParts = 10
	}
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK,WORK,WORK,WORK,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'upgrader'} );
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}