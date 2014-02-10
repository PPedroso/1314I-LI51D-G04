var handleErrorStatusAndMessage = require('./../../Utils/ErrorHandler').handleErrorStatusAndMessage,
    utils = require('./../Utils/Parsers'),
    operationsOnViewData = require('./../Utils/OperationsOnViewData');

function daoPhotoCallback(err, photo) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        this.response.writeHead(200, { 'content-type': photo.type });
        this.response.end(photo.photo, 'utf8');
    }
}



function daoGetElementByKeyCallback(err, realEstate) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        //try to obtain the username in case it's logged, for the post of ratings
        var loggedUser;
        if(this.request.isAuthenticated()) {
            loggedUser = this.request.user.username;
        }
        //separate photos between shown and extra for the view
        var photosWithLink = realEstate.photos.map(function(entry) {
            return '/realEstates/photos?photoId=' + entry;
        })
        var viewPhotos = {
            startPhotos: photosWithLink,
            extraPhotos: photosWithLink.splice(7, photosWithLink.length-7)
        }
        this.response.status(200);
        this.response.setHeader('Content-Type', 'text/html');
        this.response.render('RealEstate/Specific', {
            title: 'Real Estate: ' + realEstate.name,
            realEstate: realEstate,
            photos: viewPhotos,
            isLogged: this.request.isAuthenticated(),
            currentUser: loggedUser
        });
    }
}

function daoAddElementCallback(err, realEstate) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        this.response.status(303);
        this.response.setHeader("Location",  '/realEstates/realEstate?realEstateId=' + realEstate._id);
        this.response.end();
    }
}

function getRealEstatesAndReservationsByAuthorCallback(err, list) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        this.response.status(200);
        this.response.setHeader('content-type', 'text/html');
        this.response.render("Account/Index", {
            user:{
                name: this.request.user.username,
                bookingsList: list.realEstateBookingList,
                realEstateList: list.realEstateList
            },
            title: "User profile",
            isLogged: true
        });
    }
}
//
//----------------------- Search By Location ------------------
//

function daoSearchByLocation(err, realEstatesAndCount, location, pageNr) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        this.response.status(200);
        this.response.setHeader('Content-type', 'text/html');
        this.response.render('RealEstate/LocationSearch', {
            title: 'Real Estates from location ' + location + ', page nr: ' + pageNr,
            realEstates: realEstatesAndCount.list,
            isLogged: this.request.isAuthenticated(),
            isAjax: false,
            currentPage: pageNr,
            maxPageNumber: Math.ceil(realEstatesAndCount.count / 5),
            action: {
                path: '/realEstates/SearchByLocation',
                queryString: '&location=' + location
            }
        });
    }
}

function daoSearchByLocationAJAX(err, realEstate) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        this.response.status(200);
        this.response.setHeader('Content-type', 'application/json');
        this.response.end(JSON.stringify(realEstate));
    }
}

//
//----------------------- Advanced Search ----------
//

function daoAdvancedSearch(err, realEstatesAndCount, searchParameters) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        operationsOnViewData.checkAvailability(realEstatesAndCount.list);
        this.response.status(200);
        this.response.setHeader('Content-type', 'text/html');
        this.response.render('RealEstate/AdvancedSearch', {
            title: 'Real Estates advanced search',
            realEstates: realEstatesAndCount.list,
            isLogged: this.request.isAuthenticated(),
            isAjax: false,
            searchParameters: searchParameters,
            currentPage: searchParameters['pageNr'],
            maxPageNumber: Math.ceil(realEstatesAndCount.count / 5),
            action: {
                path: '/realEstates/advancedSearch',
                queryString: '&' + utils.formQueryString(searchParameters)
            }
        });
    }
}

function daoAdvancedSearchAJAX(err, realEstate) {
    if(err) {
        handleErrorStatusAndMessage(this.response, err.status, err.message);
    } else {
        this.response.status(200);
        this.response.setHeader('Content-type', 'application/json');
        this.response.end(JSON.stringify(realEstate));
    }
}

module.exports = {
    daoPhotoCallback: daoPhotoCallback,
    daoGetElementByKeyCallback: daoGetElementByKeyCallback,
    getRealEstatesAndReservationsByAuthorCallback: getRealEstatesAndReservationsByAuthorCallback,
    daoSearchByLocation: daoSearchByLocation,
    daoSearchByLocationAJAX: daoSearchByLocationAJAX,
    daoAdvancedSearch: daoAdvancedSearch,
    daoAdvancedSearchAJAX: daoAdvancedSearchAJAX,
    daoAddElementCallback: daoAddElementCallback
}