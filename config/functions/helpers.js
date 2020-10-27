const {sanitizeEntity} = require('strapi-utils');

module.exports = {
  matchById: (entity1, entity2) => {
    if(!entity1.id || !entity2.id) {
      return false;
    }

    return entity1.id.toString() === entity2.id.toString();
  },
  sanitizeToTitleAndId: (entity) => {
    return {
      id: entity.id,
      title: entity.title
    }
  },
  sanitizeRecipe: ({id, title, url, ingredients, cookbook}) => {
    return sanitizeEntity({
      id,
      title,
      url,
      cookbookId: cookbook.id,
      ingredients: ingredients.map(({id, unit, amount, title, isStapleFood}) => ({id, unit, amount, title, isStapleFood}))
    }, {model: strapi.models.recipe})
  }
}
