const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSoccerQuinielaSurvivorSchema = new Schema({
    isAdmin: {
        type: Boolean,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    lives: {
        type: Number,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    quinielaId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerQuinela',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});
userSoccerQuinielaSurvivorSchema.index({ quinielaId: 1, userId: 1 }, { unique: true });
// userSoccerQuinielaSurvivorSchema.path('userId').validate((userId) => {
//     console.log(`Inside validator with seasonApiRef value -> ${userId}`)
//     return userSoccerQuinielaSurvivorSchema.findOne({ userId })
//     .then(UserSoccerQuiniela => {
//         if(!UserSoccerQuiniela){
//             return false;
//         } else {
//             return true;
//         }
//     })
// });
module.exports = mongoose.model('UserSoccerQuinielaSurvivorSchema', userSoccerQuinielaSurvivorSchema);