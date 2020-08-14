module.exports = async (ctx, next) => {
  if(!ctx.request.query.cookbook) {
    return ctx.unauthorized("Specify a target cookbook ?cookbook=${user.id}")
  }

  const targetCookbookIds = ctx.request.query.cookbook && Array.isArray(ctx.request.query.cookbook) ? [...ctx.request.query.cookbook] : [ctx.request.query.cookbook]

  const targetCookbooks = await Promise.all(targetCookbookIds.map(async (targetCookbookId) => await strapi.services.cookbook.findOne({id: targetCookbookId})));
  const accessibleCookbooks = targetCookbooks.filter(cookbook =>  cookbook && [cookbook.owner, ...cookbook.sharedWith].some(allowedUser => strapi.config.functions.userHelpers.match(allowedUser, ctx.state.user)));

  ctx.request.query.cookbook = accessibleCookbooks.map(cookbook => cookbook.id);

  return next();
}

