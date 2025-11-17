const bcrypt = require("bcryptjs");
// user password comparison for login
const comPass = (pass, hashed_pass) => {
  return bcrypt.compare(pass, hashed_pass);
};

module.exports = comPass;
