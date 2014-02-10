var handleErrorStatusAndMessage = require('./../../Utils/ErrorHandler').handleErrorStatusAndMessage;

function daoAddElementCallback(err, realEstate) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        this.response.status(303);
        this.response.setHeader("Location", '/realEstates/realEstate?realEstateId=' + realEstate._id);
        this.response.end();
    }
}

function daoAddElementCallbackAJAX(err, realEstate, rating, newAverage) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        //otherwise the answer will be the rating object and new average
        this.response.status(200);
        this.response.setHeader('Content-type', 'application/json; charset=utf-8');
        this.response.end(JSON.stringify({ newAverage: newAverage, rating: rating}));
    }
}

module.exports = {
    daoAddElementCallback: daoAddElementCallback,
    daoAddElementCallbackAJAX: daoAddElementCallbackAJAX
}