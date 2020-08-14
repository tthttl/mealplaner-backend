'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const {sanitizeEntity} = require('strapi-utils');


module.exports = {
  async find(ctx) {
    if(ctx.request.query.cookbook.length === 0) {
      return [];
    }
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.recipe.search({...ctx.query});
    } else {
      entities = await strapi.services.recipe.find({...ctx.query});
    }
    return entities
      .map(entity => sanitizeEntity(entity, {model: strapi.models.recipe}))
      .map(({id, title, url, ingredients}) => {
        return {id, title, url, ingredients: ingredients.map(({id, unit, amount, title}) => ({id, unit, amount, title}))}
      });
  },
  async create(ctx) {
    const {id, title, url, ingredients} = await strapi.services.recipe.create({...ctx.request.body});

    return sanitizeEntity({id, title, url,  ingredients: ingredients.map(({id, unit, amount, title}) => ({id, unit, amount, title}))}, {model: strapi.models.recipe});
  },
};
