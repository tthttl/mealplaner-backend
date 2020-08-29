'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {

    const targetUser = ctx.query.user;
    delete ctx.query.user;

   const ownCookbooksPromise = strapi.services.cookbook.find({...ctx.query, owner: targetUser});
   const sharedCookbooksPromise = strapi.services.cookbook.find({...ctx.query, sharedWith: targetUser});
   const [ownCookbooks, sharedCookbooks] = await Promise.all([ownCookbooksPromise, sharedCookbooksPromise])

    return [...ownCookbooks, ...sharedCookbooks]
      .map(entity => strapi.config.functions.helpers.mapEntityToIdAndTitle(entity))
  },
  async findOne(ctx) {
    const entity = await strapi.services.cookbook.findOne({id: ctx.params.id});
    return strapi.config.functions.helpers.mapEntityToIdAndTitle(entity);
  },
  async create(ctx) {
    const entity = await strapi.services.cookbook.create({...ctx.request.body, owner: ctx.state.user, sharedWith: []});
    return strapi.config.functions.helpers.mapEntityToIdAndTitle(entity);
  },
  async update(ctx) {
    const entity = await strapi.services.cookbook.update({ id:  ctx.params.id }, {...ctx.request.body, owner: ctx.state.user});
    return strapi.config.functions.helpers.mapEntityToIdAndTitle(entity);
  },
  async delete(ctx) {
    await strapi.services.cookbook.delete({ id: ctx.params.id });
    return 'DELETED';
  },
};
