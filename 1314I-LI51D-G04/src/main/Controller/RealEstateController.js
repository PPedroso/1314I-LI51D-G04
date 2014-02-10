var logicClass = require('./../Config/Factorys').logicFactory('RealEstateLogic'),
    logicCallbacks = require('./../Logic/Callbacks/RealEstateLogicCallbacks'),
    daoCallbacks = require('./../Model/Callbacks/RealEstateDaoCallbacks'),
    handleErrorStatusAndMessage = require('./../Utils/ErrorHandler').handleErrorStatusAndMessage,
    Validator = require('./Utils/RequestValidator.js'),
    validations = require('./Validations/RealEstateValidation.js'),
    MVCFunctionCallback = require('./../Utils/MVCFunctionCallback');

/*
     Returns a requestedPhoto, has no view associated with it
     Must receive form Query String the following parameter:
         - photoId
 */
function realEstatePhoto(request, response) {
    var photoID = request.query.photoId;
    if(!photoID) {
        handleErrorStatusAndMessage(response, 400, 'To read a photo, photoId is a necessary query string parameter');
    } else {
        logicClass.validateGetPhotoById(photoID,
                                        new MVCFunctionCallback(request,
                                                                response,
                                                                logicCallbacks.logicPhotoCallback,
                                                                daoCallbacks.daoPhotoCallback));
    }
}

/*
    Shows all the information belonging to a realEstate (including a page of comments)
    Must receive form Query String the following parameter:
        - realEstateId
 */
function realEstateByKeyGET(request, response) {
    var realEstateId;
    try {
        realEstateId = Validator.validateParameters(request.query, validations.readRealEstateByKeyValidation).realEstateId;
    } catch(err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
        return;
    }
    logicClass.validateGetElementByKey(realEstateId,
                                       new MVCFunctionCallback(request,
                                                               response,
                                                               logicCallbacks.logicGetElementByKeyCallback,
                                                               daoCallbacks.daoGetElementByKeyCallback));

}

/*
    Shows a portion (depending on page number) of all the real estates that are from the specified location
    Must receive form Query String the following parameter:
        - location
        - pageNr
 */
function searchByLocationGET(request, response) {
    var params;
    try {
        params = Validator.validateParameters(request.query, validations.readRealEstateByLocationValidation);
    } catch(err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
        return;
    }
    var callbackFunctions;
    if(request.xhr) {
        callbackFunctions = new MVCFunctionCallback(request, response, logicCallbacks.logicSearchByLocationCallbackAJAX,
                                                    daoCallbacks.daoSearchByLocationAJAX);
    } else {
        callbackFunctions = new MVCFunctionCallback(request, response, logicCallbacks.logicSearchByLocationCallback,
                                                    daoCallbacks.daoSearchByLocation);
    }
    logicClass.validateSearchByLocation(params.location, params.pageNr, callbackFunctions);
}

function advancedSearchRealEstatesGET(request, response) {
    //in case no pageNr was present,
    if(request.query.pageNr) {
        advancedSearch(request, response);
    } else {
        advancedSearchOnlyForm(request, response);
    }
}

function advancedSearchOnlyForm(request, response) {
    response.status(200);
    response.setHeader('Content-type', 'text/html');
    response.render('RealEstate/AdvancedSearchFormOnly', {
        title: 'Real Estate Advanced Search',
        searchParameters: { 'orderBy' : 'location' },
        isLogged: request.isAuthenticated()
    });
}

function advancedSearch(request, response) {
    var params;
    try {
        //a thrown exception at this point means some of the required validations failed
        params = Validator.validateParameters(request.query, validations.readRealEstateAdvancedSearchValidation);
    } catch(err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
        return;
    }
    var callbackFunctions;
    if(request.xhr) {
        callbackFunctions = new MVCFunctionCallback(request, response, logicCallbacks.logicAdvancedSearchCallbackAJAX,
            daoCallbacks.daoAdvancedSearchAJAX);
    } else {
        callbackFunctions = new MVCFunctionCallback(request, response, logicCallbacks.logicAdvancedSearchCallback,
            daoCallbacks.daoAdvancedSearch);
    }
    logicClass.validateAdvancedSearch(params, callbackFunctions);
}

function addRealEstatePOST(request, response) {
    var successValidationCallback = function(err, validatedParams) {
        if(err) {
            handleErrorStatusAndMessage(response, err.status, err.message);
        } else {
            //add current user and date to parameters
            validatedParams['date'] = new Date();
            if(request.user)
                validatedParams['owner'] = request.user.username;
            else
                validatedParams['owner'] = "Pedro"; //Fins de debug
            logicClass.validateAddElement(validatedParams,
                                          new MVCFunctionCallback(request,
                                                                  response,
                                                                  logicCallbacks.logicAddElementCallback,
                                                                  daoCallbacks.daoAddElementCallback));
        }
    };

    /*
            this separation is made, to try making clear the exception can only be thrown before the async section(reading the photo files)
         starts, after that, any error will be dealt with by the callback function above
     */
    try{
        var params = Validator.validateParameters(request.body, validations.insertRealEstateValidations.parameters);
        Validator.validateFiles(request.files, validations.insertRealEstateValidations.files, params, successValidationCallback);
    } catch(err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
    }
}

module.exports = {
    realEstatePhoto: realEstatePhoto,
    searchByLocationGET: searchByLocationGET,
    advancedSearchRealEstatesGET: advancedSearchRealEstatesGET,
    realEstateByKeyGET: realEstateByKeyGET,
    addRealEstatePOST: addRealEstatePOST
}
