const { Router } = require('express');
const { changingCodeIntoToken } = require('../services/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`);
  })

  .get('/callback', async (req, res, next) => {

    try {

      const { code } = req.query;
      const token = await changingCodeIntoToken(code);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  })


;
