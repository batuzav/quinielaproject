const SoccerQuiniela = require('../../../models/SoccerQuinielaModel');
const UserSoccerQuinielaAdvace = require('../../../models/UserSoccerQuinielaAdvanceModel');
const UserSoccerQuinielaBasic = require('../../../models/UserSoccerQuinielaBasicModel');
const UserSoccerQuinielaSurvivor = require('../../../models/UserSoccerQuinielaSurvivorModel');
const SoccerSeason = require('../../../models/SoccerSeasonModel');
const User = require('../../../models/users/UsersModel');

const checkLogin = req => {
    if(!req.isAuth){
      throw new Error('Unauthorized');
    }
  }
const createUserSoccerQuinielaAdvanced = (userId, quinielaId, isAdmin = true) => {
        UserSoccerQuiniela = new UserSoccerQuinielaAdvace({
            isAdmin,
            totalPoints: 0,
            position: 1,
            quinielaId: quinielaId,
            userId: userId,
        });

    return UserSoccerQuiniela.save()
            .then(result => {
                console.log('-> ', result);
                return result;
            })
}
const createUserSoccerQuinielaBasic = (userId, quinielaId, isAdmin = true) => {
    UserSoccerQuiniela = new UserSoccerQuinielaBasic({
        isAdmin,
        totalPoints: 0,
        position: 1,
        quinielaId,
        userId,
    });
    return UserSoccerQuiniela.save()
            .then(result => {
                console.log('-> ', result);
                return result;
            })
}

const createUserSoccerQuinielaSurvivor = (userId, quinielaId, lives) => {
    UserSoccerQuiniela = new UserSoccerQuinielaSurvivor({
        isAdmin: true,
        totalPoints: 0,
        lives:6,
        position: 1,
        quinielaId: quinielaId,
        userId: userId
    });
    return UserSoccerQuiniela.save()
            .then(result => {
                console.log('-> ', result);
                return result;
            })
}
helperUserSoccerQuinielaBasic = (userId, quinielaId) => {  
    console.log('ID BASIC =============>', quinielaId, 'userId >>>', userId);
    return new Promise (resolve => {
        UserSoccerQuinielaBasic.findOne({ userId, quinielaId }).then(result => {console.log('resultBasic', result); resolve(result); });
    })
}
helperUserSoccerQuinielaAdvanced = (userId, quinielaId) => {
    // console.log('ID ADVANCED =============>', quinielaId, 'userId >>> ', userId);
    return new Promise (resolve => { 
        UserSoccerQuinielaAdvace.findOne({ userId, quinielaId }).then(result => { resolve(result); });
    })
}
helperSoccerSeason = (_id) => {
    return new Promise (resolve => {
        SoccerSeason.findOneAsync({ _id })
            .then(async Seasson => {
                resolve(Seasson);
            })
    }) 
}

helperUser = (_id) => {
    return new Promise (resolve => {
        User.findOneAsync({ _id })
            .then(Usr => {
                resolve(Usr);
            });
    });
}

// const helperSoccerQuiniela = async (userId, type, quinielaId) => {
//     //git
//     let userSoccerQuinielaAdvancedVar = {};
//     let userSoccerQuinielaBasicVar = {};
//     let userSoccerQuinielaSurvivorVar  = {};
//     console.log('type: ', type, userId, quinielaId);
//     switch (type) {
//         case 'advanced' :
//                 userSoccerQuinielaAdvancedVar  = await UserSoccerQuinielaAdvace.findOneAsync({ userId, quinielaId }).then(result => {console.log('result',result); return result });
//                 break;
//         case 'basic' :
//                 userSoccerQuinielaBasicVar = await UserSoccerQuinielaBasic.findOneAsync({ userId, quinielaId }).then(result => { return result });
//                 break;
//         case 'survivor':
//              break;
//     }
//     return { userSoccerQuinielaAdvancedVar, userSoccerQuinielaBasicVar, userSoccerQuinielaSurvivorVar }
    
// }

