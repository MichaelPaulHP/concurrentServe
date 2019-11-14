var configDB = require('../../Config/database');
var mongoose = require("mongoose");
var assert = require('chai').assert;
//var assert = require('assert');

describe('mongo DB', function () {

    it("test connection", async ()=>{
        this.timeout(0);
        try {
            await mongoose.connect(configDB.url, { useNewUrlParser: true });
            assert.isOk(true);
            console.log("connected");
        } catch (error) {
            assert.notExists(error);
            console.log(error)
        }
    });
});
