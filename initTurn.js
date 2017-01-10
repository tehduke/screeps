require('haulTasks')
//wrapper for actions that happen at the start of the turn
module.exports = {
	run: = function () {
		//call haultask console.log wrapper else just run
		if (DEBUG || Game.time % 20 === 0 ) {
			let startCpu = Game.cpu.getUsed()
			for (room in MYROOMS) {
				console.log("====== " + room + " haulTask Overview ======");
				Game.rooms[room].getHaulTasks()
				console.log("found " + _.size(Game.rooms[room].supplyTasks) + " supplyTasks");
				console.log("found " + _.size(Game.rooms[room].requestTasks) + " requestTasks");
				console.log("in " + (Game.cpu.getUsed() - startCpu) + "Cpu")
			}
		}
		else {
			for (room in MYROOMS) {
				Game.rooms[room].getHaulTasks()
			}
		}
	}
}