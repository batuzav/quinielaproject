const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soccerPredictionBasicSchema = new Schema({
    result: {
        type: String,
        required: false
    },
    points: {
        type: Number,
        default: 0
    },
    userQuinielaId: {
        type: Schema.Types.ObjectId,
        ref: 'UserSoccerQuinielaBasic',
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
});

module.exports = mongoose.model('SoccerPredictionBasic', soccerPredictionBasicSchema);
