module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const mealId = ctx.params.id;

  const meal = await strapi.services.meal.findOne({id: mealId})

  if(!meal || !meal.mealplaner) {
    return ctx.throw(404, "Meal not Found");
  }

  const mealplaner =
    await strapi.services.mealplaner.findOne({id: meal.mealplaner.id, owner: currentUser})
    || await strapi.services.mealplaner.findOne({id: meal.mealplaner.id, sharedWith: currentUser})

  if(!mealplaner) {
    return ctx.throw(400, "Meal is not in any of the mealplaners available to the user");
  }

  return next();
}


