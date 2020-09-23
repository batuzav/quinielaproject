const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSoccerQuinielaAdvanceSchema = new Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    position: {
        type: Number,
        default: 1
    },
    quinielaId: {
        type: Schema.Types.ObjectId,
        ref: 'SoccerQuiniela',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

userSoccerQuinielaAdvanceSchema.index({ quinielaId: 1, userId: 1 }, { unique: true });

// userSoccerQuinielaAdvanceSchema.path('userId').validate((userId) => {
//     console.log(`Inside validator with seasonApiRef value -> ${userId}`)
//     return userSoccerQuinielaAdvanceSchema.findOne({ userId })
//     .then(UserSoccerQuiniela => {
//         if(!UserSoccerQuiniela){
//             return false;
//         } else {
//             return true;
//         }
//     })
// });

module.exports = mongoose.model('UserSoccerQuinielaAdvanced', userSoccerQuinielaAdvanceSchema);
