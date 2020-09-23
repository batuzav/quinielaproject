const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soccerPredictionAdvanceSchema = new Schema({
    result: {
        type: String,
        required: false
    },
    awayGoals: {
        type: Number,
        required: true
    },
    homeGoals: {
        type: Number,
        required: true
    },
    userQuinielaId: {
        type: Schema.Types.ObjectId,
        ref: 'UserSoccerQuinielaAdvance',
        required: true
    },
    matchId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerMatch',
        required: true
    },
    quinielaId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerQuiniela',
        required: true
    },
    pointsByResult: {
        type: Number,
        default: 1,
    },
    pointsByMarker: {
        type: Number,
        default: 1,
    },
    pointsByTotalGoals: {
        type: Number,
        default: 1,
    },
    points: {
        type: Number,
        default: 0
    },

});

module.exports = mongoose.model('SoccerPredictionAdvanced', soccerPredictionAdvanceSchema);
