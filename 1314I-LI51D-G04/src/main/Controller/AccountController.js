var daoClass = require('./../Config/Factorys').daoFactory('RealEstateDataMapper'),
    daoCallbacks = require('./../Model/Callbacks/RealEstateDaoCallbacks'),
    MVCFunctionCallback = require('./../Utils/MVCFunctionCallback');

function index(request, response) {
    daoClass.getRealEstatesAndReservationsByAuthor(request.user.username,
                                                   new MVCFunctionCallback(request,
                                                                           response,
                                                                           null,
                                                                          daoCallbacks.getRealEstatesAndReservationsByAuthorCallback));

}

function pendingGET(request,response){
    daoClass.getPendingBookingsByAuthor(request.user.username,function(err,list){
        if(err){
            //handleErrorStatusAndMessage(this.response, err.status, err.message);
        }
        else{
            response.status(200);
            response.setHeader('content-type', 'text/html');
            response.render("Account/PendingBookings", {
                user:{
                    name: request.user.username,
                    bookingsList: list
                },
                title: "User pending bookings",
                isLogged: true
            });

        }
    })
}

function logInGET(request, response) {
    response.status(200);
    response.setHeader('content-type', 'text/html');
    response.render('Account/Login', {
                                        title: "Login",
                                        loginOrRegisterFailedMessage: request.flash('loginMessage'),
                                        isLogged: request.isAuthenticated()
                                     });
}

function updateStatus(request,response){
    daoClass.updateBookingStatusById(request.body['objectId'],request.body['user'],request.body['status'],function(err){
        if(err)
        {
            //handleErrorStatusAndMessage(this.response, err.status, err.message);
        }
        else{
            response.status(303);
            response.setHeader('location','pending');
            response.end();
        }
    });
}

function logOut(request, response) {
    request.logout();
    response.redirect('/');
}

function addRealEstateGET(request, response) {
    response.status(200);
    response.setHeader('content-type', 'text/html');
    response.render('Account/AddRealEstate', {
                                                title: 'Add a new real estate',
                                                isLogged: request.isAuthenticated()
                                            });
}

//por acabar
function addReservationGET(request, response) {
    response.send("add reservation get");
}

module.exports = {
    index: index,
    pendingGET:pendingGET,
    logInGET: logInGET,
    logOut: logOut,
    updateStatus:updateStatus,
    addRealEstateGET: addRealEstateGET,
    addReservationGET: addReservationGET
}





