const usersResolver = require('./users/users');
const authResolver = require('./auth/auth');
const soccerSeason = require('./soccerSeason/soccerSeason');
const soccerMatch = require('./SoccerMatch/soccerMatch');
const soccerTeam = require('./SoccerTeam/soccerTeam');
const soccerQuiniela = require('./SoccerQuiniela/soccerQuiniela');
const soccerPrediction = require('./SoccerPredition/soccerPredition');

const rootResolver = {
    ...usersResolver,
    ...authResolver,
    ...soccerSeason,
    ...soccerMatch,
    ...soccerTeam,
    ...soccerQuiniela,
    ...soccerPrediction,
  };

  module.exports = rootResolver;
