var RealEstate = require("./../Model/DBModels/RealEstate.js"),
    async = require('async'),
    handleErrorStatusAndMessage = require('./../Utils/ErrorHandler').handleErrorStatusAndMessage;

function index(request, response) {
    var result = {
        newQuery: [],
        topQuery: []
    }

        async.each(
            [function(callback) {
                RealEstate.find()
                    .select({ 'name' : 1,'location' : 1, _id: 1,
                        'photos' : { $slice : 1}, 'ratings.average': 1})
                    .limit(5)
                    .sort(({rating: -1}))
                    .exec(function(err, realEstates) {
                        if(err) {
                            callback({status:500, message: 'Failed to read all the elements from the given location'});
                        } else {
                            result.topQuery = realEstates;
                            callback(null);
                        }
                    });
            },
            function(callback) {

                RealEstate.find()
                    .select({ 'name' : 1,'location' : 1, _id: 1,
                        'photos' : { $slice : 1}, 'ratings.average': 1})
                    .limit(5)
                    .sort(({date: -1}))
                    .exec(function(err, realEstates) {
                        if(err) {
                            callback({status:500, message: 'Failed to read all the elements from the given location'});
                        } else {
                            result.newQuery = realEstates;
                            callback(null);
                        }
                    });
            }],
            function(entry,asyncCallback) {
                entry(asyncCallback);
            }
            ,
            function(err) {
                if(err)handleErrorStatusAndMessage(response,err.status,err.message) ;
                else {
                    response.status(200);
                    response.render('Home/Index', {
                    title: 'RealEstate',
                    isLogged: request.isAuthenticated(),
                    newQueryStates: result.newQuery,
                    topQueryStates: result.topQuery
                    });
                }
            }
        );
}

module.exports = {
    index: index
}