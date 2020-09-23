const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soccerSeasonSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    totalFinalRounds: {
        type: Number,
        requerid: false,
    },
    totalGameWeek: {
        type: Number,
        requerid: true,
    },
    gameWeek: {
        type: String,
        required: true
    },
    dateStart: {
        type: String,
        required: true
    },
    dateEnd: {
        type: String,
        required: true
    },
    apiRef: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    

});

module.exports = mongoose.model('SoccerSeason', soccerSeasonSchema);
