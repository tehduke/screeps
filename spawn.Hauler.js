StructureSpawn.prototype.createHauler = function(containerid, homeroom ){
			
			var container = Game.getObjectById(containerid);
			var energy = this.room.energyCapacityAvailable - 150;
			var bodycount = Math.floor(energy / 150);
			if (container == null) {
				return OK;
			}
            var disirerdCarryParts = this.getDesiredCarryParts(container);

			
            var bodyparts = [WORK,MOVE];	
			if (!container ){
				return
			}
			
			var haulers = _.filter(Game.creeps, function(c) { return (c.memory.role == 'hauler' && c.memory.containerid == container.id) })
			var totalCarryparts = 0
			for ( let i = 0; i < haulers.length; ++i) {
				totalCarryparts += _.sum(haulers[i].body, (bp) => bp.type == CARRY);
			}
			if ( disirerdCarryParts > totalCarryparts ) {

				for ( var i = 0 ; i < bodycount; ++i ) {
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


