module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const recipeId = ctx.params.id;

  const recipe = await strapi.services.recipe.findOne({id: recipeId})

  if(!recipe) {
    return ctx.notFound("Not Found")
  }

  const cookbook =
    await strapi.services.cookbook.findOne({id: recipe.cookbook.id, owner: currentUser})
    || await strapi.services.cookbook.findOne({id: recipe.cookbook.id, sharedWith: ctx.state.user})

  if(!cookbook) {
    return ctx.notFound("Not Found")
  }

  return next();
}


