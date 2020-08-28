module.exports = async (ctx, next) => {
  const shoppingListsOfUser = await strapi.services.shoppinglist.find({owner: ctx.state.user});
  return shoppingListsOfUser.length > 1 ? next() : ctx.throw(400, 'Do not delete your last shopping list');
}
