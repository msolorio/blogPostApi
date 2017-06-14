const express = require('express');

const bodyParser = require('body-parser');

// turns json into JavaScript for us to use
const jsonParser = bodyParser.json();

const { BlogPosts } = require('../models');

// instantiate router with express
const router = express.Router();

BlogPosts.create({
  "title": "Chicken Soup for the Developer Soul",
  "author": "Sved Svenson",
  "content": "once upon a time ..."
});

router.get('/', (request, response) => {
  blogPosts = BlogPosts.get();
  response.status(200).json(blogPosts);
});

router.post('/', jsonParser, (request, response) => {

  try {
    const post = BlogPosts.create(request.body);
    response.status(201).json(post);
  }
  catch(error) {
    response.status(400).json({message: error.message, name: error.name});
  }
});

router.put('/:id', jsonParser, (request, response) => {
  console.log('making put request to /blog-posts');
  console.log('request.body:', request.body);

  try {
    const newPost = BlogPosts.update(request.body, request.params.id);
    response.status(200).json(newPost);
  }
  catch(error) {
    response.status(400).json({message: error.message, name: error.name});
  }
});

router.delete('/:id', (request, response) => {
  try {
    const deletedItem = BlogPosts.delete(request.params.id);
    response.status(200).json(deletedItem);
  }
  catch(error) {
    console.log({message: error.message, name: error.name});
    response.status(400).json({message: error.message, name: error.name});
  }
});

module.exports = router;
