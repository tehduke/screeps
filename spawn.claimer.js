StructureSpawn.prototype.createClaimer = function(energy) {
	var body = [MOVE,MOVE, CLAIM];
	return this.createCreep(body, undefined, {role: 'claimer' , targetroom: 'W49S72'});
}
module.exports = function (){}
