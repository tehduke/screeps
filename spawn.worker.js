StructureSpawn.prototype.createWorker = function() {
	var energy = this.room.energyCapacityAvailable;
	var numberOfParts = Math.floor(energy / 250);
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK,CARRY,CARRY,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'worker' } );
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}