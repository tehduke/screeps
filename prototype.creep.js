Creep.prototype.alertCreepTimeOut = function () {
if (!this.memory.timeout ){
	this.memory.timeout = true;
		if ( this.memory.role == 'harvester' ) {
			var room = Game.rooms[this.memory.homeroom] ;
			var creep = this;
			let tmp = _.filter(Game.creeps, function(c) { return ( c.memory.source == creep.memory.source ) });
			if (temp.length == 1 ) {
				if ( room != undefined ) {
					room.memory.spawnque.unshift(this.memory.role, this.memory.source, this.memory.homeroom,"END");
				}
			}
		}
		if (this.memory.role == 'claimer' ) {
			var room = Game.rooms[this.memory.homeroom] ;
			if ( room != undefined ) {
			room.memory.spawnque.unshift(this.memory.role, this.room.name ,"END");
			}
		}
}
		
}
Creep.prototype.getEnergy = function() {

		if (!this.memory.targetid) {
			this.memory.targetid = false;
		}
		if ( this.room.storage != undefined ) {
				if ( this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
						this.moveTo(this.room.storage);
				}
			
		}
			else {
				if ( this.memory.targetid != false ) {
					var storage = Game.getObjectById(this.memory.targetid);
					if ( this.withdraw(storage,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
						this.moveTo(storage);
					}
					else {
						this.memory.targetid = false;
					}
				}
				else {
				
					var target = this.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER );
						}});
					if (target.length > 0) {
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
						this.memory.targetid = highestContainer.id;

				
					}
					else {
						var target = creep.pos.findClosestByPath(FIND_SOURCES);
						if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target);
						}
					}
				}
			}
}
module.exports = function(){}