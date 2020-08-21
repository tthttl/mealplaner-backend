module.exports = async (ctx, next) => {
  const cookBooksOfUser = await strapi.services.cookbook.find({owner: ctx.state.user});
  return cookBooksOfUser.length > 1 ? next() : ctx.throw(400, 'Do not delete your last cookbook');
}
