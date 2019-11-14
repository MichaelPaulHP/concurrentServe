'use strict'

var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var schema = mongoose.Schema;


var ParticipantSchema = new schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String
    },
    destinations: [{type: schema.ObjectId, ref: "DestinationSchema"}],
    inactiveDestinations:[{type: schema.ObjectId, ref: "DestinationSchema"}],


}, {timestamps: false});


module.exports = mongoose.model('ParticipantSchema', ParticipantSchema);
