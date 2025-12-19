// src/tests/users.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { AppDataSource } from '../utils/app-data-source';
import { User } from '../entities/user.entity';

describe('Users Endpoints', () => {
  let testUserId: string;
 
  beforeEach(async () => {
    // Clean up and create a test user
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.clear();
    // Add a small delay to ensure cleanup completes
    await new Promise(resolve => setTimeout(resolve, 100));

    // Register a test user with unique email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'userstest',
        email: 'userstest@example.com',
        password: 'SecurePass123!',
      });

    // Add error checking
    if (!response.body.data || !response.body.data.userId) {
      console.error('Failed to register test user in beforeEach:', JSON.stringify(response.body, null, 2));
      throw new Error('Failed to register test user');
    }

    testUserId = response.body.data.userId;
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', testUserId);
      expect(response.body.data).toHaveProperty('username', 'userstest');
    });

    it('should return 404 for non-existent user', async () => {
      // Use a valid UUID format that doesn't exist
      const fakeUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/users/${fakeUuid}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('NotFoundError');
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
      expect(response.body.data).toHaveProperty('email', 'newemail@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      // Use a valid UUID format that doesn't exist
      const fakeUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .put(`/api/users/${fakeUuid}`)
        .send({
          email: 'newemail@example.com',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('NotFoundError');
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
      // Use a valid UUID format that doesn't exist
      const fakeUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).delete(`/api/users/${fakeUuid}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('NotFoundError');
    });
  });
});