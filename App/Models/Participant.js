const DestinationSchema = require("./Schemas/DestinationSchema");
const ParticipantSchema = require("./Schemas/ParticipantSchema");
const Destination = require("./Destination");

class Participant {

    constructor(userId,userName) {
        this.userId = userId;
        this.name = userName;
        this.myDestinations = [];
    }

    async getMyDestinations() {
        try {
            let thisParticipantSchema = await
                ParticipantSchema.findOne({googleId: this.userId});
            if(!thisParticipantSchema){
                throw "participant not found";
            }
            let myDestination = thisParticipantSchema.destinations;

            return myDestination;
        } catch (e) {
            throw e;
        }
    }

    async createMyDestination(data) {
        try {
            let destinationSchema = await
                Destination.createDestinationWithParticipant(
                    data,
                    {"userId":this.userId,"userName":this.name}
                );

            return destinationSchema;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async addToMyDestinations(destinationSchema) {
        try {
            const participantSchema = await
                ParticipantSchema.findOneAndUpdate(
                    {googleId: this.userId},
                    {$push: {destinations: destinationSchema}},
                    {new:true});
            this.myDestinations.push(destinationSchema);
            return participantSchema;
        } catch (e) {
            throw e;
        }
    }


    async joinToDestination(destinationId) {
        try {
            let destinationSchema = await
                Destination.addParticipantToDestination(
                    this.userId,
                    destinationId);

            return await this.addToMyDestinations(destinationSchema);

        } catch (e) {
            throw e;
        }
    }
    async leaveDestination(destinationId){

        try {
            let destinationSchema= await
                Destination.removeParticipantFromDestination(
                    this.userId,
                    destinationId);

            await this.moveMyDestinationToInactive(destinationSchema);
            return true;
        }catch (e) {
            throw e;
        }
    }

    async moveMyDestinationToInactive(destinationSchema){
        try {

            let destinationSchema= await
                ParticipantSchema.findOneAndUpdate(
                    {googleId:this.userId},
                    [
                        {$pull: {destinations: destinationSchema}},
                        {$push:{inactiveDestinations: destinationSchema}}
                        ],
                    {new:true});
            return destinationSchema;

        }catch (e) {
            throw e;
        }
    }
    static async createParticipant(googleId,name){
        try {
            let participantSchema= new ParticipantSchema();
            participantSchema.googleId=googleId;
            participantSchema.name=name;
            let participantSchemaSaved= await ParticipantSchema.create(participantSchema);

            return new Participant(googleId);
        }catch (e) {
            throw e;
        }
    }

}

module.exports = Participant;
