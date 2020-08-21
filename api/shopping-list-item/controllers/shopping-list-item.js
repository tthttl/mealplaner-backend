'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require('strapi-utils');


const sanitizeShoppingListItem = ({id, title, amount, unit}) => {
  return sanitizeEntity({
    id,
    title,
    amount,
    unit
  }, {model: strapi.models['shopping-list-item']})
}

module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services['shopping-list-item'].search({...ctx.query});
    } else {
      entities = await strapi.services['shopping-list-item'].find({...ctx.query});
    }
    return entities
      .map(entity => sanitizeShoppingListItem(entity))
  },
  async findOne(ctx) {
    const entity = await strapi.services['shopping-list-item'].findOne({id: ctx.params.id});
    return sanitizeShoppingListItem(entity);
  },
  async create(ctx) {
    const entity = await strapi.services['shopping-list-item'].create({...ctx.request.body});
    return sanitizeShoppingListItem(entity);
  },
  async update(ctx) {
    const  entity = await strapi.services['shopping-list-item'].update({ id: ctx.params.id }, ctx.request.body);
    return sanitizeShoppingListItem(entity);
  },
  async delete(ctx) {
    await strapi.services['shopping-list-item'].delete({ id: ctx.params.id });
    return 'DELETED';
  },
};
