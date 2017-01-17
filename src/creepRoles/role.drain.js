module.exports = {
	run: function(creep){
		if ( Game.flags.drain != undefined ) {
				creep.moveTo(Game.flags.drain);
				
		}
		else if (Game.flags.attack != undefined ) {
			creep.moveTo(Game.flags.attack);
		}
		

	}
}
