const fetch = require('cross-fetch');
// why cross-fetch instead of fetch???

const changingCodeIntoToken = async (code) => {
  const client_id = process.env.GH_CLIENT_ID;
  const client_secret = process.env.GH_CLIENT_SECRET;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ client_id, client_secret, code }),
  });

  // turning into javascript
  const res = await response.json();
  return res.access_token;
};

const githubProfile = async (token) => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  
  return response.json();
};
  

module.exports = { changingCodeIntoToken, githubProfile };
