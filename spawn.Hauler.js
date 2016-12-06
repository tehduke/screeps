
    

        StructureSpawn.prototype.createHauler = function(energy){

            var bodycount = Math.floor(energy / 100);
            var body = [];		
            var desiredHaulercount = 0;            
            var makehauler = false;
           
		   for (var roomname in Game.rooms) {
            var room = Game.rooms[roomname];
            var containers = room.find(FIND_STRUCTURES, {
                   filter: (structure) => {
                   return (structure.structureType == STRUCTURE_CONTAINER) }
			});
			console.log(containers.length);
            
                for (var i in containers) {
                    var  container = containers[i];

                        var temp = _.filter(Game.creeps, (c) => c.memory.containerid == container.id)
                        if ( temp == ''  || temp == 1 ) {
                            var destid = container.id;
                            makehauler = true;
							console.log("makeing hauler")
                        }
                }
		}


           

        // create creep with the created body and the given role
            if (makehauler == true){
				
                for (let i = 0; i < bodycount; i++) {
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, { role: 'hauler', working: false, containerid: destid  } );
            }
        }


module.exports = function () {}


