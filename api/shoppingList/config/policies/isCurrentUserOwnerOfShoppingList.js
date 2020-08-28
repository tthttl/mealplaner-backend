module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const shoppingListId = ctx.params.id;

  const shoppingList = await strapi.services.shoppinglist.findOne({id: shoppingListId});

  if(!shoppingList){
    ctx.throw(404, "Not Found")
  }

  return strapi.config.functions.userHelpers.match(shoppingList.owner, currentUser) ? next() : ctx.throw(404, "Not Found");
}
