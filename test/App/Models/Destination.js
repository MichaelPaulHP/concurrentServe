const Destination = require("../../../App/Models/Destination");
const DestinationSchema = require("../../../App/Models/Schemas/DestinationSchema");
const configDB = require("../../../Config/database");
const mongoose = require("mongoose");
var assert = require('chai').assert;
var expect = require('chai').expect;
//var assert = require('assert');
describe('Destination', function () {

    let data = {};


    before(async () => {
        this.enableTimeouts(false);
        this.timeout(0);
        try {

            await mongoose.connect(
                configDB.url,
                {useNewUrlParser: true, useFindAndModify: false}
            );

            assert.isOk(true);
            console.log("connected");
        } catch (error) {
            console.log("not conect");
            assert.notExists(error);
            console.log(error)
        }
    });

    beforeEach((done) => {

        data = {
            destinationId: "FFFF",
            name: "wwwwwww",
            color: 43543543,
            numUsers: 0,
            destinationLatitude: -74.00682106454671,
            destinationLongitude: 40.711710222749105,
            originLatitude: 40.711710222749105,
            originLongitude: -74.00682106454671,
            chatId: "EWFWFWffdsfds",
            userId: "5hgfhyhy5ryhrhr",
        };
        done();
    });

    it("DestinationSchema to client", async () => {
        try {
            let destinationSchema = await Destination.create(data);
            let toSendJ = destinationSchema.convertForClient();
            assert.equal(toSendJ.name, data.name);
            assert.equal(toSendJ.numUsers, data.numUsers);
            assert.equal(toSendJ.destinationLatitude, data.destinationLatitude);
            assert.equal(toSendJ.destinationLongitude, data.destinationLongitude);
            assert.equal(toSendJ.originLatitude, data.originLatitude);
            assert.equal(toSendJ.originLongitude, data.originLongitude);
            assert.equal(toSendJ.chatId, data.chatId);
            assert.equal(toSendJ.userId, data.userId);
            assert.equal(toSendJ.destinationId, destinationSchema._id);

        } catch (e) {
            assert.notExists(e, e);
        }
    });

    it('fill  Attributes', async () => {
        let d = new DestinationSchema();
        d.fillAttributes(data);
        assert.equal(d.name, data.name);
        assert.equal(d.numUsers, data.numUsers);
        assert.equal(d.destinationPoint.coordinates[1], data.destinationLatitude);
        assert.equal(d.destinationPoint.coordinates[0], data.destinationLongitude);
        assert.equal(d.originPoint.coordinates[1], data.originLatitude);
        assert.equal(d.originPoint.coordinates[0], data.originLongitude);
        assert.equal(d.chatId, data.chatId);
        assert.equal(d.createBy, data.userId);
        //assert.equal(d.destinationId, destinationSchema._id);
        let destination= await DestinationSchema.create(d);
        assert.exists(destination);
    });

    it("add a participant two times", async () => {

        try {
            let participantA = {userName: "userNameA", userId: "205142314444"};
            let destination = await Destination.create(data);

            destination = await Destination.addParticipantToDestination(participantA, destination._id);
            assert.equal(destination.participants.length, 1);
            //destination = await Destination.addParticipantToDestination(participantA, destination._id);
            expect(await Destination.addParticipantToDestination(participantA, destination._id)).to.throws;
        }catch (e) {
            console.log(e);
        }



    });

    it("find Destination By fake Id  ", async () => {
        let d;
        try {
            d = await Destination.findById("ffe");

        } catch (e) {
            assert.exists(e, e);
            //console.error(e);
        } finally {
            //assert.isNull(d);
            assert.isUndefined(d);

        }

    });

    it("create a destination", async () => {
        try {
            let destinationSaved = await Destination.create(data);

            assert.equal(data.color, destinationSaved.color);
            assert.equal(data.name, destinationSaved.name);
            assert.exists(destinationSaved.originPoint);
            assert.exists(destinationSaved.destinationPoint);
            assert.exists(destinationSaved._id);
            assert.equal(destinationSaved.numUsers, 0);

        } catch (e) {
            assert.notExists(e);
            console.error(e)
        }
    });


    it("create a destination without name", async () => {
        try {
            data.name = null;
            assert.notExists(data.name);

            let destinationSaved = await Destination.create(data);
            assert.notExists(destinationSaved);
        } catch (e) {
            assert.exists(e, e);
            //console.error(e)
        }
    });
    it("create a destination with name empty", async () => {
        try {
            data.name = "";
            assert.isEmpty(data.name);
            let destinationSaved = await Destination.create(data);
            assert.notExists(destinationSaved);
        } catch (e) {
            assert.exists(e, e);
        }
    });

    it("create destination With Participant", async () => {
        try {

            let userName = "pedirto";
            let userId = data.userId;
            let destinationSaved = await
                Destination.createDestinationWithParticipant(data, {userId, userName});
            assert.equal(destinationSaved.numUsers, 1, "num user");
            let participants = destinationSaved.participants;
            assert.equal(participants.length, 1, " participants length");
            let participantsOne = participants[0];
            assert.equal(participantsOne.userName, userName, "participantsOne.userName");
            assert.equal(participantsOne.userId, userId, "participantsOne.userId");

        } catch (e) {
            assert.notExists(e, e);
        }
    });

    it("add two participants", async () => {
        try {
            data.name = "two participatns";
            let userName = "pedirto";
            let userId = data.userId;
            let destinationSaved = await
                Destination.createDestinationWithParticipant(data, {userId, userName});
            let userName2 = "juan";
            let userId2 = "234h5h65y5";
            let destinationId = destinationSaved._id;
            destinationSaved = await
                Destination.addParticipantToDestination(
                    {"userId": userId2, "userName": userName2},
                    destinationId
                );


            assert.equal(destinationSaved.numUsers, 2);
            let participants = destinationSaved.participants;

            let numParticipants = participants.length;
            assert.equal(numParticipants, 2);

            let participantLast = participants[numParticipants - 1];
            assert.equal(participantLast.userName, userName2);
            assert.equal(participantLast.userId, userId2);

        } catch (e) {
            assert.notExists(e, e);
        }
    });

    it("get  participants from destination of two participants", async () => {
        try {

            let userName = "pedirto";
            let userId = data.userId;
            data.name = "participants 2";

            let destinationSaved = await
                Destination.createDestinationWithParticipant(data, {userId, userName});

            let destinationId = destinationSaved._id;

            let userName2 = "juan";
            let userId2 = "234h5h65y5";
            destinationSaved = await
                Destination.addParticipantToDestination(
                    {"userId": userId2, "userName": userName2},
                    destinationId);

            assert.equal(destinationSaved.numUsers, 2);
            assert.equal(destinationSaved.participants.length, 2);

            let participants = await
                Destination.getParticipants(destinationId);
            //assert.equal(destinationSaved.numUsers,2);

            assert.equal(participants.length, 2);

            let numParticipants = participants.length;
            let participantLast = participants[numParticipants - 1];
            assert.exists(participantLast.userName);
            assert.exists(participantLast.userId);

        } catch (e) {
            assert.notExists(e, e);
        }
    });

    it("close a destination", async () => {
        try {
            let userName = "pedirto";
            let userId = data.userId;

            let destinationSaved = await
                Destination.createDestinationWithParticipant(data, {userId, userName});

            let destinationId = destinationSaved._id;
            destinationSaved = await
                Destination.closeDestination(destinationId);

            assert.equal(destinationSaved.isActive, false);

        } catch (e) {
            assert.notExists(e, e);
        }
    });

    it("remove a participant with fake userId from destination without participants", async () => {
        try {

            let userName = "pedirto";
            let userId = "FAKE";
            data.name = "FAKEEEEEEEEE";
            let destinationSaved = await
                Destination.create(data);

            let destinationId = destinationSaved._id;

            let destinationSchema = await
                Destination.removeParticipantFromDestination(userId, destinationId);

            assert.isOk(false, "fix");

        } catch (e) {
            assert.isOk(false, "fix");
            assert.exists(e, e);
        }
    });

    it("remove  participant from destination with participants", async () => {
        try {
            let userName = "pedirto";
            let userId = "298716321";
            data.name = "REMEVE";
            let destinationSaved = await
                Destination.createDestinationWithParticipant(data, {userId, userName});

            let destinationId = destinationSaved._id;

            let destinationSchema = await
                Destination.removeParticipantFromDestination(userId, destinationId);
            assert.equal(destinationSchema.numUsers, 0);
            assert.isEmpty(destinationSchema.participants);

        } catch (e) {
            assert.notExists(e, e);
        }
    });
});
