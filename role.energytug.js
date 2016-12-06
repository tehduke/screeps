 module.exports =  {
    run: function (creep) {
        function getNewDropofftaget() {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) =>
                (s.structureType == STRUCTURE_TOWER && s.energy < s.storeCapacity)});
            if (target.length){
                creep.memory.targetid = target.id;
                return;
            }
            target =  creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) =>
                (s.structureType == STRUCTURE_EXTENSION && s.energy < s.storeCapacity)});
            if (target.length){
                creep.memory.targetid = target.id;
                return;
            }
            target =  creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) =>
                (s.structureType == STRUCTURE_SPAWN && s.energy < s.storeCapacity)});
            if (target.length) {
                creep.memory.targetid = target.id;
                return;
            }
			return;
            

	}





        /* Check if we allready have a Destnation its kinda expensive to find so it might save me cpu?*/
       
       if ( creep.memory.working == true && creep.carryCapacity < creep.energy) {
           var target = creep.room.find(FIND_STRUCTURES, {
                   filter: (structure) => {
                   return (structure.structureType == STRUCTURE_CONTAINER && structure.structureType == STRUCTURE_STORAGE);}
                    });
           if (target.length) {
               var allContainer = [];
               // Calculate the percentage of energy in each container.
               for (var i = 0; i < target.length; i++) {
                   allContainer.push({
                       energyPercent: ( ( target[i].store.energy / target[i].storeCapacity ) * 100 ),
                       id: target[i].id
                   });
               }
               // Get the container containing the most energy.
               var highestContainer = _.max(allContainer, function (container) {
                   return container.energyPercent;
               });

               // set the target in memory so the creep dosen't
               // change target in the middle of the room.
               creep.memory.targetid = highestContainer.id;
               creep.memory.working = false;
           }
       }
        if (creep.memory.working == true){
           var dest = Game.getObjectById(creep.memory.targetid);
           var trasferreturn = creep.transfer(dest, RESOURCE_ENERGY);
           if ( trasferreturn == ERR_NOT_IN_RANGE) {
               creep.moveTo(dest);
           }
           if (trasferreturn == ERR_FULL) {
               getNewDropofftaget();
           }



        }
        else if ( creep.memory.working == false){

            var dest = Game.getObjectById(creep.memory.targetid);
            //hacky test to makesure that if containerid isnt initlised it still works
            if ( dest == null || dest.energy == 0){
                creep.memory.working = true
            }
            if (creep.withdraw(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dest);
            }
        }

    }
 }



