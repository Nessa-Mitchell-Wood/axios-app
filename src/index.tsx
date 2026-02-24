import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { logger } from 'hono/logger';

const PORT = Number(process.env.port) || 0;
const app = new Hono();

app.use(logger());
app.use('/static/*', serveStatic({ root: './' }));

app.get('/', (c) => {
  return c.html(
    <html lang="en" className="">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Axios App</title>
        <link rel="stylesheet" href="/static/css/main.css" />
        <script src="/static/js/axios.js" defer></script>
        <script src="/static/js/alpine.js" defer></script>
        <script src="/static/js/htmx.js" defer></script>
      </head>
      <body className="bg-slate-200 text-black/80">
        <div className="bg-black/80 p-4">
          <div className="max-w-3xl mx-auto py-12">
            <div className="flex justify-between align-middle">
              <img
                className="h-8 brightness-0 invert opacity-80"
                src="/static/img/axios-logo.svg"
              />
              <h1 className="text-2xl font-thin text-white/80">Axios App</h1>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto py-12">
          <p
            id="hono-test-result"
            hx-get="/hono-test"
            hx-trigger="every 1s"
            hx-target="#hono-test-result"
            hx-swap="outerHTML transition:true"
          >
            HTMX test at {new Date().toLocaleDateString('en-AU')}{' '}
            {new Date().toLocaleTimeString('en-AU')}
          </p>
        </div>
      </body>
    </html>,
  );
});

app.get('/hono-test', (c) => {
  return c.html(
    <p
      id="hono-test-result"
      hx-get="/hono-test"
      hx-trigger="every 1s"
      hx-target="#hono-test-result"
      hx-swap="outerHTML transition:true"
    >
      HTMX test successful at {new Date().toLocaleDateString('en-AU')}{' '}
      {new Date().toLocaleTimeString('en-AU')}
    </p>,
  );
});

const server = serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => console.log(`Server running at http://localhost:${info.port}`),
);

process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
