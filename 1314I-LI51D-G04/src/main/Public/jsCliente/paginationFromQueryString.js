/*
        Based on the current location, it's kept all the query string parameters, changing only "PageNr" accordingly to the action
    taking place
        receives the following parameters:
            - targetDivId: id of the div where collected data will be placed
            - replaceOld: boolean whether the old data must be kept, or if it will be replaced
 */
function registerPaginationEvents(targetDivId, replaceOld, maxPageNr) {

    $('#currentPageButton').on('changePageNumber', function(evt, newPageNr) {
        this.innerText = newPageNr;
    });

    $('#nextPageButton').bind({
        'click': function(e) {
            getNewData(targetDivId, replaceOld, function(uriInfo) {
                uriInfo.parameters['pageNr'] = parseInt(uriInfo.parameters['pageNr']) + 1;
            });
            e.preventDefault();
        },
        'changePageNumber': function(evt, newPageNr) {
            changeVisibility(maxPageNr > newPageNr, this);
        }
    });

    $('#previousPageButton').bind({
        'click': function(e) {
            getNewData(targetDivId, replaceOld, function(uriInfo) {
                uriInfo.parameters['pageNr'] = parseInt(uriInfo.parameters['pageNr']) - 1;
            });
            e.preventDefault();
        },
        'changePageNumber': function(evt, newPageNr) {
            changeVisibility(newPageNr > 1, this);
        }
    });

    $('#firstPageButton').bind({
        'click': function(e) {
            getNewData(targetDivId, replaceOld, function(uriInfo) {
                uriInfo.parameters['pageNr'] = 1;
            });
            e.preventDefault();
        },
        'changePageNumber': function(evt, newPageNr) {
            changeVisibility(newPageNr > 3, this);
        }
    });

    $('#lastPageButton').bind({
        'click': function(e) {
            getNewData(targetDivId, replaceOld, function(uriInfo) {
                uriInfo.parameters['pageNr'] = maxPageNr;
            });
            e.preventDefault();
        },
        'changePageNumber': function(evt, newPageNr) {
            changeVisibility(maxPageNr > +newPageNr + 3, this);
        }
    });

    //buttons with a page number associated
    $('#paginationDiv a[id^="numberPageButton"]').each(function(idx, entry) {
        $(entry).bind({
            'click': function(e) {
                getNewData(targetDivId, replaceOld, function(uriInfo) {
                    uriInfo.parameters['pageNr'] = entry.innerText;
                });
                e.preventDefault();
            },
            'changePageNumber': function(evt, newPageNr) {
                this.innerText = parseInt($(this).data('value')) + parseInt(newPageNr);
                if($(this).data('value') > 0) {
                    changeVisibility(maxPageNr >= this.innerText, this);
                } else {
                    changeVisibility(this.innerText > 0, this);
                }
            }
        })
    });
}

function changeVisibility(isVisible, domElement) {
    if(isVisible) {
        domElement.style.display="inline";
    } else {
        domElement.style.display="none";
    }
}

//does the ajax request for the recieved pageNr, keeps all the other fields the same way
function obtainNewValues(action, divId, replaceOld, successCallBack) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', action, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            if(replaceOld) {
                //$('#' + divId).innerHTML = xhr.responseText;
            } else {
                //$('#' + divId).innerHTML += xhr.responseText;
            }
            successCallBack();
            window.history.pushState(action, action, action);
        }
    };
    xhr.send();
}

/*
 Parameters:
 - targetDivId: id of the div where collected data will be placed
 - replaceOld: boolean whether the old data must be kept, or if it will be replaced
 - changeToPageNr: recieves a uriInfo object

 note: uriInfo = {
 path:
 parameters: { ... } -> pares nome da query string
 }
 */
function getNewData(targetDivId, replaceOld, changeToUriInfo) {
    var uriInfo = splitUri();
    changeToUriInfo(uriInfo);
    var action = remakeUri(uriInfo);
    obtainNewValues(action, targetDivId, replaceOld, function() {
        var newPageNr = uriInfo.parameters['pageNr'];
        $('#paginationDiv a').trigger('changePageNumber', newPageNr);
    });
}

//splits the uri, so we can change the property "pageNr".
function splitUri() {
    var uriInfo = { uriPath: window.location.pathname, parameters: { } };
    var parameters = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    parameters.forEach(function(entry) {
        var tmp = entry.split('=');
        uriInfo.parameters[tmp[0]] = tmp[1];
    });
    return uriInfo;
}

//remakes the uri, so it can be passed as an action
function remakeUri(uriInfo) {
    var queryString = "";
    var idx = 0;
    for(var name in uriInfo.parameters) {
        if(idx != 0) {
            queryString += '&';
        }
        queryString += name + '=' + uriInfo.parameters[name];
        ++idx;
    };
    return uriInfo.uriPath += '?' + queryString;
}
