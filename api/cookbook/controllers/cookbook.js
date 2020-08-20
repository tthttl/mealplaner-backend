'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const {sanitizeEntity} = require('strapi-utils');

const sanitizeCookbook = ({id, title}) => {
  return sanitizeEntity({id, title}, {model: strapi.models.cookbook})
}

module.exports = {
  async find(ctx) {

    const user = ctx.query.user;
    delete ctx.query.user;

   const entitiesOwner = strapi.services.cookbook.find({...ctx.query, owner: user});
   const entitiesShared = strapi.services.cookbook.find({...ctx.query, sharedWith: user});
   const entities = await Promise.all([entitiesOwner, entitiesShared])

    return [...entities[0], ...entities[1]]
      .map(entity => sanitizeCookbook(entity))
  },
  async findOne(ctx) {
    const entity = await strapi.services.cookbook.findOne({id: ctx.params.id});
    return sanitizeCookbook(entity);
  },
  async create(ctx) {
    const entity = await strapi.services.cookbook.create({...ctx.request.body, owner: ctx.state.user, sharedWith: []});
    return sanitizeCookbook(entity);
  },
  async update(ctx) {
    const entity = await strapi.services.cookbook.update({ id:  ctx.params.id }, {...ctx.request.body, owner: ctx.state.user});
    return sanitizeCookbook(entity);
  },
  async delete(ctx) {
    await strapi.services.cookbook.delete({ id: ctx.params.id });
    return 'DELETED';
  },
};
