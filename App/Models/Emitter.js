"use strict";

const Participant = require("./Participant");
const DestinationSearcher = require("./DestinationSearcher");
const Destination = require("./Destination");
const DestinationSchema = require("./Schemas/DestinationSchema");
class Emitter {

    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.participant = new Participant("ee");//Participant.createParticipant("20215423");
        socket.on("init",(data)=> this.init(data));
        socket.on("findDestinations",(data)=> this.onFindDestinations(data));
        socket.on("newDestination",(data)=> this.onNewDestination(data));
        socket.on("joinToDestination",(data)=> this.onJoinToDestination(data));
        socket.on("getMyDestinations",(data)=> this.onGetMyDestinations(data));
        socket.on("disconnect",(reason)=> this.onDisconnect(reason));

    }

    init(data) {
        // this is Socket
        let userName = data.userName;
        let userId = data.userId;
        this.participant = new Participant(userId, userName);
        console.log("Participant: " + userName + " " + userId);

    }


    async onFindDestinations(data) {
        let origin = {
            latitude: data.originLatitude,
            longitude: data.originLongitude
        };
        let destination = {
            latitude: data.destinationLatitude,
            longitude: data.destinationLongitude
        };
        let destinations = await
            DestinationSearcher.findDestination(origin, destination);

        for (let i = 0; i < destinations.length ; i++) {
            let destinationSchema =new DestinationSchema();
            let toSend= destinationSchema.convertForClient(destinations[i]);
            this.emit("destinationsFound",toSend);
        }

        /*for (let destinationSchema of destinations) {

        }*/
    }

    async onNewDestination(data) {
        try {
            console.log(data);
            let destinationSchema = await
                this.participant.createMyDestination(data);

            await this.participant.addToMyDestinations(destinationSchema);

            let toSend = destinationSchema.convertForClient();
            this.emit("newDestination", toSend);
            this.joinToRoom(destinationSchema._id);

        } catch (error) {
            this.emit("error", {error});
        }
    }

    async onJoinToDestination(data) {
        let destinationId = data.destinationId;
        try {
            let destination = await this.participant.joinToDestination(destinationId);
            this.joinToRoom(destinationId);

            this.emitToRoom(
                destinationId,
                "joinToDestination",
                destination.convertForClient()
            )
        } catch (error) {
            this.emit("error", {error});
        }
    }

    async onGetMyDestinations(data) {
        try {
            let destinations = await
                this.participant.getMyDestinations();
            console.log(destinations.length);

            for (let i = 0; i < destinations.length; i++) {
                let destinationId = destinations[i];
                let destinationSchema = await Destination.findById(destinationId);
                this.emit("myDestinations", destinationSchema.convertForClient());
                this.joinToRoom("destinationId");
            }
            /*for(let destinationId of destinations){
                let destinationSchema=await Destination.findById(destinationId);
                this.joinToRoom(destinationId,null);
                this.emit("myDestinations", destinationSchema.convertForClient());

            }*/

            /*destinations.forEach(async (destinationId) => {

            });*/

        } catch (error) {
            //this.emit("error", {error});
            console.log(error);
        }
    }


    async onCompleteDestination(data) {
        try {
            // for each participant leave
            let destinationId = data.destinationId;
            await this.participant.leaveDestination(destinationId);

        } catch (e) {
            throw e;
        }
    }

    async onLeaveFromDestination(data) {
        try {
            // for each participant leave
            let destinationId = data.destinationId;
            await this.participant.leaveDestination(destinationId);

        } catch (e) {
            throw e;
        }
    }

    onDisconnect(reason) {
        console.log("disconnect:" + this.participant.userId + " reason: " + reason);
    }

    emitToRoom(room, even, args) {
        this.io.in(room).emit(even, args);
    }

    emit(even, args) {
        this.socket.emit(even, args);

    }

    joinToRoom(destinationId) {
        this.socket.join(destinationId);
    }


}

module.exports = Emitter;
