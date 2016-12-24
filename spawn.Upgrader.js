StructureSpawn.prototype.createUpgrader = function() {
	
	var energy = this.room.energyCapacityAvailable - 100;
	var body = [CARRY,CARRY];
	var numberOfParts = Math.floor(energy / 250);
	if (this.room.storage == undefined) {
		this.createCustomCreep('upgrader');
	}
	for ( var i = 0 ; i < numberOfParts; ++i ) {
		body.push(WORK,WORK,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'upgrader'} );
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}