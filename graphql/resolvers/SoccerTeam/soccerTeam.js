const SoccerTeam = require('../../../models/SoccerTeamModel');

const checkLogin = req => {
    throw new Error('Unauthorized');
}

module.exports = {
    getSoccerTeam: (args, req) => {
        return SoccerTeam.find()
            .then(result => {
                return result.map(team => {
                    return { ...team._doc, _id: team.id }
                });
            })
            .catch(err => {
                throw err;
            })
    }
}