var mongoose = require('mongoose');

var photoSchema = mongoose.Schema({
    realEstate: { type: mongoose.Schema.Types.ObjectId, ref: 'RealEstate' },
    photo: { type: Buffer, contentType: String, required: true},
    type: { type: String, required: true }
});

module.exports = mongoose.model('Photo', photoSchema);