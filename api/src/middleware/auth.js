const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
});

module.exports = checkJwt;
