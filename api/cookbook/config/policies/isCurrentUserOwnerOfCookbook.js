module.exports = async (ctx, next) => {
  const currentUser = ctx.state.user;
  const cookBookId = ctx.params.id;

  const cookBook = await strapi.services.cookbook.findOne({id: cookBookId});

  if(!cookBook){
    ctx.throw(404, "Not Found")
  }

  return strapi.config.functions.helpers
    .matchById(cookBook.owner, currentUser) ? next() : ctx.throw(404, "Not Found");
}
