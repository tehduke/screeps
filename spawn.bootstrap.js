StructureSpawn.prototype.createBootStrapWorker = function(targetroom ) {
	var energy = this.room.energyCapacityAvailable - 50
	var numberOfParts = Math.floor(energy / 150);
	var body = [CARRY];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'bootstrapworker' , targetroom: targetroom} );
		
	if ( _.isString(createCreepReturn) == true ) {
		//hacky will fix
		delete this.memory.spawnque
		return OK;
	}
}
StructureSpawn.prototype.createBootStrapHauler = function(targetroom) {
	var energy = this.room.energyCapacityAvailable 
	var numberOfParts = Math.floor(energy / 150);
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(CARRY,CARRY,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'bootstraphauler' , targetroom: targetroom, homeroom: this.room.name} );
		
	if ( _.isString(createCreepReturn) == true ) {
		delete this.memory.spawnque
		return OK;
	}
}
StructureSpawn.prototype.createCapture = function(targetroom) {
	
	var body = [CLAIM,MOVE];

	var createCreepReturn = this.createCreep( body, undefined, { role: 'capture' , targetroom: targetroom, } );
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}
	