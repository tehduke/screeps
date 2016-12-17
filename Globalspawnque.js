module.exports = {
	/* Global spawn que builds que based on room states and distrubutes sensbly */
	distributeQue: function () {
function findClosestRoom (targetroom, roomlist) {
			//find the closest room by linear room count
			//from a list of rooms
			//returns the room name as a string
			var closestRoom = undefined;
			for ( let i = 0; i < roomlist.length; ++i ) {
 
				console.log(roomlist[i]);
				let distance = Game.map.getRoomLinearDistance(roomlist[i], targetroom );
				if (closestRoom == undefined) {
					closestRoom = distance;
				}
				else if (distance < closestRoom) {
					closestRoom = roomlist[i];
				}
			}
			if (closestRoom != undefined ) {
				return closestRoom;
			}
			else  {
				return undefined;
			}
		}
function getEnergyOkRooms () {
	//returns a array of room name strings where 
	//its flagged Energyok in roomstates memory
	//using hardcoded my room list for now
	var energyOkRooms = new Array()
	for ( let roomname in MYROOMS ) {
				if ( Memory.roomstates[roomname].energyOk == true ) {
					energyOkRooms.push(roomname);
				} 
	}
	return energyOkRooms
	
}
		
		if (Memory.globalspawnque != undefined && Memory.globalspawnque.length > 0) {
			var argslist = new Array();
				for ( let i = 0 ; i  < Memory.globalspawnque.length  ; ++i) {
					if (Memory.globalspawnque[i] == 'END' ) {
						argslist.push(Memory.globalspawnque[i]);
						break;
					}
					argslist.push(Memory.globalspawnque[i]);
				}
				//test for energy OK rooms
				var energyOkRooms = getEnergyOkRooms();
				var closestRoom = energyOkRooms[0]
				if (closestRoom != undefined ) {
					for (let i = 0; i < argslist.length; ++i) {
						Memory.rooms[closestRoom].spawnque.push(argslist[i]);
					}
					Memory.globalspawnque.splice(0, argslist.length );
				}
			
		}
		else {
			
		}
	},
	buildQue: function () {
		if (!Memory.globalspawnque) {
			Memory.globalspawnque = new Array();
		}
		//que is empty
		
		if (Memory.globalspawnque.length < 1 ) {
		/* Global spawnque is in the format [ creep role, room requesting the creep,args, END]*/
			for ( let roomname in MYROOMS) {
				if (Memory.roomstates[roomname].claiming == true ) {
					//claiming so push a capture creep then a bootstrapworker then bootstrap hauler
					//test if claimcreep is in que or exists if not spawn one
					var capture = _.filter(Game.creeps, function(c) { return (c.memory.role == 'capture' && c.memory.targetroom == roomname ) })
					if (capture.length == 0 ) {
					 Memory.globalspawnque.push('capture',roomname ,'END');
					 Memory.globalspawnque.push( 'bootstrapworker',roomname,'END');
					  Memory.globalspawnque.push( 'bootstraphauler',roomname, 'END');
					}
				}
				if (Memory.roomstates[roomname].bootstraping == true ) {
				var bootstrapbuiler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstrapworker' && c.memory.targetroom == roomname ) });
				var bootstraphauler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstraphauler' && c.memory.targetroom == roomname ) });
					if (bootstrapbuiler.length < 2 ) {
						Memory.globalspawnque.push( 'bootstrapworker',roomname, 'END');
					}
					if (bootstraphauler.length < 6 ) {
						Memory.globalspawnque.push( 'bootstraphauler',roomname,'END');
					}
				}
			}
		}
		
	}
	
	
	
}