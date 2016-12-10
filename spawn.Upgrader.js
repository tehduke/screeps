StructureSpawn.prototype.createUpgrader = function() {
	
	var energy = this.room.energyCapacityAvailable - 100;
	var body = [CARRY, MOVE];
	var numberOfParts = Math.floor(energy / 100);
	while ( numberOfParts % 5 != 0) {
		--numberOfParts
	}
	for ( var i = 0 ; i < numberOfParts; ++i ) {
		body.push(WORK);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'upgrader'} );
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}