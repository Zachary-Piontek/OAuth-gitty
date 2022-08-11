const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
  
describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    console.log(res.header.location);
    expect(res.header.location).toMatch(
      'https://github.com/login/oauth/authorize?client_id=7524060cc5a16f129bc4&scope=user&redirect_uri=http://localhost:7890/api/v1/github/callback'
    );
  });
      
  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
        
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
      
  afterAll(() => {
    pool.end();
  });
      
});


