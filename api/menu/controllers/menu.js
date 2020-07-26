'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async find(ctx) {
    let entities;
    const {user} = ctx.state;

    if (ctx.query._q) {
      entities = await strapi.services.menu.search({...ctx.query, user});
    } else {
      entities = await strapi.services.menu.find({...ctx.query, user});
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.menu }));
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const {user} = ctx.state;

    const entity = await strapi.services.menu.findOne({ id, user });
    return sanitizeEntity(entity, { model: strapi.models.menu });
  },

  async create(ctx) {
    if (ctx.is('multipart')) {
      ctx.throw(400, 'Please use json payload')
    }

    const {user} = ctx.state;
    const {body} = ctx.request;

    if (!body || !body.name) {
      ctx.throw(400, "backendError.provideField.name")
    }

    const entity = await strapi.services.menu.create({...body, user});

    return sanitizeEntity(entity, { model: strapi.models.menu });
  },

  async update(ctx) {
    if (ctx.is('multipart')) {
      ctx.throw(400, 'Please use json payload')
    }

    const { id } = ctx.params;
    const { user } = ctx.state;
    const {body} = ctx.request;

    if (!body || !body.name) {
      ctx.throw(400, "backendError.provideField.name")
    }

    const entity = await strapi.services.menu.update({ id, user }, body);


    return sanitizeEntity(entity, { model: strapi.models.menu });
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const entity = await strapi.services.menu.delete({ id, user });
    return sanitizeEntity(entity, { model: strapi.models.menu });
  },
};
