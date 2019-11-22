const Participant = require("../../../App/Models/Participant");
const Destination = require("../../../App/Models/Destination");
const {connect} = require("../../../App/Utils/MongoDB");
var assert = require('chai').assert;

describe('participant', () => {
    let participant;
    let participantStored={};
    let destinationStored={};

    let data = {
        idDestination: "EWFWFWffdsfdsewFWFSQA",
        name: "Arequia-House",
        color: 43543543,
        numUsers: 0,
        destinationLatitude: -74.00682106454671,
        destinationLongitude: 40.711710222749105,
        originLatitude: 40.711710222749105,
        originLongitude: -74.00682106454671,
        chatId: "EWFWFWffdsfds",
        userId: "5hgfhyhy5ryhrhr",
    };
    beforeEach(async () => {
        try {
            await connect();
            await createParticipant();
            await createDestination();
        }catch (e) {
            console.error(e);
        }

    });
    afterEach(async () => {
        try {
            await deleteDestination();
            await deleteParticipant();
        }catch (e) {
            console.error(e);
        }

    });
    test('joint to destination', jointToDestination);


    async function createParticipant() {
        let googleId="nnnnnnnnnnnn";
        participant = await Participant.createParticipant(googleId, googleId);

    }
    async function  createDestination() {

        destinationStored = await Destination.create(data);

    }
    async function deleteParticipant() {
        let googleId=participant.userId;
        await Participant.delete(googleId);
    }

    async function deleteDestination() {

        await Destination.delete(destinationStored._id);
    }

    async function jointToDestination() {
        try {
            //expect.assertions(6);
            let destinationId=destinationStored._id;
            let participantSchema = await participant.joinToDestination(destinationId);
            assert.exists(participantSchema);

            let destinations = participantSchema.destinations;

            assert.isOk(destinations.length > 0);
            let destinationOne = destinations[0];
            assert.equal(destinationOne._id.toString(), destinationId.toString());

            let destination = await Destination.findById(destinationId);
            assert.exists(destination);
            let participants=destination.participants;

            assert.equal(participants.length, 1);

            assert.equal(participants[0].userId.toString(), participant.userId.toString());

        } catch (e) {
            console.log(e);

        }
    }

});


