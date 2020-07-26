'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.i18n.search(ctx.query);
    } else {
      entities = await strapi.services.i18n.find(ctx.query);
    }

    return entities
      .map(entity => sanitizeEntity(entity, { model: strapi.models.i18n }))
      .map(model => ({lang: model.lang, translations: model.translations}));
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.i18n.findOne({ lang: id });
    const model = sanitizeEntity(entity, { model: strapi.models.i18n });
    return {lang: model.lang, translations: model.translations};
  },
};
