import axios from 'axios';
import cheerio from 'cheerio';
import express from 'express';

const app = express();
const targetUrl = 'https://example.com'; // Your target URL

// Proxy route for fetching and modifying CSS
app.get('/css/*', async (req, res) => {
  const cssPath = req.params[0]; // Capture the CSS path from the URL

  try {
    // Fetch the CSS content
    const response = await axios.get(`${targetUrl}/css/${cssPath}`);
    let cssContent = response.data;

    // Rewrite URLs for background images
    cssContent = cssContent.replace(/url\(['"]?([^\)'"]+)['"]?\)/g, (match, url) => {
      if (url.startsWith('/')) {
        return `url("https://proxy-server.onrender.com${url}")`; // Rewrite relative URLs
      }
      return match;
    });

    // Send the modified CSS back
    res.type('text/css');
    res.send(cssContent);
  } catch (error) {
    console.error('Error loading CSS:', error);
    res.status(500).send('Error loading CSS');
  }
});

// Proxy route for fetching HTML and other resources
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(targetUrl);
    const $ = cheerio.load(response.data);

    // Rewrite asset URLs in the HTML
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('/')) {
        $(el).attr('src', `https://proxy-server.onrender.com${src}`);
      }
    });

    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('/')) {
        $(el).attr('href', `https://proxy-server.onrender.com${href}`);
      }
    });

    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('/')) {
        $(el).attr('src', `https://proxy-server.onrender.com${src}`);
      }
    });

    res.send($.html());
  } catch (error) {
    console.error('Error loading page:', error);
    res.status(500).send('Error loading proxied page');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
