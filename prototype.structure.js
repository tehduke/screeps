Structure.prototype.memory = function() {
	if (!Memory.structures) {
		Memory.structures = {};
	}
	if (!Memory.structures[this.structureType]) {
		!Memory.structures[this.structureType] = {};
	}
	if (!Memory.structures[this.structureType[this.id]]) {
		!Memory.structures[this.structureType[this.id]] = {};
	}
	
	return Memory.structures[this.structureType[this.id]];
}
StructureLink.prototype.run = function() {
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