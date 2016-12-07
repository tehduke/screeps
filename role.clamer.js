module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if in target room
        if (creep.room.name != creep.memory.targetroom) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetroom);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
        else {
            // try to claim controller
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
    }
};