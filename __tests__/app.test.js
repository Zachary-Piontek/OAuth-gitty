const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');
  
describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    // console.log(res.header.location);
    expect(res.header.location).toMatch(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  });

  // // stretch test :)
  // it('should redirect to the github oauth page upon login', async () => {
  //   const res = await request(app).get('/api/v1/github/login');
  
  //   expect(res.header.location).toMatch(
  //     /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
  //   );
  // });
      
  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
      
    // console.log(res);
    console.log(res.body);
    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('delete user session(logout)', async () => {
    const resp = await request(app).delete('/api/v1/github/sessions');
    console.log(resp.status);
    expect(resp.status).toBe(204);
  });

  it('unauthenticated users no access to posts', async () => {
    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toEqual(401);
  });

  it('return posts to users logged in', async () => {
    // need to init agent to access user
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42');
    // const res = await request
    // .agent(app)
    // .get('/api/v1/posts')
    // .redirects(1);
    const res = await
    agent.get('/api/v1/posts');
    console.log(res.body);
    expect(res.body.length).toEqual(1);
  });

  it('create new post', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42');
    // remember agent(app) is not function for .post
    const res = await agent.post('/api/v1/posts').send({ id:4, post: 'trailer park boys' });
    console.log(res.body);
    expect(res.body).toEqual({
      id: expect.any(String),
      post: expect.any(String),
    });
  });
      
  afterAll(() => {
    pool.end();
  });
      
});


