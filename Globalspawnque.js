module.exports = {
	/* Global spawn que builds que based on room states and distrubutes sensbly */
	distributeQue: function () {
function findClosestRoom (targetroom, roomlist) {
			//find the closest room by linear room count
			//from a list of rooms
			//returns the room name as a string
			var closestRoom = undefined;
			for ( let i = 0); i < roomlist.length; ++i ) {
				let targetroom = Game.rooms[targetroom];
				let temp = Game.rooms[roomlist[i]];
				let distance = Game.map.getRoomLinearDistance(temp, targetroom );
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
				var room = MYROOMS[roomname]
				if ( Memory.roomstates[room].energyOk == true ) {
					energyOkRooms.push(room);
				} 
	}
	return energyOkRooms
	
}
		
		if (Memory.globalspawnque != undefined && Memory.globalspawnque.length > 0) {
			while (Memory.globalspawnque != 0) {
			var argslist = new Array();
				for ( let i = 0 ; i  < Memory.globalspawnque.length  ; ++i) {
					if (Memory.globalspawnque[i] == 'END' ) {
						break;
					}
					argslist.push(Memory.globalspawnque[i]);
				}
				//test for energy OK rooms
				var energyOkRooms = getEnergyOkRooms();
				var closestRoom = findClosestRoom(argslist[1], energyOkRooms);
				if (closestRoom != undefined ) {
					for (let i = 0; i < argslist.length; ++i) {
						Game.rooms[closestRoom].memory.spawnque.push(argslist[i]);
					}
					Memory.globalspawnque.splice(0, (argslist.length + 1));
				}
			}
		}
		else {
			this.buildQue;
		}
	}
	buildQue: function () {
		if (!Memory.globalspawnque) {
			Memory.globalspawnque = new Array();
		}
		//que is empty
		if (Memory.globalspawnque.length > 0 ) {
		/* Global spawnque is in the format [ creep role, room requesting the creep,args, END]*/
			for ( let roomname in MYROOMS) {
				var room = MYROOMS[roomname];
				if (Memory.roomstates[room].claiming == true ) {
					//claiming so push a capture creep then a bootstrapworker then bootstrap hauler
					//test if claimcreep is in que or exists if not spawn one
					var capture = _.filter(Game.creeps, function(c) { return (c.memory.role == 'capture' && c.memory.targetroom == room ) })
					if (capture.length == 0 ) {
					 Memory.globalspawnque.push('capture',room, ,'END');
					 Memory.globalspawnque.push( 'bootstrapworker',room,'END');
					  Memory.globalspawnque.push( 'bootstraphauler',room, 'END');
					}
				}
				if (Memory.roomstates[room].bootstraping == true ) {
				var bootstrapbuiler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstrapbuiler' && c.memory.targetroom == room ) });
				var bootstraphauler = _.filter(Game.creeps, function(c) { return (c.memory.role == 'bootstraphauler' && c.memory.targetroom == room ) });
					if (bootstrapbuiler.length < 2 ) {
						Memory.globalspawnque.push(room, 'bootstrapworker','END');
					}
					if (bootstraphauler.length < 4 ) {
						Memory.globalspawnque.push(room, 'bootstraphauler','END');
					}
				}
			}
		}
		
	}
	
	
	
}