const Dotenv = require("dotenv-webpack");

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
      new Dotenv({
        path: "../.env",
      }),
    ],
  },
};
