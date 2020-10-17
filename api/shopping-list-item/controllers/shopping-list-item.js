'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require('strapi-utils');


const sanitizeShoppingListItem = ({id, title, shoppingList, order, amount, unit}) => {
  return sanitizeEntity({
    id,
    title,
    order,
    shoppingList: shoppingList.id,
    amount,
    unit
  }, {model: strapi.models['shopping-list-item']})
}

module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services['shopping-list-item'].search({...ctx.query, _sort: 'order:desc'});
    } else {
      entities = await strapi.services['shopping-list-item'].find({...ctx.query, _sort: 'order:desc'});
    }
    return entities
      .map(entity => sanitizeShoppingListItem(entity))
  },
  async findOne(ctx) {
    const entity = await strapi.services['shopping-list-item'].findOne({id: ctx.params.id});
    return sanitizeShoppingListItem(entity);
  },
  async create(ctx) {
    const currentHighestRankedItem = await strapi.services['shopping-list-item'].findOne({shoppingList: ctx.request.body.shoppingList, _sort: 'order:desc'});
    const order = currentHighestRankedItem ? currentHighestRankedItem.order + 1 : 0;
    const entity = await strapi.services['shopping-list-item'].create({...ctx.request.body, order});
    return sanitizeShoppingListItem(entity);
  },
  async update(ctx) {
    const  entity = await strapi.services['shopping-list-item'].update({ id: ctx.params.id }, ctx.request.body);
    return sanitizeShoppingListItem(entity);
  },
  async delete(ctx) {
    await strapi.services['shopping-list-item'].delete({ id: ctx.params.id });
    return {DELETED: true};
  },
};
