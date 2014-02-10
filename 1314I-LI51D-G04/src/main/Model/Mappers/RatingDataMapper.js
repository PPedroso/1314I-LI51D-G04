var RealEstate = require('./../DBModels/RealEstate'),
    async = require('async');

function getAllElements(realEstateId, pageNr, callback) {

}

function addElement(rating, realEstate, functionCallbacks) {
    //remove realEstate parameter since it ain't necessary
    delete rating['realEstate'];

    //calculate new average -> ((old average * totalElements) + new rating) / totalElements + 1
    var newAverage = (+(((realEstate.ratings.average == Infinity) ? 0 : realEstate.ratings.average)  * realEstate.ratings.list.length) +
                      +rating.rating) / (+realEstate.ratings.list.length + 1);

    //update average and add rating
    RealEstate.update({ _id: realEstate._id },
                      { '$set': { 'ratings.average': newAverage },
                        '$push': { 'ratings.list': rating }},
                      function(err) {
                          if(err) {
                              functionCallbacks.daoCallback.call(functionCallbacks, { status: 500, message: 'An unexpected error occurred while adding the new rating'});
                          } else {
                              functionCallbacks.daoCallback.call(functionCallbacks, null, realEstate, rating, newAverage);
                          }
                      });
}

module.exports = {
    getAllElements: getAllElements,
    addElement: addElement
}