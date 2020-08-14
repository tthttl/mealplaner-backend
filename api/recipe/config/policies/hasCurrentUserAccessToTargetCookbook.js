module.exports = async (ctx, next) => {
  const targetCookBookId = ctx.request.query.cookbook

  if(!targetCookBookId) {
    return ctx.unauthorized("Specify a target cookbook ?cookbook=${user.id}")
  }

  if(Array.isArray(targetCookBookId)) {
    return ctx.unauthorized("Specify only one target cookbook at the time")
  }

  const targetCookbook = await strapi.services.cookbook.findOne({id: targetCookBookId});

  if(!targetCookbook) {
    ctx.send([]);
  }

  return [targetCookbook.owner, ...targetCookbook.sharedWith].some(allowedUser => strapi.config.functions.userHelpers.match(allowedUser, ctx.state.user)) ?
    next() : ctx.send([]);
}

