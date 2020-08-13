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
      entities = await strapi.services.cookbook.search({...ctx.query, users: user});
    } else {
      entities = await strapi.services.cookbook.find({...ctx.query, users: user});
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.cookbook }));
  },
};
