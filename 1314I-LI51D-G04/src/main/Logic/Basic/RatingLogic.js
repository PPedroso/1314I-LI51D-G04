var realEstateDao = require('./../../Config/Factorys').daoFactory('RealEstateDataMapper'),
    utilFunctions = require('./../Utils/Utils.js'),
    ValidateLogicObj = require('./../Utils/ValidateLogicObj');;

function validateGetAllElements(realEstateId, pageNr, functionCallbacks) {
    if(!utilFunctions.isPositiveInteger(pageNr)) {
        functionCallbacks.logicCallback.call(functionCallbacks, { status: 400, message: 'The page nr must be a number higher then 0'});
    } else {
        //verify whether the real estate exists and in case it does, use it to store the element
        verifyRealEstateExistence(realEstateId,
                                  function(err) {
                                      functionCallbacks.logicCallback.call(functionCallbacks, err);
                                  },
                                  function(realEstate) {
                                      functionCallbacks.logicCallback.call(functionCallbacks, null, pageNr, realEstate);
                                  });
    }
}

var addRatingValidations = {
    'realEstate': new ValidateLogicObj('The provided Real Estate id isn\'t valid, it must contain 24character\'s', function(strToCompare) {
        return strToCompare.length == 24;
    }),
    'rating': new ValidateLogicObj('A rating between 1-5 must be present', function(numberToCompare) {
        return utilFunctions.isIntegerBetweenValues(numberToCompare, 1, 5);
    }),
    'author': new ValidateLogicObj('The author\'s name can only contain numbers and letter', utilFunctions.isLetterAndNumber)
}

function validateAddElement(rating, functionsCallback) {
    var err = null;
    for(var toValidate in addRatingValidations) {
        if(!addRatingValidations[toValidate].validate(rating[toValidate])) {
            err = { status: '404', message: addRatingValidations[toValidate].errorMessage };
            break;
        }
    }
    if(err) {
        functionsCallback.logicCallback.call(functionsCallback, err);
    } else {
        //verify whether the real estate exists
        verifyRealEstateExistence(rating['realEstate'],
                                  function(err) {
                                      functionsCallback.logicCallback.call(functionsCallback, err);
                                  },
                                  function(realEstate) {
                                      functionsCallback.logicCallback.call(functionsCallback, null, rating, realEstate);
                                  });
    }
}

function verifyRealEstateExistence(realEstateId, errorCallback, successCallback) {
    realEstateDao.getElementByKey(realEstateId, { daoCallback: function(err, realEstate) {
        if(err) {
            errorCallback({ status: 500, message: 'An error ocurred while doing the necessary verifications' });
        } else if(!realEstate) {
            errorCallback({ status: 400, message: 'The provided real estate id does not exist' });
        } else {
            successCallback(realEstate);
        }
    }});
}

module.exports =  {
    validateGetAllElements: validateGetAllElements,
    validateAddElement: validateAddElement
}


