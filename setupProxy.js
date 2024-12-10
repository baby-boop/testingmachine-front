const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/erp-services/**',
    createProxyMiddleware({
      target: 'http://dev.veritech.mn:8080',
      changeOrigin: true,
      secure: false,
    })
  );
};
