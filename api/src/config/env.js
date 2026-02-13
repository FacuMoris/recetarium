const requiredVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "PORT",
  "AUTH0_SECRET",
  "AUTH0_BASE_URL",
  "AUTH0_CLIENT_ID",
  "AUTH0_ISSUER_BASE_URL",
  "AUTH0_AUDIENCE",
];

requiredVars.forEach((varName) => {
  if (process.env[varName] === undefined) {
    throw new Error(`Missing enviroment variable: ${varName}`);
  }
});

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT,
  AUTH0_SECRET: process.env.AUTH0_SECRET,
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
};
