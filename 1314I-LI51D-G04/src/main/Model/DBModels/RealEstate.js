var mongoose = require('mongoose');

var realEstateSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true},
    capacity: { type: Number, required: true, min:1 },
    dimension: { type: Number, required: true, min:1 },
    numberDivisions: { type: Number, required: true, min: 1},
    numberRooms: { type: Number, required: true, min:1 },
    weeklyPrice: { type: Number, required: true, min:0 },
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
    date: {type: Date ,required: true},
    ratings: {
        average: { type: Number, default:1, min: 1, max: 5 },
        list: [{
            date: { type: Date, required: true},
            author: { type: String, required: true},
            description: { type: String , required: true},
            rating: { type: Number, min: 1, max: 5, required: true }
        }]
    },
    reservations: [{
        author: { type: String, required: true },
        dateBegin: { type: Date, required: true },
        dateEnd: { type: Date, required: true },
        finalized: { type: String, default: 'pending', required: true }
    }],
    location: {
        locName: { type: String, required: true },
        latitude: { type: Number, min: -90, max: 90, required: true },
        longitude: { type: Number, min: -180, max: 180, required: true }
    },
    owner: { type: String, required: true }
});

realEstateSchema.methods.isCurrentlyAvailable= function() {
    var currentDate = new Date();
    return !this.reservations || this.reservations.every(function(entry) {
                                    if(currentDate > entry.dateBegin && currentDate < entry.dateEnd && entry.finalized === 'Accepted') {
                                        return false;
                                    }
                                    return true;
                                 });
}

module.exports = mongoose.model('RealEstate', realEstateSchema);