const createSoccerQuiniela = (args, req) => {
    // checkLogin(req);
    const quiniela = new SoccerQuiniela({
        name: args.soccerQuinielaInput.name,
        desc: args.soccerQuinielaInput.desc,
        private: args.soccerQuinielaInput.private,
        maxUsers: args.soccerQuinielaInput.maxUsers,
        imageUrl: args.soccerQuinielaInput.imageUrl,
        type: args.soccerQuinielaInput.type,
        soccerSeasonId: args.soccerQuinielaInput.soccerSeasonId,
        pointsByResult: args.soccerQuinielaInput.pointsByResult,
        pointsByMarker: args.soccerQuinielaInput.pointsByMarker,
        pointsByTotalGoals: args.soccerQuinielaInput.pointsByTotalGoals,
    });
    return quiniela.save()
        .then(result => {
            console.log('------->',result);
            switch(args.soccerQuinielaInput.type) {
                case 'advanced' :
                    createUserSoccerQuinielaAdvanced(args.soccerQuinielaInput.userId, result._id);
                    break;

                case 'basic' :
                    createUserSoccerQuinielaBasic(args.soccerQuinielaInput.userId, result._id);
                    break;

                case 'survivor':
                    createUserSoccerQuinielaSurvivor(args.soccerQuinielaInput.userId, result._id, args.soccerQuinielaInput.lives);
                    break;
            }

            return { ...result._doc, _id: result._id.toString() }
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
}
const getUserSoccerQuinielaAdvanced = async(args, req) => {
    const limit = `${process.env.LIMIT}`;
    const skip = (args.pagina * parseInt(limit));
    console.log("ARGS =====>", args);
    //console.log('REQ ------------------->', req);
    return UserSoccerQuinielaAdvace.find({ userId: args.userId }).skip(skip).limit(parseInt(limit))
        .then(results => {
            // console.log('results ======>', results);
            return results.map(result => {
                result._doc.soccerQuiniela = SoccerQuiniela.findOneAsync({ _id: result._doc.quinielaId })
                    .then(Quiniela => {
                        // console.log('Quiniela =>', Quiniela);
                        Quiniela.soccerSeason = SoccerSeason.findOneAsync({ _id: Quiniela.soccerSeasonId })
                            .then(Seasson => {return Seasson;} )
                        return Quiniela
                    })
                // console.log('Result DOX =>',  result._doc);
                return { ...result._doc, _id: result.id };
              });
        })
        .catch(err => {throw err})
}
const getUserSoccerQuinielaBasic = (args, req) => {
    const limit = `${process.env.LIMIT}`;
    const skip = (args.pagina * parseInt(limit));
    return UserSoccerQuinielaBasic.find({ userId: args.userId }).skip(skip).limit(parseInt(limit))
        .then(results => {
            return results.map(result => {
                result._doc.soccerQuiniela = SoccerQuiniela.findOneAsync({ _id: result._doc.quinielaId })
                    .then(Quiniela => {
                        // console.log('Quiniela =>', Quiniela);
                        Quiniela.soccerSeason = SoccerSeason.findOneAsync({ _id: Quiniela.soccerSeasonId })
                            .then(Seasson => {
                              console.log('SEASON: ',Seasson )
                              return Seasson;} )
                        return Quiniela
                    })
                // console.log('Result DOX =>',  result._doc.soccerQuiniela);
                return { ...result._doc, _id: result.id };
              });
        })
        .catch(err => {throw err})
}
const getUserSoccerQuinielaSurvivor = (args, req) => {
    const limit = `${process.env.LIMIT}`;
    const skip = (args.pagina * parseInt(limit));
    return UserSoccerQuinielaSurvivor.find({ userId: args.userId }).skip(skip).limit(parseInt(limit))
        .then(results => {
            return results.map(result => {
                result._doc.soccerQuiniela = SoccerQuiniela.findOneAsync({ _id: result._doc.quinielaId })
                    .then(Quiniela => {
                        // console.log('Quiniela =>', Quiniela);
                        Quiniela.soccerSeason = SoccerSeason.findOneAsync({ _id: Quiniela.soccerSeasonId })
                            .then(Seasson => {return Seasson;} )
                        return Quiniela
                    })
                //    console.log('Result DOX =>',  result._doc.soccerQuiniela);
                return { ...result._doc, _id: result.id };
              });
        })
        .catch(err => {throw err})
}
const helperUsersIntoQuinielaAdvanced =  (quinielaId, pagina) => {
    const limit = `${process.env.LIMIT}`;
    const skip = (pagina * parseInt(limit));
    return new Promise (resolve => {                                                                                                                                                                                  
        UserSoccerQuinielaAdvace.find({ quinielaId }).sort({ totalPoints: 1 }).skip(skip).limit(parseInt(limit)).then(async (results) => {
            const advanced = results.map(async result => {
               // console.log('Result', result);
                result._doc.user = await helperUser(result.userId);
              //  console.log('user >>>>>>', result._doc.user) 
                return { ...result._doc, _id: result.id }
            })
            Promise.all(advanced).then(completed => {
                //console.log('Advaced >>>>>', advanced);
                resolve(advanced);
            })
            
         });
    });
}

const helperUsersIntoQuinielaBasic = (quinielaId, pagina) => {
    const limit = `${process.env.LIMIT}`;
    const skip = (pagina * parseInt(limit));
    return new Promise (resolve => {
        UserSoccerQuinielaBasic.find({ quinielaId }).sort({ totalPoints: 1 }).skip(skip).limit(parseInt(limit)).then(async (results) => {
            const basic = results.map(async result => {
               // console.log('Result', result);
                result._doc.user = await helperUser(result.userId);
                //.log('user >>>>>>', result._doc.user) 
                return { ...result._doc, _id: result.id }
            })
            Promise.all(basic).then(completed => {
                //.log('Advaced >>>>>', basic);
                resolve(basic);
            })
            
         });
    });
}
const getUsersIntoQuiniela = async (args, req) => {
    const userSoccerQuiniela = {};
    switch(args.type) {
        case 'advanced' :
            userSoccerQuiniela.userSoccerQuinielaAdvancedVar = await helperUsersIntoQuinielaAdvanced(args.quinielaId, args.pagina);
            console.log('Final >>>>>>:', userSoccerQuiniela.userSoccerQuinielaAdvancedVar);
            break;
        case 'basic' :
            userSoccerQuiniela.userSoccerQuinielaBasicVar = await helperUsersIntoQuinielaBasic(args.quinielaId, args.pagina);   
            break;
        case 'survivor':
            break;
    }
    return userSoccerQuiniela;
}
const getSoccerQuiniela = (args, req) => {
    const limit = `${process.env.LIMIT}`;
    const skip = (args.pagina * parseInt(limit));
    return SoccerQuiniela.find({ private: false }).skip(skip).limit(parseInt(limit))
            .then(results => {
                return results.map(async result => {
                    result._doc.userSoccerQuiniela = {};
                    result._doc.soccerSeason  = await helperSoccerSeason(result.soccerSeasonId);
                    switch(result.type) {
                        case 'advanced' :
                            result._doc.userSoccerQuiniela.userSoccerQuinielaAdvancedVar =  await helperUserSoccerQuinielaAdvanced(args.userId, result._id);                          
                            break;
                        case 'basic' :
                            result._doc.userSoccerQuiniela.userSoccerQuinielaBasicVar = await helperUserSoccerQuinielaBasic(args.userId, result._id);
                            break;
                        case 'survivor':
                            break;
                    }    
                    console.log('result.doc', result._doc);
                    return { ...result._doc, _id: result.id };
                })
            })
}
// const getSoccerQuinielaById = (args, req) => {
//     return find({ userId: false })
//             .then(results => {
//                 return results.map(result => {
//                     return { ...result._doc, _id: result.id };
//                 })
//             })
// }



const getAllUserSoccerQuiniela = async (args, req) => {
    const userSoccerQuinielaAdvancedVar = await getUserSoccerQuinielaAdvanced(args, req);
    console.log('advance =>', userSoccerQuinielaAdvancedVar);
    const userSoccerQuinielaBasicVar = await getUserSoccerQuinielaBasic(args, req);
    console.log('Basic => ', userSoccerQuinielaBasicVar);
    const userSoccerQuinielaSurvivorVar = await getUserSoccerQuinielaSurvivor(args, req);
    console.log('Survivor =>', userSoccerQuinielaSurvivorVar);

    return {userSoccerQuinielaAdvancedVar, userSoccerQuinielaBasicVar, userSoccerQuinielaSurvivorVar};

}
const joinSoccerQuiniela = async (args, req) => {
    let userSoccerQuinielaAdvancedVar = {};
    let userSoccerQuinielaBasicVar = {};
    switch (args.joinSoccerQuinielaInput.type) {
        case 'advanced' :
                userSoccerQuinielaAdvancedVar  =  await createUserSoccerQuinielaAdvanced(args.joinSoccerQuinielaInput.userId, args.joinSoccerQuinielaInput.quinielaId, false);
                break;
        case 'basic' :
                userSoccerQuinielaBasicVar =  await createUserSoccerQuinielaBasic(args.joinSoccerQuinielaInput.userId, args.joinSoccerQuinielaInput.quinielaId, false);
                break;
        case 'survivor':
             break;
    }
    return { userSoccerQuinielaAdvancedVar, userSoccerQuinielaBasicVar }
}
module.exports = {
    createSoccerQuiniela,
    getSoccerQuiniela,
    joinSoccerQuiniela,
    getUserSoccerQuinielaAdvanced,
    getUserSoccerQuinielaBasic,
    getUserSoccerQuinielaSurvivor,
    getAllUserSoccerQuiniela,
    getUsersIntoQuiniela,

}
