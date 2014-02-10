var readRealEstateByKeyValidation = {
    fields: {
        realEstateId: {
            required:true
        }
    }
};

var readRealEstateByLocationValidation = {
    fields: {
        location: {
            required:true
        },
        pageNr: {
            required:true
        }
    }
};

//-------------- Advanced Search Validation ----------------

var readRealEstateAdvancedSearchValidation = {
    fields: {
        orderBy: {
            required: true
        }
    }
};

var searchFields = readRealEstateAdvancedSearchValidation.fields;
['pageNr', 'name', 'location', 'minPrice', 'maxPrice', 'availableOnly', 'minCapacity', 'maxCapacity'].forEach(function(nameField) {
    searchFields[nameField] = { required: false };
});

//-------------- Add RealEstate Parameter Validation ----------------

var insertRealEstateValidation = {
    parameters: {
        fields: { }
    },
    files: {
        fields: {
            photo0: {
                required:true,
                acceptedTypes: ['image/png','image/jpeg']
            }
        },
        failureCallback: function(queryParametersObject, fieldName) {
            var file = queryParametersObject[fieldName];
            if(!/photo+[1-9]+[0-9]?/.test(fieldName)) {
                return false;
            }
            return file.type === 'image/png' || file.type === 'image/jpeg';
        }
    }
};

var insertFields = insertRealEstateValidation.parameters.fields;
['name', 'description', 'capacity', 'dimension', 'numberRooms', 'numberRooms', 'numberDivisions', 'weeklyPrice', 'locName',
    'latitude', 'longitude'].forEach(function(nameField) {
        insertFields[nameField] = { required: true };
    });


module.exports = {
    insertRealEstateValidations: insertRealEstateValidation,
    readRealEstateByKeyValidation: readRealEstateByKeyValidation,
    readRealEstateByLocationValidation: readRealEstateByLocationValidation,
    readRealEstateAdvancedSearchValidation: readRealEstateAdvancedSearchValidation
}




