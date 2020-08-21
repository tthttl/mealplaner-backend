'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require('strapi-utils');

const sanitizeShoppingList = ({id, title}) => {
  return sanitizeEntity({id, title}, {model: strapi.models.shoppinglist})
}


module.exports = {
  async find(ctx) {

    const user = ctx.query.user;
    delete ctx.query.user;

    const ownShoppingListsPromise = strapi.services.shoppinglist.find({...ctx.query, owner: user});
    const sharedShoppingListsPromise = strapi.services.shoppinglist.find({...ctx.query, sharedWith: user});
    const [ownShoppingLists, sharedShoppingLists] = await Promise.all([ownShoppingListsPromise, sharedShoppingListsPromise])

    console.log(ownShoppingLists);

    return [...ownShoppingLists, ...sharedShoppingLists]
      .map(entity => sanitizeShoppingList(entity))
  },
  async findOne(ctx) {
    const entity = await strapi.services.shoppinglist.findOne({id: ctx.params.id});
    return sanitizeShoppingList(entity);
  },
  async create(ctx) {
    const entity = await strapi.services.shoppinglist.create({...ctx.request.body, owner: ctx.state.user, sharedWith: []});
    return sanitizeShoppingList(entity);
  },
  async update(ctx) {
    const entity = await strapi.services.shoppinglist.update({ id:  ctx.params.id }, {...ctx.request.body, owner: ctx.state.user});
    return sanitizeShoppingList(entity);
  },
  async delete(ctx) {
    await strapi.services.shoppinglist.delete({ id: ctx.params.id });
    return 'DELETED';
  },
};
