module.exports = async (ctx, next) => {
  return ctx.state.user ? next() : ctx.unauthorized("Unauthorized");
}
