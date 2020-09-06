const isValid = require('date-fns/isValid')
const isPast = require('date-fns/isPast')
const addDays = require('date-fns/addDays')

module.exports = async (ctx, next) => {

  if (ctx.is('multipart')) {
    ctx.throw(400, "Make only  JSON requests")
  }

  if (!ctx.request.body.mealplaner) {
    ctx.throw(400, "Please provide a mealplaner");
  }
  const mealplaner =
    await strapi.services.mealplaner.findOne({id: ctx.request.body.mealplaner, owner: ctx.state.user})
    || await strapi.services.mealplaner.findOne({id: ctx.request.body.mealplaner, sharedWith: ctx.state.user})
  if (!mealplaner) {
    ctx.throw(400, "Unknown Mealplaner");
  }

  if (!ctx.request.body.type) {
    ctx.throw(400, "Please provide a meal type");
  }

  if (!["breakfast", "lunch", "dinner", "morningSnack", "afternoonSnack"].includes(ctx.request.body.type)) {
    ctx.throw(400, "Specified type does not exist");
  }

  if (!ctx.request.body.date) {
    ctx.throw(400, "Please provide a date for the meal");
  }
  const date = addDays(new Date(ctx.request.body.date), 1);
  if (!isValid(date) || isPast(date)) {
    ctx.throw(400, "Please specifiy a valid date starting from today");
  }

  if (!ctx.request.body.recipe) {
    ctx.throw(400, "Please provide a recipe id");
  }
  const recipe = await strapi.services.recipe.findOne({id: ctx.request.body.recipe});
  if (!recipe) {
    ctx.throw(404, 'Recipe not found');
  }
  const cookbook =
    await strapi.services.cookbook.findOne({id: recipe.cookbook, owner: ctx.state.user})
    || await strapi.services.cookbook.findOne({id: recipe.cookbook, sharedWith: ctx.state.user})
  if (!cookbook) {
    ctx.throw(404, 'Recipe not found');
  }

  return next();
}

