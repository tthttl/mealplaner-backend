module.exports = async (ctx, next) => {
  if(!ctx.state.user){
    return ctx.unauthorized("Unauthorized")
  }

  const targetUser = ctx.request.query.owner || ctx.request.query.sharedWith;

  if(!targetUser) {
    return ctx.unauthorized("Specify a target user equal to your own id ?user=${user.id} or ?sharedWith=${user.id}")
  }

  const loggedInUser = ctx.state.user.id;

  if (loggedInUser.toString() !== targetUser.toString()) {
    return ctx.unauthorized("Target user does not match logged in user");
  }

  return next();
}
