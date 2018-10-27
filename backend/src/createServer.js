const { GraphQLServer } = require('graphql-yoga');

// Resolvers answer 2 questions:
//  - Where does this data come from? (Pull data with Query)
//  - Where does this data go? (Push data with Mutation)
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');

// Create GraphQl Yoga Server
function createServer() {
  return new GraphQLServer({
    // The server will match up everything in the schema with a query or a resolver
    typeDefs: './src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    // Expose the db to every request
    context: req => ({ ...req, db }),
  })
}

module.exports = createServer;
