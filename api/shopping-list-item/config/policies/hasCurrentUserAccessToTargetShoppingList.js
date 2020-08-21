module.exports = async (ctx, next) => {
  const targetShoppingListId = ctx.request.query['shoppinglist'];

  if(!targetShoppingListId) {
    return ctx.unauthorized("Specify a target shopping-list ?shopping-list=${id}")
  }

  if(Array.isArray(targetShoppingListId)) {
    return ctx.unauthorized("Specify only one target shoppinglist at the time")
  }

  const targetShoppingList = await strapi.services.shoppinglist.findOne({id: targetShoppingListId});

  if(!targetShoppingList) {
    return ctx.send([]);
  }

  return [targetShoppingList.owner, ...targetShoppingList.sharedWith].some(allowedUser => strapi.config.functions.userHelpers.match(allowedUser, ctx.state.user)) ?
    next() : ctx.send([]);
}
