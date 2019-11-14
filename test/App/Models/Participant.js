const Participant = require("../../../App/Models/Participant");
const Destination = require("../../../App/Models/Destination");
const configDB = require("../../../Config/database");
const mongoose = require("mongoose");
var assert = require('chai').assert;
//var assert = require('assert');

describe('Participant Test', function () {

    let participant={};
    let destinationSaved={};

    let data = {
        idDestination: "78946513",
        name: "Areuiap",
        color: 43543543,
        numUsers: 0,
        destinationLatitude: -74.00682106454671,
        destinationLongitude: 40.711710222749105,
        originLatitude: 40.711710222749105,
        originLongitude: -74.00682106454671,
        chatId: "EWFWFWffdsfds",
        userId: "5hgfhyhy5ryhrhr",
    };
    before(async ()=>{
        try {
            this.enableTimeouts(false);
            this.timeout();
            await mongoose.connect(
                configDB.url,
                { useNewUrlParser: true,useFindAndModify: false }
            );
            console.log("connected");
            // create a participant

        }catch (e) {
            console.error(e);
        }

    });

    beforeEach(async ()=>{
        try {
            this.enableTimeouts(false);
            this.timeout(10000);

            let googleId=Math.random()+"2015242311";
            participant=await Participant.createParticipant(googleId);
            // create a Destination
            data.name=data.name+Math.random();
            destinationSaved=await Destination.create(data);
        }catch (e) {
            console.log(e);
        }


    });

    it("create my destination", async () => {
        try {

            let destinationA = await participant.createMyDestination(data);
            assert.equal(destinationA.numUsers, 1);
            let participants=destinationA.participants;
            assert.equal(participants.length,1);
            let participantOne=participants[0];
            assert.exists(participantOne.userId);
            //assert.equal(participantOne.name,participant.name);
            //assert.equal(participantOne.googleId,participant.googleId);


        } catch (e) {
            assert.notExists(e,e);
        }
    });
    it('get my destinations when is empty ',async () => {
        try {

            let googleId="2 get destinatrions empty ";
            participant=await Participant.createParticipant(googleId);

            let destinations=await participant.getMyDestinations();
            assert.isEmpty(destinations);
            assert.equal(destinations.length,0);

        }catch (e) {
            assert.notExists(e,e);
        }
    });

    it("join to destination fake",async ()=>{
        try {
            let destinationId="FAKE";

            let isJoin=await participant.joinToDestination(destinationId);
            assert.notExists(isJoin)
        }catch (e) {
            assert.exists(e,e);
        }
    });


    it("add a destination with id to my destinations",async ()=>{
        try {


            let destinationId=destinationSaved._id;

            await  participant.addToMyDestinations(destinationId);

            let destinations = await participant.getMyDestinations();
            assert.isOk(destinations.length>1);

            let destinationOne=destinations[0];
            assert.equal(destinationOne._id,destinationId);
            //assert.exists(destinationOne.participants);

        }catch (e) {
            assert.notExists(e,e);
        }
    });

    it('add a destination with destinationSchema', async () => {
        try {
            let googleId=Math.random()+"2015242311";
            participant=await Participant.createParticipant(googleId);
            // create a Destination
            data.name=data.name+Math.random();
            destinationSaved=await Destination.create(data);

            let destinationId=destinationSaved._id;

            await  participant.addToMyDestinations(destinationSaved);

            let destinations = await participant.getMyDestinations();
            assert.isOk(destinations.length>1);

            let destinationOne=destinations[0];
            assert.equal(destinationOne._id,destinationId);
            //assert.exists(destinationOne.participants);

        }catch (e) {
            assert.notExists(e,e);
        }
    });

    it('add to my destinations a fake destination',async () => {
        try {

            let destinationId="FAKE Destination";
            await participant.addToMyDestinations(destinationId);
            let destinations=participant.getMyDestinations();
            assert.isEmpty(destinations);
            assert.equal(destinations.length,0);
        }catch (e) {
            assert.exists(e,e);
        }
    });

    it('join to destination',async () => {
        try {
            let destinationId=destinationSaved._id;
            let participantId=participant.googleId;
            let isJoin= await participant.joinToDestination(destinationId);
            assert.isOk(isJoin);
            assert.equal(participant.myDestinations,1);

            let destinations=participant.getMyDestinations();
            assert.equal(destinations.length,1);
            assert.equal(destinations[0]._id,destinationId);


            let destinationSaved=await Destination.findById(destinationId);
            let participants=destinationSaved.participants;

            assert.isOk(participants.length>0);
            let participantOne=participants[0];
            assert.equal(participantOne.googleId,participantId);
            assert.equal(participantOne.name,participant.name);


        }catch (e) {
            assert.notExists(e,e);
        }
    });

    it('join to a destination two times ',async () => {
        try {
            let destinationId=destinationSaved._id;

            let isJoinA= await participant.joinToDestination(destinationId);
            assert.isOk(isJoinA);

            let isJoinB= await participant.joinToDestination(destinationId);

            let destinations=await  participant.getMyDestinations();
            assert.equal(destinations.length,1);
            let destination=Destination.findById(destinationId);
            let participants=destination.participants;
            assert.equal(participants.length,1);
            assert.equal(destination.numUsers,1);

            assert.notExists(isJoinB)
        }catch (e) {
            assert.exists(e,e);
        }
    });

    it('leave destination', async () => {
        try {

            let destinationId=destinationSaved._id;

            let isJoinA= await participant.joinToDestination(destinationId);
            assert.isOk(isJoinA);

            let isLeave = await participant.leaveDestination(destinationId);
            assert.isOk(isLeave);

            let destinations=participant.getMyDestinations();

            assert.equal(destinations.length,0);


            let destinationSaved= await Destination.findById(destinationId);
            let participants=destinationSaved.participants;
            assert.notExists(participants);
            assert.equal(destinationSaved.numUsers,0);

        }catch (e) {
            assert.notExists(e,e);
        }
    });

    it('leave from fake destination', async () => {
        try {
            let destinationId="FAKE";
            let isLeave = await participant.leaveDestination(destinationId);
            assert.notExists(isLeave);

        }catch (e) {
            assert.exists(e,e);
        }
    });

    it('leave when my destinations is empty',async () => {
        try {
            let destinationId=destinationSaved._id;
            assert.isEmpty(participant.myDestinations);
            let destination=participant.getMyDestinations();
            assert.isEmpty(destination);
            let isLeave = await participant.leaveDestination(destinationId);
            assert.notExists(isLeave);

        }catch (e) {
            assert.exists(e,e);
        }
    });


});
