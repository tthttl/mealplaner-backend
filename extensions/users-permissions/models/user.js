module.exports = {
  lifecycles: {
    async afterCreate(user) {
      await strapi.services.cookbook.create({title: '', owner: user});
      await strapi.services.shoppinglist.create({title: '', owner: user});
      await strapi.services.mealplaner.create({title: '', owner: user});
    }
  }
}
