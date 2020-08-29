const {sanitizeEntity} = require('strapi-utils');

module.exports = {
  matchById: (entity1, entity2) => {
    if(!entity1.id || !entity2.id) {
      return false;
    }

    return entity1.id.toString() === entity2.id.toString();
  },
  mapEntityToIdAndTitle: (entity) => {
    return {
      id: entity.id,
      title: entity.title
    }
  },
  sanitizeRecipe: ({id, title, url, ingredients}) => {
    return sanitizeEntity({
      id,
      title,
      url,
      ingredients: ingredients.map(({id, unit, amount, title}) => ({id, unit, amount, title}))
    }, {model: strapi.models.recipe})
  }
}
