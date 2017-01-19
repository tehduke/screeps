StructureSpawn.prototype.createHauler = function(){
			
			if (this.room.memory.avgHaulPower > this.room.memory.avgTaskPower) {
				return OK
			}
			var energy = this.room.energyCapacityAvailable - 150;
			var bodycount = Math.floor(energy / 150);
			//test we're not trying to spawn to big a creep
			if (bodycount > 16 ) {
				bodycount = 16;
			}
            var bodyparts = [WORK,MOVE];	
			for ( var i = 0 ; i < bodycount; ++i ) {
				bodyparts.push(CARRY,CARRY,MOVE);
			}
			var createCreepReturn = this.createCreep(bodyparts , undefined, { role: 'hauler',homeroom: this.room.name } );
			if ( _.isString(createCreepReturn) == true ) {
				return OK;
			}
};




