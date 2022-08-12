/* eslint-disable no-console */
const changingCodeIntoToken = async (code) => {
  console.log(`MOCK INVOKED: changingCodeIntoToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};
  
const githubProfile = async (token) => {
  console.log(`MOCK INVOKED: githubProfile(${token})`);
  return {
    login: 'fake_github_user',
    avatar_url: 'https://www.placecage.com/gif/300/300',
    email: 'not-real@example.com',
  };
};
  
module.exports = { changingCodeIntoToken, githubProfile };
