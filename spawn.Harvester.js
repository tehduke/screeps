/**
 * Created by newb on 30/11/16.
 */


    StructureSpawn.prototype.createHarvester = function(energy) {
        /* This Clusterfuck should spawn a harvester and asiusne it to a energy source*/

        var Harvesters = _.filter(Game.creeps, {memory: 'harvester'});
        var Harvesterscount = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
        var asssource = undefined;
        var makeharvester = false;
	   var creepsource = undefined;


        for (var roomname in Game.rooms) {
            var room = Game.rooms[roomname];
            var sources = room.find(FIND_SOURCES);
            if (sources.length > Harvesterscount) {


                for (var i in sources) {
                    var source = sources[i];
                        var temp = _.filter(Game.creeps, (c) => c.memory.Source == source.id);
                        if ( temp == '' || temp == 1 ) {
                            asssource = source.id;
                            makeharvester = true;
						}
                }
            }

        }


            if (makeharvester == true) {

                var spawnenergy = (energy - 200);

                var numberofworkparts = Math.floor(spawnenergy / 100);
                if (numberofworkparts < 0) {
                    numberofworkparts = 0;
                }


                if (numberofworkparts > 4) {
                    numberofworkparts = 4;
                }

                var body = [CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK];

                for (var i = 0; numberofworkparts < i; ++i) {
                    body.push(WORK);
                }
				var Spawnreturn = this.createCreep(body, undefined, {role: 'harvester', Source: asssource,containerid: false });
                return Spawnreturn;
            }
			else {
				return 1
			}



        };

module.exports = function () {}
