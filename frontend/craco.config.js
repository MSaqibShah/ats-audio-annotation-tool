const Dotenv = require("dotenv-webpack");
const path = require("path");

let getDotenv = () => {
  // check if file  exists
  let env = undefined
  let check = undefined
  try {
    check = require.resolve("../.env")
  } catch (e){
    console.log("No .env file found in ../")
  }
  console.log(check)
  
  if (check !== undefined){
    console.log("Dotenv loaded from ../.env")
    env = new Dotenv({path: "../.env"})
    return env
  }
  env = new Dotenv()
  return env
} 

module.exports = {
  reactScriptsVersion: "react-scripts",
  style: {
    css: {
      loaderOptions: () => {
        return {
          url: false,
        };
      },
    },
  },
  webpack: {
    plugins: [
      getDotenv(),
    ],
  },
};
