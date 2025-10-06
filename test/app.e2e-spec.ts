// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard'; 

const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

 
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    })
    .overrideGuard(JwtAuthGuard) 
    .useValue(mockJwtAuthGuard)   
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

 
  afterAll(async () => {
    if (app) { // Buena práctica verificar si app está definida
      await app.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!'); 
  });
});