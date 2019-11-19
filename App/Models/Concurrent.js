"use strict";

const Participant = require("./Participant");
const Emitter = require("./Emitter");
const Tracker = require("./Tracker");
let IO = require("socket.io");

class Concurrent {

    constructor(server) {

        this.participants = [];
        this.io = IO.listen(server);

        this.io.on("connection",  (socket) =>this.onConnect(socket));

    }

    onConnect(socket) {
        this.socket=socket;
        console.log("new connection, sockedId: " + socket.id);
        socket.on("init",(data)=> this.init(data));

    }
    init(data) {
        // this is Socket
        let userName = data.userName;
        let userId = data.userId;
        let participant = new Participant(userId, userName);

        console.log("Participant: " + userName + " " + userId);

        let emiter = new Emitter(participant,this.io, this.socket);
        let traker = new Tracker(participant,this.io, this.socket);

    }

}

module.exports = Concurrent;
