StructureSpawn.prototype.createBootStrapWorker = function(targetroom ) {
	var energy = this.room.energyCapacityAvailable 
	var numberOfParts = Math.floor(energy / 250);
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK,MOVE,CARRY,CARRY);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'bootstrapworker' , targetroom: targetroom} );
		
	if ( _.isString(createCreepReturn) == true ) {
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
	