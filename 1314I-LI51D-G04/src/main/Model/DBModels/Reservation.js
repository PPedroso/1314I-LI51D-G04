var mongoose = require('mongoose');

var reservationSchema = mongoose.Schema({
    realEstate: { type: Schema.Types.ObjectId, ref: 'RealEstate', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateBegin: { type: Date, required: true },
    dateEnding: { type: Date, required: true },
    finalized: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);