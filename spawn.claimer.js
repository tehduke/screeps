StructureSpawn.prototype.createClaimer = function(targetroom) {
	if (this.room.energyCapacityAvailable > 1300 ) {
		var body = [MOVE,MOVE, CLAIM,CLAIM];
	}
	else {
	var body = [MOVE,MOVE, CLAIM];
	}
	 
	var createCreepReturn = this.createCreep(body, undefined, {role: 'claimer' , targetroom: targetroom, homeroom: this.room.name});
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}
StructureSpawn.prototype.createCapture = function(targetroom) {
	var body = [MOVE,MOVE, CLAIM];
	 
	var createCreepReturn = this.createCreep(body, undefined, {role: 'capture' , targetroom: targetroom});
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}
module.exports = function (){}
