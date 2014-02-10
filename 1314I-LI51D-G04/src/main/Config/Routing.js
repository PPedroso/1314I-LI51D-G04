var realEstateController = require('./../Controller/RealEstateController.js'),
    accountController = require('./../Controller/AccountController.js'),
    ratingController = require('./../Controller/RatingController.js'),
    homeController = require('./../Controller/HomeController.js'),
    reservationController = require('./../Controller/ReservationController.js');

function applyRouting(serverApp, passport) {

    //routes de test para views

        serverApp.get('/test/list', function(req, res) {
            res.status = 200;
            res.render('RealEstate/AdvancedSearch', {
                                             title: 'test',
                                             isLogged: false,
                                             isAjax: false,
                                             maxPageNumber: 10,
                                             currentPage: 10,
                                             realEstates: [
                                                 {
                                                     name: 'david'
                                                 },
                                                 {
                                                     name: 'raposo'
                                                 }
                                             ],
                                             action: {
                                                 path: '/test',
                                                 queryString: '&AhETal=123'
                                             }
                                          });
        });

        serverApp.get('/test', function(req, res) {
            var realEstate = {
                name: 'Uma casa muita nice',
                description: 'sem duvida a casa mais linda de sempre',
                capacity: 3,
                dimension: 50,
                numberOfRooms: 2,
                numberOfDivisions: 5,
                weeklyPrice: 100,
                reservations: [
                    {
                        dateStart: '12-5-2013',
                        dateEnd: '19-5-2013'
                    },
                    {
                        dateStart: '22-6-2013',
                        dateEnd: '29-6-2013'
                    },
                    {
                        dateStart: '1-7-2013',
                        dateEnd: '8-7-2013'
                    },
                    {
                        dateStart: '2-8-2013',
                        dateEnd: '9-8-2013'
                    }
                ],
                location: {
                    locName: 'lisbon',
                    latitude: 38.7382654,
                    longitude:  -9.3994265
                },
                ratings: {
                    average: 2,
                    list: [
                        {
                            author: 'peter',
                            rating: 3,
                            date: '11-06-2013',
                            description: 'MELHOR DE SEMPRE, MUITO +'
                        },
                        {
                            author: 'david',
                            rating: 5,
                            date: '12-05-2013',
                            description: 'Muito mau, seriamente algo a evitar'
                        },
                        {
                            author: 'david',
                            rating: 5,
                            date: '12-05-2013',
                            description: 'Muito mau, seriamente algo a evitar'
                        },
                        {
                            author: 'david',
                            rating: 5,
                            date: '12-05-2013',
                            description: 'Muito mau, seriamente algo a evitar'
                        },
                        {
                            author: 'david',
                            rating: 5,
                            date: '12-05-2013',
                            description: 'Muito mau, seriamente algo a evitar'
                        },
                        {
                            author: 'david',
                            rating: 5,
                            date: '12-05-2013',
                            description: 'Muito mau, seriamente algo a evitar'
                        }
                    ]
                }
            }
            res.status = 200;
            res.render('RealEstate/Specific', {
                                                    title: 'test',
                                                    isLogged: false,
                                                    currentUser: 'david',
                                                    realEstate: realEstate,
                                                    photos: {
                                                        startPhotos: [
                                                            'http://wallae.com/wp-content/uploads/2014/01/space-background-images.jpg',
                                                            'http://wallae.com/wp-content/uploads/2014/01/best-images-hd.jpg',
                                                            'http://i2.cdn.turner.com/cnn/dam/assets/131014140005-avatar-animal-kingdom-5-horizontal-gallery.jpg',
                                                            'http://media.digitalcameraworld.com/files/2013/03/norway_lofoten_haukland_01_DCW.jpg',
                                                            'http://wallae.com/wp-content/uploads/2014/01/best-images-hd.jpg',
                                                            'http://i2.cdn.turner.com/cnn/dam/assets/131014140005-avatar-animal-kingdom-5-horizontal-gallery.jpg',
                                                            'http://media.digitalcameraworld.com/files/2013/03/norway_lofoten_haukland_01_DCW.jpg'
                                                        ],
                                                        extraPhotos: [
                                                            'http://wallae.com/wp-content/uploads/2014/01/best-images-hd.jpg',
                                                            'http://i2.cdn.turner.com/cnn/dam/assets/131014140005-avatar-animal-kingdom-5-horizontal-gallery.jpg',
                                                            'http://media.digitalcameraworld.com/files/2013/03/norway_lofoten_haukland_01_DCW.jpg'
                                                        ]
                                                    }
                                                });
        });

    //routes de RealEstates
        //get
        serverApp.get('/realEstates/photos', realEstateController.realEstatePhoto);
        serverApp.get('/realEstates/realEstate', realEstateController.realEstateByKeyGET);
        serverApp.get('/realEstates/SearchByLocation', realEstateController.searchByLocationGET);
        serverApp.get('/realEstates/advancedSearch', realEstateController.advancedSearchRealEstatesGET);
        //post
        serverApp.post('/realEstates/addRealEstate', realEstateController.addRealEstatePOST);


    //routes de Account
        //get
        serverApp.get('/account/pending', isLoggedIn,accountController.pendingGET);
        serverApp.get('/account/addRealEstate', accountController.addRealEstateGET);
        serverApp.get('/account/addReservation', isLoggedIn, accountController.addReservationGET);
        serverApp.get('/account/logIn', rerouteIfLogged, accountController.logInGET);
        serverApp.get('/account/logOut', isLoggedIn, accountController.logOut);
        serverApp.get('/account', isLoggedIn, accountController.index);
        //post
        serverApp.post('/account/logIn', passport.authenticate('login', {
            failureRedirect : '/account/login',
            failureFlash : true
        }), function(req, res) {
            var redirectUrl = req.header('Referer') || '/account';
            res.redirect(redirectUrl);
        });

        serverApp.post('/account/register', passport.authenticate('register', {
            successRedirect : '/account',
            failureRedirect : '/account/login',
            failureFlash : true
        }));

        serverApp.post('/account/pending',isLoggedIn,accountController.updateStatus);

    //routes de ratings
        //get
        serverApp.get('/realEstates/:realEstateId/ratings', ratingController.getAllRatings);
        //post
        serverApp.post('/realEstates/:realEstateId/ratings', ratingController.addRating);

    //routings de reservation
        //get
        serverApp.get('/account/reservations', isLoggedIn, reservationController.viewReservationsOnRealEstateGET);
        //post
        serverApp.post('/account/reservations', isLoggedIn, reservationController.acceptReservationsOnRealEstatePOST);
        serverApp.post('/account/reservations/addReservation', isLoggedIn, reservationController.addReservationPOST);

    //routings de "home"
        //get
        serverApp.get('/', homeController.index);

    //default routing
        serverApp.get('*', function(request, response) {
            response.status(404);
            response.render('Error', {
                                        title: '404 - This is not a valid URI',
                                        isLogged: request.isAuthenticated()
                                     })

        });
}

function isLoggedIn(request, response, next) {
    //continue the execution in case the user is authenticated
    if (request.isAuthenticated())
        return next();

    //redirect to login page if it failed
    response.redirect('/account/login');
}

//used when acessing login route
function rerouteIfLogged(request, response, next) {
    //if logged, redirect to profile
    if(request.isAuthenticated()) {
        response.redirect('/account');
    } else {
        return next();
    }
}

module.exports = {
    applyRouting: applyRouting
};