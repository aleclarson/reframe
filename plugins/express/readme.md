<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.






-->

# `@reframe/express`

Use Reframe with Express.

### Usage

Add `@reframe/express` to your `reframe.config.js`:

~~~js
module.exports = {
  $plugins: [
    require('@reframe/react-kit'),
    require('@reframe/express')
  ]
};
~~~

Then eject the server code:

~~~js
$ reframe eject server
~~~

### Example

Example of a reframe app with ejected Express server code.

~~~js
// /plugins/express/example/server/start.js

const express = require('express');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const ExpressAdater = require('@universal-adapter/express');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
  const app = express();

  app.use(
    // We use https://github.com/brillout/universal-adapter to integrate Reframe with Koa
    new ExpressAdater([
      // Run `$ reframe eject server-rendering` to eject the server rendering code
      config.ServerRendering,
      // Run `$ reframe eject server-assets` to eject the static asset serving code
      config.StaticAssets,
    ])
  );

  app.get('/hello-from-express', (req, res) => res.send('Hello from Express'))

  const server = await startServer(app);

  const env = colorEmphasis(process.env.NODE_ENV||'development');
  console.log(symbolSuccess+'Server running (for '+env+')');

  return server;
}

async function startServer(app) {
  const http = require('http');
  const server = http.createServer(app);
  server.listen(process.env.PORT || 3000);

  // Wait until the server has started
  await new Promise((r, f) => {server.on('listening', r); server.on('error', f);});

  server.stop = async () => {
    await stopServer(server);
  };

  return server;
}
async function stopServer(server) {
  server.close();
  // Wait until server closes
  await new Promise((r, f) => {server.on('close', r); server.on('error', f);});
}
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/express/readme.template.md` instead.






-->
