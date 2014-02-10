var logicClass = require('./../Config/Factorys').logicFactory('ReservationLogic'),
    daoClass = require('./../Config/Factorys').daoFactory('ReservationDataMapper'),
    handleErrorStatusAndMessage = require('./../Utils/ErrorHandler').handleErrorStatusAndMessage,
    Validator = require('./Utils/RequestValidator.js'),
    validations = require('./Validations/ReservationValidation.js');

/*
        Shows the reservation associated with a realEstate (which must have been added by the user currently logged in),
    so that the user has the option of accepting/rejecting
        Receives from Query String the following parameters:
            - realEstateId
 */
//por testar
function viewReservationsOnRealEstateGET(request, response) {
    var realEstateId;
    try {
        realEstateId = Validator.validateParameters(request.query, validations.readReservationOnRealEstate).realEstateId;
    } catch(err) {
        handleErrorStatusAndMessage(response, err.status, err.message);
    }
    logicClass.validateGetAllReservationsOnRealEstate(realEstateId, request.user.username, function(err, result) {
        if(err) {
            handleErrorStatusAndMessage(response, err.status, err.message);
        } else {
            daoClass.getAllReservationsOnRealEstate(realEstateId, request.user.username, function(err, reservations) {
                if(err) {
                    handleErrorStatusAndMessage(response, err.status, err.message);
                } else {
                    response.status(200);
                    response.setHeader('content-type', 'text/html');
                    response.render('Account/Reservations', {
                                                                title: 'Reservations on real estate ' + realEstate.name,
                                                                reservations: reservations,
                                                                isLogged: request.isAuthenticated()
                                                            });
                }
            });
        }
    });
}

//por acabar
function acceptReservationsOnRealEstatePOST(request, response) {

}

//por acabar
function addReservationPOST(request, response) {

}

module.exports = {
    viewReservationsOnRealEstateGET: viewReservationsOnRealEstateGET,
    acceptReservationsOnRealEstatePOST: acceptReservationsOnRealEstatePOST,
    addReservationPOST: addReservationPOST
}