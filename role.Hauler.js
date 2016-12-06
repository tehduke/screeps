 module.exports =  {
    run: function (creep) {
       if (creep.energy < creep.energyCapacity){
		   var container = Game.getObjectById(creep.memory.containerid);
		   if ( creep.withdraw(container) == ERR_NOT_IN_RANGE){
			   creep.moveTo(container);
		   }
	   }
	   else {
		   var storage = Game.rooms[HOME].find(FIND_STRUCTURES, { filter: (s) =>
		   (s.structureType == STRUCTURE_STORAGE) });
		   if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			   creep.moveTo(storage);
		   }
	   }
		   
	   }

 }



