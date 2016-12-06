
        StructureSpawn.prototype.createEnergyTug = function(energy){

            var bodycount = Math.floor(energy / 100);
            var body = [];		
            var desiredenergytugtcount = 1;   
			var energyTugCount = _.sum(Game.creeps, (c) => c.memory.role == 'energytug');
            
           
		


           

        // create creep with the created body and the given role
            if (desiredenergytugtcount > energyTugCount){
				
                for (let i = 0; i < bodycount; i++) {
                    body.push(CARRY);
                    body.push(MOVE);
                }
				
                return this.createCreep(body, undefined, { role: 'energytug', working: true } );
            }
			else {
				return 1;
			}

			
        }


module.exports = function () {}