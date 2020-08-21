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

    const targetUser = ctx.query.user;
    delete ctx.query.user;

   const ownCookbooksPromise = strapi.services.cookbook.find({...ctx.query, owner: targetUser});
   const sharedCookbooksPromise = strapi.services.cookbook.find({...ctx.query, sharedWith: targetUser});
   const [ownCookbooks, sharedCookbooks] = await Promise.all([ownCookbooksPromise, sharedCookbooksPromise])

    return [...ownCookbooks, ...sharedCookbooks]
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
