const jwt = require("jsonwebtoken");

// access token generation
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.access_secret,
    { expiresIn: "10m" }
  );
};

// refresh token generation
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.refresh_secret,
    { expiresIn: "5d" }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
