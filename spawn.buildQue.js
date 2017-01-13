StructureSpawn.prototype.buildQue = function () {

	
// setup some minimum numbers for different roles
	if ( !this.room.memory.slaves ) {
		/*  hardcoded for now  will change when the roomstate evaluator is done*/
		this.room.memory.slaves = MYROOMS[this.room.name];
	}
	
if (this.room.controller.level < 2 && this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'harvester' }).length < 2) {
			if (this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'builder' }).length < 5 && this.room.storage == undefined) {
				
				let queBuilder = this.room.memory.spawnque.find( (t) => t == 'builder');
				if (queBuilder == undefined ) {
					this.room.memory.spawnque.push('builder', 'END');
				}
			}
			let queHarvester = this.room.memory.spawnque.find( (t) => t == source)
			if (queHarvester == undefined ) {
				this.room.memory.spawnque.push("harvester",source, this.room.name, "END");
			}
		}
		/* spawns harvesters */
		/*  need to find some way to send a scout to rooms with no vision implemented a quick fix for now*/
			
		
		//if ( !this.room.memory.sources ) {
			this.room.memory.sources = new Array();
			var sources = this.room.find(FIND_SOURCES);
			var slaveroomlist = this.room.memory.slaves;
			
			
			for (var i in slaveroomlist) {
				//we have vision
				 
				if ( Game.rooms[slaveroomlist[i]] != undefined ) {
					var slavesources = Game.rooms[slaveroomlist[i]].find(FIND_SOURCES);
					if ( slavesources != null && slavesources != undefined ) {
						sources = sources.concat(slavesources);
		
				
					}
					
				
				}
			}
			for ( let i = 0; i < sources.length ; ++i ) {
				var source = sources[i];
				this.room.memory.sources.push(source.id);
			}
			
			
		//}
		var sourcelist = this.room.memory.sources ;
		
		for (let i = 0; i < sourcelist.length; ++i ) {
			let source = sourcelist[i];
				let temp = _.filter(Game.creeps, (c) => c.memory.source == source);
				if ( temp.length < 1) {
						let queHarvester = this.room.memory.spawnque.find( (t) => t == source)
						if (queHarvester == undefined ) {
						this.room.memory.spawnque.push("harvester",source, this.room.name, "END");
						break;
						}
				}
				
		}
		//spawn hauler test
		if (this.room.avgTaskPower > this.room.avgHaulPower) {
			if (_.isUndefined(this.room.memory.spawnque.find( (t) => t ==  'hauler')) ) {
				this.room.memory.spawnque.push("hauler", "END");					
			}
		}
	
		/* spawn claimers for slave rooms*/
		
		
		if ( slaveroomlist.length) {
			let quedClaimers = new Array();
			for (let i = 0 ; i < this.room.memory.spawnque.length; ++i) {
				if (this.room.memory.spawnque[i] === 'claimer') {
					quedClaimers.push(this.room.memory.spawnque[(i +1)] );
				}
			}
			for ( let i = 0; i <  slaveroomlist.length  ; ++i ) {
				var slaveroom = Game.rooms[slaveroomlist[i]]
				let temp = _.sum(Game.creeps, c => c.memory.role === 'claimer' && c.memory.targetroom === slaveroomlist[i])
				if (temp === 0 ) {
					if (this.room.memory.spawnque.length === 0 ) {
						this.room.memory.spawnque.push("claimer", slaveroomlist[i] , 'END')
						break;
					}
					let isClamerQued = false
					for (let j = 0; j < quedClaimers.length; ++j ) {
						if (quedClaimers[j] ===  slaveroomlist[i] ) {
							isClamerQued = true;
						}
					}
					if (isClamerQued == false) {
						if ( slaveroom == undefined ) {
							this.room.memory.spawnque.push("claimer", slaveroomlist[i] , 'END')
								break 
						}
						else if ( slaveroom.controller.reservation != undefined ) {
							let endTicks = slaveroom.controller.reservation.ticksToEnd
							if (endTicks < 5000  ) {
									this.room.memory.spawnque.push("claimer", slaveroomlist[i] , 'END')
									break;
							}
						}
						
					}
				}
			}
		}
		

		if (this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'builder' }).length < 8 && this.room.storage == undefined) {
			let queBuilder = this.room.memory.spawnque.find( (t) => t == 'builder');
			if (queBuilder == undefined ) {
					this.room.memory.spawnque.push('builder', 'END');
			}
			
		}
		


		
		

		/*  check if the storage in this room is above the energy threshold*/
		var constructing = false
		var storage = this.room.storage;
		if (storage != undefined) {
			if (Game.flags.reclaim) {
				let queReclaimer = this.room.memory.spawnque.find( (t) => t == 'reclaimer');
				if (queReclaimer == undefined) {
					if ( _.sum(Game.creeps, (c) => c.memory.role === 'reclaimer') < 2)  {
						this.room.memory.spawnque.push('reclaimer', 'END');
					}
				}
			}
			if (Game.flags.steal) {
				let queMagPie = this.room.memory.spawnque.find( (t) => t == 'magpie');
				if (queMagPie == undefined) {
					if ( _.sum(Game.creeps, (c) => c.memory.role === 'magpie') < 2)  {
						this.room.memory.spawnque.push('magpie', 'END');
					}
				}
			}
			
			
		if ( storage.store[RESOURCE_ENERGY] > ENERGY_RESERVE) {
			var walls = this.room.find(FIND_STRUCTURES, {filter: (s) =>
			(s.structureType == STRUCTURE_WALL && s.structureType == STRUCTURE_RAMPART) && s.hits < WALL_HEALTH
			});
			var things = this.room.find(FIND_STRUCTURES, {filter: (s) =>
			 s.hits < (s.hitsMax * 0.5)
			});
			/* Test for buildsites  and if found start making builders */
			if ( this.room.memory.constructionsites.length) {
				let queWorker = this.room.memory.spawnque.find( (t) => t == 'worker');
				if (queWorker == undefined ) {
					this.room.memory.spawnque.push('worker', 'END');
					constructing = true;
				}
				else {
					constructing = true;
				}
			}
			else if (walls.length && _.size( this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role === 'worker' })) < 1) {
				let queWorker = this.room.memory.spawnque.find( (t) => t == 'worker');
				if (queWorker == undefined ) {
					this.room.memory.spawnque.push('worker', 'END');
				}
			}
			else if (things.length && _.size( this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role === 'worker'})) < 1) {
				let queWorker = this.room.memory.spawnque.find( (t) => t == 'worker');
				if (queWorker == undefined ) {
					this.room.memory.spawnque.push('worker', 'END');
				}
			}
			
			
			
			if ( !constructing  ) {
				if ( this.room.memory.energyIncome > 1500) {
					let queUpgrader = this.room.memory.spawnque.find( (t) => t == 'upgrader');
					if (queUpgrader == undefined) {
						this.room.memory.spawnque.push('upgrader', 'END');
					}
				}
			}
			if (Game.flags.drain) {
				for (let i = 0; i < 5; ++i) {
					this.room.memory.spawnque.push('drain', 'END');
				}
			}
			if (Game.flags.attack) {
				this.room.memory.spawnque.push('attacker', 'END');
			}
			
			
			for ( let roomname in MYROOMS) {
				if (Memory.roomstates[roomname].claiming == true ) {
					//claiming so push a capture creep then a bootstrapworker then bootstrap hauler
					//test if claimcreep is in que or exists if not spawn one
					var capture = _.filter(Game.creeps, function(c) { return (c.memory.role == 'capture' && c.memory.targetroom == roomname ) })
					if (capture.length == 0 ) {
						let queCapture = this.room.memory.spawnque.find( (t) => t == 'capture');
						if (queCapture == undefined) {
							this.room.memory.spawnque.push('capture',roomname ,'END');
						}
					}
					let queBootsrapWorker = this.room.memory.spawnque.find( (t) => t == 'bootstrapworker');
					if (queBootsrapWorker == undefined) {
						this.room.memory.spawnque.push( 'bootstrapworker',roomname,'END');
					}
					let queBootsrapHauler = this.room.memory.spawnque.find( (t) => t == 'bootstraphauler');
					if (queBootsrapHauler == undefined) {
						this.room.memory.spawnque.push( 'bootstraphauler',roomname, 'END');
					}
				}
			
				if (Memory.roomstates[roomname].bootstraping == true ) {
				var bootstrapbuiler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstrapworker' && c.memory.targetroom == roomname ) });
				var bootstraphauler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstraphauler' && c.memory.targetroom == roomname ) });
					if (bootstrapbuiler.length < 2 ) {
						let queBootsrapWorker = this.room.memory.spawnque.find( (t) => t == 'bootstrapworker');
						if (queBootsrapWorker == undefined) {
							this.room.memory.spawnque.push( 'bootstrapworker',roomname,'END');
						}
					}
					if (bootstraphauler.length < 2 && bootstrapbuiler.length   ) {
						let queBootsrapHauler = this.room.memory.spawnque.find( (t) => t == 'bootstraphauler');
						if (queBootsrapHauler == undefined) {
							this.room.memory.spawnque.push( 'bootstraphauler',roomname, 'END');
						}
					}
				}
			}
		}
		}
		
}
		 
