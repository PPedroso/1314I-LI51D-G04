var mongoose = require('mongoose');

var ratingSchema = mongoose.Schema({
    realEstate: { type: Schema.Types.ObjectId, ref: 'RealEstate', required: true },
    grade: { type: Number, min: 1, max: 5, required: true},
    description: { type:String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Rating', ratingSchema);