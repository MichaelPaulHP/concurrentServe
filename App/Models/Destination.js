const DestinationSchema = require("./Schemas/DestinationSchema");
class Destination {

    constructor() {

    }

    static async findById(id) {
        try {

            return await DestinationSchema.findById(id);

        } catch (e) {
            throw "Destination Not Found"
        }
    }

    /*static getQueryToFindByPoint (latitude,longitude) {
        return {
            $near:{
                $geometry: {
                    type: "Point",
                    coordinates: [ longitude, latitude ]
                },
                $maxDistance:Destination.MAX_DISTANCE
            }
        };
    }*/

    static async create(data) {

        let destination = new DestinationSchema();
        destination.fillAttributes(data);
        try {

            const destinationSaved = await DestinationSchema.create(destination);
            return destinationSaved;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async createDestinationWithParticipant(data,user) {

        try {
            let destination = new DestinationSchema();
            destination.fillAttributes(data);
            destination.numUsers=1;
            destination.createBy=user.googleId;
            destination.participants.push(user);
            const destinationSaved = await DestinationSchema.create(destination);
            return destinationSaved;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }


    static async addParticipantToDestination(user, destinationId) {

        try {

            /*
            * {
            *  $and:[{$addToSet: {participants: user}},{$inc: {numUsers: 1}}]

                    }
            * */
            let destinationUpdated = await
                DestinationSchema.findByIdAndUpdate(
                    destinationId, {
                        $addToSet: {participants: user},
                        $inc: {numUsers: 1}
                    },
                    {new:true,runValidators: true });

            return destinationUpdated;

        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    static async getParticipants(destinationId) {
        try {
            let destination =await Destination.findById(destinationId);
            let participants = destination.participants;
            if(!participants) {
                return [];
            }
            return participants;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async closeDestination(destinationId){
        try {
            let destination=await DestinationSchema.findByIdAndUpdate(
                destinationId,
                {isActive: false}
                ,{new:true});


             return destination;
        }catch (e) {
            console.error(e);
            throw e;
        }
    }
    static async removeParticipantFromDestination(userId, destinationId) {

        try {

            let destinationUpdated = await
                DestinationSchema.findByIdAndUpdate(
                    destinationId, {
                        $pull: {participants: {userId}},
                        $inc: {numUsers: -1}
                    },{new:true});

            return destinationUpdated;

        } catch (e) {
            throw e;
        }

    }

}
module.exports = Destination;
