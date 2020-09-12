module.exports = async (ctx, next) => {
  if (ctx.request.body.owner) {
    ctx.throw(403, "Don't specify the owner");
  }
  return next();
}
