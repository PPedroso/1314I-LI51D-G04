function registerFormValidation() {
    $(document).ready(function() {
        //custom rules
        jQuery.validator.addMethod("higherThenMinCapacity", function(value, element) {
            var aux;
            return this.optional(element) || value > (((aux = parseFloat($('.form-control[name="minCapacity"]').val())) == NaN) ? 0 : aux);
        }, "Max capacity must be higher then Minimum");

        jQuery.validator.addMethod("higherThenMinPrice", function(value, element) {
            var aux;
            console.log(value > (((aux = $('.form-control[name="minPrice"]').attr('value')) === "") ? 0 : aux));
            return this.optional(element) || value > (((aux = parseFloat($('.form-control[name="minPrice"]').val())) === NaN) ? 0 : aux);
        }, "Max price must be higher then Minimum");

        //apply validations
        $('#advancedSearchForm').validate();
        $('#advancedSearchForm .form-control[type="number"]').each(function () {
            $(this).rules("add", {
                min: 1
            })
        });
        $('.form-control[name="maxPrice"]').rules("add", {
            higherThenMinPrice: true
        })
        $('.form-control[name="maxCapacity"]').rules("add", {
            higherThenMinCapacity: true
        })
    });
}

//since popState does not reload the content of the initial page load, this variable serves to show whether it's the initial load
var historyChanged = false;

/*
 Uses the href present on the anchor tags for ajax requests, and updates those for correct usage without script

 receives the following parameters:
 - targetDivId: id of the div where collected data will be placed
 - replaceOld: boolean whether the old data must be kept, or if it will be replaced
 */
function registerEvents(targetDivId, replaceOld, maxPageNr, markerLocations) {
//
//---------------------- Start Map and Markers ------------------
//
    var markers = [], map;
    //google maps related
    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(markerLocations[0].latitude, markerLocations[0].longitude),
            zoom: 18
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        //5 markers are always created even if some might not be necessary, since pagination can make it necessary
        for(var i = 0; i < 5; ++i) {
            var marker;
            if(i < markerLocations.length) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(markerLocations[i].latitude, markerLocations[i].longitude),
                    map: map,
                    title: markerLocations[i].name
                });
            } else {
                marker = new google.maps.Marker({
                    map: map
                });
            }

            google.maps.event.addListener(marker, 'click', function() {
                map.setZoom(18);
                map.setCenter(marker.getPosition());
            });

            markers.push(marker);
        }
    }
    google.maps.event.addDomListener(window, 'load', initialize);

//---------------------------------------------------------------
    $(document).ready(function() {

//
//---------------------- Map Events -----------------------------
//
    {
        //associate buttons with markers on click event and add a custom event to change marker's location after page change
        $('#mapOptionsSection button').bind({
            'click': function(e) {
                //center the map on this buttons location
                map.setCenter(markers[$(this).data('value')].getPosition());
                //highlight the corresponding real estate (first removing any previous highlighted)
                $('#realEstatesList .highlight').removeClass('highlight');
                $('#realEstatesList .realEstateEntry:nth-child(' + (+$(this).data('value') + 1) + ')').addClass('highlight');
            },
            'updateMapMarkers': function(e, realEstates) {
                var thisButton = $(this);
                var buttonIdx = thisButton.data('value') + 1;
                if(buttonIdx < arguments.length) {
                    thisButton.removeClass('hidden');
                    //update text
                    thisButton.text('Marker Number ' + buttonIdx + ': ' + arguments[buttonIdx].name);
                    //update marker position
                    markers[buttonIdx - 1].setPosition(new google.maps.LatLng(arguments[buttonIdx].location.latitude, arguments[buttonIdx].location.longitude));
                    markers[buttonIdx - 1].setTitle(arguments[buttonIdx].name);
                } else {
                    thisButton.addClass('hidden');
                    //remove marker from map
                    markers[buttonIdx - 1].setMap(null);
                }
            }
        });
    }
//
//---------------------- Pagination Events ----------------------
//
        {
            var initialUri = window.location.href;
            $(window).bind("popstate", function(e) {
                if(e.originalEvent.state) {
                    getNewDataPopState(targetDivId, replaceOld, e.originalEvent.state);
                } else if(historyChanged) {
                    getNewDataPopState(targetDivId, replaceOld, { action: initialUri });
                }
            });

            $('#currentPageButton').on('changePageNumber', function(evt, newPageNr) {
                this.innerText = newPageNr;
            });

            $('#nextPageButton').bind({
                'click': function(e) {
                    getNewData(targetDivId, replaceOld, this);
                    e.preventDefault();
                },
                'changePageNumber': function(evt, newPageNr) {
                    changeVisibility(maxPageNr > newPageNr, this);
                    changeDOMElementHref(+newPageNr + 1, this);
                }
            });

            $('#previousPageButton').bind({
                'click': function(e) {
                    getNewData(targetDivId, replaceOld, this);
                    e.preventDefault();
                },
                'changePageNumber': function(evt, newPageNr) {
                    changeVisibility(newPageNr > 1, this);
                    changeDOMElementHref(newPageNr - 1, this);
                }
            });

            $('#firstPageButton').bind({
                'click': function(e) {
                    getNewData(targetDivId, replaceOld, this);
                    e.preventDefault();
                },
                'changePageNumber': function(evt, newPageNr) {
                    changeVisibility(newPageNr > 3, this);
                }
            });

            $('#lastPageButton').bind({
                'click': function(e) {
                    getNewData(targetDivId, replaceOld, this);
                    e.preventDefault();
                },
                'changePageNumber': function(evt, newPageNr) {
                    changeVisibility(maxPageNr > +newPageNr + 2, this);
                }
            });

            //buttons with a page number associated
            $('#paginationDiv a[id^="numberPageButton"]').each(function(idx, entry) {
                $(entry).bind({
                    'click': function(e) {
                        getNewData(targetDivId, replaceOld, this);
                        e.preventDefault();
                    },
                    'changePageNumber': function(evt, newPageNr) {
                        this.innerText = parseInt($(this).data('value')) + parseInt(newPageNr);
                        if($(this).data('value') > 0) {
                            changeVisibility(maxPageNr >= this.innerText, this);
                        } else {
                            changeVisibility(this.innerText > 0, this);
                        }
                        changeDOMElementHref(this.innerText, this);
                    }
                })
            });
        }
    });
}

