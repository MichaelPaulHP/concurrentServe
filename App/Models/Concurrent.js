"use strict";

const Participant = require("./Participant");
const Emitter = require("./Emitter");

let IO = require("socket.io");

class Concurrent {

    constructor(server) {

        this.participants = [];
        this.io = IO.listen(server);

        this.io.on("connection",  (socket) =>this.onConnect(socket));

    }

    onConnect(socket) {

        console.log("new connection, sockedId: " + socket.id);
        let emiter = new Emitter(this.io, socket);

    }

}

module.exports = Concurrent;
