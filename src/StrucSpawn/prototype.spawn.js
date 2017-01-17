
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
		else {
			return OK;
		}
	}
/*  function to return container disiredcarryparts*/
StructureSpawn.prototype.getDesiredCarryParts = function(container) {
	if ( container == undefined) {
		return 0;
	}
	var min = container.pos.findInRange(FIND_MINERALS,1);
	if (min.length) {
		return 0;
	}
	var harvesters = _.size(container.pos.findInRange(FIND_MY_CREEPS, 1, {filter: (c) => 
	c.memory.role === 'harvester'
	}));
	if (harvesters === 0 ) {
		return 0;
	}
	if (this.room.storage == undefined) {
		var storage = this;
	}
	else {
		var links = this.room.find(FIND_MY_STRUCTURES, {filter: (s) =>
		s.structureType == STRUCTURE_LINK 
		});
		if (links.length > 0) {
			var containersource = container.pos.findInRange(FIND_SOURCES, 1 );
			if (containersource.length ) {
				for (let i = 0; i < links.length; ++i ){
					if ( links[i].memory.servicedsources == undefined) {
						links[i].memory.servicedsources = false;
					}
					if (links[i].memory.servicedsources != false  && links[i].memory.receiver == false) {
						for (let j = 0; j < links[i].memory.servicedsources.length; ++j ) {
							if (links[i].memory.servicedsources[j] == containersource[0].id) {
								var storage = links[i];
							}
						}
					}
				}
			}
			if ( storage == undefined) {
				var storage = this.room.storage;
			}
		}
		else {
			var storage = this.room.storage;
		}
	}
	if ( !container.distance ) {
		var pathtostorage = PathFinder.search(storage.pos, {pos : container.pos, range: 1}, {
				plainCost: 2,
				swampCost: 10,
				roomCallback: function (roomName) {
					let room = Game.rooms[roomName];
					// In this example `room` will always exist, but since PathFinder 
					// supports searches which span multiple rooms you should be careful!
					if (!room) return;
					let costs = new PathFinder.CostMatrix;
					room.find(FIND_STRUCTURES).forEach(function(structure) {
						if (structure.structureType === STRUCTURE_ROAD) {
						// Favor roads over plain tiles
						costs.set(structure.pos.x, structure.pos.y, 1);
						
						}
						else if ( structure.structureType !== STRUCTURE_RAMPART || !structure.my && OBSTACLE_OBJECT_TYPES.indexOf(structure.structureType)!==-1) {
							// Can't walk through non-walkable buildings
							costs.set(structure.pos.x, structure.pos.y, 256);
							
						}
					
					});
					return costs;
					
				}
			});
		
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
StructureSpawn.prototype.createTowerDrain = function() {
	if (Game.flags.drain) {
			var body = [TOUGH,MOVE]
			this.createCreep(body, undefined, {role: 'drain' } );
		}
		else {
			return OK;
		}
}
StructureSpawn.prototype.createDefender = function(flagname) {
	
			var body = [TOUGH,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,HEAL];
			if ( _.isString(this.createCreep(body, undefined, {role: 'defender',  targetflag: flagname} ))) {
			return OK;
			}
		
}
StructureSpawn.prototype.createReclaimer = function() {
	var energy = this.room.energyCapacityAvailable;
	var numberOfParts = Math.floor(energy / 250);
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK,WORK,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'reclaimer' } );
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}
StructureSpawn.prototype.createMagPie = function() {
	var energy = this.room.energyCapacityAvailable;
	var numberOfParts = Math.floor(energy / 100);
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(CARRY,MOVE);
	}
	var createCreepReturn = this.createCreep( body, undefined, { role: 'magpie' } );
		
	if ( _.isString(createCreepReturn) == true ) {
		return OK;
	}
}


module.exports = function(){}