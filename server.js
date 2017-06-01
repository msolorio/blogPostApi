const express = require('express');

const blogPostsRouter = require('./routers/blogPostsRouter');

const app = express();

// route requests to /blog-posts to blogPostsRouter
app.use('/blog-posts', blogPostsRouter);

app.get('/', (request, response) => {
  response.status(200).json({message: 'homepage'});
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
});
