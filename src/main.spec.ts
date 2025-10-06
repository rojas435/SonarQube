import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

describe('Main bootstrap', () => {
  let useGlobalPipes: jest.Mock;
  let listen: jest.Mock;

  beforeEach(() => {
    useGlobalPipes = jest.fn();
    listen = jest.fn();

    jest.spyOn(NestFactory, 'create').mockResolvedValue({
      useGlobalPipes,
      listen,
    } as any);

    // Mock SwaggerModule.createDocument with a valid OpenAPIObject
    jest.spyOn(SwaggerModule, 'createDocument').mockReturnValue({
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
      },
      paths: {},
    } as any);

    jest.spyOn(SwaggerModule, 'setup').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap the application and setup Swagger', async () => {
    await import('./main');

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        validatorOptions: expect.objectContaining({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      }),
    );
    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'api',
      expect.anything(),
      expect.anything(),
    );
    expect(listen).toHaveBeenCalledWith(process.env.PORT ?? 3000);
  });
});