module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const shoppingListId = ctx.params.id;

  const shoppingList = await strapi.services.shoppinglist.findOne({id: shoppingListId});

  if(!shoppingList){
    ctx.throw(404, "Not Found")
  }

  return [shoppingList.owner, ...shoppingList.sharedWith].some(allowedUser => strapi.config.functions.userHelpers.match(allowedUser, currentUser))
    ? next() : ctx.throw(404, "Not Found");
}
