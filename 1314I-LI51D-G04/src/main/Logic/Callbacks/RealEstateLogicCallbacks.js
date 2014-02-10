var daoClass = require('./../../Config/Factorys').daoFactory('RealEstateDataMapper'),
    handleErrorStatusAndMessage = require('./../../Utils/ErrorHandler').handleErrorStatusAndMessage;


function logicPhotoCallback(err, photoId) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        daoClass.getPhotoById(photoId, this);
    }
}

function logicGetElementByKeyCallback(err, realEstateId) {
    if (err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        daoClass.getElementByKey(realEstateId, this);
    }
}

function logicAddElementCallback(err, realEstate) {
    if(err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
    } else {
        daoClass.addElement(realEstate, this);
    }
}

//
//------------ Search By Location ----------------------------
//

function logicSearchByLocationCallback(err, location, pageNr) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        daoClass.getElementsByLocationWithCount(location, pageNr, this);
    }
}

function logicSearchByLocationCallbackAJAX(err, location, pageNr) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        daoClass.getElementsByLocation(location, pageNr, this);
    }
}

//
//------------ Advanced Search ----------------------------
//

function logicAdvancedSearchCallback(err, searchParams) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        daoClass.getElementsAdvancedSearchWithCount(searchParams, this);
    }
}

function logicAdvancedSearchCallbackAJAX(err, searchParams, pageNr) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        daoClass.getElementsAdvancedSearch(searchParams, this);
    }
}

module.exports = {
    logicPhotoCallback: logicPhotoCallback,
    logicGetElementByKeyCallback: logicGetElementByKeyCallback,
    logicSearchByLocationCallback: logicSearchByLocationCallback,
    logicSearchByLocationCallbackAJAX: logicSearchByLocationCallbackAJAX,
    logicAdvancedSearchCallback: logicAdvancedSearchCallback,
    logicAdvancedSearchCallbackAJAX: logicAdvancedSearchCallbackAJAX,
    logicAddElementCallback: logicAddElementCallback
}