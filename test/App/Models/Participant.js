const Participant = require("../../../App/Models/Participant");
const Destination = require("../../../App/Models/Destination");
const {connect}=require("../../../App/Utils/MongoDB")
var assert = require('chai').assert;
//var assert = require('assert');

describe('Participant Test', function () {

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
    before(async ()=>{


    });

    beforeEach(async (done)=>{

        try {
            this.timeout(999999);
            await connect();

            //this.enableTimeouts(false);
            await createParticipant();
            await createDestination();

        }catch (e) {
            console.log(e);
        }

    });
    afterEach(async ()=>{

        await deleteDestination();
        await deleteParticipant();
    });

    it("create my destination", async () => {
        try {

            let destinationA = await participantStored.createMyDestination(data);
            assert.equal(destinationA.numUsers, 1);
            let participants=destinationA.participants;
            assert.equal(participants.length,1);
            let participantOne=participants[0];
            assert.exists(participantOne.userId);
            //assert.equal(participantOne.name,participantStored.name);
            //assert.equal(participantOne.googleId,participantStored.googleId);


        } catch (e) {
            assert.notExists(e,e);
        }
    });
    it('get my destinations when is empty ',async () => {
        try {

            let googleId="2 get destinatrions empty ";
            participantStored=await Participant.createParticipant(googleId);

            let destinations=await participantStored.getMyDestinations();
            assert.isEmpty(destinations);
            assert.equal(destinations.length,0);

        }catch (e) {
            assert.notExists(e,e);
        }
    });
    it('get my destinations', async () => {
        let partipant=new Participant("rDFKm9loKOTW04If5uGxpSurcKn1", "z@gmail.com");

        let destination=await partipant.getMyDestinations();

        //assert.isNotEmpty(destination);
        let d=destination[0];
        assert.exists(d._id);
        assert.exists(d.originPoint);
        assert.ok(d.numUsers>=1);

    });
    it("join to destination fake",async ()=>{
        try {
            let destinationId="FAKE";

            let isJoin=await participantStored.joinToDestination(destinationId);
            assert.notExists(isJoin)
        }catch (e) {
            assert.exists(e,e);
        }
    });


    it("add a destination with id to my destinations",async ()=>{
        try {


            let destinationId=destinationSaved._id;

            await  participantStored.addToMyDestinations(destinationId);

            let destinations = await participantStored.getMyDestinations();
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
            participantStored=await Participant.createParticipant(googleId);
            // create a Destination
            data.name=data.name+Math.random();
            destinationSaved=await Destination.create(data);

            let destinationId=destinationSaved._id;

            await  participantStored.addToMyDestinations(destinationSaved);

            let destinations = await participantStored.getMyDestinations();
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
            await participantStored.addToMyDestinations(destinationId);
            let destinations=participantStored.getMyDestinations();
            assert.isEmpty(destinations);
            assert.equal(destinations.length,0);
        }catch (e) {
            assert.exists(e,e);
        }
    });

    it('join to destination',jointToDestination);

    it('join to a destination two times ',async () => {
        try {
            let destinationId=destinationSaved._id;

            let isJoinA= await participantStored.joinToDestination(destinationId);
            assert.isOk(isJoinA);

            let isJoinB= await participantStored.joinToDestination(destinationId);

            let destinations=await  participantStored.getMyDestinations();
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

            let isJoinA= await participantStored.joinToDestination(destinationId);
            assert.isOk(isJoinA);

            let isLeave = await participantStored.leaveDestination(destinationId);
            assert.isOk(isLeave);

            let destinations=participantStored.getMyDestinations();

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
            let isLeave = await participantStored.leaveDestination(destinationId);
            assert.notExists(isLeave);

        }catch (e) {
            assert.exists(e,e);
        }
    });

    it('leave when my destinations is empty',async () => {
        try {
            let destinationId=destinationSaved._id;
            assert.isEmpty(participantStored.myDestinations);
            let destination=participantStored.getMyDestinations();
            assert.isEmpty(destination);
            let isLeave = await participantStored.leaveDestination(destinationId);
            assert.notExists(isLeave);

        }catch (e) {
            assert.exists(e,e);
        }
    });

    async function  createParticipant() {
        let googleId="participantTestOfParticipant2";
        participantStored=await Participant.createParticipant(googleId,googleId);
    }
    async function  createDestination() {

        let destinationStored = await Destination.create(data);
    }
    async function  deleteParticipant() {
        let googleId="participantTestOfParticipant2";
        await Participant.delete(googleId);
    }
    async function  deleteDestination() {

        await Destination.delete(destinationStored._id);
    }

    async function jointToDestination(){
        try {


            let destinationWithMe= await participant.joinToDestination(destinationId);
            assert.exists(destinationWithMe);
            let participants=destinationWithMe.participants;

            assert.isOk(participants.length>0);
            let participantOne=participants[0];
            assert.equal(participantOne.userId,participant.googleId);
            assert.equal(participantOne.userName,participant.name);


            let destinations=await participant.getMyDestinations();
            assert.exists(destinations);
            assert.equal(destinations.length,1);
            assert.equal(destinations[0]._id,destinationStored._id);

        }catch (e) {
            console.log(e);
        }
    }
});


