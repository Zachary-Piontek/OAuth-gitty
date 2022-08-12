const { Router } = require('express');
const Posts = require('../models/Post');
const authenticate = require('../middleware/auth');


module.exports = Router()

  .get('/', authenticate, async (req, res, next) => {
    try {
      const post = await Posts.getAllPosts();
      res.json(post);
    } catch (e) {
      next (e);
    }

  });
