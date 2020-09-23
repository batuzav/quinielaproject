const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[0];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    try{
        decodedToken = jwt.verify(token, 'hoppercatbuenosaires1');
    } catch (err) {
        console.log('err ', err);
        req.isAuth = false;
        return next();
    }
    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userID = decodedToken.userId;
    next();

};
