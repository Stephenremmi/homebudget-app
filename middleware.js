const jwt = require('jsonwebtoken');
const { jwtVerifyToken } = require('./utils/utils');


const withAuth = function (req, res, next) {
  const token =
    req.cookies.token ||
    req.headers['x-access-token'] ||
    req.body.token ||
    req.query.token;

  if (!token) {
    return res
    .status(401)
    .json({ msg:'Unauthorized: No token provided'});
  } else {
    const { user } = jwtVerifyToken(token);

    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).send('Unauthorized: Invalid token');
    }
  }
};

module.exports = withAuth;