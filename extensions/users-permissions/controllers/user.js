const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = ({id, username, email, provider} ) =>
  sanitizeEntity({id, username, email, provider} , {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }

    ctx.body = sanitizeUser(user);
  },
}
