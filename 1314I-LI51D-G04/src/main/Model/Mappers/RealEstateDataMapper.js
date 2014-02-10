var RealEstate = require('./../DBModels/RealEstate.js'),
    Photo = require('./../DBModels/Photo.js'),
    ObjectId = require('mongoose').Types.ObjectId,
    async = require('async'),
    advancedSearchQueryRestriction = require('./../Utils/AdvancedSearchQueryRestrictions');

function getPhotoById(photoId, functionsCallback) {
    Photo.findOne({ '_id' : new ObjectId(photoId)}, function(err, photo) {
        if(err) {
            functionsCallback.daoCallback.call(functionsCallback, {status: 500, message: 'An error occurred while reading the requested photo'});
        } else if(!photo) {
            functionsCallback.daoCallback.call(functionsCallback, {status: 400, message: 'The requested photo does not exist'});
        } else {
            functionsCallback.daoCallback.call(functionsCallback, null, photo);
        }
    })
}

function getElementByKey(realEstateId, functionsCallback) {
    RealEstate.findOne({ '_id' :  new ObjectId(realEstateId)}, function(err, realEstate) {
        if(err) {
            functionsCallback.daoCallback.call(functionsCallback, {status: 500, message: 'Failed to read the real estate with the given key'});
        } else {
            functionsCallback.daoCallback.call(functionsCallback, null, realEstate);
        }
    });
}

//
// -------------------------------------- Search By Location ---------------------------
//
{
    function getElementsByLocation(location, pageNr, functionsCallback) {
        getResultsSearchByLocation(location, pageNr, function(err, realEstates) {
            if(err) {
                functionsCallback.daoCallback.call(functionsCallback, {status:500, message: 'Failed to read all the elements from the given location'});
            } else {
                functionsCallback.daoCallback.call(functionsCallback, null, realEstates);
            }
        });
    }

    function getElementsByLocationWithCount(location, pageNr, functionsCallback) {
        var ret =  { };
        async.each([function(asyncCallback) {
                    getResultsSearchByLocation(location, pageNr, function(err, realEstate) {
                        dealWithErrorSearchByLocation(err,
                            function() { ret['list'] = realEstate; },
                            asyncCallback);
                        }
                    )},
                    function(asyncCallback) {
                        getTotalCountSearchByLocation(location, function(err, count) {
                            dealWithErrorSearchByLocation(err,
                                function() { ret['count'] = count; },
                                asyncCallback);
                        }
                    )}],
                    function(entry, errorCallback) {
                        entry(errorCallback);
                    },
                    function(err) {
                        functionsCallback.daoCallback.call(functionsCallback, err, ret, location, pageNr);
                    });
    }


    function dealWithErrorSearchByLocation(err, successCallback, endingCallback) {
        if(err) {
            endingCallback({status:500, message: 'Failed to read all the elements from the given location'});
        } else {
            successCallback();
            endingCallback(null);
        }
    }

    function getTotalCountSearchByLocation(location, callback) {
        RealEstate.find()
                  .where('location.locName').regex(new RegExp(location, 'i'))
                  .count(function(err, count) {
                        callback(err, count);
                  });
    }

    function getResultsSearchByLocation(location, pageNr, callback) {
        var nrElementsToSkip = (pageNr - 1) * 5;
        RealEstate.find()
                  //almost all fields, but return a single photo and no ratings
                  .select({ 'name' : 1, 'capacity' : 1, 'numberRooms': 1, 'location' : 1, 'weeklyPrice' : 1,
                            'photos' : { $slice : 1}, 'reservations' : 1, 'ratings.average': 1})
                  .where('location.locName').regex(new RegExp(location, "i"))
                  .limit(5)
                  .skip(nrElementsToSkip)
                  .sort(({date: -1}))
                  .exec(function(err, realEstates) {
                      callback(err, realEstates);
                  });
    }
}
//
// -------------------------------------- Advanced Search ---------------------------
//
{
    advancedSearchQueryRestriction
    function getElementsAdvancedSearch(searchParameters, functionsCallback) {
        getResultsAdvancedSearch(searchParameters, function(err, realEstates) {
            if(err) {
                functionsCallback.daoCallback.call(functionsCallback, {status:500, message: 'Failed to read all the elements from the given restrictions'});
            } else {
                functionsCallback.daoCallback.call(functionsCallback, null, realEstates, searchParameters);
            }
        })
    }

    function getElementsAdvancedSearchWithCount(searchParameters, functionsCallback) {
        var ret = { };
        async.each([function(asyncCallback) {
                        getResultsAdvancedSearch(searchParameters, function(err, realEstates) {
                            dealWithErrorAdvancedSearch(err,
                                                        function() { ret['list'] = realEstates},
                                                        asyncCallback);
                        })
                    },
                    function(asyncCallback) {
                        getTotalCountAdvancedSearch(searchParameters, function(err, count) {
                            dealWithErrorAdvancedSearch(err,
                                                        function() { ret['count'] = count },
                                                        asyncCallback);
                        })
                    }],
                    function(entry, asyncCallback) {
                        entry(asyncCallback);
                    },
                    function(err) {
                        functionsCallback.daoCallback.call(functionsCallback, err, ret, searchParameters);
                    });
    }


    function dealWithErrorAdvancedSearch(err, successCallback, endingCallback) {
        if(err) {
            endingCallback({status:500, message: 'Failed to read all the elements from the given advanced search'});
        } else {
            successCallback();
            endingCallback(null);
        }
    }

    function getResultsAdvancedSearch(objWithRestrictions, callback) {
        var nrElementsToSkip = (objWithRestrictions['pageNr'] - 1) * 5;

        var query = RealEstate.find({})
                               //almost all fields, but return a single photo and no ratings
                               .select({ 'name' : 1, 'capacity' : 1, 'numberRooms': 1, 'location' : 1, 'weeklyPrice' : 1,
                                         'photos' : { $slice : 1}, 'reservations' : 1, 'ratings.average': 1});

        //place the "where" restrictions
        advancedSearchQueryRestriction.placeWhereRestrions(objWithRestrictions, query);

        //pagination related restrictions
        query.limit(5)
             .skip(nrElementsToSkip);

        //place the "sort" restriction
        advancedSearchQueryRestriction.placeSortRestriction(objWithRestrictions, query);

        //callback
        query.exec(function(err, realEstates) {
                       callback(err, realEstates);
                   });
    }

    function getTotalCountAdvancedSearch(objWithRestrictions, callback) {
        var query = RealEstate.find()
        //place the "where" restrictions
        advancedSearchQueryRestriction.placeWhereRestrions(objWithRestrictions, query);

        //callback
        query.count(function(err, count) {
            callback(err, count);
        });
    }
}

