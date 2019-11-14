const Participant = require("./Participant");
const DestinationSearcher =require("./DestinationSearcher");
class Emitter {

    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.participant = new Participant("ee");//Participant.createParticipant("20215423");
        socket.on("init", this.init);
        socket.on("findDestinations", this.onFindDestinations);
        socket.on("newDestination", this.onNewDestination);
        socket.on("joinToDestination",this.onJoinToDestination);
        socket.on("getMyDestinations",this.onGetMyDestinations);
    }

    async init(data) {
        let userName = data.userName;
        let userId = data.userId;
        this.participant = new Participant(userId,userName);
        console.log("Participant: "+userName+ " "+userId);
    }


    async onFindDestinations(data) {
        let origin={
            latitude:data.originLatitude,
            longitude:data.originLongitude
        };
        let destination={
            latitude:data.destinationLatitude,
            longitude:data.destinationLongitude
        };
        let destinations= await
            DestinationSearcher.findDestination(origin,destination);

        let toSend=[];
        destinations.forEach((destinationSchema)=>{
            toSend.push(destinationSchema.convertForClient());
        });

        this.socket.emit("destinationsFound",toSend);
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

            let destinationsToSend = [];
            destinations.forEach((destination) => {
                destinationsToSend.push(destination.convertForClient());
                this.joinToRoom(destination._id);
            });

            this.emit("myDestinations", destinationsToSend);

        } catch (e) {
            throw e;
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

    emitToRoom(room, even, args) {
        this.io.in(room).emit(even, args);
    }

    emit(even, args) {
        this.socket.emit(even, args);
    }

    joinToRoom(destinationId) {
        this.socket.join(destinationId)
    }

}

module.exports = Emitter;
