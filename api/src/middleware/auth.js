const { auth } = require("express-oauth2-jwt-bearer");

const env = require("../config/env");

const checkJwt = auth({
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  audience: env.AUTH0_AUDIENCE,
  tokenSigningAlg: "RS256",
});

module.exports = checkJwt;
