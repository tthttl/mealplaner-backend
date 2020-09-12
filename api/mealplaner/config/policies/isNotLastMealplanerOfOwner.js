module.exports = async (ctx, next) => {
  const mealplaners = await strapi.services.mealplaner.find({owner: ctx.state.user});
  return mealplaners.length > 1 ? next() : ctx.throw(400, 'Do not delete your last mealplaner');
}
