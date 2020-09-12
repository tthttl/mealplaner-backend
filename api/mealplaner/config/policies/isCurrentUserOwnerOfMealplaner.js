module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const mealplanerId = ctx.params.id;

  const mealplaner = await strapi.services.mealplaner.findOne({id: mealplanerId});

  if(!mealplaner){
    ctx.throw(404, "Not Found")
  }

  return strapi.config.functions.helpers
    .matchById(mealplaner.owner, currentUser) ? next() : ctx.throw(404, "Not Found");
}
