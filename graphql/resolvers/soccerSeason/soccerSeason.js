const SoccerSeason = require('../../../models/SoccerSeasonModel');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const checkLogin = req => {
    if(!req.isAuth){
      throw new Error('Unauthorized');
    }
  }

module.exports = {
    getSoccerSeason: (args, req) =>  {
        // checkLogin(req);
        return SoccerSeason.find()
            .then(result => {
                return result.map(season => {
                    return { ...season._doc, _id: season.id };
                });
            })
            .catch(err => {
                throw err;
            });
      
    }
};
