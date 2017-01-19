module.exports = {
	run: function () {
		if (Memory.stats == undefined) {
			Memory.stats = {};
		}
		Memory.stats.cpu = Game.cpu;
		Memory.stats.gcl = Game.gcl;
		Memory.stats.creeps = Game.creeps.length
		if (Game.time % 10 === 0 ) {
			for (let roomName in MYROOMS ) {
				if (Game.rooms[roomName] == undefined) {
					continue;
				}
				if (Memory.stats.room == undefined) {
					Memory.stats.room = {};
				}
				if (Memory.stats.room[roomName] == undefined) {
					Memory.stats.room[roomName] = {};
				}
				let room = Game.rooms[roomName]
				Memory.stats.room[roomName].rclProgress = room.controller.progress
				Memory.stats.room[roomName].rclprogressTotal = room.controller.progressTotal
				if (room.storage != undefined ) {
					Memory.stats.room[roomName].storage = room.storage.store
				}

			} 
		}
		Memory.stats.cpu.used = Game.cpu.getUsed()
	}
}