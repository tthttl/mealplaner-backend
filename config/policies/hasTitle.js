module.exports = async (ctx, next) => {
  if (!ctx.request.body.title) {
    ctx.throw(400, "Please provide a title");
  }
  return next();
}
