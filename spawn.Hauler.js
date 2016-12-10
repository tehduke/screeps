StructureSpawn.prototype.createHauler = function(containerid, homeroom ){
			
			var container = Game.getObjectById(containerid);
			var energy = this.room.energyCapacityAvailable;
            var disirerdCarryParts = this.getDesiredCarryParts(container);

			
            var bodyparts = [];	
			if (!container ){
				return
			}
			
			var haulers = _.filter(Game.creeps, function(c) { return (c.memory.role == 'hauler' && c.memory.containerid == container.id) })
				
				
					var totalCarryparts = 0
					for ( let i = 0; i < haulers.length; ++i) {
						totalCarryparts += _.sum(haulers[i].body, (bp) => bp.type == CARRY);
						 
						 
					}
			console.log("desiered carryparts " + disirerdCarryParts);
			console.log("total carryparts " + totalCarryparts);
		
			disirerdCarryParts = Math.ceil(disirerdCarryParts / 2 ) -totalCarryparts 
			
			if ( disirerdCarryParts > 0 ) {
				var carrypartlimit = Math.floor(energy / 150 );
				if ( disirerdCarryParts > carrypartlimit ) {
					disirerdCarryParts = carrypartlimit ;
				}
				for ( var i = 0 ; i < disirerdCarryParts; ++i ) {
					bodyparts.push(CARRY,CARRY,MOVE);
				}
				var createCreepReturn = this.createCreep(bodyparts , undefined, { role: 'hauler', containerid: containerid, homeroom: this.room.name } );
				if ( _.isString(createCreepReturn) == true ) {
					return OK;
				}
			}
			else {
				return OK ; 
			}
            

};


module.exports = function () {}


