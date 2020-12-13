module.exports = async (ctx, next) => {

  if (!ctx.request.body.title) {
    ctx.throw(400, "Please provide a title");
  }

  if (!ctx.request.body.cookbook) {
    ctx.throw(400, "Please provide a cookbook");
  }

  if (ctx.request.body.ingredients && !Array.isArray(ctx.request.body.ingredients)) {
    ctx.throw(400, "Ingredients must be iterable");
  }

  ctx.request.body.ingredients && ctx.request.body.ingredients.forEach(ingredient => {
    if (!ingredient.title) {
      ctx.throw(400, "Please provide a title for each ingredient");
    }

    if (!ingredient.amount) {
      ctx.throw(400, "Please provide an amount for each ingredient");
    }

    if (!ingredient.unit) {
      ctx.throw(400, "Please provide an unit for each ingredient");
    }

    if (!["kg", "g", "tableSpoon", "coffeeSpoon", "l", "dl", "ml", "pinch", "piece", "pack"].includes(ingredient.unit)) {
      ctx.throw(400, "Specified unit does not exist");
    }

    if (typeof ingredient.isStapleFood === 'undefined') {
      ctx.throw(400, "Please provide if is isStapleFood for each ingredient");
    }
  })

  const cookbook =
    await strapi.services.cookbook.findOne({id: ctx.request.body.cookbook, owner: ctx.state.user})
    || await strapi.services.cookbook.findOne({id: ctx.request.body.cookbook, sharedWith: ctx.state.user})

  if (!cookbook) {
    ctx.throw(400, "Unknown Cookbook");
  }

  return next();
}

