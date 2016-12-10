

StructureSpawn.prototype.createHarvester = function(sourceid, creephomeroom) {
        

        
        var harvestersCount = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' );
        
        /*  checlk to see if this room has any harvesters and if not if it has the energy to spawn one*/
		if ( harvestersCount == 0 && this.room.energyAvailable < 600 ) {
			this.createCustomCreep('harvester', this.room.energyAvailable  );
		}
		var body = [MOVE,CARRY,WORK,WORK,WORK,WORK,WORK];
		
		var createCreepReturn = this.createCreep( body, undefined, { role: 'harvester', source: sourceid, homeroom: creephomeroom } );
		
		if ( _.isString(createCreepReturn) == true ) {
		return OK;
		}
		
	   


       
}
module.exports = function () {}
