const crypto = require("crypto");

const jwtSecrettoken = crypto.randomBytes(32).toString("hex");
const refreshtoken = crypto.randomBytes(32).toString("hex");

module.exports = { jwtSecrettoken , refreshtoken };
