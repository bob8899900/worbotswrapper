import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const targetUrl = 'https://worbots-e189414dd906.herokuapp.com/login'; // <- the site you want to proxy

app.use('/', createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    // Remove headers that block embedding
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  },
  pathRewrite: {
    '^/': '', // remove base path
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
