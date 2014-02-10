var logicClass = require('./../Config/Factorys').logicFactory('RatingLogic'),
    logicCallbacks = require('./../Logic/Callbacks/RatingLogicCallbacks'),
    daoCallbacks = require('./../Model/Callbacks/RatingDaoCallbacks'),
    daoClass = require('./../Config/Factorys').daoFactory('RatingDataMapper'),
    handleErrorStatusAndMessage = require('./../Utils/ErrorHandler').handleErrorStatusAndMessage,
    Validator = require('./Utils/RequestValidator.js'),
    validations = require('./Validations/RatingValidation.js'),
    utils = require('./Utils/utils.js'),
    MVCFunctionCallback = require('./../Utils/MVCFunctionCallback');

//por testar
function getAllRatings(request, response) {
    var params;
    try {
        //a thrown exception at this point means some of the required validations failed
        params = Validator.validateParameters(request.query, validations.readAllRatingValidation);
    } catch (err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
        return;
    }
    //call logic with the following callback
    logicClass.validateGetAllElements(params.realEstateId, params.pageNr, function(err, result) {
        if(err) {
            handleErrorStatusAndMessage(response, err.status, err.message);
        } else {
            //call data-access with the following callback
            daoClass.getAllElements(params.realEstateId, params.pageNr, function(err, realEstates) {
                if(err) {
                    handleErrorStatusAndMessage(response, err.status, err.message);
                } else {
                    response.status(200);
                    response.setHeader('content-type', 'text/html');
                    response.render('/RealEstate/List', {
                                                            title: 'Real Estate from location ' + location,
                                                            realEstate: realEstates,
                                                            isLogged: request.isAuthenticated(),
                                                            isAjaxRequest: request.xhr
                                                        });
                }
            });
        }
    });
}

function addRating(request, response) {
    var params;
    try {
        //a thrown exception at this point means some of the required validations failed
        params = Validator.validateParameters(request.body, validations.insertRatingValidation);
    } catch (err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
        return;
    }
    //add the realEstateId since it comes from the URI
    params['realEstate'] = request.param("realEstateId");
    //add the current date to the params
    params['date'] = new Date();

    //verify whether it was ajax request to build the callbacks accordingly
    var functionsCallback;
    if(request.xhr) {
        functionsCallback = new MVCFunctionCallback(request, response, logicCallbacks.logicAddElementCallback, daoCallbacks.daoAddElementCallbackAJAX);
    } else {
        functionsCallback = new MVCFunctionCallback(request, response, logicCallbacks.logicAddElementCallback, daoCallbacks.daoAddElementCallback);
    }
    logicClass.validateAddElement(params, functionsCallback);
}

module.exports = {
    getAllRatings: getAllRatings,
    addRating: addRating
}

