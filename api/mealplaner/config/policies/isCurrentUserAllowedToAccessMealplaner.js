module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const mealplanerId = ctx.params.id;

  const mealplaner = await strapi.services.mealplaner.findOne({id: mealplanerId});

  if(!mealplaner){
    ctx.throw(404, 'Not found');
  }

  return [mealplaner.owner, ...mealplaner.sharedWith]
    .some(allowedUser => strapi.config.functions.helpers.matchById(allowedUser, currentUser))
    ? next() : ctx.throw(404, "Not Found");
}
