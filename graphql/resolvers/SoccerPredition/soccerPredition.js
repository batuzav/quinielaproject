const SoccerPredictionBasic = require('../../../models/SoccerPredictionBasicModel');
const SoccerPredictionAdvanced = require('../../../models/SoccerPredictionAdvanceModel');
const SoccerPredictionSurvivor = require('../../../models/SoccerPredictionSurvivorModel');

const createSoccerPredictionAdvanced = ({awayGoals, homeGoals, userQuinielaId, matchId, quinielaId}) => {
    // const prediction = new SoccerPredictionAdvance({
    //     result,
    //     awayGoals,
    //     homeGoals,
    //     userQuinielaId,
    //     matchId,
    // });
    let result = ''
    if (homeGoals === awayGoals) result = 'tie';
    if (homeGoals > awayGoals) result = 'home';
    if (homeGoals < awayGoals) result = 'away';

    console.log('## ', userQuinielaId)
    return SoccerPredictionAdvanced.findOneAndUpdate(
            { matchId, userQuinielaId },
            {
                awayGoals,
                homeGoals,
                userQuinielaId,
                matchId,
                result,
                quinielaId,
            },
            { new: true, upsert: true })
            .then(result => {
                return result;
            })
}

const createSoccerPredictionBasic = ({userQuinielaId, matchId, result, quinielaId}) => {
    // const prediction = new SoccerPredictionBasic({
    //     result,
    //     points,
    //     userQuinielaId,
    //     matchId
    // });

    return SoccerPredictionBasic.findOneAndUpdate(
        { matchId, userQuinielaId },
        {
            userQuinielaId,
            matchId,
            result,
            quinielaId,
        },
        { upsert: true, new: true })
            .then(result => {
                return result;
            })
}

const createSoccerPredictionSurvivor = ({userQuinielaId, matchId, teamId, quinielaId}) => {
    // const prediction = new SoccerPredictionSurvivor({
    //     userQuinielaId,
    //     matchId,
    //     teamId,
    // });
    return SoccerPredictionSurvivor.findOneAndUpdate(
            {matchId, userQuinielaId},
            {
                userQuinielaId,
                matchId,
                teamId,
                quinielaId,

            },
            { upsert: true, new: true }
            )
            .then(result => {
                return resul
            })
}

const createSoccerPrediction = async (args, req) => {
    let SoccerPrediction = {};
    let obj = {};
    switch(args.soccerPredictionInput.type) {
        case 'advanced' :
            obj = {awayGoals: args.soccerPredictionInput.awayGoals, homeGoals: args.soccerPredictionInput.homeGoals, userQuinielaId: args.soccerPredictionInput.userQuinielaId, matchId: args.soccerPredictionInput.matchId, quinielaId: args.soccerPredictionInput.quinielaId}
            SoccerPrediction = await createSoccerPredictionAdvanced(obj)
            console.log('Prediction => ', SoccerPrediction);
            return { predictionAdvanced: SoccerPrediction};
            // break;

        case 'basic' :
            obj = {userQuinielaId: args.soccerPredictionInput.userQuinielaId, matchId: args.soccerPredictionInput.matchId, result: args.soccerPredictionInput.result, quinielaId: args.soccerPredictionInput.quinielaId}
            SoccerPrediction = await createSoccerPredictionBasic(obj)
            return { predictionBasic: SoccerPrediction};
            // break;

        case 'survivor':
            obj = {userQuinielaId: args.soccerPredictionInput.userQuinielaId, matchId: args.soccerPredictionInput.matchId, teamId: args.soccerPredictionInput.teamId, quinielaId: args.soccerPredictionInput.quinielaId}
            SoccerPrediction = await createSoccerPredictionSurvivor(obj)
            return { predictionSurvivor: SoccerPrediction};
            // break;
    }

}

module.exports = {
    createSoccerPrediction,

}
