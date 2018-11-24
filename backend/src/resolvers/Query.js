const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  /* - parent: the parent schema
  *  - arguements that have been passed to the query
  *  - context: way to access the DB and rest of the incoming request (headers, cookies etc.)
  *  - info: info around GraphQL query coming in
  */

  // async items(parent, args, context, info) {
  //   // Getting items method from prisma.graphql generated schema
  //   const items = await context.db.query.items();
  //   return items
  // },

  // Note if query is exactly the same in prisma.graphql as required in Query,
  // you can just forward to request on to prisma, as below.
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),

  me(parent, args, ctx, info) {
    // check if current user id exists
    if(!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    // info is query coming from the client side
    }, info);
  },

  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    console.log(ctx.request.userId);
    // 2. Check if the user has the permissions to query all the users
    // TODO: When user does not have permission, seems to be throwing the error on backend but not returning error to the client.
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 2. if they do, query all the users!
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;

/**

Example query for getting number of items

query dataAboutItems {
  itemsConnection {
    aggregate {
      count
    }
  }
}

Example query for getting number of items with jacket in title

query dataAboutItems {
  itemsConnection(where: {
    title_contains: "jacket"
  }) {
    aggregate {
      count
    }
  }
}
 */