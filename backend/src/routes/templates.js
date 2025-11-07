/**
 * Templates marketplace routes
 */

const templatesController = require('../controllers/templatesController');

async function templatesRoutes(fastify, options) {
  // List templates
  fastify.get(
    '/',
    {
      schema: {
        description: 'List marketplace templates',
        tags: ['templates'],
      },
    },
    templatesController.list
  );

  // Get template by ID
  fastify.get('/:id', templatesController.getById);

  // Purchase template
  fastify.post(
    '/:id/purchase',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Purchase a template',
        tags: ['templates'],
        security: [{ Bearer: [] }],
      },
    },
    templatesController.purchase
  );

  // Create template (creator)
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate, fastify.loadUser],
      schema: {
        description: 'Create a new template',
        tags: ['templates'],
        security: [{ Bearer: [] }],
      },
    },
    templatesController.create
  );
}

module.exports = templatesRoutes;
