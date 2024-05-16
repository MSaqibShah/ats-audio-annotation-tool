const dotenv = require("dotenv");

if (process.env.NODE_ENV === undefined){
  dotenv.config({ path: "../.env" });
}


const dev_end = {
  MONGO_DB_URI: process.env.MONGO_DB_URI_DEV || "mongodb://localhost/ats_tool",
  BACKEND_PORT: process.env.BACKEND_PORT_DEV || 5000,
  FRONTEND_PORT: process.env.FRONTEND_PORT_DEV || 3000,
  BACKEND_URL: process.env.BACKEND_URL_DEV || "http://localhost",
  FRONTEND_URL: process.env.FRONTEND_URL_DEV || "http://localhost",
};

const prod_end = {
  MONGO_DB_URI: process.env.MONGO_DB_URI_PROD,
  BACKEND_PORT: process.env.BACKEND_PORT_PROD,
  FRONTEND_PORT: process.env.FRONTEND_PORT_PROD,
  BACKEND_URL: process.env.BACKEND_URL_PROD,
  FRONTEND_URL: process.env.FRONTEND_URL_PROD,
};
const NODE_ENV = process.env.NODE_ENV || "dev";


let config = NODE_ENV === "dev" ? dev_end : prod_end;
config.NODE_ENV = NODE_ENV;

module.exports = config;
