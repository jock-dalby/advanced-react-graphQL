const { forwardTo } = require('prisma-binding');

const Query = {
  /* - parent: the parent schema
  *  - arguements that have been passed to the query
  *  - context: way to access the DB and rest of the incoming request (headers, cookies etc.)
  *  - info: info around GraphQL query coming in
  */

  async items(parent, args, context, info) {
    // Getting items method from prisma.graphql generated schema
    const items = await context.db.query.items();
    return items
  },

  // Note if query is exactly the same in prisma.graphql as required in Query,
  // you can just forward to request on to prisma, as below.
  // items: forwardTo('db')
  item: forwardTo('db'),
};

module.exports = Query;
