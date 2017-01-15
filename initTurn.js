require('haulTasks')
//wrapper for actions that happen at the start of the turn
module.exports = {
	run:  function () {
		//call haultask console.log wrapper else just run
		if (DEBUG.basicDebug || Game.time % 20 === 0 ) {
			let startCpu = Game.cpu.getUsed()
			for (room in MYROOMS) {
				console.log("====== " + room + " haulTask Overview ======");
				Game.rooms[room].getHaulTasks()
				console.log("found " + _.size(Game.rooms[room].supplyTasks) + " supplyTasks");
				console.log("found " + _.size(Game.rooms[room].requestTasks) + " requestTasks");
				console.log("avg TaskPower " + Game.rooms[room].trackTaskPower());
				console.log("avg HaulPower " + Game.rooms[room].trackHaulPower());
				console.log("in " + _.round( (Game.cpu.getUsed() - startCpu), 2) + "Cpu")
			}
		}
		else {
			for (room in MYROOMS) {
				Game.rooms[room].getHaulTasks();
				Game.rooms[room].trackTaskPower();
				Game.rooms[room].trackHaulPower();
			}
		}
	}
}