var utilFunctions = require('./../Utils/Utils.js'),
    ValidateLogicObj = require('./../Utils/ValidateLogicObj');

function validateGetPhotoById(photoId, functionsCallback) {
    if(photoId.length != 24) {
        functionsCallback.logicCallback.call(functionsCallback, { status: 400, message: 'the given photoId is not valid'});
    } else {
        functionsCallback.logicCallback.call(functionsCallback, null, photoId);
    }
}

function validateGetElementByKey(realEstateId, functionsCallback) {
    if(realEstateId.length != 24) {
        functionsCallback.logicCallback.call(functionsCallback, { status: 400, message: 'the given real estate Id is not valid'});
    } else {
        functionsCallback.logicCallback.call(functionsCallback, null, realEstateId);
    }
}

function validateSearchByLocation(location, pageNr, functionCallbacks) {
    //verify that pageNumber is a integer equal or higher then 0
    if(!utilFunctions.isPositiveInteger(pageNr)) {
        functionCallbacks.logicCallback.call(functionCallbacks, { status: 400, message: 'the page number must be a positive number (excluding 0 and numbers with decimal section)'});
    }
    //verify that location is valid -> since it might be possible to avoid a unnecessary DAO operation
    else if(!utilFunctions.isLetterAndNumberAllowSpaces(location.toString())) {
        functionCallbacks.logicCallback.call(functionCallbacks, { status: 400, message: 'a location can only contain the following characters: numbers/letters/space'});
    }
    else functionCallbacks.logicCallback.call(functionCallbacks, null, location, pageNr);
}

var possibleOrderByValues = ['name', 'location', 'minPrice', 'maxPrice', 'minCapacity', 'maxCapacity'];
var advancedSearchValidations = {
    'minCapacity': new ValidateLogicObj('Minimum capacity value must be 1 or higher', utilFunctions.isPositiveInteger),
    'maxCapacity': new ValidateLogicObj('Maximum capacity value must be 1 or higher', utilFunctions.isPositiveInteger),
    'minPrice': new ValidateLogicObj('Minimum price must be 1 or higher', utilFunctions.isPositiveInteger),
    'maxPrice': new ValidateLogicObj('Maximum price must be 1 or higher', utilFunctions.isPositiveInteger),
    'location': new ValidateLogicObj('Locations can only only be composed by letter', utilFunctions.isLetterAllowSpaces),
    'name': new ValidateLogicObj('Name can only contain letter and numbers', utilFunctions.isLetterAndNumberAllowSpaces),
    'pageNr': new ValidateLogicObj('Page number must be 1 or higher', utilFunctions.isPositiveInteger)
}
function validateAdvancedSearch(parameters, functionsCallback) {
    var err = utilFunctions.runValidations(parameters, advancedSearchValidations);
    if(err) {
        functionsCallback.logicCallback.call(functionsCallback, err);
    } else if(!possibleOrderByValues.indexOf(parameters.orderBy)) {
       functionsCallback.logicCallback.call(functionsCallback, { status: 400, message: 'real estates can only be ordered by: name, location, minPrice and maxPrice'});
    } else if(!(utilFunctions.verifyIfHigher(parameters['maxPrice'], ['minPrice']) && utilFunctions.verifyIfHigher(parameters['maxCapacity'], ['minCapacity']))) {
        functionsCallback.logicCallback.call(functionsCallback, { status: 400, message: 'the maximum values must be higher then the minimum values'});
    } else {
        functionsCallback.logicCallback.call(functionsCallback, null, parameters);
    }
}

//
// ----------------------- Add Real Estate Validations --------------------------
//

var addRealEstateValidations = {
    'name': new ValidateLogicObj('A Real Estate must contain a name with only letters or number', utilFunctions.isLetterAndNumberAllowSpaces),
    'capacity': new ValidateLogicObj('A Real Estate must have a minimum \"capacity\" of 1', utilFunctions.isPositiveInteger),
    'dimension': new ValidateLogicObj('A Real Estate must have a minimum of 30 square meters of dimension', function(dim) {
        return utilFunctions.isIntegerHigherThen(dim, 30);
    }),
    'numberRooms': new ValidateLogicObj('A Real Estate cannot have a negative number of rooms', utilFunctions.isPositiveIntegerAllowZero),
    'numberDivisions': new ValidateLogicObj('A Real Estate must have at least 1 division', utilFunctions.isPositiveInteger),
    'weeklyPrice': new ValidateLogicObj('A Real Estate rent must have a weekly price higher then 0', utilFunctions.isPositiveInteger),
    'locName': new ValidateLogicObj('A location does not have numbers', utilFunctions.isLetterAllowSpaces),
    'latitude': new ValidateLogicObj('Latitude\'s value must be between -90.0 and 90.0', function(lat) {
        return utilFunctions.isBetweenValues(lat, -90.0, 90.0);
    }),
    'longitude': new ValidateLogicObj('Longitude\'s value must be between -180.0 and 180.0', function(long) {
        return utilFunctions.isBetweenValues(long, -180.0, 180.0);
    })
}

function validateAddElement(realEstate, functionsCallback) {
    var err = utilFunctions.runValidations(realEstate, addRealEstateValidations);
    functionsCallback.logicCallback.call(functionsCallback, err, realEstate);
}


module.exports = {
    validateGetPhotoById: validateGetPhotoById,
    validateGetElementByKey: validateGetElementByKey,
    validateSearchByLocation: validateSearchByLocation,
    validateAdvancedSearch: validateAdvancedSearch,
    validateAddElement: validateAddElement
}