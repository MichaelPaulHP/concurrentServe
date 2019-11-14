const Destination = require("../../../App/Models/Destination");
const DestinationSearcher = require("../../../App/Models/DestinationSearcher");
const configDB = require("../../../Config/database");
const mongoose = require("mongoose");
var assert = require('chai').assert;
var expect = require('chai').expect;
//var assert = require('assert');
describe('Destination Searcher', function () {
    before(async ()=>{
        this.enableTimeouts(false);
        this.timeout(80000000);
        await connectToDB();

    });
    describe('when exist a destination',async function () {
        //await create();
        it('origin and destination out of range',async () => {

            let origin={
                latitude:-16.426856974232678,
                longitude:-71.54391026773615
            };
            let destination={
                latitude:-16.42370940494203,
                longitude:-71.54364049033457
            };
            //let distanceBetwenOrigins=
            let destinations = await
                DestinationSearcher.findDestination(origin,destination);
            assert.isEmpty(destinations);
        });
        it('destination  out of range',async () => {

            let origin={
                latitude:-16.42716707928409,
                longitude:-71.54330397584805
            };
            let destination={
                latitude:-16.42370940494203,
                longitude:-71.54364049033457
            };
            //let distanceBetwenOrigins=
            let destinations = await
            DestinationSearcher.findDestination(origin,destination);
            assert.isEmpty(destinations);
        });
        it('origin and destination in range ', async () => {
            let origin={
                latitude:-16.42716707928409,
                longitude:-71.54330397584805
            };
            let destination={
                latitude:-16.423901157552862,
                longitude:-71.54400979197816
            };
            //let distanceBetwenOrigins=
            let destinations = await
             DestinationSearcher.findDestination(origin,destination);
            assert.equal(destinations.length,1);
            console.log(destinations);
        });

        it('destination in range origin out of range ', async () => {
            let origin={
                latitude:-16.426856974232678,
                longitude:-71.54391026773615
            };
            let destination={
                latitude:-16.423901157552862,
                longitude:-71.54400979197816
            };
            //let distanceBetwenOrigins=
            let destinations = await
                DestinationSearcher.findDestination(origin,destination);
            assert.equal(destinations.length,1);
            console.log(destinations);
        });

    });

});


async function createDestination(){
    await Destination.create(data)
}


data = {
    destinationId: "FFFF",
    name: "casa - terminal",
    color: 43543543,
    numUsers: 0,
    destinationLatitude: -16.4232655,
    destinationLongitude: -71.5445103,
    originLatitude: -16.4273905,
    originLongitude: -71.5431427,
    chatId: "rdewtwgfewfwegrete",
    userId: "ert443erterteert",
};

async function  connectToDB() {

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
}
