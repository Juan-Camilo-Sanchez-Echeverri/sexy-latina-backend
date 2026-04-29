import { INestApplication } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('API Sexy Latina')
  .setDescription('The API for Sexy Latina application')
  .setVersion('1.0.0')
  .addGlobalResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        status: { type: 'number' },
        message: { type: 'string' },
      },
    },
    example: {
      code: 'internal-server-error',
      status: 500,
      message: 'Internal server error',
    },
  })
  .addBearerAuth()
  .build();

const swaggerDocOptions: SwaggerDocumentOptions = {
  ignoreGlobalPrefix: false,
  operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
};

export const setupSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocOptions,
  );

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
    },
  });
};
