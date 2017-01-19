module.exports =  {
	run: function (creep) {
		if (creep.spawning === true) {
			return;
		}
		if (creep.memory.targetId == undefined) {
			let mineral = creep.pos.findClosestByRange(FIND_MINERALS)
			creep.memory.targetId = mineral.id
		}
		if (creep.memory.extractorId == undefined) {
			let extractor = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => 
			s.structureType === STRUCTURE_EXTRACTOR
			});
			if (extractor != undefined) {
				creep.memory.extractorId = extractor.id
			}
		}
		if (creep.memory.containerid  == undefined) {
			creep.memory.containerid =false;
		}
		var mineral = Game.getObjectById(creep.memory.targetId);
		var extractor = Game.getObjectById(creep.memory.extractorId)
		if (_.isNull(extractor)) {
			creep.suicide();
		}
		if (mineral.mineralAmount === 0 || mineral.ticksToRegeneration > 500) {
			creep.suicide();
		}
		if (creep.memory.containerid == false) {
			if (!creep.pos.isNearTo(mineral)) {
				creep.movePathTo(mineral);
			}
			else {
				var contaner = creep.pos.findInRange(FIND_STRUCTURES, 2, {filter: (s) =>
				(s.structureType == STRUCTURE_CONTAINER)});
				if (contaner.length  ) { 
					for( let i in contaner) {
						if (mineral.pos.isNearTo(contaner[i])) {
							creep.memory.containerid = contaner[i].id;
							creep.movePathTo(contaner[i]);
						}
					}
				}
			}
		}
		else {
			let contaner = Game.getObjectById(creep.memory.containerid);
			if (creep.pos.isEqualTo(contaner) === false){
				creep.movePathTo(contaner);
			}
			else if (extractor.cooldown === 0 ) {
				creep.harvest(mineral);
			}
		}
		
	}
}