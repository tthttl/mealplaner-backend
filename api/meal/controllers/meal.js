'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require('strapi-utils');
const {sanitizeRecipe} = require("../../../config/functions/helpers");

const sanitizeMeal = ({id, type, date, recipe}) => {
  return sanitizeEntity({
    id,
    type,
    date,
    recipe: sanitizeRecipe(recipe)
  }, {model: strapi.models.meal})
}

module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.meal.search({...ctx.query});
    } else {
      entities = await strapi.services.meal.find({...ctx.query});
    }
    return entities.map(entity => sanitizeMeal(entity));
  },
  async findOne(ctx) {
    const entity = await strapi.services.meal.findOne({ id: ctx.params.id });
    return sanitizeMeal(entity);
  },
  async create(ctx) {
    const entity = await strapi.services.meal.create({...ctx.request.body});
    return sanitizeMeal(entity);
  },
  async update(ctx) {
    const  entity = await strapi.services.meal.update({ id: ctx.params.id }, ctx.request.body);
    return sanitizeMeal(entity);
  },
  async delete(ctx) {
    await strapi.services.meal.delete({ id: ctx.params.id });
    return 'DELETED';
  },
};