// ----------------------------------  Search by reservation author and owner -----------------------------

{
    function getPendingBookingsByAuthor(user,callback){
        RealEstate
            .aggregate(
            {$unwind: '$reservations' },
            {$match : {
                'reservations.author':user,
                'reservations.finalized':"Pending"
            }
            },

            { $group : {  _id: "$_id",
                name: {$addToSet : "$name"},
                photos: {$addToSet : "$photos"},
                reservations: { $addToSet : "$reservations" }}})
            .exec(function(err, result) {
                callback(err,result);
            });
    }

    function getRealEstatesByAuthor(user,callback) {
        realEstateList = RealEstate.find({'owner' : user})
                                   .exec(function(err,realEstateList){
                                       callback(err,realEstateList);
                                   });
    }

    function getBookedRealEstatesByAuthor(user,callback){
        RealEstate
            .aggregate(
            {$unwind: '$reservations' },
            {$match : {
                'reservations.author':user}
            },

            { $group : {  _id: "$_id",
                name: {$addToSet : "$name"},
                photos: {$addToSet : "$photos"},
                reservations: { $addToSet : "$reservations" }}})
            .exec(function(err, result) {
                callback(err,result);
            });
    }

    function getRealEstatesAndReservationsByAuthor(user,functionsCallback) {
        var wrapper = {};
        async.each([function(asyncCallback){
                        getRealEstatesByAuthor(user,function(err,list){
                            if(err) {
                                asyncCallback({status: 500, message: 'Unexpected error while reading the user real estates'});
                            } else {
                                wrapper.realEstateList = list;
                                asyncCallback(null);
                            }
                        })
                    },
                    function(asyncCallback){
                            getBookedRealEstatesByAuthor(user,function(err,list){
                                if(err) {
                                    asyncCallback({status: 500, message: 'Unexpected error while reading the user reservations'});
                                } else {
                                    wrapper.realEstateBookingList = list;
                                    asyncCallback(null);
                                }
                        })
                    }],
                    function(entry,asyncCallback){
                        entry(asyncCallback);
                    },
                    function(err){
                        functionsCallback.daoCallback.call(functionsCallback, null,wrapper);
                    });
    }
}

