 module.exports =  {
    run: function (creep) {
       if (creep.carry.energy < creep.carryCapacity){
		   var container = Game.getObjectById(creep.memory.containerid);
		   if ( creep.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
			   creep.moveTo(container);
		   }
	   }
	   else {
		   var homeroom = Game.rooms[HOME];
		   var storage = homeroom.find(FIND_STRUCTURES, {
                   filter: (structure) => {
                   return (structure.structureType == STRUCTURE_STORAGE) }
			});
		   if (creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			   creep.moveTo(storage[0]);
		   }
	   }
		   
	   }

 }



