const User = require('../../../models/users/UsersModel');
const bcrypt = require('bcryptjs'); 
module.exports = {
    users: (args, req) => {
      //aqui se pone el middleware comparando req.isAuth
      // if(!req.isAuth){
      //   throw new Error('INICIA SESION');
      // }
      checkLogin(req);

        return User.find()
          .then(users => {
            return users.map(user => {
              return { ...user._doc, _id: user.id };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createUser: args => {
        return User.findOne({ username: args.userInput.username })
            .then(user => {
                if (user){
                    throw new Error('USUARIO YA EXISTEf');
                }
                return bcrypt.hash(args.userInput.password, 12);
            })  
            .then(hashedPassword => {
                const user = new User({
                    username: args.userInput.username,
                    password: hashedPassword,
                    firstName: args.userInput.firstName,
                    lastName: +args.userInput.lastName,
                    email: args.userInput.email,
                    timezone: args.userInput.timezone,
                    phone: args.userInput.phone,
                  });
                return user.save();
            })
            .then(result => {
              console.log(result);
              return { ...result._doc, _id: result._doc._id.toString() };
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
      },
      editUser: (args, req) => {
        checkLogin(req);
        return User.findOneAndUpdate({ _id: args.userId }, { $set: args.userData }, { new: true })
              .then(result => {
                  return { ...result._doc, _id: result._doc._id.toString() };
              })
              .catch(e => {
                console.log(e);
                throw e;
              });
      },
};
