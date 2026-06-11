import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Address (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/address/divisions', () => {
    it('should return an array of divisions', () => {
      return request(app.getHttpServer())
        .get('/api/v1/address/divisions')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('GET /api/v1/address/divisions/:id/districts', () => {
    it('should return districts for a valid division', () => {
      return request(app.getHttpServer())
        .get('/api/v1/address/divisions/1/districts')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('GET /api/v1/address/districts/:id/upazilas', () => {
    it('should return upazilas for a valid district', () => {
      return request(app.getHttpServer())
        .get('/api/v1/address/districts/1/upazilas')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });
});
