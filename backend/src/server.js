const fastify = require('fastify');
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
const rateLimit = require('@fastify/rate-limit');
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
const cookie = require('@fastify/cookie');
const multipart = require('@fastify/multipart');

/**
 * Build and configure Fastify server
 * @param {object} opts - Fastify options
 * @returns {FastifyInstance} Configured server instance
 */
async function buildServer(opts = {}) {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
    ...opts,
  });

  // Register CORS
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Register JWT
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-change-me',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  // Register cookie support
  await server.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'cookie-secret-change-me',
  });

  // Register rate limiting
  await server.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: process.env.RATE_LIMIT_WINDOW || '15 minutes',
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: process.env.REDIS_URL
      ? require('ioredis').createClient(process.env.REDIS_URL)
      : undefined,
  });

  // Register multipart for file uploads
  await server.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 1000000,
      fields: 10,
      fileSize: 10000000, // 10MB
      files: 5,
      headerPairs: 2000,
    },
  });

  // Register Swagger documentation
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'SocialDesk API',
        description: 'AI-powered creator platform API',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://github.com/socialdesk/socialdesk',
        description: 'Find more info here',
      },
      host: process.env.BACKEND_URL || 'localhost:4000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'posts', description: 'Post management endpoints' },
        { name: 'accounts', description: 'Social account connections' },
        { name: 'ai', description: 'AI generation endpoints' },
        { name: 'templates', description: 'Template marketplace' },
        { name: 'analytics', description: 'Analytics endpoints' },
        { name: 'payments', description: 'Payment and subscription endpoints' },
        { name: 'referrals', description: 'Referral system' },
      ],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your bearer token in the format: Bearer <token>',
        },
      },
    },
  });

  await server.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // JWT verification decorator
  server.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({
        error: 'Unauthorized',
        message: 'Invalid or missing token',
      });
    }
  });

  // Add user loader decorator
  server.decorate('loadUser', async function (request, reply) {
    try {
      await request.jwtVerify();
      const { query } = require('./db');
      const result = await query('SELECT id, email, username, plan, credits FROM users WHERE id = $1', [
        request.user.id,
      ]);

      if (result.rows.length === 0) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      request.currentUser = result.rows[0];
    } catch (err) {
      reply.code(401).send({
        error: 'Unauthorized',
        message: 'Invalid or missing token',
      });
    }
  });

  // Health check endpoint
  server.get('/health', async (request, reply) => {
    const { testConnection } = require('./db');
    const dbHealthy = await testConnection();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: dbHealthy ? 'connected' : 'disconnected',
    };
  });

  // Register route modules
  server.register(require('./routes/auth'), { prefix: '/api/auth' });
  server.register(require('./routes/posts'), { prefix: '/api/posts' });
  server.register(require('./routes/accounts'), { prefix: '/api/accounts' });
  server.register(require('./routes/ai'), { prefix: '/api/ai' });
  server.register(require('./routes/templates'), { prefix: '/api/templates' });
  server.register(require('./routes/analytics'), { prefix: '/api/analytics' });
  server.register(require('./routes/payments'), { prefix: '/api/payments' });
  server.register(require('./routes/referrals'), { prefix: '/api/referrals' });
  server.register(require('./routes/collaborations'), { prefix: '/api/collaborations' });

  // 404 handler
  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
    });
  });

  // Error handler
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    // Validation errors
    if (error.validation) {
      return reply.code(400).send({
        error: 'Validation Error',
        message: error.message,
        validation: error.validation,
      });
    }

    // JWT errors
    if (error.statusCode === 401) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: error.message,
      });
    }

    // Rate limit errors
    if (error.statusCode === 429) {
      return reply.code(429).send({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
      });
    }

    // Default error
    reply.code(error.statusCode || 500).send({
      error: error.name || 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
      statusCode: error.statusCode || 500,
    });
  });

  return server;
}

module.exports = buildServer;
