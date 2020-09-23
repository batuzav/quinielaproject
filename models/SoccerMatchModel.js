const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soccerMatchSchema = new Schema({
    homeGoals: {
        type: Number,
        required: false
    }, 
    awayGoals: {
        type: Number,
        requerid: false,
    },
    result: {
        type: Number,
        requerid: false,
    },
    status: {
        type: String,
        requerid: true,
    },
    gameWeek: {
        type: String,
        requerid: true,
    },
    date: {
        type: Number,
        required: true
    },
    homeTeamId: {
        type: Number,
        requerid: true,
    },
    awayTeamId: {
        type: Number,
        requerid: true,
    },
    apiRef: {
        type: Number,
        requerid: true,
    },
    soccerSeasonId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerSeason',
        required: true
    }

    
});

module.exports = mongoose.model('SoccerMatch', soccerMatchSchema);