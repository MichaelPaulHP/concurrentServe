"user strict";

const Participant = require("./Participant");
const DestinationSearcher = require("./DestinationSearcher");
const Destination = require("./Destination");
const DestinationSchema = require("./Schemas/DestinationSchema");

/**
 * This is class
 */
class Tracker {

    constructor(participant,io,socket) {
        this.io = io;
        this.socket = socket;
        this.participant=participant;
        this.socket.on("changeLocation",(data)=>this.onChangeLocation(data));
    }

    async onChangeLocation(data) {
        console.log("changeLocation");
        console.log(data);
        console.log(this.socket.rooms);
        try {

            let destinations=await this.participant.getMyDestinations();

            for (let i = 0; i < destinations.length; i++) {
                let destinationId = destinations[i]._id;
                data.destinationId=destinationId;
                this.emitToRoom(destinationId,"changeLocation",data);
                //this.emit("changeLocation",data);
            }

        }catch (e) {
            console.error(e);
            //throw e;
        }

    }
    emitToRoom(room, even, args) {
        this.socket.to(room).emit(even, args);
        //this.io.in(room).emit(even, args);
    }
    emit(even,args){
        this.socket.emit(even,args);
    }
}


module.exports=Tracker;
