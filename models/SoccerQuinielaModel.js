const mongoose = require('mongoose');
const SoccerSeason = require('./SoccerSeasonModel');

const Schema = mongoose.Schema;

const soccerQuinielaSchema = new Schema({
    name: {
        type: String,
        // required: true
        default: ''
    }, 
    desc: {
        type: String,
        // required: true
        default: ''
    },
    private: {
        type: Boolean,
        // required: true
        default: false
    },
    maxUsers: {
        type: Number,
        // required: true
        default: ''
    },
    imageUrl: {
        type: String,
        // required: true
        default: ''
    },
    type: {
        type: String,
        default: 'advance'
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
    rules: {},

    soccerSeasonId: {
       type: Schema.Types.ObjectId, 
       ref: 'SoccerSeason',
       required: true
    },
});


soccerQuinielaSchema.path('soccerSeasonId').validate((soccerSeasonId) => {
    console.log(`Inside validator with seasonApiRef value -> ${soccerSeasonId}`)
    return SoccerSeason.findOne({ _id: soccerSeasonId })
    .then(season => {
        if(!season){
            return false;
        } else {
            return true;
        }
    })
});

module.exports = mongoose.model('SoccerQuiniela', soccerQuinielaSchema);