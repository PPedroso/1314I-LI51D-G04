var async = require('async'),
    fs = require('fs');

/*
    does the whole validation on parameters, adding all the successful verifications into a new Object
    returns this new object, throws exception if any verification failed
        -> queryObject: comes from request.query or request.body
        -> validationObject: contains all the information that needs to be validated, follows the following exemple structure:
                validationObjects = {
                    fields: {
                        fieldName: {
                            required: { true, false },
                            otherVerification: function() { };
                        }
                    },
                    failureCallback: function() { } (opcional)
                }
 */
module.exports.validateParameters = function(queryObject, validationObjects) {
    return doValidations(queryObject, validationObjects, function(validationObj, field) {
        if(validationObj.otherVerification) {
            //in case they were, and it failed, an exception was thrown
            validationObj.otherVerification(field);
        }
    });
}

/*
     does the whole validation on parameters that are also files
     creates buffers for all successful validations and adds them as fields on targetObject
         -> queryObject: comes from request.files
         -> targetObject: object where files will be put as buffers
         -> callback: since this function has async operations, it also needs to be done in a async way
         -> validationObject: contains all the information that needs to be validated, follows the following example structure:

             validationObjects = {
                 fields: {
                     fieldName: {
                             required: { true, false },
                             otherVerification: function() { };
                             acceptedTypes: ['...', '....']
                         }
                 },
                 failureCallback: function() { } (opcional)
             }
 */

module.exports.validateFiles = function(queryObject, validationObjects, targetObject, callback) {

    //do the validations
    var validatedFiles = doValidations(queryObject, validationObjects, function(validationObj, field) {
        if(validationObj.acceptedTypes.indexOf(field.type) < 0) {
            throw({status: 400, message: field.type + ' is not a valid file type'});
        }
        if(validationObj.otherVerification) {
            //in case they were, and it failed, an exception was thrown
            validationObj.otherVerification(field);
        }
    });

    //Create an array of objects(fieldName, field) so it can be used with async.each to read all files in parallel
    var filesToReadArray = [];
    for(var fileWrapperIndex in validatedFiles) {
        if (validatedFiles.hasOwnProperty(fileWrapperIndex)) {
            var fileInfo = validatedFiles[fileWrapperIndex];
            filesToReadArray.push({
               name: fileInfo.fieldName,
               path: fileInfo.path,
               type: fileInfo.type
            });
        };
    }

    //read files in a async way
    async.each(filesToReadArray,
               function(fileToRead, readErrorCallback) {
                   fs.readFile(fileToRead.path, function (err, readData) {
                        if(err) {
                            readErrorCallback({status:500, message: 'A problem occurred while reading file'});
                        }

                        //add the read data as a buffer in target object
                        targetObject[fileToRead.name] = {
                            type: fileToRead.type,
                            data: new Buffer(readData,'utf8')
                        };
                        readErrorCallback(null);
                   });
               },
               function(err) {
                   //since the called of this method needs to verify error, its simply "rethrown" here
                   callback(err, targetObject);
               });
};

/*
        Since both parameter and file validation have a similar structure, besides the validation of each field in case it is found,
    that validation is delegated from them as a function named fieldSection(validationObject, fieldBeingValidated, that throws
    exception in case of failure
 */
function doValidations(queryObject, validationObjects, fieldSection) {
    //create the object where successful parameters will be added
    var newObject = { };

    //iterate over each field validationObj
    for(var validationObj in validationObjects.fields) {

        //verify if it ain't from prototype
        if (validationObjects.fields.hasOwnProperty(validationObj)) {

            //get the property from query with the same name
            var field = queryObject[validationObj];

            //if field is an empty string, it's deleted before validation
            delete queryObject[validationObj];

            //verify if it's present
            if(field && field != "") {
                //since field was found, check if other validations are necessary
                fieldSection(validationObjects.fields[validationObj], field);

                //field was valid, insert property into new object while removing from queryObject
                newObject[validationObj] = field;
                delete queryObject[validationObj];

                //verify if the field was required
            } else if(validationObjects.fields[validationObj].required) {
                throw({status: 400, message: validationObj + ' is a necessary field'});
            }
        }
    }

    //check if there's a failure callback
    if(validationObjects.failureCallback) {
        //iterate over the remaining value, and see if they pass the failureCallback... success meaning the parameter is expected
        for(var queryObj in queryObject) {
            //verify if it ain't from prototype
            if (queryObject.hasOwnProperty(queryObj)) {
                if(validationObjects.failureCallback(queryObject, queryObj)) {
                    newObject[queryObj] = queryObject[queryObj];
                }
            }
        }
    }
    return newObject;
}