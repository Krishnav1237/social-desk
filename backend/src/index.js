require('dotenv').config();
const buildServer = require('./server');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Start the server
 */
async function start() {
  let server;

  try {
    // Build server instance
    server = await buildServer();

    // Test database connection
    const { testConnection } = require('./db');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Start listening
    await server.listen({ port: PORT, host: HOST });

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 SocialDesk API Server                                ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                   ║
║   Server:      http://${HOST}:${PORT}                     ║
║   Docs:        http://${HOST}:${PORT}/docs                ║
║   Health:      http://${HOST}:${PORT}/health              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n${signal} received, shutting down gracefully...`);
        try {
          await server.close();
          console.log('Server closed');
          process.exit(0);
        } catch (err) {
          console.error('Error during shutdown:', err);
          process.exit(1);
        }
      });
    });
  } catch (err) {
    console.error('Error starting server:', err);
    if (server) {
      await server.close();
    }
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
start();