function changeVisibility(isVisible, domElement) {
    if(isVisible) {
        domElement.className = '';
    } else {
        domElement.className = 'hidden';
    }
}

//does the ajax request for the recieved pageNr, keeps all the other fields the same way
function obtainNewValues(action, successCallBack) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', action, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            successCallBack(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

//domElement -> element whose event was triggered
function getNewData(targetDivId, replaceOld, domElement) {
    obtainNewValues(domElement.href, function(realEstates) {
        var newPageNr = findValuePageNr(domElement.href);
        console.log(domElement.href);
        //store action and title, for a future ajax request if necessary
        var historyState = {
            action: domElement.href,
            title: 'Search Results: Page ' + newPageNr
        }
        updatePageContent(newPageNr, targetDivId, replaceOld, realEstates);
        //update state
        historyChanged = true;
        window.history.pushState(historyState, historyState.title, historyState.action);
    });
}

function getNewDataPopState(targetDivId, replaceOld, state) {
    obtainNewValues(state.action, function(realEstates) {
        var newPageNr = findValuePageNr(state.action);
        updatePageContent(newPageNr, targetDivId, replaceOld, realEstates);
    })
}

function updatePageContent(newPageNr, targetDiv, replaceOld, realEstates) {
    if(replaceOld) {
        $('#' + targetDiv).empty();
    }
    realEstates.forEach(function(entry) {
        addDOMElementRealEstate(targetDiv, entry);
    });
    //change the href on all needed places
    $('#paginationDiv a').trigger('changePageNumber', newPageNr);
    //update markers
    $('#mapOptionsSection button').trigger('updateMapMarkers', realEstates);
}

function findValuePageNr(hrefLink) {
    var startPageNr = hrefLink.slice(hrefLink.indexOf('pageNr=') + 7);
    var endPageNr = startPageNr.indexOf('&');
    if(endPageNr == -1) {
        return startPageNr;
    }
    return startPageNr.substring(0, endPageNr);
}

function changeDOMElementHref(newValue, domElement) {
    domElement.href = domElement.href.replace(/pageNr=+-?\d+/, "pageNr=" + newValue);
}

function addDOMElementRealEstate(targetDiv, realEstate) {
    var mainDiv = $('<div/>', { 'class':'list-group-item row customBorder realEstateEntry'});
    mainDiv.append($('<div/>', { 'class': 'row col-md-2'}).append($('<img/>', { 'src': '/RealEstates/photos?photoId=' + realEstate.photos[0] })));
    $('<div/>', { 'class': 'row col-md-10'})
        .append(($('<h1/>', { 'class': 'text-center'})
                                .text(realEstate.name)
                                .append($('<a/>', { 'href': '/realEstates/realEstate?realEstateId=' + realEstate._id}))))
        .append($('<div/>', { 'class': 'row container textDivs'})
                                .append($('<div/>', { 'class': 'col-md-4'})
                                                        .append($('<p/>').text('WeeklyPrice: ' + realEstate.weeklyPrice))
                                                        .append($('<p/>').text('Location: ' + realEstate.location.locName)))
                                .append($('<div/>', { 'class': 'col-md-4'})
                                                        .append($('<p/>').text('Capacity: ' + realEstate.capacity))
                                                        .append($('<p/>').text('Number of Rooms: ' + realEstate.numberRooms)))

                                .append($('<div/>', { 'class': 'col-md-4'})
                                                        .append($('<p/>').text('Availability: ' + realEstate.isAvailable))))
        .appendTo(mainDiv);
    mainDiv.appendTo($('#' + targetDiv));
}

//
//RealEstate
//    .aggregate({$unwind: '$reservations' },
//               {$match: { 'reservations.author': user }},
//               {$project: {
//                   dateBegin: '$reservations.dateBegin',
//                   dateEnding: '$reservations.dateEnding'
//               }})
//.exec(function(err, result) {
//
//});
