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
							room.memory.spawnque.unshift(this.memory.role, this.room.name ,"END");
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

						var target = this.pos.findClosestByPath(FIND_SOURCES);
						if (this.harvest(target) == ERR_NOT_IN_RANGE) {
							this.moveTo(target);

						}
					}
				}
			}
}

Creep.prototype.movePathTo = function (target) {
	if (!this.memory.storedPath) {
		this.memory.storedPath = {};
	}
	if (!this.memory.storedPath.lastPos ) {
		this.memory.storedPath.lastPos = {};
		this.memory.storedPath.lastPos.x = this.pos.x;
		this.memory.storedPath.lastPos.y = this.pos.y;
		this.memory.storedPath.lastPos.roomName = this.pos.roomName
	}
	if (!this.memory.storedPath.sTarget) {
		this.memory.storedPath.sTarget = {};
		this.memory.storedPath.sTarget.x = target.pos.x;
		this.memory.storedPath.sTarget.y = target.pos.y;
		this.memory.storedPath.sTarget.roomName = target.pos.roomName;
	}
	if (!this.memory.storedPath.stuckCount) {
		this.memory.storedPath.stuckCount = 0;
	}
	var dest = RoomPosition(this.memory.storedPath.sTarget.x, this.memory.storedPath.sTarget.y, this.memory.storedPath.sTarget.roomName );
	if ( dest == undefined ) {
		this.memory.storedPath.sTarget.x = target.pos.x;
		this.memory.storedPath.sTarget.y = target.pos.y;
		this.memory.storedPath.sTarget.roomName = target.roomName;
	}
	if (!dest.isEqualTo(target.pos)) {
		this.memory.storedPath.sTarget.x = target.pos.x;
		this.memory.storedPath.sTarget.y = target.pos.y;
		this.memory.storedPath.sTarget.roomName = target.roomName;
		dest = target.pos;
		let pathToDest = getPathToDest(dest, this.pos);
		this.memory.storedPath.sPath = translatePath(pathToDest.path)
	}
	else if (this.memory.storedPath.sPath.length === 0 ) {
		let pathToDest = getPathToDest(dest, this.pos);
		this.memory.storedPath.sPath = translatePath(pathToDest.path);
	}
	var lastPos = RoomPosition(this.memory.storedPath.lastPos.x, this.memory.storedPath.lastPos.y, this.memory.storedPath.lastPos.roomName);
	if (lastPos.isEqualTo(this.pos)) {
		this.memory.storedPath.stuckCount++
	}
	else {
		this.memory.storedPath.stuckCount = 0;
		this.memory.lastPos = this.pos
		this.memory.storedPath.sPath.splice(0, 1);
	}
	if (this.memory.storedPath.stuckCount === 3 ) {
		this.memory.storedPath.stuckCount = 0;
		let pathToDest = getPathToDest(dest, this.pos, true);
		this.memory.storedPath.sPath = translatePath(pathToDest.path);
	}
	this.move(this.memory.storedPath.sPath[0]);
}
function getPathToDest(destPos, startPos, stuck) {
	//takes startPos and destPos and returns a path as a PathFinder array of pos's
	let pathToDest = PathFinder.search( startPos, {pos: destPos, range: 1 }, 
		{
		plainCost: 2,
		swampCost: 10,
		roomCallback: function(roomName) {
		let room = Game.rooms[roomName]
		if (!room) {
			return;
		}
		let costs = new PathFinder.CostMatrix
		room.find(FIND_STRUCTURES).forEach(function(structure){
			if (structure.structureType === STRUCTURE_ROAD) {
            
            costs.set(structure.pos.x, structure.pos.y, 1);
			}
			else if ( structure.structureType !== STRUCTURE_RAMPART || !structure.my && OBSTACLE_OBJECT_TYPES.indexOf(structure.structureType)!==-1) {
				costs.set(structure.pos.x, structure.pos.y, 255);
							
			}
			});
			if (stuck === true) {
				room.find(FIND_CREEPS).forEach(function(creep) {
				costs.set(creep.pos.x, creep.pos.y, 0xff);
				});
			}
			return costs;
		}
		
		});
		return pathToDest.path
		
}
function translatePath(pathfinderPath) {
	var directionArray = new Array()
	for ( let i = 0; i < (pathfinderPath.length - 1); ++i) {
		let from = pathfinderPath[i];
		let to = pathfinderPath[(i+1)];
		directionArray.push(from.getDirectionTo(to));
	}
	return directionArray;
	
}
module.exports = function(){}


