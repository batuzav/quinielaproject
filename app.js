const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary');
var cron = require('node-cron');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');


Promise.promisifyAll(mongoose);
//Fetch
const fetch = require('node-fetch');
const SoccerSeason = require('./models/SoccerSeasonModel');
const SoccerTeamSchema = require('./models/SoccerTeamModel');
const SoccerMatch = require('./models/SoccerMatchModel');
const SoccerPredictionBasic = require('./models/SoccerPredictionBasicModel');
const SoccerQuiniela = require('./models/SoccerQuinielaModel');
const UserSoccerQuinielaAdvanced = require('./models/UserSoccerQuinielaAdvanceModel');
const SoccerPredictionAdvanced = require('./models/SoccerPredictionAdvanceModel');
const UserSoccerQuinielaBasic = require('./models/UserSoccerQuinielaBasicModel');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(isAuth);

app.post('/uploadImage', async (req, res) => {
  cloudinary.config({
    cloud_name: `${process.env.CLOUDINARYNAME}`,
    api_key: `${process.env.CLOUDINARYAPIKEY}`,
    api_secret: `${process.env.CLOUDINARYSECRET}`
  });
  const imageb64 = req.body.b64;
  // console.log('BASE', imageb64);
  let returnObj = {
    success: false,
    message: '',
    data: null,
    profileUrl: '',

  };
  const url =  await cloudinary.uploader.upload(imageb64, result => {
    // console.log(result);
    // console.log(result.url);
    const url = 'http://res.cloudinary.com/hopper/image/upload';
    const transformation = 'c_fill,g_auto:face,h_200,q_auto,w_200';
    returnObj = {
      profileUrl : `${url}/${transformation}/v${result.version}/${result.public_id}.jpg`,
      success : true,
      image : result.url,
    }
    return result.url;
  });
  res.json(returnObj);
});
const predictionResultBasic = (Match) =>{
  //console.log('match BASIC', Match);
  SoccerPredictionBasic.find({ matchId: Match._id }).then(predictions => {
    predictions.map(prediction => {
      //console.log('prediction ====>', prediction);
      let result = 'tie';
      if (Match.awayGoals > Match.homeGoals){
        result = 'away';
      }
      if (Match.awayGoals < Match.homeGoals){
        result = 'home';
      }

      if (result === prediction.result){
        SoccerPredictionBasic.findOneAndUpdateAsync({ _id: prediction._id}, {$set: {points: 1}}, {new: true}).then(predi => {
         // console.log('Este', prediction.userQuinielaId, 'HOLA: ', predi.userQuinielaId);
          UserSoccerQuinielaBasic.findOneAndUpdateAsync({_id: predi.userQuinielaId}, {$inc: { totalPoints: 1}}, {new: true}).then(UserSoccerQuiniela => {
         //   console.log('Ganasta', UserSoccerQuiniela)
          })
        });


      }

    });
  })

  return true;
}
const predictionResultAdvanced = (Match) => {
  console.log('match ADVANCED =>', Match);
  let result = 'tie';
  if (Match.awayGoals > Match.homeGoals){
    result = 'away';
  }
  if (Match.awayGoals < Match.homeGoals){
    result = 'home';
  }

  SoccerPredictionAdvanced.find({ matchId: Match._id }).populate('quinielaId').execAsync().then(predictions => {
    predictions.map(prediction => {
      console.log('prediction ====>', prediction);
      let pointsByResult = 0;
      let pointsByMarker = 0;
      let pointsByTotalGoals = 0;
      if (result === prediction.result){
        pointsByResult = pointsByResult + prediction.quinielaId.pointsByResult;
      }
      if (prediction.awayGoals === Match.awayGoals){
        pointsByMarker = pointsByMarker + prediction.quinielaId.pointsByMarker;
      }
      if (prediction.homeGoals === Match.homeGoals){
        pointsByMarker = pointsByMarker + prediction.quinielaId.pointsByMarker;
      }
      if ((prediction.awayGoals + prediction.homeGoals) === (Match.awayGoals + Match.homeGoals)) {
        pointsByTotalGoals = pointsByTotalGoals + prediction.quinielaId.pointsByTotalGoals;
      }
      const totalPoints = (pointsByResult + pointsByMarker + pointsByTotalGoals);

      if (totalPoints > 0) {
        SoccerPredictionAdvanced.findOneAndUpdateAsync({ _id: prediction._id}, {$set: {points: totalPoints, pointsByResult, pointsByTotalGoals, pointsByTotalGoals}}, {new: true}).then(predi => {
            console.log('Este', prediction.userQuinielaId, 'HOLA: ', predi.userQuinielaId);
          UserSoccerQuinielaAdvanced.findOneAndUpdateAsync({_id: predi.userQuinielaId}, {$inc: { totalPoints }}, {new: true}).then(UserSoccerQuiniela => {
             console.log('Ganasta', UserSoccerQuiniela)
           });
         });
      }

    });
  });
  return true;
}


