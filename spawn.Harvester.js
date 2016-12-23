

StructureSpawn.prototype.createHarvester = function(sourceid, creephomeroom) {
        

        
        var harvestersCount = this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'harvester'});
        
        /*  checlk to see if this room has any harvesters and if not if it has the energy to spawn one*/

		if ( harvestersCount.length == 0 && this.room.energyAvailable < 600  || this.room.controller.level == 1) {

			var createCreepReturn = this.createCustomCreep('harvester', this.room.energyAvailable  );
			if ( createCreepReturn == OK ) {
				return OK;
			}
		}

		if (this.room.energyCapacityAvailable < 700){
			var body = [MOVE,WORK,WORK,WORK,WORK,WORK];

		}
		else {
			var body = [MOVE,MOVE,MOVE,CARRY,WORK,WORK,WORK,WORK,WORK];
		}
		var source = Game.getObjectById(sourceid);
		
		var createCreepReturn = this.createCreep( body, undefined, { role: 'harvester', source: sourceid, homeroom: creephomeroom targetroom: source.room.name } );
		
		if ( _.isString(createCreepReturn) == true ) {
		return OK;
		}
		
	   


       
}
module.exports = function () {}
