StructureSpawn.prototype.createWorker = function(role) {
	var energy = this.room.energyCapacityAvailable;
	var numberOfParts = Math.floor(energy / 250);
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK,CARRY,CARRY,MOVE);
	}
	if (role == undefined) {
		role = 'worker';
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: role } );
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}