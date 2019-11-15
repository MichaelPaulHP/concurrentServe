const Destination = require("../../../App/Models/Destination");
const DestinationSearcher = require("../../../App/Models/DestinationSearcher");
const Participant = require("../../../App/Models/Participant");
const configDB = require("../../../Config/database");
const io = require('socket.io-client');

const mongoose = require("mongoose");
var assert = require('chai').assert;
var expect = require('chai').expect;
//var assert = require('assert');
describe('socket io client', function () {


    let user={userId:"rDFKm9loKOTW04If5uGxpSurcKn1",userName:"z@gmail.com"};

    let socket;

    beforeEach( async function(done) {
        await connectToDB();
        // Setup
        socket = io.connect('http://localhost:1337', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
        socket.on('connect', function() {
            console.log('worked...');
            socket.emit("init",user);
            done();
        });
        socket.on('disconnect', function() {
            console.log('disconnected...');
        })
    });



    it('get my Destinations',async (done) => {

        await socket.on("getMyDestinations",(data)=>{
            console.log(data);
            assert.exists(data);
            assert.equal(data.userId,user.userId);
            done();
        });

        socket.emit('getMyDestinations', user);
    });




    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });


});




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
