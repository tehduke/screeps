
require('prototype.spawn');
require('spawn.Harvester');
require('spawn.Hauler');
require('spawn.Tug');
require('spawn.claimer');
require('spawn.Upgrader');
require('spawn.bootstrap');
require('spawn.worker');

StructureSpawn.prototype.factory = function () {
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
				 spawnreturn = this.createHauler();
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
				spawnreturn = this.createReclaimer();
				if ( spawnreturn == OK  ) {
					  this.room.memory.spawnque.splice(0, (argslist.length + 1));
				}
			}
			else if  (argslist[0] == 'magpie' ) {
				spawnreturn = this.createMagPie();
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
			else if  (argslist[0] == 'builder' ) {
				spawnreturn = this.createCustomCreep(argslist[0]);
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
	

};
module.exports = function () {}
