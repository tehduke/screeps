
StructureLink.prototype.sendEnergy = function() {
	if (Game.time % 5 === 0 ) {
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
			if (this.memory.receiver === false ) {
				if (!this.memory.target) {
					let storage = this.pos.findInRange(FIND_MY_STRUCTURES, 2 , {filter: (s)=> 
					s.structureType === STRUCTURE_STORAGE
					});
					this.memory.target = storage[0].id;
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
		if(!Memory.structures[this.id])
			Memory.structures[this.id] = {};
		return Memory.structures[this.id];
    },
	set: function(v) {
		return _.set(Memory, 'structures.' + this.id, v);
	},
	configurable: true,
	enumerable: false
});