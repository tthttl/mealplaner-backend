module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const shoppingListItemId = ctx.params.id;

  const shoppingListItem = await strapi.services['shopping-list-item'].findOne({id: shoppingListItemId})

  if(!shoppingListItem) {
    return ctx.notFound("Not Found")
  }

  const shoppingList =
    await strapi.services.shoppinglist.findOne({id: shoppingListItem.shoppingList.id, owner: currentUser})
    || await strapi.services.shoppinglist.findOne({id: shoppingListItem.shoppingList.id, sharedWith: currentUser})

  if(!shoppingList) {
    return ctx.notFound("Not Found")
  }

  return next();
}
