const uuid = require('uuid');

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const BlogPosts = {
  create: function(title, content, author, publishDate) {
    const post = {
      id: uuid.v4(),
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id=null) {
    // if id passed in, retrieve single post,
    // otherwise send all posts.
    if (id !== null) {
      return this.posts.find(post => post.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    return this.posts.sort(function(a, b) {
      return b.publishDate - a.publishDate
    });
  },
  delete: function(id) {
    const postIndex = this.posts.findIndex((post) => {
      post.id === id;
    });
    if (postIndex > -1) {
      const deleted = this.posts.splice(postIndex, 1);
      return deleted[0];
    } else {
      throw new StorageException('id does not exist');
    }
  },
  update: function(postFromRequest, routeParamId) {
    console.log('routeParamId:', routeParamId);

    // if id in postFromRequest check if matches routeParamId
    if (postFromRequest.id && (postFromRequest.id !== routeParamId)) {
      throw new StorageException(`id from request body and id from route param do not match`);
    }

    // check if id exists in data set
    const postIndex = this.posts.findIndex(post => post.id === routeParamId);
    if (postIndex === -1) {
      throw new StorageException(`Can't update item \`${routeParamId}\` because doesn't exist.`);
    }

    // merge current post with postFromRequest
    // props that exist in postFromRequest will replace properties from current post
    this.posts[postIndex] = Object.assign(this.posts[postIndex], postFromRequest);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}

module.exports = {BlogPosts: createBlogPostsModel()};