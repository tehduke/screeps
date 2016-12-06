StructureSpawn.prototype.createClaimer = function(energy) {
	var body = [MOVE,MOVE, CLAIM];
	return this.createCreep(body, undefined, {role: 'claimer' });
}
module.exports = function (){}
