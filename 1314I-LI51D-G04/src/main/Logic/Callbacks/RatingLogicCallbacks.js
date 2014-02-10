var daoClass = require('./../../Config/Factorys').daoFactory('RatingDataMapper'),
    handleErrorStatusAndMessage = require('./../../Utils/ErrorHandler').handleErrorStatusAndMessage;

function logicAddElementCallback(err, rating, realEstate) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        daoClass.addElement(rating, realEstate, this);
    }
}

module.exports = {
    logicAddElementCallback: logicAddElementCallback
}