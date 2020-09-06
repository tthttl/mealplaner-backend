module.exports = async (ctx, next) => {
  if (ctx.is('multipart')) {
    ctx.throw(400, "Only make JSON requests")
  }
  return next();
}
