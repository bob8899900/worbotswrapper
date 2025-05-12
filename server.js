import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const targetUrl = 'https://example.com'; // The website you want to proxy

app.get('/', async (req, res) => {
  try {
    // Step 1: Fetch the content of the target URL
    const response = await axios.get(targetUrl);
    const $ = cheerio.load(response.data);

    // Step 2: Rewrite URLs for assets (images, styles, scripts)
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        // If src is relative, prepend the base URL of your proxy server
        if (src.startsWith('/')) {
          $(el).attr('src', `https://proxy-server.onrender.com${src}`);
        }
      }
    });

    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        if (href.startsWith('/')) {
          $(el).attr('href', `https://proxy-server.onrender.com${href}`);
        }
      }
    });

    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        if (src.startsWith('/')) {
          $(el).attr('src', `https://proxy-server.onrender.com${src}`);
        }
      }
    });

    // Step 3: Send the modified HTML back to the client
    res.send($.html());
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading the proxied page');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
