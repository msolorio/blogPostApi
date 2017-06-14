const express = require('express');
const morgan = require('morgan');


const app = express();

const blogPostsRouter = require('./routers/blogPostsRouter');

// morgan will log the HTTP layer of application
app.use(morgan('common'));

// route requests for /blog-posts to blogPostsRouter
app.use('/blog-posts', blogPostsRouter);

app.get('/', (request, response) => {
  response.status(200).json({message: 'homepage'});
});

let server;

function runServer() {
  const port = process.env.PORT || 3000;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`app listening on port ${port}`);
      resolve(server);
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log(`closing server`);
    server.close((err) => {
      if (err) {
        reject(err);
        console.log('server was not able to close');
        return;
      }
      resolve();
    });
  });
}

// will happen when we run node server.js
// we do this in dev and in production

// however this will not run when running our integration tests
// where we import the runServer and closeServer functions directly to our test files
if (require.main === module) {
  runServer().catch((err) => {
    console.log(err)
  });
}

// makes these objects and methods available to other files that need them like our integration tests
module.exports = { app, runServer, closeServer };
