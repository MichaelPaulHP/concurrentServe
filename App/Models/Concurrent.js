const Participant = require("./Participant");
const Emitter = require("./Emitter");

class Concurrent {

    constructor(io) {
        this.io = io;
        this.participants = [];
        io.on("connection", this.onConnect);

    }

    onConnect(socket) {
        console.log("new connection, sockedId: " + socket.id);
        let emiter = new Emitter(this.io, socket);

    }

}

module.exports = Concurrent;
