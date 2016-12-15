StructureSpawn.prototype.createUpgrader = function() {
	
	var energy = this.room.energyCapacityAvailable - 50;
	var body = [CARRY];
	var numberOfParts = Math.floor(energy / 100);
	while ( numberOfParts % 10 != 0) {
		--numberOfParts
	}
	for ( var i = 0 ; i < numberOfParts; ++i ) {
		body.push(WORK);
	}
	numberOfParts = Math.floor (numberOfParts / 2);
	for ( var i = 0 ; i < numberOfParts; ++i ) {
		body.push(MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'upgrader'} );
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}