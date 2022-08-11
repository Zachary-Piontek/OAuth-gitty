const { Router } = require('express');
const { changingCodeIntoToken, githubProfile } = require('../services/github');
const authenticate = require('../middleware/auth');
const GithubUser = require('../models/GithubUser');
const jwt = require('jsonwebtoken');
const convertsDayToMilliseconds = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`);
  })

  .get('/callback', async (req, res, next) => {

    try {

      const { code } = req.query;
      const token = await changingCodeIntoToken(code);
      //   res.json({ token });
      const profile = await githubProfile(token);
      //   res.json({ profile });
      let user = await GithubUser.findByUsername(profile.login);

      if (!user) {
        user = await GithubUser.insert({
          username: profile.login,
          email: profile.email,
          avatar: profile.avatar_url,
        });
      }

      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: convertsDayToMilliseconds,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (error) {
      next(error);
    }
  })

  

  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  })


;
