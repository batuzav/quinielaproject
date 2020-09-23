const User = require("../../../models/users/UsersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkLogin = (req) => {
  if (!req.isAuth) {
    throw new Error("Unauthorized");
  }
};

module.exports = {
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("USUARIO NO EXISTE");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("PASSWORD INCORRECTO");
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "hoppercatbuenosaires1",
      {
        expiresIn: "1h",
      }
    );
    return { userId: user._id, token: token, tokenExpiration: 1, user };
  },
  checkLoginFunction: async (args, req) => {
    let isAuth = true;
    if (!req.isAuth) {
      isAuth = false;
    }

    return { isAuth };
  },
};
