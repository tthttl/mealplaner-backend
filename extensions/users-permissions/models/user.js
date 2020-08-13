module.exports = {
  lifecycles: {
    async afterCreate(user, ) {
      await strapi.services.cookbook.create({title: '', owner: user});
    }
  }
}
