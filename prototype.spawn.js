/**
 * Created by newb on 30/11/16.
 */

    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
			if (roleName == 'upgrader') {
				energy = energy - 100;
				var body = [CARRY, MOVE];
				var numberOfParts = Math.floor(energy / 100);
				for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
			return this.createCreep(body, undefined, { role: roleName, working: false, targetid: false });
			}
			else {
				var numberOfParts = Math.floor(energy / 200);
				var body = [];
				for (let i = 0; i < numberOfParts; i++) {
					body.push(WORK);
				}
				for (let i = 0; i < numberOfParts; i++) {
					body.push(CARRY);
				}
				for (let i = 0; i < numberOfParts; i++) {
					body.push(MOVE);
				}
			
			}

            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, working: false, targetid: false });
        }
module.exports = function(){}