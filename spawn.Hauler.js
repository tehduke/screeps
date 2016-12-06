
    

        StructureSpawn.prototype.createHauler = function(energy){

            var bodycount = Math.floor(energy / 100);
            var body = [];		
            var desiredHaulercount = 0;            
            var makehauler = false;
           
		   for (var roomname in Game.rooms) {
            var room = Game.rooms[roomname];
            var containers = room.find(FIND_MY_STRUCTURES, { filter: (s) => 
			(s.structureType == STRUCTURE_CONTAINER) } );
            
                for (var i in containers) {
                    var  container = containers[i];

                        var temp = _.filter(Game.creeps, (c) => c.memory.Source == container.id)
                        if ( temp == '' || temp == 1 ) {
                            var destid = source.id;
                            makehauler = true;
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


