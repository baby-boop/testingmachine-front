module.exports = {
    devServer: {
      static: "./dist",
      port: 3000,
      open: true,
      hot: true,
      liveReload: true,
      historyApiFallback: true,
      allowedHosts: "all",
      client: {
        logging: "info",
        overlay: true
      }
    }
  };
  