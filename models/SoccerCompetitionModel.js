const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soccerCompetitionSchema = new Schema({
    trophyUrl: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        requerid: true,
    },
    code: {
        type: String,
        requerid: true,
    },
    areaName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model('SoccerCompetitionSchema', soccerCompetitionSchema);