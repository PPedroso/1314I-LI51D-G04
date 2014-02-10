function runValidations(params, validationObjects) {
    for(var toValidate in validationObjects) {
        if(params[toValidate] && !validationObjects[toValidate].validate(params[toValidate].toString())) {
            return { status: '404', message: validationObjects[toValidate].errorMessage };
        }
    }
    return null;
}


//
// ---------------------------------Numeric Validations------------------------------------------
//

function verifyIfHigher(higherValue, smallerValue) {
    if(!parseFloat(higherValue) || !parseFloat(smallerValue) || higherValue > smallerValue) {
        return true;
    }
    return false;
}

function isBetweenValues(numberToCompare, minValue, maxValue) {
    return !isNaN(parseFloat(numberToCompare)) && numberToCompare > minValue && numberToCompare < maxValue;
}

/*
    verifies whether a string is a positive number (excluding 0) without floating point
         !isNaN(parseFloat(number)) -> removes pure strings
         0 < ~~number -> removes floating point and verifies whether its higher then 0
 */
function isIntegerBetweenValues(numberToCompare, minValue, maxValue) {
    return 0 === numberToCompare % (!isNaN(parseFloat(numberToCompare)) && ~~numberToCompare >= minValue && maxValue >= ~~numberToCompare);
}

function isPositiveInteger(numberToCompare) {
    return 0 === numberToCompare % (!isNaN(parseFloat(numberToCompare)) && 0 < ~~numberToCompare);
}

function isPositiveIntegerAllowZero(numberToCompare) {
    return 0 === numberToCompare % (!isNaN(parseFloat(numberToCompare)) && 0 <= ~~numberToCompare);
}

//similar to previous method but receives an input parameter to what is the minimum value
function isIntegerHigherThen(numberToCompare, minValue) {
    return 0 === numberToCompare % (!isNaN(parseFloat(numberToCompare)) && minValue <= ~~numberToCompare);
}



//
// ------------------------------------Regex Validations------------------------------------------
//

function isLetterAllowSpaces(stringToCompare) {
    return /^[A-Za-z][A-Za-z ]*$/.test(stringToCompare);
}

//the following two functions, verify whether a string only contains letter and/or number
function isLetterAndNumberAllowSpaces(stringToCompare) {
    return /^[A-Za-z0-9][A-Za-z0-9 ]*$/.test(stringToCompare);
}

function isLetterAndNumber(stringToCompare) {
    return /^[A-Za-z0-9]+$/.test(stringToCompare);
}

module.exports = {
    runValidations: runValidations,
    verifyIfHigher: verifyIfHigher,
    isBetweenValues: isBetweenValues,
    isIntegerBetweenValues: isIntegerBetweenValues,
    isPositiveInteger: isPositiveInteger,
    isPositiveIntegerAllowZero: isPositiveIntegerAllowZero,
    isIntegerHigherThen: isIntegerHigherThen,
    isLetterAllowSpaces: isLetterAllowSpaces,
    isLetterAndNumber: isLetterAndNumber,
    isLetterAndNumberAllowSpaces: isLetterAndNumberAllowSpaces
}