const cronTask = () => {
  let dateToday = new Date();
      dateToday.setHours(dateToday.getHours()+2);
      dateToday = dateToday.getTime() / 1000;
  SoccerMatch.find({ date: { $lt: dateToday  }}).then(matchs => {
    matchs.map((match) => {
      if (match.status === 'incomplete') {
        console.log(`fecha menor de hoy ${new Date(match.date*1000)} `);
        fetch(`https://api.footystats.org/match?key=${process.env.FUTAPIKEY}&match_id=${match.apiRef}`, {
            method: 'GET',
          })
          .then(res => res.json())
          .then(async (matchapi) =>  {
              //console.log('matchapi', matchapi)
            const newMatch = await SoccerMatch.findOneAndUpdateAsync(
                { _id: match._id },
                 { $set: {
                    homeGoals: matchapi.data.homeGoalCount,
                    awayGoals: matchapi.data.awayGoalCount,
                    status: matchapi.data.status,
                    gameWeek: matchapi.data.game_week,
                    date: matchapi.data.date_unix,
                    homeTeamId: matchapi.data.homeID,
                    awayTeamId: matchapi.data.awayID,
                    apiRef: matchapi.data.id,
                  }},
                {new: true}
              )
              .then(exito => {return exito})
              predictionResultBasic(newMatch);
              predictionResultAdvanced(newMatch);
            return true;

          })
      }
    });
    res.end();
  });
}

cron.schedule('0 30 * * * *', () => {
  cronTask();
});

app.get('/cron',  (req, res) => cronTask);

app.get('/prueba', (req, res) => {
  fetch(`https://api.footystats.org/league-season?key=${process.env.FUTAPIKEY}&league_id=2270`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(result => {
      var str = result.data.image.split("/", 5);
      const SeasonObj = {
        imageUrl: `https://cdn.footystats.org/img/competitions/${str[4]}`,
        totalGameWeek: result.data.total_game_week,
        gameWeek: result.data.game_week,
        dateStart: result.data.starting_year,
        dateEnd: result.data.ending_year,
        apiRef: result.data.id,
        name: result.data.name,
      }

      SoccerSeason.findOne({ totalGameWeek: SeasonObj.totalGameWeek, gameWeek: SeasonObj.gameWeek, dateStart: SeasonObj.dateStart, dateEnd: SeasonObj.dateEnd,  apiRef: SeasonObj.apiRef})
      .then((foundSeason => {
        console.log('FoundSeason =>', foundSeason);
        if(foundSeason !== null) {
          throw new Error ('Ya existe el torneo');
        } else {
          console.log('este esek seasonObj ', SeasonObj);
            const soccerSeason = new SoccerSeason(SeasonObj);
            soccerSeason.save()
              .then((saveSeason) => {
                console.log('se guardo', saveSeason);
                fetch(`https://api.footystats.org/league-teams?key=${process.env.FUTAPIKEY}&league_id=2270`, {
                  method: 'GET',
                })
                .then(res => res.json())
                .then(result => {
                  let teamObj = result.data.map((team, k)=>{
                    // console.log(team.name);
                    // console.log('Clean: ', team.cleanName);
                    SoccerTeamSchema.update(
                      { apiRef: team.id },
                      {
                        name: team.cleanName,
                        completeName: team.name,
                        imageUrl: team.image,
                        apiRef: team.id,
                      },
                      { upsert: true }
                  )
                  .then(update => console.log('HECHO'))
                  fetch(`https://api.footystats.org/league-matches?key=${process.env.FUTAPIKEY}&league_id=2270`, {
                    method: 'GET',
                  })
                  .then(res => res.json())
                  .then(matches => {
                    let matchesObj = matches.data.map((match, k) => {
                      SoccerMatch.update(
                        { apiRef: match.id },
                        {
                          homeGoals: match.homeGoalCount,
                          awayGoals: match.awayGoalCount,
                          status: match.status,
                          gameWeek: match.game_week,
                          date: match.date_unix,
                          homeTeamId: match.homeID,
                          awayTeamId: match.awayID,
                          apiRef: match.id,
                          soccerSeasonId: saveSeason._id,
                        },
                        { upsert: true }
                      )
                      .then(exito => console.log('EXITO CON LOS MATCHES =>', saveSeason._id))
                      return true;
                    });
                  })

                    return{ name: team.cleanName, completeName: team.name, imageUrl: team.image }
                  });
                  console.log('Array: ', teamObj);

                })
              })
        }

      }))
      // console.log('es el json,  ', SeassonObj);
      res.json(result);
    });
});


app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `${process.env.DB}`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
});
