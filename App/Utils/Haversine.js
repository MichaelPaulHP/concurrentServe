'use strict';
const  UNIT_MILES=3960;
const UNIT_KILOMETERS = 6373;
class TurfConversion{

    static degreesToRadians(degrees){
        let radians = degrees % 360;
        return radians * Math.PI / 180;
    }
    static radiansToLength(radians,units){
        return radians * units;
    }

}

class Haversine{

    /**
     * Calculates the distance between two points in kilometers. This uses the Haversine formula to
     * account for global curvature
     * */
    static distance(latA,lngA,latB,lngB){

        let difLat=TurfConversion.degreesToRadians(latA-latB);
        let difLon=TurfConversion.degreesToRadians(lngA-lngB);

        let lat1 = TurfConversion.degreesToRadians(latA);
        let lat2 = TurfConversion.degreesToRadians(latB);
        let value = Math.pow(Math.sin(difLat / 2), 2)
            + Math.pow(Math.sin(difLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        return TurfConversion.radiansToLength(
            2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)), UNIT_KILOMETERS);

    }

    // Todo: get a point gq to point
}

module.exports=Haversine;
