const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if they are logged in

    // 1. context.db is how to access the prisma DB from withing GraphQL layer.
    // 2. The info arg contains the original query which is passed to the DB
    // to specify which data is returned from the DB when new item is created.
    // 3. The DB will return a Promise so need to make createItem and 'async' method and specify the 'await' keyword
    const item = await context.db.mutation.createItem(
      { data:{ ...args } },
      info
    );

    return item;
    // If returning the Promise directly no need to use 'await' keyword. e.g. return context.db.....
    // Good to save off to a variable though so if debugging at a later stage it is easy to log out the item.
  }
};

module.exports = Mutations;
