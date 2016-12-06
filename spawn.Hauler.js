
    

        StructureSpawn.prototype.createHauler = function(energy){

            var bodycount = Math.floor(energy / 100);
            var body = [];
            var roleName = 'hauler';
            var Harvestercount = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
            var desiredHaulercount = 0;
            var Haulercount = _.sum(Game.creeps, (c) => c.memory.role == 'hauler');
            var makehauler = false;
            desiredHaulercount = (Harvestercount +1);

            if ( desiredHaulercount > Haulercount  ){
                makehauler = true;

	

                for (let i = 0; i < bodycount; i++) {
                    body.push(CARRY);
                    body.push(MOVE);
                }
                
            }

        // create creep with the created body and the given role
            if (makehauler == true){
                return this.createCreep(body, undefined, { role: roleName, working: false, containerid: ''});
            }
        }


module.exports = function () {}


