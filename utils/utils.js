const SECRET = 'mysecretsshhh';
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const jwtGenerateToken = (user) => {
  const payload = { user };
  const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
  return token;
};

const jwtVerifyToken = (token) => {
  return jwt.verify(token, SECRET);
}

const encryptPassword = (plainText, saltRounds = 10) => {
  return bcrypt.hashSync(plainText, saltRounds);
}

const comparePassword = (plainText, hash) => {
  return bcrypt.compareSync(plainText, hash);
};

const userSerializer = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

const logger = function (req, res, next) {
  console.log(
    `URL: ${req.url}, 
    Method: ${req.method}, 
    Body: ${JSON.stringify(req.body)}, 
    Cookie: ${JSON.stringify(req.cookies)}`
  );
  next();
};

const invalidUserError = (res) => {
  res.status(401)
    .json({
      error: 'User validation failed'
    });
};

const internalServerError = (res, message = "") => {
  res.status(500)
    .json({
      error: `Internal error please try again : ${message}`
    });
};

module.exports = { 
  jwtGenerateToken, 
  jwtVerifyToken, 
  encryptPassword, 
  comparePassword,
  userSerializer,
  logger, 
  internalServerError, 
  invalidUserError };
