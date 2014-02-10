var QueryRestrictionObj = require('./QueryRestrictionsObj');

var minPriceRestriction = {
    'restricts': 'minPrice',
    'applyRestriction': function(restrictionToApply, query) {
        query.where('weeklyPrice').gte(restrictionToApply);
    }
}

var maxPriceRestriction = {
    'restricts': 'maxPrice',
    'applyRestriction': function(restrictionToApply, query) {
        query.where('weeklyPrice').lte(restrictionToApply);
    }
}

var minCapacityRestriction = {
    'restricts': 'minCapacity',
    'applyRestriction': function(restrictionToApply, query) {
        query.where('capacity').gte(restrictionToApply);
    }
}

var maxPriceRestriction = {
    'restricts': 'maxCapacity',
    'applyRestriction': function(restrictionToApply, query) {
        query.where('capacity').lte(restrictionToApply);
    }
}

var nameRestriction = {
    'restricts': 'name',
    'applyRestriction': function(restrictionToApply, query) {
        query.where('name').regex(new RegExp(restrictionToApply, "i"));
    }
}

var locationRestriction = {
    'restricts': 'location',
    'applyRestriction': function(restrictionToApply, query) {
        query.where('location.locName').regex(new RegExp(restrictionToApply, "i"));
    }
}

var availabilityRestriction = {
    'restricts': 'availableOnly',
    'applyRestriction': function(restrictionToApply, query) {
        var currentDate = new Date();
        query.where({
            reservations: {
                $not: {
                    $elemMatch: {
                            'dateBegin': { $lt: currentDate},
                            'dateEnd': { $gt: currentDate},
                            'finalized': 'Accepted'
                    }
                }
            }
        });
    }
}

//query.where({$or: [
//            { 'reservations.dateBegin': { $gt: currentDate}},
//            { 'reservations.dateEnd': { $lt: currentDate}},
//            { 'reservations.finalized': {$in: ['Pending', 'Rejected']}}
//        ]});

//        query.where('reservations.finalized').ne('accepted')
//             .or([{'reservations.dateBegin': { $gt: currentDate}},
//                  {'reservations.dateEnd': {$lt: currentDate}}]);

//-------- order by restrictions -------
var specifics = {
    'ascPrice': function(query) {
        query.sort({ 'weeklyPrice': 1});
    },
    'descPrice': function(query) {
        query.sort({'weeklyPrice': -1});
    },
    'location': function(query) {
        query.sort({'location': 1});
    },
    'capacity': function(query) {
        query.sort({'capacity': 1});
    }
}
var orderByRestriction = {
    'restricts': 'orderBy',
    'applyRestriction': function(restrictionToApply, query) {
        specifics[restrictionToApply](query);
    }
}

module.exports = new QueryRestrictionObj([minPriceRestriction, maxPriceRestriction, minCapacityRestriction, minCapacityRestriction,
                  nameRestriction, locationRestriction, availabilityRestriction], orderByRestriction);