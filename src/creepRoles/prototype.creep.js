Creep.prototype.alertCreepTimeOut = function () {
if (!this.memory.timeout ){
	this.memory.timeout = true;
		if ( this.memory.role == 'harvester' ) {
			var room = Game.rooms[this.memory.homeroom] ;
			if ( room != undefined ) {
				room.memory.spawnque.push(this.memory.role, this.memory.source, this.memory.homeroom,"END");
			}
		}
		if (this.memory.role == 'claimer' ) {
			var room = Game.rooms[this.memory.homeroom] ;
			if ( room != undefined ) {
				if ( this.rooms.controller.reservation != undefined ) {
					let endTicks = slaveroom.controller.reservation.ticksToEnd
						if (endTicks < 5000  ) {
							room.memory.spawnque.push(this.memory.role, this.room.name ,"END");
						}
				}
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
						return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0 );
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
						var droppedEnergy = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (e)=>
						e.resourceType === RESOURCE_ENERGY && e.amount > 100
						});
						if (droppedEnergy != undefined ) {
							if (this.pickup(droppedEnergy) === ERR_NOT_IN_RANGE ) {
								this.movePathTo(droppedEnergy);
							}
						}
						else {
							var target = this.pos.findClosestByPath(FIND_SOURCES);
							if (this.harvest(target) == ERR_NOT_IN_RANGE) {
								this.moveTo(target);
							}
						}
					}
				}
			}
}

Creep.prototype.movePathTo = function (target) {
	if (!this.memory._move) {
		this.memory._move = {};
	}
	if (!this.memory._move.lastPos ) {
		this.memory._move.lastPos = {};
		this.memory._move.lastPos.x = this.pos.x;
		this.memory._move.lastPos.y = this.pos.y;
		this.memory._move.lastPos.roomName = this.pos.roomName
	}
	
	if (!this.memory._move.stuckCount) {
		this.memory._move.stuckCount = 0;
	}
	lastPos =  new RoomPosition(this.memory._move.lastPos.x,this.memory._move.lastPos.y,this.memory._move.lastPos.roomName)
	if (lastPos == undefined ) {
		this.memory._move.lastPos = {};
		this.memory._move.lastPos.x = this.pos.x;
		this.memory._move.lastPos.y = this.pos.y;
		this.memory._move.lastPos.roomName = this.pos.roomName
		lastPos = this.pos
	}
	if (lastPos.isEqualTo(this.pos)) {
		this.memory._move.stuckCount++
	}
	else {
		this.memory._move.stuckCount = 0;
		this.memory._move.lastPos = this.pos
	}
	if (this.memory._move.stuckCount === 3 ) {
		this.memory._move.stuckCount = 0;
		this.moveTo(target, {reusePath: 1});
	}
	
	this.moveTo(target, {reusePath: 50, ignoreCreeps: true })
	
}

module.exports = function(){}


