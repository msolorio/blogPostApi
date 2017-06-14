const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const { BlogPosts } = require('../models');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    BlogPosts.create({title: 'blog post1', author: 'sam', content: 'some content'});
  });

  afterEach(function() {
    blogPosts = BlogPosts.get();
    BlogPosts.delete(blogPosts[0].id);
  });

  // each it has it's own .then
  it('should list blog posts on GET', function() {

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);

        res.should.be.json;
        res.body.should.be.a('array');

        res.body.length.should.be.at.least(1);
      });
  });

  it('should add blog post on POST', function() {

    const newBlogPost = {title: 'blog post2', author: 'Jon', content: 'some more content'};

    return chai.request(app)
      .post('/blog-posts')
      .send(newBlogPost)

      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');

        res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
        res.body.id.should.not.be.null;

        res.body.should.deep.equal(Object.assign(newBlogPost, {id: res.body.id, publishDate: res.body.publishDate}));
      });
  });

  it('should update blog post on PUT', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        const blogPostUpdate = {title: 'blog post3', author: 'kim', content: 'updated content', id: res.body[0].id};

        return chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(blogPostUpdate)
          .then(function(res) {
            res.should.have.status(200)
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'title', 'author', 'content', 'publishDate');
            res.body.id.should.not.be.null;
            res.body.should.deep.equal(Object.assign(blogPostUpdate, {publishDate: res.body.publishDate}));
          });
      })
  });

  it('should remove item on DELETE', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      const objectToDelete = res.body[0];
      
      return chai.request(app)
        .delete(`/blog-posts/${objectToDelete.id}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'author', 'content', 'publishDate');
          res.body.id.should.not.be.null;
          res.body.should.deep.equal(objectToDelete);
        });  
    });
  });

});
