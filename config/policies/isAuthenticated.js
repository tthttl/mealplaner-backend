module.exports = async (ctx, next) => {
  if(ctx.state.user){
    return next()
  } else {
    return ctx.unauthorized("Unauthorized")
  }
}
