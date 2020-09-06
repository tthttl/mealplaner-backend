'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const targetUser = ctx.query.user;
    delete ctx.query.user;

    const ownMealplaners = await strapi.services.mealplaner.find({...ctx.query, owner: targetUser});
    const sharedMealplaners = await strapi.services.mealplaner.find({...ctx.query, sharedWith: targetUser});

    return [...ownMealplaners, ...sharedMealplaners]
      .map((mealplaner) => strapi.config.functions.helpers.sanitizeToTitleAndId(mealplaner));
  },
  async findOne(ctx){
    const mealplaner = await strapi.services.mealplaner.findOne({id: ctx.params.id});
    return strapi.config.functions.helpers.sanitizeToTitleAndId(mealplaner);
  },
  async create(ctx) {
    const entity = await strapi.services.mealplaner.create({...ctx.request.body, owner: ctx.state.user, sharedWith: []});
    return strapi.config.functions.helpers.sanitizeToTitleAndId(entity);
  },
  async update(ctx) {
    const entity = await strapi.services.mealplaner.update({ id:  ctx.params.id }, {...ctx.request.body, owner: ctx.state.user});
    return strapi.config.functions.helpers.sanitizeToTitleAndId(entity);
  },
  async delete(ctx) {
    await strapi.services.mealplaner.delete({ id: ctx.params.id });
    return 'DELETED';
  },

};
