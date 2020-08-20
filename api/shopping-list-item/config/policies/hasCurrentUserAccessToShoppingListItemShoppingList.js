module.exports = async (ctx, next) => {
  console.log('here');
  const currentUser = ctx.state.user;
  const shoppingListItemId = ctx.params.id;

  const shoppingListItem = await strapi.services['shopping-list-item'].findOne({id: shoppingListItemId})

  if(!shoppingListItem) {
    return ctx.notFound("Not Found")
  }

  console.log(shoppingListItem.shoppinglist.id);

  const shoppingList =
    await strapi.services.shoppinglist.findOne({id: shoppingListItem.shoppinglist.id, owner: currentUser})
    || await strapi.services.shoppinglist.findOne({id: shoppingListItem.shoppinglist.id, sharedWith: currentUser})

  if(!shoppingList) {
    return ctx.notFound("Not Found")
  }

  return next();
}
