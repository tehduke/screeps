module.exports = {
	run: function(creep){
		var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
		if (target != undefined){
			if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target)
			}
		}
		else {
			creep.moveTo(Game.flags.attack);
		}
	}
}