/*
    This is supposed to receive objects with the following structure:
                var whereRestriction = {
                    'restricts': 'orderBy', -> fieldName
                    'applyRestriction': function(restrictionToApply, query) { -> function with restriction

                    }
                }
    Parameters:
        - array of objects representing "where" conditions
        - a single object for sort

 */

function QueryRestrictionsObj(whereRestrictions, sortRestriction) {
    this.restrictions = whereRestrictions;
    this.sortRestriction = sortRestriction;
}

QueryRestrictionsObj.prototype.placeWhereRestrions = function(objToRestrict, query) {
    this.restrictions.forEach(function(entry) {
        if(objToRestrict[entry.restricts]) {
            entry.applyRestriction(objToRestrict[entry.restricts], query);
        }
    });
}

QueryRestrictionsObj.prototype.placeSortRestriction = function(objToRestrict, query) {
    if(this.sortRestriction) {
        this.sortRestriction.applyRestriction(objToRestrict[this.sortRestriction.restricts], query);
    }
}

module.exports = QueryRestrictionsObj;