const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type User {
    _id: ID!
    username: String!
    password: String
    firstName: String!
    lastName: String!
    email: String!
    timezone: String!
    phone: String!
  }
type SoccerCompetition {
    trophyUrl: String!
    name: String!
    code: String!
    areaName: String!
    imageUrl: String!
    _id: ID!
}
type SoccerSeason {
    name: String!
    imageUrl: String!
    totalFinalRounds: Int!
    totalGameWeek: Int!
    gameWeek: Int!
    dateStart: String!
    dateEnd: String!
    apiRef: String!
    _id: ID!
}
type PredictionData {
    result: String
    awayGoals: Int
    homeGoals: Int
    userQuinielaId: ID!
    matchId: ID!
    points: Int
    teamId: ID
    type: String
    _id: ID!
}
type SoccerMatch {
    homeGoals: Int!
    awayGoals: Int
    result: Int!
    status: String!
    gameWeek: String!
    date: Int!
    homeTeamId: Int!
    awayTeamId: Int
    apiRef: Int!
    homeTeam: SoccerTeam!
    awayTeam: SoccerTeam!
    _id: ID!
    predictionData: PredictionData
}
type SoccerPredictionAdvanced {
    result: String!
    awayGoals: Int!
    homeGoals: Int!
    userQuinielaId: ID!
    matchId: ID!
    soccerMatch: SoccerMatch
    userSoccerQuinielaAdvanced: UserSoccerQuinielaAdvanced
    _id: ID!
    quinielaId: ID!
}

type SoccerPredictionSurvivor {
    teamId: ID!
    userQuinielaId: ID!
    matchId: ID!
    _id: ID!
    quinielaId: ID!
}
type SoccerPredictionBasic {
    result: String!
    points: Int!
    userQuinielaId: ID!
    matchId: ID!
    _id: ID!
    quinielaId: ID!
}
type  SoccerPrediction {
    predictionAdvanced: SoccerPredictionAdvanced
    predictionBasic: SoccerPredictionBasic
    predictionSurvivor: SoccerPredictionSurvivor
}

type SoccerQuiniela {
    name: String!
    desc: String!
    private: Boolean
    maxUsers: Int!
    imageUrl: String!
    type: String!
    soccerSeasonId: ID!
    soccerSeason: SoccerSeason
    _id: ID!
    pointsByResult: Int
    pointsByMarker: Int
    pointsByTotalGoals: Int
    userSoccerQuiniela: UserSoccerQuinielaTry
}
type SoccerTeam {
    name: String
    completeName: String
    imageUrl: String
    apiRef: Int
    _id: ID!
}
type UserSoccerQuinielaAdvanced {
    isAdmin: Boolean!
    totalPoints: Int!
    position: Int!
    quinielaId: ID!
    userId: ID!
    soccerQuiniela: SoccerQuiniela
    _id: ID!
    user: User

}
type UserSoccerQuinielaBasic {
    isAdmin: Boolean!
    totalPoints: Int!
    position: Int!
    quinielaId: ID!
    userId: ID!
    soccerQuiniela: SoccerQuiniela
    _id: ID!
    user: User
}
type UserSoccerQuinielaSurvivor {
    isAdmin: Boolean!
    totalPoints: Int!
    lives: Int!
    position: Int!
    quinielaId: ID!
    userId: ID!
    soccerQuiniela: SoccerQuiniela
    _id: ID!
    user: User
}

type UserSoccerQuiniela {
    userSoccerQuinielaAdvancedVar: [UserSoccerQuinielaAdvanced]
    userSoccerQuinielaBasicVar: [UserSoccerQuinielaBasic]
    userSoccerQuinielaSurvivorVar: [UserSoccerQuinielaSurvivor]
}

type UserSoccerQuinielaTry {
    userSoccerQuinielaAdvancedVar: UserSoccerQuinielaAdvanced
    userSoccerQuinielaBasicVar: UserSoccerQuinielaBasic
    userSoccerQuinielaSurvivorVar: UserSoccerQuinielaSurvivor
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    user: User
    _id: ID!
  }

  input SoccerCompetitionInput {
    trophyUrl: String!
    name: String!
    code: String!
    areaName: String!
    imageUrl: String!
}

  input UserInput {
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    email: String!
    timezone: String!
    phone: String!
  }
  input UserData {
      firstName: String
      lastName: String
      email: String
      username: String
      timezone: String
      phone: String
      _id: ID!
  }

  input SoccerQuinielaInput {
    name: String!
    desc: String!
    private: Boolean
    maxUsers: Int!
    imageUrl: String!
    type: String!
    soccerSeasonId: ID!
    userId: ID!
    pointsByResult: Int
    pointsByMarker: Int
    pointsByTotalGoals: Int
  }

  type tokenAuth {
      isAuth: Boolean!
  }

    input SoccerPredictionInput {
        result: String
        awayGoals: Int
        homeGoals: Int
        userQuinielaId: ID!
        matchId: ID!
        points: Int
        teamId: ID
        type: String!
        quinielaId: ID!
    }

    input MatchAndPredictionInput {
        soccerSeasonId: ID!
        gameWeek: Int!
        type: String
        userQuinielaId: ID
    }
    input JoinSoccerQuinielaInput {
        type: String!
        userId: ID!
        quinielaId: ID!
    }

  type RootQuery {
      users: [User!]!
      login(email: String!, password: String!): AuthData!
      getSoccerSeason: [SoccerSeason!]!
      getSoccerMatch: [SoccerMatch!]!
      getSoccerTeam: [SoccerTeam!]!
      getUserSoccerQuinielaAdvanced(userId: ID!): [UserSoccerQuinielaAdvanced!]
      getUserSoccerQuinielaBasic(userId: ID!): [UserSoccerQuinielaBasic!]!
      getUserSoccerQuinielaSurvivor(userId: ID!): [UserSoccerQuinielaSurvivor!]!
      getAllUserSoccerQuiniela(userId: ID!, pagina: Int!): UserSoccerQuiniela
      getSoccerQuiniela(userId: ID!, pagina: Int!): [SoccerQuiniela!]!
      checkLoginFunction: tokenAuth!
      getSoccerMatchBySeasonId(matchAndPredictionInput: MatchAndPredictionInput!): [SoccerMatch!]!
      joinSoccerQuiniela(joinSoccerQuinielaInput: JoinSoccerQuinielaInput): UserSoccerQuinielaTry
      getUsersIntoQuiniela(quinielaId: ID!, type: String!, pagina: Int!): UserSoccerQuiniela

  }
  type RootMutation {
      createUser(userInput: UserInput): User
      editUser(userId: ID!, userData: UserData): User!
      createSoccerQuiniela(soccerQuinielaInput: SoccerQuinielaInput!): SoccerQuiniela!
      getSoccerQuinielaById(userId: ID!): [SoccerQuiniela!]
      createSoccerPrediction(soccerPredictionInput: SoccerPredictionInput): SoccerPrediction!

  }
  schema {
      query: RootQuery
      mutation: RootMutation
  }

`);
