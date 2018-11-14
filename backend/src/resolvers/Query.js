const { forwardTo } = require('prisma-binding');

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
  }
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