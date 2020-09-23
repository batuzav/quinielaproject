const SoccerMatch = require("../../../models/SoccerMatchModel");
const SoccerTeam = require("../../../models/SoccerTeamModel");
const SoccerPredictionBasic = require("../../../models/SoccerPredictionBasicModel");
const SoccerPredictionAdvanced = require("../../../models/SoccerPredictionAdvanceModel");
const SoccerPredictionSurvivor = require("../../../models/SoccerPredictionSurvivorModel");

const checkLogin = (req) => {
  if (!req.isAuth) {
    throw new Error("Unauthorized");
  }
};

const getSoccerMatch = (args, req) => {
  // checkLogin(req);
  return SoccerMatch.find()
    .then((result) => {
      return result.map((match) => {
        return { ...match._doc, _id: match.id };
      });
    })
    .catch((err) => {
      throw err;
    });
};

const getSoccerMatchBySeasonId = (args, req) => {
  return SoccerMatch.find({
    soccerSeasonId: args.matchAndPredictionInput.soccerSeasonId,
    gameWeek: args.matchAndPredictionInput.gameWeek,
  })
    .then((result) => {
      return result.map((match) => {
        match._doc.homeTeam = SoccerTeam.findOneAsync({
          apiRef: match._doc.homeTeamId,
        }).then((team) => {
          return team;
        });
        match._doc.awayTeam = SoccerTeam.findOneAsync({
          apiRef: match._doc.awayTeamId,
        }).then((team) => {
          return team;
        });
        switch (args.matchAndPredictionInput.type) {
          case "advanced":
            match._doc.predictionData = SoccerPredictionAdvanced.findOneAsync({
              matchId: match._id,
              userQuinielaId: args.matchAndPredictionInput.userQuinielaId,
            }).then((prediction) => {
              return prediction;
            });
            break;

          case "basic":
            match._doc.predictionData = SoccerPredictionBasic.findOneAsync({
              matchId: match._id,
              userQuinielaId: args.matchAndPredictionInput.userQuinielaId,
            }).then((prediction) => {
              return prediction;
            });
            break;

          case "survivor":
            match._doc.predictionData = SoccerPredictionSurvivor.findOneAsync({
              matchId: match._id,
              userQuinielaId: args.matchAndPredictionInput.userQuinielaId,
            }).then((prediction) => {
              return prediction;
            });
            break;
        }
        return { ...match._doc, _id: match.id };
      });
    })
    .catch((err) => {
      throw err;
    });
};

//guardar imagen, crear prediction y mostarlo cuando se consukte match (crud) incluir prediction en matchd

module.exports = {
  getSoccerMatch,
  getSoccerMatchBySeasonId,
};
