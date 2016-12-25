
StructureLink.prototype.sendEnergy = function() {
	if (this.energy === this.energyCapacity && this.cooldown === 0 ) {
		
		if (this.memory.receiver == undefined ) {
			//test if we are a receiver link
			let storage = this.pos.findInRange(FIND_MY_STRUCTURES, 2 , {filter: (s)=> 
			s.structureType === STRUCTURE_STORAGE
			});
			if ( storage.length) {
				this.memory.receiver = true;
			}
			else {
				this.memory.receiver = false;
			}
		}
			if (this.memory.receiver === false ) {
				if (!this.memory.target) {
					var link = this.room.storage.pos.findInRange(FIND_MY_STRUCTURES, 2 , {filter: (s)=> 
					s.structureType === STRUCTURE_LINK
					});
					this.memory.target = link[0].id;
				}
				let target = Game.getObjectById(this.memory.target);
				if (target === null ) {
					console.log("ERR Link" + this.id + " has no target");
				}
				else {
					this.transferEnergy(target);
				}
			}
	}
}
StructureLink.prototype.getServicedSourcelist = function() {
	if (Game.time % 100 === 0 ) {
		var hasSource = this.pos.findInRange(FIND_SOURCES, 2 ); 
		if (hasSource.length) {
			this.memory.servicedsources = false;
		}
		else {
			var target = Game.getObjectById(this.memory.target);
			if (target == null ) {
				return;
			}
			var targetDistance = this.pos.getRangeTo(target);
			var linkEnergyPerTick = this.energyCapacity / targetDistance;
			var maxEnergyThroughput = linkEnergyPerTick * 300;
			var sourceArray = new Array();
			this.memory.servicedsources = new Array();
			for (let i = 0; i < this.room.memory.sources.length; ++i){
				let source = Game.getObjectById(this.room.memory.sources[i]);
				if (source != null ) {
					if ( source.room.name != this.room.name ) {
						var PathFinderReturn = PathFinder.search(this.pos, {pos: source.pos, range: 1});
						var distanceToStorage = PathFinder.search(this.room.storage.pos, {pos: source.pos, range: 1});
						if ( PathFinderReturn.path.length < distanceToStorage.path.length ) {
							source.distance = PathFinderReturn.path.length;
							sourceArray.push(source);
						}
					}
				}
			}
			sourceArray = _.sortBy(sourceArray, [function (d) {return d.distance;}]);
			for (let source in sourceArray ) {
				maxEnergyThroughput -= sourceArray[source].energyCapacity
				if ( maxEnergyThroughput > 0 ) {
					this.memory.servicedsources.push(sourceArray[source].id);
				}
				else {
					break;
				}
			}
			
		}
	}
	
	
}


/**
 * All owned structures can be 'run'.
 */
OwnedStructure.prototype.run = function () {
	if(!Memory.structures) {
		Log.warn('[Memory] Initializing structure memory');
		Memory.structures = {}; 
	}
	
	if (this.structureType == STRUCTURE_LINK) {
		this.getServicedSourcelist();
		this.sendEnergy();
	}

}

/**
 * All owned structures can "sleep". But it's up to individual structure logic
 * to decide if it wants to make that check at all.
 */
OwnedStructure.prototype.defer = function(ticks) {
	if(!_.isNumber(ticks))
		throw new Error('OwnedStructure.defer expects numbers');
	if(ticks >= Game.time)
		Log.notify('[WARNING] Structure ' + this.id + ' at ' + this.pos + ' deferring for unusually high ticks!');
	this.memory.defer = Game.time + ticks;
}

OwnedStructure.prototype.clearDefer = function() {
	if(Memory.structures[this.id] && Memory.structures[this.id].defer)
		delete Memory.structures[this.id].defer;
}

OwnedStructure.prototype.isDeferred = function() {
	if(this.my === true) {	
		let memory = Memory.structures[this.id];
		if(memory !== undefined && memory.defer !== undefined && Game.time < memory.defer)
			return true;	
		else if(memory !== undefined && memory.defer)
			delete Memory.structures[this.id].defer;
	}
	return false;
}



 
Object.defineProperty(OwnedStructure.prototype, "memory", {
    get: function () {
		if (!Memory.structures) {
			Memory.structures = {};
		}
		if(!Memory.structures[this.id]) {
			Memory.structures[this.id] = {};
		}
		return Memory.structures[this.id];
    },
	set: function(v) {
		return _.set(Memory, 'structures.' + this.id, v);
	},
	configurable: true,
	enumerable: false
});