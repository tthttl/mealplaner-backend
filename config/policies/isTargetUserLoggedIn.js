module.exports = async (ctx, next) => {
  const targetUserId = ctx.request.query.user;

  if(!targetUserId) {
    return ctx.unauthorized("Specify a target user equal to your own id ?user=${user.id}")
  }

  if (ctx.state.user.id.toString() !== targetUserId.toString()) {
    return ctx.unauthorized("Target user does not match logged in user");
  }

  return next();
}
