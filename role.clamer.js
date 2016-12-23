
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if (creep.room.name != creep.memory.targetroom) {
            var exit = creep.room.findExitTo(creep.memory.targetroom);
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
        else {
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};