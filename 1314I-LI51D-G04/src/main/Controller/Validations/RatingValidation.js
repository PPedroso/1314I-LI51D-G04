var readAllRatingValidation = {
    fields: {
        realEstateId: {
            required: true
        },
        pageNr: {
            required: true
        }
    }
}


var insertRatingValidation = {
    fields: {
        author: {
            required: true
        },
        description: {
            required: true
        },
        rating: {
            required: true
        },
        date: {
            required: false,
            otherVerification: function(dateToValidate) {
                //fazer uma regex para dd-mm-yyyy
            }
        }
    }
}

module.exports = {
    readAllRatingValidation: readAllRatingValidation,
    insertRatingValidation: insertRatingValidation
}