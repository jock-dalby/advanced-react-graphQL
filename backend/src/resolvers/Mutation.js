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
  },

  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    // remove the ID from updates because is not something that can be updated
    delete updates.id
    // run the update method
    // ctx is the context in the request
    // db is how we expose the prisma db within the context
    // access queries or mutations that are generated and available within prisma.graphql i.e. updateItem
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      },
      // pass in info as second arg so updateItem knows what to return
      // as this will include the query which is sent from clientside
      info
    })
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id};
    // find the item. Write raw graphQl for what we want intermediary query to return for our server side checks
    const item = await ctx.db.query.item({ where }, `{ id, title }`)

    // TODO check if user is owner of item, or have permissions

    // delete item
    // pass in client side graphQl for what we want final query to return to client
    return ctx.db.mutation.deleteItem({ where }, info)
  }
};

module.exports = Mutations;
