
StructureSpawn.prototype.createCustomCreep = function(roleName, energy) {
// create a balanced body as big as possible with the given energy
	if ( energy == undefined ) {
	var energy = this.room.energyCapacityAvailable;
	}
	var numberOfParts = Math.floor(energy / 200);
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK,CARRY,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: roleName } );
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}
StructureSpawn.prototype.createAttacker = function() {
		if (Game.flags.attack) {
			var body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]
			this.createCreep(body, undefined, {role: 'attacker' } );
		}
	}
/*  function to return container disiredcarryparts*/
StructureSpawn.prototype.getDesiredCarryParts = function(container) {
	if ( container == undefined) {
		return 0;
	}
	else {
	
		if (this.room.storage == undefined) {
			var storage = this;
		}
		else {
			var storage = this.room.storage;
			
		}
				
	
	if ( !container.distance ) {
		
		var pathtostorage = PathFinder.search(container.pos, storage.pos);
		
		container.distance =  pathtostorage.path.length; 
		
		
	}
	if ( !container.haslink) {
		var temp = container.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: (s) => 
		s.structureType == STRUCTURE_LINK
		});
		if (temp.length) {
			
					container.haslink = true;
		}
		else {
			
		
		container.haslink = false;
		
		}
	}

	if ( container.haslink == false ) {
		var time = 300;
		var energy = 3000
		var desiredcarryparts = Math.ceil(((energy / ( (time /  container.distance) / 2 )) / 50 ) + 1);
		
		return desiredcarryparts;
	}
	else return 0 ;
	

	}
}


module.exports = function(){}