//
// -------------------------------------- Add Real Estate section ---------------------------
//
{
    function addElement(realEstate, functionsCallback) {
        //fill parameters
        var newRealEstate = createModelRealEstate(realEstate);
        //save the realEstate
        newRealEstate.save(function(err, insertedRealEstate) {
            if (err) {
                functionsCallback.daoCallback.call(functionsCallback, {status: 500, message: 'Failed to add the real estate'})
            } else {
                //create an array of Photo elements containing all photo properties in realEstate (parameter of addElement)
                var photoElements = prepareModelPhotoElements(insertedRealEstate._id, realEstate);
                //save all the photos (async.each instead of Photo.create is used so we can have some control about which of them succeeded)
                async.each(photoElements,
                    function(photo, errorCallback) {
                        photo.save(function(err, addedPhoto) {
                            //error's are ignored so that the rest of photo's are added
                            errorCallback(null);
                        })
                    },
                    function(err) {
                        addPhotosToRealEstate(insertedRealEstate, photoElements, functionsCallback);
                    });
            }
        });
    }

    function addPhotosToRealEstate(realEstateDB, photoElements, functionsCallback) {
        var photosID = photoElements.map(function(photoElement) {
            return photoElement._id;
        });
        RealEstate.update({_id: realEstateDB._id},
            {$pushAll: {"photos": photosID}},
            function(err) {
                if (err) {
                    functionsCallback.daoCallback.call(functionsCallback, { status: 500, message: 'Error occurred while adding photos'});
                } else {
                    functionsCallback.daoCallback.call(functionsCallback, null, realEstateDB);
                }
            });
    }


    function prepareModelPhotoElements(realEstateId, realEstateWithPhoto) {
        var photoElements = [];
        for(var parameter in realEstateWithPhoto) {
            if(parameter.indexOf('photo') != -1) {
                var photo = new Photo();
                photo.realEstate = realEstateId;
                photo.photo = realEstateWithPhoto[parameter].data;
                photo.type = realEstateWithPhoto[parameter].type;
                photoElements.push(photo);
            }
        }
        return photoElements;
    }


//  ------------------------ Bookings -----------------------

    function updateBookingStatusById(objectId,user,status,functionsCallback){
        RealEstate.update(
            {_id: objectId,'reservations.author': user},
            {$set:{
                "reservations.$.finalized": status
            }
            },
            function(err){
                if(err)
                    functionsCallback({status: 500, message: 'Error occurred while updating status'});
                else{
                    functionsCallback(null);
                }
            }
        );
    }


    function createModelRealEstate(realEstate) {
        var newRealEstate = new RealEstate();
        newRealEstate.owner = realEstate.owner;
        newRealEstate.date = realEstate.date;
        newRealEstate.name = realEstate.name;
        newRealEstate.description = realEstate.description;
        newRealEstate.capacity = realEstate.capacity;
        newRealEstate.dimension = realEstate.dimension;
        newRealEstate.numberDivisions = realEstate.numberDivisions;
        newRealEstate.numberRooms = realEstate.numberRooms;
        newRealEstate.weeklyPrice = realEstate.weeklyPrice;
        newRealEstate.location.locName = realEstate.locName;
        newRealEstate.location.latitude = realEstate.latitude;
        newRealEstate.location.longitude = realEstate.longitude;
        return newRealEstate;
    }
}

module.exports = {
    getPhotoById: getPhotoById,
    getElementByKey: getElementByKey,
    getElementsByLocation: getElementsByLocation,
    getElementsByLocationWithCount: getElementsByLocationWithCount,
    getElementsAdvancedSearch: getElementsAdvancedSearch,
    getElementsAdvancedSearchWithCount: getElementsAdvancedSearchWithCount,
    getRealEstatesAndReservationsByAuthor: getRealEstatesAndReservationsByAuthor,
    getPendingBookingsByAuthor:getPendingBookingsByAuthor,
    updateBookingStatusById:updateBookingStatusById,
    addElement: addElement

}




