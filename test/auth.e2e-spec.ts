import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          phone: `017${Date.now()}`.slice(0, 15),
          email: uniqueEmail,
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('User registered successfully');
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.user.password).toBeUndefined();
        });
    });

    it('should fail with duplicate phone', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          phone: '01700000000',
          email: 'another@example.com',
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail with missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ name: 'Test' })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should fail with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'wrongpass' })
        .expect(401);
    });
  });
});
