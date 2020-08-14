'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const {sanitizeEntity} = require('strapi-utils');

module.exports = {
  async find(ctx) {

    const user = ctx.query.user;
    delete ctx.query.user;

   const entitiesOwner = strapi.services.cookbook.find({...ctx.query, owner: user});
   const entitiesShared = strapi.services.cookbook.find({...ctx.query, sharedWith: user});
   const entities = await Promise.all([entitiesOwner, entitiesShared])

    return [...entities[0], ...entities[1]]
      .map(entity => sanitizeEntity(entity, {model: strapi.models.cookbook}))
      .map(({id, title}) => ({id, title}));
  },
  async findOne(ctx) {
    const {id, title} = await strapi.services.cookbook.findOne({id: ctx.params.id});
    return sanitizeEntity({id, title}, {model: strapi.models.cookbook});
  },
  async create(ctx) {
    if (ctx.is('multipart')) {
      ctx.throw(400, "Only make JSON requests")
    }

    if (ctx.request.body.owner) {
      ctx.throw(403, "Don't specify the owner");
    }

    if (!ctx.request.body.title) {
      ctx.throw(400, "Please provide a title");
    }

    const {id, title} = await strapi.services.cookbook.create({...ctx.request.body, owner: ctx.state.user, sharedWith: []});

    return sanitizeEntity({id, title}, {model: strapi.models.cookbook});
  },
  async update(ctx) {
    if (ctx.request.body.owner) {
      ctx.throw(403, "Don't overwrite the Owner");
    }

    if (ctx.is('multipart')) {
      ctx.throw(400, "Only make JSON requests");
    }

    const {id, title} = await strapi.services.cookbook.update({ id:  ctx.params.id }, {...ctx.request.body, owner: ctx.state.user});

    return sanitizeEntity({id, title} , { model: strapi.models.cookbook });
  },
  async delete(ctx) {
    await strapi.services.cookbook.delete({ id: ctx.params.id });
    return 'DELETED';
  },
};
