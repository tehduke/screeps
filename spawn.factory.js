
require('prototype.spawn');
require('spawn.Harvester');
require('spawn.Hauler');
require('spawn.Tug');
require('spawn.claimer');
require('spawn.Upgrader');
require('spawn.bootstrap');
require('spawn.worker');

StructureSpawn.prototype.factory = function () {
	

	// setup some minimum numbers for different roles
	if ( !this.room.memory.slaves ) {
		/*  hardcoded for now  will change when the roomstate evaluator is done*/
		this.room.memory.slaves = MYROOMS[this.room.name];
	}
	
	if ( this.room.memory.spawnque == undefined) {
		this.room.memory.spawnque = new Array();
	}
	var spawnque = this.room.memory.spawnque;
	if ( spawnque != undefined && spawnque.length > 0) {
		/*  things are in the spawn que handlethem spawn array containes the information to spawn a creep + any values that need to be passed onto them
		 *  this seems cleaner than implementing some kinda interup system when a creep dies*/
		 /*  check not spawning*/
		 if (this.spawning == null ) {
			 /*  The process to spawn a new creep goes like this. First read memory to find the role and args length. memory should be in the format 
			  *  ROLE ARGS END.   */
			var spawnreturn = undefined;
			var argslist = new Array();
			for ( let i = 0 ; i  < this.room.memory.spawnque.length; ++i){
				if (this.room.memory.spawnque[i] == 'END' ) {
					  break;
				}
				 argslist.push(this.room.memory.spawnque[i]);
			}
			  /*  check the argslist spawn the creep and then remove from que if OK if the first thing read isnt a role the spawnque arry is dirty*/
			if (argslist[0] == 'harvester' ) {
				  spawnreturn = this.createHarvester(argslist[1], argslist[2] );
				  
				 if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if (argslist[0] == 'hauler' ) {
				 spawnreturn = this.createHauler(argslist[1], argslist[2] );
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if (argslist[0] == 'tug' ) {
				spawnreturn = this.createTug(argslist[1]);
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if (argslist[0] == 'claimer' ) {
				spawnreturn = this.createClaimer(argslist[1]);
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if (argslist[0] == 'upgrader' ) {
				 spawnreturn = this.createUpgrader();
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if (argslist[0] == 'attacker' ) {
				spawnreturn = this.createAttacker();
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if (argslist[0] == 'drain' ) {
				spawnreturn = this.createTowerDrain();
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if  (argslist[0] == 'bootstrapworker' ) {
				spawnreturn = this.createBootStrapWorker(argslist[1]);
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if  (argslist[0] == 'bootstraphauler' ) {
				spawnreturn = this.createBootStrapHauler(argslist[1]);
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if  (argslist[0] == 'capture' ) {
				spawnreturn = this.createCapture(argslist[1]);
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if  (argslist[0] == 'reclaimer' ) {
				spawnreturn = this.createCustomCreep(argslist[0]);
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if  (argslist[0] == 'defender' ) {
				spawnreturn = this.createDefender(argslist[1]);
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if  (argslist[0] == 'worker' ) {
				spawnreturn = this.createWorker();
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else {
					console.log( "Error spawnque dirty");
					console.log("dumping spawnque");
					console.log(this.room.memory.spawnque);
					delete this.room.memory.spawnque;
			}
				
			  
			 
		}
	}
	/* spawnque is empty construct a new one 
	 * prioity from most important to least is  harvester -> hauler -> tug -> claimcreep for slave rooms -> repairer -> upgrader -> builder -> wall repairer *special creeps 
	 *  only spawn upgraders/builders if storage > ENERGY_RESERVE */
	else {
		if (this.room.controller.level < 2 && this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'harvester' }).length < 2) {
			if (this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'builder' }).length < 5 && this.room.storage == undefined) {
				this.room.memory.spawnque.push('builder', 'END');
			}
			this.room.memory.spawnque.push("harvester",source, this.room.name, "END");
		
		}
		/* spawns harvesters */
		/*  need to find some way to send a scout to rooms with no vision implemented a quick fix for now*/
			var ecoReplace = false;
		
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
			var source = sourcelist[i];
				var temp = _.filter(Game.creeps, (c) => c.memory.source == source);
				if ( temp.length < 1) {
						ecoReplace = true;
						this.room.memory.spawnque.push("harvester",source, this.room.name, "END");
						break;
				}
				
		}
	
		/* containers request haulers to transport energy based on the advrage distance of the spawn and storage I may of fudged the math on my trasport model */
		var containers = this.room.find(FIND_STRUCTURES, {filter: (s) =>
		s.structureType == STRUCTURE_CONTAINER
		});
		
		for (var i in slaveroomlist) {
				//we have vision
			if ( Game.rooms[slaveroomlist[i]] != undefined ) {
			var slavecontainers = Game.rooms[slaveroomlist[i]].find(FIND_STRUCTURES, {filter: (s) =>
			s.structureType == STRUCTURE_CONTAINER
			});
				if ( slavecontainers != null && slavecontainers != undefined ) {
					containers = containers.concat( slavecontainers );
					
				}
			}
		}
				/*  spawn tug*/
		var hoomroom = this.room.name;
		var numberOfTugs =  _.filter(Game.creeps, function(c) { return (c.memory.role == 'tug' && c.memory.hoomroom == hoomroom ) })
		if ( numberOfTugs.length == 0  && this.room.storage != undefined ) {
			ecoReplace = true;
			this.room.memory.spawnque.push("tug", this.room.name,"END");
		}
		
		for( let i = 0; i < containers.length; ++i) {
			var container = containers[i];
			if (container != undefined ) {
				var desiredcarryparts = this.getDesiredCarryParts(container);
				var haulers = _.filter(Game.creeps, function(c) { return (c.memory.role == 'hauler' && c.memory.containerid == container.id) })
				
				if ( desiredcarryparts > 0 ) {
					var totalCarryparts = 0
					for ( let i = 0; i < haulers.length; ++i) {
						totalCarryparts += _.sum(haulers[i].body, (bp) => bp.type == CARRY);
						 
						 
					}
					
					
					if ( totalCarryparts < desiredcarryparts ) {
							ecoReplace = true;
						this.room.memory.spawnque.push("hauler",container.id, this.room.name, "END");
						break ;
					}
				}
			}	
		}
			
	

		
		
		/* spawn claimers for slave rooms*/
		
		
		if ( slaveroomlist.length) {
			for ( let i = 0; i <  slaveroomlist.length  ; ++i ) {
				var slaveroom = Game.rooms[slaveroomlist[i]]
				if (slaveroom != undefined) {
					let temp = _.filter(Game.creeps, function(c) { return (c.memory.targetroom == slaveroomlist[i] && c.memory.role == 'claimer' ) })
					if (temp.length === 0 ) {
						if ( slaveroom.controller.reservation != undefined ) {
							let endTicks = slaveroom.controller.reservation.ticksToEnd
							if (endTicks < 5000  ) {
								this.room.memory.spawnque.push("claimer", slaveroomlist[i] , 'END')
								break;
							}
						}
						else {
							this.room.memory.spawnque.push("claimer", slaveroomlist[i], 'END')
							break;
						}
					}
				}
				else {
					this.room.memory.spawnque.push("claimer", slaveroomlist[i], 'END')
						   break;
				}
			} 
		}
		if (this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'builder' }).length < 5 && this.room.storage == undefined) {
			this.room.memory.spawnque.push('builder', 'END');
			
		}


		
		

		/*  check if the storage in this room is above the energy threshold*/
		var constructing = false
		var storage = this.room.storage;
		if (storage != undefined) {
		if ( storage.store[RESOURCE_ENERGY] > ENERGY_RESERVE) {
			var walls = this.room.find(FIND_STRUCTURES, {filter: (s) =>
			(s.structureType == STRUCTURE_WALL && s.structureType == STRUCTURE_RAMPART) && s.hits < WALL_HEALTH
			});
			var things = this.room.find(FIND_STRUCTURES, {filter: (s) =>
			 s.hits < (s.hitsMax * 0.5)
			});
			/* Test for buildsites  and if found start making builders */
			if ( this.room.memory.constructionsites.length) {
				this.room.memory.spawnque.push('worker', 'END');
				constructing = true;
			}
			else if (walls.length) {
				this.room.memory.spawnque.push('worker', 'END');
				constructing = true;
			}
			else if (things.length) {
				this.room.memory.spawnque.push('worker', 'END');
				constructing = true;
			}
			
			
			/* set the number of upgraders one if the room is building else its total harvester workparts * 2*/
			if ( constructing != true ) {
				if ( this.room.memory.energyIncome > 1500) {
					//hacky sleep counter to avoid upgrading my eco to death
					
					this.room.memory.spawnque.push('upgrader', 'END');
					
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
					this.room.memory.spawnque.push('capture',roomname ,'END');
					this.room.memory.spawnque.push( 'bootstrapworker',roomname,'END');
					this.room.memory.spawnque.push( 'bootstraphauler',roomname, 'END');
					}
				}
				if (Memory.roomstates[roomname].bootstraping == true ) {
				var bootstrapbuiler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstrapworker' && c.memory.targetroom == roomname ) });
				var bootstraphauler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstraphauler' && c.memory.targetroom == roomname ) });
					if (bootstrapbuiler.length < 2 ) {
						this.room.memory.spawnque.push( 'bootstrapworker',roomname, 'END');
					}
					if (bootstraphauler.length < 6 ) {
						this.room.memory.spawnque.push( 'bootstraphauler',roomname,'END');
					}
				}
				
			}
					
						

			
		
		
		}
		
		}
		 
		
	
	}
};
module.exports = function () {}
