// src/tests/users.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { AppDataSource } from '../utils/app-data-source';
import { User } from '../entities/user.entity';

describe('Users Endpoints', () => {
  let testUserId: number;
 
  beforeEach(async () => {
    // Clean up and create a test user
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.clear();

    // Register a test user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123!',
      });

    testUserId = response.body.data.userId;
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', testUserId);
      expect(response.body.data).toHaveProperty('username', 'testuser');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user successfully', async () => {
      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send({
          email: 'newemail@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/99999')
        .send({
          email: 'newemail@example.com',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user successfully', async () => {
      const response = await request(app).delete(`/api/users/${testUserId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).delete('/api/users/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});