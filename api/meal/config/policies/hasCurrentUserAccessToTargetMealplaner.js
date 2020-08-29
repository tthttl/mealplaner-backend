module.exports = async (ctx, next) => {
  const mealplanerId = ctx.request.query.mealplaner;

  if(!mealplanerId) {
    return ctx.unauthorized("Specify a target mealplaner ?mealplanerId=${mealplaner.id}")
  }

  if(Array.isArray(mealplanerId)) {
    return ctx.unauthorized("Specify only one target mealplaner at the time")
  }

  const targetMealplaner = await strapi.services.mealplaner.findOne({id: mealplanerId});

  if(!targetMealplaner) {
    return ctx.send([]);
  }

  return [targetMealplaner.owner, ...targetMealplaner.sharedWith]
    .some(allowedUser => strapi.config.functions.helpers.matchById(allowedUser, ctx.state.user)) ?
    next() : ctx.send([]);
}

