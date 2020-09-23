const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const soccerTeamSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    completeName: {
        type: String,
        requiried: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    apiRef: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('SoccerTeam', soccerTeamSchema);