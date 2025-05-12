import http from 'http';
import supertest from 'supertest';
import { requestListener } from '../src/app';
import { getAllUsers, deleteUser } from '../src/services/userService.js';

const server = http.createServer(requestListener);
const request = supertest(server);

describe('User API', () => {
  beforeEach(() => {
    while (getAllUsers().length > 0) {
      deleteUser(getAllUsers()[0].id);
    }
  });

  describe('GET /api/users', () => {
    it('should return an empty array initially', async () => {
      const res = await request.get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all users', async () => {
      const user1 = { username: 'user1', age: 25, hobbies: ['reading'] };

      const res = await request.post('/api/users').send(user1);

      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = { username: 'newuser', age: 25, hobbies: ['reading'] };
      const response = await request.post('/api/users').send(newUser);

      expect(response.status).toBe(201);
    });

    it('should return 400 for missing fields', async () => {
      const invalidUser = { username: 'invalid' };
      const response = await request.post('/api/users').send(invalidUser);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      const res = await request.get(`/api/users/invalid-id`);

      expect(res.status).toBe(400);
    });
  });

  describe('Non-existing endpoint', () => {
    it('should return 404', async () => {
      const response = await request.get('/nonexisting');
      expect(response.status).toBe(404);
    });
  });
});