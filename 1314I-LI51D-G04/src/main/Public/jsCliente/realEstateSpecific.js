function preparePageEvents(nrOfRatingsLeft, realEstateId, arrayExtraPhotos, latitude, longitude) {
    var ratingsStillToRead = nrOfRatingsLeft;

    $(window).load(function() {
        //fix height of real estate information and map (without script they don't match)
        (function() {
            var mapDivSize = $('#mapSection').height();
            var realEstateInformationDivSize = $('#realEstateInformation').height();
            if(mapDivSize > realEstateInformationDivSize) {
                $('#realEstateInformation').height(mapDivSize);
            } else {
                $('#mapSection').height(realEstateInformationDivSize);
            }
        })();
    })

    $(window).ready(function() {
        //google maps related
        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 18
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

            var marker = new google.maps.Marker({
                position: map.getCenter(),
                map: map,
                title: 'Click to zoom'
            });

            google.maps.event.addListener(marker, 'click', function() {
                map.setZoom(18);
                map.setCenter(marker.getPosition());
            });

            $('#backToMapMarker').on('click', function() {
                map.setZoom(18);
                map.setCenter(marker.getPosition());
            })
        }
        google.maps.event.addDomListener(window, 'load', initialize);


        //add events on buttons to slide to other photos in case there were extraPhotos
        if(arrayExtraPhotos.length > 0) {
            $('#photoMoveLeftButton').on('click', function() {
                imagesListShiftLeft(arrayExtraPhotos);
            });

            $('#photoMoveRightButton').on('click', function() {
                imagesListShiftRight(arrayExtraPhotos);
            })
        }

        //add events on all images to make them swap with the main image in case they are clicked
        $('.divWithPhoto img').on('click', function() {
            var currentMainImg = $('#currentPhoto img');
            var aux = currentMainImg.attr('src');
            currentMainImg.attr('src', this.src);
            this.src = aux;
        });

        //add ajax request to get more ratings
        if(ratingsStillToRead > 0) {
            $('#getMoreRatingsButton').on('click', function() {
                var xhr = new XMLHttpRequest();
                xhr.open("get", '/realEstates/' + realEstateId + '/ratings', true);
                xhr.setRequestHeader('accept', 'text/javascript');
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4 && xhr.status == 200) {
                        var arrayRatings = JSON.parse(xhr.responseText);
                        arrayRatings.forEach(function(entry) {
                            //create the dom element and append it at the right section
                            createRatingDomElement(entry, false);
                        });
                        /*
                            verify whether any ratings are left to read, hiding the button in case there aren't
                            ( nrOfRatingsLeft <= 0 is used, since other users might affect the expected result )
                         */
                        if((nrOfRatingsLeft -= arrayRatings.length) <= 0) {
                            $('#getMoreRatingsButton').addClass('hidden');
                        }
                    }
                }
            });
        }

        //add ajax request to post request
        $('#addRatingForm').on('submit', function(e) {
            //stop default action
            e.preventDefault();

            //prepare XMLHttpRequest
            var xhr = new XMLHttpRequest();
            xhr.open("post", this.action, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    var jsonResponse = JSON.parse(xhr.responseText);
                    //update the average
                    $('#realEstateAverageRating').text(jsonResponse.newAverage);
                    //create the dom element corresponding to the added ratting
                    createRatingDomElement(jsonResponse.rating, true);
                }
            };
            xhr.send($(this).serialize());
        });
    });
}

function imagesListShiftLeft(arrayExtraPhotos) {
    var arrayCurrentListPhotos = $('.divWithPhoto img');
    arrayExtraPhotos.unshift(arrayCurrentListPhotos[0].src);
    for(var i = 1; i < arrayCurrentListPhotos.length; ++i) {
        arrayCurrentListPhotos[i-1].src = arrayCurrentListPhotos[i].src;
    }
    arrayCurrentListPhotos[arrayCurrentListPhotos.length - 1].src = arrayExtraPhotos.pop();
}

function imagesListShiftRight(arrayExtraPhotos) {
    var arrayCurrentListPhotos = $('.divWithPhoto img');
    arrayExtraPhotos.push(arrayCurrentListPhotos[arrayCurrentListPhotos.length - 1].src);
    for(var i = arrayCurrentListPhotos.length - 1; i > 0; --i) {
        arrayCurrentListPhotos[i].src = arrayCurrentListPhotos[i - 1].src;

    }
    arrayCurrentListPhotos[0].src = arrayExtraPhotos.shift();
}

function createRatingDomElement(rating, prepend) {
    rating['rating'] = 'Rating: ' + rating['rating'];
    //create a similar rating DOM Element so we can later add
    var rootNode = $('<li/>');
    var mainDiv = $('<div/>', { 'class': 'ratingHeaders row' });

    //this 3 parameters contain similar html structures
    [rating['author'], rating['rating'], rating['date']].forEach(function(entry) {
        var div = $('<div/>', { 'class': 'col-md-4' }).append($('<p/>').text(entry));
        mainDiv.append(div);
    });

    //finalize rootNode
    rootNode.append(mainDiv)
            .append($('<p/>').text(rating['description']));

    //add to current list of ratings
    if(prepend) {
        $('#listRatingSection ul').prepend($('<div/>', {'class': 'hr-like' }))
                                  .prepend(rootNode);
    } else {
        $('#listRatingSection ul').append(rootNode)
                                  .append($('<div/>', {'class': 'hr-like' }));
    }
};