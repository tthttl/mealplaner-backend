module.exports = async (ctx, next) => {

  if (ctx.is('multipart')) {
    ctx.throw(400, "Make only  JSON requests")
  }

  if (!ctx.request.body.title) {
    ctx.throw(400, "Please provide a title");
  }

  if (!ctx.request.body.shoppinglist) {
    ctx.throw(400, "Please provide a shoppingList");
  }

  if (!ctx.request.body.amount) {
    ctx.throw(400, "Please provide an amount");
  }

  if (!ctx.request.body.unit) {
    ctx.throw(400, "Please provide an unit");
  }

  if (!["kg", "g", "tableSpoon", "coffeeSpoon", "l", "dl", "ml", "pinch", "piece"].includes(ctx.request.body.unit)) {
    ctx.throw(400, "Specified unit does not exist");
  }

  const shoppingList =
    await strapi.services.shoppinglist.findOne({id: ctx.request.body.shoppinglist, owner: ctx.state.user})
    || await strapi.services.shoppinglist.findOne({id: ctx.request.body.shoppinglist, sharedWith: ctx.state.user})

  if (!shoppingList) {
    ctx.throw(400, "Unknown Cookbook");
  }

  return next();
}
