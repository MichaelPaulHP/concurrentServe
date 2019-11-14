const DestinationSchema = require("./Schemas/DestinationSchema");
const MAX_DISTANCE = 100;

class DestinationSearcher {

    constructor() {

    }

    static async findDestination(origin, destination) {
        try {
            let destinatios = DestinationSearcher.findDestinationByDistance
            (
                origin,
                MAX_DISTANCE,
                destination,
                MAX_DISTANCE
            );
            return destinatios;

        } catch (e) {
            throw e;
        }
    }

    static async findDestinationByDistance(origin,
                                 distanceOrigin,
                                 destination,
                                 distanceDestination) {
        let conditions={
            $and:
                [
                    {
                        destinationPoint:
                            getQueryToFindByPoint(
                                destination.latitude,
                                destination.longitude,
                                distanceDestination
                            )
                    }, {
                    originPoint:
                        getQueryToFindByPoint(
                            origin.latitude,
                            origin.longitude,
                            distanceOrigin
                        )
                }
                ]
        };
        let conditionAggregate=
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [ destination.longitude , destination.latitude ] },
                    distanceField: "dist.calculated",
                    maxDistance: MAX_DISTANCE,
                    query: { isActive: true },
                    spherical: true,
                    key: "destinationPoint",
                }
            }

        ;
        let conditionsAggregateOrigin=
            {
                $match: {
                    originPoint:
                        getQueryToFindByPoint(
                            origin.latitude,
                            origin.longitude,
                            distanceOrigin
                        )
                }
            }
        ;
        try {

            //let destinations = await DestinationSchema.find(conditions);
            let destinations = await DestinationSchema.aggregate([conditionAggregate,conditionsAggregateOrigin]);
            return destinations;
        } catch (e) {
            throw e;
        }
    }
}
function getQueryToFindByPoint(latitude,longitude,maxDistance){
    return {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
        }
    };
}

module.exports = DestinationSearcher;
