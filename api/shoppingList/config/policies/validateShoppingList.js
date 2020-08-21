module.exports = async (ctx, next) => {
  if (ctx.is('multipart')) {
    ctx.throw(400, "Only make JSON requests")
  }

  if (ctx.request.body.owner) {
    ctx.throw(403, "Don't specify the owner");
  }

  if (!ctx.request.body.title) {
    ctx.throw(400, "Please provide a title");
  }

  return next();
}
