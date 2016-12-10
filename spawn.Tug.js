StructureSpawn.prototype.createTug = function(room) {
	var energy = this.room.energyCapacityAvailable;
	var bodycount = Math.floor(energy / 150);
	var body = [];
	
	for ( var i = 0; i < bodycount; ++i ) {
		body.push(MOVE,CARRY,CARRY);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'tug', hoomroom: room} );
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
	
}



module.exports = function () {}