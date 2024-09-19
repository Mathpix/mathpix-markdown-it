const path = require('path-browserify');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify")
        }
      }
    }
  }
};
