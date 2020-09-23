const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soccerPredictionSurvivorSchema = new Schema({
    matchId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerMatch',
        required: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerTeam',
        required: true
    },
    userQuinielaId: {
        type: Schema.Types.ObjectId,
        ref: 'UserSoccerQuinielaSurvivor',
        required: true
    },
    quinielaId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerQuiniela',
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('SoccerPredictionSurvivor', soccerPredictionSurvivorSchema);
