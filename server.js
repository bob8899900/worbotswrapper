import { load } from 'cheerio'; // Correct import style for ESM

const app = express();
const targetUrl = 'https://example.com'; // Replace with the URL you want to proxy

app.get('/', async (req, res) => {
  try {
    // Fetch the content of the target URL
    const response = await axios.get(targetUrl);
    const $ = load(response.data);  // Use 'load' instead of cheerio()

    // Rewrite URLs for assets like images, scripts, and styles
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

    // Send the modified HTML back to the client
    res.send($.html());
  } catch (error) {
    console.error('Error loading the proxied page:', error);
    res.status(500).send('Error loading the proxied page');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
