module.exports = {
	run: function () {
		if (Memory.stats == undefined) {
			Memory.stats = {};
		}
		Memory.stats.cpu = Game.cpu;
		Memory.stats.gcl = Game.gcl;
		Memory.stats.creeps = Game.creeps.length
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
				Memory.stats.room[roomName].rclProgress = Game.rooms[roomName].controller.progress
				Memory.stats.room[roomName].rclprogressTotal = Game.rooms[roomName].controller.progressTotal
				if (Game.rooms[roomName].storage != undefined ) {
					Memory.stats.room[roomName].storage = Game.rooms[roomName].storage.store
					Memory.stats.room[roomName].avgTaskPower = Game.rooms[roomName].memory.avgTaskPower
					Memory.stats.room[roomName].avgHaulPower = Game.rooms[roomName].memory.avgHaulPower
				}
				



			}
			_.forEach(Game.spawns, (s) => {
			if (s != undefined) {
				if (Memory['stats']['room'][s.room.name]['spawners'] == undefined) {
					Memory['stats']['room'][s.room.name]['spawners'] = {};
				}
				Memory['stats']['room'][s.room.name]['spawners'][s.name] = {};
				Memory['stats']['room'][s.room.name]['spawners'][s.name]['name'] = s.name;
				Memory['stats']['room'][s.room.name]['spawners'][s.name]['spawning'] = s.spawning !== null ? 1 : 0;
				}
			});
		
		Memory.stats.cpu.used = Game.cpu.getUsed()
	}
}