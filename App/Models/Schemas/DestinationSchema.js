'use strict'
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

let Haversine = require("../../Utils/Haversine");
var schema = mongoose.Schema;
const MAX_DISTANCE = 100;
var DestinationSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    numUsers: {
        type: Number,
        required: true,
    },
    color: {
        type: Number,
        required: true,
    },
    participants: {
        type: [{
            userId:{type:String},
            userName:{type:String},
        }]
    },
    isActive: {
        type: Boolean, default: true
    },
    chatId: {
        type: String,
        required: true,
    },

    createBy: {
        type: String,
        required: true,
    },
    originPoint: {
        type: mongoose.Schema.Types.Point,
        required: true,
    },
    destinationPoint: {
        type: mongoose.Schema.Types.Point,
        required: true,
    },
    dist:{
        type:Object
    }
    /*destinationLatitude: {
        type: Number,
        required: true,
    },
    destinationLongitude: {
        type: Number,
        required: true,
    },
    originLatitude: {
        type: Number,
        required: true,
    },
    originLongitude: {
        type: Number,
        required: true,
    }*/

}, {timestamps: true});

DestinationSchema.index({destinationPoint:"2dsphere"});
/*
    public String destinationId;
    public String name;
    public int numUsers;
    public int color;
    public Double originLatitude;
    public Double originLongitude;
    public Double destinationLatitude;
    public Double destinationLongitude;
    public String userId;
    public String chatId;
 */
DestinationSchema.methods.convertForClient = function () {
    return {
        destinationId: this.id,
        name: this.name,
        color: this.color,
        numUsers: this.numUsers,
        destinationLatitude: this.destinationPoint.coordinates[1],
        destinationLongitude: this.destinationPoint.coordinates[0],
        originLatitude: this.originPoint.coordinates[1],
        originLongitude: this.originPoint.coordinates[0],
        chatId: this.chatId,
        userId: this.createBy,
        dist:this.dist
    };
};

DestinationSchema.methods.fillAttributes = function (data) {
    /*{"type" : "Point",
        "coordinates" : longitude, latitude]}*/
    try {
        this.name = data.name;

        this.color = data.color;
        this.numUsers = data.numUsers;
        this.originPoint = {
            type: "Point",
            coordinates: [data.originLongitude, data.originLatitude]
        };

        this.destinationPoint = {
            type: "Point",
            coordinates: [data.destinationLongitude, data.destinationLatitude]
        };
        this.chatId = data.chatId;
        this.createBy = data.userId;
    } catch (e) {
        throw e;
    }

};

/*DestinationSchema.methods.getQueryToFindByPoint = function (latitude, longitude, maxDistance) {
    return {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
        }
    };
};*/
/*
DestinationSchema.methods.isInRange = function (data) {
    let distanceOrigins= Haversine.distance(
        this.originLatitude,
        this.originLongitude,
        data.originLatitude,
        data.originLongitude
    );
    let distanceDestinations= Haversine.distance(
        this.destinationLatitude,
        this.destinationLongitude,
        data.destinationLatitude,
        data.destinationLongitude
    );
    return (
        distanceOrigins<= data.distance &&
        distanceDestinations<= data.distance
            );
};
DestinationSchema.methods.isInRangeArray = function (data,distance) {

    let distanceOrigins= Haversine.distance(
        this.originLatitude,
        this.originLongitude,
        data[0],
        data[1]
    );
    let distanceDestinations= Haversine.distance(
        this.destinationLatitude,
        this.destinationLongitude,
        data[2],
        data[3]
    );
    return (
        distanceOrigins<= distance &&
        distanceDestinations<= distance
    );
};*/

module.exports = mongoose.model('DestinationSchema', DestinationSchema);
