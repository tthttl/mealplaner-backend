'use strict';

const {sanitizeRecipe} = require("../../../config/functions/helpers");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.recipe.search({...ctx.query});
    } else {
      entities = await strapi.services.recipe.find({...ctx.query});
    }
    return entities
      .map(entity => sanitizeRecipe(entity))
  },
  async findOne(ctx) {
    const entity = await strapi.services.recipe.findOne({ id: ctx.params.id });
    return sanitizeRecipe(entity);
  },
  async create(ctx) {
    const entity = await strapi.services.recipe.create({...ctx.request.body});
    return sanitizeRecipe(entity);
  },
  async update(ctx) {
    const  entity = await strapi.services.recipe.update({ id: ctx.params.id }, ctx.request.body);
    return sanitizeRecipe(entity);
  },
  async delete(ctx) {
    await strapi.services.recipe.delete({ id: ctx.params.id });
    return 'DELETED';
  },
};
